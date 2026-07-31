import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Joueur } from "@/components/noir/joueur";
import { getNiveau, niveaux } from "@/lib/noir/niveaux";

type PageProps = { params: Promise<{ n: string }> };

export function generateStaticParams() {
  return niveaux.map((niveau) => ({ n: String(niveau.numero) }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { n } = await params;
  return { title: `Niveau ${n}` };
}

export default async function NiveauPage({ params }: PageProps) {
  const { n } = await params;
  const niveau = getNiveau(Number(n));

  if (!niveau) notFound();
  return <Joueur niveau={niveau} />;
}
