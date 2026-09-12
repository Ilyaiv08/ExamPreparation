import type { Task } from '../types';

/** Месяц 2, недели 5–7: базовый и современный JavaScript. */
export const MONTH_02_JS_TASKS: Task[] = [
  {
    id: 'task-js-types',
    title: 'Типы данных и приведение',
    kind: 'function',
    runtime: 'js',
    difficulty: 1,
    tech: ['js'],
    topicIds: ['js-intro'],
    monthNo: 2,
    weekNo: 5,
    statement: `Значение из поля ввода всегда приходит строкой. Напишите три небольшие функции, которые приводят данные к нужному виду.

1. \`toNumber(value)\` — превращает строку в число. Если число получить нельзя, возвращает \`null\` (а не \`NaN\`).
2. \`describe(value)\` — возвращает строку вида \`"строка: Новая"\`, \`"число: 42"\`, \`"логическое: true"\`, \`"пусто"\` для \`null\` и \`undefined\`.
3. \`formatCount(count)\` — возвращает \`"1 заявка"\`, \`"2 заявки"\`, \`"5 заявок"\` с правильным окончанием.`,
    requirements: [
      'toNumber возвращает число или null, но не NaN',
      'toNumber("") и toNumber("abc") возвращают null',
      'describe различает строку, число, логическое значение и пустоту',
      'formatCount склоняет слово «заявка» по правилам русского языка',
    ],
    starterCode: `function toNumber(value) {
  // ваш код
}

function describe(value) {
  // ваш код
}

function formatCount(count) {
  // ваш код
}`,
    tests: [
      { id: 't1', name: 'toNumber("42") → 42', type: 'call', entry: 'toNumber', args: ['42'], expected: 42 },
      { id: 't2', name: 'toNumber("3.5") → 3.5', type: 'call', entry: 'toNumber', args: ['3.5'], expected: 3.5 },
      { id: 't3', name: 'toNumber("") → null', type: 'call', entry: 'toNumber', args: [''], expected: null },
      { id: 't4', name: 'toNumber("abc") → null', type: 'call', entry: 'toNumber', args: ['abc'], expected: null },
      { id: 't5', name: 'toNumber(7) → 7', type: 'call', entry: 'toNumber', args: [7], expected: 7 },
      { id: 't6', name: 'describe("Новая")', type: 'call', entry: 'describe', args: ['Новая'], expected: 'строка: Новая' },
      { id: 't7', name: 'describe(42)', type: 'call', entry: 'describe', args: [42], expected: 'число: 42' },
      { id: 't8', name: 'describe(true)', type: 'call', entry: 'describe', args: [true], expected: 'логическое: true' },
      { id: 't9', name: 'describe(null) → "пусто"', type: 'call', entry: 'describe', args: [null], expected: 'пусто' },
      { id: 't10', name: 'describe(undefined) → "пусто"', type: 'call', entry: 'describe', args: [undefined], expected: 'пусто' },
      { id: 't11', name: 'formatCount(1)', type: 'call', entry: 'formatCount', args: [1], expected: '1 заявка' },
      { id: 't12', name: 'formatCount(3)', type: 'call', entry: 'formatCount', args: [3], expected: '3 заявки' },
      { id: 't13', name: 'formatCount(5)', type: 'call', entry: 'formatCount', args: [5], expected: '5 заявок' },
      { id: 't14', name: 'formatCount(11) → «заявок»', type: 'call', entry: 'formatCount', args: [11], expected: '11 заявок', hidden: true },
      { id: 't15', name: 'formatCount(21) → «заявка»', type: 'call', entry: 'formatCount', args: [21], expected: '21 заявка', hidden: true },
    ],
    hints: [
      { level: 1, text: 'Number("abc") возвращает NaN. Проверить это можно через Number.isNaN.', penaltyPercent: 10 },
      { level: 2, text: 'Для склонения смотрят на остатки от деления на 10 и на 100: mod10 и mod100.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'Правило: если mod10 === 1 и mod100 !== 11 — «заявка»; если mod10 от 2 до 4 и mod100 вне 10…20 — «заявки»; иначе «заявок».',
        penaltyPercent: 35,
      },
    ],
    solution: `function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const result = Number(value);
  return Number.isNaN(result) ? null : result;
}

function describe(value) {
  if (value === null || value === undefined) return 'пусто';
  if (typeof value === 'string') return 'строка: ' + value;
  if (typeof value === 'number') return 'число: ' + value;
  if (typeof value === 'boolean') return 'логическое: ' + value;
  return 'другое';
}

function formatCount(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  let word = 'заявок';
  if (mod10 === 1 && mod100 !== 11) word = 'заявка';
  else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) word = 'заявки';
  return count + ' ' + word;
}`,
    solutionExplanation:
      'Функция склонения понадобится в кабинете и админке: «3 заявки» читается заметно лучше, чем «3 заявка». Возврат null вместо NaN делает проверку результата однозначной.',
    maxScore: 15,
    estimatedMinutes: 20,
    examRefs: [],
    planDays: ['day-05-1'],
    source: 'plan',
  },

  {
    id: 'task-js-status-color',
    title: 'Цвет статуса заявки',
    kind: 'function',
    runtime: 'js',
    difficulty: 1,
    tech: ['js'],
    topicIds: ['js-operators'],
    monthNo: 2,
    weekNo: 5,
    statement: `Задание дня 2 недели 5: функция, которая по статусу заявки возвращает цвет бейджа.

Соответствия (значения статусов взяты из задания демоэкзамена дословно):

| Статус | Цвет |
|---|---|
| Новая | \`secondary\` |
| Мероприятие назначено | \`primary\` |
| Мероприятие завершено | \`success\` |
| что-то другое | \`light\` |

Дополнительно напишите \`isFinal(status)\` — возвращает \`true\` только для статуса «Мероприятие завершено», и \`canLeaveReview(status)\` — отзыв можно оставить, если статус **не** «Новая» (требование модуля 2).`,
    requirements: [
      'statusColor возвращает нужный цвет для каждого из трёх статусов',
      'Неизвестный статус даёт "light"',
      'isFinal истинно только для «Мероприятие завершено»',
      'canLeaveReview ложно для «Новая» и истинно для двух других статусов',
    ],
    starterCode: `function statusColor(status) {
  // ваш код
}

function isFinal(status) {
  // ваш код
}

function canLeaveReview(status) {
  // ваш код
}`,
    tests: [
      { id: 't1', name: 'Новая → secondary', type: 'call', entry: 'statusColor', args: ['Новая'], expected: 'secondary' },
      { id: 't2', name: 'Мероприятие назначено → primary', type: 'call', entry: 'statusColor', args: ['Мероприятие назначено'], expected: 'primary' },
      { id: 't3', name: 'Мероприятие завершено → success', type: 'call', entry: 'statusColor', args: ['Мероприятие завершено'], expected: 'success' },
      { id: 't4', name: 'Неизвестный статус → light', type: 'call', entry: 'statusColor', args: ['Отменена'], expected: 'light' },
      { id: 't5', name: 'Пустая строка → light', type: 'call', entry: 'statusColor', args: [''], expected: 'light', hidden: true },
      { id: 't6', name: 'isFinal для завершённого', type: 'call', entry: 'isFinal', args: ['Мероприятие завершено'], expected: true },
      { id: 't7', name: 'isFinal для назначенного', type: 'call', entry: 'isFinal', args: ['Мероприятие назначено'], expected: false },
      { id: 't8', name: 'Отзыв нельзя у «Новая»', type: 'call', entry: 'canLeaveReview', args: ['Новая'], expected: false, points: 2 },
      { id: 't9', name: 'Отзыв можно у «Мероприятие назначено»', type: 'call', entry: 'canLeaveReview', args: ['Мероприятие назначено'], expected: true, points: 2 },
      { id: 't10', name: 'Отзыв можно у «Мероприятие завершено»', type: 'call', entry: 'canLeaveReview', args: ['Мероприятие завершено'], expected: true },
    ],
    hints: [
      { level: 1, text: 'Вместо длинной цепочки if удобно завести объект-словарь: ключ — статус, значение — цвет.', penaltyPercent: 10 },
      { level: 2, text: 'Для значения по умолчанию используйте ?? — тогда отсутствующий ключ даст "light".', penaltyPercent: 20 },
      {
        level: 3,
        text: 'const COLORS = { "Новая": "secondary", … }; return COLORS[status] ?? "light";',
        penaltyPercent: 35,
      },
    ],
    solution: `const STATUS_NEW = 'Новая';
const STATUS_SCHEDULED = 'Мероприятие назначено';
const STATUS_FINISHED = 'Мероприятие завершено';

const STATUS_COLORS = {
  [STATUS_NEW]: 'secondary',
  [STATUS_SCHEDULED]: 'primary',
  [STATUS_FINISHED]: 'success',
};

function statusColor(status) {
  return STATUS_COLORS[status] ?? 'light';
}

function isFinal(status) {
  return status === STATUS_FINISHED;
}

function canLeaveReview(status) {
  return status === STATUS_SCHEDULED || status === STATUS_FINISHED;
}`,
    solutionExplanation:
      'Статусы вынесены в константы: их текст пишется один раз, и опечатка в формулировке задания становится невозможной. canLeaveReview — это то самое правило модуля 2, которое чаще всего забывают.',
    maxScore: 12,
    estimatedMinutes: 20,
    examRefs: ['m1-admin', 'm2-cabinet-ux'],
    planDays: ['day-05-2'],
    source: 'plan',
  },

  {
    id: 'task-js-loops',
    title: 'Циклы: сумма, максимум, нумерация',
    kind: 'function',
    runtime: 'js',
    difficulty: 1,
    tech: ['js'],
    topicIds: ['js-loops'],
    monthNo: 2,
    weekNo: 5,
    statement: `Три классические задачи на циклы — без методов массива, чтобы понять механику.

1. \`sumTo(n)\` — сумма чисел от 1 до n. Для n меньше 1 возвращает 0.
2. \`findMax(numbers)\` — максимальное число массива. Для пустого массива возвращает \`null\`.
3. \`numberRows(rows)\` — принимает массив строк и возвращает массив вида \`["1. Аудитория", "2. Коворкинг"]\`.`,
    requirements: [
      'Решение использует циклы, а не готовые методы массива',
      'sumTo(0) и sumTo(-5) возвращают 0',
      'findMax работает с отрицательными числами',
      'findMax([]) возвращает null',
      'numberRows нумерует с единицы',
    ],
    starterCode: `function sumTo(n) {
  // ваш код
}

function findMax(numbers) {
  // ваш код
}

function numberRows(rows) {
  // ваш код
}`,
    tests: [
      { id: 't1', name: 'sumTo(5) → 15', type: 'call', entry: 'sumTo', args: [5], expected: 15 },
      { id: 't2', name: 'sumTo(1) → 1', type: 'call', entry: 'sumTo', args: [1], expected: 1 },
      { id: 't3', name: 'sumTo(0) → 0', type: 'call', entry: 'sumTo', args: [0], expected: 0 },
      { id: 't4', name: 'sumTo(-5) → 0', type: 'call', entry: 'sumTo', args: [-5], expected: 0 },
      { id: 't5', name: 'sumTo(100) → 5050', type: 'call', entry: 'sumTo', args: [100], expected: 5050, hidden: true },
      { id: 't6', name: 'findMax([4, 17, 9])', type: 'call', entry: 'findMax', args: [[4, 17, 9]], expected: 17 },
      { id: 't7', name: 'findMax с отрицательными', type: 'call', entry: 'findMax', args: [[-7, -2, -15]], expected: -2, points: 2 },
      { id: 't8', name: 'findMax([]) → null', type: 'call', entry: 'findMax', args: [[]], expected: null },
      { id: 't9', name: 'findMax из одного элемента', type: 'call', entry: 'findMax', args: [[42]], expected: 42 },
      {
        id: 't10',
        name: 'numberRows нумерует список',
        type: 'call',
        entry: 'numberRows',
        args: [['Аудитория', 'Коворкинг', 'Кинозал']],
        expected: ['1. Аудитория', '2. Коворкинг', '3. Кинозал'],
        points: 2,
      },
      { id: 't11', name: 'numberRows([]) → []', type: 'call', entry: 'numberRows', args: [[]], expected: [] },
      {
        id: 't12',
        name: 'Используются циклы, а не reduce/map',
        type: 'assert',
        code: `const source = ctx.solution.get('sumTo').toString() + ctx.solution.get('findMax').toString();
ctx.assert(/for\\s*\\(|while\\s*\\(/.test(source), 'В этом задании нужно потренировать циклы: используйте for или while');`,
      },
    ],
    hints: [
      { level: 1, text: 'Для максимума заведите переменную и сравнивайте с ней каждый элемент. Начальное значение — первый элемент, а не 0.', penaltyPercent: 10 },
      { level: 2, text: 'Пустой массив надо проверить до цикла: numbers.length === 0 → return null.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'let max = numbers[0]; for (const value of numbers) { if (value > max) max = value; } return max;',
        penaltyPercent: 35,
      },
    ],
    solution: `function sumTo(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) sum += i;
  return sum;
}

function findMax(numbers) {
  if (numbers.length === 0) return null;
  let max = numbers[0];
  for (const value of numbers) {
    if (value > max) max = value;
  }
  return max;
}

function numberRows(rows) {
  const result = [];
  for (let i = 0; i < rows.length; i++) {
    result.push((i + 1) + '. ' + rows[i]);
  }
  return result;
}`,
    solutionExplanation:
      'Начальное значение максимума — первый элемент массива, а не 0: иначе массив из отрицательных чисел вернёт неверный результат. Это классическая ошибка, и тест на неё стоит отдельно.',
    maxScore: 14,
    estimatedMinutes: 20,
    examRefs: [],
    planDays: ['day-05-3'],
    source: 'plan',
  },

  {
    id: 'task-js-validate-login',
    title: 'Проверка логина и пароля по требованиям задания',
    kind: 'function',
    runtime: 'js',
    difficulty: 2,
    tech: ['js'],
    topicIds: ['js-functions', 'js-regexp'],
    monthNo: 2,
    weekNo: 5,
    statement: `Реализуйте проверки из задания демоэкзамена дословно.

> «Логин — должен быть уникальным, содержать латинские буквы и цифры длиной минимум шесть символов, пароль — восемь символов и более.»

1. \`checkLogin(login)\` — только латинские буквы и цифры, минимум 6 символов.
2. \`checkPassword(password)\` — минимум 8 символов.
3. \`loginError(login)\` — возвращает текст ошибки или пустую строку, если всё в порядке:
   - пусто → \`"Введите логин"\`;
   - короче 6 символов → \`"Минимум 6 символов"\`;
   - есть посторонние символы → \`"Только латинские буквы и цифры"\`;
   - всё хорошо → \`""\`.

Уникальность логина проверить на клиенте нельзя — это делает сервер.`,
    requirements: [
      'Кириллица, пробелы и знаки препинания не проходят проверку',
      'Логин короче шести символов не проходит',
      'Пароль короче восьми символов не проходит',
      'loginError возвращает конкретный текст под каждую причину',
      'Функции не падают на null и undefined',
    ],
    starterCode: `function checkLogin(login) {
  // ваш код
}

function checkPassword(password) {
  // ваш код
}

function loginError(login) {
  // ваш код
}`,
    tests: [
      { id: 't1', name: 'checkLogin("ivanov26") → true', type: 'call', entry: 'checkLogin', args: ['ivanov26'], expected: true },
      { id: 't2', name: 'checkLogin("IVANOV26") → true', type: 'call', entry: 'checkLogin', args: ['IVANOV26'], expected: true },
      { id: 't3', name: 'Кириллица не проходит', type: 'call', entry: 'checkLogin', args: ['иванов26'], expected: false, points: 2 },
      { id: 't4', name: 'Короткий логин не проходит', type: 'call', entry: 'checkLogin', args: ['ivan'], expected: false },
      { id: 't5', name: 'Пробел не проходит', type: 'call', entry: 'checkLogin', args: ['ivanov 26'], expected: false, points: 2 },
      { id: 't6', name: 'Подчёркивание не проходит', type: 'call', entry: 'checkLogin', args: ['ivanov_26'], expected: false },
      { id: 't7', name: 'checkLogin(null) не падает', type: 'call', entry: 'checkLogin', args: [null], expected: false },
      { id: 't8', name: 'checkPassword("demo2026") → true', type: 'call', entry: 'checkPassword', args: ['demo2026'], expected: true },
      { id: 't9', name: 'Семь символов не проходят', type: 'call', entry: 'checkPassword', args: ['demo202'], expected: false, points: 2 },
      { id: 't10', name: 'checkPassword(undefined) не падает', type: 'call', entry: 'checkPassword', args: [undefined], expected: false },
      { id: 't11', name: 'loginError("") → «Введите логин»', type: 'call', entry: 'loginError', args: [''], expected: 'Введите логин' },
      { id: 't12', name: 'loginError("ivan") → «Минимум 6 символов»', type: 'call', entry: 'loginError', args: ['ivan'], expected: 'Минимум 6 символов' },
      {
        id: 't13',
        name: 'loginError("иванов26") → про латиницу',
        type: 'call',
        entry: 'loginError',
        args: ['иванов26'],
        expected: 'Только латинские буквы и цифры',
        points: 2,
      },
      { id: 't14', name: 'loginError("ivanov26") → пустая строка', type: 'call', entry: 'loginError', args: ['ivanov26'], expected: '' },
    ],
    hints: [
      { level: 1, text: 'Шаблон логина: латинские буквы и цифры, минимум шесть. В регулярке это [A-Za-z0-9]{6,}.', penaltyPercent: 10 },
      { level: 2, text: 'Обязательно поставьте якоря ^ и $, иначе строка «иванов ivanov26» пройдёт проверку.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'const LOGIN = /^[A-Za-z0-9]{6,}$/; В loginError сначала проверьте пустоту, потом длину, потом соответствие шаблону.',
        penaltyPercent: 35,
      },
    ],
    solution: `const LOGIN_PATTERN = /^[A-Za-z0-9]{6,}$/;
const ALLOWED_CHARS = /^[A-Za-z0-9]*$/;

function checkLogin(login) {
  return typeof login === 'string' && LOGIN_PATTERN.test(login);
}

function checkPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

function loginError(login) {
  const value = typeof login === 'string' ? login.trim() : '';
  if (!value) return 'Введите логин';
  if (value.length < 6) return 'Минимум 6 символов';
  if (!ALLOWED_CHARS.test(value)) return 'Только латинские буквы и цифры';
  return '';
}`,
    solutionExplanation:
      'Порядок проверок в loginError важен: сначала пустота, потом длина, потом состав символов. Так пользователь получает самую полезную подсказку, а не общее «неверный логин». Эти же правила нужно повторить на сервере.',
    maxScore: 18,
    estimatedMinutes: 25,
    examRefs: ['m1-register', 'm2-register-hints'],
    planDays: ['day-05-4', 'day-06-4'],
    source: 'plan',
  },

  {
    id: 'task-js-filter-applications',
    title: 'Фильтрация и поиск в списке заявок',
    kind: 'function',
    runtime: 'js',
    difficulty: 2,
    tech: ['js'],
    topicIds: ['js-arrays'],
    monthNo: 2,
    weekNo: 5,
    statement: `Работа со списком заявок — основа админки. Напишите четыре функции.

1. \`byStatus(applications, status)\` — заявки с нужным статусом. Если статус не передан (пустая строка, \`null\`, \`undefined\`), возвращает все.
2. \`findById(applications, id)\` — заявка по идентификатору или \`undefined\`.
3. \`roomTitles(applications)\` — массив названий помещений **без повторов**.
4. \`countByStatus(applications)\` — объект вида \`{ "Новая": 2, "Мероприятие завершено": 1 }\`. Статусы без заявок в объект не попадают.`,
    requirements: [
      'byStatus не изменяет исходный массив',
      'byStatus без статуса возвращает все заявки',
      'findById возвращает undefined, если заявки нет',
      'roomTitles не содержит повторов',
      'countByStatus считает только встречающиеся статусы',
    ],
    starterCode: `function byStatus(applications, status) {
  // ваш код
}

function findById(applications, id) {
  // ваш код
}

function roomTitles(applications) {
  // ваш код
}

function countByStatus(applications) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Фильтр по статусу «Новая»',
        type: 'expr',
        expression: `byStatus([
  { id: 1, room: 'Коворкинг', status: 'Новая' },
  { id: 2, room: 'Кинозал', status: 'Мероприятие завершено' },
  { id: 3, room: 'Аудитория', status: 'Новая' },
], 'Новая').map((a) => a.id)`,
        expected: [1, 3],
        points: 2,
      },
      {
        id: 't2',
        name: 'Без статуса возвращаются все',
        type: 'expr',
        expression: `byStatus([{ id: 1, status: 'Новая' }, { id: 2, status: 'Новая' }], '').length`,
        expected: 2,
      },
      {
        id: 't3',
        name: 'null как статус возвращает все',
        type: 'expr',
        expression: `byStatus([{ id: 1, status: 'Новая' }], null).length`,
        expected: 1,
      },
      {
        id: 't4',
        name: 'Исходный массив не изменён',
        type: 'assert',
        code: `const source = [{ id: 1, status: 'Новая' }, { id: 2, status: 'Мероприятие завершено' }];
const before = source.length;
ctx.solution.get('byStatus')(source, 'Новая');
ctx.assert(source.length === before, 'byStatus не должна менять исходный массив', before, source.length);`,
        points: 2,
      },
      {
        id: 't5',
        name: 'Поиск по id',
        type: 'expr',
        expression: `findById([{ id: 1, room: 'А' }, { id: 7, room: 'Б' }], 7).room`,
        expected: 'Б',
      },
      {
        id: 't6',
        name: 'Поиск несуществующей заявки',
        type: 'expr',
        expression: `findById([{ id: 1 }], 99)`,
        expected: undefined,
        points: 2,
      },
      {
        id: 't7',
        name: 'Названия помещений без повторов',
        type: 'expr',
        expression: `roomTitles([
  { room: 'Коворкинг' }, { room: 'Кинозал' }, { room: 'Коворкинг' },
]).sort()`,
        expected: ['Кинозал', 'Коворкинг'],
        points: 2,
      },
      {
        id: 't8',
        name: 'Подсчёт по статусам',
        type: 'expr',
        expression: `countByStatus([
  { status: 'Новая' }, { status: 'Новая' }, { status: 'Мероприятие завершено' },
])`,
        expected: { 'Новая': 2, 'Мероприятие завершено': 1 },
        points: 3,
      },
      {
        id: 't9',
        name: 'Подсчёт на пустом списке',
        type: 'expr',
        expression: `countByStatus([])`,
        expected: {},
      },
    ],
    hints: [
      { level: 1, text: 'filter возвращает новый массив, find — первый подходящий элемент или undefined.', penaltyPercent: 10 },
      { level: 2, text: 'Убрать повторы проще всего через Set: [...new Set(значения)].', penaltyPercent: 20 },
      {
        level: 3,
        text: 'Для подсчёта используйте reduce: acc[item.status] = (acc[item.status] ?? 0) + 1; return acc; с начальным значением {}.',
        penaltyPercent: 35,
      },
    ],
    solution: `function byStatus(applications, status) {
  if (!status) return [...applications];
  return applications.filter((item) => item.status === status);
}

function findById(applications, id) {
  return applications.find((item) => item.id === id);
}

function roomTitles(applications) {
  return [...new Set(applications.map((item) => item.room))];
}

function countByStatus(applications) {
  return applications.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] ?? 0) + 1;
    return acc;
  }, {});
}`,
    solutionExplanation:
      'Эти четыре функции — готовая основа админки: фильтр по статусу, открытие заявки по id, список помещений для выпадающего списка и счётчики для сводки.',
    maxScore: 15,
    estimatedMinutes: 25,
    examRefs: ['m2-admin-tools'],
    planDays: ['day-05-5'],
    source: 'plan',
  },

  {
    id: 'task-js-objects',
    title: 'Объекты: обновление без мутации',
    kind: 'function',
    runtime: 'js',
    difficulty: 2,
    tech: ['js'],
    topicIds: ['js-objects'],
    monthNo: 2,
    weekNo: 5,
    statement: `В React состояние нельзя менять «на месте» — иначе компонент не перерисуется. Потренируйте правильный подход.

