import Link from 'next/link';
import type { Metadata } from 'next';
import { CheckCircle2, Clock, GraduationCap } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { getProjects } from '@/lib/content';
import { prisma } from '@/lib/db';
import { Badge, Card, DifficultyStars, EmptyState, ProgressBar, SectionTitle } from '@/components/ui/base';
import { Breadcrumbs } from '@/components/layout/app-shell';
import { MONTHS } from '@/content/curriculum';
import { TECH_LABELS } from '@/content/types';

export const metadata: Metadata = { title: 'Мини-проекты' };
export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const user = await requireUser();
  const [projects, submissions] = await Promise.all([
    getProjects(),
    prisma.projectSubmission.findMany({ where: { userId: user.id } }),
  ]);

  const byId = new Map(submissions.map((item) => [item.projectId, item]));
  const done = submissions.filter((item) => item.status === 'completed').length;

  const groups = MONTHS.map((month) => ({
    month,
    projects: projects.filter((project) => project.monthNo === month.monthNo),
  })).filter((group) => group.projects.length);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <Breadcrumbs items={[{ label: 'Дашборд', href: '/' }, { label: 'Мини-проекты' }]} />

      <header>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Мини-проекты</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-3)' }}>
          Проект собирает отдельные умения в законченное приложение — так же, как модуль экзамена. Сложность растёт от
          месяца к месяцу.
        </p>
      </header>

      {projects.length ? (
        <>
          <Card>
            <ProgressBar value={done} max={projects.length} label={`Сдано проектов: ${done} из ${projects.length}`} showValue />
          </Card>

          {groups.map((group) => (
            <section key={group.month.id}>
              <SectionTitle title={`Месяц ${group.month.monthNo}. ${group.month.shortTitle}`} />
              <ul className="flex flex-col gap-2">
                {group.projects.map((project) => {
                  const submission = byId.get(project.id);
                  return (
                    <li key={project.id}>
                      <Link href={`/projects/${project.id}`} className="card flex items-start gap-3 p-3 hover:-translate-y-px">
                        <span className="mt-0.5 shrink-0">
                          {submission?.status === 'completed' ? (
                            <CheckCircle2 size={18} style={{ color: 'var(--ok)' }} />
                          ) : submission ? (
                            <Clock size={18} style={{ color: 'var(--warn)' }} />
                          ) : (
                            <GraduationCap size={18} style={{ color: 'var(--ink-3)' }} />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium">{project.title}</span>
                          <span className="mt-0.5 block text-xs" style={{ color: 'var(--ink-3)' }}>
                            {project.goal}
                          </span>
                          <span className="mt-1.5 flex flex-wrap items-center gap-2">
                            <DifficultyStars level={project.difficulty} />
                            <span className="text-xs" style={{ color: 'var(--ink-3)' }}>
                              ≈ {project.estimatedHours} ч
                            </span>
                            {project.tech.slice(0, 4).map((tech) => (
                              <span key={tech} className="chip">
                                {TECH_LABELS[tech]}
                              </span>
                            ))}
                          </span>
                        </span>
                        {project.autoCheck ? <Badge tone="brand">есть автотесты</Badge> : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </>
      ) : (
        <EmptyState
          title="Проекты ещё не добавлены"
          description="Мини-проекты появляются по мере прохождения программы: первый — в конце месяца 1."
        />
      )}
    </div>
  );
}
