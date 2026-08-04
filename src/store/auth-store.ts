"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse, User } from "@/lib/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (auth: AuthResponse) => void;
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
          user: auth.user,
          accessToken: auth.access,
          refreshToken: auth.refresh,
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
  switch (role) {
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
