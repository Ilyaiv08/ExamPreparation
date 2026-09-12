import type { Task } from '../types';

/** Месяц 5, недели 17–20: сборка проекта целиком. */
export const MONTH_05_TASKS: Task[] = [
  {
    id: 'task-fs-register-flow',
    title: 'Регистрация на сервере: вся цепочка целиком',
    kind: 'api',
    runtime: 'js',
    difficulty: 4,
    tech: ['express', 'security', 'sql'],
    topicIds: ['fullstack-register', 'server-validation'],
    monthNo: 5,
    weekNo: 17,
    statement: `Соберите обработчик регистрации из готовых кусочков. Все зависимости приходят объектом — так функцию можно проверить, не поднимая базу.

\`\`\`js
registerUser(body, deps)
\`\`\`

\`deps\` содержит:

| Поле | Что делает |
|---|---|
| \`validate(body)\` | возвращает объект ошибок; пустой — значит всё хорошо |
| \`findByLogin(login)\` | возвращает пользователя или \`null\` (промис) |
| \`hash(password)\` | возвращает хеш (промис) |
| \`insert(user)\` | создаёт запись, возвращает \`{ id }\` (промис) |

Функция возвращает промис с объектом \`{ status, body }\`:

- \`400\` и \`{ errors }\` — если валидация не прошла;
- \`409\` и \`{ errors: { login: 'Логин уже занят' } }\` — если логин занят;
- \`201\` и \`{ id, login }\` — при успехе.

Порядок важен: сначала валидация, потом проверка логина, потом хеш, потом вставка. Не наоборот — незачем хешировать пароль, если данные всё равно некорректны.

В \`insert\` должен уходить **хеш**, а поле \`password\` в базу попадать не должно.`,
    requirements: [
      'При ошибках валидации — 400 и объект errors',
      'При занятом логине — 409 с ошибкой у поля login',
      'При успехе — 201 и { id, login }',
      'В insert уходит password_hash, а не password',
      'findByLogin не вызывается, если валидация не прошла',
      'hash не вызывается, если логин занят',
    ],
    starterCode: `async function registerUser(body, deps) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Ошибки валидации дают 400',
        type: 'assert',
        code: `let findCalled = false;
const deps = {
  validate: () => ({ login: 'Минимум 6 символов' }),
  findByLogin: async () => { findCalled = true; return null; },
  hash: async (p) => 'hash:' + p,
  insert: async () => ({ id: 1 }),
};
return ctx.get('registerUser')({ login: 'ivan' }, deps).then((res) => {
  ctx.assert(res.status === 400, 'При ошибках валидации статус 400', 400, res.status);
  ctx.assert(res.body && res.body.errors && res.body.errors.login, 'В теле должен быть объект errors с ключом login');
  ctx.assert(!findCalled, 'Если валидация не прошла, в базу ходить не нужно');
});`,
        points: 4,
      },
      {
        id: 't2',
        name: 'Занятый логин даёт 409',
        type: 'assert',
        code: `let hashCalled = false;
const deps = {
  validate: () => ({}),
  findByLogin: async () => ({ id: 7, login: 'ivanov26' }),
  hash: async (p) => { hashCalled = true; return 'hash:' + p; },
  insert: async () => ({ id: 1 }),
};
return ctx.get('registerUser')({ login: 'ivanov26', password: 'demo2026' }, deps).then((res) => {
  ctx.assert(res.status === 409, 'Занятый логин — это конфликт, статус 409', 409, res.status);
  ctx.assert(res.body && res.body.errors && res.body.errors.login, 'Ошибка должна лежать у поля login');
  ctx.assert(!hashCalled, 'Хешировать пароль, когда логин занят, незачем');
});`,
        points: 4,
      },
      {
        id: 't3',
        name: 'Успешная регистрация даёт 201',
        type: 'assert',
        code: `const deps = {
  validate: () => ({}),
  findByLogin: async () => null,
  hash: async (p) => 'hash:' + p,
  insert: async (user) => ({ id: 42 }),
};
const body = { login: 'ivanov26', password: 'demo2026', fullName: 'Иванов', phone: '+7', email: 'a@b.ru' };
return ctx.get('registerUser')(body, deps).then((res) => {
  ctx.assert(res.status === 201, 'Успешное создание — статус 201', 201, res.status);
  ctx.assert(res.body.id === 42, 'В ответе должен быть id из insert', 42, res.body.id);
  ctx.assert(res.body.login === 'ivanov26', 'В ответе должен быть логин', 'ivanov26', res.body.login);
});`,
        points: 4,
      },
      {
        id: 't4',
        name: 'В базу уходит хеш, а не пароль',
        type: 'assert',
        code: `let saved = null;
const deps = {
  validate: () => ({}),
  findByLogin: async () => null,
  hash: async (p) => 'hash:' + p,
  insert: async (user) => { saved = user; return { id: 1 }; },
};
const body = { login: 'ivanov26', password: 'demo2026', fullName: 'Иванов', phone: '+7', email: 'a@b.ru' };
return ctx.get('registerUser')(body, deps).then(() => {
  ctx.assert(saved, 'insert должен быть вызван');
  const values = Object.values(saved).map(String);
  ctx.assert(values.includes('hash:demo2026'), 'В insert должен уходить хеш пароля');
  ctx.assert(!values.includes('demo2026'), 'Открытый пароль в базу попадать не должен');
});`,
        points: 5,
      },
      {
        id: 't5',
        name: 'Пароль не возвращается клиенту',
        type: 'assert',
        code: `const deps = {
  validate: () => ({}),
  findByLogin: async () => null,
  hash: async (p) => 'hash:' + p,
  insert: async () => ({ id: 1 }),
};
const body = { login: 'ivanov26', password: 'demo2026', fullName: 'Иванов', phone: '+7', email: 'a@b.ru' };
return ctx.get('registerUser')(body, deps).then((res) => {
  const text = JSON.stringify(res.body);
  ctx.assert(!text.includes('demo2026'), 'Пароль не должен попадать в ответ');
  ctx.assert(!text.includes('hash:'), 'Хеш пароля тоже не должен попадать в ответ');
});`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Три ранних `return` подряд — по одному на каждую неудачную ветку. Вложенные if не нужны.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Порядок: `validate` → если ошибки, вернуть 400 → `findByLogin` → если нашёлся, вернуть 409 → `hash` → `insert` → 201.',
        penaltyPercent: 25,
      },
      {
        level: 3,
        text: 'Собирайте объект для insert явно: `{ login, password_hash, full_name: fullName, phone, email }`. Так открытый пароль в базу не попадёт даже случайно.',
        penaltyPercent: 40,
      },
    ],
    solution: `async function registerUser(body, deps) {
  const errors = deps.validate(body);
  if (Object.keys(errors).length > 0) {
    return { status: 400, body: { errors } };
  }

  const existing = await deps.findByLogin(body.login);
  if (existing) {
    return { status: 409, body: { errors: { login: 'Логин уже занят' } } };
  }

  const passwordHash = await deps.hash(body.password);
  const created = await deps.insert({
    login: body.login,
    password_hash: passwordHash,
    full_name: body.fullName,
    phone: body.phone,
    email: body.email,
  });

  return { status: 201, body: { id: created.id, login: body.login } };
}`,
    solutionExplanation: `Ключевых мыслей три.

**Ранний выход.** Каждая неудачная ветка заканчивается своим \`return\`. Вложенные условия на четыре уровня читать невозможно, а здесь функция читается сверху вниз как список шагов.

**Порядок операций экономит работу.** Хеширование через bcrypt — самая дорогая операция в цепочке (десятки миллисекунд). Запускать её до того, как мы убедились в корректности данных и свободном логине, — трата времени.

**Явная сборка объекта для базы.** Соблазн написать \`insert({ ...body, password_hash })\` велик, но тогда в объекте останется поле \`password\` с открытым паролем. Если в таблице случайно окажется такой столбец — пароль запишется. Перечисление полей руками исключает это.

**Про 409.** Формально подошёл бы и 400, но 409 Conflict точнее описывает ситуацию: данные корректны, просто конфликтуют с уже существующими. Клиенту в любом случае важнее не код, а объект \`errors\` — он раскладывает его по полям формы.`,
    maxScore: 20,
    estimatedMinutes: 30,
    examRefs: ['m1-register'],
    planDays: ['day-17-2'],
    source: 'plan',
  },

  {
    id: 'task-fs-menu-roles',
    title: 'Меню по ролям: гость, пользователь, администратор',
    kind: 'complete',
    runtime: 'react',
    difficulty: 3,
    tech: ['react'],
    topicIds: ['fullstack-auth-flow', 'react-conditional'],
    monthNo: 5,
    weekNo: 17,
    statement: `Компонент \`Menu\` принимает проп \`user\`: \`null\` для гостя либо объект \`{ login, role }\`.

Что показывать:

| Кто | Пункты меню |
|---|---|
| Гость | «Вход», «Регистрация» |
| Пользователь | «Кабинет», «Новая заявка», «Выход» |
| Администратор | «Кабинет», «Новая заявка», «Админка», «Выход» |

Каждый пункт — ссылка \`<a>\` с атрибутом \`data-testid\`: \`login\`, \`register\`, \`cabinet\`, \`new-order\`, \`admin\`, \`logout\`.

Кнопка выхода — \`<button data-testid="logout">\`, при нажатии вызывает проп \`onLogout\`.`,
    requirements: [
      'Гость видит только вход и регистрацию',
      'Пользователь видит кабинет, новую заявку и выход',
      'Ссылка на админку есть только у роли admin',
      'Кнопка выхода вызывает onLogout',
      'У вошедшего пользователя не показываются вход и регистрация',
    ],
    starterCode: `function Menu({ user, onLogout }) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Гость видит вход и регистрацию',
        type: 'react',
        code: `return ctx.render('Menu', { user: null, onLogout: () => {} }).then(() => {
  ctx.assert(ctx.$('[data-testid="login"]'), 'Гость должен видеть ссылку входа');
  ctx.assert(ctx.$('[data-testid="register"]'), 'Гость должен видеть ссылку регистрации');
  ctx.assert(!ctx.$('[data-testid="cabinet"]'), 'Гостю кабинет показывать нельзя');
  ctx.assert(!ctx.$('[data-testid="logout"]'), 'Гостю выход показывать не нужно');
});`,
        points: 4,
      },
      {
        id: 't2',
        name: 'Пользователь видит свои пункты',
        type: 'react',
        code: `return ctx.render('Menu', { user: { login: 'ivanov26', role: 'user' }, onLogout: () => {} }).then(() => {
  ctx.assert(ctx.$('[data-testid="cabinet"]'), 'Нужна ссылка на кабинет');
  ctx.assert(ctx.$('[data-testid="new-order"]'), 'Нужна ссылка на новую заявку');
  ctx.assert(ctx.$('[data-testid="logout"]'), 'Нужна кнопка выхода');
  ctx.assert(!ctx.$('[data-testid="login"]'), 'Вошедшему пользователю ссылка входа не нужна');
  ctx.assert(!ctx.$('[data-testid="register"]'), 'Вошедшему пользователю регистрация не нужна');
});`,
        points: 4,
      },
      {
        id: 't3',
        name: 'Админка только у администратора',
        type: 'react',
        code: `return ctx.render('Menu', { user: { login: 'ivanov26', role: 'user' }, onLogout: () => {} })
  .then(() => {
    ctx.assert(!ctx.$('[data-testid="admin"]'), 'Обычному пользователю ссылка на админку не показывается');
  })
  .then(() => ctx.render('Menu', { user: { login: 'Admin26', role: 'admin' }, onLogout: () => {} }))
  .then(() => {
    ctx.assert(ctx.$('[data-testid="admin"]'), 'Администратор должен видеть ссылку на админку');
    ctx.assert(ctx.$('[data-testid="cabinet"]'), 'Администратору доступны и обычные пункты');
  });`,
        points: 5,
      },
      {
        id: 't4',
        name: 'Выход вызывает onLogout',
        type: 'react',
        code: `let called = 0;
return ctx.render('Menu', { user: { login: 'ivanov26', role: 'user' }, onLogout: () => { called += 1; } })
  .then(() => ctx.click('[data-testid="logout"]'))
  .then(() => {
    ctx.assert(called === 1, 'onLogout должен быть вызван ровно один раз', 1, called);
  });`,
        points: 4,
      },
      {
        id: 't5',
        name: 'Роль проверяется по значению, а не по логину',
        type: 'assert',
        code: `ctx.assert(!/Admin26/.test(ctx.source), 'Роль определяется полем role, а не сравнением логина с Admin26');`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Две ветки: гость и вошедший. Внутри второй — ещё одно условие на админку.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Приём: `{!user && (<>…</>)}` для гостя и `{user && (<>…</>)}` для вошедшего. Внутри второго — `{user.role === "admin" && <a data-testid="admin">Админка</a>}`.',
        penaltyPercent: 25,
      },
      {
        level: 3,
        text: 'Проверять роль сравнением логина нельзя: пользователь может зарегистрироваться с таким же логином в другом регистре, а роль — это данные из токена.',
        penaltyPercent: 40,
      },
    ],
    solution: `function Menu({ user, onLogout }) {
  return (
    <nav>
      {!user && (
        <>
          <a data-testid="login" href="/login">Вход</a>
          <a data-testid="register" href="/register">Регистрация</a>
        </>
      )}

      {user && (
        <>
          <a data-testid="cabinet" href="/cabinet">Кабинет</a>
          <a data-testid="new-order" href="/orders/new">Новая заявка</a>
          {user.role === 'admin' && (
            <a data-testid="admin" href="/admin">Админка</a>
          )}
          <button data-testid="logout" type="button" onClick={onLogout}>
            Выход
          </button>
        </>
      )}
    </nav>
  );
}`,
    solutionExplanation: `Меню — маленький компонент, но он показывает сразу три вещи, за которые снимают баллы.

**Роль берётся из данных, а не угадывается.** Сравнение \`user.login === 'Admin26'\` работает ровно до первого пользователя, который зарегистрируется под похожим логином. Роль приходит внутри подписанного токена, и опираться нужно на неё.

**Клиентская проверка — это удобство, а не защита.** Скрытая ссылка не мешает открыть \`/admin\` вручную или отправить запрос напрямую. Поэтому та же проверка обязательно дублируется на сервере в middleware — иначе панель администратора считается незащищённой.

**Фрагменты вместо лишних div.** \`<>…</>\` группирует элементы, не добавляя узел в DOM. Внутри flex-контейнера лишняя обёртка сломала бы раскладку.

**Про выход.** Он должен не только очистить состояние контекста, но и удалить токен из localStorage. Иначе после перезагрузки страницы сессия восстановится, и «выход» окажется фиктивным.`,
    maxScore: 20,
    estimatedMinutes: 25,
    examRefs: ['m1-login', 'm1-admin'],
    planDays: ['day-17-4'],
    source: 'plan',
  },

  {
    id: 'task-fs-cabinet-query',
    title: 'Запрос кабинета: свои заявки вместе с отзывами',
    kind: 'db',
    runtime: 'sql',
    difficulty: 4,
    tech: ['sql'],
    topicIds: ['fullstack-cabinet', 'sql-join'],
    monthNo: 5,
    weekNo: 18,
    statement: `База уже создана и заполнена. Оформите запрос кабинета представлением \`v_my_orders\` — оно должно возвращать заявки пользователя с \`id = 2\`.

Колонки ровно с такими именами:

\`\`\`text
id, room, payment, status, event_date, review_text
\`\`\`

Условия:

- \`room\`, \`payment\`, \`status\` — названия из справочников, а не идентификаторы;
- \`review_text\` — текст отзыва или \`NULL\`, если отзыва нет;
- заявки без отзыва из выборки пропадать не должны;
- сортировка по \`event_date\` по возрастанию.

Это тот самый запрос, который на экзамене пишется для личного кабинета. Ошибка с \`INNER JOIN\` вместо \`LEFT JOIN\` прячет большую часть заявок — и её замечают не сразу.`,
    requirements: [
      'Создано представление v_my_orders',
      'Названия из справочников вместо идентификаторов',
      'Заявки без отзыва остаются в выборке',
      'Фильтр по пользователю с id = 2',
      'Сортировка по дате мероприятия',
    ],
    setupSql: `CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  login TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL
);

CREATE TABLE rooms (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL UNIQUE
);

CREATE TABLE payment_methods (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL UNIQUE
);

CREATE TABLE statuses (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL UNIQUE
);

CREATE TABLE applications (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  room_id INTEGER NOT NULL REFERENCES rooms(id),
  payment_method_id INTEGER NOT NULL REFERENCES payment_methods(id),
  status_id INTEGER NOT NULL REFERENCES statuses(id),
  event_date TEXT NOT NULL
);

CREATE TABLE reviews (
  id INTEGER PRIMARY KEY,
  application_id INTEGER NOT NULL UNIQUE REFERENCES applications(id),
  text TEXT NOT NULL
);

INSERT INTO users (id, login, full_name) VALUES
  (1, 'admin26', 'Администратор'),
  (2, 'ivanov26', 'Иванов Иван'),
  (3, 'petrov26', 'Петров Пётр');

INSERT INTO rooms (id, title) VALUES
  (1, 'Аудитория'), (2, 'Коворкинг'), (3, 'Кинозал');

INSERT INTO payment_methods (id, title) VALUES
  (1, 'Картой'), (2, 'Наличными');

INSERT INTO statuses (id, title) VALUES
  (1, 'Новая'), (2, 'Мероприятие назначено'), (3, 'Мероприятие завершено');

INSERT INTO applications (id, user_id, room_id, payment_method_id, status_id, event_date) VALUES
  (1, 2, 1, 1, 3, '2026-02-10'),
  (2, 2, 2, 2, 2, '2026-03-15'),
  (3, 2, 3, 1, 1, '2026-04-20'),
  (4, 3, 1, 1, 1, '2026-03-01');

INSERT INTO reviews (id, application_id, text) VALUES
  (1, 1, 'Всё прошло отлично');`,
    starterCode: `-- Заявки пользователя с id = 2
CREATE VIEW v_my_orders AS
SELECT
  -- ваш код
;`,
    tests: [
      {
        id: 't1',
        name: 'Все три заявки пользователя на месте',
        type: 'sql-query',
        check: 'SELECT COUNT(*) AS total FROM v_my_orders',
        expectedColumns: ['total'],
        expectedRows: [[3]],
        points: 4,
      },
      {
        id: 't2',
        name: 'Чужие заявки не попали в выборку',
        type: 'sql-query',
        check: 'SELECT id FROM v_my_orders ORDER BY id',
        expectedColumns: ['id'],
        expectedRows: [[1], [2], [3]],
        ordered: true,
        points: 4,
      },
      {
        id: 't3',
        name: 'Справочники подставлены названиями',
        type: 'sql-query',
        check: 'SELECT room, payment, status FROM v_my_orders WHERE id = 2',
        expectedColumns: ['room', 'payment', 'status'],
        expectedRows: [['Коворкинг', 'Наличными', 'Мероприятие назначено']],
        points: 5,
      },
      {
        id: 't4',
        name: 'Отзыв подставлен там, где он есть',
        type: 'sql-query',
        check: 'SELECT id, review_text FROM v_my_orders ORDER BY id',
        expectedColumns: ['id', 'review_text'],
        expectedRows: [
          [1, 'Всё прошло отлично'],
          [2, null],
          [3, null],
        ],
        ordered: true,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Четыре соединения: три справочника через INNER JOIN и отзывы через LEFT JOIN. Разница не случайна — подумайте, каких данных может не быть.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Псевдонимы обязательны: `applications a`, `rooms r`, `statuses s`. Иначе столбцы `title` из трёх справочников перепутаются.',
        penaltyPercent: 25,
      },
      {
        level: 3,
        text: 'Каркас: `SELECT a.id, r.title AS room, p.title AS payment, s.title AS status, a.event_date, rev.text AS review_text FROM applications a JOIN rooms r ON r.id = a.room_id ... LEFT JOIN reviews rev ON rev.application_id = a.id WHERE a.user_id = 2 ORDER BY a.event_date`.',
        penaltyPercent: 40,
      },
    ],
    solution: `CREATE VIEW v_my_orders AS
SELECT
  a.id,
  r.title  AS room,
  p.title  AS payment,
  s.title  AS status,
  a.event_date,
  rev.text AS review_text
FROM applications a
JOIN rooms r            ON r.id = a.room_id
JOIN payment_methods p  ON p.id = a.payment_method_id
JOIN statuses s         ON s.id = a.status_id
LEFT JOIN reviews rev   ON rev.application_id = a.id
WHERE a.user_id = 2
ORDER BY a.event_date;`,
    solutionExplanation: `Это запрос, который на экзамене пишется дважды: один раз для кабинета, второй — почти такой же — для админки.

**Почему справочники через JOIN, а отзывы через LEFT JOIN.** Каждая заявка обязательно ссылается на помещение, оплату и статус — эти поля \`NOT NULL\` с внешним ключом, пары не может не быть. А отзыв есть далеко не у каждой заявки. INNER JOIN с отзывами оставил бы в кабинете одну заявку из трёх — и пользователь решил бы, что система потеряла его данные.

**Про псевдонимы.** У трёх справочников столбец называется одинаково — \`title\`. Без псевдонимов таблиц и без \`AS\` в результате окажется три колонки с одним именем, и клиент прочитает не то, что ожидал.

**Про фильтр.** Здесь \`user_id = 2\` вписан прямо в запрос, потому что это учебное задание. В реальном коде так делать нельзя: идентификатор берётся из токена и подставляется параметром — \`WHERE a.user_id = ?\`. Фильтровать на клиенте тем более нельзя: чужие заявки уже ушли по сети, и их видно во вкладке Network.

**Про сортировку.** Без \`ORDER BY\` порядок строк не гарантирован вообще — база вправе вернуть их как угодно. Для кабинета это выглядело бы как перемешивание списка при каждом обновлении.`,
    maxScore: 18,
    estimatedMinutes: 25,
    examRefs: ['m1-cabinet'],
    planDays: ['day-18-3'],
    source: 'plan',
  },

  {
    id: 'task-fs-admin-status',
    title: 'Смена статуса: белый список и проверка результата',
    kind: 'api',
    runtime: 'js',
    difficulty: 3,
    tech: ['express', 'security'],
    topicIds: ['admin-panel', 'sql-update'],
    monthNo: 5,
    weekNo: 19,
    statement: `Обработчик смены статуса заявки администратором.

\`\`\`js
changeStatus(params, body, user, deps)
\`\`\`

- \`params\` — \`{ id }\`, строка из адреса;
- \`body\` — \`{ status }\`, присланный клиентом;
- \`user\` — \`{ id, role }\` из токена;
- \`deps.update(id, status)\` — возвращает промис с числом изменённых строк.

Допустимые статусы — ровно три: \`'Новая'\`, \`'Мероприятие назначено'\`, \`'Мероприятие завершено'\`.

Возвращает промис с \`{ status, body }\`:

| Ситуация | Ответ |
|---|---|
| Роль не \`admin\` | \`403\`, \`{ message }\` |
| \`id\` не целое число | \`400\`, \`{ message }\` |
| Статус не из списка | \`400\`, \`{ message }\` |
| \`update\` вернул 0 | \`404\`, \`{ message }\` |
| Успех | \`200\`, \`{ id, status }\` |

Порядок проверок именно такой: сначала права, потом данные, потом результат.`,
    requirements: [
      'Роль проверяется первой',
      'Идентификатор приводится к числу и проверяется',
      'Статус проверяется по белому списку',
      'Ноль изменённых строк даёт 404',
      'При успехе возвращается 200 и новый статус',
      'update не вызывается при неудачных проверках',
    ],
    starterCode: `const ALLOWED_STATUSES = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'];

async function changeStatus(params, body, user, deps) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Не администратор получает 403',
        type: 'assert',
        code: `let called = false;
const deps = { update: async () => { called = true; return 1; } };
return ctx.get('changeStatus')({ id: '1' }, { status: 'Новая' }, { id: 5, role: 'user' }, deps).then((res) => {
  ctx.assert(res.status === 403, 'Без роли admin — статус 403', 403, res.status);
  ctx.assert(!called, 'Запрос к базе выполнять не нужно');
});`,
        points: 4,
      },
      {
        id: 't2',
        name: 'Нечисловой идентификатор даёт 400',
        type: 'assert',
        code: `const deps = { update: async () => 1 };
return ctx.get('changeStatus')({ id: 'abc' }, { status: 'Новая' }, { id: 1, role: 'admin' }, deps).then((res) => {
  ctx.assert(res.status === 400, 'Идентификатор «abc» — некорректные данные, статус 400', 400, res.status);
});`,
        points: 3,
      },
      {
        id: 't3',
        name: 'Статус не из списка даёт 400',
        type: 'assert',
        code: `let called = false;
const deps = { update: async () => { called = true; return 1; } };
return ctx.get('changeStatus')({ id: '1' }, { status: 'Отменена' }, { id: 1, role: 'admin' }, deps).then((res) => {
  ctx.assert(res.status === 400, 'Недопустимый статус — 400', 400, res.status);
  ctx.assert(!called, 'Недопустимое значение в базу отправлять нельзя');
});`,
        points: 5,
      },
      {
        id: 't4',
        name: 'Несуществующая заявка даёт 404',
        type: 'assert',
        code: `const deps = { update: async () => 0 };
return ctx.get('changeStatus')({ id: '999' }, { status: 'Мероприятие назначено' }, { id: 1, role: 'admin' }, deps).then((res) => {
  ctx.assert(res.status === 404, 'Ноль изменённых строк означает, что записи нет — 404', 404, res.status);
});`,
        points: 4,
      },
      {
        id: 't5',
        name: 'Успешная смена статуса',
        type: 'assert',
        code: `let receivedId = null;
let receivedStatus = null;
const deps = {
  update: async (id, status) => { receivedId = id; receivedStatus = status; return 1; },
};
return ctx.get('changeStatus')({ id: '7' }, { status: 'Мероприятие завершено' }, { id: 1, role: 'admin' }, deps).then((res) => {
  ctx.assert(res.status === 200, 'Успех — статус 200', 200, res.status);
  ctx.assert(res.body.id === 7, 'В ответе должен быть числовой id', 7, res.body.id);
  ctx.assert(res.body.status === 'Мероприятие завершено', 'В ответе должен быть новый статус');
  ctx.assert(receivedId === 7, 'В update должен уходить число, а не строка', 7, receivedId);
  ctx.assert(receivedStatus === 'Мероприятие завершено', 'В update должен уходить проверенный статус');
});`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Четыре проверки подряд, каждая со своим ранним `return`. Порядок: права → идентификатор → статус → результат обновления.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Проверка идентификатора: `const id = Number(params.id); if (!Number.isInteger(id) || id <= 0) return { status: 400, ... }`. Просто `Number(...)` мало: `Number("abc")` даёт NaN, и запрос уйдёт в базу.',
        penaltyPercent: 25,
      },
      {
        level: 3,
        text: 'Белый список: `if (!ALLOWED_STATUSES.includes(body.status)) return { status: 400, ... }`. Внешний ключ на статусы тоже защитит, но вернёт ошибку базы с кодом 500 вместо понятного 400.',
        penaltyPercent: 40,
      },
    ],
    solution: `const ALLOWED_STATUSES = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'];

async function changeStatus(params, body, user, deps) {
  if (!user || user.role !== 'admin') {
    return { status: 403, body: { message: 'Действие доступно только администратору' } };
  }

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return { status: 400, body: { message: 'Некорректный идентификатор заявки' } };
  }

  if (!ALLOWED_STATUSES.includes(body.status)) {
    return { status: 400, body: { message: 'Недопустимый статус заявки' } };
  }

  const affected = await deps.update(id, body.status);
  if (affected === 0) {
    return { status: 404, body: { message: 'Заявка не найдена' } };
  }

  return { status: 200, body: { id, status: body.status } };
}`,
    solutionExplanation: `Четыре проверки, и у каждой своя причина.

**Права — первыми.** Нет смысла разбирать данные запроса, если отправитель вообще не имеет права на действие. Заодно это дешевле: проверка поля \`role\` не требует обращения к базе.

**Идентификатор приводится к числу и проверяется.** \`req.params.id\` всегда строка. \`Number("abc")\` возвращает \`NaN\`, и запрос \`WHERE id = NaN\` в лучшем случае ничего не найдёт, в худшем — уронит драйвер. \`Number.isInteger\` отсекает и \`NaN\`, и дробные значения вроде \`"1.5"\`.

**Белый список статусов.** Внешний ключ на таблицу статусов тоже не пропустит мусор — но ответит ошибкой базы, которую обработчик превратит в 500. Пользователь увидит «Внутренняя ошибка сервера» вместо «Недопустимый статус». Явная проверка даёт понятный 400 и не тревожит базу.

**Ноль изменённых строк — это 404.** Тонкий момент: \`UPDATE\` несуществующей записи проходит **успешно**, просто ничего не меняет. Отсутствие исключения ничего не доказывает. Единственный способ узнать правду — посмотреть \`affectedRows\`.

**Про 403 против 401.** Здесь именно 403: пользователь опознан (токен разобран, роль известна), но прав не хватает. 401 означал бы «войдите в систему».`,
    maxScore: 22,
    estimatedMinutes: 30,
    examRefs: ['m1-admin'],
    planDays: ['day-19-2'],
    source: 'plan',
  },

  {
    id: 'task-fs-order-form',
    title: 'Форма заявки: справочники с сервера и дата',
    kind: 'app',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['fullstack-order', 'react-forms'],
    monthNo: 5,
    weekNo: 18,
    statement: `Компонент \`OrderForm\` — страница оформления заявки.

### Props

\`\`\`ts
{
  rooms: { id: number; title: string }[];
  payments: { id: number; title: string }[];
  onSubmit: (values) => void;
}
\`\`\`

### Разметка

- \`<select name="roomId">\` — варианты из \`rooms\`, значение \`option\` — идентификатор;
- \`<select name="paymentMethodId">\` — варианты из \`payments\`;
- \`<input name="eventDate">\` — дата в формате ДД.ММ.ГГГГ;
- \`<button type="submit">\`.

### Поведение

При отправке форма проверяет, что выбраны оба списка и введена дата вида \`ДД.ММ.ГГГГ\`. Если что-то не так — у поля появляется класс \`is-invalid\`, и \`onSubmit\` не вызывается.

При успехе \`onSubmit\` получает объект:

\`\`\`js
{ roomId: 2, paymentMethodId: 1, eventDate: '2026-03-15' }
\`\`\`

Обратите внимание: идентификаторы — **числа**, а дата переводится в формат базы \`ГГГГ-ММ-ДД\`. Пользователь видит ДД.ММ.ГГГГ, база хранит ГГГГ-ММ-ДД — перевод делает форма.`,
    requirements: [
      'Списки строятся из props, а не зашиты в код',
      'Пустая форма не отправляется',
      'Некорректная дата не проходит',
      'Идентификаторы уходят числами',
      'Дата уходит в формате ГГГГ-ММ-ДД',
    ],
    starterCode: `function OrderForm({ rooms, payments, onSubmit }) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Списки строятся из props',
        type: 'react',
        code: `const rooms = [{ id: 1, title: 'Аудитория' }, { id: 2, title: 'Коворкинг' }, { id: 3, title: 'Кинозал' }];
const payments = [{ id: 1, title: 'Картой' }, { id: 2, title: 'Наличными' }];
return ctx.render('OrderForm', { rooms, payments, onSubmit: () => {} }).then(() => {
  const roomSelect = ctx.$('[name="roomId"]');
  ctx.assert(roomSelect, 'Нет списка с name="roomId"');
  const text = roomSelect.textContent;
  ['Аудитория', 'Коворкинг', 'Кинозал'].forEach((title) => {
    ctx.assert(text.includes(title), 'В списке помещений нет варианта: ' + title);
  });
  const paySelect = ctx.$('[name="paymentMethodId"]');
  ctx.assert(paySelect, 'Нет списка с name="paymentMethodId"');
  ctx.assert(paySelect.textContent.includes('Наличными'), 'В списке оплаты нет варианта «Наличными»');
});`,
        points: 5,
      },
      {
        id: 't2',
        name: 'Пустая форма не отправляется',
        type: 'react',
        code: `let called = false;
const rooms = [{ id: 1, title: 'Аудитория' }];
const payments = [{ id: 1, title: 'Картой' }];
return ctx.render('OrderForm', { rooms, payments, onSubmit: () => { called = true; } })
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(!called, 'Пустую форму отправлять нельзя');
    ctx.assert(ctx.$$('.is-invalid').length > 0, 'Поля с ошибками должны получить класс is-invalid');
  });`,
        points: 5,
      },
      {
        id: 't3',
        name: 'Некорректная дата не проходит',
        type: 'react',
        code: `let called = false;
