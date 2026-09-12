import type { Task } from '../types';

/**
 * Месяц 4: задания на серверную логику.
 *
 * Express и MySQL в браузере не запустить, поэтому проверяется то, что
 * действительно можно проверить, — сама логика: валидация, правила доступа,
 * порядок проверок в маршруте. Зависимости (база, bcrypt, jwt) передаются
 * параметрами, как это делают при написании тестов в настоящем проекте.
 */
export const MONTH_04_SERVER_TASKS: Task[] = [
  {
    id: 'task-express-routes',
    title: 'Обработчики маршрутов Express',
    kind: 'api',
    runtime: 'js',
    difficulty: 2,
    tech: ['express', 'node'],
    topicIds: ['express-basics'],
    monthNo: 4,
    weekNo: 15,
    statement: `Напишите три обработчика Express. Они принимают \`(req, res)\` — объекты того же вида, что в настоящем приложении.

Данные лежат в массиве \`applications\`, объявленном в коде.

1. \`getApplications(req, res)\` — отвечает списком всех заявок: \`res.json(applications)\`.
2. \`createApplication(req, res)\` — читает \`req.body\` с полями \`room\` и \`date\`. Если чего-то не хватает — ответ \`400\` с \`{ error: 'Укажите помещение и дату' }\`. Иначе добавляет заявку со статусом «Новая» и новым id (максимальный + 1, для пустого списка — 1) и отвечает \`201\` с созданной заявкой.
3. \`changeStatus(req, res)\` — берёт \`req.params.id\` (строка!) и \`req.body.status\`. Если заявки нет — \`404\` с \`{ error: 'Заявка не найдена' }\`. Если статус не входит в список допустимых — \`400\` с \`{ error: 'Недопустимый статус' }\`. Иначе меняет статус и отвечает обновлённой заявкой.

Допустимые статусы для смены: «Мероприятие назначено» и «Мероприятие завершено».`,
    requirements: [
      'getApplications возвращает весь список',
      'Пустые поля дают ответ 400',
      'Новая заявка получает статус «Новая» и код 201',
      'Несуществующая заявка даёт 404',
      'Недопустимый статус даёт 400',
    ],
    starterCode: `const applications = [
  { id: 1, room: 'Коворкинг', date: '2026-09-14', status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '2026-09-21', status: 'Мероприятие назначено' },
];

const ALLOWED_STATUSES = ['Мероприятие назначено', 'Мероприятие завершено'];

function getApplications(req, res) {
  // ваш код
}

function createApplication(req, res) {
  // ваш код
}

function changeStatus(req, res) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Список заявок',
        type: 'assert',
        code: `let body = null;
const res = { json: (data) => { body = data; return res; }, status: () => res };
ctx.solution.get('getApplications')({}, res);
ctx.assert(Array.isArray(body), 'Должен вернуться массив');
ctx.assert(body.length === 2, 'В списке две заявки, получено ' + (body && body.length));`,
        points: 3,
      },
      {
        id: 't2',
        name: 'Пустые поля дают 400',
        type: 'assert',
        code: `let code = 200; let body = null;
const res = { status: (c) => { code = c; return res; }, json: (d) => { body = d; return res; } };
ctx.solution.get('createApplication')({ body: { room: '' } }, res);
ctx.assert(code === 400, 'Ожидался код 400, получен ' + code, 400, code);
ctx.assert(body && body.error === 'Укажите помещение и дату', 'Нужен текст «Укажите помещение и дату», получено ' + ctx.preview(body));`,
        points: 4,
      },
      {
        id: 't3',
        name: 'Создание заявки: код 201 и статус «Новая»',
        type: 'assert',
        code: `let code = 200; let body = null;
const res = { status: (c) => { code = c; return res; }, json: (d) => { body = d; return res; } };
ctx.solution.get('createApplication')({ body: { room: 'Аудитория', date: '2026-10-01' } }, res);
ctx.assert(code === 201, 'Ожидался код 201, получен ' + code, 201, code);
ctx.assert(body && body.status === 'Новая', 'Новая заявка должна получать статус «Новая»');
ctx.assert(body.id === 3, 'Новый id должен быть 3 (максимальный 2 + 1), получено ' + ctx.preview(body.id));
ctx.assert(body.room === 'Аудитория', 'В заявку должно попасть помещение из запроса');`,
        points: 5,
      },
      {
        id: 't4',
        name: 'Несуществующая заявка даёт 404',
        type: 'assert',
        code: `let code = 200; let body = null;
const res = { status: (c) => { code = c; return res; }, json: (d) => { body = d; return res; } };
ctx.solution.get('changeStatus')({ params: { id: '99' }, body: { status: 'Мероприятие назначено' } }, res);
ctx.assert(code === 404, 'Ожидался код 404, получен ' + code, 404, code);
ctx.assert(body && body.error === 'Заявка не найдена', 'Нужен текст «Заявка не найдена»');`,
        points: 4,
      },
      {
        id: 't5',
        name: 'Недопустимый статус даёт 400',
        type: 'assert',
        code: `let code = 200; let body = null;
const res = { status: (c) => { code = c; return res; }, json: (d) => { body = d; return res; } };
ctx.solution.get('changeStatus')({ params: { id: '1' }, body: { status: 'Отменена' } }, res);
ctx.assert(code === 400, 'Ожидался код 400, получен ' + code, 400, code);
ctx.assert(body && body.error === 'Недопустимый статус', 'Нужен текст «Недопустимый статус»');`,
        points: 5,
      },
      {
        id: 't6',
        name: 'Смена статуса работает',
        type: 'assert',
        code: `let body = null;
const res = { status: () => res, json: (d) => { body = d; return res; } };
ctx.solution.get('changeStatus')({ params: { id: '1' }, body: { status: 'Мероприятие завершено' } }, res);
ctx.assert(body && body.status === 'Мероприятие завершено', 'Статус должен измениться, получено ' + ctx.preview(body));
ctx.assert(body.id === 1, 'Должна вернуться изменённая заявка');`,
        points: 4,
      },
      {
        id: 't7',
        name: 'Идентификатор из адреса приходит строкой',
        type: 'assert',
        code: `let code = 200;
const res = { status: (c) => { code = c; return res; }, json: () => res };
ctx.solution.get('changeStatus')({ params: { id: '2' }, body: { status: 'Мероприятие завершено' } }, res);
ctx.assert(code !== 404, 'req.params.id — строка «2», её нужно привести к числу перед сравнением с id заявки');`,
        points: 4,
      },
    ],
    hints: [
      { level: 1, text: 'res.status(400).json({...}) — цепочка: status возвращает сам res, поэтому json вызывается следом.', penaltyPercent: 10 },
      { level: 2, text: 'req.params.id всегда строка. Сравнивать с числовым id нужно через Number(req.params.id).', penaltyPercent: 20 },
      {
        level: 3,
        text: 'Порядок проверок в changeStatus: сначала ищем заявку (нет → 404), потом проверяем статус по белому списку (нет → 400), и только затем меняем.',
        penaltyPercent: 35,
      },
    ],
    solution: `const applications = [
  { id: 1, room: 'Коворкинг', date: '2026-09-14', status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '2026-09-21', status: 'Мероприятие назначено' },
];

const ALLOWED_STATUSES = ['Мероприятие назначено', 'Мероприятие завершено'];

function getApplications(req, res) {
  res.json(applications);
}

function createApplication(req, res) {
  const { room, date } = req.body ?? {};

  if (!room || !date) {
    return res.status(400).json({ error: 'Укажите помещение и дату' });
  }

  const application = {
    id: applications.length ? Math.max(...applications.map((a) => a.id)) + 1 : 1,
    room,
    date,
    status: 'Новая',
  };

  applications.push(application);
  res.status(201).json(application);
}

function changeStatus(req, res) {
  const id = Number(req.params.id);
  const application = applications.find((a) => a.id === id);

  if (!application) {
    return res.status(404).json({ error: 'Заявка не найдена' });
  }

  if (!ALLOWED_STATUSES.includes(req.body?.status)) {
    return res.status(400).json({ error: 'Недопустимый статус' });
  }

  application.status = req.body.status;
  res.json(application);
}`,
    solutionExplanation:
      'Белый список статусов — прямое требование задания: администратор может поставить только «Мероприятие назначено» или «Мероприятие завершено». Выпадающий список на клиенте этого не гарантирует: запрос можно отправить напрямую.',
    maxScore: 29,
    estimatedMinutes: 35,
    examRefs: ['m1-admin', 'm1-order'],
    planDays: ['day-15-2'],
    source: 'plan',
  },

  {
    id: 'task-server-validation',
    title: 'Серверная валидация регистрации',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['express', 'security'],
    topicIds: ['server-validation'],
    monthNo: 4,
    weekNo: 15,
    statement: `Клиенту доверять нельзя: запрос можно отправить в обход формы. Напишите проверку, которая повторяет правила задания на сервере.

\`validateRegister(body)\` возвращает объект ошибок \`{ поле: текст }\`. Пустой объект означает, что данные корректны.

Правила:

- \`login\` — обязателен, только латинские буквы и цифры, минимум 6 символов;
- \`password\` — обязателен, минимум 8 символов;
- \`fullName\`, \`phone\`, \`email\` — обязательны (после обрезки пробелов);
- \`email\` — должен содержать символ \`@\`.

Тексты ошибок:

| Поле | Пусто | Не подходит |
|---|---|---|
| login | «Введите логин» | «Только латинские буквы и цифры, минимум 6 символов» |
| password | «Введите пароль» | «Пароль не короче 8 символов» |
| fullName | «Укажите ФИО» | — |
| phone | «Укажите телефон» | — |
| email | «Укажите e-mail» | «Некорректный e-mail» |

Функция не должна падать, если пришёл \`null\`, число или вообще ничего.`,
    requirements: [
      'Проверяются все пять полей',
      'Тексты ошибок точные',
      'Пробелы обрезаются',
      'Функция не падает на некорректных типах',
      'Корректные данные дают пустой объект',
    ],
    starterCode: `function validateRegister(body) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Корректные данные — ошибок нет',
        type: 'expr',
        expression: `validateRegister({ login: 'ivanov26', password: 'demo2026', fullName: 'Иванов Иван', phone: '+79990000000', email: 'ivan@example.com' })`,
        expected: {},
        points: 4,
      },
      {
        id: 't2',
        name: 'Пустой объект — ошибки у всех полей',
        type: 'assert',
        code: `const errors = ctx.solution.get('validateRegister')({});
ctx.assert(Object.keys(errors).length === 5, 'Ожидалось пять ошибок, получено ' + Object.keys(errors).length);
ctx.assert(errors.login === 'Введите логин', 'Текст ошибки логина должен быть «Введите логин»');
ctx.assert(errors.password === 'Введите пароль', 'Текст ошибки пароля должен быть «Введите пароль»');`,
        points: 5,
      },
      {
        id: 't3',
        name: 'Кириллица в логине',
        type: 'assert',
        code: `const errors = ctx.solution.get('validateRegister')({ login: 'иванов26', password: 'demo2026', fullName: 'И', phone: '+7', email: 'a@b.ru' });
ctx.assert(errors.login === 'Только латинские буквы и цифры, минимум 6 символов', 'Кириллица в логине должна давать ошибку формата, получено ' + ctx.preview(errors.login));`,
        points: 4,
      },
      {
        id: 't4',
        name: 'Короткий пароль',
        type: 'assert',
        code: `const errors = ctx.solution.get('validateRegister')({ login: 'ivanov26', password: 'demo202', fullName: 'И', phone: '+7', email: 'a@b.ru' });
ctx.assert(errors.password === 'Пароль не короче 8 символов', 'Пароль из семи символов должен давать ошибку');`,
        points: 4,
      },
      {
        id: 't5',
        name: 'Пробелы обрезаются',
        type: 'assert',
        code: `const errors = ctx.solution.get('validateRegister')({ login: 'ivanov26', password: 'demo2026', fullName: '   ', phone: '+7', email: 'a@b.ru' });
ctx.assert(errors.fullName === 'Укажите ФИО', 'Строка из пробелов должна считаться пустой');`,
        points: 4,
      },
      {
        id: 't6',
        name: 'Некорректный e-mail',
        type: 'assert',
        code: `const errors = ctx.solution.get('validateRegister')({ login: 'ivanov26', password: 'demo2026', fullName: 'И', phone: '+7', email: 'ivan.example.com' });
ctx.assert(errors.email === 'Некорректный e-mail', 'E-mail без @ должен давать ошибку формата');`,
        points: 4,
      },
      {
        id: 't7',
        name: 'Функция не падает на мусоре',
        type: 'assert',
        code: `const validate = ctx.solution.get('validateRegister');
[null, undefined, { login: 42 }, { password: {} }, 'строка'].forEach((input) => {
  const errors = validate(input);
  ctx.assert(errors && typeof errors === 'object', 'На вход ' + ctx.preview(input) + ' функция должна вернуть объект ошибок, а не падать');
});`,
        points: 5,
      },
    ],
    hints: [
      { level: 1, text: 'Приводите значения безопасно: String(body?.login ?? "").trim().', penaltyPercent: 10 },
      { level: 2, text: 'Порядок проверок: сначала пустота, потом формат. Так пользователь получает самую полезную подсказку.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'const LOGIN_PATTERN = /^[A-Za-z0-9]{6,}$/; if (!login) errors.login = "Введите логин"; else if (!LOGIN_PATTERN.test(login)) errors.login = "Только латинские буквы и цифры, минимум 6 символов";',
        penaltyPercent: 35,
      },
    ],
    solution: `const LOGIN_PATTERN = /^[A-Za-z0-9]{6,}$/;

function validateRegister(body) {
  const errors = {};
  const data = body && typeof body === 'object' ? body : {};

  const login = String(data.login ?? '').trim();
  const password = String(data.password ?? '');
  const fullName = String(data.fullName ?? '').trim();
  const phone = String(data.phone ?? '').trim();
  const email = String(data.email ?? '').trim();

  if (!login) errors.login = 'Введите логин';
  else if (!LOGIN_PATTERN.test(login)) errors.login = 'Только латинские буквы и цифры, минимум 6 символов';

  if (!password) errors.password = 'Введите пароль';
  else if (password.length < 8) errors.password = 'Пароль не короче 8 символов';

  if (!fullName) errors.fullName = 'Укажите ФИО';
  if (!phone) errors.phone = 'Укажите телефон';

  if (!email) errors.email = 'Укажите e-mail';
  else if (!email.includes('@')) errors.email = 'Некорректный e-mail';

  return errors;
}`,
    solutionExplanation:
      'Приведение через String(... ?? "") защищает от любого содержимого запроса: клиент может прислать число, объект или вообще ничего. Эта же функция почти без изменений работает и на фронтенде — правила должны совпадать.',
    maxScore: 30,
    estimatedMinutes: 30,
    examRefs: ['m1-register', 'm2-register-hints', 'm3-quality'],
    planDays: ['day-15-6'],
    source: 'plan',
  },

  {
    id: 'task-auth-hashing',
    title: 'Регистрация с хешированием пароля',
    kind: 'api',
    runtime: 'js',
    difficulty: 3,
    tech: ['security', 'node'],
    topicIds: ['auth-hashing'],
    monthNo: 4,
    weekNo: 16,
    statement: `Напишите функцию регистрации. Зависимости передаются параметром — так её можно проверить без настоящей базы и bcrypt.

\`registerUser(data, deps)\`, где \`deps\` содержит:

- \`hash(password)\` — возвращает обещание с хешем;
- \`findByLogin(login)\` — обещание с пользователем или \`null\`;
- \`insert(user)\` — обещание с созданным пользователем.

Порядок работы:

1. Проверить данные функцией \`validate\` (она уже написана). Если есть ошибки — вернуть \`{ status: 400, body: { errors } }\`.
2. Проверить, свободен ли логин. Если занят — \`{ status: 409, body: { errors: { login: 'Такой логин уже занят' } } }\`.
3. Захешировать пароль и создать пользователя с полем \`passwordHash\` (не \`password\`!) и ролью \`'user'\`.
4. Вернуть \`{ status: 201, body: { id, login, fullName, role } }\` — **без хеша пароля**.`,
    requirements: [
      'Проверка данных выполняется первой',
      'Занятый логин даёт код 409',
      'Пароль сохраняется только хешем',
      'В ответе нет хеша и пароля',
      'Роль по умолчанию — user',
    ],
    starterCode: `const LOGIN_PATTERN = /^[A-Za-z0-9]{6,}$/;

function validate(data) {
  const errors = {};
  const login = String(data?.login ?? '').trim();
  const password = String(data?.password ?? '');
  if (!LOGIN_PATTERN.test(login)) errors.login = 'Некорректный логин';
  if (password.length < 8) errors.password = 'Пароль не короче 8 символов';
  if (!String(data?.fullName ?? '').trim()) errors.fullName = 'Укажите ФИО';
  return errors;
}

async function registerUser(data, deps) {
  // ваш код
}`,
    timeLimitMs: 10000,
    tests: [
      {
        id: 't1',
        name: 'Некорректные данные дают 400',
        type: 'assert',
        code: `const register = ctx.solution.get('registerUser');
const deps = { hash: async () => 'x', findByLogin: async () => null, insert: async (u) => u };
return register({ login: 'ab', password: '1', fullName: '' }, deps).then((result) => {
  ctx.assert(result.status === 400, 'Ожидался код 400, получен ' + result.status, 400, result.status);
  ctx.assert(result.body && result.body.errors, 'В ответе должен быть объект errors');
});`,
        points: 4,
      },
      {
        id: 't2',
        name: 'Проверка идёт до обращения к базе',
        type: 'assert',
        code: `const register = ctx.solution.get('registerUser');
let queried = false;
const deps = { hash: async () => 'x', findByLogin: async () => { queried = true; return null; }, insert: async (u) => u };
return register({ login: 'ab', password: '1', fullName: '' }, deps).then(() => {
  ctx.assert(!queried, 'При некорректных данных запрос к базе делать не нужно');
});`,
        points: 4,
      },
      {
        id: 't3',
        name: 'Занятый логин даёт 409',
        type: 'assert',
        code: `const register = ctx.solution.get('registerUser');
const deps = {
  hash: async () => 'x',
  findByLogin: async () => ({ id: 1, login: 'ivanov26' }),
  insert: async (u) => u,
};
return register({ login: 'ivanov26', password: 'demo2026', fullName: 'Иванов' }, deps).then((result) => {
  ctx.assert(result.status === 409, 'Занятый логин — это конфликт, код 409, получен ' + result.status, 409, result.status);
  ctx.assert(result.body.errors && result.body.errors.login === 'Такой логин уже занят', 'Нужен текст «Такой логин уже занят» у поля login');
});`,
        points: 5,
      },
      {
        id: 't4',
        name: 'Пароль хешируется',
        type: 'assert',
        code: `const register = ctx.solution.get('registerUser');
let hashedInput = null;
let inserted = null;
const deps = {
  hash: async (password) => { hashedInput = password; return 'HASH(' + password + ')'; },
  findByLogin: async () => null,
  insert: async (user) => { inserted = user; return { id: 7, ...user }; },
};
return register({ login: 'ivanov26', password: 'demo2026', fullName: 'Иванов Иван' }, deps).then(() => {
  ctx.assert(hashedInput === 'demo2026', 'Функция hash должна получить исходный пароль');
  ctx.assert(inserted, 'Пользователь должен быть передан в insert');
  ctx.assert(inserted.passwordHash === 'HASH(demo2026)', 'В базу должен уходить хеш в поле passwordHash');
  ctx.assert(!('password' in inserted), 'Поле password в базу сохранять нельзя');
});`,
        points: 6,
      },
      {
        id: 't5',
        name: 'Роль по умолчанию — user',
        type: 'assert',
        code: `const register = ctx.solution.get('registerUser');
let inserted = null;
const deps = {
  hash: async () => 'h',
  findByLogin: async () => null,
  insert: async (user) => { inserted = user; return { id: 1, ...user }; },
};
return register({ login: 'ivanov26', password: 'demo2026', fullName: 'Иванов', role: 'admin' }, deps).then(() => {
  ctx.assert(inserted.role === 'user', 'Роль ставит сервер, а не клиент: даже если в запросе пришло admin, должно быть user');
});`,
        points: 5,
      },
      {
        id: 't6',
        name: 'В ответе нет хеша пароля',
        type: 'assert',
        code: `const register = ctx.solution.get('registerUser');
const deps = {
  hash: async () => 'SECRET_HASH',
  findByLogin: async () => null,
  insert: async (user) => ({ id: 42, ...user }),
};
return register({ login: 'ivanov26', password: 'demo2026', fullName: 'Иванов Иван' }, deps).then((result) => {
  ctx.assert(result.status === 201, 'Ожидался код 201, получен ' + result.status, 201, result.status);
  const body = JSON.stringify(result.body);
  ctx.assert(!body.includes('SECRET_HASH'), 'Хеш пароля не должен уходить клиенту');
  ctx.assert(!body.includes('demo2026'), 'Пароль не должен уходить клиенту');
  ctx.assert(result.body.id === 42, 'В ответе должен быть id созданного пользователя');
  ctx.assert(result.body.login === 'ivanov26', 'В ответе должен быть логин');
});`,
        points: 6,
      },
    ],
    hints: [
      { level: 1, text: 'Порядок важен: сначала validate, потом findByLogin, потом hash и insert.', penaltyPercent: 10 },
      { level: 2, text: 'Объект для базы собирайте вручную, не рассыпая весь data: иначе туда попадут password и role из запроса.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'const created = await deps.insert({ login, passwordHash, fullName, phone, email, role: "user" }); return { status: 201, body: { id: created.id, login: created.login, fullName: created.fullName, role: created.role } };',
        penaltyPercent: 35,
      },
    ],
    solution: `const LOGIN_PATTERN = /^[A-Za-z0-9]{6,}$/;

function validate(data) {
  const errors = {};
  const login = String(data?.login ?? '').trim();
  const password = String(data?.password ?? '');
  if (!LOGIN_PATTERN.test(login)) errors.login = 'Некорректный логин';
  if (password.length < 8) errors.password = 'Пароль не короче 8 символов';
  if (!String(data?.fullName ?? '').trim()) errors.fullName = 'Укажите ФИО';
  return errors;
}

async function registerUser(data, deps) {
  const errors = validate(data);
  if (Object.keys(errors).length) {
    return { status: 400, body: { errors } };
  }

  const login = String(data.login).trim();

  const existing = await deps.findByLogin(login);
  if (existing) {
    return { status: 409, body: { errors: { login: 'Такой логин уже занят' } } };
  }

  const passwordHash = await deps.hash(data.password);

  // Поля перечислены явно: роль и пароль из запроса сюда не попадут
  const created = await deps.insert({
    login,
    passwordHash,
    fullName: String(data.fullName).trim(),
    phone: String(data.phone ?? '').trim(),
    email: String(data.email ?? '').trim(),
    role: 'user',
  });

  return {
    status: 201,
    body: { id: created.id, login: created.login, fullName: created.fullName, role: created.role },
  };
}`,
    solutionExplanation:
      'Две ключевые детали безопасности: роль задаёт сервер (иначе любой зарегистрируется администратором) и ответ собирается из явно перечисленных полей (иначе хеш пароля уйдёт клиенту).',
    maxScore: 30,
    estimatedMinutes: 35,
    examRefs: ['m1-register', 'm3-quality'],
    planDays: ['day-16-1', 'day-16-2'],
    source: 'plan',
  },

  {
    id: 'task-auth-jwt',
    title: 'Вход и выдача токена',
    kind: 'api',
    runtime: 'js',
    difficulty: 3,
    tech: ['security', 'node'],
    topicIds: ['auth-jwt'],
    monthNo: 4,
    weekNo: 16,
    statement: `Напишите обработчик входа. Зависимости приходят параметром:

- \`findByLogin(login)\` — пользователь или \`null\`;
- \`compare(password, hash)\` — обещание с \`true\`/\`false\`;
- \`sign(payload)\` — возвращает строку токена.

\`loginUser(data, deps)\` возвращает:

1. \`{ status: 400, body: { error: 'Введите логин и пароль' } }\` — если чего-то не хватает;
2. \`{ status: 401, body: { error: 'Неверный логин или пароль' } }\` — если пользователя нет **или** пароль не подошёл. Текст в обоих случаях **одинаковый**;
3. при успехе \`{ status: 200, body: { token, user: { id, login, fullName, role } } }\`.

В токен кладите только \`{ id, role }\` — ничего секретного.`,
    requirements: [
      'Пустые поля дают 400',
      'Неверный логин и неверный пароль дают одинаковый ответ 401',
      'В токен попадают только id и role',
      'В ответе нет хеша пароля',
      'Пароль сверяется через compare',
    ],
    starterCode: `async function loginUser(data, deps) {
  // ваш код
}`,
    timeLimitMs: 10000,
    tests: [
      {
        id: 't1',
        name: 'Пустые поля дают 400',
        type: 'assert',
        code: `const login = ctx.solution.get('loginUser');
const deps = { findByLogin: async () => null, compare: async () => false, sign: () => 'token' };
return login({ login: '', password: '' }, deps).then((result) => {
  ctx.assert(result.status === 400, 'Ожидался код 400, получен ' + result.status, 400, result.status);
  ctx.assert(result.body.error === 'Введите логин и пароль', 'Нужен текст «Введите логин и пароль»');
});`,
        points: 4,
      },
      {
        id: 't2',
        name: 'Несуществующий логин даёт 401',
        type: 'assert',
        code: `const login = ctx.solution.get('loginUser');
const deps = { findByLogin: async () => null, compare: async () => true, sign: () => 'token' };
return login({ login: 'nobody26', password: 'demo2026' }, deps).then((result) => {
  ctx.assert(result.status === 401, 'Ожидался код 401, получен ' + result.status, 401, result.status);
  ctx.assert(result.body.error === 'Неверный логин или пароль', 'Текст должен быть «Неверный логин или пароль»');
});`,
        points: 4,
      },
      {
        id: 't3',
        name: 'Неверный пароль даёт тот же ответ',
        type: 'assert',
        code: `const login = ctx.solution.get('loginUser');
const deps = {
  findByLogin: async () => ({ id: 1, login: 'ivanov26', passwordHash: 'h', fullName: 'Иванов', role: 'user' }),
  compare: async () => false,
  sign: () => 'token',
};
return login({ login: 'ivanov26', password: 'wrong' }, deps).then((result) => {
  ctx.assert(result.status === 401, 'Ожидался код 401, получен ' + result.status);
  ctx.assert(result.body.error === 'Неверный логин или пароль', 'Ответ должен совпадать с ответом на несуществующий логин: иначе форму можно использовать для перебора логинов');
});`,
        points: 6,
      },
      {
        id: 't4',
        name: 'Пароль сверяется с хешем',
        type: 'assert',
        code: `const login = ctx.solution.get('loginUser');
let args = null;
const deps = {
  findByLogin: async () => ({ id: 1, login: 'ivanov26', passwordHash: 'STORED_HASH', fullName: 'Иванов', role: 'user' }),
  compare: async (password, hash) => { args = { password, hash }; return true; },
  sign: () => 'token',
};
return login({ login: 'ivanov26', password: 'demo2026' }, deps).then(() => {
  ctx.assert(args, 'Функция compare должна вызываться');
  ctx.assert(args.password === 'demo2026', 'Первым аргументом идёт введённый пароль');
  ctx.assert(args.hash === 'STORED_HASH', 'Вторым аргументом идёт хеш из базы');
});`,
        points: 5,
      },
      {
        id: 't5',
        name: 'В токен попадают только id и role',
        type: 'assert',
        code: `const login = ctx.solution.get('loginUser');
let payload = null;
const deps = {
  findByLogin: async () => ({ id: 5, login: 'ivanov26', passwordHash: 'SECRET', fullName: 'Иванов', role: 'admin' }),
  compare: async () => true,
  sign: (data) => { payload = data; return 'TOKEN'; },
};
return login({ login: 'ivanov26', password: 'demo2026' }, deps).then(() => {
  ctx.assert(payload, 'Функция sign должна вызываться');
  ctx.assert(payload.id === 5 && payload.role === 'admin', 'В токене должны быть id и role');
  ctx.assert(!('passwordHash' in payload), 'Хеш пароля в токен класть нельзя: содержимое токена читается без ключа');
  ctx.assert(Object.keys(payload).length === 2, 'В токене должно быть ровно два поля, найдено: ' + Object.keys(payload).join(', '));
});`,
        points: 6,
      },
      {
        id: 't6',
        name: 'Успешный вход возвращает токен и пользователя',
        type: 'assert',
        code: `const login = ctx.solution.get('loginUser');
const deps = {
  findByLogin: async () => ({ id: 5, login: 'ivanov26', passwordHash: 'SECRET_HASH', fullName: 'Иванов Иван', role: 'user' }),
  compare: async () => true,
  sign: () => 'TOKEN_VALUE',
};
return login({ login: 'ivanov26', password: 'demo2026' }, deps).then((result) => {
  ctx.assert(result.status === 200, 'Ожидался код 200, получен ' + result.status);
  ctx.assert(result.body.token === 'TOKEN_VALUE', 'В ответе должен быть токен');
  ctx.assert(result.body.user && result.body.user.id === 5, 'В ответе должен быть пользователь');
  ctx.assert(!JSON.stringify(result.body).includes('SECRET_HASH'), 'Хеш пароля не должен уходить клиенту');
});`,
        points: 6,
      },
    ],
    hints: [
      { level: 1, text: 'Проверяйте пользователя и пароль вместе: if (!user || !(await deps.compare(...))) — тогда ответ получится одинаковым.', penaltyPercent: 10 },
      { level: 2, text: 'Объект пользователя для ответа собирайте вручную, перечисляя поля: так хеш точно не попадёт наружу.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'const token = deps.sign({ id: user.id, role: user.role }); return { status: 200, body: { token, user: { id: user.id, login: user.login, fullName: user.fullName, role: user.role } } };',
        penaltyPercent: 35,
      },
    ],
    solution: `async function loginUser(data, deps) {
  const login = String(data?.login ?? '').trim();
  const password = String(data?.password ?? '');

  if (!login || !password) {
    return { status: 400, body: { error: 'Введите логин и пароль' } };
  }

  const user = await deps.findByLogin(login);

  // Одинаковый ответ для обоих случаев: иначе форму можно использовать
  // для проверки существования логинов
  if (!user || !(await deps.compare(password, user.passwordHash))) {
    return { status: 401, body: { error: 'Неверный логин или пароль' } };
  }

  const token = deps.sign({ id: user.id, role: user.role });

  return {
    status: 200,
    body: {
      token,
      user: { id: user.id, login: user.login, fullName: user.fullName, role: user.role },
    },
  };
}`,
    solutionExplanation:
      'Одинаковое сообщение для неверного логина и неверного пароля — не придирка: иначе форма входа превращается в инструмент проверки, какие логины зарегистрированы. Задание требует «информативные уведомления», и общий текст этому не противоречит.',
    maxScore: 31,
    estimatedMinutes: 35,
    examRefs: ['m1-login', 'm2-login-warnings'],
    planDays: ['day-16-3'],
    source: 'plan',
  },

  {
    id: 'task-auth-middleware',
    title: 'Middleware проверки токена и роли',
    kind: 'api',
    runtime: 'js',
    difficulty: 3,
    tech: ['express', 'security'],
    topicIds: ['auth-middleware'],
    monthNo: 4,
    weekNo: 16,
    statement: `Напишите две функции middleware. Проверка подписи токена приходит параметром — так функцию можно проверить без библиотеки.

**\`createRequireAuth(verify)\`** возвращает middleware \`(req, res, next)\`:

- берёт заголовок \`req.headers.authorization\` вида \`Bearer <токен>\`;
- нет заголовка или не тот формат → \`res.status(401).json({ error: 'Требуется вход' })\`, \`next\` **не** вызывается;
- \`verify(token)\` выбросил ошибку → \`res.status(401).json({ error: 'Сессия истекла, войдите снова' })\`;
- всё хорошо → положить \`{ id, role }\` из результата \`verify\` в \`req.user\` и вызвать \`next()\`.

**\`requireAdmin(req, res, next)\`**:

- \`req.user.role !== 'admin'\` → \`res.status(403).json({ error: 'Доступ только для администратора' })\`;
- иначе \`next()\`.

Обратите внимание на разницу кодов: 401 — «не знаю, кто вы», 403 — «знаю, но нельзя».`,
    requirements: [
      'Без заголовка — 401 и next не вызывается',
      'Неверный токен — 401 с другим текстом',
      'Данные из токена попадают в req.user',
      'Не администратор получает 403',
      'При успехе вызывается next()',
    ],
    starterCode: `function createRequireAuth(verify) {
  return function requireAuth(req, res, next) {
    // ваш код
  };
}

function requireAdmin(req, res, next) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Без заголовка — 401',
        type: 'assert',
        code: `const requireAuth = ctx.solution.get('createRequireAuth')(() => ({ id: 1, role: 'user' }));
let code = 200; let body = null; let nextCalled = false;
const res = { status: (c) => { code = c; return res; }, json: (d) => { body = d; return res; } };
requireAuth({ headers: {} }, res, () => { nextCalled = true; });
ctx.assert(code === 401, 'Ожидался код 401, получен ' + code, 401, code);
ctx.assert(body.error === 'Требуется вход', 'Нужен текст «Требуется вход»');
ctx.assert(!nextCalled, 'Без токена next вызывать нельзя — иначе защита не работает');`,
        points: 5,
      },
      {
        id: 't2',
        name: 'Заголовок без Bearer — 401',
        type: 'assert',
        code: `const requireAuth = ctx.solution.get('createRequireAuth')(() => ({ id: 1, role: 'user' }));
let code = 200; let nextCalled = false;
const res = { status: (c) => { code = c; return res; }, json: () => res };
requireAuth({ headers: { authorization: 'abc123' } }, res, () => { nextCalled = true; });
ctx.assert(code === 401, 'Заголовок без слова Bearer должен давать 401');
ctx.assert(!nextCalled, 'next вызывать нельзя');`,
        points: 4,
      },
      {
        id: 't3',
        name: 'Неверный токен — 401 с другим текстом',
        type: 'assert',
        code: `const requireAuth = ctx.solution.get('createRequireAuth')(() => { throw new Error('invalid'); });
let code = 200; let body = null; let nextCalled = false;
const res = { status: (c) => { code = c; return res; }, json: (d) => { body = d; return res; } };
requireAuth({ headers: { authorization: 'Bearer broken' } }, res, () => { nextCalled = true; });
ctx.assert(code === 401, 'Ожидался код 401, получен ' + code);
ctx.assert(body.error === 'Сессия истекла, войдите снова', 'Нужен текст «Сессия истекла, войдите снова», получено ' + ctx.preview(body.error));
ctx.assert(!nextCalled, 'next вызывать нельзя');`,
        points: 5,
      },
      {
        id: 't4',
        name: 'Данные из токена попадают в req.user',
        type: 'assert',
        code: `let receivedToken = null;
const requireAuth = ctx.solution.get('createRequireAuth')((token) => {
  receivedToken = token;
  return { id: 7, role: 'admin', extra: 'лишнее' };
});
const req = { headers: { authorization: 'Bearer abc.def.ghi' } };
let nextCalled = false;
requireAuth(req, { status: () => ({ json: () => {} }) }, () => { nextCalled = true; });
ctx.assert(receivedToken === 'abc.def.ghi', 'В verify должен уходить сам токен без слова Bearer, получено ' + ctx.preview(receivedToken));
ctx.assert(nextCalled, 'При корректном токене нужно вызвать next()');
ctx.assert(req.user && req.user.id === 7 && req.user.role === 'admin', 'В req.user должны попасть id и role');`,
        points: 6,
      },
      {
        id: 't5',
        name: 'Не администратор получает 403',
        type: 'assert',
        code: `let code = 200; let body = null; let nextCalled = false;
const res = { status: (c) => { code = c; return res; }, json: (d) => { body = d; return res; } };
ctx.solution.get('requireAdmin')({ user: { id: 1, role: 'user' } }, res, () => { nextCalled = true; });
ctx.assert(code === 403, 'Не хватает прав — это 403, а не 401 (пользователь известен), получен ' + code, 403, code);
ctx.assert(body.error === 'Доступ только для администратора', 'Нужен текст «Доступ только для администратора»');
ctx.assert(!nextCalled, 'next вызывать нельзя');`,
        points: 5,
      },
      {
        id: 't6',
        name: 'Администратор проходит дальше',
        type: 'assert',
        code: `let nextCalled = false;
ctx.solution.get('requireAdmin')({ user: { id: 1, role: 'admin' } }, { status: () => ({ json: () => {} }) }, () => { nextCalled = true; });
ctx.assert(nextCalled, 'Администратор должен проходить проверку');`,
        points: 3,
      },
      {
        id: 't7',
        name: 'Отсутствие req.user не ломает requireAdmin',
        type: 'assert',
        code: `let code = 200;
const res = { status: (c) => { code = c; return res; }, json: () => res };
ctx.solution.get('requireAdmin')({}, res, () => {});
ctx.assert(code === 403, 'Если req.user не задан, доступ нужно запретить, а не падать с ошибкой');`,
        points: 4,
      },
    ],
    hints: [
      { level: 1, text: 'Токен достаётся так: header.startsWith("Bearer ") ? header.slice(7) : null.', penaltyPercent: 10 },
      { level: 2, text: 'Перед каждым res.status обязателен return, иначе выполнение продолжится и сервер попытается ответить дважды.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'try { const payload = verify(token); req.user = { id: payload.id, role: payload.role }; next(); } catch { return res.status(401).json({ error: "Сессия истекла, войдите снова" }); }',
        penaltyPercent: 35,
      },
    ],
    solution: `function createRequireAuth(verify) {
  return function requireAuth(req, res, next) {
    const header = req.headers?.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Требуется вход' });
    }

    try {
      const payload = verify(token);
      req.user = { id: payload.id, role: payload.role };
      next();
    } catch {
      return res.status(401).json({ error: 'Сессия истекла, войдите снова' });
    }
  };
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Доступ только для администратора' });
  }
  next();
}`,
    solutionExplanation:
      'В req.user кладутся только id и role — остальные поля токена приложению не нужны. Именно из req.user потом берётся идентификатор для запроса WHERE user_id = ?, и подменить его клиент не может.',
    maxScore: 32,
    estimatedMinutes: 35,
    examRefs: ['m1-admin', 'm3-quality'],
    planDays: ['day-16-4'],
    source: 'plan',
  },

  {
    id: 'task-auth-roles',
    title: 'Правила доступа к заявкам',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['security'],
    topicIds: ['auth-roles'],
    monthNo: 4,
    weekNo: 16,
    statement: `Соберите правила доступа в одну функцию — так их легко проверить и не забыть ни одно.

