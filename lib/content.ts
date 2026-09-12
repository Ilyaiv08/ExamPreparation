import 'server-only';
import { cache } from 'react';

import { prisma } from '@/lib/db';
import { ALL_TOPICS } from '@/content/topics';
import { ALL_TASKS } from '@/content/tasks';
import { ALL_QUIZZES } from '@/content/quizzes';
import { ALL_PROJECTS } from '@/content/projects';
import { ALL_EXAMS } from '@/content/exams';
import { MONTHS, ALL_DAYS, ALL_WEEKS } from '@/content/curriculum';
import type { Exam, Project, Quiz, Task, Topic } from '@/content/types';

/**
 * Слой контента: файлы + правки из админки.
 *
 * Базовый контент лежит в `content/**` (раздел 29 ТЗ: контент отделён от логики),
 * а администратор может изменить или добавить сущность, не трогая код —
 * его правки хранятся в таблице ContentOverride и накладываются здесь
 * (раздел 31 ТЗ).
 *
 * cache() из React мемоизирует результат на время одного запроса,
 * поэтому одна страница не ходит в базу за переопределениями по десять раз.
 */

type OverrideRow = { entityId: string; dataJson: string; disabled: boolean; isNew: boolean };

const loadOverrides = cache(async (entityType: string): Promise<OverrideRow[]> => {
  try {
    return await prisma.contentOverride.findMany({
      where: { entityType },
      select: { entityId: true, dataJson: true, disabled: true, isNew: true },
    });
  } catch {
    // Если база ещё не создана, платформа обязана показывать файловый контент.
    return [];
  }
});

function applyOverrides<T extends { id: string }>(base: T[], overrides: OverrideRow[]): T[] {
  if (!overrides.length) return base;

  const byId = new Map(overrides.map((row) => [row.entityId, row]));
  const result: T[] = [];

  for (const item of base) {
    const override = byId.get(item.id);
    if (!override) {
      result.push(item);
      continue;
    }
    byId.delete(item.id);
    if (override.disabled) continue;
    try {
      result.push({ ...item, ...(JSON.parse(override.dataJson) as Partial<T>), id: item.id });
    } catch {
      result.push(item);
    }
  }

  // Сущности, созданные целиком в админке.
  for (const row of byId.values()) {
    if (row.disabled) continue;
    try {
      result.push(JSON.parse(row.dataJson) as T);
    } catch {
      // Повреждённая запись не должна ронять страницу.
    }
  }

  return result;
}

export const getTopics = cache(async (): Promise<Topic[]> => applyOverrides(ALL_TOPICS, await loadOverrides('topic')));
export const getTasks = cache(async (): Promise<Task[]> => applyOverrides(ALL_TASKS, await loadOverrides('task')));
export const getQuizzes = cache(async (): Promise<Quiz[]> => applyOverrides(ALL_QUIZZES, await loadOverrides('quiz')));
export const getProjects = cache(
  async (): Promise<Project[]> => applyOverrides(ALL_PROJECTS, await loadOverrides('project')),
);
export const getExams = cache(async (): Promise<Exam[]> => applyOverrides(ALL_EXAMS, await loadOverrides('exam')));

export const getTopicById = cache(async (id: string): Promise<Topic | undefined> => {
  return (await getTopics()).find((item) => item.id === id);
});

export const getTaskById = cache(async (id: string): Promise<Task | undefined> => {
  return (await getTasks()).find((item) => item.id === id);
});

export const getQuizById = cache(async (id: string): Promise<Quiz | undefined> => {
  return (await getQuizzes()).find((item) => item.id === id);
});

export const getProjectById = cache(async (id: string): Promise<Project | undefined> => {
  return (await getProjects()).find((item) => item.id === id);
});

export const getExamById = cache(async (id: string): Promise<Exam | undefined> => {
  return (await getExams()).find((item) => item.id === id);
});

/** Сводка по объёму контента — для дашборда и админки. */
export const getContentStats = cache(async () => {
  const [topics, tasks, quizzes, projects, exams] = await Promise.all([
    getTopics(),
    getTasks(),
    getQuizzes(),
    getProjects(),
    getExams(),
  ]);
  return {
    months: MONTHS.length,
    weeks: ALL_WEEKS.length,
    days: ALL_DAYS.length,
    topics: topics.length,
    tasks: tasks.length,
    quizzes: quizzes.length,
    questions: quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0),
    projects: projects.length,
    exams: exams.length,
  };
});
