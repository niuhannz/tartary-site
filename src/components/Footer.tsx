'use client';

import Link from 'next/link';
import { pillars } from '@/lib/theme';

export default function Footer() {
  return (
    <footer className="relative border-t border-gunmetal/50 bg-obsidian">
      {/* Top rule — orange accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange/20 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <span
              className="text-xl tracking-[0.3em] uppercase block mb-4 logo-sheen"
              style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
            >
              Tartary
            </span>
            <p className="text-steel text-[12px] leading-relaxed max-w-xs mb-6" style={{ fontFamily: 'var(--font-mono)' }}>
              A sovereign AI ecosystem spanning original IP, infrastructure, creative tools, publishing, and civilian applications.
            </p>
            <div className="terminal-box inline-block !p-3 !pl-6">
              <span className="text-orange text-[10px]">STATUS:</span>
              <span className="text-green text-[10px] ml-2">ONLINE</span>
              <span className="text-ash text-[10px] ml-4">SOVEREIGN</span>
            </div>
          </div>

          {/* 5 Pillars */}
          <div className="md:col-span-5 md:col-start-6">
            <span
              className="text-[9px] tracking-[0.2em] uppercase text-orange/60 block mb-5"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              DEPARTMENTS
            </span>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {pillars.map((p) => (
                <div key={p.id}>
                  <Link
                    href={p.href}
                    className="text-[11px] tracking-[0.12em] uppercase text-bone hover:text-orange transition-colors duration-[80ms] block mb-1"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
                  >
                    <span className="text-ash/40 mr-2">{p.idx}</span>
                    {p.label}
                  </Link>
                  <p className="text-[9px] text-ash" style={{ fontFamily: 'var(--font-mono)' }}>
                    {p.tagline}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <span
              className="text-[9px] tracking-[0.2em] uppercase text-orange/60 block mb-5"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              CONTACT
            </span>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@tartary.com"
                className="text-steel hover:text-orange transition-colors duration-[80ms] text-[11px] tracking-wide"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                hello@tartary.com
              </a>
              <p className="text-ash text-[11px]" style={{ fontFamily: 'var(--font-mono)' }}>
                Los Angeles, CA
              </p>
              <p className="text-ash text-[11px]" style={{ fontFamily: 'var(--font-mono)' }}>
                Nashville, TN
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-gunmetal/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <span
            className="text-[9px] tracking-[0.15em] uppercase text-ash/40"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            &copy; {new Date().getFullYear()} TARTARY SYSTEMS. ALL RIGHTS RESERVED.
          </span>
          <span
            className="text-[9px] tracking-[0.15em] uppercase text-ash/40"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            UNIVERSE &middot; SYSTEM &middot; STUDIO &middot; PRESS &middot; CIVILIAN
          </span>
        </div>
      </div>
    </footer>
  );
}
