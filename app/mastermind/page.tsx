import type { Metadata } from "next";
import { GameShell } from "@/components/game-shell";
import { requireGame } from "@/lib/games";
import { MastermindGame } from "./mastermind-game";

const game = requireGame("mastermind");

export const metadata: Metadata = {
  title: game.name,
  description: game.description,
};

export default function MastermindPage() {
  return (
    <GameShell game={game}>
      <MastermindGame />
    </GameShell>
  );
}
