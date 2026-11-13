import { REPORT_STATUSES } from "./constants";
import type { ObserverReport, ReportDraft, ReportStatus } from "./types";

export type ReportFilter = "All" | ReportStatus;

export const REPORT_FILTERS: ReportFilter[] = ["All", ...REPORT_STATUSES];

export function countByStatus(reports: ObserverReport[], status: ReportStatus): number {
  return reports.filter((report) => report.status === status).length;
}

/**
 * Link to My reports with a filter and page applied. Both live in the URL, so
 * the back button and a refresh keep them.
 */
export function reportsPath(filter: ReportFilter = "All", page = 1): string {
  const params = new URLSearchParams();
  if (filter !== "All") params.set("status", filter);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/reports?${query}` : "/reports";
}

/** The report wizard has four steps: activity, details, evidence, review. */
export const REPORT_STEPS = 4;

export function reportStepPath(step: number): string {
  return step > 1 ? `/reports/new?step=${step}` : "/reports/new";
}

/** The furthest step the draft's contents allow — later ones need the earlier answers. */
export function furthestStep(draft: ReportDraft): number {
  if (!draft.category || !draft.location?.trim() || !draft.when) return 1;
  if (!draft.details?.trim()) return 2;
  return REPORT_STEPS;
}

/** The filter named in the URL, or "All" for anything unrecognised. */
export function parseFilter(value: string | null): ReportFilter {
  return REPORT_FILTERS.find((filter) => filter === value) ?? "All";
}
