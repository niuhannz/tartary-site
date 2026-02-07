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

// Product type
interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  world?: string;
  accentColor: string;
  gradient: string;
  badge?: string;
}

// Categories
const categories = [
  { id: 'all', label: 'All' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'prints', label: 'Prints' },
  { id: 'collectibles', label: 'Collectibles' },
  { id: 'accessories', label: 'Accessories' },
];

// Products
const products: Product[] = [
  {
    id: 'heavenfall-tee',
    name: 'Ash & Storm Tee',
    category: 'apparel',
    price: '$45',
    description: 'Premium cotton tee featuring the Heavenfall sigil. Screen-printed with water-based inks on heavyweight fabric.',
    world: 'Heavenfall',
    accentColor: '#ff4d00',
    gradient: 'from-orange-950/40 to-red-950/30',
    badge: 'New',
  },
  {
    id: 'margin-hoodie',
    name: 'Water Margin Hoodie',
    category: 'apparel',
    price: '$85',
    description: 'Oversized French terry hoodie with embroidered outlaw emblem. Drop shoulder, kangaroo pocket, brushed interior.',
    world: 'Margin',
    accentColor: '#d4a574',
    gradient: 'from-amber-950/40 to-yellow-950/30',
  },
  {
    id: 'xt111-jacket',
    name: 'Signal Bomber Jacket',
    category: 'apparel',
    price: '$120',
    description: 'Nylon bomber with reflective XT111 signal pattern lining. Ribbed cuffs, two-way zip, inner pocket for the paranoid.',
    world: 'XT111',
    accentColor: '#00d4ff',
    gradient: 'from-cyan-950/40 to-blue-950/30',
    badge: 'Limited',
  },
  {
    id: 'heavenfall-map-print',
    name: 'Heavenfall Map Print',
    category: 'prints',
    price: '$35',
    description: 'Museum-quality gicl\u00e9e print of the Heavenfall world map on archival paper. Available in 18\u00d724 and 24\u00d736.',
    world: 'Heavenfall',
    accentColor: '#ff4d00',
    gradient: 'from-orange-950/30 to-stone-950/30',
  },
  {
    id: 'unrecorded-print',
    name: 'The Hidden Timeline',
    category: 'prints',
    price: '$40',
    description: 'Illustrated timeline of erased civilisations from The Unrecorded. Gold foil on black stock. Signed and numbered, edition of 500.',
    world: 'The Unrecorded',
    accentColor: '#a0886e',
    gradient: 'from-stone-900/40 to-stone-950/30',
    badge: 'Signed',
  },
  {
    id: 'tartary-cap',
    name: 'TARTARY Dad Cap',
    category: 'accessories',
    price: '$30',
    description: 'Unstructured six-panel cap with embroidered TARTARY logotype. Adjustable brass clasp. One size.',
    accentColor: '#c9a96e',
    gradient: 'from-yellow-950/30 to-stone-950/30',
  },
  {
    id: 'kael-figure',
    name: 'Kael Ashborne Figure',
    category: 'collectibles',
    price: '$95',
    description: 'Hand-painted 8" resin figure of the Ember King. Detachable crown of ash. Magnetic display base with world sigil.',
    world: 'Heavenfall',
    accentColor: '#ff4d00',
    gradient: 'from-red-950/40 to-orange-950/30',
    badge: 'Pre-order',
  },
  {
    id: 'fen9-figure',
    name: 'FEN-9 Desktop Companion',
    category: 'collectibles',
    price: '$75',
    description: 'Articulated 6" figure of the autonomous research unit. LED-illuminated visor. USB-powered ambient glow mode.',
    world: 'XT111',
    accentColor: '#00d4ff',
    gradient: 'from-blue-950/40 to-cyan-950/30',
  },
  {
    id: 'margin-scroll',
    name: 'Outlaw Scroll Set',
    category: 'collectibles',
    price: '$55',
    description: 'Set of four silk-printed character scrolls featuring the heroes of Margin. Each scroll 8\u00d730\u201d with tasselled hanging cord.',
    world: 'Margin',
    accentColor: '#d4a574',
    gradient: 'from-amber-950/30 to-stone-950/30',
  },
  {
    id: 'signal-enamel-pins',
    name: 'Signal Pin Collection',
    category: 'accessories',
    price: '$18',
    description: 'Set of three hard enamel pins: XT111 signal glyph, TARTARY logo, and Heavenfall ember. Gold-plated with rubber clutch.',
    accentColor: '#c9a96e',
    gradient: 'from-stone-900/30 to-stone-950/30',
  },
  {
    id: 'tartary-tote',
    name: 'Canvas Field Tote',
    category: 'accessories',
    price: '$28',
    description: 'Heavy 16oz canvas tote with interior zip pocket. Screen-printed TARTARY monogram. Built to carry scripts, maps, and ambition.',
    accentColor: '#c9a96e',
    gradient: 'from-stone-900/20 to-stone-950/20',
  },
  {
    id: 'unrecorded-tee',
    name: 'What History Forgot Tee',
    category: 'apparel',
    price: '$45',
    description: 'Garment-dyed tee with distressed print of The Unrecorded\u2019s sigil. Feels like you\u2019ve owned it for centuries.',
    world: 'The Unrecorded',
    accentColor: '#a0886e',
    gradient: 'from-stone-900/40 to-stone-950/30',
  },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      className="group relative rounded-lg overflow-hidden border border-gold border-opacity-30 transition-all duration-500 flex flex-col"
      initial="rest"
      whileHover="hover"
      variants={cardHoverVariants}
    >
      {/* Product image placeholder */}
      <div className={`relative h-56 sm:h-64 bg-gradient-to-br ${product.gradient} overflow-hidden`}>
        {/* Accent glow */}
        <motion.div
          className="absolute -inset-1 opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500"
          style={{ background: product.accentColor }}
        />

        {/* Central icon placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-full border flex items-center justify-center opacity-40 group-hover:opacity-70 transition-all duration-500 group-hover:scale-110"
            style={{ borderColor: `${product.accentColor}50` }}
          >
            <span
              className="text-3xl font-light"
              style={{ fontFamily: 'var(--font-heading)', color: product.accentColor }}
            >
              {product.name.charAt(0)}
            </span>
          </div>
        </div>

        {/* Badge */}
        {product.badge && (
          <span
            className="absolute top-4 right-4 text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
            style={{
              fontFamily: 'var(--font-mono)',
              backgroundColor: `${product.accentColor}20`,
              color: product.accentColor,
              border: `1px solid ${product.accentColor}40`,
            }}
          >
            {product.badge}
          </span>
        )}

        {/* World label */}
        {product.world && (
          <span
            className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.15em] text-ash"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {product.world}
          </span>
        )}
      </div>

      {/* Product info */}
      <div className="p-6 flex flex-col flex-grow bg-carbon/50">
        {/* Category */}
        <span
          className="text-[10px] uppercase tracking-[0.2em] text-ash mb-3"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {product.category}
        </span>

        {/* Name + price row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3
            className="text-lg font-light text-foreground group-hover:text-gold-light transition-colors duration-500"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {product.name}
          </h3>
          <span
            className="text-lg font-light text-gold shrink-0"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {product.price}
          </span>
        </div>

        {/* Description */}
        <p
          className="text-sm text-mist group-hover:text-foreground transition-colors duration-500 leading-relaxed flex-grow mb-5"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
        >
          {product.description}
        </p>

        {/* CTA button */}
        <button
          className="w-full py-2.5 text-xs uppercase tracking-[0.2em] border rounded transition-all duration-300 hover:bg-opacity-10"
          style={{
            fontFamily: 'var(--font-mono)',
            borderColor: `${product.accentColor}50`,
            color: product.accentColor,
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.backgroundColor = `${product.accentColor}15`;
            (e.target as HTMLElement).style.borderColor = product.accentColor;
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.backgroundColor = 'transparent';
            (e.target as HTMLElement).style.borderColor = `${product.accentColor}50`;
          }}
        >
          Coming Soon
        </button>
      </div>
    </motion.div>
  );
}

