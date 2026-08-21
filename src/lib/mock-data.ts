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
    requiresPreparation: true,
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
    requiresPreparation: true,
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
    prepTimeMinutes: 15,
    requiresPreparation: true,
  },
  {
    id: "item_mastava",
    categoryId: "cat_soups",
    name: "Mastava",
    nameUz: "Mastava",
    description: "Rice and meat soup with vegetables and katyk",
    descriptionUz: "Guruch, go'sht va sabzavotli sho'rva",
    price: 48000,
    imageUrl:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 12,
    requiresPreparation: true,
  },
  {
    id: "item_plov",
    categoryId: "cat_mains",
    name: "Wedding Plov",
    nameUz: "To'y oshi",
    description: "Traditional Uzbek plov with lamb, raisins and chickpeas",
    descriptionUz: "Qo'zichoq go'shti, mayiz va no'xatli an'anaviy palov",
    price: 65000,
    imageUrl:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 5,
    requiresPreparation: true,
  },
  {
    id: "item_manti",
    categoryId: "cat_mains",
    name: "Beef Manti",
    nameUz: "Mol go'shtli manti",
    description: "Steamed dumplings filled with minced beef and onions",
    descriptionUz: "Bug'da pishirilgan manti",
    price: 52000,
    imageUrl:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 20,
    requiresPreparation: true,
  },
  {
    id: "item_shashlik",
    categoryId: "cat_grill",
    name: "Lamb Shashlik",
    nameUz: "Qo'y go'shti kabob",
    description: "Skewered marinated lamb grilled over charcoal",
    descriptionUz: "Ko'mirda pishirilgan qo'y go'shti",
    price: 35000,
    imageUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 18,
    requiresPreparation: true,
  },
  {
    id: "item_steak",
    categoryId: "cat_grill",
    name: "Ribeye Steak",
    nameUz: "Ribay steyk",
    description: "300g premium ribeye with grilled vegetables",
    descriptionUz: "300g ribay steyk, grill sabzavotlar bilan",
    price: 135000,
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 22,
    requiresPreparation: true,
  },
  {
    id: "item_tea",
    categoryId: "cat_drinks",
    name: "Green Tea with Lemon",
    nameUz: "Limonli ko'k choy",
    description: "Fresh brewed green tea in a traditional teapot",
    descriptionUz: "Choynakda damlangan yangi ko'k choy",
    price: 18000,
    imageUrl:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 3,
    requiresPreparation: false,
  },
  {
    id: "item_cola",
    categoryId: "cat_drinks",
    name: "Coca-Cola 0.5L",
    nameUz: "Coca-Cola 0.5L",
    description: "Chilled classic cola",
    descriptionUz: "Muzdek klassik kola",
    price: 14000,
    imageUrl:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 1,
    requiresPreparation: false,
  },
  {
    id: "item_compote",
    categoryId: "cat_drinks",
    name: "Homemade Compote",
    nameUz: "Uy kompot",
    description: "Dried fruits compote, served cold",
    descriptionUz: "Quritilgan mevalardan tayyorlangan sovuq kompot",
    price: 16000,
    imageUrl:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 2,
    requiresPreparation: false,
  },
  {
    id: "item_cheesecake",
    categoryId: "cat_desserts",
    name: "New York Cheesecake",
    nameUz: "Nyu-York chizkeyki",
    description: "Classic creamy cheesecake with berry coulis",
    descriptionUz: "Reza mevali klassik chizkeyk",
    price: 42000,
    imageUrl:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 4,
    requiresPreparation: false,
  },
  {
    id: "item_honey_cake",
    categoryId: "cat_desserts",
    name: "Medovik (Honey Cake)",
    nameUz: "Medovik (Asalli tort)",
    description: "Layered honey sponge with sour cream frosting",
    descriptionUz: "Qaymoqli krem bilan asalli tort",
    price: 38000,
    imageUrl:
      "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&q=80",
    isAvailable: true,
    prepTimeMinutes: 4,
    requiresPreparation: false,
  },
];

