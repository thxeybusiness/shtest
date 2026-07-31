"use client";

import { useEffect, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 4;

/**
 * Bascule la case et ses trois reflets, horizontal, vertical et diagonal. Un
 * ensemble évite de basculer deux fois une case qui serait son propre reflet.
 */
function basculer(cases: boolean[], index: number): boolean[] {
  const suivant = [...cases];
  const ligne = Math.floor(index / COTE);
  const colonne = index % COTE;
  const miroirLigne = COTE - 1 - ligne;
  const miroirColonne = COTE - 1 - colonne;

  const touchees = new Set([
    ligne * COTE + colonne,
    ligne * COTE + miroirColonne,
    miroirLigne * COTE + colonne,
    miroirLigne * COTE + miroirColonne,
  ]);
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

/** Niveau 17 — la grille a deux axes, et les quatre coins suivent ensemble. */
export function SymetrieDouble({ onResolu }: NiveauProps) {
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
