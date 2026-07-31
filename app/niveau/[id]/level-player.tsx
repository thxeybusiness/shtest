"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { CascadeGame } from "@/app/cascade/cascade-game";
import { MinesweeperGame } from "@/app/demineur/minesweeper-game";
import { LightsGame } from "@/app/lumieres/lights-game";
import { MastermindGame } from "@/app/mastermind/mastermind-game";
import { SudokuGame } from "@/app/sudoku/sudoku-game";
import { TaquinGame } from "@/app/taquin/taquin-game";
import { BudgetMeter } from "@/components/budget-meter";
import { DangerVignette } from "@/components/danger";
import { Stars } from "@/components/stars";
import { Button } from "@/components/ui";
import {
  type Level,
  TOTAL_LEVELS,
  budgetOf,
  chapters,
  formatValue,
  objectiveLabel,
  starThresholds,
  starsFor,
} from "@/lib/campaign";
import { gameMeta } from "@/lib/game-meta";
import { useProgress } from "@/lib/progress";

type Result = { value: number; won: boolean; stars: number };

/** Instancie la mécanique du niveau avec sa configuration figée. */
function LevelGame({
  level,
  onFinish,
  onProgress,
}: {
  level: Level;
  onFinish: (value: number, won: boolean) => void;
  onProgress: (value: number) => void;
}) {
  const { config } = level;

  switch (config.game) {
    case "cascade":
      // Pas de budget ici : la tension de Cascade vient de ses vies.
      return <CascadeGame speedFactor={config.speed} onFinish={onFinish} />;
    case "sudoku":
      return (
        <SudokuGame
          fixedDifficulty={config.difficulty}
          onFinish={onFinish}
          onProgress={onProgress}
        />
      );
    case "demineur":
      return (
        <MinesweeperGame
          fixedLevel={config.level}
          onFinish={onFinish}
          onProgress={onProgress}
        />
      );
    case "mastermind":
      return (
        <MastermindGame
          fixedLevel={config.level}
          onFinish={onFinish}
          onProgress={onProgress}
        />
      );
    case "taquin":
      return (
        <TaquinGame
          fixedSize={config.size}
          onFinish={onFinish}
          onProgress={onProgress}
        />
      );
    case "lumieres":
      return (
        <LightsGame
          fixedSize={config.size}
          onFinish={onFinish}
          onProgress={onProgress}
        />
      );
  }
}

export function LevelPlayer({ level }: { level: Level }) {
  const { progress, record } = useProgress();
  const [result, setResult] = useState<Result | null>(null);
  const [spent, setSpent] = useState(0);
  // Sert de `key` à la mécanique : l'incrémenter la remonte à neuf.
  const [attempt, setAttempt] = useState(0);

  const meta = gameMeta[level.config.game];
  const chapter = chapters.find((entry) => entry.id === level.chapter)!;
  const earned = progress[level.id] ?? 0;
  const hasNext = level.id < TOTAL_LEVELS;
  const budget = budgetOf(level.objective);

  const handleFinish = useCallback(
    (value: number, won: boolean) => {
      const stars = starsFor(level.objective, value, won);
      setResult({ value, won, stars });
      record(level.id, stars);
    },
    [level.id, level.objective, record],
  );

  const handleProgress = useCallback((value: number) => {
    setSpent(value);
  }, []);

  const retry = () => {
    setResult(null);
    setSpent(0);
    setAttempt((current) => current + 1);
  };

  // Réserve épuisée : le niveau est perdu sans rien rapporter. On le dérive du
  // rendu plutôt que d'un effet — la victoire, si elle arrive au même moment,
  // reste prioritaire.
  const exhausted = budget !== null && spent >= budget;
  const shown: Result | null =
    result ?? (exhausted ? { value: spent, won: false, stars: 0 } : null);

  const pressure = budget === null ? 0 : spent / budget;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-5 py-8">
      {shown === null && <DangerVignette level={pressure} />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/mecaniques"
          className="text-sm text-muted transition hover:text-text"
        >
          ← Carte des niveaux
        </Link>
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: chapter.color }}
        >
          Chapitre {chapter.id} · {chapter.name}
        </span>
      </div>

      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span
            className="font-mono text-4xl font-bold"
            style={{ color: chapter.color }}
          >
            {String(level.id).padStart(2, "0")}
          </span>
          <h1 className="text-3xl font-semibold tracking-tight">
            {level.title}
          </h1>
        </div>
        <p className="flex items-center gap-2 text-sm text-muted">
          <span aria-hidden>{meta.emoji}</span>
          {meta.name} — {meta.description}
        </p>
      </header>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface/70 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[0.7rem] tracking-widest text-muted uppercase">
              Objectif
            </span>
            <span
              className="font-semibold"
              style={{ color: chapter.color }}
            >
              {objectiveLabel(level.objective)}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Stars count={earned} />
            <div className="flex gap-3 font-mono text-xs text-muted">
              {starThresholds(level.objective).map((threshold) => (
                <span key={threshold.stars}>
                  {"★".repeat(threshold.stars)} {threshold.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {budget !== null && (
          <BudgetMeter
            objective={level.objective}
            spent={spent}
            budget={budget}
          />
        )}
      </div>

      <div className="relative">
        <LevelGame
          key={attempt}
          level={level}
          onFinish={handleFinish}
          onProgress={handleProgress}
        />

        {shown && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-bg/90 p-6 backdrop-blur">
            <div className="flex max-w-sm flex-col items-center gap-4 text-center">
              <Stars count={shown.stars} size="lg" />
              <p
                className="text-2xl font-semibold"
                style={{
                  color: shown.stars > 0 ? chapter.color : "var(--bad)",
                }}
              >
                {shown.stars > 0
                  ? "Niveau réussi"
                  : exhausted && !result
                    ? "Réserve épuisée"
                    : "Objectif manqué"}
              </p>
              <p className="text-sm text-muted">
                {exhausted && !result
                  ? `Il ne restait plus rien : ${objectiveLabel(level.objective).toLowerCase()}.`
                  : shown.won
                    ? `Résultat : ${formatValue(level.objective, shown.value)}.`
                    : "Partie perdue — le niveau demande d'aller au bout."}
                {shown.stars > 0 && shown.stars < 3 && (
                  <> Il reste de la marge pour décrocher les trois étoiles.</>
                )}
              </p>

              <div className="flex flex-wrap justify-center gap-2">
                <Button onClick={retry}>Rejouer</Button>
                {shown.stars > 0 && hasNext && (
                  <Link href={`/niveau/${level.id + 1}`}>
                    <Button variant="primary">Niveau suivant →</Button>
                  </Link>
                )}
                <Link href="/mecaniques">
                  <Button variant="ghost">Carte</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
