'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { WORLDS, WORLD_ORDER, type WorldId } from '@/data/worlds';
import WorldSelector from './WorldSelector';

// Dynamic imports — no SSR for Three.js / InteractiveMap
const GlobeViewer = dynamic(() => import('./GlobeViewer'), { ssr: false });
const InteractiveMap = dynamic(() => import('./InteractiveMap'), { ssr: false });

type ViewMode = 'globe' | 'map';

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

// Simple flat map for Earth-based worlds (MARGIN, XT111, THE_UNRECORDED)
function EarthFlatMap({ worldId }: { worldId: WorldId }) {
  const world = WORLDS[worldId];

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      {/* Map texture background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${world.flatMapTexturePath})`,
          filter: 'brightness(0.7) contrast(1.1)',
        }}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-carbon/80" />

      {/* Location markers */}
      <div className="absolute inset-0">
        {world.keyLocations.map((loc) => {
          // Simple lat/lng to percentage conversion (equirectangular)
          const x = ((loc.lng + 180) / 360) * 100;
          const y = ((90 - loc.lat) / 180) * 100;

          const typeColors: Record<string, string> = {
            capital: '#ffd700',
            city: '#c0c0c0',
            landmark: '#00d4ff',
            conflict: '#ff4444',
          };

          return (
            <div
              key={loc.name}
              className="absolute group"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {/* Pulse ring */}
              <div
                className="absolute w-6 h-6 rounded-full animate-ping opacity-30"
                style={{
                  backgroundColor: typeColors[loc.type],
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />

              {/* Marker dot */}
              <div
                className="relative w-3 h-3 rounded-full border border-white/40 cursor-pointer z-10"
                style={{ backgroundColor: typeColors[loc.type] }}
              />

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                <div
                  className="px-3 py-2 rounded-md whitespace-nowrap text-center"
                  style={{
                    background: 'rgba(13,13,13,0.95)',
                    border: `1px solid ${typeColors[loc.type]}40`,
                    boxShadow: `0 4px 20px rgba(0,0,0,0.6)`,
                  }}
                >
                  <span
                    className="block text-[11px] tracking-wider uppercase"
                    style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, color: typeColors[loc.type] }}
                  >
                    {loc.name}
                  </span>
                  {loc.description && (
                    <span
                      className="block text-[10px] text-ash mt-1 max-w-[200px]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {loc.description}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex gap-4">
        {[
          { type: 'capital', label: 'Capital', color: '#ffd700' },
          { type: 'landmark', label: 'Landmark', color: '#00d4ff' },
          { type: 'conflict', label: 'Conflict', color: '#ff4444' },
        ].map((item) => (
          <div key={item.type} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] tracking-wider uppercase text-ash" style={{ fontFamily: 'var(--font-mono)' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WorldGlobeExperience() {
  const [currentWorld, setCurrentWorld] = useState<WorldId>('HEAVENFALL');
  const [viewMode, setViewMode] = useState<ViewMode>('globe');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [globeOpacity, setGlobeOpacity] = useState(1);
  const [globeReady, setGlobeReady] = useState(false);

  const world = WORLDS[currentWorld];

  const handleSelectWorld = useCallback(
    (worldId: WorldId) => {
      if (worldId === currentWorld || isTransitioning) return;

      setIsTransitioning(true);
      setViewMode('globe');

      // Fade out
      setGlobeOpacity(0);

      setTimeout(() => {
        setCurrentWorld(worldId);

        // Fade in
        setTimeout(() => {
          setGlobeOpacity(1);
          setTimeout(() => setIsTransitioning(false), 400);
        }, 100);
      }, 400);
    },
    [currentWorld, isTransitioning]
  );

  const handleExploreMap = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Zoom effect via opacity
    setGlobeOpacity(0);

    setTimeout(() => {
      setViewMode('map');
      setTimeout(() => setIsTransitioning(false), 300);
    }, 600);
  }, [isTransitioning]);

  const handleBackToGlobe = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setTimeout(() => {
      setViewMode('globe');
      setGlobeOpacity(0);

      setTimeout(() => {
        setGlobeOpacity(1);
        setTimeout(() => setIsTransitioning(false), 400);
      }, 100);
    }, 300);
  }, [isTransitioning]);

  return (
    <div className="w-full">
      {/* World Selector */}
      <div className="mb-8">
        <WorldSelector
          currentWorld={currentWorld}
          onSelectWorld={handleSelectWorld}
          isTransitioning={isTransitioning}
        />
      </div>

      {/* Globe / Map Viewport */}
      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          height: 'clamp(400px, 70vh, 800px)',
          background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0d0d0d 70%)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <AnimatePresence mode="wait">
          {viewMode === 'globe' ? (
            <motion.div
              key="globe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Suspense fallback={<GlobeLoadingFallback />}>
                <GlobeViewer
                  world={world}
                  isTransitioning={isTransitioning}
                  globeOpacity={globeOpacity}
                  onReady={() => setGlobeReady(true)}
                />
              </Suspense>
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {currentWorld === 'HEAVENFALL' ? (
                <div className="w-full h-full">
                  <InteractiveMap />
                </div>
              ) : (
                <EarthFlatMap worldId={currentWorld} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* World Info Overlay (bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-carbon/90 via-carbon/50 to-transparent pointer-events-none z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWorld}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <span
                className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase block mb-2"
                style={{ fontFamily: 'var(--font-mono)', color: world.accentColor }}
              >
                {world.era}
              </span>
              <h2
                className="text-2xl md:text-4xl tracking-[0.1em] uppercase mb-2"
                style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
              >
                {world.name}
              </h2>
              <p
                className="text-sm md:text-base text-ash max-w-lg leading-relaxed"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              >
                {world.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex gap-3 z-10">
          {viewMode === 'globe' ? (
            <button
              onClick={handleExploreMap}
              disabled={isTransitioning}
              className="pointer-events-auto px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 hover:border-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
              <span
                className="text-[11px] tracking-[0.12em] uppercase"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Explore Map
              </span>
            </button>
          ) : (
            <button
              onClick={handleBackToGlobe}
              disabled={isTransitioning}
              className="pointer-events-auto px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 hover:border-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span
                className="text-[11px] tracking-[0.12em] uppercase"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Back to Globe
              </span>
            </button>
          )}
        </div>
      </div>

      {/* World Description Section (below globe) */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentWorld}-lore`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="text-[11px] tracking-[0.3em] uppercase block mb-4"
              style={{ fontFamily: 'var(--font-mono)', color: world.accentColor }}
            >
              About This World
            </span>
            <p
              className="text-lg md:text-xl text-mist leading-relaxed mb-6"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
            >
              {world.description}
            </p>
            <p
              className="text-base text-ash leading-relaxed"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
            >
              {world.lore}
            </p>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentWorld}-locations`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span
              className="text-[11px] tracking-[0.3em] uppercase block mb-4"
              style={{ fontFamily: 'var(--font-mono)', color: world.accentColor }}
            >
              Key Locations
            </span>
            <div className="space-y-4">
              {world.keyLocations.map((loc) => {
                const typeColors: Record<string, string> = {
                  capital: '#ffd700',
                  city: '#c0c0c0',
                  landmark: '#00d4ff',
                  conflict: '#ff4444',
                };

                return (
                  <div
                    key={loc.name}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors duration-300"
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: typeColors[loc.type] }}
                    />
                    <div>
                      <span
                        className="text-sm tracking-wide block"
                        style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}
                      >
                        {loc.name}
                      </span>
                      {loc.description && (
                        <span
                          className="text-xs text-ash mt-0.5 block"
                          style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
                        >
                          {loc.description}
                        </span>
                      )}
                    </div>
                    <span
                      className="ml-auto text-[9px] tracking-wider uppercase text-ash/50 shrink-0"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {loc.type}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