\`can(user, action, application)\` возвращает \`true\` или \`false\`.

\`user\` — объект \`{ id, role }\` или \`null\` (гость).

Правила:

| Действие | Кто может |
|---|---|
| \`'view'\` | Администратор — любую заявку; пользователь — только свою |
| \`'create'\` | Любой вошедший |
| \`'changeStatus'\` | Только администратор |
| \`'review'\` | Только владелец заявки **и** только если статус не «Новая» |

Гость (\`user === null\`) не может ничего.`,
    requirements: [
      'Гость не может ничего',
      'Пользователь видит только свои заявки',
      'Администратор видит все',
      'Статус меняет только администратор',
      'Отзыв — только владелец и только после смены статуса',
    ],
    starterCode: `function can(user, action, application) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Гость не может ничего',
        type: 'assert',
        code: `const can = ctx.solution.get('can');
const app = { id: 1, userId: 1, status: 'Новая' };
['view', 'create', 'changeStatus', 'review'].forEach((action) => {
  ctx.assert(can(null, action, app) === false, 'Гость не должен иметь права «' + action + '»');
});`,
        points: 5,
      },
      {
        id: 't2',
        name: 'Пользователь видит свою заявку',
        type: 'assert',
        code: `const can = ctx.solution.get('can');
ctx.assert(can({ id: 1, role: 'user' }, 'view', { id: 10, userId: 1, status: 'Новая' }) === true, 'Свою заявку пользователь видеть может');`,
        points: 4,
      },
      {
        id: 't3',
        name: 'Чужую заявку пользователь не видит',
        type: 'assert',
        code: `const can = ctx.solution.get('can');
