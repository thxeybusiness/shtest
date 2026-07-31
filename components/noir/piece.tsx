"use client";

import type { ComponentProps } from "react";
import { useCouleurs } from "@/components/noir/couleurs";
import { cn } from "@/lib/cn";

/**
 * Brique de base de tous les niveaux : une case carrée qui n'a que deux
 * états, au repos ou à la couleur du niveau.
 */
export function Piece({
  atteinte,
  className,
  ...props
}: ComponentProps<"button"> & { atteinte: boolean }) {
  const couleurs = useCouleurs();

  return (
    <button
      aria-pressed={atteinte}
      className={cn(
        "aspect-square cursor-pointer rounded-sm transition-colors duration-200",
        className,
      )}
      style={{
        backgroundColor: atteinte ? couleurs.cible : couleurs.repos,
      }}
      {...props}
    />
  );
}

/** Grille carrée de `colonnes` colonnes, centrée dans l'aire de jeu. */
export function Grille({
  colonnes,
  children,
  className,
}: {
  colonnes: number;
  children: React.ReactNode;
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
