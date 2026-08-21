"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { usePreferences } from "@/providers/PreferencesProvider";

export function RegisterForm() {
  const { t } = usePreferences();

  // Backend da ochiq ro'yxatdan o'tish olib tashlangan.
  // Hisoblar faqat director/super-admin tomonidan yaratiladi.
  return (
    <div className="space-y-6">
      <div className="flex gap-3 rounded-2xl border border-amber-300/40 bg-amber-50 dark:bg-amber-900/20 p-5">
        <Info className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800 dark:text-amber-300 space-y-2">
          <p className="font-semibold">Mustaqil ro&apos;yxatdan o&apos;tish mavjud emas</p>
          <p>
            RestoFlow tizimida hisoblar faqat <strong>super admin</strong> yoki{" "}
            <strong>direktor</strong> tomonidan yaratiladi. Agar hisobingiz bo&apos;lsa, login
            sahifasiga o&apos;ting.
          </p>
        </div>
      </div>
      <Link href="/login">
        <Button className="w-full h-12 rounded-2xl font-bold">
          {t.login} &rarr;
        </Button>
      </Link>
    </div>
  );
}

export function RegisterFooter() {
  const { t } = usePreferences();
  return (
    <>
      {t.haveAccount}{" "}
      <Link
        href="/login"
        className="font-medium text-[var(--accent-bright)] underline-offset-2 hover:underline"
      >
        {t.login}
      </Link>
    </>
  );
}
