"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Chronomètre qui n'avance que tant que `running` est vrai. Le temps écoulé
 * est recalculé depuis l'horloge à chaque tick, donc un onglet mis en veille
 * ne fait pas dériver le total.
 */
export function useTimer(running: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number | null>(null);
  const accumulated = useRef(0);

  useEffect(() => {
    if (!running) return;

    startedAt.current = Date.now();
    const tick = () => {
      const since = Date.now() - (startedAt.current ?? Date.now());
      setElapsed(accumulated.current + since);
    };
    const id = window.setInterval(tick, 250);

    return () => {
      window.clearInterval(id);
      accumulated.current += Date.now() - (startedAt.current ?? Date.now());
      startedAt.current = null;
      setElapsed(accumulated.current);
    };
  }, [running]);

  const reset = useCallback(() => {
    accumulated.current = 0;
    startedAt.current = Date.now();
    setElapsed(0);
  }, []);

  return { elapsed, reset };
}

/** Abonnés au stockage local, notifiés à chaque nouveau record. */
const storageListeners = new Set<() => void>();

function subscribeToStorage(listener: () => void) {
  storageListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    storageListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Navigation privée ou stockage refusé : pas de record mémorisé.
    return null;
  }
}

/**
 * Meilleur score persisté dans le navigateur. On lit le stockage via
 * `useSyncExternalStore` : le rendu serveur voit « pas de record » et
 * l'hydratation récupère la vraie valeur sans effet de bord.
 *
 * `lowerIsBetter` distingue un temps (le plus petit gagne) d'un score qui
 * grimpe.
 */
export function useBestScore(key: string, lowerIsBetter = true) {
  const raw = useSyncExternalStore(
    subscribeToStorage,
    () => readStored(key),
    () => null,
  );
  const best = raw === null ? null : Number(raw);

  const submit = useCallback(
    (value: number) => {
      const stored = readStored(key);
      const previous = stored === null ? null : Number(stored);

      if (previous !== null) {
        const improved = lowerIsBetter ? value < previous : value > previous;
        if (!improved) return;
      }

      try {
        window.localStorage.setItem(key, String(value));
      } catch {
        // Écriture impossible : le score reste simplement non mémorisé.
      }
      for (const listener of storageListeners) listener();
    },
    [key, lowerIsBetter],
  );

  return { best, submit };
}
