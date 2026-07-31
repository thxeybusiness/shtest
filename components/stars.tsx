import { cn } from "@/lib/cn";

/** Trois étoiles, dont `count` allumées. */
export function Stars({
  count,
  size = "sm",
}: {
  count: number;
  size?: "sm" | "lg";
}) {
  return (
    <span
      className={cn(
        "inline-flex gap-0.5",
        size === "lg" ? "text-3xl" : "text-sm",
      )}
      aria-label={`${count} étoile${count > 1 ? "s" : ""} sur 3`}
      role="img"
    >
      {[1, 2, 3].map((slot) => (
        <span
          key={slot}
          aria-hidden
          className={
            slot <= count
              ? "text-neon-yellow glow-text"
              : "text-border"
          }
        >
          ★
        </span>
      ))}
    </span>
  );
}
