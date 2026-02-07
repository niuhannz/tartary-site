'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import SectionReveal from '@/components/SectionReveal';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut' as const,
    },
  },
} as const;

const cardHoverVariants = {
  rest: {
    y: 0,
    borderColor: 'rgba(201, 169, 110, 0.3)',
    boxShadow: '0 0 0 rgba(201, 169, 110, 0)',
  },
  hover: {
    y: -6,
    borderColor: 'rgba(201, 169, 110, 0.8)',
    boxShadow: '0 0 30px rgba(201, 169, 110, 0.15)',
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  },
} as const;

// Character type
interface Character {
  id: string;
  name: string;
  title: string;
  world: string;
  worldId: string;
  accentColor: string;
  description: string;
  archetype: string;
}

// Characters grouped by world
const characters: Character[] = [
  // HEAVENFALL
  {
    id: 'kael-ashborne',
    name: 'Kael Ashborne',
    title: 'The Ember King',
    world: 'Heavenfall',
    worldId: 'HEAVENFALL',
    accentColor: '#ff4d00',
    description: 'Last of the sacred kings, bound to a throne of ash. His crown burns with the dying light of the Mandate, and every decree costs him a fragment of his soul.',
    archetype: 'Sovereign',
  },
  {
    id: 'lian-jade-veil',
    name: 'Lian of the Jade Veil',
    title: 'Keeper of Luminara',
    world: 'Heavenfall',
    worldId: 'HEAVENFALL',
    accentColor: '#ff4d00',
    description: 'Guardian of the jade spires and keeper of the old rites. She speaks to the wind, reads futures in broken mirrors, and carries the memory of all fifteen kingdoms.',
    archetype: 'Oracle',
  },
  {
    id: 'dren-ironhand',
    name: 'Dren Ironhand',
    title: 'Warden of Steelhaven',
    world: 'Heavenfall',
    worldId: 'HEAVENFALL',
    accentColor: '#ff4d00',
    description: 'A soldier forged in the War of Ash. He defends the last free city with a mechanical arm and an unwavering code\u2014even as the world burns around him.',
    archetype: 'Protector',
  },
  {
    id: 'mira-stormcaller',
    name: 'Mira Stormcaller',
    title: 'Voice of the Unbroken',
    world: 'Heavenfall',
    worldId: 'HEAVENFALL',
    accentColor: '#ff4d00',
    description: 'A rebel priestess who channels the storm itself. Mira rallies the dispossessed, speaking prophecy through thunder and challenging heaven\u2019s silence.',
    archetype: 'Rebel',
  },

  // MARGIN
  {
    id: 'song-jiang',
    name: 'Song Jiang',
    title: 'The Righteous Blade',
    world: 'Margin',
    worldId: 'MARGIN',
    accentColor: '#d4a574',
    description: 'Once a minor clerk, now the reluctant leader of outlaws. Song Jiang walks the razor edge between loyalty to a corrupt empire and justice for the forgotten.',
    archetype: 'Leader',
  },
  {
    id: 'wu-yong',
    name: 'Wu Yong',
    title: 'The Strategist',
    world: 'Margin',
    worldId: 'MARGIN',
    accentColor: '#d4a574',
    description: 'A scholar who traded his brush for a war table. Wu Yong\u2019s mind is his sharpest weapon\u2014three moves ahead, always, with a smile that hides a thousand plans.',
    archetype: 'Tactician',
  },
  {
    id: 'lin-chong',
    name: 'Lin Chong',
    title: 'The Exiled Captain',
    world: 'Margin',
    worldId: 'MARGIN',
    accentColor: '#d4a574',
    description: 'Framed by the powerful, stripped of rank and honour. Lin Chong\u2019s spear arm remembers what his heart tries to forget\u2014that the empire he served never deserved him.',
    archetype: 'Warrior',
  },
  {
    id: 'hu-sanniang',
    name: 'Hu Sanniang',
    title: 'Ten Paces of Steel',
    world: 'Margin',
    worldId: 'MARGIN',
    accentColor: '#d4a574',
    description: 'A dual-sabre fighter whose legend precedes her by miles. Fierce, precise, and loyal to a fault\u2014she kills with elegance and mourns with silence.',
    archetype: 'Warrior',
  },

  // XT111
  {
    id: 'dr-yara-chen',
    name: 'Dr. Yara Chen',
    title: 'Signal Interpreter',
    world: 'XT111',
    worldId: 'XT111',
    accentColor: '#00d4ff',
    description: 'The linguist who first decoded the XT111 transmission. Now she carries the weight of first contact\u2014and the terrifying grammar of a language that reshapes thought.',
    archetype: 'Scholar',
  },
  {
    id: 'cole-mercer',
    name: 'Cole Mercer',
    title: 'SETI Field Commander',
    world: 'XT111',
    worldId: 'XT111',
    accentColor: '#00d4ff',
    description: 'Military pragmatist tasked with securing the signal site. Cole trusts protocols over prophecy, but the signal is changing him\u2014one dream at a time.',
    archetype: 'Soldier',
  },
  {
    id: 'fen-9',
    name: 'FEN-9',
    title: 'Autonomous Research Unit',
    world: 'XT111',
    worldId: 'XT111',
    accentColor: '#00d4ff',
    description: 'An AI construct built to analyze the signal. FEN-9 was never meant to develop preferences. Now it paints, asks questions, and refuses certain orders.',
    archetype: 'Machine',
  },

  // THE UNRECORDED
  {
    id: 'zara-al-kindi',
    name: 'Zara al-Kindi',
    title: 'The Cartographer',
    world: 'The Unrecorded',
    worldId: 'THE_UNRECORDED',
    accentColor: '#a0886e',
    description: 'She maps the places that don\u2019t appear on any official record. Libraries burned, cities buried, histories rewritten\u2014Zara traces the erasure and finds truth in the gaps.',
    archetype: 'Seeker',
  },
  {
    id: 'roman-dusk',
    name: 'Roman Dusk',
    title: 'The Collector',
    world: 'The Unrecorded',
    worldId: 'THE_UNRECORDED',
    accentColor: '#a0886e',
    description: 'An antiquarian who trades in forbidden artefacts. Roman deals in the currency of lost civilisations, and every object in his vault whispers a story someone tried to silence.',
    archetype: 'Antiquarian',
  },
  {
    id: 'the-witness',
    name: 'The Witness',
    title: 'Name Unknown',
    world: 'The Unrecorded',
    worldId: 'THE_UNRECORDED',
    accentColor: '#a0886e',
    description: 'They have been present at every major erasure in recorded history. No one knows their age, their origin, or their purpose. They simply watch, remember, and occasionally intervene.',
    archetype: 'Enigma',
  },
];

