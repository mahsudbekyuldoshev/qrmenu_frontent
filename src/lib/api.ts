import {
  categories,
  menuItems,
  mockOrders,
  mockTables,
  rebuildDashboardStats,
  setMockOrders,
} from "./mock-data";
import type {
  AuthResponse,
  CallWaiterPayload,
  CreateOrderPayload,
  DashboardStats,
  LoginPayload,
  MenuItem,
  Order,
  OrderStatus,
  RegisterPayload,
  StaffRole,
  TableStatus,
  Category,
  User,
} from "./types";
import { uid } from "./utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

type MockAccount = User & { password: string };

const mockAccounts: MockAccount[] = [
  {
    id: "usr_demo_dir",
    email: "901234567@restoflow.uz",
    password: "demo1234",
    fullName: "Aziza Karimova",
    restaurantName: "RestoFlow Demo",
    role: "director",
  },
  {
    id: "usr_demo_kit",
    email: "907654321@restoflow.uz",
    password: "demo1234",
    fullName: "Jasur Aliyev",
    restaurantName: "RestoFlow Demo",
    role: "kitchen",
  },
  {
    id: "usr_demo_wai",
    email: "900001122@restoflow.uz",
    password: "demo1234",
    fullName: "Madina Yusupova",
    restaurantName: "RestoFlow Demo",
    role: "waiter",
  },
  {
    id: "usr_demo_man",
    email: "901112233@restoflow.uz",
    password: "demo1234",
    fullName: "Manager User",
    restaurantName: "RestoFlow Demo",
    role: "manager",
  },
  {
    id: "usr_demo_sa",
    email: "909998877@restoflow.uz",
    password: "demo1234",
    fullName: "Super Admin",
    restaurantName: "RestoFlow Demo",
    role: "super-admin",
  },
];

function toAuthResponse(user: User): AuthResponse {
  return {
    access: `mock_access_${user.id}`,
    refresh: `mock_refresh_${user.id}`,
    user,
  };
}

function stripPassword(account: MockAccount): User {
  const { password: _password, ...user } = account;
  void _password;
  return user;
}

function parseApiError(text: string, status: number): Error {
  try {
    const data = JSON.parse(text) as Record<string, unknown>;
    const detail =
      (typeof data.detail === "string" && data.detail) ||
      (typeof data.message === "string" && data.message) ||
      (typeof data.error === "string" && data.error);
    if (detail) return new Error(detail);
    const first = Object.values(data).find(
      (v) => typeof v === "string" || Array.isArray(v),
    );
    if (typeof first === "string") return new Error(first);
    if (Array.isArray(first) && typeof first[0] === "string") {
      return new Error(first[0]);
    }
  } catch {
    /* plain text */
  }
  return new Error(text || `API error ${status}`);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw parseApiError(text, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function delay(ms = 280) {
  return new Promise((r) => setTimeout(r, ms));
}

export const api = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    if (USE_MOCK) {
      await delay(350);
      const email = payload.email.trim().toLowerCase();
      const account = mockAccounts.find((a) => a.email === email);
      if (!account || account.password !== payload.password) {
        throw new Error("Email yoki parol noto‘g‘ri");
      }
      return toAuthResponse(stripPassword(account));
    }
    return request<AuthResponse>("/auth/login/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (USE_MOCK) {
      await delay(450);
      const email = payload.email.trim().toLowerCase();
      if (mockAccounts.some((a) => a.email === email)) {
        throw new Error("Bu email allaqachon ro‘yxatdan o‘tgan");
      }
      if (payload.password.length < 6) {
        throw new Error("Parol kamida 6 ta belgidan iborat bo‘lsin");
      }
      const roles: StaffRole[] = ["director", "waiter", "kitchen"];
      if (!roles.includes(payload.role)) {
        throw new Error("Noto‘g‘ri rol tanlandi");
      }
      const account: MockAccount = {
        id: uid("usr"),
        email,
        password: payload.password,
        fullName: payload.fullName.trim(),
        restaurantName: payload.restaurantName.trim(),
        role: payload.role,
      };
      mockAccounts.push(account);
      return toAuthResponse(stripPassword(account));
    }
    return request<AuthResponse>("/auth/register/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getCategories(): Promise<Category[]> {
    if (USE_MOCK) {
      await delay();
      return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return request<Category[]>("/categories/");
  },

  async getMenu(tableNumber?: number): Promise<MenuItem[]> {
    if (USE_MOCK) {
      await delay();
      void tableNumber;
      return menuItems.filter((m) => m.isAvailable);
    }
    const q = tableNumber ? `?table=${tableNumber}` : "";
    return request<MenuItem[]>(`/menu/${q}`);
  },

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    if (USE_MOCK) {
      await delay(400);
      const items = payload.items.map((line) => {
        const menu = menuItems.find((m) => m.id === line.menuItemId);
        if (!menu) throw new Error(`Menu item not found: ${line.menuItemId}`);
        return {
          id: uid("oi"),
          menuItemId: menu.id,
          name: menu.name,
          nameUz: menu.nameUz,
          quantity: line.quantity,
          unitPrice: menu.price,
          note: line.note,
        };
      });
      const order: Order = {
        id: uid("ord"),
        tableNumber: payload.tableNumber,
        status: "pending",
        items,
        totalAmount: items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: payload.notes,
      };
      setMockOrders([order, ...mockOrders]);
      emitLocal("order.created", order);
      return order;
    }
    return request<Order>("/orders/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getOrders(params?: {
    status?: OrderStatus | OrderStatus[];
  }): Promise<Order[]> {
    if (USE_MOCK) {
      await delay();
      let list = [...mockOrders];
      if (params?.status) {
        const statuses = Array.isArray(params.status)
          ? params.status
          : [params.status];
        list = list.filter((o) => statuses.includes(o.status));
      }
      return list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
    const search = new URLSearchParams();
    if (params?.status) {
      const statuses = Array.isArray(params.status)
        ? params.status
        : [params.status];
      search.set("status", statuses.join(","));
    }
    const q = search.toString() ? `?${search}` : "";
    return request<Order[]>(`/orders/${q}`);
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    if (USE_MOCK) {
      await delay(200);
      const next = mockOrders.map((o) =>
        o.id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o,
      );
      const updated = next.find((o) => o.id === orderId);
      if (!updated) throw new Error("Order not found");
      setMockOrders(next);
      emitLocal("order.status_changed", updated);
      return updated;
    }
    return request<Order>(`/orders/${orderId}/status/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async callWaiter(payload: CallWaiterPayload): Promise<{ ok: true }> {
    if (USE_MOCK) {
      await delay(200);
      emitLocal("waiter.called", {
        ...payload,
        createdAt: new Date().toISOString(),
      });
      return { ok: true };
    }
    return request<{ ok: true }>("/waiter/call/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getTables(): Promise<TableStatus[]> {
    if (USE_MOCK) {
      await delay();
      return [...mockTables];
    }
    return request<TableStatus[]>("/tables/");
  },

  async getDashboardStats(): Promise<DashboardStats> {
    if (USE_MOCK) {
      await delay();
      return rebuildDashboardStats();
    }
    return request<DashboardStats>("/dashboard/stats/");
  },
};

type Listener = (type: string, payload: unknown) => void;
const localListeners = new Set<Listener>();

export function subscribeLocalEvents(listener: Listener) {
  localListeners.add(listener);
  return () => localListeners.delete(listener);
}

function emitLocal(type: string, payload: unknown) {
  localListeners.forEach((l) => l(type, payload));
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("restoflow:ws", { detail: { type, payload } }),
    );
  }
}
