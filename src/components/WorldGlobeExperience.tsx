'use client';

import { useState, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
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

// ─── UN-Style Azimuthal Flat Map ──────────────────────
function AzimuthalFlatMap({ worldId }: { worldId: WorldId }) {
  const world = WORLDS[worldId];
  const [hoveredLoc, setHoveredLoc] = useState<string | null>(null);

  // Convert lat/lng to azimuthal equidistant coordinates (centred on North Pole)
  // Returns percentage position within the circular map image
  const toAzimuthalPercent = (lat: number, lng: number) => {
    const latR = (lat * Math.PI) / 180;
    const lngR = (lng * Math.PI) / 180;
    const r = Math.PI / 2 - latR; // distance from pole
    const x = r * Math.sin(lngR);
    const y = -r * Math.cos(lngR);
    // Map from [-pi, pi] range to [0%, 100%]
    const px = ((x / Math.PI) * 0.45 + 0.5) * 100;
    const py = ((y / Math.PI) * 0.45 + 0.5) * 100;
    return { x: px, y: py };
  };

  const typeColors: Record<string, string> = {
    capital: '#ffd700',
    city: '#c0c0c0',
    landmark: '#00d4ff',
    conflict: '#ff4444',
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Circular map background */}
      <div className="relative" style={{ width: '90%', maxWidth: '700px', aspectRatio: '1' }}>
        <Image
          src={world.flatMapTexturePath}
          alt={`${world.name} map`}
          fill
          className="object-contain"
          priority
        />

        {/* Location markers overlaid on the circular map */}
        {world.keyLocations.map((loc) => {
          const pos = toAzimuthalPercent(loc.lat, loc.lng);
          const isHovered = hoveredLoc === loc.name;

          return (
            <div
              key={loc.name}
              className="absolute z-10"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseEnter={() => setHoveredLoc(loc.name)}
              onMouseLeave={() => setHoveredLoc(null)}
            >
              {/* Pulse ring */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 20,
                  height: 20,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  border: `1px solid ${typeColors[loc.type]}`,
                  opacity: 0.4,
                }}
                animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />

              {/* Dot */}
              <div
                className="relative w-2.5 h-2.5 rounded-full cursor-pointer z-10"
                style={{
                  backgroundColor: typeColors[loc.type],
                  boxShadow: `0 0 8px ${typeColors[loc.type]}80`,
                }}
              />

              {/* Label (always visible for capitals, hover for others) */}
              <AnimatePresence>
                {(loc.type === 'capital' || isHovered) && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-20"
                    style={{ top: '-28px' }}
                  >
                    <span
                      className="text-[9px] md:text-[10px] tracking-[0.12em] uppercase px-2 py-1 rounded"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: typeColors[loc.type],
                        background: 'rgba(13,13,13,0.9)',
                        border: `1px solid ${typeColors[loc.type]}30`,
                      }}
                    >
                      {loc.name}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Description tooltip on hover */}
              <AnimatePresence>
                {isHovered && loc.description && (
                  <motion.div
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-20"
                    style={{ bottom: '-26px' }}
                  >
                    <span
                      className="text-[8px] md:text-[9px] text-ash px-2 py-0.5 rounded"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 300,
                        fontStyle: 'italic',
                        background: 'rgba(13,13,13,0.9)',
                      }}
                    >
                      {loc.description}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
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
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span
              className="text-[9px] tracking-wider uppercase text-ash"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Experience ──────────────────────────────────
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
      setGlobeOpacity(0);
      setTimeout(() => {
        setCurrentWorld(worldId);
        setTimeout(() => {
          setGlobeOpacity(1);
          setTimeout(() => setIsTransitioning(false), 400);
        }, 100);
      }, 400);
    },
    [currentWorld, isTransitioning]
  );

  const handleExploreMap = useCallback(() => {
    if (isTransitioning || viewMode === 'map') return;
    setIsTransitioning(true);
    setGlobeOpacity(0);
    setTimeout(() => {
      setViewMode('map');
      setTimeout(() => setIsTransitioning(false), 300);
    }, 600);
  }, [isTransitioning, viewMode]);

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
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Suspense fallback={<GlobeLoadingFallback />}>
                <GlobeViewer
                  world={world}
                  isTransitioning={isTransitioning}
                  globeOpacity={globeOpacity}
                  onReady={() => setGlobeReady(true)}
                  onGlobeClick={handleExploreMap}
                />
              </Suspense>

              {/* Click hint */}
              <motion.div
                className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: globeReady ? 1 : 0 }}
                transition={{ delay: 2, duration: 1 }}
              >
                <motion.span
                  className="text-[10px] tracking-[0.2em] uppercase text-ash/60"
                  style={{ fontFamily: 'var(--font-mono)' }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Click globe to unfold map
                </motion.span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.85, borderRadius: '50%' }}
              animate={{ opacity: 1, scale: 1, borderRadius: '0%' }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              {currentWorld === 'HEAVENFALL' && world.mapType === 'fantasy' ? (
                /* HEAVENFALL uses the full interactive map for "map" mode,
                   but the azimuthal flat map for the initial unfold view */
                <AzimuthalFlatMap worldId={currentWorld} />
              ) : (
                <AzimuthalFlatMap worldId={currentWorld} />
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

        {/* View Toggle Controls */}
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
              <span className="text-[11px] tracking-[0.12em] uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                Unfold Map
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
              <span className="text-[11px] tracking-[0.12em] uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
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
