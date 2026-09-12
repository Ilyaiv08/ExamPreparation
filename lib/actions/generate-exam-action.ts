'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth/session';
import { getTasks } from '@/lib/content';
import { generateExam, type PracticeDomainId } from '@/lib/exam/generator';
import { getTopicStats } from '@/lib/progress/service';
import { rankWeakTopics } from '@/lib/progress/logic';
import type { ExamLevel } from '@/content/types';

/**
 * Создание тренировочного варианта (раздел 22 ТЗ).
 * Спецификация варианта сохраняется целиком, чтобы попытку можно было
 * открыть повторно и увидеть те же задания.
 */
export async function createGeneratedExam(formData: FormData) {
  const user = await requireUser();

  const level = (String(formData.get('level') ?? 'standard') as ExamLevel) ?? 'standard';
  const domainId = String(formData.get('domain') ?? 'courses') as PracticeDomainId;
  const onlyStudied = String(formData.get('onlyStudied') ?? '') === 'on';

  const [tasks, stats, submissions] = await Promise.all([
    getTasks(),
    getTopicStats(user.id),
    prisma.submission.findMany({ where: { userId: user.id, passed: true }, select: { taskId: true } }),
  ]);

  if (!tasks.length) return { ok: false as const, error: 'В базе пока нет заданий для генерации варианта' };

  const weakTopicIds = rankWeakTopics(
    stats.map((stat) => ({
      topicId: stat.topicId,
      attempts: stat.attempts,
      solved: stat.solved,
      failed: stat.failed,
      hintsUsed: stat.hintsUsed,
      quizCorrect: stat.quizCorrect,
      quizTotal: stat.quizTotal,
      totalTimeMs: stat.totalTimeMs,
      lastAttemptAt: stat.lastAttemptAt,
      lastSuccessAt: stat.lastSuccessAt,
    })),
    new Date(),
    8,
  ).map((item) => item.topicId);

  // «Только пройденный материал»: ограничиваем месяцем текущего дня программы.
  const daysPassed = Math.max(
    0,
    Math.floor((Date.now() - user.startDate.getTime()) / 86_400_000),
  );
  const currentMonth = Math.min(7, Math.floor(daysPassed / 28) + 1);

  const exam = generateExam(tasks, {
    level,
    domainId,
    weakTopicIds,
    solvedTaskIds: submissions.map((item) => item.taskId),
    maxMonthNo: onlyStudied ? currentMonth : undefined,
  });

  const row = await prisma.generatedExam.create({
    data: {
      userId: user.id,
      title: exam.title,
      level,
      specJson: JSON.stringify({ ...exam, id: '' }),
    },
  });

  // Идентификатор варианта — это идентификатор записи в базе.
  const stored = { ...exam, id: row.id };
  await prisma.generatedExam.update({ where: { id: row.id }, data: { specJson: JSON.stringify(stored) } });

  redirect(`/exams/${row.id}?generated=1`);
}
