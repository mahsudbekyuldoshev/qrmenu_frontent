import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success" | "warn";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--accent-fg)] hover:brightness-110 shadow-[0_8px_24px_-12px_rgba(15,118,110,0.65)]",
  secondary:
    "bg-[var(--surface-2)] text-[var(--ink)] hover:bg-[var(--surface-3)] border border-[var(--line)]",
  ghost: "bg-transparent text-[var(--ink)] hover:bg-[var(--surface-2)]",
  danger: "bg-[#b42318] text-white hover:brightness-110",
  success: "bg-[#067647] text-white hover:brightness-110",
  warn: "bg-[#b54708] text-white hover:brightness-110",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-11 px-4 text-sm rounded-xl",
  lg: "h-12 px-5 text-base rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