ctx.assert(can({ id: 1, role: 'user' }, 'view', { id: 10, userId: 2, status: 'Новая' }) === false, 'Чужую заявку видеть нельзя — это утечка данных');`,
        points: 5,
      },
      {
        id: 't4',
        name: 'Администратор видит любую заявку',
        type: 'assert',
        code: `const can = ctx.solution.get('can');
ctx.assert(can({ id: 99, role: 'admin' }, 'view', { id: 10, userId: 2, status: 'Новая' }) === true, 'Администратор получает полный доступ к просмотру всех заявок');`,
        points: 4,
      },
      {
        id: 't5',
        name: 'Статус меняет только администратор',
        type: 'assert',
        code: `const can = ctx.solution.get('can');
const app = { id: 10, userId: 1, status: 'Новая' };
ctx.assert(can({ id: 1, role: 'user' }, 'changeStatus', app) === false, 'Обычный пользователь не меняет статусы');
ctx.assert(can({ id: 99, role: 'admin' }, 'changeStatus', app) === true, 'Администратор меняет статусы');`,
        points: 5,
      },
      {
        id: 't6',
        name: 'Отзыв только после смены статуса',
        type: 'assert',
        code: `const can = ctx.solution.get('can');
const user = { id: 1, role: 'user' };
ctx.assert(can(user, 'review', { id: 10, userId: 1, status: 'Новая' }) === false, 'У заявки со статусом «Новая» отзыв недоступен — требование модуля 2');
ctx.assert(can(user, 'review', { id: 10, userId: 1, status: 'Мероприятие назначено' }) === true, 'После смены статуса отзыв доступен');
ctx.assert(can(user, 'review', { id: 10, userId: 1, status: 'Мероприятие завершено' }) === true, 'У завершённого мероприятия отзыв тоже доступен');`,
        points: 6,
      },
      {
        id: 't7',
        name: 'Отзыв к чужой заявке запрещён',
        type: 'assert',
        code: `const can = ctx.solution.get('can');
