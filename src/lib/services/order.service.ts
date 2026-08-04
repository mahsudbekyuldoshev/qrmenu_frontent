import api from "../axios";
import type { Order, CreateOrderPayload, OrderStatus, CallWaiterPayload } from "../types";

export const orderService = {
  createOrder: (payload: CreateOrderPayload) => api.post<Order>("/orders/", payload),
  getOrders: (status?: OrderStatus | OrderStatus[]) => {
    const params = status ? { status: Array.isArray(status) ? status.join(",") : status } : {};
    return api.get<Order[]>("/orders/", { params });
  },
  updateStatus: (orderId: string | number, status: OrderStatus) => 
    api.patch<Order>(`/orders/${orderId}/`, { status }),

  // Waiter & KDS workflows
  getKitchenQueue: () => api.get<Order[]>("/kitchen/queue/"),
  getWaiterQueue: () => api.get<Order[]>("/waiter/queue/"),
  resolveWaiterCall: (callId: string | number) => api.post(`/waiter-calls/${callId}/resolve/`),
  
  // Public Order flow
  createPublicOrder: (qrHash: string, payload: any) => api.post(`/menu/${qrHash}/order/`, payload),
  callWaiter: (qrHash: string, payload: CallWaiterPayload) => api.post(`/menu/${qrHash}/call-waiter/`, payload),
  requestPayment: (qrHash: string) => api.post(`/menu/${qrHash}/request-payment/`),
};
