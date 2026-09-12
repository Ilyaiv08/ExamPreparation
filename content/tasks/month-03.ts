import type { Task } from '../types';

/** Месяц 3, недели 9–10: компоненты, списки, состояние, формы. */
export const MONTH_03_TASKS: Task[] = [
  {
    id: 'task-react-first-component',
    title: 'Первый компонент: шапка приложения',
    kind: 'function',
    runtime: 'react',
    difficulty: 1,
    tech: ['react', 'ts'],
    topicIds: ['react-basics', 'react-tsx'],
    monthNo: 3,
    weekNo: 9,
    statement: `Напишите компонент \`Header\`, который возвращает шапку приложения.

Внутри:

- тег \`<header>\`;
- заголовок \`<h1>\` с текстом «Конференции.РФ»;
- \`<nav>\` со списком \`<ul>\` из трёх ссылок: «Заявка» (\`/order\`), «Кабинет» (\`/cabinet\`), «Выход» (\`/logout\`).

Помните про правила TSX: \`className\` вместо \`class\`, один корневой элемент.`,
    requirements: [
      'Компонент называется Header и объявлен на верхнем уровне',
      'Внутри есть header, h1 и nav',
      'Три ссылки с правильными адресами и текстами',
      'Используется className, а не class',
    ],
    starterCode: `function Header() {
  return (
    // ваш код
  );
}`,
    tests: [
      {
        id: 't1',
        name: 'Компонент отрисовывается',
        type: 'react',
        code: `return ctx.render('Header').then(() => {
  ctx.assert(ctx.$('header'), 'В разметке должен быть тег <header>');
});`,
        points: 2,
      },
      {
        id: 't2',
        name: 'Заголовок с нужным текстом',
        type: 'react',
        code: `return ctx.render('Header').then(() => {
  const title = ctx.$('h1');
  ctx.assert(title, 'Нет заголовка h1');
  ctx.assert(title.textContent.trim() === 'Конференции.РФ', 'Текст h1 должен быть «Конференции.РФ»', 'Конференции.РФ', title.textContent.trim());
});`,
        points: 2,
      },
      {
        id: 't3',
        name: 'Навигация со списком',
        type: 'react',
        code: `return ctx.render('Header').then(() => {
  ctx.assert(ctx.$('nav'), 'Нет тега <nav>');
  const items = ctx.$$('nav ul li');
  ctx.assert(items.length === 3, 'В списке должно быть три пункта, найдено ' + items.length, 3, items.length);
});`,
        points: 3,
      },
      {
        id: 't4',
        name: 'Ссылки с нужными адресами',
        type: 'react',
        code: `return ctx.render('Header').then(() => {
  const links = ctx.$$('nav a');
  const expected = [
    { href: '/order', text: 'Заявка' },
    { href: '/cabinet', text: 'Кабинет' },
    { href: '/logout', text: 'Выход' },
  ];
  expected.forEach((item) => {
    const found = links.find((a) => a.getAttribute('href') === item.href);
    ctx.assert(found, 'Нет ссылки с адресом ' + item.href);
    ctx.assert(found.textContent.trim() === item.text, 'Текст ссылки ' + item.href + ' должен быть «' + item.text + '»');
  });
});`,
        points: 3,
      },
      {
        id: 't5',
        name: 'Используется className',
        type: 'react',
        code: `ctx.assert(!/\\sclass=/.test(ctx.source), 'В TSX пишут className, а не class');`,
        points: 2,
      },
    ],
    hints: [
      { level: 1, text: 'Компонент возвращает разметку в круглых скобках после return.', penaltyPercent: 10 },
      { level: 2, text: 'Ссылка в обычном TSX — это тег <a href="…">. React Router появится на неделе 11.', penaltyPercent: 20 },
      {
        level: 3,
        text: '<header><h1>Конференции.РФ</h1><nav><ul><li><a href="/order">Заявка</a></li>…</ul></nav></header>',
        penaltyPercent: 35,
      },
    ],
    solution: `function Header() {
  return (
    <header className="navbar bg-body-tertiary">
      <h1 className="h5 mb-0">Конференции.РФ</h1>
      <nav>
        <ul className="nav">
          <li className="nav-item"><a className="nav-link" href="/order">Заявка</a></li>
          <li className="nav-item"><a className="nav-link" href="/cabinet">Кабинет</a></li>
          <li className="nav-item"><a className="nav-link" href="/logout">Выход</a></li>
        </ul>
      </nav>
    </header>
  );
}`,
    solutionExplanation:
      'Компонент — обычная функция, возвращающая разметку. Имя с заглавной буквы обязательно: по нему React отличает компонент от HTML-тега.',
    maxScore: 12,
    estimatedMinutes: 15,
    examRefs: ['m3-framework'],
    planDays: ['day-09-2'],
    source: 'plan',
  },

  {
    id: 'task-react-tsx-fix',
    title: 'Исправить ошибки TSX',
    kind: 'fix-bug',
    runtime: 'react',
    difficulty: 2,
    tech: ['react'],
    topicIds: ['react-tsx'],
    monthNo: 3,
    weekNo: 9,
    statement: `В компоненте \`OrderSummary\` пять типичных ошибок TSX. Найдите и исправьте их, не меняя смысла разметки.

Что должно получиться: блок с заголовком «Ваша заявка», подписью-меткой для поля, абзацем с датой и бейджем статуса. Если заявок ноль — вместо списка показывается текст «Заявок нет» (и **не** цифра 0).`,
    requirements: [
      'Компонент отрисовывается без ошибок',
      'Используется className и htmlFor',
      'Все теги закрыты',
      'style задан объектом',
      'При count = 0 на экране нет цифры 0',
    ],
    starterCode: `function OrderSummary({ date, status, count }) {
  return (
    <div class="card">
      <h2>Ваша заявка</h2>
      <label for="date">Дата начала</label>
      <input id="date" type="text" value={date} readOnly>
      <p style="color: gray">Статус: {status}</p>
      {count && <p>Всего заявок: {count}</p>}
      <br>
    </div>
  );
}`,
    tests: [
      {
        id: 't1',
        name: 'Компонент отрисовывается',
        type: 'react',
        code: `return ctx.render('OrderSummary', { date: '14.09.2026', status: 'Новая', count: 3 }).then(() => {
  ctx.assert(ctx.$('.card') || ctx.$('div'), 'Компонент ничего не отрисовал');
});`,
        points: 3,
      },
      {
        id: 't2',
        name: 'className вместо class',
        type: 'react',
        code: `ctx.assert(!/\\sclass=/.test(ctx.source), 'Замените class на className');
return ctx.render('OrderSummary', { date: '14.09.2026', status: 'Новая', count: 3 }).then(() => {
  ctx.assert(ctx.$('.card'), 'Класс card должен примениться — значит, нужен className');
});`,
        points: 3,
      },
      {
        id: 't3',
        name: 'htmlFor вместо for',
        type: 'react',
        code: `return ctx.render('OrderSummary', { date: '14.09.2026', status: 'Новая', count: 3 }).then(() => {
  const label = ctx.$('label');
  ctx.assert(label, 'Нет подписи label');
  ctx.assert(label.getAttribute('for') === 'date', 'Подпись должна быть связана с полем: в TSX это атрибут htmlFor');
});`,
        points: 3,
      },
      {
        id: 't4',
        name: 'style задан объектом',
        type: 'react',
        code: `return ctx.render('OrderSummary', { date: '14.09.2026', status: 'Новая', count: 3 }).then(() => {
  const paragraph = ctx.$$('p').find((p) => p.textContent.includes('Статус'));
  ctx.assert(paragraph, 'Нет абзаца со статусом');
  ctx.assert(paragraph.style.color, 'Стиль не применился: в TSX style задают объектом style={{ color: "gray" }}');
});`,
        points: 3,
      },
      {
        id: 't5',
        name: 'При нуле не выводится «0»',
        type: 'react',
        code: `return ctx.render('OrderSummary', { date: '14.09.2026', status: 'Новая', count: 0 }).then(() => {
  const text = ctx.text();
  ctx.assert(!/\\b0\\b/.test(text), 'При count = 0 на экране не должно быть цифры 0: используйте count > 0 && …');
});`,
        points: 4,
      },
      {
        id: 't6',
        name: 'Данные из props показаны',
        type: 'react',
        code: `return ctx.render('OrderSummary', { date: '21.09.2026', status: 'Мероприятие назначено', count: 2 }).then(() => {
  const text = ctx.text();
  ctx.assert(text.includes('Мероприятие назначено'), 'Статус должен выводиться на экран');
  const input = ctx.$('input');
  ctx.assert(input && input.value === '21.09.2026', 'Значение даты должно попадать в поле');
});`,
        points: 3,
      },
    ],
    hints: [
      { level: 1, text: 'Пять ошибок: class, for, незакрытый input, style строкой, незакрытый br. И ещё ловушка с нулём.', penaltyPercent: 10 },
      { level: 2, text: 'В TSX все теги закрываются: <input … />, <br />.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'style={{ color: "gray" }} — двойные скобки: внешние означают выражение, внутренние — объект. Условие: {count > 0 && <p>…</p>}',
        penaltyPercent: 35,
      },
    ],
    solution: `function OrderSummary({ date, status, count }) {
  return (
    <div className="card">
      <h2>Ваша заявка</h2>
      <label htmlFor="date">Дата начала</label>
      <input id="date" type="text" value={date} readOnly />
      <p style={{ color: 'gray' }}>Статус: {status}</p>
      {count > 0 && <p>Всего заявок: {count}</p>}
      <br />
    </div>
  );
}`,
    solutionExplanation:
      'Ловушка с нулём — самая коварная из пяти: код выглядит рабочим, но при пустом списке на экране появляется одинокая цифра 0. Всегда сравнивайте явно: count > 0.',
    maxScore: 19,
    estimatedMinutes: 20,
    examRefs: [],
    planDays: ['day-09-2'],
    source: 'plan',
  },

  {
    id: 'task-react-props',
    title: 'Компонент карточки заявки с props',
    kind: 'function',
    runtime: 'react',
    difficulty: 2,
    tech: ['react', 'ts'],
    topicIds: ['react-props'],
    monthNo: 3,
    weekNo: 9,
    statement: `Напишите компонент \`ApplicationCard\`, который принимает объект заявки и выводит карточку.

Props: \`application\` с полями \`room\`, \`date\`, \`payment\`, \`status\`.

Разметка:

- корневой \`<article>\` с классом \`card\`;
- \`<h3>\` — название помещения;
- \`<p>\` — дата и способ оплаты через « · »;
- \`<span>\` с классом \`badge\` — статус, а также класс цвета: \`bg-secondary\` для «Новая», \`bg-primary\` для «Мероприятие назначено», \`bg-success\` для «Мероприятие завершено».`,
    requirements: [
      'Компонент принимает props и выводит данные',
      'Корневой элемент — article.card',
      'Есть h3, p и span.badge',
      'Класс цвета зависит от статуса',
    ],
    starterCode: `function ApplicationCard({ application }) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Карточка отрисована',
        type: 'react',
        code: `return ctx.render('ApplicationCard', { application: { room: 'Коворкинг', date: '14.09.2026', payment: 'Наличные', status: 'Новая' } }).then(() => {
  ctx.assert(ctx.$('article.card'), 'Корневой элемент должен быть <article className="card">');
});`,
        points: 3,
      },
      {
        id: 't2',
        name: 'Название помещения в заголовке',
        type: 'react',
        code: `return ctx.render('ApplicationCard', { application: { room: 'Кинозал', date: '14.09.2026', payment: 'Наличные', status: 'Новая' } }).then(() => {
  const title = ctx.$('h3');
  ctx.assert(title, 'Нет заголовка h3');
  ctx.assert(title.textContent.trim() === 'Кинозал', 'В h3 должно быть название помещения', 'Кинозал', title.textContent.trim());
});`,
        points: 3,
      },
      {
        id: 't3',
        name: 'Дата и оплата через разделитель',
        type: 'react',
        code: `return ctx.render('ApplicationCard', { application: { room: 'Аудитория', date: '21.09.2026', payment: 'Банковская карта', status: 'Новая' } }).then(() => {
  const paragraph = ctx.$('p');
  ctx.assert(paragraph, 'Нет абзаца с данными заявки');
  const text = paragraph.textContent;
  ctx.assert(text.includes('21.09.2026'), 'В абзаце должна быть дата');
  ctx.assert(text.includes('Банковская карта'), 'В абзаце должен быть способ оплаты');
  ctx.assert(text.includes('·'), 'Разделителем должен быть символ ·');
});`,
        points: 3,
      },
      {
        id: 't4',
        name: 'Цвет бейджа: Новая',
        type: 'react',
        code: `return ctx.render('ApplicationCard', { application: { room: 'А', date: '14.09.2026', payment: 'Наличные', status: 'Новая' } }).then(() => {
  const badge = ctx.$('.badge');
  ctx.assert(badge, 'Нет элемента с классом badge');
  ctx.assert(badge.classList.contains('bg-secondary'), 'Для статуса «Новая» нужен класс bg-secondary, получено: ' + badge.className);
  ctx.assert(badge.textContent.trim() === 'Новая', 'В бейдже должен быть текст статуса');
});`,
        points: 3,
      },
      {
        id: 't5',
        name: 'Цвет бейджа: Мероприятие назначено',
        type: 'react',
        code: `return ctx.render('ApplicationCard', { application: { room: 'А', date: '14.09.2026', payment: 'Наличные', status: 'Мероприятие назначено' } }).then(() => {
  ctx.assert(ctx.$('.badge').classList.contains('bg-primary'), 'Для статуса «Мероприятие назначено» нужен класс bg-primary');
});`,
        points: 2,
      },
      {
        id: 't6',
        name: 'Цвет бейджа: Мероприятие завершено',
        type: 'react',
        code: `return ctx.render('ApplicationCard', { application: { room: 'А', date: '14.09.2026', payment: 'Наличные', status: 'Мероприятие завершено' } }).then(() => {
  ctx.assert(ctx.$('.badge').classList.contains('bg-success'), 'Для статуса «Мероприятие завершено» нужен класс bg-success');
});`,
        points: 2,
      },
    ],
    hints: [
      { level: 1, text: 'Разберите props прямо в параметре: function ApplicationCard({ application }).', penaltyPercent: 10 },
      { level: 2, text: 'Цвет удобно взять из объекта-словаря: COLORS[application.status].', penaltyPercent: 20 },
      {
        level: 3,
        text: 'className={`badge bg-${COLORS[application.status]}`} — шаблонная строка внутри фигурных скобок.',
        penaltyPercent: 35,
      },
    ],
    solution: `const COLORS = {
  'Новая': 'secondary',
  'Мероприятие назначено': 'primary',
  'Мероприятие завершено': 'success',
};

function ApplicationCard({ application }) {
  const color = COLORS[application.status] ?? 'light';

  return (
    <article className="card mb-3">
      <div className="card-body">
        <h3 className="h6">{application.room}</h3>
        <p className="text-muted small">{application.date} · {application.payment}</p>
        <span className={\`badge bg-\${color}\`}>{application.status}</span>
      </div>
    </article>
  );
}`,
    solutionExplanation:
      'Передача объекта целиком вместо четырёх отдельных props делает компонент устойчивым: добавили поле в заявку — менять сигнатуру не нужно.',
    maxScore: 16,
    estimatedMinutes: 20,
    examRefs: ['m1-cabinet'],
    planDays: ['day-09-3'],
    source: 'plan',
  },

  {
    id: 'task-react-list',
    title: 'Список заявок с key и пустым состоянием',
    kind: 'output',
    runtime: 'react',
    difficulty: 2,
    tech: ['react'],
    topicIds: ['react-lists', 'react-conditional'],
    monthNo: 3,
    weekNo: 9,
    statement: `Компонент \`ApplicationList\` принимает \`applications\` — массив заявок — и выводит список.

Требования:

- каждая заявка — \`<li>\` с текстом вида \`Коворкинг — 14.09.2026 — Новая\`;
- список в теге \`<ul>\`;
- у каждого элемента задан \`key\` (используйте поле \`id\`);
- если массив пуст, вместо списка выводится \`<p>\` с текстом «У вас пока нет заявок».`,
    requirements: [
      'Список отрисовывается из массива',
      'У элементов задан key по id',
      'Пустой массив даёт абзац с сообщением',
      'При пустом массиве тега ul нет',
    ],
    starterCode: `function ApplicationList({ applications }) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Три заявки — три пункта',
        type: 'react',
        code: `const items = [
  { id: 1, room: 'Коворкинг', date: '14.09.2026', status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '21.09.2026', status: 'Мероприятие завершено' },
  { id: 3, room: 'Аудитория', date: '28.09.2026', status: 'Новая' },
];
return ctx.render('ApplicationList', { applications: items }).then(() => {
  const list = ctx.$$('li');
  ctx.assert(list.length === 3, 'Ожидалось три пункта списка, найдено ' + list.length, 3, list.length);
});`,
        points: 3,
      },
      {
        id: 't2',
        name: 'Текст пункта содержит все поля',
        type: 'react',
        code: `return ctx.render('ApplicationList', { applications: [{ id: 1, room: 'Коворкинг', date: '14.09.2026', status: 'Новая' }] }).then(() => {
  const text = ctx.$('li').textContent;
  ctx.assert(text.includes('Коворкинг'), 'В пункте должно быть помещение');
  ctx.assert(text.includes('14.09.2026'), 'В пункте должна быть дата');
  ctx.assert(text.includes('Новая'), 'В пункте должен быть статус');
});`,
        points: 3,
      },
      {
        id: 't3',
        name: 'Список обёрнут в ul',
        type: 'react',
        code: `return ctx.render('ApplicationList', { applications: [{ id: 1, room: 'А', date: '01.01.2027', status: 'Новая' }] }).then(() => {
  ctx.assert(ctx.$('ul'), 'Пункты должны находиться внутри тега <ul>');
});`,
        points: 2,
      },
      {
        id: 't4',
        name: 'Пустой массив: сообщение вместо списка',
        type: 'react',
        code: `return ctx.render('ApplicationList', { applications: [] }).then(() => {
  const text = ctx.text();
  ctx.assert(text.includes('У вас пока нет заявок'), 'При пустом массиве нужен текст «У вас пока нет заявок»');
  ctx.assert(!ctx.$('ul'), 'При пустом массиве список ul выводить не нужно');
});`,
        points: 4,
      },
      {
        id: 't5',
        name: 'Используется key по id',
        type: 'react',
        code: `ctx.assert(/key\\s*=\\s*\\{/.test(ctx.source), 'У элементов списка должен быть атрибут key');
ctx.assert(!/key\\s*=\\s*\\{\\s*index\\s*\\}/.test(ctx.source), 'Индекс — плохой key: при сортировке и удалении состояние перепутается. Используйте id');`,
        points: 4,
      },
    ],
    hints: [
      { level: 1, text: 'Проверку на пустоту удобно сделать ранним возвратом: if (!applications.length) return <p>…</p>;', penaltyPercent: 10 },
      { level: 2, text: 'Список строится через map, а key ставится на самый внешний элемент внутри map.', penaltyPercent: 20 },
      {
        level: 3,
        text: '{applications.map((a) => <li key={a.id}>{a.room} — {a.date} — {a.status}</li>)}',
        penaltyPercent: 35,
      },
    ],
    solution: `function ApplicationList({ applications }) {
  if (!applications.length) {
    return <p className="text-muted">У вас пока нет заявок</p>;
  }

  return (
    <ul className="list-unstyled">
      {applications.map((application) => (
        <li key={application.id}>
          {application.room} — {application.date} — {application.status}
        </li>
      ))}
    </ul>
  );
}`,
    solutionExplanation:
      'Ранний возврат для пустого состояния читается лучше тернарного оператора вокруг всего списка. key по id, а не по индексу, — требование к спискам, которые сортируются и фильтруются.',
    maxScore: 16,
    estimatedMinutes: 20,
    examRefs: ['m1-cabinet', 'm2-cabinet-ux'],
    planDays: ['day-09-4'],
    source: 'plan',
  },

  {
    id: 'task-react-conditional',
    title: 'Отзыв только после смены статуса',
    kind: 'function',
    runtime: 'react',
    difficulty: 2,
    tech: ['react'],
    topicIds: ['react-conditional'],
    monthNo: 3,
    weekNo: 9,
    statement: `Требование модуля 2: «Возможность оставить отзыв у пользователя только после изменения статуса заявки администратором».

Напишите компонент \`ReviewSection\`, который принимает \`status\` и \`reviewText\`:

1. если \`reviewText\` не пустой — показать абзац \`<p className="review">\` с текстом отзыва;
2. иначе, если статус **не** «Новая» — показать форму: \`<form>\` с \`<textarea>\` и кнопкой «Отправить отзыв»;
3. иначе — показать абзац \`<p className="hint">\` с текстом «Отзыв можно оставить после изменения статуса администратором».`,
    requirements: [
      'Форма отзыва не показывается у статуса «Новая»',
      'Форма показывается у двух других статусов',
      'Уже оставленный отзыв показывается текстом',
      'У заявки со статусом «Новая» выводится подсказка',
    ],
    starterCode: `function ReviewSection({ status, reviewText }) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'У статуса «Новая» формы нет',
        type: 'react',
        code: `return ctx.render('ReviewSection', { status: 'Новая', reviewText: '' }).then(() => {
  ctx.assert(!ctx.$('form'), 'У заявки со статусом «Новая» форма отзыва показываться не должна — это требование модуля 2');
  ctx.assert(!ctx.$('textarea'), 'Поля ввода отзыва тоже быть не должно');
});`,
        points: 4,
      },
      {
        id: 't2',
        name: 'У статуса «Новая» есть подсказка',
        type: 'react',
        code: `return ctx.render('ReviewSection', { status: 'Новая', reviewText: '' }).then(() => {
  const hint = ctx.$('.hint');
  ctx.assert(hint, 'Нужен блок с классом hint и объяснением');
  ctx.assert(hint.textContent.includes('после изменения статуса'), 'Подсказка должна объяснять, когда появится форма');
});`,
        points: 3,
      },
      {
        id: 't3',
        name: 'После смены статуса форма появляется',
        type: 'react',
        code: `return ctx.render('ReviewSection', { status: 'Мероприятие назначено', reviewText: '' }).then(() => {
  ctx.assert(ctx.$('form'), 'При статусе «Мероприятие назначено» форма должна быть');
  ctx.assert(ctx.$('textarea'), 'В форме должно быть поле textarea');
  ctx.assert(ctx.text().includes('Отправить отзыв'), 'Нужна кнопка «Отправить отзыв»');
});`,
        points: 4,
      },
      {
        id: 't4',
        name: 'Для завершённого мероприятия форма тоже есть',
        type: 'react',
        code: `return ctx.render('ReviewSection', { status: 'Мероприятие завершено', reviewText: '' }).then(() => {
  ctx.assert(ctx.$('form'), 'При статусе «Мероприятие завершено» форма должна быть');
});`,
        points: 2,
      },
      {
        id: 't5',
        name: 'Существующий отзыв показывается текстом',
        type: 'react',
        code: `return ctx.render('ReviewSection', { status: 'Мероприятие завершено', reviewText: 'Всё прошло отлично' }).then(() => {
  const review = ctx.$('.review');
  ctx.assert(review, 'Оставленный отзыв должен показываться в блоке с классом review');
  ctx.assert(review.textContent.includes('Всё прошло отлично'), 'В блоке должен быть текст отзыва');
  ctx.assert(!ctx.$('form'), 'Если отзыв уже есть, форму показывать не нужно');
});`,
        points: 4,
      },
    ],
    hints: [
      { level: 1, text: 'Три ветки удобно разложить ранними возвратами: сначала отзыв, потом форма, потом подсказка.', penaltyPercent: 10 },
      { level: 2, text: 'Условие доступности отзыва: status !== "Новая".', penaltyPercent: 20 },
      {
        level: 3,
        text: 'if (reviewText) return <p className="review">…</p>; if (status !== "Новая") return <form>…</form>; return <p className="hint">…</p>;',
        penaltyPercent: 35,
      },
    ],
    solution: `function ReviewSection({ status, reviewText }) {
  if (reviewText) {
    return <p className="review"><strong>Ваш отзыв:</strong> {reviewText}</p>;
  }

  // Требование модуля 2: отзыв доступен только после смены статуса администратором
  if (status !== 'Новая') {
    return (
      <form className="mt-2">
        <label htmlFor="review" className="form-label">Ваш отзыв</label>
        <textarea id="review" className="form-control" rows={3} />
        <button type="submit" className="btn btn-sm btn-primary mt-2">Отправить отзыв</button>
      </form>
    );
  }

  return <p className="hint text-muted small">Отзыв можно оставить после изменения статуса администратором</p>;
}`,
    solutionExplanation:
      'Третья ветка с подсказкой — не формальность: без неё пользователь не понимает, почему формы нет. И помните, что то же правило обязан проверять сервер: запрос на добавление отзыва к заявке со статусом «Новая» должен отклоняться.',
    maxScore: 17,
    estimatedMinutes: 20,
    examRefs: ['m2-cabinet-ux', 'm1-cabinet'],
    planDays: ['day-09-4'],
    source: 'plan',
  },

  {
    id: 'task-react-state-filter',
    title: 'useState: фильтр списка кнопками',
    kind: 'app',
    runtime: 'react',
    difficulty: 3,
    tech: ['react'],
    topicIds: ['react-state'],
    monthNo: 3,
    weekNo: 9,
    statement: `Задание дня 5 недели 9: фильтр списка заявок кнопками.

Компонент \`FilterableList\` принимает \`applications\` и выводит:

- четыре кнопки: «Все», «Новая», «Мероприятие назначено», «Мероприятие завершено»;
- список \`<li>\` с названием помещения и статусом;
- активная кнопка имеет класс \`active\`.

По клику список фильтруется. Изначально выбрано «Все».`,
    requirements: [
      'Четыре кнопки фильтра',
      'Клик по кнопке фильтрует список',
      'Активная кнопка помечена классом active',
      'Кнопка «Все» возвращает полный список',
      'Отфильтрованный список не хранится в состоянии',
    ],
    starterCode: `function FilterableList({ applications }) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Изначально показаны все заявки',
        type: 'react',
        code: `const items = [
  { id: 1, room: 'Коворкинг', status: 'Новая' },
  { id: 2, room: 'Кинозал', status: 'Мероприятие завершено' },
  { id: 3, room: 'Аудитория', status: 'Новая' },
];
return ctx.render('FilterableList', { applications: items }).then(() => {
  ctx.assert(ctx.$$('li').length === 3, 'Изначально должны показываться все три заявки, найдено ' + ctx.$$('li').length);
});`,
        points: 3,
      },
      {
        id: 't2',
        name: 'Четыре кнопки фильтра',
        type: 'react',
        code: `return ctx.render('FilterableList', { applications: [{ id: 1, room: 'А', status: 'Новая' }] }).then(() => {
  const buttons = ctx.$$('button');
  ctx.assert(buttons.length === 4, 'Ожидалось четыре кнопки, найдено ' + buttons.length, 4, buttons.length);
  const labels = buttons.map((b) => b.textContent.trim());
  ['Все', 'Новая', 'Мероприятие назначено', 'Мероприятие завершено'].forEach((label) => {
    ctx.assert(labels.includes(label), 'Нет кнопки «' + label + '»');
  });
});`,
        points: 3,
      },
      {
        id: 't3',
        name: 'Фильтр по статусу работает',
        type: 'react',
        code: `const items = [
  { id: 1, room: 'Коворкинг', status: 'Новая' },
  { id: 2, room: 'Кинозал', status: 'Мероприятие завершено' },
  { id: 3, room: 'Аудитория', status: 'Новая' },
];
return ctx.render('FilterableList', { applications: items })
  .then(() => {
    const button = ctx.$$('button').find((b) => b.textContent.trim() === 'Новая');
    return ctx.click(button);
  })
  .then(() => {
    const list = ctx.$$('li');
    ctx.assert(list.length === 2, 'После фильтра «Новая» должно остаться две заявки, найдено ' + list.length, 2, list.length);
  });`,
        points: 5,
      },
      {
        id: 't4',
        name: 'Кнопка «Все» возвращает полный список',
        type: 'react',
        code: `const items = [
  { id: 1, room: 'Коворкинг', status: 'Новая' },
  { id: 2, room: 'Кинозал', status: 'Мероприятие завершено' },
];
return ctx.render('FilterableList', { applications: items })
  .then(() => ctx.click(ctx.$$('button').find((b) => b.textContent.trim() === 'Новая')))
  .then(() => ctx.click(ctx.$$('button').find((b) => b.textContent.trim() === 'Все')))
  .then(() => {
    ctx.assert(ctx.$$('li').length === 2, 'Кнопка «Все» должна вернуть полный список');
  });`,
        points: 4,
      },
      {
        id: 't5',
        name: 'Активная кнопка помечена',
        type: 'react',
        code: `const items = [{ id: 1, room: 'А', status: 'Новая' }];
return ctx.render('FilterableList', { applications: items })
  .then(() => ctx.click(ctx.$$('button').find((b) => b.textContent.trim() === 'Новая')))
  .then(() => {
    const active = ctx.$$('button').filter((b) => b.classList.contains('active'));
    ctx.assert(active.length === 1, 'Класс active должен быть ровно у одной кнопки, найдено ' + active.length);
    ctx.assert(active[0].textContent.trim() === 'Новая', 'Активной должна быть нажатая кнопка');
  });`,
        points: 4,
      },
      {
        id: 't6',
        name: 'Отфильтрованный список не дублируется в состоянии',
        type: 'react',
        code: `const source = ctx.source.replace(/\\s+/g, ' ');
const stateCalls = (source.match(/useState/g) || []).length;
ctx.assert(stateCalls <= 2, 'Достаточно одного состояния — выбранного фильтра. Отфильтрованный список вычисляется при отрисовке, а не хранится (найдено вызовов useState: ' + stateCalls + ')');`,
        points: 3,
      },
    ],
    hints: [
      { level: 1, text: 'В состоянии держите только выбранный фильтр — строку. Пустая строка означает «Все».', penaltyPercent: 10 },
      { level: 2, text: 'Видимый список вычисляйте прямо в теле компонента: const visible = filter ? applications.filter(...) : applications;', penaltyPercent: 20 },
      {
        level: 3,
        text: 'Кнопки удобно построить из массива: [{ label: "Все", value: "" }, …].map((item) => <button key={item.value} className={filter === item.value ? "active" : ""} onClick={() => setFilter(item.value)}>{item.label}</button>)',
        penaltyPercent: 35,
      },
    ],
    solution: `const FILTERS = [
  { label: 'Все', value: '' },
  { label: 'Новая', value: 'Новая' },
  { label: 'Мероприятие назначено', value: 'Мероприятие назначено' },
  { label: 'Мероприятие завершено', value: 'Мероприятие завершено' },
];

function FilterableList({ applications }) {
  const [filter, setFilter] = React.useState('');

  // Список вычисляется при отрисовке — дублировать его в состоянии не нужно
  const visible = filter ? applications.filter((item) => item.status === filter) : applications;

  return (
    <div>
      <div className="btn-group mb-3">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            className={\`btn btn-outline-primary \${filter === item.value ? 'active' : ''}\`}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-muted">Заявок с таким статусом нет</p>
      ) : (
        <ul>
          {visible.map((item) => (
            <li key={item.id}>{item.room} — {item.status}</li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    solutionExplanation:
      'Единственное состояние — выбранный фильтр. Видимый список считается при каждой отрисовке, поэтому он никогда не разъезжается с данными. Это ровно та логика, которая понадобится в админке.',
    maxScore: 22,
    estimatedMinutes: 30,
    examRefs: ['m2-admin-tools'],
    planDays: ['day-09-5'],
    source: 'plan',
  },
];
