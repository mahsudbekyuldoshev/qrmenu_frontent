import type {
  Category,
  DashboardStats,
  MenuItem,
  Order,
  OrderItem,
  TableStatus,
} from "./types";
import { uid } from "./utils";

export const RESTAURANT_NAME = "RestoFlow Demo";
export const TOTAL_TABLES = 12;

export const categories: Category[] = [
  { id: "cat_salads", name: "Salads", nameUz: "Salatlar", sortOrder: 1 },
  { id: "cat_soups", name: "Soups", nameUz: "Sho'rvalar", sortOrder: 2 },
  { id: "cat_mains", name: "Mains", nameUz: "Asosiy taomlar", sortOrder: 3 },
  { id: "cat_grill", name: "Grill", nameUz: "Grill", sortOrder: 4 },
  { id: "cat_drinks", name: "Drinks", nameUz: "Ichimliklar", sortOrder: 5 },
  { id: "cat_desserts", name: "Desserts", nameUz: "Shirinliklar", sortOrder: 6 },
];

export const menuItems: MenuItem[] = [
  {
    id: "item_caesar",
    categoryId: "cat_salads",
    name: "Caesar Salad",
    nameUz: "Sezar salati",
    description: "Romaine, parmesan, croutons, caesar dressing",
    descriptionUz: "Romain, parmezan, kruton, sezar sousi",
    price: 45000,
    imageUrl:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 10,
  },
  {
    id: "item_greek",
    categoryId: "cat_salads",
    name: "Greek Salad",
    nameUz: "Yunoncha salat",
    description: "Tomato, cucumber, feta, olives, olive oil",
    descriptionUz: "Pomidor, bodring, feta, zaytun, zaytun yog'i",
    price: 42000,
    imageUrl:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 8,
  },
  {
    id: "item_lagman",
    categoryId: "cat_soups",
    name: "Lagman",
    nameUz: "Lag'mon",
    description: "Hand-pulled noodles with beef and vegetables",
    descriptionUz: "Qo'lda tortilgan noodle, mol go'shti va sabzavotlar",
    price: 55000,
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 18,
  },
  {
    id: "item_mastava",
    categoryId: "cat_soups",
    name: "Mastava",
    nameUz: "Mastava",
    description: "Rice soup with beef and vegetables",
    descriptionUz: "Guruchli sho'rva, mol go'shti va sabzavotlar",
    price: 38000,
    imageUrl:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 15,
  },
  {
    id: "item_plov",
    categoryId: "cat_mains",
    name: "Osh (Plov)",
    nameUz: "Osh",
    description: "Traditional Uzbek rice with lamb and carrots",
    descriptionUz: "An'anaviy o'zbek oshi, qo'y go'shti va sabzi",
    price: 65000,
    imageUrl:
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 20,
  },
  {
    id: "item_manti",
    categoryId: "cat_mains",
    name: "Manti",
    nameUz: "Manti",
    description: "Steamed dumplings with spiced meat",
    descriptionUz: "Bug'da pishirilgan go'shtli chuchvara",
    price: 48000,
    imageUrl:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 22,
  },
  {
    id: "item_steak",
    categoryId: "cat_grill",
    name: "Ribeye Steak",
    nameUz: "Ribeye steyk",
    description: "300g ribeye with herb butter and fries",
    descriptionUz: "300g ribeye, o'tli sariyog' va fri",
    price: 145000,
    imageUrl:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 25,
  },
  {
    id: "item_shashlik",
    categoryId: "cat_grill",
    name: "Lamb Shashlik",
    nameUz: "Qo'y shashlik",
    description: "Charcoal-grilled lamb skewers",
    descriptionUz: "Ko'mirda pishirilgan qo'y shashlik",
    price: 72000,
    imageUrl:
      "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 20,
  },
  {
    id: "item_cola",
    categoryId: "cat_drinks",
    name: "Cola",
    nameUz: "Cola",
    description: "Chilled soft drink 0.5L",
    descriptionUz: "Sovuq ichimlik 0.5L",
    price: 12000,
    imageUrl:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 1,
  },
  {
    id: "item_compote",
    categoryId: "cat_drinks",
    name: "Dried Fruit Compote",
    nameUz: "Kompot",
    description: "Homemade dried fruit drink",
    descriptionUz: "Uy sharoitida tayyorlangan quritilgan meva ichimligi",
    price: 15000,
    imageUrl:
      "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 2,
  },
  {
    id: "item_cheesecake",
    categoryId: "cat_desserts",
    name: "Cheesecake",
    nameUz: "Chizkeyk",
    description: "New York style with berry sauce",
    descriptionUz: "Nyu-York uslubidagi chizkeyk, rezavor sous",
    price: 35000,
    imageUrl:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 5,
  },
  {
    id: "item_honey_cake",
    categoryId: "cat_desserts",
    name: "Honey Cake",
    nameUz: "Asalli tort",
    description: "Layered honey sponge with cream",
    descriptionUz: "Asalli biskvit krem bilan",
    price: 32000,
    imageUrl:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 5,
  },
];

function makeItems(
  pairs: { menuItemId: string; quantity: number }[],
): OrderItem[] {
  return pairs.map((p) => {
    const item = menuItems.find((m) => m.id === p.menuItemId)!;
    return {
      id: uid("oi"),
      menuItemId: item.id,
      name: item.name,
      nameUz: item.nameUz,
      quantity: p.quantity,
      unitPrice: item.price,
    };
  });
}

