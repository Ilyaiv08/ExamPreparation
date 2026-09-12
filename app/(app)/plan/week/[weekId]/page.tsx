import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BookOpen, ChevronRight, Code2 } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { ALL_WEEKS, getMonth, getWeek } from '@/content/curriculum';
import { getProgressMap, todayPlanDay } from '@/lib/progress/service';
import { planWeekRange, STATUS_ICONS, STATUS_LABELS, type ProgressStatus } from '@/lib/progress/logic';
import { getTasks, getTopics } from '@/lib/content';
import { Badge, Card, ProgressBar, SectionTitle } from '@/components/ui/base';
import { Breadcrumbs } from '@/components/layout/app-shell';
import { DAY_KIND_LABELS } from '@/content/types';
import { formatMinutes } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ weekId: string }> }): Promise<Metadata> {
  const { weekId } = await params;
  const week = getWeek(weekId);
  return { title: week ? `Неделя ${week.weekNo}. ${week.title}` : 'Неделя' };
}

export default async function WeekPage({ params }: { params: Promise<{ weekId: string }> }) {
  const { weekId } = await params;
  const week = getWeek(weekId);
  if (!week) notFound();

  const user = await requireUser();
  const [progressMap, topics, tasks] = await Promise.all([getProgressMap(user.id), getTopics(), getTasks()]);
  const month = getMonth(week.monthId);
  const { day: todayDay } = todayPlanDay(user.startDate);

  const topicById = new Map(topics.map((topic) => [topic.id, topic]));
  const taskById = new Map(tasks.map((task) => [task.id, task]));
  const statusOf = (type: string, id: string): ProgressStatus =>
    (progressMap.get(`${type}:${id}`)?.status as ProgressStatus | undefined) ?? 'not_started';

  const doneDays = week.days.filter((day) => statusOf('day', day.id) === 'completed').length;
  const index = ALL_WEEKS.findIndex((item) => item.id === week.id);
  const prev = index > 0 ? ALL_WEEKS[index - 1] : null;
  const next = index < ALL_WEEKS.length - 1 ? ALL_WEEKS[index + 1] : null;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <Breadcrumbs
        items={[
          { label: 'Дашборд', href: '/' },
          { label: 'Учебный план', href: '/plan' },
          { label: `Месяц ${month?.monthNo ?? ''}`, href: '/plan' },
          { label: `Неделя ${week.weekNo}` },
        ]}
      />

      <header>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Неделя {week.weekNo}. {week.title}
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-3)' }}>
          {planWeekRange(user.startDate, week.weekNo).label}
          {week.goal ? ` · ${week.goal}` : ''}
        </p>
      </header>

      <Card>
        <ProgressBar value={doneDays} max={week.days.length} label={`Дней закрыто: ${doneDays} из ${week.days.length}`} showValue />
      </Card>

      <section>
        <SectionTitle title="Дни недели" subtitle="Каждый день: теория, практика, разбор по памяти и коммит" />
        <ul className="flex flex-col gap-2">
          {week.days.map((day) => {
            const status = statusOf('day', day.id);
            const dayTopics = day.topicIds.map((id) => topicById.get(id)).filter(Boolean);
            const dayTasks = day.taskIds.map((id) => taskById.get(id)).filter(Boolean);
            return (
              <li key={day.id}>
                <Link
                  href={`/plan/day/${day.id}`}
                  className="card block p-3 transition-transform duration-150 hover:-translate-y-px"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-semibold"
                      style={{
                        background: status === 'completed' ? 'var(--ok-soft)' : 'var(--surface-3)',
                        color: status === 'completed' ? 'var(--ok)' : 'var(--ink-2)',
                      }}
                      aria-hidden="true"
                    >
                      {day.dayNo}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-medium">{day.title}</span>
                        {todayDay?.id === day.id ? <Badge tone="brand">Сегодня</Badge> : null}
                        <Badge tone={day.kind === 'control' ? 'warn' : day.kind === 'rest' ? 'neutral' : 'neutral'}>
                          {DAY_KIND_LABELS[day.kind]}
                        </Badge>
                        <span className="text-xs" title={STATUS_LABELS[status]}>
                          {STATUS_ICONS[status]}
                        </span>
                      </div>

                      {/*
                        В списке показываем объяснение простыми словами.
                        Формулировка программы остаётся дословной, но её место —
                        на странице дня под катом: здесь от неё виден только
                        перечень элементов вперемешку с обратными кавычками.
                      */}
                      {(day.plain?.theory ?? day.theory) ? (
                        <p className="mt-1 line-clamp-2 text-xs" style={{ color: 'var(--ink-3)' }}>
                          <BookOpen size={11} className="mr-1 inline" />
                          {day.plain?.theory ?? day.theory}
                        </p>
                      ) : null}
                      {(day.plain?.practice ?? day.practice) ? (
                        <p className="mt-0.5 line-clamp-2 text-xs" style={{ color: 'var(--ink-3)' }}>
                          <Code2 size={11} className="mr-1 inline" />
                          {day.plain?.practice ?? day.practice}
                        </p>
                      ) : null}

                      {dayTopics.length || dayTasks.length ? (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {dayTopics.map((topic) => (
                            <span key={topic!.id} className="chip">
                              {topic!.title}
                            </span>
                          ))}
                          {dayTasks.map((task) => (
                            <span key={task!.id} className="chip">
                              {task!.title}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="hidden shrink-0 items-center gap-2 sm:flex">
                      {day.estimatedMinutes ? (
                        <span className="text-xs" style={{ color: 'var(--ink-3)' }}>
                          {formatMinutes(day.estimatedMinutes)}
                        </span>
                      ) : null}
                      <ChevronRight size={16} style={{ color: 'var(--ink-3)' }} />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <nav className="flex justify-between gap-2 text-sm">
        {prev ? (
          <Link href={`/plan/week/${prev.id}`} className="chip hover:underline">
            ← Неделя {prev.weekNo}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/plan/week/${next.id}`} className="chip hover:underline">
            Неделя {next.weekNo} →
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
