import type { Task } from '../types';

/** Месяц 2: задания на DOM, события, валидацию формы и слайдер. */
export const MONTH_02_DOM_TASKS: Task[] = [
  {
    id: 'task-js-dom-toggle',
    title: 'Показать и скрыть блок фильтров',
    kind: 'function',
    runtime: 'dom',
    difficulty: 1,
    tech: ['js', 'html'],
    topicIds: ['js-dom'],
    monthNo: 2,
    weekNo: 6,
    statement: `Кнопка должна показывать и прятать блок фильтров, а её текст — меняться.

Требования:

- изначально блок скрыт классом \`hidden\`, текст кнопки — «Показать фильтры»;
- после клика блок виден, текст — «Скрыть фильтры»;
- после второго клика всё возвращается;
- состояние отражается в атрибуте \`aria-expanded\` кнопки (\`"true"\` / \`"false"\`).

Разметка и стили уже есть — допишите скрипт.`,
    requirements: [
      'Клик показывает блок (убирает класс hidden)',
      'Повторный клик снова скрывает',
      'Текст кнопки меняется',
      'aria-expanded отражает состояние',
    ],
    starterCode: `<button id="toggle" type="button" aria-expanded="false" aria-controls="filters">Показать фильтры</button>
<div id="filters" class="hidden">
  <label>Статус <select><option>Все</option></select></label>
</div>

<style>
  .hidden { display: none; }
  body { font-family: system-ui, sans-serif; padding: 16px; }
</style>

<script>
  // ваш код
</script>`,
    viewport: { width: 700, height: 400 },
    tests: [
      {
        id: 't1',
        name: 'Изначально блок скрыт',
        type: 'dom',
        code: `const filters = ctx.$('#filters');
ctx.assert(ctx.css(filters, 'display') === 'none', 'Блок должен быть скрыт до клика');`,
      },
      {
        id: 't2',
        name: 'После клика блок виден',
        type: 'dom',
        code: `ctx.click('#toggle');
const filters = ctx.$('#filters');
ctx.assert(ctx.css(filters, 'display') !== 'none', 'После клика блок должен стать видимым');`,
        points: 3,
      },
      {
        id: 't3',
        name: 'Текст кнопки меняется',
        type: 'dom',
        // Документ у всех проверок задания один, поэтому сначала приводим
        // панель к закрытому состоянию, а потом открываем.
        code: `const filters = ctx.$('#filters');
if (ctx.css(filters, 'display') !== 'none') ctx.click('#toggle');
ctx.click('#toggle');
const text = ctx.$('#toggle').textContent.trim();
ctx.assert(text === 'Скрыть фильтры', 'После открытия текст должен быть «Скрыть фильтры»', 'Скрыть фильтры', text);`,
        points: 2,
      },
      {
        id: 't4',
        name: 'Повторный клик скрывает обратно',
        type: 'dom',
        code: `const filters = ctx.$('#filters');
if (ctx.css(filters, 'display') !== 'none') ctx.click('#toggle');
ctx.click('#toggle');
ctx.click('#toggle');
ctx.assert(ctx.css(filters, 'display') === 'none', 'Второй клик должен снова скрыть блок');
ctx.assert(ctx.$('#toggle').textContent.trim() === 'Показать фильтры', 'Текст кнопки должен вернуться');`,
        points: 3,
      },
      {
        id: 't5',
        name: 'aria-expanded отражает состояние',
        type: 'dom',
        code: `const button = ctx.$('#toggle');
const filters = ctx.$('#filters');
if (ctx.css(filters, 'display') !== 'none') ctx.click(button);
ctx.assert(button.getAttribute('aria-expanded') === 'false', 'Пока панель скрыта, aria-expanded должен быть "false"');
ctx.click(button);
ctx.assert(button.getAttribute('aria-expanded') === 'true', 'После открытия aria-expanded должен стать "true"');`,
        points: 2,
      },
    ],
    hints: [
      { level: 1, text: 'classList.toggle возвращает true, если класс был добавлен, и false, если убран.', penaltyPercent: 10 },
      { level: 2, text: 'Сохраните результат toggle в переменную — по ней удобно решить, какой текст поставить.', penaltyPercent: 20 },
      {
        level: 3,
        text: "const hidden = filters.classList.toggle('hidden'); button.textContent = hidden ? 'Показать фильтры' : 'Скрыть фильтры'; button.setAttribute('aria-expanded', String(!hidden));",
        penaltyPercent: 35,
      },
    ],
    solution: `<button id="toggle" type="button" aria-expanded="false" aria-controls="filters">Показать фильтры</button>
<div id="filters" class="hidden">
  <label>Статус <select><option>Все</option></select></label>
</div>

<style>
  .hidden { display: none; }
  body { font-family: system-ui, sans-serif; padding: 16px; }
</style>

<script>
  const button = document.querySelector('#toggle');
  const filters = document.querySelector('#filters');

  button.addEventListener('click', () => {
    const hidden = filters.classList.toggle('hidden');
    button.textContent = hidden ? 'Показать фильтры' : 'Скрыть фильтры';
    button.setAttribute('aria-expanded', String(!hidden));
  });
</script>`,
    solutionExplanation:
      'Состояние хранится в классе, а не в отдельной переменной — значит, оно всегда совпадает с тем, что видит пользователь. Атрибут aria-expanded сообщает то же самое программам чтения с экрана.',
    maxScore: 11,
    estimatedMinutes: 15,
    examRefs: ['m2-mobile'],
    planDays: ['day-06-1'],
    source: 'plan',
  },

  {
    id: 'task-js-form-submit',
    title: 'Отправка формы без перезагрузки страницы',
    kind: 'complete',
    runtime: 'dom',
    difficulty: 2,
    tech: ['js', 'html'],
    topicIds: ['js-events'],
    monthNo: 2,
    weekNo: 6,
    statement: `Форма заявки должна обрабатываться скриптом, а не перезагружать страницу.

При отправке:

1. отменить поведение по умолчанию;
2. собрать значения полей в объект (используйте \`FormData\`);
3. положить объект в глобальную переменную \`lastSubmit\`;
4. показать блок \`#result\` с текстом вида \`Коворкинг · 14.09.2026 · Банковская карта\`;
5. если помещение не выбрано — вместо этого показать в \`#error\` текст «Выберите помещение» и **не** заполнять \`lastSubmit\`.`,
    requirements: [
      'Страница не перезагружается при отправке',
      'Значения полей собираются в объект',
      'lastSubmit содержит room, date и payment',
      'Блок результата показывает выбранные значения',
      'Без выбранного помещения показывается ошибка',
    ],
    starterCode: `<form id="order">
  <label for="room">Помещение</label>
  <select id="room" name="room">
    <option value="">— выберите —</option>
    <option value="Аудитория">Аудитория</option>
    <option value="Коворкинг">Коворкинг</option>
    <option value="Кинозал">Кинозал</option>
  </select>

  <label for="date">Дата</label>
  <input id="date" name="date" type="text" value="14.09.2026">

  <label for="payment">Способ оплаты</label>
  <select id="payment" name="payment">
    <option value="Наличные">Наличные</option>
    <option value="Банковская карта" selected>Банковская карта</option>
  </select>

  <button type="submit">Отправить заявку</button>
</form>

<p id="error"></p>
<p id="result"></p>

<script>
  var lastSubmit = null;
  // ваш код
</script>`,
    viewport: { width: 700, height: 500 },
    tests: [
      {
        id: 't1',
        name: 'Обработчик submit установлен',
        type: 'dom',
        code: `ctx.assert(/addEventListener\\(\\s*['"]submit['"]/.test(ctx.source), 'Нужен обработчик события submit на форме');`,
      },
      {
        id: 't2',
        name: 'Отмена поведения по умолчанию',
        type: 'dom',
        code: `ctx.assert(/preventDefault\\s*\\(/.test(ctx.source), 'Без event.preventDefault() страница перезагрузится и данные потеряются');`,
        points: 2,
      },
      {
        id: 't3',
        name: 'Данные собираются в lastSubmit',
        type: 'dom',
        code: `const form = ctx.$('#order');
ctx.$('#room').value = 'Коворкинг';
form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
const data = ctx.window.lastSubmit;
ctx.assert(data, 'Переменная lastSubmit должна заполниться после отправки');
ctx.assert(data.room === 'Коворкинг', 'В lastSubmit.room должно быть выбранное помещение', 'Коворкинг', data.room);
ctx.assert(data.date === '14.09.2026', 'В lastSubmit.date должна быть дата из поля');
ctx.assert(data.payment === 'Банковская карта', 'В lastSubmit.payment должен быть способ оплаты');`,
        points: 4,
      },
      {
        id: 't4',
        name: 'Результат показан пользователю',
        type: 'dom',
        code: `const form = ctx.$('#order');
ctx.$('#room').value = 'Кинозал';
form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
const text = ctx.$('#result').textContent;
ctx.assert(text.includes('Кинозал'), 'В блоке результата должно быть название помещения');
ctx.assert(text.includes('14.09.2026'), 'В блоке результата должна быть дата');
ctx.assert(text.includes('Банковская карта'), 'В блоке результата должен быть способ оплаты');`,
        points: 3,
      },
      {
        id: 't5',
        name: 'Без помещения — ошибка',
        type: 'dom',
        code: `const form = ctx.$('#order');
ctx.window.lastSubmit = null;
ctx.$('#room').value = '';
form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
const error = ctx.$('#error').textContent.trim();
ctx.assert(error === 'Выберите помещение', 'Ожидался текст «Выберите помещение», получено ' + ctx.preview(error));
ctx.assert(!ctx.window.lastSubmit, 'При ошибке данные отправлять не нужно');`,
        points: 4,
      },
      {
        id: 't6',
        name: 'После исправления ошибка исчезает',
        type: 'dom',
        code: `const form = ctx.$('#order');
ctx.$('#room').value = '';
form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
ctx.$('#room').value = 'Аудитория';
form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
ctx.assert(ctx.$('#error').textContent.trim() === '', 'После успешной отправки текст ошибки нужно очистить');`,
        points: 2,
      },
    ],
    hints: [
      { level: 1, text: 'Object.fromEntries(new FormData(form)) сразу даёт объект со значениями всех полей с атрибутом name.', penaltyPercent: 10 },
      { level: 2, text: 'Проверяйте помещение до заполнения lastSubmit и не забудьте очищать текст ошибки при успехе.', penaltyPercent: 20 },
      {
        level: 3,
        text: "form.addEventListener('submit', (event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(form)); if (!values.room) { error.textContent = 'Выберите помещение'; return; } error.textContent = ''; lastSubmit = values; result.textContent = [values.room, values.date, values.payment].join(' · '); });",
        penaltyPercent: 35,
      },
    ],
    solution: `<form id="order">
  <label for="room">Помещение</label>
  <select id="room" name="room">
    <option value="">— выберите —</option>
    <option value="Аудитория">Аудитория</option>
    <option value="Коворкинг">Коворкинг</option>
    <option value="Кинозал">Кинозал</option>
  </select>

  <label for="date">Дата</label>
  <input id="date" name="date" type="text" value="14.09.2026">

  <label for="payment">Способ оплаты</label>
  <select id="payment" name="payment">
    <option value="Наличные">Наличные</option>
    <option value="Банковская карта" selected>Банковская карта</option>
  </select>

  <button type="submit">Отправить заявку</button>
</form>

<p id="error"></p>
<p id="result"></p>

<script>
  var lastSubmit = null;

  const form = document.querySelector('#order');
  const error = document.querySelector('#error');
  const result = document.querySelector('#result');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const values = Object.fromEntries(new FormData(form));

    if (!values.room) {
      error.textContent = 'Выберите помещение';
      result.textContent = '';
      return;
    }

    error.textContent = '';
    lastSubmit = values;
    result.textContent = [values.room, values.date, values.payment].join(' · ');
  });
</script>`,
    solutionExplanation:
      'FormData собирает все поля с атрибутом name — при добавлении нового поля код менять не придётся. Очистка текста ошибки при успехе так же важна, как её показ: иначе старое сообщение останется на экране.',
    maxScore: 16,
    estimatedMinutes: 25,
    examRefs: ['m1-order', 'm2-order-form'],
    planDays: ['day-06-2'],
    source: 'plan',
  },

  {
    id: 'task-js-render-list',
    title: 'Отрисовка списка заявок с пустым состоянием',
    kind: 'output',
    runtime: 'dom',
    difficulty: 2,
    tech: ['js', 'html'],
    topicIds: ['js-render'],
    monthNo: 2,
    weekNo: 6,
    statement: `Напишите функцию \`render(items)\`, которая выводит заявки в контейнер \`#list\`.

Для каждой заявки — элемент \`<article class="card">\` с:

- \`<h3>\` — название помещения;
- \`<p>\` — дата и способ оплаты через « · »;
- \`<span class="badge">\` — статус.

Если массив пуст, показать один абзац \`<p class="empty">У вас пока нет заявок</p>\`.

Повторный вызов \`render\` не должен задваивать карточки.

**Важно:** текст приходит от пользователей, поэтому вставлять его нужно безопасно — без \`innerHTML\`.`,
    requirements: [
      'render выводит карточку для каждой заявки',
      'Внутри карточки h3, p и span.badge',
      'Пустой массив даёт блок .empty',
      'Повторный вызов не задваивает список',
      'Текст вставляется через textContent',
    ],
    starterCode: `<div id="list"></div>

<style>
  body { font-family: system-ui, sans-serif; padding: 16px; }
  .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; margin-bottom: 8px; }
  .badge { background: #dbeafe; color: #1e40af; border-radius: 999px; padding: 2px 10px; font-size: 12px; }
  .empty { color: #6b7280; }
</style>

<script>
  const applications = [
    { id: 1, room: 'Коворкинг', date: '14.09.2026', payment: 'Банковская карта', status: 'Новая' },
    { id: 2, room: 'Кинозал', date: '21.09.2026', payment: 'Наличные', status: 'Мероприятие завершено' },
  ];

  function render(items) {
    // ваш код
  }

  render(applications);
</script>`,
    viewport: { width: 700, height: 600 },
    tests: [
      {
        id: 't1',
        name: 'Отрисованы две карточки',
        type: 'dom',
        code: `const cards = ctx.$$('#list .card');
ctx.assert(cards.length === 2, 'Ожидалось две карточки, найдено ' + cards.length, 2, cards.length);`,
        points: 2,
      },
      {
        id: 't2',
        name: 'Внутри карточки нужные элементы',
        type: 'dom',
        code: `const card = ctx.$('#list .card');
ctx.assert(card.querySelector('h3'), 'В карточке нет заголовка h3');
ctx.assert(card.querySelector('p'), 'В карточке нет абзаца p');
ctx.assert(card.querySelector('.badge'), 'В карточке нет элемента .badge со статусом');`,
        points: 2,
      },
      {
        id: 't3',
        name: 'Данные попали в разметку',
        type: 'dom',
        code: `const card = ctx.$('#list .card');
ctx.assert(card.querySelector('h3').textContent.trim() === 'Коворкинг', 'В h3 должно быть название помещения');
const meta = card.querySelector('p').textContent;
ctx.assert(meta.includes('14.09.2026'), 'В абзаце должна быть дата');
ctx.assert(meta.includes('Банковская карта'), 'В абзаце должен быть способ оплаты');
ctx.assert(card.querySelector('.badge').textContent.trim() === 'Новая', 'В бейдже должен быть статус');`,
        points: 3,
      },
      {
        id: 't4',
        name: 'Повторный вызов не задваивает',
        type: 'dom',
        code: `const render = ctx.window.render;
ctx.assert(typeof render === 'function', 'Функция render должна быть объявлена на верхнем уровне');
render([
  { id: 1, room: 'Аудитория', date: '01.10.2026', payment: 'Наличные', status: 'Новая' },
]);
const cards = ctx.$$('#list .card');
ctx.assert(cards.length === 1, 'После повторного вызова должна остаться одна карточка, найдено ' + cards.length);`,
        points: 3,
      },
      {
        id: 't5',
        name: 'Пустое состояние',
        type: 'dom',
        code: `ctx.window.render([]);
const empty = ctx.$('#list .empty');
ctx.assert(empty, 'При пустом массиве должен появиться блок с классом empty');
ctx.assert(empty.textContent.trim() === 'У вас пока нет заявок', 'Текст должен быть «У вас пока нет заявок»');
ctx.assert(ctx.$$('#list .card').length === 0, 'Карточек при пустом списке быть не должно');`,
        points: 3,
      },
      {
        id: 't6',
        name: 'Текст вставляется безопасно',
        type: 'dom',
        code: `ctx.window.render([
  { id: 9, room: '<img src=x onerror="window.__hacked=1">', date: '01.01.2027', payment: 'Наличные', status: 'Новая' },
]);
ctx.assert(!ctx.window.__hacked, 'Разметка из данных выполнилась: используйте textContent вместо innerHTML');
const title = ctx.$('#list .card h3').textContent;
ctx.assert(title.includes('<img'), 'Опасный текст должен остаться обычным текстом');`,
        points: 4,
      },
    ],
    hints: [
      { level: 1, text: 'Перед отрисовкой очистите контейнер: list.innerHTML = "".', penaltyPercent: 10 },
      { level: 2, text: 'Создавайте элементы через document.createElement и заполняйте textContent — так данные не станут разметкой.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'const card = document.createElement("article"); card.className = "card"; const title = document.createElement("h3"); title.textContent = item.room; card.append(title, meta, badge); list.append(card);',
        penaltyPercent: 35,
      },
    ],
    solution: `<div id="list"></div>

<style>
  body { font-family: system-ui, sans-serif; padding: 16px; }
  .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; margin-bottom: 8px; }
  .badge { background: #dbeafe; color: #1e40af; border-radius: 999px; padding: 2px 10px; font-size: 12px; }
  .empty { color: #6b7280; }
</style>

<script>
  const applications = [
    { id: 1, room: 'Коворкинг', date: '14.09.2026', payment: 'Банковская карта', status: 'Новая' },
    { id: 2, room: 'Кинозал', date: '21.09.2026', payment: 'Наличные', status: 'Мероприятие завершено' },
  ];

  const list = document.querySelector('#list');

  function render(items) {
    list.innerHTML = '';

    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'empty';
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
      meta.textContent = item.date + ' · ' + item.payment;

      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = item.status;

      card.append(title, meta, badge);
      list.append(card);
    });
  }

  render(applications);
</script>`,
    solutionExplanation:
      'textContent вставляет данные как текст, а не как разметку — это защита от XSS, которую обязательно проверят в критерии качества кода. Пустое состояние отвечает требованию раздела «состояния интерфейса».',
    maxScore: 17,
    estimatedMinutes: 30,
    examRefs: ['m1-cabinet', 'm2-cabinet-ux', 'm3-quality'],
    planDays: ['day-06-3'],
    source: 'plan',
  },

  {
    id: 'task-js-validate-form',
    title: 'Валидация регистрации с подсказками у полей',
    kind: 'app',
    runtime: 'dom',
    difficulty: 3,
    tech: ['js', 'html'],
    topicIds: ['js-validation'],
    monthNo: 2,
    weekNo: 6,
    statement: `Соберите валидацию формы регистрации целиком — требование модуля 2: «показывайте соответствующие подсказки рядом с формой».

Правила из задания экзамена:

- **логин** — латинские буквы и цифры, минимум 6 символов;
- **пароль** — минимум 8 символов;
- **ФИО, телефон, e-mail** — обязательны.

Поведение при отправке:

1. поля с ошибкой получают класс \`is-invalid\`;
2. в соседний блок \`.invalid-feedback\` попадает текст ошибки;
3. если ошибок нет — все классы и тексты сбрасываются, а данные попадают в глобальную переменную \`submitted\`;
4. если ошибки есть — \`submitted\` остаётся \`null\`.`,
    requirements: [
      'Поля с ошибкой получают класс is-invalid',
      'Текст ошибки попадает в соседний .invalid-feedback',
      'Корректная форма заполняет переменную submitted',
      'При ошибках submitted не заполняется',
      'После исправления классы и тексты сбрасываются',
    ],
    starterCode: `<form id="register" novalidate>
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
  <div class="field">
    <label for="fullName">ФИО</label>
    <input id="fullName" name="fullName" type="text">
    <small class="invalid-feedback"></small>
  </div>
  <div class="field">
    <label for="phone">Телефон</label>
    <input id="phone" name="phone" type="tel">
    <small class="invalid-feedback"></small>
  </div>
  <div class="field">
    <label for="email">E-mail</label>
    <input id="email" name="email" type="email">
    <small class="invalid-feedback"></small>
  </div>
  <button type="submit">Зарегистрироваться</button>
</form>

<style>
  body { font-family: system-ui, sans-serif; padding: 16px; }
  .field { margin-bottom: 12px; }
  input { display: block; width: 260px; padding: 8px; border: 1px solid #d1d5db; border-radius: 8px; }
  .is-invalid { border-color: #dc2626; }
  .invalid-feedback { color: #dc2626; font-size: 12px; display: block; min-height: 14px; }
</style>

<script>
  var submitted = null;

  function validate(values) {
    // верните объект вида { login: 'текст ошибки' }
  }

  // обработчик отправки
</script>`,
    viewport: { width: 700, height: 700 },
    tests: [
      {
        id: 't1',
        name: 'Пустая форма: ошибки у всех полей',
        type: 'dom',
        code: `const form = ctx.$('#register');
form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
const invalid = ctx.$$('.is-invalid');
ctx.assert(invalid.length === 5, 'Все пять полей должны получить класс is-invalid, получили ' + invalid.length, 5, invalid.length);`,
        points: 3,
      },
      {
        id: 't2',
        name: 'Текст ошибки показан рядом с полем',
        type: 'dom',
        code: `const form = ctx.$('#register');
form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
const feedback = ctx.$('#login').parentElement.querySelector('.invalid-feedback');
ctx.assert(feedback.textContent.trim().length > 0, 'Рядом с полем логина должен появиться текст ошибки');`,
        points: 3,
      },
      {
        id: 't3',
        name: 'Кириллица в логине не проходит',
        type: 'dom',
        code: `const form = ctx.$('#register');
ctx.$('#login').value = 'иванов26';
ctx.$('#password').value = 'demo2026';
ctx.$('#fullName').value = 'Иванов Иван';
ctx.$('#phone').value = '+79990000000';
ctx.$('#email').value = 'ivan@example.com';
form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
ctx.assert(ctx.$('#login').classList.contains('is-invalid'), 'Логин из кириллицы должен считаться ошибкой');
ctx.assert(!ctx.window.submitted, 'При ошибке данные отправлять нельзя');`,
        points: 4,
      },
      {
        id: 't4',
        name: 'Короткий пароль не проходит',
        type: 'dom',
        code: `const form = ctx.$('#register');
ctx.$('#login').value = 'ivanov26';
ctx.$('#password').value = 'demo202';
ctx.$('#fullName').value = 'Иванов Иван';
ctx.$('#phone').value = '+79990000000';
ctx.$('#email').value = 'ivan@example.com';
form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
ctx.assert(ctx.$('#password').classList.contains('is-invalid'), 'Пароль из семи символов должен считаться ошибкой');`,
        points: 3,
      },
      {
        id: 't5',
        name: 'Корректная форма отправляется',
        type: 'dom',
        code: `const form = ctx.$('#register');
ctx.window.submitted = null;
ctx.$('#login').value = 'ivanov26';
ctx.$('#password').value = 'demo2026';
ctx.$('#fullName').value = 'Иванов Иван Иванович';
ctx.$('#phone').value = '+7 999 000-00-00';
ctx.$('#email').value = 'ivan@example.com';
form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
const data = ctx.window.submitted;
ctx.assert(data, 'При корректных данных переменная submitted должна заполниться');
ctx.assert(data.login === 'ivanov26', 'В submitted должен попасть логин');
ctx.assert(ctx.$$('.is-invalid').length === 0, 'Классы ошибок должны быть сняты');`,
        points: 4,
      },
      {
        id: 't6',
        name: 'Тексты ошибок очищаются после исправления',
        type: 'dom',
        code: `const form = ctx.$('#register');
form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
ctx.$('#login').value = 'ivanov26';
ctx.$('#password').value = 'demo2026';
ctx.$('#fullName').value = 'Иванов Иван';
ctx.$('#phone').value = '+79990000000';
ctx.$('#email').value = 'ivan@example.com';
form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
const texts = ctx.$$('.invalid-feedback').map((el) => el.textContent.trim()).join('');
ctx.assert(texts === '', 'После успешной проверки тексты ошибок нужно очистить');`,
        points: 3,
      },
    ],
    hints: [
      { level: 1, text: 'Сначала напишите чистую функцию validate(values) → объект ошибок. Она не должна трогать DOM.', penaltyPercent: 10 },
      { level: 2, text: 'Пройдите по всем полям с атрибутом name и для каждого включите или выключите класс через classList.toggle(name, Boolean(message)).', penaltyPercent: 20 },
      {
        level: 3,
        text: "form.querySelectorAll('[name]').forEach((field) => { const message = errors[field.name]; field.classList.toggle('is-invalid', Boolean(message)); field.parentElement.querySelector('.invalid-feedback').textContent = message || ''; });",
        penaltyPercent: 35,
      },
    ],
    solution: `<form id="register" novalidate>
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
  <div class="field">
    <label for="fullName">ФИО</label>
    <input id="fullName" name="fullName" type="text">
    <small class="invalid-feedback"></small>
  </div>
  <div class="field">
    <label for="phone">Телефон</label>
    <input id="phone" name="phone" type="tel">
    <small class="invalid-feedback"></small>
  </div>
  <div class="field">
    <label for="email">E-mail</label>
    <input id="email" name="email" type="email">
    <small class="invalid-feedback"></small>
  </div>
  <button type="submit">Зарегистрироваться</button>
</form>

<style>
  body { font-family: system-ui, sans-serif; padding: 16px; }
  .field { margin-bottom: 12px; }
  input { display: block; width: 260px; padding: 8px; border: 1px solid #d1d5db; border-radius: 8px; }
  .is-invalid { border-color: #dc2626; }
  .invalid-feedback { color: #dc2626; font-size: 12px; display: block; min-height: 14px; }
</style>

<script>
  var submitted = null;

  const LOGIN_PATTERN = /^[A-Za-z0-9]{6,}$/;
  const form = document.querySelector('#register');

  function validate(values) {
    const errors = {};

    if (!values.login) errors.login = 'Введите логин';
    else if (!LOGIN_PATTERN.test(values.login)) errors.login = 'Только латинские буквы и цифры, минимум 6 символов';

    if (!values.password) errors.password = 'Введите пароль';
    else if (values.password.length < 8) errors.password = 'Пароль не короче 8 символов';

    if (!values.fullName) errors.fullName = 'Укажите ФИО';
    if (!values.phone) errors.phone = 'Укажите телефон';
    if (!values.email) errors.email = 'Укажите e-mail';

    return errors;
  }

  function showErrors(errors) {
    form.querySelectorAll('[name]').forEach((field) => {
      const message = errors[field.name];
      field.classList.toggle('is-invalid', Boolean(message));
      const feedback = field.parentElement.querySelector('.invalid-feedback');
      if (feedback) feedback.textContent = message || '';
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const values = Object.fromEntries(new FormData(form));
    const errors = validate(values);
    showErrors(errors);

    if (Object.keys(errors).length) {
      form.querySelector('.is-invalid')?.focus();
      submitted = null;
      return;
    }

    submitted = values;
  });
</script>`,
    solutionExplanation:
      'Валидация отделена от показа ошибок: validate можно скопировать на сервер без изменений, а showErrors отвечает только за интерфейс. Перевод фокуса на первое проблемное поле — небольшая деталь, которая заметно улучшает удобство.',
    maxScore: 20,
    estimatedMinutes: 35,
    examRefs: ['m1-register', 'm2-register-hints'],
    planDays: ['day-06-5'],
    source: 'plan',
  },

  {
    id: 'task-js-slider',
    title: 'Слайдер: 4 изображения, 3 секунды, вперёд и назад',
    kind: 'app',
    runtime: 'dom',
    difficulty: 3,
    tech: ['js', 'css'],
    topicIds: ['js-timers'],
    monthNo: 2,
    weekNo: 6,
    statement: `Требование модуля 2 дословно: «слайдер, который автоматически переключается каждые три секунды… четыре одинаковых по размерам изображения, поддерживать перемещение вперед и назад».

Реализуйте его на чистом JavaScript. Обязательно:

- глобальная функция \`next()\` переключает на следующий слайд, \`prev()\` — на предыдущий;
- глобальная переменная \`index\` хранит номер текущего слайда (с нуля);
- перелистывание **по кругу**: после четвёртого идёт первый;
- автопереключение через \`setInterval\` ровно с интервалом 3000 мс;
- идентификатор интервала сохранён в переменной \`timer\`;
- кнопки «назад» и «вперёд» вызывают соответствующие функции.

Смещение ленты делается через \`transform: translateX(...)\`.`,
    requirements: [
      'Четыре слайда одинакового размера',
      'next и prev переключают по кругу',
      'Интервал автопереключения ровно 3000 мс',
      'Идентификатор интервала сохранён (можно остановить)',
      'Кнопки вперёд и назад работают',
    ],
    starterCode: `<div class="slider">
  <div class="track" id="track">
    <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='800' height='450' fill='%232563eb'/></svg>" alt="Аудитория">
    <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><rect width='600' height='600' fill='%2316a34a'/></svg>" alt="Коворкинг">
    <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='400'><rect width='1200' height='400' fill='%23d97706'/></svg>" alt="Кинозал">
    <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='700'><rect width='400' height='700' fill='%23dc2626'/></svg>" alt="Холл">
  </div>
  <button id="prev" type="button" aria-label="Предыдущий слайд">‹</button>
  <button id="next" type="button" aria-label="Следующий слайд">›</button>
</div>

<style>
  body { font-family: system-ui, sans-serif; padding: 16px; }
  .slider { position: relative; overflow: hidden; max-width: 520px; border-radius: 12px; }
  .track { display: flex; transition: transform .4s ease; }
  /* приведите изображения к одному размеру */
  .slider button { position: absolute; top: 50%; transform: translateY(-50%); border: 0; background: rgb(0 0 0 / .5); color: #fff; font-size: 22px; padding: 4px 12px; cursor: pointer; }
  #prev { left: 8px; } #next { right: 8px; }
</style>

<script>
  var index = 0;
  var timer = null;

  function show(i) {
    // ваш код
  }

  function next() {
    // ваш код
  }

  function prev() {
    // ваш код
  }

  // автопереключение и кнопки
</script>`,
    viewport: { width: 600, height: 500 },
    tests: [
      {
        id: 't1',
        name: 'Ровно четыре изображения',
        type: 'dom',
        code: `const images = ctx.$$('#track img');
ctx.assert(images.length === 4, 'Задание требует ровно четыре изображения, найдено ' + images.length, 4, images.length);`,
        points: 2,
      },
      {
        id: 't2',
        name: 'Изображения одного размера',
        type: 'dom',
        code: `const rects = ctx.$$('#track img').map((img) => img.getBoundingClientRect());
const first = rects[0];
rects.forEach((rect, i) => {
  ctx.assert(Math.abs(rect.width - first.width) < 2, 'Ширина слайда ' + (i + 1) + ' отличается');
  ctx.assert(Math.abs(rect.height - first.height) < 2, 'Высота слайда ' + (i + 1) + ' отличается: используйте object-fit и одинаковую высоту');
});`,
        points: 3,
      },
      {
        id: 't3',
        name: 'next переключает вперёд',
        type: 'dom',
        code: `ctx.assert(typeof ctx.window.next === 'function', 'Функция next должна быть объявлена');
ctx.window.index = 0;
ctx.window.next();
ctx.assert(ctx.window.index === 1, 'После next индекс должен стать 1, получено ' + ctx.window.index);`,
        points: 3,
      },
      {
        id: 't4',
        name: 'Перелистывание вперёд по кругу',
        type: 'dom',
        code: `ctx.window.index = 3;
ctx.window.next();
ctx.assert(ctx.window.index === 0, 'После последнего слайда должен идти первый, получено ' + ctx.window.index, 0, ctx.window.index);`,
        points: 3,
      },
      {
        id: 't5',
        name: 'Перелистывание назад по кругу',
        type: 'dom',
        code: `ctx.assert(typeof ctx.window.prev === 'function', 'Функция prev должна быть объявлена');
ctx.window.index = 0;
ctx.window.prev();
ctx.assert(ctx.window.index === 3, 'С первого слайда назад должен открываться последний, получено ' + ctx.window.index + '. Помните про (index - 1 + total) % total', 3, ctx.window.index);`,
        points: 4,
      },
      {
        id: 't6',
        name: 'Лента сдвигается через transform',
        type: 'dom',
        code: `ctx.window.index = 0;
ctx.window.next();
const transform = ctx.$('#track').style.transform || ctx.css('#track', 'transform');
ctx.assert(transform && transform !== 'none', 'Лента должна сдвигаться через transform: translateX(...)');`,
        points: 2,
      },
      {
        id: 't7',
        name: 'Интервал ровно 3000 мс',
        type: 'dom',
        code: `const source = ctx.source.replace(/\\s+/g, ' ');
ctx.assert(/setInterval\\s*\\([^,]+,\\s*3000\\s*\\)/.test(source), 'Автопереключение должно идти с интервалом 3000 мс — это дословное требование задания');
ctx.assert(ctx.window.timer !== null && ctx.window.timer !== undefined, 'Идентификатор интервала должен сохраняться в переменной timer, иначе его нельзя остановить');`,
        points: 4,
      },
      {
        id: 't8',
        name: 'Кнопки работают',
        type: 'dom',
        code: `ctx.window.index = 0;
ctx.click('#next');
ctx.assert(ctx.window.index === 1, 'Кнопка «вперёд» должна переключать слайд');
ctx.click('#prev');
ctx.assert(ctx.window.index === 0, 'Кнопка «назад» должна возвращать слайд');`,
        points: 3,
      },
    ],
    hints: [
      { level: 1, text: 'Количество слайдов удобно взять из разметки: track.children.length — тогда код не привязан к четырём.', penaltyPercent: 10 },
      { level: 2, text: 'Для движения по кругу используйте остаток от деления. Назад: (index - 1 + total) % total.', penaltyPercent: 20 },
      {
        level: 3,
        text: "function show(i) { track.style.transform = 'translateX(-' + i * 100 + '%)'; } и timer = setInterval(next, 3000); После клика по кнопке перезапускайте таймер.",
        penaltyPercent: 35,
      },
    ],
    solution: `<div class="slider">
  <div class="track" id="track">
    <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='800' height='450' fill='%232563eb'/></svg>" alt="Аудитория">
    <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><rect width='600' height='600' fill='%2316a34a'/></svg>" alt="Коворкинг">
    <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='400'><rect width='1200' height='400' fill='%23d97706'/></svg>" alt="Кинозал">
    <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='700'><rect width='400' height='700' fill='%23dc2626'/></svg>" alt="Холл">
  </div>
  <button id="prev" type="button" aria-label="Предыдущий слайд">‹</button>
  <button id="next" type="button" aria-label="Следующий слайд">›</button>
</div>

<style>
  .track img { flex: 0 0 100%; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; display: block; }
</style>

<script>
  var index = 0;
  var timer = null;

  const track = document.querySelector('#track');
  const total = track.children.length;

  function show(i) {
    track.style.transform = 'translateX(-' + i * 100 + '%)';
  }

  function next() {
    index = (index + 1) % total;
    show(index);
  }

  function prev() {
    index = (index - 1 + total) % total;
    show(index);
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(next, 3000);
  }

  document.querySelector('#next').addEventListener('click', () => { next(); restart(); });
  document.querySelector('#prev').addEventListener('click', () => { prev(); restart(); });

  show(index);
  restart();
</script>`,
    solutionExplanation:
      'Три детали, на которых теряют баллы: интервал ровно 3000 мс, круговое перелистывание в обе стороны и сохранённый идентификатор таймера. Перезапуск таймера после ручного клика убирает эффект «слайд прыгнул дважды».',
    maxScore: 24,
    estimatedMinutes: 40,
    examRefs: ['m2-slider'],
    planDays: ['day-06-6'],
    source: 'plan',
  },

  {
    id: 'task-dom-admin-table',
    title: 'Таблица админки: фильтр, сортировка, уведомление',
    kind: 'app',
    runtime: 'dom',
    difficulty: 4,
    tech: ['js', 'bootstrap', 'html'],
    topicIds: ['bootstrap-components', 'js-array-methods'],
    monthNo: 2,
    weekNo: 8,
    statement: `Соберите рабочую таблицу заявок администратора — требование модуля 2: «фильтры, всплывающие окна уведомлений, постраничная навигация и возможность сортировки данных».

В этом задании нужны фильтр, сортировка и уведомление:

1. \`renderTable()\` перерисовывает строки таблицы \`#rows\` по текущему состоянию;
2. выбор в \`#filter\` показывает только заявки с этим статусом (пустое значение — все);
3. клик по \`#sort-date\` меняет направление сортировки по дате;
4. смена значения в \`select.status\` внутри строки меняет статус заявки в массиве \`applications\` и показывает уведомление \`#toast\` с текстом «Статус изменён»;
5. уведомление появляется добавлением класса \`show\`.

Данные уже объявлены в скрипте.`,
    requirements: [
      'Таблица перерисовывается функцией renderTable',
      'Фильтр по статусу работает',
      'Сортировка по дате переключается кликом',
      'Смена статуса обновляет данные',
      'После смены статуса показывается уведомление',
    ],
    starterCode: `<div class="wrap">
  <label for="filter">Статус</label>
  <select id="filter">
    <option value="">Все</option>
    <option>Новая</option>
    <option>Мероприятие назначено</option>
    <option>Мероприятие завершено</option>
  </select>

  <table>
    <thead>
      <tr>
        <th>№</th>
        <th><button id="sort-date" type="button">Дата ↕</button></th>
        <th>Помещение</th>
        <th>Статус</th>
      </tr>
    </thead>
    <tbody id="rows"></tbody>
  </table>

  <div id="toast" class="toast">Статус изменён</div>
</div>

<style>
  body { font-family: system-ui, sans-serif; padding: 16px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th, td { border: 1px solid #e5e7eb; padding: 6px 10px; text-align: left; }
  .toast { position: fixed; right: 16px; bottom: 16px; background: #16a34a; color: #fff;
           padding: 10px 14px; border-radius: 8px; opacity: 0; pointer-events: none; transition: opacity .2s; }
  .toast.show { opacity: 1; }
</style>

<script>
  var applications = [
    { id: 1, date: '2026-09-21', room: 'Коворкинг', status: 'Новая' },
    { id: 2, date: '2026-09-14', room: 'Кинозал', status: 'Мероприятие завершено' },
    { id: 3, date: '2026-09-28', room: 'Аудитория', status: 'Новая' },
  ];
  var ascending = true;
  var STATUSES = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'];

  function renderTable() {
    // ваш код
  }

  renderTable();
</script>`,
    viewport: { width: 900, height: 600 },
    tests: [
      {
        id: 't1',
        name: 'Таблица отрисована',
        type: 'dom',
        code: `const rows = ctx.$$('#rows tr');
ctx.assert(rows.length === 3, 'Ожидалось три строки, найдено ' + rows.length, 3, rows.length);`,
        points: 2,
      },
      {
        id: 't2',
        name: 'Сортировка по дате по возрастанию',
        type: 'dom',
        code: `const cells = ctx.$$('#rows tr').map((row) => row.children[1].textContent.trim());
ctx.assert(cells[0].includes('14'), 'Первой должна идти самая ранняя дата (14.09 или 2026-09-14), получено ' + cells[0]);`,
        points: 3,
      },
      {
        id: 't3',
        name: 'Фильтр по статусу',
        type: 'dom',
        code: `const filter = ctx.$('#filter');
filter.value = 'Новая';
filter.dispatchEvent(new Event('change', { bubbles: true }));
const rows = ctx.$$('#rows tr');
ctx.assert(rows.length === 2, 'После фильтра «Новая» должно остаться две строки, найдено ' + rows.length, 2, rows.length);`,
        points: 4,
      },
      {
        id: 't4',
        name: 'Фильтр сбрасывается',
        type: 'dom',
        code: `const filter = ctx.$('#filter');
filter.value = 'Новая';
filter.dispatchEvent(new Event('change', { bubbles: true }));
filter.value = '';
filter.dispatchEvent(new Event('change', { bubbles: true }));
ctx.assert(ctx.$$('#rows tr').length === 3, 'При пустом фильтре должны показываться все заявки');`,
        points: 2,
      },
      {
        id: 't5',
        name: 'Клик по заголовку меняет порядок',
        type: 'dom',
        code: `ctx.click('#sort-date');
const cells = ctx.$$('#rows tr').map((row) => row.children[1].textContent.trim());
ctx.assert(cells[0].includes('28'), 'После клика по «Дата» порядок должен смениться на убывающий, получено ' + cells[0]);`,
        points: 4,
      },
      {
        id: 't6',
        name: 'В строке есть выбор статуса',
        type: 'dom',
        code: `const select = ctx.$('#rows select.status');
ctx.assert(select, 'В каждой строке должен быть select с классом status');
const options = [...select.options].map((o) => o.value);
['Новая', 'Мероприятие назначено', 'Мероприятие завершено'].forEach((status) => {
  ctx.assert(options.includes(status), 'В списке статусов не хватает значения «' + status + '»');
});`,
        points: 3,
      },
      {
        id: 't7',
        name: 'Смена статуса обновляет данные',
        type: 'dom',
        code: `const select = ctx.$('#rows select.status');
select.value = 'Мероприятие назначено';
select.dispatchEvent(new Event('change', { bubbles: true }));
const changed = ctx.window.applications.some((a) => a.status === 'Мероприятие назначено');
ctx.assert(changed, 'После выбора нового статуса он должен сохраниться в массиве applications');`,
        points: 4,
      },
      {
        id: 't8',
        name: 'Показывается уведомление',
        type: 'dom',
        code: `const select = ctx.$('#rows select.status');
select.value = 'Мероприятие завершено';
select.dispatchEvent(new Event('change', { bubbles: true }));
const toast = ctx.$('#toast');
ctx.assert(toast.classList.contains('show'), 'После смены статуса уведомление должно появиться (класс show)');`,
        points: 4,
      },
    ],
    hints: [
      { level: 1, text: 'Заведите одно состояние: текущий фильтр и направление сортировки. renderTable читает его и перерисовывает таблицу целиком.', penaltyPercent: 10 },
      { level: 2, text: 'Идентификатор заявки удобно положить в data-id у select — тогда обработчик знает, что менять.', penaltyPercent: 20 },
      {
        level: 3,
        text: "В обработчике change: const id = Number(select.dataset.id); const item = applications.find((a) => a.id === id); item.status = select.value; renderTable(); showToast();",
        penaltyPercent: 35,
      },
    ],
    solution: `<div class="wrap">
  <label for="filter">Статус</label>
  <select id="filter">
    <option value="">Все</option>
    <option>Новая</option>
    <option>Мероприятие назначено</option>
    <option>Мероприятие завершено</option>
  </select>

  <table>
    <thead>
      <tr>
        <th>№</th>
        <th><button id="sort-date" type="button">Дата ↕</button></th>
        <th>Помещение</th>
        <th>Статус</th>
      </tr>
    </thead>
    <tbody id="rows"></tbody>
  </table>

  <div id="toast" class="toast">Статус изменён</div>
</div>

<style>
  body { font-family: system-ui, sans-serif; padding: 16px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th, td { border: 1px solid #e5e7eb; padding: 6px 10px; text-align: left; }
  .toast { position: fixed; right: 16px; bottom: 16px; background: #16a34a; color: #fff;
           padding: 10px 14px; border-radius: 8px; opacity: 0; pointer-events: none; transition: opacity .2s; }
  .toast.show { opacity: 1; }
</style>

<script>
  var applications = [
    { id: 1, date: '2026-09-21', room: 'Коворкинг', status: 'Новая' },
    { id: 2, date: '2026-09-14', room: 'Кинозал', status: 'Мероприятие завершено' },
    { id: 3, date: '2026-09-28', room: 'Аудитория', status: 'Новая' },
  ];
  var ascending = true;
  var STATUSES = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'];

  const rowsEl = document.querySelector('#rows');
  const filterEl = document.querySelector('#filter');
  const toastEl = document.querySelector('#toast');
  let toastTimer = null;

  function toRuDate(iso) {
    const [year, month, day] = iso.split('-');
    return day + '.' + month + '.' + year;
  }

  function showToast() {
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2500);
  }

  function renderTable() {
    const status = filterEl.value;
    const filtered = status ? applications.filter((a) => a.status === status) : applications;
    const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date) * (ascending ? 1 : -1));

    rowsEl.innerHTML = '';

    sorted.forEach((item) => {
      const row = document.createElement('tr');

      const number = document.createElement('td');
      number.textContent = item.id;

      const date = document.createElement('td');
      date.textContent = toRuDate(item.date);

      const room = document.createElement('td');
      room.textContent = item.room;

      const statusCell = document.createElement('td');
      const select = document.createElement('select');
      select.className = 'status';
      select.dataset.id = item.id;
      STATUSES.forEach((value) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        if (value === item.status) option.selected = true;
        select.append(option);
      });
      statusCell.append(select);

      row.append(number, date, room, statusCell);
      rowsEl.append(row);
    });
  }

  filterEl.addEventListener('change', renderTable);

  document.querySelector('#sort-date').addEventListener('click', () => {
    ascending = !ascending;
    renderTable();
  });

  // Делегирование: обработчик один, а строк может быть сколько угодно.
  rowsEl.addEventListener('change', (event) => {
    const select = event.target.closest('select.status');
    if (!select) return;
    const id = Number(select.dataset.id);
    const item = applications.find((a) => a.id === id);
    if (!item) return;
    item.status = select.value;
    renderTable();
    showToast();
  });

  renderTable();
</script>`,
    solutionExplanation:
      'Делегирование событий решает проблему перерисовки: обработчик висит на теле таблицы, поэтому новые строки работают без повторной подписки. Это же понадобится в админке на React — там роль обработчика возьмёт на себя сам React.',
    maxScore: 26,
    estimatedMinutes: 45,
    examRefs: ['m2-admin-tools', 'm1-admin'],
    planDays: ['day-08-6'],
    source: 'plan',
  },
];
