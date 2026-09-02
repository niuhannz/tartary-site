/* ── Tartary Site Content ─────────────────────────────
   Single source of truth for all page copy.
   Technology, IP Universe, IP & Compliance, About, Home. */

/* ── Home ── */
export const homeContent = {
  eyebrow: "Building Cinematic Universes",
  headline: "We build cinematic universes.",
  subheadline:
    "TARTARY creates original worlds, characters, and stories — and the AI infrastructure that powers their production and operation.",
  primaryCta: "Explore the Universe",
  secondaryCta: "Book a Demo",
  technologySection: {
    title: "Technology",
    subtitle: "Commercial AI tooling for talent, production, and distribution.",
    cta: "Book a Demo",
  },
  universeSection: {
    title: "IP Universe",
    subtitle: "Original, company-owned IP — built to be licensed and co-developed.",
    ctaPrimary: "Explore the Universe",
    ctaSecondary: "Inquire IP Licensing",
    preview: [
      { label: "Worlds", text: "Original universes with deep lore and setting." },
      { label: "Characters", text: "A growing library of original characters." },
      { label: "Stories & Projects", text: "Film and series built inside our universes." },
    ],
  },
  synergy: {
    title: "One engine. One universe.",
    body: "Our technology powers our universe. Every tool we ship is hardened on our own productions; every universe we build is a live proving ground for our stack. And DADA — our likeness authorization platform — also safeguards the faces of every character in the TARTARY IP Universe.",
  },
};

/* ── Technology ── */
export interface Capability {
  title: string;
  description: string;
}

export interface TechProduct {
  slug: string;
  name: string;
  fullName: string;
  tagline: string;
  sub: string;
  painPoints: string[];
  capabilities: Capability[];
  whoFor: string[];
  outcomes: string[];
  compliance: string[];
  pricing: string[];
}

