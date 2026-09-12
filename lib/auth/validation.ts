import { z } from 'zod';

/**
 * Правила регистрации намеренно взяты из задания демоэкзамена:
 * логин — латиница и цифры, минимум 6 символов; пароль — минимум 8.
 * Студент видит в самой платформе ровно те требования, которые
 * ему предстоит реализовать в своём проекте.
 */
export const LOGIN_PATTERN = /^[A-Za-z0-9]{6,}$/;

export const loginSchema = z.object({
  login: z.string().trim().min(1, 'Введите логин'),
  password: z.string().min(1, 'Введите пароль'),
});

export const registerSchema = z.object({
  login: z
    .string()
    .trim()
    .min(6, 'Логин не короче 6 символов')
    .regex(LOGIN_PATTERN, 'Только латинские буквы и цифры, минимум 6 символов'),
  password: z.string().min(8, 'Пароль не короче 8 символов'),
  fullName: z.string().trim().min(3, 'Укажите фамилию и имя'),
  email: z.union([z.string().trim().email('Некорректный e-mail'), z.literal('')]).optional(),
  phone: z.string().trim().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

/** Приводит ошибки zod к виду { поле: сообщение } для подсказок рядом с полями. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}
