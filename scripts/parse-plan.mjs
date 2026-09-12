// Разбирает исходную учебную программу (plan_podgotovki_DE_09.02.07.md)
// в структуру «месяц → неделя → день» и сохраняет её в
// content/curriculum/plan.generated.json.
//
// Зачем отдельный скрипт: содержание 30 недель должно оставаться ДОСЛОВНО таким,
// как в исходном файле преподавателя (раздел 46 ТЗ — ничего не выдумывать).
// Если план поправят — достаточно перезапустить `node scripts/parse-plan.mjs`.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(root, 'plan_podgotovki_DE_09.02.07.md');
const OUT = path.join(root, 'content', 'curriculum', 'plan.generated.json');

const MONTH_TITLES = {
  1: 'HTML, CSS, адаптив, Git',
  2: 'JavaScript, современный JS, TypeScript, Bootstrap',
  3: 'React + TypeScript',
  4: 'База данных и бэкенд',
  5: 'Сборка Модулей 1 и 2 целиком',
  6: 'Модуль 3, качество, другие предметные области',
  7: 'Режим экзамена',
};

/** Делит строку таблицы на ячейки, уважая экранированный `\|` внутри текста. */
function splitRow(line) {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  const cells = [];
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

const isSeparatorRow = (line) => /^\|[\s:|-]+\|$/.test(line.trim());

function parse() {
  const md = readFileSync(SOURCE, 'utf8');
  const lines = md.split(/\r?\n/);

  const months = [];
  let currentMonth = null;
  let pendingWeeks = null; // недели, к которым относится следующая таблица
  let table = null;

  const flushTable = () => {
    if (!table || !pendingWeeks) {
      table = null;
      return;
    }
    const { header, rows } = table;
    const theoryIdx = header.findIndex((h) => /теория/i.test(h));
    const practiceIdx = header.findIndex((h) => /практика|задача/i.test(h));
    const dayIdx = header.findIndex((h) => /день/i.test(h));
    if (dayIdx === -1 || practiceIdx === -1) {
      table = null;
      return;
    }

    const days = rows
      .map((cells) => {
        const dayNo = Number(String(cells[dayIdx]).replace(/\D+/g, ''));
        if (!dayNo) return null;
        const theory = theoryIdx >= 0 ? cells[theoryIdx] ?? '' : '';
        const practice = cells[practiceIdx] ?? '';
        return { dayNo, theory: normalizeCell(theory), practice: normalizeCell(practice) };
      })
      .filter(Boolean);

    // Одна таблица может описывать сразу несколько недель (недели 27–29).
    for (const week of pendingWeeks) {
      week.days = days.map((d) => ({ ...d }));
    }
    pendingWeeks = null;
    table = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    const monthMatch = line.match(/^#\s*МЕСЯЦ\s+(\d+)\.\s*(.+)$/i);
    if (monthMatch) {
      flushTable();
      currentMonth = {
        monthNo: Number(monthMatch[1]),
        title: monthMatch[2].trim(),
        weeks: [],
      };
      months.push(currentMonth);
      continue;
    }

    // «## Неделя 7 (26.10 – 01.11). Современный JavaScript — фундамент для React»
    const weekMatch = line.match(/^##\s*Неделя\s+(\d+)\s*\(([^)]+)\)\.?\s*(.*)$/i);
    if (weekMatch && currentMonth) {
      flushTable();
      const week = {
        weekNo: Number(weekMatch[1]),
        dates: weekMatch[2].trim(),
        title: (weekMatch[3] || '').trim(),
        days: [],
      };
      currentMonth.weeks.push(week);
      pendingWeeks = [week];
      continue;
    }

    // «## Недели 27–29 (15.03 – 04.04)» — одна таблица на три недели.
    const rangeMatch = line.match(/^##\s*Недели\s+(\d+)[–-](\d+)\s*\(([^)]+)\)\.?\s*(.*)$/i);
    if (rangeMatch && currentMonth) {
      flushTable();
      const from = Number(rangeMatch[1]);
      const to = Number(rangeMatch[2]);
      const created = [];
      for (let n = from; n <= to; n++) {
        const week = {
          weekNo: n,
          dates: rangeMatch[3].trim(),
          title: (rangeMatch[4] || '').trim() || 'Прогоны экзамена',
          days: [],
        };
        currentMonth.weeks.push(week);
        created.push(week);
      }
      pendingWeeks = created;
      continue;
    }

    // «## Неделя 26 (08.03 – 14.03)» без заголовка после точки уже покрыт weekMatch.
    if (line.startsWith('|')) {
      if (isSeparatorRow(line)) continue;
      const cells = splitRow(line);
      if (!table) {
        // первая строка таблицы — заголовок
        if (/день/i.test(cells[0] ?? '')) {
          table = { header: cells, rows: [] };
        }
        continue;
      }
      table.rows.push(cells);
      continue;
    }

    if (table && line.trim() === '') {
      flushTable();
    }
  }
  flushTable();

  // Схлопываем в плоский список дней с устойчивыми идентификаторами.
  const result = {
    source: path.basename(SOURCE),
    generatedAt: new Date().toISOString(),
    months: months.map((m) => ({
      id: `month-${String(m.monthNo).padStart(2, '0')}`,
      monthNo: m.monthNo,
      title: m.title,
      shortTitle: MONTH_TITLES[m.monthNo] ?? m.title,
      weeks: m.weeks.map((w) => ({
        id: `week-${String(w.weekNo).padStart(2, '0')}`,
        weekNo: w.weekNo,
        title: w.title,
        dates: w.dates,
        monthId: `month-${String(m.monthNo).padStart(2, '0')}`,
        days: w.days.map((d) => ({
          id: `day-${String(w.weekNo).padStart(2, '0')}-${d.dayNo}`,
          dayNo: d.dayNo,
          weekId: `week-${String(w.weekNo).padStart(2, '0')}`,
          monthId: `month-${String(m.monthNo).padStart(2, '0')}`,
          theory: d.theory,
          practice: d.practice,
          kind: classifyDay(d),
        })),
      })),
    })),
  };

  return result;
}

/** Тип дня: обычный, повторение, контрольный, отдых. */
function classifyDay(day) {
  const text = `${day.theory} ${day.practice}`.toLowerCase();
  if (/^\s*отдых/i.test(day.practice) || /отдых —|отдых$/i.test(day.practice.trim())) return 'rest';
  if (/контроль месяца|полный прогон.*часа|контроль/i.test(text)) {
    if (/контроль/i.test(text)) return 'control';
  }
  if (/лёгкий день/i.test(text)) return 'light';
  if (/повторение|разбор|проверка по чек-листу/i.test(text)) return 'review';
  if (/прогон/i.test(text)) return 'exam';
  return 'study';
}

function normalizeCell(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .replace(/^—$/, '')
    .trim();
}

const data = parse();
if (!existsSync(path.dirname(OUT))) mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(data, null, 2), 'utf8');

const weeks = data.months.flatMap((m) => m.weeks);
const days = weeks.flatMap((w) => w.days);
console.log(`[plan] месяцев: ${data.months.length}`);
console.log(`[plan] недель:  ${weeks.length}`);
console.log(`[plan] дней:    ${days.length}`);
const empty = days.filter((d) => !d.practice);
if (empty.length) console.warn(`[plan] дней без практики: ${empty.length}`, empty.map((d) => d.id).join(', '));
const badWeeks = weeks.filter((w) => w.days.length !== 7);
if (badWeeks.length) console.warn(`[plan] недели не по 7 дней:`, badWeeks.map((w) => `${w.id}=${w.days.length}`).join(', '));
