"use client";

import { useEffect, useState } from "react";
import { useCouleurs } from "@/components/noir/couleurs";
import type { NiveauProps } from "@/lib/noir/types";

const COTE = 4;
const CASES = COTE * COTE;

function comptes(motif: boolean[]): { lignes: number[]; colonnes: number[] } {
  const lignes = Array.from({ length: COTE }, (_, l) =>
    motif.slice(l * COTE, l * COTE + COTE).filter(Boolean).length,
  );
  const colonnes = Array.from(
    { length: COTE },
    (_, c) => motif.filter((v, i) => v && i % COTE === c).length,
  );
  return { lignes, colonnes };
}

function tirage(): boolean[] {
  const motif = Array.from({ length: CASES }, () => Math.random() < 0.5);
  const pleines = motif.filter(Boolean).length;
  // Ni presque vide ni presque plein : sans quoi il n'y a rien à déduire.
  return pleines < 5 || pleines > 11 ? tirage() : motif;
}

/**
 * Niveau 38 — les chiffres en marge disent combien de cases doivent être
 * atteintes sur chaque ligne et chaque colonne. Rien d'autre n'est indiqué,
 * et toute grille qui satisfait les comptes est bonne.
 */
export function Nonogramme({ onResolu }: NiveauProps) {
  const couleurs = useCouleurs();
  const [attendus, setAttendus] = useState<{
    lignes: number[];
    colonnes: number[];
  } | null>(null);
  const [cases, setCases] = useState<boolean[]>(() =>
    Array<boolean>(CASES).fill(false),
  );

  // Tirage après l'hydratation : il est aléatoire.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttendus(comptes(tirage()));
  }, []);

  const actuels = comptes(cases);
  const juste =
    attendus !== null &&
    attendus.lignes.every((n, i) => n === actuels.lignes[i]) &&
    attendus.colonnes.every((n, i) => n === actuels.colonnes[i]);

  useEffect(() => {
    if (juste) onResolu();
  }, [juste, onResolu]);

  return (
    <div
      className="grid w-full gap-2"
      style={{ gridTemplateColumns: `repeat(${COTE + 1}, minmax(0, 1fr))` }}
    >
      <span aria-hidden />
      {(attendus?.colonnes ?? []).map((valeur, c) => (
        <Compte
          key={`c${c}`}
          valeur={valeur}
          fait={valeur === actuels.colonnes[c]}
          encre={couleurs.cible}
        />
      ))}

      {Array.from({ length: COTE }, (_, l) => (
        <ContenuLigne
          key={l}
          ligne={l}
          cases={cases}
          juste={juste}
          attendu={attendus?.lignes[l] ?? 0}
          fait={(attendus?.lignes[l] ?? -1) === actuels.lignes[l]}
          couleurs={couleurs}
          onToucher={(index) =>
            setCases(cases.map((v, i) => (i === index ? !v : v)))
          }
        />
      ))}
    </div>
  );
}

/** Un compte en marge : il s'affirme dès que sa ligne ou sa colonne tombe juste. */
function Compte({
  valeur,
  fait,
  encre,
}: {
  valeur: number;
  fait: boolean;
  encre: string;
}) {
  return (
    <span
      className="flex aspect-square items-center justify-center font-mono text-sm tabular-nums transition-opacity duration-200"
      style={{ color: encre, opacity: fait ? 1 : 0.45 }}
    >
      {valeur}
    </span>
  );
}

function ContenuLigne({
  ligne,
  cases,
  juste,
  attendu,
  fait,
  couleurs,
  onToucher,
}: {
  ligne: number;
  cases: boolean[];
  juste: boolean;
  attendu: number;
  fait: boolean;
  couleurs: { cible: string; repos: string };
  onToucher: (index: number) => void;
}) {
  return (
    <>
      <Compte valeur={attendu} fait={fait} encre={couleurs.cible} />
      {Array.from({ length: COTE }, (_, c) => {
        const index = ligne * COTE + c;
        return (
          <button
            key={index}
            aria-label={`Case ${index + 1}`}
            aria-pressed={cases[index]}
            onClick={() => onToucher(index)}
            className="aspect-square cursor-pointer rounded-sm transition-colors duration-200"
            style={{
              backgroundColor:
                juste || cases[index] ? couleurs.cible : couleurs.repos,
            }}
          />
        );
      })}
    </>
  );
}
