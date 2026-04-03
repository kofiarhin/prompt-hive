import { useQuery } from "@tanstack/react-query";
import { contentService } from "../../services/contentService";

export function useExploreContent(params) {
  return useQuery({
    queryKey: ["content", "explore", params],
    queryFn: () => contentService.getContent(params).then((r) => r.data),
  });
}

export function useContentBySlug(slug) {
  return useQuery({
    queryKey: ["content", "detail", slug],
    queryFn: () => contentService.getContentBySlug(slug).then((r) => r.data),
    enabled: !!slug,
  });
}

export function useFeaturedContent() {
  return useQuery({
    queryKey: ["content", "featured"],
    queryFn: () => contentService.getFeatured().then((r) => r.data),
  });
}

export function useTopRatedContent() {
  return useQuery({
    queryKey: ["content", "top-rated"],
    queryFn: () => contentService.getTopRated().then((r) => r.data),
  });
}

export function useMyContent(params) {
  return useQuery({
    queryKey: ["content", "mine", params],
    queryFn: () => contentService.getMyContent(params).then((r) => r.data),
  });
}
