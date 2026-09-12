'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { AlertTriangle, Check, CheckCircle2, Clock, Flag, ListChecks, PlayCircle, X } from 'lucide-react';
import type { Quiz, Runtime, TestCase } from '@/content/types';
import { Alert, Badge, Card, ProgressBar } from '@/components/ui/base';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { Markdown } from '@/lib/markdown';
import { ExamCodeTask } from './exam-code-task';
import { QuizRunner } from '@/components/quiz/quiz-runner';
import { abortExam, finishExam, finishModule, saveExamAnswer, startModule } from '@/lib/actions/exam-actions';
import type { ModuleState } from '@/lib/exam/service';

export type ExamRunnerTask =
  | {
      id: string;
      kind: 'code';
      points: number;
      title: string;
      task: {
        id: string;
        statement: string;
        requirements: string[];
        runtime: Runtime;
        starterCode: string;
        setupSql?: string;
        viewport?: { width: number; height: number };
        tests: TestCase[];
        maxScore: number;
        timeLimitMs?: number;
      };
    }
  | { id: string; kind: 'quiz'; points: number; title: string; quiz: Quiz }
  | {
      id: string;
      kind: 'checklist';
      points: number;
      title: string;
      description: string;
      items: { id: string; text: string; points: number; quote?: string }[];
    };

interface ExamModuleView {
  id: string;
  moduleNo: number;
  title: string;
  minutes: number;
  instruction: string;
  tasks: ExamRunnerTask[];
}

/**
 * Экзаменационный режим (разделы 20 и 43 ТЗ):
 * таймер по каждому модулю, навигация по заданиям, автосохранение ответов,
 * предупреждение перед завершением и отключённые подсказки.
 */
