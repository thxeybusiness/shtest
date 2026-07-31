export type MinesweeperLevel = "facile" | "moyen" | "difficile";

export const MINESWEEPER_LEVELS: MinesweeperLevel[] = [
  "facile",
  "moyen",
  "difficile",
];

export const MINESWEEPER_CONFIG: Record<
  MinesweeperLevel,
  { rows: number; cols: number; mines: number }
> = {
  facile: { rows: 9, cols: 9, mines: 10 },
  moyen: { rows: 16, cols: 16, mines: 40 },
  difficile: { rows: 16, cols: 30, mines: 99 },
};

export type Cell = {
  mine: boolean;
  adjacent: number;
  revealed: boolean;
  flagged: boolean;
};

export function createBoard(rows: number, cols: number): Cell[] {
  return Array.from({ length: rows * cols }, () => ({
    mine: false,
    adjacent: 0,
    revealed: false,
    flagged: false,
  }));
}

export function neighbors(index: number, rows: number, cols: number): number[] {
  const row = Math.floor(index / cols);
  const col = index % cols;
  const result: number[] = [];

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr;
      const c = col + dc;
      if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
      result.push(r * cols + c);
    }
  }

  return result;
}

/**
 * Place les mines après le premier clic, en épargnant la case cliquée et ses
 * voisines : la première ouverture dégage donc toujours une zone.
 */
export function placeMines(
  rows: number,
  cols: number,
  mines: number,
  safeIndex: number,
): Cell[] {
  const board = createBoard(rows, cols);
  const forbidden = new Set([safeIndex, ...neighbors(safeIndex, rows, cols)]);
  const candidates = board
    .map((_, index) => index)
    .filter((index) => !forbidden.has(index));

  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  for (const index of candidates.slice(0, mines)) {
    board[index].mine = true;
  }

  for (let index = 0; index < board.length; index++) {
    board[index].adjacent = neighbors(index, rows, cols).filter(
      (peer) => board[peer].mine,
    ).length;
  }

  return board;
}

/**
 * Ouvre une case, en propageant l'ouverture aux zones vides. Renvoie une
 * nouvelle grille et indique si une mine a sauté.
 */
export function reveal(
  board: Cell[],
  index: number,
  rows: number,
  cols: number,
): { board: Cell[]; exploded: boolean } {
  if (board[index].revealed || board[index].flagged) {
    return { board, exploded: false };
  }

  const next = board.map((cell) => ({ ...cell }));

  if (next[index].mine) {
    for (const cell of next) {
      if (cell.mine) cell.revealed = true;
    }
    return { board: next, exploded: true };
  }

  const stack = [index];
  while (stack.length > 0) {
    const current = stack.pop()!;
    const cell = next[current];
    if (cell.revealed || cell.flagged) continue;

    cell.revealed = true;
    if (cell.adjacent === 0) {
      stack.push(...neighbors(current, rows, cols));
    }
  }

  return { board: next, exploded: false };
}

/** Gagné dès que toutes les cases sans mine sont ouvertes. */
export function isWon(board: Cell[]): boolean {
  return board.every((cell) => cell.mine || cell.revealed);
}
