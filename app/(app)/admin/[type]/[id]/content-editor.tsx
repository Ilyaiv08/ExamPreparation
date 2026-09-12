'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Eye, EyeOff, RotateCcw, Save } from 'lucide-react';
import { Alert, Card } from '@/components/ui/base';
import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/editor/code-editor';
import { useToast } from '@/components/ui/toast';
import { Modal } from '@/components/ui/modal';
import {
  createContent,
  resetContentOverride,
  saveContentOverride,
  setContentDisabled,
} from '@/lib/actions/admin-actions';
import { CONTENT_TYPE_LABELS, type ContentType } from '@/lib/content-schema';

/**
 * Редактор контента: JSON в Monaco с проверкой схемы на сервере.
 *
 * Почему JSON, а не форма на каждое поле: структура у сущностей разная и
 * глубокая (тесты, варианты ответов, модули экзамена). Один редактор с
 * жёсткой проверкой честнее десятка полуработающих форм.
 */
export function ContentEditor({
  type,
  entityId,
  initialJson,
  hasOverride,
  isDisabled,
  isNew,
}: {
  type: ContentType;
  entityId: string;
  initialJson: string;
  hasOverride: boolean;
  isDisabled: boolean;
  isNew: boolean;
}) {
  const [json, setJson] = useState(initialJson);
  const [errors, setErrors] = useState<string[]>([]);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  const save = () => {
    setErrors([]);
    startTransition(async () => {
      const result = isNew ? await createContent(type, json) : await saveContentOverride(type, entityId, json);
      if (!result.ok) {
        setErrors(result.errors);
        toast.error('Сохранить не удалось', `Проблем: ${result.errors.length}`);
        return;
      }
      toast.success('Сохранено', 'Изменения уже видны студентам');
      if (isNew && 'id' in result && result.id) {
        router.push(`/admin/${type}/${result.id}`);
      } else {
        router.refresh();
      }
    });
  };

  const reset = () => {
    startTransition(async () => {
      await resetContentOverride(type, entityId);
      toast.info('Правка отменена', 'Запись вернулась к файловому варианту');
      setConfirmReset(false);
      router.refresh();
    });
  };

  const toggleVisibility = () => {
    startTransition(async () => {
      await setContentDisabled(type, entityId, !isDisabled, json);
      toast.info(isDisabled ? 'Запись снова видна' : 'Запись скрыта от студентов');
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold">
            {isNew ? `Новая запись · ${CONTENT_TYPE_LABELS[type]}` : entityId}
          </h1>
          <p className="text-xs" style={{ color: 'var(--ink-3)' }}>
            {hasOverride
              ? 'Запись изменена в админке. Файловый вариант остался нетронутым.'
              : 'Запись берётся из файлов контента.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isNew ? (
            <>
              <Button variant="secondary" onClick={toggleVisibility} loading={pending} icon={isDisabled ? <Eye size={14} /> : <EyeOff size={14} />}>
                {isDisabled ? 'Показать' : 'Скрыть'}
              </Button>
              {hasOverride ? (
                <Button variant="ghost" onClick={() => setConfirmReset(true)} icon={<RotateCcw size={14} />}>
                  Вернуть исходный вариант
                </Button>
              ) : null}
            </>
          ) : null}
          <Button onClick={save} loading={pending} icon={<Save size={15} />}>
            Сохранить
          </Button>
        </div>
      </div>

      {isDisabled ? (
        <Alert tone="bad" title="Запись скрыта" icon={<AlertTriangle size={16} />}>
          <p className="text-sm">Студенты её не видят. Нажмите «Показать», чтобы вернуть.</p>
        </Alert>
      ) : null}

      {errors.length ? (
        <Alert tone="bad" title="Проверка не пройдена" icon={<AlertTriangle size={16} />}>
          <ul className="flex list-disc flex-col gap-0.5 pl-4 text-sm">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      ) : null}

      <CodeEditor
        value={json}
        onChange={setJson}
        language="json"
        height={560}
        onSaveShortcut={save}
        ariaLabel="Содержимое объекта в формате JSON"
      />

      <Card>
        <p className="text-xs" style={{ color: 'var(--ink-3)' }}>
          Перед сохранением структура проверяется по схеме: обязательные поля, допустимые значения, минимум один тест у
          задания, корректные типы вопросов. Если проверка не пройдёт, изменения не применятся и студенты ничего не
          заметят.
        </p>
      </Card>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Вернуть исходный вариант?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmReset(false)}>
              Отмена
            </Button>
            <Button variant="danger" onClick={reset} loading={pending}>
              Вернуть
            </Button>
          </>
        }
      >
        <p className="text-sm">
          Правка из админки будет удалена, запись снова начнёт браться из файлов контента. Действие отменить нельзя.
        </p>
      </Modal>
    </div>
  );
}
