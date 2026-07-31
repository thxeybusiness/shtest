"use client";

import { useEffect, useRef, useState } from "react";
import { melange, useCouleurs } from "@/components/noir/couleurs";
import type { NiveauProps } from "@/lib/noir/types";

const DUREE_MS = 2600;

/**
 * Niveau 7 — une seule case, qui s'assombrit tant qu'on la maintient et
 * s'éclaircit dès qu'on relâche. Il faut tenir jusqu'au bout.
 */
export function Maintenir({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [appuye, setAppuye] = useState(false);
  const [avance, setAvance] = useState(0);
  const resolu = useRef(false);

  useEffect(() => {
    if (resolu.current) return;

    let image = 0;
    let precedent = performance.now();

    const pas = (maintenant: number) => {
      const dt = maintenant - precedent;
      precedent = maintenant;

      setAvance((valeur) => {
        // On remonte deux fois plus vite qu'on ne redescend : relâcher coûte,
        // sans tout perdre d'un coup.
        const suivant = appuye
          ? valeur + dt / DUREE_MS
          : valeur - dt / (DUREE_MS / 2);
        return Math.min(1, Math.max(0, suivant));
      });

      image = requestAnimationFrame(pas);
    };

    image = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(image);
  }, [appuye]);

  useEffect(() => {
    if (avance >= 1 && !resolu.current) {
      resolu.current = true;
      onResolu();
    }
  }, [avance, onResolu]);

  return (
    <button
      aria-label="Case à maintenir"
      onPointerDown={() => setAppuye(true)}
      onPointerUp={() => setAppuye(false)}
      onPointerLeave={() => setAppuye(false)}
      onPointerCancel={() => setAppuye(false)}
      className="aspect-square w-full cursor-pointer rounded-full"
      style={{
        // Du repos vers la cible, par mélange progressif.
        backgroundColor: melange(couleurs, avance),
      }}
    />
  );
}
