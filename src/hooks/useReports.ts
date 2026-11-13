import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as service from "../services/observerService";

const REPORTS_KEY = ["reports"];

/** The observer's own reports, newest first. */
export function useReports() {
  return useQuery({
    queryKey: REPORTS_KEY,
    queryFn: service.fetchReports,
  });
}

export function useSaveReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.saveReport,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: REPORTS_KEY }),
  });
}
