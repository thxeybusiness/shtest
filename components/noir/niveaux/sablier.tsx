"use client";

import { useEffect, useRef, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const CASES = 9;
/** Une case tient ce temps-là, puis retombe. */
const TENUE_MS = 3000;

/**
 * Niveau 26 — rien ne résiste : une case allumée s'éteint au bout de trois
 * secondes. La grille entière doit donc être faite d'un seul élan.
 */
export function Sablier({ onResolu }: NiveauProps) {
  const [atteintes, setAtteintes] = useState<number[]>([]);
  const minuteries = useRef<number[]>([]);

  useEffect(() => {
    const enCours = minuteries;
    return () => enCours.current.forEach(window.clearTimeout);
  }, []);

  useEffect(() => {
    if (atteintes.length >= CASES) onResolu();
  }, [atteintes, onResolu]);

  const toucher = (index: number) => {
    if (atteintes.includes(index)) return;

    setAtteintes([...atteintes, index]);
    minuteries.current.push(
      window.setTimeout(() => {
        // La grille terminée ne s'efface plus : le niveau est gagné.
        setAtteintes((a) => (a.length >= CASES ? a : a.filter((i) => i !== index)));
      }, TENUE_MS),
    );
  };

  return (
    <Grille colonnes={3}>
      {Array.from({ length: CASES }, (_, index) => (
        <Piece
          key={index}
          atteinte={atteintes.includes(index)}
          aria-label={`Case ${index + 1}`}
          onClick={() => toucher(index)}
        />
      ))}
    </Grille>
  );
}
