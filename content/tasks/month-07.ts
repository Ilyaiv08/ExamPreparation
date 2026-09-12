import type { Task } from '../types';

/**
 * Месяц 7, недели 25–30: режим экзамена.
 *
 * Задания этого месяца — не про новые знания, а про скорость и память.
 * Всё, что здесь нужно написать, уже разбиралось раньше. Разница в том,
 * что теперь это пишется без подсказок и по нормативу времени.
 */
export const MONTH_07_TASKS: Task[] = [
  {
    id: 'task-exam-auth-middleware-speed',
    title: 'По памяти за 8 минут: проверка токена',
    kind: 'function',
    runtime: 'js',
    difficulty: 4,
    tech: ['express', 'security'],
    topicIds: ['memory-training', 'auth-middleware'],
    monthNo: 7,
    weekNo: 25,
    statement: `**Норматив: 8 минут.** Засеките время перед началом.

Напишите два middleware — те самые, что пишутся на экзамене в первые сорок минут.

\`\`\`js
createAuthMiddleware(verify)
\`\`\`
Возвращает функцию \`(req, res, next)\`. Она:

1. Берёт заголовок \`req.headers.authorization\` вида \`Bearer <токен>\`.
2. Если заголовка нет или он не начинается с \`Bearer \` — отвечает 401 и **не** вызывает \`next\`.
3. Иначе вызывает \`verify(token)\`. Если бросило исключение — 401.
4. При успехе кладёт результат в \`req.user\` и вызывает \`next()\`.

\`\`\`js
requireAdmin(req, res, next)
\`\`\`
Пропускает дальше только при \`req.user.role === 'admin'\`, иначе отвечает 403.

Объект \`res\` устроен как в Express: \`res.status(код).json(тело)\`, вызовы выстраиваются в цепочку.`,
    requirements: [
      'Без заголовка — 401 и next не вызывается',
      'При неверном токене — 401',
      'При успехе данные попадают в req.user',
      'requireAdmin пропускает только роль admin',
      'После ответа next не вызывается',
    ],
    starterCode: `function createAuthMiddleware(verify) {
  // верните функцию (req, res, next)
}

function requireAdmin(req, res, next) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Без заголовка — 401',
        type: 'assert',
        code: `let code = null;
let nextCalled = false;
const res = { status(c) { code = c; return this; }, json() { return this; } };
const middleware = ctx.get('createAuthMiddleware')(() => ({ id: 1 }));
middleware({ headers: {} }, res, () => { nextCalled = true; });
ctx.assert(code === 401, 'Без заголовка Authorization нужен статус 401', 401, code);
ctx.assert(!nextCalled, 'После ответа next вызывать нельзя');`,
        points: 5,
      },
      {
        id: 't2',
        name: 'Неверный токен — 401',
        type: 'assert',
        code: `let code = null;
let nextCalled = false;
const res = { status(c) { code = c; return this; }, json() { return this; } };
const middleware = ctx.get('createAuthMiddleware')(() => { throw new Error('invalid signature'); });
middleware({ headers: { authorization: 'Bearer broken.token' } }, res, () => { nextCalled = true; });
ctx.assert(code === 401, 'Если verify бросил исключение — 401', 401, code);
ctx.assert(!nextCalled, 'next при неверном токене вызывать нельзя');`,
        points: 5,
      },
      {
        id: 't3',
        name: 'Успех: req.user и next',
        type: 'assert',
        code: `let nextCalled = false;
let receivedToken = null;
const req = { headers: { authorization: 'Bearer abc.def.ghi' } };
const res = { status() { return this; }, json() { return this; } };
const middleware = ctx.get('createAuthMiddleware')((token) => { receivedToken = token; return { id: 7, role: 'user' }; });
middleware(req, res, () => { nextCalled = true; });
ctx.assert(receivedToken === 'abc.def.ghi', 'В verify должен уходить токен без слова Bearer', 'abc.def.ghi', receivedToken);
ctx.assert(req.user && req.user.id === 7, 'Результат verify должен попасть в req.user');
ctx.assert(nextCalled, 'При успехе нужно вызвать next()');`,
        points: 6,
      },
      {
        id: 't4',
        name: 'Заголовок без слова Bearer — 401',
        type: 'assert',
        code: `let code = null;
const res = { status(c) { code = c; return this; }, json() { return this; } };
const middleware = ctx.get('createAuthMiddleware')(() => ({ id: 1 }));
middleware({ headers: { authorization: 'abc.def.ghi' } }, res, () => {});
ctx.assert(code === 401, 'Заголовок без префикса Bearer принимать не нужно', 401, code);`,
        points: 4,
      },
      {
        id: 't5',
        name: 'requireAdmin пропускает администратора',
        type: 'assert',
        code: `let nextCalled = false;
const res = { status() { return this; }, json() { return this; } };
ctx.get('requireAdmin')({ user: { id: 1, role: 'admin' } }, res, () => { nextCalled = true; });
ctx.assert(nextCalled, 'Администратора нужно пропустить дальше');`,
        points: 4,
      },
      {
        id: 't6',
        name: 'requireAdmin не пропускает пользователя',
        type: 'assert',
        code: `let code = null;
let nextCalled = false;
const res = { status(c) { code = c; return this; }, json() { return this; } };
ctx.get('requireAdmin')({ user: { id: 7, role: 'user' } }, res, () => { nextCalled = true; });
ctx.assert(code === 403, 'Роли не хватает — статус 403, а не 401', 403, code);
ctx.assert(!nextCalled, 'next вызывать нельзя');
let code2 = null;
ctx.get('requireAdmin')({}, { status(c) { code2 = c; return this; }, json() { return this; } }, () => {});
ctx.assert(code2 === 403 || code2 === 401, 'Запрос без req.user тоже пропускать нельзя');`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Это задание на память, а не на сообразительность. Если не получается — откройте тему про middleware, разберите, закройте и напишите заново по памяти.',
        penaltyPercent: 15,
      },
      {
        level: 2,
        text: 'Извлечение токена: `const header = req.headers.authorization || ""; if (!header.startsWith("Bearer ")) return res.status(401).json(...)`.',
        penaltyPercent: 30,
      },
      {
        level: 3,
        text: '`verify` бросает исключение, поэтому вызов обязательно в try/catch. И обратите внимание на `return` перед `res.status(...)`: без него выполнение продолжится и дойдёт до `next()`.',
        penaltyPercent: 45,
      },
    ],
    solution: `function createAuthMiddleware(verify) {
  return function authMiddleware(req, res, next) {
    const header = req.headers.authorization || '';

    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Требуется вход' });
    }

    const token = header.slice('Bearer '.length);

    try {
      req.user = verify(token);
    } catch (error) {
      return res.status(401).json({ message: 'Сессия истекла, войдите заново' });
    }

    return next();
  };
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Действие доступно только администратору' });
  }
  return next();
}`,
    solutionExplanation: `Восемь минут — это норматив не потому, что задача сложная, а потому что на экзамене она должна писаться на автомате.

