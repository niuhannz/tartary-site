import type { Metadata } from 'next';
import './globals.css';

import SiteShell from '@/components/SiteShell';
import { AuthProvider } from '@/lib/AuthContext';

export const metadata: Metadata = {
  title: {
    default: 'TARTARY — Sovereign AI Conglomerate',
    template: '%s — TARTARY',
  },
  description:
    'Tartary is a sovereign AI conglomerate: Universe, System, Studio, Press, and Civilian — every layer owned, every tool built in-house.',
  keywords: [
    'Tartary',
    'AI conglomerate',
    'Tartary OS',
    'Swinggang NLE',
    'Commandment',
    'sovereign AI',
    'vertical ecosystem',
    'AI-first hardware',
  ],
  openGraph: {
    title: 'TARTARY — Sovereign AI Conglomerate',
    description:
      'A sovereign AI conglomerate spanning Universe, System, Studio, Press, and Civilian.',
    url: 'https://www.tartary.com',
    siteName: 'TARTARY',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TARTARY — Sovereign AI Conglomerate',
    description:
      'A sovereign AI conglomerate — every layer owned, every tool built in-house.',
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
        {/* Inter: universal typeface for all text
            Syne: logo wordmark only */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Syne:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain antialiased">
        <AuthProvider>
          <SiteShell>{children}</SiteShell>
        </AuthProvider>
      </body>
    </html>
  );
}
