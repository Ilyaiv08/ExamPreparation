import type { Task } from '../types';

/** Месяц 6, недели 21–24: качество, безопасность, скорость. */
export const MONTH_06_TASKS: Task[] = [
  {
    id: 'task-sec-sql-params',
    title: 'Сборка запроса без инъекций',
    kind: 'fix-bug',
    runtime: 'js',
    difficulty: 4,
    tech: ['security', 'sql', 'express'],
    topicIds: ['security-basics', 'server-validation'],
    monthNo: 6,
    weekNo: 21,
    statement: `Перед вами функция, которая собирает запрос списка заявок для админки. Она работает — и содержит две дыры: значения склеиваются со строкой запроса, а имя столбца сортировки берётся из запроса как есть.

Перепишите \`buildOrdersQuery(filters)\` так, чтобы она возвращала \`{ sql, params }\`:

- все **значения** уходят в \`params\`, а в \`sql\` на их месте стоит \`?\`;
- имя столбца сортировки параметром передать нельзя — его проверяют по белому списку \`['id', 'event_date', 'status_id']\`, а при недопустимом значении берут \`id\`;
- фильтры необязательные: если \`statusId\` или \`userId\` не переданы, соответствующего условия в запросе быть не должно;
- если условий нет совсем, слова \`WHERE\` в запросе тоже быть не должно.

Базовая часть запроса:

\`\`\`sql
SELECT * FROM applications
\`\`\`

и далее — \`WHERE …\` (если есть условия) и \`ORDER BY <столбец>\`.`,
    requirements: [
      'Значения фильтров уходят в params, а не в текст запроса',
      'Имя столбца сортировки проверяется белым списком',
      'Недопустимая сортировка заменяется на id',
      'Без фильтров слова WHERE в запросе нет',
      'Два фильтра соединяются через AND',
    ],
    starterCode: `const SORT_COLUMNS = ['id', 'event_date', 'status_id'];

// Так писать нельзя — перепишите
function buildOrdersQuery(filters) {
  let sql = 'SELECT * FROM applications';
  const conditions = [];
  if (filters.statusId) conditions.push('status_id = ' + filters.statusId);
  if (filters.userId) conditions.push('user_id = ' + filters.userId);
  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
  sql += ' ORDER BY ' + (filters.sortBy || 'id');
  return { sql, params: [] };
}`,
    tests: [
      {
        id: 't1',
        name: 'Значения уходят параметрами',
        type: 'assert',
        code: `const { sql, params } = ctx.get('buildOrdersQuery')({ statusId: 2, userId: 7 });
ctx.assert(params.length === 2, 'В params должно быть два значения', 2, params.length);
ctx.assert(params.includes(2) && params.includes(7), 'Значения фильтров должны быть в params');
ctx.assert((sql.match(/\\?/g) || []).length === 2, 'В запросе должно быть два знака вопроса');
ctx.assert(!/status_id = 2/.test(sql), 'Значение не должно попадать в текст запроса');`,
        points: 5,
      },
      {
        id: 't2',
        name: 'Строка с инъекцией обезврежена',
        type: 'assert',
        code: `const evil = "1 OR 1=1; DROP TABLE users";
const { sql, params } = ctx.get('buildOrdersQuery')({ statusId: evil });
ctx.assert(!sql.includes('DROP'), 'Значение попало в текст запроса — это SQL-инъекция');
ctx.assert(params.includes(evil), 'Значение должно уйти параметром, а не в текст');`,
        points: 5,
      },
      {
        id: 't3',
        name: 'Белый список столбцов сортировки',
        type: 'assert',
        code: `const build = ctx.get('buildOrdersQuery');
const bad = build({ sortBy: 'id; DROP TABLE users' });
ctx.assert(!bad.sql.includes('DROP'), 'Имя столбца нужно проверять белым списком');
ctx.assert(/ORDER BY id\\s*$/.test(bad.sql.trim()), 'При недопустимом значении сортируем по id', 'ORDER BY id', bad.sql);
const good = build({ sortBy: 'event_date' });
ctx.assert(/ORDER BY event_date/.test(good.sql), 'Допустимое имя столбца должно применяться');`,
        points: 5,
      },
      {
        id: 't4',
        name: 'Без фильтров нет слова WHERE',
        type: 'assert',
        code: `const { sql, params } = ctx.get('buildOrdersQuery')({});
ctx.assert(!/WHERE/i.test(sql), 'Если условий нет, WHERE в запросе быть не должно', 'без WHERE', sql);
ctx.assert(params.length === 0, 'Параметров тоже быть не должно', 0, params.length);`,
        points: 4,
      },
      {
        id: 't5',
        name: 'Один фильтр — одно условие',
        type: 'assert',
        code: `const { sql, params } = ctx.get('buildOrdersQuery')({ userId: 3 });
ctx.assert(/WHERE/i.test(sql), 'С одним фильтром WHERE нужен');
ctx.assert(!/AND/i.test(sql), 'С одним условием слова AND быть не должно', 'без AND', sql);
ctx.assert(params.length === 1 && params[0] === 3, 'В params должно быть одно значение');`,
        points: 4,
      },
      {
        id: 't6',
        name: 'Склейки значений в коде не осталось',
        type: 'assert',
        code: `const clean = ctx.source.replace(/\\s+/g, ' ');
ctx.assert(!/status_id = ' \\+/.test(clean) && !/user_id = ' \\+/.test(clean),
  'В коде осталась склейка значения со строкой запроса');`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Два параллельных массива: один для условий (текст со знаком вопроса), другой для значений. Порядок значений должен совпадать с порядком знаков вопроса.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Имя столбца — это часть команды, а не данные. Параметром его передать нельзя в принципе, поэтому единственный безопасный способ — сверить со списком допустимых значений.',
        penaltyPercent: 25,
      },
      {
        level: 3,
        text: 'Каркас: `const where = []; const params = []; if (filters.statusId) { where.push("status_id = ?"); params.push(filters.statusId); }` и в конце `where.length ? " WHERE " + where.join(" AND ") : ""`.',
        penaltyPercent: 40,
      },
    ],
    solution: `const SORT_COLUMNS = ['id', 'event_date', 'status_id'];

function buildOrdersQuery(filters) {
  const where = [];
  const params = [];

  if (filters.statusId) {
    where.push('status_id = ?');
    params.push(filters.statusId);
  }

  if (filters.userId) {
    where.push('user_id = ?');
    params.push(filters.userId);
  }

  const sortColumn = SORT_COLUMNS.includes(filters.sortBy) ? filters.sortBy : 'id';

  let sql = 'SELECT * FROM applications';
  if (where.length > 0) sql += ' WHERE ' + where.join(' AND ');
  sql += ' ORDER BY ' + sortColumn;

  return { sql, params };
}`,
    solutionExplanation: `Разница между значением и частью команды — главная мысль этого задания.

**Значения передаются параметрами.** Когда драйвер видит \`?\`, он подставляет значение отдельно от текста запроса. База получает команду и данные по разным каналам, и данные в принципе не могут стать частью команды. Именно поэтому строка \`"1 OR 1=1; DROP TABLE users"\` в параметре безвредна: база честно поищет заявку со статусом, равным этой строке, ничего не найдёт и вернёт пустой список.

**Имя столбца параметром не передашь.** \`ORDER BY ?\` не работает — драйвер подставит значение как строку, и сортировка пойдёт по константе. Значит, имя столбца всегда попадает в текст команды, и защита у него может быть только одна: сверка со списком допустимых значений. Регулярное выражение вроде \`/^\\w+$/\` тут хуже — оно пропустит имя несуществующего столбца и даст ошибку базы вместо понятного поведения.

**Про \`WHERE\` без условий.** \`SELECT * FROM applications WHERE ORDER BY id\` — синтаксическая ошибка. Проверка \`where.length > 0\` нужна не для красоты.

**Про \`SELECT *\`.** В учебном задании это допустимо, но в маршруте лучше перечислять столбцы явно. Звёздочка однажды вынесет клиенту поле, которое туда попадать не должно, — например, добавленный позже \`password_hash\` при соединении с таблицей пользователей.`,
    maxScore: 26,
    estimatedMinutes: 30,
    examRefs: ['m3-quality', 'm2-admin-tools'],
    planDays: ['day-21-4'],
    source: 'plan',
  },

  {
    id: 'task-sec-ownership',
    title: 'Проверка принадлежности записи',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['security', 'express'],
    topicIds: ['security-basics', 'auth-roles'],
    monthNo: 6,
    weekNo: 21,
    statement: `Токен отвечает на вопрос «кто вы». Он ничего не говорит о том, ваша ли это заявка. Без второй проверки подстановка чужого \`id\` в адрес открывает доступ ко всем заявкам системы.

Напишите две функции.

\`\`\`js
canAccessOrder(user, order)
\`\`\`
Возвращает \`true\`, если пользователь — администратор либо заявка принадлежит ему. Если \`user\` или \`order\` отсутствуют — \`false\`.

\`\`\`js
guardOrder(user, order)
\`\`\`
Возвращает \`null\`, если доступ разрешён. Иначе — объект ответа:

- заявки нет (\`order\` — \`null\`/\`undefined\`) → \`{ status: 404, body: { message: 'Заявка не найдена' } }\`;
- заявка есть, но чужая → \`{ status: 403, body: { message: 'Доступ запрещён' } }\`;
- пользователя нет → \`{ status: 401, body: { message: 'Требуется вход' } }\`.

Порядок проверок: сначала вход, потом существование записи, потом принадлежность.`,
    requirements: [
      'Администратору доступны все заявки',
      'Пользователю доступны только свои',
      'Отсутствие пользователя даёт 401',
      'Отсутствие заявки даёт 404',
      'Чужая заявка даёт 403',
    ],
    starterCode: `function canAccessOrder(user, order) {
  // ваш код
}

function guardOrder(user, order) {
  // верните null или объект { status, body }
}`,
    tests: [
      {
        id: 't1',
        name: 'Своя заявка доступна',
        type: 'call',
        entry: 'canAccessOrder',
        args: [{ id: 7, role: 'user' }, { id: 1, user_id: 7 }],
        expected: true,
        points: 3,
      },
      {
        id: 't2',
        name: 'Чужая заявка недоступна',
        type: 'call',
        entry: 'canAccessOrder',
        args: [{ id: 8, role: 'user' }, { id: 1, user_id: 7 }],
        expected: false,
        points: 3,
      },
      {
        id: 't3',
        name: 'Администратору доступно всё',
        type: 'call',
        entry: 'canAccessOrder',
        args: [{ id: 9, role: 'admin' }, { id: 1, user_id: 7 }],
        expected: true,
        points: 3,
      },
      {
        id: 't4',
        name: 'Без пользователя доступа нет',
        type: 'call',
        entry: 'canAccessOrder',
        args: [null, { id: 1, user_id: 7 }],
        expected: false,
        points: 2,
      },
      {
        id: 't5',
        name: 'guardOrder: нет входа — 401',
        type: 'assert',
        code: `const res = ctx.get('guardOrder')(null, { id: 1, user_id: 7 });
ctx.assert(res && res.status === 401, 'Без пользователя нужен статус 401', 401, res && res.status);`,
        points: 4,
      },
      {
        id: 't6',
        name: 'guardOrder: нет заявки — 404',
        type: 'assert',
        code: `const res = ctx.get('guardOrder')({ id: 7, role: 'user' }, null);
ctx.assert(res && res.status === 404, 'Несуществующая заявка — статус 404', 404, res && res.status);`,
        points: 4,
      },
      {
        id: 't7',
        name: 'guardOrder: чужая заявка — 403',
        type: 'assert',
        code: `const res = ctx.get('guardOrder')({ id: 8, role: 'user' }, { id: 1, user_id: 7 });
ctx.assert(res && res.status === 403, 'Чужая заявка — статус 403', 403, res && res.status);`,
        points: 4,
      },
      {
        id: 't8',
        name: 'guardOrder: всё в порядке — null',
        type: 'assert',
        code: `const own = ctx.get('guardOrder')({ id: 7, role: 'user' }, { id: 1, user_id: 7 });
ctx.assert(own === null, 'Для своей заявки guardOrder должен вернуть null', null, own);
const admin = ctx.get('guardOrder')({ id: 9, role: 'admin' }, { id: 1, user_id: 7 });
ctx.assert(admin === null, 'Для администратора guardOrder тоже возвращает null', null, admin);`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'canAccessOrder — одно выражение: администратор ИЛИ совпадение идентификаторов. guardOrder — три ранних return.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Сравнивайте через `===`. Если `user.id` число, а `order.user_id` строка, нестрогое сравнение это скроет — и ошибка всплывёт там, где типы разойдутся.',
        penaltyPercent: 25,
      },
      {
        level: 3,
        text: 'Порядок в guardOrder неслучаен: сначала 401 (кто вы?), потом 404 (а есть ли запись?), и только потом 403 (можно ли вам?). Иначе по коду ответа можно узнать, существует ли чужая заявка.',
        penaltyPercent: 40,
      },
    ],
    solution: `function canAccessOrder(user, order) {
  if (!user || !order) return false;
  if (user.role === 'admin') return true;
  return order.user_id === user.id;
}

function guardOrder(user, order) {
  if (!user) {
    return { status: 401, body: { message: 'Требуется вход' } };
  }
  if (!order) {
    return { status: 404, body: { message: 'Заявка не найдена' } };
  }
  if (!canAccessOrder(user, order)) {
    return { status: 403, body: { message: 'Доступ запрещён' } };
  }
  return null;
}`,
    solutionExplanation: `Две функции вместо одной — не усложнение, а разделение ответственности: \`canAccessOrder\` отвечает на вопрос «можно?», \`guardOrder\` превращает ответ в HTTP-код.

**Почему нужна отдельная проверка принадлежности.** Middleware разобрал токен и положил пользователя в \`req.user\` — значит, вход выполнен. Но маршрут \`/api/orders/:id\` принимает любой идентификатор. Без проверки достаточно поменять число в адресе, чтобы прочитать чужую заявку с телефоном и адресом электронной почты. Это одна из самых частых дыр в учебных проектах, и её находят за минуту.

**Строгое сравнение.** \`order.user_id === user.id\` требует совпадения и значения, и типа. Если из базы приходит число, а в токене лежит строка, нестрогое \`==\` пропустит — и всё будет работать ровно до момента, когда типы разойдутся в другую сторону.

**Порядок кодов ответа.** Разница между 403 и 404 здесь тонкая, но осмысленная: 404 для несуществующей записи, 403 для существующей чужой. Строго говоря, в системах с высокими требованиями к приватности на чужую запись тоже отвечают 404 — чтобы по коду ответа нельзя было узнать, существует ли заявка с таким номером. Для учебного проекта достаточно текущего варианта, но знать об этом различии полезно.

**Администратор проверяется по роли из токена.** Не по логину и не по значению из localStorage: и то, и другое подделывается за секунду через DevTools.`,
    maxScore: 28,
    estimatedMinutes: 25,
    examRefs: ['m3-quality', 'm1-admin'],
    planDays: ['day-21-4'],
    source: 'plan',
  },

  {
    id: 'task-q-api-client',
    title: 'Убрать дублирование: один модуль запросов',
    kind: 'fix-bug',
    runtime: 'js',
    difficulty: 3,
    tech: ['js', 'react'],
    topicIds: ['code-quality', 'react-structure'],
    monthNo: 6,
    weekNo: 22,
    statement: `В проекте семь функций запросов, и в каждой повторяются одни и те же шесть строк: подставить адрес, добавить заголовки, подставить токен, разобрать ответ, проверить код, бросить ошибку.

Соберите общую обёртку.

\`\`\`js
createApi(deps)
\`\`\`

\`deps\` содержит:

- \`fetch(url, options)\` — функция запроса (в тестах подменяется);
- \`getToken()\` — возвращает токен или \`null\`;
- \`baseUrl\` — например, \`'/api'\`.

Возвращает объект с методом \`request(path, options)\` и сокращениями \`get(path)\`, \`post(path, body)\`, \`patch(path, body)\`.

Правила \`request\`:

1. Адрес — \`baseUrl + path\`.
2. Если есть тело — заголовок \`Content-Type: application/json\` и \`JSON.stringify\`.
3. Если \`getToken()\` вернул токен — заголовок \`Authorization: Bearer <токен>\`.
4. Если \`response.ok\` — вернуть разобранное тело.
5. Иначе — бросить \`Error\`, у которого есть поля \`status\` и \`body\`.`,
    requirements: [
      'Адрес собирается из baseUrl и пути',
      'Токен подставляется в заголовок Authorization',
      'Без токена заголовка Authorization нет',
      'POST отправляет JSON с правильным заголовком',
      'Ошибочный ответ бросает Error со status и body',
    ],
    starterCode: `function createApi(deps) {
  // верните { request, get, post, patch }
}`,
    tests: [
      {
        id: 't1',
        name: 'GET собирает адрес и возвращает тело',
        type: 'assert',
        code: `let receivedUrl = null;
const api = ctx.get('createApi')({
  baseUrl: '/api',
  getToken: () => null,
  fetch: async (url) => { receivedUrl = url; return { ok: true, status: 200, json: async () => ({ items: [1, 2] }) }; },
});
return api.get('/orders').then((data) => {
  ctx.assert(receivedUrl === '/api/orders', 'Адрес должен собираться из baseUrl и пути', '/api/orders', receivedUrl);
  ctx.assert(data.items.length === 2, 'Должно вернуться разобранное тело ответа');
});`,
        points: 5,
      },
      {
        id: 't2',
        name: 'Токен уходит в заголовке',
        type: 'assert',
        code: `let options = null;
const api = ctx.get('createApi')({
  baseUrl: '/api',
  getToken: () => 'abc.def.ghi',
  fetch: async (url, opts) => { options = opts; return { ok: true, status: 200, json: async () => ({}) }; },
});
return api.get('/orders').then(() => {
  const headers = (options && options.headers) || {};
  ctx.assert(headers.Authorization === 'Bearer abc.def.ghi', 'Нужен заголовок Authorization: Bearer <токен>', 'Bearer abc.def.ghi', headers.Authorization);
});`,
        points: 5,
      },
      {
        id: 't3',
        name: 'Без токена заголовка нет',
        type: 'assert',
        code: `let options = null;
const api = ctx.get('createApi')({
  baseUrl: '/api',
  getToken: () => null,
  fetch: async (url, opts) => { options = opts; return { ok: true, status: 200, json: async () => ({}) }; },
});
return api.get('/rooms').then(() => {
  const headers = (options && options.headers) || {};
  ctx.assert(!headers.Authorization, 'Без токена заголовок Authorization добавлять не нужно');
});`,
        points: 4,
      },
      {
        id: 't4',
        name: 'POST отправляет JSON',
        type: 'assert',
        code: `let options = null;
const api = ctx.get('createApi')({
  baseUrl: '/api',
  getToken: () => null,
  fetch: async (url, opts) => { options = opts; return { ok: true, status: 201, json: async () => ({ id: 1 }) }; },
});
return api.post('/orders', { roomId: 2 }).then(() => {
  ctx.assert(options.method === 'POST', 'Метод должен быть POST', 'POST', options.method);
  ctx.assert(options.headers['Content-Type'] === 'application/json', 'Нужен заголовок Content-Type: application/json');
  ctx.assert(options.body === JSON.stringify({ roomId: 2 }), 'Тело должно быть строкой JSON', JSON.stringify({ roomId: 2 }), options.body);
});`,
        points: 6,
      },
      {
        id: 't5',
        name: 'Ошибочный ответ бросает Error',
        type: 'assert',
        code: `const api = ctx.get('createApi')({
  baseUrl: '/api',
  getToken: () => null,
  fetch: async () => ({ ok: false, status: 409, json: async () => ({ errors: { login: 'Логин занят' } }) }),
});
return api.post('/auth/register', { login: 'ivanov26' }).then(
  () => { throw new Error('Ожидалась ошибка, но запрос завершился успешно'); },
  (error) => {
    ctx.assert(error instanceof Error, 'Должен быть выброшен Error');
    ctx.assert(error.status === 409, 'У ошибки должно быть поле status', 409, error.status);
    ctx.assert(error.body && error.body.errors && error.body.errors.login, 'У ошибки должно быть поле body с телом ответа');
  },
);`,
        points: 6,
      },
      {
        id: 't6',
        name: 'PATCH работает так же',
        type: 'assert',
        code: `let options = null;
const api = ctx.get('createApi')({
  baseUrl: '/api',
  getToken: () => 'token',
  fetch: async (url, opts) => { options = opts; return { ok: true, status: 200, json: async () => ({}) }; },
});
return api.patch('/admin/orders/7', { status: 'Мероприятие назначено' }).then(() => {
  ctx.assert(options.method === 'PATCH', 'Метод должен быть PATCH', 'PATCH', options.method);
  ctx.assert(options.headers.Authorization === 'Bearer token', 'Токен нужен и здесь');
});`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Вся логика живёт в одной функции `request`. Методы `get`, `post` и `patch` — трёхстрочные обёртки над ней.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Заголовки собирайте в объект по шагам: сначала пустой, потом Content-Type при наличии тела, потом Authorization при наличии токена. Так лишних заголовков не появится.',
        penaltyPercent: 25,
      },
      {
        level: 3,
        text: 'Чтобы передать код ответа наверх, создайте ошибку и допишите поля: `const error = new Error(...); error.status = response.status; error.body = data; throw error;`.',
        penaltyPercent: 40,
      },
    ],
    solution: `function createApi(deps) {
  async function request(path, options = {}) {
    const headers = {};
    const token = deps.getToken();

    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }
    if (token) {
      headers.Authorization = 'Bearer ' + token;
    }

    const response = await deps.fetch(deps.baseUrl + path, {
      method: options.method || 'GET',
      headers,
      ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error((data && data.message) || 'Ошибка запроса');
      error.status = response.status;
      error.body = data;
      throw error;
    }

    return data;
  }

  return {
    request,
    get: (path) => request(path),
    post: (path, body) => request(path, { method: 'POST', body }),
    patch: (path, body) => request(path, { method: 'PATCH', body }),
  };
}`,
    solutionExplanation: `Это самая выгодная по соотношению «усилия — оценка» правка в модуле 3.

**Почему дублирование опаснее, чем кажется.** Семь копий шести строк — это не просто некрасиво. Когда сервер начнёт возвращать ошибки в другом формате, править придётся семь мест, и одно обязательно забудется. Хуже того: забытым обычно оказывается редкий запрос, и ошибка вылезет на защите.

**Заголовки собираются по шагам.** Соблазн написать их одним литералом велик:
\`{ 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }\`. Но тогда у GET-запроса появится Content-Type без тела, а у неавторизованного запроса — \`Authorization: Bearer null\`. Второе особенно неприятно: сервер попытается разобрать строку «null» как токен и вернёт 401 там, где маршрут вообще не требовал входа.

**Ошибка несёт код ответа.** \`fetch\` не бросает исключение на 4xx и 5xx — промис выполняется успешно, просто \`response.ok\` равно \`false\`. Проверять это в каждом компоненте утомительно, поэтому обёртка превращает неуспешный ответ в исключение. Дописанные поля \`status\` и \`body\` позволяют компоненту различить случаи: при 401 отправить на страницу входа, при 409 показать ошибку у поля логина.

**Про \`deps\`.** Передача \`fetch\` и \`getToken\` снаружи выглядит избыточно — в реальном коде обычно берут глобальный \`fetch\` и \`localStorage\`. Но именно благодаря этому функцию можно проверить автотестами, не поднимая сервер. В проекте экзамена достаточно значений по умолчанию.`,
    maxScore: 30,
    estimatedMinutes: 35,
    examRefs: ['m3-quality'],
    planDays: ['day-22-2'],
    source: 'plan',
  },

  {
    id: 'task-ui-four-states',
    title: 'Четыре состояния страницы с данными',
    kind: 'app',
    runtime: 'react',
    difficulty: 3,
    tech: ['react', 'design'],
    topicIds: ['ui-states', 'react-effects'],
    monthNo: 6,
    weekNo: 22,
    statement: `Компонент \`OrdersPage\` принимает проп \`load: () => Promise<Order[]>\` и обрабатывает все четыре состояния.

| Состояние | Что показать |
|---|---|
| Загрузка | \`[data-testid="loading"]\` |
| Ошибка | \`[data-testid="error"]\` с понятным текстом и кнопкой \`[data-testid="retry"]\` |
| Пусто | \`[data-testid="empty"]\` |
| Данные | список элементов \`[data-testid="row"]\` |

Дополнительно: текст ошибки должен быть человеческим, а не техническим. Проверка в тесте простая — в блоке ошибки не должно быть строк вида \`Failed to fetch\`, \`TypeError\` или \`undefined\`.

Кнопка «Повторить» запускает загрузку заново.`,
    requirements: [
      'Показывается состояние загрузки',
      'Ошибка не оставляет пустой экран',
      'В тексте ошибки нет технических подробностей',
      'Кнопка «Повторить» повторяет запрос',
      'Пустой список показывает своё состояние',
    ],
    starterCode: `function OrdersPage({ load }) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Состояние загрузки',
        type: 'react',
        code: `let release;
const pending = new Promise((resolve) => { release = resolve; });
return ctx.render('OrdersPage', { load: () => pending }).then(() => {
  ctx.assert(ctx.$('[data-testid="loading"]'), 'Пока данные грузятся, нужен [data-testid="loading"]');
  release([]);
});`,
        points: 4,
      },
      {
        id: 't2',
        name: 'Пустой список',
        type: 'react',
        code: `return ctx.render('OrdersPage', { load: () => Promise.resolve([]) })
  .then(() => ctx.wait(30))
  .then(() => {
    ctx.assert(ctx.$('[data-testid="empty"]'), 'Нужен [data-testid="empty"] для пустого списка');
    ctx.assert(!ctx.$('[data-testid="loading"]'), 'Спиннер должен исчезнуть');
    ctx.assert(!ctx.$('[data-testid="error"]'), 'Пустой список — не ошибка');
  });`,
        points: 4,
      },
      {
        id: 't3',
        name: 'Ошибка с понятным текстом',
        type: 'react',
        code: `return ctx.render('OrdersPage', { load: () => Promise.reject(new TypeError('Failed to fetch')) })
  .then(() => ctx.wait(30))
  .then(() => {
    const box = ctx.$('[data-testid="error"]');
    ctx.assert(box, 'При ошибке нужен [data-testid="error"]');
    const text = box.textContent || '';
    ctx.assert(text.trim().length > 0, 'Блок ошибки не должен быть пустым');
    ['Failed to fetch', 'TypeError', 'undefined'].forEach((bad) => {
      ctx.assert(!text.includes(bad), 'В тексте для пользователя не должно быть технических подробностей: ' + bad);
    });
  });`,
        points: 6,
      },
      {
        id: 't4',
        name: 'Кнопка «Повторить»',
        type: 'react',
        code: `let calls = 0;
const load = () => {
  calls += 1;
  return calls === 1
    ? Promise.reject(new Error('нет связи'))
    : Promise.resolve([{ id: 1 }, { id: 2 }]);
};
return ctx.render('OrdersPage', { load })
  .then(() => ctx.wait(30))
  .then(() => ctx.click('[data-testid="retry"]'))
  .then(() => ctx.wait(30))
  .then(() => {
    ctx.assert(calls === 2, 'Повтор должен запустить загрузку второй раз', 2, calls);
    ctx.assert(ctx.$$('[data-testid="row"]').length === 2, 'После успешного повтора должен показаться список');
    ctx.assert(!ctx.$('[data-testid="error"]'), 'Блок ошибки должен исчезнуть после успешной загрузки');
  });`,
        points: 6,
      },
      {
        id: 't5',
        name: 'Список данных',
        type: 'react',
        code: `return ctx.render('OrdersPage', { load: () => Promise.resolve([{ id: 1 }, { id: 2 }, { id: 3 }]) })
  .then(() => ctx.wait(30))
  .then(() => {
    ctx.assert(ctx.$$('[data-testid="row"]').length === 3, 'Должны отрисоваться три строки', 3, ctx.$$('[data-testid="row"]').length);
    ctx.assert(!ctx.$('[data-testid="empty"]'), 'Пустое состояние показывать не нужно');
  });`,
        points: 4,
      },
      {
        id: 't6',
        name: 'Ровно один запрос при открытии',
        type: 'react',
        code: `let calls = 0;
const load = () => { calls += 1; return Promise.resolve([]); };
return ctx.render('OrdersPage', { load })
  .then(() => ctx.wait(60))
  .then(() => {
    ctx.assert(calls <= 2, 'Загрузка не должна повторяться бесконечно — проверьте массив зависимостей useEffect', '1', calls);
    ctx.assert(calls >= 1, 'Данные должны загружаться при открытии страницы');
  });`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Три состояния и четыре ранних return. Функцию загрузки вынесите отдельно — её вызывает и эффект, и кнопка повтора.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Флаг загрузки снимайте в `finally`, а не только после успеха. Иначе при ошибке спиннер останется висеть поверх блока ошибки.',
        penaltyPercent: 25,
      },
      {
        level: 3,
        text: 'Перед повторной загрузкой сбрасывайте ошибку: `setError(null)`. Иначе после успешного повтора блок ошибки останется на экране рядом со списком.',
        penaltyPercent: 40,
      },
    ],
    solution: `function OrdersPage({ load }) {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchOrders = React.useCallback(() => {
    setLoading(true);
    setError(null);
    return load()
      .then((data) => setOrders(data))
      .catch(() => setError('Не удалось загрузить заявки. Проверьте соединение и попробуйте ещё раз.'))
      .finally(() => setLoading(false));
  }, [load]);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return <p data-testid="loading">Загружаем заявки…</p>;
  }

  if (error) {
    return (
      <div data-testid="error">
        <p>{error}</p>
        <button data-testid="retry" type="button" onClick={fetchOrders}>
          Повторить
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div data-testid="empty">
        <p>Заявок пока нет.</p>
        <a href="/orders/new">Создать первую заявку</a>
      </div>
    );
  }

  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id} data-testid="row">
          Заявка № {order.id}
        </li>
      ))}
    </ul>
  );
}`,
    solutionExplanation: `Четыре состояния — это не педантизм, а разница между «приложение работает» и «приложение непонятно себя ведёт».

