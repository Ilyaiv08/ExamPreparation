'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth/session';
import { getTaskById } from '@/lib/content';
import { setProgress, touchStudySession, updateTopicStats } from '@/lib/progress/service';
import { scoreSubmission } from '@/lib/grading/logic';
import { syncAchievements } from '@/lib/achievements';
import { INITIAL_REVIEW } from '@/lib/srs/logic';
import type { TestResult } from '@/lib/runner/types';

/**
 * Сохранение результатов практики.
 *
 * Код выполняется в браузере (раздел 8 ТЗ запрещает запуск на сервере
 * без изоляции), поэтому сюда приходит уже готовый отчёт о тестах.
 * Сервер пересчитывает БАЛЛ самостоятельно — по числу пройденных тестов
 * и количеству открытых подсказок, а не доверяет присланной оценке.
 */

const testResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  passed: z.boolean(),
  points: z.number(),
  hidden: z.boolean(),
  durationMs: z.number(),
  input: z.string().optional(),
  expected: z.string().optional(),
  actual: z.string().optional(),
  message: z.string().optional(),
  error: z.boolean().optional(),
});

const submitSchema = z.object({
  taskId: z.string(),
  code: z.string().max(200_000),
  results: z.array(testResultSchema).max(200),
  runtimeMs: z.number().min(0).max(600_000),
  source: z.enum(['task', 'exam', 'project', 'review']).default('task'),
  examAttemptId: z.string().optional(),
});

export async function saveDraft(taskId: string, code: string, language: string, hintsUsed: number) {
  const user = await requireUser();
  if (code.length > 200_000) return { ok: false, error: 'Слишком большой файл' };

  await prisma.codeDraft.upsert({
    where: { userId_taskId: { userId: user.id, taskId } },
    create: { userId: user.id, taskId, code, language, hintsUsed },
    update: { code, language, hintsUsed },
  });
  return { ok: true, savedAt: new Date().toISOString() };
}

export async function revealHint(taskId: string, level: number) {
  const user = await requireUser();
  const task = await getTaskById(taskId);
  if (!task) return { ok: false, error: 'Задание не найдено' };

  const draft = await prisma.codeDraft.findUnique({ where: { userId_taskId: { userId: user.id, taskId } } });
  const hintsUsed = Math.max(draft?.hintsUsed ?? 0, level);

  await prisma.codeDraft.upsert({
    where: { userId_taskId: { userId: user.id, taskId } },
    create: { userId: user.id, taskId, code: draft?.code ?? task.starterCode, language: task.runtime, hintsUsed },
    update: { hintsUsed },
  });

  const hint = task.hints.find((item) => item.level === level);
  return { ok: true, hintsUsed, penaltyPercent: hint?.penaltyPercent ?? 0 };
}

export async function submitSolution(input: z.infer<typeof submitSchema>) {
  const user = await requireUser();
  const parsed = submitSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: 'Некорректные данные попытки' };

  const task = await getTaskById(parsed.data.taskId);
  if (!task) return { ok: false as const, error: 'Задание не найдено' };

  const draft = await prisma.codeDraft.findUnique({
    where: { userId_taskId: { userId: user.id, taskId: task.id } },
  });
  const hintsUsed = draft?.hintsUsed ?? 0;

  // Сопоставляем присланные результаты с описанием тестов задания:
  // засчитываются только тесты, которые действительно есть в задании.
  const knownTests = new Map(task.tests.map((test) => [test.id, test]));
  const results: TestResult[] = parsed.data.results
    .filter((result) => knownTests.has(result.id))
    .map((result) => ({
      ...result,
      points: knownTests.get(result.id)?.points ?? 1,
      hidden: Boolean(knownTests.get(result.id)?.hidden),
    }));

  const score = scoreSubmission({ results, maxScore: task.maxScore, hintsUsed, hints: task.hints });
  const allTestsCovered = results.length === task.tests.length;
  const passed = allTestsCovered && score.passed;

  const previousAttempts = await prisma.submission.count({ where: { userId: user.id, taskId: task.id } });

  const submission = await prisma.submission.create({
    data: {
      userId: user.id,
      taskId: task.id,
      attemptNo: previousAttempts + 1,
      language: task.runtime,
      code: parsed.data.code,
      passed,
      passedTests: score.passedTests,
      totalTests: task.tests.length,
      score: score.score,
      maxScore: task.maxScore,
      hintsUsed,
      runtimeMs: Math.round(parsed.data.runtimeMs),
      resultJson: JSON.stringify({ results, notes: [] }),
      source: parsed.data.source,
      examAttemptId: parsed.data.examAttemptId,
    },
  });

  await setProgress(user.id, 'task', task.id, {
    status: passed ? 'completed' : 'in_progress',
    score: score.score,
    addAttempt: true,
  });

  await updateTopicStats(user.id, task.topicIds, {
    attempt: true,
    solved: passed,
    hintsUsed,
    timeMs: Math.round(parsed.data.runtimeMs),
  });

  await touchStudySession(user.id, {
    tasksAttempted: 1,
    tasksSolved: passed ? 1 : 0,
    practiceMinutes: Math.max(1, Math.round(task.estimatedMinutes / 3)),
  });

  // Провалы подряд отправляют тему в повторение (раздел 18 ТЗ).
  if (!passed) {
    const recentFailures = await prisma.submission.count({
      where: { userId: user.id, taskId: task.id, passed: false },
    });
    if (recentFailures >= 3) {
      for (const topicId of task.topicIds) {
        const existing = await prisma.reviewItem.findUnique({
          where: { userId_topicId: { userId: user.id, topicId } },
        });
        if (!existing) {
          await prisma.reviewItem.create({
            data: { userId: user.id, topicId, reason: 'failed_task', dueAt: new Date(), ...INITIAL_REVIEW },
          });
        }
      }
    }
  }

  const unlocked = passed ? await syncAchievements(user.id) : [];

  revalidatePath(`/tasks/${task.id}`);
  revalidatePath('/tasks');
  revalidatePath('/');

  return {
    ok: true as const,
    submissionId: submission.id,
    attemptNo: submission.attemptNo,
    passed,
    score: score.score,
    maxScore: task.maxScore,
    percent: score.percent,
    passedTests: score.passedTests,
    totalTests: task.tests.length,
    hintPenalty: score.hintPenalty,
    unlocked: unlocked.map((item) => ({ code: item.code, title: item.title, icon: item.icon })),
  };
}

/** Сброс задания: очищает черновик и возвращает стартовый код. */
export async function resetTask(taskId: string) {
  const user = await requireUser();
  const task = await getTaskById(taskId);
  if (!task) return { ok: false, error: 'Задание не найдено' };

  await prisma.codeDraft
    .delete({ where: { userId_taskId: { userId: user.id, taskId } } })
    .catch(() => undefined);
  return { ok: true, starterCode: task.starterCode };
}
