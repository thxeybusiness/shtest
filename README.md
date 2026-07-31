# Jeux de logique

Une campagne de 30 niveaux bâtie sur six mécaniques de casse-tête, jouable
directement dans le navigateur, sans compte ni backend. La progression et les
records sont stockés localement.

## Direction artistique

Fond sombre en permanence (noir, bleu nuit) ; l'aire de jeu est en blanc et en
couleurs fluo qui s'en détachent nettement. La palette est centralisée dans
`app/globals.css` sous forme de variables CSS (`--neon-*`), exposées à Tailwind
via `@theme inline` (`text-neon-cyan`, `bg-neon-magenta`, …). Deux utilitaires
portent le néon : `.glow` (halo) et `.glow-text`, tous deux calés sur
`currentColor`.

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
