"use client";

import { QrMenuView } from "@/components/menu/QrMenuView";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePreferences } from "@/providers/PreferencesProvider";

export default function DirectorMenuPage() {
  const { t } = usePreferences();
  return (
    <div className="p-4">
      <Link
        href="/director"
        className="mb-4 inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--ink)]"
      >
        <ArrowLeft className="size-4" />
        {t.goBack}
      </Link>
      <QrMenuView readOnly={true} />
    </div>
  );
}
