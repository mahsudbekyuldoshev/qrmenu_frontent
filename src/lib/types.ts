export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export type StaffRole = "kitchen" | "waiter" | "director" | "manager" | "super-admin";

export interface User {
  id: string;
  email: string;
  fullName: string;
  restaurantName: string;
  role: StaffRole;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  restaurantName: string;
  role: StaffRole;
}

export interface Category {
  id: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  prepTimeMinutes: number;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  nameUz: string;
  price: number;
  quantity: number;
  note?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  nameUz: string;
  quantity: number;
  unitPrice: number;
  note?: string;
}

export interface Order {
  id: string;
  tableNumber: number;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface TableStatus {
  number: number;
  isOccupied: boolean;
  currentOrderId: string | null;
  guestCount: number;
  seatedAt: string | null;
  turnoverToday: number;
}

export interface StaffMember {
  id: string;
  fullName: string;
  joinedDate: string;
  birthYear: number;
  salary: number;
  role: StaffRole;
}

export interface Manager extends StaffMember {
  role: "manager";
}

export interface Waiter extends StaffMember {
  role: "waiter";
}

export interface Chef extends StaffMember {
  role: "kitchen";
}

export type SubscriptionType = "Trial" | "Premium";

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  subscriptionType: SubscriptionType;
  daysLeft: number;
  directorId: string;
  status: "active" | "inactive";
  coordinates?: { lat: number; lng: number };
}

export interface Director extends User {
  phone: string;
  restaurantId?: string;
  branchesCount?: number;
}

export interface DashboardStats {
  todayRevenue: number;
  todayOrders: number;
  activeOrders: number;
  averageOrderValue: number;
  occupiedTables: number;
  totalTables: number;
  revenueByHour: { hour: string; amount: number }[];
  revenueByDay: { day: string; amount: number }[];
  revenueByWeek: { week: string; amount: number }[];
  topItems: { name: string; quantity: number; revenue: number }[];
  totalEmployees: number;
  totalMonthlySalary: number;
}

export interface CreateOrderPayload {
  tableNumber: number;
  items: { menuItemId: string; quantity: number; note?: string }[];
  notes?: string;
}

export interface CallWaiterPayload {
  tableNumber: number;
  reason?: string;
}

export type WsEventType =
  | "order.created"
  | "order.updated"
  | "order.status_changed"
  | "waiter.called"
  | "stats.updated";

export interface WsEvent<T = unknown> {
  type: WsEventType;
  payload: T;
  timestamp: string;
}