**Проверить легко.** Остановите сервер и откройте страницу. Если вы видите вечный спиннер или белый экран — состояние ошибки не проработано. Это первое, что замечает проверяющий, и первое, что ломается на защите, когда сеть подводит.

**Технические тексты пользователю не нужны.** «Failed to fetch» — сообщение для разработчика. Пользователю нужно знать две вещи: что пошло не так на его языке и что теперь делать. Отсюда и кнопка «Повторить»: ошибка сети обычно временная, и перезагружать всю страницу ради неё не нужно.

**\`finally\` обязателен.** Если снимать флаг загрузки только в \`then\`, при ошибке он останется поднятым — и первый \`if\` навсегда вернёт спиннер. Блок ошибки при этом будет отрисован в состоянии, до которого выполнение не дойдёт: отладка такого занимает неприятно много времени.

**Сброс ошибки перед повтором.** Без \`setError(null)\` в начале загрузки успешный повтор оставит блок ошибки на экране: список появится, но над ним будет висеть красное сообщение.

**Про \`useCallback\`.** Он нужен, чтобы функция не пересоздавалась на каждой отрисовке. Без него зависимость эффекта менялась бы постоянно, и загрузка зациклилась бы — это ровно тот бесконечный поток запросов во вкладке Network, который обычно списывают на «что-то сломалось».

**Пустое состояние подсказывает следующий шаг.** Не просто «Ничего не найдено», а ссылка на создание заявки. Это то, что отличает продуманный интерфейс от формально работающего.`,
    maxScore: 28,
    estimatedMinutes: 35,
    examRefs: ['m2-cabinet-ux', 'm3-quality'],
    planDays: ['day-22-4'],
    source: 'plan',
  },
];
