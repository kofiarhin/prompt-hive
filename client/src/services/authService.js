import { api } from "./api";

export const authService = {
  register(data) {
    return api.post("/auth/register", data);
  },
  login(data) {
    return api.post("/auth/login", data);
  },
  logout() {
    return api.post("/auth/logout");
  },
  getMe() {
    return api.get("/auth/me");
  },
};