1. \`changeStatus(applications, id, status)\` — возвращает **новый** массив, в котором у заявки с нужным id изменён статус. Исходный массив и его объекты не меняются.
2. \`withoutField(object, field)\` — новый объект без указанного поля.
3. \`toPublicUser(user)\` — убирает поля \`passwordHash\` и \`password\`, остальное оставляет.`,
    requirements: [
      'changeStatus не изменяет исходный массив',
      'changeStatus не изменяет исходные объекты заявок',
      'Заявки с другими id остаются теми же объектами',
      'withoutField не изменяет исходный объект',
      'toPublicUser убирает оба поля с паролем',
    ],
    starterCode: `function changeStatus(applications, id, status) {
  // ваш код
}

function withoutField(object, field) {
  // ваш код
}

function toPublicUser(user) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Статус меняется у нужной заявки',
        type: 'expr',
        expression: `changeStatus([
  { id: 1, status: 'Новая' }, { id: 2, status: 'Новая' },
], 2, 'Мероприятие назначено')[1].status`,
        expected: 'Мероприятие назначено',
        points: 2,
      },
      {
        id: 't2',
        name: 'Исходный массив не изменён',
        type: 'assert',
        code: `const source = [{ id: 1, status: 'Новая' }];
ctx.solution.get('changeStatus')(source, 1, 'Мероприятие завершено');
ctx.assert(source[0].status === 'Новая', 'Исходный объект изменился — так в React делать нельзя', 'Новая', source[0].status);`,
        points: 3,
      },
      {
        id: 't3',
        name: 'Возвращается новый массив',
        type: 'assert',
        code: `const source = [{ id: 1, status: 'Новая' }];
