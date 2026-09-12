'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';

/** Фильтр в виде «чипсов»: значение хранится в адресе страницы, ссылку можно сохранить. */
export function FilterChips({
  label,
  param,
  options,
}: {
  label: string;
  param: string;
  options: { value: string; label: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get(param);

  const setValue = (value: string | null) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value === null || value === active) next.delete(param);
    else next.set(param, value);
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  if (!options.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs font-medium" style={{ color: 'var(--ink-3)' }}>
        {label}:
      </span>
      {options.map((option) => {
        const isActive = active === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setValue(option.value)}
            aria-pressed={isActive}
            className="chip transition-colors"
            style={
              isActive
                ? { background: 'var(--brand)', borderColor: 'var(--brand)', color: '#fff' }
                : undefined
            }
          >
            {option.label}
          </button>
        );
      })}
      {active ? (
        <button
          type="button"
          onClick={() => setValue(null)}
          className="chip"
          aria-label={`Сбросить фильтр «${label}»`}
        >
          <X size={11} /> сбросить
        </button>
      ) : null}
    </div>
  );
}
