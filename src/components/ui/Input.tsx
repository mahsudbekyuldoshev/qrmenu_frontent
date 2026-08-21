import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  trailing?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, trailing, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      {label && <span className="text-sm font-medium text-[var(--ink)]">{label}</span>}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-12 w-full rounded-xl border bg-[var(--surface)] px-4 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)]/60",
            "border-[var(--line)] focus:border-[var(--accent-bright)]/60 focus:ring-2 focus:ring-[var(--accent-bright)]/20",
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
      {error ? <p className="text-xs text-red-500 dark:text-red-400">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-[var(--muted)]">{hint}</p> : null}
    </label>
  );
});
