"use client";

import { useEffect, useState } from "react";
import { useCouleurs } from "@/components/noir/couleurs";
import { Grille, Piece } from "@/components/noir/piece";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 3;
const CASES = COTE * COTE;

function sommes(valeurs: number[]): number[] {
  return Array.from({ length: COTE }, (_, l) =>
    valeurs
      .slice(l * COTE, l * COTE + COTE)
      .reduce((total, v) => total + v, 0),
  );
}

function egales(valeurs: number[]): boolean {
  const totaux = sommes(valeurs);
  return totaux.every((t) => t === totaux[0]);
}

/**
 * Les neuf premiers nombres totalisent quarante-cinq : trois lignes égales
 * valent donc quinze chacune, et une telle répartition existe toujours.
 */
function tirage(): number[] {
  const valeurs = Array.from({ length: CASES }, (_, i) => i + 1);
  for (let i = valeurs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [valeurs[i], valeurs[j]] = [valeurs[j], valeurs[i]];
  }
  return egales(valeurs) ? tirage() : valeurs;
}

/**
 * Niveau 45 — les cases ne s'allument pas, elles s'échangent : une première
 * pour la prendre, une seconde pour la troquer. Les trois lignes doivent
 * finir par peser pareil.
 */
export function Rangs({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [valeurs, setValeurs] = useState<number[]>([]);
  const [prise, setPrise] = useState<number | null>(null);

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValeurs(tirage());
  }, []);

  const juste = valeurs.length === CASES && egales(valeurs);

  useEffect(() => {
    if (juste) onResolu();
  }, [juste, onResolu]);

  const toucher = (index: number) => {
    if (juste) return;
    if (prise === null || prise === index) {
      setPrise(prise === index ? null : index);
      return;
    }

    const suivant = [...valeurs];
    [suivant[prise], suivant[index]] = [suivant[index], suivant[prise]];
    setValeurs(suivant);
    setPrise(null);
  };

  return (
    <Grille colonnes={COTE}>
      {valeurs.map((valeur, index) => {
        const choisie = prise === index;
        return (
          <Piece
            key={index}
            atteinte={juste || choisie}
            aria-label={`Case ${index + 1}, valeur ${valeur}`}
            onClick={() => toucher(index)}
            className="flex items-center justify-center"
          >
            <span
              className="font-mono text-lg font-bold tabular-nums"
              style={{
                color: juste || choisie ? couleurs.repos : couleurs.cible,
              }}
            >
              {valeur}
            </span>
          </Piece>
        );
      })}
    </Grille>
  );
}
