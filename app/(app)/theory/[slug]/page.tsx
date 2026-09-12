import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ExternalLink,
  FileCode2,
  GraduationCap,
  Lightbulb,
  ListChecks,
  NotebookPen,
} from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { getQuizzes, getTasks, getTopicById, getTopics } from '@/lib/content';
import { getProgressMap } from '@/lib/progress/service';
import { prisma } from '@/lib/db';
import { Alert, Badge, Card, DifficultyStars, SectionTitle, SourceTag } from '@/components/ui/base';
import { LinkButton } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/layout/app-shell';
import { Markdown } from '@/lib/markdown';
import { CodeBlock } from '@/components/study/code-block';
import { NoteEditor } from '@/components/study/note-editor';
import { TopicActions } from './topic-actions';
import { RUNTIME_LABELS, TECH_LABELS } from '@/content/types';
import { requirementById } from '@/content/exams/requirements';
import { formatMinutes } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopicById(slug);
  return { title: topic?.title ?? 'Теория' };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await getTopicById(slug);
  if (!topic) notFound();

  const user = await requireUser();
  const [progressMap, tasks, quizzes, allTopics, note, reviewItem] = await Promise.all([
    getProgressMap(user.id),
    getTasks(),
    getQuizzes(),
    getTopics(),
    prisma.note.findUnique({
      where: { userId_entityType_entityId: { userId: user.id, entityType: 'topic', entityId: slug } },
    }),
    prisma.reviewItem.findUnique({ where: { userId_topicId: { userId: user.id, topicId: slug } } }),
  ]);

  const completed = progressMap.get(`topic:${topic.id}`)?.status === 'completed';
  const relatedTasks = tasks.filter((task) => task.topicIds.includes(topic.id));
  const quiz = topic.quizId ? quizzes.find((item) => item.id === topic.quizId) : undefined;
  const prerequisites = topic.prerequisites
    .map((id) => allTopics.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const nextTopics = allTopics.filter((item) => item.prerequisites.includes(topic.id)).slice(0, 3);
  const examRefs = topic.examRefs.map((id) => requirementById(id)).filter((item) => Boolean(item));

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      <Breadcrumbs
        items={[
          { label: 'Дашборд', href: '/' },
          { label: 'Теория', href: '/theory' },
          { label: `Месяц ${topic.monthNo}`, href: `/theory?month=${topic.monthNo}` },
          { label: topic.title },
        ]}
      />

      <header>
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          {topic.tech.map((tech) => (
            <Badge key={tech} tone="neutral">
              {TECH_LABELS[tech]}
            </Badge>
          ))}
          <Badge tone={topic.importance === 'core' ? 'bad' : topic.importance === 'supporting' ? 'warn' : 'neutral'}>
            {topic.importance === 'core' ? 'Ключевая тема' : topic.importance === 'supporting' ? 'Вспомогательная' : 'Дополнительная'}
          </Badge>
          <Badge tone="neutral">≈ {formatMinutes(topic.estimatedMinutes)}</Badge>
          <SourceTag source={topic.source} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{topic.title}</h1>
      </header>

      <TopicActions
        topicId={topic.id}
        completed={completed}
        inReview={Boolean(reviewItem)}
        firstTaskId={relatedTasks[0]?.id}
        quizId={quiz?.id}
        estimatedMinutes={topic.estimatedMinutes}
      />

      {/* Кратко */}
      <Card>
        <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-3)' }}>
          <Lightbulb size={13} /> Кратко
        </p>
        <p className="text-sm leading-relaxed">{topic.summary}</p>
      </Card>

      {/* Что необходимо знать */}
      <section>
        <SectionTitle title="Что необходимо знать" />
        <Card>
          <ul className="flex flex-col gap-1.5">
            {topic.mustKnow.map((item, index) => (
              <li key={index} className="flex gap-2 text-sm">
                <ListChecks size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--brand)' }} />
                <span className="prose-content !leading-normal">
                  <Markdown source={item} />
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {prerequisites.length ? (
        <Alert tone="brand" title="Перед этой темой" icon={<GraduationCap size={16} />}>
          <ul className="flex flex-wrap gap-1.5">
            {prerequisites.map((item) => (
              <li key={item.id}>
                <Link href={`/theory/${item.id}`} className="chip hover:underline">
                  {progressMap.get(`topic:${item.id}`)?.status === 'completed' ? '✓ ' : ''}
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </Alert>
      ) : null}

      {/* Подробная теория */}
      <section>
        <SectionTitle title="Подробная теория" />
        <Card>
          <Markdown source={topic.theory} />
        </Card>
      </section>

      {/* Примеры */}
      {topic.examples.length ? (
        <section>
          <SectionTitle title="Примеры" subtitle="Разберите и перепишите по памяти — так советует программа" />
          <div className="flex flex-col gap-3">
            {topic.examples.map((example, index) => (
              <Card key={index}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{example.title}</p>
                  <Badge tone="neutral">{example.language}</Badge>
                </div>
                <CodeBlock code={example.code} language={example.language} runnable={example.runnable} />
                {example.explanation ? (
                  <p className="mt-2 text-sm" style={{ color: 'var(--ink-2)' }}>
                    {example.explanation}
                  </p>
                ) : null}
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {/* Практический пример */}
      {topic.practicalExample ? (
        <section>
          <SectionTitle title="Практический пример" subtitle="Как эта тема выглядит в проекте демоэкзамена" />
          <Card>
            <p className="mb-2 text-sm font-medium">{topic.practicalExample.title}</p>
            <CodeBlock
              code={topic.practicalExample.code}
              language={topic.practicalExample.language}
              runnable={topic.practicalExample.runnable}
            />
            {topic.practicalExample.explanation ? (
              <p className="mt-2 text-sm" style={{ color: 'var(--ink-2)' }}>
                {topic.practicalExample.explanation}
              </p>
            ) : null}
          </Card>
        </section>
      ) : null}

      {/* Типичные ошибки */}
      {topic.mistakes.length ? (
        <section>
          <SectionTitle title="Типичные ошибки" subtitle="То, на чём теряют баллы чаще всего" />
          <div className="flex flex-col gap-2">
            {topic.mistakes.map((mistake, index) => (
              <Card key={index}>
                <p className="flex items-start gap-2 text-sm font-medium">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--warn)' }} />
                  {mistake.title}
                </p>
                {mistake.wrong ? (
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {/* min-w-0: без него колонка грида растягивается по ширине кода внутри. */}
                    <div className="min-w-0">
                      <p className="mb-1 text-xs font-semibold" style={{ color: 'var(--bad)' }}>
                        Так не надо
                      </p>
                      <CodeBlock code={mistake.wrong} language="text" compact />
                    </div>
                    {mistake.right ? (
                      <div className="min-w-0">
                        <p className="mb-1 text-xs font-semibold" style={{ color: 'var(--ok)' }}>
                          А так правильно
                        </p>
                        <CodeBlock code={mistake.right} language="text" compact />
                      </div>
                    ) : null}
                  </div>
                ) : null}
                <p className="mt-2 text-sm" style={{ color: 'var(--ink-2)' }}>
                  {mistake.why}
                </p>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {/* Связь с экзаменом */}
      {examRefs.length ? (
        <section>
          <SectionTitle title="Где это на экзамене" subtitle="Дословные формулировки из задания демоэкзамена" />
          <div className="flex flex-col gap-2">
            {examRefs.map((requirement) => (
              <Card key={requirement!.id}>
                <div className="mb-1 flex flex-wrap items-center gap-1.5">
                  <Badge tone="bad">Модуль {requirement!.moduleNo}</Badge>
                  <span className="text-sm font-medium">{requirement!.title}</span>
                </div>
                <blockquote
                  className="rounded-lg border-l-2 px-3 py-2 text-sm"
                  style={{ borderColor: 'var(--bad)', background: 'var(--surface-2)', color: 'var(--ink-2)' }}
                >
                  {requirement!.quote}
                </blockquote>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {/* Мини-тест */}
      <section>
        <SectionTitle title="Мини-тест" subtitle="Короткая проверка: поняли ли вы тему" />
        {quiz ? (
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium">{quiz.title}</p>
                <p className="text-xs" style={{ color: 'var(--ink-3)' }}>
                  {quiz.questions.length} вопросов · проходной балл {quiz.passPercent}%
                </p>
              </div>
              <LinkButton href={`/quiz/${quiz.id}`} variant="primary" size="sm" icon={<Lightbulb size={14} />}>
                Пройти тест
              </LinkButton>
            </div>
          </Card>
        ) : (
          <Card>
            <p className="text-sm" style={{ color: 'var(--ink-3)' }}>
              Мини-тест для этой темы ещё не добавлен.
            </p>
          </Card>
        )}
      </section>

      {/* Практика */}
      <section>
        <SectionTitle title="Практика" subtitle="Код пишется в браузере и проверяется автотестами" />
        {relatedTasks.length ? (
          <ul className="flex flex-col gap-2">
            {relatedTasks.map((task) => (
              <li key={task.id}>
                <Link href={`/tasks/${task.id}`} className="card flex items-center gap-3 p-3 hover:-translate-y-px">
                  <FileCode2 size={16} style={{ color: 'var(--brand)' }} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{task.title}</span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-2 text-xs" style={{ color: 'var(--ink-3)' }}>
                      <DifficultyStars level={task.difficulty} />
                      <span>{RUNTIME_LABELS[task.runtime]}</span>
                      <span>{task.tests.length} тестов</span>
                    </span>
                  </span>
                  {progressMap.get(`task:${task.id}`)?.status === 'completed' ? <Badge tone="ok">Решено</Badge> : null}
                  <ArrowRight size={15} style={{ color: 'var(--ink-3)' }} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Card>
            <p className="text-sm" style={{ color: 'var(--ink-3)' }}>
              Практические задания для этой темы ещё не добавлены.
            </p>
          </Card>
        )}
      </section>

      {/* Заметка */}
      <section>
        <SectionTitle title="Личная заметка" subtitle="Конспект по теме — сохраняется автоматически" />
        <Card>
          <NoteEditor
            entityType="topic"
            entityId={topic.id}
            initialValue={note?.body ?? ''}
            placeholder="Главное из темы своими словами…"
            icon={<NotebookPen size={14} />}
          />
        </Card>
      </section>

      {/* Дополнительные материалы */}
      {topic.resources.length ? (
        <section>
          <SectionTitle title="Дополнительные материалы" />
          <Card>
            <ul className="flex flex-col gap-2">
              {topic.resources.map((resource) => (
                <li key={resource.url}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-sm hover:underline"
                  >
                    <ExternalLink size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--brand)' }} />
                    <span>
                      {resource.title}
                      {resource.note ? (
                        <span className="block text-xs" style={{ color: 'var(--ink-3)' }}>
                          {resource.note}
                        </span>
                      ) : null}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs" style={{ color: 'var(--ink-3)' }}>
              Ссылки открываются во внешнем браузере. На экзамене интернета не будет — материалы нужно изучить заранее.
            </p>
          </Card>
        </section>
      ) : null}

      {nextTopics.length ? (
        <section>
          <SectionTitle title="Что дальше" />
          <ul className="flex flex-wrap gap-2">
            {nextTopics.map((item) => (
              <li key={item.id}>
                <Link href={`/theory/${item.id}`} className="chip hover:underline">
                  <BookOpen size={11} /> {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
