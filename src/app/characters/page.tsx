'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────── TYPES ───────────────────────────────
interface Character {
  id: string;
  name: string;
  title: string;
  world: string;
  worldId: string;
  accentColor: string;
  description: string;
  archetype: string;
  initials: string;
}

// ─────────────────────────────── DATA ───────────────────────────────
const characters: Character[] = [
  // HEAVENFALL
  { id: 'kael-ashborne', name: 'Kael Ashborne', title: 'The Ember King', world: 'Heavenfall', worldId: 'HEAVENFALL', accentColor: '#ff4d00', description: 'Last of the sacred kings, bound to a throne of ash. His crown burns with the dying light of the Mandate, and every decree costs him a fragment of his soul.', archetype: 'Sovereign', initials: 'KA' },
  { id: 'lian-jade-veil', name: 'Lian of the Jade Veil', title: 'Keeper of Luminara', world: 'Heavenfall', worldId: 'HEAVENFALL', accentColor: '#ff4d00', description: 'Guardian of the jade spires and keeper of the old rites. She speaks to the wind, reads futures in broken mirrors, and carries the memory of all fifteen kingdoms.', archetype: 'Oracle', initials: 'LJ' },
  { id: 'dren-ironhand', name: 'Dren Ironhand', title: 'Warden of Steelhaven', world: 'Heavenfall', worldId: 'HEAVENFALL', accentColor: '#ff4d00', description: 'A soldier forged in the War of Ash. He defends the last free city with a mechanical arm and an unwavering code\u2014even as the world burns around him.', archetype: 'Protector', initials: 'DI' },
  { id: 'mira-stormcaller', name: 'Mira Stormcaller', title: 'Voice of the Unbroken', world: 'Heavenfall', worldId: 'HEAVENFALL', accentColor: '#ff4d00', description: 'A rebel priestess who channels the storm itself. Mira rallies the dispossessed, speaking prophecy through thunder and challenging heaven\u2019s silence.', archetype: 'Rebel', initials: 'MS' },
  { id: 'orin-ashwalker', name: 'Orin Ashwalker', title: 'The Hollow Prophet', world: 'Heavenfall', worldId: 'HEAVENFALL', accentColor: '#ff4d00', description: 'A wandering seer who lost his eyes to the Mandate. What he sees now is worse\u2014futures that bleed, kings that crumble, and an ember that refuses to die.', archetype: 'Prophet', initials: 'OA' },
  { id: 'vex-shadowthorn', name: 'Vex Shadowthorn', title: 'Blade of the Thirteenth', world: 'Heavenfall', worldId: 'HEAVENFALL', accentColor: '#ff4d00', description: 'An assassin pledged to the most secretive of the fifteen kingdoms. Vex moves like smoke and strikes like grief\u2014unseen until the damage is done.', archetype: 'Assassin', initials: 'VS' },

  // MARGIN
  { id: 'song-jiang', name: 'Song Jiang', title: 'The Righteous Blade', world: 'Margin', worldId: 'MARGIN', accentColor: '#d4a574', description: 'Once a minor clerk, now the reluctant leader of outlaws. Song Jiang walks the razor edge between loyalty to a corrupt empire and justice for the forgotten.', archetype: 'Leader', initials: 'SJ' },
  { id: 'wu-yong', name: 'Wu Yong', title: 'The Strategist', world: 'Margin', worldId: 'MARGIN', accentColor: '#d4a574', description: 'A scholar who traded his brush for a war table. Wu Yong\u2019s mind is his sharpest weapon\u2014three moves ahead, always, with a smile that hides a thousand plans.', archetype: 'Tactician', initials: 'WY' },
  { id: 'lin-chong', name: 'Lin Chong', title: 'The Exiled Captain', world: 'Margin', worldId: 'MARGIN', accentColor: '#d4a574', description: 'Framed by the powerful, stripped of rank and honour. Lin Chong\u2019s spear arm remembers what his heart tries to forget\u2014that the empire he served never deserved him.', archetype: 'Warrior', initials: 'LC' },
  { id: 'hu-sanniang', name: 'Hu Sanniang', title: 'Ten Paces of Steel', world: 'Margin', worldId: 'MARGIN', accentColor: '#d4a574', description: 'A dual-sabre fighter whose legend precedes her by miles. Fierce, precise, and loyal to a fault\u2014she kills with elegance and mourns with silence.', archetype: 'Warrior', initials: 'HS' },
  { id: 'lu-zhishen', name: 'Lu Zhishen', title: 'The Tattooed Monk', world: 'Margin', worldId: 'MARGIN', accentColor: '#d4a574', description: 'A disgraced monk with fists like temple bells. Lu Zhishen broke his vows, his abbot\u2019s nose, and every chain ever placed on the innocent. He prays through violence.', archetype: 'Monk', initials: 'LZ' },
  { id: 'yan-qing', name: 'Yan Qing', title: 'The Prodigal', world: 'Margin', worldId: 'MARGIN', accentColor: '#d4a574', description: 'Beautiful, lethal, and impossible to pin down. Yan Qing is a wrestler, a spy, and a poet\u2014the only outlaw the court fears and the brothels adore.', archetype: 'Rogue', initials: 'YQ' },

  // XT111
  { id: 'dr-yara-chen', name: 'Dr. Yara Chen', title: 'Signal Interpreter', world: 'XT111', worldId: 'XT111', accentColor: '#00d4ff', description: 'The linguist who first decoded the XT111 transmission. Now she carries the weight of first contact\u2014and the terrifying grammar of a language that reshapes thought.', archetype: 'Scholar', initials: 'YC' },
  { id: 'cole-mercer', name: 'Cole Mercer', title: 'SETI Field Commander', world: 'XT111', worldId: 'XT111', accentColor: '#00d4ff', description: 'Military pragmatist tasked with securing the signal site. Cole trusts protocols over prophecy, but the signal is changing him\u2014one dream at a time.', archetype: 'Soldier', initials: 'CM' },
  { id: 'fen-9', name: 'FEN-9', title: 'Autonomous Research Unit', world: 'XT111', worldId: 'XT111', accentColor: '#00d4ff', description: 'An AI construct built to analyze the signal. FEN-9 was never meant to develop preferences. Now it paints, asks questions, and refuses certain orders.', archetype: 'Machine', initials: 'F9' },
  { id: 'nneka-obi', name: 'Nneka Obi', title: 'Xenobiologist', world: 'XT111', worldId: 'XT111', accentColor: '#00d4ff', description: 'She studies life that shouldn\u2019t exist. Nneka catalogues the biological anomalies appearing near signal hotspots\u2014organisms with no evolutionary history and no earthly DNA.', archetype: 'Scientist', initials: 'NO' },
  { id: 'ghost-protocol', name: 'GHOST', title: 'Signal Echo', world: 'XT111', worldId: 'XT111', accentColor: '#00d4ff', description: 'Not a person. Not quite a program. GHOST is the residual intelligence left in the signal\u2019s wake\u2014a voice without a body, answering questions nobody asked.', archetype: 'Unknown', initials: 'GH' },
  { id: 'aleksei-volkov', name: 'Aleksei Volkov', title: 'Cosmonaut Zero', world: 'XT111', worldId: 'XT111', accentColor: '#00d4ff', description: 'He heard the signal forty years before anyone else, aboard a Soviet station that officially never existed. Aleksei has been waiting, patient and terrified, ever since.', archetype: 'Witness', initials: 'AV' },

  // THE UNRECORDED
  { id: 'zara-al-kindi', name: 'Zara al-Kindi', title: 'The Cartographer', world: 'The Unrecorded', worldId: 'THE_UNRECORDED', accentColor: '#a0886e', description: 'She maps the places that don\u2019t appear on any official record. Libraries burned, cities buried, histories rewritten\u2014Zara traces the erasure and finds truth in the gaps.', archetype: 'Seeker', initials: 'ZK' },
  { id: 'roman-dusk', name: 'Roman Dusk', title: 'The Collector', world: 'The Unrecorded', worldId: 'THE_UNRECORDED', accentColor: '#a0886e', description: 'An antiquarian who trades in forbidden artefacts. Roman deals in the currency of lost civilisations, and every object in his vault whispers a story someone tried to silence.', archetype: 'Antiquarian', initials: 'RD' },
  { id: 'the-witness', name: 'The Witness', title: 'Name Unknown', world: 'The Unrecorded', worldId: 'THE_UNRECORDED', accentColor: '#a0886e', description: 'They have been present at every major erasure in recorded history. No one knows their age, their origin, or their purpose. They simply watch, remember, and occasionally intervene.', archetype: 'Enigma', initials: 'TW' },
  { id: 'esme-labyrinth', name: 'Esm\u00e9 Labyrinth', title: 'The Forger', world: 'The Unrecorded', worldId: 'THE_UNRECORDED', accentColor: '#a0886e', description: 'She creates perfect replicas of destroyed documents. Esm\u00e9\u2019s forgeries have restored histories, toppled regimes, and blurred the line between what was and what should have been.', archetype: 'Artisan', initials: 'EL' },
  { id: 'idris-fall', name: 'Idris Fall', title: 'The Erased', world: 'The Unrecorded', worldId: 'THE_UNRECORDED', accentColor: '#a0886e', description: 'A man who doesn\u2019t exist in any record\u2014not by choice. Idris was systematically removed from history, and he\u2019s spent decades trying to understand who wanted him forgotten and why.', archetype: 'Ghost', initials: 'IF' },
  { id: 'mama-oracle', name: 'Mama Oracle', title: 'Keeper of Oral Histories', world: 'The Unrecorded', worldId: 'THE_UNRECORDED', accentColor: '#a0886e', description: 'She remembers everything the books forgot. Mama Oracle carries centuries of unwritten history in song, proverb, and parable\u2014a living archive that no fire can burn.', archetype: 'Elder', initials: 'MO' },
];

