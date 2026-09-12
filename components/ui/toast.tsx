'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, XCircle } from 'lucide-react';

type ToastTone = 'info' | 'success' | 'warning' | 'error';

interface ToastItem {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
  timeout: number;
}

interface ToastApi {
  show: (toast: { tone?: ToastTone; title: string; description?: string; timeout?: number }) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setItems((list) => list.filter((item) => item.id !== id));
  }, []);

  const show = useCallback<ToastApi['show']>((toast) => {
    const item: ToastItem = {
      id: nextId++,
      tone: toast.tone ?? 'info',
      title: toast.title,
      description: toast.description,
      timeout: toast.timeout ?? 4000,
    };
    setItems((list) => [...list.slice(-3), item]);
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (title, description) => show({ tone: 'success', title, description }),
      error: (title, description) => show({ tone: 'error', title, description, timeout: 6000 }),
      info: (title, description) => show({ tone: 'info', title, description }),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:items-end"
        aria-live="polite"
        aria-atomic="false"
      >
        {items.map((item) => (
          <ToastCard key={item.id} item={item} onClose={() => remove(item.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, item.timeout);
    return () => clearTimeout(timer);
  }, [item.timeout, onClose]);

  const tone = {
    info: { color: 'var(--brand)', bg: 'var(--brand-soft)', Icon: Info },
    success: { color: 'var(--ok)', bg: 'var(--ok-soft)', Icon: CheckCircle2 },
    warning: { color: 'var(--warn)', bg: 'var(--warn-soft)', Icon: AlertTriangle },
    error: { color: 'var(--bad)', bg: 'var(--bad-soft)', Icon: XCircle },
  }[item.tone];

  const Icon = tone.Icon;

  return (
    <div
      className="card pointer-events-auto flex w-full max-w-sm items-start gap-2.5 p-3"
      style={{ animation: 'toast-in .2s ease-out', borderColor: tone.color, background: 'var(--surface)' }}
      role={item.tone === 'error' ? 'alert' : 'status'}
    >
      <span className="mt-0.5 shrink-0 rounded-md p-1" style={{ background: tone.bg, color: tone.color }}>
        <Icon size={15} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{item.title}</p>
        {item.description ? (
          <p className="mt-0.5 text-xs" style={{ color: 'var(--ink-3)' }}>
            {item.description}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 rounded-md p-1 transition-colors hover:bg-[var(--surface-3)]"
        aria-label="Закрыть уведомление"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast должен использоваться внутри ToastProvider');
  }
  return context;
}