const rooms = [{ id: 1, title: 'Аудитория' }];
const payments = [{ id: 1, title: 'Картой' }];
return ctx.render('OrderForm', { rooms, payments, onSubmit: () => { called = true; } })
  .then(() => ctx.change('[name="roomId"]', '1'))
  .then(() => ctx.change('[name="paymentMethodId"]', '1'))
  .then(() => ctx.change('[name="eventDate"]', '15/03/2026'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(!called, 'Дата «15/03/2026» не соответствует формату ДД.ММ.ГГГГ');
    ctx.assert(ctx.$('[name="eventDate"]').classList.contains('is-invalid'), 'Поле даты должно быть отмечено ошибкой');
  });`,
        points: 5,
      },
      {
        id: 't4',
        name: 'Корректная заявка отправляется',
        type: 'react',
        code: `let received = null;
const rooms = [{ id: 1, title: 'Аудитория' }, { id: 2, title: 'Коворкинг' }];
const payments = [{ id: 1, title: 'Картой' }, { id: 2, title: 'Наличными' }];
return ctx.render('OrderForm', { rooms, payments, onSubmit: (values) => { received = values; } })
  .then(() => ctx.change('[name="roomId"]', '2'))
  .then(() => ctx.change('[name="paymentMethodId"]', '1'))
  .then(() => ctx.change('[name="eventDate"]', '15.03.2026'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(received, 'onSubmit должен быть вызван');
    ctx.assert(received.roomId === 2, 'roomId должен быть числом 2', 2, received.roomId);
    ctx.assert(received.paymentMethodId === 1, 'paymentMethodId должен быть числом 1', 1, received.paymentMethodId);
    ctx.assert(received.eventDate === '2026-03-15', 'Дата должна уйти в формате базы', '2026-03-15', received.eventDate);
  });`,
        points: 7,
      },
      {
        id: 't5',
        name: 'Несуществующая дата не проходит',
        type: 'react',
        code: `let called = false;
