"use client";

import { useEffect, useState } from "react";
import { useCouleurs } from "@/components/noir/couleurs";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

/** Niveau 4 — chaque case indique combien de touchers il lui reste. */
export function Compte({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [restants, setRestants] = useState<number[]>([]);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRestants(
      Array.from({ length: 9 }, () => 1 + Math.floor(Math.random() * 3)),
    );
  }, []);

  useEffect(() => {
    if (restants.length > 0 && restants.every((n) => n === 0)) onResolu();
  }, [restants, onResolu]);

  return (
    <Grille colonnes={3}>
      {restants.map((reste, index) => (
        <Piece
          key={index}
          atteinte={reste === 0}
          aria-label={`Case, ${reste} touchers restants`}
          onClick={() =>
            setRestants((cases) =>
              cases.map((n, i) => (i === index ? Math.max(0, n - 1) : n)),
            )
          }
          className="flex items-center justify-center"
        >
          {reste > 0 && (
            <span
              className="text-lg font-bold"
              style={{ color: couleurs.cible }}
            >
              {reste}
            </span>
          )}
        </Piece>
      ))}
    </Grille>
  );
}
