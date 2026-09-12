'use client';

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const controlClass =
  'w-full rounded-lg border px-3 py-2 text-sm transition-[border-color,box-shadow] duration-150 outline-none';

function controlStyle(invalid?: boolean): React.CSSProperties {
  return {
    background: 'var(--surface)',
    borderColor: invalid ? 'var(--bad)' : 'var(--line)',
    color: 'var(--ink)',
  };
}

interface BaseProps {
  label: string;
  error?: string;
  hint?: ReactNode;
  className?: string;
}

/** Поле ввода с подписью и сообщением об ошибке рядом — как требует модуль 2 экзамена. */
export function Field({
  label,
  error,
  hint,
  className,
  ...rest
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {rest.required ? (
          <span style={{ color: 'var(--bad)' }} aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </label>
      <input
        {...rest}
        id={id}
        name={rest.name ?? label}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(error && errorId, hint && hintId) || undefined}
        className={cn(controlClass, 'min-h-10')}
        style={controlStyle(Boolean(error))}
      />
      {hint && !error ? (
        <p id={hintId} className="text-xs" style={{ color: 'var(--ink-3)' }}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs" style={{ color: 'var(--bad)' }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SelectField({
  label,
  error,
  hint,
  className,
  children,
  ...rest
}: BaseProps & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  const id = useId();
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <select
        {...rest}
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(controlClass, 'min-h-10')}
        style={controlStyle(Boolean(error))}
      >
        {children}
      </select>
      {hint && !error ? (
        <p className="text-xs" style={{ color: 'var(--ink-3)' }}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="text-xs" style={{ color: 'var(--bad)' }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextareaField({
  label,
  error,
  hint,
  className,
  ...rest
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <textarea
        {...rest}
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(controlClass, 'resize-y')}
        style={controlStyle(Boolean(error))}
      />
      {hint && !error ? (
        <p className="text-xs" style={{ color: 'var(--ink-3)' }}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="text-xs" style={{ color: 'var(--bad)' }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
