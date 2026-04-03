import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveService } from "../../services/saveService";
import toast from "react-hot-toast";

export function useSaveContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contentId) => saveService.saveContent(contentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved"] });
      toast.success("Saved!");
    },
    onError: (err) => {
      const msg = err.response?.data?.error?.message || "Failed to save";
      toast.error(msg);
    },
  });
}

export function useUnsaveContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contentId) => saveService.unsaveContent(contentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved"] });
      toast.success("Unsaved");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Failed to unsave");
    },
  });
}

export function useReorderSaved() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items) => saveService.reorderSaved(items),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved"] });
    },
  });
}
