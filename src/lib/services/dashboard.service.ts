import api from "../axios";
import type { DashboardStats, TableStatus } from "../types";

export const dashboardService = {
  getStats: () => api.get<DashboardStats>("/dashboard/stats/"),
  getTables: () => api.get<TableStatus[]>("/tables/"),
};
