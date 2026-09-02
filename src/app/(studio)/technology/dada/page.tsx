import type { Metadata } from "next";
import TechnologyProductPage from "@/components/TechnologyProductPage";
import { techProducts } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "DADA — TARTARY",
  description: "AI Likeness Authorization Platform.",
};

export default function DadaPage() {
  const product = techProducts.find((p) => p.slug === "dada")!;
  return <TechnologyProductPage product={product} />;
}
