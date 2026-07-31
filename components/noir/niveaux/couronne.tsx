"use client";

import { useEffect, useState } from "react";
import { Couronne as Anneau, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const CASES = 8;

/** Bascule la case et ses deux voisines sur l'anneau, qui n'a ni début ni fin. */
function basculer(cases: boolean[], index: number): boolean[] {
  const suivant = [...cases];
  for (const i of [index, (index + 1) % CASES, (index + CASES - 1) % CASES]) {
    suivant[i] = !suivant[i];
  }
  return suivant;
}

/** Tirage depuis l'anneau complet : il reste donc toujours ramenable. */
function tirage(): boolean[] {
  let cases = Array<boolean>(CASES).fill(true);
  for (let i = 0; i < 3; i++) {
    cases = basculer(cases, Math.floor(Math.random() * CASES));
  }
  return cases.every(Boolean) ? tirage() : cases;
}

/**
 * Les cases sont posées en cercle : chaque toucher emporte les deux voisines,
 * et l'anneau n'ayant ni début ni fin, la première touche la dernière.
 */
export function CouronneNiveau({ onResolu }: NiveauProps) {
  const [cases, setCases] = useState<boolean[]>([]);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCases(tirage());
  }, []);

  useEffect(() => {
    if (cases.length > 0 && cases.every(Boolean)) onResolu();
  }, [cases, onResolu]);

  return (
    <Anneau
      enfants={cases.map((atteinte, index) => (
        <Piece
          key={index}
          forme="rond"
          atteinte={atteinte}
          aria-label={`Case ${index + 1}`}
          onClick={() => setCases((c) => basculer(c, index))}
          className="w-full"
        />
      ))}
    />
  );
}
