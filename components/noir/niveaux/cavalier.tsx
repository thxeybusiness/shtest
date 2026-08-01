"use client";

import { useEffect, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 4;
const CASES = COTE * COTE;

/** Les huit sauts du cavalier. */
const SAUTS = [
  [1, 2],
  [2, 1],
  [-1, 2],
  [-2, 1],
  [1, -2],
  [2, -1],
  [-1, -2],
  [-2, -1],
];

/** Bascule la case et toutes celles qu'un cavalier atteindrait depuis elle. */
function basculer(cases: boolean[], index: number): boolean[] {
  const suivant = [...cases];
  const ligne = Math.floor(index / COTE);
  const colonne = index % COTE;

  suivant[index] = !suivant[index];
  for (const [dl, dc] of SAUTS) {
    const l = ligne + dl;
    const c = colonne + dc;
    if (l >= 0 && l < COTE && c >= 0 && c < COTE) {
      suivant[l * COTE + c] = !suivant[l * COTE + c];
    }
  }
  return suivant;
}

/** Tirage depuis la grille pleine : le chemin de retour existe toujours. */
function tirage(): boolean[] {
  let cases = Array<boolean>(CASES).fill(true);
  for (let i = 0; i < 4; i++) {
    cases = basculer(cases, Math.floor(Math.random() * CASES));
  }
  return cases.every(Boolean) ? tirage() : cases;
}

/**
 * Niveau 22 — le toucher n'emporte pas les voisines mais les cases à un saut
 * de cavalier, celles que l'on ne pense jamais à regarder.
 */
export function Cavalier({ onResolu }: NiveauProps) {
  const [cases, setCases] = useState<boolean[]>([]);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCases(tirage());
  }, []);

  useEffect(() => {
    if (cases.length > 0 && cases.every(Boolean)) onResolu();
  }, [cases, onResolu]);

  return (
    <Grille colonnes={COTE}>
      {cases.map((atteinte, index) => (
        <Piece
          key={index}
          forme="rond"
          atteinte={atteinte}
          aria-label={`Case ${index + 1}`}
          onClick={() => setCases((c) => basculer(c, index))}
        />
      ))}
    </Grille>
  );
}
