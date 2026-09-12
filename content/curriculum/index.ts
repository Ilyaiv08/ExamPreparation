import type { Day, Month, PlanMonth, Tech, Week } from '../types';
import planData from './plan.generated.json';
import { DAY_NOTES } from './day-notes';
import { ALL_TOPICS } from '../topics';
import { ALL_TASKS } from '../tasks';
import { ALL_QUIZZES } from '../quizzes';
import { ALL_PROJECTS } from '../projects';

/**
 * Учебная программа: 7 месяцев → 30 недель → 210 дней.
 *
 * Тексты дней берутся дословно из plan.generated.json (разобранного из
 * plan_podgotovki_DE_09.02.07.md), а ссылки на темы/задания/тесты
 * вычисляются по полю planDays в самих темах и заданиях —
 * так карта «день → контент» не расходится с контентом.
 */

const plan = planData as unknown as { months: PlanMonth[]; source: string; generatedAt: string };

/** Результат месяца из таблицы «Карта на 7 месяцев» учебной программы. */
const MONTH_OUTCOMES: Record<number, { outcome: string; tech: Tech[] }> = {
  1: { outcome: 'Статичный макет 5 страниц «Конференции.РФ»', tech: ['html', 'css', 'git', 'tools'] },
  2: {
    outcome: 'Уверенно пишешь функции, работаешь с массивами, знаешь типы',
    tech: ['js', 'ts', 'bootstrap'],
  },
  3: { outcome: 'Весь фронтенд проекта на тестовых данных', tech: ['react', 'ts', 'bootstrap'] },
  4: {
    outcome: 'Регистрация + вход через настоящий сервер и БД',
    tech: ['sql', 'node', 'express', 'security'],
  },
  5: { outcome: 'Работающее приложение по всем пунктам задания', tech: ['react', 'express', 'sql', 'design'] },
  6: { outcome: '3 разных приложения, код без подсказок', tech: ['react', 'express', 'sql', 'security'] },
  7: { outcome: 'Модуль 1 ≤ 75 мин, весь ДЭ ≤ 4 ч', tech: ['react', 'express', 'sql', 'design'] },
};

/** Цель недели — короткая формулировка для страницы плана. */
const WEEK_GOALS: Record<number, string> = {
  1: 'Поставить инструменты и написать первые страницы руками',
  2: 'Формы из задания экзамена и базовый CSS',
  3: 'Раскладка и адаптив под 390×844',
  4: 'Анимации, ветки Git и первый макет проекта',
  5: 'Базовый JavaScript: функции, массивы, объекты',
  6: 'DOM, события, валидация и первый слайдер',
  7: 'Современный JS: то, без чего не поедет React',
  8: 'TypeScript и Bootstrap',
  9: 'Первые компоненты React',
  10: 'Формы в React со всей валидацией задания',
  11: 'Маршруты, эффекты, слайдер и авторизация на фронте',
  12: 'Весь фронтенд проекта на тестовых данных',
  13: 'Проектирование БД, ER-диаграмма и базовый SQL',
  14: 'JOIN, агрегаты и разные предметные области',
  15: 'Сервер на Node.js + Express',
  16: 'Регистрация, вход, JWT и роли',
  17: 'Каркас проекта и вся пользовательская часть',
  18: 'Панель администратора целиком',
  19: 'Первые прогоны Модуля 1 на время',
  20: 'Модуль 2 на живом проекте',
  21: 'Модуль 3: качество, безопасность, состояния интерфейса',
  22: 'Второй проект на новой предметной области',
  23: 'Третий проект быстрее плюс углубление',
  24: 'Всё из головы: скоростные прогоны по частям',
  25: 'Первый полный прогон демоэкзамена',
  26: 'Прогоны и разбор всех трёх модулей',
  27: 'Два полных прогона за неделю',
  28: 'Два полных прогона за неделю',
  29: 'Два полных прогона за неделю',
  30: 'Закрепление и план первых 10 минут экзамена',
};

/** Ориентировочное время дня в минутах (программа: теория 30–45 + практика 90–120). */
function estimateMinutes(kind: Day['kind']): number {
  switch (kind) {
    case 'rest':
      return 0;
    case 'light':
      return 60;
    case 'review':
      return 90;
    case 'control':
      return 150;
    case 'exam':
      return 240;
    default:
      return 150;
  }
}

/** Короткий заголовок дня: первая мысль из теории, иначе — из практики. */
function dayTitle(theory: string, practice: string, kind: Day['kind']): string {
  if (kind === 'rest') return 'Отдых';
  const source = theory || practice;
  const stripped = source
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .trim();
  if (!stripped) return 'День плана';
  const firstSentence = stripped.split(/(?<=[.!?])\s|(?<=\))\s—\s|\.\s/)[0] ?? stripped;
  const cut = firstSentence.length > 72 ? `${firstSentence.slice(0, 69).trimEnd()}…` : firstSentence;
  return cut.replace(/[.:;,]$/, '');
}

