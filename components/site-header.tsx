import Link from "next/link";
import { games } from "@/lib/games";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          Jeux de logique
        </Link>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {games.map((game) => (
            <Link
              key={game.slug}
              href={`/${game.slug}`}
              className="text-muted transition hover:text-text"
            >
              {game.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
