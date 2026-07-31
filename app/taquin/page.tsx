import type { Metadata } from "next";
import { GameShell } from "@/components/game-shell";
import { requireGame } from "@/lib/games";
import { TaquinGame } from "./taquin-game";

const game = requireGame("taquin");

export const metadata: Metadata = {
  title: game.name,
  description: game.description,
};

export default function TaquinPage() {
  return (
    <GameShell game={game}>
      <TaquinGame />
    </GameShell>
  );
}
