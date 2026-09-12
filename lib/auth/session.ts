import 'server-only';

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

/**
 * Аутентификация: bcrypt для пароля + подписанный JWT в httpOnly-cookie.
 *
 * Почему именно так, а не готовая библиотека: ТЗ разрешает «другой современный
 * безопасный механизм», а связка bcrypt + JWT — ровно та, которую студент
 * обязан уметь писать сам на демоэкзамене. Код платформы служит образцом.
 *
 * Безопасность:
 *  - пароль хранится только хешем (bcrypt, 10 раундов);
 *  - токен подписан секретом из .env и проверяется на каждом запросе;
 *  - cookie httpOnly + sameSite=lax: JavaScript страницы её не видит;
 *  - в токене нет ничего секретного, только id, логин и роль.
 */

const COOKIE_NAME = 'exam_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 дней

export interface SessionUser {
  id: string;
  login: string;
  fullName: string;
  role: 'student' | 'admin';
}

function secret(): Uint8Array {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error(
      'AUTH_SECRET не задан или короче 32 символов. Скопируйте .env.example в .env и задайте собственный секрет.',
    );
  }
  return new TextEncoder().encode(value);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({ login: user.login, role: user.role, fullName: user.fullName })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

/** Данные сессии из cookie. Не обращается к базе — дешёвая проверка. */
export async function readSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    return {
      id: String(payload.sub),
      login: String(payload.login ?? ''),
      fullName: String(payload.fullName ?? ''),
      role: payload.role === 'admin' ? 'admin' : 'student',
    };
  } catch {
    return null;
  }
}

/** Пользователь из базы (нужен там, где важны настройки и даты). */
export async function getCurrentUser() {
  const session = await readSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  return user ?? null;
}

/** Пользователь или ошибка — для серверных действий и API. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new AuthError('Требуется вход в систему');
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'admin') throw new AuthError('Доступ только для администратора', 403);
  return user;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}
