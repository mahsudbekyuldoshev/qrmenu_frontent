"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { formatMoney } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/Button";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const cartItem = useCartStore((s) =>
    s.items.find((i) => i.menuItemId === item.id),
  );
  const addItem = useCartStore((s) => s.addItem);
  const setQuantity = useCartStore((s) => s.setQuantity);

  return (
    <article className="group grid grid-cols-[1fr_7.5rem] gap-3 border-b border-[var(--line)] py-4 last:border-0">
      <div className="flex min-w-0 flex-col">
        <h3 className="font-[family-name:var(--font-display)] text-lg leading-tight text-[var(--ink)]">
          {item.nameUz}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
          {item.descriptionUz}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="text-base font-semibold text-[var(--ink)]">
            {formatMoney(item.price)}
          </span>
          {!cartItem ? (
            <Button
              size="sm"
              onClick={() => addItem(item)}
              className="min-w-[5.5rem]"
            >
              <Plus className="size-4" />
              Qoʻshish
            </Button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-[var(--surface)] p-1">
              <button
                type="button"
                aria-label="Kamaytirish"
                className="grid size-8 place-items-center rounded-lg bg-[var(--bg)] text-[var(--ink)]"
                onClick={() => setQuantity(item.id, cartItem.quantity - 1)}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-6 text-center text-sm font-semibold">
                {cartItem.quantity}
              </span>
              <button
                type="button"
                aria-label="Ko'paytirish"
                className="grid size-8 place-items-center rounded-lg bg-[var(--ink)] text-[var(--bg)]"
                onClick={() => setQuantity(item.id, cartItem.quantity + 1)}
              >
                <Plus className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--surface)]">
        <Image
          src={item.imageUrl}
          alt={item.nameUz}
          fill
          sizes="120px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
    </article>
  );
}
