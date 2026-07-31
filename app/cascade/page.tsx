import type { Metadata } from "next";
import { GameShell } from "@/components/game-shell";
import { gameMeta } from "@/lib/game-meta";
import { CascadeGame } from "./cascade-game";

const game = gameMeta.cascade;

export const metadata: Metadata = {
  title: game.name,
  description: game.description,
};

export default function CascadePage() {
  return (
    <GameShell game={game}>
      <CascadeGame />
    </GameShell>
  );
}
