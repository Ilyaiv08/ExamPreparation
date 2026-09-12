import type { Task } from '../types';

/**
 * Месяц 1: практика для дней, у которых её не было.
 *
 * Правило подбора: задание опирается только на то, что студент уже прошёл.
 * В первом месяце это чистые HTML и CSS — ни строчки JavaScript, он начинается
 * только во втором месяце. Поэтому темы вроде Git, которые живут в терминале,
 * проверяются через артефакт: студент делает работу руками, а на странице
 * оформляет её результат — и вот его платформа уже может проверить.
 */
export const MONTH_01_DAILY_TASKS: Task[] = [
  {
    id: 'task-day-first-page',
    title: 'Первая страница и три установленные программы',
    kind: 'output',
    runtime: 'dom',
    difficulty: 1,
    tech: ['html', 'tools'],
    topicIds: ['web-basics'],
    monthNo: 1,
    weekNo: 1,
    statement: `Сегодня вы поставили три программы и проверили их в терминале:

\`\`\`
code --version
node -v
git --version
\`\`\`

Соберите первую страницу и запишите на ней результат — это и проверка установки, и первая настоящая HTML-страница.

На странице должны быть:

1. заголовок первого уровня со словом **Привет**;
2. список из **трёх** пунктов — по одному на каждую программу;
3. в каждом пункте название программы и её версия (например, «Node.js 20.11.1»).

Версии пишите свои, настоящие: смысл в том, чтобы убедиться, что всё три программы отвечают.`,
    requirements: [
      'Документ начинается с <!DOCTYPE html>',
      'Есть заголовок <h1> со словом «Привет»',
      'Есть список <ul> ровно из трёх пунктов',
      'В каждом пункте указан номер версии вида 20.11.1',
      'В пунктах названы VS Code, Node.js и Git',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Первая страница</title>
</head>
<body>
  <!-- 1. Заголовок со словом «Привет» -->

  <!-- 2. Список из трёх программ с версиями -->

</body>
</html>`,
    viewport: { width: 700, height: 400 },
    tests: [
      {
        id: 'doctype',
        name: 'Документ объявлен как HTML',
        type: 'dom',
        code: `ctx.assert(ctx.document.doctype !== null, 'В начале файла должна быть строка <!DOCTYPE html>');`,
      },
      {
        id: 'greeting',
        name: 'Заголовок со словом «Привет»',
        type: 'dom',
        code: `const h1 = ctx.$('h1');
ctx.assert(h1, 'На странице нет заголовка <h1>');
const text = h1.textContent.trim();
ctx.assert(/привет/i.test(text), 'В заголовке должно быть слово «Привет», сейчас: ' + text, 'Привет', text);`,
      },
      {
        id: 'list-of-three',
        name: 'Список ровно из трёх программ',
        type: 'dom',
        code: `const list = ctx.$('ul');
ctx.assert(list, 'Нет списка <ul> — программы нужно перечислить списком, а не абзацами');
const items = ctx.$$('li', list).filter((li) => li.textContent.trim().length > 0);
ctx.assert(items.length === 3, 'Пунктов должно быть три, найдено: ' + items.length, 3, items.length);`,
        points: 2,
      },
      {
        id: 'versions',
        name: 'У каждой программы записана версия',
        type: 'dom',
        code: `const items = ctx.$$('ul li');
const withoutVersion = items.filter((li) => !/\\d+\\.\\d+/.test(li.textContent));
ctx.assert(
  withoutVersion.length === 0,
  'Без номера версии остались пункты: ' + withoutVersion.map((li) => li.textContent.trim()).join(' | '),
);`,
        points: 2,
      },
      {
        id: 'tool-names',
        name: 'Названы все три программы',
        type: 'dom',
        code: `const text = ctx.$$('ul li').map((li) => li.textContent.toLowerCase()).join(' ');
ctx.assert(text.includes('code'), 'В списке не найден VS Code');
ctx.assert(text.includes('node'), 'В списке не найден Node.js');
ctx.assert(text.includes('git'), 'В списке не найден Git');`,
        points: 2,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Список из трёх пунктов — это <ul> с тремя <li> внутри. В VS Code наберите ul>li*3 и нажмите Tab.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Версию просто допишите текстом внутрь пункта: <li>Node.js 20.11.1</li>. Проверка ищет числа, разделённые точкой.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'В <body>: <h1>Привет!</h1>, затем <ul> с тремя <li>: VS Code 1.96.2, Node.js 20.11.1, Git 2.43.0.',
        penaltyPercent: 35,
      },
    ],
    solution: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Первая страница</title>
</head>
<body>
  <h1>Привет! Это моя первая страница</h1>

  <ul>
    <li>VS Code 1.96.2</li>
    <li>Node.js 20.11.1</li>
    <li>Git 2.43.0</li>
  </ul>
</body>
</html>`,
    solutionExplanation:
      'Страница специально простая: на первом занятии важно не написать много, а увидеть, что связка «файл → браузер» работает. Список выбран не случайно: перечень — это <ul> с <li>, а не абзацы с дефисами. Браузер и программы чтения с экрана понимают, что это именно перечень, только когда он размечен списком.',
    maxScore: 8,
    estimatedMinutes: 15,
    examRefs: ['m1-git'],
    planDays: ['day-01-1'],
    source: 'plan',
  },

  {
    id: 'task-git-commit-log',
    title: 'Журнал коммитов: подпись, по которой понятно, что менялось',
    kind: 'output',
    runtime: 'dom',
    difficulty: 2,
    tech: ['git', 'html'],
    topicIds: ['git-basics'],
    monthNo: 1,
    weekNo: 1,
    statement: `Сам Git живёт в терминале, и песочница туда не заглядывает. Поэтому работу вы делаете руками, а сюда переносите её результат.

**Сначала в своём репозитории:**

\`\`\`
git init
git add .
git commit -m "Добавить каркас страницы входа"
\`\`\`

Сделайте три коммита, затем посмотрите историю: \`git log --oneline\`.

**Теперь на странице** оформите эти три коммита таблицей: короткий хеш, подпись коммита, что именно изменилось.

Проверка смотрит на подписи. На экзамене требуются промежуточные коммиты, и оценивает их человек: подпись «фикс», «1» или «asdf» не объясняет ничего. Хорошая подпись отвечает на вопрос «что делает этот коммит»: «Добавить валидацию формы регистрации».`,
    requirements: [
      'Есть таблица с шапкой <thead> и телом <tbody>',
      'В <tbody> ровно три строки — по одной на коммит',
      'В каждой строке три ячейки: хеш, подпись, что изменилось',
      'Хеш выглядит как хеш: не меньше семи символов 0–9 и a–f',
      'Подпись длиннее 10 символов и не является заглушкой',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Журнал коммитов</title>
</head>
<body>
  <h1>История проекта</h1>

  <table>
    <thead>
      <tr>
        <th>Хеш</th>
        <th>Подпись коммита</th>
        <th>Что изменилось</th>
      </tr>
    </thead>
    <tbody>
      <!-- три строки: по одной на каждый ваш коммит -->
    </tbody>
  </table>
</body>
</html>`,
    viewport: { width: 800, height: 400 },
    tests: [
      {
        id: 'table-structure',
        name: 'Таблица с шапкой и телом',
        type: 'dom',
        code: `const table = ctx.$('table');
ctx.assert(table, 'На странице нет таблицы');
ctx.assert(ctx.$('thead', table), 'У таблицы нет шапки <thead>');
ctx.assert(ctx.$('tbody', table), 'У таблицы нет тела <tbody>');`,
      },
      {
        id: 'three-rows',
        name: 'Ровно три коммита',
        type: 'dom',
        code: `const rows = ctx.$$('tbody tr');
ctx.assert(rows.length === 3, 'Строк должно быть три, найдено: ' + rows.length, 3, rows.length);`,
        points: 2,
      },
      {
        id: 'three-cells',
        name: 'В каждой строке три ячейки',
        type: 'dom',
        code: `const rows = ctx.$$('tbody tr');
rows.forEach((row, index) => {
  const cells = ctx.$$('td', row);
  ctx.assert(cells.length === 3, 'В строке ' + (index + 1) + ' ячеек: ' + cells.length + ', нужно три', 3, cells.length);
});`,
      },
      {
        id: 'hashes',
        name: 'Хеши похожи на настоящие',
        type: 'dom',
        code: `const rows = ctx.$$('tbody tr');
rows.forEach((row, index) => {
  const hash = ctx.$$('td', row)[0].textContent.trim();
  ctx.assert(
    /^[0-9a-f]{7,40}$/i.test(hash),
    'В строке ' + (index + 1) + ' хеш «' + hash + '» не похож на вывод git log --oneline: там 7 символов из 0-9 и a-f',
  );
});`,
        points: 2,
      },
      {
        id: 'messages',
        name: 'Подписи объясняют, что сделано',
        type: 'dom',
        code: `const junk = ['test', 'фикс', 'fix', 'правки', 'изменения', 'коммит', 'asdf', '1', '123', 'update'];
const rows = ctx.$$('tbody tr');
rows.forEach((row, index) => {
  const message = ctx.$$('td', row)[1].textContent.trim();
  ctx.assert(
    message.length >= 10,
    'Подпись в строке ' + (index + 1) + ' слишком короткая («' + message + '»): по ней не понять, что изменилось',
  );
  ctx.assert(
    junk.indexOf(message.toLowerCase()) === -1,
    'Подпись «' + message + '» ничего не объясняет. Напишите, что делает коммит: «Добавить валидацию формы»',
  );
});`,
        points: 3,
      },
      {
        id: 'unique-messages',
        name: 'Подписи разные',
        type: 'dom',
        code: `const messages = ctx.$$('tbody tr').map((row) => ctx.$$('td', row)[1].textContent.trim().toLowerCase());
const unique = messages.filter((value, index) => messages.indexOf(value) === index);
ctx.assert(unique.length === messages.length, 'Три коммита с одинаковой подписью — это то же самое, что и без подписи');`,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Короткий хеш берётся из git log --oneline — это первые семь символов длинного хеша.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Строка таблицы — это <tr>, а ячейка данных — <td>. В шапке ячейки другие: <th>.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Каждая строка выглядит так: <tr><td>a1b2c3d</td><td>Добавить каркас страницы входа</td><td>index.html</td></tr>.',
        penaltyPercent: 35,
      },
    ],
    solution: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Журнал коммитов</title>
</head>
<body>
  <h1>История проекта</h1>

  <table>
    <thead>
      <tr>
        <th>Хеш</th>
        <th>Подпись коммита</th>
        <th>Что изменилось</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>a1b2c3d</td>
        <td>Добавить каркас страницы входа</td>
        <td>Создан index.html с метатегами и заголовком</td>
      </tr>
      <tr>
        <td>e4f5a6b</td>
        <td>Добавить форму входа с полями логина и пароля</td>
        <td>В index.html добавлена форма с двумя полями</td>
      </tr>
      <tr>
        <td>c7d8e9f</td>
        <td>Связать страницы входа и регистрации ссылками</td>
        <td>Добавлен register.html и навигация между страницами</td>
      </tr>
    </tbody>
  </table>
</body>
</html>`,
    solutionExplanation:
      'Подпись коммита пишут в повелительном наклонении и от третьего лица: «Добавить форму входа», а не «добавил форму» или «фикс». Причина практическая: история читается как список того, что каждый коммит делает с проектом. На демоэкзамене промежуточные коммиты — отдельное требование во всех трёх модулях, и смотрят именно на то, видно ли по истории ход работы.',
    maxScore: 10,
    estimatedMinutes: 20,
    examRefs: ['m1-git', 'm2-git', 'm3-git'],
    planDays: ['day-01-4'],
    source: 'plan',
  },

  {
    id: 'task-devtools-markup-fix',
    title: 'Панель разработчика: найти пять ошибок в разметке',
    kind: 'find-bug',
    runtime: 'dom',
    difficulty: 2,
    tech: ['html', 'tools'],
    topicIds: ['tools-devtools'],
    monthNo: 1,
    weekNo: 1,
    statement: `Страница открывается и на первый взгляд работает. Но в разметке пять ошибок, и каждая из них обязательно вылезет — либо на телефоне, либо при проверке качества кода на третьем модуле.

Откройте панель разработчика (**F12**), вкладку «Элементы», и найдите:

1. страница не готова к показу на телефоне — не хватает одного метатега;
2. у изображения нет текстовой замены;
3. заголовков первого уровня два, а должен быть один;
4. один и тот же идентификатор стоит у двух элементов;
5. ссылка никуда не ведёт — у неё нет адреса.

Исправьте всё пятью правками. Текст и структуру страницы менять не нужно.`,
    requirements: [
      'В <head> есть <meta name="viewport">',
      'У каждого <img> есть непустой атрибут alt',
      'На странице ровно один <h1>',
      'Все значения id уникальны',
      'У каждой ссылки <a> есть непустой href',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Конференции.РФ</title>
</head>
<body>
  <header id="top">
    <h1>Конференции.РФ</h1>
    <nav>
      <a href="index.html">Главная</a>
      <a>Помещения</a>
    </nav>
  </header>

  <main id="top">
    <h1>Аудитория на 100 мест</h1>
    <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'><rect width='600' height='300' fill='%232563eb'/></svg>">
    <p>Помещение для конференций и лекций.</p>
  </main>
</body>
</html>`,
    viewport: { width: 700, height: 500 },
    tests: [
      {
        id: 'viewport',
        name: 'Метатег viewport на месте',
        type: 'dom',
        code: `const meta = ctx.document.querySelector('meta[name="viewport"]');
ctx.assert(meta, 'Без <meta name="viewport"> телефон покажет страницу уменьшенной копией рабочего стола');
const content = (meta.getAttribute('content') || '').replace(/\\s/g, '');
ctx.assert(content.includes('width=device-width'), 'В content нужно width=device-width');`,
        points: 2,
      },
      {
        id: 'img-alt',
        name: 'У изображения есть alt',
        type: 'dom',
        code: `const images = ctx.$$('img');
ctx.assert(images.length > 0, 'Изображение пропало со страницы — его нужно было починить, а не удалить');
images.forEach((img) => {
  const alt = img.getAttribute('alt');
  ctx.assert(alt !== null && alt.trim().length > 0, 'У изображения нет непустого alt: его читают вслух, когда картинка не загрузилась');
});`,
        points: 2,
      },
      {
        id: 'single-h1',
        name: 'Заголовок первого уровня один',
        type: 'dom',
        code: `const headings = ctx.$$('h1');
ctx.assert(headings.length === 1, 'Заголовков <h1> должно быть ровно один, найдено: ' + headings.length, 1, headings.length);
ctx.assert(ctx.$$('h2').length >= 1, 'Второй заголовок не удаляйте, а понизьте до <h2> — он всё ещё нужен');`,
        points: 2,
      },
      {
        id: 'unique-ids',
        name: 'Идентификаторы уникальны',
        type: 'dom',
        code: `const ids = ctx.$$('[id]').map((el) => el.id);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
ctx.assert(duplicates.length === 0, 'Повторяется id: ' + duplicates.join(', ') + '. Идентификатор должен быть один на всю страницу');`,
        points: 2,
      },
      {
        id: 'links',
        name: 'Все ссылки куда-то ведут',
        type: 'dom',
        code: `const links = ctx.$$('a');
ctx.assert(links.length >= 2, 'Ссылки не удаляйте — их две');
links.forEach((link) => {
  const href = link.getAttribute('href');
  ctx.assert(
    href !== null && href.trim().length > 0,
    'У ссылки «' + link.textContent.trim() + '» нет адреса. Без href это просто текст, и с клавиатуры до него не добраться',
  );
});`,
        points: 2,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Метатег viewport — вторая строка в <head>, сразу после кодировки. Остальные четыре ошибки видны во вкладке «Элементы».',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Второй h1 — это заголовок помещения внутри main. Он подчинён названию сайта, значит это h2. У <main> поменяйте id на свой, например id="content".',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Пять правок: добавить meta viewport; alt="Аудитория на 100 мест"; <h1> внутри main → <h2>; id="top" у main → id="content"; <a> без href → <a href="rooms.html">.',
        penaltyPercent: 35,
      },
    ],
    solution: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Конференции.РФ</title>
</head>
<body>
  <header id="top">
    <h1>Конференции.РФ</h1>
    <nav>
      <a href="index.html">Главная</a>
      <a href="rooms.html">Помещения</a>
    </nav>
  </header>

  <main id="content">
    <h2>Аудитория на 100 мест</h2>
    <img alt="Аудитория на 100 мест" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'><rect width='600' height='300' fill='%232563eb'/></svg>">
    <p>Помещение для конференций и лекций.</p>
  </main>
</body>
</html>`,
    solutionExplanation:
      'Все пять ошибок объединяет одно: страница выглядит нормально, пока её смотрит зрячий человек с мышкой на большом экране. Метатег viewport нужен телефону, alt — тем, у кого картинка не загрузилась или включено чтение с экрана, один h1 и уникальные id — это то, по чему браузер и поисковик понимают структуру. На третьем модуле экзамена качество кода оценивают отдельным пунктом, и такие мелочи там видны сразу.',
    maxScore: 10,
    estimatedMinutes: 20,
    examRefs: ['m2-mobile', 'm3-quality'],
    planDays: ['day-01-6'],
    source: 'plan',
  },

  {
    id: 'task-html-login-order-forms',
    title: 'Форма входа и форма заявки: виды полей и встроенные проверки',
    kind: 'function',
    runtime: 'dom',
    difficulty: 2,
    tech: ['html'],
    topicIds: ['html-forms'],
    monthNo: 1,
    weekNo: 2,
    statement: `В задании демоэкзамена, кроме регистрации, есть ещё две формы: вход и оформление заявки. Соберите обе — пока без оформления, только разметка.

**Форма входа** (\`id="login-form"\`):

- логин — обязательное поле, минимум 6 символов;
- пароль — поле с точками вместо символов, обязательное, минимум 8 символов;
- кнопка отправки.

**Форма заявки** (\`id="order-form"\`):

- помещение — выпадающий список, не меньше трёх вариантов;
- дата — поле выбора даты;
- способ оплаты — переключатели, не меньше двух вариантов, с одинаковым именем;
- кнопка отправки.

У каждого поля должна быть подпись, связанная с ним через \`for\` и \`id\`. Подпись рядом — этого мало: связь нужна, чтобы по клику на текст курсор вставал в поле.`,
    requirements: [
      'Форма входа имеет id="login-form"',
      'В форме входа поле логина обязательное и с minlength="6"',
      'В форме входа поле пароля типа password, обязательное, с minlength="8"',
      'Форма заявки имеет id="order-form"',
      'В форме заявки есть <select> минимум с тремя вариантами',
      'В форме заявки есть поле <input type="date">',
      'В форме заявки есть минимум два переключателя с одинаковым name',
      'У каждого поля есть <label for>, указывающий на его id',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Вход и заявка</title>
</head>
<body>
  <h1>Конференции.РФ</h1>

  <h2>Вход</h2>
  <form id="login-form">
    <!-- логин и пароль -->
  </form>

  <h2>Оформление заявки</h2>
  <form id="order-form">
    <!-- помещение, дата, способ оплаты -->
  </form>
</body>
</html>`,
    viewport: { width: 700, height: 700 },
    tests: [
      {
        id: 'login-fields',
        name: 'В форме входа два нужных поля',
        type: 'dom',
        code: `const form = ctx.$('#login-form');
ctx.assert(form, 'Нет формы с id="login-form"');
const login = ctx.$('input[name="login"]', form);
ctx.assert(login, 'В форме входа нет поля с name="login"');
const password = ctx.$('input[name="password"]', form);
ctx.assert(password, 'В форме входа нет поля с name="password"');
ctx.assert(password.type === 'password', 'Пароль должен быть type="password", иначе его видно на экране', 'password', password.type);`,
        points: 2,
      },
      {
        id: 'login-validation',
        name: 'Встроенные проверки формы входа',
        type: 'dom',
        code: `const login = ctx.$('#login-form input[name="login"]');
const password = ctx.$('#login-form input[name="password"]');
ctx.assert(login.required, 'Поле логина должно быть обязательным: добавьте required');
ctx.assert(password.required, 'Поле пароля должно быть обязательным: добавьте required');
ctx.assert(login.getAttribute('minlength') === '6', 'У логина нужен minlength="6"', '6', login.getAttribute('minlength'));
ctx.assert(password.getAttribute('minlength') === '8', 'У пароля нужен minlength="8"', '8', password.getAttribute('minlength'));`,
        points: 2,
      },
      {
        id: 'login-submit',
        name: 'Кнопка отправки формы входа',
        type: 'dom',
        code: `const form = ctx.$('#login-form');
const button = ctx.$('button[type="submit"], input[type="submit"]', form);
ctx.assert(button, 'В форме входа нет кнопки отправки. Без type="submit" кнопка форму не отправит');`,
      },
      {
        id: 'order-select',
        name: 'Выпадающий список помещений',
        type: 'dom',
        code: `const select = ctx.$('#order-form select');
ctx.assert(select, 'В форме заявки нет выпадающего списка <select>');
ctx.assert(select.name && select.name.length > 0, 'У <select> должен быть атрибут name — иначе значение не уйдёт на сервер');
const options = ctx.$$('option', select).filter((option) => option.value.trim().length > 0);
ctx.assert(options.length >= 3, 'Вариантов помещений должно быть не меньше трёх, найдено: ' + options.length, 3, options.length);`,
        points: 2,
      },
      {
        id: 'order-date',
        name: 'Поле выбора даты',
        type: 'dom',
        code: `const date = ctx.$('#order-form input[type="date"]');
ctx.assert(date, 'В форме заявки нет поля <input type="date">');
ctx.assert(date.name && date.name.length > 0, 'У поля даты должен быть name');`,
      },
      {
        id: 'order-radios',
        name: 'Переключатели способа оплаты',
        type: 'dom',
        code: `const radios = ctx.$$('#order-form input[type="radio"]');
ctx.assert(radios.length >= 2, 'Переключателей должно быть не меньше двух, найдено: ' + radios.length, 2, radios.length);
const names = radios.map((radio) => radio.name);
const unique = names.filter((name, index) => names.indexOf(name) === index);
ctx.assert(
  unique.length === 1,
  'У переключателей одной группы должен быть одинаковый name, иначе выбрать можно сразу все. Сейчас: ' + unique.join(', '),
);
ctx.assert(names[0] && names[0].length > 0, 'У переключателей должен быть name');`,
        points: 2,
      },
      {
        id: 'labels',
        name: 'Каждое поле связано с подписью',
        type: 'dom',
        code: `const fields = ctx.$$('input, select').filter((field) => field.type !== 'submit');
ctx.assert(fields.length >= 5, 'Полей меньше, чем нужно: ' + fields.length);
const labelled = {};
ctx.$$('label[for]').forEach((label) => {
  labelled[label.getAttribute('for')] = true;
});
fields.forEach((field) => {
  ctx.assert(field.id && field.id.length > 0, 'У поля «' + (field.name || field.type) + '» нет id — не к чему привязать подпись');
  ctx.assert(
    labelled[field.id] === true,
    'Для поля с id="' + field.id + '" нет подписи <label for="' + field.id + '">',
  );
});`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Переключатели объединяются в группу одинаковым name: из группы можно выбрать только один вариант. У каждого при этом свой value.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Связь подписи и поля: <label for="login">Логин</label> и <input id="login" name="login">. Значение for равно id, а не name.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Для логина: <label for="login">Логин</label><input id="login" name="login" required minlength="6">. Для оплаты: <input type="radio" id="pay-cash" name="payment" value="cash"> и рядом <label for="pay-cash">Наличные</label>.',
        penaltyPercent: 35,
      },
    ],
    solution: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Вход и заявка</title>
</head>
<body>
  <h1>Конференции.РФ</h1>

  <h2>Вход</h2>
  <form id="login-form">
    <p>
      <label for="login">Логин</label>
      <input type="text" id="login" name="login" required minlength="6">
    </p>
    <p>
      <label for="password">Пароль</label>
      <input type="password" id="password" name="password" required minlength="8">
    </p>
    <button type="submit">Войти</button>
  </form>

  <h2>Оформление заявки</h2>
  <form id="order-form">
    <p>
      <label for="room">Помещение</label>
      <select id="room" name="room" required>
        <option value="">Выберите помещение</option>
        <option value="hall">Аудитория на 100 мест</option>
        <option value="coworking">Коворкинг</option>
        <option value="cinema">Кинозал</option>
      </select>
    </p>
    <p>
      <label for="date">Дата мероприятия</label>
      <input type="date" id="date" name="date" required>
    </p>
    <fieldset>
      <legend>Способ оплаты</legend>
      <input type="radio" id="pay-cash" name="payment" value="cash" checked>
      <label for="pay-cash">Наличными</label>
      <input type="radio" id="pay-card" name="payment" value="card">
      <label for="pay-card">Картой</label>
    </fieldset>
    <button type="submit">Отправить заявку</button>
  </form>
</body>
</html>`,
    solutionExplanation:
      'Первый вариант в списке помещений — пустой «Выберите помещение». Так required действительно работает: пока значение пустое, форма не отправится. Если бы первым шло настоящее помещение, оно оказалось бы выбранным по умолчанию и студент получил бы заявку на аудиторию от человека, который ничего не выбирал. Переключатели обёрнуты в fieldset с legend — это стандартный способ подписать группу целиком.',
    maxScore: 13,
    estimatedMinutes: 25,
    examRefs: ['m1-login', 'm1-order', 'm2-order-form'],
    planDays: ['day-02-2'],
    source: 'plan',
  },

  {
    id: 'task-css-flex-grow',
    title: 'Flexbox: кто занимает оставшееся место',
    kind: 'output',
    runtime: 'dom',
    difficulty: 3,
    tech: ['css'],
    topicIds: ['css-flexbox'],
    monthNo: 1,
    weekNo: 3,
    statement: `Три карточки помещений стоят в ряд. Нужно, чтобы средняя карточка забирала всё свободное место, а боковые оставались по ширине содержимого.

1. Контейнер \`.rooms\` выстраивает карточки в строку с расстоянием **16px** между ними.
2. Карточка \`.card--wide\` растягивается на всё оставшееся место, остальные две — нет.
3. Внутри каждой карточки содержимое выровнено по центру и по горизонтали, и по вертикали. Высота карточки — 160px.

Разметку менять не нужно — только стили.`,
    requirements: [
      '.rooms выстроен в строку через display: flex',
      'Расстояние между карточками — 16px',
      '.card--wide занимает всё свободное место (flex-grow)',
      'Боковые карточки остаются по содержимому',
      'Все три карточки стоят на одной линии',
      'Содержимое карточки отцентрировано по обеим осям',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; }

    .rooms {
      /* 1. Выстроить в строку, расстояние 16px */
    }

    .card {
      height: 160px;
      padding: 16px;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      /* 3. Отцентрировать содержимое по обеим осям */
    }

    .card--wide {
      /* 2. Забрать всё оставшееся место */
    }
  </style>
</head>
<body>
  <div class="rooms">
    <div class="card">Коворкинг</div>
    <div class="card card--wide">Аудитория на 100 мест</div>
    <div class="card">Кинозал</div>
  </div>
</body>
</html>`,
    viewport: { width: 900, height: 400 },
    tests: [
      {
        id: 'flex-row',
        name: 'Карточки выстроены в строку',
        type: 'dom',
        code: `const display = ctx.css('.rooms', 'display');
ctx.assert(display === 'flex', 'У .rooms должен быть display: flex, сейчас: ' + display, 'flex', display);
const direction = ctx.css('.rooms', 'flex-direction');
ctx.assert(direction === 'row', 'Направление должно остаться строкой (row), сейчас: ' + direction, 'row', direction);`,
        points: 2,
      },
      {
        id: 'gap',
        name: 'Расстояние между карточками 16px',
        type: 'dom',
        code: `const gap = parseFloat(ctx.css('.rooms', 'column-gap'));
ctx.assert(gap === 16, 'Расстояние должно быть 16px, сейчас: ' + gap + 'px', 16, gap);`,
        points: 2,
      },
      {
        id: 'one-line',
        name: 'Все три карточки на одной линии',
        type: 'dom',
        code: `const cards = ctx.$$('.card');
ctx.assert(cards.length === 3, 'Карточек должно быть три');
const tops = cards.map((card) => Math.round(card.getBoundingClientRect().top));
ctx.assert(tops[0] === tops[1] && tops[1] === tops[2], 'Карточки должны стоять в одну линию, сейчас их верхние края: ' + tops.join(', '));`,
        points: 2,
      },
      {
        id: 'wide-grows',
        name: 'Средняя карточка забирает свободное место',
        type: 'dom',
        code: `const cards = ctx.$$('.card');
const widths = cards.map((card) => Math.round(card.getBoundingClientRect().width));
ctx.assert(
  widths[1] > widths[0] + 100 && widths[1] > widths[2] + 100,
  'Средняя карточка должна быть заметно шире боковых. Сейчас ширины: ' + widths.join(', '),
);
const grow = parseFloat(ctx.css('.card--wide', 'flex-grow'));
ctx.assert(grow >= 1, 'У .card--wide должен быть flex-grow не меньше 1, сейчас: ' + grow, 1, grow);`,
        points: 3,
      },
      {
        id: 'side-cards-fit',
        name: 'Боковые карточки остались по содержимому',
        type: 'dom',
        code: `const cards = ctx.$$('.card');
const sideGrow = [parseFloat(ctx.css(cards[0], 'flex-grow')), parseFloat(ctx.css(cards[2], 'flex-grow'))];
ctx.assert(
  sideGrow[0] === 0 && sideGrow[2 - 1] === 0,
  'Боковые карточки не должны растягиваться: flex-grow у них остаётся 0. Сейчас: ' + sideGrow.join(', '),
);`,
        points: 2,
      },
      {
        id: 'centered-content',
        name: 'Содержимое карточки по центру',
        type: 'dom',
        code: `const display = ctx.css('.card', 'display');
ctx.assert(display === 'flex', 'Чтобы центрировать по обеим осям, карточка сама становится flex-контейнером');
const justify = ctx.css('.card', 'justify-content');
const align = ctx.css('.card', 'align-items');
ctx.assert(justify === 'center', 'По горизонтали: justify-content: center, сейчас ' + justify, 'center', justify);
ctx.assert(align === 'center', 'По вертикали: align-items: center, сейчас ' + align, 'center', align);`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'flex-grow отвечает на вопрос «сколько свободного места забрать». 0 — нисколько, 1 — всё, что осталось.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Центрирование по обеим осям — это три строки: display: flex, justify-content: center, align-items: center. Карточка при этом остаётся flex-элементом снаружи и становится flex-контейнером внутри.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: '.rooms { display: flex; gap: 16px; } .card { display: flex; justify-content: center; align-items: center; } .card--wide { flex-grow: 1; }',
        penaltyPercent: 35,
      },
    ],
    solution: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; }

    .rooms {
      display: flex;
      gap: 16px;
    }

    .card {
      height: 160px;
      padding: 16px;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .card--wide {
      flex-grow: 1;
    }
  </style>
</head>
<body>
  <div class="rooms">
    <div class="card">Коворкинг</div>
    <div class="card card--wide">Аудитория на 100 мест</div>
    <div class="card">Кинозал</div>
  </div>
</body>
</html>`,
    solutionExplanation:
      'Один и тот же элемент бывает и flex-элементом, и flex-контейнером одновременно: снаружи карточка подчиняется правилам .rooms, внутри сама раскладывает свой текст. Это ключ к центрированию по обеим осям — justify-content работает вдоль основной оси, align-items поперёк неё. Свойство gap заменило собой отступы у соседей: не нужно вычитать margin у первого и последнего элемента.',
    maxScore: 14,
    estimatedMinutes: 20,
    examRefs: ['m2-design', 'm2-mobile'],
    planDays: ['day-03-2'],
    source: 'plan',
  },

  {
    id: 'task-css-keyframes-toast',
    title: 'Анимация по кадрам: уведомление выезжает сверху',
    kind: 'output',
    runtime: 'dom',
    difficulty: 3,
    tech: ['css'],
    topicIds: ['css-animations'],
    monthNo: 1,
    weekNo: 4,
    statement: `Третий модуль экзамена отдельным пунктом требует микроанимации. Сделайте самую частую из них — появление уведомления.

1. Опишите набор кадров с именем \`toast-in\`: в начале блок прозрачный и сдвинут вверх на 20px, в конце — на месте и непрозрачный.
2. Примените его к \`.toast\`. Длительность — **не больше 0.4 секунды**: в интерфейсе анимация должна быть незаметной, а не зрелищной.
3. После анимации уведомление остаётся видимым — не возвращается в начальное состояние.
4. Добавьте правило для \`prefers-reduced-motion: reduce\`, которое отключает анимацию. Есть люди, которым от движения на экране становится физически плохо, и в системе для этого есть переключатель.`,
    requirements: [
      'Описан @keyframes toast-in',
      'В .toast задана анимация с этим именем',
      'Длительность анимации не больше 0.4s',
      'После анимации блок остаётся видимым (opacity 1)',
      'Есть @media (prefers-reduced-motion: reduce), отключающий анимацию',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 24px; font-family: system-ui, sans-serif; background: #f8fafc; }

    /* 1. Кадры анимации toast-in */

    .toast {
      max-width: 320px;
      padding: 12px 16px;
      border-radius: 10px;
      background: #16a34a;
      color: #fff;
      /* 2-3. Применить анимацию */
    }

    /* 4. Отключить анимацию тем, кто её просил не показывать */
  </style>
</head>
<body>
  <div class="toast">Заявка отправлена</div>
</body>
</html>`,
    viewport: { width: 700, height: 300 },
    tests: [
      {
        id: 'keyframes-declared',
        name: 'Кадры описаны',
        type: 'dom',
        code: `const source = ctx.source || '';
ctx.assert(/@keyframes\\s+toast-in/.test(source), 'Не найден блок @keyframes toast-in');
ctx.assert(/opacity/.test(source), 'В кадрах должна меняться прозрачность (opacity)');
ctx.assert(/translatey/i.test(source.replace(/\\s/g, '')), 'В кадрах должен быть сдвиг по вертикали: transform: translateY(...)');`,
        points: 2,
      },
      {
        id: 'animation-applied',
        name: 'Анимация применена к .toast',
        type: 'dom',
        code: `const name = ctx.css('.toast', 'animation-name');
ctx.assert(name === 'toast-in', 'У .toast должно быть animation-name: toast-in, сейчас: ' + name, 'toast-in', name);`,
        points: 2,
      },
      {
        id: 'duration',
        name: 'Анимация короткая',
        type: 'dom',
        code: `const raw = ctx.css('.toast', 'animation-duration');
const seconds = raw.indexOf('ms') !== -1 ? parseFloat(raw) / 1000 : parseFloat(raw);
ctx.assert(seconds > 0, 'Длительность анимации не задана');
ctx.assert(seconds <= 0.4, 'Длительность должна быть не больше 0.4s, сейчас: ' + raw, '0.4s или меньше', raw);`,
        points: 2,
      },
      {
        id: 'stays-visible',
        name: 'После анимации уведомление видно',
        // Проверяем объявление, а не проигрывание: браузер притормаживает
        // анимации в фоновой вкладке, и ожидание по часам ненадёжно.
        type: 'dom',
        code: `const fill = ctx.css('.toast', 'animation-fill-mode');
ctx.assert(
  /forwards|both/.test(fill),
  'Нужен forwards: без него после анимации блок вернётся к прежним стилям и исчезнет. Сейчас animation-fill-mode: ' + fill,
  'forwards',
  fill,
);
const count = ctx.css('.toast', 'animation-iteration-count');
ctx.assert(count === '1', 'Уведомление появляется один раз, а не повторяется. Сейчас: ' + count, '1', count);
ctx.assert(
  parseFloat(ctx.css('.toast', 'opacity')) >= 0,
  'Блок должен остаться в разметке, а не удаляться после анимации',
);`,
        points: 3,
      },
      {
        id: 'reduced-motion',
        name: 'Движение можно отключить',
        type: 'dom',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(
  /prefers-reduced-motion\\s*:\\s*reduce/.test(source),
  'Нет правила @media (prefers-reduced-motion: reduce)',
);
const block = source.slice(source.indexOf('prefers-reduced-motion'));
ctx.assert(
  /animation\\s*:\\s*none|animation-name\\s*:\\s*none|animation-duration\\s*:\\s*0/.test(block),
  'Внутри правила анимацию нужно именно отключить: animation: none',
);`,
        points: 2,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Кадры описываются отдельно от элемента: @keyframes имя { from { … } to { … } }. Элемент потом на них ссылается свойством animation.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Чтобы блок остался в конечном состоянии, а не отскочил назад, нужно значение forwards в свойстве animation-fill-mode.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: '@keyframes toast-in { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } } .toast { animation: toast-in 0.3s ease-out forwards; } @media (prefers-reduced-motion: reduce) { .toast { animation: none; } }',
        penaltyPercent: 35,
      },
    ],
    solution: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 24px; font-family: system-ui, sans-serif; background: #f8fafc; }

    @keyframes toast-in {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .toast {
      max-width: 320px;
      padding: 12px 16px;
      border-radius: 10px;
      background: #16a34a;
      color: #fff;
      animation: toast-in 0.3s ease-out forwards;
    }

    @media (prefers-reduced-motion: reduce) {
      .toast {
        animation: none;
      }
    }
  </style>
</head>
<body>
  <div class="toast">Заявка отправлена</div>
</body>
</html>`,
    solutionExplanation:
      'Значение forwards в animation-fill-mode оставляет элемент в состоянии последнего кадра. Без него блок после анимации мгновенно вернулся бы к своим обычным стилям — то есть к opacity из таблицы стилей, а не из кадра to. Анимируются только opacity и transform: браузер умеет менять их, не пересчитывая раскладку страницы, поэтому такая анимация не дёргается даже на слабом ноутбуке.',
    maxScore: 11,
    estimatedMinutes: 20,
    examRefs: ['m3-animations', 'm2-design'],
    planDays: ['day-04-2'],
    source: 'plan',
  },

  {
    id: 'task-git-branch-order',
    title: 'Ветки Git: восстановить порядок команд',
    kind: 'fix-bug',
    runtime: 'dom',
    difficulty: 2,
    tech: ['git', 'html'],
    topicIds: ['git-branches'],
    monthNo: 1,
    weekNo: 4,
    statement: `Работа в ветке — это шесть шагов: отделиться от основной линии, поработать, вернуться и слить сделанное обратно.

Шаги в списке перемешаны. Переставьте элементы \`<li>\` так, чтобы значения \`data-step\` шли по порядку от 1 до 6 сверху вниз.

Менять сам текст и значения \`data-step\` нельзя — только порядок строк. Смысл упражнения в том, чтобы разобраться, почему шаги идут именно так: например, почему нельзя слить ветку, не вернувшись предварительно в \`main\`.`,
    requirements: [
      'Значения data-step идут по порядку: 1, 2, 3, 4, 5, 6',
      'Все шесть пунктов на месте',
      'Текст команд не изменён',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Работа в ветке</title>
</head>
<body>
  <h1>Порядок работы в ветке</h1>

  <ol id="flow">
    <li data-step="5">git merge feature/styles — слить правки в основную линию</li>
    <li data-step="1">git switch -c feature/styles — создать ветку и перейти в неё</li>
    <li data-step="4">git switch main — вернуться в основную линию</li>
    <li data-step="6">git branch -d feature/styles — удалить ветку, она больше не нужна</li>
    <li data-step="2">Править файлы: менять стили, проверять в браузере</li>
    <li data-step="3">git add . и git commit -m "Оформить карточки помещений"</li>
  </ol>
</body>
</html>`,
    viewport: { width: 800, height: 400 },
    tests: [
      {
        id: 'all-steps',
        name: 'Все шесть шагов на месте',
        type: 'dom',
        code: `const items = ctx.$$('#flow li');
ctx.assert(items.length === 6, 'Пунктов должно быть шесть, найдено: ' + items.length, 6, items.length);
const steps = items.map((li) => li.dataset.step).sort();
ctx.assert(steps.join(',') === '1,2,3,4,5,6', 'Значения data-step изменены или потеряны: ' + steps.join(','));`,
        points: 2,
      },
      {
        id: 'order',
        name: 'Шаги идут по порядку',
        type: 'dom',
        code: `const steps = ctx.$$('#flow li').map((li) => li.dataset.step);
ctx.assert(
  steps.join(',') === '1,2,3,4,5,6',
  'Порядок сейчас: ' + steps.join(', ') + '. Нужно 1, 2, 3, 4, 5, 6',
  '1,2,3,4,5,6',
  steps.join(','),
);`,
        points: 5,
      },
      {
        id: 'text-untouched',
        name: 'Текст команд не изменён',
        type: 'dom',
        code: `const byStep = {};
ctx.$$('#flow li').forEach((li) => {
  byStep[li.dataset.step] = li.textContent.trim();
});
ctx.assert(byStep['1'].indexOf('switch -c') !== -1, 'Текст первого шага изменён');
ctx.assert(byStep['3'].indexOf('commit') !== -1, 'Текст третьего шага изменён');
ctx.assert(byStep['5'].indexOf('merge') !== -1, 'Текст пятого шага изменён');
ctx.assert(byStep['6'].indexOf('branch -d') !== -1, 'Текст шестого шага изменён');`,
        points: 2,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Начните с того, что ветку сначала нужно создать, а в конце — удалить. Это первый и последний шаги.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Слияние всегда происходит в той ветке, куда вливают. Значит перед git merge надо перейти в main.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Порядок: создать ветку → править файлы → закоммитить → вернуться в main → слить → удалить ветку.',
        penaltyPercent: 35,
      },
    ],
    solution: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Работа в ветке</title>
</head>
<body>
  <h1>Порядок работы в ветке</h1>

  <ol id="flow">
    <li data-step="1">git switch -c feature/styles — создать ветку и перейти в неё</li>
    <li data-step="2">Править файлы: менять стили, проверять в браузере</li>
    <li data-step="3">git add . и git commit -m "Оформить карточки помещений"</li>
    <li data-step="4">git switch main — вернуться в основную линию</li>
    <li data-step="5">git merge feature/styles — слить правки в основную линию</li>
    <li data-step="6">git branch -d feature/styles — удалить ветку, она больше не нужна</li>
  </ol>
</body>
</html>`,
    solutionExplanation:
      'Самое неочевидное место — четвёртый шаг. Команда git merge вливает указанную ветку в ту, где вы сейчас находитесь. Если выполнить её, не выходя из feature/styles, Git попробует влить ветку саму в себя и ничего не произойдёт. Второе правило: коммит делается до перехода в main. Незакоммиченные правки переезжают между ветками вместе с вами и легко теряются.',
    maxScore: 9,
    estimatedMinutes: 12,
    examRefs: ['m1-git', 'm3-git'],
    planDays: ['day-04-3'],
    source: 'plan',
  },

  {
    id: 'task-project-login-page',
    title: 'Мини-проект: страница входа целиком',
    kind: 'app',
    runtime: 'dom',
    difficulty: 3,
    tech: ['html', 'css'],
    topicIds: ['design-basics'],
    monthNo: 1,
    weekNo: 4,
    statement: `Собираем первую настоящую страницу проекта «Конференции.РФ» — вход. Только свой CSS, никаких библиотек: Bootstrap будет во втором месяце.

**Шапка** \`<header>\`: название сайта слева, меню \`<nav>\` справа — в одну строку, прижаты к противоположным краям.

**Основная часть** \`<main>\`: форма входа карточкой по центру страницы.

- ширина карточки ограничена (\`max-width\` не больше 480px), сама карточка по центру;
- у карточки рамка, внутренние отступы и скруглённые углы;
- поля: логин и пароль, оба обязательные, у каждого подпись через \`for\`;
- кнопка «Войти» на всю ширину карточки;
- ссылка на страницу регистрации.

**Подвал** \`<footer>\` с любым текстом.`,
    requirements: [
      'Страница построена на <header>, <main> и <footer>',
      'Шапка выстроена флексом, содержимое разведено по краям',
      'Карточка формы ограничена по ширине и стоит по центру',
      'У карточки есть рамка, внутренний отступ и скругление',
      'Поля логина и пароля обязательные и связаны с подписями',
      'Кнопка входа занимает всю ширину карточки',
      'Есть ссылка на регистрацию',
      'Не подключено ни одной внешней библиотеки стилей',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Вход — Конференции.РФ</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; background: #f8fafc; color: #0f172a; }

    /* Шапка: название слева, меню справа */

    /* Карточка формы: по центру, ограниченной ширины */

  </style>
</head>
<body>
  <header>
    <!-- название сайта и меню -->
  </header>

  <main>
    <!-- карточка с формой входа -->
  </main>

  <footer>
    <!-- подвал -->
  </footer>
</body>
</html>`,
    viewport: { width: 900, height: 700 },
    tests: [
      {
        id: 'landmarks',
        name: 'Страница разбита на смысловые блоки',
        type: 'dom',
        code: `ctx.assert(ctx.$('header'), 'Нет шапки <header>');
ctx.assert(ctx.$('main'), 'Нет основной части <main>');
ctx.assert(ctx.$('footer'), 'Нет подвала <footer>');
ctx.assert(ctx.$('header nav'), 'В шапке нет меню <nav>');`,
        points: 2,
      },
      {
        id: 'header-flex',
        name: 'Шапка разведена по краям',
        type: 'dom',
        code: `const display = ctx.css('header', 'display');
ctx.assert(display === 'flex', 'Шапка должна быть flex-контейнером, сейчас: ' + display, 'flex', display);
const justify = ctx.css('header', 'justify-content');
ctx.assert(
  justify === 'space-between',
  'Название и меню разводятся по краям через justify-content: space-between, сейчас: ' + justify,
  'space-between',
  justify,
);`,
        points: 2,
      },
      {
        id: 'card-centered',
        name: 'Карточка ограничена по ширине и стоит по центру',
        type: 'dom',
        code: `const form = ctx.$('main form');
ctx.assert(form, 'В <main> нет формы');
const card = form.closest('div, section, article') || form;
const width = card.getBoundingClientRect().width;
ctx.assert(width <= 480, 'Карточка должна быть не шире 480px, сейчас: ' + Math.round(width) + 'px', '≤ 480', Math.round(width));
const rect = card.getBoundingClientRect();
const leftGap = Math.round(rect.left);
const rightGap = Math.round(ctx.document.documentElement.clientWidth - rect.right);
ctx.assert(
  Math.abs(leftGap - rightGap) <= 4,
  'Карточка не по центру: слева ' + leftGap + 'px, справа ' + rightGap + 'px. Помогает margin: 0 auto',
);`,
        points: 3,
      },
      {
        id: 'card-look',
        name: 'Карточка оформлена',
        type: 'dom',
        code: `const form = ctx.$('main form');
const card = form.closest('div, section, article') || form;
const borderWidth = parseFloat(ctx.css(card, 'border-top-width'));
ctx.assert(borderWidth > 0, 'У карточки нет рамки');
const padding = parseFloat(ctx.css(card, 'padding-top'));
ctx.assert(padding >= 12, 'Внутренний отступ карточки должен быть заметным, сейчас: ' + padding + 'px');
const radius = parseFloat(ctx.css(card, 'border-radius'));
ctx.assert(radius > 0, 'У карточки нет скругления углов');`,
        points: 2,
      },
      {
        id: 'fields',
        name: 'Поля формы на месте и связаны с подписями',
        type: 'dom',
        code: `const login = ctx.$('main form input[name="login"]');
const password = ctx.$('main form input[name="password"]');
ctx.assert(login, 'Нет поля с name="login"');
ctx.assert(password, 'Нет поля с name="password"');
ctx.assert(password.type === 'password', 'Пароль должен быть type="password"');
ctx.assert(login.required && password.required, 'Оба поля должны быть обязательными (required)');
[login, password].forEach((field) => {
  ctx.assert(field.id, 'У поля «' + field.name + '» нет id');
  ctx.assert(ctx.$('label[for="' + field.id + '"]'), 'Для поля «' + field.name + '» нет <label for="' + field.id + '">');
});`,
        points: 3,
      },
      {
        id: 'submit-full-width',
        name: 'Кнопка входа во всю ширину',
        type: 'dom',
        code: `const form = ctx.$('main form');
const button = ctx.$('button[type="submit"], button:not([type])', form);
ctx.assert(button, 'В форме нет кнопки отправки');
const buttonWidth = button.getBoundingClientRect().width;
const formWidth = form.getBoundingClientRect().width;
ctx.assert(
  buttonWidth >= formWidth - 4,
  'Кнопка должна занимать всю ширину: ' + Math.round(buttonWidth) + 'px из ' + Math.round(formWidth) + 'px',
);`,
        points: 2,
      },
      {
        id: 'register-link',
        name: 'Есть переход к регистрации',
        type: 'dom',
        code: `const links = ctx.$$('main a').filter((link) => /регистр/i.test(link.textContent));
ctx.assert(links.length >= 1, 'В основной части нет ссылки на регистрацию');
ctx.assert(links[0].getAttribute('href'), 'У ссылки на регистрацию нет адреса');`,
      },
      {
        id: 'no-libraries',
        name: 'Свой CSS, без библиотек',
        type: 'dom',
        code: `const external = ctx.$$('link[rel="stylesheet"][href]').filter((link) => /^https?:/.test(link.getAttribute('href')));
ctx.assert(external.length === 0, 'Подключена внешняя библиотека стилей: ' + external.map((l) => l.getAttribute('href')).join(', '));
ctx.assert(!/bootstrap/i.test(ctx.source || ''), 'Bootstrap в первом месяце использовать нельзя — вёрстка руками');`,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Карточка по центру — это max-width плюс margin: 0 auto. Автоматические боковые отступы делят свободное место поровну.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Кнопка во всю ширину — width: 100%. У кнопки по умолчанию ширина по содержимому, её нужно задать явно.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; } .card { max-width: 420px; margin: 40px auto; padding: 24px; border: 1px solid #cbd5e1; border-radius: 14px; background: #fff; } .card button { width: 100%; }',
        penaltyPercent: 35,
      },
    ],
    solution: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Вход — Конференции.РФ</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; background: #f8fafc; color: #0f172a; }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: #fff;
      border-bottom: 1px solid #e2e8f0;
    }

    header nav a { margin-left: 16px; color: #2563eb; }

    .card {
      max-width: 420px;
      margin: 40px auto;
      padding: 24px;
      background: #fff;
      border: 1px solid #cbd5e1;
      border-radius: 14px;
    }

    .card h2 { margin-top: 0; }

    .field { margin-bottom: 16px; }

    .field label { display: block; margin-bottom: 6px; font-weight: 600; }

    .field input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      box-sizing: border-box;
    }

    .card button {
      width: 100%;
      padding: 12px;
      border: 0;
      border-radius: 8px;
      background: #2563eb;
      color: #fff;
      font-size: 1rem;
      cursor: pointer;
    }

    footer {
      padding: 16px 24px;
      text-align: center;
      color: #475569;
    }
  </style>
</head>
<body>
  <header>
    <strong>Конференции.РФ</strong>
    <nav>
      <a href="index.html">Главная</a>
      <a href="rooms.html">Помещения</a>
    </nav>
  </header>

  <main>
    <div class="card">
      <h2>Вход</h2>
      <form>
        <div class="field">
          <label for="login">Логин</label>
          <input type="text" id="login" name="login" required minlength="6">
        </div>
        <div class="field">
          <label for="password">Пароль</label>
          <input type="password" id="password" name="password" required minlength="8">
        </div>
        <button type="submit">Войти</button>
      </form>
      <p>Ещё не зарегистрированы? <a href="register.html">Регистрация</a></p>
    </div>
  </main>

  <footer>© 2027 Конференции.РФ</footer>
</body>
</html>`,
    solutionExplanation:
      'Свойство box-sizing: border-box у полей — не украшение, а необходимость: без него ширина 100% считается по содержимому, а отступы и рамка прибавляются сверху, и поле вылезает за карточку. Ссылка «Регистрация» на странице входа — требование задания демоэкзамена: между формами входа и регистрации должен быть переход в обе стороны.',
    maxScore: 16,
    estimatedMinutes: 45,
    examRefs: ['m1-login', 'm1-register', 'm2-design'],
    planDays: ['day-04-4'],
    source: 'plan',
  },

  {
    id: 'task-project-cabinet-order',
    title: 'Мини-проект: кабинет со списком заявок',
    kind: 'app',
    runtime: 'dom',
    difficulty: 3,
    tech: ['html', 'css'],
    topicIds: ['design-basics', 'css-grid'],
    monthNo: 1,
    weekNo: 4,
    statement: `Продолжаем проект: страница «Личный кабинет». По заданию экзамена в кабинете пользователь видит историю своих заявок.

1. Сетка карточек \`.orders\`: три колонки одинаковой ширины на широком экране, расстояние между карточками 16px.
2. Не меньше трёх карточек-заявок. В каждой: помещение, дата в формате **ДД.ММ.ГГГГ**, и метка статуса с классом \`.status\`.
3. Метки статуса раскрашены по значению атрибута \`data-status\`: \`new\` — синяя, \`done\` — зелёная, \`rejected\` — красная. Селектор по атрибуту, а не три отдельных класса.
4. Заголовок страницы и шапка — как на странице входа.`,
    requirements: [
      '.orders — сетка из трёх равных колонок',
      'Расстояние между карточками 16px',
      'Карточек не меньше трёх',
      'В каждой карточке есть дата в формате ДД.ММ.ГГГГ',
      'В каждой карточке есть .status с атрибутом data-status',
      'Метки трёх статусов раскрашены разными цветами через селектор по атрибуту',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Личный кабинет — Конференции.РФ</title>
  <style>
    body { margin: 0; padding: 24px; font-family: system-ui, sans-serif; background: #f8fafc; }

    .orders {
      /* 1. Три равные колонки, расстояние 16px */
    }

    .card {
      padding: 16px;
      background: #fff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
    }

    .status {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 0.85rem;
    }

    /* 3. Цвета статусов через селектор по data-status */
  </style>
</head>
<body>
  <h1>Мои заявки</h1>

  <div class="orders">
    <!-- три карточки: помещение, дата, статус -->
  </div>
</body>
</html>`,
    viewport: { width: 900, height: 600 },
    tests: [
      {
        id: 'grid',
        name: 'Сетка из трёх равных колонок',
        type: 'dom',
        code: `const display = ctx.css('.orders', 'display');
ctx.assert(display === 'grid', 'У .orders должен быть display: grid, сейчас: ' + display, 'grid', display);
const columns = ctx.css('.orders', 'grid-template-columns').split(' ').filter(Boolean);
ctx.assert(columns.length === 3, 'Колонок должно быть три, сейчас: ' + columns.length, 3, columns.length);
const widths = columns.map((value) => Math.round(parseFloat(value)));
ctx.assert(widths[0] === widths[1] && widths[1] === widths[2], 'Колонки должны быть одинаковой ширины: ' + widths.join(', '));`,
        points: 3,
      },
      {
        id: 'gap',
        name: 'Расстояние между карточками 16px',
        type: 'dom',
        code: `const gap = parseFloat(ctx.css('.orders', 'column-gap'));
ctx.assert(gap === 16, 'Расстояние должно быть 16px, сейчас: ' + gap, 16, gap);`,
        points: 2,
      },
      {
        id: 'cards',
        name: 'Не меньше трёх заявок',
        type: 'dom',
        code: `const cards = ctx.$$('.orders .card');
ctx.assert(cards.length >= 3, 'Карточек должно быть не меньше трёх, найдено: ' + cards.length, 3, cards.length);`,
        points: 2,
      },
      {
        id: 'dates',
        name: 'Дата в формате ДД.ММ.ГГГГ',
        type: 'dom',
        code: `const cards = ctx.$$('.orders .card');
cards.forEach((card, index) => {
  const text = card.textContent;
  ctx.assert(
    /\\b\\d{2}\\.\\d{2}\\.\\d{4}\\b/.test(text),
    'В карточке ' + (index + 1) + ' нет даты в формате ДД.ММ.ГГГГ. Задание экзамена требует именно его',
  );
});`,
        points: 3,
      },
      {
        id: 'status-markup',
        name: 'У каждой заявки есть статус',
        type: 'dom',
        code: `const cards = ctx.$$('.orders .card');
const allowed = ['new', 'done', 'rejected'];
cards.forEach((card, index) => {
  const status = ctx.$('.status', card);
  ctx.assert(status, 'В карточке ' + (index + 1) + ' нет метки .status');
  const value = status.getAttribute('data-status');
  ctx.assert(
    allowed.indexOf(value) !== -1,
    'В карточке ' + (index + 1) + ' data-status должен быть new, done или rejected, сейчас: ' + value,
  );
});
const values = cards.map((card) => ctx.$('.status', card).getAttribute('data-status'));
const unique = values.filter((value, index) => values.indexOf(value) === index);
ctx.assert(unique.length === 3, 'Покажите все три статуса — по одной заявке на каждый. Сейчас: ' + unique.join(', '));`,
        points: 3,
      },
      {
        id: 'status-colors',
        name: 'Статусы раскрашены по-разному',
        type: 'dom',
        code: `const source = (ctx.source || '').replace(/\\s+/g, '');
ctx.assert(
  source.indexOf('[data-status=') !== -1,
  'Цвета задаются селектором по атрибуту: .status[data-status="new"] { … }',
);
const colors = {};
ctx.$$('.status').forEach((status) => {
  colors[status.getAttribute('data-status')] = ctx.css(status, 'background-color');
});
const list = Object.keys(colors).map((key) => colors[key]);
const unique = list.filter((value, index) => list.indexOf(value) === index);
ctx.assert(unique.length === 3, 'У трёх статусов должны быть три разных цвета фона, сейчас: ' + list.join(' | '));`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Три равные колонки в Grid: grid-template-columns: repeat(3, 1fr). Единица fr — это доля свободного места.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Селектор по атрибуту пишется в квадратных скобках: .status[data-status="done"]. Так один класс обслуживает все статусы.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: '.orders { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; } .status[data-status="new"] { background: #dbeafe; color: #1d4ed8; } — и по аналогии done и rejected.',
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
    body { margin: 0; padding: 24px; font-family: system-ui, sans-serif; background: #f8fafc; }

    .orders {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .card {
      padding: 16px;
      background: #fff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
    }

    .card h2 { margin: 0 0 8px; font-size: 1.05rem; }

    .status {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 0.85rem;
    }

    .status[data-status="new"] { background: #dbeafe; color: #1d4ed8; }
    .status[data-status="done"] { background: #dcfce7; color: #15803d; }
    .status[data-status="rejected"] { background: #fee2e2; color: #b91c1c; }
  </style>
</head>
<body>
  <h1>Мои заявки</h1>

  <div class="orders">
    <div class="card">
      <h2>Аудитория на 100 мест</h2>
      <p>12.03.2027</p>
      <span class="status" data-status="new">Новая</span>
    </div>
    <div class="card">
      <h2>Коворкинг</h2>
      <p>05.02.2027</p>
      <span class="status" data-status="done">Выполнена</span>
    </div>
    <div class="card">
      <h2>Кинозал</h2>
      <p>28.01.2027</p>
      <span class="status" data-status="rejected">Отклонена</span>
    </div>
  </div>
</body>
</html>`,
    solutionExplanation:
      'Селектор по атрибуту вместо трёх классов — не вопрос вкуса. Когда статус придёт из базы данных (а он придёт, в четвёртом месяце), в разметку попадёт именно его значение: new, done, rejected. Если цвета привязаны к атрибуту, ничего переделывать не нужно. Если к классам — придётся писать преобразование «значение из базы → имя класса». Формат даты ДД.ММ.ГГГГ взят из задания демоэкзамена дословно.',
    maxScore: 16,
    estimatedMinutes: 40,
    examRefs: ['m1-cabinet', 'm2-cabinet-ux'],
    planDays: ['day-04-5'],
    source: 'plan',
  },

  {
    id: 'task-project-admin-390',
    title: 'Мини-проект: таблица администратора на телефоне',
    kind: 'app',
    runtime: 'dom',
    difficulty: 3,
    tech: ['html', 'css'],
    topicIds: ['css-responsive', 'design-basics'],
    monthNo: 1,
    weekNo: 4,
    statement: `Последняя страница макета — панель администратора со списком всех заявок. Задание демоэкзамена требует совместимости с экраном **390 × 844**, а таблица из пяти колонок на такой ширине не помещается никак.

Классическое решение: на широком экране — таблица, на узком — те же данные карточками.

1. Таблица \`#orders-table\` с пятью колонками: номер, помещение, дата, оплата, статус. Не меньше трёх строк.
2. Список карточек \`#orders-cards\` с теми же тремя заявками.
3. По умолчанию (узкий экран) видны **карточки**, таблица скрыта. Начинаем с телефона — это и есть mobile first.
4. Медиазапрос от **768px**: показать таблицу, скрыть карточки.
5. Горизонтальной прокрутки на 390px быть не должно.

Песочница открыта в размере 390 × 844 — ровно как в задании.`,
    requirements: [
      'Есть таблица #orders-table с пятью колонками и тремя строками',
      'Есть список карточек #orders-cards с теми же заявками',
      'На узком экране видны карточки, таблица скрыта',
      'Есть медиазапрос min-width: 768px',
      'В медиазапросе таблица показывается, карточки скрываются',
      'На 390px нет горизонтальной прокрутки',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Заявки — администратор</title>
  <style>
    body { margin: 0; padding: 16px; font-family: system-ui, sans-serif; background: #f8fafc; }

    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px; border: 1px solid #cbd5e1; text-align: left; }

    .card {
      padding: 12px;
      margin-bottom: 12px;
      background: #fff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
    }

    /* 3. Узкий экран: карточки видны, таблица скрыта */

    /* 4. От 768px: наоборот */
  </style>
</head>
<body>
  <h1>Заявки</h1>

  <table id="orders-table">
    <!-- шапка и три строки -->
  </table>

  <div id="orders-cards">
    <!-- те же три заявки карточками -->
  </div>
</body>
</html>`,
    viewport: { width: 390, height: 844 },
    tests: [
      {
        id: 'table-structure',
        name: 'Таблица из пяти колонок и трёх заявок',
        type: 'dom',
        code: `const table = ctx.$('#orders-table');
ctx.assert(table, 'Нет таблицы с id="orders-table"');
const headers = ctx.$$('th', table);
ctx.assert(headers.length === 5, 'Колонок должно быть пять, найдено: ' + headers.length, 5, headers.length);
const rows = ctx.$$('tbody tr', table);
ctx.assert(rows.length >= 3, 'Строк с заявками должно быть не меньше трёх, найдено: ' + rows.length, 3, rows.length);`,
        points: 3,
      },
      {
        id: 'cards-structure',
        name: 'Те же заявки карточками',
        type: 'dom',
        code: `const cards = ctx.$$('#orders-cards .card');
ctx.assert(cards.length >= 3, 'Карточек должно быть не меньше трёх, найдено: ' + cards.length, 3, cards.length);
cards.forEach((card, index) => {
  ctx.assert(
    /\\b\\d{2}\\.\\d{2}\\.\\d{4}\\b/.test(card.textContent),
    'В карточке ' + (index + 1) + ' нет даты в формате ДД.ММ.ГГГГ',
  );
});`,
        points: 3,
      },
      {
        id: 'mobile-view',
        name: 'На узком экране видны карточки',
        type: 'dom',
        code: `const tableDisplay = ctx.css('#orders-table', 'display');
ctx.assert(tableDisplay === 'none', 'На 390px таблица должна быть скрыта, сейчас display: ' + tableDisplay, 'none', tableDisplay);
const cardsDisplay = ctx.css('#orders-cards', 'display');
ctx.assert(cardsDisplay !== 'none', 'На 390px карточки должны быть видны');`,
        points: 3,
      },
      {
        id: 'media-query',
        name: 'Есть медиазапрос от 768px',
        type: 'dom',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(/@media[^{]*min-width\\s*:\\s*768px/.test(source), 'Нет медиазапроса @media (min-width: 768px)');
const block = source.slice(source.search(/@media[^{]*min-width\\s*:\\s*768px/));
ctx.assert(/#orders-table/.test(block), 'Внутри медиазапроса таблица не показывается');
ctx.assert(/#orders-cards/.test(block), 'Внутри медиазапроса карточки не скрываются');`,
        points: 3,
      },
      {
        id: 'no-horizontal-scroll',
        name: 'Горизонтальной прокрутки нет',
        type: 'dom',
        code: `const root = ctx.document.documentElement;
ctx.assert(
  root.scrollWidth <= root.clientWidth + 1,
  'Страница уезжает вбок: ширина содержимого ' + root.scrollWidth + 'px при экране ' + root.clientWidth + 'px',
);`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Mobile first означает, что обычные правила пишутся для телефона, а медиазапрос добавляет изменения для широкого экрана.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Таблица прячется через display: none, а возвращается не через display: block, а через display: table — иначе она перестанет быть таблицей.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: '#orders-table { display: none; } @media (min-width: 768px) { #orders-table { display: table; } #orders-cards { display: none; } }',
        penaltyPercent: 35,
      },
    ],
    solution: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Заявки — администратор</title>
  <style>
    body { margin: 0; padding: 16px; font-family: system-ui, sans-serif; background: #f8fafc; }

    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px; border: 1px solid #cbd5e1; text-align: left; }

    .card {
      padding: 12px;
      margin-bottom: 12px;
      background: #fff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
    }

    .card p { margin: 4px 0; }

    /* Телефон — состояние по умолчанию */
    #orders-table { display: none; }

    @media (min-width: 768px) {
      #orders-table { display: table; }
      #orders-cards { display: none; }
    }
  </style>
</head>
<body>
  <h1>Заявки</h1>

  <table id="orders-table">
    <thead>
      <tr>
        <th>№</th>
        <th>Помещение</th>
        <th>Дата</th>
        <th>Оплата</th>
        <th>Статус</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Аудитория на 100 мест</td>
        <td>12.03.2027</td>
        <td>Картой</td>
        <td>Новая</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Коворкинг</td>
        <td>05.02.2027</td>
        <td>Наличными</td>
        <td>Выполнена</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Кинозал</td>
        <td>28.01.2027</td>
        <td>Картой</td>
        <td>Отклонена</td>
      </tr>
    </tbody>
  </table>

  <div id="orders-cards">
    <div class="card">
      <p><strong>№1 — Аудитория на 100 мест</strong></p>
      <p>12.03.2027 · Картой</p>
      <p>Новая</p>
    </div>
    <div class="card">
      <p><strong>№2 — Коворкинг</strong></p>
      <p>05.02.2027 · Наличными</p>
      <p>Выполнена</p>
    </div>
    <div class="card">
      <p><strong>№3 — Кинозал</strong></p>
      <p>28.01.2027 · Картой</p>
      <p>Отклонена</p>
    </div>
  </div>
</body>
</html>`,
    solutionExplanation:
      'Данные продублированы в разметке намеренно: пока это статический макет, другого способа нет. Начиная с третьего месяца список будет строиться из массива, и дублирование исчезнет само — один и тот же массив отрисуется то таблицей, то карточками. Обратите внимание на display: table при возврате таблицы: значение block превратило бы её в обычный блок, и колонки перестали бы выравниваться.',
    maxScore: 15,
    estimatedMinutes: 40,
    examRefs: ['m1-admin', 'm2-mobile', 'm3-mobile'],
    planDays: ['day-04-6'],
    source: 'plan',
  },
];
