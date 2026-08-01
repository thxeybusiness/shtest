"use client";

import { useEffect, useState } from "react";
import { Piece, Rangee } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const NOMBRE = 4;

/**
 * Le câblage : chaque interrupteur commande un sous-ensemble de lampes, noté
 * en bits. On ne garde qu'un câblage inversible, sinon certaines
 * combinaisons de lampes seraient hors d'atteinte.
 */
function inversible(cablage: number[]): boolean {
  const lignes = [...cablage];
  let rang = 0;
  for (let bit = 0; bit < NOMBRE; bit++) {
    const pivot = lignes.findIndex(
      (ligne, i) => i >= rang && (ligne & (1 << bit)) !== 0,
    );
    if (pivot === -1) continue;
    [lignes[rang], lignes[pivot]] = [lignes[pivot], lignes[rang]];
    for (let i = 0; i < NOMBRE; i++) {
      if (i !== rang && (lignes[i] & (1 << bit)) !== 0) lignes[i] ^= lignes[rang];
    }
    rang++;
  }
  return rang === NOMBRE;
}

function tirage(): number[] {
  const cablage = Array.from({ length: NOMBRE }, () =>
    Math.floor(Math.random() * ((1 << NOMBRE) - 1)) + 1,
  );
  return inversible(cablage) ? cablage : tirage();
}

/**
 * Niveau 28 — quatre interrupteurs au-dessus, quatre lampes en dessous, et
 * un câblage que rien n'indique. Chaque interrupteur en commande plusieurs,
 * et il faut les allumer toutes.
 */
export function Interrupteurs({ onResolu }: NiveauProps) {
  const [cablage, setCablage] = useState<number[]>([]);
  const [baisses, setBaisses] = useState<boolean[]>(() =>
    Array<boolean>(NOMBRE).fill(false),
  );

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCablage(tirage());
  }, []);

  const lampes = Array.from({ length: NOMBRE }, (_, lampe) =>
    baisses.reduce(
      (allumee, baisse, i) =>
        baisse && (cablage[i] & (1 << lampe)) !== 0 ? !allumee : allumee,
      false,
    ),
  );
  const toutes = cablage.length > 0 && lampes.every(Boolean);

  useEffect(() => {
    if (toutes) onResolu();
  }, [toutes, onResolu]);

  return (
    <div className="flex w-full flex-col gap-10">
      <Rangee>
        {baisses.map((baisse, index) => (
          <Piece
            key={index}
            atteinte={baisse}
            aria-label={`Interrupteur ${index + 1}`}
            onClick={() =>
              setBaisses(baisses.map((b, i) => (i === index ? !b : b)))
            }
            className="flex-1"
          />
        ))}
      </Rangee>

      <Rangee>
        {lampes.map((allumee, index) => (
          <Piece
            key={index}
            forme="rond"
            atteinte={allumee}
            aria-label={`Lampe ${index + 1}`}
            disabled
            className="flex-1"
          />
        ))}
      </Rangee>
    </div>
  );
}
