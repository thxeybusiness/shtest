"use client";

import Link from "next/link";
import { TOTAL_NIVEAUX, niveaux } from "@/lib/noir/niveaux";
import {
  estOuvert,
  prochainNiveau,
  useProgressionNoir,
} from "@/lib/noir/progression";

export function Sommaire() {
  const { resolus, reinitialiser } = useProgressionNoir();
  const reprise = prochainNiveau(resolus);
  const fini = resolus.length === TOTAL_NIVEAUX;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-10 px-5 py-16">
      <header className="flex flex-col gap-4">
        <h1 className="text-5xl font-semibold tracking-tight">noir</h1>
        <p className="text-muted">
          Faites disparaître l&apos;écran dans la couleur du niveau. Chaque
          niveau a sa propre logique, et aucune n&apos;est expliquée.
        </p>
        <Link
          href={`/noir/${reprise}`}
          className="w-fit rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition hover:brightness-110"
        >
          {resolus.length === 0
            ? "Commencer"
            : fini
              ? `Rejouer le niveau ${reprise}`
              : `Reprendre au niveau ${reprise}`}
        </Link>
      </header>

      <ul className="grid grid-cols-5 gap-3">
        {niveaux.map((niveau) => {
          const ouvert = estOuvert(resolus, niveau.numero);
          const fait = resolus.includes(niveau.numero);

          const contenu = (
            <span className="font-mono text-lg tabular-nums">
              {String(niveau.numero).padStart(2, "0")}
            </span>
          );

          return (
            <li key={niveau.numero}>
              {ouvert ? (
                <Link
                  href={`/noir/${niveau.numero}`}
                  className="flex aspect-square items-center justify-center rounded-sm border transition hover:border-accent"
                  style={
                    fait
                      ? {
                          // Un niveau résolu porte sa propre couleur : le
                          // sommaire donne à voir le dégradé de la série.
                          backgroundColor: niveau.couleurs.cible,
                          color: niveau.couleurs.repos,
                          borderColor: "transparent",
                        }
                      : {
                          backgroundColor: "var(--surface)",
                          color: "var(--text)",
                          borderColor: "var(--border)",
                        }
                  }
                >
                  {contenu}
                </Link>
              ) : (
                <div
                  aria-disabled
                  className="flex aspect-square cursor-not-allowed items-center justify-center rounded-sm border border-border bg-surface text-muted/40"
                >
                  {contenu}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <footer className="flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted">
        <span>
          {resolus.length} / {TOTAL_NIVEAUX} niveaux résolus
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/mecaniques" className="transition hover:text-text">
            Les anciens casse-têtes
          </Link>
          {resolus.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Effacer la progression ?")) reinitialiser();
              }}
              className="cursor-pointer transition hover:text-text"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
