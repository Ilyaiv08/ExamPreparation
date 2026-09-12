'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { createSession, hashPassword, verifyPassword } from '@/lib/auth/session';
import { fieldErrors, loginSchema, registerSchema } from '@/lib/auth/validation';
import { PLAN_META } from '@/content/curriculum';
import type { AuthFormState } from './form-state';

export async function loginAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    login: String(formData.get('login') ?? ''),
    password: String(formData.get('password') ?? ''),
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const user = await prisma.user.findUnique({ where: { login: parsed.data.login } });
  // Одинаковое сообщение для неверного логина и неверного пароля:
  // иначе форму можно использовать для перебора существующих логинов.
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return { errors: { form: 'Неверный логин или пароль' } };
  }

  await createSession({
    id: user.id,
    login: user.login,
    fullName: user.fullName,
    role: user.role === 'admin' ? 'admin' : 'student',
  });
  redirect('/');
}

export async function registerAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    login: String(formData.get('login') ?? ''),
    password: String(formData.get('password') ?? ''),
    fullName: String(formData.get('fullName') ?? ''),
    email: String(formData.get('email') ?? ''),
    phone: String(formData.get('phone') ?? ''),
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const existing = await prisma.user.findUnique({ where: { login: parsed.data.login } });
  if (existing) return { errors: { login: 'Такой логин уже занят' } };

  const startDateRaw = String(formData.get('startDate') ?? '').trim();
  const examDateRaw = String(formData.get('examDate') ?? '').trim();

  // Экзамен раньше старта подготовки — почти всегда опечатка в годе.
  // Молча принять такую дату нельзя: платформа сразу покажет «экзамен был»,
  // а студент не поймёт, почему.
  if (startDateRaw && examDateRaw && examDateRaw < startDateRaw) {
    return { errors: { examDate: 'Дата экзамена раньше начала подготовки — проверьте год' } };
  }

  const user = await prisma.user.create({
    data: {
      login: parsed.data.login,
      passwordHash: await hashPassword(parsed.data.password),
      fullName: parsed.data.fullName,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      startDate: startDateRaw ? new Date(`${startDateRaw}T00:00:00`) : new Date(`${PLAN_META.defaultStartDate}T00:00:00`),
      examDate: examDateRaw ? new Date(`${examDateRaw}T00:00:00`) : null,
    },
  });

  await createSession({ id: user.id, login: user.login, fullName: user.fullName, role: 'student' });
  redirect('/');
}
