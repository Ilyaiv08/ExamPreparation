import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BookOpen, ListChecks, Target } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { getTaskById, getTasks, getTopics } from '@/lib/content';
import { prisma } from '@/lib/db';
import { Badge, Card, DifficultyStars, SectionTitle, SourceTag } from '@/components/ui/base';
import { Breadcrumbs } from '@/components/layout/app-shell';
import { Markdown } from '@/lib/markdown';
import { TaskWorkspace, type AttemptSummary } from '@/components/tasks/task-workspace';
import { CodeBlock } from '@/components/study/code-block';
import { DIFFICULTY_LABELS, RUNTIME_LABELS, TASK_KIND_LABELS, TECH_LABELS } from '@/content/types';
import { requirementById } from '@/content/exams/requirements';
import { formatMinutes } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const task = await getTaskById(id);
  return { title: task?.title ?? 'Задание' };
}

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = await getTaskById(id);
  if (!task) notFound();

  const user = await requireUser();
  const [draft, submissions, topics, allTasks] = await Promise.all([
    prisma.codeDraft.findUnique({ where: { userId_taskId: { userId: user.id, taskId: id } } }),
    prisma.submission.findMany({
      where: { userId: user.id, taskId: id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    getTopics(),
    getTasks(),
  ]);

  const attempts: AttemptSummary[] = submissions.map((item) => ({
    id: item.id,
    attemptNo: item.attemptNo,
    passed: item.passed,
    passedTests: item.passedTests,
    totalTests: item.totalTests,
    score: item.score,
    maxScore: item.maxScore,
    createdAt: item.createdAt.toISOString(),
    code: item.code,
  }));

  const solved = submissions.some((item) => item.passed);
  const taskTopics = task.topicIds.map((topicId) => topics.find((topic) => topic.id === topicId)).filter(Boolean);
  const examRefs = task.examRefs.map((refId) => requirementById(refId)).filter(Boolean);
  const nextTask = allTasks.find(
    (item) => item.monthNo === task.monthNo && item.difficulty >= task.difficulty && item.id !== task.id,
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <Breadcrumbs
        items={[
          { label: 'Дашборд', href: '/' },
          { label: 'Задания', href: '/tasks' },
          { label: task.title },
        ]}
      />

      <header>
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <Badge tone="brand">{TASK_KIND_LABELS[task.kind]}</Badge>
          <Badge tone="neutral">{RUNTIME_LABELS[task.runtime]}</Badge>
          <Badge tone={task.difficulty >= 4 ? 'bad' : task.difficulty >= 3 ? 'warn' : 'neutral'}>
            {DIFFICULTY_LABELS[task.difficulty]}
          </Badge>
          <DifficultyStars level={task.difficulty} />
          <Badge tone="neutral">≈ {formatMinutes(task.estimatedMinutes)}</Badge>
          <Badge tone="neutral">{task.maxScore} баллов</Badge>
          {solved ? <Badge tone="ok">Решено</Badge> : null}
          <SourceTag source={task.source} />
        </div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{task.title}</h1>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr] xl:grid-cols-[minmax(0,420px)_1fr]">
        {/* Условие */}
        <div className="flex flex-col gap-4">
          <Card>
            <Markdown source={task.statement} />
          </Card>

          {task.requirements.length ? (
            <Card>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                <ListChecks size={15} style={{ color: 'var(--brand)' }} />
                Требования
              </p>
              <ul className="flex flex-col gap-1.5">
                {task.requirements.map((requirement, index) => (
                  <li key={index} className="flex gap-2 text-sm">
                    <span style={{ color: 'var(--ink-3)' }}>{index + 1}.</span>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {task.setupSql ? (
            <Card>
              <p className="mb-2 text-sm font-medium">Данные, которые уже созданы</p>
              <CodeBlock code={task.setupSql} language="sql" compact maxHeight={240} />
            </Card>
          ) : null}

          {task.extraFiles?.length ? (
            <Card>
              <p className="mb-2 text-sm font-medium">Дополнительные файлы</p>
              {task.extraFiles.map((file) => (
                <div key={file.path} className="mb-2 last:mb-0">
                  <p className="mb-1 text-xs" style={{ color: 'var(--ink-3)' }}>
                    {file.path}
                  </p>
                  <CodeBlock code={file.content} language={file.language} compact maxHeight={200} />
                </div>
              ))}
            </Card>
          ) : null}

          {taskTopics.length ? (
            <Card>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                <BookOpen size={15} style={{ color: 'var(--brand)' }} />
                Теория по заданию
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {taskTopics.map((topic) => (
                  <li key={topic!.id}>
                    <Link href={`/theory/${topic!.id}`} className="chip hover:underline">
                      {topic!.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {examRefs.length ? (
            <Card>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Target size={15} style={{ color: 'var(--bad)' }} />
                Связь с экзаменом
              </p>
              {examRefs.map((requirement) => (
                <div key={requirement!.id} className="mb-2 last:mb-0">
                  <p className="text-xs font-medium">
                    Модуль {requirement!.moduleNo} · {requirement!.title}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--ink-3)' }}>
                    {requirement!.quote}
                  </p>
                </div>
              ))}
            </Card>
          ) : null}

          <div className="flex flex-wrap gap-1.5">
            {task.tech.map((tech) => (
              <span key={tech} className="chip">
                {TECH_LABELS[tech]}
              </span>
            ))}
          </div>
        </div>

        {/* Редактор и проверка */}
        <div>
          <TaskWorkspace
            taskId={task.id}
            runtime={task.runtime}
            starterCode={task.starterCode}
            draftCode={draft?.code ?? null}
            initialHintsUsed={draft?.hintsUsed ?? 0}
            hints={task.hints}
            tests={task.tests}
            setupSql={task.setupSql}
            viewport={task.viewport}
            solution={task.solution}
            solutionExplanation={task.solutionExplanation}
            maxScore={task.maxScore}
            attempts={attempts}
            timeLimitMs={task.timeLimitMs}
          />
        </div>
      </div>

      {nextTask ? (
        <section>
          <SectionTitle title="Следующее задание" />
          <Link href={`/tasks/${nextTask.id}`} className="card block p-3 hover:-translate-y-px">
            <p className="text-sm font-medium">{nextTask.title}</p>
            <p className="mt-0.5 text-xs" style={{ color: 'var(--ink-3)' }}>
              {RUNTIME_LABELS[nextTask.runtime]} · {DIFFICULTY_LABELS[nextTask.difficulty]}
            </p>
          </Link>
        </section>
      ) : null}
    </div>
  );
}
