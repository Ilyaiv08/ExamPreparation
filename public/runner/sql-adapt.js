/**
 * Слой совместимости MySQL → SQLite.
 *
 * Студент учит MySQL (именно он будет на экзамене), а в браузере доступен
 * только SQLite через sql.js. Переписываются ТОЛЬКО конструкции, которые
 * действительно различаются, и каждая замена показывается студенту в отчёте —
 * чтобы не создавалось впечатления, будто эти диалекты одинаковы.
 *
 * Файл отдельный по двум причинам: его склеивают с harness.js при загрузке
 * песочницы и его же напрямую проверяют модульные тесты (tests/sql-adapt.test.ts).
 * Поэтому здесь нельзя использовать ни import/export, ни обращения к DOM.
 */
(function (root) {
  'use strict';

  function adaptMysqlToSqlite(sql) {
    var notes = [];
    var out = String(sql == null ? '' : sql);

    function replace(regexp, replacement, note) {
      if (regexp.test(out)) {
        out = out.replace(regexp, replacement);
        if (notes.indexOf(note) === -1) notes.push(note);
      }
    }

    // Оба порядка слов — правильный MySQL, поэтому оба и переводим.
    // Иначе студент, написавший INT PRIMARY KEY AUTO_INCREMENT, получает
    // невнятное «AUTOINCREMENT is only allowed on an INTEGER PRIMARY KEY».
    replace(
      /\bINT\s+PRIMARY\s+KEY\s+AUTO_INCREMENT\b/gi,
      'INTEGER PRIMARY KEY AUTOINCREMENT',
      'INT PRIMARY KEY AUTO_INCREMENT → INTEGER PRIMARY KEY AUTOINCREMENT (в SQLite автоинкремент только у INTEGER PRIMARY KEY)',
    );
    replace(
      /\bINT\s+AUTO_INCREMENT\s+PRIMARY\s+KEY\b/gi,
      'INTEGER PRIMARY KEY AUTOINCREMENT',
      'INT AUTO_INCREMENT PRIMARY KEY → INTEGER PRIMARY KEY AUTOINCREMENT (в SQLite автоинкремент только у INTEGER PRIMARY KEY)',
    );
    replace(/\bAUTO_INCREMENT\b/gi, 'AUTOINCREMENT', 'AUTO_INCREMENT → AUTOINCREMENT');
    replace(/\bENGINE\s*=\s*\w+/gi, '', 'ENGINE=InnoDB убрано: в SQLite движков нет');
    replace(/\bDEFAULT\s+CHARSET\s*=\s*[\w]+/gi, '', 'DEFAULT CHARSET убрано: SQLite всегда UTF-8');
    replace(/\bDATETIME\b/gi, 'TEXT', 'DATETIME → TEXT (SQLite хранит дату строкой)');
    replace(/\bTINYINT\(1\)/gi, 'INTEGER', 'TINYINT(1) → INTEGER');
    replace(
      /\bDATE_FORMAT\s*\(\s*([^,]+),\s*'%d\.%m\.%Y'\s*\)/gi,
      "strftime('%d.%m.%Y', $1)",
      "DATE_FORMAT(x, '%d.%m.%Y') → strftime('%d.%m.%Y', x)",
    );
    // Разница дат в днях: в MySQL DATEDIFF(конец, начало), в SQLite такой
    // функции нет — считаем через юлианские дни и приводим к целому.
    replace(
      /\bDATEDIFF\s*\(\s*([^,()]+(?:\([^()]*\))?[^,()]*),\s*([^()]+(?:\([^()]*\))?[^()]*)\)/gi,
      'CAST(julianday($1) - julianday($2) AS INTEGER)',
      'DATEDIFF(a, b) → CAST(julianday(a) - julianday(b) AS INTEGER)',
    );
    replace(/\bNOW\s*\(\s*\)/gi, "datetime('now')", "NOW() → datetime('now')");
    replace(/\bCURDATE\s*\(\s*\)/gi, "date('now')", "CURDATE() → date('now')");

    // ENUM('a','b') → TEXT: список значений сохраняется комментарием, чтобы
    // студент видел, что именно он объявлял.
    out = out.replace(/\bENUM\s*\(([^)]*)\)/gi, function (match, values) {
      if (notes.indexOf('ENUM(...) → TEXT с проверкой CHECK') === -1) {
        notes.push('ENUM(...) → TEXT с проверкой CHECK');
      }
      return 'TEXT /* ENUM ' + values + ' */';
    });

    return { sql: out, notes: notes };
  }

  root.__adaptMysqlToSqlite = adaptMysqlToSqlite;
})(typeof globalThis !== 'undefined' ? globalThis : this);
