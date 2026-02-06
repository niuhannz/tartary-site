'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  locations,
  kingdoms,
  MARKER_COLORS,
  MARKER_SIZES,
  MARKER_LABELS,
  MAP_WIDTH,
  MAP_HEIGHT,
  type MapLocation,
  type LocationType,
} from '@/data/mapData';

// ============================================================================
// LORE CARD
// ============================================================================

function LoreCard({
  location,
  type,
  onClose,
}: {
  location: MapLocation;
  type: LocationType;
  onClose: () => void;
}) {
  const color = MARKER_COLORS[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed z-[60] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[420px]"
    >
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #1a1612 0%, #0f0d0a 100%)',
          border: `1px solid ${color}40`,
          borderRadius: '8px',
          boxShadow: `0 0 40px ${color}15, 0 20px 60px rgba(0,0,0,0.8)`,
        }}
      >
        {/* Top accent line */}
        <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

        {/* Header */}
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between">
            <div>
              <h3
                className="text-xl text-[#e6d5ac] tracking-wide"
                style={{ fontFamily: "'Cinzel', Georgia, serif", fontWeight: 700 }}
              >
                {location.name}
              </h3>
              <p className="text-xs text-[#666] mt-1" style={{ fontFamily: "'IM Fell English', Georgia, serif" }}>
                {location.cn}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-[#666] hover:text-[#e6d5ac] transition-colors"
              style={{ lineHeight: 1 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Type badge */}
          <div
            className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded text-[10px] tracking-[0.15em] uppercase"
            style={{
              background: `${color}15`,
              border: `1px solid ${color}30`,
              color: color,
              fontFamily: "'Space Mono', monospace",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: color,
                display: 'inline-block',
              }}
            />
            {MARKER_LABELS[type]}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 pb-5 space-y-4">
          <p className="text-[#c4b998] text-sm leading-relaxed" style={{ fontFamily: "'IM Fell English', Georgia, serif" }}>
            {location.desc}
          </p>

          <div
            className="relative p-4 rounded"
            style={{
              background: '#0a0908',
              borderLeft: `2px solid ${color}60`,
            }}
          >
            <p className="text-[#8a8070] text-xs italic leading-relaxed" style={{ fontFamily: "'IM Fell English', Georgia, serif" }}>
              &ldquo;{location.detail}&rdquo;
            </p>
          </div>
        </div>

        {/* Bottom accent line */}
        <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
      </div>
    </motion.div>
  );
}

// ============================================================================
// SIDEBAR
// ============================================================================

