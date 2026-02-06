import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CursorGlow from '@/components/CursorGlow';
import PasswordGate from '@/components/PasswordGate';

export const metadata: Metadata = {
  title: {
    default: 'Tartary — Cinematic Content Studio',
    template: '%s — Tartary',
  },
  description:
    'Award-winning cinematic content creation studio. Production, consulting, producing, and advisory services for visionary projects. Based in California and Tennessee.',
  keywords: [
    'film production',
    'cinematic content',
    'production company',
    'film consulting',
    'entertainment studio',
    'Tartary',
  ],
  openGraph: {
    title: 'Tartary — Cinematic Content Studio',
    description:
      'Award-winning cinematic content creation studio. Production, consulting, and advisory services.',
    url: 'https://www.tartary.com',
    siteName: 'Tartary',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tartary — Cinematic Content Studio',
    description:
      'Award-winning cinematic content creation studio.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=IM+Fell+English:ital@0;1&family=Syne:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain antialiased">
        <PasswordGate>
          <CursorGlow />
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </PasswordGate>
      </body>
    </html>
  );
}
