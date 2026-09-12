'use client';

import { useActionState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { registerAction } from '../actions';
import { emptyAuthState } from '../form-state';

export function RegisterForm({ defaultStartDate }: { defaultStartDate: string }) {
  const [state, action, pending] = useActionState(registerAction, emptyAuthState);

  return (
    <form action={action} className="flex flex-col gap-3" noValidate>
      {state.errors.form ? (
        <p
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
          style={{ background: 'var(--bad-soft)', borderColor: 'var(--bad)', color: 'var(--bad)' }}
          role="alert"
        >
          <AlertCircle size={15} />
          {state.errors.form}
        </p>
      ) : null}

      <Field
        label="Логин"
        name="login"
        error={state.errors.login}
        hint="Латинские буквы и цифры, минимум 6 символов"
        autoComplete="username"
        required
        autoFocus
      />
      <Field
        label="Пароль"
        name="password"
        type="password"
        error={state.errors.password}
        hint="Минимум 8 символов"
        autoComplete="new-password"
        required
      />
      <Field label="ФИО" name="fullName" error={state.errors.fullName} autoComplete="name" required />
      <Field label="E-mail" name="email" type="email" error={state.errors.email} autoComplete="email" />
      <Field label="Телефон" name="phone" type="tel" error={state.errors.phone} autoComplete="tel" />

      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Начало подготовки"
          name="startDate"
          type="date"
          defaultValue={defaultStartDate}
          error={state.errors.startDate}
          hint="От неё считается «сегодняшний день» и календарь всех 30 недель"
        />
        <Field
          label="Дата демоэкзамена"
          name="examDate"
          type="date"
          error={state.errors.examDate}
          hint="Включит режим предэкзаменационной подготовки"
        />
      </div>

      <Button type="submit" loading={pending} full size="lg">
        Зарегистрироваться
      </Button>
    </form>
  );
}
