import { expect, test, type BrowserContext, type Page } from '@playwright/test';

/**
 * Проверка на экране 390 × 844.
 *
 * Размер взят из задания демоэкзамена: платформа учит делать интерфейс
 * под него — значит, обязана и сама на нём работать. Требование то же,
 * что предъявляют студенту: никакой горизонтальной прокрутки.
 *
 * Как и основной сценарий, идёт в одном контексте: внутренние страницы
 * доступны только после входа.
 */

const PUBLIC_PAGES: { path: string; title: string }[] = [
  { path: '/login', title: 'Вход' },
  { path: '/register', title: 'Регистрация' },
];

const PRIVATE_PAGES: { path: string; title: string }[] = [
  { path: '/', title: 'Дашборд' },
  { path: '/plan', title: 'Учебный план' },
  { path: '/plan/day/day-01-1', title: 'День плана' },
  { path: '/theory', title: 'Теория' },
  { path: '/theory/web-basics', title: 'Тема' },
  { path: '/tasks', title: 'Задания' },
  { path: '/progress', title: 'Прогресс' },
  { path: '/projects', title: 'Проекты' },
  { path: '/projects/project-01-event-page', title: 'Мини-проект' },
  { path: '/exams', title: 'Экзамены' },
  { path: '/exams/exam-demo-2026-v2', title: 'Демоэкзамен' },
  { path: '/achievements', title: 'Достижения' },
  { path: '/review', title: 'Повторение' },
];

const LOGIN = `mobile${Date.now().toString().slice(-7)}`;
const PASSWORD = 'demo2026pass';

let context: BrowserContext;
let page: Page;

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext({
    locale: 'ru-RU',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  page = await context.newPage();
});

test.afterAll(async () => {
  await context?.close();
});

async function horizontalOverflow(): Promise<number> {
  return page.evaluate(() => {
    const doc = document.documentElement;
    return Math.max(doc.scrollWidth, document.body.scrollWidth) - doc.clientWidth;
  });
}

/**
 * Элементы, из-за которых страница уезжает вбок.
 *
 * Содержимое контейнеров с собственной прокруткой (таблицы, блоки кода)
 * не считается: оно шире контейнера намеренно и страницу не растягивает.
 */
async function overflowingElements(): Promise<string[]> {
  return page.evaluate(() => {
    const limit = document.documentElement.clientWidth + 1;
    const found: string[] = [];

    const insideScrollBox = (element: Element): boolean => {
      let parent = element.parentElement;
      while (parent && parent !== document.body) {
        const overflowX = getComputedStyle(parent).overflowX;
        if (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'hidden') return true;
        parent = parent.parentElement;
      }
      return false;
    };

    document.querySelectorAll('body *').forEach((element) => {
      if (found.length >= 5) return;
      const box = element.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) return;
      if (box.right <= limit) return;
      if (insideScrollBox(element)) return;

      const tag = element.tagName.toLowerCase();
      const cls = typeof element.className === 'string' ? element.className.slice(0, 60) : '';
      found.push(`${tag}.${cls} → right=${Math.round(box.right)}`);
    });

    return found;
  });
}

async function expectNoHorizontalScroll(title: string, path: string): Promise<void> {
  await page.goto(path);
  await page.waitForLoadState('networkidle');

  const overflow = await horizontalOverflow();
  const culprits = overflow > 1 ? (await overflowingElements()).join('; ') : '';

  expect(overflow, `${title} (${path}): виновники — ${culprits}`).toBeLessThanOrEqual(1);
}

test.describe('Экран 390 × 844', () => {
  test('страницы входа и регистрации не уезжают вбок', async () => {
    for (const item of PUBLIC_PAGES) {
      await expectNoHorizontalScroll(item.title, item.path);
    }
  });

  test('вход в систему', async () => {
    await page.goto('/register');
    await page.getByLabel('Логин').fill(LOGIN);
    await page.getByLabel('Пароль').fill(PASSWORD);
    await page.getByLabel('ФИО').fill('Мобильный Студент');
    await page.getByRole('button', { name: /Зарегистрироваться/i }).click();

    await expect(page).not.toHaveURL(/\/register/, { timeout: 60_000 });
  });

  test('внутренние страницы не уезжают вбок', async () => {
    for (const item of PRIVATE_PAGES) {
      await expectNoHorizontalScroll(item.title, item.path);
    }
  });

  test('боковое меню открывается бургером', async () => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Открыть меню' }).click();
    await expect(page.getByRole('button', { name: 'Закрыть меню' })).toBeVisible();

    await page.getByRole('link', { name: 'Учебный план', exact: true }).click();
    await expect(page).toHaveURL(/\/plan/);
  });

  test('кнопки достаточно крупные для пальца', async () => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const small = await page.evaluate(() => {
      const found: string[] = [];

      document.querySelectorAll('button, a[href]').forEach((element) => {
        if (found.length >= 5) return;
        const box = element.getBoundingClientRect();
        if (box.width === 0 || box.height === 0) return;
        // Ссылка «Перейти к содержимому» скрыта до фокуса — она не цель нажатия.
        if (element.classList.contains('sr-only')) return;
        // 32 px — мягкий порог: ссылки внутри абзацев и списков под него не подпадают.
        if (element.tagName === 'A' && element.closest('p, li, td')) return;
        if (box.height >= 32) return;

        const label = (element.textContent ?? '').trim().slice(0, 30);
        found.push(`${element.tagName.toLowerCase()}: ${Math.round(box.height)} px — «${label}»`);
      });

      return found;
    });

    expect(small, `Слишком мелкие цели нажатия: ${small.join('; ')}`).toEqual([]);
  });

  test('рабочее место задания пригодно для узкого экрана', async () => {
    await expectNoHorizontalScroll('Задание', '/tasks/task-js-validate-login');

    // Редактор и панель результатов должны помещаться, а не наезжать друг на друга.
    await expect(page.getByRole('button', { name: /Запустить тесты/i })).toBeVisible();
  });
});
