import { useQuery } from "@tanstack/react-query";
import { saveService } from "../../services/saveService";

export function useSavedContent(params) {
  return useQuery({
    queryKey: ["saved", params],
    queryFn: () => saveService.getSaved(params).then((r) => r.data),
  });
}
