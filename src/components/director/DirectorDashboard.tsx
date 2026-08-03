"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  Armchair,
  ArrowUpRight,
  ChefHat,
  CircleDollarSign,
  ClipboardList,
  Radio,
  TrendingUp,
  UtensilsCrossed,
  LogOut,
  Users,
  Briefcase,
  LayoutDashboard,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  DollarSign
} from "lucide-react";
import { api } from "@/lib/api";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { DashboardStats, Order, TableStatus, WsEvent, Manager, Waiter, Chef } from "@/lib/types";
import { formatMoney, formatTime, statusLabel } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";
import { TopBar } from "@/components/chrome/TopBar";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { LanguageSelect } from "@/components/chrome/LanguageSelect";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/providers/PreferencesProvider";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

type DirectorTab = "analytics" | "managers" | "waiters" | "chefs";

export function DirectorDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { t } = usePreferences();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<TableStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const [activeTab, setActiveTab] = useState<DirectorTab>("analytics");

  const [managers, setManagers] = useState<Manager[]>([
    { id: "1", fullName: "Alisher Valiyev", joinedDate: "2023-01-15", birthYear: 1990, salary: 5000000, role: "manager" },
    { id: "2", fullName: "Nigora Karimova", joinedDate: "2023-05-20", birthYear: 1995, salary: 4500000, role: "manager" },
  ]);

  const [waiters, setWaiters] = useState<Waiter[]>([
    { id: "3", fullName: "Javohir Toshmatov", joinedDate: "2023-06-10", birthYear: 2000, salary: 3000000, role: "waiter" },
    { id: "4", fullName: "Madina Soliyeva", joinedDate: "2023-08-12", birthYear: 2001, salary: 3000000, role: "waiter" },
  ]);

  const [chefs, setChefs] = useState<Chef[]>([
    { id: "5", fullName: "Rustam Ahmedov", joinedDate: "2022-11-01", birthYear: 1985, salary: 7000000, role: "kitchen" },
    { id: "6", fullName: "Zilola Umarova", joinedDate: "2023-03-15", birthYear: 1988, salary: 6500000, role: "kitchen" },
  ]);

  useEffect(() => {
    if (user && user.role !== "director") {
      router.replace(user.role === "kitchen" ? "/kds" : "/waiter");
    }
  }, [user, router]);

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboard() {
      const [s, o, t] = await Promise.all([
        api.getDashboardStats(),
        api.getOrders(),
        api.getTables(),
      ]);
      if (cancelled) return;
      
      // Mocking additional stats for the new dashboard
      const extendedStats: DashboardStats = {
        ...s,
        totalEmployees: managers.length + waiters.length + chefs.length,
        totalMonthlySalary: [...managers, ...waiters, ...chefs].reduce((acc, curr) => acc + curr.salary, 0),
        revenueByDay: [
            { day: "Du", amount: 1200000 },
            { day: "Se", amount: 1500000 },
            { day: "Ch", amount: 1100000 },
            { day: "Pa", amount: 1800000 },
            { day: "Ju", amount: 2200000 },
            { day: "Sh", amount: 2800000 },
            { day: "Ya", amount: 2500000 },
        ],
        revenueByWeek: [
            { week: "Hafta 1", amount: 12000000 },
            { week: "Hafta 2", amount: 15000000 },
            { week: "Hafta 3", amount: 14000000 },
            { week: "Hafta 4", amount: 18000000 },
        ]
      };

      setStats(extendedStats);
      setOrders(
        o.filter((x) => !["delivered", "cancelled"].includes(x.status)),
      );
      setTables(t);
      setLoading(false);
    }

    void fetchDashboard();
    return () => {
      cancelled = true;
    };
  }, [reloadToken, managers, waiters, chefs]);

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

  const NavItem = ({ tab, label, icon: Icon }: { tab: DirectorTab; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl transition ${
        activeTab === tab ? "bg-[var(--accent)] text-white" : "hover:bg-[var(--surface-2)] text-[var(--muted)]"
      }`}
    >
      <Icon className="size-5" /> <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-dvh bg-[var(--bg)]">
      {/* Sidebar */}
      <aside className="w-72 border-r border-[var(--line)] bg-[var(--surface)] p-6 hidden lg:flex flex-col sticky top-0 h-dvh">
        <div className="mb-8">
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--accent)] font-bold">RestoFlow</p>
            <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              {t.directorPanel}
            </h1>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem tab="analytics" label={t.analytics} icon={LayoutDashboard} />
          <NavItem tab="managers" label={t.managers} icon={Users} />
          <NavItem tab="waiters" label={t.waiters} icon={Briefcase} />
          <NavItem tab="chefs" label={t.chefs} icon={ChefHat} />
          <button
              onClick={() => router.push("/director/menu")}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-xl transition hover:bg-[var(--surface-2)] text-[var(--muted)]"
          >
              <UtensilsCrossed className="size-5" /> <span className="font-medium">{t.menu}</span>
          </button>
        </nav>

        <div className="pt-6 border-t border-[var(--line)]">
             <button onClick={() => {
                useAuthStore.getState().logout();
                router.push("/login");
            }} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition">
                <LogOut className="size-5" /> <span className="font-medium">{t.logout}</span>
            </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
            left={
              <div className="lg:hidden">
                <h1 className="font-bold text-xl text-[var(--ink)]">{t.directorPanel}</h1>
              </div>
            }
            right={
            <>
                <span
                className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
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
                <button className="lg:hidden p-2 text-[var(--muted)] hover:text-rose-500" onClick={() => { useAuthStore.getState().logout(); router.push("/login"); }}>
                    <LogOut className="size-4" />
                </button>
            </>
            }
        />

        <main className="p-4 md:p-8">
            {loading || !stats ? (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-32 animate-pulse rounded-3xl bg-[var(--surface)] border border-[var(--line)]" />
                  ))}
                </div>
                <div className="h-96 animate-pulse rounded-3xl bg-[var(--surface)] border border-[var(--line)]" />
              </div>
            ) : (
              <>
                {activeTab === "analytics" && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    {/* Top Metrics */}
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <MetricCard
                            icon={<Users className="size-6 text-blue-500" />}
                            label={t.totalEmployees}
                            value={String(stats.totalEmployees)}
                            color="blue"
                        />
                        <MetricCard
                            icon={<DollarSign className="size-6 text-emerald-500" />}
                            label={t.totalSalary}
                            value={formatMoney(stats.totalMonthlySalary)}
                            color="emerald"
                        />
                        <MetricCard
                            icon={<TrendingUp className="size-6 text-[var(--accent)]" />}
                            label={t.todayRevenue}
                            value={formatMoney(stats.todayRevenue)}
                            color="accent"
                        />
                    </div>

                    {/* Chart Sections */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="bg-[var(--surface)] p-6 rounded-3xl border border-[var(--line)] shadow-sm">
                            <h3 className="text-lg font-bold text-[var(--ink)] mb-6">{t.dailyProfit}</h3>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.revenueByDay}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: 'var(--muted)', fontSize: 12}} dy={10} />
                                        <YAxis hide />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: 'var(--surface)' }}
                                            itemStyle={{ color: 'var(--ink)', fontSize: '14px' }}
                                        />
                                        <Area type="monotone" dataKey="amount" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-[var(--surface)] p-6 rounded-3xl border border-[var(--line)] shadow-sm">
                            <h3 className="text-lg font-bold text-[var(--ink)] mb-6">{t.weeklyProfit}</h3>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.revenueByWeek}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                                        <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: 'var(--muted)', fontSize: 12}} dy={10} />
                                        <YAxis hide />
                                        <Tooltip 
                                            cursor={{fill: 'var(--surface-2)'}}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: 'var(--surface)' }}
                                        />
                                        <Bar dataKey="amount" fill="var(--accent)" radius={[6, 6, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Table */}
                    <div className="bg-[var(--surface)] p-6 rounded-3xl border border-[var(--line)] shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                             <h3 className="text-lg font-bold text-[var(--ink)]">{t.activeOrders}</h3>
                             <span className="text-sm font-medium px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full">{orders.length} buyurtma</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[var(--line)]">
                                        <th className="pb-4 font-semibold text-[var(--muted)] text-sm">{t.table}</th>
                                        <th className="pb-4 font-semibold text-[var(--muted)] text-sm">{t.status}</th>
                                        <th className="pb-4 font-semibold text-[var(--muted)] text-sm">{t.time}</th>
                                        <th className="pb-4 font-semibold text-[var(--muted)] text-sm">{t.amount}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--line)]">
                                    {orders.map(order => (
                                        <tr key={order.id} className="group hover:bg-[var(--surface-2)]/50 transition">
                                            <td className="py-4">
                                                <div className="size-10 rounded-xl bg-[var(--bg)] border border-[var(--line)] flex items-center justify-center font-bold text-[var(--ink)]">
                                                    #{order.tableNumber}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="py-4 text-sm text-[var(--muted)]">
                                                {formatTime(order.createdAt)}
                                            </td>
                                            <td className="py-4 font-bold text-[var(--ink)]">
                                                {formatMoney(order.totalAmount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                  </div>
                )}

                {activeTab === "managers" && (
                    <StaffTable
                        title={t.managers}
                        data={managers}
                        canEdit={true}
                        onAdd={() => alert(t.addManager)}
                        onEdit={(m) => alert(`${t.editManager}: ${m.fullName}`)}
                        onDelete={(id) => setManagers(prev => prev.filter(m => m.id !== id))}
                        t={t}
                    />
                )}

                {activeTab === "waiters" && (
                    <StaffTable
                        title={t.waiters}
                        data={waiters}
                        canEdit={false}
                        t={t}
                    />
                )}

                {activeTab === "chefs" && (
                    <StaffTable
                        title={t.chefs}
                        data={chefs}
                        canEdit={false}
                        t={t}
                    />
                )}
              </>
            )}
        </main>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
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

function StaffTable({ title, data, canEdit, onAdd, onEdit, onDelete, t }: { 
    title: string, 
    data: any[], 
    canEdit: boolean, 
    onAdd?: () => void, 
    onEdit?: (m: any) => void, 
    onDelete?: (id: string) => void,
    t: any
}) {
    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--ink)]">{title}</h2>
                {canEdit && (
                    <Button size="sm" onClick={onAdd}>
                        <Plus className="size-4 mr-2" /> {t.addManager}
                    </Button>
                )}
            </div>

            <div className="bg-[var(--surface)] rounded-[2.5rem] border border-[var(--line)] shadow-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[var(--surface-2)]">
                        <tr>
                            <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">{t.fullName}</th>
                            <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">{t.joinedDate}</th>
                            <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">{t.birthYear}</th>
                            <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">{t.salary}</th>
                            {canEdit && <th className="p-6"></th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                        {data.map(person => (
                            <tr key={person.id} className="hover:bg-[var(--surface-2)]/50 transition">
                                <td className="p-6 font-bold text-[var(--ink)]">{person.fullName}</td>
                                <td className="p-6 text-[var(--muted)]">{person.joinedDate}</td>
                                <td className="p-6 text-[var(--muted)]">{person.birthYear}</td>
                                <td className="p-6 font-bold text-emerald-600">{formatMoney(person.salary)}</td>
                                {canEdit && (
                                    <td className="p-6 text-right space-x-2">
                                        <Button variant="secondary" size="sm" onClick={() => onEdit?.(person)}><Edit2 className="size-4" /></Button>
                                        <Button variant="secondary" size="sm" className="text-rose-500" onClick={() => onDelete?.(person.id)}><Trash2 className="size-4" /></Button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
