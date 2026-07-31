import type { LightsSize } from "./lights";
import type { MastermindLevel } from "./mastermind";
import type { MinesweeperLevel } from "./minesweeper";
import type { SudokuDifficulty } from "./sudoku";
import type { TaquinSize } from "./taquin";
import { formatDuration } from "./format";

/**
 * La campagne : une suite de niveaux qui réutilisent les six mécaniques du
 * site. Chaque niveau fige la configuration de sa mécanique et y ajoute un
 * objectif chiffré, noté de 0 à 3 étoiles.
 */

export type GameSlug =
  | "cascade"
  | "sudoku"
  | "demineur"
  | "mastermind"
  | "taquin"
  | "lumieres";

export type LevelConfig =
  | { game: "cascade"; speed: number }
  | { game: "sudoku"; difficulty: SudokuDifficulty }
  | { game: "demineur"; level: MinesweeperLevel }
  | { game: "mastermind"; level: MastermindLevel }
  | { game: "taquin"; size: TaquinSize }
  | { game: "lumieres"; size: LightsSize };

/**
 * `time` et `moves` se jouent à la baisse, `score` à la hausse. Les trois
 * seuils donnent respectivement 1, 2 et 3 étoiles.
 */
export type Objective = {
  metric: "time" | "moves" | "score";
  /** Nom de l'unité pour `moves` (« coups », « essais »…). */
  noun?: string;
  pass: number;
  good: number;
  perfect: number;
};

export type Level = {
  id: number;
  chapter: number;
  title: string;
  config: LevelConfig;
  objective: Objective;
};

export type Chapter = {
  id: number;
  name: string;
  subtitle: string;
  neon: string;
};

/**
 * Signalement de fin de partie d'une mécanique vers le niveau qui l'héberge.
 * `value` est la métrique mesurée, `won` dit si l'objectif était atteignable
 * (grille résolue, code trouvé) — un échec ne rapporte aucune étoile.
 */
export type LevelReport = (value: number, won: boolean) => void;

export const chapters: Chapter[] = [
  {
    id: 1,
    name: "Initiation",
    subtitle: "Les six mécaniques, une par une",
    neon: "var(--neon-cyan)",
  },
  {
    id: 2,
    name: "Déduction",
    subtitle: "Les grilles s'agrandissent",
    neon: "var(--neon-green)",
  },
  {
    id: 3,
    name: "Sous pression",
    subtitle: "Le chrono et les coups se resserrent",
    neon: "var(--neon-yellow)",
  },
  {
    id: 4,
    name: "Maîtrise",
    subtitle: "Les configurations les plus larges",
    neon: "var(--neon-magenta)",
  },
  {
    id: 5,
    name: "Épreuve finale",
    subtitle: "Tout ce que le site sait faire",
    neon: "var(--neon-rose)",
  },
];

const minutes = (value: number) => value * 60_000;

