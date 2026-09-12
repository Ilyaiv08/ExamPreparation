'use client';

/**
 * Ресурсы песочницы.
 *
 * Почему так: iframe с `sandbox="allow-scripts"` живёт в opaque-origin,
 * и загрузка подресурсов (`<script src>`, `fetch`) из него ненадёжна —
 * часть браузеров и встроенных webview блокирует их полностью.
 *
 * Поэтому всё, что нужно песочнице, загружает РОДИТЕЛЬСКАЯ страница
 * (обычный same-origin запрос) и передаёт внутрь через postMessage.
 * Побочный плюс: песочница действительно ничего не грузит из сети —
 * требование «ограничение сетевого доступа» выполняется буквально.
 *
 * Все файлы лежат локально в /vendor (кладёт `npm run assets`),
 * поэтому платформа работает без интернета.
 */

type TypeScriptModule = {
  transpileModule: (
    input: string,
    options: Record<string, unknown>,
  ) => { outputText: string; diagnostics?: { category: number; code: number; messageText: unknown }[] };
  ScriptTarget: Record<string, number>;
  ModuleKind: Record<string, number>;
  JsxEmit: Record<string, number>;
};

const cache = new Map<string, Promise<unknown>>();

function once<T>(key: string, factory: () => Promise<T>): Promise<T> {
  if (!cache.has(key)) cache.set(key, factory());
  return cache.get(key) as Promise<T>;
}

async function fetchText(url: string, what: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Не удалось загрузить ${what} (${url}). Выполните: npm run assets`);
  }
  return response.text();
}

/**
 * Код самой песочницы — встраивается прямо в документ iframe.
 *
 * Слой совместимости MySQL → SQLite лежит отдельным файлом: его же напрямую
 * проверяют модульные тесты, поэтому он не может быть частью замыкания
 * harness.js. Здесь два файла просто склеиваются в нужном порядке.
 */
export function loadHarnessSource(): Promise<string> {
  return once('harness', async () => {
    const [adapter, harness] = await Promise.all([
      fetchText('/runner/sql-adapt.js', 'слой совместимости MySQL → SQLite'),
      fetchText('/runner/harness.js', 'песочницу'),
    ]);
    return `${adapter}\n${harness}`;
  });
}

/** Сборка React для проверки компонентов. */
export function loadReactBundle(): Promise<string> {
  return once('react', () => fetchText('/vendor/react/react-bundle.js', 'сборку React для песочницы'));
}

/** Загрузчик sql.js и сам wasm-модуль SQLite. */
export function loadSqlJs(): Promise<{ loader: string; wasm: ArrayBuffer }> {
  return once('sqljs', async () => {
    const [loader, wasmResponse] = await Promise.all([
      fetchText('/vendor/sqljs/sql-wasm.js', 'загрузчик sql.js'),
      fetch('/vendor/sqljs/sql-wasm.wasm'),
    ]);
    if (!wasmResponse.ok) throw new Error('Не удалось загрузить SQLite (wasm). Выполните: npm run assets');
    return { loader, wasm: await wasmResponse.arrayBuffer() };
  });
}

/**
 * Компилятор TypeScript.
 *
 * Транспиляция выполняется в родительской странице, а не в песочнице:
 * это только разбор текста, код при этом не исполняется, зато внутрь
 * песочницы уходит готовый JavaScript — и ей не нужен девятимегабайтный компилятор.
 */
function loadTypeScript(): Promise<TypeScriptModule> {
  return once('typescript', async () => {
    const source = await fetchText('/vendor/typescript/typescript.js', 'компилятор TypeScript');
    // typescript.js — CommonJS-сборка: она кладёт себя в module.exports.
    // Подставляем свой объект вместо module, чтобы не трогать глобальную область.
    const shim: { exports: Record<string, unknown> } = { exports: {} };
    new Function('module', 'exports', source)(shim, shim.exports);
    const compiler = shim.exports as unknown as TypeScriptModule;
    if (!compiler || typeof compiler.transpileModule !== 'function') {
      throw new Error('Компилятор TypeScript не инициализировался');
    }
    return compiler;
  });
}

export class CompileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CompileError';
  }
}

/** TS/TSX → JavaScript. Ошибки синтаксиса поднимаются как CompileError. */
export async function transpile(code: string, jsx: boolean): Promise<string> {
  const ts = await loadTypeScript();
  const output = ts.transpileModule(code, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.None,
      jsx: jsx ? ts.JsxEmit.React : undefined,
      jsxFactory: jsx ? 'React.createElement' : undefined,
      jsxFragmentFactory: jsx ? 'React.Fragment' : undefined,
    },
    reportDiagnostics: true,
  });

  // Синтаксические ошибки (коды 1xxx) — это реальная проблема в коде студента.
  const syntax = (output.diagnostics ?? []).filter((item) => item.code >= 1000 && item.code < 2000);
  if (syntax.length) {
    const first = syntax[0];
    const text =
      typeof first.messageText === 'string'
        ? first.messageText
        : ((first.messageText as { messageText?: string })?.messageText ?? 'ошибка разбора');
    throw new CompileError(`Ошибка синтаксиса: ${text}`);
  }

  return output.outputText;
}
