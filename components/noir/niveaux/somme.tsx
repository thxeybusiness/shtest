"use client";

import { useEffect, useState } from "react";
import { useCouleurs } from "@/components/noir/couleurs";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const CASES = 9;

function melangerValeurs(): number[] {
  const valeurs = Array.from({ length: CASES }, (_, i) => i + 1);
  for (let i = valeurs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [valeurs[i], valeurs[j]] = [valeurs[j], valeurs[i]];
  }
  return valeurs;
}

/** Cible atteignable par construction : la somme d'un sous-ensemble tiré. */
function tirerCible(valeurs: number[]): number {
  const combien = 3 + Math.floor(Math.random() * 2);
  return [...valeurs]
    .sort(() => Math.random() - 0.5)
    .slice(0, combien)
    .reduce((total, v) => total + v, 0);
}

/**
 * Niveau 14 — le grand nombre doit tomber exactement à zéro. Chaque case
 * retire sa valeur ; dépasser remet tout en place. La grille entière bascule
 * quand le compte est juste.
 */
export function Somme({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [valeurs, setValeurs] = useState<number[]>([]);
  const [reste, setReste] = useState(0);
  const [prises, setPrises] = useState<number[]>([]);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    const tirees = melangerValeurs();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValeurs(tirees);
    setReste(tirerCible(tirees));
  }, []);

  const gagne = valeurs.length > 0 && reste === 0;

  useEffect(() => {
    if (gagne) onResolu();
  }, [gagne, onResolu]);

  const toucher = (index: number) => {
    if (gagne || prises.includes(index)) return;

    const suivant = reste - valeurs[index];
    if (suivant < 0) {
      // Dépassement : on repart de la cible d'origine.
      setReste(prises.reduce((t, i) => t + valeurs[i], reste));
      setPrises([]);
      return;
    }
    setReste(suivant);
    setPrises([...prises, index]);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <span
        className="text-center font-mono text-5xl font-bold tabular-nums"
        style={{ color: couleurs.cible }}
      >
        {reste}
      </span>

      <Grille colonnes={3}>
        {valeurs.map((valeur, index) => {
          const atteinte = gagne || prises.includes(index);
          return (
            <Piece
              key={index}
              atteinte={atteinte}
              aria-label={`Case ${valeur}`}
              onClick={() => toucher(index)}
              className="flex items-center justify-center"
            >
              <span
                className="text-lg font-bold"
                style={{ color: atteinte ? couleurs.repos : couleurs.cible }}
              >
                {valeur}
              </span>
            </Piece>
          );
        })}
      </Grille>
    </div>
  );
}
