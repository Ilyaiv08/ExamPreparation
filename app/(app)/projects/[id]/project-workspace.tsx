'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronDown, Lightbulb, Play, Save } from 'lucide-react';
import type { Hint, ProjectCheck, Runtime, TestCase } from '@/content/types';
import type { RunOutcome } from '@/lib/runner/types';
import { runCode } from '@/lib/runner/client';
import { CodeEditor, type EditorLanguage } from '@/components/editor/code-editor';
import { Badge, Card, ProgressBar, SectionTitle } from '@/components/ui/base';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { saveProject } from '@/lib/actions/project-actions';

const LANGUAGE_BY_RUNTIME: Record<Runtime, EditorLanguage> = {
  js: 'javascript',
  ts: 'typescript',
  dom: 'html',
  react: 'typescript',
  sql: 'sql',
};

/**
 * Рабочее место мини-проекта: чек-лист требований, автопроверяемая часть,
 * заметки и ссылка на репозиторий.
 */
export function ProjectWorkspace({
  projectId,
  checklist,
  savedChecklist,
  notes,
  repoUrl,
  autoCheck,
  savedCode,
  hints,
  status,
}: {
  projectId: string;
  checklist: ProjectCheck[];
  savedChecklist: Record<string, boolean>;
  notes: string;
  repoUrl: string;
  autoCheck?: { runtime: Runtime; starterCode: string; setupSql?: string; tests: TestCase[]; maxScore: number };
  savedCode: string;
  hints: Hint[];
  status: string;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>(savedChecklist);
  const [code, setCode] = useState(savedCode);
  const [notesValue, setNotesValue] = useState(notes);
  const [repo, setRepo] = useState(repoUrl);
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);
  const [running, setRunning] = useState(false);
  const [openHints, setOpenHints] = useState(0);
  const [pending, startTransition] = useTransition();
  const previewRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const router = useRouter();

  const checklistMax = checklist.reduce((sum, item) => sum + item.weight, 0);
  const checklistScore = checklist.reduce((sum, item) => sum + (checked[item.id] ? item.weight : 0), 0);

  const persist = (autoResults?: { id: string; passed: boolean }[]) => {
    startTransition(async () => {
      const result = await saveProject({
        projectId,
        checklist: checked,
        notes: notesValue,
        repoUrl: repo,
        code: autoCheck ? code : undefined,
        autoResults,
      });
      if (!result.ok) {
        toast.error('Не удалось сохранить', result.error);
        return;
      }
      toast.success(result.status === 'completed' ? 'Проект принят' : 'Сохранено');
      for (const achievement of result.unlocked ?? []) {
        toast.show({ tone: 'success', title: `${achievement.icon} ${achievement.title}`, description: 'Новое достижение' });
      }
      router.refresh();
    });
  };

  const runAutoCheck = async () => {
    if (!autoCheck) return;
    setRunning(true);
    setOutcome(null);
    if (previewRef.current) previewRef.current.innerHTML = '';

    const needsPreview = autoCheck.runtime === 'dom' || autoCheck.runtime === 'react';
    const result = await runCode(
      { runtime: autoCheck.runtime, code, tests: autoCheck.tests, setupSql: autoCheck.setupSql, mode: 'test' },
      needsPreview ? previewRef.current : null,
    );
    setOutcome(result);
    setRunning(false);

    if (!result.ok) {
      toast.error('Код не выполнился', result.failure?.message.slice(0, 120));
      return;
    }
    persist(result.results.map((item) => ({ id: item.id, passed: item.passed })));
  };

  return (
    <div className="flex flex-col gap-4">
      <section>
        <SectionTitle
          title="Чек-лист проверки"
          subtitle="Отмечайте выполненные требования — по ним считается готовность проекта"
          action={
            <Badge tone={checklistScore >= checklistMax ? 'ok' : 'neutral'}>
              {checklistScore} / {checklistMax}
            </Badge>
          }
        />
        <Card>
          <ProgressBar value={checklistScore} max={checklistMax} showValue size="sm" />
          <ul className="mt-3 flex flex-col gap-1.5">
            {checklist.map((item) => (
              <li key={item.id}>
                <label
                  className="flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors"
                  style={{
                    borderColor: checked[item.id] ? 'var(--ok)' : 'var(--line)',
                    background: checked[item.id] ? 'var(--ok-soft)' : 'transparent',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(checked[item.id])}
                    onChange={() => setChecked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                    className="mt-0.5"
                  />
                  <span className="min-w-0 flex-1">{item.text}</span>
                  <Badge tone={item.verification === 'auto' ? 'brand' : 'neutral'}>
                    {item.verification === 'auto' ? 'автотест' : 'вручную'}
                  </Badge>
                  <span className="shrink-0 text-xs" style={{ color: 'var(--ink-3)' }}>
                    {item.weight} б.
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {autoCheck ? (
        <section>
          <SectionTitle
            title="Автоматически проверяемая часть"
            subtitle={`Максимум ${autoCheck.maxScore} баллов · ${autoCheck.tests.length} тестов`}
          />
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <Button onClick={runAutoCheck} loading={running} icon={<Play size={15} />}>
                Проверить код
              </Button>
              {outcome?.results.length ? (
                <Badge tone={outcome.results.every((item) => item.passed) ? 'ok' : 'bad'}>
                  {outcome.results.filter((item) => item.passed).length} из {outcome.results.length} тестов
                </Badge>
              ) : null}
            </div>

            <CodeEditor
              value={code}
              onChange={setCode}
              language={LANGUAGE_BY_RUNTIME[autoCheck.runtime]}
              height={340}
              onRunShortcut={runAutoCheck}
              ariaLabel="Решение мини-проекта"
            />

            {autoCheck.runtime === 'dom' || autoCheck.runtime === 'react' ? (
              <Card className="!p-2">
                <div
                  ref={previewRef}
                  className="overflow-hidden rounded-lg border"
                  style={{ borderColor: 'var(--line)', height: 280, background: '#fff' }}
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
                        <span style={{ color: result.passed ? 'var(--ok)' : 'var(--bad)' }}>
                          {result.passed ? '✓' : '✗'}
                        </span>
                        <span className="min-w-0 flex-1">{result.name}</span>
                        {!result.passed && result.message ? (
                          <span className="truncate text-xs" style={{ color: 'var(--ink-3)' }}>
                            {result.message}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            ) : null}
          </div>
        </section>
      ) : null}

      {hints.length ? (
        <section>
          <SectionTitle title="Подсказки" />
          <div className="flex flex-col gap-2">
            {hints.map((hint) => (
              <div key={hint.level}>
                {openHints >= hint.level ? (
                  <Card>
                    <p className="mb-1 text-xs font-semibold" style={{ color: 'var(--warn)' }}>
                      Подсказка {hint.level}
                    </p>
                    <p className="text-sm">{hint.text}</p>
                  </Card>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setOpenHints(hint.level)}
                    icon={<ChevronDown size={14} />}
                    disabled={hint.level > 1 && openHints < hint.level - 1}
                  >
                    Открыть подсказку {hint.level}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <SectionTitle title="Сдача проекта" />
        <Card>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm">
              Ссылка на репозиторий (необязательно)
              <input
                type="text"
                value={repo}
                onChange={(event) => setRepo(event.target.value)}
                placeholder="например, путь к папке проекта или ссылка"
                className="min-h-10 rounded-lg border px-3 text-sm"
                style={{ background: 'var(--surface)', borderColor: 'var(--line)', color: 'var(--ink)' }}
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Заметки: что получилось, где застряли
              <textarea
                value={notesValue}
                onChange={(event) => setNotesValue(event.target.value)}
                rows={4}
                className="resize-y rounded-lg border px-3 py-2 text-sm"
                style={{ background: 'var(--surface)', borderColor: 'var(--line)', color: 'var(--ink)' }}
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => persist()} loading={pending} icon={<Save size={15} />}>
                Сохранить
              </Button>
              {status === 'completed' ? (
                <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--ok)' }}>
                  <Check size={15} /> Проект засчитан
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--ink-3)' }}>
                  <Lightbulb size={13} /> Проект засчитывается при 90% чек-листа и пройденных автотестах
                </span>
              )}
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
