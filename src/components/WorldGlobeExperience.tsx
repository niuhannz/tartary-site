'use client';

import { useState, useCallback, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { WORLDS, WORLD_ORDER, type WorldId } from '@/data/worlds';
import WorldSelector from './WorldSelector';

const GlobeViewer = dynamic(() => import('./GlobeViewer'), { ssr: false });

type ViewMode = 'globe' | 'map';

function GlobeLoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-gold/60 animate-spin" />
        <span className="text-[11px] tracking-[0.2em] uppercase text-ash" style={{ fontFamily: 'var(--font-mono)' }}>
          Loading World…
        </span>
      </div>
    </div>
  );
}

// ─── Interactive Flat Map (pan, zoom, rotate, double-click to refold) ─────
interface InteractiveFlatMapProps {
  worldId: WorldId;
  onDoubleTap: () => void;
}

function InteractiveFlatMap({ worldId, onDoubleTap }: InteractiveFlatMapProps) {
  const world = WORLDS[worldId];
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1, rotate: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const lastTouchDist = useRef<number | null>(null);
  const lastTouchAngle = useRef<number | null>(null);
  const lastTap = useRef<number>(0);
  const [hoveredLoc, setHoveredLoc] = useState<string | null>(null);

  // Convert lat/lng to azimuthal equidistant % positions
  const toAzimuthalPercent = (lat: number, lng: number) => {
    const latR = (lat * Math.PI) / 180;
    const lngR = (lng * Math.PI) / 180;
    const r = Math.PI / 2 - latR;
    const x = r * Math.sin(lngR);
    const y = -r * Math.cos(lngR);
    return { x: ((x / Math.PI) * 0.45 + 0.5) * 100, y: ((y / Math.PI) * 0.45 + 0.5) * 100 };
  };

  const typeColors: Record<string, string> = {
    capital: '#ffd700', city: '#c0c0c0', landmark: '#00d4ff', conflict: '#ff4444',
  };

  // Mouse drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y };
  }, [transform.x, transform.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setTransform((t) => ({ ...t, x: dragStart.current!.tx + dx, y: dragStart.current!.ty + dy }));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform((t) => ({ ...t, scale: Math.max(0.3, Math.min(5, t.scale * delta)) }));
  }, []);

  // Double-click to refold
  const handleDoubleClick = useCallback(() => {
    onDoubleTap();
  }, [onDoubleTap]);

  // Touch handling (pinch zoom + rotate + drag)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTap.current < 300) {
        onDoubleTap();
        return;
      }
      lastTap.current = now;
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, tx: transform.x, ty: transform.y };
      setIsDragging(true);
    } else if (e.touches.length === 2) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      lastTouchDist.current = Math.sqrt(dx * dx + dy * dy);
      lastTouchAngle.current = Math.atan2(dy, dx);
    }
  }, [transform.x, transform.y, onDoubleTap]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging && dragStart.current) {
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      setTransform((t) => ({ ...t, x: dragStart.current!.tx + dx, y: dragStart.current!.ty + dy }));
    } else if (e.touches.length === 2) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      if (lastTouchDist.current !== null && lastTouchAngle.current !== null) {
        const scaleDelta = dist / lastTouchDist.current;
        const rotateDelta = ((angle - lastTouchAngle.current) * 180) / Math.PI;
        setTransform((t) => ({
          ...t,
          scale: Math.max(0.3, Math.min(5, t.scale * scaleDelta)),
          rotate: t.rotate + rotateDelta,
        }));
      }
      lastTouchDist.current = dist;
      lastTouchAngle.current = angle;
    }
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
    lastTouchDist.current = null;
    lastTouchAngle.current = null;
  }, []);

  // Reset on world change
  useEffect(() => {
    setTransform({ x: 0, y: 0, scale: 1, rotate: 0 });
  }, [worldId]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) rotate(${transform.rotate}deg)`,
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        }}
      >
        <div className="relative" style={{ width: '85vmin', height: '85vmin', maxWidth: '800px', maxHeight: '800px' }}>
          <Image
            src={world.flatMapTexturePath}
            alt={`${world.name} map`}
            fill
            className="object-contain pointer-events-none select-none"
            draggable={false}
            priority
          />

          {/* Location markers */}
          {world.keyLocations.map((loc) => {
            const pos = toAzimuthalPercent(loc.lat, loc.lng);
            const isHovered = hoveredLoc === loc.name;
            return (
              <div
                key={loc.name}
                className="absolute z-10"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                onMouseEnter={() => setHoveredLoc(loc.name)}
                onMouseLeave={() => setHoveredLoc(null)}
              >
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: 18, height: 18, left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)',
                    border: `1px solid ${typeColors[loc.type]}`, opacity: 0.4,
                  }}
                  animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                <div
                  className="relative w-2 h-2 rounded-full z-10"
                  style={{ backgroundColor: typeColors[loc.type], boxShadow: `0 0 8px ${typeColors[loc.type]}80` }}
                />
                <AnimatePresence>
                  {(loc.type === 'capital' || isHovered) && (
                    <motion.div
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 3 }}
                      className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-20"
                      style={{ top: '-24px' }}
                    >
                      <span
                        className="text-[8px] md:text-[9px] tracking-[0.12em] uppercase px-1.5 py-0.5 rounded"
                        style={{
                          fontFamily: 'var(--font-mono)', color: typeColors[loc.type],
                          background: 'rgba(13,13,13,0.85)', border: `1px solid ${typeColors[loc.type]}25`,
                        }}
                      >
                        {loc.name}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Double-click hint */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.span
          className="text-[10px] tracking-[0.2em] uppercase text-ash/50 px-3 py-1 rounded-full bg-carbon/60 backdrop-blur-sm"
          style={{ fontFamily: 'var(--font-mono)' }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Double-click to refold globe
        </motion.span>
      </motion.div>
    </div>
  );
}

// ─── Main Fullscreen Experience ────────────────────────
export default function WorldGlobeExperience() {
  const [currentWorld, setCurrentWorld] = useState<WorldId>('HEAVENFALL');
  const [viewMode, setViewMode] = useState<ViewMode>('globe');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [globeOpacity, setGlobeOpacity] = useState(1);
  const [globeReady, setGlobeReady] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

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
    <div className="fixed inset-0 z-50 bg-carbon overflow-hidden">
      {/* Full-bleed background */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, #111122 0%, #0a0a0a 60%, #050505 100%)' }}
      />

      {/* Globe / Map — fills entire viewport */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          {viewMode === 'globe' ? (
            <motion.div
              key="globe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
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
                className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: globeReady ? 1 : 0 }}
                transition={{ delay: 2.5, duration: 1 }}
              >
                <motion.span
                  className="text-[10px] tracking-[0.2em] uppercase text-ash/50 px-3 py-1.5 rounded-full bg-carbon/40 backdrop-blur-sm"
                  style={{ fontFamily: 'var(--font-mono)' }}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Click globe to unfold
                </motion.span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <InteractiveFlatMap worldId={currentWorld} onDoubleTap={handleBackToGlobe} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── OVERLAY UI ─── */}

      {/* Top bar: World Selector (center) + View Toggle (right) */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
        <div className="flex items-start justify-between p-4 md:p-6">
          {/* Back to Worlds link (top-left) */}
          <a
            href="/worlds"
            className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/[0.06] hover:bg-black/50 transition-all duration-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="text-[10px] tracking-[0.15em] uppercase text-ash hidden md:inline" style={{ fontFamily: 'var(--font-mono)' }}>
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
            {viewMode === 'globe' ? (
              <button
                onClick={handleExploreMap}
                disabled={isTransitioning}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/[0.06] hover:bg-black/50 transition-all duration-300 disabled:opacity-40"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                  <line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
                </svg>
                <span className="text-[10px] tracking-[0.12em] uppercase text-ash hidden md:inline" style={{ fontFamily: 'var(--font-mono)' }}>Unfold</span>
              </button>
            ) : (
              <button
                onClick={handleBackToGlobe}
                disabled={isTransitioning}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/[0.06] hover:bg-black/50 transition-all duration-300 disabled:opacity-40"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span className="text-[10px] tracking-[0.12em] uppercase text-ash hidden md:inline" style={{ fontFamily: 'var(--font-mono)' }}>Globe</span>
              </button>
            )}
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

          {/* Toggle info button */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="pointer-events-auto mt-3 flex items-center gap-1.5 text-[9px] tracking-[0.15em] uppercase text-ash/50 hover:text-ash transition-colors"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <svg
              width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ transform: showInfo ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
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
              const tc: Record<string, string> = { capital: '#ffd700', city: '#c0c0c0', landmark: '#00d4ff', conflict: '#ff4444' };
              return (
                <div key={loc.name} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: tc[loc.type] }} />
                  <span className="text-[10px] text-ash/70 truncate" style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}>
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
