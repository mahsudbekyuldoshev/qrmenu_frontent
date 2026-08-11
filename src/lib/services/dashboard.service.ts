import api from "../axios";
import type { TableStatus } from "../types";

export interface DashboardStatsApi {
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

export const dashboardService = {
  /**
   * GET /dashboard/stats/
   * Director/Manager uchun restoran statistikasi.
   * ESLATMA: backend da bu endpoint hali yo'q bo'lsa, mock fallback ishlatiladi.
   */
  getStats: () => api.get<DashboardStatsApi>("/dashboard/stats/"),

  /** GET /tables/ — stol ro'yxati (qr_hash bilan) */
  getTables: () => api.get<TableStatus[]>("/tables/"),

  /** GET /restaurant/me/ — o'z restorani haqida ma'lumot */
  getMyRestaurant: () => api.get("/restaurant/me/"),
};
