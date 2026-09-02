import type { Metadata } from "next";
import StudioPageShell from "@/components/StudioPageShell";
import { aboutContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "About — TARTARY",
  description: "TARTARY builds original cinematic universes — and the AI infrastructure to create and operate them.",
};

export default function AboutPage() {
  return (
    <StudioPageShell
      eyebrow={aboutContent.eyebrow}
      title={aboutContent.title}
      subtitle={aboutContent.sub}
    >
      <div className="space-y-6 text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        {aboutContent.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </StudioPageShell>
  );
}
