import Link from 'next/link';
import type { Metadata } from 'next';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { getTasks } from '@/lib/content';
import { prisma } from '@/lib/db';
import { Badge, Card, DifficultyStars, EmptyState, ProgressBar, SectionTitle, Stat } from '@/components/ui/base';
import { Breadcrumbs } from '@/components/layout/app-shell';
import { FilterChips } from '@/components/study/filter-chips';
import { MONTHS } from '@/content/curriculum';
import {
  DIFFICULTY_LABELS,
  RUNTIME_LABELS,
  TASK_KIND_LABELS,
  TECH_LABELS,
  type Difficulty,
  type Runtime,
  type Tech,
} from '@/content/types';
import { formatMinutes } from '@/lib/utils';

export const metadata: Metadata = { title: 'Задания' };
export const dynamic = 'force-dynamic';

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; tech?: string; runtime?: string; difficulty?: string; status?: string }>;
}) {
  const params = await searchParams;
  const user = await requireUser();
  const [tasks, submissions] = await Promise.all([
    getTasks(),
    prisma.submission.findMany({
      where: { userId: user.id },
      select: { taskId: true, passed: true, attemptNo: true },
    }),
  ]);

  const solved = new Set(submissions.filter((item) => item.passed).map((item) => item.taskId));
  const attempted = new Set(submissions.map((item) => item.taskId));

  const monthFilter = params.month ? Number(params.month) : null;
  const techFilter = (params.tech as Tech | undefined) ?? null;
  const runtimeFilter = (params.runtime as Runtime | undefined) ?? null;
  const difficultyFilter = params.difficulty ? (Number(params.difficulty) as Difficulty) : null;
  const statusFilter = params.status ?? null;

  const filtered = tasks.filter((task) => {
    if (monthFilter && task.monthNo !== monthFilter) return false;
    if (techFilter && !task.tech.includes(techFilter)) return false;
    if (runtimeFilter && task.runtime !== runtimeFilter) return false;
    if (difficultyFilter && task.difficulty !== difficultyFilter) return false;
    if (statusFilter === 'solved' && !solved.has(task.id)) return false;
    if (statusFilter === 'todo' && solved.has(task.id)) return false;
    if (statusFilter === 'attempted' && (!attempted.has(task.id) || solved.has(task.id))) return false;
    return true;
  });

  const byMonth = MONTHS.map((month) => ({
    month,
    tasks: filtered.filter((task) => task.monthNo === month.monthNo),
  })).filter((group) => group.tasks.length);

  const runtimes = [...new Set(tasks.map((task) => task.runtime))];
  const techs = [...new Set(tasks.flatMap((task) => task.tech))];
  const totalTests = tasks.reduce((sum, task) => sum + task.tests.length, 0);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <Breadcrumbs items={[{ label: 'Дашборд', href: '/' }, { label: 'Задания' }]} />

      <header>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Практические задания</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-3)' }}>
          Код пишется в браузере и проверяется настоящими автотестами — {totalTests} проверок во всех заданиях.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Решено" value={solved.size} hint={`из ${tasks.length} заданий`} tone="ok" />
        <Stat label="В работе" value={attempted.size - solved.size} hint="есть попытки, но не все тесты пройдены" />
        <Stat
          label="Не начато"
          value={tasks.length - attempted.size}
          hint={tasks.length ? `${Math.round(((tasks.length - attempted.size) / tasks.length) * 100)}% каталога` : ''}
        />
      </div>

      <Card>
        <ProgressBar value={solved.size} max={tasks.length} label="Прогресс по каталогу" showValue />
      </Card>

      <div className="flex flex-col gap-2">
        <FilterChips
          label="Месяц"
          param="month"
          options={MONTHS.map((month) => ({ value: String(month.monthNo), label: `Месяц ${month.monthNo}` }))}
        />
        <FilterChips
          label="Среда"
          param="runtime"
          options={runtimes.map((runtime) => ({ value: runtime, label: RUNTIME_LABELS[runtime] }))}
        />
        <FilterChips
          label="Технология"
          param="tech"
          options={techs.map((tech) => ({ value: tech, label: TECH_LABELS[tech] }))}
        />
        <FilterChips
          label="Сложность"
          param="difficulty"
          options={[1, 2, 3, 4, 5].map((level) => ({
            value: String(level),
            label: DIFFICULTY_LABELS[level as Difficulty],
          }))}
        />
        <FilterChips
          label="Статус"
          param="status"
          options={[
            { value: 'todo', label: 'Не решено' },
            { value: 'attempted', label: 'В работе' },
            { value: 'solved', label: 'Решено' },
          ]}
        />
      </div>

      {byMonth.length ? (
        byMonth.map((group) => (
          <section key={group.month.id}>
            <SectionTitle title={`Месяц ${group.month.monthNo}. ${group.month.shortTitle}`} />
            <ul className="flex flex-col gap-2">
              {group.tasks.map((task) => {
                const isSolved = solved.has(task.id);
                const isAttempted = attempted.has(task.id);
                return (
                  <li key={task.id}>
                    <Link href={`/tasks/${task.id}`} className="card flex items-center gap-3 p-3 hover:-translate-y-px">
                      <span className="shrink-0">
                        {isSolved ? (
                          <CheckCircle2 size={18} style={{ color: 'var(--ok)' }} />
                        ) : isAttempted ? (
                          <Clock size={18} style={{ color: 'var(--warn)' }} />
                        ) : (
                          <Circle size={18} style={{ color: 'var(--ink-3)' }} />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{task.title}</span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-2 text-xs" style={{ color: 'var(--ink-3)' }}>
                          <DifficultyStars level={task.difficulty} />
                          <span>{RUNTIME_LABELS[task.runtime]}</span>
                          <span>{TASK_KIND_LABELS[task.kind]}</span>
                          <span>{task.tests.length} тестов</span>
                          <span>{formatMinutes(task.estimatedMinutes)}</span>
                        </span>
                      </span>
                      <span className="hidden shrink-0 sm:block">
                        <Badge tone="neutral">{task.maxScore} б.</Badge>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      ) : (
        <EmptyState
          title="Заданий не найдено"
          description="Попробуйте изменить фильтры: для выбранной комбинации заданий пока нет."
        />
      )}
    </div>
  );
}
