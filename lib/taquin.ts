export type TaquinSize = 3 | 4 | 5;

export const TAQUIN_SIZES: TaquinSize[] = [3, 4, 5];

/** Mêmes tailles sous forme de chaînes, pour les contrôles d'interface. */
export const TAQUIN_SIZE_OPTIONS = ["3", "4", "5"] as const;

export type TaquinSizeOption = (typeof TAQUIN_SIZE_OPTIONS)[number];

/** La case vide est représentée par 0 et doit finir en dernière position. */
export function solvedTiles(size: number): number[] {
  return Array.from({ length: size * size }, (_, i) =>
    i === size * size - 1 ? 0 : i + 1,
  );
}

export function blankIndex(tiles: number[]): number {
  return tiles.indexOf(0);
}

/** Positions depuis lesquelles une tuile peut glisser dans la case vide. */
export function movableIndexes(tiles: number[], size: number): number[] {
  const blank = blankIndex(tiles);
  const row = Math.floor(blank / size);
  const col = blank % size;
  const moves: number[] = [];

  if (row > 0) moves.push(blank - size);
  if (row < size - 1) moves.push(blank + size);
  if (col > 0) moves.push(blank - 1);
  if (col < size - 1) moves.push(blank + 1);

  return moves;
}

export function slide(tiles: number[], index: number, size: number): number[] {
  if (!movableIndexes(tiles, size).includes(index)) return tiles;

  const next = [...tiles];
  const blank = blankIndex(tiles);
  next[blank] = next[index];
  next[index] = 0;
  return next;
}

/**
 * Mélange en enchaînant des coups légaux depuis la position résolue : le
 * taquin obtenu est donc toujours résoluble. On évite d'annuler le coup
 * précédent pour ne pas tourner en rond.
 */
export function shuffleTiles(size: number, moves = 200): number[] {
  let tiles = solvedTiles(size);
  let previousBlank = -1;

  for (let i = 0; i < moves; i++) {
    const blank = blankIndex(tiles);
    const options = movableIndexes(tiles, size).filter(
      (index) => index !== previousBlank,
    );
    const choice = options[Math.floor(Math.random() * options.length)];
    previousBlank = blank;
    tiles = slide(tiles, choice, size);
  }

  return tiles;
}

export function isSolved(tiles: number[], size: number): boolean {
  const target = solvedTiles(size);
  return tiles.every((tile, index) => tile === target[index]);
}
