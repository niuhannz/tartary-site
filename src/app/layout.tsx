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
    'Metal to soul. Tartary is a vertical AI ecosystem: OS, Studio, IP, Publishing, and Civilian applications — all running on a single M4 Max.',
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
      'Metal to soul. A vertical AI ecosystem spanning OS, Studio, IP, Publishing, and Civilian applications.',
    url: 'https://www.tartary.com',
    siteName: 'TARTARY',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TARTARY — Sovereign AI Conglomerate',
    description:
      'Metal to soul. A vertical AI ecosystem on a single M4 Max.',
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
        {/* IBM Plex Mono: technical data, nav, buttons, body copy
            Inter: headlines at 900 weight — heavy industrial sans-serif */}
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700;800;900&display=swap"
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
