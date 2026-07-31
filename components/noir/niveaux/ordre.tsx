"use client";

import { useEffect, useState } from "react";
import { useCouleurs } from "@/components/noir/couleurs";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

function melanger(): number[] {
  const valeurs = Array.from({ length: 9 }, (_, i) => i + 1);
  for (let i = valeurs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [valeurs[i], valeurs[j]] = [valeurs[j], valeurs[i]];
  }
  return valeurs;
}

/**
 * Niveau 3 — les cases portent 1 à 9 et ne se noircissent que dans l'ordre
 * croissant. Une erreur rallume tout.
 */
export function Ordre({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [valeurs, setValeurs] = useState<number[]>([]);
  const [attendu, setAttendu] = useState(1);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValeurs(melanger());
  }, []);

  useEffect(() => {
    if (attendu > 9) onResolu();
  }, [attendu, onResolu]);

  return (
    <Grille colonnes={3}>
      {valeurs.map((valeur, index) => {
        const atteinte = valeur < attendu;
        return (
          <Piece
            key={index}
            atteinte={atteinte}
            aria-label={`Case ${valeur}`}
            onClick={() => setAttendu(valeur === attendu ? attendu + 1 : 1)}
            className="flex items-center justify-center"
          >
            <span
              className="text-lg font-bold"
              style={{ color: atteinte ? couleurs.repos : couleurs.cible }}
            >
              {valeur}
            </span>
          </Piece>
        );
      })}
    </Grille>
  );
}
