"use client";

import { useEffect, useState } from "react";
import { melange, useCouleurs } from "@/components/noir/couleurs";
import { Grille } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 4;
const CASES = COTE * COTE;
const PALIERS = 5;
/** Avance supplémentaire de l'intrus vers la cible : ténue, mais constante. */
const ECART = 0.14;

function tirerIntrus(): number {
  return Math.floor(Math.random() * CASES);
}

/**
 * Niveau 9 — une case est d'un gris à peine plus sombre que les autres. La
 * trouver assombrit toute la grille d'un cran, et un nouvel intrus apparaît.
 * Cinq crans, et tout est noir.
 *
 * L'ensemble s'assombrit d'un bloc (plutôt qu'une case à la fois) pour que
 * l'exercice reste le même jusqu'au bout : à deux cases claires près de la
 * fin, on ne saurait plus laquelle est l'intrus.
 */
export function Intrus({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [palier, setPalier] = useState(0);
  const [intrus, setIntrus] = useState<number | null>(null);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIntrus(tirerIntrus());
  }, []);

  useEffect(() => {
    if (palier >= PALIERS) onResolu();
  }, [palier, onResolu]);

  const toucher = (index: number) => {
    if (index !== intrus || palier >= PALIERS) return;

    const suivant = palier + 1;
    setPalier(suivant);
    setIntrus(suivant >= PALIERS ? null : tirerIntrus());
  };

  const fond = (index: number) => {
    if (palier >= PALIERS) return couleurs.cible;
    const part = palier / PALIERS + (index === intrus ? ECART : 0);
    return melange(couleurs, part);
  };

  return (
    <Grille colonnes={COTE}>
      {Array.from({ length: CASES }, (_, index) => (
        <button
          key={index}
          aria-label={`Case ${index + 1}`}
          onClick={() => toucher(index)}
          className="aspect-square cursor-pointer rounded-full transition-colors duration-300"
          style={{ backgroundColor: fond(index) }}
        />
      ))}
    </Grille>
  );
}
