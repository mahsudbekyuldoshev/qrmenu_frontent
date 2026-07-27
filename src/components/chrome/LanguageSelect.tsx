"use client";

import { usePreferences, type Language } from "@/providers/PreferencesProvider";

const options: { value: Language; label: string }[] = [
  { value: "uz", label: "UZ" },
  { value: "ru", label: "RU" },
  { value: "en", label: "EN" },
];

export function LanguageSelect() {
  const { language, setLanguage } = usePreferences();

  return (
    <label className="inline-flex items-center gap-2">
      <span className="sr-only">Language</span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="h-10 rounded-xl border border-[var(--line)] bg-[var(--surface)]/60 px-3 text-sm text-[var(--ink)] outline-none transition focus:ring-2 focus:ring-[var(--accent-bright)]/30"
        aria-label="Language"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

