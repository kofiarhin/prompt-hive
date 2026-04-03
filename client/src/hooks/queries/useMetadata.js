import { useQuery } from "@tanstack/react-query";
import { metadataService } from "../../services/metadataService";

export function useMetadata() {
  return useQuery({
    queryKey: ["metadata"],
    queryFn: () => metadataService.getMetadata().then((r) => r.data.data),
    staleTime: 1000 * 60 * 30,
  });
}
