export type LightsSize = 3 | 4 | 5 | 6;

export const LIGHTS_SIZES: LightsSize[] = [3, 4, 5, 6];

/** Mêmes tailles sous forme de chaînes, pour les contrôles d'interface. */
export const LIGHTS_SIZE_OPTIONS = ["3", "4", "5", "6"] as const;

export type LightsSizeOption = (typeof LIGHTS_SIZE_OPTIONS)[number];

/** Bascule la case visée et ses quatre voisines orthogonales. */
export function toggle(
  grid: boolean[],
  index: number,
  size: number,
): boolean[] {
  const next = [...grid];
  const row = Math.floor(index / size);
  const col = index % size;

  const targets = [
    [row, col],
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ];

  for (const [r, c] of targets) {
    if (r < 0 || r >= size || c < 0 || c >= size) continue;
    next[r * size + c] = !next[r * size + c];
  }

  return next;
}

/**
 * Part de la grille éteinte et applique des clics au hasard : toute grille
 * ainsi obtenue est résoluble (les clics sont leur propre inverse).
 */
export function shuffleLights(size: number): boolean[] {
  let grid = Array.from({ length: size * size }, () => false);
  const clicks = size * size;

  for (let i = 0; i < clicks; i++) {
    grid = toggle(grid, Math.floor(Math.random() * size * size), size);
  }

  // Une grille déjà éteinte ne ferait pas une partie : on relance.
  return grid.every((on) => !on) ? shuffleLights(size) : grid;
}

export function isDark(grid: boolean[]): boolean {
  return grid.every((on) => !on);
}
