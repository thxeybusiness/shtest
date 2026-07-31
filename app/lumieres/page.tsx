import type { Metadata } from "next";
import { GameShell } from "@/components/game-shell";
import { gameMeta } from "@/lib/game-meta";
import { LightsGame } from "./lights-game";

const game = gameMeta.lumieres;

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
