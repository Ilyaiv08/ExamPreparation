'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';
import { validateContent, type ContentType } from '@/lib/content-schema';
import { ALL_TOPICS } from '@/content/topics';
import { ALL_TASKS } from '@/content/tasks';
import { ALL_QUIZZES } from '@/content/quizzes';
import { ALL_PROJECTS } from '@/content/projects';
import { ALL_EXAMS } from '@/content/exams';

/**
 * Админ-панель (раздел 31 ТЗ): контент меняется без правки исходного кода.
 *
 * Правки сохраняются в таблицу ContentOverride и накладываются на файловый
 * контент слоем lib/content. Исходные файлы остаются нетронутыми, поэтому
 * любую правку можно отменить одной кнопкой.
 */

function baseIds(type: ContentType): Set<string> {
  switch (type) {
    case 'topic':
      return new Set(ALL_TOPICS.map((item) => item.id));
    case 'task':
      return new Set(ALL_TASKS.map((item) => item.id));
    case 'quiz':
      return new Set(ALL_QUIZZES.map((item) => item.id));
    case 'project':
      return new Set(ALL_PROJECTS.map((item) => item.id));
    case 'exam':
      return new Set(ALL_EXAMS.map((item) => item.id));
    default:
      return new Set();
  }
}

export async function saveContentOverride(type: ContentType, entityId: string, json: string) {
  const admin = await requireAdmin();

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (error) {
    return { ok: false as const, errors: [`Некорректный JSON: ${(error as Error).message}`] };
  }

  const validation = validateContent(type, parsed);
  if (!validation.ok) return { ok: false as const, errors: validation.errors };

  const id = (parsed as { id?: string }).id;
  if (!id || id !== entityId) {
    return { ok: false as const, errors: ['Поле id должно совпадать с идентификатором редактируемой записи'] };
  }

  const isNew = !baseIds(type).has(entityId);

  await prisma.contentOverride.upsert({
    where: { entityType_entityId: { entityType: type, entityId } },
    create: { entityType: type, entityId, dataJson: JSON.stringify(parsed), isNew, updatedBy: admin.login },
    update: { dataJson: JSON.stringify(parsed), disabled: false, updatedBy: admin.login },
  });

  revalidateContent(type, entityId);
  return { ok: true as const };
}

export async function createContent(type: ContentType, json: string) {
  const admin = await requireAdmin();

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (error) {
    return { ok: false as const, errors: [`Некорректный JSON: ${(error as Error).message}`] };
  }

  const validation = validateContent(type, parsed);
  if (!validation.ok) return { ok: false as const, errors: validation.errors };

  const id = (parsed as { id?: string }).id;
  if (!id) return { ok: false as const, errors: ['Не указан id'] };

  const existingBase = baseIds(type).has(id);
  const existingOverride = await prisma.contentOverride.findUnique({
    where: { entityType_entityId: { entityType: type, entityId: id } },
  });
  if (existingBase || existingOverride) {
    return { ok: false as const, errors: [`Запись с id «${id}» уже существует`] };
  }

  await prisma.contentOverride.create({
    data: { entityType: type, entityId: id, dataJson: JSON.stringify(parsed), isNew: true, updatedBy: admin.login },
  });

  revalidateContent(type, id);
  return { ok: true as const, id };
}

/** Отмена правки: запись возвращается к файловому варианту. */
export async function resetContentOverride(type: ContentType, entityId: string) {
  await requireAdmin();
  await prisma.contentOverride
    .delete({ where: { entityType_entityId: { entityType: type, entityId } } })
    .catch(() => undefined);
  revalidateContent(type, entityId);
  return { ok: true as const };
}

/** Скрыть запись от студентов, не удаляя её. */
export async function setContentDisabled(type: ContentType, entityId: string, disabled: boolean, json?: string) {
  const admin = await requireAdmin();
  const existing = await prisma.contentOverride.findUnique({
    where: { entityType_entityId: { entityType: type, entityId } },
  });

  if (existing) {
    await prisma.contentOverride.update({ where: { id: existing.id }, data: { disabled } });
  } else {
    await prisma.contentOverride.create({
      data: {
        entityType: type,
        entityId,
        dataJson: json ?? '{}',
        disabled,
        isNew: false,
        updatedBy: admin.login,
      },
    });
  }

  revalidateContent(type, entityId);
  return { ok: true as const };
}

function revalidateContent(type: ContentType, entityId: string) {
  revalidatePath('/admin');
  revalidatePath(`/admin/${type}`);
  revalidatePath(`/admin/${type}/${entityId}`);
  switch (type) {
    case 'topic':
      revalidatePath('/theory');
      revalidatePath(`/theory/${entityId}`);
      break;
    case 'task':
      revalidatePath('/tasks');
      revalidatePath(`/tasks/${entityId}`);
      break;
    case 'quiz':
      revalidatePath(`/quiz/${entityId}`);
      break;
    case 'project':
      revalidatePath('/projects');
      revalidatePath(`/projects/${entityId}`);
      break;
    case 'exam':
      revalidatePath('/exams');
      revalidatePath(`/exams/${entityId}`);
      break;
  }
  revalidatePath('/');
}
