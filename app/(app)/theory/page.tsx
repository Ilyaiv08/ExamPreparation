import Link from 'next/link';
import type { Metadata } from 'next';
import { BookOpen, CheckCircle2, Repeat2 } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { getTopics } from '@/lib/content';
import { getProgressMap } from '@/lib/progress/service';
import { prisma } from '@/lib/db';
import { Badge, Card, EmptyState, ProgressBar, SectionTitle } from '@/components/ui/base';
import { Breadcrumbs } from '@/components/layout/app-shell';
import { MONTHS } from '@/content/curriculum';
import { TECH_LABELS, type Tech } from '@/content/types';
import { formatMinutes } from '@/lib/utils';
import { FilterChips } from '@/components/study/filter-chips';

export const metadata: Metadata = { title: 'Теория' };
export const dynamic = 'force-dynamic';

export default async function TheoryPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; tech?: string; status?: string }>;
}) {
  const params = await searchParams;
  const user = await requireUser();
  const [topics, progressMap, reviewItems] = await Promise.all([
    getTopics(),
    getProgressMap(user.id),
    prisma.reviewItem.findMany({ where: { userId: user.id }, select: { topicId: true } }),
  ]);

  const inReview = new Set(reviewItems.map((item) => item.topicId));
  const monthFilter = params.month ? Number(params.month) : null;
  const techFilter = (params.tech as Tech | undefined) ?? null;
  const statusFilter = params.status ?? null;

  const isDone = (id: string) => progressMap.get(`topic:${id}`)?.status === 'completed';

  const filtered = topics.filter((topic) => {
    if (monthFilter && topic.monthNo !== monthFilter) return false;
    if (techFilter && !topic.tech.includes(techFilter)) return false;
    if (statusFilter === 'done' && !isDone(topic.id)) return false;
    if (statusFilter === 'todo' && isDone(topic.id)) return false;
    if (statusFilter === 'review' && !inReview.has(topic.id)) return false;
    return true;
  });

  const byMonth = MONTHS.map((month) => ({
    month,
    topics: filtered.filter((topic) => topic.monthNo === month.monthNo),
  })).filter((group) => group.topics.length > 0);

  const doneCount = topics.filter((topic) => isDone(topic.id)).length;
  const techs = [...new Set(topics.flatMap((topic) => topic.tech))];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <Breadcrumbs items={[{ label: 'Дашборд', href: '/' }, { label: 'Теория' }]} />

      <header>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Теория</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-3)' }}>
          {topics.length} тем по программе. Каждая тема — отдельная страница: кратко, подробно, примеры, типичные
          ошибки, мини-тест и практика.
        </p>
      </header>

      <Card>
        <ProgressBar value={doneCount} max={topics.length} label={`Изучено тем: ${doneCount} из ${topics.length}`} showValue />
      </Card>

      <div className="flex flex-col gap-2">
        <FilterChips
          label="Месяц"
          param="month"
          options={MONTHS.map((month) => ({ value: String(month.monthNo), label: `Месяц ${month.monthNo}` }))}
        />
        <FilterChips
          label="Технология"
          param="tech"
          options={techs.map((tech) => ({ value: tech, label: TECH_LABELS[tech] }))}
        />
        <FilterChips
          label="Статус"
          param="status"
          options={[
            { value: 'todo', label: 'Не изучено' },
            { value: 'done', label: 'Изучено' },
            { value: 'review', label: 'В повторении' },
          ]}
        />
      </div>

      {byMonth.length ? (
        byMonth.map((group) => (
          <section key={group.month.id}>
            <SectionTitle
              title={`Месяц ${group.month.monthNo}. ${group.month.shortTitle}`}
              subtitle={group.month.outcome}
            />
            <ul className="grid gap-2 sm:grid-cols-2">
              {group.topics.map((topic) => (
                <li key={topic.id}>
                  <Link href={`/theory/${topic.id}`} className="card block h-full p-3 hover:-translate-y-px">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium">{topic.title}</span>
                      <span className="flex shrink-0 gap-1">
                        {inReview.has(topic.id) ? (
                          <Repeat2 size={14} style={{ color: 'var(--warn)' }} aria-label="В повторении" />
                        ) : null}
                        {isDone(topic.id) ? (
                          <CheckCircle2 size={14} style={{ color: 'var(--ok)' }} aria-label="Изучено" />
                        ) : (
                          <BookOpen size={14} style={{ color: 'var(--ink-3)' }} />
                        )}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs" style={{ color: 'var(--ink-3)' }}>
                      {topic.summary}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      {topic.tech.slice(0, 3).map((tech) => (
                        <span key={tech} className="chip">
                          {TECH_LABELS[tech]}
                        </span>
                      ))}
                      {topic.importance === 'core' ? <Badge tone="bad">Ключевая</Badge> : null}
                      <span className="ml-auto text-[11px]" style={{ color: 'var(--ink-3)' }}>
                        {formatMinutes(topic.estimatedMinutes)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      ) : (
        <EmptyState title="Тем не найдено" description="Измените фильтры — возможно, выбранная комбинация пока пуста." />
      )}
    </div>
  );
}
