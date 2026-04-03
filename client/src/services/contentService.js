import { api } from "./api";

export const contentService = {
  getContent(params = {}) {
    return api.get("/content", { params });
  },
  getContentBySlug(slug) {
    return api.get(`/content/${slug}`);
  },
  getFeatured() {
    return api.get("/content/featured");
  },
  getTopRated() {
    return api.get("/content/top-rated");
  },
  getMyContent(params = {}) {
    return api.get("/content/user/me", { params });
  },
  createContent(data) {
    return api.post("/content", data);
  },
  updateContent(id, data) {
    return api.put(`/content/${id}`, data);
  },
  deleteContent(id) {
    return api.delete(`/content/${id}`);
  },
  trackCopy(id) {
    return api.post(`/content/${id}/copy`);
  },
};
