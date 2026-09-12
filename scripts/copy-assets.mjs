// Готовит статические ассеты, которые обязаны работать без интернета:
//  - Monaco Editor (иначе @monaco-editor/react тянет его с CDN);
//  - sql.js WASM (движок SQLite для тренажёра SQL в браузере);
//  - typescript.js (транспиляция TS/TSX прямо в песочнице);
//  - сборка React для песочницы (проверка React-компонентов автотестами).
//
// Экзамен проходит без интернета, поэтому платформа тоже обязана работать офлайн.
import { cp, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = (p) => path.relative(root, p);

const copies = [
  {
    from: path.join(root, 'node_modules', 'monaco-editor', 'min', 'vs'),
    to: path.join(root, 'public', 'vendor', 'monaco', 'vs'),
    label: 'monaco-editor',
  },
  {
    from: path.join(root, 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm'),
    to: path.join(root, 'public', 'vendor', 'sqljs', 'sql-wasm.wasm'),
    label: 'sql.js wasm',
  },
  {
    from: path.join(root, 'node_modules', 'sql.js', 'dist', 'sql-wasm.js'),
    to: path.join(root, 'public', 'vendor', 'sqljs', 'sql-wasm.js'),
    label: 'sql.js loader',
  },
  {
    from: path.join(root, 'node_modules', 'typescript', 'lib', 'typescript.js'),
    to: path.join(root, 'public', 'vendor', 'typescript', 'typescript.js'),
    label: 'typescript (транспиляция в песочнице)',
  },
];

let failed = 0;

for (const job of copies) {
  if (!existsSync(job.from)) {
    console.warn(`[assets] пропущено: ${job.label} — нет ${rel(job.from)}`);
    failed++;
    continue;
  }
  await mkdir(path.dirname(job.to), { recursive: true });
  await cp(job.from, job.to, { recursive: true, force: true });
  console.log(`[assets] ok: ${job.label} -> ${rel(job.to)}`);
}

// Сборка React для песочницы: в React 19 больше нет готовых UMD-файлов,
// поэтому собираем маленький бандл сами.
try {
  const outfile = path.join(root, 'public', 'vendor', 'react', 'react-bundle.js');
  await mkdir(path.dirname(outfile), { recursive: true });
  await build({
    entryPoints: [path.join(root, 'scripts', 'sandbox-react-entry.js')],
    outfile,
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: ['es2020'],
    minify: true,
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'silent',
  });
  console.log(`[assets] ok: react-bundle -> ${rel(outfile)}`);
} catch (error) {
  console.warn(`[assets] не удалось собрать react-bundle: ${error.message}`);
  failed++;
}

if (failed) {
  console.warn(`[assets] проблем: ${failed}. Выполните npm install и повторите npm run assets.`);
}
