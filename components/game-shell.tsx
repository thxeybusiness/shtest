import type { ReactNode } from "react";
import type { Game } from "@/lib/games";

export function GameShell({
  game,
  children,
}: {
  game: Game;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-5 py-10">
      <header className="flex flex-col gap-2">
        <h1
          className="flex items-center gap-3 text-3xl font-semibold tracking-tight"
          style={{ color: game.neon }}
        >
          <span aria-hidden>{game.emoji}</span>
          <span className="glow-text">{game.name}</span>
        </h1>
        <p className="text-sm text-muted">{game.description}</p>
      </header>
      {children}
    </div>
  );
}
