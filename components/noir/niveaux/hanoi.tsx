"use client";

import { useEffect, useState } from "react";
import { melange, useCouleurs } from "@/components/noir/couleurs";
import type { NiveauProps } from "@/lib/noir/types";

const DISQUES = 4;
const PILES = 3;

type Piles = number[][];

function depart(): Piles {
  return [Array.from({ length: DISQUES }, (_, i) => DISQUES - i), [], []];
}

/**
 * Niveau 40 — quatre disques à emmener sur la dernière pile. Un disque ne se
 * pose jamais sur plus petit que lui : c'est la seule règle, et elle suffit
 * à rendre le chemin long.
 */
export function Hanoi({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [piles, setPiles] = useState<Piles>(depart);
  const [prise, setPrise] = useState<number | null>(null);

  const fini = piles[PILES - 1].length === DISQUES;

  useEffect(() => {
    if (fini) onResolu();
  }, [fini, onResolu]);

  const toucher = (pile: number) => {
    if (fini) return;

    if (prise === null) {
      if (piles[pile].length > 0) setPrise(pile);
      return;
    }
    if (prise === pile) {
      setPrise(null);
      return;
    }

    const disque = piles[prise].at(-1) as number;
    const dessus = piles[pile].at(-1);
    if (dessus !== undefined && dessus < disque) {
      // Poser sur plus petit est refusé : on repose le disque d'où il vient.
      setPrise(null);
      return;
    }

    setPiles(
      piles.map((contenu, i) =>
        i === prise
          ? contenu.slice(0, -1)
          : i === pile
            ? [...contenu, disque]
            : contenu,
      ),
    );
    setPrise(null);
  };

  return (
    // Hauteur fixe : les trois socles doivent rester alignés même quand une
    // pile se vide.
    <div className="flex h-56 w-full items-stretch gap-4">
      {piles.map((contenu, pile) => (
        <button
          key={pile}
          aria-label={`Pile ${pile + 1}`}
          onClick={() => toucher(pile)}
          className="flex min-w-0 flex-1 cursor-pointer flex-col-reverse items-center gap-1.5 rounded-sm pb-2 transition-colors duration-200"
          style={{
            borderBottom: `3px solid ${fini ? couleurs.cible : couleurs.repos}`,
            backgroundColor:
              prise === pile
                ? `color-mix(in srgb, ${couleurs.cible} 12%, transparent)`
                : "transparent",
          }}
        >
          {contenu.map((disque, rang) => (
            <span
              key={disque}
              className="h-5 rounded-full transition-all duration-200"
              style={{
                width: `${34 + disque * 16}%`,
                backgroundColor: fini
                  ? couleurs.cible
                  : melange(couleurs, disque / DISQUES),
                transform:
                  prise === pile && rang === contenu.length - 1
                    ? "translateY(-6px)"
                    : "none",
              }}
            />
          ))}
        </button>
      ))}
    </div>
  );
}
