// ═══════════════════════════════════════════════════════════════════════════
// TARTARY THEME — Sovereign AI Conglomerate
// Industrial Auteur: 1950s Nuclear-Age smoothness × 2026 terminal logic
// ═══════════════════════════════════════════════════════════════════════════

export const theme = {
  // ── COLOR SYSTEM ──────────────────────────────────────────────────────
  colors: {
    // Primary surface
    obsidian:     '#0A0A0A',   // Primary background — deep black
    obsidianLit:  '#111111',   // Elevated surfaces (cards, dropdowns)
    obsidianMid:  '#1A1A1A',   // Secondary surfaces (sidebars, footers)

    // Safety Orange — the singular accent
    orange:       '#FF6600',   // Primary interactive — buttons, links, active states
    orangeHot:    '#FF8533',   // Hover state — slightly warmed
    orangeDim:    '#CC5200',   // Pressed / muted accent
    orangeGlow:   'rgba(255, 102, 0, 0.15)',  // Glow / ambient light
    orangeTrace:  'rgba(255, 102, 0, 0.06)',  // Faint traces, borders

    // Neutrals — steel to bone
    steel:        '#8A8A8A',   // Secondary text, metadata
    ash:          '#555555',   // Tertiary text, disabled states
    gunmetal:     '#2A2A2A',   // Borders, dividers, rules
    bone:         '#E8E4DC',   // Primary text on dark
    chalk:        '#F5F0E8',   // High-emphasis text (rare)

    // Status / semantic (used sparingly)
    green:        '#00CC66',   // System online, success
    red:          '#FF3333',   // System error, critical
    cyan:         '#00D4FF',   // Data/info highlights
  },

  // ── TYPOGRAPHY ────────────────────────────────────────────────────────
  fonts: {
    mono:     '"IBM Plex Mono", "SF Mono", "Fira Code", monospace',
    headline: '"Inter", "Helvetica Neue", "Arial Black", sans-serif',
    // Inter at 900 weight gives us the heavy industrial sans-serif
    // IBM Plex Mono for all technical data, metadata, nav, buttons
  },

  // ── FONT WEIGHTS ──────────────────────────────────────────────────────
  weights: {
    light:    300,
    regular:  400,
    medium:   500,
    bold:     700,
    black:    900,   // Headlines only — the "industrial" weight
  },

  // ── SPACING (8px grid) ────────────────────────────────────────────────
  space: {
    xs:  '4px',
    sm:  '8px',
    md:  '16px',
    lg:  '24px',
    xl:  '32px',
    xxl: '48px',
    huge: '64px',
    section: '96px',
  },

  // ── MOTION — "Surgical" transitions ───────────────────────────────────
  // Philosophy: Everything snaps. No elastic bouncing. No drama.
  // Target: 100ms perceived latency on all UI interactions.
  motion: {
    instant:   { duration: 0.08, ease: [0.25, 0.1, 0.25, 1] },   // Hover states
    snap:      { duration: 0.12, ease: [0.25, 0.1, 0.25, 1] },   // Button clicks
    slide:     { duration: 0.2,  ease: [0.22, 1, 0.36, 1] },     // Panel reveals
    enter:     { duration: 0.35, ease: [0.22, 1, 0.36, 1] },     // Page/section entrance
    stagger:   0.04,                                                // Between list items
  },

  // ── BORDERS & SURFACES ────────────────────────────────────────────────
  borders: {
    rule:      '1px solid #2A2A2A',         // Standard divider
    subtle:    '1px solid rgba(255,102,0,0.08)', // Faint orange trace
    active:    '1px solid #FF6600',          // Active / focused
    terminal:  '1px solid #333333',          // Terminal-style boxes
  },

  // ── Z-INDEX LAYERS ────────────────────────────────────────────────────
  z: {
    base:      0,
    card:      10,
    nav:       50,
    overlay:   100,
    modal:     200,
    grain:     9999,
  },

  // ── BREAKPOINTS ───────────────────────────────────────────────────────
  breakpoints: {
    sm:  '640px',
    md:  '768px',
    lg:  '1024px',
    xl:  '1280px',
    xxl: '1536px',
  },
} as const;

// ── PILLAR DEFINITIONS ──────────────────────────────────────────────────
// The 5 departments of the Tartary vertical ecosystem
export type PillarId = 'system' | 'studio' | 'universe' | 'press' | 'civilian';

export interface Pillar {
  id: PillarId;
  label: string;
  tagline: string;
  href: string;
  idx: string;        // Terminal-style index: 01, 02, etc.
  cmdPrefix: string;  // e.g., "SYS://", "STU://"
  products: { name: string; href: string; external?: boolean }[];
}

export const pillars: Pillar[] = [
  {
    id: 'system',
    label: 'SYSTEM',
    tagline: 'Tartary OS & AI-First Hardware',
    href: '/system',
    idx: '01',
    cmdPrefix: 'SYS://',
    products: [
      { name: 'Tartary OS', href: '/system' },
      { name: 'OpenClaw Engine', href: '/system#openclaw' },
      { name: 'M4 Metal Layer', href: '/system#metal' },
    ],
  },
  {
    id: 'studio',
    label: 'STUDIO',
    tagline: 'NLE, Cinema Engine, Games, Film Fest',
    href: '/studio',
    idx: '02',
    cmdPrefix: 'STU://',
    products: [
      { name: 'Swinggang NLE', href: '/studio#swinggang' },
      { name: 'Gelatin Silver', href: '/studio#gelatin' },
      { name: 'Tartary Games', href: '/studio#games' },
      { name: 'AI Film Fest', href: '/studio#filmfest' },
    ],
  },
  {
    id: 'universe',
    label: 'UNIVERSE',
    tagline: 'Flagship IP — The Narrative Soul',
    href: '/universe',
    idx: '03',
    cmdPrefix: 'UNI://',
    products: [
      { name: 'Commandment', href: '/universe#commandment' },
      { name: 'XT111', href: '/universe#xt111' },
      { name: 'Triune', href: '/universe#triune' },
    ],
  },
  {
    id: 'press',
    label: 'PRESS',
    tagline: 'Academy, E-Reader, Publishing Bridge',
    href: '/press',
    idx: '04',
    cmdPrefix: 'PRS://',
    products: [
      { name: 'Sunday School Academy', href: '/press#academy' },
      { name: 'ReadRead', href: '/press#readread' },
      { name: 'Publishing Bridge', href: '/press#bridge' },
    ],
  },
  {
    id: 'civilian',
    label: 'CIVILIAN',
    tagline: 'Lifestyle Applications',
    href: '/civilian',
    idx: '05',
    cmdPrefix: 'CIV://',
    products: [
      { name: 'Lucas', href: '/civilian#lucas' },
      { name: 'FaceStack', href: '/civilian#facestack' },
      { name: 'Invisible Friend', href: '/civilian#invisible-friend' },
    ],
  },
];

export default theme;
