import type { Task } from '../types';

/**
 * Месяц 4: практика для дней, у которых её не было.
 *
 * SQL исполняется по-настоящему — в SQLite, собранном в WebAssembly.
 * Express и MySQL в браузере не запустить, поэтому серверные дни проверяют
 * то, что действительно можно проверить: саму логику маршрута, порядок
 * проверок и правила доступа. Зависимости передаются параметрами —
 * ровно так их подменяют в настоящих тестах.
 */

/** База «Конференции.РФ» — та же, что в остальных заданиях месяца. */
const SETUP_CONFERENCE = `
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  login TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL
);

CREATE TABLE rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL UNIQUE
);

CREATE TABLE applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  room_id INTEGER NOT NULL REFERENCES rooms(id),
  start_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Новая'
);

INSERT INTO users (id, login, full_name, phone, email) VALUES
  (1, 'ivanov26', 'Иванов Иван Иванович', '+79990000001', 'ivanov@example.com'),
  (2, 'petrov26', 'Петров Пётр Петрович', '+79990000002', 'petrov@example.com');

INSERT INTO rooms (id, title) VALUES (1, 'Аудитория'), (2, 'Коворкинг'), (3, 'Кинозал');

INSERT INTO applications (id, user_id, room_id, start_date, status) VALUES
  (1, 1, 2, '2027-03-12', 'Новая'),
  (2, 1, 3, '2027-03-28', 'Мероприятие назначено'),
  (3, 2, 1, '2027-02-05', 'Мероприятие завершено'),
  (4, 2, 2, '2027-04-19', 'Новая'),
  (5, 1, 1, '2026-12-30', 'Мероприятие завершено');
`;

