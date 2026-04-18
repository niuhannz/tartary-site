/* ── Tartary Design System — Pillar Data ─────────────────── */

export interface SubProduct {
  label: string;
  href: string;
  description?: string;
}

export interface Pillar {
  index: string;        // "01" – "05"
  label: string;        // e.g. "UNIVERSE"
  cmdPrefix: string;    // e.g. "uni"
  href: string;
  subProducts: SubProduct[];
}

export const pillars: Pillar[] = [
  {
    index: "01",
    label: "SYSTEM",
    cmdPrefix: "sys",
    href: "/systems",
    subProducts: [
      { label: "Tartary OS", href: "/systems", description: "Cinematic spatial operating system" },
      { label: "Mudflood", href: "/systems#mudflood", description: "Game creation engine for Vision Pro" },
    ],
  },
  {
    index: "02",
    label: "UNIVERSE",
    cmdPrefix: "uni",
    href: "/universe",
    subProducts: [
      { label: "Commandment", href: "/universe/commandment", description: "Flagship cinematic franchise" },
      { label: "XT111", href: "/universe/xt111", description: "Sci-fi thriller IP" },
      { label: "Triune", href: "/universe/triune", description: "Mythology epic" },
      { label: "Baseborn", href: "/universe/baseborn", description: "Dark fantasy saga" },
      { label: "Heavenfall", href: "/universe/heavenfall", description: "Cosmic horror" },
    ],
  },
  {
    index: "03",
    label: "STUDIO",
    cmdPrefix: "stu",
    href: "/studio",
    subProducts: [
      { label: "Gelatin Silver", href: "/studio/gelatin-silver", description: "Film production arm" },
      { label: "Swing Gang", href: "/studio/swing-gang", description: "Virtual production unit" },
      { label: "Niji", href: "/studio/niji", description: "Animation studio" },
      { label: "Tartary Game Studio", href: "/studio/games", description: "Interactive experiences" },
    ],
  },
  {
    index: "04",
    label: "PRESS",
    cmdPrefix: "prs",
    href: "/press",
    subProducts: [
      { label: "Tartary Publishing", href: "/press/publishing", description: "Books & print" },
      { label: "Readen", href: "/press/readen", description: "Reading platform" },
      { label: "Cineschool", href: "/press/cineschool", description: "Film education" },
    ],
  },
  {
    index: "05",
    label: "CIVILIAN",
    cmdPrefix: "civ",
    href: "/civilian",
    subProducts: [
      { label: "Lucas", href: "/civilian/lucas", description: "Personal AI companion" },
      { label: "Fatestack", href: "/civilian/fatestack", description: "Narrative decision engine" },
      { label: "Invisible Friend", href: "/civilian/invisible-friend", description: "Ambient intelligence" },
    ],
  },
];
