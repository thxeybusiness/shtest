"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Banner, Button, SegmentedControl, Stat } from "@/components/ui";
import type { LevelReport } from "@/lib/campaign";
import { cn } from "@/lib/cn";
import { formatDuration } from "@/lib/format";
import { useBestScore, useTimer } from "@/lib/hooks";
import {
  MINESWEEPER_CONFIG,
  MINESWEEPER_LEVELS,
  type Cell,
  type MinesweeperLevel,
  createBoard,
  isWon,
  placeMines,
  reveal,
} from "@/lib/minesweeper";

type Status = "prêt" | "en cours" | "gagné" | "perdu";

/** Couleur fluo du chiffre selon le nombre de mines voisines. */
const ADJACENT_COLORS = [
  "",
  "text-neon-ice",
  "text-neon-mint",
  "text-neon-blood",
  "text-neon-violet",
  "text-neon-gold",
  "text-neon-fuchsia",
  "text-neon-ember",
  "text-white",
];

export function MinesweeperGame({
  fixedLevel,
  onProgress,
  onFinish,
}: {
  /** Niveau imposé par un niveau de campagne. */
  fixedLevel?: MinesweeperLevel;
  onFinish?: LevelReport;
  /** Rapporte en continu la métrique suivie par le niveau. */
  onProgress?: (value: number) => void;
} = {}) {
  const [chosenLevel, setLevel] = useState<MinesweeperLevel>("facile");
  const level = fixedLevel ?? chosenLevel;
  const { rows, cols, mines } = MINESWEEPER_CONFIG[level];

  const [board, setBoard] = useState<Cell[]>(() => createBoard(rows, cols));
  const [status, setStatus] = useState<Status>("prêt");
  const [flagMode, setFlagMode] = useState(false);

  const { elapsed, reset: resetTimer } = useTimer(status === "en cours");
  const { best, submit } = useBestScore(`demineur:${level}`);

  const newGame = useCallback(() => {
    setBoard(createBoard(rows, cols));
    setStatus("prêt");
    resetTimer();
  }, [cols, resetTimer, rows]);

  // Grille posée après l'hydratation : le tirage des mines est aléatoire et ne
  // peut pas être reproduit à l'identique par le rendu serveur.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    newGame();
  }, [newGame]);

  useEffect(() => {
    if (status === "gagné") {
      submit(elapsed);
      onFinish?.(elapsed, true);
    } else if (status === "perdu") {
      onFinish?.(elapsed, false);
    }
    // Seules les transitions vers une fin de partie nous intéressent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Le niveau consomme du temps : il le suit pour vider sa réserve.
  useEffect(() => {
    onProgress?.(elapsed);
  }, [elapsed, onProgress]);

  const flagged = useMemo(
    () => board.filter((cell) => cell.flagged).length,
    [board],
  );

  const openCell = useCallback(
    (index: number) => {
      if (status === "gagné" || status === "perdu") return;
      if (board[index].flagged) return;

      // La première ouverture place les mines : elle ne peut jamais perdre.
      const playable =
        status === "prêt" ? placeMines(rows, cols, mines, index) : board;
      if (status === "prêt") setStatus("en cours");

      const result = reveal(playable, index, rows, cols);
      setBoard(result.board);

      if (result.exploded) setStatus("perdu");
      else if (isWon(result.board)) setStatus("gagné");
    },
    [board, cols, mines, rows, status],
  );

  const toggleFlag = useCallback(
    (index: number) => {
      if (status === "gagné" || status === "perdu") return;
      if (board[index].revealed) return;

      setBoard((previous) =>
        previous.map((cell, i) =>
          i === index ? { ...cell, flagged: !cell.flagged } : cell,
        ),
      );
    },
    [board, status],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        {fixedLevel === undefined && (
          <SegmentedControl
            label="Niveau"
            options={MINESWEEPER_LEVELS}
            value={level}
            onChange={setLevel}
          />
        )}
        <Button variant="primary" onClick={newGame}>
          Nouvelle partie
        </Button>
        <Button
          variant={flagMode ? "primary" : "secondary"}
          onClick={() => setFlagMode((mode) => !mode)}
          aria-pressed={flagMode}
        >
          🚩 Mode drapeau
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Stat label="Temps" value={formatDuration(elapsed)} />
        <Stat label="Mines" value={`${flagged} / ${mines}`} />
        <Stat
          label="Record"
          value={best === null ? "—" : formatDuration(best)}
        />
      </div>

      {status === "gagné" && (
        <Banner tone="good">
          Terrain déminé en {formatDuration(elapsed)}.
        </Banner>
      )}
      {status === "perdu" && (
        <Banner tone="bad">Mine touchée — la partie est terminée.</Banner>
      )}

      <div className="-mx-5 overflow-x-auto px-5">
        <div
          className="no-select mx-auto grid w-fit gap-px rounded-lg border border-border bg-border p-px"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => (flagMode ? toggleFlag(index) : openCell(index))}
              onContextMenu={(event) => {
                event.preventDefault();
                toggleFlag(index);
              }}
              aria-label={`Case ${Math.floor(index / cols) + 1}-${(index % cols) + 1}`}
              className={cn(
                "flex h-7 w-7 cursor-pointer items-center justify-center text-sm font-bold transition sm:h-8 sm:w-8",
                // Les cases fermées restent en relief, les ouvertes s'aplatissent.
                cell.revealed
                  ? cell.mine
                    ? "bg-bad/30"
                    : "bg-bg"
                  : "bg-surface-2 hover:bg-border",
                cell.revealed &&
                  !cell.mine &&
                  cell.adjacent > 0 &&
                  `glow-text ${ADJACENT_COLORS[cell.adjacent]}`,
              )}
            >
              {cell.revealed
                ? cell.mine
                  ? "💣"
                  : cell.adjacent > 0
                    ? cell.adjacent
                    : ""
                : cell.flagged
                  ? "🚩"
                  : ""}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-muted">
        Clic droit pour poser un drapeau — ou activez le mode drapeau sur
        mobile.
      </p>
    </div>
  );
}
