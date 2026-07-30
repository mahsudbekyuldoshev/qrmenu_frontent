"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translations } from "@/lib/translations";

export type Theme = "light" | "dark";
export type Language = "uz" | "ru" | "en";

type PreferencesContextValue = {
  theme: Theme;
  setTheme: (next: Theme) => void;
  language: Language;
  setLanguage: (next: Language) => void;
  menuBgImage: string;
  setMenuBgImage: (next: string) => void;
  t: typeof translations.uz;
};

const PreferencesContext = createContext<
  PreferencesContextValue | undefined
>(undefined);

const THEME_KEY = "restoflow-theme";
const LANG_KEY = "restoflow-lang";
const BG_KEY = "restoflow-bg";

function detectSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
    ? "dark"
    : "light";
}

function safeLoadTheme(raw: string | null): Theme | null {
  if (raw === "light" || raw === "dark") return raw;
  return null;
}

function safeLoadLanguage(raw: string | null): Language | null {
  if (raw === "uz" || raw === "ru" || raw === "en") return raw;
  return null;
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguage] = useState<Language>("uz");
  const [menuBgImage, setMenuBgImage] = useState<string>("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80");

  useEffect(() => {
    const nextTheme =
      safeLoadTheme(localStorage.getItem(THEME_KEY)) ?? detectSystemTheme();
    const nextLang =
      safeLoadLanguage(localStorage.getItem(LANG_KEY)) ?? "uz";
    const nextBg = localStorage.getItem(BG_KEY) ?? "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80";

    setTheme(nextTheme);
    setLanguage(nextLang);
    setMenuBgImage(nextBg);

    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.lang = nextLang;
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem(BG_KEY, menuBgImage);
  }, [menuBgImage]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      language,
      setLanguage,
      menuBgImage,
      setMenuBgImage,
      t: translations[language],
    }),
    [theme, language, menuBgImage],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used inside PreferencesProvider");
  }
  return ctx;
}

