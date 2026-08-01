"use client";

import { useEffect, useState } from "react";
import { melange, useCouleurs } from "@/components/noir/couleurs";
import { Grille } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 4;
const CASES = COTE * COTE;
const VIDE = -1;
/** Nombre de cases posées d'avance, qui ne bougeront plus. */
const DONNEES = 6;
/** Fond des cases posées d'avance : assez pour les distinguer, pas plus. */
const TEINTE_POSEE = 0.22;

function melanger<T>(liste: T[]): T[] {
  const copie = [...liste];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

/**
 * Une grille valide obtenue depuis la grille de base : on permute les
 * teintes, les deux lignes de chaque bande et les deux colonnes de chaque
 * pile, ce qui préserve toutes les contraintes.
 */
function solution(): number[] {
  const teintes = melanger([0, 1, 2, 3]);
  const lignes = [...melanger([0, 1]), ...melanger([2, 3])];
  const colonnes = [...melanger([0, 1]), ...melanger([2, 3])];

  const base = (l: number, c: number) => (l * 2 + Math.floor(l / 2) + c) % COTE;
  return Array.from(
    { length: CASES },
    (_, i) => teintes[base(lignes[Math.floor(i / COTE)], colonnes[i % COTE])],
  );
}

function valide(grille: number[]): boolean {
  const complet = (valeurs: number[]) =>
    new Set(valeurs).size === COTE && !valeurs.includes(VIDE);

  for (let i = 0; i < COTE; i++) {
    const ligne = grille.slice(i * COTE, i * COTE + COTE);
    const colonne = grille.filter((v, j) => j % COTE === i);
    if (!complet(ligne) || !complet(colonne)) return false;
  }
  for (const [dl, dc] of [
    [0, 0],
    [0, 2],
    [2, 0],
    [2, 2],
  ]) {
    const bloc = [0, 1].flatMap((l) =>
      [0, 1].map((c) => grille[(dl + l) * COTE + dc + c]),
    );
    if (!complet(bloc)) return false;
  }
  return true;
}

/**
 * Niveau 42 — quatre teintes, quatre lignes, quatre colonnes et quatre
 * blocs. Chacun doit les porter toutes une fois. Les cases posées d'avance
 * ne bougent plus.
 */
export function Sudoku({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [donnees, setDonnees] = useState<number[]>([]);
  const [saisies, setSaisies] = useState<number[]>(() =>
    Array<number>(CASES).fill(VIDE),
  );

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    const complete = solution();
    const poses = melanger(Array.from({ length: CASES }, (_, i) => i)).slice(
      0,
      DONNEES,
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDonnees(
      Array.from({ length: CASES }, (_, i) =>
        poses.includes(i) ? complete[i] : VIDE,
      ),
    );
  }, []);

  const grille = donnees.map((valeur, i) =>
    valeur === VIDE ? saisies[i] : valeur,
  );
  const juste = donnees.length === CASES && valide(grille);

  useEffect(() => {
    if (juste) onResolu();
  }, [juste, onResolu]);

  return (
    <div className="relative w-full">
      <Grille colonnes={COTE}>
        {grille.map((valeur, index) => {
          const posee = donnees[index] !== VIDE;
          return (
            <button
              key={index}
              aria-label={
                valeur === VIDE
                  ? `Case ${index + 1}, vide`
                  : `Case ${index + 1}, ${valeur + 1} points${posee ? ", posée" : ""}`
              }
              disabled={posee}
              onClick={() =>
                setSaisies(
                  saisies.map((v, i) =>
                    i === index ? ((v + 2) % (COTE + 1)) - 1 : v,
                  ),
                )
              }
              className="flex aspect-square cursor-pointer items-center justify-center gap-1 rounded-sm transition-colors duration-200 disabled:cursor-default"
              style={{
                // Quatre nuances d'une même couleur ne se distinguent pas :
                // la valeur se compte en points. Les cases posées d'avance se
                // reconnaissent à leur fond légèrement teinté.
                backgroundColor: juste
                  ? couleurs.cible
                  : posee
                    ? melange(couleurs, TEINTE_POSEE)
                    : couleurs.repos,
              }}
            >
              {!juste &&
                valeur !== VIDE &&
                Array.from({ length: valeur + 1 }, (_, p) => (
                  <span
                    key={p}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: couleurs.cible }}
                  />
                ))}
            </button>
          );
        })}
      </Grille>

      {/* Le seul texte du jeu : la grille remplie ne dit pas d'elle-même
          qu'elle est valide, contrairement aux autres niveaux où la couleur
          suffit. */}
      {juste && (
        <div
          role="status"
          className="apparait pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div
            className="flex flex-col items-center gap-1 rounded-lg px-6 py-4 text-center"
            style={{ backgroundColor: couleurs.repos, color: couleurs.cible }}
          >
            <span className="text-xl font-semibold">Sudoku terminé</span>
            <span className="text-sm opacity-80">
              Les quatre teintes partout : réussi.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
