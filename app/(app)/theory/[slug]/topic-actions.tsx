'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Circle, Code2, Lightbulb, Repeat2, Timer } from 'lucide-react';
import { Button, LinkButton } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { addToReview, completeTopic, removeFromReview, uncompleteTopic } from '@/lib/actions/progress-actions';

/**
 * Кнопки страницы теории. Время чтения считается реально: таймер идёт,
 * пока вкладка активна, и попадает в статистику «теория, минут».
 */
export function TopicActions({
  topicId,
  completed,
  inReview,
  firstTaskId,
  quizId,
  estimatedMinutes,
}: {
  topicId: string;
  completed: boolean;
  inReview: boolean;
  firstTaskId?: string;
  quizId?: string;
  estimatedMinutes: number;
}) {
  const [pending, startTransition] = useTransition();
  const [reviewPending, startReview] = useTransition();
  const [seconds, setSeconds] = useState(0);
  const visible = useRef(true);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const onVisibility = () => {
      visible.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibility);
    const timer = setInterval(() => {
      if (visible.current) setSeconds((value) => value + 1);
    }, 1000);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const minutes = Math.round(seconds / 60);

  const toggleComplete = () => {
    startTransition(async () => {
      if (completed) {
        await uncompleteTopic(topicId);
        toast.info('Отметка снята');
      } else {
        const result = await completeTopic(topicId, minutes);
        if (!result.ok) {
          toast.error('Не удалось сохранить', result.error);
          return;
        }
        toast.success('Тема отмечена изученной', minutes ? `Засчитано ${minutes} мин теории` : undefined);
        for (const achievement of result.unlocked ?? []) {
          toast.show({ tone: 'success', title: `${achievement.icon} ${achievement.title}`, description: 'Новое достижение' });
        }
      }
      router.refresh();
    });
  };

  const toggleReview = () => {
    startReview(async () => {
      if (inReview) {
        await removeFromReview(topicId);
        toast.info('Тема убрана из повторения');
      } else {
        await addToReview(topicId, 'manual');
        toast.success('Тема добавлена в повторение', 'Появится в разделе «Повторение»');
      }
      router.refresh();
    });
  };

  return (
    <div className="card flex flex-wrap items-center gap-2 p-3">
      <Button
        variant={completed ? 'success' : 'primary'}
        size="sm"
        onClick={toggleComplete}
        loading={pending}
        icon={completed ? <Check size={14} /> : <Circle size={14} />}
      >
        {completed ? 'Изучено' : 'Отметить изученной'}
      </Button>

      <Button
        variant={inReview ? 'secondary' : 'ghost'}
        size="sm"
        onClick={toggleReview}
        loading={reviewPending}
        icon={<Repeat2 size={14} />}
      >
        {inReview ? 'В повторении' : 'Добавить в повторение'}
      </Button>

      {quizId ? (
        <LinkButton href={`/quiz/${quizId}`} variant="secondary" size="sm" icon={<Lightbulb size={14} />}>
          Мини-тест
        </LinkButton>
      ) : null}

      {firstTaskId ? (
        <LinkButton href={`/tasks/${firstTaskId}`} variant="secondary" size="sm" icon={<Code2 size={14} />}>
          К практике
        </LinkButton>
      ) : null}

      <span className="ml-auto flex items-center gap-1.5 text-xs tabular-nums" style={{ color: 'var(--ink-3)' }}>
        <Timer size={13} />
        {formatTimer(seconds)} из ≈{estimatedMinutes} мин
      </span>
    </div>
  );
}

function formatTimer(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
