"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import type { StaffRole } from "@/lib/types";
import { cn } from "@/lib/utils";
import { roleHomePath, useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { usePreferences } from "@/providers/PreferencesProvider";

const roles: { value: StaffRole; label: string; hint: string }[] = [
  { value: "waiter", label: "Ofitsiant", hint: "Stol oqimi" },
  { value: "kitchen", label: "Oshxona", hint: "KDS" },
  { value: "manager", label: "Manager", hint: "Boshqaruv" },
  { value: "super-admin", label: "Super Admin", hint: "Platforma" },
];

export function RegisterForm() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const { t } = usePreferences();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<StaffRole>("waiter");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = t.fullName;
    const cleanPhone = phone.replace(/\s/g, "");
    if (cleanPhone.length < 9) next.phone = t.phone;
    if (password.length < 6) next.password = "Min 6 chars";
    if (password !== confirmPassword) {
      next.confirmPassword = t.confirmPassword;
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\s/g, "");
      const auth = await api.register({
        email: cleanPhone + "@restoflow.uz",
        password,
        fullName: fullName.trim(),
        restaurantName: "My Restaurant", // Defaulting since it was removed from UI
        role,
      });
      setSession(auth);
      router.push(roleHomePath(auth.user.role));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t.register,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <Input
        label={t.fullName}
        name="fullName"
        autoComplete="name"
        placeholder="Aziza Karimova"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        error={fieldErrors.fullName}
        required
      />

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
            className={cn(
              "flex h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] pl-14 pr-4 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent-bright)]/50 focus:ring-4 focus:ring-[var(--accent-bright)]/10",
              fieldErrors.phone && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10"
            )}
            placeholder="90 000 00 00"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            required
          />
        </div>
        {fieldErrors.phone && (
          <p className="text-xs text-red-500">{fieldErrors.phone}</p>
        )}
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-[var(--ink)]">{t.role}</legend>
        <div className="grid grid-cols-3 gap-2">
          {roles.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setRole(item.value)}
              className={cn(
                "rounded-xl border px-2 py-2.5 text-left transition",
                role === item.value
                  ? "border-[var(--accent)]/50 bg-[var(--accent)]/15 text-[var(--ink)]"
                  : "border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--accent)]/30 hover:bg-[var(--surface-2)]",
              )}
            >
              <span className="block text-xs font-semibold sm:text-sm text-[var(--ink)]">
                {item.value === 'kitchen' ? t.kitchen : item.value === 'waiter' ? t.waiter : item.label}
              </span>
              <span className="mt-0.5 hidden text-[10px] text-[var(--muted)] sm:block">
                {item.hint}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <Input
        label={t.password}
        name="password"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fieldErrors.password}
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

      <Input
        label={t.confirmPassword}
        name="confirmPassword"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={fieldErrors.confirmPassword}
        required
      />

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-sm text-red-500 dark:text-red-400"
        >
          {error}
        </div>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t.creatingAccount}
          </>
        ) : (
          t.createAccount
        )}
      </Button>
    </form>
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
