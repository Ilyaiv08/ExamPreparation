import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, BookOpen, Code2, GitCommit, Lightbulb, NotebookPen, Target } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { ALL_DAYS, getDay, getMonth, getWeek } from '@/content/curriculum';
import { getProgressMap, todayPlanDay } from '@/lib/progress/service';
import { planDayDate, planWeekRange, STATUS_LABELS, type ProgressStatus } from '@/lib/progress/logic';
import { getProjects, getQuizzes, getTasks, getTopics } from '@/lib/content';
import { Alert, Badge, Card, DifficultyStars, SectionTitle } from '@/components/ui/base';
import { LinkButton } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/layout/app-shell';
import { DAY_KIND_LABELS, RUNTIME_LABELS } from '@/content/types';
import { formatMinutes, toRuDate } from '@/lib/utils';
import { Markdown } from '@/lib/markdown';
import { DayCompleteButton } from './day-complete-button';
import { NoteEditor } from '@/components/study/note-editor';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ dayId: string }> }): Promise<Metadata> {
  const { dayId } = await params;
  const day = getDay(dayId);
  return { title: day ? day.title : 'День плана' };
}

export default async function DayPage({ params }: { params: Promise<{ dayId: string }> }) {
  const { dayId } = await params;
  const day = getDay(dayId);
  if (!day) notFound();

  const user = await requireUser();
  const [progressMap, topics, tasks, quizzes, projects, note] = await Promise.all([
    getProgressMap(user.id),
    getTopics(),
    getTasks(),
    getQuizzes(),
    getProjects(),
    prisma.note.findUnique({
      where: { userId_entityType_entityId: { userId: user.id, entityType: 'day', entityId: dayId } },
    }),
  ]);

  const week = getWeek(day.weekId);
  const month = getMonth(day.monthId);
  const { day: todayDay } = todayPlanDay(user.startDate);

  const status = (progressMap.get(`day:${dayId}`)?.status as ProgressStatus | undefined) ?? 'not_started';
  const dayTopics = day.topicIds.map((id) => topics.find((t) => t.id === id)).filter(Boolean);
  const dayTasks = day.taskIds.map((id) => tasks.find((t) => t.id === id)).filter(Boolean);
  const dayQuizzes = day.quizIds.map((id) => quizzes.find((q) => q.id === id)).filter(Boolean);
  const dayProject = day.projectId ? projects.find((p) => p.id === day.projectId) : undefined;

  const index = ALL_DAYS.findIndex((item) => item.id === day.id);
  // Календарь считается от даты старта студента, а не от даты из файла программы.
  const dayDate = planDayDate(user.startDate, index);
  const weekRange = week ? planWeekRange(user.startDate, week.weekNo).label : '';
  const prev = index > 0 ? ALL_DAYS[index - 1] : null;
  const next = index < ALL_DAYS.length - 1 ? ALL_DAYS[index + 1] : null;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <Breadcrumbs
        items={[
          { label: 'Дашборд', href: '/' },
          { label: 'Учебный план', href: '/plan' },
          { label: `Неделя ${week?.weekNo ?? ''}`, href: `/plan/week/${day.weekId}` },
          { label: `День ${day.dayNo}` },
        ]}
      />

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <Badge tone={day.kind === 'control' ? 'warn' : day.kind === 'rest' ? 'neutral' : 'brand'}>
              {DAY_KIND_LABELS[day.kind]}
            </Badge>
            {todayDay?.id === day.id ? <Badge tone="ok">Сегодня</Badge> : null}
            <Badge tone="neutral">{STATUS_LABELS[status]}</Badge>
            {day.estimatedMinutes ? <Badge tone="neutral">≈ {formatMinutes(day.estimatedMinutes)}</Badge> : null}
          </div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{day.title}</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink-3)' }}>
            Месяц {month?.monthNo}. {month?.shortTitle} · Неделя {week?.weekNo} ({weekRange}) · День {day.dayNo} · {toRuDate(dayDate)}
          </p>
        </div>
        <DayCompleteButton dayId={day.id} completed={status === 'completed'} />
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-3)' }}>
            <BookOpen size={13} /> Что изучаем · 30–45 минут
          </p>
          {day.plain?.theory ? (
            <p className="text-sm leading-relaxed">{day.plain.theory}</p>
          ) : day.theory ? (
            <p className="text-sm leading-relaxed">{day.theory}</p>
          ) : (
            <p className="text-sm" style={{ color: 'var(--ink-3)' }}>
              В этот день теории по программе нет — только практика.
            </p>
          )}
        </Card>

        <Card>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-3)' }}>
            <Code2 size={13} /> Что делаем руками · 1,5–2 часа
          </p>
          <p className="text-sm leading-relaxed">{day.plain?.practice || day.practice || '—'}</p>
        </Card>
      </div>

      {day.plain?.why ? (
        <Alert tone="brand" icon={<Target size={16} />} title="Зачем это на экзамене">
          <p className="text-sm">{day.plain.why}</p>
        </Alert>
      ) : null}

      {/*
        Формулировка программы остаётся дословной и доступной: платформа
        переводит её на человеческий язык, но не подменяет первоисточник.
      */}
      {day.plain && (day.theory || day.practice) ? (
        <details className="card p-4">
          <summary className="cursor-pointer text-sm font-medium">
            Как этот день записан в учебной программе
          </summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {day.theory ? (
              <div className="min-w-0">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-3)' }}>
                  Теория
                </p>
                <Markdown source={day.theory} />
              </div>
            ) : null}
            {day.practice ? (
              <div className="min-w-0">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-3)' }}>
                  Практика
                </p>
                <Markdown source={day.practice} />
              </div>
            ) : null}
          </div>
          <p className="mt-3 text-xs" style={{ color: 'var(--ink-3)' }}>
            Это дословный текст из файла программы. Выше — то же самое своими словами.
          </p>
        </details>
      ) : null}

      <Alert tone="brand" icon={<GitCommit size={16} />} title="Завершите день коммитом">
        <p className="text-sm">
          По программе каждый день заканчивается <code>git commit</code>. На экзамене требуется минимум три коммита в
          каждом модуле — это должно стать рефлексом.
        </p>
      </Alert>

      {dayTopics.length ? (
        <section>
          <SectionTitle title="Теория по теме" subtitle="Развёрнутые материалы платформы к этому дню" />
          <ul className="grid gap-2 sm:grid-cols-2">
            {dayTopics.map((topic) => {
              const topicStatus = progressMap.get(`topic:${topic!.id}`)?.status;
              return (
                <li key={topic!.id}>
                  <Link href={`/theory/${topic!.id}`} className="card block p-3 hover:-translate-y-px">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{topic!.title}</span>
                      {topicStatus === 'completed' ? <Badge tone="ok">Изучено</Badge> : null}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs" style={{ color: 'var(--ink-3)' }}>
                      {topic!.summary}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dayTasks.length ? (
        <section>
          <SectionTitle title="Практические задания" subtitle="Код проверяется автотестами" />
          <ul className="flex flex-col gap-2">
            {dayTasks.map((task) => {
              const taskStatus = progressMap.get(`task:${task!.id}`)?.status;
              return (
                <li key={task!.id}>
                  <Link href={`/tasks/${task!.id}`} className="card flex items-center gap-3 p-3 hover:-translate-y-px">
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{task!.title}</span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-2 text-xs" style={{ color: 'var(--ink-3)' }}>
                        <DifficultyStars level={task!.difficulty} />
                        <span>{RUNTIME_LABELS[task!.runtime]}</span>
                        <span>{task!.tests.length} тестов</span>
                      </span>
                    </span>
                    {taskStatus === 'completed' ? <Badge tone="ok">Решено</Badge> : null}
                    <ArrowRight size={15} style={{ color: 'var(--ink-3)' }} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dayQuizzes.length ? (
        <section>
          <SectionTitle title="Мини-тесты" subtitle="Быстрая проверка теории дня" />
          <ul className="flex flex-wrap gap-2">
            {dayQuizzes.map((quiz) => (
              <li key={quiz!.id}>
                <LinkButton href={`/quiz/${quiz!.id}`} size="sm" variant="secondary" icon={<Lightbulb size={14} />}>
                  {quiz!.title}
                </LinkButton>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dayProject ? (
        <section>
          <SectionTitle title="Мини-проект" />
          <Link href={`/projects/${dayProject.id}`} className="card block p-3 hover:-translate-y-px">
            <span className="text-sm font-medium">{dayProject.title}</span>
            <p className="mt-1 text-xs" style={{ color: 'var(--ink-3)' }}>
              {dayProject.goal}
            </p>
          </Link>
        </section>
      ) : null}

      <section>
        <SectionTitle
          title="Разбор по памяти"
          subtitle="10–15 минут: запишите 3–5 главных вещей дня. Не вспомнили — отметьте и начните с этого завтра"
        />
        <Card>
          <NoteEditor
            entityType="day"
            entityId={day.id}
            initialValue={note?.body ?? ''}
            placeholder="1. …&#10;2. …&#10;3. …"
            icon={<NotebookPen size={14} />}
          />
        </Card>
      </section>

      <nav className="flex justify-between gap-2">
        {prev ? (
          <LinkButton href={`/plan/day/${prev.id}`} variant="secondary" size="sm" icon={<ArrowLeft size={14} />}>
            Предыдущий день
          </LinkButton>
        ) : (
          <span />
        )}
        {next ? (
          <LinkButton href={`/plan/day/${next.id}`} variant="secondary" size="sm">
            Следующий день <ArrowRight size={14} className="ml-1" />
          </LinkButton>
        ) : null}
      </nav>
    </div>
  );
}
