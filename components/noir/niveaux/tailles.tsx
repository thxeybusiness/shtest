"use client";

import { useEffect, useState } from "react";
import { useCouleurs } from "@/components/noir/couleurs";
import { Grille } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const CASES = 9;
/** Part du côté d'une case occupée par le plus petit, puis pas à pas. */
const PLUS_PETIT = 38;
const PAS = 7;

function melanger(): number[] {
  const rangs = Array.from({ length: CASES }, (_, i) => i);
  for (let i = rangs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rangs[i], rangs[j]] = [rangs[j], rangs[i]];
  }
  return rangs;
}

/**
 * Niveau 24 — aucun chiffre nulle part, mais les ronds n'ont pas tous la
 * même taille : c'est la taille qui donne l'ordre, du plus petit au plus
 * grand. Une erreur rallume tout.
 */
export function Tailles({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [rangs, setRangs] = useState<number[]>([]);
  const [attendu, setAttendu] = useState(0);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRangs(melanger());
  }, []);

  useEffect(() => {
    if (rangs.length > 0 && attendu >= CASES) onResolu();
  }, [rangs.length, attendu, onResolu]);

  return (
    <Grille colonnes={3}>
      {rangs.map((rang, index) => {
        const atteinte = rang < attendu;
        const taille = PLUS_PETIT + rang * PAS;

        return (
          <div
            key={index}
            className="flex aspect-square items-center justify-center"
          >
            <button
              aria-label={`Rond ${rang + 1}`}
              aria-pressed={atteinte}
              onClick={() => setAttendu(rang === attendu ? attendu + 1 : 0)}
              className="aspect-square cursor-pointer rounded-full transition-colors duration-200"
              style={{
                width: `${taille}%`,
                backgroundColor: atteinte ? couleurs.cible : couleurs.repos,
              }}
            />
          </div>
        );
      })}
    </Grille>
  );
}
