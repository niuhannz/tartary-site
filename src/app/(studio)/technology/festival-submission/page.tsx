import type { Metadata } from "next";
import TechnologyProductPage from "@/components/TechnologyProductPage";
import { techProducts } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "AI Film Festival Submission Tool — TARTARY",
  description: "Submit everywhere. Track everything.",
};

export default function FestivalPage() {
  const product = techProducts.find((p) => p.slug === "festival-submission")!;
  return <TechnologyProductPage product={product} />;
}