export default function ShopPage() {
  return (
    <main className="bg-background text-foreground">
      {/* ──────────── PAGE HEADER ──────────── */}
      <PageHeader
        label="Shop"
        title="Wear the World"
        description="Apparel, prints, collectibles, and artefacts from the worlds of TARTARY. Every piece carries a story."
      />

      {/* ──────────── CATEGORY NAVIGATION ──────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <SectionReveal delay={0.1}>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat, idx) => (
                <span
                  key={cat.id}
                  className={`text-xs uppercase tracking-[0.15em] px-4 py-2 border rounded-full transition-all duration-300 cursor-default ${
                    idx === 0
                      ? 'border-gold text-gold bg-gold/10'
                      : 'border-gold/30 text-mist hover:border-gold/60 hover:text-gold'
                  }`}
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {cat.label}
                </span>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ──────────── PRODUCT GRID ──────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-carbon">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────── NEWSLETTER / CTA ──────────── */}
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
            <motion.span
              className="text-[11px] tracking-[0.3em] uppercase text-gold block mb-6"
              style={{ fontFamily: 'var(--font-mono)' }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Stay in the Loop
            </motion.span>

            <motion.h2
              className="text-5xl sm:text-6xl lg:text-7xl font-light mb-8 text-foreground leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: true }}
            >
              First Access, Limited Drops
            </motion.h2>

            <motion.p
              className="text-lg sm:text-xl text-mist mb-12 max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              viewport={{ once: true }}
            >
              New items drop alongside world reveals and story milestones. Get notified before anyone else.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link
                href="/contact"
                className="px-10 py-4 border-2 border-gold text-gold hover:bg-gold hover:text-carbon transition-all duration-300 font-light tracking-wider text-lg rounded"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Join the List
              </Link>
              <Link
                href="/worlds"
                className="px-10 py-4 border-2 border-gold border-opacity-40 text-gold hover:border-opacity-100 hover:bg-gold hover:bg-opacity-5 transition-all duration-300 font-light tracking-wider text-lg rounded"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Explore Worlds
              </Link>
            </motion.div>
          </SectionReveal>
        </div>
      </section>
    </main>
  );
}
