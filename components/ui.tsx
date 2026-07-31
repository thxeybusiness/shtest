import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  variant = "secondary",
  className,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-accent text-accent-fg shadow-[0_0_20px_-6px] shadow-accent hover:brightness-110",
    secondary: "bg-surface border border-border hover:border-accent/60",
    ghost: "hover:bg-surface-2",
  };

  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

type SegmentedControlProps<T extends string> = {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  format?: (value: T) => string;
};

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  format = (option) => option,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex rounded-lg border border-border bg-surface p-1"
    >
      {options.map((option) => (
        <button
          key={option}
          role="radio"
          aria-checked={option === value}
          onClick={() => onChange(option)}
          className={cn(
            "cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium capitalize transition",
            option === value
              ? "bg-accent text-accent-fg shadow-[0_0_18px_-6px] shadow-accent"
              : "text-muted hover:text-text",
          )}
        >
          {format(option)}
        </button>
      ))}
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex min-w-20 flex-col rounded-lg border border-border bg-surface/60 px-3 py-2">
      <span className="text-[0.7rem] tracking-widest text-muted uppercase">
        {label}
      </span>
      <span className="font-mono text-lg leading-tight tabular-nums">
        {value}
      </span>
    </div>
  );
}

export function Banner({
  tone,
  children,
}: {
  tone: "good" | "bad";
  children: ReactNode;
}) {
  return (
    <div
      role="status"
      className={cn(
        "glow-text rounded-lg border px-4 py-3 text-sm font-semibold",
        tone === "good" ? "border-good/50 text-good" : "border-bad/50 text-bad",
      )}
    >
      {children}
    </div>
  );
}
