import type { Metadata } from "next";
import { GameShell } from "@/components/game-shell";
import { gameMeta } from "@/lib/game-meta";
import { SudokuGame } from "./sudoku-game";

const game = gameMeta.sudoku;

export const metadata: Metadata = {
  title: game.name,
  description: game.description,
};

export default function SudokuPage() {
  return (
    <GameShell game={game}>
      <SudokuGame />
    </GameShell>
  );
}
