import type { Task } from '../types';

/** Месяц 2: практика для дней, у которых её не было. */
export const MONTH_02_DAILY_TASKS: Task[] = [
  {
    id: 'task-js-modules-boundaries',
    title: 'Разделение по модулям: кто за что отвечает',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['js', 'node'],
    topicIds: ['js-modules'],
    monthNo: 2,
    weekNo: 7,
    statement: `Когда кода становится много, его раскладывают по файлам. Смысл не в аккуратности, а в границах: каждый файл отвечает за своё и не знает, как устроены остальные.

В проекте это три файла:

\`\`\`
validators.js   →  export function isValidLogin(...)
storage.js      →  export function save(...)
app.js          →  import { isValidLogin } from './validators.js'
\`\`\`

Песочница исполняет один файл, поэтому здесь те же три модуля собраны тремя объектами. Границы от этого не меняются — а проверка как раз их и смотрит.

**\`validators\`** — только проверки, ничего не хранит:

- \`isValidLogin(login)\` — латиница и цифры, минимум 6 символов;
- \`isValidPassword(password)\` — минимум 8 символов.

**\`storage\`** — только хранение, ничего не проверяет:

- \`save(user)\` — кладёт объект в свой массив и возвращает его номер по порядку (первый — 1);
- \`count()\` — сколько сохранено.

**\`app\`** — связывает их и больше ничего не делает сам:

- \`register(user)\` — спрашивает \`validators\`, и **только если обе проверки прошли**, зовёт \`storage.save\`. Возвращает \`{ ok: true, id }\` или \`{ ok: false, errors: [...] }\`, где в \`errors\` строки \`'login'\` и/или \`'password'\`.

Главное правило: \`app\` не проверяет логин сам. Он спрашивает \`validators\`. Проверка это увидит — она подменит функцию в \`validators\` и посмотрит, изменится ли поведение \`app\`.`,
    requirements: [
      'Объявлены три объекта: validators, storage, app',
      'validators.isValidLogin и validators.isValidPassword работают правильно',
      'storage.save возвращает порядковый номер, storage.count — количество',
      'app.register возвращает { ok: true, id } при верных данных',
      'app.register возвращает { ok: false, errors } при неверных',
      'app.register вызывает validators, а не дублирует проверки',
      'app.register не сохраняет пользователя, если проверки не прошли',
    ],
    starterCode: `const validators = {
  isValidLogin(login) {
    // латиница и цифры, минимум 6 символов
  },
  isValidPassword(password) {
    // минимум 8 символов
  },
};

const storage = {
  items: [],
  save(user) {
    // положить и вернуть порядковый номер
  },
  count() {
    // сколько сохранено
  },
};

const app = {
  register(user) {
    // спросить validators, при успехе — storage.save
  },
};`,
    tests: [
      {
        id: 'valid-login',
        name: 'validators.isValidLogin("ivanov26")',
        type: 'expr',
        expression: 'validators.isValidLogin("ivanov26")',
        expected: true,
      },
      {
        id: 'invalid-login',
        name: 'Короткий логин не проходит',
        type: 'expr',
        expression: 'validators.isValidLogin("ivan")',
        expected: false,
      },
      {
        id: 'cyrillic-login',
        name: 'Кириллица в логине не проходит',
        type: 'expr',
        expression: 'validators.isValidLogin("иванов26")',
        expected: false,
        points: 2,
      },
      {
        id: 'password',
        name: 'validators.isValidPassword',
        type: 'assert',
        code: `const validators = ctx.get('validators');
ctx.assert(validators.isValidPassword('demo2026pass') === true, 'Пароль из 12 символов должен проходить');
ctx.assert(validators.isValidPassword('demo') === false, 'Пароль из 4 символов проходить не должен');`,
        points: 2,
      },
      {
        id: 'storage',
        name: 'storage считает и возвращает номера',
        type: 'assert',
        code: `const storage = ctx.get('storage');
const first = storage.save({ login: 'ivanov26' });
const second = storage.save({ login: 'petrov26' });
ctx.assert(first === 1, 'Первый сохранённый должен получить номер 1, получено: ' + first, 1, first);
ctx.assert(second === 2, 'Второй — номер 2, получено: ' + second, 2, second);
ctx.assert(storage.count() === 2, 'count() должен вернуть 2, получено: ' + storage.count(), 2, storage.count());`,
        points: 3,
      },
      {
        id: 'register-ok',
        name: 'Верные данные регистрируются',
        type: 'assert',
        code: `const app = ctx.get('app');
const result = app.register({ login: 'ivanov26', password: 'demo2026pass' });
ctx.assert(result && result.ok === true, 'При верных данных ok должен быть true');
ctx.assert(typeof result.id === 'number' && result.id > 0, 'В ответе должен быть номер id, получено: ' + result.id);`,
        points: 2,
      },
      {
        id: 'register-errors',
        name: 'Неверные данные возвращают список ошибок',
        type: 'assert',
        code: `const app = ctx.get('app');
const result = app.register({ login: 'ив', password: 'abc' });
ctx.assert(result && result.ok === false, 'При неверных данных ok должен быть false');
ctx.assert(Array.isArray(result.errors), 'errors должен быть массивом');
ctx.assert(result.errors.indexOf('login') !== -1, 'В errors не хватает "login"');
ctx.assert(result.errors.indexOf('password') !== -1, 'В errors не хватает "password"');`,
        points: 3,
      },
      {
        id: 'no-save-on-error',
        name: 'При ошибке ничего не сохраняется',
        type: 'assert',
        code: `const app = ctx.get('app');
const storage = ctx.get('storage');
const before = storage.count();
app.register({ login: 'ив', password: 'abc' });
ctx.assert(
  storage.count() === before,
  'Пользователь с ошибками не должен попадать в хранилище. Было ' + before + ', стало ' + storage.count(),
);`,
        points: 2,
      },
      {
        id: 'delegation',
        name: 'app спрашивает validators, а не проверяет сам',
        type: 'assert',
        code: `const app = ctx.get('app');
const validators = ctx.get('validators');
const original = validators.isValidLogin;
validators.isValidLogin = function () {
  return false;
};
let result;
try {
  result = app.register({ login: 'ivanov26', password: 'demo2026pass' });
} finally {
  validators.isValidLogin = original;
}
ctx.assert(
  result && result.ok === false,
  'Подменили validators.isValidLogin на «всегда false», а app.register всё равно зарегистрировал. Значит app проверяет логин сам — граница между модулями стёрта',
);`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Соберите errors в массив: сначала пустой, потом добавляйте строки по результатам проверок. В конце достаточно посмотреть на его длину.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'В storage.save используйте this.items.push(user) — push возвращает новую длину массива, а это и есть нужный порядковый номер.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'register(user) { const errors = []; if (!validators.isValidLogin(user.login)) errors.push("login"); if (!validators.isValidPassword(user.password)) errors.push("password"); if (errors.length) return { ok: false, errors }; return { ok: true, id: storage.save(user) }; }',
        penaltyPercent: 35,
      },
    ],
    solution: `const validators = {
  isValidLogin(login) {
    return typeof login === 'string' && /^[A-Za-z0-9]{6,}$/.test(login);
  },
  isValidPassword(password) {
    return typeof password === 'string' && password.length >= 8;
  },
};

const storage = {
  items: [],
  save(user) {
    return this.items.push(user);
  },
  count() {
    return this.items.length;
  },
};

const app = {
  register(user) {
    const errors = [];
    if (!validators.isValidLogin(user.login)) errors.push('login');
    if (!validators.isValidPassword(user.password)) errors.push('password');

    if (errors.length > 0) {
      return { ok: false, errors };
    }

    return { ok: true, id: storage.save(user) };
  },
};`,
    solutionExplanation:
      'Проверка на подмену функции — не придирка, а способ измерить то, ради чего код и разбивают на модули. Если app.register продолжает работать после подмены validators.isValidLogin, значит правило «логин — латиница и цифры» записано в двух местах. Однажды его поменяют в одном из них, и приложение начнёт вести себя по-разному в разных экранах. Метод push удобно возвращает новую длину массива — это сразу и порядковый номер добавленного элемента.',
    maxScore: 19,
    estimatedMinutes: 30,
    examRefs: ['m3-quality', 'm1-register'],
    planDays: ['day-07-3'],
    source: 'plan',
  },

  {
    id: 'task-bootstrap-grid-form',
    title: 'Bootstrap: сетка и форма на готовых классах',
    kind: 'output',
    runtime: 'dom',
    difficulty: 2,
    tech: ['bootstrap', 'html'],
    topicIds: ['bootstrap-basics', 'bootstrap-grid'],
    monthNo: 2,
    weekNo: 8,
    statement: `Bootstrap — набор готовых классов: вместо своего CSS вы расставляете имена, а библиотека делает оформление. Задание демоэкзамена прямо разрешает библиотеки стилей в первом модуле, и Bootstrap там самый частый выбор.

Соберите разметку с правильными классами. Своих стилей писать не нужно — только классы.

**Сетка карточек:**

1. обёртка \`.container\`;
2. внутри \`.row\` с расстоянием между колонками — класс \`g-3\`;
3. три колонки: на телефоне во всю ширину (\`col-12\`), от средних экранов по трети (\`col-md-4\`);
4. в каждой колонке блок \`.card\` с \`.card-body\` внутри.

**Форма входа** (в отдельном \`.container\`):

5. подпись с классом \`form-label\`, поле с классом \`form-control\`, у каждого поля \`id\` и связанный с ним \`label for\`;
6. отступ между полями — класс \`mb-3\` на обёртке поля;
7. кнопка с классами \`btn btn-primary\`.

Песочница не подгружает саму библиотеку — проверяется именно знание сетки и имён классов, а не то, как это выглядит.`,
    requirements: [
      'Есть .container и внутри .row с классом g-3',
      'Три колонки с классами col-12 и col-md-4',
      'В каждой колонке .card с .card-body',
      'В форме подписи с form-label и поля с form-control',
      'Каждое поле обёрнуто в блок с mb-3',
      'Кнопка с классами btn и btn-primary',
      'Каждое поле связано с подписью через for и id',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Bootstrap: сетка и форма</title>
</head>
<body>
  <!-- Сетка из трёх карточек -->

  <!-- Форма входа на классах Bootstrap -->
</body>
</html>`,
    viewport: { width: 900, height: 700 },
    tests: [
      {
        id: 'container-row',
        name: 'Обёртка и ряд с промежутками',
        type: 'dom',
        code: `const container = ctx.$('.container');
ctx.assert(container, 'Нет обёртки с классом .container');
const row = ctx.$('.row', container);
ctx.assert(row, 'Внутри .container нет .row');
ctx.assert(row.classList.contains('g-3'), 'У ряда должен быть класс g-3 — он задаёт расстояние между колонками');`,
        points: 2,
      },
      {
        id: 'columns',
        name: 'Три колонки с правильными классами',
        type: 'dom',
        code: `const columns = ctx.$$('.row > div').filter((div) => /(^|\\s)col(-|\\s|$)/.test(div.className));
ctx.assert(columns.length === 3, 'Колонок должно быть три, найдено: ' + columns.length, 3, columns.length);
columns.forEach((column, index) => {
  ctx.assert(
    column.classList.contains('col-12'),
    'У колонки ' + (index + 1) + ' нет класса col-12: на телефоне карточка должна занимать всю ширину',
  );
  ctx.assert(
    column.classList.contains('col-md-4'),
    'У колонки ' + (index + 1) + ' нет класса col-md-4: из 12 долей сетки треть — это 4',
  );
});`,
        points: 3,
      },
      {
        id: 'cards',
        name: 'Карточки собраны по правилам Bootstrap',
        type: 'dom',
        code: `const cards = ctx.$$('.row .card');
ctx.assert(cards.length === 3, 'Карточек должно быть три, найдено: ' + cards.length, 3, cards.length);
cards.forEach((card, index) => {
  ctx.assert(ctx.$('.card-body', card), 'В карточке ' + (index + 1) + ' нет .card-body — без него не будет внутренних отступов');
});`,
        points: 2,
      },
      {
        id: 'form-controls',
        name: 'Поля и подписи с классами формы',
        type: 'dom',
        code: `const inputs = ctx.$$('form input');
ctx.assert(inputs.length >= 2, 'В форме должно быть минимум два поля, найдено: ' + inputs.length);
inputs.forEach((input) => {
  ctx.assert(
    input.classList.contains('form-control'),
    'У поля «' + (input.name || input.type) + '» нет класса form-control',
  );
});
const labels = ctx.$$('form label');
ctx.assert(labels.length >= 2, 'У полей нет подписей');
labels.forEach((label) => {
  ctx.assert(label.classList.contains('form-label'), 'У подписи «' + label.textContent.trim() + '» нет класса form-label');
});`,
        points: 3,
      },
      {
        id: 'spacing',
        name: 'Отступы между полями заданы утилитой',
        type: 'dom',
        code: `const inputs = ctx.$$('form input');
inputs.forEach((input) => {
  const wrapper = input.parentElement;
  ctx.assert(
    wrapper && wrapper.classList.contains('mb-3'),
    'Поле «' + (input.name || input.type) + '» должно лежать в блоке с классом mb-3',
  );
});`,
        points: 2,
      },
      {
        id: 'button',
        name: 'Кнопка оформлена классами Bootstrap',
        type: 'dom',
        code: `const button = ctx.$('form button, form input[type="submit"]');
ctx.assert(button, 'В форме нет кнопки');
ctx.assert(button.classList.contains('btn'), 'У кнопки нет базового класса btn');
ctx.assert(button.classList.contains('btn-primary'), 'У кнопки нет класса btn-primary');`,
        points: 2,
      },
      {
        id: 'labels-linked',
        name: 'Подписи связаны с полями',
        type: 'dom',
        code: `ctx.$$('form input').forEach((input) => {
  ctx.assert(input.id, 'У поля «' + (input.name || input.type) + '» нет id');
  ctx.assert(
    ctx.$('label[for="' + input.id + '"]'),
    'Для поля с id="' + input.id + '" нет подписи. Класс form-label оформляет, но не связывает — связь даёт только for',
  );
});`,
        points: 2,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Сетка Bootstrap делит ряд на 12 долей. Треть ряда — это 4 доли, отсюда col-md-4.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Утилиты отступов читаются по буквам: m — margin, b — bottom, 3 — третий шаг шкалы. mb-3 это нижний внешний отступ.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: '<div class="container"><div class="row g-3"><div class="col-12 col-md-4"><div class="card"><div class="card-body">…</div></div></div>…</div></div>, а в форме — <div class="mb-3"><label class="form-label" for="login">Логин</label><input class="form-control" id="login" name="login"></div>.',
        penaltyPercent: 35,
      },
    ],
    solution: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Bootstrap: сетка и форма</title>
</head>
<body>
  <div class="container">
    <div class="row g-3">
      <div class="col-12 col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Аудитория на 100 мест</h5>
            <p class="card-text">Конференции и лекции</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Коворкинг</h5>
            <p class="card-text">20 рабочих мест</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Кинозал</h5>
            <p class="card-text">Показы и презентации</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <h2>Вход</h2>
    <form>
      <div class="mb-3">
        <label class="form-label" for="login">Логин</label>
        <input class="form-control" type="text" id="login" name="login" required minlength="6">
      </div>
      <div class="mb-3">
        <label class="form-label" for="password">Пароль</label>
        <input class="form-control" type="password" id="password" name="password" required minlength="8">
      </div>
      <button class="btn btn-primary" type="submit">Войти</button>
    </form>
  </div>
</body>
</html>`,
    solutionExplanation:
      'Порядок классов в колонке читается как правило с оговоркой: col-12 действует всегда, col-md-4 перекрывает его от средних экранов и выше. Это тот же mobile first, только записанный именами классов вместо медиазапросов. Классы form-label и form-control дают оформление, но не создают связи между подписью и полем — for и id всё равно нужны, никакая библиотека это за вас не сделает.',
    maxScore: 16,
    estimatedMinutes: 25,
    examRefs: ['m1-oop-styles', 'm2-mobile', 'm1-login'],
    planDays: ['day-08-5'],
    source: 'plan',
  },
];
