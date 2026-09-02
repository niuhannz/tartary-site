import type { Metadata } from "next";
import PillarPage from "@/components/PillarPage";
import { getPillar } from "@/lib/pillarContent";

export const metadata: Metadata = {
  title: "Films — TARTARY",
  description: "Immersive cinema for a new dimension.",
};

export default function FilmsPage() {
  const pillar = getPillar("films");
  return <PillarPage pillar={pillar!} />;
}
