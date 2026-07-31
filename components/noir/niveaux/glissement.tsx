"use client";

import { useEffect, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 4;

/**
 * Fait tourner la ligne d'un cran vers la droite, puis retourne sa première
 * case. Un simple glissement ne suffirait pas : il conserve le nombre de
 * cases atteintes, donc une ligne trouée le resterait à jamais. Le retour de
 * la première case rend la ligne rattrapable — l'opération est d'ordre huit,
 * si bien qu'insister finit toujours par ramener la ligne au complet.
 */
function glisser(cases: boolean[], index: number): boolean[] {
  const suivant = [...cases];
  const debut = Math.floor(index / COTE) * COTE;
  const derniere = suivant[debut + COTE - 1];

  for (let c = COTE - 1; c > 0; c--) {
    suivant[debut + c] = suivant[debut + c - 1];
  }
  suivant[debut] = !derniere;
  return suivant;
}

/** Tirage : on avance chaque ligne d'un nombre de crans tiré au hasard. */
function tirage(): boolean[] {
  let cases = Array<boolean>(COTE * COTE).fill(true);
  for (let ligne = 0; ligne < COTE; ligne++) {
    const crans = 1 + Math.floor(Math.random() * 7);
    for (let k = 0; k < crans; k++) cases = glisser(cases, ligne * COTE);
  }
  return cases.every(Boolean) ? tirage() : cases;
}

/**
 * Niveau 18 — toute la ligne avance d'un cran, quelle que soit la case
 * touchée, et sa tête change d'état au passage.
 */
export function Glissement({ onResolu }: NiveauProps) {
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
          onClick={() => setCases((c) => glisser(c, index))}
        />
      ))}
    </Grille>
  );
}
