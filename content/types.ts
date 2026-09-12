/**
 * Типы учебного контента платформы.
 *
 * Контент отделён от логики (раздел 29 ТЗ): здесь только данные,
 * ни одного React-компонента. Всё, что лежит в `content/**`, должно
 * соответствовать этим типам — проверяется `npm run content:check`.
 */

// ─────────────────────────────── Общие типы ─────────────────────────────────

export const TECHS = [
  'html',
  'css',
  'js',
  'ts',
  'react',
  'bootstrap',
  'node',
  'express',
  'sql',
  'git',
  'tools',
  'security',
  'design',
] as const;

export type Tech = (typeof TECHS)[number];

export const TECH_LABELS: Record<Tech, string> = {
  html: 'HTML',
  css: 'CSS',
  js: 'JavaScript',
  ts: 'TypeScript',
  react: 'React',
  bootstrap: 'Bootstrap',
  node: 'Node.js',
  express: 'Express',
  sql: 'SQL / БД',
  git: 'Git',
  tools: 'Инструменты',
  security: 'Безопасность',
  design: 'Дизайн и вёрстка',
};

/** ⭐ Beginner … ⭐⭐⭐⭐⭐ Exam (раздел 41 ТЗ). */
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  1: 'Beginner',
  2: 'Easy',
  3: 'Medium',
  4: 'Hard',
  5: 'Exam',
};

/** Откуда взято утверждение — раздел 46 ТЗ: не выдавать предположение за факт. */
export type SourceKind = 'plan' | 'exam' | 'docs' | 'author';

export const SOURCE_LABELS: Record<SourceKind, string> = {
  plan: 'Учебная программа',
  exam: 'Задание демоэкзамена',
  docs: 'Документация технологии',
  author: 'Рекомендация разработчика платформы',
};

export interface Resource {
  title: string;
  url: string;
  /** Официальная документация / учебник / тренажёр. */
  kind: 'docs' | 'tutorial' | 'practice' | 'reference';
  source: SourceKind;
  note?: string;
}

export interface Hint {
  /** 1 — направление мысли, 2 — часть алгоритма, 3 — почти готовая структура. */
  level: 1 | 2 | 3;
  text: string;
  /** Сколько процентов от максимального балла снимает эта подсказка. */
  penaltyPercent: number;
}

// ───────────────────────────── Пункты экзамена ──────────────────────────────

/**
 * Требование из задания демоэкзамена. `quote` — дословная цитата из PDF,
 * чтобы студент видел исходную формулировку, а не пересказ.
 */
export interface ExamRequirement {
  id: string;
  moduleNo: 1 | 2 | 3;
  title: string;
  quote: string;
  /** Насколько дорого ошибиться: влияет на рекомендации и анализ готовности. */
  weight: number;
  /** Проверяется автоматически в платформе или только глазами в своём проекте. */
  verification: 'auto' | 'manual' | 'mixed';
  topicIds: string[];
  checklist: string[];
  /** Замечания разработчика: где обычно теряют баллы. */
  pitfalls?: string[];
}

// ──────────────────────────── Учебная программа ─────────────────────────────

export type DayKind = 'study' | 'review' | 'control' | 'exam' | 'light' | 'rest';

export const DAY_KIND_LABELS: Record<DayKind, string> = {
  study: 'Учебный день',
  review: 'Повторение',
  control: 'Контрольный день',
  exam: 'Прогон экзамена',
  light: 'Лёгкий день',
  rest: 'Отдых',
};

export interface PlanDay {
  id: string;
  dayNo: number;
  weekId: string;
  monthId: string;
  /** Дословный текст колонки «Теория» из программы. */
  theory: string;
  /** Дословный текст колонки «Практика» из программы. */
  practice: string;
  kind: DayKind;
}

export interface PlanWeek {
  id: string;
  weekNo: number;
  monthId: string;
  title: string;
  dates: string;
  days: PlanDay[];
}

export interface PlanMonth {
  id: string;
  monthNo: number;
  title: string;
  shortTitle: string;
  weeks: PlanWeek[];
}

