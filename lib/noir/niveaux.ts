import type { ComponentType } from "react";
import { Toucher } from "@/components/noir/niveaux/toucher";
import { Voisins } from "@/components/noir/niveaux/voisins";
import { Ordre } from "@/components/noir/niveaux/ordre";
import { Compte } from "@/components/noir/niveaux/compte";
import { Patience } from "@/components/noir/niveaux/patience";
import { Miroir } from "@/components/noir/niveaux/miroir";
import { Maintenir } from "@/components/noir/niveaux/maintenir";
import { Bord } from "@/components/noir/niveaux/bord";
import { Intrus } from "@/components/noir/niveaux/intrus";
import { Sequence } from "@/components/noir/niveaux/sequence";
import { CouronneNiveau } from "@/components/noir/niveaux/couronne";
import { SaufUne } from "@/components/noir/niveaux/sauf-une";
import { Chemin } from "@/components/noir/niveaux/chemin";
import { Somme } from "@/components/noir/niveaux/somme";
import { Rebours } from "@/components/noir/niveaux/rebours";
import { TroisEtats } from "@/components/noir/niveaux/trois-etats";
import { SymetrieDouble } from "@/components/noir/niveaux/symetrie";
import { Glissement } from "@/components/noir/niveaux/glissement";
import { Alternance } from "@/components/noir/niveaux/alternance";
import { Silence } from "@/components/noir/niveaux/silence";
import { palierDuNiveau, type Palier } from "./paliers";
import type { NiveauProps } from "./types";

/**
 * Le jeu ne donne aucune consigne : deviner la règle du niveau *est* le
 * niveau. Le seul texte prévu est l'indice, et il ne se propose qu'au bout
 * d'un moment.
 *
 * La couleur ne vient pas du niveau mais de son palier : dix niveaux
 * partagent la même cible.
 */
export type Niveau = {
  numero: number;
  palier: Palier;
  composant: ComponentType<NiveauProps>;
  /** Poussée dans la bonne direction, sans donner la solution. */
  indice: string;
};

type Definition = {
  composant: ComponentType<NiveauProps>;
  indice: string;
};

const DEFINITIONS: Definition[] = [
  // ── Palier 1 — noir ────────────────────────────────────────────────────────
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
    indice:
      "La grille a un axe. Ce que vous faites d'un côté se voit de l'autre.",
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

  // ── Palier 2 — blanc ───────────────────────────────────────────────────────
  {
    composant: CouronneNiveau,
    indice: "L'anneau n'a ni début ni fin : la première touche la dernière.",
  },
  {
    composant: SaufUne,
    indice:
      "Regardez bien celle que vous touchez : c'est la seule à ne rien faire.",
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
    composant: Rebours,
    indice: "Regardez le tour, puis refaites-le en remontant depuis la fin.",
  },
  {
    composant: TroisEtats,
    indice: "Trois teintes, un cran à la fois — et les coins suivent.",
  },
  {
    composant: SymetrieDouble,
    indice: "Deux axes cette fois. Les quatre coins vont ensemble.",
  },
  {
    composant: Glissement,
    indice: "Toute la ligne avance, et sa tête change au passage. Insistez.",
  },
  {
    composant: Alternance,
    indice: "Un côté, puis l'autre. Jamais deux fois le même d'affilée.",
  },
  {
    composant: Silence,
    indice: "Rien ne presse. C'est même tout le contraire.",
  },
];

export const niveaux: Niveau[] = DEFINITIONS.map((definition, index) => ({
  numero: index + 1,
  palier: palierDuNiveau(index + 1),
  composant: definition.composant,
  indice: definition.indice,
}));

export const TOTAL_NIVEAUX = niveaux.length;

export function getNiveau(numero: number): Niveau | undefined {
  return niveaux.find((niveau) => niveau.numero === numero);
}
