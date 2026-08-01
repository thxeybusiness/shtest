"use client";

import { useEffect, useState } from "react";
import { useCouleurs } from "@/components/noir/couleurs";
import type { NiveauProps } from "@/lib/noir/types";

const NOMBRE = 8;
/** Inclinaison maximale du fléau, en degrés. */
const PENCHE_MAX = 10;

/**
 * Huit poids distincts qui se répartissent en deux moitiés de même somme :
 * l'équilibre est donc atteignable par construction.
 */
function tirage(): { poids: number[]; droite: boolean[] } {
  const gauche = new Set<number>();
  while (gauche.size < 4) gauche.add(1 + Math.floor(Math.random() * 14));

  const cible = [...gauche].reduce((total, v) => total + v, 0);
  const droite = new Set<number>();
  while (droite.size < 3) {
    const v = 1 + Math.floor(Math.random() * 14);
    if (!gauche.has(v)) droite.add(v);
  }

  const dernier =
    cible - [...droite].reduce((total, v) => total + v, 0);
  if (dernier < 1 || dernier > 20 || gauche.has(dernier) || droite.has(dernier)) {
    return tirage();
  }

  const poids = [...gauche, ...droite, dernier];
  // Départ déséquilibré : sinon il n'y aurait rien à faire.
  const cotes = poids.map(() => Math.random() < 0.5);
  const ecart = poids.reduce(
    (total, v, i) => total + (cotes[i] ? -v : v),
    0,
  );
  return ecart === 0 ? tirage() : { poids, droite: cotes };
}

/**
 * Niveau 35 — chaque poids passe d'un plateau à l'autre. Le fléau ne se
 * redresse que lorsque les deux côtés pèsent exactement pareil.
 */
export function Pesee({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [poids, setPoids] = useState<number[]>([]);
  const [droite, setDroite] = useState<boolean[]>([]);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    const tire = tirage();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPoids(tire.poids);
    setDroite(tire.droite);
  }, []);

  const ecart = poids.reduce(
    (total, v, i) => total + (droite[i] ? -v : v),
    0,
  );
  const equilibre = poids.length === NOMBRE && ecart === 0;

  useEffect(() => {
    if (equilibre) onResolu();
  }, [equilibre, onResolu]);

  const plateau = (aDroite: boolean) => (
    <div className="flex min-h-14 flex-wrap items-center justify-center gap-3">
      {poids.map((valeur, index) =>
        droite[index] !== aDroite ? null : (
          <button
            key={index}
            aria-label={`Poids ${valeur}`}
            aria-pressed={aDroite}
            onClick={() =>
              setDroite(droite.map((d, i) => (i === index ? !d : d)))
            }
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-colors duration-200"
            style={{
              backgroundColor: equilibre ? couleurs.cible : couleurs.repos,
            }}
          >
            <span
              className="font-mono text-sm font-bold tabular-nums"
              style={{ color: equilibre ? couleurs.repos : couleurs.cible }}
            >
              {valeur}
            </span>
          </button>
        ),
      )}
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-6">
      {plateau(false)}
      <div
        aria-hidden
        className="h-1 w-full rounded-full transition-transform duration-300"
        style={{
          backgroundColor: equilibre ? couleurs.cible : couleurs.repos,
          // Le côté le plus lourd descend : le fléau penche donc à l'inverse
          // du signe de l'écart, qui compte la gauche en positif.
          transform: `rotate(${Math.max(-PENCHE_MAX, Math.min(PENCHE_MAX, -ecart))}deg)`,
        }}
      />
      {plateau(true)}
    </div>
  );
}
