"use client";

import { useEffect, useRef, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const CASES = 9;
/** Délai minimal entre deux touchers pour qu'ils comptent. */
const REPOS_MS = 1200;

/**
 * Niveau 20 — chaque toucher ne compte que s'il laisse passer un temps depuis
 * le précédent. S'empresser rallume tout. Écho au niveau où il fallait ne
 * rien faire : ici il faut faire, mais lentement.
 */
export function Silence({ onResolu }: NiveauProps) {
  const [atteintes, setAtteintes] = useState<number[]>([]);
  // L'horodatage vient de l'évènement lui-même : lire l'horloge dans le corps
  // du composant serait impur, et l'évènement porte déjà l'heure exacte.
  const dernierToucher = useRef<number | null>(null);

  useEffect(() => {
    if (atteintes.length >= CASES) onResolu();
  }, [atteintes, onResolu]);

  const toucher = (index: number, horodatage: number) => {
    if (atteintes.length >= CASES || atteintes.includes(index)) return;

    const precedent = dernierToucher.current;
    dernierToucher.current = horodatage;

    // Le tout premier toucher est libre : il n'y a rien à respecter encore.
    const tropTot = precedent !== null && horodatage - precedent < REPOS_MS;
    setAtteintes(tropTot ? [] : [...atteintes, index]);
  };

  return (
    <Grille colonnes={3}>
      {Array.from({ length: CASES }, (_, index) => (
        <Piece
          key={index}
          atteinte={atteintes.includes(index)}
          aria-label={`Case ${index + 1}`}
          onClick={(event) => toucher(index, event.timeStamp)}
        />
      ))}
    </Grille>
  );
}
