import type { Task } from '../types';

/**
 * Седьмые дни недель 25-30 — выходные по программе.
 *
 * Отдых стоит в плане намеренно: после четырёхчасовых прогонов без него
 * следующая неделя пройдёт хуже. Поэтому здесь не сборки, а разминки
 * на десять минут — короткие, без напряжения и без нового материала.
 * Если чувствуете, что нужен полный отдых, задание можно отложить:
 * восстановление важнее одного повторения.
 */
export const WEEK_ASSEMBLY_M7: Task[] = [
  {
    id: 'task-week-25-assembly',
    title: 'Разминка выходного: три функции, которые пишутся не думая',
    kind: 'function',
    runtime: 'js',
    difficulty: 1,
    tech: ['js'],
    topicIds: ['memory-training'],
    monthNo: 7,
    weekNo: 25,
    statement: `Выходной по программе. Десять минут, три однострочника — просто чтобы рука не отвыкала.

1. \`toRuDate('2027-03-12')\` → \`'12.03.2027'\`.
2. \`digitsOnly('+7 (900) 123-45-67')\` → \`'79001234567'\`.
3. \`byId(items, id)\` — элемент с таким \`id\` или \`undefined\`; \`id\` может прийти строкой.`,
    requirements: [
      'Дата переворачивается',
      'Остаются только цифры',
      'Элемент находится и по числовому, и по строковому номеру',
    ],
    starterCode: `function toRuDate(iso) {
  // '2027-03-12' -> '12.03.2027'
}

function digitsOnly(value) {
  // только цифры
}

function byId(items, id) {
  // элемент по номеру
}`,
    tests: [
      { id: 'date', name: 'toRuDate', type: 'call', entry: 'toRuDate', args: ['2027-03-12'], expected: '12.03.2027', points: 3 },
      {
        id: 'digits',
        name: 'digitsOnly',
        type: 'call',
        entry: 'digitsOnly',
        args: ['+7 (900) 123-45-67'],
        expected: '79001234567',
        points: 3,
      },
      {
        id: 'by-id',
        name: 'byId работает с числом и строкой',
        type: 'assert',
        code: `const byId = ctx.get('byId');
const items = [{ id: 1, title: 'А' }, { id: 2, title: 'Б' }];
ctx.assert(byId(items, 2) && byId(items, 2).title === 'Б', 'Не найден элемент по числу');
ctx.assert(byId(items, '2') && byId(items, '2').title === 'Б', 'Номер из адреса приходит строкой — приведите к числу');
ctx.assert(byId(items, 99) === undefined, 'Для отсутствующего номера нужен undefined');`,
        points: 4,
      },
    ],
    hints: [
      { level: 1, text: 'Все три — по одной строке. Если не вспомнилось за минуту, посмотрите в свои записи: сегодня это не считается.', penaltyPercent: 10 },
      { level: 2, text: 'Приведение номера: Number(id). Строка "2" и число 2 строгим равенством не сравниваются.', penaltyPercent: 20 },
      { level: 3, text: 'return items.find((item) => item.id === Number(id));', penaltyPercent: 35 },
    ],
    solution: `function toRuDate(iso) {
  return iso.split('-').reverse().join('.');
}

function digitsOnly(value) {
  return String(value).replace(/\\D/g, '');
}

function byId(items, id) {
  return items.find((item) => item.id === Number(id));
}`,
    solutionExplanation:
      'Три строки, которые встретятся в каждом втором файле на экзамене. Приведение номера к числу в byId — та самая мелочь, из-за которой «ничего не находится» при совершенно правильном коде: из адреса номер всегда приходит строкой.',
    maxScore: 10,
    estimatedMinutes: 10,
    examRefs: ['m2-order-form', 'm1-cabinet'],
    planDays: ['day-25-7'],
    source: 'plan',
  },

  {
    id: 'task-week-26-assembly',
    title: 'Разминка выходного: коды ответов сервера',
    kind: 'function',
    runtime: 'js',
    difficulty: 1,
    tech: ['js'],
    topicIds: ['memory-training'],
    monthNo: 7,
    weekNo: 26,
    statement: `Выходной. Десять минут на то, что спрашивают на защите: какой код в какой ситуации.

1. \`CODES\` — объект соответствий: \`created\` → 201, \`badRequest\` → 400, \`unauthorized\` → 401, \`forbidden\` → 403, \`notFound\` → 404, \`conflict\` → 409, \`serverError\` → 500.
2. \`codeFor(situation)\` — код по названию ситуации или \`null\`.
3. \`describe(code)\` — короткое пояснение: 401 → \`'Не знаю, кто вы'\`, 403 → \`'Знаю, кто вы, но сюда нельзя'\`, 404 → \`'Такого объекта нет'\`, 409 → \`'Уже существует'\`; для остальных — \`'Другое'\`.`,
    requirements: [
      'Все семь кодов записаны верно',
      'codeFor находит код по ситуации',
      'Неизвестная ситуация даёт null',
      'describe различает 401, 403, 404 и 409',
    ],
    starterCode: `const CODES = {};

function codeFor(situation) {
  // код по названию
}

function describe(code) {
  // короткое пояснение
}`,
    tests: [
      {
        id: 'codes',
        name: 'Семь кодов',
        type: 'assert',
        code: `const CODES = ctx.get('CODES');
const expected = { created: 201, badRequest: 400, unauthorized: 401, forbidden: 403, notFound: 404, conflict: 409, serverError: 500 };
Object.keys(expected).forEach((key) => {
  ctx.assert(CODES[key] === expected[key], 'Для «' + key + '» ожидался ' + expected[key] + ', указано: ' + CODES[key]);
});`,
        points: 4,
      },
      {
        id: 'code-for',
        name: 'Код по ситуации',
        type: 'assert',
        code: `const codeFor = ctx.get('codeFor');
ctx.assert(codeFor('forbidden') === 403, 'Получено: ' + ctx.preview(codeFor('forbidden')));
ctx.assert(codeFor('teapot') === null, 'Для неизвестной ситуации нужен null');`,
        points: 3,
      },
      {
        id: 'describe',
        name: 'Пояснения к кодам',
        type: 'assert',
        code: `const describe = ctx.get('describe');
ctx.assert(describe(401) === 'Не знаю, кто вы', 'Для 401: ' + describe(401));
ctx.assert(describe(403) === 'Знаю, кто вы, но сюда нельзя', 'Для 403: ' + describe(403));
ctx.assert(describe(404) === 'Такого объекта нет', 'Для 404: ' + describe(404));
ctx.assert(describe(409) === 'Уже существует', 'Для 409: ' + describe(409));
ctx.assert(describe(200) === 'Другое', 'Для остальных: ' + describe(200));`,
        points: 5,
      },
    ],
    hints: [
      { level: 1, text: 'Разница между 401 и 403 — самая частая путаница: первое про «кто вы», второе про «что вам можно».', penaltyPercent: 10 },
      { level: 2, text: 'codeFor — обращение к объекту с запасным вариантом: CODES[situation] ?? null.', penaltyPercent: 20 },
      { level: 3, text: 'const TEXTS = { 401: "Не знаю, кто вы", 403: "Знаю, кто вы, но сюда нельзя", … }; return TEXTS[code] || "Другое";', penaltyPercent: 35 },
    ],
    solution: `const CODES = {
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  serverError: 500,
};

const TEXTS = {
  401: 'Не знаю, кто вы',
  403: 'Знаю, кто вы, но сюда нельзя',
  404: 'Такого объекта нет',
  409: 'Уже существует',
};

function codeFor(situation) {
  return Object.prototype.hasOwnProperty.call(CODES, situation) ? CODES[situation] : null;
}

function describe(code) {
  return TEXTS[code] || 'Другое';
}`,
    solutionExplanation:
      'Пара 401 и 403 — то, о чём спрашивают чаще всего. Первый код означает, что сервер не знает, кто перед ним: токена нет или он негоден. Второй — что личность установлена, но прав не хватает. Отвечать четыреста первым на нехватку прав неправильно: клиент начнёт предлагать войти заново, хотя вход уже выполнен.',
    maxScore: 12,
    estimatedMinutes: 10,
    examRefs: ['m1-login', 'm1-admin', 'm3-quality'],
    planDays: ['day-26-7'],
    source: 'plan',
  },

  {
    id: 'task-week-27-assembly',
    title: 'Разминка выходного: типы столбцов',
    kind: 'function',
    runtime: 'js',
    difficulty: 1,
    tech: ['js', 'sql'],
    topicIds: ['memory-training'],
    monthNo: 7,
    weekNo: 27,
    statement: `Выходной. Десять минут на выбор типов — то, с чего начинается первый модуль.

\`pickType(field)\` — возвращает тип столбца по имени поля:

- имя содержит \`phone\`, \`passport\`, \`card\` или \`number\` → \`'VARCHAR'\` (в них бывают плюсы, скобки и ведущие нули);
- содержит \`price\`, \`cost\` или \`sum\` → \`'DECIMAL'\`;
- содержит \`date\`, \`_on\` или \`_at\` → \`'DATE'\`;
- содержит \`count\`, \`capacity\`, \`minutes\` или \`rating\` → \`'INT'\`;
- всё остальное → \`'VARCHAR'\`.

Порядок проверок именно такой: поле \`card_number\` должно стать текстом, а не числом.`,
    requirements: [
      'Телефон и номера — текст',
      'Цены — дробные с копейками',
      'Даты — тип даты',
      'Количества — целые',
      'Порядок проверок не даёт card_number стать числом',
    ],
    starterCode: `function pickType(field) {
  // тип столбца по имени поля
}`,
    tests: [
      {
        id: 'text',
        name: 'Номера — текст',
        type: 'assert',
        code: `const pickType = ctx.get('pickType');
['phone', 'passport', 'card_number', 'room_number'].forEach((field) => {
  ctx.assert(pickType(field) === 'VARCHAR', 'Поле «' + field + '» должно быть VARCHAR, получено: ' + pickType(field));
});`,
        points: 4,
      },
      {
        id: 'money-dates',
        name: 'Деньги и даты',
        type: 'assert',
        code: `const pickType = ctx.get('pickType');
['price', 'total_cost', 'sum'].forEach((field) => {
  ctx.assert(pickType(field) === 'DECIMAL', 'Поле «' + field + '» должно быть DECIMAL, получено: ' + pickType(field));
});
['start_date', 'accepted_on', 'created_at'].forEach((field) => {
  ctx.assert(pickType(field) === 'DATE', 'Поле «' + field + '» должно быть DATE, получено: ' + pickType(field));
});`,
        points: 5,
      },
      {
        id: 'numbers',
        name: 'Количества — целые',
        type: 'assert',
        code: `const pickType = ctx.get('pickType');
['capacity', 'duration_minutes', 'rating', 'lessons_count'].forEach((field) => {
  ctx.assert(pickType(field) === 'INT', 'Поле «' + field + '» должно быть INT, получено: ' + pickType(field));
});
ctx.assert(pickType('full_name') === 'VARCHAR', 'Обычное поле — VARCHAR, получено: ' + pickType('full_name'));`,
        points: 5,
      },
    ],
    hints: [
      { level: 1, text: 'Проверяйте вхождение подстроки в имя поля: field.includes("phone").', penaltyPercent: 10 },
      { level: 2, text: 'Ключевое слово number попадает и в card_number, и в lessons_count — поэтому текстовая проверка должна идти первой.', penaltyPercent: 20 },
      { level: 3, text: 'Соберите правила массивом пар [список слов, тип] и пройдите по нему в нужном порядке.', penaltyPercent: 35 },
    ],
    solution: `const RULES = [
  { words: ['phone', 'passport', 'card', 'number'], type: 'VARCHAR' },
  { words: ['price', 'cost', 'sum'], type: 'DECIMAL' },
  { words: ['date', '_on', '_at'], type: 'DATE' },
  { words: ['count', 'capacity', 'minutes', 'rating'], type: 'INT' },
];

function pickType(field) {
  const name = String(field).toLowerCase();
  const rule = RULES.find((item) => item.words.some((word) => name.indexOf(word) !== -1));

  return rule ? rule.type : 'VARCHAR';
}`,
    solutionExplanation:
      'Порядок правил решает исход: слово number встречается и в card_number, и в lessons_count, и если бы числовое правило шло первым, номер карты стал бы целым числом и потерял ведущие нули. Правила вынесены в массив, а не в лесенку условий, именно поэтому — так порядок виден глазом и его трудно случайно переставить.',
    maxScore: 14,
    estimatedMinutes: 10,
    examRefs: ['m1-db', 'm3-db'],
    planDays: ['day-27-7'],
    source: 'plan',
  },

  {
    id: 'task-week-28-assembly',
    title: 'Разминка выходного: порядок работы',
    kind: 'function',
    runtime: 'js',
    difficulty: 1,
    tech: ['js'],
    topicIds: ['memory-training'],
    monthNo: 7,
    weekNo: 28,
    statement: `Выходной. Десять минут на порядок действий — то, что экономит больше всего времени.

1. \`LIST_ORDER\` — три шага вывода списка в правильном порядке: \`'filter'\`, \`'sort'\`, \`'page'\`.
2. \`CHECK_ORDER\` — четыре шага проверок в обработчике: \`'auth'\`, \`'exists'\`, \`'access'\`, \`'action'\`.
3. \`isCorrectOrder(steps, reference)\` — идут ли шаги в порядке из справочника (лишние шаги допустимы, порядок известных нарушаться не должен).
4. \`firstMistake(steps, reference)\` — первый шаг, оказавшийся не на своём месте, или \`null\`.`,
    requirements: [
      'Порядок вывода списка записан верно',
      'Порядок проверок записан верно',
      'isCorrectOrder распознаёт нарушение',
      'Лишние шаги не считаются ошибкой',
      'firstMistake называет виновника',
    ],
    starterCode: `const LIST_ORDER = [];
const CHECK_ORDER = [];

function isCorrectOrder(steps, reference) {
  // соблюдён ли порядок
}

function firstMistake(steps, reference) {
  // первый шаг не на месте
}`,
    tests: [
      {
        id: 'orders',
        name: 'Оба порядка записаны',
        type: 'assert',
        code: `const LIST_ORDER = ctx.get('LIST_ORDER');
const CHECK_ORDER = ctx.get('CHECK_ORDER');
ctx.assert(LIST_ORDER.join(',') === 'filter,sort,page', 'Порядок вывода списка: ' + LIST_ORDER.join(','));
ctx.assert(CHECK_ORDER.join(',') === 'auth,exists,access,action', 'Порядок проверок: ' + CHECK_ORDER.join(','));`,
        points: 4,
      },
      {
        id: 'correct',
        name: 'Правильный порядок принимается',
        type: 'assert',
        code: `const isCorrectOrder = ctx.get('isCorrectOrder');
const LIST_ORDER = ctx.get('LIST_ORDER');
ctx.assert(isCorrectOrder(['filter', 'sort', 'page'], LIST_ORDER) === true, 'Точный порядок должен приниматься');
ctx.assert(
  isCorrectOrder(['filter', 'map', 'sort', 'render', 'page'], LIST_ORDER) === true,
  'Лишние шаги между нужными — не ошибка',
);`,
        points: 5,
      },
      {
        id: 'wrong',
        name: 'Нарушение порядка распознаётся',
        type: 'assert',
        code: `const isCorrectOrder = ctx.get('isCorrectOrder');
const firstMistake = ctx.get('firstMistake');
const LIST_ORDER = ctx.get('LIST_ORDER');
ctx.assert(isCorrectOrder(['page', 'filter', 'sort'], LIST_ORDER) === false, 'Страница раньше фильтра — ошибка');
ctx.assert(
  firstMistake(['page', 'filter', 'sort'], LIST_ORDER) === 'filter',
  'Первым не на месте оказывается filter, получено: ' + ctx.preview(firstMistake(['page', 'filter', 'sort'], LIST_ORDER)),
);
ctx.assert(firstMistake(['filter', 'sort', 'page'], LIST_ORDER) === null, 'При правильном порядке нужен null');`,
        points: 6,
      },
    ],
    hints: [
      { level: 1, text: 'Оставьте из шагов только те, что есть в справочнике, — и сравните получившуюся последовательность с ним.', penaltyPercent: 10 },
      { level: 2, text: 'Нарушение — это шаг, индекс которого в справочнике меньше, чем у предыдущего known-шага.', penaltyPercent: 20 },
      { level: 3, text: 'const known = steps.filter((s) => reference.includes(s)); return known.join(",") === reference.filter((s) => known.includes(s)).join(",");', penaltyPercent: 35 },
    ],
    solution: `const LIST_ORDER = ['filter', 'sort', 'page'];
const CHECK_ORDER = ['auth', 'exists', 'access', 'action'];

function known(steps, reference) {
  return steps.filter((step) => reference.indexOf(step) !== -1);
}

function isCorrectOrder(steps, reference) {
  const present = known(steps, reference);
  const expected = reference.filter((step) => present.indexOf(step) !== -1);

  return present.join(',') === expected.join(',');
}

function firstMistake(steps, reference) {
  const present = known(steps, reference);

  for (let index = 1; index < present.length; index += 1) {
    if (reference.indexOf(present[index]) < reference.indexOf(present[index - 1])) {
      return present[index];
    }
  }

  return null;
}`,
    solutionExplanation:
      'Два порядка — почти весь опыт этих месяцев. Фильтр, сортировка, страница: переставьте что-нибудь, и на экране окажется случайный набор строк. Вход, наличие, доступ, действие: переставьте — и обработчик либо упадёт на несуществующем объекте, либо пропустит чужого. Лишние шаги между нужными ошибкой не считаются: между фильтром и сортировкой вполне может стоять преобразование данных.',
    maxScore: 15,
    estimatedMinutes: 10,
    examRefs: ['m2-admin-tools', 'm3-quality'],
    planDays: ['day-28-7'],
    source: 'plan',
  },

  {
    id: 'task-week-29-assembly',
    title: 'Разминка выходного: правила экзамена в одну строку',
    kind: 'function',
    runtime: 'js',
    difficulty: 1,
    tech: ['js'],
    topicIds: ['memory-training'],
    monthNo: 7,
    weekNo: 29,
    statement: `Предпоследний выходной. Десять минут на короткие правила, которые проверяют дословно.

1. \`REGISTER_FIELDS\` — пять полей формы регистрации из задания: \`'login'\`, \`'password'\`, \`'fullName'\`, \`'phone'\`, \`'email'\`.
2. \`REGISTER_LINK\` — точный текст ссылки: \`'Еще не зарегистрированы? Регистрация'\`.
3. \`validateLogin(login)\` — латиница и цифры, минимум 6 символов.
4. \`validatePassword(password)\` — минимум 8 символов.
5. \`hasAllFields(data)\` — все пять полей присутствуют и непустые.`,
    requirements: [
      'Пять полей регистрации перечислены',
      'Текст ссылки записан дословно',
      'Логин проверяется по правилу задания',
      'Пароль проверяется по длине',
      'hasAllFields находит пропуски',
    ],
    starterCode: `const REGISTER_FIELDS = [];
const REGISTER_LINK = '';

function validateLogin(login) {
  // латиница и цифры, минимум 6
}

function validatePassword(password) {
  // минимум 8 символов
}

function hasAllFields(data) {
  // все пять полей заполнены
}`,
    tests: [
      {
        id: 'fields',
        name: 'Поля и текст ссылки',
        type: 'assert',
        code: `const REGISTER_FIELDS = ctx.get('REGISTER_FIELDS');
const REGISTER_LINK = ctx.get('REGISTER_LINK');
ctx.assert(REGISTER_FIELDS.length === 5, 'Полей должно быть пять, найдено: ' + REGISTER_FIELDS.length);
['login', 'password', 'fullName', 'phone', 'email'].forEach((field) => {
  ctx.assert(REGISTER_FIELDS.indexOf(field) !== -1, 'Не хватает поля ' + field);
});
ctx.assert(
  REGISTER_LINK === 'Еще не зарегистрированы? Регистрация',
  'Текст берётся из задания дословно, включая «Еще» без ё. Получено: «' + REGISTER_LINK + '»',
);`,
        points: 5,
      },
      {
        id: 'login',
        name: 'Проверка логина',
        type: 'assert',
        code: `const validateLogin = ctx.get('validateLogin');
ctx.assert(validateLogin('ivanov26') === true, 'ivanov26 должен проходить');
ctx.assert(validateLogin('ivan') === false, 'Короткий логин не проходит');
ctx.assert(validateLogin('иванов26') === false, 'Кириллица не проходит');
ctx.assert(validateLogin('ivanov 26') === false, 'Пробел не проходит');`,
        points: 4,
      },
      {
        id: 'password',
        name: 'Проверка пароля',
        type: 'assert',
        code: `const validatePassword = ctx.get('validatePassword');
ctx.assert(validatePassword('demo2026pass') === true, 'Длинный пароль проходит');
ctx.assert(validatePassword('demo') === false, 'Короткий не проходит');`,
        points: 3,
      },
      {
        id: 'all-fields',
        name: 'Все поля заполнены',
        type: 'assert',
        code: `const hasAllFields = ctx.get('hasAllFields');
const full = { login: 'ivanov26', password: 'demo2026pass', fullName: 'Иванов Илья', phone: '+79990000001', email: 'a@b.ru' };
ctx.assert(hasAllFields(full) === true, 'Полные данные должны проходить');
ctx.assert(hasAllFields({ ...full, email: '' }) === false, 'Пустое поле — не заполнено');
ctx.assert(hasAllFields({ ...full, phone: undefined }) === false, 'Отсутствующее поле — не заполнено');`,
        points: 4,
      },
    ],
    hints: [
      { level: 1, text: 'Текст ссылки скопируйте из задания как есть: «Еще» там написано без буквы ё.', penaltyPercent: 10 },
      { level: 2, text: 'hasAllFields удобно построить на REGISTER_FIELDS: пройти по списку и проверить каждое поле.', penaltyPercent: 20 },
      { level: 3, text: 'return REGISTER_FIELDS.every((field) => typeof data[field] === "string" && data[field].trim() !== "");', penaltyPercent: 35 },
    ],
    solution: `const REGISTER_FIELDS = ['login', 'password', 'fullName', 'phone', 'email'];
const REGISTER_LINK = 'Еще не зарегистрированы? Регистрация';

function validateLogin(login) {
  return /^[A-Za-z0-9]{6,}$/.test(String(login));
}

function validatePassword(password) {
  return String(password).length >= 8;
}

function hasAllFields(data) {
  return REGISTER_FIELDS.every((field) => typeof data[field] === 'string' && data[field].trim() !== '');
}

void REGISTER_LINK;`,
    solutionExplanation:
      'Текст ссылки записан ровно так, как он приведён в задании, — без буквы ё в слове «Еще». Это выглядит опечаткой, но проверяющий сверяет с заданием, а не со словарём, и переписывать «правильнее» нельзя. Функция hasAllFields построена на том же списке полей, что и форма: добавится шестое поле — проверка подхватит его сама.',
    maxScore: 16,
    estimatedMinutes: 10,
    examRefs: ['m1-register', 'm1-login'],
    planDays: ['day-29-7'],
    source: 'plan',
  },

  {
    id: 'task-week-30-assembly',
    title: 'Отдых перед экзаменом: последняя сверка по памяти',
    kind: 'function',
    runtime: 'js',
    difficulty: 1,
    tech: ['js'],
    topicIds: ['exam-first-minutes'],
    monthNo: 7,
    weekNo: 30,
    statement: `Последний день перед экзаменом. Учить сегодня нечего — всё, что могло выучиться, уже выучилось. Десять минут на последнюю сверку — и дальше отдых. Взять с собой завтра нельзя ничего, поэтому смысл сегодняшнего дня один: убедиться, что эти четыре строки вспоминаются сами.

1. \`CHEAT_SHEET\` — объект из четырёх строк: \`date\` (формат даты), \`slider\` (\`'4 изображения, 3 секунды'\`), \`viewport\` (\`'390 × 844'\`), \`link\` (точный текст ссылки на регистрацию).
2. \`TOMORROW\` — три пункта распорядка: \`'Выспаться'\`, \`'Прийти заранее'\`, \`'Первые 10 минут — по плану'\`.
3. \`lines()\` — шпаргалка строками вида \`'Дата: ДД.ММ.ГГГГ'\`, в порядке \`date\`, \`slider\`, \`viewport\`, \`link\`.
4. \`isReady(state)\` — принимает \`{ sheetWritten, sleptEnough, planMemorised }\` и возвращает \`true\`, только если всё три верно.

На этом подготовка заканчивается. Удачи.`,
    requirements: [
      'Сверка содержит четыре значения',
      'Формат даты и параметры слайдера записаны верно',
      'Текст ссылки дословный',
      'lines собирает строки в нужном порядке',
      'isReady требует выполнения всех трёх условий',
    ],
    starterCode: `const CHEAT_SHEET = {};
const TOMORROW = [];

function lines() {
  // строки шпаргалки
}

function isReady(state) {
  // всё ли готово
}`,
    tests: [
      {
        id: 'sheet',
        name: 'Четыре строки выписаны',
        type: 'assert',
        code: `const CHEAT_SHEET = ctx.get('CHEAT_SHEET');
ctx.assert(CHEAT_SHEET.date === 'ДД.ММ.ГГГГ', 'Формат даты: ' + ctx.preview(CHEAT_SHEET.date));
ctx.assert(
  String(CHEAT_SHEET.slider).indexOf('4') !== -1 && String(CHEAT_SHEET.slider).indexOf('3') !== -1,
  'В строке про слайдер должны быть четыре изображения и три секунды: ' + ctx.preview(CHEAT_SHEET.slider),
);
ctx.assert(
  String(CHEAT_SHEET.viewport).indexOf('390') !== -1 && String(CHEAT_SHEET.viewport).indexOf('844') !== -1,
  'Размер экрана: ' + ctx.preview(CHEAT_SHEET.viewport),
);
ctx.assert(
  CHEAT_SHEET.link === 'Еще не зарегистрированы? Регистрация',
  'Текст ссылки дословный: ' + ctx.preview(CHEAT_SHEET.link),
);`,
        points: 5,
      },
      {
        id: 'tomorrow',
        name: 'Распорядок на завтра',
        type: 'assert',
        code: `const TOMORROW = ctx.get('TOMORROW');
ctx.assert(Array.isArray(TOMORROW) && TOMORROW.length === 3, 'Пунктов должно быть три, найдено: ' + (TOMORROW || []).length);
['Выспаться', 'Прийти заранее', 'Первые 10 минут — по плану'].forEach((item) => {
  ctx.assert(TOMORROW.indexOf(item) !== -1, 'Не хватает пункта «' + item + '»');
});`,
        points: 4,
      },
      {
        id: 'lines',
        name: 'Строки сверки',
        type: 'assert',
        code: `const result = ctx.get('lines')();
ctx.assert(Array.isArray(result) && result.length === 4, 'Строк должно быть четыре, получено: ' + (result || []).length);
ctx.assert(result[0].indexOf('ДД.ММ.ГГГГ') !== -1, 'Первой идёт строка про дату: ' + result[0]);
ctx.assert(result[3].indexOf('Регистрация') !== -1, 'Последней идёт строка про ссылку: ' + result[3]);
result.forEach((line, index) => {
  ctx.assert(line.indexOf(':') !== -1, 'Строка ' + (index + 1) + ' должна быть вида «Название: значение»: ' + line);
});`,
        points: 5,
      },
      {
        id: 'ready',
        name: 'Готовность к завтрашнему дню',
        type: 'assert',
        code: `const isReady = ctx.get('isReady');
ctx.assert(isReady({ sheetWritten: true, sleptEnough: true, planMemorised: true }) === true, 'Всё готово');
ctx.assert(isReady({ sheetWritten: true, sleptEnough: false, planMemorised: true }) === false, 'Без сна — не готов');
ctx.assert(isReady({}) === false, 'Пустое состояние — не готов');`,
        points: 4,
      },
    ],
    hints: [
      { level: 1, text: 'Всё это вы писали уже не раз. Сегодня просто сведите к четырём строкам — по памяти.', penaltyPercent: 10 },
      { level: 2, text: 'Названия строк придумайте сами — важно, чтобы каждая читалась как «Название: значение».', penaltyPercent: 20 },
      { level: 3, text: 'return [ "Дата: " + CHEAT_SHEET.date, "Слайдер: " + CHEAT_SHEET.slider, … ];', penaltyPercent: 35 },
    ],
    solution: `const CHEAT_SHEET = {
  date: 'ДД.ММ.ГГГГ',
  slider: '4 изображения, 3 секунды',
  viewport: '390 × 844',
  link: 'Еще не зарегистрированы? Регистрация',
};

const TOMORROW = ['Выспаться', 'Прийти заранее', 'Первые 10 минут — по плану'];

function lines() {
  return [
    'Дата: ' + CHEAT_SHEET.date,
    'Слайдер: ' + CHEAT_SHEET.slider,
    'Экран: ' + CHEAT_SHEET.viewport,
    'Ссылка: ' + CHEAT_SHEET.link,
  ];
}

function isReady(state) {
  return Boolean(state.sheetWritten && state.sleptEnough && state.planMemorised);
}

void TOMORROW;`,
    solutionExplanation:
      'Четыре строки — это всё, что имеет смысл повторить последним. Остальное либо уже в руках, либо не выучится за вечер. Сон стоит в списке готовности наравне со шпаргалкой не для красоты: четыре часа сосредоточенной работы на невыспавшуюся голову дают результат заметно хуже, чем те же четыре часа после нормальной ночи. Тридцать недель позади — сегодня лучшее, что можно сделать, — закрыть записи и выспаться.',
    maxScore: 18,
    estimatedMinutes: 10,
    examRefs: ['m2-slider', 'm2-mobile', 'm1-register'],
    planDays: ['day-30-7'],
    source: 'plan',
  },
];
