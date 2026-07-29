"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { api } from "@/lib/api";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { DashboardStats, Order, TableStatus, WsEvent } from "@/lib/types";
import { formatMoney, formatTime, statusLabel } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";
import { TopBar } from "@/components/chrome/TopBar";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { LanguageSelect } from "@/components/chrome/LanguageSelect";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/providers/PreferencesProvider";

export function DirectorDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { t } = usePreferences();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<TableStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

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
      setStats(s);
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
  }, [reloadToken]);

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

  const maxRevenue = Math.max(
    ...(stats?.revenueByHour.map((h) => h.amount) ?? [1]),
    1,
  );

  const occupancyPct = stats
    ? Math.round((stats.occupiedTables / Math.max(stats.totalTables, 1)) * 100)
    : 0;

  return (
    <div className="director-shell min-h-dvh">
      {/* TopBar */}
      <TopBar
        left={
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--accent)]">
              RestoFlow
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-2xl leading-tight text-[var(--ink)]">
              {t.directorPanel}
            </h1>
          </div>
        }
        right={
          <>
            {/* Connection status */}
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
            <button onClick={() => {
                useAuthStore.getState().logout();
                router.push("/login");
            }} className="p-2 text-[var(--muted)] hover:text-rose-500">
                <LogOut className="size-4" />
            </button>
          </>
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        {loading || !stats ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-2xl bg-[var(--surface)]"
                />
              ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="h-64 animate-pulse rounded-3xl bg-[var(--surface)]" />
              <div className="h-64 animate-pulse rounded-3xl bg-[var(--surface)]" />
            </div>
          </div>
        ) : (
          <>
            {/* Metrics cards */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={<CircleDollarSign className="size-5" />}
                label="Bugungi tushum"
                value={formatMoney(stats.todayRevenue)}
                hint={`Oʻrtacha chek: ${formatMoney(stats.averageOrderValue)}`}
                trend={+8.2}
                color="accent"
              />
              <StatCard
                icon={<ClipboardList className="size-5" />}
                label="Faol buyurtmalar"
                value={String(stats.activeOrders)}
                hint={`Jami bugun: ${stats.todayOrders}`}
                color="blue"
              />
              <StatCard
                icon={<Armchair className="size-5" />}
                label="Band stollar"
                value={`${stats.occupiedTables}/${stats.totalTables}`}
                hint={`Bandlik: ${occupancyPct}%`}
                color="orange"
                extra={
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent)] transition-all duration-700"
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                }
              />
              <StatCard
                icon={<ArrowUpRight className="size-5" />}
                label="Stol aylanmasi"
                value={(
                  tables.reduce((s, t) => s + t.turnoverToday, 0) /
                  Math.max(tables.length, 1)
                ).toFixed(1)}
                hint="Oʻrtacha aylanish / stol"
                color="purple"
              />
            </section>

            {/* Charts row */}
            <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              {/* Revenue bar chart */}
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                      Soatlik tushum
                    </h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Bugungi savdo dinamikasi
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="size-3" />
                    +8.2%
                  </span>
                </div>
                <div className="mt-6 flex h-48 items-end gap-1.5">
                  {stats.revenueByHour.map((h) => (
                    <div
                      key={h.hour}
                      className="group flex flex-1 flex-col items-center gap-2"
                    >
                      <div
                        className="relative w-full rounded-t-lg bg-[var(--accent)]/60 transition duration-300 hover:bg-[var(--accent)] cursor-pointer"
                        style={{
                          height: `${Math.max(8, (h.amount / maxRevenue) * 100)}%`,
                        }}
                        title={formatMoney(h.amount)}
                      >
                        {/* Tooltip */}
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[var(--ink)] px-1.5 py-0.5 text-[0.6rem] text-[var(--bg)] opacity-0 transition group-hover:opacity-100 pointer-events-none">
                          {formatMoney(h.amount)}
                        </span>
                      </div>
                      <span className="text-[0.6rem] text-[var(--muted)]">
                        {h.hour.replace(":00", "")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top items */}
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6">
                <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                  Top taomlar
                </h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Eng ko&apos;p buyurtma qilingan
                </p>
                <ul className="mt-5 space-y-3">
                  {stats.topItems.map((item, idx) => {
                    const pct = Math.round((item.quantity / (stats.topItems[0]?.quantity || 1)) * 100);
                    return (
                      <li key={item.name} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="flex items-center gap-3 text-[var(--ink)]">
                            <span className="grid size-6 place-items-center rounded-lg bg-[var(--bg)] text-xs font-bold text-[var(--muted)]">
                              {idx + 1}
                            </span>
                            <span className="truncate">{item.name}</span>
                          </span>
                          <span className="shrink-0 text-xs font-semibold text-[var(--muted)]">
                            ×{item.quantity}
                          </span>
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
                          <div
                            className="h-full rounded-full bg-[var(--accent)]/70 transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>

            {/* Orders + Tables */}
            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Active orders table */}
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                    Faol buyurtmalar
                  </h2>
                  <span className="rounded-full bg-[var(--accent)]/15 px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]">
                    {orders.length}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[26rem] text-left text-sm">
                    <thead>
                      <tr className="border-b border-[var(--line)]">
                        <th className="pb-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                          Stol
                        </th>
                        <th className="pb-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                          Status
                        </th>
                        <th className="pb-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                          Vaqt
                        </th>
                        <th className="pb-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                          Summa
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]/60">
                      {orders.map((order) => (
                        <tr key={order.id} className="group">
                          <td className="py-3 font-semibold text-[var(--ink)]">
                            <span className="inline-flex size-8 items-center justify-center rounded-xl bg-[var(--bg)] text-sm">
                              #{order.tableNumber}
                            </span>
                          </td>
                          <td className="py-3">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="py-3 text-[var(--muted)]">
                            {formatTime(order.createdAt)}
                          </td>
                          <td className="py-3 font-medium text-[var(--ink)]">
                            {formatMoney(order.totalAmount)}
                          </td>
                        </tr>
                      ))}
                      {!orders.length && (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-10 text-center text-sm text-[var(--muted)]"
                          >
                            Faol buyurtma yo&apos;q
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table grid */}
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                    Stollar
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[var(--accent)]" />
                      Band
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[var(--line)]" />
                      Bo&apos;sh
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                  {tables.map((table) => (
                    <div
                      key={table.number}
                      className={`relative overflow-hidden rounded-2xl border p-3 transition ${
                        table.isOccupied
                          ? "border-[var(--accent)]/40 bg-[var(--accent)]/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                          : "border-[var(--line)] bg-[var(--bg)]"
                      }`}
                    >
                      {table.isOccupied && (
                        <div
                          aria-hidden
                          className="pointer-events-none absolute -right-3 -top-3 size-10 rounded-full bg-[var(--accent)]/20 blur-lg"
                        />
                      )}
                      <p className="text-[0.65rem] uppercase tracking-wide text-[var(--muted)]">
                        Stol {table.number}
                      </p>
                      <p
                        className={`mt-1 text-sm font-bold ${
                          table.isOccupied
                            ? "text-[var(--accent)]"
                            : "text-[var(--ink)]"
                        }`}
                      >
                        {table.isOccupied ? "Band" : "Bo\u02BBsh"}
                      </p>
                      <p className="mt-1 text-[0.6rem] text-[var(--muted)]">
                        ×{table.turnoverToday}
                      </p>
                      {table.isOccupied && table.currentOrderId && (
                        <p className="mt-1 truncate text-[0.6rem] font-medium text-[var(--accent-bright)]">
                          {statusLabel(
                            orders.find((o) => o.id === table.currentOrderId)
                              ?.status ?? "pending",
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

// ─── StatCard ────────────────────────────────────────────────────────────────

type CardColor = "accent" | "blue" | "orange" | "purple";

const colorMap: Record<
  CardColor,
  { icon: string; badge: string; value: string }
> = {
  accent: {
    icon: "bg-[var(--accent)]/15 text-[var(--accent)]",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    value: "text-[var(--ink)]",
  },
  blue: {
    icon: "bg-blue-500/15 text-blue-500 dark:text-blue-400",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    value: "text-[var(--ink)]",
  },
  orange: {
    icon: "bg-orange-500/15 text-orange-500 dark:text-orange-400",
    badge: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    value: "text-[var(--ink)]",
  },
  purple: {
    icon: "bg-purple-500/15 text-purple-500 dark:text-purple-400",
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    value: "text-[var(--ink)]",
  },
};

function StatCard({
  icon,
  label,
  value,
  hint,
  trend,
  color = "accent",
  extra,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
  trend?: number;
  color?: CardColor;
  extra?: ReactNode;
}) {
  const colors = colorMap[color];
  return (
    <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 transition hover:shadow-[0_4px_24px_-8px_rgba(0,0,0,0.12)]">
      <div className="flex items-start justify-between gap-2">
        <div
          className={`flex size-10 items-center justify-center rounded-xl ${colors.icon}`}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${colors.badge}`}
          >
            <TrendingUp className="size-3" />
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      <p className="mt-3 text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--ink)]">
        {value}
      </p>
      <p className="mt-1.5 text-xs text-[var(--muted)]">{hint}</p>
      {extra}
    </div>
  );
}
