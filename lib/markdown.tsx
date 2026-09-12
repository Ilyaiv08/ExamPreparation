import type { ReactNode } from 'react';

/**
 * Небольшой рендерер Markdown, который строит React-элементы.
 *
 * Почему свой, а не библиотека:
 *  1. Платформа обязана работать офлайн, лишние зависимости не нужны.
 *  2. Никакого dangerouslySetInnerHTML — текст из админки не может
 *     превратиться в исполняемый HTML (раздел 37 ТЗ, безопасность данных).
 *
 * Поддерживается ровно то, что используется в контенте:
 * заголовки, абзацы, списки, таблицы, цитаты, код (блочный и строчный),
 * жирный, курсив, ссылки, горизонтальная линия.
 */

type Block =
  | { type: 'heading'; level: 2 | 3 | 4; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'quote'; lines: string[] }
  | { type: 'table'; header: string[]; rows: string[][] }
  | { type: 'hr' };

function splitTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  const cells: string[] = [];
  let current = '';
  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (ch === '\\' && trimmed[i + 1] === '|') {
      current += '|';
      i++;
      continue;
    }
    if (ch === '|') {
      cells.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  cells.push(current.trim());
  return cells;
}

const isTableSeparator = (line: string) => /^\|?[\s:|-]+\|[\s:|-]*$/.test(line.trim()) && line.includes('-');

export function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    // Блок кода ```lang
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      const language = fence[1] || 'text';
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        code.push(lines[i]);
        i++;
      }
      i++; // закрывающая метка
      blocks.push({ type: 'code', language, code: code.join('\n') });
      continue;
    }

    // Заголовки
    const heading = line.match(/^(#{2,4})\s+(.*)$/);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length as 2 | 3 | 4, text: heading[2].trim() });
      i++;
      continue;
    }

    // Горизонтальная линия
    if (/^(-{3,}|\*{3,})\s*$/.test(line)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Таблица
    if (line.trim().startsWith('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const header = splitTableRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(splitTableRow(lines[i]));
        i++;
      }
      blocks.push({ type: 'table', header, rows });
      continue;
    }

    // Цитата
    if (line.trim().startsWith('>')) {
      const quoted: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoted.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'quote', lines: quoted });
      continue;
    }

    // Список
    const bullet = line.match(/^\s*([-*])\s+(.*)$/);
    const numbered = line.match(/^\s*(\d+)[.)]\s+(.*)$/);
    if (bullet || numbered) {
      const ordered = Boolean(numbered);
      const items: string[] = [];
      while (i < lines.length) {
        const itemMatch = ordered ? lines[i].match(/^\s*\d+[.)]\s+(.*)$/) : lines[i].match(/^\s*[-*]\s+(.*)$/);
        if (itemMatch) {
          items.push(itemMatch[1]);
          i++;
          continue;
        }
        // Продолжение пункта на следующей строке с отступом.
        if (items.length && /^\s{2,}\S/.test(lines[i]) && lines[i].trim()) {
          items[items.length - 1] += ` ${lines[i].trim()}`;
          i++;
          continue;
        }
        break;
      }
      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    // Абзац
    const paragraph: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^```/.test(lines[i]) &&
      !/^#{2,4}\s/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+[.)]\s+/.test(lines[i]) &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('|')
    ) {
      paragraph.push(lines[i].trim());
      i++;
    }
    if (paragraph.length) blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
    else i++;
  }

  return blocks;
}

/** Разбор строчной разметки: `код`, **жирный**, *курсив*, [текст](ссылка). */
export function renderInline(text: string, keyPrefix = 'i'): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)\s]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const token = match[0];
    const id = `${keyPrefix}-${key++}`;

    if (token.startsWith('`')) {
      nodes.push(<code key={id}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith('**')) {
      nodes.push(<strong key={id}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('*')) {
      nodes.push(<em key={id}>{token.slice(1, -1)}</em>);
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      if (linkMatch) {
        const href = linkMatch[2];
        const external = /^https?:\/\//.test(href);
        nodes.push(
          <a
            key={id}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
          >
            {linkMatch[1]}
          </a>,
        );
      } else {
        nodes.push(token);
      }
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

/** Идентификатор для якорной ссылки на заголовок. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '');
}

export function Markdown({ source, className }: { source: string; className?: string }) {
  const blocks = parseMarkdown(source);
  return (
    <div className={className ? `prose-content ${className}` : 'prose-content'}>
      {blocks.map((block, index) => {
        const key = `b-${index}`;
        switch (block.type) {
          case 'heading': {
            const Tag = (block.level === 2 ? 'h2' : block.level === 3 ? 'h3' : 'h4') as 'h2' | 'h3' | 'h4';
            return (
              <Tag key={key} id={slugifyHeading(block.text)}>
                {renderInline(block.text, key)}
              </Tag>
            );
          }
          case 'paragraph':
            return <p key={key}>{renderInline(block.text, key)}</p>;
          case 'code':
            return (
              <pre key={key} data-language={block.language}>
                <code>{block.code}</code>
              </pre>
            );
          case 'list':
            return block.ordered ? (
              <ol key={key}>
                {block.items.map((item, itemIndex) => (
                  <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
                ))}
              </ol>
            ) : (
              <ul key={key}>
                {block.items.map((item, itemIndex) => (
                  <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
                ))}
              </ul>
            );
          case 'quote':
            return (
              <blockquote key={key}>
                {block.lines.map((line, lineIndex) => (
                  <p key={`${key}-${lineIndex}`}>{renderInline(line, `${key}-${lineIndex}`)}</p>
                ))}
              </blockquote>
            );
          case 'table':
            return (
              <div className="table-wrap" key={key}>
                <table>
                  <thead>
                    <tr>
                      {block.header.map((cell, cellIndex) => (
                        <th key={`${key}-h-${cellIndex}`}>{renderInline(cell, `${key}-h-${cellIndex}`)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={`${key}-r-${rowIndex}`}>
                        {row.map((cell, cellIndex) => (
                          <td key={`${key}-r-${rowIndex}-${cellIndex}`}>
                            {renderInline(cell, `${key}-r-${rowIndex}-${cellIndex}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'hr':
            return <hr key={key} style={{ border: 0, borderTop: '1px solid var(--line)', margin: '1.5rem 0' }} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

/** Простой текст без разметки — для поиска и превью. */
export function markdownToPlainText(source: string): string {
  return source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*`|-]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}
