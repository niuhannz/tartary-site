'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Waves, Swords, Crown, Scroll,
  ChevronLeft, ChevronRight, X, BookOpen,
  Compass, Flag, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import {
  LOCATIONS_HEAVENFALL,
  LOCATIONS_BASEBORN,
  NAMING_PATTERNS,
  type MapLocation,
  type LocationData
} from '@/data/mapData';

// ============================================================================
// ICON MAPPING
// ============================================================================

const CastleIcon = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 24, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d="M22 20v-9H2v9" /><path d="M2 11V6l4-2v4l4-2v4l4-2v4l4-2v4l4-2v5" /><path d="M10 20v-4h4v4" />
    </svg>
  );
};

const MountainIcon = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 24, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" /><path d="m4.14 15.08 2.6-3.51L8 13l2-2 4.28 5.08" />
    </svg>
  );
};

const SkullIcon = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 24, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" /><path d="M8 20v2h8v-2" /><path d="m12.5 17-.5-1-.5 1h1z" />
      <path d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20" />
    </svg>
  );
};

const StarIcon = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 24, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};

type IconComponent = React.FC<React.SVGProps<SVGSVGElement> & { size?: number }>;

const getIconForType = (type: string): IconComponent => {
  switch (type) {
    case 'capital': return CastleIcon;
    case 'ruins': return SkullIcon;
    case 'river': return Waves as unknown as IconComponent;
    case 'pass': return MountainIcon;
    case 'mountain': return MountainIcon;
    case 'battlefield': return Swords as unknown as IconComponent;
    case 'strategic': return Flag as unknown as IconComponent;
    case 'realm': return Crown as unknown as IconComponent;
    default: return MapPin as unknown as IconComponent;
  }
};

// ============================================================================
// LORE CARD COMPONENT
// ============================================================================

