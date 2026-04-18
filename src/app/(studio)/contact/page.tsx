import StudioPageShell from "@/components/StudioPageShell";

export default function ContactPage() {
  return (
    <StudioPageShell
      eyebrow="Contact"
      title="Let's build together."
      subtitle="Whether you're a creator, developer, investor, or just curious — we'd love to hear from you."
    >
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>
            General Inquiries
          </h3>
          <a href="mailto:hello@tartary.com" className="text-lg hover:underline" style={{ color: "var(--color-accent-primary)" }}>
            hello@tartary.com
          </a>
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>
            Partnerships
          </h3>          <a href="mailto:partners@tartary.com" className="text-lg hover:underline" style={{ color: "var(--color-accent-primary)" }}>
            partners@tartary.com
          </a>
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>
            Press
          </h3>
          <a href="mailto:press@tartary.com" className="text-lg hover:underline" style={{ color: "var(--color-accent-primary)" }}>
            press@tartary.com
          </a>
        </div>
      </div>
    </StudioPageShell>
  );
}