import type { Metadata } from "next";
import { GameShell } from "@/components/game-shell";
import { requireGame } from "@/lib/games";
import { CascadeGame } from "./cascade-game";

const game = requireGame("cascade");

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
