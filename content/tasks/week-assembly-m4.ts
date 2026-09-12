import type { Task } from '../types';

/** Сборки недель 13-16: база данных, сервер, авторизация. */
export const WEEK_ASSEMBLY_M4: Task[] = [
  {
    id: 'task-week-13-assembly',
    title: 'Сборка недели 13: база для незнакомой темы за 30 минут',
    kind: 'db',
    runtime: 'sql',
    difficulty: 4,
    tech: ['sql'],
    topicIds: ['db-relational', 'db-relations', 'db-normalization', 'db-er-diagram'],
    monthNo: 4,
    weekNo: 13,
    statement: `На экзамене тему объявляют в начале, и она будет не про конференции. Проверим главное умение недели: спроектировать базу для темы, которую видишь впервые.

Тема — **запись в автосервис**. **30 минут**, без подсказок.

1. \`clients\` — \`id\`, \`phone\` (текст, обязательный, уникальный), \`full_name\` (обязательный), \`car_model\` (обязательный).
2. \`works\` — справочник работ: \`id\`, \`title\` (обязательный, уникальный), \`price\` (дробное с копейками, обязательное), \`duration_minutes\` (целое, обязательное).
3. \`masters\` — \`id\`, \`full_name\` (обязательный), \`grade\` (обязательный).
4. \`visits\` — записи: \`id\`, \`client_id\`, \`work_id\`, \`master_id\` (все обязательные внешние ключи), \`visit_date\` (обязательная), \`status\` (по умолчанию \`'Записан'\`).
5. Заполните справочники: три работы и два мастера. Добавьте одного клиента и две его записи.

Проверка смотрит на то же, что и эксперт: есть ли ключи, правильно ли выбраны типы и работают ли связи.`,
    requirements: [
      'Четыре таблицы с первичными ключами',
      'Телефон клиента текстовый и уникальный',
      'Цена работы хранит копейки',
      'У записи три внешних ключа',
      'Статус по умолчанию «Записан»',
      'Справочники заполнены, добавлены клиент и две записи',
    ],
    starterCode: `-- Автосервис: спроектируйте базу с нуля за 30 минут

`,
    tests: [
      {
        id: 'clients',
        name: 'Таблица клиентов',
        type: 'sql-schema',
        table: 'clients',
        columns: [
          { name: 'id', pk: true },
          { name: 'phone', notNull: true },
          { name: 'full_name', notNull: true },
          { name: 'car_model', notNull: true },
        ],
        points: 3,
      },
      {
        id: 'phone-unique',
        name: 'Телефон уникален',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM pragma_index_list('clients') WHERE "unique" = 1`,
        expectedRows: [[1]],
        points: 3,
      },
      {
        id: 'works',
        name: 'Справочник работ',
        type: 'sql-schema',
        table: 'works',
        columns: [
          { name: 'id', pk: true },
          { name: 'title', notNull: true },
          { name: 'price', notNull: true },
          { name: 'duration_minutes', notNull: true },
        ],
        points: 3,
      },
      {
        id: 'visits',
        name: 'Запись связана с тремя таблицами',
        type: 'sql-schema',
        table: 'visits',
        columns: [
          { name: 'id', pk: true },
          { name: 'client_id', notNull: true },
          { name: 'work_id', notNull: true },
          { name: 'master_id', notNull: true },
          { name: 'visit_date', notNull: true },
          { name: 'status', notNull: true },
        ],
        foreignKeys: [
          { column: 'client_id', refTable: 'clients' },
          { column: 'work_id', refTable: 'works' },
          { column: 'master_id', refTable: 'masters' },
        ],
        points: 5,
      },
      {
        id: 'catalogs',
        name: 'Справочники заполнены',
        type: 'sql-query',
        check: `SELECT (SELECT COUNT(*) FROM works), (SELECT COUNT(*) FROM masters)`,
        expectedRows: [[3, 2]],
        points: 4,
      },
      {
        id: 'default-status',
        name: 'Статус по умолчанию «Записан»',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM visits WHERE status = 'Записан'`,
        expectedRows: [[2]],
        points: 3,
      },
      {
        id: 'links',
        name: 'Связи рабочие',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM visits v JOIN clients c ON c.id = v.client_id JOIN works w ON w.id = v.work_id JOIN masters m ON m.id = v.master_id`,
        expectedRows: [[2]],
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Скелет тот же: люди, справочник основного ресурса, исполнители, сами записи. Меняются только названия.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Телефон — текст: в нём есть плюс и скобки, а ведущий ноль число потеряет. Длительность — целое число минут.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Записи добавляйте без столбца status, чтобы сработало значение по умолчанию: INSERT INTO visits (client_id, work_id, master_id, visit_date) VALUES (1, 1, 1, "2027-03-12");',
        penaltyPercent: 35,
      },
    ],
    solution: `CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(30) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL,
  car_model VARCHAR(100) NOT NULL
);

CREATE TABLE works (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INT NOT NULL
);

CREATE TABLE masters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  grade VARCHAR(50) NOT NULL
);

CREATE TABLE visits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  work_id INT NOT NULL,
  master_id INT NOT NULL,
  visit_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Записан',
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (work_id) REFERENCES works(id),
  FOREIGN KEY (master_id) REFERENCES masters(id)
);

INSERT INTO works (id, title, price, duration_minutes) VALUES
  (1, 'Замена масла', 1900.50, 40),
  (2, 'Диагностика подвески', 2500.00, 60),
  (3, 'Шиномонтаж', 3200.00, 90);

INSERT INTO masters (id, full_name, grade) VALUES
  (1, 'Сидоров Сергей Сергеевич', 'Мастер'),
  (2, 'Кузнецов Кирилл Кириллович', 'Старший мастер');

INSERT INTO clients (id, phone, full_name, car_model) VALUES
  (1, '+7 (900) 123-45-67', 'Иванов Иван Иванович', 'Lada Vesta');

INSERT INTO visits (client_id, work_id, master_id, visit_date) VALUES
  (1, 1, 1, '2027-03-12'),
  (1, 3, 2, '2027-04-02');`,
    solutionExplanation:
      'Тема новая, а структура прежняя: люди, справочник услуг, исполнители и записи, связывающие всё вместе. Мастера — тоже справочник, просто из людей, и связан с записями так же, как работы. Длительность хранится числом минут, а не строкой «40 минут»: по числу можно посчитать загрузку дня, по строке — нет. На проектирование такой базы уходит около десяти минут, если скелет уже в голове, и около часа, если придумывать его заново на экзамене.',
    maxScore: 26,
    estimatedMinutes: 30,
    examRefs: ['m1-db', 'm1-er', 'm3-db'],
    planDays: ['day-13-7'],
    source: 'plan',
  },

  {
    id: 'task-week-14-assembly',
    title: 'Сборка недели 14: схема «Конференции.РФ» по памяти',
    kind: 'db',
    runtime: 'sql',
    difficulty: 4,
    tech: ['sql'],
    topicIds: ['db-modeling', 'sql-create-table', 'db-dump'],
    monthNo: 4,
    weekNo: 14,
    statement: `Пишем схему проекта целиком, не подглядывая в свои файлы. Это тот самый файл, который на экзамене создаётся в первые полчаса первого модуля.

Пять таблиц:

1. \`users\` — \`id\`, \`login\` (обязательный, уникальный), \`password_hash\`, \`full_name\`, \`phone\`, \`email\` (обязательные), \`role\` (по умолчанию \`'user'\`).
2. \`rooms\` — \`id\`, \`title\` (обязательный, уникальный).
3. \`payment_methods\` — \`id\`, \`title\` (обязательный, уникальный).
4. \`applications\` — \`id\`, \`user_id\`, \`room_id\`, \`payment_id\` (обязательные внешние ключи), \`start_date\` (обязательная), \`status\` (по умолчанию \`'Новая'\`).
5. \`reviews\` — \`id\`, \`application_id\` (обязательный уникальный внешний ключ), \`text\` (обязательный).

Заполните справочники: три помещения и три способа оплаты. Добавьте двух пользователей (одного с ролью \`admin\`) и три заявки.`,
    requirements: [
      'Пять таблиц с первичными ключами и связями',
      'Логин уникален, роль по умолчанию user',
      'У заявки три внешних ключа и статус по умолчанию «Новая»',
      'Один отзыв на заявку',
      'Справочники заполнены',
      'Есть пользователь с ролью admin и три заявки',
    ],
    starterCode: `-- Схема «Конференции.РФ» по памяти

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
          { name: 'password_hash', notNull: true },
          { name: 'full_name', notNull: true },
          { name: 'phone', notNull: true },
          { name: 'email', notNull: true },
          { name: 'role', notNull: true },
        ],
        points: 4,
      },
      {
        id: 'applications',
        name: 'Заявка связана с тремя таблицами',
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
        id: 'reviews-unique',
        name: 'Отзыв на заявку только один',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM pragma_index_list('reviews') WHERE "unique" = 1`,
        expectedRows: [[1]],
        points: 3,
      },
      {
        id: 'catalogs',
        name: 'Справочники заполнены',
        type: 'sql-query',
        check: `SELECT (SELECT COUNT(*) FROM rooms), (SELECT COUNT(*) FROM payment_methods)`,
        expectedRows: [[3, 3]],
        points: 4,
      },
      {
        id: 'roles',
        name: 'Роль по умолчанию и администратор',
        type: 'sql-query',
        check: `SELECT role, COUNT(*) FROM users GROUP BY role ORDER BY role`,
        expectedRows: [
          ['admin', 1],
          ['user', 1],
        ],
        ordered: true,
        points: 5,
      },
      {
        id: 'applications-data',
        name: 'Три заявки со статусом «Новая»',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM applications WHERE status = 'Новая'`,
        expectedRows: [[3]],
        points: 4,
      },
      {
        id: 'links',
        name: 'Все связи заявок рабочие',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM applications a JOIN users u ON u.id = a.user_id JOIN rooms r ON r.id = a.room_id JOIN payment_methods p ON p.id = a.payment_id`,
        expectedRows: [[3]],
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Порядок создания: users, rooms, payment_methods — затем applications — затем reviews. Ссылаться можно только на созданное.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Обычного пользователя добавляйте без столбца role, чтобы сработало значение по умолчанию, а администратору укажите role явно.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'role VARCHAR(20) NOT NULL DEFAULT "user" и status VARCHAR(50) NOT NULL DEFAULT "Новая" — два места, где значение по умолчанию экономит строки в INSERT.',
        penaltyPercent: 35,
      },
    ],
    solution: `CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(120) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user'
);

CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE payment_methods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  payment_id INT NOT NULL,
  start_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Новая',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id),
  FOREIGN KEY (payment_id) REFERENCES payment_methods(id)
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL UNIQUE,
  text TEXT NOT NULL,
  FOREIGN KEY (application_id) REFERENCES applications(id)
);

INSERT INTO rooms (id, title) VALUES (1, 'Аудитория на 100 мест'), (2, 'Коворкинг'), (3, 'Кинозал');

INSERT INTO payment_methods (id, title) VALUES (1, 'Наличными'), (2, 'Картой'), (3, 'Переводом');

INSERT INTO users (id, login, password_hash, full_name, phone, email) VALUES
  (1, 'ivanov26', 'hash', 'Иванов Иван Иванович', '+79990000001', 'ivanov@example.com');

INSERT INTO users (id, login, password_hash, full_name, phone, email, role) VALUES
  (2, 'Admin26', 'hash', 'Администратор', '+79990000002', 'admin@example.com', 'admin');

INSERT INTO applications (user_id, room_id, payment_id, start_date) VALUES
  (1, 2, 2, '2027-03-12'),
  (1, 3, 1, '2027-03-28'),
  (1, 1, 3, '2027-04-19');`,
    solutionExplanation:
      'Два отдельных INSERT в users — не небрежность, а способ показать работу значения по умолчанию: первый пользователь роль не указывает и получает «user», второму она задана явно. Пароль хранится в столбце password_hash, а не password: это напоминание себе, что в базу кладут отпечаток пароля, а не сам пароль. Заявки добавлены без статуса по той же причине — так проверяется, что DEFAULT действительно написан, а не забыт.',
    maxScore: 30,
    estimatedMinutes: 35,
    examRefs: ['m1-db', 'm3-db', 'm1-admin'],
    planDays: ['day-14-7'],
    source: 'plan',
  },

  {
    id: 'task-week-15-assembly',
    title: 'Сборка недели 15: сервер с базой за 40 минут',
    kind: 'api',
    runtime: 'js',
    difficulty: 4,
    tech: ['express', 'sql', 'node'],
    topicIds: ['express-basics', 'express-params', 'express-mysql', 'server-validation'],
    monthNo: 4,
    weekNo: 15,
    statement: `**40 минут** на два рабочих адреса, которые ходят в базу. Всё как на экзамене: проверка входных данных, параметры вместо склейки, понятные коды ответов.

\`db.query(sql, params)\` возвращает промис.

1. \`getApplications(db)\` — возвращает обработчик \`(req, res)\`. Берёт \`req.user.id\` и отвечает списком заявок этого пользователя. Если \`req.user\` нет — код \`401\` и \`{ error: 'Требуется вход' }\`.
2. \`createApplication(db)\` — возвращает обработчик \`(req, res)\`. Читает \`req.body\` с полями \`roomId\` и \`date\`.
   - нет \`req.user\` → \`401\`;
   - не заполнено любое из полей → \`400\` и \`{ error: 'Укажите помещение и дату' }\`;
   - дата не в формате \`ГГГГ-ММ-ДД\` → \`400\` и \`{ error: 'Неверный формат даты' }\`;
   - иначе вставляет заявку и отвечает кодом \`201\` и \`{ id }\`.
3. Проверки идут **до** обращения к базе: лишний запрос при заведомо неверных данных не нужен.

Оба обработчика асинхронные: если база отвечает ошибкой, обработчик отвечает кодом \`500\` и \`{ error: 'Ошибка сервера' }\`.`,
    requirements: [
      'Без входа оба адреса отвечают 401',
      'Свои заявки отдаются списком',
      'Незаполненные поля дают 400 до обращения к базе',
      'Неверный формат даты даёт 400',
      'Созданная заявка отвечает кодом 201 и номером',
      'Ошибка базы превращается в 500, а не роняет сервер',
    ],
    starterCode: `function getApplications(db) {
  return async function (req, res) {
    // ваш код
  };
}

function createApplication(db) {
  return async function (req, res) {
    // ваш код
  };
}`,
    tests: [
      {
        id: 'unauthorized',
        name: 'Без входа — 401',
        type: 'assert',
        code: `const getApplications = ctx.get('getApplications');
const createApplication = ctx.get('createApplication');
const make = () => { const state = { code: 200, body: null }; state.res = { status: (c) => { state.code = c; return state.res; }, json: (b) => { state.body = b; return state.res; } }; return state; };
const db = { query: () => Promise.reject(new Error('к базе обращаться не должны')) };
const a = make();
const b = make();
return Promise.all([
  getApplications(db)({}, a.res),
  createApplication(db)({ body: { roomId: 1, date: '2027-03-12' } }, b.res),
]).then(function () {
  ctx.assert(a.code === 401, 'Список заявок без входа должен давать 401, сейчас: ' + a.code, 401, a.code);
  ctx.assert(b.code === 401, 'Создание заявки без входа должно давать 401, сейчас: ' + b.code, 401, b.code);
});`,
        points: 4,
      },
      {
        id: 'list',
        name: 'Свои заявки отдаются списком',
        type: 'assert',
        code: `const getApplications = ctx.get('getApplications');
const calls = [];
const db = { query: (sql, params) => { calls.push({ sql, params }); return Promise.resolve([{ id: 1 }, { id: 2 }]); } };
let body = null;
const res = { status: () => res, json: (data) => { body = data; return res; } };
return getApplications(db)({ user: { id: 5 } }, res).then(function () {
  ctx.assert(Array.isArray(body) && body.length === 2, 'Ожидался массив из двух заявок, получено: ' + ctx.preview(body));
  ctx.assert(calls[0].params && calls[0].params[0] === 5, 'Номер пользователя должен уйти параметром, сейчас: ' + ctx.preview(calls[0].params));
});`,
        points: 4,
      },
      {
        id: 'validation',
        name: 'Пустые поля дают 400 без запроса к базе',
        type: 'assert',
        code: `const createApplication = ctx.get('createApplication');
let called = false;
const db = { query: () => { called = true; return Promise.resolve({ insertId: 1 }); } };
let code = 200;
let body = null;
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return createApplication(db)({ user: { id: 1 }, body: { roomId: '', date: '' } }, res).then(function () {
  ctx.assert(code === 400, 'Ожидался код 400, сейчас: ' + code, 400, code);
  ctx.assert(body && body.error === 'Укажите помещение и дату', 'Текст ошибки не совпадает: ' + ctx.preview(body));
  ctx.assert(called === false, 'При заведомо неверных данных запрос к базе не нужен');
});`,
        points: 5,
      },
      {
        id: 'date-format',
        name: 'Неверный формат даты не проходит',
        type: 'assert',
        code: `const createApplication = ctx.get('createApplication');
const db = { query: () => Promise.resolve({ insertId: 1 }) };
let code = 200;
let body = null;
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return createApplication(db)({ user: { id: 1 }, body: { roomId: 2, date: '12.03.2027' } }, res).then(function () {
  ctx.assert(code === 400, 'Дата в формате ДД.ММ.ГГГГ приходить на сервер не должна, ожидался 400, сейчас: ' + code);
  ctx.assert(body && body.error === 'Неверный формат даты', 'Текст ошибки не совпадает: ' + ctx.preview(body));
});`,
        points: 5,
      },
      {
        id: 'created',
        name: 'Заявка создаётся с кодом 201',
        type: 'assert',
        code: `const createApplication = ctx.get('createApplication');
const calls = [];
const db = { query: (sql, params) => { calls.push({ sql, params }); return Promise.resolve({ insertId: 17 }); } };
let code = 200;
let body = null;
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return createApplication(db)({ user: { id: 4 }, body: { roomId: 2, date: '2027-03-12' } }, res).then(function () {
  ctx.assert(code === 201, 'Созданный объект отвечает кодом 201, сейчас: ' + code, 201, code);
  ctx.assert(body && body.id === 17, 'В ответе должен быть номер новой заявки, получено: ' + ctx.preview(body));
  ctx.assert(calls[0].params && calls[0].params.length === 3, 'В запрос передаются три значения');
  ctx.assert(calls[0].sql.indexOf('2027-03-12') === -1, 'Дата не должна попадать в текст запроса');
});`,
        points: 5,
      },
      {
        id: 'db-error',
        name: 'Ошибка базы превращается в 500',
        type: 'assert',
        code: `const getApplications = ctx.get('getApplications');
const db = { query: () => Promise.reject(new Error('соединение потеряно')) };
let code = 200;
let body = null;
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return getApplications(db)({ user: { id: 1 } }, res).then(function () {
  ctx.assert(code === 500, 'Ошибку базы нужно поймать и ответить 500, сейчас: ' + code, 500, code);
  ctx.assert(body && body.error === 'Ошибка сервера', 'Текст ошибки не совпадает: ' + ctx.preview(body));
  ctx.assert(
    String(ctx.preview(body)).indexOf('соединение потеряно') === -1,
    'Подробности ошибки базы наружу не отдают: по ним видно устройство сервера',
  );
});`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Формат даты проверяется одним выражением: /^\\d{4}-\\d{2}-\\d{2}$/.test(date).',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Оберните работу с базой в try/catch. В catch — res.status(500).json({ error: "Ошибка сервера" }).',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'if (!req.user) return res.status(401).json({ error: "Требуется вход" }); — и дальше по одной проверке на строку, каждая с return.',
        penaltyPercent: 35,
      },
    ],
    solution: `function getApplications(db) {
  return async function (req, res) {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется вход' });
    }

    try {
      const rows = await db.query('SELECT * FROM applications WHERE user_id = ? ORDER BY id', [req.user.id]);
      return res.json(rows);
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  };
}

function createApplication(db) {
  return async function (req, res) {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется вход' });
    }

    const body = req.body || {};
    const roomId = body.roomId;
    const date = body.date;

    if (!roomId || !date) {
      return res.status(400).json({ error: 'Укажите помещение и дату' });
    }

    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(String(date))) {
      return res.status(400).json({ error: 'Неверный формат даты' });
    }

    try {
      const result = await db.query(
        'INSERT INTO applications (user_id, room_id, start_date) VALUES (?, ?, ?)',
        [req.user.id, roomId, date],
      );

      return res.status(201).json({ id: result.insertId });
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  };
}`,
    solutionExplanation:
      'Проверки выстроены лесенкой от самой дешёвой к самой дорогой: сначала есть ли пользователь, потом заполнены ли поля, потом формат, и только затем запрос к базе. Каждая заканчивается return — без него выполнение пойдёт дальше и сервер попробует ответить дважды. Подробности ошибки базы наружу не отдаются намеренно: текст вроде «Unknown column applications.user_id» рассказывает постороннему устройство вашей базы. В журнал сервера их писать нужно, в ответ клиенту — нет.',
    maxScore: 28,
    estimatedMinutes: 40,
    examRefs: ['m1-cabinet', 'm1-order', 'm3-quality'],
    planDays: ['day-15-7'],
    source: 'plan',
  },

  {
    id: 'task-week-16-assembly',
    title: 'Контроль месяца 4: регистрация, вход и закрытая страница за 75 минут',
    kind: 'api',
    runtime: 'js',
    difficulty: 5,
    tech: ['express', 'security', 'node'],
    topicIds: ['auth-hashing', 'auth-jwt', 'auth-middleware', 'auth-roles'],
    monthNo: 4,
    weekNo: 16,
    statement: `Контроль за четвёртый месяц. **75 минут** на всю цепочку входа — от пароля до закрытой страницы.

Зависимости передаются параметрами: \`db\` с методом \`query\`, \`hasher\` с \`hash(password)\` и \`compare(password, hash)\`, \`tokens\` с \`sign(payload)\` и \`verify(token)\`. Все возвращают промисы, кроме \`tokens\`, который работает сразу.

1. \`register(deps)\` — обработчик. Проверяет логин (латиница и цифры, от 6 символов) и пароль (от 8 символов); при ошибке \`400\` и \`{ error: 'Проверьте логин и пароль' }\`. Затем смотрит, свободен ли логин: если занят — \`409\` и \`{ error: 'Логин занят' }\`. Иначе сохраняет **отпечаток** пароля и отвечает \`201\` и \`{ id }\`.
2. \`login(deps)\` — обработчик. Ищет пользователя, сверяет пароль. Если пользователя нет **или** пароль не подошёл — \`401\` и \`{ error: 'Неверный логин или пароль' }\`. Текст один и тот же в обоих случаях: по разным сообщениям подбирают существующие логины. При успехе — \`{ token }\`, где в токене \`{ id, role }\`.
3. \`authMiddleware(tokens)\` — \`(req, res, next)\`. Берёт заголовок \`authorization\` вида \`Bearer <токен>\`, проверяет его и кладёт данные в \`req.user\`. Нет заголовка или токен плохой — \`401\` и \`{ error: 'Требуется вход' }\`, \`next()\` не вызывается.
4. \`requireAdmin(req, res, next)\` — пускает дальше только при \`req.user.role === 'admin'\`, иначе \`403\` и \`{ error: 'Недостаточно прав' }\`.

Пароль в открытом виде в базу попасть не должен — проверка смотрит и на это.`,
    requirements: [
      'Регистрация проверяет логин и пароль до обращения к базе',
      'Занятый логин даёт 409',
      'В базу сохраняется отпечаток пароля, а не сам пароль',
      'Неверный логин и неверный пароль дают одинаковый ответ 401',
      'Успешный вход возвращает токен с id и ролью',
      'Проверка токена кладёт данные в req.user',
      'Без прав администратора доступ закрыт кодом 403',
    ],
    starterCode: `function register(deps) {
  return async function (req, res) {
    // проверки, занятость логина, отпечаток пароля
  };
}

function login(deps) {
  return async function (req, res) {
    // сверка пароля и выдача токена
  };
}

function authMiddleware(tokens) {
  return function (req, res, next) {
    // Bearer-токен из заголовка
  };
}

function requireAdmin(req, res, next) {
  // только для роли admin
}`,
    tests: [
      {
        id: 'register-validation',
        name: 'Регистрация проверяет данные до базы',
        type: 'assert',
        code: `const register = ctx.get('register');
let called = false;
const deps = {
  db: { query: () => { called = true; return Promise.resolve([]); } },
  hasher: { hash: () => Promise.resolve('hashed') },
  tokens: { sign: () => 'token' },
};
let code = 200;
let body = null;
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return register(deps)({ body: { login: 'ив', password: '123' } }, res).then(function () {
  ctx.assert(code === 400, 'Ожидался код 400, сейчас: ' + code, 400, code);
  ctx.assert(body && body.error === 'Проверьте логин и пароль', 'Текст ошибки не совпадает: ' + ctx.preview(body));
  ctx.assert(called === false, 'При неверных данных к базе обращаться не нужно');
});`,
        points: 4,
      },
      {
        id: 'register-conflict',
        name: 'Занятый логин даёт 409',
        type: 'assert',
        code: `const register = ctx.get('register');
const deps = {
  db: { query: () => Promise.resolve([{ id: 1, login: 'ivanov26' }]) },
  hasher: { hash: () => Promise.resolve('hashed') },
  tokens: { sign: () => 'token' },
};
let code = 200;
let body = null;
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return register(deps)({ body: { login: 'ivanov26', password: 'demo2026pass' } }, res).then(function () {
  ctx.assert(code === 409, 'Занятый логин отвечает кодом 409, сейчас: ' + code, 409, code);
  ctx.assert(body && body.error === 'Логин занят', 'Текст ошибки не совпадает: ' + ctx.preview(body));
});`,
        points: 4,
      },
      {
        id: 'register-hash',
        name: 'В базу уходит отпечаток, а не пароль',
        type: 'assert',
        code: `const register = ctx.get('register');
const calls = [];
const deps = {
  db: {
    query: (sql, params) => {
      calls.push({ sql, params });
      if (String(sql).toUpperCase().indexOf('INSERT') !== -1) return Promise.resolve({ insertId: 3 });
      return Promise.resolve([]);
    },
  },
  hasher: { hash: (password) => Promise.resolve('hash:' + password) },
  tokens: { sign: () => 'token' },
};
let code = 200;
let body = null;
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return register(deps)({ body: { login: 'ivanov26', password: 'demo2026pass' } }, res).then(function () {
  ctx.assert(code === 201, 'Успешная регистрация отвечает кодом 201, сейчас: ' + code, 201, code);
  ctx.assert(body && body.id === 3, 'В ответе должен быть номер нового пользователя, получено: ' + ctx.preview(body));
  const insert = calls.filter((call) => String(call.sql).toUpperCase().indexOf('INSERT') !== -1)[0];
  ctx.assert(insert, 'Запрос INSERT не выполнен');
  const values = (insert.params || []).map(String);
  ctx.assert(
    values.indexOf('demo2026pass') === -1,
    'Пароль в открытом виде уходит в базу. Так нельзя: при утечке базы утекут и пароли',
  );
  ctx.assert(values.indexOf('hash:demo2026pass') !== -1, 'В базу должен уйти результат hasher.hash');
});`,
        points: 6,
      },
      {
        id: 'login-same-error',
        name: 'Неверный логин и неверный пароль отвечают одинаково',
        type: 'assert',
        code: `const login = ctx.get('login');
const make = () => { const state = { code: 200, body: null }; state.res = { status: (c) => { state.code = c; return state.res; }, json: (b) => { state.body = b; return state.res; } }; return state; };

const noUser = {
  db: { query: () => Promise.resolve([]) },
  hasher: { compare: () => Promise.resolve(true) },
  tokens: { sign: () => 'token' },
};
const wrongPassword = {
  db: { query: () => Promise.resolve([{ id: 1, login: 'ivanov26', password_hash: 'hash', role: 'user' }]) },
  hasher: { compare: () => Promise.resolve(false) },
  tokens: { sign: () => 'token' },
};

const a = make();
const b = make();
return Promise.all([
  login(noUser)({ body: { login: 'нет-такого', password: 'demo2026pass' } }, a.res),
  login(wrongPassword)({ body: { login: 'ivanov26', password: 'неверный' } }, b.res),
]).then(function () {
  ctx.assert(a.code === 401 && b.code === 401, 'Оба случая отвечают кодом 401, сейчас: ' + a.code + ' и ' + b.code);
  ctx.assert(
    a.body && b.body && a.body.error === b.body.error,
    'Ответы должны совпадать дословно, иначе по ним подберут существующие логины: «' +
      ctx.preview(a.body) + '» против «' + ctx.preview(b.body) + '»',
  );
});`,
        points: 6,
      },
      {
        id: 'login-token',
        name: 'Успешный вход выдаёт токен',
        type: 'assert',
        code: `const login = ctx.get('login');
let payload = null;
const deps = {
  db: { query: () => Promise.resolve([{ id: 9, login: 'Admin26', password_hash: 'hash', role: 'admin' }]) },
  hasher: { compare: () => Promise.resolve(true) },
  tokens: { sign: (data) => { payload = data; return 'signed-token'; } },
};
let body = null;
const res = { status: () => res, json: (b) => { body = b; return res; } };
return login(deps)({ body: { login: 'Admin26', password: 'demo2026pass' } }, res).then(function () {
  ctx.assert(body && body.token === 'signed-token', 'В ответе должен быть токен, получено: ' + ctx.preview(body));
  ctx.assert(payload && payload.id === 9, 'В токен кладётся номер пользователя');
  ctx.assert(payload && payload.role === 'admin', 'В токен кладётся роль');
  ctx.assert(
    !payload.password_hash && !payload.password,
    'Отпечаток пароля в токен класть нельзя: токен читается кем угодно',
  );
});`,
        points: 5,
      },
      {
        id: 'auth-middleware',
        name: 'Проверка токена',
        type: 'assert',
        code: `const authMiddleware = ctx.get('authMiddleware');
const tokens = { verify: (token) => (token === 'good' ? { id: 4, role: 'user' } : null) };
const middleware = authMiddleware(tokens);

const req = { headers: { authorization: 'Bearer good' } };
let passed = false;
middleware(req, { status: () => ({ json: () => {} }) }, () => { passed = true; });
ctx.assert(passed, 'С правильным токеном должен вызываться next()');
ctx.assert(req.user && req.user.id === 4, 'Данные из токена кладутся в req.user, сейчас: ' + ctx.preview(req.user));

let code = 200;
let calledNext = false;
const res = { status: (c) => { code = c; return res; }, json: () => res };
middleware({ headers: {} }, res, () => { calledNext = true; });
ctx.assert(code === 401, 'Без заголовка нужен код 401, сейчас: ' + code);
ctx.assert(calledNext === false, 'Без токена next() вызываться не должен');

code = 200;
middleware({ headers: { authorization: 'Bearer подделка' } }, res, () => {});
ctx.assert(code === 401, 'С плохим токеном нужен код 401, сейчас: ' + code);`,
        points: 6,
      },
      {
        id: 'require-admin',
        name: 'Права администратора',
        type: 'assert',
        code: `const requireAdmin = ctx.get('requireAdmin');
let passed = false;
requireAdmin({ user: { id: 1, role: 'admin' } }, { status: () => ({ json: () => {} }) }, () => { passed = true; });
ctx.assert(passed, 'Администратора нужно пропустить дальше');

let code = 200;
let body = null;
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
let calledNext = false;
requireAdmin({ user: { id: 2, role: 'user' } }, res, () => { calledNext = true; });
ctx.assert(code === 403, 'Обычному пользователю нужен код 403, сейчас: ' + code, 403, code);
ctx.assert(body && body.error === 'Недостаточно прав', 'Текст ошибки не совпадает: ' + ctx.preview(body));
ctx.assert(calledNext === false, 'next() вызываться не должен');`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Токен из заголовка достаётся так: (req.headers.authorization || "").replace("Bearer ", "").',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Ответ при неверном логине и при неверном пароле пишите одной константой — тогда они гарантированно совпадут.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const rows = await db.query("SELECT * FROM users WHERE login = ?", [login]); const user = rows[0]; const ok = user && await hasher.compare(password, user.password_hash); if (!ok) return res.status(401).json({ error: "Неверный логин или пароль" });',
        penaltyPercent: 35,
      },
    ],
    solution: `const BAD_CREDENTIALS = 'Неверный логин или пароль';

function register(deps) {
  return async function (req, res) {
    const body = req.body || {};
    const login = String(body.login || '');
    const password = String(body.password || '');

    if (!/^[A-Za-z0-9]{6,}$/.test(login) || password.length < 8) {
      return res.status(400).json({ error: 'Проверьте логин и пароль' });
    }

    try {
      const existing = await deps.db.query('SELECT id FROM users WHERE login = ?', [login]);

      if (existing.length > 0) {
        return res.status(409).json({ error: 'Логин занят' });
      }

      const passwordHash = await deps.hasher.hash(password);
      const result = await deps.db.query(
        'INSERT INTO users (login, password_hash) VALUES (?, ?)',
        [login, passwordHash],
      );

      return res.status(201).json({ id: result.insertId });
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  };
}

function login(deps) {
  return async function (req, res) {
    const body = req.body || {};

    try {
      const rows = await deps.db.query('SELECT * FROM users WHERE login = ?', [body.login]);
      const user = rows[0];

      if (!user) {
        return res.status(401).json({ error: BAD_CREDENTIALS });
      }

      const ok = await deps.hasher.compare(String(body.password || ''), user.password_hash);

      if (!ok) {
        return res.status(401).json({ error: BAD_CREDENTIALS });
      }

      return res.json({ token: deps.tokens.sign({ id: user.id, role: user.role }) });
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  };
}

function authMiddleware(tokens) {
  return function (req, res, next) {
    const header = (req.headers && req.headers.authorization) || '';

    if (header.indexOf('Bearer ') !== 0) {
      return res.status(401).json({ error: 'Требуется вход' });
    }

    const payload = tokens.verify(header.slice('Bearer '.length));

    if (!payload) {
      return res.status(401).json({ error: 'Требуется вход' });
    }

    req.user = payload;
    return next();
  };
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Недостаточно прав' });
  }

  return next();
}`,
    solutionExplanation:
      'Одинаковый текст ошибки при неверном логине и неверном пароле вынесен в константу — так они не разойдутся при правке. Смысл в том, что разные сообщения превращают форму входа в справочник существующих логинов: подобрав список, злоумышленник дальше подбирает только пароли. Разница между 401 и 403 тоже содержательная: 401 значит «я не знаю, кто вы», 403 — «я знаю, кто вы, и вам сюда нельзя». Роль кладётся в токен, чтобы не ходить за ней в базу на каждом запросе, а отпечаток пароля в токен не попадает: содержимое токена читается без всякого ключа.',
    maxScore: 36,
    estimatedMinutes: 75,
    timeLimitMs: 4_500_000,
    examRefs: ['m1-register', 'm1-login', 'm1-admin', 'm3-quality'],
    planDays: ['day-16-7'],
    source: 'plan',
  },
];
