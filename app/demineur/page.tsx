import type { Metadata } from "next";
import { GameShell } from "@/components/game-shell";
import { gameMeta } from "@/lib/game-meta";
import { MinesweeperGame } from "./minesweeper-game";

const game = gameMeta.demineur;

export const metadata: Metadata = {
  title: game.name,
  description: game.description,
};

export default function MinesweeperPage() {
  return (
    <GameShell game={game}>
      <MinesweeperGame />
    </GameShell>
  );
}
