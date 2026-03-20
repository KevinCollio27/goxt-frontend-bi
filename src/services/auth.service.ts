import api from "./axios.service";
import { User } from "@/store/auth.store";

export const AuthService = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await api.post("/api/auth/login", { email, password });
    return res.data;
  },

  async getMe(token?: string): Promise<{ user: User }> {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await api.get("/api/auth/me", config);
    return res.data;
  },
};
