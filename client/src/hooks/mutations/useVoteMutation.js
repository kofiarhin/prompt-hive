import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voteService } from "../../services/voteService";

export function useVote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, voteType }) => voteService.vote(contentId, voteType),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content"] });
    },
  });
}
