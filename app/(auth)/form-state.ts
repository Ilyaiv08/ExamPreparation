/**
 * Состояние форм входа и регистрации.
 * Вынесено из actions.ts: файл с директивой 'use server' может экспортировать
 * только асинхронные функции, поэтому константы живут отдельно.
 */
export interface AuthFormState {
  errors: Record<string, string>;
  message?: string;
}

export const emptyAuthState: AuthFormState = { errors: {} };
