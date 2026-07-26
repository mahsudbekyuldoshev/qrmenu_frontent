"use client";

import { ChefHat, Clock } from "lucide-react";
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
          ? "border-[#f97066] bg-[#2a1512]"
          : "border-white/10 bg-[#161b22]"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl text-white">
            Stol {order.tableNumber}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-white/55">
            <Clock className="size-3.5" />
            {formatTime(order.createdAt)} · {mins} daqiqa
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <ul className="mb-4 space-y-2 border-y border-white/10 py-3">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-3 text-sm">
            <span className="text-white/90">
              <span className="mr-2 inline-grid size-6 place-items-center rounded-md bg-white/10 text-xs font-bold text-[var(--accent-bright)]">
                {item.quantity}
              </span>
              {item.nameUz}
            </span>
            <span className="shrink-0 text-white/40">
              {formatMoney(item.unitPrice * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-2">
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
            Tayyor
          </Button>
        )}
        {mode === "waiter" && order.status === "ready" && (
          <Button
            variant="success"
            disabled={busy}
            onClick={() => onStatusChange("delivered")}
          >
            Yetkazildi
          </Button>
        )}
      </div>
    </article>
  );
}
