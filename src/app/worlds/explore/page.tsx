'use client';

import dynamic from 'next/dynamic';

// Dynamic import with no SSR — Three.js requires browser APIs
const WorldGlobeExperience = dynamic(() => import('@/components/WorldGlobeExperience'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-carbon flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-gold/60 animate-spin" />
        <span className="text-[11px] tracking-[0.2em] uppercase text-ash" style={{ fontFamily: 'var(--font-mono)' }}>
          Initialising Globe…
        </span>
      </div>
    </div>
  ),
});

export default function WorldsExplorePage() {
  return <WorldGlobeExperience />;
}
