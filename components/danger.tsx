"use client";

/**
 * Halo rouge en bord d'écran dont l'intensité suit la pression, et qui se met
 * à battre quand la situation devient critique. Purement décoratif : il ne
 * capte aucun clic.
 */
export function DangerVignette({
  /** Pression de 0 (calme) à 1 (imminent). */
  level,
}: {
  level: number;
}) {
  const clamped = Math.min(1, Math.max(0, level));
  // En dessous de la moitié, on ne montre rien : le danger doit se mériter.
  if (clamped < 0.5) return null;

  const critical = clamped >= 0.85;
  // 0.5 → 0 puis montée vers 0.55 : l'écran rougit progressivement.
  const opacity = ((clamped - 0.5) / 0.5) * 0.55;

  return (
    <div
      aria-hidden
      className="danger-vignette"
      data-critical={critical}
      style={critical ? undefined : { opacity }}
    />
  );
}
