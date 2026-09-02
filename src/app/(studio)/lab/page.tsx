import type { Metadata } from "next";
import PillarPage from "@/components/PillarPage";
import { getPillar } from "@/lib/pillarContent";

export const metadata: Metadata = {
  title: "Lab — TARTARY",
  description: "Intelligence, in service of story.",
};

export default function LabPage() {
  const pillar = getPillar("lab");
  return <PillarPage pillar={pillar!} />;
}
