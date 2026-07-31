import type { Metadata } from "next";
import { GameShell } from "@/components/game-shell";
import { gameMeta } from "@/lib/game-meta";
import { TaquinGame } from "./taquin-game";

const game = gameMeta.taquin;

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
