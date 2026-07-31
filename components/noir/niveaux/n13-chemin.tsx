"use client";

import { useEffect, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 3;
const CASES = COTE * COTE;

function voisines(index: number): number[] {
  const ligne = Math.floor(index / COTE);
  const colonne = index % COTE;
  const res: number[] = [];

  if (ligne > 0) res.push(index - COTE);
  if (ligne < COTE - 1) res.push(index + COTE);
  if (colonne > 0) res.push(index - 1);
  if (colonne < COTE - 1) res.push(index + 1);
  return res;
}

/**
 * Niveau 13 — il faut parcourir les neuf cases d'un seul trait, chaque case
 * touchant la précédente. Un écart remet tout à zéro, et une impasse aussi :
 * sur une grille 3×3, un tel parcours ne peut commencer qu'à un coin ou au
 * centre, ce que le joueur découvre en s'y cassant les dents.
 */
export function Chemin({ onResolu }: NiveauProps) {
  const [chemin, setChemin] = useState<number[]>([]);

  useEffect(() => {
    if (chemin.length >= CASES) onResolu();
  }, [chemin, onResolu]);

  // Impasse : plus aucune voisine libre alors qu'il reste des cases.
  useEffect(() => {
    if (chemin.length === 0 || chemin.length >= CASES) return;

    const derniere = chemin[chemin.length - 1];
    const libres = voisines(derniere).filter((v) => !chemin.includes(v));
    if (libres.length > 0) return;

    const id = window.setTimeout(() => setChemin([]), 500);
    return () => window.clearTimeout(id);
  }, [chemin]);

  const toucher = (index: number) => {
    if (chemin.length >= CASES) return;

    if (chemin.length === 0) {
      setChemin([index]);
      return;
    }
    if (chemin.includes(index)) return;

    const derniere = chemin[chemin.length - 1];
    setChemin(voisines(derniere).includes(index) ? [...chemin, index] : []);
  };

  return (
    <Grille colonnes={COTE}>
      {Array.from({ length: CASES }, (_, index) => (
        <Piece
          key={index}
          atteinte={chemin.includes(index)}
          aria-label={`Case ${index + 1}`}
          onClick={() => toucher(index)}
        />
      ))}
    </Grille>
  );
}
