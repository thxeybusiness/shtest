"use client";

import { useEffect, useState } from "react";
import { melange, useCouleurs } from "@/components/noir/couleurs";
import { Grille } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 6;
const CASES = COTE * COTE;

/**
 * Trois manches : la grille se rapproche de la couleur du palier et l'écart
 * de l'intruse se resserre. La dernière tient dans un cheveu.
 */
const MANCHES = [
  { fond: 0.55, ecart: 0.1 },
  { fond: 0.75, ecart: 0.06 },
  { fond: 0.9, ecart: 0.035 },
];

function tirerIntruse(): number {
  return Math.floor(Math.random() * CASES);
}

/**
 * Niveau 50 — le dernier. Trente-six cases d'une même teinte, sauf une. La
 * trouver rapproche tout de la couleur, et la suivante sera plus discrète
 * encore.
 */
export function Aiguille({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [manche, setManche] = useState(0);
  const [intruse, setIntruse] = useState<number | null>(null);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIntruse(tirerIntruse());
  }, []);

  const fini = manche >= MANCHES.length;

  useEffect(() => {
    if (fini) onResolu();
  }, [fini, onResolu]);

  const toucher = (index: number) => {
    if (fini || index !== intruse) return;

    const suivante = manche + 1;
    setManche(suivante);
    setIntruse(
      suivante >= MANCHES.length ? null : tirerIntruse(),
    );
  };

  const fond = (index: number) => {
    if (fini) return couleurs.cible;
    const { fond: part, ecart } = MANCHES[manche];
    return melange(couleurs, part + (index === intruse ? ecart : 0));
  };

  return (
    <Grille colonnes={COTE}>
      {Array.from({ length: CASES }, (_, index) => (
        <button
          key={index}
          aria-label={`Case ${index + 1}`}
          onClick={() => toucher(index)}
          className="aspect-square cursor-pointer rounded-sm transition-colors duration-500"
          style={{ backgroundColor: fond(index) }}
        />
      ))}
    </Grille>
  );
}
