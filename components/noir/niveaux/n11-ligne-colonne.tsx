"use client";

import { useEffect, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 4;

/**
 * Bascule toute la ligne et toute la colonne. La case visée appartient aux
 * deux : un ensemble évite de la basculer deux fois, ce qui l'annulerait.
 */
function basculer(cases: boolean[], index: number): boolean[] {
  const suivant = [...cases];
  const ligne = Math.floor(index / COTE);
  const colonne = index % COTE;
  const touchees = new Set<number>();

  for (let k = 0; k < COTE; k++) {
    touchees.add(ligne * COTE + k);
    touchees.add(k * COTE + colonne);
  }
  for (const i of touchees) suivant[i] = !suivant[i];
  return suivant;
}

/** Tirage depuis la grille résolue : elle reste donc toujours ramenable. */
function tirage(): boolean[] {
  let cases = Array<boolean>(COTE * COTE).fill(true);
  for (let i = 0; i < 5; i++) {
    cases = basculer(cases, Math.floor(Math.random() * COTE * COTE));
  }
  return cases.every(Boolean) ? tirage() : cases;
}

/** Niveau 11 — un toucher emporte la ligne et la colonne entières. */
export function LigneColonne({ onResolu }: NiveauProps) {
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
          onClick={() => setCases((c) => basculer(c, index))}
        />
      ))}
    </Grille>
  );
}
