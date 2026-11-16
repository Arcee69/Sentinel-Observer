import { useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDraft } from "../context/draft";
import * as service from "../services/observerService";
import type { ReportFilter } from "../lib/reports";
import type { NewReport } from "../lib/types";

/** Everything derived from the observer's reports sits under this key. */
const REPORTS_KEY = ["reports"];

/** Counts by status and the most recent reports. */
export function useDashboard() {
  return useQuery({
    queryKey: [...REPORTS_KEY, "dashboard"],
    queryFn: service.fetchDashboard,
  });
}

/** One page of the observer's own reports, newest first. */
export function useReports(filter: ReportFilter, page: number) {
  return useQuery({
    queryKey: [...REPORTS_KEY, "list", filter, page],
    queryFn: () => service.fetchReports(filter === "All" ? null : filter, page),
    // Keep the current rows on screen while the next page or filter loads.
    placeholderData: keepPreviousData,
  });
}

/**
 * Files the report in the wizard. A failed attempt leaves its progress in the
 * draft, so pressing submit again resumes rather than starting over.
 */
export function useSubmitReport() {
  const queryClient = useQueryClient();
  const { getSubmission, setSubmission } = useDraft();
  /** Upload progress, 0–100, while attachments are being sent. */
  const [uploaded, setUploaded] = useState<number | null>(null);

  const mutation = useMutation({
    mutationFn: (input: NewReport) =>
      service.submitReport(input, getSubmission(), {
        onCheckpoint: setSubmission,
        onUploadProgress: setUploaded,
      }),
    // Even a failed attempt may have saved a draft worth showing.
    onSettled: () => {
      setUploaded(null);
      return queryClient.invalidateQueries({ queryKey: REPORTS_KEY });
    },
  });

  return { ...mutation, uploaded };
}
