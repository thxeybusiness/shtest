import type { GameSlug } from "./campaign";

/** Présentation d'une mécanique : nom, emoji, teinte, page de partie libre. */
export type GameMeta = {
  slug: GameSlug;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  /** Teinte d'accent, référencée depuis la feuille de style. */
  color: string;
};

export const gameMeta: Record<GameSlug, GameMeta> = {
  cascade: {
    slug: "cascade",
    name: "Cascade",
    tagline: "Logique en temps réel",
    description:
      "Les blocs descendent sans arrêt : cliquez ceux qui vérifient la règle avant qu'ils ne sortent.",
    emoji: "⚡",
    color: "var(--tone-clay)",
  },
  sudoku: {
    slug: "sudoku",
    name: "Sudoku",
    tagline: "Déduction pure",
    description:
      "Remplissez la grille 9×9 : un seul chiffre par ligne, par colonne et par région.",
    emoji: "🔢",
    color: "var(--tone-rose)",
  },
  demineur: {
    slug: "demineur",
    name: "Démineur",
    tagline: "Probabilités et logique",
    description:
      "Découvrez toutes les cases sûres en vous fiant au nombre de mines voisines.",
    emoji: "💣",
    color: "var(--tone-brick)",
  },
  mastermind: {
    slug: "mastermind",
    name: "Mastermind",
    tagline: "Déduction par élimination",
    description:
      "Trouvez la combinaison secrète, guidé par les indices de chaque tentative.",
    emoji: "🎯",
    color: "var(--tone-plum)",
  },
  taquin: {
    slug: "taquin",
    name: "Taquin",
    tagline: "Planification de coups",
    description:
      "Faites glisser les tuiles pour les remettre dans l'ordre, en un minimum de mouvements.",
    emoji: "🧩",
    color: "var(--tone-teal)",
  },
  lumieres: {
    slug: "lumieres",
    name: "Éteins les lumières",
    tagline: "Algèbre cachée",
    description:
      "Chaque clic bascule une case et ses voisines. Éteignez toute la grille.",
    emoji: "💡",
    color: "var(--tone-sand)",
  },
};

export const allGames: GameMeta[] = Object.values(gameMeta);
