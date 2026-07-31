"use client";

import type { ComponentProps, ReactNode } from "react";
import { useCouleurs } from "@/components/noir/couleurs";
import { cn } from "@/lib/cn";

/** Les niveaux ne sont pas tous des carrés : la forme fait partie de l'énigme. */
export type Forme = "carre" | "rond";

/**
 * Brique de base de tous les niveaux : une case qui n'a que deux états, au
 * repos ou à la couleur du palier.
 */
export function Piece({
  atteinte,
  forme = "carre",
  className,
  ...props
}: ComponentProps<"button"> & { atteinte: boolean; forme?: Forme }) {
  const couleurs = useCouleurs();

  return (
    <button
      aria-pressed={atteinte}
      className={cn(
        "aspect-square cursor-pointer transition-colors duration-200",
        forme === "rond" ? "rounded-full" : "rounded-sm",
        className,
      )}
      style={{
        backgroundColor: atteinte ? couleurs.cible : couleurs.repos,
      }}
      {...props}
    />
  );
}

/** Grille de `colonnes` colonnes, centrée dans l'aire de jeu. */
export function Grille({
  colonnes,
  children,
  className,
}: {
  colonnes: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("grid w-full gap-2", className)}
      style={{ gridTemplateColumns: `repeat(${colonnes}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  );
}

/** Rangée unique, pour les niveaux qui se lisent de gauche à droite. */
export function Rangee({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full items-center gap-3", className)}>
      {children}
    </div>
  );
}

/**
 * Anneau : les cases sont posées sur un cercle. `taille` est la part du côté
 * occupée par une case, ce qui suffit à les placer sans mesurer le conteneur.
 */
export function Couronne({
  enfants,
  taille = 22,
}: {
  enfants: ReactNode[];
  taille?: number;
}) {
  const rayon = 50 - taille / 2 - 2;

  return (
    <div className="relative aspect-square w-full">
      {enfants.map((enfant, index) => {
        // On part du haut et on tourne dans le sens des aiguilles.
        const angle = (index / enfants.length) * 2 * Math.PI - Math.PI / 2;
        return (
          <div
            key={index}
            className="absolute"
            style={{
              width: `${taille}%`,
              left: `${50 + rayon * Math.cos(angle) - taille / 2}%`,
              top: `${50 + rayon * Math.sin(angle) - taille / 2}%`,
            }}
          >
            {enfant}
          </div>
        );
      })}
    </div>
  );
}
