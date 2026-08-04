"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { authService } from "@/lib/services/auth.service";
import { roleHomePath, useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { usePreferences } from "@/providers/PreferencesProvider";

const demoAccounts = [
  { label: "Direktor", phone: "901234567" },
  { label: "Oshxona", phone: "907654321" },
  { label: "Ofitsiant", phone: "900001122" },
  { label: "Manager", phone: "901112233" },
  { label: "Super Admin", phone: "909998877" },
];

export function LoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const { t } = usePreferences();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Phone masking: 90 065 60 09
  function formatPhone(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 9);
    let res = "";
    if (digits.length > 0) res += digits.slice(0, 2);
    if (digits.length > 2) res += " " + digits.slice(2, 5);
    if (digits.length > 5) res += " " + digits.slice(5, 7);
    if (digits.length > 7) res += " " + digits.slice(7, 9);
    return res;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanPhone = phone.replace(/\s/g, "");
    if (cleanPhone.length < 9 || !password) {
      setError(t.loginSubtitle);
      return;
    }

    setLoading(true);
    try {
      const auth = await authService.login({
        phone: cleanPhone,
        email: cleanPhone + "@restoflow.uz",
        password,
      } as any);
      setSession(auth.data);
      router.push(roleHomePath(auth.data.user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : t.login);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[var(--ink)]">
          {t.phone}
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-sm font-medium text-[var(--muted)]">
            +998
          </span>
          <input
            type="tel"
            className="flex h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] pl-14 pr-4 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent-bright)]/50 focus:ring-4 focus:ring-[var(--accent-bright)]/10"
            placeholder="90 000 00 00"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            required
          />
        </div>
      </div>

      <Input
        label={t.password}
        name="password"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        trailing={
          <button
            type="button"
            className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        }
      />

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-sm text-red-500 dark:text-red-400"
        >
          {error === "Email yoki parol noto‘g‘ri" ? "Telefon raqam yoki parol noto‘g‘ri" : error}
        </div>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t.loggingIn}
          </>
        ) : (
          t.login
        )}
      </Button>

      {/* Demo account quick fill */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3">
        <p className="mb-2 text-xs font-medium text-[var(--muted)]">
          Demo (pass: demo1234)
        </p>
        <div className="flex flex-wrap gap-2">
          {demoAccounts.map((acc) => (
            <button
              key={acc.phone}
              type="button"
              className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--ink)] transition hover:border-[var(--accent)]/40 hover:bg-[var(--surface-2)]"
              onClick={() => {
                setPhone(formatPhone(acc.phone));
                setPassword("demo1234");
              }}
            >
              {acc.label}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}

export function LoginFooter() {
  const { t } = usePreferences();
  return (
    <>
      {t.noAccount}{" "}
      <Link
        href="/register"
        className="font-medium text-[var(--accent-bright)] underline-offset-2 hover:underline"
      >
        {t.register}
      </Link>
    </>
  );
}
