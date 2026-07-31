export type Game = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** Emoji d'illustration, suffisant tant qu'on n'a pas d'icônes dédiées. */
  emoji: string;
  /** Couleur fluo d'accent, référencée depuis la feuille de style. */
  neon: string;
};

export const games: Game[] = [
  {
    slug: "cascade",
    name: "Cascade",
    tagline: "Logique en temps réel",
    description:
      "Les blocs descendent sans arrêt : cliquez ceux qui vérifient la règle avant qu'ils ne sortent.",
    emoji: "⚡",
    neon: "var(--neon-cyan)",
  },
  {
    slug: "sudoku",
    name: "Sudoku",
    tagline: "Déduction pure",
    description:
      "Remplissez la grille 9×9 : un seul chiffre par ligne, par colonne et par région.",
    emoji: "🔢",
    neon: "var(--neon-magenta)",
  },
  {
    slug: "demineur",
    name: "Démineur",
    tagline: "Probabilités et logique",
    description:
      "Découvrez toutes les cases sûres en vous fiant au nombre de mines voisines.",
    emoji: "💣",
    neon: "var(--neon-rose)",
  },
  {
    slug: "mastermind",
    name: "Mastermind",
    tagline: "Déduction par élimination",
    description:
      "Trouvez la combinaison secrète en dix essais, guidé par les indices de chaque tentative.",
    emoji: "🎯",
    neon: "var(--neon-violet)",
  },
  {
    slug: "taquin",
    name: "Taquin",
    tagline: "Planification de coups",
    description:
      "Faites glisser les tuiles pour les remettre dans l'ordre, en un minimum de mouvements.",
    emoji: "🧩",
    neon: "var(--neon-green)",
  },
  {
    slug: "lumieres",
    name: "Éteins les lumières",
    tagline: "Algèbre cachée",
    description:
      "Chaque clic bascule une case et ses voisines. Éteignez toute la grille.",
    emoji: "💡",
    neon: "var(--neon-yellow)",
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
