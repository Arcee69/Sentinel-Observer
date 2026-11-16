import { createContext, useContext } from "react";
import type {
  PhotoAttachment,
  ReportDraft,
  SubmissionProgress,
  VideoAttachment,
} from "../lib/types";

export interface DraftValue {
  draft: ReportDraft;
  photo: PhotoAttachment | null;
  video: VideoAttachment | null;
  update: (patch: ReportDraft) => void;
  /** Replaces the attachment; the previous one's object URL is released. */
  setPhoto: (photo: PhotoAttachment | null) => void;
  setVideo: (video: VideoAttachment | null) => void;
  /**
   * How much of this report the server already holds after a failed attempt.
   * Read when submitting, never rendered.
   */
  getSubmission: () => SubmissionProgress | null;
  setSubmission: (progress: SubmissionProgress | null) => void;
  /** Clears the fields and the submission progress, and releases both attachments. */
  reset: () => void;
}

export const DraftContext = createContext<DraftValue | null>(null);

/** The report the observer is part-way through, kept while they move around the app. */
export function useDraft(): DraftValue {
  const context = useContext(DraftContext);
  if (!context) throw new Error("useDraft must be used inside <DraftProvider>");
  return context;
}
