'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Eye, Lightbulb } from 'lucide-react';
import { Badge, Card, ProgressBar } from '@/components/ui/base';
import { Button, LinkButton } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { gradeReview } from '@/lib/actions/review-actions';
import type { ReviewGrade } from '@/lib/srs/logic';

export interface ReviewCard {
  topicId: string;
  title: string;
  summary: string;
  mustKnow: string[];
  quizId?: string;
  reason: string;
  repetitions: number;
  lapses: number;
  overdue: string;
}

/**
 * Очередь повторения. Сначала показывается только название темы:
 * задача — вспомнить самому, а уже потом свериться.
 */
export function ReviewQueue({ items }: { items: ReviewCard[] }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  const card = items[index];
  if (!card) return null;

  const grade = (value: ReviewGrade) => {
    startTransition(async () => {
      const result = await gradeReview(card.topicId, value);
      if (!result.ok) {
        toast.error('Не удалось сохранить', result.error);
        return;
      }
      toast.success(
        'Записано',
        result.intervalDays === 1
          ? 'Тема вернётся завтра'
          : `Следующее повторение через ${result.intervalDays} дн.`,
      );
      for (const achievement of result.unlocked ?? []) {
        toast.show({ tone: 'success', title: `${achievement.icon} ${achievement.title}`, description: 'Новое достижение' });
      }

      setRevealed(false);
      if (index + 1 < items.length) {
        setIndex(index + 1);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <ProgressBar value={index} max={items.length} label={`Карточка ${index + 1} из ${items.length}`} showValue size="sm" />

      <Card>
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <Badge tone="warn">{card.overdue}</Badge>
          <Badge tone="neutral">{card.reason}</Badge>
          {card.repetitions ? <Badge tone="neutral">повторений: {card.repetitions}</Badge> : null}
          {card.lapses ? <Badge tone="bad">забываний: {card.lapses}</Badge> : null}
        </div>

        <h2 className="text-lg font-semibold">{card.title}</h2>

        {revealed ? (
          <div className="mt-3 animate-fade-up">
            <p className="text-sm">{card.summary}</p>
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm" style={{ color: 'var(--ink-2)' }}>
              {card.mustKnow.map((item, itemIndex) => (
                <li key={itemIndex}>{item.replace(/`/g, '')}</li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <LinkButton href={`/theory/${card.topicId}`} size="sm" variant="secondary" icon={<BookOpen size={14} />}>
                Открыть теорию
              </LinkButton>
              {card.quizId ? (
                <LinkButton href={`/quiz/${card.quizId}`} size="sm" variant="secondary" icon={<Lightbulb size={14} />}>
                  Мини-тест
                </LinkButton>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm" style={{ color: 'var(--ink-3)' }}>
            Вспомните тему по памяти: что это, зачем нужно и где используется на экзамене. Потом откройте ответ и
            сверьтесь.
          </p>
        )}
      </Card>

      {revealed ? (
        <div className="flex flex-wrap gap-2">
          <Button variant="danger" onClick={() => grade(0)} loading={pending}>
            Не вспомнил
          </Button>
          <Button variant="secondary" onClick={() => grade(1)} loading={pending}>
            Вспомнил с трудом
          </Button>
          <Button variant="success" onClick={() => grade(2)} loading={pending}>
            Помню уверенно
          </Button>
        </div>
      ) : (
        <Button onClick={() => setRevealed(true)} icon={<Eye size={15} />}>
          Показать ответ
        </Button>
      )}

      <p className="text-xs" style={{ color: 'var(--ink-3)' }}>
        Оценка влияет на интервал: «не вспомнил» вернёт тему завтра, «уверенно» — через 2, 5, 10, 21 день и дальше.{' '}
        <Link href="/progress" className="underline">
          Статистика повторений
        </Link>
      </p>
    </div>
  );
}
