import type { Metadata } from "next";
import UniverseExplorer from "@/components/universe/UniverseExplorer";

export const metadata: Metadata = {
  title: "IP Universe — TARTARY",
  description:
    "Explore the TARTARY IP Universe — an interactive map of original worlds, characters, and stories, built to be licensed and co-developed.",
};

export default function UniversePage() {
  return <UniverseExplorer />;
}
