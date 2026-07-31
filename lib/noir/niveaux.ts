import type { ComponentType } from "react";
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
import type { NiveauProps } from "./types";

/**
 * Le jeu ne donne aucune consigne : deviner la règle du niveau *est* le
 * niveau. Le seul texte prévu est l'indice, et il ne se propose qu'au bout
 * d'un moment.
 */
export type Niveau = {
  numero: number;
  composant: ComponentType<NiveauProps>;
  /** Poussée dans la bonne direction, sans donner la solution. */
  indice: string;
};

export const niveaux: Niveau[] = [
  {
    numero: 1,
    composant: Toucher,
    indice: "Rien de caché ici. Chaque case attend son tour.",
  },
  {
    numero: 2,
    composant: Voisins,
    indice: "Une case ne part jamais seule.",
  },
  {
    numero: 3,
    composant: Ordre,
    indice: "Les chiffres ne sont pas là pour décorer. Et il y a un début.",
  },
  {
    numero: 4,
    composant: Compte,
    indice: "Le chiffre diminue. Il dit quelque chose sur ce qui reste à faire.",
  },
  {
    numero: 5,
    composant: Patience,
    indice: "Ça avançait tout seul, jusqu'à ce que vous interveniez.",
  },
  {
    numero: 6,
    composant: Miroir,
    indice: "La grille a un axe. Ce que vous faites d'un côté se voit de l'autre.",
  },
  {
    numero: 7,
    composant: Maintenir,
    indice: "Un toucher ne suffit pas. Ne lâchez pas.",
  },
  {
    numero: 8,
    composant: Bord,
    indice: "Les cases ne répondent pas. Autour d'elles, si.",
  },
  {
    numero: 9,
    composant: Intrus,
    indice: "L'une d'elles est un peu plus sombre que les autres.",
  },
  {
    numero: 10,
    composant: Sequence,
    indice: "Regardez d'abord, jouez ensuite. Dans le même ordre.",
  },
];

export const TOTAL_NIVEAUX = niveaux.length;

export function getNiveau(numero: number): Niveau | undefined {
  return niveaux.find((niveau) => niveau.numero === numero);
}
