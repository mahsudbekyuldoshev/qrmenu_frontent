"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Armchair,
  ArrowUpRight,
  CircleDollarSign,
  ClipboardList,
  Radio,
} from "lucide-react";
import { api } from "@/lib/api";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { DashboardStats, Order, TableStatus, WsEvent } from "@/lib/types";
import { formatMoney, formatTime, statusLabel } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";

export function DirectorDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<TableStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

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

  return (
    <div className="director-shell min-h-dvh">
      <header className="border-b border-[var(--line)] bg-[var(--bg)]/80 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
              RestoFlow
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
              Direktor paneli
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                connected
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              <Radio className="size-3.5" />
              {connected ? "Real-time" : "Offline"}
            </span>
            <Link
              href="/kds"
              className="text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)]"
            >
              KDS
            </Link>
            <Link
              href="/waiter"
              className="text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)]"
            >
              Ofitsiant
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        {loading || !stats ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl bg-[var(--surface)]"
              />
            ))}
          </div>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={<CircleDollarSign className="size-5" />}
                label="Bugungi tushum"
                value={formatMoney(stats.todayRevenue)}
                hint={`Oʻrtacha chek: ${formatMoney(stats.averageOrderValue)}`}
              />
              <StatCard
                icon={<ClipboardList className="size-5" />}
                label="Faol buyurtmalar"
                value={String(stats.activeOrders)}
                hint={`Jami bugun: ${stats.todayOrders}`}
              />
              <StatCard
                icon={<Armchair className="size-5" />}
                label="Band stollar"
                value={`${stats.occupiedTables}/${stats.totalTables}`}
                hint="Hozirgi bandlik"
              />
              <StatCard
                icon={<ArrowUpRight className="size-5" />}
                label="Stol aylanmasi"
                value={(
                  tables.reduce((s, t) => s + t.turnoverToday, 0) /
                  Math.max(tables.length, 1)
                ).toFixed(1)}
                hint="Oʻrtacha aylanish / stol"
              />
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5">
                <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                  Soatlik tushum
                </h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Bugungi savdo dinamikasi
                </p>
                <div className="mt-6 flex h-48 items-end gap-2">
                  {stats.revenueByHour.map((h) => (
                    <div
                      key={h.hour}
                      className="flex flex-1 flex-col items-center gap-2"
                    >
                      <div
                        className="w-full rounded-t-lg bg-[var(--accent)]/85 transition hover:bg-[var(--accent)]"
                        style={{
                          height: `${Math.max(8, (h.amount / maxRevenue) * 100)}%`,
                        }}
                        title={formatMoney(h.amount)}
                      />
                      <span className="text-[0.65rem] text-[var(--muted)]">
                        {h.hour.replace(":00", "")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5">
                <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                  Top taomlar
                </h2>
                <ul className="mt-4 space-y-3">
                  {stats.topItems.map((item, idx) => (
                    <li
                      key={item.name}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="flex items-center gap-3 text-[var(--ink)]">
                        <span className="grid size-7 place-items-center rounded-lg bg-[var(--bg)] text-xs font-bold text-[var(--muted)]">
                          {idx + 1}
                        </span>
                        {item.name}
                      </span>
                      <span className="text-[var(--muted)]">
                        ×{item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--bg)] p-5">
                <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                  Faol buyurtmalar
                </h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[28rem] text-left text-sm">
                    <thead className="text-[var(--muted)]">
                      <tr className="border-b border-[var(--line)]">
                        <th className="pb-2 font-medium">Stol</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium">Vaqt</th>
                        <th className="pb-2 font-medium">Summa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-[var(--line)]/70"
                        >
                          <td className="py-3 font-semibold text-[var(--ink)]">
                            #{order.tableNumber}
                          </td>
                          <td className="py-3">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="py-3 text-[var(--muted)]">
                            {formatTime(order.createdAt)}
                          </td>
                          <td className="py-3 text-[var(--ink)]">
                            {formatMoney(order.totalAmount)}
                          </td>
                        </tr>
                      ))}
                      {!orders.length && (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-8 text-center text-[var(--muted)]"
                          >
                            Faol buyurtma yoʻq
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--line)] bg-[var(--bg)] p-5">
                <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                  Stollar aylanmasi
                </h2>
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {tables.map((table) => (
                    <div
                      key={table.number}
                      className={`rounded-2xl border px-3 py-3 ${
                        table.isOccupied
                          ? "border-[var(--accent)]/40 bg-[var(--accent)]/10"
                          : "border-[var(--line)] bg-[var(--surface)]"
                      }`}
                    >
                      <p className="text-xs text-[var(--muted)]">
                        Stol {table.number}
                      </p>
                      <p className="mt-1 font-semibold text-[var(--ink)]">
                        {table.isOccupied ? "Band" : "Bo'sh"}
                      </p>
                      <p className="mt-1 text-[0.7rem] text-[var(--muted)]">
                        Aylanish: {table.turnoverToday}×
                      </p>
                      {table.isOccupied && table.currentOrderId && (
                        <p className="mt-1 truncate text-[0.65rem] text-[var(--accent)]">
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

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5">
      <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-[var(--bg)] text-[var(--accent)]">
        {icon}
      </div>
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--ink)]">
        {value}
      </p>
      <p className="mt-2 text-xs text-[var(--muted)]">{hint}</p>
    </div>
  );
}
