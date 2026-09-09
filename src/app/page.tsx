"use client";

import Link from "next/link";
import {
  ChefHat,
  Clock,
  Globe,
  QrCode,
  Radio,
  Shield,
  Sparkles,
  TrendingUp,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Button } from "@/components/ui/Button";
import { usePreferences } from "@/providers/PreferencesProvider";
import DashboardPreview from "@/components/marketing/DashboardPreview";
import { HeroMouseGlow } from "@/components/marketing/HeroMouseGlow";

export default function HomePage() {
  const { t } = usePreferences();
  const m = t.marketing;

  const features = [
    {
      icon: Zap,
      title: m.feat1Title,
      desc: m.feat1Desc,
      tag: "WebSockets",
    },
    {
      icon: QrCode,
      title: m.feat2Title,
      desc: m.feat2Desc,
      tag: "No App",
    },
    {
      icon: Shield,
      title: m.feat3Title,
      desc: m.feat3Desc,
      tag: "5 ta Rol",
    },
    {
      icon: Globe,
      title: m.feat4Title,
      desc: m.feat4Desc,
      tag: "UZ · RU · EN",
    },
  ];

  const steps = [
    {
      num: m.howStep1Num,
      title: m.howStep1Title,
      desc: m.howStep1Desc,
      icon: QrCode,
    },
    {
      num: m.howStep2Num,
      title: m.howStep2Title,
      desc: m.howStep2Desc,
      icon: ChefHat,
    },
    {
      num: m.howStep3Num,
      title: m.howStep3Title,
      desc: m.howStep3Desc,
      icon: TrendingUp,
    },
  ];

  const stats = [
    { val: m.stat1Val, label: m.stat1Label },
    { val: m.stat2Val, label: m.stat2Label },
    { val: m.stat3Val, label: m.stat3Label },
    { val: m.stat4Val, label: m.stat4Label },
  ];

  return (
    <MarketingLayout>
      {/* ─── 1. HERO SECTION ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="animate-fade-in-up [animation-delay:0ms] [animation-fill-mode:forwards] opacity-0 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/50 bg-[var(--accent)]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--accent-bright)] backdrop-blur-sm">
              <span className="size-2 rounded-full bg-[var(--accent-bright)] animate-pulse" />
              {m.badge}
            </div>

            {/* Main Headline */}
            <h1 className="animate-fade-in-up [animation-delay:150ms] [animation-fill-mode:forwards] opacity-0 mt-8 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-5xl lg:text-6xl leading-[1.12]">
              {m.heroTitleAccent}
            </h1>

            {/* Description */}
            <p className="animate-fade-in-up [animation-delay:320ms] [animation-fill-mode:forwards] opacity-0 mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-[var(--muted)]">
              {m.heroDesc}
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up [animation-delay:480ms] [animation-fill-mode:forwards] opacity-0 mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="h-14 px-8 text-base font-bold shadow-lg shadow-[var(--accent)]/25">
                  {m.heroCtaPrimary} &rarr;
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-14 px-8 text-base font-bold"
                >
                  <Sparkles className="size-4 mr-2 text-[var(--accent)]" />
                  {m.heroCtaSecondary}
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Live Dashboard Preview Mockup */}
          <div className="animate-fade-in-up [animation-delay:650ms] [animation-fill-mode:forwards] opacity-0 mt-16 sm:mt-20">
            <DashboardPreview>
              <div className="relative mx-auto max-w-5xl rounded-3xl border border-[var(--line)] bg-[var(--surface)]/90 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-8">

              {/* Fake Browser / App Header */}
              <div className="flex items-center justify-between border-b border-[var(--line)]/80 pb-4">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-rose-500/80" />
                  <div className="size-3 rounded-full bg-amber-500/80" />
                  <div className="size-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-xs font-bold text-[var(--muted)]">
                    app.restoflow.uz/live
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <Radio className="size-3 animate-pulse" />
                    Jonli efir (WebSocket)
                  </span>
                </div>
              </div>

              {/* Mock Dashboard Grid */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Metric 1 */}
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--muted)]">Bugungi tushum</span>
                    <TrendingUp className="size-4 text-emerald-500" />
                  </div>
                  <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--ink)]">
                    12 450 000 <span className="text-xs text-[var(--muted)] font-normal">UZS</span>
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    +18.4% o&apos;tgan haftaga nisbatan
                  </p>
                </div>

                {/* Metric 2 */}
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--muted)]">Faol buyurtmalar</span>
                    <UtensilsCrossed className="size-4 text-amber-500" />
                  </div>
                  <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--ink)]">
                    9 ta <span className="text-xs text-[var(--muted)] font-normal">stol xizmatda</span>
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                    4 ta tayyorlanmoqda, 5 ta kutilmoqda
                  </p>
                </div>

                {/* Metric 3: KDS live item */}
                <div className="rounded-2xl border border-teal-500/30 bg-teal-500/10 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--accent)]">KDS #104 · Stol 6</span>
                    <Clock className="size-4 text-[var(--accent)]" />
                  </div>
                  <p className="mt-2 text-sm font-bold text-[var(--ink)]">
                    2x O&apos;sh, 1x Sezar salat, 2x Choy
                  </p>
                  <span className="mt-2 inline-block rounded-md bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold text-[var(--accent-fg)]">
                    Tayyorlanmoqda · 6 daqiqa
                  </span>
                </div>
              </div>
            </div>
            </DashboardPreview>
          </div>
        </div>
      </section>

      {/* ─── 2. NIMA UCHUN RESTOFLOW? ──────────────────────────────────────── */}
      <section className="py-20 bg-[var(--surface)]/50 border-y border-[var(--line)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
              {m.whyTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-[var(--muted)]">
              {m.whySubtitle}
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="group relative flex flex-col justify-between rounded-3xl border border-[var(--line)] bg-[var(--bg)] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-xl hover:shadow-[var(--accent)]/5"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] transition group-hover:scale-110">
                        <Icon className="size-6" />
                      </div>
                      <span className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[10px] font-bold tracking-wider text-[var(--muted)]">
                        {feat.tag}
                      </span>
                    </div>

                    <h3 className="mt-6 text-lg font-bold text-[var(--ink)]">
                      {feat.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 3. QANDAY ISHLAYDI? (3 QADAM) ────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
              Oddiy & Tezkor
            </span>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
              {m.howTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-[var(--muted)]">
              {m.howSubtitle}
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="relative rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 transition hover:border-[var(--accent)]/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-display)] text-3xl font-black text-[var(--accent)]">
                      {step.num}
                    </span>
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--bg)] text-[var(--ink)] border border-[var(--line)]">
                      <Icon className="size-5 text-[var(--accent)]" />
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-[var(--ink)]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 4. STATISTIKA / IJTIMOIY ISBOT ───────────────────────────────── */}
      <section className="border-y border-[var(--line)] bg-[var(--surface)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
            {m.statsTag}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[var(--line)]/80 bg-[var(--bg)] p-6 text-center shadow-sm"
              >
                <p className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[var(--accent)] sm:text-4xl">
                  {item.val}
                </p>
                <p className="mt-1 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. YAKUNIY CTA BANDI ─────────────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-[2.5rem] border border-[var(--accent)]/30 bg-gradient-to-b from-[var(--surface)] to-[var(--bg)] p-10 sm:p-16 shadow-2xl relative overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-[var(--accent)]/20 blur-3xl"
            />
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-black text-[var(--ink)] sm:text-5xl">
              {m.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-[var(--muted)] leading-relaxed">
              {m.ctaDesc}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="h-14 px-8 text-base font-bold shadow-xl shadow-[var(--accent)]/30">
                  {m.ctaBtn} &rarr;
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="secondary" size="lg" className="h-14 px-8 text-base font-bold">
                  {m.navPricing}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
