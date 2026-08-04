"use client";

import { useCallback, useEffect, useState } from "react";
import { orderService } from "@/lib/services/order.service";
import type { Order, OrderStatus, WsEvent } from "@/lib/types";
import { useWebSocket } from "./useWebSocket";

export function useOrders(filterStatuses?: OrderStatus[]) {
  const statusKey = filterStatuses?.slice().sort().join(",") ?? "all";
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchOrders() {
      try {
        const statuses =
          statusKey === "all"
            ? undefined
            : (statusKey.split(",") as OrderStatus[]);
        const res = await orderService.getOrders(statuses);
        if (cancelled) return;
        setOrders(res.data);
        setError(null);
      } catch (e) {
        if (cancelled) return;
        setError(
          e instanceof Error ? e.message : "Buyurtmalarni yuklashda xato",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchOrders();
    return () => {
      cancelled = true;
    };
  }, [statusKey, reloadToken]);

  const refresh = useCallback(() => {
    setLoading(true);
    setReloadToken((n) => n + 1);
  }, []);

  const onEvent = useCallback((event: WsEvent) => {
    if (
      event.type === "order.created" ||
      event.type === "order.updated" ||
      event.type === "order.status_changed"
    ) {
      setReloadToken((n) => n + 1);
    }
  }, []);

  const { connected } = useWebSocket({ onEvent });

  const updateStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      const res = await orderService.updateStatus(orderId, status);
      const updated = res.data;
      setOrders((prev) => {
        const next = prev.map((o) => (String(o.id) === String(orderId) ? updated : o));
        if (statusKey === "all") return next;
        const allowed = statusKey.split(",") as OrderStatus[];
        return next.filter((o) => allowed.includes(o.status));
      });
      return updated;
    },
    [statusKey],
  );

  return { orders, loading, error, connected, refresh, updateStatus };
}
