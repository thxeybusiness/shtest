"use client";

import Link from "next/link";
import { Cadenas } from "@/components/icones";
import { TOTAL_NIVEAUX, getNiveau } from "@/lib/noir/niveaux";
import {
  NIVEAUX_PAR_PALIER,
  degradeEntre,
  niveauxDuPalier,
  paliers,
} from "@/lib/noir/paliers";
import {
  estOuvert,
  palierOuvert,
  prochainNiveau,
  useProgressionNoir,
} from "@/lib/noir/progression";

export function Sommaire() {
  const { resolus, reinitialiser } = useProgressionNoir();
  const reprise = prochainNiveau(resolus);
  const fini = resolus.length === TOTAL_NIVEAUX;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-10 px-5 py-16">
      <header className="apparait flex flex-col gap-4">
        <h1 className="text-5xl font-semibold tracking-tight">noir</h1>
        <p className="text-muted">
          Faites disparaître l&apos;écran dans la couleur du palier. Chaque
          niveau a sa propre logique, et aucune n&apos;est expliquée.
        </p>
        <Link
          href={`/noir/${reprise}`}
          className="w-fit rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition hover:brightness-110 active:scale-95"
        >
          {resolus.length === 0
            ? "Commencer"
            : fini
              ? `Rejouer le niveau ${reprise}`
              : `Reprendre au niveau ${reprise}`}
        </Link>
      </header>

      <div className="flex flex-col">
        {paliers.map((palier, rang) => {
          const ouvert = palierOuvert(resolus, palier.numero);
          const faits = niveauxDuPalier(palier.numero).filter((n) =>
            resolus.includes(n),
          ).length;
          const suivant = paliers[rang + 1];

          return (
            <div key={palier.numero} className="flex flex-col">
              <section
                className="apparait flex flex-col gap-4"
                style={{ animationDelay: `${rang * 120}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="h-5 w-5 rounded-full border border-border"
                    style={{ backgroundColor: palier.couleurs.cible }}
                  />
                  <h2 className="text-lg font-semibold">
                    Palier {palier.numero} · {palier.nom}
                  </h2>
                  {ouvert ? (
                    <span className="ml-auto font-mono text-sm text-muted tabular-nums">
                      {faits} / {NIVEAUX_PAR_PALIER}
                    </span>
                  ) : (
                    <Cadenas
                      className="ml-auto h-5 w-5 text-muted"
                      role="img"
                      aria-label="Palier verrouillé"
                    />
                  )}
                </div>

                <ul className="grid grid-cols-5 gap-3">
                  {niveauxDuPalier(palier.numero).map((numero, i) => {
                    const niveauOuvert = estOuvert(resolus, numero);
                    const fait = resolus.includes(numero);
                    const existe = getNiveau(numero) !== undefined;

                    const contenu = (
                      <span className="font-mono text-lg tabular-nums">
                        {String(numero).padStart(2, "0")}
                      </span>
                    );

                    return (
                      <li
                        key={numero}
                        className="apparait"
                        style={{ animationDelay: `${rang * 120 + i * 35}ms` }}
                      >
                        {niveauOuvert && existe ? (
                          <Link
                            href={`/noir/${numero}`}
                            className="flex aspect-square items-center justify-center rounded-sm border transition duration-200 hover:-translate-y-0.5 hover:border-accent active:scale-95"
                            style={
                              fait
                                ? {
                                    backgroundColor: palier.couleurs.cible,
                                    color: palier.couleurs.repos,
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
                            className="flex aspect-square cursor-not-allowed items-center justify-center rounded-sm border border-border bg-surface/40 text-muted/40"
                          >
                            {niveauOuvert ? (
                              contenu
                            ) : (
                              <Cadenas
                                className="h-5 w-5"
                                role="img"
                                aria-label="Niveau verrouillé"
                              />
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>

              {suivant && (
                // Le fond qui relie deux paliers dégrade l'un vers l'autre.
                <div
                  aria-hidden
                  className="my-6 h-16 w-full rounded-sm"
                  style={{ background: degradeEntre(palier, suivant) }}
                />
              )}
            </div>
          );
        })}
      </div>

      <footer className="apparait flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted">
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
