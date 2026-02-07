'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

const SITE_PASSWORD = 'mudflood';
const STORAGE_KEY = 'tartary_auth';

// Routes that bypass the password gate
const PUBLIC_ROUTES = ['/login'];

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, signOut } = useAuth();
  const pathname = usePathname();
  const [passwordAuth, setPasswordAuth] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored === 'true') setPasswordAuth(true);
      setChecking(false);
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input === SITE_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setPasswordAuth(true);
      setError(false);
    } else {
      setError(true);
      setInput('');
    }
  };

  // Still loading
  if (checking || authLoading) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999,
      }}>
        <div
          style={{
            width: 20, height: 20,
            border: '1px solid rgba(201,169,110,0.3)',
            borderTop: '1px solid #c9a96e',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Let public routes through (like /login)
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return <>{children}</>;
  }

  // Authenticated via Supabase OR site password
  if (user || passwordAuth) {
    return <>{children}</>;
  }

  // Gate screen
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: '#0a0a0a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Syne', sans-serif",
    }}>
      {/* Grain overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.035, zIndex: 1,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        backgroundRepeat: 'repeat', backgroundSize: '200px',
      }} />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        {/* Logo with metallic sheen */}
        <h1 className="logo-sheen logo-glow" style={{
          fontSize: '2rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          fontWeight: 700,
          marginBottom: '8px',
          fontFamily: "'Syne', sans-serif",
        }}>
          Tartary
        </h1>

        {/* Separator */}
        <div style={{
          width: '60px', height: '1px', margin: '0 auto 32px',
          background: 'linear-gradient(90deg, transparent, #c9a96e, transparent)',
        }} />

        <p style={{
          fontSize: '11px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#8a8a8a',
          marginBottom: '32px',
          fontFamily: "'Space Mono', monospace",
        }}>
          This site is under development
        </p>

        <form onSubmit={handleSubmit} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
        }}>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            placeholder="Enter password"
            autoFocus
            style={{
              width: '280px',
              padding: '14px 20px',
              background: 'transparent',
              border: `1px solid ${error ? '#c04040' : '#2a2a2a'}`,
              borderRadius: '0',
              color: '#e8e4dc',
              fontSize: '14px',
              letterSpacing: '0.1em',
              fontFamily: "'Space Mono', monospace",
              outline: 'none',
              transition: 'border-color 0.3s',
              textAlign: 'center',
            }}
            onFocus={(e) => {
              if (!error) e.target.style.borderColor = '#c9a96e';
            }}
            onBlur={(e) => {
              if (!error) e.target.style.borderColor = '#2a2a2a';
            }}
          />

          <button type="submit" style={{
            width: '280px',
            padding: '14px 20px',
            background: 'transparent',
            border: '1px solid #c9a96e',
            color: '#c9a96e',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#c9a96e';
              e.currentTarget.style.color = '#0a0a0a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#c9a96e';
            }}
          >
            Enter
          </button>

          {error && (
            <p style={{
              color: '#c04040',
              fontSize: '12px',
              letterSpacing: '0.05em',
              fontFamily: "'Space Mono', monospace",
            }}>
              Incorrect password
            </p>
          )}
        </form>

        {/* Separator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          margin: '28px 0 20px', width: '280px',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <span style={{
            fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#555', fontFamily: "'Space Mono', monospace",
          }}>
            or
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Login link */}
        <Link
          href="/login"
          style={{
            display: 'inline-block',
            width: '280px',
            padding: '14px 20px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#b0b0b0',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            textAlign: 'center',
            textDecoration: 'none',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)';
            e.currentTarget.style.color = '#e8e4dc';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = '#b0b0b0';
          }}
        >
          Sign in with Account
        </Link>
      </div>
    </div>
  );
}
