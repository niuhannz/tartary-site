'use client';

import Link from 'next/link';
import { pillars } from '@/lib/theme';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-border-dark">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <span
              className="text-lg tracking-[0.3em] uppercase block mb-3 text-white"
              style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
            >
              Tartary
            </span>
            <p
              className="text-[13px] text-mid-slate max-w-xs"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.4, letterSpacing: '-0.16px' }}
            >
              Sovereign AI Conglomerate. Every layer owned,
              every tool built in-house.
            </p>
          </div>

          {/* Departments */}
          <div className="md:col-span-4 md:col-start-7">
            <p
              className="section-label mb-4"
            >
              Departments
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
              {pillars.map((p) => (
                <Link
                  key={p.id}
                  href={p.href}
                  className="text-[13px] text-footer-gray hover:text-white transition-colors duration-150"
                  style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, letterSpacing: '-0.16px' }}
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <p
              className="section-label mb-4"
            >
              Contact
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:hello@tartary.com"
                className="text-[13px] text-footer-gray hover:text-white transition-colors duration-150"
                style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, letterSpacing: '-0.16px' }}
              >
                hello@tartary.com
              </a>
              <p className="text-[13px] text-mid-slate" style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, letterSpacing: '-0.16px' }}>
                Los Angeles &middot; Nashville
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-5 border-t border-border-dark">
          <span className="text-[12px] text-mid-slate" style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}>
            &copy; {new Date().getFullYear()} Tartary
          </span>
        </div>
      </div>
    </footer>
  );
}
