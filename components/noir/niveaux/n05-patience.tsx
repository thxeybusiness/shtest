"use client";

import { useEffect, useRef, useState } from "react";
import { Grille } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const CASES = 9;
const PAS_MS = 700;

/**
 * Niveau 5 — les cases se noircissent toutes seules, une par une… mais le
 * moindre toucher rallume tout. La solution est de ne rien faire.
 */
export function Patience({ onResolu }: NiveauProps) {
  const [noircies, setNoircies] = useState(0);
  const resolu = useRef(false);

  useEffect(() => {
    if (noircies >= CASES) {
      if (!resolu.current) {
        resolu.current = true;
        onResolu();
      }
      return;
    }

    const id = window.setTimeout(
      () => setNoircies((n) => n + 1),
      PAS_MS,
    );
    return () => window.clearTimeout(id);
  }, [noircies, onResolu]);

  const rallumer = () => {
    if (!resolu.current) setNoircies(0);
  };

  return (
    // On intercepte le toucher sur toute l'aire, cases comprises : c'est le
    // geste lui-même qui est puni, pas la case visée.
    <div onPointerDown={rallumer} className="w-full">
      <Grille colonnes={3}>
        {Array.from({ length: CASES }, (_, index) => (
          <div
            key={index}
            className={`aspect-square rounded-sm transition-colors duration-200 ${
              index < noircies ? "bg-black" : "bg-clair"
            }`}
          />
        ))}
      </Grille>
    </div>
  );
}
