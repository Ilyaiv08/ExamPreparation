import type { Project } from '../types';

/**
 * Мини-проекты (раздел 23 ТЗ). По одному на месяц, сложность растёт.
 *
 * Часть проверок автоматические (autoCheck выполняется в песочнице),
 * часть — ручные пункты чек-листа. Разделение честное: платформа не
 * притворяется, что умеет оценить то, чего не запускает (раздел 45 ТЗ).
 */
export const PROJECTS: Project[] = [
  // ─────────────────────────── Месяц 1 ───────────────────────────
  {
    id: 'project-01-event-page',
    title: 'Страница мероприятия',
    goal: 'Сверстать одну страницу целиком: семантика, форма, адаптив под 390 × 844 — то, что оценивают в модуле 1 и модуле 2.',
    monthNo: 1,
    difficulty: 2,
    tech: ['html', 'css'],
    topicIds: ['html-semantic', 'html-forms', 'css-flexbox', 'css-responsive'],
    examRefs: ['m2-mobile', 'm2-design'],
    brief: `## Что делаем

Страницу бронирования помещения: шапка с меню, описание мероприятия, форма заявки, подвал.

Это первый проект, поэтому JavaScript не нужен — только разметка и стили. Зато требования к качеству те же, что на экзамене: семантика, доступность, мобильная версия.

## Структура страницы

\`\`\`text
header    Логотип + меню (Главная, Кабинет, Войти)
main
  section.hero      Заголовок h1, описание, изображение
  section.form      Форма заявки
footer    Контакты
\`\`\`

## Форма заявки

Поля с обязательными \`name\` и связанными \`label\`:

| name | тип | примечание |
|---|---|---|
| \`room\` | select | три варианта помещений |
| \`date\` | text | placeholder ДД.ММ.ГГГГ |
| \`payment\` | select | два варианта оплаты |
| \`comment\` | textarea | необязательное |

Кнопка отправки — \`<button type="submit">\`.

## Мобильная версия

Проверяйте в DevTools на 390 × 844. Меню на узком экране может стать вертикальным списком — бургер пока не нужен.`,
    requirements: [
      'Есть теги header, nav, main, footer',
      'Ровно один h1 на странице',
      'Каждое поле формы связано с label через for/id',
      'У всех полей есть атрибут name',
      'У изображения есть непустой alt',
      'На ширине 390 px нет горизонтальной прокрутки',
      'Шапка использует flexbox',
    ],
    constraints: [
      'Без JavaScript',
      'Без внешних библиотек и CDN — только свой CSS',
      'Без фиксированных ширин в пикселях у блоков-контейнеров',
      'Без тега <table> для вёрстки макета',
    ],
    checklist: [
      { id: 'c1', text: 'Семантические теги расставлены осмысленно', weight: 2, verification: 'auto' },
      { id: 'c2', text: 'Форма доступна с клавиатуры: Tab проходит по полям в логичном порядке', weight: 2, verification: 'manual' },
      { id: 'c3', text: 'На 390 × 844 нет горизонтальной прокрутки', weight: 3, verification: 'auto' },
      { id: 'c4', text: 'Отступы кратны 4 или 8 пикселям', weight: 1, verification: 'manual' },
      { id: 'c5', text: 'Состояния кнопки: обычное, наведение, фокус', weight: 2, verification: 'manual' },
    ],
    hints: [
      { level: 1, text: 'Начните с Emmet-каркаса: `header>nav>ul>li*3` — и только потом стили.', penaltyPercent: 5 },
      {
        level: 2,
        text: 'Горизонтальная прокрутка чаще всего от изображения без `max-width: 100%` или от блока с шириной в пикселях. Быстрый поиск виновника: `* { outline: 1px solid red }`.',
        penaltyPercent: 15,
      },
      {
        level: 3,
        text: 'Шапка: `header nav { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap }`. Изображение: `img { max-width: 100%; height: auto; display: block }`.',
        penaltyPercent: 30,
      },
    ],
    resources: [
      {
        title: 'HTML-элементы — справочник MDN',
        url: 'https://developer.mozilla.org/ru/docs/Web/HTML/Element',
        kind: 'reference',
        source: 'docs',
      },
      {
        title: 'Flexbox — полное руководство',
        url: 'https://developer.mozilla.org/ru/docs/Web/CSS/CSS_flexible_box_layout',
        kind: 'docs',
        source: 'docs',
      },
    ],
    autoCheck: {
      runtime: 'dom',
      maxScore: 20,
      starterCode: `<style>
  /* ваши стили */
</style>

<header>
  <!-- логотип и меню -->
</header>

<main>
  <!-- hero и форма -->
</main>

<footer>
  <!-- контакты -->
</footer>`,
      tests: [
        {
          id: 'p1-semantic',
          name: 'Семантические теги на месте',
          type: 'dom',
          code: `['header', 'nav', 'main', 'footer'].forEach((tag) => {
  ctx.assert(ctx.$(tag), 'На странице должен быть тег <' + tag + '>');
});`,
          points: 4,
        },
        {
          id: 'p1-h1',
          name: 'Ровно один h1',
          type: 'dom',
          code: `const count = ctx.$$('h1').length;
ctx.assert(count === 1, 'На странице должен быть ровно один h1', 1, count);`,
          points: 2,
        },
        {
          id: 'p1-fields',
          name: 'Все поля формы с name',
          type: 'dom',
          code: `['room', 'date', 'payment', 'comment'].forEach((name) => {
  ctx.assert(ctx.$('[name="' + name + '"]'), 'Нет поля с name="' + name + '"');
});
ctx.assert(ctx.$('button[type="submit"]'), 'Нет кнопки отправки');`,
          points: 4,
        },
        {
          id: 'p1-labels',
          name: 'Поля связаны с подписями',
          type: 'dom',
          code: `['room', 'date', 'payment', 'comment'].forEach((name) => {
  const field = ctx.$('[name="' + name + '"]');
  const id = field.getAttribute('id');
  ctx.assert(id, 'У поля ' + name + ' нет id — label не к чему привязать');
  ctx.assert(ctx.$('label[for="' + id + '"]'), 'Нет <label for="' + id + '"> для поля ' + name);
});`,
          points: 4,
        },
        {
          id: 'p1-alt',
          name: 'У изображения есть alt',
          type: 'dom',
          code: `const img = ctx.$('img');
ctx.assert(img, 'На странице должно быть изображение');
const alt = img.getAttribute('alt');
ctx.assert(alt && alt.trim().length > 0, 'Атрибут alt обязателен и не должен быть пустым');`,
          points: 2,
        },
        {
          id: 'p1-mobile',
          name: 'Нет горизонтальной прокрутки на 390 px',
          type: 'dom',
          code: `document.documentElement.style.width = '390px';
return ctx.wait(60).then(() => {
  const overflow = document.documentElement.scrollWidth - 390;
  document.documentElement.style.width = '';
  ctx.assert(overflow <= 1, 'Содержимое шире 390 px на ' + overflow + ' px', '<= 390', document.documentElement.scrollWidth);
});`,
          points: 4,
        },
      ],
    },
    estimatedHours: 3,
    planDays: ['day-04-6'],
    source: 'author',
  },

  // ─────────────────────────── Месяц 2 ───────────────────────────
  {
    id: 'project-02-validation-module',
    title: 'Модуль валидации и слайдер',
    goal: 'Написать на чистом JavaScript две вещи, которые нужны на экзамене каждому: проверку формы регистрации и логику слайдера.',
    monthNo: 2,
    difficulty: 3,
    tech: ['js'],
    topicIds: ['js-validation', 'js-regexp', 'js-timers', 'js-objects'],
    examRefs: ['m1-register', 'm2-slider'],
    brief: `## Что делаем

Два независимых модуля, которые потом переносятся в любой проект.

### 1. \`validateRegistration(values)\`

Принимает объект с полями \`login\`, \`password\`, \`fullName\`, \`phone\`, \`email\`.
Возвращает объект ошибок: ключ — имя поля, значение — текст ошибки. Если ошибок нет — пустой объект.

Правила из задания демонстрационного экзамена:

| Поле | Правило |
|---|---|
| \`login\` | только латиница и цифры, минимум 6 символов |
| \`password\` | минимум 8 символов |
| \`fullName\`, \`phone\`, \`email\` | обязательны, не пустые |

### 2. \`createSlider(length, intervalMs)\`

Возвращает объект с методами:

- \`current()\` — текущий индекс;
- \`next()\` — следующий по кругу;
- \`prev()\` — предыдущий по кругу;
- \`start(onChange)\` — запустить автопереключение;
- \`stop()\` — остановить.

Слайдер должен корректно переходить с последнего кадра на первый и обратно.`,
    requirements: [
      'validateRegistration возвращает {} при корректных данных',
      'Логин из кириллицы не проходит проверку',
      'Логин короче 6 символов не проходит',
      'Пароль короче 8 символов не проходит',
      'Пустые обязательные поля попадают в объект ошибок',
      'next() после последнего кадра возвращает 0',
      'prev() с нулевого кадра возвращает последний',
      'stop() снимает интервал',
    ],
    constraints: [
      'Без внешних библиотек',
      'Обе функции чистые в части логики: DOM внутри них не трогаем',
      'Регулярное выражение логина с якорями ^ и $',
    ],
    checklist: [
      { id: 'c1', text: 'Валидация покрывает все пять полей', weight: 3, verification: 'auto' },
      { id: 'c2', text: 'Тексты ошибок понятны пользователю, а не разработчику', weight: 2, verification: 'manual' },
      { id: 'c3', text: 'Перелистывание слайдера работает по кругу в обе стороны', weight: 3, verification: 'auto' },
      { id: 'c4', text: 'Интервал снимается в stop() — утечки нет', weight: 2, verification: 'auto' },
      { id: 'c5', text: 'Модули можно перенести в проект копированием файла', weight: 1, verification: 'manual' },
    ],
    hints: [
      {
        level: 1,
        text: 'Валидация — это набор независимых проверок, каждая добавляет ключ в объект ошибок. Не пытайтесь уложить всё в одно условие.',
        penaltyPercent: 5,
      },
      {
        level: 2,
        text: 'Логин: `/^[A-Za-z0-9]{6,}$/`. Слайдер по кругу: вперёд `(i + 1) % length`, назад `(i - 1 + length) % length`.',
        penaltyPercent: 15,
      },
      {
        level: 3,
        text: 'Каркас слайдера: замыкание с переменными `index` и `timerId`; `start` сохраняет `setInterval(...)` в `timerId`, `stop` вызывает `clearInterval(timerId)` и обнуляет переменную.',
        penaltyPercent: 30,
      },
    ],
    resources: [
      {
        title: 'Регулярные выражения — MDN',
        url: 'https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Regular_expressions',
        kind: 'docs',
        source: 'docs',
      },
      {
        title: 'setInterval — MDN',
        url: 'https://developer.mozilla.org/ru/docs/Web/API/setInterval',
        kind: 'docs',
        source: 'docs',
      },
    ],
    autoCheck: {
      runtime: 'js',
      maxScore: 24,
      starterCode: `function validateRegistration(values) {
  // верните объект ошибок: { login: 'текст', ... }
}

function createSlider(length, intervalMs) {
  // верните { current, next, prev, start, stop }
}`,
      tests: [
        {
          id: 'p2-valid',
          name: 'Корректные данные — ошибок нет',
          type: 'call',
          entry: 'validateRegistration',
          args: [
            {
              login: 'ivanov26',
              password: 'demo2026',
              fullName: 'Иванов Иван Иванович',
              phone: '+79990000000',
              email: 'ivan@example.com',
            },
          ],
          expected: {},
          points: 4,
        },
        {
          id: 'p2-cyrillic',
          name: 'Кириллица в логине не проходит',
          type: 'assert',
          code: `const errors = ctx.get('validateRegistration')({
  login: 'иванов26', password: 'demo2026', fullName: 'Иванов', phone: '+7', email: 'a@b.ru',
});
ctx.assert(Boolean(errors.login), 'Логин из кириллицы должен попасть в ошибки');`,
          points: 3,
        },
        {
          id: 'p2-short-login',
          name: 'Короткий логин не проходит',
          type: 'assert',
          code: `const errors = ctx.get('validateRegistration')({
  login: 'ivan', password: 'demo2026', fullName: 'Иванов', phone: '+7', email: 'a@b.ru',
});
ctx.assert(Boolean(errors.login), 'Логин короче 6 символов должен попасть в ошибки');`,
          points: 3,
        },
        {
          id: 'p2-short-password',
          name: 'Короткий пароль не проходит',
          type: 'assert',
          code: `const errors = ctx.get('validateRegistration')({
  login: 'ivanov26', password: 'demo', fullName: 'Иванов', phone: '+7', email: 'a@b.ru',
});
ctx.assert(Boolean(errors.password), 'Пароль короче 8 символов должен попасть в ошибки');`,
          points: 3,
        },
        {
          id: 'p2-required',
          name: 'Пустые обязательные поля',
          type: 'assert',
          code: `const errors = ctx.get('validateRegistration')({
  login: 'ivanov26', password: 'demo2026', fullName: '', phone: '   ', email: '',
});
['fullName', 'phone', 'email'].forEach((field) => {
  ctx.assert(Boolean(errors[field]), 'Пустое поле ' + field + ' должно попасть в ошибки');
});`,
          points: 4,
        },
        {
          id: 'p2-slider-loop',
          name: 'Слайдер листает по кругу',
          type: 'assert',
          code: `const slider = ctx.get('createSlider')(4, 3000);
ctx.assert(slider.current() === 0, 'Начальный кадр — нулевой', 0, slider.current());
slider.next(); slider.next(); slider.next();
ctx.assert(slider.current() === 3, 'После трёх переходов должен быть кадр 3', 3, slider.current());
slider.next();
ctx.assert(slider.current() === 0, 'После последнего кадра должен идти нулевой', 0, slider.current());
slider.prev();
ctx.assert(slider.current() === 3, 'Назад с нулевого кадра — на последний', 3, slider.current());`,
          points: 4,
        },
        {
          id: 'p2-slider-stop',
          name: 'stop() снимает интервал',
          type: 'assert',
          code: `const slider = ctx.get('createSlider')(4, 20);
let calls = 0;
slider.start(() => { calls += 1; });
return new Promise((resolve) => setTimeout(resolve, 90)).then(() => {
  const afterStart = calls;
  ctx.assert(afterStart > 0, 'После start() обработчик должен вызываться');
  slider.stop();
  return new Promise((resolve) => setTimeout(resolve, 90)).then(() => {
    ctx.assert(calls === afterStart, 'После stop() вызовов быть не должно', afterStart, calls);
  });
});`,
          points: 3,
        },
      ],
    },
    estimatedHours: 4,
    planDays: ['day-08-6'],
    source: 'author',
  },

  // ─────────────────────────── Месяц 3 ───────────────────────────
  {
    id: 'project-03-cabinet-ui',
    title: 'Личный кабинет на React',
    goal: 'Собрать страницу кабинета со всеми состояниями: загрузка, ошибка, пусто, данные — и правилом отзыва из задания.',
    monthNo: 3,
    difficulty: 4,
    tech: ['react', 'ts'],
    topicIds: ['react-lists', 'react-conditional', 'react-state', 'react-effects'],
    examRefs: ['m1-cabinet', 'm2-cabinet-ux'],
    brief: `## Что делаем

Компонент \`Cabinet\`, который показывает список заявок пользователя.

### Props

\`\`\`ts
interface Props {
  loadOrders: () => Promise<Order[]>;
}

interface Order {
  id: number;
  roomTitle: string;
  eventDate: string;   // уже в формате ДД.ММ.ГГГГ
  paymentTitle: string;
  status: 'Новая' | 'Мероприятие назначено' | 'Мероприятие завершено';
}
\`\`\`

### Поведение

1. При монтировании вызывает \`loadOrders()\`.
2. Пока ждём — показывает элемент с \`data-testid="loading"\`.
3. Если промис отклонён — показывает \`[data-testid="error"]\` с понятным текстом и кнопку \`[data-testid="retry"]\`.
4. Если массив пуст — показывает \`[data-testid="empty"]\`.
5. Иначе рисует список: каждая заявка — элемент \`[data-testid="order"]\`.

### Правило отзыва

Кнопка \`[data-testid="review"]\` показывается **только** у заявок, статус которых не «Новая». Это прямое требование модуля 2.

### Ключи

У элементов списка \`key\` — идентификатор заявки, не индекс массива.`,
    requirements: [
      'Четыре состояния: загрузка, ошибка, пусто, данные',
      'Кнопка «Повторить» повторяет запрос',
      'Кнопка отзыва скрыта у заявок со статусом «Новая»',
      'В списке видны помещение, дата и способ оплаты',
      'key задан по id заявки',
    ],
    constraints: [
      'Без внешних библиотек, кроме React',
      'Данные не хранить в модульной переменной — только в состоянии компонента',
      'Запрос при монтировании — ровно один',
    ],
    checklist: [
      { id: 'c1', text: 'Состояние загрузки показывается до получения данных', weight: 2, verification: 'auto' },
      { id: 'c2', text: 'Ошибка запроса не оставляет пустой экран', weight: 3, verification: 'auto' },
      { id: 'c3', text: 'Пустое состояние подсказывает, что делать дальше', weight: 2, verification: 'manual' },
      { id: 'c4', text: 'Правило отзыва соблюдено', weight: 3, verification: 'auto' },
      { id: 'c5', text: 'На 390 px карточки читаемы и не ломают вёрстку', weight: 2, verification: 'manual' },
    ],
    hints: [
      {
        level: 1,
        text: 'Три состояния (`loading`, `error`, `orders`) и четыре ранних `return` — этого достаточно. Вложенные тернарные операторы не нужны.',
        penaltyPercent: 5,
      },
      {
        level: 2,
        text: 'Вынесите загрузку в функцию `load()`: её вызывает и `useEffect`, и кнопка «Повторить». Не забудьте `finally` — иначе спиннер останется висеть после ошибки.',
        penaltyPercent: 15,
      },
      {
        level: 3,
        text: 'Скелет: `const [state, setState] = useState({ status: "loading", orders: [], error: null })` либо три отдельных useState. Кнопка отзыва: `{order.status !== "Новая" && <button data-testid="review">Оставить отзыв</button>}`.',
        penaltyPercent: 30,
      },
    ],
    resources: [
      {
        title: 'useEffect — документация React',
        url: 'https://ru.react.dev/reference/react/useEffect',
        kind: 'docs',
        source: 'docs',
      },
      {
        title: 'Отрисовка списков — документация React',
        url: 'https://ru.react.dev/learn/rendering-lists',
        kind: 'docs',
        source: 'docs',
      },
    ],
    autoCheck: {
      runtime: 'react',
      maxScore: 26,
      starterCode: `function Cabinet({ loadOrders }) {
  // ваш код
}`,
      tests: [
        {
          id: 'p3-loading',
          name: 'Показывается состояние загрузки',
          type: 'react',
          code: `let resolveLater;
const pending = new Promise((resolve) => { resolveLater = resolve; });
return ctx.render('Cabinet', { loadOrders: () => pending }).then(() => {
  ctx.assert(ctx.$('[data-testid="loading"]'), 'Пока данные грузятся, нужен элемент [data-testid="loading"]');
  resolveLater([]);
});`,
          points: 5,
        },
        {
          id: 'p3-empty',
          name: 'Пустой список — своё состояние',
          type: 'react',
          code: `return ctx.render('Cabinet', { loadOrders: () => Promise.resolve([]) })
  .then(() => ctx.wait(30))
  .then(() => {
    ctx.assert(ctx.$('[data-testid="empty"]'), 'Для пустого списка нужен элемент [data-testid="empty"]');
    ctx.assert(!ctx.$('[data-testid="loading"]'), 'Спиннер должен исчезнуть после загрузки');
  });`,
          points: 4,
        },
        {
          id: 'p3-error',
          name: 'Ошибка запроса обработана',
          type: 'react',
          code: `return ctx.render('Cabinet', { loadOrders: () => Promise.reject(new Error('нет связи')) })
  .then(() => ctx.wait(30))
  .then(() => {
    ctx.assert(ctx.$('[data-testid="error"]'), 'При ошибке нужен элемент [data-testid="error"]');
    ctx.assert(ctx.$('[data-testid="retry"]'), 'Нужна кнопка [data-testid="retry"]');
    ctx.assert(!ctx.$('[data-testid="loading"]'), 'Спиннер должен исчезнуть и при ошибке');
  });`,
          points: 5,
        },
        {
          id: 'p3-retry',
          name: 'Кнопка «Повторить» повторяет запрос',
          type: 'react',
          code: `let calls = 0;
const load = () => {
  calls += 1;
  return calls === 1 ? Promise.reject(new Error('нет связи')) : Promise.resolve([]);
};
return ctx.render('Cabinet', { loadOrders: load })
  .then(() => ctx.wait(30))
  .then(() => ctx.click('[data-testid="retry"]'))
  .then(() => ctx.wait(30))
  .then(() => {
    ctx.assert(calls === 2, 'После нажатия «Повторить» запрос должен уйти второй раз', 2, calls);
    ctx.assert(ctx.$('[data-testid="empty"]'), 'После успешного повтора должно показаться пустое состояние');
  });`,
          points: 4,
        },
        {
          id: 'p3-list',
          name: 'Список заявок с данными',
          type: 'react',
          code: `const orders = [
  { id: 1, roomTitle: 'Конференц-зал', eventDate: '15.03.2026', paymentTitle: 'Картой', status: 'Новая' },
  { id: 2, roomTitle: 'Переговорная', eventDate: '20.03.2026', paymentTitle: 'Наличными', status: 'Мероприятие назначено' },
];
return ctx.render('Cabinet', { loadOrders: () => Promise.resolve(orders) })
  .then(() => ctx.wait(30))
  .then(() => {
    ctx.assert(ctx.$$('[data-testid="order"]').length === 2, 'Должны отрисоваться обе заявки', 2, ctx.$$('[data-testid="order"]').length);
    const all = ctx.text();
    ['Конференц-зал', '15.03.2026', 'Наличными'].forEach((part) => {
      ctx.assert(all.includes(part), 'В списке не найдено: ' + part);
    });
  });`,
          points: 4,
        },
        {
          id: 'p3-review-rule',
          name: 'Отзыв недоступен у статуса «Новая»',
          type: 'react',
          code: `const orders = [
  { id: 1, roomTitle: 'Зал', eventDate: '15.03.2026', paymentTitle: 'Картой', status: 'Новая' },
  { id: 2, roomTitle: 'Зал', eventDate: '20.03.2026', paymentTitle: 'Картой', status: 'Мероприятие завершено' },
];
return ctx.render('Cabinet', { loadOrders: () => Promise.resolve(orders) })
  .then(() => ctx.wait(30))
  .then(() => {
    const buttons = ctx.$$('[data-testid="review"]');
    ctx.assert(buttons.length === 1, 'Кнопка отзыва должна быть ровно у одной заявки из двух', 1, buttons.length);
    const cards = ctx.$$('[data-testid="order"]');
    const first = cards[0];
    ctx.assert(!first.querySelector('[data-testid="review"]'), 'У заявки со статусом «Новая» кнопки отзыва быть не должно');
  });`,
          points: 4,
        },
      ],
    },
    estimatedHours: 5,
    planDays: ['day-12-6'],
    source: 'author',
  },

  // ─────────────────────────── Месяц 4 ───────────────────────────
  {
    id: 'project-04-db-and-queries',
    title: 'База данных и запросы админки',
    goal: 'Спроектировать схему под задание экзамена и написать запросы, которые понадобятся кабинету и панели администратора.',
    monthNo: 4,
    difficulty: 4,
    tech: ['sql'],
    topicIds: ['sql-create-table', 'db-relations', 'sql-join', 'sql-aggregate'],
    examRefs: ['m1-db', 'm1-admin', 'm3-db'],
    brief: `## Что делаем

Полную схему базы для системы бронирования — и три запроса поверх неё.

### Таблицы

| Таблица | Поля |
|---|---|
| \`users\` | \`id\`, \`login\` (уникальный), \`password_hash\`, \`full_name\`, \`phone\`, \`email\`, \`role\` (по умолчанию \`user\`) |
| \`rooms\` | \`id\`, \`title\` (уникальный) |
| \`payment_methods\` | \`id\`, \`title\` (уникальный) |
| \`statuses\` | \`id\`, \`title\` (уникальный) |
| \`applications\` | \`id\`, \`user_id\`, \`room_id\`, \`payment_method_id\`, \`status_id\`, \`event_date\` |
| \`reviews\` | \`id\`, \`application_id\` (уникальный), \`text\`, \`rating\` |

Все связи — внешними ключами. Обязательные поля — \`NOT NULL\`.

### Заполнение

Чтобы автопроверка могла сверить результат, заполните базу ровно так:

\`\`\`text
statuses          1 «Новая», 2 «Мероприятие назначено», 3 «Мероприятие завершено»
rooms             1 «Конференц-зал», 2 «Переговорная»
payment_methods   1 «Картой», 2 «Наличными»
users             1 admin26 (role = 'admin'), 2 ivanov26 (role = 'user')

applications
  1   user 2, room 1, payment 1, status 1, 2026-03-15
  2   user 2, room 2, payment 2, status 2, 2026-03-20
  3   user 2, room 1, payment 1, status 2, 2026-04-01

reviews
  1   на заявку 2, любой текст, rating 5
\`\`\`

Обратите внимание: у статуса «Мероприятие завершено» заявок нет, а у двух заявок из трёх нет отзыва. Это не случайность — именно на этих случаях ломаются неправильные \`JOIN\`.

### Представления

Создайте три представления (\`CREATE VIEW\`):

1. \`v_user_orders\` — заявки с названиями помещения, оплаты и статуса. Колонки: \`id\`, \`user_id\`, \`room\`, \`payment\`, \`status\`, \`event_date\`.
2. \`v_orders_with_reviews\` — то же самое плюс колонка \`review_text\`, которая равна \`NULL\`, если отзыва нет.
3. \`v_status_counts\` — сводка: \`status\`, \`total\`. Статусы без заявок тоже должны присутствовать со значением 0.`,
    requirements: [
      'Шесть таблиц созданы с первичными ключами',
      'Логин уникален на уровне базы',
      'Все связи оформлены внешними ключами',
      'На одну заявку приходится не более одного отзыва',
      'Справочник статусов содержит ровно три строки из задания',
      'v_orders_with_reviews показывает заявки без отзыва',
      'v_status_counts показывает статусы без заявок со значением 0',
    ],
    constraints: [
      'Скрипт должен запускаться повторно (DROP TABLE IF EXISTS в начале)',
      'Без хранимых процедур и триггеров',
      'Тексты статусов — дословно из задания',
    ],
    checklist: [
      { id: 'c1', text: 'Схема создаётся без ошибок с первого запуска', weight: 3, verification: 'auto' },
      { id: 'c2', text: 'Внешние ключи расставлены везде, где есть связь', weight: 3, verification: 'auto' },
      { id: 'c3', text: 'LEFT JOIN использован там, где данных может не быть', weight: 3, verification: 'auto' },
      { id: 'c4', text: 'ER-диаграмма построена и сохранена', weight: 2, verification: 'manual' },
      { id: 'c5', text: 'Типы полей выбраны осмысленно (DATE для даты, а не VARCHAR)', weight: 2, verification: 'manual' },
    ],
    hints: [
      {
        level: 1,
        text: 'Порядок создания: сначала справочники и users, потом applications, последней — reviews. Иначе внешний ключ сошлётся на несуществующую таблицу.',
        penaltyPercent: 5,
      },
      {
        level: 2,
        text: 'Заявки без отзыва останутся в выборке только при LEFT JOIN. Та же логика для сводки: считать нужно от таблицы статусов, а не от заявок.',
        penaltyPercent: 15,
      },
      {
        level: 3,
        text: 'Сводка: `SELECT s.title AS status, COUNT(a.id) AS total FROM statuses s LEFT JOIN applications a ON a.status_id = s.id GROUP BY s.id, s.title`. Именно `COUNT(a.id)`, а не `COUNT(*)` — иначе у пустых статусов получится 1.',
        penaltyPercent: 30,
      },
    ],
    resources: [
      {
        title: 'CREATE TABLE — документация MySQL',
        url: 'https://dev.mysql.com/doc/refman/8.0/en/create-table.html',
        kind: 'docs',
        source: 'docs',
      },
      {
        title: 'JOIN — документация MySQL',
        url: 'https://dev.mysql.com/doc/refman/8.0/en/join.html',
        kind: 'docs',
        source: 'docs',
      },
    ],
    autoCheck: {
      runtime: 'sql',
      maxScore: 28,
      starterCode: `-- Схема
DROP TABLE IF EXISTS reviews;
-- ... остальные DROP в обратном порядке зависимостей

-- CREATE TABLE ...

-- Справочник статусов

-- Представления
-- CREATE VIEW v_user_orders AS ...`,
      tests: [
        {
          id: 'p4-tables',
          name: 'Все шесть таблиц созданы',
          type: 'sql-query',
          check: `SELECT name FROM sqlite_master WHERE type = 'table' AND name IN
  ('users','rooms','payment_methods','statuses','applications','reviews')
ORDER BY name`,
          expectedColumns: ['name'],
          expectedRows: [
            ['applications'],
            ['payment_methods'],
            ['reviews'],
            ['rooms'],
            ['statuses'],
            ['users'],
          ],
          points: 4,
        },
        {
          id: 'p4-statuses',
          name: 'Справочник статусов заполнен дословно',
          type: 'sql-query',
          check: 'SELECT title FROM statuses ORDER BY id',
          expectedColumns: ['title'],
          expectedRows: [['Новая'], ['Мероприятие назначено'], ['Мероприятие завершено']],
          ordered: true,
          points: 4,
        },
        {
          id: 'p4-unique-login',
          name: 'Логин уникален на уровне базы',
          type: 'sql-query',
          check: `SELECT CASE WHEN (
    (SELECT COUNT(*) FROM sqlite_master WHERE type = 'table' AND name = 'users' AND UPPER(sql) LIKE '%UNIQUE%')
  + (SELECT COUNT(*) FROM sqlite_master WHERE type = 'index' AND tbl_name = 'users')
) > 0 THEN 1 ELSE 0 END AS has_unique`,
          expectedColumns: ['has_unique'],
          expectedRows: [[1]],
          points: 4,
        },
        {
          id: 'p4-foreign-keys',
          name: 'Заявка связана внешними ключами',
          type: 'sql-schema',
          table: 'applications',
          columns: [
            { name: 'id', pk: true },
            { name: 'user_id', notNull: true },
            { name: 'room_id', notNull: true },
            { name: 'payment_method_id', notNull: true },
            { name: 'status_id', notNull: true },
            { name: 'event_date', notNull: true },
          ],
          foreignKeys: [
            { column: 'user_id', refTable: 'users' },
            { column: 'room_id', refTable: 'rooms' },
            { column: 'payment_method_id', refTable: 'payment_methods' },
            { column: 'status_id', refTable: 'statuses' },
          ],
          points: 4,
        },
        {
          id: 'p4-view-orders',
          name: 'v_user_orders соединяет справочники',
          type: 'sql-query',
          check: 'SELECT room, payment, status FROM v_user_orders ORDER BY id LIMIT 1',
          expectedColumns: ['room', 'payment', 'status'],
          expectedRows: [['Конференц-зал', 'Картой', 'Новая']],
          points: 4,
        },
        {
          id: 'p4-view-reviews',
          name: 'Заявки без отзыва не пропадают',
          type: 'sql-query',
          check: `SELECT COUNT(*) AS total, COUNT(review_text) AS with_review FROM v_orders_with_reviews`,
          expectedColumns: ['total', 'with_review'],
          expectedRows: [[3, 1]],
          points: 4,
        },
        {
          id: 'p4-view-counts',
          name: 'Статус без заявок показывает 0',
          type: 'sql-query',
          check: `SELECT status, total FROM v_status_counts ORDER BY total DESC, status`,
          expectedColumns: ['status', 'total'],
          expectedRows: [
            ['Мероприятие назначено', 2],
            ['Новая', 1],
            ['Мероприятие завершено', 0],
          ],
          ordered: true,
          points: 4,
        },
      ],
    },
    estimatedHours: 5,
    planDays: ['day-16-6'],
    source: 'author',
  },

  // ─────────────────────────── Месяц 5 ───────────────────────────
  {
    id: 'project-05-module-one-run',
    title: 'Прогон модуля 1 целиком',
    goal: 'Собрать за 90 минут работающее приложение: база, регистрация, вход, кабинет, заявка, админка — всё, что оценивают в первом модуле.',
    monthNo: 5,
    difficulty: 5,
    tech: ['react', 'express', 'sql', 'git', 'security'],
    topicIds: ['fullstack-register', 'fullstack-auth-flow', 'fullstack-order', 'fullstack-cabinet', 'admin-panel'],
    examRefs: ['m1-db', 'm1-er', 'm1-git', 'm1-register', 'm1-login', 'm1-cabinet', 'm1-order', 'm1-admin', 'm1-oop-styles'],
    brief: `## Что делаем

Первый полноценный прогон: полтора часа по таймеру, задание — исходный вариант демонстрационного экзамена.

Это проект без автопроверки, и так честнее: платформа не запускает ваш локальный MySQL и ваш сервер. Оценка — по чек-листу, который вы проходите сами. Пункты те же, по которым оценивают на экзамене.

## Регламент

\`\`\`text
0:00–0:10   Каркас проекта, git init, .gitignore, первый коммит
0:10–0:25   schema.sql + запуск + ER-диаграмма → коммит
0:25–0:45   Сервер: подключение к БД, регистрация, вход → коммит
0:45–1:10   Клиент: регистрация, вход, меню по ролям → коммит
1:10–1:20   Заявка и кабинет → коммит
1:20–1:30   Админка, проверка по чек-листу → коммит
\`\`\`

## Как оценивать себя

Отмечайте пункт, только если он действительно работает: запись появилась в базе, вход выдал токен, статус изменился. «Почти готово» не считается — на экзамене тоже не засчитают.

## После прогона

Запишите в журнал: сколько пунктов закрыто, фактическое время, на чём застряли. Разбор занимает 40 минут и даёт больше, чем ещё один прогон.`,
    requirements: [
      'Репозиторий с .gitignore и минимум тремя коммитами',
      'Шесть таблиц со связями, скрипт запускается повторно',
      'ER-диаграмма построена и лежит в репозитории',
      'Регистрация: пять полей, правила логина и пароля, запись в базу',
      'Вход выдаёт токен, меню перестраивается по роли',
      'Ссылка «Еще не зарегистрированы? Регистрация» и обратная',
      'Кабинет показывает свои заявки',
      'Заявка: помещение, дата, способ оплаты, статус «Новая»',
      'Админка под Admin26 / Demo20, смена статуса работает',
      'В проекте есть класс и подключена библиотека стилей из node_modules',
    ],
    constraints: [
      'Полтора часа по таймеру, без пауз',
      'Без интернета: никаких CDN и поиска по сети',
      'Без готовых шаблонов проекта — только пустой Vite и пустой Express',
      'Оформлением не заниматься: это работа модуля 2',
    ],
    checklist: [
      { id: 'c1', text: 'Проект запускается: клиент и сервер поднимаются без ошибок', weight: 3, verification: 'manual' },
      { id: 'c2', text: 'Таблицы созданы, связи на месте, ER-диаграмма сохранена', weight: 3, verification: 'manual' },
      { id: 'c3', text: 'Регистрация реально пишет пользователя в базу, пароль — хешем', weight: 4, verification: 'manual' },
      { id: 'c4', text: 'Вход работает, неверные данные дают понятное сообщение', weight: 3, verification: 'manual' },
      { id: 'c5', text: 'Заявка создаётся и появляется в кабинете со статусом «Новая»', weight: 4, verification: 'manual' },
      { id: 'c6', text: 'Админка защищена, статус меняется на оба требуемых значения', weight: 4, verification: 'manual' },
      { id: 'c7', text: 'В истории не менее трёх осмысленных коммитов', weight: 2, verification: 'manual' },
      { id: 'c8', text: 'Уложились в 90 минут', weight: 2, verification: 'manual' },
    ],
    hints: [
      {
        level: 1,
        text: 'Не начинайте с дизайна. Голая форма, которая пишет в базу, стоит дороже красивой, которая не пишет.',
        penaltyPercent: 5,
      },
      {
        level: 2,
        text: 'Застряли на пять минут — переходите к следующему пункту. Незакрытая админка при работающих регистрации, входе и кабинете даёт больше баллов, чем идеальная регистрация без всего остального.',
        penaltyPercent: 10,
      },
      {
        level: 3,
        text: 'Порядок, который почти всегда укладывается в срок: схема → сервер (БД, регистрация, вход) → клиент (регистрация, вход, меню) → заявка → кабинет → админка. Коммит после каждой стрелки.',
        penaltyPercent: 20,
      },
    ],
    resources: [
      {
        title: 'mysql2 — работа с промисами и параметрами',
        url: 'https://sidorares.github.io/node-mysql2/docs',
        kind: 'docs',
        source: 'docs',
      },
      {
        title: 'Express — маршрутизация',
        url: 'https://expressjs.com/ru/guide/routing.html',
        kind: 'docs',
        source: 'docs',
      },
    ],
    estimatedHours: 2,
    planDays: ['day-20-6'],
    source: 'author',
  },

  // ─────────────────────────── Месяц 6 ───────────────────────────
  {
    id: 'project-06-hardening',
    title: 'Аудит: безопасность и качество',
    goal: 'Пройти по готовому проекту пятью проверками модуля 3 и закрыть найденные дыры — на своём коде и на подготовленных примерах.',
    monthNo: 6,
    difficulty: 5,
    tech: ['security', 'ts', 'express'],
    topicIds: ['security-basics', 'code-quality', 'server-validation', 'auth-roles'],
    examRefs: ['m3-quality', 'm3-db'],
    brief: `## Что делаем

Две части.

### Часть 1 — автопроверяемая

Напишите три функции, из которых складывается защита сервера.

\`\`\`js
buildOrdersQuery(filters)
\`\`\`
Собирает запрос и массив параметров. Возвращает \`{ sql, params }\`. Фильтры: \`statusId\`, \`userId\`, \`sortBy\`, \`page\`.
Ни одно значение не должно попадать в текст запроса — только в \`params\`. Исключение — \`sortBy\`: имя столбца параметром не передать, поэтому его проверяют по белому списку \`['id', 'event_date', 'status_id']\`, а при недопустимом значении берут \`id\`.

\`\`\`js
publicUser(row)
\`\`\`
Возвращает объект пользователя без \`password_hash\` и без \`password\`.

\`\`\`js
canAccessOrder(user, order)
\`\`\`
Возвращает \`true\`, если пользователь — администратор либо заявка принадлежит ему.

### Часть 2 — ручная

Пройдите по своему проекту из прошлого месяца пятью проверками:

1. \`grep\` по серверу: не осталось ли склейки строк в запросах;
2. в базе только \`password_hash\`, клиенту он не уходит;
3. токен и роль проверяются на сервере, а не только в интерфейсе;
4. везде, где есть \`:id\`, проверяется принадлежность записи;
5. пользовательский текст не превращается в разметку.`,
    requirements: [
      'buildOrdersQuery не подставляет значения в текст запроса',
      'Недопустимое значение sortBy заменяется на id',
      'publicUser не пропускает password_hash',
      'canAccessOrder разрешает администратору всё, пользователю — только своё',
      'Все пять ручных проверок пройдены по своему проекту',
    ],
    constraints: [
      'Без внешних библиотек',
      'Без any в решении',
      'Белый список — явный массив, а не проверка регулярным выражением',
    ],
    checklist: [
      { id: 'c1', text: 'Все запросы параметризованы', weight: 4, verification: 'auto' },
      { id: 'c2', text: 'Имя столбца сортировки проверяется белым списком', weight: 3, verification: 'auto' },
      { id: 'c3', text: 'Хеш пароля не уходит клиенту', weight: 3, verification: 'auto' },
      { id: 'c4', text: 'Проверка принадлежности записи реализована', weight: 3, verification: 'auto' },
      { id: 'c5', text: 'Пять проверок пройдены по собственному проекту', weight: 4, verification: 'manual' },
      { id: 'c6', text: 'Найденные дыры закрыты и закоммичены', weight: 3, verification: 'manual' },
    ],
    hints: [
      {
        level: 1,
        text: 'Собирайте условия в массив строк, а значения — в параллельный массив параметров. Потом соедините условия через " AND ".',
        penaltyPercent: 5,
      },
      {
        level: 2,
        text: 'Для publicUser удобна деструктуризация с rest: `const { password_hash, password, ...rest } = row; return rest;` — так новое чувствительное поле придётся исключать осознанно.',
        penaltyPercent: 15,
      },
      {
        level: 3,
        text: 'Скелет: `const where = []; const params = []; if (filters.statusId) { where.push("status_id = ?"); params.push(filters.statusId); }` и в конце `const sql = "SELECT * FROM applications" + (where.length ? " WHERE " + where.join(" AND ") : "") + " ORDER BY " + sortColumn;`.',
        penaltyPercent: 30,
      },
    ],
    resources: [
      {
        title: 'SQL-инъекции — OWASP',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html',
        kind: 'reference',
        source: 'docs',
      },
      {
        title: 'XSS — OWASP',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html',
        kind: 'reference',
        source: 'docs',
      },
    ],
    autoCheck: {
      runtime: 'js',
      maxScore: 24,
      starterCode: `const SORT_COLUMNS = ['id', 'event_date', 'status_id'];

function buildOrdersQuery(filters) {
  // верните { sql, params }
}

function publicUser(row) {
  // верните пользователя без хеша пароля
}

function canAccessOrder(user, order) {
  // true, если админ или заявка принадлежит пользователю
}`,
      tests: [
        {
          id: 'p6-params',
          name: 'Значения уходят в параметры, а не в текст запроса',
          type: 'assert',
          code: `const { sql, params } = ctx.get('buildOrdersQuery')({ statusId: 2, userId: 7 });
ctx.assert(!sql.includes('2') || !sql.includes('7'), 'Значения фильтров не должны попадать в текст запроса');
ctx.assert(params.includes(2) && params.includes(7), 'Значения фильтров должны быть в массиве params');
ctx.assert((sql.match(/\\?/g) || []).length >= 2, 'В запросе должны быть знаки вопроса для параметров');`,
          points: 5,
        },
        {
          id: 'p6-injection',
          name: 'Попытка инъекции не ломает запрос',
          type: 'assert',
          code: `const evil = "1 OR 1=1; DROP TABLE users";
const { sql, params } = ctx.get('buildOrdersQuery')({ statusId: evil });
ctx.assert(!sql.includes('DROP'), 'Строка из фильтра попала в текст запроса — это инъекция');
ctx.assert(params.includes(evil), 'Значение должно уйти параметром');`,
          points: 5,
        },
        {
          id: 'p6-whitelist',
          name: 'Недопустимая сортировка заменяется на id',
          type: 'assert',
          code: `const bad = ctx.get('buildOrdersQuery')({ sortBy: 'id; DROP TABLE users' });
ctx.assert(!bad.sql.includes('DROP'), 'Имя столбца должно проверяться белым списком');
ctx.assert(bad.sql.includes('ORDER BY id'), 'При недопустимом значении сортируем по id');
const good = ctx.get('buildOrdersQuery')({ sortBy: 'event_date' });
ctx.assert(good.sql.includes('ORDER BY event_date'), 'Допустимое значение должно применяться');`,
          points: 4,
        },
        {
          id: 'p6-public-user',
          name: 'Хеш пароля не уходит клиенту',
          type: 'assert',
          code: `const row = { id: 1, login: 'ivanov26', password_hash: '$2b$10$abc', password: 'demo2026', full_name: 'Иванов' };
const result = ctx.get('publicUser')(row);
ctx.assert(!('password_hash' in result), 'В ответе не должно быть password_hash');
ctx.assert(!('password' in result), 'В ответе не должно быть password');
ctx.assert(result.login === 'ivanov26', 'Логин должен остаться');
ctx.assert(result.id === 1, 'Идентификатор должен остаться');`,
          points: 5,
        },
        {
          id: 'p6-access',
          name: 'Проверка принадлежности записи',
          type: 'assert',
          code: `const can = ctx.get('canAccessOrder');
ctx.assert(can({ id: 7, role: 'user' }, { id: 1, user_id: 7 }) === true, 'Своя заявка должна быть доступна');
ctx.assert(can({ id: 8, role: 'user' }, { id: 1, user_id: 7 }) === false, 'Чужая заявка не должна быть доступна');
ctx.assert(can({ id: 9, role: 'admin' }, { id: 1, user_id: 7 }) === true, 'Администратору доступны все заявки');`,
          points: 5,
        },
      ],
    },
    estimatedHours: 4,
    planDays: ['day-21-6'],
    source: 'author',
  },

  // ─────────────────────────── Месяц 7 ───────────────────────────
  {
    id: 'project-07-full-exam',
    title: 'Полный прогон экзамена',
    goal: 'Четыре часа по регламенту демонстрационного экзамена: три модуля, таймер, чек-лист, разбор.',
    monthNo: 7,
    difficulty: 5,
    tech: ['react', 'express', 'sql', 'css', 'git', 'security', 'design'],
    topicIds: ['exam-strategy', 'exam-checklist', 'exam-debrief', 'exam-first-minutes'],
    examRefs: [
      'm1-db',
      'm1-register',
      'm1-login',
      'm1-cabinet',
      'm1-order',
      'm1-admin',
      'm2-slider',
      'm2-mobile',
      'm2-admin-tools',
      'm3-quality',
      'm3-animations',
    ],
    brief: `## Что делаем

Полный прогон на четыре часа. Это репетиция, а не тренировка отдельного навыка: условия максимально близкие к экзаменационным.

## Условия

- четыре часа подряд, перерывы только между модулями;
- интернет отключён;
- задание берётся новое — то, которого вы раньше не решали;
- ничего не подсматриваем: ни своих старых проектов, ни конспектов.

## Регламент

\`\`\`text
Модуль 1   1:30   БД, ER, регистрация, вход, кабинет, заявка, админка
перерыв
Модуль 2   1:30   Дизайн, слайдер, адаптив 390×844, подсказки, инструменты админки
перерыв
Модуль 3   1:00   Доработка БД, качество кода, анимации, мобильная версия
\`\`\`

## Оценка

Пройдите по режиму «ДЕМОЭКЗАМЕН» на платформе: там собраны все требования с дословными формулировками задания. Отмечайте только то, что действительно работает.

## Разбор

Обязателен и занимает около часа:

1. чек-лист — сколько пунктов из скольких;
2. время — фактическое по каждому модулю;
3. список затруднений с разбивкой по причинам;
4. три-четыре конкретных пункта плана на неделю.

## Когда вы готовы

Два прогона подряд, в которых модуль 1 укладывается в 75 минут и чек-лист закрыт полностью. Это и есть готовность.`,
    requirements: [
      'Пройдены все три модуля по таймеру',
      'В каждом модуле не менее трёх коммитов',
      'Чек-лист пройден в конце каждого модуля',
      'Результат зафиксирован в журнале прогонов',
      'Проведён разбор с планом на неделю',
    ],
    constraints: [
      'Четыре часа, без пауз внутри модуля',
      'Без интернета и без своих старых наработок',
      'Задание — новое, ранее не решавшееся',
      'Время модуля не переносится на следующий',
    ],
    checklist: [
      { id: 'c1', text: 'Модуль 1 закрыт полностью и уложился в 90 минут', weight: 5, verification: 'manual' },
      { id: 'c2', text: 'Слайдер: 4 изображения, 3 секунды, кнопки по кругу', weight: 3, verification: 'manual' },
      { id: 'c3', text: 'Все страницы работают на 390 × 844 без горизонтальной прокрутки', weight: 3, verification: 'manual' },
      { id: 'c4', text: 'Инструменты админки: фильтр, сортировка, страницы, уведомления', weight: 3, verification: 'manual' },
      { id: 'c5', text: 'Модуль 3: внешние ключи, параметризованные запросы, нет any', weight: 3, verification: 'manual' },
      { id: 'c6', text: 'Микроанимации добавлены, prefers-reduced-motion учтён', weight: 2, verification: 'manual' },
      { id: 'c7', text: 'История коммитов проверена перед сдачей', weight: 2, verification: 'manual' },
      { id: 'c8', text: 'Разбор проведён, план на неделю записан', weight: 4, verification: 'manual' },
    ],
    hints: [
      {
        level: 1,
        text: 'Первые десять минут — чтение и выписывание дословных значений. Это не потеря времени: половина требований прячется в середине текста.',
        penaltyPercent: 5,
      },
      {
        level: 2,
        text: 'За десять минут до конца каждого модуля остановитесь: проверьте запуск, сделайте коммит, пройдите чек-лист. Найденное в конце экзамена исправить уже нечем.',
        penaltyPercent: 10,
      },
      {
        level: 3,
        text: 'Если прогон не удался — берите ту же тему ещё раз, а не новую. Повтор покажет, действительно ли вы устранили затруднение.',
        penaltyPercent: 20,
      },
    ],
    resources: [
      {
        title: 'Режим «ДЕМОЭКЗАМЕН» платформы',
        url: '/exam',
        kind: 'practice',
        source: 'plan',
        note: 'Все требования с дословными формулировками задания и раздельным подсчётом автопроверки и ручных пунктов.',
      },
    ],
    estimatedHours: 5,
    planDays: ['day-26-1'],
    source: 'plan',
  },
];
