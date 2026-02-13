'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext;

// ─────────────────────────────── NAV DATA ───────────────────────────────
interface SubLink 
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
    label: 'Universe',
    subs: [
      { href: '/worlds/explore', label: 'Explore the Globe' },
      { href: '/worlds#heavenfall', label: 'Heavenfall', accent: '#ff4d00' },
      { href: '/worlds#margin', label: 'Margin', accent: '#d4a574' },
      { href: '/worlds#xt111', label: 'XT111', accent: '#00d4ff' },
      { href: '/worlds#the-unrecorded', label: 'The Unrecorded', accent: '#a0886e' },
      { href: '/characters', label: 'Characters' },
    ],
  },
  {
    href: '/cinema',
    label: 'Cinema',
    subs: [
      { href: '/cinema', label: 'Featured Films' },
      { href: '/cinema#services', label: 'Services' },
      { href: '/cinema#festivals', label: 'Festival Recognition' },
      { href: '/anime', label: 'Anime', accent: '#c9a96e' },
      { href: 'https://niji.app', label: 'NIJI.app', external: true, accent: '#c9a96e' },
    ],
  },
  {
    href: '/games',
    label: 'Games',
    subs: [
      { href: '/games', label: 'Featured Games' },
      { href: '/games#capabilities', label: 'Capabilities' },
      { href: '/systems', label: 'Systems', accent: '#d97706' },
      { href: '/systems#mudflood', label: 'MUDFLOOD', accent: '#d97706' },
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
    href: '/apps',
    label: 'Apps',
    subs: [
      { href: 'https://booken.io', label: 'Booken', external: true, accent: '#c9a96e' },
      { href: 'https://lifos.app', label: 'lifOS', external: true, accent: '#00d4ff' },
      { href: '/apps/lucas', label: 'Lucas', accent: '#ff4d00' },
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
      { href: '/pricing', label: 'Pricing & Membership', accent: '#c9a96e' },
    ],
  },
];

// Collapsed nav groups: map child routes to their parent nav item
const navActiveRoutes: Record<string, string[]> = {
  '/worlds': ['/worlds', '/characters'],
  '/cinema': ['/cinema', '/anime'],
  '/games': ['/games', '/systems'],
  '/shop': ['/shop', '/pricing'],
};

function isNavActive(navHref: string, pathname: string): boolean {
  const routes = navActiveRoutes[navHref];
  if (routes) {
    return routes.some((r) => pathname === r || pathname.startsWith(r + '/'));
  }
  return pathname === navHref || pathname.startsWith(navHref + '/');
}

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
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
            style={{ minWidth: '220px' }}
          >
            <div className="nav-dropdown relative overflow-hidden border border-white/[0.08]">
              {/* Corner brackets — technical drawing style */}
              <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-gold/40" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-gold/40" />
              <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-gold/40" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-gold/40" />

              {/* Header label */}
              <div className="px-4 pt-3 pb-1.5 border-b border-white/[0.06]">
                <span
                  className="text-[8px] tracking-[0.2em] uppercase text-ash/50 nav-dd-label"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  SYS:// {link.label}
                </span>
              </div>

              <div className="py-1.5">
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
                      className="group/item flex items-center gap-2.5 px-4 py-2 transition-all duration-150 hover:bg-white/[0.04] nav-dd-item"
                      onClick={onClose}
                    >
                      {/* Index number */}
                      <span
                        className="text-[8px] tracking-[0.05em] text-ash/30 group-hover/item:text-gold/60 transition-colors duration-150 w-3 shrink-0 nav-dd-idx"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {String(idx).padStart(2, '0')}
                      </span>

                      {/* Accent tick */}
                      <span
                        className="w-[3px] h-[3px] shrink-0 opacity-50 group-hover/item:opacity-100 transition-opacity duration-150"
                        style={{
                          backgroundColor: sub.accent || 'var(--color-gold)',
                          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                        }}
                      />

                      <span
                        className="text-[10px] tracking-[0.14em] uppercase text-mist group-hover/item:text-foreground transition-colors duration-150 whitespace-nowrap nav-dd-text"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {sub.label}
                      </span>

                      {/* External arrow */}
                      {isExternal && (
                        <svg
                          className="w-2.5 h-2.5 text-ash/30 group-hover/item:text-gold/60 transition-colors duration-150 ml-auto shrink-0"
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
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full right-0 pt-3"
            style={{ minWidth: '180px' }}
          >
            <div className="nav-dropdown relative overflow-hidden border border-white/[0.08]">
              {/* Corner brackets */}
              <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-gold/40" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-gold/40" />
              <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-gold/40" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-gold/40" />

              <div className="px-4 pt-3 pb-2 border-b border-white/[0.06]">
                <p
                  className="text-[10px] tracking-[0.1em] text-foreground truncate nav-dd-text"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {displayName}
                </p>
                <p
                  className="text-[8px] tracking-[0.05em] text-ash/50 truncate mt-0.5 nav-dd-label"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {user.email}
                </p>
              </div>
              <div className="py-1.5">
                <button
                  onClick={async () => {
                    await signOut();
                    setOpen(false);
                    router.push('/');
                  }}
                  className="w-full text-left px-4 py-2 text-[10px] tracking-[0.14em] uppercase text-ash hover:text-foreground hover:bg-white/[0.04] transition-all duration-150 nav-dd-text"
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

  const isHome = pathname === '/';
  const lightNav = isHome && !scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'bg-carbon/80 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
        {...(lightNav ? { 'data-light-nav': '' } : {})}
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
                  isActive={isNavActive(link.href, pathname)}
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
                      isNavActive(link.href, pathname)
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
                Universe &middot; Cinema &middot; Games &middot; Apps &middot; Publishing &middot; Shop
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
