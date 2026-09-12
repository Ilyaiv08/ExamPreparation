/**
 * Первичное наполнение базы.
 *
 * Создаёт администратора платформы. Логин и пароль берутся из .env
 * (ADMIN_LOGIN / ADMIN_PASSWORD), иначе используются значения по умолчанию,
 * которые ОБЯЗАТЕЛЬНО нужно сменить — об этом печатается предупреждение.
 *
 * Учебный контент здесь не сидируется: он живёт в файлах content/**
 * (раздел 29 ТЗ) и не требует записи в базу.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEFAULT_LOGIN = 'admin';
const DEFAULT_PASSWORD = 'admin12345';

async function main() {
  const login = process.env.ADMIN_LOGIN?.trim() || DEFAULT_LOGIN;
  const explicitPassword = process.env.ADMIN_PASSWORD?.trim();
  const password = explicitPassword || DEFAULT_PASSWORD;

  const existing = await prisma.user.findUnique({ where: { login } });
  if (existing) {
    // Пароль существующей учётной записи меняется только по явному
    // ADMIN_PASSWORD: иначе повторный `npm run db:seed` молча сбрасывал бы
    // рабочий пароль на значение по умолчанию.
    const data: { role?: string; passwordHash?: string } = {};
    if (existing.role !== 'admin') data.role = 'admin';
    if (explicitPassword) data.passwordHash = await bcrypt.hash(explicitPassword, 10);

    if (Object.keys(data).length === 0) {
      console.log(`[seed] администратор «${login}» уже существует, менять нечего`);
      return;
    }

    await prisma.user.update({ where: { id: existing.id }, data });
    if (data.role) console.log(`[seed] пользователь «${login}» получил роль администратора`);
    if (data.passwordHash) console.log(`[seed] пароль «${login}» обновлён`);
    return;
  }

  await prisma.user.create({
    data: {
      login,
      passwordHash: await bcrypt.hash(password, 10),
      fullName: 'Администратор платформы',
      role: 'admin',
      startDate: new Date('2026-09-14T00:00:00'),
    },
  });

  console.log(`[seed] создан администратор: ${login}`);
  if (password === DEFAULT_PASSWORD) {
    console.warn('[seed] ВНИМАНИЕ: пароль по умолчанию. Задайте ADMIN_PASSWORD в .env и выполните npm run db:seed заново.');
  }
}

main()
  .catch((error) => {
    console.error('[seed] ошибка:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
