"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, MessageSquare, Search } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Button } from "@/components/ui/Button";
import { usePreferences } from "@/providers/PreferencesProvider";

export default function FaqPage() {
  const { t } = usePreferences();
  const m = t.marketing;
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  const faqs = m.faqs || [];

  const filteredFaqs = useMemo(() => {
    if (!search.trim()) return faqs;
    const query = search.toLowerCase();
    return faqs.filter(
      (f) =>
        f.q.toLowerCase().includes(query) || f.a.toLowerCase().includes(query),
    );
  }, [faqs, search]);

  function toggleAccordion(idx: number) {
    setOpenIndex(openIndex === idx ? null : idx);
  }

  return (
    <MarketingLayout>
      <div className="relative overflow-hidden py-16 sm:py-24">
        {/* Ambient Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-10 -z-10 size-96 rounded-full bg-[var(--accent)]/10 blur-[100px]"
        />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
              {m.navFaq}
            </span>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-[var(--ink)] sm:text-5xl">
              {m.faqTitle}
            </h1>
          </div>

          {/* Search bar */}
          <div className="mt-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[var(--muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={m.faqSearchPlaceholder}
                className="h-14 w-full rounded-2xl border-2 border-[var(--line)] bg-[var(--surface)] pl-12 pr-4 text-sm font-medium text-[var(--ink)] outline-none transition focus:border-[var(--accent)] placeholder:text-[var(--muted)]"
              />
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="mt-10 space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[var(--line)] p-12 text-center text-sm text-[var(--muted)]">
                <HelpCircle className="mx-auto size-8 text-[var(--muted)] mb-2 opacity-50" />
                <p>{m.faqNoResults}</p>
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={faq.q}
                    className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]/80 transition hover:border-[var(--accent)]/30"
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(idx)}
                      className="flex w-full items-center justify-between p-6 text-left"
                    >
                      <span className="text-base sm:text-lg font-bold text-[var(--ink)] pr-4">
                        {faq.q}
                      </span>
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-xl bg-[var(--bg)] transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[var(--accent)]" : "text-[var(--muted)]"
                        }`}
                      >
                        <ChevronDown className="size-4" />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="border-t border-[var(--line)]/60 bg-[var(--bg)]/50 px-6 py-5 text-sm sm:text-base leading-relaxed text-[var(--muted)] animate-in fade-in duration-200">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* CTA Box */}
          <div className="mt-16 rounded-3xl border border-[var(--line)] bg-gradient-to-r from-[var(--surface)] to-[var(--bg)] p-8 sm:p-10 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)]">
              <MessageSquare className="size-6" />
            </div>
            <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--ink)]">
              {m.faqCtaTitle}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
              {m.faqCtaDesc}
            </p>
            <div className="mt-6">
              <Link href="/contact">
                <Button className="h-12 px-6 font-bold">
                  {m.faqCtaBtn} &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
