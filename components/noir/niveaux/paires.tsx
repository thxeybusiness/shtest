"use client";

import { useEffect, useState } from "react";
import { useCouleurs } from "@/components/noir/couleurs";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const PAIRES = 4;
const CASES = PAIRES * 2;
/** Temps laissé pour retenir deux cases qui ne vont pas ensemble. */
const MEMOIRE_MS = 900;
/** Des chiffres romains plutôt que des symboles : ils se lisent partout. */
const SIGNES = ["I", "V", "X", "L"];

function melanger(): number[] {
  const signes = Array.from({ length: CASES }, (_, i) => Math.floor(i / 2));
  for (let i = signes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [signes[i], signes[j]] = [signes[j], signes[i]];
  }
  return signes;
}

/**
 * Niveau 21 — les cases vont deux par deux. Une case retournée montre son
 * signe ; deux signes identiques restent, deux signes différents se
 * referment.
 */
export function Paires({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [signes, setSignes] = useState<number[]>([]);
  const [trouvees, setTrouvees] = useState<number[]>([]);
  const [retournees, setRetournees] = useState<number[]>([]);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSignes(melanger());
  }, []);

  useEffect(() => {
    if (signes.length > 0 && trouvees.length >= CASES) onResolu();
  }, [signes.length, trouvees.length, onResolu]);

  // Deux cases dépareillées se referment d'elles-mêmes.
  useEffect(() => {
    if (retournees.length < 2) return;
    const id = window.setTimeout(() => setRetournees([]), MEMOIRE_MS);
    return () => window.clearTimeout(id);
  }, [retournees]);

  const toucher = (index: number) => {
    if (
      retournees.length >= 2 ||
      retournees.includes(index) ||
      trouvees.includes(index)
    ) {
      return;
    }

    if (retournees.length === 0) {
      setRetournees([index]);
      return;
    }

    const premiere = retournees[0];
    if (signes[premiere] === signes[index]) {
      setTrouvees([...trouvees, premiere, index]);
      setRetournees([]);
    } else {
      setRetournees([premiere, index]);
    }
  };

  return (
    <Grille colonnes={4}>
      {signes.map((signe, index) => {
        const trouvee = trouvees.includes(index);
        const visible = trouvee || retournees.includes(index);

        return (
          <Piece
            key={index}
            atteinte={trouvee}
            aria-label={`Case ${index + 1}`}
            onClick={() => toucher(index)}
            className="flex items-center justify-center"
          >
            <span
              className="font-mono text-lg font-bold transition-opacity duration-150"
              style={{
                color: trouvee ? couleurs.repos : couleurs.cible,
                opacity: visible ? 1 : 0,
              }}
            >
              {SIGNES[signe]}
            </span>
          </Piece>
        );
      })}
    </Grille>
  );
}
