import type { Metadata } from "next";
import StudioPageShell from "@/components/StudioPageShell";
import { licensingContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "IP Licensing — TARTARY",
  description: "License, co-develop, and extend the TARTARY IP Universe.",
};

export default function LicensingPage() {
  return (
    <StudioPageShell
      eyebrow={licensingContent.eyebrow}
      title={licensingContent.title}
      subtitle={licensingContent.sub}
    >
      {/* Models */}
      <div className="grid sm:grid-cols-3 gap-4">
        {licensingContent.models.map((m, i) => (
          <div
            key={m.title}
            className="p-7"
            style={{ border: "1px solid var(--border)", background: "var(--color-obsidian-warm)" }}
          >
            <span className="t-micro" style={{ color: "var(--color-orange)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2
              className="mt-4 text-xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-logo)", color: "var(--color-bone)" }}
            >
              {m.title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {m.text}
            </p>
          </div>
        ))}
      </div>

      {/* Why partner */}
      <div className="mt-14">
        <h2 className="t-label mb-4" style={{ color: "var(--color-ash)" }}>
          Why partner with TARTARY
        </h2>
        <ul className="space-y-3">
          {licensingContent.why.map((item, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
              <span className="mt-[7px] w-1.5 h-1.5 shrink-0 rounded-full" style={{ background: "var(--color-gold)" }} />
              <span style={{ color: "var(--color-text-secondary)" }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-14">
        <a
          href="mailto:partners@tartary.com"
          className="inline-flex px-7 py-3.5 rounded-full text-sm font-semibold tracking-[0.1em] uppercase transition-all duration-200 hover:opacity-90"
          style={{ fontFamily: "var(--font-logo)", background: "var(--color-orange)", color: "#0A0808" }}
        >
          {licensingContent.cta}
        </a>
        <p className="mt-4 text-sm" style={{ color: "var(--color-ash)" }}>
          partners@tartary.com
        </p>
      </div>
    </StudioPageShell>
  );
}
