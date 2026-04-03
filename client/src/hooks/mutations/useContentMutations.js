import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contentService } from "../../services/contentService";
import toast from "react-hot-toast";

export function useCreateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => contentService.createContent(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content"] });
      toast.success("Content created!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Failed to create content");
    },
  });
}

export function useUpdateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => contentService.updateContent(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content"] });
      toast.success("Content updated!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Failed to update content");
    },
  });
}

export function useDeleteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => contentService.deleteContent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content"] });
      toast.success("Content deleted");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Failed to delete content");
    },
  });
}

export function useCopyContent() {
  return useMutation({
    mutationFn: (id) => contentService.trackCopy(id),
  });
}
