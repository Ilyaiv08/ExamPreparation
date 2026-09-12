import type { Runtime, TestCase } from '@/content/types';

export interface TestResult {
  id: string;
  name: string;
  passed: boolean;
  points: number;
  hidden: boolean;
  durationMs: number;
  /** Что подали на вход (аргументы вызова, выражение, SQL-запрос). */
  input?: string;
  expected?: string;
  actual?: string;
  message?: string;
  /** true, если тест упал из-за ошибки выполнения, а не из-за неверного значения. */
  error?: boolean;
}

export interface ConsoleLine {
  level: 'log' | 'info' | 'warn' | 'error' | 'debug';
  text: string;
}

export interface RunOutcome {
  ok: boolean;
  results: TestResult[];
  logs: ConsoleLine[];
  /** Заметки песочницы: например, что было переписано из MySQL в SQLite. */
  notes: string[];
  durationMs: number;
  /** Заполняется, если код не удалось даже запустить. */
  failure?: {
    message: string;
    stack?: string;
    kind: 'timeout' | 'compile' | 'runtime' | 'sandbox';
  };
}

export interface RunJob {
  runtime: Runtime;
  code: string;
  tests: TestCase[];
  setupSql?: string;
  /** 'test' — прогнать тесты, 'run' — просто выполнить и показать вывод. */
  mode?: 'test' | 'run';
  timeLimitMs?: number;
  /** Дополнительный HTML-каркас для DOM-заданий (вставляется перед кодом). */
  domTemplate?: string;
  /** Размер окна песочницы. Для проверки адаптива — 390×844. */
  viewport?: { width: number; height: number };
}
