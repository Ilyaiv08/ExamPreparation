import type { Task } from '../types';

/** Месяц 3, недели 10–12: формы, эффекты, слайдер, защищённые маршруты, админка. */
export const MONTH_03_APP_TASKS: Task[] = [
  {
    id: 'task-react-register-form',
    title: 'Форма регистрации на React',
    kind: 'app',
    runtime: 'react',
    difficulty: 3,
    tech: ['react'],
    topicIds: ['react-forms'],
    monthNo: 3,
    weekNo: 10,
    statement: `Соберите форму регистрации из задания экзамена на управляемых полях.

Компонент \`RegisterForm\` принимает проп \`onSubmit\` — функцию, которую нужно вызвать с данными формы, если проверка прошла.

Поля (все с атрибутом \`name\`): \`login\`, \`password\`, \`fullName\`, \`phone\`, \`email\`.

Правила из задания: логин — латиница и цифры, минимум 6 символов; пароль — минимум 8; остальные поля обязательны.

При ошибке поле получает класс \`is-invalid\`, а рядом появляется блок \`.invalid-feedback\` с текстом. При успехе вызывается \`onSubmit(values)\`.`,
    requirements: [
      'Все поля управляемые (value + onChange)',
      'Ошибки показываются у конкретных полей',
      'onSubmit вызывается только при корректных данных',
      'Страница не перезагружается при отправке',
      'Кириллица в логине не проходит',
    ],
    starterCode: `function RegisterForm({ onSubmit }) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Все пять полей на месте',
        type: 'react',
        code: `return ctx.render('RegisterForm', { onSubmit: () => {} }).then(() => {
  ['login', 'password', 'fullName', 'phone', 'email'].forEach((name) => {
    ctx.assert(ctx.$('[name="' + name + '"]'), 'Нет поля с name="' + name + '"');
  });
});`,
        points: 3,
      },
      {
        id: 't2',
        name: 'Поля управляемые',
        type: 'react',
        code: `return ctx.render('RegisterForm', { onSubmit: () => {} })
  .then(() => ctx.change('[name="login"]', 'ivanov26'))
  .then(() => {
    const field = ctx.$('[name="login"]');
    ctx.assert(field.value === 'ivanov26', 'Значение поля должно храниться в состоянии и возвращаться в value');
  });`,
        points: 4,
      },
      {
        id: 't3',
        name: 'Пустая форма показывает ошибки',
        type: 'react',
        code: `let called = false;
return ctx.render('RegisterForm', { onSubmit: () => { called = true; } })
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(!called, 'При пустой форме onSubmit вызывать нельзя');
    ctx.assert(ctx.$$('.is-invalid').length > 0, 'Поля с ошибками должны получить класс is-invalid');
    ctx.assert(ctx.$('.invalid-feedback'), 'Рядом с полем должен появиться блок .invalid-feedback с текстом');
  });`,
        points: 5,
      },
      {
        id: 't4',
        name: 'Кириллица в логине не проходит',
        type: 'react',
        code: `let called = false;
return ctx.render('RegisterForm', { onSubmit: () => { called = true; } })
  .then(() => ctx.change('[name="login"]', 'иванов26'))
  .then(() => ctx.change('[name="password"]', 'demo2026'))
  .then(() => ctx.change('[name="fullName"]', 'Иванов Иван'))
  .then(() => ctx.change('[name="phone"]', '+79990000000'))
  .then(() => ctx.change('[name="email"]', 'ivan@example.com'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(!called, 'Логин из кириллицы не должен проходить проверку');
    ctx.assert(ctx.$('[name="login"]').classList.contains('is-invalid'), 'Поле логина должно быть отмечено ошибкой');
  });`,
        points: 5,
      },
      {
        id: 't5',
        name: 'Короткий пароль не проходит',
        type: 'react',
        code: `let called = false;
return ctx.render('RegisterForm', { onSubmit: () => { called = true; } })
  .then(() => ctx.change('[name="login"]', 'ivanov26'))
  .then(() => ctx.change('[name="password"]', 'demo202'))
  .then(() => ctx.change('[name="fullName"]', 'Иванов Иван'))
  .then(() => ctx.change('[name="phone"]', '+79990000000'))
  .then(() => ctx.change('[name="email"]', 'ivan@example.com'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(!called, 'Пароль из семи символов не должен проходить проверку');
    ctx.assert(ctx.$('[name="password"]').classList.contains('is-invalid'), 'Поле пароля должно быть отмечено ошибкой');
  });`,
        points: 4,
      },
      {
        id: 't6',
        name: 'Корректные данные уходят в onSubmit',
        type: 'react',
        code: `let received = null;
return ctx.render('RegisterForm', { onSubmit: (values) => { received = values; } })
  .then(() => ctx.change('[name="login"]', 'ivanov26'))
  .then(() => ctx.change('[name="password"]', 'demo2026'))
  .then(() => ctx.change('[name="fullName"]', 'Иванов Иван Иванович'))
  .then(() => ctx.change('[name="phone"]', '+7 999 000-00-00'))
  .then(() => ctx.change('[name="email"]', 'ivan@example.com'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(received, 'При корректных данных должен вызываться onSubmit');
    ctx.assert(received.login === 'ivanov26', 'В onSubmit должен прийти логин');
    ctx.assert(received.email === 'ivan@example.com', 'В onSubmit должен прийти e-mail');
    ctx.assert(ctx.$$('.is-invalid').length === 0, 'Классы ошибок должны быть сняты');
  });`,
        points: 5,
      },
    ],
    hints: [
      { level: 1, text: 'Держите одно состояние-объект для значений и одно для ошибок. Один обработчик onChange обслужит все поля через event.target.name.', penaltyPercent: 10 },
      { level: 2, text: 'Функцию проверки напишите отдельно: validate(values) возвращает объект { поле: текст }.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'className={`form-control ${errors.login ? "is-invalid" : ""}`} и рядом {errors.login && <div className="invalid-feedback">{errors.login}</div>}',
        penaltyPercent: 35,
      },
    ],
    solution: `const LOGIN_PATTERN = /^[A-Za-z0-9]{6,}$/;

