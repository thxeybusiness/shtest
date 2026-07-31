"use client";

import { useEffect, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 4;
const CASES = COTE * COTE;

/** Moitié gauche ou droite de la grille. */
function moitie(index: number): "gauche" | "droite" {
  return index % COTE < COTE / 2 ? "gauche" : "droite";
}

/**
 * Niveau 19 — il faut alterner d'une moitié à l'autre à chaque toucher. Deux
 * touchers du même côté d'affilée rallument tout. Les deux moitiés comptant
 * huit cases, l'alternance tombe juste.
 */
export function Alternance({ onResolu }: NiveauProps) {
  const [atteintes, setAtteintes] = useState<number[]>([]);

  useEffect(() => {
    if (atteintes.length >= CASES) onResolu();
  }, [atteintes, onResolu]);

  const toucher = (index: number) => {
    if (atteintes.length >= CASES || atteintes.includes(index)) return;

    const derniere = atteintes[atteintes.length - 1];
    const memeCote =
      derniere !== undefined && moitie(derniere) === moitie(index);

    setAtteintes(memeCote ? [] : [...atteintes, index]);
  };

  return (
    <Grille colonnes={COTE}>
      {Array.from({ length: CASES }, (_, index) => (
        <Piece
          key={index}
          atteinte={atteintes.includes(index)}
          aria-label={`Case ${index + 1}`}
          onClick={() => toucher(index)}
        />
      ))}
    </Grille>
  );
}
