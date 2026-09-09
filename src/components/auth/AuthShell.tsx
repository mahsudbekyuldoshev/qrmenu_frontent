
import Link from "next/link";
import type { ReactNode } from "react";
import { TopBar } from "@/components/chrome/TopBar";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { LanguageSelect } from "@/components/chrome/LanguageSelect";
import { Flame, ArrowLeft } from "lucide-react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="relative min-h-dvh flex flex-col overflow-hidden">
      {/* Login sahifasiga xos qo'shimcha qorong'i qatlam */}
      <div className="absolute inset-0 -z-10 bg-black/20 dark:bg-black/40" />

      {/* TopBar */}
      <TopBar
        left={
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--accent-fg)] shadow-md shadow-[var(--accent)]/20 transition group-hover:scale-105">
              <Flame className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-[var(--ink)] leading-none">
                Resto<span className="text-[var(--accent)]">Flow</span>
              </span>
            </div>
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
          className="animate-fade-up mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)]/50 px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface)] hover:text-[var(--accent)]"
        >
          <ArrowLeft className="size-4" />
          Rolni tanlash
        </Link>

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
