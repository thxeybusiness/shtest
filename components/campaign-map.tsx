"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { Stars } from "@/components/stars";
import {
  TOTAL_LEVELS,
  TOTAL_STARS,
  chapters,
  levelsOfChapter,
  objectiveLabel,
} from "@/lib/campaign";
import { cn } from "@/lib/cn";
import { gameMeta } from "@/lib/game-meta";
import {
  countCompleted,
  countStars,
  isUnlocked,
  nextLevelId,
  useProgress,
} from "@/lib/progress";

export function CampaignMap() {
  const { progress, reset } = useProgress();

  const stars = countStars(progress);
  const completed = countCompleted(progress);
  const resume = nextLevelId(progress);
  const finished = completed === TOTAL_LEVELS;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-5 py-14">
      <header className="flex flex-col gap-5">
        <span className="text-neon-cyan glow-text w-fit text-xs font-semibold tracking-[0.3em] uppercase">
          Campagne · {TOTAL_LEVELS} niveaux
        </span>
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
          Jeux de <span className="text-neon-magenta glow-text">logique</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted">
          Six mécaniques, une seule progression. Chaque niveau fixe une
          configuration et un objectif chiffré ; il faut au moins une étoile
          pour ouvrir le suivant.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link href={`/niveau/${resume}`}>
            <Button variant="primary">
              {completed === 0
                ? "Commencer la campagne"
                : finished
                  ? `Rejouer le niveau ${resume}`
                  : `Reprendre au niveau ${resume}`}
            </Button>
          </Link>
          <div className="flex flex-col gap-1">
            <span className="text-neon-yellow glow-text font-mono text-sm">
              ★ {stars} / {TOTAL_STARS}
            </span>
            <div className="h-1 w-40 overflow-hidden rounded-full bg-surface-2">
              <div
                className="text-neon-yellow glow h-full bg-current transition-[width]"
                style={{ width: `${(stars / TOTAL_STARS) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-sm text-muted">
            {completed} / {TOTAL_LEVELS} niveaux terminés
          </span>
        </div>
      </header>

      {chapters.map((chapter) => {
        const chapterLevels = levelsOfChapter(chapter.id);
        const open = chapterLevels.some((level) =>
          isUnlocked(progress, level.id),
        );

        return (
          <section key={chapter.id} className="flex flex-col gap-4">
            <div
              className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-l-2 pl-4"
              style={{ borderColor: chapter.neon }}
            >
              <h2
                className="glow-text text-xl font-semibold"
                style={{ color: chapter.neon }}
              >
                {chapter.id}. {chapter.name}
              </h2>
              <p className="text-sm text-muted">{chapter.subtitle}</p>
            </div>

            <ul
              className={cn(
                "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
                !open && "opacity-60",
              )}
            >
              {chapterLevels.map((level) => {
                const unlocked = isUnlocked(progress, level.id);
                const earned = progress[level.id] ?? 0;
                const meta = gameMeta[level.config.game];

                const content = (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="font-mono text-2xl font-bold"
                        style={{ color: unlocked ? chapter.neon : undefined }}
                      >
                        {String(level.id).padStart(2, "0")}
                      </span>
                      {unlocked ? (
                        <Stars count={earned} />
                      ) : (
                        <span aria-label="Niveau verrouillé" role="img">
                          🔒
                        </span>
                      )}
                    </div>
                    <span className="font-medium">{level.title}</span>
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      <span aria-hidden>{meta.emoji}</span>
                      {meta.name}
                    </span>
                    <span className="text-xs text-muted">
                      {objectiveLabel(level.objective)}
                    </span>
                  </>
                );

                return (
                  <li key={level.id}>
                    {unlocked ? (
                      <Link
                        href={`/niveau/${level.id}`}
                        className="flex h-full flex-col gap-1.5 rounded-xl border border-border bg-surface/60 p-4 transition hover:bg-surface"
                        style={{ borderColor: earned > 0 ? chapter.neon : undefined }}
                      >
                        {content}
                      </Link>
                    ) : (
                      <div
                        aria-disabled
                        className="flex h-full cursor-not-allowed flex-col gap-1.5 rounded-xl border border-border bg-surface/30 p-4 text-muted"
                      >
                        {content}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <section className="flex flex-col gap-3 border-t border-border pt-8">
        <h2 className="text-lg font-semibold">Hors campagne</h2>
        <p className="text-sm text-muted">
          Les six mécaniques sont aussi jouables librement, avec tous les
          réglages ouverts et sans objectif.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/libre">
            <Button>Partie libre</Button>
          </Link>
          {completed > 0 && (
            <Button
              variant="ghost"
              className="text-muted"
              onClick={() => {
                if (
                  window.confirm(
                    "Effacer toute la progression de la campagne ? Cette action est définitive.",
                  )
                ) {
                  reset();
                }
              }}
            >
              Réinitialiser la progression
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
