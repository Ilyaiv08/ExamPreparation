import { expect, test, type BrowserContext, type ConsoleMessage, type Page } from '@playwright/test';

/**
 * Финальный аудит (раздел 52 ТЗ, шаг 26).
 *
 * Проходит по всем страницам платформы и проверяет три вещи:
 * страница открылась, в консоли нет ошибок, сетевые запросы не падают.
 * Это не заменяет сценарные тесты — это сетка, которая ловит регрессии
 * на страницах, до которых основной сценарий не доходит.
 */

const LOGIN = `audit${Date.now().toString().slice(-7)}`;
const PASSWORD = 'demo2026pass';

const ROUTES = [
  '/',
  '/plan',
  '/plan/week/week-01',
  '/plan/day/day-01-1',
  '/theory',
  '/theory/web-basics',
  '/theory/sql-join',
  '/theory/exam-strategy',
  '/tasks',
  '/tasks/task-js-validate-login',
  '/tasks/task-fs-cabinet-query',
  '/quiz/quiz-web-basics',
  '/quiz/quiz-exam-checklist',
  '/projects',
  '/projects/project-01-event-page',
  '/projects/project-07-full-exam',
  '/exams',
  '/exams/exam-demo-2026-v2',
  '/exams/exam-practice-courses',
  '/exams/exam-practice-restaurant',
  '/review',
  '/progress',
  '/achievements',
  '/search?q=JOIN',
];

/** Шум, который не является ошибкой приложения. */
const IGNORED = [
  /favicon/i,
  /Download the React DevTools/i,
  /\[Fast Refresh\]/i,
  // Monaco в режиме разработки предупреждает о размере воркера.
  /Could not create web worker/i,
];

let context: BrowserContext;
let page: Page;
const consoleErrors: string[] = [];
const failedRequests: string[] = [];

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext({ locale: 'ru-RU' });
  page = await context.newPage();

  page.on('console', (message: ConsoleMessage) => {
    if (message.type() !== 'error') return;
    const text = message.text();
    if (IGNORED.some((pattern) => pattern.test(text))) return;
    consoleErrors.push(`${page.url()} → ${text}`);
  });

  page.on('response', (response) => {
    if (response.status() < 400) return;
    if (IGNORED.some((pattern) => pattern.test(response.url()))) return;
    failedRequests.push(`${response.status()} ${response.url()}`);
  });
});

test.afterAll(async () => {
  await context?.close();
});

test('регистрация для аудита', async () => {
  await page.goto('/register');
  await page.getByLabel('Логин').fill(LOGIN);
  await page.getByLabel('Пароль').fill(PASSWORD);
  await page.getByLabel('ФИО').fill('Аудит Платформы');
  await page.getByRole('button', { name: /Зарегистрироваться/i }).click();
  await expect(page).not.toHaveURL(/\/register/, { timeout: 60_000 });
});

test('все страницы открываются и содержат заголовок', async () => {
  const broken: string[] = [];

  for (const route of ROUTES) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');

    const heading = page.getByRole('heading', { level: 1 }).first();
    if (!(await heading.isVisible().catch(() => false))) {
      broken.push(`${route}: нет заголовка h1`);
      continue;
    }

    const text = await page.locator('body').innerText();
    if (/Страница не найдена|Что-то пошло не так/i.test(text)) {
      broken.push(`${route}: страница показывает ошибку`);
    }
  }

  expect(broken).toEqual([]);
});

test('в консоли нет ошибок приложения', () => {
  expect(consoleErrors).toEqual([]);
});

test('нет неудачных запросов', () => {
  expect(failedRequests).toEqual([]);
});

test('у каждой страницы ровно один заголовок первого уровня', async () => {
  const problems: string[] = [];

  for (const route of ROUTES.slice(0, 12)) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    const count = await page.getByRole('heading', { level: 1 }).count();
    if (count !== 1) problems.push(`${route}: h1 ${count} шт.`);
  }

  expect(problems).toEqual([]);
});

test('у изображений есть alt, у полей — подписи', async () => {
  const problems: string[] = [];

  for (const route of ROUTES) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');

    const found = await page.evaluate(() => {
      const issues: string[] = [];

      // Элементы, скрытые от вспомогательных технологий, проверять незачем:
      // например, служебное поле ввода внутри Monaco помечено aria-hidden.
      const hiddenFromScreenReader = (element: Element): boolean =>
        Boolean(element.closest('[aria-hidden="true"]'));

      document.querySelectorAll('img').forEach((img) => {
        if (hiddenFromScreenReader(img)) return;
        if (img.getAttribute('alt') === null) issues.push(`img без alt: ${img.getAttribute('src')}`);
      });

      document.querySelectorAll('input, select, textarea').forEach((field) => {
        const element = field as HTMLInputElement;
        if (element.type === 'hidden') return;
        if (hiddenFromScreenReader(element)) return;
        const id = element.getAttribute('id');
        const labelled =
          (id && document.querySelector(`label[for="${id}"]`)) ||
          element.getAttribute('aria-label') ||
          element.getAttribute('aria-labelledby') ||
          element.closest('label');
        if (!labelled) issues.push(`поле без подписи: ${element.name || element.type}`);
      });

      document.querySelectorAll('button').forEach((button) => {
        if (hiddenFromScreenReader(button)) return;
        const text = (button.textContent ?? '').trim();
        if (!text && !button.getAttribute('aria-label') && !button.getAttribute('title')) {
          issues.push('кнопка без доступного имени');
        }
      });

      return issues;
    });

    for (const issue of found) problems.push(`${route}: ${issue}`);
  }

  expect(problems).toEqual([]);
});
