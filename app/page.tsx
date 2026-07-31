import Link from "next/link";
import { games } from "@/lib/games";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 py-14">
      <header className="flex max-w-2xl flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Jeux de logique
        </h1>
        <p className="text-lg text-muted">
          Cinq casse-têtes classiques, sans compte ni publicité. Vos meilleurs
          temps restent dans votre navigateur.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <li key={game.slug}>
            <Link
              href={`/${game.slug}`}
              className="flex h-full flex-col gap-2 rounded-xl border border-border bg-surface p-5 transition hover:border-accent hover:shadow-sm"
            >
              <span aria-hidden className="text-3xl">
                {game.emoji}
              </span>
              <span className="text-lg font-medium">{game.name}</span>
              <span className="text-xs tracking-wide text-accent uppercase">
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
