'use client';

import dynamic from 'next/dynamic';
import PageHeader from '@/components/PageHeader';

// Dynamic import with no SSR — Three.js requires browser APIs
const WorldGlobeExperience = dynamic(() => import('@/components/WorldGlobeExperience'), {
  ssr: false,
  loading: () => (
    <div className="w-full flex justify-center items-center" style={{ height: 'clamp(400px, 70vh, 800px)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-gold/60 animate-spin" />
        <span
          className="text-[11px] tracking-[0.2em] uppercase text-ash"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Initialising Globe…
        </span>
      </div>
    </div>
  ),
});

export default function WorldsExplorePage() {
  return (
    <>
      <PageHeader
        label="Navigate Four Realities"
        title="Explore the Worlds"
        description="Rotate, zoom, and unfold the globes of four distinct realities — from high-fantasy kingdoms to alternate-history Earth."
      />

      <section className="px-6 md:px-10 pb-24 md:pb-32">
        <div className="max-w-[1400px] mx-auto">
          <WorldGlobeExperience />
        </div>
      </section>
    </>
  );
}
