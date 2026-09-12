import type { Quiz } from '../types';

/** Месяц 1: веб, инструменты, HTML, CSS, Git, дизайн. */
export const MONTH_01_QUIZZES: Quiz[] = [
  {
    id: 'quiz-web-basics',
    title: 'Как устроен веб',
    topicIds: ['web-basics'],
    tech: ['tools'],
    monthNo: 1,
    difficulty: 1,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Какой код ответа сервер вернёт, если пользователь не авторизован?',
        options: [
          { id: 'a', text: '200' },
          { id: 'b', text: '401' },
          { id: 'c', text: '404' },
          { id: 'd', text: '500' },
        ],
        correct: 'b',
        explanation:
          '401 Unauthorized — нет или неверен токен. 403 — токен есть, но прав не хватает. 404 — ресурса нет, 500 — ошибка на сервере.',
      },
      {
        id: 'q2',
        type: 'match',
        text: 'Сопоставьте код ответа и ситуацию.',
        left: [
          { id: 'l1', text: '200' },
          { id: 'l2', text: '400' },
          { id: 'l3', text: '404' },
          { id: 'l4', text: '500' },
        ],
        right: [
          { id: 'r1', text: 'Всё хорошо, данные в ответе' },
          { id: 'r2', text: 'Клиент прислал некорректные данные' },
          { id: 'r3', text: 'Такого адреса нет' },
          { id: 'r4', text: 'Ошибка внутри сервера' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation:
          'Коды 4xx — виноват клиент, коды 5xx — виноват сервер. Это первое, на что смотрят во вкладке Network.',
      },
      {
        id: 'q3',
        type: 'boolean',
        text: 'База данных находится на стороне браузера и доступна клиентскому коду напрямую.',
        correct: false,
        explanation:
          'База живёт рядом с сервером. Браузер к ней не обращается — он делает запросы к API, а сервер уже ходит в базу.',
      },
      {
        id: 'q4',
        type: 'multiple',
        text: 'Что входит в HTTP-запрос?',
        options: [
          { id: 'a', text: 'Метод (GET, POST, …)' },
          { id: 'b', text: 'Адрес (URL)' },
          { id: 'c', text: 'Заголовки' },
          { id: 'd', text: 'Тело (не у всех методов)' },
          { id: 'e', text: 'Скорость интернета пользователя' },
        ],
        correct: ['a', 'b', 'c', 'd'],
        explanation:
          'Запрос — это метод, адрес, заголовки и (для POST/PATCH/PUT) тело. Ответ — код состояния, заголовки и тело.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Что такое API в контексте проекта экзамена?',
        options: [
          { id: 'a', text: 'Библиотека стилей для оформления страниц' },
          { id: 'b', text: 'Набор адресов сервера, к которым обращается клиент, чтобы получить или изменить данные' },
          { id: 'c', text: 'Программа для работы с базой данных' },
          { id: 'd', text: 'Файл настроек проекта' },
        ],
        correct: 'b',
        explanation:
          'API — это договор между клиентом и сервером: какие адреса есть, какие методы они принимают и что возвращают.',
      },
    ],
  },

  {
    id: 'quiz-tools-vscode',
    title: 'VS Code и Emmet',
    topicIds: ['tools-vscode'],
    tech: ['tools'],
    monthNo: 1,
    difficulty: 1,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Что развернёт Emmet-сокращение `ul>li*3`?',
        options: [
          { id: 'a', text: 'Три списка, в каждом по одному пункту' },
          { id: 'b', text: 'Один список с тремя пунктами' },
          { id: 'c', text: 'Список и три абзаца рядом' },
          { id: 'd', text: 'Ничего, это неверный синтаксис' },
        ],
        correct: 'b',
        explanation: '`>` — вложенность, `*3` — повтор. Получится `<ul><li></li><li></li><li></li></ul>`.',
      },
      {
        id: 'q2',
        type: 'match',
        text: 'Сопоставьте сочетание клавиш и действие.',
        left: [
          { id: 'l1', text: 'Ctrl+Space' },
          { id: 'l2', text: 'Ctrl+.' },
          { id: 'l3', text: 'F2' },
          { id: 'l4', text: 'Shift+Alt+F' },
        ],
        right: [
          { id: 'r1', text: 'Показать автодополнение' },
          { id: 'r2', text: 'Быстрое исправление и автоимпорт' },
          { id: 'r3', text: 'Переименовать во всём проекте' },
          { id: 'r4', text: 'Отформатировать файл' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation:
          'Ctrl+. чаще всего нужен для автоимпорта: редактор сам добавит строку import. F2 переименовывает безопасно — по всем файлам сразу.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Какое сокращение развернётся в полный каркас HTML-документа?',
        options: [
          { id: 'a', text: 'html5' },
          { id: 'b', text: '!' },
          { id: 'c', text: 'doc' },
          { id: 'd', text: 'start' },
        ],
        correct: 'b',
        explanation:
          'Восклицательный знак и Tab — самый быстрый способ получить DOCTYPE, html, head с meta и body.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'На экзамене полезно уметь работать без расширений редактора — например, запустив `code --disable-extensions`.',
        correct: true,
        explanation:
          'На экзаменационном компьютере привычных расширений может не быть. Тренируйтесь на голом редакторе, чтобы это не стало сюрпризом.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Где в VS Code делать коммит без командной строки?',
        options: [
          { id: 'a', text: 'В панели Explorer' },
          { id: 'b', text: 'В панели Search' },
          { id: 'c', text: 'В панели Source Control' },
          { id: 'd', text: 'В панели Run and Debug' },
        ],
        correct: 'c',
        explanation:
          'Source Control (Ctrl+Shift+G) показывает изменённые файлы, позволяет добавить их в коммит и ввести сообщение.',
      },
    ],
  },

  {
    id: 'quiz-html-structure',
    title: 'Структура HTML-документа',
    topicIds: ['html-structure'],
    tech: ['html'],
    monthNo: 1,
    difficulty: 1,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Что произойдёт, если убрать `<meta charset="UTF-8">`?',
        options: [
          { id: 'a', text: 'Страница не откроется' },
          { id: 'b', text: 'Кириллица может отобразиться нечитаемыми символами' },
          { id: 'c', text: 'Пропадут стили' },
          { id: 'd', text: 'Ничего не изменится' },
        ],
        correct: 'b',
        explanation:
          'Без указания кодировки браузер может выбрать не ту и показать «кракозябры». Для русского интерфейса это критично.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Зачем нужен `<meta name="viewport" content="width=device-width, initial-scale=1">`?',
        options: [
          { id: 'a', text: 'Чтобы страница масштабировалась под ширину устройства' },
          { id: 'b', text: 'Чтобы работали медиазапросы на телефоне' },
          { id: 'c', text: 'Оба варианта верны' },
          { id: 'd', text: 'Это устаревший тег' },
        ],
        correct: 'c',
        explanation:
          'Без этой строки телефон показывает «уменьшенный десктоп», и медиазапросы фактически не срабатывают. Требование про экран 390×844 без неё не выполнить.',
      },
      {
        id: 'q3',
        type: 'boolean',
        text: 'На одной странице допустимо использовать несколько тегов `<h1>` для важных блоков.',
        correct: false,
        explanation:
          'h1 — заголовок всей страницы, он должен быть один. Дальше идут h2, h3 по уровням вложенности, без пропусков.',
      },
      {
        id: 'q4',
        type: 'order',
        text: 'Расставьте элементы в порядке, в котором они идут в документе.',
        items: [
          { id: 'i1', text: '<!DOCTYPE html>' },
          { id: 'i2', text: '<html lang="ru">' },
          { id: 'i3', text: '<head> с meta и title' },
          { id: 'i4', text: '<body> с содержимым' },
        ],
        correct: ['i1', 'i2', 'i3', 'i4'],
        explanation: 'DOCTYPE → html → head → body. Порядок фиксированный.',
      },
      {
        id: 'q5',
        type: 'match',
        text: 'Сопоставьте тег и его назначение.',
        left: [
          { id: 'l1', text: '<p>' },
          { id: 'l2', text: '<strong>' },
          { id: 'l3', text: '<br>' },
          { id: 'l4', text: '<hr>' },
        ],
        right: [
          { id: 'r1', text: 'Абзац текста' },
          { id: 'r2', text: 'Важный текст (обычно жирный)' },
          { id: 'r3', text: 'Перенос строки' },
          { id: 'r4', text: 'Разделительная линия' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation: 'strong и em несут смысл, b и i — только оформление. На экзамене разницы не проверяют, но привычка полезная.',
      },
    ],
  },

  {
    id: 'quiz-html-links',
    title: 'Ссылки, изображения, списки',
    topicIds: ['html-links-images'],
    tech: ['html'],
    monthNo: 1,
    difficulty: 1,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Какой атрибут изображения обязателен?',
        options: [
          { id: 'a', text: 'title' },
          { id: 'b', text: 'alt' },
          { id: 'c', text: 'width' },
          { id: 'd', text: 'loading' },
        ],
        correct: 'b',
        explanation:
          'alt описывает изображение: он читается скринридерами и показывается, если картинка не загрузилась.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Зачем к `target="_blank"` добавляют `rel="noopener"`?',
        options: [
          { id: 'a', text: 'Чтобы ссылка открывалась быстрее' },
          { id: 'b', text: 'Чтобы открытая страница не получила доступ к вашей через window.opener' },
          { id: 'c', text: 'Чтобы ссылка попала в историю браузера' },
          { id: 'd', text: 'Это требование валидатора HTML' },
        ],
        correct: 'b',
        explanation:
          'Без noopener новая вкладка может через window.opener подменить адрес исходной страницы. Это известная дыра.',
      },
      {
        id: 'q3',
        type: 'boolean',
        text: 'Внутри React для перехода между страницами приложения нужно использовать обычный `<a href>`.',
        correct: false,
        explanation:
          'Обычная ссылка перезагружает приложение целиком и теряет состояние. В React Router используется `<Link to="…">`.',
      },
      {
        id: 'q4',
        type: 'multiple',
        text: 'Что верно про относительные и абсолютные пути?',
        options: [
          { id: 'a', text: '`./images/logo.png` — относительный путь' },
          { id: 'b', text: '`https://site.ru/logo.png` — абсолютный путь' },
          { id: 'c', text: 'Относительный путь считается от текущего файла' },
          { id: 'd', text: 'Абсолютный путь всегда быстрее загружается' },
        ],
        correct: ['a', 'b', 'c'],
        explanation:
          'Скорость от вида пути не зависит. На экзамене интернета нет, поэтому все ресурсы должны лежать в проекте и подключаться относительными путями.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Какой тег используется для нумерованного списка?',
        options: [
          { id: 'a', text: '<ul>' },
          { id: 'b', text: '<ol>' },
          { id: 'c', text: '<dl>' },
          { id: 'd', text: '<list>' },
        ],
        correct: 'b',
        explanation: 'ol — ordered list (нумерованный), ul — unordered list (маркированный). Внутри обоих — li.',
      },
    ],
  },

  {
    id: 'quiz-git-basics',
    title: 'Git: репозиторий и коммиты',
    topicIds: ['git-basics'],
    tech: ['git'],
    monthNo: 1,
    difficulty: 1,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'order',
        text: 'Расставьте команды в порядке первого коммита в новом проекте.',
        items: [
          { id: 'i1', text: 'git init' },
          { id: 'i2', text: 'создать .gitignore с node_modules' },
          { id: 'i3', text: 'git add .' },
          { id: 'i4', text: 'git commit -m "Старт проекта"' },
        ],
        correct: ['i1', 'i2', 'i3', 'i4'],
        explanation:
          '.gitignore создаётся ДО первого `git add .`, иначе в коммит попадут тысячи файлов из node_modules.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Что обязательно должно быть в `.gitignore` проекта экзамена?',
        options: [
          { id: 'a', text: 'src/' },
          { id: 'b', text: 'node_modules/' },
          { id: 'c', text: 'package.json' },
          { id: 'd', text: 'index.html' },
        ],
        correct: 'b',
        explanation:
          'node_modules восстанавливается командой npm install, коммитить её не нужно. Туда же обычно добавляют .env и dist/.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Сколько коммитов минимум требует задание в каждом модуле?',
        options: [
          { id: 'a', text: 'Один' },
          { id: 'b', text: 'Два' },
          { id: 'c', text: 'Три' },
          { id: 'd', text: 'Количество не оговорено' },
        ],
        correct: 'c',
        explanation:
          'В каждом модуле требуется не менее трёх коммитов. Проще всего коммитить после каждого завершённого этапа.',
      },
      {
        id: 'q4',
        type: 'match',
        text: 'Сопоставьте команду и результат.',
        left: [
          { id: 'l1', text: 'git status' },
          { id: 'l2', text: 'git add .' },
          { id: 'l3', text: 'git log --oneline' },
          { id: 'l4', text: 'git restore <файл>' },
        ],
        right: [
          { id: 'r1', text: 'Показать, что изменилось' },
          { id: 'r2', text: 'Подготовить все изменения к коммиту' },
          { id: 'r3', text: 'Показать историю коротким списком' },
          { id: 'r4', text: 'Отменить незакоммиченные правки в файле' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation: 'git restore возвращает файл к состоянию последнего коммита — незакоммиченные правки теряются.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Коммит стоит делать один раз в конце работы, чтобы не засорять историю.',
        correct: false,
        explanation:
          'Наоборот: коммит после каждого рабочего этапа — это страховка. Сломали что-то — вернулись к последнему рабочему состоянию.',
      },
    ],
  },

  {
    id: 'quiz-html-semantic',
    title: 'Семантика и таблицы',
    topicIds: ['html-semantic'],
    tech: ['html'],
    monthNo: 1,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'match',
        text: 'Сопоставьте семантический тег и его роль на странице.',
        left: [
          { id: 'l1', text: '<header>' },
          { id: 'l2', text: '<nav>' },
          { id: 'l3', text: '<main>' },
          { id: 'l4', text: '<footer>' },
        ],
        right: [
          { id: 'r1', text: 'Шапка' },
          { id: 'r2', text: 'Навигационное меню' },
          { id: 'r3', text: 'Основное содержимое страницы' },
          { id: 'r4', text: 'Подвал' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation: 'main на странице должен быть один — он обозначает уникальное содержимое.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Когда `<div>` уместнее семантического тега?',
        options: [
          { id: 'a', text: 'Никогда, div устарел' },
          { id: 'b', text: 'Когда элемент нужен только для вёрстки и не несёт смысла' },
          { id: 'c', text: 'Когда внутри есть заголовок' },
          { id: 'd', text: 'Когда блок повторяется несколько раз' },
        ],
        correct: 'b',
        explanation:
          'div — «обёртка без смысла». Если блок является разделом с заголовком — это section, если самостоятельная карточка — article.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Какой атрибут указывают у заголовка столбца таблицы?',
        options: [
          { id: 'a', text: 'scope="col"' },
          { id: 'b', text: 'type="col"' },
          { id: 'c', text: 'role="column"' },
          { id: 'd', text: 'data-col' },
        ],
        correct: 'a',
        explanation: 'scope="col" говорит скринридеру, что `<th>` подписывает столбец; scope="row" — строку.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Широкую таблицу на телефоне нужно оборачивать в контейнер с горизонтальной прокруткой.',
        correct: true,
        explanation:
          'Иначе появится прокрутка всей страницы, а это прямое нарушение требования «нет горизонтальной прокрутки» на 390×844. В Bootstrap для этого есть класс table-responsive.',
      },
      {
        id: 'q5',
        type: 'multiple',
        text: 'Какие теги относятся к структуре таблицы?',
        options: [
          { id: 'a', text: 'thead' },
          { id: 'b', text: 'tbody' },
          { id: 'c', text: 'tr' },
          { id: 'd', text: 'caption' },
          { id: 'e', text: 'tcol' },
        ],
        correct: ['a', 'b', 'c', 'd'],
        explanation: 'Тега tcol не существует. caption — подпись таблицы, ставится сразу после открывающего table.',
      },
    ],
  },

  {
    id: 'quiz-tools-devtools',
    title: 'DevTools',
    topicIds: ['tools-devtools'],
    tech: ['tools'],
    monthNo: 1,
    difficulty: 1,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Какое сочетание включает режим устройства для проверки мобильной версии?',
        options: [
          { id: 'a', text: 'Ctrl+Shift+M' },
          { id: 'b', text: 'Ctrl+Shift+P' },
          { id: 'c', text: 'Ctrl+M' },
          { id: 'd', text: 'Alt+D' },
        ],
        correct: 'a',
        explanation:
          'Ctrl+Shift+M переключает Device Toolbar. Размер 390×844 вводится вручную в поля ширины и высоты.',
      },
      {
        id: 'q2',
        type: 'match',
        text: 'Сопоставьте вкладку DevTools и задачу.',
        left: [
          { id: 'l1', text: 'Elements' },
          { id: 'l2', text: 'Console' },
          { id: 'l3', text: 'Network' },
          { id: 'l4', text: 'Application' },
        ],
        right: [
          { id: 'r1', text: 'Посмотреть разметку и применённые стили' },
          { id: 'r2', text: 'Увидеть ошибки JavaScript' },
          { id: 'r3', text: 'Проверить запрос, его тело и код ответа' },
          { id: 'r4', text: 'Посмотреть, что лежит в localStorage' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation:
          'На экзамене эти четыре вкладки закрывают почти всю отладку: «почему не работает», «что ушло на сервер», «что пришло обратно».',
      },
      {
        id: 'q3',
        type: 'boolean',
        text: 'Красная надпись в Console почти всегда указывает файл и строку, где произошла ошибка.',
        correct: true,
        explanation:
          'Первое действие при «ничего не работает» — открыть Console и прочитать сообщение до конца. Ссылка справа ведёт к строке кода.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Во вкладке Network запрос подсвечен красным, код ответа 401. Что это значит?',
        options: [
          { id: 'a', text: 'Сервер не запущен' },
          { id: 'b', text: 'Запрос ушёл без токена или токен неверный' },
          { id: 'c', text: 'Ошибка в SQL-запросе' },
          { id: 'd', text: 'Неправильный адрес маршрута' },
        ],
        correct: 'b',
        explanation:
          'Проверьте заголовок Authorization в разделе Headers. Чаще всего токен не подставился или истёк.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Изменения стилей, сделанные прямо в панели Elements, сохраняются в файл проекта.',
        correct: false,
        explanation:
          'Это временная правка в памяти браузера: после перезагрузки она исчезнет. Панель удобна, чтобы подобрать значение, а потом перенести его в CSS.',
      },
    ],
  },

  {
    id: 'quiz-html-forms',
    title: 'Формы и встроенная валидация',
    topicIds: ['html-forms'],
    tech: ['html'],
    monthNo: 1,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Зачем полю нужен атрибут `name`?',
        options: [
          { id: 'a', text: 'Для оформления через CSS' },
          { id: 'b', text: 'Под этим именем значение уходит на сервер' },
          { id: 'c', text: 'Чтобы поле стало обязательным' },
          { id: 'd', text: 'Для подписи рядом с полем' },
        ],
        correct: 'b',
        explanation:
          'Без name поле не участвует в отправке формы. Для оформления есть class, для подписи — label, для обязательности — required.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Как связать подпись с полем?',
        options: [
          { id: 'a', text: '<label name="login">' },
          { id: 'b', text: '<label for="login"> и <input id="login">' },
          { id: 'c', text: '<label href="#login">' },
          { id: 'd', text: 'Достаточно поставить label рядом' },
        ],
        correct: 'b',
        explanation:
          'label for должен совпадать с id поля. Тогда клик по подписи ставит курсор в поле, и скринридер читает их вместе.',
      },
      {
        id: 'q3',
        type: 'multiple',
        text: 'Какие атрибуты дают встроенную проверку значения?',
        options: [
          { id: 'a', text: 'required' },
          { id: 'b', text: 'minlength' },
          { id: 'c', text: 'pattern' },
          { id: 'd', text: 'placeholder' },
          { id: 'e', text: 'autocomplete' },
        ],
        correct: ['a', 'b', 'c'],
        explanation:
          'placeholder — это подсказка внутри поля, она не проверяет ничего и не заменяет label. autocomplete влияет только на автозаполнение.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Встроенной HTML-валидации достаточно, серверную проверку можно не делать.',
        correct: false,
        explanation:
          'Любую клиентскую проверку легко обойти: запрос можно отправить и без браузера. Сервер обязан проверять всё заново.',
      },
      {
        id: 'q5',
        type: 'match',
        text: 'Сопоставьте тип поля и подходящие данные.',
        left: [
          { id: 'l1', text: 'type="password"' },
          { id: 'l2', text: 'type="email"' },
          { id: 'l3', text: 'type="tel"' },
          { id: 'l4', text: 'type="checkbox"' },
        ],
        right: [
          { id: 'r1', text: 'Пароль, символы скрыты' },
          { id: 'r2', text: 'Адрес электронной почты' },
          { id: 'r3', text: 'Номер телефона' },
          { id: 'r4', text: 'Согласие: да или нет' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation:
          'На телефоне тип поля ещё и определяет вид клавиатуры: для tel откроется цифровая, для email — с собакой.',
      },
    ],
  },

  {
    id: 'quiz-css-basics',
    title: 'CSS: селекторы, цвета, единицы',
    topicIds: ['css-basics'],
    tech: ['css'],
    monthNo: 1,
    difficulty: 1,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'match',
        text: 'Сопоставьте селектор и то, что он выбирает.',
        left: [
          { id: 'l1', text: 'p' },
          { id: 'l2', text: '.card' },
          { id: 'l3', text: '#main' },
          { id: 'l4', text: '.card p' },
        ],
        right: [
          { id: 'r1', text: 'Все абзацы' },
          { id: 'r2', text: 'Все элементы с классом card' },
          { id: 'r3', text: 'Элемент с id="main"' },
          { id: 'r4', text: 'Абзацы внутри элементов с классом card' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation: 'Пробел между селекторами означает «внутри», то есть любой потомок, не обязательно прямой.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Чем `rem` отличается от `em`?',
        options: [
          { id: 'a', text: 'Ничем, это синонимы' },
          { id: 'b', text: 'rem считается от размера шрифта корневого элемента, em — от размера шрифта родителя' },
          { id: 'c', text: 'rem работает только для отступов' },
          { id: 'd', text: 'em — это всегда 16px' },
        ],
        correct: 'b',
        explanation:
          'Из-за привязки к родителю вложенные em умножаются, и размеры «плывут». rem предсказуем, поэтому его чаще используют для типографики.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как правильно объявить и использовать CSS-переменную?',
        options: [
          { id: 'a', text: '$main: #0d6efd; color: $main;' },
          { id: 'b', text: '--main: #0d6efd; color: var(--main);' },
          { id: 'c', text: '@main: #0d6efd; color: @main;' },
          { id: 'd', text: 'var main = #0d6efd; color: main;' },
        ],
        correct: 'b',
        explanation:
          'Переменные объявляют обычно в `:root`, а читают через var(). Второй аргумент var() задаёт значение по умолчанию.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Подключить внешний файл стилей можно тегом `<link rel="stylesheet" href="style.css">` в `<head>`.',
        correct: true,
        explanation:
          'Это основной способ. Тег style внутри head и атрибут style у элемента — запасные варианты, в проекте их лучше избегать.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Что означает запись `hsl(210, 100%, 50%)`?',
        options: [
          { id: 'a', text: 'Оттенок 210°, насыщенность 100%, светлота 50%' },
          { id: 'b', text: 'Красный 210, зелёный 100, синий 50' },
          { id: 'c', text: 'Прозрачность 50%' },
          { id: 'd', text: 'Размер тени' },
        ],
        correct: 'a',
        explanation:
          'HSL удобен тем, что светлые и тёмные оттенки одного цвета получаются изменением одного числа — светлоты.',
      },
    ],
  },

  {
    id: 'quiz-css-typography',
    title: 'Текст, каскад, специфичность',
    topicIds: ['css-typography'],
    tech: ['css'],
    monthNo: 1,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'order',
        text: 'Расставьте по возрастанию силы (специфичности).',
        items: [
          { id: 'i1', text: 'Селектор по тегу' },
          { id: 'i2', text: 'Селектор по классу' },
          { id: 'i3', text: 'Селектор по id' },
          { id: 'i4', text: 'Атрибут style у элемента' },
          { id: 'i5', text: '!important' },
        ],
        correct: ['i1', 'i2', 'i3', 'i4', 'i5'],
        explanation:
          'Знание порядка помогает понять, почему «стиль не применяется»: обычно его перебивает более сильный селектор.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Зачем в `font-family` перечисляют несколько шрифтов?',
        options: [
          { id: 'a', text: 'Браузер смешает их в один' },
          { id: 'b', text: 'Это запасные варианты, если первый шрифт недоступен' },
          { id: 'c', text: 'Каждый шрифт применится к своему языку' },
          { id: 'd', text: 'Для ускорения загрузки' },
        ],
        correct: 'b',
        explanation:
          'Список читается слева направо. Последним ставят общее семейство: sans-serif, serif или monospace.',
      },
      {
        id: 'q3',
        type: 'multiple',
        text: 'Какие свойства наследуются дочерними элементами?',
        options: [
          { id: 'a', text: 'color' },
          { id: 'b', text: 'font-family' },
          { id: 'c', text: 'line-height' },
          { id: 'd', text: 'border' },
          { id: 'e', text: 'padding' },
        ],
        correct: ['a', 'b', 'c'],
        explanation:
          'Наследуются в основном текстовые свойства. Рамки, отступы и размеры — нет, их задают каждому элементу отдельно.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: '`!important` — нормальный способ решать конфликты стилей в учебном проекте.',
        correct: false,
        explanation:
          'Он лечит симптом и ломает каскад: следующий конфликт придётся решать ещё одним !important. Правильнее разобраться с селектором.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Какое значение `line-height` считается удобным для основного текста?',
        options: [
          { id: 'a', text: '0.8' },
          { id: 'b', text: '1' },
          { id: 'c', text: '1.5' },
          { id: 'd', text: '3' },
        ],
        correct: 'c',
        explanation:
          'Примерно 1.4–1.6 — читаемый интервал. Единица без указания размера удобна: интервал считается от размера шрифта элемента.',
      },
    ],
  },

  {
    id: 'quiz-css-box-model',
    title: 'Блочная модель',
    topicIds: ['css-box-model'],
    tech: ['css'],
    monthNo: 1,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Элементу задано `width: 200px; padding: 20px; border: 2px solid`. Какова его реальная ширина при `box-sizing: content-box`?',
        options: [
          { id: 'a', text: '200px' },
          { id: 'b', text: '224px' },
          { id: 'c', text: '244px' },
          { id: 'd', text: '260px' },
        ],
        correct: 'c',
        explanation: '200 + 20·2 + 2·2 = 244px. Именно из-за этой арифметики всем элементам обычно задают border-box.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Что делает `box-sizing: border-box`?',
        options: [
          { id: 'a', text: 'Убирает отступы' },
          { id: 'b', text: 'Включает padding и border в заданную ширину' },
          { id: 'c', text: 'Добавляет рамку ко всем элементам' },
          { id: 'd', text: 'Запрещает элементу выходить за границы родителя' },
        ],
        correct: 'b',
        explanation:
          'При border-box `width: 200px` означает 200px вместе с рамкой и внутренними отступами — так считать намного проще.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Чем padding отличается от margin?',
        options: [
          { id: 'a', text: 'padding — снаружи рамки, margin — внутри' },
          { id: 'b', text: 'padding — внутри рамки (между содержимым и рамкой), margin — снаружи' },
          { id: 'c', text: 'Это одно и то же' },
          { id: 'd', text: 'margin работает только по горизонтали' },
        ],
        correct: 'b',
        explanation:
          'Фон элемента заливает padding, но не margin. Если нужно «воздуха внутри карточки» — padding, «расстояние между карточками» — margin или gap.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Вертикальные margin соседних блоков схлопываются: остаётся больший, а не их сумма.',
        correct: true,
        explanation:
          'Классический сюрприз: 20px снизу и 30px сверху дают 30px, а не 50px. Чтобы этого избежать, в раскладках используют gap.',
      },
      {
        id: 'q5',
        type: 'match',
        text: 'Сопоставьте значение display и поведение.',
        left: [
          { id: 'l1', text: 'block' },
          { id: 'l2', text: 'inline' },
          { id: 'l3', text: 'inline-block' },
          { id: 'l4', text: 'none' },
        ],
        right: [
          { id: 'r1', text: 'Занимает всю ширину, начинается с новой строки' },
          { id: 'r2', text: 'В строке текста, ширина и высота не задаются' },
          { id: 'r3', text: 'В строке, но ширина и высота работают' },
          { id: 'r4', text: 'Элемент не отображается и не занимает места' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation:
          'visibility: hidden скрывает элемент, но место остаётся. display: none убирает его из потока полностью.',
      },
    ],
  },

  {
    id: 'quiz-css-pseudo',
    title: 'Псевдоклассы',
    topicIds: ['css-pseudo'],
    tech: ['css'],
    monthNo: 1,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'match',
        text: 'Сопоставьте псевдокласс и состояние.',
        left: [
          { id: 'l1', text: ':hover' },
          { id: 'l2', text: ':focus' },
          { id: 'l3', text: ':disabled' },
          { id: 'l4', text: ':checked' },
        ],
        right: [
          { id: 'r1', text: 'Курсор наведён' },
          { id: 'r2', text: 'Элемент в фокусе' },
          { id: 'r3', text: 'Элемент отключён' },
          { id: 'r4', text: 'Переключатель отмечен' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation:
          'В задании требуются состояния элементов — именно эти псевдоклассы их и описывают. На телефоне :hover фактически не работает.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'В чём подвох `:invalid` у пустого обязательного поля?',
        options: [
          { id: 'a', text: 'Он не работает с required' },
          { id: 'b', text: 'Пустое обязательное поле считается некорректным сразу, и красная рамка появляется до ввода' },
          { id: 'c', text: 'Он срабатывает только после отправки формы' },
          { id: 'd', text: 'Он работает только для type="email"' },
        ],
        correct: 'b',
        explanation:
          'Форма краснеет ещё до того, как пользователь что-то ввёл. Поэтому обычно используют класс is-invalid, который ставится кодом после проверки.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Какой селектор сделает чётные строки таблицы полосатыми?',
        options: [
          { id: 'a', text: 'tr:nth-child(even)' },
          { id: 'b', text: 'tr:even' },
          { id: 'c', text: 'tr:nth(2)' },
          { id: 'd', text: 'tr:last-child' },
        ],
        correct: 'a',
        explanation: ':nth-child принимает even, odd, число или формулу вида 3n+1.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Убирать обводку фокуса (`outline: none`) без замены — плохая практика.',
        correct: true,
        explanation:
          'Пользователь, работающий с клавиатуры, перестаёт понимать, где он находится. Если убираете outline — дайте другой заметный признак фокуса.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Что выберет `.card:not(.card--disabled)`?',
        options: [
          { id: 'a', text: 'Все карточки' },
          { id: 'b', text: 'Только отключённые карточки' },
          { id: 'c', text: 'Все карточки, кроме отключённых' },
          { id: 'd', text: 'Ничего' },
        ],
        correct: 'c',
        explanation: ':not() исключает элементы, подходящие под селектор внутри скобок.',
      },
    ],
  },

  {
    id: 'quiz-css-flexbox',
    title: 'Flexbox',
    topicIds: ['css-flexbox'],
    tech: ['css'],
    monthNo: 1,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'При `flex-direction: row` за что отвечает `justify-content`?',
        options: [
          { id: 'a', text: 'За выравнивание по вертикали' },
          { id: 'b', text: 'За распределение элементов по горизонтали' },
          { id: 'c', text: 'За перенос элементов на новую строку' },
          { id: 'd', text: 'За расстояние между элементами' },
        ],
        correct: 'b',
        explanation:
          'justify-content работает по главной оси, align-items — по поперечной. При row главная ось горизонтальна; при column они меняются местами.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Как расположить логотип слева, а кнопку входа справа?',
        options: [
          { id: 'a', text: 'justify-content: center' },
          { id: 'b', text: 'justify-content: space-between' },
          { id: 'c', text: 'align-items: flex-end' },
          { id: 'd', text: 'flex-wrap: wrap' },
        ],
        correct: 'b',
        explanation:
          'space-between прижимает первый элемент к началу, последний — к концу, а промежутки распределяет равномерно.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Что произойдёт без `flex-wrap: wrap` на узком экране?',
        options: [
          { id: 'a', text: 'Элементы перенесутся автоматически' },
          { id: 'b', text: 'Элементы сожмутся или вылезут за границы, вызвав горизонтальную прокрутку' },
          { id: 'c', text: 'Контейнер станет вертикальным' },
          { id: 'd', text: 'Ничего не изменится' },
        ],
        correct: 'b',
        explanation:
          'Это частая причина горизонтальной прокрутки на 390px — требования задания она нарушает напрямую.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: '`gap` в flex-контейнере задаёт расстояние между элементами и не добавляет отступ по краям.',
        correct: true,
        explanation:
          'Поэтому gap удобнее, чем margin у каждого элемента: не нужно убирать лишний отступ у первого и последнего.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Что делает `flex: 1` у элемента?',
        options: [
          { id: 'a', text: 'Делает его шириной ровно 1px' },
          { id: 'b', text: 'Разрешает занять всё свободное место, деля его поровну с такими же элементами' },
          { id: 'c', text: 'Ставит его первым' },
          { id: 'd', text: 'Запрещает сжатие' },
        ],
        correct: 'b',
        explanation:
          'flex: 1 — краткая запись для flex-grow: 1; flex-shrink: 1; flex-basis: 0. Типичный приём: поле ввода растягивается, кнопка остаётся по содержимому.',
      },
    ],
  },

  {
    id: 'quiz-css-grid',
    title: 'CSS Grid',
    topicIds: ['css-grid'],
    tech: ['css'],
    monthNo: 1,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Что означает `grid-template-columns: repeat(3, 1fr)`?',
        options: [
          { id: 'a', text: 'Три колонки по 1 пикселю' },
          { id: 'b', text: 'Три колонки равной ширины, делящие доступное место' },
          { id: 'c', text: 'Три строки' },
          { id: 'd', text: 'Колонки шириной по содержимому' },
        ],
        correct: 'b',
        explanation: 'fr — доля свободного пространства. repeat(3, 1fr) — краткая запись для `1fr 1fr 1fr`.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Какая запись даёт «резиновую» сетку карточек без единого медиазапроса?',
        options: [
          { id: 'a', text: 'grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))' },
          { id: 'b', text: 'grid-template-columns: 240px 240px 240px' },
          { id: 'c', text: 'grid-auto-flow: column' },
          { id: 'd', text: 'grid-template-rows: auto' },
        ],
        correct: 'a',
        explanation:
          'Колонки не уже 240px, а сколько их поместится — решает браузер. На 390px останется одна колонка, на широком экране — несколько.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Когда уместнее Flexbox, а не Grid?',
        options: [
          { id: 'a', text: 'Для двумерной сетки страницы' },
          { id: 'b', text: 'Для ряда элементов в одну линию: шапка, панель кнопок' },
          { id: 'c', text: 'Для галереи карточек в несколько рядов и колонок' },
          { id: 'd', text: 'Flexbox устарел' },
        ],
        correct: 'b',
        explanation: 'Простое правило: одна ось — Flexbox, две оси — Grid. Их можно и нужно сочетать.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: '`gap: 16px 24px` задаёт 16px между строками и 24px между колонками.',
        correct: true,
        explanation: 'Первое значение — row-gap, второе — column-gap. Одно значение применяется к обоим.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Что делает `minmax(240px, 1fr)`?',
        options: [
          { id: 'a', text: 'Колонка ровно 240px' },
          { id: 'b', text: 'Колонка не меньше 240px, но может растянуться на свободное место' },
          { id: 'c', text: 'Колонка не больше 240px' },
          { id: 'd', text: 'Задаёт высоту строки' },
        ],
        correct: 'b',
        explanation: 'Первый аргумент — минимум, второй — максимум. Именно это делает сетку адаптивной.',
      },
    ],
  },

  {
    id: 'quiz-css-position',
    title: 'Позиционирование',
    topicIds: ['css-position'],
    tech: ['css'],
    monthNo: 1,
    difficulty: 3,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'match',
        text: 'Сопоставьте значение position и точку отсчёта.',
        left: [
          { id: 'l1', text: 'relative' },
          { id: 'l2', text: 'absolute' },
          { id: 'l3', text: 'fixed' },
          { id: 'l4', text: 'sticky' },
        ],
        right: [
          { id: 'r1', text: 'Собственное исходное место' },
          { id: 'r2', text: 'Ближайший позиционированный предок' },
          { id: 'r3', text: 'Окно браузера, не прокручивается' },
          { id: 'r4', text: 'Прилипает при прокрутке в пределах родителя' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation:
          'Чтобы absolute считался от карточки, самой карточке нужно задать position: relative — это самая частая ошибка.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Значок-бейдж нужно прижать к правому верхнему углу карточки. Что задать карточке?',
        options: [
          { id: 'a', text: 'position: absolute' },
          { id: 'b', text: 'position: relative' },
          { id: 'c', text: 'position: fixed' },
          { id: 'd', text: 'display: flex' },
        ],
        correct: 'b',
        explanation:
          'Карточке — relative (точка отсчёта), бейджу — absolute с top и right. Без relative бейдж улетит к краю страницы.',
      },
      {
        id: 'q3',
        type: 'boolean',
        text: '`z-index` работает только у позиционированных элементов (не static).',
        correct: true,
        explanation:
          'Исключение — элементы внутри flex- и grid-контейнеров: там z-index действует и без position.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Для `position: sticky` обязательно указать…',
        options: [
          { id: 'a', text: 'z-index' },
          { id: 'b', text: 'смещение, например top: 0' },
          { id: 'c', text: 'width' },
          { id: 'd', text: 'overflow: hidden у родителя' },
        ],
        correct: 'b',
        explanation:
          'Без top (или bottom/left/right) прилипания не произойдёт. Ещё одна ловушка: overflow: hidden у родителя ломает sticky.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Элемент с `position: fixed` остаётся на месте при прокрутке страницы.',
        correct: true,
        explanation:
          'Так делают панели и всплывающие уведомления. На телефоне помните про адресную строку — она может перекрыть нижнюю панель.',
      },
    ],
  },

  {
    id: 'quiz-css-responsive',
    title: 'Адаптив и экран 390×844',
    topicIds: ['css-responsive'],
    tech: ['css'],
    monthNo: 1,
    difficulty: 2,
    passPercent: 80,
    examRefs: ['m2-mobile'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Какой размер экрана прямо указан в задании демонстрационного экзамена?',
        options: [
          { id: 'a', text: '320 × 568' },
          { id: 'b', text: '375 × 667' },
          { id: 'c', text: '390 × 844' },
          { id: 'd', text: '414 × 896' },
        ],
        correct: 'c',
        explanation:
          'Все страницы должны корректно работать на 390×844. Это единственный размер, названный в задании, и проверять нужно именно его.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Что означает подход mobile-first?',
        options: [
          { id: 'a', text: 'Сначала пишем стили для широких экранов, потом сужаем через max-width' },
          { id: 'b', text: 'Базовые стили — для узкого экрана, а @media (min-width: …) добавляет правила для широких' },
          { id: 'c', text: 'Верстаем только мобильную версию' },
          { id: 'd', text: 'Используем только проценты' },
        ],
        correct: 'b',
        explanation:
          'Мобильная версия — база, десктоп — дополнение. Так меньше переопределений и почти не возникает горизонтальной прокрутки.',
      },
      {
        id: 'q3',
        type: 'multiple',
        text: 'Что чаще всего вызывает горизонтальную прокрутку на узком экране?',
        options: [
          { id: 'a', text: 'Фиксированная ширина в пикселях у блока' },
          { id: 'b', text: 'Широкая таблица без контейнера со скроллом' },
          { id: 'c', text: 'Длинная строка без переносов' },
          { id: 'd', text: 'Изображение без max-width: 100%' },
          { id: 'e', text: 'Использование rem вместо px' },
        ],
        correct: ['a', 'b', 'c', 'd'],
        explanation:
          'Единицы измерения тут ни при чём. Найти виновника помогает `* { outline: 1px solid red }` в DevTools.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Без `<meta name="viewport">` медиазапросы на телефоне фактически не сработают.',
        correct: true,
        explanation:
          'Телефон отрисует страницу как широкий десктоп и уменьшит её. Медиазапросы будут сравниваться с виртуальной шириной около 980px.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Какая точка перелома отделяет телефон от планшета в Bootstrap?',
        options: [
          { id: 'a', text: '576px' },
          { id: 'b', text: '768px' },
          { id: 'c', text: '992px' },
          { id: 'd', text: '1200px' },
        ],
        correct: 'b',
        explanation:
          'md начинается с 768px. Классы вида `col-12 col-md-6` означают: на телефоне во всю ширину, с планшета — в половину.',
      },
    ],
  },

  {
    id: 'quiz-css-images',
    title: 'Изображения и форматы',
    topicIds: ['css-images'],
    tech: ['css', 'design'],
    monthNo: 1,
    difficulty: 2,
    passPercent: 70,
    examRefs: ['m2-design'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Четыре картинки слайдера имеют разные пропорции. Как показать их одинаковыми без искажения?',
        options: [
          { id: 'a', text: 'width: 100%; height: 300px' },
          { id: 'b', text: 'width: 100%; height: 300px; object-fit: cover' },
          { id: 'c', text: 'max-width: 100%; height: auto' },
          { id: 'd', text: 'object-fit: fill' },
        ],
        correct: 'b',
        explanation:
          'cover заполняет область, обрезая лишнее и сохраняя пропорции. Без него картинка растянется. Задание прямо требует одинакового размера изображений.',
      },
      {
        id: 'q2',
        type: 'match',
        text: 'Сопоставьте формат и подходящий случай.',
        left: [
          { id: 'l1', text: 'JPG' },
          { id: 'l2', text: 'PNG' },
          { id: 'l3', text: 'SVG' },
          { id: 'l4', text: 'WebP' },
        ],
        right: [
          { id: 'r1', text: 'Фотографии' },
          { id: 'r2', text: 'Изображения с прозрачностью' },
          { id: 'r3', text: 'Иконки и логотипы, масштабируются без потерь' },
          { id: 'r4', text: 'Современная замена JPG и PNG, файл меньше' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation: 'Фотография в PNG весит в разы больше, чем в JPG, — это первое, что стоит проверить при оптимизации.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Чем `object-fit: contain` отличается от `cover`?',
        options: [
          { id: 'a', text: 'contain обрезает изображение' },
          { id: 'b', text: 'contain вписывает изображение целиком, оставляя пустые поля' },
          { id: 'c', text: 'Они одинаковы' },
          { id: 'd', text: 'contain растягивает изображение' },
        ],
        correct: 'b',
        explanation:
          'cover — «заполнить и обрезать», contain — «показать целиком». Для логотипов обычно contain, для фото в карточке — cover.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Указывать `width` и `height` у тега img полезно: браузер заранее резервирует место и содержимое не скачет.',
        correct: true,
        explanation:
          'Вместе с `max-width: 100%; height: auto` в CSS это даёт и адаптивность, и отсутствие «прыжков» при загрузке.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Что делает `loading="lazy"`?',
        options: [
          { id: 'a', text: 'Сжимает изображение' },
          { id: 'b', text: 'Откладывает загрузку картинки до момента, когда она понадобится на экране' },
          { id: 'c', text: 'Делает изображение адаптивным' },
          { id: 'd', text: 'Показывает заглушку' },
        ],
        correct: 'b',
        explanation:
          'Для картинок ниже первого экрана это заметно ускоряет открытие. Первому изображению слайдера lazy не нужен — оно видно сразу.',
      },
    ],
  },

  {
    id: 'quiz-css-animations',
    title: 'Микроанимации',
    topicIds: ['css-animations'],
    tech: ['css'],
    monthNo: 1,
    difficulty: 2,
    passPercent: 70,
    examRefs: ['m3-animations'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Какие свойства анимировать дешевле всего для браузера?',
        options: [
          { id: 'a', text: 'width и height' },
          { id: 'b', text: 'top и left' },
          { id: 'c', text: 'transform и opacity' },
          { id: 'd', text: 'margin и padding' },
        ],
        correct: 'c',
        explanation:
          'transform и opacity не вызывают пересчёт раскладки. Анимация width или top заставляет браузер перестраивать страницу на каждом кадре — отсюда рывки.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Что означает `transition: background-color 0.2s ease`?',
        options: [
          { id: 'a', text: 'Цвет фона будет меняться плавно за 0.2 секунды' },
          { id: 'b', text: 'Фон исчезнет через 0.2 секунды' },
          { id: 'c', text: 'Анимация повторится через 0.2 секунды' },
          { id: 'd', text: 'Это неверный синтаксис' },
        ],
        correct: 'a',
        explanation: 'Порядок: свойство, длительность, функция плавности, задержка. Для интерфейса хороши 150–250 мс.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Зачем нужен медиазапрос `prefers-reduced-motion`?',
        options: [
          { id: 'a', text: 'Чтобы ускорить анимации' },
          { id: 'b', text: 'Чтобы отключить анимации для пользователей, которым движение мешает' },
          { id: 'c', text: 'Чтобы анимации работали на телефоне' },
          { id: 'd', text: 'Чтобы включить аппаратное ускорение' },
        ],
        correct: 'b',
        explanation:
          'Есть люди, у которых анимация вызывает физический дискомфорт. Уважение к системной настройке — признак аккуратной работы, это ценится в модуле 3.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Для повторяющейся анимации нужны `@keyframes` и свойство `animation`, а не `transition`.',
        correct: true,
        explanation:
          'transition анимирует переход между двумя состояниями. Спиннер загрузки или пульсация — это @keyframes с animation-iteration-count: infinite.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Сколько должна длиться анимация появления уведомления, чтобы она не раздражала?',
        options: [
          { id: 'a', text: 'Около 0.2 секунды' },
          { id: 'b', text: 'Около 2 секунд' },
          { id: 'c', text: 'Около 5 секунд' },
          { id: 'd', text: 'Чем дольше, тем заметнее' },
        ],
        correct: 'a',
        explanation:
          'Микроанимации именно «микро». Всё, что дольше 300–400 мс, воспринимается как тормоза интерфейса.',
      },
    ],
  },

  {
    id: 'quiz-git-branches',
    title: 'Git: ветки и откат',
    topicIds: ['git-branches'],
    tech: ['git'],
    monthNo: 1,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Какая команда создаёт новую ветку и сразу переключается на неё?',
        options: [
          { id: 'a', text: 'git branch feature' },
          { id: 'b', text: 'git switch -c feature' },
          { id: 'c', text: 'git merge feature' },
          { id: 'd', text: 'git restore feature' },
        ],
        correct: 'b',
        explanation:
          '`git switch -c` — современный вариант старого `git checkout -b`. Просто `git branch` создаёт ветку, но не переключается.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Что такое HEAD?',
        options: [
          { id: 'a', text: 'Первый коммит репозитория' },
          { id: 'b', text: 'Указатель на текущую позицию — обычно последний коммит текущей ветки' },
          { id: 'c', text: 'Название главной ветки' },
          { id: 'd', text: 'Файл с настройками Git' },
        ],
        correct: 'b',
        explanation: '`git log --oneline` показывает HEAD рядом с именем ветки — так видно, где вы находитесь.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как выглядит конфликт слияния в файле?',
        options: [
          { id: 'a', text: 'Файл удаляется' },
          { id: 'b', text: 'Появляются маркеры <<<<<<<, ======= и >>>>>>> с двумя вариантами кода' },
          { id: 'c', text: 'Git автоматически выбирает новый вариант' },
          { id: 'd', text: 'Проект перестаёт открываться' },
        ],
        correct: 'b',
        explanation:
          'Нужно вручную оставить правильный код, удалить маркеры, затем `git add` файл и сделать коммит слияния.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'На экзамене оправдана простая стратегия: работать в одной ветке и часто коммитить.',
        correct: true,
        explanation:
          'Требование — минимум три коммита в модуле, про ветки речи нет. Ветки полезны, но в условиях таймера лишняя сложность вредна.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Команда `git switch -` делает что?',
        options: [
          { id: 'a', text: 'Удаляет ветку' },
          { id: 'b', text: 'Возвращает на предыдущую ветку' },
          { id: 'c', text: 'Отменяет последний коммит' },
          { id: 'd', text: 'Создаёт ветку с именем "-"' },
        ],
        correct: 'b',
        explanation: 'Удобное сокращение для переключения туда-обратно между двумя ветками.',
      },
    ],
  },

  {
    id: 'quiz-design-basics',
    title: 'Основы интерфейсного дизайна',
    topicIds: ['design-basics'],
    tech: ['design', 'css'],
    monthNo: 1,
    difficulty: 2,
    passPercent: 70,
    examRefs: ['m2-design'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Почему отступы делают кратными 4 или 8 пикселям?',
        options: [
          { id: 'a', text: 'Так требует стандарт HTML' },
          { id: 'b', text: 'Ограниченный набор значений выглядит упорядоченно и его проще держать в голове' },
          { id: 'c', text: 'Браузер быстрее отрисовывает такие значения' },
          { id: 'd', text: 'Это требование Bootstrap' },
        ],
        correct: 'b',
        explanation:
          'Случайные 7, 13, 22 пикселя создают ощущение неряшливости. Шкала 4, 8, 12, 16, 24, 32 закрывает почти все задачи.',
      },
      {
        id: 'q2',
        type: 'multiple',
        text: 'Какие состояния кнопки стоит продумать?',
        options: [
          { id: 'a', text: 'Обычное' },
          { id: 'b', text: 'Наведение' },
          { id: 'c', text: 'Фокус с клавиатуры' },
          { id: 'd', text: 'Отключённое' },
          { id: 'e', text: 'Загрузка' },
        ],
        correct: ['a', 'b', 'c', 'd', 'e'],
        explanation:
          'Все пять. Отсутствие состояния загрузки — самая заметная недоработка: пользователь жмёт кнопку несколько раз и создаёт дубликаты заявок.',
      },
      {
        id: 'q3',
        type: 'boolean',
        text: 'Чем больше разных цветов в интерфейсе, тем он выглядит профессиональнее.',
        correct: false,
        explanation:
          'Обычно хватает основного цвета, нейтральной шкалы серого и цветов состояний: успех, предупреждение, ошибка.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Как правильно выделить главный элемент на странице?',
        options: [
          { id: 'a', text: 'Сделать его крупнее, жирнее, ярче и добавить рамку одновременно' },
          { id: 'b', text: 'Использовать один-два приёма: например, размер и цвет' },
          { id: 'c', text: 'Выделить все важные элементы одинаково' },
          { id: 'd', text: 'Добавить анимацию' },
        ],
        correct: 'b',
        explanation:
          'Когда выделено всё, не выделено ничего. Иерархия строится минимумом средств: размер, вес, цвет — но не все сразу.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Иконки лучше брать из одного набора и одного размера.',
        correct: true,
        explanation:
          'Смесь стилей (плоские, объёмные, разной толщины линий) сразу бросается в глаза. На экзамене подойдёт один набор, например Bootstrap Icons, установленный локально.',
      },
    ],
  },
];
