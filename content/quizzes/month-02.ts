import type { Quiz } from '../types';

/** Месяц 2: JavaScript, TypeScript, Bootstrap. */
export const MONTH_02_QUIZZES: Quiz[] = [
  {
    id: 'quiz-js-intro',
    title: 'JavaScript: переменные и типы',
    topicIds: ['js-intro'],
    tech: ['js'],
    monthNo: 2,
    difficulty: 1,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Зачем к тегу script добавляют атрибут `defer`?',
        options: [
          { id: 'a', text: 'Чтобы скрипт выполнился после построения страницы' },
          { id: 'b', text: 'Чтобы скрипт загружался быстрее' },
          { id: 'c', text: 'Чтобы скрипт работал на телефоне' },
          { id: 'd', text: 'Чтобы отключить кеширование' },
        ],
        correct: 'a',
        explanation:
          'Без defer скрипт из head выполняется, когда элементов ещё нет, и querySelector вернёт null. Альтернатива — ставить script в конец body.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Что выведет `typeof null`?',
        options: [
          { id: 'a', text: '"null"' },
          { id: 'b', text: '"undefined"' },
          { id: 'c', text: '"object"' },
          { id: 'd', text: '"boolean"' },
        ],
        correct: 'c',
        explanation:
          'Это известная историческая ошибка языка, которую не стали исправлять. Проверять на null нужно сравнением `value === null`.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'В чём главное отличие `let` от `const`?',
        options: [
          { id: 'a', text: 'const работает быстрее' },
          { id: 'b', text: 'Переменную, объявленную через const, нельзя переприсвоить' },
          { id: 'c', text: 'const нельзя использовать для объектов' },
          { id: 'd', text: 'Отличий нет' },
        ],
        correct: 'b',
        explanation:
          'При этом содержимое объекта или массива, объявленного через const, менять можно — запрещено только присвоить переменной новое значение.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: '`var` в новом коде использовать не стоит.',
        correct: true,
        explanation:
          'var не ограничен блоком и всплывает наверх функции — это источник трудных ошибок. Правило простое: по умолчанию const, если нужно менять — let.',
      },
      {
        id: 'q5',
        type: 'multiple',
        text: 'Какие значения относятся к примитивным типам?',
        options: [
          { id: 'a', text: 'string' },
          { id: 'b', text: 'number' },
          { id: 'c', text: 'boolean' },
          { id: 'd', text: 'undefined' },
          { id: 'e', text: 'array' },
        ],
        correct: ['a', 'b', 'c', 'd'],
        explanation: 'Массив — это объект. Примитивы: string, number, boolean, null, undefined, symbol, bigint.',
      },
    ],
  },

  {
    id: 'quiz-js-operators',
    title: 'Операторы и условия',
    topicIds: ['js-operators'],
    tech: ['js'],
    monthNo: 2,
    difficulty: 1,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Чему равно `"5" == 5`?',
        options: [
          { id: 'a', text: 'true' },
          { id: 'b', text: 'false' },
          { id: 'c', text: 'Ошибка' },
          { id: 'd', text: 'undefined' },
        ],
        correct: 'a',
        explanation:
          '`==` приводит типы перед сравнением. Именно поэтому используют `===`, который сравнивает и значение, и тип: `"5" === 5` даст false.',
      },
      {
        id: 'q2',
        type: 'multiple',
        text: 'Какие значения считаются «ложными» (falsy)?',
        options: [
          { id: 'a', text: '0' },
          { id: 'b', text: '""' },
          { id: 'c', text: 'null' },
          { id: 'd', text: '"0"' },
          { id: 'e', text: '[]' },
        ],
        correct: ['a', 'b', 'c'],
        explanation:
          'Строка "0" и пустой массив — истинные. Полный список ложных: false, 0, -0, 0n, "", null, undefined, NaN.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Чему равно `7 % 3`?',
        options: [
          { id: 'a', text: '2.33' },
          { id: 'b', text: '1' },
          { id: 'c', text: '2' },
          { id: 'd', text: '21' },
        ],
        correct: 'b',
        explanation:
          'Остаток от деления. В слайдере он даёт перелистывание по кругу: `(index + 1) % images.length`.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Как записать тернарным оператором «если статус «Новая» — показать «Ожидает», иначе «Обработана»»?',
        options: [
          { id: 'a', text: 'status === "Новая" ? "Ожидает" : "Обработана"' },
          { id: 'b', text: 'if status === "Новая" then "Ожидает" else "Обработана"' },
          { id: 'c', text: 'status === "Новая" ? "Ожидает" | "Обработана"' },
          { id: 'd', text: '(status === "Новая") => "Ожидает" : "Обработана"' },
        ],
        correct: 'a',
        explanation: 'Схема: `условие ? значение_если_да : значение_если_нет`. Внутри JSX это основной способ ветвления.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Оператор `&&` возвращает true или false и ничего больше.',
        correct: false,
        explanation:
          'Он возвращает одно из операндов: если левый ложный — его, иначе правый. На этом построен приём `условие && <Элемент />` в React.',
      },
    ],
  },

  {
    id: 'quiz-js-loops',
    title: 'Циклы',
    topicIds: ['js-loops'],
    tech: ['js'],
    monthNo: 2,
    difficulty: 1,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Что перебирает `for (const item of items)`?',
        options: [
          { id: 'a', text: 'Индексы массива' },
          { id: 'b', text: 'Значения массива' },
          { id: 'c', text: 'Ключи объекта' },
          { id: 'd', text: 'Символы строки только' },
        ],
        correct: 'b',
        explanation:
          '`for...of` даёт значения, `for...in` — ключи (для объектов). Путаница между ними — частая ошибка новичков.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Что делает `continue`?',
        options: [
          { id: 'a', text: 'Прерывает цикл полностью' },
          { id: 'b', text: 'Пропускает текущую итерацию и переходит к следующей' },
          { id: 'c', text: 'Начинает цикл заново с первой итерации' },
          { id: 'd', text: 'Повторяет текущую итерацию' },
        ],
        correct: 'b',
        explanation: '`break` выходит из цикла, `continue` пропускает только один шаг.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Почему цикл `for (let i = 0; i < arr.length; i--)` опасен?',
        options: [
          { id: 'a', text: 'Он не скомпилируется' },
          { id: 'b', text: 'Счётчик уменьшается, условие всегда истинно — бесконечный цикл' },
          { id: 'c', text: 'Он пропустит первый элемент' },
          { id: 'd', text: 'Он выполнится ровно один раз' },
        ],
        correct: 'b',
        explanation:
          'Браузер зависнет. Если вкладка перестала отвечать сразу после запуска — проверьте условие выхода из цикла.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Классический `for` с индексом нужен, когда индекс действительно используется — например, при нумерации строк таблицы.',
        correct: true,
        explanation:
          'Если индекс не нужен, читабельнее `for...of` или методы массива: forEach, map, filter.',
      },
      {
        id: 'q5',
        type: 'text',
        text: 'Напишите ключевое слово, которое немедленно прерывает выполнение цикла.',
        correct: ['break'],
        normalize: true,
        explanation: '`break` выходит из ближайшего цикла или switch.',
      },
    ],
  },

  {
    id: 'quiz-js-functions',
    title: 'Функции',
    topicIds: ['js-functions'],
    tech: ['js'],
    monthNo: 2,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Что вернёт функция без оператора `return`?',
        options: [
          { id: 'a', text: 'null' },
          { id: 'b', text: 'undefined' },
          { id: 'c', text: '0' },
          { id: 'd', text: 'Ошибку' },
        ],
        correct: 'b',
        explanation:
          'Отсюда частая ошибка: «функция считает правильно, но результат пустой» — забыт return.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Как задать значение параметра по умолчанию?',
        options: [
          { id: 'a', text: 'function f(a = 10) {}' },
          { id: 'b', text: 'function f(a: 10) {}' },
          { id: 'c', text: 'function f(a || 10) {}' },
          { id: 'd', text: 'function f(default a = 10) {}' },
        ],
        correct: 'a',
        explanation:
          'Значение подставится, только если аргумент не передан или равен undefined. Передача null значение по умолчанию не включит.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Какая функция является чистой?',
        options: [
          { id: 'a', text: 'Та, которая ничего не возвращает' },
          { id: 'b', text: 'Та, которая при одних и тех же аргументах даёт один и тот же результат и не меняет ничего снаружи' },
          { id: 'c', text: 'Та, которая объявлена через const' },
          { id: 'd', text: 'Та, которая не принимает аргументов' },
        ],
        correct: 'b',
        explanation:
          'Чистые функции легко тестировать и переиспользовать. Вся логика валидации и форматирования дат в проекте должна быть чистой.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Стрелочная функция `const sum = (a, b) => a + b` возвращает сумму без слова return.',
        correct: true,
        explanation:
          'Краткая форма без фигурных скобок возвращает результат выражения. Если написать фигурные скобки — return станет обязательным.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Переменная объявлена через let внутри функции. Где она видна?',
        options: [
          { id: 'a', text: 'Везде в файле' },
          { id: 'b', text: 'Только внутри этой функции' },
          { id: 'c', text: 'Внутри функции и в родительской' },
          { id: 'd', text: 'Только после объявления во всём файле' },
        ],
        correct: 'b',
        explanation:
          'Функция видит переменные снаружи, но снаружи её внутренние переменные не видны. Это и называется областью видимости.',
      },
    ],
  },

  {
    id: 'quiz-js-arrays',
    title: 'Массивы: перебор и поиск',
    topicIds: ['js-arrays'],
    tech: ['js'],
    monthNo: 2,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'match',
        text: 'Сопоставьте метод массива и его назначение.',
        left: [
          { id: 'l1', text: 'map' },
          { id: 'l2', text: 'filter' },
          { id: 'l3', text: 'find' },
          { id: 'l4', text: 'forEach' },
        ],
        right: [
          { id: 'r1', text: 'Новый массив той же длины с преобразованными элементами' },
          { id: 'r2', text: 'Новый массив только из подходящих элементов' },
          { id: 'r3', text: 'Первый подходящий элемент или undefined' },
          { id: 'r4', text: 'Просто перебрать, ничего не возвращая' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation:
          'В React для отрисовки списка нужен именно map: он возвращает массив элементов, а forEach возвращает undefined.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Что вернёт `[1, 2, 3].filter(n => n > 5)`?',
        options: [
          { id: 'a', text: 'undefined' },
          { id: 'b', text: 'null' },
          { id: 'c', text: '[]' },
          { id: 'd', text: 'Ошибку' },
        ],
        correct: 'c',
        explanation:
          'filter всегда возвращает массив, пусть и пустой. А вот find в такой ситуации вернёт undefined — это разные вещи, и проверять их надо по-разному.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как проверить, есть ли значение в массиве?',
        options: [
          { id: 'a', text: 'arr.has(value)' },
          { id: 'b', text: 'arr.includes(value)' },
          { id: 'c', text: 'arr.contains(value)' },
          { id: 'd', text: 'arr.exists(value)' },
        ],
        correct: 'b',
        explanation:
          '`includes` возвращает true/false. `indexOf` вернёт индекс или -1 — тоже рабочий вариант, но менее читаемый.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Метод `push` изменяет исходный массив.',
        correct: true,
        explanation:
          'push, pop, splice, sort, reverse меняют массив на месте. В состоянии React так делать нельзя — нужен новый массив: `[...items, item]`.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Как получить число заявок со статусом «Новая» из массива orders?',
        options: [
          { id: 'a', text: 'orders.filter(o => o.status === "Новая").length' },
          { id: 'b', text: 'orders.count("Новая")' },
          { id: 'c', text: 'orders.find(o => o.status === "Новая").length' },
          { id: 'd', text: 'orders.length("Новая")' },
        ],
        correct: 'a',
        explanation:
          'filter отбирает подходящие, length даёт их количество. Такой счётчик пригодится в панели администратора.',
      },
    ],
  },

  {
    id: 'quiz-js-objects',
    title: 'Объекты и JSON',
    topicIds: ['js-objects'],
    tech: ['js'],
    monthNo: 2,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Что делает `JSON.parse(text)`?',
        options: [
          { id: 'a', text: 'Превращает объект в строку' },
          { id: 'b', text: 'Превращает строку JSON в объект' },
          { id: 'c', text: 'Проверяет корректность объекта' },
          { id: 'd', text: 'Копирует объект' },
        ],
        correct: 'b',
        explanation:
          'stringify — объект в строку (для отправки и для localStorage), parse — строка в объект (после чтения).',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Объект скопировали как `const b = a`, затем изменили `b.name`. Что с `a.name`?',
        options: [
          { id: 'a', text: 'Не изменится' },
          { id: 'b', text: 'Тоже изменится — это одна и та же ссылка' },
          { id: 'c', text: 'Будет ошибка' },
          { id: 'd', text: 'Станет undefined' },
        ],
        correct: 'b',
        explanation:
          'Объекты присваиваются по ссылке. Для копии нужен `{ ...a }` — но это копия поверхностная, вложенные объекты останутся общими.',
      },
      {
        id: 'q3',
        type: 'match',
        text: 'Сопоставьте метод и результат для объекта `{ a: 1, b: 2 }`.',
        left: [
          { id: 'l1', text: 'Object.keys' },
          { id: 'l2', text: 'Object.values' },
          { id: 'l3', text: 'Object.entries' },
        ],
        right: [
          { id: 'r1', text: '["a", "b"]' },
          { id: 'r2', text: '[1, 2]' },
          { id: 'r3', text: '[["a", 1], ["b", 2]]' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3' },
        explanation:
          'Object.entries удобен для перебора объекта ошибок: `Object.entries(errors).map(([field, text]) => …)`.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Когда нужен доступ через скобки `obj[key]`, а не через точку?',
        options: [
          { id: 'a', text: 'Всегда, точка устарела' },
          { id: 'b', text: 'Когда имя свойства лежит в переменной или содержит пробелы' },
          { id: 'c', text: 'Когда значение — число' },
          { id: 'd', text: 'Когда объект вложенный' },
        ],
        correct: 'b',
        explanation:
          'Универсальная функция сортировки как раз использует `a[field]` — имя поля приходит извне и заранее неизвестно.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Массив объектов — основная структура данных в проекте: список заявок, список отзывов, список помещений.',
        correct: true,
        explanation:
          'Именно в таком виде данные приходят с сервера и хранятся в состоянии React.',
      },
    ],
  },

  {
    id: 'quiz-js-dom',
    title: 'DOM: поиск и изменение',
    topicIds: ['js-dom'],
    tech: ['js'],
    monthNo: 2,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Чем `textContent` отличается от `innerHTML`?',
        options: [
          { id: 'a', text: 'Ничем' },
          { id: 'b', text: 'textContent вставляет текст как текст, innerHTML разбирает его как разметку' },
          { id: 'c', text: 'textContent работает только для input' },
          { id: 'd', text: 'innerHTML быстрее и безопаснее' },
        ],
        correct: 'b',
        explanation:
          'Поэтому пользовательский текст вставляют через textContent: иначе строка `<img src=x onerror=alert(1)>` выполнится. Это XSS.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Что вернёт `document.querySelectorAll(".card")`?',
        options: [
          { id: 'a', text: 'Первый элемент с классом card' },
          { id: 'b', text: 'Коллекцию всех элементов с классом card' },
          { id: 'c', text: 'Обычный массив' },
          { id: 'd', text: 'null, если элементов больше одного' },
        ],
        correct: 'b',
        explanation:
          'Это NodeList — по нему можно пройтись forEach, но методов массива вроде map у него нет. Для них нужен `[...list]`.',
      },
      {
        id: 'q3',
        type: 'match',
        text: 'Сопоставьте метод classList и действие.',
        left: [
          { id: 'l1', text: 'add' },
          { id: 'l2', text: 'remove' },
          { id: 'l3', text: 'toggle' },
          { id: 'l4', text: 'contains' },
        ],
        right: [
          { id: 'r1', text: 'Добавить класс' },
          { id: 'r2', text: 'Убрать класс' },
          { id: 'r3', text: 'Добавить, если нет; убрать, если есть' },
          { id: 'r4', text: 'Проверить наличие класса' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation:
          'classList безопаснее, чем присваивание className: он не затирает остальные классы элемента.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Как прочитать значение атрибута `data-id` у элемента?',
        options: [
          { id: 'a', text: 'el.dataId' },
          { id: 'b', text: 'el.dataset.id' },
          { id: 'c', text: 'el.data("id")' },
          { id: 'd', text: 'el.attributes.id' },
        ],
        correct: 'b',
        explanation:
          'Все `data-*` атрибуты доступны через dataset. Через дефис пишутся в HTML, а в коде превращаются в camelCase: data-user-id → dataset.userId.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: '`querySelector` вернёт null, если элемент не найден, — обращение к его свойствам тогда вызовет ошибку.',
        correct: true,
        explanation:
          '«Cannot read properties of null» — самая частая ошибка в консоли. Обычно означает, что скрипт выполнился раньше разметки (нет defer) или опечатку в селекторе.',
      },
    ],
  },

  {
    id: 'quiz-js-events',
    title: 'События',
    topicIds: ['js-events'],
    tech: ['js'],
    monthNo: 2,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Форма при отправке перезагружает страницу. Что нужно вызвать?',
        options: [
          { id: 'a', text: 'event.stopPropagation()' },
          { id: 'b', text: 'event.preventDefault()' },
          { id: 'c', text: 'return false' },
          { id: 'd', text: 'form.reset()' },
        ],
        correct: 'b',
        explanation:
          'preventDefault отменяет поведение браузера по умолчанию. stopPropagation — другое: он мешает событию всплывать к родителям.',
      },
      {
        id: 'q2',
        type: 'match',
        text: 'Сопоставьте событие и момент, когда оно происходит.',
        left: [
          { id: 'l1', text: 'click' },
          { id: 'l2', text: 'input' },
          { id: 'l3', text: 'change' },
          { id: 'l4', text: 'submit' },
        ],
        right: [
          { id: 'r1', text: 'Нажатие на элемент' },
          { id: 'r2', text: 'При каждом изменении значения поля' },
          { id: 'r3', text: 'После потери фокуса или выбора в списке' },
          { id: 'r4', text: 'Отправка формы' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation:
          'Для текстовых полей нужен input (реагирует на каждый символ), для select — change.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Что такое делегирование событий?',
        options: [
          { id: 'a', text: 'Обработчик вешается на родителя, а нужный элемент определяется через event.target' },
          { id: 'b', text: 'Обработчик вешается на каждый элемент отдельно' },
          { id: 'c', text: 'Передача события другому окну' },
          { id: 'd', text: 'Отмена обработчика' },
        ],
        correct: 'a',
        explanation:
          'Один обработчик на таблицу вместо сотни на кнопки. Работает и для элементов, добавленных после навешивания обработчика.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Обработчик события отправки формы получает объект события. Где взять форму?',
        options: [
          { id: 'a', text: 'event.form' },
          { id: 'b', text: 'event.target' },
          { id: 'c', text: 'event.element' },
          { id: 'd', text: 'event.source' },
        ],
        correct: 'b',
        explanation:
          'event.target — элемент, на котором произошло событие. Для submit это сама форма; event.currentTarget — элемент, на котором висит обработчик.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Обработчик, навешенный в цикле и не снятый, может вызвать утечку памяти или двойное срабатывание.',
        correct: true,
        explanation:
          'Классический баг: перерисовали список, повесили обработчики заново — и клик срабатывает дважды. В React за этим следит функция очистки в useEffect.',
      },
    ],
  },

  {
    id: 'quiz-js-render',
    title: 'Отрисовка списка',
    topicIds: ['js-render'],
    tech: ['js'],
    monthNo: 2,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'order',
        text: 'Расставьте шаги перерисовки списка в правильном порядке.',
        items: [
          { id: 'i1', text: 'Очистить контейнер' },
          { id: 'i2', text: 'Проверить, не пуст ли массив' },
          { id: 'i3', text: 'Построить разметку из данных' },
          { id: 'i4', text: 'Вставить результат в контейнер' },
        ],
        correct: ['i1', 'i2', 'i3', 'i4'],
        explanation:
          'Без первого шага элементы будут накапливаться при каждой перерисовке — список удвоится, утроится и так далее.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Что показать, когда у пользователя нет ни одной заявки?',
        options: [
          { id: 'a', text: 'Пустую таблицу' },
          { id: 'b', text: 'Понятное сообщение и кнопку «Создать заявку»' },
          { id: 'c', text: 'Сообщение об ошибке' },
          { id: 'd', text: 'Индикатор загрузки' },
        ],
        correct: 'b',
        explanation:
          'Пустое состояние с подсказкой, что делать дальше, — один из признаков качественного интерфейса, который оценивают в модуле 2.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как собрать разметку списка из массива методом map?',
        options: [
          { id: 'a', text: 'items.map(i => `<li>${i.name}</li>`)' },
          { id: 'b', text: 'items.map(i => `<li>${i.name}</li>`).join("")' },
          { id: 'c', text: 'items.forEach(i => `<li>${i.name}</li>`)' },
          { id: 'd', text: 'items.join("<li>")' },
        ],
        correct: 'b',
        explanation:
          'Без join массив при подстановке в строку соединится через запятую — между пунктами появятся лишние запятые.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Пользовательский текст перед вставкой через innerHTML нужно экранировать.',
        correct: true,
        explanation:
          'Иначе отзыв с тегом script или img выполнит чужой код. Безопаснее собирать элементы через createElement и textContent.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'В чём преимущество createElement перед innerHTML?',
        options: [
          { id: 'a', text: 'Код короче' },
          { id: 'b', text: 'Текст вставляется безопасно и обработчики можно вешать сразу на элемент' },
          { id: 'c', text: 'Работает быстрее во всех случаях' },
          { id: 'd', text: 'Не требует контейнера' },
        ],
        correct: 'b',
        explanation:
          'innerHTML короче, но опаснее и уничтожает существующие обработчики внутри контейнера.',
      },
    ],
  },

  {
    id: 'quiz-js-regexp',
    title: 'Регулярные выражения',
    topicIds: ['js-regexp'],
    tech: ['js'],
    monthNo: 2,
    difficulty: 3,
    passPercent: 80,
    examRefs: ['m1-register'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Какое выражение проверяет логин: только латиница и цифры, минимум 6 символов?',
        options: [
          { id: 'a', text: '/[A-Za-z0-9]{6,}/' },
          { id: 'b', text: '/^[A-Za-z0-9]{6,}$/' },
          { id: 'c', text: '/^[A-Za-z0-9]+$/' },
          { id: 'd', text: '/^\\w{6}$/' },
        ],
        correct: 'b',
        explanation:
          'Без `^` и `$` выражение найдёт подходящий кусок внутри строки: «Логин!!!abcdef» пройдёт проверку. Это прямое требование задания.',
      },
      {
        id: 'q2',
        type: 'match',
        text: 'Сопоставьте квантификатор и его смысл.',
        left: [
          { id: 'l1', text: '+' },
          { id: 'l2', text: '*' },
          { id: 'l3', text: '?' },
          { id: 'l4', text: '{6,}' },
        ],
        right: [
          { id: 'r1', text: 'Один или больше' },
          { id: 'r2', text: 'Ноль или больше' },
          { id: 'r3', text: 'Ноль или один' },
          { id: 'r4', text: 'Шесть или больше' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation: '`{6,}` — это и есть «минимум 6 символов» из требования к логину.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Что вернёт метод `test`?',
        options: [
          { id: 'a', text: 'Найденную подстроку' },
          { id: 'b', text: 'true или false' },
          { id: 'c', text: 'Массив совпадений' },
          { id: 'd', text: 'Индекс совпадения' },
        ],
        correct: 'b',
        explanation: 'Для валидации нужен именно test. `match` возвращает найденные фрагменты или null.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Класс `\\d` эквивалентен набору `[0-9]`.',
        correct: true,
        explanation: '`\\w` — это [A-Za-z0-9_] (обратите внимание на подчёркивание), `\\s` — пробельные символы.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Почему для проверки логина не стоит использовать `\\w`?',
        options: [
          { id: 'a', text: 'Он медленнее' },
          { id: 'b', text: 'Он разрешает подчёркивание, а задание требует только буквы и цифры' },
          { id: 'c', text: 'Он не работает с кириллицей' },
          { id: 'd', text: 'Он требует флаг i' },
        ],
        correct: 'b',
        explanation:
          'Мелочь, но задание формулирует правило дословно: «латинские буквы и цифры». Лучше писать набор явно.',
      },
    ],
  },

  {
    id: 'quiz-js-validation',
    title: 'Валидация формы',
    topicIds: ['js-validation'],
    tech: ['js'],
    monthNo: 2,
    difficulty: 3,
    passPercent: 80,
    examRefs: ['m1-register', 'm2-register-hints'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'В каком виде удобнее всего хранить ошибки формы?',
        options: [
          { id: 'a', text: 'Массив строк' },
          { id: 'b', text: 'Объект вида { поле: "текст ошибки" }' },
          { id: 'c', text: 'Одна строка со всеми ошибками' },
          { id: 'd', text: 'Число ошибок' },
        ],
        correct: 'b',
        explanation:
          'Так подсказка ставится ровно у нужного поля — это требование модуля 2: «подсказки об ошибках рядом с полями».',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Как понять, что форму можно отправлять?',
        options: [
          { id: 'a', text: 'Object.keys(errors).length === 0' },
          { id: 'b', text: 'errors === null' },
          { id: 'c', text: 'errors.length > 0' },
          { id: 'd', text: 'Проверить каждое поле повторно при отправке' },
        ],
        correct: 'a',
        explanation: 'Пустой объект ошибок означает, что все проверки пройдены.',
      },
      {
        id: 'q3',
        type: 'multiple',
        text: 'Какие требования к регистрации названы в задании дословно?',
        options: [
          { id: 'a', text: 'Логин: латиница и цифры, минимум 6 символов' },
          { id: 'b', text: 'Логин должен быть уникальным' },
          { id: 'c', text: 'Пароль: минимум 8 символов' },
          { id: 'd', text: 'Все поля обязательны' },
          { id: 'e', text: 'Пароль должен содержать спецсимвол' },
        ],
        correct: ['a', 'b', 'c', 'd'],
        explanation:
          'Про спецсимволы в задании ничего нет. Придумывать дополнительные правила — риск: пользователь-проверяющий может не суметь зарегистрироваться.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Ошибку от сервера (например, «логин занят») нужно показывать в том же месте, что и клиентскую ошибку поля.',
        correct: true,
        explanation:
          'Пользователю неважно, кто нашёл ошибку. Сервер отвечает 409 и телом `{ errors: { login: "Логин занят" } }` — клиент просто кладёт это в тот же объект ошибок.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Какие классы Bootstrap показывают ошибку у поля?',
        options: [
          { id: 'a', text: 'is-error и error-text' },
          { id: 'b', text: 'is-invalid у поля и invalid-feedback у блока с текстом' },
          { id: 'c', text: 'has-error и help-block' },
          { id: 'd', text: 'form-error и form-hint' },
        ],
        correct: 'b',
        explanation:
          'Блок invalid-feedback становится видимым только тогда, когда у соседнего поля есть класс is-invalid.',
      },
    ],
  },

  {
    id: 'quiz-js-timers',
    title: 'Таймеры и слайдер',
    topicIds: ['js-timers'],
    tech: ['js'],
    monthNo: 2,
    difficulty: 2,
    passPercent: 80,
    examRefs: ['m2-slider'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Какой интервал автопереключения слайдера требует задание?',
        options: [
          { id: 'a', text: '1 секунда' },
          { id: 'b', text: '3 секунды' },
          { id: 'c', text: '5 секунд' },
          { id: 'd', text: 'Интервал не указан' },
        ],
        correct: 'b',
        explanation:
          'Дословно: изображения должны сменяться каждые 3 секунды, то есть setInterval с 3000 мс. Картинок при этом ровно четыре.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Чем `setInterval` отличается от `setTimeout`?',
        options: [
          { id: 'a', text: 'setInterval выполняется один раз, setTimeout — постоянно' },
          { id: 'b', text: 'setInterval повторяется каждые N мс, setTimeout срабатывает один раз' },
          { id: 'c', text: 'Ничем' },
          { id: 'd', text: 'setTimeout работает только в браузере' },
        ],
        correct: 'b',
        explanation: 'Оба возвращают идентификатор, который нужно сохранить для clearInterval / clearTimeout.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как перелистывать четыре слайда по кругу?',
        options: [
          { id: 'a', text: 'index + 1' },
          { id: 'b', text: '(index + 1) % images.length' },
          { id: 'c', text: 'index++ if index < 4' },
          { id: 'd', text: 'Math.random() * 4' },
        ],
        correct: 'b',
        explanation:
          'Остаток от деления возвращает к нулю после последнего слайда. Для кнопки «назад»: `(index - 1 + length) % length`.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Если не вызвать clearInterval, таймер продолжит работать даже после ухода со страницы.',
        correct: true,
        explanation:
          'В React это приводит к попытке обновить состояние размонтированного компонента. Очистка обязательна: `return () => clearInterval(id)`.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Пользователь нажал кнопку «вперёд». Что стоит сделать с автопереключением?',
        options: [
          { id: 'a', text: 'Ничего' },
          { id: 'b', text: 'Сбросить таймер и запустить отсчёт заново' },
          { id: 'c', text: 'Остановить его навсегда' },
          { id: 'd', text: 'Ускорить его' },
        ],
        correct: 'b',
        explanation:
          'Иначе следующий слайд может смениться сразу после ручного переключения — выглядит как сбой.',
      },
    ],
  },

  {
    id: 'quiz-js-destructuring',
    title: 'Деструктуризация и spread',
    topicIds: ['js-destructuring'],
    tech: ['js'],
    monthNo: 2,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Что делает `const { login, password } = req.body`?',
        options: [
          { id: 'a', text: 'Создаёт новый объект' },
          { id: 'b', text: 'Извлекает два поля в одноимённые переменные' },
          { id: 'c', text: 'Удаляет поля из объекта' },
          { id: 'd', text: 'Проверяет наличие полей' },
        ],
        correct: 'b',
        explanation:
          'Это первая строка почти каждого обработчика Express. Если поля нет, переменная будет undefined — проверять всё равно надо.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Что вернёт `{ ...a, ...b }`, если в обоих объектах есть поле name?',
        options: [
          { id: 'a', text: 'Значение из a' },
          { id: 'b', text: 'Значение из b' },
          { id: 'c', text: 'Массив из двух значений' },
          { id: 'd', text: 'Ошибку' },
        ],
        correct: 'b',
        explanation:
          'Побеждает последний. На этом построено обновление состояния формы: `{ ...form, [name]: value }`.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Что вернёт `user?.profile?.city`, если profile отсутствует?',
        options: [
          { id: 'a', text: 'Ошибку' },
          { id: 'b', text: 'undefined' },
          { id: 'c', text: 'null' },
          { id: 'd', text: 'Пустую строку' },
        ],
        correct: 'b',
        explanation:
          'Опциональная цепочка прерывается и возвращает undefined вместо ошибки «Cannot read properties of undefined».',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Чем `??` отличается от `||`?',
        options: [
          { id: 'a', text: 'Ничем' },
          { id: 'b', text: '`??` подставляет значение по умолчанию только для null и undefined, а `||` — для всех ложных значений' },
          { id: 'c', text: '`??` работает только с числами' },
          { id: 'd', text: '`||` новее' },
        ],
        correct: 'b',
        explanation:
          'Важно для чисел: `count || 10` при count = 0 даст 10, а `count ?? 10` правильно вернёт 0.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Запись `const { login: userLogin } = data` создаёт переменную userLogin.',
        correct: true,
        explanation: 'Это переименование при деструктуризации — полезно, когда имя поля конфликтует с уже существующей переменной.',
      },
    ],
  },

  {
    id: 'quiz-js-array-methods',
    title: 'sort, slice, reduce',
    topicIds: ['js-array-methods'],
    tech: ['js'],
    monthNo: 2,
    difficulty: 3,
    passPercent: 70,
    examRefs: ['m2-admin-tools'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Почему перед сортировкой массив обычно копируют?',
        options: [
          { id: 'a', text: 'Так быстрее' },
          { id: 'b', text: '`sort` меняет исходный массив, а состояние React менять напрямую нельзя' },
          { id: 'c', text: 'Иначе будет ошибка' },
          { id: 'd', text: 'Копия не нужна' },
        ],
        correct: 'b',
        explanation:
          'Пишут `[...items].sort(...)`. Иначе React может не заметить изменение — ссылка на массив осталась прежней.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Как отсортировать числа по возрастанию?',
        options: [
          { id: 'a', text: 'arr.sort()' },
          { id: 'b', text: 'arr.sort((a, b) => a - b)' },
          { id: 'c', text: 'arr.sort((a, b) => a > b)' },
          { id: 'd', text: 'arr.sort("asc")' },
        ],
        correct: 'b',
        explanation:
          'Без компаратора sort сравнивает строки: 10 окажется раньше 9. Компаратор должен возвращать число, а не true/false.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как получить третью страницу по 10 записей?',
        options: [
          { id: 'a', text: 'items.slice(3, 10)' },
          { id: 'b', text: 'items.slice(20, 30)' },
          { id: 'c', text: 'items.splice(20, 10)' },
          { id: 'd', text: 'items.slice(30)' },
        ],
        correct: 'b',
        explanation:
          'Формула: `slice((page - 1) * size, page * size)`. splice использовать нельзя — он вырезает элементы из исходного массива.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Что делает `orders.reduce((sum, o) => sum + o.price, 0)`?',
        options: [
          { id: 'a', text: 'Считает количество заявок' },
          { id: 'b', text: 'Считает сумму цен всех заявок' },
          { id: 'c', text: 'Находит самую дорогую заявку' },
          { id: 'd', text: 'Сортирует по цене' },
        ],
        correct: 'b',
        explanation: 'Второй аргумент reduce — начальное значение аккумулятора. Забыть его — частая ошибка.',
      },
      {
        id: 'q5',
        type: 'order',
        text: 'Расставьте операции в порядке, в котором строится список админки.',
        items: [
          { id: 'i1', text: 'filter — оставить подходящие под фильтр' },
          { id: 'i2', text: 'sort — отсортировать' },
          { id: 'i3', text: 'slice — взять текущую страницу' },
        ],
        correct: ['i1', 'i2', 'i3'],
        explanation:
          'Порядок важен: если сначала взять страницу, а потом отфильтровать, количество записей на странице будет прыгать.',
      },
    ],
  },

  {
    id: 'quiz-js-modules',
    title: 'Модули и npm',
    topicIds: ['js-modules'],
    tech: ['js', 'node', 'tools'],
    monthNo: 2,
    difficulty: 2,
    passPercent: 70,
    examRefs: ['m1-oop-styles'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Как импортировать значение по умолчанию из модуля?',
        options: [
          { id: 'a', text: 'import { value } from "./mod.js"' },
          { id: 'b', text: 'import value from "./mod.js"' },
          { id: 'c', text: 'import * from "./mod.js"' },
          { id: 'd', text: 'require("./mod.js")' },
        ],
        correct: 'b',
        explanation:
          'Без фигурных скобок — значение по умолчанию (export default), с фигурными — именованный экспорт.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Что нужно добавить в package.json, чтобы использовать import в Node.js?',
        options: [
          { id: 'a', text: '"modules": true' },
          { id: 'b', text: '"type": "module"' },
          { id: 'c', text: '"esm": true' },
          { id: 'd', text: 'Ничего, import работает всегда' },
        ],
        correct: 'b',
        explanation:
          'Без этой строки Node ждёт синтаксис require. Ошибка «Cannot use import statement outside a module» означает именно это.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Библиотека стилей подключена из node_modules. Что это даёт по требованиям задания?',
        options: [
          { id: 'a', text: 'Ничего, это обычная практика' },
          { id: 'b', text: 'Задание прямо требует использовать библиотеку стилей, установленную через npm' },
          { id: 'c', text: 'Это ускоряет загрузку' },
          { id: 'd', text: 'Это нужно только для React' },
        ],
        correct: 'b',
        explanation:
          'Подключение с CDN не подойдёт: на экзамене интернета нет. Bootstrap ставится через npm и импортируется из node_modules.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Команда `npm install --offline` берёт пакеты из локального кеша и работает без интернета.',
        correct: true,
        explanation:
          'Полезно проверить заранее: прогрейте кеш дома, чтобы на экзамене установка прошла даже при отсутствии сети.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Где описываются скрипты вроде `npm run dev`?',
        options: [
          { id: 'a', text: 'В package.json, раздел scripts' },
          { id: 'b', text: 'В package-lock.json' },
          { id: 'c', text: 'В .gitignore' },
          { id: 'd', text: 'В node_modules' },
        ],
        correct: 'a',
        explanation: 'Там же указываются зависимости. package-lock.json фиксирует точные версии и правится автоматически.',
      },
    ],
  },

  {
    id: 'quiz-js-async',
    title: 'Асинхронность',
    topicIds: ['js-async'],
    tech: ['js'],
    monthNo: 2,
    difficulty: 3,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Что возвращает функция, объявленная как `async`?',
        options: [
          { id: 'a', text: 'Значение сразу' },
          { id: 'b', text: 'Promise' },
          { id: 'c', text: 'undefined' },
          { id: 'd', text: 'Массив' },
        ],
        correct: 'b',
        explanation:
          'Даже `async function f() { return 1 }` вернёт Promise. Поэтому результат нужно ждать через await или .then.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Где можно использовать `await`?',
        options: [
          { id: 'a', text: 'В любом месте кода' },
          { id: 'b', text: 'Внутри async-функции (и на верхнем уровне модуля)' },
          { id: 'c', text: 'Только в браузере' },
          { id: 'd', text: 'Только в try/catch' },
        ],
        correct: 'b',
        explanation:
          'Попытка написать await внутри обычной функции — синтаксическая ошибка. В обработчике события помечайте саму функцию как async.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как поймать ошибку при await?',
        options: [
          { id: 'a', text: 'if (error)' },
          { id: 'b', text: 'try { … } catch (error) { … }' },
          { id: 'c', text: 'onError()' },
          { id: 'd', text: 'Ошибки при await не возникают' },
        ],
        correct: 'b',
        explanation:
          'Блок finally удобен для снятия флага загрузки: он выполнится и при успехе, и при ошибке.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Нужно загрузить справочники помещений и способов оплаты одновременно. Что использовать?',
        options: [
          { id: 'a', text: 'Два последовательных await' },
          { id: 'b', text: 'Promise.all([...])' },
          { id: 'c', text: 'setTimeout' },
          { id: 'd', text: 'forEach с await' },
        ],
        correct: 'b',
        explanation:
          'Promise.all запускает запросы параллельно и ждёт все сразу — вдвое быстрее последовательных await.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Состояния Promise: ожидание, выполнен успешно, выполнен с ошибкой.',
        correct: true,
        explanation: 'pending → fulfilled или rejected. Перейти из финального состояния обратно нельзя.',
      },
    ],
  },

  {
    id: 'quiz-js-fetch',
    title: 'fetch и коды ответа',
    topicIds: ['js-fetch'],
    tech: ['js'],
    monthNo: 2,
    difficulty: 3,
    passPercent: 80,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Сервер ответил 404. Что будет с промисом fetch?',
        options: [
          { id: 'a', text: 'Он завершится с ошибкой, сработает catch' },
          { id: 'b', text: 'Он выполнится успешно, но response.ok будет false' },
          { id: 'c', text: 'Запрос повторится автоматически' },
          { id: 'd', text: 'Вернётся null' },
        ],
        correct: 'b',
        explanation:
          'fetch падает только при сетевой ошибке. Код 4xx или 5xx нужно проверять вручную через response.ok или response.status.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Как отправить POST с телом JSON?',
        options: [
          { id: 'a', text: 'fetch(url, { method: "POST", body: data })' },
          { id: 'b', text: 'fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })' },
          { id: 'c', text: 'fetch(url, { post: data })' },
          { id: 'd', text: 'fetch(url, data)' },
        ],
        correct: 'b',
        explanation:
          'Без заголовка Content-Type express.json() не разберёт тело, и req.body окажется пустым объектом. Это одна из самых частых ошибок.',
      },
      {
        id: 'q3',
        type: 'match',
        text: 'Сопоставьте код ответа и ситуацию в проекте.',
        left: [
          { id: 'l1', text: '201' },
          { id: 'l2', text: '401' },
          { id: 'l3', text: '403' },
          { id: 'l4', text: '409' },
        ],
        right: [
          { id: 'r1', text: 'Заявка создана' },
          { id: 'r2', text: 'Нет токена или он неверный' },
          { id: 'r3', text: 'Токен есть, но роли не хватает' },
          { id: 'r4', text: 'Логин уже занят' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation:
          'Различать 401 и 403 важно: первое — «войдите», второе — «вам сюда нельзя». 409 — конфликт, идеально подходит для занятого логина.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Как передать токен в запросе?',
        options: [
          { id: 'a', text: 'В теле запроса' },
          { id: 'b', text: 'В заголовке Authorization: Bearer <токен>' },
          { id: 'c', text: 'В адресе после знака вопроса' },
          { id: 'd', text: 'В cookie обязательно' },
        ],
        correct: 'b',
        explanation:
          'В адресе токен окажется в логах и истории браузера — так делать нельзя. Стандартное место — заголовок Authorization.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: '`await response.json()` можно вызвать у одного ответа дважды.',
        correct: false,
        explanation:
          'Тело ответа читается один раз. Повторный вызов даст ошибку «body stream already read» — сохраните результат в переменную.',
      },
    ],
  },

  {
    id: 'quiz-js-localstorage',
    title: 'localStorage',
    topicIds: ['js-localstorage'],
    tech: ['js', 'security'],
    monthNo: 2,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Что вернёт `localStorage.getItem("token")`, если ключа нет?',
        options: [
          { id: 'a', text: 'undefined' },
          { id: 'b', text: 'null' },
          { id: 'c', text: 'Пустую строку' },
          { id: 'd', text: 'Ошибку' },
        ],
        correct: 'b',
        explanation:
          'Именно null, поэтому проверка пишется как `if (token)` или `token !== null`. JSON.parse(null) вернёт null без ошибки, а вот JSON.parse(undefined) упадёт.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Как сохранить объект пользователя?',
        options: [
          { id: 'a', text: 'localStorage.setItem("user", user)' },
          { id: 'b', text: 'localStorage.setItem("user", JSON.stringify(user))' },
          { id: 'c', text: 'localStorage.user = user' },
          { id: 'd', text: 'localStorage.save("user", user)' },
        ],
        correct: 'b',
        explanation:
          'Хранилище держит только строки. Без stringify сохранится текст "[object Object]".',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Чем sessionStorage отличается от localStorage?',
        options: [
          { id: 'a', text: 'Он больше по объёму' },
          { id: 'b', text: 'Данные исчезают при закрытии вкладки' },
          { id: 'c', text: 'Он доступен серверу' },
          { id: 'd', text: 'Он шифрует данные' },
        ],
        correct: 'b',
        explanation:
          'localStorage переживает перезагрузку и закрытие браузера — поэтому вход и сохраняется между запусками.',
      },
      {
        id: 'q4',
        type: 'multiple',
        text: 'Что нельзя хранить в localStorage?',
        options: [
          { id: 'a', text: 'Пароль пользователя' },
          { id: 'b', text: 'Номер карты' },
          { id: 'c', text: 'Роль, которой доверяет сервер' },
          { id: 'd', text: 'Токен для запросов' },
          { id: 'e', text: 'Выбранную тему оформления' },
        ],
        correct: ['a', 'b', 'c'],
        explanation:
          'Любой пользователь может открыть DevTools и поменять значение на admin. Роль должна быть внутри подписанного токена и проверяться на сервере.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'При выходе из системы нужно удалить токен и данные пользователя из localStorage.',
        correct: true,
        explanation:
          'Иначе следующее открытие страницы восстановит сессию. Обычно это `localStorage.removeItem("token")` плюс очистка состояния контекста.',
      },
    ],
  },

  {
    id: 'quiz-js-dates',
    title: 'Даты и формат ДД.ММ.ГГГГ',
    topicIds: ['js-dates'],
    tech: ['js'],
    monthNo: 2,
    difficulty: 3,
    passPercent: 80,
    examRefs: ['m2-order-form'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Какой формат даты требует задание в форме заявки?',
        options: [
          { id: 'a', text: 'ГГГГ-ММ-ДД' },
          { id: 'b', text: 'ДД.ММ.ГГГГ' },
          { id: 'c', text: 'ММ/ДД/ГГГГ' },
          { id: 'd', text: 'Формат не указан' },
        ],
        correct: 'b',
        explanation:
          'Дословно: дата в формате ДД.ММ.ГГГГ. В базе при этом хранится ГГГГ-ММ-ДД, поэтому нужен перевод в обе стороны.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Что вернёт `new Date(2026, 0, 15).getMonth()`?',
        options: [
          { id: 'a', text: '0' },
          { id: 'b', text: '1' },
          { id: 'c', text: '15' },
          { id: 'd', text: '2026' },
        ],
        correct: 'a',
        explanation:
          'Месяцы нумеруются с нуля: январь — 0, декабрь — 11. При форматировании нужно прибавлять единицу.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как перевести «15.03.2026» в формат базы данных?',
        options: [
          { id: 'a', text: 'Разбить по точке и собрать как "2026-03-15"' },
          { id: 'b', text: 'new Date("15.03.2026").toISOString()' },
          { id: 'c', text: 'Date.parse("15.03.2026")' },
          { id: 'd', text: 'Никак, нужен специальный пакет' },
        ],
        correct: 'a',
        explanation:
          'Разбор строки «15.03.2026» конструктором Date ненадёжен и зависит от браузера. Простой split по точке предсказуем.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Как проверить, что «31.02.2026» — несуществующая дата?',
        options: [
          { id: 'a', text: 'Достаточно проверить, что день от 1 до 31' },
          { id: 'b', text: 'Создать Date и убедиться, что день и месяц совпали с исходными' },
          { id: 'c', text: 'Сравнить строку с шаблоном' },
          { id: 'd', text: 'Проверить длину строки' },
        ],
        correct: 'b',
        explanation:
          'Date «переедет» на 3 марта. Сравнение полученных getDate() и getMonth() с исходными числами ловит такие случаи.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Даты можно сравнивать через `<` и `>`, а вот через `===` — нельзя.',
        correct: true,
        explanation:
          'Сравнение больше/меньше работает через приведение к числу. Для равенства нужно сравнивать `a.getTime() === b.getTime()`.',
      },
    ],
  },

  {
    id: 'quiz-ts-basics',
    title: 'TypeScript: основы',
    topicIds: ['ts-basics'],
    tech: ['ts'],
    monthNo: 2,
    difficulty: 2,
    passPercent: 70,
    examRefs: ['m3-quality'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Зачем нужен TypeScript?',
        options: [
          { id: 'a', text: 'Он ускоряет выполнение кода' },
          { id: 'b', text: 'Он находит ошибки типов до запуска программы' },
          { id: 'c', text: 'Он заменяет тесты' },
          { id: 'd', text: 'Он нужен только для React' },
        ],
        correct: 'b',
        explanation:
          'В браузер попадает обычный JavaScript. Вся польза — на этапе написания: опечатка в имени поля подсвечивается сразу.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Когда аннотация типа не нужна?',
        options: [
          { id: 'a', text: 'Никогда, типы пишут всегда' },
          { id: 'b', text: 'Когда тип очевиден из значения: `const n = 5`' },
          { id: 'c', text: 'Для параметров функции' },
          { id: 'd', text: 'Для возвращаемых значений' },
        ],
        correct: 'b',
        explanation:
          'TypeScript сам выведет number. А вот параметры функции аннотировать нужно почти всегда — вывести их не из чего.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Почему `any` — плохая привычка?',
        options: [
          { id: 'a', text: 'Он замедляет компиляцию' },
          { id: 'b', text: 'Он отключает проверку типов, и смысл TypeScript теряется' },
          { id: 'c', text: 'Он не поддерживается в новых версиях' },
          { id: 'd', text: 'Он работает только с объектами' },
        ],
        correct: 'b',
        explanation:
          'В модуле 3 оценивают качество кода. Отсутствие any — один из пунктов, который легко проверить поиском по проекту.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Файл с расширением .ts нельзя запустить напрямую в браузере — его нужно скомпилировать.',
        correct: true,
        explanation:
          'Компиляцию берут на себя инструменты сборки: Vite для клиента, tsx или tsc для сервера.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Ошибка «Type \'string\' is not assignable to type \'number\'» означает…',
        options: [
          { id: 'a', text: 'Переменная не объявлена' },
          { id: 'b', text: 'В переменную типа number пытаются положить строку' },
          { id: 'c', text: 'Число слишком большое' },
          { id: 'd', text: 'Нужно добавить any' },
        ],
        correct: 'b',
        explanation:
          'Читать сообщение стоит так: «тип X нельзя положить в Y». Частый источник — значения из req.params и req.query, они всегда строки.',
      },
    ],
  },

  {
    id: 'quiz-ts-types',
    title: 'type, interface и литеральные типы',
    topicIds: ['ts-types'],
    tech: ['ts'],
    monthNo: 2,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Как описать тип статуса заявки, допускающий только три значения?',
        options: [
          { id: 'a', text: 'type Status = string' },
          { id: 'b', text: "type Status = 'Новая' | 'Мероприятие назначено' | 'Мероприятие завершено'" },
          { id: 'c', text: 'type Status = [string, string, string]' },
          { id: 'd', text: 'interface Status { value: string }' },
        ],
        correct: 'b',
        explanation:
          'Объединение литеральных типов. Опечатка в статусе станет ошибкой компиляции — а статусы в задании проверяют дословно.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Что означает `readonly` у поля?',
        options: [
          { id: 'a', text: 'Поле необязательное' },
          { id: 'b', text: 'Поле нельзя изменить после создания объекта' },
          { id: 'c', text: 'Поле скрыто от других модулей' },
          { id: 'd', text: 'Поле доступно только для чтения из базы' },
        ],
        correct: 'b',
        explanation: 'Проверка действует на этапе компиляции. В рантайме ограничения нет.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Что означает `email?: string`?',
        options: [
          { id: 'a', text: 'Поле может быть строкой или undefined' },
          { id: 'b', text: 'Поле обязательно, но может быть пустым' },
          { id: 'c', text: 'Поле только для чтения' },
          { id: 'd', text: 'Поле имеет значение по умолчанию' },
        ],
        correct: 'a',
        explanation:
          'Перед использованием такого поля TypeScript потребует проверки — это и есть защита от «Cannot read properties of undefined».',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Как описать массив заявок?',
        options: [
          { id: 'a', text: 'Array Application' },
          { id: 'b', text: 'Application[]' },
          { id: 'c', text: '[Application]' },
          { id: 'd', text: 'List<Application>' },
        ],
        correct: 'b',
        explanation: 'Эквивалентная запись — `Array<Application>`. Запись `[Application]` означает кортеж из ровно одного элемента.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Для описания формы объекта `interface` и `type` в проекте экзамена взаимозаменяемы.',
        correct: true,
        explanation:
          'Разница проявляется в тонкостях (слияние объявлений у interface, объединения у type). Главное — выбрать один стиль и держаться его.',
      },
    ],
  },

  {
    id: 'quiz-ts-functions',
    title: 'Типизация функций',
    topicIds: ['ts-functions'],
    tech: ['ts'],
    monthNo: 2,
    difficulty: 3,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Какой тип возвращает `async function getUser(): ???`, если внутри возвращается User?',
        options: [
          { id: 'a', text: 'User' },
          { id: 'b', text: 'Promise<User>' },
          { id: 'c', text: 'Async<User>' },
          { id: 'd', text: 'User | undefined' },
        ],
        correct: 'b',
        explanation: 'Любая async-функция возвращает промис, и тип должен это отражать.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Чем `unknown` лучше `any`?',
        options: [
          { id: 'a', text: 'Ничем, это синонимы' },
          { id: 'b', text: 'С `unknown` нельзя работать, пока не проверишь тип — компилятор заставит это сделать' },
          { id: 'c', text: '`unknown` быстрее' },
          { id: 'd', text: '`unknown` разрешает любые операции' },
        ],
        correct: 'b',
        explanation:
          'Идеален для `catch (error: unknown)`: прежде чем читать error.message, придётся проверить `error instanceof Error`.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Что означает запись `function first<T>(items: T[]): T | undefined`?',
        options: [
          { id: 'a', text: 'Функция работает только с массивом строк' },
          { id: 'b', text: 'Функция работает с массивом любого типа и возвращает элемент того же типа' },
          { id: 'c', text: 'T — это имя переменной' },
          { id: 'd', text: 'Это синтаксическая ошибка' },
        ],
        correct: 'b',
        explanation:
          'Обобщённый тип сохраняет связь: передали Application[] — получили Application | undefined, без потери информации.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Необязательный параметр должен идти после обязательных.',
        correct: true,
        explanation: 'Иначе компилятор выдаст ошибку: он не сможет понять, какой аргумент к какому параметру относится.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Какой тип указывают функции, которая ничего не возвращает?',
        options: [
          { id: 'a', text: 'null' },
          { id: 'b', text: 'void' },
          { id: 'c', text: 'undefined' },
          { id: 'd', text: 'never' },
        ],
        correct: 'b',
        explanation: '`never` — для функций, которые никогда не завершаются нормально (всегда бросают ошибку или зацикливаются).',
      },
    ],
  },

  {
    id: 'quiz-ts-oop',
    title: 'ООП в TypeScript',
    topicIds: ['ts-oop'],
    tech: ['ts'],
    monthNo: 2,
    difficulty: 3,
    passPercent: 80,
    examRefs: ['m1-oop-styles'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Задание требует использовать ООП. Что это означает на практике?',
        options: [
          { id: 'a', text: 'Весь код должен состоять из классов' },
          { id: 'b', text: 'В проекте должен быть хотя бы один осмысленный класс' },
          { id: 'c', text: 'Нужно наследование и полиморфизм' },
          { id: 'd', text: 'Достаточно объектов-литералов' },
        ],
        correct: 'b',
        explanation:
          'Формулировка задания — «с использованием объектно-ориентированного подхода». Естественное место для класса на сервере — репозиторий заявок.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Что делает краткая запись `constructor(private pool: Pool) {}`?',
        options: [
          { id: 'a', text: 'Ничего, это ошибка' },
          { id: 'b', text: 'Создаёт приватное поле pool и сразу присваивает ему аргумент' },
          { id: 'c', text: 'Объявляет локальную переменную' },
          { id: 'd', text: 'Делает поле статическим' },
        ],
        correct: 'b',
        explanation:
          'Модификатор в параметрах конструктора избавляет от строк `this.pool = pool`. Это возможность именно TypeScript.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Что означает `implements` у класса?',
        options: [
          { id: 'a', text: 'Класс наследует другой класс' },
          { id: 'b', text: 'Класс обязуется иметь все методы и поля интерфейса' },
          { id: 'c', text: 'Класс создаёт экземпляр интерфейса' },
          { id: 'd', text: 'Класс становится абстрактным' },
        ],
        correct: 'b',
        explanation:
          'Если метод забыть — компилятор сразу укажет на это. Интерфейс работает как контракт.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Функция предпочтительнее класса, когда состояние хранить не нужно.',
        correct: true,
        explanation:
          'Класс с единственным методом и без полей — лишняя сложность. Класс уместен там, где есть общее состояние: пул соединений, набор методов над одной таблицей.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Чем `private` отличается от `public`?',
        options: [
          { id: 'a', text: 'private поле доступно только внутри класса' },
          { id: 'b', text: 'private поле нельзя изменить' },
          { id: 'c', text: 'public поле видно только в этом файле' },
          { id: 'd', text: 'Разницы нет' },
        ],
        correct: 'a',
        explanation:
          'Проверка происходит при компиляции. По умолчанию (без модификатора) поле public.',
      },
    ],
  },

  {
    id: 'quiz-bootstrap-basics',
    title: 'Bootstrap: подключение и утилиты',
    topicIds: ['bootstrap-basics'],
    tech: ['bootstrap', 'css'],
    monthNo: 2,
    difficulty: 1,
    passPercent: 80,
    examRefs: ['m1-oop-styles'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Почему на экзамене нельзя подключать Bootstrap с CDN?',
        options: [
          { id: 'a', text: 'CDN работает медленно' },
          { id: 'b', text: 'На экзамене нет доступа в интернет' },
          { id: 'c', text: 'CDN-версия урезана' },
          { id: 'd', text: 'Это запрещено лицензией' },
        ],
        correct: 'b',
        explanation:
          'Задание прямо требует библиотеку, установленную через npm: `npm i bootstrap`, затем импорт CSS из node_modules.',
      },
      {
        id: 'q2',
        type: 'match',
        text: 'Сопоставьте класс-утилиту и результат.',
        left: [
          { id: 'l1', text: 'mt-3' },
          { id: 'l2', text: 'p-4' },
          { id: 'l3', text: 'mb-0' },
          { id: 'l4', text: 'mx-auto' },
        ],
        right: [
          { id: 'r1', text: 'Внешний отступ сверху' },
          { id: 'r2', text: 'Внутренний отступ со всех сторон' },
          { id: 'r3', text: 'Убрать внешний отступ снизу' },
          { id: 'r4', text: 'Центрировать по горизонтали' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation:
          'Схема одинакова: первая буква — свойство (m/p), вторая — сторона (t, b, s, e, x, y), число — шаг шкалы от 0 до 5.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как правильно дополнять Bootstrap своими стилями?',
        options: [
          { id: 'a', text: 'Править файлы в node_modules' },
          { id: 'b', text: 'Подключить свой CSS после Bootstrap и писать в нём' },
          { id: 'c', text: 'Использовать !important для всего' },
          { id: 'd', text: 'Не дополнять вообще' },
        ],
        correct: 'b',
        explanation:
          'Правки в node_modules исчезнут при переустановке и не попадут в репозиторий. Порядок подключения решает конфликты без !important.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Часть компонентов Bootstrap (модальные окна, всплывающие подсказки) требует подключения JavaScript.',
        correct: true,
        explanation:
          'В React обычно берут либо bootstrap/dist/js/bootstrap.bundle, либо реализуют поведение своим состоянием — второе предсказуемее.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Какой класс сделает текст по центру?',
        options: [
          { id: 'a', text: 'text-middle' },
          { id: 'b', text: 'text-center' },
          { id: 'c', text: 'align-center' },
          { id: 'd', text: 'center-text' },
        ],
        correct: 'b',
        explanation: 'Рядом полезны text-muted (приглушённый), fw-bold (жирный), fs-5 (размер).',
      },
    ],
  },

  {
    id: 'quiz-bootstrap-grid',
    title: 'Сетка Bootstrap',
    topicIds: ['bootstrap-grid'],
    tech: ['bootstrap', 'css'],
    monthNo: 2,
    difficulty: 2,
    passPercent: 80,
    examRefs: ['m2-mobile'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Сколько колонок в сетке Bootstrap?',
        options: [
          { id: 'a', text: '6' },
          { id: 'b', text: '10' },
          { id: 'c', text: '12' },
          { id: 'd', text: '16' },
        ],
        correct: 'c',
        explanation: 'Двенадцать делится на 2, 3, 4 и 6 — отсюда удобные половины, трети и четверти.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Что означает `col-12 col-md-6`?',
        options: [
          { id: 'a', text: 'Всегда половина ширины' },
          { id: 'b', text: 'На телефоне — во всю ширину, с 768px — половина' },
          { id: 'c', text: 'На телефоне — половина, на десктопе — во всю ширину' },
          { id: 'd', text: 'Ошибка: нельзя указывать два класса col' },
        ],
        correct: 'b',
        explanation:
          'Это и есть mobile-first: базовый класс описывает узкий экран, классы с брейкпоинтом добавляют поведение для широких.',
      },
      {
        id: 'q3',
        type: 'order',
        text: 'Расставьте брейкпоинты по возрастанию ширины.',
        items: [
          { id: 'i1', text: 'sm (576px)' },
          { id: 'i2', text: 'md (768px)' },
          { id: 'i3', text: 'lg (992px)' },
          { id: 'i4', text: 'xl (1200px)' },
        ],
        correct: ['i1', 'i2', 'i3', 'i4'],
        explanation: 'Есть ещё xxl (1400px). Для экзамена достаточно помнить md и lg.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Какой класс задаёт промежутки между колонками?',
        options: [
          { id: 'a', text: 'gap-3' },
          { id: 'b', text: 'g-3' },
          { id: 'c', text: 'space-3' },
          { id: 'd', text: 'col-gap-3' },
        ],
        correct: 'b',
        explanation: 'g-* ставится на row. Отдельно есть gx-* (по горизонтали) и gy-* (по вертикали).',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Колонки `col-*` обязательно должны лежать внутри `row`, а `row` — внутри `container`.',
        correct: true,
        explanation:
          'Без row у колонок появятся лишние отступы и горизонтальная прокрутка — прямое нарушение требования к мобильной версии.',
      },
    ],
  },

  {
    id: 'quiz-bootstrap-components',
    title: 'Компоненты Bootstrap',
    topicIds: ['bootstrap-components'],
    tech: ['bootstrap'],
    monthNo: 2,
    difficulty: 2,
    passPercent: 80,
    examRefs: ['m2-design', 'm2-admin-tools'],
    questions: [
      {
        id: 'q1',
        type: 'match',
        text: 'Сопоставьте компонент и задачу в проекте экзамена.',
        left: [
          { id: 'l1', text: 'card' },
          { id: 'l2', text: 'badge' },
          { id: 'l3', text: 'toast' },
          { id: 'l4', text: 'pagination' },
        ],
        right: [
          { id: 'r1', text: 'Карточка заявки в кабинете' },
          { id: 'r2', text: 'Цветная метка статуса' },
          { id: 'r3', text: 'Всплывающее уведомление админки' },
          { id: 'r4', text: 'Постраничная навигация' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation:
          'Требования модуля 2 к админке названы прямо: фильтры, всплывающие уведомления, постраничная навигация, сортировка.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Какой класс делает таблицу прокручиваемой на узком экране?',
        options: [
          { id: 'a', text: 'table-scroll' },
          { id: 'b', text: 'table-responsive' },
          { id: 'c', text: 'table-mobile' },
          { id: 'd', text: 'overflow-table' },
        ],
        correct: 'b',
        explanation:
          'Он оборачивает таблицу контейнером с горизонтальной прокруткой, и страница целиком не уезжает вбок.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Какие классы используются для поля с ошибкой?',
        options: [
          { id: 'a', text: 'form-control is-invalid и invalid-feedback' },
          { id: 'b', text: 'form-input has-error' },
          { id: 'c', text: 'input-error и error-message' },
          { id: 'd', text: 'form-control danger' },
        ],
        correct: 'a',
        explanation:
          'Блок invalid-feedback должен быть соседом поля, иначе он останется невидимым.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Какой компонент даёт сворачивающееся меню-бургер?',
        options: [
          { id: 'a', text: 'navbar с navbar-toggler' },
          { id: 'b', text: 'nav-tabs' },
          { id: 'c', text: 'dropdown' },
          { id: 'd', text: 'offcanvas обязательно' },
        ],
        correct: 'a',
        explanation:
          'navbar-expand-lg разворачивает меню с 992px, ниже — кнопка-бургер. Для мобильной версии это рабочее решение.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Классы alert-success, alert-danger, alert-warning различают сообщения по смыслу.',
        correct: true,
        explanation:
          'Цвет должен соответствовать смыслу: успех — зелёный, ошибка — красный, предупреждение — жёлтый. Это часть оценки интерфейса.',
      },
    ],
  },
];
