import { useQuery } from "@tanstack/react-query";
import * as service from "../services/observerService";

/** The geography only changes when the electoral register does. */
const DAY = 24 * 60 * 60_000;

/**
 * The places under `parentId` for an area dropdown — the states and the FCT
 * when `parentId` is `null`. Pass `undefined` while the parent isn't chosen
 * yet and nothing is fetched.
 */
export function useAreas(parentId: string | null | undefined) {
  return useQuery({
    queryKey: ["areas", parentId ?? "states"],
    queryFn: () => service.fetchAreas(parentId ?? undefined),
    enabled: parentId !== undefined,
    staleTime: DAY,
    gcTime: DAY,
  });
}
