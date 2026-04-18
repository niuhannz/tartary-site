import StudioPageShell from "@/components/StudioPageShell";

export default function ContactPage() {
  return (
    <StudioPageShell
      eyebrow="Contact"
      title="Reach us."
      subtitle="For press inquiries, partnership proposals, or general questions — we read everything."
    >
      <div className="space-y-8">
        <div>
          <h3
            className="t-label mb-2"
            style={{ color: "var(--color-ash)" }}
          >
            General Inquiries
          </h3>
          <a
            href="mailto:hello@tartary.com"
            className="text-lg link-under"
            style={{ color: "var(--color-orange)" }}
          >
            hello@tartary.com
          </a>
        </div>
        <div>
          <h3
            className="t-label mb-2"
            style={{ color: "var(--color-ash)" }}
          >
            Partnerships
          </h3>
          <a
            href="mailto:partners@tartary.com"
            className="text-lg link-under"
            style={{ color: "var(--color-orange)" }}
          >
            partners@tartary.com
          </a>
        </div>
        <div>
          <h3
            className="t-label mb-2"
            style={{ color: "var(--color-ash)" }}
          >
            Press
          </h3>
          <a
            href="mailto:press@tartary.com"
            className="text-lg link-under"
            style={{ color: "var(--color-orange)" }}
          >
            press@tartary.com
          </a>
        </div>
      </div>
    </StudioPageShell>
  );
}
