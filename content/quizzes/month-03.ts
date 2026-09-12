import type { Quiz } from '../types';

/** Месяц 3: React и клиентское приложение. */
export const MONTH_03_QUIZZES: Quiz[] = [
  {
    id: 'quiz-react-basics',
    title: 'React и Vite: первый проект',
    topicIds: ['react-basics'],
    tech: ['react', 'ts', 'tools'],
    monthNo: 3,
    difficulty: 2,
    passPercent: 70,
    examRefs: ['m3-framework'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Какой командой создаётся клиентский проект на React и TypeScript?',
        options: [
          { id: 'a', text: 'npm create vite@latest client -- --template react-ts' },
          { id: 'b', text: 'npm install react' },
          { id: 'c', text: 'npx create-react-app client' },
          { id: 'd', text: 'npm init react' },
        ],
        correct: 'a',
        explanation:
          'Vite создаёт проект за секунды и запускается быстро. Шаблон react-ts сразу настраивает TypeScript.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Почему имя компонента пишут с заглавной буквы?',
        options: [
          { id: 'a', text: 'Это соглашение о стиле, не влияет ни на что' },
          { id: 'b', text: 'React считает теги с маленькой буквы обычными HTML-элементами' },
          { id: 'c', text: 'Так требует TypeScript' },
          { id: 'd', text: 'Иначе не сработает импорт' },
        ],
        correct: 'b',
        explanation:
          '`<card />` React попытается отрисовать как неизвестный HTML-тег, и на экране ничего не появится — без ошибки в консоли.',
      },
      {
        id: 'q3',
        type: 'order',
        text: 'Расставьте файлы в порядке запуска приложения.',
        items: [
          { id: 'i1', text: 'index.html с div#root' },
          { id: 'i2', text: 'main.tsx — точка входа' },
          { id: 'i3', text: 'App.tsx — корневой компонент' },
        ],
        correct: ['i1', 'i2', 'i3'],
        explanation:
          'main.tsx находит div#root и отрисовывает в нём App. Понимание цепочки помогает, когда «страница пустая».',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'После `npm run dev` изменения в коде появляются в браузере без ручной перезагрузки.',
        correct: true,
        explanation:
          'Это горячая перезагрузка. Если она перестала срабатывать — обычно в консоли есть ошибка компиляции.',
      },
      {
        id: 'q5',
        type: 'multiple',
        text: 'Что стоит убрать из шаблона Vite первым делом?',
        options: [
          { id: 'a', text: 'Демонстрационный счётчик в App.tsx' },
          { id: 'b', text: 'Логотипы React и Vite' },
          { id: 'c', text: 'Стили App.css с оформлением демо' },
          { id: 'd', text: 'Файл main.tsx' },
          { id: 'e', text: 'index.html' },
        ],
        correct: ['a', 'b', 'c'],
        explanation:
          'main.tsx и index.html — основа приложения, их не удаляют. А вот забытый логотип Vite в сданном проекте выглядит небрежно.',
      },
    ],
  },

  {
    id: 'quiz-react-tsx',
    title: 'Правила TSX',
    topicIds: ['react-tsx'],
    tech: ['react', 'ts'],
    monthNo: 3,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Как в TSX задать класс элемента?',
        options: [
          { id: 'a', text: 'class="card"' },
          { id: 'b', text: 'className="card"' },
          { id: 'c', text: 'css="card"' },
          { id: 'd', text: 'classList="card"' },
        ],
        correct: 'b',
        explanation:
          '`class` — зарезервированное слово JavaScript. По той же причине `for` у label превращается в `htmlFor`.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Компонент должен вернуть два соседних блока без обёртки. Что использовать?',
        options: [
          { id: 'a', text: 'Обязательно div' },
          { id: 'b', text: 'Фрагмент <>…</>' },
          { id: 'c', text: 'Массив' },
          { id: 'd', text: 'Два return подряд' },
        ],
        correct: 'b',
        explanation:
          'Фрагмент группирует элементы, не создавая лишнего узла в DOM. Это важно внутри flex- и grid-раскладок.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как задать инлайновый стиль?',
        options: [
          { id: 'a', text: 'style="color: red"' },
          { id: 'b', text: 'style={{ color: "red" }}' },
          { id: 'c', text: 'style={ color: red }' },
          { id: 'd', text: 'css={{ color: "red" }}' },
        ],
        correct: 'b',
        explanation:
          'Внешние скобки — подстановка выражения, внутренние — объект. Свойства пишутся в camelCase: backgroundColor, fontSize.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'В TSX теги без содержимого должны закрываться: `<img />`, `<br />`, `<input />`.',
        correct: true,
        explanation: 'Незакрытый тег — ошибка компиляции. В обычном HTML это допустимо, в TSX — нет.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Как вывести значение переменной внутри разметки?',
        options: [
          { id: 'a', text: '{{ value }}' },
          { id: 'b', text: '{value}' },
          { id: 'c', text: '${value}' },
          { id: 'd', text: '<%= value %>' },
        ],
        correct: 'b',
        explanation:
          'Одинарные фигурные скобки принимают любое выражение JavaScript: `{user.name}`, `{items.length}`, `{a ? b : c}`.',
      },
    ],
  },

  {
    id: 'quiz-react-props',
    title: 'Props',
    topicIds: ['react-props'],
    tech: ['react', 'ts'],
    monthNo: 3,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Как правильно типизировать props компонента?',
        options: [
          { id: 'a', text: 'function Card(props: any)' },
          { id: 'b', text: 'interface Props { title: string } и function Card({ title }: Props)' },
          { id: 'c', text: 'function Card(title: string)' },
          { id: 'd', text: 'Типизация props не нужна' },
        ],
        correct: 'b',
        explanation:
          'Тогда редактор подскажет список свойств, а забытое обязательное свойство станет ошибкой компиляции.',
      },
      {
        id: 'q2',
        type: 'boolean',
        text: 'Компонент может изменять полученные props.',
        correct: false,
        explanation:
          'Props доступны только для чтения. Чтобы что-то изменить, компонент вызывает функцию, переданную родителем, — например onStatusChange.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Что такое `children`?',
        options: [
          { id: 'a', text: 'Список дочерних компонентов файла' },
          { id: 'b', text: 'Содержимое, вложенное между открывающим и закрывающим тегом компонента' },
          { id: 'c', text: 'Массив состояний' },
          { id: 'd', text: 'Специальный хук' },
        ],
        correct: 'b',
        explanation:
          'Тип — `React.ReactNode`. Так делают универсальные обёртки: Modal, Card, ProtectedRoute.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Как передать функцию в компонент?',
        options: [
          { id: 'a', text: '<Btn onClick="handle()" />' },
          { id: 'b', text: '<Btn onClick={handle} />' },
          { id: 'c', text: '<Btn onClick={handle()} />' },
          { id: 'd', text: '<Btn onClick=handle />' },
        ],
        correct: 'b',
        explanation:
          'Со скобками функция вызовется сразу при отрисовке, а в props попадёт её результат. Если нужны аргументы — оборачивайте: `onClick={() => handle(id)}`.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Как задать значение props по умолчанию?',
        options: [
          { id: 'a', text: 'function Btn({ size = "md" }: Props)' },
          { id: 'b', text: 'Btn.defaultProps — единственный способ' },
          { id: 'c', text: 'В интерфейсе Props' },
          { id: 'd', text: 'Значения по умолчанию невозможны' },
        ],
        correct: 'a',
        explanation:
          'Значение по умолчанию прямо в деструктуризации — современный способ. В интерфейсе такое свойство помечают как необязательное: `size?: string`.',
      },
    ],
  },

  {
    id: 'quiz-react-lists',
    title: 'Списки и key',
    topicIds: ['react-lists'],
    tech: ['react'],
    monthNo: 3,
    difficulty: 2,
    passPercent: 80,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Зачем React нужен атрибут `key`?',
        options: [
          { id: 'a', text: 'Для сортировки списка' },
          { id: 'b', text: 'Чтобы при изменении списка понять, какие элементы остались прежними' },
          { id: 'c', text: 'Для доступа к элементу из кода' },
          { id: 'd', text: 'Для оформления' },
        ],
        correct: 'b',
        explanation:
          'Без key React перерисовывает больше, чем нужно, и может перепутать состояние элементов — например, введённый текст «переедет» в другую строку.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Что лучше всего подходит на роль key для списка заявок?',
        options: [
          { id: 'a', text: 'Индекс массива' },
          { id: 'b', text: 'id заявки из базы данных' },
          { id: 'c', text: 'Math.random()' },
          { id: 'd', text: 'Название статуса' },
        ],
        correct: 'b',
        explanation:
          'Math.random() меняется на каждой отрисовке — React пересоздаст все элементы. Индекс ломается при удалении и сортировке. id уникален и стабилен.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как отрисовать массив заявок?',
        options: [
          { id: 'a', text: '{orders.forEach(o => <Row key={o.id} order={o} />)}' },
          { id: 'b', text: '{orders.map(o => <Row key={o.id} order={o} />)}' },
          { id: 'c', text: '{for (const o of orders) <Row />}' },
          { id: 'd', text: '{orders.join()}' },
        ],
        correct: 'b',
        explanation:
          'forEach возвращает undefined, и на экране ничего не появится. Цикл for внутри разметки использовать нельзя — там допустимы только выражения.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Индекс массива в качестве key допустим, если список статичен и никогда не сортируется и не фильтруется.',
        correct: true,
        explanation:
          'Например, четыре картинки слайдера. Но в админке с фильтрами и сортировкой индекс использовать нельзя.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Где ставится key, если строка вынесена в отдельный компонент?',
        options: [
          { id: 'a', text: 'Внутри компонента, на корневом элементе' },
          { id: 'b', text: 'На самом компоненте в месте вызова: <Row key={o.id} …/>' },
          { id: 'c', text: 'В обоих местах' },
          { id: 'd', text: 'Не имеет значения' },
        ],
        correct: 'b',
        explanation:
          'key нужен там, где элемент создаётся в цикле. Внутрь компонента он не передаётся и через props недоступен.',
      },
    ],
  },

  {
    id: 'quiz-react-conditional',
    title: 'Условный рендер',
    topicIds: ['react-conditional'],
    tech: ['react'],
    monthNo: 3,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Что покажет `{items.length && <List />}`, если массив пуст?',
        options: [
          { id: 'a', text: 'Ничего' },
          { id: 'b', text: 'Цифру 0 на экране' },
          { id: 'c', text: 'Список' },
          { id: 'd', text: 'Ошибку' },
        ],
        correct: 'b',
        explanation:
          'Знаменитая ловушка: 0 — ложное значение, но React его отображает. Правильно: `items.length > 0 && <List />`.',
      },
      {
        id: 'q2',
        type: 'order',
        text: 'Расставьте проверки состояний страницы в правильном порядке.',
        items: [
          { id: 'i1', text: 'if (loading) return <Spinner />' },
          { id: 'i2', text: 'if (error) return <ErrorBox />' },
          { id: 'i3', text: 'if (items.length === 0) return <Empty />' },
          { id: 'i4', text: 'return <List items={items} />' },
        ],
        correct: ['i1', 'i2', 'i3', 'i4'],
        explanation:
          'Ранние return читаются сверху вниз и избавляют от вложенных тернарных операторов. Эти четыре состояния должны быть у каждой страницы с данными.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как показать один из двух вариантов?',
        options: [
          { id: 'a', text: '{user ? <Profile /> : <LoginLink />}' },
          { id: 'b', text: '{if (user) <Profile /> else <LoginLink />}' },
          { id: 'c', text: '{user && <Profile /> || <LoginLink />}' },
          { id: 'd', text: '{switch(user)}' },
        ],
        correct: 'a',
        explanation:
          'Тернарный оператор — единственная конструкция ветвления, допустимая прямо в разметке. `if` там использовать нельзя.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Компонент может вернуть `null` — тогда он ничего не отрисует.',
        correct: true,
        explanation:
          'Удобно для защищённого маршрута: пока сессия восстанавливается, компонент возвращает null и не мигает формой входа.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Задание требует показывать предупреждение при неверных данных входа. Как это реализовать?',
        options: [
          { id: 'a', text: 'alert("Неверный логин или пароль")' },
          { id: 'b', text: 'Хранить текст ошибки в состоянии и показывать его блоком на странице' },
          { id: 'c', text: 'console.error' },
          { id: 'd', text: 'Перенаправить на страницу ошибки' },
        ],
        correct: 'b',
        explanation:
          'alert выглядит непрофессионально и блокирует интерфейс. Требование модуля 2 — понятное предупреждение прямо в форме.',
      },
    ],
  },

  {
    id: 'quiz-react-state',
    title: 'useState',
    topicIds: ['react-state'],
    tech: ['react'],
    monthNo: 3,
    difficulty: 2,
    passPercent: 80,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Почему нельзя писать `count = count + 1` вместо `setCount(count + 1)`?',
        options: [
          { id: 'a', text: 'Будет ошибка синтаксиса' },
          { id: 'b', text: 'React не узнает об изменении и не перерисует компонент' },
          { id: 'c', text: 'Значение не сохранится в localStorage' },
          { id: 'd', text: 'Это медленнее' },
        ],
        correct: 'b',
        explanation:
          'Перерисовка запускается именно вызовом setter. Прямое присваивание к тому же невозможно: переменная объявлена через const.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Как добавить заявку в массив состояния?',
        options: [
          { id: 'a', text: 'orders.push(newOrder)' },
          { id: 'b', text: 'setOrders([...orders, newOrder])' },
          { id: 'c', text: 'setOrders(orders.push(newOrder))' },
          { id: 'd', text: 'orders = [...orders, newOrder]' },
        ],
        correct: 'b',
        explanation:
          'Нужен новый массив: React сравнивает ссылки. push меняет массив на месте и возвращает число — вариант «c» положит в состояние длину массива.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Когда нужна форма `setCount(prev => prev + 1)`?',
        options: [
          { id: 'a', text: 'Всегда' },
          { id: 'b', text: 'Когда новое значение зависит от предыдущего, особенно внутри таймера' },
          { id: 'c', text: 'Только для массивов' },
          { id: 'd', text: 'Никогда, это устаревший приём' },
        ],
        correct: 'b',
        explanation:
          'В setInterval замыкание запоминает старое значение. Без функциональной формы слайдер застрянет на втором кадре.',
      },
      {
        id: 'q4',
        type: 'multiple',
        text: 'Какие правила хуков верны?',
        options: [
          { id: 'a', text: 'Хуки вызываются только на верхнем уровне компонента' },
          { id: 'b', text: 'Хуки нельзя вызывать внутри условий и циклов' },
          { id: 'c', text: 'Хуки можно вызывать в обычных функциях' },
          { id: 'd', text: 'Свои хуки называют начиная с use' },
        ],
        correct: ['a', 'b', 'd'],
        explanation:
          'React опирается на порядок вызова хуков. Вызов внутри if меняет порядок между отрисовками и ломает соответствие состояний.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Как обновить одно поле в объекте состояния формы?',
        options: [
          { id: 'a', text: 'setForm({ [name]: value })' },
          { id: 'b', text: 'setForm({ ...form, [name]: value })' },
          { id: 'c', text: 'form[name] = value' },
          { id: 'd', text: 'setForm(form[name] = value)' },
        ],
        correct: 'b',
        explanation:
          'Первый вариант сотрёт остальные поля. Spread копирует объект, а вычисляемое имя `[name]` заменяет нужное поле.',
      },
    ],
  },

  {
    id: 'quiz-react-forms',
    title: 'Формы в React',
    topicIds: ['react-forms'],
    tech: ['react'],
    monthNo: 3,
    difficulty: 3,
    passPercent: 80,
    examRefs: ['m1-register', 'm2-register-hints'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Что делает поле управляемым?',
        options: [
          { id: 'a', text: 'Атрибут required' },
          { id: 'b', text: 'Пара `value={…}` и `onChange={…}`' },
          { id: 'c', text: 'Атрибут name' },
          { id: 'd', text: 'Обёртка в form' },
        ],
        correct: 'b',
        explanation:
          'Значение хранится в состоянии React, а не в самом поле. Если задать value без onChange, поле станет нередактируемым.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Как одним обработчиком обслужить все поля формы?',
        options: [
          { id: 'a', text: 'setForm({ ...form, [e.target.name]: e.target.value })' },
          { id: 'b', text: 'Написать по обработчику на каждое поле' },
          { id: 'c', text: 'Использовать ref' },
          { id: 'd', text: 'Через FormData при каждом вводе' },
        ],
        correct: 'a',
        explanation:
          'Имя поля берётся из атрибута name. Пять полей регистрации обслуживает одна функция из трёх строк.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Зачем блокировать кнопку отправки во время запроса?',
        options: [
          { id: 'a', text: 'Так требует Bootstrap' },
          { id: 'b', text: 'Чтобы двойной клик не создал две одинаковые заявки' },
          { id: 'c', text: 'Для ускорения запроса' },
          { id: 'd', text: 'Это не нужно' },
        ],
        correct: 'b',
        explanation:
          'Плюс пользователь видит, что процесс идёт. Обычно к блокировке добавляют текст «Отправка…» или спиннер.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'В обработчике onSubmit нужно вызывать `event.preventDefault()`.',
        correct: true,
        explanation: 'Иначе форма перезагрузит страницу, и приложение потеряет всё состояние.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Когда показывать ошибку поля?',
        options: [
          { id: 'a', text: 'Сразу при открытии формы' },
          { id: 'b', text: 'После попытки отправки или после того, как пользователь ушёл с поля' },
          { id: 'c', text: 'На каждое нажатие клавиши с первого символа' },
          { id: 'd', text: 'Только после ответа сервера' },
        ],
        correct: 'b',
        explanation:
          'Красное поле «Логин слишком короткий» при вводе первой буквы раздражает. Разумный компромисс: проверять при отправке, а дальше — на каждое изменение уже «тронутого» поля.',
      },
    ],
  },

  {
    id: 'quiz-react-date-input',
    title: 'Поле даты с маской',
    topicIds: ['react-date-input'],
    tech: ['react'],
    monthNo: 3,
    difficulty: 3,
    passPercent: 80,
    examRefs: ['m2-order-form'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Почему `<input type="date">` не всегда подходит под требование задания?',
        options: [
          { id: 'a', text: 'Он не поддерживается браузерами' },
          { id: 'b', text: 'Он показывает дату в формате, зависящем от локали системы, а требуется ДД.ММ.ГГГГ' },
          { id: 'c', text: 'Он не работает на телефоне' },
          { id: 'd', text: 'Он не умеет ограничивать диапазон' },
        ],
        correct: 'b',
        explanation:
          'На системе с английской локалью пользователь увидит мм/дд/гггг. Задание требует ДД.ММ.ГГГГ — надёжнее текстовое поле с маской.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Как работает автоподстановка точек?',
        options: [
          { id: 'a', text: 'Точки вставляет браузер' },
          { id: 'b', text: 'Из введённого убираются все нецифры, затем точки ставятся после 2-й и 4-й цифры' },
          { id: 'c', text: 'Пользователь вводит точки сам' },
          { id: 'd', text: 'Через регулярное выражение при отправке' },
        ],
        correct: 'b',
        explanation:
          'Такой подход корректно переживает вставку из буфера и удаление символов в середине строки.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Пользователь ввёл 31.02.2026. Что должно произойти?',
        options: [
          { id: 'a', text: 'Дата сохранится как есть' },
          { id: 'b', text: 'Появится сообщение, что такой даты не существует' },
          { id: 'c', text: 'Дата автоматически станет 03.03.2026' },
          { id: 'd', text: 'Поле очистится без объяснений' },
        ],
        correct: 'b',
        explanation:
          'Молчаливое исправление хуже ошибки: пользователь не поймёт, почему мероприятие назначено на другой день.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Перед отправкой на сервер дату нужно перевести в формат ГГГГ-ММ-ДД.',
        correct: true,
        explanation:
          'MySQL хранит DATE именно так. Обратный перевод делают при отображении — на экране всегда ДД.ММ.ГГГГ.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Как запретить выбор прошедшей даты?',
        options: [
          { id: 'a', text: 'Сравнить введённую дату с сегодняшней и показать ошибку' },
          { id: 'b', text: 'Отключить поле' },
          { id: 'c', text: 'Это невозможно в текстовом поле' },
          { id: 'd', text: 'Проверять только на сервере' },
        ],
        correct: 'a',
        explanation:
          'Проверка нужна и на клиенте (удобство), и на сервере (надёжность). Сравнивайте с началом текущего дня, иначе сегодняшняя дата не пройдёт.',
      },
    ],
  },

  {
    id: 'quiz-react-router',
    title: 'React Router',
    topicIds: ['react-router'],
    tech: ['react'],
    monthNo: 3,
    difficulty: 2,
    passPercent: 70,
    examRefs: ['m2-layouts'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Чем `<Link to="/login">` лучше `<a href="/login">`?',
        options: [
          { id: 'a', text: 'Короче пишется' },
          { id: 'b', text: 'Переход происходит без перезагрузки страницы и без потери состояния' },
          { id: 'c', text: 'Ссылка становится доступной для поисковиков' },
          { id: 'd', text: 'Отличий нет' },
        ],
        correct: 'b',
        explanation:
          'Обычная ссылка перезагрузит приложение: контекст входа придётся восстанавливать, и это заметно мигает.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Как перейти на другую страницу из кода после успешной отправки заявки?',
        options: [
          { id: 'a', text: 'window.location.href = "/cabinet"' },
          { id: 'b', text: 'const navigate = useNavigate(); navigate("/cabinet")' },
          { id: 'c', text: 'redirect("/cabinet")' },
          { id: 'd', text: '<Link> внутри обработчика' },
        ],
        correct: 'b',
        explanation:
          'window.location тоже сработает, но перезагрузит приложение. useNavigate делает переход внутри приложения.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как описать маршрут страницы 404?',
        options: [
          { id: 'a', text: '<Route path="404" element={<NotFound />} />' },
          { id: 'b', text: '<Route path="*" element={<NotFound />} />' },
          { id: 'c', text: '<Route default element={<NotFound />} />' },
          { id: 'd', text: 'Отдельный маршрут не нужен' },
        ],
        correct: 'b',
        explanation: 'Звёздочка ловит все адреса, не совпавшие с предыдущими маршрутами. Ставится последней.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Как получить id заявки из адреса `/orders/:id`?',
        options: [
          { id: 'a', text: 'const { id } = useParams()' },
          { id: 'b', text: 'const id = useQuery("id")' },
          { id: 'c', text: 'props.id' },
          { id: 'd', text: 'window.location.id' },
        ],
        correct: 'a',
        explanation: 'useParams возвращает объект со строковыми значениями — для числа понадобится Number(id).',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Все маршруты должны находиться внутри `<BrowserRouter>`.',
        correct: true,
        explanation:
          'Обычно BrowserRouter оборачивает всё приложение в main.tsx. Хуки useNavigate и useParams вне роутера вызовут ошибку.',
      },
    ],
  },

  {
    id: 'quiz-react-effects',
    title: 'useEffect',
    topicIds: ['react-effects'],
    tech: ['react'],
    monthNo: 3,
    difficulty: 3,
    passPercent: 80,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Когда выполнится эффект с пустым массивом зависимостей `[]`?',
        options: [
          { id: 'a', text: 'При каждой отрисовке' },
          { id: 'b', text: 'Один раз после первой отрисовки' },
          { id: 'c', text: 'Никогда' },
          { id: 'd', text: 'При каждом изменении состояния' },
        ],
        correct: 'b',
        explanation:
          'Это стандартный способ загрузить данные при открытии страницы. В строгом режиме разработки React вызовет эффект дважды — это нормально.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Что произойдёт, если забыть массив зависимостей совсем?',
        options: [
          { id: 'a', text: 'Эффект выполнится один раз' },
          { id: 'b', text: 'Эффект будет выполняться после каждой отрисовки — возможен бесконечный цикл запросов' },
          { id: 'c', text: 'Будет ошибка компиляции' },
          { id: 'd', text: 'Эффект не выполнится' },
        ],
        correct: 'b',
        explanation:
          'Классика: эффект загружает данные → setState → перерисовка → эффект снова. Во вкладке Network видно бесконечную очередь запросов.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Зачем эффект возвращает функцию?',
        options: [
          { id: 'a', text: 'Чтобы вернуть данные' },
          { id: 'b', text: 'Это функция очистки: снять таймер, отписаться от события' },
          { id: 'c', text: 'Для обработки ошибок' },
          { id: 'd', text: 'Так требует TypeScript' },
        ],
        correct: 'b',
        explanation:
          'Она вызывается перед повторным запуском эффекта и при размонтировании компонента. Для слайдера там обязателен clearInterval.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Для вычисляемых значений (например, отфильтрованного списка) эффект не нужен.',
        correct: true,
        explanation:
          'Достаточно посчитать значение прямо при отрисовке. Лишний эффект с состоянием создаёт дополнительную перерисовку и рассинхронизацию.',
      },
      {
        id: 'q5',
        type: 'order',
        text: 'Расставьте шаги загрузки данных в эффекте.',
        items: [
          { id: 'i1', text: 'setLoading(true)' },
          { id: 'i2', text: 'Запрос к API внутри try' },
          { id: 'i3', text: 'Сохранить данные или текст ошибки в состояние' },
          { id: 'i4', text: 'setLoading(false) в finally' },
        ],
        correct: ['i1', 'i2', 'i3', 'i4'],
        explanation:
          'finally гарантирует, что спиннер исчезнет и при ошибке. Иначе страница зависнет в состоянии загрузки.',
      },
    ],
  },

  {
    id: 'quiz-react-slider',
    title: 'Слайдер на React',
    topicIds: ['react-slider'],
    tech: ['react'],
    monthNo: 3,
    difficulty: 3,
    passPercent: 80,
    examRefs: ['m2-slider'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Сколько изображений должно быть в слайдере по заданию?',
        options: [
          { id: 'a', text: 'Три' },
          { id: 'b', text: 'Четыре' },
          { id: 'c', text: 'Пять' },
          { id: 'd', text: 'Не менее трёх' },
        ],
        correct: 'b',
        explanation:
          'Дословно: «слайдер из 4 изображений одинакового размера» со сменой каждые 3 секунды и кнопками вперёд-назад.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Где создавать интервал автопереключения?',
        options: [
          { id: 'a', text: 'Прямо в теле компонента' },
          { id: 'b', text: 'Внутри useEffect с очисткой через clearInterval' },
          { id: 'c', text: 'В обработчике клика' },
          { id: 'd', text: 'В отдельном файле' },
        ],
        correct: 'b',
        explanation:
          'В теле компонента интервал создавался бы при каждой отрисовке — таймеры накопились бы десятками.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как реализовать кнопку «назад» с переходом по кругу для 4 слайдов?',
        options: [
          { id: 'a', text: 'setIndex(index - 1)' },
          { id: 'b', text: 'setIndex((index - 1 + 4) % 4)' },
          { id: 'c', text: 'setIndex(index % 4 - 1)' },
          { id: 'd', text: 'setIndex(Math.abs(index - 1))' },
        ],
        correct: 'b',
        explanation:
          'Прибавление длины перед взятием остатка защищает от отрицательного индекса: (0 - 1 + 4) % 4 = 3.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Как гарантировать одинаковый размер изображений?',
        options: [
          { id: 'a', text: 'Вручную обрезать все картинки до открытия проекта' },
          { id: 'b', text: 'Задать контейнеру фиксированную высоту, а img — width: 100%, height: 100%, object-fit: cover' },
          { id: 'c', text: 'Задать только width: 100%' },
          { id: 'd', text: 'Использовать max-width' },
        ],
        correct: 'b',
        explanation:
          'object-fit: cover сохраняет пропорции и обрезает лишнее. Одно только width: 100% оставит разную высоту, и слайдер будет «прыгать».',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Слайдер должен быть вписан в дизайн кабинета, а не выглядеть отдельным блоком.',
        correct: true,
        explanation:
          'Задание формулирует это прямо: слайдер размещается в личном кабинете и должен вписываться в его оформление.',
      },
    ],
  },

  {
    id: 'quiz-react-context',
    title: 'Контекст и данные о входе',
    topicIds: ['react-context'],
    tech: ['react', 'security'],
    monthNo: 3,
    difficulty: 3,
    passPercent: 80,
    examRefs: ['m1-login'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Какую задачу решает контекст?',
        options: [
          { id: 'a', text: 'Ускоряет отрисовку' },
          { id: 'b', text: 'Даёт доступ к общим данным без передачи props через все уровни' },
          { id: 'c', text: 'Заменяет сервер' },
          { id: 'd', text: 'Хранит данные между сессиями' },
        ],
        correct: 'b',
        explanation:
          'Данные о вошедшем пользователе нужны и в шапке, и в кабинете, и в защищённых маршрутах. Протаскивать их props через десять компонентов неудобно.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Почему при первой загрузке страницы нужно состояние «проверяем сессию»?',
        options: [
          { id: 'a', text: 'Так красивее' },
          { id: 'b', text: 'Иначе защищённая страница мигнёт формой входа до того, как токен прочитается из localStorage' },
          { id: 'c', text: 'Это требование React' },
          { id: 'd', text: 'Чтобы ускорить запросы' },
        ],
        correct: 'b',
        explanation:
          'Обычно вводят флаг `initializing`: пока он истинен, защищённые маршруты ничего не решают и ничего не показывают.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Что должен делать выход из системы?',
        options: [
          { id: 'a', text: 'Только очищать состояние контекста' },
          { id: 'b', text: 'Очищать состояние, удалять токен из localStorage и перенаправлять на страницу входа' },
          { id: 'c', text: 'Перезагружать страницу' },
          { id: 'd', text: 'Удалять пользователя из базы' },
        ],
        correct: 'b',
        explanation:
          'Если забыть про localStorage, следующее открытие страницы восстановит сессию, и «выход» окажется фиктивным.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Контекст с ролью пользователя заменяет проверку прав на сервере.',
        correct: false,
        explanation:
          'Контекст — про удобство интерфейса. Значение в localStorage легко подменить через DevTools; решение о доступе принимает только сервер по подписанному токену.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Зачем писать собственный хук `useAuth`?',
        options: [
          { id: 'a', text: 'Так требует React' },
          { id: 'b', text: 'Он скрывает useContext и может сразу проверять, что провайдер подключён' },
          { id: 'c', text: 'Он ускоряет доступ к контексту' },
          { id: 'd', text: 'Без него контекст не работает' },
        ],
        correct: 'b',
        explanation:
          'Вместо `useContext(AuthContext)` в двадцати местах — короткий `useAuth()`, который бросит понятную ошибку, если компонент оказался вне провайдера.',
      },
    ],
  },

  {
    id: 'quiz-react-protected',
    title: 'Защищённые маршруты',
    topicIds: ['react-protected-routes'],
    tech: ['react', 'security'],
    monthNo: 3,
    difficulty: 3,
    passPercent: 80,
    examRefs: ['m1-admin'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Как перенаправить неавторизованного пользователя на страницу входа?',
        options: [
          { id: 'a', text: 'window.location = "/login"' },
          { id: 'b', text: 'return <Navigate to="/login" replace />' },
          { id: 'c', text: 'throw new Error()' },
          { id: 'd', text: 'return null' },
        ],
        correct: 'b',
        explanation:
          'Атрибут `replace` заменяет запись в истории — кнопка «назад» не вернёт пользователя на защищённую страницу.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Чем защита админки отличается от защиты кабинета?',
        options: [
          { id: 'a', text: 'Ничем' },
          { id: 'b', text: 'Дополнительно проверяется роль пользователя' },
          { id: 'c', text: 'Админка не требует токена' },
          { id: 'd', text: 'Админка проверяется только на сервере' },
        ],
        correct: 'b',
        explanation:
          'Обычно обёртку делают с параметром: `<ProtectedRoute role="admin">`. И то же самое обязательно проверяется на сервере.',
      },
      {
        id: 'q3',
        type: 'boolean',
        text: 'Если клиентская защита работает, серверную можно не делать.',
        correct: false,
        explanation:
          'Запрос к /api/admin/orders можно отправить напрямую, минуя интерфейс. Клиентская защита — только удобство, настоящая проверка всегда на сервере.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Пользователь без прав администратора открыл /admin. Что показать?',
        options: [
          { id: 'a', text: 'Пустую страницу' },
          { id: 'b', text: 'Перенаправить в кабинет или показать понятное сообщение о том, что доступ закрыт' },
          { id: 'c', text: 'Форму входа администратора' },
          { id: 'd', text: 'Ошибку в консоли' },
        ],
        correct: 'b',
        explanation:
          'Молчаливая пустая страница выглядит как поломка. Понятное объяснение — часть качества интерфейса.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Какие логин и пароль администратора указаны в задании демонстрационного экзамена?',
        options: [
          { id: 'a', text: 'admin / admin' },
          { id: 'b', text: 'Admin26 / Demo20' },
          { id: 'c', text: 'root / 12345678' },
          { id: 'd', text: 'Придумываются самостоятельно' },
        ],
        correct: 'b',
        explanation:
          'Эти значения проверяют дословно. Администратор создаётся seed-скриптом, с хешем пароля, а не открытым текстом.',
      },
    ],
  },

  {
    id: 'quiz-react-toast',
    title: 'Всплывающие уведомления',
    topicIds: ['react-toast'],
    tech: ['react'],
    monthNo: 3,
    difficulty: 2,
    passPercent: 70,
    examRefs: ['m2-admin-tools'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Что требует задание от админки в части обратной связи?',
        options: [
          { id: 'a', text: 'Звуковой сигнал' },
          { id: 'b', text: 'Всплывающие уведомления' },
          { id: 'c', text: 'Отправку письма' },
          { id: 'd', text: 'Ничего' },
        ],
        correct: 'b',
        explanation:
          'Среди инструментов админки прямо названы фильтры, всплывающие уведомления, постраничная навигация и сортировка.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Как реализовать автоскрытие уведомления?',
        options: [
          { id: 'a', text: 'setTimeout внутри useEffect с очисткой clearTimeout' },
          { id: 'b', text: 'setInterval без очистки' },
          { id: 'c', text: 'CSS-анимацией' },
          { id: 'd', text: 'Обработчиком клика по документу' },
        ],
        correct: 'a',
        explanation:
          'Без clearTimeout быстрое появление нескольких уведомлений приведёт к тому, что старый таймер скроет новое сообщение.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Какой атрибут доступности стоит поставить контейнеру уведомлений?',
        options: [
          { id: 'a', text: 'role="status" и aria-live="polite"' },
          { id: 'b', text: 'role="dialog"' },
          { id: 'c', text: 'aria-hidden="true"' },
          { id: 'd', text: 'tabindex="-1"' },
        ],
        correct: 'a',
        explanation:
          'Тогда скринридер озвучит появившееся сообщение, не прерывая текущее чтение. Для критичных ошибок используют aria-live="assertive".',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Когда уведомление уместнее сообщения на странице?',
        options: [
          { id: 'a', text: 'Для ошибки конкретного поля формы' },
          { id: 'b', text: 'Для подтверждения выполненного действия: «Статус изменён»' },
          { id: 'c', text: 'Для длинного текста с инструкцией' },
          { id: 'd', text: 'Для состояния загрузки' },
        ],
        correct: 'b',
        explanation:
          'Уведомление исчезает, поэтому в него нельзя класть то, что нужно прочитать внимательно. Ошибки полей остаются рядом с полями.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Контейнер уведомлений обычно позиционируют `fixed` с высоким z-index.',
        correct: true,
        explanation:
          'Иначе уведомление окажется под модальным окном или под шапкой. На телефоне проверьте, что оно не перекрывает кнопки.',
      },
    ],
  },

  {
    id: 'quiz-react-structure',
    title: 'Структура клиента',
    topicIds: ['react-structure'],
    tech: ['react', 'ts'],
    monthNo: 3,
    difficulty: 2,
    passPercent: 70,
    examRefs: ['m3-quality'],
    questions: [
      {
        id: 'q1',
        type: 'match',
        text: 'Сопоставьте папку и её содержимое.',
        left: [
          { id: 'l1', text: 'api' },
          { id: 'l2', text: 'components' },
          { id: 'l3', text: 'pages' },
          { id: 'l4', text: 'context' },
        ],
        right: [
          { id: 'r1', text: 'Функции запросов к серверу' },
          { id: 'r2', text: 'Переиспользуемые части интерфейса' },
          { id: 'r3', text: 'Страницы, соответствующие маршрутам' },
          { id: 'r4', text: 'Провайдеры общих данных' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation:
          'Такая структура позволяет за секунду найти нужный файл — на экзамене это экономит минуты.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Почему все запросы собирают в одном месте?',
        options: [
          { id: 'a', text: 'Так короче код' },
          { id: 'b', text: 'Адрес сервера и подстановка токена задаются один раз, а не в каждом компоненте' },
          { id: 'c', text: 'Так требует React' },
          { id: 'd', text: 'Для ускорения запросов' },
        ],
        correct: 'b',
        explanation:
          'Это прямо соотносится с требованием модуля 3 о качестве кода: меньше дублирования, проще менять.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Зачем нужен общий файл types.ts?',
        options: [
          { id: 'a', text: 'Чтобы описать типы данных один раз и использовать их и в компонентах, и в запросах' },
          { id: 'b', text: 'Так требует Vite' },
          { id: 'c', text: 'Для ускорения компиляции' },
          { id: 'd', text: 'Он не нужен' },
        ],
        correct: 'a',
        explanation:
          'Один интерфейс Application на весь проект: изменили поле — компилятор покажет все места, где нужно поправить код.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Пока сервера нет, страницы можно наполнить временными данными прямо в коде.',
        correct: true,
        explanation:
          'Это позволяет отладить интерфейс заранее. Главное — заменить их на реальные запросы и не забыть удалить.',
      },
      {
        id: 'q5',
        type: 'multiple',
        text: 'Что не должно попадать в репозиторий?',
        options: [
          { id: 'a', text: 'node_modules' },
          { id: 'b', text: 'Файл .env с паролем базы' },
          { id: 'c', text: 'Папка dist со сборкой' },
          { id: 'd', text: 'package.json' },
          { id: 'e', text: 'Файл схемы базы schema.sql' },
        ],
        correct: ['a', 'b', 'c'],
        explanation:
          'package.json и schema.sql — наоборот, обязательны: без них проект не восстановить. Для .env обычно коммитят .env.example без паролей.',
      },
    ],
  },

  {
    id: 'quiz-react-admin',
    title: 'Админка: фильтр, сортировка, страницы',
    topicIds: ['react-admin-ui'],
    tech: ['react'],
    monthNo: 3,
    difficulty: 3,
    passPercent: 80,
    examRefs: ['m2-admin-tools', 'm1-admin'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Пользователь применил фильтр, находясь на 5-й странице. Что нужно сделать?',
        options: [
          { id: 'a', text: 'Ничего' },
          { id: 'b', text: 'Сбросить номер страницы на первую' },
          { id: 'c', text: 'Показать все записи' },
          { id: 'd', text: 'Отключить пагинацию' },
        ],
        correct: 'b',
        explanation:
          'Иначе после фильтрации останется две страницы, а пользователь будет на пятой — и увидит пустую таблицу. Частая недоработка.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Где хранить отфильтрованный и отсортированный список?',
        options: [
          { id: 'a', text: 'В отдельном состоянии, обновляемом через useEffect' },
          { id: 'b', text: 'Вычислять прямо при отрисовке из исходного списка и параметров' },
          { id: 'c', text: 'В localStorage' },
          { id: 'd', text: 'На сервере, запрашивая заново при каждом клике' },
        ],
        correct: 'b',
        explanation:
          'Производное состояние легко рассинхронизируется. Вычисление при отрисовке всегда актуально и требует меньше кода.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Администратор сменил статус заявки. Как обновить таблицу?',
        options: [
          { id: 'a', text: 'Перезагрузить страницу' },
          { id: 'b', text: 'Обновить одну строку в состоянии через map, сравнивая id' },
          { id: 'c', text: 'Очистить список и загрузить заново' },
          { id: 'd', text: 'Ничего не делать' },
        ],
        correct: 'b',
        explanation:
          '`orders.map(o => o.id === id ? { ...o, status } : o)`. Фильтры, сортировка и номер страницы при этом сохраняются.',
      },
      {
        id: 'q4',
        type: 'multiple',
        text: 'Какие инструменты админки названы в задании?',
        options: [
          { id: 'a', text: 'Фильтры' },
          { id: 'b', text: 'Всплывающие уведомления' },
          { id: 'c', text: 'Постраничная навигация' },
          { id: 'd', text: 'Сортировка' },
          { id: 'e', text: 'Экспорт в Excel' },
        ],
        correct: ['a', 'b', 'c', 'd'],
        explanation:
          'Экспорта в задании нет. Делать лишнее вместо обязательного — верный способ потерять баллы за незакрытые пункты.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Перед необратимым действием стоит показывать подтверждение.',
        correct: true,
        explanation:
          'Смена статуса на «Мероприятие завершено» или удаление — как раз такие случаи. Достаточно простого модального окна с двумя кнопками.',
      },
    ],
  },
];
