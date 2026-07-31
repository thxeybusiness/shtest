"use client";

import { useEffect, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 4;

/** Bascule la case visée et son reflet dans l'axe vertical. */
function basculer(cases: boolean[], index: number): boolean[] {
  const suivant = [...cases];
  const ligne = Math.floor(index / COTE);
  const colonne = index % COTE;
  const reflet = ligne * COTE + (COTE - 1 - colonne);

  suivant[index] = !suivant[index];
  suivant[reflet] = !suivant[reflet];
  return suivant;
}

/**
 * Niveau 6 — chaque toucher se répercute sur la case symétrique. Le tirage
 * part du noir, donc la grille reste toujours ramenable au noir.
 */
function tirage(): boolean[] {
  let cases = Array<boolean>(COTE * COTE).fill(true);
  for (let i = 0; i < 5; i++) {
    cases = basculer(cases, Math.floor(Math.random() * COTE * COTE));
  }
  return cases.every(Boolean) ? tirage() : cases;
}

export function Miroir({ onResolu }: NiveauProps) {
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
