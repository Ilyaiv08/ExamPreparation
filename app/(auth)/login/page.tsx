import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { readSession } from '@/lib/auth/session';
import { LoginForm } from './login-form';

export const metadata: Metadata = { title: 'Вход' };

export default async function LoginPage() {
  const session = await readSession();
  if (session) redirect('/');

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-6 text-center">
        <span
          className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-xl text-sm font-bold text-white"
          style={{ background: 'var(--brand)' }}
          aria-hidden="true"
        >
          ДЭ
        </span>
        <h1 className="text-xl font-semibold">Подготовка к демоэкзамену</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-3)' }}>
          09.02.07 «Разработчик веб и мультимедийных приложений»
        </p>
      </div>

      <div className="card p-5">
        <h2 className="mb-4 text-base font-semibold">Вход в систему</h2>
        <LoginForm />
        <p className="mt-4 text-center text-sm">
          <Link href="/register" className="underline" style={{ color: 'var(--brand)' }}>
            Еще не зарегистрированы? Регистрация
          </Link>
        </p>
      </div>

      <p className="mt-4 text-center text-xs" style={{ color: 'var(--ink-3)' }}>
        Текст ссылки выше дословно повторяет формулировку из задания демоэкзамена — это требование модуля 1.
      </p>
    </main>
  );
}
