import type { Metadata } from 'next';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { ACHIEVEMENTS } from '@/content/achievements';
import { achievementProgress, buildSnapshot, isUnlocked } from '@/lib/achievements';
import { Badge, Card, ProgressBar, SectionTitle, Stat } from '@/components/ui/base';
import { Breadcrumbs } from '@/components/layout/app-shell';
import { toRuDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Достижения' };
export const dynamic = 'force-dynamic';

export default async function AchievementsPage() {
  const user = await requireUser();
  const [unlockedRows, snapshot] = await Promise.all([
    prisma.userAchievement.findMany({ where: { userId: user.id } }),
    buildSnapshot(user.id),
  ]);

  const unlockedMap = new Map(unlockedRows.map((row) => [row.code, row]));
  const items = ACHIEVEMENTS.map((achievement) => {
    const row = unlockedMap.get(achievement.code);
    const progress = achievementProgress(achievement, snapshot);
    return {
      ...achievement,
      unlocked: Boolean(row) || isUnlocked(achievement, snapshot),
      unlockedAt: row?.unlockedAt ?? null,
      current: Math.min(progress.current, progress.target),
      target: progress.target,
    };
  });

  const unlockedCount = items.filter((item) => item.unlocked).length;
  const groups = [
    { title: 'Практика', codes: ['first-task', 'tasks-10', 'tasks-50', 'tasks-100', 'no-hints-5'] },
    { title: 'Ритм занятий', codes: ['streak-3', 'streak-7', 'streak-30', 'review-20'] },
    { title: 'Теория', codes: ['quiz-perfect', 'quiz-perfect-10'] },
    { title: 'Экзамены', codes: ['first-exam', 'exam-80', 'exam-5'] },
    { title: 'Проекты', codes: ['project-1', 'project-3'] },
    {
      title: 'Программа',
      codes: ['month-1', 'month-2', 'month-3', 'month-4', 'month-5', 'month-6', 'month-7', 'course-complete'],
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <Breadcrumbs items={[{ label: 'Дашборд', href: '/' }, { label: 'Достижения' }]} />

      <header>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Достижения</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-3)' }}>
          Открываются по реальным результатам: задача считается решённой, только если пройдены все её тесты.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Открыто" value={`${unlockedCount} / ${items.length}`} tone="ok" />
        <Stat label="Решено заданий" value={snapshot.tasksSolved} />
        <Stat label="Серия дней" value={snapshot.streak} tone="warn" />
      </div>

      <Card>
        <ProgressBar value={unlockedCount} max={items.length} label="Собрано достижений" showValue />
      </Card>

      {groups.map((group) => {
        const groupItems = items.filter((item) => group.codes.includes(item.code));
        if (!groupItems.length) return null;
        return (
          <section key={group.title}>
            <SectionTitle title={group.title} />
            <ul className="grid gap-2 sm:grid-cols-2">
              {groupItems.map((item) => (
                <li key={item.code}>
                  <Card className={item.unlocked ? '' : 'opacity-70'}>
                    <div className="flex items-start gap-3">
                      <span
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg"
                        style={{
                          background: item.unlocked ? 'var(--ok-soft)' : 'var(--surface-3)',
                          filter: item.unlocked ? 'none' : 'grayscale(1)',
                        }}
                        aria-hidden="true"
                      >
                        {item.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="text-sm font-medium">{item.title}</p>
                          {item.unlocked ? <Badge tone="ok">Получено</Badge> : null}
                        </div>
                        <p className="mt-0.5 text-xs" style={{ color: 'var(--ink-3)' }}>
                          {item.description}
                        </p>
                        {!item.unlocked && item.target > 1 ? (
                          <div className="mt-2">
                            <ProgressBar
                              value={item.current}
                              max={item.target}
                              label={`${item.current} из ${item.target}`}
                              size="sm"
                            />
                          </div>
                        ) : null}
                        {item.unlocked && item.unlockedAt ? (
                          <p className="mt-1 text-[11px]" style={{ color: 'var(--ink-3)' }}>
                            {toRuDate(item.unlockedAt)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
