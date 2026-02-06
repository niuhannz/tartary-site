import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Map — The Realm',
  description: 'Explore the interactive map of The Realm. 32 locations, 8 kingdoms, and the lore of Baseborn.',
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-20 bg-[#1a1612]">
      {children}
    </div>
  );
}
