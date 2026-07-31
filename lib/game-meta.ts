import type { GameSlug } from "./campaign";

/** Présentation d'une mécanique : nom, emoji, couleur fluo, page de partie libre. */
export type GameMeta = {
  slug: GameSlug;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  neon: string;
};

export const gameMeta: Record<GameSlug, GameMeta> = {
  cascade: {
    slug: "cascade",
    name: "Cascade",
    tagline: "Logique en temps réel",
    description:
      "Les blocs descendent sans arrêt : cliquez ceux qui vérifient la règle avant qu'ils ne sortent.",
    emoji: "⚡",
    neon: "var(--neon-ember)",
  },
  sudoku: {
    slug: "sudoku",
    name: "Sudoku",
    tagline: "Déduction pure",
    description:
      "Remplissez la grille 9×9 : un seul chiffre par ligne, par colonne et par région.",
    emoji: "🔢",
    neon: "var(--neon-fuchsia)",
  },
  demineur: {
    slug: "demineur",
    name: "Démineur",
    tagline: "Probabilités et logique",
    description:
      "Découvrez toutes les cases sûres en vous fiant au nombre de mines voisines.",
    emoji: "💣",
    neon: "var(--neon-blood)",
  },
  mastermind: {
    slug: "mastermind",
    name: "Mastermind",
    tagline: "Déduction par élimination",
    description:
      "Trouvez la combinaison secrète, guidé par les indices de chaque tentative.",
    emoji: "🎯",
    neon: "var(--neon-violet)",
  },
  taquin: {
    slug: "taquin",
    name: "Taquin",
    tagline: "Planification de coups",
    description:
      "Faites glisser les tuiles pour les remettre dans l'ordre, en un minimum de mouvements.",
    emoji: "🧩",
    neon: "var(--neon-mint)",
  },
  lumieres: {
    slug: "lumieres",
    name: "Éteins les lumières",
    tagline: "Algèbre cachée",
    description:
      "Chaque clic bascule une case et ses voisines. Éteignez toute la grille.",
    emoji: "💡",
    neon: "var(--neon-gold)",
  },
};

export const allGames: GameMeta[] = Object.values(gameMeta);
