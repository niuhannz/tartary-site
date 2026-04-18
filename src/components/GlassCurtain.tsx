"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_NAME = "tartary_preview_access";
const COOKIE_DAYS = 30;
const PASSPHRASE = "tartary2026";

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

export default function GlassCurtain() {
  const [visible, setVisible] = useState<boolean | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [dissolving, setDissolving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CURTAIN_ENABLED === "false") {
      setVisible(false);
      return;    }
    const hasAccess = getCookie(COOKIE_NAME) === "granted";
    setVisible(!hasAccess);
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 600);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.toLowerCase().trim() === PASSPHRASE.toLowerCase()) {
      setError(false);
      setDissolving(true);
      setCookie(COOKIE_NAME, "granted", COOKIE_DAYS);
      setTimeout(() => setVisible(false), 1200);
    } else {
      setError(true);
      setInput("");
      setTimeout(() => setError(false), 600);
    }
  };

  if (visible === null || visible === false) return null;
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="glass-curtain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
        >
          {/* Frosted glass background */}
          <motion.div
            className="absolute inset-0"
            animate={
              dissolving
                ? {
                    backdropFilter: "blur(0px)",
                    WebkitBackdropFilter: "blur(0px)",
                    background: "transparent",
                  }
                : {}
            }
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            style={{
              backdropFilter: "blur(60px) saturate(1.2)",
              WebkitBackdropFilter: "blur(60px) saturate(1.2)",
              background: "oklch(0.06 0.015 260 / 0.85)",
            }}
          />
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 50% 40% at 50% 45%, oklch(0.75 0.15 250 / 0.06), transparent 70%)",
            }}
          />

          {/* Content */}
          <motion.div
            animate={
              dissolving
                ? { opacity: 0, scale: 0.95, y: -20 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-10 text-center px-6 max-w-md w-full"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1
                className="text-4xl sm:text-5xl font-bold tracking-tight mb-2 glass-text-glow"
                style={{ fontFamily: "var(--font-display)" }}
              >                TARTARY
              </h1>
              <p
                className="text-sm tracking-widest uppercase mb-12"
                style={{ color: "var(--color-text-muted)" }}
              >
                Preview Access
              </p>
            </motion.div>

            {/* Passphrase form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4"
            >
              <motion.div
                animate={error ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <input
                  ref={inputRef}
                  type="password"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter passphrase"
                  className="w-full px-6 py-4 rounded-2xl text-center text-sm font-medium outline-none transition-all duration-300 placeholder:text-white/20"                  style={{
                    background: "oklch(0.15 0.01 260 / 0.6)",
                    border: error
                      ? "1px solid oklch(0.7 0.2 25 / 0.5)"
                      : "1px solid oklch(1 0 0 / 0.08)",
                    color: "var(--color-text-primary)",
                    backdropFilter: "blur(20px)",
                    boxShadow:
                      "inset 0 1px 0 0 oklch(1 0 0 / 0.04), 0 4px 24px oklch(0 0 0 / 0.2)",
                  }}
                />
              </motion.div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 rounded-2xl text-sm font-semibold transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-cyan))",
                  color: "white",
                  boxShadow: "0 8px 32px oklch(0.75 0.15 250 / 0.25)",
                }}
              >
                Enter
              </motion.button>
            </motion.form>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-8 text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              This site is under active development.
              <br />
              Contact{" "}
              <a
                href="mailto:hello@tartary.com"
                className="underline underline-offset-2 hover:text-white/50 transition-colors"
              >
                hello@tartary.com
              </a>{" "}
              for access.
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}