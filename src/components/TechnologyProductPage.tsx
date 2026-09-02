"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import StudioPageShell from "@/components/StudioPageShell";
import type { TechProduct } from "@/lib/siteContent";

const ease = [0.23, 1, 0.32, 1] as const;

/* ── Section heading ── */
function SectionHead({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-5">
      <span className="t-micro" style={{ color: "var(--color-orange)" }}>
        {index}
      </span>
      <h2
        className="text-xl font-bold tracking-tight"
        style={{ fontFamily: "var(--font-logo)", color: "var(--color-bone)" }}
      >
        {title}
      </h2>
    </div>
  );
}

/* ── Bullet list ── */
function BulletList({ items, marker }: { items: string[]; marker?: string }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
          <span className="mt-[7px] w-1.5 h-1.5 shrink-0 rounded-full" style={{ background: marker ?? "var(--color-orange)" }} />
          <span style={{ color: "var(--color-text-secondary)" }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function TechnologyProductPage({ product }: { product: TechProduct }) {
  return (
    <StudioPageShell
      eyebrow={`Technology — ${product.name}`}
      title={product.name}
      subtitle={product.tagline}
    >
      {/* ── Sub ── */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease }}
        className="text-base leading-relaxed max-w-2xl mb-16"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {product.sub}
      </motion.p>

      <div className="space-y-16">
        {/* ① Industry Pain Points */}
        <section>
          <SectionHead index="01" title="Industry Pain Points" />
          <BulletList items={product.painPoints} />
        </section>

        {/* ② Core Capabilities */}
        <section>
          <SectionHead index="02" title="Core Capabilities" />
          <div className="grid sm:grid-cols-2 gap-4">
            {product.capabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.05, ease }}
                className="p-6"
                style={{ border: "1px solid var(--border)", background: "var(--color-obsidian-warm)" }}
              >
                <h3 className="text-base font-semibold" style={{ fontFamily: "var(--font-logo)", color: "var(--color-bone)" }}>
                  {cap.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {cap.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ③ Who Is This For */}
        <section>
          <SectionHead index="03" title="Who Is This For" />
          <BulletList items={product.whoFor} />
        </section>

        {/* ④ Business Outcomes */}
        <section>
          <SectionHead index="04" title="Business Outcomes" />
          <BulletList items={product.outcomes} marker="var(--color-gold)" />
        </section>

        {/* ⑤ Compliance & IP Safeguards */}
        <section>
          <SectionHead index="05" title="Compliance & IP Safeguards" />
          <div
            className="p-6 sm:p-8"
            style={{ border: "1px solid var(--border)", background: "var(--color-obsidian-warm)" }}
          >
            <BulletList items={product.compliance} marker="var(--color-bone)" />
          </div>
        </section>

        {/* ⑥ Commercial Model */}
        <section>
          <SectionHead index="06" title="Commercial Model" />
          <BulletList items={product.pricing} marker="var(--color-ash)" />
        </section>
      </div>

      {/* ⑦ CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease }}
        className="mt-20"
      >
        <div className="hairline w-full mb-8" />
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Link
            href="/technology"
            className="t-label transition-colors duration-200 hover:text-white"
            style={{ color: "var(--color-parchment)" }}
          >
            ← Technology
          </Link>
          <Link
            href="/book-demo"
            className="px-7 py-3.5 rounded-full text-sm font-semibold tracking-[0.1em] uppercase transition-all duration-200 hover:opacity-90"
            style={{ fontFamily: "var(--font-logo)", background: "var(--color-orange)", color: "#0A0808" }}
          >
            Book a Demo
          </Link>
        </div>
      </motion.div>
    </StudioPageShell>
  );
}
