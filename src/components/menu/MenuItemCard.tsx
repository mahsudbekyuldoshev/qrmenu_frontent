"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { formatMoney } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/Button";

interface MenuItemCardProps {
  item: MenuItem;
  layout?: "list" | "grid";
}

export function MenuItemCard({ item, layout = "list" }: MenuItemCardProps) {
  const cartItem = useCartStore((s) =>
    s.items.find((i) => i.menuItemId === item.id),
  );
  const addItem = useCartStore((s) => s.addItem);
  const setQuantity = useCartStore((s) => s.setQuantity);

  if (layout === "grid") {
    return (
      <article className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] transition hover:border-[var(--accent)]/30 hover:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.15)]">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-2)]">
          <Image
            src={item.imageUrl}
            alt={item.nameUz}
            fill
            sizes="(max-width: 640px) 50vw, 200px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          {!item.isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg)]/70 backdrop-blur-sm">
              <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                Mavjud emas
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-3">
          <h3 className="font-[family-name:var(--font-display)] text-sm leading-tight text-[var(--ink)] line-clamp-2">
            {item.nameUz}
          </h3>
          {item.descriptionUz && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">
              {item.descriptionUz}
            </p>
          )}
          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
            <span className="text-sm font-bold text-[var(--ink)]">
              {formatMoney(item.price)}
            </span>
            {!cartItem ? (
              <button
                type="button"
                disabled={!item.isAvailable}
                onClick={() => addItem(item)}
                className="grid size-8 place-items-center rounded-xl bg-[var(--accent)] text-[var(--accent-fg)] transition hover:brightness-110 active:scale-95 disabled:opacity-40"
                aria-label={`${item.nameUz} qo'shish`}
              >
                <Plus className="size-4" />
              </button>
            ) : (
              <div className="flex items-center gap-1 rounded-xl bg-[var(--surface-2)] p-0.5">
                <button
                  type="button"
                  aria-label="Kamaytirish"
                  className="grid size-6 place-items-center rounded-lg bg-[var(--bg)] text-[var(--ink)] transition hover:bg-[var(--surface-3)]"
                  onClick={() => setQuantity(item.id, cartItem.quantity - 1)}
                >
                  <Minus className="size-3" />
                </button>
                <span className="w-5 text-center text-xs font-bold text-[var(--ink)]">
                  {cartItem.quantity}
                </span>
                <button
                  type="button"
                  aria-label="Ko'paytirish"
                  className="grid size-6 place-items-center rounded-lg bg-[var(--accent)] text-[var(--accent-fg)] transition hover:brightness-110"
                  onClick={() => setQuantity(item.id, cartItem.quantity + 1)}
                >
                  <Plus className="size-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  // List layout (default)
  return (
    <article className="group grid grid-cols-[1fr_7.5rem] gap-4 py-4 last:border-0">
      <div className="flex min-w-0 flex-col">
        <h3 className="font-[family-name:var(--font-display)] text-lg leading-tight text-[var(--ink)]">
          {item.nameUz}
        </h3>
        {item.descriptionUz && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
            {item.descriptionUz}
          </p>
        )}
        {item.prepTimeMinutes > 0 && (
          <p className="mt-1.5 text-xs text-[var(--muted)]/70">
            ~{item.prepTimeMinutes} daqiqa
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="text-base font-bold text-[var(--ink)]">
            {formatMoney(item.price)}
          </span>
          {!cartItem ? (
            <Button
              size="sm"
              disabled={!item.isAvailable}
              onClick={() => addItem(item)}
              className="min-w-[5.5rem]"
            >
              <Plus className="size-4" />
              {item.isAvailable ? "Qo\u02BBshish" : "Mavjud emas"}
            </Button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-[var(--surface)] p-1">
              <button
                type="button"
                aria-label="Kamaytirish"
                className="grid size-8 place-items-center rounded-lg bg-[var(--bg)] text-[var(--ink)] transition hover:bg-[var(--surface-2)]"
                onClick={() => setQuantity(item.id, cartItem.quantity - 1)}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-6 text-center text-sm font-bold text-[var(--ink)]">
                {cartItem.quantity}
              </span>
              <button
                type="button"
                aria-label="Ko'paytirish"
                className="grid size-8 place-items-center rounded-lg bg-[var(--accent)] text-[var(--accent-fg)] transition hover:brightness-110"
                onClick={() => setQuantity(item.id, cartItem.quantity + 1)}
              >
                <Plus className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--surface)]">
        {!item.isAvailable && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg)]/60 backdrop-blur-sm">
            <span className="text-xs text-[var(--muted)]">Mavjud emas</span>
          </div>
        )}
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
