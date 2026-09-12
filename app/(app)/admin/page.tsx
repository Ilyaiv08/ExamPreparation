import Link from 'next/link';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Database, FileJson, Users } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { getContentStats } from '@/lib/content';
import { Alert, Card, SectionTitle, Stat } from '@/components/ui/base';
import { Breadcrumbs } from '@/components/layout/app-shell';
import { CONTENT_TYPE_LABELS, type ContentType } from '@/lib/content-schema';
import { toRuDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Админ-панель' };
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'admin') redirect('/');

  const [stats, overrides, users, submissions, examAttempts] = await Promise.all([
    getContentStats(),
    prisma.contentOverride.findMany({ orderBy: { updatedAt: 'desc' }, take: 10 }),
    prisma.user.count(),
    prisma.submission.count(),
    prisma.examAttempt.count(),
  ]);

  const types: ContentType[] = ['topic', 'task', 'quiz', 'project', 'exam'];
  const counts: Record<ContentType, number> = {
    topic: stats.topics,
    task: stats.tasks,
    quiz: stats.quizzes,
    project: stats.projects,
    exam: stats.exams,
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <Breadcrumbs items={[{ label: 'Дашборд', href: '/' }, { label: 'Админ-панель' }]} />

      <header>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Админ-панель</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-3)' }}>
          Контент можно менять без правки исходного кода: правки сохраняются поверх файлов и в любой момент отменяются.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Пользователей" value={users} icon={<Users size={15} />} />
        <Stat label="Попыток заданий" value={submissions} />
        <Stat label="Попыток экзаменов" value={examAttempts} />
        <Stat label="Правок контента" value={overrides.length} icon={<FileJson size={15} />} />
      </div>

      <section>
        <SectionTitle title="Контент" subtitle="Выберите тип, чтобы просмотреть и отредактировать записи" />
        <ul className="grid gap-2 sm:grid-cols-2">
          {types.map((type) => (
            <li key={type}>
              <Link href={`/admin/${type}`} className="card flex items-center gap-3 p-3 hover:-translate-y-px">
                <Database size={16} style={{ color: 'var(--brand)' }} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{CONTENT_TYPE_LABELS[type]}</span>
                  <span className="block text-xs" style={{ color: 'var(--ink-3)' }}>
                    записей: {counts[type]}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionTitle title="Учебная программа" />
        <Card>
          <p className="text-sm">
            План на {stats.months} месяцев, {stats.weeks} недель и {stats.days} дней разбирается из файла
            <code> plan_podgotovki_DE_09.02.07.md</code> скриптом <code>node scripts/parse-plan.mjs</code>.
          </p>
          <p className="mt-2 text-sm" style={{ color: 'var(--ink-3)' }}>
            Чтобы изменить программу, поправьте исходный файл и перезапустите скрипт — тексты дней останутся дословными.
            Привязка тем и заданий к дням задаётся полем <code>planDays</code> в самих темах и заданиях.
          </p>
        </Card>
      </section>

      {overrides.length ? (
        <section>
          <SectionTitle title="Последние правки" />
          <Card>
            <ul className="flex flex-col gap-1.5 text-sm">
              {overrides.map((override) => (
                <li key={override.id} className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/${override.entityType}/${override.entityId}`}
                    className="font-medium hover:underline"
                  >
                    {override.entityId}
                  </Link>
                  <span className="chip">{override.entityType}</span>
                  {override.isNew ? <span className="chip">создано в админке</span> : null}
                  {override.disabled ? <span className="chip">скрыто</span> : null}
                  <span className="ml-auto text-xs" style={{ color: 'var(--ink-3)' }}>
                    {override.updatedBy ?? '—'} · {toRuDate(override.updatedAt)}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      ) : (
        <Alert tone="neutral" title="Правок пока нет">
          <p className="text-sm">
            Файловый контент используется как есть. Любая правка появится здесь и её можно будет отменить.
          </p>
        </Alert>
      )}
    </div>
  );
}
