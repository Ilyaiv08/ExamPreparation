'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/field';
import { createGeneratedExam } from '@/lib/actions/generate-exam-action';
import { EXAM_LEVEL_LABELS } from '@/content/types';

const DOMAINS = [
  { id: 'courses', title: 'Запись на курсы' },
  { id: 'autoservice', title: 'Запись в автосервис' },
  { id: 'cleaning', title: 'Клининговые услуги' },
  { id: 'coworking', title: 'Аренда рабочих мест' },
  { id: 'medical', title: 'Запись к врачу' },
];

export function GeneratorForm() {
  const [pending, setPending] = useState(false);

  return (
    <form action={async (formData) => { setPending(true); await createGeneratedExam(formData); setPending(false); }} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <SelectField label="Уровень" name="level" defaultValue="standard">
          {Object.entries(EXAM_LEVEL_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </SelectField>
        <SelectField
          label="Предметная область"
          name="domain"
          defaultValue="courses"
          hint="Программа советует тренироваться на разных темах, а не зубрить один проект"
        >
          {DOMAINS.map((domain) => (
            <option key={domain.id} value={domain.id}>
              {domain.title}
            </option>
          ))}
        </SelectField>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="onlyStudied" />
        Только пройденный материал (по текущему месяцу программы)
      </label>

      <Button type="submit" loading={pending} icon={<Sparkles size={15} />} className="self-start">
        Собрать вариант
      </Button>
    </form>
  );
}
