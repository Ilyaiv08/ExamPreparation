'use client';

import type { RunJob, RunOutcome, TestResult, ConsoleLine } from './types';
import { CompileError, loadHarnessSource, loadReactBundle, loadSqlJs, transpile } from './assets';

/**
 * Клиент песочницы: создаёт изолированный iframe, отдаёт ему задание
 * и забирает результат.
 *
 * Изоляция (раздел 8 ТЗ):
 *  - `sandbox="allow-scripts"` без `allow-same-origin` — уникальный opaque-origin,
 *    то есть нет доступа к cookie, localStorage и DOM приложения;
 *  - песочница не загружает НИЧЕГО из сети: код самой песочницы и нужные
 *    библиотеки встраиваются в документ или передаются через postMessage;
 *  - ограничение по времени и «безопасное завершение» — здесь: iframe удаляется.
 */

const DEFAULT_TIME_LIMIT = 5000;
/** React и SQLite инициализируются дольше — им нужен запас. */
const HEAVY_RUNTIME_LIMIT = 15000;

let counter = 0;

/** `</script>` внутри встраиваемого кода закрыл бы тег раньше времени. */
function escapeForScript(source: string): string {
  return source.replace(/<\/script/gi, '<\\/script');
}

function buildSrcDoc(job: RunJob, harness: string): string {
  const harnessTag = `<script>${escapeForScript(harness)}</script>`;
  const isDom = job.runtime === 'dom';

  // Если студент написал ЦЕЛЫЙ документ (с doctype или <html>), песочница
  // использует его как есть. Иначе тесты не смогли бы проверить <head>,
  // meta viewport и атрибут lang — а это прямые требования модуля 2 экзамена.
  if (isDom && /<!doctype|<html[\s>]/i.test(job.code)) {
    const html = `${job.domTemplate ?? ''}${job.code}`;
    // Замена через функцию: в строке-замене `$$`, `$&` и подобные имеют
    // особый смысл и испортили бы код песочницы.
    if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, () => `${harnessTag}</body>`);
    if (/<\/html>/i.test(html)) return html.replace(/<\/html>/i, () => `${harnessTag}</html>`);
    return `${html}\n${harnessTag}`;
  }

  // Иначе код вставляется в документ песочницы как фрагмент —
  // его <script> при этом всё равно по-настоящему выполняется.
  const body = isDom ? `${job.domTemplate ?? ''}\n${job.code}` : '';
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>sandbox</title>
</head>
<body>
${body}
${harnessTag}
</body>
</html>`;
}

export interface RunHandle {
  promise: Promise<RunOutcome>;
  /** Досрочно остановить выполнение (кнопка «Остановить»). */
  cancel: () => void;
}

interface SandboxAssets {
  react?: string;
  sqlLoader?: string;
  sqlWasm?: ArrayBuffer;
}

/** Готовит всё, что понадобится песочнице, до её создания. */
async function prepare(job: RunJob): Promise<{ harness: string; code: string; assets: SandboxAssets }> {
  const harness = await loadHarnessSource();
  const assets: SandboxAssets = {};
  let code = job.code;

  if (job.runtime === 'ts') {
    code = await transpile(job.code, false);
  } else if (job.runtime === 'react') {
    code = await transpile(job.code, true);
    assets.react = await loadReactBundle();
  } else if (job.runtime === 'sql') {
    const sql = await loadSqlJs();
    assets.sqlLoader = sql.loader;
    assets.sqlWasm = sql.wasm;
  }

  return { harness, code, assets };
}

export function runInSandbox(job: RunJob, container?: HTMLElement | null): RunHandle {
  const jobId = `job-${++counter}-${Date.now()}`;
  const timeLimit =
    job.timeLimitMs ??
    (job.runtime === 'react' || job.runtime === 'sql' || job.runtime === 'ts' ? HEAVY_RUNTIME_LIMIT : DEFAULT_TIME_LIMIT);

  let settled = false;
  let frame: HTMLIFrameElement | null = null;
  let resolveOutcome!: (value: RunOutcome) => void;

  const promise = new Promise<RunOutcome>((resolve) => {
    resolveOutcome = resolve;
  });

  const onMessage = (event: MessageEvent) => {
    if (!frame || event.source !== frame.contentWindow) return;
    const data = event.data as
      | { type: 'ready' }
      | {
          type: 'result';
          jobId: string;
          results: TestResult[];
          logs: ConsoleLine[];
          notes?: string[];
          durationMs: number;
        }
      | { type: 'failure'; jobId: string; message: string; stack?: string; logs: ConsoleLine[]; durationMs: number };
    if (!data || typeof data !== 'object') return;

    if (data.type === 'result' && data.jobId === jobId) {
      finish({
        ok: true,
        results: data.results ?? [],
        logs: data.logs ?? [],
        notes: data.notes ?? [],
        durationMs: data.durationMs ?? 0,
      });
      return;
    }

    if (data.type === 'failure' && data.jobId === jobId) {
      finish({
        ok: false,
        results: [],
        logs: data.logs ?? [],
        notes: [],
        durationMs: data.durationMs ?? 0,
        failure: {
          message: data.message,
          stack: data.stack,
          kind: /синтаксис|SyntaxError|Unexpected/i.test(data.message) ? 'compile' : 'runtime',
        },
      });
    }
  };

  const cleanup = (removeFrame: boolean) => {
    if (timer) clearTimeout(timer);
    window.removeEventListener('message', onMessage);
    // Уничтожение iframe гарантированно останавливает скрипты и таймеры внутри.
    if (removeFrame && frame?.parentNode) frame.parentNode.removeChild(frame);
  };

  function finish(outcome: RunOutcome) {
    if (settled) return;
    settled = true;
    // Для DOM- и React-заданий iframe остаётся на экране: это предпросмотр результата.
    cleanup(!container);
    resolveOutcome(outcome);
  }

  window.addEventListener('message', onMessage);

  // Объявлен здесь, а не выше: значение присваивается ровно один раз.
  // cleanup читает его из замыкания и вызывается только после этой строки.
  const timer = setTimeout(() => {
    if (settled) return;
    settled = true;
    cleanup(true);
    resolveOutcome({
      ok: false,
      results: [],
      logs: [],
      notes: [],
      durationMs: timeLimit,
      failure: {
        kind: 'timeout',
        message: `Выполнение прервано: код работал дольше ${Math.round(
          timeLimit / 1000,
        )} с. Частая причина — бесконечный цикл или забытое условие выхода.`,
      },
    });
  }, timeLimit);

  prepare(job)
    .then(({ harness, code, assets }) => {
      if (settled) return;

      frame = document.createElement('iframe');
      // Ключевая строка безопасности: allow-scripts без allow-same-origin.
      frame.setAttribute('sandbox', 'allow-scripts');
      frame.setAttribute('title', 'Песочница выполнения кода');

      if (container) {
        frame.style.width = job.viewport ? `${job.viewport.width}px` : '100%';
        frame.style.height = job.viewport ? `${job.viewport.height}px` : '100%';
        frame.style.maxWidth = '100%';
        frame.style.border = '0';
        frame.style.margin = job.viewport ? '0 auto' : '0';
        frame.style.display = 'block';
        frame.style.background = '#fff';
        container.appendChild(frame);
      } else {
        frame.style.position = 'absolute';
        frame.style.left = '-10000px';
        frame.style.top = '0';
        frame.style.width = job.viewport ? `${job.viewport.width}px` : '1024px';
        frame.style.height = job.viewport ? `${job.viewport.height}px` : '768px';
        frame.style.visibility = 'hidden';
        frame.setAttribute('aria-hidden', 'true');
        document.body.appendChild(frame);
      }

      // Задание кладётся в документ песочницы вместе с её кодом: так внутри
      // не нужен ни один сетевой запрос.
      const payload = {
        jobId,
        runtime: job.runtime,
        code,
        // Исходный текст до транспиляции: тесты TS-заданий проверяют по нему
        // наличие аннотаций типов, которых в скомпилированном коде уже нет.
        source: job.code,
        tests: job.tests ?? [],
        setupSql: job.setupSql,
        mode: job.mode ?? 'test',
        assets,
      };

      frame.addEventListener('load', () => {
        frame?.contentWindow?.postMessage({ type: 'job', job: payload }, '*', assets.sqlWasm ? [] : undefined);
      });

      frame.srcdoc = buildSrcDoc(job, harness);
    })
    .catch((error: unknown) => {
      if (settled) return;
      settled = true;
      cleanup(true);
      const message = error instanceof Error ? error.message : String(error);
      resolveOutcome({
        ok: false,
        results: [],
        logs: [],
        notes: [],
        durationMs: 0,
        failure: { kind: error instanceof CompileError ? 'compile' : 'sandbox', message },
      });
    });

  return {
    promise,
    cancel: () => {
      if (settled) return;
      settled = true;
      cleanup(true);
      resolveOutcome({
        ok: false,
        results: [],
        logs: [],
        notes: [],
        durationMs: 0,
        failure: { kind: 'runtime', message: 'Выполнение остановлено.' },
      });
    },
  };
}

/** Удобная обёртка: запустить и дождаться результата. */
export function runCode(job: RunJob, container?: HTMLElement | null): Promise<RunOutcome> {
  return runInSandbox(job, container).promise;
}
