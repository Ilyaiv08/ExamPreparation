import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarClock, Repeat2 } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { getTopics } from '@/lib/content';
import { Badge, Card, EmptyState, SectionTitle, Stat } from '@/components/ui/base';
import { LinkButton } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/layout/app-shell';
import { ReviewQueue } from './review-queue';
import { dueLabel, sortReviewQueue } from '@/lib/srs/logic';
import { toRuDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Повторение' };
export const dynamic = 'force-dynamic';

const REASON_LABELS: Record<string, string> = {
  manual: 'добавлено вручную',
  failed_task: 'задание не решалось',
  failed_quiz: 'тест не пройден',
  exam: 'ошибка на экзамене',
};

export default async function ReviewPage() {
  const user = await requireUser();
  const [items, topics] = await Promise.all([
    prisma.reviewItem.findMany({ where: { userId: user.id }, orderBy: { dueAt: 'asc' } }),
    getTopics(),
  ]);

  const topicById = new Map(topics.map((topic) => [topic.id, topic]));
  const now = new Date();
  const due = sortReviewQueue(
    items.filter((item) => item.dueAt <= now),
    now,
  );
  const upcoming = items.filter((item) => item.dueAt > now).slice(0, 12);

  const queue = due
    .map((item) => {
      const topic = topicById.get(item.topicId);
      if (!topic) return null;
      return {
        topicId: item.topicId,
        title: topic.title,
        summary: topic.summary,
        mustKnow: topic.mustKnow,
        quizId: topic.quizId,
        reason: REASON_LABELS[item.reason] ?? item.reason,
        repetitions: item.repetitions,
        lapses: item.lapses,
        overdue: dueLabel(item.dueAt, now),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      <Breadcrumbs items={[{ label: 'Дашборд', href: '/' }, { label: 'Повторение' }]} />

      <header>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Повторение</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-3)' }}>
          Интервалы взяты из учебной программы: 2 → 5 → 10 → 21 день. Темы, которые даются тяжело, возвращаются чаще.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="К повторению сейчас" value={queue.length} tone={queue.length ? 'warn' : 'ok'} />
        <Stat label="Всего карточек" value={items.length} />
        <Stat
          label="Повторений сделано"
          value={items.reduce((sum, item) => sum + item.repetitions, 0)}
          hint="за всё время"
        />
      </div>

      {queue.length ? (
        <ReviewQueue items={queue} />
      ) : (
        <EmptyState
          title="На сегодня всё повторено"
          description={
            items.length
              ? 'Карточки вернутся по расписанию. Ниже видно, когда именно.'
              : 'Карточки появляются автоматически: после трёх неудачных попыток по заданию, после проваленного теста или по кнопке «Добавить в повторение» на странице темы.'
          }
          icon={<Repeat2 size={22} />}
          action={<LinkButton href="/theory">Открыть теорию</LinkButton>}
        />
      )}

      {upcoming.length ? (
        <section>
          <SectionTitle title="Расписание" subtitle="Когда темы вернутся на повторение" />
          <Card>
            <ul className="flex flex-col gap-2">
              {upcoming.map((item) => {
                const topic = topicById.get(item.topicId);
                return (
                  <li key={item.id} className="flex flex-wrap items-center gap-2 text-sm">
                    <CalendarClock size={14} style={{ color: 'var(--ink-3)' }} />
                    <Link href={`/theory/${item.topicId}`} className="hover:underline">
                      {topic?.title ?? item.topicId}
                    </Link>
                    <Badge tone="neutral">{dueLabel(item.dueAt, now)}</Badge>
                    <span className="ml-auto text-xs" style={{ color: 'var(--ink-3)' }}>
                      {toRuDate(item.dueAt)} · интервал {item.intervalDays} дн.
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
