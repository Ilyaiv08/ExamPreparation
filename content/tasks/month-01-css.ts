import type { Task } from '../types';

/** Месяц 1, продолжение: задания на каскад и состояния формы. */
export const MONTH_01_CSS_TASKS: Task[] = [
  {
    id: 'task-css-specificity',
    title: 'Каскад и специфичность: почему стиль не применился',
    kind: 'find-bug',
    runtime: 'dom',
    difficulty: 3,
    tech: ['css'],
    topicIds: ['css-typography'],
    monthNo: 1,
    weekNo: 2,
    statement: `Кнопка «Отправить» должна быть зелёной (\`#16a34a\`), а сообщение об ошибке — красным (\`#dc2626\`). Правила для этого уже написаны, но не работают: их перебивают другие селекторы.

Разберитесь с каскадом и добейтесь нужных цветов. Условия:

- **нельзя** использовать \`!important\`;
- **нельзя** менять разметку и добавлять \`style\` прямо на элемент;
- существующие правила переписывать можно.`,
    requirements: [
      'Кнопка .btn--submit имеет цвет фона #16a34a',
      'Текст .error окрашен в #dc2626',
      'В коде нет !important',
      'В разметке нет атрибута style',
    ],
    starterCode: `<style>
/* Эти правила перебивают нужные — разберитесь почему */
#form .btn { background: #64748b; }
.form-block p { color: #475569; }

/* Ваши правила */
.btn--submit { background: #16a34a; }
.error { color: #dc2626; }
</style>

<div id="form" class="form-block">
  <p class="error">Логин занят</p>
  <button class="btn btn--submit" type="submit">Отправить</button>
</div>`,
    viewport: { width: 700, height: 400 },
    tests: [
      {
        id: 'button-color',
        name: 'Кнопка зелёная',
        type: 'dom',
        code: `const value = ctx.css('.btn--submit', 'background-color');
ctx.assert(value === 'rgb(22, 163, 74)', 'Фон кнопки должен быть #16a34a', 'rgb(22, 163, 74)', value);`,
        points: 3,
      },
      {
        id: 'error-color',
        name: 'Ошибка красная',
        type: 'dom',
        code: `const value = ctx.css('.error', 'color');
ctx.assert(value === 'rgb(220, 38, 38)', 'Цвет текста ошибки должен быть #dc2626', 'rgb(220, 38, 38)', value);`,
        points: 3,
      },
      {
        id: 'no-important',
        name: 'Обошлись без !important',
        type: 'dom',
        code: `ctx.assert(!/!important/i.test(ctx.source), '!important запрещён: он лечит симптом, а не причину. Поднимите специфичность или порядок правил');`,
        points: 2,
      },
      {
        id: 'no-inline',
        name: 'Разметка не изменена inline-стилями',
        type: 'dom',
        code: `const withStyle = ctx.$$('[style]');
ctx.assert(withStyle.length === 0, 'Атрибут style на элементах использовать нельзя');
ctx.assert(ctx.$('.btn--submit'), 'Кнопка .btn--submit должна остаться в разметке');
ctx.assert(ctx.$('.error'), 'Блок .error должен остаться в разметке');`,
      },
    ],
    hints: [
      { level: 1, text: 'Посчитайте специфичность: #form .btn — это 1-1-0, а .btn--submit — всего 0-1-0.', penaltyPercent: 10 },
      { level: 2, text: 'Поднять специфичность можно, добавив к своему селектору класс родителя или тот же id.', penaltyPercent: 20 },
      {
        level: 3,
        text: '#form .btn--submit { background: #16a34a; } и .form-block p.error { color: #dc2626; } — оба селектора теперь не слабее конкурентов.',
        penaltyPercent: 35,
      },
    ],
    solution: `<style>
#form .btn { background: #64748b; }
.form-block p { color: #475569; }

/* Специфичность поднята до уровня конкурирующих правил */
#form .btn--submit { background: #16a34a; }
.form-block p.error { color: #dc2626; }
</style>

<div id="form" class="form-block">
  <p class="error">Логин занят</p>
  <button class="btn btn--submit" type="submit">Отправить</button>
</div>`,
    solutionExplanation:
      'Специфичность считается как «сколько id, сколько классов, сколько тегов». Селектор #form .btn = 1-1-0 сильнее, чем .btn--submit = 0-1-0, поэтому побеждал серый цвет. Добавив id в своё правило, мы сравняли счёт, а при равной специфичности выигрывает правило, написанное ниже.',
    maxScore: 9,
    estimatedMinutes: 18,
    examRefs: ['m2-design', 'm3-quality'],
    planDays: ['day-02-4'],
    source: 'plan',
  },

  {
    id: 'task-css-form-states',
    title: 'Состояния поля: фокус, ошибка и подсказка рядом',
    kind: 'output',
    runtime: 'dom',
    difficulty: 3,
    tech: ['css'],
    topicIds: ['css-pseudo'],
    monthNo: 1,
    weekNo: 2,
    statement: `Модуль 2 экзамена требует показывать подсказки об ошибках рядом с формой. Подготовьте для этого стили — по тому же соглашению, что использует Bootstrap.

1. Поле в фокусе с клавиатуры (\`:focus-visible\`) получает синюю рамку \`#2563eb\`.
2. Поле с классом \`is-invalid\` получает красную рамку \`#dc2626\`.
3. Текст ошибки \`.invalid-feedback\` по умолчанию скрыт, но показывается, если у поля рядом есть класс \`is-invalid\`.
4. Убирать обводку у всех полей без замены нельзя: навигация с клавиатуры должна оставаться видимой.`,
    requirements: [
      'Правило для :focus-visible с рамкой #2563eb',
      'Правило .is-invalid с рамкой #dc2626',
      '.invalid-feedback скрыт по умолчанию',
      '.invalid-feedback показывается рядом с полем .is-invalid (селектор ~ или +)',
    ],
    starterCode: `<style>
input {
  width: 100%;
  max-width: 320px;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

/* ваши стили состояний */

</style>

<div class="field">
  <label for="login">Логин</label>
  <input type="text" id="login" class="is-invalid" value="иванов">
  <small class="invalid-feedback">Только латинские буквы и цифры, минимум 6 символов</small>
</div>

<div class="field">
  <label for="email">E-mail</label>
  <input type="email" id="email" value="ivan@example.com">
  <small class="invalid-feedback">Некорректный e-mail</small>
</div>`,
    viewport: { width: 700, height: 500 },
    tests: [
      {
        id: 'invalid-border',
        name: 'Поле с ошибкой обведено красным',
        type: 'dom',
        code: `const value = ctx.css('.is-invalid', 'border-top-color');
ctx.assert(value === 'rgb(220, 38, 38)', 'Рамка поля с классом is-invalid должна быть #dc2626', 'rgb(220, 38, 38)', value);
const normal = ctx.css('#email', 'border-top-color');
ctx.assert(normal !== 'rgb(220, 38, 38)', 'Обычное поле не должно быть красным');`,
        points: 2,
      },
      {
        id: 'feedback-hidden',
        name: 'Текст ошибки скрыт у корректного поля',
        type: 'dom',
        code: `const good = ctx.$('#email').parentElement.querySelector('.invalid-feedback');
ctx.assert(ctx.css(good, 'display') === 'none', 'У поля без ошибки подсказка должна быть скрыта', 'none', ctx.css(good, 'display'));`,
        points: 2,
      },
      {
        id: 'feedback-visible',
        name: 'Текст ошибки виден рядом с некорректным полем',
        type: 'dom',
        code: `const bad = ctx.$('#login').parentElement.querySelector('.invalid-feedback');
ctx.assert(ctx.css(bad, 'display') !== 'none', 'Подсказка рядом с полем is-invalid должна быть видна');
const rect = bad.getBoundingClientRect();
ctx.assert(rect.height > 0, 'Подсказка не занимает места — значит, её не видно');`,
        points: 3,
      },
      {
        id: 'focus-visible',
        name: 'Видимый фокус с клавиатуры',
        type: 'dom',
        code: `const source = ctx.source.replace(/\\s+/g, ' ');
ctx.assert(/:focus-visible/.test(source), 'Нужен селектор :focus-visible — он показывает обводку только при навигации с клавиатуры');
ctx.assert(/#2563eb|rgb\\(\\s*37\\s*,\\s*99\\s*,\\s*235/i.test(source), 'Цвет рамки при фокусе должен быть #2563eb');
const bareOutlineNone = /(^|\\})\\s*input\\s*\\{[^}]*outline\\s*:\\s*none/i.test(source);
ctx.assert(!bareOutlineNone, 'Нельзя убирать outline у всех полей без замены — это ломает навигацию с клавиатуры');`,
        points: 3,
      },
    ],
    hints: [
      { level: 1, text: 'Селектор ~ выбирает элемент, идущий после другого внутри одного родителя.', penaltyPercent: 10 },
      { level: 2, text: 'Скрывайте подсказку через display: none, а показывайте правилом .is-invalid ~ .invalid-feedback { display: block; }', penaltyPercent: 20 },
      {
        level: 3,
        text: 'input:focus-visible { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgb(37 99 235 / .2); } input.is-invalid { border-color: #dc2626; } .invalid-feedback { display: none; color: #dc2626; } .is-invalid ~ .invalid-feedback { display: block; }',
        penaltyPercent: 35,
      },
    ],
    solution: `<style>
input:focus-visible {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.2);
}

input.is-invalid { border-color: #dc2626; }

.invalid-feedback {
  display: none;
  margin-top: 4px;
  color: #dc2626;
  font-size: 0.85rem;
}

.is-invalid ~ .invalid-feedback { display: block; }
</style>

<div class="field">
  <label for="login">Логин</label>
  <input type="text" id="login" class="is-invalid" value="иванов">
  <small class="invalid-feedback">Только латинские буквы и цифры, минимум 6 символов</small>
</div>

<div class="field">
  <label for="email">E-mail</label>
  <input type="email" id="email" value="ivan@example.com">
  <small class="invalid-feedback">Некорректный e-mail</small>
</div>`,
    solutionExplanation:
      'Пара классов is-invalid и invalid-feedback повторяет соглашение Bootstrap, поэтому на экзамене те же стили работают и с библиотекой, и без неё. Замена outline на собственную рамку с тенью сохраняет видимый фокус.',
    maxScore: 10,
    estimatedMinutes: 20,
    examRefs: ['m2-register-hints', 'm1-register'],
    planDays: ['day-02-6'],
    source: 'plan',
  },
];
