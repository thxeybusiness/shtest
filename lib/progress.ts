"use client";

import { useCallback, useSyncExternalStore } from "react";
import { TOTAL_LEVELS } from "./campaign";

/** Étoiles obtenues par niveau : `{ "1": 3, "2": 1 }`. */
export type Progress = Record<number, number>;

const KEY = "campagne:progression";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    // Navigation privée ou stockage refusé : on repart d'une campagne vierge.
    return null;
  }
}

function parse(raw: string | null): Progress {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};

    const progress: Progress = {};
    for (const [key, value] of Object.entries(parsed)) {
      const id = Number(key);
      const stars = Number(value);
      // On ignore silencieusement les entrées corrompues plutôt que de perdre
      // toute la progression sur une seule valeur invalide.
      if (Number.isInteger(id) && stars >= 1 && stars <= 3) {
        progress[id] = stars;
      }
    }
    return progress;
  } catch {
    return {};
  }
}

/** Le niveau 1 est toujours ouvert ; les suivants demandent une étoile au précédent. */
export function isUnlocked(progress: Progress, levelId: number): boolean {
  return levelId === 1 || (progress[levelId - 1] ?? 0) >= 1;
}

export function countStars(progress: Progress): number {
  return Object.values(progress).reduce((total, stars) => total + stars, 0);
}

export function countCompleted(progress: Progress): number {
  return Object.keys(progress).length;
}

/** Premier niveau non terminé, ou le dernier si la campagne est finie. */
export function nextLevelId(progress: Progress): number {
  for (let id = 1; id <= TOTAL_LEVELS; id++) {
    if (!progress[id]) return id;
  }
  return TOTAL_LEVELS;
}

export function useProgress() {
  const raw = useSyncExternalStore(
    subscribe,
    readRaw,
    () => null,
  );
  const progress = parse(raw);

  const record = useCallback((levelId: number, stars: number) => {
    if (stars < 1) return;

    const current = parse(readRaw());
    // On ne redescend jamais un score déjà obtenu.
    if ((current[levelId] ?? 0) >= stars) return;

    try {
      window.localStorage.setItem(
        KEY,
        JSON.stringify({ ...current, [levelId]: stars }),
      );
    } catch {
      // Écriture impossible : la progression reste celle de la session.
    }
    for (const listener of listeners) listener();
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // Rien à faire : il n'y avait rien de stocké.
    }
    for (const listener of listeners) listener();
  }, []);

  return { progress, record, reset };
}
