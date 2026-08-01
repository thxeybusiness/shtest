"use client";

import { useEffect, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 4;
const CASES = COTE * COTE;
const MARQUEES = 6;
/** Temps mort avant que le motif ne paraisse : le temps de regarder. */
const ATTENTE_MS = 700;
/** Durée pendant laquelle le motif reste lisible. */
const POSE_MS = 1600;

function tirage(): number[] {
  const cases = Array.from({ length: CASES }, (_, i) => i);
  for (let i = cases.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cases[i], cases[j]] = [cases[j], cases[i]];
  }
  return cases.slice(0, MARQUEES);
}

/**
 * Niveau 29 — un motif se montre une fois, tout entier, puis s'efface. Il
 * n'y a rien à refaire dans l'ordre : il faut retrouver exactement les cases
 * qui étaient là. Une erreur le remontre.
 */
export function Empreinte({ onResolu }: NiveauProps) {
  const [motif, setMotif] = useState<number[]>([]);
  const [montre, setMontre] = useState(false);
  const [aMontrer, setAMontrer] = useState(true);
  const [choisies, setChoisies] = useState<number[]>([]);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMotif(tirage());
  }, []);

  // Un temps mort, le motif, puis plus rien : le temps de le regarder venir.
  useEffect(() => {
    if (!aMontrer || motif.length === 0) return;

    const paraitre = window.setTimeout(() => setMontre(true), ATTENTE_MS);
    const disparaitre = window.setTimeout(() => {
      setMontre(false);
      setAMontrer(false);
    }, ATTENTE_MS + POSE_MS);

    return () => {
      window.clearTimeout(paraitre);
      window.clearTimeout(disparaitre);
    };
  }, [aMontrer, motif]);

  useEffect(() => {
    if (choisies.length >= MARQUEES) onResolu();
  }, [choisies, onResolu]);

  const toucher = (index: number) => {
    if (aMontrer || choisies.includes(index)) return;

    if (motif.includes(index)) {
      setChoisies([...choisies, index]);
    } else {
      // Erreur : le motif se remontre, et tout est à refaire.
      setChoisies([]);
      setAMontrer(true);
    }
  };

  return (
    <Grille colonnes={COTE}>
      {Array.from({ length: CASES }, (_, index) => (
        <Piece
          key={index}
          atteinte={
            choisies.includes(index) || (montre && motif.includes(index))
          }
          aria-label={`Case ${index + 1}`}
          onClick={() => toucher(index)}
        />
      ))}
    </Grille>
  );
}
