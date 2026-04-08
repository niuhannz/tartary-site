'use client';

import Link from 'next/link';
import { pillars } from '@/lib/theme';

export default function Footer() {
  return (
    <footer className="bg-obsidian" style={{ boxShadow: 'inset 0px 1px 0px 0px #30302e' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <span
              className="text-xl tracking-[0.3em] uppercase block mb-4 logo-sheen"
              style={{ fontFamily: 'var(--font-logo)', fontWeight: 700 }}
            >
              Tartary
            </span>
            <p
              className="text-[15px] text-stone max-w-xs"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, lineHeight: 1.6 }}
            >
              Sovereign AI Conglomerate. Every layer owned,
              every tool built in-house.
            </p>
          </div>

          {/* Departments */}
          <div className="md:col-span-4 md:col-start-7">
            <p
              className="text-[12px] tracking-[0.08em] uppercase text-stone mb-5"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}
            >
              Departments
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {pillars.map((p) => (
                <Link
                  key={p.id}
                  href={p.href}
                  className="text-[14px] text-warm-silver hover:text-orange transition-colors duration-150"
                  style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <p
              className="text-[12px] tracking-[0.08em] uppercase text-stone mb-5"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}
            >
              Contact
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:hello@tartary.com"
                className="text-[14px] text-warm-silver hover:text-orange transition-colors duration-150"
                style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}
              >
                hello@tartary.com
              </a>
              <p className="text-[14px] text-stone" style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}>
                Los Angeles &middot; Nashville
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6" style={{ boxShadow: 'inset 0px 1px 0px 0px #30302e' }}>
          <span className="text-[13px] text-olive" style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}>
            &copy; {new Date().getFullYear()} Tartary
          </span>
        </div>
      </div>
    </footer>
  );
}
