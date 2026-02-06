import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Map — The Realm of Heavenfall & BASEBORN',
  description: 'Explore the interactive map of The Realm, featuring two historical eras: the Ancient Fifteen of Heavenfall and the War of Ash and Storm in the BASEBORN era.',
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-20 bg-[#0a0a0a]">
      {children}
    </div>
  );
}
