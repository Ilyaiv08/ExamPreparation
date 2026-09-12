import { dateKey, daysBetween } from '@/lib/utils';

/**
 * Интервальное повторение (раздел 19 ТЗ).
 *
 * За основу взят алгоритм SM-2, но интервалы подогнаны под интервалы,
 * которые называет учебная программа: 2 → 5 → 10 → 21 день.
 * Дальше интервал растёт по коэффициенту лёгкости.
 */

/** Оценка вспоминания: 0 — не вспомнил, 1 — с трудом, 2 — уверенно. */
export type ReviewGrade = 0 | 1 | 2;

export const BASE_INTERVALS = [2, 5, 10, 21];

export interface ReviewState {
  ease: number;
  intervalDays: number;
  repetitions: number;
  lapses: number;
  dueAt: Date;
}

export const INITIAL_REVIEW: Omit<ReviewState, 'dueAt'> = {
  ease: 2.5,
  intervalDays: 0,
  repetitions: 0,
  lapses: 0,
};

export function nextReview(state: ReviewState, grade: ReviewGrade, now: Date = new Date()): ReviewState {
  let { ease, repetitions, lapses } = state;
  let intervalDays: number;

  if (grade === 0) {
    // Не вспомнил: тема возвращается уже завтра, лёгкость падает.
    repetitions = 0;
    lapses += 1;
    ease = Math.max(1.3, ease - 0.25);
    intervalDays = 1;
  } else if (grade === 1) {
    // Вспомнил с трудом: интервал почти не растёт.
    ease = Math.max(1.3, ease - 0.12);
    intervalDays = repetitions === 0 ? 2 : Math.max(2, Math.round(state.intervalDays * 1.2));
    repetitions += 1;
  } else {
    ease = Math.min(3.0, ease + 0.08);
    intervalDays =
      repetitions < BASE_INTERVALS.length
        ? BASE_INTERVALS[repetitions]
        : Math.round(state.intervalDays * ease);
    repetitions += 1;
  }

  const dueAt = new Date(now);
  dueAt.setHours(0, 0, 0, 0);
  dueAt.setDate(dueAt.getDate() + intervalDays);

  return { ease: Math.round(ease * 100) / 100, intervalDays, repetitions, lapses, dueAt };
}

/** Карточки, которые пора повторить. */
export function isDue(item: { dueAt: Date }, now: Date = new Date()): boolean {
  return daysBetween(dateKey(item.dueAt), dateKey(now)) >= 0;
}

export function sortReviewQueue<T extends { dueAt: Date; lapses: number }>(items: T[], now: Date = new Date()): T[] {
  return [...items].sort((a, b) => {
    const overdueA = daysBetween(dateKey(a.dueAt), dateKey(now));
    const overdueB = daysBetween(dateKey(b.dueAt), dateKey(now));
    if (overdueA !== overdueB) return overdueB - overdueA;
    return b.lapses - a.lapses;
  });
}

/** Понятная подпись срока: «сегодня», «через 3 дня», «просрочено на 2 дня». */
export function dueLabel(dueAt: Date, now: Date = new Date()): string {
  const diff = daysBetween(dateKey(now), dateKey(dueAt));
  if (diff === 0) return 'сегодня';
  if (diff === 1) return 'завтра';
  if (diff > 1) return `через ${diff} дн.`;
  if (diff === -1) return 'просрочено на 1 день';
  return `просрочено на ${Math.abs(diff)} дн.`;
}
