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
        const idx = items.findIndex((i) => i.menuItemId === item.id);
        if (idx >= 0) {
          items[idx] = {
            ...items[idx],
            quantity: items[idx].quantity + quantity,
          };
        } else {
          items.push({
            menuItemId: item.id,
            name: item.name,
            nameUz: item.nameUz,
            price: item.price,
            quantity,
          });
        }
        set({ items });
      },

      removeItem: (menuItemId) =>
        set({ items: get().items.filter((i) => i.menuItemId !== menuItemId) }),

      setQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.menuItemId === menuItemId ? { ...i, quantity } : i,
          ),
        });
      },

      clear: () => set({ items: [] }),

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "restoflow-cart" },
  ),
);
