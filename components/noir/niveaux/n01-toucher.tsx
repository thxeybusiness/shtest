"use client";

import { useEffect, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

/** Niveau 1 — chaque case se noircit d'un simple toucher. */
export function Toucher({ onResolu }: NiveauProps) {
  const [noires, setNoires] = useState(() => Array<boolean>(9).fill(false));

  useEffect(() => {
    if (noires.every(Boolean)) onResolu();
  }, [noires, onResolu]);

  return (
    <Grille colonnes={3}>
      {noires.map((atteinte, index) => (
        <Piece
          key={index}
          atteinte={atteinte}
          onClick={() =>
            setNoires((cases) => cases.map((c, i) => (i === index ? true : c)))
          }
        />
      ))}
    </Grille>
  );
}
