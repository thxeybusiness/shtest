"use client";

import { useEffect, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 5;
const CASES = COTE * COTE;
/** Temps de constat avant que le parcours bloqué ne se rallume. */
const IMPASSE_MS = 600;

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

function accessibles(depuis: number): number[] {
  const ligne = Math.floor(depuis / COTE);
  const colonne = depuis % COTE;
  const liste: number[] = [];

  for (const [dl, dc] of SAUTS) {
    const l = ligne + dl;
    const c = colonne + dc;
    if (l >= 0 && l < COTE && c >= 0 && c < COTE) liste.push(l * COTE + c);
  }
  return liste;
}

/**
 * Niveau 43 — les cases s'enchaînent par sauts de cavalier, sans jamais
 * repasser. Toutes les cases de départ ne mènent pas au bout : une impasse
 * rallume la grille.
 */
export function Tournee({ onResolu }: NiveauProps) {
  const [parcours, setParcours] = useState<number[]>([]);

  const fini = parcours.length >= CASES;
  const bloque =
    !fini &&
    parcours.length > 0 &&
    accessibles(parcours[parcours.length - 1]).every((c) =>
      parcours.includes(c),
    );

  useEffect(() => {
    if (fini) onResolu();
  }, [fini, onResolu]);

  // Impasse : le parcours s'efface de lui-même, il n'y a rien à débloquer.
  useEffect(() => {
    if (!bloque) return;
    const id = window.setTimeout(() => setParcours([]), IMPASSE_MS);
    return () => window.clearTimeout(id);
  }, [bloque]);

  const toucher = (index: number) => {
    if (fini || bloque || parcours.includes(index)) return;

    const derniere = parcours[parcours.length - 1];
    if (derniere !== undefined && !accessibles(derniere).includes(index)) {
      return;
    }
    setParcours([...parcours, index]);
  };

  return (
    <Grille colonnes={COTE}>
      {Array.from({ length: CASES }, (_, index) => (
        <Piece
          key={index}
          atteinte={parcours.includes(index)}
          aria-label={`Case ${index + 1}`}
          onClick={() => toucher(index)}
        />
      ))}
    </Grille>
  );
}
