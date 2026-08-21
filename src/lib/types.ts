export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export type StaffRole =
  | "chef"
  | "kitchen"
  | "waiter"
  | "director"
  | "manager"
  | "super-admin";

export interface User {
  id: number | string;
  phone: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role: StaffRole;
  restaurant_id?: number | null;
  restaurant_slug?: string | null;
  restaurant_name?: string | null;
  // computed convenience
  fullName?: string;
  restaurantName?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  phone: string;
  password: string;
  full_name?: string;
  role?: "waiter" | "chef" | "kitchen";
}

export interface Category {
  id: number | string;
  name: string;
  slug?: string;
  description?: string;
  is_active?: boolean;
  ordering?: number;
  dishes?: MenuItem[];
  // legacy compat
  nameUz?: string;
  nameRu?: string;
  nameEn?: string;
  sortOrder?: number;
}

export interface MenuItem {
  id: number | string;
  category?: number | string;
  name: string;
  description?: string;
  price: string | number;
  image?: string | null;
  is_available?: boolean;
  requiresPreparation?: boolean;
  // legacy compat fields
  categoryId?: string | number;
  nameUz?: string;
  nameRu?: string;
  nameEn?: string;
  descriptionUz?: string;
  descriptionRu?: string;
  descriptionEn?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  prepTimeMinutes?: number;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  nameUz?: string;
  price: number;
  quantity: number;
  note?: string;
}

export interface OrderItem {
  id: number | string;
  order?: number | string;
  dish?: number | string;
  dish_name?: string;
  quantity: number;
  price?: string | number;
  requires_kitchen?: boolean;
  status?: string;
  status_display?: string;
  // legacy compat
  menuItemId?: string | number;
  name?: string;
  nameUz?: string;
  unitPrice?: number;
  note?: string;
}

export interface Order {
  id: number | string;
  restaurant?: number | string;
  restaurant_name?: string;
  table?: number | string;
  table_number?: number;
  status: OrderStatus;
  status_display?: string;
  total_price?: string | number;
  comment?: string;
  items: OrderItem[];
  created_at?: string;
  // legacy compat
  tableNumber?: number;
  totalAmount?: number;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
}

export interface TableStatus {
  id?: number | string;
  number: number;
  qr_hash?: string;
  is_active?: boolean;
  // legacy compat
  isOccupied?: boolean;
  currentOrderId?: string | number | null;
  guestCount?: number;
  seatedAt?: string | null;
  turnoverToday?: number;
}

export type EmploymentStatus = "working" | "fired" | "resigned";

export interface StaffMember {
  id: string;
  fullName: string;
  joinedDate: string;
  birthYear: number;
  salary: number;
  role: StaffRole;
  employmentStatus: EmploymentStatus;
}

export interface Manager extends StaffMember {
  role: "manager";
}

export interface Waiter extends StaffMember {
  role: "waiter";
}

export interface Chef extends StaffMember {
  role: "kitchen" | "chef";
}

export type SubscriptionType = "Trial" | "Premium";

export interface Restaurant {
  id: string;
  name: string;
  address?: string;
  subscriptionType?: SubscriptionType;
  daysLeft?: number;
  directorId?: string;
  status?: "active" | "inactive";
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
  revenueByDay?: { day: string; amount: number }[];
  revenueByWeek?: { week: string; amount: number }[];
  topItems: { name: string; quantity: number; revenue: number }[];
  totalEmployees?: number;
  totalMonthlySalary?: number;
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

export interface UnsplashImage {
  unsplash_id: string;
  thumb_url: string;
  full_url: string;
  photographer: string;
}
