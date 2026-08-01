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
  { nom: "bleu", cible: "#2b6cae" },
  { nom: "rouge", cible: "#a83b3a" },
  { nom: "vert", cible: "#46915e" },
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

// ── Dégradé entre deux paliers ───────────────────────────────────────────────
//
// Un dégradé CSS ordinaire interpole en sRGB : la progression est irrégulière
// à l'œil, et le passage traverse le gris parce que la ligne droite entre
// deux couleurs vives frôle l'axe des neutres. Du rouge au vert, cela donne
// un kaki au milieu.
//
// On calcule donc les étapes nous-mêmes en Oklch : la clarté et l'intensité
// avancent régulièrement, et la teinte tourne par le plus court chemin. Le
// rouge rejoint le vert en balayant l'orange puis le jaune, et le bleu
// rejoint le rouge par le violet — sans jamais retomber dans le gris.
//
// Une interpolation linéaire laisse par ailleurs une cassure de pente aux
// deux extrémités : la couleur est continue mais sa vitesse de changement ne
// l'est pas, et l'œil lit une ligne là où il n'y en a pas. La courbe en S
// ci-dessous part et arrive à vitesse nulle, ce qui efface les deux
// jonctions avec les aplats.

type Oklab = [number, number, number];
/** Clarté, intensité, teinte en radians. */
type Oklch = { clarte: number; intensite: number; teinte: number };

const versLineaire = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

const versGamma = (c: number) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

function oklabDepuisHex(hex: string): Oklab {
  const [r, v, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(versLineaire);

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * v + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * v + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * v + 0.6299787005 * b);

  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function lineaireDepuisOklab([L, A, B]: Oklab): number[] {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function hexDepuisOklab(oklab: Oklab): string {
  return (
    "#" +
    lineaireDepuisOklab(oklab)
      .map((c) => Math.round(Math.min(1, Math.max(0, versGamma(c))) * 255))
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")
  );
}

/** En dessous de cette intensité la teinte n'a plus de sens : c'est un gris. */
const GRIS = 0.0005;

function oklchDepuisHex(hex: string): Oklch {
  const [clarte, a, b] = oklabDepuisHex(hex);
  return { clarte, intensite: Math.hypot(a, b), teinte: Math.atan2(b, a) };
}

const enOklab = ({ clarte, intensite, teinte }: Oklch): Oklab => [
  clarte,
  intensite * Math.cos(teinte),
  intensite * Math.sin(teinte),
];

const affichable = (oklch: Oklch) =>
  lineaireDepuisOklab(enOklab(oklch)).every((c) => c >= -0.001 && c <= 1.001);

/**
 * Le chemin le plus court en teinte sort parfois de ce que l'écran sait
 * afficher — du rouge au vert, le bleu se retrouverait négatif au milieu.
 * Plutôt que d'écrêter canal par canal, ce qui déplacerait la teinte, on
 * baisse l'intensité juste assez pour rentrer, en gardant clarté et teinte.
 */
function hexDepuisOklch(couleur: Oklch): string {
  if (affichable(couleur)) return hexDepuisOklab(enOklab(couleur));

  let bas = 0;
  let haut = couleur.intensite;
  for (let i = 0; i < 24; i++) {
    const milieu = (bas + haut) / 2;
    if (affichable({ ...couleur, intensite: milieu })) bas = milieu;
    else haut = milieu;
  }
  return hexDepuisOklab(enOklab({ ...couleur, intensite: bas }));
}

/** Courbe en S : vitesse et accélération nulles aux deux bouts. */
const adoucir = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/** Nombre d'étapes du dégradé : au-delà, la différence ne se voit plus. */
const ETAPES = 32;

/** Le dégradé qui relie un palier au suivant, pour le fond du sommaire. */
export function degradeEntre(a: Palier, b: Palier): string {
  const depart = oklchDepuisHex(a.couleurs.cible);
  const arrivee = oklchDepuisHex(b.couleurs.cible);

  // Un gris n'a pas de teinte : il emprunte celle de l'autre extrémité,
  // sinon il partirait vers une couleur arbitraire en gagnant en intensité.
  const teinteDepart =
    depart.intensite < GRIS ? arrivee.teinte : depart.teinte;
  const teinteArrivee =
    arrivee.intensite < GRIS ? teinteDepart : arrivee.teinte;

  // La teinte tourne par le plus court des deux sens.
  let ecart = teinteArrivee - teinteDepart;
  if (ecart > Math.PI) ecart -= 2 * Math.PI;
  if (ecart < -Math.PI) ecart += 2 * Math.PI;

  const etapes = Array.from({ length: ETAPES }, (_, i) => {
    const position = i / (ETAPES - 1);
    const part = adoucir(position);
    const couleur = hexDepuisOklch({
      clarte: depart.clarte + (arrivee.clarte - depart.clarte) * part,
      intensite:
        depart.intensite + (arrivee.intensite - depart.intensite) * part,
      teinte: teinteDepart + ecart * part,
    });
    return `${couleur} ${(position * 100).toFixed(2)}%`;
  });

  return `linear-gradient(to bottom, ${etapes.join(", ")})`;
}
