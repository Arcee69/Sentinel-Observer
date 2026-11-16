import { useQuery } from "@tanstack/react-query";
import * as service from "../services/observerService";

/** The API's public configuration: what it currently offers and enforces. */
export function useMetadata() {
  return useQuery({
    queryKey: ["observer-metadata"],
    queryFn: service.fetchMetadata,
    staleTime: 5 * 60_000,
  });
}
