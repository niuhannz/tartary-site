'use client';

import { useState, useEffect, FormEvent } from 'react';

const SITE_PASSWORD = 'mudflood';
const STORAGE_KEY = 'tartary_auth';

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored === 'true') setAuthenticated(true);
      setChecking(false);
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input === SITE_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setInput('');
    }
  };

  if (checking) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999,
      }} />
    );
  }

  if (authenticated) return <>{children}</>;

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
        {/* Logo */}
        <h1 style={{
          fontSize: '2rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#e8e4dc',
          fontWeight: 700,
          marginBottom: '8px',
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
      </div>
    </div>
  );
}
