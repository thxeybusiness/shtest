import type { Metadata } from "next";
import Link from "next/link";
import { allGames } from "@/lib/game-meta";

export const metadata: Metadata = {
  title: "Partie libre",
  description:
    "Les six mécaniques du site, jouables sans objectif et avec tous les réglages ouverts.",
};

export default function FreePlayPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 py-14">
      <header className="flex max-w-2xl flex-col gap-3">
        <Link href="/" className="text-sm text-muted transition hover:text-text">
          ← Carte des niveaux
        </Link>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Partie <span className="text-neon-cyan glow-text">libre</span>
        </h1>
        <p className="text-lg text-muted">
          Les mêmes mécaniques que la campagne, sans objectif ni progression :
          tous les réglages sont ouverts et seuls vos records personnels sont
          conservés.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allGames.map((game) => (
          <li key={game.slug}>
            <Link
              href={`/${game.slug}`}
              style={{ color: game.neon }}
              className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-surface/60 p-6 transition hover:border-current hover:bg-surface"
            >
              <span aria-hidden className="text-3xl">
                {game.emoji}
              </span>
              <span className="text-lg font-medium text-text">{game.name}</span>
              <span className="glow-text text-xs font-semibold tracking-widest uppercase">
                {game.tagline}
              </span>
              <span className="text-sm text-muted">{game.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
