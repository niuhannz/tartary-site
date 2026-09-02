/* ── Tartary Pillar Page Content ─────────────────────────
   Single source of truth for pillar overview + sub-product
   page copy. Consumed by the pillar pages under (studio). */

export interface SubProductContent {
  slug: string;
  label: string;
  description: string;
  tagline: string;
  body: string[];
  status?: string;
}

export interface PillarContent {
  slug: string;
  index: string;
  label: string;
  title: string;
  subtitle: string;
  intro: string;
  subProducts: SubProductContent[];
}

export const pillarContent: PillarContent[] = [
  {
    slug: "world",
    index: "01",
    label: "WORLD",
    title: "Original worlds. Uncompromising stories.",
    subtitle:
      "A constellation of interconnected cinematic worlds — built for spatial cinema, and designed to expand across film, games, and print.",
    intro:
      "Every Tartary project begins with a world — its history, its physics, its people. We build them slowly, in layers, until they can stand on their own.",
    subProducts: [
      {
        slug: "heavenfall",
        label: "Heavenfall",
        description: "The World of Heavenfall",
        tagline: "The sky fell. What remains is ours to build.",
        body: [
          "Heavenfall is the flagship world of the Tartary universe — a post-cataclysm epic set in the ruins of a sky that collapsed. It is the first franchise conceived natively for spatial cinema, where the audience doesn't watch the story unfold: they stand inside it.",
          "Spanning film, interactive experiences, and print, Heavenfall is designed as a single continuous narrative told across mediums.",
        ],
        status: "In development",
      },
      {
        slug: "waters-margin",
        label: "On the Water's Margin",
        description: "The World of On the Water's Margin",
        tagline: "A quiet world at the edge of a drowned map.",
        body: [
          "On the Water's Margin is a contemplative world — part historical fiction, part myth — set along a coastline that keeps forgetting itself. Built with the same worldbuilding rigor as Heavenfall, but tuned for stillness rather than spectacle.",
          "It began as a publishing project and is expanding into illustrated editions and spatial reading experiences.",
        ],
        status: "In development",
      },
    ],
  },
  {
    slug: "films",
    index: "02",
    label: "FILMS",
    title: "Immersive cinema for a new dimension.",
    subtitle:
      "Four divisions, one vision — original spatial films, virtual production, animation, and film education, crafted for Apple Vision Pro.",
    intro:
      "We make films for a medium that is still being invented. Every project doubles as research into what cinematic language becomes when the frame disappears.",
    subProducts: [
      {
        slug: "gelatin-silver",
        label: "Gelatin Silver",
        description: "Film production arm",
        tagline: "The production house for Tartary's original films.",
        body: [
          "Gelatin Silver is Tartary's principal production arm — developing and producing the company's slate of original spatial films, from Heavenfall onward.",
          "The name comes from the darkroom: the print process where latent images become permanent. We approach spatial filmmaking the same way — patiently, chemically, with an obsession for tone.",
        ],
        status: "Active",
      },
      {
        slug: "swing-gang",
        label: "Swing Gang",
        description: "Virtual production unit",
        tagline: "Sets that don't exist, built anyway.",
        body: [
          "Swing Gang is Tartary's virtual production unit — the crew that builds the impossible sets. Real-time engines, volumetric capture, and stagecraft pipelines tuned for headset-native cinematography.",
          "Named after the film crew that redresses sets overnight, Swing Gang rebuilds reality between takes.",
        ],
        status: "Active",
      },
      {
        slug: "niji",
        label: "Niji",
        description: "Animation studio",
        tagline: "Hand-drawn light in a spatial world.",
        body: [
          "Niji is Tartary's animation studio — where hand-drawn traditions meet volumetric space. Niji explores what animation becomes when it no longer has to live on a flat plane.",
          "Niji contributes animated sequences and stand-alone shorts across the Tartary slate.",
        ],
        status: "Active",
      },
      {
        slug: "cineschool",
        label: "Cineschool",
        description: "Film education",
        tagline: "Learn the grammar of spatial cinema.",
        body: [
          "Cineschool is Tartary's education initiative — courses, workshops, and open curriculum for filmmakers entering spatial cinema.",
          "Because the language of this medium is still being written, Cineschool publishes what Tartary learns in production, openly.",
        ],
        status: "In development",
      },
    ],
  },
  {
    slug: "artifacts",
    index: "03",
    label: "ARTIFACTS",
    title: "Tools, engines, and objects with intent.",
    subtitle:
      "The software and physical artifacts of the Tartary universe — a spatial operating system, a game creation engine, a reading platform, and a publishing house.",
    intro:
      "Every tool we build exists because a story needed it. The artifacts are what remain when the films are between takes.",
    subProducts: [
      {
        slug: "tartary-os",
        label: "Tartary OS",
        description: "Cinematic spatial operating system",
        tagline: "An operating system that behaves like a film set.",
        body: [
          "Tartary OS is a cinematic spatial operating system for Apple Vision Pro — a workspace where windows, scenes, and tools behave with the logic of a film set rather than a desktop.",
          "It is both the internal environment Tartary builds on and a product in its own right.",
        ],
        status: "In development",
      },
      {
        slug: "mudflood",
        label: "Mudflood",
        description: "Game creation engine for Vision Pro",
        tagline: "Build worlds while standing inside them.",
        body: [
          "Mudflood is a game creation engine built natively for Vision Pro — an editor where you sculpt, script, and light your world from the inside, at human scale.",
          "It grew out of the tooling built for Tartary's own interactive worlds, and is being hardened for public release.",
        ],
        status: "In development",
      },
      {
        slug: "readen",
        label: "Readen",
        description: "Reading platform",
        tagline: "Reading, with depth.",
        body: [
          "Readen is Tartary's reading platform — a spatial reading environment that gives books volume without turning them into gimmicks. Typography first; atmosphere second; nothing else.",
          "Readen powers the illustrated editions of On the Water's Margin.",
        ],
        status: "In development",
      },
      {
        slug: "publishing",
        label: "Tartary Publishing",
        description: "Books & print",
        tagline: "The printed layer of the universe.",
        body: [
          "Tartary Publishing produces the books, art books, and printed artifacts of the Tartary worlds — bibles, making-of volumes, and standalone stories that hold up on paper.",
          "Print is treated as a first-class medium, not merchandise.",
        ],
        status: "Active",
      },
    ],
  },
  {
    slug: "lab",
    index: "04",
    label: "LAB",
    title: "Intelligence, in service of story.",
    subtitle:
      "The research wing — AI companions, narrative engines, ambient intelligence, and interactive R&D.",
    intro:
      "The Lab builds the intelligent systems behind the Tartary universe. Everything here starts as a question about what story could become.",
    subProducts: [
      {
        slug: "lucas",
        label: "Lucas",
        description: "Personal AI companion",
        tagline: "A companion with taste.",
        body: [
          "Lucas is a personal AI companion — a persistent, opinionated presence that learns your work, your world, and your standards. Not an assistant: a colleague.",
          "Lucas began as Tartary's internal creative companion and is being developed into a product.",
        ],
        status: "In development",
      },
      {
        slug: "fatestack",
        label: "Fatestack",
        description: "Narrative decision engine",
        tagline: "Consequence, kept honestly.",
        body: [
          "Fatestack is a narrative decision engine — a system for tracking choice, consequence, and causality across long-running interactive stories. It remembers what the audience did, and makes the world answer for it.",
          "Fatestack underpins the interactive layers of the Tartary worlds.",
        ],
        status: "In development",
      },
      {
        slug: "invisible-friend",
        label: "Invisible Friend",
        description: "Ambient intelligence",
        tagline: "The intelligence you stop noticing.",
        body: [
          "Invisible Friend is Tartary's ambient intelligence research — systems that live in the periphery of attention, surfacing only when they're genuinely useful.",
          "Its guiding rule: the best interface is often no interface.",
        ],
        status: "Research",
      },
      {
        slug: "games",
        label: "Game Studio",
        description: "Interactive experiences R&D",
        tagline: "Play as a research method.",
        body: [
          "The Game Studio is Tartary's interactive R&D division — prototyping the playable layers of the Tartary worlds and pushing on what Mudflood can express.",
          "Every game Tartary ships is also an experiment in spatial interaction.",
        ],
        status: "Active",
      },
    ],
  },
];

export function getPillar(slug: string): PillarContent | undefined {
  return pillarContent.find((p) => p.slug === slug);
}

export function getSubProduct(
  pillarSlug: string,
  subSlug: string
): SubProductContent | undefined {
  return getPillar(pillarSlug)?.subProducts.find((s) => s.slug === subSlug);
}
