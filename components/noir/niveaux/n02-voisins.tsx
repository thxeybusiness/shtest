"use client";

import { useEffect, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 4;

/** Bascule la case visée et ses quatre voisines orthogonales. */
function basculer(cases: boolean[], index: number): boolean[] {
  const suivant = [...cases];
  const ligne = Math.floor(index / COTE);
  const colonne = index % COTE;

  for (const [l, c] of [
    [ligne, colonne],
    [ligne - 1, colonne],
    [ligne + 1, colonne],
    [ligne, colonne - 1],
    [ligne, colonne + 1],
  ]) {
    if (l < 0 || l >= COTE || c < 0 || c >= COTE) continue;
    suivant[l * COTE + c] = !suivant[l * COTE + c];
  }
  return suivant;
}

/**
 * Niveau 2 — un toucher bascule aussi les voisines. Le tirage part de la
 * grille noire et applique des touchers au hasard : elle est donc toujours
 * ramenable au noir.
 */
function tirage(): boolean[] {
  let cases = Array<boolean>(COTE * COTE).fill(true);
  for (let i = 0; i < 6; i++) {
    cases = basculer(cases, Math.floor(Math.random() * COTE * COTE));
  }
  return cases.every(Boolean) ? tirage() : cases;
}

export function Voisins({ onResolu }: NiveauProps) {
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
      {cases.map((noire, index) => (
        <Piece
          key={index}
          noire={noire}
          onClick={() => setCases((c) => basculer(c, index))}
        />
      ))}
    </Grille>
  );
}
