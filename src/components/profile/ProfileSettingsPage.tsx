"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Building2,
  KeyRound,
  Loader2,
  LogOut,
  Shield,
  User as UserIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "@/lib/services/auth.service";
import { dashboardService } from "@/lib/services/dashboard.service";
import { roleHomePath, useAuthStore } from "@/store/auth-store";
import { usePreferences } from "@/providers/PreferencesProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { LanguageSelect } from "@/components/chrome/LanguageSelect";
import type { User } from "@/lib/types";

type ProfileTab = "profile" | "security" | "restaurant";

function initials(user: User | null) {
  const a = (user?.first_name?.[0] || user?.phone?.[0] || "U").toUpperCase();
  const b = (user?.last_name?.[0] || "").toUpperCase();
  return `${a}${b}`;
}

function displayName(user: User | null) {
  if (!user) return "";
  const full = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return full || user.phone || "User";
}

export function ProfileSettingsPage() {
  const router = useRouter();
  const { t } = usePreferences();
  const { user, accessToken, setSession, logout } = useAuthStore();
  const [tab, setTab] = useState<ProfileTab>("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [restaurant, setRestaurant] = useState<{
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
  } | null>(null);

  const home = useMemo(
    () => (user ? roleHomePath(user.role) : "/login"),
    [user],
  );

  const showRestaurant =
    user?.role === "director" ||
    user?.role === "manager" ||
    user?.role === "waiter" ||
    user?.role === "chef" ||
    user?.role === "kitchen";

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await authService.me();
        if (cancelled) return;
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setEmail((data as { email?: string }).email || "");
        if (accessToken) {
          setSession({
            access: accessToken,
            refresh: useAuthStore.getState().refreshToken || "",
            user: data as User,
          });
        }
        if (showRestaurant) {
          try {
            const r = await dashboardService.getMyRestaurant();
            if (!cancelled) setRestaurant(r.data as typeof restaurant);
          } catch {
            /* restoran yo'q bo'lishi mumkin */
          }
        }
      } catch {
        toast.error(t.profileLoadError || "Profil yuklanmadi");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken, router, setSession, showRestaurant, t.profileLoadError]);

  async function onSaveProfile(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authService.updateProfile({
        first_name: firstName,
        last_name: lastName,
        email: email || undefined,
      });
      const token = useAuthStore.getState().accessToken;
      const refresh = useAuthStore.getState().refreshToken;
      if (token && refresh) {
        setSession({ access: token, refresh, user: data as User });
      }
      toast.success(t.profileUpdated || "Profil yangilandi");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ||
        t.profileUpdateError ||
        "Saqlashda xatolik";
      toast.error(String(msg));
    } finally {
      setSaving(false);
    }
  }

  async function onChangePassword(e: FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error(t.passwordHintMin || "Kamida 8 ta belgi");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t.passwordMismatch || "Parollar mos emas");
      return;
    }
    setPwdSaving(true);
    try {
      await authService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success(t.passwordChanged || "Parol o'zgartirildi");
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, unknown> } })
        ?.response?.data;
      const msg =
        (typeof data?.detail === "string" && data.detail) ||
        (Array.isArray(data?.old_password) && String(data.old_password[0])) ||
        (Array.isArray(data?.new_password) && String(data.new_password[0])) ||
        t.passwordChangeError ||
        "Parolni o'zgartirishda xatolik";
      toast.error(String(msg));
    } finally {
      setPwdSaving(false);
    }
  }

  function doLogout() {
    logout();
    router.push("/login");
  }

  const navBtn = (id: ProfileTab, label: string, Icon: typeof UserIcon) => (
    <button
      key={id}
      type="button"
      onClick={() => setTab(id)}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
        tab === id
          ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/20"
          : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
      }`}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--bg)]">
        <Loader2 className="size-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 lg:flex-row lg:py-10">
        {/* Left panel */}
        <aside className="w-full shrink-0 lg:w-80">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-[var(--accent)]/15 text-lg font-bold text-[var(--accent)]">
                {initials(user)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-[var(--ink)]">
                  {displayName(user)}
                </p>
                <p className="truncate text-sm text-[var(--muted)]">
                  {user?.phone}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
                  {user?.role}
                </p>
              </div>
            </div>

            <nav className="space-y-1.5">
              {navBtn("profile", t.myProfile || "Mening profilim", UserIcon)}
              {navBtn("security", t.securityPassword || "Xavfsizlik / Parol", KeyRound)}
              {showRestaurant
                ? navBtn(
                    "restaurant",
                    t.restaurantInfo || "Restoran ma'lumotlari",
                    Building2,
                  )
                : null}
              <Link
                href={home}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
              >
                <Shield className="size-4" />
                {t.backToPanel || "Panelga qaytish"}
              </Link>
              <button
                type="button"
                onClick={doLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-500 transition hover:bg-rose-500/10"
              >
                <LogOut className="size-4" />
                {t.logout}
              </button>
            </nav>

            <div className="mt-6 flex items-center gap-2 border-t border-[var(--line)] pt-4">
              <LanguageSelect />
              <ThemeToggle />
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] md:text-3xl">
              {t.myProfile || "Mening profilim"}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {t.manageAccountSettings || "Hisob sozlamalarini boshqaring"}
            </p>
          </div>

          {tab === "profile" && (
            <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm md:p-8">
              <h2 className="mb-1 text-lg font-semibold text-[var(--ink)]">
                {t.editPersonalInfo || "Shaxsiy ma'lumotlarni tahrirlash"}
              </h2>
              <p className="mb-6 text-sm text-[var(--muted)]">
                {t.profileFormHint || "Ism, familiya va emailni yangilang"}
              </p>

              <div className="mb-6 flex items-center gap-4">
                <div className="flex size-20 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] text-xl font-bold text-[var(--ink)]">
                  {initials(user)}
                </div>
                <div>
                  <p className="font-medium text-[var(--ink)]">{displayName(user)}</p>
                  <p className="text-sm text-[var(--muted)]">{user?.phone}</p>
                </div>
              </div>

              <form onSubmit={onSaveProfile} className="grid gap-4 sm:grid-cols-2">
                <Input
                  label={t.firstName || "Ism"}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  label={t.lastName || "Familiya"}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <div className="sm:col-span-2">
                  <Input
                    label={t.email || "Email"}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={saving} className="rounded-xl">
                    {saving ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        {t.saving || "Saqlanmoqda..."}
                      </>
                    ) : (
                      t.updateProfile || "Profilni yangilash"
                    )}
                  </Button>
                </div>
              </form>
            </section>
          )}

          {tab === "security" && (
            <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm md:p-8">
              <h2 className="mb-1 text-lg font-semibold text-[var(--ink)]">
                {t.changePassword || "Parolni o'zgartirish"}
              </h2>
              <p className="mb-6 text-sm text-[var(--muted)]">
                {t.passwordRequirements ||
                  "Kamida 8 belgi, kichik/katta harf va raqam tavsiya etiladi"}
              </p>
              <form onSubmit={onChangePassword} className="mx-auto max-w-md space-y-4">
                <Input
                  label={t.currentPassword || "Joriy parol"}
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <Input
                  label={t.newPassword || "Yangi parol"}
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  hint={t.passwordHintMin || "Kamida 8 ta belgi"}
                />
                <Input
                  label={t.confirmPassword}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button type="submit" disabled={pwdSaving} className="w-full rounded-xl">
                  {pwdSaving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {t.saving || "Saqlanmoqda..."}
                    </>
                  ) : (
                    t.changePassword || "Parolni o'zgartirish"
                  )}
                </Button>
              </form>
            </section>
          )}

          {tab === "restaurant" && (
            <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm md:p-8">
              <h2 className="mb-1 text-lg font-semibold text-[var(--ink)]">
                {t.restaurantInfo || "Restoran ma'lumotlari"}
              </h2>
              <p className="mb-6 text-sm text-[var(--muted)]">
                {t.restaurantInfoHint || "Siz biriktirilgan restoran"}
              </p>
              {restaurant ? (
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)]/50 p-4">
                    <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                      {t.restaurantName}
                    </dt>
                    <dd className="mt-1 font-semibold text-[var(--ink)]">
                      {restaurant.name}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)]/50 p-4">
                    <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                      Slug
                    </dt>
                    <dd className="mt-1 font-mono text-sm text-[var(--ink)]">
                      {restaurant.slug}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)]/50 p-4">
                    <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                      {t.status}
                    </dt>
                    <dd className="mt-1 font-semibold text-[var(--ink)]">
                      {restaurant.is_active ? t.active : t.inactive}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)]/50 p-4">
                    <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                      ID
                    </dt>
                    <dd className="mt-1 font-semibold text-[var(--ink)]">
                      #{restaurant.id}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="text-sm text-[var(--muted)]">
                  {t.noRestaurantLinked || "Restoran biriktirilmagan"}
                </p>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
