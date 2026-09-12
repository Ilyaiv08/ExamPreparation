import type { Topic } from '../types';
import { MONTH_02_MODERN_TOPICS } from './month-02-modern';

/**
 * Месяц 2, недели 5–6: базовый JavaScript, DOM, события, валидация, таймеры.
 * Учебная программа называет этот месяц самым важным: React — это JavaScript.
 */
const WEEK_5_6: Topic[] = [
  {
    id: 'js-intro',
    title: 'JavaScript: подключение, переменные, типы данных',
    tech: ['js'],
    monthNo: 2,
    weekNo: 5,
    importance: 'core',
    summary:
      'JavaScript оживляет страницу. Скрипт подключают с атрибутом defer, значения хранят в let и const, а типов всего несколько — и их стоит знать наизусть.',
    mustKnow: [
      '`<script src="main.js" defer></script>` и почему defer',
      '`let` и `const`, почему `var` больше не используют',
      'Типы: string, number, boolean, null, undefined, object',
      '`typeof` и приведение типов',
      '`console.log` как инструмент отладки',
    ],
    theory: `## Подключение

\`\`\`html
<script src="main.js" defer></script>
\`\`\`

Атрибут \`defer\` говорит браузеру: «скачай файл параллельно с разбором страницы, но выполни его, когда разметка готова». Без него скрипт в \`head\` выполнится раньше, чем появятся элементы, и \`querySelector\` вернёт \`null\`.

Альтернатива — положить \`<script>\` перед \`</body>\`. Оба варианта рабочие; \`defer\` аккуратнее.

## Переменные

\`\`\`js
let count = 0;        // значение будет меняться
const MAX = 10;       // ссылка не изменится
count = count + 1;
\`\`\`

Правило простое: **по умолчанию \`const\`**, и только если значение придётся переприсваивать — \`let\`.

\`const\` защищает от переприсваивания, но не «замораживает» содержимое: у объекта и массива можно менять поля и элементы.

\`\`\`js
const user = { login: 'ivanov26' };
user.login = 'petrov26';   // так можно
user = {};                 // а так — ошибка
\`\`\`

\`var\` не используют: он виден за пределами блока и «всплывает» в начало функции, из-за чего появляются трудноуловимые ошибки.

## Типы

| Тип | Пример | Комментарий |
|---|---|---|
| string | \`'Новая'\` | Кавычки одинарные, двойные или обратные |
| number | \`42\`, \`3.14\` | Целые и дробные — один тип |
| boolean | \`true\`, \`false\` | Результат сравнений |
| null | \`null\` | «Значения нет» — поставлено осознанно |
| undefined | \`undefined\` | «Значение не задано» |
| object | \`{}\`, \`[]\` | Объекты, массивы, даты |

\`typeof\` показывает тип: \`typeof 'text'\` → \`'string'\`. Известная странность: \`typeof null\` возвращает \`'object'\` — это ошибка в языке, оставленная ради совместимости.

## Приведение типов

\`\`\`js
'5' + 2    // '52'  — плюс со строкой склеивает
'5' - 2    // 3     — минус приводит к числу
Number('5')      // 5
parseInt('5px')  // 5
String(5)        // '5'
\`\`\`

Отсюда правило экзамена: значение из поля ввода — **всегда строка**. Перед арифметикой её нужно превратить в число явно.

## Шаблонные строки

\`\`\`js
const room = 'Коворкинг';
const date = '14.09.2026';
console.log(\`Заявка: \${room}, дата \${date}\`);
\`\`\`

Обратные кавычки позволяют подставлять значения и переносить строки — удобнее, чем склейка плюсами.`,
    examples: [
      {
        title: 'Первые переменные проекта',
        language: 'javascript',
        code: `const STATUS_NEW = 'Новая';
const STATUS_SCHEDULED = 'Мероприятие назначено';
const STATUS_DONE = 'Мероприятие завершено';

let applicationsCount = 0;
applicationsCount = applicationsCount + 1;

console.log(\`Заявок: \${applicationsCount}, статус по умолчанию: \${STATUS_NEW}\`);`,
        explanation:
          'Три статуса из задания вынесены в константы. Так их текст пишется один раз — и ошибиться в формулировке уже негде.',
      },
    ],
    mistakes: [
      {
        title: 'Скрипт без defer в head',
        wrong: '<head><script src="main.js"></script></head>',
        right: '<head><script src="main.js" defer></script></head>',
        why: 'Скрипт выполнится до появления разметки, и querySelector вернёт null.',
      },
      {
        title: 'Складывать значение поля как число',
        wrong: 'const total = input.value + 1; // "51"',
        right: 'const total = Number(input.value) + 1; // 51',
        why: 'input.value всегда строка, а плюс со строкой склеивает, а не складывает.',
      },
    ],
    quizId: 'quiz-js-intro',
    taskIds: ['task-js-types'],
    resources: [
      { title: 'learn.javascript.ru — переменные', url: 'https://learn.javascript.ru/variables', kind: 'tutorial', source: 'plan' },
    ],
    examRefs: [],
    prerequisites: ['html-structure'],
    estimatedMinutes: 40,
    planDays: ['day-05-1'],
    source: 'plan',
  },

  {
    id: 'js-operators',
    title: 'Операторы, сравнения и условия',
    tech: ['js'],
    monthNo: 2,
    weekNo: 5,
    importance: 'core',
    summary:
      'Условия решают, что показать пользователю: цвет статуса, текст ошибки, доступность кнопки. Главное правило — всегда сравнивать через ===.',
    mustKnow: [
      'Арифметика и оператор остатка %',
      '`===` против `==` и почему второй не используют',
      '`if` / `else if` / `else`',
      'Тернарный оператор `условие ? а : б`',
      'Логические `&&`, `||`, `!` и «ложные» значения',
    ],
    theory: `## Сравнения

\`\`\`js
5 === 5      // true
'5' === 5    // false — разные типы
'5' == 5     // true  — == приводит типы и путает
\`\`\`

Используйте только \`===\` и \`!==\`. Оператор \`==\` делает скрытые приведения (\`0 == ''\` → true, \`null == undefined\` → true) и регулярно становится причиной ошибок.

## Условия

\`\`\`js
function statusColor(status) {
  if (status === 'Новая') {
    return 'secondary';
  } else if (status === 'Мероприятие назначено') {
    return 'primary';
  } else if (status === 'Мероприятие завершено') {
    return 'success';
  }
  return 'light';
}
\`\`\`

Это ровно та функция, которую программа просит написать на второй день недели 5.

## Тернарный оператор

\`\`\`js
const label = count === 1 ? 'заявка' : 'заявки';
\`\`\`

Удобен для коротких «или-или», особенно в React: \`{isAdmin ? <AdminPanel /> : <UserPanel />}\`. Вложенные тернарные операторы читаются плохо — для трёх и более вариантов берите \`if\` или объект-словарь.

## Словарь вместо длинного if

\`\`\`js
const COLORS = {
  'Новая': 'secondary',
  'Мероприятие назначено': 'primary',
  'Мероприятие завершено': 'success',
};

const color = COLORS[status] ?? 'light';
\`\`\`

Короче и легче расширять — приём, который пригодится и в React.

## Логические операторы

\`\`\`js
login.length >= 6 && /^[A-Za-z0-9]+$/.test(login)   // оба условия
!user                                               // отрицание
user.name || 'Гость'                                // запасное значение
\`\`\`

«Ложные» значения: \`false\`, \`0\`, \`''\`, \`null\`, \`undefined\`, \`NaN\`. Всё остальное — «истинное», включая \`'0'\` и пустой массив.

Важная тонкость: \`||\` подставляет запасное значение и когда слева \`0\` или пустая строка. Если нужно заменять только \`null\` и \`undefined\` — используйте \`??\`:

\`\`\`js
const page = Number(query.page) || 1;   // при page=0 вернёт 1
const note = review.text ?? '';         // пустая строка сохранится
\`\`\``,
    examples: [
      {
        title: 'Функция цвета статуса',
        language: 'javascript',
        code: `const STATUS_COLORS = {
  'Новая': 'secondary',
  'Мероприятие назначено': 'primary',
  'Мероприятие завершено': 'success',
};

function statusColor(status) {
  return STATUS_COLORS[status] ?? 'light';
}

console.log(statusColor('Новая'));                  // secondary
console.log(statusColor('Мероприятие завершено'));  // success
console.log(statusColor('что-то другое'));          // light`,
      },
    ],
    mistakes: [
      {
        title: 'Сравнение через ==',
        wrong: "if (status == 'Новая')",
        right: "if (status === 'Новая')",
        why: 'Двойное равенство приводит типы и даёт неожиданные результаты. В критерии «качество кода» это заметят.',
      },
      {
        title: '|| там, где нужен ??',
        wrong: 'const limit = input || 10;  // при input = 0 вернёт 10',
        right: 'const limit = input ?? 10;',
        why: 'Ноль и пустая строка — «ложные» значения, но вполне валидные данные.',
      },
    ],
    quizId: 'quiz-js-operators',
    taskIds: ['task-js-status-color'],
    resources: [
      { title: 'learn.javascript.ru — операторы сравнения', url: 'https://learn.javascript.ru/comparison', kind: 'tutorial', source: 'plan' },
    ],
    examRefs: ['m1-admin'],
    prerequisites: ['js-intro'],
    estimatedMinutes: 40,
    planDays: ['day-05-2'],
    source: 'plan',
  },

  {
    id: 'js-loops',
    title: 'Циклы: for, while, for...of',
    tech: ['js'],
    monthNo: 2,
    weekNo: 5,
    importance: 'core',
    summary:
      'Цикл повторяет действие для каждого элемента: вывести все заявки, посчитать сумму, найти максимум. Для массивов чаще всего берут for...of.',
    mustKnow: [
      'Классический `for` с индексом',
      '`for...of` — перебор значений массива',
      '`while` и когда он уместен',
      '`break` и `continue`',
      'Бесконечный цикл и как его не создать',
    ],
    theory: `## Классический for

\`\`\`js
for (let i = 0; i < applications.length; i++) {
  console.log(i + 1, applications[i].room);
}
\`\`\`

Три части: начальное значение, условие продолжения, шаг. Нужен, когда важен индекс — например, чтобы пронумеровать строки таблицы.

## for...of

\`\`\`js
for (const application of applications) {
  console.log(application.room);
}
\`\`\`

Короче и без риска ошибиться в границах. Используйте его, если индекс не нужен.

Для объектов есть \`for...in\` (перебирает ключи), но в современном коде чаще пишут \`Object.keys(obj)\` и \`for...of\`.

## while

\`\`\`js
let page = 1;
while (page <= totalPages) {
  render(page);
  page++;
}
\`\`\`

Уместен, когда заранее неизвестно число повторений. Главная опасность — забыть изменить переменную условия: получится бесконечный цикл, вкладка зависнет.

## break и continue

\`\`\`js
for (const application of applications) {
  if (application.status !== 'Новая') continue;  // пропустить
  if (application.id === target) break;          // прекратить
}
\`\`\`

## Когда цикл не нужен

Для массивов почти всегда есть более выразительный метод:

\`\`\`js
// вместо цикла с условием
const newOnes = applications.filter((a) => a.status === 'Новая');

// вместо цикла с накоплением
const total = prices.reduce((sum, price) => sum + price, 0);
\`\`\`

Это тема недели 7, но знать о ней полезно заранее: на экзамене фильтр и сортировка в админке пишутся именно методами массива, а не циклами.`,
    examples: [
      {
        title: 'Таблица умножения и поиск максимума',
        language: 'javascript',
        code: `for (let i = 1; i <= 3; i++) {
  let row = '';
  for (let j = 1; j <= 3; j++) {
    row += \`\${i}×\${j}=\${i * j}  \`;
  }
  console.log(row);
}

const numbers = [4, 17, 9, 23, 8];
let max = numbers[0];
for (const value of numbers) {
  if (value > max) max = value;
}
console.log('Максимум:', max);`,
      },
    ],
    mistakes: [
      {
        title: 'Бесконечный цикл',
        wrong: 'let i = 0;\nwhile (i < 10) {\n  console.log(i);\n}',
        right: 'let i = 0;\nwhile (i < 10) {\n  console.log(i);\n  i++;\n}',
        why: 'Без изменения счётчика условие всегда истинно — вкладка зависает. В песочнице платформы такой код будет остановлен по таймауту.',
      },
      {
        title: 'Выход за границы массива',
        wrong: 'for (let i = 0; i <= arr.length; i++)',
        right: 'for (let i = 0; i < arr.length; i++)',
        why: 'При i === length элемента уже нет, и обращение вернёт undefined.',
      },
    ],
    quizId: 'quiz-js-loops',
    taskIds: ['task-js-loops'],
    resources: [
      { title: 'learn.javascript.ru — циклы', url: 'https://learn.javascript.ru/while-for', kind: 'tutorial', source: 'plan' },
    ],
    examRefs: [],
    prerequisites: ['js-operators'],
    estimatedMinutes: 40,
    planDays: ['day-05-3'],
    source: 'plan',
  },

  {
    id: 'js-functions',
    title: 'Функции: объявление, параметры, стрелочные',
    tech: ['js'],
    monthNo: 2,
    weekNo: 5,
    importance: 'core',
    summary:
      'Функция — это именованный кусок логики, который можно вызвать много раз. Валидация логина, форматирование даты, цвет статуса — всё это функции.',
    mustKnow: [
      'Объявление function и стрелочная запись',
      'Параметры, значения по умолчанию, return',
      'Область видимости: что видно внутри и снаружи',
      'Чистая функция: одни и те же аргументы — один результат',
      'Функция как аргумент другой функции',
    ],
    theory: `## Две записи

\`\`\`js
// объявление функции
function checkLogin(login) {
  return login.length >= 6;
}

// стрелочная функция
const checkPassword = (password) => password.length >= 8;
\`\`\`

Стрелочные короче и чаще используются как аргументы (\`filter\`, \`map\`, обработчики событий). Объявления функций «поднимаются» — их можно вызвать выше по файлу, стрелочные нельзя.

## Параметры и return

\`\`\`js
function formatDate(iso, separator = '.') {
  const [year, month, day] = iso.split('-');
  return day + separator + month + separator + year;
}

formatDate('2026-09-14');        // '14.09.2026'
formatDate('2026-09-14', '/');   // '14/09/2026'
\`\`\`

Функция без \`return\` возвращает \`undefined\`. После \`return\` выполнение прекращается — это удобно для ранних выходов:

\`\`\`js
function validate(login) {
  if (!login) return 'Введите логин';
  if (login.length < 6) return 'Минимум 6 символов';
  if (!/^[A-Za-z0-9]+$/.test(login)) return 'Только латиница и цифры';
  return '';
}
\`\`\`

Такой «ранний выход» читается лучше, чем лесенка вложенных if.

## Область видимости

\`\`\`js
const total = 10;

function show() {
  const local = 5;
  console.log(total); // видно: внешняя переменная
}

console.log(local);   // ошибка: снаружи не видно
\`\`\`

Внутри функции видно всё, что объявлено снаружи, но не наоборот. Это основа всего: именно так работают и замыкания, и React-хуки.

## Чистые функции

Чистая функция не меняет ничего вне себя и не зависит от внешнего состояния. Такие функции легко тестировать — и именно их проверяют автотесты платформы.

\`\`\`js
// чистая
const sum = (a, b) => a + b;

// не чистая: меняет внешний массив
function addRow(row) { rows.push(row); }
\`\`\`

## Функция как аргумент

\`\`\`js
const newOnes = applications.filter((a) => a.status === 'Новая');
button.addEventListener('click', () => console.log('клик'));
\`\`\`

Это не «магия фреймворка», а обычная возможность языка: функцию можно передать так же, как число или строку.`,
    examples: [
      {
        title: 'Валидация из задания экзамена',
        language: 'javascript',
        code: `const LOGIN_PATTERN = /^[A-Za-z0-9]{6,}$/;

function checkLogin(login) {
  return LOGIN_PATTERN.test(login);
}

function checkPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

console.log(checkLogin('ivanov26'));   // true
console.log(checkLogin('иванов26'));   // false — кириллица
console.log(checkLogin('ivan'));       // false — короче шести
console.log(checkPassword('demo'));    // false`,
        explanation:
          'Две функции закрывают требование задания к логину и паролю. Их же вы переиспользуете и на сервере — правила должны совпадать.',
      },
    ],
    mistakes: [
      {
        title: 'Забыть return',
        wrong: 'function sum(a, b) { a + b; }',
        right: 'function sum(a, b) { return a + b; }',
        why: 'Без return функция возвращает undefined — тесты сразу это покажут.',
      },
      {
        title: 'Функция делает слишком много',
        why: 'Функция «проверить и отправить и показать ошибку» не переиспользуется и плохо тестируется. Разделяйте: проверка отдельно, отправка отдельно.',
      },
    ],
    quizId: 'quiz-js-functions',
    taskIds: ['task-js-validate-login'],
    resources: [
      { title: 'learn.javascript.ru — функции', url: 'https://learn.javascript.ru/function-basics', kind: 'tutorial', source: 'plan' },
    ],
    examRefs: ['m1-register'],
    prerequisites: ['js-operators'],
    estimatedMinutes: 45,
    planDays: ['day-05-4'],
    source: 'plan',
  },

  {
    id: 'js-arrays',
    title: 'Массивы: перебор, поиск, фильтрация',
    tech: ['js'],
    monthNo: 2,
    weekNo: 5,
    importance: 'core',
    summary:
      'Массив — список значений. Список заявок в админке, варианты помещений, набор ошибок формы. Методы массива заменяют почти все циклы.',
    mustKnow: [
      '`push`, `length`, обращение по индексу',
      '`forEach` — просто перебрать',
      '`map` — преобразовать каждый элемент',
      '`filter` — оставить подходящие',
      '`find`, `includes`, `indexOf` — поиск',
    ],
    theory: `## Основы

\`\`\`js
const rooms = ['Аудитория', 'Коворкинг', 'Кинозал'];

rooms.length;        // 3
rooms[0];            // 'Аудитория'
rooms[rooms.length - 1]; // последний элемент
rooms.push('Холл');  // добавить в конец
\`\`\`

## forEach — перебрать

\`\`\`js
rooms.forEach((room, index) => {
  console.log(index + 1, room);
});
\`\`\`

\`forEach\` ничего не возвращает: его берут ради действия (вывести, отрисовать).

## map — преобразовать

\`\`\`js
const options = rooms.map((room) => \`<option>\${room}</option>\`);
\`\`\`

\`map\` возвращает **новый** массив той же длины. Это главный метод для отрисовки списков: и в чистом JS, и в React список заявок строится через \`map\`.

## filter — отобрать

\`\`\`js
const newOnes = applications.filter((a) => a.status === 'Новая');
\`\`\`

Возвращает новый массив только из подходящих элементов. Ровно это требуется в админке экзамена: «фильтры» из модуля 2.

## find и includes

\`\`\`js
const found = applications.find((a) => a.id === 5);   // элемент или undefined
rooms.includes('Кинозал');                            // true / false
\`\`\`

\`find\` возвращает первый подходящий элемент, \`filter\` — все.

## Важно: что меняет исходный массив

| Метод | Меняет исходный? |
|---|---|
| \`push\`, \`pop\`, \`splice\`, \`sort\`, \`reverse\` | **Да** |
| \`map\`, \`filter\`, \`slice\`, \`concat\` | Нет, возвращают новый |

\`sort\` меняет массив на месте — в React это источник трудных ошибок. Правильно так:

\`\`\`js
const sorted = [...applications].sort((a, b) => a.date.localeCompare(b.date));
\`\`\`

## Цепочки

\`\`\`js
const page = applications
  .filter((a) => a.status === 'Новая')
  .sort((a, b) => a.date.localeCompare(b.date))
  .slice(0, 5);
\`\`\`

Фильтр → сортировка → страница. Это готовая логика админки экзамена, записанная тремя строками.`,
    examples: [
      {
        title: 'Заявки: фильтр, сортировка, страница',
        language: 'javascript',
        code: `const applications = [
  { id: 1, room: 'Коворкинг', date: '2026-09-21', status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '2026-09-14', status: 'Мероприятие завершено' },
  { id: 3, room: 'Аудитория', date: '2026-09-28', status: 'Новая' },
];

const result = applications
  .filter((a) => a.status === 'Новая')
  .sort((a, b) => a.date.localeCompare(b.date))
  .slice(0, 5);

console.table(result);`,
        explanation:
          'Даты в формате ГГГГ-ММ-ДД сравниваются как обычные строки — это удобно. В формате ДД.ММ.ГГГГ так делать нельзя.',
      },
    ],
    mistakes: [
      {
        title: 'sort без копии массива',
        wrong: 'const sorted = applications.sort(...)',
        right: 'const sorted = [...applications].sort(...)',
        why: 'sort меняет исходный массив. В React это приводит к тому, что состояние «меняется само», и перерисовка идёт неправильно.',
      },
      {
        title: 'Использовать map ради побочного действия',
        wrong: 'items.map((item) => console.log(item));',
        right: 'items.forEach((item) => console.log(item));',
        why: 'map создаёт новый массив, который никто не использует. Для действий есть forEach.',
      },
    ],
    quizId: 'quiz-js-arrays',
    taskIds: ['task-js-filter-applications'],
    resources: [
      { title: 'learn.javascript.ru — методы массивов', url: 'https://learn.javascript.ru/array-methods', kind: 'tutorial', source: 'plan' },
    ],
    examRefs: ['m2-admin-tools'],
    prerequisites: ['js-functions'],
    estimatedMinutes: 45,
    planDays: ['day-05-5'],
    source: 'plan',
  },

  {
    id: 'js-objects',
    title: 'Объекты, массивы объектов и JSON',
    tech: ['js'],
    monthNo: 2,
    weekNo: 5,
    importance: 'core',
    summary:
      'Объект описывает одну сущность: заявку, пользователя, помещение. Данные между браузером и сервером ходят именно как JSON — объект, записанный строкой.',
    mustKnow: [
      'Создание объекта и доступ через точку и скобки',
      'Вложенные объекты и массивы объектов',
      '`Object.keys`, `Object.values`, `Object.entries`',
      '`JSON.stringify` и `JSON.parse`',
      'Ссылочная природа объектов',
    ],
    theory: `## Объект

\`\`\`js
const application = {
  id: 1,
  room: 'Коворкинг',
  date: '2026-09-14',
  payment: 'Банковская карта',
  status: 'Новая',
};

application.room;          // 'Коворкинг'
application['status'];     // 'Новая' — когда имя в переменной
application.reviewed = false;  // добавить поле
\`\`\`

Запись в скобках нужна, когда имя поля лежит в переменной: \`application[field]\`.

## Массив объектов

Именно так приходят данные с сервера:

\`\`\`js
const applications = [
  { id: 1, room: 'Коворкинг', status: 'Новая' },
  { id: 2, room: 'Кинозал', status: 'Мероприятие завершено' },
];

console.table(applications);
\`\`\`

\`console.table\` выводит массив объектов таблицей — очень удобно при отладке админки.

## Перебор полей

\`\`\`js
Object.keys(application);    // ['id', 'room', 'date', …]
Object.values(application);  // [1, 'Коворкинг', …]
Object.entries(application); // [['id', 1], ['room', 'Коворкинг'], …]

for (const [key, value] of Object.entries(errors)) {
  console.log(key, value);
}
\`\`\`

Так удобно выводить объект ошибок формы: ключ — имя поля, значение — текст ошибки.

## JSON

JSON — это текстовый формат записи данных. Между браузером и сервером ходят строки, а не объекты.

\`\`\`js
const text = JSON.stringify(application);
// '{"id":1,"room":"Коворкинг", …}'

const back = JSON.parse(text);
// снова объект
\`\`\`

\`JSON.stringify\` понадобится в каждом POST-запросе, \`JSON.parse\` — при чтении ответа (хотя \`fetch\` умеет это сам через \`response.json()\`).

В JSON нельзя записать функции, \`undefined\` и даты как объекты — дата превращается в строку.

## Объекты передаются по ссылке

\`\`\`js
const a = { status: 'Новая' };
const b = a;
b.status = 'Мероприятие завершено';
console.log(a.status);  // 'Мероприятие завершено' — изменился и a!
\`\`\`

\`a\` и \`b\` — это две ссылки на один объект. Чтобы получить независимую копию:

\`\`\`js
const copy = { ...a };                       // поверхностная копия
const deep = structuredClone(a);             // полная копия
\`\`\`

Это критично в React: если изменить объект состояния «на месте», компонент не перерисуется.`,
    examples: [
      {
        title: '«База» заявок в памяти',
        language: 'javascript',
        code: `const applications = [
  { id: 1, user: 'Иванов И.И.', room: 'Аудитория', date: '2026-09-14', status: 'Новая' },
  { id: 2, user: 'Петров П.П.', room: 'Коворкинг', date: '2026-09-21', status: 'Мероприятие назначено' },
  { id: 3, user: 'Сидоров С.С.', room: 'Кинозал', date: '2026-09-28', status: 'Мероприятие завершено' },
];

console.table(applications);

// Смена статуса без мутации исходного массива
const updated = applications.map((item) =>
  item.id === 1 ? { ...item, status: 'Мероприятие назначено' } : item,
);

console.log(applications[0].status);  // 'Новая' — исходный не тронут
console.log(updated[0].status);       // 'Мероприятие назначено'`,
        explanation:
          'Приём «map + спред» — стандартный способ изменить один элемент списка, не трогая остальные. В React он используется постоянно.',
      },
    ],
    mistakes: [
      {
        title: 'Изменить объект состояния на месте',
        wrong: 'application.status = "Новая";',
        right: 'const next = { ...application, status: "Новая" };',
        why: 'React сравнивает ссылки. Если ссылка та же, перерисовки не будет — на экране останутся старые данные.',
      },
      {
        title: 'Считать, что JSON сохранит всё',
        why: 'Функции и undefined пропадают, дата превращается в строку. После JSON.parse дату придётся восстанавливать.',
      },
    ],
    quizId: 'quiz-js-objects',
    taskIds: ['task-js-objects'],
    projectIds: ['project-02-validation-module'],
    resources: [
      { title: 'learn.javascript.ru — объекты', url: 'https://learn.javascript.ru/object', kind: 'tutorial', source: 'plan' },
    ],
    examRefs: ['m1-cabinet'],
    prerequisites: ['js-arrays'],
    estimatedMinutes: 45,
    planDays: ['day-05-6'],
    source: 'plan',
  },

  {
    id: 'js-dom',
    title: 'DOM: поиск элементов и изменение страницы',
    tech: ['js'],
    monthNo: 2,
    weekNo: 6,
    importance: 'core',
    summary:
      'DOM — это страница, представленная объектами. Через него скрипт находит элементы, меняет текст, классы и видимость.',
    mustKnow: [
      '`querySelector` и `querySelectorAll`',
      '`textContent` против `innerHTML`',
      '`classList.add/remove/toggle/contains`',
      'Атрибуты: `getAttribute`, `setAttribute`, `dataset`',
      'Почему innerHTML с пользовательскими данными опасен',
    ],
    theory: `## Поиск элементов

\`\`\`js
const form = document.querySelector('#register-form');
const inputs = document.querySelectorAll('.form-control');
const error = form.querySelector('.invalid-feedback');
\`\`\`

\`querySelector\` принимает любой CSS-селектор и возвращает **первый** подходящий элемент или \`null\`. \`querySelectorAll\` возвращает коллекцию (не массив; чтобы получить массив — \`[...list]\`).

Поиск можно ограничить частью страницы: \`form.querySelector(...)\` ищет только внутри формы.

## Изменение содержимого

\`\`\`js
title.textContent = 'Мои заявки';          // безопасно: только текст
card.innerHTML = '<b>Новая</b>';           // разметка, но осторожно
\`\`\`

**Правило безопасности:** данные, пришедшие от пользователя или с сервера, вставляйте через \`textContent\`. Если вставить их через \`innerHTML\`, отзыв вида \`<img src=x onerror=alert(1)>\` выполнит чужой скрипт на вашей странице. Это уязвимость XSS, и на экзамене она попадает в «качество кода».

## Классы

\`\`\`js
input.classList.add('is-invalid');
input.classList.remove('is-invalid');
input.classList.toggle('d-none');
input.classList.contains('is-invalid');  // true / false
\`\`\`

Управлять видом элемента через классы правильнее, чем через \`element.style\`: стили остаются в CSS, а скрипт только переключает состояние.

## Атрибуты и data-\*

\`\`\`js
input.setAttribute('aria-invalid', 'true');
const id = row.dataset.id;   // из data-id="5"
\`\`\`

\`data-*\` — стандартный способ связать элемент с данными: например, повесить id заявки на строку таблицы, чтобы обработчик знал, что менять.

## Создание и удаление

\`\`\`js
const li = document.createElement('li');
li.textContent = application.room;
list.append(li);

li.remove();
list.innerHTML = '';   // очистить контейнер
\`\`\``,
    examples: [
      {
        title: 'Показать и скрыть блок',
        language: 'html',
        code: `<button id="toggle" type="button">Показать фильтры</button>
<div id="filters" class="hidden">Здесь фильтры</div>

<style>.hidden { display: none; }</style>

<script>
  const button = document.querySelector('#toggle');
  const filters = document.querySelector('#filters');

  button.addEventListener('click', () => {
    const hidden = filters.classList.toggle('hidden');
    button.textContent = hidden ? 'Показать фильтры' : 'Скрыть фильтры';
  });
</script>`,
        runnable: true,
      },
    ],
    mistakes: [
      {
        title: 'innerHTML с данными пользователя',
        wrong: 'card.innerHTML = review.text;',
        right: 'card.textContent = review.text;',
        why: 'Через innerHTML можно внедрить скрипт (XSS). Отзывы, ФИО и названия всегда вставляйте текстом.',
      },
      {
        title: 'Скрипт до разметки',
        why: 'querySelector вернёт null, если скрипт выполнился раньше, чем браузер дошёл до элемента. Помогает defer.',
      },
      {
        title: 'Менять вид через element.style',
        wrong: "el.style.borderColor = 'red';",
        right: "el.classList.add('is-invalid');",
        why: 'Inline-стили перебивают CSS и разносят оформление по всему проекту.',
      },
    ],
    quizId: 'quiz-js-dom',
    taskIds: ['task-js-dom-toggle'],
    resources: [
      { title: 'learn.javascript.ru — документ и DOM', url: 'https://learn.javascript.ru/document', kind: 'tutorial', source: 'plan' },
    ],
    examRefs: ['m2-register-hints'],
    prerequisites: ['js-objects', 'html-semantic'],
    estimatedMinutes: 45,
    planDays: ['day-06-1'],
    source: 'plan',
  },

  {
    id: 'js-events',
    title: 'События: клики, ввод, отправка формы',
    tech: ['js'],
    monthNo: 2,
    weekNo: 6,
    importance: 'core',
    summary:
      'События связывают действия пользователя с кодом. Отправка формы, ввод в поле, клик по кнопке — на экзамене всё держится на них.',
    mustKnow: [
      '`addEventListener` и объект события',
      'Типы: click, input, change, submit, keydown',
      '`event.preventDefault()` — отменить перезагрузку страницы',
      '`event.target` и делегирование событий',
      'Снятие обработчика и почему это важно',
    ],
    theory: `## Подписка на событие

\`\`\`js
button.addEventListener('click', (event) => {
  console.log('клик по', event.target);
});
\`\`\`

Первый аргумент — имя события, второй — функция-обработчик. В неё браузер передаёт объект события со всей информацией.

## Главные события формы

| Событие | Когда срабатывает |
|---|---|
| \`input\` | При каждом изменении значения поля |
| \`change\` | Когда значение зафиксировано (потеря фокуса, выбор в select) |
| \`submit\` | При отправке формы |
| \`click\` | Клик по элементу |
| \`keydown\` | Нажата клавиша |

## preventDefault

\`\`\`js
form.addEventListener('submit', (event) => {
  event.preventDefault();   // без этого страница перезагрузится
  const data = new FormData(form);
  console.log(Object.fromEntries(data));
});
\`\`\`

Это самая частая строка в работе с формами. По умолчанию браузер отправляет форму и перезагружает страницу — в приложении на JavaScript это не нужно.

\`FormData\` + \`Object.fromEntries\` быстро превращают форму в обычный объект — пригодится для отправки на сервер.

## Делегирование

Если строк в таблице много, не нужно вешать обработчик на каждую кнопку. Достаточно одного на контейнер:

\`\`\`js
table.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action="status"]');
  if (!button) return;
  const id = button.dataset.id;
  changeStatus(id);
});
\`\`\`

\`closest\` поднимается от точки клика вверх и находит нужный элемент. Приём особенно полезен, когда строки добавляются динамически: новый обработчик вешать не надо.

## Снятие обработчика

\`\`\`js
function onScroll() { /* … */ }
window.addEventListener('scroll', onScroll);
window.removeEventListener('scroll', onScroll);
\`\`\`

Снять можно только именованную функцию — ту же самую ссылку. В React эту роль выполняет функция очистки в \`useEffect\`.`,
    examples: [
      {
        title: 'Меню-бургер',
        language: 'html',
        code: `<nav class="nav">
  <button class="burger" type="button" aria-expanded="false" aria-controls="menu">Меню</button>
  <ul class="menu" id="menu" hidden>
    <li><a href="/order">Заявка</a></li>
    <li><a href="/cabinet">Кабинет</a></li>
  </ul>
</nav>

<script>
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('#menu');

  burger.addEventListener('click', () => {
    const willOpen = menu.hidden;
    menu.hidden = !willOpen;
    burger.setAttribute('aria-expanded', String(willOpen));
  });
</script>`,
        explanation:
          'Атрибут aria-expanded сообщает программам чтения с экрана, открыто меню или нет. Это часть требований доступности.',
        runnable: true,
      },
    ],
    mistakes: [
      {
        title: 'Забыть preventDefault',
        why: 'Страница перезагрузится, и вы увидите, будто «ничего не произошло»: данные исчезнут вместе с состоянием.',
      },
      {
        title: 'Вызвать функцию вместо передачи',
        wrong: "button.addEventListener('click', handleClick());",
        right: "button.addEventListener('click', handleClick);",
        why: 'Со скобками функция выполнится сразу, а обработчиком станет её результат (обычно undefined).',
      },
    ],
    quizId: 'quiz-js-events',
    taskIds: ['task-js-form-submit'],
    resources: [
      { title: 'learn.javascript.ru — события', url: 'https://learn.javascript.ru/events', kind: 'tutorial', source: 'plan' },
    ],
    examRefs: ['m1-register', 'm2-admin-tools'],
    prerequisites: ['js-dom'],
    estimatedMinutes: 45,
    planDays: ['day-06-2'],
    source: 'plan',
  },

  {
    id: 'js-render',
    title: 'Отрисовка списка из массива',
    tech: ['js'],
    monthNo: 2,
    weekNo: 6,
    importance: 'core',
    summary:
      'Данные приходят массивом, а на экране должны стать карточками или строками таблицы. Эта задача повторяется в каждом проекте экзамена.',
    mustKnow: [
      '`createElement` + `append` против `innerHTML`',
      'Отрисовка через `map().join("")`',
      'Очистка контейнера перед перерисовкой',
      'Состояние «пусто»: что показать, когда заявок нет',
      'Экранирование пользовательского текста',
    ],
    theory: `## Два способа

**Через создание элементов** — безопасно, многословно:

\`\`\`js
function renderCard(application) {
  const card = document.createElement('article');
  card.className = 'card';

  const title = document.createElement('h3');
  title.textContent = application.room;     // безопасно

  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = application.status;

  card.append(title, badge);
  return card;
}
\`\`\`

**Через строку разметки** — быстро, но требует осторожности:

\`\`\`js
container.innerHTML = applications
  .map((a) => \`
    <article class="card">
      <h3>\${escapeHtml(a.room)}</h3>
      <span class="badge">\${escapeHtml(a.status)}</span>
    </article>\`)
  .join('');
\`\`\`

Функция экранирования обязательна, если в данных есть текст от пользователя (отзыв, ФИО):

\`\`\`js
const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[ch]);
\`\`\`

## Полный цикл перерисовки

\`\`\`js
function render(list) {
  container.innerHTML = '';                  // 1. очистить

  if (!list.length) {                        // 2. пустое состояние
    container.innerHTML = '<p class="muted">У вас пока нет заявок</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  list.forEach((item) => fragment.append(renderCard(item)));
  container.append(fragment);                // 3. вставить одним разом
}
\`\`\`

\`DocumentFragment\` — контейнер «на время»: браузер пересчитывает раскладку один раз, а не на каждую карточку.

## Пустое состояние

Раздел 33 технического задания и критерий «качество кода» на экзамене требуют состояний: «загрузка», «пусто», «ошибка». Пустой экран без объяснений выглядит как поломка.

## Связь с React

В React вы напишете почти то же самое:

\`\`\`jsx
{applications.map((a) => <ApplicationCard key={a.id} application={a} />)}
\`\`\`

Разница в том, что React сам решает, что перерисовать. Логика «массив → список элементов» остаётся ровно той же.`,
    examples: [
      {
        title: 'Список заявок карточками',
        language: 'html',
        code: `<div id="list"></div>

<script>
  const applications = [
    { id: 1, room: 'Коворкинг', date: '14.09.2026', status: 'Новая' },
    { id: 2, room: 'Кинозал', date: '21.09.2026', status: 'Мероприятие завершено' },
  ];

  const list = document.querySelector('#list');

  function render(items) {
    list.innerHTML = '';
    if (!items.length) {
      const empty = document.createElement('p');
      empty.textContent = 'У вас пока нет заявок';
      list.append(empty);
      return;
    }
    items.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.dataset.id = item.id;

      const title = document.createElement('h3');
      title.textContent = item.room;

      const meta = document.createElement('p');
      meta.textContent = item.date + ' · ' + item.status;

      card.append(title, meta);
      list.append(card);
    });
  }

  render(applications);
</script>`,
        runnable: true,
      },
    ],
    mistakes: [
      {
        title: 'Добавлять к существующему списку вместо перерисовки',
        why: 'После второго вызова render карточки задвоятся. Контейнер нужно очищать.',
      },
      {
        title: 'Вставлять отзыв через innerHTML без экранирования',
        why: 'Прямой путь к XSS. Текст от пользователя — только textContent или экранирование.',
      },
      {
        title: 'Нет состояния «пусто»',
        why: 'Пользователь видит пустой экран и думает, что приложение сломалось.',
      },
    ],
    quizId: 'quiz-js-render',
    taskIds: ['task-js-render-list'],
    resources: [
      { title: 'MDN: createElement', url: 'https://developer.mozilla.org/ru/docs/Web/API/Document/createElement', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m1-cabinet', 'm2-cabinet-ux'],
    prerequisites: ['js-dom', 'js-arrays'],
    estimatedMinutes: 45,
    planDays: ['day-06-3'],
    source: 'plan',
  },

  {
    id: 'js-regexp',
    title: 'Регулярные выражения: проверка логина',
    tech: ['js'],
    monthNo: 2,
    weekNo: 6,
    importance: 'core',
    summary:
      'Регулярное выражение описывает шаблон строки. Требование экзамена «логин: латинские буквы и цифры, минимум шесть символов» — это ровно одна регулярка.',
    mustKnow: [
      'Литерал `/шаблон/флаги` и метод `test`',
      'Якоря `^` и `$`',
      'Наборы `[A-Za-z0-9]`, классы `\\d`, `\\w`, `\\s`',
      'Кванторы `+`, `*`, `?`, `{6,}`',
      'Почему без `^` и `$` проверка ничего не гарантирует',
    ],
    theory: `## Основа

\`\`\`js
const pattern = /^[A-Za-z0-9]{6,}$/;
pattern.test('ivanov26');   // true
pattern.test('иванов26');   // false
pattern.test('ivan');       // false
pattern.test('ivanov 26');  // false
\`\`\`

Разберём по частям:

| Часть | Значение |
|---|---|
| \`^\` | Начало строки |
| \`[A-Za-z0-9]\` | Один символ: латинская буква или цифра |
| \`{6,}\` | Шесть и более таких символов |
| \`$\` | Конец строки |

## Якоря обязательны

Без \`^\` и \`$\` выражение ищет совпадение **где-нибудь внутри** строки:

\`\`\`js
/[A-Za-z0-9]{6,}/.test('иванов ivanov26');  // true — а логин-то плохой
/^[A-Za-z0-9]{6,}$/.test('иванов ivanov26'); // false — верно
\`\`\`

Это самая частая ошибка в валидации.

## Полезные обозначения

| Запись | Что значит |
|---|---|
| \`\\d\` | Цифра (то же, что \`[0-9]\`) |
| \`\\w\` | Буква латиницы, цифра или подчёркивание |
| \`\\s\` | Пробельный символ |
| \`.\` | Любой символ |
| \`a?\` | Ноль или один \`a\` |
| \`a+\` | Один и более |
| \`a*\` | Ноль и более |
| \`(a|b)\` | \`a\` или \`b\` |

Точка внутри набора — обычная точка: \`[0-9.]\` — цифра или точка.

## Шаблоны для проекта экзамена

\`\`\`js
const LOGIN = /^[A-Za-z0-9]{6,}$/;          // требование задания
const DATE_RU = /^\\d{2}\\.\\d{2}\\.\\d{4}$/;   // ДД.ММ.ГГГГ
const PHONE = /^\\+?[0-9\\s()-]{10,}$/;       // телефон, мягкая проверка
\`\`\`

Для e-mail не нужно изобретать сложное выражение: достаточно \`type="email"\` в разметке плюс простая проверка на сервере. Полная регулярка для почты занимает несколько строк и всё равно не идеальна.

## Где применять

\`\`\`js
'ivanov26'.match(/\\d+/);           // ['26'] — найти
'14.09.2026'.replace(/\\./g, '-');  // '14-09-2026' — заменить (флаг g — все)
'a, b,c'.split(/,\\s*/);            // ['a', 'b', 'c'] — разделить
\`\`\`

## Проверка выражения без интернета

На экзамене не будет онлайн-тестеров. Проверяйте так же, как учат тесты платформы: прогоняйте набор строк — заведомо верные и заведомо неверные — и смотрите результат \`test\`.`,
    examples: [
      {
        title: 'Набор проверок логина',
        language: 'javascript',
        code: `const LOGIN_PATTERN = /^[A-Za-z0-9]{6,}$/;

const samples = [
  'ivanov26',      // ok
  'IVANOV26',      // ok
  'ivan',          // коротко
  'иванов26',      // кириллица
  'ivanov 26',     // пробел
  'ivanov_26',     // подчёркивание не разрешено
  'ivanov-26',     // дефис не разрешён
  '123456',        // только цифры — по заданию допустимо
];

samples.forEach((value) => {
  console.log(String(LOGIN_PATTERN.test(value)).padEnd(6), value);
});`,
        explanation:
          'Задание требует «латинские буквы и цифры». Строго по тексту логин только из цифр допустим — если преподаватель считает иначе, добавьте требование хотя бы одной буквы: /^(?=.*[A-Za-z])[A-Za-z0-9]{6,}$/.',
      },
    ],
    mistakes: [
      {
        title: 'Регулярка без якорей',
        wrong: '/[A-Za-z0-9]{6,}/',
        right: '/^[A-Za-z0-9]{6,}$/',
        why: 'Без ^ и $ строка «иванов ivanov26» пройдёт проверку.',
      },
      {
        title: 'Забыть экранировать точку',
        wrong: '/^\\d{2}.\\d{2}.\\d{4}$/',
        right: '/^\\d{2}\\.\\d{2}\\.\\d{4}$/',
        why: 'Неэкранированная точка означает «любой символ», и строка 14x09y2026 пройдёт проверку даты.',
      },
    ],
    quizId: 'quiz-js-regexp',
    taskIds: ['task-js-validate-login'],
    projectIds: ['project-02-validation-module'],
    resources: [
      { title: 'learn.javascript.ru — регулярные выражения', url: 'https://learn.javascript.ru/regular-expressions', kind: 'tutorial', source: 'plan' },
    ],
    examRefs: ['m1-register', 'm2-order-form'],
    prerequisites: ['js-functions'],
    estimatedMinutes: 45,
    planDays: ['day-06-4'],
    source: 'plan',
  },

  {
    id: 'js-validation',
    title: 'Валидация формы: подсказки рядом с полями',
    tech: ['js'],
    monthNo: 2,
    weekNo: 6,
    importance: 'core',
    summary:
      'Модуль 2 экзамена требует показывать подсказки об ошибках рядом с формой. Это отдельная задача: собрать ошибки, показать их у конкретных полей и не дать отправить форму.',
    mustKnow: [
      'Объект ошибок: { поле: текст }',
      'Проверка всех полей одной функцией',
      'Классы is-invalid и блок invalid-feedback',
      'Блокировка отправки при ошибках',
      'Показ серверных ошибок в том же месте',
    ],
    theory: `## Отдельная функция проверки

Валидацию выносят в чистую функцию: её легко протестировать и переиспользовать на сервере.

\`\`\`js
const LOGIN_PATTERN = /^[A-Za-z0-9]{6,}$/;

function validateRegister(values) {
  const errors = {};

  if (!values.login) errors.login = 'Введите логин';
  else if (!LOGIN_PATTERN.test(values.login)) {
    errors.login = 'Только латинские буквы и цифры, минимум 6 символов';
  }

  if (!values.password) errors.password = 'Введите пароль';
  else if (values.password.length < 8) errors.password = 'Пароль не короче 8 символов';

  if (!values.fullName) errors.fullName = 'Укажите ФИО';
  if (!values.phone) errors.phone = 'Укажите телефон';
  if (!values.email) errors.email = 'Укажите e-mail';

  return errors;   // пустой объект — ошибок нет
}
\`\`\`

Функция ничего не знает про DOM. Это позволяет проверить её автотестами и скопировать на сервер почти без изменений.

## Показ ошибок

\`\`\`js
function showErrors(form, errors) {
  form.querySelectorAll('[name]').forEach((field) => {
    const message = errors[field.name];
    field.classList.toggle('is-invalid', Boolean(message));
    const feedback = field.parentElement.querySelector('.invalid-feedback');
    if (feedback) feedback.textContent = message ?? '';
  });
}
\`\`\`

Такая структура — поле, класс \`is-invalid\`, соседний блок с текстом — совпадает с соглашением Bootstrap, поэтому на экзамене вы получите то же поведение с библиотекой и без неё.

## Отправка

\`\`\`js
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const values = Object.fromEntries(new FormData(form));
  const errors = validateRegister(values);
  showErrors(form, errors);

  if (Object.keys(errors).length) {
    form.querySelector('.is-invalid')?.focus();   // фокус на первую ошибку
    return;
  }

  sendToServer(values);
});
\`\`\`

Перевод фокуса на первое проблемное поле — мелочь, которая заметно улучшает удобство и учитывается в доступности.

## Когда показывать ошибки

Три рабочих подхода:

1. **После попытки отправки** — самый спокойный вариант, рекомендуется по умолчанию.
2. **При потере фокуса** (\`blur\`) — ошибка появляется, когда пользователь закончил с полем.
3. **Live-проверка** (\`input\`) — только для уже «испорченных» полей, иначе ошибка мигает при вводе первого символа.

## Ошибки сервера

Занятый логин фронтенд проверить не может. Сервер вернёт 409, и ответ нужно положить в тот же объект ошибок:

\`\`\`js
const response = await sendToServer(values);
if (response.status === 409) {
  showErrors(form, { login: 'Такой логин уже занят' });
}
\`\`\`

Пользователь видит ошибку там же, где остальные — у поля логина.`,
    examples: [
      {
        title: 'Валидация регистрации целиком',
        language: 'html',
        code: `<form id="register" novalidate>
  <div class="field">
    <label for="login">Логин</label>
    <input id="login" name="login" type="text">
    <small class="invalid-feedback"></small>
  </div>
  <div class="field">
    <label for="password">Пароль</label>
    <input id="password" name="password" type="password">
    <small class="invalid-feedback"></small>
  </div>
  <button type="submit">Зарегистрироваться</button>
</form>

<style>
  .invalid-feedback { color: #dc2626; font-size: .85rem; display: block; min-height: 1em; }
  .is-invalid { border-color: #dc2626; }
</style>

<script>
  const LOGIN_PATTERN = /^[A-Za-z0-9]{6,}$/;
  const form = document.querySelector('#register');

  function validate(values) {
    const errors = {};
    if (!LOGIN_PATTERN.test(values.login || '')) {
      errors.login = 'Только латинские буквы и цифры, минимум 6 символов';
    }
    if ((values.password || '').length < 8) {
      errors.password = 'Пароль не короче 8 символов';
    }
    return errors;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    const errors = validate(values);

    form.querySelectorAll('[name]').forEach((field) => {
      const message = errors[field.name];
      field.classList.toggle('is-invalid', Boolean(message));
      field.parentElement.querySelector('.invalid-feedback').textContent = message || '';
    });

    if (!Object.keys(errors).length) console.log('Отправляем на сервер', values);
  });
</script>`,
        runnable: true,
      },
    ],
    mistakes: [
      {
        title: 'Один общий текст ошибки сверху формы',
        why: 'Задание требует подсказки «рядом с формой» у конкретных полей. Общее «Проверьте данные» не показывает, что именно исправить.',
      },
      {
        title: 'Валидация только на клиенте',
        why: 'Запрос можно отправить в обход формы. Сервер обязан проверить те же правила — это прямое требование качества кода.',
      },
      {
        title: 'Красная форма сразу при открытии',
        why: 'Показывайте ошибки после попытки отправки или после ввода, а не при загрузке страницы.',
      },
    ],
    quizId: 'quiz-js-validation',
    taskIds: ['task-js-validate-form'],
    projectIds: ['project-02-validation-module'],
    resources: [
      { title: 'MDN: валидация форм', url: 'https://developer.mozilla.org/ru/docs/Learn/Forms/Form_validation', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m1-register', 'm2-register-hints'],
    prerequisites: ['js-regexp', 'js-events'],
    estimatedMinutes: 50,
    planDays: ['day-06-5'],
    source: 'plan',
  },

  {
    id: 'js-timers',
    title: 'Таймеры и слайдер: setInterval, clearInterval',
    tech: ['js'],
    monthNo: 2,
    weekNo: 6,
    importance: 'core',
    summary:
      'Слайдер из задания — это таймер плюс индекс текущего слайда. Требование дословно: четыре изображения, автопереключение каждые три секунды, кнопки вперёд и назад.',
    mustKnow: [
      '`setTimeout` — один раз через N мс',
      '`setInterval` — повторять каждые N мс',
      '`clearInterval` и зачем сохранять идентификатор',
      'Перелистывание по кругу через остаток от деления',
      'Сброс таймера при ручном переключении',
    ],
    theory: `## Два таймера

\`\`\`js
const timeoutId = setTimeout(() => console.log('через 3 секунды'), 3000);
clearTimeout(timeoutId);

const intervalId = setInterval(() => console.log('каждые 3 секунды'), 3000);
clearInterval(intervalId);
\`\`\`

Время задаётся в миллисекундах: **три секунды — это 3000**.

Идентификатор таймера нужно сохранять: без него остановить повтор невозможно, и интервалы начнут накапливаться.

## Слайдер: логика

Состояние слайдера — одно число: индекс текущего слайда.

\`\`\`js
let index = 0;
const total = 4;

function next() {
  index = (index + 1) % total;        // 0→1→2→3→0
  show(index);
}

function prev() {
  index = (index - 1 + total) % total; // 0→3→2→1→0
  show(index);
}
\`\`\`

Остаток от деления даёт круговое перелистывание. В \`prev\` прибавляется \`total\`, иначе при \`index = 0\` получится \`-1 % 4 = -1\`.

## Показ слайда

Самый простой способ — сдвиг ленты:

\`\`\`js
function show(i) {
  track.style.transform = \`translateX(-\${i * 100}%)\`;
}
\`\`\`

Анимируется \`transform\` — то есть плавно и без нагрузки на раскладку.

## Автопереключение

\`\`\`js
let timer = setInterval(next, 3000);

function restart() {
  clearInterval(timer);
  timer = setInterval(next, 3000);
}

nextButton.addEventListener('click', () => { next(); restart(); });
prevButton.addEventListener('click', () => { prev(); restart(); });
\`\`\`

Перезапуск после ручного клика — важная деталь: иначе автосмена сработает сразу после нажатия, и слайд «прыгнет» дважды.

## Остановка

Если элемент исчезает со страницы, таймер нужно остановить — иначе он продолжит работать и обращаться к несуществующим элементам. В чистом JS это делают вручную, в React — в функции очистки \`useEffect\` (неделя 11).`,
    examples: [
      {
        title: 'Слайдер по требованиям задания',
        language: 'html',
        code: `<div class="slider">
  <div class="track" id="track">
    <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='800' height='450' fill='%232563eb'/></svg>" alt="Слайд 1">
    <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='800' height='450' fill='%2316a34a'/></svg>" alt="Слайд 2">
    <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='800' height='450' fill='%23d97706'/></svg>" alt="Слайд 3">
    <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='800' height='450' fill='%23dc2626'/></svg>" alt="Слайд 4">
  </div>
  <button id="prev" type="button" aria-label="Предыдущий слайд">‹</button>
  <button id="next" type="button" aria-label="Следующий слайд">›</button>
</div>

<style>
  .slider { position: relative; overflow: hidden; max-width: 560px; border-radius: 12px; }
  .track { display: flex; transition: transform .4s ease; }
  .track img { flex: 0 0 100%; width: 100%; aspect-ratio: 16/9; object-fit: cover; }
  .slider button { position: absolute; top: 50%; transform: translateY(-50%); border: 0; background: rgb(0 0 0 / .5); color: #fff; font-size: 22px; padding: 4px 12px; cursor: pointer; }
  #prev { left: 8px; } #next { right: 8px; }
</style>

<script>
  const track = document.querySelector('#track');
  const total = track.children.length;
  let index = 0;
  let timer;

  function show(i) { track.style.transform = 'translateX(-' + i * 100 + '%)'; }
  function next() { index = (index + 1) % total; show(index); }
  function prev() { index = (index - 1 + total) % total; show(index); }
  function restart() { clearInterval(timer); timer = setInterval(next, 3000); }

  document.querySelector('#next').addEventListener('click', () => { next(); restart(); });
  document.querySelector('#prev').addEventListener('click', () => { prev(); restart(); });

  restart();
</script>`,
        explanation:
          'Четыре изображения одинакового размера, автопереключение каждые 3000 мс, кнопки вперёд и назад, перелистывание по кругу — все пункты требования модуля 2 закрыты.',
        runnable: true,
      },
    ],
    mistakes: [
      {
        title: 'Не сохранять идентификатор интервала',
        wrong: 'setInterval(next, 3000);',
        right: 'let timer = setInterval(next, 3000);',
        why: 'Без идентификатора интервал нельзя остановить; после нескольких запусков слайды начнут «прыгать».',
      },
      {
        title: 'Секунды вместо миллисекунд',
        wrong: 'setInterval(next, 3)',
        right: 'setInterval(next, 3000)',
        why: 'Три миллисекунды — это 333 переключения в секунду. Задание требует ровно три секунды.',
      },
      {
        title: 'Отрицательный индекс при перелистывании назад',
        wrong: 'index = (index - 1) % total;',
        right: 'index = (index - 1 + total) % total;',
        why: 'В JavaScript -1 % 4 равно -1, и слайдер сломается на первом же клике «назад».',
      },
    ],
    quizId: 'quiz-js-timers',
    taskIds: ['task-js-slider'],
    projectIds: ['project-02-validation-module'],
    resources: [
      { title: 'learn.javascript.ru — setTimeout и setInterval', url: 'https://learn.javascript.ru/settimeout-setinterval', kind: 'tutorial', source: 'plan' },
    ],
    examRefs: ['m2-slider'],
    prerequisites: ['js-events'],
    estimatedMinutes: 50,
    planDays: ['day-06-6'],
    source: 'plan',
  },
];

export const MONTH_02_TOPICS: Topic[] = [...WEEK_5_6, ...MONTH_02_MODERN_TOPICS];
