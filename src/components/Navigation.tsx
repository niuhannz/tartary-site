'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';

// ─────────────────────────────── NAV DATA ───────────────────────────────
interface SubLink {
  href: string;
  label: string;
  external?: boolean;
  accent?: string;
}

interface NavLink {
  href: string;
  label: string;
  subs?: SubLink[];
}

const navLinks: NavLink[] = [
  {
    href: '/worlds',
    label: 'Worlds',
    subs: [
      { href: '/worlds/explore', label: 'Explore the Globe' },
      { href: '/worlds#heavenfall', label: 'Heavenfall', accent: '#ff4d00' },
      { href: '/worlds#margin', label: 'Margin', accent: '#d4a574' },
      { href: '/worlds#xt111', label: 'XT111', accent: '#00d4ff' },
      { href: '/worlds#the-unrecorded', label: 'The Unrecorded', accent: '#a0886e' },
    ],
  },
  {
    href: '/characters',
    label: 'Characters',
    subs: [
      { href: '/characters', label: 'Full Roster' },
      { href: '/characters#heavenfall', label: 'Heavenfall', accent: '#ff4d00' },
      { href: '/characters#margin', label: 'Margin', accent: '#d4a574' },
      { href: '/characters#xt111', label: 'XT111', accent: '#00d4ff' },
      { href: '/characters#unrecorded', label: 'The Unrecorded', accent: '#a0886e' },
    ],
  },
  {
    href: '/cinema',
    label: 'Cinema',
    subs: [
      { href: '/cinema', label: 'Featured Films' },
      { href: '/cinema#services', label: 'Services' },
      { href: '/cinema#festivals', label: 'Festival Recognition' },
    ],
  },
  {
    href: '/anime',
    label: 'Anime',
    subs: [
      { href: '/anime', label: 'In Development' },
      { href: '/anime#capabilities', label: 'What We Create' },
      { href: 'https://niji.app', label: 'NIJI.app', external: true, accent: '#c9a96e' },
    ],
  },
  {
    href: '/games',
    label: 'Games',
    subs: [
      { href: '/games', label: 'Featured Games' },
      { href: '/games#capabilities', label: 'Capabilities' },
    ],
  },
  {
    href: '/systems',
    label: 'Systems',
    subs: [
      { href: '/systems', label: 'Overview' },
      { href: '/systems#mudflood', label: 'MUDFLOOD', accent: '#d97706' },
      { href: '/systems#capabilities', label: 'Engineering' },
    ],
  },
  {
    href: '/publishing',
    label: 'Publishing',
    subs: [
      { href: '/publishing', label: 'Featured Works' },
      { href: '/publishing#categories', label: 'Categories' },
    ],
  },
  {
    href: '/shop',
    label: 'Shop',
    subs: [
      { href: '/shop', label: 'All Products' },
      { href: '/shop#apparel', label: 'Apparel' },
      { href: '/shop#prints', label: 'Prints' },
      { href: '/shop#collectibles', label: 'Collectibles' },
    ],
  },
  { href: '/contact', label: 'Contact' },
];

