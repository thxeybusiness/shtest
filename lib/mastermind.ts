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

/**
 * Palette des pions, dans l'ordre des index de couleur. La valeur CSS sert
 * de fond ; le contour reprend la même teinte.
 */
export const MASTERMIND_COLORS = [
  { name: "cyan", css: "var(--tone-slate)" },
  { name: "magenta", css: "var(--tone-rose)" },
  { name: "vert", css: "var(--tone-teal)" },
  { name: "jaune", css: "var(--tone-sand)" },
  { name: "violet", css: "var(--tone-plum)" },
  { name: "orange", css: "var(--tone-clay)" },
  { name: "rose", css: "var(--tone-brick)" },
  { name: "citron", css: "var(--tone-sage)" },
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
