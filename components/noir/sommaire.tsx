"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Cadenas } from "@/components/icones";
import { TOTAL_NIVEAUX, getNiveau } from "@/lib/noir/niveaux";
import {
  NIVEAUX_PAR_PALIER,
  type Palier,
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

/**
 * Bande pleine largeur peinte de la couleur d'un palier. Le contenu reste
 * centré ; c'est le fond qui court d'un bord à l'autre.
 */
function Bande({
  fond,
  encre,
  children,
  className,
}: {
  fond: string;
  encre?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div style={{ background: fond, color: encre }} className={className}>
      <div className="mx-auto w-full max-w-md px-5">{children}</div>
    </div>
  );
}

/** Mélange une couleur avec du transparent, pour les bordures discrètes. */
const voile = (couleur: string, part: number) =>
  `color-mix(in srgb, ${couleur} ${part}%, transparent)`;

function Niveaux({
  palier,
  resolus,
  encre,
  fond,
  decalage,
}: {
  palier: Palier;
  resolus: number[];
  encre: string;
  fond: string;
  decalage: number;
}) {
  return (
    <ul className="grid grid-cols-5 gap-3">
      {niveauxDuPalier(palier.numero).map((numero, i) => {
        const ouvert = estOuvert(resolus, numero);
        const fait = resolus.includes(numero);
        const existe = getNiveau(numero) !== undefined;

        // Sur un fond qui porte déjà la couleur du palier, un niveau résolu
        // s'affiche à l'encre inverse : c'est lui qui doit trancher.
        const style: CSSProperties = fait
          ? { backgroundColor: encre, color: fond, borderColor: "transparent" }
          : {
              backgroundColor: "transparent",
              color: ouvert ? encre : voile(encre, 40),
              borderColor: voile(encre, ouvert ? 45 : 20),
            };

        const contenu = (
          <span className="font-mono text-lg tabular-nums">
            {String(numero).padStart(2, "0")}
          </span>
        );

        return (
          <li
            key={numero}
            className="apparait"
            style={{ animationDelay: `${decalage + i * 35}ms` }}
          >
            {ouvert && existe ? (
              <Link
                href={`/noir/${numero}`}
                style={style}
                className="flex aspect-square items-center justify-center rounded-sm border transition duration-200 hover:-translate-y-0.5 active:scale-95"
              >
                {contenu}
              </Link>
            ) : (
              <div
                aria-disabled
                style={style}
                className="flex aspect-square cursor-not-allowed items-center justify-center rounded-sm border"
              >
                {ouvert ? (
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
  );
}

export function Sommaire() {
  const { resolus, reinitialiser } = useProgressionNoir();
  const reprise = prochainNiveau(resolus);
  const fini = resolus.length === TOTAL_NIVEAUX;

  const premier = paliers[0];
  const dernier = paliers[paliers.length - 1];

  return (
    <div className="flex flex-col">
      {/* Le menu s'ouvre sur la couleur du premier palier — le noir plein. */}
      <Bande
        fond={premier.couleurs.cible}
        encre={premier.couleurs.repos}
        className="pt-16 pb-10"
      >
        <header className="apparait flex flex-col gap-4">
          <h1 className="text-5xl font-semibold tracking-tight">noir</h1>
          <p style={{ color: voile(premier.couleurs.repos, 70) }}>
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
      </Bande>

      {paliers.map((palier, rang) => {
        const ouvert = palierOuvert(resolus, palier.numero);
        const faits = niveauxDuPalier(palier.numero).filter((n) =>
          resolus.includes(n),
        ).length;
        const suivant = paliers[rang + 1];
        const encre = palier.couleurs.repos;

        return (
          <div key={palier.numero} className="flex flex-col">
            <Bande
              fond={palier.couleurs.cible}
              encre={encre}
              className="pb-10"
            >
              <section
                className="apparait flex flex-col gap-4"
                style={{ animationDelay: `${rang * 120}ms` }}
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold">
                    Palier {palier.numero} · {palier.nom}
                  </h2>
                  {ouvert ? (
                    <span
                      className="ml-auto font-mono text-sm tabular-nums"
                      style={{ color: voile(encre, 65) }}
                    >
                      {faits} / {NIVEAUX_PAR_PALIER}
                    </span>
                  ) : (
                    <Cadenas
                      className="ml-auto h-5 w-5"
                      style={{ color: voile(encre, 65) }}
                      role="img"
                      aria-label="Palier verrouillé"
                    />
                  )}
                </div>

                <Niveaux
                  palier={palier}
                  resolus={resolus}
                  encre={encre}
                  fond={palier.couleurs.cible}
                  decalage={rang * 120}
                />
              </section>
            </Bande>

            {suivant && (
              // Le fond lui-même dégrade d'un palier vers le suivant.
              <div
                aria-hidden
                className="h-40 w-full"
                style={{ background: degradeEntre(palier, suivant) }}
              />
            )}
          </div>
        );
      })}

      <Bande
        fond={dernier.couleurs.cible}
        encre={dernier.couleurs.repos}
        className="pt-4 pb-16"
      >
        <footer
          className="apparait flex flex-col gap-3 border-t pt-6 text-sm"
          style={{
            borderColor: voile(dernier.couleurs.repos, 25),
            color: voile(dernier.couleurs.repos, 70),
          }}
        >
          <span>
            {resolus.length} / {TOTAL_NIVEAUX} niveaux résolus
          </span>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/mecaniques" className="underline-offset-4 hover:underline">
              Les anciens casse-têtes
            </Link>
            {resolus.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm("Effacer la progression ?")) {
                    reinitialiser();
                  }
                }}
                className="cursor-pointer underline-offset-4 hover:underline"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </footer>
      </Bande>
    </div>
  );
}
