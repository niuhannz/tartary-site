import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <span
              className="text-2xl tracking-[0.3em] uppercase block mb-6"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
            >
              Tartary
            </span>
            <p className="text-ash text-lg max-w-sm leading-relaxed mb-8" style={{ fontFamily: 'var(--font-display)' }}>
              Building worlds across cinema, anime, games, and publishing. Original IP creation and cinematic storytelling for a new era.
            </p>
            <div className="flex gap-6">
              {['Vimeo', 'Instagram', 'IMDb'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-[11px] tracking-[0.2em] uppercase text-ash hover:text-gold transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Divisions */}
          <div className="md:col-span-3 md:col-start-7">
            <span
              className="text-[11px] tracking-[0.2em] uppercase text-ash block mb-6"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Divisions
            </span>
            <nav className="flex flex-col gap-3">
              {[
                { href: '/worlds', label: 'Worlds' },
                { href: '/cinema', label: 'Cinema' },
                { href: '/anime', label: 'Anime' },
                { href: '/games', label: 'Games' },
                { href: '/publishing', label: 'Publishing' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-mist hover:text-foreground transition-colors duration-300 text-sm tracking-wide"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <span
              className="text-[11px] tracking-[0.2em] uppercase text-ash block mb-6"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Get in Touch
            </span>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@tartary.com"
                className="text-mist hover:text-gold transition-colors duration-300 text-sm tracking-wide"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
              >
                hello@tartary.com
              </a>
              <p className="text-ash text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                Los Angeles, California
              </p>
              <p className="text-ash text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                Nashville, Tennessee
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <span
            className="text-[11px] tracking-[0.15em] uppercase text-ash/60"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            &copy; {new Date().getFullYear()} Tartary. All rights reserved.
          </span>
          <span
            className="text-[11px] tracking-[0.15em] uppercase text-ash/60"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Worlds &middot; Cinema &middot; Anime &middot; Games &middot; Publishing
          </span>
        </div>
      </div>
    </footer>
  );
}
