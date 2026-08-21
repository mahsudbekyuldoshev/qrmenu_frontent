import api from "../axios";
import type { LoginPayload, AuthResponse, User } from "../types";

export const authService = {
  login: (payload: LoginPayload) => api.post<AuthResponse>("/auth/login/", payload),
  me: () => api.get<User>("/auth/me/"),
  updateProfile: (payload: {
    first_name?: string;
    last_name?: string;
    email?: string;
  }) => api.patch<User>("/auth/me/", payload),
  changePassword: (payload: { old_password: string; new_password: string }) =>
    api.post<{ detail: string }>("/auth/change-password/", payload),
  refresh: (refresh: string) => api.post("/auth/refresh/", { refresh }),
};
