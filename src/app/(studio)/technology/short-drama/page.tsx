import type { Metadata } from "next";
import TechnologyProductPage from "@/components/TechnologyProductPage";
import { techProducts } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Short-Drama Platform — TARTARY",
  description: "Where short-drama finds its audience — and its funding.",
};

export default function ShortDramaPage() {
  const product = techProducts.find((p) => p.slug === "short-drama")!;
  return <TechnologyProductPage product={product} />;
}