const rooms = [{ id: 1, title: 'Аудитория' }];
const payments = [{ id: 1, title: 'Картой' }];
return ctx.render('OrderForm', { rooms, payments, onSubmit: () => { called = true; } })
  .then(() => ctx.change('[name="roomId"]', '1'))
  .then(() => ctx.change('[name="paymentMethodId"]', '1'))
  .then(() => ctx.change('[name="eventDate"]', '31.02.2026'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(!called, '31 февраля не существует — такая дата проходить не должна');
  });`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Одно состояние на всю форму и один обработчик изменения на все поля — имя берётся из `event.target.name`.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Проверка даты в два шага: сначала формат регулярным выражением `/^\\d{2}\\.\\d{2}\\.\\d{4}$/`, затем существование — создать `Date` и убедиться, что день и месяц не «переехали».',
        penaltyPercent: 25,
      },
      {
        level: 3,
        text: 'Перевод: `const [d, m, y] = value.split("."); const forDb = `${y}-${m}-${d}`;`. Идентификаторы из select приходят строками — `Number(form.roomId)` обязателен.',
        penaltyPercent: 40,
      },
    ],
    solution: `function OrderForm({ rooms, payments, onSubmit }) {
  const [form, setForm] = React.useState({ roomId: '', paymentMethodId: '', eventDate: '' });
  const [errors, setErrors] = React.useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function isRealDate(value) {
    if (!/^\\d{2}\\.\\d{2}\\.\\d{4}$/.test(value)) return false;
    const [day, month, year] = value.split('.').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }

  function validate() {
    const found = {};
    if (!form.roomId) found.roomId = 'Выберите помещение';
    if (!form.paymentMethodId) found.paymentMethodId = 'Выберите способ оплаты';
    if (!isRealDate(form.eventDate)) found.eventDate = 'Дата в формате ДД.ММ.ГГГГ';
    return found;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const [day, month, year] = form.eventDate.split('.');
    onSubmit({
      roomId: Number(form.roomId),
      paymentMethodId: Number(form.paymentMethodId),
      eventDate: year + '-' + month + '-' + day,
    });
  }

  const fieldClass = (name) => 'form-control' + (errors[name] ? ' is-invalid' : '');

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="roomId">Помещение</label>
      <select id="roomId" name="roomId" value={form.roomId} onChange={handleChange} className={fieldClass('roomId')}>
        <option value="">Выберите помещение</option>
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>{room.title}</option>
        ))}
      </select>
      {errors.roomId && <div className="invalid-feedback">{errors.roomId}</div>}

      <label htmlFor="paymentMethodId">Способ оплаты</label>
      <select
        id="paymentMethodId"
        name="paymentMethodId"
        value={form.paymentMethodId}
        onChange={handleChange}
        className={fieldClass('paymentMethodId')}
      >
        <option value="">Выберите способ оплаты</option>
        {payments.map((item) => (
          <option key={item.id} value={item.id}>{item.title}</option>
        ))}
      </select>
      {errors.paymentMethodId && <div className="invalid-feedback">{errors.paymentMethodId}</div>}

      <label htmlFor="eventDate">Дата</label>
      <input
        id="eventDate"
        name="eventDate"
        value={form.eventDate}
        onChange={handleChange}
        placeholder="ДД.ММ.ГГГГ"
        className={fieldClass('eventDate')}
      />
      {errors.eventDate && <div className="invalid-feedback">{errors.eventDate}</div>}

      <button type="submit">Отправить заявку</button>
    </form>
  );
}`,
    solutionExplanation: `Форма заявки собирает вместе почти всё, что проверяют в модулях 1 и 2.

