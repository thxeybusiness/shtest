export type MastermindLevel = "facile" | "moyen" | "difficile";

export const MASTERMIND_LEVELS: MastermindLevel[] = [
  "facile",
  "moyen",
  "difficile",
];

export const MASTERMIND_CONFIG: Record<
  MastermindLevel,
  { length: number; colors: number; tries: number }
> = {
  facile: { length: 4, colors: 6, tries: 12 },
  moyen: { length: 4, colors: 8, tries: 10 },
  difficile: { length: 5, colors: 8, tries: 10 },
};

/** Palette des pions, dans l'ordre des index de couleur. */
export const MASTERMIND_COLORS = [
  { name: "rouge", className: "bg-red-500" },
  { name: "bleu", className: "bg-blue-500" },
  { name: "vert", className: "bg-emerald-500" },
  { name: "jaune", className: "bg-amber-400" },
  { name: "violet", className: "bg-purple-500" },
  { name: "orange", className: "bg-orange-500" },
  { name: "rose", className: "bg-pink-500" },
  { name: "cyan", className: "bg-cyan-400" },
];

export type Score = {
  /** Bonne couleur, bonne position. */
  exact: number;
  /** Bonne couleur, mauvaise position. */
  partial: number;
};

export function randomSecret(length: number, colors: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * colors));
}

/**
 * Compare une proposition au code secret. Les doublons ne sont comptés qu'une
 * fois : un pion déjà apparié ne peut plus servir à un autre indice.
 */
export function scoreGuess(guess: number[], secret: number[]): Score {
  let exact = 0;
  const secretLeft = new Map<number, number>();
  const guessLeft = new Map<number, number>();

  guess.forEach((color, index) => {
    if (color === secret[index]) {
      exact++;
      return;
    }
    secretLeft.set(secret[index], (secretLeft.get(secret[index]) ?? 0) + 1);
    guessLeft.set(color, (guessLeft.get(color) ?? 0) + 1);
  });

  let partial = 0;
  for (const [color, count] of guessLeft) {
    partial += Math.min(count, secretLeft.get(color) ?? 0);
  }

  return { exact, partial };
}
