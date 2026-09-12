import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

/**
 * Модульные и интеграционные тесты логики платформы.
 *
 * Тесты браузера (песочница, сценарий студента) живут отдельно — в Playwright,
 * потому что их нельзя честно проверить без настоящего браузера.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    globals: false,
    reporters: ['default'],
  },
});
