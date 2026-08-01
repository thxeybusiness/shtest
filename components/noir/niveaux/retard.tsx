"use client";

import { useEffect, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 4;
const CASES = COTE * COTE;

/** Bascule la case et ses quatre voisines orthogonales. */
function croix(cases: boolean[], index: number): boolean[] {
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

function tirage(): boolean[] {
  let cases = Array<boolean>(CASES).fill(true);
  for (let i = 0; i < 4; i++) {
    cases = croix(cases, Math.floor(Math.random() * CASES));
  }
  return cases.every(Boolean) ? tirage() : cases;
}

/**
 * Niveau 34 — un toucher ne fait rien sur le moment : il attend le suivant
 * pour prendre effet. On joue donc toujours avec un coup de retard, et il
 * faut un dernier toucher pour libérer l'avant-dernier.
 */
export function Retard({ onResolu }: NiveauProps) {
  const [cases, setCases] = useState<boolean[]>([]);
  const [enAttente, setEnAttente] = useState<number | null>(null);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCases(tirage());
  }, []);

  useEffect(() => {
    if (cases.length > 0 && cases.every(Boolean)) onResolu();
  }, [cases, onResolu]);

  const toucher = (index: number) => {
    if (enAttente !== null) setCases((c) => croix(c, enAttente));
    setEnAttente(index);
  };

  return (
    <Grille colonnes={COTE}>
      {cases.map((atteinte, index) => (
        <Piece
          key={index}
          atteinte={atteinte}
          aria-label={`Case ${index + 1}`}
          onClick={() => toucher(index)}
        />
      ))}
    </Grille>
  );
}