// Индексы «день → контент», собранные из planDays.
const topicsByDay = new Map<string, string[]>();
for (const topic of ALL_TOPICS) {
  for (const dayId of topic.planDays) {
    const list = topicsByDay.get(dayId) ?? [];
    list.push(topic.id);
    topicsByDay.set(dayId, list);
  }
}

const tasksByDay = new Map<string, string[]>();
for (const task of ALL_TASKS) {
  for (const dayId of task.planDays ?? []) {
    const list = tasksByDay.get(dayId) ?? [];
    list.push(task.id);
    tasksByDay.set(dayId, list);
  }
}

const projectByDay = new Map<string, string>();
for (const project of ALL_PROJECTS) {
  for (const dayId of project.planDays ?? []) {
    projectByDay.set(dayId, project.id);
  }
}

function quizzesForTopics(topicIds: string[]): string[] {
  const set = new Set<string>();
  for (const quiz of ALL_QUIZZES) {
    if (quiz.topicIds.some((t) => topicIds.includes(t))) set.add(quiz.id);
  }
  return [...set];
}

export const MONTHS: Month[] = plan.months.map((month) => {
  const meta = MONTH_OUTCOMES[month.monthNo] ?? { outcome: '', tech: [] };
  const weeks: Week[] = month.weeks.map((week) => {
    const days: Day[] = week.days.map((day) => {
      const topicIds = topicsByDay.get(day.id) ?? [];
      const note = DAY_NOTES[day.id];
      return {
        ...day,
        // Заголовок берём человеческий, если он написан; иначе — обрезанную
        // формулировку программы, чтобы день не остался без названия.
        title: note?.title ?? dayTitle(day.theory, day.practice, day.kind),
        plain: note ? { theory: note.theory, practice: note.practice, why: note.why } : undefined,
        topicIds,
        taskIds: tasksByDay.get(day.id) ?? [],
        quizIds: quizzesForTopics(topicIds),
        projectId: projectByDay.get(day.id),
        estimatedMinutes: estimateMinutes(day.kind),
      };
    });
    return {
      id: week.id,
      weekNo: week.weekNo,
      monthId: week.monthId,
      title: week.title,
      dates: week.dates,
      goal: WEEK_GOALS[week.weekNo],
      days,
    };
  });
  return {
    id: month.id,
    monthNo: month.monthNo,
    title: month.title,
    shortTitle: month.shortTitle,
    outcome: meta.outcome,
    tech: meta.tech,
    weeks,
  };
});

export const ALL_WEEKS: Week[] = MONTHS.flatMap((m) => m.weeks);
export const ALL_DAYS: Day[] = ALL_WEEKS.flatMap((w) => w.days);

export const PLAN_META = {
  source: plan.source,
  generatedAt: plan.generatedAt,
  monthCount: MONTHS.length,
  weekCount: ALL_WEEKS.length,
  dayCount: ALL_DAYS.length,
  /** Старт по программе: понедельник 14.09.2026. */
  defaultStartDate: '2026-09-14',
  /** Финиш основного плана по программе. */
  plannedFinishDate: '2027-04-11',
  dailyMinutes: { theory: [30, 45], practice: [90, 120], recall: [10, 15] },
  /** Месяцы 8–9 из программы: запас, в 30 недель не входят. */
  reserve: {
    title: 'Месяцы 8–9 (апрель – июнь): запас и поддержание формы',
    points: [
      'Если отставал — догоняешь пропущенные недели.',
      'Если нет — один полный прогон в неделю + 2–3 коротких тренировки по 1 часу.',
      'Как только опубликуют КОД на 2027 год — сверь задание и инфраструктурный лист.',
      'Последняя неделя перед экзаменом — без новых тем.',
    ],
  },
} as const;

export function getMonth(monthId: string): Month | undefined {
  return MONTHS.find((m) => m.id === monthId);
}

export function getWeek(weekId: string): Week | undefined {
  return ALL_WEEKS.find((w) => w.id === weekId);
}

export function getDay(dayId: string): Day | undefined {
  return ALL_DAYS.find((d) => d.id === dayId);
}

/** Порядковый номер дня в программе (1…210) — нужен для расчёта «сегодня». */
export function dayIndex(dayId: string): number {
  return ALL_DAYS.findIndex((d) => d.id === dayId);
}

export function dayByIndex(index: number): Day | undefined {
  return ALL_DAYS[index];
}

export function weekOfDay(dayId: string): Week | undefined {
  const day = getDay(dayId);
  return day ? getWeek(day.weekId) : undefined;
}

export function monthOfDay(dayId: string): Month | undefined {
  const day = getDay(dayId);
  return day ? getMonth(day.monthId) : undefined;
}
