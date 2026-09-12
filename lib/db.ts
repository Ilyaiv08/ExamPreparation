import { PrismaClient } from '@prisma/client';

/**
 * Единственный экземпляр Prisma на процесс.
 * В режиме разработки Next перезагружает модули, поэтому клиент кладётся
 * в globalThis — иначе при каждом hot-reload открывается новое соединение.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
