import type { Metadata } from "next";
import Link from "next/link";
import StudioPageShell from "@/components/StudioPageShell";
import { projectsContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Stories & Projects — TARTARY",
  description: "Film and series developed inside our universes.",
};

export default function ProjectsPage() {
  return (
    <StudioPageShell
      eyebrow={projectsContent.eyebrow}
      title={projectsContent.title}
      subtitle={projectsContent.sub}
    >
      <div className="space-y-4">
        {projectsContent.projects.map((p) => (
          <div
            key={p.title}
            className="p-8"
            style={{ border: "1px solid var(--border)", background: "var(--color-obsidian-warm)" }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="t-micro" style={{ color: "var(--color-orange)" }}>
                {p.format}
              </span>
              <span className="w-3 h-px" style={{ background: "var(--border)" }} />
              <span className="t-micro" style={{ color: "var(--color-ash)" }}>
                {p.status}
              </span>
            </div>

            <h2
              className="text-3xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-logo)", color: "var(--color-bone)" }}
            >
              {p.title}
            </h2>

            <p className="mt-4 text-base italic" style={{ fontFamily: "var(--font-editorial)", color: "var(--color-parchment)" }}>
              {p.logline}
            </p>

            <div className="mt-5 flex gap-3 text-sm">
              <span className="t-micro shrink-0 pt-0.5" style={{ color: "var(--color-ash)" }}>Universe</span>
              <span style={{ color: "var(--color-text-secondary)" }}>{p.universe}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm" style={{ color: "var(--color-ash)" }}>
        {projectsContent.note}
      </p>

      <div className="mt-14">
        <Link
          href="/universe/licensing"
          className="inline-flex px-7 py-3.5 rounded-full text-sm font-semibold tracking-[0.1em] uppercase transition-all duration-200 hover:opacity-90"
          style={{ fontFamily: "var(--font-logo)", background: "var(--color-orange)", color: "#0A0808" }}
        >
          {projectsContent.cta}
        </Link>
      </div>
    </StudioPageShell>
  );
}
