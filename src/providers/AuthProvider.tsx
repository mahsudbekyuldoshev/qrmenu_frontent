"use client";

import { useEffect } from "react";
import { authService } from "@/lib/services/auth.service";
import { useAuthStore } from "@/store/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (accessToken) {
      authService.me()
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          logout();
        });
    }
  }, [accessToken, setUser, logout]);

  return <>{children}</>;
}
