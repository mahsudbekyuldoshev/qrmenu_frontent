import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  trailing?: ReactNode;
}

export function Input({
  label,
  error,
  hint,
  trailing,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      <span className="text-sm font-medium text-white/80">{label}</span>
      <div className="relative">
        <input
          id={inputId}
          className={cn(
            "h-12 w-full rounded-xl border bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/35",
            "border-white/15 focus:border-[var(--accent-bright)]/60 focus:bg-white/8 focus:ring-2 focus:ring-[var(--accent-bright)]/20",
            error && "border-red-400/50 focus:border-red-400/70 focus:ring-red-400/20",
            trailing && "pr-11",
            className,
          )}
          {...props}
        />
        {trailing ? (
          <div className="absolute inset-y-0 right-2 flex items-center">{trailing}</div>
        ) : null}
      </div>
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-white/40">{hint}</p> : null}
    </label>
  );
}
