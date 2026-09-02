"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navItems, bookDemoHref, type NavItem } from "@/lib/theme";

/* ── Helper ── */
function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/* ═══════════════════════════════════════════════════════
   NavLink — desktop nav item (dropdown or plain link)
   ═══════════════════════════════════════════════════════ */
function NavLink({
  item,
  active,
  isOpen,
  onOpen,
  onClose,
}: {
  item: NavItem;
  active: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasChildren = !!item.children?.length;

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
      {/* ── Label ── */}
      <Link
        href={item.href}
        className="group flex items-center px-4 py-2 transition-colors duration-200"
      >
        <span
          className="text-[13px] font-semibold tracking-[0.18em] uppercase transition-colors duration-200"
          style={{
            fontFamily: "var(--font-logo)",
            color: active ? "var(--color-bone)" : "var(--color-parchment)",
          }}
        >
          {item.label}
        </span>
      </Link>

      {/* ── Dropdown Panel ── */}
      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 min-w-[260px] z-50"
          >
            <div
              className="p-2 rounded-lg"
              style={{
                background: "var(--color-obsidian-warm)",
                border: "1px solid var(--border)",
              }}
            >
              {item.children!.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block px-3 py-2 rounded-md transition-colors duration-150 hover:bg-white/5"
                >
                  <span
                    className="block text-[13px] font-medium"
                    style={{
                      fontFamily: "var(--font-sans)",
                      color: "var(--color-bone)",
                    }}
                  >
                    {child.label}
                  </span>
                  {child.description && (
                    <span
                      className="block text-[10px] mt-0.5"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--color-ash)",
                      }}
                    >
                      {child.description}
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
          background: scrolled ? "rgba(10, 8, 8, 0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-8 h-16 flex items-center justify-between">
          {/* ── Left: Wordmark ── */}
          <Link href="/" className="flex items-center">
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

          {/* ── Center: Nav ── */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                item={item}
                active={isActive(item.href, pathname)}
                isOpen={openDropdown === item.id}
                onOpen={() => setOpenDropdown(item.id)}
                onClose={() => setOpenDropdown(null)}
              />
            ))}
          </nav>

          {/* ── Right: Book Demo CTA ── */}
          <div className="flex items-center">
            <Link
              href={bookDemoHref}
              className="px-5 py-2 rounded-full text-[13px] font-semibold tracking-[0.12em] uppercase transition-all duration-200 hover:opacity-90"
              style={{
                fontFamily: "var(--font-logo)",
                background: "var(--color-orange)",
                color: "#0A0808",
              }}
            >
              Book Demo
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
              animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              className="w-5 h-px block"
              style={{ background: "var(--color-parchment)" }}
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-5 h-px block"
              style={{ background: "var(--color-parchment)" }}
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
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
            style={{ background: "var(--color-obsidian)" }}
          >
            <div className="pt-24 pb-12 px-6">
              {navItems.map((item) => (
                <div key={item.id} className="mb-8">
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block mb-3"
                  >
                    <span
                      className="text-2xl font-bold tracking-[0.18em] uppercase"
                      style={{
                        fontFamily: "var(--font-logo)",
                        color: isActive(item.href, pathname)
                          ? "var(--color-bone)"
                          : "var(--color-parchment)",
                      }}
                    >
                      {item.label}
                    </span>
                  </Link>

                  {item.children && item.children.length > 0 && (
                    <div className="pl-8 flex flex-col gap-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="py-1.5 transition-colors duration-150"
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.85rem",
                            color: "var(--color-ash)",
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Book Demo CTA */}
              <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
                <Link
                  href={bookDemoHref}
                  onClick={() => setMobileOpen(false)}
                  className="inline-block px-6 py-3 rounded-full text-sm font-semibold tracking-[0.12em] uppercase"
                  style={{
                    fontFamily: "var(--font-logo)",
                    background: "var(--color-orange)",
                    color: "#0A0808",
                  }}
                >
                  Book Demo
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
