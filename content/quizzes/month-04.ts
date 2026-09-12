import type { Quiz } from '../types';

/** Месяц 4: базы данных, SQL, Express, авторизация. */
export const MONTH_04_QUIZZES: Quiz[] = [
  {
    id: 'quiz-db-relational',
    title: 'Реляционная база: основы',
    topicIds: ['db-relational'],
    tech: ['sql'],
    monthNo: 4,
    difficulty: 1,
    passPercent: 70,
    examRefs: ['m1-db'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Что такое первичный ключ?',
        options: [
          { id: 'a', text: 'Первый столбец таблицы' },
          { id: 'b', text: 'Столбец, значение которого уникально идентифицирует строку' },
          { id: 'c', text: 'Ссылка на другую таблицу' },
          { id: 'd', text: 'Поле с датой создания' },
        ],
        correct: 'b',
        explanation:
          'Обычно это `id INT AUTO_INCREMENT PRIMARY KEY` — база сама выдаёт следующий номер, и он никогда не повторяется.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Чем NULL отличается от пустой строки?',
        options: [
          { id: 'a', text: 'Ничем' },
          { id: 'b', text: 'NULL означает «значения нет», пустая строка — это значение длиной ноль' },
          { id: 'c', text: 'NULL занимает больше места' },
          { id: 'd', text: 'Пустая строка допустима только для VARCHAR' },
        ],
        correct: 'b',
        explanation:
          'Поэтому `WHERE comment = NULL` никогда не сработает — нужно `WHERE comment IS NULL`. Это частая ошибка на экзамене.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Что делает внешний ключ?',
        options: [
          { id: 'a', text: 'Ускоряет запросы' },
          { id: 'b', text: 'Связывает строку с записью другой таблицы и не даёт сослаться на несуществующую' },
          { id: 'c', text: 'Делает поле уникальным' },
          { id: 'd', text: 'Автоматически заполняет значение' },
        ],
        correct: 'b',
        explanation:
          'База откажется вставить заявку с несуществующим user_id. Расстановка внешних ключей — отдельный пункт модуля 3.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Данные в базе сохраняются после перезапуска сервера, в отличие от массива в памяти.',
        correct: true,
        explanation:
          'Именно поэтому регистрация должна писать в базу. Массив в памяти сервера обнулится при любой перезагрузке — и проверяющий увидит пустую систему.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Что делает AUTO_INCREMENT?',
        options: [
          { id: 'a', text: 'Увеличивает размер поля' },
          { id: 'b', text: 'Автоматически присваивает следующий номер при вставке строки' },
          { id: 'c', text: 'Обновляет дату изменения' },
          { id: 'd', text: 'Делает поле обязательным' },
        ],
        correct: 'b',
        explanation:
          'Удалённые номера не переиспользуются — это нормально. Полученный id возвращается в результате INSERT как insertId.',
      },
    ],
  },

  {
    id: 'quiz-db-types',
    title: 'Типы данных',
    topicIds: ['db-types'],
    tech: ['sql'],
    monthNo: 4,
    difficulty: 2,
    passPercent: 70,
    examRefs: ['m1-db'],
    questions: [
      {
        id: 'q1',
        type: 'match',
        text: 'Сопоставьте поле проекта и подходящий тип.',
        left: [
          { id: 'l1', text: 'Логин пользователя' },
          { id: 'l2', text: 'Дата мероприятия' },
          { id: 'l3', text: 'Момент создания заявки' },
          { id: 'l4', text: 'Текст отзыва' },
        ],
        right: [
          { id: 'r1', text: 'VARCHAR(50)' },
          { id: 'r2', text: 'DATE' },
          { id: 'r3', text: 'DATETIME' },
          { id: 'r4', text: 'TEXT' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation:
          'DATE хранит только дату, DATETIME — дату и время. Для отзыва длина заранее неизвестна, поэтому TEXT.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Почему для денег не используют FLOAT?',
        options: [
          { id: 'a', text: 'FLOAT медленнее' },
          { id: 'b', text: 'Он хранит числа приближённо, и суммы накапливают погрешность' },
          { id: 'c', text: 'FLOAT не поддерживает отрицательные числа' },
          { id: 'd', text: 'Он занимает больше места' },
        ],
        correct: 'b',
        explanation: 'Нужен DECIMAL(10, 2) — точное десятичное число: 10 знаков всего, 2 после запятой.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Почему справочник статусов предпочтительнее типа ENUM?',
        options: [
          { id: 'a', text: 'ENUM не поддерживается в MySQL' },
          { id: 'b', text: 'Добавление значения в ENUM требует изменения структуры таблицы' },
          { id: 'c', text: 'Справочник работает быстрее' },
          { id: 'd', text: 'ENUM не умеет хранить русский текст' },
        ],
        correct: 'b',
        explanation:
          'Со справочником новый статус — это одна строка INSERT. На экзамене ENUM из трёх статусов тоже допустим, если времени мало.',
      },
      {
        id: 'q4',
        type: 'multiple',
        text: 'Какие ограничения стоит задать столбцу логина?',
        options: [
          { id: 'a', text: 'NOT NULL' },
          { id: 'b', text: 'UNIQUE' },
          { id: 'c', text: 'DEFAULT ""' },
          { id: 'd', text: 'AUTO_INCREMENT' },
        ],
        correct: ['a', 'b'],
        explanation:
          'Уникальность логина требует задание. UNIQUE на уровне базы — вторая линия защиты: даже при гонке запросов дубликат не пройдёт.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Чем VARCHAR(50) отличается от TEXT?',
        options: [
          { id: 'a', text: 'VARCHAR имеет ограничение длины и может участвовать в индексах и UNIQUE' },
          { id: 'b', text: 'TEXT быстрее' },
          { id: 'c', text: 'VARCHAR не хранит кириллицу' },
          { id: 'd', text: 'Отличий нет' },
        ],
        correct: 'a',
        explanation:
          'Для коротких известных строк (логин, ФИО, телефон) — VARCHAR. Для длинных произвольных текстов — TEXT.',
      },
    ],
  },

  {
    id: 'quiz-db-relations',
    title: 'Связи между таблицами',
    topicIds: ['db-relations'],
    tech: ['sql'],
    monthNo: 4,
    difficulty: 2,
    passPercent: 80,
    examRefs: ['m1-db', 'm3-db'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'У одного пользователя много заявок. Где ставить внешний ключ?',
        options: [
          { id: 'a', text: 'В таблице пользователей — список заявок' },
          { id: 'b', text: 'В таблице заявок — поле user_id' },
          { id: 'c', text: 'В отдельной связующей таблице' },
          { id: 'd', text: 'Внешний ключ не нужен' },
        ],
        correct: 'b',
        explanation:
          'Правило связи один-ко-многим: внешний ключ всегда на стороне «многих». Списков внутри строки в реляционной базе не бывает.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Как реализуется связь многие-ко-многим?',
        options: [
          { id: 'a', text: 'Двумя внешними ключами в одной из таблиц' },
          { id: 'b', text: 'Через связующую таблицу с двумя внешними ключами' },
          { id: 'c', text: 'Через поле с перечислением идентификаторов' },
          { id: 'd', text: 'Такая связь невозможна' },
        ],
        correct: 'b',
        explanation:
          'Например, «мероприятие — дополнительная услуга». Хранить «1,3,5» в одном поле нельзя: такое поле не соединить через JOIN.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Что делает `ON DELETE CASCADE` у внешнего ключа заявки на пользователя?',
        options: [
          { id: 'a', text: 'Запрещает удалять пользователя, если у него есть заявки' },
          { id: 'b', text: 'При удалении пользователя удалит и все его заявки' },
          { id: 'c', text: 'Обнулит user_id в заявках' },
          { id: 'd', text: 'Ничего' },
        ],
        correct: 'b',
        explanation:
          'RESTRICT, наоборот, запретит удаление. SET NULL обнулит ссылку. Выбор зависит от смысла: отзывы удалять вместе с заявкой логично, заявки вместе с пользователем — спорно.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Связь один-к-одному обычно означает, что таблицы можно было бы объединить.',
        correct: true,
        explanation:
          'Разделяют её ради редко используемых или чувствительных полей. В учебном проекте она встречается нечасто.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Заявка ссылается на помещение и способ оплаты. Сколько внешних ключей у таблицы заявок?',
        options: [
          { id: 'a', text: 'Один' },
          { id: 'b', text: 'Два' },
          { id: 'c', text: 'Три и более — ещё на пользователя и статус' },
          { id: 'd', text: 'Ни одного' },
        ],
        correct: 'c',
        explanation:
          'Типичная заявка: user_id, room_id, payment_method_id, status_id. Это и есть «скелет» схемы, повторяющийся почти в каждом варианте.',
      },
    ],
  },

  {
    id: 'quiz-db-normalization',
    title: 'Нормализация',
    topicIds: ['db-normalization'],
    tech: ['sql'],
    monthNo: 4,
    difficulty: 2,
    passPercent: 70,
    examRefs: ['m3-db'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Что не так с полем `phones VARCHAR(255)`, куда пишут «+7900…, +7901…»?',
        options: [
          { id: 'a', text: 'Ничего, так удобнее' },
          { id: 'b', text: 'В ячейке несколько значений — их нельзя нормально искать и соединять' },
          { id: 'c', text: 'Не хватит длины' },
          { id: 'd', text: 'Нужен тип TEXT' },
        ],
        correct: 'b',
        explanation:
          'Первое правило: одно значение в одной ячейке. Несколько телефонов — отдельная таблица со связью один-ко-многим.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'В таблице заявок есть столбцы user_name и user_phone. Почему это плохо?',
        options: [
          { id: 'a', text: 'Так медленнее' },
          { id: 'b', text: 'Данные дублируются: при смене телефона придётся править все заявки пользователя' },
          { id: 'c', text: 'Столбцов слишком много' },
          { id: 'd', text: 'Это нормально' },
        ],
        correct: 'b',
        explanation:
          'Эти поля зависят от пользователя, а не от заявки. Их место — в таблице users, а в заявке достаточно user_id.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Что означают столбцы service_1, service_2, service_3 в таблице?',
        options: [
          { id: 'a', text: 'Правильное решение для трёх услуг' },
          { id: 'b', text: 'Повторяющуюся группу — признак того, что нужна отдельная таблица' },
          { id: 'c', text: 'Оптимизацию' },
          { id: 'd', text: 'Требование нормализации' },
        ],
        correct: 'b',
        explanation:
          'А если услуг станет четыре? Повторяющиеся столбцы всегда заменяются строками связанной таблицы.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Иногда дублирование оправдано: например, цену на момент заказа сохраняют в самой заявке.',
        correct: true,
        explanation:
          'Цена в справочнике может измениться, а в заявке должна остаться та, по которой договорились. Это осознанное решение, а не ошибка.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Как быстро проверить схему на дубли?',
        options: [
          { id: 'a', text: 'Пройтись по столбцам и спросить: «это свойство именно этой сущности?»' },
          { id: 'b', text: 'Посчитать количество таблиц' },
          { id: 'c', text: 'Запустить EXPLAIN' },
          { id: 'd', text: 'Проверить размер базы' },
        ],
        correct: 'a',
        explanation:
          'Если ответ «нет, это свойство пользователя (помещения, статуса)» — столбец нужно перенести и заменить внешним ключом.',
      },
    ],
  },

  {
    id: 'quiz-db-er',
    title: 'ER-диаграмма',
    topicIds: ['db-er-diagram'],
    tech: ['sql', 'design'],
    monthNo: 4,
    difficulty: 2,
    passPercent: 80,
    examRefs: ['m1-er'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Что требует задание от ER-диаграммы?',
        options: [
          { id: 'a', text: 'Нарисовать от руки на бумаге' },
          { id: 'b', text: 'Построить диаграмму базы данных и сохранить её в репозитории' },
          { id: 'c', text: 'Описать таблицы текстом' },
          { id: 'd', text: 'Она не требуется' },
        ],
        correct: 'b',
        explanation:
          'Диаграмма — отдельный оцениваемый пункт модуля 1. Файл (изображение или .mwb) должен лежать в репозитории, иначе показать её нечем.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Что обозначает «воронья лапка» на конце связи?',
        options: [
          { id: 'a', text: 'Сторону «многие»' },
          { id: 'b', text: 'Сторону «один»' },
          { id: 'c', text: 'Необязательную связь' },
          { id: 'd', text: 'Первичный ключ' },
        ],
        correct: 'a',
        explanation:
          'Одна черта — «один», «лапка» — «многие». Связь «пользователь → заявки»: со стороны заявок будет «лапка».',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Какая функция MySQL Workbench строит диаграмму по существующей базе?',
        options: [
          { id: 'a', text: 'Forward Engineer' },
          { id: 'b', text: 'Reverse Engineer' },
          { id: 'c', text: 'Data Import' },
          { id: 'd', text: 'Model Validate' },
        ],
        correct: 'b',
        explanation:
          'Сначала выполняете schema.sql, затем Database → Reverse Engineer — диаграмма строится автоматически за минуту.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'На диаграмме должны быть видны первичные и внешние ключи таблиц.',
        correct: true,
        explanation:
          'Именно они показывают структуру связей. Диаграмма без ключей не отвечает на главный вопрос — как таблицы соединены.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Когда строить диаграмму на экзамене?',
        options: [
          { id: 'a', text: 'В самом начале, до написания SQL' },
          { id: 'b', text: 'Сразу после того, как schema.sql выполнен и таблицы созданы' },
          { id: 'c', text: 'В конце экзамена' },
          { id: 'd', text: 'В модуле 3' },
        ],
        correct: 'b',
        explanation:
          'Так диаграмма строится автоматически и гарантированно совпадает с реальной базой. Рисовать вручную заранее — дольше и рискованно.',
      },
    ],
  },

  {
    id: 'quiz-sql-create',
    title: 'CREATE TABLE',
    topicIds: ['sql-create-table'],
    tech: ['sql'],
    monthNo: 4,
    difficulty: 2,
    passPercent: 80,
    examRefs: ['m1-db'],
    questions: [
      {
        id: 'q1',
        type: 'order',
        text: 'В каком порядке создавать таблицы?',
        items: [
          { id: 'i1', text: 'users, statuses, rooms, payment_methods — справочники и независимые таблицы' },
          { id: 'i2', text: 'applications — ссылается на них' },
          { id: 'i3', text: 'reviews — ссылается на заявки' },
        ],
        correct: ['i1', 'i2', 'i3'],
        explanation:
          'Внешний ключ нельзя создать на ещё не существующую таблицу. Ошибка «errno 150» почти всегда означает неправильный порядок.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Зачем в начале schema.sql пишут DROP TABLE IF EXISTS?',
        options: [
          { id: 'a', text: 'Чтобы очистить данные' },
          { id: 'b', text: 'Чтобы скрипт можно было запускать повторно без ошибок «таблица уже существует»' },
          { id: 'c', text: 'Так требует MySQL' },
          { id: 'd', text: 'Для ускорения' },
        ],
        correct: 'b',
        explanation:
          'На экзамене схему правят несколько раз. Удалять таблицы нужно в обратном порядке — сначала зависимые.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как объявить внешний ключ?',
        options: [
          { id: 'a', text: 'FOREIGN KEY (user_id) REFERENCES users(id)' },
          { id: 'b', text: 'FOREIGN user_id -> users.id' },
          { id: 'c', text: 'REFERENCES users(id) ON user_id' },
          { id: 'd', text: 'LINK user_id TO users(id)' },
        ],
        correct: 'a',
        explanation:
          'Тип столбца должен точно совпадать с типом того, на который он ссылается: INT к INT, UNSIGNED к UNSIGNED.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Как задать статус «Новая» по умолчанию через справочник?',
        options: [
          { id: 'a', text: 'DEFAULT "Новая"' },
          { id: 'b', text: 'status_id INT NOT NULL DEFAULT 1, где 1 — идентификатор строки «Новая»' },
          { id: 'c', text: 'AUTO_INCREMENT' },
          { id: 'd', text: 'Значение по умолчанию задать нельзя' },
        ],
        correct: 'b',
        explanation:
          'Задание требует, чтобы новая заявка получала статус «Новая». Можно задать и на уровне базы, и явно указывать при вставке — надёжнее второе плюс первое.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Файл schema.sql нужно закоммитить в репозиторий.',
        correct: true,
        explanation:
          'Без него проверяющий не сможет восстановить базу. Обычно его кладут в папку database вместе с seed-данными и диаграммой.',
      },
    ],
  },

  {
    id: 'quiz-sql-select',
    title: 'SELECT, WHERE, ORDER BY',
    topicIds: ['sql-select'],
    tech: ['sql'],
    monthNo: 4,
    difficulty: 2,
    passPercent: 80,
    questions: [
      {
        id: 'q1',
        type: 'order',
        text: 'Расставьте части запроса в синтаксически верном порядке.',
        items: [
          { id: 'i1', text: 'SELECT столбцы' },
          { id: 'i2', text: 'FROM таблица' },
          { id: 'i3', text: 'WHERE условие' },
          { id: 'i4', text: 'ORDER BY столбец' },
          { id: 'i5', text: 'LIMIT n' },
        ],
        correct: ['i1', 'i2', 'i3', 'i4', 'i5'],
        explanation: 'Между WHERE и ORDER BY может стоять GROUP BY, а после него — HAVING.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Как выбрать заявки со статусом 1 или 2?',
        options: [
          { id: 'a', text: 'WHERE status_id = 1, 2' },
          { id: 'b', text: 'WHERE status_id IN (1, 2)' },
          { id: 'c', text: 'WHERE status_id = 1 AND status_id = 2' },
          { id: 'd', text: 'WHERE status_id BETWEEN 1 OR 2' },
        ],
        correct: 'b',
        explanation:
          'Вариант с AND не вернёт ничего: одно поле не может одновременно равняться двум значениям.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как найти пользователей, чьё ФИО содержит «Иван»?',
        options: [
          { id: 'a', text: "WHERE full_name = 'Иван'" },
          { id: 'b', text: "WHERE full_name LIKE '%Иван%'" },
          { id: 'c', text: "WHERE full_name CONTAINS 'Иван'" },
          { id: 'd', text: "WHERE full_name ~ 'Иван'" },
        ],
        correct: 'b',
        explanation:
          'Знак процента — любое количество символов. `Иван%` — начинается с «Иван», `%Иван` — заканчивается.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Как получить вторую страницу по 10 записей?',
        options: [
          { id: 'a', text: 'LIMIT 2, 10' },
          { id: 'b', text: 'LIMIT 10 OFFSET 10' },
          { id: 'c', text: 'LIMIT 20' },
          { id: 'd', text: 'OFFSET 2' },
        ],
        correct: 'b',
        explanation:
          'Формула: OFFSET = (страница − 1) × размер. Пагинацию лучше делать на сервере, а не отдавать клиенту все записи.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Без ORDER BY порядок строк не гарантирован.',
        correct: true,
        explanation:
          'База вправе вернуть строки в любом порядке. Для пагинации сортировка обязательна, иначе записи будут повторяться между страницами.',
      },
    ],
  },

  {
    id: 'quiz-sql-insert',
    title: 'INSERT',
    topicIds: ['sql-insert'],
    tech: ['sql'],
    monthNo: 4,
    difficulty: 2,
    passPercent: 80,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Как правильно вставить данные пользователя из переменных?',
        options: [
          { id: 'a', text: 'pool.execute(`INSERT INTO users (login) VALUES (\'${login}\')`)' },
          { id: 'b', text: 'pool.execute("INSERT INTO users (login) VALUES (?)", [login])' },
          { id: 'c', text: 'pool.query("INSERT INTO users SET login = " + login)' },
          { id: 'd', text: 'Любой вариант подходит' },
        ],
        correct: 'b',
        explanation:
          'Склейка строк — это SQL-инъекция. Знак вопроса и массив параметров: значение никогда не станет частью команды.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Как узнать id только что созданной заявки?',
        options: [
          { id: 'a', text: 'Сделать SELECT MAX(id)' },
          { id: 'b', text: 'Взять result.insertId из результата INSERT' },
          { id: 'c', text: 'Посчитать количество строк' },
          { id: 'd', text: 'Никак' },
        ],
        correct: 'b',
        explanation:
          'SELECT MAX(id) ненадёжен: между вставкой и выборкой мог вставиться другой пользователь. insertId относится именно к вашему запросу.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как вставить несколько строк справочника одним запросом?',
        options: [
          { id: 'a', text: "INSERT INTO statuses (name) VALUES ('Новая'), ('Мероприятие назначено'), ('Мероприятие завершено')" },
          { id: 'b', text: 'Только по одной строке за раз' },
          { id: 'c', text: 'INSERT MANY' },
          { id: 'd', text: 'BULK INSERT' },
        ],
        correct: 'a',
        explanation:
          'Через запятую. Это удобно для seed-скрипта: справочники заполняются одним запросом на таблицу.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Столбцы со значением по умолчанию и AUTO_INCREMENT в списке INSERT указывать не обязательно.',
        correct: true,
        explanation:
          'Достаточно перечислить те, что заполняете. id и created_at обычно заполняет сама база.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Что произойдёт при вставке дубликата логина, если у столбца стоит UNIQUE?',
        options: [
          { id: 'a', text: 'Строка перезапишется' },
          { id: 'b', text: 'База вернёт ошибку ER_DUP_ENTRY, её нужно поймать и ответить кодом 409' },
          { id: 'c', text: 'Вставится вторая строка' },
          { id: 'd', text: 'Ничего не произойдёт' },
        ],
        correct: 'b',
        explanation:
          'Ловить ошибку базы — правильная вторая линия защиты. Первая — проверка существования логина перед вставкой.',
      },
    ],
  },

  {
    id: 'quiz-sql-update',
    title: 'UPDATE и DELETE',
    topicIds: ['sql-update'],
    tech: ['sql'],
    monthNo: 4,
    difficulty: 2,
    passPercent: 80,
    examRefs: ['m1-admin'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Что произойдёт при `UPDATE applications SET status_id = 2` без WHERE?',
        options: [
          { id: 'a', text: 'Ошибка синтаксиса' },
          { id: 'b', text: 'Статус изменится у ВСЕХ заявок в таблице' },
          { id: 'c', text: 'Изменится только первая строка' },
          { id: 'd', text: 'Ничего не произойдёт' },
        ],
        correct: 'b',
        explanation:
          'Откатить это нельзя. Привычка: сначала пишем WHERE, потом остальное — тогда забыть его невозможно.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Как проверить, что обновление действительно произошло?',
        options: [
          { id: 'a', text: 'Сделать SELECT после UPDATE' },
          { id: 'b', text: 'Посмотреть result.affectedRows — если 0, записи с таким id нет' },
          { id: 'c', text: 'Проверить отсутствие ошибки' },
          { id: 'd', text: 'Никак' },
        ],
        correct: 'b',
        explanation:
          'Ноль изменённых строк — повод ответить 404. Отсутствие ошибки ничего не доказывает: UPDATE несуществующей строки проходит успешно.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Администратор присылает новый статус. Почему нужен белый список?',
        options: [
          { id: 'a', text: 'Для скорости' },
          { id: 'b', text: 'Чтобы в базу не попало произвольное значение из запроса' },
          { id: 'c', text: 'Так требует MySQL' },
          { id: 'd', text: 'Белый список не нужен, есть внешний ключ' },
        ],
        correct: 'b',
        explanation:
          'Внешний ключ действительно защищает, но понятная ошибка 400 лучше, чем ошибка базы 500. Три статуса известны заранее — проверить их несложно.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Мягкое удаление (поле is_deleted вместо DELETE) позволяет восстановить данные.',
        correct: true,
        explanation:
          'Плюс не рушатся связи с отзывами и историей. Минус — все выборки нужно фильтровать по этому полю.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Как обновить статус конкретной заявки?',
        options: [
          { id: 'a', text: 'UPDATE applications SET status_id = ? WHERE id = ?' },
          { id: 'b', text: 'UPDATE applications SET status_id = ? LIMIT 1' },
          { id: 'c', text: 'UPDATE applications WHERE id = ? SET status_id = ?' },
          { id: 'd', text: 'SET applications.status_id = ?' },
        ],
        correct: 'a',
        explanation: 'Порядок фиксирован: UPDATE → SET → WHERE. Значения передаются параметрами в том же порядке.',
      },
    ],
  },

  {
    id: 'quiz-sql-join',
    title: 'JOIN',
    topicIds: ['sql-join'],
    tech: ['sql'],
    monthNo: 4,
    difficulty: 3,
    passPercent: 80,
    examRefs: ['m1-cabinet', 'm1-admin'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Чем LEFT JOIN отличается от INNER JOIN?',
        options: [
          { id: 'a', text: 'Ничем' },
          { id: 'b', text: 'LEFT JOIN оставит строки левой таблицы даже без пары справа — недостающие поля будут NULL' },
          { id: 'c', text: 'LEFT JOIN быстрее' },
          { id: 'd', text: 'LEFT JOIN соединяет только по первичным ключам' },
        ],
        correct: 'b',
        explanation:
          'Это важно для отзывов: с INNER JOIN из кабинета пропадут все заявки, к которым отзыв ещё не оставлен.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Как вывести заявки с названием помещения вместо room_id?',
        options: [
          { id: 'a', text: 'SELECT a.*, r.name FROM applications a JOIN rooms r ON a.room_id = r.id' },
          { id: 'b', text: 'SELECT * FROM applications, rooms' },
          { id: 'c', text: 'SELECT a.*, rooms.name FROM applications a' },
          { id: 'd', text: 'Двумя отдельными запросами' },
        ],
        correct: 'a',
        explanation:
          'Условие ON указывает, по каким полям соединять. Без него получится декартово произведение — каждая заявка со всеми помещениями.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Зачем нужны псевдонимы таблиц (`applications a`)?',
        options: [
          { id: 'a', text: 'Для ускорения' },
          { id: 'b', text: 'Запрос становится короче и понятно, из какой таблицы взят столбец' },
          { id: 'c', text: 'Так требует стандарт' },
          { id: 'd', text: 'Чтобы скрыть имена таблиц' },
        ],
        correct: 'b',
        explanation:
          'При четырёх JOIN без псевдонимов запрос нечитаем. Столбцы с одинаковыми именами (id, name) обязательно нужно уточнять.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Один запрос с JOIN обычно лучше, чем несколько запросов в цикле.',
        correct: true,
        explanation:
          'Запрос в цикле по 50 заявкам — это 51 обращение к базе. Проблему называют N+1, и она заметно замедляет админку.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Сколько JOIN понадобится таблице админки: заявки + пользователь + помещение + способ оплаты + статус?',
        options: [
          { id: 'a', text: 'Один' },
          { id: 'b', text: 'Два' },
          { id: 'c', text: 'Четыре' },
          { id: 'd', text: 'JOIN не нужен' },
        ],
        correct: 'c',
        explanation:
          'По одному на каждый справочник. Такой запрос — типовая заготовка, её стоит уметь писать по памяти.',
      },
    ],
  },

  {
    id: 'quiz-sql-aggregate',
    title: 'GROUP BY и агрегаты',
    topicIds: ['sql-aggregate'],
    tech: ['sql'],
    monthNo: 4,
    difficulty: 3,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Как посчитать количество заявок по каждому статусу?',
        options: [
          { id: 'a', text: 'SELECT status_id, COUNT(*) FROM applications GROUP BY status_id' },
          { id: 'b', text: 'SELECT COUNT(status_id) FROM applications' },
          { id: 'c', text: 'SELECT status_id, COUNT(*) FROM applications' },
          { id: 'd', text: 'SELECT DISTINCT status_id FROM applications' },
        ],
        correct: 'a',
        explanation:
          'Правило: все столбцы из SELECT, не обёрнутые в агрегатную функцию, должны быть перечислены в GROUP BY.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Чем HAVING отличается от WHERE?',
        options: [
          { id: 'a', text: 'Ничем' },
          { id: 'b', text: 'WHERE фильтрует строки до группировки, HAVING — уже посчитанные группы' },
          { id: 'c', text: 'HAVING работает только с датами' },
          { id: 'd', text: 'WHERE нельзя использовать вместе с GROUP BY' },
        ],
        correct: 'b',
        explanation:
          'Нельзя написать `WHERE COUNT(*) > 5` — на момент WHERE счётчик ещё не посчитан. Для этого и нужен HAVING.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Чем `COUNT(*)` отличается от `COUNT(review_id)`?',
        options: [
          { id: 'a', text: 'Ничем' },
          { id: 'b', text: 'COUNT(*) считает все строки, COUNT(столбец) — только строки, где значение не NULL' },
          { id: 'c', text: 'COUNT(*) работает быстрее всегда' },
          { id: 'd', text: 'COUNT(столбец) считает уникальные значения' },
        ],
        correct: 'b',
        explanation:
          'После LEFT JOIN с отзывами это критично: COUNT(*) посчитает все заявки, COUNT(r.id) — только те, где отзыв есть.',
      },
      {
        id: 'q4',
        type: 'match',
        text: 'Сопоставьте функцию и результат.',
        left: [
          { id: 'l1', text: 'SUM' },
          { id: 'l2', text: 'AVG' },
          { id: 'l3', text: 'MIN' },
          { id: 'l4', text: 'MAX' },
        ],
        right: [
          { id: 'r1', text: 'Сумма значений' },
          { id: 'r2', text: 'Среднее значение' },
          { id: 'r3', text: 'Наименьшее значение' },
          { id: 'r4', text: 'Наибольшее значение' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation: 'Все они игнорируют NULL — кроме COUNT(*), который считает строки целиком.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Сводка вида «новых заявок: 12, назначено: 5, завершено: 30» полезна на главной странице админки.',
        correct: true,
        explanation:
          'Это один запрос с GROUP BY. Небольшая деталь, которая заметно улучшает впечатление от панели администратора.',
      },
    ],
  },

  {
    id: 'quiz-sql-dates',
    title: 'Даты в SQL',
    topicIds: ['sql-dates'],
    tech: ['sql'],
    monthNo: 4,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'В каком формате MySQL хранит тип DATE?',
        options: [
          { id: 'a', text: 'ДД.ММ.ГГГГ' },
          { id: 'b', text: 'ГГГГ-ММ-ДД' },
          { id: 'c', text: 'ММ/ДД/ГГГГ' },
          { id: 'd', text: 'В виде числа' },
        ],
        correct: 'b',
        explanation:
          'Поэтому перед вставкой дату из формы (ДД.ММ.ГГГГ) нужно перевести, а при выводе — перевести обратно.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Что вернёт `DATE_FORMAT(event_date, "%d.%m.%Y")`?',
        options: [
          { id: 'a', text: 'Дату в формате ДД.ММ.ГГГГ' },
          { id: 'b', text: 'Дату в формате ГГГГ-ММ-ДД' },
          { id: 'c', text: 'Число дней' },
          { id: 'd', text: 'Ошибку' },
        ],
        correct: 'a',
        explanation:
          'Удобно, но помните: результат — строка, и сортировать по ней уже нельзя. Сортируйте по исходному столбцу.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как выбрать заявки за март 2026 года?',
        options: [
          { id: 'a', text: "WHERE event_date BETWEEN '2026-03-01' AND '2026-03-31'" },
          { id: 'b', text: "WHERE event_date LIKE '%03%'" },
          { id: 'c', text: "WHERE event_date = '2026-03'" },
          { id: 'd', text: 'WHERE MONTH(event_date)' },
        ],
        correct: 'a',
        explanation:
          'BETWEEN включает обе границы. Вариант с LIKE найдёт и третье число любого месяца — типичная ошибка.',
      },
      {
        id: 'q4',
        type: 'match',
        text: 'Сопоставьте функцию и её результат.',
        left: [
          { id: 'l1', text: 'CURDATE()' },
          { id: 'l2', text: 'NOW()' },
          { id: 'l3', text: 'DATEDIFF(a, b)' },
          { id: 'l4', text: 'DATE_ADD(d, INTERVAL 7 DAY)' },
        ],
        right: [
          { id: 'r1', text: 'Сегодняшняя дата' },
          { id: 'r2', text: 'Текущие дата и время' },
          { id: 'r3', text: 'Разница в днях' },
          { id: 'r4', text: 'Дата через неделю' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation: 'CURDATE() удобен для проверки «дата не в прошлом»: `WHERE event_date >= CURDATE()`.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Форматировать дату лучше на сервере или клиенте, а в базе хранить исходное значение DATE.',
        correct: true,
        explanation:
          'Так сохраняется возможность сортировать и сравнивать. Формат отображения — задача представления, а не хранения.',
      },
    ],
  },

  {
    id: 'quiz-db-dump',
    title: 'Дамп базы',
    topicIds: ['db-dump'],
    tech: ['sql', 'tools'],
    monthNo: 4,
    difficulty: 1,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Какой утилитой делают экспорт базы MySQL?',
        options: [
          { id: 'a', text: 'mysqldump' },
          { id: 'b', text: 'mysqlbackup' },
          { id: 'c', text: 'mysql --export' },
          { id: 'd', text: 'dumpdb' },
        ],
        correct: 'a',
        explanation:
          '`mysqldump -u root -p имя_базы > dump.sql`. Восстановление — обратной командой: `mysql -u root -p имя_базы < dump.sql`.',
      },
      {
        id: 'q2',
        type: 'multiple',
        text: 'Что стоит положить в репозиторий в папку database?',
        options: [
          { id: 'a', text: 'schema.sql со структурой' },
          { id: 'b', text: 'seed.sql с тестовыми данными' },
          { id: 'c', text: 'ER-диаграмму' },
          { id: 'd', text: 'Пароль от базы' },
        ],
        correct: ['a', 'b', 'c'],
        explanation:
          'Пароли в репозиторий не коммитят — они живут в .env, который попадает в .gitignore.',
      },
      {
        id: 'q3',
        type: 'boolean',
        text: 'Перед рискованной правкой схемы имеет смысл сделать дамп.',
        correct: true,
        explanation:
          'На экзамене это минута работы и страховка от потери часа. То же относится к коммиту перед крупной переделкой.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Где в MySQL Workbench находится экспорт базы?',
        options: [
          { id: 'a', text: 'Server → Data Export' },
          { id: 'b', text: 'File → Save As' },
          { id: 'c', text: 'Edit → Export' },
          { id: 'd', text: 'Database → Forward Engineer' },
        ],
        correct: 'a',
        explanation: 'Обратная операция — Server → Data Import. Forward Engineer создаёт базу по диаграмме, это другое.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Чем schema.sql удобнее дампа для экзамена?',
        options: [
          { id: 'a', text: 'Он меньше' },
          { id: 'b', text: 'Он читаемый, его легко править и запускать повторно' },
          { id: 'c', text: 'Он работает быстрее' },
          { id: 'd', text: 'Дамп нельзя коммитить' },
        ],
        correct: 'b',
        explanation:
          'Схема, написанная руками с DROP TABLE IF EXISTS, пересоздаёт базу за секунду. Дамп удобен для сохранения реальных данных.',
      },
    ],
  },

  {
    id: 'quiz-db-modeling',
    title: 'Универсальный скелет базы',
    topicIds: ['db-modeling'],
    tech: ['sql'],
    monthNo: 4,
    difficulty: 3,
    passPercent: 80,
    examRefs: ['m1-db'],
    questions: [
      {
        id: 'q1',
        type: 'order',
        text: 'Расставьте шаги проектирования базы по новому заданию.',
        items: [
          { id: 'i1', text: 'Выписать существительные из задания — это сущности' },
          { id: 'i2', text: 'Определить связи между ними' },
          { id: 'i3', text: 'Выбрать типы и ограничения столбцов' },
          { id: 'i4', text: 'Написать и выполнить schema.sql' },
        ],
        correct: ['i1', 'i2', 'i3', 'i4'],
        explanation:
          'Пятнадцать минут по этому порядку — и схема готова. Попытка писать SQL сразу обычно заканчивается переделкой.',
      },
      {
        id: 'q2',
        type: 'multiple',
        text: 'Какие таблицы повторяются практически в любом варианте задания?',
        options: [
          { id: 'a', text: 'Пользователи' },
          { id: 'b', text: 'Заявки (заказы, записи)' },
          { id: 'c', text: 'Статусы' },
          { id: 'd', text: 'Справочник основного ресурса (помещения, курсы, столики)' },
          { id: 'e', text: 'Логи действий' },
        ],
        correct: ['a', 'b', 'c', 'd'],
        explanation:
          'Плюс способы оплаты и отзывы. Меняются названия и пара полей, структура остаётся той же — на этом и строится подготовка.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'В новом варианте вместо «помещений» — «курсы». Насколько изменится схема?',
        options: [
          { id: 'a', text: 'Полностью' },
          { id: 'b', text: 'Поменяются названия таблицы и пары столбцов, структура связей останется' },
          { id: 'c', text: 'Придётся отказаться от справочников' },
          { id: 'd', text: 'Нужно больше таблиц' },
        ],
        correct: 'b',
        explanation:
          'Это ключевая мысль подготовки: заготовку схемы можно держать в голове и адаптировать за десять минут.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Полноту схемы проверяют так: берут каждое требование задания и смотрят, хватает ли данных для его выполнения.',
        correct: true,
        explanation:
          'Например: «в кабинете видны заявки с датой, помещением и способом оплаты» — значит, все эти поля должны быть доступны через связи.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Где хранить роль пользователя?',
        options: [
          { id: 'a', text: 'В отдельной таблице ролей или в поле role таблицы users' },
          { id: 'b', text: 'В localStorage' },
          { id: 'c', text: 'В отдельной таблице администраторов' },
          { id: 'd', text: 'Определять по логину' },
        ],
        correct: 'a',
        explanation:
          'Отдельная таблица администраторов приводит к дублированию логики входа. Поле role проще и достаточно для двух ролей.',
      },
    ],
  },

  {
    id: 'quiz-express-basics',
    title: 'Express: маршруты',
    topicIds: ['express-basics'],
    tech: ['node', 'express'],
    monthNo: 4,
    difficulty: 2,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Что делает `app.use(express.json())`?',
        options: [
          { id: 'a', text: 'Отдаёт ответы в формате JSON' },
          { id: 'b', text: 'Разбирает тело входящего запроса из JSON в объект req.body' },
          { id: 'c', text: 'Проверяет корректность JSON' },
          { id: 'd', text: 'Подключает базу данных' },
        ],
        correct: 'b',
        explanation:
          'Без этой строки req.body будет undefined. Симптом: «клиент отправляет данные, а на сервере их нет».',
      },
      {
        id: 'q2',
        type: 'match',
        text: 'Сопоставьте метод HTTP и действие.',
        left: [
          { id: 'l1', text: 'GET' },
          { id: 'l2', text: 'POST' },
          { id: 'l3', text: 'PATCH' },
          { id: 'l4', text: 'DELETE' },
        ],
        right: [
          { id: 'r1', text: 'Получить данные' },
          { id: 'r2', text: 'Создать запись' },
          { id: 'r3', text: 'Частично изменить запись' },
          { id: 'r4', text: 'Удалить запись' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation:
          'Смена статуса заявки — это PATCH: меняется одно поле. PUT предполагает замену записи целиком.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как ответить кодом 201 и телом JSON?',
        options: [
          { id: 'a', text: 'res.json(201, data)' },
          { id: 'b', text: 'res.status(201).json(data)' },
          { id: 'c', text: 'res.send(201, data)' },
          { id: 'd', text: 'res.code(201).json(data)' },
        ],
        correct: 'b',
        explanation: 'status возвращает сам объект ответа, поэтому вызовы выстраиваются в цепочку.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Почему порядок объявления маршрутов важен?',
        options: [
          { id: 'a', text: 'Он не важен' },
          { id: 'b', text: 'Express проверяет маршруты сверху вниз: `/orders/:id` перехватит `/orders/stats`' },
          { id: 'c', text: 'Так требует JavaScript' },
          { id: 'd', text: 'Из-за кеширования' },
        ],
        correct: 'b',
        explanation:
          'Конкретные адреса объявляют выше параметризованных. Иначе «stats» попадёт в параметр id, и запрос уйдёт не туда.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Команда `node --watch server.js` перезапускает сервер при изменении файлов.',
        correct: true,
        explanation:
          'Встроенная возможность современных версий Node — дополнительные пакеты вроде nodemon не нужны.',
      },
    ],
  },

  {
    id: 'quiz-express-params',
    title: 'params, query, body',
    topicIds: ['express-params'],
    tech: ['express'],
    monthNo: 4,
    difficulty: 2,
    passPercent: 80,
    questions: [
      {
        id: 'q1',
        type: 'match',
        text: 'Сопоставьте источник данных и место в запросе.',
        left: [
          { id: 'l1', text: 'req.params' },
          { id: 'l2', text: 'req.query' },
          { id: 'l3', text: 'req.body' },
          { id: 'l4', text: 'req.headers' },
        ],
        right: [
          { id: 'r1', text: '/orders/:id — часть адреса' },
          { id: 'r2', text: '?page=2&status=1 — после вопросительного знака' },
          { id: 'r3', text: 'Тело POST-запроса' },
          { id: 'r4', text: 'Authorization и другие заголовки' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation:
          'Фильтры и страницы передают через query, идентификатор записи — через params, данные формы — через body.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Какого типа значение `req.params.id`?',
        options: [
          { id: 'a', text: 'number' },
          { id: 'b', text: 'string' },
          { id: 'c', text: 'any' },
          { id: 'd', text: 'Зависит от маршрута' },
        ],
        correct: 'b',
        explanation:
          'Всегда строка. Для сравнения с числом из базы нужен Number(id), и результат стоит проверить через Number.isInteger.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Клиент прислал `?page=abc`. Что должен сделать сервер?',
        options: [
          { id: 'a', text: 'Упасть с ошибкой' },
          { id: 'b', text: 'Подставить значение по умолчанию или ответить 400' },
          { id: 'c', text: 'Игнорировать пагинацию' },
          { id: 'd', text: 'Вернуть все записи' },
        ],
        correct: 'b',
        explanation:
          'Number("abc") даёт NaN, и запрос с `LIMIT NaN` сломает базу. Любое значение из запроса нужно проверять.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Пароль нельзя передавать через query-параметры.',
        correct: true,
        explanation:
          'Адрес попадает в логи сервера, историю браузера и заголовок Referer. Пароль передают только в теле POST-запроса.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Как описать маршрут с параметром в Express?',
        options: [
          { id: 'a', text: "app.get('/orders/{id}', …)" },
          { id: 'b', text: "app.get('/orders/:id', …)" },
          { id: 'c', text: "app.get('/orders/$id', …)" },
          { id: 'd', text: "app.get('/orders/*', …)" },
        ],
        correct: 'b',
        explanation: 'Двоеточие перед именем. Значение окажется в req.params под этим именем.',
      },
    ],
  },

  {
    id: 'quiz-express-proxy',
    title: 'Прокси и CORS',
    topicIds: ['express-proxy'],
    tech: ['express', 'react', 'tools'],
    monthNo: 4,
    difficulty: 3,
    passPercent: 70,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Клиент на порту 5173, сервер на 3000. Почему запрос блокируется?',
        options: [
          { id: 'a', text: 'Сервер не запущен' },
          { id: 'b', text: 'Из-за правила одного источника: другой порт — это другой источник' },
          { id: 'c', text: 'Неправильный адрес' },
          { id: 'd', text: 'Не хватает прав' },
        ],
        correct: 'b',
        explanation:
          'Браузер защищает пользователя от запросов на чужие источники. Ошибка в консоли содержит слово CORS.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Почему прокси в vite.config.ts предпочтительнее пакета cors?',
        options: [
          { id: 'a', text: 'Он быстрее' },
          { id: 'b', text: 'Для браузера всё приходит с одного источника — проблема исчезает, а не обходится' },
          { id: 'c', text: 'cors не работает с Express' },
          { id: 'd', text: 'Прокси не требует настройки' },
        ],
        correct: 'b',
        explanation:
          'Запросы на /api Vite сам переправляет на сервер. Дополнительный плюс — в коде остаются относительные адреса.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как выглядит настройка прокси?',
        options: [
          { id: 'a', text: "server: { proxy: { '/api': 'http://localhost:3000' } }" },
          { id: 'b', text: "proxy: 'http://localhost:3000'" },
          { id: 'c', text: "build: { proxy: true }" },
          { id: 'd', text: 'Настройка не нужна' },
        ],
        correct: 'a',
        explanation:
          'Ключ — префикс пути, значение — адрес сервера. После правки конфигурации Vite нужно перезапустить.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Проверить, куда реально ушёл запрос, можно во вкладке Network.',
        correct: true,
        explanation:
          'Там видно полный адрес, метод, тело и код ответа. Это первое место, куда стоит смотреть при проблемах со связью клиента и сервера.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Что делает `app.use(cors())` на сервере?',
        options: [
          { id: 'a', text: 'Разрешает браузеру запросы с других источников' },
          { id: 'b', text: 'Шифрует запросы' },
          { id: 'c', text: 'Ускоряет ответы' },
          { id: 'd', text: 'Проверяет токен' },
        ],
        correct: 'a',
        explanation:
          'Сервер добавляет заголовки, разрешающие обращение. Без параметров разрешает всем — для учебного проекта приемлемо, но прокси аккуратнее.',
      },
    ],
  },

  {
    id: 'quiz-express-mysql',
    title: 'Подключение к MySQL',
    topicIds: ['express-mysql'],
    tech: ['express', 'sql', 'security'],
    monthNo: 4,
    difficulty: 3,
    passPercent: 80,
    examRefs: ['m3-quality'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Что возвращает `await pool.execute(sql, params)`?',
        options: [
          { id: 'a', text: 'Массив строк' },
          { id: 'b', text: 'Массив вида [rows, fields] — данные обычно берут деструктуризацией' },
          { id: 'c', text: 'Объект с полем data' },
          { id: 'd', text: 'Строку' },
        ],
        correct: 'b',
        explanation:
          'Пишут `const [rows] = await pool.execute(…)`. Забытая деструктуризация — причина загадочного «rows.map is not a function».',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Зачем нужен пул соединений вместо одного?',
        options: [
          { id: 'a', text: 'Он экономит память' },
          { id: 'b', text: 'Он переиспользует соединения и выдерживает параллельные запросы' },
          { id: 'c', text: 'Он шифрует трафик' },
          { id: 'd', text: 'Так требует TypeScript' },
        ],
        correct: 'b',
        explanation:
          'Одно соединение становится узким местом и рвётся по таймауту. Пул сам следит за состоянием соединений.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Что делает настройка `dateStrings: true`?',
        options: [
          { id: 'a', text: 'Возвращает даты строками в формате базы, без преобразования в Date и сдвига часового пояса' },
          { id: 'b', text: 'Форматирует даты как ДД.ММ.ГГГГ' },
          { id: 'c', text: 'Запрещает хранить даты' },
          { id: 'd', text: 'Ускоряет запросы' },
        ],
        correct: 'a',
        explanation:
          'Без неё дата может «уехать» на день из-за часового пояса. Для учебного проекта это лишний источник трудноуловимых ошибок.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Пароль от базы должен лежать в .env, а не в коде.',
        correct: true,
        explanation:
          '.env попадает в .gitignore. В репозиторий кладут .env.example с именами переменных и пустыми значениями.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Почему в настройках указывают `charset: "utf8mb4"`?',
        options: [
          { id: 'a', text: 'Для ускорения' },
          { id: 'b', text: 'Чтобы корректно хранились кириллица и эмодзи' },
          { id: 'c', text: 'Так требует Express' },
          { id: 'd', text: 'Для совместимости со старыми версиями' },
        ],
        correct: 'b',
        explanation:
          'Неверная кодировка проявляется вопросительными знаками вместо русских букв в базе — и это обнаруживается в самый неподходящий момент.',
      },
    ],
  },

  {
    id: 'quiz-api-design',
    title: 'Проектирование API',
    topicIds: ['api-design'],
    tech: ['express'],
    monthNo: 4,
    difficulty: 2,
    passPercent: 70,
    examRefs: ['m3-quality'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Какой адрес правильнее для создания заявки?',
        options: [
          { id: 'a', text: 'POST /api/createOrder' },
          { id: 'b', text: 'POST /api/orders' },
          { id: 'c', text: 'GET /api/orders/create' },
          { id: 'd', text: 'POST /api/order/new' },
        ],
        correct: 'b',
        explanation:
          'Действие выражает метод, адрес называет ресурс во множественном числе. Глаголы в адресах — признак непродуманного API.',
      },
      {
        id: 'q2',
        type: 'match',
        text: 'Сопоставьте группу маршрутов и уровень доступа.',
        left: [
          { id: 'l1', text: '/api/auth/register, /api/auth/login' },
          { id: 'l2', text: '/api/orders (свои заявки)' },
          { id: 'l3', text: '/api/admin/orders' },
          { id: 'l4', text: '/api/rooms (справочник)' },
        ],
        right: [
          { id: 'r1', text: 'Доступно всем' },
          { id: 'r2', text: 'Требуется вход' },
          { id: 'r3', text: 'Требуется роль администратора' },
          { id: 'r4', text: 'Доступно всем или вошедшим — по решению автора' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
        explanation:
          'Разделение по группам позволяет повесить middleware сразу на всю группу, а не на каждый маршрут отдельно.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Какой формат ошибки удобнее для клиента?',
        options: [
          { id: 'a', text: 'Текстовая строка' },
          { id: 'b', text: 'Объект { message } и при необходимости { errors: { поле: текст } }' },
          { id: 'c', text: 'HTML-страница' },
          { id: 'd', text: 'Пустое тело с кодом' },
        ],
        correct: 'b',
        explanation:
          'Тогда клиент раскладывает ошибки по полям формы одной строкой кода. Единый формат экономит время на обеих сторонах.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Описание API в README помогает и проверяющему, и вам самим.',
        correct: true,
        explanation:
          'Таблица «метод — адрес — кто может — что возвращает» занимает полстраницы и показывает продуманность решения.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Каким кодом отвечать на успешное создание записи?',
        options: [
          { id: 'a', text: '200' },
          { id: 'b', text: '201' },
          { id: 'c', text: '204' },
          { id: 'd', text: '302' },
        ],
        correct: 'b',
        explanation:
          '201 Created — стандарт для созданных ресурсов. 204 No Content подходит для успешного действия без тела ответа.',
      },
    ],
  },

  {
    id: 'quiz-server-validation',
    title: 'Валидация на сервере',
    topicIds: ['server-validation'],
    tech: ['express', 'security'],
    monthNo: 4,
    difficulty: 3,
    passPercent: 80,
    examRefs: ['m1-register', 'm3-quality'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Почему клиентской проверки недостаточно?',
        options: [
          { id: 'a', text: 'Она медленная' },
          { id: 'b', text: 'Запрос можно отправить в обход интерфейса — из консоли или любой утилиты' },
          { id: 'c', text: 'Она не работает на телефоне' },
          { id: 'd', text: 'Её достаточно' },
        ],
        correct: 'b',
        explanation:
          'Клиентская проверка — это удобство. Единственная настоящая защита данных — на сервере.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Каким кодом отвечать на некорректные данные формы?',
        options: [
          { id: 'a', text: '400' },
          { id: 'b', text: '401' },
          { id: 'c', text: '403' },
          { id: 'd', text: '500' },
        ],
        correct: 'a',
        explanation:
          '400 Bad Request. Для занятого логина уместнее 409 Conflict — это тоже ошибка клиента, но другого рода.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Пользователь запрашивает заявку с чужим id. Что должен сделать сервер?',
        options: [
          { id: 'a', text: 'Вернуть данные — id же передан' },
          { id: 'b', text: 'Проверить, что заявка принадлежит пользователю из токена, и иначе ответить 403 или 404' },
          { id: 'c', text: 'Вернуть пустой объект' },
          { id: 'd', text: 'Ответить 500' },
        ],
        correct: 'b',
        explanation:
          'Проверка принадлежности — обязательный пункт. Иначе подстановка чужого id открывает доступ ко всем заявкам системы.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Правила валидации на сервере должны совпадать с клиентскими: логин 6+ символов латиницей и цифрами, пароль 8+.',
        correct: true,
        explanation:
          'Расхождение приводит к странному поведению: форма пропускает, сервер отвергает. Правила берутся из задания дословно.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Зачем нужен белый список значений?',
        options: [
          { id: 'a', text: 'Для ускорения' },
          { id: 'b', text: 'Чтобы в запрос не попало произвольное имя столбца или статуса, присланное клиентом' },
          { id: 'c', text: 'Так требует MySQL' },
          { id: 'd', text: 'Для логирования' },
        ],
        correct: 'b',
        explanation:
          'Имя столбца для сортировки нельзя подставить параметром — только проверкой по списку допустимых значений.',
      },
    ],
  },

  {
    id: 'quiz-auth-hashing',
    title: 'Хеширование пароля',
    topicIds: ['auth-hashing'],
    tech: ['security', 'node'],
    monthNo: 4,
    difficulty: 3,
    passPercent: 80,
    examRefs: ['m1-register', 'm3-quality'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Почему пароль нельзя хранить в открытом виде?',
        options: [
          { id: 'a', text: 'Он занимает много места' },
          { id: 'b', text: 'При утечке базы все пароли окажутся у злоумышленника — а люди повторяют их на других сайтах' },
          { id: 'c', text: 'Так требует MySQL' },
          { id: 'd', text: 'Это замедляет вход' },
        ],
        correct: 'b',
        explanation:
          'Хранение пароля открытым текстом — грубая ошибка, которую видно сразу при просмотре таблицы users.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Как проверить пароль при входе?',
        options: [
          { id: 'a', text: 'Сравнить строки: password === user.password_hash' },
          { id: 'b', text: 'await bcrypt.compare(password, user.password_hash)' },
          { id: 'c', text: 'Захешировать и сравнить хеши строкой' },
          { id: 'd', text: 'Расшифровать хеш' },
        ],
        correct: 'b',
        explanation:
          'Хеш нельзя расшифровать. compare сам извлекает соль из сохранённого хеша и повторяет вычисление.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Почему два одинаковых пароля дают разные хеши?',
        options: [
          { id: 'a', text: 'Из-за ошибки в библиотеке' },
          { id: 'b', text: 'К паролю добавляется случайная соль, которая хранится внутри хеша' },
          { id: 'c', text: 'Из-за времени создания' },
          { id: 'd', text: 'Они одинаковые' },
        ],
        correct: 'b',
        explanation:
          'Соль защищает от радужных таблиц: заранее посчитанный словарь хешей становится бесполезен.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Сколько раундов bcrypt разумно для учебного проекта?',
        options: [
          { id: 'a', text: '1' },
          { id: 'b', text: '10' },
          { id: 'c', text: '30' },
          { id: 'd', text: '100' },
        ],
        correct: 'b',
        explanation:
          '10–12 — принятый компромисс. Каждый раунд удваивает время: при 30 раундах регистрация будет идти минутами.',
      },
      {
        id: 'q5',
        type: 'boolean',
        text: 'Пароль администратора Demo20 в seed-скрипте тоже должен храниться в виде хеша.',
        correct: true,
        explanation:
          'Вход по Admin26 / Demo20 при этом работает как обычно: bcrypt.compare сверит введённый пароль с хешем.',
      },
    ],
  },

  {
    id: 'quiz-auth-jwt',
    title: 'JWT',
    topicIds: ['auth-jwt'],
    tech: ['security', 'node'],
    monthNo: 4,
    difficulty: 3,
    passPercent: 80,
    examRefs: ['m1-login'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Из каких частей состоит JWT?',
        options: [
          { id: 'a', text: 'Заголовок, полезная нагрузка, подпись' },
          { id: 'b', text: 'Логин и пароль' },
          { id: 'c', text: 'Ключ и значение' },
          { id: 'd', text: 'Одна зашифрованная строка' },
        ],
        correct: 'a',
        explanation:
          'Три части через точку, закодированные base64. Подпись гарантирует, что содержимое не подменяли.',
      },
      {
        id: 'q2',
        type: 'boolean',
        text: 'Содержимое JWT зашифровано и его нельзя прочитать без ключа.',
        correct: false,
        explanation:
          'Оно только закодировано: любой может раскодировать и прочитать. Подпись защищает от изменения, но не от чтения — поэтому пароль в токен не кладут.',
      },
      {
        id: 'q3',
        type: 'multiple',
        text: 'Что уместно положить в токен?',
        options: [
          { id: 'a', text: 'id пользователя' },
          { id: 'b', text: 'Роль' },
          { id: 'c', text: 'Логин' },
          { id: 'd', text: 'Пароль' },
          { id: 'e', text: 'Хеш пароля' },
        ],
        correct: ['a', 'b', 'c'],
        explanation:
          'Ни пароля, ни его хеша — токен читается кем угодно. Достаточно идентификатора и роли.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Что делает `jwt.verify`?',
        options: [
          { id: 'a', text: 'Расшифровывает токен' },
          { id: 'b', text: 'Проверяет подпись и срок действия, возвращает содержимое или бросает ошибку' },
          { id: 'c', text: 'Создаёт новый токен' },
          { id: 'd', text: 'Сравнивает с базой' },
        ],
        correct: 'b',
        explanation:
          'Вызывать его нужно в try/catch: просроченный или подделанный токен бросает исключение, на которое отвечают 401.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Разумный срок жизни токена для учебного проекта?',
        options: [
          { id: 'a', text: '1 минута' },
          { id: 'b', text: 'Несколько часов или сутки' },
          { id: 'c', text: 'Год' },
          { id: 'd', text: 'Бессрочно' },
        ],
        correct: 'b',
        explanation:
          'Минута заставит проверяющего входить заново посреди работы. Бессрочный токен — дыра: отозвать его нельзя.',
      },
    ],
  },

  {
    id: 'quiz-auth-middleware',
    title: 'Middleware проверки токена',
    topicIds: ['auth-middleware'],
    tech: ['express', 'security'],
    monthNo: 4,
    difficulty: 3,
    passPercent: 80,
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Какова сигнатура middleware в Express?',
        options: [
          { id: 'a', text: '(req, res)' },
          { id: 'b', text: '(req, res, next)' },
          { id: 'c', text: '(next, req, res)' },
          { id: 'd', text: '(app, req, res)' },
        ],
        correct: 'b',
        explanation:
          'Вызов next() передаёт управление дальше. Если его не вызвать и не ответить — запрос повиснет до таймаута.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Как извлечь токен из заголовка `Authorization: Bearer abc.def.ghi`?',
        options: [
          { id: 'a', text: 'req.headers.authorization' },
          { id: 'b', text: 'req.headers.authorization?.split(" ")[1]' },
          { id: 'c', text: 'req.headers.token' },
          { id: 'd', text: 'req.body.token' },
        ],
        correct: 'b',
        explanation:
          'Нужна часть после слова Bearer. Опциональная цепочка защищает от случая, когда заголовка нет вовсе.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Как передать данные пользователя дальше, в обработчик маршрута?',
        options: [
          { id: 'a', text: 'Через глобальную переменную' },
          { id: 'b', text: 'Положить в req.user перед вызовом next()' },
          { id: 'c', text: 'Через res.locals обязательно' },
          { id: 'd', text: 'Никак, нужно проверять токен заново' },
        ],
        correct: 'b',
        explanation:
          'Глобальная переменная сломается при параллельных запросах — данные одного пользователя попадут другому. req принадлежит одному запросу.',
      },
      {
        id: 'q4',
        type: 'single',
        text: 'Токена нет. Что делает middleware?',
        options: [
          { id: 'a', text: 'Вызывает next()' },
          { id: 'b', text: 'Отвечает res.status(401).json({ message: … }) и НЕ вызывает next()' },
          { id: 'c', text: 'Бросает исключение' },
          { id: 'd', text: 'Возвращает пустой объект' },
        ],
        correct: 'b',
        explanation:
          'Ранний ответ прекращает цепочку. Вызвать и res.json, и next() — ошибка «Cannot set headers after they are sent».',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Как защитить сразу все админские маршруты?',
        options: [
          { id: 'a', text: 'app.use("/api/admin", authMiddleware, adminMiddleware, adminRouter)' },
          { id: 'b', text: 'Добавить проверку в каждый обработчик вручную' },
          { id: 'c', text: 'Проверять на клиенте' },
          { id: 'd', text: 'Это невозможно' },
        ],
        correct: 'a',
        explanation:
          'Один раз на группу — и забыть проверку в новом маршруте невозможно. Это и надёжнее, и короче.',
      },
    ],
  },

  {
    id: 'quiz-auth-roles',
    title: 'Роли и доступ',
    topicIds: ['auth-roles'],
    tech: ['security', 'express'],
    monthNo: 4,
    difficulty: 3,
    passPercent: 80,
    examRefs: ['m1-admin'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Откуда сервер должен брать роль пользователя?',
        options: [
          { id: 'a', text: 'Из localStorage клиента' },
          { id: 'b', text: 'Из подписанного токена (или из базы по id из токена)' },
          { id: 'c', text: 'Из тела запроса' },
          { id: 'd', text: 'Из query-параметра' },
        ],
        correct: 'b',
        explanation:
          'Всё, что прислал клиент, подделывается за секунду. Токен подписан секретным ключом — изменить его содержимое незаметно нельзя.',
      },
      {
        id: 'q2',
        type: 'match',
        text: 'Сопоставьте роль и доступные действия.',
        left: [
          { id: 'l1', text: 'Гость' },
          { id: 'l2', text: 'Пользователь' },
          { id: 'l3', text: 'Администратор' },
        ],
        right: [
          { id: 'r1', text: 'Регистрация и вход' },
          { id: 'r2', text: 'Свои заявки, создание заявки, отзывы' },
          { id: 'r3', text: 'Все заявки и смена их статуса' },
        ],
        correct: { l1: 'r1', l2: 'r2', l3: 'r3' },
        explanation:
          'Администратор обычно имеет и права пользователя. Обратное — никогда.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'В чём разница между кодами 401 и 403?',
        options: [
          { id: 'a', text: 'Это синонимы' },
          { id: 'b', text: '401 — не аутентифицирован (войдите), 403 — вошёл, но прав не хватает' },
          { id: 'c', text: '401 — ошибка сервера' },
          { id: 'd', text: '403 — страница не найдена' },
        ],
        correct: 'b',
        explanation:
          'Клиент реагирует по-разному: при 401 отправляет на страницу входа, при 403 показывает сообщение о недостатке прав.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Проверка «это твоя запись» нужна даже после проверки токена.',
        correct: true,
        explanation:
          'Токен подтверждает, кто вы. Он ничего не говорит о том, ваша ли это заявка. Нужны обе проверки.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Где создаётся учётная запись администратора Admin26?',
        options: [
          { id: 'a', text: 'Через форму регистрации' },
          { id: 'b', text: 'В seed-скрипте или в schema.sql, с хешем пароля и ролью admin' },
          { id: 'c', text: 'Вручную в Workbench с открытым паролем' },
          { id: 'd', text: 'Автоматически при первом запуске' },
        ],
        correct: 'b',
        explanation:
          'Регистрация не должна позволять создать администратора. Скрипт заодно документирует, откуда взялась эта запись.',
      },
    ],
  },

  {
    id: 'quiz-server-architecture',
    title: 'Репозиторий заявок',
    topicIds: ['server-architecture'],
    tech: ['express', 'ts'],
    monthNo: 4,
    difficulty: 3,
    passPercent: 70,
    examRefs: ['m1-oop-styles', 'm3-quality'],
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: 'Что такое класс-репозиторий?',
        options: [
          { id: 'a', text: 'Git-репозиторий проекта' },
          { id: 'b', text: 'Класс, который собирает все запросы к одной таблице в своих методах' },
          { id: 'c', text: 'Хранилище файлов' },
          { id: 'd', text: 'Кеш данных' },
        ],
        correct: 'b',
        explanation:
          'findByUser, create, updateStatus — весь SQL по заявкам живёт в одном месте. И это же закрывает требование задания об ООП.',
      },
      {
        id: 'q2',
        type: 'single',
        text: 'Как репозиторий получает доступ к базе?',
        options: [
          { id: 'a', text: 'Создаёт соединение сам' },
          { id: 'b', text: 'Получает пул через конструктор' },
          { id: 'c', text: 'Через глобальную переменную' },
          { id: 'd', text: 'Через импорт внутри каждого метода' },
        ],
        correct: 'b',
        explanation:
          'Передача зависимости в конструктор позволяет подменить пул в тестах и не создавать соединения в неожиданных местах.',
      },
      {
        id: 'q3',
        type: 'single',
        text: 'Что означает «тонкие маршруты, толстый репозиторий»?',
        options: [
          { id: 'a', text: 'Маршрутов должно быть мало' },
          { id: 'b', text: 'Обработчик маршрута только проверяет вход и вызывает метод репозитория, а работа с данными — внутри класса' },
          { id: 'c', text: 'Репозиторий должен быть большим файлом' },
          { id: 'd', text: 'Всю логику писать в маршрутах' },
        ],
        correct: 'b',
        explanation:
          'Обработчик на 5–10 строк читается мгновенно. Это прямо влияет на оценку качества кода в модуле 3.',
      },
      {
        id: 'q4',
        type: 'boolean',
        text: 'Класс с единственным методом и без полей обычно не нужен — достаточно функции.',
        correct: true,
        explanation:
          'ООП ради ООП усложняет код. Класс уместен там, где есть общее состояние и набор связанных операций.',
      },
      {
        id: 'q5',
        type: 'single',
        text: 'Какое требование задания закрывает наличие класса в проекте?',
        options: [
          { id: 'a', text: 'Требование об адаптивности' },
          { id: 'b', text: 'Требование использовать объектно-ориентированный подход' },
          { id: 'c', text: 'Требование о коммитах' },
          { id: 'd', text: 'Требование о слайдере' },
        ],
        correct: 'b',
        explanation:
          'В том же пункте задания требуется библиотека стилей из node_modules — оба требования стоит закрывать осознанно и уметь показать, где именно.',
      },
    ],
  },
];
