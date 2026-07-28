"use client";

import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";
import { usePreferences } from "@/providers/PreferencesProvider";

export function CategoryTabs({
  categories,
  activeId,
  onChange,
}: {
  categories: Category[];
  activeId: string | "all";
  onChange: (id: string | "all") => void;
}) {
  const { t, language } = usePreferences();
  
  const getLabel = (c: Category) => {
      if (language === 'ru') return c.nameRu;
      if (language === 'en') return c.nameEn;
      return c.nameUz;
  }
  
  const tabs: { id: string | "all"; label: string }[] = [
    { id: "all", label: t.all },
    ...categories.map((c) => ({ id: c.id, label: getLabel(c) })),
  ];


  return (
    <div className="sticky top-[3.75rem] z-20 -mx-4 overflow-x-auto border-b border-[var(--line)] bg-[var(--bg)]/90 px-4 py-3 backdrop-blur-md">
      <div className="flex min-w-max gap-2">
        {tabs.map((tab) => {
          const active = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                active
                  ? "bg-[var(--ink)] text-[var(--bg)]"
                  : "bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)]",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
