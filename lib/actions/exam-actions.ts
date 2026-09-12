'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth/session';
import { getExamById, getQuizById, getTaskById } from '@/lib/content';
import { analyzeAttempt, examMaxScore, initialModuleState, type ModuleState } from '@/lib/exam/service';
import { scoreQuiz, type QuizAnswer } from '@/lib/grading/logic';
import { touchStudySession } from '@/lib/progress/service';
import { syncAchievements } from '@/lib/achievements';
import type { Exam } from '@/content/types';

/**
 * Экзаменационный режим (разделы 20, 43 ТЗ).
 *
 * Таймеры модулей хранятся на сервере: перезагрузка страницы или закрытие
 * вкладки не «останавливает» экзамен — как и на настоящем демоэкзамене.
 */

export async function startExam(examId: string, mode: 'practice' | 'demo' | 'final', generatedExamId?: string) {
  const user = await requireUser();
  const exam = await resolveExam(examId, generatedExamId, user.id);
  if (!exam) return { ok: false as const, error: 'Вариант экзамена не найден' };

  // Незавершённая попытка того же варианта продолжается, а не создаётся заново.
  const existing = await prisma.examAttempt.findFirst({
    where: { userId: user.id, examId, status: 'in_progress' },
    orderBy: { startedAt: 'desc' },
  });
  if (existing) return { ok: true as const, attemptId: existing.id, resumed: true };

  const attempt = await prisma.examAttempt.create({
    data: {
      userId: user.id,
      examId,
      generatedExamId: generatedExamId ?? null,
      mode,
      status: 'in_progress',
      modulesJson: JSON.stringify(initialModuleState(exam)),
      maxScore: examMaxScore(exam),
    },
  });

  return { ok: true as const, attemptId: attempt.id, resumed: false };
}

/** Запуск таймера конкретного модуля. */
export async function startModule(attemptId: string, moduleId: string) {
  const user = await requireUser();
  const attempt = await prisma.examAttempt.findFirst({ where: { id: attemptId, userId: user.id } });
  if (!attempt || attempt.status !== 'in_progress') return { ok: false as const, error: 'Попытка не активна' };

  const exam = await resolveExam(attempt.examId, attempt.generatedExamId ?? undefined, user.id);
  if (!exam) return { ok: false as const, error: 'Вариант не найден' };

  const modules = JSON.parse(attempt.modulesJson) as ModuleState[];
  const target = modules.find((item) => item.moduleId === moduleId);
  const definition = exam.modules.find((item) => item.id === moduleId);
  if (!target || !definition) return { ok: false as const, error: 'Модуль не найден' };
  if (target.startedAt) return { ok: true as const, modules };

  const now = new Date();
  target.startedAt = now.toISOString();
  target.endsAt = new Date(now.getTime() + definition.minutes * 60_000).toISOString();

  await prisma.examAttempt.update({
    where: { id: attempt.id },
    data: { modulesJson: JSON.stringify(modules) },
  });

  revalidatePath(`/exams/run/${attemptId}`);
  return { ok: true as const, modules };
}

export async function finishModule(attemptId: string, moduleId: string) {
  const user = await requireUser();
  const attempt = await prisma.examAttempt.findFirst({ where: { id: attemptId, userId: user.id } });
  if (!attempt) return { ok: false as const, error: 'Попытка не найдена' };

  const modules = JSON.parse(attempt.modulesJson) as ModuleState[];
  const target = modules.find((item) => item.moduleId === moduleId);
  if (target) {
    target.finished = true;
    if (!target.startedAt) target.startedAt = new Date().toISOString();
  }

  await prisma.examAttempt.update({ where: { id: attempt.id }, data: { modulesJson: JSON.stringify(modules) } });
  revalidatePath(`/exams/run/${attemptId}`);
  return { ok: true as const, modules };
}

const answerSchema = z.object({
  attemptId: z.string(),
  examTaskId: z.string(),
  kind: z.enum(['code', 'quiz', 'checklist']),
  answer: z.unknown(),
});

/** Сохранение ответа. Вызывается автоматически — ответы не теряются. */
export async function saveExamAnswer(input: z.infer<typeof answerSchema>) {
  const user = await requireUser();
  const parsed = answerSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: 'Некорректный ответ' };

  const attempt = await prisma.examAttempt.findFirst({ where: { id: parsed.data.attemptId, userId: user.id } });
  if (!attempt || attempt.status !== 'in_progress') return { ok: false as const, error: 'Экзамен уже завершён' };

  const exam = await resolveExam(attempt.examId, attempt.generatedExamId ?? undefined, user.id);
  if (!exam) return { ok: false as const, error: 'Вариант не найден' };

  const examTask = exam.modules.flatMap((module) => module.tasks).find((task) => task.id === parsed.data.examTaskId);
  if (!examTask) return { ok: false as const, error: 'Задание не найдено' };

  const graded = await gradeExamTask(examTask, parsed.data.answer);

  await prisma.examTaskAnswer.upsert({
    where: { attemptId_examTaskId: { attemptId: attempt.id, examTaskId: examTask.id } },
    create: {
      attemptId: attempt.id,
      examTaskId: examTask.id,
      kind: parsed.data.kind,
      answerJson: JSON.stringify(parsed.data.answer ?? null),
      resultJson: JSON.stringify(graded.result ?? {}),
      score: graded.score,
      maxScore: examTask.points,
      passed: graded.passed,
    },
    update: {
      answerJson: JSON.stringify(parsed.data.answer ?? null),
      resultJson: JSON.stringify(graded.result ?? {}),
      score: graded.score,
      maxScore: examTask.points,
      passed: graded.passed,
    },
  });

  return { ok: true as const, score: graded.score, maxScore: examTask.points, passed: graded.passed };
}

