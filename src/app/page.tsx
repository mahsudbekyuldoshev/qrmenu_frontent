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
              className="rounded-xl px-4 py-2 text-sm font-semibold text-[var(--accent-fg)] bg-[var(--accent)] transition hover:brightness-110"
            >
              {t.login}
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--ink)]"
            >
              {t.register}
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
          </div>
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
