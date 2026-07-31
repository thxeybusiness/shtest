# noir

Un jeu d'énigmes : **faites disparaître l'écran dans la couleur du palier**.
Vingt niveaux, chacun avec sa propre logique, et aucune n'est expliquée —
deviner la règle *est* le niveau. Tout se joue dans le navigateur, sans compte
ni backend ; la progression est stockée localement.

Inspiré de *black (game)* de Bart Bonte.

## Les paliers

Le jeu avance par **paliers de dix niveaux**, et un palier entier partage la
même couleur à atteindre : le premier est noir, le second blanc. Un palier ne
s'ouvre que lorsque les dix niveaux du précédent sont résolus ; à l'intérieur
d'un palier, chaque niveau ouvre le suivant. Sur le sommaire, un bandeau
dégrade la couleur d'un palier vers celle du suivant — du noir au blanc, puis
du blanc vers ce qui viendra.

La couleur de repos n'est pas choisie à la main : des deux neutres
disponibles, on retient celui qui contraste le plus avec la cible, au sens
WCAG. Ajouter un palier ne demande qu'une entrée dans `lib/noir/paliers.ts`.

## Les énigmes

`/` est le sommaire ; `/noir/[n]` est un niveau. Une fois résolu, le seul lien
proposé est « suivant ». Aucun niveau ne peut être bloqué — ceux qui se
dérèglent se rallument d'eux-mêmes — donc il n'y a rien à recommencer. Le seul
autre texte du jeu est l'indice, et il ne se propose qu'au bout de 35 secondes,
derrière une ampoule.

Chaque niveau est un composant autonome dans `components/noir/niveaux/`, qui
signale sa résolution par `onResolu` et lit sa couleur dans le contexte plutôt
que de la coder en dur.

| # | Logique |
| --- | --- |
| 1 | Chaque case s'éteint d'un toucher |
| 2 | Un toucher bascule aussi les quatre voisines |
| 3 | Les cases ne suivent que l'ordre croissant ; une erreur remet tout à zéro |
| 4 | Chaque case indique combien de touchers il lui reste |
| 5 | La grille se remplit seule — le moindre toucher annule tout |
| 6 | Chaque toucher se répercute sur la case symétrique |
| 7 | Une seule case, à maintenir sans relâcher |
| 8 | Les cases sont inertes ; c'est le cadre qui répond |
| 9 | Une case est un peu plus proche de la couleur que les autres |
| 10 | Les cases clignotent dans un ordre, qu'il faut refaire |
| 11 | Un toucher emporte la ligne et la colonne entières |
| 12 | La case touchée est la seule à ne pas bouger |
| 13 | Parcourir les neuf cases d'un seul trait — tous les départs ne se valent pas |
| 14 | Faire tomber le grand nombre exactement à zéro |
| 15 | Trois teintes, un cran à la fois, les diagonales suivent |
| 16 | Comme la séquence, mais à reproduire à l'envers |
| 17 | Deux axes de symétrie : les quatre coins vont ensemble |
| 18 | La ligne entière avance d'un cran, et sa tête change au passage |
| 19 | Alterner d'une moitié à l'autre, jamais deux fois le même côté |
| 20 | Chaque toucher ne compte que s'il prend son temps |

## Illustrations et mouvement

Aucun émoji : leur rendu varie d'une machine à l'autre et leurs couleurs
échappent à la direction artistique. Tout est dessiné au trait sur une grille
de 24 dans `components/icones.tsx`, calé sur `currentColor` — l'ampoule des
indices, le cadenas des paliers verrouillés, les étoiles des casse-têtes et
une illustration par mécanique.

Le mouvement reste discret et n'a qu'un rôle de rythme : une entrée en fondu
décalée sur les niveaux du sommaire, une onde qui traverse la grille au moment
où le niveau tombe, et une respiration de l'ampoule quand l'indice devient
disponible. Tout est neutralisé sous `prefers-reduced-motion`.

## Le reste du site

Les casse-têtes mécaniques d'origine restent en place : `/mecaniques` héberge la
campagne de 30 niveaux bâtie sur six mécaniques classiques (sudoku, démineur,
mastermind, taquin, lumières, cascade), et `/libre` les mêmes sans objectif.

## Direction artistique

Fond sombre en permanence — pas de variante claire. Pas de fluo ni de halo : sur
des jeux de réflexion, la couleur sert à distinguer et à hiérarchiser, pas à
éclairer. Les teintes sont donc désaturées et la lecture revient au blanc et aux
chiffres.

