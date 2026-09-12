'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from 'lucide-react';
import type { Question, Quiz } from '@/content/types';
import type { QuestionResult } from '@/lib/grading/logic';
import { Badge, Card, ProgressBar } from '@/components/ui/base';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { QUESTION_TYPE_LABELS } from '@/content/types';
import { submitQuiz } from '@/lib/actions/quiz-actions';
import { cn } from '@/lib/utils';

type Answer = string | string[] | boolean | Record<string, string> | null;

/**
 * Прохождение теста. Поддерживаются все шесть типов вопросов из раздела 15 ТЗ:
 * один ответ, несколько ответов, верно/неверно, сопоставление,
 * последовательность и свободный ответ.
 */
export function QuizRunner({ quiz, onFinished }: { quiz: Quiz; onFinished?: () => void }) {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [index, setIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    percent: number;
    score: number;
    maxScore: number;
    passed: boolean;
    correctCount: number;
    totalCount: number;
    results: QuestionResult[];
  } | null>(null);
  // Момент начала — снимок при первой отрисовке: lazy-инициализатор useState
  // вызывается один раз и не считается вычислением во время отрисовки.
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const toast = useToast();
  const router = useRouter();

  const question = quiz.questions[index];
  const answered = useMemo(
    () => quiz.questions.filter((item) => isAnswered(answers[item.id])).length,
    [answers, quiz.questions],
  );

  const setAnswer = (questionId: string, value: Answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const submit = async () => {
    setSubmitting(true);
    const response = await submitQuiz({
      quizId: quiz.id,
      answers: answers as Record<string, Exclude<Answer, undefined>>,
      durationMs: Date.now() - startedAt,
      source: 'quiz',
    });
    setSubmitting(false);

    if (!response.ok) {
      toast.error('Не удалось проверить тест', response.error);
      return;
    }

    setResult(response);
    if (response.passed) {
      toast.success(`Тест пройден: ${response.percent}%`, `${response.correctCount} из ${response.totalCount} верно`);
    } else {
      toast.info(`Результат: ${response.percent}%`, `Проходной балл — ${quiz.passPercent}%`);
    }
    for (const achievement of response.unlocked) {
      toast.show({ tone: 'success', title: `${achievement.icon} ${achievement.title}`, description: 'Новое достижение' });
    }
    onFinished?.();
    router.refresh();
  };

  const restart = () => {
    setAnswers({});
    setIndex(0);
    setResult(null);
    setStartedAt(Date.now());
  };

  if (result) {
    return <QuizResult quiz={quiz} result={result} onRestart={restart} />;
  }

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <ProgressBar
          value={answered}
          max={quiz.questions.length}
          label={`Отвечено: ${answered} из ${quiz.questions.length}`}
          showValue
          size="sm"
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {quiz.questions.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(itemIndex)}
              aria-label={`Вопрос ${itemIndex + 1}`}
              aria-current={itemIndex === index ? 'true' : undefined}
              className="grid h-7 w-7 place-items-center rounded-lg text-xs font-medium transition-colors"
              style={{
                background:
                  itemIndex === index
                    ? 'var(--brand)'
                    : isAnswered(answers[item.id])
                      ? 'var(--ok-soft)'
                      : 'var(--surface-3)',
                color:
                  itemIndex === index ? '#fff' : isAnswered(answers[item.id]) ? 'var(--ok)' : 'var(--ink-3)',
              }}
            >
              {itemIndex + 1}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-start justify-between gap-3">
          <p className="text-sm font-medium">
            {index + 1}. {question.text}
          </p>
          <Badge tone="neutral">{QUESTION_TYPE_LABELS[question.type]}</Badge>
        </div>

        <QuestionInput question={question} value={answers[question.id] ?? null} onChange={(value) => setAnswer(question.id, value)} />
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
          disabled={index === 0}
          icon={<ArrowLeft size={14} />}
        >
          Назад
        </Button>
        {index < quiz.questions.length - 1 ? (
          <Button onClick={() => setIndex((value) => Math.min(quiz.questions.length - 1, value + 1))}>
            Далее <ArrowRight size={14} className="ml-1" />
          </Button>
        ) : null}
        <Button
          variant="success"
          className="ml-auto"
          onClick={submit}
          loading={submitting}
          disabled={answered === 0}
          icon={<Check size={15} />}
        >
          Проверить {answered < quiz.questions.length ? `(${answered}/${quiz.questions.length})` : ''}
        </Button>
      </div>
    </div>
  );
}

function isAnswered(value: Answer | undefined): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
}

