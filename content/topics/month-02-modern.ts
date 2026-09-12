import type { Topic } from '../types';

/**
 * Месяц 2, недели 7–8: современный JavaScript, TypeScript и Bootstrap.
 * Программа называет неделю 7 «фундаментом для React».
 */
export const MONTH_02_MODERN_TOPICS: Topic[] = [
  {
    id: 'js-destructuring',
    title: 'Деструктуризация, spread и rest',
    tech: ['js'],
    monthNo: 2,
    weekNo: 7,
    importance: 'core',
    summary:
      'Эти три приёма встречаются в каждой строке React-кода: достать поля из объекта, скопировать объект с изменением, собрать остаток аргументов.',
    mustKnow: [
      'Деструктуризация объекта и массива',
      'Значения по умолчанию и переименование',
      'Spread `...` для копирования и слияния',
      'Rest в параметрах функции',
      'Опциональная цепочка `?.` и `??`',
    ],
    theory: `## Достать поля

\`\`\`js
const application = { id: 1, room: 'Коворкинг', status: 'Новая' };

const { room, status } = application;
const { room: roomName } = application;        // переименование
const { payment = 'Наличные' } = application;  // значение по умолчанию
\`\`\`

Массивы разбираются по позициям:

\`\`\`js
const [day, month, year] = '14.09.2026'.split('.');
\`\`\`

Это самый удобный способ разобрать дату из формата ДД.ММ.ГГГГ — он понадобится на экзамене.

## Деструктуризация в параметрах

\`\`\`js
function ApplicationCard({ room, date, status }) {
  return \`\${room} · \${date} · \${status}\`;
}
\`\`\`

Именно так пишут компоненты React: props разбираются прямо в списке параметров.

## Spread — копия с изменением

\`\`\`js
const updated = { ...application, status: 'Мероприятие назначено' };
const merged = { ...defaults, ...userSettings };  // правое перебивает левое
const copy = [...applications];
const combined = [...first, ...second];
\`\`\`

Копия поверхностная: вложенные объекты остаются общими. Для глубокой копии есть \`structuredClone\`.

Именно через spread в React меняют состояние: создаётся новый объект, а не правится старый.

## Rest — собрать остаток

\`\`\`js
function log(first, ...rest) {
  console.log(first, rest);   // rest — обычный массив
}

const { id, ...withoutId } = application;   // убрать поле
\`\`\`

Приём «убрать поле» пригодится, чтобы не отправлять на сервер лишнее — например, хеш пароля обратно клиенту.

## ?. и ??

\`\`\`js
const city = user?.address?.city;        // не упадёт, если address нет
const name = user.name ?? 'Без имени';   // подставит, только если null/undefined
\`\`\`

\`?.\` избавляет от лесенки проверок, \`??\` — от ошибок с нулём и пустой строкой (в отличие от \`||\`).`,
    examples: [
      {
        title: 'Типичные операции проекта',
        language: 'javascript',
        code: `const applications = [
  { id: 1, room: 'Коворкинг', date: '2026-09-14', status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '2026-09-21', status: 'Новая' },
];

// достать поля
const [{ room, status }] = applications;
console.log(room, status);

// сменить статус одной заявки, не трогая массив
const updated = applications.map((item) =>
  item.id === 1 ? { ...item, status: 'Мероприятие назначено' } : item,
);

// убрать служебное поле перед отправкой
const { id, ...payload } = updated[0];
console.log(payload);

// разобрать дату ДД.ММ.ГГГГ
const [day, month, year] = '14.09.2026'.split('.');
console.log(\`\${year}-\${month}-\${day}\`);  // формат для базы данных`,
      },
    ],
    mistakes: [
      {
        title: 'Считать spread глубокой копией',
        wrong: 'const copy = { ...order }; copy.room.title = "x";',
        right: 'const copy = structuredClone(order);',
        why: 'Spread копирует только верхний уровень: вложенный объект останется общим, и изменение затронет оригинал.',
      },
      {
        title: '|| вместо ??',
        wrong: 'const page = query.page || 1;',
        right: 'const page = query.page ?? 1;',
        why: 'При page = 0 первый вариант подставит 1. Для пагинации это реальная ошибка.',
      },
    ],
    quizId: 'quiz-js-destructuring',
    taskIds: ['task-js-destructuring'],
    resources: [
      { title: 'learn.javascript.ru — деструктуризация', url: 'https://learn.javascript.ru/destructuring-assignment', kind: 'tutorial', source: 'plan' },
    ],
    examRefs: ['m2-order-form'],
    prerequisites: ['js-objects'],
    estimatedMinutes: 45,
    planDays: ['day-07-1'],
    source: 'plan',
  },

  {
    id: 'js-array-methods',
    title: 'Методы массива глубже: sort, slice, reduce',
    tech: ['js'],
    monthNo: 2,
    weekNo: 7,
    importance: 'core',
    summary:
      'Фильтр, сортировка и постраничная навигация в админке — это три метода массива подряд. Программа прямо называет этот день «будущей админкой».',
    mustKnow: [
      '`sort` меняет исходный массив — копируйте перед сортировкой',
      'Компаратор для чисел, строк и дат',
      '`slice(start, end)` для страницы',
      '`reduce` для суммы и группировки',
      'Цепочка filter → sort → slice',
    ],
    theory: `## sort

\`\`\`js
[3, 12, 1].sort();                  // [1, 12, 3] — сравнение как строк!
[3, 12, 1].sort((a, b) => a - b);   // [1, 3, 12]
\`\`\`

Без компаратора \`sort\` сравнивает строковые представления, поэтому 12 оказывается раньше 3. Для чисел компаратор обязателен.

Строки сравнивают через \`localeCompare\` — он правильно работает с кириллицей:

\`\`\`js
rooms.sort((a, b) => a.localeCompare(b, 'ru'));
\`\`\`

Даты в формате \`ГГГГ-ММ-ДД\` можно сравнивать как строки; в формате ДД.ММ.ГГГГ — нельзя, сначала переведите.

**\`sort\` меняет исходный массив.** Всегда копируйте:

\`\`\`js
const sorted = [...applications].sort(compare);
\`\`\`

## Переключение направления

\`\`\`js
const direction = ascending ? 1 : -1;
const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date) * direction);
\`\`\`

Клик по заголовку столбца меняет \`ascending\` — готовая сортировка админки.

## slice — страница

\`\`\`js
const PER_PAGE = 5;
const page = 2;
const visible = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);
\`\`\`

\`slice\` не меняет исходный массив (в отличие от похожего по названию \`splice\`).

Число страниц: \`Math.ceil(items.length / PER_PAGE)\`.

## reduce

\`\`\`js
const total = prices.reduce((sum, price) => sum + price, 0);

// сколько заявок в каждом статусе
const byStatus = applications.reduce((acc, item) => {
  acc[item.status] = (acc[item.status] ?? 0) + 1;
  return acc;
}, {});
// { 'Новая': 2, 'Мероприятие завершено': 1 }
\`\`\`

Второй аргумент — начальное значение; забыть его — частая ошибка.

## Полная логика админки

\`\`\`js
function getPage(applications, { status, ascending, page, perPage = 5 }) {
  const filtered = status ? applications.filter((a) => a.status === status) : applications;
  const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date) * (ascending ? 1 : -1));
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const safePage = Math.min(page, totalPages);
  return {
    items: sorted.slice((safePage - 1) * perPage, safePage * perPage),
    totalPages,
    page: safePage,
  };
}
\`\`\`

Здесь же решена частая проблема: при смене фильтра страница может оказаться за пределами списка — \`safePage\` возвращает на последнюю доступную.`,
    examples: [
      {
        title: 'Фильтр, сортировка и страница',
        language: 'javascript',
        code: `const applications = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  room: ['Аудитория', 'Коворкинг', 'Кинозал'][i % 3],
  date: \`2026-09-\${String((i % 28) + 1).padStart(2, '0')}\`,
  status: i % 2 === 0 ? 'Новая' : 'Мероприятие завершено',
}));

function getPage(items, { status, ascending = true, page = 1, perPage = 5 }) {
  const filtered = status ? items.filter((a) => a.status === status) : items;
  const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date) * (ascending ? 1 : -1));
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const safePage = Math.min(page, totalPages);
  return { items: sorted.slice((safePage - 1) * perPage, safePage * perPage), totalPages, page: safePage };
}

const result = getPage(applications, { status: 'Новая', page: 2 });
console.log('Страниц:', result.totalPages);
console.table(result.items);`,
      },
    ],
    mistakes: [
      {
        title: 'sort без компаратора для чисел',
        wrong: '[3, 12, 1].sort()',
        right: '[3, 12, 1].sort((a, b) => a - b)',
        why: 'По умолчанию сравниваются строки, и 12 окажется меньше 3.',
      },
      {
        title: 'reduce без начального значения',
        wrong: 'arr.reduce((sum, x) => sum + x)',
        right: 'arr.reduce((sum, x) => sum + x, 0)',
        why: 'На пустом массиве без начального значения reduce выбрасывает ошибку.',
      },
      {
        title: 'Не сбрасывать страницу при смене фильтра',
        why: 'Пользователь был на третьей странице, выбрал фильтр — и видит пустоту. Возвращайте на первую страницу или ограничивайте номер.',
      },
    ],
    quizId: 'quiz-js-array-methods',
    taskIds: ['task-js-admin-table', 'task-dom-admin-table'],
    resources: [
      { title: 'learn.javascript.ru — методы массивов', url: 'https://learn.javascript.ru/array-methods', kind: 'tutorial', source: 'plan' },
    ],
    examRefs: ['m2-admin-tools'],
    prerequisites: ['js-arrays', 'js-destructuring'],
    estimatedMinutes: 50,
    planDays: ['day-07-2'],
    source: 'plan',
  },

  {
    id: 'js-modules',
    title: 'Модули и Node.js: import, export, npm',
    tech: ['js', 'node', 'tools'],
    monthNo: 2,
    weekNo: 7,
    importance: 'core',
    summary:
      'Модули разносят код по файлам, а npm управляет пакетами. На экзамене без интернета особенно важно понимать, откуда берутся зависимости.',
    mustKnow: [
      '`export` и `export default`, `import`',
      'Запуск файла: `node file.js`',
      '`npm init -y`, `package.json`, поле `"type": "module"`',
      'Скрипты npm и `npm run`',
      '`npm install --offline` и кеш пакетов',
    ],
    theory: `## Экспорт и импорт

\`\`\`js
// validation.js
export const LOGIN_PATTERN = /^[A-Za-z0-9]{6,}$/;
export function checkLogin(login) { return LOGIN_PATTERN.test(login); }

// main.js
import { checkLogin, LOGIN_PATTERN } from './validation.js';
\`\`\`

Именованных экспортов может быть много. Экспорт по умолчанию — один на файл:

\`\`\`js
export default class ApiClient { /* … */ }
import ApiClient from './api-client.js';
\`\`\`

В браузере модули подключаются так: \`<script type="module" src="main.js"></script>\` — атрибут \`defer\` уже не нужен, модули откладываются сами.

## Node.js

\`\`\`bash
node index.js        # запустить файл
npm init -y          # создать package.json
npm install express  # установить пакет
npm run dev          # запустить скрипт из package.json
\`\`\`

В \`package.json\` есть поле \`"type"\`. Если поставить \`"type": "module"\`, в Node будет работать синтаксис \`import\`/\`export\`; без него — старый \`require\`. Учебная программа советует бэкенд на обычном JavaScript — тогда просто добавьте это поле и пишите как на фронтенде.

\`\`\`json
{
  "type": "module",
  "scripts": {
    "dev": "node --watch index.js",
    "start": "node index.js"
  }
}
\`\`\`

## Пакеты без интернета — ключевой вопрос экзамена

\`npm install\` по умолчанию качает пакеты из сети, а на экзамене её не будет. Учебная программа выносит это в отдельный раздел и советует выяснить у преподавателя заранее.

Что можно сделать самому:

1. Один раз установить нужные пакеты дома — они останутся в кеше npm.
2. Проверить установку из кеша: \`npm install --offline\` (или \`--prefer-offline\`).
3. Если офлайн-установка не работает, заранее подготовить папку-шаблон проекта вместе с \`node_modules\` и копировать её.

Список пакетов для проекта экзамена: \`react-router-dom\`, \`bootstrap\`, \`express\`, \`cors\`, \`mysql2\`, \`bcryptjs\`, \`jsonwebtoken\`.

## .gitignore

\`node_modules\` в репозиторий не коммитят: это десятки тысяч файлов. Строка \`node_modules/\` в \`.gitignore\` пишется до первого коммита.`,
    examples: [
      {
        title: 'Разделение кода на модули',
        language: 'javascript',
        code: `// ── validation.js ────────────────────────────
export const LOGIN_PATTERN = /^[A-Za-z0-9]{6,}$/;

export function validateRegister(values) {
  const errors = {};
  if (!LOGIN_PATTERN.test(values.login ?? '')) errors.login = 'Некорректный логин';
  if ((values.password ?? '').length < 8) errors.password = 'Минимум 8 символов';
  return errors;
}

// ── applications.js ──────────────────────────
export function getPage(items, { page = 1, perPage = 5 } = {}) {
  return items.slice((page - 1) * perPage, page * perPage);
}

// ── main.js ──────────────────────────────────
import { validateRegister } from './validation.js';
import { getPage } from './applications.js';

console.log(validateRegister({ login: 'ivan', password: '123' }));`,
        explanation:
          'Тот же приём используется в проекте экзамена: папка api/ для запросов, отдельные файлы для валидации и вспомогательных функций. Это прямо влияет на оценку качества кода.',
      },
    ],
    mistakes: [
      {
        title: 'Забыть расширение .js в импорте',
        wrong: "import { checkLogin } from './validation';",
        right: "import { checkLogin } from './validation.js';",
        why: 'В браузере и в Node с ESM расширение обязательно. Сборщики вроде Vite его дописывают, поэтому ошибка всплывает именно на сервере.',
      },
      {
        title: 'Коммитить node_modules',
        why: 'Репозиторий раздувается, коммит идёт минуту, история нечитаема. Добавьте node_modules/ в .gitignore до первого коммита.',
      },
      {
        title: 'Впервые проверить офлайн-установку на экзамене',
        why: 'Программа советует проверить npm install --offline заранее — если он не работает, нужен запасной план.',
      },
    ],
    quizId: 'quiz-js-modules',
    taskIds: [],
    resources: [
      { title: 'learn.javascript.ru — модули', url: 'https://learn.javascript.ru/modules-intro', kind: 'tutorial', source: 'plan' },
      { title: 'Документация npm', url: 'https://docs.npmjs.com/cli/v10/commands/npm-install', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m3-quality'],
    prerequisites: ['js-functions'],
    estimatedMinutes: 45,
    planDays: ['day-07-3'],
    source: 'plan',
  },

  {
    id: 'js-async',
    title: 'Асинхронность: Promise, async/await, try/catch',
    tech: ['js'],
    monthNo: 2,
    weekNo: 7,
    importance: 'core',
    summary:
      'Запрос к серверу не выполняется мгновенно. Асинхронный код позволяет дождаться ответа, не блокируя интерфейс, и обработать ошибку.',
    mustKnow: [
      'Зачем нужна асинхронность',
      '`Promise` и его состояния',
      '`async` / `await`',
      '`try` / `catch` / `finally`',
      '`Promise.all` для параллельных запросов',
    ],
    theory: `## Зачем

JavaScript выполняет код в одном потоке. Если ждать ответ сервера «в лоб», страница замрёт: не будет реагировать ни одна кнопка. Поэтому долгие операции возвращают **обещание** результата.

## Promise

\`\`\`js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

delay(1000).then(() => console.log('прошла секунда'));
\`\`\`

Обещание бывает в трёх состояниях: ожидание, выполнено (\`resolve\`), отклонено (\`reject\`).

## async / await

\`\`\`js
async function loadApplications() {
  const response = await fetch('/api/applications/my');
  const data = await response.json();
  return data;
}
\`\`\`

\`await\` ждёт результат и возвращает значение. Использовать его можно только внутри \`async\`-функции (или на верхнем уровне модуля).

**Важно:** \`async\`-функция всегда возвращает обещание. Поэтому её результат тоже нужно ждать:

\`\`\`js
const list = await loadApplications();
\`\`\`

## Обработка ошибок

\`\`\`js
async function loadApplications() {
  try {
    const response = await fetch('/api/applications/my');
    if (!response.ok) throw new Error('Сервер вернул ' + response.status);
    return await response.json();
  } catch (error) {
    console.error(error);
    showMessage('Не удалось загрузить заявки. Попробуйте ещё раз.');
    return [];
  } finally {
    hideLoader();
  }
}
\`\`\`

Три важные вещи:

1. **\`fetch\` не выбрасывает ошибку на коды 400 и 500** — проверяйте \`response.ok\` сами.
2. Пользователю показывают понятный текст, а не техническую ошибку (раздел 33 ТЗ и критерий качества кода).
3. \`finally\` выполняется всегда — там снимают индикатор загрузки.

## Параллельные запросы

\`\`\`js
const [rooms, payments] = await Promise.all([
  fetch('/api/rooms').then((r) => r.json()),
  fetch('/api/payments').then((r) => r.json()),
]);
\`\`\`

Два независимых запроса идут одновременно — страница заявки загрузится вдвое быстрее, чем при последовательном ожидании.

## Типичная ошибка: await в цикле

\`\`\`js
// медленно: запросы идут по очереди
for (const id of ids) {
  await loadOne(id);
}

// быстро: одновременно
await Promise.all(ids.map(loadOne));
\`\`\``,
    examples: [
      {
        title: 'Цепочка асинхронных шагов',
        language: 'javascript',
        code: `const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fakeLoad(name, ms) {
  await delay(ms);
  return name + ' готово';
}

async function run() {
  console.log('старт');

  // последовательно — когда шаги зависят друг от друга
  console.log(await fakeLoad('шаг 1', 100));
  console.log(await fakeLoad('шаг 2', 100));

  // параллельно — когда не зависят
  const both = await Promise.all([fakeLoad('справочники', 100), fakeLoad('заявки', 100)]);
  console.log(both);

  try {
    await Promise.reject(new Error('сервер недоступен'));
  } catch (error) {
    console.log('поймали ошибку:', error.message);
  } finally {
    console.log('finally выполняется всегда');
  }
}

run();`,
      },
    ],
    mistakes: [
      {
        title: 'Забыть await',
        wrong: 'const data = loadApplications(); // Promise, а не данные',
        right: 'const data = await loadApplications();',
        why: 'Без await вы получите объект Promise, и в шаблон попадёт [object Promise].',
      },
      {
        title: 'Считать, что fetch сам выбросит ошибку при 500',
        wrong: 'const data = await (await fetch(url)).json();',
        right: 'const res = await fetch(url);\nif (!res.ok) throw new Error(res.status);',
        why: 'fetch отклоняет обещание только при сетевом сбое. Коды 4xx и 5xx — это «успешный» ответ с плохим статусом.',
      },
      {
        title: 'Показывать пользователю текст технической ошибки',
        why: 'Сообщение вида «TypeError: Cannot read properties of undefined» ничего не даёт пользователю. Нужен понятный текст и кнопка «Повторить».',
      },
    ],
    quizId: 'quiz-js-async',
    taskIds: ['task-js-async'],
    resources: [
      { title: 'learn.javascript.ru — async/await', url: 'https://learn.javascript.ru/async-await', kind: 'tutorial', source: 'plan' },
    ],
    examRefs: ['m3-quality'],
    prerequisites: ['js-functions'],
    estimatedMinutes: 50,
    planDays: ['day-07-4'],
    source: 'plan',
  },

  {
    id: 'js-fetch',
    title: 'fetch: запросы к серверу и коды ответа',
    tech: ['js'],
    monthNo: 2,
    weekNo: 7,
    importance: 'core',
    summary:
      'fetch — способ обратиться к серверу из браузера. Через него идут регистрация, вход, список заявок и смена статуса.',
    mustKnow: [
      'GET-запрос и `response.json()`',
      'POST с методом, заголовками и телом',
      '`response.ok` и `response.status`',
      'Коды 200, 201, 400, 401, 403, 404, 409, 500',
      'Заголовок Authorization с токеном',
    ],
    theory: `## GET

\`\`\`js
const response = await fetch('/api/rooms');
if (!response.ok) throw new Error('Не удалось загрузить помещения');
const rooms = await response.json();
\`\`\`

## POST

\`\`\`js
const response = await fetch('/api/applications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ roomId: 2, date: '2026-09-14', paymentId: 1 }),
});
\`\`\`

Три обязательные части: метод, заголовок с типом содержимого и тело в виде строки JSON. Забытый заголовок — классическая причина, по которой сервер видит пустое тело.

## Коды ответа

| Код | Значение | Когда встретится на экзамене |
|---|---|---|
| 200 | Успех | Любой удачный GET |
| 201 | Создано | После регистрации или новой заявки |
| 400 | Неверный запрос | Не прошла валидация на сервере |
| 401 | Не авторизован | Нет токена или он просрочен |
| 403 | Запрещено | Не админ лезет в админку |
| 404 | Не найдено | Опечатка в адресе |
| 409 | Конфликт | Логин уже занят |
| 500 | Ошибка сервера | Упал запрос к базе |

Разные коды позволяют показать разные сообщения — это и есть «информативные уведомления» из задания.

## Токен

\`\`\`js
const token = localStorage.getItem('token');

const response = await fetch('/api/applications/my', {
  headers: { Authorization: \`Bearer \${token}\` },
});
\`\`\`

Формат \`Bearer <токен>\` — стандартный. Сервер достанет токен из заголовка и проверит подпись.

## Класс-обёртка (ООП из задания)

Задание модуля 1 требует использовать объектно-ориентированное программирование. Клиент API — самое естественное место для класса:

\`\`\`js
class ApiClient {
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  get token() {
    return localStorage.getItem('token');
  }

  async request(path, options = {}) {
    const response = await fetch(this.baseUrl + path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token ? { Authorization: \`Bearer \${this.token}\` } : {}),
        ...options.headers,
      },
    });

    if (response.status === 401) throw new Error('Требуется вход');
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error ?? 'Ошибка запроса');
    }
    return response.json();
  }

  get(path) { return this.request(path); }
  post(path, body) { return this.request(path, { method: 'POST', body: JSON.stringify(body) }); }
  patch(path, body) { return this.request(path, { method: 'PATCH', body: JSON.stringify(body) }); }
}
\`\`\`

Один класс закрывает сразу два требования: ООП и «все запросы собраны в одном месте».

## CORS и прокси

Если клиент на порту 5173, а сервер на 3000, браузер заблокирует запрос из-за политики разных источников. Два решения: прокси в настройках Vite (\`server.proxy\`) или пакет \`cors\` на сервере. Прокси проще — с ним адреса выглядят как \`/api/...\` и в разработке, и в сборке.`,
    examples: [
      {
        title: 'Регистрация с обработкой кодов',
        language: 'javascript',
        code: `async function register(values) {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (response.status === 409) {
    return { ok: false, errors: { login: 'Такой логин уже занят' } };
  }
  if (response.status === 400) {
    const data = await response.json();
    return { ok: false, errors: data.errors ?? { form: 'Проверьте заполнение полей' } };
  }
  if (!response.ok) {
    return { ok: false, errors: { form: 'Сервер недоступен. Попробуйте ещё раз.' } };
  }

  return { ok: true, user: await response.json() };
}`,
        explanation:
          'Каждому коду — своё сообщение. Ошибка «логин занят» показывается рядом с полем логина, как требует модуль 2.',
      },
    ],
    mistakes: [
      {
        title: 'POST без заголовка Content-Type',
        wrong: "fetch(url, { method: 'POST', body: JSON.stringify(data) })",
        right: "fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })",
        why: 'Без заголовка express.json() не разберёт тело, и req.body окажется пустым.',
      },
      {
        title: 'Отправить объект вместо строки',
        wrong: 'body: data',
        right: 'body: JSON.stringify(data)',
        why: 'Тело запроса — это строка. Объект превратится в "[object Object]".',
      },
      {
        title: 'Не проверять response.ok',
        why: 'Ошибка 500 придёт как обычный ответ, и код попытается разобрать её как данные.',
      },
    ],
    quizId: 'quiz-js-fetch',
    taskIds: ['task-js-api-client'],
    resources: [
      { title: 'learn.javascript.ru — Fetch', url: 'https://learn.javascript.ru/fetch', kind: 'tutorial', source: 'plan' },
      { title: 'MDN: коды состояния HTTP', url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Status', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m1-login', 'm1-register', 'm1-oop-styles'],
    prerequisites: ['js-async'],
    estimatedMinutes: 50,
    planDays: ['day-07-5'],
    source: 'plan',
  },

  {
    id: 'js-localstorage',
    title: 'localStorage: хранение токена',
    tech: ['js', 'security'],
    monthNo: 2,
    weekNo: 7,
    importance: 'core',
    summary:
      'localStorage хранит данные в браузере между перезагрузками. Там будет лежать токен входа — и там же нельзя хранить ничего секретного.',
    mustKnow: [
      '`setItem`, `getItem`, `removeItem`, `clear`',
      'Хранятся только строки — объекты через JSON',
      'Отличие от sessionStorage',
      'Что нельзя класть в localStorage',
      'Проверка на null при чтении',
    ],
    theory: `## Основные операции

\`\`\`js
localStorage.setItem('token', token);
const token = localStorage.getItem('token');   // строка или null
localStorage.removeItem('token');
localStorage.clear();
\`\`\`

Данные сохраняются после закрытия браузера и привязаны к конкретному сайту.

\`sessionStorage\` работает так же, но очищается при закрытии вкладки.

## Только строки

\`\`\`js
localStorage.setItem('user', JSON.stringify(user));

const raw = localStorage.getItem('user');
const user = raw ? JSON.parse(raw) : null;
\`\`\`

Читать нужно с проверкой: \`JSON.parse(null)\` вернёт \`null\`, а \`JSON.parse('undefined')\` выбросит ошибку. Надёжный вариант:

\`\`\`js
function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
\`\`\`

## Вход и выход

\`\`\`js
function login(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  location.href = '/login';
}
\`\`\`

Эта пара функций ляжет в \`AuthContext\` на неделе 11.

## Чего нельзя хранить

- **Пароль** — ни в каком виде.
- Персональные данные других пользователей.
- Любые данные, которым нельзя доверять после возвращения: перед использованием их нужно проверять.

Содержимое \`localStorage\` доступно любому скрипту на странице. Если на сайт попадёт чужой скрипт (XSS), он прочитает токен. Отсюда два правила: никогда не вставлять пользовательский текст через \`innerHTML\` и давать токену разумный срок жизни.

**Важно:** данные в \`localStorage\` — это не авторизация. Строка \`isAdmin: true\` в хранилище ничего не значит: права проверяет сервер по токену. Поле роли в localStorage годится только чтобы показать или спрятать пункт меню.

## Просмотр

DevTools → Application → Local Storage. Если «вход не запоминается», первым делом смотрят сюда.`,
    examples: [
      {
        title: 'Модуль хранения сессии',
        language: 'javascript',
        code: `const TOKEN_KEY = 'conference.token';
const USER_KEY = 'conference.user';

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function readSession() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    if (!token || !raw) return null;
    return { token, user: JSON.parse(raw) };
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}`,
        explanation:
          'Ключи с префиксом проекта не конфликтуют с другими приложениями на том же localhost — на экзамене на машине может быть несколько проектов.',
      },
    ],
    mistakes: [
      {
        title: 'JSON.parse без проверки',
        wrong: 'const user = JSON.parse(localStorage.getItem("user"));',
        right: 'const raw = localStorage.getItem("user");\nconst user = raw ? JSON.parse(raw) : null;',
        why: 'Если ключа нет или значение повреждено, приложение упадёт на старте.',
      },
      {
        title: 'Хранить пароль или права доступа',
        why: 'Всё, что лежит в localStorage, доступно скриптам страницы и легко правится вручную через DevTools. Права проверяет только сервер.',
      },
    ],
    quizId: 'quiz-js-localstorage',
    taskIds: [],
    resources: [
      { title: 'learn.javascript.ru — LocalStorage', url: 'https://learn.javascript.ru/localstorage', kind: 'tutorial', source: 'plan' },
    ],
    examRefs: ['m1-login', 'm3-quality'],
    prerequisites: ['js-objects'],
    estimatedMinutes: 35,
    planDays: ['day-07-6'],
    source: 'plan',
  },

  {
    id: 'js-dates',
    title: 'Даты и формат ДД.ММ.ГГГГ',
    tech: ['js'],
    monthNo: 2,
    weekNo: 7,
    importance: 'core',
    summary:
      'Задание требует показывать дату в формате ДД.ММ.ГГГГ, а база хранит ГГГГ-ММ-ДД. Нужны две надёжные функции перевода — и понимание, где какой формат.',
    mustKnow: [
      '`new Date()` и месяцы с нуля',
      '`toLocaleDateString("ru-RU")`',
      'Формат базы данных ГГГГ-ММ-ДД',
      'Перевод в обе стороны и проверка корректности',
      'Сравнение дат',
    ],
    theory: `## Два формата

| Где | Формат | Пример |
|---|---|---|
| На экране | ДД.ММ.ГГГГ | 14.09.2026 |
| В базе и в API | ГГГГ-ММ-ДД | 2026-09-14 |

Правило: **внутри программы дата всегда в формате ГГГГ-ММ-ДД**, а в формат ДД.ММ.ГГГГ переводится только при показе. Так сортировка работает обычным сравнением строк, а база принимает значение без преобразований.

## Объект Date

\`\`\`js
const now = new Date();
now.getDate();      // день месяца
now.getMonth();     // МЕСЯЦ С НУЛЯ: январь = 0, сентябрь = 8
now.getFullYear();
\`\`\`

Месяцы с нуля — источник половины ошибок с датами.

## Показ

\`\`\`js
new Date('2026-09-14').toLocaleDateString('ru-RU');   // '14.09.2026'
\`\`\`

Готовый способ. Но при разборе строк без времени браузер считает их UTC, и в некоторых часовых поясах дата «уезжает» на день. Поэтому надёжнее собственная функция без объекта Date:

\`\`\`js
function toRuDate(iso) {
  const [year, month, day] = iso.split('-');
  return \`\${day}.\${month}.\${year}\`;
}

function fromRuDate(value) {
  const match = /^(\\d{2})\\.(\\d{2})\\.(\\d{4})$/.exec(value.trim());
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  // проверка, что дата существует: 31.02.2026 не пройдёт
  if (date.getDate() !== Number(day) || date.getMonth() !== Number(month) - 1) return null;
  return \`\${year}-\${month}-\${day}\`;
}
\`\`\`

Вторая функция заодно проверяет корректность: «31.02.2026» вернёт \`null\`, потому что такой даты не существует.

## Сравнение

\`\`\`js
'2026-09-14' < '2026-09-21';       // true — строки в формате ISO сравниваются правильно
new Date(a) - new Date(b);          // разница в миллисекундах
\`\`\`

Даты в формате ДД.ММ.ГГГГ как строки сравнивать **нельзя**: «21.08.2026» окажется больше «14.09.2026».

## Дата не в прошлом

\`\`\`js
function isFuture(iso) {
  const today = new Date();
  const todayIso = \`\${today.getFullYear()}-\${String(today.getMonth() + 1).padStart(2, '0')}-\${String(today.getDate()).padStart(2, '0')}\`;
  return iso >= todayIso;
}
\`\`\`

Конференцию нельзя забронировать на вчера — такую проверку стоит добавить и на фронте, и на сервере.

## Замечание по заданию

В описании предметной области сказано «предпочтительное **время** начала конференции», а в требованиях модуля 2 — «дата в формате ДД.ММ.ГГГГ». Расхождение в самом задании; учебная программа советует уточнить у преподавателя, а надёжным вариантом называет хранение даты (\`DATE\`) с возможным отдельным полем времени.`,
    examples: [
      {
        title: 'Перевод в обе стороны с проверкой',
        language: 'javascript',
        code: `function toRuDate(iso) {
  const [year, month, day] = String(iso).split('-');
  return \`\${day}.\${month}.\${year}\`;
}

function fromRuDate(value) {
  const match = /^(\\d{2})\\.(\\d{2})\\.(\\d{4})$/.exec(String(value).trim());
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (date.getDate() !== Number(day) || date.getMonth() !== Number(month) - 1) return null;
  return \`\${year}-\${month}-\${day}\`;
}

console.log(toRuDate('2026-09-14'));     // 14.09.2026
console.log(fromRuDate('14.09.2026'));   // 2026-09-14
console.log(fromRuDate('31.02.2026'));   // null — такой даты нет
console.log(fromRuDate('14/09/2026'));   // null — не тот формат`,
      },
    ],
    mistakes: [
      {
        title: 'Забыть, что месяцы с нуля',
        wrong: 'new Date(2026, 9, 14)  // это октябрь',
        right: 'new Date(2026, 8, 14)  // сентябрь',
        why: 'getMonth и конструктор считают месяцы от нуля. Именно поэтому в fromRuDate стоит month - 1.',
      },
      {
        title: 'Сравнивать даты в формате ДД.ММ.ГГГГ как строки',
        why: '«21.08.2026» > «14.09.2026» вернёт true, потому что сравниваются символы. Для сортировки переводите в ГГГГ-ММ-ДД.',
      },
      {
        title: 'Не проверять существование даты',
        why: 'Регулярка пропустит 31.02.2026 — формат-то верный. Нужна дополнительная проверка через объект Date.',
      },
    ],
    quizId: 'quiz-js-dates',
    taskIds: ['task-js-dates', 'task-exam-date-speed'],
    resources: [
      { title: 'learn.javascript.ru — дата и время', url: 'https://learn.javascript.ru/datetime', kind: 'tutorial', source: 'plan' },
    ],
    examRefs: ['m1-order', 'm2-order-form'],
    prerequisites: ['js-regexp'],
    estimatedMinutes: 45,
    planDays: ['day-07-6'],
    source: 'plan',
  },

  {
    id: 'ts-basics',
    title: 'TypeScript: зачем он нужен и как начать',
    tech: ['ts'],
    monthNo: 2,
    weekNo: 8,
    importance: 'core',
    summary:
      'TypeScript проверяет типы до запуска и превращает редактор в справочник. На экзамене без интернета это главный источник подсказок.',
    mustKnow: [
      'Аннотации: string, number, boolean',
      'Вывод типа: когда аннотация не нужна',
      'Компиляция `tsc` и проверка в редакторе',
      'Почему `any` — плохая привычка',
      'Как читать сообщение об ошибке типа',
    ],
    theory: `## Зачем

\`\`\`ts
function checkLogin(login: string): boolean {
  return login.length >= 6;
}

checkLogin(42);  // ошибка ещё в редакторе, до запуска
\`\`\`

Три выгоды, важные именно на экзамене:

1. Ошибка видна сразу, а не после клика по кнопке.
2. Редактор знает структуру ваших данных: набрали \`application.\` — увидели список полей. Это заменяет документацию, которой без интернета не будет.
3. Автодополнение по типам ускоряет набор.

## Аннотации и вывод типа

\`\`\`ts
let title: string = 'Заявка';
let count = 0;              // выведен number — аннотация не нужна
const rooms: string[] = ['Аудитория', 'Коворкинг'];
\`\`\`

Не аннотируйте то, что и так очевидно. Аннотации обязательны для параметров функции и полезны для возвращаемого значения.

## Компиляция

\`\`\`bash
npx tsc file.ts        # получить file.js
npx tsc --noEmit       # только проверить типы
\`\`\`

В проекте на Vite компиляция происходит автоматически: файлы \`.ts\` и \`.tsx\` превращаются в JavaScript при сборке. Браузер TypeScript не понимает.

**Важно:** типы существуют только во время разработки. В собранном коде их нет, и во время выполнения никто не проверит, что с сервера пришло именно то, что вы описали. Данные извне всё равно нужно проверять.

## any

\`\`\`ts
let data: any = загрузить();
data.чтоУгодно.можно();   // ошибок не будет, пока не упадёт при запуске
\`\`\`

\`any\` отключает проверку — смысл TypeScript пропадает. Если тип действительно неизвестен, берите \`unknown\`: с ним компилятор потребует сначала проверить, что перед вами.

Критерий «качество кода» на экзамене прямо включает отсутствие \`any\`.

## Читаем ошибку

\`\`\`text
Type 'string' is not assignable to type 'number'.
\`\`\`

Читается справа налево: «ожидался number, а передали string». В 90 % случаев этого достаточно, чтобы найти проблему.`,
    examples: [
      {
        title: 'Валидация на TypeScript',
        language: 'typescript',
        code: `const LOGIN_PATTERN = /^[A-Za-z0-9]{6,}$/;

export function checkLogin(login: string): boolean {
  return LOGIN_PATTERN.test(login);
}

export function checkPassword(password: string): boolean {
  return password.length >= 8;
}

// Ошибки, которые редактор покажет ДО запуска:
// checkLogin(42);            аргумент не строка
// checkLogin();              нет аргумента
// const x: number = checkLogin('ivanov26');   boolean не число

console.log(checkLogin('ivanov26'), checkPassword('demo2026'));`,
      },
    ],
    mistakes: [
      {
        title: 'Ставить any, чтобы «ошибка ушла»',
        wrong: 'const data: any = await response.json();',
        right: 'const data = (await response.json()) as Application[];',
        why: 'any отключает проверку целиком. Лучше описать ожидаемый тип и проверить данные.',
      },
      {
        title: 'Думать, что типы работают во время выполнения',
        why: 'Типы стираются при сборке. Данные с сервера всё равно нужно проверять кодом.',
      },
    ],
    quizId: 'quiz-ts-basics',
    taskIds: ['task-ts-basics'],
    resources: [
      { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', kind: 'docs', source: 'plan' },
      { title: 'metanit.com — TypeScript', url: 'https://metanit.com/web/typescript/', kind: 'tutorial', source: 'plan' },
    ],
    examRefs: ['m3-quality'],
    prerequisites: ['js-functions'],
    estimatedMinutes: 45,
    planDays: ['day-08-1'],
    source: 'plan',
  },

  {
    id: 'ts-types',
    title: 'type и interface, литеральные типы статусов',
    tech: ['ts'],
    monthNo: 2,
    weekNo: 8,
    importance: 'core',
    summary:
      'Описание данных проекта — User, Room, Application, Review — это фундамент. Литеральный тип статусов защищает от опечатки в формулировках задания.',
    mustKnow: [
      '`type` и `interface`: в чём разница',
      'Необязательные поля `?` и только для чтения `readonly`',
      'Массивы `Application[]`',
      'Литеральные типы и объединения',
      'Вложенные объекты и переиспользование типов',
    ],
    theory: `## Описание объекта

\`\`\`ts
interface User {
  id: number;
  login: string;
  fullName: string;
  phone: string;
  email: string;
  role: 'user' | 'admin';
}

type Room = {
  id: number;
  title: string;
};
\`\`\`

\`interface\` и \`type\` для объектов почти одинаковы. \`interface\` можно расширять и дополнять, \`type\` умеет объединения и пересечения. Практический совет: объекты — \`interface\`, всё остальное — \`type\`. Главное — единообразие в проекте.

## Литеральные типы — защита от опечатки

\`\`\`ts
type Status = 'Новая' | 'Мероприятие назначено' | 'Мероприятие завершено';

const status: Status = 'Новая';        // ок
const wrong: Status = 'новая';         // ошибка ещё в редакторе
\`\`\`

Это прямая страховка от главной ошибки экзамена — неточной формулировки статуса. Редактор будет подсказывать три допустимых значения и не даст написать четвёртое.

## Необязательные поля

\`\`\`ts
interface Application {
  id: number;
  userId: number;
  roomId: number;
  date: string;            // ГГГГ-ММ-ДД
  paymentId: number;
  status: Status;
  review?: Review;         // может не быть
}
\`\`\`

Знак \`?\` означает, что поля может не быть. TypeScript заставит проверить его перед использованием — и вы не забудете про случай «отзыва ещё нет».

## Переиспользование

\`\`\`ts
type NewApplication = Omit<Application, 'id' | 'status'>;   // без этих полей
type ApplicationPatch = Partial<Application>;               // все поля необязательны
type PublicUser = Omit<User, 'passwordHash'>;               // безопасно отдать клиенту
\`\`\`

Готовые утилиты экономят время и не дают типам разъехаться.

## Где описывать

Учебная программа предлагает файл \`types.ts\` в папке \`src\`. Один файл с типами \`User\`, \`Room\`, \`Application\`, \`Review\`, \`Status\` — и весь проект говорит на одном языке.`,
    examples: [
      {
        title: 'Типы проекта «Конференции.РФ»',
        language: 'typescript',
        code: `export type Status = 'Новая' | 'Мероприятие назначено' | 'Мероприятие завершено';

export const STATUSES: Status[] = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'];

export interface User {
  id: number;
  login: string;
  fullName: string;
  phone: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Room {
  id: number;
  title: string;
}

export interface PaymentMethod {
  id: number;
  title: string;
}

export interface Review {
  id: number;
  applicationId: number;
  text: string;
  createdAt: string;
}

export interface Application {
  id: number;
  userId: number;
  roomId: number;
  paymentId: number;
  date: string;      // ГГГГ-ММ-ДД
  status: Status;
  review?: Review;
}

/** То, что отправляем на сервер при создании заявки. */
export type NewApplication = Omit<Application, 'id' | 'status' | 'userId' | 'review'>;`,
        explanation:
          'Массив STATUSES и тип Status держатся вместе: выпадающий список в админке строится из массива, а тип не даёт ошибиться в значении.',
      },
    ],
    mistakes: [
      {
        title: 'Хранить статус как обычную строку',
        wrong: 'status: string',
        right: "status: 'Новая' | 'Мероприятие назначено' | 'Мероприятие завершено'",
        why: 'С типом string опечатка «Новая » с пробелом пройдёт незамеченной — и статус не совпадёт с требованием задания.',
      },
      {
        title: 'Дублировать типы в каждом файле',
        why: 'Копии расходятся. Держите описания в одном types.ts и импортируйте.',
      },
    ],
    quizId: 'quiz-ts-types',
    taskIds: ['task-ts-types'],
    resources: [
      { title: 'TypeScript: Everyday Types', url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m1-admin', 'm3-quality'],
    prerequisites: ['ts-basics'],
    estimatedMinutes: 45,
    planDays: ['day-08-2'],
    source: 'plan',
  },

  {
    id: 'ts-functions',
    title: 'Типизация функций, Promise<T> и unknown',
    tech: ['ts'],
    monthNo: 2,
    weekNo: 8,
    importance: 'core',
    summary:
      'Типы параметров и результата описывают контракт функции. Для асинхронных функций результат — это Promise<T>, а для данных с сервера безопаснее unknown, чем any.',
    mustKnow: [
      'Типы параметров и возвращаемого значения',
      'Необязательные параметры и значения по умолчанию',
      '`Promise<T>` у async-функций',
      '`unknown` против `any`',
      'Обобщённые типы в двух словах',
    ],
    theory: `## Контракт функции

\`\`\`ts
function toRuDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  return \`\${day}.\${month}.\${year}\`;
}

function fromRuDate(value: string): string | null {
  // вернёт либо строку, либо null
}
\`\`\`

Тип \`string | null\` заставляет вызывающий код проверить результат — забыть про «дата не разобралась» уже не получится.

## Необязательные параметры

\`\`\`ts
function getPage(items: Application[], page = 1, perPage = 5): Application[] {
  return items.slice((page - 1) * perPage, page * perPage);
}
\`\`\`

Параметр со значением по умолчанию автоматически необязателен, аннотация не нужна — тип выведется.

## Асинхронные функции

\`\`\`ts
async function getApplications(): Promise<Application[]> {
  const response = await fetch('/api/applications/my');
  if (!response.ok) throw new Error('Не удалось загрузить заявки');
  return response.json() as Promise<Application[]>;
}
\`\`\`

Результат \`async\`-функции всегда обёрнут в \`Promise\`. Если написать \`: Application[]\`, компилятор сообщит об ошибке.

## unknown вместо any

\`\`\`ts
async function safeJson(response: Response): Promise<unknown> {
  return response.json();
}

const data = await safeJson(response);
// data.length — ошибка: сначала проверьте, что это массив

if (Array.isArray(data)) {
  console.log(data.length);   // теперь можно
}
\`\`\`

\`unknown\` говорит: «тип неизвестен, сначала проверь». \`any\` говорит: «делай что хочешь» — и ошибка всплывёт уже у пользователя.

## Обобщённые типы

\`\`\`ts
async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) throw new Error('Ошибка запроса');
  return response.json() as Promise<T>;
}

const rooms = await apiGet<Room[]>('/api/rooms');   // rooms: Room[]
\`\`\`

Буква \`T\` — «тип, который подставят при вызове». Одна функция обслуживает все запросы и при этом возвращает точный тип. Глубоко разбираться в обобщениях для экзамена не нужно — достаточно уметь читать такую запись и пользоваться ею.`,
    examples: [
      {
        title: 'Типизированные запросы к API',
        language: 'typescript',
        code: `export interface Room { id: number; title: string }
export interface Application { id: number; roomId: number; date: string; status: string }

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(\`Ошибка \${response.status}\`);
  return (await response.json()) as T;
}

export function getRooms(): Promise<Room[]> {
  return apiGet<Room[]>('/api/rooms');
}

export function getMyApplications(): Promise<Application[]> {
  return apiGet<Application[]>('/api/applications/my');
}

// В компоненте: rooms уже имеет тип Room[], редактор подсказывает поля
// const rooms = await getRooms();`,
      },
    ],
    mistakes: [
      {
        title: 'Указать тип без Promise у async-функции',
        wrong: 'async function load(): Application[] {}',
        right: 'async function load(): Promise<Application[]> {}',
        why: 'Асинхронная функция всегда возвращает обещание.',
      },
      {
        title: 'Приводить ответ сервера к типу без проверки',
        why: 'Приведение (as) ничего не проверяет во время выполнения. Если сервер вернул другое, ошибка вылезет позже и в другом месте.',
      },
    ],
    quizId: 'quiz-ts-functions',
    taskIds: ['task-ts-functions'],
    resources: [
      { title: 'TypeScript: функции', url: 'https://www.typescriptlang.org/docs/handbook/2/functions.html', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m3-quality'],
    prerequisites: ['ts-types', 'js-async'],
    estimatedMinutes: 45,
    planDays: ['day-08-3'],
    source: 'plan',
  },

  {
    id: 'ts-oop',
    title: 'ООП в TypeScript: классы для проекта экзамена',
    tech: ['ts'],
    monthNo: 2,
    weekNo: 8,
    importance: 'core',
    summary:
      'Задание модуля 1 прямо требует технологии объектно-ориентированного программирования. Класс ApiClient и класс сервиса заявок закрывают это требование осмысленно, а не для галочки.',
    mustKnow: [
      '`class`, `constructor`, поля и методы',
      'Модификаторы `private`, `public`, `readonly`',
      'Краткая запись полей в конструкторе',
      '`implements` и интерфейс как контракт',
      'Где класс уместен, а где проще функция',
    ],
    theory: `## Класс

\`\`\`ts
class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  private get token(): string | null {
    return localStorage.getItem('token');
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>(path);
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) });
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(this.baseUrl + path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token ? { Authorization: \`Bearer \${this.token}\` } : {}),
        ...options.headers,
      },
    });
    if (!response.ok) throw new Error(\`Ошибка \${response.status}\`);
    return (await response.json()) as T;
  }
}

export const api = new ApiClient();
\`\`\`

\`private\` означает «только внутри класса»: снаружи никто не вызовет \`request\` напрямую и не прочитает токен. \`readonly\` запрещает менять поле после создания.

## Краткая запись

\`\`\`ts
class ApplicationService {
  constructor(private readonly api: ApiClient) {}

  getMy() { return this.api.get<Application[]>('/applications/my'); }
  create(data: NewApplication) { return this.api.post<Application>('/applications', data); }
}
\`\`\`

Модификатор прямо в параметре конструктора сразу создаёт поле — короче и читается лучше.

## implements

\`\`\`ts
interface Repository<T> {
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T | null>;
}

class ApplicationRepository implements Repository<Application> {
  async getAll(): Promise<Application[]> { /* … */ }
  async getById(id: number): Promise<Application | null> { /* … */ }
}
\`\`\`

Интерфейс фиксирует контракт: если метод забыт или подписан иначе, компилятор скажет об этом сразу.

## На сервере

Программа предлагает вынести SQL по заявкам в класс (неделя 16, день 6):

\`\`\`js
class ApplicationsRepo {
  constructor(pool) { this.pool = pool; }

  async findByUser(userId) {
    const [rows] = await this.pool.execute(
      'SELECT * FROM applications WHERE user_id = ? ORDER BY date DESC',
      [userId],
    );
    return rows;
  }

  async changeStatus(id, status) {
    await this.pool.execute('UPDATE applications SET status = ? WHERE id = ?', [status, id]);
  }
}
\`\`\`

Весь SQL собран в одном месте, маршруты становятся тонкими — и требование ООП выполнено по делу.

## Где класс не нужен

Валидация, форматирование даты, расчёт страницы — это чистые функции. Заворачивать их в класс со статическими методами не нужно: получится класс ради класса. Достаточно двух-трёх осмысленных классов на проект.`,
    examples: [
      {
        title: 'Класс API и сервис заявок',
        language: 'typescript',
        code: `interface Application { id: number; roomId: number; date: string; status: string }
type NewApplication = { roomId: number; date: string; paymentId: number };

class ApiClient {
  constructor(private readonly baseUrl: string = '/api') {}

  private headers(): Record<string, string> {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: \`Bearer \${token}\` } : {}),
    };
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(this.baseUrl + path, { headers: this.headers() });
    if (!response.ok) throw new Error(\`Ошибка \${response.status}\`);
    return (await response.json()) as T;
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(this.baseUrl + path, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(\`Ошибка \${response.status}\`);
    return (await response.json()) as T;
  }
}

class ApplicationService {
  constructor(private readonly api: ApiClient) {}

  getMy(): Promise<Application[]> {
    return this.api.get<Application[]>('/applications/my');
  }

  create(data: NewApplication): Promise<Application> {
    return this.api.post<Application>('/applications', data);
  }
}

export const api = new ApiClient();
export const applicationService = new ApplicationService(api);`,
      },
    ],
    mistakes: [
      {
        title: 'Класс ради класса',
        wrong: 'class Utils { static formatDate(d) { … } }',
        right: 'export function formatDate(d) { … }',
        why: 'Класс без состояния — это просто пространство имён. Требование ООП закрывают осмысленные классы: клиент API, репозиторий, сервис.',
      },
      {
        title: 'Публичные поля, которые не должны меняться снаружи',
        why: 'private и readonly показывают намерение и защищают от случайной правки. Это заметно в оценке качества кода.',
      },
    ],
    quizId: 'quiz-ts-oop',
    taskIds: ['task-ts-oop', 'task-js-api-client'],
    resources: [
      { title: 'TypeScript: классы', url: 'https://www.typescriptlang.org/docs/handbook/2/classes.html', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m1-oop-styles', 'm3-quality'],
    prerequisites: ['ts-functions'],
    estimatedMinutes: 50,
    planDays: ['day-08-4'],
    source: 'plan',
  },

  {
    id: 'bootstrap-basics',
    title: 'Bootstrap: подключение и утилиты',
    tech: ['bootstrap', 'css'],
    monthNo: 2,
    weekNo: 8,
    importance: 'core',
    summary:
      'Задание требует использовать библиотеку стилей. Bootstrap даёт готовые формы, кнопки и таблицы — но подключать его нужно из node_modules, потому что на экзамене нет интернета.',
    mustKnow: [
      'Установка `npm i bootstrap` и импорт CSS',
      'Почему нельзя подключать с CDN',
      'Утилиты отступов: `m-*`, `p-*`',
      'Утилиты flex, текста и фона',
      'Как дополнять Bootstrap своим CSS',
    ],
    theory: `## Подключение

\`\`\`bash
npm install bootstrap
\`\`\`

\`\`\`js
// main.tsx — первой строкой, до своих стилей
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
\`\`\`

Порядок важен: Bootstrap идёт первым, ваш файл вторым. Тогда ваши правила той же специфичности переопределяют библиотечные.

**Никаких CDN.** Строка \`<link href="https://cdn.jsdelivr.net/...">\` на экзамене просто не загрузится, и вёрстка развалится. Это отдельно подчёркнуто в учебной программе.

Если нужны интерактивные компоненты (модальное окно, выпадающее меню, тосты), понадобится ещё и JavaScript Bootstrap:

\`\`\`js
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
\`\`\`

В React часто удобнее сделать эти компоненты самому: собственный тост на \`useState\` занимает 20 строк и не конфликтует с React.

## Утилиты отступов

Схема: \`{свойство}{сторона}-{размер}\`.

| Запись | Значение |
|---|---|
| \`m-3\` | margin со всех сторон, шаг 3 |
| \`mt-2\` | margin-top |
| \`mb-4\` | margin-bottom |
| \`mx-auto\` | margin слева и справа auto — центрирование |
| \`p-3\` | padding со всех сторон |
| \`py-2\` | padding сверху и снизу |

Размеры: 0, 1 (.25rem), 2 (.5rem), 3 (1rem), 4 (1.5rem), 5 (3rem).

## Часто используемые утилиты

\`\`\`html
<div class="d-flex justify-content-between align-items-center gap-2">
<p class="text-muted small mb-0">
<span class="badge bg-primary">Новая</span>
<div class="card shadow-sm rounded-3">
<div class="text-center fw-semibold">
<div class="d-none d-md-block">      <!-- скрыто на мобильном -->
\`\`\`

Утилиты покрывают 80 % простых случаев и экономят время на экзамене: не нужно писать свой CSS для каждого отступа.

## Свой CSS поверх

Не пытайтесь перекрасить всё через утилиты — для фирменного стиля заведите свой файл:

\`\`\`css
:root { --bs-primary: #2563eb; }

.card { border-radius: 12px; }
.btn { transition: transform .15s ease; }
.btn:active { transform: translateY(1px); }
\`\`\`

Bootstrap 5 построен на CSS-переменных, поэтому базовые цвета меняются через \`--bs-*\`.

## Честное замечание

Bootstrap ускоряет работу, но узнаваем. Если хочется своего вида — меняйте цвета, скругления и тени в своём файле. Задание требует «использование библиотек стилей», а не «стандартный вид Bootstrap».`,
    examples: [
      {
        title: 'Форма входа на классах Bootstrap',
        language: 'html',
        code: `<div class="container py-5">
  <div class="row justify-content-center">
    <div class="col-12 col-sm-8 col-md-5">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h1 class="h4 mb-3">Вход в систему</h1>

          <form novalidate>
            <div class="mb-3">
              <label for="login" class="form-label">Логин</label>
              <input type="text" class="form-control is-invalid" id="login">
              <div class="invalid-feedback">Неверный логин или пароль</div>
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Пароль</label>
              <input type="password" class="form-control" id="password">
            </div>

            <button type="submit" class="btn btn-primary w-100">Войти</button>
          </form>

          <p class="text-center mt-3 mb-0">
            <a href="/register">Еще не зарегистрированы? Регистрация</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>`,
        explanation:
          'Классы is-invalid и invalid-feedback — готовое решение для требования «подсказки об ошибках рядом с формой».',
      },
    ],
    mistakes: [
      {
        title: 'Подключить Bootstrap по ссылке с CDN',
        wrong: '<link href="https://cdn.jsdelivr.net/npm/bootstrap.../bootstrap.min.css" rel="stylesheet">',
        right: "import 'bootstrap/dist/css/bootstrap.min.css';",
        why: 'На экзамене нет интернета: стили не загрузятся, и приложение будет выглядеть как голый HTML.',
      },
      {
        title: 'Свой CSS подключён раньше Bootstrap',
        why: 'Тогда библиотека перебивает ваши правила. Сначала Bootstrap, потом свой файл.',
      },
    ],
    quizId: 'quiz-bootstrap-basics',
    taskIds: [],
    resources: [
      { title: 'Bootstrap: Utilities', url: 'https://getbootstrap.com/docs/5.3/utilities/spacing/', kind: 'docs', source: 'plan' },
    ],
    examRefs: ['m1-oop-styles', 'm2-design'],
    prerequisites: ['css-basics'],
    estimatedMinutes: 40,
    planDays: ['day-08-5'],
    source: 'plan',
  },

  {
    id: 'bootstrap-grid',
    title: 'Сетка Bootstrap: container, row, col',
    tech: ['bootstrap', 'css'],
    monthNo: 2,
    weekNo: 8,
    importance: 'core',
    summary:
      'Сетка из 12 колонок с готовыми брейкпоинтами закрывает требование адаптивности под 390×844 без единого своего медиазапроса.',
    mustKnow: [
      '`container` и `container-fluid`',
      '`row` и `col-*`, всего 12 колонок',
      'Брейкпоинты sm, md, lg, xl',
      '`col-12 col-md-6` — мобильный первым',
      '`g-*` для промежутков между колонками',
    ],
    theory: `## Три уровня

\`\`\`html
<div class="container">
  <div class="row g-3">
    <div class="col-12 col-md-6 col-lg-4">Карточка</div>
    <div class="col-12 col-md-6 col-lg-4">Карточка</div>
    <div class="col-12 col-md-6 col-lg-4">Карточка</div>
  </div>
</div>
\`\`\`

- \`container\` — центрирует содержимое и ограничивает ширину;
- \`row\` — строка сетки;
- \`col-*\` — колонка; сумма в строке обычно равна 12.

## Брейкпоинты

| Класс | С какой ширины действует |
|---|---|
| \`col-*\` | Всегда (с самого узкого экрана) |
| \`col-sm-*\` | от 576px |
| \`col-md-*\` | от 768px |
| \`col-lg-*\` | от 992px |
| \`col-xl-*\` | от 1200px |

Читается так: \`col-12 col-md-6 col-lg-4\` — «на телефоне во всю ширину, с планшета по две в ряд, на десктопе по три».

Экран из задания (390px) попадает в самый узкий диапазон, поэтому за него отвечает класс без приставки — \`col-12\`.

## Промежутки

\`\`\`html
<div class="row g-3">   <!-- промежуток по обеим осям -->
<div class="row gx-2 gy-4">  <!-- отдельно по горизонтали и вертикали -->
\`\`\`

Раньше отступы делали классами \`m-*\` на колонках — теперь есть \`g-*\`, и он работает аккуратнее.

## Типичные раскладки проекта

\`\`\`html
<!-- Форма по центру -->
<div class="row justify-content-center">
  <div class="col-12 col-sm-8 col-md-5">…</div>
</div>

<!-- Карточки помещений -->
<div class="row g-3">
  <div class="col-12 col-md-4">Аудитория</div>
  <div class="col-12 col-md-4">Коворкинг</div>
  <div class="col-12 col-md-4">Кинозал</div>
</div>

<!-- Таблица с прокруткой на телефоне -->
<div class="table-responsive">
  <table class="table table-striped align-middle">…</table>
</div>
\`\`\`

Класс \`table-responsive\` решает проблему широкой таблицы админки одной строкой: прокручивается таблица, а не вся страница.

## Проверка

Откройте DevTools, включите режим устройства и поставьте 390×844. Если горизонтальной прокрутки нет, а колонки встали друг под друга — сетка настроена правильно.`,
    examples: [
      {
        title: 'Админка: фильтры и таблица',
        language: 'html',
        code: `<div class="container py-4">
  <h1 class="h4 mb-3">Панель администратора</h1>

  <div class="row g-2 mb-3">
    <div class="col-12 col-md-4">
      <select class="form-select" aria-label="Фильтр по статусу">
        <option value="">Все статусы</option>
        <option>Новая</option>
        <option>Мероприятие назначено</option>
        <option>Мероприятие завершено</option>
      </select>
    </div>
    <div class="col-12 col-md-4">
      <input class="form-control" type="search" placeholder="Поиск по ФИО">
    </div>
  </div>

  <div class="table-responsive">
    <table class="table table-striped align-middle">
      <thead>
        <tr>
          <th scope="col">№</th>
          <th scope="col">ФИО</th>
          <th scope="col">Помещение</th>
          <th scope="col">Дата</th>
          <th scope="col">Статус</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Иванов И.И.</td>
          <td>Коворкинг</td>
          <td>14.09.2026</td>
          <td><span class="badge bg-secondary">Новая</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>`,
        runnable: false,
      },
    ],
    mistakes: [
      {
        title: 'col без col-12 для мобильного',
        wrong: '<div class="col-md-4">',
        right: '<div class="col-12 col-md-4">',
        why: 'Bootstrap работает по принципу mobile-first: класс без приставки задаёт поведение на самом узком экране.',
      },
      {
        title: 'col вне row',
        why: 'Колонка вне строки теряет отрицательные отступы сетки, и появляется горизонтальная прокрутка.',
      },
    ],
    quizId: 'quiz-bootstrap-grid',
    taskIds: [],
    resources: [
      { title: 'Bootstrap Grid', url: 'https://getbootstrap.com/docs/5.3/layout/grid/', kind: 'docs', source: 'plan' },
    ],
    examRefs: ['m2-mobile', 'm3-mobile'],
    prerequisites: ['bootstrap-basics', 'css-responsive'],
    estimatedMinutes: 40,
    planDays: ['day-08-5'],
    source: 'plan',
  },

  {
    id: 'bootstrap-components',
    title: 'Компоненты Bootstrap для проекта экзамена',
    tech: ['bootstrap'],
    monthNo: 2,
    weekNo: 8,
    importance: 'core',
    summary:
      'Форма, карточка, бейдж, таблица, навбар, модальное окно, тост, пагинация — набор, из которого целиком собирается интерфейс задания.',
    mustKnow: [
      '`form-control`, `form-select`, `is-invalid` + `invalid-feedback`',
      '`btn`, `card`, `badge`, `alert`',
      '`table`, `table-striped`, `table-responsive`',
      '`navbar` с бургером',
      '`modal`, `toast`, `pagination`',
    ],
    theory: `## Формы

\`\`\`html
<div class="mb-3">
  <label for="room" class="form-label">Помещение</label>
  <select class="form-select" id="room" required>
    <option value="">— выберите —</option>
    <option value="1">Аудитория</option>
  </select>
  <div class="invalid-feedback">Выберите помещение</div>
</div>
\`\`\`

Механика ошибок: добавляете полю класс \`is-invalid\` — соседний \`.invalid-feedback\` становится видимым. Именно это требует модуль 2: «подсказки об ошибках рядом с формой».

## Бейджи статусов

\`\`\`html
<span class="badge bg-secondary">Новая</span>
<span class="badge bg-primary">Мероприятие назначено</span>
<span class="badge bg-success">Мероприятие завершено</span>
\`\`\`

Цвет помогает, но текст обязателен: по одному цвету статус различит не каждый.

## Таблица админки

\`\`\`html
<div class="table-responsive">
  <table class="table table-striped table-hover align-middle">
    <thead class="table-light">…</thead>
    <tbody>…</tbody>
  </table>
</div>
\`\`\`

## Пагинация

\`\`\`html
<nav aria-label="Постраничная навигация">
  <ul class="pagination">
    <li class="page-item disabled"><a class="page-link" href="#">Назад</a></li>
    <li class="page-item active"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">Вперёд</a></li>
  </ul>
</nav>
\`\`\`

Требование модуля 2 «постраничная навигация» закрывается этим блоком плюс логикой \`slice\` из недели 7.

## Уведомления

\`\`\`html
<div class="toast show align-items-center text-bg-success position-fixed bottom-0 end-0 m-3" role="status">
  <div class="d-flex">
    <div class="toast-body">Статус изменён</div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto"></button>
  </div>
</div>
\`\`\`

Класс \`show\` показывает тост без JavaScript Bootstrap — в React проще управлять видимостью состоянием, чем подключать библиотечный скрипт.

## Модальное окно

Нужно для подтверждения: «Точно сменить статус?». Через JavaScript Bootstrap это \`new bootstrap.Modal(element).show()\`, но в React обычно делают своё окно на состоянии — меньше конфликтов и полный контроль над фокусом.

## Навбар с бургером

\`\`\`html
<nav class="navbar navbar-expand-md bg-body-tertiary">
  <div class="container">
    <a class="navbar-brand" href="/">Конференции.РФ</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="nav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="/cabinet">Кабинет</a></li>
      </ul>
    </div>
  </div>
</nav>
\`\`\`

Бургер работает только с подключённым JavaScript Bootstrap (\`bootstrap.bundle.min.js\`). Без него меню не раскроется — частая причина «почему на телефоне не работает».

## Что взять на экзамен

Минимальный набор, которого хватает на весь проект: \`form-control\`, \`form-select\`, \`is-invalid\`, \`invalid-feedback\`, \`btn\`, \`card\`, \`badge\`, \`table\`, \`table-responsive\`, \`navbar\`, \`alert\`, \`pagination\`, утилиты отступов и flex. Выпишите их себе и выучите — программа предлагает именно такой список.`,
    examples: [
      {
        title: 'Карточка заявки в кабинете',
        language: 'html',
        code: `<article class="card mb-3">
  <div class="card-body">
    <div class="d-flex justify-content-between align-items-start gap-2">
      <div>
        <h2 class="h6 card-title mb-1">Коворкинг</h2>
        <p class="card-text text-muted small mb-2">14.09.2026 · Банковская карта</p>
      </div>
      <span class="badge bg-primary">Мероприятие назначено</span>
    </div>

    <!-- Отзыв доступен только после смены статуса администратором -->
    <form class="mt-2">
      <label for="review-1" class="form-label small">Ваш отзыв</label>
      <textarea class="form-control" id="review-1" rows="2"></textarea>
      <button class="btn btn-sm btn-outline-primary mt-2" type="submit">Отправить отзыв</button>
    </form>
  </div>
</article>`,
        explanation:
          'Форма отзыва показана, потому что статус уже не «Новая». У заявки со статусом «Новая» этого блока быть не должно — требование модуля 2.',
      },
    ],
    mistakes: [
      {
        title: 'Навбар без JavaScript Bootstrap',
        why: 'Бургер не раскроется: за это отвечает скрипт библиотеки. Либо подключите bootstrap.bundle.min.js, либо напишите переключение сами.',
      },
      {
        title: 'Статус только цветом бейджа',
        why: 'Пользователь с нарушением цветовосприятия не различит. Текст статуса обязателен.',
      },
      {
        title: 'Форма отзыва у заявки со статусом «Новая»',
        why: 'Прямое нарушение требования модуля 2. Проверка нужна и на фронте, и на сервере.',
      },
    ],
    quizId: 'quiz-bootstrap-components',
    taskIds: ['task-dom-admin-table'],
    resources: [
      { title: 'Bootstrap: компоненты', url: 'https://getbootstrap.com/docs/5.3/components/', kind: 'docs', source: 'plan' },
    ],
    examRefs: ['m2-admin-tools', 'm2-cabinet-ux', 'm2-register-hints'],
    prerequisites: ['bootstrap-grid'],
    estimatedMinutes: 50,
    planDays: ['day-08-6'],
    source: 'plan',
  },
];
