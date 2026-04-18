'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

const MINIMAL_ROUTES = ['/login', '/gate'];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMinimal = MINIMAL_ROUTES.some((r) => pathname.startsWith(r));

  if (isMinimal) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen">{children}</main>
    </>
  );
}
