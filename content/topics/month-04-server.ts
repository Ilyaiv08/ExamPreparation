import type { Topic } from '../types';

/** Месяц 4, недели 15–16: сервер на Express и авторизация. */
export const MONTH_04_SERVER_TOPICS: Topic[] = [
  {
    id: 'express-basics',
    title: 'Express: первый сервер и маршруты',
    tech: ['node', 'express'],
    monthNo: 4,
    weekNo: 15,
    importance: 'core',
    summary:
      'Сервер принимает запросы и отвечает данными. Express описывает это в несколько строк: метод, адрес, функция-обработчик.',
    mustKnow: [
      'app.get, app.post, app.patch, app.delete',
      'express.json() для разбора тела',
      'res.json и res.status',
      'Порядок объявления маршрутов',
      'Запуск через node --watch',
    ],
    theory: `## Минимальный сервер

\`\`\`js
import express from 'express';

const app = express();
app.use(express.json());          // разбирать тело запроса как JSON

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Привет' });
});

app.listen(3000, () => console.log('Сервер на http://localhost:3000'));
\`\`\`

Три части каждого маршрута: **метод**, **адрес**, **обработчик**. В обработчик приходят \`req\` (запрос) и \`res\` (ответ).

## express.json()

Без этой строки \`req.body\` будет \`undefined\`. Это самая частая ошибка первого дня: данные «не приходят», хотя клиент их отправил.

## Ответы

\`\`\`js
res.json(data);                                        // 200 и JSON
res.status(201).json(created);                         // создано
res.status(400).json({ error: 'Заполните все поля' }); // ошибка клиента
res.status(404).json({ error: 'Не найдено' });
res.status(500).json({ error: 'Ошибка сервера' });
res.sendStatus(204);                                   // без тела
\`\`\`

Ответ отправляется **один раз**. Если после \`res.json()\` выполнится ещё один \`res\`, Node выдаст ошибку «headers already sent» — обычно из-за забытого \`return\`.

\`\`\`js
if (!title) {
  return res.status(400).json({ error: 'Укажите название' });   // return обязателен
}
\`\`\`

## Структура файлов

\`\`\`text
server/
├── index.js           создание приложения и запуск
├── db.js              пул подключений к MySQL
├── routes/
│   ├── auth.js        регистрация и вход
│   ├── applications.js
│   ├── reviews.js
│   └── admin.js
├── middleware/
│   └── auth.js        проверка токена и роли
└── seed.js            создание администратора
\`\`\`

Маршруты группируются по смыслу — так их легко найти и проверяющему, и вам.

## Роутер

\`\`\`js
// routes/applications.js
import { Router } from 'express';
const router = Router();

router.get('/my', requireAuth, async (req, res) => { … });
router.post('/', requireAuth, async (req, res) => { … });

export default router;

// index.js
app.use('/api/applications', applicationsRouter);
\`\`\`

Префикс задаётся один раз при подключении.

## Порядок маршрутов

Express проверяет маршруты сверху вниз и берёт первый подходящий:

\`\`\`js
router.get('/my', …);     // сначала конкретный
router.get('/:id', …);    // потом с параметром
\`\`\`

Если поменять местами, \`/my\` попадёт в обработчик \`/:id\` с параметром \`id = 'my'\`.

## Запуск

\`\`\`bash
node index.js
node --watch index.js     # перезапуск при изменении файла
\`\`\`

\`--watch\` встроен в Node 18+ и заменяет nodemon — важно, потому что на экзамене может не быть возможности поставить пакет.

## package.json

\`\`\`json
{
  "type": "module",
  "scripts": {
    "dev": "node --watch index.js",
    "start": "node index.js",
    "seed": "node seed.js"
  }
}
\`\`\`

\`"type": "module"\` позволяет писать \`import\` вместо \`require\` — так же, как на фронтенде.`,
    examples: [
      {
        title: 'Сервер с маршрутами заявок',
        language: 'javascript',
        code: `import express from 'express';

const app = express();
app.use(express.json());

// временное хранилище, пока нет базы
let applications = [
  { id: 1, room: 'Коворкинг', date: '2026-09-14', status: 'Новая' },
];

app.get('/api/applications', (req, res) => {
  res.json(applications);
});

app.post('/api/applications', (req, res) => {
  const { room, date } = req.body;

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
});

app.patch('/api/applications/:id', (req, res) => {
  const id = Number(req.params.id);
  const application = applications.find((a) => a.id === id);

  if (!application) {
    return res.status(404).json({ error: 'Заявка не найдена' });
  }

  application.status = req.body.status;
  res.json(application);
});

app.listen(3000, () => console.log('http://localhost:3000'));`,
        explanation:
          'Массив вместо базы — нормальный первый шаг (день 2 недели 15). Структура маршрутов остаётся той же, когда появится MySQL.',
      },
    ],
    mistakes: [
      {
        title: 'Забыть express.json()',
        why: 'req.body будет undefined, и данные «не дойдут» до сервера.',
      },
      {
        title: 'Нет return перед res.status(400)',
        why: 'Выполнение продолжится, и сервер попытается отправить второй ответ — получите ошибку «headers already sent».',
      },
      {
        title: 'Маршрут /:id выше конкретного',
        why: 'Запрос /my попадёт в обработчик с параметром. Конкретные маршруты объявляют первыми.',
      },
    ],
    quizId: 'quiz-express-basics',
    taskIds: ['task-express-routes'],
    resources: [
      { title: 'Express — документация', url: 'https://expressjs.com/ru/', kind: 'docs', source: 'docs' },
      { title: 'metanit.com — Node.js и Express', url: 'https://metanit.com/web/nodejs/', kind: 'tutorial', source: 'plan' },
    ],
    examRefs: ['m1-cabinet', 'm1-order'],
    prerequisites: ['js-modules', 'js-async'],
    estimatedMinutes: 50,
    planDays: ['day-15-1', 'day-15-2'],
    source: 'plan',
  },

  {
    id: 'express-params',
    title: 'Параметры запроса: params, query, body',
    tech: ['express'],
    monthNo: 4,
    weekNo: 15,
    importance: 'core',
    summary:
      'Данные приходят тремя путями: в адресе, в строке запроса и в теле. Всё это строки, и всё нужно проверять.',
    mustKnow: [
      'req.params — часть адреса',
      'req.query — после знака вопроса',
      'req.body — тело запроса',
      'Значения приходят строками',
      'Проверка перед использованием',
    ],
    theory: `## Три источника

\`\`\`js
// GET /api/applications/5
router.get('/:id', (req, res) => {
  req.params.id;      // '5' — строка!
});

// GET /api/admin/applications?status=Новая&page=2
router.get('/', (req, res) => {
  req.query.status;   // 'Новая'
  req.query.page;     // '2' — тоже строка
});

// POST с телом { "roomId": 2 }
router.post('/', (req, res) => {
  req.body.roomId;    // 2 (JSON сохраняет тип)
});
\`\`\`

## Всё, кроме тела, — строки

\`\`\`js
const id = Number(req.params.id);
if (!Number.isInteger(id) || id < 1) {
  return res.status(400).json({ error: 'Некорректный идентификатор' });
}
\`\`\`

Без проверки \`Number('abc')\` даст \`NaN\`, и запрос уйдёт в базу с мусором.

## Разбор параметров списка

\`\`\`js
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const perPage = Math.min(50, Math.max(1, Number(req.query.perPage) || 5));
  const status = typeof req.query.status === 'string' ? req.query.status : '';
  const ascending = req.query.order !== 'desc';
  …
});
\`\`\`

Ограничение \`perPage\` сверху — защита от запроса вида \`?perPage=1000000\`.

## Белый список для сортировки

Имя столбца нельзя подставлять в запрос из параметров — это инъекция:

\`\`\`js
const SORT_COLUMNS = {
  date: 'a.start_date',
  status: 'a.status',
  user: 'u.full_name',
};

const column = SORT_COLUMNS[req.query.sort] ?? 'a.start_date';
const direction = req.query.order === 'desc' ? 'DESC' : 'ASC';

const sql = \`SELECT … ORDER BY \${column} \${direction} LIMIT ? OFFSET ?\`;
\`\`\`

Здесь подстановка безопасна: значения берутся не из запроса, а из вашего объекта. Числа \`LIMIT\` и \`OFFSET\` всё равно передаются параметрами.

## Что откуда брать

| Данные | Где | Почему |
|---|---|---|
| Идентификатор записи | \`params\` | Часть адреса ресурса |
| Фильтр, сортировка, страница | \`query\` | Не меняют данные, удобно в ссылке |
| Новая запись, изменения | \`body\` | Может быть большим, не видно в адресе |
| Кто выполняет запрос | \`req.user\` из токена | Никогда не из body |

Последняя строка — правило безопасности: идентификатор текущего пользователя берётся только из проверенного токена.`,
    examples: [
      {
        title: 'Серверная пагинация с фильтром',
        language: 'javascript',
        code: `const SORT_COLUMNS = { date: 'a.start_date', status: 'a.status', user: 'u.full_name' };
const ALLOWED_STATUSES = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'];

router.get('/applications', requireAuth, requireAdmin, async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const perPage = Math.min(50, Math.max(1, Number(req.query.perPage) || 5));
  const offset = (page - 1) * perPage;

  const status = ALLOWED_STATUSES.includes(req.query.status) ? req.query.status : null;
  const column = SORT_COLUMNS[req.query.sort] ?? 'a.start_date';
  const direction = req.query.order === 'desc' ? 'DESC' : 'ASC';

  const where = status ? 'WHERE a.status = ?' : '';
  const params = status ? [status] : [];

  try {
    const [rows] = await pool.execute(
      \`SELECT a.id, u.full_name, r.title AS room, a.start_date, a.status
       FROM applications AS a
       JOIN users AS u ON u.id = a.user_id
       JOIN rooms AS r ON r.id = a.room_id
       \${where}
       ORDER BY \${column} \${direction}
       LIMIT ? OFFSET ?\`,
      [...params, String(perPage), String(offset)],
    );

    const [[{ total }]] = await pool.execute(
      \`SELECT COUNT(*) AS total FROM applications AS a \${where}\`,
      params,
    );

    res.json({ items: rows, page, perPage, total, totalPages: Math.max(1, Math.ceil(total / perPage)) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Не удалось загрузить заявки' });
  }
});`,
        explanation:
          'Статус и столбец сортировки проходят через белые списки, числа ограничены сверху, а значения передаются параметрами. Клиент получает и страницу данных, и общее число записей для пагинации.',
      },
    ],
    mistakes: [
      {
        title: 'Использовать req.params.id как число без проверки',
        why: 'Адрес /api/applications/abc даст NaN, и запрос уйдёт в базу с мусором.',
      },
      {
        title: 'Подставлять имя столбца из query напрямую',
        why: 'SQL-инъекция. Только через белый список.',
      },
      {
        title: 'Брать идентификатор пользователя из body',
        why: 'Клиент подставит чужой и получит доступ к чужим заявкам. Только из токена.',
      },
    ],
    quizId: 'quiz-express-params',
    taskIds: [],
    resources: [
      { title: 'Express: Request', url: 'https://expressjs.com/ru/4x/api.html#req', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m2-admin-tools', 'm3-quality'],
    prerequisites: ['express-basics'],
    estimatedMinutes: 45,
    planDays: ['day-15-2'],
    source: 'plan',
  },

  {
    id: 'express-proxy',
    title: 'Связь клиента и сервера: прокси и CORS',
    tech: ['express', 'react', 'tools'],
    monthNo: 4,
    weekNo: 15,
    importance: 'core',
    summary:
      'Клиент работает на порту 5173, сервер — на 3000. Браузер блокирует такие запросы. Прокси в Vite решает проблему без лишних пакетов.',
    mustKnow: [
      'Почему браузер блокирует запрос на другой порт',
      'Прокси в vite.config.ts',
      'Пакет cors как альтернатива',
      'Почему прокси предпочтительнее',
      'Проверка во вкладке Network',
    ],
    theory: `## Проблема

Страница открыта на \`http://localhost:5173\`, а запрос идёт на \`http://localhost:3000\`. Для браузера это разные источники, и он блокирует ответ:

\`\`\`text
Access to fetch at 'http://localhost:3000/api/rooms' from origin
'http://localhost:5173' has been blocked by CORS policy
\`\`\`

Это защита: иначе любой сайт мог бы дёргать чужие API от вашего имени.

## Решение 1: прокси в Vite (рекомендуется)

\`\`\`ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
\`\`\`

Теперь клиент запрашивает \`/api/rooms\` — с точки зрения браузера это тот же источник. Vite сам перенаправляет запрос на сервер.

Плюсы: не нужен дополнительный пакет, в коде нет абсолютных адресов, при сборке ничего не меняется.

\`\`\`js
// в коде клиента просто
fetch('/api/rooms');
\`\`\`

## Решение 2: пакет cors

\`\`\`js
import cors from 'cors';

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
\`\`\`

Работает, но требует установки пакета (на экзамене его может не оказаться) и в коде остаются абсолютные адреса.

\`app.use(cors())\` без параметров разрешает запросы отовсюду — для учебного проекта приемлемо, но лучше указать источник явно.

## Что выбрать на экзамене

Прокси в Vite: одна настройка, ноль зависимостей. Если по каким-то причинам прокси не работает — \`cors\` как запасной вариант. Учебная программа предлагает именно такой порядок.

## Проверка

DevTools → Network → фильтр Fetch/XHR. Запрос должен идти на \`/api/...\` и возвращать 200. Если видите адрес \`localhost:3000\` — прокси не подключился (обычно нужно перезапустить Vite после правки конфигурации).

## Два терминала

На экзамене приложение запускается двумя командами:

\`\`\`bash
# терминал 1
cd server && node --watch index.js

# терминал 2
cd client && npm run dev
\`\`\`

В VS Code удобно открыть два терминала кнопкой «+» — программа советует потренировать это заранее.`,
    examples: [
      {
        title: 'Конфигурация Vite с прокси',
        language: 'typescript',
        code: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Все запросы, начинающиеся с /api, уходят на сервер Express
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});`,
        explanation:
          'После этой настройки в коде клиента используются только относительные адреса — и в разработке, и в собранном виде.',
      },
    ],
    mistakes: [
      {
        title: 'Абсолютные адреса в коде клиента',
        wrong: "fetch('http://localhost:3000/api/rooms')",
        right: "fetch('/api/rooms')",
        why: 'При сборке или смене порта придётся править все запросы.',
      },
      {
        title: 'Не перезапустить Vite после правки конфигурации',
        why: 'vite.config.ts читается при старте. Без перезапуска прокси не появится.',
      },
    ],
    quizId: 'quiz-express-proxy',
    taskIds: [],
    resources: [
      { title: 'Vite: server.proxy', url: 'https://vitejs.dev/config/server-options.html#server-proxy', kind: 'docs', source: 'docs' },
      { title: 'MDN: CORS', url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/CORS', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m3-framework'],
    prerequisites: ['express-basics', 'js-fetch'],
    estimatedMinutes: 35,
    planDays: ['day-15-3'],
    source: 'plan',
  },

  {
    id: 'express-mysql',
    title: 'Подключение к MySQL: пул и параметры',
    tech: ['express', 'sql', 'security'],
    monthNo: 4,
    weekNo: 15,
    importance: 'core',
    summary:
      'Пакет mysql2 связывает Express с базой. Пул соединений и параметризованные запросы — обязательный минимум, без которого приложение небезопасно.',
    mustKnow: [
      'mysql2/promise и createPool',
      'pool.execute с параметрами',
      'Формат результата: [rows, fields]',
      'Почему пул, а не одиночное соединение',
      'Настройки: dateStrings, charset',
    ],
    theory: `## Подключение

\`\`\`js
// db.js
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'ваш_пароль',
  database: 'conference',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  dateStrings: true,      // даты приходят строками 'ГГГГ-ММ-ДД'
});
\`\`\`

Используйте \`mysql2/promise\`, а не \`mysql2\`: с обещаниями работает \`await\`, и код читается линейно.

**Пул** держит несколько готовых соединений и выдаёт их по мере надобности. Одиночное соединение обрывается при простое, и приложение падает на первом же запросе после паузы.

**\`dateStrings: true\`** избавляет от классической проблемы: без него столбцы \`DATE\` превращаются в объекты \`Date\` и «уезжают» на день из-за часового пояса.

## Запросы

\`\`\`js
const [rows] = await pool.execute('SELECT * FROM rooms');
const [rows] = await pool.execute('SELECT * FROM users WHERE login = ?', [login]);
const [result] = await pool.execute('INSERT INTO rooms (title) VALUES (?)', ['Холл']);

result.insertId;       // id созданной записи
result.affectedRows;   // сколько строк затронуто
\`\`\`

Результат — массив из двух элементов: строки и описание столбцов. Обычно берут только первый через деструктуризацию.

## execute или query

\`execute\` использует подготовленные выражения: запрос и данные уходят в базу отдельно. Это и безопаснее, и быстрее при повторах.

\`query\` подставляет значения на стороне драйвера. Работает, но \`execute\` — правильный выбор по умолчанию.

## Параметры обязательны

\`\`\`js
// НЕЛЬЗЯ
await pool.query(\`SELECT * FROM users WHERE login = '\${login}'\`);

// НУЖНО
await pool.execute('SELECT * FROM users WHERE login = ?', [login]);
\`\`\`

Знак \`?\` подставляет только **значение**, не часть команды. Имена таблиц и столбцов так подставить нельзя — для них нужен белый список.

## Обработка ошибок

\`\`\`js
try {
  const [rows] = await pool.execute('SELECT * FROM rooms');
  res.json(rows);
} catch (error) {
  console.error(error);                                     // подробности в лог
  res.status(500).json({ error: 'Не удалось загрузить помещения' });  // пользователю — понятно
}
\`\`\`

Техническую ошибку базы клиенту показывать нельзя: она раскрывает структуру таблиц. Это прямое требование к качеству кода.

## Пароль в коде

На учебном проекте пароль обычно пишут прямо в \`db.js\`. Правильнее вынести в переменные окружения и добавить \`.env\` в \`.gitignore\`:

\`\`\`js
password: process.env.DB_PASSWORD ?? '',
\`\`\`

Если на экзамене нет времени — хотя бы не коммитьте настоящий пароль от рабочей машины.`,
    examples: [
      {
        title: 'Маршрут списка помещений',
        language: 'javascript',
        code: `// db.js
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: 'conference',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  dateStrings: true,
});

// routes/rooms.js
import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, title FROM rooms ORDER BY title');
    res.json(rows);
  } catch (error) {
    console.error('Ошибка загрузки помещений:', error);
    res.status(500).json({ error: 'Не удалось загрузить помещения' });
  }
});

export default router;`,
        explanation:
          'Справочник помещений отдаётся клиенту для выпадающего списка — это требование модуля 2 про раскрывающиеся списки.',
      },
    ],
    mistakes: [
      {
        title: 'Склейка SQL из строк',
        why: 'SQL-инъекция. Всегда pool.execute с параметрами.',
      },
      {
        title: 'Одиночное соединение вместо пула',
        why: 'Соединение обрывается при простое, и приложение падает. Пул переподключается сам.',
      },
      {
        title: 'Показывать ошибку базы пользователю',
        why: 'Раскрывает структуру таблиц и выглядит непрофессионально. В лог — подробности, пользователю — понятный текст.',
      },
    ],
    quizId: 'quiz-express-mysql',
    taskIds: [],
    resources: [
      { title: 'mysql2 — документация', url: 'https://sidorares.github.io/node-mysql2/docs', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m1-db', 'm3-quality'],
    prerequisites: ['express-basics', 'sql-select'],
    estimatedMinutes: 50,
    planDays: ['day-15-4'],
    source: 'plan',
  },

  {
    id: 'api-design',
    title: 'Проектирование API проекта',
    tech: ['express'],
    monthNo: 4,
    weekNo: 15,
    importance: 'core',
    summary:
      'Список маршрутов — это план работы над сервером. Программа предлагает составить его и принести на проверку: продуманный API экономит время на экзамене.',
    mustKnow: [
      'Соответствие метода и действия',
      'Имена ресурсов во множественном числе',
      'Разделение публичных, защищённых и админских маршрутов',
      'Единый формат ответа и ошибки',
      'Описание API в README',
    ],
    theory: `## Принципы

**Метод описывает действие:**

| Метод | Действие |
|---|---|
| GET | Получить данные |
| POST | Создать |
| PATCH | Изменить часть |
| PUT | Заменить целиком |
| DELETE | Удалить |

**Адрес описывает ресурс**, а не действие: \`/api/applications\`, а не \`/api/getApplications\`.

## API проекта «Конференции.РФ»

\`\`\`text
Публичные
POST   /api/register                  регистрация
POST   /api/login                     вход
GET    /api/rooms                     справочник помещений
GET    /api/payment-methods           справочник способов оплаты

Требуют входа
GET    /api/applications/my           мои заявки
POST   /api/applications              создать заявку
POST   /api/applications/:id/review   оставить отзыв

Только администратор
GET    /api/admin/applications        все заявки (фильтр, сортировка, страницы)
PATCH  /api/admin/applications/:id    сменить статус
\`\`\`

Девять маршрутов закрывают все требования задания. Этот список стоит выучить наизусть: на экзамене он пишется по памяти.

## Единый формат ошибки

\`\`\`js
res.status(400).json({ error: 'Заполните все поля' });
res.status(400).json({ errors: { login: 'Логин занят' } });   // ошибки по полям
\`\`\`

Одинаковый формат позволяет обрабатывать ошибки в одном месте клиента — например, в классе \`ApiClient\`.

## Коды ответа

| Код | Когда |
|---|---|
| 200 | Успех |
| 201 | Создано (регистрация, новая заявка) |
| 400 | Не прошла валидация |
| 401 | Нет токена или он неверный |
| 403 | Токен есть, но прав не хватает |
| 404 | Ресурс не найден |
| 409 | Конфликт (логин занят) |
| 500 | Ошибка сервера |

Разные коды позволяют клиенту показать разные сообщения — это и есть «информативные уведомления» из задания.

## Что отдавать клиенту

\`\`\`js
// НЕЛЬЗЯ
res.json(user);                    // вместе с password_hash

// НУЖНО
const { password_hash, ...publicUser } = user;
res.json(publicUser);
\`\`\`

Или сразу перечислять столбцы в \`SELECT\`.

## Описание в README

Учебная программа просит описать маршруты в \`README.md\`. Достаточно таблицы: метод, адрес, что делает, кто имеет доступ. Проверяющий сразу видит структуру приложения, и это работает на оценку качества.`,
    examples: [
      {
        title: 'Описание API в README',
        language: 'text',
        code: `## API

| Метод | Адрес | Описание | Доступ |
|---|---|---|---|
| POST | /api/register | Регистрация нового пользователя | Все |
| POST | /api/login | Вход, возвращает токен | Все |
| GET | /api/rooms | Справочник помещений | Все |
| GET | /api/payment-methods | Справочник способов оплаты | Все |
| GET | /api/applications/my | Заявки текущего пользователя | Вошедшие |
| POST | /api/applications | Создать заявку (статус «Новая») | Вошедшие |
| POST | /api/applications/:id/review | Отзыв (только если статус не «Новая») | Владелец заявки |
| GET | /api/admin/applications | Все заявки: фильтр, сортировка, страницы | Администратор |
| PATCH | /api/admin/applications/:id | Смена статуса | Администратор |

Ошибки возвращаются в формате { "error": "текст" }
или { "errors": { "поле": "текст" } } для ошибок валидации.`,
      },
    ],
    mistakes: [
      {
        title: 'Действие в адресе',
        wrong: 'POST /api/changeStatus',
        right: 'PATCH /api/admin/applications/5',
        why: 'Действие описывает метод. Адрес — это ресурс.',
      },
      {
        title: 'Отдавать пользователя вместе с хешем пароля',
        why: 'Утечка данных. Перечисляйте столбцы явно или убирайте поле перед ответом.',
      },
      {
        title: 'Один код 200 на все случаи',
        why: 'Клиент не может различить «логин занят» и «сервер упал» — значит, не покажет нужное сообщение.',
      },
    ],
    quizId: 'quiz-api-design',
    taskIds: [],
    resources: [
      { title: 'MDN: методы HTTP', url: 'https://developer.mozilla.org/ru/docs/Web/HTTP/Methods', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m1-register', 'm1-login', 'm1-admin'],
    prerequisites: ['express-params'],
    estimatedMinutes: 45,
    planDays: ['day-15-5'],
    source: 'plan',
  },

  {
    id: 'server-validation',
    title: 'Валидация на сервере',
    tech: ['express', 'security'],
    monthNo: 4,
    weekNo: 15,
    importance: 'core',
    summary:
      'Фронтенду доверять нельзя: запрос можно отправить в обход формы. Все правила задания проверяются на сервере повторно.',
    mustKnow: [
      'Почему клиентской проверки недостаточно',
      'Те же правила: логин, пароль, обязательные поля',
      'Ошибки по полям в ответе',
      'Проверка принадлежности записи',
      'Белые списки допустимых значений',
    ],
    theory: `## Почему обязательно

Форму можно обойти за десять секунд — достаточно отправить запрос из консоли браузера:

\`\`\`js
fetch('/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ login: 'a', password: '1' }),
});
\`\`\`

Если сервер не проверяет данные, в базе окажется пользователь с логином из одного символа. Критерий «высокое качество программного кода» включает серверную валидацию напрямую.

## Те же правила

\`\`\`js
const LOGIN_PATTERN = /^[A-Za-z0-9]{6,}$/;

function validateRegister(body) {
  const errors = {};
  const login = String(body.login ?? '').trim();
  const password = String(body.password ?? '');
  const fullName = String(body.fullName ?? '').trim();

  if (!login) errors.login = 'Введите логин';
  else if (!LOGIN_PATTERN.test(login)) errors.login = 'Только латинские буквы и цифры, минимум 6 символов';

  if (!password) errors.password = 'Введите пароль';
  else if (password.length < 8) errors.password = 'Пароль не короче 8 символов';

  if (!fullName) errors.fullName = 'Укажите ФИО';
  if (!String(body.phone ?? '').trim()) errors.phone = 'Укажите телефон';
  if (!String(body.email ?? '').trim()) errors.email = 'Укажите e-mail';

  return errors;
}
\`\`\`

Приведение через \`String(... ?? '')\` защищает от случая, когда клиент прислал число, \`null\` или вообще ничего.

## Ответ с ошибками

\`\`\`js
const errors = validateRegister(req.body);
if (Object.keys(errors).length) {
  return res.status(400).json({ errors });
}
\`\`\`

Клиент разложит объект по полям и покажет подсказки рядом с ними — как требует модуль 2.

## Проверка уникальности

\`\`\`js
const [existing] = await pool.execute('SELECT id FROM users WHERE login = ?', [login]);
if (existing.length) {
  return res.status(409).json({ errors: { login: 'Такой логин уже занят' } });
}
\`\`\`

Код 409 («конфликт») отличает эту ситуацию от обычной ошибки валидации.

## Проверки бизнес-правил

Валидация — это не только формат полей. Правила задания тоже проверяются на сервере:

\`\`\`js
// Отзыв только к своей заявке и только после смены статуса
const [rows] = await pool.execute(
  'SELECT status FROM applications WHERE id = ? AND user_id = ?',
  [applicationId, req.user.id],
);

if (!rows.length) return res.status(404).json({ error: 'Заявка не найдена' });
if (rows[0].status === 'Новая') {
  return res.status(400).json({ error: 'Отзыв можно оставить после изменения статуса' });
}
\`\`\`

Условие \`AND user_id = ?\` одновременно решает две задачи: находит заявку и проверяет, что она принадлежит текущему пользователю.

## Белые списки

\`\`\`js
const ALLOWED_STATUSES = ['Мероприятие назначено', 'Мероприятие завершено'];
if (!ALLOWED_STATUSES.includes(status)) {
  return res.status(400).json({ error: 'Недопустимый статус' });
}
\`\`\`

Проверять существование помещения и способа оплаты тоже стоит — иначе внешний ключ выбросит ошибку базы вместо понятного сообщения.`,
    examples: [
      {
        title: 'Регистрация с полной проверкой',
        language: 'javascript',
        code: `router.post('/register', async (req, res) => {
  const errors = validateRegister(req.body);
  if (Object.keys(errors).length) {
    return res.status(400).json({ errors });
  }

  const login = String(req.body.login).trim();

  try {
    const [existing] = await pool.execute('SELECT id FROM users WHERE login = ?', [login]);
    if (existing.length) {
      return res.status(409).json({ errors: { login: 'Такой логин уже занят' } });
    }

    const hash = await bcrypt.hash(req.body.password, 10);

    const [result] = await pool.execute(
      \`INSERT INTO users (login, password_hash, full_name, phone, email)
       VALUES (?, ?, ?, ?, ?)\`,
      [login, hash, req.body.fullName.trim(), req.body.phone.trim(), req.body.email.trim()],
    );

    res.status(201).json({ id: result.insertId, login });
  } catch (error) {
    // На случай гонки: UNIQUE в базе — последний рубеж
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ errors: { login: 'Такой логин уже занят' } });
    }
    console.error(error);
    res.status(500).json({ error: 'Не удалось зарегистрировать пользователя' });
  }
});`,
        explanation:
          'Проверка уникальности сделана дважды: запросом и ограничением базы. Между проверкой и вставкой может вклиниться другой запрос — UNIQUE закрывает эту щель.',
      },
    ],
    mistakes: [
      {
        title: 'Проверять только на клиенте',
        why: 'Запрос отправляется в обход формы за десять секунд. Это прямое нарушение требований к качеству кода.',
      },
      {
        title: 'Возвращать один общий текст ошибки',
        why: 'Клиент не сможет показать подсказку у нужного поля — требование модуля 2 не выполнено.',
      },
      {
        title: 'Не проверять принадлежность записи',
        why: 'Пользователь сможет оставить отзыв к чужой заявке, подставив другой id.',
      },
    ],
    quizId: 'quiz-server-validation',
    taskIds: ['task-server-validation', 'task-fs-register-flow', 'task-sec-sql-params'],
    projectIds: ['project-06-hardening'],
    resources: [],
    examRefs: ['m1-register', 'm2-cabinet-ux', 'm3-quality'],
    prerequisites: ['express-mysql', 'js-validation'],
    estimatedMinutes: 50,
    planDays: ['day-15-6'],
    source: 'plan',
  },

  {
    id: 'auth-hashing',
    title: 'Хеширование пароля через bcrypt',
    tech: ['security', 'node'],
    monthNo: 4,
    weekNo: 16,
    importance: 'core',
    summary:
      'Пароль нельзя хранить в открытом виде. bcrypt превращает его в хеш, который нельзя обратить, но можно сравнить с введённым.',
    mustKnow: [
      'Почему пароль не хранят открытым',
      'bcrypt.hash и bcrypt.compare',
      'Что такое соль и почему хеши разные',
      'Число раундов',
      'Хеш администратора в seed-скрипте',
    ],
    theory: `## Почему

Если база утечёт, открытые пароли раскроют не только ваш сервис: люди используют один пароль в разных местах. Хранение хеша — базовое требование безопасности и один из пунктов качества кода.

## Как это работает

\`\`\`js
import bcrypt from 'bcryptjs';

const hash = await bcrypt.hash('Demo20', 10);
// '$2a$10$N9qo8uLOickgx2ZMRZoMy...'

const ok = await bcrypt.compare('Demo20', hash);   // true
const bad = await bcrypt.compare('другой', hash);  // false
\`\`\`

Хеш нельзя превратить обратно в пароль. Проверка работает иначе: введённый пароль хешируется тем же способом и сравнивается с сохранённым.

## Соль

Каждый вызов \`hash\` даёт **разный** результат для одного и того же пароля:

\`\`\`js
await bcrypt.hash('Demo20', 10);   // $2a$10$abc...
await bcrypt.hash('Demo20', 10);   // $2a$10$xyz...  — другой!
\`\`\`

Это не ошибка: bcrypt добавляет случайную «соль» и сохраняет её внутри хеша. Благодаря этому одинаковые пароли выглядят по-разному, и заранее посчитанные таблицы хешей бесполезны.

Отсюда следствие: **сравнивать хеши напрямую нельзя**, только через \`compare\`.

## Число раундов

Второй аргумент — сложность. 10 означает 2¹⁰ итераций. Чем больше, тем медленнее подбор — и тем медленнее вход.

10 — разумный баланс и значение по умолчанию для учебного проекта.

## bcryptjs или bcrypt

\`bcrypt\` требует компиляции при установке, \`bcryptjs\` — чистый JavaScript. Учебная программа выбирает \`bcryptjs\`: он ставится без сборочных инструментов, что важно на экзаменационной машине.

## Длина поля

\`\`\`sql
password_hash VARCHAR(255) NOT NULL
\`\`\`

bcrypt даёт 60 символов, но 255 — запас на случай смены алгоритма.

## Администратор из задания

Задание требует администратора с логином \`Admin26\` и паролем \`Demo20\`. Хеш нельзя придумать руками — его нужно получить:

\`\`\`js
// seed.js
const hash = await bcrypt.hash('Demo20', 10);
await pool.execute(
  \`INSERT INTO users (login, password_hash, full_name, phone, email, role)
   VALUES (?, ?, 'Администратор', '+7 000 000-00-00', 'admin@example.com', 'admin')\`,
  ['Admin26', hash],
);
\`\`\`

Запускается один раз: \`node seed.js\`. Логин и пароль пишутся дословно, как в задании.`,
    examples: [
      {
        title: 'Seed-скрипт администратора',
        language: 'javascript',
        code: `// server/seed.js
import bcrypt from 'bcryptjs';
import { pool } from './db.js';

const ADMIN_LOGIN = 'Admin26';       // дословно из задания
const ADMIN_PASSWORD = 'Demo20';     // дословно из задания

async function seed() {
  const [existing] = await pool.execute('SELECT id FROM users WHERE login = ?', [ADMIN_LOGIN]);

  if (existing.length) {
    console.log('Администратор уже существует');
    await pool.end();
    return;
  }

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await pool.execute(
    \`INSERT INTO users (login, password_hash, full_name, phone, email, role)
     VALUES (?, ?, ?, ?, ?, 'admin')\`,
    [ADMIN_LOGIN, hash, 'Администратор', '+7 000 000-00-00', 'admin@example.com'],
  );

  console.log('Администратор создан:', ADMIN_LOGIN);
  await pool.end();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});`,
        explanation:
          'Проверка «уже существует» позволяет запускать скрипт сколько угодно раз. Логин и пароль взяты из задания буква в букву — это проверяют.',
      },
    ],
    mistakes: [
      {
        title: 'Сравнивать хеши напрямую',
        wrong: 'if (hash === await bcrypt.hash(password, 10))',
        right: 'if (await bcrypt.compare(password, hash))',
        why: 'Из-за соли каждый хеш уникален. Прямое сравнение всегда даст false.',
      },
      {
        title: 'Вписать хеш в SQL руками',
        why: 'Нужен хеш именно от вашей библиотеки. Получайте его скриптом.',
      },
      {
        title: 'Забыть await',
        why: 'bcrypt.hash возвращает обещание. Без await в базу попадёт [object Promise].',
      },
    ],
    quizId: 'quiz-auth-hashing',
    taskIds: ['task-auth-hashing'],
    resources: [
      { title: 'bcryptjs — npm', url: 'https://www.npmjs.com/package/bcryptjs', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m1-register', 'm1-admin', 'm3-quality'],
    prerequisites: ['server-validation'],
    estimatedMinutes: 40,
    planDays: ['day-16-1', 'day-16-2'],
    source: 'plan',
  },

  {
    id: 'auth-jwt',
    title: 'JWT: токен входа',
    tech: ['security', 'node'],
    monthNo: 4,
    weekNo: 16,
    importance: 'core',
    summary:
      'После входа сервер выдаёт подписанный токен. Клиент прикладывает его к каждому запросу, а сервер по подписи понимает, кто обращается.',
    mustKnow: [
      'Из чего состоит JWT',
      'jwt.sign и jwt.verify',
      'Что класть в токен, а что нельзя',
      'Срок жизни токена',
      'Заголовок Authorization: Bearer',
    ],
    theory: `## Как устроен токен

JWT — это три части через точку: заголовок, данные и подпись.

\`\`\`text
eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIn0.xR2s...
\`\`\`

**Важно понимать:** первые две части просто закодированы Base64 — их может прочитать кто угодно. Токен не скрывает данные, он **подтверждает их подлинность**: без секретного ключа подпись не подделать.

Отсюда правило: в токен нельзя класть ничего секретного. Идентификатор и роль — можно, пароль или личные данные — нельзя.

## Выдача

\`\`\`js
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET ?? 'change-me';

const token = jwt.sign(
  { id: user.id, role: user.role },
  SECRET,
  { expiresIn: '7d' },
);
\`\`\`

## Проверка

\`\`\`js
try {
  const payload = jwt.verify(token, SECRET);
  // payload.id, payload.role
} catch {
  // токен подделан или просрочен
}
\`\`\`

## Маршрут входа

\`\`\`js
router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ error: 'Введите логин и пароль' });
  }

  const [rows] = await pool.execute('SELECT * FROM users WHERE login = ?', [login]);
  const user = rows[0];

  // Одинаковый ответ для обоих случаев — иначе форму можно использовать
  // для перебора существующих логинов
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Неверный логин или пароль' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '7d' });

  res.json({
    token,
    user: { id: user.id, login: user.login, fullName: user.full_name, role: user.role },
  });
});
\`\`\`

Обратите внимание: в ответе нет \`password_hash\`. Поля перечислены явно.

## Заголовок

\`\`\`js
fetch('/api/applications/my', {
  headers: { Authorization: \`Bearer \${token}\` },
});
\`\`\`

Формат \`Bearer <токен>\` — стандартный.

## Срок жизни

\`expiresIn: '7d'\` — неделя. Для учебного проекта нормально. Чем короче срок, тем безопаснее, но тем чаще нужно входить заново.

## Где хранить на клиенте

\`localStorage\` — простой и понятный вариант, который предлагает учебная программа. Его минус: при XSS-уязвимости чужой скрипт прочитает токен. Отсюда важность правила «не вставлять пользовательский текст через innerHTML».

Более защищённый вариант — httpOnly-cookie, но он требует настройки CORS с \`credentials\` и защиты от CSRF. Для экзамена \`localStorage\` достаточно.`,
    examples: [
      {
        title: 'Полный маршрут входа',
        language: 'javascript',
        code: `import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();
const SECRET = process.env.JWT_SECRET ?? 'change-me-in-production';

router.post('/login', async (req, res) => {
  const login = String(req.body.login ?? '').trim();
  const password = String(req.body.password ?? '');

  if (!login || !password) {
    return res.status(400).json({ error: 'Введите логин и пароль' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, login, password_hash, full_name, role FROM users WHERE login = ?',
      [login],
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, login: user.login, fullName: user.full_name, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка входа' });
  }
});

export default router;`,
      },
    ],
    mistakes: [
      {
        title: 'Класть пароль в токен',
        why: 'Содержимое токена читается без ключа. Только id и роль.',
      },
      {
        title: 'Разные сообщения для неверного логина и пароля',
        why: 'Форма превращается в инструмент перебора логинов. Ответ должен быть одинаковым.',
      },
      {
        title: 'Секрет прямо в коде репозитория',
        why: 'Зная секрет, можно подписать токен администратора. Секрет — в переменных окружения.',
      },
    ],
    quizId: 'quiz-auth-jwt',
    taskIds: ['task-auth-jwt'],
    resources: [
      { title: 'jsonwebtoken — npm', url: 'https://www.npmjs.com/package/jsonwebtoken', kind: 'docs', source: 'docs' },
      { title: 'jwt.io — разбор токена', url: 'https://jwt.io/', kind: 'reference', source: 'docs' },
    ],
    examRefs: ['m1-login', 'm1-admin'],
    prerequisites: ['auth-hashing'],
    estimatedMinutes: 50,
    planDays: ['day-16-3'],
    source: 'plan',
  },

  {
    id: 'auth-middleware',
    title: 'Middleware: проверка токена',
    tech: ['express', 'security'],
    monthNo: 4,
    weekNo: 16,
    importance: 'core',
    summary:
      'Middleware — функция, которая выполняется до обработчика. Проверка токена пишется один раз и подключается ко всем защищённым маршрутам.',
    mustKnow: [
      'Сигнатура (req, res, next)',
      'Извлечение токена из заголовка',
      'Передача данных через req.user',
      'next() и ранний ответ',
      'Подключение к маршруту или группе',
    ],
    theory: `## Что это

Middleware — функция с тремя параметрами, которая выполняется перед обработчиком. Она может пропустить запрос дальше (\`next()\`) или ответить сама.

\`\`\`js
export function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Требуется вход' });
  }

  try {
    const payload = jwt.verify(token, SECRET);
    req.user = { id: payload.id, role: payload.role };   // данные для обработчика
    next();                                               // пропускаем дальше
  } catch {
    return res.status(401).json({ error: 'Сессия истекла, войдите снова' });
  }
}
\`\`\`

Ключевые моменты:

- \`next()\` передаёт управление дальше;
- \`return\` перед \`res.status()\` обязателен, иначе выполнение продолжится;
- \`req.user\` — способ передать данные обработчику.

## Проверка роли

\`\`\`js
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Доступ только для администратора' });
  }
  next();
}
\`\`\`

Разница кодов важна: **401** — «я не знаю, кто вы», **403** — «я знаю, но вам сюда нельзя».

## Подключение

\`\`\`js
// одному маршруту
router.get('/my', requireAuth, async (req, res) => {
  const [rows] = await pool.execute(
    'SELECT * FROM applications WHERE user_id = ?',
    [req.user.id],           // идентификатор из токена, не из запроса
  );
  res.json(rows);
});

// цепочка: сначала вход, потом роль
router.patch('/applications/:id', requireAuth, requireAdmin, async (req, res) => { … });

// всей группе маршрутов
app.use('/api/admin', requireAuth, requireAdmin, adminRouter);
\`\`\`

Последний вариант удобнее всего: ни один админский маршрут нельзя случайно оставить без защиты.

## Почему это важно

Пользователь видит только свои заявки не потому, что клиент так нарисовал, а потому что запрос содержит \`WHERE user_id = ?\` со значением из **проверенного токена**. Подменить его нельзя, не зная секрета.

Это и есть настоящая защита, о которой говорит критерий качества кода. Скрытая кнопка в интерфейсе — только удобство.

## Общий обработчик ошибок

\`\`\`js
// в самом конце index.js, после всех маршрутов
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});
\`\`\`

Middleware с четырьмя параметрами Express считает обработчиком ошибок. Он ловит то, что не поймали маршруты, и не даёт серверу упасть.`,
    examples: [
      {
        title: 'Middleware и защищённые маршруты',
        language: 'javascript',
        code: `// middleware/auth.js
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET ?? 'change-me';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: 'Требуется вход' });

  try {
    const payload = jwt.verify(token, SECRET);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ error: 'Сессия истекла, войдите снова' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Доступ только для администратора' });
  }
  next();
}

// index.js
app.use('/api', publicRouter);                                   // регистрация, вход, справочники
app.use('/api/applications', requireAuth, applicationsRouter);   // требуют входа
app.use('/api/admin', requireAuth, requireAdmin, adminRouter);   // только администратор`,
        explanation:
          'Защита подключается один раз к группе маршрутов. Добавляя новый админский маршрут, вы не можете забыть проверку — она уже стоит на уровне группы.',
      },
    ],
    mistakes: [
      {
        title: 'Забыть next()',
        why: 'Запрос зависнет: обработчик так и не выполнится, ответа не будет.',
      },
      {
        title: 'Проверять роль только на клиенте',
        why: 'Запрос к /api/admin/... можно отправить напрямую. Без middleware данные всех пользователей открыты.',
      },
      {
        title: 'Брать id пользователя из тела запроса',
        wrong: 'WHERE user_id = ?, [req.body.userId]',
        right: 'WHERE user_id = ?, [req.user.id]',
        why: 'Клиент подставит чужой идентификатор и увидит чужие заявки.',
      },
    ],
    quizId: 'quiz-auth-middleware',
    taskIds: ['task-auth-middleware', 'task-exam-auth-middleware-speed'],
    resources: [
      { title: 'Express: middleware', url: 'https://expressjs.com/ru/guide/using-middleware.html', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m1-admin', 'm1-cabinet', 'm3-quality'],
    prerequisites: ['auth-jwt'],
    estimatedMinutes: 50,
    planDays: ['day-16-4'],
    source: 'plan',
  },

  {
    id: 'auth-roles',
    title: 'Роли и разграничение доступа',
    tech: ['security', 'express'],
    monthNo: 4,
    weekNo: 16,
    importance: 'core',
    summary:
      'В системе две роли: пользователь и администратор. Разграничение доступа должно работать на каждом уровне — от кнопки до SQL-запроса.',
    mustKnow: [
      'Поле role в таблице пользователей',
      'Три уровня доступа: гость, пользователь, администратор',
      'Роль в токене, а не в localStorage',
      'Проверка «это твоя запись»',
      'Что доступно обычному пользователю, а что только админу',
    ],
    theory: `## Роли проекта

\`\`\`sql
role VARCHAR(10) NOT NULL DEFAULT 'user'
\`\`\`

Два значения: \`user\` и \`admin\`. Администратор создаётся seed-скриптом с логином \`Admin26\` — задание не предполагает регистрации новых администраторов через форму.

## Матрица доступа

| Действие | Гость | Пользователь | Администратор |
|---|---|---|---|
| Регистрация, вход | ✓ | | |
| Справочники | ✓ | ✓ | ✓ |
| Создать заявку | | ✓ | ✓ |
| Свои заявки | | ✓ | ✓ |
| Отзыв к своей заявке | | ✓ | ✓ |
| Все заявки | | | ✓ |
| Сменить статус | | | ✓ |

Такую таблицу полезно нарисовать до написания кода: она сразу показывает, какие маршруты нужны и какую защиту к ним поставить.

## Три уровня проверки

**1. Интерфейс** — прячем то, чем нельзя пользоваться:

\`\`\`tsx
{user?.role === 'admin' && <NavLink to="/admin">Админка</NavLink>}
\`\`\`

**2. Маршрут клиента** — не пускаем на страницу:

\`\`\`tsx
<Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
\`\`\`

**3. Сервер** — единственная настоящая защита:

\`\`\`js
app.use('/api/admin', requireAuth, requireAdmin, adminRouter);
\`\`\`

Первые два уровня — удобство. Третий — безопасность. На экзамене нужны все три: проверяющий смотрит и на интерфейс, и на сервер.

## Роль из токена

\`\`\`js
// правильно: роль внутри подписанного токена
const payload = jwt.verify(token, SECRET);
req.user = { id: payload.id, role: payload.role };
\`\`\`

Значение \`role\` в \`localStorage\` меняется через DevTools за пять секунд. Внутри токена — не меняется: подпись перестанет сходиться.

## «Это твоя запись»

Даже вошедший пользователь не должен трогать чужие данные:

\`\`\`js
const [rows] = await pool.execute(
  'SELECT * FROM applications WHERE id = ? AND user_id = ?',
  [id, req.user.id],
);

if (!rows.length) {
  return res.status(404).json({ error: 'Заявка не найдена' });
}
\`\`\`

Ответ 404 вместо 403 здесь осознанный: он не сообщает, существует ли чужая заявка вообще.

## Типичная дыра

\`\`\`js
// маршрут защищён входом, но не проверяет владельца
router.post('/applications/:id/review', requireAuth, async (req, res) => {
  await pool.execute('INSERT INTO reviews (application_id, text) VALUES (?, ?)',
    [req.params.id, req.body.text]);   // чужая заявка? да пожалуйста
});
\`\`\`

Вход проверен, а принадлежность — нет. Любой пользователь может оставить отзыв к чужой заявке. Такие ошибки ищут в критерии «высокое качество программного кода».`,
    examples: [
      {
        title: 'Отзыв с полной проверкой прав',
        language: 'javascript',
        code: `router.post('/applications/:id/review', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const text = String(req.body.text ?? '').trim();

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Некорректный идентификатор' });
  }
  if (!text) {
    return res.status(400).json({ error: 'Введите текст отзыва' });
  }

  try {
    // Заявка должна существовать И принадлежать текущему пользователю
    const [rows] = await pool.execute(
      'SELECT status FROM applications WHERE id = ? AND user_id = ?',
      [id, req.user.id],
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    // Требование модуля 2: отзыв только после смены статуса
    if (rows[0].status === 'Новая') {
      return res.status(400).json({ error: 'Отзыв можно оставить после изменения статуса администратором' });
    }

    const [existing] = await pool.execute('SELECT id FROM reviews WHERE application_id = ?', [id]);
    if (existing.length) {
      return res.status(409).json({ error: 'Отзыв к этой заявке уже оставлен' });
    }

    await pool.execute('INSERT INTO reviews (application_id, text) VALUES (?, ?)', [id, text]);
    res.status(201).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Не удалось сохранить отзыв' });
  }
});`,
        explanation:
          'Четыре проверки: корректность данных, принадлежность заявки, статус и отсутствие дубликата. Каждая закрывает конкретное требование задания.',
      },
    ],
    mistakes: [
      {
        title: 'Роль из localStorage',
        why: 'Правится вручную за пять секунд. Роль живёт в подписанном токене.',
      },
      {
        title: 'Проверять вход, но не владельца',
        why: 'Любой пользователь сможет работать с чужими заявками, подставив другой id.',
      },
      {
        title: 'Регистрация с возможностью выбрать роль',
        why: 'Если поле role приходит из формы, любой зарегистрируется администратором. Роль ставит только сервер.',
      },
    ],
    quizId: 'quiz-auth-roles',
    taskIds: ['task-auth-roles', 'task-sec-ownership'],
    projectIds: ['project-06-hardening'],
    resources: [],
    examRefs: ['m1-admin', 'm2-cabinet-ux', 'm3-quality'],
    prerequisites: ['auth-middleware'],
    estimatedMinutes: 50,
    planDays: ['day-16-5'],
    source: 'plan',
  },

  {
    id: 'server-architecture',
    title: 'ООП на сервере: репозиторий заявок',
    tech: ['express', 'ts'],
    monthNo: 4,
    weekNo: 16,
    importance: 'supporting',
    summary:
      'Задание требует ООП. Класс-репозиторий собирает весь SQL по заявкам в одном месте, а маршруты становятся тонкими и читаемыми.',
    mustKnow: [
      'Класс-репозиторий и его методы',
      'Передача пула через конструктор',
      'Тонкие маршруты, толстый репозиторий',
      'Где класс оправдан, а где лишний',
      'Связь с требованием ООП из задания',
    ],
    theory: `## Проблема

Когда SQL разбросан по маршрутам, один и тот же запрос повторяется в трёх местах, а маршрут на 60 строк невозможно читать.

## Репозиторий

\`\`\`js
export class ApplicationsRepo {
  constructor(pool) {
    this.pool = pool;
  }

  async findByUser(userId) {
    const [rows] = await this.pool.execute(
      \`SELECT a.id, r.title AS room, p.title AS payment, a.start_date, a.status, rv.text AS review_text
       FROM applications AS a
       JOIN rooms AS r ON r.id = a.room_id
       JOIN payment_methods AS p ON p.id = a.payment_id
       LEFT JOIN reviews AS rv ON rv.application_id = a.id
       WHERE a.user_id = ?
       ORDER BY a.start_date DESC\`,
      [userId],
    );
    return rows;
  }

  async create({ userId, roomId, paymentId, startDate }) {
    const [result] = await this.pool.execute(
      'INSERT INTO applications (user_id, room_id, payment_id, start_date) VALUES (?, ?, ?, ?)',
      [userId, roomId, paymentId, startDate],
    );
    return this.findById(result.insertId);
  }

  async findById(id) {
    const [rows] = await this.pool.execute('SELECT * FROM applications WHERE id = ?', [id]);
    return rows[0] ?? null;
  }

  async changeStatus(id, status) {
    const [result] = await this.pool.execute(
      'UPDATE applications SET status = ? WHERE id = ?',
      [status, id],
    );
    return result.affectedRows > 0;
  }
}

export const applicationsRepo = new ApplicationsRepo(pool);
\`\`\`

## Маршрут становится коротким

\`\`\`js
router.get('/my', requireAuth, async (req, res) => {
  try {
    res.json(await applicationsRepo.findByUser(req.user.id));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Не удалось загрузить заявки' });
  }
});
\`\`\`

Маршрут отвечает за HTTP, репозиторий — за данные. Разделение обязанностей видно с первого взгляда, и это прямо работает на оценку качества кода.

## Требование задания

«Интерфейс… должен соответствовать современным стандартам разработки фронтенда и бэкенда, включающим технологии объектно-ориентированного программирования».

Два класса — \`ApiClient\` на клиенте и \`ApplicationsRepo\` на сервере — закрывают это требование осмысленно. Гораздо лучше, чем класс со статическими методами, созданный «чтобы был класс».

## Где класс не нужен

Валидация, форматирование даты, генерация токена — это чистые функции. Оборачивать их в классы незачем: получится лишний слой без пользы.

Практическое правило: класс оправдан там, где есть **состояние** (пул соединений, базовый адрес, токен) или **набор связанных операций** над одной сущностью.

## Структура сервера

\`\`\`text
server/
├── index.js
├── db.js
├── repositories/
│   ├── applications.js
│   ├── users.js
│   └── reviews.js
├── routes/
├── middleware/
└── seed.js
\`\`\`

Такая структура читается сразу: где данные, где HTTP, где защита.`,
    examples: [
      {
        title: 'Репозиторий пользователей',
        language: 'javascript',
        code: `export class UsersRepo {
  constructor(pool) {
    this.pool = pool;
  }

  async findByLogin(login) {
    const [rows] = await this.pool.execute(
      'SELECT id, login, password_hash, full_name, role FROM users WHERE login = ?',
      [login],
    );
    return rows[0] ?? null;
  }

  async isLoginTaken(login) {
    const [rows] = await this.pool.execute('SELECT id FROM users WHERE login = ?', [login]);
    return rows.length > 0;
  }

  async create({ login, passwordHash, fullName, phone, email }) {
    const [result] = await this.pool.execute(
      \`INSERT INTO users (login, password_hash, full_name, phone, email)
       VALUES (?, ?, ?, ?, ?)\`,
      [login, passwordHash, fullName, phone, email],
    );
    return { id: result.insertId, login, fullName, role: 'user' };
  }
}`,
        explanation:
          'Метод create возвращает данные без хеша пароля — безопасность встроена в репозиторий, и забыть про неё в маршруте уже нельзя.',
      },
    ],
    mistakes: [
      {
        title: 'SQL прямо в маршрутах',
        why: 'Запросы дублируются, маршруты разрастаются. Критерий качества кода прямо требует избегать копипасты.',
      },
      {
        title: 'Класс ради выполнения требования',
        why: 'Класс со статическими методами — это просто функции. Требование ООП закрывают осмысленные классы с состоянием.',
      },
    ],
    quizId: 'quiz-server-architecture',
    taskIds: [],
    resources: [],
    examRefs: ['m1-oop-styles', 'm3-quality'],
    prerequisites: ['auth-roles', 'ts-oop'],
    estimatedMinutes: 45,
    planDays: ['day-16-6'],
    source: 'plan',
  },
];
