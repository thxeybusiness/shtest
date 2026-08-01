"use client";

import { useEffect, useState } from "react";
import { useCouleurs } from "@/components/noir/couleurs";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 4;
const CASES = COTE * COTE;

function voisines(index: number): number[] {
  const ligne = Math.floor(index / COTE);
  const colonne = index % COTE;
  const liste: number[] = [];
  if (ligne > 0) liste.push(index - COTE);
  if (ligne < COTE - 1) liste.push(index + COTE);
  if (colonne > 0) liste.push(index - 1);
  if (colonne < COTE - 1) liste.push(index + 1);
  return liste;
}

/** Pour chaque case, le nombre de ses voisines atteintes. */
function comptes(cases: boolean[]): number[] {
  return cases.map(
    (_, index) => voisines(index).filter((v) => cases[v]).length,
  );
}

function tirage(): number[] {
  const motif = Array.from({ length: CASES }, () => Math.random() < 0.45);
  const pleines = motif.filter(Boolean).length;
  return pleines < 5 || pleines > 10 ? tirage() : comptes(motif);
}

/**
 * Niveau 49 — le chiffre d'une case ne parle pas d'elle mais de ses
 * voisines : il dit combien d'entre elles doivent être atteintes. Toute
 * grille qui respecte les seize chiffres est bonne.
 */
export function Chiffres({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [attendus, setAttendus] = useState<number[]>([]);
  const [cases, setCases] = useState<boolean[]>(() =>
    Array<boolean>(CASES).fill(false),
  );

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttendus(tirage());
  }, []);

  const actuels = comptes(cases);
  const juste =
    attendus.length === CASES && attendus.every((n, i) => n === actuels[i]);

  useEffect(() => {
    if (juste) onResolu();
  }, [juste, onResolu]);

  return (
    <Grille colonnes={COTE}>
      {Array.from({ length: CASES }, (_, index) => {
        const atteinte = cases[index];
        return (
          <Piece
            key={index}
            atteinte={atteinte}
            aria-label={`Case ${index + 1}`}
            onClick={() =>
              setCases(cases.map((v, i) => (i === index ? !v : v)))
            }
            className="flex items-center justify-center"
          >
            <span
              className="font-mono text-lg font-bold tabular-nums transition-opacity duration-200"
              style={{
                color: atteinte ? couleurs.repos : couleurs.cible,
                opacity: attendus[index] === actuels[index] ? 1 : 0.45,
              }}
            >
              {attendus[index] ?? ""}
            </span>
          </Piece>
        );
      })}
    </Grille>
  );
}
