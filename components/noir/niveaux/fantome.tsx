"use client";

import { useEffect, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 4;
const CASES = COTE * COTE;

/**
 * La case touchée s'allume, et celle juste au-dessus s'éteint. Il faut donc
 * remonter : commencer par le bas, sinon on efface ce qu'on vient de faire.
 */
function toucher(cases: boolean[], index: number): boolean[] {
  const suivant = [...cases];
  suivant[index] = !suivant[index];
  if (index >= COTE) suivant[index - COTE] = false;
  return suivant;
}

/**
 * Niveau 23 — chaque case emporte sa voisine du dessus dans sa chute. Le
 * seul ordre qui tienne est celui qu'on ne prend jamais : du bas vers le
 * haut.
 */
export function Fantome({ onResolu }: NiveauProps) {
  const [cases, setCases] = useState<boolean[]>(() =>
    Array<boolean>(CASES).fill(false),
  );

  useEffect(() => {
    if (cases.every(Boolean)) onResolu();
  }, [cases, onResolu]);

  return (
    <Grille colonnes={COTE}>
      {cases.map((atteinte, index) => (
        <Piece
          key={index}
          atteinte={atteinte}
          aria-label={`Case ${index + 1}`}
          onClick={() => setCases((c) => toucher(c, index))}
        />
      ))}
    </Grille>
  );
}
