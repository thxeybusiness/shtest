"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Banner, Button, SegmentedControl, Stat } from "@/components/ui";
import type { LevelReport } from "@/lib/campaign";
import { cn } from "@/lib/cn";
import { formatDuration } from "@/lib/format";
import { useBestScore, useTimer } from "@/lib/hooks";
import {
  SUDOKU_DIFFICULTIES,
  type SudokuDifficulty,
  findConflicts,
  generateSudoku,
} from "@/lib/sudoku";

type Puzzle = {
  givens: number[];
  solution: number[];
};

export function SudokuGame({
  fixedDifficulty,
  onProgress,
  onFinish,
}: {
  /** Difficulté imposée par un niveau de campagne. */
  fixedDifficulty?: SudokuDifficulty;
  onFinish?: LevelReport;
  /** Rapporte en continu la métrique suivie par le niveau. */
  onProgress?: (value: number) => void;
} = {}) {
  const [chosenDifficulty, setDifficulty] =
    useState<SudokuDifficulty>("moyen");
  const difficulty = fixedDifficulty ?? chosenDifficulty;
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [values, setValues] = useState<number[]>([]);
  const [notes, setNotes] = useState<Set<number>[]>([]);
  const [noteMode, setNoteMode] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [hints, setHints] = useState(0);
  const [seed, setSeed] = useState(0);

  const solved = useMemo(
    () =>
      puzzle !== null &&
      values.length === 81 &&
      values.every((value, index) => value === puzzle.solution[index]),
    [puzzle, values],
  );

  const { elapsed, reset: resetTimer } = useTimer(puzzle !== null && !solved);
  const { best, submit } = useBestScore(`sudoku:${difficulty}`);

  // La génération est aléatoire : elle ne peut pas avoir lieu au rendu serveur
  // sans provoquer une différence d'hydratation. Elle est aussi bloquante
  // (~10-200 ms selon la difficulté), d'où le report après le rendu pour que
  // l'état « Génération… » s'affiche.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPuzzle(null);
    setSelected(null);
    setHints(0);

    const id = window.setTimeout(() => {
      const generated = generateSudoku(difficulty);
      setPuzzle({ givens: generated.puzzle, solution: generated.solution });
      setValues([...generated.puzzle]);
      setNotes(Array.from({ length: 81 }, () => new Set<number>()));
      resetTimer();
    }, 0);

    return () => window.clearTimeout(id);
  }, [difficulty, seed, resetTimer]);

  useEffect(() => {
    if (!solved) return;
    submit(elapsed);
    onFinish?.(elapsed, true);
    // On ne veut enregistrer qu'à la transition vers « résolu ».
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved]);

  // Le niveau consomme du temps : il le suit pour vider sa réserve.
  useEffect(() => {
    onProgress?.(elapsed);
  }, [elapsed, onProgress]);

  const conflicts = useMemo(() => findConflicts(values), [values]);

  const setCell = useCallback(
    (index: number, digit: number) => {
      if (!puzzle || puzzle.givens[index] !== 0 || solved) return;

      if (noteMode && digit !== 0) {
        setNotes((previous) => {
          const next = [...previous];
          const cell = new Set(next[index]);
          if (cell.has(digit)) cell.delete(digit);
          else cell.add(digit);
          next[index] = cell;
          return next;
        });
        return;
      }

      setValues((previous) => {
        const next = [...previous];
        next[index] = next[index] === digit ? 0 : digit;
        return next;
      });
      setNotes((previous) => {
        const next = [...previous];
        next[index] = new Set();
        return next;
      });
    },
    [noteMode, puzzle, solved],
  );

  const revealSelected = useCallback(() => {
    if (!puzzle || selected === null || puzzle.givens[selected] !== 0) return;

    setValues((previous) => {
      const next = [...previous];
      next[selected] = puzzle.solution[selected];
      return next;
    });
    setHints((count) => count + 1);
  }, [puzzle, selected]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (selected === null) return;

      if (event.key >= "1" && event.key <= "9") {
        setCell(selected, Number(event.key));
        event.preventDefault();
        return;
      }
      if (["Backspace", "Delete", "0"].includes(event.key)) {
        setCell(selected, 0);
        event.preventDefault();
        return;
      }

      const moves: Record<string, number> = {
        ArrowUp: -9,
        ArrowDown: 9,
        ArrowLeft: -1,
        ArrowRight: 1,
      };
      const delta = moves[event.key];
      if (delta === undefined) return;

      const target = selected + delta;
      // Les flèches horizontales ne doivent pas sauter d'une ligne à l'autre.
      const sameRow = Math.floor(target / 9) === Math.floor(selected / 9);
      if (target < 0 || target > 80) return;
      if (Math.abs(delta) === 1 && !sameRow) return;

      setSelected(target);
      event.preventDefault();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected, setCell]);

  const remaining = values.filter((value) => value === 0).length;
  const selectedValue = selected === null ? 0 : values[selected];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        {fixedDifficulty === undefined && (
          <SegmentedControl
            label="Difficulté"
            options={SUDOKU_DIFFICULTIES}
            value={difficulty}
            onChange={setDifficulty}
          />
        )}
        <Button variant="primary" onClick={() => setSeed((n) => n + 1)}>
          Nouvelle grille
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Stat label="Temps" value={formatDuration(elapsed)} />
        <Stat label="Restantes" value={remaining} />
        <Stat label="Indices" value={hints} />
        <Stat
          label="Record"
          value={best === null ? "—" : formatDuration(best)}
        />
      </div>

      {solved && (
        <Banner tone="good">
          Grille résolue en {formatDuration(elapsed)}
          {hints > 0 && ` (${hints} indice${hints > 1 ? "s" : ""})`}.
        </Banner>
      )}

      {puzzle === null ? (
        <p className="py-20 text-center text-sm text-muted">
          Génération de la grille…
        </p>
      ) : (
        <div className="no-select grid w-full max-w-lg grid-cols-9 self-center overflow-hidden rounded-lg border-2 border-neon-ice/35">
          {values.map((value, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            const isGiven = puzzle.givens[index] !== 0;
            const isSelected = selected === index;
            const isPeer =
              selected !== null &&
              !isSelected &&
              (Math.floor(selected / 9) === row ||
                selected % 9 === col ||
                (Math.floor(Math.floor(selected / 9) / 3) ===
                  Math.floor(row / 3) &&
                  Math.floor((selected % 9) / 3) === Math.floor(col / 3)));
            const isTwin =
              value !== 0 && value === selectedValue && !isSelected;

            return (
              <button
                key={index}
                onClick={() => setSelected(index)}
                aria-label={`Ligne ${row + 1}, colonne ${col + 1}`}
                className={cn(
                  "relative flex aspect-square cursor-pointer items-center justify-center border border-border text-lg transition",
                  col % 3 === 0 && col !== 0 && "border-l-2 border-l-neon-ice/35",
                  row % 3 === 0 && row !== 0 && "border-t-2 border-t-neon-ice/35",
                  // Les chiffres donnés restent blancs, les saisies sont fluo.
                  isGiven
                    ? "font-semibold text-white"
                    : "text-neon-ice glow-text font-semibold",
                  conflicts.has(index) && "text-bad glow-text",
                  isSelected
                    ? "bg-neon-ice/25"
                    : isTwin
                      ? "bg-neon-ice/10"
                      : isPeer
                        ? "bg-surface-2"
                        : "bg-surface",
                )}
              >
                {value !== 0 ? (
                  value
                ) : notes[index]?.size ? (
                  <span className="grid grid-cols-3 gap-px p-0.5 text-[0.5rem] leading-none text-muted">
                    {Array.from({ length: 9 }, (_, i) => (
                      <span key={i} className="flex h-2 w-2 justify-center">
                        {notes[index].has(i + 1) ? i + 1 : ""}
                      </span>
                    ))}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-col gap-3 self-center">
        <div className="grid grid-cols-9 gap-1.5">
          {Array.from({ length: 9 }, (_, i) => (
            <Button
              key={i}
              onClick={() => selected !== null && setCell(selected, i + 1)}
              disabled={selected === null}
              className="px-0 py-2.5 font-mono text-base"
            >
              {i + 1}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => selected !== null && setCell(selected, 0)}
            disabled={selected === null}
          >
            Effacer
          </Button>
          <Button
            variant={noteMode ? "primary" : "secondary"}
            onClick={() => setNoteMode((mode) => !mode)}
            aria-pressed={noteMode}
          >
            Notes {noteMode ? "activées" : "désactivées"}
          </Button>
          <Button onClick={revealSelected} disabled={selected === null}>
            Indice
          </Button>
        </div>
        <p className="text-center text-xs text-muted">
          Au clavier : flèches pour se déplacer, 1-9 pour saisir, Retour arrière
          pour effacer.
        </p>
      </div>
    </div>
  );
}
