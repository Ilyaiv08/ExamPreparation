import { Compass } from 'lucide-react';
import { LinkButton } from '@/components/ui/button';

/** Страница 404 (раздел 33 ТЗ): объясняет, что случилось, и предлагает выход. */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <span
        className="grid h-12 w-12 place-items-center rounded-full"
        style={{ background: 'var(--surface-3)', color: 'var(--ink-3)' }}
        aria-hidden="true"
      >
        <Compass size={22} />
      </span>

      <div>
        <h1 className="text-lg font-semibold">Страница не найдена</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-2)' }}>
          Такого адреса на платформе нет. Возможно, тема или задание были переименованы.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <LinkButton href="/" variant="primary">
          На дашборд
        </LinkButton>
        <LinkButton href="/search">Поиск по материалам</LinkButton>
      </div>
    </main>
  );
}
