"use client";

import { useState } from "react";
import { Radio, RefreshCw } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { OrderTicket } from "./OrderTicket";
import { Button } from "@/components/ui/Button";
import type { OrderStatus } from "@/lib/types";

const KITCHEN_STATUSES: OrderStatus[] = ["pending", "preparing"];

export function KdsBoard() {
  const { orders, loading, error, connected, refresh, updateStatus } =
    useOrders(KITCHEN_STATUSES);
  const [busyId, setBusyId] = useState<string | null>(null);

  const pending = orders.filter((o) => o.status === "pending");
  const preparing = orders.filter((o) => o.status === "preparing");

  async function changeStatus(orderId: string, status: OrderStatus) {
    setBusyId(orderId);
    try {
      await updateStatus(orderId, status);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="kds-shell min-h-dvh px-4 py-5 md:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-bright)]">
            Kitchen Display
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">
            Oshxona ekrani
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

      {error && (
        <p className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl bg-white/5"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/50">
              Yangi ({pending.length})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
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
                <p className="col-span-full rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-white/40">
                  Yangi buyurtma yoʻq
                </p>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/50">
              Tayyorlanmoqda ({preparing.length})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
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
                <p className="col-span-full rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-white/40">
                  Hozircha tayyorlanayotgan buyurtma yoʻq
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
