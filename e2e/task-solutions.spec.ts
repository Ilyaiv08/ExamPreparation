import { expect, test, type BrowserContext, type Page } from '@playwright/test';
import { ALL_TASKS } from '../content/tasks';

/**
 * Эталонное решение каждого задания прогоняется через настоящую песочницу.
 *
 * Это единственный способ узнать, что проверки задания вообще работают:
 * код тестов исполняется только в браузере, модульными тестами его не достать.
 * Без этого прогона задание с опечаткой в проверке выглядит целым ровно до
 * того момента, когда студент потратит на него полчаса.
 *
 * Запуск: npm run test:solutions
 */

const LOGIN = `sol${Date.now().toString().slice(-7)}`;
const PASSWORD = 'demo2026pass';

let context: BrowserContext;
let page: Page;

// Не serial: нужен полный список сломанных заданий, а не первое из них.
// Страница одна на весь прогон, но каждый тест начинает с перехода по адресу.
test.beforeAll(async ({ browser }) => {
  context = await browser.newContext({ locale: 'ru-RU' });
  page = await context.newPage();

  await page.goto('/register');
  await page.getByLabel('Логин').fill(LOGIN);
  await page.getByLabel('Пароль').fill(PASSWORD);
  await page.getByLabel('ФИО').fill('Проверка Решений');
  await page.getByRole('button', { name: /Зарегистрироваться/i }).click();
  await expect(page).not.toHaveURL(/\/register/, { timeout: 60_000 });
});

test.afterAll(async () => {
  await context?.close();
});

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

for (const task of ALL_TASKS) {
  test(`${task.id} — эталонное решение проходит все проверки`, async () => {
    await page.goto(`/tasks/${task.id}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await setEditorValue(task.solution);
    await page.getByRole('button', { name: /Запустить тесты/i }).click();

    // Ждём, пока появится хотя бы один вердикт.
    const verdicts = page.locator('text=/^(PASS|FAIL)$/');
    await expect(verdicts.first()).toBeVisible({ timeout: 60_000 });

    // Упавшие проверки платформа раскрывает сама, поэтому их сообщения
    // можно читать сразу. Без сообщения отчёт говорит «что-то не прошло»,
    // и чинить приходится вслепую.
    const failedCount = await page.locator('button', { hasText: /FAIL$/ }).count();

    const details = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('button')).filter((button) =>
        (button.textContent ?? '').trim().endsWith('FAIL'),
      );
      return rows.map((button) => {
        const name = (button.textContent ?? '').replace(/\s+/g, ' ').replace(/ FAIL$/, '').trim();
        const panel = button.nextElementSibling;
        const message = panel ? (panel.textContent ?? '').replace(/\s+/g, ' ').trim() : '';
        return `${name} — ${message}`;
      });
    });

    expect(failedCount, [task.id + ':', ...details].join('\n  ')).toBe(0);
  });
}