function orderTotal(items: OrderItem[]): number {
  return items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
}

const now = Date.now();

export let mockOrders: Order[] = [
  (() => {
    const items = makeItems([
      { menuItemId: "item_plov", quantity: 2 },
      { menuItemId: "item_compote", quantity: 2 },
    ]);
    return {
      id: "ord_1001",
      tableNumber: 3,
      status: "pending" as const,
      items,
      totalAmount: orderTotal(items),
      createdAt: new Date(now - 2 * 60000).toISOString(),
      updatedAt: new Date(now - 2 * 60000).toISOString(),
    };
  })(),
  (() => {
    const items = makeItems([
      { menuItemId: "item_steak", quantity: 1 },
      { menuItemId: "item_caesar", quantity: 1 },
      { menuItemId: "item_cola", quantity: 1 },
    ]);
    return {
      id: "ord_1002",
      tableNumber: 7,
      status: "preparing" as const,
      items,
      totalAmount: orderTotal(items),
      createdAt: new Date(now - 12 * 60000).toISOString(),
      updatedAt: new Date(now - 8 * 60000).toISOString(),
    };
  })(),
  (() => {
    const items = makeItems([
      { menuItemId: "item_shashlik", quantity: 3 },
      { menuItemId: "item_greek", quantity: 1 },
    ]);
    return {
      id: "ord_1003",
      tableNumber: 1,
      status: "ready" as const,
      items,
      totalAmount: orderTotal(items),
      createdAt: new Date(now - 25 * 60000).toISOString(),
      updatedAt: new Date(now - 3 * 60000).toISOString(),
    };
  })(),
  (() => {
    const items = makeItems([
      { menuItemId: "item_manti", quantity: 2 },
      { menuItemId: "item_lagman", quantity: 1 },
    ]);
    return {
      id: "ord_1004",
      tableNumber: 5,
      status: "delivered" as const,
      items,
      totalAmount: orderTotal(items),
      createdAt: new Date(now - 55 * 60000).toISOString(),
      updatedAt: new Date(now - 30 * 60000).toISOString(),
    };
  })(),
  (() => {
    const items = makeItems([
      { menuItemId: "item_cheesecake", quantity: 2 },
      { menuItemId: "item_honey_cake", quantity: 1 },
    ]);
    return {
      id: "ord_1005",
      tableNumber: 9,
      status: "preparing" as const,
      items,
      totalAmount: orderTotal(items),
      createdAt: new Date(now - 6 * 60000).toISOString(),
      updatedAt: new Date(now - 4 * 60000).toISOString(),
    };
  })(),
];

export let mockTables: TableStatus[] = Array.from(
  { length: TOTAL_TABLES },
  (_, i) => {
    const number = i + 1;
    const active = mockOrders.find(
      (o) =>
        o.tableNumber === number &&
        o.status !== "delivered" &&
        o.status !== "cancelled",
    );
    return {
      number,
      isOccupied: Boolean(active),
      currentOrderId: active?.id ?? null,
      guestCount: active ? 2 + (number % 3) : 0,
      seatedAt: active
        ? new Date(now - number * 7 * 60000).toISOString()
        : null,
      turnoverToday: 1 + (number % 4),
    };
  },
);

export function rebuildDashboardStats(): DashboardStats {
  const deliveredToday = mockOrders.filter((o) => o.status === "delivered");
  const active = mockOrders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status),
  );
  const todayRevenue =
    deliveredToday.reduce((s, o) => s + o.totalAmount, 0) +
    active.reduce((s, o) => s + o.totalAmount * 0.4, 0) +
    1280000;

  const revenueByHour = [
    { hour: "10:00", amount: 180000 },
    { hour: "11:00", amount: 320000 },
    { hour: "12:00", amount: 540000 },
    { hour: "13:00", amount: 610000 },
    { hour: "14:00", amount: 290000 },
    { hour: "15:00", amount: 210000 },
    { hour: "16:00", amount: 250000 },
    { hour: "17:00", amount: 380000 },
  ];

  const itemMap = new Map<string, { quantity: number; revenue: number }>();
  for (const order of mockOrders) {
    for (const item of order.items) {
      const prev = itemMap.get(item.nameUz) ?? { quantity: 0, revenue: 0 };
      itemMap.set(item.nameUz, {
        quantity: prev.quantity + item.quantity,
        revenue: prev.revenue + item.quantity * item.unitPrice,
      });
    }
  }

  const topItems = [...itemMap.entries()]
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return {
    todayRevenue,
    todayOrders: mockOrders.length + 18,
    activeOrders: active.length,
    averageOrderValue: Math.round(todayRevenue / (mockOrders.length + 18)),
    occupiedTables: mockTables.filter((t) => t.isOccupied).length,
    totalTables: TOTAL_TABLES,
    revenueByHour,
    topItems,
  };
}

export function setMockOrders(next: Order[]) {
  mockOrders = next;
  mockTables = mockTables.map((t) => {
    const active = next.find(
      (o) =>
        o.tableNumber === t.number &&
        o.status !== "delivered" &&
        o.status !== "cancelled",
    );
    return {
      ...t,
      isOccupied: Boolean(active),
      currentOrderId: active?.id ?? null,
      guestCount: active ? t.guestCount || 2 : 0,
      seatedAt: active ? t.seatedAt ?? new Date().toISOString() : null,
    };
  });
}
