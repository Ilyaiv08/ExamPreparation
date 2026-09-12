import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Plus } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { getExams, getProjects, getQuizzes, getTasks, getTopics } from '@/lib/content';
import { Badge, Card, SectionTitle } from '@/components/ui/base';
import { LinkButton } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/layout/app-shell';
import { CONTENT_TYPE_LABELS, type ContentType } from '@/lib/content-schema';

export const dynamic = 'force-dynamic';

const TYPES: ContentType[] = ['topic', 'task', 'quiz', 'project', 'exam'];

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  return { title: CONTENT_TYPE_LABELS[type as ContentType] ?? 'Админ-панель' };
}

export default async function AdminListPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!TYPES.includes(type as ContentType)) notFound();
  const contentType = type as ContentType;

  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'admin') redirect('/');

  const [items, overrides] = await Promise.all([loadItems(contentType), prisma.contentOverride.findMany({ where: { entityType: contentType } })]);
  const overrideById = new Map(overrides.map((row) => [row.entityId, row]));

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <Breadcrumbs
        items={[
          { label: 'Дашборд', href: '/' },
          { label: 'Админ-панель', href: '/admin' },
          { label: CONTENT_TYPE_LABELS[contentType] },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{CONTENT_TYPE_LABELS[contentType]}</h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--ink-3)' }}>
            Записей: {items.length}
          </p>
        </div>
        <LinkButton href={`/admin/${contentType}/new`} variant="primary" icon={<Plus size={15} />}>
          Создать
        </LinkButton>
      </div>

      <Card>
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const override = overrideById.get(item.id);
            return (
              <li key={item.id}>
                <Link
                  href={`/admin/${contentType}/${item.id}`}
                  className="flex flex-wrap items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-[var(--surface-3)]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{item.title}</span>
                    <span className="block font-mono text-[11px]" style={{ color: 'var(--ink-3)' }}>
                      {item.id}
                    </span>
                  </span>
                  {item.meta ? <Badge tone="neutral">{item.meta}</Badge> : null}
                  {override?.isNew ? <Badge tone="brand">создано в админке</Badge> : null}
                  {override && !override.isNew ? <Badge tone="warn">изменено</Badge> : null}
                  {override?.disabled ? <Badge tone="bad">скрыто</Badge> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </Card>

      <SectionTitle
        title="Как это работает"
        subtitle="Правки хранятся отдельно от файлов контента и накладываются поверх. Кнопка «Вернуть исходный вариант» отменяет их."
      />
    </div>
  );
}

async function loadItems(type: ContentType): Promise<{ id: string; title: string; meta?: string }[]> {
  switch (type) {
    case 'topic':
      return (await getTopics()).map((item) => ({ id: item.id, title: item.title, meta: `Месяц ${item.monthNo}` }));
    case 'task':
      return (await getTasks()).map((item) => ({
        id: item.id,
        title: item.title,
        meta: `Месяц ${item.monthNo} · ${item.runtime}`,
      }));
    case 'quiz':
      return (await getQuizzes()).map((item) => ({
        id: item.id,
        title: item.title,
        meta: `${item.questions.length} вопросов`,
      }));
    case 'project':
      return (await getProjects()).map((item) => ({ id: item.id, title: item.title, meta: `Месяц ${item.monthNo}` }));
    case 'exam':
      return (await getExams()).map((item) => ({ id: item.id, title: item.title, meta: item.kind }));
    default:
      return [];
  }
}