const result = ctx.solution.get('changeStatus')(source, 1, 'Новая');
ctx.assert(result !== source, 'Должен вернуться новый массив, а не исходный');`,
        points: 2,
      },
      {
        id: 't4',
        name: 'Другие заявки остаются теми же объектами',
        type: 'assert',
        code: `const other = { id: 2, status: 'Новая' };
const source = [{ id: 1, status: 'Новая' }, other];
const result = ctx.solution.get('changeStatus')(source, 1, 'Мероприятие завершено');
ctx.assert(result[1] === other, 'Незатронутые элементы копировать не нужно: React сравнивает ссылки');`,
        points: 2,
      },
      {
        id: 't5',
        name: 'withoutField убирает поле',
        type: 'expr',
        expression: `withoutField({ id: 1, room: 'Коворкинг', status: 'Новая' }, 'status')`,
        expected: { id: 1, room: 'Коворкинг' },
        points: 2,
      },
      {
        id: 't6',
        name: 'withoutField не трогает исходный объект',
        type: 'assert',
        code: `const source = { id: 1, status: 'Новая' };
ctx.solution.get('withoutField')(source, 'status');
ctx.assert(source.status === 'Новая', 'Исходный объект изменять нельзя');`,
        points: 2,
      },
      {
        id: 't7',
        name: 'toPublicUser убирает пароли',
        type: 'expr',
        expression: `toPublicUser({ id: 1, login: 'ivanov26', passwordHash: 'x', password: 'y', fullName: 'Иванов' })`,
        expected: { id: 1, login: 'ivanov26', fullName: 'Иванов' },
        points: 3,
      },
    ],
    hints: [
      { level: 1, text: 'map возвращает новый массив. Внутри для нужного элемента создайте новый объект через спред.', penaltyPercent: 10 },
      { level: 2, text: 'Условие внутри map: item.id === id ? { ...item, status } : item — незатронутые элементы возвращаем как есть.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'Убрать поле: const { [field]: removed, ...rest } = object; return rest;',
        penaltyPercent: 35,
      },
    ],
    solution: `function changeStatus(applications, id, status) {
  return applications.map((item) => (item.id === id ? { ...item, status } : item));
}

