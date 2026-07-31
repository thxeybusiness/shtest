import type { Couleurs } from "@/components/noir/couleurs";

/**
 * Le jeu avance par paliers de dix niveaux. Un palier entier partage la même
 * couleur à atteindre ; on passe au suivant seulement quand les dix sont
 * résolus. Le fond qui relie deux paliers dégrade l'une vers l'autre.
 */
export const NIVEAUX_PAR_PALIER = 10;

const CLAIR = "#e8e6e1";
const SOMBRE = "#232833";

/** Luminance relative sRGB, telle que définie par WCAG. */
function luminance(hex: string): number {
  const canaux = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * canaux[0] + 0.7152 * canaux[1] + 0.0722 * canaux[2];
}

function contraste(a: string, b: string): number {
  const [haut, bas] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (haut + 0.05) / (bas + 0.05);
}

/** Des deux neutres, celui qui tranche le plus avec la couleur du palier. */
function reposPour(cible: string): string {
  return contraste(cible, SOMBRE) >= contraste(cible, CLAIR) ? SOMBRE : CLAIR;
}

export type Palier = {
  numero: number;
  nom: string;
  couleurs: Couleurs;
};

/** Couleurs des paliers, dans l'ordre. Les suivants prolongeront la série. */
const COULEURS_PALIERS: { nom: string; cible: string }[] = [
  { nom: "noir", cible: "#000000" },
  { nom: "blanc", cible: "#ffffff" },
];

export const paliers: Palier[] = COULEURS_PALIERS.map((palier, index) => ({
  numero: index + 1,
  nom: palier.nom,
  couleurs: { cible: palier.cible, repos: reposPour(palier.cible) },
}));

export const TOTAL_PALIERS = paliers.length;

export function palierDuNiveau(numero: number): Palier {
  const index = Math.floor((numero - 1) / NIVEAUX_PAR_PALIER);
  return paliers[Math.min(index, paliers.length - 1)];
}

/** Numéros des niveaux d'un palier. */
export function niveauxDuPalier(numeroPalier: number): number[] {
  const debut = (numeroPalier - 1) * NIVEAUX_PAR_PALIER + 1;
  return Array.from({ length: NIVEAUX_PAR_PALIER }, (_, i) => debut + i);
}

/** Le dégradé qui relie un palier au suivant, pour le fond du sommaire. */
export function degradeEntre(a: Palier, b: Palier): string {
  return `linear-gradient(to bottom, ${a.couleurs.cible}, ${b.couleurs.cible})`;
}
