import type { Topic } from '../types';
import { MONTH_03_APP_TOPICS } from './month-03-app';

/** Месяц 3, недели 9–10: основы React и формы. */
const WEEK_9_10: Topic[] = [
  {
    id: 'react-basics',
    title: 'React: компоненты, проект на Vite',
    tech: ['react', 'ts', 'tools'],
    monthNo: 3,
    weekNo: 9,
    importance: 'core',
    summary:
      'React собирает интерфейс из компонентов — функций, возвращающих разметку. Проект создаётся одной командой Vite, но на экзамене её нужно уметь выполнить без интернета.',
    mustKnow: [
      '`npm create vite@latest client -- --template react-ts`',
      'Структура: index.html, main.tsx, App.tsx',
      'Компонент — функция с заглавной буквы',
      '`npm run dev` и горячая перезагрузка',
      'Что убрать из шаблона в первую очередь',
    ],
    theory: `## Что такое React

React — библиотека для сборки интерфейса из **компонентов**. Компонент — обычная функция, которая возвращает разметку:

\`\`\`tsx
function Header() {
  return (
    <header>
      <h1>Конференции.РФ</h1>
    </header>
  );
}
\`\`\`

Имя компонента пишется с заглавной буквы — по этому признаку React отличает его от обычного HTML-тега.

Приложение — это дерево компонентов. Вместо «найти элемент и поменять текст» вы описываете, **как должен выглядеть интерфейс при текущих данных**, а React сам приводит страницу к этому виду.

## Создание проекта

\`\`\`bash
npm create vite@latest client -- --template react-ts
cd client
npm install
npm run dev
\`\`\`

Vite поднимает сервер разработки с горячей перезагрузкой: сохранили файл — изменения сразу на экране.

**Проверьте это без интернета заранее.** Учебная программа отдельно просит: создать проект, затем выключить интернет и попробовать создать второй. Если не получается — нужен запасной план (подготовленный шаблон с \`node_modules\`).

## Структура

\`\`\`text
client/
├── index.html          единственная HTML-страница
├── src/
│   ├── main.tsx        точка входа: подключает React к #root
│   ├── App.tsx         корневой компонент
│   ├── index.css       свои стили
│   ├── components/     переиспользуемые части
│   ├── pages/          страницы
│   ├── api/            запросы к серверу
│   └── types.ts        типы данных
└── vite.config.ts      настройки, в том числе прокси /api
\`\`\`

Папки \`components\`, \`pages\`, \`api\` создаются руками — их нет в шаблоне, но именно такую структуру предлагает программа и ожидают проверяющие.

## main.tsx

\`\`\`tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
\`\`\`

Порядок импортов стилей важен: сначала Bootstrap, потом свой файл.

## Что убрать из шаблона

Шаблон Vite приходит с логотипами, счётчиком и большим \`App.css\`. Всё это удаляют сразу: лишний код мешает и выглядит неаккуратно при проверке.

## Первое отличие от чистого JS

В чистом JavaScript вы искали элемент и меняли его. В React вы **не трогаете DOM руками**: меняете данные — интерфейс перерисовывается сам. Попытка вызвать \`document.querySelector\` внутри компонента почти всегда означает, что задача решается неправильно.`,
    examples: [
      {
        title: 'Первый компонент',
        language: 'tsx',
        code: `function App() {
  const rooms = ['Аудитория', 'Коворкинг', 'Кинозал'];

  return (
    <div className="container py-4">
      <h1>Конференции.РФ</h1>
      <p>Бронирование помещений для всероссийских конференций.</p>

      <ul>
        {rooms.map((room) => (
          <li key={room}>{room}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;`,
      },
    ],
    mistakes: [
      {
        title: 'Имя компонента с маленькой буквы',
        wrong: 'function header() { … }  затем <header />',
        right: 'function Header() { … }  затем <Header />',
        why: 'React посчитает это обычным HTML-тегом и ничего не отрисует.',
      },
      {
        title: 'Менять DOM вручную внутри компонента',
        why: 'React перерисует элемент и затрёт ваши правки. Меняйте состояние, а не DOM.',
      },
      {
        title: 'Не проверить создание проекта офлайн',
        why: 'На экзамене интернета не будет. Программа советует проверить это заранее — в день экзамена уже поздно.',
      },
    ],
    quizId: 'quiz-react-basics',
    taskIds: ['task-react-first-component'],
    resources: [
      { title: 'ru.react.dev — быстрый старт', url: 'https://ru.react.dev/learn', kind: 'docs', source: 'plan' },
      { title: 'Vite: создание проекта', url: 'https://vitejs.dev/guide/', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m3-framework'],
    prerequisites: ['ts-types', 'js-modules'],
    estimatedMinutes: 45,
    planDays: ['day-09-1', 'day-09-6'],
    source: 'plan',
  },

  {
    id: 'react-tsx',
    title: 'Правила TSX: разметка внутри кода',
    tech: ['react', 'ts'],
    monthNo: 3,
    weekNo: 9,
    importance: 'core',
    summary:
      'TSX выглядит как HTML, но подчиняется правилам JavaScript: className вместо class, один корневой элемент, выражения в фигурных скобках.',
    mustKnow: [
      'Один корневой элемент или фрагмент `<>…</>`',
      '`className` вместо `class`, `htmlFor` вместо `for`',
      'Выражения в `{}`',
      'Самозакрывающиеся теги',
      '`style={{ … }}` — объект, а не строка',
    ],
    theory: `## Пять правил

**1. Один корневой элемент.** Компонент возвращает что-то одно:

\`\`\`tsx
return (
  <>
    <h1>Заголовок</h1>
    <p>Текст</p>
  </>
);
\`\`\`

\`<>…</>\` — фрагмент: группирует элементы, но не создаёт лишний \`div\`.

**2. className вместо class.** Слово \`class\` уже занято в JavaScript. То же с \`for\` у подписи — пишется \`htmlFor\`.

\`\`\`tsx
<label htmlFor="login" className="form-label">Логин</label>
\`\`\`

**3. Выражения в фигурных скобках.**

\`\`\`tsx
<p>Заявок: {applications.length}</p>
<span className={\`badge bg-\${statusColor(status)}\`}>{status}</span>
<input value={login} onChange={handleChange} />
\`\`\`

В скобки можно поставить любое **выражение**: переменную, вызов функции, тернарный оператор. Но не \`if\` и не \`for\` — это инструкции, а не выражения.

**4. Все теги закрываются.**

\`\`\`tsx
<img src="/img/hall.jpg" alt="Зал" />
<br />
<input type="text" />
\`\`\`

**5. style — это объект.**

\`\`\`tsx
<div style={{ marginTop: 16, color: '#dc2626' }} />
\`\`\`

Двойные скобки: внешние — «здесь выражение», внутренние — сам объект. Свойства пишутся в стиле camelCase: \`marginTop\`, \`backgroundColor\`.

На практике \`style\` используют редко: почти всё делается классами.

## Emmet в TSX

Emmet работает и здесь. Наберите \`div.card>div.card-body>h5.card-title\` и нажмите Tab — VS Code подставит \`className\` вместо \`class\`, потому что файл имеет расширение \`.tsx\`.

## Комментарии

\`\`\`tsx
{/* комментарий внутри разметки */}
\`\`\`

## Условия внутри разметки

\`\`\`tsx
{error && <p className="text-danger">{error}</p>}
{isAdmin ? <AdminPanel /> : <UserPanel />}
\`\`\`

Первый вариант — «показать, если есть», второй — «одно из двух».

Осторожно с числами: \`{count && <p>…</p>}\` при \`count === 0\` выведет на экран «0». Пишите \`{count > 0 && …}\`.`,
    examples: [
      {
        title: 'Карточка заявки на TSX',
        language: 'tsx',
        code: `interface Props {
  room: string;
  date: string;
  status: string;
}

function ApplicationCard({ room, date, status }: Props) {
  const color = status === 'Новая' ? 'secondary' : status === 'Мероприятие назначено' ? 'primary' : 'success';

  return (
    <article className="card mb-3">
      <div className="card-body d-flex justify-content-between align-items-start gap-2">
        <div>
          <h3 className="h6 mb-1">{room}</h3>
          <p className="text-muted small mb-0">{date}</p>
        </div>
        <span className={\`badge bg-\${color}\`}>{status}</span>
      </div>
    </article>
  );
}`,
      },
    ],
    mistakes: [
      {
        title: 'class вместо className',
        wrong: '<div class="card">',
        right: '<div className="card">',
        why: 'React предупредит в консоли, а стиль не применится.',
      },
      {
        title: 'Два корневых элемента',
        why: 'Компонент должен вернуть что-то одно. Оберните в фрагмент <>…</>.',
      },
      {
        title: 'Условие через число',
        wrong: '{items.length && <List />}',
        right: '{items.length > 0 && <List />}',
        why: 'При нуле React выведет на экран символ «0».',
      },
    ],
    quizId: 'quiz-react-tsx',
    taskIds: ['task-react-tsx-fix', 'task-react-first-component'],
    resources: [
      { title: 'ru.react.dev — разметка в JSX', url: 'https://ru.react.dev/learn/writing-markup-with-jsx', kind: 'docs', source: 'plan' },
    ],
    examRefs: [],
    prerequisites: ['react-basics'],
    estimatedMinutes: 40,
    planDays: ['day-09-2'],
    source: 'plan',
  },

  {
    id: 'react-props',
    title: 'Props: передача данных в компонент',
    tech: ['react', 'ts'],
    monthNo: 3,
    weekNo: 9,
    importance: 'core',
    summary:
      'Props — параметры компонента. Через них страница передаёт данные карточке, а типизация props превращает редактор в справочник.',
    mustKnow: [
      'Передача и приём props',
      'Типизация через `interface Props`',
      'Деструктуризация в параметрах',
      'Значения по умолчанию',
      '`children` — вложенное содержимое',
    ],
    theory: `## Передача

\`\`\`tsx
<ApplicationCard room="Коворкинг" date="14.09.2026" status="Новая" />
\`\`\`

## Приём и типизация

\`\`\`tsx
interface Props {
  room: string;
  date: string;
  status: Status;
  onOpen?: (id: number) => void;   // необязательный обработчик
}

function ApplicationCard({ room, date, status, onOpen }: Props) {
  return <article onClick={() => onOpen?.(1)}>…</article>;
}
\`\`\`

Типизация даёт три вещи: редактор подсказывает доступные props, забытое обязательное свойство подсвечивается ошибкой, опечатка в имени не проходит.

## Значения по умолчанию

\`\`\`tsx
function Badge({ tone = 'secondary', children }: BadgeProps) {
  return <span className={\`badge bg-\${tone}\`}>{children}</span>;
}
\`\`\`

## children

\`\`\`tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="h6">{title}</h3>
        {children}
      </div>
    </div>
  );
}

// использование
<Card title="Мои заявки">
  <p>Здесь будет список</p>
</Card>
\`\`\`

Тип \`React.ReactNode\` означает «что угодно, что можно отрисовать»: текст, число, элементы, массив.

## Props только для чтения

Внутри компонента props менять нельзя:

\`\`\`tsx
function Bad({ status }: Props) {
  status = 'Новая';   // так делать нельзя
}
\`\`\`

Данные идут сверху вниз. Если дочернему компоненту нужно что-то изменить, родитель передаёт функцию:

\`\`\`tsx
<StatusSelect value={status} onChange={(next) => changeStatus(id, next)} />
\`\`\`

Это и есть основной способ общения компонентов: данные вниз, события вверх.

## Как разбивать на компоненты

Практическое правило: выносите то, что повторяется или занимает больше 50–60 строк. Для проекта экзамена достаточно такого набора: \`Header\`, \`Footer\`, \`ApplicationCard\`, \`StatusBadge\`, \`Slider\`, \`DateInput\`, \`Toast\`, \`Pagination\`, \`ProtectedRoute\`.`,
    examples: [
      {
        title: 'Бейдж статуса как отдельный компонент',
        language: 'tsx',
        code: `type Status = 'Новая' | 'Мероприятие назначено' | 'Мероприятие завершено';

const COLORS: Record<Status, string> = {
  'Новая': 'secondary',
  'Мероприятие назначено': 'primary',
  'Мероприятие завершено': 'success',
};

interface Props {
  status: Status;
}

export function StatusBadge({ status }: Props) {
  return <span className={\`badge bg-\${COLORS[status]}\`}>{status}</span>;
}`,
        explanation:
          'Тип Status не даст передать несуществующий статус, а Record<Status, string> заставит описать цвет для каждого из трёх значений.',
      },
    ],
    mistakes: [
      {
        title: 'Изменять props внутри компонента',
        why: 'Props только для чтения. Для изменяемых данных есть состояние (useState) у родителя.',
      },
      {
        title: 'Передавать десять отдельных props вместо объекта',
        wrong: '<Card id={id} room={room} date={date} status={status} payment={payment} />',
        right: '<Card application={application} />',
        why: 'Когда props больше пяти, чаще всего стоит передать объект целиком.',
      },
    ],
    quizId: 'quiz-react-props',
    taskIds: ['task-react-props'],
    resources: [
      { title: 'ru.react.dev — передача props', url: 'https://ru.react.dev/learn/passing-props-to-a-component', kind: 'docs', source: 'plan' },
    ],
    examRefs: ['m1-cabinet'],
    prerequisites: ['react-tsx'],
    estimatedMinutes: 45,
    planDays: ['day-09-3'],
    source: 'plan',
  },

  {
    id: 'react-lists',
    title: 'Списки и key',
    tech: ['react'],
    monthNo: 3,
    weekNo: 9,
    importance: 'core',
    summary:
      'Список заявок рисуется методом map. Атрибут key нужен React, чтобы понимать, какой элемент изменился — без него появляются трудноуловимые ошибки.',
    mustKnow: [
      '`map` внутри разметки',
      'Зачем нужен `key` и каким он должен быть',
      'Почему индекс массива — плохой key',
      'Пустое состояние списка',
      'Вынесение элемента списка в отдельный компонент',
    ],
    theory: `## Отрисовка списка

\`\`\`tsx
<div className="row g-3">
  {applications.map((application) => (
    <div className="col-12 col-md-6" key={application.id}>
      <ApplicationCard application={application} />
    </div>
  ))}
</div>
\`\`\`

\`map\` превращает массив данных в массив элементов — React умеет отрисовывать такие массивы.

## key

\`key\` — подсказка React: «этот элемент списка — тот же самый, что был раньше». По ней React решает, что перерисовать, а что оставить.

Правила:

- key должен быть **уникальным среди соседей**;
- key должен быть **стабильным**: один и тот же элемент — всегда один и тот же key;
- лучший key — идентификатор из базы данных.

\`\`\`tsx
{applications.map((a) => <Row key={a.id} application={a} />)}
\`\`\`

## Почему индекс — плохой key

\`\`\`tsx
{applications.map((a, index) => <Row key={index} application={a} />)}
\`\`\`

Пока список не меняется, всё работает. Но стоит удалить или отсортировать элементы — индексы сдвигаются, и React решает, что изменилось содержимое, а не порядок. Результат: введённый текст «перескакивает» в другую строку, чекбоксы отмечаются не там.

Индекс допустим только если список статичен и никогда не сортируется.

## Пустое состояние

\`\`\`tsx
{applications.length === 0 ? (
  <p className="text-muted">У вас пока нет заявок</p>
) : (
  applications.map((a) => <ApplicationCard key={a.id} application={a} />)
)}
\`\`\`

Пустой экран без объяснения выглядит как поломка — на экзамене это прямо влияет на оценку качества.

## Фильтр, сортировка и страница

\`\`\`tsx
const visible = applications
  .filter((a) => !status || a.status === status)
  .sort((a, b) => a.date.localeCompare(b.date))
  .slice((page - 1) * perPage, page * perPage);
\`\`\`

Обратите внимание: \`.filter\` уже создал новый массив, поэтому \`.sort\` здесь безопасен. Сортировать напрямую массив из состояния нельзя — \`sort\` меняет его на месте.`,
    examples: [
      {
        title: 'Список заявок с пустым состоянием',
        language: 'tsx',
        code: `interface Props {
  applications: Application[];
}

export function ApplicationList({ applications }: Props) {
  if (applications.length === 0) {
    return (
      <div className="alert alert-light border text-center">
        У вас пока нет заявок. Оформите первую на странице «Заявка».
      </div>
    );
  }

  return (
    <div className="row g-3">
      {applications.map((application) => (
        <div className="col-12 col-md-6" key={application.id}>
          <ApplicationCard application={application} />
        </div>
      ))}
    </div>
  );
}`,
      },
    ],
    mistakes: [
      {
        title: 'Забыть key',
        why: 'React выведет предупреждение в консоли, а при изменении списка начнутся странности с полями ввода.',
      },
      {
        title: 'key={index} в изменяемом списке',
        why: 'При сортировке и удалении состояние элементов перепутывается. Используйте id.',
      },
      {
        title: 'sort напрямую по состоянию',
        wrong: 'applications.sort(...)',
        right: '[...applications].sort(...)',
        why: 'sort меняет массив на месте, React не увидит изменения и не перерисует список.',
      },
    ],
    quizId: 'quiz-react-lists',
    taskIds: ['task-react-list'],
    projectIds: ['project-03-cabinet-ui'],
    resources: [
      { title: 'ru.react.dev — рендеринг списков', url: 'https://ru.react.dev/learn/rendering-lists', kind: 'docs', source: 'plan' },
    ],
    examRefs: ['m1-cabinet', 'm2-cabinet-ux'],
    prerequisites: ['react-props'],
    estimatedMinutes: 45,
    planDays: ['day-09-4'],
    source: 'plan',
  },

  {
    id: 'react-conditional',
    title: 'Условный рендер',
    tech: ['react'],
    monthNo: 3,
    weekNo: 9,
    importance: 'core',
    summary:
      'Показать форму отзыва только у заявки с изменённым статусом, спрятать админку от обычного пользователя, вывести ошибку — всё это условный рендер.',
    mustKnow: [
      '`условие && <Элемент />`',
      'Тернарный оператор для двух вариантов',
      'Ранний `return null`',
      'Ловушка с числом 0',
      'Состояния: загрузка, ошибка, пусто, данные',
    ],
    theory: `## Три приёма

**Показать, если есть:**

\`\`\`tsx
{error && <div className="alert alert-danger">{error}</div>}
\`\`\`

**Одно из двух:**

\`\`\`tsx
{isAdmin ? <AdminTable /> : <MyApplications />}
\`\`\`

**Ранний выход:**

\`\`\`tsx
function ReviewForm({ status }: Props) {
  if (status === 'Новая') return null;   // отзыв ещё недоступен
  return <form>…</form>;
}
\`\`\`

Последний вариант часто самый читаемый: условие видно сразу, а не спрятано в глубине разметки.

## Требование экзамена

Модуль 2: «Возможность оставить отзыв у пользователя только после изменения статуса заявки администратором». То есть форма отзыва не должна показываться у заявки со статусом «Новая»:

\`\`\`tsx
{application.status !== 'Новая' && <ReviewForm applicationId={application.id} />}
\`\`\`

И это же правило обязательно проверяется на сервере — фронтенд можно обойти.

## Ловушка с нулём

\`\`\`tsx
{applications.length && <List />}      // при 0 выведет «0»
{applications.length > 0 && <List />}  // правильно
\`\`\`

Оператор \`&&\` возвращает левое значение, если оно ложное. Ноль — ложное значение, но React его отрисует.

## Четыре состояния страницы

Раздел «состояния интерфейса» из требований качества кода:

\`\`\`tsx
if (loading) return <Spinner />;
if (error) return <ErrorMessage message={error} onRetry={load} />;
if (!applications.length) return <EmptyState />;
return <ApplicationList applications={applications} />;
\`\`\`

Порядок именно такой: сначала загрузка, потом ошибка, потом пустота, потом данные. Такая лесенка из ранних \`return\` читается лучше вложенных тернарных операторов.`,
    examples: [
      {
        title: 'Карточка заявки с условной формой отзыва',
        language: 'tsx',
        code: `export function ApplicationCard({ application, onReview }: Props) {
  const canReview = application.status !== 'Новая';

  return (
    <article className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between gap-2">
          <h3 className="h6 mb-1">{application.room}</h3>
          <StatusBadge status={application.status} />
        </div>
        <p className="text-muted small">{application.date} · {application.payment}</p>

        {application.reviewText ? (
          <p className="mb-0"><strong>Ваш отзыв:</strong> {application.reviewText}</p>
        ) : canReview ? (
          <ReviewForm applicationId={application.id} onSubmit={onReview} />
        ) : (
          <p className="text-muted small mb-0">
            Отзыв можно оставить после того, как администратор изменит статус заявки.
          </p>
        )}
      </div>
    </article>
  );
}`,
        explanation:
          'Три ветки: отзыв уже есть, отзыв можно оставить, отзыв пока недоступен. Последняя ветка объясняет пользователю, почему формы нет, — это лучше, чем просто её отсутствие.',
      },
    ],
    mistakes: [
      {
        title: 'Показывать форму отзыва всегда',
        why: 'Прямое нарушение требования модуля 2. Проверяется и глазами, и в чек-листе.',
      },
      {
        title: 'Вложенные тернарные операторы в три уровня',
        why: 'Читать невозможно. Разбейте на ранние return или вынесите в отдельный компонент.',
      },
    ],
    quizId: 'quiz-react-conditional',
    taskIds: ['task-react-conditional', 'task-react-list', 'task-fs-menu-roles'],
    projectIds: ['project-03-cabinet-ui'],
    resources: [
      { title: 'ru.react.dev — условный рендеринг', url: 'https://ru.react.dev/learn/conditional-rendering', kind: 'docs', source: 'plan' },
    ],
    examRefs: ['m2-cabinet-ux'],
    prerequisites: ['react-lists'],
    estimatedMinutes: 40,
    planDays: ['day-09-4'],
    source: 'plan',
  },

  {
    id: 'react-state',
    title: 'useState: состояние компонента',
    tech: ['react'],
    monthNo: 3,
    weekNo: 9,
    importance: 'core',
    summary:
      'Состояние — данные, которые меняются со временем: значения полей, выбранный фильтр, номер страницы. Изменение состояния перерисовывает компонент.',
    mustKnow: [
      '`const [value, setValue] = useState(начальное)`',
      'Состояние меняется только через setter',
      'Обновление по предыдущему значению',
      'Объект и массив в состоянии: только новые ссылки',
      'Правила хуков',
    ],
    theory: `## Основа

\`\`\`tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Кликов: {count}</button>;
}
\`\`\`

\`useState\` возвращает пару: текущее значение и функцию изменения. Вызов функции сообщает React: «данные изменились, перерисуй».

Обычная переменная так не работает: она изменится, но React об этом не узнает и экран не обновится.

## Обновление по предыдущему значению

\`\`\`tsx
setCount(count + 1);            // обычно достаточно
setCount((prev) => prev + 1);   // надёжно, если изменений несколько подряд
\`\`\`

Форма с функцией нужна, когда новое значение зависит от старого, а обновлений в одном обработчике несколько.

## Объекты и массивы

Состояние **нельзя менять на месте** — React сравнивает ссылки:

\`\`\`tsx
// неправильно: ссылка та же, перерисовки не будет
values.login = 'ivanov26';
setValues(values);

// правильно: новый объект
setValues({ ...values, login: 'ivanov26' });
\`\`\`

Для массивов:

\`\`\`tsx
setItems([...items, newItem]);                                   // добавить
setItems(items.filter((item) => item.id !== id));                // удалить
setItems(items.map((item) => (item.id === id ? { ...item, status } : item)));  // изменить
\`\`\`

## Одна форма — одно состояние

\`\`\`tsx
const [values, setValues] = useState({ login: '', password: '', fullName: '', phone: '', email: '' });

function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  const { name, value } = event.target;
  setValues((prev) => ({ ...prev, [name]: value }));
}
\`\`\`

Один обработчик обслуживает все поля — работает благодаря атрибуту \`name\`, совпадающему с ключом объекта.

## Правила хуков

1. Хуки вызываются только на верхнем уровне компонента — не внутри условий, циклов и вложенных функций.
2. Хуки вызываются только из компонентов и других хуков.

React определяет, какому вызову принадлежит состояние, **по порядку вызовов**. Условный вызов ломает этот порядок.

\`\`\`tsx
// нельзя
if (isAdmin) { const [x, setX] = useState(0); }

// можно
const [x, setX] = useState(0);
if (isAdmin) { /* используем x */ }
\`\`\`

## Где хранить состояние

Правило: состояние живёт в **ближайшем общем родителе** тех компонентов, которым оно нужно. Фильтр админки нужен и панели фильтров, и таблице — значит, состояние держит страница админки и передаёт вниз.`,
    examples: [
      {
        title: 'Фильтр списка заявок',
        language: 'tsx',
        code: `const STATUSES = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'] as const;

export function AdminPage({ applications }: { applications: Application[] }) {
  const [status, setStatus] = useState<string>('');
  const [page, setPage] = useState(1);

  const filtered = status ? applications.filter((a) => a.status === status) : applications;
  const totalPages = Math.max(1, Math.ceil(filtered.length / 5));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * 5, safePage * 5);

  return (
    <div>
      <select
        className="form-select mb-3"
        value={status}
        onChange={(event) => {
          setStatus(event.target.value);
          setPage(1);              // при смене фильтра возвращаемся на первую страницу
        }}
      >
        <option value="">Все статусы</option>
        {STATUSES.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>

      <ApplicationList applications={visible} />

      <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}`,
        explanation:
          'Отфильтрованный список не хранится в состоянии — он вычисляется из данных и фильтра при каждой отрисовке. Хранить в состоянии то, что можно вычислить, — распространённая ошибка.',
      },
    ],
    mistakes: [
      {
        title: 'Менять состояние напрямую',
        wrong: 'values.login = "x"; setValues(values);',
        right: 'setValues({ ...values, login: "x" });',
        why: 'React сравнивает ссылки. Та же ссылка — перерисовки не будет.',
      },
      {
        title: 'Хук внутри условия',
        why: 'React определяет состояние по порядку вызовов хуков. Условный вызов ломает соответствие.',
      },
      {
        title: 'Хранить вычисляемые данные в состоянии',
        why: 'Отфильтрованный список нужно считать при отрисовке. Дублирование в состоянии рано или поздно разъедется с источником.',
      },
    ],
    quizId: 'quiz-react-state',
    taskIds: ['task-react-state-filter'],
    projectIds: ['project-03-cabinet-ui'],
    resources: [
      { title: 'ru.react.dev — состояние компонента', url: 'https://ru.react.dev/learn/state-a-components-memory', kind: 'docs', source: 'plan' },
    ],
    examRefs: ['m2-admin-tools'],
    prerequisites: ['react-conditional'],
    estimatedMinutes: 50,
    planDays: ['day-09-5'],
    source: 'plan',
  },

  {
    id: 'react-forms',
    title: 'Формы в React: управляемые поля и валидация',
    tech: ['react'],
    monthNo: 3,
    weekNo: 10,
    importance: 'core',
    summary:
      'В React значение поля хранится в состоянии, а не в DOM. Форма регистрации из задания собирается из одного объекта значений и одного объекта ошибок.',
    mustKnow: [
      'Управляемое поле: `value` + `onChange`',
      'Один объект состояния на всю форму',
      'Объект ошибок и показ подсказок у полей',
      '`onSubmit` с `preventDefault`',
      'Блокировка кнопки во время отправки',
    ],
    theory: `## Управляемое поле

\`\`\`tsx
const [login, setLogin] = useState('');

<input
  className="form-control"
  value={login}
  onChange={(event) => setLogin(event.target.value)}
/>
\`\`\`

Значение приходит из состояния, изменение возвращается в состояние. Поэтому React всегда знает, что введено, — и может это проверить, очистить, подставить.

Если задать \`value\` без \`onChange\`, поле станет нередактируемым, и React предупредит об этом в консоли.

## Одно состояние на форму

Для пяти полей регистрации пять \`useState\` — это много. Лучше один объект:

\`\`\`tsx
const [values, setValues] = useState({
  login: '', password: '', fullName: '', phone: '', email: '',
});

function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  const { name, value } = event.target;
  setValues((prev) => ({ ...prev, [name]: value }));
}
\`\`\`

Один обработчик на все поля — благодаря совпадению атрибута \`name\` с ключом объекта.

## Ошибки

\`\`\`tsx
const [errors, setErrors] = useState<Record<string, string>>({});

<input
  name="login"
  className={\`form-control \${errors.login ? 'is-invalid' : ''}\`}
  value={values.login}
  onChange={handleChange}
/>
{errors.login && <div className="invalid-feedback">{errors.login}</div>}
\`\`\`

Это и есть «подсказки об ошибках рядом с формой» из требований модуля 2.

## Отправка

\`\`\`tsx
async function handleSubmit(event: React.FormEvent) {
  event.preventDefault();

  const nextErrors = validateRegister(values);
  setErrors(nextErrors);
  if (Object.keys(nextErrors).length) return;

  setSending(true);
  try {
    await api.post('/register', values);
    navigate('/login');
  } catch (error) {
    // серверную ошибку показываем в том же месте
    setErrors({ login: 'Такой логин уже занят' });
  } finally {
    setSending(false);
  }
}
\`\`\`

Флаг \`sending\` блокирует кнопку, чтобы заявка не ушла дважды по двойному клику.

## Типы событий

\`\`\`tsx
React.ChangeEvent<HTMLInputElement>      // input
React.ChangeEvent<HTMLSelectElement>     // select
React.ChangeEvent<HTMLTextAreaElement>   // textarea
React.FormEvent                          // submit формы
React.MouseEvent                         // клик
\`\`\`

Их не нужно заучивать: наведите курсор на параметр — редактор подскажет нужный тип.`,
    examples: [
      {
        title: 'Форма регистрации целиком',
        language: 'tsx',
        code: `const LOGIN_PATTERN = /^[A-Za-z0-9]{6,}$/;

type Values = { login: string; password: string; fullName: string; phone: string; email: string };

function validate(values: Values): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!values.login) errors.login = 'Введите логин';
  else if (!LOGIN_PATTERN.test(values.login)) errors.login = 'Только латинские буквы и цифры, минимум 6 символов';
  if (values.password.length < 8) errors.password = 'Пароль не короче 8 символов';
  if (!values.fullName) errors.fullName = 'Укажите ФИО';
  if (!values.phone) errors.phone = 'Укажите телефон';
  if (!values.email) errors.email = 'Укажите e-mail';
  return errors;
}

export function RegisterPage() {
  const [values, setValues] = useState<Values>({ login: '', password: '', fullName: '', phone: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSending(true);
    try {
      await api.post('/register', values);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label htmlFor="login" className="form-label">Логин</label>
        <input
          id="login"
          name="login"
          className={\`form-control \${errors.login ? 'is-invalid' : ''}\`}
          value={values.login}
          onChange={handleChange}
        />
        {errors.login && <div className="invalid-feedback">{errors.login}</div>}
      </div>

      {/* остальные поля устроены так же */}

      <button className="btn btn-primary w-100" type="submit" disabled={sending}>
        {sending ? 'Отправляем…' : 'Зарегистрироваться'}
      </button>
    </form>
  );
}`,
      },
    ],
    mistakes: [
      {
        title: 'value без onChange',
        why: 'Поле станет нередактируемым. React предупредит об этом в консоли.',
      },
      {
        title: 'Читать значения через document.querySelector',
        why: 'В React значения живут в состоянии. Обращение к DOM означает, что задача решается не по-реактовски.',
      },
      {
        title: 'Не блокировать кнопку при отправке',
        why: 'Двойной клик создаст две одинаковые заявки.',
      },
    ],
    quizId: 'quiz-react-forms',
    taskIds: ['task-react-register-form', 'task-fs-order-form'],
    resources: [
      { title: 'ru.react.dev — формы', url: 'https://ru.react.dev/reference/react-dom/components/input', kind: 'docs', source: 'plan' },
    ],
    examRefs: ['m1-register', 'm2-register-hints'],
    prerequisites: ['react-state'],
    estimatedMinutes: 55,
    planDays: ['day-10-1', 'day-10-2', 'day-10-4'],
    source: 'plan',
  },

  {
    id: 'react-date-input',
    title: 'Поле даты с маской ДД.ММ.ГГГГ',
    tech: ['react'],
    monthNo: 3,
    weekNo: 10,
    importance: 'core',
    summary:
      'Задание требует дату в формате ДД.ММ.ГГГГ. Текстовое поле с маской надёжнее input type="date": его вид не зависит от настроек браузера.',
    mustKnow: [
      'Почему type="date" ведёт себя по-разному',
      'Маска: автоматическая подстановка точек',
      'Проверка существования даты',
      'Перевод в формат базы ГГГГ-ММ-ДД',
      'Запрет даты в прошлом',
    ],
    theory: `## Две стратегии

**\`input type="date"\`** — календарь браузера. Вид зависит от языка системы: в русской локали это дд.мм.гггг, в английской mm/dd/yyyy. Значение всегда приходит в формате \`ГГГГ-ММ-ДД\`.

**Текстовое поле с маской** — вы полностью управляете видом. Задание требует «дату в поле формата ДД.ММ.ГГГГ», поэтому такой вариант ближе к формулировке.

Учебная программа советует уточнить у преподавателя, какой вариант принимают. Маска — более предсказуемый выбор.

## Маска

Логика простая: оставить только цифры, обрезать до восьми, расставить точки.

\`\`\`ts
function applyMask(raw: string): string {
  const digits = raw.replace(/\\D/g, '').slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)];
  return parts.filter(Boolean).join('.');
}
\`\`\`

Пользователь печатает \`14092026\` — в поле появляется \`14.09.2026\`.

## Проверка

\`\`\`ts
function parseRuDate(value: string): string | null {
  const match = /^(\\d{2})\\.(\\d{2})\\.(\\d{4})$/.exec(value);
  if (!match) return null;

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (date.getDate() !== Number(day) || date.getMonth() !== Number(month) - 1) return null;

  return \`\${year}-\${month}-\${day}\`;   // формат для сервера
}
\`\`\`

Проверка через объект \`Date\` отсекает 31 февраля: браузер «исправит» такую дату на 3 марта, и несовпадение дня это покажет.

## Дата не в прошлом

Конференцию нельзя забронировать задним числом:

\`\`\`ts
const todayIso = new Date().toISOString().slice(0, 10);
if (iso < todayIso) return 'Дата не может быть в прошлом';
\`\`\`

Сравнение работает, потому что формат ГГГГ-ММ-ДД сортируется как обычная строка.

## Готовый компонент

Вынесите поле в отдельный компонент \`DateInput\` — он понадобится и на странице заявки, и в фильтрах админки. Компонент принимает \`value\`, \`onChange\` и \`error\`, а наружу отдаёт уже проверенное значение.`,
    examples: [
      {
        title: 'Компонент DateInput',
        language: 'tsx',
        code: `interface Props {
  value: string;                  // в формате ДД.ММ.ГГГГ
  onChange: (value: string) => void;
  error?: string;
  label?: string;
}

export function DateInput({ value, onChange, error, label = 'Дата начала' }: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\\D/g, '').slice(0, 8);
    const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
    onChange(parts.join('.'));
  };

  return (
    <div className="mb-3">
      <label htmlFor="date" className="form-label">{label}</label>
      <input
        id="date"
        name="date"
        className={\`form-control \${error ? 'is-invalid' : ''}\`}
        value={value}
        onChange={handleChange}
        placeholder="ДД.ММ.ГГГГ"
        inputMode="numeric"
        autoComplete="off"
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}`,
        explanation:
          'Атрибут inputMode="numeric" открывает на телефоне цифровую клавиатуру — мелочь, заметная на экране 390×844.',
      },
    ],
    mistakes: [
      {
        title: 'Отправлять на сервер дату в формате ДД.ММ.ГГГГ',
        why: 'База ждёт ГГГГ-ММ-ДД. Переводите перед отправкой, иначе в таблице окажется мусор или ошибка.',
      },
      {
        title: 'Проверять дату только регулярным выражением',
        why: 'Формат 31.02.2026 верный, а даты такой нет. Нужна дополнительная проверка через Date.',
      },
    ],
    quizId: 'quiz-react-date-input',
    taskIds: ['task-react-date-input'],
    resources: [
      { title: 'MDN: input type=date', url: 'https://developer.mozilla.org/ru/docs/Web/HTML/Element/input/date', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m2-order-form', 'm1-order'],
    prerequisites: ['react-forms', 'js-dates'],
    estimatedMinutes: 45,
    planDays: ['day-10-3', 'day-10-6'],
    source: 'plan',
  },
];

export const MONTH_03_TOPICS: Topic[] = [...WEEK_9_10, ...MONTH_03_APP_TOPICS];
