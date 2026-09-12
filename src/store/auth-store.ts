"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse, StaffRole, User } from "@/lib/types";

/** Backend (`super_admin`, `chef`) → frontend role values. */
export function normalizeRole(role: string | undefined | null): StaffRole {
  switch (role) {
    case "super_admin":
      return "super-admin";
    case "kitchen":
      return "chef";
    default:
      return (role as StaffRole) || "director";
  }
}

function normalizeUser(user: User): User {
  return { ...user, role: normalizeRole(user.role) };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (auth: AuthResponse) => void;
  setUser: (user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasRole: (roles: User["role"] | User["role"][]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setSession: (auth) =>
        set({
          user: normalizeUser(auth.user),
          accessToken: auth.access,
          refreshToken: auth.refresh,
        }),
      setUser: (user) =>
        set({
          user: normalizeUser(user),
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        }),

      isAuthenticated: () => Boolean(get().accessToken && get().user),
      hasRole: (roles) => {
        const user = get().user;
        if (!user) return false;
        const requiredRoles = Array.isArray(roles) ? roles : [roles];
        return requiredRoles.includes(user.role);
      },
    }),
    { name: "restoflow-auth" },
  ),
);

export function roleHomePath(role: User["role"]): string {
  switch (normalizeRole(role)) {
    case "chef":
    case "kitchen":
      return "/kds";
    case "waiter":
      return "/waiter";
    case "manager":
      return "/manager";
    case "super-admin":
      return "/super-admin";
    case "director":
    default:
      return "/director";
  }
}
