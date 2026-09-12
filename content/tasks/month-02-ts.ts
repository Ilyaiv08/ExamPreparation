import type { Task } from '../types';

/** Месяц 2, неделя 8: TypeScript. */
export const MONTH_02_TS_TASKS: Task[] = [
  {
    id: 'task-ts-basics',
    title: 'Первые типы: аннотации и результат функции',
    kind: 'function',
    runtime: 'ts',
    difficulty: 2,
    tech: ['ts'],
    topicIds: ['ts-basics'],
    monthNo: 2,
    weekNo: 8,
    statement: `Перепишите проверки на TypeScript, добавив аннотации типов.

1. \`checkLogin(login: string): boolean\` — латиница и цифры, минимум 6 символов.
2. \`checkPassword(password: string): boolean\` — минимум 8 символов.
3. \`describeLength(value: string): string\` — возвращает \`"Длина: 8"\`.
4. \`toNumberOrNull(value: string): number | null\` — число или \`null\`, если получить число нельзя.

У всех функций должны быть указаны типы параметров **и** типы возвращаемого значения.`,
    requirements: [
      'У всех четырёх функций указаны типы параметров',
      'У всех функций указан тип возвращаемого значения',
      'Тип toNumberOrNull — number | null',
      'В коде нет типа any',
      'Функции работают правильно',
    ],
    starterCode: `function checkLogin(login) {
  // добавьте типы и реализацию
}

function checkPassword(password) {
  // добавьте типы и реализацию
}

function describeLength(value) {
  // добавьте типы и реализацию
}

function toNumberOrNull(value) {
  // добавьте типы и реализацию
}`,
    tests: [
      { id: 't1', name: 'checkLogin("ivanov26")', type: 'call', entry: 'checkLogin', args: ['ivanov26'], expected: true },
      { id: 't2', name: 'Кириллица не проходит', type: 'call', entry: 'checkLogin', args: ['иванов26'], expected: false, points: 2 },
      { id: 't3', name: 'checkPassword("demo2026")', type: 'call', entry: 'checkPassword', args: ['demo2026'], expected: true },
      { id: 't4', name: 'Короткий пароль не проходит', type: 'call', entry: 'checkPassword', args: ['demo'], expected: false },
      { id: 't5', name: 'describeLength', type: 'call', entry: 'describeLength', args: ['ivanov26'], expected: 'Длина: 8' },
      { id: 't6', name: 'toNumberOrNull("42")', type: 'call', entry: 'toNumberOrNull', args: ['42'], expected: 42 },
      { id: 't7', name: 'toNumberOrNull("abc") → null', type: 'call', entry: 'toNumberOrNull', args: ['abc'], expected: null, points: 2 },
      { id: 't8', name: 'toNumberOrNull("") → null', type: 'call', entry: 'toNumberOrNull', args: [''], expected: null },
      {
        id: 't9',
        name: 'Указаны типы параметров',
        type: 'assert',
        code: `const source = ctx.source.replace(/\\s+/g, ' ');
['checkLogin', 'checkPassword', 'describeLength', 'toNumberOrNull'].forEach((name) => {
  const pattern = new RegExp('function\\\\s+' + name + '\\\\s*\\\\(\\\\s*\\\\w+\\\\s*:\\\\s*\\\\w+');
  ctx.assert(pattern.test(source), 'У функции ' + name + ' не указан тип параметра');
});`,
        points: 3,
      },
      {
        id: 't10',
        name: 'Указаны типы возвращаемых значений',
        type: 'assert',
        code: `const source = ctx.source.replace(/\\s+/g, ' ');
ctx.assert(/function\\s+checkLogin\\s*\\([^)]*\\)\\s*:\\s*boolean/.test(source), 'checkLogin должна возвращать boolean');
ctx.assert(/function\\s+checkPassword\\s*\\([^)]*\\)\\s*:\\s*boolean/.test(source), 'checkPassword должна возвращать boolean');
ctx.assert(/function\\s+describeLength\\s*\\([^)]*\\)\\s*:\\s*string/.test(source), 'describeLength должна возвращать string');
ctx.assert(/function\\s+toNumberOrNull\\s*\\([^)]*\\)\\s*:\\s*number\\s*\\|\\s*null/.test(source), 'toNumberOrNull должна возвращать number | null');`,
        points: 4,
      },
      {
        id: 't11',
        name: 'Тип any не используется',
        type: 'assert',
        code: `ctx.assert(!/:\\s*any\\b/.test(ctx.source), 'Тип any отключает проверку типов — на экзамене это минус к качеству кода');`,
        points: 2,
      },
    ],
    hints: [
      { level: 1, text: 'Тип параметра пишется после двоеточия: function f(value: string). Тип результата — после скобок.', penaltyPercent: 10 },
      { level: 2, text: 'Объединение типов записывается через вертикальную черту: number | null.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'function toNumberOrNull(value: string): number | null { if (!value) return null; const n = Number(value); return Number.isNaN(n) ? null : n; }',
        penaltyPercent: 35,
      },
    ],
    solution: `const LOGIN_PATTERN = /^[A-Za-z0-9]{6,}$/;

function checkLogin(login: string): boolean {
  return LOGIN_PATTERN.test(login);
}

function checkPassword(password: string): boolean {
  return password.length >= 8;
}

function describeLength(value: string): string {
  return \`Длина: \${value.length}\`;
}

function toNumberOrNull(value: string): number | null {
  if (!value) return null;
  const result = Number(value);
  return Number.isNaN(result) ? null : result;
}`,
    solutionExplanation:
      'Тип number | null заставляет вызывающий код проверить результат — забыть про случай «число не получилось» уже не выйдет. Это и есть главная польза TypeScript на экзамене: ошибка видна в редакторе, а не после клика.',
    maxScore: 19,
    estimatedMinutes: 25,
    examRefs: ['m3-quality'],
    planDays: ['day-08-1'],
    source: 'plan',
  },

  {
    id: 'task-ts-types',
    title: 'Типы проекта: Status, Application и справочники',
    kind: 'function',
    runtime: 'ts',
    difficulty: 3,
    tech: ['ts'],
    topicIds: ['ts-types'],
    monthNo: 2,
    weekNo: 8,
    statement: `Опишите типы данных проекта «Конференции.РФ» — задание дня 2 недели 8.

Нужно объявить:

- тип \`Status\` — **литеральный** тип с тремя значениями из задания экзамена;
- интерфейс \`Room\` с полями \`id: number\` и \`title: string\`;
- интерфейс \`Application\` с полями \`id\`, \`roomId\`, \`paymentId\` (числа), \`date: string\`, \`status: Status\` и необязательным \`reviewText?: string\`;
- константу \`STATUSES: Status[]\` со всеми тремя статусами по порядку;
- функцию \`canLeaveReview(status: Status): boolean\` — отзыв доступен, если статус не «Новая»;
- функцию \`nextStatuses(status: Status): Status[]\` — какие статусы админ может поставить: для «Новая» это два оставшихся, для остальных — пустой массив.`,
    requirements: [
      'Status объявлен как литеральный тип, а не string',
      'STATUSES содержит три статуса в правильном порядке',
      'Интерфейсы Room и Application объявлены',
      'canLeaveReview работает по правилу модуля 2',
      'nextStatuses возвращает допустимые переходы',
    ],
    starterCode: `// объявите типы здесь


const STATUSES = [];

function canLeaveReview(status) {
  // ваш код
}

function nextStatuses(status) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'STATUSES содержит три статуса по порядку',
        type: 'expr',
        expression: 'STATUSES',
        expected: ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'],
        points: 3,
      },
      {
        id: 't2',
        name: 'Status объявлен литеральным типом',
        type: 'assert',
        code: `const source = ctx.source.replace(/\\s+/g, ' ');
ctx.assert(/type\\s+Status\\s*=/.test(source), 'Объявите тип Status через type');
ctx.assert(/'Новая'|"Новая"/.test(source) && /'Мероприятие назначено'|"Мероприятие назначено"/.test(source), 'Тип Status должен перечислять конкретные значения статусов');
ctx.assert(!/type\\s+Status\\s*=\\s*string/.test(source), 'Status не должен быть просто string: тогда опечатка пройдёт незамеченной');`,
        points: 4,
      },
      {
        id: 't3',
        name: 'Интерфейсы Room и Application объявлены',
        type: 'assert',
        code: `const source = ctx.source.replace(/\\s+/g, ' ');
ctx.assert(/(interface|type)\\s+Room\\b/.test(source), 'Не объявлен тип Room');
ctx.assert(/(interface|type)\\s+Application\\b/.test(source), 'Не объявлен тип Application');
ctx.assert(/status\\s*:\\s*Status/.test(source), 'В Application поле status должно иметь тип Status, а не string');
ctx.assert(/reviewText\\s*\\?\\s*:/.test(source), 'Поле reviewText должно быть необязательным: reviewText?: string');`,
        points: 4,
      },
      { id: 't4', name: 'Отзыв нельзя у «Новая»', type: 'call', entry: 'canLeaveReview', args: ['Новая'], expected: false, points: 2 },
      { id: 't5', name: 'Отзыв можно у «Мероприятие назначено»', type: 'call', entry: 'canLeaveReview', args: ['Мероприятие назначено'], expected: true, points: 2 },
      { id: 't6', name: 'Отзыв можно у «Мероприятие завершено»', type: 'call', entry: 'canLeaveReview', args: ['Мероприятие завершено'], expected: true },
      {
        id: 't7',
        name: 'Переходы из «Новая»',
        type: 'call',
        entry: 'nextStatuses',
        args: ['Новая'],
        expected: ['Мероприятие назначено', 'Мероприятие завершено'],
        points: 3,
      },
      { id: 't8', name: 'Из завершённого переходов нет', type: 'call', entry: 'nextStatuses', args: ['Мероприятие завершено'], expected: [], points: 2 },
      { id: 't9', name: 'Из назначенного переходов нет', type: 'call', entry: 'nextStatuses', args: ['Мероприятие назначено'], expected: [], hidden: true },
      {
        id: 't10',
        name: 'Тип any не используется',
        type: 'assert',
        code: `ctx.assert(!/:\\s*any\\b/.test(ctx.source), 'Тип any в этом задании не нужен');`,
        points: 2,
      },
    ],
    hints: [
      { level: 1, text: "Литеральный тип: type Status = 'Новая' | 'Мероприятие назначено' | 'Мероприятие завершено';", penaltyPercent: 10 },
      { level: 2, text: 'Массив статусов типизируется так: const STATUSES: Status[] = [...]. Порядок важен — он совпадает с порядком в задании.', penaltyPercent: 20 },
      {
        level: 3,
        text: "nextStatuses: если статус «Новая», вернуть ['Мероприятие назначено', 'Мероприятие завершено']; иначе вернуть [].",
        penaltyPercent: 35,
      },
    ],
    solution: `type Status = 'Новая' | 'Мероприятие назначено' | 'Мероприятие завершено';

interface Room {
  id: number;
  title: string;
}

interface Application {
  id: number;
  roomId: number;
  paymentId: number;
  date: string;          // ГГГГ-ММ-ДД
  status: Status;
  reviewText?: string;
}

const STATUSES: Status[] = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'];

function canLeaveReview(status: Status): boolean {
  return status !== 'Новая';
}

function nextStatuses(status: Status): Status[] {
  if (status === 'Новая') return ['Мероприятие назначено', 'Мероприятие завершено'];
  return [];
}`,
    solutionExplanation:
      'Литеральный тип Status — страховка от главной ошибки экзамена: неточной формулировки статуса. Редактор подскажет три допустимых значения и не даст написать четвёртое. Функция nextStatuses пригодится и на сервере: список допустимых переходов надо проверять там же.',
    maxScore: 24,
    estimatedMinutes: 30,
    examRefs: ['m1-admin', 'm2-cabinet-ux', 'm3-quality'],
    planDays: ['day-08-2'],
    source: 'plan',
  },

  {
    id: 'task-ts-functions',
    title: 'Типизированные функции и Promise',
    kind: 'function',
    runtime: 'ts',
    difficulty: 3,
    tech: ['ts'],
    topicIds: ['ts-functions'],
    monthNo: 2,
    weekNo: 8,
    statement: `Типизируйте функции работы с данными.

1. \`getPage<T>(items: T[], page?: number, perPage?: number): T[]\` — срез страницы. По умолчанию страница 1, размер 5.
2. \`fromRuDate(value: string): string | null\` — из \`"14.09.2026"\` в \`"2026-09-14"\`, иначе \`null\`.
3. \`loadJson<T>(loader: () => Promise<T>, fallback: T): Promise<T>\` — возвращает результат загрузки, а при ошибке — \`fallback\`.
4. \`isFilled(value: string | null | undefined): boolean\` — строка не пуста после обрезки пробелов.

У асинхронной функции обязателен тип \`Promise<T>\`.`,
    requirements: [
      'getPage объявлена обобщённой и возвращает T[]',
      'fromRuDate возвращает string | null',
      'loadJson возвращает Promise<T> и не выбрасывает ошибку',
      'isFilled правильно обрабатывает null, undefined и пробелы',
      'В коде нет any',
    ],
    starterCode: `function getPage(items, page = 1, perPage = 5) {
  // добавьте типы и реализацию
}

function fromRuDate(value) {
  // добавьте типы и реализацию
}

async function loadJson(loader, fallback) {
  // добавьте типы и реализацию
}

function isFilled(value) {
  // добавьте типы и реализацию
}`,
    tests: [
      { id: 't1', name: 'Первая страница', type: 'expr', expression: 'getPage([1,2,3,4,5,6,7], 1, 3)', expected: [1, 2, 3], points: 2 },
      { id: 't2', name: 'Вторая страница', type: 'expr', expression: 'getPage([1,2,3,4,5,6,7], 2, 3)', expected: [4, 5, 6], points: 2 },
      { id: 't3', name: 'Значения по умолчанию', type: 'expr', expression: 'getPage([1,2,3,4,5,6,7]).length', expected: 5 },
      { id: 't4', name: 'fromRuDate работает', type: 'call', entry: 'fromRuDate', args: ['14.09.2026'], expected: '2026-09-14', points: 2 },
      { id: 't5', name: 'fromRuDate отсекает мусор', type: 'call', entry: 'fromRuDate', args: ['14-09-2026'], expected: null, points: 2 },
      {
        id: 't6',
        name: 'loadJson возвращает данные',
        type: 'assert',
        code: `const loadJson = ctx.solution.get('loadJson');
return loadJson(async () => [1, 2], []).then((value) => {
  ctx.assert(JSON.stringify(value) === '[1,2]', 'При успешной загрузке должны вернуться данные');
});`,
        points: 3,
      },
      {
        id: 't7',
        name: 'loadJson гасит ошибку',
        type: 'assert',
        code: `const loadJson = ctx.solution.get('loadJson');
return loadJson(async () => { throw new Error('сбой'); }, 'запасное').then((value) => {
  ctx.assert(value === 'запасное', 'При ошибке должно вернуться запасное значение, получено ' + ctx.preview(value));
});`,
        points: 3,
      },
      { id: 't8', name: 'isFilled("текст")', type: 'call', entry: 'isFilled', args: ['текст'], expected: true },
      { id: 't9', name: 'isFilled("   ") → false', type: 'call', entry: 'isFilled', args: ['   '], expected: false, points: 2 },
      { id: 't10', name: 'isFilled(null) → false', type: 'call', entry: 'isFilled', args: [null], expected: false },
      { id: 't11', name: 'isFilled(undefined) → false', type: 'call', entry: 'isFilled', args: [undefined], expected: false },
      {
        id: 't12',
        name: 'Типы расставлены',
        type: 'assert',
        code: `const source = ctx.source.replace(/\\s+/g, ' ');
ctx.assert(/function\\s+getPage\\s*<\\s*T\\s*>/.test(source), 'getPage должна быть обобщённой: function getPage<T>(…)');
ctx.assert(/items\\s*:\\s*T\\[\\]/.test(source), 'Параметр items должен иметь тип T[]');
ctx.assert(/function\\s+fromRuDate\\s*\\([^)]*\\)\\s*:\\s*string\\s*\\|\\s*null/.test(source), 'fromRuDate должна возвращать string | null');
ctx.assert(/Promise\\s*<\\s*T\\s*>/.test(source), 'У loadJson должен быть указан тип Promise<T>');
ctx.assert(/value\\s*:\\s*string\\s*\\|\\s*null\\s*\\|\\s*undefined/.test(source), 'У isFilled параметр должен иметь тип string | null | undefined');`,
        points: 5,
      },
      {
        id: 't13',
        name: 'any не используется',
        type: 'assert',
        code: `ctx.assert(!/:\\s*any\\b/.test(ctx.source), 'В этом задании any не нужен: используйте обобщённые типы');`,
        points: 2,
      },
    ],
    hints: [
      { level: 1, text: 'Обобщённая функция: function getPage<T>(items: T[], …): T[] — буква T подставится при вызове.', penaltyPercent: 10 },
      { level: 2, text: 'Асинхронная функция всегда возвращает Promise, поэтому тип пишется как Promise<T>.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'async function loadJson<T>(loader: () => Promise<T>, fallback: T): Promise<T> { try { return await loader(); } catch { return fallback; } }',
        penaltyPercent: 35,
      },
    ],
    solution: `const RU_DATE = /^(\\d{2})\\.(\\d{2})\\.(\\d{4})$/;

function getPage<T>(items: T[], page = 1, perPage = 5): T[] {
  return items.slice((page - 1) * perPage, page * perPage);
}

function fromRuDate(value: string): string | null {
  const match = RU_DATE.exec(String(value).trim());
  if (!match) return null;
  const [, day, month, year] = match;
  return \`\${year}-\${month}-\${day}\`;
}

async function loadJson<T>(loader: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await loader();
  } catch {
    return fallback;
  }
}

function isFilled(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}`,
    solutionExplanation:
      'Обобщённый тип T позволяет одной функции getPage работать и со списком заявок, и со списком отзывов, при этом сохраняя точный тип результата. loadJson — готовый приём для состояния «ошибка» на странице: интерфейс получает пустой список вместо падения.',
    maxScore: 27,
    estimatedMinutes: 30,
    examRefs: ['m3-quality'],
    planDays: ['day-08-3'],
    source: 'plan',
  },

  {
    id: 'task-ts-oop',
    title: 'ООП: класс сервиса заявок',
    kind: 'function',
    runtime: 'ts',
    difficulty: 4,
    tech: ['ts'],
    topicIds: ['ts-oop'],
    monthNo: 2,
    weekNo: 8,
    statement: `Задание модуля 1 требует технологии объектно-ориентированного программирования. Напишите класс \`ApplicationService\`, который управляет списком заявок.

Требования:

- конструктор принимает начальный массив заявок и сохраняет его в **приватном** поле;
- \`getAll(): Application[]\` — все заявки;
- \`getByStatus(status: Status): Application[]\` — заявки с нужным статусом;
- \`create(data: { roomId: number; date: string; paymentId: number }): Application\` — добавляет заявку со статусом «Новая» и новым id (максимальный + 1, для пустого списка — 1), возвращает созданную заявку;
- \`changeStatus(id: number, status: Status): boolean\` — меняет статус; возвращает \`false\`, если заявки нет **или** переход недопустим (менять можно только заявку со статусом «Новая»);
- \`canLeaveReview(id: number): boolean\` — отзыв доступен, если заявка существует и её статус не «Новая».`,
    requirements: [
      'Массив заявок хранится в приватном поле',
      'create присваивает статус «Новая» и новый id',
      'changeStatus не меняет статус у уже изменённых заявок',
      'changeStatus возвращает false для несуществующего id',
      'canLeaveReview следует правилу модуля 2',
    ],
    starterCode: `type Status = 'Новая' | 'Мероприятие назначено' | 'Мероприятие завершено';

interface Application {
  id: number;
  roomId: number;
  paymentId: number;
  date: string;
  status: Status;
}

class ApplicationService {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'getAll возвращает исходные заявки',
        type: 'assert',
        code: `const Service = ctx.solution.get('ApplicationService');
const service = new Service([{ id: 1, roomId: 1, paymentId: 1, date: '2026-09-14', status: 'Новая' }]);
ctx.assert(service.getAll().length === 1, 'getAll должен вернуть одну заявку');`,
        points: 2,
      },
      {
        id: 't2',
        name: 'Поле с заявками приватное',
        type: 'assert',
        code: `const source = ctx.source.replace(/\\s+/g, ' ');
ctx.assert(/private\\s+/.test(source), 'Массив заявок должен храниться в приватном поле (модификатор private)');`,
        points: 3,
      },
      {
        id: 't3',
        name: 'create добавляет заявку со статусом «Новая»',
        type: 'assert',
        code: `const Service = ctx.solution.get('ApplicationService');
const service = new Service([]);
const created = service.create({ roomId: 2, date: '2026-10-01', paymentId: 1 });
ctx.assert(created.status === 'Новая', 'Новая заявка должна получать статус «Новая»', 'Новая', created.status);
ctx.assert(created.id === 1, 'Первая заявка должна получить id = 1, получено ' + created.id);
ctx.assert(service.getAll().length === 1, 'Заявка должна попасть в список');`,
        points: 4,
      },
      {
        id: 't4',
        name: 'id считается как максимальный + 1',
        type: 'assert',
        code: `const Service = ctx.solution.get('ApplicationService');
const service = new Service([
  { id: 3, roomId: 1, paymentId: 1, date: '2026-09-14', status: 'Новая' },
  { id: 7, roomId: 1, paymentId: 1, date: '2026-09-15', status: 'Новая' },
]);
const created = service.create({ roomId: 1, date: '2026-09-16', paymentId: 2 });
ctx.assert(created.id === 8, 'Ожидался id 8 (максимальный 7 + 1), получено ' + created.id, 8, created.id);`,
        points: 3,
      },
      {
        id: 't5',
        name: 'Фильтр по статусу',
        type: 'assert',
        code: `const Service = ctx.solution.get('ApplicationService');
const service = new Service([
  { id: 1, roomId: 1, paymentId: 1, date: '2026-09-14', status: 'Новая' },
  { id: 2, roomId: 1, paymentId: 1, date: '2026-09-15', status: 'Мероприятие завершено' },
]);
ctx.assert(service.getByStatus('Новая').length === 1, 'Ожидалась одна заявка со статусом «Новая»');`,
        points: 2,
      },
      {
        id: 't6',
        name: 'changeStatus меняет статус новой заявки',
        type: 'assert',
        code: `const Service = ctx.solution.get('ApplicationService');
const service = new Service([{ id: 1, roomId: 1, paymentId: 1, date: '2026-09-14', status: 'Новая' }]);
const ok = service.changeStatus(1, 'Мероприятие назначено');
ctx.assert(ok === true, 'changeStatus должен вернуть true при успехе');
ctx.assert(service.getAll()[0].status === 'Мероприятие назначено', 'Статус должен измениться');`,
        points: 4,
      },
      {
        id: 't7',
        name: 'Повторная смена статуса запрещена',
        type: 'assert',
        code: `const Service = ctx.solution.get('ApplicationService');
const service = new Service([{ id: 1, roomId: 1, paymentId: 1, date: '2026-09-14', status: 'Мероприятие завершено' }]);
const ok = service.changeStatus(1, 'Мероприятие назначено');
ctx.assert(ok === false, 'Менять можно только заявку со статусом «Новая»');
ctx.assert(service.getAll()[0].status === 'Мероприятие завершено', 'Статус не должен был измениться');`,
        points: 4,
      },
      {
        id: 't8',
        name: 'Несуществующий id даёт false',
        type: 'assert',
        code: `const Service = ctx.solution.get('ApplicationService');
const service = new Service([]);
ctx.assert(service.changeStatus(99, 'Мероприятие назначено') === false, 'Для несуществующей заявки нужно вернуть false');`,
        points: 2,
      },
      {
        id: 't9',
        name: 'canLeaveReview по правилу модуля 2',
        type: 'assert',
        code: `const Service = ctx.solution.get('ApplicationService');
const service = new Service([
  { id: 1, roomId: 1, paymentId: 1, date: '2026-09-14', status: 'Новая' },
  { id: 2, roomId: 1, paymentId: 1, date: '2026-09-15', status: 'Мероприятие назначено' },
]);
ctx.assert(service.canLeaveReview(1) === false, 'У заявки со статусом «Новая» отзыв недоступен');
ctx.assert(service.canLeaveReview(2) === true, 'После смены статуса отзыв доступен');
ctx.assert(service.canLeaveReview(99) === false, 'Для несуществующей заявки — false');`,
        points: 4,
      },
    ],
    hints: [
      { level: 1, text: 'Приватное поле объявляется так: private items: Application[]; или сразу в конструкторе: constructor(private items: Application[] = []) {}', penaltyPercent: 10 },
      { level: 2, text: 'Новый id: this.items.length ? Math.max(...this.items.map((a) => a.id)) + 1 : 1', penaltyPercent: 20 },
      {
        level: 3,
        text: "changeStatus: найдите заявку через find; если её нет или status !== 'Новая' — верните false; иначе присвойте новый статус и верните true.",
        penaltyPercent: 35,
      },
    ],
    solution: `type Status = 'Новая' | 'Мероприятие назначено' | 'Мероприятие завершено';

interface Application {
  id: number;
  roomId: number;
  paymentId: number;
  date: string;
  status: Status;
}

class ApplicationService {
  constructor(private items: Application[] = []) {}

  getAll(): Application[] {
    return [...this.items];
  }

  getByStatus(status: Status): Application[] {
    return this.items.filter((item) => item.status === status);
  }

  create(data: { roomId: number; date: string; paymentId: number }): Application {
    const nextId = this.items.length ? Math.max(...this.items.map((item) => item.id)) + 1 : 1;
    const application: Application = { id: nextId, ...data, status: 'Новая' };
    this.items.push(application);
    return application;
  }

  changeStatus(id: number, status: Status): boolean {
    const application = this.items.find((item) => item.id === id);
    if (!application) return false;
    // Менять статус можно только у новой заявки: обратного пути задание не предусматривает.
    if (application.status !== 'Новая') return false;
    application.status = status;
    return true;
  }

  canLeaveReview(id: number): boolean {
    const application = this.items.find((item) => item.id === id);
    return Boolean(application) && application!.status !== 'Новая';
  }
}`,
    solutionExplanation:
      'Класс собирает в одном месте все правила работы с заявками: начальный статус, допустимые переходы и условие отзыва. На сервере такой же класс будет работать с базой — маршруты Express станут тонкими, а требование ООП окажется выполнено по делу, а не для галочки.',
    maxScore: 28,
    estimatedMinutes: 45,
    examRefs: ['m1-oop-styles', 'm1-admin', 'm2-cabinet-ux'],
    planDays: ['day-08-4'],
    source: 'plan',
  },
];