/** День после обогащения ссылками на темы, задания и тесты. */
export interface Day extends PlanDay {
  title: string;
  /**
   * Объяснение простыми словами. Не заменяет theory/practice — те остаются
   * дословной формулировкой программы, а это перевод её на человеческий язык.
   */
  plain?: {
    theory: string;
    practice: string;
    why?: string;
  };
  topicIds: string[];
  taskIds: string[];
  quizIds: string[];
  projectId?: string;
  examId?: string;
  estimatedMinutes: number;
}

export interface Week extends Omit<PlanWeek, 'days'> {
  days: Day[];
  goal?: string;
}

export interface Month extends Omit<PlanMonth, 'weeks'> {
  weeks: Week[];
  /** Результат месяца из таблицы «Карта на 7 месяцев». */
  outcome: string;
  tech: Tech[];
}

// ─────────────────────────────── Темы и теория ──────────────────────────────

export interface CodeExample {
  title: string;
  language: string;
  code: string;
  explanation?: string;
  /** Можно ли открыть пример в песочнице и запустить. */
  runnable?: boolean;
}

export interface Mistake {
  title: string;
  wrong?: string;
  right?: string;
  why: string;
}

/**
 * Тема = страница теории (раздел 12 ТЗ).
 * Поля `theory`, `summary` и т.д. — markdown-строки; рендерятся `lib/markdown`.
 */
export interface Topic {
  id: string;
  title: string;
  tech: Tech[];
  monthNo: number;
  weekNo?: number;
  importance: 'core' | 'supporting' | 'extra';
  /** Кратко: 1–3 предложения. */
  summary: string;
  /** Что необходимо знать — список тезисов. */
  mustKnow: string[];
  /** Подробная теория (markdown). */
  theory: string;
  examples: CodeExample[];
  /** Практический пример — «как это выглядит в проекте экзамена». */
  practicalExample?: CodeExample;
  mistakes: Mistake[];
  quizId?: string;
  taskIds: string[];
  projectIds?: string[];
  resources: Resource[];
  /** Идентификаторы требований экзамена, которые закрывает тема. */
  examRefs: string[];
  prerequisites: string[];
  estimatedMinutes: number;
  /** Дни учебного плана, к которым привязана тема (например, ['day-02-1']). */
  planDays: string[];
  /** Помечает темы, добавленные платформой сверх программы. */
  source: SourceKind;
}

// ────────────────────────── Тесты (теоретические) ───────────────────────────

export interface QuizOption {
  id: string;
  text: string;
}

export type Question =
  | {
      id: string;
      type: 'single';
      text: string;
      options: QuizOption[];
      correct: string;
      explanation: string;
      points?: number;
    }
  | {
      id: string;
      type: 'multiple';
      text: string;
      options: QuizOption[];
      correct: string[];
      explanation: string;
      points?: number;
    }
  | {
      id: string;
      type: 'boolean';
      text: string;
      correct: boolean;
      explanation: string;
      points?: number;
    }
  | {
      id: string;
      type: 'match';
      text: string;
      left: QuizOption[];
      right: QuizOption[];
      /** { leftId: rightId } */
      correct: Record<string, string>;
      explanation: string;
      points?: number;
    }
  | {
      id: string;
      type: 'order';
      text: string;
      items: QuizOption[];
      /** Правильный порядок идентификаторов. */
      correct: string[];
      explanation: string;
      points?: number;
    }
  | {
      id: string;
      type: 'text';
      text: string;
      /** Любой из вариантов считается верным. */
      correct: string[];
      caseSensitive?: boolean;
      /** Сравнивать без учёта пробелов и знаков препинания. */
      normalize?: boolean;
      explanation: string;
      points?: number;
    };

export type QuestionType = Question['type'];

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  single: 'Один ответ',
  multiple: 'Несколько ответов',
  boolean: 'Верно / неверно',
  match: 'Сопоставление',
  order: 'Последовательность',
  text: 'Свободный ответ',
};

export interface Quiz {
  id: string;
  title: string;
  topicIds: string[];
  tech: Tech[];
  monthNo: number;
  difficulty: Difficulty;
  questions: Question[];
  /** Проходной процент. */
  passPercent: number;
  examRefs?: string[];
}

// ───────────────────────── Практические задания ─────────────────────────────

/** Среда выполнения задания. Определяет, какой раннер запускает песочница. */
export type Runtime = 'js' | 'ts' | 'dom' | 'react' | 'sql';

