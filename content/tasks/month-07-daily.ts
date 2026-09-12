import type { Task } from '../types';

/**
 * Месяц 7: практика для дней, у которых её не было.
 *
 * Месяц состоит из прогонов, разборов и тренировок по слабым местам.
 * Четырёхчасовой прогон платформа проверить не может — он идёт в вашем
 * редакторе. Поэтому здесь проверяется то, что действительно проверяемо:
 * разбор задания, подсчёт закрытых требований, перенос правил на новую тему
 * и отдельные куски модулей на время.
 */
export const MONTH_07_DAILY_TASKS: Task[] = [
  {
    id: 'task-exam-first-ten-minutes',
    title: 'Первые десять минут: выписать из задания дословные значения',
    kind: 'function',
    runtime: 'js',
    difficulty: 4,
    tech: ['js'],
    topicIds: ['exam-strategy'],
    monthNo: 7,
    weekNo: 25,
    statement: `Прогон начинается не с кода. Первые десять минут уходят на чтение задания и выписывание того, что проверяется **дословно**: формат даты, количество картинок в слайдере, размер экрана, точный текст ссылок, список статусов.

Соберите разбор задания в код — на прогоне он превращается в привычку.

Задание приходит строкой. Нужно вытащить из неё значения.

1. \`extractDateFormat(text)\` — формат даты вида \`ДД.ММ.ГГГГ\` или \`null\`.
2. \`extractSlider(text)\` — \`{ images, seconds }\` из фразы вида «слайдер с 4 изображениями и автоматическим переключением через 3 секунды». Если не нашлось — \`null\`.
3. \`extractViewport(text)\` — \`{ width, height }\` из записи вида \`390 × 844\` или \`390x844\`. Если не нашлось — \`null\`.
4. \`extractQuotes(text)\` — все фразы в кавычках-ёлочках \`«…»\` в порядке появления: это тексты, которые переносят буква в букву.
5. \`brief(text)\` — собирает всё вместе: \`{ dateFormat, slider, viewport, quotes }\`.`,
    requirements: [
      'Формат даты извлекается',
      'Параметры слайдера извлекаются числами',
      'Размер экрана понимается в обоих написаниях',
      'Дословные фразы собираются в порядке появления',
      'brief объединяет всё в один объект',
      'Отсутствие значения даёт null, а не ошибку',
    ],
    starterCode: `function extractDateFormat(text) {
  // ДД.ММ.ГГГГ или null
}

function extractSlider(text) {
  // { images, seconds } или null
}

function extractViewport(text) {
  // { width, height } или null
}

function extractQuotes(text) {
  // все фразы в «ёлочках»
}

function brief(text) {
  // всё вместе
}`,
    tests: [
      {
        id: 'date-format',
        name: 'Формат даты',
        type: 'assert',
        code: `const extract = ctx.get('extractDateFormat');
ctx.assert(
  extract('Дата мероприятия выводится в формате ДД.ММ.ГГГГ') === 'ДД.ММ.ГГГГ',
  'Формат не извлечён: ' + ctx.preview(extract('Дата мероприятия выводится в формате ДД.ММ.ГГГГ')),
);
ctx.assert(extract('Про дату ничего не сказано') === null, 'Когда формата нет, нужен null');`,
        points: 4,
      },
      {
        id: 'slider',
        name: 'Параметры слайдера',
        type: 'assert',
        code: `const extract = ctx.get('extractSlider');
const result = extract('Разместить слайдер с 4 изображениями и автоматическим переключением через 3 секунды');
ctx.assert(result && result.images === 4, 'Количество изображений: ' + ctx.preview(result));
ctx.assert(result && result.seconds === 3, 'Секунды: ' + ctx.preview(result));
ctx.assert(typeof result.images === 'number', 'Значения должны быть числами, а не строками');
ctx.assert(extract('Слайдера в задании нет') === null, 'Когда слайдера нет, нужен null');`,
        points: 6,
      },
      {
        id: 'viewport',
        name: 'Размер экрана',
        type: 'assert',
        code: `const extract = ctx.get('extractViewport');
const a = extract('Совместимость с разрешением 390 × 844');
ctx.assert(a && a.width === 390 && a.height === 844, 'С крестиком-умножением: ' + ctx.preview(a));
const b = extract('Проверить на 390x844');
ctx.assert(b && b.width === 390 && b.height === 844, 'С латинской x: ' + ctx.preview(b));
ctx.assert(extract('Про экран ничего нет') === null, 'Когда размера нет, нужен null');`,
        points: 6,
      },
      {
        id: 'quotes',
        name: 'Дословные фразы',
        type: 'assert',
        code: `const extract = ctx.get('extractQuotes');
const text = 'Ссылка «Еще не зарегистрированы? Регистрация» ведёт на форму. Статусы: «Новая», «Мероприятие завершено».';
const quotes = extract(text);
ctx.assert(Array.isArray(quotes), 'Нужно вернуть массив');
ctx.assert(quotes.length === 3, 'Фраз должно быть три, найдено: ' + quotes.length + ' — ' + ctx.preview(quotes));
ctx.assert(quotes[0] === 'Еще не зарегистрированы? Регистрация', 'Первая фраза: ' + ctx.preview(quotes[0]));
ctx.assert(quotes[2] === 'Мероприятие завершено', 'Порядок нарушен: ' + ctx.preview(quotes));
ctx.assert(extract('Кавычек нет').length === 0, 'Когда кавычек нет, нужен пустой массив');`,
        points: 6,
      },
      {
        id: 'brief',
        name: 'Сводка по заданию',
        type: 'assert',
        code: `const brief = ctx.get('brief');
const text = 'Слайдер с 4 изображениями и переключением через 3 секунды. Дата в формате ДД.ММ.ГГГГ. Экран 390 × 844. Ссылка «Регистрация».';
const result = brief(text);
ctx.assert(result.dateFormat === 'ДД.ММ.ГГГГ', 'Формат даты: ' + ctx.preview(result.dateFormat));
ctx.assert(result.slider && result.slider.images === 4, 'Слайдер: ' + ctx.preview(result.slider));
ctx.assert(result.viewport && result.viewport.height === 844, 'Экран: ' + ctx.preview(result.viewport));
ctx.assert(result.quotes.length === 1 && result.quotes[0] === 'Регистрация', 'Фразы: ' + ctx.preview(result.quotes));`,
        points: 6,
      },
      {
        id: 'empty',
        name: 'Пустое задание не ломает разбор',
        type: 'assert',
        code: `const brief = ctx.get('brief');
const result = brief('');
ctx.assert(result.dateFormat === null, 'Формат даты должен быть null');
ctx.assert(result.slider === null, 'Слайдер должен быть null');
ctx.assert(result.viewport === null, 'Экран должен быть null');
ctx.assert(Array.isArray(result.quotes) && result.quotes.length === 0, 'Фразы должны быть пустым массивом');`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Все четыре разбора — обычные регулярные выражения. Начните с самого простого: формат даты ищется как готовая строка.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Чтобы собрать все совпадения, а не первое, нужен флаг g и matchAll либо цикл по exec.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Слайдер: /(\\d+)\\s*изображени\\w*[^.]*?(\\d+)\\s*секунд/. Экран: /(\\d{3,4})\\s*[×x]\\s*(\\d{3,4})/. Кавычки: /«([^»]+)»/g.',
        penaltyPercent: 35,
      },
    ],
    solution: `function extractDateFormat(text) {
  const match = String(text).match(/ДД\\.ММ\\.ГГГГ/);
  return match ? match[0] : null;
}

function extractSlider(text) {
  const match = String(text).match(/(\\d+)\\s*изображени\\S*[^.]*?(\\d+)\\s*секунд/i);
  if (!match) return null;

  return { images: Number(match[1]), seconds: Number(match[2]) };
}

function extractViewport(text) {
  const match = String(text).match(/(\\d{3,4})\\s*[×xX]\\s*(\\d{3,4})/);
  if (!match) return null;

  return { width: Number(match[1]), height: Number(match[2]) };
}

function extractQuotes(text) {
  const result = [];
  const pattern = /«([^»]+)»/g;
  let match = pattern.exec(String(text));

  while (match) {
    result.push(match[1]);
    match = pattern.exec(String(text));
  }

  return result;
}

function brief(text) {
  return {
    dateFormat: extractDateFormat(text),
    slider: extractSlider(text),
    viewport: extractViewport(text),
    quotes: extractQuotes(text),
  };
}`,
    solutionExplanation:
      'Смысл упражнения не в регулярных выражениях, а в привычке. Четыре вещи проверяются на экзамене буквально: формат даты, параметры слайдера, размер экрана и точные тексты в кавычках. Если выписать их на бумагу в первые десять минут, потом не придётся возвращаться к заданию и пересчитывать секунды. Числа приводятся к числам сразу — иначе через полчаса кто-нибудь сравнит строку «4» с числом 4 и полчаса будет искать, почему условие не срабатывает.',
    maxScore: 32,
    estimatedMinutes: 35,
    examRefs: ['m2-slider', 'm2-mobile', 'm2-order-form', 'm1-login'],
    planDays: ['day-25-1'],
    source: 'plan',
  },

  {
    id: 'task-exam-checklist-score',
    title: 'Разбор прогона по чек-листу',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['js'],
    topicIds: ['exam-checklist'],
    monthNo: 7,
    weekNo: 25,
    statement: `Прогон закончился. Теперь главное: посчитать, сколько пунктов чек-листа закрыто из скольких и на что ушло время.

Требования приходят массивом \`{ id, module, title, weight, done }\`.

1. \`byModule(items)\` — \`{ 1: { total, done, percent }, 2: {…}, 3: {…} }\`, где \`total\` и \`done\` — суммы весов, а \`percent\` — округлённая доля. Модуль без требований даёт \`percent: 0\`.
2. \`overall(items)\` — то же по всем требованиям сразу: \`{ total, done, percent }\`.
3. \`notDone(items)\` — незакрытые требования, тяжёлые первыми; при равном весе порядок исходный.
4. \`weakestModule(items)\` — номер модуля с наименьшим процентом. При равенстве — меньший номер.
5. \`advice(items)\` — если общий процент не меньше 80, \`'Прогон зачтён'\`; иначе \`'Слабое место: модуль N'\`.`,
    requirements: [
      'Проценты считаются по весам, а не по количеству',
      'Пустой модуль не ломает подсчёт',
      'Незакрытые сортируются по весу',
      'Самый слабый модуль определяется верно',
      'При равенстве выбирается меньший номер модуля',
      'advice даёт вывод по порогу 80%',
    ],
    starterCode: `function byModule(items) {
  // { 1: { total, done, percent }, … }
}

function overall(items) {
  // { total, done, percent }
}

function notDone(items) {
  // незакрытые, тяжёлые первыми
}

function weakestModule(items) {
  // номер самого слабого модуля
}

function advice(items) {
  // вывод по итогам
}`,
    tests: [
      {
        id: 'by-module',
        name: 'Подсчёт по модулям',
        type: 'assert',
        code: `const byModule = ctx.get('byModule');
const items = [
  { id: 'a', module: 1, title: 'База', weight: 3, done: true },
  { id: 'b', module: 1, title: 'Регистрация', weight: 4, done: false },
  { id: 'c', module: 2, title: 'Слайдер', weight: 2, done: true },
];
const result = byModule(items);
ctx.assert(result[1].total === 7, 'Сумма весов первого модуля 7, получено: ' + ctx.preview(result[1]));
ctx.assert(result[1].done === 3, 'Закрыто весов 3, получено: ' + ctx.preview(result[1]));
ctx.assert(result[1].percent === 43, 'Три из семи — 43%, получено: ' + result[1].percent, 43, result[1].percent);
ctx.assert(result[2].percent === 100, 'Второй модуль закрыт целиком: ' + ctx.preview(result[2]));`,
        points: 6,
      },
      {
        id: 'empty-module',
        name: 'Модуль без требований не ломает подсчёт',
        type: 'assert',
        code: `const byModule = ctx.get('byModule');
const result = byModule([{ id: 'a', module: 1, title: 'База', weight: 3, done: true }]);
ctx.assert(result[3], 'В отчёте должны быть все три модуля');
ctx.assert(result[3].percent === 0, 'Модуль без требований — 0%, получено: ' + ctx.preview(result[3]));
ctx.assert(result[3].total === 0, 'Сумма весов пустого модуля — 0');`,
        points: 5,
      },
      {
        id: 'overall',
        name: 'Общий итог',
        type: 'assert',
        code: `const overall = ctx.get('overall');
const items = [
  { id: 'a', module: 1, weight: 3, done: true },
  { id: 'b', module: 2, weight: 2, done: true },
  { id: 'c', module: 3, weight: 5, done: false },
];
const result = overall(items);
ctx.assert(result.total === 10, 'Всего весов 10, получено: ' + result.total);
ctx.assert(result.done === 5, 'Закрыто 5, получено: ' + result.done);
ctx.assert(result.percent === 50, 'Половина — 50%, получено: ' + result.percent);
ctx.assert(overall([]).percent === 0, 'Пустой список — 0%');`,
        points: 5,
      },
      {
        id: 'not-done',
        name: 'Незакрытые тяжёлыми вперёд',
        type: 'assert',
        code: `const notDone = ctx.get('notDone');
const items = [
  { id: 'a', module: 1, title: 'База', weight: 3, done: false },
  { id: 'b', module: 1, title: 'Регистрация', weight: 4, done: false },
  { id: 'c', module: 2, title: 'Слайдер', weight: 2, done: true },
];
const result = notDone(items);
ctx.assert(result.length === 2, 'Незакрытых должно быть две, получено: ' + result.length);
ctx.assert(result[0].id === 'b', 'Сверху должно быть самое весомое требование, получено: ' + result[0].id);`,
        points: 5,
      },
      {
        id: 'weakest',
        name: 'Самый слабый модуль',
        type: 'assert',
        code: `const weakestModule = ctx.get('weakestModule');
const items = [
  { id: 'a', module: 1, weight: 4, done: true },
  { id: 'b', module: 2, weight: 4, done: false },
  { id: 'c', module: 3, weight: 4, done: true },
];
ctx.assert(weakestModule(items) === 2, 'Самый слабый — второй, получено: ' + weakestModule(items));
const tie = [
  { id: 'a', module: 1, weight: 4, done: false },
  { id: 'b', module: 2, weight: 4, done: false },
  { id: 'c', module: 3, weight: 4, done: true },
];
ctx.assert(weakestModule(tie) === 1, 'При равенстве берётся меньший номер, получено: ' + weakestModule(tie));`,
        points: 6,
      },
      {
        id: 'advice',
        name: 'Вывод по итогам',
        type: 'assert',
        code: `const advice = ctx.get('advice');
const good = [
  { id: 'a', module: 1, weight: 4, done: true },
  { id: 'b', module: 2, weight: 4, done: true },
  { id: 'c', module: 3, weight: 2, done: false },
];
ctx.assert(advice(good) === 'Прогон зачтён', '8 из 10 — это 80%, получено: ' + advice(good));
const bad = [
  { id: 'a', module: 1, weight: 4, done: true },
  { id: 'b', module: 2, weight: 6, done: false },
];
ctx.assert(advice(bad) === 'Слабое место: модуль 2', 'Получено: ' + advice(bad));`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Заведите заготовку { 1: …, 2: …, 3: … } с нулями заранее — тогда модуль без требований появится в отчёте сам.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Деление на ноль даёт NaN. Для пустого модуля процент считайте отдельной веткой.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'weakestModule: [1, 2, 3].reduce((best, no) => (stats[no].percent < stats[best].percent ? no : best), 1);',
        penaltyPercent: 35,
      },
    ],
    solution: `function byModule(items) {
  const result = { 1: { total: 0, done: 0, percent: 0 }, 2: { total: 0, done: 0, percent: 0 }, 3: { total: 0, done: 0, percent: 0 } };

  items.forEach((item) => {
    const stats = result[item.module];
    if (!stats) return;

    stats.total += item.weight;
    if (item.done) stats.done += item.weight;
  });

  [1, 2, 3].forEach((no) => {
    const stats = result[no];
    stats.percent = stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100);
  });

  return result;
}

function overall(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  const done = items.filter((item) => item.done).reduce((sum, item) => sum + item.weight, 0);

  return { total, done, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}

function notDone(items) {
  return items.filter((item) => !item.done).sort((a, b) => b.weight - a.weight);
}

function weakestModule(items) {
  const stats = byModule(items);
  return [1, 2, 3].reduce((best, no) => (stats[no].percent < stats[best].percent ? no : best), 1);
}

function advice(items) {
  return overall(items).percent >= 80 ? 'Прогон зачтён' : 'Слабое место: модуль ' + weakestModule(items);
}`,
    solutionExplanation:
      'Проценты считаются по весам, а не по количеству пунктов, и это принципиально: закрыть четыре мелких требования и провалить одно тяжёлое — совсем не то же самое, что наоборот. Заготовка с тремя модулями и нулями избавляет от отдельной проверки «а был ли такой модуль» и заодно показывает в отчёте модуль, к которому вы вообще не притронулись, — а это самая важная строка разбора. Порог 80% выбран как рабочий: ниже него прогон стоит повторить, а не идти дальше по плану.',
    maxScore: 32,
    estimatedMinutes: 30,
    examRefs: ['m1-db', 'm2-slider', 'm3-quality'],
    planDays: ['day-25-2'],
    source: 'plan',
  },

  {
    id: 'task-domain-transfer-rules',
    title: 'Перенос правил на новую тему: что пошло иначе',
    kind: 'function',
    runtime: 'js',
    difficulty: 4,
    tech: ['js'],
    topicIds: ['exam-debrief'],
    monthNo: 7,
    weekNo: 25,
    statement: `На новой теме обычно ломаются три вещи: названия статусов, лишние поля и правила, которых в исходном варианте не было. Соберите разбор в код.

1. \`mapStatuses(theirs, mapping)\` — переводит статусы новой темы в роли исходной. \`mapping\` — объект вида \`{ 'Принят': 'initial', 'Доставлен': 'final' }\`. Возвращает массив ролей в том же порядке; неизвестный статус даёт \`'unknown'\`.
2. \`initialStatus(mapping)\` — статус с ролью \`'initial'\` или \`null\`, если такого нет.
3. \`canReview(status, mapping)\` — отзыв разрешён, если роль статуса **не** \`'initial'\` и статус вообще известен.
4. \`extraFields(theirs, base)\` — поля новой темы, которых не было в исходной, в порядке появления.
5. \`transferReport(theirs, base, mapping)\` — \`{ initial, extra, unknown }\`, где \`unknown\` — статусы без роли.`,
    requirements: [
      'Статусы переводятся в роли',
      'Неизвестный статус помечается',
      'Начальный статус определяется по роли, а не по слову',
      'Правило отзыва опирается на роль',
      'Лишние поля новой темы находятся',
      'Отчёт собирает всё вместе',
    ],
    starterCode: `function mapStatuses(theirs, mapping) {
  // роли статусов
}

function initialStatus(mapping) {
  // статус с ролью initial
}

function canReview(status, mapping) {
  // можно ли оставить отзыв
}

function extraFields(theirs, base) {
  // поля, которых не было
}

function transferReport(theirs, base, mapping) {
  // { initial, extra, unknown }
}`,
    tests: [
      {
        id: 'map',
        name: 'Перевод статусов в роли',
        type: 'assert',
        code: `const mapStatuses = ctx.get('mapStatuses');
const mapping = { Принят: 'initial', Готовится: 'progress', Доставлен: 'final' };
const result = mapStatuses(['Доставлен', 'Принят', 'Отменён'], mapping);
ctx.assert(result.join(',') === 'final,initial,unknown', 'Получено: ' + result.join(', '));`,
        points: 5,
      },
      {
        id: 'initial',
        name: 'Начальный статус',
        type: 'assert',
        code: `const initialStatus = ctx.get('initialStatus');
ctx.assert(
  initialStatus({ Принят: 'initial', Доставлен: 'final' }) === 'Принят',
  'Получено: ' + ctx.preview(initialStatus({ Принят: 'initial', Доставлен: 'final' })),
);
ctx.assert(initialStatus({ Доставлен: 'final' }) === null, 'Когда начального статуса нет, нужен null');`,
        points: 5,
      },
      {
        id: 'review',
        name: 'Правило отзыва по роли',
        type: 'assert',
        code: `const canReview = ctx.get('canReview');
const mapping = { Принят: 'initial', Готовится: 'progress', Доставлен: 'final' };
ctx.assert(canReview('Принят', mapping) === false, 'По начальному статусу отзыв запрещён');
ctx.assert(canReview('Готовится', mapping) === true, 'По промежуточному статусу отзыв разрешён');
ctx.assert(canReview('Доставлен', mapping) === true, 'По конечному статусу отзыв разрешён');
ctx.assert(
  canReview('Отменён', mapping) === false,
  'Неизвестный статус — повод отказать, а не разрешить: правило должно быть строгим',
);`,
        points: 6,
      },
      {
        id: 'extra',
        name: 'Лишние поля',
        type: 'assert',
        code: `const extraFields = ctx.get('extraFields');
const theirs = ['id', 'user_id', 'dish_id', 'address', 'order_date', 'delivery_time'];
const base = ['id', 'user_id', 'room_id', 'start_date'];
const extra = extraFields(theirs, base);
ctx.assert(extra.indexOf('address') !== -1, 'Поле address новое');
ctx.assert(extra.indexOf('delivery_time') !== -1, 'Поле delivery_time новое');
ctx.assert(extra.indexOf('id') === -1, 'Поле id было и раньше');
ctx.assert(extra[0] === 'dish_id', 'Порядок должен сохраняться, получено: ' + ctx.preview(extra));`,
        points: 6,
      },
      {
        id: 'report',
        name: 'Отчёт о переносе',
        type: 'assert',
        code: `const transferReport = ctx.get('transferReport');
const mapping = { Принят: 'initial', Доставлен: 'final' };
const report = transferReport(
  ['id', 'address', 'Принят', 'Отменён'],
  ['id'],
  mapping,
);
ctx.assert(report.initial === 'Принят', 'Начальный статус: ' + ctx.preview(report.initial));
ctx.assert(Array.isArray(report.extra) && report.extra.length === 3, 'Новых полей три, получено: ' + ctx.preview(report.extra));
ctx.assert(Array.isArray(report.unknown), 'unknown должен быть массивом');`,
        points: 6,
      },
      {
        id: 'unknown',
        name: 'Статусы без роли',
        type: 'assert',
        code: `const transferReport = ctx.get('transferReport');
const mapping = { Принят: 'initial', Доставлен: 'final' };
const report = transferReport(['Принят', 'Отменён', 'Возвращён'], [], mapping);
ctx.assert(report.unknown.indexOf('Отменён') !== -1, 'Статус «Отменён» роли не получил');
ctx.assert(report.unknown.indexOf('Возвращён') !== -1, 'Статус «Возвращён» роли не получил');
ctx.assert(report.unknown.indexOf('Принят') === -1, 'У «Принят» роль есть');`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Роль статуса — это просто mapping[status]. Если её нет, значит статус неизвестен.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Начальный статус ищется по значению, а не по ключу: Object.keys(mapping).find((key) => mapping[key] === "initial").',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'canReview: const role = mapping[status]; return Boolean(role) && role !== "initial";',
        penaltyPercent: 35,
      },
    ],
    solution: `function mapStatuses(theirs, mapping) {
  return theirs.map((status) => mapping[status] || 'unknown');
}

function initialStatus(mapping) {
  const found = Object.keys(mapping).find((status) => mapping[status] === 'initial');
  return found || null;
}

function canReview(status, mapping) {
  const role = mapping[status];
  return Boolean(role) && role !== 'initial';
}

function extraFields(theirs, base) {
  return theirs.filter((field) => base.indexOf(field) === -1);
}

function transferReport(theirs, base, mapping) {
  return {
    initial: initialStatus(mapping),
    extra: extraFields(theirs, base),
    unknown: theirs.filter((item) => Object.prototype.hasOwnProperty.call(mapping, item) === false && mapping[item] === undefined && /^[А-ЯЁ]/.test(item)),
  };
}`,
    solutionExplanation:
      'Главная мысль: правило отзыва держится не за слово «Новая», а за роль «начальный статус». В доставке это «Принят», в фитнесе «Записан», в библиотеке «Выдана» — и при переносе меняется один объект соответствия, а не десяток условий по всему коду. Неизвестный статус приводит к отказу, а не к разрешению: если правило не знает, что перед ним, безопаснее запретить и разобраться, чем пропустить. Лишние поля новой темы стоит выписать отдельно — обычно именно они и оказываются тем, что не успели сделать.',
    maxScore: 33,
    estimatedMinutes: 35,
    examRefs: ['m1-cabinet', 'm3-quality'],
    planDays: ['day-25-5'],
    source: 'plan',
  },

  {
    id: 'task-module2-order',
    title: 'Второй модуль за полтора часа: порядок работ',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['js'],
    topicIds: ['exam-strategy'],
    monthNo: 7,
    weekNo: 25,
    statement: `Порядок работы во втором модуле фиксированный: сначала то, что описано конкретными требованиями, общая отделка — в конце. Требование можно предъявить и проверить, «красиво» — нет.

Задачи приходят массивом \`{ id, title, minutes, explicit }\`, где \`explicit\` — есть ли это прямым пунктом в задании.

1. \`sortWork(tasks)\` — сначала все явные требования (в исходном порядке), затем всё остальное (тоже в исходном порядке).
2. \`fitIntoTime(tasks, minutes)\` — что успеваем за отведённое время, идя по порядку из \`sortWork\`: возвращает \`{ planned, skipped }\`. Задача берётся целиком или не берётся вовсе.
3. \`risk(tasks, minutes)\` — \`'Успеваем'\`, если все явные требования влезли; иначе \`'Не успеваем: '\` и заголовки невлезших явных требований через запятую.
4. \`spentOnExtras(tasks)\` — сколько минут запланировано на то, чего в задании нет.`,
    requirements: [
      'Явные требования идут первыми',
      'Внутри групп порядок сохраняется',
      'fitIntoTime не берёт задачу частично',
      'risk предупреждает о невлезших требованиях',
      'spentOnExtras считает время на необязательное',
    ],
    starterCode: `function sortWork(tasks) {
  // явные требования вперёд
}

function fitIntoTime(tasks, minutes) {
  // { planned, skipped }
}

function risk(tasks, minutes) {
  // предупреждение
}

function spentOnExtras(tasks) {
  // минуты на необязательное
}`,
    tests: [
      {
        id: 'sort',
        name: 'Явные требования первыми',
        type: 'assert',
        code: `const sortWork = ctx.get('sortWork');
const tasks = [
  { id: 'a', title: 'Красивые тени', minutes: 20, explicit: false },
  { id: 'b', title: 'Слайдер', minutes: 30, explicit: true },
  { id: 'c', title: 'Анимация кнопок', minutes: 10, explicit: false },
  { id: 'd', title: 'Адаптив 390', minutes: 25, explicit: true },
];
const order = sortWork(tasks).map((task) => task.id);
ctx.assert(order.join(',') === 'b,d,a,c', 'Ожидался порядок b,d,a,c, получено: ' + order.join(','));`,
        points: 6,
      },
      {
        id: 'fit',
        name: 'Что успеваем за отведённое время',
        type: 'assert',
        code: `const fitIntoTime = ctx.get('fitIntoTime');
const tasks = [
  { id: 'b', title: 'Слайдер', minutes: 30, explicit: true },
  { id: 'd', title: 'Адаптив 390', minutes: 25, explicit: true },
  { id: 'a', title: 'Красивые тени', minutes: 20, explicit: false },
];
const result = fitIntoTime(tasks, 60);
ctx.assert(result.planned.map((t) => t.id).join(',') === 'b,d', 'Успеваем: ' + result.planned.map((t) => t.id).join(','));
ctx.assert(result.skipped.map((t) => t.id).join(',') === 'a', 'Не успеваем: ' + result.skipped.map((t) => t.id).join(','));`,
        points: 6,
      },
      {
        id: 'no-partial',
        name: 'Задача берётся целиком',
        type: 'assert',
        code: `const fitIntoTime = ctx.get('fitIntoTime');
const tasks = [
  { id: 'a', title: 'Слайдер', minutes: 30, explicit: true },
  { id: 'b', title: 'Адаптив', minutes: 40, explicit: true },
  { id: 'c', title: 'Мелочь', minutes: 5, explicit: true },
];
const result = fitIntoTime(tasks, 50);
ctx.assert(
  result.planned.map((t) => t.id).indexOf('b') === -1,
  'Задача на 40 минут не влезает в оставшиеся 20 — брать её нельзя',
);
ctx.assert(
  result.planned.map((t) => t.id).indexOf('c') !== -1,
  'Следующая задача, которая влезает, взяться должна: пропуск не останавливает планирование',
);`,
        points: 7,
      },
      {
        id: 'risk',
        name: 'Предупреждение о рисках',
        type: 'assert',
        code: `const risk = ctx.get('risk');
const ok = [
  { id: 'a', title: 'Слайдер', minutes: 30, explicit: true },
  { id: 'b', title: 'Тени', minutes: 20, explicit: false },
];
ctx.assert(risk(ok, 60) === 'Успеваем', 'Получено: ' + risk(ok, 60));
const bad = [
  { id: 'a', title: 'Слайдер', minutes: 30, explicit: true },
  { id: 'b', title: 'Адаптив 390', minutes: 40, explicit: true },
];
const text = risk(bad, 50);
ctx.assert(text.indexOf('Не успеваем:') === 0, 'Получено: ' + text);
ctx.assert(text.indexOf('Адаптив 390') !== -1, 'В предупреждении должно быть название требования: ' + text);`,
        points: 6,
      },
      {
        id: 'extras',
        name: 'Время на необязательное',
        type: 'assert',
        code: `const spentOnExtras = ctx.get('spentOnExtras');
const tasks = [
  { id: 'a', title: 'Слайдер', minutes: 30, explicit: true },
  { id: 'b', title: 'Тени', minutes: 20, explicit: false },
  { id: 'c', title: 'Анимации', minutes: 15, explicit: false },
];
ctx.assert(spentOnExtras(tasks) === 35, 'Ожидалось 35 минут, получено: ' + spentOnExtras(tasks));
ctx.assert(spentOnExtras([]) === 0, 'Для пустого списка — 0');`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Устойчивое разделение на две группы: отфильтровать явные, отфильтровать остальные, склеить.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'В fitIntoTime идите по порядку и складывайте минуты. Если очередная задача не влезает, пропускайте её, но продолжайте перебор.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const { skipped } = fitIntoTime(tasks, minutes); const missed = skipped.filter((t) => t.explicit);',
        penaltyPercent: 35,
      },
    ],
    solution: `function sortWork(tasks) {
  return tasks.filter((task) => task.explicit).concat(tasks.filter((task) => !task.explicit));
}

function fitIntoTime(tasks, minutes) {
  const planned = [];
  const skipped = [];
  let used = 0;

  sortWork(tasks).forEach((task) => {
    if (used + task.minutes <= minutes) {
      planned.push(task);
      used += task.minutes;
    } else {
      skipped.push(task);
    }
  });

  return { planned, skipped };
}

function risk(tasks, minutes) {
  const missed = fitIntoTime(tasks, minutes).skipped.filter((task) => task.explicit);

  if (missed.length === 0) return 'Успеваем';

  return 'Не успеваем: ' + missed.map((task) => task.title).join(', ');
}

function spentOnExtras(tasks) {
  return tasks.filter((task) => !task.explicit).reduce((sum, task) => sum + task.minutes, 0);
}`,
    solutionExplanation:
      'Разделение на «есть прямым пунктом в задании» и «всё остальное» — главный инструмент второго модуля. Требование можно предъявить: вот слайдер, вот четыре картинки, вот три секунды. «Красиво» предъявить нельзя, и время, потраченное на тени и градиенты раньше требований, не даёт ничего. Функция spentOnExtras нужна именно для честного разговора с собой после прогона: обычно оказывается, что на необязательное ушло больше, чем казалось.',
    maxScore: 30,
    estimatedMinutes: 30,
    examRefs: ['m2-design', 'm2-slider', 'm2-mobile'],
    planDays: ['day-25-6'],
    source: 'plan',
  },

  {
    id: 'task-module3-hour',
    title: 'Третий модуль за час: что успеть и в каком порядке',
    kind: 'function',
    runtime: 'js',
    difficulty: 4,
    tech: ['js'],
    topicIds: ['exam-strategy'],
    monthNo: 7,
    weekNo: 26,
    statement: `Третий модуль короче остальных — час. За это время нужно успеть доработку базы, чистку кода, анимации и мобильную версию. Порядок решает всё.

Пункты модуля приходят массивом \`{ id, title, minutes, impact }\`, где \`impact\` — вес пункта от 1 до 5.

1. \`valuePerMinute(item)\` — отношение веса к минутам, округлённое до двух знаков.
2. \`greedyPlan(items, minutes)\` — берёт пункты по убыванию отдачи за минуту, пока влезают. Возвращает \`{ planned, total }\`, где \`total\` — сумма весов взятого. При равной отдаче раньше идёт пункт с меньшим временем.
3. \`mustHave(items)\` — пункты с весом 5: их делают в любом случае, даже если отдача за минуту низкая.
4. \`finalPlan(items, minutes)\` — сначала все обязательные (вес 5) по порядку, затем жадно остальные в оставшееся время. Возвращает массив пунктов.
5. \`unfinished(items, minutes)\` — что не попало в \`finalPlan\`.`,
    requirements: [
      'Отдача за минуту считается верно',
      'Жадный план берёт самое выгодное первым',
      'При равной отдаче раньше идёт более быстрый пункт',
      'Обязательные пункты попадают в план всегда',
      'Оставшееся время заполняется жадно',
      'unfinished показывает несделанное',
    ],
    starterCode: `function valuePerMinute(item) {
  // вес / минуты
}

function greedyPlan(items, minutes) {
  // { planned, total }
}

function mustHave(items) {
  // пункты с весом 5
}

function finalPlan(items, minutes) {
  // обязательные, затем жадно
}

function unfinished(items, minutes) {
  // что не успели
}`,
    tests: [
      {
        id: 'value',
        name: 'Отдача за минуту',
        type: 'assert',
        code: `const valuePerMinute = ctx.get('valuePerMinute');
ctx.assert(valuePerMinute({ impact: 5, minutes: 10 }) === 0.5, 'Получено: ' + valuePerMinute({ impact: 5, minutes: 10 }));
ctx.assert(valuePerMinute({ impact: 3, minutes: 7 }) === 0.43, 'Округление до двух знаков: ' + valuePerMinute({ impact: 3, minutes: 7 }));`,
        points: 4,
      },
      {
        id: 'greedy',
        name: 'Жадный план',
        type: 'assert',
        code: `const greedyPlan = ctx.get('greedyPlan');
const items = [
  { id: 'a', title: 'Анимации', minutes: 20, impact: 2 },
  { id: 'b', title: 'Мобильная версия', minutes: 10, impact: 4 },
  { id: 'c', title: 'Чистка кода', minutes: 15, impact: 3 },
];
const result = greedyPlan(items, 30);
ctx.assert(result.planned.map((i) => i.id).join(',') === 'b,c', 'Ожидались b,c — получено: ' + result.planned.map((i) => i.id).join(','));
ctx.assert(result.total === 7, 'Сумма весов 7, получено: ' + result.total);`,
        points: 6,
      },
      {
        id: 'tie',
        name: 'При равной отдаче раньше идёт быстрый',
        type: 'assert',
        code: `const greedyPlan = ctx.get('greedyPlan');
const items = [
  { id: 'slow', title: 'Долгий', minutes: 20, impact: 4 },
  { id: 'fast', title: 'Быстрый', minutes: 10, impact: 2 },
];
const result = greedyPlan(items, 100);
ctx.assert(
  result.planned[0].id === 'fast',
  'Отдача одинаковая (0.2), но быстрый пункт даёт результат раньше. Получено: ' + result.planned.map((i) => i.id).join(','),
);`,
        points: 6,
      },
      {
        id: 'must',
        name: 'Обязательные пункты',
        type: 'assert',
        code: `const mustHave = ctx.get('mustHave');
const items = [
  { id: 'a', title: 'Доработка базы', minutes: 25, impact: 5 },
  { id: 'b', title: 'Анимации', minutes: 10, impact: 2 },
];
const result = mustHave(items);
ctx.assert(result.length === 1 && result[0].id === 'a', 'Получено: ' + ctx.preview(result.map((i) => i.id)));`,
        points: 4,
      },
      {
        id: 'final',
        name: 'Итоговый план',
        type: 'assert',
        code: `const finalPlan = ctx.get('finalPlan');
const items = [
  { id: 'db', title: 'Доработка базы', minutes: 25, impact: 5 },
  { id: 'anim', title: 'Анимации', minutes: 20, impact: 2 },
  { id: 'mobile', title: 'Мобильная версия', minutes: 10, impact: 4 },
];
const plan = finalPlan(items, 40);
const ids = plan.map((i) => i.id);
ctx.assert(ids[0] === 'db', 'Обязательный пункт должен идти первым, получено: ' + ids.join(','));
ctx.assert(ids.indexOf('mobile') !== -1, 'В оставшиеся 15 минут влезает мобильная версия: ' + ids.join(','));
ctx.assert(ids.indexOf('anim') === -1, 'Анимации на 20 минут не влезают: ' + ids.join(','));`,
        points: 7,
      },
      {
        id: 'unfinished',
        name: 'Что не успели',
        type: 'assert',
        code: `const unfinished = ctx.get('unfinished');
const items = [
  { id: 'db', title: 'Доработка базы', minutes: 25, impact: 5 },
  { id: 'anim', title: 'Анимации', minutes: 20, impact: 2 },
  { id: 'mobile', title: 'Мобильная версия', minutes: 10, impact: 4 },
];
const rest = unfinished(items, 40).map((i) => i.id);
ctx.assert(rest.join(',') === 'anim', 'Не успели анимации, получено: ' + rest.join(','));
ctx.assert(unfinished(items, 200).length === 0, 'Когда времени много, не успеть нечего');`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Округление до двух знаков: Math.round(value * 100) / 100.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Сортировка с запасным условием: сначала по отдаче по убыванию, при равенстве — по времени по возрастанию.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'finalPlan: взять mustHave, посчитать потраченное, затем greedyPlan по остальным на оставшееся время и склеить.',
        penaltyPercent: 35,
      },
    ],
    solution: `function valuePerMinute(item) {
  return Math.round((item.impact / item.minutes) * 100) / 100;
}

function greedyPlan(items, minutes) {
  const sorted = items.slice().sort((a, b) => {
    const diff = valuePerMinute(b) - valuePerMinute(a);
    return diff !== 0 ? diff : a.minutes - b.minutes;
  });

  const planned = [];
  let used = 0;
  let total = 0;

  sorted.forEach((item) => {
    if (used + item.minutes <= minutes) {
      planned.push(item);
      used += item.minutes;
      total += item.impact;
    }
  });

  return { planned, total };
}

function mustHave(items) {
  return items.filter((item) => item.impact === 5);
}

function finalPlan(items, minutes) {
  const required = mustHave(items);
  const used = required.reduce((sum, item) => sum + item.minutes, 0);
  const rest = items.filter((item) => item.impact !== 5);

  return required.concat(greedyPlan(rest, minutes - used).planned);
}

function unfinished(items, minutes) {
  const planned = finalPlan(items, minutes).map((item) => item.id);
  return items.filter((item) => planned.indexOf(item.id) === -1);
}`,
    solutionExplanation:
      'Жадный выбор по отдаче за минуту — не универсальная истина, но на экзамене работает: за час важнее закрыть три дешёвых пункта, чем один дорогой. Обязательные пункты выведены из этой логики намеренно: доработка базы требуется прямым текстом, и пропустить её ради двух анимаций нельзя, какой бы выгодной ни казалась арифметика. Запасное условие при равной отдаче — брать более быстрый пункт — даёт результат раньше и оставляет пространство для манёвра, если что-то пойдёт не так.',
    maxScore: 32,
    estimatedMinutes: 35,
    examRefs: ['m3-db', 'm3-quality', 'm3-animations', 'm3-mobile'],
    planDays: ['day-26-1'],
    source: 'plan',
  },

  {
    id: 'task-run-journal',
    title: 'Журнал прогонов: записывать, чтобы видеть картину',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['js'],
    topicIds: ['exam-debrief'],
    monthNo: 7,
    weekNo: 26,
    statement: `Смотрим на картину целиком: какой модуль даётся тяжелее остальных и куда уходит время. Один прогон ничего не показывает, три подряд — показывают всё.

Запись прогона: \`{ date, domain, modules: { 1: минуты, 2: минуты, 3: минуты }, percent }\`.

1. \`totalMinutes(run)\` — сколько заняли все три модуля.
2. \`averageByModule(runs)\` — среднее время по каждому модулю: \`{ 1, 2, 3 }\`, округлённо. Пустой журнал даёт нули.
3. \`hardestModule(runs)\` — модуль, который в среднем занимает больше всего. При равенстве — меньший номер.
4. \`trend(runs)\` — сравнение последнего прогона с первым: \`{ minutes, percent }\`, где \`minutes\` — насколько сократилось время (положительное — стало быстрее), \`percent\` — насколько выросла доля закрытых требований. Меньше двух прогонов — \`null\`.
5. \`summary(runs)\` — строка вида \`'Прогонов: 3, тяжелее всего модуль 1, время сократилось на 35 мин'\`. Если трендa нет — \`'Прогонов: 1, тяжелее всего модуль 1'\`.`,
    requirements: [
      'Суммарное время прогона считается',
      'Средние по модулям считаются, пустой журнал не ломает',
      'Самый тяжёлый модуль определяется по среднему',
      'Тренд сравнивает последний прогон с первым',
      'Одного прогона недостаточно для тренда',
      'summary собирает строку по правилам',
    ],
    starterCode: `function totalMinutes(run) {
  // сумма по трём модулям
}

function averageByModule(runs) {
  // { 1, 2, 3 }
}

function hardestModule(runs) {
  // номер модуля
}

function trend(runs) {
  // { minutes, percent } или null
}

function summary(runs) {
  // строка вывода
}`,
    tests: [
      {
        id: 'total',
        name: 'Время прогона',
        type: 'assert',
        code: `const totalMinutes = ctx.get('totalMinutes');
const run = { date: '2027-03-01', domain: 'Конференции', modules: { 1: 180, 2: 120, 3: 60 }, percent: 70 };
ctx.assert(totalMinutes(run) === 360, 'Ожидалось 360, получено: ' + totalMinutes(run));`,
        points: 4,
      },
      {
        id: 'average',
        name: 'Средние по модулям',
        type: 'assert',
        code: `const averageByModule = ctx.get('averageByModule');
const runs = [
  { modules: { 1: 180, 2: 120, 3: 60 }, percent: 70 },
  { modules: { 1: 160, 2: 100, 3: 50 }, percent: 80 },
];
const avg = averageByModule(runs);
ctx.assert(avg[1] === 170, 'Среднее по первому модулю 170, получено: ' + avg[1]);
ctx.assert(avg[2] === 110, 'Среднее по второму 110, получено: ' + avg[2]);
ctx.assert(avg[3] === 55, 'Среднее по третьему 55, получено: ' + avg[3]);
const empty = averageByModule([]);
ctx.assert(empty[1] === 0 && empty[2] === 0 && empty[3] === 0, 'Пустой журнал должен давать нули, получено: ' + ctx.preview(empty));`,
        points: 6,
      },
      {
        id: 'hardest',
        name: 'Самый тяжёлый модуль',
        type: 'assert',
        code: `const hardestModule = ctx.get('hardestModule');
const runs = [{ modules: { 1: 100, 2: 150, 3: 60 }, percent: 70 }];
ctx.assert(hardestModule(runs) === 2, 'Ожидался второй модуль, получено: ' + hardestModule(runs));
const tie = [{ modules: { 1: 120, 2: 120, 3: 60 }, percent: 70 }];
ctx.assert(hardestModule(tie) === 1, 'При равенстве берётся меньший номер, получено: ' + hardestModule(tie));`,
        points: 5,
      },
      {
        id: 'trend',
        name: 'Тренд по журналу',
        type: 'assert',
        code: `const trend = ctx.get('trend');
const runs = [
  { modules: { 1: 200, 2: 130, 3: 70 }, percent: 60 },
  { modules: { 1: 180, 2: 120, 3: 60 }, percent: 70 },
  { modules: { 1: 170, 2: 110, 3: 50 }, percent: 85 },
];
const result = trend(runs);
ctx.assert(result.minutes === 70, 'Время сократилось на 70 минут, получено: ' + ctx.preview(result));
ctx.assert(result.percent === 25, 'Доля выросла на 25, получено: ' + ctx.preview(result));
ctx.assert(trend([runs[0]]) === null, 'Для одного прогона тренда нет');
ctx.assert(trend([]) === null, 'Для пустого журнала тренда нет');`,
        points: 6,
      },
      {
        id: 'summary',
        name: 'Сводка по журналу',
        type: 'assert',
        code: `const summary = ctx.get('summary');
const runs = [
  { modules: { 1: 200, 2: 130, 3: 70 }, percent: 60 },
  { modules: { 1: 170, 2: 110, 3: 50 }, percent: 85 },
];
const text = summary(runs);
ctx.assert(text.indexOf('Прогонов: 2') === 0, 'Сводка должна начинаться с количества, получено: ' + text);
ctx.assert(text.indexOf('модуль 1') !== -1, 'В сводке должен быть самый тяжёлый модуль: ' + text);
ctx.assert(text.indexOf('70 мин') !== -1, 'В сводке должно быть сокращение времени: ' + text);
const single = summary([runs[0]]);
ctx.assert(single.indexOf('сократилось') === -1, 'Для одного прогона о сокращении говорить нечего: ' + single);`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Среднее по модулю: сумма минут этого модуля по всем прогонам, делённая на количество прогонов.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Для тренда берите первый и последний элементы массива: runs[0] и runs[runs.length - 1].',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'return { minutes: totalMinutes(first) - totalMinutes(last), percent: last.percent - first.percent };',
        penaltyPercent: 35,
      },
    ],
    solution: `function totalMinutes(run) {
  return run.modules[1] + run.modules[2] + run.modules[3];
}

function averageByModule(runs) {
  const result = { 1: 0, 2: 0, 3: 0 };
  if (runs.length === 0) return result;

  [1, 2, 3].forEach((no) => {
    const sum = runs.reduce((total, run) => total + run.modules[no], 0);
    result[no] = Math.round(sum / runs.length);
  });

  return result;
}

function hardestModule(runs) {
  const average = averageByModule(runs);
  return [1, 2, 3].reduce((worst, no) => (average[no] > average[worst] ? no : worst), 1);
}

function trend(runs) {
  if (runs.length < 2) return null;

  const first = runs[0];
  const last = runs[runs.length - 1];

  return {
    minutes: totalMinutes(first) - totalMinutes(last),
    percent: last.percent - first.percent,
  };
}

function summary(runs) {
  const parts = ['Прогонов: ' + runs.length, 'тяжелее всего модуль ' + hardestModule(runs)];
  const change = trend(runs);

  if (change) {
    parts.push('время сократилось на ' + change.minutes + ' мин');
  }

  return parts.join(', ');
}`,
    solutionExplanation:
      'Журнал нужен потому, что память врёт. После тяжёлого прогона кажется, что всё плохо; после лёгкого — что всё готово. Три записи подряд показывают реальную картину: какой модуль стабильно съедает время и растёт ли доля закрытых требований. Тренд считается между первым и последним прогоном, а не соседними: разница между двумя соседними прогонами — это чаще всего настроение и удача с темой, а разница с началом месяца — уже результат.',
    maxScore: 27,
    estimatedMinutes: 30,
    examRefs: ['m3-quality'],
    planDays: ['day-26-2'],
    source: 'plan',
  },

  {
    id: 'task-compare-runs',
    title: 'Сравнение с прошлым прогоном по чек-листу',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['js'],
    topicIds: ['exam-debrief'],
    monthNo: 7,
    weekNo: 26,
    statement: `Главное сегодня — сравнить с прошлым прогоном: стало ли больше закрытых пунктов и меньше времени.

Прогон приходит как \`{ done: ['m1-db', …], minutes: 360 }\`.

1. \`gained(previous, current)\` — что закрыто теперь, но не было закрыто раньше, в порядке из \`current.done\`.
2. \`lost(previous, current)\` — что было закрыто раньше, а теперь нет. Это самое тревожное: значит, забывается.
3. \`kept(previous, current)\` — что закрыто в обоих.
4. \`verdict(previous, current)\` — строка:
   - если есть потери → \`'Регресс: '\` и потерянные через запятую;
   - иначе если закрытых стало больше и время меньше → \`'Прогресс'\`;
   - иначе если закрытых столько же и время меньше → \`'Быстрее'\`;
   - иначе → \`'Без изменений'\`.`,
    requirements: [
      'gained находит новые закрытые пункты',
      'lost находит потерянные пункты',
      'kept находит устойчивые пункты',
      'Потери важнее любых улучшений',
      'Различаются «Прогресс», «Быстрее» и «Без изменений»',
    ],
    starterCode: `function gained(previous, current) {
  // что появилось
}

function lost(previous, current) {
  // что пропало
}

function kept(previous, current) {
  // что держится
}

function verdict(previous, current) {
  // вывод
}`,
    tests: [
      {
        id: 'gained',
        name: 'Новые закрытые пункты',
        type: 'assert',
        code: `const gained = ctx.get('gained');
const previous = { done: ['m1-db', 'm1-login'], minutes: 380 };
const current = { done: ['m1-db', 'm1-login', 'm1-admin', 'm2-slider'], minutes: 350 };
const result = gained(previous, current);
ctx.assert(result.join(',') === 'm1-admin,m2-slider', 'Получено: ' + result.join(','));
ctx.assert(gained(current, previous).length === 0, 'Когда новых нет, список пуст');`,
        points: 5,
      },
      {
        id: 'lost',
        name: 'Потерянные пункты',
        type: 'assert',
        code: `const lost = ctx.get('lost');
const previous = { done: ['m1-db', 'm1-login', 'm2-slider'], minutes: 380 };
const current = { done: ['m1-db', 'm1-admin'], minutes: 350 };
const result = lost(previous, current);
ctx.assert(result.indexOf('m1-login') !== -1, 'Пункт m1-login потерян');
ctx.assert(result.indexOf('m2-slider') !== -1, 'Пункт m2-slider потерян');
ctx.assert(result.length === 2, 'Потерянных должно быть два, получено: ' + ctx.preview(result));`,
        points: 5,
      },
      {
        id: 'kept',
        name: 'Устойчивые пункты',
        type: 'assert',
        code: `const kept = ctx.get('kept');
const previous = { done: ['m1-db', 'm1-login'], minutes: 380 };
const current = { done: ['m1-db', 'm1-admin'], minutes: 350 };
ctx.assert(kept(previous, current).join(',') === 'm1-db', 'Получено: ' + kept(previous, current).join(','));`,
        points: 4,
      },
      {
        id: 'regress',
        name: 'Потери важнее улучшений',
        type: 'assert',
        code: `const verdict = ctx.get('verdict');
const previous = { done: ['m1-db', 'm1-login'], minutes: 380 };
const current = { done: ['m1-db', 'm1-admin', 'm2-slider'], minutes: 300 };
const text = verdict(previous, current);
ctx.assert(text.indexOf('Регресс:') === 0, 'Потеря пункта важнее двух новых и сэкономленного часа. Получено: ' + text);
ctx.assert(text.indexOf('m1-login') !== -1, 'В выводе должен быть потерянный пункт: ' + text);`,
        points: 6,
      },
      {
        id: 'progress',
        name: 'Прогресс, скорость и застой',
        type: 'assert',
        code: `const verdict = ctx.get('verdict');
const base = { done: ['m1-db'], minutes: 380 };
ctx.assert(
  verdict(base, { done: ['m1-db', 'm1-login'], minutes: 350 }) === 'Прогресс',
  'Больше пунктов и меньше времени — это прогресс',
);
ctx.assert(
  verdict(base, { done: ['m1-db'], minutes: 350 }) === 'Быстрее',
  'Столько же пунктов, но быстрее',
);
ctx.assert(
  verdict(base, { done: ['m1-db'], minutes: 400 }) === 'Без изменений',
  'Столько же пунктов и медленнее — изменений нет',
);`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Все три списка — обычные фильтры по вхождению в другой массив.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Порядок веток в verdict важен: сначала потери, и только потом всё остальное.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const missing = lost(previous, current); if (missing.length) return "Регресс: " + missing.join(", ");',
        penaltyPercent: 35,
      },
    ],
    solution: `function gained(previous, current) {
  return current.done.filter((id) => previous.done.indexOf(id) === -1);
}

function lost(previous, current) {
  return previous.done.filter((id) => current.done.indexOf(id) === -1);
}

function kept(previous, current) {
  return current.done.filter((id) => previous.done.indexOf(id) !== -1);
}

function verdict(previous, current) {
  const missing = lost(previous, current);

  if (missing.length > 0) {
    return 'Регресс: ' + missing.join(', ');
  }

  const faster = current.minutes < previous.minutes;
  const more = current.done.length > previous.done.length;

  if (more && faster) return 'Прогресс';
  if (!more && faster) return 'Быстрее';

  return 'Без изменений';
}`,
    solutionExplanation:
      'Потери проверяются первыми, и это главная мысль разбора. Пункт, который был закрыт в прошлый раз и не закрыт сейчас, означает, что тема не усвоена, а угадана: в прошлый прогон повезло, в этот нет. Такой пункт важнее двух новых и сэкономленного часа, потому что на экзамене повезти может в любую сторону. Всё остальное — обычная арифметика: больше закрытых и меньше времени это прогресс, столько же за меньшее время — рост скорости.',
    maxScore: 26,
    estimatedMinutes: 25,
    examRefs: ['m3-quality'],
    planDays: ['day-26-4'],
    source: 'plan',
  },

  {
    id: 'task-drill-forms',
    title: 'Тренировка по частям: форма с проверками за 15 минут',
    kind: 'app',
    runtime: 'react',
    difficulty: 3,
    tech: ['react'],
    topicIds: ['memory-training'],
    monthNo: 7,
    weekNo: 26,
    statement: `Тренируем не весь проект, а конкретный кусок из списка слабых мест. Сегодня — формы: за день получается пять-шесть повторений вместо одного прогона.

Компонент \`QuickForm\` принимает \`{ onSubmit }\`.

1. Три управляемых поля: \`name\` (минимум два слова), \`email\` (есть собака и точка после неё), \`phone\` (минимум 10 цифр).
2. Блоки ошибок \`#name-error\`, \`#email-error\`, \`#phone-error\`.
3. При ошибках \`onSubmit\` не вызывается.
4. При верных данных \`onSubmit\` получает объект с тремя полями, сообщения пусты, форма очищается.
5. Ввод в поле стирает его ошибку.

Цель — 15 минут. Засеките.`,
    requirements: [
      'Три управляемых поля с блоками ошибок',
      'Ошибки показываются рядом с полями',
      'Неверные данные не отправляются',
      'Верные данные вызывают onSubmit и очищают форму',
      'Ввод стирает ошибку поля',
    ],
    starterCode: `function QuickForm({ onSubmit }) {
  // три поля, проверки, сообщения рядом
}`,
    tests: [
      {
        id: 'fields',
        name: 'Поля и блоки ошибок',
        type: 'react',
        code: `return ctx.render('QuickForm', { onSubmit: () => {} }).then(() => {
  ['name', 'email', 'phone'].forEach((field) => {
    ctx.assert(ctx.$('input[name="' + field + '"]'), 'Нет поля ' + field);
    ctx.assert(ctx.$('#' + field + '-error'), 'Нет блока #' + field + '-error');
  });
});`,
        points: 4,
      },
      {
        id: 'errors',
        name: 'Ошибки рядом с полями',
        type: 'react',
        code: `let called = 0;
return ctx.render('QuickForm', { onSubmit: () => { called += 1; } })
  .then(() => ctx.change('input[name="name"]', 'Иванов'))
  .then(() => ctx.change('input[name="email"]', 'ivanov'))
  .then(() => ctx.change('input[name="phone"]', '+7 900'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(called === 0, 'При ошибках onSubmit вызываться не должен');
    ['name', 'email', 'phone'].forEach((field) => {
      ctx.assert(ctx.text('#' + field + '-error').length > 0, 'Нет сообщения в #' + field + '-error');
    });
  });`,
        points: 6,
      },
      {
        id: 'phone-digits',
        name: 'Телефон считается по цифрам',
        type: 'react',
        code: `return ctx.render('QuickForm', { onSubmit: () => {} })
  .then(() => ctx.change('input[name="phone"]', '+7 (900) 123-45-67'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(ctx.text('#phone-error') === '', 'Телефон с разделителями должен проходить: ' + ctx.text('#phone-error'));
  });`,
        points: 5,
      },
      {
        id: 'success',
        name: 'Верные данные отправляются',
        type: 'react',
        code: `const calls = [];
return ctx.render('QuickForm', { onSubmit: (data) => calls.push(data) })
  .then(() => ctx.change('input[name="name"]', 'Иванов Илья'))
  .then(() => ctx.change('input[name="email"]', 'ivanov@example.com'))
  .then(() => ctx.change('input[name="phone"]', '+7 900 123-45-67'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(calls.length === 1, 'onSubmit должен вызваться один раз, вызовов: ' + calls.length);
    ctx.assert(calls[0].name === 'Иванов Илья', 'Передано неверное имя: ' + ctx.preview(calls[0]));
    ctx.assert(ctx.$('input[name="name"]').value === '', 'После отправки форма должна очиститься');
  });`,
        points: 6,
      },
      {
        id: 'clear-on-type',
        name: 'Ввод стирает ошибку',
        type: 'react',
        code: `return ctx.render('QuickForm', { onSubmit: () => {} })
  .then(() => ctx.change('input[name="email"]', 'ivanov'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(ctx.text('#email-error').length > 0, 'Ошибка должна была появиться');
    return ctx.change('input[name="email"]', 'ivanov@example.com');
  })
  .then(() => {
    ctx.assert(ctx.text('#email-error') === '', 'После правки сообщение должно исчезнуть');
  });`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Одно состояние-объект на значения, второе — на ошибки. Оба с одинаковыми ключами.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Проверки удобно собрать в отдельной функции validate(values), возвращающей объект сообщений.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Телефон: values.phone.replace(/\\D/g, "").length >= 10. Имя: values.name.trim().split(/\\s+/).length >= 2.',
        penaltyPercent: 35,
      },
    ],
    solution: `const EMPTY = { name: '', email: '', phone: '' };

function validate(values) {
  return {
    name: values.name.trim().split(/\\s+/).filter(Boolean).length >= 2 ? '' : 'Укажите фамилию и имя',
    email: /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(values.email) ? '' : 'Проверьте адрес',
    phone: values.phone.replace(/\\D/g, '').length >= 10 ? '' : 'Минимум 10 цифр',
  };
}

function QuickForm({ onSubmit }) {
  const [values, setValues] = React.useState(EMPTY);
  const [errors, setErrors] = React.useState(EMPTY);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const next = validate(values);
    setErrors(next);

    if (Object.keys(next).some((key) => next[key])) return;

    onSubmit(values);
    setValues(EMPTY);
  };

  return (
    <form onSubmit={handleSubmit}>
      {['name', 'email', 'phone'].map((field) => (
        <div key={field}>
          <label htmlFor={field}>{field}</label>
          <input id={field} name={field} value={values[field]} onChange={handleChange} />
          <p id={field + '-error'}>{errors[field]}</p>
        </div>
      ))}
      <button type="submit">Отправить</button>
    </form>
  );
}`,
    solutionExplanation:
      'Пятнадцать минут на такую форму получаются только тогда, когда каждая её часть пишется без раздумий: объект значений, объект ошибок с теми же ключами, один обработчик изменения, одна функция проверки. Поля выведены через map по списку имён — три почти одинаковых блока разметки сжались в один, и ошибиться в name уже невозможно. Очистка формы после успешной отправки не забыта намеренно: без неё пользователь отправит те же данные второй раз.',
    maxScore: 26,
    estimatedMinutes: 15,
    timeLimitMs: 900_000,
    examRefs: ['m1-register', 'm2-register-hints'],
    planDays: ['day-26-5'],
    source: 'plan',
  },

  {
    id: 'task-drill-sql-aggregate',
    title: 'Тренировка по частям: агрегаты и группировка',
    kind: 'db',
    runtime: 'sql',
    difficulty: 4,
    tech: ['sql'],
    topicIds: ['memory-training'],
    monthNo: 7,
    weekNo: 26,
    statement: `Второй день тренировок по частям. Тему, которая вчера не пошла, берём первой, пока голова свежая. Сегодня — агрегаты: их забывают чаще, чем обычные выборки.

База готова: \`users\`, \`rooms\`, \`applications\`, \`reviews\`.

1. Сколько заявок по каждому статусу: \`status\`, \`total\`, по убыванию количества, затем по статусу.
2. Помещения с двумя и более заявками: \`title\`, \`total\`. Отбор по количеству — через \`HAVING\`.
3. Средняя оценка по каждому помещению, только там, где отзывы есть: \`title\`, \`avg_rating\` (округлить до одного знака), по убыванию оценки.
4. Пользователь с наибольшим числом заявок: \`login\`, \`total\`, одна строка.
5. Общая сводка одной строкой: \`users_count\`, \`applications_count\`, \`reviews_count\`.

Второй пункт — то самое место, где путают \`WHERE\` и \`HAVING\`: первый отбирает строки до группировки, второй — группы после.`,
    requirements: [
      'Подсчёт по статусам с двойной сортировкой',
      'Отбор групп через HAVING',
      'Среднее с округлением только по помещениям с отзывами',
      'Лидер по количеству заявок',
      'Сводка одной строкой',
    ],
    setupSql: `
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  login TEXT NOT NULL UNIQUE
);

CREATE TABLE rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL UNIQUE
);

CREATE TABLE applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  room_id INTEGER NOT NULL REFERENCES rooms(id),
  status TEXT NOT NULL
);

CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL UNIQUE REFERENCES applications(id),
  rating INTEGER NOT NULL
);

INSERT INTO users (id, login) VALUES (1, 'ivanov26'), (2, 'petrov26');

INSERT INTO rooms (id, title) VALUES (1, 'Аудитория'), (2, 'Коворкинг'), (3, 'Кинозал');

INSERT INTO applications (id, user_id, room_id, status) VALUES
  (1, 1, 1, 'Новая'),
  (2, 1, 1, 'Мероприятие завершено'),
  (3, 1, 2, 'Новая'),
  (4, 2, 2, 'Новая'),
  (5, 2, 3, 'Мероприятие завершено');

INSERT INTO reviews (application_id, rating) VALUES (2, 5), (5, 4);
`,
    starterCode: `-- 1. Заявки по статусам


-- 2. Помещения с двумя и более заявками


-- 3. Средняя оценка по помещениям


-- 4. Лидер по количеству заявок


-- 5. Общая сводка

`,
    tests: [
      {
        id: 'by-status',
        name: 'Заявки по статусам',
        type: 'sql-query',
        check: `SELECT status, COUNT(*) AS total FROM applications GROUP BY status ORDER BY total DESC, status`,
        expectedColumns: ['status', 'total'],
        expectedRows: [
          ['Новая', 3],
          ['Мероприятие завершено', 2],
        ],
        ordered: true,
        points: 5,
      },
      {
        id: 'having',
        name: 'Помещения с двумя и более заявками',
        type: 'sql-query',
        check: `SELECT r.title, COUNT(a.id) AS total FROM rooms r JOIN applications a ON a.room_id = r.id GROUP BY r.id, r.title HAVING COUNT(a.id) >= 2 ORDER BY r.title`,
        expectedColumns: ['title', 'total'],
        expectedRows: [
          ['Аудитория', 2],
          ['Коворкинг', 2],
        ],
        ordered: true,
        points: 6,
      },
      {
        id: 'avg-rating',
        name: 'Средняя оценка по помещениям',
        type: 'sql-query',
        check: `SELECT r.title, ROUND(AVG(v.rating), 1) AS avg_rating FROM rooms r JOIN applications a ON a.room_id = r.id JOIN reviews v ON v.application_id = a.id GROUP BY r.id, r.title ORDER BY avg_rating DESC`,
        expectedColumns: ['title', 'avg_rating'],
        expectedRows: [
          ['Аудитория', 5.0],
          ['Кинозал', 4.0],
        ],
        ordered: true,
        points: 6,
      },
      {
        id: 'leader',
        name: 'Лидер по заявкам',
        type: 'sql-query',
        check: `SELECT u.login, COUNT(a.id) AS total FROM users u JOIN applications a ON a.user_id = u.id GROUP BY u.id, u.login ORDER BY total DESC, u.login LIMIT 1`,
        expectedColumns: ['login', 'total'],
        expectedRows: [['ivanov26', 3]],
        points: 5,
      },
      {
        id: 'summary',
        name: 'Общая сводка',
        type: 'sql-query',
        check: `SELECT (SELECT COUNT(*) FROM users) AS users_count, (SELECT COUNT(*) FROM applications) AS applications_count, (SELECT COUNT(*) FROM reviews) AS reviews_count`,
        expectedColumns: ['users_count', 'applications_count', 'reviews_count'],
        expectedRows: [[2, 5, 2]],
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'В GROUP BY перечисляют все столбцы, которые выводятся без агрегата. Обычно это id и название.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'WHERE отбирает строки до группировки, HAVING — уже готовые группы. Условие на COUNT возможно только в HAVING.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Для сводки одной строкой удобны подзапросы: SELECT (SELECT COUNT(*) FROM users) AS users_count, …',
        penaltyPercent: 35,
      },
    ],
    solution: `SELECT status, COUNT(*) AS total
FROM applications
GROUP BY status
ORDER BY total DESC, status;

SELECT r.title, COUNT(a.id) AS total
FROM rooms r
JOIN applications a ON a.room_id = r.id
GROUP BY r.id, r.title
HAVING COUNT(a.id) >= 2
ORDER BY r.title;

SELECT r.title, ROUND(AVG(v.rating), 1) AS avg_rating
FROM rooms r
JOIN applications a ON a.room_id = r.id
JOIN reviews v ON v.application_id = a.id
GROUP BY r.id, r.title
ORDER BY avg_rating DESC;

SELECT u.login, COUNT(a.id) AS total
FROM users u
JOIN applications a ON a.user_id = u.id
GROUP BY u.id, u.login
ORDER BY total DESC, u.login
LIMIT 1;

SELECT
  (SELECT COUNT(*) FROM users) AS users_count,
  (SELECT COUNT(*) FROM applications) AS applications_count,
  (SELECT COUNT(*) FROM reviews) AS reviews_count;`,
    solutionExplanation:
      'Разница между WHERE и HAVING становится очевидной, если помнить порядок выполнения запроса: сначала берутся строки, потом применяется WHERE, потом они группируются, и только после этого работает HAVING. Поэтому условие «в группе не меньше двух строк» в WHERE написать физически нельзя — групп на тот момент ещё нет. В третьем запросе обычный JOIN выбран сознательно: нужны только помещения с отзывами, и строки без них должны отпасть сами.',
    maxScore: 27,
    estimatedMinutes: 30,
    examRefs: ['m1-admin', 'm1-db', 'm3-db'],
    planDays: ['day-26-6'],
    source: 'plan',
  },

  {
    id: 'task-hotel-module1',
    title: 'Прогон на новой теме: гостиница, первый модуль',
    kind: 'db',
    runtime: 'sql',
    difficulty: 5,
    tech: ['sql'],
    topicIds: ['exam-strategy'],
    monthNo: 7,
    weekNo: 27,
    statement: `Начинается режим двух прогонов в неделю. Тема — **гостиница**. Здесь проверяемая часть первого модуля: база с данными и три запроса, на которых держится весь интерфейс.

1. \`guests\` — \`id\`, \`passport\` (текст, обязательный, уникальный), \`full_name\` (обязательный), \`phone\` (обязательный).
2. \`rooms\` — \`id\`, \`number\` (текст, обязательный, уникальный), \`kind\` (обязательный), \`price_per_night\` (дробное с копейками, обязательное).
3. \`stays\` — проживания: \`id\`, \`guest_id\`, \`room_id\` (обязательные внешние ключи), \`check_in\` и \`check_out\` (обязательные даты), \`status\` (по умолчанию \`'Забронировано'\`, ограничен списком \`'Забронировано'\`, \`'Заселён'\`, \`'Выехал'\`).
4. **Правило темы**: один номер нельзя забронировать на ту же дату заезда дважды — ограничение уникальности по номеру и дате заезда.
5. Заполните: три номера, два гостя, три проживания.
6. Запрос: свободные номера — те, у которых нет проживаний со статусом \`'Забронировано'\` или \`'Заселён'\`. Столбец \`number\`, по возрастанию.`,
    requirements: [
      'Три таблицы со связями',
      'Номер паспорта и номер комнаты уникальны',
      'Статус ограничен списком',
      'Один номер нельзя забронировать дважды на ту же дату',
      'Данные заполнены',
      'Запрос находит свободные номера',
    ],
    starterCode: `-- Гостиница: первый модуль

`,
    tests: [
      {
        id: 'rooms',
        name: 'Таблица номеров',
        type: 'sql-schema',
        table: 'rooms',
        columns: [
          { name: 'id', pk: true },
          { name: 'number', notNull: true },
          { name: 'kind', notNull: true },
          { name: 'price_per_night', notNull: true },
        ],
        points: 4,
      },
      {
        id: 'stays',
        name: 'Проживания связаны с гостем и номером',
        type: 'sql-schema',
        table: 'stays',
        columns: [
          { name: 'id', pk: true },
          { name: 'guest_id', notNull: true },
          { name: 'room_id', notNull: true },
          { name: 'check_in', notNull: true },
          { name: 'check_out', notNull: true },
          { name: 'status', notNull: true },
        ],
        foreignKeys: [
          { column: 'guest_id', refTable: 'guests' },
          { column: 'room_id', refTable: 'rooms' },
        ],
        points: 5,
      },
      {
        id: 'status-check',
        name: 'Статус ограничен списком',
        type: 'sql-query',
        check: `SELECT CASE WHEN instr(upper(sql), 'CHECK') > 0 AND instr(sql, 'Заселён') > 0 AND instr(sql, 'Выехал') > 0 THEN 1 ELSE 0 END FROM sqlite_master WHERE type = 'table' AND name = 'stays'`,
        expectedRows: [[1]],
        points: 5,
      },
      {
        id: 'unique-booking',
        name: 'Двойная бронь невозможна',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM pragma_index_list('stays') WHERE "unique" = 1`,
        expectedRows: [[1]],
        points: 6,
      },
      {
        id: 'data',
        name: 'Данные заполнены',
        type: 'sql-query',
        check: `SELECT (SELECT COUNT(*) FROM rooms), (SELECT COUNT(*) FROM guests), (SELECT COUNT(*) FROM stays s JOIN rooms r ON r.id = s.room_id JOIN guests g ON g.id = s.guest_id)`,
        expectedRows: [[3, 2, 3]],
        points: 5,
      },
      {
        id: 'free-rooms',
        name: 'Свободные номера находятся',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM rooms r WHERE r.id NOT IN (SELECT room_id FROM stays WHERE status IN ('Забронировано', 'Заселён'))`,
        expectedRows: [[1]],
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Скелет прежний: люди, справочник ресурса, записи. Новое — вторая дата и правило двойной брони.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Чтобы свободный номер нашёлся, сделайте три проживания на два номера, причём одно со статусом «Выехал».',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'SELECT r.number FROM rooms r WHERE r.id NOT IN (SELECT room_id FROM stays WHERE status IN («Забронировано», «Заселён»)) ORDER BY r.number; — кавычки в SQL обычные одинарные.',
        penaltyPercent: 35,
      },
    ],
    solution: `CREATE TABLE guests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  passport VARCHAR(20) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL
);

CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  number VARCHAR(10) NOT NULL UNIQUE,
  kind VARCHAR(50) NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL
);

CREATE TABLE stays (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guest_id INT NOT NULL,
  room_id INT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Забронировано'
    CHECK (status IN ('Забронировано', 'Заселён', 'Выехал')),
  UNIQUE (room_id, check_in),
  FOREIGN KEY (guest_id) REFERENCES guests(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

INSERT INTO rooms (id, number, kind, price_per_night) VALUES
  (1, '101', 'Одноместный', 3500.00),
  (2, '102', 'Двухместный', 5200.50),
  (3, '201', 'Люкс', 9800.00);

INSERT INTO guests (id, passport, full_name, phone) VALUES
  (1, '4510 123456', 'Иванов Иван Иванович', '+79990000001'),
  (2, '4511 654321', 'Петрова Полина Петровна', '+79990000002');

INSERT INTO stays (guest_id, room_id, check_in, check_out, status) VALUES
  (1, 1, '2027-03-12', '2027-03-15', 'Забронировано'),
  (2, 2, '2027-03-14', '2027-03-18', 'Заселён'),
  (1, 2, '2027-02-01', '2027-02-05', 'Выехал');

SELECT r.number
FROM rooms r
WHERE r.id NOT IN (SELECT room_id FROM stays WHERE status IN ('Забронировано', 'Заселён'))
ORDER BY r.number;`,
    solutionExplanation:
      'Запрос на свободные номера написан через NOT IN с подзапросом, и это самый читаемый вариант: «номера, которых нет среди занятых». Обратите внимание, что статус «Выехал» в подзапрос не входит — номер после выезда снова свободен, и третье проживание в данных добавлено именно чтобы это проверить. Ограничение уникальности по паре «номер и дата заезда» — правило этой темы: одну и ту же комнату нельзя продать дважды на одну ночь, и надёжнее запретить это в базе, чем надеяться на проверку в коде.',
    maxScore: 31,
    estimatedMinutes: 45,
    examRefs: ['m1-db', 'm1-er', 'm1-order'],
    planDays: ['day-27-1'],
    source: 'plan',
  },

  {
    id: 'task-drill-api-handlers',
    title: 'Тренировка слабых мест: обработчики за 20 минут',
    kind: 'api',
    runtime: 'js',
    difficulty: 4,
    tech: ['express', 'node'],
    topicIds: ['memory-training'],
    monthNo: 7,
    weekNo: 27,
    statement: `День между двумя прогонами — на исправление найденного, а не на новый прогон. Тренируем обработчики: коды ответов и порядок проверок.

\`repo\` — объект с методами \`findById(id)\`, \`create(data)\`, \`update(id, data)\`, все возвращают промисы.

Напишите \`crud(repo)\` — объект с тремя обработчиками.

1. \`get(req, res)\` — берёт \`req.params.id\`; заявки нет → \`404\` и \`{ error: 'Не найдено' }\`; иначе сама заявка.
2. \`post(req, res)\` — нет \`req.user\` → \`401\`; нет \`req.body.title\` → \`400\` и \`{ error: 'Укажите название' }\`; иначе \`201\` и созданный объект.
3. \`patch(req, res)\` — нет \`req.user\` → \`401\`; заявки нет → \`404\`; заявка чужая (\`userId\` не совпадает) → \`403\` и \`{ error: 'Нет доступа' }\`; иначе обновляет и отвечает обновлённым объектом.

Все три оборачивают работу с хранилищем в try/catch и при ошибке отвечают \`500\` и \`{ error: 'Ошибка сервера' }\`.`,
    requirements: [
      'get отвечает 404 для отсутствующей записи',
      'post проверяет вход и обязательные поля',
      'Созданный объект отвечает кодом 201',
      'patch проверяет принадлежность записи',
      'Порядок проверок: вход, наличие, доступ',
      'Ошибка хранилища превращается в 500',
    ],
    starterCode: `function crud(repo) {
  return {
    async get(req, res) {
      // ваш код
    },
    async post(req, res) {
      // ваш код
    },
    async patch(req, res) {
      // ваш код
    },
  };
}`,
    tests: [
      {
        id: 'get',
        name: 'Чтение записи',
        type: 'assert',
        code: `const crud = ctx.get('crud');
const make = () => { const s = { code: 200, body: null }; s.res = { status: (c) => { s.code = c; return s.res; }, json: (b) => { s.body = b; return s.res; } }; return s; };
const found = make();
const missing = make();
const api = crud({ findById: (id) => Promise.resolve(String(id) === '1' ? { id: 1, title: 'Заявка' } : null) });
return Promise.all([
  api.get({ params: { id: '1' } }, found.res),
  api.get({ params: { id: '99' } }, missing.res),
]).then(function () {
  ctx.assert(found.body && found.body.id === 1, 'Найденная запись должна вернуться: ' + ctx.preview(found.body));
  ctx.assert(missing.code === 404, 'Для отсутствующей записи нужен 404, сейчас: ' + missing.code);
});`,
        points: 5,
      },
      {
        id: 'post',
        name: 'Создание записи',
        type: 'assert',
        code: `const crud = ctx.get('crud');
const make = () => { const s = { code: 200, body: null }; s.res = { status: (c) => { s.code = c; return s.res; }, json: (b) => { s.body = b; return s.res; } }; return s; };
const api = crud({ create: (data) => Promise.resolve({ id: 10, title: data.title }) });
const guest = make();
const empty = make();
const ok = make();
return Promise.all([
  api.post({ body: { title: 'Новая' } }, guest.res),
  api.post({ user: { id: 1 }, body: {} }, empty.res),
  api.post({ user: { id: 1 }, body: { title: 'Новая' } }, ok.res),
]).then(function () {
  ctx.assert(guest.code === 401, 'Без входа — 401, сейчас: ' + guest.code);
  ctx.assert(empty.code === 400 && empty.body.error === 'Укажите название', 'Пустое название: ' + empty.code + ' ' + ctx.preview(empty.body));
  ctx.assert(ok.code === 201 && ok.body.id === 10, 'Создание: ' + ok.code + ' ' + ctx.preview(ok.body));
});`,
        points: 6,
      },
      {
        id: 'patch-order',
        name: 'Порядок проверок при обновлении',
        type: 'assert',
        code: `const crud = ctx.get('crud');
const make = () => { const s = { code: 200, body: null }; s.res = { status: (c) => { s.code = c; return s.res; }, json: (b) => { s.body = b; return s.res; } }; return s; };
const repo = {
  findById: (id) => Promise.resolve(String(id) === '1' ? { id: 1, userId: 42, title: 'Чужая' } : null),
  update: (id, data) => Promise.resolve({ id: 1, userId: 42, title: data.title }),
};
const api = crud(repo);
const guest = make();
const missing = make();
const foreign = make();
return Promise.all([
  api.patch({ params: { id: '1' }, body: { title: 'x' } }, guest.res),
  api.patch({ user: { id: 42 }, params: { id: '99' }, body: { title: 'x' } }, missing.res),
  api.patch({ user: { id: 7 }, params: { id: '1' }, body: { title: 'x' } }, foreign.res),
]).then(function () {
  ctx.assert(guest.code === 401, 'Без входа — 401, сейчас: ' + guest.code);
  ctx.assert(missing.code === 404, 'Отсутствующая запись — 404, сейчас: ' + missing.code);
  ctx.assert(foreign.code === 403 && foreign.body.error === 'Нет доступа', 'Чужая запись: ' + foreign.code + ' ' + ctx.preview(foreign.body));
});`,
        points: 7,
      },
      {
        id: 'patch-ok',
        name: 'Своя запись обновляется',
        type: 'assert',
        code: `const crud = ctx.get('crud');
const repo = {
  findById: () => Promise.resolve({ id: 1, userId: 5, title: 'Старое' }),
  update: (id, data) => Promise.resolve({ id: 1, userId: 5, title: data.title }),
};
let code = 200;
let body = null;
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return crud(repo).patch({ user: { id: 5 }, params: { id: '1' }, body: { title: 'Новое' } }, res).then(function () {
  ctx.assert(code === 200, 'Успешное обновление отвечает кодом 200, сейчас: ' + code);
  ctx.assert(body && body.title === 'Новое', 'Должен вернуться обновлённый объект: ' + ctx.preview(body));
});`,
        points: 5,
      },
      {
        id: 'errors',
        name: 'Ошибка хранилища превращается в 500',
        type: 'assert',
        code: `const crud = ctx.get('crud');
const api = crud({ findById: () => Promise.reject(new Error('соединение потеряно')) });
let code = 200;
let body = null;
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return api.get({ params: { id: '1' } }, res).then(function () {
  ctx.assert(code === 500, 'Ожидался код 500, сейчас: ' + code);
  ctx.assert(body && body.error === 'Ошибка сервера', 'Текст ошибки: ' + ctx.preview(body));
  ctx.assert(JSON.stringify(body).indexOf('соединение потеряно') === -1, 'Подробности наружу не отдают');
});`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Порядок один и тот же во всех обработчиках: вход → наличие → доступ → действие.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Каждая проверка заканчивается return, иначе сервер попробует ответить дважды.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'if (!req.user) return res.status(401).json({ error: "Требуется вход" }); const item = await repo.findById(req.params.id); if (!item) return res.status(404)…',
        penaltyPercent: 35,
      },
    ],
    solution: `function crud(repo) {
  return {
    async get(req, res) {
      try {
        const item = await repo.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Не найдено' });
        return res.json(item);
      } catch (error) {
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
    },

    async post(req, res) {
      if (!req.user) return res.status(401).json({ error: 'Требуется вход' });

      const title = (req.body || {}).title;
      if (!title) return res.status(400).json({ error: 'Укажите название' });

      try {
        const created = await repo.create({ title, userId: req.user.id });
        return res.status(201).json(created);
      } catch (error) {
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
    },

    async patch(req, res) {
      if (!req.user) return res.status(401).json({ error: 'Требуется вход' });

      try {
        const item = await repo.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Не найдено' });
        if (item.userId !== req.user.id) return res.status(403).json({ error: 'Нет доступа' });

        const updated = await repo.update(req.params.id, req.body || {});
        return res.json(updated);
      } catch (error) {
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
    },
  };
}`,
    solutionExplanation:
      'Порядок проверок одинаков во всех трёх обработчиках, и это делает их предсказуемыми: вход, наличие, доступ, действие. Каждый шаг отвечает своим кодом, и по коду сразу понятно, что случилось: 401 — я не знаю, кто вы; 404 — такого объекта нет; 403 — объект есть, но не ваш. Проверка принадлежности идёт после проверки наличия не случайно: сравнивать userId у несуществующего объекта не с чем, и порядок наоборот уронил бы обработчик.',
    maxScore: 29,
    estimatedMinutes: 20,
    timeLimitMs: 1_200_000,
    examRefs: ['m1-cabinet', 'm1-admin', 'm3-quality'],
    planDays: ['day-27-3'],
    source: 'plan',
  },

  {
    id: 'task-hotel-module2',
    title: 'Второй прогон недели: гостиница, интерфейс',
    kind: 'app',
    runtime: 'react',
    difficulty: 5,
    tech: ['react'],
    topicIds: ['exam-strategy'],
    monthNo: 7,
    weekNo: 27,
    statement: `Проверяем, сработала ли вчерашняя работа над ошибками. Та же гостиница, теперь интерфейс: требования второго модуля на новой теме.

Компонент \`HotelAdmin\` принимает \`{ stays, onChangeStatus }\`, где \`stays\` — массив \`{ id, guest, room, checkIn, checkOut, status }\` (даты в \`ГГГГ-ММ-ДД\`).

1. Таблица \`#stays\`: обе даты выводятся в формате **ДД.ММ.ГГГГ**.
2. Фильтр \`#filter\` по статусу («Забронировано», «Заселён», «Выехал»), счётчик \`#count\` по отфильтрованному списку.
3. Сортировка по дате заезда: кнопка \`#sort-checkin\`, первый клик по возрастанию, второй по убыванию.
4. Смена статуса выпадающим списком \`select.status\` — обновление строки на месте, при отказе сервера возврат к прежнему.
5. Число ночей \`.nights\` в каждой строке: разница между выездом и заездом в днях.`,
    requirements: [
      'Обе даты выводятся в формате ДД.ММ.ГГГГ',
      'Фильтр и счётчик работают',
      'Сортировка по дате заезда переключает направление',
      'Смена статуса обновляет строку',
      'Отказ сервера возвращает прежний статус',
      'Число ночей считается верно',
    ],
    starterCode: `const STATUSES = ['Забронировано', 'Заселён', 'Выехал'];

function HotelAdmin({ stays, onChangeStatus }) {
  // таблица, фильтр, сортировка, смена статуса, число ночей
}`,
    tests: [
      {
        id: 'dates',
        name: 'Даты и число ночей',
        type: 'react',
        code: `const stays = [
  { id: 1, guest: 'Иванов', room: '101', checkIn: '2027-03-12', checkOut: '2027-03-15', status: 'Забронировано' },
  { id: 2, guest: 'Петрова', room: '102', checkIn: '2027-02-05', checkOut: '2027-02-09', status: 'Выехал' },
];
return ctx.render('HotelAdmin', { stays, onChangeStatus: () => Promise.resolve() })
  .then(() => ctx.change('#filter', ''))
  .then(() => {
    const text = ctx.text();
    ctx.assert(text.indexOf('12.03.2027') !== -1, 'Дата заезда должна быть в формате ДД.ММ.ГГГГ, сейчас: ' + text.slice(0, 140));
    ctx.assert(text.indexOf('15.03.2027') !== -1, 'Дата выезда должна быть в формате ДД.ММ.ГГГГ');
    ctx.assert(!/\\d{4}-\\d{2}-\\d{2}/.test(text), 'Машинный формат даты показывать не нужно');
    const nights = ctx.$('.nights');
    ctx.assert(nights, 'Нет элемента .nights');
    ctx.assert(nights.textContent.indexOf('3') !== -1, 'Ночей должно быть три, сейчас: ' + nights.textContent);
  });`,
        points: 7,
      },
      {
        id: 'filter',
        name: 'Фильтр и счётчик',
        type: 'react',
        // Компонент между проверками не пересоздаётся, поэтому статус
        // для фильтра берём из того, что сейчас на экране.
        code: `const stays = [
  { id: 1, guest: 'Иванов', room: '101', checkIn: '2027-03-12', checkOut: '2027-03-15', status: 'Забронировано' },
  { id: 2, guest: 'Петрова', room: '102', checkIn: '2027-03-14', checkOut: '2027-03-18', status: 'Выехал' },
];
let target = '';
return ctx.render('HotelAdmin', { stays, onChangeStatus: () => Promise.resolve() })
  .then(() => ctx.change('#filter', ''))
  .then(() => {
    const statuses = ctx.$$('select.status').map((select) => select.value);
    ctx.assert(statuses.length >= 1, 'В таблице должны быть строки');
    target = statuses[0];
    const expected = statuses.filter((status) => status === target).length;
    return ctx.change('#filter', target).then(() => expected);
  })
  .then((expected) => {
    const rows = ctx.$$('tbody tr');
    ctx.assert(rows.length === expected, 'После фильтра «' + target + '» ожидалось строк: ' + expected + ', найдено: ' + rows.length);
    rows.forEach((row) => {
      ctx.assert(row.textContent.indexOf(target) !== -1, 'В отфильтрованной таблице чужой статус: ' + row.textContent);
    });
    ctx.assert(ctx.text('#count').indexOf(String(expected)) !== -1, 'Счётчик: ' + ctx.text('#count'));
  });`,
        points: 6,
      },
      {
        id: 'sort',
        name: 'Сортировка по дате заезда',
        type: 'react',
        code: `const stays = [
  { id: 1, guest: 'А', room: '101', checkIn: '2027-04-19', checkOut: '2027-04-21', status: 'Забронировано' },
  { id: 2, guest: 'Б', room: '102', checkIn: '2027-02-05', checkOut: '2027-02-08', status: 'Забронировано' },
];
return ctx.render('HotelAdmin', { stays, onChangeStatus: () => Promise.resolve() })
  .then(() => ctx.change('#filter', ''))
  .then(() => ctx.click('#sort-checkin'))
  .then(() => {
    const iso = (date) => date.split('.').reverse().join('-');
    const read = () => ctx.$$('tbody tr').map((row) => iso(row.textContent.match(/\\d{2}\\.\\d{2}\\.\\d{4}/)[0]));
    const first = read();
    ctx.assert(first.length >= 2, 'Нужно минимум две строки');
    const ascending = first.slice().sort();
    ctx.assert(first.join(',') === ascending.join(','), 'Первый клик — по возрастанию, получено: ' + first.join(', '));
    return ctx.click('#sort-checkin').then(() => {
      ctx.assert(
        read().join(',') === ascending.slice().reverse().join(','),
        'Второй клик — по убыванию, получено: ' + read().join(', '),
      );
    });
  });`,
        points: 7,
      },
      {
        id: 'status',
        name: 'Смена статуса',
        type: 'react',
        code: `const stays = [{ id: 1, guest: 'Иванов', room: '101', checkIn: '2027-03-12', checkOut: '2027-03-15', status: 'Забронировано' }];
const calls = [];
return ctx.render('HotelAdmin', { stays, onChangeStatus: (id, status) => { calls.push({ id, status }); return Promise.resolve(); } })
  .then(() => ctx.change('#filter', ''))
  .then(() => ctx.change('select.status', 'Заселён'))
  .then(() => ctx.advanceTime(50))
  .then(() => {
    ctx.assert(calls.length === 1, 'onChangeStatus должен вызваться один раз, вызовов: ' + calls.length);
    ctx.assert(ctx.$('select.status').value === 'Заселён', 'Строка должна показать новый статус');
  });`,
        points: 6,
      },
      {
        id: 'rollback',
        name: 'Отказ возвращает прежний статус',
        type: 'react',
        code: `const stays = [{ id: 2, guest: 'Петрова', room: '102', checkIn: '2027-03-14', checkOut: '2027-03-18', status: 'Забронировано' }];
let before = '';
return ctx.render('HotelAdmin', { stays, onChangeStatus: () => Promise.reject(new Error('отказ')) })
  .then(() => ctx.change('#filter', ''))
  .then(() => {
    before = ctx.$('select.status').value;
    const target = ['Забронировано', 'Заселён', 'Выехал'].filter((status) => status !== before)[0];
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
        text: 'Число ночей: разница дат в миллисекундах, делённая на 86 400 000. Обе даты в формате ГГГГ-ММ-ДД разбирает new Date без сюрпризов.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Порядок вычислений тот же, что всегда: фильтр, сортировка, вывод. Смена статуса меняет состояние, а не проп.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const nights = Math.round((new Date(stay.checkOut) - new Date(stay.checkIn)) / 86400000);',
        penaltyPercent: 35,
      },
    ],
    solution: `const STATUSES = ['Забронировано', 'Заселён', 'Выехал'];

function HotelAdmin({ stays, onChangeStatus }) {
  const [items, setItems] = React.useState(stays);
  const [filter, setFilter] = React.useState('');
  const [direction, setDirection] = React.useState(null);

  const toRuDate = (iso) => iso.split('-').reverse().join('.');
  const nightsOf = (stay) => Math.round((new Date(stay.checkOut) - new Date(stay.checkIn)) / 86400000);

  const update = (id, status) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const changeStatus = (item, status) => {
    const previous = item.status;
    update(item.id, status);
    onChangeStatus(item.id, status).catch(() => update(item.id, previous));
  };

  const filtered = items.filter((item) => !filter || item.status === filter);

  const visible = direction
    ? filtered.slice().sort((a, b) => {
        const result = a.checkIn.localeCompare(b.checkIn);
        return direction === 'asc' ? result : -result;
      })
    : filtered;

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

      <p id="count">Найдено проживаний: {filtered.length}</p>

      <table id="stays">
        <thead>
          <tr>
            <th>№</th>
            <th>Гость</th>
            <th>Номер</th>
            <th>
              <button id="sort-checkin" type="button" onClick={() => setDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}>
                Заезд
              </button>
            </th>
            <th>Выезд</th>
            <th>Ночей</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.guest}</td>
              <td>{item.room}</td>
              <td>{toRuDate(item.checkIn)}</td>
              <td>{toRuDate(item.checkOut)}</td>
              <td className="nights">{nightsOf(item)}</td>
              <td>
                <select
                  className="status"
                  value={item.status}
                  onChange={(event) => changeStatus(item, event.target.value)}
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
    </div>
  );
}`,
    solutionExplanation:
      'Сортировка идёт по исходному значению checkIn в формате ГГГГ-ММ-ДД, а не по тому, что показано в таблице. Это общее правило: сортируют и сравнивают машинные значения, а человеческий формат появляется только в момент вывода. Число ночей считается разницей дат в миллисекундах — здесь new Date безопасен, потому что обе даты в одном формате и разница часовых поясов сокращается. Вся остальная структура — та же, что в прошлых админках, и в этом смысл прогона на новой теме: если структура держится, тема не имеет значения.',
    maxScore: 32,
    estimatedMinutes: 45,
    examRefs: ['m2-admin-tools', 'm2-order-form', 'm1-admin'],
    planDays: ['day-27-4'],
    source: 'plan',
  },

  {
    id: 'task-compare-week-runs',
    title: 'Разбор: два прогона одной недели',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['js'],
    topicIds: ['exam-debrief'],
    monthNo: 7,
    weekNo: 27,
    statement: `Сравниваем два прогона одной недели — разница между ними показательнее, чем разница с прошлым месяцем: тема и настрой примерно одни, а работа над ошибками между ними была.

Прогон: \`{ modules: { 1, 2, 3 }, done: [...], stuck: [...] }\`, где \`stuck\` — места, где застряли.

1. \`fixedStuck(first, second)\` — затруднения, которые были в первом прогоне и ушли во втором.
2. \`newStuck(first, second)\` — затруднения, появившиеся во втором.
3. \`repeatedStuck(first, second)\` — повторившиеся: это и есть список на следующую неделю.
4. \`timeByModule(first, second)\` — \`{ 1, 2, 3 }\` с разницей в минутах (положительное — стало быстрее).
5. \`weekVerdict(first, second)\` — \`'Работа над ошибками сработала'\`, если повторившихся нет; иначе \`'Повторяется: '\` и список через запятую.`,
    requirements: [
      'Ушедшие затруднения находятся',
      'Новые затруднения находятся',
      'Повторившиеся затруднения находятся',
      'Разница по модулям считается со знаком',
      'Вывод зависит от наличия повторов',
    ],
    starterCode: `function fixedStuck(first, second) {
  // что ушло
}

function newStuck(first, second) {
  // что появилось
}

function repeatedStuck(first, second) {
  // что повторилось
}

function timeByModule(first, second) {
  // { 1, 2, 3 }
}

function weekVerdict(first, second) {
  // вывод недели
}`,
    tests: [
      {
        id: 'fixed',
        name: 'Ушедшие затруднения',
        type: 'assert',
        code: `const fixedStuck = ctx.get('fixedStuck');
const first = { modules: { 1: 200, 2: 130, 3: 70 }, done: [], stuck: ['JOIN', 'валидация', 'слайдер'] };
const second = { modules: { 1: 180, 2: 120, 3: 60 }, done: [], stuck: ['слайдер', 'пагинация'] };
const result = fixedStuck(first, second);
ctx.assert(result.indexOf('JOIN') !== -1, 'JOIN больше не проблема');
ctx.assert(result.indexOf('валидация') !== -1, 'Валидация больше не проблема');
ctx.assert(result.length === 2, 'Ушедших должно быть два, получено: ' + ctx.preview(result));`,
        points: 5,
      },
      {
        id: 'new',
        name: 'Новые затруднения',
        type: 'assert',
        code: `const newStuck = ctx.get('newStuck');
const first = { modules: { 1: 200, 2: 130, 3: 70 }, done: [], stuck: ['JOIN', 'слайдер'] };
const second = { modules: { 1: 180, 2: 120, 3: 60 }, done: [], stuck: ['слайдер', 'пагинация'] };
ctx.assert(newStuck(first, second).join(',') === 'пагинация', 'Получено: ' + newStuck(first, second).join(','));`,
        points: 5,
      },
      {
        id: 'repeated',
        name: 'Повторившиеся затруднения',
        type: 'assert',
        code: `const repeatedStuck = ctx.get('repeatedStuck');
const first = { modules: { 1: 200, 2: 130, 3: 70 }, done: [], stuck: ['JOIN', 'слайдер'] };
const second = { modules: { 1: 180, 2: 120, 3: 60 }, done: [], stuck: ['слайдер', 'пагинация'] };
ctx.assert(repeatedStuck(first, second).join(',') === 'слайдер', 'Получено: ' + repeatedStuck(first, second).join(','));`,
        points: 5,
      },
      {
        id: 'time',
        name: 'Разница по модулям',
        type: 'assert',
        code: `const timeByModule = ctx.get('timeByModule');
const first = { modules: { 1: 200, 2: 130, 3: 70 }, done: [], stuck: [] };
const second = { modules: { 1: 180, 2: 140, 3: 70 }, done: [], stuck: [] };
const diff = timeByModule(first, second);
ctx.assert(diff[1] === 20, 'Первый модуль стал быстрее на 20, получено: ' + diff[1]);
ctx.assert(diff[2] === -10, 'Второй стал медленнее на 10, получено: ' + diff[2], -10, diff[2]);
ctx.assert(diff[3] === 0, 'Третий без изменений, получено: ' + diff[3]);`,
        points: 6,
      },
      {
        id: 'verdict',
        name: 'Вывод недели',
        type: 'assert',
        code: `const weekVerdict = ctx.get('weekVerdict');
const clean = { modules: { 1: 200, 2: 130, 3: 70 }, done: [], stuck: ['JOIN'] };
const better = { modules: { 1: 180, 2: 120, 3: 60 }, done: [], stuck: ['пагинация'] };
ctx.assert(weekVerdict(clean, better) === 'Работа над ошибками сработала', 'Получено: ' + weekVerdict(clean, better));
const same = { modules: { 1: 180, 2: 120, 3: 60 }, done: [], stuck: ['JOIN', 'слайдер'] };
const text = weekVerdict(clean, same);
ctx.assert(text.indexOf('Повторяется:') === 0, 'Получено: ' + text);
ctx.assert(text.indexOf('JOIN') !== -1, 'В выводе должно быть повторившееся затруднение: ' + text);`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Все три списка — фильтры по вхождению, как в прошлом разборе. Меняются только направления сравнения.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Разница по модулю: время первого прогона минус время второго. Тогда положительное значение означает ускорение.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const repeated = repeatedStuck(first, second); return repeated.length === 0 ? "Работа над ошибками сработала" : "Повторяется: " + repeated.join(", ");',
        penaltyPercent: 35,
      },
    ],
    solution: `function fixedStuck(first, second) {
  return first.stuck.filter((item) => second.stuck.indexOf(item) === -1);
}

function newStuck(first, second) {
  return second.stuck.filter((item) => first.stuck.indexOf(item) === -1);
}

function repeatedStuck(first, second) {
  return first.stuck.filter((item) => second.stuck.indexOf(item) !== -1);
}

function timeByModule(first, second) {
  return {
    1: first.modules[1] - second.modules[1],
    2: first.modules[2] - second.modules[2],
    3: first.modules[3] - second.modules[3],
  };
}

function weekVerdict(first, second) {
  const repeated = repeatedStuck(first, second);

  return repeated.length === 0
    ? 'Работа над ошибками сработала'
    : 'Повторяется: ' + repeated.join(', ');
}`,
    solutionExplanation:
      'Повторившееся затруднение — самая ценная строка разбора. Между двумя прогонами недели был целый день работы над ошибками, и если тема всё равно застопорила второй раз, значит её разбирали не тем способом: читали вместо того, чтобы писать, или починили частный случай вместо правила. Новые затруднения обычно менее тревожны: они появляются от того, что до этих мест раньше просто не доходили руки.',
    maxScore: 27,
    estimatedMinutes: 25,
    examRefs: ['m3-quality'],
    planDays: ['day-27-5'],
    source: 'plan',
  },

  {
    id: 'task-sql-recall-dates',
    title: 'Повторение SQL: даты, диапазоны и пересечения',
    kind: 'db',
    runtime: 'sql',
    difficulty: 4,
    tech: ['sql'],
    topicIds: ['memory-training'],
    monthNo: 7,
    weekNo: 27,
    statement: `Спокойный день после двух прогонов: возвращаем в память то, что не встречалось на этой неделе. Сегодня — даты: диапазоны, пересечения, разница.

База гостиницы готова: \`guests\`, \`rooms\`, \`stays\` (столбцы \`check_in\`, \`check_out\`, \`status\`).

1. Проживания марта 2027 года: \`id\`, \`check_in\`, по возрастанию даты заезда.
2. Число ночей у каждого проживания: \`id\`, \`nights\`, по убыванию.
3. Проживания, пересекающиеся с отрезком \`2027-03-13\` … \`2027-03-16\`: \`id\`, по возрастанию. Пересечение есть, если заезд раньше конца отрезка **и** выезд позже его начала.
4. Дата заезда в формате ДД.ММ.ГГГГ: \`id\`, \`check_in_ru\`, по возрастанию \`id\`.
5. Сколько ночей продано по каждому номеру: \`number\`, \`total_nights\`, по убыванию.

Третий пункт — то самое условие пересечения отрезков, которое пишут неправильно чаще всего.`,
    requirements: [
      'Отбор по диапазону дат',
      'Разница дат в днях',
      'Условие пересечения отрезков',
      'Формат даты ДД.ММ.ГГГГ',
      'Сумма ночей по номерам',
    ],
    setupSql: `
CREATE TABLE guests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL
);

CREATE TABLE rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  number TEXT NOT NULL UNIQUE
);

CREATE TABLE stays (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guest_id INTEGER NOT NULL REFERENCES guests(id),
  room_id INTEGER NOT NULL REFERENCES rooms(id),
  check_in TEXT NOT NULL,
  check_out TEXT NOT NULL,
  status TEXT NOT NULL
);

INSERT INTO guests (id, full_name) VALUES (1, 'Иванов Иван'), (2, 'Петрова Полина');

INSERT INTO rooms (id, number) VALUES (1, '101'), (2, '102');

INSERT INTO stays (id, guest_id, room_id, check_in, check_out, status) VALUES
  (1, 1, 1, '2027-03-12', '2027-03-15', 'Заселён'),
  (2, 2, 2, '2027-03-14', '2027-03-18', 'Забронировано'),
  (3, 1, 1, '2027-02-01', '2027-02-05', 'Выехал'),
  (4, 2, 1, '2027-03-20', '2027-03-22', 'Забронировано');
`,
    starterCode: `-- 1. Проживания марта 2027


-- 2. Число ночей


-- 3. Пересечение с 13.03 – 16.03


-- 4. Дата заезда по-русски


-- 5. Ночей по номерам

`,
    tests: [
      {
        id: 'march',
        name: 'Проживания марта',
        type: 'sql-query',
        check: `SELECT id, check_in FROM stays WHERE check_in >= '2027-03-01' AND check_in < '2027-04-01' ORDER BY check_in`,
        expectedColumns: ['id', 'check_in'],
        expectedRows: [
          [1, '2027-03-12'],
          [2, '2027-03-14'],
          [4, '2027-03-20'],
        ],
        ordered: true,
        points: 5,
      },
      {
        id: 'nights',
        name: 'Число ночей',
        type: 'sql-query',
        check: `SELECT id, CAST(julianday(check_out) - julianday(check_in) AS INT) AS nights FROM stays ORDER BY nights DESC, id`,
        expectedColumns: ['id', 'nights'],
        expectedRows: [
          [2, 4],
          [3, 4],
          [1, 3],
          [4, 2],
        ],
        ordered: true,
        points: 6,
      },
      {
        id: 'overlap',
        name: 'Пересечение отрезков',
        type: 'sql-query',
        check: `SELECT id FROM stays WHERE check_in < '2027-03-16' AND check_out > '2027-03-13' ORDER BY id`,
        expectedColumns: ['id'],
        expectedRows: [[1], [2]],
        ordered: true,
        points: 7,
      },
      {
        id: 'ru-date',
        name: 'Дата по-русски',
        type: 'sql-query',
        check: `SELECT id, printf('%s.%s.%s', substr(check_in, 9, 2), substr(check_in, 6, 2), substr(check_in, 1, 4)) AS check_in_ru FROM stays ORDER BY id`,
        expectedColumns: ['id', 'check_in_ru'],
        expectedRows: [
          [1, '12.03.2027'],
          [2, '14.03.2027'],
          [3, '01.02.2027'],
          [4, '20.03.2027'],
        ],
        ordered: true,
        points: 5,
      },
      {
        id: 'total-nights',
        name: 'Ночей по номерам',
        type: 'sql-query',
        check: `SELECT r.number, CAST(SUM(julianday(s.check_out) - julianday(s.check_in)) AS INT) AS total_nights FROM rooms r JOIN stays s ON s.room_id = r.id GROUP BY r.id, r.number ORDER BY total_nights DESC`,
        expectedColumns: ['number', 'total_nights'],
        expectedRows: [
          ['101', 9],
          ['102', 4],
        ],
        ordered: true,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Диапазон задавайте двумя границами, а не функцией извлечения месяца: сравнение по границам умеет пользоваться индексом.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Разницу дат в MySQL считают DATEDIFF(конец, начало). Песочница переведёт это сама и покажет замену.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Отрезки пересекаются, если начало одного раньше конца другого и конец одного позже начала другого: check_in < конец AND check_out > начало.',
        penaltyPercent: 35,
      },
    ],
    solution: `SELECT id, check_in
FROM stays
WHERE check_in >= '2027-03-01' AND check_in < '2027-04-01'
ORDER BY check_in;

SELECT id, DATEDIFF(check_out, check_in) AS nights
FROM stays
ORDER BY nights DESC, id;

SELECT id
FROM stays
WHERE check_in < '2027-03-16' AND check_out > '2027-03-13'
ORDER BY id;

SELECT id, DATE_FORMAT(check_in, '%d.%m.%Y') AS check_in_ru
FROM stays
ORDER BY id;

SELECT r.number, SUM(DATEDIFF(s.check_out, s.check_in)) AS total_nights
FROM rooms r
JOIN stays s ON s.room_id = r.id
GROUP BY r.id, r.number
ORDER BY total_nights DESC;`,
    solutionExplanation:
      'Условие пересечения отрезков стоит выучить наизусть: два отрезка пересекаются, если начало первого раньше конца второго и конец первого позже начала второго. Интуитивный вариант — перечислять случаи «начало внутри», «конец внутри», «полностью внутри» — даёт три условия вместо двух и почти всегда теряет четвёртый случай, когда один отрезок целиком накрывает другой. Диапазон месяца задан двумя границами, а не извлечением месяца из даты: функция над столбцом мешает базе воспользоваться индексом.',
    maxScore: 29,
    estimatedMinutes: 35,
    examRefs: ['m1-order', 'm1-admin', 'm3-db'],
    planDays: ['day-27-6'],
    source: 'plan',
  },

  {
    id: 'task-salon-module1',
    title: 'Полный прогон: салон красоты, первый модуль',
    kind: 'db',
    runtime: 'sql',
    difficulty: 5,
    tech: ['sql'],
    topicIds: ['exam-strategy'],
    monthNo: 7,
    weekNo: 28,
    statement: `Новая тема — **салон красоты**. Проверяемая часть первого модуля: база, данные и запросы, на которых держатся кабинет и админка.

1. \`clients\` — \`id\`, \`phone\` (текст, обязательный, уникальный), \`full_name\` (обязательный).
2. \`services\` — \`id\`, \`title\` (обязательный, уникальный), \`duration_minutes\` (целое, обязательное), \`price\` (дробное с копейками, обязательное).
3. \`masters\` — \`id\`, \`full_name\` (обязательный), \`speciality\` (обязательная).
4. \`visits\` — \`id\`, \`client_id\`, \`service_id\`, \`master_id\` (обязательные внешние ключи), \`visit_at\` (обязательная дата), \`status\` (по умолчанию \`'Записан'\`, ограничен списком \`'Записан'\`, \`'Пришёл'\`, \`'Не пришёл'\`).
5. **Правило темы**: у одного мастера не может быть двух записей на одну и ту же дату — ограничение уникальности по мастеру и дате.
6. Заполните: три услуги, два мастера, два клиента, четыре записи.
7. Запрос: выручка по мастерам — \`full_name\`, \`revenue\` (сумма цен услуг по записям со статусом \`'Пришёл'\`), по убыванию.`,
    requirements: [
      'Четыре таблицы со связями',
      'Телефон клиента уникален',
      'Статус ограничен списком',
      'У мастера не может быть двух записей на одну дату',
      'Данные заполнены',
      'Запрос считает выручку по мастерам',
    ],
    starterCode: `-- Салон красоты: первый модуль

`,
    tests: [
      {
        id: 'services',
        name: 'Справочник услуг',
        type: 'sql-schema',
        table: 'services',
        columns: [
          { name: 'id', pk: true },
          { name: 'title', notNull: true },
          { name: 'duration_minutes', notNull: true },
          { name: 'price', notNull: true },
        ],
        points: 4,
      },
      {
        id: 'visits',
        name: 'Записи связаны с тремя таблицами',
        type: 'sql-schema',
        table: 'visits',
        columns: [
          { name: 'id', pk: true },
          { name: 'client_id', notNull: true },
          { name: 'service_id', notNull: true },
          { name: 'master_id', notNull: true },
          { name: 'visit_at', notNull: true },
          { name: 'status', notNull: true },
        ],
        foreignKeys: [
          { column: 'client_id', refTable: 'clients' },
          { column: 'service_id', refTable: 'services' },
          { column: 'master_id', refTable: 'masters' },
        ],
        points: 5,
      },
      {
        id: 'status-check',
        name: 'Статус ограничен списком',
        type: 'sql-query',
        check: `SELECT CASE WHEN instr(upper(sql), 'CHECK') > 0 AND instr(sql, 'Пришёл') > 0 THEN 1 ELSE 0 END FROM sqlite_master WHERE type = 'table' AND name = 'visits'`,
        expectedRows: [[1]],
        points: 5,
      },
      {
        id: 'unique-master',
        name: 'У мастера одна запись на дату',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM pragma_index_list('visits') WHERE "unique" = 1`,
        expectedRows: [[1]],
        points: 6,
      },
      {
        id: 'data',
        name: 'Данные заполнены',
        type: 'sql-query',
        check: `SELECT (SELECT COUNT(*) FROM services), (SELECT COUNT(*) FROM masters), (SELECT COUNT(*) FROM visits v JOIN clients c ON c.id = v.client_id JOIN services s ON s.id = v.service_id JOIN masters m ON m.id = v.master_id)`,
        expectedRows: [[3, 2, 4]],
        points: 5,
      },
      {
        id: 'revenue',
        name: 'Выручка по мастерам',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM (SELECT m.id FROM masters m JOIN visits v ON v.master_id = m.id AND v.status = 'Пришёл' GROUP BY m.id HAVING SUM(1) > 0)`,
        expectedRows: [[2]],
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Скелет прежний: люди, справочник услуг, исполнители, записи. Новое — ограничение по мастеру и дате.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Чтобы выручка нашлась у обоих мастеров, дайте каждому хотя бы одну запись со статусом «Пришёл».',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'SELECT m.full_name, SUM(s.price) AS revenue FROM masters m JOIN visits v ON v.master_id = m.id JOIN services s ON s.id = v.service_id WHERE v.status = "Пришёл" GROUP BY m.id, m.full_name ORDER BY revenue DESC;',
        penaltyPercent: 35,
      },
    ],
    solution: `CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(30) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL
);

CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE,
  duration_minutes INT NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE masters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  speciality VARCHAR(100) NOT NULL
);

CREATE TABLE visits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  service_id INT NOT NULL,
  master_id INT NOT NULL,
  visit_at DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Записан'
    CHECK (status IN ('Записан', 'Пришёл', 'Не пришёл')),
  UNIQUE (master_id, visit_at),
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (master_id) REFERENCES masters(id)
);

INSERT INTO services (id, title, duration_minutes, price) VALUES
  (1, 'Стрижка', 60, 1500.50),
  (2, 'Окрашивание', 120, 4800.00),
  (3, 'Маникюр', 90, 2200.00);

INSERT INTO masters (id, full_name, speciality) VALUES
  (1, 'Сидорова Светлана', 'Парикмахер'),
  (2, 'Кузнецова Ксения', 'Мастер маникюра');

INSERT INTO clients (id, phone, full_name) VALUES
  (1, '+7 (900) 123-45-67', 'Иванова Ирина'),
  (2, '+7 (900) 765-43-21', 'Петрова Полина');

INSERT INTO visits (client_id, service_id, master_id, visit_at, status) VALUES
  (1, 1, 1, '2027-03-12', 'Пришёл'),
  (2, 2, 1, '2027-03-13', 'Пришёл'),
  (1, 3, 2, '2027-03-12', 'Пришёл'),
  (2, 3, 2, '2027-03-14', 'Записан');

SELECT m.full_name, SUM(s.price) AS revenue
FROM masters m
JOIN visits v ON v.master_id = m.id
JOIN services s ON s.id = v.service_id
WHERE v.status = 'Пришёл'
GROUP BY m.id, m.full_name
ORDER BY revenue DESC;`,
    solutionExplanation:
      'Ограничение по паре «мастер и дата» — правило этой темы, и его нельзя вывести из прошлых проектов: два клиента к одному мастеру в один день физически не помещаются. Обратите внимание, что две записи на одну дату 12 марта в данных есть, но у разных мастеров — ограничение их пропускает. Условие по статусу стоит в WHERE, а не в HAVING: оно отбирает строки до группировки, и это правильный порядок — в выручку должны попасть только состоявшиеся визиты.',
    maxScore: 31,
    estimatedMinutes: 45,
    examRefs: ['m1-db', 'm1-admin', 'm1-er'],
    planDays: ['day-28-1'],
    source: 'plan',
  },

  {
    id: 'task-checklist-gaps',
    title: 'Разбор: какие пункты не закрыты и почему',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['js'],
    topicIds: ['exam-checklist'],
    monthNo: 7,
    weekNo: 28,
    statement: `Незакрытый пункт бывает трёх видов, и лечатся они по-разному: не успел (нужна скорость), не вспомнил (нужно повторение), не понял (нужно разобраться заново).

Пункты приходят как \`{ id, title, module, weight, done, reason }\`, где \`reason\` — \`'time'\`, \`'memory'\`, \`'understanding'\` или \`null\` для закрытых.

1. \`byReason(items)\` — \`{ time: [...], memory: [...], understanding: [...] }\` с названиями пунктов.
2. \`weightByReason(items)\` — сумма весов по каждой причине: \`{ time, memory, understanding }\`.
3. \`mainProblem(items)\` — причина с наибольшей суммой весов. Если незакрытых нет — \`null\`. При равенстве порядок: \`'understanding'\`, \`'memory'\`, \`'time'\` — непонятое опаснее забытого, забытое опаснее несделанного.
4. \`prescription(items)\` — совет по главной причине: \`'time'\` → \`'Тренировать скорость по частям'\`; \`'memory'\` → \`'Повторять и писать по памяти'\`; \`'understanding'\` → \`'Разобрать тему заново, с нуля'\`; нет проблем → \`'Всё закрыто'\`.`,
    requirements: [
      'Пункты раскладываются по причинам',
      'Веса считаются по каждой причине',
      'Главная причина определяется по весу',
      'При равенстве непонятое важнее забытого',
      'Совет соответствует главной причине',
    ],
    starterCode: `const REASONS = ['understanding', 'memory', 'time'];

function byReason(items) {
  // { time: [...], memory: [...], understanding: [...] }
}

function weightByReason(items) {
  // суммы весов
}

function mainProblem(items) {
  // главная причина
}

function prescription(items) {
  // что делать
}`,
    tests: [
      {
        id: 'by-reason',
        name: 'Раскладка по причинам',
        type: 'assert',
        code: `const byReason = ctx.get('byReason');
const items = [
  { id: 'a', title: 'Админка', module: 1, weight: 4, done: false, reason: 'time' },
  { id: 'b', title: 'JOIN', module: 1, weight: 3, done: false, reason: 'memory' },
  { id: 'c', title: 'База', module: 1, weight: 3, done: true, reason: null },
];
const result = byReason(items);
ctx.assert(result.time.join(',') === 'Админка', 'По времени: ' + ctx.preview(result.time));
ctx.assert(result.memory.join(',') === 'JOIN', 'По памяти: ' + ctx.preview(result.memory));
ctx.assert(result.understanding.length === 0, 'По пониманию должно быть пусто: ' + ctx.preview(result.understanding));`,
        points: 5,
      },
      {
        id: 'weights',
        name: 'Веса по причинам',
        type: 'assert',
        code: `const weightByReason = ctx.get('weightByReason');
const items = [
  { id: 'a', title: 'Админка', weight: 4, done: false, reason: 'time' },
  { id: 'b', title: 'JOIN', weight: 3, done: false, reason: 'memory' },
  { id: 'c', title: 'Слайдер', weight: 2, done: false, reason: 'time' },
];
const result = weightByReason(items);
ctx.assert(result.time === 6, 'По времени 6, получено: ' + result.time);
ctx.assert(result.memory === 3, 'По памяти 3, получено: ' + result.memory);
ctx.assert(result.understanding === 0, 'По пониманию 0, получено: ' + result.understanding);`,
        points: 5,
      },
      {
        id: 'main',
        name: 'Главная причина',
        type: 'assert',
        code: `const mainProblem = ctx.get('mainProblem');
const items = [
  { id: 'a', weight: 4, done: false, reason: 'time' },
  { id: 'b', weight: 3, done: false, reason: 'memory' },
  { id: 'c', weight: 2, done: false, reason: 'time' },
];
ctx.assert(mainProblem(items) === 'time', 'Получено: ' + ctx.preview(mainProblem(items)));
ctx.assert(mainProblem([{ id: 'x', weight: 3, done: true, reason: null }]) === null, 'Когда всё закрыто, нужен null');`,
        points: 5,
      },
      {
        id: 'tie',
        name: 'При равенстве непонятое важнее',
        type: 'assert',
        code: `const mainProblem = ctx.get('mainProblem');
const tie = [
  { id: 'a', weight: 3, done: false, reason: 'time' },
  { id: 'b', weight: 3, done: false, reason: 'memory' },
  { id: 'c', weight: 3, done: false, reason: 'understanding' },
];
ctx.assert(
  mainProblem(tie) === 'understanding',
  'При равных весах непонятое опаснее забытого и несделанного, получено: ' + mainProblem(tie),
);
const two = [
  { id: 'a', weight: 3, done: false, reason: 'time' },
  { id: 'b', weight: 3, done: false, reason: 'memory' },
];
ctx.assert(mainProblem(two) === 'memory', 'Забытое важнее несделанного, получено: ' + mainProblem(two));`,
        points: 7,
      },
      {
        id: 'prescription',
        name: 'Совет по итогам',
        type: 'assert',
        code: `const prescription = ctx.get('prescription');
ctx.assert(
  prescription([{ id: 'a', weight: 4, done: false, reason: 'understanding' }]) === 'Разобрать тему заново, с нуля',
  'Совет при непонимании неверный',
);
ctx.assert(
  prescription([{ id: 'a', weight: 4, done: false, reason: 'memory' }]) === 'Повторять и писать по памяти',
  'Совет при забывании неверный',
);
ctx.assert(
  prescription([{ id: 'a', weight: 4, done: false, reason: 'time' }]) === 'Тренировать скорость по частям',
  'Совет при нехватке времени неверный',
);
ctx.assert(prescription([{ id: 'a', weight: 4, done: true, reason: null }]) === 'Всё закрыто', 'Когда всё закрыто');`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Заготовьте объект с тремя пустыми списками заранее — тогда причина без пунктов появится в отчёте сама.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Порядок при равенстве задаётся порядком перебора: если идти по REASONS и брать строго большее, первый в списке выиграет при равенстве.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'return REASONS.reduce((best, reason) => (weights[reason] > weights[best] ? reason : best), REASONS[0]);',
        penaltyPercent: 35,
      },
    ],
    solution: `const REASONS = ['understanding', 'memory', 'time'];

const ADVICE = {
  time: 'Тренировать скорость по частям',
  memory: 'Повторять и писать по памяти',
  understanding: 'Разобрать тему заново, с нуля',
};

function byReason(items) {
  const result = { time: [], memory: [], understanding: [] };

  items
    .filter((item) => !item.done && item.reason)
    .forEach((item) => {
      if (result[item.reason]) result[item.reason].push(item.title);
    });

  return result;
}

function weightByReason(items) {
  const result = { time: 0, memory: 0, understanding: 0 };

  items
    .filter((item) => !item.done && item.reason)
    .forEach((item) => {
      if (result[item.reason] !== undefined) result[item.reason] += item.weight;
    });

  return result;
}

function mainProblem(items) {
  const weights = weightByReason(items);
  const best = REASONS.reduce((current, reason) => (weights[reason] > weights[current] ? reason : current), REASONS[0]);

  return weights[best] === 0 ? null : best;
}

function prescription(items) {
  const problem = mainProblem(items);
  return problem ? ADVICE[problem] : 'Всё закрыто';
}`,
    solutionExplanation:
      'Порядок в массиве REASONS задаёт приоритет при равенстве, и он не случаен: непонятая тема опаснее забытой, потому что забытое возвращается за вечер повторения, а непонятое будет проваливаться каждый раз. Нехватка времени — самая безобидная причина: она означает, что вы знаете, как делать, и вопрос только в скорости. Разделение причин важнее самого подсчёта: три разных диагноза требуют трёх разных лекарств, а «не успел» звучит одинаково во всех трёх случаях.',
    maxScore: 28,
    estimatedMinutes: 25,
    examRefs: ['m3-quality'],
    planDays: ['day-28-2'],
    source: 'plan',
  },

  {
    id: 'task-drill-status-machine',
    title: 'Тренировка слабых мест: переходы статусов',
    kind: 'function',
    runtime: 'js',
    difficulty: 4,
    tech: ['js'],
    topicIds: ['memory-training'],
    monthNo: 7,
    weekNo: 28,
    statement: `Статусы меняются не как попало: из «Записан» можно перейти в «Пришёл» или «Не пришёл», а обратно — уже нельзя. Такие правила пишут таблицей переходов, и это избавляет от десятка условий.

1. \`TRANSITIONS\` — объект переходов: из \`'Записан'\` можно в \`['Пришёл', 'Не пришёл']\`, из \`'Пришёл'\` и \`'Не пришёл'\` — никуда (\`[]\`).
2. \`canChange(from, to)\` — разрешён ли переход. Неизвестный статус — \`false\`.
3. \`nextStatuses(from)\` — список доступных переходов; для неизвестного статуса — пустой массив.
4. \`isFinal(status)\` — статус конечный, если из него нет переходов и сам он известен.
5. \`applyChange(item, to)\` — возвращает **новый** объект с изменённым статусом либо выбрасывает ошибку \`'Переход запрещён'\`, если переход недопустим.`,
    requirements: [
      'Таблица переходов описана',
      'Разрешённые переходы проходят',
      'Обратные и неизвестные переходы отклоняются',
      'Конечные статусы определяются',
      'applyChange не меняет исходный объект',
      'Недопустимый переход выбрасывает ошибку',
    ],
    starterCode: `const TRANSITIONS = {
  // из какого статуса в какие можно
};

function canChange(from, to) {
  // разрешён ли переход
}

function nextStatuses(from) {
  // куда можно
}

function isFinal(status) {
  // конечный ли
}

function applyChange(item, to) {
  // новый объект или ошибка
}`,
    tests: [
      {
        id: 'table',
        name: 'Таблица переходов',
        type: 'assert',
        code: `const TRANSITIONS = ctx.get('TRANSITIONS');
ctx.assert(Array.isArray(TRANSITIONS['Записан']), 'Из «Записан» должен быть список переходов');
ctx.assert(TRANSITIONS['Записан'].length === 2, 'Из «Записан» два перехода, найдено: ' + TRANSITIONS['Записан'].length);
ctx.assert(Array.isArray(TRANSITIONS['Пришёл']) && TRANSITIONS['Пришёл'].length === 0, 'Из «Пришёл» переходов нет');
ctx.assert(Array.isArray(TRANSITIONS['Не пришёл']) && TRANSITIONS['Не пришёл'].length === 0, 'Из «Не пришёл» переходов нет');`,
        points: 5,
      },
      {
        id: 'can-change',
        name: 'Разрешённые и запрещённые переходы',
        type: 'assert',
        code: `const canChange = ctx.get('canChange');
ctx.assert(canChange('Записан', 'Пришёл') === true, 'Переход в «Пришёл» разрешён');
ctx.assert(canChange('Записан', 'Не пришёл') === true, 'Переход в «Не пришёл» разрешён');
ctx.assert(canChange('Пришёл', 'Записан') === false, 'Обратный переход запрещён');
ctx.assert(canChange('Отменён', 'Пришёл') === false, 'Неизвестный исходный статус — запрет');
ctx.assert(canChange('Записан', 'Отменён') === false, 'Неизвестный целевой статус — запрет');`,
        points: 6,
      },
      {
        id: 'next',
        name: 'Доступные переходы',
        type: 'assert',
        code: `const nextStatuses = ctx.get('nextStatuses');
ctx.assert(nextStatuses('Записан').length === 2, 'Из «Записан» два перехода');
ctx.assert(nextStatuses('Пришёл').length === 0, 'Из «Пришёл» переходов нет');
ctx.assert(nextStatuses('Отменён').length === 0, 'Для неизвестного статуса нужен пустой массив, а не ошибка');`,
        points: 5,
      },
      {
        id: 'final',
        name: 'Конечные статусы',
        type: 'assert',
        code: `const isFinal = ctx.get('isFinal');
ctx.assert(isFinal('Пришёл') === true, '«Пришёл» — конечный статус');
ctx.assert(isFinal('Не пришёл') === true, '«Не пришёл» — конечный статус');
ctx.assert(isFinal('Записан') === false, 'Из «Записан» есть переходы');
ctx.assert(isFinal('Отменён') === false, 'Неизвестный статус конечным считать нельзя');`,
        points: 6,
      },
      {
        id: 'apply',
        name: 'Применение перехода',
        type: 'assert',
        code: `const applyChange = ctx.get('applyChange');
const item = { id: 1, status: 'Записан', client: 'Иванова' };
const result = applyChange(item, 'Пришёл');
ctx.assert(result.status === 'Пришёл', 'Статус должен смениться, получено: ' + ctx.preview(result));
ctx.assert(item.status === 'Записан', 'Исходный объект меняться не должен');
ctx.assert(result !== item, 'Нужно вернуть новый объект');
ctx.assert(result.client === 'Иванова', 'Остальные поля должны сохраниться: ' + ctx.preview(result));`,
        points: 6,
      },
      {
        id: 'apply-error',
        name: 'Недопустимый переход выбрасывает ошибку',
        type: 'assert',
        code: `const applyChange = ctx.get('applyChange');
let thrown = null;
try {
  applyChange({ id: 1, status: 'Пришёл' }, 'Записан');
} catch (error) {
  thrown = error;
}
ctx.assert(thrown, 'Недопустимый переход должен выбрасывать ошибку');
ctx.assert(
  String(thrown.message || thrown).indexOf('Переход запрещён') !== -1,
  'Текст ошибки: ' + (thrown.message || thrown),
);`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'canChange — это одна строка: взять список переходов из таблицы и проверить вхождение.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Для неизвестного статуса в таблице ничего нет — подставляйте пустой массив, тогда все проверки сработают сами.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'isFinal: Object.prototype.hasOwnProperty.call(TRANSITIONS, status) && TRANSITIONS[status].length === 0;',
        penaltyPercent: 35,
      },
    ],
    solution: `const TRANSITIONS = {
  Записан: ['Пришёл', 'Не пришёл'],
  'Пришёл': [],
  'Не пришёл': [],
};

function nextStatuses(from) {
  return TRANSITIONS[from] || [];
}

function canChange(from, to) {
  return nextStatuses(from).indexOf(to) !== -1;
}

function isFinal(status) {
  return Object.prototype.hasOwnProperty.call(TRANSITIONS, status) && TRANSITIONS[status].length === 0;
}

function applyChange(item, to) {
  if (!canChange(item.status, to)) {
    throw new Error('Переход запрещён');
  }

  return { ...item, status: to };
}`,
    solutionExplanation:
      'Таблица переходов заменяет собой набор условий, которые иначе расползутся по серверу и интерфейсу. Когда правила лежат в одном объекте, интерфейс строит из него список доступных статусов, а сервер по нему же проверяет запрос — и они не могут разойтись. Проверка isFinal отличает «из этого статуса некуда» от «такого статуса вообще нет»: первое — нормальный конец жизни записи, второе — ошибка в данных, и путать их нельзя.',
    maxScore: 33,
    estimatedMinutes: 25,
    examRefs: ['m1-admin', 'm2-admin-tools', 'm3-quality'],
    planDays: ['day-28-3'],
    source: 'plan',
  },

  {
    id: 'task-salon-module3',
    title: 'Второй прогон недели: салон, третий модуль',
    kind: 'api',
    runtime: 'js',
    difficulty: 5,
    tech: ['express', 'security', 'node'],
    topicIds: ['exam-strategy'],
    monthNo: 7,
    weekNo: 28,
    statement: `Третий модуль на той же теме: качество кода, безопасность и состояния. Час на всё, поэтому пишем сразу правильно.

\`repo\` содержит \`findVisit(id)\`, \`updateStatus(id, status)\`, \`listByMaster(masterId)\` — все возвращают промисы.

1. \`ALLOWED\` — допустимые статусы: \`'Записан'\`, \`'Пришёл'\`, \`'Не пришёл'\`.
2. \`changeStatus(repo)\` — обработчик: нет \`req.user\` → \`401\`; статус не из списка → \`400\` и \`{ error: 'Недопустимый статус' }\` **до** обращения к базе; записи нет → \`404\`; запись чужого мастера (\`masterId\` не совпадает с \`req.user.id\`) и роль не \`'admin'\` → \`403\`; иначе обновление и ответ обновлённой записью.
3. \`masterSchedule(repo)\` — обработчик: отдаёт записи мастера \`req.user.id\`. Пустой список — это **не** ошибка: отвечает \`200\` и \`{ items: [], empty: true }\`. Непустой — \`{ items, empty: false }\`.
4. Ошибка хранилища в обоих — \`500\` и \`{ error: 'Ошибка сервера' }\`, без подробностей.`,
    requirements: [
      'Недопустимый статус отклоняется до обращения к базе',
      'Чужая запись закрыта от обычного мастера',
      'Администратор может менять любую запись',
      'Пустое расписание не считается ошибкой',
      'Ошибка хранилища превращается в 500 без подробностей',
    ],
    starterCode: `const ALLOWED = ['Записан', 'Пришёл', 'Не пришёл'];

function changeStatus(repo) {
  return async function (req, res) {
    // ваш код
  };
}

function masterSchedule(repo) {
  return async function (req, res) {
    // ваш код
  };
}`,
    tests: [
      {
        id: 'validation',
        name: 'Недопустимый статус до базы не доходит',
        type: 'assert',
        code: `const changeStatus = ctx.get('changeStatus');
let called = false;
const repo = { findVisit: () => { called = true; return Promise.resolve(null); } };
let code = 200;
let body = null;
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return changeStatus(repo)({ user: { id: 1, role: 'master' }, params: { id: '1' }, body: { status: 'Отменён' } }, res).then(function () {
  ctx.assert(code === 400, 'Ожидался код 400, сейчас: ' + code);
  ctx.assert(body && body.error === 'Недопустимый статус', 'Текст ошибки: ' + ctx.preview(body));
  ctx.assert(called === false, 'При неверном статусе к базе обращаться не нужно');
});`,
        points: 6,
      },
      {
        id: 'unauthorized',
        name: 'Без входа — 401',
        type: 'assert',
        code: `const changeStatus = ctx.get('changeStatus');
let code = 200;
const res = { status: (c) => { code = c; return res; }, json: () => res };
return changeStatus({ findVisit: () => Promise.resolve(null) })(
  { params: { id: '1' }, body: { status: 'Пришёл' } },
  res,
).then(function () {
  ctx.assert(code === 401, 'Ожидался код 401, сейчас: ' + code);
});`,
        points: 4,
      },
      {
        id: 'foreign',
        name: 'Чужая запись закрыта от мастера',
        type: 'assert',
        code: `const changeStatus = ctx.get('changeStatus');
let updated = false;
const repo = {
  findVisit: () => Promise.resolve({ id: 1, masterId: 42, status: 'Записан' }),
  updateStatus: () => { updated = true; return Promise.resolve({ id: 1, status: 'Пришёл' }); },
};
let code = 200;
let body = null;
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return changeStatus(repo)({ user: { id: 7, role: 'master' }, params: { id: '1' }, body: { status: 'Пришёл' } }, res).then(function () {
  ctx.assert(code === 403, 'Ожидался код 403, сейчас: ' + code);
  ctx.assert(updated === false, 'Чужая запись меняться не должна');
});`,
        points: 6,
      },
      {
        id: 'admin',
        name: 'Администратор может всё',
        type: 'assert',
        code: `const changeStatus = ctx.get('changeStatus');
const repo = {
  findVisit: () => Promise.resolve({ id: 1, masterId: 42, status: 'Записан' }),
  updateStatus: (id, status) => Promise.resolve({ id: 1, masterId: 42, status }),
};
let code = 200;
let body = null;
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return changeStatus(repo)({ user: { id: 7, role: 'admin' }, params: { id: '1' }, body: { status: 'Пришёл' } }, res).then(function () {
  ctx.assert(code === 200, 'Администратору код 200, сейчас: ' + code);
  ctx.assert(body && body.status === 'Пришёл', 'Должна вернуться обновлённая запись: ' + ctx.preview(body));
});`,
        points: 6,
      },
      {
        id: 'empty-schedule',
        name: 'Пустое расписание — не ошибка',
        type: 'assert',
        code: `const masterSchedule = ctx.get('masterSchedule');
const make = () => { const s = { code: 200, body: null }; s.res = { status: (c) => { s.code = c; return s.res; }, json: (b) => { s.body = b; return s.res; } }; return s; };
const empty = make();
const full = make();
return Promise.all([
  masterSchedule({ listByMaster: () => Promise.resolve([]) })({ user: { id: 1 } }, empty.res),
  masterSchedule({ listByMaster: () => Promise.resolve([{ id: 1 }]) })({ user: { id: 1 } }, full.res),
]).then(function () {
  ctx.assert(empty.code === 200, 'Пустой список — обычный ответ 200, сейчас: ' + empty.code);
  ctx.assert(empty.body && empty.body.empty === true, 'Признак пустоты: ' + ctx.preview(empty.body));
  ctx.assert(full.body && full.body.empty === false, 'Непустой список: ' + ctx.preview(full.body));
  ctx.assert(full.body.items.length === 1, 'Записи должны вернуться: ' + ctx.preview(full.body));
});`,
        points: 6,
      },
      {
        id: 'server-error',
        name: 'Ошибка хранилища без подробностей',
        type: 'assert',
        code: `const masterSchedule = ctx.get('masterSchedule');
let code = 200;
let body = null;
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return masterSchedule({ listByMaster: () => Promise.reject(new Error('connection lost at pool.js:42')) })(
  { user: { id: 1 } },
  res,
).then(function () {
  ctx.assert(code === 500, 'Ожидался код 500, сейчас: ' + code);
  ctx.assert(body && body.error === 'Ошибка сервера', 'Текст ошибки: ' + ctx.preview(body));
  ctx.assert(JSON.stringify(body).indexOf('pool.js') === -1, 'Подробности наружу не отдают');
});`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Проверка статуса не требует базы — ставьте её сразу после проверки входа.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Право на запись есть у её мастера или у администратора: item.masterId === req.user.id || req.user.role === "admin".',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'return res.json({ items, empty: items.length === 0 }); — пустой список это состояние, а не ошибка.',
        penaltyPercent: 35,
      },
    ],
    solution: `const ALLOWED = ['Записан', 'Пришёл', 'Не пришёл'];

function changeStatus(repo) {
  return async function (req, res) {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется вход' });
    }

    const status = (req.body || {}).status;

    if (ALLOWED.indexOf(status) === -1) {
      return res.status(400).json({ error: 'Недопустимый статус' });
    }

    try {
      const visit = await repo.findVisit(req.params.id);

      if (!visit) {
        return res.status(404).json({ error: 'Запись не найдена' });
      }

      const own = visit.masterId === req.user.id;
      const admin = req.user.role === 'admin';

      if (!own && !admin) {
        return res.status(403).json({ error: 'Нет доступа' });
      }

      const updated = await repo.updateStatus(req.params.id, status);
      return res.json(updated);
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  };
}

function masterSchedule(repo) {
  return async function (req, res) {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется вход' });
    }

    try {
      const items = await repo.listByMaster(req.user.id);
      return res.json({ items, empty: items.length === 0 });
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  };
}`,
    solutionExplanation:
      'Пустой список — не ошибка, и это одно из самых частых заблуждений. Сервер отвечает двухсотым кодом с пустым массивом, а интерфейс уже решает, что показать: «записей пока нет» и подсказку, что делать. Если отвечать четыреста четвёртым, клиент начнёт показывать сообщение об ошибке там, где всё в порядке. Признак empty добавлен не ради краткости кода на клиенте, а чтобы состояние было явным: проверка items.length === 0 на клиенте легко теряется при рефакторинге.',
    maxScore: 33,
    estimatedMinutes: 45,
    examRefs: ['m3-quality', 'm1-admin', 'm3-db'],
    planDays: ['day-28-4'],
    source: 'plan',
  },

  {
    id: 'task-checklist-time',
    title: 'Разбор: куда уходит время',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['js'],
    topicIds: ['exam-checklist'],
    monthNo: 7,
    weekNo: 28,
    statement: `Закрытые пункты — половина картины. Вторая половина: сколько времени они стоили. Пункт, закрытый за сорок минут при весе 2, — это проблема, даже если он закрыт.

Записи: \`{ id, title, weight, minutes, done }\`.

1. \`costPerWeight(item)\` — минут на единицу веса, округлённо до одного знака.
2. \`expensive(items, limit)\` — закрытые пункты, у которых стоимость выше \`limit\`, от самых дорогих к дешёвым.
3. \`wasted(items)\` — сколько минут ушло на незакрытые пункты. Это время потрачено впустую: пункт не закрыт, баллы не получены.
4. \`budget(items)\` — \`{ useful, wasted, percent }\`, где \`useful\` — минуты на закрытые, \`percent\` — доля полезного времени, округлённая.
5. \`worstItem(items)\` — самый дорогой закрытый пункт или \`null\`.`,
    requirements: [
      'Стоимость за единицу веса считается',
      'Дорогие пункты отбираются и сортируются',
      'Потерянное время считается по незакрытым',
      'Бюджет показывает долю полезного времени',
      'Самый дорогой пункт определяется',
    ],
    starterCode: `function costPerWeight(item) {
  // минут на единицу веса
}

function expensive(items, limit) {
  // дорогие закрытые пункты
}

function wasted(items) {
  // минуты впустую
}

function budget(items) {
  // { useful, wasted, percent }
}

function worstItem(items) {
  // самый дорогой закрытый
}`,
    tests: [
      {
        id: 'cost',
        name: 'Стоимость за единицу веса',
        type: 'assert',
        code: `const costPerWeight = ctx.get('costPerWeight');
ctx.assert(costPerWeight({ weight: 2, minutes: 40 }) === 20, 'Получено: ' + costPerWeight({ weight: 2, minutes: 40 }));
ctx.assert(costPerWeight({ weight: 3, minutes: 40 }) === 13.3, 'Округление до одного знака: ' + costPerWeight({ weight: 3, minutes: 40 }));`,
        points: 5,
      },
      {
        id: 'expensive',
        name: 'Дорогие пункты',
        type: 'assert',
        code: `const expensive = ctx.get('expensive');
const items = [
  { id: 'a', title: 'Админка', weight: 4, minutes: 40, done: true },
  { id: 'b', title: 'Слайдер', weight: 2, minutes: 40, done: true },
  { id: 'c', title: 'База', weight: 3, minutes: 15, done: true },
  { id: 'd', title: 'Отзывы', weight: 2, minutes: 60, done: false },
];
// Стоимости: a = 10, b = 20, c = 5. При пороге 9 проходят a и b.
const result = expensive(items, 9);
ctx.assert(result.map((i) => i.id).join(',') === 'b,a', 'Ожидались b,a — получено: ' + result.map((i) => i.id).join(','));
ctx.assert(expensive(items, 10).map((i) => i.id).join(',') === 'b', 'Порог строгий: при 10 пункт a со стоимостью ровно 10 не проходит');
ctx.assert(result.map((i) => i.id).indexOf('d') === -1, 'Незакрытые пункты в этот список не входят');`,
        points: 6,
      },
      {
        id: 'wasted',
        name: 'Потерянное время',
        type: 'assert',
        code: `const wasted = ctx.get('wasted');
const items = [
  { id: 'a', weight: 4, minutes: 40, done: true },
  { id: 'b', weight: 2, minutes: 30, done: false },
  { id: 'c', weight: 2, minutes: 20, done: false },
];
ctx.assert(wasted(items) === 50, 'Ожидалось 50 минут, получено: ' + wasted(items));
ctx.assert(wasted([]) === 0, 'Для пустого списка — 0');`,
        points: 5,
      },
      {
        id: 'budget',
        name: 'Бюджет времени',
        type: 'assert',
        code: `const budget = ctx.get('budget');
const items = [
  { id: 'a', weight: 4, minutes: 60, done: true },
  { id: 'b', weight: 2, minutes: 40, done: false },
];
const result = budget(items);
ctx.assert(result.useful === 60, 'Полезных минут 60, получено: ' + result.useful);
ctx.assert(result.wasted === 40, 'Потерянных 40, получено: ' + result.wasted);
ctx.assert(result.percent === 60, 'Доля полезного 60%, получено: ' + result.percent);
ctx.assert(budget([]).percent === 0, 'Для пустого списка — 0%');`,
        points: 6,
      },
      {
        id: 'worst',
        name: 'Самый дорогой пункт',
        type: 'assert',
        code: `const worstItem = ctx.get('worstItem');
const items = [
  { id: 'a', title: 'Админка', weight: 4, minutes: 40, done: true },
  { id: 'b', title: 'Слайдер', weight: 2, minutes: 40, done: true },
];
ctx.assert(worstItem(items) && worstItem(items).id === 'b', 'Получено: ' + ctx.preview(worstItem(items)));
ctx.assert(worstItem([{ id: 'x', weight: 2, minutes: 10, done: false }]) === null, 'Когда закрытых нет, нужен null');`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Стоимость: минуты, делённые на вес. Округление до одного знака — Math.round(value * 10) / 10.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'В expensive сначала отберите закрытые, потом фильтруйте по стоимости, потом сортируйте по убыванию.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const done = items.filter((i) => i.done); return done.length === 0 ? null : done.slice().sort((a, b) => costPerWeight(b) - costPerWeight(a))[0];',
        penaltyPercent: 35,
      },
    ],
    solution: `function costPerWeight(item) {
  return Math.round((item.minutes / item.weight) * 10) / 10;
}

function expensive(items, limit) {
  return items
    .filter((item) => item.done && costPerWeight(item) > limit)
    .sort((a, b) => costPerWeight(b) - costPerWeight(a));
}

function wasted(items) {
  return items.filter((item) => !item.done).reduce((sum, item) => sum + item.minutes, 0);
}

function budget(items) {
  const useful = items.filter((item) => item.done).reduce((sum, item) => sum + item.minutes, 0);
  const lost = wasted(items);
  const total = useful + lost;

  return { useful, wasted: lost, percent: total === 0 ? 0 : Math.round((useful / total) * 100) };
}

function worstItem(items) {
  const done = items.filter((item) => item.done);
  if (done.length === 0) return null;

  return done.slice().sort((a, b) => costPerWeight(b) - costPerWeight(a))[0];
}`,
    solutionExplanation:
      'Минуты на единицу веса — грубая, но честная мера. Слайдер весом 2, на который ушло сорок минут, стоил столько же времени, сколько админка весом 4, — и именно его стоит тренировать отдельно, а не переписывать заново весь проект. Отдельная строка — время на незакрытые пункты: оно потрачено полностью впустую, баллов не принесло, и если его больше трети, значит план прогона был неверным с самого начала.',
    maxScore: 27,
    estimatedMinutes: 25,
    examRefs: ['m3-quality'],
    planDays: ['day-28-5'],
    source: 'plan',
  },

  {
    id: 'task-sql-recall-subqueries',
    title: 'Повторение SQL: подзапросы и отбор по связанным данным',
    kind: 'db',
    runtime: 'sql',
    difficulty: 4,
    tech: ['sql'],
    topicIds: ['memory-training'],
    monthNo: 7,
    weekNo: 28,
    statement: `Спокойный день после двух прогонов. Сегодня — подзапросы: они выручают там, где соединение даёт лишние строки.

База салона готова: \`clients\`, \`services\`, \`masters\`, \`visits\`.

1. Клиенты, у которых нет ни одной записи: \`full_name\`, по алфавиту.
2. Услуги дороже средней цены: \`title\`, \`price\`, по убыванию цены.
3. Мастера, у которых есть хотя бы одна запись со статусом \`'Пришёл'\`: \`full_name\`, по алфавиту.
4. Самая дорогая услуга: \`title\`, одна строка.
5. Клиенты и число их записей, включая тех, у кого записей нет: \`full_name\`, \`total\`, по убыванию количества, затем по имени.

Первый и третий пункты решаются и подзапросом, и соединением — но подзапрос читается понятнее и не рискует размножить строки.`,
    requirements: [
      'Отбор записей без связанных',
      'Сравнение со средним значением',
      'Отбор по наличию связанных записей',
      'Поиск максимума',
      'Подсчёт с учётом тех, у кого ничего нет',
    ],
    setupSql: `
CREATE TABLE clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL
);

CREATE TABLE services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL UNIQUE,
  price REAL NOT NULL
);

CREATE TABLE masters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL
);

CREATE TABLE visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL REFERENCES clients(id),
  service_id INTEGER NOT NULL REFERENCES services(id),
  master_id INTEGER NOT NULL REFERENCES masters(id),
  status TEXT NOT NULL
);

INSERT INTO clients (id, full_name) VALUES (1, 'Иванова Ирина'), (2, 'Петрова Полина'), (3, 'Сидорова Софья');

INSERT INTO services (id, title, price) VALUES
  (1, 'Стрижка', 1500.0),
  (2, 'Окрашивание', 4800.0),
  (3, 'Маникюр', 2200.0);

INSERT INTO masters (id, full_name) VALUES (1, 'Кузнецова Ксения'), (2, 'Морозова Мария');

INSERT INTO visits (client_id, service_id, master_id, status) VALUES
  (1, 1, 1, 'Пришёл'),
  (1, 2, 1, 'Записан'),
  (2, 3, 2, 'Не пришёл');
`,
    starterCode: `-- 1. Клиенты без записей


-- 2. Услуги дороже средней


-- 3. Мастера с состоявшимися визитами


-- 4. Самая дорогая услуга


-- 5. Клиенты и число записей

`,
    tests: [
      {
        id: 'no-visits',
        name: 'Клиенты без записей',
        type: 'sql-query',
        check: `SELECT full_name FROM clients WHERE id NOT IN (SELECT client_id FROM visits) ORDER BY full_name`,
        expectedColumns: ['full_name'],
        expectedRows: [['Сидорова Софья']],
        points: 6,
      },
      {
        id: 'above-average',
        name: 'Услуги дороже средней',
        type: 'sql-query',
        check: `SELECT title, price FROM services WHERE price > (SELECT AVG(price) FROM services) ORDER BY price DESC`,
        expectedColumns: ['title', 'price'],
        expectedRows: [['Окрашивание', 4800.0]],
        points: 6,
      },
      {
        id: 'masters-with-visits',
        name: 'Мастера с состоявшимися визитами',
        type: 'sql-query',
        check: `SELECT full_name FROM masters WHERE id IN (SELECT master_id FROM visits WHERE status = 'Пришёл') ORDER BY full_name`,
        expectedColumns: ['full_name'],
        expectedRows: [['Кузнецова Ксения']],
        points: 6,
      },
      {
        id: 'max-price',
        name: 'Самая дорогая услуга',
        type: 'sql-query',
        check: `SELECT title FROM services WHERE price = (SELECT MAX(price) FROM services)`,
        expectedColumns: ['title'],
        expectedRows: [['Окрашивание']],
        points: 5,
      },
      {
        id: 'counts',
        name: 'Клиенты и число записей',
        type: 'sql-query',
        check: `SELECT c.full_name, COUNT(v.id) AS total FROM clients c LEFT JOIN visits v ON v.client_id = c.id GROUP BY c.id, c.full_name ORDER BY total DESC, c.full_name`,
        expectedColumns: ['full_name', 'total'],
        expectedRows: [
          ['Иванова Ирина', 2],
          ['Петрова Полина', 1],
          ['Сидорова Софья', 0],
        ],
        ordered: true,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Подзапрос в скобках можно поставить и в WHERE, и в сравнение: WHERE price > (SELECT AVG(price) FROM services).',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'NOT IN с подзапросом читается прямо как условие: «идентификатора нет среди тех, что встречаются в visits».',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Для пятого пункта нужен LEFT JOIN: с обычным JOIN клиент без записей просто исчезнет из результата.',
        penaltyPercent: 35,
      },
    ],
    solution: `SELECT full_name
FROM clients
WHERE id NOT IN (SELECT client_id FROM visits)
ORDER BY full_name;

SELECT title, price
FROM services
WHERE price > (SELECT AVG(price) FROM services)
ORDER BY price DESC;

SELECT full_name
FROM masters
WHERE id IN (SELECT master_id FROM visits WHERE status = 'Пришёл')
ORDER BY full_name;

SELECT title
FROM services
WHERE price = (SELECT MAX(price) FROM services);

SELECT c.full_name, COUNT(v.id) AS total
FROM clients c
LEFT JOIN visits v ON v.client_id = c.id
GROUP BY c.id, c.full_name
ORDER BY total DESC, c.full_name;`,
    solutionExplanation:
      'Третий пункт показателен: его можно решить соединением, но тогда мастер с тремя состоявшимися визитами появится в результате трижды, и понадобится DISTINCT. Подзапрос с IN даёт ровно по одной строке на мастера сам по себе. Пятый пункт наоборот требует соединения, причём именно LEFT JOIN: клиент без записей должен попасть в отчёт с нулём, а не исчезнуть. Правило простое: нужен признак «есть или нет» — подзапрос; нужны данные из обеих таблиц — соединение.',
    maxScore: 29,
    estimatedMinutes: 35,
    examRefs: ['m1-admin', 'm3-db'],
    planDays: ['day-28-6'],
    source: 'plan',
  },

  {
    id: 'task-driving-school-module1',
    title: 'Полный прогон: автошкола и связь «многие ко многим»',
    kind: 'db',
    runtime: 'sql',
    difficulty: 5,
    tech: ['sql'],
    topicIds: ['exam-strategy'],
    monthNo: 7,
    weekNo: 29,
    statement: `Новая тема — **автошкола**. Здесь впервые появляется связь, которой не было в прошлых проектах: один ученик может открывать несколько категорий, и одну категорию открывают многие ученики. Такая связь не помещается ни в одну из двух таблиц — для неё заводят третью.

1. \`students\` — \`id\`, \`phone\` (текст, обязательный, уникальный), \`full_name\` (обязательный).
2. \`categories\` — \`id\`, \`code\` (обязательный, уникальный: \`'A'\`, \`'B'\`, \`'C'\`), \`title\` (обязательный).
3. \`student_categories\` — связующая таблица: \`student_id\`, \`category_id\` (оба обязательные внешние ключи), \`started_on\` (обязательная дата). Пара «ученик и категория» уникальна.
4. \`instructors\` — \`id\`, \`full_name\` (обязательный).
5. \`lessons\` — \`id\`, \`student_id\`, \`instructor_id\` (обязательные внешние ключи), \`lesson_at\` (обязательная дата), \`status\` (по умолчанию \`'Назначено'\`, ограничен списком \`'Назначено'\`, \`'Проведено'\`, \`'Отменено'\`).
6. Заполните: три категории, два инструктора, двух учеников, три связи «ученик — категория», четыре занятия.`,
    requirements: [
      'Пять таблиц созданы',
      'Связующая таблица имеет два внешних ключа',
      'Пара «ученик и категория» уникальна',
      'Статус занятия ограничен списком',
      'Справочники заполнены',
      'Связи «многие ко многим» работают',
    ],
    starterCode: `-- Автошкола: связь «многие ко многим»

`,
    tests: [
      {
        id: 'link-table',
        name: 'Связующая таблица',
        type: 'sql-schema',
        table: 'student_categories',
        columns: [
          { name: 'student_id', notNull: true },
          { name: 'category_id', notNull: true },
          { name: 'started_on', notNull: true },
        ],
        foreignKeys: [
          { column: 'student_id', refTable: 'students' },
          { column: 'category_id', refTable: 'categories' },
        ],
        points: 6,
      },
      {
        id: 'unique-pair',
        name: 'Пара «ученик и категория» уникальна',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM pragma_index_list('student_categories') WHERE "unique" = 1`,
        expectedRows: [[1]],
        points: 6,
      },
      {
        id: 'lessons',
        name: 'Занятия связаны с учеником и инструктором',
        type: 'sql-schema',
        table: 'lessons',
        columns: [
          { name: 'id', pk: true },
          { name: 'student_id', notNull: true },
          { name: 'instructor_id', notNull: true },
          { name: 'lesson_at', notNull: true },
          { name: 'status', notNull: true },
        ],
        foreignKeys: [
          { column: 'student_id', refTable: 'students' },
          { column: 'instructor_id', refTable: 'instructors' },
        ],
        points: 5,
      },
      {
        id: 'status-check',
        name: 'Статус ограничен списком',
        type: 'sql-query',
        check: `SELECT CASE WHEN instr(upper(sql), 'CHECK') > 0 AND instr(sql, 'Проведено') > 0 AND instr(sql, 'Отменено') > 0 THEN 1 ELSE 0 END FROM sqlite_master WHERE type = 'table' AND name = 'lessons'`,
        expectedRows: [[1]],
        points: 5,
      },
      {
        id: 'data',
        name: 'Данные заполнены',
        type: 'sql-query',
        check: `SELECT (SELECT COUNT(*) FROM categories), (SELECT COUNT(*) FROM instructors), (SELECT COUNT(*) FROM lessons)`,
        expectedRows: [[3, 2, 4]],
        points: 5,
      },
      {
        id: 'many-to-many',
        name: 'Связь «многие ко многим» работает',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM student_categories sc JOIN students s ON s.id = sc.student_id JOIN categories c ON c.id = sc.category_id`,
        expectedRows: [[3]],
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Связующая таблица — обычная таблица с двумя внешними ключами. Своего смыслового содержимого у неё почти нет.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Уникальность пары задаётся строкой UNIQUE (student_id, category_id) в конце описания таблицы.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Три связи на двух учеников: первому две категории, второму одну. Так видно, что связь действительно «многие ко многим».',
        penaltyPercent: 35,
      },
    ],
    solution: `CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(30) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(5) NOT NULL UNIQUE,
  title VARCHAR(100) NOT NULL
);

CREATE TABLE instructors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL
);

CREATE TABLE student_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  category_id INT NOT NULL,
  started_on DATE NOT NULL,
  UNIQUE (student_id, category_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE lessons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  instructor_id INT NOT NULL,
  lesson_at DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Назначено'
    CHECK (status IN ('Назначено', 'Проведено', 'Отменено')),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (instructor_id) REFERENCES instructors(id)
);

INSERT INTO categories (id, code, title) VALUES
  (1, 'A', 'Мотоциклы'),
  (2, 'B', 'Легковые автомобили'),
  (3, 'C', 'Грузовые автомобили');

INSERT INTO instructors (id, full_name) VALUES
  (1, 'Сидоров Сергей'),
  (2, 'Кузнецов Кирилл');

INSERT INTO students (id, phone, full_name) VALUES
  (1, '+7 (900) 123-45-67', 'Иванов Иван'),
  (2, '+7 (900) 765-43-21', 'Петрова Полина');

INSERT INTO student_categories (student_id, category_id, started_on) VALUES
  (1, 1, '2027-02-01'),
  (1, 2, '2027-02-01'),
  (2, 2, '2027-03-01');

INSERT INTO lessons (student_id, instructor_id, lesson_at, status) VALUES
  (1, 1, '2027-03-12', 'Проведено'),
  (1, 2, '2027-03-14', 'Назначено'),
  (2, 1, '2027-03-15', 'Назначено'),
  (2, 2, '2027-03-16', 'Отменено');`,
    solutionExplanation:
      'Связь «многие ко многим» нельзя записать внешним ключом ни в одной из двух таблиц: в students пришлось бы хранить несколько категорий, в categories — несколько учеников, а перечислять значения через запятую в одной ячейке нельзя. Поэтому заводят третью таблицу, каждая строка которой — одна пара. Ограничение уникальности пары обязательно: без него одного ученика можно записать на категорию B дважды, и дальше отчёты начнут врать. Столбец started_on показывает, что связующая таблица может иметь и собственные данные — дату начала обучения.',
    maxScore: 33,
    estimatedMinutes: 45,
    examRefs: ['m1-db', 'm1-er', 'm3-db'],
    planDays: ['day-29-1'],
    source: 'plan',
  },

  {
    id: 'task-error-catalog',
    title: 'Каталог собственных ошибок: находить их в своём коде',
    kind: 'function',
    runtime: 'js',
    difficulty: 4,
    tech: ['js'],
    topicIds: ['exam-debrief'],
    monthNo: 7,
    weekNo: 29,
    statement: `За месяцы прогонов у каждого набирается свой список типовых ошибок. Превратите его в инструмент: пусть код ищет их сам.

1. \`RULES\` — пять правил вида \`{ id, title, test }\`, где \`test(code)\` возвращает \`true\`, если ошибка найдена:
   - \`'sql-concat'\` — значение склеивается в текст запроса (шаблонная строка с \`SELECT\`/\`INSERT\`/\`UPDATE\`/\`DELETE\` и \`\${\`);
   - \`'sort-mutates'\` — вызов \`.sort(\` без \`.slice()\` перед ним в той же строке;
   - \`'loose-equal'\` — сравнение через \`==\` или \`!=\` (но не \`===\` и не \`!==\`);
   - \`'alert'\` — вызов \`alert(\`;
   - \`'no-prevent'\` — есть обработчик \`onSubmit\` или \`'submit'\`, но нет \`preventDefault\`.
2. \`lint(code)\` — список названий найденных ошибок в порядке из \`RULES\`.
3. \`isClean(code)\` — ошибок не найдено.
4. \`worstRule(codes)\` — идентификатор правила, которое срабатывает чаще всего на массиве фрагментов. При равенстве — тот, что раньше в \`RULES\`. Если ничего не сработало — \`null\`.`,
    requirements: [
      'Описаны все пять правил',
      'Склейка в запросе находится',
      'Сортировка без копии находится',
      'Нестрогое сравнение находится, строгое — нет',
      'Отсутствие preventDefault находится',
      'worstRule определяет самую частую ошибку',
    ],
    starterCode: `const RULES = [
  // пять правил { id, title, test }
];

function lint(code) {
  // названия найденных ошибок
}

function isClean(code) {
  // чисто ли
}

function worstRule(codes) {
  // самая частая ошибка
}`,
    tests: [
      {
        id: 'rules',
        name: 'Пять правил описаны',
        type: 'assert',
        code: `const RULES = ctx.get('RULES');
ctx.assert(Array.isArray(RULES) && RULES.length === 5, 'Правил должно быть пять, найдено: ' + (RULES || []).length);
['sql-concat', 'sort-mutates', 'loose-equal', 'alert', 'no-prevent'].forEach((id) => {
  const rule = RULES.filter((item) => item.id === id)[0];
  ctx.assert(rule, 'Нет правила ' + id);
  ctx.assert(typeof rule.test === 'function', 'У правила ' + id + ' поле test должно быть функцией');
  ctx.assert(typeof rule.title === 'string' && rule.title.length >= 10, 'У правила ' + id + ' нет внятного названия');
});`,
        points: 6,
      },
      {
        id: 'sql',
        name: 'Склейка в запросе',
        type: 'assert',
        code: `const lint = ctx.get('lint');
const bad = 'const rows = await db.query(\`SELECT * FROM users WHERE login = \${login}\`);';
const good = "const rows = await db.query('SELECT * FROM users WHERE login = ?', [login]);";
ctx.assert(lint(bad).length >= 1, 'Склейка в запросе должна находиться');
ctx.assert(lint(good).length === 0, 'Правильный запрос не должен помечаться: ' + ctx.preview(lint(good)));`,
        points: 6,
      },
      {
        id: 'sort',
        name: 'Сортировка без копии',
        type: 'assert',
        code: `const RULES = ctx.get('RULES');
const rule = RULES.filter((item) => item.id === 'sort-mutates')[0];
ctx.assert(rule.test('const sorted = items.sort((a, b) => a.id - b.id);') === true, 'sort без копии должен находиться');
ctx.assert(rule.test('const sorted = items.slice().sort((a, b) => a.id - b.id);') === false, 'sort после slice — это правильно');`,
        points: 6,
      },
      {
        id: 'equal',
        name: 'Нестрогое сравнение',
        type: 'assert',
        code: `const RULES = ctx.get('RULES');
const rule = RULES.filter((item) => item.id === 'loose-equal')[0];
ctx.assert(rule.test('if (a == b) return 1;') === true, 'Сравнение == должно находиться');
ctx.assert(rule.test('if (a != b) return 1;') === true, 'Сравнение != должно находиться');
ctx.assert(rule.test('if (a === b) return 1;') === false, 'Строгое сравнение помечать не нужно');
ctx.assert(rule.test('if (a !== b) return 1;') === false, 'Строгое неравенство помечать не нужно');`,
        points: 7,
      },
      {
        id: 'prevent',
        name: 'Отсутствие preventDefault',
        type: 'assert',
        code: `const RULES = ctx.get('RULES');
const rule = RULES.filter((item) => item.id === 'no-prevent')[0];
ctx.assert(rule.test('form.addEventListener("submit", function (event) { send(); });') === true, 'Обработчик без preventDefault должен находиться');
ctx.assert(
  rule.test('form.addEventListener("submit", function (event) { event.preventDefault(); send(); });') === false,
  'С preventDefault помечать не нужно',
);
ctx.assert(rule.test('const total = items.length;') === false, 'Код без обработчика отправки помечать не нужно');`,
        points: 6,
      },
      {
        id: 'worst',
        name: 'Самая частая ошибка',
        type: 'assert',
        code: `const worstRule = ctx.get('worstRule');
const codes = [
  'if (a == b) return 1;',
  'if (x != y) return 2;',
  'alert("готово");',
  'if (c == d) return 3;',
];
ctx.assert(worstRule(codes) === 'loose-equal', 'Получено: ' + ctx.preview(worstRule(codes)));
ctx.assert(worstRule(['const total = items.length;']) === null, 'Когда ошибок нет, нужен null');`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Нестрогое сравнение ищется с оглядкой на соседние символы: перед == не должно быть = или !, и после него тоже.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Правило про sort проверяйте построчно: строка содержит .sort( и при этом не содержит .slice().',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'loose-equal: /[^=!<>]==[^=]|[^!]!=[^=]/.test(code) — соседние символы отсекают === и !==.',
        penaltyPercent: 35,
      },
    ],
    solution: `const RULES = [
  {
    id: 'sql-concat',
    title: 'Значение склеивается в текст SQL-запроса',
    test: (code) => /\`[^\`]*(SELECT|INSERT|UPDATE|DELETE)[^\`]*\\$\\{/i.test(code),
  },
  {
    id: 'sort-mutates',
    title: 'Сортировка портит исходный массив',
    test: (code) =>
      String(code)
        .split('\\n')
        .some((line) => line.indexOf('.sort(') !== -1 && line.indexOf('.slice()') === -1),
  },
  {
    id: 'loose-equal',
    title: 'Нестрогое сравнение вместо строгого',
    test: (code) => /[^=!<>]==[^=]|[^!=]!=[^=]/.test(code),
  },
  {
    id: 'alert',
    title: 'Сообщение через alert вместо интерфейса',
    test: (code) => /\\balert\\s*\\(/.test(code),
  },
  {
    id: 'no-prevent',
    title: 'Обработчик отправки без preventDefault',
    test: (code) => /onSubmit|['"]submit['"]/.test(code) && !/preventDefault/.test(code),
  },
];

function lint(code) {
  return RULES.filter((rule) => rule.test(code)).map((rule) => rule.title);
}

function isClean(code) {
  return lint(code).length === 0;
}

function worstRule(codes) {
  const counts = RULES.map((rule) => ({
    id: rule.id,
    total: codes.filter((code) => rule.test(code)).length,
  }));

  const best = counts.reduce((current, item) => (item.total > current.total ? item : current), counts[0]);

  return best.total === 0 ? null : best.id;
}`,
    solutionExplanation:
      'Каталог ошибок работает потому, что каждая из пяти проверок ловит не стиль, а конкретный дефект с известными последствиями. Склейка в запросе — дыра в безопасности, сортировка без копии — неперерисованный список, нестрогое сравнение — неожиданные приведения типов, alert — остановленный браузер вместо подсказки, отсутствие preventDefault — перезагрузка страницы с потерей данных. Список стоит держать своим: у каждого он получается разный, и в этом его ценность.',
    maxScore: 37,
    estimatedMinutes: 35,
    examRefs: ['m3-quality'],
    planDays: ['day-29-2'],
    source: 'plan',
  },

  {
    id: 'task-drill-react-list',
    title: 'Тренировка слабых мест: список с фильтром за 15 минут',
    kind: 'app',
    runtime: 'react',
    difficulty: 3,
    tech: ['react'],
    topicIds: ['memory-training'],
    monthNo: 7,
    weekNo: 29,
    statement: `Самый частый экран приложения: список, фильтр, счётчик, пустое состояние. Пишется за пятнадцать минут, если не вспоминать.

Компонент \`LessonList\` принимает \`{ lessons }\` — массив \`{ id, student, instructor, date, status }\` (дата в \`ГГГГ-ММ-ДД\`).

1. Карточки \`.lesson\` с датой в формате **ДД.ММ.ГГГГ**.
2. Фильтр \`#filter\` по статусу («Назначено», «Проведено», «Отменено»), пустое значение — все.
3. Поиск \`#search\` по имени ученика: показываются только те, у кого имя содержит введённое (без учёта регистра). Работает вместе с фильтром.
4. Счётчик \`#count\` по видимым карточкам.
5. Если ничего не найдено — блок \`#empty\` с текстом «Ничего не найдено».`,
    requirements: [
      'Даты выводятся в формате ДД.ММ.ГГГГ',
      'Фильтр по статусу работает',
      'Поиск по имени работает без учёта регистра',
      'Фильтр и поиск работают вместе',
      'Счётчик считает видимые карточки',
      'Пустой результат объяснён',
    ],
    starterCode: `const STATUSES = ['Назначено', 'Проведено', 'Отменено'];

function LessonList({ lessons }) {
  // карточки, фильтр, поиск, счётчик, пустое состояние
}`,
    tests: [
      {
        id: 'cards',
        name: 'Карточки и даты',
        type: 'react',
        code: `const lessons = [
  { id: 1, student: 'Иванов Иван', instructor: 'Сидоров', date: '2027-03-12', status: 'Назначено' },
  { id: 2, student: 'Петрова Полина', instructor: 'Кузнецов', date: '2027-03-14', status: 'Проведено' },
];
return ctx.render('LessonList', { lessons })
  .then(() => ctx.change('#filter', ''))
  .then(() => ctx.change('#search', ''))
  .then(() => {
    ctx.assert(ctx.$$('.lesson').length === 2, 'Карточек должно быть две, найдено: ' + ctx.$$('.lesson').length);
    const text = ctx.text();
    ctx.assert(text.indexOf('12.03.2027') !== -1, 'Дата должна быть в формате ДД.ММ.ГГГГ, сейчас: ' + text.slice(0, 140));
    ctx.assert(!/\\d{4}-\\d{2}-\\d{2}/.test(text), 'Машинный формат даты показывать не нужно');
    ctx.assert(ctx.text('#count').indexOf('2') !== -1, 'Счётчик: ' + ctx.text('#count'));
  });`,
        points: 6,
      },
      {
        id: 'filter',
        name: 'Фильтр по статусу',
        type: 'react',
        code: `const lessons = [
  { id: 1, student: 'Иванов Иван', instructor: 'Сидоров', date: '2027-03-12', status: 'Назначено' },
  { id: 2, student: 'Петрова Полина', instructor: 'Кузнецов', date: '2027-03-14', status: 'Проведено' },
];
return ctx.render('LessonList', { lessons })
  .then(() => ctx.change('#search', ''))
  .then(() => ctx.change('#filter', 'Проведено'))
  .then(() => {
    const cards = ctx.$$('.lesson');
    ctx.assert(cards.length === 1, 'Должна остаться одна карточка, найдено: ' + cards.length);
    ctx.assert(cards[0].textContent.indexOf('Петрова') !== -1, 'Осталась не та карточка: ' + cards[0].textContent);
  });`,
        points: 5,
      },
      {
        id: 'search',
        name: 'Поиск по имени',
        type: 'react',
        code: `const lessons = [
  { id: 1, student: 'Иванов Иван', instructor: 'Сидоров', date: '2027-03-12', status: 'Назначено' },
  { id: 2, student: 'Петрова Полина', instructor: 'Кузнецов', date: '2027-03-14', status: 'Проведено' },
];
return ctx.render('LessonList', { lessons })
  .then(() => ctx.change('#filter', ''))
  .then(() => ctx.change('#search', 'иванов'))
  .then(() => {
    const cards = ctx.$$('.lesson');
    ctx.assert(cards.length === 1, 'Должна остаться одна карточка, найдено: ' + cards.length);
    ctx.assert(
      cards[0].textContent.indexOf('Иванов') !== -1,
      'Поиск должен работать без учёта регистра: ' + cards[0].textContent,
    );
  });`,
        points: 6,
      },
      {
        id: 'together',
        name: 'Фильтр и поиск вместе',
        type: 'react',
        code: `const lessons = [
  { id: 1, student: 'Иванов Иван', instructor: 'Сидоров', date: '2027-03-12', status: 'Назначено' },
  { id: 2, student: 'Иванова Ирина', instructor: 'Кузнецов', date: '2027-03-14', status: 'Проведено' },
];
return ctx.render('LessonList', { lessons })
  .then(() => ctx.change('#search', 'иванов'))
  .then(() => ctx.change('#filter', 'Проведено'))
  .then(() => {
    const cards = ctx.$$('.lesson');
    ctx.assert(cards.length === 1, 'Оба условия должны применяться сразу, найдено карточек: ' + cards.length);
    ctx.assert(cards[0].textContent.indexOf('Ирина') !== -1, 'Осталась не та карточка: ' + cards[0].textContent);
  });`,
        points: 6,
      },
      {
        id: 'empty',
        name: 'Пустой результат объяснён',
        type: 'react',
        code: `const lessons = [{ id: 1, student: 'Иванов Иван', instructor: 'Сидоров', date: '2027-03-12', status: 'Назначено' }];
return ctx.render('LessonList', { lessons })
  .then(() => ctx.change('#filter', ''))
  .then(() => ctx.change('#search', 'такого-ученика-нет'))
  .then(() => {
    ctx.assert(ctx.$$('.lesson').length === 0, 'Карточек быть не должно');
    ctx.assert(ctx.$('#empty'), 'Нужен блок #empty');
    ctx.assert(ctx.text('#empty').indexOf('Ничего не найдено') !== -1, 'Текст: ' + ctx.text('#empty'));
    ctx.assert(ctx.text('#count').indexOf('0') !== -1, 'Счётчик должен показывать 0: ' + ctx.text('#count'));
  });`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Два состояния: выбранный статус и строка поиска. Видимый список вычисляется из них обоих.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Поиск без учёта регистра: обе строки привести к нижнему регистру и проверить вхождение.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const visible = lessons.filter((l) => (!status || l.status === status) && l.student.toLowerCase().includes(query.toLowerCase()));',
        penaltyPercent: 35,
      },
    ],
    solution: `const STATUSES = ['Назначено', 'Проведено', 'Отменено'];

function LessonList({ lessons }) {
  const [status, setStatus] = React.useState('');
  const [query, setQuery] = React.useState('');

  const toRuDate = (iso) => iso.split('-').reverse().join('.');

  const visible = lessons.filter(
    (lesson) =>
      (!status || lesson.status === status) &&
      lesson.student.toLowerCase().indexOf(query.trim().toLowerCase()) !== -1,
  );

  return (
    <div>
      <label htmlFor="filter">Статус</label>
      <select id="filter" value={status} onChange={(event) => setStatus(event.target.value)}>
        <option value="">Все</option>
        {STATUSES.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>

      <label htmlFor="search">Ученик</label>
      <input id="search" value={query} onChange={(event) => setQuery(event.target.value)} />

      <p id="count">Показано занятий: {visible.length}</p>

      {visible.length > 0 ? (
        visible.map((lesson) => (
          <article className="lesson" key={lesson.id}>
            <h3>{lesson.student}</h3>
            <p>{lesson.instructor}</p>
            <p>{toRuDate(lesson.date)}</p>
            <p>{lesson.status}</p>
          </article>
        ))
      ) : (
        <p id="empty">Ничего не найдено</p>
      )}
    </div>
  );
}`,
    solutionExplanation:
      'Два условия отбора объединены в одном фильтре, а не применены по очереди двумя вызовами — так очевиднее, что они работают вместе, и нет соблазна где-то забыть одно из них. Строка поиска приводится к нижнему регистру и обрезается по краям: пользователь наберёт «Иванов» с большой буквы и, скорее всего, оставит пробел в конце. Пустое состояние выводится вместо списка, а счётчик остаётся на месте и показывает ноль — так видно, что поиск отработал, а не сломался.',
    maxScore: 29,
    estimatedMinutes: 15,
    timeLimitMs: 900_000,
    examRefs: ['m2-admin-tools', 'm1-cabinet'],
    planDays: ['day-29-3'],
    source: 'plan',
  },

  {
    id: 'task-driving-school-module2',
    title: 'Второй прогон недели: расписание автошколы',
    kind: 'app',
    runtime: 'react',
    difficulty: 5,
    tech: ['react'],
    topicIds: ['exam-strategy'],
    monthNo: 7,
    weekNo: 29,
    statement: `Та же автошкола, теперь интерфейс. Новое здесь — группировка: расписание показывают по дням, а не сплошным списком.

Компонент \`Schedule\` принимает \`{ lessons, onCancel }\`, где \`lessons\` — массив \`{ id, student, instructor, date, status }\` (дата в \`ГГГГ-ММ-ДД\`), а \`onCancel(id)\` возвращает промис.

1. Занятия сгруппированы по дате: для каждой даты блок \`.day\` с заголовком \`.day__title\` в формате **ДД.ММ.ГГГГ** и карточками \`.lesson\` внутри.
2. Дни идут по возрастанию даты, занятия внутри дня — по имени ученика.
3. Счётчик \`#count\` — общее число занятий.
4. У занятия со статусом \`'Назначено'\` есть кнопка \`.cancel\`; нажатие вызывает \`onCancel\` и меняет статус строки на \`'Отменено'\`, кнопка исчезает.
5. При отказе сервера статус возвращается к прежнему.`,
    requirements: [
      'Занятия сгруппированы по дням',
      'Заголовок дня в формате ДД.ММ.ГГГГ',
      'Дни идут по возрастанию, занятия внутри дня по имени',
      'Счётчик показывает общее число занятий',
      'Отмена меняет статус и убирает кнопку',
      'Отказ сервера возвращает прежний статус',
    ],
    starterCode: `function Schedule({ lessons, onCancel }) {
  // группировка по дням, сортировка, отмена занятия
}`,
    tests: [
      {
        id: 'grouping',
        name: 'Группировка по дням',
        type: 'react',
        code: `const lessons = [
  { id: 1, student: 'Петров Пётр', instructor: 'Сидоров', date: '2027-03-14', status: 'Назначено' },
  { id: 2, student: 'Иванов Иван', instructor: 'Кузнецов', date: '2027-03-12', status: 'Назначено' },
  { id: 3, student: 'Абрамов Антон', instructor: 'Сидоров', date: '2027-03-14', status: 'Проведено' },
];
return ctx.render('Schedule', { lessons, onCancel: () => Promise.resolve() }).then(() => {
  const days = ctx.$$('.day');
  ctx.assert(days.length === 2, 'Дней должно быть два, найдено: ' + days.length, 2, days.length);
  ctx.assert(ctx.$$('.lesson').length === 3, 'Занятий должно быть три, найдено: ' + ctx.$$('.lesson').length);
  ctx.assert(ctx.text('#count').indexOf('3') !== -1, 'Счётчик: ' + ctx.text('#count'));
});`,
        points: 6,
      },
      {
        id: 'day-order',
        name: 'Дни по возрастанию, формат ДД.ММ.ГГГГ',
        type: 'react',
        code: `const lessons = [
  { id: 1, student: 'Петров Пётр', instructor: 'Сидоров', date: '2027-03-14', status: 'Назначено' },
  { id: 2, student: 'Иванов Иван', instructor: 'Кузнецов', date: '2027-03-12', status: 'Назначено' },
];
return ctx.render('Schedule', { lessons, onCancel: () => Promise.resolve() }).then(() => {
  const titles = ctx.$$('.day__title').map((title) => title.textContent.trim());
  ctx.assert(titles.length >= 2, 'Заголовков дней должно быть минимум два');
  ctx.assert(titles[0] === '12.03.2027', 'Первым должен идти ранний день в формате ДД.ММ.ГГГГ, получено: ' + titles[0]);
  ctx.assert(titles[1] === '14.03.2027', 'Вторым — следующий день, получено: ' + titles[1]);
});`,
        points: 7,
      },
      {
        id: 'inner-order',
        name: 'Занятия внутри дня по имени',
        type: 'react',
        code: `const lessons = [
  { id: 1, student: 'Петров Пётр', instructor: 'Сидоров', date: '2027-03-14', status: 'Назначено' },
  { id: 3, student: 'Абрамов Антон', instructor: 'Сидоров', date: '2027-03-14', status: 'Проведено' },
];
return ctx.render('Schedule', { lessons, onCancel: () => Promise.resolve() }).then(() => {
  const day = ctx.$$('.day').filter((item) => item.textContent.indexOf('14.03.2027') !== -1)[0];
  ctx.assert(day, 'Не найден день 14.03.2027');
  const names = Array.prototype.slice.call(day.querySelectorAll('.lesson')).map((card) => card.textContent);
  ctx.assert(names.length === 2, 'В этом дне должно быть два занятия, найдено: ' + names.length);
  ctx.assert(names[0].indexOf('Абрамов') !== -1, 'Внутри дня занятия идут по имени ученика: ' + names[0].slice(0, 40));
});`,
        points: 6,
      },
      {
        id: 'cancel',
        name: 'Отмена занятия',
        type: 'react',
        code: `const lessons = [{ id: 7, student: 'Иванов Иван', instructor: 'Сидоров', date: '2027-03-12', status: 'Назначено' }];
const calls = [];
let before = 0;
// Компонент между проверками не пересоздаётся, поэтому считаем кнопки,
// а не полагаемся на то, что она одна.
return ctx.render('Schedule', { lessons, onCancel: (id) => { calls.push(id); return Promise.resolve(); } })
  .then(() => {
    before = ctx.$$('.cancel').length;
    ctx.assert(before >= 1, 'У назначенного занятия должна быть кнопка отмены');
    return ctx.click(ctx.$$('.cancel')[0]);
  })
  .then(() => ctx.advanceTime(50))
  .then(() => {
    ctx.assert(calls.length === 1, 'onCancel должен вызваться один раз, вызовов: ' + calls.length);
    ctx.assert(ctx.text().indexOf('Отменено') !== -1, 'Статус должен смениться на «Отменено»');
    ctx.assert(
      ctx.$$('.cancel').length === before - 1,
      'После отмены кнопка у этого занятия должна исчезнуть: было ' + before + ', стало ' + ctx.$$('.cancel').length,
    );
  });`,
        points: 7,
      },
      {
        id: 'rollback',
        name: 'Отказ возвращает прежний статус',
        type: 'react',
        code: `const lessons = [{ id: 8, student: 'Петров Пётр', instructor: 'Кузнецов', date: '2027-03-13', status: 'Назначено' }];
let before = 0;
return ctx.render('Schedule', { lessons, onCancel: () => Promise.reject(new Error('отказ')) })
  .then(() => {
    before = ctx.$$('.cancel').length;
    ctx.assert(before >= 1, 'Нужна хотя бы одна кнопка отмены');
    return ctx.click(ctx.$$('.cancel')[0]);
  })
  .then(() => ctx.advanceTime(100))
  .then(() => {
    ctx.assert(
      ctx.$$('.cancel').length === before,
      'После отказа кнопка должна вернуться: было ' + before + ', стало ' + ctx.$$('.cancel').length,
    );
  });`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Группировка: пройдите по занятиям и соберите объект { дата: [занятия] }, затем возьмите ключи и отсортируйте.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Даты в формате ГГГГ-ММ-ДД сортируются как обычные строки. Переводить в ДД.ММ.ГГГГ нужно только при выводе заголовка.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const byDate = items.reduce((acc, item) => { (acc[item.date] = acc[item.date] || []).push(item); return acc; }, {});',
        penaltyPercent: 35,
      },
    ],
    solution: `function Schedule({ lessons, onCancel }) {
  const [items, setItems] = React.useState(lessons);

  const toRuDate = (iso) => iso.split('-').reverse().join('.');

  const update = (id, status) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const cancel = (lesson) => {
    const previous = lesson.status;
    update(lesson.id, 'Отменено');
    onCancel(lesson.id).catch(() => update(lesson.id, previous));
  };

  const byDate = items.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  const days = Object.keys(byDate).sort();

  return (
    <div>
      <p id="count">Занятий всего: {items.length}</p>

      {days.map((date) => (
        <section className="day" key={date}>
          <h3 className="day__title">{toRuDate(date)}</h3>

          {byDate[date]
            .slice()
            .sort((a, b) => a.student.localeCompare(b.student, 'ru'))
            .map((lesson) => (
              <article className="lesson" key={lesson.id}>
                <p>{lesson.student}</p>
                <p>{lesson.instructor}</p>
                <p>{lesson.status}</p>

                {lesson.status === 'Назначено' ? (
                  <button className="cancel" type="button" onClick={() => cancel(lesson)}>
                    Отменить
                  </button>
                ) : null}
              </article>
            ))}
        </section>
      ))}
    </div>
  );
}`,
    solutionExplanation:
      'Группировка сделана обычным reduce в объект «дата → список», и ключи этого объекта уже готовы к сортировке, потому что даты хранятся в формате ГГГГ-ММ-ДД. Перевод в человеческий вид происходит только в заголовке — это то же правило, что и всегда: считаем в машинном формате, показываем в человеческом. Внутри дня список копируется перед сортировкой: массив взят прямо из объекта группировки, и сортировка на месте испортила бы его.',
    maxScore: 32,
    estimatedMinutes: 45,
    examRefs: ['m1-admin', 'm2-admin-tools', 'm2-order-form'],
    planDays: ['day-29-4'],
    source: 'plan',
  },

  {
    id: 'task-review-progress',
    title: 'Разбор: динамика по неделям',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['js'],
    topicIds: ['exam-debrief'],
    monthNo: 7,
    weekNo: 29,
    statement: `Смотрим не на один прогон, а на кривую. Один плохой результат ничего не значит; три подряд без роста — значит.

Записи по неделям: \`{ week, percent, minutes }\`.

1. \`growth(runs)\` — массив приростов доли между соседними неделями: для трёх записей — два числа.
2. \`stalled(runs)\` — \`true\`, если последние **три** недели прирост не больше нуля. Меньше трёх недель — \`false\`.
3. \`best(runs)\` — неделя с наибольшей долей; при равенстве — более поздняя.
4. \`pace(runs)\` — среднее сокращение времени за неделю, округлённое. Меньше двух недель — \`0\`.
5. \`forecast(runs)\` — прогноз доли на следующую неделю: последняя доля плюс средний прирост, округлённый, но не больше 100.`,
    requirements: [
      'Приросты считаются между соседними неделями',
      'Застой определяется по трём неделям подряд',
      'Лучшая неделя определяется, при равенстве — поздняя',
      'Темп считается по сокращению времени',
      'Прогноз не превышает 100',
    ],
    starterCode: `function growth(runs) {
  // приросты доли
}

function stalled(runs) {
  // застой?
}

function best(runs) {
  // лучшая неделя
}

function pace(runs) {
  // среднее сокращение времени
}

function forecast(runs) {
  // прогноз на следующую неделю
}`,
    tests: [
      {
        id: 'growth',
        name: 'Приросты между неделями',
        type: 'assert',
        code: `const growth = ctx.get('growth');
const runs = [
  { week: 25, percent: 60, minutes: 400 },
  { week: 26, percent: 70, minutes: 380 },
  { week: 27, percent: 68, minutes: 360 },
];
const result = growth(runs);
ctx.assert(result.length === 2, 'Приростов должно быть два, получено: ' + ctx.preview(result));
ctx.assert(result[0] === 10, 'Первый прирост 10, получено: ' + result[0]);
ctx.assert(result[1] === -2, 'Второй прирост -2, получено: ' + result[1], -2, result[1]);
ctx.assert(growth([runs[0]]).length === 0, 'Для одной записи приростов нет');`,
        points: 5,
      },
      {
        id: 'stalled',
        name: 'Застой',
        type: 'assert',
        code: `const stalled = ctx.get('stalled');
const flat = [
  { week: 25, percent: 70, minutes: 400 },
  { week: 26, percent: 70, minutes: 395 },
  { week: 27, percent: 69, minutes: 390 },
  { week: 28, percent: 69, minutes: 385 },
];
ctx.assert(stalled(flat) === true, 'Три недели без роста — это застой');
const rising = [
  { week: 25, percent: 60, minutes: 400 },
  { week: 26, percent: 70, minutes: 380 },
  { week: 27, percent: 75, minutes: 360 },
  { week: 28, percent: 80, minutes: 350 },
];
ctx.assert(stalled(rising) === false, 'При росте застоя нет');
ctx.assert(stalled([flat[0], flat[1]]) === false, 'Меньше трёх недель — судить рано');`,
        points: 7,
      },
      {
        id: 'best',
        name: 'Лучшая неделя',
        type: 'assert',
        code: `const best = ctx.get('best');
const runs = [
  { week: 25, percent: 60, minutes: 400 },
  { week: 26, percent: 85, minutes: 380 },
  { week: 27, percent: 85, minutes: 360 },
];
ctx.assert(best(runs).week === 27, 'При равной доле берётся более поздняя неделя, получено: ' + ctx.preview(best(runs)));`,
        points: 5,
      },
      {
        id: 'pace',
        name: 'Темп сокращения времени',
        type: 'assert',
        code: `const pace = ctx.get('pace');
const runs = [
  { week: 25, percent: 60, minutes: 400 },
  { week: 26, percent: 70, minutes: 380 },
  { week: 27, percent: 75, minutes: 340 },
];
ctx.assert(pace(runs) === 30, 'Среднее сокращение 30 минут в неделю, получено: ' + pace(runs), 30, pace(runs));
ctx.assert(pace([runs[0]]) === 0, 'Для одной записи темпа нет');`,
        points: 6,
      },
      {
        id: 'forecast',
        name: 'Прогноз на следующую неделю',
        type: 'assert',
        code: `const forecast = ctx.get('forecast');
const runs = [
  { week: 25, percent: 60, minutes: 400 },
  { week: 26, percent: 70, minutes: 380 },
  { week: 27, percent: 80, minutes: 360 },
];
ctx.assert(forecast(runs) === 90, 'Ожидалось 90, получено: ' + forecast(runs));
const high = [
  { week: 25, percent: 90, minutes: 400 },
  { week: 26, percent: 98, minutes: 380 },
];
ctx.assert(forecast(high) === 100, 'Прогноз не может превышать 100, получено: ' + forecast(high));`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Приросты считаются в цикле начиная со второго элемента: runs[i].percent - runs[i - 1].percent.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Застой — это последние три прироста, каждый из которых не больше нуля. Берите их методом slice(-3).',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'forecast: Math.min(100, Math.round(last.percent + average(growth(runs))));',
        penaltyPercent: 35,
      },
    ],
    solution: `function growth(runs) {
  const result = [];

  for (let index = 1; index < runs.length; index += 1) {
    result.push(runs[index].percent - runs[index - 1].percent);
  }

  return result;
}

function stalled(runs) {
  if (runs.length < 3) return false;

  const last = growth(runs).slice(-2);
  if (last.length < 2) return false;

  return last.every((value) => value <= 0);
}

function best(runs) {
  return runs.reduce((current, run) => (run.percent >= current.percent ? run : current), runs[0]);
}

function pace(runs) {
  if (runs.length < 2) return 0;

  const first = runs[0].minutes;
  const last = runs[runs.length - 1].minutes;

  return Math.round((first - last) / (runs.length - 1));
}

function forecast(runs) {
  const changes = growth(runs);
  const average = changes.length === 0 ? 0 : changes.reduce((sum, value) => sum + value, 0) / changes.length;

  return Math.min(100, Math.round(runs[runs.length - 1].percent + average));
}`,
    solutionExplanation:
      'Застой определяется по двум последним приростам, то есть по трём неделям — этого достаточно, чтобы отличить случайную неудачу от остановки. Одна плохая неделя случается у всех: заболел, тема попалась незнакомая, не выспался. Три недели без движения означают, что план подготовки перестал работать и его нужно менять, а не повторять с большим усердием. Прогноз ограничен сотней не из аккуратности, а потому что доля закрытых требований физически не бывает больше.',
    maxScore: 29,
    estimatedMinutes: 30,
    examRefs: ['m3-quality'],
    planDays: ['day-29-5'],
    source: 'plan',
  },

  {
    id: 'task-sql-recall-final',
    title: 'Повторение SQL: итоговый набор',
    kind: 'db',
    runtime: 'sql',
    difficulty: 4,
    tech: ['sql'],
    topicIds: ['memory-training'],
    monthNo: 7,
    weekNo: 29,
    statement: `Последний большой набор запросов перед экзаменом. Здесь собрано то, что встречается в первом модуле чаще всего.

База автошколы готова: \`students\`, \`categories\`, \`student_categories\`, \`instructors\`, \`lessons\`.

1. Ученики с перечнем категорий: \`full_name\`, \`codes\` (коды через запятую, по алфавиту), по имени ученика.
2. Сколько занятий провёл каждый инструктор (статус \`'Проведено'\`): \`full_name\`, \`total\`, по убыванию, затем по имени.
3. Ученики без единого проведённого занятия: \`full_name\`, по алфавиту.
4. Категория с наибольшим числом учеников: \`code\`, \`total\`, одна строка.
5. Занятия на ближайшую дату: \`id\`, \`lesson_at\` — те, у которых дата минимальная среди статуса \`'Назначено'\`.

Первый пункт — склейка значений в строку; в MySQL это \`GROUP_CONCAT\`.`,
    requirements: [
      'Склейка значений группы в строку',
      'Подсчёт по инструкторам с двойной сортировкой',
      'Отбор тех, у кого нет связанных записей нужного вида',
      'Поиск максимума через группировку',
      'Отбор по минимальному значению из подзапроса',
    ],
    setupSql: `
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL
);

CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE
);

CREATE TABLE student_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id),
  category_id INTEGER NOT NULL REFERENCES categories(id)
);

CREATE TABLE instructors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL
);

CREATE TABLE lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id),
  instructor_id INTEGER NOT NULL REFERENCES instructors(id),
  lesson_at TEXT NOT NULL,
  status TEXT NOT NULL
);

INSERT INTO students (id, full_name) VALUES (1, 'Иванов Иван'), (2, 'Петрова Полина'), (3, 'Сидоров Семён');

INSERT INTO categories (id, code) VALUES (1, 'A'), (2, 'B'), (3, 'C');

INSERT INTO student_categories (student_id, category_id) VALUES (1, 1), (1, 2), (2, 2), (3, 2);

INSERT INTO instructors (id, full_name) VALUES (1, 'Кузнецов Кирилл'), (2, 'Морозов Максим');

INSERT INTO lessons (id, student_id, instructor_id, lesson_at, status) VALUES
  (1, 1, 1, '2027-03-12', 'Проведено'),
  (2, 1, 1, '2027-03-14', 'Назначено'),
  (3, 2, 2, '2027-03-13', 'Проведено'),
  (4, 3, 2, '2027-03-14', 'Назначено'),
  (5, 2, 1, '2027-03-16', 'Назначено');
`,
    starterCode: `-- 1. Ученики и их категории


-- 2. Занятия по инструкторам


-- 3. Ученики без проведённых занятий


-- 4. Самая популярная категория


-- 5. Занятия на ближайшую дату

`,
    tests: [
      {
        id: 'group-concat',
        name: 'Ученики и их категории',
        type: 'sql-query',
        check: `SELECT s.full_name, GROUP_CONCAT(c.code) AS codes FROM students s JOIN student_categories sc ON sc.student_id = s.id JOIN categories c ON c.id = sc.category_id GROUP BY s.id, s.full_name ORDER BY s.full_name`,
        expectedColumns: ['full_name', 'codes'],
        expectedRows: [
          ['Иванов Иван', 'A,B'],
          ['Петрова Полина', 'B'],
          ['Сидоров Семён', 'B'],
        ],
        ordered: true,
        points: 6,
      },
      {
        id: 'by-instructor',
        name: 'Занятия по инструкторам',
        type: 'sql-query',
        check: `SELECT i.full_name, COUNT(l.id) AS total FROM instructors i JOIN lessons l ON l.instructor_id = i.id AND l.status = 'Проведено' GROUP BY i.id, i.full_name ORDER BY total DESC, i.full_name`,
        expectedColumns: ['full_name', 'total'],
        expectedRows: [
          ['Кузнецов Кирилл', 1],
          ['Морозов Максим', 1],
        ],
        ordered: true,
        points: 6,
      },
      {
        id: 'without-lessons',
        name: 'Ученики без проведённых занятий',
        type: 'sql-query',
        check: `SELECT full_name FROM students WHERE id NOT IN (SELECT student_id FROM lessons WHERE status = 'Проведено') ORDER BY full_name`,
        expectedColumns: ['full_name'],
        expectedRows: [['Сидоров Семён']],
        points: 6,
      },
      {
        id: 'top-category',
        name: 'Самая популярная категория',
        type: 'sql-query',
        check: `SELECT c.code, COUNT(sc.id) AS total FROM categories c JOIN student_categories sc ON sc.category_id = c.id GROUP BY c.id, c.code ORDER BY total DESC, c.code LIMIT 1`,
        expectedColumns: ['code', 'total'],
        expectedRows: [['B', 3]],
        points: 5,
      },
      {
        id: 'nearest',
        name: 'Занятия на ближайшую дату',
        type: 'sql-query',
        check: `SELECT id, lesson_at FROM lessons WHERE status = 'Назначено' AND lesson_at = (SELECT MIN(lesson_at) FROM lessons WHERE status = 'Назначено') ORDER BY id`,
        expectedColumns: ['id', 'lesson_at'],
        expectedRows: [
          [2, '2027-03-14'],
          [4, '2027-03-14'],
        ],
        ordered: true,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Склейка значений группы: GROUP_CONCAT(c.code). В SQLite она работает так же, как в MySQL.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Условие по статусу можно перенести прямо в ON соединения — тогда инструктор без проведённых занятий не исчезнет при LEFT JOIN.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Ближайшая дата: WHERE lesson_at = (SELECT MIN(lesson_at) FROM lessons WHERE status = "Назначено").',
        penaltyPercent: 35,
      },
    ],
    solution: `SELECT s.full_name, GROUP_CONCAT(c.code) AS codes
FROM students s
JOIN student_categories sc ON sc.student_id = s.id
JOIN categories c ON c.id = sc.category_id
GROUP BY s.id, s.full_name
ORDER BY s.full_name;

SELECT i.full_name, COUNT(l.id) AS total
FROM instructors i
JOIN lessons l ON l.instructor_id = i.id AND l.status = 'Проведено'
GROUP BY i.id, i.full_name
ORDER BY total DESC, i.full_name;

SELECT full_name
FROM students
WHERE id NOT IN (SELECT student_id FROM lessons WHERE status = 'Проведено')
ORDER BY full_name;

SELECT c.code, COUNT(sc.id) AS total
FROM categories c
JOIN student_categories sc ON sc.category_id = c.id
GROUP BY c.id, c.code
ORDER BY total DESC, c.code
LIMIT 1;

SELECT id, lesson_at
FROM lessons
WHERE status = 'Назначено'
  AND lesson_at = (SELECT MIN(lesson_at) FROM lessons WHERE status = 'Назначено')
ORDER BY id;`,
    solutionExplanation:
      'Пятый запрос показывает приём, который экономит много времени: отбор по значению из подзапроса. Найти минимальную дату и тут же отобрать все строки с ней — задача, которую иначе пришлось бы решать в два запроса или через сортировку с LIMIT, теряя вторую строку с той же датой. Во втором запросе условие по статусу стоит в ON, а не в WHERE: при переходе на LEFT JOIN такой запрос сохранит инструкторов без проведённых занятий с нулём, а условие в WHERE их бы отбросило.',
    maxScore: 29,
    estimatedMinutes: 40,
    examRefs: ['m1-db', 'm1-admin', 'm3-db'],
    planDays: ['day-29-6'],
    source: 'plan',
  },

  {
    id: 'task-final-run-original',
    title: 'Прогон по исходному заданию: сравнение с началом',
    kind: 'app',
    runtime: 'react',
    difficulty: 5,
    tech: ['react'],
    topicIds: ['exam-strategy'],
    monthNo: 7,
    weekNo: 30,
    statement: `Возвращаемся к «Конференции.РФ» — тому самому заданию, с которого всё начиналось. Тридцать недель назад на это уходили дни.

Компонент \`Cabinet\` принимает \`{ applications, onReview }\`, где \`applications\` — массив \`{ id, room, date, status, hasReview }\` (дата в \`ГГГГ-ММ-ДД\`).

1. Карточки \`.card\` с помещением, датой в формате **ДД.ММ.ГГГГ** и статусом.
2. Фильтр \`#filter\` по статусу и счётчик \`#count\`.
3. Кнопка \`.review\` — только у заявок, где статус не \`'Новая'\` и \`hasReview\` равно \`false\`.
4. Нажатие вызывает \`onReview(id)\`; после успеха в карточке появляется «Спасибо за отзыв», кнопка исчезает. При отказе появляется \`#error\` с текстом «Не удалось отправить отзыв», кнопка остаётся.
5. Пустой результат фильтра — блок \`#empty\`.

Засеките время и сравните с первой неделей месяца.`,
    requirements: [
      'Даты выводятся в формате ДД.ММ.ГГГГ',
      'Фильтр и счётчик работают',
      'Кнопка отзыва подчиняется правилу задания',
      'Успешный отзыв заменяет кнопку благодарностью',
      'Отказ показывает ошибку и оставляет кнопку',
      'Пустой результат объяснён',
    ],
    starterCode: `const STATUSES = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'];

function Cabinet({ applications, onReview }) {
  // карточки, фильтр, отзывы
}`,
    tests: [
      {
        id: 'cards',
        name: 'Карточки, даты и счётчик',
        type: 'react',
        code: `const applications = [
  { id: 1, room: 'Коворкинг', date: '2027-03-12', status: 'Новая', hasReview: false },
  { id: 2, room: 'Кинозал', date: '2027-04-19', status: 'Мероприятие завершено', hasReview: false },
];
return ctx.render('Cabinet', { applications, onReview: () => Promise.resolve() })
  .then(() => ctx.change('#filter', ''))
  .then(() => {
    ctx.assert(ctx.$$('.card').length === 2, 'Карточек должно быть две, найдено: ' + ctx.$$('.card').length);
    const text = ctx.text();
    ctx.assert(text.indexOf('12.03.2027') !== -1, 'Дата в формате ДД.ММ.ГГГГ, сейчас: ' + text.slice(0, 140));
    ctx.assert(!/\\d{4}-\\d{2}-\\d{2}/.test(text), 'Машинный формат даты показывать не нужно');
    ctx.assert(ctx.text('#count').indexOf('2') !== -1, 'Счётчик: ' + ctx.text('#count'));
  });`,
        points: 6,
      },
      {
        id: 'review-rule',
        name: 'Правило отзыва',
        type: 'react',
        // Компонент между проверками не пересоздаётся, поэтому правило
        // проверяем по тому, что фактически нарисовано.
        code: `const applications = [
  { id: 1, room: 'Коворкинг', date: '2027-03-12', status: 'Новая', hasReview: false },
  { id: 2, room: 'Кинозал', date: '2027-04-19', status: 'Мероприятие завершено', hasReview: false },
];
return ctx.render('Cabinet', { applications, onReview: () => Promise.resolve() })
  .then(() => ctx.change('#filter', ''))
  .then(() => {
    const cards = ctx.$$('.card');
    ctx.assert(cards.length >= 2, 'Карточек должно быть минимум две');
    let withButton = 0;
    cards.forEach((card) => {
      const text = card.textContent;
      const hasButton = Boolean(card.querySelector('.review'));

      if (text.indexOf('Спасибо за отзыв') !== -1) {
        ctx.assert(!hasButton, 'У заявки с отзывом кнопки быть не должно');
      } else if (text.indexOf('Новая') !== -1) {
        ctx.assert(!hasButton, 'У новой заявки кнопки отзыва быть не должно');
      } else {
        ctx.assert(hasButton, 'У завершённой заявки без отзыва кнопка должна быть: ' + text.slice(0, 60));
        withButton += 1;
      }
    });
    ctx.assert(withButton >= 1, 'Хотя бы у одной заявки кнопка отзыва должна быть');
  });`,
        points: 7,
      },
      {
        id: 'review-error',
        name: 'Отказ показывает ошибку',
        type: 'react',
        code: `const applications = [{ id: 6, room: 'Аудитория', date: '2027-04-20', status: 'Мероприятие завершено', hasReview: false }];
let before = 0;
return ctx.render('Cabinet', { applications, onReview: () => Promise.reject(new Error('отказ')) })
  .then(() => ctx.change('#filter', ''))
  .then(() => {
    before = ctx.$$('.review').length;
    ctx.assert(before >= 1, 'Нужна хотя бы одна кнопка отзыва');
    return ctx.click(ctx.$$('.review')[0]);
  })
  .then(() => ctx.advanceTime(100))
  .then(() => {
    ctx.assert(ctx.text('#error').indexOf('Не удалось отправить отзыв') !== -1, 'Нет сообщения об ошибке: ' + ctx.text('#error'));
    ctx.assert(ctx.$$('.review').length === before, 'После отказа кнопка должна остаться: было ' + before);
  });`,
        points: 7,
      },
      {
        id: 'review-ok',
        name: 'Успешный отзыв',
        type: 'react',
        code: `const applications = [{ id: 5, room: 'Кинозал', date: '2027-04-19', status: 'Мероприятие завершено', hasReview: false }];
const calls = [];
let before = 0;
return ctx.render('Cabinet', { applications, onReview: (id) => { calls.push(id); return Promise.resolve(); } })
  .then(() => ctx.change('#filter', ''))
  .then(() => {
    before = ctx.$$('.review').length;
    ctx.assert(before >= 1, 'Нужна хотя бы одна кнопка отзыва');
    return ctx.click(ctx.$$('.review')[0]);
  })
  .then(() => ctx.advanceTime(50))
  .then(() => {
    ctx.assert(calls.length === 1, 'onReview должен вызваться один раз, вызовов: ' + calls.length);
    ctx.assert(ctx.text().indexOf('Спасибо за отзыв') !== -1, 'Нужна благодарность');
    ctx.assert(ctx.$$('.review').length === before - 1, 'Кнопка должна исчезнуть: было ' + before);
  });`,
        points: 7,
      },
      {
        id: 'empty',
        name: 'Пустой результат объяснён',
        type: 'react',
        code: `const applications = [{ id: 7, room: 'Коворкинг', date: '2027-03-12', status: 'Новая', hasReview: false }];
return ctx.render('Cabinet', { applications, onReview: () => Promise.resolve() })
  .then(() => ctx.change('#filter', ''))
  .then(() => {
    const present = ctx.$$('.card').map((card) => card.textContent);
    const absent = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'].filter(
      (status) => present.every((text) => text.indexOf(status) === -1),
    )[0];
    ctx.assert(absent, 'Не удалось подобрать отсутствующий статус');
    return ctx.change('#filter', absent);
  })
  .then(() => {
    ctx.assert(ctx.$$('.card').length === 0, 'Карточек быть не должно');
    ctx.assert(ctx.$('#empty'), 'Нужен блок #empty');
  });`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Заявки кладите в состояние: после отзыва нужно обновить признак hasReview в конкретной карточке.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Ошибку сбрасывайте перед каждой новой попыткой, иначе она останется висеть после удачной отправки.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'onReview(item.id).then(() => update(item.id, true)).catch(() => setError("Не удалось отправить отзыв"));',
        penaltyPercent: 35,
      },
    ],
    solution: `const STATUSES = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'];

function Cabinet({ applications, onReview }) {
  const [items, setItems] = React.useState(applications);
  const [filter, setFilter] = React.useState('');
  const [error, setError] = React.useState('');

  const toRuDate = (iso) => iso.split('-').reverse().join('.');

  const markReviewed = (id) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, hasReview: true } : item)));
  };

  const leaveReview = (item) => {
    setError('');

    onReview(item.id)
      .then(() => markReviewed(item.id))
      .catch(() => setError('Не удалось отправить отзыв'));
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

      <p id="count">Показано заявок: {visible.length}</p>
      <p id="error">{error}</p>

      {visible.length > 0 ? (
        visible.map((item) => (
          <article className="card" key={item.id}>
            <h3>{item.room}</h3>
            <p>{toRuDate(item.date)}</p>
            <p>{item.status}</p>

            {item.hasReview ? (
              <p>Спасибо за отзыв</p>
            ) : item.status === 'Новая' ? (
              <p>Отзыв можно оставить после смены статуса</p>
            ) : (
              <button className="review" type="button" onClick={() => leaveReview(item)}>
                Оставить отзыв
              </button>
            )}
          </article>
        ))
      ) : (
        <p id="empty">Заявок с таким статусом нет</p>
      )}
    </div>
  );
}`,
    solutionExplanation:
      'Это тот же кабинет, что писался в двенадцатую неделю, — и если сейчас он пишется за двадцать минут вместо двух часов, подготовка сработала. Признак hasReview меняется только после успешного ответа сервера: помечать заявку сразу и откатывать при ошибке здесь неправильно, потому что отзыв — необратимое действие, и ложная благодарность собьёт с толку. Ошибка сбрасывается перед каждой попыткой, иначе после удачной отправки останется висеть сообщение от предыдущей неудачи.',
    maxScore: 33,
    estimatedMinutes: 60,
    examRefs: ['m1-cabinet', 'm2-cabinet-ux', 'm3-quality'],
    planDays: ['day-30-1'],
    source: 'plan',
  },

  {
    id: 'task-compare-with-week25',
    title: 'Разбор: сравниваем с двадцать пятой неделей',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['js'],
    topicIds: ['exam-debrief'],
    monthNo: 7,
    weekNo: 30,
    statement: `Сравниваем последний прогон с самым первым — тем, что был пять недель назад. Разница между ними и есть результат месяца.

Прогоны: \`{ week, done: [...], minutes, stuck: [...] }\`.

1. \`improvement(first, last)\` — \`{ doneDelta, minutesDelta, stuckDelta }\`: насколько больше закрыто, насколько меньше времени, насколько меньше затруднений. Положительное всегда означает «стало лучше».
2. \`solidGains(first, last)\` — требования, закрытые в обоих прогонах: это устойчивый результат, а не везение.
3. \`fragile(first, last)\` — закрытые только в одном из двух: их стоит проверить отдельно.
4. \`readiness(last, total)\` — доля закрытых требований от общего числа, округлённая.
5. \`report(first, last, total)\` — строка вида \`'Готовность 85%, устойчиво закрыто 6 из 8, время сократилось на 60 мин'\`.`,
    requirements: [
      'Разница считается так, что положительное — это улучшение',
      'Устойчиво закрытые требования находятся',
      'Неустойчивые находятся',
      'Готовность считается в процентах',
      'Отчёт собирает всё в строку',
    ],
    starterCode: `function improvement(first, last) {
  // { doneDelta, minutesDelta, stuckDelta }
}

function solidGains(first, last) {
  // закрыто в обоих
}

function fragile(first, last) {
  // закрыто только в одном
}

function readiness(last, total) {
  // процент готовности
}

function report(first, last, total) {
  // строка отчёта
}`,
    tests: [
      {
        id: 'improvement',
        name: 'Разница между прогонами',
        type: 'assert',
        code: `const improvement = ctx.get('improvement');
const first = { week: 25, done: ['a', 'b'], minutes: 400, stuck: ['JOIN', 'слайдер', 'валидация'] };
const last = { week: 30, done: ['a', 'b', 'c', 'd'], minutes: 340, stuck: ['слайдер'] };
const result = improvement(first, last);
ctx.assert(result.doneDelta === 2, 'Закрыто на 2 больше, получено: ' + result.doneDelta);
ctx.assert(result.minutesDelta === 60, 'Время сократилось на 60, получено: ' + result.minutesDelta);
ctx.assert(result.stuckDelta === 2, 'Затруднений на 2 меньше, получено: ' + result.stuckDelta);`,
        points: 6,
      },
      {
        id: 'solid',
        name: 'Устойчиво закрытые',
        type: 'assert',
        code: `const solidGains = ctx.get('solidGains');
const first = { done: ['a', 'b', 'x'], minutes: 400, stuck: [] };
const last = { done: ['a', 'b', 'c'], minutes: 340, stuck: [] };
const result = solidGains(first, last);
ctx.assert(result.join(',') === 'a,b', 'Получено: ' + result.join(','));`,
        points: 5,
      },
      {
        id: 'fragile',
        name: 'Неустойчивые требования',
        type: 'assert',
        code: `const fragile = ctx.get('fragile');
const first = { done: ['a', 'b', 'x'], minutes: 400, stuck: [] };
const last = { done: ['a', 'b', 'c'], minutes: 340, stuck: [] };
const result = fragile(first, last);
ctx.assert(result.indexOf('x') !== -1, 'Требование x закрыто только в первом прогоне');
ctx.assert(result.indexOf('c') !== -1, 'Требование c закрыто только в последнем');
ctx.assert(result.indexOf('a') === -1, 'Требование a устойчиво');
ctx.assert(result.length === 2, 'Неустойчивых должно быть два, получено: ' + ctx.preview(result));`,
        points: 6,
      },
      {
        id: 'readiness',
        name: 'Готовность в процентах',
        type: 'assert',
        code: `const readiness = ctx.get('readiness');
ctx.assert(readiness({ done: ['a', 'b', 'c'] }, 4) === 75, 'Три из четырёх — 75%, получено: ' + readiness({ done: ['a', 'b', 'c'] }, 4));
ctx.assert(readiness({ done: [] }, 4) === 0, 'Ничего не закрыто — 0%');
ctx.assert(readiness({ done: ['a'] }, 0) === 0, 'Деления на ноль быть не должно');`,
        points: 5,
      },
      {
        id: 'report',
        name: 'Итоговый отчёт',
        type: 'assert',
        code: `const report = ctx.get('report');
const first = { week: 25, done: ['a', 'b'], minutes: 400, stuck: [] };
const last = { week: 30, done: ['a', 'b', 'c', 'd', 'e', 'f'], minutes: 340, stuck: [] };
const text = report(first, last, 8);
ctx.assert(text.indexOf('75%') !== -1, 'В отчёте должна быть готовность: ' + text);
ctx.assert(text.indexOf('2 из 8') !== -1, 'В отчёте должно быть число устойчиво закрытых: ' + text);
ctx.assert(text.indexOf('60 мин') !== -1, 'В отчёте должно быть сокращение времени: ' + text);`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Чтобы положительное всегда означало улучшение, для времени и затруднений вычитайте последнее из первого, а для закрытых — наоборот.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Неустойчивые — это объединение двух разностей: что было только раньше и что появилось только теперь.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'return solidGains(first, last).length + " из " + total;',
        penaltyPercent: 35,
      },
    ],
    solution: `function improvement(first, last) {
  return {
    doneDelta: last.done.length - first.done.length,
    minutesDelta: first.minutes - last.minutes,
    stuckDelta: first.stuck.length - last.stuck.length,
  };
}

function solidGains(first, last) {
  return first.done.filter((id) => last.done.indexOf(id) !== -1);
}

function fragile(first, last) {
  const onlyFirst = first.done.filter((id) => last.done.indexOf(id) === -1);
  const onlyLast = last.done.filter((id) => first.done.indexOf(id) === -1);

  return onlyFirst.concat(onlyLast);
}

function readiness(last, total) {
  return total === 0 ? 0 : Math.round((last.done.length / total) * 100);
}

function report(first, last, total) {
  const change = improvement(first, last);

  return (
    'Готовность ' + readiness(last, total) + '%, ' +
    'устойчиво закрыто ' + solidGains(first, last).length + ' из ' + total + ', ' +
    'время сократилось на ' + change.minutesDelta + ' мин'
  );
}`,
    solutionExplanation:
      'Разделение на устойчивое и неустойчивое — главная мысль последнего разбора. Требование, закрытое в обоих прогонах с разницей в пять недель, закрыто по-настоящему. Требование, закрытое только в одном, могло попасться удачно: знакомая формулировка, оставшееся время, случайно подходящая заготовка. Перед экзаменом смотреть надо именно на второй список — там и лежит то, что может не получиться в решающий день.',
    maxScore: 28,
    estimatedMinutes: 25,
    examRefs: ['m3-quality'],
    planDays: ['day-30-2'],
    source: 'plan',
  },

  {
    id: 'task-notebook-full-recall',
    title: 'Всё, что нужно помнить наизусть',
    kind: 'function',
    runtime: 'js',
    difficulty: 4,
    tech: ['js'],
    topicIds: ['memory-training'],
    monthNo: 7,
    weekNo: 30,
    statement: `Собираем в одном месте всё, что к экзамену должно быть в голове. На экзамене под рукой не будет ничего, так что каждая строка отсюда должна вспоминаться без подсказки.

1. \`EXAM\` — \`{ modules: 3, totalMinutes: 420, viewport: { width: 390, height: 844 }, dateFormat: 'ДД.ММ.ГГГГ', slider: { images: 4, seconds: 3 } }\`.
2. \`DB_SKELETON\` — пять таблиц универсального скелета: \`'users'\`, \`'catalog'\`, \`'payment_methods'\`, \`'requests'\`, \`'reviews'\`.
3. \`SECURITY\` — пять правил безопасности (те же идентификаторы, что и в неделе 21): \`'hash'\`, \`'params'\`, \`'server-validation'\`, \`'ownership'\`, \`'roles'\`.
4. \`STATES\` — четыре состояния страницы: \`'loading'\`, \`'ready'\`, \`'empty'\`, \`'error'\`.
5. \`checkKnowledge(answers)\` — принимает объект ответов и возвращает список неверных разделов из \`['exam', 'db', 'security', 'states']\`. Раздел верен, если в ответе перечислено ровно столько же элементов, сколько в справочнике, и все они совпадают (порядок неважен).
6. \`score(answers)\` — доля верных разделов в процентах.`,
    requirements: [
      'Числа задания записаны верно',
      'Скелет базы перечислен',
      'Пять правил безопасности перечислены',
      'Четыре состояния перечислены',
      'checkKnowledge находит неверные разделы',
      'score считает долю верных',
    ],
    starterCode: `const EXAM = {};
const DB_SKELETON = [];
const SECURITY = [];
const STATES = [];

function checkKnowledge(answers) {
  // неверные разделы
}

function score(answers) {
  // процент верных
}`,
    tests: [
      {
        id: 'exam',
        name: 'Числа задания',
        type: 'assert',
        code: `const EXAM = ctx.get('EXAM');
ctx.assert(EXAM.modules === 3, 'Модулей три, указано: ' + EXAM.modules);
ctx.assert(EXAM.totalMinutes === 420, 'Всего 420 минут, указано: ' + EXAM.totalMinutes);
ctx.assert(EXAM.viewport && EXAM.viewport.width === 390 && EXAM.viewport.height === 844, 'Экран: ' + ctx.preview(EXAM.viewport));
ctx.assert(EXAM.dateFormat === 'ДД.ММ.ГГГГ', 'Формат даты: ' + ctx.preview(EXAM.dateFormat));
ctx.assert(EXAM.slider && EXAM.slider.images === 4 && EXAM.slider.seconds === 3, 'Слайдер: ' + ctx.preview(EXAM.slider));`,
        points: 6,
      },
      {
        id: 'skeleton',
        name: 'Скелет базы',
        type: 'assert',
        code: `const DB_SKELETON = ctx.get('DB_SKELETON');
ctx.assert(Array.isArray(DB_SKELETON) && DB_SKELETON.length === 5, 'Таблиц должно быть пять, найдено: ' + (DB_SKELETON || []).length);
['users', 'catalog', 'payment_methods', 'requests', 'reviews'].forEach((table) => {
  ctx.assert(DB_SKELETON.indexOf(table) !== -1, 'Не хватает таблицы ' + table);
});`,
        points: 5,
      },
      {
        id: 'security-states',
        name: 'Безопасность и состояния',
        type: 'assert',
        code: `const SECURITY = ctx.get('SECURITY');
const STATES = ctx.get('STATES');
['hash', 'params', 'server-validation', 'ownership', 'roles'].forEach((id) => {
  ctx.assert(SECURITY.indexOf(id) !== -1, 'Не хватает правила ' + id);
});
ctx.assert(SECURITY.length === 5, 'Правил должно быть пять, найдено: ' + SECURITY.length);
['loading', 'ready', 'empty', 'error'].forEach((state) => {
  ctx.assert(STATES.indexOf(state) !== -1, 'Не хватает состояния ' + state);
});
ctx.assert(STATES.length === 4, 'Состояний должно быть четыре, найдено: ' + STATES.length);`,
        points: 6,
      },
      {
        id: 'check',
        name: 'Проверка знаний',
        type: 'assert',
        code: `const checkKnowledge = ctx.get('checkKnowledge');
const EXAM = ctx.get('EXAM');
const full = {
  exam: EXAM,
  db: ['reviews', 'requests', 'payment_methods', 'catalog', 'users'],
  security: ['roles', 'ownership', 'server-validation', 'params', 'hash'],
  states: ['error', 'empty', 'ready', 'loading'],
};
ctx.assert(checkKnowledge(full).length === 0, 'Полные ответы должны проходить, получено: ' + ctx.preview(checkKnowledge(full)));
const partial = { ...full, security: ['hash', 'params'] };
ctx.assert(checkKnowledge(partial).indexOf('security') !== -1, 'Неполный список правил должен помечаться');
ctx.assert(checkKnowledge(partial).length === 1, 'Неверным должен быть один раздел, получено: ' + ctx.preview(checkKnowledge(partial)));`,
        points: 7,
      },
      {
        id: 'score',
        name: 'Доля верных разделов',
        type: 'assert',
        code: `const score = ctx.get('score');
const EXAM = ctx.get('EXAM');
const full = {
  exam: EXAM,
  db: ['users', 'catalog', 'payment_methods', 'requests', 'reviews'],
  security: ['hash', 'params', 'server-validation', 'ownership', 'roles'],
  states: ['loading', 'ready', 'empty', 'error'],
};
ctx.assert(score(full) === 100, 'Полные ответы — 100%, получено: ' + score(full));
ctx.assert(score({}) === 0, 'Пустые ответы — 0%, получено: ' + score({}));
const half = { db: full.db, states: full.states };
ctx.assert(score(half) === 50, 'Два раздела из четырёх — 50%, получено: ' + score(half));`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Сравнение списков без учёта порядка: длины совпадают и каждый элемент справочника есть в ответе.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Раздел exam сравнивается не списком, а по полям — проще всего сравнить JSON.stringify обоих объектов после приведения к одному порядку ключей либо проверить поля вручную.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const sameList = (a, b) => Array.isArray(b) && a.length === b.length && a.every((item) => b.indexOf(item) !== -1);',
        penaltyPercent: 35,
      },
    ],
    solution: `const EXAM = {
  modules: 3,
  totalMinutes: 420,
  viewport: { width: 390, height: 844 },
  dateFormat: 'ДД.ММ.ГГГГ',
  slider: { images: 4, seconds: 3 },
};

const DB_SKELETON = ['users', 'catalog', 'payment_methods', 'requests', 'reviews'];

const SECURITY = ['hash', 'params', 'server-validation', 'ownership', 'roles'];

const STATES = ['loading', 'ready', 'empty', 'error'];

const SECTIONS = ['exam', 'db', 'security', 'states'];

function sameList(expected, actual) {
  return Array.isArray(actual) && actual.length === expected.length && expected.every((item) => actual.indexOf(item) !== -1);
}

function sameExam(actual) {
  if (!actual || typeof actual !== 'object') return false;

  return (
    actual.modules === EXAM.modules &&
    actual.totalMinutes === EXAM.totalMinutes &&
    actual.dateFormat === EXAM.dateFormat &&
    Boolean(actual.viewport) &&
    actual.viewport.width === EXAM.viewport.width &&
    actual.viewport.height === EXAM.viewport.height &&
    Boolean(actual.slider) &&
    actual.slider.images === EXAM.slider.images &&
    actual.slider.seconds === EXAM.slider.seconds
  );
}

function checkKnowledge(answers) {
  const source = answers || {};

  return SECTIONS.filter((section) => {
    if (section === 'exam') return !sameExam(source.exam);
    if (section === 'db') return !sameList(DB_SKELETON, source.db);
    if (section === 'security') return !sameList(SECURITY, source.security);
    return !sameList(STATES, source.states);
  });
}

function score(answers) {
  const wrong = checkKnowledge(answers).length;
  return Math.round(((SECTIONS.length - wrong) / SECTIONS.length) * 100);
}`,
    solutionExplanation:
      'Справочник собран из четырёх частей, и это ровно те четыре блока, которые стоит помнить наизусть: числа задания, скелет базы, правила безопасности и состояния интерфейса. Всё остальное можно вывести или подсмотреть, а эти четыре — фундамент, на который опирается любая тема. Сравнение списков без учёта порядка сделано намеренно: важно, что вы помните все пять правил, а не в каком порядке они записаны.',
    maxScore: 30,
    estimatedMinutes: 30,
    examRefs: ['m1-db', 'm2-slider', 'm2-mobile', 'm3-quality'],
    planDays: ['day-30-3'],
    source: 'plan',
  },

  {
    id: 'task-unknown-domain-run',
    title: 'Прогон на незнакомой теме: ремонт техники',
    kind: 'db',
    runtime: 'sql',
    difficulty: 5,
    tech: ['sql'],
    topicIds: ['exam-strategy'],
    monthNo: 7,
    weekNo: 30,
    statement: `Последний прогон перед экзаменом — на теме, которую вы видите впервые: **ремонт бытовой техники**. Условие намеренно короткое, как в задании: часть решений придётся принять самому.

Из условия известно: клиенты сдают устройства в ремонт; у каждого ремонта есть мастер, вид работ, дата приёма, дата выдачи и статус; клиент может оставить отзыв по завершённому ремонту.

1. Спроектируйте базу: не меньше пяти таблиц. Имена четырёх из них заданы, чтобы проверка знала, куда смотреть: \`repairs\` (ремонты, с датами \`accepted_on\` и \`issued_on\`), \`works\` (справочник видов работ), \`payment_methods\` (справочник оплаты), \`reviews\` (отзывы). Остальные называйте как удобно.
2. Статус ремонта ограничьте списком: \`'Принят'\`, \`'В работе'\`, \`'Готов'\`, \`'Выдан'\`. По умолчанию — \`'Принят'\`.
3. Дата выдачи может быть пустой: пока ремонт не закончен, её нет.
4. Отзыв — один на ремонт, удаляется вместе с ремонтом.
5. Заполните: три вида работ, два способа оплаты, двух мастеров, двух клиентов, три ремонта, один отзыв.
6. Запрос: ремонты в работе дольше 7 дней — \`id\`, \`days\`, по убыванию. Считайте от даты приёма до сегодняшней даты \`'2027-03-20'\`.`,
    requirements: [
      'Не меньше пяти таблиц со связями',
      'Статус ограничен списком, по умолчанию «Принят»',
      'Дата выдачи необязательная',
      'Один отзыв на ремонт, удаляется каскадом',
      'Данные заполнены',
      'Запрос находит затянувшиеся ремонты',
    ],
    starterCode: `-- Ремонт техники: тема незнакомая, скелет прежний

`,
    tests: [
      {
        id: 'tables',
        name: 'Не меньше пяти таблиц',
        type: 'sql-query',
        check: `SELECT CASE WHEN COUNT(*) >= 5 THEN 1 ELSE 0 END FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'`,
        expectedRows: [[1]],
        points: 5,
      },
      {
        id: 'status',
        name: 'Статус ограничен и по умолчанию «Принят»',
        type: 'sql-query',
        check: `SELECT CASE WHEN instr(upper(sql), 'CHECK') > 0 AND instr(sql, 'В работе') > 0 AND instr(sql, 'Выдан') > 0 AND instr(sql, 'Принят') > 0 THEN 1 ELSE 0 END FROM sqlite_master WHERE type = 'table' AND sql LIKE '%В работе%'`,
        expectedRows: [[1]],
        points: 6,
      },
      {
        id: 'nullable-date',
        name: 'Дата выдачи необязательная',
        type: 'sql-query',
        check: `SELECT "notnull" FROM pragma_table_info('repairs') WHERE name = 'issued_on'`,
        expectedRows: [[0]],
        points: 5,
      },
      {
        id: 'review-cascade',
        name: 'Отзыв один и удаляется каскадом',
        type: 'sql-query',
        check: `SELECT CASE WHEN instr(upper(replace(sql, '  ', ' ')), 'ON DELETE CASCADE') > 0 AND instr(upper(sql), 'UNIQUE') > 0 THEN 1 ELSE 0 END FROM sqlite_master WHERE type = 'table' AND name = 'reviews'`,
        expectedRows: [[1]],
        points: 6,
      },
      {
        id: 'data',
        name: 'Данные заполнены',
        type: 'sql-query',
        check: `SELECT (SELECT COUNT(*) FROM works), (SELECT COUNT(*) FROM payment_methods), (SELECT COUNT(*) FROM reviews)`,
        expectedRows: [[3, 2, 1]],
        points: 6,
      },
      {
        id: 'overdue',
        name: 'Затянувшиеся ремонты',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM repairs WHERE status = 'В работе' AND julianday('2027-03-20') - julianday(accepted_on) > 7`,
        expectedRows: [[1]],
        points: 7,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Скелет тот же: люди, справочник основного ресурса, справочник способов оплаты, записи, отзывы. Названия подставьте свои.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Необязательный столбец — это просто отсутствие NOT NULL. Не пишите его у даты выдачи.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Чтобы затянувшийся ремонт нашёлся, сделайте один со статусом «В работе» и датой приёма раньше 13.03.2027.',
        penaltyPercent: 35,
      },
    ],
    solution: `CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(30) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL
);

CREATE TABLE works (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE payment_methods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE masters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL
);

CREATE TABLE repairs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  master_id INT NOT NULL,
  work_id INT NOT NULL,
  payment_id INT NOT NULL,
  device VARCHAR(150) NOT NULL,
  accepted_on DATE NOT NULL,
  issued_on DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'Принят'
    CHECK (status IN ('Принят', 'В работе', 'Готов', 'Выдан')),
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (master_id) REFERENCES masters(id),
  FOREIGN KEY (work_id) REFERENCES works(id),
  FOREIGN KEY (payment_id) REFERENCES payment_methods(id)
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  repair_id INT NOT NULL UNIQUE,
  rating INT NOT NULL,
  text TEXT,
  FOREIGN KEY (repair_id) REFERENCES repairs(id) ON DELETE CASCADE
);

INSERT INTO works (id, title, price) VALUES
  (1, 'Замена дисплея', 4500.00),
  (2, 'Чистка от пыли', 1200.50),
  (3, 'Замена аккумулятора', 2800.00);

INSERT INTO payment_methods (id, title) VALUES (1, 'Наличными'), (2, 'Картой');

INSERT INTO masters (id, full_name) VALUES (1, 'Сидоров Сергей'), (2, 'Кузнецов Кирилл');

INSERT INTO clients (id, phone, full_name) VALUES
  (1, '+7 (900) 123-45-67', 'Иванов Иван'),
  (2, '+7 (900) 765-43-21', 'Петрова Полина');

INSERT INTO repairs (client_id, master_id, work_id, payment_id, device, accepted_on, issued_on, status) VALUES
  (1, 1, 1, 2, 'Ноутбук Lenovo', '2027-03-05', NULL, 'В работе'),
  (2, 2, 2, 1, 'Пылесос Samsung', '2027-03-18', NULL, 'Принят'),
  (1, 1, 3, 2, 'Телефон Xiaomi', '2027-02-20', '2027-02-25', 'Выдан');

INSERT INTO reviews (repair_id, rating, text) VALUES (3, 5, 'Быстро и аккуратно');

SELECT id, DATEDIFF('2027-03-20', accepted_on) AS days
FROM repairs
WHERE status = 'В работе' AND DATEDIFF('2027-03-20', accepted_on) > 7
ORDER BY days DESC;`,
    solutionExplanation:
      'Тема незнакомая, а решения — те же самые, что принимались уже шесть раз: справочники под выпадающие списки, запись со ссылками на всё сразу, отзыв с уникальным ключом и каскадным удалением. Единственное новое — необязательная дата выдачи: пока ремонт не закончен, её просто нет, и это правильнее, чем подставлять нулевую дату. Запрос на затянувшиеся ремонты — типичный отчёт администратора: он показывает, где работа встала, и именно такие запросы просят на защите.',
    maxScore: 35,
    estimatedMinutes: 60,
    examRefs: ['m1-db', 'm1-er', 'm1-admin', 'm3-db'],
    planDays: ['day-30-4'],
    source: 'plan',
  },

  {
    id: 'task-final-review',
    title: 'Разбор последнего прогона перед экзаменом',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['js'],
    topicIds: ['exam-debrief'],
    monthNo: 7,
    weekNo: 30,
    statement: `Последний разбор. Задача не в том, чтобы найти новое, а в том, чтобы решить, что делать в оставшиеся дни: доучивать уже поздно, а вот закрепить и отдохнуть — в самый раз.

Пункты: \`{ id, title, weight, done, confidence }\`, где \`confidence\` — уверенность от 1 до 5.

1. \`risky(items)\` — закрытые пункты с уверенностью не выше 2: сделал, но не уверен, что повторю.
2. \`safe(items)\` — закрытые с уверенностью не ниже 4.
3. \`lastDaysPlan(items)\` — что делать в оставшиеся дни: сначала рискованные пункты по убыванию веса, затем незакрытые с весом не меньше 3. Возвращает названия.
4. \`skipList(items)\` — незакрытые пункты с весом меньше 3: их перед экзаменом трогать не нужно, времени всё равно нет.
5. \`mood(items)\` — если рискованных нет и всё с весом от 3 закрыто → \`'Готов'\`; если рискованных не больше двух → \`'Почти готов'\`; иначе \`'Есть над чем поработать'\`.`,
    requirements: [
      'Рискованные пункты находятся',
      'Надёжные пункты находятся',
      'План последних дней собирается в правильном порядке',
      'Мелкие незакрытые пункты отправляются в список пропуска',
      'Оценка готовности зависит от числа рискованных',
    ],
    starterCode: `function risky(items) {
  // сделал, но не уверен
}

function safe(items) {
  // сделал и уверен
}

function lastDaysPlan(items) {
  // что делать в оставшиеся дни
}

function skipList(items) {
  // что не трогать
}

function mood(items) {
  // оценка готовности
}`,
    tests: [
      {
        id: 'risky-safe',
        name: 'Рискованные и надёжные',
        type: 'assert',
        code: `const risky = ctx.get('risky');
const safe = ctx.get('safe');
const items = [
  { id: 'a', title: 'Админка', weight: 4, done: true, confidence: 2 },
  { id: 'b', title: 'База', weight: 3, done: true, confidence: 5 },
  { id: 'c', title: 'Слайдер', weight: 2, done: false, confidence: 1 },
];
ctx.assert(risky(items).map((i) => i.id).join(',') === 'a', 'Рискованные: ' + ctx.preview(risky(items).map((i) => i.id)));
ctx.assert(safe(items).map((i) => i.id).join(',') === 'b', 'Надёжные: ' + ctx.preview(safe(items).map((i) => i.id)));`,
        points: 6,
      },
      {
        id: 'plan',
        name: 'План последних дней',
        type: 'assert',
        code: `const lastDaysPlan = ctx.get('lastDaysPlan');
const items = [
  { id: 'a', title: 'Админка', weight: 2, done: true, confidence: 1 },
  { id: 'b', title: 'Кабинет', weight: 4, done: true, confidence: 2 },
  { id: 'c', title: 'Отзывы', weight: 3, done: false, confidence: 3 },
  { id: 'd', title: 'Тени', weight: 1, done: false, confidence: 1 },
];
const plan = lastDaysPlan(items);
ctx.assert(plan[0] === 'Кабинет', 'Сверху самый весомый рискованный пункт, получено: ' + ctx.preview(plan));
ctx.assert(plan[1] === 'Админка', 'Затем второй рискованный: ' + ctx.preview(plan));
ctx.assert(plan[2] === 'Отзывы', 'Затем весомый незакрытый: ' + ctx.preview(plan));
ctx.assert(plan.indexOf('Тени') === -1, 'Мелкий незакрытый пункт в план не входит');`,
        points: 7,
      },
      {
        id: 'skip',
        name: 'Список пропуска',
        type: 'assert',
        code: `const skipList = ctx.get('skipList');
const items = [
  { id: 'a', title: 'Тени', weight: 1, done: false, confidence: 1 },
  { id: 'b', title: 'Отзывы', weight: 3, done: false, confidence: 3 },
  { id: 'c', title: 'База', weight: 2, done: true, confidence: 5 },
];
const skip = skipList(items);
ctx.assert(skip.indexOf('Тени') !== -1, 'Мелкий незакрытый пункт должен попасть в пропуск');
ctx.assert(skip.indexOf('Отзывы') === -1, 'Весомый незакрытый пункт пропускать нельзя');
ctx.assert(skip.indexOf('База') === -1, 'Закрытые пункты в пропуск не входят');`,
        points: 6,
      },
      {
        id: 'mood-ready',
        name: 'Готовность: всё закрыто',
        type: 'assert',
        code: `const mood = ctx.get('mood');
const ready = [
  { id: 'a', title: 'База', weight: 4, done: true, confidence: 5 },
  { id: 'b', title: 'Кабинет', weight: 3, done: true, confidence: 4 },
  { id: 'c', title: 'Тени', weight: 1, done: false, confidence: 2 },
];
ctx.assert(mood(ready) === 'Готов', 'Получено: ' + mood(ready));`,
        points: 6,
      },
      {
        id: 'mood-other',
        name: 'Готовность: остальные случаи',
        type: 'assert',
        code: `const mood = ctx.get('mood');
const almost = [
  { id: 'a', title: 'База', weight: 4, done: true, confidence: 2 },
  { id: 'b', title: 'Кабинет', weight: 3, done: true, confidence: 5 },
];
ctx.assert(mood(almost) === 'Почти готов', 'Один рискованный пункт: ' + mood(almost));
const work = [
  { id: 'a', title: 'База', weight: 4, done: true, confidence: 1 },
  { id: 'b', title: 'Кабинет', weight: 3, done: true, confidence: 2 },
  { id: 'c', title: 'Админка', weight: 3, done: true, confidence: 2 },
];
ctx.assert(mood(work) === 'Есть над чем поработать', 'Три рискованных пункта: ' + mood(work));`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Рискованный пункт — закрытый с низкой уверенностью. Именно он подводит в решающий день.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'План собирается конкатенацией двух списков, каждый из которых отсортирован по весу.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const heavyUndone = items.filter((i) => !i.done && i.weight >= 3).sort((a, b) => b.weight - a.weight);',
        penaltyPercent: 35,
      },
    ],
    solution: `function risky(items) {
  return items.filter((item) => item.done && item.confidence <= 2);
}

function safe(items) {
  return items.filter((item) => item.done && item.confidence >= 4);
}

function lastDaysPlan(items) {
  const first = risky(items).slice().sort((a, b) => b.weight - a.weight);
  const second = items
    .filter((item) => !item.done && item.weight >= 3)
    .slice()
    .sort((a, b) => b.weight - a.weight);

  return first.concat(second).map((item) => item.title);
}

function skipList(items) {
  return items.filter((item) => !item.done && item.weight < 3).map((item) => item.title);
}

function mood(items) {
  const dangerous = risky(items).length;
  const heavyUndone = items.filter((item) => !item.done && item.weight >= 3).length;

  if (dangerous === 0 && heavyUndone === 0) return 'Готов';
  if (dangerous <= 2) return 'Почти готов';

  return 'Есть над чем поработать';
}`,
    solutionExplanation:
      'Разделение «сделал» и «сделал уверенно» — самое полезное различие последних дней. Пункт, закрытый с трудом и подглядыванием, на экзамене закроется не обязательно, и повторять надо именно его, а не то, что и так получается. Список пропуска не менее важен: за два дня до экзамена браться за мелкие незакрытые пункты — значит тратить нервы на то, что почти не влияет на результат. Оценка готовности нужна не для самоуспокоения, а чтобы решить, отдыхать или работать.',
    maxScore: 31,
    estimatedMinutes: 25,
    examRefs: ['m3-quality'],
    planDays: ['day-30-5'],
    source: 'plan',
  },

  {
    id: 'task-first-minutes-plan',
    title: 'Личный план первых десяти минут',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['js'],
    topicIds: ['exam-first-minutes'],
    monthNo: 7,
    weekNo: 30,
    statement: `Последнее, что стоит сделать перед экзаменом, — записать план первых десяти минут. В эти минуты решается, будет ли остаток дня спокойным.

1. \`FIRST_MINUTES\` — семь шагов вида \`{ order, title, minutes }\`, в сумме ровно **10** минут:
   1. прочитать задание целиком, ничего не записывая;
   2. выписать дословные значения: формат даты, слайдер, размер экрана, тексты в кавычках;
   3. выписать список сущностей будущей базы;
   4. набросать схему таблиц на бумаге;
   5. выписать список адресов сервера;
   6. создать репозиторий и сделать первый пустой коммит;
   7. распределить время по модулям.
2. \`totalMinutes()\` — сумма, должна быть 10.
3. \`stepAt(minute)\` — какой шаг идёт на указанной минуте (от 0). За пределами плана — \`null\`.
4. \`checklistText()\` — нумерованный список строк вида \`'1. Прочитать задание целиком (1 мин)'\`.
5. \`isOnTrack(spent)\` — уложились ли в десять минут: \`spent\` не больше 10.`,
    requirements: [
      'Семь шагов описаны, сумма ровно 10 минут',
      'Шаги идут по порядку',
      'stepAt находит шаг по минуте',
      'За пределами плана возвращается null',
      'Чек-лист собирается строками с номерами',
    ],
    starterCode: `const FIRST_MINUTES = [
  // семь шагов { order, title, minutes }
];

function totalMinutes() {
  // сумма минут
}

function stepAt(minute) {
  // шаг на этой минуте
}

function checklistText() {
  // строки чек-листа
}

function isOnTrack(spent) {
  // уложились ли
}`,
    tests: [
      {
        id: 'steps',
        name: 'Семь шагов и десять минут',
        type: 'assert',
        code: `const FIRST_MINUTES = ctx.get('FIRST_MINUTES');
const totalMinutes = ctx.get('totalMinutes');
ctx.assert(Array.isArray(FIRST_MINUTES) && FIRST_MINUTES.length === 7, 'Шагов должно быть семь, найдено: ' + (FIRST_MINUTES || []).length);
ctx.assert(totalMinutes() === 10, 'Сумма должна быть ровно 10 минут, получено: ' + totalMinutes(), 10, totalMinutes());
FIRST_MINUTES.forEach((step, index) => {
  ctx.assert(step.order === index + 1, 'Шаги должны идти по порядку, сбой на позиции ' + index);
  ctx.assert(typeof step.title === 'string' && step.title.length >= 10, 'У шага ' + (index + 1) + ' нет внятного названия');
  ctx.assert(step.minutes > 0, 'У шага ' + (index + 1) + ' должно быть положительное время');
});`,
        points: 7,
      },
      {
        id: 'content',
        name: 'Шаги по смыслу',
        type: 'assert',
        code: `const FIRST_MINUTES = ctx.get('FIRST_MINUTES');
const text = FIRST_MINUTES.map((step) => step.title.toLowerCase()).join(' | ');
['задани', 'кавычк', 'табл', 'адрес', 'коммит', 'время'].forEach((word) => {
  ctx.assert(text.indexOf(word) !== -1, 'В плане не хватает шага про «' + word + '». Сейчас: ' + text);
});`,
        points: 6,
      },
      {
        id: 'step-at',
        name: 'Шаг по минуте',
        type: 'assert',
        code: `const stepAt = ctx.get('stepAt');
const FIRST_MINUTES = ctx.get('FIRST_MINUTES');
ctx.assert(stepAt(0) && stepAt(0).order === 1, 'На нулевой минуте идёт первый шаг, получено: ' + ctx.preview(stepAt(0)));
const last = stepAt(9);
ctx.assert(last && last.order === FIRST_MINUTES.length, 'На девятой минуте идёт последний шаг, получено: ' + ctx.preview(last));
ctx.assert(stepAt(10) === null, 'За пределами плана нужен null');
ctx.assert(stepAt(-1) === null, 'Отрицательная минута — тоже null');`,
        points: 7,
      },
      {
        id: 'checklist',
        name: 'Текст чек-листа',
        type: 'assert',
        code: `const checklistText = ctx.get('checklistText');
const lines = checklistText();
ctx.assert(Array.isArray(lines) && lines.length === 7, 'Строк должно быть семь, получено: ' + (lines || []).length);
ctx.assert(lines[0].indexOf('1. ') === 0, 'Строка должна начинаться с номера: ' + lines[0]);
ctx.assert(/\\(\\d+ мин\\)$/.test(lines[0]), 'Строка должна заканчиваться временем в скобках: ' + lines[0]);`,
        points: 6,
      },
      {
        id: 'on-track',
        name: 'Уложились ли в план',
        type: 'assert',
        code: `const isOnTrack = ctx.get('isOnTrack');
ctx.assert(isOnTrack(8) === true, 'Восемь минут — уложились');
ctx.assert(isOnTrack(10) === true, 'Ровно десять — уложились');
ctx.assert(isOnTrack(14) === false, 'Четырнадцать — не уложились');`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Распределите десять минут так, чтобы на чтение задания ушло не меньше двух: это единственный шаг, который нельзя делать бегло.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Для stepAt накапливайте время по шагам и возвращайте тот, на котором сумма впервые превысила указанную минуту.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'let passed = 0; for (const step of FIRST_MINUTES) { passed += step.minutes; if (minute < passed) return step; } return null;',
        penaltyPercent: 35,
      },
    ],
    solution: `const FIRST_MINUTES = [
  { order: 1, title: 'Прочитать задание целиком, ничего не записывая', minutes: 2 },
  { order: 2, title: 'Выписать дословные значения: дата, слайдер, экран, тексты в кавычках', minutes: 2 },
  { order: 3, title: 'Выписать список сущностей будущей базы', minutes: 1 },
  { order: 4, title: 'Набросать схему таблиц на бумаге', minutes: 2 },
  { order: 5, title: 'Выписать список адресов сервера', minutes: 1 },
  { order: 6, title: 'Создать репозиторий и сделать первый коммит', minutes: 1 },
  { order: 7, title: 'Распределить время по модулям', minutes: 1 },
];

function totalMinutes() {
  return FIRST_MINUTES.reduce((sum, step) => sum + step.minutes, 0);
}

function stepAt(minute) {
  if (minute < 0) return null;

  let passed = 0;

  for (const step of FIRST_MINUTES) {
    passed += step.minutes;
    if (minute < passed) return step;
  }

  return null;
}

function checklistText() {
  return FIRST_MINUTES.map((step) => step.order + '. ' + step.title + ' (' + step.minutes + ' мин)');
}

function isOnTrack(spent) {
  return spent <= totalMinutes();
}`,
    solutionExplanation:
      'Первый шаг — прочитать задание целиком, ничего не записывая, и на него отведены целых две минуты из десяти. Соблазн начать выписывать с первой строки велик, но тогда картина складывается по кускам, и структура базы получается случайной. Коммит на шестом шаге тоже не случаен: пустой репозиторий, созданный в начале, снимает риск забыть про историю в спешке, а требование промежуточных коммитов есть во всех трёх модулях. Десять минут кажутся потерянными, но они окупаются к первому же часу.',
    maxScore: 30,
    estimatedMinutes: 25,
    examRefs: ['m1-db', 'm1-git', 'm2-slider', 'm2-mobile'],
    planDays: ['day-30-6'],
    source: 'plan',
  },
];
