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
  UnsplashImage,
} from "./types";
import { uid } from "./utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

type MockAccount = User & { password: string };

const mockAccounts: MockAccount[] = [
  {
    id: "usr_demo_dir",
    phone: "901234567",
    email: "901234567@restoflow.uz",
    password: "demo1234",
    fullName: "Aziza Karimova",
    restaurantName: "RestoFlow Demo",
    role: "director",
  },
  {
    id: "usr_demo_kit",
    phone: "907654321",
    email: "907654321@restoflow.uz",
    password: "demo1234",
    fullName: "Jasur Aliyev",
    restaurantName: "RestoFlow Demo",
    role: "kitchen",
  },
  {
    id: "usr_demo_wai",
    phone: "900001122",
    email: "900001122@restoflow.uz",
    password: "demo1234",
    fullName: "Madina Yusupova",
    restaurantName: "RestoFlow Demo",
    role: "waiter",
  },
  {
    id: "usr_demo_man",
    phone: "901112233",
    email: "901112233@restoflow.uz",
    password: "demo1234",
    fullName: "Manager User",
    restaurantName: "RestoFlow Demo",
    role: "manager",
  },
  {
    id: "usr_demo_sa",
    phone: "909998877",
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
  // Pull token from Zustand persisted store (localStorage)
  let token: string | null = null;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("restoflow-auth");
      if (raw) {
        const parsed = JSON.parse(raw) as { state?: { accessToken?: string } };
        token = parsed?.state?.accessToken ?? null;
      }
    } catch { /* ignore */ }
  }

  const authHeader: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
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
      const phone = (payload.phone || "").replace(/\D/g, "");
      const account = mockAccounts.find((a) => a.email?.includes(phone) || a.phone === phone || a.phone === `+998${phone}`);
      if (!account || account.password !== payload.password) {
        throw new Error("Telefon raqam yoki parol noto'g'ri");
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
      const phone = (payload.phone || "").replace(/\D/g, "");
      const account: MockAccount = {
        id: Math.floor(Math.random() * 1000000),
        phone: payload.phone,
        password: payload.password,
        first_name: payload.full_name?.split(" ")[0] ?? "",
        last_name: payload.full_name?.split(" ").slice(1).join(" ") ?? "",
        role: payload.role as StaffRole,
        restaurant_id: null,
        restaurant_slug: null,
        restaurant_name: null,
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
      return [...categories].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    }
    return request<Category[]>("/categories/");
  },

  async getMenu(tableNumber?: number): Promise<MenuItem[]> {
    if (USE_MOCK) {
      await delay();
      void tableNumber;
      return menuItems.filter((m) => m.isAvailable ?? m.is_available);
    }
    return request<MenuItem[]>("/dishes/");
  },

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    if (USE_MOCK) {
      await delay(400);
      const items = payload.items.map((line) => {
        const menu = menuItems.find((m) => String(m.id) === String(line.menuItemId));
        if (!menu) throw new Error(`Menu item not found: ${line.menuItemId}`);
        return {
          id: uid("oi") as unknown as number,
          order: 0 as number,
          dish: menu.id,
          dish_name: menu.name ?? menu.nameUz ?? "",
          quantity: line.quantity,
          price: menu.price,
          unitPrice: Number(menu.price),
          note: line.note,
        };
      });

      const requiresKitchen = payload.items.some((line) => {
        const menu = menuItems.find((m) => String(m.id) === String(line.menuItemId));
        return menu?.requiresPreparation;
      });

      const order: Order = {
        id: uid("ord") as unknown as number,
        restaurant: 0,
        restaurant_name: "",
        table: payload.tableNumber,
        table_number: payload.tableNumber,
        status: requiresKitchen ? "pending" : "ready",
        status_display: requiresKitchen ? "Kutilmoqda" : "Tayyor",
        total_price: items.reduce((s, i) => s + Number(i.price) * i.quantity, 0),
        items,
        created_at: new Date().toISOString(),
        tableNumber: payload.tableNumber,
      };
      setMockOrders([order, ...mockOrders]);
      emitLocal("order.created", order);
      return order;
    }
    const backendPayload = {
      table: payload.tableNumber,
      uploaded_items: payload.items.map((i) => ({
        dish: i.menuItemId,
        quantity: i.quantity,
      })),
      comment: payload.notes,
    };
    return request<Order>("/orders/", {
      method: "POST",
      body: JSON.stringify(backendPayload),
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
          new Date(b.created_at ?? b.createdAt ?? "").getTime() -
          new Date(a.created_at ?? a.createdAt ?? "").getTime(),
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

  async updateOrderStatus(orderId: string | number, status: OrderStatus): Promise<Order> {
    if (USE_MOCK) {
      await delay(200);
      const next = mockOrders.map((o) =>
        String(o.id) === String(orderId)
          ? { ...o, status }
          : o,
      );
      const updated = next.find((o) => String(o.id) === String(orderId));
      if (!updated) throw new Error("Order not found");
      setMockOrders(next);
      emitLocal("order.status_changed", updated);
      return updated;
    }
    return request<Order>(`/orders/${orderId}/`, {
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

  async searchBackgrounds(q: string): Promise<UnsplashImage[]> {
    if (USE_MOCK) {
      await delay(500);
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=16&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY ?? "demo"}`,
          },
        },
      );
      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          throw Object.assign(new Error("Unsplash API kaliti sozlanmagan"), { status: 503 });
        }
        throw Object.assign(new Error("Qidiruv muvaffaqiyatsiz"), { status: res.status });
      }
      const data = await res.json() as { results: Array<{ id: string; urls: { thumb: string; full: string; regular: string }; user: { name: string } }> };
      return data.results.map((r) => ({
        unsplash_id: r.id,
        thumb_url: r.urls.thumb,
        full_url: r.urls.regular,
        photographer: r.user.name,
      }));
    }
    return request<UnsplashImage[]>(
      `/manager/backgrounds/search/?q=${encodeURIComponent(q)}`,
    );
  },

  async selectBackground(payload: { image_url: string; unsplash_id: string }): Promise<{ menu_background: string }> {
    if (USE_MOCK) {
      await delay(1200);
      // Simulate server downloading the image and returning a URL
      return { menu_background: payload.image_url };
    }
    return request<{ menu_background: string }>("/manager/backgrounds/select/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
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
