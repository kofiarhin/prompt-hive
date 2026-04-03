import { api } from "./api";

export const saveService = {
  getSaved(params = {}) {
    return api.get("/save", { params });
  },
  saveContent(contentId) {
    return api.post(`/save/${contentId}`);
  },
  unsaveContent(contentId) {
    return api.delete(`/save/${contentId}`);
  },
  reorderSaved(items) {
    return api.put("/save/reorder", { items });
  },
};
