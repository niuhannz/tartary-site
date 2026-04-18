'use client';

import { Suspense, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

/* ── Inner form (uses useSearchParams, needs Suspense) ── */

function GateForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.ok) {
        const next = searchParams.get('next') || '/';
        router.push(next);
        router.refresh();
      } else {
        setError('Wrong password');
        setPassword('');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError(null);
        }}
        placeholder="Enter password"
        required
        autoFocus
        className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-[14px] tracking-wider outline-none transition-all duration-300 focus:border-accent/40 focus:bg-white/[0.05] placeholder:text-white/20"
        style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}
      />

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[12px] text-red-400/80 text-center"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {error}
        </motion.p>
      )}

      <button
        type="submit"
        disabled={submitting || !password}
        className="w-full py-3.5 rounded-xl border border-white/[0.1] text-white/80 text-[12px] tracking-[0.15em] uppercase transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.15] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
            Verifying...
          </span>
        ) : (
          'Enter'
        )}
      </button>
    </form>
  );
}

/* ── Page shell (provides Suspense boundary) ── */

export default function GatePage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: '#050505' }}
    >
      {/* Subtle radial glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 600px 400px at 50% 45%, rgba(120,80,200,0.06), transparent 70%)',
        }}
      />

      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          zIndex: 1,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <span
            className="text-[22px] tracking-[0.35em] uppercase text-white/90"
            style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
          >
            TARTARY
          </span>
          <div className="mt-3 h-[1px] w-16 mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Gate card */}
        <div
          className="rounded-2xl overflow-hidden border border-white/[0.06] backdrop-blur-2xl"
          style={{ background: 'rgba(12, 12, 14, 0.85)' }}
        >
          {/* Top accent */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

          <div className="p-8">
            <p
              className="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-6 text-center"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}
            >
              Site Access
            </p>

            <Suspense fallback={
              <div className="flex justify-center py-4">
                <div className="w-5 h-5 border border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            }>
              <GateForm />
            </Suspense>
          </div>
        </div>

        {/* Footer */}
        <p
          className="text-center mt-8 text-[10px] text-white/15"
          style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.08em' }}
        >
          This site is under construction
        </p>
      </motion.div>
    </div>
  );
}
