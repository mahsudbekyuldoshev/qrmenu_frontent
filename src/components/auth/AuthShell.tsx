import Link from "next/link";
import type { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="hub-shell relative min-h-dvh overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.45) 60%, transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 size-72 rounded-full bg-[var(--accent)]/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-10 size-80 rounded-full bg-teal-400/10 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-12 sm:px-6">
        <Link
          href="/"
          className="animate-fade-up mb-8 inline-flex w-fit items-center gap-2 text-sm text-white/50 transition hover:text-[var(--accent-bright)]"
        >
          ← Bosh sahifa
        </Link>

        <p className="animate-fade-up text-xs uppercase tracking-[0.28em] text-[var(--accent-bright)]">
          RestoFlow
        </p>
        <h1
          className="animate-fade-up mt-3 font-[family-name:var(--font-display)] text-4xl tracking-tight text-white"
          style={{ animationDelay: "60ms" }}
        >
          {title}
        </h1>
        <p
          className="animate-fade-up mt-2 text-sm leading-relaxed text-white/60"
          style={{ animationDelay: "100ms" }}
        >
          {subtitle}
        </p>

        <div
          className="animate-fade-up mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:p-6"
          style={{ animationDelay: "160ms" }}
        >
          {children}
        </div>

        <p
          className="animate-fade-up mt-6 text-center text-sm text-white/50"
          style={{ animationDelay: "220ms" }}
        >
          {footer}
        </p>
      </div>
    </main>
  );
}
