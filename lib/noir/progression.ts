"use client";

import { useCallback, useSyncExternalStore } from "react";
import { TOTAL_NIVEAUX } from "./niveaux";

const CLE = "noir:resolus";

const abonnes = new Set<() => void>();

function souscrire(ecouteur: () => void) {
  abonnes.add(ecouteur);
  window.addEventListener("storage", ecouteur);
  return () => {
    abonnes.delete(ecouteur);
    window.removeEventListener("storage", ecouteur);
  };
}

function lireBrut(): string | null {
  try {
    return window.localStorage.getItem(CLE);
  } catch {
    // Navigation privée ou stockage refusé : on repart de zéro.
    return null;
  }
}

function analyser(brut: string | null): number[] {
  if (!brut) return [];
  try {
    const valeur: unknown = JSON.parse(brut);
    if (!Array.isArray(valeur)) return [];
    return valeur
      .map(Number)
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= TOTAL_NIVEAUX);
  } catch {
    return [];
  }
}

/** Le niveau 1 est ouvert ; les suivants demandent que le précédent soit résolu. */
export function estOuvert(resolus: number[], numero: number): boolean {
  return numero === 1 || resolus.includes(numero - 1);
}

/** Premier niveau non résolu, ou le dernier si tout est fait. */
export function prochainNiveau(resolus: number[]): number {
  for (let n = 1; n <= TOTAL_NIVEAUX; n++) {
    if (!resolus.includes(n)) return n;
  }
  return TOTAL_NIVEAUX;
}

export function useProgressionNoir() {
  const brut = useSyncExternalStore(souscrire, lireBrut, () => null);
  const resolus = analyser(brut);

  const marquer = useCallback((numero: number) => {
    const actuels = analyser(lireBrut());
    if (actuels.includes(numero)) return;

    try {
      window.localStorage.setItem(CLE, JSON.stringify([...actuels, numero]));
    } catch {
      // Écriture impossible : la progression reste celle de la session.
    }
    for (const ecouteur of abonnes) ecouteur();
  }, []);

  const reinitialiser = useCallback(() => {
    try {
      window.localStorage.removeItem(CLE);
    } catch {
      // Rien à faire : il n'y avait rien de stocké.
    }
    for (const ecouteur of abonnes) ecouteur();
  }, []);

  return { resolus, marquer, reinitialiser };
}
