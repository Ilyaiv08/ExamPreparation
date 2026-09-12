import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { getExamById, getQuizById, getTaskById } from '@/lib/content';
import { ExamRunner, type ExamRunnerTask } from './exam-runner';
import type { Exam } from '@/content/types';
import type { ModuleState } from '@/lib/exam/service';

export const metadata: Metadata = { title: 'Экзамен' };
export const dynamic = 'force-dynamic';

export default async function ExamRunPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;
  const user = await requireUser();

  const attempt = await prisma.examAttempt.findFirst({
    where: { id: attemptId, userId: user.id },
    include: { answers: true },
  });
  if (!attempt) notFound();
  if (attempt.status !== 'in_progress') redirect(`/exams/attempts/${attempt.id}`);

  let exam: Exam | undefined;
  if (attempt.generatedExamId) {
    const row = await prisma.generatedExam.findFirst({ where: { id: attempt.generatedExamId, userId: user.id } });
    if (row) exam = JSON.parse(row.specJson) as Exam;
  } else {
    exam = await getExamById(attempt.examId);
  }
  if (!exam) notFound();

  // Подтягиваем содержимое заданий: в экзаменационном режиме подсказки скрыты.
  const modules = await Promise.all(
    exam.modules.map(async (module) => ({
      id: module.id,
      moduleNo: module.moduleNo,
      title: module.title,
      minutes: module.minutes,
      instruction: module.instruction,
      tasks: (await Promise.all(
        module.tasks.map(async (examTask): Promise<ExamRunnerTask | null> => {
          if (examTask.kind === 'code') {
            const task = await getTaskById(examTask.taskId);
            if (!task) return null;
            return {
              id: examTask.id,
              kind: 'code',
              points: examTask.points,
              title: examTask.title ?? task.title,
              task: {
                id: task.id,
                statement: task.statement,
                requirements: task.requirements,
                runtime: task.runtime,
                starterCode: task.starterCode,
                setupSql: task.setupSql,
                viewport: task.viewport,
                tests: task.tests,
                maxScore: task.maxScore,
                timeLimitMs: task.timeLimitMs,
              },
            };
          }
          if (examTask.kind === 'quiz') {
            const quiz = await getQuizById(examTask.quizId);
            if (!quiz) return null;
            return { id: examTask.id, kind: 'quiz', points: examTask.points, title: examTask.title ?? quiz.title, quiz };
          }
          return {
            id: examTask.id,
            kind: 'checklist',
            points: examTask.points,
            title: examTask.title,
            description: examTask.description,
            items: examTask.items,
          };
        }),
      )).filter((item): item is ExamRunnerTask => Boolean(item)),
    })),
  );

  const moduleState = JSON.parse(attempt.modulesJson) as ModuleState[];
  const answers: Record<string, { answerJson: string; score: number; maxScore: number; passed: boolean }> = {};
  for (const answer of attempt.answers) {
    answers[answer.examTaskId] = {
      answerJson: answer.answerJson,
      score: answer.score,
      maxScore: answer.maxScore,
      passed: answer.passed,
    };
  }

  return (
    <ExamRunner
      attemptId={attempt.id}
      examTitle={exam.title}
      isDemo={exam.kind === 'demo'}
      modules={modules}
      moduleState={moduleState}
      answers={answers}
      startedAt={attempt.startedAt.toISOString()}
    />
  );
}
