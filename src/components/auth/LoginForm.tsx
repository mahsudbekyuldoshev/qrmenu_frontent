"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { roleHomePath, useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function LoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Email va parolni kiriting");
      return;
    }

    setLoading(true);
    try {
      const auth = await api.login({
        email: email.trim(),
        password,
      });
      setSession(auth);
      router.push(roleHomePath(auth.user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kirish amalga oshmadi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="director@restoflow.uz"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        label="Parol"
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
            className="rounded-lg p-2 text-white/45 transition hover:bg-white/10 hover:text-white"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Parolni yashirish" : "Parolni ko‘rsatish"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        }
      />

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-sm text-red-200"
        >
          {error}
        </div>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Kirilmoqda…
          </>
        ) : (
          "Kirish"
        )}
      </Button>

      <p className="text-center text-xs leading-relaxed text-white/40">
        Demo:{" "}
        <button
          type="button"
          className="text-[var(--accent-bright)]/90 underline-offset-2 hover:underline"
          onClick={() => {
            setEmail("director@restoflow.uz");
            setPassword("demo1234");
          }}
        >
          director@restoflow.uz
        </button>{" "}
        / demo1234
      </p>
    </form>
  );
}

export function LoginFooter() {
  return (
    <>
      Hisobingiz yo‘qmi?{" "}
      <Link
        href="/register"
        className="font-medium text-[var(--accent-bright)] underline-offset-2 hover:underline"
      >
        Ro‘yxatdan o‘tish
      </Link>
    </>
  );
}
