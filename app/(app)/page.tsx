import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Code2,
  Flame,
  Repeat2,
  ShieldAlert,
  Target,
  TrendingUp,
} from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { getDashboardData } from '@/lib/dashboard';
import { Alert, Badge, Card, EmptyState, ProgressBar, SectionTitle, Stat } from '@/components/ui/base';
import { LinkButton } from '@/components/ui/button';
import { DAY_KIND_LABELS, TECH_LABELS } from '@/content/types';
import { firstName, formatMinutes, pluralize, toRuDate } from '@/lib/utils';
import { EXAM_META } from '@/content/exams/requirements';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);
  const { today, currentWeek, currentMonth } = data;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {greeting()}, {firstName(user.fullName, user.login)}
          </h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--ink-3)' }}>
            Месяц {currentMonth.monthNo} · Неделя {currentWeek.weekNo} ({data.currentWeekDates}) · День{' '}
            {data.todayIndex + 1} из 210
          </p>
        </div>
        <div className="flex items-center gap-2">
          {data.daysUntilExam !== null ? (
            <Badge tone={data.daysUntilExam < 0 ? 'neutral' : data.daysUntilExam <= 30 ? 'bad' : 'brand'}>
              <CalendarClock size={12} />
              {data.daysUntilExam < 0
                ? `Экзамен был ${toRuDate(data.user.examDate!)}`
                : data.daysUntilExam === 0
                  ? 'Экзамен сегодня'
                  : `До экзамена ${pluralize(data.daysUntilExam, 'день', 'дня', 'дней')}`}
            </Badge>
          ) : null}
          <Badge tone={data.streak.current > 0 ? 'warn' : 'neutral'}>
            <Flame size={12} />
            {pluralize(data.streak.current, 'день', 'дня', 'дней')} подряд
          </Badge>
        </div>
      </header>

      {data.preExam ? (
        <Alert tone="bad" title={`Предэкзаменационный режим · ${data.preExam.title}`} icon={<ShieldAlert size={16} />}>
          <p>
            {data.preExam.focus}. До демоэкзамена осталось {data.daysUntilExam}{' '}
            {pluralize(data.daysUntilExam ?? 0, 'день', 'дня', 'дней').split(' ')[1]} — программа рекомендует
            сосредоточиться именно на этом.
          </p>
        </Alert>
      ) : null}

      {/* Сегодня */}
      <section>
        <SectionTitle
          title="Сегодня"
          subtitle="Теория 30–45 минут · практика 1,5–2 часа · разбор по памяти 10–15 минут · коммит"
          action={
            today ? (
              <LinkButton href={`/plan/day/${today.id}`} size="sm" variant="primary" icon={<ArrowRight size={14} />}>
                Открыть день
              </LinkButton>
            ) : null
          }
        />
        {today ? (
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={today.kind === 'rest' ? 'neutral' : today.kind === 'control' ? 'warn' : 'brand'}>
                {DAY_KIND_LABELS[today.kind]}
              </Badge>
              <Badge tone="neutral">День {today.dayNo} недели {currentWeek.weekNo}</Badge>
              {today.estimatedMinutes ? (
                <Badge tone="neutral">≈ {formatMinutes(today.estimatedMinutes)}</Badge>
              ) : null}
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {/* Как и в плане: человеческое объяснение, а не формулировка программы. */}
              {(today.plain?.theory ?? today.theory) ? (
                <div>
                  <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-3)' }}>
                    <BookOpen size={13} /> Что изучаем
                  </p>
                  <p className="text-sm">{today.plain?.theory ?? today.theory}</p>
                </div>
              ) : null}
              {(today.plain?.practice ?? today.practice) ? (
                <div>
                  <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-3)' }}>
                    <Code2 size={13} /> Что делаем руками
                  </p>
                  <p className="text-sm">{today.plain?.practice ?? today.practice}</p>
                </div>
              ) : null}
            </div>

            {data.todayTopics.length || data.todayTasks.length ? (
              <div className="mt-3 flex flex-wrap gap-1.5 border-t pt-3" style={{ borderColor: 'var(--line)' }}>
                {data.todayTopics.map((topic) => (
                  <Link key={topic.id} href={`/theory/${topic.id}`} className="chip hover:underline">
                    {topic.done ? <CheckCircle2 size={11} style={{ color: 'var(--ok)' }} /> : <BookOpen size={11} />}
                    {topic.title}
                  </Link>
                ))}
                {data.todayTasks.map((task) => (
                  <Link key={task.id} href={`/tasks/${task.id}`} className="chip hover:underline">
                    {task.done ? <CheckCircle2 size={11} style={{ color: 'var(--ok)' }} /> : <Code2 size={11} />}
                    {task.title}
                  </Link>
                ))}
              </div>
            ) : null}
          </Card>
        ) : (
          <EmptyState title="План завершён" description="Все 210 дней программы пройдены." />
        )}
      </section>

      {/* Цифры */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Прогресс месяца"
          value={`${percent(data.monthProgress.done, data.monthProgress.total)}%`}
          hint={`${data.monthProgress.done} из ${data.monthProgress.total} дней`}
          icon={<CalendarClock size={15} />}
        />
        <Stat
          label="Решено заданий"
          value={data.overall.tasks.done}
          hint={data.overall.tasks.total ? `из ${data.overall.tasks.total} доступных` : 'задания скоро появятся'}
          icon={<Code2 size={15} />}
          tone="ok"
        />
        <Stat
          label="Успешных попыток"
          value={`${data.overall.successRate}%`}
          hint={`${data.overall.submissions} ${pluralize(data.overall.submissions, 'попытка', 'попытки', 'попыток').split(' ')[1]} всего`}
          icon={<Target size={15} />}
        />
        <Stat
          label="Готовность к экзамену"
          value={`${data.readiness.percent}%`}
          hint={data.readiness.label}
          tone={data.readiness.tone}
          icon={<TrendingUp size={15} />}
        />
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <div className="flex flex-col gap-5">
          {/* Рекомендации */}
          <section>
            <SectionTitle title="Рекомендации" subtitle="Что делать дальше — по вашим результатам" />
            {data.recommendations.length ? (
              <ul className="flex flex-col gap-2">
                {data.recommendations.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="card flex items-center gap-3 p-3 transition-transform duration-150 hover:-translate-y-px"
                    >
                      <span
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                        style={{ background: 'var(--brand-soft)', color: 'var(--brand-ink)' }}
                        aria-hidden="true"
                      >
                        {iconFor(item.kind)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{item.title}</span>
                        <span className="block text-xs" style={{ color: 'var(--ink-3)' }}>
                          {item.description}
                        </span>
                      </span>
                      <ArrowRight size={15} style={{ color: 'var(--ink-3)' }} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="Рекомендаций пока нет"
                description="Начните с первого дня программы — после нескольких заданий система подскажет, что повторить."
                action={<LinkButton href="/plan">Открыть учебный план</LinkButton>}
              />
            )}
          </section>

          {/* Прогресс по технологиям */}
          <section>
            <SectionTitle title="Прогресс по технологиям" subtitle="Темы и задания, закрытые по каждому стеку" />
            {data.techProgress.length ? (
              <Card>
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
              </Card>
            ) : (
              <EmptyState title="Данных пока нет" description="Прогресс появится после первых пройденных тем." />
            )}
          </section>
        </div>

        <div className="flex flex-col gap-5">
          {/* Слабые темы */}
          <section>
            <SectionTitle title="Слабые темы" subtitle="Где чаще всего ошибки и подсказки" />
            {data.weakTopics.length ? (
              <Card>
                <ul className="flex flex-col gap-2.5">
                  {data.weakTopics.map((topic) => (
                    <li key={topic.topicId}>
                      <Link href={`/theory/${topic.topicId}`} className="flex items-start justify-between gap-2 hover:underline">
                        <span className="text-sm font-medium">{topic.title}</span>
                        <Badge tone={topic.weakness > 0.6 ? 'bad' : 'warn'}>{Math.round(topic.weakness * 100)}%</Badge>
                      </Link>
                      {topic.reasons.length ? (
                        <p className="text-xs" style={{ color: 'var(--ink-3)' }}>
                          {topic.reasons.join(', ')}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Card>
            ) : (
              <Card>
                <p className="flex items-center gap-2 text-sm" style={{ color: 'var(--ink-3)' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--ok)' }} />
                  Слабых тем не обнаружено.
                </p>
              </Card>
            )}
          </section>

          {/* Повторение */}
          <section>
            <SectionTitle
              title="Повторение"
              action={
                data.dueReviews.length ? (
                  <LinkButton href="/review" size="sm" variant="secondary" icon={<Repeat2 size={14} />}>
                    Повторить
                  </LinkButton>
                ) : null
              }
            />
            <Card>
              {data.dueReviews.length ? (
                <ul className="flex flex-col gap-1.5 text-sm">
                  {data.dueReviews.slice(0, 5).map((item) => (
                    <li key={item.topicId}>
                      <Link href={`/theory/${item.topicId}`} className="hover:underline">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                  {data.dueReviews.length > 5 ? (
                    <li className="text-xs" style={{ color: 'var(--ink-3)' }}>
                      и ещё {data.dueReviews.length - 5}
                    </li>
                  ) : null}
                </ul>
              ) : (
                <p className="text-sm" style={{ color: 'var(--ink-3)' }}>
                  На сегодня повторять нечего.
                </p>
              )}
            </Card>
          </section>

          {/* Ближайшая контрольная точка */}
          <section>
            <SectionTitle title="Ближайшая контрольная точка" />
            <Card>
              {data.nextControl ? (
                <Link href={`/plan/day/${data.nextControl.id}`} className="block hover:underline">
                  <p className="text-sm font-medium">{data.nextControl.title}</p>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--ink-3)' }}>
                    {DAY_KIND_LABELS[data.nextControl.kind]} · {data.nextControl.plain?.practice ?? data.nextControl.practice}
                  </p>
                </Link>
              ) : (
                <p className="text-sm" style={{ color: 'var(--ink-3)' }}>
                  Контрольных точек впереди нет.
                </p>
              )}
            </Card>
          </section>

          {/* Последний экзамен */}
          <section>
            <SectionTitle
              title="Последний экзамен"
              action={
                <LinkButton href="/exams" size="sm" variant="secondary">
                  Все экзамены
                </LinkButton>
              }
            />
            <Card>
              {data.lastExam ? (
                <Link href={`/exams/attempts/${data.lastExam.id}`} className="block">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-semibold tabular-nums">{data.lastExam.percent}%</span>
                    <span className="text-xs" style={{ color: 'var(--ink-3)' }}>
                      {data.lastExam.finishedAt ? toRuDate(data.lastExam.finishedAt) : ''}
                    </span>
                  </div>
                  <ProgressBar
                    value={data.lastExam.percent}
                    tone={data.lastExam.percent >= 80 ? 'ok' : data.lastExam.percent >= 60 ? 'warn' : 'bad'}
                    size="sm"
                  />
                  <p className="mt-1.5 text-xs" style={{ color: 'var(--ink-3)' }}>
                    {data.lastExam.score} из {data.lastExam.maxScore} баллов
                  </p>
                </Link>
              ) : (
                <p className="text-sm" style={{ color: 'var(--ink-3)' }}>
                  Экзаменов ещё не было. Вариант {EXAM_META.code} доступен в разделе «Экзамены».
                </p>
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

function percent(done: number, total: number): number {
  return total ? Math.round((done / total) * 100) : 0;
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Доброй ночи';
  if (hour < 12) return 'Доброе утро';
  if (hour < 18) return 'Добрый день';
  return 'Добрый вечер';
}

function iconFor(kind: string) {
  switch (kind) {
    case 'review':
      return <Repeat2 size={15} />;
    case 'theory':
      return <BookOpen size={15} />;
    case 'practice':
      return <Code2 size={15} />;
    case 'exam':
      return <ShieldAlert size={15} />;
    default:
      return <Target size={15} />;
  }
}
