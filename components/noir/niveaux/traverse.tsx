"use client";

import { useEffect, useState } from "react";
import { useCouleurs } from "@/components/noir/couleurs";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 5;
const CASES = COTE * COTE;
const MORTES = 4;
const VIVANTES = CASES - MORTES;
/** Temps de constat avant que le parcours bloqué ne se rallume. */
const IMPASSE_MS = 600;

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

function melanger(liste: number[]): number[] {
  const copie = [...liste];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

/** Un parcours complet de la grille, tiré au hasard parmi ceux qui existent. */
function parcoursComplet(): number[] {
  const chemin: number[] = [];
  const vus = Array<boolean>(CASES).fill(false);

  const avancer = (index: number): boolean => {
    chemin.push(index);
    vus[index] = true;
    if (chemin.length === CASES) return true;

    for (const voisine of melanger(voisines(index))) {
      if (!vus[voisine] && avancer(voisine)) return true;
    }
    chemin.pop();
    vus[index] = false;
    return false;
  };

  for (const depart of melanger(Array.from({ length: CASES }, (_, i) => i))) {
    if (avancer(depart)) return chemin;
  }
  // Inatteignable : une grille rectangulaire a toujours un parcours complet.
  return Array.from({ length: CASES }, (_, i) => i);
}

/**
 * Les quatre cases mortes sont la queue d'un parcours complet : ce qui reste
 * en est le début, donc un parcours des vingt-et-une cases existe toujours.
 */
function tirage(): number[] {
  return parcoursComplet().slice(VIVANTES);
}

/**
 * Niveau 46 — quatre cases refusent de s'allumer, et il faut passer par
 * toutes les autres d'un seul trait, sans jamais revenir sur ses pas.
 */
export function Traverse({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [mortes, setMortes] = useState<number[]>([]);
  const [parcours, setParcours] = useState<number[]>([]);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMortes(tirage());
  }, []);

  const fini = parcours.length >= VIVANTES;
  const bloque =
    !fini &&
    parcours.length > 0 &&
    voisines(parcours[parcours.length - 1]).every(
      (c) => mortes.includes(c) || parcours.includes(c),
    );

  useEffect(() => {
    if (fini) onResolu();
  }, [fini, onResolu]);

  useEffect(() => {
    if (!bloque) return;
    const id = window.setTimeout(() => setParcours([]), IMPASSE_MS);
    return () => window.clearTimeout(id);
  }, [bloque]);

  const toucher = (index: number) => {
    if (fini || bloque || mortes.includes(index) || parcours.includes(index)) {
      return;
    }
    const derniere = parcours[parcours.length - 1];
    if (derniere !== undefined && !voisines(derniere).includes(index)) return;

    setParcours([...parcours, index]);
  };

  return (
    <Grille colonnes={COTE}>
      {Array.from({ length: CASES }, (_, index) => {
        if (mortes.includes(index)) {
          return (
            <div
              key={index}
              aria-hidden
              className="aspect-square rounded-sm border"
              style={{
                borderColor: `color-mix(in srgb, ${couleurs.repos} 55%, transparent)`,
              }}
            />
          );
        }
        return (
          <Piece
            key={index}
            atteinte={parcours.includes(index)}
            aria-label={`Case ${index + 1}`}
            onClick={() => toucher(index)}
          />
        );
      })}
    </Grille>
  );
}
