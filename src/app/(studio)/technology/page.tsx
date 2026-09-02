import type { Metadata } from "next";
import Link from "next/link";
import StudioPageShell from "@/components/StudioPageShell";
import { technologyOverview, techProducts } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Technology — TARTARY",
  description: "Commercial AI tooling for talent, production, and distribution.",
};

export default function TechnologyPage() {
  return (
    <StudioPageShell
      eyebrow={technologyOverview.eyebrow}
      title={technologyOverview.title}
      subtitle={technologyOverview.subtitle}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {techProducts.map((p, i) => (
          <Link
            key={p.slug}
            href={`/technology/${p.slug}`}
            className="group block h-full p-8 transition-colors duration-300 hover:bg-white/[0.03]"
            style={{ border: "1px solid var(--border)", background: "var(--color-obsidian-warm)" }}
          >
            <span className="t-micro" style={{ color: "var(--color-orange)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2
              className="mt-6 text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-logo)", color: "var(--color-bone)" }}
            >
              {p.name}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {p.sub}
            </p>
            <span className="mt-6 inline-block t-label" style={{ color: "var(--color-parchment)" }}>
              Book a Demo →
            </span>
          </Link>
        ))}
      </div>
    </StudioPageShell>
  );
}
