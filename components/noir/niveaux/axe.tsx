"use client";

import { useEffect, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 4;
const CASES = COTE * COTE;

/** Les quatre axes possibles. Le niveau en tire un, et ne le dit pas. */
const AXES = ["vertical", "horizontal", "diagonale", "antidiagonale"] as const;
type Axe = (typeof AXES)[number];

function reflet(index: number, axe: Axe): number {
  const l = Math.floor(index / COTE);
  const c = index % COTE;

  switch (axe) {
    case "vertical":
      return l * COTE + (COTE - 1 - c);
    case "horizontal":
      return (COTE - 1 - l) * COTE + c;
    case "diagonale":
      return c * COTE + l;
    case "antidiagonale":
      return (COTE - 1 - c) * COTE + (COTE - 1 - l);
  }
}

function basculer(cases: boolean[], index: number, axe: Axe): boolean[] {
  const suivant = [...cases];
  suivant[index] = !suivant[index];

  // Une case posée sur l'axe est son propre reflet : elle ne bascule qu'une
  // fois, sinon elle ne bougerait jamais.
  const jumelle = reflet(index, axe);
  if (jumelle !== index) suivant[jumelle] = !suivant[jumelle];
  return suivant;
}

function tirage(axe: Axe): boolean[] {
  let cases = Array<boolean>(CASES).fill(true);
  for (let i = 0; i < 4; i++) {
    cases = basculer(cases, Math.floor(Math.random() * CASES), axe);
  }
  return cases.every(Boolean) ? tirage(axe) : cases;
}

/**
 * Niveau 37 — la grille a bien un axe de symétrie, comme deux niveaux plus
 * tôt, mais lequel ? Il change d'une partie à l'autre, et le premier toucher
 * est la seule façon de le savoir.
 */
export function AxeCache({ onResolu }: NiveauProps) {
  const [axe, setAxe] = useState<Axe | null>(null);
  const [cases, setCases] = useState<boolean[]>([]);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    const tire = AXES[Math.floor(Math.random() * AXES.length)];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAxe(tire);
    setCases(tirage(tire));
  }, []);

  useEffect(() => {
    if (cases.length > 0 && cases.every(Boolean)) onResolu();
  }, [cases, onResolu]);

  return (
    <Grille colonnes={COTE}>
      {cases.map((atteinte, index) => (
        <Piece
          key={index}
          atteinte={atteinte}
          aria-label={`Case ${index + 1}`}
          onClick={() => axe && setCases((c) => basculer(c, index, axe))}
        />
      ))}
    </Grille>
  );
}
