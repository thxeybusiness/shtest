"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Banner, Button, Stat } from "@/components/ui";
import type { LevelReport } from "@/lib/campaign";
import { cn } from "@/lib/cn";
import { useBestScore } from "@/lib/hooks";
import {
  CASCADE_LANES,
  CASCADE_LIVES,
  CASCADE_NEON,
  type CascadeState,
  advance,
  createCascadeState,
  currentRule,
  hitBlock,
  isOver,
  ruleProgress,
} from "@/lib/cascade";

type Status = "prêt" | "en cours" | "perdu";

/** Une image de plus de 100 ms (onglet en veille) ne doit pas téléporter les blocs. */
const MAX_FRAME = 0.1;

export function CascadeGame({
  speedFactor = 1,
  onFinish,
}: {
  /** Vitesse imposée par un niveau de campagne. */
  speedFactor?: number;
  onFinish?: LevelReport;
} = {}) {
  const [status, setStatus] = useState<Status>("prêt");
  const [round, setRound] = useState(0);
  const [state, setState] = useState<CascadeState>(() =>
    createCascadeState(speedFactor),
  );
  const { best, submit } = useBestScore("cascade:score", false);

  // File des blocs cliqués depuis la dernière image. La boucle est seule
  // propriétaire du modèle : les clics ne le modifient pas directement, ils
  // sont drainés au début de l'image suivante.
  const clicks = useRef<number[]>([]);

  const start = useCallback(() => {
    clicks.current = [];
    setState(createCascadeState(speedFactor));
    setRound((current) => current + 1);
    setStatus("en cours");
  }, [speedFactor]);

  useEffect(() => {
    if (status !== "en cours") return;

    let model = createCascadeState(speedFactor);
    let frame = 0;
    let previous = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - previous) / 1000, MAX_FRAME);
      previous = now;

      for (const id of clicks.current.splice(0)) {
        model = hitBlock(model, id);
      }
      model = advance(model, dt);
      setState(model);

      if (isOver(model)) {
        setStatus("perdu");
        submit(model.score);
        // Cascade se termine toujours par une défaite : c'est le score seul
        // qui décide de la réussite du niveau.
        onFinish?.(model.score, true);
        return;
      }

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [onFinish, round, speedFactor, status, submit]);

  const rule = currentRule(state);
  const playing = status === "en cours";
  // Dans un niveau, c'est le bilan du niveau qui annonce la fin de partie :
  // on n'affiche pas en plus l'écran « Perdu » propre au jeu.
  const showOverlay = !playing && !(onFinish && status === "perdu");

  return (
    <div className="flex flex-col gap-5">
      {/* En campagne, « Démarrer » et « Rejouer » vivent dans les écrans du
          niveau : ce bandeau ferait doublon. */}
      {!onFinish && (
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" onClick={start}>
            {status === "prêt" ? "Démarrer" : "Rejouer"}
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Stat label="Score" value={state.score} />
        <Stat label="Combo" value={`×${state.combo}`} />
        <Stat
          label="Vies"
          value={
            <span className="text-bad glow-text">
              {"◆".repeat(Math.max(0, state.lives)) || "—"}
            </span>
          }
        />
        <Stat label="Record" value={best ?? "—"} />
      </div>

      {status === "perdu" && (
        <Banner tone="bad">
          Partie terminée — score {state.score}, meilleure série ×
          {state.bestCombo}.
        </Banner>
      )}

      <div className="flex w-full max-w-md flex-col gap-2 self-center">
        <div className="flex flex-col gap-1.5 rounded-xl border border-neon-cyan/40 bg-surface/70 px-4 py-3">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[0.7rem] tracking-widest text-muted uppercase">
              Cliquez
            </span>
            <span className="text-neon-cyan glow-text text-right text-lg font-semibold">
              {rule.label}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className="text-neon-cyan glow h-full bg-current"
              style={{ width: `${Math.max(0, ruleProgress(state)) * 100}%` }}
            />
          </div>
        </div>

        <div className="no-select scrolling-grid relative aspect-3/4 w-full overflow-hidden rounded-2xl border border-border bg-bg/60">
          {state.pops.map((pop) => (
            <span
              key={pop.id}
              aria-hidden
              className={cn(
                "pointer-events-none absolute aspect-square rounded-xl border-2",
                pop.tone === "good"
                  ? "border-neon-green text-neon-green"
                  : "border-bad text-bad",
              )}
              style={{
                left: `${(pop.lane / CASCADE_LANES) * 100}%`,
                top: `${pop.y * 100}%`,
                width: `${100 / CASCADE_LANES}%`,
                opacity: pop.life,
                transform: `scale(${1 + (1 - pop.life) * 0.8})`,
              }}
            />
          ))}

          {state.blocks.map((block) => (
            <button
              key={block.id}
              onClick={() => clicks.current.push(block.id)}
              disabled={!playing}
              aria-label={`Bloc ${block.value}`}
              className="absolute flex aspect-square items-center justify-center p-1"
              style={{
                left: `${(block.lane / CASCADE_LANES) * 100}%`,
                top: `${block.y * 100}%`,
                width: `${100 / CASCADE_LANES}%`,
                color: CASCADE_NEON[block.neon],
              }}
            >
              {/* La couleur fluo reste sur ce span : `border-current`,
                  `bg-current` et le halo la reprennent. Le chiffre est blanc
                  dans un enfant, sinon il écraserait `currentColor`. */}
              <span className="glow flex h-full w-full items-center justify-center rounded-xl border-2 border-current bg-current/15">
                <span className="text-lg font-bold text-white">
                  {block.value}
                </span>
              </span>
            </button>
          ))}

          {showOverlay && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg/85 px-6 text-center">
              <p className="text-neon-magenta glow-text text-2xl font-semibold">
                {status === "prêt" ? "Cascade" : "Perdu"}
              </p>
              <p className="max-w-xs text-sm text-muted">
                Les blocs descendent sans arrêt. Cliquez ceux qui vérifient la
                règle affichée : en laisser passer un, ou en cliquer un mauvais,
                coûte une vie sur {CASCADE_LIVES}.
              </p>
              <Button variant="primary" onClick={start}>
                {status === "prêt" ? "Démarrer" : "Rejouer"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
