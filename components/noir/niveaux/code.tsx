"use client";

import { useEffect, useState } from "react";
import { melange, useCouleurs } from "@/components/noir/couleurs";
import { Rangee } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const PIONS = 4;
const TEINTES = 5;

function tirage(): number[] {
  return Array.from({ length: PIONS }, () =>
    Math.floor(Math.random() * TEINTES),
  );
}

/**
 * Niveau 32 — chaque pion passe d'une teinte à l'autre, et les quatre
 * repères du haut disent seulement combien sont à leur place. Jamais
 * lesquels.
 */
export function Code({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [combinaison, setCombinaison] = useState<number[]>([]);
  const [essai, setEssai] = useState<number[]>(() =>
    Array<number>(PIONS).fill(0),
  );

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    let tire = tirage();
    // Une combinaison déjà affichée ne serait pas une énigme.
    while (tire.every((teinte) => teinte === 0)) tire = tirage();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCombinaison(tire);
  }, []);

  const justes =
    combinaison.length === 0
      ? 0
      : essai.filter((teinte, i) => teinte === combinaison[i]).length;
  const trouve = combinaison.length > 0 && justes === PIONS;

  useEffect(() => {
    if (trouve) onResolu();
  }, [trouve, onResolu]);

  return (
    <div className="flex w-full flex-col gap-12">
      <div className="flex justify-center gap-3" aria-label="Repères">
        {Array.from({ length: PIONS }, (_, i) => (
          <div
            key={i}
            data-juste={i < justes}
            className="h-3 w-3 rounded-full transition-colors duration-200"
            style={{
              backgroundColor: i < justes ? couleurs.cible : couleurs.repos,
            }}
          />
        ))}
      </div>

      <Rangee>
        {essai.map((teinte, index) => (
          <button
            key={index}
            aria-label={`Pion ${index + 1}`}
            onClick={() =>
              setEssai(
                essai.map((t, i) => (i === index ? (t + 1) % TEINTES : t)),
              )
            }
            className="aspect-square flex-1 cursor-pointer rounded-full transition-colors duration-200"
            style={{
              backgroundColor: trouve
                ? couleurs.cible
                : melange(couleurs, teinte / (TEINTES - 1)),
            }}
          />
        ))}
      </Rangee>
    </div>
  );
}