const FIELDS = [
  { name: 'login', label: 'Логин', type: 'text' },
  { name: 'password', label: 'Пароль', type: 'password' },
  { name: 'fullName', label: 'ФИО', type: 'text' },
  { name: 'phone', label: 'Телефон', type: 'tel' },
  { name: 'email', label: 'E-mail', type: 'email' },
];

function validate(values) {
  const errors = {};
  if (!values.login) errors.login = 'Введите логин';
  else if (!LOGIN_PATTERN.test(values.login)) errors.login = 'Только латинские буквы и цифры, минимум 6 символов';
  if (!values.password) errors.password = 'Введите пароль';
  else if (values.password.length < 8) errors.password = 'Пароль не короче 8 символов';
  if (!values.fullName) errors.fullName = 'Укажите ФИО';
  if (!values.phone) errors.phone = 'Укажите телефон';
  if (!values.email) errors.email = 'Укажите e-mail';
  return errors;
}

function RegisterForm({ onSubmit }) {
  const [values, setValues] = React.useState({
    login: '', password: '', fullName: '', phone: '', email: '',
  });
  const [errors, setErrors] = React.useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {FIELDS.map((field) => (
        <div className="mb-3" key={field.name}>
          <label className="form-label" htmlFor={field.name}>{field.label}</label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            className={\`form-control \${errors[field.name] ? 'is-invalid' : ''}\`}
            value={values[field.name]}
            onChange={handleChange}
          />
          {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
        </div>
      ))}

      <button type="submit" className="btn btn-primary w-100">Зарегистрироваться</button>
    </form>
  );
}`,
    solutionExplanation:
      'Поля описаны массивом и отрисованы через map — добавить шестое поле можно одной строкой. Функция validate не знает про DOM, поэтому её же логику можно повторить на сервере.',
    maxScore: 26,
    estimatedMinutes: 40,
    examRefs: ['m1-register', 'm2-register-hints'],
    planDays: ['day-10-2', 'day-10-4'],
    source: 'plan',
  },

  {
    id: 'task-react-date-input',
    title: 'Поле даты с маской ДД.ММ.ГГГГ',
    kind: 'function',
    runtime: 'react',
    difficulty: 3,
    tech: ['react'],
    topicIds: ['react-date-input'],
    monthNo: 3,
    weekNo: 10,
    statement: `Компонент \`DateInput\` — текстовое поле даты с маской, как требует модуль 2: «дату укажите в поле формата ДД.ММ.ГГГГ».

Props: \`value\` (строка), \`onChange\` (функция).

Поведение:

- при вводе из значения убираются все нецифровые символы;
- остаются максимум 8 цифр;
- точки расставляются автоматически: \`14\` → \`14\`, \`1409\` → \`14.09\`, \`14092026\` → \`14.09.2026\`;
- наружу через \`onChange\` уходит уже отформатированная строка;
- у поля есть подсказка \`placeholder="ДД.ММ.ГГГГ"\`.`,
    requirements: [
      'Нецифровые символы отбрасываются',
      'Точки расставляются автоматически',
      'Длина ограничена восемью цифрами',
      'onChange получает отформатированную строку',
      'Есть placeholder ДД.ММ.ГГГГ',
    ],
    starterCode: `function DateInput({ value, onChange }) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Поле отрисовано с подсказкой',
        type: 'react',
        code: `return ctx.render('DateInput', { value: '', onChange: () => {} }).then(() => {
  const input = ctx.$('input');
  ctx.assert(input, 'Нет поля ввода');
  ctx.assert(input.getAttribute('placeholder') === 'ДД.ММ.ГГГГ', 'Нужен placeholder «ДД.ММ.ГГГГ»');
});`,
        points: 3,
      },
      {
        id: 't2',
        name: 'Две цифры остаются как есть',
        type: 'react',
        code: `let received = null;
return ctx.render('DateInput', { value: '', onChange: (v) => { received = v; } })
  .then(() => ctx.change('input', '14'))
  .then(() => ctx.assert(received === '14', 'Ожидалось «14», получено ' + ctx.preview(received)));`,
        points: 3,
      },
      {
        id: 't3',
        name: 'Точка появляется после дня',
        type: 'react',
        code: `let received = null;
return ctx.render('DateInput', { value: '', onChange: (v) => { received = v; } })
  .then(() => ctx.change('input', '1409'))
  .then(() => ctx.assert(received === '14.09', 'Ожидалось «14.09», получено ' + ctx.preview(received)));`,
        points: 4,
      },
      {
        id: 't4',
        name: 'Полная дата форматируется',
        type: 'react',
        code: `let received = null;
return ctx.render('DateInput', { value: '', onChange: (v) => { received = v; } })
  .then(() => ctx.change('input', '14092026'))
  .then(() => ctx.assert(received === '14.09.2026', 'Ожидалось «14.09.2026», получено ' + ctx.preview(received)));`,
        points: 4,
      },
      {
        id: 't5',
        name: 'Буквы и символы отбрасываются',
        type: 'react',
        code: `let received = null;
return ctx.render('DateInput', { value: '', onChange: (v) => { received = v; } })
  .then(() => ctx.change('input', '1a4b/09-2026'))
  .then(() => ctx.assert(received === '14.09.2026', 'Нецифровые символы нужно отбрасывать, получено ' + ctx.preview(received)));`,
        points: 4,
      },
      {
        id: 't6',
        name: 'Лишние цифры обрезаются',
        type: 'react',
        code: `let received = null;
return ctx.render('DateInput', { value: '', onChange: (v) => { received = v; } })
  .then(() => ctx.change('input', '1409202699'))
  .then(() => ctx.assert(received === '14.09.2026', 'Больше восьми цифр быть не должно, получено ' + ctx.preview(received)));`,
        points: 4,
      },
      {
        id: 't7',
        name: 'Значение приходит из props',
        type: 'react',
        code: `return ctx.render('DateInput', { value: '21.09.2026', onChange: () => {} }).then(() => {
  ctx.assert(ctx.$('input').value === '21.09.2026', 'Поле должно быть управляемым: значение берётся из props.value');
});`,
        points: 3,
      },
    ],
    hints: [
      { level: 1, text: 'Все цифры: value.replace(/\\D/g, ""). Обрезать: .slice(0, 8).', penaltyPercent: 10 },
      { level: 2, text: 'Режьте цифры на три части: (0,2), (2,4), (4,8) — и склеивайте точками только непустые.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'const parts = [digits.slice(0,2), digits.slice(2,4), digits.slice(4,8)].filter(Boolean); onChange(parts.join("."));',
        penaltyPercent: 35,
      },
    ],
    solution: `function DateInput({ value, onChange }) {
  const handleChange = (event) => {
    const digits = event.target.value.replace(/\\D/g, '').slice(0, 8);
    const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
    onChange(parts.join('.'));
  };

  return (
    <div className="mb-3">
      <label className="form-label" htmlFor="date">Дата начала</label>
      <input
        id="date"
        name="date"
        className="form-control"
        value={value}
        onChange={handleChange}
        placeholder="ДД.ММ.ГГГГ"
        inputMode="numeric"
        autoComplete="off"
      />
    </div>
  );
}`,
    solutionExplanation:
      'Фильтр .filter(Boolean) убирает пустые части, поэтому точка не появляется раньше времени: после двух цифр строка остаётся «14», а не «14.». Атрибут inputMode="numeric" открывает цифровую клавиатуру на телефоне.',
    maxScore: 25,
    estimatedMinutes: 30,
    examRefs: ['m2-order-form', 'm1-order'],
    planDays: ['day-10-3'],
    source: 'plan',
  },

  {
    id: 'task-react-effect-load',
    title: 'useEffect: загрузка данных с четырьмя состояниями',
    kind: 'app',
    runtime: 'react',
    difficulty: 3,
    tech: ['react'],
    topicIds: ['react-effects'],
    monthNo: 3,
    weekNo: 11,
    statement: `Компонент \`CabinetPanel\` загружает заявки при появлении на экране и показывает одно из четырёх состояний.

Props: \`load\` — функция, возвращающая обещание с массивом заявок.

Состояния:

1. **загрузка** — блок с классом \`loading\` и текстом «Загрузка…»;
2. **ошибка** — блок с классом \`error\`, текстом «Не удалось загрузить заявки» и кнопкой «Повторить», которая пробует загрузить снова;
3. **пусто** — блок с классом \`empty\` и текстом «У вас пока нет заявок»;
4. **данные** — список \`<li>\` с названием помещения.

В песочнице сетевые запросы запрещены, поэтому загрузчик приходит через props — так же поступают и при написании тестов в реальном проекте.`,
    requirements: [
      'Загрузка начинается сама при появлении компонента',
      'Во время загрузки виден блок loading',
      'При ошибке виден блок error с кнопкой «Повторить»',
      'Кнопка «Повторить» запускает загрузку заново',
      'Пустой ответ даёт блок empty',
    ],
    starterCode: `function CabinetPanel({ load }) {
  // ваш код
}`,
    timeLimitMs: 15000,
    tests: [
      {
        id: 't1',
        name: 'Сначала показывается загрузка',
        type: 'react',
        code: `const never = () => new Promise(() => {});
return ctx.render('CabinetPanel', { load: never }).then(() => {
  const loading = ctx.$('.loading');
  ctx.assert(loading, 'Пока данные не пришли, нужен блок с классом loading');
  ctx.assert(loading.textContent.includes('Загрузка'), 'В блоке должно быть слово «Загрузка»');
});`,
        points: 4,
      },
      {
        id: 't2',
        name: 'Данные появляются после загрузки',
        type: 'react',
        code: `const load = async () => [{ id: 1, room: 'Коворкинг' }, { id: 2, room: 'Кинозал' }];
return ctx.render('CabinetPanel', { load })
  .then(() => ctx.advanceTime(60))
  .then(() => {
    const items = ctx.$$('li');
    ctx.assert(items.length === 2, 'Ожидалось два пункта списка, найдено ' + items.length, 2, items.length);
    ctx.assert(ctx.text().includes('Коворкинг'), 'В списке должно быть название помещения');
    ctx.assert(!ctx.$('.loading'), 'После загрузки блок loading должен исчезнуть');
  });`,
        points: 5,
      },
      {
        id: 't3',
        name: 'Пустой ответ даёт блок empty',
        type: 'react',
        code: `const load = async () => [];
return ctx.render('CabinetPanel', { load })
  .then(() => ctx.advanceTime(60))
  .then(() => {
    const empty = ctx.$('.empty');
    ctx.assert(empty, 'При пустом списке нужен блок с классом empty');
    ctx.assert(empty.textContent.includes('нет заявок'), 'В блоке должно быть сообщение «У вас пока нет заявок»');
  });`,
        points: 4,
      },
      {
        id: 't4',
        name: 'Ошибка показывается пользователю',
        type: 'react',
        code: `const load = async () => { throw new Error('сервер недоступен'); };
return ctx.render('CabinetPanel', { load })
  .then(() => ctx.advanceTime(60))
  .then(() => {
    const error = ctx.$('.error');
    ctx.assert(error, 'При ошибке нужен блок с классом error');
    ctx.assert(error.textContent.includes('Не удалось загрузить заявки'), 'Нужен понятный текст, а не техническая ошибка');
    ctx.assert(ctx.text().includes('Повторить'), 'Нужна кнопка «Повторить»');
  });`,
        points: 5,
      },
      {
        id: 't5',
        name: 'Кнопка «Повторить» работает',
        type: 'react',
        code: `let attempt = 0;
const load = async () => {
  attempt++;
  if (attempt === 1) throw new Error('сбой');
  return [{ id: 1, room: 'Аудитория' }];
};
return ctx.render('CabinetPanel', { load })
  .then(() => ctx.advanceTime(60))
  .then(() => ctx.click(ctx.$$('button').find((b) => b.textContent.includes('Повторить'))))
  .then(() => ctx.advanceTime(80))
  .then(() => {
    ctx.assert(attempt === 2, 'Кнопка должна запускать загрузку заново, вызовов: ' + attempt);
    ctx.assert(ctx.text().includes('Аудитория'), 'После повторной загрузки должны появиться данные');
    ctx.assert(!ctx.$('.error'), 'Блок ошибки должен исчезнуть');
  });`,
        points: 6,
      },
      {
        id: 't6',
        name: 'Загрузка запускается один раз',
        type: 'react',
        code: `let calls = 0;
const load = async () => { calls++; return []; };
return ctx.render('CabinetPanel', { load })
  .then(() => ctx.advanceTime(100))
  .then(() => {
    ctx.assert(calls <= 2, 'Загрузка повторяется без остановки (вызовов: ' + calls + '). Проверьте массив зависимостей useEffect');
  });`,
        points: 4,
      },
    ],
    hints: [
      { level: 1, text: 'Три состояния: данные, признак загрузки и текст ошибки. Загрузку запускает useEffect с пустым массивом зависимостей.', penaltyPercent: 10 },
      { level: 2, text: 'Вынесите загрузку в отдельную функцию — её же вызовет кнопка «Повторить».', penaltyPercent: 20 },
      {
        level: 3,
        text: 'Порядок проверок: if (loading) return …; if (error) return …; if (!items.length) return …; return <ul>…</ul>;',
        penaltyPercent: 35,
      },
    ],
    solution: `function CabinetPanel({ load }) {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const fetchData = React.useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const data = await load();
      setItems(data);
    } catch {
      setError('Не удалось загрузить заявки');
    } finally {
      setLoading(false);
    }
  }, [load]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="loading">Загрузка…</div>;

  if (error) {
    return (
      <div className="error alert alert-danger">
        {error}
        <button type="button" className="btn btn-sm btn-outline-danger ms-2" onClick={fetchData}>
          Повторить
        </button>
      </div>
    );
  }

  if (!items.length) return <div className="empty">У вас пока нет заявок</div>;

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.room}</li>
      ))}
    </ul>
  );
}`,
    solutionExplanation:
      'Четыре состояния подряд — это и есть требование «состояния интерфейса» из критериев качества кода. useCallback нужен, чтобы функция не пересоздавалась на каждой отрисовке и эффект не зацикливался.',
    maxScore: 28,
    estimatedMinutes: 40,
    examRefs: ['m1-cabinet', 'm3-quality'],
    planDays: ['day-11-2'],
    source: 'plan',
  },

  {
    id: 'task-react-slider',
    title: 'Слайдер на React с автопереключением',
    kind: 'app',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['react-slider'],
    monthNo: 3,
    weekNo: 11,
    statement: `Требование модуля 2 в виде компонента React.

\`Slider\` принимает:

- \`images\` — массив адресов изображений;
- \`intervalMs\` — интервал автопереключения, **по умолчанию 3000**.

Требования:

- каждое изображение выводится тегом \`<img>\` с атрибутом \`alt\` вида «Слайд 1»;
- лента \`.slider__track\` сдвигается через \`style\` с \`translateX(-N%)\`;
- кнопки с \`aria-label="Предыдущий слайд"\` и \`aria-label="Следующий слайд"\` перелистывают по кругу;
- автопереключение работает через \`setInterval\` и **обязательно** очищается при размонтировании.`,
    requirements: [
      'Значение intervalMs по умолчанию равно 3000',
      'Кнопки перелистывают по кругу в обе стороны',
      'Лента сдвигается через transform: translateX',
      'Автопереключение работает',
      'Интервал очищается в функции очистки useEffect',
    ],
    starterCode: `function Slider({ images, intervalMs = 3000 }) {
  // ваш код
}`,
    timeLimitMs: 15000,
    tests: [
      {
        id: 't1',
        name: 'Все изображения отрисованы',
        type: 'react',
        code: `const images = ['/a.jpg', '/b.jpg', '/c.jpg', '/d.jpg'];
return ctx.render('Slider', { images }).then(() => {
  const imgs = ctx.$$('img');
  ctx.assert(imgs.length === 4, 'Ожидалось четыре изображения, найдено ' + imgs.length, 4, imgs.length);
  ctx.assert(imgs[0].getAttribute('alt') === 'Слайд 1', 'У первого изображения alt должен быть «Слайд 1»');
});`,
        points: 3,
      },
      {
        id: 't2',
        name: 'Интервал по умолчанию — 3000 мс',
        type: 'react',
        code: `ctx.assert(/intervalMs\\s*=\\s*3000/.test(ctx.source), 'Значение по умолчанию должно быть 3000 мс — это дословное требование задания «каждые три секунды»');`,
        points: 4,
      },
      {
        id: 't3',
        name: 'Кнопка «вперёд» сдвигает ленту',
        type: 'react',
        code: `const images = ['/a.jpg', '/b.jpg', '/c.jpg', '/d.jpg'];
return ctx.render('Slider', { images, intervalMs: 100000 })
  .then(() => ctx.click(ctx.$('[aria-label="Следующий слайд"]')))
  .then(() => {
    const track = ctx.$('.slider__track');
    ctx.assert(track, 'Нужна лента с классом slider__track');
    ctx.assert(/-100%/.test(track.style.transform), 'После первого клика сдвиг должен быть translateX(-100%), получено ' + ctx.preview(track.style.transform));
  });`,
        points: 5,
      },
      {
        id: 't4',
        name: 'Перелистывание вперёд по кругу',
        type: 'react',
        // Компонент между проверками не пересоздаётся, поэтому смотрим на
        // изменение относительно текущего слайда, а не на точное значение.
        code: `const images = ['/a.jpg', '/b.jpg'];
const shift = () => ctx.$('.slider__track').style.transform;
let start = '';
return ctx.render('Slider', { images, intervalMs: 100000 })
  .then(() => {
    start = shift();
    return ctx.click(ctx.$('[aria-label="Следующий слайд"]'));
  })
  .then(() => {
    ctx.assert(shift() !== start, 'Клик по «Следующий слайд» должен сдвигать ленту, сейчас: ' + ctx.preview(shift()));
    return ctx.click(ctx.$('[aria-label="Следующий слайд"]'));
  })
  .then(() => {
    ctx.assert(
      shift() === start,
      'Два клика по двум слайдам должны вернуть на исходный: было ' + ctx.preview(start) + ', стало ' + ctx.preview(shift()),
    );
  });`,
        points: 5,
      },
      {
        id: 't5',
        name: 'Перелистывание назад по кругу',
        type: 'react',
        // Сначала кнопкой «вперёд» приводим ленту к первому слайду:
        // компонент между проверками не пересоздаётся.
        code: `const images = ['/a.jpg', '/b.jpg', '/c.jpg'];
const indexOf = () => {
  const match = ctx.$('.slider__track').style.transform.match(/(\\d+)%/);
  return match ? Number(match[1]) / 100 : 0;
};

let chain = ctx.render('Slider', { images, intervalMs: 100000 });

for (let attempt = 0; attempt < 3; attempt += 1) {
  chain = chain.then(() => (indexOf() === 0 ? null : ctx.click(ctx.$('[aria-label="Следующий слайд"]'))));
}

return chain
  .then(() => {
    ctx.assert(indexOf() === 0, 'Не удалось вернуться на первый слайд, сейчас сдвиг: ' + ctx.preview(ctx.$('.slider__track').style.transform));
    return ctx.click(ctx.$('[aria-label="Предыдущий слайд"]'));
  })
  .then(() => {
    const transform = ctx.$('.slider__track').style.transform;
    ctx.assert(/-200%/.test(transform), 'С первого слайда назад должен открываться последний (-200% для трёх слайдов), получено ' + ctx.preview(transform));
  });`,
        points: 5,
      },
      {
        id: 't6',
        name: 'Автопереключение работает',
        type: 'react',
        // Смотрим на смену слайда относительно текущего: компонент между
        // проверками не пересоздаётся, и стартовый слайд не обязательно первый.
        code: `const images = ['/a.jpg', '/b.jpg', '/c.jpg'];
const indexOf = () => {
  const match = ctx.$('.slider__track').style.transform.match(/(\\d+)%/);
  return match ? Number(match[1]) / 100 : 0;
};
let before = 0;
return ctx.render('Slider', { images, intervalMs: 120 })
  .then(() => {
    before = indexOf();
    return ctx.advanceTime(200);
  })
  .then(() => {
    const after = indexOf();
    ctx.assert(
      after === (before + 1) % 3,
      'Через один интервал слайдер должен сам переключиться на следующий: был ' + before + ', стал ' + after,
    );
  });`,
        points: 6,
      },
      {
        id: 't7',
        name: 'Интервал очищается',
        type: 'react',
        code: `const source = ctx.source.replace(/\\s+/g, ' ');
ctx.assert(/clearInterval/.test(source), 'Без clearInterval в функции очистки useEffect слайдер сломается после перехода между страницами');
ctx.assert(/return\\s*\\(\\s*\\)\\s*=>/.test(source) || /return\\s*function/.test(source), 'clearInterval должен вызываться в функции очистки, которую возвращает useEffect');`,
        points: 5,
      },
    ],
    hints: [
      { level: 1, text: 'Состояние — только индекс текущего слайда. Сдвиг считается как index * 100 процентов.', penaltyPercent: 10 },
      { level: 2, text: 'Внутри setInterval обязательно используйте функцию обновления: setIndex((prev) => …), иначе эффект «запомнит» первое значение index.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'useEffect(() => { const timer = setInterval(() => setIndex((p) => (p + 1) % images.length), intervalMs); return () => clearInterval(timer); }, [images.length, intervalMs]);',
        penaltyPercent: 35,
      },
    ],
    solution: `function Slider({ images, intervalMs = 3000 }) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  if (!images.length) return null;

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((p) => (p - 1 + images.length) % images.length);

  return (
    <div className="slider">
      <div className="slider__track" style={{ transform: \`translateX(-\${index * 100}%)\` }}>
        {images.map((src, i) => (
          <img key={src} src={src} alt={\`Слайд \${i + 1}\`} />
        ))}
      </div>

      <button type="button" onClick={prev} aria-label="Предыдущий слайд">‹</button>
      <button type="button" onClick={next} aria-label="Следующий слайд">›</button>
    </div>
  );
}`,
    solutionExplanation:
      'Три вещи, которые проверяют на экзамене: интервал ровно 3000 мс, перелистывание по кругу в обе стороны и clearInterval в функции очистки. Без последнего слайдер начинает «прыгать» после возврата на страницу — и это сразу видно проверяющему.',
    maxScore: 33,
    estimatedMinutes: 45,
    examRefs: ['m2-slider'],
    planDays: ['day-11-3'],
    source: 'plan',
  },

  {
    id: 'task-react-protected-route',
    title: 'Защищённый маршрут и проверка роли',
    kind: 'function',
    runtime: 'react',
    difficulty: 3,
    tech: ['react', 'security'],
    topicIds: ['react-protected-routes'],
    monthNo: 3,
    weekNo: 11,
    statement: `Компонент \`ProtectedRoute\` решает, пускать ли пользователя на страницу.

Props:

- \`user\` — объект \`{ role }\` или \`null\`;
- \`loading\` — идёт ли восстановление сессии;
- \`requireAdmin\` — нужна ли роль администратора (по умолчанию \`false\`);
- \`children\` — содержимое страницы;
- \`onRedirect\` — функция, которую нужно вызвать с адресом перенаправления.

Правила:

1. \`loading = true\` → показать блок \`.loading\` и **не** вызывать \`onRedirect\`;
2. нет пользователя → вызвать \`onRedirect('/login')\` и показать \`null\`;
3. \`requireAdmin\` и роль не \`admin\` → вызвать \`onRedirect('/cabinet')\`;
4. иначе показать \`children\`.

В настоящем проекте вместо \`onRedirect\` используется \`<Navigate>\` из React Router; здесь проверяется сама логика решения.`,
    requirements: [
      'Во время загрузки перенаправления нет',
      'Гость отправляется на /login',
      'Пользователь без прав отправляется на /cabinet',
      'Администратор видит содержимое',
      'Обычный пользователь видит обычную страницу',
    ],
    starterCode: `function ProtectedRoute({ user, loading, requireAdmin = false, children, onRedirect }) {
  // ваш код
}`,
    tests: [
      {
        id: 't1',
        name: 'Во время загрузки показывается индикатор',
        type: 'react',
        code: `let redirected = null;
return ctx.render('ProtectedRoute', {
  user: null, loading: true, onRedirect: (to) => { redirected = to; },
  children: ctx.React.createElement('p', null, 'секрет'),
}).then(() => {
  ctx.assert(ctx.$('.loading'), 'Пока идёт восстановление сессии, нужен блок с классом loading');
  ctx.assert(redirected === null, 'Во время загрузки перенаправлять нельзя: пользователя выбросит на вход при каждом обновлении страницы');
  ctx.assert(!ctx.text().includes('секрет'), 'Содержимое показывать рано');
});`,
        points: 6,
      },
      {
        id: 't2',
        name: 'Гость отправляется на вход',
        type: 'react',
        code: `let redirected = null;
return ctx.render('ProtectedRoute', {
  user: null, loading: false, onRedirect: (to) => { redirected = to; },
  children: ctx.React.createElement('p', null, 'секрет'),
}).then(() => {
  ctx.assert(redirected === '/login', 'Гостя нужно отправить на /login, получено ' + ctx.preview(redirected));
  ctx.assert(!ctx.text().includes('секрет'), 'Содержимое не должно отрисовываться');
});`,
        points: 5,
      },
      {
        id: 't3',
        name: 'Обычный пользователь видит страницу',
        type: 'react',
        code: `let redirected = null;
return ctx.render('ProtectedRoute', {
  user: { role: 'user' }, loading: false, onRedirect: (to) => { redirected = to; },
  children: ctx.React.createElement('p', null, 'кабинет'),
}).then(() => {
  ctx.assert(redirected === null, 'Вошедшего пользователя перенаправлять не нужно');
  ctx.assert(ctx.text().includes('кабинет'), 'Содержимое должно отрисоваться');
});`,
        points: 4,
      },
      {
        id: 't4',
        name: 'Не-админ не попадает в админку',
        type: 'react',
        code: `let redirected = null;
return ctx.render('ProtectedRoute', {
  user: { role: 'user' }, loading: false, requireAdmin: true, onRedirect: (to) => { redirected = to; },
  children: ctx.React.createElement('p', null, 'админка'),
}).then(() => {
  ctx.assert(redirected === '/cabinet', 'Пользователя без прав отправляют в кабинет, а не на вход, получено ' + ctx.preview(redirected));
  ctx.assert(!ctx.text().includes('админка'), 'Содержимое админки показывать нельзя');
});`,
        points: 6,
      },
      {
        id: 't5',
        name: 'Администратор попадает в админку',
        type: 'react',
        code: `let redirected = null;
return ctx.render('ProtectedRoute', {
  user: { role: 'admin' }, loading: false, requireAdmin: true, onRedirect: (to) => { redirected = to; },
  children: ctx.React.createElement('p', null, 'админка'),
}).then(() => {
  ctx.assert(redirected === null, 'Администратора перенаправлять не нужно');
  ctx.assert(ctx.text().includes('админка'), 'Администратор должен видеть содержимое');
});`,
        points: 4,
      },
    ],
    hints: [
      { level: 1, text: 'Три проверки по порядку: загрузка, отсутствие пользователя, недостаток прав. Каждая — ранний возврат.', penaltyPercent: 10 },
      { level: 2, text: 'Вызов onRedirect делают перед возвратом null. В React Router вместо этого возвращают <Navigate to="…" replace />.', penaltyPercent: 20 },
      {
        level: 3,
        text: 'if (loading) return <div className="loading">…</div>; if (!user) { onRedirect("/login"); return null; } if (requireAdmin && user.role !== "admin") { onRedirect("/cabinet"); return null; } return <>{children}</>;',
        penaltyPercent: 35,
      },
    ],
    solution: `function ProtectedRoute({ user, loading, requireAdmin = false, children, onRedirect }) {
  // Пока сессия восстанавливается из localStorage, решение принимать рано
  if (loading) {
    return <div className="loading">Проверяем доступ…</div>;
  }

  if (!user) {
    onRedirect('/login');
    return null;
  }

  if (requireAdmin && user.role !== 'admin') {
    // Пользователь вошёл, но прав не хватает — на вход отправлять бессмысленно
    onRedirect('/cabinet');
    return null;
  }

  return <>{children}</>;
}`,
    solutionExplanation:
      'Проверка loading — не формальность: без неё при каждом обновлении страницы пользователя выбрасывает на вход, потому что сессия ещё читается из localStorage. И помните: это защита интерфейса, а настоящую проверку роли выполняет сервер в middleware.',
    maxScore: 25,
    estimatedMinutes: 30,
    examRefs: ['m1-admin', 'm3-quality'],
    planDays: ['day-11-5'],
    source: 'plan',
  },

  {
    id: 'task-react-admin-table',
    title: 'Админка: фильтр, сортировка, пагинация и смена статуса',
    kind: 'app',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['react-admin-ui'],
    monthNo: 3,
    weekNo: 12,
    statement: `Итоговое задание месяца: панель администратора со всеми инструментами модуля 2.

Компонент \`AdminTable\` принимает \`applications\` (массив) и \`onChangeStatus(id, status)\`.

Требования:

- \`<select className="filter">\` с вариантами «Все статусы» (значение \`""\`) и тремя статусами;
- строки таблицы \`<tbody> <tr>\`, по **5 записей** на страницу;
- кнопка \`.sort-date\` переключает направление сортировки по дате (изначально по возрастанию);
- кнопки страниц с классом \`.page\`, активная — с классом \`active\`;
- при смене фильтра страница возвращается на первую;
- в каждой строке \`<select className="status-select">\`; при изменении вызывается \`onChangeStatus(id, newStatus)\`.

Даты приходят в формате ГГГГ-ММ-ДД.`,
    requirements: [
      'Пять записей на страницу',
      'Фильтр по статусу',
      'Сортировка по дате переключается',
      'Смена фильтра сбрасывает страницу на первую',
      'Смена статуса вызывает onChangeStatus',
    ],
    starterCode: `function AdminTable({ applications, onChangeStatus }) {
  // ваш код
}`,
    timeLimitMs: 15000,
    tests: [
      {
        id: 't1',
        name: 'На странице пять записей',
        type: 'react',
        code: `const items = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1, room: 'Зал', date: '2026-09-' + String(i + 1).padStart(2, '0'), status: 'Новая',
}));
return ctx.render('AdminTable', { applications: items, onChangeStatus: () => {} }).then(() => {
  const rows = ctx.$$('tbody tr');
  ctx.assert(rows.length === 5, 'На одной странице должно быть пять строк, найдено ' + rows.length, 5, rows.length);
});`,
        points: 4,
      },
      {
        id: 't2',
        name: 'Кнопки страниц',
        type: 'react',
        code: `const items = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1, room: 'Зал', date: '2026-09-' + String(i + 1).padStart(2, '0'), status: 'Новая',
}));
return ctx.render('AdminTable', { applications: items, onChangeStatus: () => {} }).then(() => {
  const pages = ctx.$$('.page');
  ctx.assert(pages.length === 3, 'Для 12 записей по 5 на страницу должно быть три кнопки, найдено ' + pages.length, 3, pages.length);
  const active = ctx.$$('.page.active');
  ctx.assert(active.length === 1, 'Активная страница должна быть отмечена классом active');
});`,
        points: 4,
      },
      {
        id: 't3',
        name: 'Переход на вторую страницу',
        type: 'react',
        code: `const items = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1, room: 'Зал ' + (i + 1), date: '2026-09-' + String(i + 1).padStart(2, '0'), status: 'Новая',
}));
return ctx.render('AdminTable', { applications: items, onChangeStatus: () => {} })
  .then(() => ctx.click(ctx.$$('.page')[1]))
  .then(() => {
    ctx.assert(ctx.text().includes('Зал 6'), 'На второй странице должна быть шестая запись');
    ctx.assert(!ctx.text().includes('Зал 1\\n'), 'Записи первой страницы показываться не должны');
  });`,
        points: 5,
      },
      {
        id: 't4',
        name: 'Фильтр по статусу',
        type: 'react',
        code: `const items = [
  { id: 1, room: 'A', date: '2026-09-01', status: 'Новая' },
  { id: 2, room: 'B', date: '2026-09-02', status: 'Мероприятие завершено' },
  { id: 3, room: 'C', date: '2026-09-03', status: 'Новая' },
];
return ctx.render('AdminTable', { applications: items, onChangeStatus: () => {} })
  .then(() => ctx.change('.filter', 'Новая'))
  .then(() => {
    const rows = ctx.$$('tbody tr');
    ctx.assert(rows.length === 2, 'После фильтра «Новая» должно остаться две строки, найдено ' + rows.length, 2, rows.length);
  });`,
        points: 5,
      },
      {
        id: 't5',
        name: 'Сортировка по дате переключается',
        type: 'react',
        code: `const items = [
  { id: 1, room: 'Первый', date: '2026-09-01', status: 'Новая' },
  { id: 2, room: 'Последний', date: '2026-09-20', status: 'Новая' },
];
return ctx.render('AdminTable', { applications: items, onChangeStatus: () => {} })
  .then(() => {
    const firstRow = ctx.$('tbody tr').textContent;
    ctx.assert(firstRow.includes('Первый'), 'Изначально сортировка по возрастанию даты');
    return ctx.click(ctx.$('.sort-date'));
  })
  .then(() => {
    const firstRow = ctx.$('tbody tr').textContent;
    ctx.assert(firstRow.includes('Последний'), 'После клика порядок должен смениться на убывающий');
  });`,
        points: 5,
      },
      {
        id: 't6',
        name: 'Смена фильтра сбрасывает страницу',
        type: 'react',
        code: `const items = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1, room: 'Зал ' + (i + 1), date: '2026-09-' + String(i + 1).padStart(2, '0'),
  status: i < 3 ? 'Новая' : 'Мероприятие завершено',
}));
// Компонент между проверками не пересоздаётся, поэтому сбрасываем фильтр
// и уходим на последнюю доступную страницу, какой бы она ни была.
return ctx.render('AdminTable', { applications: items, onChangeStatus: () => {} })
  .then(() => ctx.change('.filter', ''))
  .then(() => {
    const pages = ctx.$$('.page');
    ctx.assert(pages.length >= 2, 'При двенадцати записях страниц должно быть несколько, найдено: ' + pages.length);
    return ctx.click(pages[pages.length - 1]);
  })
  .then(() => ctx.change('.filter', 'Новая'))
  .then(() => {
    const rows = ctx.$$('tbody tr');
    ctx.assert(rows.length === 3, 'После смены фильтра должны показаться три подходящие записи, найдено ' + rows.length + '. Не забудьте вернуть страницу на первую');
  });`,
        points: 6,
      },
      {
        id: 't7',
        name: 'Смена статуса вызывает обработчик',
        type: 'react',
        code: `let received = null;
const items = [{ id: 7, room: 'A', date: '2026-09-01', status: 'Новая' }];
return ctx.render('AdminTable', { applications: items, onChangeStatus: (id, status) => { received = { id, status }; } })
  .then(() => ctx.change('.status-select', 'Мероприятие назначено'))
  .then(() => {
    ctx.assert(received, 'При выборе статуса должен вызываться onChangeStatus');
    ctx.assert(received.id === 7, 'Первым аргументом должен быть id заявки, получено ' + ctx.preview(received.id));
    ctx.assert(received.status === 'Мероприятие назначено', 'Вторым аргументом — новый статус');
  });`,
        points: 6,
      },
    ],
    hints: [
      { level: 1, text: 'Три состояния: фильтр, направление сортировки и номер страницы. Всё остальное вычисляется при отрисовке.', penaltyPercent: 10 },
      { level: 2, text: 'Порядок вычислений: filter → [...].sort → slice. Число страниц: Math.ceil(длина / 5).', penaltyPercent: 20 },
      {
        level: 3,
        text: 'В обработчике фильтра делайте два вызова: setStatus(value) и setPage(1). Иначе пользователь останется на несуществующей странице.',
        penaltyPercent: 35,
      },
    ],
    solution: `const PER_PAGE = 5;
const STATUSES = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'];

function toRuDate(iso) {
  const [year, month, day] = iso.split('-');
  return \`\${day}.\${month}.\${year}\`;
}

function AdminTable({ applications, onChangeStatus }) {
  const [status, setStatus] = React.useState('');
  const [ascending, setAscending] = React.useState(true);
  const [page, setPage] = React.useState(1);

  const filtered = status ? applications.filter((item) => item.status === status) : applications;
  const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date) * (ascending ? 1 : -1));
  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const visible = sorted.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <div>
      <select
        className="filter form-select mb-3"
        value={status}
        onChange={(event) => {
          setStatus(event.target.value);
          setPage(1);                       // возвращаемся на первую страницу
        }}
      >
        <option value="">Все статусы</option>
        {STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th scope="col">№</th>
              <th scope="col">Помещение</th>
              <th scope="col">
                <button type="button" className="sort-date btn btn-link p-0" onClick={() => setAscending((prev) => !prev)}>
                  Дата {ascending ? '↑' : '↓'}
                </button>
              </th>
              <th scope="col">Статус</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.room}</td>
                <td>{toRuDate(item.date)}</td>
                <td>
                  <select
                    className="status-select form-select form-select-sm"
                    value={item.status}
                    onChange={(event) => onChangeStatus(item.id, event.target.value)}
                  >
                    {STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav aria-label="Постраничная навигация">
        <ul className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <li className="page-item" key={number}>
              <button
                type="button"
                className={\`page page-link \${number === safePage ? 'active' : ''}\`}
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}`,
    solutionExplanation:
      'Все три инструмента модуля 2 — фильтр, сортировка и постраничная навигация — работают на трёх переменных состояния. Видимый список каждый раз вычисляется заново, поэтому данные не могут разъехаться. Сброс страницы при смене фильтра — деталь, которую программа отмечает отдельно.',
    maxScore: 35,
    estimatedMinutes: 55,
    examRefs: ['m2-admin-tools', 'm1-admin'],
    planDays: ['day-12-3', 'day-12-4'],
    source: 'plan',
  },
];
