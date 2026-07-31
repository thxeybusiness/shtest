"use client";

import { createContext, useContext } from "react";

/**
 * Chaque niveau a sa propre couleur à atteindre, et une couleur de repos
 * placée à l'opposé en clarté. Les composants de niveau les lisent ici plutôt
 * que de coder le noir en dur.
 */
export type Couleurs = {
  /** La couleur qu'il faut faire apparaître partout. */
  cible: string;
  /** La couleur d'une case encore intacte. */
  repos: string;
};

const CouleursContext = createContext<Couleurs>({
  cible: "#000000",
  repos: "#e8e6e1",
});

export function useCouleurs(): Couleurs {
  return useContext(CouleursContext);
}

/** Mélange la cible et le repos, pour les niveaux à états intermédiaires. */
export function melange(couleurs: Couleurs, part: number): string {
  const p = Math.min(1, Math.max(0, part)) * 100;
  return `color-mix(in srgb, ${couleurs.cible} ${p}%, ${couleurs.repos})`;
}

export function FournisseurCouleurs({
  couleurs,
  children,
}: {
  couleurs: Couleurs;
  children: React.ReactNode;
}) {
  return (
    <CouleursContext.Provider value={couleurs}>
      {children}
    </CouleursContext.Provider>
  );
}
