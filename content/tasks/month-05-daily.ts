import type { Task } from '../types';

/**
 * Месяц 5: практика для дней, у которых её не было.
 *
 * Особенность месяца: новых тем почти нет, идёт сборка проекта и отделка.
 * Поэтому задания здесь — не «изучите свойство», а «доведите до состояния,
 * в котором это примут на экзамене»: подсказки во всех формах, таблица
 * админки на 390 пикселях, дата, которая одинаково ведёт себя на чужом
 * компьютере.
 */
export const MONTH_05_DAILY_TASKS: Task[] = [
  {
    id: 'task-project-skeleton-config',
    title: 'Каркас проекта: что попадает в репозиторий, а что нет',
    kind: 'files',
    runtime: 'js',
    difficulty: 3,
    tech: ['node', 'git', 'tools'],
    topicIds: ['project-structure'],
    monthNo: 5,
    weekNo: 17,
    statement: `Проект состоит из трёх частей: браузерная, серверная и файлы базы. Часть файлов в репозиторий попадать не должна — иначе вы либо зальёте туда пароли, либо сделаете репозиторий неподъёмным.

1. \`shouldCommit(path)\` — решает, попадает ли файл в репозиторий. **Не попадают**: всё внутри \`node_modules/\`, файлы \`.env\` и \`.env.local\`, содержимое \`dist/\` и \`build/\`, файлы \`*.log\`. Всё остальное попадает.
2. \`readConfig(env)\` — собирает настройки сервера из переменных окружения: \`{ port, dbHost, dbUser, dbName, jwtSecret }\`. Если \`PORT\` не задан — \`3000\`, если \`DB_HOST\` не задан — \`'localhost'\`. Порт возвращается **числом**.
3. Если \`JWT_SECRET\` не задан, \`readConfig\` выбрасывает ошибку «Не задан JWT_SECRET». Значения по умолчанию для секрета быть не должно: забытая настройка обязана останавливать запуск, а не тихо подставлять известную всему интернету строку.`,
    requirements: [
      'Файлы из node_modules, dist и build в репозиторий не попадают',
      'Файлы .env и .env.local не попадают',
      'Файлы с расширением .log не попадают',
      'Обычные файлы проекта попадают',
      'readConfig подставляет значения по умолчанию для порта и адреса базы',
      'Порт возвращается числом',
      'Отсутствие JWT_SECRET останавливает запуск ошибкой',
    ],
    starterCode: `function shouldCommit(path) {
  // какие файлы не попадают в репозиторий
}

function readConfig(env) {
  // настройки сервера со значениями по умолчанию
}`,
    tests: [
      {
        id: 'ignored',
        name: 'Служебные файлы отсеиваются',
        type: 'assert',
        code: `const shouldCommit = ctx.get('shouldCommit');
const ignored = [
  'node_modules/react/index.js',
  'server/node_modules/express/lib/express.js',
  '.env',
  '.env.local',
  'client/dist/index.html',
  'server/build/app.js',
  'server/logs/error.log',
];
ignored.forEach((path) => {
  ctx.assert(shouldCommit(path) === false, 'Файл «' + path + '» не должен попадать в репозиторий');
});`,
        points: 5,
      },
      {
        id: 'committed',
        name: 'Файлы проекта проходят',
        type: 'assert',
        code: `const shouldCommit = ctx.get('shouldCommit');
const kept = [
  'client/src/App.tsx',
  'server/src/routes/applications.js',
  'db/schema.sql',
  'README.md',
  '.gitignore',
  'client/src/dist-helpers.ts',
];
kept.forEach((path) => {
  ctx.assert(shouldCommit(path) === true, 'Файл «' + path + '» должен попадать в репозиторий');
});`,
        points: 5,
      },
      {
        id: 'config-defaults',
        name: 'Значения по умолчанию',
        type: 'assert',
        code: `const readConfig = ctx.get('readConfig');
const config = readConfig({ JWT_SECRET: 'secret' });
ctx.assert(config.port === 3000, 'Порт по умолчанию — 3000, получено: ' + ctx.preview(config.port), 3000, config.port);
ctx.assert(config.dbHost === 'localhost', 'Адрес базы по умолчанию — localhost, получено: ' + config.dbHost);`,
        points: 3,
      },
      {
        id: 'config-port-number',
        name: 'Порт приходит числом',
        type: 'assert',
        code: `const readConfig = ctx.get('readConfig');
const config = readConfig({ PORT: '8080', JWT_SECRET: 'secret' });
ctx.assert(
  config.port === 8080,
  'Переменные окружения всегда строки — порт нужно привести к числу. Получено: ' + ctx.preview(config.port),
  8080,
  config.port,
);`,
        points: 4,
      },
      {
        id: 'config-values',
        name: 'Заданные значения читаются',
        type: 'assert',
        code: `const readConfig = ctx.get('readConfig');
const config = readConfig({
  PORT: '4000',
  DB_HOST: 'db.example.com',
  DB_USER: 'app',
  DB_NAME: 'conferences',
  JWT_SECRET: 'secret',
});
ctx.assert(config.dbHost === 'db.example.com', 'Адрес базы не прочитан');
ctx.assert(config.dbUser === 'app', 'Пользователь базы не прочитан');
ctx.assert(config.dbName === 'conferences', 'Имя базы не прочитано');
ctx.assert(config.jwtSecret === 'secret', 'Секрет не прочитан');`,
        points: 3,
      },
      {
        id: 'secret-required',
        name: 'Без секрета запуск останавливается',
        type: 'assert',
        code: `const readConfig = ctx.get('readConfig');
let thrown = null;
try {
  readConfig({ PORT: '3000' });
} catch (error) {
  thrown = error;
}
ctx.assert(thrown, 'Отсутствие JWT_SECRET должно выбрасывать ошибку, а не подставлять значение по умолчанию');
ctx.assert(
  String(thrown.message || thrown).indexOf('JWT_SECRET') !== -1,
  'В тексте ошибки должно быть имя настройки, получено: ' + (thrown.message || thrown),
);`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Проверяйте вхождение подстроки с косой чертой: path.includes("node_modules/"). Так правило сработает и во вложенной папке server/.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Осторожно с dist: файл client/src/dist-helpers.ts содержит «dist», но папкой не является. Ищите именно «dist/».',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const IGNORED = ["node_modules/", "dist/", "build/"]; if (IGNORED.some((part) => path.includes(part))) return false; if (path === ".env" || path === ".env.local") return false; return !path.endsWith(".log");',
        penaltyPercent: 35,
      },
    ],
    solution: `const IGNORED_FOLDERS = ['node_modules/', 'dist/', 'build/'];
const IGNORED_FILES = ['.env', '.env.local'];

function shouldCommit(path) {
  if (IGNORED_FOLDERS.some((folder) => path.indexOf(folder) !== -1)) return false;
  if (IGNORED_FILES.indexOf(path) !== -1) return false;
  if (path.endsWith('.log')) return false;

  return true;
}

function readConfig(env) {
  if (!env.JWT_SECRET) {
    throw new Error('Не задан JWT_SECRET');
  }

  return {
    port: Number(env.PORT || 3000),
    dbHost: env.DB_HOST || 'localhost',
    dbUser: env.DB_USER,
    dbName: env.DB_NAME,
    jwtSecret: env.JWT_SECRET,
  };
}`,
    solutionExplanation:
      'Косая черта в «dist/» — не украшение: без неё правило отбросило бы файл dist-helpers.ts, которому в репозитории самое место. У секрета намеренно нет значения по умолчанию. Строка вроде "secret" в качестве запасного варианта выглядит безобидно ровно до того дня, когда проект попадёт в интернет с ней же — и любой сможет подписать себе токен администратора. Падение при запуске в этом случае полезнее тихой работы.',
    maxScore: 25,
    estimatedMinutes: 25,
    examRefs: ['m1-git', 'm3-quality'],
    planDays: ['day-17-1'],
    source: 'plan',
  },

  {
    id: 'task-role-based-menu',
    title: 'Меню, которое зависит от роли',
    kind: 'app',
    runtime: 'react',
    difficulty: 3,
    tech: ['react'],
    topicIds: ['fullstack-auth-flow'],
    monthNo: 5,
    weekNo: 17,
    statement: `После входа интерфейс должен измениться. Гость, пользователь и администратор видят разные меню — и это не косметика: ссылка на админку, видимая всем, выглядит на защите как дыра.

Компонент \`Header\` принимает \`{ user, onLogout }\`, где \`user\` — \`null\` либо \`{ fullName, role }\`.

**Гость** видит две ссылки:

- \`Вход\` → \`/login\`;
- \`Еще не зарегистрированы? Регистрация\` → \`/register\` (текст дословно из задания).

**Пользователь** видит приветствие в \`#greeting\` вида \`Добрый день, Иванов Илья\`, ссылки \`Мои заявки\` → \`/cabinet\` и \`Оформить заявку\` → \`/order\`, кнопку \`#logout\`.

**Администратор** видит то же, что пользователь, **плюс** ссылку \`Все заявки\` → \`/admin\`.

Кнопка выхода вызывает \`onLogout\`.`,
    requirements: [
      'Гость видит вход и регистрацию с точным текстом из задания',
      'Гость не видит кабинет, заявку и админку',
      'Пользователь видит приветствие и свои ссылки',
      'Ссылка на админку видна только администратору',
      'Кнопка выхода вызывает onLogout',
    ],
    starterCode: `function Header({ user, onLogout }) {
  // меню для гостя, пользователя и администратора
}`,
    tests: [
      {
        id: 'guest',
        name: 'Меню гостя',
        type: 'react',
        code: `return ctx.render('Header', { user: null, onLogout: () => {} }).then(() => {
  const texts = ctx.$$('a').map((link) => link.textContent.replace(/\\s+/g, ' ').trim());
  ctx.assert(texts.indexOf('Вход') !== -1, 'Гость должен видеть ссылку «Вход», сейчас: ' + texts.join(' | '));
  ctx.assert(
    texts.indexOf('Еще не зарегистрированы? Регистрация') !== -1,
    'Текст ссылки на регистрацию берётся из задания дословно. Сейчас: ' + texts.join(' | '),
  );
});`,
        points: 4,
      },
      {
        id: 'guest-no-private',
        name: 'Гость не видит закрытых разделов',
        type: 'react',
        code: `return ctx.render('Header', { user: null, onLogout: () => {} }).then(() => {
  const hrefs = ctx.$$('a').map((link) => link.getAttribute('href'));
  ['/cabinet', '/order', '/admin'].forEach((href) => {
    ctx.assert(hrefs.indexOf(href) === -1, 'Гостю не нужна ссылка ' + href);
  });
  ctx.assert(!ctx.$('#logout'), 'Гостю не нужна кнопка выхода');
});`,
        points: 4,
      },
      {
        id: 'user',
        name: 'Меню пользователя',
        type: 'react',
        code: `return ctx.render('Header', { user: { fullName: 'Иванов Илья', role: 'user' }, onLogout: () => {} }).then(() => {
  const greeting = ctx.text('#greeting');
  ctx.assert(greeting && greeting.indexOf('Иванов Илья') !== -1, 'В #greeting должно быть имя, сейчас: ' + greeting);
  const hrefs = ctx.$$('a').map((link) => link.getAttribute('href'));
  ctx.assert(hrefs.indexOf('/cabinet') !== -1, 'Нет ссылки на кабинет');
  ctx.assert(hrefs.indexOf('/order') !== -1, 'Нет ссылки на оформление заявки');
  ctx.assert(ctx.$('#logout'), 'Нет кнопки выхода');
});`,
        points: 4,
      },
      {
        id: 'user-no-admin',
        name: 'Пользователь не видит админку',
        type: 'react',
        code: `return ctx.render('Header', { user: { fullName: 'Иванов Илья', role: 'user' }, onLogout: () => {} }).then(() => {
  const hrefs = ctx.$$('a').map((link) => link.getAttribute('href'));
  ctx.assert(hrefs.indexOf('/admin') === -1, 'Ссылка на админку видна обычному пользователю');
  ctx.assert(hrefs.indexOf('/login') === -1, 'Вошедшему ссылка на вход не нужна');
});`,
        points: 4,
      },
      {
        id: 'admin',
        name: 'Меню администратора',
        type: 'react',
        code: `return ctx.render('Header', { user: { fullName: 'Администратор', role: 'admin' }, onLogout: () => {} }).then(() => {
  const hrefs = ctx.$$('a').map((link) => link.getAttribute('href'));
  ctx.assert(hrefs.indexOf('/admin') !== -1, 'Администратор должен видеть ссылку на админку');
  ctx.assert(hrefs.indexOf('/cabinet') !== -1, 'Администратор видит и обычные разделы');
  ctx.assert(ctx.$('#logout'), 'Нет кнопки выхода');
});`,
        points: 4,
      },
      {
        id: 'logout',
        name: 'Выход работает',
        type: 'react',
        code: `let called = 0;
return ctx.render('Header', { user: { fullName: 'Иванов Илья', role: 'user' }, onLogout: () => { called += 1; } })
  .then(() => ctx.click('#logout'))
  .then(() => {
    ctx.assert(called === 1, 'Кнопка выхода должна вызвать onLogout ровно один раз, вызовов: ' + called);
  });`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Три состояния удобно раскрыть ранним возвратом: if (!user) return <меню гостя>; дальше общее меню и добавка для администратора.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Ссылка администратора выводится по условию прямо в разметке: {user.role === "admin" && <a href="/admin">Все заявки</a>}.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Текст «Еще не зарегистрированы? Регистрация» скопируйте из задания как есть: «Еще» пишется без буквы ё, и проверяющий сверяет дословно.',
        penaltyPercent: 35,
      },
    ],
    solution: `function Header({ user, onLogout }) {
  if (!user) {
    return (
      <header>
        <a href="/login">Вход</a>
        <a href="/register">Еще не зарегистрированы? Регистрация</a>
      </header>
    );
  }

  return (
    <header>
      <span id="greeting">Добрый день, {user.fullName}</span>
      <nav>
        <a href="/cabinet">Мои заявки</a>
        <a href="/order">Оформить заявку</a>
        {user.role === 'admin' ? <a href="/admin">Все заявки</a> : null}
      </nav>
      <button id="logout" type="button" onClick={onLogout}>
        Выйти
      </button>
    </header>
  );
}`,
    solutionExplanation:
      'Меню гостя вынесено ранним возвратом, а не собрано условиями внутри общей разметки. Так короче и, главное, невозможно случайно оставить гостю кнопку выхода: её просто нет в этой ветке. Скрытая ссылка на админку — это удобство, а не защита: адрес всё равно можно набрать руками, поэтому сервер обязан проверять роль отдельно. Одно без другого не работает: сервер без интерфейса неудобен, интерфейс без сервера дыряв.',
    maxScore: 24,
    estimatedMinutes: 30,
    examRefs: ['m1-login', 'm1-admin', 'm1-cabinet'],
    planDays: ['day-17-3'],
    source: 'plan',
  },

  {
    id: 'task-cabinet-view-model',
    title: 'Кабинет на настоящих данных: из строк базы в карточки',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['js', 'sql'],
    topicIds: ['fullstack-cabinet'],
    monthNo: 5,
    weekNo: 17,
    statement: `Сервер соединил таблицы и вернул строки. Показывать их как есть нельзя: дата в них лежит в виде \`2027-03-12\`, а статус — обычной строкой, из которой интерфейс должен выбрать цвет.

Между базой и интерфейсом ставят преобразование. Напишите его.

Строка из базы выглядит так:

\`\`\`js
{ id: 1, room_title: 'Коворкинг', payment_title: 'Картой', start_date: '2027-03-12', status: 'Новая', review_text: null }
\`\`\`

1. \`toCardView(row)\` — возвращает \`{ id, room, payment, date, status, tone, canReview }\`:
   - \`date\` — в формате ДД.ММ.ГГГГ;
   - \`tone\` — \`'new'\` для «Новая», \`'progress'\` для «Мероприятие назначено», \`'done'\` для «Мероприятие завершено»;
   - \`canReview\` — \`true\`, если статус не «Новая» **и** отзыва ещё нет.
2. \`toCardList(rows)\` — преобразует массив и сортирует по дате **от новых к старым**. Исходный массив менять нельзя.
3. \`groupByStatus(rows)\` — считает количество по статусам для подписи «Новых: 2, назначено: 1».`,
    requirements: [
      'Дата переводится в формат ДД.ММ.ГГГГ',
      'Каждому статусу соответствует свой тон',
      'Отзыв разрешён только после смены статуса и только один раз',
      'Список сортируется от новых заявок к старым',
      'Исходный массив не изменяется',
      'groupByStatus считает количество по статусам',
    ],
    starterCode: `function toCardView(row) {
  // одна строка базы -> одна карточка
}

function toCardList(rows) {
  // массив карточек, новые сверху
}

function groupByStatus(rows) {
  // { 'Новая': 2, ... }
}`,
    tests: [
      {
        id: 'view',
        name: 'Строка превращается в карточку',
        type: 'call',
        entry: 'toCardView',
        args: [
          {
            id: 1,
            room_title: 'Коворкинг',
            payment_title: 'Картой',
            start_date: '2027-03-12',
            status: 'Новая',
            review_text: null,
          },
        ],
        expected: {
          id: 1,
          room: 'Коворкинг',
          payment: 'Картой',
          date: '12.03.2027',
          status: 'Новая',
          tone: 'new',
          canReview: false,
        },
        compare: 'deep',
        points: 5,
      },
      {
        id: 'tones',
        name: 'Тон соответствует статусу',
        type: 'assert',
        code: `const toCardView = ctx.get('toCardView');
const base = { id: 1, room_title: 'А', payment_title: 'Б', start_date: '2027-01-05', review_text: null };
ctx.assert(toCardView({ ...base, status: 'Новая' }).tone === 'new', 'Для «Новая» тон должен быть new');
ctx.assert(
  toCardView({ ...base, status: 'Мероприятие назначено' }).tone === 'progress',
  'Для «Мероприятие назначено» тон должен быть progress',
);
ctx.assert(
  toCardView({ ...base, status: 'Мероприятие завершено' }).tone === 'done',
  'Для «Мероприятие завершено» тон должен быть done',
);`,
        points: 4,
      },
      {
        id: 'can-review',
        name: 'Правило отзыва',
        type: 'assert',
        code: `const toCardView = ctx.get('toCardView');
const base = { id: 1, room_title: 'А', payment_title: 'Б', start_date: '2027-01-05' };
ctx.assert(
  toCardView({ ...base, status: 'Новая', review_text: null }).canReview === false,
  'По новой заявке отзыв оставить нельзя',
);
ctx.assert(
  toCardView({ ...base, status: 'Мероприятие завершено', review_text: null }).canReview === true,
  'После смены статуса отзыв разрешён',
);
ctx.assert(
  toCardView({ ...base, status: 'Мероприятие завершено', review_text: 'Отлично' }).canReview === false,
  'Второй отзыв по той же заявке оставить нельзя',
);`,
        points: 5,
      },
      {
        id: 'sorted',
        name: 'Новые заявки сверху',
        type: 'assert',
        code: `const toCardList = ctx.get('toCardList');
const rows = [
  { id: 1, room_title: 'А', payment_title: 'Б', start_date: '2027-01-05', status: 'Новая', review_text: null },
  { id: 2, room_title: 'В', payment_title: 'Г', start_date: '2027-04-19', status: 'Новая', review_text: null },
  { id: 3, room_title: 'Д', payment_title: 'Е', start_date: '2027-03-12', status: 'Новая', review_text: null },
];
const list = toCardList(rows);
ctx.assert(
  list.map((card) => card.id).join(',') === '2,3,1',
  'Ожидался порядок 2,3,1 (от новых к старым), получено: ' + list.map((card) => card.id).join(','),
);
ctx.assert(list[0].date === '19.04.2027', 'Дата в карточке должна быть уже преобразована');`,
        points: 5,
      },
      {
        id: 'pure',
        name: 'Исходный массив не меняется',
        type: 'assert',
        code: `const toCardList = ctx.get('toCardList');
const rows = [
  { id: 1, room_title: 'А', payment_title: 'Б', start_date: '2027-01-05', status: 'Новая', review_text: null },
  { id: 2, room_title: 'В', payment_title: 'Г', start_date: '2027-04-19', status: 'Новая', review_text: null },
];
const order = rows.map((row) => row.id).join(',');
toCardList(rows);
ctx.assert(
  rows.map((row) => row.id).join(',') === order,
  'Метод sort сортирует на месте — перед ним нужна копия. Исходный порядок был ' + order,
);`,
        points: 4,
      },
      {
        id: 'group',
        name: 'Подсчёт по статусам',
        type: 'call',
        entry: 'groupByStatus',
        args: [
          [
            { id: 1, status: 'Новая' },
            { id: 2, status: 'Новая' },
            { id: 3, status: 'Мероприятие назначено' },
          ],
        ],
        expected: { Новая: 2, 'Мероприятие назначено': 1 },
        compare: 'deep',
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Соответствие статуса и тона удобно держать объектом-справочником: { "Новая": "new", … } — и брать из него по ключу.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Сортировка по дате в формате ГГГГ-ММ-ДД работает обычным сравнением строк: b.start_date.localeCompare(a.start_date).',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'toCardList: return rows.slice().sort((a, b) => b.start_date.localeCompare(a.start_date)).map(toCardView);',
        penaltyPercent: 35,
      },
    ],
    solution: `const TONES = {
  Новая: 'new',
  'Мероприятие назначено': 'progress',
  'Мероприятие завершено': 'done',
};

function toCardView(row) {
  return {
    id: row.id,
    room: row.room_title,
    payment: row.payment_title,
    date: row.start_date.split('-').reverse().join('.'),
    status: row.status,
    tone: TONES[row.status],
    canReview: row.status !== 'Новая' && !row.review_text,
  };
}

function toCardList(rows) {
  return rows
    .slice()
    .sort((a, b) => b.start_date.localeCompare(a.start_date))
    .map(toCardView);
}

function groupByStatus(rows) {
  return rows.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1;
    return acc;
  }, {});
}`,
    solutionExplanation:
      'Сортировка идёт по исходной дате ГГГГ-ММ-ДД, а преобразование в ДД.ММ.ГГГГ происходит после неё. Порядок важен: строку «12.03.2027» сравнивать бессмысленно — первым идёт день, и январь следующего года окажется раньше декабря текущего. Общее правило: храните и считайте в машинном формате, показывайте в человеческом. Справочник тонов вынесен наружу — интерфейс не должен знать русские названия статусов, ему хватает короткого признака для выбора цвета.',
    maxScore: 27,
    estimatedMinutes: 30,
    examRefs: ['m1-cabinet', 'm2-cabinet-ux', 'm2-order-form'],
    planDays: ['day-17-5'],
    source: 'plan',
  },

  {
    id: 'task-review-double-check',
    title: 'Отзыв: проверка на клиенте и обязательно на сервере',
    kind: 'api',
    runtime: 'js',
    difficulty: 4,
    tech: ['express', 'security', 'node'],
    topicIds: ['fullstack-cabinet'],
    monthNo: 5,
    weekNo: 17,
    statement: `Интерфейс прячет форму отзыва у новой заявки. Этого мало: запрос можно отправить в обход интерфейса, и сервер обязан проверить всё сам.

\`db.query(sql, params)\` возвращает промис.

\`createReview(db)\` — обработчик \`(req, res)\`. Берёт \`req.user.id\`, \`req.params.id\` (номер заявки, строка) и \`req.body.text\`.

Порядок проверок:

1. нет \`req.user\` → \`401\`, \`{ error: 'Требуется вход' }\`;
2. пустой текст отзыва → \`400\`, \`{ error: 'Напишите отзыв' }\`;
3. заявки нет → \`404\`, \`{ error: 'Заявка не найдена' }\`;
4. заявка чужая (\`user_id\` не совпадает) → \`403\`, \`{ error: 'Это не ваша заявка' }\`;
5. статус «Новая» → \`403\`, \`{ error: 'Отзыв можно оставить после смены статуса' }\`;
6. отзыв уже есть → \`409\`, \`{ error: 'Отзыв уже оставлен' }\`;
7. иначе вставка и ответ \`201\` с \`{ id }\`.

Первый запрос к базе возвращает массив строк заявки с полями \`id\`, \`user_id\`, \`status\`, \`review_id\`. Пункт 4 — самый частый пропуск: без него любой пользователь оставит отзыв по чужой заявке, зная только её номер.`,
    requirements: [
      'Без входа — 401',
      'Пустой отзыв — 400 без обращения к базе',
      'Несуществующая заявка — 404',
      'Чужая заявка — 403',
      'Заявка со статусом «Новая» — 403',
      'Повторный отзыв — 409',
      'Успех — 201 с номером отзыва',
    ],
    starterCode: `function createReview(db) {
  return async function (req, res) {
    // семь случаев по порядку
  };
}`,
    tests: [
      {
        id: 'unauthorized',
        name: 'Без входа — 401',
        type: 'assert',
        code: `const createReview = ctx.get('createReview');
let code = 200;
const res = { status: (c) => { code = c; return res; }, json: () => res };
return createReview({ query: () => Promise.reject(new Error('к базе не обращаться')) })(
  { params: { id: '1' }, body: { text: 'Отлично' } },
  res,
).then(function () {
  ctx.assert(code === 401, 'Ожидался код 401, сейчас: ' + code, 401, code);
});`,
        points: 3,
      },
      {
        id: 'empty-text',
        name: 'Пустой отзыв не идёт в базу',
        type: 'assert',
        code: `const createReview = ctx.get('createReview');
let called = false;
let code = 200;
let body = null;
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return createReview({ query: () => { called = true; return Promise.resolve([]); } })(
  { user: { id: 1 }, params: { id: '1' }, body: { text: '   ' } },
  res,
).then(function () {
  ctx.assert(code === 400, 'Ожидался код 400, сейчас: ' + code, 400, code);
  ctx.assert(body && body.error === 'Напишите отзыв', 'Текст ошибки не совпадает: ' + ctx.preview(body));
  ctx.assert(called === false, 'Пустой отзыв до базы доходить не должен');
});`,
        points: 4,
      },
      {
        id: 'not-found',
        name: 'Несуществующая заявка — 404',
        type: 'assert',
        code: `const createReview = ctx.get('createReview');
let code = 200;
const res = { status: (c) => { code = c; return res; }, json: () => res };
return createReview({ query: () => Promise.resolve([]) })(
  { user: { id: 1 }, params: { id: '999' }, body: { text: 'Отлично' } },
  res,
).then(function () {
  ctx.assert(code === 404, 'Ожидался код 404, сейчас: ' + code, 404, code);
});`,
        points: 3,
      },
      {
        id: 'foreign',
        name: 'Чужая заявка — 403',
        type: 'assert',
        code: `const createReview = ctx.get('createReview');
let code = 200;
let body = null;
let inserted = false;
const db = {
  query: (sql) => {
    if (String(sql).toUpperCase().indexOf('INSERT') !== -1) { inserted = true; return Promise.resolve({ insertId: 1 }); }
    return Promise.resolve([{ id: 5, user_id: 42, status: 'Мероприятие завершено', review_id: null }]);
  },
};
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return createReview(db)({ user: { id: 1 }, params: { id: '5' }, body: { text: 'Отлично' } }, res).then(function () {
  ctx.assert(code === 403, 'Чужая заявка должна давать 403, сейчас: ' + code, 403, code);
  ctx.assert(body && body.error === 'Это не ваша заявка', 'Текст ошибки не совпадает: ' + ctx.preview(body));
  ctx.assert(inserted === false, 'Отзыв по чужой заявке записываться не должен');
});`,
        points: 6,
      },
      {
        id: 'new-status',
        name: 'Новая заявка — 403',
        type: 'assert',
        code: `const createReview = ctx.get('createReview');
let code = 200;
let body = null;
const db = { query: () => Promise.resolve([{ id: 5, user_id: 1, status: 'Новая', review_id: null }]) };
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return createReview(db)({ user: { id: 1 }, params: { id: '5' }, body: { text: 'Отлично' } }, res).then(function () {
  ctx.assert(code === 403, 'По новой заявке отзыв запрещён, ожидался 403, сейчас: ' + code, 403, code);
  ctx.assert(
    body && body.error === 'Отзыв можно оставить после смены статуса',
    'Текст ошибки не совпадает: ' + ctx.preview(body),
  );
});`,
        points: 5,
      },
      {
        id: 'duplicate',
        name: 'Повторный отзыв — 409',
        type: 'assert',
        code: `const createReview = ctx.get('createReview');
let code = 200;
let body = null;
const db = { query: () => Promise.resolve([{ id: 5, user_id: 1, status: 'Мероприятие завершено', review_id: 7 }]) };
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return createReview(db)({ user: { id: 1 }, params: { id: '5' }, body: { text: 'Ещё раз' } }, res).then(function () {
  ctx.assert(code === 409, 'Повторный отзыв должен давать 409, сейчас: ' + code, 409, code);
  ctx.assert(body && body.error === 'Отзыв уже оставлен', 'Текст ошибки не совпадает: ' + ctx.preview(body));
});`,
        points: 5,
      },
      {
        id: 'created',
        name: 'Успешный отзыв — 201',
        type: 'assert',
        code: `const createReview = ctx.get('createReview');
const calls = [];
const db = {
  query: (sql, params) => {
    calls.push({ sql, params });
    if (String(sql).toUpperCase().indexOf('INSERT') !== -1) return Promise.resolve({ insertId: 11 });
    return Promise.resolve([{ id: 5, user_id: 1, status: 'Мероприятие завершено', review_id: null }]);
  },
};
let code = 200;
let body = null;
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return createReview(db)({ user: { id: 1 }, params: { id: '5' }, body: { text: 'Всё прошло отлично' } }, res).then(function () {
  ctx.assert(code === 201, 'Ожидался код 201, сейчас: ' + code, 201, code);
  ctx.assert(body && body.id === 11, 'В ответе должен быть номер отзыва, получено: ' + ctx.preview(body));
  const insert = calls.filter((call) => String(call.sql).toUpperCase().indexOf('INSERT') !== -1)[0];
  ctx.assert(insert && Array.isArray(insert.params), 'Значения передаются параметрами');
  ctx.assert(
    String(insert.sql).indexOf('Всё прошло отлично') === -1,
    'Текст отзыва не должен попадать в текст запроса',
  );
});`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Проверки, не требующие базы, ставьте первыми: вход и пустой текст. Так лишний запрос не уйдёт.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Номер заявки из адреса приходит строкой, а в базе это число. Приводите: Number(req.params.id).',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const rows = await db.query("SELECT a.id, a.user_id, a.status, r.id AS review_id FROM applications a LEFT JOIN reviews r ON r.application_id = a.id WHERE a.id = ?", [Number(req.params.id)]);',
        penaltyPercent: 35,
      },
    ],
    solution: `function createReview(db) {
  return async function (req, res) {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется вход' });
    }

    const text = String((req.body && req.body.text) || '').trim();

    if (!text) {
      return res.status(400).json({ error: 'Напишите отзыв' });
    }

    try {
      const rows = await db.query(
        'SELECT a.id, a.user_id, a.status, r.id AS review_id FROM applications a LEFT JOIN reviews r ON r.application_id = a.id WHERE a.id = ?',
        [Number(req.params.id)],
      );

      const application = rows[0];

      if (!application) {
        return res.status(404).json({ error: 'Заявка не найдена' });
      }

      if (application.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Это не ваша заявка' });
      }

      if (application.status === 'Новая') {
        return res.status(403).json({ error: 'Отзыв можно оставить после смены статуса' });
      }

      if (application.review_id) {
        return res.status(409).json({ error: 'Отзыв уже оставлен' });
      }

      const result = await db.query('INSERT INTO reviews (application_id, text) VALUES (?, ?)', [
        application.id,
        text,
      ]);

      return res.status(201).json({ id: result.insertId });
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  };
}`,
    solutionExplanation:
      'Проверка на чужую заявку — та самая, которую пропускают чаще всего, потому что в интерфейсе чужих заявок не видно. Но номер заявки виден в адресе, и подставить соседний может кто угодно. Правило простое: всё, что скрыто в интерфейсе, обязано быть закрыто и на сервере. Порядок проверок идёт от дешёвых к дорогим и от общих к частным — так каждый ответ получается точным, а не «что-то пошло не так». Уникальность отзыва проверена и в коде, и ограничением в схеме: код даёт понятное сообщение, схема защищает от одновременных запросов.',
    maxScore: 32,
    estimatedMinutes: 40,
    examRefs: ['m1-cabinet', 'm2-cabinet-ux', 'm3-quality'],
    planDays: ['day-17-6'],
    source: 'plan',
  },

  {
    id: 'task-admin-guard-router',
    title: 'Админка: одна проверка на все закрытые адреса',
    kind: 'api',
    runtime: 'js',
    difficulty: 3,
    tech: ['express', 'security', 'node'],
    topicIds: ['admin-panel'],
    monthNo: 5,
    weekNo: 18,
    statement: `Если проверку прав вешать на каждый адрес отдельно, однажды её забудут — и забудут молча. Правильный приём: закрыть весь раздел целиком, до того как запрос дойдёт до обработчиков.

1. \`buildRouter(routes, guards)\` — собирает таблицу маршрутов. Каждому адресу, начинающемуся с \`/api/admin\`, добавляется \`guards.requireAuth\` и \`guards.requireAdmin\` **перед** его собственным обработчиком. Остальным адресам ничего не добавляется. Возвращается новый массив \`{ method, path, chain }\`, где \`chain\` — массив функций по порядку.
2. \`handle(router, request)\` — выполняет цепочку: вызывает функции по очереди, передавая \`(req, res, next)\`. Если очередная функция не вызвала \`next\`, выполнение останавливается. Возвращает \`{ code, body }\` из \`res\`.
3. Если адрес не найден — \`{ code: 404, body: { error: 'Адрес не найден' } }\`.

Смысл первого пункта в том, что признак закрытости выводится из самого адреса. Новый админский маршрут окажется защищённым автоматически.`,
    requirements: [
      'Админским адресам добавляются обе проверки перед обработчиком',
      'Обычным адресам ничего не добавляется',
      'Проверки идут строго до обработчика',
      'Цепочка останавливается, если очередная функция не вызвала next',
      'Неизвестный адрес даёт 404',
    ],
    starterCode: `function buildRouter(routes, guards) {
  // добавить проверки всем адресам раздела /api/admin
}

function handle(router, request) {
  // выполнить цепочку и вернуть { code, body }
}`,
    tests: [
      {
        id: 'chain-built',
        name: 'Цепочка собрана правильно',
        type: 'assert',
        code: `const buildRouter = ctx.get('buildRouter');
const handler = () => {};
const guards = { requireAuth: () => {}, requireAdmin: () => {} };
const router = buildRouter(
  [
    { method: 'GET', path: '/api/rooms', handler },
    { method: 'GET', path: '/api/admin/applications', handler },
  ],
  guards,
);
const publicRoute = router.filter((route) => route.path === '/api/rooms')[0];
const adminRoute = router.filter((route) => route.path === '/api/admin/applications')[0];
ctx.assert(publicRoute.chain.length === 1, 'У обычного адреса в цепочке только его обработчик, сейчас: ' + publicRoute.chain.length);
ctx.assert(adminRoute.chain.length === 3, 'У админского адреса должно быть три звена, сейчас: ' + adminRoute.chain.length, 3, adminRoute.chain.length);
ctx.assert(adminRoute.chain[0] === guards.requireAuth, 'Первой идёт проверка входа');
ctx.assert(adminRoute.chain[1] === guards.requireAdmin, 'Второй идёт проверка роли');
ctx.assert(adminRoute.chain[2] === handler, 'Обработчик идёт последним');`,
        points: 6,
      },
      {
        id: 'new-route-protected',
        name: 'Новый админский адрес защищён сам собой',
        type: 'assert',
        code: `const buildRouter = ctx.get('buildRouter');
const guards = { requireAuth: () => {}, requireAdmin: () => {} };
const router = buildRouter([{ method: 'DELETE', path: '/api/admin/users/:id', handler: () => {} }], guards);
ctx.assert(
  router[0].chain.length === 3,
  'Любой адрес раздела /api/admin должен получать проверки автоматически, сейчас звеньев: ' + router[0].chain.length,
);`,
        points: 4,
      },
      {
        id: 'runs-chain',
        name: 'Цепочка выполняется по порядку',
        type: 'assert',
        code: `const buildRouter = ctx.get('buildRouter');
const handle = ctx.get('handle');
const order = [];
const guards = {
  requireAuth: (req, res, next) => { order.push('auth'); next(); },
  requireAdmin: (req, res, next) => { order.push('admin'); next(); },
};
const router = buildRouter(
  [{ method: 'GET', path: '/api/admin/applications', handler: (req, res) => { order.push('handler'); res.json([1, 2]); } }],
  guards,
);
const result = handle(router, { method: 'GET', path: '/api/admin/applications', user: { role: 'admin' } });
ctx.assert(order.join(',') === 'auth,admin,handler', 'Порядок выполнения: ' + order.join(','));
ctx.assert(result.code === 200, 'Успешный ответ — код 200, сейчас: ' + result.code);
ctx.assert(Array.isArray(result.body) && result.body.length === 2, 'Тело ответа не совпадает: ' + ctx.preview(result.body));`,
        points: 6,
      },
      {
        id: 'stops',
        name: 'Отказ останавливает цепочку',
        type: 'assert',
        code: `const buildRouter = ctx.get('buildRouter');
const handle = ctx.get('handle');
let handlerCalled = false;
const guards = {
  requireAuth: (req, res, next) => { next(); },
  requireAdmin: (req, res) => { res.status(403).json({ error: 'Недостаточно прав' }); },
};
const router = buildRouter(
  [{ method: 'GET', path: '/api/admin/applications', handler: () => { handlerCalled = true; } }],
  guards,
);
const result = handle(router, { method: 'GET', path: '/api/admin/applications', user: { role: 'user' } });
ctx.assert(result.code === 403, 'Ожидался код 403, сейчас: ' + result.code, 403, result.code);
ctx.assert(handlerCalled === false, 'Обработчик не должен выполняться после отказа');`,
        points: 6,
      },
      {
        id: 'not-found',
        name: 'Неизвестный адрес — 404',
        type: 'assert',
        code: `const buildRouter = ctx.get('buildRouter');
const handle = ctx.get('handle');
const router = buildRouter([{ method: 'GET', path: '/api/rooms', handler: (req, res) => res.json([]) }], {
  requireAuth: (req, res, next) => next(),
  requireAdmin: (req, res, next) => next(),
});
const result = handle(router, { method: 'GET', path: '/api/unknown' });
ctx.assert(result.code === 404, 'Ожидался код 404, сейчас: ' + result.code, 404, result.code);
ctx.assert(result.body && result.body.error === 'Адрес не найден', 'Текст ошибки не совпадает: ' + ctx.preview(result.body));`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Признак закрытости выводится из адреса: route.path.startsWith("/api/admin").',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Внутри handle заведите объект res, который запоминает код и тело: status(code) сохраняет код и возвращает сам res, json(body) сохраняет тело.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Выполнение цепочки: let index = 0; const next = () => { const fn = chain[index++]; if (fn) fn(request, res, next); }; next();',
        penaltyPercent: 35,
      },
    ],
    solution: `function buildRouter(routes, guards) {
  return routes.map((route) => {
    const isAdmin = route.path.indexOf('/api/admin') === 0;
    const chain = isAdmin
      ? [guards.requireAuth, guards.requireAdmin, route.handler]
      : [route.handler];

    return { method: route.method, path: route.path, chain };
  });
}

function handle(router, request) {
  const route = router.find((item) => item.method === request.method && item.path === request.path);

  if (!route) {
    return { code: 404, body: { error: 'Адрес не найден' } };
  }

  const result = { code: 200, body: null };
  const res = {
    status(code) {
      result.code = code;
      return res;
    },
    json(body) {
      result.body = body;
      return res;
    },
  };

  let index = 0;
  const next = () => {
    const fn = route.chain[index];
    index += 1;
    if (fn) fn(request, res, next);
  };

  next();

  return result;
}`,
    solutionExplanation:
      'Ключевая мысль — закрытость выводится из адреса, а не отмечается вручную. Стоит один раз написать флаг в каждом маршруте, и рано или поздно кто-то добавит новый адрес без флага. Здесь же адрес /api/admin/users/:id защищён в тот же момент, когда появился. Цепочка останавливается сама: если звено не вызвало next, следующая функция просто не запустится. Именно так устроен Express — понимание этого механизма избавляет от вопроса «почему обработчик выполнился дважды».',
    maxScore: 26,
    estimatedMinutes: 35,
    examRefs: ['m1-admin', 'm3-quality'],
    planDays: ['day-18-1'],
    source: 'plan',
  },

  {
    id: 'task-admin-change-status',
    title: 'Смена статуса без перезагрузки страницы',
    kind: 'app',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['admin-panel', 'react-admin-ui'],
    monthNo: 5,
    weekNo: 18,
    statement: `Администратор меняет статус заявки прямо в таблице. Страница при этом не перезагружается, а строка обновляется на месте.

Компонент \`AdminTable\` принимает \`{ applications, onChangeStatus }\`, где \`onChangeStatus(id, status)\` возвращает промис: успешный — статус принят, отклонённый — отказ сервера.

1. Таблица \`#orders\`: строка на заявку, в строке номер, помещение, дата и выпадающий список \`select.status\` с тремя статусами.
2. Выбор нового статуса вызывает \`onChangeStatus\`. После успеха строка показывает новый статус.
3. Если промис отклонён, статус в строке **возвращается к прежнему**, а в \`#error\` появляется «Не удалось изменить статус».
4. Пока запрос идёт, список этой строки заблокирован (\`disabled\`) — иначе быстрый двойной выбор отправит два запроса.
5. Данные из пропа хранятся в состоянии, чтобы строку можно было обновить.`,
    requirements: [
      'Таблица строится из массива заявок',
      'В каждой строке выпадающий список со всеми тремя статусами',
      'Успешная смена обновляет строку без перезагрузки',
      'Отказ сервера возвращает прежний статус и показывает ошибку',
      'Во время запроса список заблокирован',
    ],
    starterCode: `const STATUSES = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'];

function AdminTable({ applications, onChangeStatus }) {
  // таблица со сменой статуса на месте
}`,
    tests: [
      {
        id: 'table',
        name: 'Таблица со списками статусов',
        type: 'react',
        code: `const applications = [
  { id: 1, room: 'Коворкинг', date: '12.03.2027', status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '05.02.2027', status: 'Мероприятие назначено' },
];
return ctx.render('AdminTable', { applications, onChangeStatus: () => Promise.resolve() }).then(() => {
  ctx.assert(ctx.$('#orders'), 'Нет таблицы #orders');
  const selects = ctx.$$('select.status');
  ctx.assert(selects.length === 2, 'В каждой строке должен быть выпадающий список, найдено: ' + selects.length, 2, selects.length);
  const options = Array.prototype.slice.call(selects[0].options).map((option) => option.value);
  ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'].forEach((status) => {
    ctx.assert(options.indexOf(status) !== -1, 'В списке нет статуса «' + status + '»');
  });
  ctx.assert(selects[0].value === 'Новая', 'Список должен показывать текущий статус строки');
});`,
        points: 5,
      },
      {
        id: 'change',
        name: 'Смена статуса обновляет строку',
        type: 'react',
        code: `const applications = [{ id: 1, room: 'Коворкинг', date: '12.03.2027', status: 'Новая' }];
const calls = [];
const onChangeStatus = (id, status) => { calls.push({ id, status }); return Promise.resolve(); };
return ctx.render('AdminTable', { applications, onChangeStatus })
  .then(() => ctx.change('select.status', 'Мероприятие назначено'))
  .then(() => ctx.advanceTime(50))
  .then(() => {
    ctx.assert(calls.length === 1, 'Должен быть ровно один вызов onChangeStatus, сделано: ' + calls.length);
    ctx.assert(calls[0].id === 1 && calls[0].status === 'Мероприятие назначено', 'Переданы неверные значения: ' + ctx.preview(calls[0]));
    ctx.assert(
      ctx.$('select.status').value === 'Мероприятие назначено',
      'После успеха строка должна показывать новый статус, сейчас: ' + ctx.$('select.status').value,
    );
  });`,
        points: 6,
      },
      {
        id: 'rollback',
        name: 'Отказ сервера возвращает прежний статус',
        type: 'react',
        // Компонент между проверками не пересоздаётся, поэтому прежний статус
        // читаем из строки, а не считаем известным заранее.
        code: `const applications = [{ id: 2, room: 'Кинозал', date: '05.02.2027', status: 'Новая' }];
const onChangeStatus = () => Promise.reject(new Error('отказ'));
let before = '';
return ctx.render('AdminTable', { applications, onChangeStatus })
  .then(() => {
    before = ctx.$('select.status').value;
    const target = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'].filter((status) => status !== before)[0];
    return ctx.change('select.status', target);
  })
  .then(() => ctx.advanceTime(100))
  .then(() => {
    ctx.assert(
      ctx.$('select.status').value === before,
      'После отказа статус должен вернуться к прежнему («' + before + '»), сейчас: ' + ctx.$('select.status').value,
    );
    const error = ctx.text('#error');
    ctx.assert(error && error.indexOf('Не удалось изменить статус') !== -1, 'Нет сообщения об ошибке, сейчас: ' + error);
  });`,
        points: 7,
      },
      {
        id: 'disabled',
        name: 'Во время запроса список заблокирован',
        type: 'react',
        code: `const applications = [{ id: 3, room: 'Аудитория', date: '01.04.2027', status: 'Новая' }];
let release = null;
const onChangeStatus = () => new Promise((resolve) => { release = resolve; });
return ctx.render('AdminTable', { applications, onChangeStatus })
  .then(() => ctx.change('select.status', 'Мероприятие назначено'))
  .then(() => {
    ctx.assert(
      ctx.$('select.status').disabled === true,
      'Пока запрос не завершён, список должен быть заблокирован — иначе двойной выбор отправит два запроса',
    );
    return ctx.act ? null : null;
  })
  .then(() => { if (release) release(); return ctx.advanceTime(100); })
  .then(() => {
    ctx.assert(ctx.$('select.status').disabled === false, 'После ответа список нужно разблокировать');
  });`,
        points: 6,
      },
      {
        id: 'no-reload',
        name: 'Страница не перезагружается',
        type: 'react',
        code: `const source = ctx.source || '';
ctx.assert(!/location\\s*\\.\\s*reload/.test(source), 'Перезагружать страницу нельзя: строка обновляется на месте');
ctx.assert(!/alert\\s*\\(/.test(source), 'Ошибка выводится на странице, а не через alert');
ctx.assert(/useState/.test(source), 'Заявки нужно положить в состояние, иначе строку не обновить');`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Проп нельзя менять напрямую. Скопируйте заявки в состояние: const [items, setItems] = React.useState(applications).',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Запомните прежний статус до запроса — он понадобится, чтобы вернуть строку при отказе.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const update = (id, status) => setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item))); — и в catch вызвать её же с прежним значением.',
        penaltyPercent: 35,
      },
    ],
    solution: `const STATUSES = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'];

function AdminTable({ applications, onChangeStatus }) {
  const [items, setItems] = React.useState(applications);
  const [pendingId, setPendingId] = React.useState(null);
  const [error, setError] = React.useState('');

  const update = (id, status) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const handleChange = (item, status) => {
    const previous = item.status;

    setError('');
    setPendingId(item.id);
    update(item.id, status);

    onChangeStatus(item.id, status)
      .then(() => {
        setPendingId(null);
      })
      .catch(() => {
        update(item.id, previous);
        setError('Не удалось изменить статус');
        setPendingId(null);
      });
  };

  return (
    <div>
      <table id="orders">
        <thead>
          <tr>
            <th>№</th>
            <th>Помещение</th>
            <th>Дата</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.room}</td>
              <td>{item.date}</td>
              <td>
                <select
                  className="status"
                  value={item.status}
                  disabled={pendingId === item.id}
                  onChange={(event) => handleChange(item, event.target.value)}
                >
                  {STATUSES.map((status) => (
                    <option value={status} key={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p id="error">{error}</p>
    </div>
  );
}`,
    solutionExplanation:
      'Строка обновляется сразу, не дожидаясь ответа сервера, а при отказе возвращается к прежнему значению. Такой приём называют оптимистичным обновлением: интерфейс отвечает мгновенно, но честно откатывается, если сервер не согласился. Прежний статус запоминается до запроса — брать его из состояния в catch уже поздно, там лежит новое значение. Блокировка списка на время запроса закрывает быструю двойную смену, после которой в базе оказывается не тот статус, который видит администратор.',
    maxScore: 27,
    estimatedMinutes: 40,
    examRefs: ['m1-admin', 'm2-admin-tools'],
    planDays: ['day-18-2'],
    source: 'plan',
  },

  {
    id: 'task-admin-sort-columns',
    title: 'Сортировка по столбцам: и не испортить исходный список',
    kind: 'app',
    runtime: 'react',
    difficulty: 3,
    tech: ['react'],
    topicIds: ['admin-panel', 'react-admin-ui'],
    monthNo: 5,
    weekNo: 18,
    statement: `Модуль 2 требует от админки возможность сортировки. Главная ловушка дня: метод \`sort\` сортирует массив **на месте**, то есть портит исходные данные. В React это приводит к тому, что список меняется без ведома React и перерисовка отстаёт.

Компонент \`AdminTable\` принимает \`{ applications }\` — массив \`{ id, room, date, status }\`, где \`date\` уже в формате ДД.ММ.ГГГГ.

1. Заголовки столбцов «Дата» и «Статус» — кнопки \`#sort-date\` и \`#sort-status\`.
2. Первый клик сортирует по возрастанию, повторный по тому же столбцу — по убыванию.
3. Клик по другому столбцу начинает с возрастания.
4. Дата сортируется как дата, а не как строка: \`05.02.2027\` идёт раньше \`12.03.2027\`.
5. Проп \`applications\` не изменяется — проверка сравнит его до и после.`,
    requirements: [
      'Клик по заголовку сортирует по возрастанию',
      'Повторный клик меняет направление',
      'Переключение на другой столбец начинает с возрастания',
      'Дата сортируется по-настоящему, а не как текст',
      'Исходный массив из пропа не изменяется',
    ],
    starterCode: `function AdminTable({ applications }) {
  // сортировка по дате и статусу кликом по заголовку
}`,
    tests: [
      {
        id: 'initial',
        name: 'Таблица выводится в исходном порядке',
        type: 'react',
        code: `const applications = [
  { id: 1, room: 'Коворкинг', date: '12.03.2027', status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '05.02.2027', status: 'Мероприятие завершено' },
  { id: 3, room: 'Аудитория', date: '19.04.2027', status: 'Мероприятие назначено' },
];
return ctx.render('AdminTable', { applications }).then(() => {
  const rows = ctx.$$('tbody tr');
  ctx.assert(rows.length === 3, 'Строк должно быть три, найдено: ' + rows.length);
  ctx.assert(ctx.$('#sort-date'), 'Нет кнопки #sort-date');
  ctx.assert(ctx.$('#sort-status'), 'Нет кнопки #sort-status');
});`,
        points: 3,
      },
      {
        id: 'sort-date-asc',
        name: 'Сортировка по дате от ранних к поздним',
        type: 'react',
        code: `const applications = [
  { id: 1, room: 'Коворкинг', date: '12.03.2027', status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '05.02.2027', status: 'Мероприятие завершено' },
  { id: 3, room: 'Аудитория', date: '19.04.2027', status: 'Мероприятие назначено' },
];
return ctx.render('AdminTable', { applications })
  .then(() => ctx.click('#sort-status'))
  .then(() => ctx.click('#sort-date'))
  .then(() => {
    const dates = ctx.$$('tbody tr').map((row) => row.textContent.match(/\\d{2}\\.\\d{2}\\.\\d{4}/)[0]);
    ctx.assert(
      dates.join(',') === '05.02.2027,12.03.2027,19.04.2027',
      'Ожидался порядок 05.02, 12.03, 19.04. Получено: ' + dates.join(', ') + '. Сравнение строк тут не работает: первым идёт день',
    );
  });`,
        points: 6,
      },
      {
        id: 'sort-date-desc',
        name: 'Повторный клик меняет направление',
        type: 'react',
        code: `const applications = [
  { id: 1, room: 'Коворкинг', date: '12.03.2027', status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '05.02.2027', status: 'Мероприятие завершено' },
  { id: 3, room: 'Аудитория', date: '19.04.2027', status: 'Мероприятие назначено' },
];
// Первый клик по другому столбцу сбрасывает направление — так проверка
// не зависит от того, что осталось от предыдущей.
return ctx.render('AdminTable', { applications })
  .then(() => ctx.click('#sort-status'))
  .then(() => ctx.click('#sort-date'))
  .then(() => ctx.click('#sort-date'))
  .then(() => {
    const dates = ctx.$$('tbody tr').map((row) => row.textContent.match(/\\d{2}\\.\\d{2}\\.\\d{4}/)[0]);
    ctx.assert(
      dates.join(',') === '19.04.2027,12.03.2027,05.02.2027',
      'После повторного клика порядок должен смениться на обратный, получено: ' + dates.join(', '),
    );
  });`,
        points: 5,
      },
      {
        id: 'sort-status',
        name: 'Сортировка по статусу начинается с возрастания',
        type: 'react',
        code: `const applications = [
  { id: 1, room: 'Коворкинг', date: '12.03.2027', status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '05.02.2027', status: 'Мероприятие завершено' },
  { id: 3, room: 'Аудитория', date: '19.04.2027', status: 'Мероприятие назначено' },
];
return ctx.render('AdminTable', { applications })
  .then(() => ctx.click('#sort-date'))
  .then(() => ctx.click('#sort-date'))
  .then(() => ctx.click('#sort-status'))
  .then(() => {
    const statuses = ctx.$$('tbody tr').map((row) => row.textContent);
    ctx.assert(
      statuses[0].indexOf('Мероприятие завершено') !== -1,
      'При переключении на другой столбец сортировка начинается заново по возрастанию. Первой ожидалось «Мероприятие завершено», получено: ' + statuses[0],
    );
  });`,
        points: 5,
      },
      {
        id: 'immutable',
        name: 'Исходный массив не испорчен',
        type: 'react',
        code: `const applications = [
  { id: 1, room: 'Коворкинг', date: '12.03.2027', status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '05.02.2027', status: 'Мероприятие завершено' },
  { id: 3, room: 'Аудитория', date: '19.04.2027', status: 'Мероприятие назначено' },
];
const before = applications.map((item) => item.id).join(',');
return ctx.render('AdminTable', { applications })
  .then(() => ctx.click('#sort-date'))
  .then(() => ctx.click('#sort-status'))
  .then(() => {
    ctx.assert(
      applications.map((item) => item.id).join(',') === before,
      'Проп изменился: был ' + before + ', стал ' + applications.map((item) => item.id).join(',') +
        '. Метод sort сортирует на месте — нужна копия',
    );
  });`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'В состоянии держите только столбец и направление. Отсортированный список вычисляется при отрисовке.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Дату ДД.ММ.ГГГГ удобно перевернуть для сравнения: date.split(".").reverse().join("-") — такие строки уже сравниваются правильно.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const sorted = applications.slice().sort((a, b) => { const result = key(a).localeCompare(key(b)); return direction === "asc" ? result : -result; });',
        penaltyPercent: 35,
      },
    ],
    solution: `function AdminTable({ applications }) {
  const [column, setColumn] = React.useState(null);
  const [direction, setDirection] = React.useState('asc');

  const sortBy = (name) => {
    if (name === column) {
      setDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setColumn(name);
    setDirection('asc');
  };

  const keyOf = (item) => (column === 'date' ? item.date.split('.').reverse().join('-') : item.status);

  const rows = column
    ? applications.slice().sort((a, b) => {
        const result = keyOf(a).localeCompare(keyOf(b), 'ru');
        return direction === 'asc' ? result : -result;
      })
    : applications;

  return (
    <table id="orders">
      <thead>
        <tr>
          <th>№</th>
          <th>Помещение</th>
          <th>
            <button id="sort-date" type="button" onClick={() => sortBy('date')}>
              Дата
            </button>
          </th>
          <th>
            <button id="sort-status" type="button" onClick={() => sortBy('status')}>
              Статус
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.room}</td>
            <td>{item.date}</td>
            <td>{item.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}`,
    solutionExplanation:
      'Копия перед сортировкой — не перестраховка. Метод sort меняет тот самый массив, который пришёл пропом, то есть данные родительского компонента. React об этом не узнает, перерисовка не запустится, и на экране окажется старый порядок при новых данных. Дата переворачивается в ГГГГ-ММ-ДД именно для сравнения: в таком виде обычное строковое сравнение даёт правильный хронологический порядок. И снова то же правило: в состоянии лежит только выбор пользователя, а отсортированный список вычисляется.',
    maxScore: 25,
    estimatedMinutes: 30,
    examRefs: ['m2-admin-tools', 'm1-admin'],
    planDays: ['day-18-4'],
    source: 'plan',
  },

  {
    id: 'task-admin-confirm-and-toast',
    title: 'Подтверждение действия и уведомление о результате',
    kind: 'app',
    runtime: 'react',
    difficulty: 3,
    tech: ['react'],
    topicIds: ['admin-panel', 'react-toast'],
    monthNo: 5,
    weekNo: 18,
    statement: `Два разных инструмента, которые путают. Окно с вопросом появляется **до** действия и спрашивает разрешения. Уведомление появляется **после** и сообщает результат. Перед необратимым действием подтверждение обязательно.

Компонент \`StatusChanger\` принимает \`{ application, onConfirm }\`, где \`onConfirm(id, status)\` возвращает промис.

1. Кнопка \`#complete\` — «Завершить мероприятие».
2. Нажатие **не** меняет статус сразу, а показывает окно \`#confirm\` с текстом, в котором есть номер заявки, и двумя кнопками: \`#confirm-yes\` и \`#confirm-no\`.
3. \`#confirm-no\` закрывает окно, \`onConfirm\` не вызывается.
4. \`#confirm-yes\` вызывает \`onConfirm(id, 'Мероприятие завершено')\`, закрывает окно и после успеха показывает уведомление \`#toast\` с текстом «Статус изменён».
5. Уведомление само исчезает через **3 секунды**, таймер снимается в функции очистки.`,
    requirements: [
      'Нажатие кнопки открывает окно подтверждения',
      'В тексте окна виден номер заявки',
      'Отказ закрывает окно и ничего не делает',
      'Согласие вызывает onConfirm и закрывает окно',
      'После успеха появляется уведомление',
      'Уведомление исчезает через 3 секунды, таймер снимается',
    ],
    starterCode: `function StatusChanger({ application, onConfirm }) {
  // подтверждение перед действием и уведомление после
}`,
    tests: [
      {
        id: 'confirm-opens',
        name: 'Окно подтверждения открывается',
        type: 'react',
        code: `const application = { id: 7, room: 'Коворкинг', status: 'Мероприятие назначено' };
return ctx.render('StatusChanger', { application, onConfirm: () => Promise.resolve() })
  .then(() => {
    ctx.assert(!ctx.$('#confirm'), 'До нажатия окна подтверждения быть не должно');
    return ctx.click('#complete');
  })
  .then(() => {
    const confirm = ctx.$('#confirm');
    ctx.assert(confirm, 'После нажатия должно появиться окно #confirm');
    ctx.assert(confirm.textContent.indexOf('7') !== -1, 'В тексте окна должен быть номер заявки, сейчас: ' + confirm.textContent);
    ctx.assert(ctx.$('#confirm-yes'), 'Нет кнопки подтверждения');
    ctx.assert(ctx.$('#confirm-no'), 'Нет кнопки отказа');
  });`,
        points: 5,
      },
      {
        id: 'no-action-before-confirm',
        name: 'До подтверждения ничего не происходит',
        type: 'react',
        code: `const application = { id: 7, room: 'Коворкинг', status: 'Мероприятие назначено' };
let called = 0;
return ctx.render('StatusChanger', { application, onConfirm: () => { called += 1; return Promise.resolve(); } })
  .then(() => ctx.click('#complete'))
  .then(() => {
    ctx.assert(called === 0, 'Нажатие кнопки не должно выполнять действие — сначала спрашиваем');
    ctx.assert(!ctx.$('#toast'), 'Уведомление появляется только после выполнения');
  });`,
        points: 4,
      },
      {
        id: 'cancel',
        name: 'Отказ закрывает окно',
        type: 'react',
        code: `const application = { id: 7, room: 'Коворкинг', status: 'Мероприятие назначено' };
let called = 0;
return ctx.render('StatusChanger', { application, onConfirm: () => { called += 1; return Promise.resolve(); } })
  .then(() => ctx.click('#complete'))
  .then(() => ctx.click('#confirm-no'))
  .then(() => {
    ctx.assert(!ctx.$('#confirm'), 'После отказа окно должно закрыться');
    ctx.assert(called === 0, 'После отказа действие выполняться не должно');
  });`,
        points: 5,
      },
      {
        id: 'confirm',
        name: 'Согласие выполняет действие',
        type: 'react',
        code: `const application = { id: 7, room: 'Коворкинг', status: 'Мероприятие назначено' };
const calls = [];
return ctx.render('StatusChanger', {
  application,
  onConfirm: (id, status) => { calls.push({ id, status }); return Promise.resolve(); },
})
  .then(() => ctx.click('#complete'))
  .then(() => ctx.click('#confirm-yes'))
  .then(() => ctx.advanceTime(50))
  .then(() => {
    ctx.assert(calls.length === 1, 'onConfirm должен вызваться один раз, вызовов: ' + calls.length);
    ctx.assert(
      calls[0].id === 7 && calls[0].status === 'Мероприятие завершено',
      'Переданы неверные значения: ' + ctx.preview(calls[0]),
    );
    ctx.assert(!ctx.$('#confirm'), 'После подтверждения окно закрывается');
    const toast = ctx.$('#toast');
    ctx.assert(toast, 'После успеха должно появиться уведомление #toast');
    ctx.assert(toast.textContent.indexOf('Статус изменён') !== -1, 'Текст уведомления не совпадает: ' + toast.textContent);
  });`,
        points: 6,
      },
      {
        id: 'toast-hides',
        name: 'Уведомление исчезает само',
        type: 'react',
        code: `const application = { id: 7, room: 'Коворкинг', status: 'Мероприятие назначено' };
return ctx.render('StatusChanger', { application, onConfirm: () => Promise.resolve() })
  .then(() => ctx.click('#complete'))
  .then(() => ctx.click('#confirm-yes'))
  .then(() => ctx.advanceTime(50))
  .then(() => {
    ctx.assert(ctx.$('#toast'), 'Уведомление должно появиться');
    return ctx.advanceTime(3200);
  })
  .then(() => {
    ctx.assert(!ctx.$('#toast'), 'Через 3 секунды уведомление должно исчезнуть');
  });`,
        points: 5,
      },
      {
        id: 'cleanup',
        name: 'Таймер снимается',
        type: 'react',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(/useEffect/.test(source), 'Таймер заводится в React.useEffect');
ctx.assert(/clearTimeout|clearInterval/.test(source), 'Эффект должен возвращать функцию очистки');
ctx.assert(!/window\\s*\\.\\s*confirm/.test(source), 'Окно подтверждения делаем своё: встроенное нельзя оформить и проверить');`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Нужны два независимых состояния: открыто ли окно подтверждения и показано ли уведомление.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Уведомление гасится тем же приёмом, что и в неделе 11: эффект с зависимостью от состояния, внутри setTimeout, наружу — clearTimeout.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const handleYes = () => { setAsking(false); onConfirm(application.id, "Мероприятие завершено").then(() => setToast(true)); };',
        penaltyPercent: 35,
      },
    ],
    solution: `function StatusChanger({ application, onConfirm }) {
  const [asking, setAsking] = React.useState(false);
  const [toast, setToast] = React.useState(false);

  React.useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleYes = () => {
    setAsking(false);
    onConfirm(application.id, 'Мероприятие завершено').then(() => setToast(true));
  };

  return (
    <div>
      <button id="complete" type="button" onClick={() => setAsking(true)}>
        Завершить мероприятие
      </button>

      {asking ? (
        <div id="confirm" role="dialog">
          <p>Завершить мероприятие по заявке №{application.id}? Отменить это будет нельзя.</p>
          <button id="confirm-yes" type="button" onClick={handleYes}>
            Да, завершить
          </button>
          <button id="confirm-no" type="button" onClick={() => setAsking(false)}>
            Отмена
          </button>
        </div>
      ) : null}

      {toast ? <div id="toast">Статус изменён</div> : null}
    </div>
  );
}`,
    solutionExplanation:
      'В вопросе стоит номер заявки, а не просто «Вы уверены?». Это принципиально: администратор работает со списком из десятков строк, и подтверждение без номера не защищает ни от чего — человек соглашается не глядя. Встроенное окно window.confirm не используется: его нельзя оформить, нельзя проверить автотестом, и оно останавливает весь браузер. Уведомление и подтверждение разведены по времени: одно спрашивает до, другое сообщает после, и путать их — значит либо пугать пользователя, либо делать необратимое без спроса.',
    maxScore: 29,
    estimatedMinutes: 35,
    examRefs: ['m2-admin-tools', 'm3-animations'],
    planDays: ['day-18-6'],
    source: 'plan',
  },

  {
    id: 'task-module1-checklist',
    title: 'Чек-лист первого модуля: что ещё не сделано',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['js', 'tools'],
    topicIds: ['ui-polish'],
    monthNo: 5,
    weekNo: 19,
    statement: `Перед прогоном полезно иметь список требований, по которому можно пройтись за две минуты. Соберите его в код — тогда сверка перестанет зависеть от памяти.

1. Массив \`MODULE_1\` — девять требований вида \`{ id, title, weight }\`. Идентификаторы и веса берите из задания:

\`\`\`
m1-db 3, m1-er 2, m1-oop-styles 2, m1-git 2, m1-register 4,
m1-login 3, m1-cabinet 4, m1-order 3, m1-admin 4
\`\`\`

2. \`missing(done)\` — принимает массив выполненных идентификаторов, возвращает невыполненные требования **в порядке убывания веса**. При равном весе порядок сохраняется исходный.
3. \`readiness(done)\` — процент готовности по весам, округлённый до целого.
4. \`nextStep(done)\` — заголовок самого тяжёлого невыполненного требования. Если всё сделано — \`'Модуль 1 готов'\`.`,
    requirements: [
      'Описаны все девять требований с весами',
      'missing возвращает невыполненные, тяжёлые первыми',
      'readiness считает процент по весам',
      'Полностью выполненный модуль даёт 100%',
      'nextStep подсказывает самое весомое дело',
    ],
    starterCode: `const MODULE_1 = [
  // { id: 'm1-db', title: '…', weight: 3 }, …
];

function missing(done) {
  // невыполненные, тяжёлые первыми
}

function readiness(done) {
  // процент по весам
}

function nextStep(done) {
  // за что браться дальше
}`,
    tests: [
      {
        id: 'table',
        name: 'Все девять требований описаны',
        type: 'assert',
        code: `const MODULE_1 = ctx.get('MODULE_1');
ctx.assert(Array.isArray(MODULE_1) && MODULE_1.length === 9, 'Требований должно быть девять, найдено: ' + (MODULE_1 || []).length);
const weights = {
  'm1-db': 3, 'm1-er': 2, 'm1-oop-styles': 2, 'm1-git': 2, 'm1-register': 4,
  'm1-login': 3, 'm1-cabinet': 4, 'm1-order': 3, 'm1-admin': 4,
};
Object.keys(weights).forEach((id) => {
  const item = MODULE_1.filter((entry) => entry.id === id)[0];
  ctx.assert(item, 'Нет требования ' + id);
  ctx.assert(item.weight === weights[id], 'У ' + id + ' вес должен быть ' + weights[id] + ', сейчас: ' + item.weight);
  ctx.assert(typeof item.title === 'string' && item.title.length >= 5, 'У ' + id + ' нет внятного заголовка');
});`,
        points: 5,
      },
      {
        id: 'missing-order',
        name: 'Невыполненные идут тяжёлыми вперёд',
        type: 'assert',
        code: `const missing = ctx.get('missing');
const result = missing(['m1-db', 'm1-er', 'm1-git', 'm1-login', 'm1-order']);
const ids = result.map((item) => item.id);
ctx.assert(ids.length === 4, 'Невыполненных должно остаться четыре, получено: ' + ids.join(', '));
const weights = result.map((item) => item.weight);
for (let i = 1; i < weights.length; i += 1) {
  ctx.assert(weights[i - 1] >= weights[i], 'Порядок по весу нарушен: ' + weights.join(', '));
}
ctx.assert(ids.indexOf('m1-oop-styles') !== -1, 'В списке не хватает m1-oop-styles');`,
        points: 5,
      },
      {
        id: 'missing-empty',
        name: 'Всё выполнено — пустой список',
        type: 'assert',
        code: `const MODULE_1 = ctx.get('MODULE_1');
const missing = ctx.get('missing');
const all = MODULE_1.map((item) => item.id);
ctx.assert(missing(all).length === 0, 'Когда всё сделано, список должен быть пустым');
ctx.assert(missing([]).length === 9, 'Когда ничего не сделано, в списке все девять');`,
        points: 3,
      },
      {
        id: 'readiness',
        name: 'Процент считается по весам',
        type: 'assert',
        code: `const MODULE_1 = ctx.get('MODULE_1');
const readiness = ctx.get('readiness');
ctx.assert(readiness([]) === 0, 'Пустой список — 0%, получено: ' + readiness([]));
ctx.assert(readiness(MODULE_1.map((item) => item.id)) === 100, 'Всё сделано — 100%, получено: ' + readiness(MODULE_1.map((item) => item.id)));
const partial = readiness(['m1-register', 'm1-cabinet', 'm1-admin']);
ctx.assert(partial === 44, 'Три требования по 4 из 27 — это 44%, получено: ' + partial, 44, partial);`,
        points: 5,
      },
      {
        id: 'next-step',
        name: 'Подсказка, за что браться',
        type: 'assert',
        code: `const MODULE_1 = ctx.get('MODULE_1');
const nextStep = ctx.get('nextStep');
const step = nextStep(['m1-db', 'm1-er', 'm1-git', 'm1-login', 'm1-order', 'm1-oop-styles']);
const heavy = MODULE_1.filter((item) => item.weight === 4).map((item) => item.title);
ctx.assert(heavy.indexOf(step) !== -1, 'Ожидалось одно из самых весомых требований, получено: ' + step);
ctx.assert(
  nextStep(MODULE_1.map((item) => item.id)) === 'Модуль 1 готов',
  'Когда всё сделано, нужно вернуть «Модуль 1 готов»',
);`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Устойчивую сортировку по убыванию веса даёт sort((a, b) => b.weight - a.weight): при равных весах порядок сохраняется.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Процент считается по сумме весов выполненных, делённой на сумму всех весов, и умноженной на 100.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const rest = missing(done); return rest.length === 0 ? "Модуль 1 готов" : rest[0].title;',
        penaltyPercent: 35,
      },
    ],
    solution: `const MODULE_1 = [
  { id: 'm1-db', title: 'Структура базы данных', weight: 3 },
  { id: 'm1-er', title: 'ER-диаграмма', weight: 2 },
  { id: 'm1-oop-styles', title: 'ООП и библиотека стилей', weight: 2 },
  { id: 'm1-git', title: 'Репозиторий и промежуточные коммиты', weight: 2 },
  { id: 'm1-register', title: 'Страница регистрации с валидацией', weight: 4 },
  { id: 'm1-login', title: 'Страница входа и переходы между формами', weight: 3 },
  { id: 'm1-cabinet', title: 'Личный кабинет с историей заявок', weight: 4 },
  { id: 'm1-order', title: 'Страница оформления заявки', weight: 3 },
  { id: 'm1-admin', title: 'Панель администратора со статусами', weight: 4 },
];

function missing(done) {
  return MODULE_1.filter((item) => done.indexOf(item.id) === -1).sort((a, b) => b.weight - a.weight);
}

function readiness(done) {
  const total = MODULE_1.reduce((sum, item) => sum + item.weight, 0);
  const earned = MODULE_1.filter((item) => done.indexOf(item.id) !== -1).reduce((sum, item) => sum + item.weight, 0);

  return Math.round((earned / total) * 100);
}

function nextStep(done) {
  const rest = missing(done);
  return rest.length === 0 ? 'Модуль 1 готов' : rest[0].title;
}`,
    solutionExplanation:
      'Сортировка по весу превращает список дел в очередь: сверху то, что даёт больше всего. На экзамене время кончается всегда, и вопрос «что дописывать в последние полчаса» решается именно так — не по порядку в задании, а по весу. Обратите внимание, что readiness считает проценты по весам, а не по количеству пунктов: сделать четыре лёгких требования и одно тяжёлое — совсем разные результаты, хотя пунктов поровну.',
    maxScore: 22,
    estimatedMinutes: 25,
    examRefs: ['m1-db', 'm1-register', 'm1-admin'],
    planDays: ['day-19-1'],
    source: 'plan',
  },

  {
    id: 'task-speed-module1-core',
    title: 'Прогон на скорость: ядро первого модуля',
    kind: 'api',
    runtime: 'js',
    difficulty: 4,
    tech: ['express', 'node', 'sql'],
    topicIds: ['ui-polish'],
    monthNo: 5,
    weekNo: 19,
    statement: `Второй прогон. Тема другая — **автосервис**, — но структура ровно та же, что вы писали в «Конференциях». В этом и смысл: проверить, что в голове осталась схема, а не заученный текст.

\`db.query(sql, params)\` возвращает промис.

1. \`VisitsRepository\` — класс с \`db\` в конструкторе:
   - \`create({ clientId, workId, date })\` → \`{ id }\` из \`insertId\`;
   - \`findByClient(clientId)\` → записи одного клиента;
   - \`changeStatus(id, status)\` → \`true\`/\`false\` по \`affectedRows\`; недопустимый статус выбрасывает ошибку «Недопустимый статус».
2. Допустимые статусы: «Записан», «В работе», «Готово».
3. \`createVisit(repo)\` — обработчик \`(req, res)\`: без \`req.user\` → \`401\`; без \`workId\` или \`date\` → \`400\` и \`{ error: 'Укажите работу и дату' }\`; дата не \`ГГГГ-ММ-ДД\` → \`400\` и \`{ error: 'Неверный формат даты' }\`; иначе \`201\` и \`{ id }\`.

Засеките время. Ориентир — 30 минут.`,
    requirements: [
      'Репозиторий сохраняет db и работает через параметры',
      'create возвращает номер записи',
      'findByClient передаёт номер клиента параметром',
      'Недопустимый статус выбрасывает ошибку до запроса',
      'Обработчик проверяет вход, поля и формат даты',
      'Успешное создание отвечает кодом 201',
    ],
    starterCode: `const ALLOWED_STATUSES = ['Записан', 'В работе', 'Готово'];

class VisitsRepository {
  constructor(db) {
    // ваш код
  }
}

function createVisit(repo) {
  return async function (req, res) {
    // ваш код
  };
}`,
    tests: [
      {
        id: 'create',
        name: 'Запись создаётся',
        type: 'assert',
        code: `const Repo = ctx.get('VisitsRepository');
const calls = [];
const db = { query: (sql, params) => { calls.push({ sql, params }); return Promise.resolve({ insertId: 5 }); } };
return new Repo(db).create({ clientId: 1, workId: 2, date: '2027-03-12' }).then(function (result) {
  ctx.assert(result && result.id === 5, 'Ожидалось { id: 5 }, получено: ' + ctx.preview(result));
  ctx.assert(calls[0].params && calls[0].params.length === 3, 'Передаются три значения параметрами');
  ctx.assert(String(calls[0].sql).indexOf('2027-03-12') === -1, 'Дата не должна попадать в текст запроса');
});`,
        points: 4,
      },
      {
        id: 'find',
        name: 'Записи клиента',
        type: 'assert',
        code: `const Repo = ctx.get('VisitsRepository');
const calls = [];
const db = { query: (sql, params) => { calls.push({ sql, params }); return Promise.resolve([{ id: 1 }]); } };
return new Repo(db).findByClient(9).then(function (rows) {
  ctx.assert(Array.isArray(rows), 'Метод должен вернуть массив');
  ctx.assert(calls[0].params && calls[0].params[0] === 9, 'Номер клиента уходит параметром, сейчас: ' + ctx.preview(calls[0].params));
});`,
        points: 3,
      },
      {
        id: 'status',
        name: 'Смена статуса',
        type: 'assert',
        code: `const Repo = ctx.get('VisitsRepository');
const ok = new Repo({ query: () => Promise.resolve({ affectedRows: 1 }) });
const none = new Repo({ query: () => Promise.resolve({ affectedRows: 0 }) });
return Promise.all([ok.changeStatus(1, 'В работе'), none.changeStatus(99, 'Готово')]).then(function (results) {
  ctx.assert(results[0] === true, 'При успешной смене нужно true, получено: ' + ctx.preview(results[0]));
  ctx.assert(results[1] === false, 'Если строка не изменилась — false, получено: ' + ctx.preview(results[1]));
});`,
        points: 4,
      },
      {
        id: 'status-invalid',
        name: 'Недопустимый статус до базы не доходит',
        type: 'assert',
        code: `const Repo = ctx.get('VisitsRepository');
let called = false;
const repo = new Repo({ query: () => { called = true; return Promise.resolve({ affectedRows: 1 }); } });
return Promise.resolve()
  .then(() => repo.changeStatus(1, 'Отменено'))
  .then(
    () => ctx.assert(false, 'Недопустимый статус должен выбрасывать ошибку'),
    (error) => {
      ctx.assert(String(error.message || error).indexOf('Недопустимый статус') !== -1, 'Текст ошибки не совпадает');
      ctx.assert(called === false, 'Проверка идёт до обращения к базе');
    },
  );`,
        points: 5,
      },
      {
        id: 'handler-validation',
        name: 'Обработчик проверяет вход и поля',
        type: 'assert',
        code: `const createVisit = ctx.get('createVisit');
const repo = { create: () => Promise.resolve({ id: 1 }) };
const make = () => { const s = { code: 200, body: null }; s.res = { status: (c) => { s.code = c; return s.res; }, json: (b) => { s.body = b; return s.res; } }; return s; };
const guest = make();
const empty = make();
const badDate = make();
return Promise.all([
  createVisit(repo)({ body: { workId: 1, date: '2027-03-12' } }, guest.res),
  createVisit(repo)({ user: { id: 1 }, body: { workId: '', date: '' } }, empty.res),
  createVisit(repo)({ user: { id: 1 }, body: { workId: 1, date: '12.03.2027' } }, badDate.res),
]).then(function () {
  ctx.assert(guest.code === 401, 'Без входа — 401, сейчас: ' + guest.code);
  ctx.assert(empty.code === 400 && empty.body.error === 'Укажите работу и дату', 'Пустые поля: ' + empty.code + ' ' + ctx.preview(empty.body));
  ctx.assert(badDate.code === 400 && badDate.body.error === 'Неверный формат даты', 'Формат даты: ' + badDate.code + ' ' + ctx.preview(badDate.body));
});`,
        points: 6,
      },
      {
        id: 'handler-created',
        name: 'Успешное создание — 201',
        type: 'assert',
        code: `const createVisit = ctx.get('createVisit');
const calls = [];
const repo = { create: (data) => { calls.push(data); return Promise.resolve({ id: 21 }); } };
let code = 200;
let body = null;
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return createVisit(repo)({ user: { id: 4 }, body: { workId: 2, date: '2027-03-12' } }, res).then(function () {
  ctx.assert(code === 201, 'Ожидался код 201, сейчас: ' + code, 201, code);
  ctx.assert(body && body.id === 21, 'В ответе должен быть номер записи, получено: ' + ctx.preview(body));
  ctx.assert(calls[0] && calls[0].clientId === 4, 'Номер клиента берётся из req.user, получено: ' + ctx.preview(calls[0]));
});`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Структура та же, что в «Конференциях»: репозиторий с четырьмя методами и обработчик с лесенкой проверок.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Номер клиента берите из req.user.id, а не из тела запроса: иначе можно создать запись от чужого имени.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const result = await repo.create({ clientId: req.user.id, workId, date }); return res.status(201).json({ id: result.id });',
        penaltyPercent: 35,
      },
    ],
    solution: `const ALLOWED_STATUSES = ['Записан', 'В работе', 'Готово'];

class VisitsRepository {
  constructor(db) {
    this.db = db;
  }

  async create(data) {
    const result = await this.db.query(
      'INSERT INTO visits (client_id, work_id, visit_date) VALUES (?, ?, ?)',
      [data.clientId, data.workId, data.date],
    );

    return { id: result.insertId };
  }

  async findByClient(clientId) {
    return this.db.query('SELECT * FROM visits WHERE client_id = ? ORDER BY id', [clientId]);
  }

  async changeStatus(id, status) {
    if (ALLOWED_STATUSES.indexOf(status) === -1) {
      throw new Error('Недопустимый статус');
    }

    const result = await this.db.query('UPDATE visits SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
  }
}

function createVisit(repo) {
  return async function (req, res) {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется вход' });
    }

    const body = req.body || {};

    if (!body.workId || !body.date) {
      return res.status(400).json({ error: 'Укажите работу и дату' });
    }

    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(String(body.date))) {
      return res.status(400).json({ error: 'Неверный формат даты' });
    }

    try {
      const result = await repo.create({ clientId: req.user.id, workId: body.workId, date: body.date });
      return res.status(201).json({ id: result.id });
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  };
}`,
    solutionExplanation:
      'Номер клиента берётся из req.user.id, а не из тела запроса — это защита, а не мелочь. Если доверять телу, любой вошедший создаст запись от имени соседа, просто подставив чужой номер. Правило общее: всё, что идентифицирует отправителя, берётся из проверенного токена, и никогда — из того, что прислал сам отправитель. Остальное — точная копия структуры «Конференций»: те же четыре метода, та же лесенка проверок, другие слова.',
    maxScore: 27,
    estimatedMinutes: 30,
    timeLimitMs: 1_800_000,
    examRefs: ['m1-order', 'm1-cabinet', 'm3-quality'],
    planDays: ['day-19-3'],
    source: 'plan',
  },

  {
    id: 'task-speed-db-autoservice',
    title: 'Прогон на скорость: база и роли за 40 минут',
    kind: 'db',
    runtime: 'sql',
    difficulty: 4,
    tech: ['sql'],
    topicIds: ['ui-polish'],
    monthNo: 5,
    weekNo: 19,
    statement: `Тот же автосервис, теперь база. **40 минут** — как на экзамене, где на схему и первые данные времени столько же.

1. \`users\` — \`id\`, \`login\` (обязательный, уникальный), \`password_hash\` (обязательный), \`full_name\` (обязательный), \`phone\` (обязательный), \`role\` (по умолчанию \`'user'\`).
2. \`works\` — \`id\`, \`title\` (обязательный, уникальный), \`price\` (дробное с копейками, обязательное).
3. \`visits\` — \`id\`, \`user_id\`, \`work_id\` (обязательные внешние ключи), \`visit_date\` (обязательная), \`status\` (по умолчанию \`'Записан'\`).
4. Заполните: три работы, обычный пользователь, администратор (\`role\` = \`'admin'\`), две записи обычного пользователя.
5. Напишите ещё один запрос — список записей с названием работы и ценой, отсортированный по дате: столбцы \`id\`, \`title\`, \`price\`, \`visit_date\`.

Пятый пункт — то самое соединение таблиц, без которого кабинет покажет номера вместо названий.`,
    requirements: [
      'Три таблицы с ключами и связями',
      'Роль по умолчанию user, есть администратор',
      'Статус по умолчанию «Записан»',
      'Справочник работ заполнен тремя записями',
      'Добавлены две записи обычного пользователя',
      'Запрос соединяет записи со справочником работ',
    ],
    starterCode: `-- Автосервис: база и данные за 40 минут

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
          { name: 'role', notNull: true },
        ],
        points: 4,
      },
      {
        id: 'visits',
        name: 'Записи связаны с пользователем и работой',
        type: 'sql-schema',
        table: 'visits',
        columns: [
          { name: 'id', pk: true },
          { name: 'user_id', notNull: true },
          { name: 'work_id', notNull: true },
          { name: 'visit_date', notNull: true },
          { name: 'status', notNull: true },
        ],
        foreignKeys: [
          { column: 'user_id', refTable: 'users' },
          { column: 'work_id', refTable: 'works' },
        ],
        points: 5,
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
        id: 'works',
        name: 'Справочник работ заполнен',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM works`,
        expectedRows: [[3]],
        points: 3,
      },
      {
        id: 'visits-data',
        name: 'Записи добавлены со статусом по умолчанию',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM visits WHERE status = 'Записан'`,
        expectedRows: [[2]],
        points: 4,
      },
      {
        id: 'join',
        name: 'Соединение записей со справочником',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM visits v JOIN works w ON w.id = v.work_id JOIN users u ON u.id = v.user_id WHERE u.role = 'user'`,
        expectedRows: [[2]],
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Скелет тот же, что в «Конференциях»: пользователи, справочник, записи. Начните с users и works — на них ссылается всё остальное.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Обычного пользователя добавляйте без столбца role, администратору укажите role явно — так видно, что значение по умолчанию работает.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'SELECT v.id, w.title, w.price, v.visit_date FROM visits v JOIN works w ON w.id = v.work_id ORDER BY v.visit_date;',
        penaltyPercent: 35,
      },
    ],
    solution: `CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user'
);

CREATE TABLE works (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE visits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  work_id INT NOT NULL,
  visit_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Записан',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (work_id) REFERENCES works(id)
);

INSERT INTO works (id, title, price) VALUES
  (1, 'Замена масла', 1900.50),
  (2, 'Диагностика подвески', 2500.00),
  (3, 'Шиномонтаж', 3200.00);

INSERT INTO users (id, login, password_hash, full_name, phone) VALUES
  (1, 'ivanov26', 'hash', 'Иванов Иван Иванович', '+79990000001');

INSERT INTO users (id, login, password_hash, full_name, phone, role) VALUES
  (2, 'Admin26', 'hash', 'Администратор', '+79990000002', 'admin');

INSERT INTO visits (user_id, work_id, visit_date) VALUES
  (1, 1, '2027-03-12'),
  (1, 3, '2027-04-02');

SELECT v.id, w.title, w.price, v.visit_date
FROM visits v
JOIN works w ON w.id = v.work_id
ORDER BY v.visit_date;`,
    solutionExplanation:
      'Схема собрана за несколько минут, потому что это тот же скелет: люди, справочник, записи. Соединение в последнем запросе — ровно то, что нужно кабинету: в таблице visits лежит work_id, а пользователю надо показать «Замена масла, 1900.50». Писать это соединение в кабинете руками каждый раз не нужно — запрос один раз кладут в репозиторий и зовут по имени метода.',
    maxScore: 26,
    estimatedMinutes: 40,
    timeLimitMs: 2_400_000,
    examRefs: ['m1-db', 'm1-cabinet', 'm1-admin'],
    planDays: ['day-19-4'],
    source: 'plan',
  },

  {
    id: 'task-speed-order-cabinet',
    title: 'Прогон на скорость: заявка и кабинет за 30 минут',
    kind: 'app',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['ui-polish'],
    monthNo: 5,
    weekNo: 19,
    statement: `Третий кусок на время: две страницы автосервиса. **30 минут**.

Компонент \`ServicePage\` принимает \`{ works, visits, onCreate }\`, где \`onCreate(data)\` возвращает промис.

**Форма записи:**

1. выпадающий список \`select[name="workId"]\` — работы из пропа \`works\` (\`{ id, title }\`), первый вариант пустой «Выберите работу»;
2. поле \`input[name="date"]\` типа \`date\`;
3. кнопка отправки. Если что-то не выбрано — в \`#form-error\` появляется «Заполните все поля», \`onCreate\` не вызывается;
4. при успехе вызывается \`onCreate({ workId, date })\`, и в \`#form-error\` пусто.

**Список записей:**

5. карточки \`.visit\` из пропа \`visits\` (\`{ id, title, date, status }\`), дата уже в формате ДД.ММ.ГГГГ;
6. если записей нет — текст «Записей пока нет» вместо списка.`,
    requirements: [
      'Список работ строится из пропа и начинается с пустого варианта',
      'Незаполненная форма показывает ошибку и не вызывает onCreate',
      'Заполненная форма вызывает onCreate с выбранными значениями',
      'Записи выводятся карточками с датой и статусом',
      'Пустой список объяснён текстом',
    ],
    starterCode: `function ServicePage({ works, visits, onCreate }) {
  // форма записи и список записей
}`,
    tests: [
      {
        id: 'select',
        name: 'Список работ из пропа',
        type: 'react',
        code: `const works = [{ id: 1, title: 'Замена масла' }, { id: 2, title: 'Шиномонтаж' }];
return ctx.render('ServicePage', { works, visits: [], onCreate: () => Promise.resolve() }).then(() => {
  const select = ctx.$('select[name="workId"]');
  ctx.assert(select, 'Нет выпадающего списка с name="workId"');
  const options = Array.prototype.slice.call(select.options);
  ctx.assert(options[0].value === '', 'Первым должен идти пустой вариант «Выберите работу»');
  const titles = options.map((option) => option.textContent.trim());
  ctx.assert(titles.indexOf('Замена масла') !== -1, 'В списке нет работы из пропа, сейчас: ' + titles.join(' | '));
  ctx.assert(ctx.$('input[name="date"]'), 'Нет поля даты');
});`,
        points: 4,
      },
      {
        id: 'validation',
        name: 'Пустая форма не отправляется',
        type: 'react',
        code: `const works = [{ id: 1, title: 'Замена масла' }];
let called = 0;
return ctx.render('ServicePage', { works, visits: [], onCreate: () => { called += 1; return Promise.resolve(); } })
  .then(() => ctx.change('select[name="workId"]', ''))
  .then(() => ctx.change('input[name="date"]', ''))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(called === 0, 'При незаполненной форме onCreate вызываться не должен');
    ctx.assert(
      ctx.text('#form-error').indexOf('Заполните все поля') !== -1,
      'Нет сообщения об ошибке, сейчас: ' + ctx.text('#form-error'),
    );
  });`,
        points: 5,
      },
      {
        id: 'submit',
        name: 'Заполненная форма отправляется',
        type: 'react',
        code: `const works = [{ id: 1, title: 'Замена масла' }, { id: 2, title: 'Шиномонтаж' }];
const calls = [];
return ctx.render('ServicePage', { works, visits: [], onCreate: (data) => { calls.push(data); return Promise.resolve(); } })
  .then(() => ctx.change('select[name="workId"]', '2'))
  .then(() => ctx.change('input[name="date"]', '2027-03-12'))
  .then(() => ctx.submit('form'))
  .then(() => ctx.advanceTime(50))
  .then(() => {
    ctx.assert(calls.length === 1, 'onCreate должен вызваться один раз, вызовов: ' + calls.length);
    ctx.assert(String(calls[0].workId) === '2', 'Передан неверный номер работы: ' + ctx.preview(calls[0]));
    ctx.assert(calls[0].date === '2027-03-12', 'Передана неверная дата: ' + ctx.preview(calls[0]));
    ctx.assert(ctx.text('#form-error') === '', 'После успешной отправки сообщение об ошибке должно исчезнуть');
  });`,
        points: 6,
      },
      {
        id: 'visits',
        name: 'Записи выводятся карточками',
        type: 'react',
        code: `const works = [{ id: 1, title: 'Замена масла' }];
const visits = [
  { id: 1, title: 'Замена масла', date: '12.03.2027', status: 'Записан' },
  { id: 2, title: 'Шиномонтаж', date: '02.04.2027', status: 'Готово' },
];
return ctx.render('ServicePage', { works, visits, onCreate: () => Promise.resolve() }).then(() => {
  const cards = ctx.$$('.visit');
  ctx.assert(cards.length === 2, 'Карточек должно быть две, найдено: ' + cards.length, 2, cards.length);
  const text = ctx.text();
  ctx.assert(text.indexOf('12.03.2027') !== -1, 'В карточке нет даты');
  ctx.assert(text.indexOf('Готово') !== -1, 'В карточке нет статуса');
});`,
        points: 5,
      },
      {
        id: 'empty',
        name: 'Пустой список объяснён',
        type: 'react',
        code: `const works = [{ id: 1, title: 'Замена масла' }];
return ctx.render('ServicePage', { works, visits: [], onCreate: () => Promise.resolve() }).then(() => {
  ctx.assert(ctx.$$('.visit').length === 0, 'Карточек быть не должно');
  ctx.assert(ctx.text().indexOf('Записей пока нет') !== -1, 'Нужен текст «Записей пока нет»');
});`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Два поля — два состояния или один объект. Для двух полей проще две переменные.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Не забудьте event.preventDefault() в обработчике отправки, иначе страница перезагрузится и всё сбросится.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: '{visits.length ? visits.map((v) => <article className="visit" key={v.id}>…</article>) : <p>Записей пока нет</p>}',
        penaltyPercent: 35,
      },
    ],
    solution: `function ServicePage({ works, visits, onCreate }) {
  const [workId, setWorkId] = React.useState('');
  const [date, setDate] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!workId || !date) {
      setError('Заполните все поля');
      return;
    }

    setError('');
    onCreate({ workId, date });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="workId">Работа</label>
        <select id="workId" name="workId" value={workId} onChange={(event) => setWorkId(event.target.value)}>
          <option value="">Выберите работу</option>
          {works.map((work) => (
            <option value={work.id} key={work.id}>
              {work.title}
            </option>
          ))}
        </select>

        <label htmlFor="date">Дата</label>
        <input id="date" name="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />

        <button type="submit">Записаться</button>
        <p id="form-error">{error}</p>
      </form>

      {visits.length > 0 ? (
        <div>
          {visits.map((visit) => (
            <article className="visit" key={visit.id}>
              <h3>{visit.title}</h3>
              <p>{visit.date}</p>
              <p>{visit.status}</p>
            </article>
          ))}
        </div>
      ) : (
        <p>Записей пока нет</p>
      )}
    </div>
  );
}`,
    solutionExplanation:
      'Пустой первый вариант в списке работ делает проверку осмысленной: пока пользователь ничего не выбрал, значение остаётся пустым, и форма не отправится. Без него первая работа окажется выбранной по умолчанию, и человек запишется на замену масла, ничего не выбирая. Пустое состояние списка выводится вместо карточек, а не рядом: пользователь должен увидеть объяснение там, где ожидал данные.',
    maxScore: 24,
    estimatedMinutes: 30,
    timeLimitMs: 1_800_000,
    examRefs: ['m1-order', 'm1-cabinet', 'm2-order-form'],
    planDays: ['day-19-5'],
    source: 'plan',
  },

  {
    id: 'task-speed-admin-panel',
    title: 'Прогон на скорость: админка за 30 минут',
    kind: 'app',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['ui-polish'],
    monthNo: 5,
    weekNo: 19,
    statement: `Последний кусок первого модуля — и обычно самый недоделанный: на админку времени остаётся меньше всего. Потренируйте её отдельно. **30 минут**.

Компонент \`AdminPanel\` принимает \`{ visits, onChangeStatus }\`, где \`visits\` — массив \`{ id, client, work, date, status }\`, а \`onChangeStatus(id, status)\` возвращает промис.

1. Таблица \`#visits\` со строкой на запись: номер, клиент, работа, дата, список статусов \`select.status\` («Записан», «В работе», «Готово»).
2. Фильтр \`#filter\` по статусу: пустое значение — все.
3. Счётчик \`#count\` — сколько записей показано сейчас.
4. Смена статуса обновляет строку на месте; при отказе сервера строка возвращается к прежнему статусу.
5. Если после фильтрации ничего не осталось — «Записей с таким статусом нет».`,
    requirements: [
      'Таблица строится из массива записей',
      'Фильтр по статусу работает',
      'Счётчик показывает количество видимых записей',
      'Смена статуса обновляет строку без перезагрузки',
      'Отказ сервера возвращает прежний статус',
      'Пустой результат объяснён текстом',
    ],
    starterCode: `const STATUSES = ['Записан', 'В работе', 'Готово'];

function AdminPanel({ visits, onChangeStatus }) {
  // таблица, фильтр, счётчик, смена статуса
}`,
    tests: [
      {
        id: 'table',
        name: 'Таблица записей',
        type: 'react',
        code: `const visits = [
  { id: 1, client: 'Иванов', work: 'Замена масла', date: '12.03.2027', status: 'Записан' },
  { id: 2, client: 'Петров', work: 'Шиномонтаж', date: '02.04.2027', status: 'Готово' },
];
return ctx.render('AdminPanel', { visits, onChangeStatus: () => Promise.resolve() })
  .then(() => ctx.change('#filter', ''))
  .then(() => {
    ctx.assert(ctx.$('#visits'), 'Нет таблицы #visits');
    ctx.assert(ctx.$$('tbody tr').length === 2, 'Строк должно быть две, найдено: ' + ctx.$$('tbody tr').length);
    ctx.assert(ctx.$$('select.status').length === 2, 'В каждой строке нужен список статусов');
    ctx.assert(ctx.text('#count').indexOf('2') !== -1, 'Счётчик должен показывать 2, сейчас: ' + ctx.text('#count'));
  });`,
        points: 5,
      },
      {
        id: 'filter',
        name: 'Фильтр по статусу',
        type: 'react',
        code: `const visits = [
  { id: 1, client: 'Иванов', work: 'Замена масла', date: '12.03.2027', status: 'Записан' },
  { id: 2, client: 'Петров', work: 'Шиномонтаж', date: '02.04.2027', status: 'Готово' },
];
return ctx.render('AdminPanel', { visits, onChangeStatus: () => Promise.resolve() })
  .then(() => ctx.change('#filter', 'Готово'))
  .then(() => {
    const rows = ctx.$$('tbody tr');
    ctx.assert(rows.length === 1, 'Должна остаться одна строка, найдено: ' + rows.length, 1, rows.length);
    ctx.assert(rows[0].textContent.indexOf('Петров') !== -1, 'Осталась не та строка: ' + rows[0].textContent);
    ctx.assert(ctx.text('#count').indexOf('1') !== -1, 'Счётчик должен показывать 1, сейчас: ' + ctx.text('#count'));
  });`,
        points: 5,
      },
      {
        id: 'empty',
        name: 'Пустой результат объяснён',
        type: 'react',
        // Компонент между проверками не пересоздаётся, поэтому статус,
        // которого заведомо нет, определяем по тому, что сейчас на экране.
        code: `const visits = [{ id: 1, client: 'Иванов', work: 'Замена масла', date: '12.03.2027', status: 'Записан' }];
return ctx.render('AdminPanel', { visits, onChangeStatus: () => Promise.resolve() })
  .then(() => ctx.change('#filter', ''))
  .then(() => {
    const present = ctx.$$('select.status').map((select) => select.value);
    const absent = ['Записан', 'В работе', 'Готово'].filter((status) => present.indexOf(status) === -1)[0];
    ctx.assert(absent, 'Не удалось подобрать отсутствующий статус для проверки');
    return ctx.change('#filter', absent);
  })
  .then(() => {
    ctx.assert(ctx.$$('tbody tr').length === 0, 'После фильтра строк остаться не должно');
    ctx.assert(ctx.text().indexOf('Записей с таким статусом нет') !== -1, 'Нужен текст про пустой результат');
  });`,
        points: 4,
      },
      {
        id: 'change',
        name: 'Смена статуса обновляет строку',
        type: 'react',
        code: `const visits = [{ id: 1, client: 'Иванов', work: 'Замена масла', date: '12.03.2027', status: 'Записан' }];
const calls = [];
return ctx.render('AdminPanel', { visits, onChangeStatus: (id, status) => { calls.push({ id, status }); return Promise.resolve(); } })
  .then(() => ctx.change('#filter', ''))
  .then(() => ctx.change('select.status', 'В работе'))
  .then(() => ctx.advanceTime(50))
  .then(() => {
    ctx.assert(calls.length === 1, 'onChangeStatus должен вызваться один раз, вызовов: ' + calls.length);
    ctx.assert(ctx.$('select.status').value === 'В работе', 'Строка должна показать новый статус');
  });`,
        points: 6,
      },
      {
        id: 'rollback',
        name: 'Отказ возвращает прежний статус',
        type: 'react',
        code: `const visits = [{ id: 2, client: 'Петров', work: 'Шиномонтаж', date: '02.04.2027', status: 'Записан' }];
let before = '';
return ctx.render('AdminPanel', { visits, onChangeStatus: () => Promise.reject(new Error('отказ')) })
  .then(() => ctx.change('#filter', ''))
  .then(() => {
    before = ctx.$('select.status').value;
    const target = ['Записан', 'В работе', 'Готово'].filter((status) => status !== before)[0];
    return ctx.change('select.status', target);
  })
  .then(() => ctx.advanceTime(100))
  .then(() => {
    ctx.assert(
      ctx.$('select.status').value === before,
      'После отказа статус должен вернуться к «' + before + '», сейчас: ' + ctx.$('select.status').value,
    );
  });`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Записи кладите в состояние: строку нужно будет обновлять. Фильтр — отдельное состояние, отфильтрованный список вычисляется.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Прежний статус запомните до запроса — в catch из состояния его уже не достать, там новое значение.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const update = (id, status) => setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));',
        penaltyPercent: 35,
      },
    ],
    solution: `const STATUSES = ['Записан', 'В работе', 'Готово'];

function AdminPanel({ visits, onChangeStatus }) {
  const [items, setItems] = React.useState(visits);
  const [filter, setFilter] = React.useState('');

  const update = (id, status) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const handleChange = (item, status) => {
    const previous = item.status;
    update(item.id, status);
    onChangeStatus(item.id, status).catch(() => update(item.id, previous));
  };

  const visible = items.filter((item) => !filter || item.status === filter);

  return (
    <div>
      <label htmlFor="filter">Статус</label>
      <select id="filter" value={filter} onChange={(event) => setFilter(event.target.value)}>
        <option value="">Все</option>
        {STATUSES.map((status) => (
          <option value={status} key={status}>
            {status}
          </option>
        ))}
      </select>

      <p id="count">Показано записей: {visible.length}</p>

      {visible.length > 0 ? (
        <table id="visits">
          <thead>
            <tr>
              <th>№</th>
              <th>Клиент</th>
              <th>Работа</th>
              <th>Дата</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.client}</td>
                <td>{item.work}</td>
                <td>{item.date}</td>
                <td>
                  <select
                    className="status"
                    value={item.status}
                    onChange={(event) => handleChange(item, event.target.value)}
                  >
                    {STATUSES.map((status) => (
                      <option value={status} key={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Записей с таким статусом нет</p>
      )}
    </div>
  );
}`,
    solutionExplanation:
      'Админка — это те же четыре приёма, что уже отработаны: список из массива, фильтр как вычисляемое значение, обновление строки копией объекта и откат при отказе. Собранная из готовых кусков, она занимает не полчаса, а десять минут — и именно поэтому её стоит прогонять отдельно. На экзамене админка идёт последней, и разница между «успел» и «не успел» обычно в том, приходится ли вспоминать эти приёмы заново.',
    maxScore: 26,
    estimatedMinutes: 30,
    timeLimitMs: 1_800_000,
    examRefs: ['m1-admin', 'm2-admin-tools'],
    planDays: ['day-19-6'],
    source: 'plan',
  },

  {
    id: 'task-form-errors-client-and-server',
    title: 'Подсказки об ошибках: браузер и сервер в одном месте',
    kind: 'app',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['ui-polish'],
    monthNo: 5,
    weekNo: 20,
    statement: `Ошибку может найти браузер (поле заполнено неправильно) или сервер (логин уже занят). Пользователю всё равно, кто её нашёл: подсказка должна появиться в одном и том же месте — рядом с полем.

Компонент \`RegisterForm\` принимает \`{ onSubmit }\`, где \`onSubmit(values)\` возвращает промис. Отклонённый промис приходит с объектом вида \`{ fields: { login: 'Логин занят' } }\`.

1. Поля \`login\` и \`email\`, оба управляемые, блоки ошибок \`#login-error\` и \`#email-error\`.
2. Свои проверки: логин — латиница и цифры от 6 символов, e-mail — есть собака и точка после неё. При ошибке \`onSubmit\` **не вызывается**.
3. Если свои проверки прошли, вызывается \`onSubmit\`. Ошибки, пришедшие от сервера, раскладываются по тем же блокам.
4. Ошибка сервера без привязки к полю (\`{ message: 'Сервер недоступен' }\`) выводится в общий блок \`#form-error\`.
5. Любой ввод в поле стирает его прежнюю ошибку — и свою, и серверную.`,
    requirements: [
      'Свои проверки не пускают запрос на сервер',
      'Ошибки сервера появляются рядом с нужными полями',
      'Общая ошибка сервера выводится отдельно',
      'Ввод в поле стирает его ошибку',
      'Успешная отправка очищает все сообщения',
    ],
    starterCode: `function RegisterForm({ onSubmit }) {
  // свои проверки и ошибки сервера в одних и тех же блоках
}`,
    tests: [
      {
        id: 'client-validation',
        name: 'Свои проверки не пускают запрос',
        type: 'react',
        code: `let called = 0;
return ctx.render('RegisterForm', { onSubmit: () => { called += 1; return Promise.resolve(); } })
  .then(() => ctx.change('input[name="login"]', 'ив'))
  .then(() => ctx.change('input[name="email"]', 'ivanov'))
  .then(() => ctx.submit('form'))
  .then(() => ctx.advanceTime(50))
  .then(() => {
    ctx.assert(called === 0, 'При своих ошибках запрос на сервер уходить не должен');
    ctx.assert(ctx.text('#login-error').length > 0, 'Нет сообщения об ошибке логина');
    ctx.assert(ctx.text('#email-error').length > 0, 'Нет сообщения об ошибке e-mail');
  });`,
        points: 5,
      },
      {
        id: 'server-field-error',
        name: 'Ошибка сервера встаёт рядом с полем',
        type: 'react',
        code: `const onSubmit = () => Promise.reject({ fields: { login: 'Логин занят' } });
return ctx.render('RegisterForm', { onSubmit })
  .then(() => ctx.change('input[name="login"]', 'ivanov26'))
  .then(() => ctx.change('input[name="email"]', 'ivanov@example.com'))
  .then(() => ctx.submit('form'))
  .then(() => ctx.advanceTime(100))
  .then(() => {
    ctx.assert(
      ctx.text('#login-error').indexOf('Логин занят') !== -1,
      'Ошибка сервера должна попасть в тот же блок, что и своя. Сейчас: ' + ctx.text('#login-error'),
    );
    ctx.assert(ctx.text('#email-error') === '', 'У поля e-mail ошибки нет, блок должен быть пуст');
  });`,
        points: 6,
      },
      {
        id: 'server-common-error',
        name: 'Общая ошибка сервера выводится отдельно',
        type: 'react',
        code: `const onSubmit = () => Promise.reject({ message: 'Сервер недоступен' });
return ctx.render('RegisterForm', { onSubmit })
  .then(() => ctx.change('input[name="login"]', 'ivanov26'))
  .then(() => ctx.change('input[name="email"]', 'ivanov@example.com'))
  .then(() => ctx.submit('form'))
  .then(() => ctx.advanceTime(100))
  .then(() => {
    ctx.assert(
      ctx.text('#form-error').indexOf('Сервер недоступен') !== -1,
      'Ошибка без привязки к полю выводится в #form-error, сейчас: ' + ctx.text('#form-error'),
    );
  });`,
        points: 5,
      },
      {
        id: 'typing-clears',
        name: 'Ввод стирает прежнюю ошибку',
        type: 'react',
        code: `const onSubmit = () => Promise.reject({ fields: { login: 'Логин занят' } });
return ctx.render('RegisterForm', { onSubmit })
  .then(() => ctx.change('input[name="login"]', 'ivanov26'))
  .then(() => ctx.change('input[name="email"]', 'ivanov@example.com'))
  .then(() => ctx.submit('form'))
  .then(() => ctx.advanceTime(100))
  .then(() => {
    ctx.assert(ctx.text('#login-error').length > 0, 'Ошибка должна была появиться');
    return ctx.change('input[name="login"]', 'ivanov27');
  })
  .then(() => {
    ctx.assert(
      ctx.text('#login-error') === '',
      'После правки поля его сообщение должно исчезнуть: висящая подсказка про уже исправленное сбивает с толку',
    );
  });`,
        points: 6,
      },
      {
        id: 'success',
        name: 'Успешная отправка очищает сообщения',
        type: 'react',
        code: `let ok = false;
const onSubmit = () => { ok = true; return Promise.resolve(); };
return ctx.render('RegisterForm', { onSubmit })
  .then(() => ctx.change('input[name="login"]', 'ivanov26'))
  .then(() => ctx.change('input[name="email"]', 'ivanov@example.com'))
  .then(() => ctx.submit('form'))
  .then(() => ctx.advanceTime(100))
  .then(() => {
    ctx.assert(ok, 'onSubmit должен быть вызван');
    ctx.assert(ctx.text('#login-error') === '', 'После успеха сообщения должны быть пусты');
    ctx.assert(ctx.text('#form-error') === '', 'Общее сообщение тоже должно быть пусто');
  });`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Держите ошибки одним объектом с ключами по именам полей — тогда и свои, и серверные лягут в одно хранилище.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'В обработчике изменения поля стирайте его ошибку: setErrors((prev) => ({ ...prev, [name]: "" })).',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'onSubmit(values).then(() => setErrors({})).catch((error) => { if (error.fields) setErrors(error.fields); else setCommon(error.message); });',
        penaltyPercent: 35,
      },
    ],
    solution: `function RegisterForm({ onSubmit }) {
  const [values, setValues] = React.useState({ login: '', email: '' });
  const [errors, setErrors] = React.useState({});
  const [common, setCommon] = React.useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setCommon('');
  };

  const validate = () => {
    const next = {};
    if (!/^[A-Za-z0-9]{6,}$/.test(values.login)) next.login = 'Латиница и цифры, минимум 6 символов';
    if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(values.email)) next.email = 'Проверьте адрес: нужен знак @ и точка после него';
    return next;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const own = validate();
    setErrors(own);
    setCommon('');

    if (Object.keys(own).length > 0) return;

    onSubmit(values)
      .then(() => {
        setErrors({});
        setCommon('');
      })
      .catch((error) => {
        if (error && error.fields) {
          setErrors(error.fields);
        } else {
          setCommon((error && error.message) || 'Ошибка сервера');
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="login">Логин</label>
      <input id="login" name="login" value={values.login} onChange={handleChange} />
      <p id="login-error">{errors.login || ''}</p>

      <label htmlFor="email">E-mail</label>
      <input id="email" name="email" value={values.email} onChange={handleChange} />
      <p id="email-error">{errors.email || ''}</p>

      <button type="submit">Зарегистрироваться</button>
      <p id="form-error">{common}</p>
    </form>
  );
}`,
    solutionExplanation:
      'Одно хранилище ошибок на оба источника — главная мысль дня. Если завести отдельные состояния для своих и серверных сообщений, придётся решать, какое показывать, когда есть оба, и рано или поздно рядом с полем окажутся две подсказки. Очистка сообщения при вводе тоже не косметика: подсказка «Логин занят» под уже изменённым логином — это прямое враньё интерфейса. Серверные ошибки приходят разложенными по полям, потому что сервер знает, какое поле не прошло, и отдавать их одной строкой — потеря информации.',
    maxScore: 26,
    estimatedMinutes: 35,
    examRefs: ['m2-register-hints', 'm2-login-warnings', 'm1-register'],
    planDays: ['day-20-1'],
    source: 'plan',
  },

  {
    id: 'task-final-slider',
    title: 'Финальный слайдер: четыре картинки, три секунды, точки',
    kind: 'app',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['ui-polish', 'react-slider'],
    monthNo: 5,
    weekNo: 20,
    statement: `Требование модуля 2 дословно: «слайдер с 4 изображениями и автоматическим переключением через 3 секунды». Доведите его до вида, который примут без вопросов.

Компонент \`Slider\` принимает \`{ slides }\` — массив \`{ id, src, alt }\` из четырёх элементов.

1. Все четыре картинки в разметке, видимая помечена классом \`active\`.
2. У каждой картинки непустой \`alt\` из данных.
3. Автопереключение каждые **3 секунды**, таймер снимается в функции очистки.
4. Кнопки \`#prev\` и \`#next\` листают по кругу.
5. Точки-индикаторы \`button.dot\` — по одной на слайд; у текущей класс \`active\`. Клик по точке открывает свой слайд.
6. У кнопок есть \`aria-label\`: на них только значки, и без подписи программа чтения с экрана произнесёт «кнопка».`,
    requirements: [
      'Четыре слайда, активен ровно один',
      'У картинок есть alt из данных',
      'Автопереключение каждые 3 секунды',
      'Кнопки листают по кругу',
      'Точки-индикаторы показывают текущий слайд и переключают его',
      'У кнопок есть aria-label',
    ],
    starterCode: `function Slider({ slides }) {
  // четыре слайда, автопрокрутка, кнопки и точки
}`,
    tests: [
      {
        id: 'slides',
        name: 'Четыре слайда с подписями',
        type: 'react',
        code: `const slides = [1, 2, 3, 4].map((n) => ({ id: n, src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"></svg>', alt: 'Зал ' + n }));
return ctx.render('Slider', { slides }).then(() => {
  const images = ctx.$$('img');
  ctx.assert(images.length === 4, 'Картинок должно быть четыре, найдено: ' + images.length, 4, images.length);
  images.forEach((img, index) => {
    const alt = img.getAttribute('alt');
    ctx.assert(alt && alt.length > 0, 'У картинки ' + (index + 1) + ' нет непустого alt');
  });
  ctx.assert(ctx.$$('.active').length >= 1, 'Активный слайд не помечен классом active');
});`,
        points: 4,
      },
      {
        id: 'next-prev',
        name: 'Кнопки листают по кругу',
        type: 'react',
        code: `const slides = [1, 2, 3, 4].map((n) => ({ id: n, src: 'x', alt: 'Зал ' + n }));
const indexOfActive = () => {
  const dots = ctx.$$('button.dot');
  return dots.map((dot) => dot.className.indexOf('active') !== -1).indexOf(true);
};
return ctx.render('Slider', { slides })
  .then(() => ctx.click('#next'))
  .then(() => {
    const first = indexOfActive();
    return ctx.click('#next').then(() => {
      const second = indexOfActive();
      ctx.assert(second === (first + 1) % 4, 'Кнопка «вперёд» должна открывать следующий слайд: был ' + first + ', стал ' + second);
      return ctx.click('#prev');
    }).then(() => {
      ctx.assert(indexOfActive() === first, 'Кнопка «назад» должна вернуть предыдущий слайд');
    });
  });`,
        points: 5,
      },
      {
        id: 'dots',
        name: 'Точки-индикаторы',
        type: 'react',
        code: `const slides = [1, 2, 3, 4].map((n) => ({ id: n, src: 'x', alt: 'Зал ' + n }));
return ctx.render('Slider', { slides })
  .then(() => {
    const dots = ctx.$$('button.dot');
    ctx.assert(dots.length === 4, 'Точек должно быть четыре, найдено: ' + dots.length, 4, dots.length);
    const active = dots.filter((dot) => dot.className.indexOf('active') !== -1);
    ctx.assert(active.length === 1, 'Активной должна быть ровно одна точка, сейчас: ' + active.length);
    return ctx.click(dots[2]);
  })
  .then(() => {
    const dots = ctx.$$('button.dot');
    ctx.assert(
      dots[2].className.indexOf('active') !== -1,
      'После клика по третьей точке она должна стать активной',
    );
  });`,
        points: 6,
      },
      {
        id: 'autoplay',
        name: 'Автопереключение через 3 секунды',
        type: 'react',
        code: `const slides = [1, 2, 3, 4].map((n) => ({ id: n, src: 'x', alt: 'Зал ' + n }));
const indexOfActive = () => ctx.$$('button.dot').map((dot) => dot.className.indexOf('active') !== -1).indexOf(true);
return ctx.render('Slider', { slides }).then(() => {
  const before = indexOfActive();
  return ctx.advanceTime(3400).then(() => {
    const after = indexOfActive();
    ctx.assert(after !== before, 'За 3.4 секунды слайд не сменился: нужен setInterval на 3000 мс');
    ctx.assert(after === (before + 1) % 4, 'Должен открыться следующий слайд: был ' + before + ', стал ' + after);
  });
});`,
        points: 6,
      },
      {
        id: 'accessibility',
        name: 'Кнопки подписаны',
        type: 'react',
        code: `const slides = [1, 2, 3, 4].map((n) => ({ id: n, src: 'x', alt: 'Зал ' + n }));
return ctx.render('Slider', { slides }).then(() => {
  ['#prev', '#next'].forEach((selector) => {
    const button = ctx.$(selector);
    const label = (button.getAttribute('aria-label') || button.textContent || '').trim();
    ctx.assert(label.length > 0, 'У кнопки ' + selector + ' нет ни подписи, ни aria-label');
  });
  const source = (ctx.source || '').replace(/\\s+/g, ' ');
  ctx.assert(/clearInterval|clearTimeout/.test(source), 'Таймер должен сниматься в функции очистки');
});`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Текущий слайд — одно число в состоянии. Всё остальное (класс active у картинки и у точки) вычисляется из него.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'В интервале обновляйте состояние функцией: setIndex((current) => (current + 1) % slides.length). Обычная переменная останется захваченной.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: '<button className={position === index ? "dot active" : "dot"} onClick={() => setIndex(position)} aria-label={"Слайд " + (position + 1)} />',
        penaltyPercent: 35,
      },
    ],
    solution: `function Slider({ slides }) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const move = (step) => setIndex((current) => (current + step + slides.length) % slides.length);

  return (
    <div className="slider">
      {slides.map((slide, position) => (
        <img
          key={slide.id}
          className={position === index ? 'slide active' : 'slide'}
          src={slide.src}
          alt={slide.alt}
        />
      ))}

      <button id="prev" type="button" aria-label="Предыдущий слайд" onClick={() => move(-1)}>
        ‹
      </button>
      <button id="next" type="button" aria-label="Следующий слайд" onClick={() => move(1)}>
        ›
      </button>

      <div className="dots">
        {slides.map((slide, position) => (
          <button
            key={slide.id}
            type="button"
            className={position === index ? 'dot active' : 'dot'}
            aria-label={'Слайд ' + (position + 1)}
            onClick={() => setIndex(position)}
          />
        ))}
      </div>
    </div>
  );
}`,
    solutionExplanation:
      'Одно число в состоянии — и весь слайдер. Класс active у картинки, класс active у точки, работа обеих кнопок и таймера выводятся из него, поэтому рассинхронизации быть не может. Выражение (current + step + slides.length) % slides.length обслуживает оба направления сразу: прибавление длины убирает отрицательный остаток при движении назад. Подписи aria-label обязательны, потому что на кнопках только значки: без них программа чтения с экрана произнесёт просто «кнопка», и слайдером нельзя будет пользоваться вслепую.',
    maxScore: 25,
    estimatedMinutes: 30,
    examRefs: ['m2-slider', 'm2-cabinet-ux', 'm3-quality'],
    planDays: ['day-20-2'],
    source: 'plan',
  },

  {
    id: 'task-date-mask-validation',
    title: 'Поле даты, которое одинаково работает на чужом компьютере',
    kind: 'function',
    runtime: 'js',
    difficulty: 4,
    tech: ['js'],
    topicIds: ['ui-polish'],
    monthNo: 5,
    weekNo: 20,
    statement: `Встроенное поле \`type="date"\` показывает формат по настройкам системы. На экзаменационном компьютере он может оказаться не тем, к которому вы привыкли. Текстовое поле с маской ведёт себя одинаково везде — но проверять введённое приходится самому.

1. \`applyMask(input)\` — приводит ввод к виду \`ДД.ММ.ГГГГ\`: оставляет только цифры, обрезает лишние и расставляет точки. Для \`'12032027'\` → \`'12.03.2027'\`, для \`'1'\` → \`'1'\`, для \`'1203'\` → \`'12.03'\`.
2. \`isRealDate(value)\` — проверяет, что такая дата существует. \`'31.02.2027'\` — нет, \`'29.02.2028'\` — да (год високосный), \`'29.02.2027'\` — нет.
3. \`toIso(value)\` — \`'12.03.2027'\` → \`'2027-03-12'\`; если дата не настоящая — \`null\`.
4. \`validateDate(value, today)\` — возвращает текст ошибки или пустую строку:
   - пустое значение → \`'Укажите дату'\`;
   - не полностью введено или дата не существует → \`'Проверьте дату'\`;
   - дата раньше \`today\` (обе в формате ДД.ММ.ГГГГ) → \`'Дата не может быть в прошлом'\`;
   - сегодняшняя дата допустима.`,
    requirements: [
      'Маска расставляет точки по мере ввода',
      'Маска отбрасывает лишние символы и цифры',
      'Несуществующие даты не проходят',
      'Високосный год учитывается',
      'toIso возвращает машинный формат или null',
      'Прошедшая дата даёт ошибку, сегодняшняя — нет',
    ],
    starterCode: `function applyMask(input) {
  // только цифры, максимум восемь, точки после дня и месяца
}

function isRealDate(value) {
  // существует ли такая дата
}

function toIso(value) {
  // 12.03.2027 -> 2027-03-12
}

function validateDate(value, today) {
  // текст ошибки или пустая строка
}`,
    tests: [
      {
        id: 'mask',
        name: 'Маска расставляет точки',
        type: 'assert',
        code: `const applyMask = ctx.get('applyMask');
const cases = [['1', '1'], ['12', '12'], ['123', '12.3'], ['1203', '12.03'], ['12032027', '12.03.2027']];
cases.forEach(([input, expected]) => {
  const actual = applyMask(input);
  ctx.assert(actual === expected, 'applyMask("' + input + '") должно дать "' + expected + '", получено: "' + actual + '"');
});`,
        points: 5,
      },
      {
        id: 'mask-cleanup',
        name: 'Маска отбрасывает лишнее',
        type: 'assert',
        code: `const applyMask = ctx.get('applyMask');
ctx.assert(applyMask('12.03.2027') === '12.03.2027', 'Уже размеченная строка не должна ломаться');
ctx.assert(applyMask('12abc03') === '12.03', 'Буквы должны отбрасываться, получено: ' + applyMask('12abc03'));
ctx.assert(
  applyMask('120320279999') === '12.03.2027',
  'Лишние цифры отбрасываются, получено: ' + applyMask('120320279999'),
);`,
        points: 4,
      },
      {
        id: 'real-date',
        name: 'Несуществующие даты отсекаются',
        type: 'assert',
        code: `const isRealDate = ctx.get('isRealDate');
ctx.assert(isRealDate('12.03.2027') === true, '12.03.2027 существует');
ctx.assert(isRealDate('31.02.2027') === false, '31 февраля не бывает');
ctx.assert(isRealDate('31.04.2027') === false, 'В апреле 30 дней');
ctx.assert(isRealDate('00.03.2027') === false, 'Нулевого дня не бывает');
ctx.assert(isRealDate('12.13.2027') === false, 'Тринадцатого месяца не бывает');`,
        points: 5,
      },
      {
        id: 'leap-year',
        name: 'Високосный год учитывается',
        type: 'assert',
        code: `const isRealDate = ctx.get('isRealDate');
ctx.assert(isRealDate('29.02.2028') === true, '2028 год високосный, 29 февраля существует');
ctx.assert(isRealDate('29.02.2027') === false, '2027 год не високосный');
ctx.assert(isRealDate('29.02.2100') === false, '2100 год не високосный: делится на 100, но не на 400');
ctx.assert(isRealDate('29.02.2000') === true, '2000 год високосный: делится на 400');`,
        points: 5,
      },
      {
        id: 'iso',
        name: 'Перевод в машинный формат',
        type: 'assert',
        code: `const toIso = ctx.get('toIso');
ctx.assert(toIso('12.03.2027') === '2027-03-12', 'Ожидалось 2027-03-12, получено: ' + ctx.preview(toIso('12.03.2027')));
ctx.assert(toIso('05.01.2027') === '2027-01-05', 'Нули должны сохраняться, получено: ' + ctx.preview(toIso('05.01.2027')));
ctx.assert(toIso('31.02.2027') === null, 'Для несуществующей даты нужен null');`,
        points: 4,
      },
      {
        id: 'validate',
        name: 'Проверка поля целиком',
        type: 'assert',
        code: `const validateDate = ctx.get('validateDate');
const today = '12.03.2027';
ctx.assert(validateDate('', today) === 'Укажите дату', 'Пустое значение: ' + validateDate('', today));
ctx.assert(validateDate('12.03', today) === 'Проверьте дату', 'Недовведённая дата: ' + validateDate('12.03', today));
ctx.assert(validateDate('31.02.2027', today) === 'Проверьте дату', 'Несуществующая дата: ' + validateDate('31.02.2027', today));
ctx.assert(
  validateDate('11.03.2027', today) === 'Дата не может быть в прошлом',
  'Вчерашняя дата: ' + validateDate('11.03.2027', today),
);
ctx.assert(validateDate('12.03.2027', today) === '', 'Сегодняшняя дата должна проходить: ' + validateDate('12.03.2027', today));
ctx.assert(validateDate('13.03.2027', today) === '', 'Завтрашняя дата должна проходить: ' + validateDate('13.03.2027', today));`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Начните с очистки: value.replace(/\\D/g, "").slice(0, 8). Дальше собирайте строку по кусочкам в зависимости от длины.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Существование даты удобно проверить обратным ходом: создать дату и убедиться, что день и месяц не «съехали». Февральское 31-е превратится в мартовское.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const date = new Date(year, month - 1, day); return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;',
        penaltyPercent: 35,
      },
    ],
    solution: `function applyMask(input) {
  const digits = String(input).replace(/\\D/g, '').slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.slice(0, 2) + '.' + digits.slice(2);

  return digits.slice(0, 2) + '.' + digits.slice(2, 4) + '.' + digits.slice(4);
}

function isRealDate(value) {
  if (!/^\\d{2}\\.\\d{2}\\.\\d{4}$/.test(String(value))) return false;

  const [day, month, year] = String(value).split('.').map(Number);
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function toIso(value) {
  if (!isRealDate(value)) return null;

  const [day, month, year] = String(value).split('.');
  return year + '-' + month + '-' + day;
}

function validateDate(value, today) {
  if (!value) return 'Укажите дату';
  if (!isRealDate(value)) return 'Проверьте дату';

  const iso = toIso(value);
  const todayIso = toIso(today);

  if (iso < todayIso) return 'Дата не может быть в прошлом';

  return '';
}`,
    solutionExplanation:
      'Проверка существования даты сделана обратным ходом и потому не требует знания длины месяцев и правил високосного года: конструктор даты сам переносит 31 февраля на 3 марта, и остаётся сравнить, что получилось, с тем, что вводили. Все правила високосности при этом учитываются сами собой, включая исключение для 2100 года. Сравнение дат идёт в машинном формате ГГГГ-ММ-ДД — в нём обычное строковое сравнение даёт правильный хронологический порядок, а в ДД.ММ.ГГГГ первым сравнивался бы день.',
    maxScore: 29,
    estimatedMinutes: 35,
    examRefs: ['m2-order-form', 'm1-order', 'm3-quality'],
    planDays: ['day-20-3'],
    source: 'plan',
  },

  {
    id: 'task-mobile-checklist-390',
    title: 'Чек-лист мобильной версии на 390 × 844',
    kind: 'fix-bug',
    runtime: 'dom',
    difficulty: 4,
    tech: ['css', 'html'],
    topicIds: ['ui-polish', 'css-responsive'],
    monthNo: 5,
    weekNo: 20,
    statement: `На узком экране проверяют четыре вещи, и все четыре здесь нарушены.

1. **Горизонтальная прокрутка.** Страница не должна уезжать вбок.
2. **Цели нажатия.** Кнопки и ссылки-кнопки — не мельче **44 пикселей** по высоте: палец не мышь.
3. **Читаемость.** Основной текст не мельче **14px**.
4. **Таблица.** Пять колонок на 390 пикселей не помещаются: таблица прокручивается внутри блока \`.table-wrap\`, а не тянет за собой страницу.

Исправьте стили. Разметку менять не нужно.`,
    requirements: [
      'Горизонтальной прокрутки нет',
      'Высота кнопок не меньше 44px',
      'Размер основного текста не меньше 14px',
      'Таблица прокручивается внутри .table-wrap',
      'Блок с таблицей не шире экрана',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }

    body {
      margin: 0;
      padding: 16px;
      font-family: system-ui, sans-serif;
      font-size: 11px;          /* 3. слишком мелко */
      background: #f8fafc;
    }

    .actions { display: flex; gap: 8px; margin-bottom: 16px; }

    .btn {
      height: 28px;             /* 2. слишком мелкая цель */
      padding: 0 10px;
      border: 0;
      border-radius: 8px;
      background: #2563eb;
      color: #fff;
    }

    .note {
      width: 480px;             /* 1. шире экрана */
      margin-bottom: 16px;
    }

    /* 4. таблица тянет страницу вбок */

    table { border-collapse: collapse; }
    th, td { padding: 8px 12px; border: 1px solid #cbd5e1; white-space: nowrap; }
  </style>
</head>
<body>
  <div class="actions">
    <button class="btn" type="button">Новая заявка</button>
    <button class="btn" type="button">Обновить</button>
  </div>

  <p class="note">Личный кабинет: здесь видны все ваши заявки и их текущие статусы.</p>

  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>№</th><th>Помещение</th><th>Дата</th><th>Оплата</th><th>Статус</th></tr>
      </thead>
      <tbody>
        <tr><td>1</td><td>Аудитория на 100 мест</td><td>12.03.2027</td><td>Картой</td><td>Новая</td></tr>
        <tr><td>2</td><td>Коворкинг</td><td>05.02.2027</td><td>Наличными</td><td>Выполнена</td></tr>
      </tbody>
    </table>
  </div>
</body>
</html>`,
    viewport: { width: 390, height: 844 },
    tests: [
      {
        id: 'no-scroll',
        name: 'Горизонтальной прокрутки нет',
        type: 'dom',
        code: `const root = ctx.document.documentElement;
ctx.assert(
  root.scrollWidth <= root.clientWidth + 1,
  'Страница уезжает вбок: ширина содержимого ' + root.scrollWidth + 'px при экране ' + root.clientWidth + 'px',
);`,
        points: 5,
      },
      {
        id: 'tap-targets',
        name: 'Кнопки удобны для пальца',
        type: 'dom',
        code: `const buttons = ctx.$$('button');
ctx.assert(buttons.length === 2, 'Кнопки не должны пропасть');
buttons.forEach((button) => {
  const height = button.getBoundingClientRect().height;
  ctx.assert(
    height >= 44,
    'Высота кнопки «' + button.textContent.trim() + '» — ' + Math.round(height) + 'px, нужно не меньше 44',
  );
});`,
        points: 5,
      },
      {
        id: 'font-size',
        name: 'Текст читается',
        type: 'dom',
        code: `const size = parseFloat(ctx.css('body', 'font-size'));
ctx.assert(size >= 14, 'Основной размер текста — ' + size + 'px, нужно не меньше 14', '≥ 14', size);
const noteSize = parseFloat(ctx.css('.note', 'font-size'));
ctx.assert(noteSize >= 14, 'Текст абзаца мельче 14px: ' + noteSize);`,
        points: 4,
      },
      {
        id: 'note-width',
        name: 'Абзац помещается в экран',
        type: 'dom',
        code: `const note = ctx.$('.note');
const width = note.getBoundingClientRect().width;
ctx.assert(width <= 390, 'Абзац шире экрана: ' + Math.round(width) + 'px. Жёсткую ширину меняют на max-width');`,
        points: 4,
      },
      {
        id: 'table-scroll',
        name: 'Таблица прокручивается внутри блока',
        type: 'dom',
        code: `const wrapper = ctx.$('.table-wrap');
const overflow = ctx.css(wrapper, 'overflow-x');
ctx.assert(overflow === 'auto' || overflow === 'scroll', 'У .table-wrap нужен overflow-x: auto, сейчас: ' + overflow);
ctx.assert(
  wrapper.getBoundingClientRect().width <= 390,
  'Сам блок шире экрана: прокручиваться должно содержимое, а не страница',
);
ctx.assert(
  ctx.$('table').scrollWidth > wrapper.clientWidth,
  'Таблица должна остаться широкой и прокручиваться, а не сжиматься в нечитаемую кашу',
);`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Порог 44 пикселя взят из рекомендаций по размеру цели нажатия: это примерно подушечка пальца.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Блоку с прокруткой нужны max-width: 100% и overflow-x: auto. Внутри flex- или grid-родителя добавьте ещё min-width: 0.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'body { font-size: 16px; } .btn { min-height: 44px; } .note { max-width: 100%; } .table-wrap { max-width: 100%; overflow-x: auto; }',
        penaltyPercent: 35,
      },
    ],
    solution: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }

    body {
      margin: 0;
      padding: 16px;
      font-family: system-ui, sans-serif;
      font-size: 16px;
      background: #f8fafc;
    }

    .actions { display: flex; gap: 8px; margin-bottom: 16px; }

    .btn {
      min-height: 44px;
      padding: 0 14px;
      border: 0;
      border-radius: 8px;
      background: #2563eb;
      color: #fff;
      font-size: 1rem;
    }

    .note {
      max-width: 100%;
      margin-bottom: 16px;
    }

    .table-wrap {
      max-width: 100%;
      min-width: 0;
      overflow-x: auto;
    }

    table { border-collapse: collapse; }
    th, td { padding: 8px 12px; border: 1px solid #cbd5e1; white-space: nowrap; }
  </style>
</head>
<body>
  <div class="actions">
    <button class="btn" type="button">Новая заявка</button>
    <button class="btn" type="button">Обновить</button>
  </div>

  <p class="note">Личный кабинет: здесь видны все ваши заявки и их текущие статусы.</p>

  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>№</th><th>Помещение</th><th>Дата</th><th>Оплата</th><th>Статус</th></tr>
      </thead>
      <tbody>
        <tr><td>1</td><td>Аудитория на 100 мест</td><td>12.03.2027</td><td>Картой</td><td>Новая</td></tr>
        <tr><td>2</td><td>Коворкинг</td><td>05.02.2027</td><td>Наличными</td><td>Выполнена</td></tr>
      </tbody>
    </table>
  </div>
</body>
</html>`,
    solutionExplanation:
      'Свойство min-height вместо height у кнопки выбрано намеренно: если текст перенесётся на две строки, кнопка вырастет, а не обрежет содержимое. Таблицу не сжимают и не прячут — её прокручивают: пять колонок, втиснутые в 390 пикселей, превращаются в обрывки слов, и проверяющий на защите это заметит сразу. Все четыре правила стоит держать списком и проходить по нему перед сдачей: горизонтальная прокрутка, цели нажатия, размер текста, широкие блоки.',
    maxScore: 23,
    estimatedMinutes: 30,
    examRefs: ['m2-mobile', 'm3-mobile', 'm2-design'],
    planDays: ['day-20-4'],
    source: 'plan',
  },

  {
    id: 'task-page-urls',
    title: 'Свой адрес у каждой страницы',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['react', 'js'],
    topicIds: ['ui-polish'],
    monthNo: 5,
    weekNo: 20,
    statement: `Задание разрешает сдать макеты отдельными файлами. В приложении на React отдельных файлов нет, но у каждой страницы есть собственный адрес — и это то же самое по смыслу: страницу можно открыть по ссылке, добавить в закладки и показать проверяющему.

Соберите карту адресов приложения.

1. Массив \`pages\` — шесть записей \`{ path, title, file }\`, где \`file\` — имя файла, которым эта страница была бы в обычной вёрстке:

| Адрес | Заголовок | Файл |
|---|---|---|
| / | Главная | index.html |
| /login | Вход | login.html |
| /register | Регистрация | register.html |
| /cabinet | Личный кабинет | cabinet.html |
| /order | Оформление заявки | order.html |
| /admin | Панель администратора | admin.html |

2. \`titleFor(path)\` — заголовок страницы; для неизвестного адреса — \`'Страница не найдена'\`.
3. \`documentTitle(path)\` — то, что уходит в заголовок вкладки: \`'Вход — Конференции.РФ'\`. Для главной — просто \`'Конференции.РФ'\`.
4. \`fileMap()\` — объект \`{ '/login': 'login.html', … }\` для сдачи: по нему видно, какой адрес какому файлу соответствует.`,
    requirements: [
      'Описаны все шесть страниц',
      'titleFor возвращает заголовок по адресу',
      'Неизвестный адрес даёт «Страница не найдена»',
      'Заголовок вкладки собирается с названием сайта',
      'У главной заголовок вкладки без приставки',
      'fileMap отдаёт соответствие адресов и файлов',
    ],
    starterCode: `const SITE = 'Конференции.РФ';

const pages = [
  // шесть записей { path, title, file }
];

function titleFor(path) {
  // заголовок страницы
}

function documentTitle(path) {
  // заголовок вкладки
}

function fileMap() {
  // { '/login': 'login.html', … }
}`,
    tests: [
      {
        id: 'pages',
        name: 'Все шесть страниц описаны',
        type: 'assert',
        code: `const pages = ctx.get('pages');
ctx.assert(Array.isArray(pages) && pages.length === 6, 'Страниц должно быть шесть, найдено: ' + (pages || []).length);
const expected = {
  '/': ['Главная', 'index.html'],
  '/login': ['Вход', 'login.html'],
  '/register': ['Регистрация', 'register.html'],
  '/cabinet': ['Личный кабинет', 'cabinet.html'],
  '/order': ['Оформление заявки', 'order.html'],
  '/admin': ['Панель администратора', 'admin.html'],
};
Object.keys(expected).forEach((path) => {
  const page = pages.filter((item) => item.path === path)[0];
  ctx.assert(page, 'Нет страницы ' + path);
  ctx.assert(page.title === expected[path][0], 'У ' + path + ' заголовок «' + page.title + '», ожидался «' + expected[path][0] + '»');
  ctx.assert(page.file === expected[path][1], 'У ' + path + ' файл «' + page.file + '», ожидался «' + expected[path][1] + '»');
});`,
        points: 5,
      },
      {
        id: 'title-for',
        name: 'Заголовок по адресу',
        type: 'assert',
        code: `const titleFor = ctx.get('titleFor');
ctx.assert(titleFor('/cabinet') === 'Личный кабинет', 'Ожидался «Личный кабинет», получено: ' + titleFor('/cabinet'));
ctx.assert(titleFor('/') === 'Главная', 'Ожидалась «Главная», получено: ' + titleFor('/'));
ctx.assert(
  titleFor('/нет-такой') === 'Страница не найдена',
  'Для неизвестного адреса ожидалось «Страница не найдена», получено: ' + titleFor('/нет-такой'),
);`,
        points: 4,
      },
      {
        id: 'document-title',
        name: 'Заголовок вкладки',
        type: 'assert',
        code: `const documentTitle = ctx.get('documentTitle');
ctx.assert(
  documentTitle('/login') === 'Вход — Конференции.РФ',
  'Ожидалось «Вход — Конференции.РФ», получено: ' + documentTitle('/login'),
);
ctx.assert(
  documentTitle('/admin') === 'Панель администратора — Конференции.РФ',
  'Получено: ' + documentTitle('/admin'),
);`,
        points: 4,
      },
      {
        id: 'home-title',
        name: 'У главной заголовок без приставки',
        type: 'assert',
        code: `const documentTitle = ctx.get('documentTitle');
ctx.assert(
  documentTitle('/') === 'Конференции.РФ',
  'У главной заголовок вкладки — просто название сайта, без «Главная —». Получено: ' + documentTitle('/'),
);`,
        points: 4,
      },
      {
        id: 'file-map',
        name: 'Соответствие адресов и файлов',
        type: 'assert',
        code: `const fileMap = ctx.get('fileMap');
const map = fileMap();
ctx.assert(map && typeof map === 'object', 'fileMap должен вернуть объект');
ctx.assert(Object.keys(map).length === 6, 'В карте должно быть шесть записей, найдено: ' + Object.keys(map).length);
ctx.assert(map['/order'] === 'order.html', 'Для /order ожидался order.html, получено: ' + map['/order']);
ctx.assert(map['/'] === 'index.html', 'Для / ожидался index.html, получено: ' + map['/']);`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Все четыре функции работают с одним и тем же массивом pages — не дублируйте данные.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Главная — единственное исключение в заголовке вкладки: приставка «Главная —» выглядит лишней.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'fileMap: return pages.reduce((acc, page) => { acc[page.path] = page.file; return acc; }, {});',
        penaltyPercent: 35,
      },
    ],
    solution: `const SITE = 'Конференции.РФ';

const pages = [
  { path: '/', title: 'Главная', file: 'index.html' },
  { path: '/login', title: 'Вход', file: 'login.html' },
  { path: '/register', title: 'Регистрация', file: 'register.html' },
  { path: '/cabinet', title: 'Личный кабинет', file: 'cabinet.html' },
  { path: '/order', title: 'Оформление заявки', file: 'order.html' },
  { path: '/admin', title: 'Панель администратора', file: 'admin.html' },
];

function titleFor(path) {
  const page = pages.find((item) => item.path === path);
  return page ? page.title : 'Страница не найдена';
}

function documentTitle(path) {
  if (path === '/') return SITE;
  return titleFor(path) + ' — ' + SITE;
}

function fileMap() {
  return pages.reduce((acc, page) => {
    acc[page.path] = page.file;
    return acc;
  }, {});
}`,
    solutionExplanation:
      'Соответствие адресов и файлов стоит выписать заранее и показать на защите: вопрос «а где отдельные HTML-файлы» на экзамене задают, и ответ «каждая страница открывается по своему адресу, вот карта» снимает его за полминуты. Заголовок вкладки — мелочь, которую забывают все: без него во всех вкладках написано одно и то же название проекта, и переключаться между открытыми страницами невозможно. Главная — единственное исключение, и это общепринятое соглашение, а не прихоть.',
    maxScore: 21,
    estimatedMinutes: 25,
    examRefs: ['m2-layouts', 'm3-quality'],
    planDays: ['day-20-5'],
    source: 'plan',
  },

  {
    id: 'task-image-prep',
    title: 'Подготовка изображений: один вид, разумный вес',
    kind: 'output',
    runtime: 'dom',
    difficulty: 3,
    tech: ['css', 'html', 'design'],
    topicIds: ['ui-polish', 'css-images'],
    monthNo: 5,
    weekNo: 20,
    statement: `Случайный набор картинок для слайдера: разные пропорции, разные размеры. Приведите их к одному виду и подготовьте к показу.

1. Все картинки \`.slide__img\` одинаковой высоты **200px** и на всю ширину контейнера, без искажения пропорций.
2. У каждой картинки заданы атрибуты \`width\` и \`height\` — по ним браузер заранее резервирует место, и страница не прыгает во время загрузки.
3. У всех картинок, кроме первой, \`loading="lazy"\`: те, что ниже экрана, грузятся только когда до них дошли. Первая грузится сразу — она видна при открытии.
4. У каждой картинки непустой \`alt\`.
5. Контейнер \`.slider\` не шире экрана.`,
    requirements: [
      'Все картинки одинаковой высоты 200px',
      'Пропорции не искажены (object-fit)',
      'У картинок заданы атрибуты width и height',
      'У всех, кроме первой, есть loading="lazy"',
      'У каждой картинки непустой alt',
      'Контейнер не шире экрана',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 16px; font-family: system-ui, sans-serif; }

    .slider { display: grid; gap: 12px; }

    .slide__img {
      /* одинаковая высота и неискажённые пропорции */
    }
  </style>
</head>
<body>
  <div class="slider">
    <img class="slide__img" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='800' height='450' fill='%232563eb'/></svg>">
    <img class="slide__img" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><rect width='600' height='600' fill='%2316a34a'/></svg>">
    <img class="slide__img" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='400'><rect width='1200' height='400' fill='%23d97706'/></svg>">
    <img class="slide__img" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='900'><rect width='400' height='900' fill='%23dc2626'/></svg>">
  </div>
</body>
</html>`,
    viewport: { width: 390, height: 844 },
    tests: [
      {
        id: 'same-height',
        name: 'Одинаковая высота',
        type: 'dom',
        code: `const images = ctx.$$('.slide__img');
ctx.assert(images.length === 4, 'Картинок должно быть четыре, найдено: ' + images.length);
const heights = images.map((img) => Math.round(img.getBoundingClientRect().height));
ctx.assert(heights.every((height) => height === 200), 'Все картинки должны быть высотой 200px, сейчас: ' + heights.join(', '));`,
        points: 5,
      },
      {
        id: 'object-fit',
        name: 'Пропорции не искажены',
        type: 'dom',
        code: `const images = ctx.$$('.slide__img');
images.forEach((img, index) => {
  const fit = ctx.css(img, 'object-fit');
  ctx.assert(
    fit === 'cover',
    'У картинки ' + (index + 1) + ' нужен object-fit: cover — иначе изображение растянется. Сейчас: ' + fit,
  );
});`,
        points: 5,
      },
      {
        id: 'dimensions',
        name: 'Размеры заданы атрибутами',
        type: 'dom',
        code: `const images = ctx.$$('.slide__img');
images.forEach((img, index) => {
  const width = img.getAttribute('width');
  const height = img.getAttribute('height');
  ctx.assert(
    width && height,
    'У картинки ' + (index + 1) + ' нет атрибутов width и height. По ним браузер резервирует место, и страница не прыгает при загрузке',
  );
});`,
        points: 4,
      },
      {
        id: 'lazy',
        name: 'Отложенная загрузка у всех, кроме первой',
        type: 'dom',
        code: `const images = ctx.$$('.slide__img');
ctx.assert(
  images[0].getAttribute('loading') !== 'lazy',
  'Первая картинка видна сразу при открытии — откладывать её загрузку не нужно',
);
images.slice(1).forEach((img, index) => {
  ctx.assert(
    img.getAttribute('loading') === 'lazy',
    'У картинки ' + (index + 2) + ' нет loading="lazy"',
  );
});`,
        points: 5,
      },
      {
        id: 'alt',
        name: 'У всех картинок есть подпись',
        type: 'dom',
        code: `const images = ctx.$$('.slide__img');
images.forEach((img, index) => {
  const alt = img.getAttribute('alt');
  ctx.assert(alt !== null && alt.trim().length > 0, 'У картинки ' + (index + 1) + ' нет непустого alt');
});
const alts = images.map((img) => img.getAttribute('alt').trim());
const unique = alts.filter((value, index) => alts.indexOf(value) === index);
ctx.assert(unique.length === 4, 'Подписи должны различаться, сейчас: ' + alts.join(' | '));`,
        points: 4,
      },
      {
        id: 'width',
        name: 'Контейнер не шире экрана',
        type: 'dom',
        code: `const root = ctx.document.documentElement;
ctx.assert(
  root.scrollWidth <= root.clientWidth + 1,
  'Страница уезжает вбок: ' + root.scrollWidth + 'px при экране ' + root.clientWidth + 'px',
);`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Пара «фиксированная высота + object-fit: cover» приводит изображения любых пропорций к одному виду, обрезая лишнее вместо растягивания.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Атрибуты width и height задают соотношение сторон, по которому браузер резервирует место. CSS всё равно перекроет реальный размер.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: '.slide__img { display: block; width: 100%; height: 200px; object-fit: cover; border-radius: 12px; } — и в разметке width="800" height="450" alt="…" loading="lazy".',
        penaltyPercent: 35,
      },
    ],
    solution: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 16px; font-family: system-ui, sans-serif; }

    .slider { display: grid; gap: 12px; max-width: 100%; }

    .slide__img {
      display: block;
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 12px;
    }
  </style>
</head>
<body>
  <div class="slider">
    <img class="slide__img" width="800" height="450" alt="Аудитория на 100 мест" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='800' height='450' fill='%232563eb'/></svg>">
    <img class="slide__img" width="600" height="600" loading="lazy" alt="Коворкинг" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><rect width='600' height='600' fill='%2316a34a'/></svg>">
    <img class="slide__img" width="1200" height="400" loading="lazy" alt="Кинозал" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='400'><rect width='1200' height='400' fill='%23d97706'/></svg>">
    <img class="slide__img" width="400" height="900" loading="lazy" alt="Переговорная" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='900'><rect width='400' height='900' fill='%23dc2626'/></svg>">
  </div>
</body>
</html>`,
    solutionExplanation:
      'Атрибуты width и height задают не размер, а соотношение сторон: реальный размер всё равно приходит из CSS. Браузеру они нужны, чтобы заранее оставить под картинку место — без них страница дёргается по мере загрузки изображений, и это заметно сразу. Первая картинка загружается обычным образом, потому что она видна при открытии: отложенная загрузка того, что уже на экране, только замедляет показ. Разные подписи в alt — не придирка: четыре картинки с alt="Изображение" бесполезны так же, как их отсутствие.',
    maxScore: 27,
    estimatedMinutes: 25,
    examRefs: ['m2-design', 'm2-slider', 'm3-mobile'],
    planDays: ['day-20-6'],
    source: 'plan',
  },
];
