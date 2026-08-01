"use client";

import { useEffect, useState } from "react";
import { Piece, Rangee } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const CRANS = 8;
const ANNEAUX = 3;
/** Ce que chaque anneau entraîne sur le suivant en tournant d'un cran. */
const PRISE = [2, 3];

/** Tourne l'anneau visé d'un cran, et le suivant d'autant que la prise. */
function tourner(marques: number[], anneau: number): number[] {
  const suivant = [...marques];
  suivant[anneau] = (suivant[anneau] + 1) % CRANS;
  if (anneau < ANNEAUX - 1) {
    suivant[anneau + 1] = (suivant[anneau + 1] + PRISE[anneau]) % CRANS;
  }
  return suivant;
}

function tirage(): number[] {
  let marques = Array<number>(ANNEAUX).fill(0);
  for (let i = 0; i < 6; i++) {
    marques = tourner(marques, Math.floor(Math.random() * ANNEAUX));
  }
  return marques.every((m) => m === 0) ? tirage() : marques;
}

/**
 * Niveau 39 — trois anneaux, et une seule marque sur chacun. Faire tourner
 * l'un entraîne le suivant, plus vite que lui. Les trois marques doivent
 * revenir en haut.
 */
export function Engrenage({ onResolu }: NiveauProps) {
  const [marques, setMarques] = useState<number[]>([]);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMarques(tirage());
  }, []);

  const aligne = marques.length > 0 && marques.every((m) => m === 0);

  useEffect(() => {
    if (aligne) onResolu();
  }, [aligne, onResolu]);

  return (
    <div className="flex w-full flex-col gap-6">
      {marques.map((marque, anneau) => (
        <Rangee key={anneau}>
          {Array.from({ length: CRANS }, (_, cran) => (
            <Piece
              key={cran}
              forme="rond"
              atteinte={aligne || cran === marque}
              aria-label={`Anneau ${anneau + 1}, cran ${cran + 1}`}
              onClick={() => setMarques((m) => tourner(m, anneau))}
              className="flex-1"
            />
          ))}
        </Rangee>
      ))}
    </div>
  );
}
