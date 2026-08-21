"use client";

import Link from "next/link";
import { Check, HelpCircle, ShieldCheck, Sparkles } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Button } from "@/components/ui/Button";
import { usePreferences } from "@/providers/PreferencesProvider";

export default function PricingPage() {
  const { t } = usePreferences();
  const m = t.marketing;

  const plans = [
    {
      title: m.planStandardTitle,
      price: m.planStandardPrice,
      period: m.planStandardPeriod,
      forWho: m.planStandardFor,
      features: m.planStandardFeatures,
      popular: false,
      btnLabel: m.startBtn,
      btnHref: "/contact?plan=standard",
      btnVariant: "secondary" as const,
    },
    {
      title: m.planPremiumTitle,
      price: m.planPremiumPrice,
      period: m.planPremiumPeriod,
      forWho: m.planPremiumFor,
      features: m.planPremiumFeatures,
      popular: true,
      btnLabel: m.startBtn,
      btnHref: "/contact?plan=premium",
      btnVariant: "primary" as const,
    },
    {
      title: m.planEnterpriseTitle,
      price: m.planEnterprisePrice,
      period: m.planEnterprisePeriod,
      forWho: m.planEnterpriseFor,
      features: m.planEnterpriseFeatures,
      popular: false,
      btnLabel: m.contactBtn,
      btnHref: "/contact?plan=chain",
      btnVariant: "secondary" as const,
    },
  ];

  return (
    <MarketingLayout>
      <div className="relative overflow-hidden py-16 sm:py-24">
        {/* Ambient Glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-10 -z-10 size-96 rounded-full bg-[var(--accent)]/10 blur-[100px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-32 -z-10 size-96 rounded-full bg-amber-500/10 blur-[100px]"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
              {m.navPricing}
            </span>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-[var(--ink)] sm:text-5xl">
              {m.pricingTitle}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[var(--muted)] leading-relaxed">
              {m.pricingDesc}
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.title}
                className={`relative flex flex-col justify-between rounded-[2.5rem] border p-8 transition duration-300 sm:p-10 ${
                  plan.popular
                    ? "border-[var(--accent)] bg-[var(--surface)] shadow-2xl shadow-[var(--accent)]/10 scale-105 z-10"
                    : "border-[var(--line)] bg-[var(--bg)] hover:border-[var(--accent)]/30 hover:bg-[var(--surface)]"
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent)] px-4 py-1 text-xs font-black uppercase tracking-wider text-[var(--accent-fg)] shadow-md">
                    {m.popularBadge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--ink)]">
                      {plan.title}
                    </h2>
                    {plan.popular && (
                      <Sparkles className="size-5 text-[var(--accent)]" />
                    )}
                  </div>

                  <p className="mt-2 text-xs text-[var(--muted)] min-h-[2rem]">
                    {plan.forWho}
                  </p>

                  {/* Price */}
                  <div className="mt-6 flex items-baseline gap-1 border-b border-[var(--line)] pb-6">
                    <span className="font-[family-name:var(--font-display)] text-4xl font-black text-[var(--ink)]">
                      {plan.price}
                    </span>
                    <span className="text-xs font-semibold text-[var(--muted)]">
                      {plan.period}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="mt-6 space-y-3.5 text-sm">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-[var(--ink)]">
                        <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          <Check className="size-3 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="mt-10">
                  <Link href={plan.btnHref} className="w-full block">
                    <Button
                      variant={plan.popular ? "primary" : "secondary"}
                      className={`w-full h-14 rounded-2xl text-base font-bold ${
                        plan.popular ? "shadow-lg shadow-[var(--accent)]/30" : ""
                      }`}
                    >
                      {plan.btnLabel} &rarr;
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Trial note badge */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="size-5 shrink-0" />
              <span>{m.trialNote}</span>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
