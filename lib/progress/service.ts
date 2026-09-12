import 'server-only';
import { cache } from 'react';

import { prisma } from '@/lib/db';
import { dateKey } from '@/lib/utils';
import type { ProgressStatus } from './logic';
import { computeStreak, currentDayIndex, longestStreak } from './logic';
import { ALL_DAYS } from '@/content/curriculum';

/**
 * Работа с прогрессом в базе. Чистые вычисления живут в ./logic,
 * здесь — только чтение и запись.
 */

export type EntityType = 'lesson' | 'day' | 'week' | 'month' | 'topic' | 'task' | 'project' | 'exam' | 'quiz';

export interface ProgressRecord {
  entityType: string;
  entityId: string;
  status: ProgressStatus;
  score: number | null;
  bestScore: number | null;
  attempts: number;
  timeSpentSec: number;
  completedAt: Date | null;
  updatedAt: Date;
}

export const getProgressRecords = cache(async (userId: string): Promise<ProgressRecord[]> => {
  const rows = await prisma.progress.findMany({ where: { userId } });
  return rows.map((row) => ({
    entityType: row.entityType,
    entityId: row.entityId,
    status: row.status as ProgressStatus,
    score: row.score,
    bestScore: row.bestScore,
    attempts: row.attempts,
    timeSpentSec: row.timeSpentSec,
    completedAt: row.completedAt,
    updatedAt: row.updatedAt,
  }));
});

/** Карта «тип:идентификатор» → запись прогресса. */
export const getProgressMap = cache(async (userId: string): Promise<Map<string, ProgressRecord>> => {
  const rows = await getProgressRecords(userId);
  return new Map(rows.map((row) => [`${row.entityType}:${row.entityId}`, row]));
});

export async function setProgress(
  userId: string,
  entityType: EntityType,
  entityId: string,
  patch: {
    status?: ProgressStatus;
    score?: number;
    addAttempt?: boolean;
    addTimeSec?: number;
  },
): Promise<void> {
  const existing = await prisma.progress.findUnique({
    where: { userId_entityType_entityId: { userId, entityType, entityId } },
  });

  const status = patch.status ?? (existing?.status as ProgressStatus | undefined) ?? 'in_progress';
  const bestScore =
    patch.score !== undefined
      ? Math.max(patch.score, existing?.bestScore ?? 0)
      : (existing?.bestScore ?? null);

  const data = {
    status,
    score: patch.score ?? existing?.score ?? null,
    bestScore,
    attempts: (existing?.attempts ?? 0) + (patch.addAttempt ? 1 : 0),
    timeSpentSec: (existing?.timeSpentSec ?? 0) + (patch.addTimeSec ?? 0),
    completedAt: status === 'completed' ? (existing?.completedAt ?? new Date()) : null,
  };

  await prisma.progress.upsert({
    where: { userId_entityType_entityId: { userId, entityType, entityId } },
    create: { userId, entityType, entityId, ...data },
    update: data,
  });
}

/** Отметка активности за день — основа streak и графиков. */
export async function touchStudySession(
  userId: string,
  patch: {
    theoryMinutes?: number;
    practiceMinutes?: number;
    tasksAttempted?: number;
    tasksSolved?: number;
    quizzesTaken?: number;
    lessonsDone?: number;
  },
): Promise<void> {
  const date = dateKey();
  const existing = await prisma.studySession.findUnique({ where: { userId_date: { userId, date } } });
  const data = {
    theoryMinutes: (existing?.theoryMinutes ?? 0) + (patch.theoryMinutes ?? 0),
    practiceMinutes: (existing?.practiceMinutes ?? 0) + (patch.practiceMinutes ?? 0),
    tasksAttempted: (existing?.tasksAttempted ?? 0) + (patch.tasksAttempted ?? 0),
    tasksSolved: (existing?.tasksSolved ?? 0) + (patch.tasksSolved ?? 0),
    quizzesTaken: (existing?.quizzesTaken ?? 0) + (patch.quizzesTaken ?? 0),
    lessonsDone: (existing?.lessonsDone ?? 0) + (patch.lessonsDone ?? 0),
  };
  await prisma.studySession.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date, ...data },
    update: data,
  });
}

/** Обновление агрегата по темам задания — источник «слабых тем». */
export async function updateTopicStats(
  userId: string,
  topicIds: string[],
  patch: {
    attempt?: boolean;
    solved?: boolean;
    hintsUsed?: number;
    timeMs?: number;
    quizCorrect?: number;
    quizTotal?: number;
  },
): Promise<void> {
  const now = new Date();
  for (const topicId of topicIds) {
    const existing = await prisma.topicStat.findUnique({ where: { userId_topicId: { userId, topicId } } });
    const data = {
      attempts: (existing?.attempts ?? 0) + (patch.attempt ? 1 : 0),
      solved: (existing?.solved ?? 0) + (patch.solved ? 1 : 0),
      failed: (existing?.failed ?? 0) + (patch.attempt && !patch.solved ? 1 : 0),
      hintsUsed: (existing?.hintsUsed ?? 0) + (patch.hintsUsed ?? 0),
      totalTimeMs: (existing?.totalTimeMs ?? 0) + (patch.timeMs ?? 0),
      quizCorrect: (existing?.quizCorrect ?? 0) + (patch.quizCorrect ?? 0),
      quizTotal: (existing?.quizTotal ?? 0) + (patch.quizTotal ?? 0),
      lastAttemptAt: patch.attempt ? now : (existing?.lastAttemptAt ?? null),
      lastSuccessAt: patch.solved ? now : (existing?.lastSuccessAt ?? null),
    };
    await prisma.topicStat.upsert({
      where: { userId_topicId: { userId, topicId } },
      create: { userId, topicId, ...data },
      update: data,
    });
  }
}

export const getStudySessions = cache(async (userId: string, limitDays = 180) => {
  return prisma.studySession.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: limitDays,
  });
});

export const getStreak = cache(async (userId: string) => {
  const sessions = await getStudySessions(userId, 400);
  const active = sessions
    .filter((s) => s.theoryMinutes + s.practiceMinutes + s.tasksAttempted + s.quizzesTaken + s.lessonsDone > 0)
    .map((s) => s.date);
  return { current: computeStreak(active), longest: longestStreak(active), activeDays: active.length };
});

export const getTopicStats = cache(async (userId: string) => prisma.topicStat.findMany({ where: { userId } }));

/** Сегодняшний день учебного плана. */
export function todayPlanDay(startDate: Date, now: Date = new Date()) {
  const index = currentDayIndex(startDate, now, ALL_DAYS.length);
  return { index, day: ALL_DAYS[index] };
}

/** Сколько дней плана закрыто в каждой неделе. */
export function completedDaysByWeek(records: ProgressRecord[]): Record<number, number> {
  const result: Record<number, number> = {};
  for (const record of records) {
    if (record.entityType !== 'day' || record.status !== 'completed') continue;
    const match = record.entityId.match(/^day-(\d+)-/);
    if (!match) continue;
    const weekNo = Number(match[1]);
    result[weekNo] = (result[weekNo] ?? 0) + 1;
  }
  return result;
}
