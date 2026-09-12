'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth/session';
import { setProgress, touchStudySession } from '@/lib/progress/service';
import { syncAchievements } from '@/lib/achievements';
import { prisma } from '@/lib/db';
import { getDay } from '@/content/curriculum';
import { getTopicById } from '@/lib/content';
import { INITIAL_REVIEW } from '@/lib/srs/logic';
import { dateKey } from '@/lib/utils';

/** Отметить день учебного плана выполненным (или снять отметку). */
export async function toggleDayComplete(dayId: string, completed: boolean) {
  const user = await requireUser();
  const day = getDay(dayId);
  if (!day) return { ok: false, error: 'День не найден' };

  await setProgress(user.id, 'day', dayId, { status: completed ? 'completed' : 'in_progress' });
  if (completed) {
    await touchStudySession(user.id, { lessonsDone: 1, theoryMinutes: 0 });
  }
  const unlocked = await syncAchievements(user.id);
  revalidatePath(`/plan/day/${dayId}`);
  revalidatePath('/plan');
  revalidatePath('/');
  return { ok: true, unlocked: unlocked.map((item) => ({ code: item.code, title: item.title, icon: item.icon })) };
}

/** Отметить тему изученной. Время теории идёт в дневную статистику. */
export async function completeTopic(topicId: string, minutes = 0) {
  const user = await requireUser();
  const topic = await getTopicById(topicId);
  if (!topic) return { ok: false, error: 'Тема не найдена' };

  await setProgress(user.id, 'topic', topicId, { status: 'completed' });
  if (minutes > 0) await touchStudySession(user.id, { theoryMinutes: Math.min(minutes, 240) });
  const unlocked = await syncAchievements(user.id);

  revalidatePath(`/theory/${topicId}`);
  revalidatePath('/');
  return { ok: true, unlocked: unlocked.map((item) => ({ code: item.code, title: item.title, icon: item.icon })) };
}

export async function uncompleteTopic(topicId: string) {
  const user = await requireUser();
  await setProgress(user.id, 'topic', topicId, { status: 'in_progress' });
  revalidatePath(`/theory/${topicId}`);
  return { ok: true };
}

/** Добавить тему в очередь повторения вручную (кнопка «Повторить позже»). */
export async function addToReview(topicId: string, reason = 'manual') {
  const user = await requireUser();
  const existing = await prisma.reviewItem.findUnique({ where: { userId_topicId: { userId: user.id, topicId } } });
  if (existing) {
    await prisma.reviewItem.update({
      where: { id: existing.id },
      data: { dueAt: new Date(), reason },
    });
  } else {
    await prisma.reviewItem.create({
      data: { userId: user.id, topicId, reason, dueAt: new Date(), ...INITIAL_REVIEW },
    });
  }
  revalidatePath('/review');
  revalidatePath(`/theory/${topicId}`);
  return { ok: true };
}

export async function removeFromReview(topicId: string) {
  const user = await requireUser();
  await prisma.reviewItem
    .delete({ where: { userId_topicId: { userId: user.id, topicId } } })
    .catch(() => undefined);
  revalidatePath('/review');
  revalidatePath(`/theory/${topicId}`);
  return { ok: true };
}

/** Личная заметка к теме, уроку или заданию (раздел 12 ТЗ). */
export async function saveNote(entityType: string, entityId: string, body: string) {
  const user = await requireUser();
  const text = body.trim();

  if (!text) {
    await prisma.note
      .delete({ where: { userId_entityType_entityId: { userId: user.id, entityType, entityId } } })
      .catch(() => undefined);
    return { ok: true, empty: true };
  }

  await prisma.note.upsert({
    where: { userId_entityType_entityId: { userId: user.id, entityType, entityId } },
    create: { userId: user.id, entityType, entityId, body: text.slice(0, 8000) },
    update: { body: text.slice(0, 8000) },
  });
  return { ok: true };
}

/** Закладка на любую страницу платформы. */
export async function toggleBookmark(entityType: string, entityId: string, title: string, url: string) {
  const user = await requireUser();
  const existing = await prisma.bookmark.findUnique({
    where: { userId_entityType_entityId: { userId: user.id, entityType, entityId } },
  });
  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return { ok: true, bookmarked: false };
  }
  await prisma.bookmark.create({ data: { userId: user.id, entityType, entityId, title, url } });
  return { ok: true, bookmarked: true };
}

/** Обновление дат обучения из профиля. */
export async function updateStudyDates(startDate: string | null, examDate: string | null) {
  const user = await requireUser();

  // Та же проверка, что и при регистрации: экзамен раньше старта подготовки —
  // это опечатка в годе, а не осмысленная дата.
  const effectiveStart = startDate ?? dateKey(user.startDate);
  if (examDate && examDate < effectiveStart) {
    return { ok: false as const, error: 'Дата экзамена раньше начала подготовки — проверьте год' };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(startDate ? { startDate: new Date(`${startDate}T00:00:00`) } : {}),
      examDate: examDate ? new Date(`${examDate}T00:00:00`) : null,
    },
  });

  // От дат зависит весь календарь плана, а не только дашборд.
  revalidatePath('/');
  revalidatePath('/progress');
  revalidatePath('/plan', 'layout');
  return { ok: true as const };
}
