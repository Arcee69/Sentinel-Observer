/** Display types shared across screens. */

/** Where an observer usually reports from. */
export interface ObserverArea {
  state: string;
  lga: string;
  /** Ward or community — optional. */
  area: string;
}

export interface Observer extends ObserverArea {
  name: string;
  phone: string;
}

/** Step one of sign-up, held until the area step completes the account. */
export interface SignupDetails {
  name: string;
  phone: string;
}

export interface Credentials {
  phone: string;
  password: string;
}

export interface Session {
  observer: Observer;
}

export type ReportStatus = "In review" | "Reviewed" | "Needs information" | "Demo draft";

export interface ObserverReport {
  id: string;
  /** The activity observed. */
  title: string;
  /** Where it was observed. */
  area: string;
  status: ReportStatus;
  /** Display stamp, e.g. "Sample · 10:45 am". */
  time: string;
}

/** What the report wizard hands over when the observer saves. */
export interface NewReport {
  category: string;
  location: string;
  hasVideo: boolean;
}

/**
 * A report in progress. Fields stay undefined until the observer first
 * touches them, so the form can tell "not yet filled" from "cleared".
 */
export interface ReportDraft {
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
