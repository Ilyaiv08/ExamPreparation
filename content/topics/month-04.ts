import type { Topic } from '../types';
import { MONTH_04_SERVER_TOPICS } from './month-04-server';

/** Месяц 4, недели 13–14: проектирование базы данных и SQL. */
const WEEK_13_14: Topic[] = [
  {
    id: 'db-relational',
    title: 'Реляционная база: таблицы, строки, ключи',
    tech: ['sql'],
    monthNo: 4,
    weekNo: 13,
    importance: 'core',
    summary:
      'Задание экзамена начинается с проектирования базы. Таблица — это сущность, строка — один объект, первичный ключ — способ отличить одну строку от другой.',
    mustKnow: [
      'Таблица, строка, столбец',
      'Первичный ключ и AUTO_INCREMENT',
      'NULL и почему он не равен пустой строке',
      'Первичный и внешний ключ',
      'Чем БД отличается от массива в памяти',
    ],
    theory: `## Из чего состоит база

**Таблица** описывает один тип объектов: пользователи, помещения, заявки. **Строка** — один конкретный объект. **Столбец** — одно свойство с заданным типом.

\`\`\`text
users
┌────┬───────────┬──────────────────┬───────────────┐
│ id │ login     │ password_hash    │ full_name     │
├────┼───────────┼──────────────────┼───────────────┤
│  1 │ ivanov26  │ $2a$10$...       │ Иванов И.И.   │
│  2 │ Admin26   │ $2a$10$...       │ Администратор │
└────┴───────────┴──────────────────┴───────────────┘
\`\`\`

## Первичный ключ

Столбец, который однозначно определяет строку. Почти всегда это числовой \`id\`:

\`\`\`sql
id INT AUTO_INCREMENT PRIMARY KEY
\`\`\`

\`AUTO_INCREMENT\` означает, что база сама выдаст следующий номер — вам не нужно думать об уникальности.

Почему не логин в качестве ключа? Логин уникален, но может измениться, а ключ менять нельзя: на него ссылаются другие таблицы.

## NULL

\`NULL\` — «значения нет». Это не пустая строка и не ноль.

\`\`\`sql
review_text TEXT NULL          -- отзыва может не быть
status VARCHAR(30) NOT NULL    -- статус есть всегда
\`\`\`

Сравнение с \`NULL\` через \`=\` не работает: \`WHERE review_text = NULL\` не найдёт ничего. Правильно — \`IS NULL\` и \`IS NOT NULL\`.

## Внешний ключ

Ссылка одной таблицы на другую:

\`\`\`sql
user_id INT NOT NULL,
FOREIGN KEY (user_id) REFERENCES users(id)
\`\`\`

База гарантирует: нельзя создать заявку от несуществующего пользователя. Это называется целостностью данных — одна из главных причин использовать СУБД, а не файл.

## Чем база лучше массива в памяти

| | Массив в памяти | База данных |
|---|---|---|
| После перезапуска | Данные пропали | Данные на месте |
| Поиск | Перебор вручную | Индекс, быстро |
| Целостность | Нужно следить самому | Ключи и ограничения |
| Несколько пользователей | Конфликты | Транзакции |

На экзамене заявки «сохраняются в централизованной базе данных» — это прямая формулировка задания.

## Сущности проекта

Из описания предметной области выделяются: **пользователи**, **помещения** (аудитория, коворкинг, кинозал), **способы оплаты**, **заявки**, **отзывы**. Приём простой: существительные из текста задания → таблицы.`,
    examples: [
      {
        title: 'Таблица пользователей',
        language: 'sql',
        code: `CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  login         VARCHAR(50)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(150) NOT NULL,
  phone         VARCHAR(30)  NOT NULL,
  email         VARCHAR(150) NOT NULL,
  role          VARCHAR(10)  NOT NULL DEFAULT 'user'
);`,
        explanation:
          'UNIQUE на логине — это требование задания «логин должен быть уникальным», реализованное на уровне базы. Даже если проверка на сервере даст сбой, база не пропустит дубликат.',
      },
    ],
    mistakes: [
      {
        title: 'Хранить пароль открытым текстом',
        wrong: 'password VARCHAR(50)',
        right: 'password_hash VARCHAR(255)',
        why: 'Пароль хранится только хешем. Длина 255 — с запасом под bcrypt (60 символов) и будущие алгоритмы.',
      },
      {
        title: 'Сравнивать с NULL через =',
        wrong: 'WHERE review_text = NULL',
        right: 'WHERE review_text IS NULL',
        why: 'NULL не равен ничему, даже самому себе. Нужны операторы IS NULL и IS NOT NULL.',
      },
    ],
    quizId: 'quiz-db-relational',
    taskIds: [],
    resources: [
      { title: 'metanit.com — MySQL', url: 'https://metanit.com/sql/mysql/', kind: 'tutorial', source: 'plan' },
    ],
    examRefs: ['m1-db'],
    prerequisites: ['web-basics'],
    estimatedMinutes: 45,
    planDays: ['day-13-1'],
    source: 'plan',
  },

  {
    id: 'db-types',
    title: 'Типы данных и выбор для каждого поля',
    tech: ['sql'],
    monthNo: 4,
    weekNo: 13,
    importance: 'core',
    summary:
      'Задание требует «таблицы с полями соответствующих типов данных». Дата должна быть DATE, а не строкой; деньги — DECIMAL, а не FLOAT.',
    mustKnow: [
      'INT, VARCHAR(n), TEXT',
      'DATE, DATETIME, TIMESTAMP',
      'DECIMAL для денег, почему не FLOAT',
      'ENUM и справочник вместо него',
      'NOT NULL, DEFAULT, UNIQUE',
    ],
    theory: `## Основные типы MySQL

| Тип | Для чего | Пример |
|---|---|---|
| \`INT\` | Целые числа, id, ссылки | \`id INT\` |
| \`VARCHAR(n)\` | Строка до n символов | \`login VARCHAR(50)\` |
| \`TEXT\` | Длинный текст | \`review_text TEXT\` |
| \`DATE\` | Дата без времени | \`start_date DATE\` |
| \`DATETIME\` | Дата и время | \`created_at DATETIME\` |
| \`DECIMAL(10,2)\` | Деньги | \`price DECIMAL(10,2)\` |
| \`TINYINT(1)\` | Да/нет | \`is_active TINYINT(1)\` |

## VARCHAR или TEXT

\`VARCHAR(n)\` — когда есть разумный предел (логин, ФИО, телефон). \`TEXT\` — когда предела нет (отзыв, описание). У \`TEXT\` есть ограничения при индексировании, поэтому для полей, по которым ищут, берут \`VARCHAR\`.

Разумные длины для проекта: логин 50, ФИО 150, телефон 30, e-mail 150, хеш пароля 255.

## Дата: главное решение проекта

Задание требует показывать дату как ДД.ММ.ГГГГ, но **хранить её нужно типом \`DATE\`**, а не строкой:

\`\`\`sql
start_date DATE NOT NULL     -- правильно
start_date VARCHAR(10)       -- так нельзя
\`\`\`

Со строкой ломается сортировка («21.08.2026» окажется больше «14.09.2026»), не работают функции дат и нельзя отфильтровать «заявки за месяц».

Формат в базе — \`ГГГГ-ММ-ДД\`. Перевод в ДД.ММ.ГГГГ делают при выводе.

**Замечание по заданию:** в описании предметной области сказано «предпочтительное время начала конференции», а в требованиях модуля 2 — «дата в формате ДД.ММ.ГГГГ». Расхождение в самом задании. Надёжный вариант — хранить \`DATE\`, а при желании добавить отдельное поле \`start_time TIME\`.

## Деньги

\`\`\`sql
price DECIMAL(10,2)   -- правильно
price FLOAT           -- так нельзя
\`\`\`

\`FLOAT\` хранит числа приблизительно: 0.1 + 0.2 может дать 0.30000000000000004. Для денег это недопустимо.

## ENUM или справочник

\`\`\`sql
status ENUM('Новая', 'Мероприятие назначено', 'Мероприятие завершено') NOT NULL DEFAULT 'Новая'
\`\`\`

\`ENUM\` удобен: база сама не пропустит четвёртый статус. Минус — чтобы добавить значение, нужно менять структуру таблицы.

Для помещений и способов оплаты \`ENUM\` не годится: их нужно выводить в выпадающие списки, а значит, они должны быть **отдельными таблицами-справочниками**. Это прямо следует из требования модуля 2 про раскрывающиеся списки.

## Ограничения

\`\`\`sql
login VARCHAR(50) NOT NULL UNIQUE,
status VARCHAR(30) NOT NULL DEFAULT 'Новая',
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
\`\`\`

\`DEFAULT 'Новая'\` закрывает требование «изначально заявка имеет статус Новая» на уровне базы — даже если сервер забудет передать статус.`,
    examples: [
      {
        title: 'Таблица заявок с правильными типами',
        language: 'sql',
        code: `CREATE TABLE applications (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  room_id     INT NOT NULL,
  payment_id  INT NOT NULL,
  start_date  DATE NOT NULL,
  status      ENUM('Новая', 'Мероприятие назначено', 'Мероприятие завершено')
              NOT NULL DEFAULT 'Новая',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id)    REFERENCES users(id),
  FOREIGN KEY (room_id)    REFERENCES rooms(id),
  FOREIGN KEY (payment_id) REFERENCES payment_methods(id)
);`,
        explanation:
          'Три требования задания закрыты прямо в структуре: дата типом DATE, статус по умолчанию «Новая», допустимы только три значения статуса.',
      },
    ],
    mistakes: [
      {
        title: 'Дата строкой',
        wrong: 'start_date VARCHAR(10)',
        right: 'start_date DATE',
        why: 'Ломается сортировка и фильтрация по датам. Формат ДД.ММ.ГГГГ — это про вывод, а не про хранение.',
      },
      {
        title: 'Помещение строкой вместо справочника',
        wrong: "room VARCHAR(50)  -- 'Коворкинг'",
        right: 'room_id INT + таблица rooms',
        why: 'Выпадающий список нужно откуда-то заполнять, а опечатки в названиях разрушат фильтры.',
      },
      {
        title: 'FLOAT для денег',
        why: 'Приблизительное хранение даёт копеечные расхождения. Для сумм только DECIMAL.',
      },
    ],
    quizId: 'quiz-db-types',
    taskIds: [],
    resources: [
      { title: 'MySQL: типы данных', url: 'https://dev.mysql.com/doc/refman/8.0/en/data-types.html', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m1-db', 'm1-order'],
    prerequisites: ['db-relational'],
    estimatedMinutes: 45,
    planDays: ['day-13-1'],
    source: 'plan',
  },

  {
    id: 'db-relations',
    title: 'Связи 1:N и M:N, внешние ключи',
    tech: ['sql'],
    monthNo: 4,
    weekNo: 13,
    importance: 'core',
    summary:
      'Один пользователь — много заявок, одна заявка — один отзыв. Правильно расставленные связи и есть «структура базы данных» из задания.',
    mustKnow: [
      'Связь один-ко-многим и где ставить внешний ключ',
      'Связь один-к-одному',
      'Связь многие-ко-многим и связующая таблица',
      'ON DELETE CASCADE и RESTRICT',
      'Справочник против ENUM',
    ],
    theory: `## Один-ко-многим (1:N)

Самая частая связь. Один пользователь — много заявок.

**Правило: внешний ключ ставится на стороне «многих».**

\`\`\`sql
CREATE TABLE applications (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
\`\`\`

Связи проекта «Конференции.РФ»:

\`\`\`text
users            1 ──< N  applications
rooms            1 ──< N  applications
payment_methods  1 ──< N  applications
applications     1 ── 1   reviews
\`\`\`

## Один-к-одному (1:1)

У заявки не больше одного отзыва. Это делается через \`UNIQUE\` на внешнем ключе:

\`\`\`sql
CREATE TABLE reviews (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL UNIQUE,   -- UNIQUE даёт «один к одному»
  text           TEXT NOT NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);
\`\`\`

Без \`UNIQUE\` к одной заявке можно было бы добавить десять отзывов.

## Многие-ко-многим (M:N)

В проекте экзамена не нужна, но знать стоит: реализуется через третью таблицу.

\`\`\`sql
CREATE TABLE room_equipment (
  room_id      INT NOT NULL,
  equipment_id INT NOT NULL,
  PRIMARY KEY (room_id, equipment_id),
  FOREIGN KEY (room_id) REFERENCES rooms(id),
  FOREIGN KEY (equipment_id) REFERENCES equipment(id)
);
\`\`\`

Первичный ключ из двух столбцов не даст добавить одну и ту же пару дважды.

## ON DELETE

Что делать с заявками, если удалить пользователя?

| Правило | Поведение |
|---|---|
| \`RESTRICT\` (по умолчанию) | Запретить удаление, пока есть заявки |
| \`CASCADE\` | Удалить заявки вместе с пользователем |
| \`SET NULL\` | Обнулить ссылку (поле должно допускать NULL) |

Разумный выбор для проекта: у отзывов — \`CASCADE\` (нет заявки — нет отзыва), у заявок на пользователя — \`RESTRICT\` (пусть база защитит историю).

Модуль 3 прямо просит «доработать базу данных» — продуманные правила удаления как раз сюда.

## Справочники

\`\`\`sql
CREATE TABLE rooms (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO rooms (title) VALUES ('Аудитория'), ('Коворкинг'), ('Кинозал');
\`\`\`

Способы оплаты в задании не перечислены — это отсутствующая информация. Учебная программа советует придумать 2–3 разумных: наличные, банковская карта, перевод.`,
    examples: [
      {
        title: 'Схема связей проекта',
        language: 'sql',
        code: `-- Справочники
CREATE TABLE rooms (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE payment_methods (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE
);

-- Заявки: три ссылки
CREATE TABLE applications (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  room_id    INT NOT NULL,
  payment_id INT NOT NULL,
  start_date DATE NOT NULL,
  status     VARCHAR(30) NOT NULL DEFAULT 'Новая',

  FOREIGN KEY (user_id)    REFERENCES users(id)            ON DELETE RESTRICT,
  FOREIGN KEY (room_id)    REFERENCES rooms(id)            ON DELETE RESTRICT,
  FOREIGN KEY (payment_id) REFERENCES payment_methods(id)  ON DELETE RESTRICT
);

-- Отзыв: один на заявку
CREATE TABLE reviews (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL UNIQUE,
  text           TEXT NOT NULL,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);`,
      },
    ],
    mistakes: [
      {
        title: 'Внешний ключ не на той стороне',
        wrong: 'В users поле application_id',
        right: 'В applications поле user_id',
        why: 'У пользователя много заявок — одним полем их не записать. Ключ всегда на стороне «многих».',
      },
      {
        title: 'Отзыв без UNIQUE',
        why: 'К одной заявке можно будет добавить сколько угодно отзывов. UNIQUE делает связь «один к одному».',
      },
    ],
    quizId: 'quiz-db-relations',
    taskIds: ['task-sql-schema'],
    projectIds: ['project-04-db-and-queries'],
    resources: [
      { title: 'MySQL: внешние ключи', url: 'https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m1-db', 'm1-er', 'm3-db'],
    prerequisites: ['db-types'],
    estimatedMinutes: 50,
    planDays: ['day-13-2'],
    source: 'plan',
  },

  {
    id: 'db-normalization',
    title: 'Нормализация простыми словами',
    tech: ['sql'],
    monthNo: 4,
    weekNo: 13,
    importance: 'supporting',
    summary:
      'Правило одно: каждый факт хранится в одном месте. Если название помещения повторяется в каждой заявке — его пора вынести в справочник.',
    mustKnow: [
      'Одно значение в одной ячейке',
      'Никаких повторяющихся групп столбцов',
      'Данные, не зависящие от ключа, — в отдельную таблицу',
      'Когда дублирование оправдано',
      'Как проверить схему на дубли',
    ],
    theory: `## Зачем

Ненормализованная таблица выглядит удобно, пока данные не начинают расходиться:

\`\`\`text
applications
┌────┬─────────────┬─────────────┬──────────────────┐
│ id │ user_name   │ user_phone  │ room             │
├────┼─────────────┼─────────────┼──────────────────┤
│  1 │ Иванов И.И. │ +7999...    │ Коворкинг        │
│  2 │ Иванов И.И. │ +7999...    │ коворкинг        │
│  3 │ Иванов И.  │ +7999...     │ Коворкинг        │
└────┴─────────────┴─────────────┴──────────────────┘
\`\`\`

Три проблемы: имя записано по-разному, телефон нужно править в трёх местах, фильтр по помещению не сработает из-за регистра.

## Три правила

**1. Одно значение в ячейке.** Не \`phones: "+7999..., +7888..."\`, а отдельная таблица телефонов (или одно поле, если телефон один).

**2. Никаких нумерованных столбцов.** Не \`room1\`, \`room2\`, \`room3\`, а строки в связанной таблице.

**3. Данные — при своём ключе.** ФИО и телефон относятся к пользователю, а не к заявке. Значит, они живут в \`users\`, а заявка ссылается на пользователя.

Формально это первые три нормальные формы. Для экзамена важно не название, а результат: каждый факт записан один раз.

## Как проверить схему

Спросите себя: «если изменится телефон пользователя, сколько строк придётся править?» Если больше одной — данные продублированы.

## Когда дублирование оправдано

Иногда значение копируют намеренно — например, цену на момент заказа: если цена помещения изменится, старые заявки должны помнить старую сумму. Это осознанное решение, а не небрежность.

В проекте экзамена такой необходимости нет: справочников достаточно.

## Итоговая схема

\`\`\`text
users            id, login, password_hash, full_name, phone, email, role
rooms            id, title
payment_methods  id, title
applications     id, user_id, room_id, payment_id, start_date, status, created_at
reviews          id, application_id, text, created_at
\`\`\`

Пять таблиц, каждый факт в одном месте. Эта схема повторяется почти во всех вариантах экзамена — меняются только названия. Учебная программа называет её «универсальным скелетом БД», и её стоит выучить наизусть.`,
    examples: [
      {
        title: 'До и после нормализации',
        language: 'sql',
        code: `-- Было: всё в одной таблице
CREATE TABLE applications_bad (
  id         INT PRIMARY KEY,
  user_name  VARCHAR(150),   -- дублируется у каждой заявки
  user_phone VARCHAR(30),    -- дублируется
  room       VARCHAR(100),   -- дублируется, возможны опечатки
  payment    VARCHAR(100),   -- дублируется
  start_date DATE
);

-- Стало: каждый факт в одном месте
CREATE TABLE applications (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  room_id    INT NOT NULL,
  payment_id INT NOT NULL,
  start_date DATE NOT NULL,
  status     VARCHAR(30) NOT NULL DEFAULT 'Новая',
  FOREIGN KEY (user_id)    REFERENCES users(id),
  FOREIGN KEY (room_id)    REFERENCES rooms(id),
  FOREIGN KEY (payment_id) REFERENCES payment_methods(id)
);`,
        explanation:
          'После нормализации имя пользователя правится в одном месте, а фильтр по помещению работает по идентификатору — без проблем с регистром и опечатками.',
      },
    ],
    mistakes: [
      {
        title: 'Название помещения строкой в каждой заявке',
        why: 'Опечатки ломают фильтры, а выпадающий список нечем заполнять.',
      },
      {
        title: 'Разбивать на таблицы там, где это не нужно',
        why: 'Отдельная таблица для одного телефона пользователя усложняет запросы без пользы. Нормализация — инструмент, а не самоцель.',
      },
    ],
    quizId: 'quiz-db-normalization',
    taskIds: [],
    resources: [
      { title: 'metanit.com — нормализация', url: 'https://metanit.com/sql/mysql/', kind: 'tutorial', source: 'plan' },
    ],
    examRefs: ['m1-db', 'm3-db'],
    prerequisites: ['db-relations'],
    estimatedMinutes: 40,
    planDays: ['day-13-2'],
    source: 'plan',
  },

  {
    id: 'db-er-diagram',
    title: 'ER-диаграмма',
    tech: ['sql', 'design'],
    monthNo: 4,
    weekNo: 13,
    importance: 'core',
    summary:
      'Задание подчёркивает: «Особое внимание уделите созданию ER-диаграммы». Это схема сущностей, их атрибутов и связей — и её проверяют отдельно.',
    mustKnow: [
      'Сущность, атрибут, связь',
      'Обозначение «воронья лапка»',
      'Первичный и внешний ключ на схеме',
      'Reverse Engineer в MySQL Workbench',
      'Что сохранить в репозиторий',
    ],
    theory: `## Что это

ER-диаграмма (Entity-Relationship) показывает:

- **сущности** — прямоугольники (таблицы);
- **атрибуты** — строки внутри прямоугольника (столбцы);
- **связи** — линии между сущностями;
- **тип связи** — символ на конце линии.

## Воронья лапка

| Символ | Значение |
|---|---|
| Одна черта | Ровно один |
| «Лапка» (три черты) | Много |
| Кружок | Ноль возможен |

Связь «один пользователь — много заявок» рисуется так: у \`users\` одна черта, у \`applications\` — лапка.

## Диаграмма проекта

\`\`\`text
┌──────────────┐            ┌────────────────────┐
│ users        │1          ∞│ applications       │
│──────────────│────────────│────────────────────│
│ PK id        │            │ PK id              │
│ login (UQ)   │            │ FK user_id         │
│ password_hash│            │ FK room_id         │
│ full_name    │            │ FK payment_id      │
│ phone        │            │ start_date         │
│ email        │            │ status             │
│ role         │            │ created_at         │
└──────────────┘            └────────────────────┘
                              1│              ∞│
                               │               │
                    ┌──────────┴───┐   ┌───────┴──────────┐
                    │ reviews      │   │ rooms            │
                    │──────────────│   │──────────────────│
                    │ PK id        │   │ PK id            │
                    │ FK app_id UQ │   │ title (UQ)       │
                    │ text         │   └──────────────────┘
                    └──────────────┘
                                        ┌──────────────────┐
                                        │ payment_methods  │
                                        │ PK id, title(UQ) │
                                        └──────────────────┘
\`\`\`

## Как сделать быстро

**Способ 1 — из готовой базы (быстрее всего).** В MySQL Workbench: Database → Reverse Engineer, выбрать схему. Диаграмма строится автоматически за минуту. Дальше — File → Export → PNG.

**Способ 2 — руками.** Workbench: File → New Model → Add Diagram. Или draw.io, если Workbench недоступен.

Порядок работы, который экономит время на экзамене: сначала пишете \`schema.sql\`, выполняете его, потом делаете Reverse Engineer. Так диаграмма гарантированно совпадает с реальной базой.

## Что положить в репозиторий

\`\`\`text
database/
├── schema.sql        структура таблиц
├── seed.sql          тестовые данные (включая администратора)
└── er-diagram.png    картинка диаграммы
\`\`\`

Картинка обязательна: проверяющий должен увидеть диаграмму, не устанавливая Workbench.

## Автоматическая проверка

Платформа не может проверить картинку — это честное ограничение. Зато она проверяет **саму схему**: задания на SQL выполняют ваш \`CREATE TABLE\` и сверяют таблицы, типы, ключи и связи. Если схема правильная, диаграмма из неё строится автоматически.`,
    examples: [
      {
        title: 'Порядок работы на экзамене',
        language: 'text',
        code: `1. Выписать сущности из текста задания (существительные)
   пользователь, помещение, способ оплаты, заявка, отзыв

2. Написать schema.sql целиком

3. Выполнить его в Workbench:
   mysql> SOURCE database/schema.sql;

4. Database → Reverse Engineer → выбрать схему → Next до конца

5. Расставить прямоугольники так, чтобы линии не пересекались

6. File → Export → Export as PNG → database/er-diagram.png

7. git add database/ && git commit -m "БД: схема и ER-диаграмма"`,
        explanation:
          'Весь путь занимает 10–15 минут при готовой схеме. Рисовать диаграмму руками до написания SQL — дольше и рискованнее: схема потом изменится.',
      },
    ],
    mistakes: [
      {
        title: 'Не сохранить картинку в репозиторий',
        why: 'Файл модели Workbench проверяющий может не открыть. PNG видно сразу.',
      },
      {
        title: 'Диаграмма не совпадает с реальной базой',
        why: 'Схему меняли, а диаграмму не перестроили. Reverse Engineer решает это за минуту.',
      },
      {
        title: 'Рисовать диаграмму до написания схемы',
        why: 'Схема почти всегда меняется по ходу. Быстрее наоборот: SQL → база → диаграмма.',
      },
    ],
    quizId: 'quiz-db-er',
    taskIds: [],
    resources: [
      { title: 'MySQL Workbench: Reverse Engineering', url: 'https://dev.mysql.com/doc/workbench/en/wb-reverse-engineering.html', kind: 'docs', source: 'docs' },
      { title: 'draw.io', url: 'https://app.diagrams.net/', kind: 'practice', source: 'plan' },
    ],
    examRefs: ['m1-er'],
    prerequisites: ['db-relations'],
    estimatedMinutes: 45,
    planDays: ['day-13-3'],
    source: 'plan',
  },

  {
    id: 'sql-create-table',
    title: 'CREATE TABLE: схема проекта целиком',
    tech: ['sql'],
    monthNo: 4,
    weekNo: 13,
    importance: 'core',
    summary:
      'Файл schema.sql — первое, что пишется на экзамене. Пять таблиц, ключи, ограничения и правильный порядок создания.',
    mustKnow: [
      'Синтаксис CREATE TABLE',
      'PRIMARY KEY, NOT NULL, UNIQUE, DEFAULT',
      'FOREIGN KEY ... REFERENCES',
      'Порядок создания таблиц',
      'DROP TABLE IF EXISTS для повторного запуска',
    ],
    theory: `## Синтаксис

\`\`\`sql
CREATE TABLE имя (
  столбец тип ограничения,
  ...
  FOREIGN KEY (столбец) REFERENCES другая_таблица(столбец)
);
\`\`\`

## Ограничения

| Ограничение | Что делает |
|---|---|
| \`PRIMARY KEY\` | Первичный ключ |
| \`AUTO_INCREMENT\` | Номер выдаёт база |
| \`NOT NULL\` | Значение обязательно |
| \`UNIQUE\` | Значение не повторяется |
| \`DEFAULT x\` | Значение по умолчанию |
| \`CHECK (условие)\` | Проверка значения |

## Порядок создания

Сначала таблицы без ссылок, потом те, кто ссылается:

\`\`\`text
1. users, rooms, payment_methods     (независимые)
2. applications                       (ссылается на три предыдущие)
3. reviews                            (ссылается на applications)
\`\`\`

Если нарушить порядок, база ответит ошибкой: «таблица, на которую ссылаетесь, не существует».

## Повторный запуск

Во время работы схему приходится пересоздавать. Добавьте в начало файла:

\`\`\`sql
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS payment_methods;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS users;
\`\`\`

Порядок удаления — **обратный** порядку создания: сначала те, кто ссылается.

## Запуск файла

\`\`\`bash
mysql -u root -p conference < database/schema.sql
\`\`\`

Или в консоли MySQL: \`SOURCE database/schema.sql;\`

## Заготовка на экзамен

Учебная программа предлагает довести схему до автоматизма: к неделе 24 вы должны писать её по памяти за 10–15 минут. Структура одинакова почти во всех вариантах — меняются названия справочников и полей.`,
    examples: [
      {
        title: 'Полный schema.sql проекта',
        language: 'sql',
        code: `DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS payment_methods;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  login         VARCHAR(50)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(150) NOT NULL,
  phone         VARCHAR(30)  NOT NULL,
  email         VARCHAR(150) NOT NULL,
  role          VARCHAR(10)  NOT NULL DEFAULT 'user',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE payment_methods (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE applications (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  room_id    INT NOT NULL,
  payment_id INT NOT NULL,
  start_date DATE NOT NULL,
  status     VARCHAR(30) NOT NULL DEFAULT 'Новая',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id)    REFERENCES users(id),
  FOREIGN KEY (room_id)    REFERENCES rooms(id),
  FOREIGN KEY (payment_id) REFERENCES payment_methods(id)
);

CREATE TABLE reviews (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL UNIQUE,
  text           TEXT NOT NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

INSERT INTO rooms (title) VALUES ('Аудитория'), ('Коворкинг'), ('Кинозал');
INSERT INTO payment_methods (title) VALUES ('Наличные'), ('Банковская карта'), ('Перевод');`,
        explanation:
          'Справочники заполняются сразу: помещения взяты из задания дословно, способы оплаты в задании не указаны — это решение разработчика, о чём стоит упомянуть проверяющему.',
      },
    ],
    mistakes: [
      {
        title: 'Создавать таблицы в неправильном порядке',
        why: 'Внешний ключ ссылается на таблицу, которой ещё нет. Сначала независимые таблицы.',
      },
      {
        title: 'Забыть UNIQUE на логине',
        why: 'Требование задания «логин должен быть уникальным» проверяется в том числе на уровне базы.',
      },
      {
        title: 'Нет DEFAULT для статуса',
        why: '«Изначально заявка имеет статус Новая» — база может гарантировать это сама.',
      },
    ],
    quizId: 'quiz-sql-create',
    taskIds: ['task-sql-schema'],
    projectIds: ['project-04-db-and-queries'],
    resources: [
      { title: 'MySQL: CREATE TABLE', url: 'https://dev.mysql.com/doc/refman/8.0/en/create-table.html', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m1-db', 'm3-db'],
    prerequisites: ['db-relations', 'db-types'],
    estimatedMinutes: 55,
    planDays: ['day-13-4'],
    source: 'plan',
  },

  {
    id: 'sql-select',
    title: 'SELECT, WHERE, ORDER BY, LIMIT',
    tech: ['sql'],
    monthNo: 4,
    weekNo: 13,
    importance: 'core',
    summary:
      'Выборка данных — самый частый запрос приложения. Список заявок, фильтр по статусу, сортировка по дате и постраничная навигация делаются одним запросом.',
    mustKnow: [
      'SELECT столбцы FROM таблица',
      'WHERE с AND, OR, IN, LIKE, BETWEEN',
      'ORDER BY ASC и DESC',
      'LIMIT и OFFSET для страниц',
      'COUNT(*) для числа записей',
    ],
    theory: `## Основа

\`\`\`sql
SELECT id, start_date, status FROM applications;
SELECT * FROM rooms;
\`\`\`

Звёздочка удобна при отладке, но в коде приложения лучше перечислять столбцы: так вы не отправите клиенту лишнее (например, хеш пароля).

## WHERE

\`\`\`sql
SELECT * FROM applications WHERE status = 'Новая';
SELECT * FROM applications WHERE user_id = 3 AND status = 'Новая';
SELECT * FROM applications WHERE status IN ('Новая', 'Мероприятие назначено');
SELECT * FROM applications WHERE start_date BETWEEN '2026-09-01' AND '2026-09-30';
SELECT * FROM users WHERE full_name LIKE '%Иванов%';
SELECT * FROM reviews WHERE text IS NOT NULL;
\`\`\`

В \`LIKE\` символ \`%\` означает «любое количество любых символов».

## ORDER BY

\`\`\`sql
SELECT * FROM applications ORDER BY start_date;         -- по возрастанию
SELECT * FROM applications ORDER BY start_date DESC;    -- по убыванию
SELECT * FROM applications ORDER BY status, start_date DESC;
\`\`\`

## LIMIT и OFFSET — страницы

\`\`\`sql
SELECT * FROM applications ORDER BY start_date LIMIT 5;             -- первые 5
SELECT * FROM applications ORDER BY start_date LIMIT 5 OFFSET 5;    -- вторая страница
SELECT * FROM applications ORDER BY start_date LIMIT 5 OFFSET 10;   -- третья
\`\`\`

Формула: \`OFFSET = (номер_страницы - 1) * размер\`.

**Важно:** без \`ORDER BY\` порядок строк не гарантирован, и на разных страницах могут встретиться одни и те же записи. Пагинация всегда идёт вместе с сортировкой.

## COUNT

\`\`\`sql
SELECT COUNT(*) AS total FROM applications;
SELECT COUNT(*) AS total FROM applications WHERE status = 'Новая';
\`\`\`

Для постраничной навигации нужно знать общее число записей — отсюда берётся количество страниц.

## Псевдонимы

\`\`\`sql
SELECT a.id, a.start_date AS date, r.title AS room
FROM applications AS a
JOIN rooms AS r ON r.id = a.room_id;
\`\`\`

Псевдонимы сокращают запись и дают понятные имена полей в ответе сервера.

## Серверная пагинация

Учебная программа предлагает сначала делать фильтр и страницы на клиенте (неделя 18), а на неделе 23 — перенести на сервер. Серверный вариант правильнее: не нужно передавать все записи.

**Важно про безопасность:** имя столбца для сортировки нельзя подставлять из запроса напрямую — только через белый список.

\`\`\`js
const ALLOWED_SORT = { date: 'a.start_date', status: 'a.status' };
const column = ALLOWED_SORT[req.query.sort] ?? 'a.start_date';
\`\`\``,
    examples: [
      {
        title: 'Запросы проекта',
        language: 'sql',
        code: `-- Мои заявки, новые сверху
SELECT * FROM applications
WHERE user_id = 3
ORDER BY start_date DESC;

-- Вторая страница админки по 5 записей
SELECT * FROM applications
ORDER BY start_date
LIMIT 5 OFFSET 5;

-- Сколько заявок в каждом статусе
SELECT status, COUNT(*) AS total
FROM applications
GROUP BY status;

-- Занят ли логин (один запрос вместо выборки всех пользователей)
SELECT COUNT(*) AS taken FROM users WHERE login = 'ivanov26';`,
      },
    ],
    mistakes: [
      {
        title: 'LIMIT без ORDER BY',
        why: 'Порядок строк не гарантирован: на второй странице могут оказаться те же записи, что и на первой.',
      },
      {
        title: 'SELECT * в коде приложения',
        why: 'Клиенту уйдут все поля, включая хеш пароля. Перечисляйте столбцы явно.',
      },
      {
        title: 'Подставлять имя столбца сортировки из запроса',
        why: 'Прямой путь к SQL-инъекции. Только белый список допустимых значений.',
      },
    ],
    quizId: 'quiz-sql-select',
    taskIds: ['task-sql-select'],
    resources: [
      { title: 'sql-academy.org — тренажёр', url: 'https://sql-academy.org/ru', kind: 'practice', source: 'plan' },
    ],
    examRefs: ['m1-cabinet', 'm2-admin-tools'],
    prerequisites: ['sql-create-table'],
    estimatedMinutes: 50,
    planDays: ['day-13-5'],
    source: 'plan',
  },

  {
    id: 'sql-insert',
    title: 'INSERT: добавление данных',
    tech: ['sql'],
    monthNo: 4,
    weekNo: 13,
    importance: 'core',
    summary:
      'Регистрация и создание заявки — это INSERT. Параметры обязательно передаются через знаки вопроса, иначе в приложении появляется SQL-инъекция.',
    mustKnow: [
      'INSERT INTO ... VALUES',
      'Вставка нескольких строк сразу',
      'Как получить id созданной записи',
      'Параметры вместо склейки строк',
      'Поля со значением по умолчанию можно не указывать',
    ],
    theory: `## Синтаксис

\`\`\`sql
INSERT INTO rooms (title) VALUES ('Аудитория');

INSERT INTO rooms (title) VALUES ('Аудитория'), ('Коворкинг'), ('Кинозал');

INSERT INTO applications (user_id, room_id, payment_id, start_date)
VALUES (3, 2, 1, '2026-09-14');
\`\`\`

В последнем примере \`status\` не указан — база подставит \`DEFAULT 'Новая'\`. Это ровно то, чего требует задание: «Изначально заявка имеет статус Новая».

## Из приложения

\`\`\`js
const [result] = await pool.execute(
  'INSERT INTO applications (user_id, room_id, payment_id, start_date) VALUES (?, ?, ?, ?)',
  [userId, roomId, paymentId, startDate],
);

const newId = result.insertId;   // id созданной записи
\`\`\`

\`insertId\` нужен, чтобы вернуть клиенту созданную заявку.

## Параметры обязательны

\`\`\`js
// НЕЛЬЗЯ: склейка строк
await pool.query(\`SELECT * FROM users WHERE login = '\${login}'\`);

// НУЖНО: параметры
await pool.execute('SELECT * FROM users WHERE login = ?', [login]);
\`\`\`

Почему это критично. Если пользователь введёт логин \`' OR '1'='1\`, первый вариант превратится в:

\`\`\`sql
SELECT * FROM users WHERE login = '' OR '1'='1'
\`\`\`

Запрос вернёт всех пользователей. Это SQL-инъекция — классическая уязвимость, и критерий «высокое качество программного кода» на экзамене включает защиту от неё.

При использовании \`?\` база получает запрос и данные отдельно: значение никогда не становится частью команды.

## Формат даты

В базу дата уходит как \`ГГГГ-ММ-ДД\`. Если пользователь ввёл \`14.09.2026\`, переведите перед вставкой — на сервере, а не в базе.

## Регистрация

\`\`\`js
const hash = await bcrypt.hash(password, 10);

await pool.execute(
  'INSERT INTO users (login, password_hash, full_name, phone, email) VALUES (?, ?, ?, ?, ?)',
  [login, hash, fullName, phone, email],
);
\`\`\`

Если логин занят, база вернёт ошибку с кодом \`ER_DUP_ENTRY\` — её ловят и отвечают статусом 409.`,
    examples: [
      {
        title: 'Создание заявки с проверками',
        language: 'javascript',
        code: `router.post('/applications', requireAuth, async (req, res) => {
  const { roomId, paymentId, date } = req.body;

  // 1. Проверка на сервере — не доверяем клиенту
  if (!roomId || !paymentId || !date) {
    return res.status(400).json({ error: 'Заполните все поля' });
  }

  const startDate = fromRuDate(date);           // '14.09.2026' -> '2026-09-14'
  if (!startDate) {
    return res.status(400).json({ error: 'Некорректная дата' });
  }

  try {
    const [result] = await pool.execute(
      \`INSERT INTO applications (user_id, room_id, payment_id, start_date)
       VALUES (?, ?, ?, ?)\`,
      [req.user.id, roomId, paymentId, startDate],
    );

    const [rows] = await pool.execute('SELECT * FROM applications WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Не удалось создать заявку' });
  }
});`,
        explanation:
          'Статус не передаётся — его ставит база значением по умолчанию. Пользователь берётся из токена, а не из тела запроса: иначе можно было бы создать заявку от чужого имени.',
      },
    ],
    mistakes: [
      {
        title: 'Склейка SQL из строк',
        wrong: "pool.query(`... WHERE login = '${login}'`)",
        right: "pool.execute('... WHERE login = ?', [login])",
        why: 'SQL-инъекция. Это первое, что проверяют в критерии качества кода.',
      },
      {
        title: 'Брать user_id из тела запроса',
        why: 'Клиент может подставить чужой идентификатор. Пользователь берётся из проверенного токена.',
      },
      {
        title: 'Вставлять дату в формате ДД.ММ.ГГГГ',
        why: 'MySQL ждёт ГГГГ-ММ-ДД. Иначе получите нулевую дату или ошибку.',
      },
    ],
    quizId: 'quiz-sql-insert',
    taskIds: ['task-sql-insert'],
    resources: [
      { title: 'MySQL: INSERT', url: 'https://dev.mysql.com/doc/refman/8.0/en/insert.html', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m1-register', 'm1-order', 'm3-quality'],
    prerequisites: ['sql-select'],
    estimatedMinutes: 45,
    planDays: ['day-13-5'],
    source: 'plan',
  },

  {
    id: 'sql-update',
    title: 'UPDATE и DELETE — всегда с WHERE',
    tech: ['sql'],
    monthNo: 4,
    weekNo: 13,
    importance: 'core',
    summary:
      'Смена статуса заявки администратором — это UPDATE. Забытый WHERE меняет всю таблицу: правило «сначала пишем WHERE» стоит довести до автоматизма.',
    mustKnow: [
      'UPDATE ... SET ... WHERE',
      'DELETE FROM ... WHERE',
      'Проверка affectedRows',
      'Белый список допустимых статусов',
      'Мягкое удаление вместо DELETE',
    ],
    theory: `## UPDATE

\`\`\`sql
UPDATE applications SET status = 'Мероприятие назначено' WHERE id = 5;
\`\`\`

**Без \`WHERE\` изменятся все строки таблицы.** Привычка, которая спасает: сначала напишите \`WHERE\`, потом вернитесь к \`SET\`.

Полезный приём перед опасным запросом — заменить \`UPDATE ... SET\` на \`SELECT *\` с тем же \`WHERE\` и посмотреть, какие строки попадут под изменение.

## DELETE

\`\`\`sql
DELETE FROM reviews WHERE id = 3;
\`\`\`

Те же правила. На экзамене удаление обычно не требуется, но оно часто нужно при отладке.

## Проверка результата

\`\`\`js
const [result] = await pool.execute(
  'UPDATE applications SET status = ? WHERE id = ?',
  [status, id],
);

if (result.affectedRows === 0) {
  return res.status(404).json({ error: 'Заявка не найдена' });
}
\`\`\`

\`affectedRows\` показывает, сколько строк изменилось. Ноль означает, что записи с таким id нет — клиенту нужно ответить 404, а не «успешно».

## Белый список статусов

Задание разрешает ровно два перехода: «Мероприятие назначено» и «Мероприятие завершено». Сервер обязан это проверять:

\`\`\`js
const ALLOWED = ['Мероприятие назначено', 'Мероприятие завершено'];

if (!ALLOWED.includes(status)) {
  return res.status(400).json({ error: 'Недопустимый статус' });
}
\`\`\`

Выпадающий список на клиенте — удобство. Запрос можно отправить и в обход интерфейса.

## «Это твоя заявка?»

Для действий обычного пользователя проверка принадлежности встраивается прямо в запрос:

\`\`\`js
await pool.execute(
  'UPDATE applications SET status = ? WHERE id = ? AND user_id = ?',
  [status, id, req.user.id],
);
\`\`\`

Если заявка чужая, \`affectedRows\` будет нулём — и чужие данные останутся нетронутыми.

## Мягкое удаление

Вместо физического удаления часто ставят признак:

\`\`\`sql
ALTER TABLE applications ADD COLUMN is_deleted TINYINT(1) NOT NULL DEFAULT 0;
UPDATE applications SET is_deleted = 1 WHERE id = 5;
\`\`\`

История сохраняется, а из выборок такие записи исключают условием \`WHERE is_deleted = 0\`.`,
    examples: [
      {
        title: 'Смена статуса администратором',
        language: 'javascript',
        code: `const ALLOWED_STATUSES = ['Мероприятие назначено', 'Мероприятие завершено'];

router.patch('/admin/applications/:id', requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Некорректный идентификатор' });
  }

  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Недопустимый статус' });
  }

  try {
    const [result] = await pool.execute(
      'UPDATE applications SET status = ? WHERE id = ?',
      [status, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    const [rows] = await pool.execute('SELECT * FROM applications WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Не удалось изменить статус' });
  }
});`,
        explanation:
          'Три уровня защиты: middleware проверяет токен и роль, белый список — значение статуса, affectedRows — существование заявки.',
      },
    ],
    mistakes: [
      {
        title: 'UPDATE без WHERE',
        wrong: "UPDATE applications SET status = 'Новая';",
        right: "UPDATE applications SET status = 'Новая' WHERE id = 5;",
        why: 'Изменятся все строки таблицы. Восстановить можно только из резервной копии.',
      },
      {
        title: 'Принимать любой статус от клиента',
        why: 'Задание допускает ровно два перехода. Без белого списка в базе окажется что угодно.',
      },
      {
        title: 'Не проверять affectedRows',
        why: 'Клиент получит «успешно» на несуществующую заявку и не поймёт, почему ничего не изменилось.',
      },
    ],
    quizId: 'quiz-sql-update',
    taskIds: ['task-sql-update', 'task-fs-admin-status'],
    resources: [
      { title: 'MySQL: UPDATE', url: 'https://dev.mysql.com/doc/refman/8.0/en/update.html', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m1-admin', 'm3-quality'],
    prerequisites: ['sql-insert'],
    estimatedMinutes: 45,
    planDays: ['day-13-6'],
    source: 'plan',
  },

  {
    id: 'sql-join',
    title: 'JOIN: данные из нескольких таблиц',
    tech: ['sql'],
    monthNo: 4,
    weekNo: 14,
    importance: 'core',
    summary:
      'В таблице заявок лежат идентификаторы, а показать нужно ФИО, название помещения и способ оплаты. JOIN соединяет таблицы в одном запросе.',
    mustKnow: [
      'INNER JOIN и условие ON',
      'LEFT JOIN и зачем он нужен',
      'Псевдонимы таблиц',
      'Несколько JOIN в одном запросе',
      'Почему JOIN лучше нескольких запросов',
    ],
    theory: `## INNER JOIN

\`\`\`sql
SELECT a.id, a.start_date, a.status, r.title AS room
FROM applications AS a
INNER JOIN rooms AS r ON r.id = a.room_id;
\`\`\`

Читается так: «возьми заявки, к каждой подставь помещение, у которого id совпадает с room_id».

\`INNER JOIN\` (можно писать просто \`JOIN\`) оставляет только строки, у которых есть пара. Если у заявки нет помещения, она в результат не попадёт.

## Несколько соединений

Запрос админки из задания — ФИО, телефон, помещение, дата, оплата, статус:

\`\`\`sql
SELECT
  a.id,
  u.full_name,
  u.phone,
  r.title  AS room,
  p.title  AS payment,
  a.start_date,
  a.status
FROM applications AS a
JOIN users           AS u ON u.id = a.user_id
JOIN rooms           AS r ON r.id = a.room_id
JOIN payment_methods AS p ON p.id = a.payment_id
ORDER BY a.start_date DESC;
\`\`\`

Один запрос вместо четырёх — и клиент сразу получает готовые данные для таблицы.

## LEFT JOIN

\`\`\`sql
SELECT a.id, a.status, rv.text AS review
FROM applications AS a
LEFT JOIN reviews AS rv ON rv.application_id = a.id;
\`\`\`

\`LEFT JOIN\` оставляет **все** строки левой таблицы. Если отзыва нет, в поле будет \`NULL\`.

Разница принципиальна: с \`INNER JOIN\` заявки без отзывов просто исчезли бы из списка — а в кабинете их нужно показать все.

## Правило выбора

| Нужно | JOIN |
|---|---|
| Связь обязательна (у заявки всегда есть помещение) | \`INNER JOIN\` |
| Связь может отсутствовать (отзыв может не быть) | \`LEFT JOIN\` |

## Почему не несколько запросов

\`\`\`js
// плохо: N+1 запрос
const applications = await getApplications();
for (const app of applications) {
  app.room = await getRoom(app.room_id);   // отдельный запрос на каждую строку
}
\`\`\`

Для 50 заявок это 51 запрос вместо одного. Такой антипаттерн называется «N+1» и заметно бьёт по скорости.

## Псевдонимы обязательны

Когда таблиц несколько, столбцы с одинаковыми именами (например, \`id\` и \`title\`) нужно различать. Псевдоним \`AS\` делает и запрос короче, и результат понятнее.`,
    examples: [
      {
        title: 'Кабинет: мои заявки с отзывами',
        language: 'sql',
        code: `SELECT
  a.id,
  r.title  AS room,
  p.title  AS payment,
  a.start_date,
  a.status,
  rv.text  AS review_text
FROM applications AS a
JOIN rooms           AS r  ON r.id = a.room_id
JOIN payment_methods AS p  ON p.id = a.payment_id
LEFT JOIN reviews    AS rv ON rv.application_id = a.id
WHERE a.user_id = ?
ORDER BY a.start_date DESC;`,
        explanation:
          'LEFT JOIN на отзывах обязателен: заявки без отзыва должны остаться в списке. Фильтр по user_id гарантирует, что пользователь видит только свои заявки.',
      },
    ],
    mistakes: [
      {
        title: 'INNER JOIN там, где нужен LEFT',
        why: 'Заявки без отзывов пропадут из кабинета — и пользователь решит, что данные потерялись.',
      },
      {
        title: 'Запрос в цикле вместо JOIN',
        why: 'Проблема N+1: вместо одного запроса база получает пятьдесят. На экзамене это заметно в критерии качества кода.',
      },
      {
        title: 'Забыть условие ON',
        why: 'Без ON база соединит каждую строку с каждой (декартово произведение) — результат будет огромным и бессмысленным.',
      },
    ],
    quizId: 'quiz-sql-join',
    taskIds: ['task-sql-join', 'task-fs-cabinet-query'],
    projectIds: ['project-04-db-and-queries'],
    resources: [
      { title: 'MySQL: JOIN', url: 'https://dev.mysql.com/doc/refman/8.0/en/join.html', kind: 'docs', source: 'docs' },
      { title: 'sql-academy.org', url: 'https://sql-academy.org/ru', kind: 'practice', source: 'plan' },
    ],
    examRefs: ['m1-cabinet', 'm1-admin'],
    prerequisites: ['sql-select'],
    estimatedMinutes: 50,
    planDays: ['day-14-1'],
    source: 'plan',
  },

  {
    id: 'sql-aggregate',
    title: 'GROUP BY и агрегатные функции',
    tech: ['sql'],
    monthNo: 4,
    weekNo: 14,
    importance: 'supporting',
    summary:
      'Сколько заявок в каждом статусе, сколько бронирований у помещения — такие сводки считает база, а не приложение.',
    mustKnow: [
      'COUNT, SUM, AVG, MIN, MAX',
      'GROUP BY и правило выбора столбцов',
      'HAVING против WHERE',
      'COUNT(*) и COUNT(столбец) — разница',
      'Сводки для панели администратора',
    ],
    theory: `## Агрегатные функции

\`\`\`sql
SELECT COUNT(*) FROM applications;
SELECT MIN(start_date), MAX(start_date) FROM applications;
SELECT AVG(price) FROM rooms;
\`\`\`

## GROUP BY

\`\`\`sql
SELECT status, COUNT(*) AS total
FROM applications
GROUP BY status;
\`\`\`

Результат:

\`\`\`text
status                   total
Новая                        7
Мероприятие назначено        3
Мероприятие завершено        5
\`\`\`

**Правило:** в \`SELECT\` можно ставить только столбцы из \`GROUP BY\` и агрегатные функции. Иначе база либо выдаст ошибку, либо вернёт произвольное значение.

## WHERE или HAVING

\`\`\`sql
SELECT room_id, COUNT(*) AS total
FROM applications
WHERE start_date >= '2026-09-01'    -- фильтр СТРОК до группировки
GROUP BY room_id
HAVING COUNT(*) > 3;                -- фильтр ГРУПП после группировки
\`\`\`

\`WHERE\` отсеивает строки до объединения в группы, \`HAVING\` — готовые группы. Агрегатную функцию в \`WHERE\` использовать нельзя.

## COUNT(*) против COUNT(столбец)

\`\`\`sql
SELECT COUNT(*) FROM applications;          -- все строки
SELECT COUNT(review_id) FROM applications;  -- только те, где значение не NULL
\`\`\`

Разница важна при подсчёте заполненных полей.

## Сводка с соединением

\`\`\`sql
SELECT r.title AS room, COUNT(a.id) AS total
FROM rooms AS r
LEFT JOIN applications AS a ON a.room_id = r.id
GROUP BY r.id, r.title
ORDER BY total DESC;
\`\`\`

\`LEFT JOIN\` здесь нужен, чтобы помещения без заявок тоже попали в отчёт со значением 0.

## Когда считать в базе, а когда в приложении

База считает быстрее и передаёт меньше данных. Но если записей немного и они уже загружены на клиент (например, 30 заявок в админке), считать счётчики в JavaScript через \`reduce\` вполне нормально.

Правило: сводки по всей таблице — в базе, счётчики по уже загруженной странице — на клиенте.`,
    examples: [
      {
        title: 'Сводка для панели администратора',
        language: 'sql',
        code: `-- Заявок по статусам
SELECT status, COUNT(*) AS total
FROM applications
GROUP BY status;

-- Популярность помещений
SELECT r.title AS room, COUNT(a.id) AS total
FROM rooms AS r
LEFT JOIN applications AS a ON a.room_id = r.id
GROUP BY r.id, r.title
ORDER BY total DESC;

-- Активные пользователи: больше двух заявок
SELECT u.full_name, COUNT(a.id) AS total
FROM users AS u
JOIN applications AS a ON a.user_id = u.id
GROUP BY u.id, u.full_name
HAVING COUNT(a.id) > 2
ORDER BY total DESC;`,
      },
    ],
    mistakes: [
      {
        title: 'Столбец в SELECT не из GROUP BY',
        wrong: 'SELECT status, start_date, COUNT(*) FROM applications GROUP BY status;',
        right: 'SELECT status, COUNT(*) FROM applications GROUP BY status;',
        why: 'Внутри группы у start_date много разных значений — непонятно, какое показывать.',
      },
      {
        title: 'Агрегатная функция в WHERE',
        wrong: 'WHERE COUNT(*) > 3',
        right: 'HAVING COUNT(*) > 3',
        why: 'WHERE работает до группировки, когда групп ещё нет.',
      },
    ],
    quizId: 'quiz-sql-aggregate',
    taskIds: ['task-sql-aggregate'],
    projectIds: ['project-04-db-and-queries'],
    resources: [
      { title: 'MySQL: GROUP BY', url: 'https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m2-admin-tools'],
    prerequisites: ['sql-join'],
    estimatedMinutes: 45,
    planDays: ['day-14-2'],
    source: 'plan',
  },

  {
    id: 'sql-dates',
    title: 'Работа с датами в SQL',
    tech: ['sql'],
    monthNo: 4,
    weekNo: 14,
    importance: 'supporting',
    summary:
      'База хранит дату типом DATE, а показать нужно ДД.ММ.ГГГГ. Форматировать можно и в SQL, и на сервере — важно выбрать одно место и держаться его.',
    mustKnow: [
      'DATE_FORMAT и маски %d.%m.%Y',
      'CURDATE() и NOW()',
      'Сравнение дат и BETWEEN',
      'DATEDIFF и DATE_ADD',
      'Где лучше форматировать: в базе или на сервере',
    ],
    theory: `## Формат вывода

\`\`\`sql
SELECT DATE_FORMAT(start_date, '%d.%m.%Y') AS date FROM applications;
-- '14.09.2026'
\`\`\`

Основные маски: \`%d\` — день, \`%m\` — месяц, \`%Y\` — год из четырёх цифр, \`%H:%i\` — часы и минуты.

## Текущая дата

\`\`\`sql
SELECT CURDATE();    -- 2026-09-14
SELECT NOW();        -- 2026-09-14 10:23:45
\`\`\`

## Сравнение и диапазоны

\`\`\`sql
SELECT * FROM applications WHERE start_date >= CURDATE();
SELECT * FROM applications WHERE start_date BETWEEN '2026-09-01' AND '2026-09-30';
SELECT * FROM applications WHERE YEAR(start_date) = 2026 AND MONTH(start_date) = 9;
\`\`\`

Последний вариант работает, но медленнее: функция над столбцом мешает базе использовать индекс. Для больших таблиц лучше \`BETWEEN\`.

## Арифметика

\`\`\`sql
SELECT DATEDIFF(start_date, CURDATE()) AS days_left FROM applications;
SELECT DATE_ADD(start_date, INTERVAL 7 DAY) FROM applications;
\`\`\`

## Где форматировать

Два подхода:

**В SQL** — запрос сразу возвращает готовую строку. Меньше кода на сервере, но формат «зашит» в запрос.

**На сервере** — база отдаёт \`ГГГГ-ММ-ДД\`, а сервер или клиент переводит. Гибче: тот же ответ можно использовать и для сортировки, и для вывода.

Практичный вариант для экзамена — **форматировать на клиенте**, а из базы всегда получать \`ГГГГ-ММ-ДД\`. Тогда сортировка в React работает простым сравнением строк, а формат ДД.ММ.ГГГГ получается одной функцией.

## Тонкость с mysql2

Драйвер \`mysql2\` возвращает столбцы типа \`DATE\` объектами \`Date\` JavaScript, а не строками. Это приводит к сдвигу на день из-за часового пояса. Два решения:

\`\`\`js
// 1. Форматировать в запросе
SELECT DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date FROM applications;

// 2. Настроить пул
const pool = mysql.createPool({ ..., dateStrings: true });
\`\`\`

Второй вариант удобнее: все даты приходят строками в формате \`ГГГГ-ММ-ДД\`.`,
    examples: [
      {
        title: 'Запросы с датами',
        language: 'sql',
        code: `-- Ближайшие конференции
SELECT id, DATE_FORMAT(start_date, '%d.%m.%Y') AS date, status
FROM applications
WHERE start_date >= CURDATE()
ORDER BY start_date;

-- Заявки за сентябрь 2026
SELECT COUNT(*) AS total
FROM applications
WHERE start_date BETWEEN '2026-09-01' AND '2026-09-30';

-- Сколько дней осталось
SELECT id, DATEDIFF(start_date, CURDATE()) AS days_left
FROM applications
WHERE status = 'Мероприятие назначено';`,
      },
    ],
    mistakes: [
      {
        title: 'Хранить дату строкой ради формата вывода',
        why: 'Ломаются сортировка, сравнение и функции дат. Формат — задача вывода, а не хранения.',
      },
      {
        title: 'Сдвиг даты на день',
        why: 'mysql2 превращает DATE в объект Date с учётом часового пояса. Лечится настройкой dateStrings: true.',
      },
    ],
    quizId: 'quiz-sql-dates',
    taskIds: [],
    resources: [
      { title: 'MySQL: функции даты', url: 'https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m2-order-form'],
    prerequisites: ['sql-select'],
    estimatedMinutes: 40,
    planDays: ['day-14-3'],
    source: 'plan',
  },

  {
    id: 'db-dump',
    title: 'Дамп базы и восстановление',
    tech: ['sql', 'tools'],
    monthNo: 4,
    weekNo: 14,
    importance: 'supporting',
    summary:
      'Дамп — это текстовый файл со всей базой. Он позволяет восстановить схему за секунды и положить работу в репозиторий.',
    mustKnow: [
      'mysqldump для экспорта',
      'Восстановление из файла',
      'Что класть в репозиторий',
      'Export/Import в Workbench',
      'Резервная копия перед рискованной правкой',
    ],
    theory: `## Экспорт

\`\`\`bash
mysqldump -u root -p conference > database/dump.sql

# только структура, без данных
mysqldump -u root -p --no-data conference > database/schema.sql
\`\`\`

## Импорт

\`\`\`bash
mysql -u root -p conference < database/dump.sql
\`\`\`

Или внутри консоли MySQL:

\`\`\`sql
CREATE DATABASE conference CHARACTER SET utf8mb4;
USE conference;
SOURCE database/dump.sql;
\`\`\`

## Через Workbench

Server → Data Export / Data Import. Тот же результат мышкой — полезно, если в терминале что-то не складывается.

## Что класть в репозиторий

\`\`\`text
database/
├── schema.sql       структура (пишете руками)
├── seed.sql         тестовые данные и администратор
└── er-diagram.png   диаграмма
\`\`\`

Полный дамп с данными коммитить не нужно: он большой и меняется при каждом запуске. Достаточно схемы и небольшого набора тестовых данных.

## Зачем это на экзамене

1. **Скорость.** Если база испортилась, восстановление занимает секунды.
2. **Проверка.** Проверяющий должен уметь поднять вашу базу из репозитория.
3. **Диаграмма.** Reverse Engineer строит ER-диаграмму из восстановленной базы.

## Кодировка

\`\`\`sql
CREATE DATABASE conference
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
\`\`\`

\`utf8mb4\` — полноценный Unicode. Со старым \`utf8\` в MySQL возможны проблемы с некоторыми символами. Русский текст работает в обоих, но берите \`utf8mb4\` — это правильный выбор по умолчанию.

## Резервная копия перед правкой

Перед рискованным изменением схемы на экзамене:

\`\`\`bash
mysqldump -u root -p conference > backup.sql
\`\`\`

Полминуты, которые могут спасти час работы.`,
    examples: [
      {
        title: 'seed.sql с администратором',
        language: 'sql',
        code: `-- Справочники
INSERT INTO rooms (title) VALUES ('Аудитория'), ('Коворкинг'), ('Кинозал');
INSERT INTO payment_methods (title) VALUES ('Наличные'), ('Банковская карта'), ('Перевод');

-- Администратор из задания: логин Admin26, пароль Demo20
-- Хеш получен скриптом: node -e "console.log(require('bcryptjs').hashSync('Demo20', 10))"
INSERT INTO users (login, password_hash, full_name, phone, email, role)
VALUES (
  'Admin26',
  '$2a$10$ЗАМЕНИТЕ_НА_СВОЙ_ХЕШ',
  'Администратор',
  '+7 000 000-00-00',
  'admin@example.com',
  'admin'
);`,
        explanation:
          'Хеш нельзя придумать руками — его нужно получить тем же bcrypt, которым проверяется пароль. Учебная программа предлагает сделать это отдельным seed-скриптом на Node.js.',
      },
    ],
    mistakes: [
      {
        title: 'Коммитить полный дамп с данными',
        why: 'Файл большой и меняется постоянно. В репозиторий идут схема и небольшой seed.',
      },
      {
        title: 'Вписать пароль администратора открытым текстом',
        why: 'Сравнение через bcrypt не сработает: нужен именно хеш.',
      },
    ],
    quizId: 'quiz-db-dump',
    taskIds: [],
    resources: [
      { title: 'MySQL: mysqldump', url: 'https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m1-db', 'm1-admin'],
    prerequisites: ['sql-create-table'],
    estimatedMinutes: 35,
    planDays: ['day-14-4'],
    source: 'plan',
  },

  {
    id: 'db-modeling',
    title: 'Универсальный скелет БД для любого варианта',
    tech: ['sql'],
    monthNo: 4,
    weekNo: 14,
    importance: 'core',
    summary:
      'Варианты экзамена отличаются предметной областью, но структура базы почти всегда одна и та же. Выучив скелет, вы проектируете базу за десять минут.',
    mustKnow: [
      'Существительные из задания → таблицы',
      'Пять таблиц, которые повторяются всегда',
      'Что меняется от варианта к варианту',
      'Порядок работы: сущности → связи → типы → SQL',
      'Как быстро проверить полноту схемы',
    ],
    theory: `## Как выделять сущности

Возьмите текст задания и подчеркните существительные:

> «Портал… для **бронирования помещений**… **пользователю** потребуется **регистрация**… создание **заявки**… указывать **время начала** и **способ оплаты**… **администратор** изменяет **статус**… оставлять **отзывы**»

Отсюда сразу видно: пользователи, помещения, способы оплаты, заявки, отзывы. Статус — не отдельная таблица, а поле заявки (значений всего три и они не меняются).

## Скелет, который повторяется

\`\`\`text
users             кто пользуется системой
<справочник 1>    что выбирают (помещения / курсы / услуги)
<справочник 2>    как платят
requests          заявка: кто, что, когда, чем платит, статус
reviews           отзыв к заявке
\`\`\`

От варианта к варианту меняются только названия:

| Вариант | Справочник 1 | Заявка |
|---|---|---|
| Конференции.РФ | помещения | бронирование |
| Запись на курсы | курсы | запись |
| Автосервис | услуги | запись на ремонт |
| Клининг | типы уборки | заказ |
| Запись к врачу | специалисты | приём |

Структура и связи одинаковы. Именно поэтому программа советует тренироваться на разных темах, а не зубрить один проект.

## Порядок работы

1. **Сущности** — выписать существительные (2 минуты).
2. **Связи** — кто на кого ссылается (2 минуты).
3. **Типы** — какого типа каждое поле (3 минуты).
4. **SQL** — написать \`schema.sql\` (10 минут).
5. **Запуск и диаграмма** — выполнить, сделать Reverse Engineer (5 минут).

Итого около 20 минут из 90 минут первого модуля. К неделе 24 это время нужно сократить вдвое.

## Проверка полноты

Пройдите по требованиям задания и спросите: «хватит ли таблиц, чтобы это сделать?»

- Регистрация → есть \`users\` с уникальным логином? ✓
- Вход → есть хеш пароля? ✓
- Кабинет: история заявок → есть связь заявки с пользователем? ✓
- Отзыв → есть таблица отзывов со связью с заявкой? ✓
- Заявка: помещение, дата, оплата → три поля на месте? ✓
- Админка: смена статуса → есть поле статуса с тремя значениями? ✓

Если хоть на один пункт ответ «нет» — схема неполная. Модуль 3 прямо просит: «доработайте базу данных так, чтобы она позволяла решать все задачи».`,
    examples: [
      {
        title: 'Тот же скелет для темы «Запись на курсы»',
        language: 'sql',
        code: `CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(150) NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'user'
);

CREATE TABLE courses (                    -- вместо rooms
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE payment_methods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE enrollments (                -- вместо applications
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  payment_id INT NOT NULL,
  start_date DATE NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Новая',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (payment_id) REFERENCES payment_methods(id)
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  enrollment_id INT NOT NULL UNIQUE,
  text TEXT NOT NULL,
  FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE
);`,
        explanation:
          'Изменились три названия. Структура, связи и ограничения — те же самые. Это и есть смысл универсального скелета.',
      },
    ],
    mistakes: [
      {
        title: 'Придумывать схему с нуля на каждом варианте',
        why: 'Тратится время на решённую задачу. Скелет одинаков, меняются названия.',
      },
      {
        title: 'Заводить таблицу под статусы',
        why: 'Три фиксированных значения — это поле с ENUM или CHECK. Отдельная таблица усложнит запросы без пользы.',
      },
    ],
    quizId: 'quiz-db-modeling',
    taskIds: ['task-sql-schema-courses', 'task-exam-schema-speed'],
    resources: [],
    examRefs: ['m1-db', 'm3-db'],
    prerequisites: ['sql-create-table', 'db-normalization'],
    estimatedMinutes: 45,
    planDays: ['day-14-5', 'day-14-6'],
    source: 'plan',
  },
];

export const MONTH_04_TOPICS: Topic[] = [...WEEK_13_14, ...MONTH_04_SERVER_TOPICS];
