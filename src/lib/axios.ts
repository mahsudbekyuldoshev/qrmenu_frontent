import axios from 'axios';
import { useAuthStore } from "@/store/auth-store";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: tokenni har doim yuborish
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: 401 xatolikda refresh qilish (kelajakda implementatsiya qilinadi)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 401 xatoligini qayta ishlash logikasi shu yerda bo'ladi
    return Promise.reject(error);
  }
);

export default api;
