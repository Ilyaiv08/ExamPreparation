import type { Task } from '../types';

/** Сборки недель 1-4: HTML, CSS, раскладка, первый макет проекта. */
export const WEEK_ASSEMBLY_M1: Task[] = [
  {
    id: 'task-week-01-assembly',
    title: 'Сборка недели 1: страница по памяти со всеми тегами',
    kind: 'app',
    runtime: 'dom',
    difficulty: 2,
    tech: ['html'],
    topicIds: ['html-structure', 'html-semantic', 'html-links-images'],
    monthNo: 1,
    weekNo: 1,
    statement: `Неделя закончилась. Проверяем, что осталось в голове: соберите страницу «Конференции.РФ», не подглядывая в свои файлы.

На странице должно быть всё, что разбирали за неделю:

1. **день 1–2** — полный каркас: тип документа, \`lang="ru"\`, кодировка, viewport, осмысленный \`<title>\`;
2. **день 3** — ссылка на другую страницу, изображение с текстовой заменой, маркированный список;
3. **день 5** — смысловые блоки \`<header>\`, \`<nav>\`, \`<main>\`, \`<footer>\` и таблица заявок с шапкой и хотя бы двумя строками;
4. **день 6** — ни одной из тех ошибок, что искали в панели разработчика: один \`<h1>\`, уникальные \`id\`, у всех ссылок есть адрес.

Стилей не нужно: CSS начинается на следующей неделе. Сегодня проверяется разметка.`,
    requirements: [
      'Полный каркас документа: doctype, lang, charset, viewport, title',
      'Есть <header>, <nav>, <main> и <footer>',
      'Есть ссылка с адресом и изображение с alt',
      'Есть маркированный список минимум из трёх пунктов',
      'Есть таблица с шапкой и минимум двумя строками данных',
      'Ровно один <h1>, все id уникальны',
    ],
    starterCode: `<!-- Пишите с нуля: наберите ! и нажмите Tab, дальше по памяти. -->
`,
    viewport: { width: 900, height: 700 },
    tests: [
      {
        id: 'skeleton',
        name: 'Каркас документа полный',
        type: 'dom',
        code: `ctx.assert(ctx.document.doctype !== null, 'Нет <!DOCTYPE html>');
ctx.assert(ctx.document.documentElement.getAttribute('lang') === 'ru', 'У <html> нужен lang="ru"');
ctx.assert(ctx.document.querySelector('meta[charset]'), 'Нет <meta charset>');
ctx.assert(ctx.document.querySelector('meta[name="viewport"]'), 'Нет <meta name="viewport">');
const title = (ctx.document.title || '').trim();
ctx.assert(title.length > 0 && title.toLowerCase() !== 'document', 'Заголовок вкладки пуст или остался шаблонным');`,
        points: 3,
      },
      {
        id: 'landmarks',
        name: 'Смысловые блоки на месте',
        type: 'dom',
        code: `['header', 'nav', 'main', 'footer'].forEach((tag) => {
  ctx.assert(ctx.$(tag), 'Не найден блок <' + tag + '>');
});`,
        points: 3,
      },
      {
        id: 'link-and-image',
        name: 'Ссылка и изображение оформлены правильно',
        type: 'dom',
        code: `const links = ctx.$$('a').filter((link) => (link.getAttribute('href') || '').trim().length > 0);
ctx.assert(links.length >= 1, 'Нет ни одной ссылки с непустым href');
const images = ctx.$$('img');
ctx.assert(images.length >= 1, 'На странице нет изображения');
images.forEach((img) => {
  const alt = img.getAttribute('alt');
  ctx.assert(alt !== null && alt.trim().length > 0, 'У изображения нет непустого alt');
});`,
        points: 3,
      },
      {
        id: 'list',
        name: 'Список из трёх пунктов',
        type: 'dom',
        code: `const items = ctx.$$('ul li').filter((li) => li.textContent.trim().length > 0);
ctx.assert(items.length >= 3, 'Нужен маркированный список минимум из трёх пунктов, найдено: ' + items.length, 3, items.length);`,
        points: 2,
      },
      {
        id: 'table',
        name: 'Таблица заявок с шапкой',
        type: 'dom',
        code: `const table = ctx.$('table');
ctx.assert(table, 'На странице нет таблицы');
const headers = ctx.$$('th', table);
ctx.assert(headers.length >= 2, 'У таблицы должна быть шапка из ячеек <th>, найдено: ' + headers.length);
const rows = ctx.$$('tr', table).filter((row) => ctx.$$('td', row).length > 0);
ctx.assert(rows.length >= 2, 'Строк с данными должно быть минимум две, найдено: ' + rows.length, 2, rows.length);`,
        points: 3,
      },
      {
        id: 'clean-markup',
        name: 'Ошибок из панели разработчика нет',
        type: 'dom',
        code: `const headings = ctx.$$('h1');
ctx.assert(headings.length === 1, 'Заголовок <h1> должен быть ровно один, найдено: ' + headings.length, 1, headings.length);
const ids = ctx.$$('[id]').map((el) => el.id);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
ctx.assert(duplicates.length === 0, 'Повторяются id: ' + duplicates.join(', '));
ctx.$$('a').forEach((link) => {
  ctx.assert((link.getAttribute('href') || '').trim().length > 0, 'У ссылки «' + link.textContent.trim() + '» нет адреса');
});`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Идите по дням недели: каркас → ссылки и картинки → смысловые блоки и таблица. Так ничего не забудете.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Таблица собирается из <table>, <thead> с <th> и <tbody> со строками <tr>, где ячейки — <td>.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Порядок в body: <header> с <h1> и <nav>, затем <main> со списком, изображением и таблицей, в конце <footer>.',
        penaltyPercent: 35,
      },
    ],
    solution: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Конференции.РФ — бронирование помещений</title>
</head>
<body>
  <header>
    <h1>Конференции.РФ</h1>
    <nav>
      <a href="index.html">Главная</a>
      <a href="rooms.html">Помещения</a>
      <a href="cabinet.html">Личный кабинет</a>
    </nav>
  </header>

  <main>
    <h2>Что можно забронировать</h2>
    <ul>
      <li>Аудитория на 100 мест</li>
      <li>Коворкинг на 20 рабочих мест</li>
      <li>Кинозал с проектором</li>
    </ul>

    <img alt="Аудитория на 100 мест" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='240'><rect width='600' height='240' fill='%232563eb'/></svg>">

    <h2>Мои заявки</h2>
    <table>
      <thead>
        <tr>
          <th>№</th>
          <th>Помещение</th>
          <th>Дата</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Аудитория на 100 мест</td>
          <td>12.03.2027</td>
          <td>Новая</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Коворкинг</td>
          <td>05.02.2027</td>
          <td>Выполнена</td>
        </tr>
      </tbody>
    </table>
  </main>

  <footer>
    <p>© 2027 Конференции.РФ</p>
  </footer>
</body>
</html>`,
    solutionExplanation:
      'Страница собрана из блоков, а не из набора <div>. Это и есть смысл первой недели: браузер, поисковик и программа чтения с экрана понимают, где шапка, а где основная часть, только если это сказано тегом. Заголовки идут по уровням: <h1> — название сайта, <h2> — разделы внутри. Пропускать уровни (сразу с h1 на h3) нельзя, это одна из типичных придирок на проверке качества кода.',
    maxScore: 17,
    estimatedMinutes: 40,
    examRefs: ['m1-cabinet', 'm3-quality'],
    planDays: ['day-01-7'],
    source: 'plan',
  },

  {
    id: 'task-week-02-assembly',
    title: 'Сборка недели 2: форма регистрации с оформлением по памяти',
    kind: 'app',
    runtime: 'dom',
    difficulty: 3,
    tech: ['html', 'css'],
    topicIds: ['html-forms', 'css-basics', 'css-box-model', 'css-pseudo'],
    monthNo: 1,
    weekNo: 2,
    statement: `Соберите форму регистрации из задания демоэкзамена целиком — разметку и оформление, по памяти.

Что должно сойтись за неделю:

1. **день 1–2** — поля из задания: логин, пароль, ФИО, телефон, e-mail. Каждое обязательное, у каждого подпись через \`for\`, у пароля \`minlength="8"\`, у e-mail тип \`email\`, у телефона тип \`tel\`.
2. **день 3–4** — единое оформление: шрифт задан на \`body\`, размеры в относительных единицах, цвета не по умолчанию.
3. **день 5** — форма оформлена карточкой: рамка, внутренний отступ не меньше 16px, скруглённые углы, \`box-sizing: border-box\` у полей.
4. **день 6** — состояния: поле в фокусе меняет цвет рамки, кнопка реагирует на наведение.`,
    requirements: [
      'Пять полей из задания: логин, пароль, ФИО, телефон, e-mail',
      'Все поля обязательные и связаны с подписями через for',
      'У пароля minlength="8", у e-mail type="email", у телефона type="tel"',
      'Форма оформлена карточкой: рамка, отступ от 16px, скругление',
      'У полей box-sizing: border-box',
      'Есть правило для :focus или :focus-visible',
      'Есть правило для :hover на кнопке',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Регистрация — Конференции.РФ</title>
  <style>
    /* Оформление пишите сами: карточка, поля, состояния */
  </style>
</head>
<body>
  <!-- Форма регистрации: пять полей и кнопка -->
</body>
</html>`,
    viewport: { width: 800, height: 800 },
    tests: [
      {
        id: 'fields',
        name: 'Пять полей из задания экзамена',
        type: 'dom',
        code: `const names = ['login', 'password', 'fullName', 'phone', 'email'];
const found = ctx.$$('form input').map((input) => input.name);
const lower = found.map((name) => (name || '').toLowerCase());
names.forEach((name) => {
  ctx.assert(
    lower.indexOf(name.toLowerCase()) !== -1,
    'Нет поля с name="' + name + '". Сейчас в форме: ' + found.join(', '),
  );
});`,
        points: 3,
      },
      {
        id: 'required-and-labels',
        name: 'Все поля обязательные и подписаны',
        type: 'dom',
        code: `const inputs = ctx.$$('form input').filter((input) => input.type !== 'submit');
ctx.assert(inputs.length >= 5, 'Полей должно быть не меньше пяти');
inputs.forEach((input) => {
  ctx.assert(input.required, 'Поле «' + input.name + '» не обязательное: добавьте required');
  ctx.assert(input.id, 'У поля «' + input.name + '» нет id');
  ctx.assert(ctx.$('label[for="' + input.id + '"]'), 'Для поля «' + input.name + '» нет подписи <label for>');
});`,
        points: 3,
      },
      {
        id: 'types',
        name: 'Типы полей и длина пароля',
        type: 'dom',
        code: `const byName = {};
ctx.$$('form input').forEach((input) => {
  byName[(input.name || '').toLowerCase()] = input;
});
ctx.assert(byName.password.type === 'password', 'Пароль должен быть type="password"');
ctx.assert(byName.password.getAttribute('minlength') === '8', 'У пароля нужен minlength="8"');
ctx.assert(byName.email.type === 'email', 'E-mail должен быть type="email" — браузер сам проверит формат');
ctx.assert(byName.phone.type === 'tel', 'Телефон должен быть type="tel" — на телефоне откроется цифровая клавиатура');`,
        points: 3,
      },
      {
        id: 'card',
        name: 'Форма оформлена карточкой',
        type: 'dom',
        code: `const form = ctx.$('form');
const card = form.closest('div, section, article') || form;
ctx.assert(parseFloat(ctx.css(card, 'border-top-width')) > 0, 'У карточки нет рамки');
ctx.assert(parseFloat(ctx.css(card, 'padding-top')) >= 16, 'Внутренний отступ карточки должен быть не меньше 16px');
ctx.assert(parseFloat(ctx.css(card, 'border-radius')) > 0, 'У карточки нет скругления углов');`,
        points: 3,
      },
      {
        id: 'box-sizing',
        name: 'Поля не вылезают за карточку',
        type: 'dom',
        code: `const input = ctx.$('form input');
const sizing = ctx.css(input, 'box-sizing');
ctx.assert(
  sizing === 'border-box',
  'У полей нужен box-sizing: border-box, иначе ширина 100% плюс отступы вылезет за карточку. Сейчас: ' + sizing,
  'border-box',
  sizing,
);
const form = ctx.$('form');
const formRight = form.getBoundingClientRect().right;
ctx.$$('form input').forEach((field) => {
  ctx.assert(
    field.getBoundingClientRect().right <= formRight + 1,
    'Поле «' + field.name + '» выходит за границу формы',
  );
});`,
        points: 3,
      },
      {
        id: 'states',
        name: 'Состояния фокуса и наведения описаны',
        type: 'dom',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(/:focus(-visible)?\\s*\\{|:focus(-visible)?\\s*,/.test(source), 'Нет правила для :focus или :focus-visible');
ctx.assert(/:hover/.test(source), 'Нет правила для :hover');
ctx.assert(
  !/outline\\s*:\\s*none\\s*;?\\s*\\}/.test(source) || /outline\\s*:\\s*[^n]/.test(source),
  'Обводку фокуса нельзя просто убрать: без неё непонятно, где курсор при работе с клавиатуры',
);`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Начните с разметки всех пяти полей, и только потом беритесь за стили. Так не придётся переписывать селекторы.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'box-sizing: border-box удобнее задать сразу всем элементам правилом * { box-sizing: border-box; } в начале стилей.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Состояния: input:focus-visible { border-color: #2563eb; outline: 2px solid #bfdbfe; } и button:hover { background: #1d4ed8; }.',
        penaltyPercent: 35,
      },
    ],
    solution: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Регистрация — Конференции.РФ</title>
  <style>
    * { box-sizing: border-box; }

    body {
      margin: 0;
      padding: 24px;
      font-family: system-ui, sans-serif;
      font-size: 1rem;
      line-height: 1.5;
      color: #0f172a;
      background: #f8fafc;
    }

    .card {
      max-width: 440px;
      margin: 0 auto;
      padding: 24px;
      background: #fff;
      border: 1px solid #cbd5e1;
      border-radius: 14px;
    }

    .card h1 { margin-top: 0; font-size: 1.5rem; }

    .field { margin-bottom: 16px; }

    .field label {
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .field input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 1rem;
    }

    .field input:focus-visible {
      border-color: #2563eb;
      outline: 2px solid #bfdbfe;
      outline-offset: 1px;
    }

    button {
      width: 100%;
      padding: 12px;
      border: 0;
      border-radius: 8px;
      background: #2563eb;
      color: #fff;
      font-size: 1rem;
      cursor: pointer;
    }

    button:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Регистрация</h1>
    <form>
      <div class="field">
        <label for="login">Логин</label>
        <input type="text" id="login" name="login" required minlength="6">
      </div>
      <div class="field">
        <label for="password">Пароль</label>
        <input type="password" id="password" name="password" required minlength="8">
      </div>
      <div class="field">
        <label for="fullName">ФИО</label>
        <input type="text" id="fullName" name="fullName" required>
      </div>
      <div class="field">
        <label for="phone">Телефон</label>
        <input type="tel" id="phone" name="phone" required>
      </div>
      <div class="field">
        <label for="email">E-mail</label>
        <input type="email" id="email" name="email" required>
      </div>
      <button type="submit">Зарегистрироваться</button>
    </form>
  </div>
</body>
</html>`,
    solutionExplanation:
      'Правило * { box-sizing: border-box; } стоит первым не случайно: оно меняет саму модель расчёта размеров для всей страницы, и его удобнее задать один раз, чем вспоминать о нём у каждого поля. Псевдокласс :focus-visible вместо :focus выбран сознательно: он срабатывает при навигации с клавиатуры, но не подсвечивает поле после клика мышью — ровно то поведение, которого ждёт пользователь.',
    maxScore: 18,
    estimatedMinutes: 45,
    examRefs: ['m1-register', 'm2-register-hints', 'm2-design'],
    planDays: ['day-02-7'],
    source: 'plan',
  },

  {
    id: 'task-week-03-assembly',
    title: 'Сборка недели 3: кабинет, работающий на телефоне',
    kind: 'app',
    runtime: 'dom',
    difficulty: 4,
    tech: ['html', 'css'],
    topicIds: ['css-flexbox', 'css-grid', 'css-position', 'css-responsive', 'css-images'],
    monthNo: 1,
    weekNo: 3,
    statement: `Неделя была про раскладку. Соберите страницу «Личный кабинет» так, чтобы в ней сошлось всё: флекс, сетка, позиционирование, адаптив и картинки.

1. **день 1–2, флекс** — шапка \`<header>\`: название слева, меню справа, в одну строку.
2. **день 4, позиционирование** — шапка приклеена к верху экрана (\`position: sticky\`), и у каждой карточки в правом верхнем углу метка статуса, положенная поверх (\`position: absolute\` внутри \`position: relative\`).
3. **день 3, сетка** — карточки заявок в сетке \`.orders\`.
4. **день 5, адаптив** — на 390px колонка одна, от 768px — три. Горизонтальной прокрутки нет.
5. **день 6, картинки** — в каждой карточке изображение с \`object-fit: cover\` и фиксированной высотой, чтобы разные пропорции выглядели одинаково.

Песочница открыта на 390 × 844 — как в задании демоэкзамена.`,
    requirements: [
      'Шапка на флексе, содержимое разведено по краям',
      'Шапка приклеена к верху через position: sticky',
      '.orders — сетка (display: grid)',
      'На 390px одна колонка, есть медиазапрос min-width: 768px на три',
      'У карточки position: relative, у метки статуса position: absolute',
      'У изображений object-fit: cover и заданная высота',
      'На 390px нет горизонтальной прокрутки',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Личный кабинет — Конференции.РФ</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, sans-serif; background: #f8fafc; }

    /* Шапка на флексе и приклеенная к верху */

    /* Сетка заявок: одна колонка, от 768px — три */

    /* Карточка с меткой статуса поверх и картинкой одинаковой высоты */
  </style>
</head>
<body>
  <header>
    <!-- название и меню -->
  </header>

  <main>
    <h1>Мои заявки</h1>
    <div class="orders">
      <!-- три карточки: картинка, помещение, дата, метка статуса -->
    </div>
  </main>
</body>
</html>`,
    viewport: { width: 390, height: 844 },
    tests: [
      {
        id: 'header-flex',
        name: 'Шапка на флексе и приклеена к верху',
        type: 'dom',
        code: `const display = ctx.css('header', 'display');
ctx.assert(display === 'flex', 'Шапка должна быть flex-контейнером, сейчас: ' + display, 'flex', display);
const justify = ctx.css('header', 'justify-content');
ctx.assert(justify === 'space-between', 'Название и меню разводятся через space-between, сейчас: ' + justify);
const position = ctx.css('header', 'position');
ctx.assert(position === 'sticky', 'Шапка должна быть приклеена: position: sticky, сейчас: ' + position, 'sticky', position);
const top = ctx.css('header', 'top');
ctx.assert(parseFloat(top) === 0, 'У приклеенной шапки нужно указать top: 0, иначе она никуда не прилипнет');`,
        points: 3,
      },
      {
        id: 'grid-mobile',
        name: 'На телефоне одна колонка',
        type: 'dom',
        code: `const display = ctx.css('.orders', 'display');
ctx.assert(display === 'grid', 'У .orders должен быть display: grid, сейчас: ' + display, 'grid', display);
const columns = ctx.css('.orders', 'grid-template-columns').split(' ').filter(Boolean);
ctx.assert(columns.length === 1, 'На 390px колонка должна быть одна, сейчас: ' + columns.length, 1, columns.length);`,
        points: 3,
      },
      {
        id: 'media-query',
        name: 'От 768px колонок три',
        type: 'dom',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(/@media[^{]*min-width\\s*:\\s*768px/.test(source), 'Нет медиазапроса @media (min-width: 768px)');
const block = source.slice(source.search(/@media[^{]*min-width\\s*:\\s*768px/));
ctx.assert(/repeat\\(3|1fr 1fr 1fr/.test(block), 'Внутри медиазапроса сетка не переключается на три колонки');`,
        points: 3,
      },
      {
        id: 'status-overlay',
        name: 'Метка статуса лежит поверх карточки',
        type: 'dom',
        code: `const card = ctx.$('.orders .card');
ctx.assert(card, 'В сетке нет карточек с классом .card');
const cardPosition = ctx.css(card, 'position');
ctx.assert(cardPosition === 'relative', 'У карточки нужен position: relative — иначе метке не от чего отсчитываться');
const status = ctx.$('.status', card);
ctx.assert(status, 'В карточке нет метки .status');
const statusPosition = ctx.css(status, 'position');
ctx.assert(statusPosition === 'absolute', 'Метка кладётся поверх через position: absolute, сейчас: ' + statusPosition);
const cardRect = card.getBoundingClientRect();
const statusRect = status.getBoundingClientRect();
ctx.assert(statusRect.top < cardRect.top + cardRect.height / 2, 'Метка должна быть в верхней части карточки');
ctx.assert(statusRect.right > cardRect.left + cardRect.width / 2, 'Метка должна быть у правого края карточки');`,
        points: 4,
      },
      {
        id: 'images',
        name: 'Картинки одинаковой высоты и не растянуты',
        type: 'dom',
        code: `const images = ctx.$$('.orders .card img');
ctx.assert(images.length >= 3, 'В карточках должно быть не меньше трёх изображений, найдено: ' + images.length);
const heights = images.map((img) => Math.round(img.getBoundingClientRect().height));
ctx.assert(heights.every((height) => height === heights[0]), 'Высота изображений должна совпадать, сейчас: ' + heights.join(', '));
images.forEach((img) => {
  const fit = ctx.css(img, 'object-fit');
  ctx.assert(fit === 'cover', 'У изображения нужен object-fit: cover, иначе картинка растянется. Сейчас: ' + fit, 'cover', fit);
  const alt = img.getAttribute('alt');
  ctx.assert(alt !== null && alt.trim().length > 0, 'У изображения нет непустого alt');
});`,
        points: 4,
      },
      {
        id: 'no-scroll',
        name: 'Горизонтальной прокрутки нет',
        type: 'dom',
        code: `const root = ctx.document.documentElement;
ctx.assert(
  root.scrollWidth <= root.clientWidth + 1,
  'Страница уезжает вбок: ' + root.scrollWidth + 'px при экране ' + root.clientWidth + 'px',
);`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'position: sticky работает только вместе с указанием края: top: 0. Без него элемент остаётся на месте.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Абсолютно позиционированный элемент отсчитывается от ближайшего предка с position, отличным от static. Поэтому карточке нужен position: relative.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: '.orders { display: grid; grid-template-columns: 1fr; gap: 16px; } @media (min-width: 768px) { .orders { grid-template-columns: repeat(3, 1fr); } } .card { position: relative; } .status { position: absolute; top: 8px; right: 8px; } .card img { width: 100%; height: 160px; object-fit: cover; }',
        penaltyPercent: 35,
      },
    ],
    solution: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Личный кабинет — Конференции.РФ</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, sans-serif; background: #f8fafc; }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: #fff;
      border-bottom: 1px solid #e2e8f0;
      position: sticky;
      top: 0;
    }

    header nav a { margin-left: 12px; color: #2563eb; font-size: 0.9rem; }

    main { padding: 16px; }

    .orders {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    @media (min-width: 768px) {
      .orders { grid-template-columns: repeat(3, 1fr); }
    }

    .card {
      position: relative;
      background: #fff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      overflow: hidden;
    }

    .card img {
      display: block;
      width: 100%;
      height: 160px;
      object-fit: cover;
    }

    .card__body { padding: 12px; }
    .card__body h2 { margin: 0 0 4px; font-size: 1rem; }
    .card__body p { margin: 0; color: #475569; font-size: 0.9rem; }

    .status {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 2px 10px;
      border-radius: 999px;
      background: #dbeafe;
      color: #1d4ed8;
      font-size: 0.8rem;
    }
  </style>
</head>
<body>
  <header>
    <strong>Конференции.РФ</strong>
    <nav>
      <a href="index.html">Главная</a>
      <a href="cabinet.html">Кабинет</a>
    </nav>
  </header>

  <main>
    <h1>Мои заявки</h1>
    <div class="orders">
      <article class="card">
        <img alt="Аудитория на 100 мест" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='800' height='450' fill='%232563eb'/></svg>">
        <div class="card__body">
          <h2>Аудитория на 100 мест</h2>
          <p>12.03.2027</p>
        </div>
        <span class="status">Новая</span>
      </article>

      <article class="card">
        <img alt="Коворкинг" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><rect width='600' height='600' fill='%2316a34a'/></svg>">
        <div class="card__body">
          <h2>Коворкинг</h2>
          <p>05.02.2027</p>
        </div>
        <span class="status">Выполнена</span>
      </article>

      <article class="card">
        <img alt="Кинозал" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='400'><rect width='1200' height='400' fill='%23d97706'/></svg>">
        <div class="card__body">
          <h2>Кинозал</h2>
          <p>28.01.2027</p>
        </div>
        <span class="status">Отклонена</span>
      </article>
    </div>
  </main>
</body>
</html>`,
    solutionExplanation:
      'Три исходные картинки имеют разные пропорции: 16:9, квадрат и широкая полоса. Пара «фиксированная высота + object-fit: cover» приводит их к одному виду, обрезая лишнее вместо растягивания — растянутое изображение видно сразу и выглядит как ошибка. Свойство overflow: hidden у карточки нужно, чтобы картинка не вылезала за скруглённые углы. И главное правило недели: начинаем с одной колонки, а три добавляем медиазапросом. Так на телефоне работает базовый вариант, а не урезанный десктопный.',
    maxScore: 20,
    estimatedMinutes: 50,
    examRefs: ['m1-cabinet', 'm2-mobile', 'm2-cabinet-ux', 'm3-mobile'],
    planDays: ['day-03-7'],
    source: 'plan',
  },

  {
    id: 'task-week-04-assembly',
    title: 'Контроль месяца 1: вход и регистрация с нуля за 40 минут',
    kind: 'app',
    runtime: 'dom',
    difficulty: 4,
    tech: ['html', 'css'],
    topicIds: ['design-basics', 'html-forms', 'css-flexbox', 'css-responsive'],
    monthNo: 1,
    weekNo: 4,
    statement: `Контрольная работа за месяц. Условия как на экзамене: **40 минут**, без подсказок, без подглядывания в свои файлы.

Соберите на одной странице обе формы из задания демоэкзамена — вход и регистрацию — переключаемые ссылками-якорями.

1. Шапка на флексе, приклеена к верху.
2. Блок \`#login\` с формой входа: логин и пароль, оба обязательные.
3. Блок \`#register\` с формой регистрации: логин, пароль, ФИО, телефон, e-mail — все обязательные, с правильными типами.
4. Переходы между формами в обе стороны: из входа ссылка \`href="#register"\`, из регистрации — \`href="#login"\`. Это отдельное требование задания.
5. Обе формы — карточками одинакового вида: рамка, отступы, скругление, ограниченная ширина.
6. Всё это работает на 390px без горизонтальной прокрутки.

Засеките время. Если не уложились — не страшно, но запишите, на чём именно застряли: это и есть то, что нужно повторить.`,
    requirements: [
      'Есть блоки #login и #register с формами',
      'В форме входа логин и пароль, оба обязательные',
      'В форме регистрации пять полей задания, все обязательные',
      'Правильные типы: password, tel, email',
      'Ссылки-переходы между формами в обе стороны',
      'Обе формы оформлены карточками одного вида',
      'Шапка на флексе и приклеена к верху',
      'На 390px нет горизонтальной прокрутки',
    ],
    starterCode: `<!-- Контроль месяца: пишите с нуля. Засеките 40 минут. -->
`,
    viewport: { width: 390, height: 844 },
    tests: [
      {
        id: 'sections',
        name: 'Обе формы на месте',
        type: 'dom',
        code: `const login = ctx.$('#login');
const register = ctx.$('#register');
ctx.assert(login, 'Нет блока с id="login"');
ctx.assert(register, 'Нет блока с id="register"');
ctx.assert(ctx.$('form', login), 'В блоке входа нет формы');
ctx.assert(ctx.$('form', register), 'В блоке регистрации нет формы');`,
        points: 3,
      },
      {
        id: 'login-form',
        name: 'Форма входа заполнена правильно',
        type: 'dom',
        code: `const form = ctx.$('#login form');
const login = ctx.$('input[name="login"]', form);
const password = ctx.$('input[name="password"]', form);
ctx.assert(login, 'В форме входа нет поля name="login"');
ctx.assert(password, 'В форме входа нет поля name="password"');
ctx.assert(password.type === 'password', 'Пароль должен быть type="password"');
ctx.assert(login.required && password.required, 'Оба поля входа должны быть обязательными');
ctx.assert(ctx.$('button[type="submit"], button:not([type])', form), 'В форме входа нет кнопки отправки');`,
        points: 3,
      },
      {
        id: 'register-form',
        name: 'Форма регистрации по заданию экзамена',
        type: 'dom',
        code: `const form = ctx.$('#register form');
const byName = {};
ctx.$$('input', form).forEach((input) => {
  byName[(input.name || '').toLowerCase()] = input;
});
['login', 'password', 'fullname', 'phone', 'email'].forEach((name) => {
  ctx.assert(byName[name], 'В форме регистрации нет поля «' + name + '». Есть: ' + Object.keys(byName).join(', '));
  ctx.assert(byName[name].required, 'Поле «' + name + '» должно быть обязательным');
});
ctx.assert(byName.password.type === 'password', 'Пароль должен быть type="password"');
ctx.assert(byName.phone.type === 'tel', 'Телефон должен быть type="tel"');
ctx.assert(byName.email.type === 'email', 'E-mail должен быть type="email"');`,
        points: 4,
      },
      {
        id: 'cross-links',
        name: 'Переходы между формами в обе стороны',
        type: 'dom',
        code: `const toRegister = ctx.$$('#login a').filter((link) => link.getAttribute('href') === '#register');
const toLogin = ctx.$$('#register a').filter((link) => link.getAttribute('href') === '#login');
ctx.assert(toRegister.length >= 1, 'Со страницы входа нет ссылки href="#register"');
ctx.assert(toLogin.length >= 1, 'Со страницы регистрации нет ссылки href="#login"');`,
        points: 3,
      },
      {
        id: 'cards',
        name: 'Формы оформлены карточками',
        type: 'dom',
        code: `[ctx.$('#login form'), ctx.$('#register form')].forEach((form, index) => {
  const card = form.closest('div, section, article') || form;
  const where = index === 0 ? 'входа' : 'регистрации';
  ctx.assert(parseFloat(ctx.css(card, 'border-top-width')) > 0, 'У карточки ' + where + ' нет рамки');
  ctx.assert(parseFloat(ctx.css(card, 'padding-top')) >= 12, 'У карточки ' + where + ' нет внутреннего отступа');
  ctx.assert(parseFloat(ctx.css(card, 'border-radius')) > 0, 'У карточки ' + where + ' нет скругления');
});`,
        points: 3,
      },
      {
        id: 'header',
        name: 'Шапка на флексе и приклеена',
        type: 'dom',
        code: `const header = ctx.$('header');
ctx.assert(header, 'Нет шапки <header>');
ctx.assert(ctx.css(header, 'display') === 'flex', 'Шапка должна быть flex-контейнером');
ctx.assert(ctx.css(header, 'position') === 'sticky', 'Шапка должна быть приклеена: position: sticky');`,
        points: 2,
      },
      {
        id: 'mobile',
        name: 'Работает на 390px',
        type: 'dom',
        code: `const root = ctx.document.documentElement;
ctx.assert(
  root.scrollWidth <= root.clientWidth + 1,
  'Страница уезжает вбок: ' + root.scrollWidth + 'px при экране ' + root.clientWidth + 'px',
);
ctx.assert(ctx.document.querySelector('meta[name="viewport"]'), 'Без meta viewport адаптив не работает');
ctx.$$('input').forEach((input) => {
  ctx.assert(input.getBoundingClientRect().width <= root.clientWidth, 'Поле «' + input.name + '» шире экрана');
});`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Не тратьте время на красоту. Сначала обе формы со всеми полями, потом общий класс .card на оформление — он один на обе.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Ссылка-якорь ведёт на элемент с таким же id: href="#register" прокрутит к <section id="register">.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Структура: <header> со ссылками, затем <main> с <section id="login"> и <section id="register">. Один класс .card оформляет обе карточки, одно правило .field input — все поля.',
        penaltyPercent: 35,
      },
    ],
    solution: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Вход и регистрация — Конференции.РФ</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, sans-serif; background: #f8fafc; color: #0f172a; }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #fff;
      border-bottom: 1px solid #e2e8f0;
      position: sticky;
      top: 0;
    }

    header nav a { margin-left: 12px; color: #2563eb; font-size: 0.9rem; }

    main { padding: 16px; }

    .card {
      max-width: 420px;
      margin: 0 auto 24px;
      padding: 20px;
      background: #fff;
      border: 1px solid #cbd5e1;
      border-radius: 14px;
    }

    .card h2 { margin-top: 0; }

    .field { margin-bottom: 14px; }
    .field label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 0.9rem; }

    .field input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 1rem;
    }

    .field input:focus-visible { border-color: #2563eb; outline: 2px solid #bfdbfe; }

    button {
      width: 100%;
      padding: 12px;
      border: 0;
      border-radius: 8px;
      background: #2563eb;
      color: #fff;
      font-size: 1rem;
      cursor: pointer;
    }

    button:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <header>
    <strong>Конференции.РФ</strong>
    <nav>
      <a href="#login">Вход</a>
      <a href="#register">Регистрация</a>
    </nav>
  </header>

  <main>
    <section id="login">
      <div class="card">
        <h2>Вход</h2>
        <form>
          <div class="field">
            <label for="login-login">Логин</label>
            <input type="text" id="login-login" name="login" required minlength="6">
          </div>
          <div class="field">
            <label for="login-password">Пароль</label>
            <input type="password" id="login-password" name="password" required minlength="8">
          </div>
          <button type="submit">Войти</button>
        </form>
        <p>Ещё не зарегистрированы? <a href="#register">Регистрация</a></p>
      </div>
    </section>

    <section id="register">
      <div class="card">
        <h2>Регистрация</h2>
        <form>
          <div class="field">
            <label for="reg-login">Логин</label>
            <input type="text" id="reg-login" name="login" required minlength="6">
          </div>
          <div class="field">
            <label for="reg-password">Пароль</label>
            <input type="password" id="reg-password" name="password" required minlength="8">
          </div>
          <div class="field">
            <label for="reg-fullname">ФИО</label>
            <input type="text" id="reg-fullname" name="fullName" required>
          </div>
          <div class="field">
            <label for="reg-phone">Телефон</label>
            <input type="tel" id="reg-phone" name="phone" required>
          </div>
          <div class="field">
            <label for="reg-email">E-mail</label>
            <input type="email" id="reg-email" name="email" required>
          </div>
          <button type="submit">Зарегистрироваться</button>
        </form>
        <p>Уже есть аккаунт? <a href="#login">Вход</a></p>
      </div>
    </section>
  </main>
</body>
</html>`,
    solutionExplanation:
      'Приём, который экономит время на экзамене: одно оформление на обе карточки. Класс .card, класс .field, одно правило на все поля — и обе формы выглядят одинаково без единой лишней строки. Второе: поля логина в двух формах имеют одинаковый name, но разные id. Имя уходит на сервер и должно быть одинаковым, а идентификатор обязан быть уникальным на всей странице — именно поэтому префиксы login- и reg-.',
    maxScore: 21,
    estimatedMinutes: 40,
    timeLimitMs: 2_400_000,
    examRefs: ['m1-login', 'm1-register', 'm2-mobile', 'm2-design'],
    planDays: ['day-04-7'],
    source: 'plan',
  },
];
