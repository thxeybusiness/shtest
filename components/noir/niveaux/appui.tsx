"use client";

import { useEffect, useRef, useState } from "react";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 3;
const CASES = COTE * COTE;
/** Au-delà de ce temps, le doigt ne dit plus la même chose. */
const LONG_MS = 600;

/**
 * Le toucher bref emporte la case et sa suivante dans la ligne, en repassant
 * au début. Il ne change donc jamais la parité d'une ligne : une ligne à qui
 * il manque un nombre impair de cases ne se rattrape qu'à l'appui long, et
 * les deux langages sont vraiment nécessaires.
 */
function bref(cases: boolean[], index: number): boolean[] {
  const suivant = [...cases];
  const ligne = Math.floor(index / COTE);
  const voisine = ligne * COTE + ((index % COTE) + 1) % COTE;

  suivant[index] = !suivant[index];
  suivant[voisine] = !suivant[voisine];
  return suivant;
}

function long(cases: boolean[], index: number): boolean[] {
  const suivant = [...cases];
  const debut = Math.floor(index / COTE) * COTE;
  for (let c = 0; c < COTE; c++) suivant[debut + c] = !suivant[debut + c];
  return suivant;
}

function tirage(): boolean[] {
  let cases = Array<boolean>(CASES).fill(true);
  for (let i = 0; i < 5; i++) {
    const index = Math.floor(Math.random() * CASES);
    cases = Math.random() < 0.5 ? bref(cases, index) : long(cases, index);
  }
  return cases.every(Boolean) ? tirage() : cases;
}

/**
 * Niveau 36 — le doigt a deux langages. Poser et relever aussitôt emporte la
 * case et sa suivante ; rester appuyé emporte la ligne entière. Ni l'un ni
 * l'autre ne suffit seul.
 */
export function Appui({ onResolu }: NiveauProps) {
  const [cases, setCases] = useState<boolean[]>([]);
  // L'horodatage vient de l'évènement : lire l'horloge pendant le rendu
  // serait impur, et l'évènement porte déjà l'heure exacte.
  const pose = useRef<{ index: number; heure: number } | null>(null);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCases(tirage());
  }, []);

  useEffect(() => {
    if (cases.length > 0 && cases.every(Boolean)) onResolu();
  }, [cases, onResolu]);

  const relever = (index: number, heure: number) => {
    const depart = pose.current;
    pose.current = null;
    if (depart === null || depart.index !== index) return;

    const tenu = heure - depart.heure >= LONG_MS;
    setCases((c) => (tenu ? long(c, index) : bref(c, index)));
  };

  return (
    <Grille colonnes={COTE}>
      {cases.map((atteinte, index) => (
        <Piece
          key={index}
          atteinte={atteinte}
          aria-label={`Case ${index + 1}`}
          onPointerDown={(event) => {
            pose.current = { index, heure: event.timeStamp };
          }}
          onPointerUp={(event) => relever(index, event.timeStamp)}
          onPointerLeave={() => {
            pose.current = null;
          }}
          className="touch-manipulation select-none"
        />
      ))}
    </Grille>
  );
}
