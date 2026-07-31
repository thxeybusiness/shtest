"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Banner, Button, SegmentedControl, Stat } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatDuration } from "@/lib/format";
import { useBestScore, useTimer } from "@/lib/hooks";
import {
  TAQUIN_SIZE_OPTIONS,
  type TaquinSize,
  type TaquinSizeOption,
  blankIndex,
  isSolved,
  movableIndexes,
  shuffleTiles,
  slide,
  solvedTiles,
} from "@/lib/taquin";

export function TaquinGame() {
  const [size, setSize] = useState<TaquinSize>(3);
  const [tiles, setTiles] = useState<number[]>(() => solvedTiles(3));
  const [moves, setMoves] = useState(0);
  const [started, setStarted] = useState(false);

  const solved = useMemo(() => started && isSolved(tiles, size), [
    size,
    started,
    tiles,
  ]);

  const { elapsed, reset: resetTimer } = useTimer(started && !solved);
  const { best, submit } = useBestScore(`taquin:${size}`);

  const newGame = useCallback(() => {
    setTiles(shuffleTiles(size));
    setMoves(0);
    setStarted(true);
    resetTimer();
  }, [resetTimer, size]);

  // Taquin mélangé après l'hydratation : le tirage est aléatoire et ne peut
  // pas être reproduit à l'identique par le rendu serveur.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    newGame();
  }, [newGame]);

  useEffect(() => {
    if (solved) submit(moves);
    // On n'enregistre qu'au moment où le taquin devient résolu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved]);

  const play = useCallback(
    (index: number) => {
      if (solved || !movableIndexes(tiles, size).includes(index)) return;

      setTiles(slide(tiles, index, size));
      setMoves((count) => count + 1);
    },
    [size, solved, tiles],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const blank = blankIndex(tiles);
      // La flèche indique le sens de déplacement de la tuile, donc on prend
      // celle qui se trouve du côté opposé à la case vide.
      const offsets: Record<string, number> = {
        ArrowUp: size,
        ArrowDown: -size,
        ArrowLeft: 1,
        ArrowRight: -1,
      };
      const offset = offsets[event.key];
      if (offset === undefined) return;

      const target = blank + offset;
      if (target < 0 || target >= size * size) return;
      if (Math.abs(offset) === 1 &&
        Math.floor(target / size) !== Math.floor(blank / size)) {
        return;
      }

      play(target);
      event.preventDefault();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [play, size, tiles]);

  const movable = movableIndexes(tiles, size);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl
          label="Taille"
          options={TAQUIN_SIZE_OPTIONS}
          value={String(size) as TaquinSizeOption}
          onChange={(value) => setSize(Number(value) as TaquinSize)}
          format={(value) => `${value}×${value}`}
        />
        <Button variant="primary" onClick={newGame}>
          Mélanger
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Stat label="Temps" value={formatDuration(elapsed)} />
        <Stat label="Coups" value={moves} />
        <Stat label="Record" value={best === null ? "—" : `${best} coups`} />
      </div>

      {solved && (
        <Banner tone="good">
          Résolu en {moves} coups et {formatDuration(elapsed)}.
        </Banner>
      )}

      <div
        className="no-select grid w-full max-w-md gap-1.5 self-center"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {tiles.map((tile, index) =>
          tile === 0 ? (
            <span key={index} className="aspect-square rounded-lg" />
          ) : (
            <button
              key={index}
              onClick={() => play(index)}
              disabled={!movable.includes(index) || solved}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg border border-border text-xl font-semibold transition",
                movable.includes(index) && !solved
                  ? "cursor-pointer bg-surface hover:bg-accent hover:text-accent-fg"
                  : "bg-surface-2 text-muted",
              )}
            >
              {tile}
            </button>
          ),
        )}
      </div>

      <p className="text-center text-xs text-muted">
        Cliquez une tuile voisine du trou, ou utilisez les flèches du clavier.
      </p>
    </div>
  );
}
