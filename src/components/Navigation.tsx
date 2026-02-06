'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/worlds', label: 'Worlds' },
  { href: '/cinema', label: 'Cinema' },
  { href: '/games', label: 'Games' },
  { href: '/publishing', label: 'Publishing' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'bg-carbon/80 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-20 md:h-24">
            <Link href="/" className="relative z-50">
              <span
                className="text-xl md:text-2xl tracking-[0.3em] uppercase"
                style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
              >
                Tartary
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[13px] tracking-[0.15em] uppercase transition-colors duration-300 link-hover ${
                    pathname === link.href
                      ? 'text-gold'
                      : 'text-mist hover:text-foreground'
                  }`}
                  style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-[6px]"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-6 h-[1px] bg-foreground transition-all duration-500 ${
                  isOpen ? 'rotate-45 translate-y-[3.5px]' : ''
                }`}
              />
              <span
                className={`block w-6 h-[1px] bg-foreground transition-all duration-500 ${
                  isOpen ? '-rotate-45 -translate-y-[3.5px]' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 bg-carbon/98 backdrop-blur-2xl flex items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    className={`text-3xl md:text-4xl tracking-[0.2em] uppercase transition-colors duration-300 ${
                      pathname === link.href
                        ? 'text-gold'
                        : 'text-mist hover:text-foreground'
                    }`}
                    style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
              <span
                className="text-[11px] tracking-[0.15em] uppercase text-ash"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Worlds &middot; Cinema &middot; Games &middot; Publishing
              </span>
              <span
                className="text-[11px] tracking-[0.15em] uppercase text-ash"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                CA &mdash; TN
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
