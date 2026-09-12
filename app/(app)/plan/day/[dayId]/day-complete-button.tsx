'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { toggleDayComplete } from '@/lib/actions/progress-actions';

export function DayCompleteButton({ dayId, completed }: { dayId: string; completed: boolean }) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  const onClick = () => {
    startTransition(async () => {
      const result = await toggleDayComplete(dayId, !completed);
      if (!result.ok) {
        toast.error('Не удалось сохранить', result.error);
        return;
      }
      toast.success(completed ? 'Отметка снята' : 'День отмечен выполненным');
      for (const achievement of result.unlocked ?? []) {
        toast.show({ tone: 'success', title: `${achievement.icon} ${achievement.title}`, description: 'Новое достижение' });
      }
      router.refresh();
    });
  };

  return (
    <Button
      variant={completed ? 'success' : 'primary'}
      onClick={onClick}
      loading={pending}
      icon={completed ? <Check size={15} /> : <Circle size={15} />}
    >
      {completed ? 'День выполнен' : 'Отметить выполненным'}
    </Button>
  );
}
