"use client";

import { useEffect, useState } from "react";
import { melange, useCouleurs } from "@/components/noir/couleurs";
import { Grille } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 4;
const CASES = COTE * COTE;
const A_TROUVER = 4;
/** Au-delà, la manche se referme et les sondes s'effacent. */
const SONDES = 4;
/** Distance maximale sur la grille, pour ramener la teinte entre 0 et 1. */
const PORTEE = 2 * (COTE - 1) + 1;

function distance(a: number, b: number): number {
  return (
    Math.abs(Math.floor(a / COTE) - Math.floor(b / COTE)) +
    Math.abs((a % COTE) - (b % COTE))
  );
}

function tirerCachee(exclues: number[]): number {
  const libres = Array.from({ length: CASES }, (_, i) => i).filter(
    (i) => !exclues.includes(i),
  );
  return libres[Math.floor(Math.random() * libres.length)];
}

/**
 * Niveau 27 — une case se cache. Toucher ailleurs ne l'allume pas, mais
 * réchauffe la case touchée d'autant qu'on en est proche. Quatre sondes par
 * manche, ensuite tout refroidit.
 */
export function Chaud({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [cachee, setCachee] = useState<number | null>(null);
  const [trouvees, setTrouvees] = useState<number[]>([]);
  const [sondes, setSondes] = useState<{ index: number; ecart: number }[]>([]);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCachee(tirerCachee([]));
  }, []);

  useEffect(() => {
    if (trouvees.length >= A_TROUVER) onResolu();
  }, [trouvees, onResolu]);

  const toucher = (index: number) => {
    if (cachee === null || trouvees.includes(index)) return;

    if (index === cachee) {
      const suivantes = [...trouvees, index];
      setTrouvees(suivantes);
      setSondes([]);
      setCachee(
        suivantes.length >= A_TROUVER ? null : tirerCachee(suivantes),
      );
      return;
    }

    const sonde = { index, ecart: distance(index, cachee) };
    setSondes(sondes.length + 1 >= SONDES ? [] : [...sondes, sonde]);
  };

  const fond = (index: number) => {
    if (trouvees.includes(index)) return couleurs.cible;
    const sonde = sondes.find((s) => s.index === index);
    if (!sonde) return couleurs.repos;
    return melange(couleurs, 1 - sonde.ecart / PORTEE);
  };

  return (
    <Grille colonnes={COTE}>
      {Array.from({ length: CASES }, (_, index) => (
        <button
          key={index}
          aria-label={`Case ${index + 1}`}
          aria-pressed={trouvees.includes(index)}
          onClick={() => toucher(index)}
          className="aspect-square cursor-pointer rounded-sm transition-colors duration-200"
          style={{ backgroundColor: fond(index) }}
        />
      ))}
    </Grille>
  );
}
