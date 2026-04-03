import { api } from "./api";

export const adminService = {
  getContent(params = {}) {
    return api.get("/admin/content", { params });
  },
  createContent(data) {
    return api.post("/admin/content", data);
  },
  updateContent(id, data) {
    return api.put(`/admin/content/${id}`, data);
  },
  deleteContent(id) {
    return api.delete(`/admin/content/${id}`);
  },
  getUsers(params = {}) {
    return api.get("/admin/users", { params });
  },
  updateUserRole(id, role) {
    return api.patch(`/admin/users/${id}/role`, { role });
  },
  updateUserStatus(id, status) {
    return api.patch(`/admin/users/${id}/status`, { status });
  },
};
