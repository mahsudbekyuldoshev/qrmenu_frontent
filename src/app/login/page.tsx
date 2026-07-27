"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChefHat,
  LayoutDashboard,
  QrCode,
  UtensilsCrossed,
  ArrowRight,
  LogIn,
} from "lucide-react";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { LanguageSelect } from "@/components/chrome/LanguageSelect";
import { TopBar } from "@/components/chrome/TopBar";

const roles = [
  {
    id: "director",
    href: "/director",
    label: "Direktor / Menejer",
    desc: "Tushum, buyurtmalar, stollar va analitika ko'rish",
    icon: LayoutDashboard,
    color: "from-purple-500/20 to-violet-500/10",
    accent: "text-purple-400",
    ring: "ring-purple-400/40",
    hoverBorder: "hover:border-purple-400/50",
  },
  {
    id: "kds",
    href: "/kds",
    label: "Oshxona (KDS)",
    desc: "Yangi buyurtmalarni qabul qilish va tayyorlanishini kuzatish",
    icon: ChefHat,
    color: "from-orange-500/20 to-amber-500/10",
    accent: "text-orange-400",
    ring: "ring-orange-400/40",
    hoverBorder: "hover:border-orange-400/50",
  },
  {
    id: "waiter",
    href: "/waiter",
    label: "Ofitsiant",
    desc: "Tayyor taomlarni yetkazish va mijoz chaqiruvlari",
    icon: UtensilsCrossed,
    color: "from-blue-500/20 to-indigo-500/10",
    accent: "text-blue-400",
    ring: "ring-blue-400/40",
    hoverBorder: "hover:border-blue-400/50",
  },
  {
    id: "menu",
    href: "/menu/5",
    label: "QR-Menyu",
    desc: "Mijoz interfeysi — stol #5 demo ko'rinishi",
    icon: QrCode,
    color: "from-teal-500/20 to-emerald-500/10",
    accent: "text-teal-400",
    ring: "ring-teal-400/40",
    hoverBorder: "hover:border-teal-400/50",
  },
];

export default function RoleSelectPage() {
  const router = useRouter();

  return (
    <main className="hub-shell relative min-h-dvh overflow-hidden">
      {/* Background blur orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 size-[500px] rounded-full bg-[var(--accent)]/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-10 size-[400px] rounded-full bg-purple-500/10 blur-3xl"
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

      <div className="relative mx-auto flex min-h-[calc(100dvh-4rem)] max-w-3xl flex-col justify-center px-5 py-12 md:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent-bright)]">
            <LogIn className="size-3.5" />
            Rolni tanlang
          </p>
          <h1
            className="animate-fade-up mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--ink)] md:text-5xl"
            style={{ animationDelay: "60ms" }}
          >
            Qaysi panelga kirasiz?
          </h1>
          <p
            className="animate-fade-up mt-3 text-sm leading-relaxed text-[var(--muted)]"
            style={{ animationDelay: "100ms" }}
          >
            Rolni tanlang — tizim siz uchun mos ekranni ochadi.
            <br />
            Email/parol bilan kirish uchun{" "}
            <Link
              href="/login/email"
              className="text-[var(--accent-bright)] underline-offset-2 hover:underline"
            >
              bu yerga bosing
            </Link>
            .
          </p>
        </div>

        {/* Role cards */}
        <div
          className="animate-fade-up grid gap-4 sm:grid-cols-2"
          style={{ animationDelay: "160ms" }}
        >
          {roles.map((role, idx) => (
            <button
              key={role.id}
              type="button"
              onClick={() => router.push(role.href)}
              className={`group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-[var(--line)] bg-gradient-to-br ${role.color} p-5 text-left backdrop-blur-sm transition duration-300 ${role.hoverBorder} hover:-translate-y-0.5 hover:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.25)] active:scale-[0.98]`}
              style={{ animationDelay: `${160 + idx * 40}ms` }}
            >
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)]/70 ring-1 ${role.ring} ${role.accent}`}
              >
                <role.icon className="size-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
                  {role.label}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                  {role.desc}
                </p>
              </div>
              <ArrowRight className="mt-0.5 size-5 shrink-0 text-[var(--muted)]/40 transition group-hover:translate-x-1 group-hover:text-[var(--accent)]" />
            </button>
          ))}
        </div>

        {/* Footer note */}
        <p
          className="animate-fade-up mt-8 text-center text-sm text-[var(--muted)]"
          style={{ animationDelay: "340ms" }}
        >
          Demo akkauntlar:{" "}
          <code className="rounded bg-[var(--surface)] px-1.5 py-0.5 text-xs text-[var(--ink)]">
            director@restoflow.uz
          </code>{" "}
          /{" "}
          <code className="rounded bg-[var(--surface)] px-1.5 py-0.5 text-xs text-[var(--ink)]">
            demo1234
          </code>
        </p>
      </div>
    </main>
  );
}
