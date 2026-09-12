import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Базовые презентационные примитивы. Без состояния — работают как серверные компоненты. */

export function Card({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li';
}) {
  return <Tag className={cn('card p-4 sm:p-5', className)}>{children}</Tag>;
}

export function SectionTitle({
  title,
  subtitle,
  action,
  id,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 id={id} className="text-lg font-semibold tracking-tight">
          {title}
        </h2>
        {subtitle ? <p className="mt-0.5 text-sm" style={{ color: 'var(--ink-3)' }}>{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

type Tone = 'neutral' | 'brand' | 'ok' | 'warn' | 'bad';

const TONE_STYLE: Record<Tone, { bg: string; fg: string; border: string }> = {
  neutral: { bg: 'var(--surface-3)', fg: 'var(--ink-2)', border: 'var(--line)' },
  brand: { bg: 'var(--brand-soft)', fg: 'var(--brand-ink)', border: 'color-mix(in srgb, var(--brand) 30%, transparent)' },
  ok: { bg: 'var(--ok-soft)', fg: 'var(--ok)', border: 'color-mix(in srgb, var(--ok) 30%, transparent)' },
  warn: { bg: 'var(--warn-soft)', fg: 'var(--warn)', border: 'color-mix(in srgb, var(--warn) 30%, transparent)' },
  bad: { bg: 'var(--bad-soft)', fg: 'var(--bad)', border: 'color-mix(in srgb, var(--bad) 30%, transparent)' },
};

export function Badge({
  children,
  tone = 'neutral',
  className,
  title,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  title?: string;
}) {
  const style = TONE_STYLE[tone];
  return (
    <span
      title={title}
      className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium', className)}
      style={{ background: style.bg, color: style.fg, borderColor: style.border }}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  max = 100,
  tone = 'brand',
  label,
  showValue = false,
  size = 'md',
}: {
  value: number;
  max?: number;
  tone?: Tone;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md';
}) {
  const percent = max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0;
  const color =
    tone === 'ok' ? 'var(--ok)' : tone === 'warn' ? 'var(--warn)' : tone === 'bad' ? 'var(--bad)' : 'var(--brand)';
  return (
    <div>
      {(label || showValue) && (
        <div className="mb-1 flex items-center justify-between text-xs" style={{ color: 'var(--ink-3)' }}>
          {label ? <span>{label}</span> : <span />}
          {showValue ? <span className="tabular-nums font-medium">{percent}%</span> : null}
        </div>
      )}
      <div
        className={cn('w-full overflow-hidden rounded-full', size === 'sm' ? 'h-1.5' : 'h-2.5')}
        style={{ background: 'var(--surface-3)' }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Прогресс'}
      >
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${percent}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone = 'neutral',
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
}) {
  const color =
    tone === 'ok' ? 'var(--ok)' : tone === 'warn' ? 'var(--warn)' : tone === 'bad' ? 'var(--bad)' : 'var(--ink)';
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--ink-3)' }}>
          {label}
        </p>
        {icon ? <span style={{ color: 'var(--ink-3)' }}>{icon}</span> : null}
      </div>
      <p className="mt-1 text-2xl font-semibold tabular-nums" style={{ color }}>
        {value}
      </p>
      {hint ? (
        <p className="mt-0.5 text-xs" style={{ color: 'var(--ink-3)' }}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Alert({
  tone = 'neutral',
  title,
  children,
  icon,
  className,
}: {
  tone?: Tone;
  title?: ReactNode;
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  const style = TONE_STYLE[tone];
  return (
    <div
      className={cn('rounded-xl border p-3 text-sm', className)}
      style={{ background: style.bg, borderColor: style.border, color: 'var(--ink)' }}
      role={tone === 'bad' ? 'alert' : undefined}
    >
      <div className="flex gap-2">
        {icon ? <span style={{ color: style.fg }}>{icon}</span> : null}
        <div className="min-w-0 flex-1">
          {title ? (
            <p className="font-semibold" style={{ color: style.fg }}>
              {title}
            </p>
          ) : null}
          {children ? <div className={title ? 'mt-1' : ''}>{children}</div> : null}
        </div>
      </div>
    </div>
  );
}

/** Пустое состояние — требование раздела 33 ТЗ. */
export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center gap-2 px-6 py-10 text-center">
      {icon ? <div style={{ color: 'var(--ink-3)' }}>{icon}</div> : null}
      <p className="font-medium">{title}</p>
      {description ? (
        <p className="max-w-md text-sm" style={{ color: 'var(--ink-3)' }}>
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-lg', className)}
      style={{ background: 'var(--surface-3)' }}
      aria-hidden="true"
    />
  );
}

/** Показывает, откуда взята информация (раздел 46 ТЗ: разделять источники). */
export function SourceTag({ source }: { source: 'plan' | 'exam' | 'docs' | 'author' }) {
  const map = {
    plan: { label: 'Из учебной программы', tone: 'brand' as Tone },
    exam: { label: 'Из задания демоэкзамена', tone: 'bad' as Tone },
    docs: { label: 'Документация технологии', tone: 'neutral' as Tone },
    author: { label: 'Рекомендация платформы', tone: 'warn' as Tone },
  };
  const item = map[source];
  return (
    <Badge tone={item.tone} title="Источник информации">
      {item.label}
    </Badge>
  );
}

export function DifficultyStars({ level, showLabel = false }: { level: number; showLabel?: boolean }) {
  const labels = ['Beginner', 'Easy', 'Medium', 'Hard', 'Exam'];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs"
      title={`Сложность: ${labels[level - 1] ?? level}`}
      style={{ color: 'var(--ink-3)' }}
    >
      <span aria-hidden="true" style={{ color: level >= 4 ? 'var(--warn)' : 'var(--ink-3)' }}>
        {'★'.repeat(level)}
        <span style={{ opacity: 0.25 }}>{'★'.repeat(5 - level)}</span>
      </span>
      {showLabel ? <span>{labels[level - 1]}</span> : null}
      <span className="sr-only">Сложность {level} из 5</span>
    </span>
  );
}