function withoutField(object, field) {
  const { [field]: removed, ...rest } = object;
  return rest;
}

function toPublicUser(user) {
  const { passwordHash, password, ...rest } = user;
  return rest;
}`,
    solutionExplanation:
      'Незатронутые элементы возвращаются теми же объектами — так React перерисует только изменившуюся строку. toPublicUser закрывает требование безопасности: хеш пароля не должен уходить клиенту.',
    maxScore: 16,
    estimatedMinutes: 25,
    examRefs: ['m1-admin', 'm3-quality'],
    planDays: ['day-05-6'],
    source: 'plan',
  },

  {
    id: 'task-js-destructuring',
    title: 'Деструктуризация и spread на данных заявки',
    kind: 'function',
    runtime: 'js',
    difficulty: 2,
    tech: ['js'],
    topicIds: ['js-destructuring'],
    monthNo: 2,
    weekNo: 7,
    statement: `Приёмы, без которых не пишется React-код.

1. \`describeApplication({ room, date, status })\` — принимает объект и возвращает строку \`"Коворкинг · 14.09.2026 · Новая"\`. Параметр разберите прямо в сигнатуре.
2. \`withDefaults(settings)\` — накладывает настройки пользователя поверх значений по умолчанию \`{ perPage: 5, sort: 'date', ascending: true }\`.
3. \`splitRuDate(value)\` — из строки \`"14.09.2026"\` возвращает объект \`{ day: '14', month: '09', year: '2026' }\`.
4. \`head(list)\` — возвращает объект \`{ first, rest }\`, где \`rest\` — массив остальных элементов.`,
    requirements: [
      'describeApplication разбирает параметр деструктуризацией',
      'withDefaults не изменяет объект значений по умолчанию',
      'Переданные настройки перекрывают значения по умолчанию',
      'splitRuDate возвращает строки, а не числа',
      'head для пустого массива возвращает { first: undefined, rest: [] }',
    ],
    starterCode: `function describeApplication(application) {
  // разберите параметр прямо в сигнатуре
}

function withDefaults(settings) {
  // ваш код
}

function splitRuDate(value) {
  // ваш код
}

function head(list) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Описание заявки',
        type: 'expr',
        expression: `describeApplication({ room: 'Коворкинг', date: '14.09.2026', status: 'Новая' })`,
        expected: 'Коворкинг · 14.09.2026 · Новая',
        points: 2,
      },
      {
        id: 't2',
        name: 'Параметр разобран деструктуризацией',
        type: 'assert',
        code: `const source = ctx.solution.get('describeApplication').toString();