export function ExamRunner({
  attemptId,
  examTitle,
  isDemo,
  modules,
  moduleState,
  answers,
  startedAt,
}: {
  attemptId: string;
  examTitle: string;
  isDemo: boolean;
  modules: ExamModuleView[];
  moduleState: ModuleState[];
  answers: Record<string, { answerJson: string; score: number; maxScore: number; passed: boolean }>;
  startedAt: string;
}) {
  const [state, setState] = useState<ModuleState[]>(moduleState);
  const [activeModuleId, setActiveModuleId] = useState(
    () => state.find((item) => item.startedAt && !item.finished)?.moduleId ?? modules[0].id,
  );
  const [activeTaskId, setActiveTaskId] = useState<string>(modules[0].tasks[0]?.id ?? '');
  const [saved, setSaved] = useState<Record<string, { score: number; maxScore: number; passed: boolean }>>(() => {
    const initial: Record<string, { score: number; maxScore: number; passed: boolean }> = {};
    for (const [id, value] of Object.entries(answers)) {
      initial[id] = { score: value.score, maxScore: value.maxScore, passed: value.passed };
    }
    return initial;
  });
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [confirmAbort, setConfirmAbort] = useState(false);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  const activeModule = modules.find((item) => item.id === activeModuleId) ?? modules[0];
  const activeModuleState = state.find((item) => item.moduleId === activeModule.id);
  const activeTask = activeModule.tasks.find((item) => item.id === activeTaskId) ?? activeModule.tasks[0];

  // При переходе к другому модулю выбранное задание сбрасывается на первое.
  // Правка состояния во время отрисовки — рекомендованный способ подстроить
  // состояние под изменившиеся данные, без лишнего прохода через эффект.
  const [taskModuleId, setTaskModuleId] = useState(activeModule.id);
  if (taskModuleId !== activeModule.id) {
    setTaskModuleId(activeModule.id);
    setActiveTaskId(activeModule.tasks[0]?.id ?? '');
  }

  const totals = useMemo(() => {
    const maxScore = modules.reduce(
      (sum, module) => sum + module.tasks.reduce((moduleSum, task) => moduleSum + task.points, 0),
      0,
    );
    const score = Object.values(saved).reduce((sum, item) => sum + item.score, 0);
    const answered = Object.keys(saved).length;
    const total = modules.reduce((sum, module) => sum + module.tasks.length, 0);
    return { score: Math.round(score * 10) / 10, maxScore, answered, total };
  }, [modules, saved]);

  const openModule = (moduleId: string) => {
    setActiveModuleId(moduleId);
    const target = state.find((item) => item.moduleId === moduleId);
    if (target && !target.startedAt) {
      startTransition(async () => {
        const result = await startModule(attemptId, moduleId);
        if (result.ok) setState(result.modules);
      });
    }
  };

  const persist = useCallback(
    async (examTaskId: string, kind: 'code' | 'quiz' | 'checklist', answer: unknown) => {
      const result = await saveExamAnswer({ attemptId, examTaskId, kind, answer });
      if (!result.ok) {
        toast.error('Ответ не сохранён', result.error);
        return;
      }
      setSaved((prev) => ({
        ...prev,
        [examTaskId]: { score: result.score, maxScore: result.maxScore, passed: result.passed },
      }));
    },
    [attemptId, toast],
  );

  const onFinishModule = (moduleId: string) => {
    startTransition(async () => {
      const result = await finishModule(attemptId, moduleId);
      if (result.ok) {
        setState(result.modules);
        toast.info('Модуль закрыт');
        const nextModule = modules.find((module) => !result.modules.find((item) => item.moduleId === module.id)?.finished);
        if (nextModule) openModule(nextModule.id);
      }
    });
  };

  const unanswered = totals.total - totals.answered;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-3">
      {/* Шапка экзамена */}
      <div className="card sticky top-14 z-10 flex flex-wrap items-center gap-3 p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{examTitle}</p>
          <p className="text-xs" style={{ color: 'var(--ink-3)' }}>
            Начат {new Date(startedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} ·{' '}
            {isDemo ? 'реальный вариант' : 'тренировка'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {modules.map((module) => {
            const moduleData = state.find((item) => item.moduleId === module.id);
            return (
              <button
                key={module.id}
                type="button"
                onClick={() => openModule(module.id)}
                className="rounded-lg border px-2.5 py-1.5 text-xs transition-colors"
                style={{
                  borderColor: module.id === activeModuleId ? 'var(--brand)' : 'var(--line)',
                  background: module.id === activeModuleId ? 'var(--brand-soft)' : 'transparent',
                  color: moduleData?.finished ? 'var(--ink-3)' : 'var(--ink)',
                }}
              >
                Модуль {module.moduleNo}
                {moduleData?.finished ? ' ✓' : ''}
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <ModuleTimer
            endsAt={activeModuleState?.endsAt ?? null}
            minutes={activeModule.minutes}
            finished={Boolean(activeModuleState?.finished)}
            started={Boolean(activeModuleState?.startedAt)}
          />
          <Button variant="secondary" size="sm" onClick={() => setConfirmFinish(true)} icon={<Flag size={14} />}>
            Завершить
          </Button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[260px_1fr]">
        {/* Навигация по заданиям */}
        <aside className="flex flex-col gap-3">
          <Card>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-3)' }}>
              Модуль {activeModule.moduleNo} · {activeModule.minutes} мин
            </p>
            <ul className="flex flex-col gap-1">
              {activeModule.tasks.map((task) => {
                const answer = saved[task.id];
                return (
                  <li key={task.id}>
                    <button
                      type="button"
                      onClick={() => setActiveTaskId(task.id)}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors"
                      style={{
                        background: task.id === activeTaskId ? 'var(--brand-soft)' : 'transparent',
                        color: task.id === activeTaskId ? 'var(--brand-ink)' : 'var(--ink-2)',
                      }}
                    >
                      <span className="shrink-0">
                        {answer ? (
                          answer.score >= answer.maxScore ? (
                            <CheckCircle2 size={14} style={{ color: 'var(--ok)' }} />
                          ) : (
                            <Check size={14} style={{ color: 'var(--warn)' }} />
                          )
                        ) : (
                          <span className="inline-block h-3.5 w-3.5 rounded-full border" style={{ borderColor: 'var(--line)' }} />
                        )}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{task.title}</span>
                      <span className="shrink-0 text-[11px]" style={{ color: 'var(--ink-3)' }}>
                        {answer ? `${Math.round(answer.score)}/` : ''}
                        {task.points}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {!activeModuleState?.finished ? (
              <Button
                variant="secondary"
                size="sm"
                full
                className="mt-3"
                onClick={() => onFinishModule(activeModule.id)}
                loading={pending}
              >
                Закрыть модуль {activeModule.moduleNo}
              </Button>
            ) : (
              <p className="mt-3 text-center text-xs" style={{ color: 'var(--ok)' }}>
                Модуль закрыт
              </p>
            )}
          </Card>

          <Card>
            <ProgressBar
              value={totals.answered}
              max={totals.total}
              label={`Отвечено: ${totals.answered} из ${totals.total}`}
              showValue
              size="sm"
            />
            <p className="mt-2 text-xs" style={{ color: 'var(--ink-3)' }}>
              Набрано: {totals.score} из {totals.maxScore} баллов
            </p>
          </Card>

          <Alert tone="neutral">
            <p className="text-xs">Подсказки в экзаменационном режиме отключены. Ответы сохраняются автоматически.</p>
          </Alert>
        </aside>

        {/* Задание */}
        <div className="min-w-0">
          {!activeModuleState?.startedAt ? (
            <Card>
              <div className="py-6 text-center">
                <p className="text-sm font-medium">Модуль {activeModule.moduleNo} ещё не начат</p>
                <p className="mt-1 text-sm" style={{ color: 'var(--ink-3)' }}>
                  Таймер на {activeModule.minutes} минут запустится сразу после нажатия.
                </p>
                <Button className="mt-3" onClick={() => openModule(activeModule.id)} icon={<PlayCircle size={15} />}>
                  Начать модуль {activeModule.moduleNo}
                </Button>
              </div>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              <Card>
                <details>
                  <summary className="cursor-pointer text-sm font-medium">
                    Инструкция модуля {activeModule.moduleNo}
                  </summary>
                  <div className="mt-2">
                    <Markdown source={activeModule.instruction} />
                  </div>
                </details>
              </Card>

              {activeTask ? (
                <TaskPanel
                  key={activeTask.id}
                  task={activeTask}
                  savedAnswerJson={answers[activeTask.id]?.answerJson}
                  onAnswer={persist}
                  disabled={Boolean(activeModuleState?.finished)}
                />
              ) : (
                <Card>
                  <p className="text-sm" style={{ color: 'var(--ink-3)' }}>
                    В этом модуле нет заданий с автоматической проверкой.
                  </p>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => setConfirmAbort(true)}>
          Прервать экзамен
        </Button>
      </div>

      <Modal
        open={confirmFinish}
        onClose={() => setConfirmFinish(false)}
        title="Завершить экзамен?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmFinish(false)}>
              Вернуться к заданиям
            </Button>
            <Button
              variant="success"
              icon={<Flag size={15} />}
              loading={pending}
              onClick={() => startTransition(async () => { await finishExam(attemptId); })}
            >
              Завершить и посмотреть результат
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-2 text-sm">
          {unanswered > 0 ? (
            <p className="flex items-start gap-2" style={{ color: 'var(--warn)' }}>
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              Не заполнено {unanswered} из {totals.total} пунктов. После завершения изменить ответы будет нельзя.
            </p>
          ) : (
            <p style={{ color: 'var(--ok)' }}>Все пункты заполнены.</p>
          )}
          <p>
            Текущий результат: {totals.score} из {totals.maxScore} баллов.
          </p>
          <p style={{ color: 'var(--ink-3)' }}>После завершения откроется разбор с сильными и слабыми сторонами и планом.</p>
        </div>
      </Modal>

      <Modal
        open={confirmAbort}
        onClose={() => setConfirmAbort(false)}
        title="Прервать экзамен?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmAbort(false)}>
              Отмена
            </Button>
            <Button
              variant="danger"
              icon={<X size={15} />}
              loading={pending}
              onClick={() => startTransition(async () => { await abortExam(attemptId); })}
            >
              Прервать
            </Button>
          </>
        }
      >
        <p className="text-sm">
          Попытка будет помечена как прерванная и не попадёт в статистику результатов. Ответы сохранятся, но разбора не
          будет.
        </p>
      </Modal>
    </div>
  );
}

function TaskPanel({
  task,
  savedAnswerJson,
  onAnswer,
  disabled,
}: {
  task: ExamRunnerTask;
  savedAnswerJson?: string;
  onAnswer: (examTaskId: string, kind: 'code' | 'quiz' | 'checklist', answer: unknown) => Promise<void>;
  disabled: boolean;
}) {
  if (task.kind === 'code') {
    return (
      <ExamCodeTask
        examTaskId={task.id}
        title={task.title}
        points={task.points}
        task={task.task}
        savedAnswerJson={savedAnswerJson}
        onAnswer={onAnswer}
        disabled={disabled}
      />
    );
  }

  if (task.kind === 'quiz') {
    return (
      <Card>
        <p className="mb-3 text-sm font-medium">{task.title}</p>
        <QuizRunner quiz={task.quiz} />
      </Card>
    );
  }

  return <ChecklistPanel task={task} savedAnswerJson={savedAnswerJson} onAnswer={onAnswer} disabled={disabled} />;
}

function ChecklistPanel({
  task,
  savedAnswerJson,
  onAnswer,
  disabled,
}: {
  task: Extract<ExamRunnerTask, { kind: 'checklist' }>;
  savedAnswerJson?: string;
  onAnswer: (examTaskId: string, kind: 'code' | 'quiz' | 'checklist', answer: unknown) => Promise<void>;
  disabled: boolean;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const parsed = savedAnswerJson ? JSON.parse(savedAnswerJson) : {};
      return parsed && typeof parsed === 'object' ? (parsed as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => void onAnswer(task.id, 'checklist', next), 500);
  };

  const earned = task.items.reduce((sum, item) => sum + (checked[item.id] ? item.points : 0), 0);

  return (
    <Card>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-medium">
          <ListChecks size={15} style={{ color: 'var(--brand)' }} />
          {task.title}
        </p>
        <Badge tone={earned >= task.points ? 'ok' : 'neutral'}>
          {earned} / {task.points} баллов
        </Badge>
      </div>
      <p className="mb-3 text-xs" style={{ color: 'var(--ink-3)' }}>
        {task.description}
      </p>

      <ul className="flex flex-col gap-1.5">
        {task.items.map((item) => (
          <li key={item.id}>
            <label
              className="flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors"
              style={{
                borderColor: checked[item.id] ? 'var(--ok)' : 'var(--line)',
                background: checked[item.id] ? 'var(--ok-soft)' : 'transparent',
                opacity: disabled ? 0.6 : 1,
              }}
            >
              <input
                type="checkbox"
                checked={Boolean(checked[item.id])}
                onChange={() => toggle(item.id)}
                disabled={disabled}
                className="mt-0.5"
              />
              <span className="min-w-0 flex-1">
                {item.text}
                {item.quote ? (
                  <span className="mt-0.5 block text-[11px] italic" style={{ color: 'var(--ink-3)' }}>
                    «{item.quote}»
                  </span>
                ) : null}
              </span>
              <span className="shrink-0 text-xs" style={{ color: 'var(--ink-3)' }}>
                {item.points} б.
              </span>
            </label>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ModuleTimer({
  endsAt,
  minutes,
  finished,
  started,
}: {
  endsAt: string | null;
  minutes: number;
  finished: boolean;
  started: boolean;
}) {
  // Текущее время — внешний источник, который тикает сам. Остаток вычисляется
  // из него, а не хранится отдельным состоянием: одно значение вместо двух.
  // Начальное значение null: на сервере времени клиента не существует, и без
  // этого при гидратации разошлась бы разметка.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!endsAt || finished) return;

    const tick = () => setNow(Date.now());
    // Первый тик через setTimeout(0), чтобы не менять состояние синхронно
    // в теле эффекта: задержка незаметна, лишнего каскада отрисовок нет.
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 1000);

    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [endsAt, finished]);

  const left =
    endsAt && !finished && now !== null
      ? Math.max(0, Math.round((new Date(endsAt).getTime() - now) / 1000))
      : null;

  if (finished) {
    return (
      <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--ok)' }}>
        <CheckCircle2 size={15} /> Модуль закрыт
      </span>
    );
  }

  if (!started || left === null) {
    return (
      <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--ink-3)' }}>
        <Clock size={15} /> {minutes} мин
      </span>
    );
  }

  const hours = Math.floor(left / 3600);
  const mins = Math.floor((left % 3600) / 60);
  const secs = left % 60;
  const critical = left <= 300;

  return (
    <span
      className="flex items-center gap-1.5 font-mono text-base tabular-nums"
      style={{ color: left === 0 ? 'var(--bad)' : critical ? 'var(--warn)' : 'var(--ink)' }}
      role="timer"
      aria-live={critical ? 'polite' : 'off'}
    >
      <Clock size={15} />
      {hours > 0 ? `${hours}:` : ''}
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      {left === 0 ? <span className="text-xs">время вышло</span> : null}
    </span>
  );
}
