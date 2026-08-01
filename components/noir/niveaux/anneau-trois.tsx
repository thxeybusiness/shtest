"use client";

import { useEffect, useState } from "react";
import { melange, useCouleurs } from "@/components/noir/couleurs";
import { Couronne } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const CASES = 9;
const ETATS = 3;
/** La portée du toucher sur l'anneau : les deux crans de part et d'autre. */
const PORTEE = [0, 1, -1, 2, -2];

function avancer(cases: number[], index: number): number[] {
  const suivant = [...cases];
  for (const ecart of PORTEE) {
    const i = (index + ecart + CASES) % CASES;
    suivant[i] = (suivant[i] + 1) % ETATS;
  }
  return suivant;
}

function tirage(): number[] {
  let cases = Array<number>(CASES).fill(ETATS - 1);
  for (let i = 0; i < 5; i++) {
    cases = avancer(cases, Math.floor(Math.random() * CASES));
  }
  return cases.every((e) => e === ETATS - 1) ? tirage() : cases;
}

/**
 * Niveau 44 — l'anneau et les trois teintes réunis : un toucher fait avancer
 * cinq cases d'un cran, la sienne et les deux de chaque côté.
 */
export function AnneauTrois({ onResolu }: NiveauProps) {
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
    <Couronne
      taille={21}
      enfants={cases.map((etat, index) => (
        <button
          key={index}
          aria-label={`Case ${index + 1}, état ${etat + 1} sur ${ETATS}`}
          onClick={() => setCases((c) => avancer(c, index))}
          className="aspect-square w-full cursor-pointer rounded-full transition-colors duration-200"
          style={{ backgroundColor: melange(couleurs, etat / (ETATS - 1)) }}
        />
      ))}
    />
  );
}
