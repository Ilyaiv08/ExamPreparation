'use client';

import { useCallback, useRef, useState } from 'react';
import { Play, X } from 'lucide-react';
import type { Runtime, TestCase } from '@/content/types';
import type { RunOutcome } from '@/lib/runner/types';
import { runInSandbox } from '@/lib/runner/client';
import { CodeEditor, type EditorLanguage } from '@/components/editor/code-editor';
import { Badge, Card } from '@/components/ui/base';
import { Button } from '@/components/ui/button';
import { Markdown } from '@/lib/markdown';
import { useToast } from '@/components/ui/toast';
import { formatMs } from '@/lib/utils';

const LANGUAGE_BY_RUNTIME: Record<Runtime, EditorLanguage> = {
  js: 'javascript',
  ts: 'typescript',
  dom: 'html',
  react: 'typescript',
  sql: 'sql',
};

/**
 * Задание с кодом внутри экзамена.
 * Отличия от обычного режима: нет подсказок, нет разбора решения,
 * результат сразу уходит в попытку экзамена.
 */
export function ExamCodeTask({
  examTaskId,
  title,
  points,
  task,
  savedAnswerJson,
  onAnswer,
  disabled,
}: {
  examTaskId: string;
  title: string;
  points: number;
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
  savedAnswerJson?: string;
  onAnswer: (examTaskId: string, kind: 'code' | 'quiz' | 'checklist', answer: unknown) => Promise<void>;
  disabled: boolean;
}) {
  const [code, setCode] = useState(() => {
    try {
      const parsed = savedAnswerJson ? JSON.parse(savedAnswerJson) : null;
      if (parsed && typeof parsed === 'object' && typeof parsed.code === 'string') return parsed.code;
    } catch {
      // Повреждённый черновик не должен мешать работать.
    }
    return task.starterCode;
  });
  const [running, setRunning] = useState(false);
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<(() => void) | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const toast = useToast();

  const needsPreview = task.runtime === 'dom' || task.runtime === 'react';

  // Автосохранение кода: на экзамене потерять написанное недопустимо.
  const scheduleSave = useCallback(
    (nextCode: string) => {
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void onAnswer(examTaskId, 'code', { code: nextCode, results: outcome?.results ?? [] });
      }, 1500);
    },
    [examTaskId, onAnswer, outcome],
  );

  const run = async () => {
    if (running || disabled) return;
    setRunning(true);
    setOutcome(null);
    if (previewRef.current) previewRef.current.innerHTML = '';

    const handle = runInSandbox(
      {
        runtime: task.runtime,
        code,
        tests: task.tests,
        setupSql: task.setupSql,
        viewport: task.viewport,
        timeLimitMs: task.timeLimitMs,
        mode: 'test',
      },
      needsPreview ? previewRef.current : null,
    );
    cancelRef.current = handle.cancel;

    const result = await handle.promise;
    cancelRef.current = null;
    setOutcome(result);
    setRunning(false);

    if (!result.ok) {
      toast.error('Код не выполнился', result.failure?.message.slice(0, 120));
      await onAnswer(examTaskId, 'code', { code, results: [] });
      return;
    }

    await onAnswer(examTaskId, 'code', {
      code,
      results: result.results.map((item) => ({ id: item.id, passed: item.passed })),
    });

    const passed = result.results.filter((item) => item.passed).length;
    toast.info(`Пройдено тестов: ${passed} из ${result.results.length}`, 'Результат записан в экзамен');
  };

  const passedCount = outcome?.results.filter((item) => item.passed).length ?? 0;

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium">{title}</p>
          <Badge tone="neutral">{points} баллов</Badge>
        </div>
        <Markdown source={task.statement} />
        {task.requirements.length ? (
          <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm" style={{ color: 'var(--ink-2)' }}>
            {task.requirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        ) : null}
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={run} loading={running} disabled={disabled} icon={<Play size={15} />}>
          Проверить
        </Button>
        {running ? (
          <Button variant="secondary" onClick={() => cancelRef.current?.()} icon={<X size={15} />}>
            Остановить
          </Button>
        ) : null}
        {outcome?.results.length ? (
          <Badge tone={passedCount === outcome.results.length ? 'ok' : 'bad'}>
            {passedCount} из {outcome.results.length} тестов
          </Badge>
        ) : null}
        <span className="ml-auto text-xs" style={{ color: 'var(--ink-3)' }}>
          Код сохраняется автоматически
        </span>
      </div>

      <CodeEditor
        value={code}
        onChange={(next) => {
          setCode(next);
          scheduleSave(next);
        }}
        language={LANGUAGE_BY_RUNTIME[task.runtime]}
        height={360}
        readOnly={disabled}
        onRunShortcut={run}
        ariaLabel="Решение экзаменационного задания"
      />

      {needsPreview ? (
        <Card className="!p-2">
          <p className="mb-1 px-1 text-xs" style={{ color: 'var(--ink-3)' }}>
            Результат в изолированном окне
          </p>
          <div
            ref={previewRef}
            className="overflow-hidden rounded-lg border"
            style={{ borderColor: 'var(--line)', height: 300, background: '#fff' }}
          />
        </Card>
      ) : null}

      {outcome ? (
        <Card>
          {!outcome.ok && outcome.failure ? (
            <p className="text-sm" style={{ color: 'var(--bad)' }}>
              {outcome.failure.message}
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {outcome.results.map((result) => (
                <li key={result.id} className="flex items-center gap-2 text-sm">
                  <span style={{ color: result.passed ? 'var(--ok)' : 'var(--bad)' }}>{result.passed ? '✓' : '✗'}</span>
                  <span className="min-w-0 flex-1 truncate">{result.name}</span>
                  {!result.passed && result.message ? (
                    <span className="truncate text-xs" style={{ color: 'var(--ink-3)' }}>
                      {result.message}
                    </span>
                  ) : null}
                  <span className="shrink-0 text-xs" style={{ color: 'var(--ink-3)' }}>
                    {formatMs(result.durationMs)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      ) : null}
    </div>
  );
}
