import type { Metadata } from "next";
import { GameShell } from "@/components/game-shell";
import { requireGame } from "@/lib/games";
import { MinesweeperGame } from "./minesweeper-game";

const game = requireGame("demineur");

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