function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: Answer;
  onChange: (value: Answer) => void;
}) {
  switch (question.type) {
    case 'single':
      return (
        <div className="flex flex-col gap-1.5" role="radiogroup">
          {question.options.map((option) => (
            <OptionRow
              key={option.id}
              type="radio"
              checked={value === option.id}
              onSelect={() => onChange(option.id)}
              text={option.text}
            />
          ))}
        </div>
      );

    case 'multiple': {
      const selected = Array.isArray(value) ? value : [];
      return (
        <div className="flex flex-col gap-1.5">
          <p className="mb-1 text-xs" style={{ color: 'var(--ink-3)' }}>
            Верных вариантов может быть несколько.
          </p>
          {question.options.map((option) => (
            <OptionRow
              key={option.id}
              type="checkbox"
              checked={selected.includes(option.id)}
              onSelect={() =>
                onChange(
                  selected.includes(option.id)
                    ? selected.filter((item) => item !== option.id)
                    : [...selected, option.id],
                )
              }
              text={option.text}
            />
          ))}
        </div>
      );
    }

    case 'boolean':
      return (
        <div className="flex gap-2">
          <Button variant={value === true ? 'primary' : 'secondary'} onClick={() => onChange(true)}>
            Верно
          </Button>
          <Button variant={value === false ? 'primary' : 'secondary'} onClick={() => onChange(false)}>
            Неверно
          </Button>
        </div>
      );

    case 'match': {
      const current = value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, string>) : {};
      return (
        <div className="flex flex-col gap-2">
          {question.left.map((left) => (
            <div key={left.id} className="flex flex-wrap items-center gap-2">
              <span className="min-w-0 flex-1 text-sm">{left.text}</span>
              <select
                value={current[left.id] ?? ''}
                onChange={(event) => onChange({ ...current, [left.id]: event.target.value })}
                aria-label={`Соответствие для «${left.text}»`}
                className="min-h-9 rounded-lg border px-2 text-sm"
                style={{ background: 'var(--surface)', borderColor: 'var(--line)', color: 'var(--ink)' }}
              >
                <option value="">— выберите —</option>
                {question.right.map((right) => (
                  <option key={right.id} value={right.id}>
                    {right.text}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      );
    }

    case 'order': {
      const order = Array.isArray(value) && value.length ? value : question.items.map((item) => item.id);
      const move = (from: number, to: number) => {
        if (to < 0 || to >= order.length) return;
        const next = [...order];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        onChange(next);
      };
      return (
        <ol className="flex flex-col gap-1.5">
          {order.map((id, position) => {
            const item = question.items.find((option) => option.id === id);
            return (
              <li
                key={id}
                className="flex items-center gap-2 rounded-lg border px-2.5 py-2 text-sm"
                style={{ borderColor: 'var(--line)' }}
              >
                <span className="w-5 shrink-0 text-xs" style={{ color: 'var(--ink-3)' }}>
                  {position + 1}.
                </span>
                <span className="min-w-0 flex-1">{item?.text}</span>
                <button
                  type="button"
                  onClick={() => move(position, position - 1)}
                  disabled={position === 0}
                  aria-label="Поднять выше"
                  className="rounded p-1 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(position, position + 1)}
                  disabled={position === order.length - 1}
                  aria-label="Опустить ниже"
                  className="rounded p-1 disabled:opacity-30"
                >
                  ↓
                </button>
              </li>
            );
          })}
        </ol>
      );
    }

    case 'text':
      return (
        <input
          type="text"
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ваш ответ"
          aria-label="Ответ"
          className="min-h-10 w-full rounded-lg border px-3 text-sm"
          style={{ background: 'var(--surface)', borderColor: 'var(--line)', color: 'var(--ink)' }}
        />
      );

    default:
      return null;
  }
}

function OptionRow({
  type,
  checked,
  onSelect,
  text,
}: {
  type: 'radio' | 'checkbox';
  checked: boolean;
  onSelect: () => void;
  text: string;
}) {
  return (
    <label
      className={cn('flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors')}
      style={{
        borderColor: checked ? 'var(--brand)' : 'var(--line)',
        background: checked ? 'var(--brand-soft)' : 'transparent',
      }}
    >
      <input type={type} checked={checked} onChange={onSelect} className="mt-0.5" />
      <span>{text}</span>
    </label>
  );
}

function QuizResult({
  quiz,
  result,
  onRestart,
}: {
  quiz: Quiz;
  result: {
    percent: number;
    score: number;
    maxScore: number;
    passed: boolean;
    correctCount: number;
    totalCount: number;
    results: QuestionResult[];
  };
  onRestart: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-3xl font-semibold tabular-nums" style={{ color: result.passed ? 'var(--ok)' : 'var(--bad)' }}>
              {result.percent}%
            </p>
            <p className="text-sm" style={{ color: 'var(--ink-3)' }}>
              {result.correctCount} из {result.totalCount} верно · {result.score} из {result.maxScore} баллов ·
              проходной {quiz.passPercent}%
            </p>
          </div>
          <Button variant="secondary" onClick={onRestart} icon={<RotateCcw size={14} />}>
            Пройти заново
          </Button>
        </div>
        <div className="mt-3">
          <ProgressBar value={result.percent} tone={result.passed ? 'ok' : 'bad'} />
        </div>
      </Card>

      <div className="flex flex-col gap-2">
        {result.results.map((item, index) => {
          const question = quiz.questions.find((q) => q.id === item.questionId);
          return (
            <Card key={item.questionId}>
              <div className="flex items-start gap-2">
                {item.correct ? (
                  <Check size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--ok)' }} />
                ) : (
                  <X size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--bad)' }} />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {index + 1}. {question?.text}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: 'var(--ink-3)' }}>
                    Ваш ответ: {item.given}
                  </p>
                  {!item.correct ? (
                    <p className="text-xs" style={{ color: 'var(--ok)' }}>
                      Правильно: {item.expected}
                    </p>
                  ) : null}
                  {item.explanation ? (
                    <p className="mt-1.5 text-xs" style={{ color: 'var(--ink-2)' }}>
                      {item.explanation}
                    </p>
                  ) : null}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
