"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { paliers } from "@/lib/noir/paliers";

/**
 * Le sommaire peint son fond du noir plein au blanc. L'en-tête et le pied de
 * page doivent suivre, sinon le bleu nuit du site casse la bande de couleur.
 */
function chromeDuMenu(dernier: boolean) {
  const palier = dernier ? paliers[paliers.length - 1] : paliers[0];
  return {
    background: palier.couleurs.cible,
    color: palier.couleurs.repos,
    borderColor: `color-mix(in srgb, ${palier.couleurs.repos} 20%, transparent)`,
  };
}

export function SiteHeader() {
  const menu = usePathname() === "/";
  const style = menu ? chromeDuMenu(false) : undefined;

  return (
    <header
      style={style}
      // Sur le menu l'en-tête appartient au premier palier : le laisser collant
      // ferait flotter une barre noire au-dessus du palier blanc.
      className={
        menu
          ? "border-b"
          : "sticky top-0 z-30 border-b border-border bg-bg/70 backdrop-blur"
      }
    >
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          noir
        </Link>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <Link href="/" className="opacity-70 transition hover:opacity-100">
            Énigmes
          </Link>
          <Link
            href="/mecaniques"
            className="opacity-70 transition hover:opacity-100"
          >
            Casse-têtes
          </Link>
          <Link
            href="/libre"
            className="opacity-70 transition hover:opacity-100"
          >
            Partie libre
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const menu = usePathname() === "/";
  const style = menu ? chromeDuMenu(true) : undefined;

  return (
    <footer
      style={style}
      className={
        menu
          ? "px-5 py-6 text-center text-sm"
          : "border-t border-border px-5 py-6 text-center text-sm text-muted"
      }
    >
      {/* L'atténuation ne porte que sur le texte : sur le menu, une opacité
          posée sur le pied de page laisserait le fond du site traverser le
          blanc du dernier palier. */}
      <span className={menu ? "opacity-70" : undefined}>
        Tout se joue hors ligne, dans votre navigateur.
      </span>
    </footer>
  );
}
