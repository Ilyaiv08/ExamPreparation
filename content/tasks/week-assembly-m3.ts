import type { Task } from '../types';

/** Сборки недель 9-12: React от первых компонентов до фронтенда целиком. */
export const WEEK_ASSEMBLY_M3: Task[] = [
  {
    id: 'task-week-09-assembly',
    title: 'Сборка недели 9: список заявок с фильтром за 30 минут',
    kind: 'app',
    runtime: 'react',
    difficulty: 3,
    tech: ['react'],
    topicIds: ['react-basics', 'react-props', 'react-lists', 'react-conditional', 'react-state'],
    monthNo: 3,
    weekNo: 9,
    statement: `Первая неделя React закончилась. Соберите за **30 минут** то, из чего состоит любой экран приложения: данные, список, фильтр, пустое состояние.

Компонент \`ApplicationsPage\` принимает проп \`applications\` — массив \`{ id, room, date, status }\`.

1. **дни 3–4** — карточки строятся из массива, у каждой \`key\` по \`id\`. Карточка — отдельный компонент \`ApplicationCard\`, принимающий заявку пропсом.
2. **день 5** — выпадающий список \`#filter\` со статусами: пустое значение «Все», затем «Новая», «Мероприятие назначено», «Мероприятие завершено». Выбор фильтрует список.
3. **день 4** — если после фильтрации ничего не осталось, вместо списка выводится \`<p>\` с текстом «Заявок с таким статусом нет».
4. Счётчик \`#count\` показывает, сколько заявок сейчас видно.`,
    requirements: [
      'Карточка вынесена в отдельный компонент ApplicationCard',
      'Список строится из массива с key по id',
      'Фильтр по статусу работает',
      'Пустой результат даёт сообщение вместо списка',
      'Счётчик показывает количество видимых заявок',
    ],
    starterCode: `function ApplicationCard({ application }) {
  // одна карточка
}

function ApplicationsPage({ applications }) {
  // фильтр, счётчик и список карточек
}`,
    tests: [
      {
        id: 'cards',
        name: 'Заявки выводятся карточками',
        type: 'react',
        code: `const applications = [
  { id: 1, room: 'Коворкинг', date: '12.03.2027', status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '05.02.2027', status: 'Мероприятие завершено' },
  { id: 3, room: 'Аудитория', date: '28.01.2027', status: 'Новая' },
];
return ctx.render('ApplicationsPage', { applications }).then(() => {
  const text = ctx.text();
  ['Коворкинг', 'Кинозал', 'Аудитория'].forEach((room) => {
    ctx.assert(text.indexOf(room) !== -1, 'На странице нет заявки «' + room + '»');
  });
  ctx.assert(text.indexOf('12.03.2027') !== -1, 'В карточке нет даты');
});`,
        points: 3,
      },
      {
        id: 'separate-component',
        name: 'Карточка вынесена в свой компонент',
        type: 'react',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(/<ApplicationCard/.test(source), 'ApplicationsPage должен использовать <ApplicationCard …/>, а не повторять разметку карточки');
ctx.assert(/key\\s*=\\s*\\{/.test(source), 'У элементов списка должен быть key');
ctx.assert(!/key\\s*=\\s*\\{\\s*index\\s*\\}/.test(source), 'Индекс — плохой key, используйте id заявки');`,
        points: 4,
      },
      {
        id: 'counter',
        name: 'Счётчик показывает количество',
        type: 'react',
        code: `const applications = [
  { id: 1, room: 'Коворкинг', date: '12.03.2027', status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '05.02.2027', status: 'Мероприятие завершено' },
  { id: 3, room: 'Аудитория', date: '28.01.2027', status: 'Новая' },
];
return ctx.render('ApplicationsPage', { applications })
  .then(() => ctx.change('#filter', ''))
  .then(() => {
    const count = ctx.text('#count');
    ctx.assert(count !== null, 'Нет блока #count');
    ctx.assert(count.indexOf('3') !== -1, 'Счётчик должен показывать 3, сейчас: ' + count);
  });`,
        points: 3,
      },
      {
        id: 'filter',
        name: 'Фильтр по статусу работает',
        type: 'react',
        code: `const applications = [
  { id: 1, room: 'Коворкинг', date: '12.03.2027', status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '05.02.2027', status: 'Мероприятие завершено' },
  { id: 3, room: 'Аудитория', date: '28.01.2027', status: 'Новая' },
];
return ctx.render('ApplicationsPage', { applications })
  .then(() => ctx.change('#filter', 'Новая'))
  .then(() => {
    const text = ctx.text();
    ctx.assert(text.indexOf('Кинозал') === -1, 'Завершённая заявка не должна показываться при фильтре «Новая»');
    ctx.assert(text.indexOf('Коворкинг') !== -1, 'Новая заявка пропала из списка');
    ctx.assert(ctx.text('#count').indexOf('2') !== -1, 'Счётчик должен показывать 2, сейчас: ' + ctx.text('#count'));
  });`,
        points: 5,
      },
      {
        id: 'empty-state',
        name: 'Пустой результат объяснён',
        type: 'react',
        code: `const applications = [{ id: 1, room: 'Коворкинг', date: '12.03.2027', status: 'Новая' }];
return ctx.render('ApplicationsPage', { applications })
  .then(() => ctx.change('#filter', 'Мероприятие завершено'))
  .then(() => {
    ctx.assert(
      ctx.text().indexOf('Заявок с таким статусом нет') !== -1,
      'При пустом результате нужен текст «Заявок с таким статусом нет»',
    );
  });`,
        points: 4,
      },
      {
        id: 'filter-reset',
        name: 'Возврат к «Все» показывает всё',
        type: 'react',
        code: `const applications = [
  { id: 1, room: 'Коворкинг', date: '12.03.2027', status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '05.02.2027', status: 'Мероприятие завершено' },
];
return ctx.render('ApplicationsPage', { applications })
  .then(() => ctx.change('#filter', 'Новая'))
  .then(() => ctx.change('#filter', ''))
  .then(() => {
    const text = ctx.text();
    ctx.assert(text.indexOf('Коворкинг') !== -1 && text.indexOf('Кинозал') !== -1, 'При пустом фильтре должны показываться все заявки');
  });`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Фильтрованный список не нужно хранить в состоянии: в состоянии лежит только выбранный статус, а список вычисляется при отрисовке.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Пустое значение фильтра означает «все». Условие получается такое: !status || item.status === status.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const [status, setStatus] = React.useState(""); const visible = applications.filter((item) => !status || item.status === status); дальше {visible.length ? visible.map(...) : <p>Заявок с таким статусом нет</p>}',
        penaltyPercent: 35,
      },
    ],
    solution: `function ApplicationCard({ application }) {
  return (
    <article className="card">
      <h3>{application.room}</h3>
      <p>{application.date}</p>
      <p>{application.status}</p>
    </article>
  );
}

function ApplicationsPage({ applications }) {
  const [status, setStatus] = React.useState('');

  const visible = applications.filter((item) => !status || item.status === status);

  return (
    <div>
      <label htmlFor="filter">Статус</label>
      <select id="filter" value={status} onChange={(event) => setStatus(event.target.value)}>
        <option value="">Все</option>
        <option value="Новая">Новая</option>
        <option value="Мероприятие назначено">Мероприятие назначено</option>
        <option value="Мероприятие завершено">Мероприятие завершено</option>
      </select>

      <p id="count">Показано заявок: {visible.length}</p>

      {visible.length > 0 ? (
        <div>
          {visible.map((item) => (
            <ApplicationCard application={item} key={item.id} />
          ))}
        </div>
      ) : (
        <p>Заявок с таким статусом нет</p>
      )}
    </div>
  );
}`,
    solutionExplanation:
      'Отфильтрованный список — вычисляемое значение, а не состояние. Это правило стоит запомнить сразу: в состоянии держат только то, что нельзя вывести из остального. Если положить туда visible, придётся вручную обновлять его при каждом изменении фильтра и при каждом приходе новых заявок — и однажды забыть. Пустое состояние выводится вместо списка, а не рядом с ним: пользователь должен видеть объяснение там, где ожидал данные.',
    maxScore: 22,
    estimatedMinutes: 30,
    examRefs: ['m1-cabinet', 'm2-admin-tools', 'm3-framework'],
    planDays: ['day-09-7'],
    source: 'plan',
  },

  {
    id: 'task-week-10-assembly',
    title: 'Сборка недели 10: регистрация с валидацией за 25 минут',
    kind: 'app',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['react-forms', 'react-date-input'],
    monthNo: 3,
    weekNo: 10,
    statement: `Неделя форм закончилась. **25 минут** на форму регистрации из задания демоэкзамена — со всей валидацией и подсказками рядом с полями.

Компонент \`RegisterForm\`:

1. пять управляемых полей одним состоянием: \`login\`, \`password\`, \`fullName\`, \`phone\`, \`email\`;
2. проверка по отправке:
   - логин — латиница и цифры, минимум 6 символов;
   - пароль — минимум 8 символов;
   - ФИО — минимум два слова;
   - телефон — минимум 10 цифр;
   - e-mail — есть собака и точка после неё;
3. сообщение об ошибке выводится **рядом с полем** — в блоке с \`id\` вида \`login-error\`, \`password-error\` и так далее;
4. если ошибок нет, все блоки ошибок пусты и в \`#result\` появляется «Регистрация прошла успешно»;
5. страница не перезагружается.`,
    requirements: [
      'Пять управляемых полей с одним состоянием',
      'Проверка каждого поля по правилам задания',
      'Ошибка выводится рядом со своим полем',
      'Исправление ошибки убирает сообщение',
      'Успешная отправка даёт сообщение в #result',
      'Страница не перезагружается',
    ],
    starterCode: `function RegisterForm() {
  // пять полей, проверка, сообщения рядом с полями
}`,
    tests: [
      {
        id: 'fields',
        name: 'Пять управляемых полей',
        type: 'react',
        code: `return ctx.render('RegisterForm', {}).then(() => {
  ['login', 'password', 'fullName', 'phone', 'email'].forEach((name) => {
    ctx.assert(ctx.$('input[name="' + name + '"]'), 'Нет поля с name="' + name + '"');
    ctx.assert(ctx.$('#' + name + '-error'), 'Нет блока для сообщения с id="' + name + '-error"');
  });
  const source = (ctx.source || '').replace(/\\s+/g, ' ');
  ctx.assert(/value\\s*=\\s*\\{/.test(source), 'Поля должны быть управляемыми');
});`,
        points: 4,
      },
      {
        id: 'all-errors',
        name: 'Все ошибки показываются рядом со своими полями',
        type: 'react',
        code: `return ctx.render('RegisterForm', {})
  .then(() => ctx.change('input[name="login"]', 'ив'))
  .then(() => ctx.change('input[name="password"]', '123'))
  .then(() => ctx.change('input[name="fullName"]', 'Иванов'))
  .then(() => ctx.change('input[name="phone"]', '+7 900'))
  .then(() => ctx.change('input[name="email"]', 'ivanov'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ['login', 'password', 'fullName', 'phone', 'email'].forEach((name) => {
      const message = ctx.text('#' + name + '-error');
      ctx.assert(message && message.length > 0, 'Нет сообщения об ошибке в #' + name + '-error');
    });
    ctx.assert(ctx.text('#result') === '', 'При ошибках в #result ничего быть не должно');
  });`,
        points: 5,
      },
      {
        id: 'phone-digits',
        name: 'Телефон считается по цифрам, а не по длине строки',
        type: 'react',
        code: `return ctx.render('RegisterForm', {})
  .then(() => ctx.change('input[name="phone"]', '+7 (900) 123-45-67'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(
      ctx.text('#phone-error') === '',
      'Телефон с разделителями должен проходить: считать нужно цифры, а не символы. Сейчас: ' + ctx.text('#phone-error'),
    );
  });`,
        points: 4,
      },
      {
        id: 'fix-clears',
        name: 'Исправление убирает сообщение',
        type: 'react',
        code: `return ctx.render('RegisterForm', {})
  .then(() => ctx.change('input[name="login"]', 'ив'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(ctx.text('#login-error').length > 0, 'Сообщение об ошибке логина не появилось');
  })
  .then(() => ctx.change('input[name="login"]', 'ivanov26'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(ctx.text('#login-error') === '', 'После исправления сообщение должно исчезнуть, сейчас: ' + ctx.text('#login-error'));
  });`,
        points: 4,
      },
      {
        id: 'success',
        name: 'Верные данные проходят',
        type: 'react',
        code: `return ctx.render('RegisterForm', {})
  .then(() => ctx.change('input[name="login"]', 'ivanov26'))
  .then(() => ctx.change('input[name="password"]', 'demo2026pass'))
  .then(() => ctx.change('input[name="fullName"]', 'Иванов Илья'))
  .then(() => ctx.change('input[name="phone"]', '+7 900 123-45-67'))
  .then(() => ctx.change('input[name="email"]', 'ivanov@example.com'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ['login', 'password', 'fullName', 'phone', 'email'].forEach((name) => {
      ctx.assert(ctx.text('#' + name + '-error') === '', 'Осталось сообщение в #' + name + '-error');
    });
    ctx.assert(
      ctx.text('#result').indexOf('Регистрация прошла успешно') !== -1,
      'В #result должно появиться «Регистрация прошла успешно», сейчас: ' + ctx.text('#result'),
    );
  });`,
        points: 5,
      },
      {
        id: 'no-reload',
        name: 'Страница не перезагружается',
        type: 'react',
        code: `const source = ctx.source || '';
ctx.assert(/preventDefault/.test(source), 'В обработчике отправки нужен event.preventDefault()');
ctx.assert(!/alert\\s*\\(/.test(source), 'Подсказки выводятся рядом с полями, а не через alert');`,
        points: 2,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Ошибки удобно хранить объектом с теми же ключами, что и значения: { login: "", password: "", … }.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Проверки вынесите в отдельную функцию validate(values), возвращающую объект ошибок. Компонент тогда только показывает результат.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const next = { login: /^[A-Za-z0-9]{6,}$/.test(values.login) ? "" : "Латиница и цифры, минимум 6 символов", … }; setErrors(next); const ok = Object.values(next).every((m) => m === "");',
        penaltyPercent: 35,
      },
    ],
    solution: `const EMPTY_ERRORS = { login: '', password: '', fullName: '', phone: '', email: '' };

function validate(values) {
  return {
    login: /^[A-Za-z0-9]{6,}$/.test(values.login) ? '' : 'Латиница и цифры, минимум 6 символов',
    password: values.password.length >= 8 ? '' : 'Минимум 8 символов',
    fullName: values.fullName.trim().split(/\\s+/).filter(Boolean).length >= 2 ? '' : 'Укажите фамилию и имя',
    phone: values.phone.replace(/\\D/g, '').length >= 10 ? '' : 'Минимум 10 цифр',
    email: /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(values.email) ? '' : 'Проверьте адрес: нужен знак @ и точка после него',
  };
}

function RegisterForm() {
  const [values, setValues] = React.useState({
    login: '',
    password: '',
    fullName: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = React.useState(EMPTY_ERRORS);
  const [result, setResult] = React.useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const next = validate(values);
    setErrors(next);

    const ok = Object.keys(next).every((key) => next[key] === '');
    setResult(ok ? 'Регистрация прошла успешно' : '');
  };

  const fields = [
    { name: 'login', label: 'Логин', type: 'text' },
    { name: 'password', label: 'Пароль', type: 'password' },
    { name: 'fullName', label: 'ФИО', type: 'text' },
    { name: 'phone', label: 'Телефон', type: 'tel' },
    { name: 'email', label: 'E-mail', type: 'email' },
  ];

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              value={values[field.name]}
              onChange={handleChange}
            />
            <p id={field.name + '-error'}>{errors[field.name]}</p>
          </div>
        ))}
        <button type="submit">Зарегистрироваться</button>
      </form>

      <p id="result">{result}</p>
    </div>
  );
}`,
    solutionExplanation:
      'Поля описаны массивом и выводятся через map — пять почти одинаковых блоков разметки сжались в один. На экзамене это экономит минуты и убирает целый класс ошибок: скопировал блок, поменял label, забыл поменять name. Функция validate вынесена из компонента: она не знает ни про состояние, ни про React, её легко проверить и легко перенести на сервер, где те же правила придётся повторить. Телефон считается по цифрам — пользователь имеет право писать его как привык.',
    maxScore: 24,
    estimatedMinutes: 25,
    examRefs: ['m1-register', 'm2-register-hints'],
    planDays: ['day-10-7'],
    source: 'plan',
  },

  {
    id: 'task-week-11-assembly',
    title: 'Сборка недели 11: слайдер и закрытый раздел за 30 минут',
    kind: 'app',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['react-slider', 'react-effects', 'react-protected-routes', 'react-context'],
    monthNo: 3,
    weekNo: 11,
    statement: `Две вещи из задания демоэкзамена, которые проще написать сразу правильно: слайдер и закрытый раздел.

Компонент \`CabinetPage\` принимает проп \`user\` (строка или \`null\`).

**Слайдер** — требование модуля 2: «4 изображения с автоматическим переключением через 3 секунды».

1. четыре слайда, видимый помечен классом \`active\`;
2. автопереключение каждые 3 секунды через \`useEffect\` с обязательной очисткой таймера;
3. кнопка \`#next\` листает вручную, после четвёртого идёт первый.

**Закрытый раздел** — требование задания: в кабинет попадает только вошедший.

4. если \`user\` равен \`null\`, вместо содержимого выводится блок \`#guard\` с текстом «Войдите, чтобы посмотреть кабинет», и слайдера на странице нет;
5. если \`user\` задан, показывается приветствие в \`#greeting\` и слайдер.`,
    requirements: [
      'Четыре слайда, активен ровно один',
      'Автопереключение каждые 3 секунды',
      'Таймер снимается в функции очистки',
      'Кнопка листает по кругу',
      'Гость видит только сообщение и не видит слайдер',
      'Вошедший видит приветствие и слайдер',
    ],
    starterCode: `function CabinetPage({ user }) {
  // закрытый раздел и слайдер
}`,
    tests: [
      {
        id: 'guard',
        name: 'Гостя в кабинет не пускают',
        type: 'react',
        code: `return ctx.render('CabinetPage', { user: null }).then(() => {
  const guard = ctx.$('#guard');
  ctx.assert(guard, 'Для гостя должен выводиться блок #guard');
  ctx.assert(
    guard.textContent.indexOf('Войдите') !== -1,
    'В блоке #guard должно быть объяснение, а не пустота. Сейчас: ' + guard.textContent,
  );
  ctx.assert(ctx.$$('.slide').length === 0, 'Гость не должен видеть слайдер');
});`,
        points: 4,
      },
      {
        id: 'greeting',
        name: 'Вошедший видит кабинет',
        type: 'react',
        code: `return ctx.render('CabinetPage', { user: 'Иванов Илья' }).then(() => {
  ctx.assert(!ctx.$('#guard'), 'Вошедшему блок #guard показывать не нужно');
  const greeting = ctx.text('#greeting');
  ctx.assert(greeting && greeting.indexOf('Иванов Илья') !== -1, 'В #greeting должно быть имя вошедшего, сейчас: ' + greeting);
});`,
        points: 3,
      },
      {
        id: 'slides',
        name: 'Четыре слайда, активен один',
        type: 'react',
        code: `return ctx.render('CabinetPage', { user: 'Иванов Илья' }).then(() => {
  const slides = ctx.$$('.slide');
  ctx.assert(slides.length === 4, 'Слайдов должно быть четыре, найдено: ' + slides.length, 4, slides.length);
  const active = ctx.$$('.slide.active');
  ctx.assert(active.length === 1, 'Активным должен быть ровно один слайд, сейчас: ' + active.length, 1, active.length);
});`,
        points: 4,
      },
      {
        id: 'next',
        name: 'Кнопка листает по кругу',
        type: 'react',
        code: `return ctx.render('CabinetPage', { user: 'Иванов Илья' }).then(() => {
  const slides = ctx.$$('.slide');
  const before = slides.indexOf(ctx.$('.slide.active'));
  return ctx.click('#next').then(() => {
    const after = ctx.$$('.slide').indexOf(ctx.$('.slide.active'));
    ctx.assert(after === (before + 1) % 4, 'После кнопки должен открыться следующий слайд: был ' + before + ', стал ' + after);
  });
});`,
        points: 4,
      },
      {
        id: 'autoplay',
        name: 'Слайды листаются сами',
        type: 'react',
        code: `return ctx.render('CabinetPage', { user: 'Иванов Илья' }).then(() => {
  const before = ctx.$$('.slide').indexOf(ctx.$('.slide.active'));
  return ctx.advanceTime(3400).then(() => {
    const after = ctx.$$('.slide').indexOf(ctx.$('.slide.active'));
    ctx.assert(after !== before, 'За 3.4 секунды слайд не сменился: нужен setInterval на 3000 мс в useEffect');
    ctx.assert(ctx.$$('.slide.active').length === 1, 'После автопереключения активным должен остаться один слайд');
  });
});`,
        points: 5,
      },
      {
        id: 'cleanup',
        name: 'Таймер снимается',
        type: 'react',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(/useEffect/.test(source), 'Таймер заводится в React.useEffect');
ctx.assert(
  /clearInterval|clearTimeout/.test(source),
  'Эффект должен возвращать функцию очистки: без неё таймеры накопятся и слайдер начнёт прыгать через слайд',
);`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Проверку на гостя делайте ранним возвратом в самом начале компонента — тогда остальной код можно писать, уже не думая о ней.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Внимание: хуки нельзя вызывать после условного возврата. Все useState и useEffect должны стоять выше проверки на гостя.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'React.useEffect(() => { const timer = setInterval(() => setIndex((i) => (i + 1) % 4), 3000); return () => clearInterval(timer); }, []); а в разметке className={"slide" + (i === index ? " active" : "")}.',
        penaltyPercent: 35,
      },
    ],
    solution: `const SLIDES = ['Аудитория на 100 мест', 'Коворкинг', 'Кинозал', 'Переговорная'];

function CabinetPage({ user }) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  if (!user) {
    return <p id="guard">Войдите, чтобы посмотреть кабинет</p>;
  }

  return (
    <div>
      <p id="greeting">Добрый день, {user}</p>

      <div className="slider">
        {SLIDES.map((title, position) => (
          <div className={position === index ? 'slide active' : 'slide'} key={title}>
            {title}
          </div>
        ))}
      </div>

      <button id="next" type="button" onClick={() => setIndex((current) => (current + 1) % SLIDES.length)}>
        Вперёд
      </button>
    </div>
  );
}`,
    solutionExplanation:
      'Оба хука стоят выше проверки на гостя — это не стиль, а правило React: хуки вызываются в одном и том же порядке при каждой отрисовке. Если поставить useEffect после if (!user) return, то при входе пользователя порядок изменится и React выбросит ошибку. Обновление индекса записано функцией setIndex((current) => …): внутри интервала обычная переменная index навсегда осталась бы равной нулю — она захвачена замыканием на момент создания таймера.',
    maxScore: 23,
    estimatedMinutes: 30,
    examRefs: ['m2-slider', 'm2-cabinet-ux', 'm1-cabinet'],
    planDays: ['day-11-7'],
    source: 'plan',
  },

  {
    id: 'task-week-12-assembly',
    title: 'Контроль месяца 3: фронтенд приложения целиком',
    kind: 'app',
    runtime: 'react',
    difficulty: 5,
    tech: ['react'],
    topicIds: ['react-structure', 'react-router', 'react-context', 'react-admin-ui'],
    monthNo: 3,
    weekNo: 12,
    statement: `Контроль за третий месяц. Соберите каркас всего приложения на тестовых данных — то, что на экзамене станет первым модулем.

Компонент \`App\`:

1. **маршруты** — таблица \`routes\` с четырьмя адресами: \`/\` (Главная), \`/cabinet\` (Кабинет), \`/order\` (Заявка), \`/admin\` (Администратор). Меню строится из неё кнопками \`data-path\`.
2. **вход** — кнопка \`#auth-button\`: «Войти» для гостя, «Выйти» для вошедшего. Вход как \`Иванов Илья\`. Имя показывается в \`#greeting\`, для гостя — «Гость».
3. **закрытые разделы** — \`/cabinet\` и \`/admin\` доступны только вошедшему. Гостю на этих адресах показывается блок \`#guard\` с текстом «Войдите, чтобы продолжить».
4. **данные** — на \`/admin\` таблица \`#orders\` со всеми заявками из \`mockApplications\`; заявок не меньше трёх, у каждой помещение, дата в формате ДД.ММ.ГГГГ и статус.
5. **кабинет** — на \`/cabinet\` заявки карточками \`.card\`.

Засеките время. Три часа на это — нормальный результат для конца третьего месяца.`,
    requirements: [
      'Таблица маршрутов из четырёх адресов, меню строится из неё',
      'Вход и выход меняют приветствие и надпись на кнопке',
      'Кабинет и админка закрыты от гостя',
      'После входа закрытые разделы открываются',
      'На админке таблица заявок с датами ДД.ММ.ГГГГ',
      'В кабинете заявки выводятся карточками',
    ],
    starterCode: `const mockApplications = [
  // не меньше трёх заявок: { id, room, date, status }
];

const routes = [
  // { path: '/', title: 'Главная' } и ещё три
];

function App() {
  // меню, вход, закрытые разделы и данные
}`,
    tests: [
      {
        id: 'routes',
        name: 'Меню построено из таблицы маршрутов',
        type: 'react',
        code: `const routes = ctx.get('routes');
ctx.assert(Array.isArray(routes) && routes.length === 4, 'Маршрутов должно быть четыре, найдено: ' + (routes || []).length);
const paths = routes.map((route) => route.path);
['/', '/cabinet', '/order', '/admin'].forEach((path) => {
  ctx.assert(paths.indexOf(path) !== -1, 'Не хватает маршрута ' + path);
});
return ctx.render('App', {}).then(() => {
  ctx.assert(ctx.$$('[data-path]').length === 4, 'В меню должно быть четыре пункта');
  const source = (ctx.source || '').replace(/\\s+/g, ' ');
  ctx.assert(/routes\\s*\\.\\s*map/.test(source), 'Меню должно строиться из routes.map');
});`,
        points: 4,
      },
      {
        id: 'guest-guard',
        name: 'Гостя не пускают в кабинет и админку',
        type: 'react',
        code: `return ctx.render('App', {})
  .then(() => {
    if (ctx.$('#auth-button').textContent.trim() === 'Выйти') return ctx.click('#auth-button');
    return null;
  })
  .then(() => ctx.click('[data-path="/cabinet"]'))
  .then(() => {
    ctx.assert(ctx.$('#guard'), 'Гость на /cabinet должен видеть блок #guard');
    ctx.assert(ctx.text('#guard').indexOf('Войдите') !== -1, 'В блоке #guard нужно объяснение');
  })
  .then(() => ctx.click('[data-path="/admin"]'))
  .then(() => {
    ctx.assert(ctx.$('#guard'), 'Гость на /admin должен видеть блок #guard');
    ctx.assert(!ctx.$('#orders'), 'Таблица заявок гостю показываться не должна');
  });`,
        points: 5,
      },
      {
        id: 'auth',
        name: 'Вход и выход работают',
        type: 'react',
        code: `return ctx.render('App', {})
  .then(() => {
    if (ctx.$('#auth-button').textContent.trim() === 'Выйти') return ctx.click('#auth-button');
    return null;
  })
  .then(() => {
    ctx.assert(ctx.text('#greeting') === 'Гость', 'До входа в #greeting должно быть «Гость», сейчас: ' + ctx.text('#greeting'));
    return ctx.click('#auth-button');
  })
  .then(() => {
    ctx.assert(
      ctx.text('#greeting').indexOf('Иванов Илья') !== -1,
      'После входа в #greeting должно быть имя, сейчас: ' + ctx.text('#greeting'),
    );
    ctx.assert(ctx.$('#auth-button').textContent.trim() === 'Выйти', 'После входа на кнопке должно быть «Выйти»');
  });`,
        points: 4,
      },
      {
        id: 'admin-table',
        name: 'На админке таблица заявок',
        type: 'react',
        code: `return ctx.render('App', {})
  .then(() => {
    if (ctx.$('#auth-button').textContent.trim() === 'Войти') return ctx.click('#auth-button');
    return null;
  })
  .then(() => ctx.click('[data-path="/admin"]'))
  .then(() => {
    const table = ctx.$('#orders');
    ctx.assert(table, 'На /admin нет таблицы #orders');
    const rows = ctx.$$('#orders tbody tr');
    ctx.assert(rows.length >= 3, 'Строк с заявками должно быть не меньше трёх, найдено: ' + rows.length);
    rows.forEach((row, index) => {
      ctx.assert(
        /\\b\\d{2}\\.\\d{2}\\.\\d{4}\\b/.test(row.textContent),
        'В строке ' + (index + 1) + ' нет даты в формате ДД.ММ.ГГГГ',
      );
    });
  });`,
        points: 5,
      },
      {
        id: 'cabinet-cards',
        name: 'В кабинете заявки карточками',
        type: 'react',
        code: `return ctx.render('App', {})
  .then(() => {
    if (ctx.$('#auth-button').textContent.trim() === 'Войти') return ctx.click('#auth-button');
    return null;
  })
  .then(() => ctx.click('[data-path="/cabinet"]'))
  .then(() => {
    ctx.assert(!ctx.$('#guard'), 'Вошедшему блок #guard показывать не нужно');
    const cards = ctx.$$('.card');
    ctx.assert(cards.length >= 3, 'Карточек заявок должно быть не меньше трёх, найдено: ' + cards.length);
  });`,
        points: 4,
      },
      {
        id: 'data',
        name: 'Тестовые данные на месте',
        type: 'react',
        code: `const items = ctx.get('mockApplications');
ctx.assert(Array.isArray(items) && items.length >= 3, 'mockApplications должен содержать не меньше трёх заявок');
items.forEach((item) => {
  ['id', 'room', 'date', 'status'].forEach((field) => {
    ctx.assert(item[field] !== undefined, 'У заявки нет поля «' + field + '»');
  });
  ctx.assert(/^\\d{2}\\.\\d{2}\\.\\d{4}$/.test(item.date), 'Дата должна быть в формате ДД.ММ.ГГГГ, сейчас: ' + item.date);
});`,
        points: 3,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Начните с данных и таблицы маршрутов, потом состояние (текущий адрес и пользователь), и только затем разметку.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Защиту раздела удобно описать флагом в самом маршруте: { path: "/cabinet", title: "Кабинет", secure: true }. Тогда проверка будет одна на все закрытые разделы.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const route = routes.find((r) => r.path === path); а в разметке: {route.secure && !user ? <p id="guard">Войдите, чтобы продолжить</p> : renderPage(route)}',
        penaltyPercent: 35,
      },
    ],
    solution: `const mockApplications = [
  { id: 1, room: 'Аудитория на 100 мест', date: '12.03.2027', status: 'Новая' },
  { id: 2, room: 'Коворкинг', date: '05.02.2027', status: 'Мероприятие назначено' },
  { id: 3, room: 'Кинозал', date: '28.01.2027', status: 'Мероприятие завершено' },
];

const routes = [
  { path: '/', title: 'Главная', secure: false },
  { path: '/cabinet', title: 'Кабинет', secure: true },
  { path: '/order', title: 'Заявка', secure: false },
  { path: '/admin', title: 'Администратор', secure: true },
];

function App() {
  const [path, setPath] = React.useState('/');
  const [user, setUser] = React.useState(null);

  const route = routes.find((item) => item.path === path) || routes[0];

  const renderPage = () => {
    if (route.path === '/admin') {
      return (
        <table id="orders">
          <thead>
            <tr>
              <th>№</th>
              <th>Помещение</th>
              <th>Дата</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {mockApplications.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.room}</td>
                <td>{item.date}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (route.path === '/cabinet') {
      return (
        <div>
          {mockApplications.map((item) => (
            <article className="card" key={item.id}>
              <h3>{item.room}</h3>
              <p>{item.date}</p>
              <p>{item.status}</p>
            </article>
          ))}
        </div>
      );
    }

    if (route.path === '/order') {
      return <p>Форма оформления заявки</p>;
    }

    return <p>Бронирование помещений для конференций</p>;
  };

  return (
    <div>
      <header>
        <span id="greeting">{user ? user : 'Гость'}</span>
        <button
          id="auth-button"
          type="button"
          onClick={() => (user ? setUser(null) : setUser('Иванов Илья'))}
        >
          {user ? 'Выйти' : 'Войти'}
        </button>
      </header>

      <nav>
        {routes.map((item) => (
          <button key={item.path} data-path={item.path} type="button" onClick={() => setPath(item.path)}>
            {item.title}
          </button>
        ))}
      </nav>

      <h1>{route.title}</h1>

      {route.secure && !user ? <p id="guard">Войдите, чтобы продолжить</p> : renderPage()}
    </div>
  );
}`,
    solutionExplanation:
      'Флаг secure вынесен в саму таблицу маршрутов, и проверка написана один раз — в месте вывода страницы. Альтернатива, при которой каждая страница сама себя защищает, выглядит короче на одной странице и разваливается на четырёх: рано или поздно новый раздел добавят и защиту в нём забудут. Заметьте, что закрытый раздел не просто пустой — он объясняет, что делать. Пустой экран пользователь считает поломкой и уходит.',
    maxScore: 25,
    estimatedMinutes: 180,
    examRefs: ['m1-login', 'm1-cabinet', 'm1-admin', 'm3-framework'],
    planDays: ['day-12-7'],
    source: 'plan',
  },
];
