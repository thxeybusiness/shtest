export type SudokuDifficulty = "facile" | "moyen" | "difficile" | "expert";

export const SUDOKU_DIFFICULTIES: SudokuDifficulty[] = [
  "facile",
  "moyen",
  "difficile",
  "expert",
];

/** Nombre de chiffres laissés en place à la génération. */
const GIVENS: Record<SudokuDifficulty, number> = {
  facile: 45,
  moyen: 36,
  difficile: 30,
  expert: 26,
};

const CELLS = 81;
const ALL_DIGITS = 0x1ff;

/**
 * Pour chaque case, les 20 cases qui partagent sa ligne, sa colonne ou sa
 * région. Calculé une fois : c'est le cœur de la boucle de résolution.
 */
const PEERS: number[][] = buildPeers();

function buildPeers(): number[][] {
  const peers: number[][] = [];

  for (let index = 0; index < CELLS; index++) {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    const set = new Set<number>();

    for (let k = 0; k < 9; k++) {
      set.add(row * 9 + k);
      set.add(k * 9 + col);
      set.add((boxRow + Math.floor(k / 3)) * 9 + boxCol + (k % 3));
    }
    set.delete(index);
    peers.push([...set]);
  }

  return peers;
}

function candidateMask(board: number[], index: number): number {
  let mask = ALL_DIGITS;
  for (const peer of PEERS[index]) {
    const value = board[peer];
    if (value !== 0) mask &= ~(1 << (value - 1));
  }
  return mask;
}

function maskToDigits(mask: number): number[] {
  const digits: number[] = [];
  for (let d = 1; d <= 9; d++) {
    if (mask & (1 << (d - 1))) digits.push(d);
  }
  return digits;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Choisit la case vide ayant le moins de candidats (heuristique MRV). Renvoie
 * -1 si la grille est complète, et un masque nul si elle est bloquée.
 */
function pickCell(board: number[]): { index: number; mask: number } {
  let bestIndex = -1;
  let bestMask = 0;
  let bestCount = 10;

  for (let index = 0; index < CELLS; index++) {
    if (board[index] !== 0) continue;

    const mask = candidateMask(board, index);
    let count = 0;
    for (let m = mask; m; m &= m - 1) count++;

    if (count < bestCount) {
      bestCount = count;
      bestIndex = index;
      bestMask = mask;
      if (count <= 1) break;
    }
  }

  return { index: bestIndex, mask: bestMask };
}

/** Remplit une grille vide avec une solution complète tirée au hasard. */
function fill(board: number[]): boolean {
  const { index, mask } = pickCell(board);
  if (index === -1) return true;
  if (mask === 0) return false;

  for (const digit of shuffle(maskToDigits(mask))) {
    board[index] = digit;
    if (fill(board)) return true;
    board[index] = 0;
  }

  return false;
}

/** Compte les solutions, en s'arrêtant dès que `limit` est atteint. */
export function countSolutions(board: number[], limit = 2): number {
  const { index, mask } = pickCell(board);
  if (index === -1) return 1;
  if (mask === 0) return 0;

  let total = 0;
  for (const digit of maskToDigits(mask)) {
    board[index] = digit;
    total += countSolutions(board, limit - total);
    board[index] = 0;
    if (total >= limit) break;
  }

  return total;
}

export type SudokuPuzzle = {
  /** 81 cases, 0 pour une case à remplir. */
  puzzle: number[];
  solution: number[];
};

/**
 * Génère une grille à solution unique. On retire des chiffres tant que
 * l'unicité tient ; si la cible n'est pas atteignable, on rend la grille la
 * plus dépouillée trouvée — elle reste valide.
 */
export function generateSudoku(difficulty: SudokuDifficulty): SudokuPuzzle {
  const solution = new Array<number>(CELLS).fill(0);
  fill(solution);

  const puzzle = [...solution];
  const target = GIVENS[difficulty];
  let givens = CELLS;

  for (const index of shuffle([...Array(CELLS).keys()])) {
    if (givens <= target) break;

    const saved = puzzle[index];
    puzzle[index] = 0;
    if (countSolutions([...puzzle], 2) === 1) {
      givens--;
    } else {
      puzzle[index] = saved;
    }
  }

  return { puzzle, solution };
}

/** Cases en conflit avec une autre valeur de la même ligne, colonne ou région. */
export function findConflicts(board: number[]): Set<number> {
  const conflicts = new Set<number>();

  for (let index = 0; index < CELLS; index++) {
    const value = board[index];
    if (value === 0) continue;

    for (const peer of PEERS[index]) {
      if (board[peer] === value) {
        conflicts.add(index);
        conflicts.add(peer);
      }
    }
  }

  return conflicts;
}

export function isComplete(board: number[]): boolean {
  return board.every((value) => value !== 0) && findConflicts(board).size === 0;
}
