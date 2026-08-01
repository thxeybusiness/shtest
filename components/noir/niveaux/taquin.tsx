"use client";

import { useEffect, useState } from "react";
import { melange, useCouleurs } from "@/components/noir/couleurs";
import { Grille } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 3;
const CASES = COTE * COTE;
/** La tuile absente : c'est le trou par lequel tout se déplace. */
const TROU = CASES - 1;

function voisines(position: number): number[] {
  const ligne = Math.floor(position / COTE);
  const colonne = position % COTE;
  const liste: number[] = [];
  if (ligne > 0) liste.push(position - COTE);
  if (ligne < COTE - 1) liste.push(position + COTE);
  if (colonne > 0) liste.push(position - 1);
  if (colonne < COTE - 1) liste.push(position + 1);
  return liste;
}

/** Mélange par coups légaux : la configuration reste donc toujours résoluble. */
function tirage(): number[] {
  const tuiles = Array.from({ length: CASES }, (_, i) => i);
  let trou = TROU;

  for (let coup = 0; coup < 80; coup++) {
    const options = voisines(trou);
    const choix = options[Math.floor(Math.random() * options.length)];
    [tuiles[trou], tuiles[choix]] = [tuiles[choix], tuiles[trou]];
    trou = choix;
  }
  return tuiles.every((valeur, i) => valeur === i) ? tirage() : tuiles;
}

/**
 * Niveau 31 — les tuiles glissent dans le trou. Rien ne dit dans quel ordre
 * les ranger, mais elles vont du plus pâle au plus franc : c'est ce dégradé
 * qu'il faut reconstituer, ligne après ligne.
 */
export function Taquin({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [tuiles, setTuiles] = useState<number[]>([]);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTuiles(tirage());
  }, []);

  const range =
    tuiles.length > 0 && tuiles.every((valeur, i) => valeur === i);

  useEffect(() => {
    if (range) onResolu();
  }, [range, onResolu]);

  const glisser = (position: number) => {
    if (range || tuiles[position] === TROU) return;

    const trou = tuiles.indexOf(TROU);
    if (!voisines(position).includes(trou)) return;

    const suivant = [...tuiles];
    [suivant[trou], suivant[position]] = [suivant[position], suivant[trou]];
    setTuiles(suivant);
  };

  return (
    <Grille colonnes={COTE}>
      {tuiles.map((valeur, position) => (
        <button
          key={position}
          aria-label={`Case ${position + 1}`}
          disabled={valeur === TROU}
          onClick={() => glisser(position)}
          className="aspect-square cursor-pointer rounded-sm transition-colors duration-150 disabled:cursor-default"
          style={{
            backgroundColor: range
              ? couleurs.cible
              : valeur === TROU
                ? "transparent"
                : melange(couleurs, (valeur + 1) / TROU),
          }}
        />
      ))}
    </Grille>
  );
}
