
import Link from "next/link";
import type { ReactNode } from "react";
import { TopBar } from "@/components/chrome/TopBar";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { LanguageSelect } from "@/components/chrome/LanguageSelect";
import { ArrowLeft } from "lucide-react";

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
            <img src="/logo.svg" alt="RestoFlow" className="h-9 w-auto transition group-hover:scale-105" />
            {/* Logo handled by SVG */}
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
          href="/"
          className="animate-fade-up mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)]/50 px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface)] hover:text-[var(--accent)]"
        >
          <ArrowLeft className="size-4" />
          Ortga qaytish
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
