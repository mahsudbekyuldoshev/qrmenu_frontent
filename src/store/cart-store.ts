"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, MenuItem } from "@/lib/types";

interface CartState {
  tableNumber: number | null;
  items: CartItem[];
  setTable: (tableNumber: number) => void;
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (menuItemId: string) => void;
  setQuantity: (menuItemId: string, quantity: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      tableNumber: null,
      items: [],

      setTable: (tableNumber) => set({ tableNumber }),

      addItem: (item, quantity = 1) => {
        const items = [...get().items];
        const itemId = String(item.id);
        const idx = items.findIndex((i) => i.menuItemId === itemId);
        if (idx >= 0) {
          items[idx] = {
            ...items[idx],
            quantity: items[idx].quantity + quantity,
          };
        } else {
          items.push({
            menuItemId: itemId,
            name: item.name || item.nameUz || "",
            nameUz: item.nameUz || item.name || "",
            price: Number(item.price) || 0,
            quantity,
          });
        }
        set({ items });
      },

      removeItem: (menuItemId) =>
        set({ items: get().items.filter((i) => i.menuItemId !== String(menuItemId)) }),

      setQuantity: (menuItemId, quantity) => {
        const idStr = String(menuItemId);
        if (quantity <= 0) {
          get().removeItem(idStr);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.menuItemId === idStr ? { ...i, quantity } : i,
          ),
        });
      },

      clear: () => set({ items: [] }),

      total: () =>
        get().items.reduce((sum, i) => sum + (Number(i.price) || 0) * i.quantity, 0),

      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "restoflow-cart" },
  ),
);
