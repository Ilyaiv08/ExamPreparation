import { redirect } from 'next/navigation';
import { readSession } from '@/lib/auth/session';
import { AppShell } from '@/components/layout/app-shell';

/** Оболочка авторизованной части приложения. */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await readSession();
  if (!session) redirect('/login');

  return <AppShell user={session}>{children}</AppShell>;
}
