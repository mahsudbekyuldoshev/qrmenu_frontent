"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, Send, ShieldCheck } from "lucide-react";
import { usePreferences } from "@/providers/PreferencesProvider";

export function MarketingFooter() {
  const { t } = usePreferences();
  const m = t.marketing;

  const quickLinks = [
    { href: "/", label: m.navHome },
    { href: "/pricing", label: m.navPricing },
    { href: "/about", label: m.navAbout },
    { href: "/faq", label: m.navFaq },
    { href: "/contact", label: m.navContact },
  ];

  const solutions = [
    { href: "/login?role=director", label: t.directorPanel || "Direktor paneli" },
    { href: "/login?role=kitchen", label: t.kdsPanel || "Oshxona ekrani (KDS)" },
    { href: "/login?role=waiter", label: t.waiterPanel || "Ofitsiant stansiyasi" },
    { href: "/login?role=manager", label: t.managerPanel || "Manager paneli" },
    { href: "/menu/1", label: "Interaktiv QR-menyu" },
  ];

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <img src="/logo.svg" alt="RestoFlow" className="h-10 w-auto transition group-hover:scale-105" />
              {/* Logo handled by SVG */}
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--muted)]">
              {m.footerTagline}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-3.5" />
                100% Bulutli & Xavfsiz
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {m.footerQuickLinks}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm font-medium">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--muted)] transition hover:text-[var(--accent)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {m.footerSolutions}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm font-medium">
              {solutions.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[var(--muted)] transition hover:text-[var(--accent)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {m.footerContact}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <li className="flex items-center gap-2.5">
                <Send className="size-4 shrink-0 text-[var(--accent)]" />
                <a
                  href="https://t.me/restoflow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--accent)]"
                >
                  t.me/restoflow
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-[var(--accent)]" />
                <a href="tel:+998901234567" className="hover:text-[var(--accent)]">
                  +998 90 123 45 67
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-[var(--accent)]" />
                <a
                  href="mailto:info@restoflow.uz"
                  className="hover:text-[var(--accent)]"
                >
                  info@restoflow.uz
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="size-4 shrink-0 text-[var(--accent)] mt-0.5" />
                <span>{m.contactLocationValue}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--line)]/60 pt-8 sm:flex-row text-xs text-[var(--muted)]">
          <p>{m.footerCopyright}</p>
          <div className="flex gap-6 font-medium">
            <Link href="/pricing" className="hover:text-[var(--ink)]">
              {m.navPricing}
            </Link>
            <Link href="/about" className="hover:text-[var(--ink)]">
              {m.navAbout}
            </Link>
            <Link href="/faq" className="hover:text-[var(--ink)]">
              {m.navFaq}
            </Link>
            <Link href="/contact" className="hover:text-[var(--ink)]">
              {m.navContact}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
