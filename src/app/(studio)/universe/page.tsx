import type { Metadata } from "next";
import Link from "next/link";
import StudioPageShell from "@/components/StudioPageShell";
import { universeLanding } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "IP Universe — TARTARY",
  description: "Original, company-owned IP — built to be licensed and co-developed.",
};

export default function UniversePage() {
  return (
    <StudioPageShell
      eyebrow={universeLanding.eyebrow}
      title={universeLanding.headline}
      subtitle={universeLanding.sub}
    >
      {/* Synergy strip */}
      <p
        className="mb-16 text-base italic"
        style={{ fontFamily: "var(--font-editorial)", color: "var(--color-parchment)" }}
      >
        {universeLanding.synergy}
      </p>

      {/* Entries */}
      <div className="grid sm:grid-cols-2 gap-4">
        {universeLanding.entries.map((e) => (
          <Link
            key={e.href}
            href={e.href}
            className="group block h-full p-8 transition-colors duration-300 hover:bg-white/[0.03]"
            style={{ border: "1px solid var(--border)", background: "var(--color-obsidian-warm)" }}
          >
            <h2
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-logo)", color: "var(--color-bone)" }}
            >
              {e.title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {e.text}
            </p>
            <span className="mt-6 inline-block t-label" style={{ color: "var(--color-parchment)" }}>
              Explore →
            </span>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 flex flex-wrap items-center gap-4">
        <Link
          href="/universe/worlds"
          className="inline-flex px-7 py-3.5 rounded-full text-sm font-semibold tracking-[0.1em] uppercase transition-all duration-200 hover:opacity-90"
          style={{ fontFamily: "var(--font-logo)", background: "var(--color-orange)", color: "#0A0808" }}
        >
          {universeLanding.ctaPrimary}
        </Link>
        <Link
          href="/universe/licensing"
          className="inline-flex px-7 py-3.5 rounded-full text-sm font-semibold tracking-[0.1em] uppercase transition-colors duration-200 hover:text-white"
          style={{ fontFamily: "var(--font-logo)", color: "var(--color-parchment)", border: "1px solid var(--border)" }}
        >
          {universeLanding.ctaSecondary}
        </Link>
      </div>
    </StudioPageShell>
  );
}
