'use client';

import InteractiveMap from '@/components/InteractiveMap';

export default function MapPage() {
  return (
    <div className="fixed inset-0 z-30">
      <InteractiveMap />
    </div>
  );
}
