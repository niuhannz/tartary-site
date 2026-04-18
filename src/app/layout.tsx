import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TARTARY — Sovereign AI Conglomerate",
  description:
    "Universe. System. Studio. Press. Civilian.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=IBM+Plex+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain antialiased min-h-screen">

        {children}
      </body>
    </html>
  );
}
