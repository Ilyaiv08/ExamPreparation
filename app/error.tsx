'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button, LinkButton } from '@/components/ui/button';

/**
 * Граница ошибок приложения (раздел 33 ТЗ).
 *
 * Пользователю показывается понятное сообщение и кнопка «Повторить».
 * Технические подробности уходят в консоль разработчика: стек вызовов на
 * экране студента ничего не объясняет и только пугает.
 */
export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Подробности — для разработчика, а не для страницы.
    console.error('Ошибка страницы:', error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <span
        className="grid h-12 w-12 place-items-center rounded-full"
        style={{ background: 'var(--bad-soft)', color: 'var(--bad)' }}
        aria-hidden="true"
      >
        <AlertTriangle size={22} />
      </span>

      <div>
        <h1 className="text-lg font-semibold">Что-то пошло не так</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-2)' }}>
          Страницу не удалось загрузить. Обычно помогает повторная попытка — данные и прогресс при этом не теряются.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={reset} icon={<RotateCcw size={15} />}>
          Повторить
        </Button>
        <LinkButton href="/" variant="secondary">
          На дашборд
        </LinkButton>
      </div>

      {error.digest ? (
        <p className="text-xs" style={{ color: 'var(--ink-3)' }}>
          Код ошибки для поддержки: {error.digest}
        </p>
      ) : null}
    </main>
  );
}