ctx.assert(/\\(\\s*\\{/.test(source), 'Разберите параметр прямо в сигнатуре: function describeApplication({ room, date, status })');`,
        points: 2,
      },
      {
        id: 't3',
        name: 'Значения по умолчанию',
        type: 'expr',
        expression: `withDefaults({})`,
        expected: { perPage: 5, sort: 'date', ascending: true },
        points: 2,
      },
      {
        id: 't4',
        name: 'Пользовательские настройки перекрывают',
        type: 'expr',
        expression: `withDefaults({ perPage: 10, ascending: false })`,
        expected: { perPage: 10, sort: 'date', ascending: false },
        points: 2,
      },
      {
        id: 't5',
        name: 'Разбор даты ДД.ММ.ГГГГ',
        type: 'expr',
        expression: `splitRuDate('14.09.2026')`,
        expected: { day: '14', month: '09', year: '2026' },
        points: 2,
      },
      {
        id: 't6',
        name: 'Ведущий ноль сохраняется',
        type: 'expr',
        expression: `splitRuDate('01.02.2027').month`,
        expected: '02',
        hidden: true,
      },
      {
        id: 't7',
        name: 'head разделяет список',
        type: 'expr',
        expression: `head([1, 2, 3])`,
        expected: { first: 1, rest: [2, 3] },
        points: 2,
      },
      {
        id: 't8',
        name: 'head на пустом массиве',
        // Проверяем через assert: значение undefined не переживает передачу
        // задания в песочницу, и сравнение с ним было бы недостоверным.
        type: 'assert',
        code: `const head = ctx.get('head');
const result = head([]);
ctx.assert(result && typeof result === 'object', 'Нужно вернуть объект, получено: ' + ctx.preview(result));
ctx.assert(result.first === undefined, 'Для пустого списка first должен быть undefined, получено: ' + ctx.preview(result.first));
ctx.assert(Array.isArray(result.rest) && result.rest.length === 0, 'Остаток должен быть пустым массивом, получено: ' + ctx.preview(result.rest));`,
      },
    ],
    hints: [
      { level: 1, text: 'Объект разбирается прямо в параметре: function f({ room, date }) { … }', penaltyPercent: 10 },
      { level: 2, text: 'Наложить настройки поверх умолчаний: { ...DEFAULTS, ...settings } — правый объект перебивает левый.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'Массив тоже разбирается: const [first, ...rest] = list; а строку даты режет split(".").',
        penaltyPercent: 35,
      },
    ],
    solution: `const DEFAULTS = { perPage: 5, sort: 'date', ascending: true };

function describeApplication({ room, date, status }) {
  return \`\${room} · \${date} · \${status}\`;
}

function withDefaults(settings) {
  return { ...DEFAULTS, ...settings };
}

function splitRuDate(value) {
  const [day, month, year] = String(value).split('.');
  return { day, month, year };
}

function head(list) {
  const [first, ...rest] = list;
  return { first, rest };
}`,
    solutionExplanation:
      'Порядок в спреде решает всё: значения по умолчанию слева, пользовательские справа. Если поменять местами, настройки пользователя будут затираться.',
    maxScore: 14,
    estimatedMinutes: 22,
    examRefs: ['m2-order-form'],
    planDays: ['day-07-1'],
    source: 'plan',
  },

  {
    id: 'task-js-admin-table',
    title: 'Админка: фильтр, сортировка и постраничная навигация',
    kind: 'app',
    runtime: 'js',
    difficulty: 3,
    tech: ['js'],
    topicIds: ['js-array-methods'],
    monthNo: 2,
    weekNo: 7,
    statement: `Ключевое задание недели 7: собрать логику панели администратора целиком.

Напишите функцию \`getPage(applications, options)\`. В \`options\` могут прийти:

- \`status\` — фильтр по статусу (пустой или отсутствующий = все);
- \`ascending\` — направление сортировки по дате (по умолчанию \`true\`);
- \`page\` — номер страницы с единицы (по умолчанию 1);
- \`perPage\` — размер страницы (по умолчанию 5).

Функция возвращает объект \`{ items, page, totalPages, total }\`, где \`total\` — количество заявок после фильтра.

**Важная деталь:** если после фильтра страниц стало меньше, чем запрошенный номер, вернуть последнюю доступную страницу. Пустой список даёт \`totalPages: 1\` и \`page: 1\`.

Даты приходят в формате \`ГГГГ-ММ-ДД\`.`,
    requirements: [
      'Фильтр по статусу, сортировка по дате, срез страницы',
      'Исходный массив не изменяется',
      'При выходе за пределы возвращается последняя страница',
      'На пустом списке totalPages равен 1',
      'total считается после фильтра',
    ],
    starterCode: `function getPage(applications, options = {}) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Первая страница из пяти элементов',
        type: 'expr',
        expression: `getPage(
  Array.from({ length: 12 }, (_, i) => ({ id: i + 1, date: '2026-09-' + String(i + 1).padStart(2, '0'), status: 'Новая' })),
  {},
).items.map((a) => a.id)`,
        expected: [1, 2, 3, 4, 5],
        points: 2,
      },
      {
        id: 't2',
        name: 'Всего страниц посчитано верно',
        type: 'expr',
        expression: `getPage(Array.from({ length: 12 }, (_, i) => ({ id: i + 1, date: '2026-09-01', status: 'Новая' })), {}).totalPages`,
        expected: 3,
        points: 2,
      },
      {
        id: 't3',
        name: 'Вторая страница',
        type: 'expr',
        expression: `getPage(
  Array.from({ length: 12 }, (_, i) => ({ id: i + 1, date: '2026-09-' + String(i + 1).padStart(2, '0'), status: 'Новая' })),
  { page: 2 },
).items.map((a) => a.id)`,
        expected: [6, 7, 8, 9, 10],
        points: 2,
      },
      {
        id: 't4',
        name: 'Фильтр по статусу',
        type: 'expr',
        expression: `getPage([
  { id: 1, date: '2026-09-01', status: 'Новая' },
  { id: 2, date: '2026-09-02', status: 'Мероприятие завершено' },
  { id: 3, date: '2026-09-03', status: 'Новая' },
], { status: 'Новая' }).total`,
        expected: 2,
        points: 2,
      },
      {
        id: 't5',
        name: 'Сортировка по убыванию',
        type: 'expr',
        expression: `getPage([
  { id: 1, date: '2026-09-01', status: 'Новая' },
  { id: 2, date: '2026-09-20', status: 'Новая' },
], { ascending: false }).items.map((a) => a.id)`,
        expected: [2, 1],
        points: 2,
      },
      {
        id: 't6',
        name: 'Страница за пределами списка возвращает последнюю',
        type: 'expr',
        expression: `getPage([
  { id: 1, date: '2026-09-01', status: 'Новая' },
  { id: 2, date: '2026-09-02', status: 'Новая' },
], { page: 7 }).page`,
        expected: 1,
        points: 3,
      },
      {
        id: 't7',
        name: 'Пустой список',
        type: 'expr',
        expression: `JSON.stringify(getPage([], {}))`,
        expected: '{"items":[],"page":1,"totalPages":1,"total":0}',
        compare: 'string',
        points: 2,
      },
      {
        id: 't8',
        name: 'Исходный массив не изменён',
        type: 'assert',
        code: `const source = [
  { id: 1, date: '2026-09-20', status: 'Новая' },
  { id: 2, date: '2026-09-01', status: 'Новая' },
];
ctx.solution.get('getPage')(source, {});
ctx.assert(source[0].id === 1, 'sort изменил исходный массив — копируйте его перед сортировкой');`,
        points: 3,
      },
      {
        id: 't9',
        name: 'Свой размер страницы',
        type: 'expr',
        expression: `getPage(Array.from({ length: 7 }, (_, i) => ({ id: i + 1, date: '2026-09-01', status: 'Новая' })), { perPage: 3 }).totalPages`,
        expected: 3,
        hidden: true,
      },
    ],
    hints: [
      { level: 1, text: 'Порядок действий: filter → сортировка копии → slice. Номер страницы считается от единицы.', penaltyPercent: 10 },
      { level: 2, text: 'Число страниц: Math.max(1, Math.ceil(total / perPage)). Безопасный номер: Math.min(page, totalPages).', penaltyPercent: 20 },
      {
        level: 3,
        text: 'const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date) * (ascending ? 1 : -1)); затем sorted.slice((safePage - 1) * perPage, safePage * perPage).',
        penaltyPercent: 35,
      },
    ],
    solution: `function getPage(applications, options = {}) {
  const { status = '', ascending = true, page = 1, perPage = 5 } = options;

  const filtered = status ? applications.filter((item) => item.status === status) : applications;
  const direction = ascending ? 1 : -1;
  const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date) * direction);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);

  return {
    items: sorted.slice((safePage - 1) * perPage, safePage * perPage),
    page: safePage,
    totalPages,
    total,
  };
}`,
    solutionExplanation:
      'Возврат на последнюю доступную страницу решает реальную проблему интерфейса: пользователь на третьей странице выбирает фильтр и не остаётся с пустым экраном. На экзамене это требование модуля 2 про постраничную навигацию.',
    maxScore: 19,
    estimatedMinutes: 35,
    examRefs: ['m2-admin-tools'],
    planDays: ['day-07-2'],
    source: 'plan',
  },

  {
    id: 'task-js-dates',
    title: 'Даты: перевод между ДД.ММ.ГГГГ и форматом базы',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['js'],
    topicIds: ['js-dates'],
    monthNo: 2,
    weekNo: 7,
    statement: `Задание модуля 2 требует показывать дату в формате **ДД.ММ.ГГГГ**, а база хранит **ГГГГ-ММ-ДД**. Напишите надёжный перевод в обе стороны.

