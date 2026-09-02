/* ── Tartary Design System — Navigation Data ─────────────────── */

export interface NavChild {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem {
  id: string; // unique id for dropdown state
  label: string; // top-level label (rendered uppercase)
  href: string; // top-level href
  children?: NavChild[];
}

export const navItems: NavItem[] = [
  {
    id: "technology",
    label: "Technology",
    href: "/technology",
    children: [
      {
        label: "DADA",
        href: "/technology/dada",
        description: "AI Likeness Authorization Platform",
      },
      {
        label: "AI Film Festival Submission Tool",
        href: "/technology/festival-submission",
        description: "Submit everywhere. Track everything.",
      },
      {
        label: "Short-Drama Platform",
        href: "/technology/short-drama",
        description: "Distribution & financing",
      },
    ],
  },
  {
    id: "universe",
    label: "IP Universe",
    href: "/universe",
    children: [
      { label: "Worlds", href: "/universe/worlds", description: "Original universes" },
      { label: "Characters", href: "/universe/characters", description: "Original character library" },
      { label: "Stories & Projects", href: "/universe/stories", description: "Film & series in development" },
      { label: "IP Licensing", href: "/universe/licensing", description: "License & co-develop" },
    ],
  },
  {
    id: "compliance",
    label: "IP & Compliance",
    href: "/compliance",
  },
  {
    id: "about",
    label: "About",
    href: "/about",
    children: [
      { label: "Team", href: "/about/team", description: "The people behind the worlds" },
    ],
  },
];

export const bookDemoHref = "/book-demo";
