import type { SVGProps } from "react";

/**
 * Illustrations au trait, dessinées sur une grille de 24 et calées sur
 * `currentColor` — pas d'émoji, dont le rendu varie d'une machine à l'autre et
 * dont les couleurs échappent à la direction artistique.
 */
type IconeProps = SVGProps<SVGSVGElement>;

function Trait({ children, ...props }: IconeProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

/** Ampoule des indices : filament apparent, culot à trois pas. */
export function Ampoule(props: IconeProps) {
  return (
    <Trait {...props}>
      <path d="M9 17.2a6 6 0 1 1 6 0" />
      <path d="M9.5 17.5h5" />
      <path d="M10 20h4" />
      <path d="M10.5 22h3" />
      <path d="M10.6 12.4 12 10.6l1.4 1.8" />
    </Trait>
  );
}

/** Cadenas des paliers verrouillés. */
export function Cadenas(props: IconeProps) {
  return (
    <Trait {...props}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15.5" r="1.4" />
    </Trait>
  );
}

/** Flux de blocs qui descendent, pour Cascade. */
export function IconeCascade(props: IconeProps) {
  return (
    <Trait {...props}>
      <rect x="3.5" y="3.5" width="6" height="6" rx="1.5" />
      <rect x="14.5" y="8.5" width="6" height="6" rx="1.5" />
      <rect x="3.5" y="14.5" width="6" height="6" rx="1.5" />
      <path d="M12.5 4.5v2M12.5 18v2" />
    </Trait>
  );
}

/** Grille neuf cases, dont trois remplies, pour Sudoku. */
export function IconeSudoku(props: IconeProps) {
  return (
    <Trait {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M9.17 3.5v17M14.83 3.5v17M3.5 9.17h17M3.5 14.83h17" />
      <path d="M6.3 6.3h.01M12 12h.01M17.7 17.7h.01" strokeWidth={2.6} />
    </Trait>
  );
}

/** Mine et son onde, pour le Démineur. */
export function IconeDemineur(props: IconeProps) {
  return (
    <Trait {...props}>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18" />
    </Trait>
  );
}

/** Quatre pions, dont deux trouvés, pour Mastermind. */
export function IconeMastermind(props: IconeProps) {
  return (
    <Trait {...props}>
      <circle cx="6" cy="9" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="13" cy="9" r="2.5" />
      <circle cx="6" cy="16" r="2.5" />
      <circle cx="13" cy="16" r="2.5" fill="currentColor" stroke="none" />
      <path d="M19 6.5v11" />
    </Trait>
  );
}

/** Tuiles et le trou où glisser, pour le Taquin. */
export function IconeTaquin(props: IconeProps) {
  return (
    <Trait {...props}>
      <rect x="3.5" y="3.5" width="8" height="8" rx="1.5" />
      <rect x="12.5" y="3.5" width="8" height="8" rx="1.5" />
      <rect x="3.5" y="12.5" width="8" height="8" rx="1.5" />
      <path d="M14 16.5h5m-2-2 2 2-2 2" />
    </Trait>
  );
}

/** La croix qui bascule, pour Éteins les lumières. */
export function IconeLumieres(props: IconeProps) {
  return (
    <Trait {...props}>
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" stroke="none" />
      <rect x="9" y="2.5" width="6" height="5" rx="1.5" />
      <rect x="9" y="16.5" width="6" height="5" rx="1.5" />
      <rect x="2.5" y="9" width="5" height="6" rx="1.5" />
      <rect x="16.5" y="9" width="5" height="6" rx="1.5" />
    </Trait>
  );
}

/** Étoile pleine ou creuse, pour la notation des casse-têtes. */
export function Etoile({ pleine, ...props }: IconeProps & { pleine?: boolean }) {
  return (
    <Trait fill={pleine ? "currentColor" : "none"} strokeWidth={1.4} {...props}>
      <path d="M12 3.6l2.6 5.3 5.8.85-4.2 4.1 1 5.75L12 16.9l-5.2 2.7 1-5.75-4.2-4.1 5.8-.85z" />
    </Trait>
  );
}