function Sidebar({
  isOpen,
  onToggle,
  onSelectLocation,
}: {
  isOpen: boolean;
  onToggle: () => void;
  onSelectLocation: (loc: MapLocation, type: LocationType) => void;
}) {
  const [expandedSection, setExpandedSection] = useState<LocationType | null>(null);
  const types = Object.keys(locations) as LocationType[];

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-40 px-1.5 py-4 transition-all duration-300"
        style={{
          background: '#1a1612',
          borderRight: '1px solid #3a3020',
          borderTop: '1px solid #3a3020',
          borderBottom: '1px solid #3a3020',
          borderRadius: '0 6px 6px 0',
          color: '#8b7355',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute left-0 top-0 bottom-0 w-[300px] z-30 flex flex-col overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #1a1612 0%, #0f0d0a 100%)',
              borderRight: '1px solid #3a3020',
            }}
          >
            {/* Header */}
            <div className="p-4 border-b" style={{ borderColor: '#3a3020' }}>
              <h2
                className="text-lg text-[#e6d5ac] tracking-wider"
                style={{ fontFamily: "'Cinzel', Georgia, serif", fontWeight: 700 }}
              >
                The Ledger
              </h2>
              <p
                className="text-[10px] tracking-[0.15em] uppercase text-[#8b7355] mt-1"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {Object.values(locations).flat().length} locations &middot; {kingdoms.length} kingdoms
              </p>
            </div>

            {/* Location sections */}
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3a3020 #0a0908' }}>
              {types.map((type) => {
                const locs = locations[type];
                const color = MARKER_COLORS[type];
                const isExpanded = expandedSection === type;

                return (
                  <div key={type} style={{ borderBottom: '1px solid #2a2018' }}>
                    <button
                      className="w-full p-3 flex items-center justify-between text-left transition-colors hover:bg-white/[0.02]"
                      onClick={() => setExpandedSection(isExpanded ? null : type)}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: color,
                            display: 'inline-block',
                            boxShadow: `0 0 6px ${color}60`,
                          }}
                        />
                        <span className="text-[#c4b998] text-sm" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
                          {MARKER_LABELS[type]}s
                        </span>
                        <span className="text-[#666] text-xs">({locs.length})</span>
                      </div>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#666"
                        strokeWidth="2"
                        style={{
                          transform: isExpanded ? 'rotate(90deg)' : 'none',
                          transition: 'transform 0.2s',
                        }}
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          {locs.map((loc) => (
                            <button
                              key={loc.id}
                              className="w-full px-4 py-2 pl-8 text-left text-sm transition-colors hover:bg-white/[0.03] flex items-center gap-2"
                              style={{ color: '#8a8070' }}
                              onClick={() => onSelectLocation(loc, type)}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.color = '#e6d5ac';
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.color = '#8a8070';
                              }}
                            >
                              <span
                                style={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: '50%',
                                  background: color,
                                  display: 'inline-block',
                                  flexShrink: 0,
                                }}
                              />
                              <span style={{ fontFamily: "'IM Fell English', Georgia, serif" }}>{loc.name}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Kingdoms section */}
              <div className="p-4 border-t" style={{ borderColor: '#3a3020' }}>
                <h3
                  className="text-sm text-[#e6d5ac] tracking-wider mb-3"
                  style={{ fontFamily: "'Cinzel', Georgia, serif", fontWeight: 600 }}
                >
                  Kingdoms
                </h3>
                <div className="space-y-1.5">
                  {kingdoms.map((k) => (
                    <div key={k.id} className="flex items-center gap-2.5 px-2 py-1.5">
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '2px',
                          background: k.color,
                          display: 'inline-block',
                          opacity: 0.7,
                        }}
                      />
                      <span className="text-xs text-[#8a8070]" style={{ fontFamily: "'IM Fell English', Georgia, serif" }}>
                        {k.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// MAIN MAP COMPONENT
// ============================================================================

export default function InteractiveMap() {
  const [selectedLocation, setSelectedLocation] = useState<{ loc: MapLocation; type: LocationType } | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showKingdoms, setShowKingdoms] = useState(true);

  // Pan & zoom state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // ── Drag handlers ──────────────────────────────────────────────
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('.lore-card-overlay')) return;
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    },
    [position]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      }
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        setIsDragging(true);
        setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
      }
    },
    [position]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        setPosition({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
      }
    },
    [isDragging, dragStart]
  );

  // ── Zoom ───────────────────────────────────────────────────────
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.92 : 1.08;
    setScale((prev) => Math.min(Math.max(prev * delta, 0.3), 5));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener('wheel', handleWheel, { passive: false });
      return () => el.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  // ── Keyboard ───────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedLocation(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // ── Zoom controls ──────────────────────────────────────────────
  const zoomIn = () => setScale((s) => Math.min(s * 1.3, 5));
  const zoomOut = () => setScale((s) => Math.max(s * 0.7, 0.3));
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // ── Select from sidebar ────────────────────────────────────────
  const handleSidebarSelect = (loc: MapLocation, type: LocationType) => {
    setSelectedLocation({ loc, type });
    setSidebarOpen(false);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={{ background: '#1a1612', fontFamily: "'Cinzel', Georgia, serif" }}
    >
      {/* Back to Worlds */}
      <Link
        href="/worlds"
        className="absolute top-4 left-4 z-40 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
        style={{
          background: '#1a1612e6',
          border: '1px solid #3a3020',
          color: '#8b7355',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 500,
            letterSpacing: '0.05em',
            fontSize: '11px',
            textTransform: 'uppercase',
          }}
        >
          Back to Worlds
        </span>
      </Link>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onSelectLocation={handleSidebarSelect}
      />

      {/* Controls: top-right */}
      <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setShowKingdoms(!showKingdoms)}
          className="px-3 py-2 rounded-lg text-[10px] tracking-[0.1em] uppercase transition-all"
          style={{
            fontFamily: "'Space Mono', monospace",
            background: showKingdoms ? '#8b735520' : '#1a1612e6',
            border: `1px solid ${showKingdoms ? '#8b7355' : '#3a3020'}`,
            color: showKingdoms ? '#e6d5ac' : '#666',
          }}
        >
          Kingdoms
        </button>
      </div>

      {/* Zoom controls: bottom-right */}
      <div className="absolute bottom-4 right-4 z-40 flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className="p-2 rounded-lg transition-colors"
          style={{ background: '#1a1612e6', border: '1px solid #3a3020', color: '#8b7355' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <div
          className="px-2 py-1 rounded-lg text-center"
          style={{
            background: '#1a1612e6',
            border: '1px solid #3a3020',
            color: '#666',
            fontSize: '10px',
            fontFamily: "'Space Mono', monospace",
          }}
        >
          {Math.round(scale * 100)}%
        </div>
        <button
          onClick={zoomOut}
          className="p-2 rounded-lg transition-colors"
          style={{ background: '#1a1612e6', border: '1px solid #3a3020', color: '#8b7355' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          onClick={resetView}
          className="p-2 rounded-lg transition-colors"
          style={{ background: '#1a1612e6', border: '1px solid #3a3020', color: '#8b7355' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="2" />
            <text x="12" y="7" textAnchor="middle" fill="currentColor" fontSize="6" fontWeight="bold" stroke="none">
              N
            </text>
          </svg>
        </button>
      </div>

      {/* Legend: bottom-left */}
      <div
        className="absolute bottom-4 left-4 z-30 p-3 rounded-lg"
        style={{ background: '#1a1612e6', border: '1px solid #3a3020' }}
      >
        <h3
          className="text-[10px] tracking-[0.15em] uppercase text-[#8b7355] mb-2"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          Legend
        </h3>
        <div className="space-y-1.5">
          {(Object.keys(MARKER_COLORS) as LocationType[]).map((type) => (
            <div key={type} className="flex items-center gap-2">
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: MARKER_COLORS[type],
                  display: 'inline-block',
                }}
              />
              <span className="text-[11px] text-[#8a8070]">{MARKER_LABELS[type]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Map canvas ─────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* SVG base map image */}
          <div
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: `min(100vw, ${MAP_WIDTH}px)`,
              aspectRatio: `${MAP_WIDTH}/${MAP_HEIGHT}`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/map.svg"
              alt="The Realm"
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                userSelect: 'none',
                pointerEvents: 'none',
                filter: 'brightness(0.85) contrast(1.05)',
              }}
            />

            {/* Overlay SVG for kingdoms + markers */}
            <svg
              className="absolute inset-0"
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              style={{ width: '100%', height: '100%' }}
            >
              {/* Kingdom borders */}
              {showKingdoms &&
                kingdoms.map((k) => (
                  <g key={k.id}>
                    <path d={k.path} fill={k.color} fillOpacity={0.08} stroke={k.color} strokeWidth={2} strokeOpacity={0.35} strokeDasharray="8,4" />
                    {/* Kingdom label — place at rough center using path bounding */}
                  </g>
                ))}

              {/* Location markers */}
              {(Object.keys(locations) as LocationType[]).map((type) =>
                locations[type].map((loc) => {
                  const color = MARKER_COLORS[type];
                  const r = MARKER_SIZES[type];
                  const isHovered = hoveredLocation === loc.id;
                  const isSelected = selectedLocation?.loc.id === loc.id;
                  const active = isHovered || isSelected;

                  return (
                    <g
                      key={loc.id}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredLocation(loc.id)}
                      onMouseLeave={() => setHoveredLocation(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLocation({ loc, type });
                      }}
                    >
                      {/* Pulse ring for capitals */}
                      {type === 'capitals' && (
                        <circle cx={loc.x} cy={loc.y} r={r + 6} fill="none" stroke={color} strokeWidth={1} opacity={0.4}>
                          <animate attributeName="r" values={`${r + 2};${r + 14};${r + 2}`} dur="3s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
                        </circle>
                      )}

                      {/* Glow */}
                      <circle
                        cx={loc.x}
                        cy={loc.y}
                        r={active ? r + 8 : r + 4}
                        fill={color}
                        fillOpacity={active ? 0.15 : 0.06}
                        style={{ transition: 'all 0.2s' }}
                      />

                      {/* Border ring */}
                      <circle
                        cx={loc.x}
                        cy={loc.y}
                        r={r}
                        fill={`${color}30`}
                        stroke={active ? '#ffd700' : color}
                        strokeWidth={active ? 2.5 : 1.5}
                        style={{ transition: 'all 0.2s' }}
                      />

                      {/* Center dot */}
                      <circle cx={loc.x} cy={loc.y} r={r * 0.35} fill={color} />

                      {/* Hover tooltip */}
                      {isHovered && !isSelected && (
                        <g>
                          <rect
                            x={loc.x - 80}
                            y={loc.y - r - 36}
                            width={160}
                            height={26}
                            rx={4}
                            fill="#1a1612"
                            stroke={`${color}60`}
                            strokeWidth={1}
                          />
                          <text
                            x={loc.x}
                            y={loc.y - r - 19}
                            textAnchor="middle"
                            fill="#e6d5ac"
                            fontSize={12}
                            fontFamily="'Cinzel', Georgia, serif"
                            fontWeight={600}
                          >
                            {loc.name}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* ── Lore card overlay ──────────────────────────────── */}
      <AnimatePresence>
        {selectedLocation && (
          <>
            <motion.div
              className="fixed inset-0 z-50 lore-card-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ background: 'rgba(0,0,0,0.6)' }}
              onClick={() => setSelectedLocation(null)}
            />
            <LoreCard
              location={selectedLocation.loc}
              type={selectedLocation.type}
              onClose={() => setSelectedLocation(null)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none">
        <h1
          className="text-2xl md:text-3xl tracking-[0.15em] text-[#e6d5ac]/60"
          style={{ fontFamily: "'Cinzel', Georgia, serif", fontWeight: 700 }}
        >
          THE REALM
        </h1>
        <p
          className="text-[10px] tracking-[0.2em] uppercase text-[#8b7355]/60 mt-1"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          Explore the world of Baseborn
        </p>
      </div>
    </div>
  );
}
