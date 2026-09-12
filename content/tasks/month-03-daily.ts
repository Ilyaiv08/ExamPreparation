import type { Task } from '../types';

/**
 * Месяц 3: практика для дней, у которых её не было.
 *
 * Песочница исполняет один файл и держит только React — маршрутизатора
 * и других библиотек в ней нет. Поэтому темы, которые в проекте решаются
 * библиотекой, здесь разобраны на том механизме, который библиотека прячет:
 * таблица маршрутов, контекст, таймер уведомления. Так понятнее, что
 * именно делает react-router-dom, когда вы его поставите.
 */
export const MONTH_03_DAILY_TASKS: Task[] = [
  {
    id: 'task-react-first-components',
    title: 'Первый проект: страница из компонентов',
    kind: 'output',
    runtime: 'react',
    difficulty: 2,
    tech: ['react'],
    topicIds: ['react-basics'],
    monthNo: 3,
    weekNo: 9,
    statement: `Проект создан, шаблон вычищен. Теперь соберите страницу из компонентов — ради этого React и нужен.

1. Компонент \`RoomCard\` принимает \`{ title, price }\` и выводит \`<article>\` с заголовком \`<h3>\` и ценой в формате \`1500 ₽\`.
2. Компонент \`App\` выводит \`<h1>Конференции.РФ</h1>\` и **три** карточки \`RoomCard\` с разными помещениями.
3. В коде не должно остаться следов шаблона: счётчика \`count\`, надписи «Vite», логотипов.

Обратите внимание: \`RoomCard\` ничего не знает о списке помещений, а \`App\` ничего не знает о том, как выглядит карточка. Это и есть разделение на компоненты.`,
    requirements: [
      'Компонент RoomCard выводит <article> с заголовком и ценой',
      'Цена выводится в формате «1500 ₽»',
      'Компонент App выводит заголовок первого уровня',
      'App выводит три карточки RoomCard',
      'От шаблона проекта ничего не осталось',
    ],
    starterCode: `function RoomCard({ title, price }) {
  // <article> с <h3> и ценой
}

function App() {
  // заголовок и три карточки
}`,
    tests: [
      {
        id: 'card-renders',
        name: 'RoomCard выводит заголовок и цену',
        type: 'react',
        code: `return ctx.render('RoomCard', { title: 'Коворкинг', price: 1500 }).then(() => {
  ctx.assert(ctx.$('article'), 'Карточка должна быть тегом <article>');
  const heading = ctx.$('h3');
  ctx.assert(heading, 'В карточке нет заголовка <h3>');
  ctx.assert(heading.textContent.trim() === 'Коворкинг', 'В заголовке должно быть название помещения, сейчас: ' + heading.textContent.trim());
});`,
        points: 3,
      },
      {
        id: 'price-format',
        name: 'Цена в нужном формате',
        type: 'react',
        code: `return ctx.render('RoomCard', { title: 'Кинозал', price: 2500 }).then(() => {
  const text = ctx.text();
  ctx.assert(text.indexOf('2500 ₽') !== -1, 'Цена должна выводиться как «2500 ₽», сейчас на карточке: ' + text);
});`,
        points: 3,
      },
      {
        id: 'app-heading',
        name: 'App выводит заголовок сайта',
        type: 'react',
        code: `return ctx.render('App', {}).then(() => {
  const heading = ctx.$('h1');
  ctx.assert(heading, 'В App нет заголовка <h1>');
  ctx.assert(heading.textContent.trim() === 'Конференции.РФ', 'Заголовок должен быть «Конференции.РФ», сейчас: ' + heading.textContent.trim());
});`,
        points: 2,
      },
      {
        id: 'three-cards',
        name: 'App собирает три карточки',
        type: 'react',
        code: `return ctx.render('App', {}).then(() => {
  const cards = ctx.$$('article');
  ctx.assert(cards.length === 3, 'Карточек должно быть три, найдено: ' + cards.length, 3, cards.length);
  const titles = ctx.$$('h3').map((h) => h.textContent.trim());
  const unique = titles.filter((title, index) => titles.indexOf(title) === index);
  ctx.assert(unique.length === 3, 'Помещения должны быть разными, сейчас: ' + titles.join(', '));
});`,
        points: 4,
      },
      {
        id: 'reuse',
        name: 'App использует RoomCard, а не повторяет разметку',
        type: 'react',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
const usages = source.match(/<RoomCard/g) || [];
ctx.assert(
  usages.length === 3,
  'В App должно быть три вызова <RoomCard …/>, найдено: ' + usages.length + '. Если разметка карточки скопирована, смысл компонента теряется',
);`,
        points: 3,
      },
      {
        id: 'no-template',
        name: 'От шаблона ничего не осталось',
        type: 'react',
        code: `const source = ctx.source || '';
ctx.assert(!/vite/i.test(source), 'В коде остались следы шаблона Vite');
ctx.assert(!/count is|setCount/i.test(source), 'В коде остался счётчик из шаблона');
ctx.assert(!/logo|\\.svg/i.test(source), 'В коде остались логотипы шаблона');`,
        points: 2,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Компонент — обычная функция, которая возвращает разметку. Имя обязательно с большой буквы, иначе React примет его за обычный тег.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Значения из JavaScript вставляются в разметку фигурными скобками: <h3>{title}</h3> и <p>{price} ₽</p>.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'function RoomCard({ title, price }) { return <article><h3>{title}</h3><p>{price} ₽</p></article>; } — и в App три строки <RoomCard title="Коворкинг" price={1500} />.',
        penaltyPercent: 35,
      },
    ],
    solution: `function RoomCard({ title, price }) {
  return (
    <article>
      <h3>{title}</h3>
      <p>{price} ₽</p>
    </article>
  );
}

function App() {
  return (
    <div>
      <h1>Конференции.РФ</h1>
      <RoomCard title="Аудитория на 100 мест" price={5000} />
      <RoomCard title="Коворкинг" price={1500} />
      <RoomCard title="Кинозал" price={2500} />
    </div>
  );
}`,
    solutionExplanation:
      'Цена передана числом в фигурных скобках — price={1500}, а название строкой в кавычках. Это не мелочь: если написать price="1500", внутрь компонента придёт строка, и первое же сложение превратится в склейку текста. Разделение обязанностей здесь буквальное: RoomCard знает, как выглядит карточка, но не знает, сколько их и какие; App знает состав, но не знает вёрстки. Поменять оформление карточек во всём приложении — это правка в одном месте.',
    maxScore: 17,
    estimatedMinutes: 25,
    examRefs: ['m3-framework', 'm1-oop-styles'],
    planDays: ['day-09-1'],
    source: 'plan',
  },

  {
    id: 'task-react-bootstrap-classes',
    title: 'Bootstrap в React: className вместо class',
    kind: 'fix-bug',
    runtime: 'react',
    difficulty: 2,
    tech: ['react', 'bootstrap'],
    topicIds: ['react-basics', 'bootstrap-basics'],
    monthNo: 3,
    weekNo: 9,
    statement: `Компонент переписали на Bootstrap, но классы не применяются. Причина одна и та же во всех строках: в JSX атрибут называется \`className\`, а не \`class\`. Слово \`class\` в JavaScript занято — им объявляют классы.

Исправьте компонент \`RoomList\` так, чтобы:

1. все классы задавались через \`className\`;
2. обёртка имела класс \`container\`, ряд — \`row g-3\`;
3. каждое помещение лежало в колонке \`col-12 col-md-4\`;
4. внутри колонки была карточка \`card\` с телом \`card-body\` и заголовком \`card-title\`;
5. у кнопки были классы \`btn btn-primary\`.

Данные приходят пропсом \`rooms\` — массивом объектов \`{ id, title }\`.`,
    requirements: [
      'В коде нет атрибута class — только className',
      'Обёртка с классом container и ряд с row g-3',
      'Колонки с классами col-12 и col-md-4',
      'Карточка card с card-body и card-title',
      'Кнопка с классами btn btn-primary',
      'У элементов списка задан key',
    ],
    starterCode: `function RoomList({ rooms }) {
  return (
    <div class="container">
      <div class="row">
        {rooms.map((room) => (
          <div class="col">
            <div class="card">
              <div>
                <h5>{room.title}</h5>
                <button class="btn">Забронировать</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
    tests: [
      {
        id: 'no-class-attribute',
        name: 'Атрибут class заменён на className',
        type: 'react',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(
  !/<[a-zA-Z][^>]*\\sclass\\s*=/.test(source),
  'В разметке остался атрибут class. В JSX он называется className',
);
ctx.assert(/className\\s*=/.test(source), 'Ни одного className в коде не найдено');`,
        points: 3,
      },
      {
        id: 'grid',
        name: 'Обёртка и ряд',
        type: 'react',
        code: `const rooms = [{ id: 1, title: 'Коворкинг' }, { id: 2, title: 'Кинозал' }, { id: 3, title: 'Аудитория' }];
return ctx.render('RoomList', { rooms }).then(() => {
  const container = ctx.$('.container');
  ctx.assert(container, 'Нет обёртки с классом container');
  const row = ctx.$('.row');
  ctx.assert(row, 'Нет ряда с классом row');
  ctx.assert(row.classList.contains('g-3'), 'У ряда должен быть класс g-3');
});`,
        points: 3,
      },
      {
        id: 'columns',
        name: 'Колонки адаптивные',
        type: 'react',
        code: `const rooms = [{ id: 1, title: 'Коворкинг' }, { id: 2, title: 'Кинозал' }, { id: 3, title: 'Аудитория' }];
return ctx.render('RoomList', { rooms }).then(() => {
  const columns = ctx.$$('.col-12');
  ctx.assert(columns.length === 3, 'Колонок с классом col-12 должно быть три, найдено: ' + columns.length, 3, columns.length);
  columns.forEach((column) => {
    ctx.assert(column.classList.contains('col-md-4'), 'У колонки нет класса col-md-4');
  });
});`,
        points: 3,
      },
      {
        id: 'cards',
        name: 'Карточки собраны по правилам Bootstrap',
        type: 'react',
        code: `const rooms = [{ id: 1, title: 'Коворкинг' }, { id: 2, title: 'Кинозал' }, { id: 3, title: 'Аудитория' }];
return ctx.render('RoomList', { rooms }).then(() => {
  const cards = ctx.$$('.card');
  ctx.assert(cards.length === 3, 'Карточек должно быть три, найдено: ' + cards.length);
  cards.forEach((card) => {
    ctx.assert(ctx.$('.card-body', card) || card.querySelector('.card-body'), 'В карточке нет .card-body');
    ctx.assert(card.querySelector('.card-title'), 'В карточке нет заголовка с классом card-title');
  });
});`,
        points: 3,
      },
      {
        id: 'button',
        name: 'Кнопка оформлена',
        type: 'react',
        code: `const rooms = [{ id: 1, title: 'Коворкинг' }];
return ctx.render('RoomList', { rooms }).then(() => {
  const button = ctx.$('button');
  ctx.assert(button, 'Кнопка пропала');
  ctx.assert(button.classList.contains('btn'), 'У кнопки нет класса btn');
  ctx.assert(button.classList.contains('btn-primary'), 'У кнопки нет класса btn-primary');
});`,
        points: 2,
      },
      {
        id: 'key',
        name: 'У элементов списка задан key',
        type: 'react',
        code: `const source = ctx.source || '';
ctx.assert(/key\\s*=\\s*\\{/.test(source), 'У элементов, созданных через map, должен быть key');
ctx.assert(!/key\\s*=\\s*\\{\\s*index\\s*\\}/.test(source), 'Индекс — плохой key: используйте room.id');`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Классы в JSX пишутся строкой целиком: className="col-12 col-md-4", а не двумя атрибутами.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Карточке Bootstrap нужны три уровня: .card → .card-body → .card-title. Без .card-body не будет внутренних отступов.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: '<div className="col-12 col-md-4" key={room.id}><div className="card"><div className="card-body"><h5 className="card-title">{room.title}</h5><button className="btn btn-primary">Забронировать</button></div></div></div>',
        penaltyPercent: 35,
      },
    ],
    solution: `function RoomList({ rooms }) {
  return (
    <div className="container">
      <div className="row g-3">
        {rooms.map((room) => (
          <div className="col-12 col-md-4" key={room.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{room.title}</h5>
                <button className="btn btn-primary">Забронировать</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
    solutionExplanation:
      'JSX выглядит как HTML, но им не является: это JavaScript, и имена атрибутов подчиняются правилам JavaScript. Отсюда className вместо class и htmlFor вместо for — оба слова в языке заняты. React не ругается на class, он просто молча его игнорирует, поэтому ошибка проявляется как «Bootstrap не работает». Ключ key ставится на самый внешний элемент внутри map — здесь на колонку, а не на карточку.',
    maxScore: 17,
    estimatedMinutes: 20,
    examRefs: ['m3-framework', 'm1-oop-styles', 'm2-mobile'],
    planDays: ['day-09-6'],
    source: 'plan',
  },

  {
    id: 'task-react-form-one-state',
    title: 'Форма регистрации: одно состояние на пять полей',
    kind: 'function',
    runtime: 'react',
    difficulty: 3,
    tech: ['react'],
    topicIds: ['react-forms'],
    monthNo: 3,
    weekNo: 10,
    statement: `Пять полей — это не пять состояний и не пять обработчиков. Всё хранится одним объектом, и меняет его одна функция.

Компонент \`RegisterForm\`:

1. одно состояние — объект с полями \`login\`, \`password\`, \`fullName\`, \`phone\`, \`email\` (изначально пустые строки);
2. **один** обработчик изменения на все поля: он берёт \`name\` из поля и обновляет соответствующий ключ;
3. каждое поле — управляемое: \`value\` берётся из состояния, а \`name\` совпадает с именем ключа;
4. под формой блок \`#preview\` с текстом \`Логин: ivanov26, e-mail: ivanov@example.com\` — значения берутся из состояния и меняются на лету.

Ключ к заданию — обновление одного поля в объекте без потери остальных.`,
    requirements: [
      'Состояние одно: объект со всеми полями',
      'Обработчик изменения один на все поля',
      'Все поля управляемые: value из состояния, name совпадает с ключом',
      'Изменение одного поля не стирает остальные',
      'Блок #preview показывает текущие значения',
    ],
    starterCode: `function RegisterForm() {
  // одно состояние-объект, один обработчик, пять управляемых полей
}`,
    tests: [
      {
        id: 'fields-present',
        name: 'Пять полей с правильными именами',
        type: 'react',
        code: `return ctx.render('RegisterForm', {}).then(() => {
  ['login', 'password', 'fullName', 'phone', 'email'].forEach((name) => {
    ctx.assert(ctx.$('input[name="' + name + '"]'), 'Нет поля с name="' + name + '"');
  });
});`,
        points: 3,
      },
      {
        id: 'controlled',
        name: 'Поля управляемые',
        type: 'react',
        code: `return ctx.render('RegisterForm', {}).then(() => {
  const source = (ctx.source || '').replace(/\\s+/g, ' ');
  ctx.assert(/value\\s*=\\s*\\{/.test(source), 'У полей должен быть value из состояния — иначе поле неуправляемое');
  ctx.assert(/onChange\\s*=\\s*\\{/.test(source), 'У полей должен быть обработчик onChange');
  const inputs = ctx.$$('input');
  inputs.forEach((input) => {
    ctx.assert(input.value === '', 'Изначально все поля должны быть пустыми, поле «' + input.name + '» уже заполнено');
  });
});`,
        points: 3,
      },
      {
        id: 'one-state',
        name: 'Состояние одно, обработчик один',
        type: 'react',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
const states = source.match(/useState\\s*\\(/g) || [];
ctx.assert(
  states.length === 1,
  'Вызовов useState должно быть ровно один — всё хранится одним объектом. Найдено: ' + states.length,
  1,
  states.length,
);
const handlers = source.match(/onChange\\s*=\\s*\\{/g) || [];
ctx.assert(handlers.length === 5, 'Каждому из пяти полей нужен onChange, найдено: ' + handlers.length);
ctx.assert(
  /\\[\\s*\\w+\\.?\\w*\\.name\\s*\\]|\\[\\s*name\\s*\\]/.test(source),
  'Обработчик должен определять поле по его name — вычисляемым ключом вида [event.target.name]: value',
);`,
        points: 4,
      },
      {
        id: 'typing',
        name: 'Ввод попадает в состояние',
        type: 'react',
        code: `return ctx.render('RegisterForm', {})
  .then(() => ctx.change('input[name="login"]', 'ivanov26'))
  .then(() => {
    ctx.assert(ctx.$('input[name="login"]').value === 'ivanov26', 'Введённое значение не попало в поле логина');
    ctx.assert(ctx.text('#preview').indexOf('ivanov26') !== -1, 'Блок #preview не показал новое значение логина');
  });`,
        points: 4,
      },
      {
        id: 'no-reset',
        name: 'Изменение одного поля не стирает остальные',
        type: 'react',
        code: `return ctx.render('RegisterForm', {})
  .then(() => ctx.change('input[name="login"]', 'ivanov26'))
  .then(() => ctx.change('input[name="email"]', 'ivanov@example.com'))
  .then(() => {
    ctx.assert(
      ctx.$('input[name="login"]').value === 'ivanov26',
      'После ввода e-mail логин опустел. В обработчике не хватает копирования прежнего состояния: { ...prev, [name]: value }',
    );
    const preview = ctx.text('#preview');
    ctx.assert(preview.indexOf('ivanov26') !== -1, 'В #preview пропал логин');
    ctx.assert(preview.indexOf('ivanov@example.com') !== -1, 'В #preview нет e-mail');
  });`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Состояние — объект: useState({ login: "", password: "", fullName: "", phone: "", email: "" }).',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Имя ключа можно вычислить на лету, если взять его в квадратные скобки: { [event.target.name]: event.target.value }.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const handleChange = (event) => { const { name, value } = event.target; setValues((prev) => ({ ...prev, [name]: value })); }; и у каждого поля value={values.login} name="login" onChange={handleChange}.',
        penaltyPercent: 35,
      },
    ],
    solution: `function RegisterForm() {
  const [values, setValues] = React.useState({
    login: '',
    password: '',
    fullName: '',
    phone: '',
    email: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form>
      <label htmlFor="login">Логин</label>
      <input id="login" name="login" value={values.login} onChange={handleChange} />

      <label htmlFor="password">Пароль</label>
      <input id="password" name="password" type="password" value={values.password} onChange={handleChange} />

      <label htmlFor="fullName">ФИО</label>
      <input id="fullName" name="fullName" value={values.fullName} onChange={handleChange} />

      <label htmlFor="phone">Телефон</label>
      <input id="phone" name="phone" type="tel" value={values.phone} onChange={handleChange} />

      <label htmlFor="email">E-mail</label>
      <input id="email" name="email" type="email" value={values.email} onChange={handleChange} />

      <p id="preview">Логин: {values.login}, e-mail: {values.email}</p>
    </form>
  );
}`,
    solutionExplanation:
      'Три приёма в одной строке setValues((prev) => ({ ...prev, [name]: value })). Первый — обновление через функцию: React не гарантирует, что состояние обновится мгновенно, и опираться на текущее значение переменной опасно. Второй — расширение объекта ...prev: без него новый объект содержал бы одно поле, а остальные исчезли. Третий — вычисляемый ключ [name]: имя ключа берётся из переменной, поэтому один обработчик обслуживает все пять полей.',
    maxScore: 19,
    estimatedMinutes: 30,
    examRefs: ['m1-register', 'm2-register-hints', 'm3-framework'],
    planDays: ['day-10-1'],
    source: 'plan',
  },

  {
    id: 'task-react-login-exact-text',
    title: 'Страница входа: предупреждение и точная формулировка ссылки',
    kind: 'app',
    runtime: 'react',
    difficulty: 3,
    tech: ['react'],
    topicIds: ['react-forms'],
    monthNo: 3,
    weekNo: 10,
    statement: `Задание демоэкзамена приводит текст ссылки дословно: **«Еще не зарегистрированы? Регистрация»**. Именно так — «Еще» без буквы «ё». Проверяющий сверяет с заданием, а не с орфографическим словарём, поэтому текст переносится буква в букву.

Компонент \`LoginPage\`:

1. форма с полями \`login\` и \`password\`, оба управляемые;
2. по отправке форма проверяет данные: правильными считаются логин \`ivanov26\` и пароль \`demo2026pass\`;
3. при неверных данных в блоке \`#warning\` появляется текст «Неверный логин или пароль», при верных — блок пуст;
4. ссылка \`<a href="/register">\` с текстом ровно «Еще не зарегистрированы? Регистрация»;
5. страница при отправке не перезагружается.`,
    requirements: [
      'Поля логина и пароля управляемые',
      'Неверные данные показывают предупреждение в #warning',
      'Верные данные предупреждение убирают',
      'Есть ссылка с точным текстом «Еще не зарегистрированы? Регистрация»',
      'Отправка формы не перезагружает страницу',
    ],
    starterCode: `function LoginPage() {
  // форма входа, проверка, предупреждение и ссылка на регистрацию
}`,
    tests: [
      {
        id: 'fields',
        name: 'Поля на месте и управляемые',
        type: 'react',
        code: `return ctx.render('LoginPage', {}).then(() => {
  const login = ctx.$('input[name="login"]');
  const password = ctx.$('input[name="password"]');
  ctx.assert(login, 'Нет поля с name="login"');
  ctx.assert(password, 'Нет поля с name="password"');
  ctx.assert(password.type === 'password', 'Пароль должен быть type="password"');
  const source = (ctx.source || '').replace(/\\s+/g, ' ');
  ctx.assert(/value\\s*=\\s*\\{/.test(source), 'Поля должны быть управляемыми: value из состояния');
});`,
        points: 3,
      },
      {
        id: 'exact-link',
        name: 'Текст ссылки совпадает с заданием',
        type: 'react',
        code: `return ctx.render('LoginPage', {}).then(() => {
  const links = ctx.$$('a');
  ctx.assert(links.length >= 1, 'На странице нет ссылки на регистрацию');
  const texts = links.map((link) => link.textContent.replace(/\\s+/g, ' ').trim());
  const expected = 'Еще не зарегистрированы? Регистрация';
  ctx.assert(
    texts.indexOf(expected) !== -1,
    'Нужен точный текст «' + expected + '». Сейчас на странице: ' + texts.join(' | '),
    expected,
    texts.join(' | '),
  );
});`,
        points: 4,
      },
      {
        id: 'link-href',
        name: 'Ссылка ведёт на регистрацию',
        type: 'react',
        code: `return ctx.render('LoginPage', {}).then(() => {
  const link = ctx.$$('a').filter((a) => a.textContent.indexOf('Регистрация') !== -1)[0];
  ctx.assert(link, 'Ссылка на регистрацию не найдена');
  const href = link.getAttribute('href');
  ctx.assert(href && href.indexOf('register') !== -1, 'Ссылка должна вести на /register, сейчас: ' + href);
});`,
        points: 2,
      },
      {
        id: 'warning-shown',
        name: 'Неверные данные дают предупреждение',
        type: 'react',
        code: `return ctx.render('LoginPage', {})
  .then(() => ctx.change('input[name="login"]', 'petrov26'))
  .then(() => ctx.change('input[name="password"]', 'wrongpass1'))
  .then(() => ctx.submit('form'))
  .then(() => {
    const warning = ctx.text('#warning');
    ctx.assert(warning.length > 0, 'Блок #warning пуст: предупреждение не показано');
    ctx.assert(
      /неверн/i.test(warning),
      'В предупреждении должно быть сказано, что логин или пароль неверны. Сейчас: ' + warning,
    );
  });`,
        points: 4,
      },
      {
        id: 'warning-cleared',
        name: 'Верные данные убирают предупреждение',
        type: 'react',
        code: `return ctx.render('LoginPage', {})
  .then(() => ctx.change('input[name="login"]', 'petrov26'))
  .then(() => ctx.change('input[name="password"]', 'wrongpass1'))
  .then(() => ctx.submit('form'))
  .then(() => ctx.change('input[name="login"]', 'ivanov26'))
  .then(() => ctx.change('input[name="password"]', 'demo2026pass'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(
      ctx.text('#warning') === '',
      'После верного входа предупреждение должно исчезнуть, сейчас: ' + ctx.text('#warning'),
    );
  });`,
        points: 4,
      },
      {
        id: 'no-reload',
        name: 'Страница не перезагружается',
        type: 'react',
        code: `const source = ctx.source || '';
ctx.assert(/preventDefault/.test(source), 'В обработчике отправки нужен event.preventDefault()');
ctx.assert(!/alert\\s*\\(/.test(source), 'Предупреждение выводится на странице, а не через alert');`,
        points: 2,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Текст предупреждения удобно держать в состоянии: пустая строка — предупреждения нет, непустая — есть.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Блок #warning выводите всегда, а не по условию: пустой абзац не мешает, зато проверка и вёрстка не прыгают.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const handleSubmit = (e) => { e.preventDefault(); const ok = login === "ivanov26" && password === "demo2026pass"; setWarning(ok ? "" : "Неверный логин или пароль"); };',
        penaltyPercent: 35,
      },
    ],
    solution: `function LoginPage() {
  const [login, setLogin] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [warning, setWarning] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const ok = login === 'ivanov26' && password === 'demo2026pass';
    setWarning(ok ? '' : 'Неверный логин или пароль');
  };

  return (
    <div>
      <h1>Вход</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="login">Логин</label>
        <input id="login" name="login" value={login} onChange={(event) => setLogin(event.target.value)} />

        <label htmlFor="password">Пароль</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit">Войти</button>
      </form>

      <p id="warning">{warning}</p>

      <a href="/register">Еще не зарегистрированы? Регистрация</a>
    </div>
  );
}`,
    solutionExplanation:
      'Блок предупреждения выводится всегда, а его содержимое — строка из состояния. Альтернатива — рисовать блок по условию {warning && <p>…</p>} — работает, но при появлении сообщения вся форма подпрыгивает вниз. Здесь достаточно двух состояний на поля: их всего два, и объект был бы избыточен. Для пяти полей регистрации выгоднее один объект, для двух — две простые переменные. Выбор зависит от количества, а не от догмы.',
    maxScore: 19,
    estimatedMinutes: 30,
    examRefs: ['m1-login', 'm2-login-warnings'],
    planDays: ['day-10-5'],
    source: 'plan',
  },

  {
    id: 'task-react-order-form',
    title: 'Заявка: выпадающие списки и дата ДД.ММ.ГГГГ',
    kind: 'app',
    runtime: 'react',
    difficulty: 3,
    tech: ['react'],
    topicIds: ['react-date-input', 'react-forms'],
    monthNo: 3,
    weekNo: 10,
    statement: `Модуль 2 требует от формы заявки дословно: «использование выпадающих списков» и «вывод даты в формате ДД.ММ.ГГГГ».

Компонент \`OrderForm\`:

1. выпадающий список \`room\` — три помещения плюс пустой первый вариант «Выберите помещение»;
2. поле даты \`date\` типа \`date\`;
3. выпадающий список \`payment\` — «Наличными» и «Картой»;
4. все три поля управляемые;
5. по отправке в блоке \`#result\` появляется строка вида \`Коворкинг, 12.03.2027, Картой\` — дата обязательно в формате ДД.ММ.ГГГГ, хотя поле отдаёт её как \`2027-03-12\`;
6. если помещение или дата не выбраны, в \`#result\` появляется «Заполните все поля».`,
    requirements: [
      'Выпадающий список помещений с пустым первым вариантом',
      'Поле даты типа date',
      'Выпадающий список способа оплаты',
      'Все поля управляемые',
      'Результат показывает дату в формате ДД.ММ.ГГГГ',
      'Незаполненные поля дают сообщение «Заполните все поля»',
    ],
    starterCode: `function OrderForm() {
  // три поля, отправка и вывод результата в #result
}`,
    tests: [
      {
        id: 'selects',
        name: 'Два выпадающих списка на месте',
        type: 'react',
        code: `return ctx.render('OrderForm', {}).then(() => {
  const room = ctx.$('select[name="room"]');
  const payment = ctx.$('select[name="payment"]');
  ctx.assert(room, 'Нет выпадающего списка с name="room"');
  ctx.assert(payment, 'Нет выпадающего списка с name="payment"');
  const rooms = Array.prototype.slice.call(room.options).filter((option) => option.value !== '');
  ctx.assert(rooms.length >= 3, 'Помещений должно быть не меньше трёх, найдено: ' + rooms.length);
  ctx.assert(room.options[0].value === '', 'Первым должен идти пустой вариант «Выберите помещение»');
});`,
        points: 3,
      },
      {
        id: 'date-input',
        name: 'Поле даты',
        type: 'react',
        code: `return ctx.render('OrderForm', {}).then(() => {
  const date = ctx.$('input[name="date"]');
  ctx.assert(date, 'Нет поля с name="date"');
  ctx.assert(date.type === 'date', 'Поле даты должно быть type="date", сейчас: ' + date.type);
});`,
        points: 2,
      },
      {
        id: 'controlled',
        name: 'Поля управляемые',
        type: 'react',
        code: `return ctx.render('OrderForm', {})
  .then(() => ctx.change('select[name="room"]', 'Коворкинг'))
  .then(() => {
    ctx.assert(
      ctx.$('select[name="room"]').value === 'Коворкинг',
      'Значение не сохранилось: поле должно быть управляемым (value из состояния)',
    );
  });`,
        points: 3,
      },
      {
        id: 'result-format',
        name: 'Дата выводится в формате ДД.ММ.ГГГГ',
        type: 'react',
        code: `return ctx.render('OrderForm', {})
  .then(() => ctx.change('select[name="room"]', 'Коворкинг'))
  .then(() => ctx.change('input[name="date"]', '2027-03-12'))
  .then(() => ctx.change('select[name="payment"]', 'Картой'))
  .then(() => ctx.submit('form'))
  .then(() => {
    const result = ctx.text('#result');
    ctx.assert(result.indexOf('12.03.2027') !== -1, 'Дата должна быть в формате ДД.ММ.ГГГГ, сейчас: ' + result);
    ctx.assert(result.indexOf('2027-03-12') === -1, 'В результат попала дата в исходном виде 2027-03-12');
    ctx.assert(result.indexOf('Коворкинг') !== -1, 'В результате нет помещения');
    ctx.assert(result.indexOf('Картой') !== -1, 'В результате нет способа оплаты');
  });`,
        points: 5,
      },
      {
        id: 'date-padding',
        name: 'Однозначные день и месяц с нулём',
        type: 'react',
        code: `return ctx.render('OrderForm', {})
  .then(() => ctx.change('select[name="room"]', 'Кинозал'))
  .then(() => ctx.change('input[name="date"]', '2027-01-05'))
  .then(() => ctx.change('select[name="payment"]', 'Наличными'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(ctx.text('#result').indexOf('05.01.2027') !== -1, 'Ожидалась дата 05.01.2027, сейчас: ' + ctx.text('#result'));
  });`,
        points: 3,
      },
      {
        id: 'validation',
        name: 'Незаполненные поля не пропускаются',
        type: 'react',
        code: `// Компонент между проверками не пересоздаётся, поэтому поля очищаем явно.
return ctx.render('OrderForm', {})
  .then(() => ctx.change('select[name="room"]', ''))
  .then(() => ctx.change('input[name="date"]', ''))
  .then(() => ctx.submit('form'))
  .then(() => {
    const result = ctx.text('#result');
    ctx.assert(
      result.indexOf('Заполните все поля') !== -1,
      'При пустых полях должно появиться «Заполните все поля», сейчас: ' + result,
    );
  });`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Поле type="date" всегда отдаёт значение строкой вида ГГГГ-ММ-ДД, независимо от того, как оно выглядит на экране.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Переворот даты делается разбором строки, а не через new Date: split("-").reverse().join(".").',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const toRu = (iso) => iso.split("-").reverse().join("."); и в обработчике: if (!room || !date) { setResult("Заполните все поля"); return; } setResult(room + ", " + toRu(date) + ", " + payment);',
        penaltyPercent: 35,
      },
    ],
    solution: `function OrderForm() {
  const [values, setValues] = React.useState({ room: '', date: '', payment: 'Наличными' });
  const [result, setResult] = React.useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const toRuDate = (iso) => iso.split('-').reverse().join('.');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!values.room || !values.date) {
      setResult('Заполните все поля');
      return;
    }

    setResult(values.room + ', ' + toRuDate(values.date) + ', ' + values.payment);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="room">Помещение</label>
        <select id="room" name="room" value={values.room} onChange={handleChange}>
          <option value="">Выберите помещение</option>
          <option value="Аудитория на 100 мест">Аудитория на 100 мест</option>
          <option value="Коворкинг">Коворкинг</option>
          <option value="Кинозал">Кинозал</option>
        </select>

        <label htmlFor="date">Дата мероприятия</label>
        <input id="date" name="date" type="date" value={values.date} onChange={handleChange} />

        <label htmlFor="payment">Способ оплаты</label>
        <select id="payment" name="payment" value={values.payment} onChange={handleChange}>
          <option value="Наличными">Наличными</option>
          <option value="Картой">Картой</option>
        </select>

        <button type="submit">Отправить заявку</button>
      </form>

      <p id="result">{result}</p>
    </div>
  );
}`,
    solutionExplanation:
      'Поле type="date" всегда работает со строкой ГГГГ-ММ-ДД, как бы оно ни выглядело на экране — в этом формате значение уходит и приходит. Показывать пользователю нужно ДД.ММ.ГГГГ, а хранить и отправлять на сервер — исходный вид: он сортируется как обычная строка и понятен базе данных. Преобразование сделано разбором строки: new Date("2027-03-12") создаёт момент полуночи по UTC, и восточнее Гринвича дата съезжает на сутки назад.',
    maxScore: 19,
    estimatedMinutes: 35,
    examRefs: ['m1-order', 'm2-order-form'],
    planDays: ['day-10-6'],
    source: 'plan',
  },

  {
    id: 'task-react-router-table',
    title: 'Переходы между страницами без перезагрузки',
    kind: 'app',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['react-router'],
    monthNo: 3,
    weekNo: 11,
    statement: `В проекте маршруты описывает \`react-router-dom\`. Библиотека внутри делает ровно то, что вы напишете сейчас: хранит текущий адрес, ищет его в таблице маршрутов и выводит нужный компонент — не перезагружая страницу.

Соберите этот механизм руками, чтобы понимать, что происходит под капотом.

1. Массив \`routes\` — пять маршрутов: \`/\`, \`/login\`, \`/cabinet\`, \`/order\`, \`/admin\`. У каждого поля \`path\`, \`title\` и \`element\` (функция, возвращающая разметку).
2. Функция \`resolve(path)\` возвращает маршрут по адресу, а для неизвестного — маршрут-заглушку с \`title: 'Страница не найдена'\`.
3. Компонент \`App\` хранит текущий адрес в состоянии (изначально \`/\`), выводит меню из \`routes\` кнопками \`data-path\` и показывает \`<h1>\` с заголовком текущего маршрута и его содержимое в \`#page\`.
4. Клик по кнопке меню меняет адрес.`,
    requirements: [
      'Массив routes из пяти маршрутов с path, title и element',
      'resolve находит маршрут по адресу',
      'resolve для неизвестного адреса возвращает «Страница не найдена»',
      'App выводит меню из routes, а не вручную',
      'Клик по пункту меню меняет содержимое без перезагрузки',
    ],
    starterCode: `const routes = [
  // { path: '/', title: 'Главная', element: () => <p>…</p> },
];

function resolve(path) {
  // найти маршрут или вернуть заглушку
}

function App() {
  // текущий адрес в состоянии, меню из routes, вывод маршрута
}`,
    tests: [
      {
        id: 'routes-table',
        name: 'Таблица маршрутов заполнена',
        type: 'react',
        code: `const routes = ctx.get('routes');
ctx.assert(Array.isArray(routes), 'routes должен быть массивом');
ctx.assert(routes.length === 5, 'Маршрутов должно быть пять, найдено: ' + routes.length, 5, routes.length);
const paths = routes.map((route) => route.path);
['/', '/login', '/cabinet', '/order', '/admin'].forEach((path) => {
  ctx.assert(paths.indexOf(path) !== -1, 'Не хватает маршрута ' + path);
});
routes.forEach((route) => {
  ctx.assert(typeof route.title === 'string' && route.title.length > 0, 'У маршрута ' + route.path + ' нет заголовка');
  ctx.assert(typeof route.element === 'function', 'У маршрута ' + route.path + ' поле element должно быть функцией');
});`,
        points: 4,
      },
      {
        id: 'resolve-known',
        name: 'resolve находит маршрут',
        type: 'react',
        code: `const resolve = ctx.get('resolve');
const route = resolve('/cabinet');
ctx.assert(route && route.path === '/cabinet', 'resolve("/cabinet") должен вернуть маршрут кабинета');`,
        points: 3,
      },
      {
        id: 'resolve-unknown',
        name: 'Неизвестный адрес даёт заглушку',
        type: 'react',
        code: `const resolve = ctx.get('resolve');
const route = resolve('/нет-такой-страницы');
ctx.assert(route, 'Для неизвестного адреса resolve не должен возвращать undefined');
ctx.assert(
  route.title === 'Страница не найдена',
  'Заголовок заглушки должен быть «Страница не найдена», сейчас: ' + route.title,
);`,
        points: 3,
      },
      {
        id: 'menu-from-routes',
        name: 'Меню строится из таблицы маршрутов',
        type: 'react',
        code: `return ctx.render('App', {}).then(() => {
  const buttons = ctx.$$('[data-path]');
  ctx.assert(buttons.length === 5, 'В меню должно быть пять пунктов, найдено: ' + buttons.length, 5, buttons.length);
  const source = (ctx.source || '').replace(/\\s+/g, ' ');
  ctx.assert(
    /routes\\s*\\.\\s*map/.test(source),
    'Меню должно строиться из routes.map, а не перечисляться вручную: иначе новый маршрут придётся добавлять дважды',
  );
});`,
        points: 4,
      },
      {
        id: 'initial-page',
        name: 'Сначала открыта главная',
        type: 'react',
        code: `return ctx.render('App', {}).then(() => {
  const heading = ctx.$('h1');
  ctx.assert(heading, 'Нет заголовка <h1> с названием страницы');
  const home = ctx.get('routes').filter((route) => route.path === '/')[0];
  ctx.assert(
    heading.textContent.trim() === home.title,
    'Изначально должна открываться главная с заголовком «' + home.title + '», сейчас: ' + heading.textContent.trim(),
  );
  ctx.assert(ctx.$('#page'), 'Нет блока #page с содержимым маршрута');
});`,
        points: 3,
      },
      {
        id: 'navigation',
        name: 'Клик по меню меняет страницу',
        type: 'react',
        code: `return ctx.render('App', {})
  .then(() => ctx.click('[data-path="/cabinet"]'))
  .then(() => {
    const cabinet = ctx.get('routes').filter((route) => route.path === '/cabinet')[0];
    ctx.assert(
      ctx.$('h1').textContent.trim() === cabinet.title,
      'После клика по «Кабинет» заголовок должен смениться, сейчас: ' + ctx.$('h1').textContent.trim(),
    );
  })
  .then(() => ctx.click('[data-path="/admin"]'))
  .then(() => {
    const admin = ctx.get('routes').filter((route) => route.path === '/admin')[0];
    ctx.assert(ctx.$('h1').textContent.trim() === admin.title, 'Переход на админку не сработал');
  });`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Текущий адрес — это обычное состояние: const [path, setPath] = React.useState("/").',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Поле element хранит функцию, поэтому выводится она вызовом: {route.element()}. Если написать {route.element}, React получит функцию вместо разметки.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const resolve = (path) => routes.find((route) => route.path === path) || { path, title: "Страница не найдена", element: () => <p>Проверьте адрес</p> }; а в App: {routes.map((route) => <button key={route.path} data-path={route.path} onClick={() => setPath(route.path)}>{route.title}</button>)}',
        penaltyPercent: 35,
      },
    ],
    solution: `const routes = [
  { path: '/', title: 'Главная', element: () => <p>Бронирование помещений для конференций</p> },
  { path: '/login', title: 'Вход', element: () => <p>Форма входа</p> },
  { path: '/cabinet', title: 'Личный кабинет', element: () => <p>Ваши заявки</p> },
  { path: '/order', title: 'Оформление заявки', element: () => <p>Новая заявка</p> },
  { path: '/admin', title: 'Администратор', element: () => <p>Все заявки</p> },
];

function resolve(path) {
  const found = routes.find((route) => route.path === path);
  if (found) return found;
  return { path, title: 'Страница не найдена', element: () => <p>Проверьте адрес страницы</p> };
}

function App() {
  const [path, setPath] = React.useState('/');
  const route = resolve(path);

  return (
    <div>
      <nav>
        {routes.map((item) => (
          <button key={item.path} data-path={item.path} type="button" onClick={() => setPath(item.path)}>
            {item.title}
          </button>
        ))}
      </nav>

      <h1>{route.title}</h1>
      <div id="page">{route.element()}</div>
    </div>
  );
}`,
    solutionExplanation:
      'Меню строится из того же массива, что и маршруты. Это главное, ради чего заводят таблицу: добавили строку в routes — пункт меню появился сам, и страница заработала. Если перечислять пункты вручную, каждая новая страница потребует двух правок, и рано или поздно одну забудут. Заглушка для неизвестного адреса возвращается из resolve, а не проверяется в App: компонент не должен знать, бывает ли адрес неправильным — он просто выводит то, что ему дали.',
    maxScore: 22,
    estimatedMinutes: 35,
    examRefs: ['m3-framework', 'm1-login'],
    planDays: ['day-11-1'],
    source: 'plan',
  },

  {
    id: 'task-react-auth-context',
    title: 'Кто вошёл: общие данные для всего приложения',
    kind: 'app',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['react-context'],
    monthNo: 3,
    weekNo: 11,
    statement: `Имя вошедшего нужно шапке, кабинету и админке. Передавать его пропсами через десяток компонентов невозможно: каждый промежуточный компонент будет тащить чужие данные.

Для этого есть контекст — общее хранилище, к которому обращается любой компонент внутри.

1. \`AuthContext\` — контекст, созданный \`React.createContext\`.
2. \`AuthProvider({ children })\` — хранит состояние \`user\` (изначально \`null\`) и отдаёт наружу объект \`{ user, login, logout }\`. Функция \`login(name)\` записывает имя, \`logout()\` сбрасывает в \`null\`.
3. \`Header\` — **не принимает пропсов**. Берёт данные из контекста и выводит в \`#greeting\` либо \`Гость\`, либо имя вошедшего. Рядом кнопка \`#auth-button\`: «Войти» для гостя, «Выйти» для вошедшего.
4. \`App\` — оборачивает \`Header\` в \`AuthProvider\`.

Кнопка «Войти» входит как \`Иванов Илья\`.`,
    requirements: [
      'Контекст создан через React.createContext',
      'AuthProvider хранит состояние и отдаёт user, login и logout',
      'Header не принимает пропсов и берёт данные из контекста',
      'До входа показывается «Гость»',
      'Кнопка входит и выходит, надпись на ней меняется',
    ],
    starterCode: `const AuthContext = React.createContext(null);

function AuthProvider({ children }) {
  // состояние user и функции login/logout
}

function Header() {
  // без пропсов: данные берутся из контекста
}

function App() {
  // Header внутри AuthProvider
}`,
    tests: [
      {
        id: 'context-used',
        name: 'Использован контекст, а не пропсы',
        type: 'react',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(/createContext/.test(source), 'Контекст должен создаваться через React.createContext');
ctx.assert(/useContext/.test(source), 'Данные из контекста читаются через React.useContext');
ctx.assert(
  /function\\s+Header\\s*\\(\\s*\\)/.test(source),
  'Header не должен принимать пропсов: он берёт данные из контекста. Сейчас у него есть параметры',
);`,
        points: 4,
      },
      {
        id: 'guest',
        name: 'До входа — гость',
        type: 'react',
        code: `return ctx.render('App', {}).then(() => {
  const greeting = ctx.text('#greeting');
  ctx.assert(greeting === 'Гость', 'До входа в #greeting должно быть «Гость», сейчас: ' + greeting, 'Гость', greeting);
  const button = ctx.$('#auth-button');
  ctx.assert(button, 'Нет кнопки #auth-button');
  ctx.assert(button.textContent.trim() === 'Войти', 'На кнопке должно быть «Войти», сейчас: ' + button.textContent.trim());
});`,
        points: 4,
      },
      {
        id: 'login',
        name: 'Вход меняет приветствие и кнопку',
        type: 'react',
        code: `return ctx.render('App', {})
  .then(() => {
    // Компонент между проверками не пересоздаётся: если вход уже выполнен, выходим.
    if (ctx.$('#auth-button').textContent.trim() === 'Выйти') return ctx.click('#auth-button');
    return null;
  })
  .then(() => ctx.click('#auth-button'))
  .then(() => {
    ctx.assert(
      ctx.text('#greeting') === 'Иванов Илья',
      'После входа в #greeting должно быть имя «Иванов Илья», сейчас: ' + ctx.text('#greeting'),
    );
    ctx.assert(
      ctx.$('#auth-button').textContent.trim() === 'Выйти',
      'После входа на кнопке должно быть «Выйти», сейчас: ' + ctx.$('#auth-button').textContent.trim(),
    );
  });`,
        points: 5,
      },
      {
        id: 'logout',
        name: 'Выход возвращает гостя',
        type: 'react',
        code: `return ctx.render('App', {})
  .then(() => {
    if (ctx.$('#auth-button').textContent.trim() === 'Войти') return ctx.click('#auth-button');
    return null;
  })
  .then(() => ctx.click('#auth-button'))
  .then(() => {
    ctx.assert(ctx.text('#greeting') === 'Гость', 'После выхода должно снова быть «Гость», сейчас: ' + ctx.text('#greeting'));
    ctx.assert(ctx.$('#auth-button').textContent.trim() === 'Войти', 'После выхода на кнопке должно быть «Войти»');
  });`,
        points: 4,
      },
      {
        id: 'provider-value',
        name: 'Провайдер отдаёт user, login и logout',
        type: 'react',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(/value\\s*=\\s*\\{/.test(source), 'У провайдера должен быть проп value с общими данными');
['user', 'login', 'logout'].forEach((key) => {
  ctx.assert(source.indexOf(key) !== -1, 'В значении контекста не хватает «' + key + '»');
});`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Провайдер оборачивает детей: return <AuthContext.Provider value={…}>{children}</AuthContext.Provider>.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Внутри Header: const { user, login, logout } = React.useContext(AuthContext). Это и есть доступ к общим данным без пропсов.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'В AuthProvider: const [user, setUser] = React.useState(null); const login = (name) => setUser(name); const logout = () => setUser(null); value={{ user, login, logout }}.',
        penaltyPercent: 35,
      },
    ],
    solution: `const AuthContext = React.createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);

  const login = (name) => setUser(name);
  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

function Header() {
  const { user, login, logout } = React.useContext(AuthContext);

  return (
    <header>
      <span id="greeting">{user ? user : 'Гость'}</span>
      <button
        id="auth-button"
        type="button"
        onClick={() => (user ? logout() : login('Иванов Илья'))}
      >
        {user ? 'Выйти' : 'Войти'}
      </button>
    </header>
  );
}

function App() {
  return (
    <AuthProvider>
      <Header />
    </AuthProvider>
  );
}`,
    solutionExplanation:
      'Смысл контекста виден по сигнатуре Header: у него нет параметров. Данные он получает не сверху по цепочке, а напрямую из общего хранилища. В проекте между AuthProvider и Header окажется десяток компонентов — маршрутизатор, раскладка, панель — и ни один из них не будет ничего знать про пользователя. Контекст держит и данные, и функции их изменения: компоненту нужно и прочитать имя, и уметь выйти.',
    maxScore: 20,
    estimatedMinutes: 35,
    examRefs: ['m1-login', 'm1-cabinet', 'm3-framework'],
    planDays: ['day-11-4'],
    source: 'plan',
  },

  {
    id: 'task-react-toast',
    title: 'Уведомление, которое исчезает само',
    kind: 'app',
    runtime: 'react',
    difficulty: 3,
    tech: ['react'],
    topicIds: ['react-toast', 'react-effects'],
    monthNo: 3,
    weekNo: 11,
    statement: `Модуль 2 требует всплывающие уведомления. Уведомление отличается от сообщения на странице тем, что его не нужно закрывать: оно исчезает само.

Компонент \`OrderPage\`:

1. кнопка \`#send\` с текстом «Отправить заявку»;
2. по нажатию появляется блок \`#toast\` с текстом «Заявка отправлена»;
3. через **3 секунды** уведомление исчезает — блока \`#toast\` в разметке больше нет;
4. таймер заводится в \`React.useEffect\` и **обязательно** снимается в функции очистки. Иначе при быстром повторном нажатии старый таймер погасит новое уведомление раньше срока;
5. пока уведомления нет, блока \`#toast\` в разметке тоже нет.`,
    requirements: [
      'Кнопка отправки на месте',
      'После нажатия появляется #toast с нужным текстом',
      'Через 3 секунды уведомление исчезает',
      'Таймер заводится в useEffect и снимается в функции очистки',
      'Пока уведомления нет, блока #toast нет',
    ],
    starterCode: `function OrderPage() {
  // кнопка, состояние уведомления и таймер в useEffect
}`,
    tests: [
      {
        id: 'initial',
        name: 'Сначала уведомления нет',
        type: 'react',
        code: `return ctx.render('OrderPage', {}).then(() => {
  ctx.assert(ctx.$('#send'), 'Нет кнопки #send');
  ctx.assert(!ctx.$('#toast'), 'До нажатия блока #toast быть не должно');
});`,
        points: 3,
      },
      {
        id: 'appears',
        name: 'Нажатие показывает уведомление',
        type: 'react',
        code: `return ctx.render('OrderPage', {})
  .then(() => ctx.click('#send'))
  .then(() => {
    const toast = ctx.$('#toast');
    ctx.assert(toast, 'После нажатия должен появиться блок #toast');
    ctx.assert(
      toast.textContent.trim() === 'Заявка отправлена',
      'Текст уведомления должен быть «Заявка отправлена», сейчас: ' + toast.textContent.trim(),
    );
  });`,
        points: 4,
      },
      {
        id: 'disappears',
        name: 'Через 3 секунды уведомление исчезает',
        type: 'react',
        code: `return ctx.render('OrderPage', {})
  .then(() => ctx.click('#send'))
  .then(() => ctx.advanceTime(1000))
  .then(() => {
    ctx.assert(ctx.$('#toast'), 'Через секунду уведомление ещё должно быть на экране');
  })
  .then(() => ctx.advanceTime(2600))
  .then(() => {
    ctx.assert(!ctx.$('#toast'), 'Через 3 секунды уведомление должно исчезнуть');
  });`,
        points: 5,
      },
      {
        id: 'effect-cleanup',
        name: 'Таймер снимается',
        type: 'react',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(/useEffect/.test(source), 'Таймер должен заводиться в React.useEffect');
ctx.assert(/setTimeout/.test(source), 'Не найден setTimeout');
ctx.assert(
  /clearTimeout/.test(source),
  'Эффект должен возвращать функцию очистки с clearTimeout: иначе таймеры накопятся и погасят новое уведомление раньше срока',
);
ctx.assert(
  /return\\s*\\(\\s*\\)\\s*=>|return\\s+function/.test(source),
  'Функция очистки возвращается из useEffect: return () => clearTimeout(timer)',
);`,
        points: 4,
      },
      {
        id: 'repeat',
        name: 'Повторное нажатие снова показывает уведомление',
        type: 'react',
        code: `return ctx.render('OrderPage', {})
  .then(() => ctx.click('#send'))
  .then(() => ctx.advanceTime(3400))
  .then(() => {
    ctx.assert(!ctx.$('#toast'), 'Перед повторным нажатием уведомления быть не должно');
  })
  .then(() => ctx.click('#send'))
  .then(() => {
    ctx.assert(ctx.$('#toast'), 'После повторного нажатия уведомление должно появиться снова');
  });`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Состояние здесь логическое: показывать уведомление или нет. Кнопка ставит true, таймер возвращает false.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Эффект должен зависеть от состояния: React.useEffect(() => { … }, [visible]). Внутри — проверка, что показывать нечего, и ранний выход.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'React.useEffect(() => { if (!visible) return; const timer = setTimeout(() => setVisible(false), 3000); return () => clearTimeout(timer); }, [visible]);',
        penaltyPercent: 35,
      },
    ],
    solution: `function OrderPage() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <div>
      <button id="send" type="button" onClick={() => setVisible(true)}>
        Отправить заявку
      </button>

      {visible ? <div id="toast">Заявка отправлена</div> : null}
    </div>
  );
}`,
    solutionExplanation:
      'Функция очистки — не формальность. Эффект перезапускается при каждом изменении visible, и без clearTimeout старые таймеры продолжают жить: через три секунды после первого нажатия сработает первый таймер и погасит уведомление, которое пользователь вызвал секунду назад. Ранний выход if (!visible) return не даёт заводить таймер, когда гасить нечего. Уведомление рисуется по условию, а не прячется стилями: в разметке его действительно нет, и программа чтения с экрана не прочитает невидимый текст.',
    maxScore: 20,
    estimatedMinutes: 25,
    examRefs: ['m2-admin-tools', 'm3-animations'],
    planDays: ['day-11-6'],
    source: 'plan',
  },

  {
    id: 'task-project-types-and-mocks',
    title: 'Порядок в проекте: типы данных и тестовые данные',
    kind: 'function',
    runtime: 'ts',
    difficulty: 3,
    tech: ['ts', 'react'],
    topicIds: ['react-structure'],
    monthNo: 3,
    weekNo: 12,
    statement: `Перед сборкой приложения описывают данные. Дальше редактор подсказывает поля, а опечатка в имени поля становится ошибкой ещё до запуска.

В проекте это файлы \`src/types/index.ts\` и \`src/mocks/applications.ts\`. Здесь — один файл, но те же описания.

1. Тип \`Status\` — одно из трёх значений: \`'Новая'\`, \`'Мероприятие назначено'\`, \`'Мероприятие завершено'\`. Не \`string\`: статус может быть только этим.
2. Тип \`Application\` — поля \`id: number\`, \`room: string\`, \`date: string\`, \`price: number\`, \`status: Status\`.
3. Массив \`mockApplications: Application[]\` — не меньше четырёх заявок, среди них все три статуса.
4. \`byStatus(items: Application[], status: Status): Application[]\` — отбирает заявки нужного статуса.
5. \`totalPrice(items: Application[]): number\` — сумма поля \`price\`.
6. \`canLeaveReview(item: Application): boolean\` — отзыв можно оставить, только если статус уже не «Новая». Это правило из задания демоэкзамена.`,
    requirements: [
      'Тип Status перечисляет три допустимых значения',
      'Тип Application описан со всеми пятью полями',
      'В mockApplications не меньше четырёх заявок и встречаются все три статуса',
      'byStatus отбирает заявки по статусу',
      'totalPrice считает сумму',
      'canLeaveReview разрешает отзыв для всех статусов, кроме «Новая»',
    ],
    starterCode: `// 1-2. Типы Status и Application

// 3. Тестовые данные

// 4-6. Функции byStatus, totalPrice, canLeaveReview
`,
    tests: [
      {
        id: 'status-type',
        name: 'Статус описан перечислением значений',
        type: 'assert',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(/type\\s+Status\\s*=/.test(source), 'Не найден тип Status');
ctx.assert(source.indexOf("'Новая'") !== -1 || source.indexOf('"Новая"') !== -1, 'В типе Status нет значения «Новая»');
ctx.assert(
  source.indexOf('Мероприятие назначено') !== -1 && source.indexOf('Мероприятие завершено') !== -1,
  'В типе Status перечислены не все три значения',
);
ctx.assert(
  !/type\\s+Status\\s*=\\s*string/.test(source),
  'Status не должен быть просто string: тогда опечатка в статусе перестанет быть ошибкой',
);`,
        points: 4,
      },
      {
        id: 'application-type',
        name: 'Тип заявки описан',
        type: 'assert',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(/(interface|type)\\s+Application/.test(source), 'Не найден тип Application');
['id', 'room', 'date', 'price', 'status'].forEach((field) => {
  ctx.assert(source.indexOf(field) !== -1, 'В типе Application не хватает поля «' + field + '»');
});
ctx.assert(/status\\s*:\\s*Status/.test(source), 'Поле status должно иметь тип Status, а не string');`,
        points: 3,
      },
      {
        id: 'mocks',
        name: 'Тестовые данные заполнены',
        type: 'assert',
        code: `const items = ctx.get('mockApplications');
ctx.assert(Array.isArray(items), 'mockApplications должен быть массивом');
ctx.assert(items.length >= 4, 'Заявок должно быть не меньше четырёх, сейчас: ' + items.length, 4, items.length);
const statuses = items.map((item) => item.status);
['Новая', 'Мероприятие назначено', 'Мероприятие завершено'].forEach((status) => {
  ctx.assert(statuses.indexOf(status) !== -1, 'Среди тестовых заявок нет статуса «' + status + '»');
});
items.forEach((item) => {
  ctx.assert(typeof item.id === 'number', 'У заявки id должен быть числом');
  ctx.assert(typeof item.price === 'number', 'У заявки price должен быть числом');
  ctx.assert(/^\\d{2}\\.\\d{2}\\.\\d{4}$/.test(item.date), 'Дата должна быть в формате ДД.ММ.ГГГГ, сейчас: ' + item.date);
});`,
        points: 4,
      },
      {
        id: 'by-status',
        name: 'byStatus отбирает по статусу',
        type: 'assert',
        code: `const byStatus = ctx.get('byStatus');
const items = [
  { id: 1, room: 'Коворкинг', date: '12.03.2027', price: 1500, status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '05.02.2027', price: 2500, status: 'Мероприятие завершено' },
  { id: 3, room: 'Аудитория', date: '28.01.2027', price: 5000, status: 'Новая' },
];
const result = byStatus(items, 'Новая');
ctx.assert(result.length === 2, 'Должно найтись две новых заявки, найдено: ' + result.length, 2, result.length);
ctx.assert(byStatus(items, 'Мероприятие назначено').length === 0, 'Для отсутствующего статуса нужен пустой массив');`,
        points: 3,
      },
      {
        id: 'total',
        name: 'totalPrice считает сумму',
        type: 'assert',
        code: `const totalPrice = ctx.get('totalPrice');
const items = [
  { id: 1, room: 'Коворкинг', date: '12.03.2027', price: 1500, status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '05.02.2027', price: 2500, status: 'Новая' },
];
ctx.assert(totalPrice(items) === 4000, 'Ожидалось 4000, получено: ' + totalPrice(items), 4000, totalPrice(items));
ctx.assert(totalPrice([]) === 0, 'Для пустого массива сумма равна нулю');`,
        points: 2,
      },
      {
        id: 'review-rule',
        name: 'Правило отзыва из задания экзамена',
        type: 'assert',
        code: `const canLeaveReview = ctx.get('canLeaveReview');
ctx.assert(
  canLeaveReview({ id: 1, room: 'А', date: '01.01.2027', price: 100, status: 'Новая' }) === false,
  'По заявке со статусом «Новая» отзыв оставить нельзя',
);
ctx.assert(
  canLeaveReview({ id: 2, room: 'А', date: '01.01.2027', price: 100, status: 'Мероприятие назначено' }) === true,
  'После смены статуса отзыв разрешён',
);
ctx.assert(
  canLeaveReview({ id: 3, room: 'А', date: '01.01.2027', price: 100, status: 'Мероприятие завершено' }) === true,
  'По завершённому мероприятию отзыв разрешён',
);`,
        points: 3,
      },
      {
        id: 'annotations',
        name: 'Типы расставлены',
        type: 'assert',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(/mockApplications\\s*:\\s*Application\\[\\]/.test(source), 'У mockApplications должен быть тип Application[]');
ctx.assert(
  /byStatus\\s*\\([^)]*Application\\[\\][^)]*\\)\\s*:\\s*Application\\[\\]/.test(source),
  'У byStatus нужны типы параметров и результата',
);
ctx.assert(/totalPrice\\s*\\([^)]*\\)\\s*:\\s*number/.test(source), 'У totalPrice результат должен быть number');
ctx.assert(/canLeaveReview\\s*\\([^)]*\\)\\s*:\\s*boolean/.test(source), 'У canLeaveReview результат должен быть boolean');
ctx.assert(!/:\\s*any\\b/.test(source), 'Тип any использовать нельзя');`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Перечисление допустимых строк записывается через вертикальную черту: type Status = "Новая" | "Мероприятие назначено" | "Мероприятие завершено".',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Массив объектов типизируется так: const mockApplications: Application[] = [...]. После этого редактор начнёт ругаться на опечатку в имени поля.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'function byStatus(items: Application[], status: Status): Application[] { return items.filter((item) => item.status === status); } и canLeaveReview(item: Application): boolean { return item.status !== "Новая"; }',
        penaltyPercent: 35,
      },
    ],
    solution: `type Status = 'Новая' | 'Мероприятие назначено' | 'Мероприятие завершено';

interface Application {
  id: number;
  room: string;
  date: string;
  price: number;
  status: Status;
}

const mockApplications: Application[] = [
  { id: 1, room: 'Аудитория на 100 мест', date: '12.03.2027', price: 5000, status: 'Новая' },
  { id: 2, room: 'Коворкинг', date: '05.02.2027', price: 1500, status: 'Мероприятие назначено' },
  { id: 3, room: 'Кинозал', date: '28.01.2027', price: 2500, status: 'Мероприятие завершено' },
  { id: 4, room: 'Коворкинг', date: '19.04.2027', price: 1500, status: 'Новая' },
];

function byStatus(items: Application[], status: Status): Application[] {
  return items.filter((item) => item.status === status);
}

function totalPrice(items: Application[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

function canLeaveReview(item: Application): boolean {
  return item.status !== 'Новая';
}`,
    solutionExplanation:
      'Status перечисляет конкретные строки, а не является типом string — в этом вся польза. Опечатка «Мероприятие завершенно» перестанет компилироваться, а byStatus(items, "Отклонена") подчеркнётся красным ещё в редакторе. Если бы статус был обычной строкой, ошибка дожила бы до экзамена и проявилась как «фильтр ничего не находит». Правило отзыва вынесено в отдельную функцию, а не написано внутри компонента: оно понадобится и в кабинете, и в админке, и менять его придётся в одном месте.',
    maxScore: 23,
    estimatedMinutes: 30,
    examRefs: ['m1-cabinet', 'm2-cabinet-ux', 'm3-quality'],
    planDays: ['day-12-1'],
    source: 'plan',
  },

  {
    id: 'task-react-cabinet-review',
    title: 'Кабинет: отзыв только после смены статуса',
    kind: 'app',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['react-lists', 'react-conditional', 'react-forms'],
    monthNo: 3,
    weekNo: 12,
    statement: `Задание демоэкзамена описывает кабинет так: пользователь видит свои заявки, а оставить отзыв может только после того, как статус заявки изменился — то есть когда он уже не «Новая».

Компонент \`Cabinet\` принимает проп \`applications\` — массив \`{ id, room, date, status }\`.

1. Каждая заявка — \`<article class="card">\` с помещением, датой и статусом.
2. У заявки со статусом, отличным от «Новая», внутри карточки есть форма отзыва: поле \`textarea\` и кнопка «Оставить отзыв».
3. У заявки со статусом «Новая» формы нет, вместо неё текст «Отзыв можно оставить после смены статуса».
4. После отправки отзыва в этой карточке появляется текст «Спасибо за отзыв», а форма исчезает. Отзыв по одной заявке не должен влиять на другие.
5. Пустой отзыв не принимается: форма остаётся, появляется текст «Напишите отзыв».`,
    requirements: [
      'Каждая заявка выводится карточкой с помещением, датой и статусом',
      'Форма отзыва есть только у заявок не со статусом «Новая»',
      'У новой заявки выводится объяснение вместо формы',
      'Отправленный отзыв заменяет форму благодарностью',
      'Отзыв по одной заявке не влияет на другие',
      'Пустой отзыв не принимается',
    ],
    starterCode: `function Cabinet({ applications }) {
  // карточки заявок и форма отзыва по правилу задания
}`,
    tests: [
      {
        id: 'cards',
        name: 'Заявки выводятся карточками',
        type: 'react',
        code: `const applications = [
  { id: 1, room: 'Коворкинг', date: '12.03.2027', status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '05.02.2027', status: 'Мероприятие завершено' },
];
return ctx.render('Cabinet', { applications }).then(() => {
  const cards = ctx.$$('.card');
  ctx.assert(cards.length === 2, 'Карточек должно быть две, найдено: ' + cards.length, 2, cards.length);
  const text = ctx.text();
  ctx.assert(text.indexOf('Коворкинг') !== -1, 'В кабинете нет помещения «Коворкинг»');
  ctx.assert(text.indexOf('12.03.2027') !== -1, 'В карточке нет даты');
  ctx.assert(text.indexOf('Мероприятие завершено') !== -1, 'В карточке нет статуса');
});`,
        points: 3,
      },
      {
        id: 'no-form-for-new',
        name: 'У новой заявки формы нет',
        type: 'react',
        code: `const applications = [{ id: 1, room: 'Коворкинг', date: '12.03.2027', status: 'Новая' }];
return ctx.render('Cabinet', { applications }).then(() => {
  ctx.assert(!ctx.$('textarea'), 'У заявки со статусом «Новая» формы отзыва быть не должно');
  ctx.assert(
    ctx.text().indexOf('Отзыв можно оставить после смены статуса') !== -1,
    'Вместо формы нужно объяснить, почему отзыв недоступен',
  );
});`,
        points: 4,
      },
      {
        id: 'form-for-changed',
        name: 'После смены статуса форма появляется',
        type: 'react',
        code: `const applications = [{ id: 2, room: 'Кинозал', date: '05.02.2027', status: 'Мероприятие назначено' }];
return ctx.render('Cabinet', { applications }).then(() => {
  ctx.assert(ctx.$('textarea'), 'У заявки с изменённым статусом должна быть форма отзыва');
  const button = ctx.$$('button').filter((b) => /отзыв/i.test(b.textContent))[0];
  ctx.assert(button, 'Нет кнопки «Оставить отзыв»');
});`,
        points: 4,
      },
      {
        id: 'submit-review',
        name: 'Отзыв принимается и заменяет форму',
        type: 'react',
        code: `const applications = [{ id: 2, room: 'Кинозал', date: '05.02.2027', status: 'Мероприятие завершено' }];
return ctx.render('Cabinet', { applications })
  .then(() => ctx.change('textarea', 'Всё прошло отлично'))
  .then(() => ctx.click(ctx.$$('button').filter((b) => /отзыв/i.test(b.textContent))[0]))
  .then(() => {
    ctx.assert(ctx.text().indexOf('Спасибо за отзыв') !== -1, 'После отправки должна появиться благодарность');
    ctx.assert(!ctx.$('textarea'), 'После отправки форма отзыва должна исчезнуть');
  });`,
        points: 5,
      },
      {
        id: 'empty-review',
        name: 'Пустой отзыв не принимается',
        type: 'react',
        code: `const applications = [{ id: 3, room: 'Аудитория', date: '01.04.2027', status: 'Мероприятие завершено' }];
return ctx.render('Cabinet', { applications })
  .then(() => ctx.click(ctx.$$('button').filter((b) => /отзыв/i.test(b.textContent))[0]))
  .then(() => {
    ctx.assert(ctx.text().indexOf('Напишите отзыв') !== -1, 'Пустой отзыв должен давать сообщение «Напишите отзыв»');
    ctx.assert(ctx.$('textarea'), 'После неудачной отправки форма должна остаться');
    ctx.assert(ctx.text().indexOf('Спасибо за отзыв') === -1, 'Пустой отзыв не должен считаться отправленным');
  });`,
        points: 4,
      },
      {
        id: 'independent',
        name: 'Отзывы по заявкам не путаются',
        type: 'react',
        code: `const applications = [
  { id: 10, room: 'Кинозал', date: '05.02.2027', status: 'Мероприятие завершено' },
  { id: 11, room: 'Коворкинг', date: '06.02.2027', status: 'Мероприятие завершено' },
];
return ctx.render('Cabinet', { applications })
  .then(() => ctx.change(ctx.$$('textarea')[0], 'Отзыв по первой заявке'))
  .then(() => ctx.click(ctx.$$('button').filter((b) => /отзыв/i.test(b.textContent))[0]))
  .then(() => {
    ctx.assert(ctx.$$('textarea').length === 1, 'Отзыв по одной заявке не должен убирать форму у второй');
    const cards = ctx.$$('.card');
    ctx.assert(cards[0].textContent.indexOf('Спасибо за отзыв') !== -1, 'Благодарность должна быть в первой карточке');
    ctx.assert(cards[1].textContent.indexOf('Спасибо за отзыв') === -1, 'Во второй карточке благодарности быть не должно');
  });`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Отзывы удобно хранить одним объектом: ключ — id заявки, значение — текст отзыва. Тогда карточки не перепутаются.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Черновики полей тоже храните по id: { 10: "текст", 11: "" }. Один textarea на карточку, но состояние общее.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const [reviews, setReviews] = React.useState({}); const [drafts, setDrafts] = React.useState({}); в карточке: {reviews[item.id] ? <p>Спасибо за отзыв</p> : item.status === "Новая" ? <p>Отзыв можно оставить после смены статуса</p> : <форма/>}',
        penaltyPercent: 35,
      },
    ],
    solution: `function Cabinet({ applications }) {
  const [drafts, setDrafts] = React.useState({});
  const [reviews, setReviews] = React.useState({});
  const [errors, setErrors] = React.useState({});

  const handleSubmit = (id) => {
    const text = (drafts[id] || '').trim();

    if (!text) {
      setErrors((prev) => ({ ...prev, [id]: 'Напишите отзыв' }));
      return;
    }

    setReviews((prev) => ({ ...prev, [id]: text }));
    setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  return (
    <div>
      {applications.map((item) => (
        <article className="card" key={item.id}>
          <h3>{item.room}</h3>
          <p>{item.date}</p>
          <p>{item.status}</p>

          {reviews[item.id] ? (
            <p>Спасибо за отзыв</p>
          ) : item.status === 'Новая' ? (
            <p>Отзыв можно оставить после смены статуса</p>
          ) : (
            <div>
              <textarea
                value={drafts[item.id] || ''}
                onChange={(event) => setDrafts((prev) => ({ ...prev, [item.id]: event.target.value }))}
              />
              <button type="button" onClick={() => handleSubmit(item.id)}>
                Оставить отзыв
              </button>
              {errors[item.id] ? <p>{errors[item.id]}</p> : null}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}`,
    solutionExplanation:
      'Состояние хранится объектами с ключом по id заявки, а не одной переменной. Это ровно та ошибка, которая ломает кабинет: если держать один текст отзыва на весь список, ввод в одной карточке появится во всех сразу. Порядок проверок тоже не случаен: сначала «отзыв уже оставлен», потом «статус Новая», и только затем форма. Правило доступности отзыва взято из задания демоэкзамена: возможность оставить отзыв появляется после смены статуса заявки.',
    maxScore: 25,
    estimatedMinutes: 45,
    examRefs: ['m1-cabinet', 'm2-cabinet-ux'],
    planDays: ['day-12-2'],
    source: 'plan',
  },

  {
    id: 'task-mobile-fix-390',
    title: 'Проверка на 390 × 844: найти и убрать всё, что уехало',
    kind: 'fix-bug',
    runtime: 'dom',
    difficulty: 3,
    tech: ['css', 'html'],
    topicIds: ['css-responsive'],
    monthNo: 3,
    weekNo: 12,
    statement: `Страница кабинета собрана и на ноутбуке выглядит прилично. На экране 390 × 844 — том самом, что указан в задании демоэкзамена, — она уезжает вбок.

Причин четыре, и все они типовые:

1. у обёртки задана жёсткая ширина в пикселях вместо ограничения сверху;
2. картинка выводится в своём натуральном размере;
3. длинный адрес электронной почты не переносится и растягивает карточку;
4. широкая таблица не помещается и тянет за собой всю страницу.

Исправьте стили так, чтобы горизонтальной прокрутки не было, а таблица прокручивалась внутри своего блока \`.table-wrap\`. Разметку менять не нужно.`,
    requirements: [
      'Горизонтальной прокрутки на 390px нет',
      'Обёртка ограничена сверху, а не жёсткой шириной',
      'Изображение не шире своего контейнера',
      'Длинный адрес переносится',
      'Таблица прокручивается внутри .table-wrap',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, sans-serif; background: #f8fafc; }

    .wrap {
      width: 600px;          /* 1. жёсткая ширина */
      margin: 0 auto;
      padding: 16px;
    }

    .card {
      padding: 12px;
      margin-bottom: 12px;
      background: #fff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
    }

    /* 2. картинка в натуральном размере */

    /* 3. длинный адрес не переносится */

    /* 4. таблица не помещается */

    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px 12px; border: 1px solid #cbd5e1; white-space: nowrap; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Личный кабинет</h1>

    <div class="card">
      <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='900' height='300'><rect width='900' height='300' fill='%232563eb'/></svg>" alt="Аудитория">
      <p class="email">ivanov.ilya.sergeevich.2027@konferencii-rf-example.ru</p>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>№</th><th>Помещение</th><th>Дата</th><th>Оплата</th><th>Статус</th></tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>Аудитория на 100 мест</td><td>12.03.2027</td><td>Картой</td><td>Новая</td></tr>
          <tr><td>2</td><td>Коворкинг</td><td>05.02.2027</td><td>Наличными</td><td>Выполнена</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`,
    viewport: { width: 390, height: 844 },
    tests: [
      {
        id: 'no-scroll',
        name: 'Горизонтальной прокрутки нет',
        type: 'dom',
        code: `const root = ctx.document.documentElement;
ctx.assert(
  root.scrollWidth <= root.clientWidth + 1,
  'Страница всё ещё уезжает вбок: ширина содержимого ' + root.scrollWidth + 'px при экране ' + root.clientWidth + 'px',
);`,
        points: 4,
      },
      {
        id: 'wrap-width',
        name: 'Обёртка ограничена сверху',
        type: 'dom',
        code: `const wrap = ctx.$('.wrap');
const width = wrap.getBoundingClientRect().width;
ctx.assert(width <= 390, 'Обёртка шире экрана: ' + Math.round(width) + 'px');
const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(
  /max-width\\s*:/.test(source),
  'Вместо жёсткой ширины нужно ограничение сверху: max-width. Тогда на широком экране обёртка останется 600px, а на узком сожмётся',
);`,
        points: 3,
      },
      {
        id: 'image',
        name: 'Картинка помещается',
        type: 'dom',
        code: `const img = ctx.$('img');
const card = ctx.$('.card');
ctx.assert(
  img.getBoundingClientRect().width <= card.getBoundingClientRect().width + 1,
  'Изображение шире карточки: ' + Math.round(img.getBoundingClientRect().width) + 'px. Нужен max-width: 100%',
);`,
        points: 3,
      },
      {
        id: 'email',
        name: 'Длинный адрес переносится',
        type: 'dom',
        code: `const email = ctx.$('.email');
const card = ctx.$('.card');
ctx.assert(
  email.scrollWidth <= card.clientWidth + 1,
  'Адрес не переносится и растягивает карточку. Помогает overflow-wrap: anywhere или word-break: break-all',
);`,
        points: 3,
      },
      {
        id: 'table-scroll',
        name: 'Таблица прокручивается внутри своего блока',
        type: 'dom',
        code: `const wrapper = ctx.$('.table-wrap');
ctx.assert(wrapper, 'Блок .table-wrap пропал');
const overflow = ctx.css(wrapper, 'overflow-x');
ctx.assert(
  overflow === 'auto' || overflow === 'scroll',
  'У .table-wrap нужен overflow-x: auto, сейчас: ' + overflow,
  'auto',
  overflow,
);
ctx.assert(
  wrapper.getBoundingClientRect().width <= 390,
  'Сам блок .table-wrap шире экрана: прокручиваться должно его содержимое, а не страница',
);
ctx.assert(
  ctx.$('table').scrollWidth > wrapper.clientWidth,
  'Таблица должна остаться широкой и прокручиваться — сжимать её в нечитаемую кашу не нужно',
);`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Начните с панели разработчика: включите режим телефона и по очереди скрывайте блоки, пока прокрутка не исчезнет. Последний скрытый блок и есть виновник.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Блоку с прокруткой внутри flex- или grid-родителя нужен ещё min-width: 0 — без него он раздувается до ширины содержимого, и overflow-x не срабатывает.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: '.wrap { max-width: 600px; width: 100%; } img { max-width: 100%; height: auto; } .email { overflow-wrap: anywhere; } .table-wrap { max-width: 100%; overflow-x: auto; }',
        penaltyPercent: 35,
      },
    ],
    solution: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, sans-serif; background: #f8fafc; }

    .wrap {
      max-width: 600px;
      width: 100%;
      margin: 0 auto;
      padding: 16px;
    }

    .card {
      padding: 12px;
      margin-bottom: 12px;
      background: #fff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
    }

    .card img {
      display: block;
      max-width: 100%;
      height: auto;
    }

    .email {
      overflow-wrap: anywhere;
    }

    .table-wrap {
      max-width: 100%;
      min-width: 0;
      overflow-x: auto;
    }

    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px 12px; border: 1px solid #cbd5e1; white-space: nowrap; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Личный кабинет</h1>

    <div class="card">
      <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='900' height='300'><rect width='900' height='300' fill='%232563eb'/></svg>" alt="Аудитория">
      <p class="email">ivanov.ilya.sergeevich.2027@konferencii-rf-example.ru</p>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>№</th><th>Помещение</th><th>Дата</th><th>Оплата</th><th>Статус</th></tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>Аудитория на 100 мест</td><td>12.03.2027</td><td>Картой</td><td>Новая</td></tr>
          <tr><td>2</td><td>Коворкинг</td><td>05.02.2027</td><td>Наличными</td><td>Выполнена</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`,
    solutionExplanation:
      'Разница между width: 600px и max-width: 600px в том, что первое — это приказ, а второе — потолок. На широком экране результат одинаков, на узком первое заставляет страницу прокручиваться. Таблицу не сжимают, а прокручивают: пять колонок на 390 пикселей превратятся в нечитаемые обрывки слов. Пара height: auto к max-width у картинки обязательна — иначе браузер сохранит исходную высоту и изображение сплющится.',
    maxScore: 17,
    estimatedMinutes: 30,
    examRefs: ['m2-mobile', 'm3-mobile', 'm2-design'],
    planDays: ['day-12-5'],
    source: 'plan',
  },

  {
    id: 'task-commit-history-lint',
    title: 'Порядок в истории: разбор подписей коммитов',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['git', 'js'],
    topicIds: ['react-structure'],
    monthNo: 3,
    weekNo: 12,
    statement: `Промежуточные коммиты — требование всех трёх модулей демоэкзамена, и оценивает их человек. История вида «фикс», «ещё правки», «work» не показывает ход работы.

Напишите разбор истории: он пригодится, чтобы перед сдачей посмотреть на свои коммиты чужими глазами.

1. \`isGoodMessage(message)\` — подпись считается хорошей, если:
   - длина не меньше 10 символов;
   - начинается с заглавной буквы;
   - не заканчивается точкой;
   - это не заглушка из списка \`'фикс'\`, \`'правки'\`, \`'тест'\`, \`'wip'\`, \`'update'\`, \`'фиксы'\` (сравнение без учёта регистра).
2. \`reviewHistory(commits)\` — принимает массив строк, возвращает объект \`{ good: [...], bad: [...] }\` с подписями, разложенными по двум спискам. Порядок внутри списков сохраняется.
3. \`worstFirst(commits)\` — возвращает плохие подписи, отсортированные по длине от короткой к длинной: самые бессмысленные окажутся сверху.`,
    requirements: [
      'isGoodMessage проверяет длину, заглавную букву, точку в конце и заглушки',
      'reviewHistory раскладывает подписи по двум спискам',
      'Порядок подписей внутри списков сохраняется',
      'worstFirst сортирует плохие подписи по длине',
      'Исходный массив не изменяется',
    ],
    starterCode: `function isGoodMessage(message) {
  // длина, заглавная буква, точка в конце, заглушки
}

function reviewHistory(commits) {
  // { good: [...], bad: [...] }
}

function worstFirst(commits) {
  // плохие подписи, от короткой к длинной
}`,
    tests: [
      {
        id: 'good',
        name: 'Нормальная подпись проходит',
        type: 'call',
        entry: 'isGoodMessage',
        args: ['Добавить валидацию формы регистрации'],
        expected: true,
      },
      {
        id: 'too-short',
        name: 'Короткая подпись не проходит',
        type: 'call',
        entry: 'isGoodMessage',
        args: ['Правка'],
        expected: false,
        points: 2,
      },
      {
        id: 'lowercase',
        name: 'Подпись со строчной буквы не проходит',
        type: 'call',
        entry: 'isGoodMessage',
        args: ['добавить валидацию формы'],
        expected: false,
        points: 2,
      },
      {
        id: 'trailing-dot',
        name: 'Точка в конце не проходит',
        type: 'call',
        entry: 'isGoodMessage',
        args: ['Добавить валидацию формы.'],
        expected: false,
        points: 2,
      },
      {
        id: 'placeholder',
        name: 'Заглушка не проходит независимо от регистра',
        type: 'assert',
        code: `const isGoodMessage = ctx.get('isGoodMessage');
ctx.assert(isGoodMessage('Фикс') === false, 'Заглушка «Фикс» не должна проходить');
ctx.assert(isGoodMessage('WIP') === false, 'Заглушка «WIP» не должна проходить');
ctx.assert(isGoodMessage('Update') === false, 'Заглушка «Update» не должна проходить');`,
        points: 3,
      },
      {
        id: 'review',
        name: 'reviewHistory раскладывает по спискам',
        type: 'call',
        entry: 'reviewHistory',
        args: [['Добавить каркас страницы входа', 'фикс', 'Связать формы ссылками', 'WIP']],
        expected: {
          good: ['Добавить каркас страницы входа', 'Связать формы ссылками'],
          bad: ['фикс', 'WIP'],
        },
        compare: 'deep',
        points: 4,
      },
      {
        id: 'review-empty',
        name: 'Пустая история даёт два пустых списка',
        type: 'call',
        entry: 'reviewHistory',
        args: [[]],
        expected: { good: [], bad: [] },
        compare: 'deep',
        points: 2,
      },
      {
        id: 'worst',
        name: 'worstFirst сортирует от короткой к длинной',
        type: 'call',
        entry: 'worstFirst',
        args: [['Добавить каркас страницы входа', 'правки по отзыву', 'фикс', 'ещё немного правок']],
        expected: ['фикс', 'правки по отзыву', 'ещё немного правок'],
        compare: 'deep',
        points: 4,
      },
      {
        id: 'pure',
        name: 'Исходный массив не меняется',
        type: 'assert',
        code: `const worstFirst = ctx.get('worstFirst');
const commits = ['фикс', 'Добавить каркас страницы входа', 'правки'];
const copy = commits.slice();
worstFirst(commits);
ctx.assert(
  commits.join('|') === copy.join('|'),
  'Исходный массив изменился. Метод sort сортирует на месте — перед ним нужна копия: commits.slice() или [...commits]',
);`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Заглавную букву проще всего проверить сравнением: message[0] === message[0].toUpperCase() и при этом отличается от строчной.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Список заглушек сравнивайте в нижнем регистре: PLACEHOLDERS.includes(message.trim().toLowerCase()).',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'worstFirst: return commits.filter((m) => !isGoodMessage(m)).slice().sort((a, b) => a.length - b.length); — slice обязателен, иначе sort перевернёт исходный массив.',
        penaltyPercent: 35,
      },
    ],
    solution: `const PLACEHOLDERS = ['фикс', 'фиксы', 'правки', 'тест', 'wip', 'update'];

function isGoodMessage(message) {
  const text = String(message).trim();

  if (text.length < 10) return false;
  if (PLACEHOLDERS.indexOf(text.toLowerCase()) !== -1) return false;
  if (text.endsWith('.')) return false;

  const first = text[0];
  if (first !== first.toUpperCase() || first === first.toLowerCase()) return false;

  return true;
}

function reviewHistory(commits) {
  const good = [];
  const bad = [];

  for (const message of commits) {
    if (isGoodMessage(message)) {
      good.push(message);
    } else {
      bad.push(message);
    }
  }

  return { good, bad };
}

function worstFirst(commits) {
  return commits
    .filter((message) => !isGoodMessage(message))
    .slice()
    .sort((a, b) => a.length - b.length);
}`,
    solutionExplanation:
      'Проверка заглавной буквы двойная: first !== first.toUpperCase() отсекает строчные, а first === first.toLowerCase() отсекает символы без регистра — цифры, скобки, эмодзи. Подпись «1 добавил форму» не пройдёт, и это правильно. В worstFirst стоит slice, хотя filter и так возвращает новый массив: привычка ставить копию перед sort спасает в тот день, когда filter из цепочки уберут. Сам разбор — не формальность: перед сдачей модуля полезно прогнать по нему свою историю, потому что смотреть на неё будет человек.',
    maxScore: 23,
    estimatedMinutes: 30,
    examRefs: ['m1-git', 'm2-git', 'm3-git'],
    planDays: ['day-12-6'],
    source: 'plan',
  },
];
