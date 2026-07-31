import type { ComponentType } from "react";
import type { Couleurs } from "@/components/noir/couleurs";
import { Toucher } from "@/components/noir/niveaux/n01-toucher";
import { Voisins } from "@/components/noir/niveaux/n02-voisins";
import { Ordre } from "@/components/noir/niveaux/n03-ordre";
import { Compte } from "@/components/noir/niveaux/n04-compte";
import { Patience } from "@/components/noir/niveaux/n05-patience";
import { Miroir } from "@/components/noir/niveaux/n06-miroir";
import { Maintenir } from "@/components/noir/niveaux/n07-maintenir";
import { Bord } from "@/components/noir/niveaux/n08-bord";
import { Intrus } from "@/components/noir/niveaux/n09-intrus";
import { Sequence } from "@/components/noir/niveaux/n10-sequence";
import { LigneColonne } from "@/components/noir/niveaux/n11-ligne-colonne";
import { SaufUne } from "@/components/noir/niveaux/n12-sauf-une";
import { Chemin } from "@/components/noir/niveaux/n13-chemin";
import { Somme } from "@/components/noir/niveaux/n14-somme";
import { TroisEtats } from "@/components/noir/niveaux/n15-trois-etats";
import { Rebours } from "@/components/noir/niveaux/n16-rebours";
import type { NiveauProps } from "./types";

/**
 * Le jeu ne donne aucune consigne : deviner la règle du niveau *est* le
 * niveau. Le seul texte prévu est l'indice, et il ne se propose qu'au bout
 * d'un moment.
 *
 * Chaque niveau a sa propre couleur à faire apparaître. Le premier est noir ;
 * le deuxième bascule au blanc, pour le contraste ; les suivants s'éloignent
 * du blanc par un dégradé continu, qui se réchauffe puis replonge vers la
 * nuit. La difficulté suit la même pente.
 */
export type Niveau = {
  numero: number;
  composant: ComponentType<NiveauProps>;
  couleurs: Couleurs;
  /** Poussée dans la bonne direction, sans donner la solution. */
  indice: string;
};

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

/**
 * Le repos est celui des deux neutres qui tranche le plus avec la cible. Un
 * simple seuil de clarté laissait les teintes intermédiaires — la terre cuite
 * notamment — trop proches de leur fond.
 */
function reposPour(cible: string): string {
  return contraste(cible, SOMBRE) >= contraste(cible, CLAIR) ? SOMBRE : CLAIR;
}

/** Les couleurs à atteindre, dans l'ordre des niveaux. */
const CIBLES = [
  "#000000", // 1 — noir
  "#ffffff", // 2 — blanc, le contraste maximal avec le précédent
  "#f0e8dc", // 3 — le dégradé s'éloigne du blanc
  "#e3d2ba", // 4
  "#d6bc99", // 5
  "#cba677", // 6
  "#c59463", // 7
  "#bd7f5a", // 8
  "#b26a5b", // 9
  "#a55c62", // 10
  "#93536d", // 11
  "#7d4e76", // 12
  "#63497a", // 13
  "#494a76", // 14
  "#33456a", // 15
  "#203a58", // 16 — retour vers la nuit
];

type Definition = {
  composant: ComponentType<NiveauProps>;
  indice: string;
};

const DEFINITIONS: Definition[] = [
  {
    composant: Toucher,
    indice: "Rien de caché ici. Chaque case attend son tour.",
  },
  { composant: Voisins, indice: "Une case ne part jamais seule." },
  {
    composant: Ordre,
    indice: "Les chiffres ne sont pas là pour décorer. Et il y a un début.",
  },
  {
    composant: Compte,
    indice: "Le chiffre diminue. Il dit ce qui reste à faire.",
  },
  {
    composant: Patience,
    indice: "Ça avançait tout seul, jusqu'à ce que vous interveniez.",
  },
  {
    composant: Miroir,
    indice: "La grille a un axe. Ce que vous faites d'un côté se voit de l'autre.",
  },
  { composant: Maintenir, indice: "Un toucher ne suffit pas. Ne lâchez pas." },
  { composant: Bord, indice: "Les cases ne répondent pas. Autour d'elles, si." },
  {
    composant: Intrus,
    indice: "L'une d'elles est un peu plus proche de la couleur que les autres.",
  },
  {
    composant: Sequence,
    indice: "Regardez d'abord, jouez ensuite. Dans le même ordre.",
  },
  {
    composant: LigneColonne,
    indice: "Ce n'est plus le voisinage qui suit, c'est la croix entière.",
  },
  {
    composant: SaufUne,
    indice: "Regardez bien celle que vous touchez : c'est la seule à ne rien faire.",
  },
  {
    composant: Chemin,
    indice:
      "D'un seul trait, sans lever le doigt. Toutes les cases de départ ne se valent pas.",
  },
  {
    composant: Somme,
    indice: "Le grand nombre doit tomber juste. Ni plus, ni moins.",
  },
  {
    composant: TroisEtats,
    indice: "Trois teintes, un cran à la fois — et les coins suivent.",
  },
  {
    composant: Rebours,
    indice: "Le même exercice qu'avant, mais en remontant depuis la fin.",
  },
];

export const niveaux: Niveau[] = DEFINITIONS.map((definition, index) => {
  const cible = CIBLES[index];
  return {
    numero: index + 1,
    composant: definition.composant,
    indice: definition.indice,
    couleurs: { cible, repos: reposPour(cible) },
  };
});

export const TOTAL_NIVEAUX = niveaux.length;

export function getNiveau(numero: number): Niveau | undefined {
  return niveaux.find((niveau) => niveau.numero === numero);
}
