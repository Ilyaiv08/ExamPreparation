import type { Task } from '../types';

/**
 * Месяц 4: задания на SQL.
 *
 * Запросы выполняются по-настоящему — в SQLite, скомпилированном в WebAssembly.
 * Отличия от MySQL песочница переписывает сама и показывает список замен
 * во вкладке результатов, чтобы вы видели, что именно изменилось.
 */

const SETUP_CONFERENCE = `
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  login TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user'
);

CREATE TABLE rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL UNIQUE
);

CREATE TABLE payment_methods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL UNIQUE
);

CREATE TABLE applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  room_id INTEGER NOT NULL REFERENCES rooms(id),
  payment_id INTEGER NOT NULL REFERENCES payment_methods(id),
  start_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Новая'
);

CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL UNIQUE REFERENCES applications(id),
  text TEXT NOT NULL
);

INSERT INTO users (id, login, password_hash, full_name, phone, email, role) VALUES
  (1, 'ivanov26', 'hash', 'Иванов Иван Иванович', '+79990000001', 'ivanov@example.com', 'user'),
  (2, 'petrov26', 'hash', 'Петров Пётр Петрович', '+79990000002', 'petrov@example.com', 'user'),
  (3, 'Admin26',  'hash', 'Администратор',        '+79990000003', 'admin@example.com',  'admin');

INSERT INTO rooms (id, title) VALUES (1, 'Аудитория'), (2, 'Коворкинг'), (3, 'Кинозал');

INSERT INTO payment_methods (id, title) VALUES (1, 'Наличные'), (2, 'Банковская карта'), (3, 'Перевод');

INSERT INTO applications (id, user_id, room_id, payment_id, start_date, status) VALUES
  (1, 1, 2, 2, '2026-09-14', 'Новая'),
  (2, 1, 3, 1, '2026-09-21', 'Мероприятие назначено'),
  (3, 2, 1, 2, '2026-09-07', 'Мероприятие завершено'),
  (4, 2, 2, 3, '2026-10-05', 'Новая'),
  (5, 1, 1, 1, '2026-08-30', 'Мероприятие завершено');

INSERT INTO reviews (id, application_id, text) VALUES
  (1, 3, 'Всё прошло отлично'),
  (2, 5, 'Хороший зал, удобное расположение');
`;

