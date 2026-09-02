import type { Metadata } from "next";
import StudioPageShell from "@/components/StudioPageShell";
import { bookDemoContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Book a Demo — TARTARY",
  description: "See how TARTARY's technology can power your next production.",
};

export default function BookDemoPage() {
  return (
    <StudioPageShell
      eyebrow={bookDemoContent.eyebrow}
      title={bookDemoContent.title}
      subtitle={bookDemoContent.sub}
    >
      <div className="space-y-8">
        <div className="space-y-4">
          {bookDemoContent.fields.map((field) => (
            <div key={field} className="text-sm" style={{ color: "var(--color-ash)" }}>
              {field}
            </div>
          ))}
        </div>

        <div className="pt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <a
            href="mailto:hello@tartary.com?subject=Book%20a%20Demo"
            className="inline-flex px-7 py-3.5 rounded-full text-sm font-semibold tracking-[0.1em] uppercase transition-all duration-200 hover:opacity-90"
            style={{ fontFamily: "var(--font-logo)", background: "var(--color-orange)", color: "#0A0808" }}
          >
            {bookDemoContent.submit}
          </a>
          <p className="mt-4 text-sm" style={{ color: "var(--color-ash)" }}>
            hello@tartary.com
          </p>
        </div>
      </div>
    </StudioPageShell>
  );
}
