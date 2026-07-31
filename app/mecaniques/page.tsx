import type { Metadata } from "next";
import { CampaignMap } from "@/components/campaign-map";

export const metadata: Metadata = {
  title: "Casse-têtes",
  description:
    "La campagne de 30 niveaux bâtie sur six mécaniques classiques : sudoku, démineur, mastermind, taquin, lumières et cascade.",
};

export default function MecaniquesPage() {
  return <CampaignMap />;
}
