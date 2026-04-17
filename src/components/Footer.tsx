'use client';

import Link from 'next/link';
import { pillars } from '@/lib/theme';
import Marquee from './Marquee';

export default function Footer() {
  return (
    <footer className="relative border-t hairline overflow-hidden" style={{ background: 'var(--color-ink)' }}>
      {/* Outro wordmark marquee */}
      <div className="py-8 border-b hairline">
        <Marquee speed={60}>
          <span
            className="text-[18vw] leading-none whitespace-nowrap select-none"
            style={{
              fontFamily: 'var(--font-logo)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: 'rgba(236, 228, 210, 0.04)',
            }}
          >
            TARTARY · UNIVERSE · SYSTEM · STUDIO · PRESS · CIVILIAN · TARTARY ·&nbsp;
          </span>
        </Marquee>
      </div>

      <div className="max-w-[1480px] mx-auto px-6 md:px-10 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand + manifesto */}
          <div className="md:col-span-5">
            <div className="t-micro mb-6" style={{ color: 'var(--color-orange)' }}>— Studio</div>
            <p
              className="text-2xl md:text-3xl max-w-md leading-[1.25] text-bone"
              style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontWeight: 400 }}
            >
              Sovereign AI conglomerate. Every layer owned, every tool built in-house.
            </p>
            <div className="mt-8 flex flex-wrap gap-5">
              {['Vimeo', 'Instagram', 'IMDb', 'X', 'YouTube'].map((s) => (
                <a
                  key={s}
                  href="#"
                  data-cursor="hover"
                  className="t-micro link-under hover:text-bone transition-colors duration-500"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Departments */}
          <div className="md:col-span-4 md:col-start-7">
            <div className="t-micro mb-5">Departments</div>
            <nav className="flex flex-col gap-2.5">
              {pillars.map((p) => (
                <Link
                  key={p.id}
                  href={p.href}
                  data-cursor="hover"
                  className="group inline-flex items-baseline gap-2.5 hover:text-bone transition-colors duration-500"
                  style={{ color: 'var(--color-parchment)' }}
                >
                  <span className="text-[10px] tabular-nums" style={{ color: 'var(--color-warm-slate)', fontFamily: 'var(--font-mono)' }}>{p.idx}</span>
                  <span
                    className="text-[15px] group-hover:text-orange transition-colors duration-500"
                    style={{ fontFamily: 'var(--font-logo)', fontWeight: 600, letterSpacing: '0.12em' }}
                  >
                    {p.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <div className="t-micro mb-5">Get in touch</div>
            <a
              href="mailto:hello@tartary.com"
              data-cursor="hover"
              className="block text-xl md:text-2xl hover:text-orange transition-colors duration-500 mb-8 link-under text-bone"
              style={{ fontFamily: 'var(--font-logo)', fontWeight: 600, letterSpacing: '0.02em' }}
            >
              hello@tartary.com
            </a>
            <div className="space-y-3">
              <div>
                <div className="t-micro mb-1">Pacific</div>
                <div className="text-[14px] text-parchment" style={{ fontFamily: 'var(--font-sans)' }}>Los Angeles, CA</div>
              </div>
              <div>
                <div className="t-micro mb-1">South</div>
                <div className="text-[14px] text-parchment" style={{ fontFamily: 'var(--font-sans)' }}>Nashville, TN</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t hairline flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <span className="t-micro">© {new Date().getFullYear()} TARTARY. Sovereign AI.</span>
          <div className="flex gap-6">
            <Link href="/privacy" data-cursor="hover" className="t-micro link-under hover:text-parchment">Privacy</Link>
            <Link href="/terms" data-cursor="hover" className="t-micro link-under hover:text-parchment">Terms</Link>
            <span className="t-micro">v2 · 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
