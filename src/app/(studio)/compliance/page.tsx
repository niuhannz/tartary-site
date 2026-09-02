import type { Metadata } from "next";
import StudioPageShell from "@/components/StudioPageShell";
import { complianceContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "IP & Compliance — TARTARY",
  description: "How TARTARY protects, structures, and licenses its intellectual property.",
};

export default function CompliancePage() {
  return (
    <StudioPageShell
      eyebrow={complianceContent.eyebrow}
      title={complianceContent.title}
      subtitle={complianceContent.sub}
    >
      <div className="space-y-10">
        {complianceContent.sections.map((s, i) => (
          <div key={s.title}>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="t-micro" style={{ color: "var(--color-orange)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2
                className="text-xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-logo)", color: "var(--color-bone)" }}
              >
                {s.title}
              </h2>
            </div>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {s.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-14">
        <a
          href="mailto:partners@tartary.com"
          className="inline-flex px-7 py-3.5 rounded-full text-sm font-semibold tracking-[0.1em] uppercase transition-all duration-200 hover:opacity-90"
          style={{ fontFamily: "var(--font-logo)", background: "var(--color-orange)", color: "#0A0808" }}
        >
          {complianceContent.cta}
        </a>
      </div>
    </StudioPageShell>
  );
}
