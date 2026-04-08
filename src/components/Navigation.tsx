'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { pillars, type Pillar } from '@/lib/theme';

// ═══════════════════════════════════════════════════════════════════════════
// TARTARY NAVIGATION — 5-Pillar Command Interface
// ═══════════════════════════════════════════════════════════════════════════

function isActive(pillarHref: string, pathname: string): boolean {
  return pathname === pillarHref || pathname.startsWith(pillarHref + '/');
}

// ── PILLAR DROPDOWN ─────────────────────────────────────────────────────

function PillarDropdown({
  pillar,
  active,
  isOpen,
  onOpen,
  onClose,
}: {
  pillar: Pillar;
  active: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onOpen();
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(onClose, 120);
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link
        href={pillar.href}
        className={`flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase transition-colors duration-[80ms] link-hover ${
          active ? 'text-orange' : 'text-steel hover:text-bone'
        }`}
        style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
      >
        <span className="text-[9px] text-ash opacity-60">{pillar.idx}</span>
        {pillar.label}
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-full left-0 pt-2"
            style={{ minWidth: '240px' }}
          >
            <div className="nav-dropdown relative overflow-hidden">
              {/* Header: command prefix */}
              <div className="px-4 pt-3 pb-2 border-b border-gunmetal">
                <span
                  className="text-[9px] tracking-[0.15em] text-orange/60"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {pillar.cmdPrefix}
                </span>
                <span
                  className="text-[9px] tracking-[0.08em] text-ash ml-1"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {pillar.tagline}
                </span>
              </div>

              <div className="py-1">
                {pillar.products.map((product, idx) => {
                  const Comp = product.external ? 'a' : Link;
                  const extraProps = product.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {};

                  return (
                    <Comp
                      key={product.href}
                      href={product.href}
                      {...(extraProps as Record<string, string>)}
                      className="group/item flex items-center gap-3 px-4 py-2 transition-all duration-[80ms] hover:bg-orange/[0.06]"
                      onClick={onClose}
                    >
                      {/* Index */}
                      <span
                        className="text-[8px] text-ash/40 group-hover/item:text-orange/60 transition-colors duration-[80ms] w-4 shrink-0"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {String(idx).padStart(2, '0')}
                      </span>

                      {/* Orange dot */}
                      <span className="w-[3px] h-[3px] bg-orange/30 group-hover/item:bg-orange transition-colors duration-[80ms] shrink-0" />

                      {/* Label */}
                      <span
                        className="text-[10px] tracking-[0.12em] uppercase text-steel group-hover/item:text-bone transition-colors duration-[80ms] whitespace-nowrap"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {product.name}
                      </span>

                      {product.external && (
                        <svg
                          className="w-2.5 h-2.5 text-ash/30 group-hover/item:text-orange/60 transition-colors duration-[80ms] ml-auto shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                      )}
                    </Comp>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── MAIN NAVIGATION ─────────────────────────────────────────────────────

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-obsidian/90 backdrop-blur-xl border-b border-gunmetal/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-10">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* ── LOGO ───────────────────────────────── */}
            <Link href="/" className="relative z-50 flex items-center gap-3 logo-glow">
              <span
                className="text-xl md:text-2xl tracking-[0.3em] uppercase logo-sheen"
                style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
              >
                Tartary
              </span>
              {/* System status dot */}
              <span className="w-1.5 h-1.5 bg-green rounded-full animate-pulse" />
            </Link>

            {/* ── DESKTOP NAV ────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-8">
              {pillars.map((pillar) => (
                <PillarDropdown
                  key={pillar.id}
                  pillar={pillar}
                  active={isActive(pillar.href, pathname)}
                  isOpen={openDropdown === pillar.id}
                  onOpen={() => setOpenDropdown(pillar.id)}
                  onClose={() => setOpenDropdown(null)}
                />
              ))}
            </nav>

            {/* ── MOBILE TOGGLE ──────────────────────── */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-[5px]"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-5 h-[1.5px] bg-bone transition-all duration-200 ${
                  mobileOpen ? 'rotate-45 translate-y-[3.25px]' : ''
                }`}
              />
              <span
                className={`block w-5 h-[1.5px] bg-bone transition-all duration-200 ${
                  mobileOpen ? '-rotate-45 -translate-y-[3.25px]' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE FULLSCREEN ──────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-obsidian/98 backdrop-blur-xl flex flex-col items-start justify-center px-8 overflow-y-auto"
          >
            <nav className="flex flex-col gap-6 w-full max-w-md py-20">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                >
                  {/* Pillar heading */}
                  <Link
                    href={pillar.href}
                    className="flex items-center gap-3 group"
                  >
                    <span
                      className="text-[10px] text-orange/50"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {pillar.idx}
                    </span>
                    <span
                      className={`text-2xl tracking-[0.1em] uppercase transition-colors duration-[80ms] ${
                        isActive(pillar.href, pathname) ? 'text-orange' : 'text-bone group-hover:text-orange'
                      }`}
                      style={{ fontFamily: 'var(--font-headline)', fontWeight: 900 }}
                    >
                      {pillar.label}
                    </span>
                  </Link>

                  {/* Sub-products */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 ml-8">
                    {pillar.products.map((product) => (
                      <Link
                        key={product.href}
                        href={product.href}
                        className="text-[10px] tracking-[0.1em] uppercase text-ash hover:text-orange transition-colors duration-[80ms]"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {product.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ))}
            </nav>

            {/* Bottom metadata */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="rule mb-4" />
              <div className="flex justify-between items-center">
                <span className="text-[9px] tracking-[0.15em] uppercase text-ash" style={{ fontFamily: 'var(--font-mono)' }}>
                  TARTARY SYSTEMS v2.0
                </span>
                <span className="text-[9px] tracking-[0.15em] uppercase text-ash" style={{ fontFamily: 'var(--font-mono)' }}>
                  BUILT IN-HOUSE
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
