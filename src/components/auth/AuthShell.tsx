import Link from "next/link";
import type { ReactNode } from "react";
import { TopBar } from "@/components/chrome/TopBar";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { LanguageSelect } from "@/components/chrome/LanguageSelect";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="hub-shell relative min-h-dvh overflow-hidden">
      {/* Background orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
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

      {/* TopBar */}
      <TopBar
        left={
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-[var(--ink)]"
          >
            Resto<span className="text-[var(--accent)]">Flow</span>
          </Link>
        }
        right={
          <>
            <LanguageSelect />
            <ThemeToggle />
          </>
        }
      />

      <div className="relative mx-auto flex w-full max-w-md flex-col px-5 py-12 sm:px-6">
        <Link
          href="/login"
          className="animate-fade-up mb-8 inline-flex w-fit items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--accent-bright)]"
        >
          ← Rolni tanlash
        </Link>

        <p className="animate-fade-up text-xs uppercase tracking-[0.28em] text-[var(--accent-bright)]">
          RestoFlow
        </p>
        <h1
          className="animate-fade-up mt-3 font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--ink)]"
          style={{ animationDelay: "60ms" }}
        >
          {title}
        </h1>
        <p
          className="animate-fade-up mt-2 text-sm leading-relaxed text-[var(--muted)]"
          style={{ animationDelay: "100ms" }}
        >
          {subtitle}
        </p>

        <div
          className="animate-fade-up mt-8 rounded-2xl border border-[var(--line)] bg-[var(--surface)]/60 p-5 backdrop-blur-md sm:p-6"
          style={{ animationDelay: "160ms" }}
        >
          {children}
        </div>

        <p
          className="animate-fade-up mt-6 text-center text-sm text-[var(--muted)]"
          style={{ animationDelay: "220ms" }}
        >
          {footer}
        </p>
      </div>
    </main>
  );
}
