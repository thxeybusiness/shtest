"use client";

import { useEffect, useState } from "react";
import { melange, useCouleurs } from "@/components/noir/couleurs";
import { Grille } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 4;
const CASES = COTE * COTE;
const TEINTES = 3;
/** Tout part du coin haut-gauche : c'est lui qui contamine le reste. */
const FOYER = 0;

/** Indices de la tache qui touche le foyer, de proche en proche. */
function tache(cases: number[]): number[] {
  const teinte = cases[FOYER];
  const dedans = [FOYER];
  const aVoir = [FOYER];

  while (aVoir.length > 0) {
    const index = aVoir.pop() as number;
    const ligne = Math.floor(index / COTE);
    const colonne = index % COTE;

    for (const [l, c] of [
      [ligne - 1, colonne],
      [ligne + 1, colonne],
      [ligne, colonne - 1],
      [ligne, colonne + 1],
    ]) {
      if (l < 0 || l >= COTE || c < 0 || c >= COTE) continue;
      const voisine = l * COTE + c;
      if (cases[voisine] !== teinte || dedans.includes(voisine)) continue;
      dedans.push(voisine);
      aVoir.push(voisine);
    }
  }
  return dedans;
}

/** La tache prend la teinte de la case touchée, et s'étend d'autant. */
function contaminer(cases: number[], teinte: number): number[] {
  const suivant = [...cases];
  for (const index of tache(cases)) suivant[index] = teinte;
  return suivant;
}

function tirage(): number[] {
  const cases = Array.from({ length: CASES }, () =>
    Math.floor(Math.random() * TEINTES),
  );
  return cases.every((t) => t === cases[0]) ? tirage() : cases;
}

/**
 * Niveau 33 — toucher une case ne change pas cette case : c'est la tache du
 * coin haut-gauche qui prend sa teinte, et qui grandit de tout ce qu'elle
 * touche. Il faut l'étendre à la grille entière.
 *
 * N'importe quelle teinte fait l'affaire pourvu qu'elle recouvre tout : une
 * teinte n'étant choisissable qu'en touchant une case qui la porte, exiger
 * une teinte précise laisserait le joueur bloqué dès qu'elle disparaît.
 */
export function Contagion({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [cases, setCases] = useState<number[]>([]);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCases(tirage());
  }, []);

  const unie = cases.length > 0 && cases.every((t) => t === cases[0]);

  useEffect(() => {
    if (unie) onResolu();
  }, [unie, onResolu]);

  return (
    <Grille colonnes={COTE}>
      {cases.map((teinte, index) => (
        <button
          key={index}
          aria-label={`Case ${index + 1}, teinte ${teinte + 1}`}
          onClick={() => setCases((c) => contaminer(c, c[index]))}
          className="aspect-square cursor-pointer rounded-sm transition-colors duration-200"
          style={{
            backgroundColor: unie
              ? couleurs.cible
              : melange(couleurs, teinte / (TEINTES - 1)),
          }}
        />
      ))}
    </Grille>
  );
}
