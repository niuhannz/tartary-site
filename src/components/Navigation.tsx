'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { pillars, type Pillar } from '@/lib/theme';

// ═══════════════════════════════════════════════════════════════════════════
// TARTARY NAVIGATION — Clean, Bold, Fast
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
        className={`text-[14px] tracking-[0.12em] uppercase transition-colors duration-100 ${
          active ? 'text-orange' : 'text-bone/70 hover:text-bone'
        }`}
        style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
      >
        {pillar.label}
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 3 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
            style={{ minWidth: '200px' }}
          >
            <div className="bg-obsidian-lit border border-gunmetal/60 rounded-sm overflow-hidden">
              <div className="py-2">
                {pillar.products.map((product) => {
                  const Comp = product.external ? 'a' : Link;
                  const extraProps = product.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {};

                  return (
                    <Comp
                      key={product.href}
                      href={product.href}
                      {...(extraProps as Record<string, string>)}
                      className="block px-5 py-2.5 text-[13px] tracking-[0.04em] text-bone/60 hover:text-orange hover:bg-white/[0.03] transition-all duration-100"
                      style={{ fontFamily: 'var(--font-logo)', fontWeight: 500 }}
                      onClick={onClose}
                    >
                      {product.name}
                      {product.external && (
                        <span className="text-[10px] text-bone/30 ml-2">&nearr;</span>
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
            ? 'bg-obsidian/90 backdrop-blur-xl border-b border-white/[0.04]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* ── LOGO ───────────────────────────────── */}
            <Link href="/" className="relative z-50 logo-glow">
              <span
                className="text-xl md:text-2xl tracking-[0.3em] uppercase logo-sheen"
                style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
              >
                Tartary
              </span>
            </Link>

            {/* ── DESKTOP NAV ────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-10">
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
              className="lg:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-[6px]"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-6 h-[1.5px] bg-bone transition-all duration-200 ${
                  mobileOpen ? 'rotate-45 translate-y-[3.75px]' : ''
                }`}
              />
              <span
                className={`block w-6 h-[1.5px] bg-bone transition-all duration-200 ${
                  mobileOpen ? '-rotate-45 -translate-y-[3.75px]' : ''
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
            className="fixed inset-0 z-40 bg-obsidian/98 backdrop-blur-xl flex flex-col justify-center px-8 overflow-y-auto"
          >
            <nav className="flex flex-col gap-8 w-full max-w-md py-24">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                >
                  <Link
                    href={pillar.href}
                    className={`block text-3xl md:text-4xl tracking-[0.08em] uppercase transition-colors duration-100 ${
                      isActive(pillar.href, pathname) ? 'text-orange' : 'text-bone hover:text-orange'
                    }`}
                    style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
                  >
                    {pillar.label}
                  </Link>

                  <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2">
                    {pillar.products.map((product) => (
                      <Link
                        key={product.href}
                        href={product.href}
                        className="text-[13px] text-bone/40 hover:text-orange transition-colors duration-100"
                        style={{ fontFamily: 'var(--font-logo)', fontWeight: 500 }}
                      >
                        {product.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
