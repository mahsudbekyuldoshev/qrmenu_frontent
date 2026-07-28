"use client";

import Link from "next/link";
import {
  ArrowRight,
  ChefHat,
  LayoutDashboard,
  QrCode,
  UtensilsCrossed,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import { TopBar } from "@/components/chrome/TopBar";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { LanguageSelect } from "@/components/chrome/LanguageSelect";
import { usePreferences } from "@/providers/PreferencesProvider";

const features = [
  {
    icon: Zap,
    title: "Real-time sinxronizatsiya",
    desc: "WebSocket orqali barcha qurilmalar bir vaqtda yangilanadi",
  },
  {
    icon: QrCode,
    title: "QR-menyu",
    desc: "Mijozlar telefon orqali buyurtma beradi — hech qanday ilovasisiz",
  },
  {
    icon: Shield,
    title: "Rol asosida kirish",
    desc: "Direktor, ofitsiant va oshxona — har biri o'z paneliga kiradi",
  },
  {
    icon: Globe,
    title: "Ko'p tilli interfeys",
    desc: "UZ, RU va EN tillarda ishlaydi",
  },
];

export default function HomePage() {
  const { t } = usePreferences();

  const links = [
    {
      href: "/menu/5",
      title: "QR-Menu",
      desc: t.customer,
      icon: QrCode,
      badge: "Live",
      color: "from-teal-500/20 to-emerald-500/10",
      borderHover: "hover:border-teal-400/40",
    },
    {
      href: "/kds",
      title: "KDS",
      desc: t.kitchen,
      icon: ChefHat,
      badge: "Kitchen",
      color: "from-orange-500/15 to-amber-500/10",
      borderHover: "hover:border-orange-400/40",
    },
    {
      href: "/waiter",
      title: t.waiter,
      desc: t.waiter,
      icon: UtensilsCrossed,
      badge: "Station",
      color: "from-blue-500/15 to-indigo-500/10",
      borderHover: "hover:border-blue-400/40",
    },
    {
      href: "/director",
      title: t.director,
      desc: t.director,
      icon: LayoutDashboard,
      badge: "Dashboard",
      color: "from-purple-500/15 to-violet-500/10",
      borderHover: "hover:border-purple-400/40",
    },
  ];

  return (
    <main className="hub-shell relative min-h-dvh overflow-hidden">
      {/* Background image overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.18,
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
        }}
      />
      {/* Gradient orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-20 size-[500px] rounded-full bg-[var(--accent)]/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-20 size-[400px] rounded-full bg-teal-400/10 blur-3xl"
      />

      {/* TopBar with theme + language controls */}
      <TopBar
        left={
          <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-[var(--ink)]">
            Resto<span className="text-[var(--accent)]">Flow</span>
          </span>
        }
        right={
          <>
            <Link
              href="/login"
              className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--ink)]"
            >
              {t.login}
            </Link>
            <LanguageSelect />
            <ThemeToggle />
          </>
        }
      />

      <div className="relative mx-auto max-w-5xl px-5 pb-20 pt-12 md:px-8 md:pt-20">
        {/* Hero section */}
        <div className="text-center">
          <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent-bright)]">
            <span className="size-1.5 rounded-full bg-[var(--accent-bright)] animate-pulse-soft" />
            SaaS · Restoran operatsiyasi
          </p>
          <h1
            className="animate-fade-up mx-auto mt-6 max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight text-[var(--ink)] md:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            RestoFlow
            <span className="block text-[var(--accent)] mt-2 text-4xl md:text-5xl">
              {t.directorPanel}
            </span>
          </h1>
          <p
            className="animate-fade-up mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--muted)] md:text-lg"
            style={{ animationDelay: "140ms" }}
          >
            QR-menyu, oshxona KDS va direktor paneli — bitta oqimda. Demo
            rejimida backend siz ham ishlaydi.
          </p>

          <div
            className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "180ms" }}
          >
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-6 text-sm font-semibold text-[var(--accent-fg)] shadow-[0_8px_24px_-12px_rgba(15,118,110,0.65)] transition hover:brightness-110 active:scale-[0.98]"
            >
              {t.login} <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)]/60 px-6 text-sm font-medium text-[var(--ink)] backdrop-blur-sm transition hover:border-[var(--accent-bright)]/40 hover:bg-[var(--surface)]"
            >
              {t.register}
            </Link>
          </div>
        </div>

        {/* Role cards grid */}
        <div
          className="animate-fade-up mt-16 grid gap-4 sm:grid-cols-2"
          style={{ animationDelay: "220ms" }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative flex items-start justify-between gap-4 overflow-hidden rounded-2xl border border-[var(--line)] bg-gradient-to-br ${link.color} p-6 backdrop-blur-sm transition duration-300 ${link.borderHover} hover:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.25)] hover:-translate-y-0.5`}
            >
              <div className="flex-1 min-w-0">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[var(--surface)]/80 text-[var(--accent)] ring-1 ring-[var(--line)]">
                    <link.icon className="size-5" />
                  </div>
                  <span className="rounded-full border border-[var(--line)] bg-[var(--surface)]/60 px-2.5 py-0.5 text-xs font-medium text-[var(--muted)]">
                    {link.badge}
                  </span>
                </div>
                <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                  {link.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">
                  {link.desc}
                </p>
              </div>
              <ArrowRight className="mt-1 size-5 shrink-0 text-[var(--muted)]/50 transition duration-300 group-hover:translate-x-1 group-hover:text-[var(--accent)]" />
            </Link>
          ))}
        </div>

        {/* Features section */}
        <div
          className="animate-fade-up mt-16"
          style={{ animationDelay: "300ms" }}
        >
          <h2 className="mb-6 text-center font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            Nima uchun RestoFlow?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/60 p-5 backdrop-blur-sm transition hover:border-[var(--accent)]/30 hover:bg-[var(--surface)]"
              >
                <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-[var(--accent)]/15 text-[var(--accent)]">
                  <f.icon className="size-4" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--ink)]">
                  {f.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
