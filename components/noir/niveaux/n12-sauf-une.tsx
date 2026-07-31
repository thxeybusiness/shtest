"use client";

import { useEffect, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 4;

/** Bascule toutes les cases sauf celle qu'on touche. */
function basculer(cases: boolean[], index: number): boolean[] {
  return cases.map((valeur, i) => (i === index ? valeur : !valeur));
}

/** Tirage depuis la grille résolue : elle reste donc toujours ramenable. */
function tirage(): boolean[] {
  let cases = Array<boolean>(COTE * COTE).fill(true);
  for (let i = 0; i < 5; i++) {
    cases = basculer(cases, Math.floor(Math.random() * COTE * COTE));
  }
  return cases.every(Boolean) ? tirage() : cases;
}

/**
 * Niveau 12 — la case touchée est la seule à ne pas bouger. Tout l'inverse de
 * ce que l'on croit faire.
 */
export function SaufUne({ onResolu }: NiveauProps) {
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