**Справочники приходят с сервера.** Соблазн зашить три помещения прямо в код велик — но тогда список разойдётся с базой, и внешний ключ отклонит вставку. Справочник — единственный источник истины, а \`option\` строится из него.

**Значение option — идентификатор, а не название.** В базе хранится \`room_id\`, и передавать туда строку «Коворкинг» бессмысленно. При этом любое значение из \`select\` приходит **строкой**: \`"2"\`, а не \`2\`. Без \`Number()\` в тело запроса уйдёт строка, и сравнение с числовым столбцом может повести себя неожиданно.

**Проверка даты в два шага.** Регулярное выражение ловит только форму записи. «31.02.2026» ей полностью соответствует — но такой даты нет. Второй шаг: создаём \`Date\` и проверяем, что день и месяц остались прежними. Если объект «переехал» на 3 марта, значит, исходная дата была несуществующей.

**Два формата даты.** Пользователь видит ДД.ММ.ГГГГ — это прямое требование задания. База хранит ГГГГ-ММ-ДД — это формат типа \`DATE\`. Перевод делает форма, и делает его явно через \`split\`, а не через разбор строки конструктором \`Date\`: тот ведёт себя по-разному в разных браузерах.

**Один обработчик на все поля.** \`event.target.name\` вместе с вычисляемым ключом \`[name]\` заменяет три отдельные функции одной. Именно поэтому у каждого поля обязателен атрибут \`name\`.`,
    maxScore: 27,
    estimatedMinutes: 40,
    examRefs: ['m1-order', 'm2-order-form'],
    planDays: ['day-18-5'],
    source: 'plan',
  },
];
