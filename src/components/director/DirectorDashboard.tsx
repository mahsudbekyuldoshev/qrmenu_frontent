"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChefHat,
  Briefcase,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Plus,
  Radio,
  TrendingUp,
  UserCircle,
  Users,
  UtensilsCrossed,
  DollarSign,
  Menu,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { orderService } from "@/lib/services/order.service";
import { dashboardService } from "@/lib/services/dashboard.service";
import { staffService, type StaffApiItem } from "@/lib/services/staff.service";
import { useWebSocket } from "@/hooks/useWebSocket";
import type {
  DashboardStats,
  EmploymentStatus,
  Order,
  TableStatus,
  WsEvent,
  Manager,
  Waiter,
  Chef,
} from "@/lib/types";
import { formatMoney, formatTime } from "@/lib/utils";
import { translations } from "@/lib/translations";
import { StatusBadge } from "@/components/ui/Badge";
import { TopBar } from "@/components/chrome/TopBar";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { LanguageSelect } from "@/components/chrome/LanguageSelect";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { roleHomePath, useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/providers/PreferencesProvider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

type DirectorTab = "analytics" | "managers" | "waiters" | "chefs";

const WEEKDAY_KEYS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"] as const;

function buildDayRevenue(orders: Order[]) {
  const amounts = Object.fromEntries(WEEKDAY_KEYS.map((d) => [d, 0]));
  for (const o of orders) {
    const raw = o.created_at || o.createdAt;
    if (!raw) continue;
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) continue;
    const key = WEEKDAY_KEYS[(d.getDay() + 6) % 7];
    amounts[key] += Number(o.total_price ?? o.totalAmount ?? 0);
  }
  return WEEKDAY_KEYS.map((day) => ({ day, amount: amounts[day] }));
}

function buildWeekRevenue(orders: Order[]) {
  const buckets = [0, 0, 0, 0];
  const now = new Date();
  for (const o of orders) {
    const raw = o.created_at || o.createdAt;
    if (!raw) continue;
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) continue;
    const daysAgo = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (daysAgo < 0 || daysAgo >= 28) continue;
    buckets[3 - Math.floor(daysAgo / 7)] += Number(o.total_price ?? o.totalAmount ?? 0);
  }
  return buckets.map((amount, i) => ({ week: `W${i + 1}`, amount }));
}

function toMember(item: StaffApiItem) {
  return {
    id: String(item.id),
    fullName:
      [item.first_name, item.last_name].filter(Boolean).join(" ") || item.phone,
    joinedDate: item.date_joined.split("T")[0],
    birthYear: 0,
    salary: 0,
    role: item.role,
    employmentStatus: item.employment_status as EmploymentStatus,
    phone: item.phone,
  };
}

