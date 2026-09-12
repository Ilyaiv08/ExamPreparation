import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BookOpen, ExternalLink, ListChecks, Target } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { getProjectById, getTopics } from '@/lib/content';
import { prisma } from '@/lib/db';
import { Alert, Badge, Card, DifficultyStars, SectionTitle, SourceTag } from '@/components/ui/base';
import { Breadcrumbs } from '@/components/layout/app-shell';
import { Markdown } from '@/lib/markdown';
import { ProjectWorkspace } from './project-workspace';
import { TECH_LABELS } from '@/content/types';
import { requirementById } from '@/content/exams/requirements';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);
  return { title: project?.title ?? 'Мини-проект' };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const user = await requireUser();
  const [submission, topics] = await Promise.all([
    prisma.projectSubmission.findUnique({ where: { userId_projectId: { userId: user.id, projectId: id } } }),
    getTopics(),
  ]);

  const projectTopics = project.topicIds.map((topicId) => topics.find((topic) => topic.id === topicId)).filter(Boolean);
  const examRefs = project.examRefs.map((refId) => requirementById(refId)).filter(Boolean);

  const checklist = submission ? (JSON.parse(submission.checklistJson) as Record<string, boolean>) : {};
  const files = submission ? (JSON.parse(submission.filesJson) as Record<string, string>) : {};

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <Breadcrumbs
        items={[{ label: 'Дашборд', href: '/' }, { label: 'Мини-проекты', href: '/projects' }, { label: project.title }]}
      />

      <header>
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <Badge tone="brand">Месяц {project.monthNo}</Badge>
          <DifficultyStars level={project.difficulty} showLabel />
          <Badge tone="neutral">≈ {project.estimatedHours} ч</Badge>
          {submission?.status === 'completed' ? <Badge tone="ok">Сдан</Badge> : null}
          <SourceTag source={project.source} />
        </div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{project.title}</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-3)' }}>
          {project.goal}
        </p>
      </header>

      <section>
        <SectionTitle title="Техническое задание" />
        <Card>
          <Markdown source={project.brief} />
        </Card>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section>
          <SectionTitle title="Требования" />
          <Card>
            <ul className="flex flex-col gap-1.5">
              {project.requirements.map((requirement, index) => (
                <li key={index} className="flex gap-2 text-sm">
                  <span style={{ color: 'var(--ink-3)' }}>{index + 1}.</span>
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section>
          <SectionTitle title="Ограничения" />
          <Card>
            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm">
              {project.constraints.map((constraint, index) => (
                <li key={index}>{constraint}</li>
              ))}
            </ul>
          </Card>
        </section>
      </div>

      {examRefs.length ? (
        <Alert tone="bad" title="Что из этого спрашивают на экзамене" icon={<Target size={16} />}>
          <ul className="flex flex-col gap-1.5 text-sm">
            {examRefs.map((requirement) => (
              <li key={requirement!.id}>
                <strong>Модуль {requirement!.moduleNo}:</strong> {requirement!.title}
              </li>
            ))}
          </ul>
        </Alert>
      ) : null}

      <ProjectWorkspace
        projectId={project.id}
        checklist={project.checklist}
        savedChecklist={checklist}
        notes={submission?.notes ?? ''}
        repoUrl={submission?.repoUrl ?? ''}
        autoCheck={project.autoCheck}
        savedCode={files.solution ?? project.autoCheck?.starterCode ?? ''}
        hints={project.hints}
        status={submission?.status ?? 'in_progress'}
      />

      {projectTopics.length ? (
        <section>
          <SectionTitle title="Теория по проекту" />
          <div className="flex flex-wrap gap-1.5">
            {projectTopics.map((topic) => (
              <Link key={topic!.id} href={`/theory/${topic!.id}`} className="chip hover:underline">
                <BookOpen size={11} /> {topic!.title}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {project.resources.length ? (
        <section>
          <SectionTitle title="Дополнительные материалы" />
          <Card>
            <ul className="flex flex-col gap-2">
              {project.resources.map((resource) => (
                <li key={resource.url}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:underline"
                  >
                    <ExternalLink size={14} style={{ color: 'var(--brand)' }} />
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        {project.tech.map((tech) => (
          <span key={tech} className="chip">
            <ListChecks size={11} /> {TECH_LABELS[tech]}
          </span>
        ))}
      </div>
    </div>
  );
}
