'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

/** Поле поиска: запрос попадает в адрес страницы, ссылку можно сохранить. */
export function SearchBox({ initialQuery }: { initialQuery: string }) {
  const [value, setValue] = useState(initialQuery);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    inputRef.current?.focus();
    return () => clearTimeout(timer.current);
  }, []);

  const onChange = (next: string) => {
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      router.replace(next.trim().length >= 2 ? `/search?q=${encodeURIComponent(next.trim())}` : '/search');
    }, 350);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        clearTimeout(timer.current);
        router.replace(value.trim().length >= 2 ? `/search?q=${encodeURIComponent(value.trim())}` : '/search');
      }}
      role="search"
    >
      <label className="flex items-center gap-2 rounded-xl border px-3 py-2" style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}>
        <Search size={16} style={{ color: 'var(--ink-3)' }} />
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Что ищем?"
          aria-label="Поисковый запрос"
          className="min-h-8 w-full bg-transparent text-sm outline-none"
          style={{ color: 'var(--ink)' }}
        />
      </label>
    </form>
  );
}