const LoreCard = ({ location, onClose }: { location: MapLocation; onClose: () => void }) => {
  const Icon = getIconForType(location.type);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed z-50 w-80 md:w-96 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <div className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#3a3a3a] rounded-lg shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-gradient-to-t from-[#ff4d00] via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 border border-[#4a4a4a]/30 rounded-lg pointer-events-none" />

        <div className="relative p-4 border-b border-[#3a3a3a] bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a]">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 text-[#666] hover:text-[#ff4d00] transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ff4d00]/20 rounded-lg border border-[#ff4d00]/30">
              <Icon size={24} className="text-[#ff4d00]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#e6d5ac] tracking-wide" style={{ fontFamily: "'Cinzel', 'Georgia', serif" }}>
                {location.name}
              </h3>
              {location.originalName && (
                <p className="text-xs text-[#666] font-mono">{location.originalName}</p>
              )}
            </div>
          </div>

          {location.realm && (
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-[#2a2a2a] rounded text-xs text-[#888]">
              <Crown size={12} />
              <span>{location.realm}</span>
            </div>
          )}
        </div>

        <div className="p-4 space-y-4">
          <p className="text-[#c4b998] text-sm leading-relaxed">{location.description}</p>
          {location.lore && (
            <div className="relative p-3 bg-[#0a0a0a] rounded border-l-2 border-[#ff4d00]/50">
              <Scroll size={14} className="absolute top-3 right-3 text-[#ff4d00]/30" />
              <p className="text-[#888] text-xs italic leading-relaxed pr-6">&ldquo;{location.lore}&rdquo;</p>
            </div>
          )}
        </div>
        <div className="h-1 bg-gradient-to-r from-transparent via-[#ff4d00]/50 to-transparent" />
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAP MARKER COMPONENT
// ============================================================================

const MapMarker = ({ location, onClick, isSelected, scale }: {
  location: MapLocation;
  onClick: (loc: MapLocation) => void;
  isSelected: boolean;
  scale: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = getIconForType(location.type);

  const getMarkerColor = () => {
    switch (location.type) {
      case 'capital': return '#ff4d00';
      case 'ruins': return '#666';
      case 'river': return '#4a90d9';
      case 'pass': return '#8b7355';
      case 'mountain': return '#6b8e23';
      case 'battlefield': return '#dc143c';
      case 'strategic': return '#daa520';
      case 'realm': return location.color || '#888';
      default: return '#888';
    }
  };

  const markerSize = location.type === 'realm' ? 40 : 28;
  const adjustedSize = markerSize / Math.sqrt(scale);

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: `${location.x}%`, top: `${location.y}%`, transform: 'translate(-50%, -50%)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => { e.stopPropagation(); onClick(location); }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className="relative flex items-center justify-center rounded-full border-2 transition-all duration-200"
        style={{
          width: adjustedSize,
          height: adjustedSize,
          backgroundColor: `${getMarkerColor()}20`,
          borderColor: isSelected || isHovered ? '#ff4d00' : getMarkerColor(),
          boxShadow: isSelected || isHovered
            ? `0 0 20px ${getMarkerColor()}60, 0 0 40px ${getMarkerColor()}30`
            : `0 0 10px ${getMarkerColor()}40`
        }}
      >
        <Icon
          size={adjustedSize * 0.5}
          className="transition-colors"
          style={{ color: isSelected || isHovered ? '#ff4d00' : getMarkerColor() }}
        />
        {location.type === 'capital' && (
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: getMarkerColor() }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      <AnimatePresence>
        {isHovered && !isSelected && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-[#1a1a1a] border border-[#3a3a3a] rounded shadow-xl whitespace-nowrap z-40"
            style={{ fontSize: `${12 / Math.sqrt(scale)}px` }}
          >
            <span className="text-[#e6d5ac] font-medium">{location.name}</span>
            {location.realm && (
              <span className="text-[#666] text-xs ml-2">&middot; {location.realm}</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================================================
// RIVER PATH COMPONENT
// ============================================================================

const RiverPath = ({ river, scale }: { river: MapLocation; scale: number }) => {
  if (!river.path) return null;

  const pathD = river.path.map((point, i) =>
    `${i === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`
  ).join(' ');

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`river-${river.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4a90d9" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#4a90d9" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#4a90d9" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path d={pathD} stroke={`url(#river-${river.id})`} strokeWidth={2 / scale} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px #4a90d9)' }} />
    </svg>
  );
};

// ============================================================================
// SIDEBAR LEDGER COMPONENT
// ============================================================================

const SidebarLedger = ({ isOpen, onToggle, currentEra, onSelectLocation, locations }: {
  isOpen: boolean;
  onToggle: () => void;
  currentEra: string;
  onSelectLocation: (loc: MapLocation) => void;
  locations: LocationData;
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const groupedLocations: Record<string, MapLocation[]> = {
    capitals: locations.capitals || [],
    realms: locations.realms || [],
    battlefields: locations.battlefields || [],
    passes: [...(locations.passes || []), ...(locations.strategicPoints || []).filter(s => s.type === 'pass')],
    rivers: locations.rivers || [],
    strategic: (locations.strategicPoints || []).filter(s => s.type !== 'pass'),
    mountains: locations.mountains || []
  };

  const sections = [
    { key: 'capitals', label: 'Capitals', icon: CastleIcon },
    { key: 'realms', label: 'Realms', icon: Crown },
    { key: 'battlefields', label: 'Battlefields', icon: Swords },
    { key: 'passes', label: 'Passes', icon: MountainIcon },
    { key: 'rivers', label: 'Rivers', icon: Waves },
    { key: 'strategic', label: 'Strategic Points', icon: Flag },
    { key: 'mountains', label: 'Mountains', icon: MountainIcon }
  ].filter(s => groupedLocations[s.key]?.length > 0);

  return (
    <>
      <motion.button
        className="absolute left-0 top-1/2 -translate-y-1/2 z-40 p-2 bg-[#1a1a1a] border-r border-t border-b border-[#3a3a3a] rounded-r-lg text-[#888] hover:text-[#ff4d00] transition-colors"
        onClick={onToggle}
        whileHover={{ x: 2 }}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute left-0 top-0 bottom-0 w-80 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border-r border-[#3a3a3a] z-30 overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-[#3a3a3a] bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-[#ff4d00]" />
                <h2 className="text-lg font-bold text-[#e6d5ac] tracking-wide" style={{ fontFamily: "'Cinzel', 'Georgia', serif" }}>
                  The Ledger
                </h2>
              </div>
              <p className="text-xs text-[#666] mt-1">
                {currentEra === 'heavenfall' ? 'Age of the Ancient Fifteen' : 'The War of Ash and Storm'}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3a3a3a #0a0a0a' }}>
              {sections.map(section => {
                const SectionIcon = section.icon;
                return (
                  <div key={section.key} className="border-b border-[#2a2a2a]">
                    <button
                      className="w-full p-3 flex items-center justify-between text-left hover:bg-[#2a2a2a]/50 transition-colors"
                      onClick={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
                    >
                      <div className="flex items-center gap-2">
                        <SectionIcon size={16} className="text-[#ff4d00]" />
                        <span className="text-[#c4b998] text-sm font-medium">{section.label}</span>
                        <span className="text-[#666] text-xs">({groupedLocations[section.key].length})</span>
                      </div>
                      <ChevronRight size={16} className={`text-[#666] transition-transform ${expandedSection === section.key ? 'rotate-90' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {expandedSection === section.key && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          {groupedLocations[section.key].map(location => (
                            <button
                              key={location.id}
                              className="w-full px-4 py-2 pl-8 text-left text-sm text-[#888] hover:text-[#e6d5ac] hover:bg-[#2a2a2a]/30 transition-colors flex items-center gap-2"
                              onClick={() => onSelectLocation(location)}
                            >
                              <MapPin size={12} className="text-[#ff4d00]/50" />
                              <span>{location.name}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              <div className="p-4 border-t border-[#3a3a3a] mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Scroll size={16} className="text-[#ff4d00]" />
                  <h3 className="text-sm font-bold text-[#e6d5ac]" style={{ fontFamily: "'Cinzel', 'Georgia', serif" }}>Naming Patterns</h3>
                </div>
                <div className="space-y-3">
                  {NAMING_PATTERNS.map((pattern, i) => (
                    <div key={i} className="p-2 bg-[#0a0a0a] rounded border-l-2" style={{ borderColor: pattern.color }}>
                      <h4 className="text-xs font-bold text-[#c4b998]">{pattern.tradition}</h4>
                      <p className="text-xs text-[#666] mt-1">{pattern.description}</p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {pattern.examples.map((ex, j) => (
                          <span key={j} className="text-xs px-1.5 py-0.5 bg-[#2a2a2a] rounded text-[#888]">{ex}</span>
                        ))}
                      </div>
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
};

// ============================================================================
// MAIN MAP COMPONENT
// ============================================================================

export default function InteractiveMap() {
  const [currentEra, setCurrentEra] = useState<'heavenfall' | 'baseborn'>('baseborn');
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const mapRef = useRef<HTMLDivElement>(null);

  const currentLocations = currentEra === 'heavenfall' ? LOCATIONS_HEAVENFALL : LOCATIONS_BASEBORN;

  const allLocations: MapLocation[] = [
    ...(currentLocations.capitals || []),
    ...(currentLocations.rivers || []),
    ...(currentLocations.passes || []),
    ...(currentLocations.mountains || []),
    ...(currentLocations.battlefields || []),
    ...(currentLocations.strategicPoints || []),
    ...(currentLocations.realms || [])
  ];

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target === mapRef.current || target.closest('.map-background')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => { setIsDragging(false); }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
    }
  }, [position]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      setPosition({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
    }
  }, [isDragging, dragStart]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(prev * delta, 0.5), 4));
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      map.addEventListener('wheel', handleWheel, { passive: false });
      return () => map.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedLocation(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleZoomIn = () => setScale(prev => Math.min(prev * 1.2, 4));
  const handleZoomOut = () => setScale(prev => Math.max(prev * 0.8, 0.5));
  const handleReset = () => { setScale(1); setPosition({ x: 0, y: 0 }); };

  return (
    <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden select-none" style={{ fontFamily: "'Cinzel', 'Georgia', serif" }}>
      {/* Background noise texture */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px'
      }} />

      {/* Back to Worlds link */}
      <Link href="/worlds" className="absolute top-4 left-4 z-40 flex items-center gap-2 px-3 py-2 bg-[#1a1a1a]/90 backdrop-blur border border-[#3a3a3a] rounded-lg text-[#888] hover:text-[#ff4d00] transition-colors text-sm">
        <ArrowLeft size={16} />
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, letterSpacing: '0.05em', fontSize: '11px', textTransform: 'uppercase' }}>Back to Worlds</span>
      </Link>

      {/* Era Toggle */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center gap-2 p-1 bg-[#1a1a1a]/90 backdrop-blur border border-[#3a3a3a] rounded-lg">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${currentEra === 'heavenfall' ? 'bg-[#ff4d00] text-white shadow-lg shadow-[#ff4d00]/30' : 'text-[#888] hover:text-[#e6d5ac]'}`}
            onClick={() => setCurrentEra('heavenfall')}
          >
            <div className="flex items-center gap-2">
              <StarIcon size={14} />
              <span>Ancient Fifteen</span>
            </div>
          </button>
          <div className="w-px h-6 bg-[#3a3a3a]" />
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${currentEra === 'baseborn' ? 'bg-[#ff4d00] text-white shadow-lg shadow-[#ff4d00]/30' : 'text-[#888] hover:text-[#e6d5ac]'}`}
            onClick={() => setCurrentEra('baseborn')}
          >
            <div className="flex items-center gap-2">
              <Swords size={14} />
              <span>BASEBORN Era</span>
            </div>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <SidebarLedger
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentEra={currentEra}
        onSelectLocation={(loc) => setSelectedLocation(loc)}
        locations={currentLocations}
      />

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 z-40 flex flex-col gap-2">
        <button onClick={handleZoomIn} className="p-2 bg-[#1a1a1a]/90 backdrop-blur border border-[#3a3a3a] rounded-lg text-[#888] hover:text-[#ff4d00] transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
        <div className="px-2 py-1 bg-[#1a1a1a]/90 backdrop-blur border border-[#3a3a3a] rounded-lg text-center">
          <span className="text-xs text-[#666]">{Math.round(scale * 100)}%</span>
        </div>
        <button onClick={handleZoomOut} className="p-2 bg-[#1a1a1a]/90 backdrop-blur border border-[#3a3a3a] rounded-lg text-[#888] hover:text-[#ff4d00] transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
        <button onClick={handleReset} className="p-2 bg-[#1a1a1a]/90 backdrop-blur border border-[#3a3a3a] rounded-lg text-[#888] hover:text-[#ff4d00] transition-colors">
          <Compass size={20} />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-16 right-4 z-30">
        <div className="p-3 bg-[#1a1a1a]/90 backdrop-blur border border-[#3a3a3a] rounded-lg">
          <h3 className="text-xs font-bold text-[#e6d5ac] mb-2">Legend</h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2"><CastleIcon size={12} className="text-[#ff4d00]" /><span className="text-[#888]">Capital</span></div>
            <div className="flex items-center gap-2"><Crown size={12} className="text-[#888]" /><span className="text-[#888]">Realm</span></div>
            <div className="flex items-center gap-2"><Swords size={12} className="text-[#dc143c]" /><span className="text-[#888]">Battlefield</span></div>
            <div className="flex items-center gap-2"><MountainIcon size={12} className="text-[#8b7355]" /><span className="text-[#888]">Pass/Mountain</span></div>
            <div className="flex items-center gap-2"><Waves size={12} className="text-[#4a90d9]" /><span className="text-[#888]">River</span></div>
            <div className="flex items-center gap-2"><Flag size={12} className="text-[#daa520]" /><span className="text-[#888]">Strategic</span></div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
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
          className="absolute inset-0 transition-transform duration-100 map-background"
          style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, transformOrigin: 'center center' }}
        >
          {/* Parchment base */}
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse at 30% 20%, #2a2520 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, #2a2520 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, #1a1a1a 0%, #0d0d0d 100%)`
          }} />

          {/* Grid */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <defs>
              <pattern id="grid" width="10%" height="10%" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#3a3a3a" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Compass Rose */}
          <div className="absolute bottom-8 right-8 opacity-30">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#3a3a3a" strokeWidth="1" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="#3a3a3a" strokeWidth="0.5" />
              <path d="M 50 5 L 55 20 L 50 15 L 45 20 Z" fill="#ff4d00" />
              <path d="M 50 95 L 55 80 L 50 85 L 45 80 Z" fill="#3a3a3a" />
              <path d="M 95 50 L 80 55 L 85 50 L 80 45 Z" fill="#3a3a3a" />
              <path d="M 5 50 L 20 55 L 15 50 L 20 45 Z" fill="#3a3a3a" />
              <text x="50" y="12" textAnchor="middle" fill="#ff4d00" fontSize="8" fontWeight="bold">N</text>
            </svg>
          </div>

          {/* Realm boundaries */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {currentLocations.realms?.map(realm => (
              <ellipse key={realm.id} cx={`${realm.x}%`} cy={`${realm.y}%`} rx="12%" ry="10%" fill={realm.color} fillOpacity="0.1" stroke={realm.color} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="5,5" />
            ))}
          </svg>

          {/* River paths */}
          {currentLocations.rivers?.map(river => (
            <RiverPath key={river.id} river={river} scale={scale} />
          ))}

          {/* Location markers */}
          {allLocations.map(location => (
            <MapMarker key={location.id} location={location} onClick={setSelectedLocation} isSelected={selectedLocation?.id === location.id} scale={scale} />
          ))}

          {/* Era title watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5">
            <h1 className="text-8xl md:text-9xl font-bold tracking-widest text-[#ff4d00] whitespace-nowrap">
              {currentEra === 'heavenfall' ? 'HEAVENFALL' : 'BASEBORN'}
            </h1>
          </div>
        </div>
      </div>

      {/* Lore Card */}
      <AnimatePresence>
        {selectedLocation && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedLocation(null)} />
            <LoreCard location={selectedLocation} onClose={() => setSelectedLocation(null)} />
          </>
        )}
      </AnimatePresence>

      {/* Title */}
      <div className="absolute bottom-4 left-4 z-30 pointer-events-none">
        <h1 className="text-2xl md:text-3xl font-bold text-[#e6d5ac]/80 tracking-wider" style={{ fontFamily: "'Cinzel', 'Georgia', serif" }}>
          THE REALM
        </h1>
        <p className="text-xs text-[#666] tracking-widest">OF HEAVENFALL &amp; BASEBORN</p>
      </div>
    </div>
  );
}
