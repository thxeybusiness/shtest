import { Etoile } from "@/components/icones";
import { cn } from "@/lib/cn";

/** Trois étoiles, dont `count` pleines. */
export function Stars({
  count,
  size = "sm",
}: {
  count: number;
  size?: "sm" | "lg";
}) {
  return (
    <span
      className="inline-flex gap-0.5"
      aria-label={`${count} étoile${count > 1 ? "s" : ""} sur 3`}
      role="img"
    >
      {[1, 2, 3].map((slot) => (
        <Etoile
          key={slot}
          pleine={slot <= count}
          className={cn(
            size === "lg" ? "h-8 w-8" : "h-4 w-4",
            slot <= count ? "text-tone-sand" : "text-border",
          )}
        />
      ))}
    </span>
  );
}
