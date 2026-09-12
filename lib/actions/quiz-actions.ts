'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth/session';
import { getQuizById } from '@/lib/content';
import { scoreQuiz, type QuizAnswer } from '@/lib/grading/logic';
import { setProgress, touchStudySession, updateTopicStats } from '@/lib/progress/service';
import { syncAchievements } from '@/lib/achievements';
import { INITIAL_REVIEW } from '@/lib/srs/logic';

const answerSchema = z.union([
  z.string(),
  z.array(z.string()),
  z.boolean(),
  z.record(z.string(), z.string()),
  z.null(),
]);

const submitSchema = z.object({
  quizId: z.string(),
  answers: z.record(z.string(), answerSchema),
  durationMs: z.number().min(0).max(3_600_000),
  source: z.enum(['quiz', 'review', 'exam']).default('quiz'),
});

/**
 * Проверка теоретического теста.
 * Ответы проверяются на сервере: клиент не знает правильных вариантов
 * до отправки — иначе тест не имел бы смысла.
 */
export async function submitQuiz(input: z.infer<typeof submitSchema>) {
  const user = await requireUser();
  const parsed = submitSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: 'Некорректные ответы' };

  const quiz = await getQuizById(parsed.data.quizId);
  if (!quiz) return { ok: false as const, error: 'Тест не найден' };

  const score = scoreQuiz(quiz, parsed.data.answers as Record<string, QuizAnswer>);

  await prisma.quizAttempt.create({
    data: {
      userId: user.id,
      quizId: quiz.id,
      answersJson: JSON.stringify(parsed.data.answers),
      resultJson: JSON.stringify(score.results),
      score: score.score,
      maxScore: score.maxScore,
      correctCount: score.correctCount,
      totalCount: score.totalCount,
      durationMs: Math.round(parsed.data.durationMs),
      source: parsed.data.source,
    },
  });

  await setProgress(user.id, 'quiz', quiz.id, {
    status: score.passed ? 'completed' : 'in_progress',
    score: score.percent,
    addAttempt: true,
  });

  await updateTopicStats(user.id, quiz.topicIds, {
    quizCorrect: score.correctCount,
    quizTotal: score.totalCount,
  });

  await touchStudySession(user.id, { quizzesTaken: 1, theoryMinutes: Math.max(1, Math.round(parsed.data.durationMs / 60000)) });

  // Проваленный тест отправляет темы в повторение (раздел 18 ТЗ).
  if (!score.passed) {
    for (const topicId of quiz.topicIds) {
      const existing = await prisma.reviewItem.findUnique({
        where: { userId_topicId: { userId: user.id, topicId } },
      });
      if (!existing) {
        await prisma.reviewItem.create({
          data: { userId: user.id, topicId, reason: 'failed_quiz', dueAt: new Date(), ...INITIAL_REVIEW },
        });
      }
    }
  }

  const unlocked = await syncAchievements(user.id);

  revalidatePath(`/quiz/${quiz.id}`);
  revalidatePath('/');

  return {
    ok: true as const,
    score: score.score,
    maxScore: score.maxScore,
    percent: score.percent,
    passed: score.passed,
    correctCount: score.correctCount,
    totalCount: score.totalCount,
    results: score.results,
    unlocked: unlocked.map((item) => ({ code: item.code, title: item.title, icon: item.icon })),
  };
}
