import type { Metadata } from "next";
import StudioPageShell from "@/components/StudioPageShell";
import { teamContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Team — TARTARY",
  description: "A team spanning film, technology, and IP.",
};

export default function TeamPage() {
  return (
    <StudioPageShell
      eyebrow={teamContent.eyebrow}
      title={teamContent.title}
      subtitle={teamContent.sub}
    />
  );
}
