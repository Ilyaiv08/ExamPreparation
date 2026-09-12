'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { saveNote } from '@/lib/actions/progress-actions';

/**
 * Личная заметка с автосохранением.
 * Сохраняется через 1,2 секунды после последнего нажатия клавиши,
 * чтобы не терять текст и не спамить запросами.
 */
export function NoteEditor({
  entityType,
  entityId,
  initialValue,
  placeholder,
  icon,
  rows = 5,
}: {
  entityType: string;
  entityId: string;
  initialValue: string;
  placeholder?: string;
  icon?: ReactNode;
  rows?: number;
}) {
  const [value, setValue] = useState(initialValue);
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastSaved = useRef(initialValue);

  useEffect(() => () => clearTimeout(timer.current), []);

  const schedule = (next: string) => {
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      if (next === lastSaved.current) return;
      setState('saving');
      try {
        await saveNote(entityType, entityId, next);
        lastSaved.current = next;
        setState('saved');
        setTimeout(() => setState('idle'), 1800);
      } catch {
        setState('idle');
      }
    }, 1200);
  };

  return (
    <div>
      <textarea
        value={value}
        onChange={(event) => schedule(event.target.value)}
        rows={rows}
        placeholder={placeholder}
        aria-label="Личная заметка"
        className="w-full resize-y rounded-lg border px-3 py-2 text-sm outline-none"
        style={{ background: 'var(--surface)', borderColor: 'var(--line)', color: 'var(--ink)' }}
      />
      <p className="mt-1 flex items-center gap-1.5 text-xs" style={{ color: 'var(--ink-3)' }}>
        {icon}
        {state === 'saving' ? (
          <>
            <Loader2 size={12} className="animate-spin" /> Сохраняем…
          </>
        ) : state === 'saved' ? (
          <>
            <Check size={12} style={{ color: 'var(--ok)' }} /> Сохранено
          </>
        ) : (
          'Заметка сохраняется автоматически'
        )}
      </p>
    </div>
  );
}