function makeItems(
  pairs: { menuItemId: string; quantity: number }[],
): OrderItem[] {
  return pairs.map((p) => {
    const item = menuItems.find((m) => String(m.id) === String(p.menuItemId))!;
    const name = item ? item.nameUz || item.name : "Taom";
    const price = item ? Number(item.price) : 0;
    return {
      id: uid("oi"),
      order: 0,
      dish: item?.id ?? 0,
      dish_name: name,
      quantity: p.quantity,
      price: price,
      menuItemId: item?.id,
      name: item?.name,
      nameUz: item?.nameUz,
      unitPrice: price,
    };
  });
}

function orderTotal(items: OrderItem[]): number {
  return items.reduce((sum, i) => sum + Number(i.unitPrice || i.price || 0) * i.quantity, 0);
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
      table: 3,
      table_number: 3,
      tableNumber: 3,
      restaurant: 1,
      restaurant_name: RESTAURANT_NAME,
      status: "pending" as const,
      status_display: "Kutilmoqda",
      items,
      total_price: orderTotal(items),
      totalAmount: orderTotal(items),
      created_at: new Date(now - 2 * 60000).toISOString(),
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
      table: 7,
      table_number: 7,
      tableNumber: 7,
      restaurant: 1,
      restaurant_name: RESTAURANT_NAME,
      status: "preparing" as const,
      status_display: "Tayyorlanmoqda",
      items,
      total_price: orderTotal(items),
      totalAmount: orderTotal(items),
      created_at: new Date(now - 12 * 60000).toISOString(),
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
      table: 1,
      table_number: 1,
      tableNumber: 1,
      restaurant: 1,
      restaurant_name: RESTAURANT_NAME,
      status: "ready" as const,
      status_display: "Tayyor",
      items,
      total_price: orderTotal(items),
      totalAmount: orderTotal(items),
      created_at: new Date(now - 25 * 60000).toISOString(),
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
      table: 5,
      table_number: 5,
      tableNumber: 5,
      restaurant: 1,
      restaurant_name: RESTAURANT_NAME,
      status: "delivered" as const,
      status_display: "Yetkazildi",
      items,
      total_price: orderTotal(items),
      totalAmount: orderTotal(items),
      created_at: new Date(now - 55 * 60000).toISOString(),
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
      table: 9,
      table_number: 9,
      tableNumber: 9,
      restaurant: 1,
      restaurant_name: RESTAURANT_NAME,
      status: "preparing" as const,
      status_display: "Tayyorlanmoqda",
      items,
      total_price: orderTotal(items),
      totalAmount: orderTotal(items),
      created_at: new Date(now - 6 * 60000).toISOString(),
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
        (o.table_number === number || o.tableNumber === number) &&
        o.status !== "delivered" &&
        o.status !== "cancelled",
    );
    return {
      id: number,
      number,
      qr_hash: `hash_table_${number}`,
      is_active: true,
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
    deliveredToday.reduce((s, o) => s + Number(o.total_price || o.totalAmount || 0), 0) +
    active.reduce((s, o) => s + Number(o.total_price || o.totalAmount || 0) * 0.4, 0) +
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
      const name = item.nameUz || item.dish_name || item.name || "Taom";
      const unitPrice = Number(item.unitPrice || item.price || 0);
      const prev = itemMap.get(name) ?? { quantity: 0, revenue: 0 };
      itemMap.set(name, {
        quantity: prev.quantity + item.quantity,
        revenue: prev.revenue + item.quantity * unitPrice,
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
    revenueByDay: [
      { day: "Du", amount: 1200000 },
      { day: "Se", amount: 1500000 },
      { day: "Ch", amount: 1100000 },
      { day: "Pa", amount: 1800000 },
      { day: "Ju", amount: 2200000 },
      { day: "Sh", amount: 2800000 },
      { day: "Ya", amount: 2500000 },
    ],
    revenueByWeek: [
      { week: "Hafta 1", amount: 12000000 },
      { week: "Hafta 2", amount: 15000000 },
      { week: "Hafta 3", amount: 14000000 },
      { week: "Hafta 4", amount: 18000000 },
    ],
    totalEmployees: 6,
    totalMonthlySalary: 29000000,
  };
}

export function setMockOrders(next: Order[]) {
  mockOrders = next;
  mockTables = mockTables.map((t) => {
    const active = next.find(
      (o) =>
        (o.table_number === t.number || o.tableNumber === t.number) &&
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
