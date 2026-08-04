import api from "../axios";
import type { LoginPayload, AuthResponse, RegisterPayload } from "../types";

export const authService = {
  login: (payload: LoginPayload) => api.post<AuthResponse>("/auth/login/", payload),
  me: () => api.get("/auth/me/"),
  refresh: (refresh: string) => api.post("/auth/refresh/", { refresh }),
};
