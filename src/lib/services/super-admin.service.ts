import api from "../axios";

// ─── Tiplari ──────────────────────────────────────────────────────────────

export interface DirectorApi {
  id: number;
  phone: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  employment_status: string;
  must_change_password: boolean;
  restaurant_id: number | null;
  restaurant_name: string | null;
  generated_password?: string;   // faqat yaratishda qaytadi
}

export interface RestaurantApi {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  director: DirectorApi | null;
  subscription_price: string | null;
  subscription_days_remaining: number | null;
  subscription_end_date: string | null;
  has_active_subscription: boolean;
  total_paid: string;
  staff_count: number;
  created_at: string;
}

export interface AdminDashboardApi {
  total_restaurants: number;
  total_directors: number;
  active_subscriptions: number;
  expired_subscriptions: number;
  restaurants: RestaurantApi[];
}

export interface AdminAnalyticsApi {
  restaurants_over_time: { date: string; count: number }[];
  revenue_over_time: { month: string; total: number }[];
  total_revenue: number;
  subscription_status: {
    active_count: number;
    active_percent: number;
    expired_count: number;
    expired_percent: number;
    total_restaurants: number;
  };
}

export interface CreateRestaurantPayload {
  name: string;
  slug?: string;
  subscription?: { price?: number; months?: number };
}

export interface CreateDirectorPayload {
  phone: string;
  password?: string;
  first_name?: string;
  last_name?: string;
}

export interface AssignDirectorPayload {
  director_id: number;
}

export interface RenewSubscriptionPayload {
  amount: number;
  months?: number;
  note?: string;
}

// ─── Servis ───────────────────────────────────────────────────────────────

export const superAdminService = {
  // ── Dashboard va Analitika ────────────────────────────────────────────────

  /** GET /admin/dashboard/ — umumiy statistika + restoranlar ro'yxati */
  getDashboard: () => api.get<AdminDashboardApi>("/admin/dashboard/"),

  /**
   * GET /admin/analytics/?period=daily|weekly|monthly
   * Grafik ma'lumotlari: vaqt bo'yicha, tushum, obuna holati.
   */
  getAnalytics: (period: "daily" | "weekly" | "monthly" = "monthly") =>
    api.get<AdminAnalyticsApi>("/admin/analytics/", { params: { period } }),

  // ── Direktorlar ──────────────────────────────────────────────────────────

  /** GET /admin/directors/ */
  getDirectors: () => api.get<DirectorApi[]>("/admin/directors/"),

  /** GET /admin/directors/{id}/ */
  getDirector: (id: number) => api.get<DirectorApi>(`/admin/directors/${id}/`),

  /**
   * POST /admin/directors/
   * Yangi direktor hisobi yaratish (biriktirilmagan holda).
   * Javobda `generated_password` bo'lishi mumkin.
   */
  createDirector: (payload: CreateDirectorPayload) =>
    api.post<DirectorApi>("/admin/directors/", payload),

  /** PATCH /admin/directors/{id}/ — ism-familiya va status yangilash */
  updateDirector: (id: number, payload: Partial<Omit<DirectorApi, "id">>) =>
    api.patch<DirectorApi>(`/admin/directors/${id}/`, payload),

  /** DELETE /admin/directors/{id}/ */
  deleteDirector: (id: number) => api.delete(`/admin/directors/${id}/`),

  // ── Restoranlar ──────────────────────────────────────────────────────────

  /** GET /admin/restaurants/ */
  getRestaurants: () => api.get<RestaurantApi[]>("/admin/restaurants/"),

  /** GET /admin/restaurants/{id}/ */
  getRestaurant: (id: number) => api.get<RestaurantApi>(`/admin/restaurants/${id}/`),

  /**
   * POST /admin/restaurants/
   * Yangi restoran yaratish (direktor keyinchalik biriktiriladi).
   */
  createRestaurant: (payload: CreateRestaurantPayload) =>
    api.post<RestaurantApi>("/admin/restaurants/", payload),

  /** PATCH /admin/restaurants/{id}/ */
  updateRestaurant: (id: number, payload: Partial<CreateRestaurantPayload & { is_active: boolean }>) =>
    api.patch<RestaurantApi>(`/admin/restaurants/${id}/`, payload),

  /** DELETE /admin/restaurants/{id}/ */
  deleteRestaurant: (id: number) => api.delete(`/admin/restaurants/${id}/`),

  /**
   * POST /admin/restaurants/{id}/assign-director/
   * Mavjud direktorni restoranga biriktirish.
   * Body: { director_id: number }
   */
  assignDirector: (restaurantId: number, payload: AssignDirectorPayload) =>
    api.post<RestaurantApi>(
      `/admin/restaurants/${restaurantId}/assign-director/`,
      payload,
    ),

  /**
   * POST /admin/restaurants/{id}/renew-subscription/
   * Obunani uzaytirish / to'lov qabul qilish.
   */
  renewSubscription: (restaurantId: number, payload: RenewSubscriptionPayload) =>
    api.post(`/admin/restaurants/${restaurantId}/renew-subscription/`, payload),

  /** GET /admin/restaurants/{id}/payments/ — to'lovlar tarixi */
  getPayments: (restaurantId: number) =>
    api.get(`/admin/restaurants/${restaurantId}/payments/`),
};
