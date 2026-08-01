"use client";

import { useEffect, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 3;
const PAR_GRILLE = COTE * COTE;
const CASES = PAR_GRILLE * 2;

/**
 * Toucher à gauche se répercute à droite en miroir horizontal ; toucher à
 * droite se répercute à gauche en miroir vertical. Les deux renvois ne sont
 * donc pas symétriques, et c'est là toute l'affaire.
 */
function basculer(cases: boolean[], index: number): boolean[] {
  const suivant = [...cases];
  suivant[index] = !suivant[index];

  if (index < PAR_GRILLE) {
    const l = Math.floor(index / COTE);
    const c = index % COTE;
    const jumelle = PAR_GRILLE + l * COTE + (COTE - 1 - c);
    suivant[jumelle] = !suivant[jumelle];
  } else {
    const local = index - PAR_GRILLE;
    const l = Math.floor(local / COTE);
    const c = local % COTE;
    const jumelle = (COTE - 1 - l) * COTE + c;
    suivant[jumelle] = !suivant[jumelle];
  }
  return suivant;
}

function tirage(): boolean[] {
  let cases = Array<boolean>(CASES).fill(true);
  for (let i = 0; i < 5; i++) {
    cases = basculer(cases, Math.floor(Math.random() * CASES));
  }
  return cases.every(Boolean) ? tirage() : cases;
}

/**
 * Niveau 47 — deux grilles au lieu d'une, et chacune renvoie sur l'autre.
 * Aucune ne peut être finie seule.
 */
export function Jumelles({ onResolu }: NiveauProps) {
  const [cases, setCases] = useState<boolean[]>([]);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCases(tirage());
  }, []);

  useEffect(() => {
    if (cases.length > 0 && cases.every(Boolean)) onResolu();
  }, [cases, onResolu]);

  const grille = (decalage: number) => (
    <Grille colonnes={COTE} className="flex-1">
      {Array.from({ length: PAR_GRILLE }, (_, i) => {
        const index = decalage + i;
        return (
          <Piece
            key={index}
            atteinte={cases[index] ?? false}
            aria-label={`Case ${index + 1}`}
            onClick={() => setCases((c) => basculer(c, index))}
          />
        );
      })}
    </Grille>
  );

  return (
    // L'écart entre les deux grilles doit être franc : sinon elles se lisent
    // comme une seule grille de six colonnes.
    <div className="flex w-full items-center gap-9">
      {grille(0)}
      {grille(PAR_GRILLE)}
    </div>
  );
}
