'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';

type Mode = 'login' | 'signup' | 'forgot';

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { user, signIn, signUp, loading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error);
        } else {
          router.push('/');
        }
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          setError(error);
        } else {
          setSuccess('Account created! Check your email to confirm, then log in.');
          setMode('login');
          setPassword('');
        }
      } else if (mode === 'forgot') {
        // We'll import supabase directly for password reset
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Password reset link sent. Check your email.');
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div className="w-6 h-6 border border-gold/40 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  const titles: Record<Mode, string> = {
    login: 'Welcome Back',
    signup: 'Create Account',
    forgot: 'Reset Password',
  };

  const subtitles: Record<Mode, string> = {
    login: 'Enter your credentials to continue',
    signup: 'Join the TARTARY universe',
    forgot: 'We\u2019ll send you a reset link',
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24" style={{ background: '#0a0a0a' }}>
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          opacity: 0.035,
          zIndex: 1,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="block text-center mb-10 logo-glow">
          <span
            className="text-2xl tracking-[0.3em] uppercase logo-sheen"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
          >
            Tartary
          </span>
        </Link>

        {/* Card */}
        <div
          className="rounded-xl overflow-hidden border border-white/[0.06] backdrop-blur-xl"
          style={{ background: 'rgba(15, 15, 15, 0.9)' }}
        >
          {/* Gold accent line */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

          <div className="p-8 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
              >
                <h1
                  className="text-2xl md:text-3xl mb-2"
                  style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}
                >
                  {titles[mode]}
                </h1>
                <p
                  className="text-sm text-ash mb-8"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em' }}
                >
                  {subtitles[mode]}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {mode === 'signup' && (
                    <div>
                      <label
                        className="block text-[10px] tracking-[0.15em] uppercase text-ash mb-2"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-3 bg-transparent border border-white/[0.08] text-foreground text-sm tracking-wider outline-none transition-colors duration-300 focus:border-gold/50 placeholder:text-ash/40"
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                      />
                    </div>
                  )}

                  <div>
                    <label
                      className="block text-[10px] tracking-[0.15em] uppercase text-ash mb-2"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(null); }}
                      placeholder="you@example.com"
                      required
                      autoFocus
                      className="w-full px-4 py-3 bg-transparent border border-white/[0.08] text-foreground text-sm tracking-wider outline-none transition-colors duration-300 focus:border-gold/50 placeholder:text-ash/40"
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                    />
                  </div>

                  {mode !== 'forgot' && (
                    <div>
                      <label
                        className="block text-[10px] tracking-[0.15em] uppercase text-ash mb-2"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(null); }}
                        placeholder={mode === 'signup' ? 'Min 6 characters' : '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
                        required
                        minLength={mode === 'signup' ? 6 : undefined}
                        className="w-full px-4 py-3 bg-transparent border border-white/[0.08] text-foreground text-sm tracking-wider outline-none transition-colors duration-300 focus:border-gold/50 placeholder:text-ash/40"
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                      />
                    </div>
                  )}

                  {/* Error / Success */}
                  {error && (
                    <p className="text-[12px] text-red-400" style={{ fontFamily: 'var(--font-mono)' }}>
                      {error}
                    </p>
                  )}
                  {success && (
                    <p className="text-[12px] text-green-400" style={{ fontFamily: 'var(--font-mono)' }}>
                      {success}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 border border-gold text-gold text-[11px] tracking-[0.2em] uppercase transition-all duration-300 hover:bg-gold hover:text-carbon disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                        {mode === 'login' ? 'Signing in...' : mode === 'signup' ? 'Creating...' : 'Sending...'}
                      </span>
                    ) : (
                      mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'
                    )}
                  </button>
                </form>

                {/* Mode switches */}
                <div className="mt-6 flex flex-col items-center gap-3">
                  {mode === 'login' && (
                    <>
                      <button
                        onClick={() => switchMode('forgot')}
                        className="text-[11px] tracking-[0.08em] text-ash hover:text-gold transition-colors duration-300"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        Forgot password?
                      </button>
                      <div className="h-[1px] w-12 bg-white/[0.06]" />
                      <p className="text-[11px] text-ash" style={{ fontFamily: 'var(--font-mono)' }}>
                        No account?{' '}
                        <button
                          onClick={() => switchMode('signup')}
                          className="text-gold hover:text-gold-light transition-colors duration-300"
                        >
                          Create one
                        </button>
                      </p>
                    </>
                  )}
                  {mode === 'signup' && (
                    <p className="text-[11px] text-ash" style={{ fontFamily: 'var(--font-mono)' }}>
                      Already have an account?{' '}
                      <button
                        onClick={() => switchMode('login')}
                        className="text-gold hover:text-gold-light transition-colors duration-300"
                      >
                        Sign in
                      </button>
                    </p>
                  )}
                  {mode === 'forgot' && (
                    <button
                      onClick={() => switchMode('login')}
                      className="text-[11px] tracking-[0.08em] text-ash hover:text-gold transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      &larr; Back to sign in
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Site password fallback hint */}
        <p className="text-center mt-8 text-[10px] text-ash/40" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
          Have a site password?{' '}
          <Link href="/" className="text-gold/50 hover:text-gold transition-colors duration-300">
            Enter here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