export const levels: Level[] = [
  // ── Chapitre 1 — Initiation ───────────────────────────────────────────────
  {
    id: 1,
    chapter: 1,
    title: "Premiers glissements",
    config: { game: "taquin", size: 3 },
    objective: { metric: "moves", noun: "coups", pass: 150, good: 70, perfect: 40 },
  },
  {
    id: 2,
    chapter: 1,
    title: "Extinction des feux",
    config: { game: "lumieres", size: 3 },
    objective: { metric: "moves", noun: "coups", pass: 40, good: 20, perfect: 12 },
  },
  {
    id: 3,
    chapter: 1,
    title: "Le flux commence",
    config: { game: "cascade", speed: 0.85 },
    objective: { metric: "score", pass: 80, good: 180, perfect: 300 },
  },
  {
    id: 4,
    chapter: 1,
    title: "Neuf par neuf",
    config: { game: "sudoku", difficulty: "facile" },
    objective: { metric: "time", pass: minutes(20), good: minutes(9), perfect: minutes(5) },
  },
  {
    id: 5,
    chapter: 1,
    title: "Terrain dégagé",
    config: { game: "demineur", level: "facile" },
    objective: { metric: "time", pass: minutes(6), good: minutes(2), perfect: 60_000 },
  },
  {
    id: 6,
    chapter: 1,
    title: "Le code à quatre pions",
    config: { game: "mastermind", level: "facile" },
    objective: { metric: "moves", noun: "essais", pass: 12, good: 8, perfect: 5 },
  },

  // ── Chapitre 2 — Déduction ────────────────────────────────────────────────
  {
    id: 7,
    chapter: 2,
    title: "Grille resserrée",
    config: { game: "sudoku", difficulty: "moyen" },
    objective: { metric: "time", pass: minutes(25), good: minutes(12), perfect: minutes(7) },
  },
  {
    id: 8,
    chapter: 2,
    title: "Quatre par quatre",
    config: { game: "lumieres", size: 4 },
    objective: { metric: "moves", noun: "coups", pass: 60, good: 30, perfect: 18 },
  },
  {
    id: 9,
    chapter: 2,
    title: "Huit couleurs",
    config: { game: "mastermind", level: "moyen" },
    objective: { metric: "moves", noun: "essais", pass: 10, good: 7, perfect: 5 },
  },
  {
    id: 10,
    chapter: 2,
    title: "Quinze tuiles",
    config: { game: "taquin", size: 4 },
    objective: { metric: "moves", noun: "coups", pass: 400, good: 200, perfect: 120 },
  },
  {
    id: 11,
    chapter: 2,
    title: "Champ de mines",
    config: { game: "demineur", level: "moyen" },
    objective: { metric: "time", pass: minutes(15), good: minutes(6), perfect: minutes(3) },
  },
  {
    id: 12,
    chapter: 2,
    title: "Le flux accélère",
    config: { game: "cascade", speed: 1.15 },
    objective: { metric: "score", pass: 150, good: 300, perfect: 480 },
  },

  // ── Chapitre 3 — Sous pression ────────────────────────────────────────────
  {
    id: 13,
    chapter: 3,
    title: "Cadence soutenue",
    config: { game: "cascade", speed: 1.3 },
    objective: { metric: "score", pass: 250, good: 450, perfect: 700 },
  },
  {
    id: 14,
    chapter: 3,
    title: "Déminage express",
    config: { game: "demineur", level: "moyen" },
    objective: { metric: "time", pass: minutes(8), good: minutes(4), perfect: minutes(2) },
  },
  {
    id: 15,
    chapter: 3,
    title: "Sudoku au chrono",
    config: { game: "sudoku", difficulty: "moyen" },
    objective: { metric: "time", pass: minutes(12), good: minutes(7), perfect: minutes(4) },
  },
  {
    id: 16,
    chapter: 3,
    title: "Économie de coups",
    config: { game: "taquin", size: 4 },
    objective: { metric: "moves", noun: "coups", pass: 220, good: 130, perfect: 85 },
  },
  {
    id: 17,
    chapter: 3,
    title: "Vingt-cinq lampes",
    config: { game: "lumieres", size: 5 },
    objective: { metric: "moves", noun: "coups", pass: 90, good: 45, perfect: 25 },
  },
  {
    id: 18,
    chapter: 3,
    title: "Sept essais",
    config: { game: "mastermind", level: "moyen" },
    objective: { metric: "moves", noun: "essais", pass: 7, good: 6, perfect: 4 },
  },

  // ── Chapitre 4 — Maîtrise ─────────────────────────────────────────────────
  {
    id: 19,
    chapter: 4,
    title: "Sudoku difficile",
    config: { game: "sudoku", difficulty: "difficile" },
    objective: { metric: "time", pass: minutes(30), good: minutes(15), perfect: minutes(9) },
  },
  {
    id: 20,
    chapter: 4,
    title: "Vingt-quatre tuiles",
    config: { game: "taquin", size: 5 },
    objective: { metric: "moves", noun: "coups", pass: 800, good: 420, perfect: 260 },
  },
  {
    id: 21,
    chapter: 4,
    title: "Quatre-vingt-dix-neuf mines",
    config: { game: "demineur", level: "difficile" },
    objective: { metric: "time", pass: minutes(30), good: minutes(14), perfect: minutes(8) },
  },
  {
    id: 22,
    chapter: 4,
    title: "Lumières minimales",
    config: { game: "lumieres", size: 5 },
    objective: { metric: "moves", noun: "coups", pass: 50, good: 30, perfect: 18 },
  },
  {
    id: 23,
    chapter: 4,
    title: "Cinq pions",
    config: { game: "mastermind", level: "difficile" },
    objective: { metric: "moves", noun: "essais", pass: 10, good: 7, perfect: 5 },
  },
  {
    id: 24,
    chapter: 4,
    title: "Flux tendu",
    config: { game: "cascade", speed: 1.5 },
    objective: { metric: "score", pass: 350, good: 600, perfect: 900 },
  },

  // ── Chapitre 5 — Épreuve finale ───────────────────────────────────────────
  {
    id: 25,
    chapter: 5,
    title: "Sudoku expert",
    config: { game: "sudoku", difficulty: "expert" },
    objective: { metric: "time", pass: minutes(45), good: minutes(22), perfect: minutes(13) },
  },
  {
    id: 26,
    chapter: 5,
    title: "Déminage intégral",
    config: { game: "demineur", level: "difficile" },
    objective: { metric: "time", pass: minutes(18), good: minutes(10), perfect: minutes(6) },
  },
  {
    id: 27,
    chapter: 5,
    title: "Taquin maîtrisé",
    config: { game: "taquin", size: 5 },
    objective: { metric: "moves", noun: "coups", pass: 450, good: 280, perfect: 180 },
  },
  {
    id: 28,
    chapter: 5,
    title: "Trente-six lampes",
    config: { game: "lumieres", size: 6 },
    objective: { metric: "moves", noun: "coups", pass: 120, good: 65, perfect: 38 },
  },
  {
    id: 29,
    chapter: 5,
    title: "Code impitoyable",
    config: { game: "mastermind", level: "difficile" },
    objective: { metric: "moves", noun: "essais", pass: 7, good: 6, perfect: 4 },
  },
  {
    id: 30,
    chapter: 5,
    title: "Cascade finale",
    config: { game: "cascade", speed: 1.8 },
    objective: { metric: "score", pass: 500, good: 850, perfect: 1300 },
  },
];