export async function finishExam(attemptId: string) {
  const user = await requireUser();
  const attempt = await prisma.examAttempt.findFirst({
    where: { id: attemptId, userId: user.id },
    include: { answers: true },
  });
  if (!attempt) return { ok: false as const, error: 'Попытка не найдена' };

  const exam = await resolveExam(attempt.examId, attempt.generatedExamId ?? undefined, user.id);
  if (!exam) return { ok: false as const, error: 'Вариант не найден' };

  const analysis = analyzeAttempt(
    exam,
    attempt.answers.map((answer) => ({
      examTaskId: answer.examTaskId,
      kind: answer.kind,
      score: answer.score,
      maxScore: answer.maxScore,
      passed: answer.passed,
      answerJson: answer.answerJson,
      resultJson: answer.resultJson,
    })),
  );

  const score = attempt.answers.reduce((sum, answer) => sum + answer.score, 0);
  const maxScore = examMaxScore(exam);
  const percent = maxScore ? Math.round((score / maxScore) * 100) : 0;
  const durationSec = Math.round((Date.now() - attempt.startedAt.getTime()) / 1000);

  await prisma.examAttempt.update({
    where: { id: attempt.id },
    data: {
      status: 'finished',
      finishedAt: new Date(),
      score: Math.round(score * 100) / 100,
      maxScore,
      percent,
      durationSec,
      analysisJson: JSON.stringify(analysis),
    },
  });

  await touchStudySession(user.id, { practiceMinutes: Math.min(240, Math.round(durationSec / 60)) });
  await syncAchievements(user.id);

  revalidatePath('/exams');
  revalidatePath('/');
  redirect(`/exams/attempts/${attempt.id}`);
}

export async function abortExam(attemptId: string) {
  const user = await requireUser();
  await prisma.examAttempt.updateMany({
    where: { id: attemptId, userId: user.id, status: 'in_progress' },
    data: { status: 'aborted', finishedAt: new Date() },
  });
  revalidatePath('/exams');
  redirect('/exams');
}

// ───────────────────────────── Вспомогательное ─────────────────────────────

async function resolveExam(examId: string, generatedExamId: string | undefined, userId: string): Promise<Exam | null> {
  if (generatedExamId) {
    const row = await prisma.generatedExam.findFirst({ where: { id: generatedExamId, userId } });
    if (!row) return null;
    try {
      return JSON.parse(row.specJson) as Exam;
    } catch {
      return null;
    }
  }
  return (await getExamById(examId)) ?? null;
}

async function gradeExamTask(
  examTask: Exam['modules'][number]['tasks'][number],
  answer: unknown,
): Promise<{ score: number; passed: boolean; result: unknown }> {
  if (examTask.kind === 'checklist') {
    const checked = (answer && typeof answer === 'object' ? (answer as Record<string, boolean>) : {}) ?? {};
    const score = examTask.items.reduce((sum, item) => sum + (checked[item.id] ? item.points : 0), 0);
    return { score, passed: score >= examTask.points, result: { checked } };
  }

  if (examTask.kind === 'quiz') {
    const quiz = await getQuizById(examTask.quizId);
    if (!quiz) return { score: 0, passed: false, result: {} };
    const result = scoreQuiz(quiz, (answer ?? {}) as Record<string, QuizAnswer>);
    const share = result.maxScore ? result.score / result.maxScore : 0;
    return { score: Math.round(share * examTask.points * 100) / 100, passed: result.passed, result };
  }

  // kind === 'code': из песочницы приходит отчёт по тестам.
  const task = await getTaskById(examTask.taskId);
  if (!task) return { score: 0, passed: false, result: {} };

  const payload = (answer ?? {}) as { results?: { id: string; passed: boolean }[]; code?: string };
  const knownTests = new Map(task.tests.map((test) => [test.id, test]));
  const results = (payload.results ?? []).filter((item) => knownTests.has(item.id));

  const totalPoints = task.tests.reduce((sum, test) => sum + (test.points ?? 1), 0);
  const earned = results.reduce((sum, item) => sum + (item.passed ? (knownTests.get(item.id)?.points ?? 1) : 0), 0);
  const share = totalPoints ? earned / totalPoints : 0;

  return {
    score: Math.round(share * examTask.points * 100) / 100,
    passed: results.length === task.tests.length && results.every((item) => item.passed),
    result: { results, code: payload.code?.slice(0, 20000) },
  };
}
