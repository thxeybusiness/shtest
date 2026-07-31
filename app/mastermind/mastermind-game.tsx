"use client";

import { useCallback, useEffect, useState } from "react";
import { Banner, Button, SegmentedControl, Stat } from "@/components/ui";
import type { LevelReport } from "@/lib/campaign";
import { cn } from "@/lib/cn";
import { useBestScore } from "@/lib/hooks";
import {
  MASTERMIND_COLORS,
  MASTERMIND_CONFIG,
  MASTERMIND_LEVELS,
  type MastermindLevel,
  type Score,
  randomSecret,
  scoreGuess,
} from "@/lib/mastermind";

type Attempt = { guess: number[]; score: Score };

export function MastermindGame({
  fixedLevel,
  onFinish,
  onProgress,
}: {
  /** Niveau imposé par un niveau de campagne. */
  fixedLevel?: MastermindLevel;
  onFinish?: LevelReport;
  /** Rapporte en continu la métrique suivie par le niveau. */
  onProgress?: (value: number) => void;
} = {}) {
  const [chosenLevel, setLevel] = useState<MastermindLevel>("facile");
  const level = fixedLevel ?? chosenLevel;
  const { length, colors, tries } = MASTERMIND_CONFIG[level];

  const [secret, setSecret] = useState<number[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [draft, setDraft] = useState<(number | null)[]>([]);
  const [status, setStatus] = useState<"en cours" | "gagné" | "perdu">(
    "en cours",
  );

  const { best, submit } = useBestScore(`mastermind:${level}`);

  const newGame = useCallback(() => {
    setSecret(randomSecret(length, colors));
    setAttempts([]);
    setDraft(Array.from({ length }, () => null));
    setStatus("en cours");
  }, [colors, length]);

  // Code secret tiré après l'hydratation : il est aléatoire et ne peut pas
  // être reproduit à l'identique par le rendu serveur.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    newGame();
  }, [newGame]);

  // Le niveau consomme des essais : il les suit pour vider sa réserve.
  useEffect(() => {
    onProgress?.(attempts.length);
  }, [attempts.length, onProgress]);

  const placeColor = (color: number) => {
    if (status !== "en cours") return;

    setDraft((previous) => {
      const slot = previous.indexOf(null);
      if (slot === -1) return previous;
      const next = [...previous];
      next[slot] = color;
      return next;
    });
  };

  const clearSlot = (slot: number) => {
    if (status !== "en cours") return;
    setDraft((previous) => previous.map((c, i) => (i === slot ? null : c)));
  };

  const validate = () => {
    if (status !== "en cours" || draft.some((color) => color === null)) return;

    const guess = draft as number[];
    const score = scoreGuess(guess, secret);
    const nextAttempts = [...attempts, { guess, score }];

    setAttempts(nextAttempts);
    setDraft(Array.from({ length }, () => null));

    if (score.exact === length) {
      setStatus("gagné");
      submit(nextAttempts.length);
      onFinish?.(nextAttempts.length, true);
    } else if (nextAttempts.length >= tries) {
      setStatus("perdu");
      onFinish?.(nextAttempts.length, false);
    }
  };

  const complete = draft.length > 0 && draft.every((color) => color !== null);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        {fixedLevel === undefined && (
          <SegmentedControl
            label="Niveau"
            options={MASTERMIND_LEVELS}
            value={level}
            onChange={setLevel}
          />
        )}
        <Button variant="primary" onClick={newGame}>
          Nouvelle partie
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Stat label="Essais" value={`${attempts.length} / ${tries}`} />
        <Stat label="Pions" value={length} />
        <Stat label="Couleurs" value={colors} />
        <Stat label="Record" value={best === null ? "—" : `${best} essais`} />
      </div>

      {status === "gagné" && (
        <Banner tone="good">
          Code trouvé en {attempts.length} essai
          {attempts.length > 1 ? "s" : ""}.
        </Banner>
      )}
      {status === "perdu" && (
        <Banner tone="bad">
          Essais épuisés. Le code était : {secret.map((c) => MASTERMIND_COLORS[c].name).join(", ")}.
        </Banner>
      )}

      <ol className="flex flex-col gap-2">
        {attempts.map((attempt, index) => (
          <li
            key={index}
            className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2"
          >
            <span className="w-6 text-right font-mono text-xs text-muted">
              {index + 1}
            </span>
            <div className="flex gap-1.5">
              {attempt.guess.map((color, slot) => (
                <span
                  key={slot}
                  title={MASTERMIND_COLORS[color].name}
                  className="glow h-7 w-7 rounded-full"
                  style={{
                    backgroundColor: MASTERMIND_COLORS[color].css,
                    color: MASTERMIND_COLORS[color].css,
                  }}
                />
              ))}
            </div>
            <div className="ml-auto flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1" title="Bien placés">
                <span className="h-2.5 w-2.5 rounded-full bg-white" />
                {attempt.score.exact}
              </span>
              <span className="flex items-center gap-1" title="Mal placés">
                <span className="h-2.5 w-2.5 rounded-full border border-white" />
                {attempt.score.partial}
              </span>
            </div>
          </li>
        ))}
      </ol>

      {status === "en cours" && (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1.5">
              {draft.map((color, slot) => (
                <button
                  key={slot}
                  onClick={() => clearSlot(slot)}
                  aria-label={`Emplacement ${slot + 1}`}
                  className={cn(
                    "h-9 w-9 cursor-pointer rounded-full border-2 transition",
                    color === null
                      ? "border-dashed border-border"
                      : "glow border-solid",
                  )}
                  style={
                    color === null
                      ? undefined
                      : {
                          backgroundColor: MASTERMIND_COLORS[color].css,
                          borderColor: MASTERMIND_COLORS[color].css,
                          color: MASTERMIND_COLORS[color].css,
                        }
                  }
                />
              ))}
            </div>
            <Button
              variant="primary"
              onClick={validate}
              disabled={!complete}
              className="ml-auto"
            >
              Valider
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {MASTERMIND_COLORS.slice(0, colors).map((color, index) => (
              <button
                key={color.name}
                onClick={() => placeColor(index)}
                aria-label={color.name}
                title={color.name}
                className="glow h-9 w-9 cursor-pointer rounded-full transition hover:scale-110"
                style={{ backgroundColor: color.css, color: color.css }}
              />
            ))}
          </div>

          <p className="text-xs text-muted">
            Pion plein = bonne couleur bien placée. Pion creux = bonne couleur
            mal placée. Cliquez un emplacement pour le vider.
          </p>
        </div>
      )}
    </div>
  );
}
