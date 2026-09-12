'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Eye,
  Lightbulb,
  Play,
  RotateCcw,
  Save,
  Terminal,
  X,
  XCircle,
} from 'lucide-react';
import type { Hint, Runtime, TestCase } from '@/content/types';
import type { ConsoleLine, RunOutcome, TestResult } from '@/lib/runner/types';
import { runInSandbox } from '@/lib/runner/client';
import { CodeEditor, type EditorLanguage } from '@/components/editor/code-editor';
import { Badge, Card } from '@/components/ui/base';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/study/code-block';
import { useToast } from '@/components/ui/toast';
import { formatMs } from '@/lib/utils';
import { resetTask, revealHint, saveDraft, submitSolution } from '@/lib/actions/task-actions';

const LANGUAGE_BY_RUNTIME: Record<Runtime, EditorLanguage> = {
  js: 'javascript',
  ts: 'typescript',
  dom: 'html',
  react: 'typescript',
  sql: 'sql',
};

export interface AttemptSummary {
  id: string;
  attemptNo: number;
  passed: boolean;
  passedTests: number;
  totalTests: number;
  score: number;
  maxScore: number;
  createdAt: string;
  code: string;
}

export function TaskWorkspace({
  taskId,
  runtime,
  starterCode,
  draftCode,
  initialHintsUsed,
  hints,
  tests,
  setupSql,
  viewport,
  solution,
  solutionExplanation,
  maxScore,
  attempts,
  timeLimitMs,
  examAttemptId,
  source = 'task',
  hideHints = false,
  onSolved,
}: {
  taskId: string;
  runtime: Runtime;
  starterCode: string;
  draftCode: string | null;
  initialHintsUsed: number;
  hints: Hint[];
  tests: TestCase[];
  setupSql?: string;
  viewport?: { width: number; height: number };
  solution: string;
  solutionExplanation: string;
  maxScore: number;
  attempts: AttemptSummary[];
  timeLimitMs?: number;
  examAttemptId?: string;
  source?: 'task' | 'exam' | 'project' | 'review';
  /** В экзаменационном режиме обычные подсказки запрещены (раздел 43 ТЗ). */
  hideHints?: boolean;
  onSolved?: () => void;
}) {
  const [code, setCode] = useState(draftCode ?? starterCode);
  const [running, setRunning] = useState(false);
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);
  const [hintsUsed, setHintsUsed] = useState(initialHintsUsed);
  const [showSolution, setShowSolution] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [tab, setTab] = useState<'tests' | 'console' | 'preview' | 'history'>('tests');
  const [localAttempts, setLocalAttempts] = useState(attempts);

  const previewRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cancelRef = useRef<(() => void) | null>(null);
  const toast = useToast();
  const router = useRouter();

  const needsPreview = runtime === 'dom' || runtime === 'react';
  const language = LANGUAGE_BY_RUNTIME[runtime];
  const attemptCount = localAttempts.length;
  const solutionUnlocked = showSolution || attemptCount >= 3;

  // Автосохранение черновика (раздел 38 ТЗ).
  const scheduleSave = useCallback(
    (nextCode: string, nextHints: number) => {
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        setSaveState('saving');
        const result = await saveDraft(taskId, nextCode, runtime, nextHints);
        setSaveState(result.ok ? 'saved' : 'idle');
        if (result.ok) setTimeout(() => setSaveState('idle'), 1500);
      }, 1200);
    },
    [taskId, runtime],
  );

  useEffect(() => () => clearTimeout(saveTimer.current), []);

  const onCodeChange = (next: string) => {
    setCode(next);
    scheduleSave(next, hintsUsed);
  };

  const saveNow = useCallback(async () => {
    clearTimeout(saveTimer.current);
    setSaveState('saving');
    const result = await saveDraft(taskId, code, runtime, hintsUsed);
    setSaveState(result.ok ? 'saved' : 'idle');
    if (result.ok) {
      toast.success('Черновик сохранён');
      setTimeout(() => setSaveState('idle'), 1500);
    }
  }, [code, hintsUsed, runtime, taskId, toast]);

  const run = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setOutcome(null);
    if (needsPreview) setTab('preview');

    // Контейнер предпросмотра очищается перед каждым запуском.
    if (previewRef.current) previewRef.current.innerHTML = '';

    const handle = runInSandbox(
      { runtime, code, tests, setupSql, viewport, timeLimitMs, mode: 'test' },
      needsPreview ? previewRef.current : null,
    );
    cancelRef.current = handle.cancel;

    const result = await handle.promise;
    cancelRef.current = null;
    setOutcome(result);
    setRunning(false);

    if (!needsPreview) setTab(result.results.length ? 'tests' : 'console');
    else if (result.results.length) setTab('tests');

    if (!result.ok) {
      toast.error('Код не выполнился', result.failure?.message.slice(0, 120));
      return;
    }

    // Результат попытки уходит на сервер: балл пересчитывается там.
    const saved = await submitSolution({
      taskId,
      code,
      results: result.results.map((item) => ({
        id: item.id,
        name: item.name,
        passed: item.passed,
        points: item.points,
        hidden: item.hidden,
        durationMs: item.durationMs,
        input: item.input,
        expected: item.expected,
        actual: item.actual,
        message: item.message,
        error: item.error,
      })),
      runtimeMs: result.durationMs,
      source,
      examAttemptId,
    });

    if (!saved.ok) {
      toast.error('Результат не сохранён', saved.error);
      return;
    }

    setLocalAttempts((list) => [
      {
        id: saved.submissionId,
        attemptNo: saved.attemptNo,
        passed: saved.passed,
        passedTests: saved.passedTests,
        totalTests: saved.totalTests,
        score: saved.score,
        maxScore: saved.maxScore,
        createdAt: new Date().toISOString(),
        code,
      },
      ...list,
    ]);

    if (saved.passed) {
      toast.success(
        `Задание решено — ${saved.score} из ${saved.maxScore} баллов`,
        saved.hintPenalty > 0 ? `Штраф за подсказки: −${saved.hintPenalty}` : undefined,
      );
      for (const achievement of saved.unlocked) {
        toast.show({ tone: 'success', title: `${achievement.icon} ${achievement.title}`, description: 'Новое достижение' });
      }
      onSolved?.();
      router.refresh();
    } else {
      toast.info(
        `Пройдено тестов: ${saved.passedTests} из ${saved.totalTests}`,
        'Посмотрите, какой тест упал, и исправьте код.',
      );
    }
  }, [
    code,
    examAttemptId,
    needsPreview,
    onSolved,
    router,
    running,
    runtime,
    setupSql,
    source,
    taskId,
    viewport,
    tests,
    timeLimitMs,
    toast,
  ]);

  const onReset = async () => {
    const result = await resetTask(taskId);
    if (result.ok && result.starterCode !== undefined) {
      setCode(result.starterCode);
      setHintsUsed(0);
      setOutcome(null);
      toast.info('Задание сброшено к исходному состоянию');
    }
  };

  const openHint = async (level: number) => {
    const result = await revealHint(taskId, level);
    if (!result.ok) return;
    setHintsUsed(result.hintsUsed ?? level);
    if (result.penaltyPercent) {
      toast.info(`Подсказка ${level}`, `Максимальный балл уменьшен на ${result.penaltyPercent}%`);
    }
  };

  const stats = useMemo(() => {
    if (!outcome?.results.length) return null;
    const passed = outcome.results.filter((item) => item.passed).length;
    return { passed, total: outcome.results.length, allPassed: passed === outcome.results.length };
  }, [outcome]);

  return (
    <div className="flex flex-col gap-3">
      {/* Панель управления */}
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={run} loading={running} icon={<Play size={15} />}>
          {running ? 'Выполняется…' : 'Запустить тесты'}
        </Button>
        {running ? (
          <Button variant="secondary" onClick={() => cancelRef.current?.()} icon={<X size={15} />}>
            Остановить
          </Button>
        ) : null}
        <Button variant="secondary" size="md" onClick={saveNow} icon={<Save size={15} />}>
          Сохранить
        </Button>
        <Button variant="ghost" size="md" onClick={onReset} icon={<RotateCcw size={15} />}>
          Сбросить
        </Button>

        <span className="ml-auto flex items-center gap-3 text-xs" style={{ color: 'var(--ink-3)' }}>
          <span>
            {saveState === 'saving' ? 'Сохраняем…' : saveState === 'saved' ? 'Черновик сохранён' : 'Ctrl+Enter — запуск'}
          </span>
          {attemptCount > 0 ? <span>Попыток: {attemptCount}</span> : null}
        </span>
      </div>

      <CodeEditor
        value={code}
        onChange={onCodeChange}
        language={language}
        height={runtime === 'dom' ? 360 : 420}
        onRunShortcut={run}
        onSaveShortcut={saveNow}
        ariaLabel="Решение задания"
      />

      {/* Вкладки результата */}
      <Card className="!p-0">
        <div className="flex gap-1 border-b px-2 pt-2" style={{ borderColor: 'var(--line)' }} role="tablist">
          <TabButton active={tab === 'tests'} onClick={() => setTab('tests')} role="tab">
            Тесты
            {stats ? (
              <Badge tone={stats.allPassed ? 'ok' : 'bad'}>
                {stats.passed}/{stats.total}
              </Badge>
            ) : null}
          </TabButton>
          <TabButton active={tab === 'console'} onClick={() => setTab('console')} role="tab">
            <Terminal size={13} /> Вывод
            {outcome?.logs.length ? <Badge tone="neutral">{outcome.logs.length}</Badge> : null}
          </TabButton>
          {needsPreview ? (
            <TabButton active={tab === 'preview'} onClick={() => setTab('preview')} role="tab">
              <Eye size={13} /> Результат
            </TabButton>
          ) : null}
          <TabButton active={tab === 'history'} onClick={() => setTab('history')} role="tab">
            <Clock size={13} /> История
            {attemptCount ? <Badge tone="neutral">{attemptCount}</Badge> : null}
          </TabButton>
        </div>

        <div className="p-3">
          {tab === 'tests' ? <TestsPanel outcome={outcome} running={running} onRetry={run} maxScore={maxScore} /> : null}
          {tab === 'console' ? <ConsolePanel logs={outcome?.logs ?? []} notes={outcome?.notes ?? []} /> : null}
          {tab === 'preview' ? (
            <div>
              <p className="mb-2 text-xs" style={{ color: 'var(--ink-3)' }}>
                Страница выполняется в изолированном окне без доступа к приложению.
              </p>
              <div
                ref={previewRef}
                className="overflow-hidden rounded-lg border"
                style={{ borderColor: 'var(--line)', height: 360, background: '#fff' }}
              />
            </div>
          ) : null}
          {tab === 'history' ? <HistoryPanel attempts={localAttempts} onRestore={(value) => setCode(value)} /> : null}
        </div>
      </Card>

      {/* Подсказки */}
      {!hideHints && hints.length ? (
        <Card>
          <p className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Lightbulb size={15} style={{ color: 'var(--warn)' }} />
            Подсказки
          </p>
          <div className="flex flex-col gap-2">
            {hints.map((hint) => {
              const opened = hintsUsed >= hint.level;
              return (
                <div key={hint.level}>
                  {opened ? (
                    <div
                      className="rounded-lg border p-3 text-sm"
                      style={{ background: 'var(--warn-soft)', borderColor: 'var(--warn)' }}
                    >
                      <p className="mb-1 text-xs font-semibold" style={{ color: 'var(--warn)' }}>
                        Подсказка {hint.level} · −{hint.penaltyPercent}% от балла
                      </p>
                      <p>{hint.text}</p>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openHint(hint.level)}
                      icon={<ChevronDown size={14} />}
                      disabled={hint.level > 1 && hintsUsed < hint.level - 1}
                    >
                      Открыть подсказку {hint.level} (−{hint.penaltyPercent}%)
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-3 border-t pt-3" style={{ borderColor: 'var(--line)' }}>
            {solutionUnlocked ? (
              <div>
                <p className="mb-2 text-sm font-medium">Разбор решения</p>
                <CodeBlock code={solution} language={language} />
                {solutionExplanation ? (
                  <p className="mt-2 text-sm" style={{ color: 'var(--ink-2)' }}>
                    {solutionExplanation}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs" style={{ color: 'var(--ink-3)' }}>
                  Решение открывается после трёх попыток — сейчас {attemptCount}. Можно открыть раньше, но так задание
                  тренирует хуже.
                </p>
                <Button variant="ghost" size="sm" onClick={() => setShowSolution(true)}>
                  Всё равно показать решение
                </Button>
              </div>
            )}
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
  role,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  role?: string;
}) {
  return (
    <button
      type="button"
      role={role}
      aria-selected={active}
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-t-lg border-b-2 px-3 py-1.5 text-sm transition-colors"
      style={{
        borderColor: active ? 'var(--brand)' : 'transparent',
        color: active ? 'var(--ink)' : 'var(--ink-3)',
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
    </button>
  );
}

function TestsPanel({
  outcome,
  running,
  onRetry,
  maxScore,
}: {
  outcome: RunOutcome | null;
  running: boolean;
  onRetry: () => void;
  maxScore: number;
}) {
  if (running) {
    return (
      <p className="py-6 text-center text-sm" style={{ color: 'var(--ink-3)' }}>
        Выполняем код в песочнице…
      </p>
    );
  }

  if (!outcome) {
    return (
      <p className="py-6 text-center text-sm" style={{ color: 'var(--ink-3)' }}>
        Нажмите «Запустить тесты» (или Ctrl+Enter), чтобы проверить решение. Максимум за задание: {maxScore} баллов.
      </p>
    );
  }

  if (!outcome.ok && outcome.failure) {
    const title =
      outcome.failure.kind === 'timeout'
        ? 'Выполнение прервано по времени'
        : outcome.failure.kind === 'compile'
          ? 'Код не компилируется'
          : 'Ошибка при выполнении кода';
    return (
      <div
        className="rounded-lg border p-3"
        style={{ background: 'var(--bad-soft)', borderColor: 'var(--bad)' }}
        role="alert"
      >
        <p className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--bad)' }}>
          <AlertTriangle size={15} /> {title}
        </p>
        <p className="mt-1 text-sm">{outcome.failure.message}</p>
        {outcome.failure.stack ? (
          <pre className="mt-2 overflow-x-auto text-xs" style={{ color: 'var(--ink-2)' }}>
            {outcome.failure.stack}
          </pre>
        ) : null}
        <Button variant="secondary" size="sm" className="mt-2" onClick={onRetry}>
          Повторить
        </Button>
      </div>
    );
  }

  if (!outcome.results.length) {
    return (
      <p className="py-6 text-center text-sm" style={{ color: 'var(--ink-3)' }}>
        Код выполнился, но тестов для проверки нет. Посмотрите вкладку «Вывод».
      </p>
    );
  }

  const passed = outcome.results.filter((item) => item.passed).length;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge tone={passed === outcome.results.length ? 'ok' : 'bad'}>
          {passed === outcome.results.length ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          {passed} из {outcome.results.length} тестов
        </Badge>
        <span className="text-xs" style={{ color: 'var(--ink-3)' }}>
          Время выполнения: {formatMs(outcome.durationMs)}
        </span>
      </div>

      <ul className="flex flex-col gap-1.5">
        {outcome.results.map((result) => (
          <li key={result.id}>
            <TestResultRow result={result} />
          </li>
        ))}
      </ul>

      {outcome.notes.length ? (
        <div className="mt-3 rounded-lg border p-2.5 text-xs" style={{ borderColor: 'var(--line)', background: 'var(--surface-2)' }}>
          <p className="mb-1 font-medium">Заметки песочницы</p>
          <ul className="flex list-disc flex-col gap-0.5 pl-4" style={{ color: 'var(--ink-3)' }}>
            {outcome.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function TestResultRow({ result }: { result: TestResult }) {
  const [open, setOpen] = useState(!result.passed);
  const hasDetails = Boolean(result.expected || result.actual || result.message || result.input);

  return (
    <div
      className="rounded-lg border"
      style={{
        borderColor: result.passed ? 'var(--line)' : 'var(--bad)',
        background: result.passed ? 'var(--surface-2)' : 'var(--bad-soft)',
      }}
    >
      <button
        type="button"
        onClick={() => hasDetails && setOpen((value) => !value)}
        className="flex w-full items-center gap-2 px-2.5 py-2 text-left text-sm"
        aria-expanded={open}
      >
        {result.passed ? (
          <Check size={14} style={{ color: 'var(--ok)' }} />
        ) : (
          <X size={14} style={{ color: 'var(--bad)' }} />
        )}
        <span className="min-w-0 flex-1 truncate">{result.name}</span>
        <span className="shrink-0 text-xs tabular-nums" style={{ color: 'var(--ink-3)' }}>
          {formatMs(result.durationMs)}
        </span>
        <span
          className="shrink-0 rounded px-1.5 text-[11px] font-medium"
          style={{
            background: result.passed ? 'var(--ok-soft)' : 'var(--bad-soft)',
            color: result.passed ? 'var(--ok)' : 'var(--bad)',
          }}
        >
          {result.passed ? 'PASS' : 'FAIL'}
        </span>
      </button>

      {open && hasDetails ? (
        <div className="border-t px-2.5 py-2 text-xs" style={{ borderColor: 'var(--line)' }}>
          {result.input ? (
            <Row label="Вход" value={result.input} />
          ) : null}
          {result.expected !== undefined ? <Row label="Ожидалось" value={result.expected} tone="ok" /> : null}
          {result.actual !== undefined ? <Row label="Получено" value={result.actual} tone={result.passed ? 'ok' : 'bad'} /> : null}
          {result.message ? <Row label={result.error ? 'Ошибка' : 'Сообщение'} value={result.message} tone="bad" /> : null}
        </div>
      ) : null}
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: 'ok' | 'bad' }) {
  return (
    <div className="mb-1 flex gap-2 last:mb-0">
      <span className="w-20 shrink-0" style={{ color: 'var(--ink-3)' }}>
        {label}
      </span>
      <pre
        className="min-w-0 flex-1 overflow-x-auto whitespace-pre-wrap break-words"
        style={{
          fontFamily: 'var(--font-mono)',
          color: tone === 'ok' ? 'var(--ok)' : tone === 'bad' ? 'var(--bad)' : 'var(--ink)',
        }}
      >
        {value}
      </pre>
    </div>
  );
}

function ConsolePanel({ logs, notes }: { logs: ConsoleLine[]; notes: string[] }) {
  if (!logs.length && !notes.length) {
    return (
      <p className="py-6 text-center text-sm" style={{ color: 'var(--ink-3)' }}>
        Вывод пуст. Используйте <code>console.log(...)</code>, чтобы посмотреть значения.
      </p>
    );
  }
  return (
    <pre
      className="max-h-72 overflow-auto rounded-lg p-3 text-xs"
      style={{ background: 'var(--surface-3)', fontFamily: 'var(--font-mono)' }}
    >
      {logs.map((line, index) => (
        <div
          key={index}
          style={{
            color: line.level === 'error' ? 'var(--bad)' : line.level === 'warn' ? 'var(--warn)' : 'var(--ink)',
          }}
        >
          {line.text}
        </div>
      ))}
    </pre>
  );
}

function HistoryPanel({ attempts, onRestore }: { attempts: AttemptSummary[]; onRestore: (code: string) => void }) {
  if (!attempts.length) {
    return (
      <p className="py-6 text-center text-sm" style={{ color: 'var(--ink-3)' }}>
        Попыток пока нет. История покажет, как менялся результат от попытки к попытке.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {attempts.map((attempt) => (
        <li
          key={attempt.id}
          className="flex flex-wrap items-center gap-2 rounded-lg border px-2.5 py-2 text-sm"
          style={{ borderColor: 'var(--line)' }}
        >
          <span className="font-medium">Попытка #{attempt.attemptNo}</span>
          <span style={{ color: attempt.passed ? 'var(--ok)' : 'var(--bad)' }}>
            {attempt.passed ? '✓' : '✗'} {attempt.passedTests}/{attempt.totalTests} тестов
          </span>
          <span className="text-xs" style={{ color: 'var(--ink-3)' }}>
            {attempt.score} / {attempt.maxScore} баллов
          </span>
          <span className="text-xs" style={{ color: 'var(--ink-3)' }}>
            {new Date(attempt.createdAt).toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => onRestore(attempt.code)}>
            Вернуть этот код
          </Button>
        </li>
      ))}
    </ul>
  );
}
