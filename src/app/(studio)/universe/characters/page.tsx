import type { Metadata } from "next";
import Link from "next/link";
import StudioPageShell from "@/components/StudioPageShell";
import { charactersContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Characters — TARTARY",
  description: "A growing library of original characters.",
};

export default function CharactersPage() {
  return (
    <StudioPageShell
      eyebrow={charactersContent.eyebrow}
      title={charactersContent.title}
      subtitle={charactersContent.sub}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        {charactersContent.characters.map((c) => (
          <div
            key={c.name}
            className="p-8"
            style={{ border: "1px solid var(--border)", background: "var(--color-obsidian-warm)" }}
          >
            <span className="t-micro" style={{ color: "var(--color-orange)" }}>
              CHARACTER FILE
            </span>
            <h2
              className="mt-5 text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-logo)", color: "var(--color-bone)" }}
            >
              {c.name}
            </h2>

            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex gap-3">
                <dt className="t-micro shrink-0 w-24 pt-0.5" style={{ color: "var(--color-ash)" }}>Universe</dt>
                <dd style={{ color: "var(--color-text-secondary)" }}>{c.universe}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="t-micro shrink-0 w-24 pt-0.5" style={{ color: "var(--color-ash)" }}>Role</dt>
                <dd style={{ color: "var(--color-text-secondary)" }}>{c.role}</dd>
              </div>
            </dl>

            <p className="mt-4 text-[15px] leading-relaxed italic" style={{ fontFamily: "var(--font-editorial)", color: "var(--color-parchment)" }}>
              {c.oneLine}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm" style={{ color: "var(--color-ash)" }}>
        {charactersContent.note}
      </p>

      <div className="mt-14">
        <Link
          href="/universe/licensing"
          className="inline-flex px-7 py-3.5 rounded-full text-sm font-semibold tracking-[0.1em] uppercase transition-all duration-200 hover:opacity-90"
          style={{ fontFamily: "var(--font-logo)", background: "var(--color-orange)", color: "#0A0808" }}
        >
          {charactersContent.cta}
        </Link>
      </div>
    </StudioPageShell>
  );
}
