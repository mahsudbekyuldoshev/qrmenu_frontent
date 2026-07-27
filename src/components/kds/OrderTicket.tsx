"use client";

import { ChefHat, Clock, Loader2 } from "lucide-react";
import type { Order } from "@/lib/types";
import { elapsedMinutes, formatMoney, formatTime } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function OrderTicket({
  order,
  mode,
  onStatusChange,
  busy,
}: {
  order: Order;
  mode: "kitchen" | "waiter";
  onStatusChange: (status: Order["status"]) => void;
  busy?: boolean;
}) {
  const mins = elapsedMinutes(order.createdAt);
  const urgent = mins >= 15;

  return (
    <article
      className={`flex flex-col rounded-2xl border p-4 transition ${
        urgent
          ? "border-rose-500/40 bg-[var(--status-cancelled-bg)]"
          : "border-[var(--line)] bg-[var(--surface)]"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            Stol {order.tableNumber}
          </p>
          <p
            className={`mt-1 flex items-center gap-1.5 text-xs ${
              urgent ? "font-semibold text-rose-500 dark:text-rose-400" : "text-[var(--muted)]"
            }`}
          >
            <Clock className="size-3.5" />
            {formatTime(order.createdAt)} · {mins} daqiqa
            {urgent && " ⚠"}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <ul className="mb-4 space-y-2 border-y border-[var(--line)] py-3">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-3 text-sm">
            <span className="text-[var(--ink)]">
              <span className="mr-2 inline-grid size-6 place-items-center rounded-md bg-[var(--accent)]/15 text-xs font-bold text-[var(--accent)]">
                {item.quantity}
              </span>
              {item.nameUz}
            </span>
            <span className="shrink-0 text-[var(--muted)]">
              {formatMoney(item.unitPrice * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      {order.notes && (
        <p className="mb-3 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
          📝 {order.notes}
        </p>
      )}

      <div className="mt-auto flex flex-col gap-2">
        {busy ? (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-[var(--surface-2)] py-2.5 text-sm text-[var(--muted)]">
            <Loader2 className="size-4 animate-spin" />
            Yangilanmoqda…
          </div>
        ) : (
          <>
            {mode === "kitchen" && order.status === "pending" && (
              <Button
                variant="warn"
                disabled={busy}
                onClick={() => onStatusChange("preparing")}
              >
                <ChefHat className="size-4" />
                Tayyorlanmoqda
              </Button>
            )}
            {mode === "kitchen" && order.status === "preparing" && (
              <Button
                variant="success"
                disabled={busy}
                onClick={() => onStatusChange("ready")}
              >
                ✓ Tayyor
              </Button>
            )}
            {mode === "waiter" && order.status === "ready" && (
              <Button
                variant="success"
                disabled={busy}
                onClick={() => onStatusChange("delivered")}
              >
                ✓ Yetkazildi
              </Button>
            )}
          </>
        )}
      </div>
    </article>
  );
}
