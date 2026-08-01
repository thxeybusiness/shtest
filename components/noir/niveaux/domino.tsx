"use client";

import { useEffect, useState } from "react";
import { useCouleurs } from "@/components/noir/couleurs";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 4;
const CASES = COTE * COTE;

function voisines(index: number): number[] {
  const ligne = Math.floor(index / COTE);
  const colonne = index % COTE;
  const liste: number[] = [];
  if (ligne > 0) liste.push(index - COTE);
  if (ligne < COTE - 1) liste.push(index + COTE);
  if (colonne > 0) liste.push(index - 1);
  if (colonne < COTE - 1) liste.push(index + 1);
  return liste;
}

/**
 * Niveau 48 — les cases ne s'allument jamais seules : elles vont par deux,
 * et seulement côte à côte. Toucher une paire posée la reprend, ce qui
 * permet de défaire un pavage qui ne mène nulle part.
 */
export function Domino({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [paires, setPaires] = useState<[number, number][]>([]);
  const [prise, setPrise] = useState<number | null>(null);

  const posees = paires.flat();
  const fini = posees.length >= CASES;

  useEffect(() => {
    if (fini) onResolu();
  }, [fini, onResolu]);

  const toucher = (index: number) => {
    if (fini) return;

    // Une paire déjà posée se reprend d'un toucher.
    const posee = paires.findIndex((paire) => paire.includes(index));
    if (posee !== -1) {
      setPaires(paires.filter((_, i) => i !== posee));
      setPrise(null);
      return;
    }

    if (prise === null || prise === index) {
      setPrise(prise === index ? null : index);
      return;
    }
    if (!voisines(prise).includes(index)) {
      setPrise(index);
      return;
    }

    setPaires([...paires, [prise, index]]);
    setPrise(null);
  };

  return (
    <Grille colonnes={COTE}>
      {Array.from({ length: CASES }, (_, index) => (
        <Piece
          key={index}
          atteinte={posees.includes(index)}
          aria-label={`Case ${index + 1}`}
          onClick={() => toucher(index)}
          style={
            prise === index
              ? { boxShadow: `inset 0 0 0 3px ${couleurs.cible}` }
              : undefined
          }
        />
      ))}
    </Grille>
  );
}
