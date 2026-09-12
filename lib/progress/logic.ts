import { addDays, dateKey, daysBetween, toShortDate } from '@/lib/utils';

/**
 * Чистая логика прогресса: без базы данных, чтобы её можно было покрыть
 * модульными тестами (раздел 32 ТЗ).
 */

export type ProgressStatus = 'locked' | 'not_started' | 'in_progress' | 'completed' | 'review';

export const STATUS_LABELS: Record<ProgressStatus, string> = {
  locked: 'Заблокировано',
  not_started: 'Не начато',
  in_progress: 'В процессе',
  completed: 'Выполнено',
  review: 'Повторить',
};

export const STATUS_ICONS: Record<ProgressStatus, string> = {
  locked: '🔒',
  not_started: '○',
  in_progress: '🟡',
  completed: '🟢',
  review: '⭐',
};

/**
 * Какой день программы «сегодня».
 * Программа — 210 дней подряд от даты старта; если студент отстал,
 * счётчик всё равно показывает календарный день, но контент не блокируется
 * (см. isWeekUnlocked): отставание — обычное дело, наказывать за него нельзя.
 */
export function currentDayIndex(startDate: Date, now: Date = new Date(), totalDays = 210): number {
  const diff = daysBetween(dateKey(startDate), dateKey(now));
  if (diff < 0) return 0;
  return Math.min(diff, totalDays - 1);
}

/** Номер недели программы (1…30) по индексу дня. */
export function weekNoFromDayIndex(dayIndex: number): number {
  return Math.floor(dayIndex / 7) + 1;
}

/**
 * Календарные даты для дня и недели программы.
 *
 * Считаются от даты старта КОНКРЕТНОГО студента, а не от 14.09.2026 из файла
 * программы: план на 30 недель одинаков для всех, а календарь у каждого свой.
 */
export function planDayDate(startDate: Date, dayIndex: number): Date {
  return addDays(startDate, dayIndex);
}

/** Даты недели: понедельник и воскресенье относительно даты старта. */
export function planWeekRange(startDate: Date, weekNo: number): { from: Date; to: Date; label: string } {
  const from = addDays(startDate, (weekNo - 1) * 7);
  const to = addDays(startDate, weekNo * 7 - 1);
  return { from, to, label: `${toShortDate(from)} – ${toShortDate(to)}` };
}

/** Дата последнего, 210-го дня программы. */
export function planFinishDate(startDate: Date, totalDays = 210): Date {
  return addDays(startDate, totalDays - 1);
}

export function monthNoFromWeekNo(weekNo: number): number {
  if (weekNo <= 4) return 1;
  if (weekNo <= 8) return 2;
  if (weekNo <= 12) return 3;
  if (weekNo <= 16) return 4;
  if (weekNo <= 20) return 5;
  if (weekNo <= 24) return 6;
  return 7;
}

/**
 * Неделя открыта, если выполнено хотя бы одно условие:
 *  - это первая неделя;
 *  - календарь уже дошёл до неё (нельзя запереть студента из-за пропусков);
 *  - в предыдущей неделе закрыто не меньше 60 % дней (можно идти вперёд досрочно).
 */
export function isWeekUnlocked(
  weekNo: number,
  completedDaysByWeek: Record<number, number>,
  currentWeekNo: number,
  daysPerWeek = 7,
): boolean {
  if (weekNo <= 1) return true;
  if (weekNo <= currentWeekNo) return true;
  const previous = completedDaysByWeek[weekNo - 1] ?? 0;
  return previous >= Math.ceil(daysPerWeek * 0.6);
}

/** Тема открыта, если открыта её неделя и закрыты все предварительные темы. */
export function isTopicUnlocked(
  topic: { weekNo?: number; prerequisites: string[] },
  completedTopicIds: Set<string>,
  unlockedWeeks: Set<number>,
): boolean {
  if (topic.weekNo && !unlockedWeeks.has(topic.weekNo)) {
    // Неделя ещё закрыта, но если все предпосылки пройдены — пускаем вперёд.
    return topic.prerequisites.length > 0 && topic.prerequisites.every((id) => completedTopicIds.has(id));
  }
  return topic.prerequisites.every((id) => completedTopicIds.has(id));
}

