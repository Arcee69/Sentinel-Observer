import { CircleAlert, Clock, FileText, MapPin, type LucideIcon } from "lucide-react";
import type { ReportStatus } from "./types";

/** The 36 states and the FCT, as the area form offers them. */
export const STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

/**
 * What an observer can report. `value` is what the record carries; `label` is
 * the shorter wording on the picker.
 */
export const ACTIVITIES: { value: string; label: string; Icon: LucideIcon }[] = [
  { value: "Voting / queue update", label: "Voting & queues", Icon: Clock },
  { value: "Materials or logistics", label: "Materials & logistics", Icon: FileText },
  { value: "Safety or security concern", label: "Safety concern", Icon: CircleAlert },
  { value: "General election activity", label: "General activity", Icon: MapPin },
  { value: "Other observation", label: "Something else", Icon: FileText },
];

export const REPORT_STATUSES: ReportStatus[] = [
  "In review",
  "Reviewed",
  "Needs information",
  "Demo draft",
];

/** Pre-composed Tailwind classes per status: the list pill and the breakdown bar. */
export const STATUS_STYLES: Record<ReportStatus, { pill: string; bar: string }> = {
  Reviewed: { pill: "bg-reviewed-soft text-reviewed", bar: "bg-reviewed-bar" },
  "In review": { pill: "bg-in-review-soft text-in-review", bar: "bg-in-review-bar" },
  "Needs information": { pill: "bg-needs-info-soft text-needs-info", bar: "bg-needs-info-bar" },
  "Demo draft": { pill: "bg-draft-soft text-draft", bar: "bg-draft-bar" },
};

/** Rows per page on My reports. */
export const REPORTS_PAGE_SIZE = 3;

export const LIMITS = {
  name: 80,
  lga: 80,
  area: 100,
  location: 200,
  details: 1000,
  /** Characters of the observation shown on review before "Read full observation". */
  detailsPreview: 140,
  photoBytes: 10 * 1024 * 1024,
  videoBytes: 20 * 1024 * 1024,
  videoSeconds: 30,
} as const;

export const STORAGE_KEYS = {
  session: "sentinel-observer.session",
  /** Someone has used the app on this device, so open on Sign in rather than Create account. */
  returning: "sentinel-observer.returning",
  installDismissed: "sentinel-observer.install-dismissed",
};

/** The Sentinel landing site, for the header's way back. */
export const LANDING_URL =
  import.meta.env.VITE_LANDING_URL?.trim() ?? "https://sentinel-landing-web.netlify.app";
