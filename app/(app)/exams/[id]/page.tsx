import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AlertTriangle, Clock, ListChecks, PlayCircle, Target } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { getExamById } from '@/lib/content';
import { prisma } from '@/lib/db';
import { Alert, Badge, Card, SectionTitle } from '@/components/ui/base';
import { Breadcrumbs } from '@/components/layout/app-shell';
import { Markdown } from '@/lib/markdown';
import { StartExamButton } from './start-exam-button';
import { examMaxScore, examTaskCount } from '@/lib/exam/service';
import { EXAM_META } from '@/content/exams/requirements';
import { formatMinutes } from '@/lib/utils';
import type { Exam } from '@/content/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const exam = await getExamById(id);
  return { title: exam?.title ?? 'Экзамен' };
}

export default async function ExamIntroPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ generated?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const user = await requireUser();

  let exam: Exam | undefined;
  let generatedId: string | undefined;

  if (query.generated) {
    const row = await prisma.generatedExam.findFirst({ where: { id, userId: user.id } });
    if (row) {
      exam = JSON.parse(row.specJson) as Exam;
      generatedId = row.id;
    }
  } else {
    exam = await getExamById(id);
  }

  if (!exam) notFound();

  const attempts = await prisma.examAttempt.findMany({
    where: { userId: user.id, examId: id },
    orderBy: { startedAt: 'desc' },
    take: 5,
  });
  const active = attempts.find((attempt) => attempt.status === 'in_progress');
  const isDemo = exam.kind === 'demo';

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      <Breadcrumbs
        items={[{ label: 'Дашборд', href: '/' }, { label: 'Экзамены', href: '/exams' }, { label: 'Вариант' }]}
      />

      <header>
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          {isDemo ? <Badge tone="bad">Реальный вариант</Badge> : <Badge tone="neutral">Тренировка</Badge>}
          <Badge tone="neutral">{exam.domain}</Badge>
        </div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{exam.title}</h1>
        <p className="mt-1 text-xs" style={{ color: 'var(--ink-3)' }}>
          {exam.sourceNote}
        </p>
      </header>

      <Card>
        <div className="grid gap-3 text-center sm:grid-cols-4">
          <Metric icon={<Clock size={15} />} label="Продолжительность" value={formatMinutes(exam.totalMinutes)} />
          <Metric icon={<ListChecks size={15} />} label="Модулей" value={String(exam.modules.length)} />
          <Metric icon={<Target size={15} />} label="Заданий" value={String(examTaskCount(exam))} />
          <Metric icon={<PlayCircle size={15} />} label="Максимум баллов" value={String(examMaxScore(exam))} />
        </div>

        <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--line)' }}>
          <StartExamButton
            examId={id}
            generatedId={generatedId}
            mode={isDemo ? 'demo' : 'practice'}
            activeAttemptId={active?.id}
          />
        </div>
      </Card>

      <Alert tone="warn" title="Правила экзаменационного режима" icon={<AlertTriangle size={16} />}>
        <ul className="flex list-disc flex-col gap-1 pl-4 text-sm">
          <li>Таймер каждого модуля идёт отдельно и продолжается на сервере, даже если закрыть вкладку.</li>
          <li>Обычные подсказки отключены — как на реальном экзамене.</li>
          <li>Ответы сохраняются автоматически, к заданию можно вернуться.</li>
          <li>Перед завершением платформа предупредит, сколько пунктов осталось незакрытыми.</li>
          {isDemo ? (
            <li>
              Приложения к заданию: {EXAM_META.attachments.join(', ')} — на реальном экзамене откройте их первым делом.
            </li>
          ) : null}
        </ul>
      </Alert>

      <section>
        <SectionTitle title="Описание" />
        <Card>
          <Markdown source={exam.description} />
        </Card>
      </section>

      <section>
        <SectionTitle title="Структура" />
        <div className="flex flex-col gap-2">
          {exam.modules.map((module) => {
            const autoTasks = module.tasks.filter((task) => task.kind !== 'checklist');
            const checklists = module.tasks.filter((task) => task.kind === 'checklist');
            return (
              <Card key={module.id}>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="brand">Модуль {module.moduleNo}</Badge>
                  <span className="text-sm font-medium">{module.title}</span>
                  <Badge tone="neutral">{formatMinutes(module.minutes)}</Badge>
                </div>
                <p className="mt-2 text-xs" style={{ color: 'var(--ink-3)' }}>
                  Автоматическая проверка: {autoTasks.length}{' '}
                  {autoTasks.length === 1 ? 'задание' : 'заданий'} · ручной чек-лист:{' '}
                  {checklists.reduce((sum, task) => sum + (task.kind === 'checklist' ? task.items.length : 0), 0)} пунктов
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {attempts.length ? (
        <section>
          <SectionTitle title="Ваши попытки по этому варианту" />
          <Card>
            <ul className="flex flex-col gap-1.5 text-sm">
              {attempts.map((attempt) => (
                <li key={attempt.id} className="flex flex-wrap items-center gap-2">
                  <span className="font-medium tabular-nums">
                    {attempt.status === 'finished' ? `${attempt.percent}%` : '—'}
                  </span>
                  <Badge tone={attempt.status === 'finished' ? 'ok' : attempt.status === 'in_progress' ? 'warn' : 'neutral'}>
                    {attempt.status === 'finished' ? 'Завершена' : attempt.status === 'in_progress' ? 'В процессе' : 'Прервана'}
                  </Badge>
                  <span className="ml-auto text-xs" style={{ color: 'var(--ink-3)' }}>
                    {attempt.startedAt.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      ) : null}
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center justify-center gap-1.5 text-xs" style={{ color: 'var(--ink-3)' }}>
        {icon}
        {label}
      </p>
      <p className="mt-0.5 text-lg font-semibold">{value}</p>
    </div>
  );
}
