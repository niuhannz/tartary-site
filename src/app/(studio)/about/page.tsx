import StudioPageShell from "@/components/StudioPageShell";

export default function AboutPage() {
  return (
    <StudioPageShell
      eyebrow="About"
      title="A studio at the edge of reality."
      subtitle="Tartary is a spatial computing studio building AI-native creative tools and content for Apple Vision Pro. We believe the future of storytelling is immersive, interactive, and intelligent."
    >
      <div className="space-y-6 text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        <p>
          Founded by filmmakers, game designers, and AI researchers, Tartary
          exists to build the creative infrastructure for spatial computing.
          Our two flagship systems — Tartary OS and Mudflood — represent the
          first AI-native tools purpose-built for visionOS.
        </p>
        <p>
          We don&apos;t just make software. We make worlds.
        </p>
      </div>
    </StudioPageShell>
  );
}