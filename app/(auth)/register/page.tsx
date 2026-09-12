import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { readSession } from '@/lib/auth/session';
import { RegisterForm } from './register-form';
import { PLAN_META } from '@/content/curriculum';

export const metadata: Metadata = { title: 'Регистрация' };

export default async function RegisterPage() {
  const session = await readSession();
  if (session) redirect('/');

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold">Регистрация</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-3)' }}>
          Прогресс, решения и результаты экзаменов сохраняются в вашем профиле.
        </p>
      </div>

      <div className="card p-5">
        <RegisterForm defaultStartDate={PLAN_META.defaultStartDate} />
        <p className="mt-4 text-center text-sm">
          <Link href="/login" className="underline" style={{ color: 'var(--brand)' }}>
            Уже зарегистрированы? Вход
          </Link>
        </p>
      </div>

      <p className="mt-4 text-center text-xs" style={{ color: 'var(--ink-3)' }}>
        Правила логина и пароля здесь те же, что требует задание демоэкзамена: логин — только латиница и цифры, минимум
        6 символов; пароль — от 8 символов.
      </p>
    </main>
  );
}
