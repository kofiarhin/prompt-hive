import { api } from "./api";

export const voteService = {
  vote(contentId, voteType) {
    return api.post(`/vote/${contentId}`, { voteType });
  },
};