export const MONTH_04_SQL_TASKS: Task[] = [
  {
    id: 'task-sql-schema',
    title: 'Схема базы данных «Конференции.РФ»',
    kind: 'db',
    runtime: 'sql',
    difficulty: 3,
    tech: ['sql'],
    topicIds: ['db-relations', 'sql-create-table'],
    monthNo: 4,
    weekNo: 13,
    statement: `Первое задание модуля 1 на экзамене — спроектировать базу. Напишите \`CREATE TABLE\` для пяти таблиц.

**users:** \`id\` (первичный ключ), \`login\` (текст, обязательный, уникальный), \`password_hash\`, \`full_name\`, \`phone\`, \`email\` (все обязательные), \`role\` (по умолчанию \`'user'\`).

**rooms:** \`id\`, \`title\` (обязательный, уникальный).

**payment_methods:** \`id\`, \`title\` (обязательный, уникальный).

**applications:** \`id\`, \`user_id\`, \`room_id\`, \`payment_id\` (внешние ключи, обязательные), \`start_date\` (дата, обязательная), \`status\` (по умолчанию \`'Новая'\`).

**reviews:** \`id\`, \`application_id\` (внешний ключ, **уникальный** — один отзыв на заявку), \`text\` (обязательный).

Не забудьте порядок создания: сначала таблицы без ссылок.`,
    requirements: [
      'Пять таблиц с первичными ключами',
      'Логин уникален (требование задания)',
      'У статуса значение по умолчанию «Новая»',
      'Три внешних ключа в applications',
      'Отзыв связан с заявкой один к одному',
    ],
    starterCode: `-- Сначала таблицы, на которые ссылаются другие

CREATE TABLE users (
  -- ваш код
);

CREATE TABLE rooms (
  -- ваш код
);

CREATE TABLE payment_methods (
  -- ваш код
);

CREATE TABLE applications (
  -- ваш код
);

CREATE TABLE reviews (
  -- ваш код
);`,
    tests: [
      {
        id: 't1',
        name: 'Таблица users с уникальным логином',
        type: 'sql-schema',
        table: 'users',
        columns: [
          { name: 'id', pk: true },
          { name: 'login', notNull: true },
          { name: 'password_hash', notNull: true },
          { name: 'full_name', notNull: true },
          { name: 'phone', notNull: true },
          { name: 'email', notNull: true },
          { name: 'role' },
        ],
        points: 4,
      },
      {
        id: 't2',
        name: 'Логин действительно уникален',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM pragma_index_list('users') WHERE "unique" = 1`,
        expectedRows: [[1]],
        points: 3,
      },
      {
        id: 't3',
        name: 'Справочник помещений',
        type: 'sql-schema',
        table: 'rooms',
        columns: [
          { name: 'id', pk: true },
          { name: 'title', notNull: true },
        ],
        points: 2,
      },
      {
        id: 't4',
        name: 'Справочник способов оплаты',
        type: 'sql-schema',
        table: 'payment_methods',
        columns: [
          { name: 'id', pk: true },
          { name: 'title', notNull: true },
        ],
        points: 2,
      },
      {
        id: 't5',
        name: 'Таблица заявок со связями',
        type: 'sql-schema',
        table: 'applications',
        columns: [
          { name: 'id', pk: true },
          { name: 'user_id', notNull: true },
          { name: 'room_id', notNull: true },
          { name: 'payment_id', notNull: true },
          { name: 'start_date', notNull: true },
          { name: 'status', notNull: true },
        ],
        foreignKeys: [
          { column: 'user_id', refTable: 'users' },
          { column: 'room_id', refTable: 'rooms' },
          { column: 'payment_id', refTable: 'payment_methods' },
        ],
        points: 5,
      },
      {
        id: 't6',
        name: 'Статус по умолчанию — «Новая»',
        type: 'sql-query',
        check: `INSERT INTO users (login, password_hash, full_name, phone, email) VALUES ('testuser', 'h', 'Тест', '+7', 't@e.ru');
INSERT INTO rooms (title) VALUES ('Аудитория');
INSERT INTO payment_methods (title) VALUES ('Наличные');
INSERT INTO applications (user_id, room_id, payment_id, start_date) VALUES (1, 1, 1, '2026-09-14');
SELECT status FROM applications WHERE id = 1`,
        expectedRows: [['Новая']],
        points: 5,
      },
      {
        id: 't7',
        name: 'Отзыв связан с заявкой один к одному',
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
        id: 't8',
        name: 'У заявки не может быть двух отзывов',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM pragma_index_list('reviews') WHERE "unique" = 1`,
        expectedRows: [[1]],
        points: 3,
      },
    ],
    hints: [
      { level: 1, text: 'Порядок важен: users, rooms и payment_methods создаются первыми — на них ссылаются заявки.', penaltyPercent: 10 },
      { level: 2, text: 'Уникальность задаётся словом UNIQUE прямо в объявлении столбца, значение по умолчанию — DEFAULT.', penaltyPercent: 20 },
      {
        level: 3,
        text: "applications: user_id INT NOT NULL, … FOREIGN KEY (user_id) REFERENCES users(id). Для отзыва: application_id INT NOT NULL UNIQUE.",
        penaltyPercent: 35,
      },
    ],
    solution: `CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  login         VARCHAR(50)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(150) NOT NULL,
  phone         VARCHAR(30)  NOT NULL,
  email         VARCHAR(150) NOT NULL,
  role          VARCHAR(10)  NOT NULL DEFAULT 'user'
);

CREATE TABLE rooms (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE payment_methods (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE applications (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  room_id    INT NOT NULL,
  payment_id INT NOT NULL,
  start_date DATE NOT NULL,
  status     VARCHAR(30) NOT NULL DEFAULT 'Новая',
  FOREIGN KEY (user_id)    REFERENCES users(id),
  FOREIGN KEY (room_id)    REFERENCES rooms(id),
  FOREIGN KEY (payment_id) REFERENCES payment_methods(id)
);

CREATE TABLE reviews (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL UNIQUE,
  text           TEXT NOT NULL,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);`,
    solutionExplanation:
      'Три требования задания закрыты прямо в схеме: UNIQUE на логине, DEFAULT «Новая» у статуса и UNIQUE на application_id, который делает связь с отзывом один-к-одному. Эту схему нужно уметь писать по памяти за 10–15 минут.',
    maxScore: 28,
    estimatedMinutes: 35,
    examRefs: ['m1-db', 'm1-er', 'm3-db'],
    planDays: ['day-13-4'],
    source: 'plan',
  },

  {
    id: 'task-sql-select',
    title: 'SELECT: выборка, фильтр, сортировка, страница',
    kind: 'db',
    runtime: 'sql',
    difficulty: 2,
    tech: ['sql'],
    topicIds: ['sql-select'],
    monthNo: 4,
    weekNo: 13,
    statement: `База уже заполнена тестовыми данными (см. блок слева). Напишите четыре запроса и сохраните результаты во **представления** с указанными именами.

1. \`v_new\` — все заявки со статусом «Новая», столбцы \`id\` и \`start_date\`, отсортированные по дате по возрастанию.
2. \`v_user1\` — заявки пользователя с \`id = 1\`, столбцы \`id\` и \`status\`, по дате по убыванию.
3. \`v_page2\` — вторая страница всех заявок по 2 записи на страницу, столбец \`id\`, сортировка по дате по возрастанию.
4. \`v_count\` — один столбец \`total\` с количеством заявок со статусом «Мероприятие завершено».

Представление создаётся так: \`CREATE VIEW имя AS SELECT …;\``,
    requirements: [
      'Четыре представления с точными именами',
      'Фильтр по статусу и по пользователю',
      'Сортировка в нужном направлении',
      'Постраничная выборка через LIMIT и OFFSET',
      'Подсчёт через COUNT',
    ],
    setupSql: SETUP_CONFERENCE,
    starterCode: `-- 1. Новые заявки по дате
CREATE VIEW v_new AS
SELECT ...;

-- 2. Заявки пользователя 1, новые сверху
CREATE VIEW v_user1 AS
SELECT ...;

-- 3. Вторая страница по 2 записи
CREATE VIEW v_page2 AS
SELECT ...;

-- 4. Количество завершённых
CREATE VIEW v_count AS
SELECT ...;`,
    tests: [
      {
        id: 't1',
        name: 'Новые заявки по возрастанию даты',
        type: 'sql-query',
        check: 'SELECT id, start_date FROM v_new',
        expectedColumns: ['id', 'start_date'],
        expectedRows: [
          [1, '2026-09-14'],
          [4, '2026-10-05'],
        ],
        ordered: true,
        points: 4,
      },
      {
        id: 't2',
        name: 'Заявки пользователя 1, новые сверху',
        type: 'sql-query',
        check: 'SELECT id, status FROM v_user1',
        expectedColumns: ['id', 'status'],
        expectedRows: [
          [2, 'Мероприятие назначено'],
          [1, 'Новая'],
          [5, 'Мероприятие завершено'],
        ],
        ordered: true,
        points: 5,
      },
      {
        id: 't3',
        name: 'Вторая страница по две записи',
        type: 'sql-query',
        check: 'SELECT id FROM v_page2',
        expectedRows: [[1], [2]],
        ordered: true,
        points: 5,
      },
      {
        id: 't4',
        name: 'Количество завершённых мероприятий',
        type: 'sql-query',
        check: 'SELECT total FROM v_count',
        expectedColumns: ['total'],
        expectedRows: [[2]],
        points: 4,
      },
    ],
    hints: [
      { level: 1, text: 'Сортировка по убыванию — ORDER BY start_date DESC. Страница — LIMIT 2 OFFSET 2.', penaltyPercent: 10 },
      { level: 2, text: 'Формула смещения: OFFSET = (номер страницы − 1) × размер страницы. Для второй страницы по 2 записи это OFFSET 2.', penaltyPercent: 20 },
      {
        level: 3,
        text: "CREATE VIEW v_count AS SELECT COUNT(*) AS total FROM applications WHERE status = 'Мероприятие завершено';",
        penaltyPercent: 35,
      },
    ],
    solution: `CREATE VIEW v_new AS
SELECT id, start_date
FROM applications
WHERE status = 'Новая'
ORDER BY start_date;

CREATE VIEW v_user1 AS
SELECT id, status
FROM applications
WHERE user_id = 1
ORDER BY start_date DESC;

CREATE VIEW v_page2 AS
SELECT id
FROM applications
ORDER BY start_date
LIMIT 2 OFFSET 2;

CREATE VIEW v_count AS
SELECT COUNT(*) AS total
FROM applications
WHERE status = 'Мероприятие завершено';`,
    solutionExplanation:
      'Третий запрос — готовая логика постраничной навигации админки. Обратите внимание: LIMIT всегда идёт вместе с ORDER BY, иначе порядок строк не определён и страницы могут повторяться.',
    maxScore: 18,
    estimatedMinutes: 25,
    examRefs: ['m1-cabinet', 'm2-admin-tools'],
    planDays: ['day-13-5'],
    source: 'plan',
  },

  {
    id: 'task-sql-insert',
    title: 'INSERT: добавление данных',
    kind: 'db',
    runtime: 'sql',
    difficulty: 2,
    tech: ['sql'],
    topicIds: ['sql-insert'],
    monthNo: 4,
    weekNo: 13,
    statement: `Добавьте данные в уже созданную базу.

1. Добавьте помещение «Холл» в \`rooms\`.
2. Добавьте способ оплаты «Онлайн-платёж» в \`payment_methods\`.
3. Добавьте заявку пользователя \`id = 2\`: помещение «Холл», способ оплаты «Онлайн-платёж», дата \`2026-11-15\`. **Статус не указывайте** — он должен проставиться значением по умолчанию.
4. Добавьте отзыв к заявке \`id = 2\` с текстом «Спасибо за организацию».

Идентификаторы новых справочных записей можно получить подзапросом: \`(SELECT id FROM rooms WHERE title = 'Холл')\`.`,
    requirements: [
      'Новое помещение и способ оплаты добавлены',
      'Заявка создана со ссылками на новые записи',
      'Статус проставился по умолчанию «Новая»',
      'Отзыв добавлен к заявке 2',
    ],
    setupSql: SETUP_CONFERENCE,
    starterCode: `-- 1. Новое помещение


-- 2. Новый способ оплаты


-- 3. Заявка пользователя 2 (статус не указываем)


-- 4. Отзыв к заявке 2
`,
    tests: [
      {
        id: 't1',
        name: 'Помещение «Холл» добавлено',
        type: 'sql-query',
        check: "SELECT title FROM rooms WHERE title = 'Холл'",
        expectedRows: [['Холл']],
        points: 3,
      },
      {
        id: 't2',
        name: 'Способ оплаты добавлен',
        type: 'sql-query',
        check: "SELECT title FROM payment_methods WHERE title = 'Онлайн-платёж'",
        expectedRows: [['Онлайн-платёж']],
        points: 3,
      },
      {
        id: 't3',
        name: 'Заявка создана с нужными данными',
        type: 'sql-query',
        check: `SELECT a.user_id, r.title, p.title, a.start_date
                FROM applications AS a
                JOIN rooms AS r ON r.id = a.room_id
                JOIN payment_methods AS p ON p.id = a.payment_id
                WHERE a.start_date = '2026-11-15'`,
        expectedRows: [[2, 'Холл', 'Онлайн-платёж', '2026-11-15']],
        points: 5,
      },
      {
        id: 't4',
        name: 'Статус проставился по умолчанию',
        type: 'sql-query',
        check: "SELECT status FROM applications WHERE start_date = '2026-11-15'",
        expectedRows: [['Новая']],
        points: 4,
      },
      {
        id: 't5',
        name: 'Отзыв добавлен к заявке 2',
        type: 'sql-query',
        check: 'SELECT application_id, text FROM reviews WHERE application_id = 2',
        expectedRows: [[2, 'Спасибо за организацию']],
        points: 3,
      },
      {
        id: 't6',
        name: 'Существующие данные не тронуты',
        type: 'sql-query',
        check: 'SELECT COUNT(*) FROM applications',
        expectedRows: [[6]],
        points: 2,
      },
    ],
    hints: [
      { level: 1, text: 'Перечисляйте столбцы явно: INSERT INTO rooms (title) VALUES (\'Холл\');', penaltyPercent: 10 },
      { level: 2, text: 'Идентификатор нового помещения можно взять подзапросом прямо в INSERT.', penaltyPercent: 20 },
      {
        level: 3,
        text: "INSERT INTO applications (user_id, room_id, payment_id, start_date) VALUES (2, (SELECT id FROM rooms WHERE title = 'Холл'), (SELECT id FROM payment_methods WHERE title = 'Онлайн-платёж'), '2026-11-15');",
        penaltyPercent: 35,
      },
    ],
    solution: `INSERT INTO rooms (title) VALUES ('Холл');

INSERT INTO payment_methods (title) VALUES ('Онлайн-платёж');

INSERT INTO applications (user_id, room_id, payment_id, start_date)
VALUES (
  2,
  (SELECT id FROM rooms WHERE title = 'Холл'),
  (SELECT id FROM payment_methods WHERE title = 'Онлайн-платёж'),
  '2026-11-15'
);

INSERT INTO reviews (application_id, text)
VALUES (2, 'Спасибо за организацию');`,
    solutionExplanation:
      'Статус не указан специально: значение DEFAULT из схемы закрывает требование задания «изначально заявка имеет статус Новая» на уровне базы — даже если сервер забудет его передать.',
    maxScore: 20,
    estimatedMinutes: 25,
    examRefs: ['m1-order', 'm1-register'],
    planDays: ['day-13-5'],
    source: 'plan',
  },

  {
    id: 'task-sql-update',
    title: 'UPDATE: смена статуса заявки',
    kind: 'db',
    runtime: 'sql',
    difficulty: 2,
    tech: ['sql'],
    topicIds: ['sql-update'],
    monthNo: 4,
    weekNo: 13,
    statement: `Администратор меняет статусы заявок. Выполните три изменения — **каждое строго с условием WHERE**.

1. Заявке \`id = 1\` поставьте статус «Мероприятие назначено».
2. Заявке \`id = 4\` поставьте статус «Мероприятие завершено».
3. Пользователю с логином \`petrov26\` смените телефон на \`+79995554433\`.

**Важно:** заявки с другими идентификаторами и остальные пользователи должны остаться нетронутыми. Тесты это проверяют.`,
    requirements: [
      'Статус заявки 1 изменён',
      'Статус заявки 4 изменён',
      'Телефон нужного пользователя изменён',
      'Остальные строки не затронуты',
    ],
    setupSql: SETUP_CONFERENCE,
    starterCode: `-- 1. Заявка 1 → «Мероприятие назначено»


-- 2. Заявка 4 → «Мероприятие завершено»


-- 3. Телефон пользователя petrov26
`,
    tests: [
      {
        id: 't1',
        name: 'Статус заявки 1 изменён',
        type: 'sql-query',
        check: 'SELECT status FROM applications WHERE id = 1',
        expectedRows: [['Мероприятие назначено']],
        points: 4,
      },
      {
        id: 't2',
        name: 'Статус заявки 4 изменён',
        type: 'sql-query',
        check: 'SELECT status FROM applications WHERE id = 4',
        expectedRows: [['Мероприятие завершено']],
        points: 4,
      },
      {
        id: 't3',
        name: 'Остальные заявки не тронуты',
        type: 'sql-query',
        check: 'SELECT id, status FROM applications WHERE id IN (2, 3, 5) ORDER BY id',
        expectedRows: [
          [2, 'Мероприятие назначено'],
          [3, 'Мероприятие завершено'],
          [5, 'Мероприятие завершено'],
        ],
        ordered: true,
        points: 5,
      },
      {
        id: 't4',
        name: 'Телефон изменён у нужного пользователя',
        type: 'sql-query',
        check: "SELECT phone FROM users WHERE login = 'petrov26'",
        expectedRows: [['+79995554433']],
        points: 4,
      },
      {
        id: 't5',
        name: 'Телефоны других пользователей не тронуты',
        type: 'sql-query',
        check: "SELECT login, phone FROM users WHERE login IN ('ivanov26', 'Admin26') ORDER BY login",
        expectedRows: [
          ['Admin26', '+79990000003'],
          ['ivanov26', '+79990000001'],
        ],
        ordered: true,
        points: 5,
      },
    ],
    hints: [
      { level: 1, text: 'Привычка, которая спасает: сначала напишите WHERE, потом вернитесь к SET.', penaltyPercent: 10 },
      { level: 2, text: 'Пользователя можно найти по логину: WHERE login = \'petrov26\'.', penaltyPercent: 20 },
      {
        level: 3,
        text: "UPDATE applications SET status = 'Мероприятие назначено' WHERE id = 1;",
        penaltyPercent: 35,
      },
    ],
    solution: `UPDATE applications SET status = 'Мероприятие назначено' WHERE id = 1;

UPDATE applications SET status = 'Мероприятие завершено' WHERE id = 4;

UPDATE users SET phone = '+79995554433' WHERE login = 'petrov26';`,
    solutionExplanation:
      'Тесты на «остальные строки не тронуты» здесь главные: забытый WHERE изменил бы всю таблицу, и на экзамене это означало бы потерю всех данных.',
    maxScore: 22,
    estimatedMinutes: 20,
    examRefs: ['m1-admin'],
    planDays: ['day-13-6'],
    source: 'plan',
  },

  {
    id: 'task-sql-join',
    title: 'JOIN: таблица заявок для админки',
    kind: 'db',
    runtime: 'sql',
    difficulty: 3,
    tech: ['sql'],
    topicIds: ['sql-join'],
    monthNo: 4,
    weekNo: 14,
    statement: `Панель администратора показывает ФИО, телефон, помещение, дату, способ оплаты и статус. В таблице заявок лежат только идентификаторы — соедините таблицы.

Создайте два представления.

**\`v_admin\`** — все заявки со столбцами в точном порядке: \`id\`, \`full_name\`, \`phone\`, \`room\`, \`payment\`, \`start_date\`, \`status\`. Сортировка по дате по возрастанию.

**\`v_cabinet\`** — заявки пользователя \`id = 1\` со столбцами \`id\`, \`room\`, \`start_date\`, \`status\`, \`review_text\`. Заявки **без отзыва тоже должны попасть** в результат (в \`review_text\` будет пусто). Сортировка по дате по возрастанию.`,
    requirements: [
      'v_admin соединяет три таблицы',
      'Столбцы названы и упорядочены точно',
      'v_cabinet показывает заявки без отзывов',
      'Фильтр по пользователю работает',
    ],
    setupSql: SETUP_CONFERENCE,
    starterCode: `-- Таблица админки: ФИО, телефон, помещение, дата, оплата, статус
CREATE VIEW v_admin AS
SELECT ...;

-- Кабинет пользователя 1: заявки с отзывом, если он есть
CREATE VIEW v_cabinet AS
SELECT ...;`,
    tests: [
      {
        id: 't1',
        name: 'Столбцы v_admin названы правильно',
        type: 'sql-query',
        check: 'SELECT id, full_name, phone, room, payment, start_date, status FROM v_admin LIMIT 1',
        expectedColumns: ['id', 'full_name', 'phone', 'room', 'payment', 'start_date', 'status'],
        expectedRows: [[5, 'Иванов Иван Иванович', '+79990000001', 'Аудитория', 'Наличные', '2026-08-30', 'Мероприятие завершено']],
        points: 6,
      },
      {
        id: 't2',
        name: 'В v_admin все пять заявок',
        type: 'sql-query',
        check: 'SELECT COUNT(*) FROM v_admin',
        expectedRows: [[5]],
        points: 3,
      },
      {
        id: 't3',
        name: 'Сортировка по дате',
        type: 'sql-query',
        check: 'SELECT id FROM v_admin',
        expectedRows: [[5], [3], [1], [2], [4]],
        ordered: true,
        points: 4,
      },
      {
        id: 't4',
        name: 'Кабинет: три заявки пользователя 1',
        type: 'sql-query',
        check: 'SELECT COUNT(*) FROM v_cabinet',
        expectedRows: [[3]],
        points: 4,
      },
      {
        id: 't5',
        name: 'Заявки без отзыва не потерялись',
        type: 'sql-query',
        check: 'SELECT id, review_text FROM v_cabinet ORDER BY id',
        expectedRows: [
          [1, null],
          [2, null],
          [5, 'Хороший зал, удобное расположение'],
        ],
        ordered: true,
        points: 6,
      },
    ],
    hints: [
      { level: 1, text: 'Соединение: JOIN rooms AS r ON r.id = a.room_id. Псевдонимы столбцов задаются словом AS.', penaltyPercent: 10 },
      { level: 2, text: 'Для отзывов нужен LEFT JOIN: с обычным JOIN заявки без отзыва исчезнут из кабинета.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'SELECT a.id, r.title AS room, a.start_date, a.status, rv.text AS review_text FROM applications AS a JOIN rooms AS r ON r.id = a.room_id LEFT JOIN reviews AS rv ON rv.application_id = a.id WHERE a.user_id = 1 ORDER BY a.start_date;',
        penaltyPercent: 35,
      },
    ],
    solution: `CREATE VIEW v_admin AS
SELECT
  a.id,
  u.full_name,
  u.phone,
  r.title AS room,
  p.title AS payment,
  a.start_date,
  a.status
FROM applications AS a
JOIN users           AS u ON u.id = a.user_id
JOIN rooms           AS r ON r.id = a.room_id
JOIN payment_methods AS p ON p.id = a.payment_id
ORDER BY a.start_date;

CREATE VIEW v_cabinet AS
SELECT
  a.id,
  r.title AS room,
  a.start_date,
  a.status,
  rv.text AS review_text
FROM applications AS a
JOIN rooms        AS r  ON r.id = a.room_id
LEFT JOIN reviews AS rv ON rv.application_id = a.id
WHERE a.user_id = 1
ORDER BY a.start_date;`,
    solutionExplanation:
      'Разница между JOIN и LEFT JOIN здесь принципиальна: у заявок 1 и 2 отзывов нет, и с обычным JOIN пользователь увидел бы в кабинете только одну заявку вместо трёх.',
    maxScore: 23,
    estimatedMinutes: 30,
    examRefs: ['m1-admin', 'm1-cabinet'],
    planDays: ['day-14-1'],
    source: 'plan',
  },

  {
    id: 'task-sql-aggregate',
    title: 'GROUP BY: сводка для админки',
    kind: 'db',
    runtime: 'sql',
    difficulty: 3,
    tech: ['sql'],
    topicIds: ['sql-aggregate'],
    monthNo: 4,
    weekNo: 14,
    statement: `Постройте три сводки в виде представлений.

1. \`v_by_status\` — столбцы \`status\` и \`total\`: сколько заявок в каждом статусе. Сортировка по статусу по алфавиту.
2. \`v_by_room\` — столбцы \`room\` и \`total\`: сколько заявок у каждого помещения. **Помещения без заявок тоже должны попасть в отчёт со значением 0.** Сортировка по названию помещения.
3. \`v_active\` — столбцы \`full_name\` и \`total\`: пользователи, у которых **больше двух** заявок. Сортировка по имени.`,
    requirements: [
      'Группировка по статусу',
      'Помещения без заявок показаны с нулём',
      'Фильтр групп через HAVING',
      'Названия столбцов точные',
    ],
    setupSql: SETUP_CONFERENCE,
    starterCode: `-- 1. Заявок по статусам
CREATE VIEW v_by_status AS
SELECT ...;

-- 2. Заявок по помещениям (включая помещения без заявок)
CREATE VIEW v_by_room AS
SELECT ...;

-- 3. Пользователи с более чем двумя заявками
CREATE VIEW v_active AS
SELECT ...;`,
    tests: [
      {
        id: 't1',
        name: 'Сводка по статусам',
        type: 'sql-query',
        check: 'SELECT status, total FROM v_by_status',
        expectedColumns: ['status', 'total'],
        expectedRows: [
          ['Мероприятие завершено', 2],
          ['Мероприятие назначено', 1],
          ['Новая', 2],
        ],
        ordered: true,
        points: 5,
      },
      {
        id: 't2',
        name: 'Сводка по помещениям',
        type: 'sql-query',
        check: 'SELECT room, total FROM v_by_room',
        expectedColumns: ['room', 'total'],
        expectedRows: [
          ['Аудитория', 2],
          ['Кинозал', 1],
          ['Коворкинг', 2],
        ],
        ordered: true,
        points: 5,
      },
      {
        id: 't3',
        name: 'Помещение без заявок показано с нулём',
        type: 'sql-query',
        check: `INSERT INTO rooms (title) VALUES ('Пустой зал');
                SELECT room, total FROM v_by_room WHERE room = 'Пустой зал'`,
        expectedRows: [['Пустой зал', 0]],
        points: 6,
      },
      {
        id: 't4',
        name: 'Активные пользователи',
        type: 'sql-query',
        check: 'SELECT full_name, total FROM v_active',
        expectedColumns: ['full_name', 'total'],
        expectedRows: [['Иванов Иван Иванович', 3]],
        points: 6,
      },
    ],
    hints: [
      { level: 1, text: 'GROUP BY status собирает строки в группы, COUNT(*) считает их количество.', penaltyPercent: 10 },
      { level: 2, text: 'Чтобы помещения без заявок не исчезли, начинайте запрос с rooms и присоединяйте заявки через LEFT JOIN. Считайте COUNT(a.id), а не COUNT(*).', penaltyPercent: 20 },
      {
        level: 3,
        text: 'Фильтр по количеству — это HAVING COUNT(a.id) > 2, а не WHERE: WHERE работает до группировки.',
        penaltyPercent: 35,
      },
    ],
    solution: `CREATE VIEW v_by_status AS
SELECT status, COUNT(*) AS total
FROM applications
GROUP BY status
ORDER BY status;

CREATE VIEW v_by_room AS
SELECT r.title AS room, COUNT(a.id) AS total
FROM rooms AS r
LEFT JOIN applications AS a ON a.room_id = r.id
GROUP BY r.id, r.title
ORDER BY r.title;

CREATE VIEW v_active AS
SELECT u.full_name, COUNT(a.id) AS total
FROM users AS u
JOIN applications AS a ON a.user_id = u.id
GROUP BY u.id, u.full_name
HAVING COUNT(a.id) > 2
ORDER BY u.full_name;`,
    solutionExplanation:
      'Два важных момента: COUNT(a.id) вместо COUNT(*) в связке с LEFT JOIN — иначе помещение без заявок получит 1 вместо 0; и HAVING вместо WHERE для фильтрации по результату подсчёта.',
    maxScore: 22,
    estimatedMinutes: 30,
    examRefs: ['m2-admin-tools'],
    planDays: ['day-14-2'],
    source: 'plan',
  },

  {
    id: 'task-sql-schema-courses',
    title: 'Тот же скелет на новой теме: «Запись на курсы»',
    kind: 'db',
    runtime: 'sql',
    difficulty: 3,
    tech: ['sql'],
    topicIds: ['db-modeling'],
    monthNo: 4,
    weekNo: 14,
    statement: `Учебная программа советует тренироваться на разных предметных областях: на экзамене может попасться другой вариант.

Спроектируйте базу для системы записи на курсы. Требования те же, что и в исходном задании: регистрация с уникальным логином, запись на курс с выбором даты старта и способа оплаты, статусы записи, отзывы.

Таблицы: \`users\`, \`courses\`, \`payment_methods\`, \`enrollments\`, \`reviews\`.

- \`courses\`: \`id\`, \`title\` (обязательный, уникальный), \`hours\` (целое, обязательное).
- \`enrollments\`: \`id\`, \`user_id\`, \`course_id\`, \`payment_id\` (внешние ключи), \`start_date\`, \`status\` (по умолчанию «Новая»).
- \`reviews\`: \`id\`, \`enrollment_id\` (уникальный внешний ключ), \`text\`.

Остальное — как в «Конференции.РФ». Задача — убедиться, что скелет действительно переносится на любую тему.`,
    requirements: [
      'Пять таблиц с правильными связями',
      'Логин уникален',
      'Статус по умолчанию «Новая»',
      'У курса есть количество часов',
      'Один отзыв на одну запись',
    ],
    starterCode: `CREATE TABLE users (
  -- ваш код
);

CREATE TABLE courses (
  -- ваш код
);

CREATE TABLE payment_methods (
  -- ваш код
);

CREATE TABLE enrollments (
  -- ваш код
);

CREATE TABLE reviews (
  -- ваш код
);`,
    tests: [
      {
        id: 't1',
        name: 'Таблица пользователей',
        type: 'sql-schema',
        table: 'users',
        columns: [
          { name: 'id', pk: true },
          { name: 'login', notNull: true },
          { name: 'password_hash', notNull: true },
          { name: 'full_name', notNull: true },
        ],
        points: 4,
      },
      {
        id: 't2',
        name: 'Курсы с количеством часов',
        type: 'sql-schema',
        table: 'courses',
        columns: [
          { name: 'id', pk: true },
          { name: 'title', notNull: true },
          { name: 'hours', type: 'INT', notNull: true },
        ],
        points: 5,
      },
      {
        id: 't3',
        name: 'Записи со связями',
        type: 'sql-schema',
        table: 'enrollments',
        columns: [
          { name: 'id', pk: true },
          { name: 'user_id', notNull: true },
          { name: 'course_id', notNull: true },
          { name: 'payment_id', notNull: true },
          { name: 'start_date', notNull: true },
          { name: 'status', notNull: true },
        ],
        foreignKeys: [
          { column: 'user_id', refTable: 'users' },
          { column: 'course_id', refTable: 'courses' },
          { column: 'payment_id', refTable: 'payment_methods' },
        ],
        points: 6,
      },
      {
        id: 't4',
        name: 'Статус по умолчанию',
        type: 'sql-query',
        check: `INSERT INTO users (login, password_hash, full_name, phone, email) VALUES ('student1', 'h', 'Студент', '+7', 's@e.ru');
INSERT INTO courses (title, hours) VALUES ('Веб-разработка', 144);
INSERT INTO payment_methods (title) VALUES ('Наличные');
INSERT INTO enrollments (user_id, course_id, payment_id, start_date) VALUES (1, 1, 1, '2026-10-01');
SELECT status FROM enrollments WHERE id = 1`,
        expectedRows: [['Новая']],
        points: 5,
      },
      {
        id: 't5',
        name: 'Отзыв один на запись',
        type: 'sql-schema',
        table: 'reviews',
        columns: [
          { name: 'id', pk: true },
          { name: 'enrollment_id', notNull: true },
          { name: 'text', notNull: true },
        ],
        foreignKeys: [{ column: 'enrollment_id', refTable: 'enrollments' }],
        points: 5,
      },
    ],
    hints: [
      { level: 1, text: 'Это та же схема, что в «Конференции.РФ»: меняются только названия. rooms → courses, applications → enrollments.', penaltyPercent: 10 },
      { level: 2, text: 'Новое поле только одно: hours INT NOT NULL в таблице курсов.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'Перепишите свою схему из задания «Схема базы данных Конференции.РФ», заменив названия и добавив столбец hours.',
        penaltyPercent: 35,
      },
    ],
    solution: `CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  login         VARCHAR(50)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(150) NOT NULL,
  phone         VARCHAR(30)  NOT NULL,
  email         VARCHAR(150) NOT NULL,
  role          VARCHAR(10)  NOT NULL DEFAULT 'user'
);

CREATE TABLE courses (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL UNIQUE,
  hours INT NOT NULL
);

CREATE TABLE payment_methods (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE enrollments (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  course_id  INT NOT NULL,
  payment_id INT NOT NULL,
  start_date DATE NOT NULL,
  status     VARCHAR(30) NOT NULL DEFAULT 'Новая',
  FOREIGN KEY (user_id)    REFERENCES users(id),
  FOREIGN KEY (course_id)  REFERENCES courses(id),
  FOREIGN KEY (payment_id) REFERENCES payment_methods(id)
);

CREATE TABLE reviews (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  enrollment_id INT NOT NULL UNIQUE,
  text          TEXT NOT NULL,
  FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE
);`,
    solutionExplanation:
      'Изменились три названия и добавилось одно поле. Это и есть смысл универсального скелета: на экзамене вы не проектируете базу с нуля, а подставляете названия из своего варианта.',
    maxScore: 25,
    estimatedMinutes: 30,
    examRefs: ['m1-db', 'm3-db'],
    planDays: ['day-14-5'],
    source: 'plan',
  },
];
