import type { Metadata } from "next";
import GlassCurtain from "@/components/GlassCurtain";
import "./globals.css";

export const metadata: Metadata = {
  title: "TARTARY — Spatial Computing Studio",
  description:
    "Building the future of cinematic and interactive content for Apple Vision Pro.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="min-h-screen bg-bg-void text-text-primary">
        <GlassCurtain />
        {children}
      </body>
    </html>
  );
}