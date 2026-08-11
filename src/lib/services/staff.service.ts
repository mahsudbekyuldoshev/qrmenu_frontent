import api from "../axios";
import type { StaffMember, EmploymentStatus } from "../types";

// Backend StaffSerializer maydonlariga mos frontend turi
export interface StaffApiItem {
  id: number;
  phone: string;
  first_name: string;
  last_name: string;
  role: string;
  employment_status: EmploymentStatus;
  is_active: boolean;
  must_change_password: boolean;
  date_joined: string;
  // Faqat yaratishda qaytadi (bir martalik)
  generated_password?: string;
}

export interface StaffCreatePayload {
  phone: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  role: "waiter" | "chef" | "manager";
}

export interface StaffUpdatePayload {
  first_name?: string;
  last_name?: string;
  employment_status?: EmploymentStatus;
}

/** Backend StaffSerializer maydonlarini frontend StaffMember ga o'tkazish */
export function toStaffMember(item: StaffApiItem): StaffMember {
  return {
    id: String(item.id),
    fullName: [item.first_name, item.last_name].filter(Boolean).join(" ") || item.phone,
    joinedDate: item.date_joined.split("T")[0],
    birthYear: 0,        // backend bu maydonni qaytarmaydi
    salary: 0,           // backend bu maydonni qaytarmaydi
    role: item.role as StaffMember["role"],
    employmentStatus: item.employment_status,
  };
}

export const staffService = {
  /** GET /staff/ — o'z restoranidagi xodimlar (manager/director) */
  getAll: () => api.get<StaffApiItem[]>("/staff/"),

  /** GET /staff/{id}/ */
  getOne: (id: number) => api.get<StaffApiItem>(`/staff/${id}/`),

  /**
   * POST /staff/
   * Yangi xodim yaratish. Javobda `generated_password` bo'lishi mumkin.
   * Kreator: director → manager/waiter/chef yarata oladi
   * Kreator: manager  → waiter/chef yarata oladi
   */
  create: (payload: StaffCreatePayload) =>
    api.post<StaffApiItem>("/staff/", payload),

  /**
   * PATCH /staff/{id}/
   * Ism-familiya va/yoki employment_status ni yangilash.
   * Rol o'zgartirish bu endpoint orqali mumkin emas.
   */
  update: (id: number, payload: StaffUpdatePayload) =>
    api.patch<StaffApiItem>(`/staff/${id}/`, payload),

  /** DELETE /staff/{id}/ */
  remove: (id: number) => api.delete(`/staff/${id}/`),

  /**
   * POST /auth/change-password/ — xodim uchun parolni reset qilish
   * (Vaqtinchalik parol o'rnatiladi; `must_change_password=True` bo'ladi)
   * Faqat director/manager o'z xodimi uchun chaqiradi.
   */
  resetPassword: (id: number, newPassword: string) =>
    api.patch<StaffApiItem>(`/staff/${id}/`, {
      password_reset: newPassword,
    }),
};