export const techProducts: TechProduct[] = [
  {
    slug: "dada",
    name: "DADA",
    fullName: "DADA — AI Likeness Authorization Platform",
    tagline: "Your likeness is an asset. DADA protects it.",
    sub: "DADA is the authorization layer for AI actor likeness — portrait custody, contract-based licensing, verified access, and provenance you can prove.",
    painPoints: [
      "Actor likeness is being replicated without consent — with no clear chain of authorization.",
      "Negotiating and tracking likeness licenses across productions is manual and fragmented.",
      "Once a model is trained, ownership and usage rights become impossible to audit.",
      "Disputes over \"who authorized what, and for how long\" are costly and slow.",
    ],
    capabilities: [
      { title: "Portrait Asset Custody", description: "Secure vaulting of approved likeness data and materials." },
      { title: "Authorization Contracts", description: "Structured, per-project licensing agreements with clear terms, scope, and territory." },
      { title: "Verified Access", description: "Authenticated use of likeness assets only under valid, active licenses." },
      { title: "Provenance & Traceability", description: "A complete, auditable record of every authorization, usage, and expiration." },
      { title: "Rights Ledger", description: "A single source of truth for talent, agents, and production." },
    ],
    whoFor: [
      "Talent agencies and actor representatives",
      "Production studios and post-production teams",
      "Short-drama producers scaling AI-assisted workflows",
      "Platforms that need licensed, auditable likeness assets",
    ],
    outcomes: [
      "Monetize likeness safely — turn talent into a recurring, licensed revenue stream.",
      "Eliminate unauthorized-use risk — every usage is contract-backed and traceable.",
      "Speed up pre-production — license and clear likeness in days, not weeks.",
      "Build trust with talent — transparent rights and audit-ready records.",
    ],
    compliance: [
      "Contract-first authorization — no usage without an explicit, active license.",
      "End-to-end provenance — every call is logged and traceable to a signed agreement.",
      "Territorial & term controls — licenses enforce scope, duration, and geography.",
      "Dispute-ready evidence — complete authorization trails for legal review.",
      "Privacy-by-design — likeness data is vaulted, access-controlled, and never reused without consent.",
    ],
    pricing: [
      "Platform licensing per production or per seat; volume pricing for agencies and studios.",
      "Transaction fee on executed likeness licenses.",
      "Enterprise SLA and custom integration available on request.",
    ],
  },
  {
    slug: "festival-submission",
    name: "AI Film Festival Submission Tool",
    fullName: "AI Film Festival Submission Tool",
    tagline: "Submit everywhere. Track everything.",
    sub: "A single submission workflow for the world's film festivals — project profiles, auto-filled applications, batch submissions, and deadline intelligence.",
    painPoints: [
      "Festival discovery is scattered; filmmakers miss deadlines and eligibility windows.",
      "Every application demands the same materials re-entered in different formats.",
      "Tracking submissions, fees, and statuses across dozens of festivals is manual chaos.",
      "No single record of a project's festival history for funders and sales agents.",
    ],
    capabilities: [
      { title: "Global Festival Library", description: "Curated, searchable database with eligibility and deadlines." },
      { title: "Project Profile Management", description: "One master profile that drives every application." },
      { title: "Auto-Fill & Batch Submission", description: "Pre-populated forms and multi-festival submission." },
      { title: "Deadline Reminders", description: "Automated alerts for approaching windows." },
      { title: "Submission Analytics", description: "Status, fees, and outcomes in one dashboard." },
    ],
    whoFor: [
      "Directors and independent producers",
      "Short-film and documentary teams",
      "Sales agents and festival strategists",
      "Film schools and national film institutes",
    ],
    outcomes: [
      "Reach more festivals with less effort.",
      "Never miss a deadline or eligibility window again.",
      "Reclaim weeks of administrative work per project.",
      "Build a complete festival record that strengthens your next pitch.",
    ],
    compliance: [
      "You retain full ownership of all submitted materials.",
      "Role-based access for teams and representatives.",
      "Export-ready submission history for funders and co-producers.",
    ],
    pricing: [
      "Free tier for a single project; subscription for teams and volume submission.",
      "Annual licenses for institutes and sales agencies.",
    ],
  },
  {
    slug: "short-drama",
    name: "Short-Drama Platform",
    fullName: "Short-Drama Platform",
    tagline: "Where short-drama finds its audience — and its funding.",
    sub: "A curated marketplace for short-drama distribution and financing: submissions, review, revenue-share ledgers, and channel & investor matching.",
    painPoints: [
      "Quality short-drama lacks a clear path to distribution and monetization.",
      "Revenue share across co-producers, channels, and investors is opaque and disputed.",
      "Discovery and matching between creators, channels, and capital is fragmented.",
    ],
    capabilities: [
      { title: "Submission & Review", description: "Structured intake and editorial quality review." },
      { title: "Revenue-Share Ledger", description: "Transparent, automated accounting of all revenue splits." },
      { title: "Channel & Investor Matching", description: "Curated connections between content, distribution, and funding." },
      { title: "Revenue Dashboard", description: "Real-time performance and payout visibility for every stakeholder." },
    ],
    whoFor: [
      "Short-drama producers and studios",
      "Distribution channels and platforms",
      "Investors seeking short-drama assets",
    ],
    outcomes: [
      "Monetize content across multiple channels.",
      "Trustworthy, dispute-free revenue splits.",
      "Direct access to capital and distribution partners.",
      "Full visibility into performance and payouts.",
    ],
    compliance: [
      "Clear, contractual copyright and revenue-share terms.",
      "Transparent ledgers built for audit.",
      "Rights-clearance guidance before distribution.",
    ],
    pricing: [
      "Commission on facilitated distribution and financing.",
      "Platform fee scaled to deal size.",
    ],
  },
];

export const technologyOverview = {
  eyebrow: "Technology",
  title: "Commercial AI tooling for the film industry.",
  subtitle:
    "Three products, one mission — turn talent, production, and distribution into faster, safer, more profitable workflows.",
  cta: "Book a Demo",
};

/* ── IP Universe ── */
export interface World {
  name: string;
  description: string;
}

export interface Character {
  name: string;
  universe: string;
  role: string;
  oneLine: string;
}

export interface Project {
  title: string;
  universe: string;
  format: string;
  status: string;
  logline: string;
}

export const universeLanding = {
  eyebrow: "IP Universe",
  headline: "Original universes, built to last.",
  sub: "TARTARY develops and owns its worlds, characters, and stories — licensed, co-developed, and extended across film, series, and beyond.",
  ctaPrimary: "Explore the Universe",
  ctaSecondary: "Inquire IP Licensing",
  synergy: "Every universe is a proving ground for our technology — and every character's likeness is protected by DADA.",
  entries: [
    { title: "Worlds", text: "Original universes with deep lore and setting.", href: "/universe/worlds" },
    { title: "Characters", text: "A growing library of original characters.", href: "/universe/characters" },
    { title: "Stories & Projects", text: "Film and series built inside our universes.", href: "/universe/stories" },
    { title: "IP Licensing", text: "License, co-develop, and extend our IP.", href: "/universe/licensing" },
  ],
};

