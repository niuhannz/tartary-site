"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Systems", href: "/systems" },
  { label: "Cinema", href: "/cinema" },
  { label: "Games", href: "/games" },
  { label: "Worlds", href: "/worlds" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop Navigation ── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block"
      >
        <nav className="glass-nav px-2 py-1.5 flex items-center gap-1">
          {/* Logo */}
          <Link
            href="/"
            className="px-4 py-2 font-semibold tracking-wider text-sm"
            style={{ fontFamily: "var(--font-display)" }}
          >
            TARTARY
          </Link>

          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Nav Items */}
          {NAV_ITEMS.filter((item) => item.label !== "Home").map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 rounded-full"
                style={{
                  color: isActive
                    ? "var(--color-text-primary)"
                    : "var(--color-text-secondary)",
                }}
              >                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "oklch(1 0 0 / 0.08)",
                      border: "1px solid oklch(1 0 0 / 0.06)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </motion.header>

      {/* ── Mobile Navigation ── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-4 left-4 right-4 z-50 md:hidden"
      >        <div className="glass-nav px-5 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="font-semibold tracking-wider text-sm"
            style={{ fontFamily: "var(--font-display)" }}
          >
            TARTARY
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              className="w-5 h-px bg-white/70 block"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-5 h-px bg-white/70 block"
            />
            <motion.span
              animate={
                mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }
              }
              className="w-5 h-px bg-white/70 block"
            />
          </button>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="glass-panel mt-2 p-4 flex flex-col gap-1"
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    background:
                      pathname === item.href ? "oklch(1 0 0 / 0.06)" : "transparent",
                    color:
                      pathname === item.href
                        ? "var(--color-text-primary)"
                        : "var(--color-text-secondary)",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}