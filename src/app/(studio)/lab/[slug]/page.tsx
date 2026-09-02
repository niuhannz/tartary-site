import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SubProductPage from "@/components/SubProductPage";
import { getPillar, getSubProduct } from "@/lib/pillarContent";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getPillar("lab")!.subProducts.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sub = getSubProduct("lab", slug);
  return {
    title: `${sub?.label ?? "Lab"} — TARTARY`,
    description: sub?.tagline,
  };
}

export default async function LabSubPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const pillar = getPillar("lab");
  const sub = getSubProduct("lab", slug);
  if (!pillar || !sub) notFound();
  return <SubProductPage pillar={pillar} sub={sub} />;
}
