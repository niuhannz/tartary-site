'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { pillars, type Pillar } from '@/lib/theme';

// ═══════════════════════════════════════════════════════════════════════════
// TARTARY NAVIGATION — Runway-style invisible nav
// Transparent, minimal, designed to not compete with content
// ═══════════════════════════════════════════════════════════════════════════

function isActive(href: string, pathname: string): boolean {
  return pathname === href || pathname.startsWith(href + '/');
}

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
  const handleEnter = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); onOpen(); };
  const handleLeave = () => { timeoutRef.current = setTimeout(onClose, 150); };
  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Link
        href={pillar.href}
        className={`text-[14px] transition-colors duration-150 ${
          active ? 'text-white' : 'text-cool-slate hover:text-white'
        }`}
        style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, letterSpacing: '0.35px', textTransform: 'uppercase' as const }}
      >
        {pillar.label}
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 3 }}
            transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
            style={{ minWidth: '200px' }}
          >
            <div className="bg-surface border border-border-dark rounded-lg overflow-hidden">
              <div className="py-1.5">
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
                      className="block px-4 py-2 text-[13px] text-cool-slate hover:text-white hover:bg-white/[0.03] transition-all duration-150"
                      style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, letterSpacing: '-0.16px' }}
                      onClick={onClose}
                    >
                      {product.name}
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

  useEffect(() => { setMobileOpen(false); setOpenDropdown(null); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="relative z-50">
              <span
                className="text-lg md:text-xl tracking-[0.3em] uppercase text-white"
                style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
              >
                Tartary
              </span>
            </Link>

            {/* Desktop nav */}
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

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-[5px]"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-[1px] bg-white transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
              <span className={`block w-5 h-[1px] bg-white transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-[3px]' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/98 backdrop-blur-xl flex flex-col justify-center px-8"
          >
            <nav className="flex flex-col gap-8 max-w-md py-24">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                >
                  <Link
                    href={pillar.href}
                    className={`block text-2xl mb-1.5 transition-colors duration-150 ${
                      isActive(pillar.href, pathname) ? 'text-white' : 'text-cool-slate hover:text-white'
                    }`}
                    style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, letterSpacing: '-0.5px', lineHeight: '1.0' }}
                  >
                    {pillar.label}
                  </Link>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {pillar.products.map((product) => (
                      <Link
                        key={product.href}
                        href={product.href}
                        className="text-[13px] text-mid-slate hover:text-white transition-colors duration-150"
                        style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, letterSpacing: '-0.16px' }}
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