**\`return\` перед ответом.** Самая частая ошибка в middleware: написать \`res.status(401).json(...)\` без \`return\`. Функция не остановится, дойдёт до \`next()\` — и запрос отправится дальше по цепочке. Express попытается ответить второй раз и выдаст «Cannot set headers after they are sent». Ошибка выглядит загадочно, а причина всегда одна.

**Токен извлекается срезом, а не \`split\`.** \`split(' ')[1]\` тоже работает, но ломается на пробелах внутри значения. \`slice\` предсказуемее, а проверка \`startsWith('Bearer ')\` заодно отсекает заголовки без префикса.

**\`verify\` обязательно в try/catch.** Просроченный или подделанный токен бросает исключение. Без перехвата оно уйдёт в обработчик ошибок Express и превратится в 500 — а это неверный код: сервер исправен, проблема у клиента.

**403, а не 401.** В \`requireAdmin\` пользователь уже опознан: токен разобран, роль известна. Не хватает именно прав, а не входа. Клиент реагирует по-разному: при 401 отправляет на форму входа, при 403 показывает сообщение о недостатке прав. Перепутать — значит выкинуть вошедшего пользователя на страницу входа без объяснений.

**Проверка \`!req.user\`.** Если \`requireAdmin\` случайно подключат без \`authMiddleware\`, обращение к \`req.user.role\` уронит сервер. Одна лишняя проверка страхует от ошибки подключения.

**Как подключать:** \`app.use('/api/admin', authMiddleware, requireAdmin, adminRouter)\` — один раз на всю группу. Тогда забыть проверку в новом маршруте физически невозможно.`,
    maxScore: 30,
    estimatedMinutes: 8,
    timeLimitMs: 480000,
    examRefs: ['m1-admin', 'm3-quality'],
    planDays: ['day-25-3'],
    source: 'plan',
  },

  {
    id: 'task-exam-date-speed',
    title: 'По памяти за 6 минут: дата ДД.ММ.ГГГГ',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['js'],
    topicIds: ['memory-training', 'js-dates'],
    monthNo: 7,
    weekNo: 25,
    statement: `**Норматив: 6 минут.**

Три функции, без которых не сдаётся форма заявки ни в одном варианте задания.

\`\`\`js
isValidDate(value)     // '15.03.2026' → true, '31.02.2026' → false
toDbDate(value)        // '15.03.2026' → '2026-03-15'
fromDbDate(value)      // '2026-03-15' → '15.03.2026'
\`\`\`

Правила:

- \`isValidDate\` проверяет и формат, и существование даты: 31 февраля не существует;
- \`toDbDate\` и \`fromDbDate\` возвращают \`null\`, если вход некорректен;
- ведущие нули сохраняются: \`'01.01.2026'\`, а не \`'1.1.2026'\`.`,
    requirements: [
      'Формат проверяется строго: ДД.ММ.ГГГГ',
      'Несуществующая дата не проходит',
      'Перевод работает в обе стороны',
      'Ведущие нули сохраняются',
      'Некорректный вход даёт null',
    ],
    starterCode: `function isValidDate(value) {
  // ваш код
}

function toDbDate(value) {
  // ваш код
}

function fromDbDate(value) {
  // ваш код
}`,
    tests: [
      { id: 't1', name: 'Корректная дата', type: 'call', entry: 'isValidDate', args: ['15.03.2026'], expected: true, points: 2 },
      { id: 't2', name: '31 февраля не существует', type: 'call', entry: 'isValidDate', args: ['31.02.2026'], expected: false, points: 4 },
      { id: 't3', name: '31 апреля не существует', type: 'call', entry: 'isValidDate', args: ['31.04.2026'], expected: false, points: 3 },
      { id: 't4', name: 'Неверный разделитель', type: 'call', entry: 'isValidDate', args: ['15/03/2026'], expected: false, points: 3 },
      { id: 't5', name: 'Без ведущих нулей не проходит', type: 'call', entry: 'isValidDate', args: ['1.3.2026'], expected: false, points: 3 },
      { id: 't6', name: '29 февраля високосного года', type: 'call', entry: 'isValidDate', args: ['29.02.2028'], expected: true, points: 4 },
      { id: 't7', name: '29 февраля обычного года', type: 'call', entry: 'isValidDate', args: ['29.02.2027'], expected: false, points: 4 },
      { id: 't8', name: 'toDbDate', type: 'call', entry: 'toDbDate', args: ['15.03.2026'], expected: '2026-03-15', points: 4 },
      { id: 't9', name: 'toDbDate с ведущими нулями', type: 'call', entry: 'toDbDate', args: ['01.01.2026'], expected: '2026-01-01', points: 3 },
      { id: 't10', name: 'toDbDate от мусора → null', type: 'call', entry: 'toDbDate', args: ['31.02.2026'], expected: null, points: 3 },
      { id: 't11', name: 'fromDbDate', type: 'call', entry: 'fromDbDate', args: ['2026-03-15'], expected: '15.03.2026', points: 4 },
      { id: 't12', name: 'fromDbDate от мусора → null', type: 'call', entry: 'fromDbDate', args: ['15.03.2026'], expected: null, points: 3 },
    ],
    hints: [
      {
        level: 1,
        text: 'Проверка в два шага: сначала форма записи регулярным выражением, потом существование через объект Date.',
        penaltyPercent: 15,
      },
      {
        level: 2,
        text: 'Регулярное выражение с якорями: `/^\\d{2}\\.\\d{2}\\.\\d{4}$/`. Без `^` и `$` строка «дата 15.03.2026 года» пройдёт проверку.',
        penaltyPercent: 30,
      },
      {
        level: 3,
        text: 'Существование: создать `new Date(year, month - 1, day)` и сверить `getDate()`, `getMonth()`, `getFullYear()` с исходными числами. Если дата «переехала» — значит, её не существовало. Високосные годы этот приём обрабатывает сам.',
        penaltyPercent: 45,
      },
    ],
    solution: `const UI_PATTERN = /^\\d{2}\\.\\d{2}\\.\\d{4}$/;
const DB_PATTERN = /^\\d{4}-\\d{2}-\\d{2}$/;

function isValidDate(value) {
  if (typeof value !== 'string' || !UI_PATTERN.test(value)) return false;

  const [day, month, year] = value.split('.').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function toDbDate(value) {
  if (!isValidDate(value)) return null;
  const [day, month, year] = value.split('.');
  return year + '-' + month + '-' + day;
}

function fromDbDate(value) {
  if (typeof value !== 'string' || !DB_PATTERN.test(value)) return null;

  const [year, month, day] = value.split('-');
  const check = day + '.' + month + '.' + year;
  return isValidDate(check) ? check : null;
}`,
    solutionExplanation: `Шесть минут — норматив, потому что это буквально три строки логики, повторённые в трёх функциях.

**Почему проверка в два шага.** Регулярное выражение видит только форму записи. Строка «31.02.2026» ему полностью соответствует — две цифры, точка, две цифры, точка, четыре цифры. Но такой даты не существует. Второй шаг ловит именно это.

**Как работает второй шаг.** \`new Date(2026, 1, 31)\` не бросает ошибку — он «переезжает» на 3 марта. Значит, достаточно сравнить, что получилось, с тем, что просили: если \`getDate()\` вернул 3 вместо 31, дата была несуществующей. Приятный побочный эффект — високосные годы обрабатываются сами собой, без проверки «делится ли год на 4, но не на 100, кроме делящихся на 400».

**Якоря обязательны.** Без \`^\` и \`$\` выражение найдёт подходящий кусок внутри строки, и «дата 15.03.2026 года» пройдёт проверку. Та же логика, что с проверкой логина из задания.

**Два формата — не дублирование.** Пользователь видит ДД.ММ.ГГГГ, потому что этого требует задание дословно. База хранит ГГГГ-ММ-ДД, потому что такой формат у типа \`DATE\` — и только в нём даты корректно сортируются и сравниваются. Перевод между ними — граница между представлением и хранением, и делать его нужно в одном месте.

**Почему не разбирать строку конструктором \`Date\`.** \`new Date('15.03.2026')\` в разных браузерах даёт разный результат, а иногда \`Invalid Date\`. Явный \`split\` по точке предсказуем везде.

**Про \`fromDbDate\`.** Проверка через \`isValidDate\` после перестановки может показаться избыточной, но она защищает от «2026-02-31» — база такого не вернёт, а вот тестовые данные вполне могут.`,
    maxScore: 40,
    estimatedMinutes: 6,
    timeLimitMs: 360000,
    examRefs: ['m2-order-form'],
    planDays: ['day-25-4'],
    source: 'plan',
  },

  {
    id: 'task-exam-schema-speed',
    title: 'По памяти за 15 минут: схема базы',
    kind: 'db',
    runtime: 'sql',
    difficulty: 4,
    tech: ['sql'],
    topicIds: ['memory-training', 'db-modeling'],
    monthNo: 7,
    weekNo: 26,
    statement: `**Норматив: 15 минут.** Это первый пункт модуля 1 на экзамене, и от него зависит всё остальное.

Напишите схему по памяти, не подглядывая. Предметная область — сервис заказа услуг фотостудии, но структура та же, что всегда.

| Таблица | Поля |
|---|---|
| \`users\` | \`id\`, \`login\` (уникальный), \`password_hash\`, \`full_name\`, \`phone\`, \`email\`, \`role\` (по умолчанию \`'user'\`) |
| \`studios\` | \`id\`, \`title\` (уникальный), \`price\` (число с копейками) |
| \`payment_methods\` | \`id\`, \`title\` (уникальный) |
| \`statuses\` | \`id\`, \`title\` (уникальный) |
| \`bookings\` | \`id\`, \`user_id\`, \`studio_id\`, \`payment_method_id\`, \`status_id\`, \`booking_date\` |
| \`reviews\` | \`id\`, \`booking_id\` (уникальный), \`text\`, \`rating\` |

Требования:

- все обязательные поля — \`NOT NULL\`;
- все связи — внешними ключами;
- скрипт должен запускаться повторно: начните с \`DROP TABLE IF EXISTS\` в правильном порядке;
- заполните \`statuses\` тремя строками: \`Новая\`, \`Подтверждена\`, \`Завершена\`;
- заполните \`payment_methods\` двумя: \`Картой\`, \`Наличными\`.`,
    requirements: [
      'Шесть таблиц с первичными ключами',
      'Логин уникален',
      'Все связи оформлены внешними ключами',
      'На бронирование не более одного отзыва',
      'Справочники заполнены',
      'Скрипт запускается повторно',
    ],
    starterCode: `DROP TABLE IF EXISTS reviews;
-- продолжите в обратном порядке зависимостей

-- CREATE TABLE ...

-- INSERT в справочники`,
    tests: [
      {
        id: 't1',
        name: 'Все шесть таблиц созданы',
        type: 'sql-query',
        check: `SELECT name FROM sqlite_master WHERE type = 'table'
  AND name IN ('users','studios','payment_methods','statuses','bookings','reviews')
ORDER BY name`,
        expectedColumns: ['name'],
        expectedRows: [['bookings'], ['payment_methods'], ['reviews'], ['statuses'], ['studios'], ['users']],
        points: 6,
      },
      {
        id: 't2',
        name: 'Структура bookings со связями',
        type: 'sql-schema',
        table: 'bookings',
        columns: [
          { name: 'id', pk: true },
          { name: 'user_id', notNull: true },
          { name: 'studio_id', notNull: true },
          { name: 'payment_method_id', notNull: true },
          { name: 'status_id', notNull: true },
          { name: 'booking_date', notNull: true },
        ],
        foreignKeys: [
          { column: 'user_id', refTable: 'users' },
          { column: 'studio_id', refTable: 'studios' },
          { column: 'payment_method_id', refTable: 'payment_methods' },
          { column: 'status_id', refTable: 'statuses' },
        ],
        points: 8,
      },
      {
        id: 't3',
        name: 'Структура users',
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
        points: 6,
      },
      {
        id: 't4',
        name: 'Логин уникален',
        type: 'sql-query',
        check: `SELECT CASE WHEN (
    (SELECT COUNT(*) FROM sqlite_master WHERE type = 'table' AND name = 'users' AND UPPER(sql) LIKE '%UNIQUE%')
  + (SELECT COUNT(*) FROM sqlite_master WHERE type = 'index' AND tbl_name = 'users')
) > 0 THEN 1 ELSE 0 END AS has_unique`,
        expectedColumns: ['has_unique'],
        expectedRows: [[1]],
        points: 5,
      },
      {
        id: 't5',
        name: 'Справочник статусов заполнен',
        type: 'sql-query',
        check: 'SELECT title FROM statuses ORDER BY id',
        expectedColumns: ['title'],
        expectedRows: [['Новая'], ['Подтверждена'], ['Завершена']],
        ordered: true,
        points: 5,
      },
      {
        id: 't6',
        name: 'Справочник способов оплаты заполнен',
        type: 'sql-query',
        check: 'SELECT COUNT(*) AS total FROM payment_methods',
        expectedColumns: ['total'],
        expectedRows: [[2]],
        points: 4,
      },
      {
        id: 't7',
        name: 'Один отзыв на бронирование',
        type: 'sql-query',
        check: `SELECT CASE WHEN (
    (SELECT COUNT(*) FROM sqlite_master WHERE type = 'table' AND name = 'reviews' AND UPPER(sql) LIKE '%UNIQUE%')
  + (SELECT COUNT(*) FROM sqlite_master WHERE type = 'index' AND tbl_name = 'reviews')
) > 0 THEN 1 ELSE 0 END AS has_unique`,
        expectedColumns: ['has_unique'],
        expectedRows: [[1]],
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Порядок создания — от независимых таблиц к зависимым. Порядок удаления — обратный.',
        penaltyPercent: 15,
      },
      {
        level: 2,
        text: 'Если вы не уложились в 15 минут — это и есть результат прогона. Разберите, на чём потеряли время, и напишите схему ещё раз завтра.',
        penaltyPercent: 30,
      },
      {
        level: 3,
        text: 'Скелет строки со связью: `user_id INTEGER NOT NULL REFERENCES users(id)`. Для денег — `DECIMAL(10, 2)`, а не FLOAT.',
        penaltyPercent: 45,
      },
    ],
    solution: `DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS statuses;
DROP TABLE IF EXISTS payment_methods;
DROP TABLE IF EXISTS studios;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  login         VARCHAR(50)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(150) NOT NULL,
  phone         VARCHAR(20)  NOT NULL,
  email         VARCHAR(150) NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'user'
);

CREATE TABLE studios (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(100)  NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE payment_methods (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE statuses (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE bookings (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id           INTEGER NOT NULL REFERENCES users(id),
  studio_id         INTEGER NOT NULL REFERENCES studios(id),
  payment_method_id INTEGER NOT NULL REFERENCES payment_methods(id),
  status_id         INTEGER NOT NULL DEFAULT 1 REFERENCES statuses(id),
  booking_date      DATE    NOT NULL
);

CREATE TABLE reviews (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  text       TEXT    NOT NULL,
  rating     INTEGER NOT NULL
);

INSERT INTO statuses (title) VALUES ('Новая'), ('Подтверждена'), ('Завершена');
INSERT INTO payment_methods (title) VALUES ('Картой'), ('Наличными');`,
    solutionExplanation: `Пятнадцать минут — это норматив для человека, который писал такую схему двадцать раз. Если вы уложились — модуль 1 на экзамене вас не удивит.

**Порядок создания и удаления — зеркальный.** Создавать нужно от независимых таблиц к зависимым: внешний ключ не может сослаться на несуществующую таблицу. Удалять — наоборот: нельзя удалить таблицу, на которую кто-то ссылается. Ошибка «errno 150» в MySQL почти всегда означает именно нарушенный порядок.

**\`UNIQUE\` на логине — требование задания, а не украшение.** Формулировка «Логин должен быть уникальным» встречается в каждом варианте. Проверка на сервере перед вставкой тоже нужна, но ограничение на уровне базы — вторая линия: даже при двух одновременных запросах дубликат не пройдёт.

**\`UNIQUE\` на \`booking_id\` в отзывах** реализует правило «один отзыв на заявку» без единой строки кода. Удобно и надёжнее любой проверки в приложении.

**\`DECIMAL\`, а не \`FLOAT\`.** Числа с плавающей точкой хранятся приближённо: сумма ста заказов по 99.99 даст не то, что ожидалось. Для денег всегда \`DECIMAL(10, 2)\`.

**\`DEFAULT 1\` у статуса** закрывает требование «новая заявка получает статус „Новая“» на уровне базы. Явно указывать статус при вставке всё равно стоит — так код читается понятнее, а поведение не зависит от того, какая строка справочника оказалась первой.

**Про \`ON DELETE CASCADE\` у отзывов.** Удалили бронирование — отзыв к нему теряет смысл. А вот на связи с пользователем каскад ставить опаснее: удаление учётной записи молча снесёт всю историю заявок.

**Про типы в SQLite.** В песочнице платформы работает SQLite, поэтому \`AUTOINCREMENT\` пишется слитно, а \`VARCHAR(50)\` и \`DECIMAL(10,2)\` принимаются, но трактуются мягче, чем в MySQL. На экзамене будет MySQL с \`AUTO_INCREMENT\` — разницу стоит держать в голове.`,
    maxScore: 40,
    estimatedMinutes: 15,
    timeLimitMs: 900000,
    examRefs: ['m1-db', 'm3-db'],
    planDays: ['day-26-3'],
    source: 'plan',
  },

  {
    id: 'task-exam-slider-speed',
    title: 'По памяти за 10 минут: слайдер',
    kind: 'complete',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['memory-training', 'react-slider'],
    monthNo: 7,
    weekNo: 27,
    statement: `**Норматив: 10 минут.**

Слайдер по требованиям задания — четыре изображения, смена каждые три секунды, кнопки вперёд и назад с перелистыванием по кругу.

Компонент \`Slider\` принимает:

\`\`\`ts
{
  images: string[];        // четыре адреса
  intervalMs?: number;     // по умолчанию 3000
}
\`\`\`

Разметка:

- текущее изображение — \`<img data-testid="slide">\` с атрибутом \`src\` текущего кадра;
- кнопка назад — \`[data-testid="prev"]\`;
- кнопка вперёд — \`[data-testid="next"]\`.

Требования к поведению:

1. Автопереключение каждые \`intervalMs\` миллисекунд.
2. Перелистывание по кругу в обе стороны.
3. Интервал снимается при размонтировании — иначе будет утечка.
4. Ручное переключение сбрасывает таймер: следующий автоматический переход отсчитывается заново.

В тестах интервал будет маленьким, чтобы не ждать три секунды.`,
    requirements: [
      'Показывается текущее изображение',
      'Кнопка вперёд листает по кругу',
      'Кнопка назад с первого кадра ведёт на последний',
      'Работает автопереключение',
      'Интервал снимается при размонтировании',
    ],
    starterCode: `function Slider({ images, intervalMs = 3000 }) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Показан первый кадр',
        type: 'react',
        code: `const images = ['/a.jpg', '/b.jpg', '/c.jpg', '/d.jpg'];
return ctx.render('Slider', { images, intervalMs: 100000 }).then(() => {
  const img = ctx.$('[data-testid="slide"]');
  ctx.assert(img, 'Нужен элемент [data-testid="slide"]');
  ctx.assert(img.getAttribute('src') === '/a.jpg', 'Сначала показывается первое изображение', '/a.jpg', img.getAttribute('src'));
});`,
        points: 5,
      },
      {
        id: 't2',
        name: 'Кнопка вперёд листает по кругу',
        type: 'react',
        code: `const images = ['/a.jpg', '/b.jpg', '/c.jpg', '/d.jpg'];
const src = () => ctx.$('[data-testid="slide"]').getAttribute('src');
return ctx.render('Slider', { images, intervalMs: 100000 })
  .then(() => ctx.click('[data-testid="next"]'))
  .then(() => { ctx.assert(src() === '/b.jpg', 'После одного нажатия — второй кадр', '/b.jpg', src()); })
  .then(() => ctx.click('[data-testid="next"]'))
  .then(() => ctx.click('[data-testid="next"]'))
  .then(() => { ctx.assert(src() === '/d.jpg', 'После трёх нажатий — четвёртый кадр', '/d.jpg', src()); })
  .then(() => ctx.click('[data-testid="next"]'))
  .then(() => { ctx.assert(src() === '/a.jpg', 'После последнего кадра — снова первый', '/a.jpg', src()); });`,
        points: 8,
      },
      {
        id: 't3',
        name: 'Кнопка назад листает по кругу',
        type: 'react',
        code: `const images = ['/a.jpg', '/b.jpg', '/c.jpg', '/d.jpg'];
const src = () => ctx.$('[data-testid="slide"]').getAttribute('src');
return ctx.render('Slider', { images, intervalMs: 100000 })
  .then(() => ctx.click('[data-testid="prev"]'))
  .then(() => { ctx.assert(src() === '/d.jpg', 'Назад с первого кадра — на последний', '/d.jpg', src()); })
  .then(() => ctx.click('[data-testid="prev"]'))
  .then(() => { ctx.assert(src() === '/c.jpg', 'Ещё раз назад — третий кадр', '/c.jpg', src()); });`,
        points: 7,
      },
      {
        id: 't4',
        name: 'Автопереключение работает',
        type: 'react',
        // Сравниваем с тем кадром, который виден сейчас: компонент между
        // проверками не пересоздаётся, и начинать он может не с первого.
        code: `const images = ['/a.jpg', '/b.jpg', '/c.jpg', '/d.jpg'];
const src = () => ctx.$('[data-testid="slide"]').getAttribute('src');
let before = '';
return ctx.render('Slider', { images, intervalMs: 40 })
  .then(() => { before = src(); return ctx.wait(110); })
  .then(() => {
    ctx.assert(src() !== before, 'Через несколько интервалов кадр должен смениться сам', 'не ' + before, src());
  });`,
        points: 8,
      },
      {
        id: 't5',
        name: 'Интервал снимается при размонтировании',
        type: 'react',
        code: `const images = ['/a.jpg', '/b.jpg', '/c.jpg', '/d.jpg'];
return ctx.render('Slider', { images, intervalMs: 30 })
  .then(() => ctx.wait(60))
  .then(() => ctx.unmount())
  .then(() => ctx.wait(120))
  .then(() => {
    ctx.assert(true, 'Если бы интервал не снимался, React сообщил бы об обновлении размонтированного компонента');
  });`,
        points: 6,
      },
      {
        id: 't6',
        name: 'В коде есть clearInterval',
        type: 'assert',
        code: `ctx.assert(/clearInterval/.test(ctx.source), 'Функция очистки эффекта обязана снимать интервал через clearInterval');`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Индекс текущего кадра — в useState. Интервал — в useEffect с обязательной функцией очистки.',
        penaltyPercent: 15,
      },
      {
        level: 2,
        text: 'Внутри setInterval используйте функциональную форму: `setIndex((prev) => (prev + 1) % images.length)`. Иначе замыкание запомнит старое значение, и слайдер застрянет на втором кадре.',
        penaltyPercent: 30,
      },
      {
        level: 3,
        text: 'Сброс таймера при ручном переключении получается сам собой, если добавить индекс в зависимости эффекта: смена индекса пересоздаёт интервал.',
        penaltyPercent: 45,
      },
    ],
    solution: `function Slider({ images, intervalMs = 3000 }) {
  const [index, setIndex] = React.useState(0);

  const next = React.useCallback(() => {
    setIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = React.useCallback(() => {
    setIndex((current) => (current - 1 + images.length) % images.length);
  }, [images.length]);

  React.useEffect(() => {
    const timer = setInterval(next, intervalMs);
    return () => clearInterval(timer);
  }, [next, intervalMs, index]);

  return (
    <div className="slider">
      <button data-testid="prev" type="button" onClick={prev} aria-label="Предыдущее изображение">
        ‹
      </button>

      <img data-testid="slide" src={images[index]} alt={'Изображение ' + (index + 1)} />

      <button data-testid="next" type="button" onClick={next} aria-label="Следующее изображение">
        ›
      </button>
    </div>
  );
}`,
    solutionExplanation: `Слайдер — отдельный оцениваемый пункт модуля 2, и требования к нему сформулированы предельно конкретно: четыре изображения, три секунды, кнопки в обе стороны. Написать его за десять минут — реалистичная цель.

**Функциональная форма setIndex обязательна.** Внутри \`setInterval\` замыкание захватывает значение \`index\` на момент создания интервала. Если написать \`setIndex((index + 1) % images.length)\`, слайдер перейдёт с первого кадра на второй — и остановится навсегда, потому что \`index\` внутри интервала так и останется нулём. Форма \`(prev) => ...\` берёт актуальное значение из React.

**\`clearInterval\` в функции очистки.** Без неё при каждом пересоздании эффекта добавлялся бы новый таймер, а старый продолжал работать. Через минуту кадры начали бы мелькать. А после ухода со страницы React пожаловался бы на обновление состояния размонтированного компонента.

**\`index\` в зависимостях — это и есть сброс таймера.** Приём неочевидный, но изящный: при смене кадра эффект перезапускается, старый интервал снимается, новый начинает отсчёт с нуля. Именно этого требует здравый смысл после ручного нажатия — иначе кадр может смениться автоматически через десятую долю секунды после клика, и выглядит это как сбой.

**Перелистывание назад.** \`(index - 1 + length) % length\` — прибавление длины перед взятием остатка. Без него \`(0 - 1) % 4\` даёт −1, и \`images[-1]\` вернёт \`undefined\`: картинка пропадёт.

**Про размер изображений.** Задание требует «четыре одинаковых по размерам изображения». В CSS это \`width: 100%; height: 300px; object-fit: cover\` — иначе кадры разной высоты заставят слайдер прыгать при каждом переключении.

**Про доступность.** \`aria-label\` на кнопках со стрелками-символами — минутное дело, но без него скринридер прочитает «‹» как непонятный знак.`,
    maxScore: 40,
    estimatedMinutes: 10,
    timeLimitMs: 600000,
    examRefs: ['m2-slider'],
    planDays: ['day-27-2'],
    source: 'plan',
  },
];
