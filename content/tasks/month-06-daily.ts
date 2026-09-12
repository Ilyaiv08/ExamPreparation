import type { Task } from '../types';

/**
 * Месяц 6: практика для дней, у которых её не было.
 *
 * Месяц идёт по третьему модулю (качество, безопасность, состояния) и по
 * повторению на новых предметных областях. Поэтому задания второй половины
 * месяца намеренно повторяют структуру уже пройденного, но на других темах:
 * проверяется не память на текст, а перенос схемы.
 */
export const MONTH_06_DAILY_TASKS: Task[] = [
  {
    id: 'task-db-constraints-cascade',
    title: 'Доработка базы: ссылки в пустоту и удаление связанных записей',
    kind: 'db',
    runtime: 'sql',
    difficulty: 4,
    tech: ['sql'],
    topicIds: ['code-quality'],
    monthNo: 6,
    weekNo: 21,
    statement: `Третий модуль начинается с базы: её доводят до состояния, в котором неправильные данные записать физически нельзя.

1. Таблицы \`users\`, \`rooms\`, \`applications\`, \`reviews\` — как раньше, но с двумя добавлениями.
2. У \`applications.status\` — ограничение \`CHECK\`: допустимы только \`'Новая'\`, \`'Мероприятие назначено'\`, \`'Мероприятие завершено'\`. Опечатка в статусе должна отклоняться базой, а не только сервером.
3. У \`reviews.application_id\` — внешний ключ с \`ON DELETE CASCADE\`: удалили заявку — её отзыв уходит следом. Иначе в базе останется отзыв, который не к чему привязать.
4. У \`applications.user_id\` — внешний ключ с \`ON DELETE RESTRICT\`: пользователя с заявками удалить нельзя. Это осознанный выбор: заявки — история, которую нельзя терять молча.
5. Заполните: пользователя, два помещения, две заявки и один отзыв.

Разница между CASCADE и RESTRICT — суть дня. Отзыв без заявки бессмысленен, а заявка без пользователя — потерянная история.`,
    requirements: [
      'Четыре таблицы созданы со связями',
      'Статус ограничен списком допустимых значений',
      'Отзыв удаляется вместе с заявкой',
      'Пользователя с заявками удалить нельзя',
      'Данные добавлены',
    ],
    starterCode: `-- Финальная схема: ограничения, а не только договорённости

`,
    tests: [
      {
        id: 'tables',
        name: 'Таблицы созданы',
        type: 'sql-query',
        check: `SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('users', 'rooms', 'applications', 'reviews') ORDER BY name`,
        expectedRows: [['applications'], ['reviews'], ['rooms'], ['users']],
        ordered: true,
        points: 4,
      },
      {
        id: 'check-status',
        name: 'Неправильный статус база не принимает',
        type: 'sql-query',
        check: `SELECT CASE WHEN instr(upper(sql), 'CHECK') > 0 THEN 1 ELSE 0 END FROM sqlite_master WHERE type = 'table' AND name = 'applications'`,
        expectedRows: [[1]],
        points: 5,
      },
      {
        id: 'check-values',
        name: 'В ограничении перечислены все три статуса',
        type: 'sql-query',
        check: `SELECT CASE WHEN instr(sql, 'Новая') > 0 AND instr(sql, 'Мероприятие назначено') > 0 AND instr(sql, 'Мероприятие завершено') > 0 THEN 1 ELSE 0 END FROM sqlite_master WHERE type = 'table' AND name = 'applications'`,
        expectedRows: [[1]],
        points: 4,
      },
      {
        id: 'cascade',
        name: 'Отзыв удаляется вместе с заявкой',
        type: 'sql-query',
        check: `SELECT CASE WHEN instr(upper(replace(sql, '  ', ' ')), 'ON DELETE CASCADE') > 0 THEN 1 ELSE 0 END FROM sqlite_master WHERE type = 'table' AND name = 'reviews'`,
        expectedRows: [[1]],
        points: 5,
      },
      {
        id: 'restrict',
        name: 'Пользователя с заявками удалить нельзя',
        type: 'sql-query',
        check: `SELECT CASE WHEN instr(upper(replace(sql, '  ', ' ')), 'ON DELETE RESTRICT') > 0 THEN 1 ELSE 0 END FROM sqlite_master WHERE type = 'table' AND name = 'applications'`,
        expectedRows: [[1]],
        points: 5,
      },
      {
        id: 'data',
        name: 'Данные добавлены и связаны',
        type: 'sql-query',
        check: `SELECT (SELECT COUNT(*) FROM applications a JOIN users u ON u.id = a.user_id JOIN rooms r ON r.id = a.room_id), (SELECT COUNT(*) FROM reviews)`,
        expectedRows: [[2, 1]],
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Ограничение на значения пишется прямо в описании столбца: status VARCHAR(50) NOT NULL DEFAULT "Новая" CHECK (status IN ("Новая", …)).',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Правило удаления дописывается к внешнему ключу: FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'CASCADE — «удали и связанное», RESTRICT — «не дай удалить, пока связанное есть». Первое для отзывов, второе для пользователей.',
        penaltyPercent: 35,
      },
    ],
    solution: `CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL
);

CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  start_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Новая'
    CHECK (status IN ('Новая', 'Мероприятие назначено', 'Мероприятие завершено')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL UNIQUE,
  text TEXT NOT NULL,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

INSERT INTO users (id, login, full_name) VALUES (1, 'ivanov26', 'Иванов Иван Иванович');

INSERT INTO rooms (id, title) VALUES (1, 'Аудитория'), (2, 'Коворкинг');

INSERT INTO applications (id, user_id, room_id, start_date, status) VALUES
  (1, 1, 1, '2027-03-12', 'Новая'),
  (2, 1, 2, '2027-04-19', 'Мероприятие завершено');

INSERT INTO reviews (application_id, text) VALUES (2, 'Всё прошло отлично');`,
    solutionExplanation:
      'Ограничение CHECK переносит правило из кода в базу. Пока список статусов живёт только на сервере, любой другой способ записи — прямой запрос, скрипт наполнения, ошибка в коде — может положить в столбец что угодно, и обнаружится это нескоро. Разница между CASCADE и RESTRICT — про смысл данных, а не про удобство. Отзыв без заявки — мусор, его удаляют следом. Заявка без пользователя — потерянная история, поэтому база просто не даст удалить пользователя, и разработчику придётся решить, что с этой историей делать.',
    maxScore: 28,
    estimatedMinutes: 35,
    examRefs: ['m3-db', 'm1-db', 'm3-quality'],
    planDays: ['day-21-1'],
    source: 'plan',
  },

  {
    id: 'task-micro-animations',
    title: 'Микроанимации: пять штук и ни одной лишней',
    kind: 'output',
    runtime: 'dom',
    difficulty: 3,
    tech: ['css'],
    topicIds: ['ui-states'],
    monthNo: 6,
    weekNo: 21,
    statement: `Третий модуль отдельным пунктом требует микроанимации. Ключевое слово — «микро»: анимация в интерфейсе длится доли секунды и почти не замечается. Заметная анимация раздражает уже на третий раз.

Добавьте ровно пять и ни одной больше.

1. \`.btn\` — плавное изменение фона при наведении, длительность **не больше 0.2s**.
2. \`.card\` — лёгкий подъём при наведении: \`transform: translateY(-2px)\` и переход.
3. \`.field input\` — плавное изменение цвета рамки при фокусе.
4. \`.toast\` — появление по кадрам \`@keyframes\`, не дольше 0.3s, с \`forwards\`.
5. \`.spinner\` — бесконечное вращение, один оборот за 0.8s.
6. Правило \`@media (prefers-reduced-motion: reduce)\`, отключающее **все** переходы и анимации.

Анимируются только \`opacity\` и \`transform\` плюс цвета: их браузер меняет, не пересчитывая раскладку.`,
    requirements: [
      'Переход фона у кнопки не длиннее 0.2s',
      'Карточка приподнимается при наведении',
      'Рамка поля меняется плавно',
      'Уведомление появляется по кадрам и остаётся видимым',
      'Спиннер вращается бесконечно',
      'Системная настройка отключает всё движение',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 24px; font-family: system-ui, sans-serif; background: #f8fafc; }

    .btn { padding: 10px 16px; border: 0; border-radius: 8px; background: #2563eb; color: #fff; }
    .btn:hover { background: #1d4ed8; }

    .card { padding: 16px; margin: 16px 0; background: #fff; border: 1px solid #cbd5e1; border-radius: 12px; }

    .field input { padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; }
    .field input:focus-visible { border-color: #2563eb; outline: none; }

    .toast { padding: 10px 14px; border-radius: 8px; background: #16a34a; color: #fff; }

    .spinner { width: 24px; height: 24px; border: 3px solid #cbd5e1; border-top-color: #2563eb; border-radius: 50%; }

    /* 1-6: добавьте переходы, кадры и правило для prefers-reduced-motion */
  </style>
</head>
<body>
  <button class="btn" type="button">Отправить</button>
  <div class="card">Карточка заявки</div>
  <div class="field"><input type="text" placeholder="Логин"></div>
  <div class="toast">Заявка отправлена</div>
  <div class="spinner"></div>
</body>
</html>`,
    viewport: { width: 700, height: 600 },
    tests: [
      {
        id: 'button',
        name: 'Переход у кнопки короткий',
        type: 'dom',
        code: `const raw = ctx.css('.btn', 'transition-duration');
const seconds = raw.indexOf('ms') !== -1 ? parseFloat(raw) / 1000 : parseFloat(raw);
ctx.assert(seconds > 0, 'У кнопки нет перехода');
ctx.assert(seconds <= 0.2, 'Переход должен быть не длиннее 0.2s, сейчас: ' + raw, '≤ 0.2s', raw);
const property = ctx.css('.btn', 'transition-property');
ctx.assert(/background|all/.test(property), 'Переход должен касаться фона, сейчас: ' + property);`,
        points: 4,
      },
      {
        id: 'card',
        name: 'Карточка приподнимается',
        type: 'dom',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(
  /\\.card:hover[^}]*translateY\\s*\\(\\s*-/.test(source),
  'У .card:hover должен быть transform: translateY(-2px)',
);
const duration = ctx.css('.card', 'transition-duration');
ctx.assert(parseFloat(duration) > 0, 'У карточки нет перехода: подъём должен быть плавным');`,
        points: 4,
      },
      {
        id: 'field',
        name: 'Рамка поля меняется плавно',
        type: 'dom',
        code: `const input = ctx.$('.field input');
const duration = ctx.css(input, 'transition-duration');
ctx.assert(parseFloat(duration) > 0, 'У поля нет перехода');
const property = ctx.css(input, 'transition-property');
ctx.assert(/border|all/.test(property), 'Переход должен касаться рамки, сейчас: ' + property);`,
        points: 4,
      },
      {
        id: 'toast',
        name: 'Уведомление появляется по кадрам',
        type: 'dom',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(/@keyframes/.test(source), 'Не найден блок @keyframes');
const name = ctx.css('.toast', 'animation-name');
ctx.assert(name && name !== 'none', 'К .toast не применена анимация');
const raw = ctx.css('.toast', 'animation-duration');
const seconds = raw.indexOf('ms') !== -1 ? parseFloat(raw) / 1000 : parseFloat(raw);
ctx.assert(seconds <= 0.3, 'Анимация должна быть не длиннее 0.3s, сейчас: ' + raw);
// Проверяем объявление, а не проигрывание: в фоновой вкладке браузер
// притормаживает анимации, и ожидание по часам ненадёжно.
const fill = ctx.css('.toast', 'animation-fill-mode');
ctx.assert(
  /forwards|both/.test(fill),
  'Нужен forwards, иначе блок отскочит в начальное состояние. Сейчас animation-fill-mode: ' + fill,
  'forwards',
  fill,
);`,
        points: 5,
      },
      {
        id: 'spinner',
        name: 'Спиннер вращается бесконечно',
        type: 'dom',
        code: `const name = ctx.css('.spinner', 'animation-name');
ctx.assert(name && name !== 'none', 'К .spinner не применена анимация');
const count = ctx.css('.spinner', 'animation-iteration-count');
ctx.assert(count === 'infinite', 'Вращение должно быть бесконечным, сейчас: ' + count, 'infinite', count);
const raw = ctx.css('.spinner', 'animation-duration');
const seconds = raw.indexOf('ms') !== -1 ? parseFloat(raw) / 1000 : parseFloat(raw);
ctx.assert(Math.abs(seconds - 0.8) < 0.01, 'Один оборот за 0.8s, сейчас: ' + raw, '0.8s', raw);
const timing = ctx.css('.spinner', 'animation-timing-function');
ctx.assert(timing === 'linear', 'Вращение должно быть равномерным: animation-timing-function: linear, сейчас: ' + timing);`,
        points: 5,
      },
      {
        id: 'reduced-motion',
        name: 'Движение можно отключить целиком',
        type: 'dom',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(/prefers-reduced-motion\\s*:\\s*reduce/.test(source), 'Нет правила @media (prefers-reduced-motion: reduce)');
const block = source.slice(source.indexOf('prefers-reduced-motion'));
ctx.assert(/animation[^;]*none|animation-duration[^;]*0/.test(block), 'Внутри правила нужно отключить анимации');
ctx.assert(/transition[^;]*none|transition-duration[^;]*0/.test(block), 'Внутри правила нужно отключить переходы');`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Переход задаётся на обычном состоянии элемента, а не на :hover. Иначе возврат будет мгновенным.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Отключить всё движение проще одним правилом со звёздочкой: * { animation: none !important; transition: none !important; }.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: '@keyframes toast-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } } .toast { animation: toast-in 0.25s ease-out forwards; } .spinner { animation: spin 0.8s linear infinite; }',
        penaltyPercent: 35,
      },
    ],
    solution: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 24px; font-family: system-ui, sans-serif; background: #f8fafc; }

    .btn {
      padding: 10px 16px;
      border: 0;
      border-radius: 8px;
      background: #2563eb;
      color: #fff;
      transition: background 0.15s ease;
    }
    .btn:hover { background: #1d4ed8; }

    .card {
      padding: 16px;
      margin: 16px 0;
      background: #fff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08); }

    .field input {
      padding: 10px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      transition: border-color 0.15s ease;
    }
    .field input:focus-visible { border-color: #2563eb; outline: none; }

    @keyframes toast-in {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: none; }
    }

    .toast {
      padding: 10px 14px;
      border-radius: 8px;
      background: #16a34a;
      color: #fff;
      animation: toast-in 0.25s ease-out forwards;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid #cbd5e1;
      border-top-color: #2563eb;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation: none !important;
        transition: none !important;
      }
    }
  </style>
</head>
<body>
  <button class="btn" type="button">Отправить</button>
  <div class="card">Карточка заявки</div>
  <div class="field"><input type="text" placeholder="Логин"></div>
  <div class="toast">Заявка отправлена</div>
  <div class="spinner"></div>
</body>
</html>`,
    solutionExplanation:
      'Все пять анимаций короче трети секунды и трогают только прозрачность, сдвиг и цвет. Это не эстетическая придирка: изменение ширины или отступов заставляет браузер пересчитывать раскладку всей страницы, и на слабом ноутбуке анимация начинает дёргаться. Спиннеру нужен linear — с плавным замедлением вращение выглядит рывками. Правило для prefers-reduced-motion написано через звёздочку с !important намеренно: оно должно перебивать любые анимации, включая те, что добавят позже и забудут учесть.',
    maxScore: 26,
    estimatedMinutes: 30,
    examRefs: ['m3-animations', 'm2-design', 'm3-quality'],
    planDays: ['day-21-2'],
    source: 'plan',
  },

  {
    id: 'task-code-quality-refactor',
    title: 'Качество кода: разобрать то, что выросло',
    kind: 'fix-bug',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['code-quality'],
    monthNo: 6,
    weekNo: 21,
    statement: `Компонент вырос и делает всё сразу. На третьем модуле качество кода оценивают отдельным пунктом, и смотрят ровно на это: размер компонентов, повторы, имена, место обращений к серверу.

Разберите \`CabinetPage\` на части.

1. Вынесите карточку заявки в отдельный компонент \`ApplicationCard\`, принимающий \`{ application }\`.
2. Перевод даты повторяется трижды — вынесите в одну функцию \`toRuDate\`.
3. Список статусов объявлен в двух местах — оставьте одну константу \`STATUSES\`.
4. Переименуйте \`d\`, \`arr\` и \`fn\` в осмысленные имена.
5. Сам \`CabinetPage\` после разбора должен занимать **меньше 40 строк**.

Поведение менять нельзя: проверки смотрят и на результат, и на структуру.`,
    requirements: [
      'Карточка вынесена в отдельный компонент',
      'Перевод даты живёт в одной функции',
      'Список статусов объявлен один раз',
      'Односимвольных имён не осталось',
      'CabinetPage короче 40 строк',
      'Поведение не изменилось',
    ],
    starterCode: `function CabinetPage({ applications }) {
  const [f, setF] = React.useState('');

  const arr = applications.filter((d) => !f || d.status === f);

  return (
    <div>
      <select id="filter" value={f} onChange={(e) => setF(e.target.value)}>
        <option value="">Все</option>
        {['Новая', 'Мероприятие назначено', 'Мероприятие завершено'].map((s) => (
          <option value={s} key={s}>{s}</option>
        ))}
      </select>

      <p id="count">Показано: {arr.length}</p>

      {arr.map((d) => (
        <article className="card" key={d.id}>
          <h3>{d.room}</h3>
          <p>{d.date.split('-').reverse().join('.')}</p>
          <p>{d.status}</p>
          <p className="created">Создана: {d.createdAt.split('-').reverse().join('.')}</p>
          <p className="event">Мероприятие: {d.date.split('-').reverse().join('.')}</p>
        </article>
      ))}

      {arr.length === 0 ? <p>Заявок с таким статусом нет</p> : null}
    </div>
  );
}`,
    tests: [
      {
        id: 'behaviour',
        name: 'Поведение не изменилось',
        type: 'react',
        code: `const applications = [
  { id: 1, room: 'Коворкинг', date: '2027-03-12', createdAt: '2027-01-05', status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '2027-04-19', createdAt: '2027-02-10', status: 'Мероприятие завершено' },
];
return ctx.render('CabinetPage', { applications })
  .then(() => ctx.change('#filter', ''))
  .then(() => {
    ctx.assert(ctx.$$('.card').length === 2, 'Карточек должно быть две, найдено: ' + ctx.$$('.card').length);
    ctx.assert(ctx.text('#count').indexOf('2') !== -1, 'Счётчик должен показывать 2, сейчас: ' + ctx.text('#count'));
    const text = ctx.text();
    ctx.assert(text.indexOf('12.03.2027') !== -1, 'Дата мероприятия должна быть в формате ДД.ММ.ГГГГ');
    ctx.assert(text.indexOf('05.01.2027') !== -1, 'Дата создания должна быть в формате ДД.ММ.ГГГГ');
    return ctx.change('#filter', 'Новая');
  })
  .then(() => {
    ctx.assert(ctx.$$('.card').length === 1, 'После фильтра должна остаться одна карточка');
  });`,
        points: 6,
      },
      {
        id: 'card-component',
        name: 'Карточка вынесена в компонент',
        type: 'react',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(
  /function\\s+ApplicationCard|const\\s+ApplicationCard\\s*=/.test(source),
  'Компонент ApplicationCard не объявлен',
);
ctx.assert(/<ApplicationCard/.test(source), 'CabinetPage должен использовать <ApplicationCard …/>');`,
        points: 5,
      },
      {
        id: 'date-helper',
        name: 'Перевод даты в одной функции',
        type: 'react',
        code: `const source = ctx.source || '';
ctx.assert(
  /function\\s+toRuDate|const\\s+toRuDate\\s*=/.test(source.replace(/\\s+/g, ' ')),
  'Функция toRuDate не объявлена',
);
const inline = source.match(/split\\(['"]-['"]\\)/g) || [];
ctx.assert(
  inline.length <= 1,
  'Перевод даты повторяется ' + inline.length + ' раз. Он должен быть написан один раз — внутри toRuDate',
);`,
        points: 5,
      },
      {
        id: 'statuses',
        name: 'Список статусов один',
        type: 'react',
        code: `const source = ctx.source || '';
const occurrences = (source.match(/Мероприятие назначено/g) || []).length;
ctx.assert(
  occurrences === 1,
  'Строка «Мероприятие назначено» встречается ' + occurrences + ' раз. Список статусов должен быть объявлен один раз константой',
);
ctx.assert(/STATUSES/.test(source), 'Ожидалась константа STATUSES');`,
        points: 4,
      },
      {
        id: 'names',
        name: 'Имена осмысленные',
        type: 'react',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
[['d', 'элемент списка'], ['arr', 'отфильтрованный список'], ['f', 'выбранный фильтр']].forEach(([name, what]) => {
  const pattern = new RegExp('(const|let|var|\\\\()\\\\s*' + name + '\\\\b');
  ctx.assert(!pattern.test(source), 'Имя «' + name + '» ничего не говорит: это ' + what);
});`,
        points: 4,
      },
      {
        id: 'size',
        name: 'CabinetPage стал коротким',
        type: 'react',
        code: `const source = ctx.source || '';
const start = source.search(/function\\s+CabinetPage/);
ctx.assert(start !== -1, 'Компонент CabinetPage должен остаться');
const rest = source.slice(start);
let depth = 0;
let end = rest.length;
for (let i = 0; i < rest.length; i += 1) {
  if (rest[i] === '{') depth += 1;
  if (rest[i] === '}') {
    depth -= 1;
    if (depth === 0) { end = i; break; }
  }
}
const lines = rest.slice(0, end).split('\\n').length;
ctx.assert(lines < 40, 'CabinetPage занимает ' + lines + ' строк, должно быть меньше 40', '< 40', lines);`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Начните с карточки: перенесите её разметку в отдельную функцию и передайте заявку пропом. Компонент сразу похудеет вдвое.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Функции-помощники вроде toRuDate объявляют вне компонента: они не зависят от состояния и не должны пересоздаваться при каждой отрисовке.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const STATUSES = ["Новая", "Мероприятие назначено", "Мероприятие завершено"]; const toRuDate = (iso) => iso.split("-").reverse().join(".");',
        penaltyPercent: 35,
      },
    ],
    solution: `const STATUSES = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'];

const toRuDate = (iso) => iso.split('-').reverse().join('.');

function ApplicationCard({ application }) {
  return (
    <article className="card">
      <h3>{application.room}</h3>
      <p>{toRuDate(application.date)}</p>
      <p>{application.status}</p>
      <p className="created">Создана: {toRuDate(application.createdAt)}</p>
      <p className="event">Мероприятие: {toRuDate(application.date)}</p>
    </article>
  );
}

function CabinetPage({ applications }) {
  const [filter, setFilter] = React.useState('');

  const visible = applications.filter((item) => !filter || item.status === filter);

  return (
    <div>
      <select id="filter" value={filter} onChange={(event) => setFilter(event.target.value)}>
        <option value="">Все</option>
        {STATUSES.map((status) => (
          <option value={status} key={status}>
            {status}
          </option>
        ))}
      </select>

      <p id="count">Показано: {visible.length}</p>

      {visible.map((item) => (
        <ApplicationCard application={item} key={item.id} />
      ))}

      {visible.length === 0 ? <p>Заявок с таким статусом нет</p> : null}
    </div>
  );
}`,
    solutionExplanation:
      'Проверка на количество вызовов split("-") — не формальность. Три копии одного преобразования означают, что при смене формата придётся найти все три, и однажды одну пропустят: на экране появятся две даты в разных видах. То же с двумя списками статусов: добавили четвёртый статус в одном месте, забыли в другом, и фильтр перестал совпадать с данными. Имена d и arr не экономят время: через неделю на них уходит больше времени, чем было сэкономлено при наборе.',
    maxScore: 29,
    estimatedMinutes: 35,
    examRefs: ['m3-quality'],
    planDays: ['day-21-3'],
    source: 'plan',
  },

  {
    id: 'task-ui-states',
    title: 'Четыре состояния страницы с данными',
    kind: 'app',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['ui-states'],
    monthNo: 6,
    weekNo: 21,
    statement: `У любой страницы, которая грузит данные, четыре состояния — и все четыре нужно продумать. Проверить просто: остановите сервер и откройте страницу. Если видно пустоту без объяснений, состояние ошибки забыли.

Компонент \`ApplicationsPage\` принимает \`{ load }\` — функцию, возвращающую промис с массивом заявок.

1. **Загрузка**: пока промис не завершён, виден блок \`#loading\` с текстом.
2. **Данные**: карточки \`.card\`.
3. **Пусто**: если пришёл пустой массив — блок \`#empty\` с объяснением и подсказкой, что делать («Создайте первую заявку»).
4. **Ошибка**: если промис отклонён — блок \`#error\` с человеческим текстом и кнопкой \`#retry\`, повторяющей попытку.
5. Технические подробности ошибки пользователю не показываются: сообщение вида \`Error: fetch failed at line 42\` в \`#error\` попасть не должно.
6. Одновременно видно ровно одно состояние.`,
    requirements: [
      'Во время загрузки виден блок #loading',
      'Пришедшие данные выводятся карточками',
      'Пустой ответ объяснён и подсказывает, что делать',
      'Ошибка показана человеческим текстом с кнопкой повтора',
      'Технические подробности не показываются',
      'Одновременно видно одно состояние',
    ],
    starterCode: `function ApplicationsPage({ load }) {
  // загрузка, данные, пусто, ошибка
}`,
    tests: [
      {
        id: 'loading',
        name: 'Состояние загрузки',
        type: 'react',
        // Промис намеренно не завершается: проверяем именно то, что видно,
        // пока данные в пути. Исчезновение блока проверяют остальные пункты.
        code: `const load = () => new Promise(() => {});
return ctx.render('ApplicationsPage', { load })
  .then(() => {
    ctx.assert(ctx.$('#loading'), 'Пока данные не пришли, должен быть виден блок #loading');
    ctx.assert(ctx.text('#loading').trim().length > 0, 'Блок загрузки должен что-то говорить, а не быть пустым');
    ctx.assert(!ctx.$('#empty') && !ctx.$('#error'), 'Одновременно должно быть видно одно состояние');
    ctx.assert(ctx.$$('.card').length === 0, 'Пока идёт загрузка, карточек быть не должно');
  });`,
        points: 6,
      },
      {
        id: 'data',
        name: 'Данные выводятся',
        type: 'react',
        code: `const items = [
  { id: 1, room: 'Коворкинг', date: '12.03.2027', status: 'Новая' },
  { id: 2, room: 'Кинозал', date: '19.04.2027', status: 'Новая' },
];
return ctx.render('ApplicationsPage', { load: () => Promise.resolve(items) })
  .then(() => ctx.advanceTime(60))
  .then(() => {
    ctx.assert(ctx.$$('.card').length === 2, 'Карточек должно быть две, найдено: ' + ctx.$$('.card').length);
    ctx.assert(!ctx.$('#empty'), 'При наличии данных блок «пусто» не нужен');
    ctx.assert(!ctx.$('#loading'), 'Блок загрузки должен исчезнуть');
  });`,
        points: 5,
      },
      {
        id: 'empty',
        name: 'Пустой ответ объяснён',
        type: 'react',
        code: `return ctx.render('ApplicationsPage', { load: () => Promise.resolve([]) })
  .then(() => ctx.advanceTime(60))
  .then(() => {
    const empty = ctx.$('#empty');
    ctx.assert(empty, 'При пустом ответе должен быть блок #empty');
    ctx.assert(empty.textContent.trim().length >= 15, 'Пустое состояние должно объяснять, а не молчать: «' + empty.textContent + '»');
    ctx.assert(
      /создайте|оформите|добавьте/i.test(empty.textContent),
      'В пустом состоянии нужна подсказка, что делать дальше. Сейчас: ' + empty.textContent,
    );
    ctx.assert(ctx.$$('.card').length === 0, 'Карточек быть не должно');
  });`,
        points: 6,
      },
      {
        id: 'error',
        name: 'Ошибка показана по-человечески',
        type: 'react',
        code: `return ctx.render('ApplicationsPage', { load: () => Promise.reject(new Error('fetch failed at line 42')) })
  .then(() => ctx.advanceTime(60))
  .then(() => {
    const error = ctx.$('#error');
    ctx.assert(error, 'При отказе должен быть блок #error');
    ctx.assert(error.textContent.indexOf('fetch failed') === -1, 'Техническое сообщение пользователю показывать нельзя');
    ctx.assert(error.textContent.trim().length >= 15, 'Сообщение об ошибке должно что-то объяснять');
    ctx.assert(ctx.$('#retry'), 'Нужна кнопка #retry для повторной попытки');
    ctx.assert(!ctx.$('#loading') && !ctx.$('#empty'), 'Одновременно должно быть видно одно состояние');
  });`,
        points: 6,
      },
      {
        id: 'retry',
        name: 'Повтор работает',
        type: 'react',
        code: `let attempt = 0;
const load = () => {
  attempt += 1;
  return attempt === 1 ? Promise.reject(new Error('нет связи')) : Promise.resolve([{ id: 1, room: 'Коворкинг', date: '12.03.2027', status: 'Новая' }]);
};
return ctx.render('ApplicationsPage', { load })
  .then(() => ctx.advanceTime(60))
  .then(() => {
    ctx.assert(ctx.$('#error'), 'Первая попытка должна закончиться ошибкой');
    return ctx.click('#retry');
  })
  .then(() => ctx.advanceTime(60))
  .then(() => {
    ctx.assert(!ctx.$('#error'), 'После удачного повтора ошибка должна исчезнуть');
    ctx.assert(ctx.$$('.card').length === 1, 'После повтора должны появиться данные');
  });`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Удобнее всего хранить одно значение состояния: "loading" | "ready" | "error" — и отдельно сами данные.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Загрузку запускайте в useEffect, а повтор — вызовом той же функции. Не забудьте вернуть состояние в «loading» перед повторной попыткой.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const run = () => { setStatus("loading"); load().then((rows) => { setItems(rows); setStatus("ready"); }).catch(() => setStatus("error")); };',
        penaltyPercent: 35,
      },
    ],
    solution: `function ApplicationsPage({ load }) {
  const [status, setStatus] = React.useState('loading');
  const [items, setItems] = React.useState([]);

  const run = React.useCallback(() => {
    setStatus('loading');

    load()
      .then((rows) => {
        setItems(rows);
        setStatus('ready');
      })
      .catch(() => {
        setStatus('error');
      });
  }, [load]);

  React.useEffect(() => {
    run();
  }, [run]);

  if (status === 'loading') {
    return <p id="loading">Загружаем заявки…</p>;
  }

  if (status === 'error') {
    return (
      <div id="error">
        <p>Не удалось загрузить заявки. Проверьте соединение и попробуйте ещё раз.</p>
        <button id="retry" type="button" onClick={run}>
          Повторить
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return <p id="empty">Заявок пока нет. Создайте первую заявку — она появится здесь.</p>;
  }

  return (
    <div>
      {items.map((item) => (
        <article className="card" key={item.id}>
          <h3>{item.room}</h3>
          <p>{item.date}</p>
          <p>{item.status}</p>
        </article>
      ))}
    </div>
  );
}`,
    solutionExplanation:
      'Четыре состояния разведены ранними возвратами — так физически невозможно показать два сразу. Пустое состояние не просто сообщает «ничего нет», а говорит, что делать: пользователь, открывший кабинет впервые, иначе решит, что приложение сломано. Текст ошибки написан для человека, а подробности остаются в журнале разработчика: сообщение «fetch failed at line 42» не помогает пользователю и попутно рассказывает постороннему об устройстве системы. Кнопка повтора обязательна: обрыв связи — обычное дело, и заставлять перезагружать страницу невежливо.',
    maxScore: 29,
    estimatedMinutes: 35,
    examRefs: ['m3-quality', 'm2-cabinet-ux'],
    planDays: ['day-21-5'],
    source: 'plan',
  },

  {
    id: 'task-git-rhythm',
    title: 'Ритм «этап — коммит»',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['git', 'js'],
    topicIds: ['git-workflow'],
    monthNo: 6,
    weekNo: 21,
    statement: `Коммит после каждого завершённого этапа — страховка: сломали и не чините, а возвращаетесь к последнему рабочему состоянию. На экзамене промежуточные коммиты требуются во всех трёх модулях.

1. \`planCommits(stages)\` — принимает массив этапов \`{ name, done }\` и возвращает подписи коммитов для завершённых, в исходном порядке. Подпись — \`'Добавить ' + name\`, где первая буква имени становится строчной: для этапа \`'Схема базы данных'\` получится \`'Добавить схему базы данных'\`… впрочем, склонять мы не умеем, поэтому правило проще: \`'Добавить: ' + name\`.
2. \`shouldCommitNow(state)\` — принимает \`{ stageFinished, testsPass, minutesSinceLastCommit }\`. Коммит нужен, если этап завершён **и** проверки проходят; либо если с последнего коммита прошло больше 30 минут и проверки проходят. Если проверки не проходят — \`false\` всегда.
3. \`rollbackPoint(commits, brokenIndex)\` — возвращает хеш последнего коммита **перед** сломанным. Если сломан первый — \`null\`.
4. \`describeHistory(commits)\` — строка вида \`'5 коммитов, последний: Добавить: Админка'\`. Для пустой истории — \`'История пуста'\`.`,
    requirements: [
      'planCommits берёт только завершённые этапы и сохраняет порядок',
      'shouldCommitNow не разрешает коммит при падающих проверках',
      'Долгая работа без коммита — повод закоммитить',
      'rollbackPoint находит последнее рабочее состояние',
      'describeHistory собирает краткую сводку',
    ],
    starterCode: `function planCommits(stages) {
  // подписи для завершённых этапов
}

function shouldCommitNow(state) {
  // пора ли коммитить
}

function rollbackPoint(commits, brokenIndex) {
  // куда откатываться
}

function describeHistory(commits) {
  // краткая сводка
}`,
    tests: [
      {
        id: 'plan',
        name: 'Подписи для завершённых этапов',
        type: 'call',
        entry: 'planCommits',
        args: [
          [
            { name: 'Схема базы данных', done: true },
            { name: 'Регистрация', done: false },
            { name: 'Вход', done: true },
          ],
        ],
        expected: ['Добавить: Схема базы данных', 'Добавить: Вход'],
        compare: 'deep',
        points: 4,
      },
      {
        id: 'plan-empty',
        name: 'Ничего не завершено — пустой список',
        type: 'call',
        entry: 'planCommits',
        args: [[{ name: 'Схема базы данных', done: false }]],
        expected: [],
        compare: 'deep',
        points: 2,
      },
      {
        id: 'commit-now',
        name: 'Этап завершён и проверки проходят',
        type: 'assert',
        code: `const shouldCommitNow = ctx.get('shouldCommitNow');
ctx.assert(
  shouldCommitNow({ stageFinished: true, testsPass: true, minutesSinceLastCommit: 5 }) === true,
  'Завершённый этап с проходящими проверками — повод закоммитить',
);
ctx.assert(
  shouldCommitNow({ stageFinished: false, testsPass: true, minutesSinceLastCommit: 5 }) === false,
  'Незавершённый этап и недавний коммит — коммитить рано',
);`,
        points: 4,
      },
      {
        id: 'broken-tests',
        name: 'Сломанный код не коммитят',
        type: 'assert',
        code: `const shouldCommitNow = ctx.get('shouldCommitNow');
ctx.assert(
  shouldCommitNow({ stageFinished: true, testsPass: false, minutesSinceLastCommit: 90 }) === false,
  'Пока проверки не проходят, коммитить нельзя ни при каких условиях: иначе точка отката окажется нерабочей',
);`,
        points: 5,
      },
      {
        id: 'long-time',
        name: 'Долгая работа без коммита',
        type: 'assert',
        code: `const shouldCommitNow = ctx.get('shouldCommitNow');
ctx.assert(
  shouldCommitNow({ stageFinished: false, testsPass: true, minutesSinceLastCommit: 45 }) === true,
  'Сорок пять минут без коммита — пора сохраниться, даже если этап не закончен',
);
ctx.assert(
  shouldCommitNow({ stageFinished: false, testsPass: true, minutesSinceLastCommit: 20 }) === false,
  'Двадцать минут — ещё не повод',
);`,
        points: 4,
      },
      {
        id: 'rollback',
        name: 'Точка отката',
        type: 'assert',
        code: `const rollbackPoint = ctx.get('rollbackPoint');
const commits = [
  { hash: 'a1b2c3d', message: 'Добавить: Схема базы данных' },
  { hash: 'e4f5a6b', message: 'Добавить: Регистрация' },
  { hash: 'c7d8e9f', message: 'Добавить: Вход' },
];
ctx.assert(rollbackPoint(commits, 2) === 'e4f5a6b', 'Ожидался e4f5a6b, получено: ' + ctx.preview(rollbackPoint(commits, 2)));
ctx.assert(rollbackPoint(commits, 0) === null, 'Если сломан первый коммит, откатываться некуда: нужен null');`,
        points: 5,
      },
      {
        id: 'describe',
        name: 'Сводка по истории',
        type: 'assert',
        code: `const describeHistory = ctx.get('describeHistory');
const commits = [
  { hash: 'a1b2c3d', message: 'Добавить: Схема базы данных' },
  { hash: 'e4f5a6b', message: 'Добавить: Админка' },
];
ctx.assert(
  describeHistory(commits) === '2 коммитов, последний: Добавить: Админка',
  'Получено: ' + describeHistory(commits),
);
ctx.assert(describeHistory([]) === 'История пуста', 'Для пустой истории: ' + describeHistory([]));`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Условие коммита читается как одно выражение: проверки проходят И (этап закончен ИЛИ прошло больше 30 минут).',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Точка отката — это предыдущий элемент массива. Не забудьте случай, когда предыдущего нет.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'return state.testsPass && (state.stageFinished || state.minutesSinceLastCommit > 30);',
        penaltyPercent: 35,
      },
    ],
    solution: `function planCommits(stages) {
  return stages.filter((stage) => stage.done).map((stage) => 'Добавить: ' + stage.name);
}

function shouldCommitNow(state) {
  if (!state.testsPass) return false;
  return state.stageFinished || state.minutesSinceLastCommit > 30;
}

function rollbackPoint(commits, brokenIndex) {
  if (brokenIndex <= 0) return null;
  return commits[brokenIndex - 1].hash;
}

function describeHistory(commits) {
  if (commits.length === 0) return 'История пуста';
  return commits.length + ' коммитов, последний: ' + commits[commits.length - 1].message;
}`,
    solutionExplanation:
      'Правило «не коммитить сломанное» стоит первым и отсекает всё остальное. Смысл коммита в том, что к нему можно вернуться; коммит с падающими проверками — не точка сохранения, а ловушка, в которую откатятся в самый неподходящий момент. Второе правило — про тридцать минут — спасает от другой крайности: можно час дописывать большой кусок, сломать его в конце и потерять всё. Половина проекта, лежащая в одном коммите, ничем не лучше отсутствия коммитов.',
    maxScore: 28,
    estimatedMinutes: 25,
    examRefs: ['m1-git', 'm2-git', 'm3-git'],
    planDays: ['day-21-6'],
    source: 'plan',
  },

  {
    id: 'task-project2-schema',
    title: 'Второй проект: база доставки еды',
    kind: 'db',
    runtime: 'sql',
    difficulty: 4,
    tech: ['sql'],
    topicIds: ['new-domains'],
    monthNo: 6,
    weekNo: 22,
    statement: `Новая предметная область — **доставка еды**. Проверяем главное: переносится ли готовый скелет или каждый раз приходится придумывать заново.

1. \`users\` — \`id\`, \`login\` (обязательный, уникальный), \`full_name\` (обязательный), \`address\` (обязательный).
2. \`dishes\` — справочник блюд: \`id\`, \`title\` (обязательный, уникальный), \`price\` (дробное с копейками, обязательное), \`is_spicy\` (целое, по умолчанию \`0\`).
3. \`payment_methods\` — \`id\`, \`title\` (обязательный, уникальный).
4. \`orders\` — \`id\`, \`user_id\`, \`dish_id\`, \`payment_id\` (обязательные внешние ключи), \`order_date\` (обязательная), \`status\` (по умолчанию \`'Принят'\`, ограничен списком \`'Принят'\`, \`'Готовится'\`, \`'Доставлен'\`).
5. \`reviews\` — \`id\`, \`order_id\` (обязательный уникальный внешний ключ, \`ON DELETE CASCADE\`), \`rating\` (целое, обязательное), \`text\`.
6. Заполните: три блюда, два способа оплаты, один пользователь, два его заказа.

Обратите внимание: статусы здесь другие, и правило доступности отзыва тоже придётся переносить осознанно — «Принят» в этой теме играет ту же роль, что «Новая» в конференциях.`,
    requirements: [
      'Пять таблиц со связями',
      'Цена блюда хранит копейки',
      'Статус заказа ограничен списком допустимых',
      'Отзыв удаляется вместе с заказом',
      'Справочники заполнены',
      'Добавлены пользователь и два заказа',
    ],
    starterCode: `-- Доставка еды: тот же скелет, другая тема

`,
    tests: [
      {
        id: 'dishes',
        name: 'Справочник блюд',
        type: 'sql-schema',
        table: 'dishes',
        columns: [
          { name: 'id', pk: true },
          { name: 'title', notNull: true },
          { name: 'price', notNull: true },
          { name: 'is_spicy' },
        ],
        points: 4,
      },
      {
        id: 'orders',
        name: 'Заказ связан с тремя таблицами',
        type: 'sql-schema',
        table: 'orders',
        columns: [
          { name: 'id', pk: true },
          { name: 'user_id', notNull: true },
          { name: 'dish_id', notNull: true },
          { name: 'payment_id', notNull: true },
          { name: 'order_date', notNull: true },
          { name: 'status', notNull: true },
        ],
        foreignKeys: [
          { column: 'user_id', refTable: 'users' },
          { column: 'dish_id', refTable: 'dishes' },
          { column: 'payment_id', refTable: 'payment_methods' },
        ],
        points: 5,
      },
      {
        id: 'status-check',
        name: 'Статус ограничен списком',
        type: 'sql-query',
        check: `SELECT CASE WHEN instr(upper(sql), 'CHECK') > 0 AND instr(sql, 'Готовится') > 0 AND instr(sql, 'Доставлен') > 0 THEN 1 ELSE 0 END FROM sqlite_master WHERE type = 'table' AND name = 'orders'`,
        expectedRows: [[1]],
        points: 5,
      },
      {
        id: 'cascade',
        name: 'Отзыв удаляется вместе с заказом',
        type: 'sql-query',
        check: `SELECT CASE WHEN instr(upper(replace(sql, '  ', ' ')), 'ON DELETE CASCADE') > 0 THEN 1 ELSE 0 END FROM sqlite_master WHERE type = 'table' AND name = 'reviews'`,
        expectedRows: [[1]],
        points: 4,
      },
      {
        id: 'catalogs',
        name: 'Справочники заполнены',
        type: 'sql-query',
        check: `SELECT (SELECT COUNT(*) FROM dishes), (SELECT COUNT(*) FROM payment_methods)`,
        expectedRows: [[3, 2]],
        points: 4,
      },
      {
        id: 'price-decimal',
        name: 'Цена хранит копейки',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM dishes WHERE price <> CAST(price AS INT)`,
        expectedRows: [[1]],
        points: 3,
      },
      {
        id: 'orders-data',
        name: 'Заказы добавлены и связи рабочие',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM orders o JOIN users u ON u.id = o.user_id JOIN dishes d ON d.id = o.dish_id JOIN payment_methods p ON p.id = o.payment_id WHERE o.status = 'Принят'`,
        expectedRows: [[2]],
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Возьмите схему «Конференции.РФ» и переименуйте: rooms → dishes, applications → orders. Добавится адрес у пользователя и оценка в отзыве.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Одно из трёх блюд должно стоить с копейками — иначе по данным не видно, что тип выбран правильно.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: "status VARCHAR(50) NOT NULL DEFAULT 'Принят' CHECK (status IN ('Принят', 'Готовится', 'Доставлен'))",
        penaltyPercent: 35,
      },
    ],
    solution: `CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL,
  address VARCHAR(200) NOT NULL
);

CREATE TABLE dishes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  is_spicy INT NOT NULL DEFAULT 0
);

CREATE TABLE payment_methods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  dish_id INT NOT NULL,
  payment_id INT NOT NULL,
  order_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Принят'
    CHECK (status IN ('Принят', 'Готовится', 'Доставлен')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (dish_id) REFERENCES dishes(id),
  FOREIGN KEY (payment_id) REFERENCES payment_methods(id)
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL UNIQUE,
  rating INT NOT NULL,
  text TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

INSERT INTO dishes (id, title, price, is_spicy) VALUES
  (1, 'Борщ', 349.50, 0),
  (2, 'Том ям', 590.00, 1),
  (3, 'Сырники', 280.00, 0);

INSERT INTO payment_methods (id, title) VALUES (1, 'Наличными'), (2, 'Картой');

INSERT INTO users (id, login, full_name, address) VALUES
  (1, 'ivanov26', 'Иванов Иван Иванович', 'ул. Ленина, 10, кв. 5');

INSERT INTO orders (user_id, dish_id, payment_id, order_date) VALUES
  (1, 1, 2, '2027-03-12'),
  (1, 3, 1, '2027-03-14');`,
    solutionExplanation:
      'Скелет перенесён целиком: люди, справочник основного ресурса, справочник способов оплаты, сами заявки и отзывы. Изменились два столбца — адрес доставки у пользователя и признак остроты у блюда. Именно поэтому схему стоит уметь писать наизусть: на экзамене тема неизвестна заранее, но структура почти всегда та же. Названия статусов — единственное место, где перенос нельзя делать механически: «Принят» здесь значит то же, что «Новая» в конференциях, и правило отзыва должно опираться на смысл, а не на слово.',
    maxScore: 30,
    estimatedMinutes: 35,
    examRefs: ['m1-db', 'm3-db', 'm1-er'],
    planDays: ['day-22-1'],
    source: 'plan',
  },

  {
    id: 'task-project2-user-part',
    title: 'Второй проект: заказ, кабинет и отзыв с переносом правила',
    kind: 'app',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['new-domains'],
    monthNo: 6,
    weekNo: 22,
    statement: `Пользовательская часть доставки. Правило отзыва переносится **осознанно**: статусы называются иначе, и слепая замена строки здесь не сработает.

Компонент \`DeliveryPage\` принимает \`{ dishes, orders, onOrder, onReview }\`.

1. Форма заказа: выпадающий список \`select[name="dishId"]\` из \`dishes\` (\`{ id, title }\`) с пустым первым вариантом, поле \`input[name="date"]\` типа \`date\`, кнопка отправки. Незаполненная форма показывает «Заполните все поля» в \`#form-error\` и не вызывает \`onOrder\`.
2. Заказы выводятся карточками \`.order\` (\`{ id, dish, date, status }\`, дата уже в формате ДД.ММ.ГГГГ).
3. **Правило отзыва**: оставить отзыв можно, только если заказ уже не в статусе \`'Принят'\` — это состояние соответствует «Новой» в прошлой теме. У таких карточек есть кнопка \`.review\`, у остальных — текст «Отзыв можно оставить после смены статуса».
4. Нажатие \`.review\` вызывает \`onReview(id)\`, после чего в карточке появляется «Спасибо за отзыв», а кнопка исчезает.`,
    requirements: [
      'Форма заказа проверяет заполненность',
      'Заказы выводятся карточками',
      'Кнопка отзыва есть только у заказов не в статусе «Принят»',
      'У заказа в статусе «Принят» выводится объяснение',
      'Отзыв заменяет кнопку благодарностью',
      'Отзыв по одному заказу не влияет на другие',
    ],
    starterCode: `function DeliveryPage({ dishes, orders, onOrder, onReview }) {
  // форма заказа, список заказов, правило отзыва
}`,
    tests: [
      {
        id: 'form',
        name: 'Форма заказа проверяет заполненность',
        type: 'react',
        code: `const dishes = [{ id: 1, title: 'Борщ' }, { id: 2, title: 'Том ям' }];
let called = 0;
return ctx.render('DeliveryPage', { dishes, orders: [], onOrder: () => { called += 1; }, onReview: () => {} })
  .then(() => {
    const select = ctx.$('select[name="dishId"]');
    ctx.assert(select, 'Нет списка блюд');
    ctx.assert(select.options[0].value === '', 'Первым должен идти пустой вариант');
    return ctx.change('select[name="dishId"]', '');
  })
  .then(() => ctx.change('input[name="date"]', ''))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(called === 0, 'Незаполненная форма не должна вызывать onOrder');
    ctx.assert(ctx.text('#form-error').indexOf('Заполните все поля') !== -1, 'Нет сообщения об ошибке');
  });`,
        points: 5,
      },
      {
        id: 'order',
        name: 'Заполненная форма отправляется',
        type: 'react',
        code: `const dishes = [{ id: 1, title: 'Борщ' }, { id: 2, title: 'Том ям' }];
const calls = [];
return ctx.render('DeliveryPage', { dishes, orders: [], onOrder: (data) => calls.push(data), onReview: () => {} })
  .then(() => ctx.change('select[name="dishId"]', '2'))
  .then(() => ctx.change('input[name="date"]', '2027-03-12'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(calls.length === 1, 'onOrder должен вызваться один раз, вызовов: ' + calls.length);
    ctx.assert(String(calls[0].dishId) === '2', 'Передано неверное блюдо: ' + ctx.preview(calls[0]));
    ctx.assert(calls[0].date === '2027-03-12', 'Передана неверная дата: ' + ctx.preview(calls[0]));
  });`,
        points: 5,
      },
      {
        id: 'review-rule',
        name: 'Правило отзыва перенесено верно',
        type: 'react',
        code: `const dishes = [{ id: 1, title: 'Борщ' }];
const orders = [
  { id: 10, dish: 'Борщ', date: '12.03.2027', status: 'Принят' },
  { id: 11, dish: 'Том ям', date: '14.03.2027', status: 'Доставлен' },
];
return ctx.render('DeliveryPage', { dishes, orders, onOrder: () => {}, onReview: () => {} }).then(() => {
  const cards = ctx.$$('.order');
  ctx.assert(cards.length === 2, 'Карточек должно быть две, найдено: ' + cards.length);
  const accepted = cards.filter((card) => card.textContent.indexOf('Принят') !== -1)[0];
  const delivered = cards.filter((card) => card.textContent.indexOf('Доставлен') !== -1)[0];
  ctx.assert(!accepted.querySelector('.review'), 'У заказа в статусе «Принят» кнопки отзыва быть не должно');
  ctx.assert(
    accepted.textContent.indexOf('Отзыв можно оставить после смены статуса') !== -1,
    'У заказа в статусе «Принят» нужно объяснение',
  );
  ctx.assert(delivered.querySelector('.review'), 'У доставленного заказа должна быть кнопка отзыва');
});`,
        points: 7,
      },
      {
        id: 'review-submit',
        name: 'Отзыв заменяет кнопку благодарностью',
        type: 'react',
        code: `const dishes = [{ id: 1, title: 'Борщ' }];
const orders = [{ id: 11, dish: 'Том ям', date: '14.03.2027', status: 'Доставлен' }];
const calls = [];
return ctx.render('DeliveryPage', { dishes, orders, onOrder: () => {}, onReview: (id) => calls.push(id) })
  .then(() => ctx.click('.review'))
  .then(() => {
    ctx.assert(calls.length === 1 && calls[0] === 11, 'onReview должен получить номер заказа, получено: ' + ctx.preview(calls));
    ctx.assert(ctx.text().indexOf('Спасибо за отзыв') !== -1, 'После отзыва должна появиться благодарность');
    ctx.assert(!ctx.$('.review'), 'Кнопка отзыва должна исчезнуть');
  });`,
        points: 6,
      },
      {
        id: 'independent',
        name: 'Отзывы по заказам не путаются',
        type: 'react',
        code: `const dishes = [{ id: 1, title: 'Борщ' }];
const orders = [
  { id: 20, dish: 'Борщ', date: '12.03.2027', status: 'Доставлен' },
  { id: 21, dish: 'Том ям', date: '14.03.2027', status: 'Готовится' },
];
return ctx.render('DeliveryPage', { dishes, orders, onOrder: () => {}, onReview: () => {} })
  .then(() => ctx.click(ctx.$$('.review')[0]))
  .then(() => {
    ctx.assert(ctx.$$('.review').length === 1, 'Отзыв по одному заказу не должен убирать кнопку у второго');
    const cards = ctx.$$('.order');
    ctx.assert(cards[0].textContent.indexOf('Спасибо за отзыв') !== -1, 'Благодарность должна быть в первой карточке');
    ctx.assert(cards[1].textContent.indexOf('Спасибо за отзыв') === -1, 'Во второй карточке благодарности быть не должно');
  });`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Начальный статус в этой теме — «Принят». Именно он соответствует «Новой» из прошлого проекта.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Отзывы храните объектом с ключом по номеру заказа — иначе карточки перепутаются.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const canReview = (order) => order.status !== "Принят" && !reviewed[order.id];',
        penaltyPercent: 35,
      },
    ],
    solution: `const INITIAL_STATUS = 'Принят';

function DeliveryPage({ dishes, orders, onOrder, onReview }) {
  const [dishId, setDishId] = React.useState('');
  const [date, setDate] = React.useState('');
  const [error, setError] = React.useState('');
  const [reviewed, setReviewed] = React.useState({});

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!dishId || !date) {
      setError('Заполните все поля');
      return;
    }

    setError('');
    onOrder({ dishId, date });
  };

  const leaveReview = (order) => {
    onReview(order.id);
    setReviewed((prev) => ({ ...prev, [order.id]: true }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="dishId">Блюдо</label>
        <select id="dishId" name="dishId" value={dishId} onChange={(event) => setDishId(event.target.value)}>
          <option value="">Выберите блюдо</option>
          {dishes.map((dish) => (
            <option value={dish.id} key={dish.id}>
              {dish.title}
            </option>
          ))}
        </select>

        <label htmlFor="date">Дата доставки</label>
        <input id="date" name="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />

        <button type="submit">Заказать</button>
        <p id="form-error">{error}</p>
      </form>

      {orders.map((order) => (
        <article className="order" key={order.id}>
          <h3>{order.dish}</h3>
          <p>{order.date}</p>
          <p>{order.status}</p>

          {reviewed[order.id] ? (
            <p>Спасибо за отзыв</p>
          ) : order.status === INITIAL_STATUS ? (
            <p>Отзыв можно оставить после смены статуса</p>
          ) : (
            <button className="review" type="button" onClick={() => leaveReview(order)}>
              Оставить отзыв
            </button>
          )}
        </article>
      ))}
    </div>
  );
}`,
    solutionExplanation:
      'Начальный статус вынесен в константу INITIAL_STATUS, а не вписан в условие строкой. Так видно, что правило не про слово «Принят», а про смысл: отзыв нельзя оставить, пока с заказом ничего не произошло. При переносе на четвёртую тему поменяется одна строка. Порядок проверок тот же, что в прошлом проекте: сначала «отзыв уже оставлен», потом «статус начальный», и только затем кнопка — иначе после отправки отзыва кнопка появится снова.',
    maxScore: 29,
    estimatedMinutes: 40,
    examRefs: ['m1-order', 'm1-cabinet', 'm2-cabinet-ux'],
    planDays: ['day-22-3'],
    source: 'plan',
  },

  {
    id: 'task-project2-design-mobile',
    title: 'Второй проект: оформление, слайдер и узкий экран',
    kind: 'app',
    runtime: 'dom',
    difficulty: 4,
    tech: ['css', 'js', 'html'],
    topicIds: ['new-domains'],
    monthNo: 6,
    weekNo: 22,
    statement: `Второй модуль на новой теме: те же требования, другие картинки. Проверяем, помните ли параметры слайдера без подсказки.

Страница меню доставки на экране **390 × 844**.

1. Слайдер \`.slider\`: **четыре** картинки \`.slide\`, видна одна (класс \`active\`), автопереключение каждые **3 секунды**, кнопка \`#next\` листает по кругу.
2. Картинки одинаковой высоты **180px**, \`object-fit: cover\`, у каждой непустой \`alt\`.
3. Карточки блюд \`.dish\` в сетке: одна колонка на узком экране, три от **768px**.
4. Горизонтальной прокрутки нет.
5. Кнопки \`.btn\` не мельче **44px** по высоте.

Всё это вы уже делали — сегодня важно, чтобы получилось без подглядывания.`,
    requirements: [
      'Четыре слайда, активен один',
      'Автопереключение каждые 3 секунды и работающая кнопка',
      'Картинки одинаковой высоты с object-fit и alt',
      'Сетка карточек: одна колонка на 390px, три от 768px',
      'Горизонтальной прокрутки нет',
      'Кнопки не мельче 44px',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 16px; font-family: system-ui, sans-serif; background: #f8fafc; }

    /* слайдер, картинки, сетка карточек, кнопки */
  </style>
</head>
<body>
  <div class="slider">
    <!-- четыре картинки -->
  </div>
  <button id="next" class="btn" type="button">Вперёд</button>

  <div class="menu">
    <!-- три карточки блюд .dish -->
  </div>

  <script>
    // автопереключение и кнопка
  </script>
</body>
</html>`,
    viewport: { width: 390, height: 844 },
    tests: [
      {
        id: 'slides',
        name: 'Четыре слайда, активен один',
        type: 'dom',
        code: `const slides = ctx.$$('.slide');
ctx.assert(slides.length === 4, 'Слайдов должно быть четыре, найдено: ' + slides.length, 4, slides.length);
ctx.assert(ctx.$$('.slide.active').length === 1, 'Активным должен быть ровно один слайд');`,
        points: 4,
      },
      {
        id: 'images',
        name: 'Картинки одинаковой высоты и с подписями',
        type: 'dom',
        code: `const images = ctx.$$('.slide');
const visible = images.filter((img) => ctx.css(img, 'display') !== 'none');
visible.forEach((img) => {
  ctx.assert(Math.round(img.getBoundingClientRect().height) === 180, 'Высота слайда должна быть 180px, сейчас: ' + Math.round(img.getBoundingClientRect().height));
});
images.forEach((img, index) => {
  ctx.assert(ctx.css(img, 'object-fit') === 'cover', 'У слайда ' + (index + 1) + ' нужен object-fit: cover');
  const alt = img.getAttribute('alt');
  ctx.assert(alt && alt.trim().length > 0, 'У слайда ' + (index + 1) + ' нет непустого alt');
});`,
        points: 5,
      },
      {
        id: 'next',
        name: 'Кнопка листает по кругу',
        type: 'dom',
        code: `const slides = ctx.$$('.slide');
const activeIndex = () => slides.map((slide) => slide.classList.contains('active')).indexOf(true);
const before = activeIndex();
ctx.click('#next');
const after = activeIndex();
ctx.assert(after === (before + 1) % 4, 'После кнопки должен открыться следующий слайд: был ' + before + ', стал ' + after);`,
        points: 5,
      },
      {
        id: 'autoplay',
        name: 'Автопереключение через 3 секунды',
        type: 'dom',
        code: `const slides = ctx.$$('.slide');
const activeIndex = () => slides.map((slide) => slide.classList.contains('active')).indexOf(true);
const before = activeIndex();
return ctx.wait(3400).then(function () {
  const after = activeIndex();
  ctx.assert(after !== before, 'За 3.4 секунды слайд не сменился: нужен setInterval на 3000 мс');
  ctx.assert(ctx.$$('.slide.active').length === 1, 'Активным должен остаться один слайд');
});`,
        points: 6,
      },
      {
        id: 'grid',
        name: 'Сетка карточек по экрану',
        type: 'dom',
        code: `const menu = ctx.$('.menu');
ctx.assert(ctx.css(menu, 'display') === 'grid', 'Карточки блюд выкладываются сеткой');
const columns = ctx.css(menu, 'grid-template-columns').split(' ').filter(Boolean);
ctx.assert(columns.length === 1, 'На 390px колонка должна быть одна, сейчас: ' + columns.length);
ctx.assert(ctx.$$('.dish').length >= 3, 'Карточек блюд должно быть не меньше трёх');
const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(/@media[^{]*min-width\\s*:\\s*768px/.test(source), 'Нет медиазапроса от 768px');
const block = source.slice(source.search(/@media[^{]*min-width\\s*:\\s*768px/));
ctx.assert(/repeat\\(3|1fr 1fr 1fr/.test(block), 'В медиазапросе сетка не переключается на три колонки');`,
        points: 6,
      },
      {
        id: 'mobile',
        name: 'Узкий экран в порядке',
        type: 'dom',
        code: `const root = ctx.document.documentElement;
ctx.assert(
  root.scrollWidth <= root.clientWidth + 1,
  'Страница уезжает вбок: ' + root.scrollWidth + 'px при экране ' + root.clientWidth + 'px',
);
ctx.$$('.btn').forEach((button) => {
  ctx.assert(
    button.getBoundingClientRect().height >= 44,
    'Высота кнопки «' + button.textContent.trim() + '» — ' + Math.round(button.getBoundingClientRect().height) + 'px, нужно 44',
  );
});`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Слайды проще всего прятать через display: none, а активный показывать классом .slide.active { display: block; }.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Картинке с фиксированной высотой нужен ещё width: 100%, иначе она не займёт всю ширину контейнера.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: '.menu { display: grid; grid-template-columns: 1fr; gap: 12px; } @media (min-width: 768px) { .menu { grid-template-columns: repeat(3, 1fr); } }',
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
    body { margin: 0; padding: 16px; font-family: system-ui, sans-serif; background: #f8fafc; }

    .slider { max-width: 100%; }

    .slide {
      display: none;
      width: 100%;
      height: 180px;
      object-fit: cover;
      border-radius: 12px;
    }

    .slide.active { display: block; }

    .btn {
      min-height: 44px;
      margin: 12px 0;
      padding: 0 16px;
      border: 0;
      border-radius: 8px;
      background: #2563eb;
      color: #fff;
      font-size: 1rem;
    }

    .menu {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }

    @media (min-width: 768px) {
      .menu { grid-template-columns: repeat(3, 1fr); }
    }

    .dish {
      padding: 12px;
      background: #fff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
    }
  </style>
</head>
<body>
  <div class="slider">
    <img class="slide active" alt="Борщ" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='800' height='450' fill='%23dc2626'/></svg>">
    <img class="slide" alt="Том ям" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><rect width='600' height='600' fill='%23d97706'/></svg>">
    <img class="slide" alt="Сырники" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='400'><rect width='1200' height='400' fill='%2316a34a'/></svg>">
    <img class="slide" alt="Салат" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='900'><rect width='400' height='900' fill='%232563eb'/></svg>">
  </div>
  <button id="next" class="btn" type="button">Вперёд</button>

  <div class="menu">
    <article class="dish"><h3>Борщ</h3><p>349,50 ₽</p></article>
    <article class="dish"><h3>Том ям</h3><p>590,00 ₽</p></article>
    <article class="dish"><h3>Сырники</h3><p>280,00 ₽</p></article>
  </div>

  <script>
    var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
    var current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle('active', position === current);
      });
    }

    document.getElementById('next').addEventListener('click', function () {
      show(current + 1);
    });

    setInterval(function () {
      show(current + 1);
    }, 3000);
  </script>
</body>
</html>`,
    solutionExplanation:
      'Четыре картинки разных пропорций приведены к одному виду парой «фиксированная высота плюс object-fit: cover». Скрытые слайды остаются в разметке — это позволяет переключать их одним классом, без пересборки. Обратите внимание, что параметры слайдера взяты из задания дословно: четыре изображения и три секунды. Их стоит помнить наизусть: на экзамене это готовый пункт, который проверяют секундомером.',
    maxScore: 31,
    estimatedMinutes: 40,
    examRefs: ['m2-slider', 'm2-mobile', 'm2-design', 'm3-mobile'],
    planDays: ['day-22-5'],
    source: 'plan',
  },

  {
    id: 'task-project2-polish-commit',
    title: 'Второй проект: отделка и честная история коммитов',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['git', 'js'],
    topicIds: ['new-domains', 'git-workflow'],
    monthNo: 6,
    weekNo: 22,
    statement: `Закрываем проект так, как закрывали бы на экзамене: чистый код, понятная история, работающий запуск.

1. \`checkReadme(text)\` — возвращает список отсутствующих разделов README из обязательных: \`'Запуск'\`, \`'База данных'\`, \`'Адреса API'\`, \`'Стек'\`. Раздел считается найденным, если в тексте есть строка, начинающаяся с \`##\` и содержащая его название.
2. \`unusedFiles(files, imports)\` — имена файлов, на которые никто не ссылается. \`files\` — массив имён, \`imports\` — массив имён, которые где-то импортируются. Точка входа \`'main.jsx'\` не считается неиспользуемой никогда.
3. \`historySummary(commits)\` — принимает подписи коммитов, возвращает \`{ total, bad }\`, где \`bad\` — количество подписей короче 10 символов либо состоящих из одного слова.
4. \`readyToSubmit(state)\` — \`true\`, только если: README полон, неиспользуемых файлов нет, плохих подписей нет **и** \`state.testsPass\`. Принимает \`{ missingSections, unused, badCommits, testsPass }\`.`,
    requirements: [
      'checkReadme находит отсутствующие разделы',
      'Полный README даёт пустой список',
      'unusedFiles не считает точку входа лишней',
      'historySummary считает плохие подписи',
      'readyToSubmit требует выполнения всех условий',
    ],
    starterCode: `const REQUIRED_SECTIONS = ['Запуск', 'База данных', 'Адреса API', 'Стек'];

function checkReadme(text) {
  // каких разделов не хватает
}

function unusedFiles(files, imports) {
  // на какие файлы никто не ссылается
}

function historySummary(commits) {
  // { total, bad }
}

function readyToSubmit(state) {
  // можно ли сдавать
}`,
    tests: [
      {
        id: 'readme-missing',
        name: 'Отсутствующие разделы найдены',
        type: 'assert',
        code: `const checkReadme = ctx.get('checkReadme');
const text = '# Доставка\\n\\n## Запуск\\nnpm run dev\\n\\n## Стек\\nReact, Express';
const missing = checkReadme(text);
ctx.assert(Array.isArray(missing), 'Нужно вернуть массив');
ctx.assert(missing.indexOf('База данных') !== -1, 'Не найден пропуск раздела «База данных»');
ctx.assert(missing.indexOf('Адреса API') !== -1, 'Не найден пропуск раздела «Адреса API»');
ctx.assert(missing.indexOf('Запуск') === -1, 'Раздел «Запуск» есть, в пропущенные он попасть не должен');`,
        points: 5,
      },
      {
        id: 'readme-full',
        name: 'Полный README даёт пустой список',
        type: 'assert',
        code: `const checkReadme = ctx.get('checkReadme');
const text = '## Запуск\\n## База данных\\n## Адреса API\\n## Стек';
ctx.assert(checkReadme(text).length === 0, 'Для полного README список должен быть пуст, получено: ' + ctx.preview(checkReadme(text)));
ctx.assert(checkReadme('').length === 4, 'Для пустого текста должны отсутствовать все четыре раздела');`,
        points: 4,
      },
      {
        id: 'unused',
        name: 'Неиспользуемые файлы',
        type: 'assert',
        code: `const unusedFiles = ctx.get('unusedFiles');
const files = ['main.jsx', 'App.jsx', 'OldCabinet.jsx', 'api.js'];
const imports = ['App.jsx', 'api.js'];
const unused = unusedFiles(files, imports);
ctx.assert(unused.indexOf('OldCabinet.jsx') !== -1, 'Файл OldCabinet.jsx нигде не используется');
ctx.assert(unused.indexOf('main.jsx') === -1, 'Точка входа main.jsx не считается неиспользуемой: её подключает сборщик');
ctx.assert(unused.length === 1, 'Лишних файлов должен быть ровно один, получено: ' + ctx.preview(unused));`,
        points: 5,
      },
      {
        id: 'history',
        name: 'Плохие подписи посчитаны',
        type: 'assert',
        code: `const historySummary = ctx.get('historySummary');
const result = historySummary([
  'Добавить схему базы данных',
  'фикс',
  'Добавить форму заказа с проверкой полей',
  'правки',
]);
ctx.assert(result.total === 4, 'Всего коммитов четыре, получено: ' + result.total);
ctx.assert(result.bad === 2, 'Плохих подписей две, получено: ' + result.bad, 2, result.bad);`,
        points: 5,
      },
      {
        id: 'ready',
        name: 'Готовность к сдаче',
        type: 'assert',
        code: `const readyToSubmit = ctx.get('readyToSubmit');
ctx.assert(
  readyToSubmit({ missingSections: [], unused: [], badCommits: 0, testsPass: true }) === true,
  'Всё в порядке — можно сдавать',
);
ctx.assert(
  readyToSubmit({ missingSections: ['Стек'], unused: [], badCommits: 0, testsPass: true }) === false,
  'Неполный README — сдавать рано',
);
ctx.assert(
  readyToSubmit({ missingSections: [], unused: ['Old.jsx'], badCommits: 0, testsPass: true }) === false,
  'Лишние файлы — сдавать рано',
);
ctx.assert(
  readyToSubmit({ missingSections: [], unused: [], badCommits: 1, testsPass: true }) === false,
  'Плохие подписи — сдавать рано',
);
ctx.assert(
  readyToSubmit({ missingSections: [], unused: [], badCommits: 0, testsPass: false }) === false,
  'Падающие проверки — сдавать нельзя',
);`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Раздел ищется построчно: разбейте текст по переводам строки и посмотрите строки, начинающиеся с ##.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Одно слово в подписи определяется так: message.trim().split(/\\s+/).length === 1.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'readyToSubmit: return state.missingSections.length === 0 && state.unused.length === 0 && state.badCommits === 0 && state.testsPass;',
        penaltyPercent: 35,
      },
    ],
    solution: `const REQUIRED_SECTIONS = ['Запуск', 'База данных', 'Адреса API', 'Стек'];
const ENTRY_POINT = 'main.jsx';

function checkReadme(text) {
  const headings = String(text)
    .split('\\n')
    .filter((line) => line.trim().indexOf('##') === 0);

  return REQUIRED_SECTIONS.filter((section) => !headings.some((line) => line.indexOf(section) !== -1));
}

function unusedFiles(files, imports) {
  return files.filter((file) => file !== ENTRY_POINT && imports.indexOf(file) === -1);
}

function historySummary(commits) {
  const bad = commits.filter((message) => {
    const text = String(message).trim();
    return text.length < 10 || text.split(/\\s+/).length === 1;
  }).length;

  return { total: commits.length, bad };
}

function readyToSubmit(state) {
  return (
    state.missingSections.length === 0 &&
    state.unused.length === 0 &&
    state.badCommits === 0 &&
    state.testsPass
  );
}`,
    solutionExplanation:
      'Точка входа вынесена в константу и исключена из проверки: на неё действительно никто не ссылается из кода, её подключает сборщик, и без этого исключения проверка ругалась бы каждый раз. Список обязательных разделов README — не формальность: проверяющий должен суметь развернуть проект, не спрашивая автора, а для этого ему нужны команда запуска, файл базы, список адресов и стек. Условие готовности собрано в одном месте намеренно — перед сдачей по нему проходят один раз, а не вспоминают, что ещё не сделано.',
    maxScore: 25,
    estimatedMinutes: 30,
    examRefs: ['m3-quality', 'm3-git', 'm2-git'],
    planDays: ['day-22-6'],
    source: 'plan',
  },

  {
    id: 'task-project3-db-auth',
    title: 'Третий проект: база фитнес-клуба за один день',
    kind: 'db',
    runtime: 'sql',
    difficulty: 4,
    tech: ['sql'],
    topicIds: ['new-domains'],
    monthNo: 6,
    weekNo: 23,
    statement: `Третья тема — **фитнес-клуб**. Планка выше: то, что в первый раз занимало три дня, сегодня делается за один.

1. \`users\` — \`id\`, \`login\` (обязательный, уникальный), \`password_hash\` (обязательный), \`full_name\` (обязательный), \`role\` (по умолчанию \`'user'\`).
2. \`trainings\` — справочник занятий: \`id\`, \`title\` (обязательный, уникальный), \`coach\` (обязательный), \`capacity\` (целое, обязательное), \`price\` (дробное с копейками, обязательное).
3. \`bookings\` — записи: \`id\`, \`user_id\`, \`training_id\` (обязательные внешние ключи), \`booking_date\` (обязательная), \`status\` (по умолчанию \`'Записан'\`, ограничен списком \`'Записан'\`, \`'Посетил'\`, \`'Пропустил'\`).
4. **Новое правило этой темы**: один человек не может записаться на одно занятие на ту же дату дважды. Это ограничение уникальности сразу по трём столбцам.
5. Заполните: три занятия, обычный пользователь, администратор, две записи.

Пункт 4 — то, ради чего стоит взять новую тему: такого ограничения в прошлых проектах не было, и придумать его нужно самому.`,
    requirements: [
      'Три таблицы со связями',
      'Роль по умолчанию user, есть администратор',
      'Статус ограничен списком допустимых',
      'Повторная запись на то же занятие в ту же дату невозможна',
      'Справочник занятий заполнен',
      'Добавлены две записи',
    ],
    starterCode: `-- Фитнес-клуб: база за один день

`,
    tests: [
      {
        id: 'trainings',
        name: 'Справочник занятий',
        type: 'sql-schema',
        table: 'trainings',
        columns: [
          { name: 'id', pk: true },
          { name: 'title', notNull: true },
          { name: 'coach', notNull: true },
          { name: 'capacity', notNull: true },
          { name: 'price', notNull: true },
        ],
        points: 4,
      },
      {
        id: 'bookings',
        name: 'Записи связаны с пользователем и занятием',
        type: 'sql-schema',
        table: 'bookings',
        columns: [
          { name: 'id', pk: true },
          { name: 'user_id', notNull: true },
          { name: 'training_id', notNull: true },
          { name: 'booking_date', notNull: true },
          { name: 'status', notNull: true },
        ],
        foreignKeys: [
          { column: 'user_id', refTable: 'users' },
          { column: 'training_id', refTable: 'trainings' },
        ],
        points: 5,
      },
      {
        id: 'status-check',
        name: 'Статус ограничен списком',
        type: 'sql-query',
        check: `SELECT CASE WHEN instr(upper(sql), 'CHECK') > 0 AND instr(sql, 'Посетил') > 0 AND instr(sql, 'Пропустил') > 0 THEN 1 ELSE 0 END FROM sqlite_master WHERE type = 'table' AND name = 'bookings'`,
        expectedRows: [[1]],
        points: 5,
      },
      {
        id: 'unique-booking',
        name: 'Повторная запись невозможна',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM pragma_index_list('bookings') WHERE "unique" = 1`,
        expectedRows: [[1]],
        points: 6,
      },
      {
        id: 'roles',
        name: 'Роль по умолчанию и администратор',
        type: 'sql-query',
        check: `SELECT role, COUNT(*) FROM users GROUP BY role ORDER BY role`,
        expectedRows: [
          ['admin', 1],
          ['user', 1],
        ],
        ordered: true,
        points: 5,
      },
      {
        id: 'data',
        name: 'Справочник и записи заполнены',
        type: 'sql-query',
        check: `SELECT (SELECT COUNT(*) FROM trainings), (SELECT COUNT(*) FROM bookings b JOIN trainings t ON t.id = b.training_id JOIN users u ON u.id = b.user_id)`,
        expectedRows: [[3, 2]],
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Скелет прежний: люди, справочник основного ресурса, записи. Новое только ограничение уникальности.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Ограничение сразу по нескольким столбцам пишется отдельной строкой в конце таблицы: UNIQUE (user_id, training_id, booking_date).',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Две записи в данных должны отличаться хотя бы одним из трёх столбцов — иначе ограничение сработает и вставка не пройдёт.',
        penaltyPercent: 35,
      },
    ],
    solution: `CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user'
);

CREATE TABLE trainings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE,
  coach VARCHAR(150) NOT NULL,
  capacity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  training_id INT NOT NULL,
  booking_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Записан'
    CHECK (status IN ('Записан', 'Посетил', 'Пропустил')),
  UNIQUE (user_id, training_id, booking_date),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (training_id) REFERENCES trainings(id)
);

INSERT INTO trainings (id, title, coach, capacity, price) VALUES
  (1, 'Йога для начинающих', 'Сидорова Светлана', 15, 890.50),
  (2, 'Силовая тренировка', 'Кузнецов Кирилл', 10, 1200.00),
  (3, 'Плавание', 'Морозова Мария', 8, 1500.00);

INSERT INTO users (id, login, password_hash, full_name) VALUES
  (1, 'ivanov26', 'hash', 'Иванов Иван Иванович');

INSERT INTO users (id, login, password_hash, full_name, role) VALUES
  (2, 'Admin26', 'hash', 'Администратор', 'admin');

INSERT INTO bookings (user_id, training_id, booking_date) VALUES
  (1, 1, '2027-03-12'),
  (1, 2, '2027-03-12');`,
    solutionExplanation:
      'Ограничение UNIQUE сразу по трём столбцам — единственное новое здесь, и оно показывает, зачем менять предметную область. Правило «нельзя записаться дважды» невозможно вывести из прошлых проектов, его нужно заметить в условии и перевести в схему. Сервер тоже будет проверять это перед вставкой, но база — последний рубеж: два одновременных запроса от одного пользователя пройдут проверку сервера оба, а ограничение отклонит второй. Две записи в примере отличаются занятием, поэтому обе проходят.',
    maxScore: 30,
    estimatedMinutes: 35,
    examRefs: ['m1-db', 'm3-db', 'm1-register'],
    planDays: ['day-23-1'],
    source: 'plan',
  },

  {
    id: 'task-project3-user-part',
    title: 'Третий проект: запись на занятие с правилами клуба',
    kind: 'app',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['new-domains'],
    monthNo: 6,
    weekNo: 23,
    statement: `Пользовательская часть фитнес-клуба. К третьему разу она должна писаться почти без остановок — если приходится вспоминать, отметьте эти места.

Компонент \`ClubPage\` принимает \`{ trainings, bookings, today, onBook }\`, где \`today\` — дата в формате \`ГГГГ-ММ-ДД\`.

1. Форма записи: список \`select[name="trainingId"]\` из \`trainings\` (\`{ id, title }\`) с пустым первым вариантом, поле \`input[name="date"]\` типа \`date\`, кнопка.
2. Незаполненная форма → \`#form-error\` «Заполните все поля», \`onBook\` не вызывается.
3. **Правило клуба 1**: записаться на прошедшую дату нельзя → «Дата не может быть в прошлом». Сегодняшняя дата допустима.
4. **Правило клуба 2**: повторная запись на то же занятие в ту же дату → «Вы уже записаны на это занятие». Существующие записи приходят в \`bookings\` (\`{ id, trainingId, date, title, status }\`).
5. Записи выводятся карточками \`.booking\` с датой в формате ДД.ММ.ГГГГ.`,
    requirements: [
      'Форма проверяет заполненность',
      'Прошедшая дата не принимается',
      'Сегодняшняя дата принимается',
      'Повторная запись отклоняется',
      'Верные данные вызывают onBook',
      'Записи выводятся с датой ДД.ММ.ГГГГ',
    ],
    starterCode: `function ClubPage({ trainings, bookings, today, onBook }) {
  // форма записи с двумя правилами клуба и список записей
}`,
    tests: [
      {
        id: 'empty-form',
        name: 'Пустая форма не отправляется',
        type: 'react',
        code: `const trainings = [{ id: 1, title: 'Йога' }, { id: 2, title: 'Плавание' }];
let called = 0;
return ctx.render('ClubPage', { trainings, bookings: [], today: '2027-03-12', onBook: () => { called += 1; } })
  .then(() => ctx.change('select[name="trainingId"]', ''))
  .then(() => ctx.change('input[name="date"]', ''))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(called === 0, 'Пустая форма не должна вызывать onBook');
    ctx.assert(ctx.text('#form-error').indexOf('Заполните все поля') !== -1, 'Нет сообщения: ' + ctx.text('#form-error'));
  });`,
        points: 4,
      },
      {
        id: 'past-date',
        name: 'Прошедшая дата не принимается',
        type: 'react',
        code: `const trainings = [{ id: 1, title: 'Йога' }];
let called = 0;
return ctx.render('ClubPage', { trainings, bookings: [], today: '2027-03-12', onBook: () => { called += 1; } })
  .then(() => ctx.change('select[name="trainingId"]', '1'))
  .then(() => ctx.change('input[name="date"]', '2027-03-11'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(called === 0, 'Запись на прошедшую дату проходить не должна');
    ctx.assert(
      ctx.text('#form-error').indexOf('Дата не может быть в прошлом') !== -1,
      'Текст ошибки не совпадает: ' + ctx.text('#form-error'),
    );
  });`,
        points: 6,
      },
      {
        id: 'today-allowed',
        name: 'Сегодняшняя дата принимается',
        type: 'react',
        code: `const trainings = [{ id: 1, title: 'Йога' }];
const calls = [];
return ctx.render('ClubPage', { trainings, bookings: [], today: '2027-03-12', onBook: (data) => calls.push(data) })
  .then(() => ctx.change('select[name="trainingId"]', '1'))
  .then(() => ctx.change('input[name="date"]', '2027-03-12'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(calls.length === 1, 'Запись на сегодня должна проходить, вызовов onBook: ' + calls.length);
    ctx.assert(ctx.text('#form-error') === '', 'Сообщения об ошибке быть не должно: ' + ctx.text('#form-error'));
  });`,
        points: 5,
      },
      {
        id: 'duplicate',
        name: 'Повторная запись отклоняется',
        type: 'react',
        code: `const trainings = [{ id: 1, title: 'Йога' }, { id: 2, title: 'Плавание' }];
const bookings = [{ id: 100, trainingId: 1, date: '2027-03-20', title: 'Йога', status: 'Записан' }];
let called = 0;
return ctx.render('ClubPage', { trainings, bookings, today: '2027-03-12', onBook: () => { called += 1; } })
  .then(() => ctx.change('select[name="trainingId"]', '1'))
  .then(() => ctx.change('input[name="date"]', '2027-03-20'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(called === 0, 'Повторная запись проходить не должна');
    ctx.assert(
      ctx.text('#form-error').indexOf('Вы уже записаны на это занятие') !== -1,
      'Текст ошибки не совпадает: ' + ctx.text('#form-error'),
    );
  });`,
        points: 7,
      },
      {
        id: 'other-training-allowed',
        name: 'На другое занятие в тот же день записаться можно',
        type: 'react',
        code: `const trainings = [{ id: 1, title: 'Йога' }, { id: 2, title: 'Плавание' }];
const bookings = [{ id: 100, trainingId: 1, date: '2027-03-20', title: 'Йога', status: 'Записан' }];
const calls = [];
return ctx.render('ClubPage', { trainings, bookings, today: '2027-03-12', onBook: (data) => calls.push(data) })
  .then(() => ctx.change('select[name="trainingId"]', '2'))
  .then(() => ctx.change('input[name="date"]', '2027-03-20'))
  .then(() => ctx.submit('form'))
  .then(() => {
    ctx.assert(calls.length === 1, 'Другое занятие в тот же день — это другая запись, она должна проходить');
  });`,
        points: 5,
      },
      {
        id: 'list',
        name: 'Записи выводятся с датой ДД.ММ.ГГГГ',
        type: 'react',
        code: `const trainings = [{ id: 1, title: 'Йога' }];
const bookings = [
  { id: 100, trainingId: 1, date: '2027-03-20', title: 'Йога', status: 'Записан' },
  { id: 101, trainingId: 1, date: '2027-04-02', title: 'Йога', status: 'Посетил' },
];
return ctx.render('ClubPage', { trainings, bookings, today: '2027-03-12', onBook: () => {} }).then(() => {
  ctx.assert(ctx.$$('.booking').length === 2, 'Карточек должно быть две, найдено: ' + ctx.$$('.booking').length);
  const text = ctx.text();
  ctx.assert(text.indexOf('20.03.2027') !== -1, 'Дата должна быть в формате ДД.ММ.ГГГГ, сейчас: ' + text.slice(0, 120));
  ctx.assert(text.indexOf('2027-03-20') === -1, 'Машинный формат даты показывать не нужно');
  ctx.assert(text.indexOf('Посетил') !== -1, 'Статус записи должен быть виден');
});`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Обе даты приходят в формате ГГГГ-ММ-ДД, поэтому сравнивать их можно как обычные строки.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Повтор ищется по двум полям сразу: bookings.some((b) => String(b.trainingId) === trainingId && b.date === date).',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Порядок проверок: заполненность → прошлое → повтор. Каждая заканчивается return, иначе выполнится следующая.',
        penaltyPercent: 35,
      },
    ],
    solution: `function ClubPage({ trainings, bookings, today, onBook }) {
  const [trainingId, setTrainingId] = React.useState('');
  const [date, setDate] = React.useState('');
  const [error, setError] = React.useState('');

  const toRuDate = (iso) => iso.split('-').reverse().join('.');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!trainingId || !date) {
      setError('Заполните все поля');
      return;
    }

    if (date < today) {
      setError('Дата не может быть в прошлом');
      return;
    }

    const duplicate = bookings.some(
      (booking) => String(booking.trainingId) === String(trainingId) && booking.date === date,
    );

    if (duplicate) {
      setError('Вы уже записаны на это занятие');
      return;
    }

    setError('');
    onBook({ trainingId, date });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="trainingId">Занятие</label>
        <select
          id="trainingId"
          name="trainingId"
          value={trainingId}
          onChange={(event) => setTrainingId(event.target.value)}
        >
          <option value="">Выберите занятие</option>
          {trainings.map((training) => (
            <option value={training.id} key={training.id}>
              {training.title}
            </option>
          ))}
        </select>

        <label htmlFor="date">Дата</label>
        <input id="date" name="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />

        <button type="submit">Записаться</button>
        <p id="form-error">{error}</p>
      </form>

      {bookings.map((booking) => (
        <article className="booking" key={booking.id}>
          <h3>{booking.title}</h3>
          <p>{toRuDate(booking.date)}</p>
          <p>{booking.status}</p>
        </article>
      ))}
    </div>
  );
}`,
    solutionExplanation:
      'Сравнение дат обычными строками работает только потому, что обе в формате ГГГГ-ММ-ДД: год, месяц, день идут по убыванию значимости, и лексикографический порядок совпадает с хронологическим. В формате ДД.ММ.ГГГГ это сломалось бы сразу. Поиск повтора идёт по двум полям одновременно — и это ровно то же правило, что записано ограничением UNIQUE в базе. Две проверки одного правила не дублирование: интерфейс объясняет по-человечески и сразу, база защищает от одновременных запросов.',
    maxScore: 32,
    estimatedMinutes: 40,
    examRefs: ['m1-order', 'm1-cabinet', 'm2-order-form'],
    planDays: ['day-23-2'],
    source: 'plan',
  },

  {
    id: 'task-project3-admin-mobile',
    title: 'Третий проект: админка клуба и узкий экран',
    kind: 'app',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['new-domains'],
    monthNo: 6,
    weekNo: 23,
    statement: `Закрываем третий проект целиком: админка плюс проверка на узком экране. Это ровно тот объём, который на экзамене приходится на первые два модуля.

Компонент \`ClubAdmin\` принимает \`{ bookings, onMark }\`, где \`bookings\` — массив \`{ id, client, training, date, status }\` (дата в формате ДД.ММ.ГГГГ), а \`onMark(id, status)\` возвращает промис.

1. Таблица \`#bookings\` со строкой на запись. В каждой строке две кнопки: \`.mark-visited\` («Посетил») и \`.mark-missed\` («Пропустил»).
2. Кнопки отмечают посещение: вызывают \`onMark\` и обновляют статус строки на месте. При отказе сервера статус возвращается к прежнему.
3. У записи со статусом, отличным от \`'Записан'\`, кнопок нет — отметка делается один раз.
4. Фильтр \`#filter\` по статусу, счётчик \`#count\`.
5. Сводка \`#summary\` вида \`Посетил: 1, Пропустил: 0\` — считается по всем записям, а не по видимым.`,
    requirements: [
      'Таблица строится из массива',
      'Кнопка «Посетил» меняет статус строки',
      'Отказ сервера возвращает прежний статус',
      'У отмеченной записи кнопок нет',
      'Фильтр и счётчик работают',
      'Сводка считается по всем записям',
    ],
    starterCode: `const STATUSES = ['Записан', 'Посетил', 'Пропустил'];

function ClubAdmin({ bookings, onMark }) {
  // таблица, отметка посещения, фильтр, сводка
}`,
    tests: [
      {
        id: 'table',
        name: 'Таблица и кнопки отметки',
        type: 'react',
        code: `const bookings = [
  { id: 1, client: 'Иванов', training: 'Йога', date: '20.03.2027', status: 'Записан' },
  { id: 2, client: 'Петров', training: 'Плавание', date: '21.03.2027', status: 'Записан' },
];
return ctx.render('ClubAdmin', { bookings, onMark: () => Promise.resolve() })
  .then(() => ctx.change('#filter', ''))
  .then(() => {
    ctx.assert(ctx.$('#bookings'), 'Нет таблицы #bookings');
    ctx.assert(ctx.$$('tbody tr').length === 2, 'Строк должно быть две, найдено: ' + ctx.$$('tbody tr').length);
    ctx.assert(ctx.$$('.mark-visited').length === 2, 'У каждой записи должна быть кнопка «Посетил»');
    ctx.assert(ctx.$$('.mark-missed').length === 2, 'У каждой записи должна быть кнопка «Пропустил»');
  });`,
        points: 5,
      },
      {
        id: 'mark',
        name: 'Отметка меняет статус',
        type: 'react',
        code: `const bookings = [{ id: 1, client: 'Иванов', training: 'Йога', date: '20.03.2027', status: 'Записан' }];
const calls = [];
return ctx.render('ClubAdmin', { bookings, onMark: (id, status) => { calls.push({ id, status }); return Promise.resolve(); } })
  .then(() => ctx.change('#filter', ''))
  .then(() => ctx.click('.mark-visited'))
  .then(() => ctx.advanceTime(50))
  .then(() => {
    ctx.assert(calls.length === 1, 'onMark должен вызваться один раз, вызовов: ' + calls.length);
    ctx.assert(calls[0].status === 'Посетил', 'Передан неверный статус: ' + ctx.preview(calls[0]));
    ctx.assert(ctx.text().indexOf('Посетил') !== -1, 'Статус строки должен обновиться');
  });`,
        points: 6,
      },
      {
        id: 'no-buttons-after',
        name: 'У отмеченной записи кнопок нет',
        type: 'react',
        code: `const bookings = [{ id: 5, client: 'Сидоров', training: 'Силовая', date: '22.03.2027', status: 'Посетил' }];
return ctx.render('ClubAdmin', { bookings, onMark: () => Promise.resolve() })
  .then(() => ctx.change('#filter', 'Посетил'))
  .then(() => {
    const rows = ctx.$$('tbody tr');
    ctx.assert(rows.length >= 1, 'Отмеченная запись должна быть видна при своём фильтре');
    rows.forEach((row) => {
      ctx.assert(!row.querySelector('.mark-visited'), 'У отмеченной записи кнопок быть не должно');
      ctx.assert(!row.querySelector('.mark-missed'), 'У отмеченной записи кнопок быть не должно');
    });
  });`,
        points: 6,
      },
      {
        id: 'rollback',
        name: 'Отказ возвращает прежний статус',
        type: 'react',
        code: `const bookings = [{ id: 9, client: 'Кузнецов', training: 'Плавание', date: '25.03.2027', status: 'Записан' }];
return ctx.render('ClubAdmin', { bookings, onMark: () => Promise.reject(new Error('отказ')) })
  .then(() => ctx.change('#filter', 'Записан'))
  .then(() => {
    const button = ctx.$('.mark-missed');
    ctx.assert(button, 'Нужна запись со статусом «Записан» и кнопкой');
    return ctx.click(button);
  })
  .then(() => ctx.advanceTime(100))
  .then(() => {
    ctx.assert(
      ctx.$$('tbody tr').length >= 1 && ctx.$('.mark-missed'),
      'После отказа статус должен вернуться к «Записан», а значит кнопки снова на месте',
    );
  });`,
        points: 6,
      },
      {
        id: 'filter-count',
        name: 'Фильтр и счётчик',
        type: 'react',
        code: `const bookings = [
  { id: 1, client: 'Иванов', training: 'Йога', date: '20.03.2027', status: 'Записан' },
  { id: 2, client: 'Петров', training: 'Плавание', date: '21.03.2027', status: 'Посетил' },
];
return ctx.render('ClubAdmin', { bookings, onMark: () => Promise.resolve() })
  .then(() => ctx.change('#filter', 'Посетил'))
  .then(() => {
    const rows = ctx.$$('tbody tr');
    ctx.assert(rows.length >= 1, 'При фильтре «Посетил» должна остаться хотя бы одна запись');
    rows.forEach((row) => {
      ctx.assert(row.textContent.indexOf('Посетил') !== -1, 'В отфильтрованной таблице чужие статусы: ' + row.textContent);
    });
    ctx.assert(ctx.text('#count').indexOf(String(rows.length)) !== -1, 'Счётчик должен совпадать с числом строк');
  });`,
        points: 5,
      },
      {
        id: 'summary',
        name: 'Сводка по всем записям',
        type: 'react',
        code: `const bookings = [
  { id: 1, client: 'Иванов', training: 'Йога', date: '20.03.2027', status: 'Записан' },
  { id: 2, client: 'Петров', training: 'Плавание', date: '21.03.2027', status: 'Посетил' },
];
return ctx.render('ClubAdmin', { bookings, onMark: () => Promise.resolve() })
  .then(() => ctx.change('#filter', 'Записан'))
  .then(() => {
    const summary = ctx.text('#summary');
    ctx.assert(summary, 'Нет блока #summary');
    ctx.assert(
      /Посетил\\s*:\\s*\\d+/.test(summary) && /Пропустил\\s*:\\s*\\d+/.test(summary),
      'Сводка должна показывать оба счётчика, сейчас: ' + summary,
    );
    ctx.assert(
      summary.indexOf('Посетил: 0') === -1,
      'Сводка считается по всем записям, а не по видимым: при фильтре «Записан» посещения не должны обнуляться. Сейчас: ' + summary,
    );
  });`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Кнопки выводите по условию: {item.status === "Записан" ? <кнопки/> : null}.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Сводка считается по items, а не по visible — в этом и есть разница между «всего» и «показано».',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const visited = items.filter((item) => item.status === "Посетил").length; — и отдельно для пропустивших.',
        penaltyPercent: 35,
      },
    ],
    solution: `const STATUSES = ['Записан', 'Посетил', 'Пропустил'];

function ClubAdmin({ bookings, onMark }) {
  const [items, setItems] = React.useState(bookings);
  const [filter, setFilter] = React.useState('');

  const update = (id, status) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const mark = (item, status) => {
    const previous = item.status;
    update(item.id, status);
    onMark(item.id, status).catch(() => update(item.id, previous));
  };

  const visible = items.filter((item) => !filter || item.status === filter);
  const visited = items.filter((item) => item.status === 'Посетил').length;
  const missed = items.filter((item) => item.status === 'Пропустил').length;

  return (
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

      <p id="count">Показано записей: {visible.length}</p>
      <p id="summary">
        Посетил: {visited}, Пропустил: {missed}
      </p>

      <table id="bookings">
        <thead>
          <tr>
            <th>№</th>
            <th>Клиент</th>
            <th>Занятие</th>
            <th>Дата</th>
            <th>Статус</th>
            <th>Отметка</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.client}</td>
              <td>{item.training}</td>
              <td>{item.date}</td>
              <td>{item.status}</td>
              <td>
                {item.status === 'Записан' ? (
                  <span>
                    <button className="mark-visited" type="button" onClick={() => mark(item, 'Посетил')}>
                      Посетил
                    </button>
                    <button className="mark-missed" type="button" onClick={() => mark(item, 'Пропустил')}>
                      Пропустил
                    </button>
                  </span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
    solutionExplanation:
      'Разница между счётчиком и сводкой важнее, чем кажется: счётчик отвечает на вопрос «сколько строк я сейчас вижу», сводка — «что происходит в клубе вообще». Если считать сводку по видимым записям, при любом фильтре она начнёт врать. Кнопки отметки исчезают после первого использования — это заменяет собой отдельную защиту от повторной отметки: действие, которое нельзя сделать дважды, не должно и предлагаться дважды.',
    maxScore: 34,
    estimatedMinutes: 45,
    examRefs: ['m1-admin', 'm2-admin-tools'],
    planDays: ['day-23-3'],
    source: 'plan',
  },

  {
    id: 'task-server-side-filters',
    title: 'Фильтры, сортировка и страницы на стороне сервера',
    kind: 'api',
    runtime: 'js',
    difficulty: 5,
    tech: ['express', 'sql', 'security'],
    topicIds: ['new-domains', 'code-quality'],
    monthNo: 6,
    weekNo: 23,
    statement: `Тема необязательная — берите, только если всё остальное уже пишется на автомате. Пока записей десятки, фильтровать можно в браузере. Когда их тысячи, отбор переносят на сервер.

Здесь появляется отдельная опасность. Значения подставляются параметрами, но **имя столбца для сортировки параметром подставить нельзя** — оно часть текста запроса. Значит, его нужно проверять по списку допустимых.

1. \`buildQuery(params)\` — принимает \`{ status, sort, direction, page }\` и возвращает \`{ sql, values }\`:
   - базовый запрос \`SELECT * FROM bookings\`;
   - если \`status\` задан, добавляется \`WHERE status = ?\`, значение уходит в \`values\`;
   - сортировка только по столбцам из списка \`['id', 'booking_date', 'status']\`; чужое имя заменяется на \`'id'\`;
   - направление только \`'asc'\` или \`'desc'\`, иначе \`'asc'\`;
   - постранично по **20** записей: \`LIMIT ? OFFSET ?\`, значения тоже в \`values\`. Номер страницы меньше 1 считается первой.
2. Порядок частей запроса: \`WHERE\`, затем \`ORDER BY\`, затем \`LIMIT\`.
3. \`countQuery(params)\` — возвращает \`{ sql, values }\` для подсчёта общего количества с тем же фильтром: \`SELECT COUNT(*) AS total FROM bookings\` и тем же \`WHERE\`, но без сортировки и страниц.`,
    requirements: [
      'Без фильтра запрос не содержит WHERE',
      'Фильтр уходит параметром, а не в текст',
      'Имя столбца сортировки проверяется по списку',
      'Направление сортировки ограничено двумя значениями',
      'Постраничная выборка по 20 записей со смещением',
      'countQuery повторяет фильтр без сортировки и страниц',
    ],
    starterCode: `const SORTABLE = ['id', 'booking_date', 'status'];
const PAGE_SIZE = 20;

function buildQuery(params) {
  // { sql, values }
}

function countQuery(params) {
  // подсчёт с тем же фильтром
}`,
    tests: [
      {
        id: 'no-filter',
        name: 'Без фильтра нет WHERE',
        type: 'assert',
        code: `const buildQuery = ctx.get('buildQuery');
const { sql, values } = buildQuery({ page: 1 });
ctx.assert(sql.toUpperCase().indexOf('WHERE') === -1, 'Без фильтра WHERE не нужен, получено: ' + sql);
ctx.assert(sql.toUpperCase().indexOf('LIMIT') !== -1, 'Постраничная выборка нужна всегда');
ctx.assert(values.length === 2, 'В значениях должны остаться только предел и смещение, получено: ' + ctx.preview(values));
ctx.assert(values[0] === 20 && values[1] === 0, 'Первая страница: предел 20, смещение 0. Получено: ' + ctx.preview(values));`,
        points: 5,
      },
      {
        id: 'filter',
        name: 'Фильтр уходит параметром',
        type: 'assert',
        code: `const buildQuery = ctx.get('buildQuery');
const { sql, values } = buildQuery({ status: 'Записан', page: 1 });
ctx.assert(sql.toUpperCase().indexOf('WHERE') !== -1, 'Нужен WHERE');
ctx.assert(sql.indexOf('Записан') === -1, 'Значение не должно попадать в текст запроса: ' + sql);
ctx.assert(values[0] === 'Записан', 'Первым значением должен идти статус, получено: ' + ctx.preview(values));
ctx.assert(values.length === 3, 'Значений должно быть три: статус, предел, смещение. Получено: ' + ctx.preview(values));`,
        points: 6,
      },
      {
        id: 'sort-whitelist',
        name: 'Чужое имя столбца отбрасывается',
        type: 'assert',
        code: `const buildQuery = ctx.get('buildQuery');
const dangerous = buildQuery({ sort: 'id; DROP TABLE bookings; --', page: 1 });
ctx.assert(
  dangerous.sql.indexOf('DROP') === -1,
  'Имя столбца подставляется в текст запроса, поэтому его нужно проверять по списку. Получено: ' + dangerous.sql,
);
ctx.assert(/ORDER BY\\s+id\\b/i.test(dangerous.sql), 'Для чужого имени должен подставляться id, получено: ' + dangerous.sql);
const good = buildQuery({ sort: 'booking_date', page: 1 });
ctx.assert(/ORDER BY\\s+booking_date/i.test(good.sql), 'Допустимое имя должно подставляться, получено: ' + good.sql);`,
        points: 7,
      },
      {
        id: 'direction',
        name: 'Направление ограничено двумя значениями',
        type: 'assert',
        code: `const buildQuery = ctx.get('buildQuery');
const desc = buildQuery({ sort: 'id', direction: 'desc', page: 1 });
ctx.assert(/DESC/i.test(desc.sql), 'Направление desc должно попадать в запрос: ' + desc.sql);
const weird = buildQuery({ sort: 'id', direction: 'вниз; DELETE FROM bookings', page: 1 });
ctx.assert(weird.sql.indexOf('DELETE') === -1, 'Чужое направление в запрос попадать не должно: ' + weird.sql);
ctx.assert(/ASC/i.test(weird.sql), 'Для непонятного направления подставляется asc, получено: ' + weird.sql);`,
        points: 6,
      },
      {
        id: 'pagination',
        name: 'Смещение считается по номеру страницы',
        type: 'assert',
        code: `const buildQuery = ctx.get('buildQuery');
const third = buildQuery({ page: 3 });
ctx.assert(
  third.values[third.values.length - 1] === 40,
  'Третья страница по 20 записей — смещение 40, получено: ' + ctx.preview(third.values),
);
const zero = buildQuery({ page: 0 });
ctx.assert(
  zero.values[zero.values.length - 1] === 0,
  'Номер страницы меньше единицы считается первой страницей, получено: ' + ctx.preview(zero.values),
);`,
        points: 6,
      },
      {
        id: 'count',
        name: 'Подсчёт повторяет фильтр',
        type: 'assert',
        code: `const countQuery = ctx.get('countQuery');
const filtered = countQuery({ status: 'Посетил', sort: 'booking_date', direction: 'desc', page: 2 });
ctx.assert(/COUNT\\s*\\(/i.test(filtered.sql), 'Нужен COUNT(*)');
ctx.assert(filtered.sql.toUpperCase().indexOf('WHERE') !== -1, 'Фильтр должен сохраняться');
ctx.assert(filtered.sql.toUpperCase().indexOf('ORDER BY') === -1, 'В подсчёте сортировка не нужна: ' + filtered.sql);
ctx.assert(filtered.sql.toUpperCase().indexOf('LIMIT') === -1, 'В подсчёте постраничная выборка не нужна: ' + filtered.sql);
ctx.assert(filtered.values.length === 1 && filtered.values[0] === 'Посетил', 'Значения: ' + ctx.preview(filtered.values));`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Собирайте запрос по частям в массив строк, а в конце склеивайте пробелом. Так проще держать порядок WHERE → ORDER BY → LIMIT.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Белый список — это проверка вхождения: SORTABLE.includes(params.sort) ? params.sort : "id". Никаких экранирований, только выбор из известного.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const offset = (Math.max(1, Number(params.page) || 1) - 1) * PAGE_SIZE; values.push(PAGE_SIZE, offset);',
        penaltyPercent: 35,
      },
    ],
    solution: `const SORTABLE = ['id', 'booking_date', 'status'];
const PAGE_SIZE = 20;

function whereClause(params) {
  if (!params.status) return { sql: '', values: [] };
  return { sql: 'WHERE status = ?', values: [params.status] };
}

function buildQuery(params) {
  const where = whereClause(params);

  const sort = SORTABLE.indexOf(params.sort) !== -1 ? params.sort : 'id';
  const direction = params.direction === 'desc' ? 'DESC' : 'ASC';

  const page = Math.max(1, Number(params.page) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const parts = ['SELECT * FROM bookings'];
  if (where.sql) parts.push(where.sql);
  parts.push('ORDER BY ' + sort + ' ' + direction);
  parts.push('LIMIT ? OFFSET ?');

  return { sql: parts.join(' '), values: where.values.concat([PAGE_SIZE, offset]) };
}

function countQuery(params) {
  const where = whereClause(params);

  const parts = ['SELECT COUNT(*) AS total FROM bookings'];
  if (where.sql) parts.push(where.sql);

  return { sql: parts.join(' '), values: where.values };
}`,
    solutionExplanation:
      'Белый список столбцов — не перестраховка, а единственный рабочий способ. Значения подставляются параметрами, и драйвер их экранирует, но имя столбца и направление сортировки являются частью самого текста запроса: подставить их через знак вопроса невозможно. Остаётся выбирать из заранее известного набора. Попытка «экранировать» имя столбца вручную — классическая ошибка, которая рано или поздно пропускает что-нибудь опасное. Функция whereClause вынесена отдельно, потому что фильтр в двух запросах обязан совпадать: иначе общее количество не сойдётся с количеством страниц.',
    maxScore: 36,
    estimatedMinutes: 40,
    examRefs: ['m2-admin-tools', 'm3-quality'],
    planDays: ['day-23-4'],
    source: 'plan',
  },

  {
    id: 'task-weak-spots-drill',
    title: 'Повторение слабых мест: пять типовых ловушек',
    kind: 'fix-bug',
    runtime: 'js',
    difficulty: 4,
    tech: ['js'],
    topicIds: ['memory-training'],
    monthNo: 6,
    weekNo: 23,
    statement: `Работаем по личному списку «застрял на…». Здесь собраны пять мест, на которых спотыкаются чаще всего, — каждое написано с ошибкой. Найдите и почините.

1. \`sumPrices\` — падает на пустом массиве.
2. \`sortByDate\` — портит исходный массив и сравнивает даты ДД.ММ.ГГГГ как строки.
3. \`toggleStatus\` — меняет объект на месте, из-за чего React не увидит изменения.
4. \`findRoom\` — сравнивает строку из адреса с числом через строгое равенство.
5. \`countDigits\` — считает символы вместо цифр.

Поведение должно стать правильным, имена функций менять нельзя.`,
    requirements: [
      'sumPrices работает на пустом массиве',
      'sortByDate не портит исходный массив',
      'sortByDate сортирует даты хронологически',
      'toggleStatus возвращает новый объект',
      'findRoom находит по номеру из адреса',
      'countDigits считает только цифры',
    ],
    starterCode: `function sumPrices(items) {
  return items.reduce((sum, item) => sum + item.price);
}

function sortByDate(items) {
  return items.sort((a, b) => a.date.localeCompare(b.date));
}

function toggleStatus(item) {
  item.status = item.status === 'Новая' ? 'Мероприятие завершено' : 'Новая';
  return item;
}

function findRoom(rooms, id) {
  return rooms.find((room) => room.id === id);
}

function countDigits(phone) {
  return phone.length;
}`,
    tests: [
      {
        id: 'sum',
        name: 'sumPrices не падает на пустом массиве',
        type: 'assert',
        code: `const sumPrices = ctx.get('sumPrices');
ctx.assert(sumPrices([]) === 0, 'Для пустого массива должен вернуться 0, получено: ' + ctx.preview(sumPrices([])));
ctx.assert(sumPrices([{ price: 100 }, { price: 250 }]) === 350, 'Сумма считается неверно');`,
        points: 5,
      },
      {
        id: 'sort-pure',
        name: 'sortByDate не портит исходный массив',
        type: 'assert',
        code: `const sortByDate = ctx.get('sortByDate');
const items = [{ date: '19.04.2027' }, { date: '05.02.2027' }];
const before = items.map((item) => item.date).join(',');
sortByDate(items);
ctx.assert(
  items.map((item) => item.date).join(',') === before,
  'Метод sort сортирует на месте — перед ним нужна копия. Было ' + before + ', стало ' + items.map((item) => item.date).join(','),
);`,
        points: 5,
      },
      {
        id: 'sort-order',
        name: 'sortByDate сортирует хронологически',
        type: 'assert',
        code: `const sortByDate = ctx.get('sortByDate');
const items = [{ date: '19.04.2027' }, { date: '05.02.2027' }, { date: '12.03.2027' }];
const sorted = sortByDate(items).map((item) => item.date);
ctx.assert(
  sorted.join(',') === '05.02.2027,12.03.2027,19.04.2027',
  'Даты ДД.ММ.ГГГГ нельзя сравнивать как строки: первым идёт день. Получено: ' + sorted.join(', '),
);`,
        points: 6,
      },
      {
        id: 'toggle',
        name: 'toggleStatus возвращает новый объект',
        type: 'assert',
        code: `const toggleStatus = ctx.get('toggleStatus');
const item = { id: 1, status: 'Новая' };
const result = toggleStatus(item);
ctx.assert(result.status === 'Мероприятие завершено', 'Статус не переключился');
ctx.assert(item.status === 'Новая', 'Исходный объект изменён: React не увидит изменения и не перерисует список');
ctx.assert(result !== item, 'Нужно вернуть новый объект, а не тот же самый');`,
        points: 6,
      },
      {
        id: 'find',
        name: 'findRoom находит по номеру из адреса',
        type: 'assert',
        code: `const findRoom = ctx.get('findRoom');
const rooms = [{ id: 1, title: 'Аудитория' }, { id: 2, title: 'Коворкинг' }];
ctx.assert(
  findRoom(rooms, '2') && findRoom(rooms, '2').title === 'Коворкинг',
  'В адресе номер приходит строкой — сравнение === с числом всегда даёт false',
);
ctx.assert(findRoom(rooms, 1) && findRoom(rooms, 1).title === 'Аудитория', 'Числовой номер тоже должен работать');
ctx.assert(findRoom(rooms, '99') === undefined, 'Для отсутствующего номера нужен undefined');`,
        points: 6,
      },
      {
        id: 'digits',
        name: 'countDigits считает только цифры',
        type: 'assert',
        code: `const countDigits = ctx.get('countDigits');
ctx.assert(countDigits('+7 (900) 123-45-67') === 11, 'В этом номере 11 цифр, получено: ' + countDigits('+7 (900) 123-45-67'));
ctx.assert(countDigits('89001234567') === 11, 'Номер без разделителей: ' + countDigits('89001234567'));
ctx.assert(countDigits('') === 0, 'Пустая строка — ноль цифр');`,
        points: 5,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'У reduce есть второй аргумент — начальное значение. Без него на пустом массиве он выбрасывает ошибку.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Дату ДД.ММ.ГГГГ перед сравнением переворачивают: date.split(".").reverse().join("-").',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'toggleStatus: return { ...item, status: item.status === "Новая" ? "Мероприятие завершено" : "Новая" }; findRoom: room.id === Number(id).',
        penaltyPercent: 35,
      },
    ],
    solution: `function sumPrices(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

function sortByDate(items) {
  const iso = (date) => date.split('.').reverse().join('-');
  return items.slice().sort((a, b) => iso(a.date).localeCompare(iso(b.date)));
}

function toggleStatus(item) {
  return {
    ...item,
    status: item.status === 'Новая' ? 'Мероприятие завершено' : 'Новая',
  };
}

function findRoom(rooms, id) {
  return rooms.find((room) => room.id === Number(id));
}

function countDigits(phone) {
  return String(phone).replace(/\\D/g, '').length;
}`,
    solutionExplanation:
      'Пять ошибок — пять разных причин, но все они проявляются не там, где написаны. Reduce без начального значения падает только на пустых данных, то есть у первого же нового пользователя. Сортировка на месте ломает не сортировку, а перерисовку списка. Изменение объекта на месте приводит к тому, что данные обновились, а экран нет. Сравнение строки с числом даёт «не найдено» на совершенно правильном адресе. Длина строки вместо количества цифр отвергает нормальный телефон с разделителями. Такие ошибки стоит держать списком и проверять по нему каждый новый кусок кода.',
    maxScore: 33,
    estimatedMinutes: 30,
    examRefs: ['m3-quality'],
    planDays: ['day-23-5'],
    source: 'plan',
  },

  {
    id: 'task-sql-recall',
    title: 'Повторение SQL: запросы по памяти',
    kind: 'db',
    runtime: 'sql',
    difficulty: 4,
    tech: ['sql'],
    topicIds: ['memory-training'],
    monthNo: 6,
    weekNo: 23,
    statement: `SQL забывается быстрее остального: его пишут реже, чем разметку и компоненты, а на экзамене он идёт первым пунктом. Напишите шесть запросов подряд, не подглядывая.

База уже создана: \`users\`, \`rooms\`, \`applications\` (со столбцами \`user_id\`, \`room_id\`, \`start_date\`, \`status\`), \`reviews\`.

1. Все заявки с названием помещения и именем пользователя: столбцы \`id\`, \`room\`, \`user\`, по возрастанию \`id\`.
2. Сколько заявок у каждого пользователя: \`login\`, \`total\`, по убыванию \`total\`, затем по \`login\`.
3. Помещения, которые ни разу не бронировали: столбец \`title\`, по алфавиту.
4. Заявки со статусом «Новая», у которых дата позже \`2027-03-01\`: \`id\`, \`start_date\`, по возрастанию даты.
5. Средняя оценка по отзывам, округлённая до одного знака: столбец \`avg_rating\`.
6. Заявки с отзывами и без них: \`id\` и \`has_review\` (1 или 0), по возрастанию \`id\`.

Третий и шестой запросы — те самые, где нужен \`LEFT JOIN\`, и именно их забывают чаще всего.`,
    requirements: [
      'Соединение трёх таблиц',
      'Группировка с подсчётом и двойной сортировкой',
      'Поиск записей без связанных через LEFT JOIN',
      'Отбор по статусу и дате',
      'Среднее с округлением',
      'Признак наличия связанной записи',
    ],
    setupSql: `
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  login TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL
);

CREATE TABLE rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL UNIQUE
);

CREATE TABLE applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  room_id INTEGER NOT NULL REFERENCES rooms(id),
  start_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Новая'
);

CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL UNIQUE REFERENCES applications(id),
  rating INTEGER NOT NULL,
  text TEXT
);

INSERT INTO users (id, login, full_name) VALUES
  (1, 'ivanov26', 'Иванов Иван Иванович'),
  (2, 'petrov26', 'Петров Пётр Петрович');

INSERT INTO rooms (id, title) VALUES (1, 'Аудитория'), (2, 'Коворкинг'), (3, 'Кинозал'), (4, 'Переговорная');

INSERT INTO applications (id, user_id, room_id, start_date, status) VALUES
  (1, 1, 2, '2027-03-12', 'Новая'),
  (2, 1, 3, '2027-02-20', 'Мероприятие завершено'),
  (3, 2, 1, '2027-04-19', 'Новая'),
  (4, 1, 2, '2027-01-15', 'Новая');

INSERT INTO reviews (id, application_id, rating, text) VALUES
  (1, 2, 5, 'Отлично'),
  (2, 3, 4, 'Хорошо');
`,
    starterCode: `-- 1. Заявки с названием помещения и именем пользователя


-- 2. Сколько заявок у каждого пользователя


-- 3. Помещения, которые ни разу не бронировали


-- 4. Новые заявки позже 2027-03-01


-- 5. Средняя оценка


-- 6. Заявки с признаком наличия отзыва

`,
    tests: [
      {
        id: 'join3',
        name: 'Соединение трёх таблиц',
        type: 'sql-query',
        check: `SELECT a.id, r.title AS room, u.login AS user FROM applications a JOIN rooms r ON r.id = a.room_id JOIN users u ON u.id = a.user_id ORDER BY a.id`,
        expectedColumns: ['id', 'room', 'user'],
        expectedRows: [
          [1, 'Коворкинг', 'ivanov26'],
          [2, 'Кинозал', 'ivanov26'],
          [3, 'Аудитория', 'petrov26'],
          [4, 'Коворкинг', 'ivanov26'],
        ],
        ordered: true,
        points: 5,
      },
      {
        id: 'group',
        name: 'Заявки по пользователям',
        type: 'sql-query',
        check: `SELECT u.login, COUNT(a.id) AS total FROM users u JOIN applications a ON a.user_id = u.id GROUP BY u.login ORDER BY total DESC, u.login`,
        expectedColumns: ['login', 'total'],
        expectedRows: [
          ['ivanov26', 3],
          ['petrov26', 1],
        ],
        ordered: true,
        points: 5,
      },
      {
        id: 'left-join',
        name: 'Помещения без заявок',
        type: 'sql-query',
        check: `SELECT r.title FROM rooms r LEFT JOIN applications a ON a.room_id = r.id WHERE a.id IS NULL ORDER BY r.title`,
        expectedColumns: ['title'],
        expectedRows: [['Переговорная']],
        points: 6,
      },
      {
        id: 'filter',
        name: 'Новые заявки после даты',
        type: 'sql-query',
        check: `SELECT id, start_date FROM applications WHERE status = 'Новая' AND start_date > '2027-03-01' ORDER BY start_date`,
        expectedColumns: ['id', 'start_date'],
        expectedRows: [
          [1, '2027-03-12'],
          [3, '2027-04-19'],
        ],
        ordered: true,
        points: 5,
      },
      {
        id: 'avg',
        name: 'Средняя оценка',
        type: 'sql-query',
        check: `SELECT ROUND(AVG(rating), 1) AS avg_rating FROM reviews`,
        expectedColumns: ['avg_rating'],
        expectedRows: [[4.5]],
        points: 5,
      },
      {
        id: 'has-review',
        name: 'Признак наличия отзыва',
        type: 'sql-query',
        check: `SELECT a.id, CASE WHEN r.id IS NULL THEN 0 ELSE 1 END AS has_review FROM applications a LEFT JOIN reviews r ON r.application_id = a.id ORDER BY a.id`,
        expectedColumns: ['id', 'has_review'],
        expectedRows: [
          [1, 0],
          [2, 1],
          [3, 1],
          [4, 0],
        ],
        ordered: true,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Псевдоним столбца задаётся словом AS: COUNT(a.id) AS total. По нему потом можно и сортировать.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Записи без связанных ищут так: LEFT JOIN, а затем WHERE вторая_таблица.id IS NULL. Обычный JOIN такие строки просто выбросит.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Признак наличия: CASE WHEN r.id IS NULL THEN 0 ELSE 1 END AS has_review — и обязательно LEFT JOIN, иначе строк без отзыва в выборке не будет.',
        penaltyPercent: 35,
      },
    ],
    solution: `SELECT a.id, r.title AS room, u.login AS user
FROM applications a
JOIN rooms r ON r.id = a.room_id
JOIN users u ON u.id = a.user_id
ORDER BY a.id;

SELECT u.login, COUNT(a.id) AS total
FROM users u
JOIN applications a ON a.user_id = u.id
GROUP BY u.login
ORDER BY total DESC, u.login;

SELECT r.title
FROM rooms r
LEFT JOIN applications a ON a.room_id = r.id
WHERE a.id IS NULL
ORDER BY r.title;

SELECT id, start_date
FROM applications
WHERE status = 'Новая' AND start_date > '2027-03-01'
ORDER BY start_date;

SELECT ROUND(AVG(rating), 1) AS avg_rating
FROM reviews;

SELECT a.id, CASE WHEN r.id IS NULL THEN 0 ELSE 1 END AS has_review
FROM applications a
LEFT JOIN reviews r ON r.application_id = a.id
ORDER BY a.id;`,
    solutionExplanation:
      'Третий и шестой запросы держатся на одном приёме: LEFT JOIN оставляет в выборке строки левой таблицы, даже когда справа ничего не нашлось, и вместо недостающих полей подставляет NULL. Отсюда и способ найти «помещения без заявок» — проверить, что справа NULL. Обычный JOIN такие строки выбрасывает, и именно поэтому запрос «покажи тех, у кого ничего нет» — самый частый затык на экзамене. Сортировка во втором запросе двойная: сначала по количеству, потом по логину, иначе при равных значениях порядок будет случайным.',
    maxScore: 32,
    estimatedMinutes: 40,
    examRefs: ['m1-db', 'm1-admin', 'm3-db'],
    planDays: ['day-23-6'],
    source: 'plan',
  },

  {
    id: 'task-project-skeleton-recall',
    title: 'Весь скелет проекта по памяти',
    kind: 'function',
    runtime: 'js',
    difficulty: 4,
    tech: ['js', 'node'],
    topicIds: ['memory-training'],
    monthNo: 6,
    weekNo: 24,
    statement: `Выпишите из головы всё устройство проекта. Записанное запоминается лучше прочитанного, а на экзамене эта запись становится планом первых часов.

1. \`folders\` — массив папок проекта: \`'client/src/pages'\`, \`'client/src/components'\`, \`'client/src/api'\`, \`'client/src/types'\`, \`'server/src/routes'\`, \`'server/src/repositories'\`, \`'server/src/middleware'\`, \`'db'\`.
2. \`tables\` — массив имён таблиц: \`'users'\`, \`'rooms'\`, \`'payment_methods'\`, \`'applications'\`, \`'reviews'\`.
3. \`routes\` — восемь адресов API в виде \`{ method, path }\`: регистрация, вход, справочник помещений, свои заявки (чтение и создание), отзыв по заявке, все заявки администратора, смена статуса.
4. \`plan(minutes)\` — раскладывает отведённое время по этапам в фиксированных долях: база 20%, сервер 30%, клиент 35%, отделка 15%. Возвращает массив \`{ stage, minutes }\` в этом порядке, минуты округляются до целого.
5. \`missingFolders(existing)\` — каких папок из списка ещё нет.`,
    requirements: [
      'Выписаны все восемь папок',
      'Выписаны все пять таблиц',
      'Выписаны восемь адресов API',
      'plan раскладывает время в заданных долях',
      'Сумма минут не превышает отведённое время',
      'missingFolders находит недостающее',
    ],
    starterCode: `const folders = [
  // восемь папок
];

const tables = [
  // пять таблиц
];

const routes = [
  // восемь адресов { method, path }
];

function plan(minutes) {
  // [{ stage: 'База', minutes: … }, …]
}

function missingFolders(existing) {
  // каких папок ещё нет
}`,
    tests: [
      {
        id: 'folders',
        name: 'Папки проекта',
        type: 'assert',
        code: `const folders = ctx.get('folders');
ctx.assert(Array.isArray(folders) && folders.length === 8, 'Папок должно быть восемь, найдено: ' + (folders || []).length);
[
  'client/src/pages', 'client/src/components', 'client/src/api', 'client/src/types',
  'server/src/routes', 'server/src/repositories', 'server/src/middleware', 'db',
].forEach((folder) => {
  ctx.assert(folders.indexOf(folder) !== -1, 'Не хватает папки ' + folder);
});`,
        points: 5,
      },
      {
        id: 'tables',
        name: 'Таблицы базы',
        type: 'assert',
        code: `const tables = ctx.get('tables');
ctx.assert(Array.isArray(tables) && tables.length === 5, 'Таблиц должно быть пять, найдено: ' + (tables || []).length);
['users', 'rooms', 'payment_methods', 'applications', 'reviews'].forEach((table) => {
  ctx.assert(tables.indexOf(table) !== -1, 'Не хватает таблицы ' + table);
});`,
        points: 4,
      },
      {
        id: 'routes',
        name: 'Адреса API',
        type: 'assert',
        code: `const routes = ctx.get('routes');
ctx.assert(Array.isArray(routes) && routes.length === 8, 'Адресов должно быть восемь, найдено: ' + (routes || []).length);
const keys = routes.map((route) => route.method + ' ' + route.path);
['POST /api/register', 'POST /api/login', 'GET /api/rooms', 'GET /api/applications', 'POST /api/applications'].forEach((key) => {
  ctx.assert(keys.indexOf(key) !== -1, 'Не хватает адреса ' + key + '. Сейчас: ' + keys.join(' | '));
});
const admin = keys.filter((key) => key.indexOf('/api/admin') !== -1);
ctx.assert(admin.length === 2, 'Админских адресов должно быть два, найдено: ' + admin.length);
const review = keys.filter((key) => key.indexOf('review') !== -1);
ctx.assert(review.length === 1, 'Должен быть адрес для отзыва');`,
        points: 6,
      },
      {
        id: 'plan',
        name: 'План времени по этапам',
        type: 'assert',
        code: `const plan = ctx.get('plan');
const result = plan(240);
ctx.assert(Array.isArray(result) && result.length === 4, 'Этапов должно быть четыре, найдено: ' + (result || []).length);
ctx.assert(result[0].minutes === 48, 'База — 20% от 240 это 48 минут, получено: ' + ctx.preview(result[0]));
ctx.assert(result[1].minutes === 72, 'Сервер — 30% это 72 минуты, получено: ' + ctx.preview(result[1]));
ctx.assert(result[2].minutes === 84, 'Клиент — 35% это 84 минуты, получено: ' + ctx.preview(result[2]));
ctx.assert(result[3].minutes === 36, 'Отделка — 15% это 36 минут, получено: ' + ctx.preview(result[3]));
result.forEach((item) => {
  ctx.assert(typeof item.stage === 'string' && item.stage.length > 0, 'У этапа должно быть название');
});`,
        points: 6,
      },
      {
        id: 'plan-sum',
        name: 'Сумма не превышает отведённое время',
        type: 'assert',
        code: `const plan = ctx.get('plan');
[240, 150, 75, 100].forEach((minutes) => {
  const total = plan(minutes).reduce((sum, item) => sum + item.minutes, 0);
  ctx.assert(
    total <= minutes,
    'Для ' + minutes + ' минут сумма этапов вышла ' + total + '. Округление не должно давать больше отведённого',
  );
});`,
        points: 5,
      },
      {
        id: 'missing',
        name: 'Недостающие папки',
        type: 'assert',
        code: `const missingFolders = ctx.get('missingFolders');
const missing = missingFolders(['client/src/pages', 'db']);
ctx.assert(missing.length === 6, 'Не хватать должно шести папок, получено: ' + missing.length);
ctx.assert(missing.indexOf('server/src/routes') !== -1, 'В списке нет server/src/routes');
ctx.assert(missing.indexOf('db') === -1, 'Папка db существует, в пропущенные попасть не должна');
ctx.assert(missingFolders(ctx.get('folders')).length === 0, 'Когда есть всё, список должен быть пуст');`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Идите по слоям: что видит пользователь (pages, components), чем ходит на сервер (api, types), что на сервере (routes, repositories, middleware), где база (db).',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Чтобы сумма минут не превысила отведённое, последний этап считайте как остаток, а не по проценту.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const parts = [["База", 0.2], ["Сервер", 0.3], ["Клиент", 0.35]]; последний этап — minutes минус сумма предыдущих.',
        penaltyPercent: 35,
      },
    ],
    solution: `const folders = [
  'client/src/pages',
  'client/src/components',
  'client/src/api',
  'client/src/types',
  'server/src/routes',
  'server/src/repositories',
  'server/src/middleware',
  'db',
];

const tables = ['users', 'rooms', 'payment_methods', 'applications', 'reviews'];

const routes = [
  { method: 'POST', path: '/api/register' },
  { method: 'POST', path: '/api/login' },
  { method: 'GET', path: '/api/rooms' },
  { method: 'GET', path: '/api/applications' },
  { method: 'POST', path: '/api/applications' },
  { method: 'POST', path: '/api/applications/:id/review' },
  { method: 'GET', path: '/api/admin/applications' },
  { method: 'PATCH', path: '/api/admin/applications/:id' },
];

const STAGES = [
  { stage: 'База', share: 0.2 },
  { stage: 'Сервер', share: 0.3 },
  { stage: 'Клиент', share: 0.35 },
  { stage: 'Отделка', share: 0.15 },
];

function plan(minutes) {
  const result = [];
  let used = 0;

  STAGES.forEach((item, index) => {
    const value = index === STAGES.length - 1 ? minutes - used : Math.round(minutes * item.share);
    used += value;
    result.push({ stage: item.stage, minutes: value });
  });

  return result;
}

function missingFolders(existing) {
  return folders.filter((folder) => existing.indexOf(folder) === -1);
}`,
    solutionExplanation:
      'Последний этап считается остатком, а не своей долей — иначе округление четырёх чисел даст сумму на минуту-две больше отведённого, и план развалится уже на бумаге. План по долям полезен не точностью, а тем, что задаёт порядок: база, сервер, клиент, отделка. Отделка стоит последней и занимает всего 15% — на неё всегда хочется потратить больше, и именно этого делать нельзя, пока не работает всё остальное.',
    maxScore: 30,
    estimatedMinutes: 30,
    examRefs: ['m1-db', 'm3-quality'],
    planDays: ['day-24-1'],
    source: 'plan',
  },

  {
    id: 'task-speed-db-library',
    title: 'Скорость: база и каркас за 25 минут',
    kind: 'db',
    runtime: 'sql',
    difficulty: 4,
    tech: ['sql'],
    topicIds: ['memory-training'],
    monthNo: 6,
    weekNo: 24,
    statement: `Четвёртая тема — **библиотека**. **25 минут** на базу с данными. Тренируем по частям: за то же время получается больше повторений, чем при прогоне всего проекта.

1. \`readers\` — \`id\`, \`card_number\` (текст, обязательный, уникальный), \`full_name\` (обязательный).
2. \`books\` — \`id\`, \`title\` (обязательный), \`author\` (обязательный), \`year\` (целое, обязательное), \`copies\` (целое, обязательное).
3. \`loans\` — выдачи: \`id\`, \`reader_id\`, \`book_id\` (обязательные внешние ключи), \`issued_on\` (обязательная), \`due_on\` (обязательная), \`status\` (по умолчанию \`'Выдана'\`, ограничен списком \`'Выдана'\`, \`'Возвращена'\`, \`'Просрочена'\`).
4. Заполните: три книги, два читателя, три выдачи.
5. Напишите запрос: книги с количеством выдач, включая те, что ни разу не выдавали — столбцы \`title\`, \`loans_count\`, по убыванию количества, затем по названию.

Пятый пункт — снова LEFT JOIN. Он должен писаться не задумываясь.`,
    requirements: [
      'Три таблицы со связями',
      'Номер читательского билета уникален',
      'Статус выдачи ограничен списком',
      'Данные заполнены',
      'Запрос считает выдачи, включая книги без выдач',
    ],
    starterCode: `-- Библиотека: 25 минут

`,
    tests: [
      {
        id: 'books',
        name: 'Таблица книг',
        type: 'sql-schema',
        table: 'books',
        columns: [
          { name: 'id', pk: true },
          { name: 'title', notNull: true },
          { name: 'author', notNull: true },
          { name: 'year', notNull: true },
          { name: 'copies', notNull: true },
        ],
        points: 4,
      },
      {
        id: 'loans',
        name: 'Выдачи связаны с читателем и книгой',
        type: 'sql-schema',
        table: 'loans',
        columns: [
          { name: 'id', pk: true },
          { name: 'reader_id', notNull: true },
          { name: 'book_id', notNull: true },
          { name: 'issued_on', notNull: true },
          { name: 'due_on', notNull: true },
          { name: 'status', notNull: true },
        ],
        foreignKeys: [
          { column: 'reader_id', refTable: 'readers' },
          { column: 'book_id', refTable: 'books' },
        ],
        points: 5,
      },
      {
        id: 'card-unique',
        name: 'Номер билета уникален',
        type: 'sql-query',
        check: `SELECT COUNT(*) FROM pragma_index_list('readers') WHERE "unique" = 1`,
        expectedRows: [[1]],
        points: 4,
      },
      {
        id: 'status-check',
        name: 'Статус ограничен списком',
        type: 'sql-query',
        check: `SELECT CASE WHEN instr(upper(sql), 'CHECK') > 0 AND instr(sql, 'Возвращена') > 0 AND instr(sql, 'Просрочена') > 0 THEN 1 ELSE 0 END FROM sqlite_master WHERE type = 'table' AND name = 'loans'`,
        expectedRows: [[1]],
        points: 5,
      },
      {
        id: 'data',
        name: 'Данные заполнены',
        type: 'sql-query',
        check: `SELECT (SELECT COUNT(*) FROM books), (SELECT COUNT(*) FROM readers), (SELECT COUNT(*) FROM loans l JOIN books b ON b.id = l.book_id JOIN readers r ON r.id = l.reader_id)`,
        expectedRows: [[3, 2, 3]],
        points: 5,
      },
      {
        id: 'left-join',
        name: 'Книги с количеством выдач',
        type: 'sql-query',
        check: `SELECT (SELECT COUNT(*) FROM books b LEFT JOIN loans l ON l.book_id = b.id GROUP BY b.id HAVING COUNT(l.id) = 0), 0`,
        expectedRows: [[1, 0]],
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Скелет тот же: люди, справочник ресурса, записи. Отличие в том, что у выдачи две даты — когда выдали и когда вернуть.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Чтобы книга без выдач попала в отчёт, три выдачи должны приходиться на две книги — тогда третья останется без выдач.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'SELECT b.title, COUNT(l.id) AS loans_count FROM books b LEFT JOIN loans l ON l.book_id = b.id GROUP BY b.id, b.title ORDER BY loans_count DESC, b.title;',
        penaltyPercent: 35,
      },
    ],
    solution: `CREATE TABLE readers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  card_number VARCHAR(20) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL
);

CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(150) NOT NULL,
  year INT NOT NULL,
  copies INT NOT NULL
);

CREATE TABLE loans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reader_id INT NOT NULL,
  book_id INT NOT NULL,
  issued_on DATE NOT NULL,
  due_on DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Выдана'
    CHECK (status IN ('Выдана', 'Возвращена', 'Просрочена')),
  FOREIGN KEY (reader_id) REFERENCES readers(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);

INSERT INTO books (id, title, author, year, copies) VALUES
  (1, 'Мастер и Маргарита', 'Булгаков М. А.', 1967, 4),
  (2, 'Преступление и наказание', 'Достоевский Ф. М.', 1866, 3),
  (3, 'Война и мир', 'Толстой Л. Н.', 1869, 2);

INSERT INTO readers (id, card_number, full_name) VALUES
  (1, 'ЧБ-000001', 'Иванов Иван Иванович'),
  (2, 'ЧБ-000002', 'Петрова Полина Петровна');

INSERT INTO loans (reader_id, book_id, issued_on, due_on) VALUES
  (1, 1, '2027-03-01', '2027-03-15'),
  (2, 1, '2027-03-05', '2027-03-19'),
  (1, 2, '2027-03-10', '2027-03-24');

SELECT b.title, COUNT(l.id) AS loans_count
FROM books b
LEFT JOIN loans l ON l.book_id = b.id
GROUP BY b.id, b.title
ORDER BY loans_count DESC, b.title;`,
    solutionExplanation:
      'Три выдачи намеренно распределены на две книги: третья остаётся без выдач, и по отчёту сразу видно, работает ли LEFT JOIN. С обычным JOIN эта книга из отчёта исчезла бы, а такой отчёт бесполезен — библиотекаря интересуют как раз те книги, которые никто не берёт. Номер читательского билета текстовый и уникальный по тем же причинам, что и телефон: в нём есть буквы и ведущие нули, и он однозначно определяет человека.',
    maxScore: 29,
    estimatedMinutes: 25,
    timeLimitMs: 1_500_000,
    examRefs: ['m1-db', 'm1-er', 'm3-db'],
    planDays: ['day-24-2'],
    source: 'plan',
  },

  {
    id: 'task-speed-auth-chain',
    title: 'Скорость: регистрация и вход за 30 минут',
    kind: 'api',
    runtime: 'js',
    difficulty: 5,
    tech: ['express', 'security', 'node'],
    topicIds: ['memory-training'],
    monthNo: 6,
    weekNo: 24,
    statement: `Самая длинная цепочка первого модуля: форма → проверка → сервер → отпечаток пароля → база → токен → меню. Её стоит уметь писать не задумываясь. **30 минут**.

Тема — библиотека, вход по номеру читательского билета.

\`deps\` содержит \`db\` (\`query\`), \`hasher\` (\`hash\`, \`compare\`) и \`tokens\` (\`sign\`).

1. \`validate(data)\` — возвращает массив имён непрошедших полей. \`cardNumber\` — формат \`ЧБ-\` и шесть цифр; \`password\` — минимум 8 символов; \`fullName\` — минимум два слова.
2. \`register(deps)\` — обработчик: при ошибках проверки \`400\` и \`{ error: 'Проверьте данные', fields }\`; занятый номер \`409\` и \`{ error: 'Читатель с таким билетом уже есть' }\`; иначе сохраняет отпечаток пароля и отвечает \`201\` и \`{ id }\`.
3. \`login(deps)\` — обработчик: неверный билет или пароль дают **одинаковый** ответ \`401\` и \`{ error: 'Неверный билет или пароль' }\`; при успехе \`{ token }\` с \`{ id, role }\`.`,
    requirements: [
      'Формат билета проверяется',
      'Ошибки проверки возвращаются списком полей',
      'Занятый билет даёт 409',
      'В базу уходит отпечаток, а не пароль',
      'Неверный билет и неверный пароль отвечают одинаково',
      'Успешный вход выдаёт токен с id и ролью',
    ],
    starterCode: `function validate(data) {
  // имена непрошедших полей
}

function register(deps) {
  return async function (req, res) {
    // ваш код
  };
}

function login(deps) {
  return async function (req, res) {
    // ваш код
  };
}`,
    tests: [
      {
        id: 'validate',
        name: 'Проверка полей',
        type: 'assert',
        code: `const validate = ctx.get('validate');
const good = { cardNumber: 'ЧБ-000001', password: 'demo2026pass', fullName: 'Иванов Иван' };
ctx.assert(validate(good).length === 0, 'Правильные данные должны проходить, получено: ' + ctx.preview(validate(good)));
ctx.assert(validate({ ...good, cardNumber: '000001' }).indexOf('cardNumber') !== -1, 'Билет без приставки ЧБ- не должен проходить');
ctx.assert(validate({ ...good, cardNumber: 'ЧБ-01' }).indexOf('cardNumber') !== -1, 'В билете должно быть шесть цифр');
ctx.assert(validate({ ...good, password: 'demo' }).indexOf('password') !== -1, 'Короткий пароль не должен проходить');
ctx.assert(validate({ ...good, fullName: 'Иванов' }).indexOf('fullName') !== -1, 'ФИО из одного слова не должно проходить');`,
        points: 6,
      },
      {
        id: 'register-400',
        name: 'Ошибки проверки возвращаются списком',
        type: 'assert',
        code: `const register = ctx.get('register');
let called = false;
const deps = {
  db: { query: () => { called = true; return Promise.resolve([]); } },
  hasher: { hash: () => Promise.resolve('h') },
  tokens: { sign: () => 't' },
};
let code = 200;
let body = null;
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return register(deps)({ body: { cardNumber: '1', password: 'x', fullName: 'И' } }, res).then(function () {
  ctx.assert(code === 400, 'Ожидался код 400, сейчас: ' + code);
  ctx.assert(body && Array.isArray(body.fields) && body.fields.length === 3, 'В ответе должен быть список полей: ' + ctx.preview(body));
  ctx.assert(called === false, 'При неверных данных к базе обращаться не нужно');
});`,
        points: 6,
      },
      {
        id: 'register-409',
        name: 'Занятый билет',
        type: 'assert',
        code: `const register = ctx.get('register');
const deps = {
  db: { query: () => Promise.resolve([{ id: 1 }]) },
  hasher: { hash: () => Promise.resolve('h') },
  tokens: { sign: () => 't' },
};
let code = 200;
const res = { status: (c) => { code = c; return res; }, json: () => res };
return register(deps)(
  { body: { cardNumber: 'ЧБ-000001', password: 'demo2026pass', fullName: 'Иванов Иван' } },
  res,
).then(function () {
  ctx.assert(code === 409, 'Ожидался код 409, сейчас: ' + code, 409, code);
});`,
        points: 5,
      },
      {
        id: 'register-hash',
        name: 'В базу уходит отпечаток',
        type: 'assert',
        code: `const register = ctx.get('register');
const calls = [];
const deps = {
  db: {
    query: (sql, params) => {
      calls.push({ sql, params });
      if (String(sql).toUpperCase().indexOf('INSERT') !== -1) return Promise.resolve({ insertId: 4 });
      return Promise.resolve([]);
    },
  },
  hasher: { hash: (password) => Promise.resolve('hash:' + password) },
  tokens: { sign: () => 't' },
};
let code = 200;
let body = null;
const res = { status: (c) => { code = c; return res; }, json: (b) => { body = b; return res; } };
return register(deps)(
  { body: { cardNumber: 'ЧБ-000001', password: 'demo2026pass', fullName: 'Иванов Иван' } },
  res,
).then(function () {
  ctx.assert(code === 201, 'Ожидался код 201, сейчас: ' + code);
  ctx.assert(body && body.id === 4, 'В ответе должен быть номер читателя: ' + ctx.preview(body));
  const insert = calls.filter((call) => String(call.sql).toUpperCase().indexOf('INSERT') !== -1)[0];
  const values = (insert.params || []).map(String);
  ctx.assert(values.indexOf('demo2026pass') === -1, 'Пароль в открытом виде уходит в базу');
  ctx.assert(values.indexOf('hash:demo2026pass') !== -1, 'В базу должен уйти результат hasher.hash');
});`,
        points: 7,
      },
      {
        id: 'login-same',
        name: 'Ответы при неверном билете и пароле совпадают',
        type: 'assert',
        code: `const login = ctx.get('login');
const make = () => { const s = { code: 200, body: null }; s.res = { status: (c) => { s.code = c; return s.res; }, json: (b) => { s.body = b; return s.res; } }; return s; };
const noUser = { db: { query: () => Promise.resolve([]) }, hasher: { compare: () => Promise.resolve(true) }, tokens: { sign: () => 't' } };
const badPass = {
  db: { query: () => Promise.resolve([{ id: 1, password_hash: 'h', role: 'user' }]) },
  hasher: { compare: () => Promise.resolve(false) },
  tokens: { sign: () => 't' },
};
const a = make();
const b = make();
return Promise.all([
  login(noUser)({ body: { cardNumber: 'ЧБ-999999', password: 'demo2026pass' } }, a.res),
  login(badPass)({ body: { cardNumber: 'ЧБ-000001', password: 'wrongpass' } }, b.res),
]).then(function () {
  ctx.assert(a.code === 401 && b.code === 401, 'Оба случая — 401, сейчас: ' + a.code + ' и ' + b.code);
  ctx.assert(a.body.error === b.body.error, 'Ответы должны совпадать дословно: «' + a.body.error + '» против «' + b.body.error + '»');
});`,
        points: 6,
      },
      {
        id: 'login-token',
        name: 'Успешный вход выдаёт токен',
        type: 'assert',
        code: `const login = ctx.get('login');
let payload = null;
const deps = {
  db: { query: () => Promise.resolve([{ id: 7, password_hash: 'h', role: 'admin' }]) },
  hasher: { compare: () => Promise.resolve(true) },
  tokens: { sign: (data) => { payload = data; return 'signed'; } },
};
let body = null;
const res = { status: () => res, json: (b) => { body = b; return res; } };
return login(deps)({ body: { cardNumber: 'ЧБ-000001', password: 'demo2026pass' } }, res).then(function () {
  ctx.assert(body && body.token === 'signed', 'В ответе должен быть токен: ' + ctx.preview(body));
  ctx.assert(payload && payload.id === 7 && payload.role === 'admin', 'В токене должны быть id и роль: ' + ctx.preview(payload));
  ctx.assert(!payload.password_hash, 'Отпечаток пароля в токен класть нельзя');
});`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Формат билета проверяется одним выражением: /^ЧБ-\\d{6}$/.test(cardNumber).',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Одинаковый текст ошибки при входе вынесите в константу — тогда две ветки гарантированно не разойдутся.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Структура ровно та же, что вы писали для «Конференций»: проверка → занятость → отпечаток → вставка. Меняются только имена полей.',
        penaltyPercent: 35,
      },
    ],
    solution: `const BAD_CREDENTIALS = 'Неверный билет или пароль';

function validate(data) {
  const fields = [];

  if (!/^ЧБ-\\d{6}$/.test(String(data.cardNumber || ''))) fields.push('cardNumber');
  if (String(data.password || '').length < 8) fields.push('password');
  if (String(data.fullName || '').trim().split(/\\s+/).filter(Boolean).length < 2) fields.push('fullName');

  return fields;
}

function register(deps) {
  return async function (req, res) {
    const body = req.body || {};
    const fields = validate(body);

    if (fields.length > 0) {
      return res.status(400).json({ error: 'Проверьте данные', fields });
    }

    try {
      const existing = await deps.db.query('SELECT id FROM readers WHERE card_number = ?', [body.cardNumber]);

      if (existing.length > 0) {
        return res.status(409).json({ error: 'Читатель с таким билетом уже есть' });
      }

      const passwordHash = await deps.hasher.hash(body.password);
      const result = await deps.db.query(
        'INSERT INTO readers (card_number, password_hash, full_name) VALUES (?, ?, ?)',
        [body.cardNumber, passwordHash, body.fullName],
      );

      return res.status(201).json({ id: result.insertId });
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  };
}

function login(deps) {
  return async function (req, res) {
    const body = req.body || {};

    try {
      const rows = await deps.db.query('SELECT * FROM readers WHERE card_number = ?', [body.cardNumber]);
      const reader = rows[0];

      if (!reader) {
        return res.status(401).json({ error: BAD_CREDENTIALS });
      }

      const ok = await deps.hasher.compare(String(body.password || ''), reader.password_hash);

      if (!ok) {
        return res.status(401).json({ error: BAD_CREDENTIALS });
      }

      return res.json({ token: deps.tokens.sign({ id: reader.id, role: reader.role }) });
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
  };
}`,
    solutionExplanation:
      'Цепочка та же самая, что и в прошлых проектах, — поменялись имя поля и формат проверки. Именно поэтому её и тренируют отдельно: структура переносится целиком, и на новой теме уходит не полчаса, а десять минут. Список непрошедших полей возвращается клиенту не из вежливости: интерфейс разложит сообщения по полям, и пользователю не придётся гадать, что именно не так. Одинаковый ответ при неверном билете и неверном пароле — та же защита от подбора, что и с логинами.',
    maxScore: 36,
    estimatedMinutes: 30,
    timeLimitMs: 1_800_000,
    examRefs: ['m1-register', 'm1-login', 'm3-quality'],
    planDays: ['day-24-3'],
    source: 'plan',
  },

  {
    id: 'task-speed-user-part-library',
    title: 'Скорость: выдача, кабинет и продление за 30 минут',
    kind: 'app',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['memory-training'],
    monthNo: 6,
    weekNo: 24,
    statement: `Вся пользовательская часть за **30 минут**. Следите за двумя местами, где обычно теряют время: перевод формата даты и правило доступности действия.

Компонент \`ReaderCabinet\` принимает \`{ loans, today, onExtend }\`, где \`loans\` — массив \`{ id, title, issuedOn, dueOn, status }\` (даты в формате \`ГГГГ-ММ-ДД\`), \`today\` — текущая дата в том же формате.

1. Выдачи выводятся карточками \`.loan\`: название, обе даты в формате **ДД.ММ.ГГГГ**, статус.
2. Просроченной считается выдача со статусом \`'Выдана'\`, у которой \`dueOn\` раньше \`today\`. У такой карточки класс \`overdue\` и текст «Просрочено».
3. **Правило библиотеки**: продлить можно только выдачу со статусом \`'Выдана'\` и **не просроченную**. У таких карточек кнопка \`.extend\`, у остальных — объяснение, почему нельзя.
4. Нажатие \`.extend\` вызывает \`onExtend(id)\`, после чего в карточке появляется «Продлено», а кнопка исчезает.
5. Счётчик \`#overdue-count\` — сколько выдач просрочено.`,
    requirements: [
      'Обе даты выводятся в формате ДД.ММ.ГГГГ',
      'Просроченная выдача помечена классом и текстом',
      'Кнопка продления есть только у действующей непросроченной выдачи',
      'У остальных выводится объяснение',
      'Продление заменяет кнопку отметкой',
      'Счётчик просроченных считается верно',
    ],
    starterCode: `function ReaderCabinet({ loans, today, onExtend }) {
  // карточки выдач, правило продления, счётчик просроченных
}`,
    tests: [
      {
        id: 'dates',
        name: 'Даты в человеческом формате',
        type: 'react',
        code: `const loans = [{ id: 1, title: 'Война и мир', issuedOn: '2027-03-01', dueOn: '2027-03-15', status: 'Выдана' }];
return ctx.render('ReaderCabinet', { loans, today: '2027-03-10', onExtend: () => {} }).then(() => {
  const text = ctx.text();
  ctx.assert(text.indexOf('01.03.2027') !== -1, 'Дата выдачи должна быть в формате ДД.ММ.ГГГГ, сейчас: ' + text.slice(0, 120));
  ctx.assert(text.indexOf('15.03.2027') !== -1, 'Дата возврата должна быть в формате ДД.ММ.ГГГГ');
  ctx.assert(!/\\d{4}-\\d{2}-\\d{2}/.test(text), 'Машинный формат даты показывать не нужно');
});`,
        points: 5,
      },
      {
        id: 'overdue',
        name: 'Просроченная выдача помечена',
        type: 'react',
        code: `const loans = [
  { id: 1, title: 'Война и мир', issuedOn: '2027-02-01', dueOn: '2027-02-15', status: 'Выдана' },
  { id: 2, title: 'Идиот', issuedOn: '2027-03-01', dueOn: '2027-03-20', status: 'Выдана' },
];
return ctx.render('ReaderCabinet', { loans, today: '2027-03-10', onExtend: () => {} }).then(() => {
  const cards = ctx.$$('.loan');
  ctx.assert(cards.length === 2, 'Карточек должно быть две, найдено: ' + cards.length);
  const overdue = cards.filter((card) => card.className.indexOf('overdue') !== -1);
  ctx.assert(overdue.length === 1, 'Просроченной должна быть ровно одна выдача, найдено: ' + overdue.length);
  ctx.assert(overdue[0].textContent.indexOf('Просрочено') !== -1, 'У просроченной карточки нужен текст «Просрочено»');
  ctx.assert(ctx.text('#overdue-count').indexOf('1') !== -1, 'Счётчик должен показывать 1, сейчас: ' + ctx.text('#overdue-count'));
});`,
        points: 7,
      },
      {
        id: 'extend-allowed',
        name: 'Продлить можно действующую выдачу',
        type: 'react',
        code: `const loans = [{ id: 5, title: 'Идиот', issuedOn: '2027-03-01', dueOn: '2027-03-20', status: 'Выдана' }];
return ctx.render('ReaderCabinet', { loans, today: '2027-03-10', onExtend: () => {} }).then(() => {
  ctx.assert(ctx.$('.extend'), 'У действующей непросроченной выдачи должна быть кнопка продления');
});`,
        points: 5,
      },
      {
        id: 'extend-forbidden',
        name: 'Просроченную и возвращённую продлить нельзя',
        type: 'react',
        code: `const loans = [
  { id: 6, title: 'Война и мир', issuedOn: '2027-02-01', dueOn: '2027-02-15', status: 'Выдана' },
  { id: 7, title: 'Мастер и Маргарита', issuedOn: '2027-01-01', dueOn: '2027-01-20', status: 'Возвращена' },
];
return ctx.render('ReaderCabinet', { loans, today: '2027-03-10', onExtend: () => {} }).then(() => {
  ctx.assert(ctx.$$('.extend').length === 0, 'Ни одну из этих выдач продлить нельзя');
  const text = ctx.text();
  ctx.assert(text.length > 40, 'Вместо кнопки должно быть объяснение, почему продление недоступно');
});`,
        points: 6,
      },
      {
        id: 'extend',
        name: 'Продление заменяет кнопку отметкой',
        type: 'react',
        code: `const loans = [{ id: 9, title: 'Идиот', issuedOn: '2027-03-01', dueOn: '2027-03-20', status: 'Выдана' }];
const calls = [];
return ctx.render('ReaderCabinet', { loans, today: '2027-03-10', onExtend: (id) => calls.push(id) })
  .then(() => ctx.click('.extend'))
  .then(() => {
    ctx.assert(calls.length === 1 && calls[0] === 9, 'onExtend должен получить номер выдачи, получено: ' + ctx.preview(calls));
    ctx.assert(ctx.text().indexOf('Продлено') !== -1, 'После продления нужна отметка «Продлено»');
    ctx.assert(!ctx.$('.extend'), 'Кнопка продления должна исчезнуть');
  });`,
        points: 6,
      },
      {
        id: 'independent',
        name: 'Продления не путаются между карточками',
        type: 'react',
        code: `const loans = [
  { id: 11, title: 'Идиот', issuedOn: '2027-03-01', dueOn: '2027-03-20', status: 'Выдана' },
  { id: 12, title: 'Бесы', issuedOn: '2027-03-02', dueOn: '2027-03-22', status: 'Выдана' },
];
return ctx.render('ReaderCabinet', { loans, today: '2027-03-10', onExtend: () => {} })
  .then(() => ctx.click(ctx.$$('.extend')[0]))
  .then(() => {
    ctx.assert(ctx.$$('.extend').length === 1, 'Продление одной выдачи не должно убирать кнопку у второй');
    const cards = ctx.$$('.loan');
    ctx.assert(cards[0].textContent.indexOf('Продлено') !== -1, 'Отметка должна быть в первой карточке');
    ctx.assert(cards[1].textContent.indexOf('Продлено') === -1, 'Во второй карточке отметки быть не должно');
  });`,
        points: 6,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Просрочка — это два условия сразу: статус «Выдана» и дата возврата раньше сегодняшней.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Даты в формате ГГГГ-ММ-ДД сравниваются как обычные строки — переводить их в даты не нужно.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const isOverdue = (loan) => loan.status === "Выдана" && loan.dueOn < today; const canExtend = (loan) => loan.status === "Выдана" && !isOverdue(loan) && !extended[loan.id];',
        penaltyPercent: 35,
      },
    ],
    solution: `function ReaderCabinet({ loans, today, onExtend }) {
  const [extended, setExtended] = React.useState({});

  const toRuDate = (iso) => iso.split('-').reverse().join('.');
  const isOverdue = (loan) => loan.status === 'Выдана' && loan.dueOn < today;

  const extend = (loan) => {
    onExtend(loan.id);
    setExtended((prev) => ({ ...prev, [loan.id]: true }));
  };

  const overdueCount = loans.filter(isOverdue).length;

  return (
    <div>
      <p id="overdue-count">Просрочено выдач: {overdueCount}</p>

      {loans.map((loan) => (
        <article className={isOverdue(loan) ? 'loan overdue' : 'loan'} key={loan.id}>
          <h3>{loan.title}</h3>
          <p>Выдана: {toRuDate(loan.issuedOn)}</p>
          <p>Вернуть до: {toRuDate(loan.dueOn)}</p>
          <p>{loan.status}</p>

          {isOverdue(loan) ? <p>Просрочено</p> : null}

          {extended[loan.id] ? (
            <p>Продлено</p>
          ) : loan.status !== 'Выдана' ? (
            <p>Продлить можно только действующую выдачу</p>
          ) : isOverdue(loan) ? (
            <p>Просроченную выдачу продлить нельзя — обратитесь к библиотекарю</p>
          ) : (
            <button className="extend" type="button" onClick={() => extend(loan)}>
              Продлить
            </button>
          )}
        </article>
      ))}
    </div>
  );
}`,
    solutionExplanation:
      'Условие просрочки вынесено в функцию isOverdue и используется трижды: для класса карточки, для текста и для счётчика. Если написать его три раза, однажды одно из мест поправят, а два других нет — и карточка будет помечена как просроченная, а счётчик её не заметит. Причины, по которым продление недоступно, разведены на две ветки с разными текстами: «возвращённую продлевать нечего» и «просроченную нельзя» — это разные ситуации, и объединять их в одно сообщение значит запутывать читателя.',
    maxScore: 35,
    estimatedMinutes: 30,
    timeLimitMs: 1_800_000,
    examRefs: ['m1-cabinet', 'm2-cabinet-ux', 'm2-order-form'],
    planDays: ['day-24-4'],
    source: 'plan',
  },

  {
    id: 'task-speed-admin-order',
    title: 'Скорость: админка за 30 минут в фиксированном порядке',
    kind: 'app',
    runtime: 'react',
    difficulty: 4,
    tech: ['react'],
    topicIds: ['memory-training'],
    monthNo: 6,
    weekNo: 24,
    statement: `Порядок операций в админке фиксированный: **сначала фильтр, потом сортировка, потом страница**. Если помнить его, админка пишется без раздумий. Если перепутать — на экране окажется случайное количество строк.

Компонент \`LibraryAdmin\` принимает \`{ loans }\` — массив \`{ id, reader, book, dueOn, status }\`, где \`dueOn\` в формате ДД.ММ.ГГГГ.

1. Фильтр \`#filter\` по статусу: пусто — все.
2. Сортировка по дате возврата: кнопка \`#sort-due\`, первый клик — по возрастанию, второй — по убыванию.
3. По **2** записи на странице, кнопки \`#prev\` и \`#next\`, номер в \`#page\` вида \`1 из 3\`.
4. Смена фильтра сбрасывает страницу на первую.
5. Счётчик \`#count\` — сколько записей **после фильтра** (не на странице).`,
    requirements: [
      'Фильтр по статусу работает',
      'Сортировка по дате переключает направление',
      'На странице не больше двух записей',
      'Номер страницы считается по отфильтрованному списку',
      'Смена фильтра возвращает на первую страницу',
      'Счётчик считает записи после фильтра',
    ],
    starterCode: `const STATUSES = ['Выдана', 'Возвращена', 'Просрочена'];
const PAGE_SIZE = 2;

function LibraryAdmin({ loans }) {
  // фильтр -> сортировка -> страница
}`,
    tests: [
      {
        id: 'page-size',
        name: 'На странице две записи',
        type: 'react',
        code: `const loans = [1, 2, 3, 4, 5].map((n) => ({
  id: n, reader: 'Читатель ' + n, book: 'Книга ' + n,
  dueOn: '0' + n + '.03.2027', status: 'Выдана',
}));
return ctx.render('LibraryAdmin', { loans })
  .then(() => ctx.change('#filter', ''))
  .then(() => {
    ctx.assert(ctx.$$('tbody tr').length === 2, 'На странице должно быть две записи, найдено: ' + ctx.$$('tbody tr').length);
    ctx.assert(ctx.text('#page').indexOf('1 из 3') !== -1, 'Ожидалось «1 из 3», сейчас: ' + ctx.text('#page'));
    ctx.assert(ctx.text('#count').indexOf('5') !== -1, 'Счётчик считает записи после фильтра, а не на странице: ' + ctx.text('#count'));
  });`,
        points: 6,
      },
      {
        id: 'paging',
        name: 'Перелистывание',
        type: 'react',
        code: `const loans = [1, 2, 3, 4, 5].map((n) => ({
  id: n, reader: 'Читатель ' + n, book: 'Книга ' + n,
  dueOn: '0' + n + '.03.2027', status: 'Выдана',
}));
return ctx.render('LibraryAdmin', { loans })
  .then(() => ctx.change('#filter', ''))
  .then(() => ctx.click('#next'))
  .then(() => ctx.click('#next'))
  .then(() => {
    ctx.assert(ctx.$$('tbody tr').length === 1, 'На третьей странице одна запись, найдено: ' + ctx.$$('tbody tr').length);
    ctx.assert(ctx.text('#page').indexOf('3 из 3') !== -1, 'Ожидалось «3 из 3», сейчас: ' + ctx.text('#page'));
    return ctx.click('#next');
  })
  .then(() => {
    ctx.assert(ctx.text('#page').indexOf('3 из 3') !== -1, 'За последнюю страницу перелистывать нельзя, сейчас: ' + ctx.text('#page'));
  });`,
        points: 6,
      },
      {
        id: 'filter-reset',
        name: 'Смена фильтра сбрасывает страницу',
        type: 'react',
        code: `const loans = [1, 2, 3, 4, 5].map((n) => ({
  id: n, reader: 'Читатель ' + n, book: 'Книга ' + n,
  dueOn: '0' + n + '.03.2027', status: n === 5 ? 'Возвращена' : 'Выдана',
}));
return ctx.render('LibraryAdmin', { loans })
  .then(() => ctx.change('#filter', ''))
  .then(() => ctx.click('#next'))
  .then(() => ctx.change('#filter', 'Возвращена'))
  .then(() => {
    ctx.assert(ctx.text('#page').indexOf('1 из 1') !== -1, 'После смены фильтра ожидалось «1 из 1», сейчас: ' + ctx.text('#page'));
    ctx.assert(ctx.$$('tbody tr').length === 1, 'Должна остаться одна запись, найдено: ' + ctx.$$('tbody tr').length);
    ctx.assert(ctx.text('#count').indexOf('1') !== -1, 'Счётчик: ' + ctx.text('#count'));
  });`,
        points: 7,
      },
      {
        id: 'sort',
        name: 'Сортировка по дате возврата',
        type: 'react',
        code: `const loans = [
  { id: 1, reader: 'А', book: 'Книга 1', dueOn: '19.04.2027', status: 'Выдана' },
  { id: 2, reader: 'Б', book: 'Книга 2', dueOn: '05.02.2027', status: 'Выдана' },
];
return ctx.render('LibraryAdmin', { loans })
  .then(() => ctx.change('#filter', 'Выдана'))
  .then(() => ctx.click('#sort-due'))
  .then(() => {
    const iso = (date) => date.split('.').reverse().join('-');
    const read = () => ctx.$$('tbody tr').map((row) => iso(row.textContent.match(/\\d{2}\\.\\d{2}\\.\\d{4}/)[0]));
    const first = read();
    ctx.assert(first.length >= 2, 'Для проверки нужно минимум две строки на странице');
    const ascending = first.slice().sort();
    ctx.assert(first.join(',') === ascending.join(','), 'Первый клик — по возрастанию, получено: ' + first.join(', '));
    return ctx.click('#sort-due').then(() => {
      ctx.assert(
        read().join(',') === ascending.slice().reverse().join(','),
        'Второй клик — по убыванию, получено: ' + read().join(', '),
      );
    });
  });`,
        points: 7,
      },
      {
        id: 'order-matters',
        name: 'Порядок операций соблюдён',
        type: 'react',
        code: `const loans = [
  { id: 1, reader: 'А', book: 'Книга 1', dueOn: '19.04.2027', status: 'Выдана' },
  { id: 2, reader: 'Б', book: 'Книга 2', dueOn: '05.02.2027', status: 'Возвращена' },
  { id: 3, reader: 'В', book: 'Книга 3', dueOn: '12.03.2027', status: 'Выдана' },
  { id: 4, reader: 'Г', book: 'Книга 4', dueOn: '01.01.2027', status: 'Выдана' },
];
return ctx.render('LibraryAdmin', { loans })
  .then(() => ctx.change('#filter', 'Выдана'))
  .then(() => ctx.click('#sort-due'))
  .then(() => {
    const rows = ctx.$$('tbody tr');
    ctx.assert(rows.length === 2, 'После фильтра и страницы должно остаться две строки, найдено: ' + rows.length);
    rows.forEach((row) => {
      ctx.assert(row.textContent.indexOf('Возвращена') === -1, 'В выборке чужой статус: сначала фильтр, потом всё остальное');
    });
    ctx.assert(ctx.text('#count').indexOf('3') !== -1, 'После фильтра записей три, счётчик: ' + ctx.text('#count'));
  });`,
        points: 7,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Три шага пишутся друг за другом: const filtered = …; const sorted = …; const visible = sorted.slice(start, start + PAGE_SIZE).',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Количество страниц считается по отфильтрованному списку, а не по исходному — иначе последние страницы окажутся пустыми.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)); const current = Math.min(page, totalPages);',
        penaltyPercent: 35,
      },
    ],
    solution: `const STATUSES = ['Выдана', 'Возвращена', 'Просрочена'];
const PAGE_SIZE = 2;

function LibraryAdmin({ loans }) {
  const [filter, setFilter] = React.useState('');
  const [direction, setDirection] = React.useState(null);
  const [page, setPage] = React.useState(1);

  const iso = (date) => date.split('.').reverse().join('-');

  const filtered = loans.filter((loan) => !filter || loan.status === filter);

  const sorted = direction
    ? filtered.slice().sort((a, b) => {
        const result = iso(a.dueOn).localeCompare(iso(b.dueOn));
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

      <p id="count">Найдено выдач: {sorted.length}</p>

      <table id="loans">
        <thead>
          <tr>
            <th>№</th>
            <th>Читатель</th>
            <th>Книга</th>
            <th>
              <button id="sort-due" type="button" onClick={() => setDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}>
                Вернуть до
              </button>
            </th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((loan) => (
            <tr key={loan.id}>
              <td>{loan.id}</td>
              <td>{loan.reader}</td>
              <td>{loan.book}</td>
              <td>{loan.dueOn}</td>
              <td>{loan.status}</td>
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
    </div>
  );
}`,
    solutionExplanation:
      'Три строки подряд — filtered, sorted, visible — и есть весь ответ. Порядок не переставляется: отрезать страницу можно только после фильтрации и сортировки, иначе на экране окажутся две случайные записи из всего списка. Ограничение Math.min(page, totalPages) страхует от ситуации, когда после фильтра страниц стало меньше текущего номера. Счётчик показывает длину отфильтрованного списка, а не страницы: администратору важно, сколько всего нашлось.',
    maxScore: 33,
    estimatedMinutes: 30,
    timeLimitMs: 1_800_000,
    examRefs: ['m2-admin-tools', 'm1-admin'],
    planDays: ['day-24-5'],
    source: 'plan',
  },

  {
    id: 'task-speed-slider-validation-mobile',
    title: 'Скорость: слайдер, валидация и узкий экран за 40 минут',
    kind: 'app',
    runtime: 'dom',
    difficulty: 4,
    tech: ['js', 'css', 'html'],
    topicIds: ['memory-training'],
    monthNo: 6,
    weekNo: 24,
    statement: `Три требования второго модуля подряд за **40 минут**. Всё это вы писали не раз — сегодня важна скорость.

Страница на экране **390 × 844**.

1. **Слайдер**: четыре картинки \`.slide\`, активна одна, автопереключение каждые **3 секунды**, кнопка \`#next\`. Картинки одинаковой высоты 160px, \`object-fit: cover\`, непустой \`alt\`.
2. **Валидация формы**: поля \`#card\` (билет вида \`ЧБ-\` и шесть цифр) и \`#password\` (минимум 8 символов). Сообщения выводятся в \`#card-error\` и \`#password-error\`. Верные данные — форма получает класс \`sent\`, сообщения пусты.
3. **Узкий экран**: горизонтальной прокрутки нет, кнопки не мельче 44px.
4. Страница при отправке формы не перезагружается.`,
    requirements: [
      'Четыре слайда с автопереключением и кнопкой',
      'Картинки одинаковой высоты с object-fit и alt',
      'Ошибки выводятся рядом с полями',
      'Верные данные дают классу sent',
      'Горизонтальной прокрутки нет, кнопки не мельче 44px',
      'Отправка не перезагружает страницу',
    ],
    starterCode: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 16px; font-family: system-ui, sans-serif; background: #f8fafc; }
    .error { min-height: 18px; margin: 4px 0 12px; color: #dc2626; font-size: 0.85rem; }
    form.sent { outline: 2px solid #16a34a; }
  </style>
</head>
<body>
  <!-- слайдер, форма входа читателя -->
  <script>
    // автопереключение и валидация
  </script>
</body>
</html>`,
    viewport: { width: 390, height: 844 },
    tests: [
      {
        id: 'slides',
        name: 'Слайдер собран',
        type: 'dom',
        code: `const slides = ctx.$$('.slide');
ctx.assert(slides.length === 4, 'Слайдов должно быть четыре, найдено: ' + slides.length, 4, slides.length);
ctx.assert(ctx.$$('.slide.active').length === 1, 'Активным должен быть ровно один слайд');
slides.forEach((slide, index) => {
  ctx.assert(ctx.css(slide, 'object-fit') === 'cover', 'У слайда ' + (index + 1) + ' нужен object-fit: cover');
  const alt = slide.getAttribute('alt');
  ctx.assert(alt && alt.trim().length > 0, 'У слайда ' + (index + 1) + ' нет непустого alt');
});
const visible = slides.filter((slide) => ctx.css(slide, 'display') !== 'none')[0];
ctx.assert(Math.round(visible.getBoundingClientRect().height) === 160, 'Высота слайда должна быть 160px, сейчас: ' + Math.round(visible.getBoundingClientRect().height));`,
        points: 6,
      },
      {
        id: 'autoplay',
        name: 'Автопереключение и кнопка',
        type: 'dom',
        code: `const slides = ctx.$$('.slide');
const activeIndex = () => slides.map((slide) => slide.classList.contains('active')).indexOf(true);
const before = activeIndex();
ctx.click('#next');
ctx.assert(activeIndex() === (before + 1) % 4, 'Кнопка должна листать вперёд');
const afterClick = activeIndex();
return ctx.wait(3400).then(function () {
  ctx.assert(activeIndex() !== afterClick, 'За 3.4 секунды слайд не сменился: нужен setInterval на 3000 мс');
});`,
        points: 6,
      },
      {
        id: 'validation-errors',
        name: 'Ошибки рядом с полями',
        type: 'dom',
        code: `ctx.$('#card').value = '123';
ctx.$('#password').value = 'abc';
ctx.$('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
return ctx.wait(50).then(function () {
  ctx.assert(ctx.text('#card-error').length > 0, 'Нет сообщения об ошибке билета');
  ctx.assert(ctx.text('#password-error').length > 0, 'Нет сообщения об ошибке пароля');
  ctx.assert(!ctx.$('form').classList.contains('sent'), 'Форма с ошибками не должна получать класс sent');
});`,
        points: 6,
      },
      {
        id: 'validation-ok',
        name: 'Верные данные проходят',
        type: 'dom',
        code: `ctx.$('#card').value = 'ЧБ-000001';
ctx.$('#password').value = 'demo2026pass';
ctx.$('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
return ctx.wait(50).then(function () {
  ctx.assert(ctx.text('#card-error') === '', 'Сообщение об ошибке билета должно исчезнуть');
  ctx.assert(ctx.text('#password-error') === '', 'Сообщение об ошибке пароля должно исчезнуть');
  ctx.assert(ctx.$('form').classList.contains('sent'), 'При верных данных форме нужен класс sent');
});`,
        points: 6,
      },
      {
        id: 'mobile',
        name: 'Узкий экран в порядке',
        type: 'dom',
        code: `const root = ctx.document.documentElement;
ctx.assert(
  root.scrollWidth <= root.clientWidth + 1,
  'Страница уезжает вбок: ' + root.scrollWidth + 'px при экране ' + root.clientWidth + 'px',
);
ctx.$$('button').forEach((button) => {
  ctx.assert(
    button.getBoundingClientRect().height >= 44,
    'Высота кнопки «' + button.textContent.trim() + '» — ' + Math.round(button.getBoundingClientRect().height) + 'px, нужно 44',
  );
});`,
        points: 5,
      },
      {
        id: 'no-reload',
        name: 'Страница не перезагружается',
        type: 'dom',
        code: `const source = ctx.source || '';
ctx.assert(/preventDefault/.test(source), 'Обработчику submit нужен event.preventDefault()');
ctx.assert(!/alert\\s*\\(/.test(source), 'Сообщения выводятся рядом с полями, а не через alert');`,
        points: 4,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Слайдер и валидация независимы — пишите их по очереди, не смешивая, и каждый проверяйте отдельно.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Сообщения записывайте в textContent всегда, даже когда ошибки нет: пустая строка стирает предыдущее.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'Билет: /^ЧБ-\\d{6}$/.test(card). Кнопкам: min-height: 44px. Слайдам: width: 100%; height: 160px; object-fit: cover.',
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
    body { margin: 0; padding: 16px; font-family: system-ui, sans-serif; background: #f8fafc; }
    .error { min-height: 18px; margin: 4px 0 12px; color: #dc2626; font-size: 0.85rem; }
    form.sent { outline: 2px solid #16a34a; }

    .slider { max-width: 100%; }

    .slide {
      display: none;
      width: 100%;
      height: 160px;
      object-fit: cover;
      border-radius: 12px;
    }

    .slide.active { display: block; }

    button {
      min-height: 44px;
      padding: 0 16px;
      border: 0;
      border-radius: 8px;
      background: #2563eb;
      color: #fff;
      font-size: 1rem;
    }

    input {
      width: 100%;
      min-height: 44px;
      padding: 0 12px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 1rem;
    }

    label { display: block; margin-bottom: 6px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="slider">
    <img class="slide active" alt="Читальный зал" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='800' height='450' fill='%232563eb'/></svg>">
    <img class="slide" alt="Абонемент" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><rect width='600' height='600' fill='%2316a34a'/></svg>">
    <img class="slide" alt="Книгохранилище" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='400'><rect width='1200' height='400' fill='%23d97706'/></svg>">
    <img class="slide" alt="Детский зал" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='900'><rect width='400' height='900' fill='%23dc2626'/></svg>">
  </div>

  <button id="next" type="button">Вперёд</button>

  <form novalidate>
    <label for="card">Читательский билет</label>
    <input type="text" id="card" name="card">
    <p class="error" id="card-error"></p>

    <label for="password">Пароль</label>
    <input type="password" id="password" name="password">
    <p class="error" id="password-error"></p>

    <button type="submit">Войти</button>
  </form>

  <script>
    var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
    var current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle('active', position === current);
      });
    }

    document.getElementById('next').addEventListener('click', function () {
      show(current + 1);
    });

    setInterval(function () {
      show(current + 1);
    }, 3000);

    var form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var card = document.getElementById('card').value.trim();
      var password = document.getElementById('password').value;

      var cardError = /^ЧБ-\\d{6}$/.test(card) ? '' : 'Билет вида ЧБ- и шесть цифр';
      var passwordError = password.length >= 8 ? '' : 'Минимум 8 символов';

      document.getElementById('card-error').textContent = cardError;
      document.getElementById('password-error').textContent = passwordError;

      form.classList.toggle('sent', cardError === '' && passwordError === '');
    });
  </script>
</body>
</html>`,
    solutionExplanation:
      'Сорок минут на три требования — это примерно по десять минут на каждое плюс запас на проверку. Укладываются в них не за счёт скорости набора, а за счёт того, что все три куска пишутся по готовой схеме: слайдер держится на одной переменной и функции show, валидация — на двух строках с регулярными выражениями, мобильная версия — на min-height у кнопок и max-width у широких блоков. Метод classList.toggle со вторым аргументом заменяет собой if с двумя ветками: класс ставится или снимается по условию.',
    maxScore: 33,
    estimatedMinutes: 40,
    timeLimitMs: 2_400_000,
    examRefs: ['m2-slider', 'm2-login-warnings', 'm2-mobile'],
    planDays: ['day-24-6'],
    source: 'plan',
  },
];