1. \`toRuDate(iso)\` — из \`"2026-09-14"\` в \`"14.09.2026"\`.
2. \`fromRuDate(value)\` — из \`"14.09.2026"\` в \`"2026-09-14"\`. Если формат неверный **или такой даты не существует** — вернуть \`null\`.
3. \`compareDates(a, b)\` — сравнивает две даты в формате ДД.ММ.ГГГГ: отрицательное число если первая раньше, положительное если позже, ноль если равны.`,
    requirements: [
      'Ведущие нули сохраняются',
      'Неверный формат даёт null',
      'Несуществующая дата (31.02.2026) даёт null',
      'compareDates правильно сравнивает даты из разных месяцев',
      'Функции не падают на null и пустой строке',
    ],
    starterCode: `function toRuDate(iso) {
  // ваш код
}

function fromRuDate(value) {
  // ваш код
}

function compareDates(a, b) {
  // ваш код
}`,
    tests: [
      { id: 't1', name: 'toRuDate("2026-09-14")', type: 'call', entry: 'toRuDate', args: ['2026-09-14'], expected: '14.09.2026', points: 2 },
      { id: 't2', name: 'Ведущие нули сохраняются', type: 'call', entry: 'toRuDate', args: ['2027-01-02'], expected: '02.01.2027', points: 2 },
      { id: 't3', name: 'fromRuDate("14.09.2026")', type: 'call', entry: 'fromRuDate', args: ['14.09.2026'], expected: '2026-09-14', points: 2 },
      { id: 't4', name: 'Неверный разделитель → null', type: 'call', entry: 'fromRuDate', args: ['14/09/2026'], expected: null, points: 2 },
      { id: 't5', name: 'Однозначный день → null', type: 'call', entry: 'fromRuDate', args: ['4.09.2026'], expected: null },
      { id: 't6', name: 'Несуществующая дата 31.02.2026 → null', type: 'call', entry: 'fromRuDate', args: ['31.02.2026'], expected: null, points: 3 },
      { id: 't7', name: 'Несуществующий месяц 14.13.2026 → null', type: 'call', entry: 'fromRuDate', args: ['14.13.2026'], expected: null, points: 2 },
      { id: 't8', name: '29.02.2028 существует (високосный)', type: 'call', entry: 'fromRuDate', args: ['29.02.2028'], expected: '2028-02-29', points: 2, hidden: true },
      { id: 't9', name: 'Пустая строка → null', type: 'call', entry: 'fromRuDate', args: [''], expected: null },
      { id: 't10', name: 'null → null', type: 'call', entry: 'fromRuDate', args: [null], expected: null },
      { id: 't11', name: 'Сравнение: раньше', type: 'assert', code: `const compare = ctx.solution.get('compareDates');
ctx.assert(compare('14.09.2026', '21.09.2026') < 0, 'Первая дата раньше — результат должен быть отрицательным');`, points: 2 },
      { id: 't12', name: 'Сравнение через границу месяца', type: 'assert', code: `const compare = ctx.solution.get('compareDates');
ctx.assert(compare('21.08.2026', '14.09.2026') < 0, 'Август раньше сентября: сравнение как строк здесь не работает');`, points: 3 },
      { id: 't13', name: 'Равные даты дают 0', type: 'call', entry: 'compareDates', args: ['14.09.2026', '14.09.2026'], expected: 0 },
    ],
    hints: [
      { level: 1, text: 'Разбирайте строку регулярным выражением /^(\\d{2})\\.(\\d{2})\\.(\\d{4})$/ — оно отсечёт неверный формат.', penaltyPercent: 10 },
      { level: 2, text: 'Существование даты проверяется через new Date(year, month - 1, day): если getDate() не совпал с днём, даты нет.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'Для сравнения переведите обе даты в формат ГГГГ-ММ-ДД функцией fromRuDate и сравните строки через localeCompare.',
        penaltyPercent: 35,
      },
    ],
    solution: `const RU_DATE = /^(\\d{2})\\.(\\d{2})\\.(\\d{4})$/;

function toRuDate(iso) {
  if (typeof iso !== 'string') return '';
  const [year, month, day] = iso.split('-');
  if (!year || !month || !day) return '';
  return \`\${day}.\${month}.\${year}\`;
}

function fromRuDate(value) {
  if (typeof value !== 'string') return null;
  const match = RU_DATE.exec(value.trim());
  if (!match) return null;

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  // Если браузер "исправил" дату (31.02 превратится в 03.03), значит её не существует.
  if (date.getDate() !== Number(day) || date.getMonth() !== Number(month) - 1) return null;

  return \`\${year}-\${month}-\${day}\`;
}

function compareDates(a, b) {
  const first = fromRuDate(a);
  const second = fromRuDate(b);
  if (!first || !second) return 0;
  return first < second ? -1 : first > second ? 1 : 0;
}`,
    solutionExplanation:
      'Регулярка проверяет формат, объект Date — существование даты. Сравнение делается через формат ГГГГ-ММ-ДД: только в нём строковое сравнение совпадает с хронологическим.',
    maxScore: 24,
    estimatedMinutes: 30,
    examRefs: ['m1-order', 'm2-order-form'],
    planDays: ['day-07-6'],
    source: 'plan',
  },

  {
    id: 'task-js-async',
    title: 'Асинхронность: загрузка с обработкой ошибок',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['js'],
    topicIds: ['js-async'],
    monthNo: 2,
    weekNo: 7,
    statement: `Асинхронный код с правильной обработкой ошибок — требование качества кода на экзамене.

1. \`delay(ms)\` — возвращает обещание, которое выполнится через указанное время.
2. \`loadWithRetry(loader, attempts)\` — вызывает функцию \`loader\` и, если она завершилась ошибкой, повторяет попытку. Всего не более \`attempts\` попыток (по умолчанию 3). Если все попытки неудачны — пробрасывает последнюю ошибку.
3. \`loadAll(loaders)\` — принимает массив функций, запускает их **параллельно** и возвращает массив результатов.
4. \`safeLoad(loader, fallback)\` — возвращает результат загрузки, а при ошибке — значение \`fallback\` (ошибка наружу не выходит).`,
    requirements: [
      'delay действительно ждёт указанное время',
      'loadWithRetry повторяет попытку после ошибки',
      'loadWithRetry пробрасывает ошибку, если все попытки провалились',
      'loadAll запускает загрузчики параллельно, а не по очереди',
      'safeLoad не выбрасывает ошибку наружу',
    ],
    starterCode: `function delay(ms) {
  // ваш код
}

async function loadWithRetry(loader, attempts = 3) {
  // ваш код
}

async function loadAll(loaders) {
  // ваш код
}

async function safeLoad(loader, fallback) {
  // ваш код
}`,
    timeLimitMs: 8000,
    tests: [
      {
        id: 't1',
        name: 'delay возвращает обещание и ждёт',
        type: 'assert',
        code: `const delay = ctx.solution.get('delay');
const started = Date.now();
const result = delay(60);
ctx.assert(result && typeof result.then === 'function', 'delay должна возвращать Promise');
return result.then(() => {
  const elapsed = Date.now() - started;
  ctx.assert(elapsed >= 50, 'Ожидание оказалось слишком коротким: ' + elapsed + ' мс');
});`,
        points: 2,
      },
      {
        id: 't2',
        name: 'loadWithRetry возвращает успешный результат',
        type: 'assert',
        code: `const load = ctx.solution.get('loadWithRetry');
return load(async () => 'ок').then((value) => {
  ctx.assert(value === 'ок', 'Ожидалось «ок», получено ' + ctx.preview(value));
});`,
        points: 2,
      },
      {
        id: 't3',
        name: 'Повторяет попытку после ошибки',
        type: 'assert',
        code: `const load = ctx.solution.get('loadWithRetry');
let calls = 0;
const loader = async () => {
  calls++;
  if (calls < 3) throw new Error('сбой');
  return 'получилось';
};
return load(loader, 3).then((value) => {
  ctx.assert(value === 'получилось', 'Должен вернуться результат третьей попытки');
  ctx.assert(calls === 3, 'Ожидалось три вызова загрузчика, было ' + calls);
});`,
        points: 4,
      },
      {
        id: 't4',
        name: 'Пробрасывает ошибку, если попытки кончились',
        type: 'assert',
        code: `const load = ctx.solution.get('loadWithRetry');
let calls = 0;
const loader = async () => { calls++; throw new Error('сервер недоступен'); };
return load(loader, 2).then(
  () => { throw new Error('Ожидалась ошибка, но её не было'); },
  (error) => {
    ctx.assert(error.message === 'сервер недоступен', 'Должна пробрасываться исходная ошибка');
    ctx.assert(calls === 2, 'Ожидалось ровно две попытки, было ' + calls);
  },
);`,
        points: 4,
      },
      {
        id: 't5',
        name: 'loadAll собирает результаты',
        type: 'assert',
        code: `const loadAll = ctx.solution.get('loadAll');
return loadAll([async () => 'a', async () => 'b']).then((value) => {
  ctx.assert(JSON.stringify(value) === '["a","b"]', 'Ожидалось ["a","b"], получено ' + ctx.preview(value));
});`,
        points: 2,
      },
      {
        id: 't6',
        name: 'loadAll работает параллельно',
        type: 'assert',
        code: `const loadAll = ctx.solution.get('loadAll');
const wait = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
const started = Date.now();
return loadAll([() => wait(120, 1), () => wait(120, 2)]).then(() => {
  const elapsed = Date.now() - started;
  ctx.assert(elapsed < 220, 'Похоже, загрузчики выполняются по очереди (' + elapsed + ' мс). Используйте Promise.all');
});`,
        points: 4,
      },
      {
        id: 't7',
        name: 'safeLoad возвращает запасное значение',
        type: 'assert',
        code: `const safeLoad = ctx.solution.get('safeLoad');
return safeLoad(async () => { throw new Error('сбой'); }, []).then((value) => {
  ctx.assert(Array.isArray(value) && value.length === 0, 'Ожидался пустой массив как запасное значение');
});`,
        points: 3,
      },
      {
        id: 't8',
        name: 'safeLoad возвращает данные, если ошибки нет',
        type: 'assert',
        code: `const safeLoad = ctx.solution.get('safeLoad');
return safeLoad(async () => [1, 2], []).then((value) => {
  ctx.assert(JSON.stringify(value) === '[1,2]', 'При успешной загрузке должны вернуться данные');
});`,
        points: 2,
      },
    ],
    hints: [
      { level: 1, text: 'delay строится так: new Promise((resolve) => setTimeout(resolve, ms)).', penaltyPercent: 10 },
      { level: 2, text: 'В loadWithRetry нужен цикл с try/catch: при ошибке запоминаем её и идём на следующий круг.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'Параллельный запуск: await Promise.all(loaders.map((loader) => loader())). Обратите внимание — загрузчики нужно вызвать.',
        penaltyPercent: 35,
      },
    ],
    solution: `function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadWithRetry(loader, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await loader();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function loadAll(loaders) {
  return Promise.all(loaders.map((loader) => loader()));
}

async function safeLoad(loader, fallback) {
  try {
    return await loader();
  } catch {
    return fallback;
  }
}`,
    solutionExplanation:
      'Повтор запроса и запасное значение — то, что превращает «упало с ошибкой» в понятное поведение интерфейса. Promise.all запускает независимые запросы одновременно: справочники помещений и способов оплаты грузятся вдвое быстрее.',
    maxScore: 23,
    estimatedMinutes: 35,
    examRefs: ['m3-quality'],
    planDays: ['day-07-4'],
    source: 'plan',
  },

  {
    id: 'task-js-api-client',
    title: 'Класс ApiClient: запросы и коды ответа',
    kind: 'api',
    runtime: 'js',
    difficulty: 3,
    tech: ['js', 'security'],
    topicIds: ['js-fetch', 'ts-oop'],
    monthNo: 2,
    weekNo: 7,
    statement: `Задание модуля 1 требует объектно-ориентированного программирования. Напишите класс \`ApiClient\`, через который пойдут все запросы приложения.

Требования к классу:

- конструктор принимает базовый адрес (по умолчанию \`'/api'\`) и функцию получения токена;
- метод \`get(path)\` делает GET-запрос;
- метод \`post(path, body)\` делает POST с заголовком \`Content-Type: application/json\` и телом в JSON;
- если токен есть, добавляется заголовок \`Authorization: Bearer <токен>\`;
- при ответе с кодом 401 выбрасывается ошибка с текстом \`"Требуется вход"\`;
- при любом другом неуспешном коде выбрасывается ошибка с текстом из поля \`error\` ответа, либо \`"Ошибка запроса"\`.

В песочнице сетевые запросы запрещены, поэтому \`fetch\` передаётся в конструктор третьим аргументом — тесты подставят свою реализацию.`,
    requirements: [
      'Класс ApiClient с методами get и post',
      'POST отправляет JSON и правильный заголовок',
      'Токен подставляется в заголовок Authorization',
      'Код 401 даёт ошибку «Требуется вход»',
      'Текст ошибки берётся из поля error ответа',
    ],
    starterCode: `class ApiClient {
  constructor(baseUrl = '/api', getToken = () => null, fetchFn = fetch) {
    // сохраните зависимости
  }

  async get(path) {
    // ваш код
  }

  async post(path, body) {
    // ваш код
  }
}`,
    tests: [
      {
        id: 't1',
        name: 'GET обращается по правильному адресу',
        type: 'assert',
        code: `const ApiClient = ctx.solution.get('ApiClient');
let calledUrl = null;
const fakeFetch = async (url) => { calledUrl = url; return { ok: true, status: 200, json: async () => [{ id: 1 }] }; };
const api = new ApiClient('/api', () => null, fakeFetch);
return api.get('/rooms').then((data) => {
  ctx.assert(calledUrl === '/api/rooms', 'Ожидался адрес /api/rooms, запрошен ' + ctx.preview(calledUrl));
  ctx.assert(Array.isArray(data) && data[0].id === 1, 'Должны вернуться разобранные данные');
});`,
        points: 3,
      },
      {
        id: 't2',
        name: 'POST отправляет JSON и заголовок',
        type: 'assert',
        code: `const ApiClient = ctx.solution.get('ApiClient');
let options = null;
const fakeFetch = async (url, init) => { options = init; return { ok: true, status: 201, json: async () => ({ id: 7 }) }; };
const api = new ApiClient('/api', () => null, fakeFetch);
return api.post('/applications', { roomId: 2 }).then(() => {
  ctx.assert(options.method === 'POST', 'Метод должен быть POST');
  ctx.assert(options.body === JSON.stringify({ roomId: 2 }), 'Тело должно быть строкой JSON');
  const headers = options.headers || {};
  const contentType = headers['Content-Type'] || headers['content-type'];
  ctx.assert(contentType === 'application/json', 'Нужен заголовок Content-Type: application/json');
});`,
        points: 4,
      },
      {
        id: 't3',
        name: 'Токен попадает в заголовок Authorization',
        type: 'assert',
        code: `const ApiClient = ctx.solution.get('ApiClient');
let options = null;
const fakeFetch = async (url, init) => { options = init; return { ok: true, status: 200, json: async () => ({}) }; };
const api = new ApiClient('/api', () => 'token-123', fakeFetch);
return api.get('/applications/my').then(() => {
  const headers = options.headers || {};
  const auth = headers.Authorization || headers.authorization;
  ctx.assert(auth === 'Bearer token-123', 'Ожидался заголовок «Bearer token-123», получено ' + ctx.preview(auth));
});`,
        points: 4,
      },
      {
        id: 't4',
        name: 'Без токена заголовка нет',
        type: 'assert',
        code: `const ApiClient = ctx.solution.get('ApiClient');
let options = null;
const fakeFetch = async (url, init) => { options = init; return { ok: true, status: 200, json: async () => ({}) }; };
const api = new ApiClient('/api', () => null, fakeFetch);
return api.get('/rooms').then(() => {
  const headers = options.headers || {};
  ctx.assert(!headers.Authorization && !headers.authorization, 'Без токена заголовок Authorization добавлять не нужно');
});`,
        points: 2,
      },
      {
        id: 't5',
        name: 'Код 401 даёт «Требуется вход»',
        type: 'assert',
        code: `const ApiClient = ctx.solution.get('ApiClient');
const fakeFetch = async () => ({ ok: false, status: 401, json: async () => ({}) });
const api = new ApiClient('/api', () => null, fakeFetch);
return api.get('/applications/my').then(
  () => { throw new Error('Ожидалась ошибка при коде 401'); },
  (error) => ctx.assert(error.message === 'Требуется вход', 'Текст ошибки должен быть «Требуется вход», получено ' + ctx.preview(error.message)),
);`,
        points: 4,
      },
      {
        id: 't6',
        name: 'Текст ошибки берётся из ответа',
        type: 'assert',
        code: `const ApiClient = ctx.solution.get('ApiClient');
const fakeFetch = async () => ({ ok: false, status: 409, json: async () => ({ error: 'Такой логин уже занят' }) });
const api = new ApiClient('/api', () => null, fakeFetch);
return api.post('/register', {}).then(
  () => { throw new Error('Ожидалась ошибка при коде 409'); },
  (error) => ctx.assert(error.message === 'Такой логин уже занят', 'Нужно взять текст из поля error ответа'),
);`,
        points: 4,
      },
      {
        id: 't7',
        name: 'Ответ без поля error даёт общий текст',
        type: 'assert',
        code: `const ApiClient = ctx.solution.get('ApiClient');
const fakeFetch = async () => ({ ok: false, status: 500, json: async () => { throw new Error('не json'); } });
const api = new ApiClient('/api', () => null, fakeFetch);
return api.get('/rooms').then(
  () => { throw new Error('Ожидалась ошибка при коде 500'); },
  (error) => ctx.assert(error.message === 'Ошибка запроса', 'Если разобрать ответ не удалось, текст должен быть «Ошибка запроса»'),
);`,
        points: 3,
      },
    ],
    hints: [
      { level: 1, text: 'Сохраните baseUrl, getToken и fetchFn в полях класса через this в конструкторе.', penaltyPercent: 10 },
      { level: 2, text: 'Вынесите общую логику в приватный метод request(path, options) — get и post будут его вызывать.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'Разбор ошибки: const data = await response.json().catch(() => ({})); затем throw new Error(data.error ?? "Ошибка запроса").',
        penaltyPercent: 35,
      },
    ],
    solution: `class ApiClient {
  constructor(baseUrl = '/api', getToken = () => null, fetchFn = fetch) {
    this.baseUrl = baseUrl;
    this.getToken = getToken;
    this.fetchFn = fetchFn;
  }

  headers(extra = {}) {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
      ...extra,
    };
  }

  async request(path, options = {}) {
    const response = await this.fetchFn(this.baseUrl + path, {
      ...options,
      headers: this.headers(options.headers),
    });

    if (response.status === 401) throw new Error('Требуется вход');

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error ?? 'Ошибка запроса');
    }

    return response.json();
  }

  get(path) {
    return this.request(path);
  }

  post(path, body) {
    return this.request(path, { method: 'POST', body: JSON.stringify(body) });
  }
}`,
    solutionExplanation:
      'Один класс закрывает сразу три требования экзамена: ООП, «все запросы в одном месте» и информативные сообщения об ошибках. Передача fetch через конструктор — это ещё и способ сделать класс тестируемым, что само по себе признак хорошего кода.',
    maxScore: 24,
    estimatedMinutes: 40,
    examRefs: ['m1-oop-styles', 'm1-login', 'm3-quality'],
    planDays: ['day-07-5'],
    source: 'plan',
  },
];
