import { expect, test, type BrowserContext, type Locator, type Page } from '@playwright/test';

/**
 * Основной сценарий из разделов 32 и 49 ТЗ — от регистрации до режима
 * «ДЕМОЭКЗАМЕН».
 *
 * Весь путь идёт в ОДНОМ контексте браузера: шаги опираются на сессию и
 * прогресс, созданные предыдущими. Поэтому контекст создаётся один раз в
 * beforeAll, а не выдаётся фикстурой на каждый тест.
 *
 * Запуск: npm run test:e2e
 */

const LOGIN = `student${Date.now().toString().slice(-7)}`;
const PASSWORD = 'demo2026pass';

let context: BrowserContext;
let page: Page;

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext({ locale: 'ru-RU' });
  page = await context.newPage();
});

test.afterAll(async () => {
  await context?.close();
});

/** Monaco не поддаётся обычному fill: значение ставим через его собственную модель. */
async function setEditorValue(code: string): Promise<void> {
  await page.waitForFunction(
    () => {
      const monaco = (window as unknown as { monaco?: { editor: { getModels: () => unknown[] } } }).monaco;
      return Boolean(monaco && monaco.editor.getModels().length);
    },
    undefined,
    { timeout: 60_000 },
  );

  await page.evaluate((value) => {
    const monaco = (window as unknown as {
      monaco: { editor: { getModels: () => { setValue: (text: string) => void }[] } };
    }).monaco;
    monaco.editor.getModels()[0].setValue(value);
  }, code);
}

/** Эталонное решение задания task-js-validate-login — им проверяется весь путь «код → тесты → балл». */
const SOLVED_LOGIN_TASK = [
  'function checkLogin(login) {',
  "  return typeof login === 'string' && /^[A-Za-z0-9]{6,}$/.test(login);",
  '}',
  '',
  'function checkPassword(password) {',
  "  return typeof password === 'string' && password.length >= 8;",
  '}',
  '',
  'function loginError(login) {',
  "  const value = typeof login === 'string' ? login : '';",
  "  if (!value) return 'Введите логин';",
  "  if (value.length < 6) return 'Минимум 6 символов';",
  "  if (!/^[A-Za-z0-9]+$/.test(value)) return 'Только латинские буквы и цифры';",
  "  return '';",
  '}',
].join('\n');

async function runTests(): Promise<void> {
  await page.getByRole('button', { name: /Запустить тесты/i }).click();
  await expect(page.getByText(/из \d+ тестов/i).first()).toBeVisible({ timeout: 90_000 });
}

