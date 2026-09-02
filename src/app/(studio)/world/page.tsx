import type { Metadata } from "next";
import PillarPage from "@/components/PillarPage";
import { getPillar } from "@/lib/pillarContent";

export const metadata: Metadata = {
  title: "World — TARTARY",
  description: "Original worlds. Uncompromising stories.",
};

export default function WorldPage() {
  const pillar = getPillar("world");
  return <PillarPage pillar={pillar!} />;
}
