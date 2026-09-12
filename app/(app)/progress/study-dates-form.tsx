'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { updateStudyDates } from '@/lib/actions/progress-actions';

/** Общий класс полей: подпись, поле и подсказка встают в общие строки сетки. */
const FIELD_CELL = 'sm:row-start-1 sm:row-span-3 sm:grid sm:grid-rows-subgrid';

export function StudyDatesForm({ startDate, examDate }: { startDate: string; examDate: string }) {
  const [start, setStart] = useState(startDate);
  const [exam, setExam] = useState(examDate);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  /*
   * Экзамен раньше старта обычно означает опечатку в годе. Сервер такую пару
   * не сохранит, но узнавать об этом после нажатия «Сохранить» поздно —
   * показываем прямо в поле, как только даты введены.
   */
  const wrongOrder = Boolean(start && exam && exam < start);

  const save = () => {
    startTransition(async () => {
      const result = await updateStudyDates(start || null, exam || null);
      if (!result.ok) {
        toast.error('Даты не сохранены', result.error);
        return;
      }
      toast.success('Даты сохранены', 'Календарь плана пересчитан от новой даты старта');
      router.refresh();
    });
  };

  /*
   * Ряд собран на subgrid, а не на flex с выравниванием по краю.
   * У поля экзамена есть подсказка, у поля старта — нет, поэтому колонки
   * разной высоты: при выравнивании по низу подписи и сами поля разъезжались
   * по вертикали. В subgrid каждое поле отдаёт свои три элемента в общие
   * строки ряда, и подписи стоят на одной линии независимо от того,
   * есть ли под полем подсказка или сообщение об ошибке.
   *
   * Колонка у каждого элемента задана явно: браузер раскладывает элементы
   * с заданной строкой раньше остальных, и кнопка без номера колонки
   * занимала бы первую, выталкивая поля вправо.
   */
  return (
    <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[repeat(2,minmax(0,13rem))_auto] sm:grid-rows-[auto_auto_auto] sm:gap-x-3 sm:gap-y-1">
      <Field
        label="Начало подготовки"
        name="startDate"
        type="date"
        value={start}
        onChange={(event) => setStart(event.target.value)}
        className={`${FIELD_CELL} sm:col-start-1`}
      />
      <Field
        label="Дата демоэкзамена"
        name="examDate"
        type="date"
        value={exam}
        onChange={(event) => setExam(event.target.value)}
        hint="За 30 дней включится предэкзаменационный режим"
        error={wrongOrder ? 'Раньше начала подготовки — проверьте год' : undefined}
        className={`${FIELD_CELL} sm:col-start-2`}
      />
      {/* Кнопка встаёт в строку полей, а не подписей. */}
      <div className="sm:col-start-3 sm:row-start-2 sm:self-start">
        <Button onClick={save} loading={pending} icon={<Save size={15} />}>
          Сохранить
        </Button>
      </div>
    </div>
  );
}
