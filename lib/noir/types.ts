/**
 * Un niveau du jeu « noir » : une aire de jeu muette, sans consigne, dont il
 * faut deviner la logique. Le seul but est de tout passer au noir.
 *
 * Chaque niveau est un composant autonome qui prévient le jeu par `onResolu`
 * quand l'écran est entièrement noir.
 */
export type NiveauProps = {
  onResolu: () => void;
};
