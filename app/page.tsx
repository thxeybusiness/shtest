import Link from "next/link";
import { games } from "@/lib/games";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-5 py-16">
      <header className="flex max-w-2xl flex-col gap-4">
        <span className="text-neon-cyan glow-text w-fit text-xs font-semibold tracking-[0.3em] uppercase">
          Six casse-têtes
        </span>
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
          Jeux de <span className="text-neon-magenta glow-text">logique</span>
        </h1>
        <p className="text-lg text-muted">
          Un jeu d&apos;action en flux continu et cinq classiques de déduction.
          Sans compte, sans publicité : vos records restent dans votre
          navigateur.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
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