/**
 * Серия дней подряд (streak).
 * Считается от сегодняшнего дня назад; если сегодня занятий ещё не было,
 * серия не обрывается до конца дня — она считается от вчера.
 */
export function computeStreak(activeDates: string[], today: string = dateKey()): number {
  if (!activeDates.length) return 0;
  const set = new Set(activeDates);
  let streak = 0;
  let cursor = today;

  if (!set.has(cursor)) {
    // Сегодня ещё не занимались — начинаем отсчёт со вчера.
    cursor = shiftDate(today, -1);
    if (!set.has(cursor)) return 0;
  }

  while (set.has(cursor)) {
    streak++;
    cursor = shiftDate(cursor, -1);
  }
  return streak;
}

export function longestStreak(activeDates: string[]): number {
  if (!activeDates.length) return 0;
  const sorted = [...new Set(activeDates)].sort();
  let best = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (daysBetween(sorted[i - 1], sorted[i]) === 1) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }
  return best;
}

export function shiftDate(key: string, days: number): string {
  const date = new Date(`${key}T00:00:00`);
  date.setDate(date.getDate() + days);
  return dateKey(date);
}

export interface TopicStatInput {
  topicId: string;
  attempts: number;
  solved: number;
  failed: number;
  hintsUsed: number;
  quizCorrect: number;
  quizTotal: number;
  totalTimeMs: number;
  lastAttemptAt?: Date | null;
  lastSuccessAt?: Date | null;
}

export interface WeakTopic {
  topicId: string;
  /** 0…1, где 1 — «совсем не идёт». */
  weakness: number;
  successRate: number;
  attempts: number;
  hintsPerTask: number;
  reasons: string[];
}

/**
 * Оценка слабости темы (раздел 18 ТЗ).
 * Учитываются: доля неудач, использование подсказок, результаты тестов
 * и давность последнего успеха.
 */
export function computeWeakness(stat: TopicStatInput, now: Date = new Date()): WeakTopic {
  const attempts = stat.attempts;
  const successRate = attempts ? stat.solved / attempts : 0;
  const hintsPerTask = attempts ? stat.hintsUsed / attempts : 0;
  const quizRate = stat.quizTotal ? stat.quizCorrect / stat.quizTotal : null;
  const reasons: string[] = [];

  let weakness = 0;

  if (attempts > 0) {
    const failPart = 1 - successRate;
    weakness += failPart * 0.45;
    if (failPart >= 0.4) reasons.push(`неудачных попыток ${Math.round(failPart * 100)}%`);
  }

  if (quizRate !== null) {
    weakness += (1 - quizRate) * 0.3;
    if (quizRate < 0.7) reasons.push(`тест пройден на ${Math.round(quizRate * 100)}%`);
  }

  if (hintsPerTask > 0) {
    const hintPart = Math.min(1, hintsPerTask / 3);
    weakness += hintPart * 0.15;
    if (hintsPerTask >= 1.5) reasons.push('часто нужны подсказки');
  }

  // Давность: тема, к которой давно не возвращались, постепенно «остывает».
  const last = stat.lastSuccessAt ?? stat.lastAttemptAt;
  if (last) {
    const days = daysBetween(dateKey(last), dateKey(now));
    const stale = Math.min(1, Math.max(0, days - 14) / 45);
    weakness += stale * 0.1;
    if (days >= 30) reasons.push(`последний раз ${days} дн. назад`);
  }

  return {
    topicId: stat.topicId,
    weakness: Math.min(1, Math.round(weakness * 1000) / 1000),
    successRate,
    attempts,
    hintsPerTask,
    reasons,
  };
}