export const RUNTIME_LABELS: Record<Runtime, string> = {
  js: 'JavaScript',
  ts: 'TypeScript',
  dom: 'HTML / CSS / DOM',
  react: 'React + TypeScript',
  sql: 'SQL',
};

/** Тип задания из раздела 15 ТЗ. */
export type TaskKind =
  | 'function'
  | 'fix-bug'
  | 'find-bug'
  | 'complete'
  | 'output'
  | 'api'
  | 'db'
  | 'files'
  | 'app';

export const TASK_KIND_LABELS: Record<TaskKind, string> = {
  function: 'Написать функцию',
  'fix-bug': 'Исправить ошибку',
  'find-bug': 'Найти ошибку',
  complete: 'Завершить код',
  output: 'Получить результат',
  api: 'Работа с API',
  db: 'Работа с БД',
  files: 'Работа с данными',
  app: 'Небольшое приложение',
};

export type CompareMode = 'deep' | 'strict' | 'approx' | 'set' | 'string';

/**
 * Тест-кейс. Все поля сериализуемы: тесты уходят в песочницу через postMessage.
 * Сравнение текста запрещено (раздел 14 ТЗ) — код действительно исполняется.
 */
export type TestCase =
  /** Вызвать функцию пользователя с аргументами и сверить результат. */
  | {
      id: string;
      name: string;
      type: 'call';
      /** Имя функции/класса, которое должен определить пользователь. */
      entry: string;
      args: unknown[];
      expected: unknown;
      compare?: CompareMode;
      tolerance?: number;
      points?: number;
      hidden?: boolean;
    }
  /** Выполнить выражение в области видимости решения и сверить результат. */
  | {
      id: string;
      name: string;
      type: 'expr';
      expression: string;
      expected: unknown;
      compare?: CompareMode;
      tolerance?: number;
      points?: number;
      hidden?: boolean;
    }
  /**
   * Произвольная проверка. `code` — тело функции, получающей `{ solution, assert }`
   * и возвращающей `{ pass, message?, expected?, actual? }`.
   */
  | {
      id: string;
      name: string;
      type: 'assert';
      code: string;
      points?: number;
      hidden?: boolean;
    }
  /** Проверка отрисованного документа: `code` получает `{ document, window, assert }`. */
  | {
      id: string;
      name: string;
      type: 'dom';
      code: string;
      points?: number;
      hidden?: boolean;
    }
  /** Проверка React-компонента: `code` получает `{ render, screen, act, assert }`. */
  | {
      id: string;
      name: string;
      type: 'react';
      code: string;
      points?: number;
      hidden?: boolean;
    }
  /** Выполнить SQL пользователя, затем контрольный запрос и сверить таблицу. */
  | {
      id: string;
      name: string;
      type: 'sql-query';
      /** Запрос, которым проверяется результат работы пользователя. */
      check: string;
      expectedColumns?: string[];
      expectedRows: unknown[][];
      /** Учитывать порядок строк. */
      ordered?: boolean;
      points?: number;
      hidden?: boolean;
    }
  /** Проверка структуры таблицы: имя, колонки, типы, ключи. */
  | {
      id: string;
      name: string;
      type: 'sql-schema';
      table: string;
      columns: { name: string; type?: string; notNull?: boolean; pk?: boolean }[];
      foreignKeys?: { column: string; refTable: string; refColumn?: string }[];
      points?: number;
      hidden?: boolean;
    };

export interface Task {
  id: string;
  title: string;
  kind: TaskKind;
  runtime: Runtime;
  difficulty: Difficulty;
  tech: Tech[];
  topicIds: string[];
  monthNo: number;
  weekNo?: number;
  /** Условие задания (markdown). */
  statement: string;
  /** Требования по пунктам — показываются рядом с редактором. */
  requirements: string[];
  starterCode: string;
  /** Дополнительные файлы (например, HTML-каркас для DOM-задания). */
  extraFiles?: { path: string; content: string; language: string }[];
  /** SQL, который выполняется до кода пользователя (создание таблиц, данные). */
  setupSql?: string;
  /** Размер окна песочницы: для заданий на адаптив — 390×844 из задания ДЭ. */
  viewport?: { width: number; height: number };
  tests: TestCase[];
  hints: Hint[];
  /** Полный разбор — открывается только после попыток или по кнопке. */
  solution: string;
  solutionExplanation: string;
  maxScore: number;
  timeLimitMs?: number;
  estimatedMinutes: number;
  examRefs: string[];
  resources?: Resource[];
  /** Дни плана, на которых задание предлагается как практика дня. */
  planDays?: string[];
  source: SourceKind;
}

