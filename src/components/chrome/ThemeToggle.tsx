"use client";

import { Moon, Sun } from "lucide-react";
import { usePreferences } from "@/providers/PreferencesProvider";

export function ThemeToggle() {
  const { theme, setTheme } = usePreferences();

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
      className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)]/60 px-3 py-2 text-[var(--ink)] shadow-[0_10px_30px_-18px_rgba(0,0,0,0.25)] transition hover:bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-bright)]/30"
    >
      {theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
      <span className="hidden text-sm font-medium sm:inline">
        {theme === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
}

