"use client";

import { useEffect, useState } from "react";
import { BellRing, Radio, RefreshCw } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { useWebSocket } from "@/hooks/useWebSocket";
import { OrderTicket } from "@/components/kds/OrderTicket";
import { Button } from "@/components/ui/Button";
import type { OrderStatus, WsEvent } from "@/lib/types";

const WAITER_STATUSES: OrderStatus[] = ["ready"];

interface WaiterCall {
  tableNumber: number;
  reason?: string;
  createdAt: string;
}

export function WaiterBoard() {
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

  return (
    <div className="kds-shell min-h-dvh px-4 py-5 md:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-bright)]">
            Waiter Station
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">
            Ofitsiant ekrani
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
              connected
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-rose-500/15 text-rose-300"
            }`}
          >
            <Radio className="size-3.5" />
            {connected ? "Jonli" : "Ulanmagan"}
          </span>
          <Button variant="secondary" size="sm" onClick={() => void refresh()}>
            <RefreshCw className="size-3.5" />
            Yangilash
          </Button>
        </div>
      </header>

      {calls.length > 0 && (
        <div className="mb-5 space-y-2">
          {calls.map((call, idx) => (
            <div
              key={`${call.tableNumber}-${call.createdAt}-${idx}`}
              className="flex items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-amber-100 animate-fade-up"
            >
              <BellRing className="size-5 shrink-0" />
              <div>
                <p className="font-semibold">
                  Stol {call.tableNumber} — ofitsiant chaqirildi
                </p>
                <p className="text-sm text-amber-100/70">
                  {call.reason ?? "Mijoz yordam so'radi"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/50">
        Yetkazishga tayyor ({orders.length})
      </h2>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl bg-white/5"
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
            <p className="col-span-full rounded-2xl border border-dashed border-white/10 px-4 py-12 text-center text-white/40">
              Tayyor buyurtmalar yoʻq. Oshxona tayyorlaganda shu yerda chiqadi.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
