import type { Task } from '../types';

/** Сборки недель 5-8: JavaScript, DOM, современный JS, TypeScript. */
export const WEEK_ASSEMBLY_M2: Task[] = [
  {
    id: 'task-week-05-assembly',
    title: 'Сборка недели 5: пять задач на функции и массивы без подсказок',
    kind: 'function',
    runtime: 'js',
    difficulty: 3,
    tech: ['js'],
    topicIds: ['js-functions', 'js-arrays', 'js-objects', 'js-loops'],
    monthNo: 2,
    weekNo: 5,
    statement: `Неделя закончилась. Пять задач подряд, без конспекта — по одной на каждый день недели.

1. **день 2, операторы** — \`priceWithVat(price)\`: прибавляет 20% и округляет до целого.
2. **день 3, циклы** — \`sumPrices(orders)\`: сумма поля \`price\` у всех заявок. Пустой массив — \`0\`.
3. **день 4, функции** — \`longestRoom(orders)\`: название самого длинного помещения. Если заявок нет — пустая строка.
4. **день 5, массивы** — \`paidOnly(orders)\`: новый массив только из оплаченных (\`paid: true\`). Исходный массив менять нельзя.
5. **день 6, объекты** — \`countByStatus(orders)\`: объект вида \`{ 'Новая': 2, 'Выполнена': 1 }\`. Статусы заранее не известны — считайте те, что встретились.

Каждая заявка выглядит так:

\`\`\`js
{ id: 1, room: 'Коворкинг', price: 1500, paid: true, status: 'Новая' }
\`\`\``,
    requirements: [
      'priceWithVat прибавляет 20% и округляет до целого',
      'sumPrices считает сумму, для пустого массива возвращает 0',
      'longestRoom находит самое длинное название, для пустого массива — пустую строку',
      'paidOnly возвращает новый массив и не меняет исходный',
      'countByStatus считает заявки по статусам',
    ],
    starterCode: `function priceWithVat(price) {
  // прибавить 20% и округлить до целого
}

function sumPrices(orders) {
  // сумма поля price
}

function longestRoom(orders) {
  // название самого длинного помещения
}

function paidOnly(orders) {
  // новый массив только из оплаченных
}

function countByStatus(orders) {
  // { 'Новая': 2, 'Выполнена': 1 }
}`,
    tests: [
      {
        id: 'vat-1',
        name: 'priceWithVat(1500) → 1800',
        type: 'call',
        entry: 'priceWithVat',
        args: [1500],
        expected: 1800,
      },
      {
        id: 'vat-2',
        name: 'priceWithVat(999) округляется до целого',
        type: 'call',
        entry: 'priceWithVat',
        args: [999],
        expected: 1199,
        points: 2,
      },
      {
        id: 'sum',
        name: 'sumPrices считает сумму',
        type: 'call',
        entry: 'sumPrices',
        args: [
          [
            { id: 1, room: 'Коворкинг', price: 1500, paid: true, status: 'Новая' },
            { id: 2, room: 'Кинозал', price: 2500, paid: false, status: 'Новая' },
          ],
        ],
        expected: 4000,
        points: 2,
      },
      {
        id: 'sum-empty',
        name: 'sumPrices([]) → 0',
        type: 'call',
        entry: 'sumPrices',
        args: [[]],
        expected: 0,
      },
      {
        id: 'longest',
        name: 'longestRoom находит самое длинное название',
        type: 'call',
        entry: 'longestRoom',
        args: [
          [
            { id: 1, room: 'Кинозал', price: 1000, paid: true, status: 'Новая' },
            { id: 2, room: 'Аудитория на 100 мест', price: 1000, paid: true, status: 'Новая' },
            { id: 3, room: 'Коворкинг', price: 1000, paid: true, status: 'Новая' },
          ],
        ],
        expected: 'Аудитория на 100 мест',
        points: 2,
      },
      {
        id: 'longest-empty',
        name: 'longestRoom([]) → пустая строка',
        type: 'call',
        entry: 'longestRoom',
        args: [[]],
        expected: '',
      },
      {
        id: 'paid',
        name: 'paidOnly отбирает оплаченные',
        type: 'call',
        entry: 'paidOnly',
        args: [
          [
            { id: 1, room: 'Коворкинг', price: 1500, paid: true, status: 'Новая' },
            { id: 2, room: 'Кинозал', price: 2500, paid: false, status: 'Новая' },
            { id: 3, room: 'Аудитория', price: 3000, paid: true, status: 'Выполнена' },
          ],
        ],
        expected: [
          { id: 1, room: 'Коворкинг', price: 1500, paid: true, status: 'Новая' },
          { id: 3, room: 'Аудитория', price: 3000, paid: true, status: 'Выполнена' },
        ],
        compare: 'deep',
        points: 2,
      },
      {
        id: 'paid-pure',
        name: 'paidOnly не портит исходный массив',
        type: 'assert',
        code: `const paidOnly = ctx.get('paidOnly');
const orders = [
  { id: 1, room: 'Коворкинг', price: 1500, paid: true, status: 'Новая' },
  { id: 2, room: 'Кинозал', price: 2500, paid: false, status: 'Новая' },
];
const result = paidOnly(orders);
ctx.assert(orders.length === 2, 'Исходный массив изменился: было 2 заявки, стало ' + orders.length + '. Скорее всего использован splice вместо filter');
ctx.assert(result !== orders, 'Нужно вернуть новый массив, а не тот же самый');`,
        points: 3,
      },
      {
        id: 'count',
        name: 'countByStatus считает по статусам',
        type: 'call',
        entry: 'countByStatus',
        args: [
          [
            { id: 1, room: 'Коворкинг', price: 1500, paid: true, status: 'Новая' },
            { id: 2, room: 'Кинозал', price: 2500, paid: false, status: 'Новая' },
            { id: 3, room: 'Аудитория', price: 3000, paid: true, status: 'Выполнена' },
          ],
        ],
        expected: { Новая: 2, Выполнена: 1 },
        compare: 'deep',
        points: 3,
      },
      {
        id: 'count-empty',
        name: 'countByStatus([]) → пустой объект',
        type: 'call',
        entry: 'countByStatus',
        args: [[]],
        expected: {},
        compare: 'deep',
        points: 2,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Для суммы и подсчёта по статусам удобен reduce: он идёт по массиву и накапливает один результат.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'filter всегда возвращает новый массив и не трогает исходный — именно поэтому он подходит для paidOnly, а splice нет.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'countByStatus: const result = {}; for (const order of orders) { result[order.status] = (result[order.status] || 0) + 1; } return result;',
        penaltyPercent: 35,
      },
    ],
    solution: `function priceWithVat(price) {
  return Math.round(price * 1.2);
}

function sumPrices(orders) {
  return orders.reduce((sum, order) => sum + order.price, 0);
}

function longestRoom(orders) {
  if (orders.length === 0) return '';
  return orders.reduce((longest, order) => (order.room.length > longest.length ? order.room : longest), '');
}

function paidOnly(orders) {
  return orders.filter((order) => order.paid === true);
}

function countByStatus(orders) {
  const result = {};
  for (const order of orders) {
    result[order.status] = (result[order.status] || 0) + 1;
  }
  return result;
}`,
    solutionExplanation:
      'Приём с начальным значением у reduce закрывает сразу два случая: для суммы это 0, для поиска самой длинной строки — пустая строка. Без начального значения reduce на пустом массиве выбрасывает ошибку, и пришлось бы писать отдельную проверку. Запись (result[order.status] || 0) + 1 читается так: «взять то, что уже насчитали, а если ничего — начать с нуля». Это стандартный способ считать что угодно по группам.',
    maxScore: 19,
    estimatedMinutes: 35,
    examRefs: ['m1-cabinet', 'm3-quality'],
    planDays: ['day-05-7'],
    source: 'plan',
  },

  {
    id: 'task-week-06-assembly',
    title: 'Сборка недели 6: слайдер и валидация за 30 минут',
    kind: 'app',
    runtime: 'dom',
    difficulty: 4,
    tech: ['js', 'html'],
    topicIds: ['js-dom', 'js-events', 'js-validation', 'js-timers'],
    monthNo: 2,
    weekNo: 6,
    statement: `Вчера это заняло два часа. Сегодня цель — **30 минут** на обе части. Разметка и стили уже готовы, пишите только JavaScript.

**Слайдер** — требование модуля 2 дословно: «4 изображения с автоматическим переключением через 3 секунды».

1. Активен слайд с классом \`active\` — в каждый момент ровно один.
2. Каждые **3 секунды** активным становится следующий; после четвёртого — снова первый.
3. Кнопки \`#prev\` и \`#next\` переключают вручную.

**Валидация формы** — требование модуля 2: «подсказки об ошибках рядом с формой».

4. По отправке формы проверяются логин (латиница и цифры, от 6 символов) и пароль (от 8 символов).
5. Ошибка выводится в соседний блок \`.error\` рядом с полем, а не в \`alert\`.
6. Если ошибок нет, все сообщения \`.error\` пустые, и форма получает класс \`sent\`.
7. Страница при отправке не перезагружается.`,
    requirements: [
      'В каждый момент активен ровно один слайд',
      'Слайды переключаются сами каждые 3 секунды',
      'Кнопки вперёд и назад работают',
      'После последнего слайда идёт первый',
      'Ошибки выводятся в блоки .error рядом с полями',
      'При верных данных ошибок нет и форма получает класс sent',
      'Отправка формы не перезагружает страницу',
    ],
    starterCode: `<div class="slider">
  <div class="slide active">Слайд 1</div>
  <div class="slide">Слайд 2</div>
  <div class="slide">Слайд 3</div>
  <div class="slide">Слайд 4</div>
  <button id="prev" type="button">Назад</button>
  <button id="next" type="button">Вперёд</button>
</div>

<form id="login-form" novalidate>
  <label for="login">Логин</label>
  <input type="text" id="login" name="login">
  <p class="error" id="login-error"></p>

  <label for="password">Пароль</label>
  <input type="password" id="password" name="password">
  <p class="error" id="password-error"></p>

  <button type="submit">Войти</button>
</form>

<style>
  body { font-family: system-ui, sans-serif; padding: 16px; }
  .slide { display: none; padding: 32px; background: #e2e8f0; border-radius: 12px; }
  .slide.active { display: block; }
  .error { min-height: 18px; margin: 4px 0 12px; color: #dc2626; font-size: 0.85rem; }
  form.sent { outline: 2px solid #16a34a; }
</style>

<script>
  // 1-3. Слайдер: автопереключение через 3 секунды и кнопки

  // 4-7. Валидация формы с выводом ошибок рядом с полями
</script>`,
    viewport: { width: 700, height: 700 },
    tests: [
      {
        id: 'one-active',
        name: 'Активен ровно один слайд',
        type: 'dom',
        code: `const active = ctx.$$('.slide.active');
ctx.assert(active.length === 1, 'Активным должен быть ровно один слайд, сейчас: ' + active.length, 1, active.length);
ctx.assert(ctx.$$('.slide').length === 4, 'Слайдов должно остаться четыре');`,
        points: 2,
      },
      {
        id: 'next-button',
        name: 'Кнопка «Вперёд» переключает слайд',
        type: 'dom',
        code: `const slides = ctx.$$('.slide');
const before = slides.indexOf(ctx.$('.slide.active'));
ctx.click('#next');
const after = slides.indexOf(ctx.$('.slide.active'));
ctx.assert(after === (before + 1) % 4, 'После «Вперёд» должен стать следующий слайд: был ' + before + ', стал ' + after);`,
        points: 2,
      },
      {
        id: 'prev-wraps',
        name: 'С первого слайда «Назад» ведёт на последний',
        type: 'dom',
        code: `const slides = ctx.$$('.slide');
// Возвращаемся на первый слайд, сколько бы ни было нажатий до этого.
for (let step = 0; step < 4; step += 1) {
  if (slides.indexOf(ctx.$('.slide.active')) === 0) break;
  ctx.click('#next');
}
ctx.assert(slides.indexOf(ctx.$('.slide.active')) === 0, 'Не удалось вернуться на первый слайд');
ctx.click('#prev');
const after = slides.indexOf(ctx.$('.slide.active'));
ctx.assert(after === 3, 'С первого слайда «Назад» должно вести на четвёртый, получили: ' + (after + 1), 3, after);`,
        points: 3,
      },
      {
        id: 'autoplay',
        name: 'Слайды переключаются сами через 3 секунды',
        type: 'dom',
        code: `const slides = ctx.$$('.slide');
const before = slides.indexOf(ctx.$('.slide.active'));
return ctx.wait(3400).then(function () {
  const after = slides.indexOf(ctx.$('.slide.active'));
  ctx.assert(
    after !== before,
    'За 3.4 секунды слайд не сменился. Задание требует автопереключение каждые 3 секунды — нужен setInterval',
  );
  ctx.assert(ctx.$$('.slide.active').length === 1, 'После автопереключения активным должен остаться ровно один слайд');
});`,
        points: 4,
      },
      {
        id: 'errors-shown',
        name: 'Ошибки появляются рядом с полями',
        type: 'dom',
        code: `ctx.$('#login').value = 'ив';
ctx.$('#password').value = '123';
ctx.$('#login-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
return ctx.wait(50).then(function () {
  const loginError = ctx.text('#login-error');
  const passwordError = ctx.text('#password-error');
  ctx.assert(loginError.length > 0, 'Рядом с полем логина нет сообщения об ошибке');
  ctx.assert(passwordError.length > 0, 'Рядом с полем пароля нет сообщения об ошибке');
  ctx.assert(!ctx.$('#login-form').classList.contains('sent'), 'Форма с ошибками не должна получать класс sent');
});`,
        points: 4,
      },
      {
        id: 'valid-submit',
        name: 'Верные данные проходят',
        type: 'dom',
        code: `ctx.$('#login').value = 'ivanov26';
ctx.$('#password').value = 'demo2026pass';
ctx.$('#login-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
return ctx.wait(50).then(function () {
  ctx.assert(ctx.text('#login-error') === '', 'После исправления сообщение об ошибке логина должно исчезнуть');
  ctx.assert(ctx.text('#password-error') === '', 'После исправления сообщение об ошибке пароля должно исчезнуть');
  ctx.assert(ctx.$('#login-form').classList.contains('sent'), 'При верных данных форме нужно добавить класс sent');
});`,
        points: 4,
      },
      {
        id: 'no-reload',
        name: 'Страница не перезагружается',
        type: 'dom',
        code: `const source = ctx.source || '';
ctx.assert(
  /preventDefault/.test(source),
  'Обработчику submit нужен event.preventDefault(), иначе браузер перезагрузит страницу и все сообщения исчезнут',
);
ctx.assert(!/alert\\s*\\(/.test(source), 'Ошибки выводятся рядом с полем, а не через alert — это отдельное требование модуля 2');`,
        points: 2,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Храните номер текущего слайда в переменной. Переключение — это снять класс active со старого и поставить новому.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Зацикливание по кругу делается остатком от деления: (current + 1) % slides.length. Назад — (current - 1 + slides.length) % slides.length, иначе получится −1.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'setInterval(() => show(current + 1), 3000) для автопрокрутки; в обработчике submit: event.preventDefault(), собрать ошибки, записать их в textContent соответствующих .error, при пустом списке — form.classList.add("sent").',
        penaltyPercent: 35,
      },
    ],
    solution: `<div class="slider">
  <div class="slide active">Слайд 1</div>
  <div class="slide">Слайд 2</div>
  <div class="slide">Слайд 3</div>
  <div class="slide">Слайд 4</div>
  <button id="prev" type="button">Назад</button>
  <button id="next" type="button">Вперёд</button>
</div>

<form id="login-form" novalidate>
  <label for="login">Логин</label>
  <input type="text" id="login" name="login">
  <p class="error" id="login-error"></p>

  <label for="password">Пароль</label>
  <input type="password" id="password" name="password">
  <p class="error" id="password-error"></p>

  <button type="submit">Войти</button>
</form>

<style>
  body { font-family: system-ui, sans-serif; padding: 16px; }
  .slide { display: none; padding: 32px; background: #e2e8f0; border-radius: 12px; }
  .slide.active { display: block; }
  .error { min-height: 18px; margin: 4px 0 12px; color: #dc2626; font-size: 0.85rem; }
  form.sent { outline: 2px solid #16a34a; }
</style>

<script>
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var current = 0;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === current);
    });
  }

  document.getElementById('next').addEventListener('click', function () {
    show(current + 1);
  });

  document.getElementById('prev').addEventListener('click', function () {
    show(current - 1);
  });

  setInterval(function () {
    show(current + 1);
  }, 3000);

  var form = document.getElementById('login-form');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var login = document.getElementById('login').value.trim();
    var password = document.getElementById('password').value;

    var loginError = '';
    var passwordError = '';

    if (!/^[A-Za-z0-9]{6,}$/.test(login)) {
      loginError = 'Логин: латинские буквы и цифры, минимум 6 символов';
    }
    if (password.length < 8) {
      passwordError = 'Пароль: минимум 8 символов';
    }

    document.getElementById('login-error').textContent = loginError;
    document.getElementById('password-error').textContent = passwordError;

    form.classList.toggle('sent', loginError === '' && passwordError === '');
  });
</script>`,
    solutionExplanation:
      'Функция show одна на все три способа переключения: кнопки и таймер просто зовут её с новым номером. Приведение (index + slides.length) % slides.length закрывает оба края сразу — и переход с последнего на первый, и с первого на последний, без единого if. Сообщения об ошибках пишутся в textContent всегда, даже когда ошибки нет: пустая строка стирает предыдущее сообщение. Если писать только при ошибке, старая подсказка останется висеть после исправления.',
    maxScore: 21,
    estimatedMinutes: 30,
    examRefs: ['m2-slider', 'm2-login-warnings', 'm2-register-hints'],
    planDays: ['day-06-7'],
    source: 'plan',
  },

  {
    id: 'task-week-07-assembly',
    title: 'Сборка недели 7: современный JavaScript по памяти',
    kind: 'function',
    runtime: 'js',
    difficulty: 4,
    tech: ['js'],
    topicIds: ['js-destructuring', 'js-array-methods', 'js-async', 'js-dates', 'js-localstorage'],
    monthNo: 2,
    weekNo: 7,
    statement: `Всё, без чего не поедет React — в одном задании. По задаче на каждый день недели.

1. **день 1, короткие записи** — \`shortInfo(user)\`: достаёт из объекта \`login\` и \`city\` через деструктуризацию, возвращает строку \`"ivanov26, Москва"\`. Если города нет — \`"Город не указан"\`.
2. **день 2, методы массивов** — \`roomsReport(orders)\`: вернуть массив названий помещений, у которых сумма заявок больше 2000, отсортированный по алфавиту.
3. **день 4, асинхронность** — \`loadAll(ids, loadOne)\`: получает массив номеров и функцию, которая по номеру возвращает промис. Нужно дождаться **всех сразу**, а не по очереди, и вернуть массив результатов в том же порядке.
4. **день 5, разбор ответа** — \`unwrap(response)\`: асинхронная функция. Если \`response.ok\` — вернуть \`response.data\`; иначе выбросить ошибку с текстом из \`response.error\`.
5. **день 6, даты** — \`toRuDate(iso)\`: превращает \`"2027-03-12"\` в \`"12.03.2027"\`.`,
    requirements: [
      'shortInfo использует деструктуризацию и значение по умолчанию',
      'roomsReport группирует, фильтрует и сортирует',
      'loadAll запускает загрузки параллельно, а не по очереди',
      'unwrap возвращает данные или выбрасывает ошибку',
      'toRuDate приводит дату к формату ДД.ММ.ГГГГ',
    ],
    starterCode: `function shortInfo(user) {
  // деструктуризация: login и city со значением по умолчанию
}

function roomsReport(orders) {
  // помещения с суммой больше 2000, по алфавиту
}

async function loadAll(ids, loadOne) {
  // дождаться всех сразу
}

async function unwrap(response) {
  // данные или ошибка
}

function toRuDate(iso) {
  // '2027-03-12' -> '12.03.2027'
}`,
    tests: [
      {
        id: 'short-info',
        name: 'shortInfo собирает строку',
        type: 'call',
        entry: 'shortInfo',
        args: [{ login: 'ivanov26', city: 'Москва' }],
        expected: 'ivanov26, Москва',
        points: 2,
      },
      {
        id: 'short-info-default',
        name: 'Без города подставляется заглушка',
        type: 'call',
        entry: 'shortInfo',
        args: [{ login: 'ivanov26' }],
        expected: 'ivanov26, Город не указан',
        points: 2,
      },
      {
        id: 'destructuring-used',
        name: 'Использована деструктуризация',
        type: 'assert',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(
  /const\\s*\\{|let\\s*\\{|function\\s+shortInfo\\s*\\(\\s*\\{/.test(source),
  'В shortInfo нужна деструктуризация: const { login, city = "Город не указан" } = user',
);`,
        points: 2,
      },
      {
        id: 'rooms-report',
        name: 'roomsReport отбирает и сортирует',
        type: 'call',
        entry: 'roomsReport',
        args: [
          [
            { room: 'Коворкинг', price: 1500 },
            { room: 'Коворкинг', price: 1000 },
            { room: 'Кинозал', price: 1500 },
            { room: 'Аудитория', price: 5000 },
          ],
        ],
        expected: ['Аудитория', 'Коворкинг'],
        compare: 'deep',
        points: 4,
      },
      {
        id: 'rooms-report-empty',
        name: 'roomsReport([]) → пустой массив',
        type: 'call',
        entry: 'roomsReport',
        args: [[]],
        expected: [],
        compare: 'deep',
      },
      {
        id: 'load-all-order',
        name: 'loadAll сохраняет порядок',
        type: 'assert',
        code: `const loadAll = ctx.get('loadAll');
const loadOne = (id) => new Promise((resolve) => setTimeout(() => resolve('заявка ' + id), (4 - id) * 40));
return loadAll([1, 2, 3], loadOne).then(function (result) {
  ctx.assert(Array.isArray(result), 'loadAll должна вернуть массив');
  ctx.assert(
    result.join('|') === 'заявка 1|заявка 2|заявка 3',
    'Порядок результатов должен совпадать с порядком номеров, получено: ' + result.join('|'),
  );
});`,
        points: 3,
      },
      {
        id: 'load-all-parallel',
        name: 'loadAll запускает загрузки параллельно',
        type: 'assert',
        code: `const loadAll = ctx.get('loadAll');
const loadOne = () => new Promise((resolve) => setTimeout(() => resolve('ok'), 120));
const started = Date.now();
return loadAll([1, 2, 3, 4], loadOne).then(function () {
  const spent = Date.now() - started;
  ctx.assert(
    spent < 400,
    'Четыре загрузки по 120 мс заняли ' + spent + ' мс — значит они шли по очереди. Нужен Promise.all, а не await в цикле',
  );
});`,
        points: 4,
      },
      {
        id: 'unwrap-ok',
        name: 'unwrap возвращает данные',
        type: 'assert',
        code: `const unwrap = ctx.get('unwrap');
return unwrap({ ok: true, data: [1, 2, 3] }).then(function (data) {
  ctx.assert(Array.isArray(data) && data.length === 3, 'При ok: true должны вернуться данные, получено: ' + ctx.preview(data));
});`,
        points: 2,
      },
      {
        id: 'unwrap-error',
        name: 'unwrap выбрасывает ошибку',
        type: 'assert',
        code: `const unwrap = ctx.get('unwrap');
return unwrap({ ok: false, error: 'Заявка не найдена' }).then(
  function () {
    ctx.assert(false, 'При ok: false функция должна выбросить ошибку, а не вернуть значение');
  },
  function (error) {
    ctx.assert(
      String(error.message || error).indexOf('Заявка не найдена') !== -1,
      'В тексте ошибки должно быть сообщение из response.error, получено: ' + (error.message || error),
    );
  },
);`,
        points: 3,
      },
      {
        id: 'ru-date',
        name: 'toRuDate приводит дату к формату задания',
        type: 'call',
        entry: 'toRuDate',
        args: ['2027-03-12'],
        expected: '12.03.2027',
        points: 2,
      },
      {
        id: 'ru-date-pad',
        name: 'Однозначные день и месяц дополняются нулём',
        type: 'call',
        entry: 'toRuDate',
        args: ['2027-01-05'],
        expected: '05.01.2027',
        points: 2,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Значение по умолчанию задаётся прямо в деструктуризации: const { city = "Город не указан" } = user.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Promise.all принимает массив промисов и возвращает промис с массивом результатов в том же порядке. Массив промисов удобно получить из ids.map(loadOne).',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'roomsReport: сначала reduce в объект { помещение: сумма }, затем Object.keys(...).filter((room) => totals[room] > 2000).sort(). toRuDate: iso.split("-").reverse().join(".").',
        penaltyPercent: 35,
      },
    ],
    solution: `function shortInfo(user) {
  const { login, city = 'Город не указан' } = user;
  return login + ', ' + city;
}

function roomsReport(orders) {
  const totals = orders.reduce((acc, order) => {
    acc[order.room] = (acc[order.room] || 0) + order.price;
    return acc;
  }, {});

  return Object.keys(totals)
    .filter((room) => totals[room] > 2000)
    .sort((a, b) => a.localeCompare(b, 'ru'));
}

async function loadAll(ids, loadOne) {
  return Promise.all(ids.map((id) => loadOne(id)));
}

async function unwrap(response) {
  if (!response.ok) {
    throw new Error(response.error);
  }
  return response.data;
}

function toRuDate(iso) {
  const [year, month, day] = iso.split('-');
  return day + '.' + month + '.' + year;
}`,
    solutionExplanation:
      'Разница между Promise.all и await в цикле — это разница между «полторы секунды» и «шесть секунд» на четырёх запросах, и проверка её действительно измеряет. В React это встретится сразу же: компонент запрашивает несколько списков при открытии страницы, и по очереди их грузить нельзя. Дата собирается разбором строки, а не через new Date: конструктор даты учитывает часовой пояс, и в UTC+3 дата «2027-03-12» легко превращается в 11 марта.',
    maxScore: 27,
    estimatedMinutes: 45,
    examRefs: ['m2-order-form', 'm3-quality'],
    planDays: ['day-07-7'],
    source: 'plan',
  },

  {
    id: 'task-week-08-assembly',
    title: 'Контроль месяца 2: TypeScript за час без подсказок',
    kind: 'function',
    runtime: 'ts',
    difficulty: 4,
    tech: ['ts'],
    topicIds: ['ts-basics', 'ts-types', 'ts-functions', 'ts-oop'],
    monthNo: 2,
    weekNo: 8,
    statement: `Контрольная за второй месяц. **60 минут**, без подсказок и конспекта.

Типизируйте и напишите модуль регистрации целиком.

1. Опишите тип \`Registration\` с полями \`login\`, \`password\`, \`fullName\`, \`phone\`, \`email\` — все строки.
2. Опишите тип \`ValidationResult\`: поле \`ok: boolean\` и поле \`errors: string[]\`.
3. \`validate(data: Registration): ValidationResult\` — проверяет все пять полей. В \`errors\` попадают имена полей, которые не прошли:
   - \`login\` — латиница и цифры, минимум 6 символов;
   - \`password\` — минимум 8 символов;
   - \`fullName\` — минимум два слова;
   - \`phone\` — минимум 10 цифр (всё остальное игнорируется);
   - \`email\` — есть \`@\` и точка после неё.
4. \`class UserStore\` с приватным массивом: метод \`add(data: Registration): number\` возвращает номер, \`total(): number\` — количество, \`findByLogin(login: string): Registration | undefined\`.

Типы обязательны у всех параметров и всех возвращаемых значений. Тип \`any\` использовать нельзя.`,
    requirements: [
      'Описаны типы Registration и ValidationResult',
      'validate проверяет все пять полей и возвращает имена непрошедших',
      'UserStore хранит записи в приватном поле',
      'add возвращает номер, total — количество, findByLogin — запись или undefined',
      'У всех функций и методов указаны типы параметров и результата',
      'В коде нет типа any',
    ],
    starterCode: `// 1-2. Типы Registration и ValidationResult

function validate(data) {
  // 3. проверка всех пяти полей
}

class UserStore {
  // 4. приватный массив, add, total, findByLogin
}`,
    tests: [
      {
        id: 'valid',
        name: 'Правильные данные проходят',
        type: 'assert',
        code: `const validate = ctx.get('validate');
const result = validate({
  login: 'ivanov26',
  password: 'demo2026pass',
  fullName: 'Иванов Илья',
  phone: '+7 900 123-45-67',
  email: 'ivanov@example.com',
});
ctx.assert(result.ok === true, 'Правильные данные должны проходить, ошибки: ' + result.errors.join(', '));
ctx.assert(Array.isArray(result.errors) && result.errors.length === 0, 'errors должен быть пустым массивом');`,
        points: 3,
      },
      {
        id: 'login-error',
        name: 'Логин проверяется',
        type: 'assert',
        code: `const validate = ctx.get('validate');
const base = {
  login: 'ivanov26',
  password: 'demo2026pass',
  fullName: 'Иванов Илья',
  phone: '+7 900 123-45-67',
  email: 'ivanov@example.com',
};
ctx.assert(validate({ ...base, login: 'ив' }).errors.indexOf('login') !== -1, 'Короткий логин должен давать ошибку login');
ctx.assert(validate({ ...base, login: 'иванов26' }).errors.indexOf('login') !== -1, 'Кириллица в логине должна давать ошибку login');`,
        points: 2,
      },
      {
        id: 'password-error',
        name: 'Пароль проверяется',
        type: 'assert',
        code: `const validate = ctx.get('validate');
const base = {
  login: 'ivanov26',
  password: 'demo2026pass',
  fullName: 'Иванов Илья',
  phone: '+7 900 123-45-67',
  email: 'ivanov@example.com',
};
ctx.assert(validate({ ...base, password: 'demo' }).errors.indexOf('password') !== -1, 'Пароль короче 8 символов должен давать ошибку');`,
        points: 2,
      },
      {
        id: 'fullname-error',
        name: 'ФИО из одного слова не проходит',
        type: 'assert',
        code: `const validate = ctx.get('validate');
const base = {
  login: 'ivanov26',
  password: 'demo2026pass',
  fullName: 'Иванов Илья',
  phone: '+7 900 123-45-67',
  email: 'ivanov@example.com',
};
ctx.assert(validate({ ...base, fullName: 'Иванов' }).errors.indexOf('fullName') !== -1, 'ФИО из одного слова должно давать ошибку');
ctx.assert(validate({ ...base, fullName: 'Иванов Илья Сергеевич' }).errors.indexOf('fullName') === -1, 'Полное ФИО из трёх слов должно проходить');`,
        points: 2,
      },
      {
        id: 'phone-error',
        name: 'Телефон считается по цифрам',
        type: 'assert',
        code: `const validate = ctx.get('validate');
const base = {
  login: 'ivanov26',
  password: 'demo2026pass',
  fullName: 'Иванов Илья',
  phone: '+7 900 123-45-67',
  email: 'ivanov@example.com',
};
ctx.assert(validate({ ...base, phone: '+7 900' }).errors.indexOf('phone') !== -1, 'Телефон с шестью цифрами должен давать ошибку');
ctx.assert(validate({ ...base, phone: '89001234567' }).errors.indexOf('phone') === -1, 'Телефон без разделителей должен проходить');`,
        points: 3,
      },
      {
        id: 'email-error',
        name: 'E-mail проверяется',
        type: 'assert',
        code: `const validate = ctx.get('validate');
const base = {
  login: 'ivanov26',
  password: 'demo2026pass',
  fullName: 'Иванов Илья',
  phone: '+7 900 123-45-67',
  email: 'ivanov@example.com',
};
ctx.assert(validate({ ...base, email: 'ivanov' }).errors.indexOf('email') !== -1, 'Адрес без собаки должен давать ошибку');
ctx.assert(validate({ ...base, email: 'ivanov@example' }).errors.indexOf('email') !== -1, 'Адрес без точки после собаки должен давать ошибку');`,
        points: 3,
      },
      {
        id: 'store',
        name: 'UserStore хранит и находит',
        type: 'assert',
        code: `const UserStore = ctx.get('UserStore');
const store = new UserStore();
const user = {
  login: 'ivanov26',
  password: 'demo2026pass',
  fullName: 'Иванов Илья',
  phone: '89001234567',
  email: 'ivanov@example.com',
};
ctx.assert(store.total() === 0, 'Новое хранилище должно быть пустым, получено: ' + store.total());
const id = store.add(user);
ctx.assert(id === 1, 'Первая запись должна получить номер 1, получено: ' + id, 1, id);
ctx.assert(store.total() === 1, 'После добавления total() должен вернуть 1');
const found = store.findByLogin('ivanov26');
ctx.assert(found && found.email === 'ivanov@example.com', 'findByLogin не нашёл добавленную запись');
ctx.assert(store.findByLogin('нет такого') === undefined, 'Для неизвестного логина нужно вернуть undefined');`,
        points: 4,
      },
      {
        id: 'types-declared',
        name: 'Типы Registration и ValidationResult описаны',
        type: 'assert',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(
  /(interface|type)\\s+Registration/.test(source),
  'Не найден тип Registration: опишите его через interface или type',
);
ctx.assert(
  /(interface|type)\\s+ValidationResult/.test(source),
  'Не найден тип ValidationResult',
);
ctx.assert(/errors\\s*:\\s*string\\[\\]|errors\\s*:\\s*Array<string>/.test(source), 'В ValidationResult поле errors должно быть string[]');`,
        points: 3,
      },
      {
        id: 'annotations',
        name: 'Типы расставлены, any не используется',
        type: 'assert',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(
  /function\\s+validate\\s*\\(\\s*\\w+\\s*:\\s*Registration\\s*\\)\\s*:\\s*ValidationResult/.test(source),
  'У validate должны быть указаны и тип параметра (Registration), и тип результата (ValidationResult)',
);
ctx.assert(/add\\s*\\(\\s*\\w+\\s*:\\s*Registration\\s*\\)\\s*:\\s*number/.test(source), 'У метода add нужны типы параметра и результата');
ctx.assert(/total\\s*\\(\\s*\\)\\s*:\\s*number/.test(source), 'У метода total нужен тип результата: number');
ctx.assert(
  /findByLogin\\s*\\(\\s*\\w+\\s*:\\s*string\\s*\\)\\s*:\\s*Registration\\s*\\|\\s*undefined/.test(source),
  'У findByLogin результат должен быть Registration | undefined',
);
ctx.assert(!/:\\s*any\\b/.test(source), 'Тип any использовать нельзя: он отключает проверку и смысл TypeScript пропадает');`,
        points: 4,
      },
      {
        id: 'private-storage',
        name: 'Хранилище закрыто от внешнего доступа',
        type: 'assert',
        code: `const source = (ctx.source || '').replace(/\\s+/g, ' ');
ctx.assert(
  /private\\s+\\w+|#\\w+\\s*(:|=)/.test(source),
  'Массив записей должен быть приватным: private items: Registration[] = [] или поле с решёткой #items',
);`,
        points: 2,
      },
    ],
    hints: [
      {
        level: 1,
        text: 'Сначала опишите типы, потом пишите функции. Редактор начнёт подсказывать поля, и писать станет быстрее.',
        penaltyPercent: 10,
      },
      {
        level: 2,
        text: 'Цифры из телефона удобно вытащить так: phone.replace(/\\D/g, "").length >= 10. Слова в ФИО — fullName.trim().split(/\\s+/).length >= 2.',
        penaltyPercent: 20,
      },
      {
        level: 3,
        text: 'interface Registration { login: string; password: string; fullName: string; phone: string; email: string; } class UserStore { private items: Registration[] = []; add(data: Registration): number { return this.items.push(data); } total(): number { return this.items.length; } findByLogin(login: string): Registration | undefined { return this.items.find((item) => item.login === login); } }',
        penaltyPercent: 35,
      },
    ],
    solution: `interface Registration {
  login: string;
  password: string;
  fullName: string;
  phone: string;
  email: string;
}

interface ValidationResult {
  ok: boolean;
  errors: string[];
}

function validate(data: Registration): ValidationResult {
  const errors: string[] = [];

  if (!/^[A-Za-z0-9]{6,}$/.test(data.login)) errors.push('login');
  if (data.password.length < 8) errors.push('password');
  if (data.fullName.trim().split(/\\s+/).length < 2) errors.push('fullName');
  if (data.phone.replace(/\\D/g, '').length < 10) errors.push('phone');
  if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(data.email)) errors.push('email');

  return { ok: errors.length === 0, errors };
}

class UserStore {
  private items: Registration[] = [];

  add(data: Registration): number {
    return this.items.push(data);
  }

  total(): number {
    return this.items.length;
  }

  findByLogin(login: string): Registration | undefined {
    return this.items.find((item) => item.login === login);
  }
}`,
    solutionExplanation:
      'Телефон проверяется по количеству цифр, а не по маске: пользователь напишет и «+7 (900) 123-45-67», и «89001234567», и оба варианта верные. Выражение replace(/\\D/g, "") выбрасывает всё, кроме цифр, и остаётся сравнить длину. Приватное поле — не формальность: без него любой участок кода сможет дописать запись в обход add, и класс перестанет отвечать за собственные данные. Тип Registration | undefined честно говорит вызывающему коду, что запись может не найтись, и TypeScript заставит это обработать.',
    maxScore: 28,
    estimatedMinutes: 60,
    timeLimitMs: 3_600_000,
    examRefs: ['m1-register', 'm3-quality', 'm1-oop-styles'],
    planDays: ['day-08-7'],
    source: 'plan',
  },
];
