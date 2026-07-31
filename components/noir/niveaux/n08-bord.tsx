"use client";

import { useEffect, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const CASES = 9;

/**
 * Niveau 8 — les cases sont inertes : c'est le cadre autour d'elles qui
 * répond. Chaque toucher du bord noircit une case de plus.
 */
export function Bord({ onResolu }: NiveauProps) {
  const [noircies, setNoircies] = useState(0);

  useEffect(() => {
    if (noircies >= CASES) onResolu();
  }, [noircies, onResolu]);

  const noircir = () => setNoircies((n) => Math.min(CASES, n + 1));

  return (
    // Un <div> et non un <button> : il contient déjà les cases, qui sont des
    // boutons — imbriquer deux éléments interactifs serait invalide.
    <div
      role="button"
      tabIndex={0}
      aria-label="Cadre"
      onClick={noircir}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          noircir();
        }
      }}
      className="w-full cursor-pointer rounded-lg p-8"
    >
      {/* Les cases avalent le clic sans rien faire : le geste utile est à côté. */}
      <Grille colonnes={3}>
        {Array.from({ length: CASES }, (_, index) => (
          <Piece
            key={index}
            noire={index < noircies}
            onClick={(event) => event.stopPropagation()}
          />
        ))}
      </Grille>
    </div>
  );
}
