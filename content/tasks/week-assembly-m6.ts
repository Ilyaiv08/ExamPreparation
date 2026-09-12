import type { Task } from '../types';

/** Сборки недель 21-24: качество и безопасность, разбор проектов, полный прогон. */
export const WEEK_ASSEMBLY_M6: Task[] = [
  {
    id: 'task-week-21-assembly',
    title: 'Сборка недели 21: пять проверок безопасности и четыре состояния',
    kind: 'function',
    runtime: 'js',
    difficulty: 4,
    tech: ['js', 'security'],
    topicIds: ['security-basics', 'ui-states', 'code-quality'],
    monthNo: 6,
    weekNo: 21,
    statement: `Неделя была насыщенной: база, качество кода, безопасность, состояния интерфейса. Закрепляем то, что забывается быстрее всего, — списки проверок.

1. \`SECURITY_CHECKS\` — пять проверок безопасности в виде \`{ id, title }\` с такими идентификаторами: \`'hash'\` (пароль хранится отпечатком), \`'params'\` (значения в запрос подставляются параметрами), \`'server-validation'\` (сервер проверяет данные сам), \`'ownership'\` (сервер проверяет, что объект принадлежит пользователю), \`'roles'\` (админские адреса закрыты проверкой роли).
2. \`PAGE_STATES\` — четыре состояния страницы с данными: \`'loading'\`, \`'ready'\`, \`'empty'\`, \`'error'\`.
3. \`auditSecurity(project)\` — принимает объект вида \`{ hash: true, params: false, … }\` и возвращает названия непройденных проверок в порядке из списка.
4. \`stateOf(result)\` — определяет состояние по объекту \`{ loading, error, items }\`: идёт загрузка → \`'loading'\`; есть ошибка → \`'error'\`; пустой массив → \`'empty'\`; иначе \`'ready'\`. Порядок проверок именно такой.
5. \`isSafeToShip(project)\` — \`true\`, только если пройдены все пять проверок безопасности.`,
    requirements: [
      'Описаны все пять проверок безопасности',
      'Описаны все четыре состояния страницы',
      'auditSecurity возвращает непройденные проверки по порядку',
      'stateOf различает все четыре состояния',
      'Загрузка важнее ошибки, ошибка важнее пустоты',
      'isSafeToShip требует всех пяти проверок',
    ],
    starterCode: `const SECURITY_CHECKS = [
  // пять проверок { id, title }
];

const PAGE_STATES = [
  // четыре состояния
];

function auditSecurity(project) {
  // названия непройденных проверок
}

function stateOf(result) {
  // 'loading' | 'error' | 'empty' | 'ready'
}

function isSafeToShip(project) {
  // все пять пройдены?
}`,
    tests: [
      {
        id: 'checks',
        name: 'Пять проверок безопасности',
        type: 'assert',
        code: `const checks = ctx.get('SECURITY_CHECKS');
ctx.assert(Array.isArray(checks) && checks.length === 5, 'Проверок должно быть пять, найдено: ' + (checks || []).length);
['hash', 'params', 'server-validation', 'ownership', 'roles'].forEach((id) => {
  const item = checks.filter((check) => check.id === id)[0];
  ctx.assert(item, 'Нет проверки ' + id);
  ctx.assert(typeof item.title === 'string' && item.title.length >= 10, 'У проверки ' + id + ' нет внятного названия');
});`,
        points: 5,
      },
      {
        id: 'states',
        name: 'Четыре состояния страницы',
        type: 'assert',
        code: `const states = ctx.get('PAGE_STATES');
ctx.assert(Array.isArray(states) && states.length === 4, 'Состояний должно быть четыре, найдено: ' + (states || []).length);
['loading', 'ready', 'empty', 'error'].forEach((state) => {
  ctx.assert(states.indexOf(state) !== -1, 'Не хватает состояния ' + state);
});`,
        points: 4,
      },
      {
        id: 'audit',
        name: 'Непройденные проверки',
        type: 'assert',
        code: `const auditSecurity = ctx.get('auditSecurity');
const checks = ctx.get('SECURITY_CHECKS');
const result = auditSecurity({ hash: true, params: false, 'server-validation': true, ownership: false, roles: true });
ctx.assert(result.length === 2, 'Непройденных должно быть две, получено: ' + ctx.preview(result));
const titles = checks.filter((check) => check.id === 'params' || check.id === 'ownership').map((check) => check.title);
titles.forEach((title) => {
  ctx.assert(result.indexOf(title) !== -1, 'В списке нет проверки «' + title + '»');
});
ctx.assert(auditSecurity({ hash: true, params: true, 'server-validation': true, ownership: true, roles: true }).length === 0, 'Когда всё пройдено, список пуст');
ctx.assert(auditSecurity({}).length === 5, 'Когда ничего не отмечено, непройдены все пять');`,
        points: 6,
      },
      {
        id: 'state-of',
        name: 'Состояние определяется верно',
        type: 'assert',
        code: `const stateOf = ctx.get('stateOf');
ctx.assert(stateOf({ loading: true, error: null, items: [] }) === 'loading', 'Загрузка: ' + stateOf({ loading: true, error: null, items: [] }));
ctx.assert(stateOf({ loading: false, error: 'нет связи', items: [] }) === 'error', 'Ошибка не распознана');
ctx.assert(stateOf({ loading: false, error: null, items: [] }) === 'empty', 'Пустой список не распознан');
ctx.assert(stateOf({ loading: false, error: null, items: [1, 2] }) === 'ready', 'Данные не распознаны');`,
        points: 6,
      },
      {
        id: 'priority',
        name: 'Порядок важности состояний',
        type: 'assert',
        code: `const stateOf = ctx.get('stateOf');
ctx.assert(
  stateOf({ loading: true, error: 'нет связи', items: [] }) === 'loading',
  'Пока идёт загрузка, показывать старую ошибку нельзя: пользователь решит, что повтор не сработал',
);
ctx.assert(
  stateOf({ loading: false, error: 'нет связи', items: [1] }) === 'error',
  'Ошибка важнее устаревших данных: показывать их как актуальные — врать',
);`,
        points: 6,
      },
      {
        id: 'ship',
        name: 'Готовность к сдаче',
        type: 'assert',
        code: `const isSafeToShip = ctx.get('isSafeToShip');
ctx.assert(
  isSafeToShip({ hash: true, params: true, 'server-validation': true, ownership: true, roles: true }) === true,
  'Все пять пройдены — можно сдавать',
);
ctx.assert(
  isSafeToShip({ hash: true, params: true, 'server-validation': true, ownership: true, roles: false }) === false,
  'Незакрытая админка — не мелочь',
);
ctx.assert(isSafeToShip({}) === false, 'Ничего не отмечено — сдавать нельзя');`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'auditSecurity — это фильтр по списку: берём те проверки, у которых в объекте не true, и возвращаем их названия.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Порядок проверок в stateOf важен: сначала загрузка, потом ошибка, потом пустота. Каждая — отдельный ранний возврат.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'return SECURITY_CHECKS.filter((check) => project[check.id] !== true).map((check) => check.title);',
        penaltyPercent: 35,
      },
    ],
    solution: `const SECURITY_CHECKS = [
  { id: 'hash', title: 'Пароль хранится отпечатком, а не открытым текстом' },
  { id: 'params', title: 'Значения подставляются параметрами, а не склейкой строк' },
  { id: 'server-validation', title: 'Сервер проверяет данные сам, не полагаясь на интерфейс' },
  { id: 'ownership', title: 'Сервер проверяет, что объект принадлежит пользователю' },
  { id: 'roles', title: 'Админские адреса закрыты проверкой роли' },
];

const PAGE_STATES = ['loading', 'ready', 'empty', 'error'];

function auditSecurity(project) {
  return SECURITY_CHECKS.filter((check) => project[check.id] !== true).map((check) => check.title);
}

function stateOf(result) {
  if (result.loading) return 'loading';
  if (result.error) return 'error';
  if (!result.items || result.items.length === 0) return 'empty';
  return 'ready';
}

function isSafeToShip(project) {
  return auditSecurity(project).length === 0;
}`,
    solutionExplanation:
      'Порядок проверок в stateOf выбран не случайно. Загрузка идёт первой: если во время повторной попытки показывать прежнюю ошибку, пользователь решит, что кнопка не сработала. Ошибка идёт раньше данных: показать старый список как актуальный, когда обновление не удалось, — значит соврать. Пустота проверяется последней, потому что отличить «ничего нет» от «не смогли загрузить» можно, только когда обе предыдущие ветки отпали. Функция isSafeToShip построена поверх auditSecurity — одно правило в одном месте.',
    maxScore: 32,
    estimatedMinutes: 30,
    examRefs: ['m3-quality', 'm1-admin', 'm1-login'],
    planDays: ['day-21-7'],
    source: 'plan',
  },

  {
    id: 'task-week-22-assembly',
    title: 'Сборка недели 22: разбор проекта и список для тренировки',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['js'],
    topicIds: ['new-domains', 'memory-training'],
    monthNo: 6,
    weekNo: 22,
    statement: `Сравниваем второй проект с первым: где стало быстрее, а где по-прежнему медленно. Медленные места и есть список тем для тренировки — он точнее любой общей программы повторения.

Замеры приходят массивом \`{ stage, first, second }\` — минуты на этапе в первом и втором проектах.

1. \`speedup(measure)\` — насколько процентов стало быстрее, округлённо. Для \`{ first: 100, second: 75 }\` — \`25\`. Если стало медленнее, число отрицательное.
2. \`report(measures)\` — массив \`{ stage, speedup }\`, отсортированный по возрастанию ускорения: самые проблемные этапы сверху.
3. \`drillList(measures)\` — названия этапов, где ускорение **меньше 20%**. Это и есть список для тренировки.
4. \`totals(measures)\` — \`{ first, second, speedup }\` по сумме всех этапов.
5. \`verdict(measures)\` — \`'Готов к прогонам'\`, если список для тренировки пуст; иначе \`'Тренировать: '\` и этапы через запятую в том же порядке.`,
    requirements: [
      'speedup считает процент ускорения',
      'Замедление даёт отрицательное число',
      'report сортирует от худшего к лучшему',
      'drillList отбирает этапы медленнее 20%',
      'totals считает по сумме',
      'verdict собирает вывод',
    ],
    starterCode: `function speedup(measure) {
  // процент ускорения
}

function report(measures) {
  // [{ stage, speedup }] — худшее сверху
}

function drillList(measures) {
  // что тренировать
}

function totals(measures) {
  // { first, second, speedup }
}

function verdict(measures) {
  // текст вывода
}`,
    tests: [
      {
        id: 'speedup',
        name: 'Процент ускорения',
        type: 'assert',
        code: `const speedup = ctx.get('speedup');
ctx.assert(speedup({ stage: 'База', first: 100, second: 75 }) === 25, 'Со 100 до 75 — это 25%, получено: ' + speedup({ first: 100, second: 75 }));
ctx.assert(speedup({ stage: 'База', first: 60, second: 30 }) === 50, 'С 60 до 30 — это 50%');
ctx.assert(speedup({ stage: 'База', first: 40, second: 40 }) === 0, 'Без изменений — 0%');`,
        points: 4,
      },
      {
        id: 'slowdown',
        name: 'Замедление считается отрицательным',
        type: 'assert',
        code: `const speedup = ctx.get('speedup');
const value = speedup({ stage: 'Админка', first: 40, second: 50 });
ctx.assert(value === -25, 'С 40 до 50 — это минус 25%, получено: ' + value, -25, value);`,
        points: 4,
      },
      {
        id: 'report',
        name: 'Отчёт: худшее сверху',
        type: 'assert',
        code: `const report = ctx.get('report');
const measures = [
  { stage: 'База', first: 60, second: 30 },
  { stage: 'Админка', first: 40, second: 38 },
  { stage: 'Сервер', first: 80, second: 60 },
];
const result = report(measures);
ctx.assert(result.length === 3, 'Этапов должно быть три');
ctx.assert(result[0].stage === 'Админка', 'Сверху должен быть самый медленный этап, получено: ' + result[0].stage);
ctx.assert(result[2].stage === 'База', 'Снизу — самый быстрый, получено: ' + result[2].stage);
for (let i = 1; i < result.length; i += 1) {
  ctx.assert(result[i - 1].speedup <= result[i].speedup, 'Порядок нарушен: ' + result.map((r) => r.speedup).join(', '));
}`,
        points: 6,
      },
      {
        id: 'drill',
        name: 'Список для тренировки',
        type: 'assert',
        code: `const drillList = ctx.get('drillList');
const measures = [
  { stage: 'База', first: 60, second: 30 },
  { stage: 'Админка', first: 40, second: 38 },
  { stage: 'Сервер', first: 80, second: 60 },
  { stage: 'Отделка', first: 30, second: 35 },
];
const list = drillList(measures);
ctx.assert(list.indexOf('Админка') !== -1, 'Админка ускорилась на 5% — её надо тренировать');
ctx.assert(list.indexOf('Отделка') !== -1, 'Отделка замедлилась — её тоже надо тренировать');
ctx.assert(list.indexOf('База') === -1, 'База ускорилась вдвое — тренировать не нужно');
ctx.assert(list.indexOf('Сервер') === -1, 'Сервер ускорился на 25% — тренировать не нужно');`,
        points: 6,
      },
      {
        id: 'totals',
        name: 'Итог по сумме',
        type: 'assert',
        code: `const totals = ctx.get('totals');
const result = totals([
  { stage: 'База', first: 60, second: 30 },
  { stage: 'Сервер', first: 40, second: 30 },
]);
ctx.assert(result.first === 100, 'Сумма первого прогона 100, получено: ' + result.first);
ctx.assert(result.second === 60, 'Сумма второго прогона 60, получено: ' + result.second);
ctx.assert(result.speedup === 40, 'Ускорение по сумме 40%, получено: ' + result.speedup);`,
        points: 5,
      },
      {
        id: 'verdict',
        name: 'Вывод по итогам',
        type: 'assert',
        code: `const verdict = ctx.get('verdict');
const good = [
  { stage: 'База', first: 60, second: 30 },
  { stage: 'Сервер', first: 80, second: 60 },
];
ctx.assert(verdict(good) === 'Готов к прогонам', 'Когда всё ускорилось: ' + verdict(good));
const bad = [
  { stage: 'База', first: 60, second: 30 },
  { stage: 'Админка', first: 40, second: 38 },
  { stage: 'Отделка', first: 30, second: 35 },
];
const text = verdict(bad);
ctx.assert(text.indexOf('Тренировать:') === 0, 'Вывод должен начинаться с «Тренировать:», получено: ' + text);
ctx.assert(text.indexOf('Отделка') < text.indexOf('Админка'), 'Этапы идут в том же порядке, что в списке тренировки: ' + text);`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Процент ускорения: (first - second) / first * 100. Если second больше first, число выйдет отрицательным само.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'drillList и verdict должны опираться на report — тогда порядок этапов совпадёт автоматически.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'return report(measures).filter((item) => item.speedup < 20).map((item) => item.stage);',
        penaltyPercent: 35,
      },
    ],
    solution: `function speedup(measure) {
  return Math.round(((measure.first - measure.second) / measure.first) * 100);
}

function report(measures) {
  return measures
    .map((measure) => ({ stage: measure.stage, speedup: speedup(measure) }))
    .sort((a, b) => a.speedup - b.speedup);
}

function drillList(measures) {
  return report(measures)
    .filter((item) => item.speedup < 20)
    .map((item) => item.stage);
}

function totals(measures) {
  const first = measures.reduce((sum, measure) => sum + measure.first, 0);
  const second = measures.reduce((sum, measure) => sum + measure.second, 0);

  return { first, second, speedup: speedup({ first, second }) };
}

function verdict(measures) {
  const list = drillList(measures);
  return list.length === 0 ? 'Готов к прогонам' : 'Тренировать: ' + list.join(', ');
}`,
    solutionExplanation:
      'Функция speedup написана один раз и используется и для этапа, и для итога — объект \\{ first, second \\} у них одинаковый, и отдельная функция для суммы не нужна. Порог в 20% выбран не как истина, а как рабочее правило: если этап за второй проект ускорился меньше чем на пятую часть, значит он всё ещё пишется по памяти с усилием, а не на автомате. Сортировка «худшее сверху» превращает отчёт в план: тренировать начинают с того, что в списке первое.',
    maxScore: 31,
    estimatedMinutes: 30,
    examRefs: ['m3-quality'],
    planDays: ['day-22-7'],
    source: 'plan',
  },

  {
    id: 'task-week-23-assembly',
    title: 'Лёгкий день: разбор по памяти без кода',
    kind: 'function',
    runtime: 'js',
    difficulty: 2,
    tech: ['js'],
    topicIds: ['memory-training'],
    monthNo: 6,
    weekNo: 23,
    statement: `После трёх проектов подряд нужен разгрузочный день — он в программе не случайно. Сегодня коротко и без напряжения: перечитайте свои записи и выпишите из головы три вещи, которые проверяют на каждом экзамене.

1. \`EXAM_MODULES\` — три модуля в виде \`{ no, title, minutes }\`: первый «Разработка веб-приложения» 180 минут, второй «Доработка веб-приложения» 120 минут, третий «Тестирование и доработка» 120 минут.
2. \`DATE_FORMAT\` — строка \`'ДД.ММ.ГГГГ'\`, формат вывода даты из задания.
3. \`SLIDER_RULE\` — объект \`{ images: 4, seconds: 3 }\`: параметры слайдера из задания.
4. \`MOBILE_SIZE\` — объект \`{ width: 390, height: 844 }\`.
5. \`totalMinutes()\` — сколько всего длится экзамен.
6. \`moduleByNo(no)\` — модуль по номеру или \`undefined\`.

Если что-то не вспомнилось за минуту — посмотрите в свои записи и выпишите ещё раз. Сегодня цель не проверить, а закрепить.`,
    requirements: [
      'Выписаны три модуля с длительностью',
      'Формат даты записан верно',
      'Параметры слайдера записаны верно',
      'Размер мобильного экрана записан верно',
      'totalMinutes считает общую длительность',
      'moduleByNo находит модуль по номеру',
    ],
    starterCode: `const EXAM_MODULES = [
  // три модуля { no, title, minutes }
];

const DATE_FORMAT = '';
const SLIDER_RULE = {};
const MOBILE_SIZE = {};

function totalMinutes() {
  // сколько всего
}

function moduleByNo(no) {
  // модуль по номеру
}`,
    tests: [
      {
        id: 'modules',
        name: 'Три модуля выписаны',
        type: 'assert',
        code: `const modules = ctx.get('EXAM_MODULES');
ctx.assert(Array.isArray(modules) && modules.length === 3, 'Модулей должно быть три, найдено: ' + (modules || []).length);
const expected = { 1: 180, 2: 120, 3: 120 };
[1, 2, 3].forEach((no) => {
  const item = modules.filter((module) => module.no === no)[0];
  ctx.assert(item, 'Нет модуля ' + no);
  ctx.assert(item.minutes === expected[no], 'У модуля ' + no + ' должно быть ' + expected[no] + ' минут, указано: ' + item.minutes);
  ctx.assert(typeof item.title === 'string' && item.title.length >= 10, 'У модуля ' + no + ' нет внятного названия');
});`,
        points: 5,
      },
      {
        id: 'date-format',
        name: 'Формат даты',
        type: 'assert',
        code: `const format = ctx.get('DATE_FORMAT');
ctx.assert(format === 'ДД.ММ.ГГГГ', 'Задание требует формат ДД.ММ.ГГГГ, указано: «' + format + '»');`,
        points: 3,
      },
      {
        id: 'slider',
        name: 'Параметры слайдера',
        type: 'assert',
        code: `const rule = ctx.get('SLIDER_RULE');
ctx.assert(rule && rule.images === 4, 'В задании четыре изображения, указано: ' + (rule && rule.images));
ctx.assert(rule && rule.seconds === 3, 'Переключение через три секунды, указано: ' + (rule && rule.seconds));`,
        points: 4,
      },
      {
        id: 'mobile',
        name: 'Размер мобильного экрана',
        type: 'assert',
        code: `const size = ctx.get('MOBILE_SIZE');
ctx.assert(size && size.width === 390, 'Ширина по заданию 390, указано: ' + (size && size.width));
ctx.assert(size && size.height === 844, 'Высота по заданию 844, указано: ' + (size && size.height));`,
        points: 3,
      },
      {
        id: 'total',
        name: 'Общая длительность',
        type: 'assert',
        code: `const totalMinutes = ctx.get('totalMinutes');
ctx.assert(totalMinutes() === 420, 'Всего 420 минут (семь часов), получено: ' + totalMinutes(), 420, totalMinutes());`,
        points: 3,
      },
      {
        id: 'by-no',
        name: 'Модуль по номеру',
        type: 'assert',
        code: `const moduleByNo = ctx.get('moduleByNo');
ctx.assert(moduleByNo(2) && moduleByNo(2).minutes === 120, 'Второй модуль не найден');
ctx.assert(moduleByNo(9) === undefined, 'Для несуществующего номера нужен undefined');`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Все четыре числа есть в задании демоэкзамена. Если не помните — посмотрите, сегодня это не считается подглядыванием.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'totalMinutes удобно посчитать через reduce по EXAM_MODULES, а не вписывать число руками.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'return EXAM_MODULES.reduce((sum, module) => sum + module.minutes, 0);',
        penaltyPercent: 35,
      },
    ],
    solution: `const EXAM_MODULES = [
  { no: 1, title: 'Разработка веб-приложения', minutes: 180 },
  { no: 2, title: 'Доработка веб-приложения', minutes: 120 },
  { no: 3, title: 'Тестирование и доработка веб-приложения', minutes: 120 },
];

const DATE_FORMAT = 'ДД.ММ.ГГГГ';
const SLIDER_RULE = { images: 4, seconds: 3 };
const MOBILE_SIZE = { width: 390, height: 844 };

function totalMinutes() {
  return EXAM_MODULES.reduce((sum, module) => sum + module.minutes, 0);
}

function moduleByNo(no) {
  return EXAM_MODULES.find((module) => module.no === no);
}`,
    solutionExplanation:
      'Четыре числа — 390 на 844, четыре картинки, три секунды, формат ДД.ММ.ГГГГ — встречаются в задании дословно и проверяются буквально. Их стоит помнить не потому, что нельзя посмотреть, а потому, что на экзамене каждое обращение к заданию отнимает время и внимание. Общая длительность считается из списка, а не вписывается числом: если разложение по модулям поменяется, сумма пересчитается сама.',
    maxScore: 21,
    estimatedMinutes: 15,
    examRefs: ['m2-slider', 'm2-mobile', 'm2-order-form'],
    planDays: ['day-23-7'],
    source: 'plan',
  },

  {
    id: 'task-week-24-assembly',
    title: 'Контроль месяца 6: полный прогон приложения',
    kind: 'app',
    runtime: 'react',
    difficulty: 5,
    tech: ['react'],
    topicIds: ['memory-training', 'ui-states', 'code-quality'],
    monthNo: 6,
    weekNo: 24,
    statement: `Контроль за шестой месяц: полный прогон на четыре часа. Здесь — та его часть, которую можно проверить автоматически: приложение библиотеки со всеми требованиями трёх модулей сразу.

Компонент \`App\` принимает \`{ load, onExtend }\`, где \`load()\` возвращает промис с массивом выдач \`{ id, book, dueOn, status }\` (даты в \`ГГГГ-ММ-ДД\`), а \`onExtend(id)\` возвращает промис.

**Модуль 1 — вход и данные:**

1. кнопка \`#auth\`, имя в \`#greeting\` («Гость» или «Иванов Илья»);
2. список выдач \`.loan\` только для вошедшего; гостю — блок \`#guard\`.

**Модуль 2 — интерфейс:**

3. даты в формате **ДД.ММ.ГГГГ**;
4. фильтр \`#filter\` по статусу и счётчик \`#count\`;
5. кнопка \`.extend\` у выдач со статусом \`'Выдана'\`; после продления — «Продлено».

**Модуль 3 — состояния и качество:**

6. четыре состояния: \`#loading\` пока грузится, \`#error\` с кнопкой \`#retry\` при отказе, \`#empty\` при пустом ответе, список при данных;
7. технические подробности ошибки наружу не выводятся.`,
    requirements: [
      'Вход и выход меняют приветствие',
      'Гость не видит выдачи',
      'Даты выводятся в формате ДД.ММ.ГГГГ',
      'Фильтр и счётчик работают',
      'Продление доступно только действующим выдачам',
      'Четыре состояния разведены, ошибка не показывает подробностей',
    ],
    starterCode: `const STATUSES = ['Выдана', 'Возвращена', 'Просрочена'];

function App({ load, onExtend }) {
  // вход, состояния загрузки, фильтр, продление
}`,
    tests: [
      {
        id: 'loading',
        name: 'Состояние загрузки',
        type: 'react',
        code: `return ctx.render('App', { load: () => new Promise(() => {}), onExtend: () => Promise.resolve() }).then(() => {
  ctx.assert(ctx.$('#loading'), 'Пока данные не пришли, нужен блок #loading');
  ctx.assert(!ctx.$('#error') && !ctx.$('#empty'), 'Одновременно видно одно состояние');
});`,
        points: 5,
      },
      {
        id: 'error',
        name: 'Ошибка без технических подробностей',
        type: 'react',
        code: `return ctx.render('App', { load: () => Promise.reject(new Error('fetch failed at line 42')), onExtend: () => Promise.resolve() })
  .then(() => ctx.advanceTime(60))
  .then(() => {
    const error = ctx.$('#error');
    ctx.assert(error, 'При отказе нужен блок #error');
    ctx.assert(error.textContent.indexOf('fetch failed') === -1, 'Технические подробности показывать нельзя');
    ctx.assert(ctx.$('#retry'), 'Нужна кнопка #retry');
  });`,
        points: 6,
      },
      {
        id: 'empty',
        name: 'Пустой ответ объяснён',
        type: 'react',
        code: `return ctx.render('App', { load: () => Promise.resolve([]), onExtend: () => Promise.resolve() })
  .then(() => ctx.advanceTime(60))
  .then(() => {
    if (ctx.$('#auth') && ctx.$('#auth').textContent.trim() === 'Войти') return ctx.click('#auth');
    return null;
  })
  .then(() => {
    ctx.assert(ctx.$('#empty'), 'При пустом ответе нужен блок #empty');
    ctx.assert(ctx.$$('.loan').length === 0, 'Карточек быть не должно');
  });`,
        points: 6,
      },
      {
        id: 'guard',
        name: 'Гость не видит выдачи',
        type: 'react',
        code: `const loans = [{ id: 1, book: 'Война и мир', dueOn: '2027-03-20', status: 'Выдана' }];
return ctx.render('App', { load: () => Promise.resolve(loans), onExtend: () => Promise.resolve() })
  .then(() => ctx.advanceTime(60))
  .then(() => {
    if (ctx.$('#auth').textContent.trim() === 'Выйти') return ctx.click('#auth');
    return null;
  })
  .then(() => {
    ctx.assert(ctx.text('#greeting') === 'Гость', 'До входа — «Гость», сейчас: ' + ctx.text('#greeting'));
    ctx.assert(ctx.$('#guard'), 'Гостю нужен блок #guard');
    ctx.assert(ctx.$$('.loan').length === 0, 'Гость не должен видеть выдачи');
  });`,
        points: 6,
      },
      {
        id: 'data',
        name: 'Данные, даты и счётчик',
        type: 'react',
        code: `const loans = [
  { id: 1, book: 'Война и мир', dueOn: '2027-03-20', status: 'Выдана' },
  { id: 2, book: 'Идиот', dueOn: '2027-02-10', status: 'Возвращена' },
];
return ctx.render('App', { load: () => Promise.resolve(loans), onExtend: () => Promise.resolve() })
  .then(() => ctx.advanceTime(60))
  .then(() => {
    if (ctx.$('#auth').textContent.trim() === 'Войти') return ctx.click('#auth');
    return null;
  })
  .then(() => ctx.change('#filter', ''))
  .then(() => {
    ctx.assert(ctx.$$('.loan').length === 2, 'Карточек должно быть две, найдено: ' + ctx.$$('.loan').length);
    const text = ctx.text();
    ctx.assert(text.indexOf('20.03.2027') !== -1, 'Дата должна быть в формате ДД.ММ.ГГГГ, сейчас: ' + text.slice(0, 140));
    ctx.assert(!/\\d{4}-\\d{2}-\\d{2}/.test(text), 'Машинный формат даты показывать не нужно');
    ctx.assert(ctx.text('#count').indexOf('2') !== -1, 'Счётчик: ' + ctx.text('#count'));
  });`,
        points: 7,
      },
      {
        id: 'filter-extend',
        name: 'Фильтр и продление',
        type: 'react',
        code: `const loans = [
  { id: 1, book: 'Война и мир', dueOn: '2027-03-20', status: 'Выдана' },
  { id: 2, book: 'Идиот', dueOn: '2027-02-10', status: 'Возвращена' },
];
const calls = [];
return ctx.render('App', { load: () => Promise.resolve(loans), onExtend: (id) => { calls.push(id); return Promise.resolve(); } })
  .then(() => ctx.advanceTime(60))
  .then(() => {
    if (ctx.$('#auth').textContent.trim() === 'Войти') return ctx.click('#auth');
    return null;
  })
  .then(() => ctx.change('#filter', 'Возвращена'))
  .then(() => {
    ctx.assert(ctx.$$('.loan').length === 1, 'После фильтра должна остаться одна карточка');
    ctx.assert(ctx.$$('.extend').length === 0, 'У возвращённой выдачи кнопки продления быть не должно');
    return ctx.change('#filter', 'Выдана');
  })
  .then(() => {
    ctx.assert(ctx.$('.extend'), 'У действующей выдачи должна быть кнопка продления');
    return ctx.click('.extend');
  })
  .then(() => ctx.advanceTime(60))
  .then(() => {
    ctx.assert(calls.length === 1 && calls[0] === 1, 'onExtend должен получить номер выдачи: ' + ctx.preview(calls));
    ctx.assert(ctx.text().indexOf('Продлено') !== -1, 'После продления нужна отметка');
    ctx.assert(!ctx.$('.extend'), 'Кнопка продления должна исчезнуть');
  });`,
        points: 8,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Соберите каркас в порядке: состояния загрузки → вход → фильтр → карточки. Каждый следующий слой опирается на предыдущий.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Хуки должны стоять выше всех условных возвратов, иначе при входе пользователя порядок вызова изменится и React выбросит ошибку.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Порядок веток: loading → error → guard → empty → список. Каждая — ранний возврат, так одновременно видно ровно одно.',
        penaltyPercent: 35,
      },
    ],
    solution: `const STATUSES = ['Выдана', 'Возвращена', 'Просрочена'];

function App({ load, onExtend }) {
  const [status, setStatus] = React.useState('loading');
  const [loans, setLoans] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [filter, setFilter] = React.useState('');
  const [extended, setExtended] = React.useState({});

  const run = React.useCallback(() => {
    setStatus('loading');

    load()
      .then((rows) => {
        setLoans(rows);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [load]);

  React.useEffect(() => {
    run();
  }, [run]);

  const toRuDate = (iso) => iso.split('-').reverse().join('.');

  const extend = (loan) => {
    onExtend(loan.id);
    setExtended((prev) => ({ ...prev, [loan.id]: true }));
  };

  const header = (
    <header>
      <span id="greeting">{user ? user : 'Гость'}</span>
      <button id="auth" type="button" onClick={() => setUser(user ? null : 'Иванов Илья')}>
        {user ? 'Выйти' : 'Войти'}
      </button>
    </header>
  );

  if (status === 'loading') {
    return (
      <div>
        {header}
        <p id="loading">Загружаем выдачи…</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div>
        {header}
        <div id="error">
          <p>Не удалось загрузить выдачи. Проверьте соединение и попробуйте ещё раз.</p>
          <button id="retry" type="button" onClick={run}>
            Повторить
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        {header}
        <p id="guard">Войдите, чтобы посмотреть свои выдачи</p>
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div>
        {header}
        <p id="empty">Выдач пока нет. Возьмите книгу — она появится здесь.</p>
      </div>
    );
  }

  const visible = loans.filter((loan) => !filter || loan.status === filter);

  return (
    <div>
      {header}

      <label htmlFor="filter">Статус</label>
      <select id="filter" value={filter} onChange={(event) => setFilter(event.target.value)}>
        <option value="">Все</option>
        {STATUSES.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>

      <p id="count">Показано выдач: {visible.length}</p>

      {visible.map((loan) => (
        <article className="loan" key={loan.id}>
          <h3>{loan.book}</h3>
          <p>Вернуть до: {toRuDate(loan.dueOn)}</p>
          <p>{loan.status}</p>

          {extended[loan.id] ? (
            <p>Продлено</p>
          ) : loan.status === 'Выдана' ? (
            <button className="extend" type="button" onClick={() => extend(loan)}>
              Продлить
            </button>
          ) : null}
        </article>
      ))}
    </div>
  );
}`,
    solutionExplanation:
      'Шапка вынесена в переменную и вставляется в каждую ветку: без этого кнопка входа исчезала бы во время загрузки и при ошибке, и пользователь не смог бы ни войти, ни выйти. Все хуки объявлены до первого условного возврата — иначе при входе пользователя порядок их вызова изменится и React остановит приложение. Порядок веток от самого общего к частному: пока грузим, ничего не знаем; при ошибке не знаем ничего полезного; без входа показывать нечего; при пустом ответе объясняем; и только потом данные.',
    maxScore: 38,
    estimatedMinutes: 240,
    timeLimitMs: 14_400_000,
    examRefs: ['m1-login', 'm1-cabinet', 'm2-admin-tools', 'm3-quality'],
    planDays: ['day-24-7'],
    source: 'plan',
  },
];
