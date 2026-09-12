import type { Task } from '../types';

/** Сборки недель 17-20: сборка приложения, админка, прогоны, отделка. */
export const WEEK_ASSEMBLY_M5: Task[] = [
  {
    id: 'task-week-17-assembly',
    title: 'Сборка недели 17: пройти путь пользователя и починить его',
    kind: 'fix-bug',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['fullstack-auth-flow', 'fullstack-cabinet', 'project-structure'],
    monthNo: 5,
    weekNo: 17,
    statement: `Приложение собрано и вроде работает. Пройдите его глазами того, кто видит впервые, — и найдёте пять мест, где путь ломается.

В компоненте \`App\` заложены пять ошибок пути:

1. после выхода имя пользователя остаётся на экране;
2. в кабинет попадает гость — проверки нет;
3. после успешной отправки заявки форма остаётся заполненной, и человек отправляет её второй раз;
4. дата в списке заявок показана в машинном виде \`2027-03-12\` вместо \`12.03.2027\`;
5. текст ссылки на регистрацию переписан своими словами, а задание требует дословный.

Почините все пять. Разметку и структуру менять не нужно — только поведение.`,
    requirements: [
      'Выход убирает имя пользователя',
      'Гость в кабинет не попадает',
      'После отправки заявки форма очищается',
      'Дата выводится в формате ДД.ММ.ГГГГ',
      'Текст ссылки на регистрацию взят из задания дословно',
    ],
    starterCode: `function App() {
  const [user, setUser] = React.useState(null);
  const [page, setPage] = React.useState('/');
  const [room, setRoom] = React.useState('');
  const [date, setDate] = React.useState('');
  const [applications, setApplications] = React.useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!room || !date) return;
    setApplications((prev) => [...prev, { id: prev.length + 1, room, date }]);
    // 3. форма остаётся заполненной
  };

  return (
    <div>
      <header>
        <span id="greeting">{user ? 'Добрый день, ' + user : 'Гость'}</span>
        <button id="auth" type="button" onClick={() => (user ? setPage('/') : setUser('Иванов Илья'))}>
          {user ? 'Выйти' : 'Войти'}
        </button>
        {/* 5. текст ссылки переписан своими словами */}
        <a href="/register">Зарегистрироваться</a>
        <button data-path="/cabinet" type="button" onClick={() => setPage('/cabinet')}>Кабинет</button>
        <button data-path="/order" type="button" onClick={() => setPage('/order')}>Заявка</button>
      </header>

      {page === '/order' ? (
        <form onSubmit={handleSubmit}>
          <input name="room" value={room} onChange={(event) => setRoom(event.target.value)} />
          <input name="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <button type="submit">Отправить</button>
        </form>
      ) : null}

      {page === '/cabinet' ? (
        <div id="cabinet">
          {/* 2. проверки на гостя нет */}
          {applications.map((item) => (
            <article className="card" key={item.id}>
              <h3>{item.room}</h3>
              {/* 4. дата в машинном виде */}
              <p>{item.date}</p>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}`,
    tests: [
      {
        id: 'logout',
        name: 'Выход убирает имя',
        type: 'react',
        code: `return ctx.render('App', {})
  .then(() => {
    if (ctx.$('#auth').textContent.trim() === 'Выйти') return ctx.click('#auth');
    return null;
  })
  .then(() => ctx.click('#auth'))
  .then(() => {
    ctx.assert(ctx.text('#greeting').indexOf('Иванов Илья') !== -1, 'После входа имя должно появиться');
    return ctx.click('#auth');
  })
  .then(() => {
    ctx.assert(
      ctx.text('#greeting') === 'Гость',
      'После выхода должно снова быть «Гость», сейчас: ' + ctx.text('#greeting') + '. Кнопка выхода не сбрасывает пользователя',
    );
  });`,
        points: 5,
      },
      {
        id: 'guard',
        name: 'Гость в кабинет не попадает',
        type: 'react',
        code: `return ctx.render('App', {})
  .then(() => {
    if (ctx.$('#auth').textContent.trim() === 'Выйти') return ctx.click('#auth');
    return null;
  })
  .then(() => ctx.click('[data-path="/cabinet"]'))
  .then(() => {
    ctx.assert(ctx.$$('.card').length === 0, 'Гость не должен видеть заявки');
    const text = ctx.text();
    ctx.assert(/войд|вход/i.test(text), 'Гостю нужно объяснить, что делать: сейчас на экране «' + text.slice(0, 80) + '»');
  });`,
        points: 5,
      },
      {
        id: 'form-reset',
        name: 'После отправки форма очищается',
        type: 'react',
        code: `return ctx.render('App', {})
  .then(() => {
    if (ctx.$('#auth').textContent.trim() === 'Войти') return ctx.click('#auth');
    return null;
  })
  .then(() => ctx.click('[data-path="/order"]'))
  .then(() => ctx.change('input[name="room"]', 'Коворкинг'))
  .then(() => ctx.change('input[name="date"]', '2027-03-12'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(
      ctx.$('input[name="room"]').value === '',
      'После отправки поле помещения должно опустеть, сейчас: ' + ctx.$('input[name="room"]').value,
    );
    ctx.assert(ctx.$('input[name="date"]').value === '', 'После отправки поле даты должно опустеть');
  });`,
        points: 5,
      },
      {
        id: 'date-format',
        name: 'Дата в человеческом формате',
        type: 'react',
        code: `return ctx.render('App', {})
  .then(() => {
    if (ctx.$('#auth').textContent.trim() === 'Войти') return ctx.click('#auth');
    return null;
  })
  .then(() => ctx.click('[data-path="/order"]'))
  .then(() => ctx.change('input[name="room"]', 'Кинозал'))
  .then(() => ctx.change('input[name="date"]', '2027-04-19'))
  .then(() => ctx.submit('form'))
  .then(() => ctx.click('[data-path="/cabinet"]'))
  .then(() => {
    const text = ctx.text('#cabinet');
    ctx.assert(text.indexOf('19.04.2027') !== -1, 'Дата должна выводиться как 19.04.2027, сейчас: ' + text);
    ctx.assert(text.indexOf('2027-04-19') === -1, 'Машинный формат даты пользователю показывать не нужно');
  });`,
        points: 6,
      },
      {
        id: 'exact-link',
        name: 'Текст ссылки дословный',
        type: 'react',
        code: `return ctx.render('App', {}).then(() => {
  const texts = ctx.$$('a').map((link) => link.textContent.replace(/\\s+/g, ' ').trim());
  const expected = 'Еще не зарегистрированы? Регистрация';
  ctx.assert(
    texts.indexOf(expected) !== -1,
    'Задание приводит текст дословно: «' + expected + '». Сейчас на странице: ' + texts.join(' | '),
    expected,
    texts.join(' | '),
  );
});`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Выход — это setUser(null), а не переход на главную. Сейчас кнопка только меняет страницу.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Очистка формы после отправки — два вызова: setRoom("") и setDate(""). Без них повторное нажатие создаст дубль заявки.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Дата: {item.date.split("-").reverse().join(".")}. Гость: {user ? <список/> : <p>Войдите, чтобы посмотреть кабинет</p>}.',
        penaltyPercent: 35,
      },
    ],
    solution: `function App() {
  const [user, setUser] = React.useState(null);
  const [page, setPage] = React.useState('/');
  const [room, setRoom] = React.useState('');
  const [date, setDate] = React.useState('');
  const [applications, setApplications] = React.useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!room || !date) return;
    setApplications((prev) => [...prev, { id: prev.length + 1, room, date }]);
    setRoom('');
    setDate('');
  };

  return (
    <div>
      <header>
        <span id="greeting">{user ? 'Добрый день, ' + user : 'Гость'}</span>
        <button
          id="auth"
          type="button"
          onClick={() => {
            if (user) {
              setUser(null);
              setPage('/');
            } else {
              setUser('Иванов Илья');
            }
          }}
        >
          {user ? 'Выйти' : 'Войти'}
        </button>
        <a href="/register">Еще не зарегистрированы? Регистрация</a>
        <button data-path="/cabinet" type="button" onClick={() => setPage('/cabinet')}>Кабинет</button>
        <button data-path="/order" type="button" onClick={() => setPage('/order')}>Заявка</button>
      </header>

      {page === '/order' ? (
        <form onSubmit={handleSubmit}>
          <input name="room" value={room} onChange={(event) => setRoom(event.target.value)} />
          <input name="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <button type="submit">Отправить</button>
        </form>
      ) : null}

      {page === '/cabinet' ? (
        <div id="cabinet">
          {user ? (
            applications.map((item) => (
              <article className="card" key={item.id}>
                <h3>{item.room}</h3>
                <p>{item.date.split('-').reverse().join('.')}</p>
              </article>
            ))
          ) : (
            <p>Войдите, чтобы посмотреть кабинет</p>
          )}
        </div>
      ) : null}
    </div>
  );
}`,
    solutionExplanation:
      'Все пять ошибок объединяет одно: по отдельности каждая выглядит мелочью, а вместе они превращают приложение в неработающее. Именно поэтому путь проходят целиком и подряд, а не проверяют экраны по одному. Самая неприятная из пяти — незачищенная форма: она не ломает ничего видимого, но приводит к дублям заявок, и заметить их можно только в базе. Выход, который не сбрасывает пользователя, — вторая по частоте: кнопка есть, вид меняется, а сессия остаётся.',
    maxScore: 25,
    estimatedMinutes: 40,
    examRefs: ['m1-login', 'm1-cabinet', 'm1-order'],
    planDays: ['day-17-7'],
    source: 'plan',
  },

  {
    id: 'task-week-18-assembly',
    title: 'Сборка недели 18: админка по чек-листу модуля 2',
    kind: 'app',
    runtime: 'react',
    difficulty: 5,
    tech: ['react'],
    topicIds: ['admin-panel', 'react-admin-ui'],
    monthNo: 5,
    weekNo: 18,
    statement: `Модуль 2 перечисляет для админки четыре вещи: «фильтры, всплывающие окна уведомлений, постраничная навигация и возможность сортировки данных». Соберите всё сразу — и пройдитесь по списку требований, отмечая каждое.

Компонент \`AdminPanel\` принимает \`{ visits, onChangeStatus }\`.

1. **Фильтр** \`#filter\` по статусу; пустое значение — все.
2. **Сортировка** по дате: кнопка \`#sort-date\`, первый клик — по возрастанию, второй — по убыванию. Дата приходит в формате ДД.ММ.ГГГГ.
3. **Постраничная навигация**: по **3** записи на странице. Кнопки \`#prev\` и \`#next\`, номер страницы в \`#page\` вида \`1 из 2\`. При смене фильтра страница сбрасывается на первую.
4. **Уведомление**: после успешной смены статуса появляется \`#toast\` «Статус изменён» и само исчезает через 3 секунды.
5. Смена статуса обновляет строку на месте.`,
    requirements: [
      'Фильтр по статусу работает',
      'Сортировка по дате переключает направление',
      'На странице не больше трёх записей',
      'Кнопки перелистывания работают, номер страницы виден',
      'Смена фильтра возвращает на первую страницу',
      'После смены статуса появляется уведомление и само исчезает',
    ],
    starterCode: `const STATUSES = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'];
const PAGE_SIZE = 3;

function AdminPanel({ visits, onChangeStatus }) {
  // фильтр, сортировка, страницы, уведомление
}`,
    tests: [
      {
        id: 'pagination',
        name: 'Страница показывает три записи',
        type: 'react',
        code: `const visits = [1, 2, 3, 4, 5].map((n) => ({
  id: n, client: 'Клиент ' + n, room: 'Зал ' + n,
  date: '0' + n + '.03.2027', status: n % 2 ? 'Новая' : 'Мероприятие завершено',
}));
return ctx.render('AdminPanel', { visits, onChangeStatus: () => Promise.resolve() })
  .then(() => ctx.change('#filter', ''))
  .then(() => {
    ctx.assert(ctx.$$('tbody tr').length === 3, 'На странице должно быть три записи, найдено: ' + ctx.$$('tbody tr').length);
    ctx.assert(ctx.text('#page').indexOf('1 из 2') !== -1, 'Номер страницы должен быть «1 из 2», сейчас: ' + ctx.text('#page'));
  });`,
        points: 5,
      },
      {
        id: 'next-page',
        name: 'Перелистывание работает',
        type: 'react',
        code: `const visits = [1, 2, 3, 4, 5].map((n) => ({
  id: n, client: 'Клиент ' + n, room: 'Зал ' + n,
  date: '0' + n + '.03.2027', status: n % 2 ? 'Новая' : 'Мероприятие завершено',
}));
return ctx.render('AdminPanel', { visits, onChangeStatus: () => Promise.resolve() })
  .then(() => ctx.change('#filter', ''))
  .then(() => ctx.click('#next'))
  .then(() => {
    ctx.assert(ctx.$$('tbody tr').length === 2, 'На второй странице должно остаться две записи, найдено: ' + ctx.$$('tbody tr').length);
    ctx.assert(ctx.text('#page').indexOf('2 из 2') !== -1, 'Номер страницы должен быть «2 из 2», сейчас: ' + ctx.text('#page'));
    return ctx.click('#prev');
  })
  .then(() => {
    ctx.assert(ctx.$$('tbody tr').length === 3, 'Возврат на первую страницу не сработал');
  });`,
        points: 6,
      },
      {
        id: 'filter-resets-page',
        name: 'Смена фильтра возвращает на первую страницу',
        type: 'react',
        code: `const visits = [1, 2, 3, 4, 5].map((n) => ({
  id: n, client: 'Клиент ' + n, room: 'Зал ' + n,
  date: '0' + n + '.03.2027', status: n % 2 ? 'Новая' : 'Мероприятие завершено',
}));
return ctx.render('AdminPanel', { visits, onChangeStatus: () => Promise.resolve() })
  .then(() => ctx.change('#filter', ''))
  .then(() => ctx.click('#next'))
  .then(() => ctx.change('#filter', 'Новая'))
  .then(() => {
    ctx.assert(
      ctx.text('#page').indexOf('1 из') !== -1,
      'После смены фильтра нужно вернуться на первую страницу, сейчас: ' + ctx.text('#page') +
        '. Иначе пользователь видит пустой экран на несуществующей странице',
    );
    ctx.assert(ctx.$$('tbody tr').length === 3, 'Новых записей три, все должны поместиться на странице');
  });`,
        points: 6,
      },
      {
        id: 'sort',
        name: 'Сортировка по дате',
        type: 'react',
        code: `const visits = [
  { id: 1, client: 'А', room: 'Зал 1', date: '19.04.2027', status: 'Новая' },
  { id: 2, client: 'Б', room: 'Зал 2', date: '05.02.2027', status: 'Новая' },
  { id: 3, client: 'В', room: 'Зал 3', date: '12.03.2027', status: 'Новая' },
];
return ctx.render('AdminPanel', { visits, onChangeStatus: () => Promise.resolve() })
  .then(() => ctx.change('#filter', 'Новая'))
  .then(() => ctx.click('#sort-date'))
  .then(() => {
    // Компонент между проверками не пересоздаётся, поэтому проверяем сам
    // порядок, а не конкретные даты.
    const iso = (date) => date.split('.').reverse().join('-');
    const read = () => ctx.$$('tbody tr').map((row) => iso(row.textContent.match(/\\d{2}\\.\\d{2}\\.\\d{4}/)[0]));
    const first = read();
    ctx.assert(first.length >= 2, 'Для проверки сортировки нужно минимум две строки');
    const ascending = first.slice().sort();
    ctx.assert(
      first.join(',') === ascending.join(','),
      'После первого клика даты должны идти по возрастанию, получено: ' + first.join(', '),
    );
    return ctx.click('#sort-date').then(() => {
      const second = read();
      ctx.assert(
        second.join(',') === ascending.slice().reverse().join(','),
        'После второго клика порядок должен смениться на обратный, получено: ' + second.join(', '),
      );
    });
  });`,
        points: 6,
      },
      {
        id: 'toast',
        name: 'Уведомление появляется и исчезает',
        type: 'react',
        code: `const visits = [{ id: 1, client: 'А', room: 'Зал 1', date: '12.03.2027', status: 'Новая' }];
return ctx.render('AdminPanel', { visits, onChangeStatus: () => Promise.resolve() })
  .then(() => ctx.change('#filter', ''))
  .then(() => ctx.change('select.status', 'Мероприятие назначено'))
  .then(() => ctx.advanceTime(50))
  .then(() => {
    const toast = ctx.$('#toast');
    ctx.assert(toast, 'После смены статуса должно появиться уведомление #toast');
    ctx.assert(toast.textContent.indexOf('Статус изменён') !== -1, 'Текст уведомления: ' + toast.textContent);
    return ctx.advanceTime(3200);
  })
  .then(() => {
    ctx.assert(!ctx.$('#toast'), 'Через 3 секунды уведомление должно исчезнуть');
  });`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'В состоянии держите только выбор пользователя: фильтр, направление сортировки, номер страницы. Видимый список вычисляется в три шага: отфильтровать, отсортировать, отрезать страницу.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Сброс страницы при смене фильтра делается в обработчике фильтра: setFilter(value); setPage(1).',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const start = (page - 1) * PAGE_SIZE; const visible = sorted.slice(start, start + PAGE_SIZE); const total = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));',
        penaltyPercent: 35,
      },
    ],
    solution: `const STATUSES = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'];
const PAGE_SIZE = 3;

function AdminPanel({ visits, onChangeStatus }) {
  const [items, setItems] = React.useState(visits);
  const [filter, setFilter] = React.useState('');
  const [direction, setDirection] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [toast, setToast] = React.useState(false);

  React.useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const iso = (date) => date.split('.').reverse().join('-');

  const filtered = items.filter((item) => !filter || item.status === filter);
  const sorted = direction
    ? filtered.slice().sort((a, b) => {
        const result = iso(a.date).localeCompare(iso(b.date));
        return direction === 'asc' ? result : -result;
      })
    : filtered;

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const visible = sorted.slice(start, start + PAGE_SIZE);

  const changeFilter = (value) => {
    setFilter(value);
    setPage(1);
  };

  const handleStatus = (item, status) => {
    const previous = item.status;
    setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, status } : row)));

    onChangeStatus(item.id, status)
      .then(() => setToast(true))
      .catch(() => setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, status: previous } : row))));
  };

  return (
    <div>
      <label htmlFor="filter">Статус</label>
      <select id="filter" value={filter} onChange={(event) => changeFilter(event.target.value)}>
        <option value="">Все</option>
        {STATUSES.map((status) => (
          <option value={status} key={status}>
            {status}
          </option>
        ))}
      </select>

      <table id="visits">
        <thead>
          <tr>
            <th>№</th>
            <th>Клиент</th>
            <th>Зал</th>
            <th>
              <button id="sort-date" type="button" onClick={() => setDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}>
                Дата
              </button>
            </th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.client}</td>
              <td>{item.room}</td>
              <td>{item.date}</td>
              <td>
                <select
                  className="status"
                  value={item.status}
                  onChange={(event) => handleStatus(item, event.target.value)}
                >
                  {STATUSES.map((status) => (
                    <option value={status} key={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button id="prev" type="button" onClick={() => setPage((p) => Math.max(1, p - 1))}>
        Назад
      </button>
      <span id="page">
        {current} из {totalPages}
      </span>
      <button id="next" type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
        Вперёд
      </button>

      {toast ? <div id="toast">Статус изменён</div> : null}
    </div>
  );
}`,
    solutionExplanation:
      'Видимый список получается в три шага из исходного: отфильтровать, отсортировать, отрезать страницу. Порядок обязателен — если сначала отрезать страницу, а потом фильтровать, на экране окажется случайное количество строк. Выражение Math.min(page, totalPages) закрывает случай, когда после фильтра страниц стало меньше, чем текущий номер: без него пользователь увидит пустой экран и решит, что данных нет. Сброс страницы при смене фильтра — то же самое, только явно и заранее.',
    maxScore: 29,
    estimatedMinutes: 50,
    examRefs: ['m2-admin-tools', 'm1-admin'],
    planDays: ['day-18-7'],
    source: 'plan',
  },

  {
    id: 'task-week-19-assembly',
    title: 'Лёгкий день: пять коротких помощников по памяти',
    kind: 'function',
    runtime: 'js',
    difficulty: 2,
    tech: ['js'],
    topicIds: ['memory-training'],
    monthNo: 5,
    weekNo: 19,
    statement: `После недели прогонов голове нужен отдых — это часть программы, а не поблажка. Поэтому сегодня коротко: пять однострочных помощников, которые вы писали уже десяток раз. Пятнадцать минут, без напряжения.

1. \`toRuDate('2027-03-12')\` → \`'12.03.2027'\`.
2. \`digitsOnly('+7 (900) 123-45-67')\` → \`'79001234567'\`.
3. \`isValidLogin(login)\` — латиница и цифры, минимум 6 символов.
4. \`byId(items, id)\` — элемент с таким \`id\` или \`undefined\`.
5. \`formatPrice(1500.5)\` → \`'1 500,50 ₽'\`: разряды разделены неразрывным пробелом, копейки через запятую, в конце знак рубля.

Если что-то не вспомнилось за минуту — не мучайтесь, посмотрите в свои записи и выпишите ещё раз. Сегодня цель не проверить, а закрепить.`,
    requirements: [
      'toRuDate переворачивает дату',
      'digitsOnly оставляет только цифры',
      'isValidLogin проверяет латиницу и длину',
      'byId находит элемент или возвращает undefined',
      'formatPrice разделяет разряды и добавляет копейки',
    ],
    starterCode: `function toRuDate(iso) {
  // '2027-03-12' -> '12.03.2027'
}

function digitsOnly(value) {
  // оставить только цифры
}

function isValidLogin(login) {
  // латиница и цифры, минимум 6 символов
}

function byId(items, id) {
  // элемент с таким id
}

function formatPrice(value) {
  // 1500.5 -> '1 500,50 ₽'
}`,
    tests: [
      { id: 'date', name: 'toRuDate', type: 'call', entry: 'toRuDate', args: ['2027-03-12'], expected: '12.03.2027', points: 2 },
      { id: 'date-pad', name: 'Нули сохраняются', type: 'call', entry: 'toRuDate', args: ['2027-01-05'], expected: '05.01.2027', points: 2 },
      {
        id: 'digits',
        name: 'digitsOnly',
        type: 'call',
        entry: 'digitsOnly',
        args: ['+7 (900) 123-45-67'],
        expected: '79001234567',
        points: 3,
      },
      {
        id: 'login',
        name: 'isValidLogin',
        type: 'assert',
        code: `const isValidLogin = ctx.get('isValidLogin');
ctx.assert(isValidLogin('ivanov26') === true, 'ivanov26 должен проходить');
ctx.assert(isValidLogin('ivan') === false, 'Короткий логин проходить не должен');
ctx.assert(isValidLogin('иванов26') === false, 'Кириллица проходить не должна');
ctx.assert(isValidLogin('ivanov 26') === false, 'Пробел проходить не должен');`,
        points: 4,
      },
      {
        id: 'by-id',
        name: 'byId',
        type: 'assert',
        code: `const byId = ctx.get('byId');
const items = [{ id: 1, title: 'А' }, { id: 2, title: 'Б' }];
ctx.assert(byId(items, 2) && byId(items, 2).title === 'Б', 'Не найден элемент с id 2');
ctx.assert(byId(items, 99) === undefined, 'Для отсутствующего id нужно вернуть undefined');`,
        points: 3,
      },
      {
        id: 'price',
        name: 'formatPrice',
        type: 'assert',
        code: `const formatPrice = ctx.get('formatPrice');
const clean = (value) => String(value).replace(/\\u00a0|\\u202f/g, ' ');
ctx.assert(clean(formatPrice(1500.5)) === '1 500,50 ₽', 'Ожидалось «1 500,50 ₽», получено: «' + formatPrice(1500.5) + '»');
ctx.assert(clean(formatPrice(999)) === '999,00 ₽', 'Ожидалось «999,00 ₽», получено: «' + formatPrice(999) + '»');
ctx.assert(clean(formatPrice(1234567.89)) === '1 234 567,89 ₽', 'Ожидалось «1 234 567,89 ₽», получено: «' + formatPrice(1234567.89) + '»');`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Четыре из пяти пишутся в одну строку. Пятая — тоже, если вспомнить про встроенное форматирование чисел.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Форматирование денег умеет сам язык: value.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'return value.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₽";',
        penaltyPercent: 35,
      },
    ],
    solution: `function toRuDate(iso) {
  return iso.split('-').reverse().join('.');
}

function digitsOnly(value) {
  return String(value).replace(/\\D/g, '');
}

function isValidLogin(login) {
  return /^[A-Za-z0-9]{6,}$/.test(String(login));
}

function byId(items, id) {
  return items.find((item) => item.id === id);
}

function formatPrice(value) {
  return value.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₽';
}`,
    solutionExplanation:
      'Форматирование денег отдано языку не из лени: правила разбивки на разряды и знак дробной части зависят от языка, и писать их руками — значит однажды ошибиться. Метод find возвращает undefined сам, когда ничего не нашёл, поэтому byId не нуждается ни в каких проверках. Смысл лёгкого дня в том, чтобы эти пять строк писались не задумываясь: на экзамене они встретятся в каждом втором файле, и каждая секунда, потраченная на вспоминание, — это секунда, не потраченная на задачу.',
    maxScore: 19,
    estimatedMinutes: 15,
    examRefs: ['m3-quality'],
    planDays: ['day-19-7'],
    source: 'plan',
  },

  {
    id: 'task-week-20-assembly',
    title: 'Контроль месяца 5: два модуля подряд',
    kind: 'app',
    runtime: 'react',
    difficulty: 5,
    tech: ['react'],
    topicIds: ['ui-polish', 'admin-panel', 'fullstack-cabinet'],
    monthNo: 5,
    weekNo: 20,
    statement: `Контроль за пятый месяц. Впервые идём два модуля подряд, без перерыва — так же, как будет на экзамене.

Компонент \`App\` принимает \`{ visits, onChangeStatus }\` и собирает требования обоих модулей сразу.

**Из модуля 1:**

1. вход и выход: кнопка \`#auth\`, имя в \`#greeting\`, для гостя «Гость»;
2. кабинет \`[data-path="/cabinet"]\` закрыт от гостя: вместо данных блок \`#guard\`;
3. заявки карточками \`.card\` с датой в формате ДД.ММ.ГГГГ.

**Из модуля 2:**

4. слайдер в кабинете: четыре слайда \`.slide\`, активен один, автопереключение через 3 секунды;
5. админка \`[data-path="/admin"]\` доступна только роли \`admin\`, в ней таблица \`#orders\` с фильтром \`#filter\` по статусу;
6. смена статуса в админке показывает уведомление \`#toast\` «Статус изменён», которое исчезает через 3 секунды.

Вход выполняется как администратор: \`{ name: 'Администратор', role: 'admin' }\`.

Записывайте время каждого модуля отдельно — по нему потом видно, какой из них проседает.`,
    requirements: [
      'Вход и выход меняют приветствие',
      'Кабинет закрыт от гостя',
      'Заявки выводятся карточками с датой ДД.ММ.ГГГГ',
      'В кабинете работает слайдер с автопереключением',
      'Админка доступна только администратору',
      'Фильтр в админке работает',
      'Смена статуса показывает исчезающее уведомление',
    ],
    starterCode: `const STATUSES = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'];
const SLIDES = ['Аудитория', 'Коворкинг', 'Кинозал', 'Переговорная'];

function App({ visits, onChangeStatus }) {
  // два модуля сразу: вход, кабинет, слайдер, админка
}`,
    tests: [
      {
        id: 'auth',
        name: 'Вход и выход',
        type: 'react',
        code: `const visits = [{ id: 1, room: 'Коворкинг', date: '2027-03-12', status: 'Новая' }];
return ctx.render('App', { visits, onChangeStatus: () => Promise.resolve() })
  .then(() => {
    if (ctx.$('#auth').textContent.trim() === 'Выйти') return ctx.click('#auth');
    return null;
  })
  .then(() => {
    ctx.assert(ctx.text('#greeting') === 'Гость', 'До входа должно быть «Гость», сейчас: ' + ctx.text('#greeting'));
    return ctx.click('#auth');
  })
  .then(() => {
    ctx.assert(ctx.text('#greeting').indexOf('Администратор') !== -1, 'После входа должно появиться имя, сейчас: ' + ctx.text('#greeting'));
  });`,
        points: 4,
      },
      {
        id: 'guard',
        name: 'Кабинет закрыт от гостя',
        type: 'react',
        code: `const visits = [{ id: 1, room: 'Коворкинг', date: '2027-03-12', status: 'Новая' }];
return ctx.render('App', { visits, onChangeStatus: () => Promise.resolve() })
  .then(() => {
    if (ctx.$('#auth').textContent.trim() === 'Выйти') return ctx.click('#auth');
    return null;
  })
  .then(() => ctx.click('[data-path="/cabinet"]'))
  .then(() => {
    ctx.assert(ctx.$('#guard'), 'Гость на кабинете должен видеть блок #guard');
    ctx.assert(ctx.$$('.card').length === 0, 'Гость не должен видеть заявки');
    ctx.assert(ctx.$$('.slide').length === 0, 'Гость не должен видеть слайдер');
  });`,
        points: 5,
      },
      {
        id: 'cabinet',
        name: 'Кабинет с карточками и слайдером',
        type: 'react',
        code: `const visits = [
  { id: 1, room: 'Коворкинг', date: '2027-03-12', status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '2027-04-19', status: 'Мероприятие завершено' },
];
return ctx.render('App', { visits, onChangeStatus: () => Promise.resolve() })
  .then(() => {
    if (ctx.$('#auth').textContent.trim() === 'Войти') return ctx.click('#auth');
    return null;
  })
  .then(() => ctx.click('[data-path="/cabinet"]'))
  .then(() => {
    ctx.assert(!ctx.$('#guard'), 'Вошедшему блок #guard не нужен');
    ctx.assert(ctx.$$('.card').length >= 1, 'В кабинете должны быть карточки заявок');
    const text = ctx.text();
    ctx.assert(/\\d{2}\\.\\d{2}\\.\\d{4}/.test(text), 'Дата должна быть в формате ДД.ММ.ГГГГ, сейчас на экране: ' + text.slice(0, 120));
    ctx.assert(!/\\d{4}-\\d{2}-\\d{2}/.test(text), 'Машинный формат даты показывать не нужно');
    ctx.assert(ctx.$$('.slide').length === 4, 'Слайдов должно быть четыре, найдено: ' + ctx.$$('.slide').length);
    ctx.assert(ctx.$$('.slide.active').length === 1, 'Активным должен быть ровно один слайд');
  });`,
        points: 6,
      },
      {
        id: 'slider-autoplay',
        name: 'Слайдер листается сам',
        type: 'react',
        code: `const visits = [{ id: 1, room: 'Коворкинг', date: '2027-03-12', status: 'Новая' }];
return ctx.render('App', { visits, onChangeStatus: () => Promise.resolve() })
  .then(() => {
    if (ctx.$('#auth').textContent.trim() === 'Войти') return ctx.click('#auth');
    return null;
  })
  .then(() => ctx.click('[data-path="/cabinet"]'))
  .then(() => {
    const slides = ctx.$$('.slide');
    const before = slides.map((slide) => slide.className.indexOf('active') !== -1).indexOf(true);
    return ctx.advanceTime(3400).then(() => {
      const after = ctx.$$('.slide').map((slide) => slide.className.indexOf('active') !== -1).indexOf(true);
      ctx.assert(after !== before, 'За 3.4 секунды слайд не сменился: нужен setInterval на 3000 мс');
    });
  });`,
        points: 5,
      },
      {
        id: 'admin-filter',
        name: 'Админка с фильтром',
        type: 'react',
        code: `const visits = [
  { id: 1, room: 'Коворкинг', date: '2027-03-12', status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '2027-04-19', status: 'Мероприятие завершено' },
];
return ctx.render('App', { visits, onChangeStatus: () => Promise.resolve() })
  .then(() => {
    if (ctx.$('#auth').textContent.trim() === 'Войти') return ctx.click('#auth');
    return null;
  })
  .then(() => ctx.click('[data-path="/admin"]'))
  .then(() => {
    ctx.assert(ctx.$('#orders'), 'Администратор должен видеть таблицу #orders');
    return ctx.change('#filter', 'Новая');
  })
  .then(() => {
    const rows = ctx.$$('#orders tbody tr');
    ctx.assert(rows.length === 1, 'После фильтра должна остаться одна строка, найдено: ' + rows.length);
    ctx.assert(rows[0].textContent.indexOf('Коворкинг') !== -1, 'Осталась не та строка: ' + rows[0].textContent);
  });`,
        points: 6,
      },
      {
        id: 'toast',
        name: 'Уведомление после смены статуса',
        type: 'react',
        code: `const visits = [{ id: 1, room: 'Коворкинг', date: '2027-03-12', status: 'Новая' }];
return ctx.render('App', { visits, onChangeStatus: () => Promise.resolve() })
  .then(() => {
    if (ctx.$('#auth').textContent.trim() === 'Войти') return ctx.click('#auth');
    return null;
  })
  .then(() => ctx.click('[data-path="/admin"]'))
  .then(() => ctx.change('#filter', ''))
  .then(() => ctx.change('select.status', 'Мероприятие назначено'))
  .then(() => ctx.advanceTime(50))
  .then(() => {
    const toast = ctx.$('#toast');
    ctx.assert(toast, 'После смены статуса должно появиться уведомление');
    ctx.assert(toast.textContent.indexOf('Статус изменён') !== -1, 'Текст уведомления: ' + toast.textContent);
    return ctx.advanceTime(3200);
  })
  .then(() => {
    ctx.assert(!ctx.$('#toast'), 'Через 3 секунды уведомление должно исчезнуть');
  });`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Соберите каркас целиком, прежде чем доводить детали: состояние пользователя, состояние страницы, и три ветки вывода.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Хуки для слайдера и уведомления должны стоять выше любых условных возвратов: порядок вызова хуков обязан быть одинаковым при каждой отрисовке.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Два эффекта: один с setInterval на слайдер, второй с setTimeout на уведомление. Оба возвращают функцию очистки.',
        penaltyPercent: 35,
      },
    ],
    solution: `const STATUSES = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'];
const SLIDES = ['Аудитория', 'Коворкинг', 'Кинозал', 'Переговорная'];

function App({ visits, onChangeStatus }) {
  const [user, setUser] = React.useState(null);
  const [page, setPage] = React.useState('/');
  const [items, setItems] = React.useState(visits);
  const [filter, setFilter] = React.useState('');
  const [slide, setSlide] = React.useState(0);
  const [toast, setToast] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => setSlide((current) => (current + 1) % SLIDES.length), 3000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const toRu = (iso) => iso.split('-').reverse().join('.');

  const handleStatus = (item, status) => {
    const previous = item.status;
    setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, status } : row)));

    onChangeStatus(item.id, status)
      .then(() => setToast(true))
      .catch(() => setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, status: previous } : row))));
  };

  const visible = items.filter((item) => !filter || item.status === filter);

  return (
    <div>
      <header>
        <span id="greeting">{user ? 'Добрый день, ' + user.name : 'Гость'}</span>
        <button
          id="auth"
          type="button"
          onClick={() => (user ? setUser(null) : setUser({ name: 'Администратор', role: 'admin' }))}
        >
          {user ? 'Выйти' : 'Войти'}
        </button>
        <button data-path="/cabinet" type="button" onClick={() => setPage('/cabinet')}>Кабинет</button>
        <button data-path="/admin" type="button" onClick={() => setPage('/admin')}>Все заявки</button>
      </header>

      {page === '/cabinet' ? (
        user ? (
          <div>
            <div className="slider">
              {SLIDES.map((title, position) => (
                <div className={position === slide ? 'slide active' : 'slide'} key={title}>
                  {title}
                </div>
              ))}
            </div>
            {items.map((item) => (
              <article className="card" key={item.id}>
                <h3>{item.room}</h3>
                <p>{toRu(item.date)}</p>
                <p>{item.status}</p>
              </article>
            ))}
          </div>
        ) : (
          <p id="guard">Войдите, чтобы посмотреть кабинет</p>
        )
      ) : null}

      {page === '/admin' ? (
        user && user.role === 'admin' ? (
          <div>
            <label htmlFor="filter">Статус</label>
            <select id="filter" value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="">Все</option>
              {STATUSES.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </select>

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
                {visible.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.room}</td>
                    <td>{toRu(item.date)}</td>
                    <td>
                      <select
                        className="status"
                        value={item.status}
                        onChange={(event) => handleStatus(item, event.target.value)}
                      >
                        {STATUSES.map((status) => (
                          <option value={status} key={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p id="guard">Недостаточно прав</p>
        )
      ) : null}

      {toast ? <div id="toast">Статус изменён</div> : null}
    </div>
  );
}`,
    solutionExplanation:
      'Оба эффекта стоят в самом верху, до всякой логики и условий — это единственный способ не нарушить правило хуков при трёх ветках вывода. Уведомление вынесено за пределы веток страницы: оно относится ко всему приложению, а не к админке, и должно оставаться видимым, даже если пользователь успел перейти на другую страницу. Два модуля подряд собираются из уже отработанных кусков, и именно это проверяет контрольная: если каждый кусок пишется не задумываясь, два модуля укладываются в отведённое время.',
    maxScore: 32,
    estimatedMinutes: 150,
    examRefs: ['m1-login', 'm1-cabinet', 'm1-admin', 'm2-slider', 'm2-admin-tools'],
    planDays: ['day-20-7'],
    source: 'plan',
  },
];
