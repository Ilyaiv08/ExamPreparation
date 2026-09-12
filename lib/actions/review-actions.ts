'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth/session';
import { nextReview, type ReviewGrade } from '@/lib/srs/logic';
import { touchStudySession } from '@/lib/progress/service';
import { syncAchievements } from '@/lib/achievements';

/**
 * Отметка результата повторения.
 * Интервал до следующего показа считает алгоритм из lib/srs/logic.
 */
export async function gradeReview(topicId: string, grade: ReviewGrade) {
  const user = await requireUser();
  const item = await prisma.reviewItem.findUnique({
    where: { userId_topicId: { userId: user.id, topicId } },
  });
  if (!item) return { ok: false as const, error: 'Карточка повторения не найдена' };

  const next = nextReview(
    {
      ease: item.ease,
      intervalDays: item.intervalDays,
      repetitions: item.repetitions,
      lapses: item.lapses,
      dueAt: item.dueAt,
    },
    grade,
  );

  await prisma.reviewItem.update({
    where: { id: item.id },
    data: {
      ease: next.ease,
      intervalDays: next.intervalDays,
      repetitions: next.repetitions,
      lapses: next.lapses,
      dueAt: next.dueAt,
      lastReviewedAt: new Date(),
      lastGrade: grade,
    },
  });

  await touchStudySession(user.id, { theoryMinutes: 2 });
  const unlocked = await syncAchievements(user.id);

  revalidatePath('/review');
  revalidatePath('/');

  return {
    ok: true as const,
    intervalDays: next.intervalDays,
    dueAt: next.dueAt.toISOString(),
    unlocked: unlocked.map((achievement) => ({ code: achievement.code, title: achievement.title, icon: achievement.icon })),
  };
}
