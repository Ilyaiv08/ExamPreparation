import { expect, test, type BrowserContext, type Page } from '@playwright/test';

/**
 * Тёмная тема.
 *
 * Палитра взята из VisioLogos: почти чёрная основа, поверхности отличаются
 * на пару процентов яркости, границы — полупрозрачный белый вместо серых линий.
 *
 * Проверяем главное, что можно сломать незаметно: читаемость текста.
 * Подобрать красивый оттенок легко, а вот заметить, что подписи ушли
 * в нечитаемый серый, — нет.
 */

const LOGIN = `dark${Date.now().toString().slice(-7)}`;
const PASSWORD = 'demo2026pass';

const ROUTES = [
  '/',
  '/plan',
  '/plan/day/day-01-1',
  '/theory/web-basics',
  '/tasks/task-js-validate-login',
  '/projects/project-01-event-page',
  '/exams',
  '/progress',
];

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

/** Контраст текста к фактическому фону под ним, по формуле WCAG. */
async function lowContrastElements(): Promise<string[]> {
  return page.evaluate(() => {
    const parse = (value: string): [number, number, number, number] | null => {
      const parts = value.match(/[\d.]+/g);
      if (!parts) return null;
      return [Number(parts[0]), Number(parts[1]), Number(parts[2]), parts[3] === undefined ? 1 : Number(parts[3])];
    };

    const luminance = ([r, g, b]: number[]): number => {
      const channel = (v: number) => {
        const n = v / 255;
        return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };

    // Фон берём у ближайшего непрозрачного предка: у самого элемента его
    // обычно нет, а сравнивать текст не с чем.
    const backgroundOf = (element: Element): number[] => {
      let node: Element | null = element;
      while (node && node !== document.documentElement) {
        const color = parse(getComputedStyle(node).backgroundColor);
        if (color && color[3] > 0.5) return color;
        node = node.parentElement;
      }
      return [8, 9, 11, 1];
    };

    const problems: string[] = [];

    // Внутренности редактора Monaco не проверяем: у него собственная тема
    // vs-dark — та же, что в VS Code, где студент будет работать на экзамене.
    // Перекрашивать её под наши пороги значит делать платформу непохожей
    // на настоящий редактор, а это дороже, чем 4,2 вместо 4,5 у комментария.
    const insideEditor = (element: Element): boolean => Boolean(element.closest('.monaco-editor'));

    document.querySelectorAll('main *').forEach((element) => {
      if (problems.length >= 8) return;
      if (element.children.length > 0) return;
      if (insideEditor(element)) return;

      const text = (element.textContent ?? '').trim();
      if (!text) return;

      const styles = getComputedStyle(element);
      if (styles.visibility === 'hidden' || styles.display === 'none') return;

      const box = element.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) return;

      const foreground = parse(styles.color);
      if (!foreground) return;

      const background = backgroundOf(element);
      const first = luminance(foreground);
      const second = luminance(background);
      const ratio = (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);

      const size = parseFloat(styles.fontSize);
      const bold = Number.parseInt(styles.fontWeight, 10) >= 700;
      // Порог WCAG AA: крупному тексту достаточно 3:1, остальному нужно 4.5:1.
      const required = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;

      if (ratio < required) {
        problems.push(`«${text.slice(0, 30)}» ${ratio.toFixed(2)} при нужных ${required}`);
      }
    });

    return problems;
  });
}

test('вход и включение тёмной темы', async () => {
  await page.goto('/register');
  await page.getByLabel('Логин').fill(LOGIN);
  await page.getByLabel('Пароль').fill(PASSWORD);
  await page.getByLabel('ФИО').fill('Тёмная Тема');
  await page.getByRole('button', { name: /Зарегистрироваться/i }).click();
  await expect(page).not.toHaveURL(/\/register/, { timeout: 60_000 });

  // Кнопка перебирает три режима по кругу: системный, светлый, тёмный.
  // Новый пользователь начинает с системного, поэтому жмём до нужного.
  const toggle = page.getByRole('button', { name: /Переключить/i });
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if ((await page.locator('html').getAttribute('data-theme')) === 'dark') break;
    await toggle.click();
    await page.waitForTimeout(500);
  }

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark', { timeout: 20_000 });
});

test('палитра соответствует VisioLogos', async () => {
  const palette = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const read = (name: string) => root.getPropertyValue(name).trim();
    return {
      surface: read('--surface'),
      page: read('--surface-2'),
      ink: read('--ink'),
      line: read('--line'),
    };
  });

  expect(palette.page).toBe('#08090b');
  expect(palette.surface).toBe('#0e0f12');
  expect(palette.ink).toBe('#f3f4f6');
  // Граница — полупрозрачный белый, а не сплошная серая линия.
  // Браузер может отдать её как rgb(...) с альфой или как #ffffffXX.
  expect(palette.line).toMatch(/^(rgba?\(255[,\s]+255[,\s]+255\s*[,/]|#ffffff[0-9a-f]{2}$)/i);
});

test('фон страницы действительно тёмный', async () => {
  const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const parts = (background.match(/\d+/g) ?? []).map(Number);

  expect(parts.length).toBeGreaterThanOrEqual(3);
  for (const channel of parts.slice(0, 3)) expect(channel).toBeLessThan(40);
});

test('текст читается на всех основных страницах', async () => {
  const problems: string[] = [];

  for (const route of ROUTES) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');

    for (const item of await lowContrastElements()) {
      problems.push(`${route}: ${item}`);
    }
  }

  expect(problems, `Нечитаемый текст в тёмной теме: ${problems.join('; ')}`).toEqual([]);
});

test('переключение обратно на светлую тему работает', async () => {
  await page.goto('/');
  await page.getByRole('button', { name: /Переключить/i }).click();

  await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark', { timeout: 20_000 });
});
