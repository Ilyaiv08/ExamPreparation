'use client';

import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'text-white border-transparent',
  secondary: 'border',
  ghost: 'border-transparent',
  danger: 'text-white border-transparent',
  success: 'text-white border-transparent',
};

const SIZES: Record<Size, string> = {
  // Минимальная высота 40–44px: удобно для касания на 390×844.
  sm: 'h-8 px-2.5 text-xs gap-1.5',
  md: 'h-10 px-3.5 text-sm gap-2',
  lg: 'h-11 px-5 text-base gap-2',
};

function variantStyle(variant: Variant): React.CSSProperties {
  switch (variant) {
    case 'primary':
      return { background: 'var(--brand)' };
    case 'danger':
      return { background: 'var(--bad)' };
    case 'success':
      return { background: 'var(--ok)' };
    case 'secondary':
      return { background: 'var(--surface)', borderColor: 'var(--line)', color: 'var(--ink)' };
    default:
      return { background: 'transparent', color: 'var(--ink-2)' };
  }
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
  full?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  icon,
  loading,
  full,
  disabled,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      style={{ ...variantStyle(variant), ...(rest.style ?? {}) }}
      className={cn(
        'inline-flex items-center justify-center rounded-lg border font-medium transition-[transform,opacity,background] duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55',
        VARIANTS[variant],
        SIZES[size],
        full && 'w-full',
        className,
      )}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = 'secondary',
  size = 'md',
  className,
  children,
  icon,
  full,
  prefetch,
  target,
  rel,
}: CommonProps & { href: string; prefetch?: boolean; target?: string; rel?: string }) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      target={target}
      rel={rel}
      style={variantStyle(variant)}
      className={cn(
        'inline-flex items-center justify-center rounded-lg border font-medium transition-[transform,opacity,background] duration-150 active:translate-y-px',
        VARIANTS[variant],
        SIZES[size],
        full && 'w-full',
        className,
      )}
    >
      {icon}
      {children}
    </Link>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn('inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent', className)}
      aria-hidden="true"
    />
  );
}
