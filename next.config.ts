import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Кружок с буквой N в углу — панель разработчика Next.js. В сборке его нет,
  // а в режиме разработки он ложится поверх карточки пользователя в боковом меню
  // и мешает смотреть на интерфейс так, как его увидит студент.
  devIndicators: false,
  // Prisma тянет нативные движки — их нельзя бандлить в серверный чанк.
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  async headers() {
    return [
      {
        // Песочница выполнения кода живёт в opaque-origin (sandbox="allow-scripts"),
        // поэтому её запросы к статике приходят с Origin: null.
        // Разрешаем только заведомо публичные файлы движков — не API.
        source: '/vendor/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/runner/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
    ];
  },
};

export default nextConfig;
