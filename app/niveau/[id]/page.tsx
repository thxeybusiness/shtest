import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLevel, levels } from "@/lib/campaign";
import { LevelPlayer } from "./level-player";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return levels.map((level) => ({ id: String(level.id) }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const level = getLevel(Number(id));

  if (!level) return { title: "Niveau introuvable" };
  return {
    title: `Niveau ${level.id} — ${level.title}`,
    description: `Campagne, chapitre ${level.chapter} : ${level.title}.`,
  };
}

export default async function LevelPage({ params }: PageProps) {
  const { id } = await params;
  const level = getLevel(Number(id));

  if (!level) notFound();
  return <LevelPlayer level={level} />;
}
