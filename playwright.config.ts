import { defineConfig, devices } from '@playwright/test';

/**
 * E2E-сценарий из раздела 49 ТЗ: путь студента от регистрации
 * до экзаменационного режима, целиком в настоящем браузере.
 *
 * Песочница выполнения кода работает только в браузере (iframe с opaque-origin),
 * поэтому проверить её модульными тестами нельзя в принципе — только здесь.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 120_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3100',
    locale: 'ru-RU',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'desktop',
      testIgnore: /task-solutions\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      // Прогон эталонных решений всех заданий: длинный, поэтому отдельным
      // проектом — npm run test:solutions.
      name: 'solutions',
      testMatch: /task-solutions\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      // Размер из задания демоэкзамена: платформа обязана работать и на нём.
      name: 'mobile-390',
      testMatch: /mobile\.spec\.ts/,
      use: { ...devices['Pixel 5'], viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: process.env.E2E_NO_SERVER
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3100',
        reuseExistingServer: true,
        timeout: 180_000,
      },
});
