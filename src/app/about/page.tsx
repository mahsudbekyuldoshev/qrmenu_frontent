"use client";

import Link from "next/link";
import {
  Compass,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Button } from "@/components/ui/Button";
import { usePreferences } from "@/providers/PreferencesProvider";

export default function AboutPage() {
  const { t } = usePreferences();
  const m = t.marketing;

  const values = [
    {
      title: m.val1Title,
      desc: m.val1Desc,
      icon: Zap,
      accent: "text-amber-500 bg-amber-500/15",
    },
    {
      title: m.val2Title,
      desc: m.val2Desc,
      icon: ShieldCheck,
      accent: "text-emerald-500 bg-emerald-500/15",
    },
    {
      title: m.val3Title,
      desc: m.val3Desc,
      icon: HeartHandshake,
      accent: "text-teal-500 bg-teal-500/15",
    },
  ];

  return (
    <MarketingLayout>
      <div className="relative overflow-hidden py-16 sm:py-24">
        {/* Ambient Glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-20 -z-10 size-96 rounded-full bg-[var(--accent)]/10 blur-[100px]"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
              {m.navAbout}
            </span>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-[var(--ink)] sm:text-5xl">
              {m.aboutTitle}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[var(--muted)] leading-relaxed">
              {m.aboutDesc}
            </p>
          </div>

          {/* Core Philosophy Quote Block */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="relative rounded-[2.5rem] border border-[var(--accent)]/30 bg-[var(--surface)] p-8 sm:p-12 shadow-xl">
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)]">
                <Sparkles className="size-5" />
              </div>
              <blockquote className="font-[family-name:var(--font-display)] text-lg sm:text-2xl font-bold leading-relaxed text-[var(--ink)]">
                &ldquo;{m.aboutStory}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <div className="size-10 rounded-full bg-[var(--accent)] text-[var(--accent-fg)] flex items-center justify-center font-bold text-sm">
                  RF
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--ink)]">RestoFlow Jamoasi</p>
                  <p className="text-xs text-[var(--muted)]">Toshkent, O&apos;zbekiston</p>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mt-24">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
                Prinsiplarimiz
              </span>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
                {m.valTitle}
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {values.map((val) => {
                const Icon = val.icon;
                return (
                  <div
                    key={val.title}
                    className="flex flex-col justify-between rounded-3xl border border-[var(--line)] bg-[var(--surface)]/60 p-8 transition hover:border-[var(--accent)]/40 hover:bg-[var(--surface)]"
                  >
                    <div>
                      <div
                        className={`flex size-12 items-center justify-center rounded-2xl ${val.accent}`}
                      >
                        <Icon className="size-6" />
                      </div>
                      <h3 className="mt-6 text-xl font-bold text-[var(--ink)]">
                        {val.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                        {val.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-24 text-center">
            <div className="rounded-3xl border border-[var(--line)] bg-gradient-to-r from-[var(--surface)] to-[var(--bg)] p-10 sm:p-14">
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--ink)] sm:text-3xl">
                Biz bilan birga restoraningizni rivojlantiring
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--muted)]">
                14 kunlik bepul sinov davrida barcha imkoniyatlarni o&apos;z restoraningizda sinab ko&apos;ring.
              </p>
              <div className="mt-6">
                <Link href="/contact">
                  <Button size="lg" className="h-12 px-8 font-bold">
                    {m.contactUs} &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
