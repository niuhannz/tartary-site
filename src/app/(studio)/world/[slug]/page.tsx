import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SubProductPage from "@/components/SubProductPage";
import { getPillar, getSubProduct } from "@/lib/pillarContent";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getPillar("world")!.subProducts.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sub = getSubProduct("world", slug);
  return {
    title: `${sub?.label ?? "World"} — TARTARY`,
    description: sub?.tagline,
  };
}

export default async function WorldSubPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const pillar = getPillar("world");
  const sub = getSubProduct("world", slug);
  if (!pillar || !sub) notFound();
  return <SubProductPage pillar={pillar} sub={sub} />;
}
