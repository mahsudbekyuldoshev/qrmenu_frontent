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

const roles: { value: StaffRole; label: string; hint: string }[] = [
  { value: "director", label: "Direktor", hint: "Analytics" },
  { value: "waiter", label: "Ofitsiant", hint: "Stol oqimi" },
  { value: "kitchen", label: "Oshxona", hint: "KDS" },
];

export function RegisterForm() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [restaurantName, setRestaurantName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<StaffRole>("director");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!restaurantName.trim()) next.restaurantName = "Restoran nomini kiriting";
    if (!fullName.trim()) next.fullName = "Ism-familiyani kiriting";
    if (!email.trim()) next.email = "Emailni kiriting";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Email formati noto‘g‘ri";
    }
    if (password.length < 6) next.password = "Kamida 6 ta belgi";
    if (password !== confirmPassword) {
      next.confirmPassword = "Parollar mos kelmadi";
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
      const auth = await api.register({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        restaurantName: restaurantName.trim(),
        role,
      });
      setSession(auth);
      router.push(roleHomePath(auth.user.role));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ro‘yxatdan o‘tish amalga oshmadi",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <Input
        label="Restoran nomi"
        name="restaurantName"
        autoComplete="organization"
        placeholder="Masalan: Sofiya Cafe"
        value={restaurantName}
        onChange={(e) => setRestaurantName(e.target.value)}
        error={fieldErrors.restaurantName}
        required
      />

      <Input
        label="Ism familiya"
        name="fullName"
        autoComplete="name"
        placeholder="Aziza Karimova"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        error={fieldErrors.fullName}
        required
      />

      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErrors.email}
        required
      />

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-[var(--ink)]">Rol</legend>
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
                {item.label}
              </span>
              <span className="mt-0.5 hidden text-[10px] text-[var(--muted)] sm:block">
                {item.hint}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <Input
        label="Parol"
        name="password"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="Kamida 6 ta belgi"
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
        label="Parolni tasdiqlang"
        name="confirmPassword"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="Parolni qayta yozing"
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
            Yaratilmoqda…
          </>
        ) : (
          "Hisob yaratish"
        )}
      </Button>
    </form>
  );
}

export function RegisterFooter() {
  return (
    <>
      Allaqachon hisobingiz bormi?{" "}
      <Link
        href="/login"
        className="font-medium text-[var(--accent-bright)] underline-offset-2 hover:underline"
      >
        Kirish
      </Link>
    </>
  );
}
