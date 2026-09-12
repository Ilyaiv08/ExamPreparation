/**
 * Удаляет учётные записи, которые заводят сценарные тесты.
 *
 * Каждый прогон Playwright регистрирует нового пользователя со случайным
 * логином (`e2e/*.spec.ts`), и за десяток прогонов база обрастает сотнями
 * записей. Настоящие пользователи от них не отличаются ничем, кроме логина,
 * поэтому удаляем строго по шаблону «префикс теста + семь цифр».
 *
 * Связанные строки (прогресс, попытки, заметки) уходят каскадом — так описаны
 * все связи в schema.prisma.
 *
 * Запуск:
 *   npm run db:clean-tests          — удалить
 *   npm run db:clean-tests -- --dry — только показать, что будет удалено
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Префиксы из e2e/*.spec.ts: `audit${Date.now().toString().slice(-7)}` и так далее. */
const TEST_PREFIXES = ['audit', 'dark', 'mobile', 'student', 'sol'] as const;

/**
 * Логин теста — это префикс и хвост таймстампа: сейчас семь цифр, в более
 * ранних прогонах было шесть. Ничего, кроме такого шаблона, не трогаем.
 */
const TEST_LOGIN = new RegExp(`^(${TEST_PREFIXES.join('|')})\\d{6,7}$`);

async function main() {
  const dryRun = process.argv.includes('--dry');

  const users = await prisma.user.findMany({ select: { id: true, login: true, role: true } });
  const doomed = users.filter((user) => user.role === 'student' && TEST_LOGIN.test(user.login));
  const kept = users.filter((user) => !doomed.includes(user));

  console.log(`всего учётных записей: ${users.length}`);
  console.log(`останется: ${kept.length} — ${kept.map((user) => user.login).join(', ')}`);
  console.log(`под удаление: ${doomed.length}`);

  for (const prefix of TEST_PREFIXES) {
    const count = doomed.filter((user) => user.login.startsWith(prefix)).length;
    if (count > 0) console.log(`  ${prefix}*: ${count}`);
  }

  if (doomed.length === 0) {
    console.log('чисто, удалять нечего');
    return;
  }

  if (dryRun) {
    console.log('\n--dry: ничего не удалено');
    return;
  }

  const { count } = await prisma.user.deleteMany({ where: { id: { in: doomed.map((user) => user.id) } } });
  console.log(`\nудалено: ${count}`);
}

main()
  .catch((error) => {
    console.error('[clean-test-users] ошибка:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
