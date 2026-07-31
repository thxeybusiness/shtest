import type { ReactNode } from "react";
import type { GameMeta } from "@/lib/game-meta";

export function GameShell({
  game,
  children,
}: {
  game: GameMeta;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-5 py-10">
      <header className="flex flex-col gap-2">
        <h1
          className="flex items-center gap-3 text-3xl font-semibold tracking-tight"
          style={{ color: game.color }}
        >
          <game.icone className="h-7 w-7 shrink-0" />
          <span className="">{game.name}</span>
        </h1>
        <p className="text-sm text-muted">{game.description}</p>
      </header>
      {children}
    </div>
  );
}
