export type Game = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** Emoji d'illustration, suffisant tant qu'on n'a pas d'icônes dédiées. */
  emoji: string;
};

export const games: Game[] = [
  {
    slug: "sudoku",
    name: "Sudoku",
    tagline: "Déduction pure",
    description:
      "Remplissez la grille 9×9 : un seul chiffre par ligne, par colonne et par région.",
    emoji: "🔢",
  },
  {
    slug: "demineur",
    name: "Démineur",
    tagline: "Probabilités et logique",
    description:
      "Découvrez toutes les cases sûres en vous fiant au nombre de mines voisines.",
    emoji: "💣",
  },
  {
    slug: "mastermind",
    name: "Mastermind",
    tagline: "Déduction par élimination",
    description:
      "Trouvez la combinaison secrète en dix essais, guidé par les indices de chaque tentative.",
    emoji: "🎯",
  },
  {
    slug: "taquin",
    name: "Taquin",
    tagline: "Planification de coups",
    description:
      "Faites glisser les tuiles pour les remettre dans l'ordre, en un minimum de mouvements.",
    emoji: "🧩",
  },
  {
    slug: "lumieres",
    name: "Éteins les lumières",
    tagline: "Algèbre cachée",
    description:
      "Chaque clic bascule une case et ses voisines. Éteignez toute la grille.",
    emoji: "💡",
  },
];

export function getGame(slug: string): Game | undefined {
  return games.find((game) => game.slug === slug);
}

/** Variante pour les pages, où l'absence du jeu est un bug de build. */
export function requireGame(slug: string): Game {
  const game = getGame(slug);
  if (!game) throw new Error(`Jeu inconnu : ${slug}`);
  return game;
}
