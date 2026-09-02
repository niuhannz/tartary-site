import type { Metadata } from "next";
import PillarPage from "@/components/PillarPage";
import { getPillar } from "@/lib/pillarContent";

export const metadata: Metadata = {
  title: "Artifacts — TARTARY",
  description: "Tools, engines, and objects with intent.",
};

export default function ArtifactsPage() {
  const pillar = getPillar("artifacts");
  return <PillarPage pillar={pillar!} />;
}