test.describe('Путь студента: от регистрации до демоэкзамена', () => {
  test('1. Открыть сайт: без входа платформа ведёт на форму входа', async () => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/login/);
    // Текст ссылки дословно повторяет формулировку задания — это часть обучения.
    await expect(page.getByRole('link', { name: 'Еще не зарегистрированы? Регистрация' })).toBeVisible();
  });

  test('2. Зарегистрироваться', async () => {
    await page.getByRole('link', { name: /Регистрация/i }).first().click();
    await expect(page).toHaveURL(/\/register/);

    await page.getByLabel('Логин').fill(LOGIN);
    await page.getByLabel('Пароль').fill(PASSWORD);
    await page.getByLabel('ФИО').fill('Тестовый Студент');
    await page.getByRole('button', { name: /Зарегистрироваться/i }).click();

    await expect(page).not.toHaveURL(/\/register/, { timeout: 60_000 });
  });

  test('3. Дашборд: прогресс, готовность и рекомендации со ссылками', async () => {
    await page.goto('/');

    await expect(page.getByText(/Готовность к экзамену/i).first()).toBeVisible();
    await expect(page.getByText(/Рекомендации/i).first()).toBeVisible();

    // Раздел 40 ТЗ: рекомендация без ссылки бесполезна.
    const actions = page.locator('a[href^="/"]');
    expect(await actions.count()).toBeGreaterThan(3);
  });

  test('4. Учебный план: 30 недель, 210 дней, день открывается', async () => {
    await page.goto('/plan');

    await expect(page.getByText(/Неделя 1/i).first()).toBeVisible();
    await expect(page.getByText(/210/).first()).toBeVisible();

    await page.goto('/plan/day/day-01-1');
    await expect(page.getByText(/Что изучаем/i).first()).toBeVisible();
    await expect(page.getByText(/Что делаем руками/i).first()).toBeVisible();
  });

  test('4a. День плана объяснён простыми словами, а формулировка программы рядом', async () => {
    await page.goto('/plan/day/day-03-1');

    // Заголовок человеческий, а не обрезанный перечень свойств CSS.
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Раскладка в ряд/i);

    const main = await page.locator('main').innerText();
    // Объяснение написано словами: в видимом тексте нет перечисления свойств.
    expect(main).toMatch(/расставить элементы в линию/i);

    // Дословный текст программы доступен, но убран под раскрывающийся блок.
    const details = page.locator('details').first();
    await expect(details).toBeVisible();
    await details.click();
    await expect(page.getByText(/justify-content/).first()).toBeVisible();
  });

  test('4b. Календарь плана считается от даты старта студента', async () => {
    await page.goto('/plan');

    // Дата старта показана как своя, а не как дата из файла программы.
    await expect(page.getByText(/ваш старт/i)).toBeVisible();

    await page.goto('/plan/day/day-01-1');
    // У дня есть конкретная календарная дата.
    await expect(page.getByText(/День 1 · \d{2}\.\d{2}\.\d{4}/)).toBeVisible();
  });

  test('4c. В списках плана и на дашборде нет служебной разметки программы', async () => {
    // Обратная кавычка — разметка Markdown из дословной формулировки программы.
    // Её место — страница дня под катом; в списках и на дашборде студент должен
    // читать объяснение словами, а не «Проверить в терминале: `node -v`».
    for (const route of ['/', '/plan/week/week-01']) {
      await page.goto(route);
      const main = await page.locator('main').innerText();
      expect(main, `Разметка программы просочилась на ${route}`).not.toContain('`');
    }
  });

  test('5. Теория: у темы есть разбор, «надо знать» и типичные ошибки', async () => {
    await page.goto('/theory/web-basics');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/Что необходимо знать/i).first()).toBeVisible();
    await expect(page.getByText(/ошибк/i).first()).toBeVisible();
  });

  test('6. Тест по теории: ответить и получить результат с пояснением', async () => {
    await page.goto('/quiz/quiz-web-basics');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Отвечаем на первый вопрос — важно, что платформа объясняет ответ,
    // а не просто показывает процент.
    const option = page.getByRole('radio').first();
    if (await option.count()) await option.check();

    const finish = page
      .getByRole('button', { name: /Завершить|Показать результат|Проверить|Ответить|Далее/i })
      .first();

    if (await finish.count()) {
      await finish.click();
      await expect(page.getByText(/%|Пояснение|Верно|Неверно/i).first()).toBeVisible({ timeout: 30_000 });
    }
  });

  test('7. Практика: код действительно выполняется и проходит тесты', async () => {
    await page.goto('/tasks/task-js-validate-login');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await setEditorValue(SOLVED_LOGIN_TASK);
    await runTests();

    await expect(page.getByText('PASS').first()).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/Решено/i).first()).toBeVisible({ timeout: 30_000 });
  });

  test('8. Неверное решение не засчитывается', async () => {
    await page.goto('/tasks/task-js-validate-form');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await setEditorValue(['function validateForm(values) {', '  return {};', '}'].join('\n'));
    await runTests();

    await expect(page.getByText('FAIL').first()).toBeVisible({ timeout: 30_000 });
  });

  test('9. Песочница не пускает код в сеть', async () => {
    await page.goto('/tasks/task-js-validate-login');

    // К рабочему решению добавляем попытку выйти в сеть: она должна упасть,
    // а сообщение об этом — попасть в вывод песочницы.
    await setEditorValue(
      SOLVED_LOGIN_TASK.replace(
        'function checkLogin(login) {',
        [
          'function checkLogin(login) {',
          '  try {',
          "    fetch('https://example.com');",
          '  } catch (error) {',
          "    console.log('СЕТЬ ЗАКРЫТА: ' + error.message);",
          '  }',
        ].join('\n'),
      ),
    );
    await runTests();

    // Вывод console.log живёт на отдельной вкладке рабочего места.
    await page.getByRole('tab', { name: /Вывод/i }).click();
    await expect(page.getByText(/СЕТЬ ЗАКРЫТА/i).first()).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/запрещены/i).first()).toBeVisible();
  });

  test('10. SQL-задание выполняется на настоящей базе', async () => {
    await page.goto('/tasks/task-fs-cabinet-query');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await setEditorValue(
      [
        'CREATE VIEW v_my_orders AS',
        'SELECT a.id, r.title AS room, p.title AS payment, s.title AS status,',
        '       a.event_date, rev.text AS review_text',
        'FROM applications a',
        'JOIN rooms r ON r.id = a.room_id',
        'JOIN payment_methods p ON p.id = a.payment_method_id',
        'JOIN statuses s ON s.id = a.status_id',
        'LEFT JOIN reviews rev ON rev.application_id = a.id',
        'WHERE a.user_id = 2',
        'ORDER BY a.event_date;',
      ].join('\n'),
    );
    await runTests();

    await expect(page.getByText(/Решено/i).first()).toBeVisible({ timeout: 30_000 });
  });

  test('11. Прогресс сохранился и виден в статистике', async () => {
    await page.goto('/progress');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/Решено|Успешн|Технолог/i).first()).toBeVisible();
  });

  test('11a. Даты подготовки: сохранённая дата и общая линия полей', async () => {
    // Дата первого дня плана — это и есть дата старта студента.
    await page.goto('/plan/day/day-01-1');
    const dayHeader = await page.locator('main').innerText();
    const planStart = dayHeader.match(/День 1 · (\d{2})\.(\d{2})\.(\d{4})/);
    expect(planStart, 'у первого дня плана нет календарной даты').not.toBeNull();
    const [, day, month, year] = planStart!;

    await page.goto('/progress');

    // В поле стоит та же дата, от которой считается план. Раньше её приводили
    // к UTC, и восточнее Гринвича поле показывало предыдущий день,
    // а «Сохранить» записывало этот сдвиг обратно в базу.
    await expect(page.locator('input[name="startDate"]')).toHaveValue(`${year}-${month}-${day}`);

    // Подсказка под полем экзамена не должна сдвигать соседнее поле:
    // подписи, поля и кнопка стоят на общих линиях.
    // Страница отдаётся потоком, поэтому перед замером ждём саму отрисовку:
    // boundingBox у ещё не показанного элемента возвращает null.
    const top = async (locator: Locator): Promise<number> => {
      await locator.waitFor({ state: 'visible' });
      const box = await locator.boundingBox();
      if (!box) throw new Error('элемент не отрисован');
      return box.y;
    };

    const startLabel = await top(page.getByText('Начало подготовки', { exact: true }));
    const examLabel = await top(page.getByText('Дата демоэкзамена', { exact: true }));
    expect(Math.abs(startLabel - examLabel)).toBeLessThan(2);

    const startInput = await top(page.locator('input[name="startDate"]'));
    const examInput = await top(page.locator('input[name="examDate"]'));
    const saveButton = await top(page.getByRole('button', { name: 'Сохранить' }));
    expect(Math.abs(startInput - examInput)).toBeLessThan(2);
    expect(Math.abs(startInput - saveButton)).toBeLessThan(2);
  });

  test('12. Повторение: очередь интервального повторения открывается', async () => {
    await page.goto('/review');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('13. Мини-проект: ТЗ, чек-лист и деление на авто и ручную проверку', async () => {
    await page.goto('/projects');
    await expect(page.getByText(/Страница мероприятия/i).first()).toBeVisible();

    await page.goto('/projects/project-01-event-page');
    await expect(page.getByText(/Что делаем/i).first()).toBeVisible();
    await expect(page.getByText(/чек-лист|Проверя|вручную/i).first()).toBeVisible();
  });

  test('14. Экзамены: официальный вариант и тренировочные различимы', async () => {
    await page.goto('/exams');

    await expect(page.getByText(/Демоэкзамен 2026/i).first()).toBeVisible();
    await expect(page.getByText(/Тренировочный вариант/i).first()).toBeVisible();
  });

  test('15. DEMO EXAM MODE: регламент и честное разделение проверки', async () => {
    await page.goto('/exams/exam-demo-2026-v2');

    await expect(page.getByText(/Модуль 1/i).first()).toBeVisible();
    await expect(page.getByText(/4 часа|240|1 ч 30/i).first()).toBeVisible();
    // Раздел 45 ТЗ: платформа прямо говорит, что часть пунктов проверяет студент.
    await expect(page.getByText(/вручную|чек-лист|своём проекте/i).first()).toBeVisible();
  });

  test('16. Поиск находит контент по запросу', async () => {
    await page.goto('/search?q=JOIN');
    await expect(page.getByText(/JOIN/i).first()).toBeVisible();
  });

  test('17. Достижения перечислены и видны условия', async () => {
    await page.goto('/achievements');
    await expect(page.getByText(/Первая решённая задача/i).first()).toBeVisible();
  });

  test('18. Несуществующий адрес объясняет, что произошло, и предлагает выход', async () => {
    await page.goto('/theory/такой-темы-нет');

    await expect(page.getByText(/Страница не найдена/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /На дашборд/i })).toBeVisible();
    // Технических подробностей на экране студента быть не должно.
    // Смотрим именно видимый текст: в режиме разработки Next кладёт служебные
    // данные в <script>, и они к тому, что видит студент, отношения не имеют.
    const visible = await page.locator('body').innerText();
    expect(visible).not.toMatch(/at .+\.tsx?:\d+|Error:|stack|NEXT_HTTP/i);
  });

  test('19. Генератор собирает тренировочный вариант по структуре экзамена', async () => {
    await page.goto('/exams');

    await page.getByRole('button', { name: /Собрать вариант/i }).click();

    await expect(page).toHaveURL(/\/exams\/.+/, { timeout: 60_000 });
    await expect(page.getByText(/Тренировочный вариант/i).first()).toBeVisible();
    await expect(page.getByText(/Модуль 1/i).first()).toBeVisible();
    await expect(page.getByText(/Модуль 3/i).first()).toBeVisible();
    // Вариант не выдаётся за официальный.
    await expect(page.getByText(/не официальное задание|Это тренировка/i).first()).toBeVisible();
  });
});
