import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/**
 * Слой совместимости MySQL → SQLite.
 *
 * Файл public/runner/sql-adapt.js написан для браузера (без import/export),
 * поэтому здесь он выполняется как обычный скрипт в песочнице с собственным
 * глобальным объектом — так же, как это происходит внутри iframe.
 */
type AdaptResult = { sql: string; notes: string[] };
type Adapter = (sql: string) => AdaptResult;

let adapt: Adapter;

beforeAll(() => {
  const source = readFileSync(join(process.cwd(), 'public', 'runner', 'sql-adapt.js'), 'utf8');
  const scope: { __adaptMysqlToSqlite?: Adapter } = {};
  adapt = new Function('globalThis', `${source}\nreturn globalThis.__adaptMysqlToSqlite;`)(scope) as Adapter;
});

describe('adaptMysqlToSqlite', () => {
  it('переписывает AUTO_INCREMENT первичного ключа целиком', () => {
    const { sql, notes } = adapt('CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY);');

    expect(sql).toContain('INTEGER PRIMARY KEY AUTOINCREMENT');
    expect(sql).not.toContain('AUTO_INCREMENT');
    expect(notes.length).toBeGreaterThan(0);
  });

  it('переписывает DATEDIFF в разницу юлианских дней', () => {
    const { sql, notes } = adapt('SELECT DATEDIFF(check_out, check_in) AS nights FROM stays;');

    expect(sql).toContain('julianday(check_out)');
    expect(sql).toContain('julianday(check_in)');
    expect(sql).not.toContain('DATEDIFF');
    expect(notes.length).toBeGreaterThan(0);
  });

  it('переписывает DATEDIFF внутри SUM', () => {
    const { sql } = adapt('SELECT SUM(DATEDIFF(s.check_out, s.check_in)) FROM stays s;');

    expect(sql).not.toContain('DATEDIFF');
    expect(sql).toContain('julianday(s.check_out)');
  });

  it('переписывает обратный порядок PRIMARY KEY AUTO_INCREMENT', () => {
    // В MySQL допустимы оба порядка слов. Без этого правила SQLite отвечал
    // «AUTOINCREMENT is only allowed on an INTEGER PRIMARY KEY», и студент
    // искал ошибку в совершенно правильном запросе.
    const { sql } = adapt('CREATE TABLE users (id INT PRIMARY KEY AUTO_INCREMENT);');

    expect(sql).toContain('INTEGER PRIMARY KEY AUTOINCREMENT');
    expect(sql).not.toContain('AUTO_INCREMENT');
  });

  it('переписывает одиночный AUTO_INCREMENT', () => {
    const { sql } = adapt('id INT NOT NULL AUTO_INCREMENT');
    expect(sql).toContain('AUTOINCREMENT');
  });

  it('убирает ENGINE и DEFAULT CHARSET', () => {
    const { sql, notes } = adapt('CREATE TABLE t (id INT) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;');

    expect(sql).not.toMatch(/ENGINE/i);
    expect(sql).not.toMatch(/CHARSET/i);
    expect(notes.some((note) => note.includes('ENGINE'))).toBe(true);
    expect(notes.some((note) => note.includes('CHARSET'))).toBe(true);
  });

  it('переводит DATETIME в TEXT', () => {
    const { sql } = adapt('created_at DATETIME NOT NULL');
    expect(sql).toContain('TEXT');
    expect(sql).not.toMatch(/DATETIME/i);
  });

  it('не трогает тип DATE — он есть в обоих диалектах', () => {
    const { sql } = adapt('event_date DATE NOT NULL');
    expect(sql).toBe('event_date DATE NOT NULL');
  });

  it('переводит DATE_FORMAT в strftime с тем же форматом ДД.ММ.ГГГГ', () => {
    const { sql, notes } = adapt("SELECT DATE_FORMAT(event_date, '%d.%m.%Y') AS d FROM applications");

    expect(sql).toContain("strftime('%d.%m.%Y', event_date)");
    expect(notes.some((note) => note.includes('DATE_FORMAT'))).toBe(true);
  });

  it('переводит NOW() и CURDATE()', () => {
    expect(adapt('SELECT NOW()').sql).toContain("datetime('now')");
    expect(adapt('SELECT CURDATE()').sql).toContain("date('now')");
  });

  it('превращает ENUM в TEXT, сохраняя список значений комментарием', () => {
    const { sql, notes } = adapt("status ENUM('Новая','Завершена') NOT NULL");

    expect(sql).toContain('TEXT');
    expect(sql).toContain('Новая');
    expect(notes.some((note) => note.includes('ENUM'))).toBe(true);
  });

  it('переводит TINYINT(1) в INTEGER', () => {
    expect(adapt('is_active TINYINT(1) DEFAULT 0').sql).toContain('INTEGER');
  });

  it('не выдумывает замен там, где диалекты совпадают', () => {
    const sql = 'SELECT a.id, r.title FROM applications a JOIN rooms r ON r.id = a.room_id WHERE a.user_id = 2';
    const result = adapt(sql);

    expect(result.sql).toBe(sql);
    expect(result.notes).toEqual([]);
  });

  it('не дублирует пояснения при нескольких одинаковых заменах', () => {
    const { notes } = adapt('a DATETIME, b DATETIME, c DATETIME');
    const datetimeNotes = notes.filter((note) => note.includes('DATETIME'));

    expect(datetimeNotes).toHaveLength(1);
  });

  it('каждое пояснение читаемо студентом, а не является техническим шумом', () => {
    const { notes } = adapt('CREATE TABLE t (id INT AUTO_INCREMENT PRIMARY KEY, at DATETIME) ENGINE=InnoDB;');

    expect(notes.length).toBeGreaterThanOrEqual(3);
    for (const note of notes) {
      // Каждое пояснение либо показывает замену стрелкой, либо объясняет,
      // что и почему убрано. Голых имён конструкций быть не должно.
      expect(note).toMatch(/→|убрано/);
      expect(note.length).toBeGreaterThan(10);
    }
  });

  it('не падает на пустом вводе', () => {
    expect(adapt('').sql).toBe('');
    expect(adapt('').notes).toEqual([]);
  });
});
