import api from "../axios";
import type { Category, MenuItem, UnsplashImage } from "../types";

export const menuService = {
  getCategories: () => api.get<Category[]>("/categories/"),
  getDishes: () => api.get<MenuItem[]>("/dishes/"),
  
  // Backgrounds
  searchBackgrounds: (q: string) => api.get<UnsplashImage[]>(`/manager/backgrounds/search/?q=${encodeURIComponent(q)}`),
  selectBackground: (payload: { image_url: string; unsplash_id: string }) => 
    api.post<{ menu_background: string }>("/manager/backgrounds/select/", payload),

  // Public Menu (No Auth required)
  getPublicMenu: (qrHash: string) => api.get<MenuItem[]>(`/menu/${qrHash}/`),
};
