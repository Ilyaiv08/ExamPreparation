import type { Task } from '../types';

/**
 * Месяц 1: HTML, CSS, адаптив, Git.
 * Все задания выполняются в среде `dom`: код студента рендерится
 * в изолированном окне, а тесты работают с настоящим DOM и вычисленными стилями.
 */
export const MONTH_01_TASKS: Task[] = [
  {
    id: 'task-html-skeleton',
    title: 'Каркас HTML-страницы',
    kind: 'function',
    runtime: 'dom',
    difficulty: 1,
    tech: ['html'],
    topicIds: ['html-structure'],
    monthNo: 1,
    weekNo: 1,
    statement: `Соберите каркас страницы входа для проекта «Конференции.РФ».

Каркас должен быть полноценным документом: с типом документа, языком страницы, кодировкой и метатегом viewport — без него не заработает адаптив, который требует модуль 2 экзамена.

Содержимое: заголовок первого уровня «Конференции.РФ» и абзац с любым текстом.`,
    requirements: [
      'Документ начинается с <!DOCTYPE html>',
      'У <html> указан lang="ru"',
      'В <head> есть <meta charset="UTF-8">',
      'В <head> есть <meta name="viewport" content="width=device-width, initial-scale=1">',
      '<title> не равен Document',
      'На странице один <h1> с текстом «Конференции.РФ»',
      'Есть хотя бы один абзац <p>',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <!-- допишите метатеги и заголовок вкладки -->
</head>
<body>
  <!-- заголовок и абзац -->
</body>
</html>`,
    tests: [
      {
        id: 'doctype',
        name: 'Документ объявлен как HTML5',
        type: 'dom',
        code: `ctx.assert(ctx.document.doctype !== null, 'Нет <!DOCTYPE html> в начале документа');
ctx.assert(ctx.document.doctype.name.toLowerCase() === 'html', 'Тип документа должен быть html');`,
      },
      {
        id: 'lang',
        name: 'Язык страницы — русский',
        type: 'dom',
        code: `const lang = ctx.document.documentElement.getAttribute('lang');
ctx.assert(lang === 'ru', 'У <html> должен быть lang="ru", сейчас: ' + (lang || 'атрибут отсутствует'), 'ru', lang);`,
      },
      {
        id: 'charset',
        name: 'Кодировка UTF-8',
        type: 'dom',
        code: `const meta = ctx.document.querySelector('meta[charset]');
ctx.assert(meta, 'Нет <meta charset="UTF-8"> — русский текст превратится в кракозябры');
ctx.assert(meta.getAttribute('charset').toLowerCase() === 'utf-8', 'Кодировка должна быть UTF-8');`,
      },
      {
        id: 'viewport',
        name: 'Метатег viewport на месте',
        type: 'dom',
        code: `const meta = ctx.document.querySelector('meta[name="viewport"]');
ctx.assert(meta, 'Без <meta name="viewport"> адаптив под 390×844 не заработает');
const content = (meta.getAttribute('content') || '').replace(/\\s/g, '');
ctx.assert(content.includes('width=device-width'), 'В content должно быть width=device-width');
ctx.assert(content.includes('initial-scale=1'), 'В content должно быть initial-scale=1');`,
      },
      {
        id: 'title',
        name: 'Осмысленный заголовок вкладки',
        type: 'dom',
        code: `const title = (ctx.document.title || '').trim();
ctx.assert(title.length > 0, 'Тег <title> пуст');
ctx.assert(title.toLowerCase() !== 'document', 'Замените title из шаблона Emmet на осмысленный');`,
      },
      {
        id: 'h1',
        name: 'Один заголовок h1 с нужным текстом',
        type: 'dom',
        code: `const headings = ctx.$$('h1');
ctx.assert(headings.length === 1, 'На странице должен быть ровно один h1, найдено: ' + headings.length, 1, headings.length);
const text = headings[0].textContent.trim();
ctx.assert(text === 'Конференции.РФ', 'Текст h1 должен быть «Конференции.РФ»', 'Конференции.РФ', text);`,
      },
      {
        id: 'paragraph',
        name: 'Есть абзац текста',
        type: 'dom',
        code: `const paragraphs = ctx.$$('p').filter((p) => p.textContent.trim().length > 0);
ctx.assert(paragraphs.length >= 1, 'Добавьте хотя бы один непустой абзац <p>');`,
      },
    ],
    hints: [
      { level: 1, text: 'Наберите ! и нажмите Tab — Emmet создаст каркас целиком. Останется поправить lang и title.', penaltyPercent: 10 },
      { level: 2, text: 'meta charset ставится первой строкой в head, meta viewport — сразу за ней.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'В head: <meta charset="UTF-8">, <meta name="viewport" content="width=device-width, initial-scale=1">, <title>…</title>. В body: <h1>Конференции.РФ</h1> и <p>…</p>.',
        penaltyPercent: 35,
      },
    ],
    solution: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Вход — Конференции.РФ</title>
</head>
<body>
  <h1>Конференции.РФ</h1>
  <p>Бронирование помещений для всероссийских конференций.</p>
</body>
</html>`,
    solutionExplanation:
      'Порядок важен: charset идёт первым, потому что браузер начинает разбирать файл раньше, чем дочитает head. viewport обязателен для мобильной версии — без него медиазапросы не сработают.',
    maxScore: 7,
    estimatedMinutes: 10,
    examRefs: ['m2-mobile'],
    planDays: ['day-01-2'],
    source: 'plan',
  },

  {
    id: 'task-html-nav',
    title: 'Навигация и ссылка из задания экзамена',
    kind: 'function',
    runtime: 'dom',
    difficulty: 1,
    tech: ['html'],
    topicIds: ['html-links-images', 'html-semantic'],
    monthNo: 1,
    weekNo: 1,
    statement: `Сверстайте шапку страницы входа.

Внутри \`<header>\` должен быть \`<nav>\` со списком из трёх ссылок: «Главная» (\`/\`), «Оформить заявку» (\`/order\`), «Личный кабинет» (\`/cabinet\`).

Под шапкой — ссылка на регистрацию. **Её текст задан заданием демоэкзамена дословно:** «Еще не зарегистрированы? Регистрация». Именно так — без буквы «ё», с вопросительным знаком.`,
    requirements: [
      'Есть <header>, внутри него <nav>',
      'Навигация построена на списке <ul> с тремя <li>',
      'Три ссылки с адресами /, /order, /cabinet и нужными текстами',
      'Отдельная ссылка на /register с точным текстом «Еще не зарегистрированы? Регистрация»',
    ],
    starterCode: `<header>
  <!-- навигация -->
</header>

<!-- ссылка на регистрацию -->`,
    tests: [
      {
        id: 'header-nav',
        name: 'Шапка с навигацией',
        type: 'dom',
        code: `const header = ctx.$('header');
ctx.assert(header, 'Нет тега <header>');
ctx.assert(header.querySelector('nav'), 'Внутри <header> должен быть <nav>');`,
      },
      {
        id: 'list',
        name: 'Навигация построена на списке',
        type: 'dom',
        code: `const items = ctx.$$('header nav ul li');
ctx.assert(items.length === 3, 'В списке навигации должно быть три пункта, найдено: ' + items.length, 3, items.length);`,
      },
      {
        id: 'links',
        name: 'Три ссылки с нужными адресами и текстами',
        type: 'dom',
        code: `const expected = [
  { href: '/', text: 'Главная' },
  { href: '/order', text: 'Оформить заявку' },
  { href: '/cabinet', text: 'Личный кабинет' },
];
const links = ctx.$$('header nav a');
ctx.assert(links.length === 3, 'Ожидалось три ссылки в навигации, найдено: ' + links.length);
expected.forEach((item) => {
  const found = links.find((a) => a.getAttribute('href') === item.href);
  ctx.assert(found, 'Нет ссылки с href="' + item.href + '"');
  ctx.assert(found.textContent.trim() === item.text, 'Текст ссылки ' + item.href + ' должен быть «' + item.text + '»', item.text, found.textContent.trim());
});`,
      },
      {
        id: 'register-link',
        name: 'Точный текст ссылки на регистрацию',
        type: 'dom',
        code: `const link = ctx.$$('a').find((a) => a.getAttribute('href') === '/register');
ctx.assert(link, 'Нет ссылки на /register');
const text = link.textContent.replace(/\\s+/g, ' ').trim();
const expected = 'Еще не зарегистрированы? Регистрация';
ctx.assert(text === expected, 'Текст должен совпадать с заданием дословно', expected, text);`,
        points: 2,
      },
    ],
    hints: [
      { level: 1, text: 'Меню — это <ul> внутри <nav>, каждый пункт — <li> со ссылкой внутри.', penaltyPercent: 10 },
      { level: 2, text: 'Скопируйте текст ссылки прямо из условия: «Еще» пишется без буквы «ё».', penaltyPercent: 20 },
      {
        level: 3,
        text: '<header><nav><ul><li><a href="/">Главная</a></li>…</ul></nav></header>, ниже — <a href="/register">Еще не зарегистрированы? Регистрация</a>.',
        penaltyPercent: 35,
      },
    ],
    solution: `<header>
  <nav>
    <ul>
      <li><a href="/">Главная</a></li>
      <li><a href="/order">Оформить заявку</a></li>
      <li><a href="/cabinet">Личный кабинет</a></li>
    </ul>
  </nav>
</header>

<a href="/register">Еще не зарегистрированы? Регистрация</a>`,
    solutionExplanation:
      'Текст ссылки на регистрацию проверяется дословно, потому что так он записан в задании демоэкзамена. Это один из самых дешёвых баллов — и самый обидный, если его потерять из-за буквы «ё».',
    maxScore: 5,
    estimatedMinutes: 12,
    examRefs: ['m1-login'],
    planDays: ['day-01-3'],
    source: 'plan',
  },

  {
    id: 'task-html-table',
    title: 'Таблица заявок для админки',
    kind: 'function',
    runtime: 'dom',
    difficulty: 2,
    tech: ['html'],
    topicIds: ['html-semantic'],
    monthNo: 1,
    weekNo: 1,
    statement: `Постройте таблицу всех заявок — основу будущей панели администратора.

Колонки: **№**, **Помещение**, **Дата**, **Статус**. Заполните тремя строками с любыми правдоподобными данными, но обязательно используйте настоящие статусы из задания экзамена: «Новая», «Мероприятие назначено», «Мероприятие завершено».

Даты пишите в формате ДД.ММ.ГГГГ — именно он требуется на экзамене.`,
    requirements: [
      'Таблица разделена на <thead> и <tbody>',
      'Четыре заголовка столбцов в <th> с атрибутом scope="col"',
      'Три строки данных в <tbody>',
      'В таблице встречаются все три статуса из задания',
      'Даты в формате ДД.ММ.ГГГГ',
    ],
    starterCode: `<table>
  <!-- шапка и тело таблицы -->
</table>`,
    tests: [
      {
        id: 'structure',
        name: 'Таблица разделена на thead и tbody',
        type: 'dom',
        code: `ctx.assert(ctx.$('table'), 'Нет тега <table>');
ctx.assert(ctx.$('table thead'), 'Нет <thead> — шапка таблицы должна быть отделена');
ctx.assert(ctx.$('table tbody'), 'Нет <tbody>');`,
      },
      {
        id: 'headers',
        name: 'Четыре заголовка столбцов',
        type: 'dom',
        code: `const headers = ctx.$$('table thead th');
ctx.assert(headers.length === 4, 'Ожидалось четыре <th>, найдено: ' + headers.length, 4, headers.length);
const titles = headers.map((th) => th.textContent.trim());
['№', 'Помещение', 'Дата', 'Статус'].forEach((name, index) => {
  ctx.assert(titles[index] === name, 'Заголовок ' + (index + 1) + ' должен быть «' + name + '»', name, titles[index]);
});`,
      },
      {
        id: 'scope',
        name: 'У заголовков указан scope="col"',
        type: 'dom',
        code: `const headers = ctx.$$('table thead th');
const withScope = headers.filter((th) => th.getAttribute('scope') === 'col');
ctx.assert(withScope.length === headers.length, 'scope="col" нужен всем заголовкам столбцов: это требование доступности');`,
      },
      {
        id: 'rows',
        name: 'Три строки данных',
        type: 'dom',
        code: `const rows = ctx.$$('table tbody tr');
ctx.assert(rows.length === 3, 'В tbody должно быть три строки, найдено: ' + rows.length, 3, rows.length);
rows.forEach((row, index) => {
  const cells = row.querySelectorAll('td');
  ctx.assert(cells.length === 4, 'В строке ' + (index + 1) + ' должно быть четыре ячейки <td>');
});`,
      },
      {
        id: 'statuses',
        name: 'Использованы все три статуса из задания',
        type: 'dom',
        code: `const text = ctx.$('table tbody').textContent;
['Новая', 'Мероприятие назначено', 'Мероприятие завершено'].forEach((status) => {
  ctx.assert(text.includes(status), 'В таблице не найден статус «' + status + '»');
});`,
        points: 2,
      },
      {
        id: 'dates',
        name: 'Даты в формате ДД.ММ.ГГГГ',
        type: 'dom',
        code: `const rows = ctx.$$('table tbody tr');
const pattern = /^\\d{2}\\.\\d{2}\\.\\d{4}$/;
rows.forEach((row, index) => {
  const value = row.querySelectorAll('td')[2].textContent.trim();
  ctx.assert(pattern.test(value), 'Дата в строке ' + (index + 1) + ' должна быть в формате ДД.ММ.ГГГГ', '14.09.2026', value);
});`,
      },
    ],
    hints: [
      { level: 1, text: 'Emmet: table>thead>tr>th*4 создаст шапку за одно нажатие Tab.', penaltyPercent: 10 },
      { level: 2, text: 'scope="col" ставится каждому <th> в шапке: <th scope="col">Дата</th>.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'Строка данных выглядит так: <tr><td>1</td><td>Коворкинг</td><td>14.09.2026</td><td>Новая</td></tr>.',
        penaltyPercent: 35,
      },
    ],
    solution: `<table>
  <thead>
    <tr>
      <th scope="col">№</th>
      <th scope="col">Помещение</th>
      <th scope="col">Дата</th>
      <th scope="col">Статус</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Аудитория</td><td>14.09.2026</td><td>Новая</td></tr>
    <tr><td>2</td><td>Коворкинг</td><td>21.09.2026</td><td>Мероприятие назначено</td></tr>
    <tr><td>3</td><td>Кинозал</td><td>28.09.2026</td><td>Мероприятие завершено</td></tr>
  </tbody>
</table>`,
    solutionExplanation:
      'Статусы пишутся дословно, как в задании. На экзамене этот же список попадёт в базу данных и в выпадающий список админки — заведите его один раз и переиспользуйте.',
    maxScore: 7,
    estimatedMinutes: 15,
    examRefs: ['m1-admin', 'm2-order-form'],
    planDays: ['day-01-5'],
    source: 'plan',
  },

  {
    id: 'task-html-register-form',
    title: 'Форма регистрации по требованиям экзамена',
    kind: 'function',
    runtime: 'dom',
    difficulty: 2,
    tech: ['html'],
    topicIds: ['html-forms'],
    monthNo: 1,
    weekNo: 2,
    statement: `Сверстайте форму регистрации точно по требованиям задания демоэкзамена.

Пять обязательных полей: **логин, пароль, ФИО, телефон, e-mail**. У каждого поля — своя подпись \`<label>\`, связанная с полем через \`for\`/\`id\`.

Ограничения из задания: логин — латинские буквы и цифры, минимум 6 символов; пароль — минимум 8 символов. Задайте их атрибутами \`pattern\` и \`minlength\`.`,
    requirements: [
      'Пять полей с атрибутами name: login, password, fullName, phone, email',
      'Правильные типы полей: password, tel, email',
      'У каждого поля есть <label for> и совпадающий id',
      'Все поля обязательны (required)',
      'У логина pattern только из латиницы и цифр и minlength="6"',
      'У пароля minlength="8"',
      'Есть кнопка отправки',
    ],
    starterCode: `<form id="register-form">
  <!-- пять полей с подписями -->

  <button type="submit">Зарегистрироваться</button>
</form>`,
    tests: [
      {
        id: 'fields',
        name: 'Все пять полей на месте',
        type: 'dom',
        code: `const names = ['login', 'password', 'fullName', 'phone', 'email'];
names.forEach((name) => {
  const field = ctx.$('[name="' + name + '"]');
  ctx.assert(field, 'Нет поля с name="' + name + '"');
});`,
        points: 2,
      },
      {
        id: 'types',
        name: 'Правильные типы полей',
        type: 'dom',
        code: `const expected = { password: 'password', phone: 'tel', email: 'email' };
Object.keys(expected).forEach((name) => {
  const field = ctx.$('[name="' + name + '"]');
  ctx.assert(field, 'Нет поля ' + name);
  ctx.assert(field.type === expected[name], 'У поля ' + name + ' должен быть type="' + expected[name] + '"', expected[name], field.type);
});`,
      },
      {
        id: 'labels',
        name: 'У каждого поля есть связанная подпись',
        type: 'dom',
        code: `const names = ['login', 'password', 'fullName', 'phone', 'email'];
names.forEach((name) => {
  const field = ctx.$('[name="' + name + '"]');
  ctx.assert(field.id, 'У поля ' + name + ' нет id — label не с чем связать');
  const label = ctx.$('label[for="' + field.id + '"]');
  ctx.assert(label, 'Нет <label for="' + field.id + '"> для поля ' + name);
  ctx.assert(label.textContent.trim().length > 0, 'Подпись поля ' + name + ' пустая');
});`,
        points: 2,
      },
      {
        id: 'required',
        name: 'Все поля обязательны',
        type: 'dom',
        code: `const names = ['login', 'password', 'fullName', 'phone', 'email'];
names.forEach((name) => {
  const field = ctx.$('[name="' + name + '"]');
  ctx.assert(field.hasAttribute('required'), 'Поле ' + name + ' должно быть обязательным: задание требует ввод всех полей');
});`,
      },
      {
        id: 'login-rules',
        name: 'Ограничения логина: латиница, цифры, от 6 символов',
        type: 'dom',
        code: `const field = ctx.$('[name="login"]');
ctx.assert(field.getAttribute('minlength') === '6', 'У логина должен быть minlength="6"', '6', field.getAttribute('minlength'));
const pattern = field.getAttribute('pattern');
ctx.assert(pattern, 'У логина нет атрибута pattern');
const regexp = new RegExp('^(?:' + pattern + ')$');
ctx.assert(regexp.test('ivanov26'), 'Логин ivanov26 должен проходить проверку');
ctx.assert(!regexp.test('иванов26'), 'Кириллица не должна проходить проверку');
ctx.assert(!regexp.test('ivan'), 'Логин короче 6 символов не должен проходить проверку');
ctx.assert(!regexp.test('ivanov 26'), 'Пробел не должен проходить проверку');`,
        points: 3,
      },
      {
        id: 'password-rules',
        name: 'Пароль не короче 8 символов',
        type: 'dom',
        code: `const field = ctx.$('[name="password"]');
ctx.assert(field.getAttribute('minlength') === '8', 'У пароля должен быть minlength="8"', '8', field.getAttribute('minlength'));`,
      },
      {
        id: 'submit',
        name: 'Есть кнопка отправки',
        type: 'dom',
        code: `const button = ctx.$('form button[type="submit"], form input[type="submit"]');
ctx.assert(button, 'Нет кнопки отправки формы');`,
      },
    ],
    hints: [
      { level: 1, text: 'Каждое поле — это пара label + input. Атрибут for у label равен id поля.', penaltyPercent: 10 },
      { level: 2, text: 'Регулярное выражение для логина: [A-Za-z0-9]{6,}. В атрибуте pattern символы ^ и $ не нужны.', penaltyPercent: 20 },
      {
        level: 3,
        text: '<label for="login">Логин</label><input type="text" id="login" name="login" required minlength="6" pattern="[A-Za-z0-9]{6,}">',
        penaltyPercent: 35,
      },
    ],
    solution: `<form id="register-form">
  <div>
    <label for="login">Логин</label>
    <input type="text" id="login" name="login" required minlength="6" pattern="[A-Za-z0-9]{6,}">
  </div>
  <div>
    <label for="password">Пароль</label>
    <input type="password" id="password" name="password" required minlength="8">
  </div>
  <div>
    <label for="fullName">ФИО</label>
    <input type="text" id="fullName" name="fullName" required>
  </div>
  <div>
    <label for="phone">Телефон</label>
    <input type="tel" id="phone" name="phone" required>
  </div>
  <div>
    <label for="email">E-mail</label>
    <input type="email" id="email" name="email" required>
  </div>

  <button type="submit">Зарегистрироваться</button>
</form>`,
    solutionExplanation:
      'Атрибуты required, minlength и pattern дают первый рубеж проверки бесплатно. На экзамене этого недостаточно: модуль 2 требует свои подсказки рядом с полями, а сервер обязан перепроверить всё заново.',
    maxScore: 11,
    estimatedMinutes: 20,
    examRefs: ['m1-register', 'm2-register-hints'],
    planDays: ['day-02-1'],
    source: 'plan',
  },

  {
    id: 'task-css-selectors',
    title: 'Селекторы CSS: попасть точно в цель',
    kind: 'complete',
    runtime: 'dom',
    difficulty: 2,
    tech: ['css'],
    topicIds: ['css-basics'],
    monthNo: 1,
    weekNo: 2,
    statement: `В разметке уже есть карточки заявок. Допишите CSS так, чтобы:

1. у всех карточек (\`.card\`) был внутренний отступ 16px и скругление 10px;
2. заголовки **внутри** карточек (\`h3\`) были синими (\`#2563eb\`);
3. бейдж со статусом «Новая» (\`.badge--new\`) имел фон \`#dbeafe\`;
4. последняя карточка не имела нижнего внешнего отступа.

Меняйте только содержимое тега \`<style>\` — разметку не трогайте.`,
    requirements: [
      'Селектор по классу для .card: padding: 16px и border-radius: 10px',
      'Селектор потомка для заголовков внутри карточки',
      'Селектор по классу для .badge--new',
      'Псевдокласс :last-child для последней карточки',
    ],
    starterCode: `<style>
/* допишите правила здесь */

</style>

<div class="list">
  <article class="card">
    <h3>Аудитория</h3>
    <p>14.09.2026</p>
    <span class="badge badge--new">Новая</span>
  </article>
  <article class="card">
    <h3>Коворкинг</h3>
    <p>21.09.2026</p>
    <span class="badge badge--done">Мероприятие завершено</span>
  </article>
  <article class="card">
    <h3>Кинозал</h3>
    <p>28.09.2026</p>
    <span class="badge badge--new">Новая</span>
  </article>
</div>`,
    tests: [
      {
        id: 'card-padding',
        name: 'Отступ и скругление карточки',
        type: 'dom',
        code: `const card = ctx.$('.card');
ctx.assert(ctx.css(card, 'padding-top') === '16px', 'padding карточки должен быть 16px', '16px', ctx.css(card, 'padding-top'));
ctx.assert(ctx.css(card, 'border-top-left-radius') === '10px', 'border-radius должен быть 10px', '10px', ctx.css(card, 'border-top-left-radius'));`,
        points: 2,
      },
      {
        id: 'heading-color',
        name: 'Заголовки внутри карточек синие',
        type: 'dom',
        code: `const heading = ctx.$('.card h3');
const color = ctx.css(heading, 'color');
ctx.assert(color === 'rgb(37, 99, 235)', 'Цвет заголовка должен быть #2563eb', 'rgb(37, 99, 235)', color);
const outside = ctx.document.createElement('h3');
ctx.document.body.appendChild(outside);
const outsideColor = ctx.css(outside, 'color');
outside.remove();
ctx.assert(outsideColor !== 'rgb(37, 99, 235)', 'Правило должно действовать только внутри .card — используйте селектор потомка');`,
        points: 2,
      },
      {
        id: 'badge-new',
        name: 'Фон бейджа «Новая»',
        type: 'dom',
        code: `const badge = ctx.$('.badge--new');
const background = ctx.css(badge, 'background-color');
ctx.assert(background === 'rgb(219, 234, 254)', 'Фон .badge--new должен быть #dbeafe', 'rgb(219, 234, 254)', background);
const other = ctx.$('.badge--done');
ctx.assert(ctx.css(other, 'background-color') !== 'rgb(219, 234, 254)', 'Фон не должен задеть другие бейджи');`,
        points: 2,
      },
      {
        id: 'last-child',
        name: 'У последней карточки нет нижнего отступа',
        type: 'dom',
        code: `const cards = ctx.$$('.card');
const last = cards[cards.length - 1];
ctx.assert(ctx.css(last, 'margin-bottom') === '0px', 'У последней карточки margin-bottom должен быть 0', '0px', ctx.css(last, 'margin-bottom'));
ctx.assert(ctx.css(cards[0], 'margin-bottom') !== '0px', 'У остальных карточек нижний отступ должен остаться — задайте его в .card');`,
        points: 2,
      },
    ],
    hints: [
      { level: 1, text: 'Точка — это класс, пробел между селекторами означает «внутри».', penaltyPercent: 10 },
      { level: 2, text: 'Чтобы у последней карточки убрать отступ, используйте .card:last-child { margin-bottom: 0; }', penaltyPercent: 20 },
      {
        level: 3,
        text: '.card { padding: 16px; border-radius: 10px; margin-bottom: 12px; } .card h3 { color: #2563eb; } .badge--new { background: #dbeafe; } .card:last-child { margin-bottom: 0; }',
        penaltyPercent: 35,
      },
    ],
    solution: `<style>
.card {
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 12px;
  border: 1px solid #e5e7eb;
}

.card h3 { color: #2563eb; }

.badge--new { background: #dbeafe; }

.card:last-child { margin-bottom: 0; }
</style>

<div class="list">
  <article class="card">
    <h3>Аудитория</h3>
    <p>14.09.2026</p>
    <span class="badge badge--new">Новая</span>
  </article>
  <article class="card">
    <h3>Коворкинг</h3>
    <p>21.09.2026</p>
    <span class="badge badge--done">Мероприятие завершено</span>
  </article>
  <article class="card">
    <h3>Кинозал</h3>
    <p>28.09.2026</p>
    <span class="badge badge--new">Новая</span>
  </article>
</div>`,
    solutionExplanation:
      'Селектор потомка `.card h3` действует только внутри карточек, поэтому заголовки в других частях страницы не изменятся. Псевдокласс :last-child избавляет от лишнего отступа в конце списка — приём, который пригодится в каждом списке заявок.',
    maxScore: 8,
    estimatedMinutes: 15,
    examRefs: ['m2-design'],
    planDays: ['day-02-3'],
    source: 'plan',
  },

  {
    id: 'task-css-card',
    title: 'Карточка формы входа по центру',
    kind: 'output',
    runtime: 'dom',
    difficulty: 2,
    tech: ['css'],
    topicIds: ['css-box-model'],
    monthNo: 1,
    weekNo: 2,
    statement: `Оформите форму входа как карточку по центру страницы — задание дня 5 недели 2 учебной программы.

Требования к карточке \`.auth-card\`:
- ширина 100%, но не больше 380px;
- выравнивание по центру по горизонтали;
- внутренний отступ 24px, рамка 1px сплошная \`#e5e7eb\`, скругление 12px;
- \`box-sizing: border-box\` для всех элементов (иначе padding раздует карточку).

Поля ввода занимают всю ширину карточки.`,
    requirements: [
      'Правило * { box-sizing: border-box; }',
      '.auth-card: max-width 380px, ширина 100%',
      'Карточка центрирована по горизонтали',
      'padding 24px, border 1px solid #e5e7eb, border-radius 12px',
      'Поля ввода шириной 100%',
    ],
    starterCode: `<style>
/* ваши стили */

</style>

<div class="auth-card">
  <h2>Вход в систему</h2>
  <label for="login">Логин</label>
  <input type="text" id="login" name="login">
  <label for="password">Пароль</label>
  <input type="password" id="password" name="password">
  <button type="submit">Войти</button>
</div>`,
    viewport: { width: 900, height: 700 },
    tests: [
      {
        id: 'border-box',
        name: 'box-sizing: border-box задан всем элементам',
        type: 'dom',
        code: `const card = ctx.$('.auth-card');
ctx.assert(ctx.css(card, 'box-sizing') === 'border-box', 'У карточки должен быть box-sizing: border-box');
const probe = ctx.document.createElement('div');
ctx.document.body.appendChild(probe);
const value = ctx.css(probe, 'box-sizing');
probe.remove();
ctx.assert(value === 'border-box', 'Правило * { box-sizing: border-box; } должно действовать на все элементы', 'border-box', value);`,
        points: 2,
      },
      {
        id: 'width',
        name: 'Ширина ограничена 380px',
        type: 'dom',
        code: `const card = ctx.$('.auth-card');
ctx.assert(ctx.css(card, 'max-width') === '380px', 'max-width должен быть 380px', '380px', ctx.css(card, 'max-width'));
const rect = card.getBoundingClientRect();
ctx.assert(Math.round(rect.width) <= 380, 'Фактическая ширина карточки больше 380px: ' + Math.round(rect.width));`,
        points: 2,
      },
      {
        id: 'centered',
        name: 'Карточка стоит по центру',
        type: 'dom',
        code: `const card = ctx.$('.auth-card');
const rect = card.getBoundingClientRect();
const leftGap = rect.left;
const rightGap = ctx.window.innerWidth - rect.right;
ctx.assert(Math.abs(leftGap - rightGap) < 4, 'Отступы слева и справа должны совпадать (сейчас ' + Math.round(leftGap) + ' и ' + Math.round(rightGap) + '). Используйте margin-inline: auto');`,
        points: 2,
      },
      {
        id: 'decor',
        name: 'Отступ, рамка и скругление',
        type: 'dom',
        code: `const card = ctx.$('.auth-card');
ctx.assert(ctx.css(card, 'padding-top') === '24px', 'padding должен быть 24px', '24px', ctx.css(card, 'padding-top'));
ctx.assert(ctx.css(card, 'border-top-width') === '1px', 'Нужна рамка толщиной 1px');
ctx.assert(ctx.css(card, 'border-top-style') === 'solid', 'Стиль рамки — solid');
ctx.assert(ctx.css(card, 'border-top-color') === 'rgb(229, 231, 235)', 'Цвет рамки — #e5e7eb', 'rgb(229, 231, 235)', ctx.css(card, 'border-top-color'));
ctx.assert(ctx.css(card, 'border-top-left-radius') === '12px', 'Скругление — 12px');`,
        points: 2,
      },
      {
        id: 'inputs',
        name: 'Поля растянуты по ширине карточки',
        type: 'dom',
        code: `const card = ctx.$('.auth-card');
const cardWidth = card.getBoundingClientRect().width - 48; // минус padding
const inputs = ctx.$$('.auth-card input');
inputs.forEach((input) => {
  const width = input.getBoundingClientRect().width;
  ctx.assert(Math.abs(width - cardWidth) < 3, 'Поле должно занимать всю ширину карточки: ожидалось ≈' + Math.round(cardWidth) + 'px, получено ' + Math.round(width) + 'px');
});`,
        points: 2,
      },
    ],
    hints: [
      { level: 1, text: 'Центрирование блока с заданной шириной — margin-inline: auto (или margin: 0 auto).', penaltyPercent: 10 },
      { level: 2, text: 'Без * { box-sizing: border-box } padding добавится к ширине, и карточка станет шире 380px.', penaltyPercent: 20 },
      {
        level: 3,
        text: '.auth-card { width: 100%; max-width: 380px; margin: 48px auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; } .auth-card input { width: 100%; }',
        penaltyPercent: 35,
      },
    ],
    solution: `<style>
* { box-sizing: border-box; }

.auth-card {
  width: 100%;
  max-width: 380px;
  margin: 48px auto;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
}

.auth-card input {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}
</style>

<div class="auth-card">
  <h2>Вход в систему</h2>
  <label for="login">Логин</label>
  <input type="text" id="login" name="login">
  <label for="password">Пароль</label>
  <input type="password" id="password" name="password">
  <button type="submit">Войти</button>
</div>`,
    solutionExplanation:
      'Связка width: 100% + max-width делает карточку адаптивной: на десктопе она ровно 380px, а на экране 390px занимает всю доступную ширину с учётом отступов. Это базовый приём для всех форм экзамена.',
    maxScore: 10,
    estimatedMinutes: 20,
    examRefs: ['m2-design', 'm2-mobile'],
    planDays: ['day-02-5'],
    source: 'plan',
  },

  {
    id: 'task-css-navbar',
    title: 'Шапка на flexbox: логотип слева, меню справа',
    kind: 'output',
    runtime: 'dom',
    difficulty: 2,
    tech: ['css'],
    topicIds: ['css-flexbox'],
    monthNo: 1,
    weekNo: 3,
    statement: `Соберите шапку сайта на flexbox — задание дня 1 недели 3.

Логотип должен стоять слева, меню — справа, всё выровнено по вертикали по центру. Пункты меню разделены промежутком 20px, маркеры списка убраны.`,
    requirements: [
      '.navbar — flex-контейнер',
      'Логотип слева, меню справа (space-between)',
      'Выравнивание по вертикали по центру',
      '.navbar__menu — тоже flex, промежуток 20px',
      'У списка меню убраны маркеры и отступы по умолчанию',
    ],
    starterCode: `<style>
/* ваши стили */

</style>

<header class="navbar">
  <a class="navbar__logo" href="/">Конференции.РФ</a>
  <ul class="navbar__menu">
    <li><a href="/order">Заявка</a></li>
    <li><a href="/cabinet">Кабинет</a></li>
    <li><a href="/login">Выход</a></li>
  </ul>
</header>`,
    viewport: { width: 900, height: 500 },
    tests: [
      {
        id: 'flex',
        name: 'Шапка — flex-контейнер',
        type: 'dom',
        code: `const navbar = ctx.$('.navbar');
ctx.assert(ctx.css(navbar, 'display') === 'flex', 'display шапки должен быть flex', 'flex', ctx.css(navbar, 'display'));`,
      },
      {
        id: 'space-between',
        name: 'Логотип слева, меню справа',
        type: 'dom',
        // Отсчитываем от внутренних границ: собственный отступ шапки
        // не должен считаться «неприжатостью».
        code: `const navbar = ctx.$('.navbar');
const logo = ctx.$('.navbar__logo').getBoundingClientRect();
const menu = ctx.$('.navbar__menu').getBoundingClientRect();
const box = navbar.getBoundingClientRect();
const padLeft = parseFloat(ctx.css(navbar, 'padding-left'));
const padRight = parseFloat(ctx.css(navbar, 'padding-right'));
ctx.assert(
  logo.left - box.left <= padLeft + 1,
  'Логотип должен прижиматься к левому краю: сейчас до него ' + Math.round(logo.left - box.left) + 'px при отступе шапки ' + padLeft + 'px',
);
ctx.assert(
  box.right - menu.right <= padRight + 1,
  'Меню должно прижиматься к правому краю (space-between): сейчас справа ' + Math.round(box.right - menu.right) + 'px при отступе ' + padRight + 'px',
);`,
        points: 2,
      },
      {
        id: 'align',
        name: 'Выравнивание по вертикали',
        type: 'dom',
        code: `const value = ctx.css('.navbar', 'align-items');
ctx.assert(value === 'center', 'align-items должен быть center', 'center', value);`,
      },
      {
        id: 'menu-flex',
        name: 'Меню выстроено в ряд с промежутком 20px',
        type: 'dom',
        code: `const menu = ctx.$('.navbar__menu');
ctx.assert(ctx.css(menu, 'display') === 'flex', 'Меню тоже должно быть flex-контейнером');
const gap = ctx.css(menu, 'column-gap');
ctx.assert(gap === '20px', 'Промежуток между пунктами — 20px', '20px', gap);
const items = ctx.$$('.navbar__menu li');
ctx.assert(items[0].getBoundingClientRect().top === items[1].getBoundingClientRect().top, 'Пункты меню должны стоять в одну строку');`,
        points: 2,
      },
      {
        id: 'list-reset',
        name: 'Маркеры и отступы списка убраны',
        type: 'dom',
        code: `const menu = ctx.$('.navbar__menu');
ctx.assert(ctx.css(menu, 'list-style-type') === 'none', 'Уберите маркеры: list-style: none');
ctx.assert(ctx.css(menu, 'padding-left') === '0px', 'Уберите отступ списка по умолчанию: padding: 0', '0px', ctx.css(menu, 'padding-left'));
ctx.assert(ctx.css(menu, 'margin-top') === '0px', 'Уберите внешний отступ списка: margin: 0');`,
        points: 2,
      },
    ],
    hints: [
      { level: 1, text: 'justify-content: space-between прижимает первый элемент к левому краю, последний — к правому.', penaltyPercent: 10 },
      { level: 2, text: 'У <ul> по умолчанию есть padding-left и margin — их надо обнулить.', penaltyPercent: 20 },
      {
        level: 3,
        text: '.navbar { display: flex; justify-content: space-between; align-items: center; } .navbar__menu { display: flex; gap: 20px; list-style: none; margin: 0; padding: 0; }',
        penaltyPercent: 35,
      },
    ],
    solution: `<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.navbar__logo { font-weight: 600; }

.navbar__menu {
  display: flex;
  gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>

<header class="navbar">
  <a class="navbar__logo" href="/">Конференции.РФ</a>
  <ul class="navbar__menu">
    <li><a href="/order">Заявка</a></li>
    <li><a href="/cabinet">Кабинет</a></li>
    <li><a href="/login">Выход</a></li>
  </ul>
</header>`,
    solutionExplanation:
      'Это самая частая раскладка в проекте: та же пара space-between + align-items: center пригодится в строке заявки, в шапке карточки и в подвале формы.',
    maxScore: 8,
    estimatedMinutes: 18,
    examRefs: ['m2-design', 'm2-mobile'],
    planDays: ['day-03-1'],
    source: 'plan',
  },

  {
    id: 'task-css-grid-cards',
    title: 'Адаптивная сетка карточек помещений',
    kind: 'output',
    runtime: 'dom',
    difficulty: 3,
    tech: ['css'],
    topicIds: ['css-grid', 'css-responsive'],
    monthNo: 1,
    weekNo: 3,
    statement: `Сделайте сетку карточек помещений, которая сама подстраивается под ширину экрана — **без единого медиазапроса**.

На широком экране карточки стоят в несколько колонок, на узком — в одну. Минимальная ширина карточки 260px, промежуток 16px.

Проверка запускается в окне шириной 900px: при таких условиях должно получиться три колонки.`,
    requirements: [
      '.rooms — grid-контейнер',
      'Колонки заданы через repeat(auto-fit, minmax(260px, 1fr))',
      'Промежуток 16px',
      'Медиазапросы не используются',
    ],
    starterCode: `<style>
/* ваши стили */

</style>

<div class="rooms">
  <article class="room">Аудитория</article>
  <article class="room">Коворкинг</article>
  <article class="room">Кинозал</article>
</div>`,
    viewport: { width: 900, height: 600 },
    tests: [
      {
        id: 'grid',
        name: 'Контейнер использует grid',
        type: 'dom',
        code: `const value = ctx.css('.rooms', 'display');
ctx.assert(value === 'grid', 'display должен быть grid', 'grid', value);`,
      },
      {
        id: 'gap',
        name: 'Промежуток 16px',
        type: 'dom',
        code: `const gap = ctx.css('.rooms', 'column-gap');
ctx.assert(gap === '16px', 'gap должен быть 16px', '16px', gap);`,
      },
      {
        id: 'columns',
        name: 'На ширине 900px получилось три колонки',
        type: 'dom',
        code: `const cards = ctx.$$('.room');
const firstTop = cards[0].getBoundingClientRect().top;
const sameRow = cards.filter((card) => Math.abs(card.getBoundingClientRect().top - firstTop) < 2);
ctx.assert(sameRow.length === 3, 'Все три карточки должны поместиться в один ряд, в ряду: ' + sameRow.length, 3, sameRow.length);`,
        points: 2,
      },
      {
        id: 'minmax',
        name: 'Колонки описаны через minmax, а не фиксированной шириной',
        type: 'dom',
        code: `const source = ctx.source.replace(/\\s+/g, ' ');
ctx.assert(/repeat\\(\\s*auto-fit\\s*,\\s*minmax\\(\\s*260px\\s*,\\s*1fr\\s*\\)\\s*\\)/i.test(source), 'Используйте repeat(auto-fit, minmax(260px, 1fr)) — именно эта запись делает сетку адаптивной');
ctx.assert(!/@media/i.test(source), 'Медиазапросы в этом задании не нужны — сетка должна адаптироваться сама');`,
        points: 2,
      },
      {
        id: 'no-overflow',
        name: 'Сетка не выходит за пределы окна',
        type: 'dom',
        code: `const rooms = ctx.$('.rooms');
ctx.assert(rooms.scrollWidth <= ctx.window.innerWidth + 1, 'Сетка шире окна: появится горизонтальная прокрутка');`,
      },
    ],
    hints: [
      { level: 1, text: 'auto-fit сам решает, сколько колонок поместится; minmax задаёт минимальную и максимальную ширину.', penaltyPercent: 10 },
      { level: 2, text: 'Единица fr учитывает gap, а проценты — нет. Поэтому 1fr, а не 33%.', penaltyPercent: 20 },
      {
        level: 3,
        text: '.rooms { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }',
        penaltyPercent: 35,
      },
    ],
    solution: `<style>
.rooms {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.room {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}
</style>

<div class="rooms">
  <article class="room">Аудитория</article>
  <article class="room">Коворкинг</article>
  <article class="room">Кинозал</article>
</div>`,
    solutionExplanation:
      'Одна строка заменяет три медиазапроса. На экзамене это экономит время: карточки помещений и список заявок адаптируются сами, а вы занимаетесь функциональностью.',
    maxScore: 7,
    estimatedMinutes: 20,
    examRefs: ['m2-mobile', 'm3-mobile'],
    planDays: ['day-03-3'],
    source: 'plan',
  },

  {
    id: 'task-css-badge',
    title: 'Бейдж статуса в углу карточки',
    kind: 'output',
    runtime: 'dom',
    difficulty: 2,
    tech: ['css'],
    topicIds: ['css-position'],
    monthNo: 1,
    weekNo: 3,
    statement: `Разместите бейдж со статусом заявки в правом верхнем углу карточки.

Бейдж должен находиться внутри карточки: 8px от верхнего края и 8px от правого — независимо от длины текста.`,
    requirements: [
      'У карточки position: relative',
      'У бейджа position: absolute',
      'Бейдж отстоит на 8px сверху и справа',
    ],
    starterCode: `<style>
.card {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin: 40px;
}

/* допишите позиционирование */

</style>

<article class="card">
  <span class="card__badge">Новая</span>
  <h3>Коворкинг</h3>
  <p>14.09.2026 · Банковская карта</p>
</article>`,
    viewport: { width: 800, height: 500 },
    tests: [
      {
        id: 'relative',
        name: 'Карточка — точка отсчёта',
        type: 'dom',
        code: `const value = ctx.css('.card', 'position');
ctx.assert(value === 'relative', 'У карточки должен быть position: relative, иначе бейдж улетит в угол страницы', 'relative', value);`,
      },
      {
        id: 'absolute',
        name: 'Бейдж позиционирован абсолютно',
        type: 'dom',
        code: `const value = ctx.css('.card__badge', 'position');
ctx.assert(value === 'absolute', 'У бейджа должен быть position: absolute', 'absolute', value);`,
      },
      {
        id: 'placement',
        name: 'Бейдж стоит в правом верхнем углу',
        type: 'dom',
        code: `const card = ctx.$('.card').getBoundingClientRect();
const badge = ctx.$('.card__badge').getBoundingClientRect();
const top = badge.top - card.top;
const right = card.right - badge.right;
ctx.assert(Math.abs(top - 8) < 2, 'Отступ сверху должен быть 8px, получилось ' + Math.round(top) + 'px', '8px', Math.round(top) + 'px');
ctx.assert(Math.abs(right - 8) < 2, 'Отступ справа должен быть 8px, получилось ' + Math.round(right) + 'px', '8px', Math.round(right) + 'px');`,
        points: 3,
      },
      {
        id: 'inside',
        name: 'Бейдж остаётся внутри карточки',
        type: 'dom',
        code: `const card = ctx.$('.card').getBoundingClientRect();
const badge = ctx.$('.card__badge').getBoundingClientRect();
ctx.assert(badge.right <= card.right + 1 && badge.top >= card.top - 1, 'Бейдж выходит за границы карточки');`,
      },
    ],
    hints: [
      { level: 1, text: 'absolute ищет ближайшего предка с position, отличным от static.', penaltyPercent: 10 },
      { level: 2, text: 'Задайте .card { position: relative; }, а бейджу — top: 8px; right: 8px;', penaltyPercent: 20 },
      {
        level: 3,
        text: '.card { position: relative; } .card__badge { position: absolute; top: 8px; right: 8px; }',
        penaltyPercent: 35,
      },
    ],
    solution: `<style>
.card { position: relative; }

.card__badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 10px;
  border-radius: 999px;
  background: #dbeafe;
  color: #1e40af;
  font-size: 12px;
}
</style>

<article class="card">
  <span class="card__badge">Новая</span>
  <h3>Коворкинг</h3>
  <p>14.09.2026 · Банковская карта</p>
</article>`,
    solutionExplanation:
      'Пара relative + absolute — стандартный приём: так же ставятся иконка в поле ввода, крестик в модальном окне и счётчик уведомлений.',
    maxScore: 6,
    estimatedMinutes: 15,
    examRefs: ['m2-design'],
    planDays: ['day-03-4'],
    source: 'plan',
  },

  {
    id: 'task-css-responsive-390',
    title: 'Ни одной горизонтальной прокрутки на 390px',
    kind: 'fix-bug',
    runtime: 'dom',
    difficulty: 3,
    tech: ['css'],
    topicIds: ['css-responsive'],
    monthNo: 1,
    weekNo: 3,
    statement: `Страница «поехала» на телефоне: появилась горизонтальная прокрутка, а это прямое нарушение требования модуля 2 — «совместимость с экраном 390×844».

Найдите и исправьте причины. В разметке три проблемы: блок с фиксированной шириной, картинка без ограничения и широкая таблица.

**Разметку менять нельзя — только стили.** Проверка идёт в окне ровно 390×844.`,
    requirements: [
      'Нет горизонтальной прокрутки на ширине 390px',
      'Блок .panel не шире экрана',
      'Изображение вписано в контейнер',
      'Таблица получает собственную прокрутку, а не растягивает страницу',
    ],
    starterCode: `<style>
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; }

.panel {
  width: 520px;        /* проблема 1 */
  padding: 16px;
  background: #f1f5f9;
}

/* проблема 2: изображение */

/* проблема 3: таблица */

table { border-collapse: collapse; }
th, td { border: 1px solid #cbd5e1; padding: 8px 14px; white-space: nowrap; }
</style>

<div class="panel">
  <h2>Мои заявки</h2>
  <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='900' height='300'><rect width='900' height='300' fill='%232563eb'/></svg>" alt="Баннер">
  <div class="table-wrap">
    <table>
      <thead><tr><th>№</th><th>Помещение</th><th>Дата начала</th><th>Способ оплаты</th><th>Статус</th></tr></thead>
      <tbody><tr><td>1</td><td>Коворкинг</td><td>14.09.2026</td><td>Банковская карта</td><td>Новая</td></tr></tbody>
    </table>
  </div>
</div>`,
    viewport: { width: 390, height: 844 },
    tests: [
      {
        id: 'no-scroll',
        name: 'Горизонтальной прокрутки нет',
        type: 'dom',
        code: `const docWidth = ctx.document.documentElement.scrollWidth;
const viewport = ctx.window.innerWidth;
ctx.assert(docWidth <= viewport + 1, 'Страница шире экрана: ' + docWidth + 'px при окне ' + viewport + 'px', viewport + 'px', docWidth + 'px');`,
        points: 3,
      },
      {
        id: 'panel',
        name: 'Блок .panel помещается в экран',
        type: 'dom',
        code: `const rect = ctx.$('.panel').getBoundingClientRect();
ctx.assert(rect.width <= ctx.window.innerWidth + 1, 'Ширина .panel ' + Math.round(rect.width) + 'px больше экрана. Замените фиксированную ширину на max-width');`,
        points: 2,
      },
      {
        id: 'image',
        name: 'Изображение вписано в контейнер',
        type: 'dom',
        code: `const image = ctx.$('img');
const rect = image.getBoundingClientRect();
ctx.assert(rect.width <= ctx.window.innerWidth + 1, 'Картинка шире экрана: ' + Math.round(rect.width) + 'px. Нужно правило img { max-width: 100%; }');
ctx.assert(ctx.css(image, 'max-width') === '100%', 'Задайте img { max-width: 100%; height: auto; }');`,
        points: 2,
      },
      {
        id: 'table',
        name: 'Таблица прокручивается внутри своего блока',
        type: 'dom',
        code: `const wrap = ctx.$('.table-wrap');
const overflow = ctx.css(wrap, 'overflow-x');
ctx.assert(overflow === 'auto' || overflow === 'scroll', 'Оберните таблицу блоком с overflow-x: auto — тогда прокручиваться будет она, а не вся страница', 'auto', overflow);
ctx.assert(wrap.getBoundingClientRect().width <= ctx.window.innerWidth + 1, 'Сам блок с таблицей не должен быть шире экрана');`,
        points: 2,
      },
    ],
    hints: [
      { level: 1, text: 'Три классических виновника: width в пикселях, картинка без max-width и таблица без обёртки со скроллом.', penaltyPercent: 10 },
      { level: 2, text: 'Фиксированную ширину заменяют на width: 100%; max-width: 520px — тогда блок сжимается на узком экране.', penaltyPercent: 20 },
      {
        level: 3,
        text: '.panel { width: 100%; max-width: 520px; } img { max-width: 100%; height: auto; display: block; } .table-wrap { overflow-x: auto; }',
        penaltyPercent: 35,
      },
    ],
    solution: `<style>
/* Без border-box внутренние отступы прибавляются к ширине 100%,
   и панель вылезает за экран ровно на 32 пикселя. */
* { box-sizing: border-box; }

.panel {
  width: 100%;
  max-width: 520px;
  padding: 16px;
  background: #f1f5f9;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

.table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
</style>

<div class="panel">
  <h2>Мои заявки</h2>
  <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='900' height='300'><rect width='900' height='300' fill='%232563eb'/></svg>" alt="Баннер">
  <div class="table-wrap">
    <table>
      <thead><tr><th>№</th><th>Помещение</th><th>Дата начала</th><th>Способ оплаты</th><th>Статус</th></tr></thead>
      <tbody><tr><td>1</td><td>Коворкинг</td><td>14.09.2026</td><td>Банковская карта</td><td>Новая</td></tr></tbody>
    </table>
  </div>
</div>`,
    solutionExplanation:
      'Эти три правила закрывают почти все случаи горизонтальной прокрутки. Держите их в шаблоне стилей и проверяйте каждую страницу в режиме устройства 390×844.',
    maxScore: 9,
    estimatedMinutes: 20,
    examRefs: ['m2-mobile', 'm3-mobile'],
    planDays: ['day-03-5'],
    source: 'plan',
  },

  {
    id: 'task-css-object-fit',
    title: 'Четыре изображения одного размера для слайдера',
    kind: 'output',
    runtime: 'dom',
    difficulty: 2,
    tech: ['css', 'design'],
    topicIds: ['css-images'],
    monthNo: 1,
    weekNo: 3,
    statement: `Задание демоэкзамена требует слайдер из **четырёх одинаковых по размерам изображений**. Исходники почти всегда разные — приведите их к одному размеру средствами CSS.

Все четыре картинки должны иметь одинаковую ширину и высоту, сохранять пропорции и заполнять область без белых полей.`,
    requirements: [
      'Все изображения .slide__img одного размера',
      'Пропорции сохранены: используется object-fit: cover',
      'Соотношение сторон задано (aspect-ratio или фиксированная высота)',
      'Картинки не выходят за пределы контейнера',
    ],
    starterCode: `<style>
.slider { width: 100%; max-width: 600px; }
.slides { display: flex; gap: 8px; }

/* приведите картинки к одному размеру */

</style>

<div class="slider">
  <div class="slides">
    <img class="slide__img" alt="Слайд 1" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='300'><rect width='800' height='300' fill='%232563eb'/></svg>">
    <img class="slide__img" alt="Слайд 2" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600'><rect width='400' height='600' fill='%2316a34a'/></svg>">
    <img class="slide__img" alt="Слайд 3" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><rect width='600' height='600' fill='%23d97706'/></svg>">
    <img class="slide__img" alt="Слайд 4" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='400'><rect width='1200' height='400' fill='%23dc2626'/></svg>">
  </div>
</div>`,
    viewport: { width: 800, height: 600 },
    tests: [
      {
        id: 'count',
        name: 'Все четыре изображения на месте',
        type: 'dom',
        code: `const images = ctx.$$('.slide__img');
ctx.assert(images.length === 4, 'Слайдер должен содержать четыре изображения', 4, images.length);`,
      },
      {
        id: 'same-size',
        name: 'Изображения одного размера',
        type: 'dom',
        code: `const rects = ctx.$$('.slide__img').map((img) => img.getBoundingClientRect());
const first = rects[0];
rects.forEach((rect, index) => {
  ctx.assert(Math.abs(rect.width - first.width) < 2, 'Ширина изображения ' + (index + 1) + ' отличается: ' + Math.round(rect.width) + ' против ' + Math.round(first.width));
  ctx.assert(Math.abs(rect.height - first.height) < 2, 'Высота изображения ' + (index + 1) + ' отличается: ' + Math.round(rect.height) + ' против ' + Math.round(first.height));
});`,
        points: 3,
      },
      {
        id: 'object-fit',
        name: 'Пропорции сохранены через object-fit: cover',
        type: 'dom',
        code: `const value = ctx.css('.slide__img', 'object-fit');
ctx.assert(value === 'cover', 'object-fit должен быть cover: заполняет область и обрезает лишнее без искажений', 'cover', value);`,
        points: 2,
      },
      {
        id: 'height',
        name: 'Высота задана и не нулевая',
        type: 'dom',
        code: `const rect = ctx.$('.slide__img').getBoundingClientRect();
ctx.assert(rect.height > 50, 'У изображений должна быть заданная высота (aspect-ratio или height)');
ctx.assert(rect.width > 50, 'Ширина изображений не должна схлопываться');`,
      },
      {
        id: 'fits',
        name: 'Слайдер не шире контейнера',
        type: 'dom',
        code: `const slider = ctx.$('.slider').getBoundingClientRect();
ctx.$$('.slide__img').forEach((img) => {
  ctx.assert(img.getBoundingClientRect().width <= slider.width + 1, 'Изображение шире контейнера слайдера');
});`,
      },
    ],
    hints: [
      { level: 1, text: 'Одинаковый размер задаётся контейнеру, а картинка вписывается в него через object-fit.', penaltyPercent: 10 },
      { level: 2, text: 'aspect-ratio: 16 / 9 задаёт высоту от ширины — слайдер не займёт пол-экрана на телефоне.', penaltyPercent: 20 },
      {
        level: 3,
        text: '.slide__img { flex: 1 1 0; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 8px; }',
        penaltyPercent: 35,
      },
    ],
    solution: `<style>
.slide__img {
  flex: 1 1 0;
  width: 100%;
  min-width: 0;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}
</style>

<div class="slider">
  <div class="slides">
    <img class="slide__img" alt="Слайд 1" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='300'><rect width='800' height='300' fill='%232563eb'/></svg>">
    <img class="slide__img" alt="Слайд 2" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600'><rect width='400' height='600' fill='%2316a34a'/></svg>">
    <img class="slide__img" alt="Слайд 3" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><rect width='600' height='600' fill='%23d97706'/></svg>">
    <img class="slide__img" alt="Слайд 4" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='400'><rect width='1200' height='400' fill='%23dc2626'/></svg>">
  </div>
</div>`,
    solutionExplanation:
      'object-fit: cover заполняет область и обрезает лишнее, сохраняя пропорции. Если взять fill, картинки растянутся и будут выглядеть искажёнными — формально «одинаковые», но это сразу видно.',
    maxScore: 8,
    estimatedMinutes: 18,
    examRefs: ['m2-slider', 'm2-design'],
    planDays: ['day-03-6'],
    source: 'plan',
  },

  {
    id: 'task-css-transition',
    title: 'Микроанимации кнопки и карточки',
    kind: 'output',
    runtime: 'dom',
    difficulty: 2,
    tech: ['css'],
    topicIds: ['css-animations'],
    monthNo: 1,
    weekNo: 4,
    statement: `Модуль 3 рекомендует микроанимации. Добавьте их правильно: коротко, только для дешёвых свойств и с уважением к системной настройке «уменьшить движение».

1. Кнопка \`.btn\`: плавный переход фона, длительность 200мс.
2. Карточка \`.card\`: при наведении приподнимается через \`transform\` (анимируем **transform**, а не \`top\` или \`margin\`).
3. Уведомление \`.toast\`: появляется через \`@keyframes\`.
4. В медиазапросе \`prefers-reduced-motion: reduce\` анимации практически отключаются.`,
    requirements: [
      'У .btn задан transition длительностью 0.2s',
      'У .card есть transition для transform',
      'Определён @keyframes для появления уведомления, .toast его использует',
      'Есть блок @media (prefers-reduced-motion: reduce)',
      'Не анимируются width, height, top, left',
    ],
    starterCode: `<style>
.btn { background: #2563eb; color: #fff; border: 0; padding: 10px 16px; border-radius: 8px; }
.btn:hover { background: #1d4ed8; }

.card { padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; margin-top: 16px; }
.card:hover { transform: translateY(-2px); }

.toast { margin-top: 16px; padding: 10px 14px; background: #dcfce7; border-radius: 8px; }

/* добавьте анимации */

</style>

<button class="btn">Отправить заявку</button>
<div class="card">Коворкинг · 14.09.2026</div>
<div class="toast">Заявка отправлена</div>`,
    viewport: { width: 700, height: 500 },
    tests: [
      {
        id: 'btn-transition',
        name: 'Переход фона кнопки длится 200мс',
        type: 'dom',
        code: `const duration = ctx.css('.btn', 'transition-duration');
ctx.assert(duration && duration !== '0s', 'У кнопки нет transition');
const values = duration.split(',').map((v) => v.trim());
ctx.assert(values.some((v) => v === '0.2s'), 'Длительность должна быть 0.2s (200 мс)', '0.2s', duration);
const property = ctx.css('.btn', 'transition-property');
ctx.assert(/background|all/.test(property), 'Переход должен затрагивать background', 'background-color', property);`,
        points: 2,
      },
      {
        id: 'card-transition',
        name: 'Карточка анимирует transform',
        type: 'dom',
        code: `const property = ctx.css('.card', 'transition-property');
ctx.assert(/transform|all/.test(property), 'У .card нужен transition для transform', 'transform', property);
const duration = ctx.css('.card', 'transition-duration');
ctx.assert(duration !== '0s', 'Длительность перехода карточки не задана');`,
        points: 2,
      },
      {
        id: 'keyframes',
        name: 'Уведомление появляется через @keyframes',
        type: 'dom',
        code: `const source = ctx.source;
ctx.assert(/@keyframes\\s+[\\w-]+/.test(source), 'Нет ни одного блока @keyframes');
const animation = ctx.css('.toast', 'animation-name');
ctx.assert(animation && animation !== 'none', 'У .toast не задана animation', 'имя анимации', animation);
const duration = ctx.css('.toast', 'animation-duration');
ctx.assert(duration !== '0s', 'Длительность анимации уведомления не задана');`,
        points: 3,
      },
      {
        id: 'reduced-motion',
        name: 'Учтена настройка prefers-reduced-motion',
        type: 'dom',
        code: `const source = ctx.source.replace(/\\s+/g, ' ');
ctx.assert(/@media\\s*\\(\\s*prefers-reduced-motion\\s*:\\s*reduce\\s*\\)/i.test(source), 'Добавьте @media (prefers-reduced-motion: reduce) и сократите длительности — это требование доступности');`,
        points: 2,
      },
      {
        id: 'cheap-properties',
        name: 'Не анимируются дорогие свойства',
        type: 'dom',
        code: `const properties = [ctx.css('.btn', 'transition-property'), ctx.css('.card', 'transition-property')].join(' ');
['width', 'height', 'top', 'left', 'margin'].forEach((name) => {
  ctx.assert(!new RegExp('(^|[ ,])' + name + '([ ,]|$)').test(properties), 'Свойство ' + name + ' анимировать нельзя: браузер пересчитывает раскладку каждый кадр. Используйте transform');
});`,
        points: 2,
      },
    ],
    hints: [
      { level: 1, text: 'transition: свойство длительность плавность. Например: transition: background .2s ease;', penaltyPercent: 10 },
      { level: 2, text: '@keyframes описывает состояния from/to, а свойство animation связывает их с элементом.', penaltyPercent: 20 },
      {
        level: 3,
        text: '.btn { transition: background .2s ease; } .card { transition: transform .2s ease; } @keyframes toast-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: none; } } .toast { animation: toast-in .25s ease-out; }',
        penaltyPercent: 35,
      },
    ],
    solution: `<style>
.btn { transition: background 0.2s ease; }

.card { transition: transform 0.2s ease, box-shadow 0.2s ease; }

@keyframes toast-in {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: none; }
}

.toast { animation: toast-in 0.25s ease-out both; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>

<button class="btn">Отправить заявку</button>
<div class="card">Коворкинг · 14.09.2026</div>
<div class="toast">Заявка отправлена</div>`,
    solutionExplanation:
      'transform и opacity браузер выполняет на видеокарте, не пересчитывая раскладку, поэтому анимация идёт плавно. Блок prefers-reduced-motion — стандартное требование доступности и заметный плюс к оценке качества кода.',
    maxScore: 11,
    estimatedMinutes: 20,
    examRefs: ['m3-animations'],
    planDays: ['day-04-1'],
    source: 'plan',
  },
];
