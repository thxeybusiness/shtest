"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Brique de base de tous les niveaux : une case carrée qui n'a que deux
 * états, claire ou noire. Le but de chaque niveau est de tout passer au noir.
 */
export function Piece({
  noire,
  className,
  ...props
}: ComponentProps<"button"> & { noire: boolean }) {
  return (
    <button
      aria-pressed={noire}
      className={cn(
        "aspect-square cursor-pointer rounded-sm transition-colors duration-200",
        noire ? "bg-black" : "bg-clair",
        className,
      )}
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
