import Link from 'next/link';
import type { Metadata } from 'next';
import { CalendarDays, ChevronRight, Lock } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { MONTHS, PLAN_META } from '@/content/curriculum';
import { getProgressMap, todayPlanDay, completedDaysByWeek } from '@/lib/progress/service';
import {
  isWeekUnlocked,
  planFinishDate,
  planWeekRange,
  STATUS_ICONS,
  weekNoFromDayIndex,
  type ProgressStatus,
} from '@/lib/progress/logic';
import { Badge, Card, ProgressBar, SectionTitle } from '@/components/ui/base';
import { Breadcrumbs } from '@/components/layout/app-shell';
import { TECH_LABELS } from '@/content/types';
import { toRuDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Учебный план' };
export const dynamic = 'force-dynamic';

export default async function PlanPage() {
  const user = await requireUser();
  const progressMap = await getProgressMap(user.id);
  const { index: todayIndex, day: todayDay } = todayPlanDay(user.startDate);
  const currentWeekNo = weekNoFromDayIndex(todayIndex);
  const doneByWeek = completedDaysByWeek([...progressMap.values()]);

  const statusOf = (type: string, id: string): ProgressStatus =>
    (progressMap.get(`${type}:${id}`)?.status as ProgressStatus | undefined) ?? 'not_started';

  const totalDays = MONTHS.flatMap((m) => m.weeks).flatMap((w) => w.days);
  const doneDays = totalDays.filter((day) => statusOf('day', day.id) === 'completed').length;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <Breadcrumbs items={[{ label: 'Дашборд', href: '/' }, { label: 'Учебный план' }]} />

      <header>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Учебный план на 7 месяцев</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-3)' }}>
          {PLAN_META.weekCount} недель · {PLAN_META.dayCount} дней · ваш старт {toRuDate(user.startDate)} · финиш{' '}
          {toRuDate(planFinishDate(user.startDate, PLAN_META.dayCount))}
        </p>
      </header>

      <Card>
        <ProgressBar
          value={doneDays}
          max={totalDays.length}
          label={`Пройдено дней: ${doneDays} из ${totalDays.length}`}
          showValue
        />
        <div className="mt-3 flex flex-wrap gap-2 text-xs" style={{ color: 'var(--ink-3)' }}>
          <span>{STATUS_ICONS.locked} заблокировано</span>
          <span>{STATUS_ICONS.not_started} не начато</span>
          <span>{STATUS_ICONS.in_progress} в процессе</span>
          <span>{STATUS_ICONS.completed} выполнено</span>
          <span>{STATUS_ICONS.review} повторить</span>
        </div>
      </Card>

      {MONTHS.map((month) => {
        const monthDays = month.weeks.flatMap((week) => week.days);
        const monthDone = monthDays.filter((day) => statusOf('day', day.id) === 'completed').length;
        const isCurrent = month.weeks.some((week) => week.weekNo === currentWeekNo);

        return (
          <section key={month.id}>
            <SectionTitle
              title={
                <span className="flex flex-wrap items-center gap-2">
                  Месяц {month.monthNo}. {month.shortTitle}
                  {isCurrent ? <Badge tone="brand">Текущий</Badge> : null}
                </span>
              }
              subtitle={month.outcome ? `Результат месяца: ${month.outcome}` : undefined}
              action={
                <span className="text-xs tabular-nums" style={{ color: 'var(--ink-3)' }}>
                  {monthDone}/{monthDays.length} дней
                </span>
              }
            />

            <div className="mb-2 flex flex-wrap gap-1.5">
              {month.tech.map((tech) => (
                <span key={tech} className="chip">
                  {TECH_LABELS[tech]}
                </span>
              ))}
            </div>

            <ul className="flex flex-col gap-2">
              {month.weeks.map((week) => {
                const unlocked = isWeekUnlocked(week.weekNo, doneByWeek, currentWeekNo);
                const weekDone = week.days.filter((day) => statusOf('day', day.id) === 'completed').length;
                return (
                  <li key={week.id}>
                    <Link
                      href={`/plan/week/${week.id}`}
                      className="card flex items-center gap-3 p-3 transition-transform duration-150 hover:-translate-y-px"
                      aria-label={`Неделя ${week.weekNo}: ${week.title}`}
                    >
                      <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-semibold"
                        style={{
                          background: unlocked ? 'var(--brand-soft)' : 'var(--surface-3)',
                          color: unlocked ? 'var(--brand-ink)' : 'var(--ink-3)',
                        }}
                        aria-hidden="true"
                      >
                        {unlocked ? week.weekNo : <Lock size={14} />}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">
                          Неделя {week.weekNo}. {week.title}
                        </span>
                        <span className="block text-xs" style={{ color: 'var(--ink-3)' }}>
                          <CalendarDays size={11} className="mr-1 inline" />
                          {planWeekRange(user.startDate, week.weekNo).label}
                          {week.goal ? ` · ${week.goal}` : ''}
                        </span>
                        <span className="mt-1.5 flex gap-1">
                          {week.days.map((day) => {
                            const status = statusOf('day', day.id);
                            const isToday = todayDay?.id === day.id;
                            return (
                              <span
                                key={day.id}
                                title={`День ${day.dayNo}: ${day.title}`}
                                className="grid h-4 w-4 place-items-center rounded text-[9px]"
                                style={{
                                  background:
                                    status === 'completed'
                                      ? 'var(--ok)'
                                      : status === 'in_progress'
                                        ? 'var(--warn)'
                                        : 'var(--surface-3)',
                                  color: status === 'not_started' ? 'var(--ink-3)' : '#fff',
                                  outline: isToday ? '2px solid var(--brand)' : undefined,
                                  outlineOffset: '1px',
                                }}
                              >
                                {day.dayNo}
                              </span>
                            );
                          })}
                        </span>
                      </span>

                      <span className="hidden shrink-0 text-xs tabular-nums sm:block" style={{ color: 'var(--ink-3)' }}>
                        {weekDone}/{week.days.length}
                      </span>
                      <ChevronRight size={16} style={{ color: 'var(--ink-3)' }} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <Card>
        <h2 className="text-base font-semibold">{PLAN_META.reserve.title}</h2>
        <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm" style={{ color: 'var(--ink-2)' }}>
          {PLAN_META.reserve.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs" style={{ color: 'var(--ink-3)' }}>
          Эти месяцы не входят в 30 недель основного плана — так они описаны в учебной программе.
        </p>
      </Card>
    </div>
  );
}
