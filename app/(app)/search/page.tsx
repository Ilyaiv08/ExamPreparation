import Link from 'next/link';
import type { Metadata } from 'next';
import { Search as SearchIcon } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { KIND_LABELS, search } from '@/lib/search';
import { Badge, Card, EmptyState, SectionTitle } from '@/components/ui/base';
import { Breadcrumbs } from '@/components/layout/app-shell';
import { SearchBox } from './search-box';
import { getContentStats } from '@/lib/content';

export const metadata: Metadata = { title: 'Поиск' };
export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const user = await requireUser();
  const query = (params.q ?? '').trim();

  const [results, stats] = await Promise.all([
    query.length >= 2 ? search(query, user.id) : Promise.resolve([]),
    getContentStats(),
  ]);

  const grouped = Object.entries(
    results.reduce<Record<string, typeof results>>((acc, item) => {
      (acc[item.kind] ??= []).push(item);
      return acc;
    }, {}),
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      <Breadcrumbs items={[{ label: 'Дашборд', href: '/' }, { label: 'Поиск' }]} />

      <header>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Поиск</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-3)' }}>
          По теории, заданиям, тестам, проектам, экзаменационным требованиям, дням плана и вашим заметкам.
        </p>
      </header>

      <SearchBox initialQuery={query} />

      {query.length >= 2 ? (
        results.length ? (
          <>
            <p className="text-sm" style={{ color: 'var(--ink-3)' }}>
              Найдено: {results.length}
            </p>
            {grouped.map(([kind, items]) => (
              <section key={kind}>
                <SectionTitle title={KIND_LABELS[kind as keyof typeof KIND_LABELS]} />
                <ul className="flex flex-col gap-2">
                  {items.map((item) => (
                    <li key={`${item.kind}-${item.id}`}>
                      <Link href={item.href} className="card block p-3 hover:-translate-y-px">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium">{item.title}</span>
                          {item.meta ? <Badge tone="neutral">{item.meta}</Badge> : null}
                        </div>
                        {item.excerpt ? (
                          <p className="mt-1 line-clamp-2 text-xs" style={{ color: 'var(--ink-3)' }}>
                            {item.excerpt}
                          </p>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </>
        ) : (
          <EmptyState
            title={`По запросу «${query}» ничего не найдено`}
            description="Попробуйте другое слово: например, «async», «слайдер», «JOIN», «валидация», «статус»."
            icon={<SearchIcon size={22} />}
          />
        )
      ) : (
        <Card>
          <p className="text-sm" style={{ color: 'var(--ink-3)' }}>
            Введите минимум два символа. Сейчас в базе: {stats.topics} тем, {stats.tasks} заданий, {stats.quizzes} тестов,{' '}
            {stats.projects} проектов, {stats.exams} экзаменов и {stats.days} дней плана.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {['слайдер', 'валидация', 'JOIN', 'статус', 'адаптив', 'JWT', 'useEffect'].map((example) => (
              <Link key={example} href={`/search?q=${encodeURIComponent(example)}`} className="chip hover:underline">
                {example}
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
