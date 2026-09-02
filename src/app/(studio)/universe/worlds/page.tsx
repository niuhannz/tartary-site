import type { Metadata } from "next";
import Link from "next/link";
import StudioPageShell from "@/components/StudioPageShell";
import { worldsContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Worlds — TARTARY",
  description: "Original universes, each with its own rules, history, and mythology.",
};

export default function WorldsPage() {
  return (
    <StudioPageShell
      eyebrow={worldsContent.eyebrow}
      title={worldsContent.title}
      subtitle={worldsContent.sub}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        {worldsContent.worlds.map((w) => (
          <div
            key={w.name}
            className="p-8"
            style={{ border: "1px solid var(--border)", background: "var(--color-obsidian-warm)" }}
          >
            <span className="t-micro" style={{ color: "var(--color-orange)" }}>
              WORLD
            </span>
            <h2
              className="mt-5 text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-logo)", color: "var(--color-bone)" }}
            >
              {w.name}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {w.description}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm italic" style={{ color: "var(--color-ash)" }}>
        {worldsContent.more}
      </p>

      <div className="mt-14">
        <Link
          href="/universe/licensing"
          className="inline-flex px-7 py-3.5 rounded-full text-sm font-semibold tracking-[0.1em] uppercase transition-all duration-200 hover:opacity-90"
          style={{ fontFamily: "var(--font-logo)", background: "var(--color-orange)", color: "#0A0808" }}
        >
          {worldsContent.cta}
        </Link>
      </div>
    </StudioPageShell>
  );
}
