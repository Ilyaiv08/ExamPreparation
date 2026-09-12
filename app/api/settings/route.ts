import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { readSession } from '@/lib/auth/session';

const schema = z.object({
  theme: z.enum(['system', 'light', 'dark']).optional(),
  fontScale: z.number().int().min(85).max(130).optional(),
  examDate: z.string().optional().nullable(),
  startDate: z.string().optional(),
});

/** Настройки интерфейса и дат обучения. */
export async function PATCH(request: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Требуется вход' }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Некорректные настройки' }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (parsed.data.theme) data.theme = parsed.data.theme;
  if (parsed.data.fontScale) data.fontScale = parsed.data.fontScale;
  if (parsed.data.startDate) data.startDate = new Date(`${parsed.data.startDate}T00:00:00`);
  if (parsed.data.examDate !== undefined) {
    data.examDate = parsed.data.examDate ? new Date(`${parsed.data.examDate}T00:00:00`) : null;
  }
  if (!Object.keys(data).length) return NextResponse.json({ ok: true });

  await prisma.user.update({ where: { id: session.id }, data });
  return NextResponse.json({ ok: true });
}