La palette est centralisée dans `app/globals.css` sous forme de variables CSS
(`--tone-*`), exposées à Tailwind via `@theme inline` (`text-tone-slate`,
`bg-tone-clay`, …). Elle est rangée de la plus froide à la plus chaude —
ardoise, sarcelle, sauge, sable, terre cuite, vieux rose, prune, brique — et cet
ordre porte du sens : la terre cuite sert d'accent d'interface, la brique de
signal de danger. Les chapitres de la campagne suivent la même montée, si bien
que la carte annonce l'escalade à elle seule.

## Le suspense

Le seuil d'une étoile n'est pas qu'un barème constaté après coup : c'est une
**réserve qui se vide en jouant** (`budgetOf` dans `lib/campaign.ts`). Le niveau
affiche ce qu'il en reste, la jauge passe du calme à la terre cuite puis à la
brique, et l'épuiser fait perdre la partie sur-le-champ.

Passé la moitié de la réserve, un assombrissement rouge cerne l'écran et son
intensité suit la pression ; au-delà de 85 %, il se met à battre et le compteur
avec lui. Cascade, qui n'a pas de réserve, tire sa tension de ses vies (dès la
deuxième perdue, battement sur la dernière) et d'un bord bas qui s'assombrit à
mesure qu'un bloc s'en approche — sans révéler lequel il fallait cliquer.

Les mécaniques alimentent tout cela par une seule prop, `onProgress`, qui
rapporte la métrique en cours au niveau qui les héberge. Toutes les animations
de tension respectent `prefers-reduced-motion`.

## La campagne

`/` est la carte des niveaux. Chaque niveau fige la configuration d'une
mécanique et y ajoute un objectif chiffré, noté de 0 à 3 étoiles ; il faut au
moins une étoile pour ouvrir le suivant.

| Chapitre | Niveaux | Thème |
| --- | --- | --- |
| 1. Initiation | 1-6 | Les six mécaniques, une par une |
| 2. Déduction | 7-12 | Les grilles s'agrandissent |
| 3. Sous pression | 13-18 | Le chrono et les coups se resserrent |
| 4. Maîtrise | 19-24 | Les configurations les plus larges |
| 5. Épreuve finale | 25-30 | Tout ce que le site sait faire |

Les objectifs se mesurent sur trois métriques : `time` et `moves` se jouent à
la baisse, `score` à la hausse. Le barème complet vit dans `lib/campaign.ts`,
la progression dans `lib/progress.ts`.

## Les mécaniques

| Jeu | Partie libre | Ce qu'on y trouve |
| --- | --- | --- |
| Cascade | `/cascade` | Défilement vertical continu : cliquez les blocs vérifiant la règle affichée avant qu'ils ne sortent par le bas |
| Sudoku | `/sudoku` | Génération à solution unique, 4 difficultés, notes, indices, saisie clavier |
| Démineur | `/demineur` | 3 niveaux, première ouverture toujours sûre, drapeaux (clic droit ou mode tactile) |
| Mastermind | `/mastermind` | 3 niveaux (4-5 pions, 6-8 couleurs), indices bien placés / mal placés |
| Taquin | `/taquin` | 3×3 à 5×5, mélange toujours résoluble, jouable aux flèches |
| Éteins les lumières | `/lumieres` | 3×3 à 6×6, grilles garanties résolubles |

Chaque mécanique est un composant unique, utilisé aussi bien en partie libre
qu'en campagne. Deux props optionnelles font la bascule : une configuration
figée (`fixedDifficulty`, `fixedSize`, …), qui masque le sélecteur de réglages,
et `onFinish`, par lequel la partie signale son résultat au niveau qui
l'héberge. `/libre` liste les six mécaniques sans objectif.

## Développement

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## Déploiement

- **Dépôt** : `thxeybusiness/shtest` (branche `main`)
- **Projet Vercel** : `shtest` (équipe `thxey`) — domaine `shtest.business`

Une fois le dépôt connecté au projet Vercel (Vercel → projet `shtest` →
Settings → Git → Connect Git Repository) :

- push sur `main` → déploiement **production** ;
- push sur une autre branche → déploiement **preview**.

## Structure

```
app/            une route par mécanique, plus /niveau/[id] et la carte
components/     briques d'interface partagées (boutons, étoiles, carte)
lib/            règles, générateurs, campagne et progression — sans React
```

Toute la logique vit dans `lib/` et ne dépend pas de React. Les générateurs
garantissent des grilles résolubles (sudoku vérifié par comptage de solutions,
mélanges obtenus par coups légaux). Cascade suit le même principe :
`lib/cascade.ts` expose un état immuable avancé par `advance(state, dt)`, et le
composant se contente d'appeler cette fonction à chaque image.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript
