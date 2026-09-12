import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { requireUser } from '@/lib/auth/session';
import { getQuizById, getTopics } from '@/lib/content';
import { prisma } from '@/lib/db';
import { Badge, Card, SectionTitle } from '@/components/ui/base';
import { Breadcrumbs } from '@/components/layout/app-shell';
import { QuizRunner } from '@/components/quiz/quiz-runner';
import { QUESTION_TYPE_LABELS, TECH_LABELS } from '@/content/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const quiz = await getQuizById(id);
  return { title: quiz?.title ?? 'Тест' };
}

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quiz = await getQuizById(id);
  if (!quiz) notFound();

  const user = await requireUser();
  const [attempts, topics] = await Promise.all([
    prisma.quizAttempt.findMany({
      where: { userId: user.id, quizId: id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    getTopics(),
  ]);

  const quizTopics = quiz.topicIds.map((topicId) => topics.find((topic) => topic.id === topicId)).filter(Boolean);
  const best = attempts.reduce((max, item) => Math.max(max, item.maxScore ? (item.score / item.maxScore) * 100 : 0), 0);
  const types = [...new Set(quiz.questions.map((question) => question.type))];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <Breadcrumbs
        items={[
          { label: 'Дашборд', href: '/' },
          { label: 'Теория', href: '/theory' },
          ...(quizTopics[0] ? [{ label: quizTopics[0]!.title, href: `/theory/${quizTopics[0]!.id}` }] : []),
          { label: 'Тест' },
        ]}
      />

      <header>
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          {quiz.tech.map((tech) => (
            <Badge key={tech} tone="neutral">
              {TECH_LABELS[tech]}
            </Badge>
          ))}
          <Badge tone="neutral">{quiz.questions.length} вопросов</Badge>
          <Badge tone="neutral">проходной {quiz.passPercent}%</Badge>
          {attempts.length ? (
            <Badge tone={best >= quiz.passPercent ? 'ok' : 'warn'}>Лучший результат: {Math.round(best)}%</Badge>
          ) : null}
        </div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{quiz.title}</h1>
        <p className="mt-1 text-xs" style={{ color: 'var(--ink-3)' }}>
          Типы вопросов: {types.map((type) => QUESTION_TYPE_LABELS[type]).join(', ')}
        </p>
      </header>

      <QuizRunner quiz={quiz} />

      {quizTopics.length ? (
        <section>
          <SectionTitle title="Теория по тесту" />
          <div className="flex flex-wrap gap-1.5">
            {quizTopics.map((topic) => (
              <Link key={topic!.id} href={`/theory/${topic!.id}`} className="chip hover:underline">
                {topic!.title}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {attempts.length ? (
        <section>
          <SectionTitle title="История попыток" />
          <Card>
            <ul className="flex flex-col gap-1.5 text-sm">
              {attempts.map((attempt) => (
                <li key={attempt.id} className="flex flex-wrap items-center gap-2">
                  <span className="tabular-nums font-medium">
                    {attempt.maxScore ? Math.round((attempt.score / attempt.maxScore) * 100) : 0}%
                  </span>
                  <span style={{ color: 'var(--ink-3)' }}>
                    {attempt.correctCount} из {attempt.totalCount} верно
                  </span>
                  <span className="ml-auto text-xs" style={{ color: 'var(--ink-3)' }}>
                    {attempt.createdAt.toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
