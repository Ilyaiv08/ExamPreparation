import 'server-only';

import { prisma } from '@/lib/db';
import { getExams, getProjects, getQuizzes, getTasks, getTopics } from '@/lib/content';
import { ALL_DAYS } from '@/content/curriculum';
import { EXAM_REQUIREMENTS } from '@/content/exams/requirements';
import { markdownToPlainText } from '@/lib/markdown';

/**
 * Глобальный поиск (раздел 26 ТЗ): теория, темы, задачи, технологии,
 * проекты, экзаменационные задания, заметки и дни учебного плана.
 *
 * Поиск простой и предсказуемый: совпадение по подстроке с весами по полям.
 * Отдельная поисковая система здесь была бы лишней сложностью.
 */

export type SearchKind = 'topic' | 'task' | 'quiz' | 'project' | 'exam' | 'day' | 'note' | 'requirement';

export interface SearchResult {
  kind: SearchKind;
  id: string;
  title: string;
  excerpt: string;
  href: string;
  score: number;
  meta?: string;
}

export const KIND_LABELS: Record<SearchKind, string> = {
  topic: 'Теория',
  task: 'Практическое задание',
  quiz: 'Тест',
  project: 'Мини-проект',
  exam: 'Экзамен',
  day: 'День плана',
  note: 'Заметка',
  requirement: 'Требование экзамена',
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/ё/g, 'е');
}

/** Балл совпадения: заголовок весит больше, чем текст. */
function match(query: string, fields: { text: string; weight: number }[]): { score: number; excerpt: string } {
  const needle = normalize(query);
  let score = 0;
  let excerpt = '';

  for (const field of fields) {
    const haystack = normalize(field.text);
    const index = haystack.indexOf(needle);
    if (index === -1) continue;

    // Совпадение в начале строки ценнее, чем где-то в середине.
    score += field.weight * (index === 0 ? 1.5 : 1);
    if (!excerpt) {
      const start = Math.max(0, index - 60);
      const end = Math.min(field.text.length, index + needle.length + 90);
      excerpt = `${start > 0 ? '…' : ''}${field.text.slice(start, end).trim()}${end < field.text.length ? '…' : ''}`;
    }
  }

  return { score, excerpt };
}

export async function search(query: string, userId: string, limit = 40): Promise<SearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const [topics, tasks, quizzes, projects, exams, notes] = await Promise.all([
    getTopics(),
    getTasks(),
    getQuizzes(),
    getProjects(),
    getExams(),
    prisma.note.findMany({ where: { userId }, take: 200 }),
  ]);

  const results: SearchResult[] = [];

  for (const topic of topics) {
    const { score, excerpt } = match(trimmed, [
      { text: topic.title, weight: 10 },
      { text: topic.summary, weight: 5 },
      { text: topic.mustKnow.join(' · '), weight: 3 },
      { text: markdownToPlainText(topic.theory), weight: 2 },
      { text: topic.tech.join(' '), weight: 2 },
      { text: topic.id, weight: 2 },
    ]);
    if (score > 0) {
      results.push({
        kind: 'topic',
        id: topic.id,
        title: topic.title,
        excerpt: excerpt || topic.summary,
        href: `/theory/${topic.id}`,
        score,
        meta: `Месяц ${topic.monthNo}`,
      });
    }
  }

  for (const task of tasks) {
    const { score, excerpt } = match(trimmed, [
      { text: task.title, weight: 10 },
      { text: markdownToPlainText(task.statement), weight: 4 },
      { text: task.requirements.join(' · '), weight: 3 },
      { text: task.tech.join(' '), weight: 2 },
      { text: task.runtime, weight: 2 },
      { text: task.id, weight: 2 },
    ]);
    if (score > 0) {
      results.push({
        kind: 'task',
        id: task.id,
        title: task.title,
        excerpt: excerpt || markdownToPlainText(task.statement).slice(0, 140),
        href: `/tasks/${task.id}`,
        score,
        meta: `Месяц ${task.monthNo} · сложность ${task.difficulty}`,
      });
    }
  }

  for (const quiz of quizzes) {
    const { score, excerpt } = match(trimmed, [
      { text: quiz.title, weight: 9 },
      { text: quiz.questions.map((question) => question.text).join(' · '), weight: 3 },
    ]);
    if (score > 0) {
      results.push({
        kind: 'quiz',
        id: quiz.id,
        title: quiz.title,
        excerpt: excerpt || `${quiz.questions.length} вопросов`,
        href: `/quiz/${quiz.id}`,
        score,
      });
    }
  }

  for (const project of projects) {
    const { score, excerpt } = match(trimmed, [
      { text: project.title, weight: 10 },
      { text: project.goal, weight: 5 },
      { text: markdownToPlainText(project.brief), weight: 2 },
      { text: project.requirements.join(' · '), weight: 2 },
    ]);
    if (score > 0) {
      results.push({
        kind: 'project',
        id: project.id,
        title: project.title,
        excerpt: excerpt || project.goal,
        href: `/projects/${project.id}`,
        score,
        meta: `Месяц ${project.monthNo}`,
      });
    }
  }

  for (const exam of exams) {
    const { score, excerpt } = match(trimmed, [
      { text: exam.title, weight: 9 },
      { text: exam.domain, weight: 4 },
      { text: markdownToPlainText(exam.description), weight: 2 },
      { text: exam.modules.map((module) => markdownToPlainText(module.instruction)).join(' '), weight: 2 },
    ]);
    if (score > 0) {
      results.push({
        kind: 'exam',
        id: exam.id,
        title: exam.title,
        excerpt: excerpt || exam.domain,
        href: `/exams/${exam.id}`,
        score,
      });
    }
  }

  for (const requirement of EXAM_REQUIREMENTS) {
    const { score, excerpt } = match(trimmed, [
      { text: requirement.title, weight: 8 },
      { text: requirement.quote, weight: 4 },
      { text: requirement.checklist.join(' · '), weight: 2 },
    ]);
    if (score > 0) {
      results.push({
        kind: 'requirement',
        id: requirement.id,
        title: requirement.title,
        excerpt: excerpt || requirement.quote.slice(0, 160),
        href: `/exams`,
        score,
        meta: `Модуль ${requirement.moduleNo}`,
      });
    }
  }

  for (const day of ALL_DAYS) {
    const { score, excerpt } = match(trimmed, [
      { text: day.title, weight: 5 },
      { text: day.theory, weight: 3 },
      { text: day.practice, weight: 3 },
    ]);
    if (score > 0) {
      results.push({
        kind: 'day',
        id: day.id,
        title: day.title,
        excerpt: excerpt || day.practice,
        href: `/plan/day/${day.id}`,
        score: score * 0.7, // дни плана — вспомогательный результат
        meta: `Неделя ${day.weekId.replace('week-', '')} · день ${day.dayNo}`,
      });
    }
  }

  for (const note of notes) {
    const { score, excerpt } = match(trimmed, [{ text: note.body, weight: 6 }]);
    if (score > 0) {
      const href =
        note.entityType === 'topic'
          ? `/theory/${note.entityId}`
          : note.entityType === 'day'
            ? `/plan/day/${note.entityId}`
            : `/tasks/${note.entityId}`;
      results.push({
        kind: 'note',
        id: note.id,
        title: 'Ваша заметка',
        excerpt,
        href,
        score,
        meta: note.entityId,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
