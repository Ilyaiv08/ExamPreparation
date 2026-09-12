import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CheckCircle2, ListChecks, Target, TrendingUp, XCircle } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { getExamById } from '@/lib/content';
import { Alert, Badge, Card, ProgressBar, SectionTitle, Stat } from '@/components/ui/base';
import { LinkButton } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/layout/app-shell';
import { analyzeAttempt, type ExamAnalysis } from '@/lib/exam/service';
import { formatMinutes, toRuDate } from '@/lib/utils';
import type { Exam } from '@/content/types';

export const metadata: Metadata = { title: 'Результат экзамена' };
export const dynamic = 'force-dynamic';

export default async function ExamResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();

  const attempt = await prisma.examAttempt.findFirst({
    where: { id, userId: user.id },
    include: { answers: true },
  });
  if (!attempt) notFound();

  let exam: Exam | undefined;
  if (attempt.generatedExamId) {
    const row = await prisma.generatedExam.findFirst({ where: { id: attempt.generatedExamId, userId: user.id } });
    if (row) exam = JSON.parse(row.specJson) as Exam;
  } else {
    exam = await getExamById(attempt.examId);
  }
  if (!exam) notFound();

  let analysis: ExamAnalysis;
  try {
    analysis = attempt.analysisJson && attempt.analysisJson !== '{}'
      ? (JSON.parse(attempt.analysisJson) as ExamAnalysis)
      : analyzeAttempt(exam, attempt.answers);
  } catch {
    analysis = analyzeAttempt(exam, attempt.answers);
  }

  const answerById = new Map(attempt.answers.map((answer) => [answer.examTaskId, answer]));
  const completedTasks = attempt.answers.filter((answer) => answer.score > 0).length;
  const totalTasks = exam.modules.reduce((sum, module) => sum + module.tasks.length, 0);
  const tone = attempt.percent >= 80 ? 'ok' : attempt.percent >= 60 ? 'warn' : 'bad';

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      <Breadcrumbs
        items={[{ label: 'Дашборд', href: '/' }, { label: 'Экзамены', href: '/exams' }, { label: 'Результат' }]}
      />

      <header>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Результат экзамена</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-3)' }}>
          {exam.title} · {attempt.finishedAt ? toRuDate(attempt.finishedAt) : ''} ·{' '}
          {formatMinutes(Math.round(attempt.durationSec / 60))}
        </p>
      </header>

      <Card>
        <div className="text-center">
          <p className="text-5xl font-semibold tabular-nums" style={{ color: toneVar(tone) }}>
            {attempt.percent}%
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink-3)' }}>
            Выполнено: {completedTasks} / {totalTasks} · Баллы: {attempt.score} / {attempt.maxScore}
          </p>
          <div className="mx-auto mt-3 max-w-md">
            <ProgressBar value={attempt.percent} tone={tone} />
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Stat
          label="Автоматическая проверка"
          value={`${analysis.auto.score} / ${analysis.auto.maxScore}`}
          hint="реальный запуск кода и тестов"
          icon={<Target size={15} />}
          tone={analysis.auto.maxScore && analysis.auto.score / analysis.auto.maxScore >= 0.7 ? 'ok' : 'warn'}
        />
        <Stat
          label="Ручной чек-лист"
          value={`${analysis.manual.score} / ${analysis.manual.maxScore}`}
          hint="то, что вы отметили в своём проекте"
          icon={<ListChecks size={15} />}
        />
      </div>

      <section>
        <SectionTitle title="По модулям" />
        <Card>
          <ul className="flex flex-col gap-3">
            {analysis.byModule.map((module) => (
              <li key={module.moduleNo}>
                <ProgressBar
                  value={module.score}
                  max={module.maxScore}
                  label={`Модуль ${module.moduleNo}. ${module.title} — ${module.score}/${module.maxScore}`}
                  showValue
                  size="sm"
                  tone={module.percent >= 80 ? 'ok' : module.percent >= 60 ? 'warn' : 'bad'}
                />
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        <section>
          <SectionTitle title="Сильные стороны" />
          <Card>
            {analysis.strengths.length ? (
              <ul className="flex flex-col gap-1.5">
                {analysis.strengths.map((item) => (
                  <li key={item.title} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--ok)' }} />
                    <span className="min-w-0 flex-1">{item.title}</span>
                    <Badge tone="ok">{item.percent}%</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm" style={{ color: 'var(--ink-3)' }}>
                Пока ни один блок не закрыт на 80% и выше.
              </p>
            )}
          </Card>
        </section>

        <section>
          <SectionTitle title="Нужно улучшить" />
          <Card>
            {analysis.weaknesses.length ? (
              <ul className="flex flex-col gap-2">
                {analysis.weaknesses.map((item) => (
                  <li key={item.title} className="text-sm">
                    <div className="flex items-start gap-2">
                      <XCircle size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--bad)' }} />
                      <span className="min-w-0 flex-1">{item.title}</span>
                      <Badge tone="bad">{item.percent}%</Badge>
                    </div>
                    {item.advice ? (
                      <p className="mt-0.5 pl-6 text-xs" style={{ color: 'var(--ink-3)' }}>
                        {item.advice}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm" style={{ color: 'var(--ok)' }}>
                Слабых блоков не обнаружено.
              </p>
            )}
          </Card>
        </section>
      </div>

      <section>
        <SectionTitle title="Рекомендуемый план" subtitle="Что делать после этого прогона" />
        <Card>
          <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm">
            {analysis.plan.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </Card>
      </section>

      <section>
        <SectionTitle title="Разбор по заданиям" />
        <div className="flex flex-col gap-2">
          {exam.modules.map((module) => (
            <Card key={module.id}>
              <p className="mb-2 text-sm font-medium">
                Модуль {module.moduleNo}. {module.title}
              </p>
              <ul className="flex flex-col gap-1.5">
                {module.tasks.map((task) => {
                  const answer = answerById.get(task.id);
                  const score = answer?.score ?? 0;
                  const share = task.points ? score / task.points : 0;
                  return (
                    <li key={task.id} className="flex flex-wrap items-center gap-2 text-sm">
                      <span style={{ color: share >= 1 ? 'var(--ok)' : share > 0 ? 'var(--warn)' : 'var(--bad)' }}>
                        {share >= 1 ? '✓' : share > 0 ? '~' : '✗'}
                      </span>
                      <span className="min-w-0 flex-1">
                        {task.kind === 'checklist' ? task.title : (task.title ?? task.id)}
                      </span>
                      <Badge tone={task.kind === 'checklist' ? 'neutral' : 'brand'}>
                        {task.kind === 'checklist' ? 'ручная проверка' : 'автотесты'}
                      </Badge>
                      <span className="tabular-nums text-xs" style={{ color: 'var(--ink-3)' }}>
                        {Math.round(score * 10) / 10} / {task.points}
                      </span>
                      {task.kind === 'code' ? (
                        <Link href={`/tasks/${task.taskId}`} className="text-xs underline" style={{ color: 'var(--brand)' }}>
                          разобрать
                        </Link>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <Alert tone="neutral" title="Как читать результат">
        <p className="text-sm">
          Автоматическая часть — это реально запущенный код и пройденные тесты. Ручной чек-лист вы отмечали сами, поэтому
          он показывает вашу собственную оценку проекта. Если проценты сильно расходятся, стоит перепроверить чек-лист
          строже: на экзамене его проверяет эксперт.
        </p>
      </Alert>

      <div className="flex flex-wrap gap-2">
        <LinkButton href="/exams" variant="primary" icon={<TrendingUp size={15} />}>
          К списку экзаменов
        </LinkButton>
        <LinkButton href="/review" variant="secondary">
          Повторить слабые темы
        </LinkButton>
        <LinkButton href="/progress" variant="secondary">
          Статистика
        </LinkButton>
      </div>
    </div>
  );
}

function toneVar(tone: 'ok' | 'warn' | 'bad'): string {
  return tone === 'ok' ? 'var(--ok)' : tone === 'warn' ? 'var(--warn)' : 'var(--bad)';
}
