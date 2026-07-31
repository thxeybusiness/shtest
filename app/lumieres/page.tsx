import type { Metadata } from "next";
import { GameShell } from "@/components/game-shell";
import { requireGame } from "@/lib/games";
import { LightsGame } from "./lights-game";

const game = requireGame("lumieres");

export const metadata: Metadata = {
  title: game.name,
  description: game.description,
};

export default function LightsPage() {
  return (
    <GameShell game={game}>
      <LightsGame />
    </GameShell>
  );
}
