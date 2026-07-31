"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Banner, Button, SegmentedControl, Stat } from "@/components/ui";
import type { LevelReport } from "@/lib/campaign";
import { cn } from "@/lib/cn";
import { formatDuration } from "@/lib/format";
import { useBestScore, useTimer } from "@/lib/hooks";
import {
  LIGHTS_SIZE_OPTIONS,
  type LightsSize,
  type LightsSizeOption,
  isDark,
  shuffleLights,
  toggle,
} from "@/lib/lights";

export function LightsGame({
  fixedSize,
  onProgress,
  onFinish,
}: {
  /** Taille imposée par un niveau de campagne. */
  fixedSize?: LightsSize;
  onFinish?: LevelReport;
  /** Rapporte en continu la métrique suivie par le niveau. */
  onProgress?: (value: number) => void;
} = {}) {
  const [chosenSize, setSize] = useState<LightsSize>(fixedSize ?? 5);
  const size = fixedSize ?? chosenSize;
  const [grid, setGrid] = useState<boolean[]>([]);
  const [moves, setMoves] = useState(0);

  const solved = useMemo(
    () => grid.length > 0 && isDark(grid),
    [grid],
  );

  const { elapsed, reset: resetTimer } = useTimer(grid.length > 0 && !solved);
  const { best, submit } = useBestScore(`lumieres:${size}`);

  const newGame = useCallback(() => {
    setGrid(shuffleLights(size));
    setMoves(0);
    resetTimer();
  }, [resetTimer, size]);

  // Grille posée après l'hydratation : le mélange est aléatoire et ne peut pas
  // être reproduit à l'identique par le rendu serveur.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    newGame();
  }, [newGame]);

  useEffect(() => {
    if (!solved) return;
    submit(moves);
    onFinish?.(moves, true);
    // Seule la transition vers la grille éteinte compte.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved]);

  // Le niveau consomme des coups : il les suit pour vider sa réserve.
  useEffect(() => {
    onProgress?.(moves);
  }, [moves, onProgress]);

  const play = (index: number) => {
    if (solved) return;
    setGrid(toggle(grid, index, size));
    setMoves((count) => count + 1);
  };

  const lit = grid.filter(Boolean).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        {fixedSize === undefined && (
          <SegmentedControl
            label="Taille"
            options={LIGHTS_SIZE_OPTIONS}
            value={String(size) as LightsSizeOption}
            onChange={(value) => setSize(Number(value) as LightsSize)}
            format={(value) => `${value}×${value}`}
          />
        )}
        <Button variant="primary" onClick={newGame}>
          Nouvelle grille
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Stat label="Temps" value={formatDuration(elapsed)} />
        <Stat label="Coups" value={moves} />
        <Stat label="Allumées" value={lit} />
        <Stat label="Record" value={best === null ? "—" : `${best} coups`} />
      </div>

      {solved && (
        <Banner tone="good">
          Tout est éteint en {moves} coups et {formatDuration(elapsed)}.
        </Banner>
      )}

      <div
        className="no-select grid w-full max-w-md gap-2 self-center"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {grid.map((on, index) => (
          <button
            key={index}
            onClick={() => play(index)}
            aria-label={`Lampe ${index + 1} ${on ? "allumée" : "éteinte"}`}
            aria-pressed={on}
            className={cn(
              "aspect-square cursor-pointer rounded-lg border-2 transition",
              on
                ? "text-tone-sand border-current bg-current"
                : "border-border bg-surface-2 hover:bg-surface",
            )}
          />
        ))}
      </div>

      <p className="text-center text-xs text-muted">
        Un clic bascule la lampe visée et ses quatre voisines. Toute grille
        proposée est résoluble.
      </p>
    </div>
  );
}
