"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Banner, Button, SegmentedControl, Stat } from "@/components/ui";
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

export function LightsGame() {
  const [size, setSize] = useState<LightsSize>(5);
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
    if (solved) submit(moves);
    // Seule la transition vers la grille éteinte compte.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved]);

  const play = (index: number) => {
    if (solved) return;
    setGrid(toggle(grid, index, size));
    setMoves((count) => count + 1);
  };

  const lit = grid.filter(Boolean).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl
          label="Taille"
          options={LIGHTS_SIZE_OPTIONS}
          value={String(size) as LightsSizeOption}
          onChange={(value) => setSize(Number(value) as LightsSize)}
          format={(value) => `${value}×${value}`}
        />
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
              "aspect-square cursor-pointer rounded-lg border transition",
              on
                ? "border-amber-300 bg-amber-300 shadow-[0_0_18px_-2px] shadow-amber-400/70"
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