ctx.assert(can({ id: 1, role: 'user' }, 'review', { id: 10, userId: 2, status: 'Мероприятие завершено' }) === false, 'Отзыв можно оставить только к своей заявке');
ctx.assert(can({ id: 99, role: 'admin' }, 'review', { id: 10, userId: 2, status: 'Мероприятие завершено' }) === false, 'Администратор не оставляет отзывы за пользователей');`,
        points: 5,
      },
      {
        id: 't8',
        name: 'Создавать заявки может любой вошедший',
        type: 'assert',
        code: `const can = ctx.solution.get('can');
ctx.assert(can({ id: 1, role: 'user' }, 'create', null) === true, 'Вошедший пользователь может создать заявку');
ctx.assert(can(null, 'create', null) === false, 'Гость не может создать заявку');`,
        points: 4,
      },
    ],
    hints: [
      { level: 1, text: 'Начните с проверки: если пользователя нет — сразу false.', penaltyPercent: 10 },
      { level: 2, text: 'Владелец определяется сравнением user.id === application.userId.', penaltyPercent: 20 },
      {
        level: 3,
        text: "Для 'review' нужны два условия сразу: владелец И статус не «Новая». Для 'create' заявки может не быть вовсе — не обращайтесь к её полям.",
        penaltyPercent: 35,
      },
    ],
    solution: `function can(user, action, application) {
  if (!user) return false;

  const isAdmin = user.role === 'admin';
  const isOwner = Boolean(application) && application.userId === user.id;

  switch (action) {
    case 'create':
      return true;

    case 'view':
      return isAdmin || isOwner;

    case 'changeStatus':
      return isAdmin;

    case 'review':
      // Требование модуля 2: отзыв только владельцу и только после смены статуса
      return isOwner && application.status !== 'Новая';

    default:
      return false;
  }
}`,
    solutionExplanation:
      'Собранные в одном месте правила легко проверить тестами и невозможно случайно забыть в одном из маршрутов. На сервере эта функция вызывается в каждом обработчике перед действием — именно так требование «качество программного кода» превращается в конкретный код.',
    maxScore: 38,
    estimatedMinutes: 35,
    examRefs: ['m1-admin', 'm2-cabinet-ux', 'm3-quality'],
    planDays: ['day-16-5'],
    source: 'plan',
  },
];
