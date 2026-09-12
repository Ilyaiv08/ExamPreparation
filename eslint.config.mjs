import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescriptRules from 'eslint-config-next/typescript';

/**
 * Плоская конфигурация ESLint (формат ESLint 9).
 * eslint-config-next 16 отдаёт готовые плоские конфиги — совместимость
 * через FlatCompat не нужна.
 */
const config = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'coverage/**',
      'test-results/**',
      'playwright-report/**',
      // Локальные копии библиотек: чужой код, восстанавливается `npm run assets`.
      'public/vendor/**',
      // Песочница — браузерный скрипт в старом синтаксисе, намеренно без модулей.
      'public/runner/**',
      // Результат работы scripts/parse-plan.mjs.
      'content/curriculum/plan.generated.json',
    ],
  },
  ...coreWebVitals,
  ...typescriptRules,
  {
    rules: {
      // Учебные тексты на русском: кавычки и апострофы внутри строк — норма.
      'react/no-unescaped-entities': 'off',
    },
  },
];

export default config;
