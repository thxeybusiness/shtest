# Jeux de logique

Cinq casse-têtes classiques jouables directement dans le navigateur, sans
compte ni backend. Les meilleurs scores sont stockés localement.

| Jeu | Route | Ce qu'on y trouve |
| --- | --- | --- |
| Sudoku | `/sudoku` | Génération à solution unique, 4 difficultés, notes, indices, saisie clavier |
| Démineur | `/demineur` | 3 niveaux, première ouverture toujours sûre, drapeaux (clic droit ou mode tactile) |
| Mastermind | `/mastermind` | 3 niveaux (4-5 pions, 6-8 couleurs), indices bien placés / mal placés |
| Taquin | `/taquin` | 3×3 à 5×5, mélange toujours résoluble, jouable aux flèches |
| Éteins les lumières | `/lumieres` | 3×3 à 6×6, grilles garanties résolubles |

## Développement

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## Déploiement

- **Dépôt** : `thxeybusiness/shtest` (branche `main`)
- **Projet Vercel** : `shtest` (équipe `thxey`)

Une fois le dépôt connecté au projet Vercel (Vercel → projet `shtest` →
Settings → Git → Connect Git Repository) :

- push sur `main` → déploiement **production** ;
- push sur une autre branche → déploiement **preview**.

## Structure

```
app/            une route par jeu, chacune avec son composant client
components/     briques d'interface partagées (boutons, stats, bandeaux)
lib/            règles et générateurs de chaque jeu, sans dépendance à React
```

Toute la logique de jeu vit dans `lib/` et ne dépend pas de React : les
générateurs (sudoku à solution unique, mélanges toujours résolubles) sont donc
testables et réutilisables indépendamment de l'interface.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript
