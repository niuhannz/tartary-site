'use client';

import { useState, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { WORLDS, WORLD_ORDER, type WorldId } from '@/data/worlds';
import WorldSelector from './WorldSelector';

const MorphingGlobe = dynamic(() => import('./MorphingGlobe'), { ssr: false });

function GlobeLoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-gold/60 animate-spin" />
        <span
          className="text-[11px] tracking-[0.2em] uppercase text-ash"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Loading World…
        </span>
      </div>
    </div>
  );
}

export default function WorldGlobeExperience() {
  const [currentWorld, setCurrentWorld] = useState<WorldId>('HEAVENFALL');
  const [isFlat, setIsFlat] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [worldOpacity, setWorldOpacity] = useState(1);

  const world = WORLDS[currentWorld];

  const handleSelectWorld = useCallback(
    (worldId: WorldId) => {
      if (worldId === currentWorld || isTransitioning) return;
      setIsTransitioning(true);

      // If currently flat, fold back first
      if (isFlat) setIsFlat(false);

      // Fade out current world
      setWorldOpacity(0);
      setTimeout(() => {
        setCurrentWorld(worldId);
        setTimeout(() => {
          setWorldOpacity(1);
          setTimeout(() => setIsTransitioning(false), 500);
        }, 100);
      }, 500);
    },
    [currentWorld, isTransitioning, isFlat]
  );

  const handleToggle = useCallback(() => {
    if (isTransitioning) return;
    setIsFlat((f) => !f);
  }, [isTransitioning]);

  return (
    <div className="fixed inset-0 z-50 bg-carbon overflow-hidden">
      {/* Full-bleed background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, #111122 0%, #0a0a0a 60%, #050505 100%)',
        }}
      />

      {/* 3D Globe/Map — fills entire viewport */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: worldOpacity }}
      >
        <Suspense fallback={<GlobeLoadingFallback />}>
          <MorphingGlobe
            world={world}
            isFlat={isFlat}
            onToggle={handleToggle}
            onReady={() => setGlobeReady(true)}
          />
        </Suspense>
      </div>

      {/* Hint text */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: globeReady ? 1 : 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.span
          className="text-[10px] tracking-[0.2em] uppercase text-ash/50 px-3 py-1.5 rounded-full bg-carbon/40 backdrop-blur-sm"
          style={{ fontFamily: 'var(--font-mono)' }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {isFlat ? 'Double-click to refold · Drag to rotate' : 'Click globe to unfold'}
        </motion.span>
      </motion.div>

      {/* ─── OVERLAY UI ─── */}

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
        <div className="flex items-start justify-between p-4 md:p-6">
          {/* Back to Worlds (top-left) */}
          <a
            href="/worlds"
            className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/[0.06] hover:bg-black/50 transition-all duration-300"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span
              className="text-[10px] tracking-[0.15em] uppercase text-ash hidden md:inline"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Worlds
            </span>
          </a>

          {/* World selector (center) */}
          <div className="pointer-events-auto">
            <WorldSelector
              currentWorld={currentWorld}
              onSelectWorld={handleSelectWorld}
              isTransitioning={isTransitioning}
            />
          </div>

          {/* View toggle (right) */}
          <div className="pointer-events-auto">
            <button
              onClick={handleToggle}
              disabled={isTransitioning}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/[0.06] hover:bg-black/50 transition-all duration-300 disabled:opacity-40"
            >
              {isFlat ? (
                <>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <span
                    className="text-[10px] tracking-[0.12em] uppercase text-ash hidden md:inline"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    Globe
                  </span>
                </>
              ) : (
                <>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                    <line x1="8" y1="2" x2="8" y2="18" />
                    <line x1="16" y1="6" x2="16" y2="22" />
                  </svg>
                  <span
                    className="text-[10px] tracking-[0.12em] uppercase text-ash hidden md:inline"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    Unfold
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom-left: World info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentWorld}-info`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-30 max-w-sm pointer-events-none"
        >
          <span
            className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase block mb-1.5"
            style={{ fontFamily: 'var(--font-mono)', color: world.accentColor }}
          >
            {world.era}
          </span>
          <h2
            className="text-xl md:text-3xl tracking-[0.08em] uppercase mb-1.5"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
          >
            {world.name}
          </h2>
          <p
            className="text-xs md:text-sm text-ash/80 leading-relaxed max-w-xs"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
          >
            {world.subtitle}
          </p>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className="pointer-events-auto mt-3 flex items-center gap-1.5 text-[9px] tracking-[0.15em] uppercase text-ash/50 hover:text-ash transition-colors"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                transform: showInfo ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
            {showInfo ? 'Hide details' : 'Show details'}
          </button>

          <AnimatePresence>
            {showInfo && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="text-[11px] text-ash/60 leading-relaxed mt-3 overflow-hidden"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              >
                {world.description}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Bottom-right: Key Locations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentWorld}-locs`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-30 max-w-[220px] pointer-events-none hidden md:block"
        >
          <span
            className="text-[9px] tracking-[0.25em] uppercase block mb-3"
            style={{ fontFamily: 'var(--font-mono)', color: world.accentColor }}
          >
            Key Locations
          </span>
          <div className="space-y-2">
            {world.keyLocations.slice(0, 5).map((loc) => {
              const tc: Record<string, string> = {
                capital: '#ffd700',
                city: '#c0c0c0',
                landmark: '#00d4ff',
                conflict: '#ff4444',
              };
              return (
                <div key={loc.name} className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: tc[loc.type] }}
                  />
                  <span
                    className="text-[10px] text-ash/70 truncate"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                  >
                    {loc.name}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
