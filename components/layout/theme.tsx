'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeApi {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  fontScale: number;
  setFontScale: (scale: number) => void;
}

const ThemeContext = createContext<ThemeApi | null>(null);

/**
 * Тема и размер шрифта хранятся в профиле и подставляются сервером
 * в атрибуты <html data-theme="…" style="--font-scale: …">.
 * Поэтому при загрузке нет вспышки светлой темы и не нужен inline-скрипт:
 * клиент лишь меняет те же атрибуты и отправляет значение в профиль.
 */
export function ThemeProvider({
  children,
  initialTheme = 'system',
  initialFontScale = 100,
}: {
  children: ReactNode;
  initialTheme?: ThemeMode;
  initialFontScale?: number;
}) {
  const [theme, setThemeState] = useState<ThemeMode>(initialTheme);
  const [fontScale, setScaleState] = useState<number>(initialFontScale);

  const persist = useCallback((body: Record<string, unknown>) => {
    void fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => {
      // Настройки интерфейса не критичны: если сохранить не удалось,
      // текущая сессия всё равно работает.
    });
  }, []);

  const setTheme = useCallback(
    (mode: ThemeMode) => {
      setThemeState(mode);
      document.documentElement.dataset.theme = mode;
      persist({ theme: mode });
    },
    [persist],
  );

  const setFontScale = useCallback(
    (scale: number) => {
      const clamped = Math.min(130, Math.max(85, Math.round(scale)));
      setScaleState(clamped);
      document.documentElement.style.setProperty('--font-scale', String(clamped / 100));
      persist({ fontScale: clamped });
    },
    [persist],
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fontScale, setFontScale }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeApi {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme должен использоваться внутри ThemeProvider');
  return context;
}

const DARK_QUERY = '(prefers-color-scheme: dark)';

function subscribeToSystemTheme(onChange: () => void): () => void {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

/**
 * Системная тема — внешний источник состояния, поэтому читается через
 * useSyncExternalStore, а не через useState + useEffect: так нет лишней
 * перерисовки и рассинхронизации при серверной отрисовке.
 *
 * На сервере системная тема неизвестна — возвращаем false. Это безопасно:
 * реальная тема уже проставлена сервером в атрибут <html data-theme>.
 */
export function useSystemDark(): boolean {
  return useSyncExternalStore(
    subscribeToSystemTheme,
    () => window.matchMedia(DARK_QUERY).matches,
    () => false,
  );
}

/** Итоговая тема с учётом выбора пользователя и системной настройки. */
export function useResolvedDark(): boolean {
  const { theme } = useTheme();
  const systemDark = useSystemDark();
  return theme === 'dark' || (theme === 'system' && systemDark);
}
