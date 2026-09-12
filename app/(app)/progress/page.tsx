import type { Metadata } from 'next';
import Link from 'next/link';
import { Flame, Target, TrendingUp, Trophy } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { getDashboardData } from '@/lib/dashboard';
import { getProgressMap } from '@/lib/progress/service';
import { prisma } from '@/lib/db';
import { MONTHS } from '@/content/curriculum';
import { Alert, Badge, Card, EmptyState, ProgressBar, SectionTitle, Stat } from '@/components/ui/base';
import { Breadcrumbs } from '@/components/layout/app-shell';
import { ActivityChart, ReadinessChart } from './charts';
import { TECH_LABELS } from '@/content/types';
import { dateKey, formatMinutes, formatMs, pluralize, toRuDate } from '@/lib/utils';
import { StudyDatesForm } from './study-dates-form';

export const metadata: Metadata = { title: 'Прогресс' };
export const dynamic = 'force-dynamic';

export default async function ProgressPage() {
  const user = await requireUser();
  const [data, progressMap, sessions, submissions] = await Promise.all([
    getDashboardData(user.id),
    getProgressMap(user.id),
    prisma.studySession.findMany({ where: { userId: user.id }, orderBy: { date: 'asc' }, take: 120 }),
    prisma.submission.findMany({
      where: { userId: user.id },
      select: { passed: true, hintsUsed: true, runtimeMs: true, createdAt: true, taskId: true },
      orderBy: { createdAt: 'desc' },
      take: 400,
    }),
  ]);

  const isDone = (type: string, id: string) => progressMap.get(`${type}:${id}`)?.status === 'completed';

  const avgRuntime = submissions.length
    ? submissions.reduce((sum, item) => sum + item.runtimeMs, 0) / submissions.length
    : 0;

  const totalMinutes = sessions.reduce((sum, item) => sum + item.theoryMinutes + item.practiceMinutes, 0);
  const theoryMinutes = sessions.reduce((sum, item) => sum + item.theoryMinutes, 0);
  const practiceMinutes = sessions.reduce((sum, item) => sum + item.practiceMinutes, 0);

  const activity = sessions.slice(-42).map((session) => ({
    date: session.date.slice(5).replace('-', '.'),
    Теория: session.theoryMinutes,
    Практика: session.practiceMinutes,
  }));

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <Breadcrumbs items={[{ label: 'Дашборд', href: '/' }, { label: 'Прогресс' }]} />

      <header>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Прогресс и готовность</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-3)' }}>
          День {data.todayIndex + 1} из 210 · месяц {data.currentMonth.monthNo} · неделя {data.currentWeek.weekNo}
        </p>
      </header>

      {/* Готовность */}
      <section>
        <SectionTitle
          title="Готовность к экзамену"
          subtitle="Оценка платформы по вашим результатам. Это не официальная шкала: в задании ДЭ критериев оценивания нет"
        />
        <Card>
          <div className="flex flex-wrap items-center gap-4">
            <div className="min-w-[140px]">
              <p className="text-4xl font-semibold tabular-nums" style={{ color: toneColor(data.readiness.tone) }}>
                {data.readiness.percent}%
              </p>
              <p className="text-sm" style={{ color: 'var(--ink-3)' }}>
                {data.readiness.label}
              </p>
            </div>
            <div className="min-w-0 flex-1">
              <ReadinessChart parts={data.readiness.parts} />
            </div>
          </div>

          <ul className="mt-4 flex flex-col gap-2 border-t pt-3" style={{ borderColor: 'var(--line)' }}>
            {data.readiness.parts.map((part) => (
              <li key={part.key}>
                <ProgressBar
                  value={part.percent}
                  label={`${part.label} · вес ${Math.round(part.weight * 100)}%`}
                  showValue
                  size="sm"
                  tone={part.percent >= 70 ? 'ok' : part.percent >= 40 ? 'warn' : 'bad'}
                />
              </li>
            ))}
          </ul>

          {data.weakTopics.length ? (
            <Alert tone="warn" className="mt-3" title="Основной риск">
              <p className="text-sm">
                {data.weakTopics[0].title}
                {data.weakTopics[0].reasons.length ? ` — ${data.weakTopics[0].reasons.join(', ')}` : ''}.
              </p>
              <p className="mt-1 text-sm">
                Рекомендуется: повторить теорию, решить 2–3 дополнительных задания по теме и пройти мини-тест.
              </p>
            </Alert>
          ) : null}
        </Card>
      </section>

      {/* Цифры */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Серия" value={pluralize(data.streak.current, 'день', 'дня', 'дней')} hint={`рекорд: ${data.streak.longest}`} icon={<Flame size={15} />} tone="warn" />
        <Stat label="Решено заданий" value={data.overall.tasks.done} hint={`из ${data.overall.tasks.total}`} icon={<Target size={15} />} tone="ok" />
        <Stat label="Успешных попыток" value={`${data.overall.successRate}%`} hint={`${data.overall.submissions} попыток`} icon={<TrendingUp size={15} />} />
        <Stat label="Экзаменов пройдено" value={data.examAttempts.length} hint={data.lastExam ? `последний: ${data.lastExam.percent}%` : 'ещё не было'} icon={<Trophy size={15} />} />
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Всего занятий" value={formatMinutes(totalMinutes)} hint={`теория ${formatMinutes(theoryMinutes)} · практика ${formatMinutes(practiceMinutes)}`} />
        <Stat label="Среднее время проверки" value={formatMs(avgRuntime)} hint="выполнение кода в песочнице" />
        <Stat label="Использовано подсказок" value={data.overall.hintsUsedTotal} hint="влияет на балл за задание" />
        <Stat label="Активных дней" value={data.streak.activeDays} hint="дней с занятиями" />
      </section>

      {/* Активность */}
      <section>
        <SectionTitle title="Активность по дням" subtitle="Минуты теории и практики за последние шесть недель" />
        <Card>
          {activity.length ? (
            <ActivityChart data={activity} />
          ) : (
            <p className="py-6 text-center text-sm" style={{ color: 'var(--ink-3)' }}>
              Данных пока нет: отметьте выполненный день или решите задание.
            </p>
          )}
        </Card>
      </section>

      {/* По месяцам */}
      <section>
        <SectionTitle title="Прогресс по месяцам" />
        <Card>
          <ul className="flex flex-col gap-3">
            {MONTHS.map((month) => {
              const days = month.weeks.flatMap((week) => week.days);
              const done = days.filter((day) => isDone('day', day.id)).length;
              return (
                <li key={month.id}>
                  <ProgressBar
                    value={done}
                    max={days.length}
                    label={`Месяц ${month.monthNo}. ${month.shortTitle} — ${done}/${days.length} дней`}
                    showValue
                    size="sm"
                    tone={done === days.length ? 'ok' : done > 0 ? 'warn' : 'brand'}
                  />
                </li>
              );
            })}
          </ul>
        </Card>
      </section>

      {/* По технологиям */}
      <section>
        <SectionTitle title="Прогресс по технологиям" />
        <Card>
          {data.techProgress.length ? (
            <ul className="flex flex-col gap-3">
              {data.techProgress.map((item) => (
                <li key={item.tech}>
                  <ProgressBar
                    value={item.done}
                    max={item.total}
                    label={`${TECH_LABELS[item.tech]} — ${item.done}/${item.total}`}
                    showValue
                    size="sm"
                    tone={item.percent >= 70 ? 'ok' : item.percent >= 35 ? 'warn' : 'brand'}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm" style={{ color: 'var(--ink-3)' }}>
              Данных пока нет.
            </p>
          )}
        </Card>
      </section>

      {/* Слабые темы */}
      <section>
        <SectionTitle title="Слабые темы" subtitle="Считаются по доле неудач, результатам тестов, подсказкам и давности" />
        {data.weakTopics.length ? (
          <Card>
            <ul className="flex flex-col gap-2.5">
              {data.weakTopics.map((topic) => (
                <li key={topic.topicId} className="flex flex-wrap items-center gap-2">
                  <Link href={`/theory/${topic.topicId}`} className="text-sm font-medium hover:underline">
                    {topic.title}
                  </Link>
                  <Badge tone={topic.weakness > 0.6 ? 'bad' : 'warn'}>{Math.round(topic.weakness * 100)}%</Badge>
                  <span className="text-xs" style={{ color: 'var(--ink-3)' }}>
                    {topic.reasons.join(', ')}
                  </span>
                  <span className="ml-auto text-xs" style={{ color: 'var(--ink-3)' }}>
                    попыток: {topic.attempts}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <EmptyState title="Слабых тем не обнаружено" description="Решайте задания — система отследит, где чаще ошибки." />
        )}
      </section>

      {/* Экзамены */}
      <section>
        <SectionTitle title="Результаты экзаменов" />
        {data.examAttempts.length ? (
          <Card>
            <ul className="flex flex-col gap-2">
              {data.examAttempts.map((attempt) => (
                <li key={attempt.id} className="flex flex-wrap items-center gap-2 text-sm">
                  <Link href={`/exams/attempts/${attempt.id}`} className="font-medium hover:underline">
                    {attempt.percent}%
                  </Link>
                  <span style={{ color: 'var(--ink-3)' }}>
                    {attempt.score} из {attempt.maxScore} баллов
                  </span>
                  <Badge tone={attempt.mode === 'demo' ? 'bad' : 'neutral'}>
                    {attempt.mode === 'demo' ? 'Демоэкзамен' : attempt.mode === 'final' ? 'Финальный' : 'Тренировка'}
                  </Badge>
                  <span className="ml-auto text-xs" style={{ color: 'var(--ink-3)' }}>
                    {attempt.finishedAt ? toRuDate(attempt.finishedAt) : ''} · {Math.round(attempt.durationSec / 60)} мин
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <EmptyState
            title="Экзаменов ещё не было"
            description="Первый прогон показывает реальные пробелы лучше, чем ещё десять решённых задач."
          />
        )}
      </section>

      {/* Даты */}
      <section>
        <SectionTitle title="Даты подготовки" subtitle="От даты старта считается «сегодняшний день» плана" />
        <Card>
          {/*
            Дату для поля берём по местному времени, а не через toISOString.
            Даты хранятся как локальная полночь: в UTC+3 это 21:00 предыдущих
            суток, и toISOString отдавал день назад. Поле показывало не ту дату,
            а «Сохранить» записывало её обратно — дата уезжала при каждом заходе.
          */}
          <StudyDatesForm
            startDate={dateKey(data.user.startDate)}
            examDate={data.user.examDate ? dateKey(data.user.examDate) : ''}
          />
        </Card>
      </section>
    </div>
  );
}

function toneColor(tone: 'ok' | 'warn' | 'bad'): string {
  return tone === 'ok' ? 'var(--ok)' : tone === 'warn' ? 'var(--warn)' : 'var(--bad)';
}
