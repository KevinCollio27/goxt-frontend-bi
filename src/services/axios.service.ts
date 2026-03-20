"use client";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Request: inyecta el token automáticamente si existe
instance.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token && !config.headers["Authorization"]) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response: maneja 401 globalmente
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const excludePaths = ["/login", "/auth/callback"];

    if (status === 401 && typeof window !== "undefined") {
      if (!excludePaths.some((p) => window.location.pathname.startsWith(p))) {
        useAuthStore.getState().logout();
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
