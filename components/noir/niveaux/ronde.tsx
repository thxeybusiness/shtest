"use client";

import { useEffect, useState } from "react";
import { melange, useCouleurs } from "@/components/noir/couleurs";
import { Couronne } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const CASES = 12;
/** Temps que la lueur passe sur une case avant de filer à la suivante. */
const PAS_MS = 520;

/** Case suivante en sautant celles qui sont déjà prises. */
function suivante(depuis: number, prises: number[]): number {
  for (let saut = 1; saut <= CASES; saut++) {
    const candidate = (depuis + saut) % CASES;
    if (!prises.includes(candidate)) return candidate;
  }
  return depuis;
}

/**
 * Niveau 30 — une lueur tourne sur l'anneau sans jamais s'arrêter. On ne
 * peut la fixer qu'en la touchant là où elle se trouve ; toucher à côté ne
 * coûte rien, mais ne donne rien non plus.
 */
export function Ronde({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [prises, setPrises] = useState<number[]>([]);
  const [lueur, setLueur] = useState(0);

  const fini = prises.length >= CASES;

  useEffect(() => {
    if (fini) return;
    const id = window.setInterval(
      () => setLueur((position) => suivante(position, prises)),
      PAS_MS,
    );
    return () => window.clearInterval(id);
  }, [fini, prises]);

  useEffect(() => {
    if (fini) onResolu();
  }, [fini, onResolu]);

  const toucher = (index: number) => {
    if (fini || index !== lueur || prises.includes(index)) return;

    const suivantes = [...prises, index];
    setPrises(suivantes);
    setLueur(suivante(index, suivantes));
  };

  return (
    <Couronne
      taille={17}
      enfants={Array.from({ length: CASES }, (_, index) => {
        const prise = prises.includes(index);
        const eclairee = !fini && index === lueur;

        return (
          <button
            key={index}
            aria-label={`Case ${index + 1}`}
            aria-pressed={prise}
            onClick={() => toucher(index)}
            className="aspect-square w-full cursor-pointer rounded-full transition-colors duration-100"
            style={{
              backgroundColor: prise
                ? couleurs.cible
                : eclairee
                  ? melange(couleurs, 0.5)
                  : couleurs.repos,
            }}
          />
        );
      })}
    />
  );
}
