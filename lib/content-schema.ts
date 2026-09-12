import { z } from 'zod';
import { TECHS } from '@/content/types';

/**
 * Схемы для проверки контента, который правит администратор.
 *
 * Контент из админки попадает в приложение, поэтому его нельзя принимать
 * «как есть»: битая запись сломала бы страницу для студента.
 */

const techSchema = z.enum(TECHS);
const difficultySchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]);
const sourceSchema = z.enum(['plan', 'exam', 'docs', 'author']);

const resourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().min(1),
  kind: z.enum(['docs', 'tutorial', 'practice', 'reference']),
  source: sourceSchema,
  note: z.string().optional(),
});

const hintSchema = z.object({
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  text: z.string().min(1),
  penaltyPercent: z.number().min(0).max(100),
});

const codeExampleSchema = z.object({
  title: z.string().min(1),
  language: z.string().min(1),
  code: z.string(),
  explanation: z.string().optional(),
  runnable: z.boolean().optional(),
});

export const topicSchema = z.object({
  id: z.string().min(2),
  title: z.string().min(2),
  tech: z.array(techSchema).min(1),
  monthNo: z.number().int().min(1).max(9),
  weekNo: z.number().int().min(1).max(30).optional(),
  importance: z.enum(['core', 'supporting', 'extra']),
  summary: z.string().min(10),
  mustKnow: z.array(z.string().min(1)).min(1),
  theory: z.string().min(50),
  examples: z.array(codeExampleSchema),
  practicalExample: codeExampleSchema.optional(),
  mistakes: z.array(
    z.object({
      title: z.string().min(1),
      wrong: z.string().optional(),
      right: z.string().optional(),
      why: z.string().min(1),
    }),
  ),
  quizId: z.string().optional(),
  taskIds: z.array(z.string()),
  projectIds: z.array(z.string()).optional(),
  resources: z.array(resourceSchema),
  examRefs: z.array(z.string()),
  prerequisites: z.array(z.string()),
  estimatedMinutes: z.number().int().min(1).max(600),
  planDays: z.array(z.string()),
  source: sourceSchema,
});

const testCaseSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    type: z.literal('call'),
    entry: z.string().min(1),
    args: z.array(z.unknown()),
    expected: z.unknown(),
    compare: z.enum(['deep', 'strict', 'approx', 'set', 'string']).optional(),
    tolerance: z.number().optional(),
    points: z.number().optional(),
    hidden: z.boolean().optional(),
  }),
  z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    type: z.literal('expr'),
    expression: z.string().min(1),
    expected: z.unknown(),
    compare: z.enum(['deep', 'strict', 'approx', 'set', 'string']).optional(),
    tolerance: z.number().optional(),
    points: z.number().optional(),
    hidden: z.boolean().optional(),
  }),
  z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    type: z.literal('assert'),
    code: z.string().min(1),
    points: z.number().optional(),
    hidden: z.boolean().optional(),
  }),
  z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    type: z.literal('dom'),
    code: z.string().min(1),
    points: z.number().optional(),
    hidden: z.boolean().optional(),
  }),
  z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    type: z.literal('react'),
    code: z.string().min(1),
    points: z.number().optional(),
    hidden: z.boolean().optional(),
  }),
  z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    type: z.literal('sql-query'),
    check: z.string().min(1),
    expectedColumns: z.array(z.string()).optional(),
    expectedRows: z.array(z.array(z.unknown())),
    ordered: z.boolean().optional(),
    points: z.number().optional(),
    hidden: z.boolean().optional(),
  }),
  z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    type: z.literal('sql-schema'),
    table: z.string().min(1),
    columns: z.array(
      z.object({
        name: z.string().min(1),
        type: z.string().optional(),
        notNull: z.boolean().optional(),
        pk: z.boolean().optional(),
      }),
    ),
    foreignKeys: z
      .array(z.object({ column: z.string(), refTable: z.string(), refColumn: z.string().optional() }))
      .optional(),
    points: z.number().optional(),
    hidden: z.boolean().optional(),
  }),
]);

export const taskSchema = z.object({
  id: z.string().min(2),
  title: z.string().min(2),
  kind: z.enum(['function', 'fix-bug', 'find-bug', 'complete', 'output', 'api', 'db', 'files', 'app']),
  runtime: z.enum(['js', 'ts', 'dom', 'react', 'sql']),
  difficulty: difficultySchema,
  tech: z.array(techSchema).min(1),
  topicIds: z.array(z.string()),
  monthNo: z.number().int().min(1).max(9),
  weekNo: z.number().int().min(1).max(30).optional(),
  statement: z.string().min(10),
  requirements: z.array(z.string()),
  starterCode: z.string(),
  extraFiles: z.array(z.object({ path: z.string(), content: z.string(), language: z.string() })).optional(),
  setupSql: z.string().optional(),
  viewport: z.object({ width: z.number().int(), height: z.number().int() }).optional(),
  tests: z.array(testCaseSchema).min(1),
  hints: z.array(hintSchema),
  solution: z.string().min(1),
  solutionExplanation: z.string(),
  maxScore: z.number().min(1),
  timeLimitMs: z.number().int().optional(),
  estimatedMinutes: z.number().int().min(1).max(600),
  examRefs: z.array(z.string()),
  resources: z.array(resourceSchema).optional(),
  planDays: z.array(z.string()).optional(),
  source: sourceSchema,
});

