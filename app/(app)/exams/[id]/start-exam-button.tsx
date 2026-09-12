'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PlayCircle } from 'lucide-react';
import { Button, LinkButton } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { startExam } from '@/lib/actions/exam-actions';

export function StartExamButton({
  examId,
  generatedId,
  mode,
  activeAttemptId,
}: {
  examId: string;
  generatedId?: string;
  mode: 'demo' | 'practice' | 'final';
  activeAttemptId?: string;
}) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  if (activeAttemptId) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <LinkButton href={`/exams/run/${activeAttemptId}`} variant="primary" size="lg" icon={<PlayCircle size={16} />}>
          Продолжить начатую попытку
        </LinkButton>
        <span className="text-xs" style={{ color: 'var(--ink-3)' }}>
          Таймеры модулей продолжают идти.
        </span>
      </div>
    );
  }

  const start = () => {
    startTransition(async () => {
      const result = await startExam(examId, mode, generatedId);
      if (!result.ok) {
        toast.error('Не удалось начать экзамен', result.error);
        return;
      }
      router.push(`/exams/run/${result.attemptId}`);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={start} loading={pending} size="lg" icon={<PlayCircle size={16} />}>
        Начать экзамен
      </Button>
      <span className="text-xs" style={{ color: 'var(--ink-3)' }}>
        Таймер первого модуля запустится, когда вы его откроете.
      </span>
    </div>
  );
}