export const worldsContent = {
  eyebrow: "IP Universe — Worlds",
  title: "Worlds",
  sub: "Original universes, each with its own rules, history, and mythology — built as durable foundations for film, series, and transmedia.",
  worlds: [
    {
      name: "HEAVENFALL",
      description:
        "A fallen celestial order wages a hidden war beneath the modern sky — where loyalty, prophecy, and the price of divinity collide.",
    },
    {
      name: "MUDFLOOD",
      description:
        "A buried civilization resurfaces beneath the contemporary world, forcing two epochs to confront what the past left behind.",
    },
  ],
  more: "More worlds are in development.",
  cta: "Inquire IP Licensing",
};

export const charactersContent = {
  eyebrow: "IP Universe — Characters",
  title: "Characters",
  sub: "Original characters built with depth, design, and market-ready visual identity — ready for film, series, and licensing.",
  characters: [
    {
      name: "MIRA VALE",
      universe: "Heavenfall",
      role: "Protagonist",
      oneLine: "A disgraced celestial cartographer who must redraw a broken sky — and answer for what she erased from it.",
    },
    {
      name: "ELIAS KADE",
      universe: "Mudflood",
      role: "Antagonist",
      oneLine: "A collector of buried debts who resurfaces with the city — and intends to collect what the modern world never repaid.",
    },
  ],
  note: "Likeness and rights for every character are managed through DADA.",
  cta: "Inquire IP Licensing",
};

export const projectsContent = {
  eyebrow: "IP Universe — Stories & Projects",
  title: "Stories & Projects",
  sub: "Film and series developed inside our universes — owned, packaged, and positioned for production and partnership.",
  projects: [
    {
      title: "BORROWED LIFE",
      universe: "TARTARY IP Universe",
      format: "Feature",
      status: "In development",
      logline: "A man who trades borrowed time must repay what was never his to take.",
    },
  ],
  note: "Projects are company-owned IP assets, not a personal portfolio.",
  cta: "Inquire IP Licensing",
};

export const licensingContent = {
  eyebrow: "IP Universe — IP Licensing",
  title: "IP Licensing",
  sub: "License, co-develop, and extend the TARTARY IP Universe across film, series, games, and merchandise.",
  models: [
    { title: "License", text: "Acquire rights to worlds, characters, and stories for your production." },
    { title: "Co-develop", text: "Partner on original projects inside our universes." },
    { title: "Extend", text: "Adapt our IP into new formats, platforms, and territories." },
  ],
  why: [
    "Company-owned, rights-cleared IP with complete provenance.",
    "Every character's likeness is protected and cleared through DADA.",
    "A technology stack that can accelerate production from script to screen.",
  ],
  cta: "Inquire IP Licensing",
};

/* ── IP & Compliance ── */
export const complianceContent = {
  eyebrow: "IP & Compliance",
  title: "IP & Compliance",
  sub: "How TARTARY protects, structures, and licenses its intellectual property — built for investor and partner diligence.",
  sections: [
    {
      title: "Trademark & Brand Protection",
      body: "TARTARY and its product marks are registered trademarks. Our brand architecture is centrally managed to protect the identity of the company and its universes.",
    },
    {
      title: "Software Copyright",
      body: "Our technology products are protected by software copyright registrations across our core platforms, safeguarding the proprietary systems that power our business.",
    },
    {
      title: "Contractual & Legal Framework",
      body: "We operate on a proprietary suite of licensing and authorization contracts — covering likeness, IP licensing, and revenue-share — reviewed and maintained to support commercial deployment across markets.",
    },
    {
      title: "Multi-Jurisdiction Compliance",
      body: "Our products are designed with a multi-jurisdiction compliance framework, addressing data protection, right-of-publicity, and content licensing requirements across the regions we serve.",
    },
    {
      title: "Diligence Access",
      body: "Detailed IP schedules and compliance documentation are available to investors and commercial partners under NDA.",
    },
  ],
  cta: "Request Diligence Materials",
};

/* ── About / Team / Book Demo ── */
export const aboutContent = {
  eyebrow: "About",
  title: "About",
  sub: "TARTARY builds original cinematic universes — and the AI infrastructure to create and operate them.",
  body: [
    "We are a technology and IP company. Our tools power our own universes, and our universes prove our tools.",
    "We develop original worlds, characters, and stories as company-owned, licensable IP — and we build the commercial AI tooling that the film industry uses to produce, protect, and distribute them.",
  ],
};

export const teamContent = {
  eyebrow: "About — Team",
  title: "Team",
  sub: "A team spanning film, technology, and IP — building the infrastructure for the next generation of cinematic storytelling.",
};

export const bookDemoContent = {
  eyebrow: "Book a Demo",
  title: "Book a Demo",
  sub: "See how TARTARY's technology can power your next production — or how our IP can become your next project.",
  fields: [
    "Name",
    "Company",
    "Email",
    "What are you interested in? (Technology / IP Licensing / Other)",
    "Message",
  ],
  submit: "Submit",
};