const quizOptionSchema = z.object({ id: z.string().min(1), text: z.string().min(1) });

const questionSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string().min(1),
    type: z.literal('single'),
    text: z.string().min(1),
    options: z.array(quizOptionSchema).min(2),
    correct: z.string().min(1),
    explanation: z.string(),
    points: z.number().optional(),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal('multiple'),
    text: z.string().min(1),
    options: z.array(quizOptionSchema).min(2),
    correct: z.array(z.string()).min(1),
    explanation: z.string(),
    points: z.number().optional(),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal('boolean'),
    text: z.string().min(1),
    correct: z.boolean(),
    explanation: z.string(),
    points: z.number().optional(),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal('match'),
    text: z.string().min(1),
    left: z.array(quizOptionSchema).min(2),
    right: z.array(quizOptionSchema).min(2),
    correct: z.record(z.string(), z.string()),
    explanation: z.string(),
    points: z.number().optional(),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal('order'),
    text: z.string().min(1),
    items: z.array(quizOptionSchema).min(2),
    correct: z.array(z.string()).min(2),
    explanation: z.string(),
    points: z.number().optional(),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal('text'),
    text: z.string().min(1),
    correct: z.array(z.string()).min(1),
    caseSensitive: z.boolean().optional(),
    normalize: z.boolean().optional(),
    explanation: z.string(),
    points: z.number().optional(),
  }),
]);

export const quizSchema = z.object({
  id: z.string().min(2),
  title: z.string().min(2),
  topicIds: z.array(z.string()),
  tech: z.array(techSchema),
  monthNo: z.number().int().min(1).max(9),
  difficulty: difficultySchema,
  questions: z.array(questionSchema).min(1),
  passPercent: z.number().int().min(0).max(100),
  examRefs: z.array(z.string()).optional(),
});

export const projectSchema = z.object({
  id: z.string().min(2),
  title: z.string().min(2),
  goal: z.string().min(5),
  monthNo: z.number().int().min(1).max(9),
  difficulty: difficultySchema,
  tech: z.array(techSchema),
  topicIds: z.array(z.string()),
  examRefs: z.array(z.string()),
  brief: z.string().min(20),
  requirements: z.array(z.string()),
  constraints: z.array(z.string()),
  checklist: z
    .array(
      z.object({
        id: z.string().min(1),
        text: z.string().min(1),
        weight: z.number().min(0),
        verification: z.enum(['auto', 'manual']),
      }),
    )
    .min(1),
  hints: z.array(hintSchema),
  resources: z.array(resourceSchema),
  autoCheck: z
    .object({
      runtime: z.enum(['js', 'ts', 'dom', 'react', 'sql']),
      starterCode: z.string(),
      setupSql: z.string().optional(),
      tests: z.array(testCaseSchema).min(1),
      maxScore: z.number().min(1),
    })
    .optional(),
  estimatedHours: z.number().min(0.5),
  planDays: z.array(z.string()).optional(),
  source: sourceSchema,
});

const examTaskSchema = z.discriminatedUnion('kind', [
  z.object({ id: z.string(), kind: z.literal('code'), taskId: z.string(), points: z.number(), title: z.string().optional() }),
  z.object({ id: z.string(), kind: z.literal('quiz'), quizId: z.string(), points: z.number(), title: z.string().optional() }),
  z.object({
    id: z.string(),
    kind: z.literal('checklist'),
    title: z.string(),
    description: z.string(),
    items: z.array(z.object({ id: z.string(), text: z.string(), points: z.number(), quote: z.string().optional() })),
    points: z.number(),
  }),
]);

export const examSchema = z.object({
  id: z.string().min(2),
  title: z.string().min(2),
  kind: z.enum(['demo', 'practice', 'generated']),
  level: z.enum(['easy', 'standard', 'hard', 'exam']),
  domain: z.string().min(2),
  description: z.string().min(10),
  sourceNote: z.string(),
  source: sourceSchema,
  totalMinutes: z.number().int().min(1),
  modules: z
    .array(
      z.object({
        id: z.string(),
        moduleNo: z.union([z.literal(1), z.literal(2), z.literal(3)]),
        title: z.string(),
        minutes: z.number().int().min(1),
        instruction: z.string(),
        tasks: z.array(examTaskSchema),
      }),
    )
    .min(1),
  examRefs: z.array(z.string()),
});

export const CONTENT_SCHEMAS = {
  topic: topicSchema,
  task: taskSchema,
  quiz: quizSchema,
  project: projectSchema,
  exam: examSchema,
} as const;

export type ContentType = keyof typeof CONTENT_SCHEMAS;

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  topic: 'Темы (теория)',
  task: 'Практические задания',
  quiz: 'Теоретические тесты',
  project: 'Мини-проекты',
  exam: 'Экзаменационные варианты',
};

/** Проверка объекта контента. Возвращает понятный список проблем. */
export function validateContent(type: ContentType, data: unknown): { ok: true } | { ok: false; errors: string[] } {
  const result = CONTENT_SCHEMAS[type].safeParse(data);
  if (result.success) return { ok: true };
  return {
    ok: false,
    errors: result.error.issues.slice(0, 20).map((issue) => `${issue.path.join('.') || 'корень'}: ${issue.message}`),
  };
}
