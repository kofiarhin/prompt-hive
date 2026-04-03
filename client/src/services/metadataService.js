import { api } from "./api";

export const metadataService = {
  getMetadata() {
    return api.get("/metadata");
  },
};
