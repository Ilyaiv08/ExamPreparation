'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth/session';
import { getProjectById } from '@/lib/content';
import { setProgress, touchStudySession } from '@/lib/progress/service';
import { syncAchievements } from '@/lib/achievements';

/**
 * Мини-проекты (раздел 23 ТЗ).
 * Часть требований проверяется автотестами, часть — чек-листом:
 * проект целиком автоматически проверить нельзя, и платформа это честно разделяет.
 */

const saveSchema = z.object({
  projectId: z.string(),
  checklist: z.record(z.string(), z.boolean()).optional(),
  notes: z.string().max(10_000).optional(),
  repoUrl: z.string().max(500).optional(),
  code: z.string().max(200_000).optional(),
  autoResults: z
    .array(z.object({ id: z.string(), passed: z.boolean() }))
    .max(100)
    .optional(),
});

export async function saveProject(input: z.infer<typeof saveSchema>) {
  const user = await requireUser();
  const parsed = saveSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: 'Некорректные данные' };

  const project = await getProjectById(parsed.data.projectId);
  if (!project) return { ok: false as const, error: 'Проект не найден' };

  const existing = await prisma.projectSubmission.findUnique({
    where: { userId_projectId: { userId: user.id, projectId: project.id } },
  });

  const checklist = parsed.data.checklist ?? (existing ? (JSON.parse(existing.checklistJson) as Record<string, boolean>) : {});
  const checklistScore = project.checklist.reduce((sum, item) => sum + (checklist[item.id] ? item.weight : 0), 0);
  const checklistMax = project.checklist.reduce((sum, item) => sum + item.weight, 0);

  // Автопроверка: балл считается сервером по числу пройденных тестов.
  let autoScore = existing?.autoScore ?? 0;
  const autoMax = project.autoCheck?.maxScore ?? 0;
  if (project.autoCheck && parsed.data.autoResults) {
    const known = new Map(project.autoCheck.tests.map((test) => [test.id, test]));
    const results = parsed.data.autoResults.filter((item) => known.has(item.id));
    const totalPoints = project.autoCheck.tests.reduce((sum, test) => sum + (test.points ?? 1), 0);
    const earned = results.reduce((sum, item) => sum + (item.passed ? (known.get(item.id)?.points ?? 1) : 0), 0);
    autoScore = totalPoints ? Math.round((earned / totalPoints) * autoMax * 100) / 100 : 0;
  }

  const files = parsed.data.code !== undefined ? { 'solution': parsed.data.code } : existing ? JSON.parse(existing.filesJson) : {};

  const completedByChecklist = checklistMax > 0 && checklistScore >= checklistMax * 0.9;
  const completedByAuto = !project.autoCheck || autoScore >= autoMax;
  const status = completedByChecklist && completedByAuto ? 'completed' : 'in_progress';

  const data = {
    checklistJson: JSON.stringify(checklist),
    filesJson: JSON.stringify(files),
    notes: parsed.data.notes ?? existing?.notes ?? '',
    repoUrl: parsed.data.repoUrl ?? existing?.repoUrl ?? null,
    autoScore,
    autoMaxScore: autoMax,
    checklistScore,
    status,
    resultJson: JSON.stringify({ autoResults: parsed.data.autoResults ?? [] }),
  };

  await prisma.projectSubmission.upsert({
    where: { userId_projectId: { userId: user.id, projectId: project.id } },
    create: { userId: user.id, projectId: project.id, ...data },
    update: data,
  });

  await setProgress(user.id, 'project', project.id, {
    status: status === 'completed' ? 'completed' : 'in_progress',
    score: checklistScore + autoScore,
  });

  if (status === 'completed') {
    await touchStudySession(user.id, { practiceMinutes: 30 });
  }

  const unlocked = status === 'completed' ? await syncAchievements(user.id) : [];

  revalidatePath(`/projects/${project.id}`);
  revalidatePath('/projects');

  return {
    ok: true as const,
    status,
    checklistScore,
    checklistMax,
    autoScore,
    autoMax,
    unlocked: unlocked.map((item) => ({ code: item.code, title: item.title, icon: item.icon })),
  };
}
