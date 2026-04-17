'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { pillars, type Pillar } from '@/lib/theme';

// ═══════════════════════════════════════════════════════════════════════════
// TARTARY NAVIGATION — 2026 Refresh
// Warm cinematic, Syne wordmark, pillar dropdowns with sub-products,
// magnetic-ready with data-cursor attributes
// ═══════════════════════════════════════════════════════════════════════════

function isActive(href: string, pathname: string): boolean {
  return pathname === href || pathname.startsWith(href + '/');
}

function PillarLink({
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
  const handleLeave = () => { timeoutRef.current = setTimeout(onClose, 160); };
  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Link
        href={pillar.href}
        data-cursor="hover"
        className="group relative inline-flex items-baseline gap-1.5"
      >
        <span
          className="text-[10px] tabular-nums"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-warm-slate)' }}
        >
          {pillar.idx}
        </span>
        <span
          className={`text-[12px] transition-colors duration-500 ${
            active ? 'text-orange' : 'text-parchment hover:text-bone'
          }`}
          style={{ fontFamily: 'var(--font-logo)', fontWeight: 600, letterSpacing: '0.22em' }}
        >
          {pillar.label}
        </span>
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: 3, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'top center' }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
          >
            <div
              className="min-w-[240px] border hairline rounded"
              style={{ background: 'rgba(10, 8, 8, 0.92)', backdropFilter: 'blur(16px)' }}
            >
              <div className="px-5 pt-4 pb-2">
                <div className="t-micro" style={{ color: 'var(--color-orange)' }}>{pillar.cmdPrefix}</div>
                <div
                  className="text-sm mt-1 text-bone"
                  style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontWeight: 400 }}
                >
                  {pillar.tagline}
                </div>
              </div>
              <div className="h-px hairline border-t" />
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
                      data-cursor="hover"
                      {...(extraProps as Record<string, string>)}
                      className="block px-5 py-2 text-[13px] transition-all duration-300 hover:pl-6"
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 500,
                        color: 'var(--color-parchment)',
                        letterSpacing: '-0.1px',
                      }}
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
  const [time, setTime] = useState('');
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

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      setTime(`${hh}:${mm}`);
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 2.1, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'panel' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1480px] mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-16 md:h-[76px]">
            {/* Wordmark */}
            <Link href="/" data-cursor="hover" className="relative z-50 group">
              <span
                className="text-[19px] md:text-[22px] tracking-[0.32em] uppercase text-bone"
                style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
              >
                TARTARY
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-9">
              {pillars.map((pillar) => (
                <PillarLink
                  key={pillar.id}
                  pillar={pillar}
                  active={isActive(pillar.href, pathname)}
                  isOpen={openDropdown === pillar.id}
                  onOpen={() => setOpenDropdown(pillar.id)}
                  onClose={() => setOpenDropdown(null)}
                />
              ))}
            </nav>

            {/* Right cluster */}
            <div className="flex items-center gap-5">
              <div className="hidden md:flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-orange)' }} />
                <span className="t-micro tabular-nums" style={{ color: 'var(--color-parchment)' }}>{time}</span>
                <span className="t-micro">PDT</span>
              </div>

              <Link
                href="/contact"
                data-cursor="hover"
                className="hidden md:inline-block t-micro link-under"
                style={{ color: 'var(--color-orange)' }}
              >
                Contact
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                data-cursor="hover"
                className="lg:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-[5px]"
                aria-label="Toggle menu"
              >
                <span className={`block w-5 h-[1px] bg-bone transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
                <span className={`block w-5 h-[1px] bg-bone transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[3px]' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile curtain menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between px-8 py-20"
            style={{ background: 'var(--color-ink)' }}
          >
            <div />
            <nav className="flex flex-col gap-7">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="t-micro" style={{ color: 'var(--color-orange)' }}>{pillar.idx}</span>
                    <Link
                      href={pillar.href}
                      className={`text-4xl sm:text-5xl transition-colors duration-300 ${
                        isActive(pillar.href, pathname) ? 'text-orange' : 'text-bone'
                      }`}
                      style={{ fontFamily: 'var(--font-logo)', fontWeight: 700, letterSpacing: '0.02em' }}
                    >
                      {pillar.label}
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 pl-8">
                    {pillar.products.map((product) => (
                      <Link
                        key={product.href}
                        href={product.href}
                        className="text-[12px] hover:text-bone transition-colors duration-300"
                        style={{ color: 'var(--color-warm-slate)', fontFamily: 'var(--font-sans)' }}
                      >
                        {product.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ))}
            </nav>

            <div className="flex justify-between items-end">
              <a href="mailto:hello@tartary.com" className="t-label" style={{ color: 'var(--color-orange)' }}>
                hello@tartary.com
              </a>
              <div className="t-micro">CA · TN</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
