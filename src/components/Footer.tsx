'use client';

import Link from 'next/link';
import { pillars } from '@/lib/theme';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-obsidian">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <span
              className="text-xl tracking-[0.3em] uppercase block mb-4 logo-sheen"
              style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
            >
              Tartary
            </span>
            <p
              className="text-[14px] text-bone/30 max-w-xs leading-relaxed"
              style={{ fontFamily: 'var(--font-logo)', fontWeight: 400 }}
            >
              Sovereign AI Conglomerate. Every layer owned, every tool built in-house.
            </p>
          </div>

          {/* Departments */}
          <div className="md:col-span-5 md:col-start-6">
            <p
              className="text-[12px] tracking-[0.1em] uppercase text-bone/20 mb-5"
              style={{ fontFamily: 'var(--font-logo)', fontWeight: 600 }}
            >
              Departments
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {pillars.map((p) => (
                <Link
                  key={p.id}
                  href={p.href}
                  className="text-[14px] text-bone/50 hover:text-orange transition-colors duration-100"
                  style={{ fontFamily: 'var(--font-logo)', fontWeight: 500 }}
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <p
              className="text-[12px] tracking-[0.1em] uppercase text-bone/20 mb-5"
              style={{ fontFamily: 'var(--font-logo)', fontWeight: 600 }}
            >
              Contact
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:hello@tartary.com"
                className="text-[14px] text-bone/50 hover:text-orange transition-colors duration-100"
                style={{ fontFamily: 'var(--font-logo)', fontWeight: 500 }}
              >
                hello@tartary.com
              </a>
              <p className="text-[14px] text-bone/30" style={{ fontFamily: 'var(--font-logo)', fontWeight: 400 }}>
                Los Angeles &middot; Nashville
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-3">
          <span
            className="text-[12px] text-bone/15"
            style={{ fontFamily: 'var(--font-logo)', fontWeight: 400 }}
          >
            &copy; {new Date().getFullYear()} Tartary
          </span>
        </div>
      </div>
    </footer>
  );
}
