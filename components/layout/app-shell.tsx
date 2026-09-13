'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import {
  BookOpen,
  CalendarDays,
  Code2,
  GraduationCap,
  Keyboard,
  LayoutDashboard,
  LogOut,
  Menu,
  Monitor,
  Moon,
  Repeat2,
  Search,
  Settings,
  Shield,
  Sun,
  Trophy,
  TrendingUp,
  X,
  Minus,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from './theme';
import { Modal } from '@/components/ui/modal';

export interface ShellUser {
  id: string;
  login: string;
  fullName: string;
  role: 'student' | 'admin';
}

const NAV = [
  { href: '/', label: 'Дашборд', icon: LayoutDashboard, exact: true },
  { href: '/plan', label: 'Учебный план', icon: CalendarDays },
  { href: '/theory', label: 'Теория', icon: BookOpen },
  { href: '/tasks', label: 'Задания', icon: Code2 },
  { href: '/projects', label: 'Мини-проекты', icon: GraduationCap },
  { href: '/exams', label: 'Экзамены', icon: Shield },
  { href: '/review', label: 'Повторение', icon: Repeat2 },
  { href: '/progress', label: 'Прогресс', icon: TrendingUp },
  { href: '/achievements', label: 'Достижения', icon: Trophy },
];

const SHORTCUTS = [
  { keys: 'Ctrl + K', action: 'Глобальный поиск' },
  { keys: 'G затем D', action: 'Дашборд' },
  { keys: 'G затем P', action: 'Учебный план' },
  { keys: 'G затем T', action: 'Задания' },
  { keys: 'G затем E', action: 'Экзамены' },
  { keys: 'G затем R', action: 'Повторение' },
  { keys: 'Ctrl + Enter', action: 'Запустить тесты (на странице задания)' },
  { keys: 'Ctrl + S', action: 'Сохранить черновик кода' },
  { keys: '?', action: 'Показать этот список' },
];