export const MONTH_04_DAILY_TASKS: Task[] = [
  {
    id: 'task-db-column-types',
    title: 'Типы столбцов: почему телефон — это текст',
    kind: 'db',
    runtime: 'sql',
    difficulty: 2,
    tech: ['sql'],
    topicIds: ['db-relational', 'db-types'],
    monthNo: 4,
    weekNo: 13,
    statement: `Каждому столбцу выбирают вид данных. Ошибка здесь не заметна сразу, зато вылезает на защите: телефон теряет плюс и ведущие нули, цена округляется, дата сортируется как попало.

Создайте две таблицы.

**\`rooms\`** — справочник помещений:

- \`id\` — целое, первичный ключ, заполняется само;
- \`title\` — текст, обязательный, уникальный;
- \`capacity\` — целое, обязательное (сколько человек помещается);
- \`price_per_hour\` — дробное с двумя знаками после запятой, обязательное;
- \`description\` — текст, необязательный.

**\`users\`**:

- \`id\` — целое, первичный ключ, заполняется само;
- \`login\` — текст, обязательный, уникальный;
- \`phone\` — **текст**, обязательный. Не число: номер начинается с плюса, содержит скобки и дефисы, а ведущий ноль число потеряет;
- \`birth_date\` — дата, необязательная.

Затем добавьте по одной записи: помещение «Коворкинг» на 20 человек по 1500.50 в час и пользователя \`ivanov26\` с телефоном \`+7 (900) 123-45-67\`.`,
    requirements: [
      'Таблица rooms создана со всеми пятью столбцами',
      'Таблица users создана со всеми четырьмя столбцами',
      'Первичные ключи заполняются автоматически',
      'Телефон хранится текстом и не теряет символы',
      'Цена хранит копейки',
      'Добавлены по одной записи в каждую таблицу',
    ],
    starterCode: `-- Справочник помещений
CREATE TABLE rooms (
  -- ваш код
);

-- Пользователи
CREATE TABLE users (
  -- ваш код
);

-- По одной записи в каждую таблицу
`,
    tests: [
      {
        id: 'rooms-schema',
        name: 'Структура таблицы помещений',
        type: 'sql-schema',
        table: 'rooms',
        columns: [
          { name: 'id', pk: true },
          { name: 'title', notNull: true },
          { name: 'capacity', notNull: true },
          { name: 'price_per_hour', notNull: true },
          { name: 'description' },
        ],
        points: 4,
      },
      {
        id: 'users-schema',
        name: 'Структура таблицы пользователей',
        type: 'sql-schema',
        table: 'users',
        columns: [
          { name: 'id', pk: true },
          { name: 'login', notNull: true },
          { name: 'phone', notNull: true },
          { name: 'birth_date' },
        ],
        points: 3,
      },
      {
        id: 'unique-title',
        name: 'Название помещения уникально',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM pragma_index_list('rooms') WHERE "unique" = 1`,
        expectedRows: [[1]],
        points: 2,
      },
      {
        id: 'phone-kept',
        name: 'Телефон сохранился целиком',
        type: 'sql-query',
        check: `SELECT phone FROM users WHERE login = 'ivanov26'`,
        expectedRows: [['+7 (900) 123-45-67']],
        points: 4,
      },
      {
        id: 'price-kept',
        name: 'Цена сохранила копейки',
        type: 'sql-query',
        check: `SELECT capacity, price_per_hour FROM rooms WHERE title = 'Коворкинг'`,
        expectedRows: [[20, 1500.5]],
        points: 4,
      },
      {
        id: 'autoincrement',
        name: 'Номера присваиваются автоматически',
        type: 'sql-query',
        check: `SELECT id FROM rooms WHERE title = 'Коворкинг'`,
        expectedRows: [[1]],
        points: 2,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Автоматический номер в MySQL — INT PRIMARY KEY AUTO_INCREMENT. Песочница сама переведёт это в вид, понятный SQLite, и покажет замену.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Для цены нужен DECIMAL(10,2): два знака после запятой. Тип FLOAT для денег не годится — он хранит приблизительное значение.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'CREATE TABLE rooms (id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(100) NOT NULL UNIQUE, capacity INT NOT NULL, price_per_hour DECIMAL(10,2) NOT NULL, description TEXT);',
        penaltyPercent: 35,
      },
    ],
    solution: `CREATE TABLE rooms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL UNIQUE,
  capacity INT NOT NULL,
  price_per_hour DECIMAL(10,2) NOT NULL,
  description TEXT
);

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  login VARCHAR(50) NOT NULL UNIQUE,
  phone VARCHAR(30) NOT NULL,
  birth_date DATE
);

INSERT INTO rooms (title, capacity, price_per_hour, description)
VALUES ('Коворкинг', 20, 1500.50, 'Двадцать рабочих мест и переговорная');

INSERT INTO users (login, phone, birth_date)
VALUES ('ivanov26', '+7 (900) 123-45-67', '2005-04-12');`,
    solutionExplanation:
      'Телефон текстовый по трём причинам сразу: плюс, скобки и дефисы — не цифры; номер 8-900-... начинается с восьмёрки, а номер вида 007... потеряет ведущие нули; с телефоном не производят арифметику, а значит числовой тип не даёт ничего. Цена в DECIMAL, а не FLOAT: FLOAT хранит приближение, и сумма трёх заявок по 1500.50 может дать 4501.4999999. Дата отдельным типом, а не строкой, — тогда сравнения и сортировка работают как даты, а не как набор символов.',
    maxScore: 19,
    estimatedMinutes: 25,
    examRefs: ['m1-db', 'm3-db'],
    planDays: ['day-13-1'],
    source: 'plan',
  },

  {
    id: 'task-db-relations-fk',
    title: 'Связи таблиц: одна ссылка вместо списка через запятую',
    kind: 'db',
    runtime: 'sql',
    difficulty: 3,
    tech: ['sql'],
    topicIds: ['db-relations', 'db-normalization'],
    monthNo: 4,
    weekNo: 13,
    statement: `У одного пользователя много заявок. Соблазн записать их в одну ячейку строкой «1, 4, 7» велик, но такую базу нельзя ни отфильтровать, ни соединить: СУБД видит там текст, а не три номера.

Правило простое: ссылка ставится **на стороне «много»**. У заявки один владелец — значит, номер пользователя хранится в заявке.

Создайте три таблицы:

**\`users\`** — \`id\` (первичный ключ), \`login\` (обязательный, уникальный).

**\`applications\`** — \`id\`, \`user_id\` (обязательный, внешний ключ на \`users\`), \`start_date\` (обязательная), \`status\` (по умолчанию \`'Новая'\`).

**\`reviews\`** — \`id\`, \`application_id\` (обязательный, внешний ключ на \`applications\`, **уникальный**: отзыв на заявку может быть только один), \`text\` (обязательный).

Затем добавьте: одного пользователя, две его заявки и один отзыв ко второй заявке.`,
    requirements: [
      'Три таблицы с первичными ключами',
      'В заявке есть внешний ключ на пользователя',
      'В отзыве есть внешний ключ на заявку',
      'Один отзыв на заявку: application_id уникален',
      'У статуса значение по умолчанию «Новая»',
      'Добавлены пользователь, две заявки и отзыв',
    ],
    starterCode: `CREATE TABLE users (
  -- ваш код
);

CREATE TABLE applications (
  -- ваш код
);

CREATE TABLE reviews (
  -- ваш код
);

-- Пользователь, две его заявки и отзыв ко второй
`,
    tests: [
      {
        id: 'users',
        name: 'Таблица пользователей',
        type: 'sql-schema',
        table: 'users',
        columns: [
          { name: 'id', pk: true },
          { name: 'login', notNull: true },
        ],
        points: 2,
      },
      {
        id: 'applications',
        name: 'Заявка ссылается на пользователя',
        type: 'sql-schema',
        table: 'applications',
        columns: [
          { name: 'id', pk: true },
          { name: 'user_id', notNull: true },
          { name: 'start_date', notNull: true },
          { name: 'status', notNull: true },
        ],
        foreignKeys: [{ column: 'user_id', refTable: 'users' }],
        points: 4,
      },
      {
        id: 'reviews',
        name: 'Отзыв ссылается на заявку',
        type: 'sql-schema',
        table: 'reviews',
        columns: [
          { name: 'id', pk: true },
          { name: 'application_id', notNull: true },
          { name: 'text', notNull: true },
        ],
        foreignKeys: [{ column: 'application_id', refTable: 'applications' }],
        points: 4,
      },
      {
        id: 'one-review',
        name: 'Отзыв на заявку только один',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM pragma_index_list('reviews') WHERE "unique" = 1`,
        expectedRows: [[1]],
        points: 3,
      },
      {
        id: 'default-status',
        name: 'Статус по умолчанию «Новая»',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM applications WHERE status = 'Новая'`,
        expectedRows: [[2]],
        points: 3,
      },
      {
        id: 'link-works',
        name: 'Связь действительно работает',
        type: 'sql-query',
        check: `SELECT u.login, COUNT(a.id) FROM users u JOIN applications a ON a.user_id = u.id GROUP BY u.login`,
        expectedRows: [['ivanov26', 2]],
        points: 4,
      },
      {
        id: 'review-link',
        name: 'Отзыв привязан ко второй заявке',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM reviews r JOIN applications a ON a.id = r.application_id`,
        expectedRows: [[1]],
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Внешний ключ пишется отдельной строкой в конце описания таблицы: FOREIGN KEY (user_id) REFERENCES users(id).',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Порядок создания важен: сначала таблица, на которую ссылаются, потом та, что ссылается. Иначе ссылаться будет не на что.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'В reviews: application_id INT NOT NULL UNIQUE, FOREIGN KEY (application_id) REFERENCES applications(id). Слово UNIQUE и делает связь «один к одному».',
        penaltyPercent: 35,
      },
    ],
    solution: `CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  login VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  start_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Новая',
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  application_id INT NOT NULL UNIQUE,
  text TEXT NOT NULL,
  FOREIGN KEY (application_id) REFERENCES applications(id)
);

INSERT INTO users (id, login) VALUES (1, 'ivanov26');

INSERT INTO applications (id, user_id, start_date) VALUES
  (1, 1, '2027-03-12'),
  (2, 1, '2027-03-28');

INSERT INTO reviews (application_id, text) VALUES (2, 'Всё прошло отлично');`,
    solutionExplanation:
      'Заявки добавлены без указания статуса — и обе получили «Новая» из значения по умолчанию. Это и проверяет предпоследний тест: если бы DEFAULT не было, в столбце оказался бы NULL. Разница между связями видна по одному слову: у applications.user_id ограничения уникальности нет, поэтому заявок у пользователя много; у reviews.application_id оно есть, поэтому отзыв ровно один. Так «один ко многим» и «один к одному» записываются в схеме.',
    maxScore: 23,
    estimatedMinutes: 30,
    examRefs: ['m1-db', 'm1-er', 'm3-db'],
    planDays: ['day-13-2'],
    source: 'plan',
  },

  {
    id: 'task-db-er-diagram',
    title: 'ER-диаграмма: описать связи и их вид',
    kind: 'output',
    runtime: 'dom',
    difficulty: 2,
    tech: ['sql', 'html'],
    topicIds: ['db-er-diagram'],
    monthNo: 4,
    weekNo: 13,
    statement: `ER-диаграмма — требование модуля 1 отдельным пунктом. Прежде чем рисовать её в программе, связи нужно проговорить словами: что с чем связано и сколько записей соответствует одной.

База «Конференции.РФ» состоит из таблиц \`users\`, \`rooms\`, \`payment_methods\`, \`applications\`, \`reviews\`.

Опишите в таблице \`#relations\` четыре связи. Каждая строка — \`<tr>\` с тремя атрибутами:

- \`data-from\` — таблица, откуда идёт связь (сторона «один»);
- \`data-to\` — таблица, куда идёт (сторона «много»);
- \`data-type\` — вид связи: \`1:N\` или \`1:1\`.

Нужные связи:

1. у пользователя много заявок;
2. на одно помещение много заявок;
3. одним способом оплаты оплачено много заявок;
4. у заявки ровно один отзыв.

В ячейках строки напишите словами, что означает связь — это пригодится на защите.`,
    requirements: [
      'В таблице #relations ровно четыре строки',
      'У каждой строки есть data-from, data-to и data-type',
      'Три связи «один ко многим» описаны верно',
      'Связь «отзыв — заявка» помечена как 1:1',
      'В каждой строке есть пояснение словами',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Связи базы «Конференции.РФ»</title>
</head>
<body>
  <h1>Связи базы данных</h1>

  <table id="relations">
    <thead>
      <tr>
        <th>Откуда</th>
        <th>Куда</th>
        <th>Вид</th>
        <th>Что это значит</th>
      </tr>
    </thead>
    <tbody>
      <!-- четыре строки со связями -->
    </tbody>
  </table>
</body>
</html>`,
    viewport: { width: 800, height: 500 },
    tests: [
      {
        id: 'four-rows',
        name: 'Описаны четыре связи',
        type: 'dom',
        code: `const rows = ctx.$$('#relations tbody tr');
ctx.assert(rows.length === 4, 'Связей должно быть четыре, найдено: ' + rows.length, 4, rows.length);`,
        points: 2,
      },
      {
        id: 'attributes',
        name: 'У каждой связи указаны стороны и вид',
        type: 'dom',
        code: `const rows = ctx.$$('#relations tbody tr');
rows.forEach((row, index) => {
  ['from', 'to', 'type'].forEach((key) => {
    const value = row.dataset[key];
    ctx.assert(value && value.length > 0, 'В строке ' + (index + 1) + ' не задан data-' + key);
  });
  ctx.assert(
    row.dataset.type === '1:N' || row.dataset.type === '1:1',
    'В строке ' + (index + 1) + ' вид связи должен быть 1:N или 1:1, сейчас: ' + row.dataset.type,
  );
});`,
        points: 3,
      },
      {
        id: 'one-to-many',
        name: 'Три связи «один ко многим» на месте',
        type: 'dom',
        code: `const rows = ctx.$$('#relations tbody tr');
const found = rows.map((row) => row.dataset.from + '->' + row.dataset.to + ':' + row.dataset.type);
[
  'users->applications:1:N',
  'rooms->applications:1:N',
  'payment_methods->applications:1:N',
].forEach((expected) => {
  ctx.assert(
    found.indexOf(expected) !== -1,
    'Не описана связь ' + expected + '. Ссылка идёт от стороны «один» к стороне «много». Сейчас описаны: ' + found.join(' | '),
  );
});`,
        points: 5,
      },
      {
        id: 'one-to-one',
        name: 'Отзыв связан с заявкой как один к одному',
        type: 'dom',
        code: `const rows = ctx.$$('#relations tbody tr');
const review = rows.filter((row) => row.dataset.to === 'reviews' || row.dataset.from === 'reviews')[0];
ctx.assert(review, 'Связь с таблицей reviews не описана');
ctx.assert(
  review.dataset.type === '1:1',
  'У заявки может быть только один отзыв, значит вид связи 1:1, сейчас: ' + review.dataset.type,
  '1:1',
  review.dataset.type,
);
ctx.assert(
  review.dataset.from === 'applications' && review.dataset.to === 'reviews',
  'Связь описывается от applications к reviews, сейчас: ' + review.dataset.from + ' -> ' + review.dataset.to,
);`,
        points: 4,
      },
      {
        id: 'explanations',
        name: 'Каждая связь объяснена словами',
        type: 'dom',
        code: `const rows = ctx.$$('#relations tbody tr');
rows.forEach((row, index) => {
  const cells = ctx.$$('td', row);
  ctx.assert(cells.length >= 4, 'В строке ' + (index + 1) + ' должно быть четыре ячейки, найдено: ' + cells.length);
  const explanation = cells[3].textContent.trim();
  ctx.assert(
    explanation.length >= 15,
    'В строке ' + (index + 1) + ' пояснение слишком короткое: «' + explanation + '». На защите его придётся произнести вслух',
  );
});`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Сторона «один» — та таблица, на которую ссылаются. Сторона «много» — та, в которой лежит внешний ключ.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Вид связи определяется по ограничению: если внешний ключ уникален — 1:1, если нет — 1:N.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: '<tr data-from="users" data-to="applications" data-type="1:N"><td>users</td><td>applications</td><td>1:N</td><td>Один пользователь может подать много заявок</td></tr>',
        penaltyPercent: 35,
      },
    ],
    solution: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Связи базы «Конференции.РФ»</title>
</head>
<body>
  <h1>Связи базы данных</h1>

  <table id="relations">
    <thead>
      <tr>
        <th>Откуда</th>
        <th>Куда</th>
        <th>Вид</th>
        <th>Что это значит</th>
      </tr>
    </thead>
    <tbody>
      <tr data-from="users" data-to="applications" data-type="1:N">
        <td>users</td>
        <td>applications</td>
        <td>1:N</td>
        <td>Один пользователь подаёт много заявок, у заявки один владелец</td>
      </tr>
      <tr data-from="rooms" data-to="applications" data-type="1:N">
        <td>rooms</td>
        <td>applications</td>
        <td>1:N</td>
        <td>Одно помещение бронируют много раз, в заявке указано одно помещение</td>
      </tr>
      <tr data-from="payment_methods" data-to="applications" data-type="1:N">
        <td>payment_methods</td>
        <td>applications</td>
        <td>1:N</td>
        <td>Одним способом оплаты оплачено много заявок, у заявки один способ</td>
      </tr>
      <tr data-from="applications" data-to="reviews" data-type="1:1">
        <td>applications</td>
        <td>reviews</td>
        <td>1:1</td>
        <td>У заявки не больше одного отзыва, отзыв относится к одной заявке</td>
      </tr>
    </tbody>
  </table>
</body>
</html>`,
    solutionExplanation:
      'Все три справочника связаны с заявками одинаково, и это не совпадение: справочник на то и справочник, чтобы на него много раз ссылались. Отсюда практический вывод для экзамена — увидев в задании «выпадающий список», сразу заводите под него отдельную таблицу-справочник, а в заявке храните только номер. Отзыв отличается только уникальностью внешнего ключа, поэтому в схеме разница между 1:N и 1:1 — ровно одно слово UNIQUE.',
    maxScore: 17,
    estimatedMinutes: 20,
    examRefs: ['m1-er', 'm1-db'],
    planDays: ['day-13-3'],
    source: 'plan',
  },

  {
    id: 'task-sql-dates-and-login',
    title: 'Даты в запросах и проверка занятого логина',
    kind: 'db',
    runtime: 'sql',
    difficulty: 3,
    tech: ['sql'],
    topicIds: ['sql-dates'],
    monthNo: 4,
    weekNo: 14,
    statement: `Два запроса, которые точно понадобятся на экзамене.

**Дата в привычном виде.** В базе дата хранится как \`2027-03-12\`, а показывать нужно \`12.03.2027\`. Преобразование делает сам запрос.

**Свободен ли логин.** При регистрации нужно одним запросом узнать, занят ли логин, — и получить ответ даже когда такого логина нет.

Напишите три запроса подряд. Проверяется результат каждого.

1. Заявки с датой в формате ДД.ММ.ГГГГ: столбцы \`id\` и \`start_date_ru\`, по возрастанию \`id\`.
2. Сколько пользователей с логином \`petrov26\`: один столбец \`taken\`. Для свободного логина запрос обязан вернуть строку со значением \`0\`, а не пустой результат.
3. Заявки марта 2027 года: столбцы \`id\` и \`start_date\`, по возрастанию \`id\`.`,
    requirements: [
      'Первый запрос выводит дату как ДД.ММ.ГГГГ',
      'Второй запрос возвращает количество, а не список',
      'Для свободного логина возвращается 0, а не пустой результат',
      'Третий запрос отбирает заявки нужного месяца',
    ],
    setupSql: SETUP_CONFERENCE,
    starterCode: `-- 1. Заявки с датой в формате ДД.ММ.ГГГГ


-- 2. Занят ли логин petrov26


-- 3. Заявки марта 2027 года

`,
    tests: [
      {
        id: 'dates',
        name: 'Дата выводится как ДД.ММ.ГГГГ',
        type: 'sql-query',
        check: `SELECT id, start_date_ru FROM (SELECT id, printf('%s.%s.%s', substr(start_date, 9, 2), substr(start_date, 6, 2), substr(start_date, 1, 4)) AS start_date_ru FROM applications) ORDER BY id`,
        expectedColumns: ['id', 'start_date_ru'],
        expectedRows: [
          [1, '12.03.2027'],
          [2, '28.03.2027'],
          [3, '05.02.2027'],
          [4, '19.04.2027'],
          [5, '30.12.2026'],
        ],
        ordered: true,
        points: 5,
      },
      {
        id: 'login-taken',
        name: 'Занятый логин найден',
        type: 'sql-query',
        check: `SELECT COUNT(*) AS taken FROM users WHERE login = 'petrov26'`,
        expectedColumns: ['taken'],
        expectedRows: [[1]],
        points: 4,
      },
      {
        id: 'login-free',
        name: 'Свободный логин даёт ноль, а не пустоту',
        type: 'sql-query',
        check: `SELECT COUNT(*) AS taken FROM users WHERE login = 'sidorov26'`,
        expectedColumns: ['taken'],
        expectedRows: [[0]],
        points: 4,
      },
      {
        id: 'march',
        name: 'Заявки марта отобраны',
        type: 'sql-query',
        check: `SELECT id, start_date FROM applications WHERE start_date >= '2027-03-01' AND start_date < '2027-04-01' ORDER BY id`,
        expectedColumns: ['id', 'start_date'],
        expectedRows: [
          [1, '2027-03-12'],
          [2, '2027-03-28'],
        ],
        ordered: true,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'В MySQL дату форматируют функцией DATE_FORMAT(start_date, "%d.%m.%Y"). Песочница переведёт её сама и покажет замену во вкладке результатов.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'COUNT(*) без GROUP BY всегда возвращает ровно одну строку — даже когда подходящих записей нет. Именно поэтому для проверки логина берут его, а не SELECT id.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'SELECT id, DATE_FORMAT(start_date, "%d.%m.%Y") AS start_date_ru FROM applications ORDER BY id; и SELECT COUNT(*) AS taken FROM users WHERE login = "petrov26";',
        penaltyPercent: 35,
      },
    ],
    solution: `SELECT id, DATE_FORMAT(start_date, '%d.%m.%Y') AS start_date_ru
FROM applications
ORDER BY id;

SELECT COUNT(*) AS taken
FROM users
WHERE login = 'petrov26';

SELECT id, start_date
FROM applications
WHERE start_date >= '2027-03-01' AND start_date < '2027-04-01'
ORDER BY id;`,
    solutionExplanation:
      'Проверка логина через COUNT(*) — приём, который экономит целую ветку кода на сервере. Запрос SELECT id FROM users WHERE login = … при свободном логине вернёт пустой список, и серверу придётся отличать «нет строк» от «ошибка». COUNT(*) всегда возвращает одну строку с числом, и проверка сводится к сравнению с нулём. Диапазон дат задан двумя границами, а не функцией извлечения месяца: сравнение по границам умеет пользоваться индексом, а вызов функции над столбцом — нет.',
    maxScore: 18,
    estimatedMinutes: 25,
    examRefs: ['m1-register', 'm2-order-form', 'm1-cabinet'],
    planDays: ['day-14-3'],
    source: 'plan',
  },

  {
    id: 'task-db-dump-restore',
    title: 'Файл базы: схема и данные, которые можно восстановить',
    kind: 'db',
    runtime: 'sql',
    difficulty: 3,
    tech: ['sql'],
    topicIds: ['db-dump'],
    monthNo: 4,
    weekNo: 14,
    statement: `На экзамене базу сдают файлом: проверяющий должен развернуть её у себя одной командой. Такой файл — это обычный текст с командами создания таблиц и добавления данных.

Напишите содержимое файла \`schema.sql\` для «Конференции.РФ» — так, чтобы из пустой базы получилась рабочая.

1. Таблицы \`users\`, \`rooms\`, \`applications\` со связями (заявка ссылается на пользователя и помещение).
2. Справочник помещений заполнен тремя записями: «Аудитория», «Коворкинг», «Кинозал».
3. Два пользователя и три заявки — чтобы проверяющий сразу видел работающие данные, а не пустые таблицы.
4. Порядок команд должен позволять выполнить файл целиком с первого раза: сначала таблицы без ссылок, потом ссылающиеся, потом данные в том же порядке.

Именно последний пункт чаще всего и ломается: файл, выгруженный как попало, при восстановлении падает на первой же ссылке.`,
    requirements: [
      'Созданы три таблицы со связями',
      'Справочник помещений заполнен тремя записями',
      'Добавлены два пользователя',
      'Добавлены три заявки со ссылками на существующие записи',
      'Файл выполняется целиком без ошибок порядка',
    ],
    starterCode: `-- schema.sql: структура и данные базы «Конференции.РФ»

-- 1. Таблицы


-- 2. Справочник помещений


-- 3. Пользователи и заявки

`,
    tests: [
      {
        id: 'tables',
        name: 'Таблицы созданы',
        type: 'sql-query',
        check: `SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('users', 'rooms', 'applications') ORDER BY name`,
        expectedRows: [['applications'], ['rooms'], ['users']],
        ordered: true,
        points: 4,
      },
      {
        id: 'fk',
        name: 'Заявка связана с пользователем и помещением',
        type: 'sql-schema',
        table: 'applications',
        columns: [
          { name: 'id', pk: true },
          { name: 'user_id', notNull: true },
          { name: 'room_id', notNull: true },
        ],
        foreignKeys: [
          { column: 'user_id', refTable: 'users' },
          { column: 'room_id', refTable: 'rooms' },
        ],
        points: 4,
      },
      {
        id: 'rooms-data',
        name: 'Справочник помещений заполнен',
        type: 'sql-query',
        check: `SELECT title FROM rooms ORDER BY title`,
        expectedRows: [['Аудитория'], ['Кинозал'], ['Коворкинг']],
        ordered: true,
        points: 4,
      },
      {
        id: 'users-data',
        name: 'Пользователи добавлены',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM users`,
        expectedRows: [[2]],
        points: 3,
      },
      {
        id: 'applications-data',
        name: 'Заявки добавлены и ссылки не висят',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM applications a JOIN users u ON u.id = a.user_id JOIN rooms r ON r.id = a.room_id`,
        expectedRows: [[3]],
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Порядок такой же, как при проектировании: сначала справочники и пользователи, потом заявки. Ссылаться можно только на то, что уже существует.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Номера в INSERT указывайте явно (id, …) VALUES (1, …) — тогда ссылки в заявках заведомо совпадут с существующими записями.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'INSERT INTO rooms (id, title) VALUES (1, "Аудитория"), (2, "Коворкинг"), (3, "Кинозал"); — одной командой можно добавить сразу несколько строк.',
        penaltyPercent: 35,
      },
    ],
    solution: `-- schema.sql: структура и данные базы «Конференции.РФ»

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  login VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL
);

CREATE TABLE rooms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  start_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Новая',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

INSERT INTO rooms (id, title) VALUES
  (1, 'Аудитория'),
  (2, 'Коворкинг'),
  (3, 'Кинозал');

INSERT INTO users (id, login, full_name) VALUES
  (1, 'ivanov26', 'Иванов Иван Иванович'),
  (2, 'petrov26', 'Петров Пётр Петрович');

INSERT INTO applications (id, user_id, room_id, start_date, status) VALUES
  (1, 1, 2, '2027-03-12', 'Новая'),
  (2, 1, 3, '2027-03-28', 'Мероприятие назначено'),
  (3, 2, 1, '2027-02-05', 'Мероприятие завершено');`,
    solutionExplanation:
      'Файл читается сверху вниз, и это определяет весь порядок: таблица, на которую ссылаются, создаётся раньше ссылающейся, а строки справочника добавляются раньше строк, которые на них ссылаются. Номера в INSERT указаны явно — при выгрузке настоящей базы так и происходит, и это единственный способ гарантировать, что заявка №1 попадёт на помещение №2, а не на случайное. Наличие данных в файле — не украшение: проверяющий разворачивает базу и должен сразу увидеть работающее приложение.',
    maxScore: 20,
    estimatedMinutes: 30,
    examRefs: ['m1-db', 'm1-git', 'm3-db'],
    planDays: ['day-14-4'],
    source: 'plan',
  },

  {
    id: 'task-db-universal-skeleton',
    title: 'Универсальный скелет базы на новой теме',
    kind: 'db',
    runtime: 'sql',
    difficulty: 4,
    tech: ['sql'],
    topicIds: ['db-modeling'],
    monthNo: 4,
    weekNo: 14,
    statement: `Сравните схемы разных предметных областей — и увидите один и тот же набор: пользователи, справочник основного ресурса, справочник способов оплаты, заявки, отзывы. Меняются названия, структура остаётся.

Это и есть заготовка, с которой стоит приходить на экзамен: какую бы тему ни выдали, скелет уже в голове.

Постройте базу для темы **«Клининг»** — заказ уборки помещения.

1. \`users\` — \`id\`, \`login\` (обязательный, уникальный), \`full_name\` (обязательный).
2. \`services\` — справочник услуг: \`id\`, \`title\` (обязательный, уникальный), \`price\` (дробное с копейками, обязательное).
3. \`payment_methods\` — \`id\`, \`title\` (обязательный, уникальный).
4. \`orders\` — заказы: \`id\`, \`user_id\`, \`service_id\`, \`payment_id\` (все обязательные внешние ключи), \`order_date\` (обязательная), \`address\` (обязательный), \`status\` (по умолчанию \`'Новый'\`).
5. \`reviews\` — \`id\`, \`order_id\` (обязательный, уникальный внешний ключ), \`rating\` (целое, обязательное), \`text\`.

Заполните справочники: три услуги и два способа оплаты. Добавьте одного пользователя и два его заказа.`,
    requirements: [
      'Пять таблиц созданы со связями',
      'Справочник услуг хранит цену с копейками',
      'У заказа три внешних ключа',
      'Отзыв связан с заказом как один к одному',
      'Справочники заполнены, добавлены пользователь и два заказа',
      'Статус заказа по умолчанию «Новый»',
    ],
    starterCode: `-- Тема «Клининг»: тот же скелет, другие названия

CREATE TABLE users (
  -- ваш код
);

CREATE TABLE services (
  -- ваш код
);

CREATE TABLE payment_methods (
  -- ваш код
);

CREATE TABLE orders (
  -- ваш код
);

CREATE TABLE reviews (
  -- ваш код
);

-- Справочники, пользователь и два заказа
`,
    tests: [
      {
        id: 'services',
        name: 'Справочник услуг',
        type: 'sql-schema',
        table: 'services',
        columns: [
          { name: 'id', pk: true },
          { name: 'title', notNull: true },
          { name: 'price', notNull: true },
        ],
        points: 3,
      },
      {
        id: 'orders',
        name: 'Заказ связан с тремя таблицами',
        type: 'sql-schema',
        table: 'orders',
        columns: [
          { name: 'id', pk: true },
          { name: 'user_id', notNull: true },
          { name: 'service_id', notNull: true },
          { name: 'payment_id', notNull: true },
          { name: 'order_date', notNull: true },
          { name: 'address', notNull: true },
          { name: 'status', notNull: true },
        ],
        foreignKeys: [
          { column: 'user_id', refTable: 'users' },
          { column: 'service_id', refTable: 'services' },
          { column: 'payment_id', refTable: 'payment_methods' },
        ],
        points: 5,
      },
      {
        id: 'reviews',
        name: 'Отзыв привязан к заказу один к одному',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM pragma_index_list('reviews') WHERE "unique" = 1`,
        expectedRows: [[1]],
        points: 3,
      },
      {
        id: 'catalogs',
        name: 'Справочники заполнены',
        type: 'sql-query',
        check: `SELECT (SELECT COUNT(*) FROM services), (SELECT COUNT(*) FROM payment_methods)`,
        expectedRows: [[3, 2]],
        points: 4,
      },
      {
        id: 'price-decimal',
        name: 'Цена хранит копейки',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM services WHERE price <> CAST(price AS INT)`,
        expectedRows: [[1]],
        points: 3,
      },
      {
        id: 'orders-data',
        name: 'Заказы добавлены и ссылки рабочие',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM orders o JOIN users u ON u.id = o.user_id JOIN services s ON s.id = o.service_id JOIN payment_methods p ON p.id = o.payment_id`,
        expectedRows: [[2]],
        points: 5,
      },
      {
        id: 'default-status',
        name: 'Статус по умолчанию «Новый»',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM orders WHERE status = 'Новый'`,
        expectedRows: [[2]],
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Возьмите свою схему «Конференции.РФ» и переименуйте: rooms → services, applications → orders. Добавится только адрес и оценка.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Одна из трёх услуг должна иметь цену с копейками — тогда видно, что тип выбран правильно. Например, 2499.90.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Заказы добавляйте без указания статуса: INSERT INTO orders (user_id, service_id, payment_id, order_date, address) VALUES (…) — значение по умолчанию подставится само.',
        penaltyPercent: 35,
      },
    ],
    solution: `CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  login VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL
);

CREATE TABLE services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE payment_methods (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  service_id INT NOT NULL,
  payment_id INT NOT NULL,
  order_date DATE NOT NULL,
  address VARCHAR(200) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Новый',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (payment_id) REFERENCES payment_methods(id)
);

CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL UNIQUE,
  rating INT NOT NULL,
  text TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

INSERT INTO services (id, title, price) VALUES
  (1, 'Поддерживающая уборка', 2499.90),
  (2, 'Генеральная уборка', 5900.00),
  (3, 'Мытьё окон', 1800.00);

INSERT INTO payment_methods (id, title) VALUES
  (1, 'Наличными'),
  (2, 'Картой');

INSERT INTO users (id, login, full_name) VALUES (1, 'ivanov26', 'Иванов Иван Иванович');

INSERT INTO orders (user_id, service_id, payment_id, order_date, address) VALUES
  (1, 1, 2, '2027-03-12', 'ул. Ленина, 10, кв. 5'),
  (1, 3, 1, '2027-03-28', 'ул. Ленина, 10, кв. 5');`,
    solutionExplanation:
      'Схема отличается от «Конференции.РФ» двумя столбцами: адресом в заказе и оценкой в отзыве. Всё остальное — те же пять таблиц и те же четыре связи. Это и есть смысл упражнения: на экзамене тему объявляют в начале, и время на проектирование уходит не на придумывание структуры, а на подгонку знакомого скелета. Заказы добавлены без столбца status, чтобы сработало значение по умолчанию — так же будет работать и сервер, создавая заявку.',
    maxScore: 26,
    estimatedMinutes: 35,
    examRefs: ['m1-db', 'm1-er', 'm3-db'],
    planDays: ['day-14-6'],
    source: 'plan',
  },

  {
    id: 'task-express-first-route',
    title: 'Первый сервер: адрес, ответ и код состояния',
    kind: 'api',
    runtime: 'js',
    difficulty: 2,
    tech: ['express', 'node'],
    topicIds: ['express-basics'],
    monthNo: 4,
    weekNo: 15,
    statement: `Сервер — программа, которая ждёт запросов и отвечает на них. У каждого ответа есть тело (данные) и код состояния — число, по которому браузер понимает, что произошло.

Напишите три обработчика. Они получают \`(req, res)\` такого же вида, как в настоящем Express: у \`res\` есть \`json(data)\` и \`status(code)\`, причём \`status\` возвращает сам \`res\`, чтобы вызовы можно было соединить в цепочку.

Справочник помещений лежит в массиве \`rooms\`.

1. \`health(req, res)\` — отвечает \`{ status: 'ok' }\`. Код не меняем: по умолчанию это 200.
2. \`getRooms(req, res)\` — отвечает всем списком помещений.
3. \`getRoom(req, res)\` — берёт \`req.params.id\` (это **строка**) и отвечает одним помещением. Если такого нет — код \`404\` и \`{ error: 'Помещение не найдено' }\`.

Ловушка третьего пункта: \`req.params.id\` приходит строкой \`'2'\`, а в массиве \`id\` — число \`2\`. Строгое сравнение их не сведёт.`,
    requirements: [
      'health отвечает { status: "ok" }',
      'getRooms отвечает всем списком',
      'getRoom находит помещение по номеру из адреса',
      'Номер из адреса приводится к числу',
      'Отсутствующее помещение даёт код 404 и понятную ошибку',
    ],
    starterCode: `const rooms = [
  { id: 1, title: 'Аудитория на 100 мест', capacity: 100 },
  { id: 2, title: 'Коворкинг', capacity: 20 },
  { id: 3, title: 'Кинозал', capacity: 50 },
];

function health(req, res) {
  // ваш код
}

function getRooms(req, res) {
  // ваш код
}

function getRoom(req, res) {
  // ваш код
}`,
    tests: [
      {
        id: 'health',
        name: 'Проверка доступности сервера',
        type: 'assert',
        code: `const health = ctx.get('health');
let body = null;
let code = 200;
const res = { json: (data) => { body = data; return res; }, status: (value) => { code = value; return res; } };
health({}, res);
ctx.assert(body && body.status === 'ok', 'Ожидался ответ { status: "ok" }, получено: ' + ctx.preview(body));
ctx.assert(code === 200, 'Код ответа должен остаться 200, сейчас: ' + code, 200, code);`,
        points: 2,
      },
      {
        id: 'rooms',
        name: 'Список помещений',
        type: 'assert',
        code: `const getRooms = ctx.get('getRooms');
let body = null;
const res = { json: (data) => { body = data; return res; }, status: (value) => res };
getRooms({}, res);
ctx.assert(Array.isArray(body), 'Ответ должен быть массивом');
ctx.assert(body.length === 3, 'В ответе должно быть три помещения, получено: ' + body.length, 3, body.length);`,
        points: 3,
      },
      {
        id: 'room-found',
        name: 'Помещение находится по номеру',
        type: 'assert',
        code: `const getRoom = ctx.get('getRoom');
let body = null;
let code = 200;
const res = { json: (data) => { body = data; return res; }, status: (value) => { code = value; return res; } };
getRoom({ params: { id: '2' } }, res);
ctx.assert(body && body.title === 'Коворкинг', 'Ожидался Коворкинг, получено: ' + ctx.preview(body));
ctx.assert(code === 200, 'Для найденного помещения код остаётся 200, сейчас: ' + code);`,
        points: 4,
      },
      {
        id: 'string-id',
        name: 'Номер из адреса приводится к числу',
        type: 'assert',
        code: `const getRoom = ctx.get('getRoom');
let body = null;
const res = { json: (data) => { body = data; return res; }, status: () => res };
getRoom({ params: { id: '3' } }, res);
ctx.assert(
  body && body.id === 3,
  'Помещение №3 не найдено. В адресе номер приходит строкой "3", а в данных лежит число 3 — сравнение === их не сведёт, нужен Number(...)',
);`,
        points: 4,
      },
      {
        id: 'not-found',
        name: 'Отсутствующее помещение даёт 404',
        type: 'assert',
        code: `const getRoom = ctx.get('getRoom');
let body = null;
let code = 200;
const res = { json: (data) => { body = data; return res; }, status: (value) => { code = value; return res; } };
getRoom({ params: { id: '99' } }, res);
ctx.assert(code === 404, 'Для несуществующего помещения код должен быть 404, сейчас: ' + code, 404, code);
ctx.assert(body && typeof body.error === 'string', 'В ответе должно быть поле error с объяснением');
ctx.assert(
  body.error.indexOf('не найдено') !== -1,
  'Текст ошибки должен объяснять, что случилось, сейчас: ' + ctx.preview(body),
);`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'res.status(404).json({...}) — это цепочка: status возвращает сам res, поэтому json вызывается сразу после.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Поиск по номеру: rooms.find((room) => room.id === Number(req.params.id)). Без Number сравнение строки и числа всегда даст false.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'function getRoom(req, res) { const room = rooms.find((item) => item.id === Number(req.params.id)); if (!room) return res.status(404).json({ error: "Помещение не найдено" }); return res.json(room); }',
        penaltyPercent: 35,
      },
    ],
    solution: `const rooms = [
  { id: 1, title: 'Аудитория на 100 мест', capacity: 100 },
  { id: 2, title: 'Коворкинг', capacity: 20 },
  { id: 3, title: 'Кинозал', capacity: 50 },
];

function health(req, res) {
  return res.json({ status: 'ok' });
}

function getRooms(req, res) {
  return res.json(rooms);
}

function getRoom(req, res) {
  const room = rooms.find((item) => item.id === Number(req.params.id));

  if (!room) {
    return res.status(404).json({ error: 'Помещение не найдено' });
  }

  return res.json(room);
}`,
    solutionExplanation:
      'Ранний возврат с ошибкой — основной приём в обработчиках: сначала отсекаем всё неправильное, потом пишем основной случай без вложенных условий. Слово return перед res.status(...) обязательно: без него выполнение пойдёт дальше и сервер попытается ответить второй раз, а это уже ошибка «headers already sent». Код 404 означает «такого адреса или объекта нет» — отвечать двухсотым кодом с текстом «не найдено» нельзя, клиент решит, что всё хорошо.',
    maxScore: 18,
    estimatedMinutes: 25,
    examRefs: ['m1-cabinet', 'm3-framework'],
    planDays: ['day-15-1'],
    source: 'plan',
  },

  {
    id: 'task-express-proxy-cors',
    title: 'React и сервер на разных портах: прокси и заголовки',
    kind: 'api',
    runtime: 'js',
    difficulty: 3,
    tech: ['express', 'node'],
    topicIds: ['express-proxy'],
    monthNo: 4,
    weekNo: 15,
    statement: `Страница React работает на порту 5173, сервер — на 3000. Браузер считает это разными источниками и по умолчанию запрос не пропускает.

Решений два, и оба нужно понимать.

**Прокси при разработке.** Вы обращаетесь на свой же адрес \`/api/...\`, а сборщик незаметно переправляет запрос на сервер. Для браузера источник один, запрет не срабатывает.

1. \`apiUrl(path, config)\` — собирает адрес запроса. \`config\` содержит \`{ mode, serverOrigin }\`. При \`mode: 'development'\` возвращает путь как есть (\`/api/rooms\`), при \`mode: 'production'\` — полный адрес \`serverOrigin + path\`. Лишние косые черты на стыке недопустимы.

**Разрешение на стороне сервера.** Когда прокси нет, сервер сам сообщает браузеру, кому доверяет.

2. \`corsMiddleware(allowedOrigins)\` — возвращает функцию \`(req, res, next)\`. Если \`req.headers.origin\` есть в списке разрешённых, она ставит заголовок \`Access-Control-Allow-Origin\` ровно с этим источником и вызывает \`next()\`. Если источника в списке нет — заголовок не ставится, но \`next()\` всё равно вызывается: запрет накладывает браузер, а не сервер.
3. Отвечать звёздочкой \`*\` нельзя: с ней браузер не отправит куки и заголовок авторизации.`,
    requirements: [
      'apiUrl при разработке возвращает относительный путь',
      'apiUrl в сборке возвращает полный адрес',
      'На стыке адреса и пути нет двойной косой черты',
      'Разрешённый источник получает заголовок со своим адресом',
      'Неразрешённый источник заголовка не получает, но запрос идёт дальше',
      'Звёздочка в заголовке не используется',
    ],
    starterCode: `function apiUrl(path, config) {
  // при разработке — путь как есть, в сборке — полный адрес
}

function corsMiddleware(allowedOrigins) {
  return function (req, res, next) {
    // разрешаем только знакомые источники
  };
}`,
    tests: [
      {
        id: 'dev',
        name: 'При разработке путь остаётся относительным',
        type: 'call',
        entry: 'apiUrl',
        args: ['/api/rooms', { mode: 'development', serverOrigin: 'http://localhost:3000' }],
        expected: '/api/rooms',
        points: 3,
      },
      {
        id: 'prod',
        name: 'В сборке адрес полный',
        type: 'call',
        entry: 'apiUrl',
        args: ['/api/rooms', { mode: 'production', serverOrigin: 'http://localhost:3000' }],
        expected: 'http://localhost:3000/api/rooms',
        points: 3,
      },
      {
        id: 'no-double-slash',
        name: 'Двойной косой черты на стыке нет',
        type: 'call',
        entry: 'apiUrl',
        args: ['/api/rooms', { mode: 'production', serverOrigin: 'http://localhost:3000/' }],
        expected: 'http://localhost:3000/api/rooms',
        points: 4,
      },
      {
        id: 'allowed',
        name: 'Знакомый источник разрешён',
        type: 'assert',
        code: `const corsMiddleware = ctx.get('corsMiddleware');
const middleware = corsMiddleware(['http://localhost:5173']);
const headers = {};
let passed = false;
const res = { setHeader: (name, value) => { headers[name] = value; } };
middleware({ headers: { origin: 'http://localhost:5173' } }, res, () => { passed = true; });
ctx.assert(
  headers['Access-Control-Allow-Origin'] === 'http://localhost:5173',
  'Заголовок должен содержать сам источник, сейчас: ' + ctx.preview(headers['Access-Control-Allow-Origin']),
);
ctx.assert(passed, 'Функция next() должна быть вызвана');`,
        points: 5,
      },
      {
        id: 'not-allowed',
        name: 'Чужой источник заголовка не получает',
        type: 'assert',
        code: `const corsMiddleware = ctx.get('corsMiddleware');
const middleware = corsMiddleware(['http://localhost:5173']);
const headers = {};
let passed = false;
const res = { setHeader: (name, value) => { headers[name] = value; } };
middleware({ headers: { origin: 'http://evil.example.com' } }, res, () => { passed = true; });
ctx.assert(
  headers['Access-Control-Allow-Origin'] === undefined,
  'Незнакомому источнику заголовок ставить нельзя, сейчас: ' + headers['Access-Control-Allow-Origin'],
);
ctx.assert(passed, 'next() вызывается в любом случае: запрет накладывает браузер, а не сервер');`,
        points: 5,
      },
      {
        id: 'no-wildcard',
        name: 'Звёздочка не используется',
        type: 'assert',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(
  !/Access-Control-Allow-Origin['"]\\s*,\\s*['"]\\*/.test(source),
  'Со звёздочкой браузер не отправит куки и заголовок авторизации — вход перестанет работать',
);`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Лишнюю косую черту в конце адреса проще всего срезать: serverOrigin.replace(/\\/$/, "").',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'corsMiddleware — функция, возвращающая функцию. Список разрешённых источников она запоминает в замыкании.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const origin = req.headers.origin; if (allowedOrigins.includes(origin)) { res.setHeader("Access-Control-Allow-Origin", origin); } next();',
        penaltyPercent: 35,
      },
    ],
    solution: `function apiUrl(path, config) {
  if (config.mode === 'development') {
    return path;
  }

  const origin = String(config.serverOrigin).replace(/\\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : '/' + path;

  return origin + normalizedPath;
}

function corsMiddleware(allowedOrigins) {
  return function (req, res, next) {
    const origin = req.headers && req.headers.origin;

    if (origin && allowedOrigins.indexOf(origin) !== -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }

    next();
  };
}`,
    solutionExplanation:
      'Заголовок ставится с конкретным источником, а не со звёздочкой, по практической причине: звёздочка запрещает браузеру отправлять куки и заголовок Authorization, а без них вход в систему работать не будет. Заголовок Vary: Origin подсказывает промежуточным кэшам, что ответ зависит от источника — без него закэшированный ответ для одного сайта может уехать другому. Функция next() вызывается всегда: сервер не запрещает запрос, он лишь сообщает браузеру, доверяет ли отправителю, а решение принимает браузер.',
    maxScore: 23,
    estimatedMinutes: 30,
    examRefs: ['m3-framework', 'm3-quality'],
    planDays: ['day-15-3'],
    source: 'plan',
  },

  {
    id: 'task-sql-injection-safe',
    title: 'Сервер и база: почему значения не склеивают в строку',
    kind: 'api',
    runtime: 'js',
    difficulty: 4,
    tech: ['express', 'sql', 'security'],
    topicIds: ['express-mysql'],
    monthNo: 4,
    weekNo: 15,
    statement: `Главная тема дня. Запрос к базе собирают не склейкой строк, а с подстановкой: в тексте запроса ставят знаки вопроса, а значения передают отдельным массивом. Драйвер сам их экранирует.

Почему это важно: если склеить логин в строку, пользователь введёт в обычное поле \`' OR 1=1 --\` и получит чужие данные, а с \`'; DROP TABLE users; --\` — удалит таблицу.

\`db\` — объект с методом \`query(sql, params)\`, возвращающим промис с массивом строк.

1. \`findUserByLogin(db, login)\` — возвращает первого пользователя или \`null\`.
2. \`createApplication(db, data)\` — добавляет заявку с полями \`userId\`, \`roomId\`, \`date\` и возвращает \`{ id }\` из результата вставки (\`result.insertId\`).
3. \`searchRooms(db, text)\` — ищет помещения по части названия. Часть названия подставляется тоже параметром, а не склейкой: сам поиск по образцу опасности не отменяет.

Во всех трёх запросах значения передаются **вторым параметром**. Проверка смотрит именно на это: она подсунет логин с кавычкой и убедится, что он ушёл в параметры, а не в текст запроса.`,
    requirements: [
      'findUserByLogin использует подстановку параметров',
      'Возвращается первый найденный пользователь или null',
      'createApplication передаёт три значения параметрами',
      'createApplication возвращает номер созданной заявки',
      'searchRooms подставляет образец поиска параметром',
      'В тексте запросов нет склейки значений',
    ],
    starterCode: `async function findUserByLogin(db, login) {
  // SELECT с подстановкой параметра
}

async function createApplication(db, data) {
  // INSERT с тремя параметрами
}

async function searchRooms(db, text) {
  // поиск по части названия
}`,
    tests: [
      {
        id: 'find-user',
        name: 'Поиск пользователя возвращает первого',
        type: 'assert',
        code: `const findUserByLogin = ctx.get('findUserByLogin');
const db = { query: () => Promise.resolve([{ id: 1, login: 'ivanov26' }]) };
return findUserByLogin(db, 'ivanov26').then(function (user) {
  ctx.assert(user && user.login === 'ivanov26', 'Ожидался пользователь ivanov26, получено: ' + ctx.preview(user));
});`,
        points: 3,
      },
      {
        id: 'find-none',
        name: 'Если пользователя нет — null',
        type: 'assert',
        code: `const findUserByLogin = ctx.get('findUserByLogin');
const db = { query: () => Promise.resolve([]) };
return findUserByLogin(db, 'нет-такого').then(function (user) {
  ctx.assert(user === null, 'Для пустого результата нужно вернуть null, получено: ' + ctx.preview(user));
});`,
        points: 3,
      },
      {
        id: 'parametrized',
        name: 'Логин уходит параметром, а не в текст запроса',
        type: 'assert',
        code: `const findUserByLogin = ctx.get('findUserByLogin');
const calls = [];
const db = { query: (sql, params) => { calls.push({ sql, params }); return Promise.resolve([]); } };
const dangerous = "' OR 1=1 --";
return findUserByLogin(db, dangerous).then(function () {
  ctx.assert(calls.length === 1, 'Должен быть ровно один запрос к базе, сделано: ' + calls.length);
  const call = calls[0];
  ctx.assert(
    call.sql.indexOf(dangerous) === -1,
    'Логин попал прямо в текст запроса — это и есть внедрение SQL. Запрос: ' + call.sql,
  );
  ctx.assert(call.sql.indexOf('?') !== -1, 'В запросе должен быть знак вопроса — место для подстановки');
  ctx.assert(Array.isArray(call.params), 'Значения передаются вторым параметром массивом');
  ctx.assert(call.params.indexOf(dangerous) !== -1, 'Логин должен быть среди переданных значений');
});`,
        points: 6,
      },
      {
        id: 'create',
        name: 'Заявка создаётся и возвращает номер',
        type: 'assert',
        code: `const createApplication = ctx.get('createApplication');
const calls = [];
const db = { query: (sql, params) => { calls.push({ sql, params }); return Promise.resolve({ insertId: 42 }); } };
return createApplication(db, { userId: 1, roomId: 2, date: '2027-03-12' }).then(function (result) {
  ctx.assert(result && result.id === 42, 'Нужно вернуть { id: 42 }, получено: ' + ctx.preview(result));
  const call = calls[0];
  ctx.assert(call.params && call.params.length === 3, 'В INSERT передаются три значения, сейчас: ' + ctx.preview(call.params));
  ctx.assert(
    (call.sql.match(/\\?/g) || []).length === 3,
    'В запросе должно быть три знака вопроса, сейчас: ' + call.sql,
  );
});`,
        points: 5,
      },
      {
        id: 'search',
        name: 'Поиск по части названия тоже безопасен',
        type: 'assert',
        code: `const searchRooms = ctx.get('searchRooms');
const calls = [];
const db = { query: (sql, params) => { calls.push({ sql, params }); return Promise.resolve([]); } };
return searchRooms(db, 'ковор').then(function () {
  const call = calls[0];
  ctx.assert(call.sql.indexOf('ковор') === -1, 'Образец поиска не должен попадать в текст запроса');
  ctx.assert(Array.isArray(call.params) && call.params.length === 1, 'Образец передаётся параметром');
  ctx.assert(
    String(call.params[0]).indexOf('%') !== -1,
    'Проценты для поиска по части названия добавляются к значению, а не в текст запроса. Сейчас: ' + ctx.preview(call.params[0]),
  );
});`,
        points: 5,
      },
      {
        id: 'no-concat',
        name: 'В коде нет склейки значений в запрос',
        type: 'assert',
        // Ищем склейку именно внутри строки с запросом. Сложение строк само
        // по себе не запрещено: образец для LIKE так и собирают.
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
const KEYWORDS = 'SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|VALUES';
ctx.assert(
  !new RegExp('\`[^\`]*(' + KEYWORDS + ')[^\`]*\\\\$\\\\{', 'i').test(source),
  'В тексте запроса найдена подстановка через шаблонную строку. Значения передаются только вторым параметром',
);
ctx.assert(
  !new RegExp("['\\"][^'\\"]*(" + KEYWORDS + ")[^'\\"]*['\\"]\\\\s*\\\\+", 'i').test(source),
  'Текст запроса склеивается через плюс — так и появляется внедрение SQL',
);`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Метод query принимает два аргумента: текст запроса со знаками вопроса и массив значений в том же порядке.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Для поиска по части названия проценты добавляют к самому значению: ["%" + text + "%"], а в запросе остаётся LIKE ?.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const rows = await db.query("SELECT * FROM users WHERE login = ?", [login]); return rows.length > 0 ? rows[0] : null;',
        penaltyPercent: 35,
      },
    ],
    solution: `async function findUserByLogin(db, login) {
  const rows = await db.query('SELECT * FROM users WHERE login = ?', [login]);
  return rows.length > 0 ? rows[0] : null;
}

async function createApplication(db, data) {
  const result = await db.query(
    'INSERT INTO applications (user_id, room_id, start_date) VALUES (?, ?, ?)',
    [data.userId, data.roomId, data.date],
  );

  return { id: result.insertId };
}

async function searchRooms(db, text) {
  return db.query('SELECT * FROM rooms WHERE title LIKE ?', ['%' + text + '%']);
}`,
    solutionExplanation:
      'Знак вопроса — не шаблон для склейки, а место, куда драйвер подставит значение уже после разбора запроса. Поэтому что бы пользователь ни ввёл, текст остаётся тем же самым и команда не может превратиться в другую. Отдельно обратите внимание на поиск: проценты добавлены к значению, а не к тексту запроса. Написать LIKE "%?%" нельзя — внутри кавычек знак вопроса становится обычным символом, и подстановка не сработает.',
    maxScore: 26,
    estimatedMinutes: 35,
    examRefs: ['m3-quality', 'm1-register', 'm1-login'],
    planDays: ['day-15-4'],
    source: 'plan',
  },

  {
    id: 'task-api-design-routes',
    title: 'Список адресов API: что сервер умеет и кому это доступно',
    kind: 'api',
    runtime: 'js',
    difficulty: 3,
    tech: ['express', 'node'],
    topicIds: ['api-design'],
    monthNo: 4,
    weekNo: 15,
    statement: `Прежде чем писать сервер, выписывают все адреса. Полчаса на бумаге экономят день переделок: сразу видно, чего не хватает и где перепутаны права доступа.

1. Массив \`api\` — восемь записей вида \`{ method, path, access, description }\`, где \`access\` — одно из \`'public'\`, \`'user'\`, \`'admin'\`.

Нужны ровно эти адреса:

| Метод | Адрес | Доступ |
|---|---|---|
| POST | /api/register | public |
| POST | /api/login | public |
| GET | /api/rooms | public |
| GET | /api/applications | user |
| POST | /api/applications | user |
| POST | /api/applications/:id/review | user |
| GET | /api/admin/applications | admin |
| PATCH | /api/admin/applications/:id | admin |

2. \`findRoute(method, path)\` — ищет описание по методу и адресу. Адреса с \`:id\` должны совпадать с настоящими: \`/api/admin/applications/7\` находит запись \`PATCH /api/admin/applications/:id\`. Если ничего не подошло — \`null\`.
3. \`canAccess(route, user)\` — \`public\` доступен всем, включая \`null\`; \`user\` — любому вошедшему; \`admin\` — только пользователю с \`role: 'admin'\`.`,
    requirements: [
      'В массиве api восемь адресов с методом, путём, доступом и описанием',
      'findRoute находит адрес по точному совпадению',
      'findRoute сопоставляет части адреса с :id',
      'findRoute различает методы',
      'canAccess пускает гостя только на public',
      'canAccess пускает в admin только администратора',
    ],
    starterCode: `const api = [
  // восемь записей { method, path, access, description }
];

function findRoute(method, path) {
  // поиск с учётом частей вида :id
}

function canAccess(route, user) {
  // public / user / admin
}`,
    tests: [
      {
        id: 'table',
        name: 'Все восемь адресов описаны',
        type: 'assert',
        code: `const api = ctx.get('api');
ctx.assert(Array.isArray(api) && api.length === 8, 'Адресов должно быть восемь, найдено: ' + (api || []).length);
const expected = [
  'POST /api/register public',
  'POST /api/login public',
  'GET /api/rooms public',
  'GET /api/applications user',
  'POST /api/applications user',
  'POST /api/applications/:id/review user',
  'GET /api/admin/applications admin',
  'PATCH /api/admin/applications/:id admin',
];
const actual = api.map((route) => route.method + ' ' + route.path + ' ' + route.access);
expected.forEach((item) => {
  ctx.assert(actual.indexOf(item) !== -1, 'Не описан адрес: ' + item + '. Сейчас: ' + actual.join(' | '));
});
api.forEach((route) => {
  ctx.assert(
    typeof route.description === 'string' && route.description.length >= 10,
    'У адреса ' + route.path + ' нет внятного описания',
  );
});`,
        points: 5,
      },
      {
        id: 'exact',
        name: 'Точное совпадение находится',
        type: 'assert',
        code: `const findRoute = ctx.get('findRoute');
const route = findRoute('GET', '/api/rooms');
ctx.assert(route && route.path === '/api/rooms', 'Адрес GET /api/rooms не найден');
ctx.assert(findRoute('GET', '/api/unknown') === null, 'Для неизвестного адреса нужно вернуть null');`,
        points: 3,
      },
      {
        id: 'method-matters',
        name: 'Метод учитывается',
        type: 'assert',
        code: `const findRoute = ctx.get('findRoute');
ctx.assert(findRoute('POST', '/api/applications') !== null, 'POST /api/applications должен находиться');
ctx.assert(
  findRoute('DELETE', '/api/applications') === null,
  'DELETE /api/applications в списке нет — должен вернуться null',
);`,
        points: 3,
      },
      {
        id: 'params',
        name: 'Части адреса с :id сопоставляются',
        type: 'assert',
        code: `const findRoute = ctx.get('findRoute');
const route = findRoute('PATCH', '/api/admin/applications/7');
ctx.assert(
  route && route.path === '/api/admin/applications/:id',
  'Адрес с номером должен находить запись с :id, получено: ' + ctx.preview(route),
);
const review = findRoute('POST', '/api/applications/12/review');
ctx.assert(
  review && review.path === '/api/applications/:id/review',
  'Адрес с номером в середине тоже должен находиться, получено: ' + ctx.preview(review),
);
ctx.assert(
  findRoute('PATCH', '/api/admin/applications/7/extra') === null,
  'Адрес с лишней частью совпадать не должен: количество частей обязано совпадать',
);`,
        points: 6,
      },
      {
        id: 'public-access',
        name: 'Гость проходит только на общедоступные адреса',
        type: 'assert',
        code: `const findRoute = ctx.get('findRoute');
const canAccess = ctx.get('canAccess');
ctx.assert(canAccess(findRoute('POST', '/api/login'), null) === true, 'Гость должен попадать на вход');
ctx.assert(canAccess(findRoute('GET', '/api/applications'), null) === false, 'Гостя нельзя пускать к своим заявкам');`,
        points: 4,
      },
      {
        id: 'admin-access',
        name: 'В админку пускают только администратора',
        type: 'assert',
        code: `const findRoute = ctx.get('findRoute');
const canAccess = ctx.get('canAccess');
const user = { id: 1, role: 'user' };
const admin = { id: 2, role: 'admin' };
const route = findRoute('GET', '/api/admin/applications');
ctx.assert(canAccess(route, user) === false, 'Обычного пользователя в админку пускать нельзя');
ctx.assert(canAccess(route, admin) === true, 'Администратор в админку попадать должен');
ctx.assert(canAccess(findRoute('POST', '/api/applications'), user) === true, 'Вошедший должен создавать заявки');`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Разбейте оба адреса по косой черте и сравнивайте по частям. Сначала проверьте, что количество частей совпало.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Часть, начинающаяся с двоеточия, подходит под любое значение — её сравнивать не нужно.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const matches = (pattern, path) => { const a = pattern.split("/"); const b = path.split("/"); return a.length === b.length && a.every((part, i) => part.startsWith(":") || part === b[i]); };',
        penaltyPercent: 35,
      },
    ],
    solution: `const api = [
  { method: 'POST', path: '/api/register', access: 'public', description: 'Регистрация нового пользователя' },
  { method: 'POST', path: '/api/login', access: 'public', description: 'Вход и выдача токена' },
  { method: 'GET', path: '/api/rooms', access: 'public', description: 'Справочник помещений для формы заявки' },
  { method: 'GET', path: '/api/applications', access: 'user', description: 'Свои заявки для личного кабинета' },
  { method: 'POST', path: '/api/applications', access: 'user', description: 'Создание новой заявки' },
  {
    method: 'POST',
    path: '/api/applications/:id/review',
    access: 'user',
    description: 'Отзыв по заявке после смены статуса',
  },
  { method: 'GET', path: '/api/admin/applications', access: 'admin', description: 'Все заявки для администратора' },
  {
    method: 'PATCH',
    path: '/api/admin/applications/:id',
    access: 'admin',
    description: 'Смена статуса заявки администратором',
  },
];

function matches(pattern, path) {
  const patternParts = pattern.split('/');
  const pathParts = path.split('/');

  if (patternParts.length !== pathParts.length) return false;

  return patternParts.every((part, index) => part.startsWith(':') || part === pathParts[index]);
}

function findRoute(method, path) {
  const route = api.find((item) => item.method === method && matches(item.path, path));
  return route || null;
}

function canAccess(route, user) {
  if (!route) return false;
  if (route.access === 'public') return true;
  if (!user) return false;
  if (route.access === 'admin') return user.role === 'admin';
  return true;
}`,
    solutionExplanation:
      'Проверка на совпадение количества частей стоит первой не случайно: без неё адрес /api/admin/applications/7/extra подошёл бы под /api/admin/applications/:id, и запрос ушёл бы не туда. Функция canAccess написана лесенкой от самого общего к самому частному — такой порядок читается сверху вниз как правило и не оставляет незакрытых случаев. Обратите внимание, что права описаны в самой таблице адресов: это единственное место, где видно всю картину доступа сразу, и именно его показывают на защите.',
    maxScore: 26,
    estimatedMinutes: 30,
    examRefs: ['m1-admin', 'm1-cabinet', 'm3-quality'],
    planDays: ['day-15-5'],
    source: 'plan',
  },

  {
    id: 'task-applications-repository',
    title: 'Класс для работы с заявками: весь SQL в одном месте',
    kind: 'api',
    runtime: 'js',
    difficulty: 4,
    tech: ['express', 'sql', 'node'],
    topicIds: ['server-architecture'],
    monthNo: 4,
    weekNo: 16,
    statement: `Когда запросы к базе разбросаны по обработчикам, найти нужный невозможно, а поменять схему — больно. Их собирают в один класс: снаружи понятные методы, внутри SQL.

Напишите класс \`ApplicationsRepository\`. Он принимает \`db\` в конструктор и хранит его в поле.

1. \`create(data)\` — добавляет заявку с \`userId\`, \`roomId\`, \`date\`; возвращает \`{ id }\` из \`result.insertId\`.
2. \`findByUser(userId)\` — заявки одного пользователя.
3. \`findAll()\` — все заявки, для администратора.
4. \`changeStatus(id, status)\` — меняет статус. Если статуса нет в списке допустимых, метод **не обращается к базе** и выбрасывает ошибку с текстом «Недопустимый статус». Если запрос не изменил ни одной строки (\`result.affectedRows === 0\`) — возвращает \`false\`, иначе \`true\`.

Допустимые статусы: «Новая», «Мероприятие назначено», «Мероприятие завершено».

Все значения — параметрами, склейка запрещена.`,
    requirements: [
      'Конструктор сохраняет db в поле',
      'create возвращает номер созданной заявки',
      'findByUser передаёт номер пользователя параметром',
      'findAll возвращает все заявки',
      'Недопустимый статус выбрасывает ошибку и не идёт в базу',
      'changeStatus возвращает false, если заявка не найдена',
    ],
    starterCode: `const ALLOWED_STATUSES = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'];

class ApplicationsRepository {
  constructor(db) {
    // сохранить db
  }

  async create(data) {
    // ваш код
  }

  async findByUser(userId) {
    // ваш код
  }

  async findAll() {
    // ваш код
  }

  async changeStatus(id, status) {
    // ваш код
  }
}`,
    tests: [
      {
        id: 'create',
        name: 'Заявка создаётся',
        type: 'assert',
        code: `const Repo = ctx.get('ApplicationsRepository');
const calls = [];
const db = { query: (sql, params) => { calls.push({ sql, params }); return Promise.resolve({ insertId: 7 }); } };
const repo = new Repo(db);
return repo.create({ userId: 1, roomId: 2, date: '2027-03-12' }).then(function (result) {
  ctx.assert(result && result.id === 7, 'Ожидалось { id: 7 }, получено: ' + ctx.preview(result));
  ctx.assert(calls[0].sql.toUpperCase().indexOf('INSERT') !== -1, 'Должен выполняться INSERT');
  ctx.assert(calls[0].params && calls[0].params.length === 3, 'В запрос передаются три значения');
});`,
        points: 4,
      },
      {
        id: 'find-by-user',
        name: 'Заявки одного пользователя',
        type: 'assert',
        code: `const Repo = ctx.get('ApplicationsRepository');
const calls = [];
const db = { query: (sql, params) => { calls.push({ sql, params }); return Promise.resolve([{ id: 1 }]); } };
const repo = new Repo(db);
return repo.findByUser(5).then(function (rows) {
  ctx.assert(Array.isArray(rows) && rows.length === 1, 'Метод должен вернуть массив заявок');
  ctx.assert(calls[0].sql.indexOf('?') !== -1, 'Номер пользователя подставляется параметром');
  ctx.assert(calls[0].params && calls[0].params[0] === 5, 'В параметрах должен быть номер пользователя, сейчас: ' + ctx.preview(calls[0].params));
  ctx.assert(String(calls[0].sql).indexOf('5') === -1, 'Номер не должен попадать в текст запроса');
});`,
        points: 5,
      },
      {
        id: 'find-all',
        name: 'Все заявки для администратора',
        type: 'assert',
        code: `const Repo = ctx.get('ApplicationsRepository');
const db = { query: () => Promise.resolve([{ id: 1 }, { id: 2 }]) };
const repo = new Repo(db);
return repo.findAll().then(function (rows) {
  ctx.assert(Array.isArray(rows) && rows.length === 2, 'Ожидались две заявки, получено: ' + ctx.preview(rows));
});`,
        points: 3,
      },
      {
        id: 'status-ok',
        name: 'Статус меняется',
        type: 'assert',
        code: `const Repo = ctx.get('ApplicationsRepository');
const calls = [];
const db = { query: (sql, params) => { calls.push({ sql, params }); return Promise.resolve({ affectedRows: 1 }); } };
const repo = new Repo(db);
return repo.changeStatus(3, 'Мероприятие назначено').then(function (result) {
  ctx.assert(result === true, 'При успешной смене нужно вернуть true, получено: ' + ctx.preview(result));
  ctx.assert(calls[0].sql.toUpperCase().indexOf('UPDATE') !== -1, 'Должен выполняться UPDATE');
  ctx.assert(calls[0].params && calls[0].params.length === 2, 'Передаются два значения: статус и номер');
});`,
        points: 4,
      },
      {
        id: 'status-missing',
        name: 'Несуществующая заявка даёт false',
        type: 'assert',
        code: `const Repo = ctx.get('ApplicationsRepository');
const db = { query: () => Promise.resolve({ affectedRows: 0 }) };
const repo = new Repo(db);
return repo.changeStatus(999, 'Мероприятие завершено').then(function (result) {
  ctx.assert(result === false, 'Если ни одна строка не изменилась, нужно вернуть false, получено: ' + ctx.preview(result));
});`,
        points: 4,
      },
      {
        id: 'status-invalid',
        name: 'Недопустимый статус до базы не доходит',
        type: 'assert',
        code: `const Repo = ctx.get('ApplicationsRepository');
let called = false;
const db = { query: () => { called = true; return Promise.resolve({ affectedRows: 1 }); } };
const repo = new Repo(db);
return Promise.resolve()
  .then(() => repo.changeStatus(1, 'Отменена'))
  .then(
    function () {
      ctx.assert(false, 'Недопустимый статус должен выбрасывать ошибку');
    },
    function (error) {
      ctx.assert(
        String(error.message || error).indexOf('Недопустимый статус') !== -1,
        'В тексте ошибки должно быть «Недопустимый статус», получено: ' + (error.message || error),
      );
      ctx.assert(called === false, 'Проверка должна идти до обращения к базе — лишний запрос здесь не нужен');
    },
  );`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Сохраните базу в поле конструктора: this.db = db. Дальше все методы обращаются к this.db.query.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Проверку статуса ставьте самой первой строкой метода — до всякого обращения к базе.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'async changeStatus(id, status) { if (!ALLOWED_STATUSES.includes(status)) throw new Error("Недопустимый статус"); const result = await this.db.query("UPDATE applications SET status = ? WHERE id = ?", [status, id]); return result.affectedRows > 0; }',
        penaltyPercent: 35,
      },
    ],
    solution: `const ALLOWED_STATUSES = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'];

class ApplicationsRepository {
  constructor(db) {
    this.db = db;
  }

  async create(data) {
    const result = await this.db.query(
      'INSERT INTO applications (user_id, room_id, start_date) VALUES (?, ?, ?)',
      [data.userId, data.roomId, data.date],
    );

    return { id: result.insertId };
  }

  async findByUser(userId) {
    return this.db.query('SELECT * FROM applications WHERE user_id = ? ORDER BY id', [userId]);
  }

  async findAll() {
    return this.db.query('SELECT * FROM applications ORDER BY id');
  }

  async changeStatus(id, status) {
    if (ALLOWED_STATUSES.indexOf(status) === -1) {
      throw new Error('Недопустимый статус');
    }

    const result = await this.db.query('UPDATE applications SET status = ? WHERE id = ?', [status, id]);

    return result.affectedRows > 0;
  }
}`,
    solutionExplanation:
      'Проверка статуса стоит до запроса, и это заметно в тесте: подсунутая база запоминает, обращались ли к ней. Смысл не в экономии одного запроса, а в том, где живёт правило. Список допустимых статусов — это знание о заявках, и хранить его нужно там же, где остальные операции с заявками, а не в каждом обработчике маршрута. Различие между ошибкой и значением false тоже осмысленное: недопустимый статус — ошибка программиста, отсутствующая заявка — обычный случай, который обработчик превратит в ответ 404.',
    maxScore: 26,
    estimatedMinutes: 35,
    examRefs: ['m1-admin', 'm3-quality', 'm2-admin-tools'],
    planDays: ['day-16-6'],
    source: 'plan',
  },
];
