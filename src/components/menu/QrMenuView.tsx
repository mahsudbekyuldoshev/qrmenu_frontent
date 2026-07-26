"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { Category, MenuItem } from "@/lib/types";
import { useCartStore } from "@/store/cart-store";
import { CategoryTabs } from "./CategoryTabs";
import { MenuItemCard } from "./MenuItemCard";
import { CartDrawer } from "./CartDrawer";
import { RESTAURANT_NAME } from "@/lib/mock-data";

export function QrMenuView({ tableNumber }: { tableNumber: number }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");
  const [loading, setLoading] = useState(true);
  const setTable = useCartStore((s) => s.setTable);

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
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--bg)]/90 px-4 py-3 backdrop-blur-md">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[var(--accent)]">
              Stol #{tableNumber}
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl leading-none tracking-tight text-[var(--ink)]">
              {RESTAURANT_NAME}
            </h1>
          </div>
          <p className="max-w-[8rem] text-right text-xs leading-snug text-[var(--muted)]">
            QR menyu · buyurtmani stolingizdan bering
          </p>
        </div>
      </header>

      <div className="px-4">
        <CategoryTabs
          categories={categories}
          activeId={activeCategory}
          onChange={setActiveCategory}
        />

        {loading ? (
          <div className="space-y-4 py-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl bg-[var(--surface)]"
              />
            ))}
          </div>
        ) : (
          <div className="animate-fade-up">
            {filtered.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <CartDrawer tableNumber={tableNumber} />
    </div>
  );
}