export function rankWeakTopics(stats: TopicStatInput[], now: Date = new Date(), limit = 5): WeakTopic[] {
  return stats
    .map((stat) => computeWeakness(stat, now))
    .filter((item) => item.weakness > 0.25 && item.attempts + 0 > 0)
    .sort((a, b) => b.weakness - a.weakness)
    .slice(0, limit);
}

export interface ReadinessInput {
  /** Доля пройденной теории: закрытые темы / всего тем. */
  theory: { done: number; total: number };
  /** Практика: решённые задания / всего заданий. */
  practice: { done: number; total: number };
  /** Контрольные и повторения: закрытые дни-контроля. */
  control: { done: number; total: number };
  /** Мини-проекты. */
  projects: { done: number; total: number };
  /** Средний процент последних экзаменационных попыток (0…100) или null. */
  examPercent: number | null;
}

/**
 * Веса взяты из модели оценивания платформы (docs/GRADING.md),
 * а не придуманы на ходу: они выведены из длительности модулей экзамена
 * и состава заданий. Официальной шкалы в задании ДЭ нет.
 */
export const GRADING_WEIGHTS = {
  practice: 0.4,
  theory: 0.2,
  control: 0.15,
  projects: 0.1,
  examPractice: 0.15,
} as const;

export function share(part: { done: number; total: number }): number {
  if (!part.total) return 0;
  return Math.min(1, part.done / part.total);
}

/** Итоговая готовность в процентах (раздел 44 ТЗ). */
export function computeReadiness(input: ReadinessInput): {
  percent: number;
  parts: { key: keyof typeof GRADING_WEIGHTS; label: string; percent: number; weight: number }[];
} {
  const examShare = input.examPercent === null ? 0 : input.examPercent / 100;
  const parts = [
    { key: 'practice' as const, label: 'Практика', percent: share(input.practice) },
    { key: 'theory' as const, label: 'Теория', percent: share(input.theory) },
    { key: 'control' as const, label: 'Контрольные', percent: share(input.control) },
    { key: 'projects' as const, label: 'Мини-проекты', percent: share(input.projects) },
    { key: 'examPractice' as const, label: 'Экзаменационная практика', percent: examShare },
  ].map((part) => ({ ...part, weight: GRADING_WEIGHTS[part.key] }));

  const total = parts.reduce((sum, part) => sum + part.percent * part.weight, 0);

  return {
    percent: Math.round(total * 100),
    parts: parts.map((part) => ({ ...part, percent: Math.round(part.percent * 100) })),
  };
}

export function readinessLabel(percent: number): { label: string; tone: 'bad' | 'warn' | 'ok' } {
  if (percent >= 80) return { label: 'Готов к экзамену', tone: 'ok' };
  if (percent >= 60) return { label: 'Почти готов', tone: 'warn' };
  if (percent >= 35) return { label: 'В процессе подготовки', tone: 'warn' };
  return { label: 'Подготовка только началась', tone: 'bad' };
}

/** Сколько дней осталось до экзамена (отрицательное — экзамен уже прошёл). */
export function daysUntilExam(examDate: Date | null | undefined, now: Date = new Date()): number | null {
  if (!examDate) return null;
  return daysBetween(dateKey(now), dateKey(examDate));
}

/**
 * Предэкзаменационный режим (раздел 42 ТЗ): за 30 дней до экзамена
 * платформа предлагает отдельный план из четырёх недель.
 */
export function preExamPlan(daysLeft: number): { active: boolean; week: number; title: string; focus: string } | null {
  if (daysLeft < 0 || daysLeft > 30) return null;
  if (daysLeft > 21) {
    return { active: true, week: 1, title: 'Неделя 1', focus: 'Повторение фундаментальных тем' };
  }
  if (daysLeft > 14) {
    return { active: true, week: 2, title: 'Неделя 2', focus: 'Сложные практические задания' };
  }
  if (daysLeft > 7) {
    return { active: true, week: 3, title: 'Неделя 3', focus: 'Пробные экзамены' };
  }
  return { active: true, week: 4, title: 'Неделя 4', focus: 'Полные симуляции экзамена' };
}
