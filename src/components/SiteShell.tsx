'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import Footer from './Footer';
import SmoothScroll from './SmoothScroll';
import LoadingCurtain from './LoadingCurtain';

const MINIMAL_ROUTES = ['/login'];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMinimal = MINIMAL_ROUTES.some((r) => pathname.startsWith(r));

  if (isMinimal) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <LoadingCurtain />
      <SmoothScroll>
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
