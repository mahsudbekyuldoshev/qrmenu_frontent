"use client";

import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, List, Moon, Sun } from "lucide-react";
import { api } from "@/lib/api";
import type { Category, MenuItem } from "@/lib/types";
import { useCartStore } from "@/store/cart-store";
import { usePreferences } from "@/providers/PreferencesProvider";
import { CategoryTabs } from "./CategoryTabs";
import { MenuItemCard } from "./MenuItemCard";
import { CartDrawer } from "./CartDrawer";
import { RESTAURANT_NAME } from "@/lib/mock-data";

export function QrMenuView({ tableNumber }: { tableNumber: number }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");
  const [loading, setLoading] = useState(true);
  const [gridMode, setGridMode] = useState<"list" | "grid">("list");
  const setTable = useCartStore((s) => s.setTable);
  const { theme, setTheme } = usePreferences();

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => setTable(tableNumber));

    async function fetchMenu() {
      try {
        const [cats, menu] = await Promise.all([
          api.getCategories(),
          api.getMenu(tableNumber),
        ]);
        if (cancelled) return;
        setCategories(cats);
        setItems(menu);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchMenu();
    return () => {
      cancelled = true;
    };
  }, [tableNumber, setTable]);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((i) => i.categoryId === activeCategory);
  }, [items, activeCategory]);

  return (
    <div className="menu-shell mx-auto min-h-dvh max-w-lg pb-28">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--bg)]/90 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[var(--accent)]">
              Stol #{tableNumber}
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-2xl leading-none tracking-tight text-[var(--ink)]">
              {RESTAURANT_NAME}
            </h1>
          </div>

          {/* Controls: layout toggle + theme toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Grid/List toggle */}
            <div className="flex items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] p-1">
              <button
                type="button"
                aria-label="List view"
                onClick={() => setGridMode("list")}
                className={`grid size-7 place-items-center rounded-lg transition ${
                  gridMode === "list"
                    ? "bg-[var(--ink)] text-[var(--bg)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                <List className="size-3.5" />
              </button>
              <button
                type="button"
                aria-label="Grid view"
                onClick={() => setGridMode("grid")}
                className={`grid size-7 place-items-center rounded-lg transition ${
                  gridMode === "grid"
                    ? "bg-[var(--ink)] text-[var(--bg)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                <LayoutGrid className="size-3.5" />
              </button>
            </div>

            {/* Theme toggle */}
            <button
              type="button"
              aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="grid size-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition hover:bg-[var(--surface-2)]"
            >
              {theme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="px-4">
        <CategoryTabs
          categories={categories}
          activeId={activeCategory}
          onChange={setActiveCategory}
        />

        {loading ? (
          <div
            className={
              gridMode === "grid"
                ? "grid grid-cols-2 gap-3 py-6"
                : "space-y-4 py-6"
            }
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`animate-pulse rounded-2xl bg-[var(--surface)] ${
                  gridMode === "grid" ? "aspect-[3/4]" : "h-28"
                }`}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--muted)]">
            <p className="text-center text-sm">Bu kategoriyada taom yo&apos;q</p>
          </div>
        ) : (
          <div
            className={`animate-fade-up ${
              gridMode === "grid"
                ? "grid grid-cols-2 gap-3 py-4"
                : "divide-y divide-[var(--line)]"
            }`}
          >
            {filtered.map((item) => (
              <MenuItemCard key={item.id} item={item} layout={gridMode} />
            ))}
          </div>
        )}
      </div>

      <CartDrawer tableNumber={tableNumber} />
    </div>
  );
}
