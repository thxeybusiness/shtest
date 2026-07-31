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
    primary: "bg-accent text-accent-fg hover:opacity-90",
    secondary: "bg-surface border border-border hover:bg-surface-2",
    ghost: "hover:bg-surface-2",
  };

  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40",
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
              ? "bg-accent text-accent-fg"
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
    <div className="flex min-w-20 flex-col rounded-lg border border-border bg-surface px-3 py-2">
      <span className="text-[0.7rem] tracking-wide text-muted uppercase">
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
        "rounded-lg border px-4 py-3 text-sm font-medium",
        tone === "good"
          ? "border-good/40 text-good"
          : "border-bad/40 text-bad",
      )}
    >
      {children}
    </div>
  );
}
