"use client";

import { useEffect, useRef, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const CASES = 9;
/** Deux touchers plus espacés que cela ne comptent plus pour un seul. */
const SEUIL_MS = 420;

/**
 * Niveau 25 — un toucher ne fait rien du tout, et rien ne le signale. Il en
 * faut deux, rapprochés, sur la même case.
 */
export function Double({ onResolu }: NiveauProps) {
  const [atteintes, setAtteintes] = useState<number[]>([]);
  // L'horodatage vient de l'évènement : lire l'horloge pendant le rendu
  // serait impur, et l'évènement porte déjà l'heure exacte.
  const dernier = useRef<{ index: number; heure: number } | null>(null);

  useEffect(() => {
    if (atteintes.length >= CASES) onResolu();
  }, [atteintes, onResolu]);

  const toucher = (index: number, heure: number) => {
    if (atteintes.includes(index)) return;

    const precedent = dernier.current;
    if (
      precedent !== null &&
      precedent.index === index &&
      heure - precedent.heure < SEUIL_MS
    ) {
      dernier.current = null;
      setAtteintes([...atteintes, index]);
      return;
    }
    dernier.current = { index, heure };
  };

  return (
    <Grille colonnes={3}>
      {Array.from({ length: CASES }, (_, index) => (
        <Piece
          key={index}
          forme="rond"
          atteinte={atteintes.includes(index)}
          aria-label={`Case ${index + 1}`}
          onClick={(event) => toucher(index, event.timeStamp)}
          className="touch-manipulation"
        />
      ))}
    </Grille>
  );
}
