import Link from 'next/link';
import type { Metadata } from 'next';
import { AlertTriangle, Clock, PlayCircle, Sparkles } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { getExams } from '@/lib/content';
import { prisma } from '@/lib/db';
import { Alert, Badge, Card, EmptyState, SectionTitle, Stat } from '@/components/ui/base';
import { LinkButton } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/layout/app-shell';
import { GeneratorForm } from './generator-form';
import { examMaxScore, examTaskCount } from '@/lib/exam/service';
import { EXAM_LEVEL_LABELS } from '@/content/types';
import { formatMinutes, toRuDate } from '@/lib/utils';
import { daysUntilExam, preExamPlan } from '@/lib/progress/logic';

export const metadata: Metadata = { title: 'Экзамены' };
export const dynamic = 'force-dynamic';

export default async function ExamsPage() {
  const user = await requireUser();
  const [exams, generated, attempts] = await Promise.all([
    getExams(),
    prisma.generatedExam.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.examAttempt.findMany({ where: { userId: user.id }, orderBy: { startedAt: 'desc' }, take: 15 }),
  ]);

  const active = attempts.find((attempt) => attempt.status === 'in_progress');
  const finished = attempts.filter((attempt) => attempt.status === 'finished');
  const best = finished.reduce((max, attempt) => Math.max(max, attempt.percent), 0);
  const demo = exams.filter((exam) => exam.kind === 'demo');
  const practice = exams.filter((exam) => exam.kind !== 'demo');

  const untilExam = daysUntilExam(user.examDate);
  const preExam = untilExam !== null ? preExamPlan(untilExam) : null;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <Breadcrumbs items={[{ label: 'Дашборд', href: '/' }, { label: 'Экзамены' }]} />

      <header>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Экзамены</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-3)' }}>
          Полная симуляция демоэкзамена по вашему варианту и тренировочные прогоны на других предметных областях.
        </p>
      </header>

      {active ? (
        <Alert tone="warn" title="Есть незавершённый экзамен" icon={<Clock size={16} />}>
          <p className="text-sm">
            Попытка начата {toRuDate(active.startedAt)}. Таймеры модулей идут на сервере — продолжите или завершите её.
          </p>
          <div className="mt-2">
            <LinkButton href={`/exams/run/${active.id}`} size="sm" variant="primary">
              Продолжить экзамен
            </LinkButton>
          </div>
        </Alert>
      ) : null}

      {preExam ? (
        <Alert tone="bad" title={`Предэкзаменационный режим · ${preExam.title}`} icon={<AlertTriangle size={16} />}>
          <p className="text-sm">
            До экзамена {untilExam} дн. Фокус этой недели: {preExam.focus.toLowerCase()}.
          </p>
        </Alert>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Пройдено экзаменов" value={finished.length} />
        <Stat label="Лучший результат" value={finished.length ? `${best}%` : '—'} tone={best >= 80 ? 'ok' : 'warn'} />
        <Stat
          label="Среднее время"
          value={
            finished.length
              ? formatMinutes(Math.round(finished.reduce((sum, item) => sum + item.durationSec, 0) / finished.length / 60))
              : '—'
          }
        />
      </div>

      <section>
        <SectionTitle title="Демоэкзамен" subtitle="Ваш реальный вариант задания 2026 года" />
        {demo.map((exam) => (
          <Card key={exam.id} className="mb-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                  <Badge tone="bad">Реальный вариант</Badge>
                  <Badge tone="neutral">{formatMinutes(exam.totalMinutes)}</Badge>
                  <Badge tone="neutral">{exam.modules.length} модуля</Badge>
                  <Badge tone="neutral">{examTaskCount(exam)} заданий</Badge>
                  <Badge tone="neutral">{examMaxScore(exam)} баллов</Badge>
                </div>
                <p className="font-medium">{exam.title}</p>
                <p className="mt-1 text-xs" style={{ color: 'var(--ink-3)' }}>
                  {exam.sourceNote}
                </p>
              </div>
              <LinkButton href={`/exams/${exam.id}`} variant="primary" icon={<PlayCircle size={15} />}>
                Открыть
              </LinkButton>
            </div>
          </Card>
        ))}
      </section>

      <section>
        <SectionTitle
          title="Генератор тренировочных вариантов"
          subtitle="Вариант собирается из базы заданий с приоритетом ваших слабых тем"
        />
        <Card>
          <GeneratorForm />
        </Card>
      </section>

      {generated.length ? (
        <section>
          <SectionTitle title="Ваши тренировочные варианты" />
          <ul className="flex flex-col gap-2">
            {generated.map((item) => (
              <li key={item.id}>
                <Link href={`/exams/${item.id}?generated=1`} className="card flex items-center gap-3 p-3 hover:-translate-y-px">
                  <Sparkles size={16} style={{ color: 'var(--brand)' }} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{item.title}</span>
                    <span className="block text-xs" style={{ color: 'var(--ink-3)' }}>
                      {EXAM_LEVEL_LABELS[item.level as keyof typeof EXAM_LEVEL_LABELS] ?? item.level} ·{' '}
                      {toRuDate(item.createdAt)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {practice.length ? (
        <section>
          <SectionTitle title="Готовые тренировочные варианты" />
          <ul className="flex flex-col gap-2">
            {practice.map((exam) => (
              <li key={exam.id}>
                <Link href={`/exams/${exam.id}`} className="card block p-3 hover:-translate-y-px">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone="neutral">{EXAM_LEVEL_LABELS[exam.level]}</Badge>
                    <Badge tone="neutral">{formatMinutes(exam.totalMinutes)}</Badge>
                    <span className="text-sm font-medium">{exam.title}</span>
                  </div>
                  <p className="mt-1 text-xs" style={{ color: 'var(--ink-3)' }}>
                    {exam.domain}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <SectionTitle title="История попыток" />
        {attempts.length ? (
          <Card>
            <ul className="flex flex-col gap-2">
              {attempts.map((attempt) => (
                <li key={attempt.id} className="flex flex-wrap items-center gap-2 text-sm">
                  {attempt.status === 'finished' ? (
                    <Link href={`/exams/attempts/${attempt.id}`} className="font-medium tabular-nums hover:underline">
                      {attempt.percent}%
                    </Link>
                  ) : (
                    <Badge tone={attempt.status === 'in_progress' ? 'warn' : 'neutral'}>
                      {attempt.status === 'in_progress' ? 'В процессе' : 'Прервана'}
                    </Badge>
                  )}
                  <span style={{ color: 'var(--ink-3)' }}>
                    {attempt.score} / {attempt.maxScore} баллов
                  </span>
                  <Badge tone={attempt.mode === 'demo' ? 'bad' : 'neutral'}>
                    {attempt.mode === 'demo' ? 'Демоэкзамен' : attempt.mode === 'final' ? 'Финальный' : 'Тренировка'}
                  </Badge>
                  <span className="ml-auto text-xs" style={{ color: 'var(--ink-3)' }}>
                    {toRuDate(attempt.startedAt)}
                  </span>
                  {attempt.status === 'in_progress' ? (
                    <LinkButton href={`/exams/run/${attempt.id}`} size="sm" variant="secondary">
                      Продолжить
                    </LinkButton>
                  ) : null}
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <EmptyState
            title="Попыток пока нет"
            description="Первый прогон лучше сделать рано: он показывает реальные пробелы точнее, чем десяток решённых задач."
          />
        )}
      </section>
    </div>
  );
}
