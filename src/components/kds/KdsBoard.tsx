"use client";

import { useState } from "react";
import { Radio, RefreshCw, LogOut, UserCircle } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { OrderTicket } from "./OrderTicket";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import type { OrderStatus } from "@/lib/types";
import { usePreferences } from "@/providers/PreferencesProvider";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";

const KITCHEN_STATUSES: OrderStatus[] = ["pending", "preparing"];

export function KdsBoard() {
  const { t } = usePreferences();
  const router = useRouter();
  const { orders, loading, error, connected, refresh, updateStatus } =
    useOrders(KITCHEN_STATUSES);
  const [busyId, setBusyId] = useState<string | number | null>(null);

  const pending = orders.filter((o) => o.status === "pending");
  const preparing = orders.filter((o) => o.status === "preparing");

  async function changeStatus(orderId: string | number, status: OrderStatus) {
    setBusyId(orderId);
    try {
      await updateStatus(orderId, status);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="kds-shell min-h-dvh">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--line)]/40 bg-[var(--kds-bg)]/80 px-4 py-3 backdrop-blur-md md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-bright)]">
              Kitchen Display
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)] md:text-3xl">
              {t.kdsPanel}
            </h1>
          </div>
          <div className="flex items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                connected
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-rose-500/15 text-rose-400"
              }`}
            >
              <Radio className="size-3.5" />
              {connected ? t.realTime : t.offline}
            </span>
            <Button variant="secondary" size="sm" onClick={() => void refresh()}>
              <RefreshCw className="size-3.5" />
              {t.update}
            </Button>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="p-2 text-[var(--muted)] hover:text-[var(--ink)]"
              title={t.profile}
            >
              <UserCircle className="size-4" />
            </button>
            <button onClick={() => {
                useAuthStore.getState().logout();
                window.location.href = "/login";
            }} className="p-2 text-[var(--muted)] hover:text-rose-500">
                <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 py-5 md:px-6">

        {error && (
          <p className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
            {error}
          </p>
        )}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-2xl bg-[var(--surface)]/20"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pending column */}
            <section>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  {t.newOrders}
                </h2>
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-400">
                  {pending.length}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {pending.map((order) => (
                  <OrderTicket
                    key={order.id}
                    order={order}
                    mode="kitchen"
                    busy={busyId === order.id}
                    onStatusChange={(status) =>
                      void changeStatus(order.id, status)
                    }
                  />
                ))}
                {!pending.length && (
                  <p className="col-span-full rounded-2xl border border-dashed border-[var(--line)]/50 px-4 py-12 text-center text-sm text-[var(--muted)]">
                    {t.noNewOrders}
                  </p>
                )}
              </div>
            </section>

            {/* Preparing column */}
            <section>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  {t.preparing}
                </h2>
                <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-bold text-blue-400">
                  {preparing.length}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {preparing.map((order) => (
                  <OrderTicket
                    key={order.id}
                    order={order}
                    mode="kitchen"
                    busy={busyId === order.id}
                    onStatusChange={(status) =>
                      void changeStatus(order.id, status)
                    }
                  />
                ))}
                {!preparing.length && (
                  <p className="col-span-full rounded-2xl border border-dashed border-[var(--line)]/50 px-4 py-12 text-center text-sm text-[var(--muted)]">
                    {t.noPreparingOrders}
                  </p>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