export const TOTAL_LEVELS = levels.length;
export const TOTAL_STARS = levels.length * 3;

export function getLevel(id: number): Level | undefined {
  return levels.find((level) => level.id === id);
}

export function levelsOfChapter(chapterId: number): Level[] {
  return levels.filter((level) => level.chapter === chapterId);
}

/** Vrai quand la métrique se joue à la baisse (temps, coups). */
export function isLowerBetter(objective: Objective): boolean {
  return objective.metric !== "score";
}

/**
 * Note un résultat de 0 à 3 étoiles. Un niveau perdu (grille non résolue,
 * code non trouvé) ne rapporte rien, quelle que soit la valeur mesurée.
 */
export function starsFor(
  objective: Objective,
  value: number,
  won: boolean,
): number {
  if (!won) return 0;

  if (isLowerBetter(objective)) {
    if (value <= objective.perfect) return 3;
    if (value <= objective.good) return 2;
    if (value <= objective.pass) return 1;
    return 0;
  }

  if (value >= objective.perfect) return 3;
  if (value >= objective.good) return 2;
  if (value >= objective.pass) return 1;
  return 0;
}

/** Met en forme une valeur selon la métrique du niveau. */
export function formatValue(objective: Objective, value: number): string {
  switch (objective.metric) {
    case "time":
      return formatDuration(value);
    case "score":
      return `${value} pts`;
    default:
      return `${value} ${objective.noun ?? "coups"}`;
  }
}

/** Phrase d'objectif affichée au-dessus de l'aire de jeu. */
export function objectiveLabel(objective: Objective): string {
  const target = formatValue(objective, objective.pass);
  return isLowerBetter(objective)
    ? `Terminer en ${target} ou moins`
    : `Atteindre ${target}`;
}

/** Les trois paliers, pour l'affichage du barème. */
export function starThresholds(
  objective: Objective,
): { stars: number; label: string }[] {
  return [
    { stars: 1, label: formatValue(objective, objective.pass) },
    { stars: 2, label: formatValue(objective, objective.good) },
    { stars: 3, label: formatValue(objective, objective.perfect) },
  ];
}
