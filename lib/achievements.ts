import 'server-only';

import { prisma } from '@/lib/db';
import { ACHIEVEMENTS } from '@/content/achievements';
import { MONTHS } from '@/content/curriculum';
import { computeStreak } from '@/lib/progress/logic';
import type { AchievementDef } from '@/content/types';

/**
 * Достижения (раздел 25 ТЗ).
 *
 * Условия считаются по реальным данным, а не по счётчику «нажатий»:
 * задача считается решённой, только если все её тесты прошли.
 */

export interface AchievementSnapshot {
  tasksSolved: number;
  noHintsSolved: number;
  perfectQuizzes: number;
  examAttempts: number;
  bestExamPercent: number;
  projectsCompleted: number;
  reviewsDone: number;
  streak: number;
  completedMonths: number[];
  courseCompleted: boolean;
}

export async function buildSnapshot(userId: string): Promise<AchievementSnapshot> {
  const [submissions, quizAttempts, examAttempts, projects, reviewItems, sessions, progress] = await Promise.all([
    prisma.submission.findMany({ where: { userId, passed: true }, select: { taskId: true, hintsUsed: true } }),
    prisma.quizAttempt.findMany({ where: { userId }, select: { score: true, maxScore: true } }),
    prisma.examAttempt.findMany({ where: { userId, status: 'finished' }, select: { percent: true } }),
    prisma.projectSubmission.findMany({ where: { userId, status: 'completed' }, select: { projectId: true } }),
    prisma.reviewItem.findMany({ where: { userId }, select: { repetitions: true } }),
    prisma.studySession.findMany({ where: { userId }, select: { date: true, theoryMinutes: true, practiceMinutes: true, tasksAttempted: true, quizzesTaken: true, lessonsDone: true } }),
    prisma.progress.findMany({ where: { userId, status: 'completed' }, select: { entityType: true, entityId: true } }),
  ]);

  const solvedTasks = new Set(submissions.map((item) => item.taskId));
  const noHintTasks = new Set(submissions.filter((item) => item.hintsUsed === 0).map((item) => item.taskId));

  const activeDates = sessions
    .filter((s) => s.theoryMinutes + s.practiceMinutes + s.tasksAttempted + s.quizzesTaken + s.lessonsDone > 0)
    .map((s) => s.date);

  const completedDayIds = new Set(
    progress.filter((row) => row.entityType === 'day').map((row) => row.entityId),
  );
  const completedMonths = MONTHS.filter((month) => {
    const days = month.weeks.flatMap((week) => week.days);
    return days.length > 0 && days.every((day) => completedDayIds.has(day.id));
  }).map((month) => month.monthNo);

  return {
    tasksSolved: solvedTasks.size,
    noHintsSolved: noHintTasks.size,
    perfectQuizzes: quizAttempts.filter((item) => item.maxScore > 0 && item.score >= item.maxScore).length,
    examAttempts: examAttempts.length,
    bestExamPercent: examAttempts.reduce((best, item) => Math.max(best, item.percent), 0),
    projectsCompleted: new Set(projects.map((item) => item.projectId)).size,
    reviewsDone: reviewItems.reduce((sum, item) => sum + item.repetitions, 0),
    streak: computeStreak(activeDates),
    completedMonths,
    courseCompleted: completedMonths.length === MONTHS.length,
  };
}

export function isUnlocked(def: AchievementDef, snapshot: AchievementSnapshot): boolean {
  switch (def.rule.type) {
    case 'tasks_solved':
      return snapshot.tasksSolved >= def.rule.count;
    case 'no_hints_solved':
      return snapshot.noHintsSolved >= def.rule.count;
    case 'quiz_perfect':
      return snapshot.perfectQuizzes >= def.rule.count;
    case 'exam_taken':
      return snapshot.examAttempts >= def.rule.count;
    case 'exam_percent':
      return snapshot.bestExamPercent >= def.rule.percent;
    case 'project_completed':
      return snapshot.projectsCompleted >= def.rule.count;
    case 'review_done':
      return snapshot.reviewsDone >= def.rule.count;
    case 'streak_days':
      return snapshot.streak >= def.rule.count;
    case 'month_completed':
      return snapshot.completedMonths.includes(def.rule.monthNo);
    case 'course_completed':
      return snapshot.courseCompleted;
    default:
      return false;
  }
}

/** Прогресс к достижению в процентах — чтобы было видно, сколько осталось. */
export function achievementProgress(def: AchievementDef, snapshot: AchievementSnapshot): { current: number; target: number } {
  switch (def.rule.type) {
    case 'tasks_solved':
      return { current: snapshot.tasksSolved, target: def.rule.count };
    case 'no_hints_solved':
      return { current: snapshot.noHintsSolved, target: def.rule.count };
    case 'quiz_perfect':
      return { current: snapshot.perfectQuizzes, target: def.rule.count };
    case 'exam_taken':
      return { current: snapshot.examAttempts, target: def.rule.count };
    case 'exam_percent':
      return { current: snapshot.bestExamPercent, target: def.rule.percent };
    case 'project_completed':
      return { current: snapshot.projectsCompleted, target: def.rule.count };
    case 'review_done':
      return { current: snapshot.reviewsDone, target: def.rule.count };
    case 'streak_days':
      return { current: snapshot.streak, target: def.rule.count };
    case 'month_completed':
      return { current: snapshot.completedMonths.includes(def.rule.monthNo) ? 1 : 0, target: 1 };
    case 'course_completed':
      return { current: snapshot.courseCompleted ? 1 : 0, target: 1 };
    default:
      return { current: 0, target: 1 };
  }
}

/**
 * Проверяет условия и записывает новые достижения.
 * Возвращает только те, что открылись именно сейчас — чтобы показать уведомление.
 */
export async function syncAchievements(userId: string): Promise<AchievementDef[]> {
  const snapshot = await buildSnapshot(userId);
  const existing = await prisma.userAchievement.findMany({ where: { userId }, select: { code: true } });
  const have = new Set(existing.map((item) => item.code));

  const newlyUnlocked: AchievementDef[] = [];
  for (const def of ACHIEVEMENTS) {
    if (have.has(def.code)) continue;
    if (!isUnlocked(def, snapshot)) continue;
    await prisma.userAchievement.create({ data: { userId, code: def.code, progress: 100 } });
    newlyUnlocked.push(def);
  }
  return newlyUnlocked;
}
