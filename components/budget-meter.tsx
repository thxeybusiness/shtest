"use client";

import { type Objective, budgetLabel, formatRemaining } from "@/lib/campaign";
import { cn } from "@/lib/cn";

/**
 * Réserve du niveau qui se vide en jouant. La couleur passe du calme à la
 * braise puis au sang, et le compteur se met à battre sur la fin.
 */
export function BudgetMeter({
  objective,
  spent,
  budget,
}: {
  objective: Objective;
  spent: number;
  budget: number;
}) {
  const used = Math.min(1, Math.max(0, spent / budget));
  const left = 1 - used;

  const tone =
    used >= 0.85
      ? { text: "text-bad", bar: "bg-bad" }
      : used >= 0.6
        ? { text: "text-neon-ember", bar: "bg-neon-ember" }
        : { text: "text-neon-mint", bar: "bg-neon-mint" };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[0.7rem] tracking-widest text-muted uppercase">
          {budgetLabel(objective)}
        </span>
        <span
          className={cn(
            "glow-text font-mono text-lg font-semibold tabular-nums",
            tone.text,
            used >= 0.85 && "tense",
          )}
        >
          {formatRemaining(objective, spent)}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div
          className={cn("h-full transition-[width] duration-200", tone.bar)}
          style={{ width: `${left * 100}%` }}
        />
      </div>
    </div>
  );
}