// ──────────────────────────────── Проекты ───────────────────────────────────

export interface ProjectCheck {
  id: string;
  text: string;
  weight: number;
  /** Проверяется автотестом или отмечается студентом вручную. */
  verification: 'auto' | 'manual';
}

export interface Project {
  id: string;
  title: string;
  goal: string;
  monthNo: number;
  difficulty: Difficulty;
  tech: Tech[];
  topicIds: string[];
  examRefs: string[];
  /** Техническое задание (markdown). */
  brief: string;
  requirements: string[];
  constraints: string[];
  checklist: ProjectCheck[];
  hints: Hint[];
  resources: Resource[];
  /** Автопроверяемая часть проекта: файлы-заготовки и тесты к ним. */
  autoCheck?: {
    runtime: Runtime;
    starterCode: string;
    setupSql?: string;
    tests: TestCase[];
    maxScore: number;
  };
  estimatedHours: number;
  /** Дни плана, на которых проект стоит в программе (мини-проекты месяцев). */
  planDays?: string[];
  source: SourceKind;
}

// ──────────────────────────────── Экзамены ──────────────────────────────────

export type ExamKind = 'demo' | 'practice' | 'generated';
export type ExamLevel = 'easy' | 'standard' | 'hard' | 'exam';

export const EXAM_LEVEL_LABELS: Record<ExamLevel, string> = {
  easy: 'Лёгкий',
  standard: 'Стандартный',
  hard: 'Сложный',
  exam: 'Экзаменационный',
};

export type ExamTask =
  | { id: string; kind: 'code'; taskId: string; points: number; title?: string }
  | { id: string; kind: 'quiz'; quizId: string; points: number; title?: string }
  | {
      id: string;
      kind: 'checklist';
      title: string;
      description: string;
      /** Пункты, которые студент проверяет в СВОЁМ проекте (ручная проверка). */
      items: { id: string; text: string; points: number; quote?: string }[];
      points: number;
    };

export interface ExamModule {
  id: string;
  moduleNo: 1 | 2 | 3;
  title: string;
  minutes: number;
  /** Инструкция из задания (для demo — дословная цитата). */
  instruction: string;
  tasks: ExamTask[];
}

export interface Exam {
  id: string;
  title: string;
  kind: ExamKind;
  level: ExamLevel;
  /** Предметная область: «Конференции.РФ», «Запись на курсы» и т.д. */
  domain: string;
  description: string;
  /** Для demo — ссылка на исходный PDF. */
  sourceNote: string;
  source: SourceKind;
  totalMinutes: number;
  modules: ExamModule[];
  /** Требования экзамена, которые вариант проверяет. */
  examRefs: string[];
}

// ─────────────────────────────── Достижения ─────────────────────────────────

export interface AchievementDef {
  code: string;
  title: string;
  description: string;
  icon: string;
  /** Условие: считается в lib/achievements. */
  rule:
    | { type: 'tasks_solved'; count: number }
    | { type: 'streak_days'; count: number }
    | { type: 'quiz_perfect'; count: number }
    | { type: 'exam_taken'; count: number }
    | { type: 'exam_percent'; percent: number }
    | { type: 'no_hints_solved'; count: number }
    | { type: 'month_completed'; monthNo: number }
    | { type: 'course_completed' }
    | { type: 'project_completed'; count: number }
    | { type: 'review_done'; count: number };
  hidden?: boolean;
}

// ─────────────────────────── Модель оценивания ──────────────────────────────

/**
 * Веса итоговой оценки. Раздел 17 ТЗ требует не брать веса произвольно:
 * они выведены из времени модулей экзамена и состава заданий — см. docs/GRADING.md.
 */
export interface GradingWeights {
  practice: number;
  theory: number;
  control: number;
  projects: number;
  examPractice: number;
}
