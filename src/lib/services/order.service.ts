import api from "../axios";
import type { Order, OrderStatus } from "../types";

export interface CreateOrderBackendPayload {
  table: number;                               // table ID (not number)
  uploaded_items: { dish: number; quantity: number }[];
  comment?: string;
}

export const orderService = {
  /**
   * POST /orders/
   * Staff (manager/director) tomonidan yangi buyurtma yaratish.
   * Backend payload: { table, uploaded_items: [{dish, quantity}], comment }
   */
  createOrder: (payload: CreateOrderBackendPayload) =>
    api.post<Order>("/orders/", payload),

  /**
   * GET /orders/?status=pending,preparing
   * Statuslar bo'yicha filter qo'llab-quvvatlanadi (vergul bilan ajratilgan).
   */
  getOrders: (status?: OrderStatus | OrderStatus[]) => {
    const params = status
      ? { status: Array.isArray(status) ? status.join(",") : status }
      : {};
    return api.get<Order[]>("/orders/", { params });
  },

  /**
   * PATCH /orders/{id}/  body: { status }
   * Buyurtma statusini yangilash (director/manager har qanday, chef/waiter cheklangan).
   */
  updateStatus: (orderId: string | number, status: OrderStatus) =>
    api.patch<Order>(`/orders/${orderId}/`, { status }),

  // ─── KDS ──────────────────────────────────────────────────────────────────

  /**
   * GET /kitchen/queue/
   * Oshpaz (KDS) ekrani: requires_kitchen=True bo'lgan PENDING/PREPARING itemlar.
   */
  getKitchenQueue: () => api.get<Order[]>("/kitchen/queue/"),

  // ─── Waiter ───────────────────────────────────────────────────────────────

  /**
   * GET /waiter/queue/
   * Ofitsiant ekrani: tayyor itemlar + hal qilinmagan chaqiruvlar.
   * Javob: { ready_items: OrderItem[], calls: WaiterCall[] }
   */
  getWaiterQueue: () =>
    api.get<{ ready_items: unknown[]; calls: unknown[] }>("/waiter/queue/"),

  /**
   * PATCH /order-items/{id}/status/  body: { status }
   * Chef: pending/preparing → ready
   * Waiter: ready → delivered
   * Director/Manager: istalgan o'tish
   */
  updateItemStatus: (itemId: number, status: string) =>
    api.patch(`/order-items/${itemId}/status/`, { status }),

  /**
   * POST /waiter-calls/{id}/resolve/
   * Ofitsiant chaqiruvini hal qilindi deb belgilash.
   */
  resolveWaiterCall: (callId: string | number) =>
    api.post(`/waiter-calls/${callId}/resolve/`),

  // ─── Public (QR-menu) ─────────────────────────────────────────────────────

  /** POST /menu/{qrHash}/order/ — mijoz (autentifikatsiyasiz) buyurtma beradi */
  createPublicOrder: (qrHash: string, payload: unknown) =>
    api.post(`/menu/${qrHash}/order/`, payload),

  /** POST /menu/{qrHash}/call-waiter/ — ofitsiantni chaqirish */
  callWaiter: (qrHash: string, payload: { reason?: string }) =>
    api.post(`/menu/${qrHash}/call-waiter/`, payload),

  /** POST /menu/{qrHash}/request-payment/ — hisob so'rash */
  requestPayment: (qrHash: string) =>
    api.post(`/menu/${qrHash}/request-payment/`),
};
