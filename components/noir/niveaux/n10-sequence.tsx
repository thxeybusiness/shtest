"use client";

import { useEffect, useState } from "react";
import { Grille } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const CASES = 4;
const ECLAT_MS = 460;
/** Temps mort avant la démonstration, pour laisser le regard se poser. */
const ATTENTE_MS = 900;

/** Ordre de passage : une permutation, pour que chaque case soit noircie une fois. */
function melanger(): number[] {
  const ordre = Array.from({ length: CASES }, (_, i) => i);
  for (let i = ordre.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ordre[i], ordre[j]] = [ordre[j], ordre[i]];
  }
  return ordre;
}

/**
 * Niveau 10 — les quatre cases clignotent dans un certain ordre, qu'il faut
 * refaire. Chaque case juste touchée reste noire ; une erreur rallume tout et
 * relance la démonstration.
 */
export function Sequence({ onResolu }: NiveauProps) {
  const [ordre, setOrdre] = useState<number[]>([]);
  const [montree, setMontree] = useState<number | null>(null);
  const [position, setPosition] = useState(0);
  const [demonstration, setDemonstration] = useState(true);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrdre(melanger());
  }, []);

  // Déroule la démonstration, une case à la fois. Un temps mort la précède :
  // sans lui, la première case clignote avant que le joueur ait regardé.
  useEffect(() => {
    if (!demonstration || ordre.length === 0) return;

    let etape = 0;
    let intervalle = 0;
    const minuteries: number[] = [];

    const deroule = () => {
      if (etape >= ordre.length) {
        window.clearInterval(intervalle);
        setMontree(null);
        setDemonstration(false);
        return;
      }
      setMontree(ordre[etape]);
      // On rallume avant la case suivante, sinon deux voisines se confondent.
      minuteries.push(
        window.setTimeout(() => setMontree(null), ECLAT_MS * 0.6),
      );
      etape++;
    };

    const depart = window.setTimeout(() => {
      deroule();
      intervalle = window.setInterval(deroule, ECLAT_MS);
    }, ATTENTE_MS);

    return () => {
      window.clearTimeout(depart);
      window.clearInterval(intervalle);
      minuteries.forEach(window.clearTimeout);
    };
  }, [demonstration, ordre]);

  useEffect(() => {
    if (ordre.length > 0 && position >= ordre.length) onResolu();
  }, [ordre.length, position, onResolu]);

  const toucher = (index: number) => {
    if (demonstration || position >= ordre.length) return;

    if (index === ordre[position]) {
      setPosition(position + 1);
    } else {
      setPosition(0);
      setDemonstration(true);
    }
  };

  return (
    <Grille colonnes={2}>
      {Array.from({ length: CASES }, (_, index) => {
        const noire =
          montree === index ||
          (!demonstration && ordre.slice(0, position).includes(index));
        return (
          <button
            key={index}
            aria-label={`Case ${index + 1}`}
            aria-pressed={noire}
            onClick={() => toucher(index)}
            className={`aspect-square cursor-pointer rounded-sm transition-colors duration-150 ${
              noire ? "bg-black" : "bg-clair"
            }`}
          />
        );
      })}
    </Grille>
  );
}
