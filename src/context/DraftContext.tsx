import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DraftContext, type DraftValue } from "./draft";
import type { PhotoAttachment, ReportDraft, VideoAttachment } from "../lib/types";

/**
 * Holds the in-progress report above the wizard, so switching to the dashboard
 * or the report list and back doesn't lose what was typed or attached. It lives
 * in memory only: signing out unmounts it and the draft goes with it.
 */
export function DraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<ReportDraft>({});
  const [photo, setPhotoState] = useState<PhotoAttachment | null>(null);
  const [video, setVideoState] = useState<VideoAttachment | null>(null);

  // Object URLs pin the file in memory until revoked — track what's live.
  const urls = useRef<{ photo: string | null; video: string | null }>({
    photo: null,
    video: null,
  });

  const swap = useCallback((slot: "photo" | "video", next: string | null) => {
    const previous = urls.current[slot];
    if (previous && previous !== next) URL.revokeObjectURL(previous);
    urls.current[slot] = next;
  }, []);

  const update = useCallback((patch: ReportDraft) => {
    setDraft((current) => ({ ...current, ...patch }));
  }, []);

  const setPhoto = useCallback(
    (next: PhotoAttachment | null) => {
      swap("photo", next?.url ?? null);
      setPhotoState(next);
    },
    [swap],
  );

  const setVideo = useCallback(
    (next: VideoAttachment | null) => {
      swap("video", next?.url ?? null);
      setVideoState(next);
    },
    [swap],
  );

  const reset = useCallback(() => {
    setDraft({});
    setPhoto(null);
    setVideo(null);
  }, [setPhoto, setVideo]);

  useEffect(() => {
    const live = urls.current;
    return () => {
      if (live.photo) URL.revokeObjectURL(live.photo);
      if (live.video) URL.revokeObjectURL(live.video);
    };
  }, []);

  const value = useMemo<DraftValue>(
    () => ({ draft, photo, video, update, setPhoto, setVideo, reset }),
    [draft, photo, video, update, setPhoto, setVideo, reset],
  );

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}
