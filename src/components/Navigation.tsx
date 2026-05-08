"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { pillars, type Pillar } from "@/lib/theme";

/* ── Helper ── */
function isActive(href: string, pathname: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}

/* ═══════════════════════════════════════════════════════
   PillarLink — desktop nav item with hover dropdown
   ═══════════════════════════════════════════════════════ */
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

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onOpen();
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(onClose, 160);
  };

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* ── Pillar Label ── */}
      <Link
        href={pillar.href}
        className="group flex items-center px-4 py-2 transition-colors duration-200"
      >
        <span
          className="text-[13px] font-semibold tracking-[0.2em] transition-colors duration-200"
          style={{
            fontFamily: "var(--font-logo)",
            color: active ? "var(--color-bone)" : "var(--color-parchment)",
          }}
        >
          {pillar.label}
        </span>
      </Link>

      {/* ── Dropdown Panel ── */}
      <AnimatePresence>
        {isOpen && pillar.subProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 min-w-[220px] z-50"
          >
            <div
              className="p-2 rounded-lg"
              style={{
                background: "var(--color-obsidian-warm)",
                border: "1px solid var(--border)",
              }}
            >
              {pillar.subProducts.map((sp) => (
                <Link
                  key={sp.href}
                  href={sp.href}
                  className="block px-3 py-2 rounded-md transition-colors duration-150 hover:bg-white/5"
                >
                  <span
                    className="block text-xs font-medium"
                    style={{
                      fontFamily: "var(--font-sans)",
                      color: "var(--color-bone)",
                    }}
                  >
                    {sp.label}
                  </span>
                  {sp.description && (
                    <span
                      className="block text-[10px] mt-0.5"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--color-ash)",
                      }}
                    >
                      {sp.description}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Navigation — main header with desktop + mobile
   ═══════════════════════════════════════════════════════ */
export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ── Scroll listener ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ═══ Desktop Header ═══ */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 left-0 right-0 z-50 hidden md:block transition-colors duration-300"
        style={{
          background: scrolled
            ? "rgba(10, 8, 8, 0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--border)"
            : "1px solid transparent",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-8 h-16 flex items-center justify-between">
          {/* ── Left: Wordmark ── */}
          <Link
            href="/"
            className="flex items-center"
          >
            <span
              className="text-lg font-bold tracking-[0.32em]"
              style={{
                fontFamily: "var(--font-logo)",
                color: "var(--color-bone)",
              }}
            >
              TARTARY
            </span>
          </Link>

          {/* ── Center: Pillar Nav ── */}
          <nav className="flex items-center gap-1">
            {pillars.map((pillar) => (
              <PillarLink
                key={pillar.index}
                pillar={pillar}
                active={isActive(pillar.href, pathname)}
                isOpen={openDropdown === pillar.index}
                onOpen={() => setOpenDropdown(pillar.index)}
                onClose={() => setOpenDropdown(null)}
              />
            ))}
          </nav>

          {/* ── Right ── */}
          <div className="flex items-center">
            <Link
              href="/contact"
              className="text-[13px] font-semibold tracking-[0.2em] transition-colors duration-200"
              style={{
                fontFamily: "var(--font-logo)",
                color: "var(--color-parchment)",
              }}
            >
              CONTACT
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ═══ Mobile Header ═══ */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: "rgba(10, 8, 8, 0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="px-5 h-16 flex items-center justify-between">
          <Link href="/">
            <span
              className="text-lg font-bold tracking-[0.32em]"
              style={{
                fontFamily: "var(--font-logo)",
                color: "var(--color-bone)",
              }}
            >
              TARTARY
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={
                mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }
              }
              className="w-5 h-px block"
              style={{ background: "var(--color-parchment)" }}
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-5 h-px block"
              style={{ background: "var(--color-parchment)" }}
            />
            <motion.span
              animate={
                mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }
              }
              className="w-5 h-px block"
              style={{ background: "var(--color-parchment)" }}
            />
          </button>
        </div>
      </motion.header>

      {/* ═══ Mobile Curtain Menu ═══ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-40 md:hidden overflow-y-auto"
            style={{
              background: "var(--color-obsidian)",
            }}
          >
            <div className="pt-24 pb-12 px-6">
              {pillars.map((pillar) => (
                <div key={pillar.index} className="mb-8">
                  {/* Pillar heading */}
                  <Link
                    href={pillar.href}
                    onClick={() => setMobileOpen(false)}
                    className="block mb-3"
                  >
                    <span
                      className="text-2xl font-bold tracking-[0.2em]"
                      style={{
                        fontFamily: "var(--font-logo)",
                        color: isActive(pillar.href, pathname)
                          ? "var(--color-bone)"
                          : "var(--color-parchment)",
                      }}
                    >
                      {pillar.label}
                    </span>
                  </Link>

                  {/* Sub-products */}
                  <div className="pl-8 flex flex-col gap-1">
                    {pillar.subProducts.map((sp) => (
                      <Link
                        key={sp.href}
                        href={sp.href}
                        onClick={() => setMobileOpen(false)}
                        className="py-1.5 transition-colors duration-150"
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.85rem",
                          color: "var(--color-ash)",
                        }}
                      >
                        {sp.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Contact link at bottom */}
              <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="t-label"
                  style={{ color: "var(--color-orange)" }}
                >
                  CONTACT
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
