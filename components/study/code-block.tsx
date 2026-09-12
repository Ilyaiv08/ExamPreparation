'use client';

import { useState } from 'react';
import { Check, Copy, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Блок кода с копированием и — для примеров разметки — предпросмотром.
 * Предпросмотр рендерится в iframe с sandbox="allow-scripts": страница примера
 * не имеет доступа к приложению (та же изоляция, что и в песочнице заданий).
 */
export function CodeBlock({
  code,
  language = 'text',
  runnable = false,
  compact = false,
  maxHeight,
}: {
  code: string;
  language?: string;
  runnable?: boolean;
  compact?: boolean;
  maxHeight?: number;
}) {
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Буфер обмена может быть недоступен — не ломаем страницу.
    }
  };

  const previewDoc = `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{font-family:system-ui,Arial,sans-serif;margin:12px;color:#111}</style></head><body>${code}</body></html>`;

  return (
    <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--line)' }}>
      <div
        className="flex items-center justify-between gap-2 border-b px-2.5 py-1.5"
        style={{ borderColor: 'var(--line)', background: 'var(--surface-2)' }}
      >
        <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: 'var(--ink-3)' }}>
          {language}
        </span>
        <div className="flex items-center gap-1">
          {runnable ? (
            <button
              type="button"
              onClick={() => setPreview((value) => !value)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] transition-colors hover:bg-[var(--surface-3)]"
              style={{ color: 'var(--ink-2)' }}
            >
              {preview ? <EyeOff size={12} /> : <Eye size={12} />}
              {preview ? 'Скрыть результат' : 'Показать результат'}
            </button>
          ) : null}
          <button
            type="button"
            onClick={copy}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] transition-colors hover:bg-[var(--surface-3)]"
            style={{ color: 'var(--ink-2)' }}
            aria-label="Скопировать код"
          >
            {copied ? <Check size={12} style={{ color: 'var(--ok)' }} /> : <Copy size={12} />}
            {copied ? 'Скопировано' : 'Копировать'}
          </button>
        </div>
      </div>

      <pre
        className={cn('overflow-x-auto', compact ? 'px-2.5 py-2' : 'px-3 py-2.5')}
        style={{ background: 'var(--surface-3)', maxHeight: maxHeight ? `${maxHeight}px` : undefined }}
      >
        <code
          className="block whitespace-pre"
          style={{ fontFamily: 'var(--font-mono)', fontSize: compact ? '0.78rem' : '0.82rem', lineHeight: 1.6 }}
        >
          {code}
        </code>
      </pre>

      {preview ? (
        <div className="border-t" style={{ borderColor: 'var(--line)' }}>
          <p className="px-2.5 py-1 text-[11px]" style={{ color: 'var(--ink-3)', background: 'var(--surface-2)' }}>
            Результат в изолированном окне
          </p>
          <iframe
            title="Предпросмотр примера"
            sandbox="allow-scripts"
            srcDoc={previewDoc}
            className="w-full"
            style={{ height: 240, border: 0, background: '#fff' }}
          />
        </div>
      ) : null}
    </div>
  );
}
