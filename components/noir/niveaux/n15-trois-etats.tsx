"use client";

import { useEffect, useState } from "react";
import { melange, useCouleurs } from "@/components/noir/couleurs";
import { Grille } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 3;
const CASES = COTE * COTE;
const ETATS = 3;

/** Avance d'un cran la case visée et ses quatre voisines en diagonale. */
function avancer(cases: number[], index: number): number[] {
  const suivant = [...cases];
  const ligne = Math.floor(index / COTE);
  const colonne = index % COTE;

  for (const [l, c] of [
    [ligne, colonne],
    [ligne - 1, colonne - 1],
    [ligne - 1, colonne + 1],
    [ligne + 1, colonne - 1],
    [ligne + 1, colonne + 1],
  ]) {
    if (l < 0 || l >= COTE || c < 0 || c >= COTE) continue;
    const i = l * COTE + c;
    suivant[i] = (suivant[i] + 1) % ETATS;
  }
  return suivant;
}

/**
 * Tirage depuis la grille résolue. Chaque toucher étant d'ordre 3, appliquer
 * des touchers au hasard laisse toujours un chemin de retour.
 */
function tirage(): number[] {
  let cases = Array<number>(CASES).fill(ETATS - 1);
  for (let i = 0; i < 6; i++) {
    cases = avancer(cases, Math.floor(Math.random() * CASES));
  }
  return cases.every((e) => e === ETATS - 1) ? tirage() : cases;
}

/**
 * Niveau 15 — les cases ont trois teintes et n'avancent que d'un cran à la
 * fois, en emportant leurs diagonales. Il faut toutes les amener au bout.
 */
export function TroisEtats({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [cases, setCases] = useState<number[]>([]);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCases(tirage());
  }, []);

  useEffect(() => {
    if (cases.length > 0 && cases.every((e) => e === ETATS - 1)) onResolu();
  }, [cases, onResolu]);

  return (
    <Grille colonnes={COTE}>
      {cases.map((etat, index) => (
        <button
          key={index}
          aria-label={`Case ${index + 1}, état ${etat + 1} sur ${ETATS}`}
          onClick={() => setCases((c) => avancer(c, index))}
          className="aspect-square cursor-pointer rounded-sm transition-colors duration-200"
          style={{ backgroundColor: melange(couleurs, etat / (ETATS - 1)) }}
        />
      ))}
    </Grille>
  );
}