// ─────────────────────────────── DROPDOWN ───────────────────────────────
function NavDropdown({
  link,
  isActive,
  isOpen,
  onOpen,
  onClose,
}: {
  link: NavLink;
  isActive: boolean;
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
    timeoutRef.current = setTimeout(onClose, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!link.subs) {
    return (
      <Link
        href={link.href}
        className={`text-[13px] tracking-[0.15em] uppercase transition-colors duration-300 link-hover ${
          isActive ? 'text-gold' : 'text-mist hover:text-foreground'
        }`}
        style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}
      >
        {link.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link
        href={link.href}
        className={`text-[13px] tracking-[0.15em] uppercase transition-colors duration-300 link-hover ${
          isActive ? 'text-gold' : 'text-mist hover:text-foreground'
        }`}
        style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}
      >
        {link.label}
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
            style={{ minWidth: '200px' }}
          >
            <div
              className="rounded-lg overflow-hidden border border-white/[0.06] backdrop-blur-xl"
              style={{ background: 'rgba(10, 10, 10, 0.92)' }}
            >
              {/* Top accent line */}
              <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

              <div className="py-2">
                {link.subs.map((sub, idx) => {
                  const isExternal = sub.external;
                  const Comp = isExternal ? 'a' : Link;
                  const extraProps = isExternal
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {};

                  return (
                    <Comp
                      key={sub.href}
                      href={sub.href}
                      {...(extraProps as Record<string, string>)}
                      className="group/item flex items-center gap-3 px-5 py-2.5 transition-all duration-200 hover:bg-white/[0.04]"
                      onClick={onClose}
                    >
                      {/* Accent dot */}
                      {sub.accent ? (
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0 opacity-60 group-hover/item:opacity-100 transition-opacity duration-200"
                          style={{ backgroundColor: sub.accent }}
                        />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-gold/30 group-hover/item:bg-gold/60 transition-colors duration-200" />
                      )}

                      <span
                        className="text-[11px] tracking-[0.12em] uppercase text-mist group-hover/item:text-foreground transition-colors duration-200 whitespace-nowrap"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {sub.label}
                      </span>

                      {/* External arrow */}
                      {isExternal && (
                        <svg
                          className="w-3 h-3 text-ash/40 group-hover/item:text-gold/70 transition-colors duration-200 ml-auto shrink-0"
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

// ─────────────────────────────── NAVIGATION ───────────────────────────────
// ─────────────────────────────── USER MENU ───────────────────────────────
function UserMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-[11px] tracking-[0.12em] uppercase text-ash hover:text-gold transition-colors duration-300 hidden lg:block"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        Sign in
      </Link>
    );
  }

  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div
      className="relative hidden lg:block"
      onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setOpen(true); }}
      onMouseLeave={() => { timeoutRef.current = setTimeout(() => setOpen(false), 150); }}
    >
      <button
        className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center text-[11px] tracking-wider uppercase text-gold hover:border-gold/60 transition-colors duration-300"
        style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}
      >
        {initial}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full right-0 pt-4"
            style={{ minWidth: '180px' }}
          >
            <div
              className="rounded-lg overflow-hidden border border-white/[0.06] backdrop-blur-xl"
              style={{ background: 'rgba(10, 10, 10, 0.92)' }}
            >
              <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              <div className="px-5 py-3 border-b border-white/[0.04]">
                <p
                  className="text-[11px] tracking-[0.08em] text-foreground truncate"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {displayName}
                </p>
                <p
                  className="text-[10px] text-ash/60 truncate mt-0.5"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {user.email}
                </p>
              </div>
              <div className="py-1">
                <button
                  onClick={async () => {
                    await signOut();
                    setOpen(false);
                    router.push('/');
                  }}
                  className="w-full text-left px-5 py-2.5 text-[11px] tracking-[0.12em] uppercase text-ash hover:text-foreground hover:bg-white/[0.04] transition-all duration-200"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Sign out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────── NAVIGATION ───────────────────────────────
export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
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
            <Link href="/" className="relative z-50 logo-glow">
              <span
                className="text-xl md:text-2xl tracking-[0.3em] uppercase logo-sheen"
                style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
              >
                Tartary
              </span>
            </Link>

            {/* Desktop nav with dropdowns */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <NavDropdown
                  key={link.href}
                  link={link}
                  isActive={pathname === link.href || pathname.startsWith(link.href + '/')}
                  isOpen={openDropdown === link.href}
                  onOpen={() => setOpenDropdown(link.href)}
                  onClose={() => setOpenDropdown(null)}
                />
              ))}
              <div className="w-[1px] h-4 bg-white/[0.08]" />
              <UserMenu />
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

      {/* Mobile fullscreen menu with expandable sections */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 bg-carbon/98 backdrop-blur-2xl flex items-center justify-center overflow-y-auto"
          >
            <nav className="flex flex-col items-center gap-6 py-24">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center"
                >
                  <Link
                    href={link.href}
                    className={`text-2xl md:text-3xl tracking-[0.2em] uppercase transition-colors duration-300 ${
                      pathname === link.href
                        ? 'text-gold'
                        : 'text-mist hover:text-foreground'
                    }`}
                    style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}
                  >
                    {link.label}
                  </Link>

                  {/* Mobile sub-links */}
                  {link.subs && (
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
                      {link.subs.map((sub) => {
                        const isExternal = sub.external;
                        return isExternal ? (
                          <a
                            key={sub.href}
                            href={sub.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] tracking-[0.12em] uppercase text-ash/60 hover:text-gold transition-colors duration-200 flex items-center gap-1"
                            style={{ fontFamily: 'var(--font-mono)' }}
                          >
                            {sub.accent && (
                              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: sub.accent }} />
                            )}
                            {sub.label}
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                            </svg>
                          </a>
                        ) : (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="text-[10px] tracking-[0.12em] uppercase text-ash/60 hover:text-gold transition-colors duration-200 flex items-center gap-1"
                            style={{ fontFamily: 'var(--font-mono)' }}
                          >
                            {sub.accent && (
                              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: sub.accent }} />
                            )}
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              ))}
            </nav>

            <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
              <span
                className="text-[11px] tracking-[0.15em] uppercase text-ash"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Worlds &middot; Characters &middot; Cinema &middot; Games &middot; Systems &middot; Shop
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
