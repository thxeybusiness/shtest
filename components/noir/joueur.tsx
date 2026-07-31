"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { TOTAL_NIVEAUX, type Niveau } from "@/lib/noir/niveaux";
import { useProgressionNoir } from "@/lib/noir/progression";

/** L'indice ne s'offre qu'après ce délai : chercher fait partie du jeu. */
const DELAI_INDICE_MS = 35_000;

export function Joueur({ niveau }: { niveau: Niveau }) {
  const { resolus, marquer } = useProgressionNoir();
  const [resolu, setResolu] = useState(false);
  const [indiceOffert, setIndiceOffert] = useState(false);
  const [indiceLu, setIndiceLu] = useState(false);

  const Composant = niveau.composant;
  const suivant = niveau.numero < TOTAL_NIVEAUX ? niveau.numero + 1 : null;
  const dejaResolu = resolus.includes(niveau.numero);

  const onResolu = useCallback(() => {
    setResolu(true);
    marquer(niveau.numero);
  }, [marquer, niveau.numero]);

  // L'ampoule n'apparaît qu'au bout d'un moment : chercher fait partie du jeu.
  useEffect(() => {
    if (resolu) return;
    const id = window.setTimeout(() => setIndiceOffert(true), DELAI_INDICE_MS);
    return () => window.clearTimeout(id);
  }, [resolu]);

  // Aucun niveau ne peut être bloqué — ceux qui se dérèglent se rallument
  // d'eux-mêmes — donc la seule sortie utile est d'avancer.
  const peutAvancer = resolu || dejaResolu;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 px-5 py-10">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          aria-label="Retour aux niveaux"
          className="text-2xl leading-none text-muted transition hover:text-text"
        >
          ←
        </Link>
        <span className="font-mono text-lg text-muted tabular-nums">
          {String(niveau.numero).padStart(2, "0")}
          <span className="text-muted/50"> / {TOTAL_NIVEAUX}</span>
        </span>
        <button
          onClick={() => setIndiceLu(true)}
          disabled={!indiceOffert || indiceLu || resolu}
          aria-label="Indice"
          className="cursor-pointer text-2xl leading-none transition disabled:cursor-default disabled:opacity-0"
        >
          💡
        </button>
      </div>

      {/* L'aire de jeu : aucune consigne, c'est tout l'exercice. */}
      <div className="flex aspect-square w-full items-center justify-center">
        <Composant onResolu={onResolu} />
      </div>

      <div className="flex min-h-16 flex-col items-center gap-3 text-center">
        {indiceLu && !resolu && (
          <p className="text-sm text-muted italic">{niveau.indice}</p>
        )}

        {peutAvancer &&
          (suivant ? (
            <Link
              href={`/noir/${suivant}`}
              aria-label="Niveau suivant"
              className="text-lg transition hover:opacity-70"
            >
              suivant
            </Link>
          ) : (
            <Link href="/" className="text-lg transition hover:opacity-70">
              Tous les niveaux sont noirs.
            </Link>
          ))}
      </div>
    </div>
  );
}
