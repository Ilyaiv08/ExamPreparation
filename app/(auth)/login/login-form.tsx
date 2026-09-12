'use client';

import { useActionState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { loginAction } from '../actions';
import { emptyAuthState } from '../form-state';

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, emptyAuthState);

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

      <Field label="Логин" name="login" error={state.errors.login} autoComplete="username" required autoFocus />
      <Field
        label="Пароль"
        name="password"
        type="password"
        error={state.errors.password}
        autoComplete="current-password"
        required
      />

      <Button type="submit" loading={pending} full size="lg">
        Войти
      </Button>
    </form>
  );
}