export function DirectorDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { t, language } = usePreferences();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<TableStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const [activeTab, setActiveTab] = useState<DirectorTab>("analytics");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [managers, setManagers] = useState<Manager[]>([]);
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addRole, setAddRole] = useState<"manager" | "waiter" | "chef">("manager");
  const [addPhone, setAddPhone] = useState("");
  const [addFirst, setAddFirst] = useState("");
  const [addLast, setAddLast] = useState("");
  const [addBusy, setAddBusy] = useState(false);

  useEffect(() => {
    if (user && user.role !== "director") {
      router.replace(
        user.role === "kitchen" || user.role === "chef"
          ? "/kds"
          : roleHomePath(user.role),
      );
    }
  }, [user, router]);

  const reloadStaff = useCallback(() => {
    setStaffLoading(true);
    staffService
      .getAll()
      .then(({ data }) => {
        setManagers(
          data.filter((x) => x.role === "manager").map(toMember) as Manager[],
        );
        setWaiters(
          data.filter((x) => x.role === "waiter").map(toMember) as Waiter[],
        );
        setChefs(
          data
            .filter((x) => x.role === "chef" || x.role === "kitchen")
            .map(toMember) as Chef[],
        );
      })
      .catch((err) => {
        // Silent fail — stafflar yuklanmasa ham dashboard ishlaydi
        console.warn("Staff yüklenemedi:", err);
      })
      .finally(() => setStaffLoading(false));
  }, []);

  useEffect(() => {
    reloadStaff();
  }, [reloadStaff]);

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboard() {
      try {
        const [ordersRes, tablesRes] = await Promise.all([
          orderService.getOrders(),
          dashboardService.getTables(),
        ]);
        if (cancelled) return;

        const allOrders = ordersRes.data ?? [];
        const allTables = tablesRes.data ?? [];
        const dayRev = buildDayRevenue(allOrders);
        const weekRev = buildWeekRevenue(allOrders);

        let statsData: DashboardStats;
        try {
          const { data: s } = await dashboardService.getStats();
          statsData = {
            ...s,
            revenueByDay: s.revenueByDay?.length ? s.revenueByDay : dayRev,
            revenueByWeek: s.revenueByWeek?.length ? s.revenueByWeek : weekRev,
            totalEmployees:
              s.totalEmployees ?? managers.length + waiters.length + chefs.length,
          };
        } catch {
          statsData = {
            todayRevenue: allOrders
              .filter((o) => {
                const raw = o.created_at || o.createdAt;
                if (!raw) return false;
                const d = new Date(raw);
                const n = new Date();
                return d.toDateString() === n.toDateString();
              })
              .reduce((s, o) => s + Number(o.total_price ?? 0), 0),
            todayOrders: allOrders.length,
            activeOrders: allOrders.filter(
              (o) => !["delivered", "cancelled"].includes(o.status),
            ).length,
            averageOrderValue: allOrders.length
              ? allOrders.reduce((s, o) => s + Number(o.total_price ?? 0), 0) /
                allOrders.length
              : 0,
            occupiedTables: allTables.filter((t) => t.is_active).length,
            totalTables: allTables.length,
            revenueByHour: [],
            revenueByDay: dayRev,
            revenueByWeek: weekRev,
            topItems: [],
            totalEmployees: managers.length + waiters.length + chefs.length,
            totalMonthlySalary: 0,
          };
        }

        setStats(statsData);
        setOrders(
          allOrders.filter((x) => !["delivered", "cancelled"].includes(x.status)),
        );
        setTables(allTables);
      } catch {
        // Bo'sh holat — menyular baribir ishlashi kerak
        setStats({
          todayRevenue: 0,
          todayOrders: 0,
          activeOrders: 0,
          averageOrderValue: 0,
          occupiedTables: 0,
          totalTables: 0,
          revenueByHour: [],
          revenueByDay: WEEKDAY_KEYS.map((day) => ({ day, amount: 0 })),
          revenueByWeek: [1, 2, 3, 4].map((i) => ({ week: `W${i}`, amount: 0 })),
          topItems: [],
          totalEmployees: 0,
          totalMonthlySalary: 0,
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchDashboard();
    return () => {
      cancelled = true;
    };
  }, [reloadToken, managers.length, waiters.length, chefs.length]);

  const onEvent = useCallback((event: WsEvent) => {
    if (
      event.type === "order.created" ||
      event.type === "order.status_changed" ||
      event.type === "order.updated" ||
      event.type === "stats.updated"
    ) {
      setReloadToken((n) => n + 1);
    }
  }, []);

  const { connected } = useWebSocket({ onEvent });

  async function updateEmployment(id: string, status: EmploymentStatus) {
    try {
      await staffService.update(Number(id), { employment_status: status });
      const patch = (list: { id: string; employmentStatus?: EmploymentStatus }[]) =>
        list.map((p) =>
          p.id === id ? { ...p, employmentStatus: status } : p,
        );
      setManagers((m) => patch(m) as Manager[]);
      setWaiters((w) => patch(w) as Waiter[]);
      setChefs((c) => patch(c) as Chef[]);
      toast.success(t.save || "OK");
    } catch {
      toast.error(t.profileUpdateError || "Xatolik");
    }
  }

  async function handleAddStaff() {
    const phone = addPhone.replace(/\D/g, "");
    if (phone.length < 9) {
      toast.error(t.phone);
      return;
    }
    setAddBusy(true);
    try {
      const { data } = await staffService.create({
        phone: `+998${phone.slice(-9)}`,
        first_name: addFirst,
        last_name: addLast,
        role: addRole,
      });
      if (data.generated_password) {
        toast.success(`Parol: ${data.generated_password}`);
      } else {
        toast.success(t.save || "OK");
      }
      setShowAdd(false);
      setAddPhone("");
      setAddFirst("");
      setAddLast("");
      reloadStaff();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string; phone?: string[] } } })
          ?.response?.data?.detail ||
        (err as { response?: { data?: { phone?: string[] } } })?.response?.data
          ?.phone?.[0] ||
        t.profileUpdateError;
      toast.error(String(msg));
    } finally {
      setAddBusy(false);
    }
  }

  // Xodimlar submenu ochiqligi
  const [staffMenuOpen, setStaffMenuOpen] = useState(true);

  const NavItem = ({
    tab,
    label,
    icon: Icon,
    indent = false,
  }: {
    tab: DirectorTab;
    label: string;
    icon: typeof LayoutDashboard;
    indent?: boolean;
  }) => (
    <button
      type="button"
      onClick={() => {
        setActiveTab(tab);
        setMobileNavOpen(false);
      }}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 transition ${
        indent ? "pl-10" : ""
      } ${
        activeTab === tab
          ? "bg-[var(--accent)] text-white"
          : "text-[var(--muted)] hover:bg-[var(--surface-2)]"
      }`}
    >
      <Icon className="size-4 shrink-0" />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  const sidebarNav = (
    <>
      {/* Analitika */}
      <button
        type="button"
        onClick={() => { setActiveTab("analytics"); setMobileNavOpen(false); }}
        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
          activeTab === "analytics"
            ? "bg-[var(--accent)] text-white"
            : "text-[var(--muted)] hover:bg-[var(--surface-2)]"
        }`}
      >
        <LayoutDashboard className="size-5" />
        <span className="font-medium">{t.analytics}</span>
      </button>

      {/* Xodimlar guruhi — dropdown */}
      <div>
        <button
          type="button"
          onClick={() => setStaffMenuOpen((v) => !v)}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[var(--muted)] transition hover:bg-[var(--surface-2)]"
        >
          <Users className="size-5" />
          <span className="flex-1 text-left font-medium">Xodimlar</span>
          <ChevronDown
            className={`size-4 transition-transform ${staffMenuOpen ? "rotate-180" : ""}`}
          />
        </button>
        {staffMenuOpen && (
          <div className="mt-1 space-y-1 border-l-2 border-[var(--line)] ml-6 pl-2">
            <NavItem tab="managers" label={t.managers} icon={Briefcase} />
            <NavItem tab="waiters" label={t.waiters} icon={UserCircle} />
            <NavItem tab="chefs" label={t.chefs} icon={ChefHat} />
          </div>
        )}
      </div>

      {/* Menyu */}
      <button
        type="button"
        onClick={() => router.push("/director/menu")}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[var(--muted)] transition hover:bg-[var(--surface-2)]"
      >
        <UtensilsCrossed className="size-5" />
        <span className="font-medium">{t.menu}</span>
      </button>

    </>
  );


  const weekLabels =
    language === "ru"
      ? ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
      : language === "en"
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

  const dayChart =
    stats?.revenueByDay?.map((r, i) => ({
      ...r,
      day: weekLabels[i] ?? r.day,
    })) ?? [];

  const weekChart =
    stats?.revenueByWeek?.map((r, i) => ({
      ...r,
      week:
        language === "ru"
          ? `Нед ${i + 1}`
          : language === "en"
            ? `Week ${i + 1}`
            : `Hafta ${i + 1}`,
    })) ?? [];

  return (
    <div className="flex min-h-dvh bg-[var(--bg)]">
      <aside className="sticky top-0 hidden h-dvh w-72 flex-col border-r border-[var(--line)] bg-[var(--surface)] p-6 lg:flex">
        <div className="mb-8">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
            RestoFlow
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            {t.directorPanel}
          </h1>
        </div>
        <nav className="flex-1 space-y-2">{sidebarNav}</nav>
        <div className="border-t border-[var(--line)] pt-6">
          <button
            type="button"
            onClick={() => {
              useAuthStore.getState().logout();
              router.push("/login");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
          >
            <LogOut className="size-5" />
            <span className="font-medium">{t.logout}</span>
          </button>
        </div>
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-[var(--surface)] p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-bold text-[var(--ink)]">{t.directorPanel}</h2>
              <button type="button" onClick={() => setMobileNavOpen(false)}>
                <X className="size-5 text-[var(--muted)]" />
              </button>
            </div>
            <nav className="flex-1 space-y-2">{sidebarNav}</nav>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          left={
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-xl p-2 text-[var(--muted)] hover:bg-[var(--surface-2)] lg:hidden"
                onClick={() => setMobileNavOpen(true)}
              >
                <Menu className="size-5" />
              </button>
              <h1 className="text-xl font-bold text-[var(--ink)] lg:hidden">
                {t.directorPanel}
              </h1>
            </div>
          }
          right={
            <>
              <span
                className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium sm:inline-flex ${
                  connected
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                }`}
              >
                <Radio className="size-3.5" />
                {connected ? t.realTime : t.offline}
              </span>
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

        {/* Mobile tab strip */}
        <div className="flex gap-2 overflow-x-auto border-b border-[var(--line)] px-4 py-2 lg:hidden">
          {(
            [
              ["analytics", t.analytics],
              ["managers", t.managers],
              ["waiters", t.waiters],
              ["chefs", t.chefs],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                activeTab === id
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface-2)] text-[var(--muted)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <main className="p-4 md:p-8">
          {activeTab === "analytics" && (
            <div className="animate-in fade-in space-y-8 duration-500">
              {loading && !stats ? (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-32 animate-pulse rounded-3xl border border-[var(--line)] bg-[var(--surface)]"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <MetricCard
                      icon={<Users className="size-6 text-blue-500" />}
                      label={t.totalEmployees}
                      value={String(
                        stats?.totalEmployees ??
                          managers.length + waiters.length + chefs.length,
                      )}
                    />
                    <MetricCard
                      icon={<DollarSign className="size-6 text-emerald-500" />}
                      label={t.totalSalary}
                      value={formatMoney(stats?.totalMonthlySalary ?? 0)}
                    />
                    <MetricCard
                      icon={<TrendingUp className="size-6 text-[var(--accent)]" />}
                      label={t.todayRevenue}
                      value={formatMoney(stats?.todayRevenue ?? 0)}
                    />
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                      <h3 className="mb-6 text-lg font-bold text-[var(--ink)]">
                        {t.dailyProfit}
                      </h3>
                      <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={dayChart}>
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis
                              dataKey="day"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "var(--muted)", fontSize: 12 }}
                              dy={10}
                            />
                            <YAxis hide />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                background: "var(--surface)",
                              }}
                              formatter={(v) => [formatMoney(Number(v)), t.revenue]}
                            />
                            <Area
                              type="monotone"
                              dataKey="amount"
                              stroke="var(--accent)"
                              strokeWidth={3}
                              fillOpacity={1}
                              fill="url(#colorRevenue)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                      <h3 className="mb-6 text-lg font-bold text-[var(--ink)]">
                        {t.weeklyProfit}
                      </h3>
                      <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={weekChart}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="var(--line)"
                            />
                            <XAxis
                              dataKey="week"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "var(--muted)", fontSize: 12 }}
                              dy={10}
                            />
                            <YAxis hide />
                            <Tooltip
                              cursor={{ fill: "var(--surface-2)" }}
                              contentStyle={{
                                borderRadius: "12px",
                                border: "none",
                                background: "var(--surface)",
                              }}
                              formatter={(v) => [formatMoney(Number(v)), t.revenue]}
                            />
                            <Bar
                              dataKey="amount"
                              fill="var(--accent)"
                              radius={[6, 6, 0, 0]}
                              barSize={40}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-[var(--ink)]">
                        {t.activeOrders}
                      </h3>
                      <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-sm font-medium text-[var(--accent)]">
                        {orders.length} {t.ordersCount}
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-[var(--line)]">
                            <th className="pb-4 text-sm font-semibold text-[var(--muted)]">
                              {t.table}
                            </th>
                            <th className="pb-4 text-sm font-semibold text-[var(--muted)]">
                              {t.status}
                            </th>
                            <th className="pb-4 text-sm font-semibold text-[var(--muted)]">
                              {t.time}
                            </th>
                            <th className="pb-4 text-sm font-semibold text-[var(--muted)]">
                              {t.amount}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--line)]">
                          {orders.length === 0 ? (
                            <tr>
                              <td
                                colSpan={4}
                                className="py-8 text-center text-sm text-[var(--muted)]"
                              >
                                {t.noActiveOrders}
                              </td>
                            </tr>
                          ) : (
                            orders.map((order) => (
                              <tr
                                key={order.id}
                                className="transition hover:bg-[var(--surface-2)]/50"
                              >
                                <td className="py-4">
                                  <div className="flex size-8 items-center justify-center rounded-full bg-[var(--surface-2)] text-xs font-bold text-[var(--ink)]">
                                    #
                                    {order.table_number ??
                                      order.tableNumber ??
                                      order.table}
                                  </div>
                                </td>
                                <td className="py-4">
                                  <StatusBadge status={order.status} />
                                </td>
                                <td className="py-4 text-sm text-[var(--muted)]">
                                  {formatTime(
                                    order.created_at || order.createdAt || "",
                                  )}
                                </td>
                                <td className="py-4 font-bold text-[var(--ink)]">
                                  {formatMoney(
                                    Number(
                                      order.total_price || order.totalAmount || 0,
                                    ),
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "managers" && (
            <StaffTable
              title={t.managers}
              data={managers}
              loading={staffLoading}
              t={t}
              onAdd={() => {
                setAddRole("manager");
                setShowAdd(true);
              }}
              onStatusChange={updateEmployment}
            />
          )}
          {activeTab === "waiters" && (
            <StaffTable
              title={t.waiters}
              data={waiters}
              loading={staffLoading}
              t={t}
              onAdd={() => {
                setAddRole("waiter");
                setShowAdd(true);
              }}
              onStatusChange={updateEmployment}
            />
          )}
          {activeTab === "chefs" && (
            <StaffTable
              title={t.chefs}
              data={chefs}
              loading={staffLoading}
              t={t}
              onAdd={() => {
                setAddRole("chef");
                setShowAdd(true);
              }}
              onStatusChange={updateEmployment}
            />
          )}
        </main>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-[var(--ink)]">
              {t.addStaff} ({addRole})
            </h3>
            <div className="space-y-3">
              <PhoneInput
                label={t.phone}
                value={addPhone}
                onChange={setAddPhone}
              />
              <Input
                label={t.firstName}
                value={addFirst}
                onChange={(e) => setAddFirst(e.target.value)}
              />
              <Input
                label={t.lastName}
                value={addLast}
                onChange={(e) => setAddLast(e.target.value)}
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowAdd(false)}>
                {t.cancel}
              </Button>
              <Button onClick={handleAddStaff} disabled={addBusy}>
                {addBusy ? t.saving : t.save}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--bg)]">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
          <h4 className="mt-0.5 text-2xl font-bold text-[var(--ink)]">{value}</h4>
        </div>
      </div>
    </div>
  );
}

function StaffTable({
  title,
  data,
  loading,
  onAdd,
  onStatusChange,
  t,
}: {
  title: string;
  data: {
    id: string;
    fullName: string;
    joinedDate: string;
    salary: number;
    employmentStatus?: EmploymentStatus;
  }[];
  loading: boolean;
  onAdd?: () => void;
  onStatusChange: (id: string, status: EmploymentStatus) => void;
  t: typeof translations.uz;
}) {
  return (
    <div className="animate-in slide-in-from-bottom-4 space-y-6 duration-500">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-[var(--ink)]">{title}</h2>
        {onAdd && (
          <Button size="sm" onClick={onAdd}>
            <Plus className="mr-2 size-4" /> {t.addStaff}
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] shadow-lg">
        {loading ? (
          <div className="p-10 text-center text-sm text-[var(--muted)]">
            {t.saving}
          </div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-sm text-[var(--muted)]">—</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[var(--surface-2)]">
              <tr>
                <th className="p-5 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
                  {t.fullName}
                </th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
                  {t.joinedDate}
                </th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
                  {t.status}
                </th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
                  {t.salary}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {data.map((person) => (
                <tr
                  key={person.id}
                  className="transition hover:bg-[var(--surface-2)]/50"
                >
                  <td className="p-5 font-bold text-[var(--ink)]">
                    {person.fullName}
                  </td>
                  <td className="p-5 text-[var(--muted)]">{person.joinedDate}</td>
                  <td className="p-5">
                    <select
                      className="rounded-lg border border-[var(--line)] bg-transparent px-2 py-1 text-sm font-medium text-[var(--ink)] focus:outline-none"
                      value={person.employmentStatus || "working"}
                      onChange={(e) =>
                        onStatusChange(
                          person.id,
                          e.target.value as EmploymentStatus,
                        )
                      }
                    >
                      <option value="working">{t.statusWorking}</option>
                      <option value="fired">{t.statusFired}</option>
                      <option value="resigned">{t.statusResigned}</option>
                    </select>
                  </td>
                  <td className="p-5 font-bold text-emerald-600">
                    {formatMoney(person.salary)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