// ─────────────────────────────── FLIP CARD ───────────────────────────────
function FlipCard({ character, isFlipped, onFlip }: { character: Character; isFlipped: boolean; onFlip: () => void }) {
  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: '1200px', aspectRatio: '3 / 4' }}
      onClick={onFlip}
    >
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* ─── FRONT ─── */}
        <div
          className="absolute inset-0 overflow-hidden group"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Background gradient */}
          <div
            className="absolute inset-0 transition-all duration-500"
            style={{
              background: `radial-gradient(ellipse at 50% 80%, ${character.accentColor}12, transparent 70%), linear-gradient(180deg, #111 0%, #0a0a0a 100%)`,
            }}
          />

          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              boxShadow: `inset 0 0 60px ${character.accentColor}15, 0 0 40px ${character.accentColor}10`,
            }}
          />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, ${character.accentColor}08, transparent 60%)`,
            }}
          />

          {/* Character silhouette / initials */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-[120px] sm:text-[100px] md:text-[80px] lg:text-[90px] font-bold opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500 select-none"
              style={{ fontFamily: 'var(--font-heading)', color: character.accentColor }}
            >
              {character.initials}
            </span>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
            <span
              className="text-[9px] uppercase tracking-[0.25em] block mb-1.5 opacity-40 group-hover:opacity-70 transition-opacity duration-500"
              style={{ fontFamily: 'var(--font-mono)', color: character.accentColor }}
            >
              {character.archetype}
            </span>
            <h3
              className="text-base sm:text-lg font-light text-foreground leading-tight group-hover:text-white transition-colors duration-500"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {character.name}
            </h3>
          </div>

          {/* World indicator dot */}
          <div className="absolute top-4 right-4">
            <span
              className="block w-2 h-2 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500"
              style={{ backgroundColor: character.accentColor }}
            />
          </div>
        </div>

        {/* ─── BACK ─── */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${character.accentColor}18 0%, #0a0a0a 40%, #0a0a0a 100%)`,
            }}
          />

          <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between">
            {/* Top */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-[9px] uppercase tracking-[0.25em] px-2 py-0.5 border rounded-full"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    borderColor: `${character.accentColor}50`,
                    color: character.accentColor,
                  }}
                >
                  {character.archetype}
                </span>
                <span
                  className="text-[9px] uppercase tracking-[0.15em] text-ash"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {character.world}
                </span>
              </div>

              <h3
                className="text-xl sm:text-2xl font-light text-foreground mb-1 leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {character.name}
              </h3>
              <p
                className="text-xs italic mb-4"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300, color: character.accentColor }}
              >
                {character.title}
              </p>

              <div
                className="w-8 h-[1px] mb-4"
                style={{ background: `linear-gradient(to right, ${character.accentColor}, transparent)` }}
              />

              <p
                className="text-xs sm:text-sm text-mist leading-relaxed"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              >
                {character.description}
              </p>
            </div>

            {/* Bottom hint */}
            <span
              className="text-[9px] uppercase tracking-[0.2em] text-ash/50 self-center"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              click to close
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────── PAGE ───────────────────────────────
export default function CharactersPage() {
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('ALL');

  const handleFlip = useCallback((id: string) => {
    setFlippedId((prev) => (prev === id ? null : id));
  }, []);

  const worlds = [
    { id: 'ALL', label: 'All', color: '#c9a96e' },
    { id: 'HEAVENFALL', label: 'Heavenfall', color: '#ff4d00' },
    { id: 'MARGIN', label: 'Margin', color: '#d4a574' },
    { id: 'XT111', label: 'XT111', color: '#00d4ff' },
    { id: 'THE_UNRECORDED', label: 'Unrecorded', color: '#a0886e' },
  ];

  const filtered = filter === 'ALL' ? characters : characters.filter((c) => c.worldId === filter);

  return (
    <main className="bg-background text-foreground min-h-screen">
      {/* ──────────── HEADER ──────────── */}
      <div className="pt-28 md:pt-36 pb-6 px-6 md:px-10">
        <div className="max-w-[1800px] mx-auto">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-4"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Characters
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl max-w-3xl leading-[1.05] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Roster
          </motion.h1>

          {/* World filter tabs */}
          <motion.div
            className="flex flex-wrap gap-2 mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            {worlds.map((w) => (
              <button
                key={w.id}
                onClick={() => { setFilter(w.id); setFlippedId(null); }}
                className="text-[10px] uppercase tracking-[0.2em] px-4 py-2 border rounded-full transition-all duration-300"
                style={{
                  fontFamily: 'var(--font-mono)',
                  borderColor: filter === w.id ? w.color : 'rgba(201, 169, 110, 0.25)',
                  color: filter === w.id ? w.color : '#8a8a8a',
                  backgroundColor: filter === w.id ? `${w.color}10` : 'transparent',
                }}
              >
                {w.label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ──────────── MATRIX GRID ──────────── */}
      <div className="px-0 pb-0">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
          }}
          layout
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((character) => (
              <motion.div
                key={character.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                  borderRight: '1px solid rgba(255,255,255,0.06)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <FlipCard
                  character={character}
                  isFlipped={flippedId === character.id}
                  onFlip={() => handleFlip(character.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
