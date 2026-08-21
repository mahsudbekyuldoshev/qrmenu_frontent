"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  ChefHat,
  ChevronDown,
  LayoutDashboard,
  Menu,
  QrCode,
  UtensilsCrossed,
  Users,
  X,
  ArrowRight,
  Flame,
} from "lucide-react";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { LanguageSelect } from "@/components/chrome/LanguageSelect";
import { usePreferences } from "@/providers/PreferencesProvider";
import { Button } from "@/components/ui/Button";

export function MarketingNavbar() {
  const pathname = usePathname();
  const { t } = usePreferences();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [panelsOpen, setPanelsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const m = t.marketing;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPanelsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setPanelsOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: m.navHome },
    { href: "/pricing", label: m.navPricing },
    { href: "/about", label: m.navAbout },
    { href: "/faq", label: m.navFaq },
    { href: "/contact", label: m.navContact },
  ];

  const panels = [
    {
      name: m.panelDirectorTitle,
      desc: m.panelDirectorDesc,
      href: "/login?role=director",
      icon: LayoutDashboard,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      name: m.panelManagerTitle,
      desc: m.panelManagerDesc,
      href: "/login?role=manager",
      icon: Users,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      name: m.panelKdsTitle,
      desc: m.panelKdsDesc,
      href: "/login?role=kitchen",
      icon: ChefHat,
      color: "text-rose-500 bg-rose-500/10",
    },
    {
      name: m.panelWaiterTitle,
      desc: m.panelWaiterDesc,
      href: "/login?role=waiter",
      icon: UtensilsCrossed,
      color: "text-teal-500 bg-teal-500/10",
    },
    {
      name: m.panelQrTitle,
      desc: m.panelQrDesc,
      href: "/menu/1",
      icon: QrCode,
      color: "text-amber-500 bg-amber-500/10",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--line)]/60 bg-[var(--bg)]/85 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--accent-fg)] shadow-md shadow-[var(--accent)]/20 transition group-hover:scale-105">
            <Flame className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-[var(--ink)]">
              Resto<span className="text-[var(--accent)]">Flow</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              Restaurant SaaS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[var(--surface-2)] text-[var(--accent)]"
                    : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Panellar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setPanelsOpen(!panelsOpen)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                panelsOpen
                  ? "bg-[var(--surface-2)] text-[var(--ink)]"
                  : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)]"
              }`}
            >
              <span>{m.navPanels}</span>
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${
                  panelsOpen ? "rotate-180 text-[var(--accent)]" : ""
                }`}
              />
            </button>

            {panelsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 origin-top-right rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2 shadow-2xl shadow-black/10 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  {m.navPanels}
                </div>
                <div className="space-y-1">
                  {panels.map((panel) => {
                    const Icon = panel.icon;
                    return (
                      <Link
                        key={panel.name}
                        href={panel.href}
                        onClick={() => setPanelsOpen(false)}
                        className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-[var(--surface-2)]"
                      >
                        <div
                          className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${panel.color}`}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-[var(--ink)]">
                            {panel.name}
                          </p>
                          <p className="truncate text-xs text-[var(--muted)]">
                            {panel.desc}
                          </p>
                        </div>
                        <ArrowRight className="size-3.5 text-[var(--muted)] opacity-50" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right side actions: Lang, Theme, Login, Demo CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <LanguageSelect />
          <ThemeToggle />

          <Link
            href="/login"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-2)]"
          >
            {m.heroCtaPrimary}
          </Link>

          <Link href="/contact">
            <Button size="sm" className="shadow-md shadow-[var(--accent)]/20">
              {m.requestDemo}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <LanguageSelect />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="grid size-10 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition"
            aria-label="Menyu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="border-b border-[var(--line)] bg-[var(--bg)] px-5 pb-6 pt-3 md:hidden animate-in slide-in-from-top-3 duration-200">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-xl px-4 py-2.5 text-base font-semibold transition ${
                    isActive
                      ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                      : "text-[var(--ink)] hover:bg-[var(--surface)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Panels list in mobile */}
          <div className="mt-4 border-t border-[var(--line)] pt-4">
            <p className="px-4 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {m.navPanels}
            </p>
            <div className="mt-2 grid grid-cols-1 gap-1">
              {panels.map((panel) => {
                const Icon = panel.icon;
                return (
                  <Link
                    key={panel.name}
                    href={panel.href}
                    className="flex items-center gap-3 rounded-xl p-2.5 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface)]"
                  >
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${panel.color}`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="font-bold">{panel.name}</p>
                      <p className="text-xs text-[var(--muted)]">{panel.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile CTA buttons */}
          <div className="mt-6 flex flex-col gap-2">
            <Link href="/login" className="w-full">
              <Button variant="secondary" className="w-full h-12 rounded-xl font-bold">
                {m.heroCtaPrimary}
              </Button>
            </Link>
            <Link href="/contact" className="w-full">
              <Button className="w-full h-12 rounded-xl font-bold">
                {m.requestDemo} &rarr;
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
