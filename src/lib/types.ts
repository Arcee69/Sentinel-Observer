/** Display types shared across screens, then the API's own shapes. */

/**
 * Where an observer usually reports from. The IDs are the API's geography
 * units; the names are kept beside them for display.
 */
export interface ObserverArea {
  stateId: string | null;
  state: string;
  lgaId: string | null;
  lga: string;
  /** Optional. */
  wardId: string | null;
  ward: string;
  /** Free text — optional. */
  community: string;
}

export interface Observer extends ObserverArea {
  id: string;
  name: string;
  /** Signs in with this; recovery codes go here too. */
  email: string;
  /** As the API normalises it: +234… */
  phone: string;
  /** The account has no area yet; the API won't take reports until it does. */
  areaSetupRequired: boolean;
}

/** What the area form hands over. */
export interface AreaSelection {
  stateId: string;
  lgaId: string;
  wardId: string | null;
  community: string;
}

/** One entry in an area dropdown. */
export interface Place {
  id: string;
  name: string;
}

/**
 * Step one of sign-up, held in memory until the area step creates the account.
 * The password is never persisted.
 */
export interface SignupDetails {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface Session {
  /** Bearer token from the API. */
  token: string;
  /** ISO timestamp the token stops working, when the API gives one. */
  expiresAt: string | null;
  observer: Observer;
}

export type ReportStatus = "In review" | "Reviewed" | "Needs information" | "Draft";

export interface ObserverReport {
  id: string;
  /** The activity observed. */
  title: string;
  /** Where it was observed. */
  area: string;
  status: ReportStatus;
  /** Display stamp, e.g. "16 Nov 2026 · 10:45 am". */
  time: string;
  /** What the reviewer asked for, on a report that needs information. */
  reviewNotes: string | null;
}

export interface Dashboard {
  total: number;
  counts: Record<ReportStatus, number>;
  /** Newest first. */
  recent: ObserverReport[];
}

export interface ReportPage {
  reports: ObserverReport[];
  page: number;
  pages: number;
  total: number;
}

/** What the report wizard hands over when the observer submits. */
export interface NewReport {
  /** API category code. */
  category: string;
  location: string;
  details: string;
  /** ISO timestamp with timezone. */
  observedAt: string;
  photo: File | null;
  video: File | null;
}

/**
 * How much of the report being filed the server already holds, so a retry
 * resumes where the last attempt stopped instead of filing it twice.
 */
export interface SubmissionProgress {
  /** Sent as `client_submission_id`; the same value on every retry. */
  submissionId: string;
  reportId?: string;
  revision?: number;
  /** The files already uploaded, by slot. */
  photo?: File;
  video?: File;
}

/**
 * A report in progress. Fields stay undefined until the observer first
 * touches them, so the form can tell "not yet filled" from "cleared".
 */
export interface ReportDraft {
  /** API category code. */
  category?: string;
  location?: string;
  /** `datetime-local` value: YYYY-MM-DDTHH:mm in the observer's own timezone. */
  when?: string;
  details?: string;
}

export interface PhotoAttachment {
  file: File;
  /** Object URL — owned and revoked by the draft provider. */
  url: string;
}

export interface VideoAttachment extends PhotoAttachment {
  /** Seconds. */
  duration: number;
}

/* -------------------------------------------------------------------------- */
/*                                 API shapes                                 */
/* -------------------------------------------------------------------------- */

export interface ApiObserver {
  id: string;
  name: string;
  /** Absent on accounts created before sign-in moved to email. */
  email?: string | null;
  phone: string;
  role: string;
  status: string;
  area_setup_required: boolean;
  responsible_reporting_accepted: boolean;
  phone_verified_at: string | null;
  state_id: string | null;
  state_name: string | null;
  lga_id: string | null;
  lga_name: string | null;
  ward_id: string | null;
  ward_name: string | null;
  community: string | null;
  created_at: string;
}

/** `data` from register and login. */
export interface ApiAuthResult {
  observer: ApiObserver;
  token: string;
  token_type: string;
  expires_at: string | null;
}

export interface ApiArea {
  id: string;
  parent_id: string | null;
  kind: "state" | "lga" | "ward";
  /** Upper case, as the electoral register spells it. */
  name: string;
  official_code: string;
}

export interface ApiMetadata {
  /** Category code → label. */
  categories: Record<string, string>;
  statuses: ApiReportStatus[];
  registration_requires_area: boolean;
  reporting_requires_area: boolean;
  password_min_length: number;
  password_requires: string[];
  photo_max_bytes: number;
  video_max_bytes: number;
  video_max_seconds: number;
  /** Where recovery codes are sent. */
  password_recovery_channel: "email" | "sms";
  /** False while the server has no mail (SMTP) set up; recovery requests then answer 503. */
  email_recovery_available: boolean;
  sms_recovery_available: boolean;
}

export type ApiReportStatus = "draft" | "in_review" | "reviewed" | "needs_information";

export interface ApiMedia {
  id: string;
  slot: "photo" | "video";
  original_filename: string;
  media_type: string;
  byte_size: number;
  scan_state: string;
  review_state: string;
  downloadable: boolean;
}

export interface ApiReport {
  id: string;
  client_submission_id: string;
  category: string;
  category_label: string;
  location: string;
  details: string;
  observed_at: string;
  status: ApiReportStatus;
  /** Sent back as `expected_revision` on every change. */
  revision: number;
  review_notes: string | null;
  reviewed_at: string | null;
  submitted_at: string | null;
  created_at: string;
  media: ApiMedia[];
}

export interface ApiDashboard {
  observer: ApiObserver;
  counts: { total: number } & Record<ApiReportStatus, number>;
  recent_reports: ApiReport[];
}
