"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Building2, Plus, Users, LayoutDashboard, LogOut, Edit2, Trash2,
  UserCircle, ShieldCheck, CreditCard, TrendingUp, Loader2, ArrowUpRight, ArrowDownRight, XCircle,
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, Pie, PieChart, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth-store";
import { TopBar } from "@/components/chrome/TopBar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { LanguageSelect } from "@/components/chrome/LanguageSelect";
import { usePreferences } from "@/providers/PreferencesProvider";
import { formatMoney } from "@/lib/utils";
import {
  superAdminService,
  type RestaurantApi,
  type DirectorApi,
  type AdminAnalyticsApi,
} from "@/lib/services/super-admin.service";

const Map = dynamic(() => import("./MapComponent"), { ssr: false });

type Tab = "analytics" | "restaurants" | "directors";

export function SuperAdminDashboard() {
  const router = useRouter();
  const { t, language } = usePreferences();
  const [activeTab, setActiveTab] = useState<Tab>("analytics");
  const [showModal, setShowModal] = useState<"restaurant" | "director" | null>(null);
  const [editingItem, setEditingItem] = useState<RestaurantApi | DirectorApi | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Data
  const [restaurants, setRestaurants] = useState<RestaurantApi[]>([]);
  const [directors, setDirectors] = useState<DirectorApi[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalyticsApi | null>(null);

  // Restaurant modal: director selection
  const [selectedDirectorId, setSelectedDirectorId] = useState<string>("__new__");
  const [newDirName, setNewDirName] = useState("");
  const [newDirPhone, setNewDirPhone] = useState("");

  // Form refs
  const restaurantNameRef = useRef<HTMLInputElement>(null);
  const dirFirstRef = useRef<HTMLInputElement>(null);
  const dirLastRef = useRef<HTMLInputElement>(null);
  const dirPhoneRef = useRef<HTMLInputElement>(null);

  const unassignedDirectors = directors.filter((d) => !d.restaurant_id);
  const existingDir =
    selectedDirectorId === "__new__"
      ? null
      : directors.find((d) => String(d.id) === selectedDirectorId) ?? null;

  // Dastlabki yuklash
  useEffect(() => {
    setLoading(true);
    Promise.all([
      superAdminService.getDashboard(),
      superAdminService.getAnalytics(),
      superAdminService.getDirectors(),
    ])
      .then(([dashRes, analyticsRes, dirsRes]) => {
        setRestaurants(dashRes.data.restaurants);
        setDirectors(dirsRes.data);
        setAnalytics(analyticsRes.data);
      })
      .catch(() => toast.error("Ma'lumotlarni yuklashda xatolik"))
      .finally(() => setLoading(false));
  }, []);

  function handleDirectorSelect(id: string) {
    setSelectedDirectorId(id);
    const dir = directors.find((d) => String(d.id) === id);
    setNewDirName(dir ? [dir.first_name, dir.last_name].filter(Boolean).join(" ") : "");
    setNewDirPhone(dir?.phone ?? "");
  }

  function openRestaurantModal(item: RestaurantApi | null) {
    setEditingItem(item);
    setSelectedDirectorId("__new__");
    setNewDirName("");
    setNewDirPhone("");
    setSelectedLocation(null);
    setShowModal("restaurant");
  }

  async function handleSaveRestaurant() {
    const name = restaurantNameRef.current?.value?.trim();
    if (!name) return toast.error("Restoran nomi kiritilmagan");
    setSaving(true);
    try {
      if (editingItem) {
        const updated = await superAdminService.updateRestaurant(
          (editingItem as RestaurantApi).id,
          { name },
        );
        setRestaurants((prev) =>
          prev.map((r) => (r.id === updated.data.id ? updated.data : r)),
        );
      } else {
        const created = await superAdminService.createRestaurant({ name });
        let finalRestaurant = created.data;

        if (selectedDirectorId === "__new__" && newDirName.trim()) {
          const [first_name, ...rest] = newDirName.trim().split(" ");
          const newDir = await superAdminService.createDirector({
            phone: newDirPhone,
            first_name,
            last_name: rest.join(" "),
          });
          const assigned = await superAdminService.assignDirector(finalRestaurant.id, {
            director_id: newDir.data.id,
          });
          finalRestaurant = assigned.data;
          setDirectors((prev) => [newDir.data, ...prev]);
        } else if (selectedDirectorId !== "__new__") {
          const assigned = await superAdminService.assignDirector(finalRestaurant.id, {
            director_id: Number(selectedDirectorId),
          });
          finalRestaurant = assigned.data;
        }
        setRestaurants((prev) => [finalRestaurant, ...prev]);
      }
      setShowModal(null);
      toast.success(editingItem ? "Yangilandi" : "Restoran qo'shildi");
    } catch (e: any) {
      toast.error(e?.response?.data?.detail ?? "Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveDirector() {
    const first_name = dirFirstRef.current?.value?.trim() ?? "";
    const last_name = dirLastRef.current?.value?.trim() ?? "";
    const phone = dirPhoneRef.current?.value?.trim() ?? "";
    if (!phone) return toast.error("Telefon raqam kiritilmagan");
    setSaving(true);
    try {
      if (editingItem) {
        const updated = await superAdminService.updateDirector(
          (editingItem as DirectorApi).id,
          { first_name, last_name },
        );
        setDirectors((prev) =>
          prev.map((d) => (d.id === updated.data.id ? updated.data : d)),
        );
      } else {
        const created = await superAdminService.createDirector({ phone, first_name, last_name });
        setDirectors((prev) => [created.data, ...prev]);
        if (created.data.generated_password) {
          toast.success(`Vaqtinchalik parol: ${created.data.generated_password}`, {
            duration: 12000,
          });
        }
      }
      setShowModal(null);
      toast.success(editingItem ? "Yangilandi" : "Direktor qo'shildi");
    } catch (e: any) {
      toast.error(e?.response?.data?.detail ?? "Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteRestaurant(id: number) {
    if (!confirm("Restoranni o'chirishni tasdiqlaysizmi?")) return;
    try {
      await superAdminService.deleteRestaurant(id);
      setRestaurants((prev) => prev.filter((r) => r.id !== id));
      toast.success("O'chirildi");
    } catch {
      toast.error("O'chirishda xatolik");
    }
  }

  async function handleDeleteDirector(id: number) {
    if (!confirm("Direktorni o'chirishni tasdiqlaysizmi?")) return;
    try {
      await superAdminService.deleteDirector(id);
      setDirectors((prev) => prev.filter((d) => d.id !== id));
      toast.success("O'chirildi");
    } catch {
      toast.error("O'chirishda xatolik");
    }
  }

  const NavItem = ({ tab, label, icon: Icon }: { tab: Tab; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl transition ${
        activeTab === tab
          ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20"
          : "hover:bg-[var(--surface-2)] text-[var(--muted)]"
      }`}
    >
      <Icon className="size-5" /> <span className="font-medium">{label}</span>
    </button>
  );

  // Analytics chart data from real API — oxirgi 12 oy
  const revenueChartData =
    analytics?.revenue_over_time?.map((r) => {
      const d = new Date(r.month);
      const locale = language === "ru" ? "ru" : language === "en" ? "en" : "uz";
      return {
        name: Number.isNaN(d.getTime())
          ? String(r.month).slice(0, 7)
          : d.toLocaleDateString(locale, { month: "short", year: "2-digit" }),
        val: Number(r.total) || 0,
      };
    }) ?? [];

  const revenueMax = Math.max(...revenueChartData.map((d) => d.val), 1);
  const revenueTotal = revenueChartData.reduce((s, d) => s + d.val, 0);
  const lastVal = revenueChartData.at(-1)?.val ?? 0;
  const prevVal = revenueChartData.at(-2)?.val ?? 0;
  const growthPct =
    prevVal > 0 ? Math.round(((lastVal - prevVal) / prevVal) * 100) : lastVal > 0 ? 100 : 0;

  const subscriptionPieData = analytics
    ? [
        { name: t.expired, value: analytics.subscription_status.expired_count },
        { name: t.active, value: analytics.subscription_status.active_count },
      ]
    : [];

  const activeCount = analytics?.subscription_status.active_count ?? 0;
  const totalRevenue = analytics?.total_revenue ?? 0;

  return (
    <div className="flex min-h-dvh bg-[var(--bg)] font-sans">
      <aside className="w-72 border-r border-[var(--line)] bg-[var(--surface)] p-6 hidden lg:flex flex-col sticky top-0 h-dvh">
        <div className="mb-10 px-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-white shadow-lg shadow-[var(--accent)]/30">
              <ShieldCheck className="size-6" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-[var(--ink)]">RestoFlow</h1>
          </div>
          <p className="text-xs font-medium text-[var(--muted)] px-1">Super Admin Panel</p>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem tab="analytics" label={t.analytics} icon={LayoutDashboard} />
          <NavItem tab="restaurants" label={t.restaurants} icon={Building2} />
          <NavItem tab="directors" label={t.directors} icon={Users} />
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl transition hover:bg-[var(--surface-2)] text-[var(--muted)]"
          >
            <UserCircle className="size-5" /> <span className="font-medium">{t.profile}</span>
          </button>
        </nav>

        <div className="pt-6 border-t border-[var(--line)]">
          <button
            onClick={() => { useAuthStore.getState().logout(); router.push("/login"); }}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition"
          >
            <LogOut className="size-5" /> <span className="font-medium">{t.logout}</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          left={<h2 className="font-bold text-xl text-[var(--ink)] capitalize ml-2">{t[activeTab as keyof typeof t] as string}</h2>}
          right={
            <>
              <LanguageSelect />
              <ThemeToggle />
              <button
                type="button"
                className="rounded-xl p-2 text-[var(--muted)] hover:bg-[var(--surface-2)]"
                onClick={() => router.push("/profile")}
                title={t.profile}
              >
                <UserCircle className="size-5" />
              </button>
            </>
          }
        />

        <main className="p-4 md:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="size-8 animate-spin text-[var(--accent)]" />
            </div>
          ) : (
            <>
              {/* ─── Analytics ─────────────────────────────────────────── */}
              {activeTab === "analytics" && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <MetricCard
                      icon={<Building2 className="size-6 text-[var(--accent)]" />}
                      label={t.restaurants}
                      value={String(restaurants.length)}
                      color="accent"
                    />
                    <MetricCard
                      icon={<CreditCard className="size-6 text-emerald-500" />}
                      label={t.totalRevenue}
                      value={formatMoney(Number(totalRevenue))}
                      color="emerald"
                    />
                    <MetricCard
                      icon={<TrendingUp className="size-6 text-blue-500" />}
                      label={t.activeSubscriptions}
                      value={String(activeCount)}
                      color="blue"
                    />
                  </div>

                  <div className="grid gap-6 lg:grid-cols-5">
                    <div className="lg:col-span-3 bg-[var(--surface)] p-6 rounded-3xl border border-[var(--line)] shadow-sm">
                      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-[var(--ink)]">{t.revenueDynamics}</h3>
                          <p className="text-sm text-[var(--muted)]">
                            {formatMoney(revenueTotal)} · 12 {language === "en" ? "mo" : language === "ru" ? "мес" : "oy"}
                          </p>
                        </div>
                        <div
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                            growthPct >= 0
                              ? "bg-emerald-500/15 text-emerald-600"
                              : "bg-rose-500/15 text-rose-600"
                          }`}
                        >
                          {growthPct >= 0 ? (
                            <ArrowUpRight className="size-3.5" />
                          ) : (
                            <ArrowDownRight className="size-3.5" />
                          )}
                          {growthPct > 0 ? "+" : ""}
                          {growthPct}%
                        </div>
                      </div>
                      <div className="h-80 w-full">
                        {revenueChartData.length === 0 ? (
                          <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
                            {t.emptyChart}
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                              <defs>
                                <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
                                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.02} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid stroke="var(--line)" strokeDasharray="4 4" vertical={false} />
                              <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "var(--muted)", fontSize: 11 }}
                                dy={8}
                              />
                              <YAxis
                                axisLine={false}
                                tickLine={false}
                                width={56}
                                tick={{ fill: "var(--muted)", fontSize: 11 }}
                                tickFormatter={(v) =>
                                  v >= 1_000_000
                                    ? `${(v / 1_000_000).toFixed(1)}M`
                                    : v >= 1000
                                      ? `${Math.round(v / 1000)}k`
                                      : String(v)
                                }
                                domain={[0, Math.ceil(revenueMax * 1.1)]}
                              />
                              <Tooltip
                                cursor={{ stroke: "var(--accent)", strokeWidth: 1, strokeDasharray: "4 4" }}
                                contentStyle={{
                                  borderRadius: "14px",
                                  border: "1px solid var(--line)",
                                  background: "var(--surface)",
                                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                }}
                                formatter={(v) => [formatMoney(Number(v)), t.revenue]}
                              />
                              <Area
                                type="monotone"
                                dataKey="val"
                                stroke="var(--accent)"
                                strokeWidth={3}
                                fill="url(#gradRev)"
                                dot={{ r: 3, fill: "var(--accent)", strokeWidth: 0 }}
                                activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--surface)" }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-2 bg-[var(--surface)] p-6 rounded-3xl border border-[var(--line)] shadow-sm">
                      <h3 className="text-lg font-bold text-[var(--ink)] mb-2">
                        {t.subscription} — {analytics?.subscription_status.active_percent ?? 0}%
                      </h3>
                      <p className="mb-4 text-sm text-[var(--muted)]">
                        {t.active}: {activeCount} · {t.expired}:{" "}
                        {analytics?.subscription_status.expired_count ?? 0}
                      </p>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={subscriptionPieData}
                              innerRadius={58}
                              outerRadius={88}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              <Cell fill="var(--muted)" opacity={0.35} />
                              <Cell fill="var(--accent)" />
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Subscription Expiry Table */}
                  <div className="bg-[var(--surface)] rounded-[2rem] border border-[var(--line)] shadow-sm overflow-hidden">
                    <h3 className="p-6 text-lg font-bold text-[var(--ink)]">{t.subscriptionExpiry}</h3>
                    <table className="w-full text-left">
                      <thead className="bg-[var(--surface-2)]">
                        <tr>
                          <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">{t.restaurants}</th>
                          <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">{t.daysLeft}</th>
                          <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">{t.status}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--line)]">
                        {restaurants.map((r) => {
                          const days = r.subscription_days_remaining ?? 0;
                          return (
                            <tr key={r.id}>
                              <td className="p-6 font-bold">{r.name}</td>
                              <td className="p-6">{days} {t.daysRemaining}</td>
                              <td className="p-6">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  !r.has_active_subscription
                                    ? "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300"
                                    : days < 10
                                    ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
                                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                                }`}>
                                  {!r.has_active_subscription ? t.expired : days < 10 ? t.urgent : t.normal}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ─── Restaurants ───────────────────────────────────────── */}
              {activeTab === "restaurants" && (
                <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[var(--ink)]">{t.restaurants}</h2>
                    <Button size="sm" onClick={() => openRestaurantModal(null)}>
                      <Plus className="size-4 mr-2" /> Qo&apos;shish
                    </Button>
                  </div>
                  <div className="bg-[var(--surface)] rounded-[2rem] border border-[var(--line)] shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-[var(--surface-2)]">
                        <tr>
                          <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">Restoran</th>
                          <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">Direktor</th>
                          <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">Obuna</th>
                          <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">Xodimlar</th>
                          <th className="p-6" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--line)]">
                        {restaurants.map((r) => (
                          <tr key={r.id} className="hover:bg-[var(--surface-2)]/50 transition">
                            <td className="p-6 font-bold text-[var(--ink)]">{r.name}</td>
                            <td className="p-6 text-[var(--muted)]">
                              {r.director
                                ? [r.director.first_name, r.director.last_name].filter(Boolean).join(" ") || r.director.phone
                                : <span className="text-rose-400 text-xs">Biriktirilmagan</span>}
                            </td>
                            <td className="p-6">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                r.has_active_subscription ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                              }`}>
                                {r.has_active_subscription ? `${r.subscription_days_remaining} kun` : "Tugagan"}
                              </span>
                            </td>
                            <td className="p-6 text-[var(--muted)]">{r.staff_count}</td>
                            <td className="p-6 text-right space-x-2">
                              <Button variant="secondary" size="sm" onClick={() => openRestaurantModal(r)}>
                                <Edit2 className="size-4" />
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="text-rose-500"
                                onClick={() => handleDeleteRestaurant(r.id)}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ─── Directors ─────────────────────────────────────────── */}
              {activeTab === "directors" && (
                <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[var(--ink)]">{t.directors}</h2>
                    <Button size="sm" onClick={() => { setEditingItem(null); setShowModal("director"); }}>
                      <Plus className="size-4 mr-2" /> Qo&apos;shish
                    </Button>
                  </div>
                  <div className="bg-[var(--surface)] rounded-[2rem] border border-[var(--line)] shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-[var(--surface-2)]">
                        <tr>
                          <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">Direktor</th>
                          <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">Telefon</th>
                          <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">Restoran</th>
                          <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">Status</th>
                          <th className="p-6" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--line)]">
                        {directors.map((d) => (
                          <tr key={d.id} className="hover:bg-[var(--surface-2)]/50 transition">
                            <td className="p-6 font-bold text-[var(--ink)]">
                              {[d.first_name, d.last_name].filter(Boolean).join(" ") || "—"}
                            </td>
                            <td className="p-6 text-[var(--muted)]">{d.phone}</td>
                            <td className="p-6 text-[var(--muted)]">
                              {d.restaurant_name ?? <span className="text-xs text-rose-400">Biriktirilmagan</span>}
                            </td>
                            <td className="p-6">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                d.is_active ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                              }`}>
                                {d.is_active ? "Faol" : "Faol emas"}
                              </span>
                            </td>
                            <td className="p-6 text-right space-x-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => { setEditingItem(d); setShowModal("director"); }}
                              >
                                <Edit2 className="size-4" />
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="text-rose-500"
                                onClick={() => handleDeleteDirector(d.id)}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* ─── Modal ─────────────────────────────────────────────────────── */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[var(--surface)] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl p-10 border border-[var(--line)] animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-[var(--ink)]">
                  {showModal === "restaurant"
                    ? editingItem ? t.editRestaurant : t.addRestaurant
                    : editingItem ? t.editDirector : t.addDirector}
                </h2>
                <button
                  onClick={() => setShowModal(null)}
                  className="size-12 rounded-2xl hover:bg-[var(--surface-2)] flex items-center justify-center transition"
                >
                  <XCircle className="size-8 text-[var(--muted)]" />
                </button>
              </div>

              {showModal === "restaurant" ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Left: form fields */}
                  <div className="space-y-6">
                    <Input
                      ref={restaurantNameRef}
                      label={t.restaurantName}
                      defaultValue={(editingItem as RestaurantApi)?.name}
                      className="h-14 rounded-2xl border-2"
                    />

                    {/* Director select — faqat yangi restoran qo'shishda */}
                    {!editingItem && (
                      <>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-[var(--muted)] uppercase tracking-widest">
                            Direktor
                          </label>
                          <select
                            value={selectedDirectorId}
                            onChange={(e) => handleDirectorSelect(e.target.value)}
                            className="w-full h-14 rounded-2xl border-2 border-[var(--line)] bg-[var(--bg)] px-4 font-semibold text-[var(--ink)] focus:border-[var(--accent)] outline-none transition"
                          >
                            <option value="__new__">+ Yangi direktor</option>
                            {unassignedDirectors.map((d) => (
                              <option key={d.id} value={String(d.id)}>
                                {[d.first_name, d.last_name].filter(Boolean).join(" ") || d.phone} — {d.phone}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* F.I.Sh — doim ko'rinadi */}
                        <Input
                          label="F.I.Sh."
                          value={newDirName}
                          onChange={(e) => !existingDir && setNewDirName(e.target.value)}
                          disabled={!!existingDir}
                          placeholder={existingDir ? "" : "Direktor to'liq ismi"}
                          className={`h-14 rounded-2xl border-2 transition ${existingDir ? "opacity-70 cursor-not-allowed" : ""}`}
                        />

                        {/* Telefon — doim ko'rinadi */}
                        <Input
                          label="Telefon"
                          value={newDirPhone}
                          onChange={(e) => !existingDir && setNewDirPhone(e.target.value)}
                          disabled={!!existingDir}
                          placeholder={existingDir ? "" : "+998 xx xxx xx xx"}
                          className={`h-14 rounded-2xl border-2 transition ${existingDir ? "opacity-70 cursor-not-allowed" : ""}`}
                        />
                      </>
                    )}
                  </div>

                  {/* Right: map */}
                  <div className="aspect-square bg-[var(--bg)] rounded-[2.5rem] border-2 border-[var(--line)] overflow-hidden relative">
                    <Map
                      onLocationSelect={(lat: number, lng: number) => setSelectedLocation({ lat, lng })}
                      markerPosition={selectedLocation}
                    />
                  </div>
                </div>
              ) : (
                /* Director modal */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      ref={dirFirstRef}
                      label="Ism"
                      defaultValue={(editingItem as DirectorApi)?.first_name}
                      placeholder="Ism"
                      className="h-14 rounded-2xl border-2"
                    />
                    <Input
                      ref={dirLastRef}
                      label="Familiya"
                      defaultValue={(editingItem as DirectorApi)?.last_name}
                      placeholder="Familiya"
                      className="h-14 rounded-2xl border-2"
                    />
                  </div>
                  <Input
                    ref={dirPhoneRef}
                    label={t.phone}
                    defaultValue={(editingItem as DirectorApi)?.phone}
                    placeholder="+998901234567"
                    disabled={!!editingItem}
                    className={`h-14 rounded-2xl border-2 ${editingItem ? "opacity-70" : ""}`}
                  />
                  {!editingItem && (
                    <p className="text-sm text-[var(--muted)] bg-[var(--surface-2)] rounded-2xl p-4">
                      💡 Parol avtomatik generatsiya qilinadi va bir martalik ko&apos;rsatiladi.
                      Keyinroq yangi restoran yaratishda ushbu direktorni tanlab biriktirishingiz mumkin.
                    </p>
                  )}
                </div>
              )}

              <div className="mt-12 flex gap-4">
                <Button
                  className="flex-1 h-16 rounded-[2rem] text-lg font-black"
                  onClick={showModal === "restaurant" ? handleSaveRestaurant : handleSaveDirector}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="size-5 animate-spin" /> : t.save}
                </Button>
                <Button
                  variant="secondary"
                  className="h-16 px-10 rounded-[2rem] text-lg font-bold"
                  onClick={() => setShowModal(null)}
                  disabled={saving}
                >
                  {t.cancel}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="bg-[var(--surface)] p-6 rounded-3xl border border-[var(--line)] shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-2xl bg-[var(--bg)] flex items-center justify-center border border-[var(--line)]">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
          <h4 className="text-2xl font-bold text-[var(--ink)] mt-0.5">{value}</h4>
        </div>
      </div>
    </div>
  );
}