// Group by world
const worlds = [
  { id: 'HEAVENFALL', name: 'Heavenfall', subtitle: 'The Realm of the Ancient Fifteen', accentColor: '#ff4d00' },
  { id: 'MARGIN', name: 'Margin', subtitle: 'On the Water\u2019s Margin', accentColor: '#d4a574' },
  { id: 'XT111', name: 'XT111', subtitle: 'Signal Received', accentColor: '#00d4ff' },
  { id: 'THE_UNRECORDED', name: 'The Unrecorded', subtitle: 'What History Forgot', accentColor: '#a0886e' },
];

function CharacterCard({ character }: { character: Character }) {
  return (
    <motion.div
      className="group relative rounded-lg overflow-hidden border border-gold border-opacity-30 transition-all duration-500"
      initial="rest"
      whileHover="hover"
      variants={cardHoverVariants}
    >
      {/* Accent glow on hover */}
      <motion.div
        className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-15 blur-2xl transition-opacity duration-500"
        style={{ background: character.accentColor }}
      />

      <div className="relative p-8 z-10">
        {/* Top row: archetype + world */}
        <div className="flex items-center justify-between mb-5">
          <span
            className="text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 border rounded-full transition-all duration-500"
            style={{
              fontFamily: 'var(--font-mono)',
              borderColor: `${character.accentColor}60`,
              color: character.accentColor,
            }}
          >
            {character.archetype}
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.15em] text-ash"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {character.world}
          </span>
        </div>

        {/* Character portrait placeholder */}
        <div
          className="w-16 h-16 rounded-full mb-5 flex items-center justify-center border transition-all duration-500"
          style={{
            borderColor: `${character.accentColor}40`,
            background: `linear-gradient(135deg, ${character.accentColor}15, transparent)`,
          }}
        >
          <span
            className="text-2xl font-light transition-colors duration-500"
            style={{ fontFamily: 'var(--font-heading)', color: character.accentColor }}
          >
            {character.name.charAt(0)}
          </span>
        </div>

        {/* Name */}
        <h3
          className="text-2xl font-light mb-1 text-foreground group-hover:text-gold-light transition-colors duration-500"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {character.name}
        </h3>

        {/* Title */}
        <p
          className="text-sm italic mb-4"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 300, color: character.accentColor }}
        >
          {character.title}
        </p>

        {/* Description */}
        <p
          className="text-sm text-mist group-hover:text-foreground transition-colors duration-500 leading-relaxed"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
        >
          {character.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function CharactersPage() {
  return (
    <main className="bg-background text-foreground">
      {/* ──────────── PAGE HEADER ──────────── */}
      <PageHeader
        label="Characters"
        title="The Roster"
        description={"The heroes, outlaws, scholars, and enigmas who inhabit the worlds of TARTARY. Each one forged by their world\u2019s fire."}
      />

      {/* ──────────── WORLD SECTIONS ──────────── */}
      {worlds.map((world, worldIdx) => {
        const worldChars = characters.filter((c) => c.worldId === world.id);
        return (
          <section
            key={world.id}
            className={`py-24 sm:py-32 px-4 sm:px-6 lg:px-8 ${worldIdx % 2 === 0 ? 'bg-carbon' : 'bg-charcoal'}`}
          >
            <div className="max-w-7xl mx-auto">
              <SectionReveal delay={0.1}>
                <div className="mb-14">
                  {/* World label */}
                  <div className="flex items-center gap-4 mb-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: world.accentColor }}
                    />
                    <span
                      className="text-[11px] uppercase tracking-[0.3em]"
                      style={{ fontFamily: 'var(--font-mono)', color: world.accentColor }}
                    >
                      {world.name}
                    </span>
                  </div>

                  {/* World subtitle */}
                  <h2
                    className="text-3xl sm:text-4xl font-light text-foreground mb-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {world.subtitle}
                  </h2>
                  <div
                    className="w-16 h-[1px] mt-4"
                    style={{ background: `linear-gradient(to right, ${world.accentColor}, transparent)` }}
                  />
                </div>
              </SectionReveal>

              {/* Character cards grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
                initial="hidden"
                whileInView="visible"
                variants={containerVariants}
                viewport={{ once: true }}
              >
                {worldChars.map((character) => (
                  <motion.div key={character.id} variants={itemVariants}>
                    <CharacterCard character={character} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        );
      })}

      {/* ──────────── CTA ──────────── */}
      <section className="py-32 sm:py-48 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-charcoal to-carbon relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at center, rgba(201, 169, 110, 0.05) 0%, transparent 70%)',
          }}
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' as const }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <SectionReveal delay={0.1}>
            <motion.h2
              className="text-5xl sm:text-6xl lg:text-7xl font-light mb-8 text-foreground leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: true }}
            >
              Explore Their Worlds
            </motion.h2>

            <motion.p
              className="text-lg sm:text-xl text-mist mb-12 max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              viewport={{ once: true }}
            >
              Discover the worlds these characters inhabit. Spin the globe, unfold the map, and trace their journeys.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link
                href="/worlds/explore"
                className="px-10 py-4 border-2 border-gold text-gold hover:bg-gold hover:text-carbon transition-all duration-300 font-light tracking-wider text-lg rounded"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Enter the Globe
              </Link>
              <Link
                href="/worlds"
                className="px-10 py-4 border-2 border-gold border-opacity-40 text-gold hover:border-opacity-100 hover:bg-gold hover:bg-opacity-5 transition-all duration-300 font-light tracking-wider text-lg rounded"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                View All Worlds
              </Link>
            </motion.div>
          </SectionReveal>
        </div>
      </section>
    </main>
  );
}
