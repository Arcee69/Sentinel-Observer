import { CircleAlert, Clock, FileText, MapPin, type LucideIcon } from "lucide-react";
import type { ApiReportStatus, ReportStatus } from "./types";

/**
 * What an observer can report. `code` is the API's category; `name` is its
 * full wording and `label` the shorter one on the picker.
 */
export const ACTIVITIES: { code: string; name: string; label: string; Icon: LucideIcon }[] = [
  { code: "voting_queue", name: "Voting / queue update", label: "Voting & queues", Icon: Clock },
  { code: "materials_logistics", name: "Materials or logistics", label: "Materials & logistics", Icon: FileText },
  { code: "safety_security", name: "Safety or security concern", label: "Safety concern", Icon: CircleAlert },
  { code: "general_activity", name: "General election activity", label: "General activity", Icon: MapPin },
  { code: "other", name: "Other observation", label: "Something else", Icon: FileText },
];

/** The full wording for a category code, for the review screen. */
export function activityName(code: string): string {
  return ACTIVITIES.find((activity) => activity.code === code)?.name ?? code;
}

export const REPORT_STATUSES: ReportStatus[] = [
  "In review",
  "Reviewed",
  "Needs information",
  "Draft",
];

/** API status code → the wording on screen. */
export const STATUS_LABEL: Record<ApiReportStatus, ReportStatus> = {
  in_review: "In review",
  reviewed: "Reviewed",
  needs_information: "Needs information",
  draft: "Draft",
};

/** The reverse, for the list's `status` filter. */
export const STATUS_CODE: Record<ReportStatus, ApiReportStatus> = {
  "In review": "in_review",
  Reviewed: "reviewed",
  "Needs information": "needs_information",
  Draft: "draft",
};

/** Pre-composed Tailwind classes per status: the list pill and the breakdown bar. */
export const STATUS_STYLES: Record<ReportStatus, { pill: string; bar: string }> = {
  Reviewed: { pill: "bg-reviewed-soft text-reviewed", bar: "bg-reviewed-bar" },
  "In review": { pill: "bg-in-review-soft text-in-review", bar: "bg-in-review-bar" },
  "Needs information": { pill: "bg-needs-info-soft text-needs-info", bar: "bg-needs-info-bar" },
  Draft: { pill: "bg-draft-soft text-draft", bar: "bg-draft-bar" },
};

/** Rows per page on My reports. */
export const REPORTS_PAGE_SIZE = 3;

export const LIMITS = {
  name: 80,
  email: 255,
  community: 100,
  /** The API's password rule: at least this long, and no more than 72 bytes. */
  passwordMin: 12,
  passwordMaxBytes: 72,
  location: 200,
  details: 1000,
  /** Characters of the observation shown on review before "Read full observation". */
  detailsPreview: 140,
  photoBytes: 10 * 1024 * 1024,
  videoBytes: 20 * 1024 * 1024,
  videoSeconds: 30,
} as const;

/** How this app names itself to the API when it asks for a token. */
export const DEVICE_NAME = "observer-web";

export const STORAGE_KEYS = {
  session: "sentinel-observer.session",
  /** Someone has used the app on this device, so open on Sign in rather than Create account. */
  returning: "sentinel-observer.returning",
  installDismissed: "sentinel-observer.install-dismissed",
};

/** The Sentinel landing site, for the header's way back. */
export const LANDING_URL =
  import.meta.env.VITE_LANDING_URL?.trim() ?? "https://sentinel-landing-web.netlify.app";
