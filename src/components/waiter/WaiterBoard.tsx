"use client";

import { useEffect, useState } from "react";
import { BellRing, Radio, RefreshCw, X } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { useWebSocket } from "@/hooks/useWebSocket";
import { OrderTicket } from "@/components/kds/OrderTicket";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import type { OrderStatus, WsEvent } from "@/lib/types";
import { usePreferences } from "@/providers/PreferencesProvider";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";

const WAITER_STATUSES: OrderStatus[] = ["ready"];

interface WaiterCall {
  tableNumber: number;
  reason?: string;
  createdAt: string;
}

export function WaiterBoard() {
  const { t } = usePreferences();
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "waiter" && user.role !== "director") {
      router.replace("/login/email");
    }
  }, [user, router]);

  const { orders, loading, error, connected, refresh, updateStatus } =
    useOrders(WAITER_STATUSES);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [calls, setCalls] = useState<WaiterCall[]>([]);

  useWebSocket({
    onEvent: (event: WsEvent) => {
      if (event.type === "waiter.called") {
        const payload = event.payload as WaiterCall;
        setCalls((prev) => [payload, ...prev].slice(0, 8));
      }
    },
  });

  useEffect(() => {
    if (!calls.length) return;
    const timer = setTimeout(() => {
      setCalls((prev) => prev.slice(0, -1));
    }, 20000);
    return () => clearTimeout(timer);
  }, [calls]);

  async function markDelivered(orderId: string) {
    setBusyId(orderId);
    try {
      await updateStatus(orderId, "delivered");
    } finally {
      setBusyId(null);
    }
  }

  function dismissCall(idx: number) {
    setCalls((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <div className="kds-shell min-h-dvh">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 border-b border-[var(--line)]/40 bg-[var(--kds-bg)]/80 px-4 py-3 backdrop-blur-md md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-bright)]">
              Waiter Station
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)] md:text-3xl">
              {t.waiterPanel}
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
          </div>
        </div>
      </header>


      <div className="px-4 py-5 md:px-6">
        {/* Waiter call alerts */}
        {calls.length > 0 && (
          <div className="mb-5 space-y-2">
            {calls.map((call, idx) => (
              <div
                key={`${call.tableNumber}-${call.createdAt}-${idx}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 animate-fade-up"
              >
                <div className="flex items-center gap-3 text-amber-300">
                  <BellRing className="size-5 shrink-0 animate-pulse-soft" />
                  <div>
                    <p className="font-semibold text-[var(--ink)]">
                      {t.table} {call.tableNumber} — {t.waiterPanel}
                    </p>
                    <p className="text-sm text-[var(--muted)]">
                      {call.reason ?? "Mijoz yordam so'radi"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Yopish"
                  onClick={() => dismissCall(idx)}
                  className="grid size-7 shrink-0 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--ink)]"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
            {error}
          </p>
        )}

        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            {t.ready}
          </h2>
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
            {orders.length}
          </span>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-2xl bg-[var(--surface)]/20"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {orders.map((order) => (
              <OrderTicket
                key={order.id}
                order={order}
                mode="waiter"
                busy={busyId === order.id}
                onStatusChange={() => void markDelivered(order.id)}
              />
            ))}
            {!orders.length && (
              <p className="col-span-full rounded-2xl border border-dashed border-[var(--line)]/50 px-4 py-16 text-center text-sm text-[var(--muted)]">
                {t.noPreparingOrders}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
