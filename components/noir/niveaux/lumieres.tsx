"use client";

import { useEffect, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 5;
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
  for (let i = 0; i < 7; i++) {
    cases = croix(cases, Math.floor(Math.random() * CASES));
  }
  return cases.every(Boolean) ? tirage() : cases;
}

/**
 * Niveau 41 — la mécanique du deuxième niveau, sur vingt-cinq cases. Ce qui
 * se faisait à vue sur quatre par quatre demande ici de descendre ligne par
 * ligne : la première rangée décide de tout le reste.
 */
export function Lumieres({ onResolu }: NiveauProps) {
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
          atteinte={atteinte}
          aria-label={`Case ${index + 1}`}
          onClick={() => setCases((c) => croix(c, index))}
        />
      ))}
    </Grille>
  );
}
