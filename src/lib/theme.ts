/* ── Tartary Design System — Pillar Data ─────────────────── */

export interface SubProduct {
  label: string;
  href: string;
  description?: string;
}

export interface Pillar {
  index: string;        // "01" – "04"
  label: string;        // e.g. "WORLD"
  cmdPrefix: string;    // e.g. "wld"
  href: string;
  subProducts: SubProduct[];
}

export const pillars: Pillar[] = [
  {
    index: "01",
    label: "WORLD",
    cmdPrefix: "wld",
    href: "/world",
    subProducts: [
      { label: "Commandment", href: "/world/commandment", description: "Flagship cinematic franchise" },
      { label: "XT111", href: "/world/xt111", description: "Sci-fi thriller IP" },
      { label: "Triune", href: "/world/triune", description: "Mythology epic" },
      { label: "Baseborn", href: "/world/baseborn", description: "Dark fantasy saga" },
      { label: "Heavenfall", href: "/world/heavenfall", description: "Cosmic horror" },
    ],
  },
  {
    index: "02",
    label: "FILMS",
    cmdPrefix: "flm",
    href: "/films",
    subProducts: [
      { label: "Gelatin Silver", href: "/films/gelatin-silver", description: "Film production arm" },
      { label: "Swing Gang", href: "/films/swing-gang", description: "Virtual production unit" },
      { label: "Niji", href: "/films/niji", description: "Animation studio" },
      { label: "Cineschool", href: "/films/cineschool", description: "Film education" },
    ],
  },
  {
    index: "03",
    label: "ARTIFACTS",
    cmdPrefix: "art",
    href: "/artifacts",
    subProducts: [
      { label: "Tartary OS", href: "/artifacts/tartary-os", description: "Cinematic spatial operating system" },
      { label: "Mudflood", href: "/artifacts/mudflood", description: "Game creation engine for Vision Pro" },
      { label: "Readen", href: "/artifacts/readen", description: "Reading platform" },
      { label: "Tartary Publishing", href: "/artifacts/publishing", description: "Books & print" },
    ],
  },
  {
    index: "04",
    label: "LAB",
    cmdPrefix: "lab",
    href: "/lab",
    subProducts: [
      { label: "Lucas", href: "/lab/lucas", description: "Personal AI companion" },
      { label: "Fatestack", href: "/lab/fatestack", description: "Narrative decision engine" },
      { label: "Invisible Friend", href: "/lab/invisible-friend", description: "Ambient intelligence" },
      { label: "Game Studio", href: "/lab/games", description: "Interactive experiences R&D" },
    ],
  },
];