export function AppShell({ user, children }: { user: ShellUser; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // Смена адреса закрывает выдвижное меню. Правка состояния во время
  // отрисовки, а не в эффекте: так React не делает лишний проход
  // с открытым меню на новой странице.
  const [drawerPath, setDrawerPath] = useState(pathname);
  if (drawerPath !== pathname) {
    setDrawerPath(pathname);
    setDrawerOpen(false);
  }

  // Горячие клавиши (раздел 27 ТЗ).
  useEffect(() => {
    let awaitingGoto = false;
    let gotoTimer: ReturnType<typeof setTimeout> | undefined;

    const isTyping = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      if (!el) return false;
      const tag = el.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        router.push('/search');
        return;
      }
      if (isTyping(event.target)) return;
      if (event.key === '?') {
        event.preventDefault();
        setShortcutsOpen(true);
        return;
      }
      if (event.key.toLowerCase() === 'g' && !event.ctrlKey && !event.metaKey) {
        awaitingGoto = true;
        clearTimeout(gotoTimer);
        gotoTimer = setTimeout(() => {
          awaitingGoto = false;
        }, 1200);
        return;
      }
      if (!awaitingGoto) return;
      awaitingGoto = false;
      const map: Record<string, string> = {
        d: '/',
        p: '/plan',
        t: '/tasks',
        e: '/exams',
        r: '/review',
        s: '/search',
        a: '/achievements',
        h: '/theory',
      };
      const target = map[event.key.toLowerCase()];
      if (target) {
        event.preventDefault();
        router.push(target);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      clearTimeout(gotoTimer);
    };
  }, [router]);

  const nav = user.role === 'admin' ? [...NAV, { href: '/admin', label: 'Админка', icon: Settings }] : NAV;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-[var(--surface)] focus:px-3 focus:py-2 focus:shadow"
      >
        Перейти к содержимому
      </a>

      {/* Боковое меню: на мобильных превращается в drawer (раздел 36 ТЗ) */}
      {/*
        На широком экране меню липкое и ровно в высоту окна: `lg:static` делал
        его обычной колонкой сетки, растянутой на всю страницу, и карточка
        пользователя оказывалась у самого низа документа — до неё приходилось
        прокручивать весь план. Теперь колонка стоит на месте при прокрутке,
        а длинный список пунктов скроллится внутри себя.
      */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col border-r transition-transform duration-200',
          'lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          drawerOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
        aria-label="Основная навигация"
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4" style={{ borderColor: 'var(--line)' }}>
          <Link href="/" className="flex min-h-[32px] items-center gap-2 font-semibold">
            <span
              className="grid h-7 w-7 place-items-center rounded-lg text-xs font-bold text-white"
              style={{ background: 'var(--brand)' }}
              aria-hidden="true"
            >
              ДЭ
            </span>
            <span className="text-sm leading-tight">
              Подготовка
              <span className="block text-[11px] font-normal" style={{ color: 'var(--ink-3)' }}>
                09.02.07
              </span>
            </span>
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 lg:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-label="Закрыть меню"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto p-2">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                  active ? 'font-medium' : 'hover:bg-[var(--surface-3)]',
                )}
                style={active ? { background: 'var(--brand-soft)', color: 'var(--brand-ink)' } : { color: 'var(--ink-2)' }}
              >
                <Icon size={17} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t p-2" style={{ borderColor: 'var(--line)' }}>
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
            <span
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold"
              style={{ background: 'var(--surface-3)' }}
              aria-hidden="true"
            >
              {user.fullName.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{user.fullName}</p>
              <p className="truncate text-[11px]" style={{ color: 'var(--ink-3)' }}>
                {user.role === 'admin' ? 'Администратор' : user.login}
              </p>
            </div>
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="grid h-9 w-9 place-items-center rounded-lg transition-colors hover:bg-[var(--surface-3)]"
                aria-label="Выйти"
                title="Выйти"
              >
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {drawerOpen ? (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgb(15 23 42 / 0.45)' }}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <div className="flex min-w-0 flex-col">
        <header
          // Полупрозрачная шапка с размытием: содержимое под ней видно,
          // но текст не сливается. Запасной цвет — на случай, если браузер
          // не умеет backdrop-filter.
          className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b px-3 backdrop-blur-md sm:px-4"
          style={{ background: 'var(--surface-blur, var(--surface))', borderColor: 'var(--line)' }}
        >
          <button
            type="button"
            className="rounded-lg p-2 lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Открыть меню"
          >
            <Menu size={18} />
          </button>

          <Link
            href="/search"
            // min-w-0 обязателен: без него flex-элемент не сжимается уже своего
            // содержимого, и на 390 px правая группа кнопок уезжает за край.
            className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border px-3 text-sm transition-colors hover:bg-[var(--surface-3)] sm:max-w-md"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-3)' }}
          >
            <Search size={15} />
            <span className="truncate">Поиск по теории, задачам, проектам…</span>
            <kbd
              className="ml-auto hidden rounded border px-1.5 py-0.5 text-[10px] sm:block"
              style={{ borderColor: 'var(--line)' }}
            >
              Ctrl K
            </kbd>
          </Link>

          <div className="flex shrink-0 items-center gap-1">
            <FontScaleControl />
            <ThemeToggle />
            <button
              type="button"
              className="rounded-lg p-2 transition-colors hover:bg-[var(--surface-3)]"
              onClick={() => setShortcutsOpen(true)}
              aria-label="Горячие клавиши"
              title="Горячие клавиши (?)"
            >
              <Keyboard size={17} />
            </button>
          </div>
        </header>

        <main id="main" className="min-w-0 flex-1 p-3 sm:p-5">
          {children}
        </main>
      </div>

      <Modal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} title="Горячие клавиши">
        <ul className="flex flex-col gap-1.5 text-sm">
          {SHORTCUTS.map((item) => (
            <li key={item.keys} className="flex items-center justify-between gap-4">
              <span style={{ color: 'var(--ink-2)' }}>{item.action}</span>
              <kbd
                className="rounded border px-2 py-0.5 text-xs"
                style={{ borderColor: 'var(--line)', background: 'var(--surface-3)' }}
              >
                {item.keys}
              </kbd>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next: Record<string, 'light' | 'dark' | 'system'> = { system: 'light', light: 'dark', dark: 'system' };
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const label = theme === 'light' ? 'Светлая тема' : theme === 'dark' ? 'Тёмная тема' : 'Тема как в системе';
  return (
    <button
      type="button"
      className="rounded-lg p-2 transition-colors hover:bg-[var(--surface-3)]"
      onClick={() => setTheme(next[theme])}
      aria-label={`${label}. Переключить`}
      title={label}
    >
      <Icon size={17} />
    </button>
  );
}

function FontScaleControl() {
  const { fontScale, setFontScale } = useTheme();
  return (
    <div
      className="hidden items-center rounded-lg border sm:flex"
      style={{ borderColor: 'var(--line)' }}
      role="group"
      aria-label="Размер шрифта"
    >
      <button
        type="button"
        className="rounded-l-lg p-1.5 transition-colors hover:bg-[var(--surface-3)]"
        onClick={() => setFontScale(fontScale - 5)}
        aria-label="Уменьшить шрифт"
        disabled={fontScale <= 85}
      >
        <Minus size={14} />
      </button>
      <span className="min-w-9 text-center text-[11px] tabular-nums" style={{ color: 'var(--ink-3)' }}>
        {fontScale}%
      </span>
      <button
        type="button"
        className="rounded-r-lg p-1.5 transition-colors hover:bg-[var(--surface-3)]"
        onClick={() => setFontScale(fontScale + 5)}
        aria-label="Увеличить шрифт"
        disabled={fontScale >= 130}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="mb-3">
      <ol className="flex flex-wrap items-center gap-1 text-xs" style={{ color: 'var(--ink-3)' }}>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" style={{ color: 'var(--ink-2)' }}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
