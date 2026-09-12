import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Склейка классов: clsx + разрешение конфликтов Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Число в проценты без дробей: 0.8237 -> 82 */
export function toPercent(value: number, total: number): number {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

/** 125 -> «2 ч 5 мин», 45 -> «45 мин» */
export function formatMinutes(minutes: number): string {
  if (!minutes) return '0 мин';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (!h) return `${m} мин`;
  if (!m) return `${h} ч`;
  return `${h} ч ${m} мин`;
}

/** Миллисекунды в читаемую длительность: 1532 -> «1.53 с» */
export function formatMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)} мс`;
  return `${(ms / 1000).toFixed(2)} с`;
}

/** Дата в формате ДД.ММ.ГГГГ — том самом, который требует задание экзамена. */
export function toRuDate(value: Date | string): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** Ключ дня для таблицы активности: YYYY-MM-DD по локальному времени. */
export function dateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Разница в днях между двумя ключами дней. */
export function daysBetween(fromKey: string, toKey: string): number {
  const from = new Date(`${fromKey}T00:00:00`);
  const to = new Date(`${toKey}T00:00:00`);
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

/**
 * Имя из ФИО.
 *
 * Поле называется «ФИО», то есть порядок — фамилия, имя, отчество.
 * Значит, имя это второе слово, а не первое: «Иванов Иван Иванович» → «Иван».
 * Если ввели одно слово — это и есть обращение.
 *
 * Отдельный случай — названия вместо имён: «Администратор платформы».
 * Второе слово там со строчной буквы, и обращение «Доброй ночи, платформы»
 * выглядит поломкой. Имя с маленькой буквы не пишут, поэтому такое
 * сочетание — заглавное первое слово и строчное второе — считаем названием
 * и обращаемся по первому слову. Если со строчной написано всё
 * («иванов илья»), это просто небрежный ввод, и порядок ФИО в силе.
 */
export function firstName(fullName: string, fallback = ''): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0];

  const startsLower = (word: string) => word[0] === word[0].toLowerCase() && word[0] !== word[0].toUpperCase();
  if (startsLower(parts[1]) && !startsLower(parts[0])) return parts[0];

  return parts[1];
}

/** Дата плюс N дней. Исходная дата не меняется. */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() + days);
  return result;
}

/** Короткая дата без года: 14.09 — для подписей недель. */
export function toShortDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
}

/** Склонение: 1 задача, 2 задачи, 5 задач */
export function plural(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

export function pluralize(count: number, one: string, few: string, many: string): string {
  return `${count} ${plural(count, one, few, many)}`;
}
