import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';
import { ThemeProvider, type ThemeMode } from '@/components/layout/theme';
import { getCurrentUser } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: {
    default: 'Подготовка к демоэкзамену 09.02.07',
    template: '%s — Подготовка к ДЭ 09.02.07',
  },
  description:
    'Интерактивная платформа подготовки к демонстрационному экзамену по специальности 09.02.07 «Разработчик веб и мультимедийных приложений».',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Тема и размер шрифта приходят из профиля и попадают сразу в разметку,
  // поэтому страница не мигает светлой темой перед гидратацией.
  let theme: ThemeMode = 'system';
  let fontScale = 100;
  try {
    const user = await getCurrentUser();
    if (user) {
      theme = (['system', 'light', 'dark'] as const).includes(user.theme as ThemeMode)
        ? (user.theme as ThemeMode)
        : 'system';
      fontScale = user.fontScale ?? 100;
    }
  } catch {
    // База может быть ещё не инициализирована — интерфейс всё равно должен открыться.
  }

  return (
    <html lang="ru" data-theme={theme} style={{ ['--font-scale' as string]: String(fontScale / 100) }}>
      <body>
        <ThemeProvider initialTheme={theme} initialFontScale={fontScale}>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
