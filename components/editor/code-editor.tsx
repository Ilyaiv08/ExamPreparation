'use client';

import { useEffect, useRef } from 'react';
import Editor, { loader, type OnMount } from '@monaco-editor/react';
import { useResolvedDark } from '@/components/layout/theme';
import { Spinner } from '@/components/ui/button';

/**
 * Monaco Editor.
 *
 * Важно: файлы редактора берутся из локальной папки /vendor/monaco,
 * куда их кладёт `npm run assets`. По умолчанию @monaco-editor/react тянет
 * Monaco с CDN — это сломало бы работу без интернета, а вся подготовка
 * к экзамену идёт офлайн.
 */
loader.config({ paths: { vs: '/vendor/monaco/vs' } });

export type EditorLanguage = 'javascript' | 'typescript' | 'html' | 'css' | 'sql' | 'json';

export function CodeEditor({
  value,
  onChange,
  language,
  height = 420,
  readOnly = false,
  onRunShortcut,
  onSaveShortcut,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  language: EditorLanguage;
  height?: number | string;
  readOnly?: boolean;
  onRunShortcut?: () => void;
  onSaveShortcut?: () => void;
  /** Чем именно является этот редактор: «Решение задания», «Схема базы данных». */
  ariaLabel?: string;
}) {
  const isDark = useResolvedDark();
  const runRef = useRef(onRunShortcut);
  const saveRef = useRef(onSaveShortcut);

  // Обработчики читаются из ref внутри команд Monaco: сам редактор
  // пересоздавать при их смене не нужно. Запись — в эффекте, а не во время
  // отрисовки: во время отрисовки ref трогать нельзя.
  useEffect(() => {
    runRef.current = onRunShortcut;
    saveRef.current = onSaveShortcut;
  }, [onRunShortcut, onSaveShortcut]);

  const onMount: OnMount = (editor, monaco) => {
    // Ctrl+Enter — запустить тесты, Ctrl+S — сохранить черновик.
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current?.());
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => saveRef.current?.());

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      strict: false,
      noEmit: true,
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--line)' }}>
      <Editor
        height={height}
        language={language}
        theme={isDark ? 'vs-dark' : 'vs'}
        value={value}
        onChange={(next) => onChange(next ?? '')}
        onMount={onMount}
        loading={
          <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--ink-3)' }}>
            <Spinner /> Загрузка редактора…
          </span>
        }
        options={{
          readOnly,
          // Скринридеру нужно знать, что это редактор кода: внутри Monaco
          // прячет обычное textarea, и без подписи оно читается как безымянное поле.
          ariaLabel: ariaLabel ?? 'Редактор кода',
          fontSize: 13.5,
          fontFamily: 'JetBrains Mono, Cascadia Code, Consolas, monospace',
          minimap: { enabled: false },
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          renderLineHighlight: 'line',
          smoothScrolling: true,
          padding: { top: 10, bottom: 10 },
          bracketPairColorization: { enabled: true },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          formatOnPaste: true,
          scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
        }}
      />
    </div>
  );
}
