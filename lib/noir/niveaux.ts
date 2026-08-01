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
import { Paires } from "@/components/noir/niveaux/paires";
import { Cavalier } from "@/components/noir/niveaux/cavalier";
import { Fantome } from "@/components/noir/niveaux/fantome";
import { Tailles } from "@/components/noir/niveaux/tailles";
import { Double } from "@/components/noir/niveaux/double";
import { Sablier } from "@/components/noir/niveaux/sablier";
import { Chaud } from "@/components/noir/niveaux/chaud";
import { Interrupteurs } from "@/components/noir/niveaux/interrupteurs";
import { Empreinte } from "@/components/noir/niveaux/empreinte";
import { Ronde } from "@/components/noir/niveaux/ronde";
import { Taquin } from "@/components/noir/niveaux/taquin";
import { Code } from "@/components/noir/niveaux/code";
import { Contagion } from "@/components/noir/niveaux/contagion";
import { Retard } from "@/components/noir/niveaux/retard";
import { Pesee } from "@/components/noir/niveaux/pesee";
import { Appui } from "@/components/noir/niveaux/appui";
import { AxeCache } from "@/components/noir/niveaux/axe";
import { Nonogramme } from "@/components/noir/niveaux/nonogramme";
import { Engrenage } from "@/components/noir/niveaux/engrenage";
import { Hanoi } from "@/components/noir/niveaux/hanoi";
import { Lumieres } from "@/components/noir/niveaux/lumieres";
import { Sudoku } from "@/components/noir/niveaux/sudoku";
import { Tournee } from "@/components/noir/niveaux/tournee";
import { AnneauTrois } from "@/components/noir/niveaux/anneau-trois";
import { Rangs } from "@/components/noir/niveaux/rangs";
import { Traverse } from "@/components/noir/niveaux/traverse";
import { Jumelles } from "@/components/noir/niveaux/jumelles";
import { Domino } from "@/components/noir/niveaux/domino";
import { Chiffres } from "@/components/noir/niveaux/chiffres";
import { Aiguille } from "@/components/noir/niveaux/aiguille";
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

  // ── Palier 3 — bleu ────────────────────────────────────────────────────────
  {
    composant: Paires,
    indice: "Rien ne se joue tout seul ici : chaque signe existe en double.",
  },
  {
    composant: Cavalier,
    indice: "Ni les voisines, ni la ligne : regardez plus loin, et de biais.",
  },
  {
    composant: Fantome,
    indice: "Chaque case en éteint une autre. Voyez laquelle, et remontez.",
  },
  {
    composant: Tailles,
    indice: "Pas de chiffres, mais un ordre quand même. Regardez la taille.",
  },
  {
    composant: Double,
    indice: "Un toucher ne suffit pas, et deux touchers lents non plus.",
  },
  {
    composant: Sablier,
    indice: "Rien ne tient longtemps. Ne réfléchissez plus, enchaînez.",
  },
  {
    composant: Chaud,
    indice:
      "Une case se cache. Les autres ne s'allument pas, elles se réchauffent.",
  },
  {
    composant: Interrupteurs,
    indice: "Le haut commande le bas, mais pas un pour un.",
  },
  {
    composant: Empreinte,
    indice: "L'ordre n'a aucune importance : ce sont les cases qui comptent.",
  },
  {
    composant: Ronde,
    indice: "Il faut la toucher là où elle est, pas là où elle était.",
  },

  // ── Palier 4 — rouge ───────────────────────────────────────────────────────
  {
    composant: Taquin,
    indice: "Le trou est la seule chose qui bouge. Rangez du plus pâle au plus franc.",
  },
  {
    composant: Code,
    indice: "Les quatre repères du haut comptent, sans jamais désigner.",
  },
  {
    composant: Contagion,
    indice: "Ce n'est pas la case touchée qui change, c'est le coin haut-gauche.",
  },
  {
    composant: Retard,
    indice: "Ce que vous venez de faire n'arrivera qu'au prochain toucher.",
  },
  {
    composant: Pesee,
    indice: "Les deux côtés doivent peser exactement pareil.",
  },
  {
    composant: Appui,
    indice:
      "Le doigt dit deux choses selon le temps qu'il reste posé, et il faut les deux.",
  },
  {
    composant: AxeCache,
    indice: "Il y a bien un axe. Le premier toucher est ce qui le révèle.",
  },
  {
    composant: Nonogramme,
    indice: "Les chiffres en marge comptent les cases de leur ligne.",
  },
  {
    composant: Engrenage,
    indice: "Tourner l'un entraîne le suivant, et plus vite que lui.",
  },
  {
    composant: Hanoi,
    indice: "Jamais un grand sur un petit. Tout doit finir à droite.",
  },

  // ── Palier 5 — vert ────────────────────────────────────────────────────────
  {
    composant: Lumieres,
    indice: "Descendez ligne par ligne : la première décide de tout le reste.",
  },
  {
    composant: Sudoku,
    indice: "Quatre teintes, et chacune une seule fois par ligne, colonne et bloc.",
  },
  {
    composant: Tournee,
    indice: "Des sauts de cavalier, sans repasser. Le départ n'est pas anodin.",
  },
  {
    composant: AnneauTrois,
    indice: "Cinq cases avancent d'un cran à la fois, et l'anneau n'a pas de fin.",
  },
  {
    composant: Rangs,
    indice: "Rien ne s'allume : les cases s'échangent, et les lignes doivent s'égaler.",
  },
  {
    composant: Traverse,
    indice: "Quatre cases sont mortes. Toutes les autres, d'un seul trait.",
  },
  {
    composant: Jumelles,
    indice: "Chaque grille renvoie sur l'autre, mais pas de la même façon.",
  },
  {
    composant: Domino,
    indice: "Deux cases à la fois, côte à côte. Une paire posée se reprend.",
  },
  {
    composant: Chiffres,
    indice: "Le chiffre d'une case parle de ses voisines, pas d'elle.",
  },
  {
    composant: Aiguille,
    indice: "Une seule case n'est pas comme les autres. Trois fois de suite.",
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
