"use client";

import { useState } from "react";
import { Bell, CheckCircle2, DollarSign, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { orderService } from "@/lib/services/order.service";
import { formatMoney } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/Button";

export function CartDrawer({ tableNumber }: { tableNumber: number }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [calling, setCalling] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const clear = useCartStore((s) => s.clear);
  const total = useCartStore((s) => s.total());
  const count = useCartStore((s) => s.count());

  async function placeOrder() {
    if (!items.length) return;
    setSubmitting(true);
    setSuccess(null);
    try {
      await orderService.createOrder({
        table: tableNumber,
        uploaded_items: items.map((i) => ({
          dish: Number(i.menuItemId),
          quantity: i.quantity,
        })),
      });
      clear();
      setSuccess("Buyurtma qabul qilindi! Oshxona tayyorlayapti.");
    } catch (e) {
      setSuccess(e instanceof Error ? e.message : "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  }

  async function callWaiter(reason: string = "Mijoz chaqirdi") {
    setCalling(true);
    try {
      await orderService.callWaiter(String(tableNumber), { reason });
      setSuccess(reason === "bill_request" ? "To'lov so'rovi yuborildi." : "Ofitsiant chaqirildi. Tez orada keladi.");
      setOpen(true);
    } catch (e) {
      setSuccess(e instanceof Error ? e.message : "Chaqiruv yuborilmadi");
      setOpen(true);
    } finally {
      setCalling(false);
    }
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-lg justify-between gap-2 p-4">
        <Button
          variant="secondary"
          className="pointer-events-auto shadow-lg"
          onClick={() => void callWaiter("bill_request")}
          disabled={calling}
        >
          <DollarSign className="size-4 mr-2" />
          To&apos;lov
        </Button>
        <Button
          variant="secondary"
          className="pointer-events-auto shadow-lg"
          onClick={() => void callWaiter()}
          disabled={calling}
        >
          <Bell className="size-4 mr-2" />
          Ofitsiant
        </Button>
        <Button
          className="pointer-events-auto min-w-[10rem] shadow-lg"
          onClick={() => setOpen(true)}
        >
          <ShoppingBag className="size-4" />
          Savat {count > 0 ? `(${count})` : ""}
        </Button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Yopish"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 flex max-h-[88vh] w-full max-w-lg flex-col rounded-t-3xl bg-[var(--bg)] shadow-2xl sm:rounded-3xl">
            <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Stol #{tableNumber}
                </p>
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
                  Savat
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-10 place-items-center rounded-full bg-[var(--surface)]"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {success && (
                <div className="mb-4 flex items-start gap-2 rounded-2xl border border-[#abefc6] bg-[#ecfdf3] px-4 py-3 text-sm text-[#067647]">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                  <p>{success}</p>
                </div>
              )}

              {!items.length ? (
                <p className="py-10 text-center text-[var(--muted)]">
                  Savat boʻsh. Menyudan taom tanlang.
                </p>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.menuItemId}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[var(--ink)]">
                          {item.nameUz || item.name}
                        </p>
                        <p className="text-sm text-[var(--muted)]">
                          {formatMoney(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="grid size-8 place-items-center rounded-lg bg-[var(--surface)]"
                          onClick={() =>
                            setQuantity(item.menuItemId, item.quantity - 1)
                          }
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="grid size-8 place-items-center rounded-lg bg-[var(--ink)] text-[var(--bg)]"
                          onClick={() =>
                            setQuantity(item.menuItemId, item.quantity + 1)
                          }
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-[var(--line)] px-5 py-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-[var(--muted)]">Jami</span>
                <span className="text-lg font-semibold text-[var(--ink)]">
                  {formatMoney(total)}
                </span>
              </div>
              <Button
                className="w-full"
                size="lg"
                disabled={!items.length || submitting}
                onClick={() => void placeOrder()}
              >
                {submitting ? "Yuborilmoqda..." : "Buyurtma berish"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
