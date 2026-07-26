import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { OrderStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(amount: number, currency = "UZS"): string {
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function elapsedMinutes(iso: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
}

export function statusLabel(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    pending: "Yangi",
    preparing: "Tayyorlanmoqda",
    ready: "Tayyor",
    delivered: "Yetkazildi",
    cancelled: "Bekor",
  };
  return map[status];
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
