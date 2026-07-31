"use client";

import { useEffect, useState } from "react";
import { useCouleurs } from "@/components/noir/couleurs";
import { Couronne } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const CASES = 6;
const ECLAT_MS = 440;
const ATTENTE_MS = 900;

/** Ordre de passage : une permutation, pour que chaque case serve une fois. */
function melanger(): number[] {
  const ordre = Array.from({ length: CASES }, (_, i) => i);
  for (let i = ordre.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ordre[i], ordre[j]] = [ordre[j], ordre[i]];
  }
  return ordre;
}

/**
 * Niveau 15 — même démonstration que la séquence, mais posée en anneau et à
 * refaire à l'envers, en partant de la dernière case montrée.
 */
export function Rebours({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [ordre, setOrdre] = useState<number[]>([]);
  const [montree, setMontree] = useState<number | null>(null);
  const [position, setPosition] = useState(0);
  const [demonstration, setDemonstration] = useState(true);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrdre(melanger());
  }, []);

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

  // À rebours : la première case attendue est la dernière montrée.
  const attendue = ordre[ordre.length - 1 - position];

  const toucher = (index: number) => {
    if (demonstration || position >= ordre.length) return;

    if (index === attendue) {
      setPosition(position + 1);
    } else {
      setPosition(0);
      setDemonstration(true);
    }
  };

  return (
    <Couronne
      enfants={Array.from({ length: CASES }, (_, index) => {
        const dejaRefaite =
          !demonstration && ordre.slice(ordre.length - position).includes(index);
        const atteinte = montree === index || dejaRefaite;
        return (
          <button
            key={index}
            aria-label={`Case ${index + 1}`}
            aria-pressed={atteinte}
            onClick={() => toucher(index)}
            className="aspect-square w-full cursor-pointer rounded-full transition-colors duration-150"
            style={{
              backgroundColor: atteinte ? couleurs.cible : couleurs.repos,
            }}
          />
        );
      })}
    />
  );
}
