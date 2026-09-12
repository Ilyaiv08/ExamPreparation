import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { getExamById, getProjectById, getQuizById, getTaskById, getTopicById } from '@/lib/content';
import { Breadcrumbs } from '@/components/layout/app-shell';
import { ContentEditor } from './content-editor';
import { CONTENT_TYPE_LABELS, type ContentType } from '@/lib/content-schema';

export const dynamic = 'force-dynamic';

const TYPES: ContentType[] = ['topic', 'task', 'quiz', 'project', 'exam'];

export const metadata: Metadata = { title: 'Редактор контента' };

export default async function AdminEditPage({ params }: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await params;
  if (!TYPES.includes(type as ContentType)) notFound();
  const contentType = type as ContentType;

  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'admin') redirect('/');

  const isNew = id === 'new';
  const entity = isNew ? null : await loadEntity(contentType, id);
  if (!isNew && !entity) notFound();

  const override = isNew
    ? null
    : await prisma.contentOverride.findUnique({
        where: { entityType_entityId: { entityType: contentType, entityId: id } },
      });

  const initialJson = isNew ? templateFor(contentType) : JSON.stringify(entity, null, 2);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <Breadcrumbs
        items={[
          { label: 'Дашборд', href: '/' },
          { label: 'Админ-панель', href: '/admin' },
          { label: CONTENT_TYPE_LABELS[contentType], href: `/admin/${contentType}` },
          { label: isNew ? 'Новая запись' : id },
        ]}
      />

      <ContentEditor
        type={contentType}
        entityId={isNew ? '' : id}
        initialJson={initialJson}
        hasOverride={Boolean(override)}
        isDisabled={Boolean(override?.disabled)}
        isNew={isNew}
      />
    </div>
  );
}

async function loadEntity(type: ContentType, id: string) {
  switch (type) {
    case 'topic':
      return getTopicById(id);
    case 'task':
      return getTaskById(id);
    case 'quiz':
      return getQuizById(id);
    case 'project':
      return getProjectById(id);
    case 'exam':
      return getExamById(id);
    default:
      return undefined;
  }
}

/** Заготовка новой записи — чтобы не вспоминать структуру наизусть. */
function templateFor(type: ContentType): string {
  const templates: Record<ContentType, unknown> = {
    topic: {
      id: 'new-topic',
      title: 'Название темы',
      tech: ['js'],
      monthNo: 2,
      importance: 'core',
      summary: 'Краткое описание темы в одно-два предложения.',
      mustKnow: ['Первый тезис', 'Второй тезис'],
      theory: '## Заголовок\n\nТекст теории в формате Markdown. Минимум пятьдесят символов, иначе проверка не пройдёт.',
      examples: [{ title: 'Пример', language: 'javascript', code: 'console.log(1);' }],
      mistakes: [{ title: 'Типичная ошибка', why: 'Почему так делать не стоит.' }],
      taskIds: [],
      resources: [],
      examRefs: [],
      prerequisites: [],
      estimatedMinutes: 40,
      planDays: [],
      source: 'author',
    },
    task: {
      id: 'new-task',
      title: 'Название задания',
      kind: 'function',
      runtime: 'js',
      difficulty: 2,
      tech: ['js'],
      topicIds: [],
      monthNo: 2,
      statement: 'Условие задания в формате Markdown.',
      requirements: ['Первое требование'],
      starterCode: 'function solve() {\n  // ваш код\n}',
      tests: [
        {
          id: 'test-1',
          name: 'Первый тест',
          type: 'call',
          entry: 'solve',
          args: [],
          expected: null,
        },
      ],
      hints: [
        { level: 1, text: 'Направление мысли', penaltyPercent: 10 },
        { level: 2, text: 'Часть алгоритма', penaltyPercent: 20 },
        { level: 3, text: 'Почти готовая структура', penaltyPercent: 35 },
      ],
      solution: 'function solve() {\n  return null;\n}',
      solutionExplanation: 'Почему решение выглядит именно так.',
      maxScore: 10,
      estimatedMinutes: 15,
      examRefs: [],
      source: 'author',
    },
    quiz: {
      id: 'new-quiz',
      title: 'Название теста',
      topicIds: [],
      tech: ['js'],
      monthNo: 2,
      difficulty: 2,
      passPercent: 70,
      questions: [
        {
          id: 'q1',
          type: 'single',
          text: 'Текст вопроса?',
          options: [
            { id: 'a', text: 'Вариант A' },
            { id: 'b', text: 'Вариант B' },
          ],
          correct: 'a',
          explanation: 'Почему верен вариант A.',
        },
      ],
    },
    project: {
      id: 'new-project',
      title: 'Название проекта',
      goal: 'Цель проекта одним предложением.',
      monthNo: 2,
      difficulty: 3,
      tech: ['js'],
      topicIds: [],
      examRefs: [],
      brief: '## Техническое задание\n\nЧто нужно сделать.',
      requirements: ['Первое требование'],
      constraints: ['Первое ограничение'],
      checklist: [{ id: 'c1', text: 'Первый пункт чек-листа', weight: 1, verification: 'manual' }],
      hints: [],
      resources: [],
      estimatedHours: 3,
      source: 'author',
    },
    exam: {
      id: 'new-exam',
      title: 'Название варианта',
      kind: 'practice',
      level: 'standard',
      domain: 'Предметная область',
      description: 'Описание варианта.',
      sourceNote: 'Тренировочный вариант платформы.',
      source: 'author',
      totalMinutes: 60,
      modules: [
        {
          id: 'module-1',
          moduleNo: 1,
          title: 'Модуль 1',
          minutes: 60,
          instruction: 'Инструкция модуля.',
          tasks: [],
        },
      ],
      examRefs: [],
    },
  };
  return JSON.stringify(templates[type], null, 2);
}
