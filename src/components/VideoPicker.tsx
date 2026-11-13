import { useId, type ChangeEvent } from "react";
import { Plus, Video } from "lucide-react";
import Button from "./ui/Button";
import { Caption } from "./ui/Typography";
import VideoPreview from "./VideoPreview";
import type { VideoAttachment } from "../lib/types";

interface VideoPickerProps {
  video: VideoAttachment | null;
  /** The clip's length is still being read. */
  pending: boolean;
  error: string;
  onChoose: (file: File | undefined) => void;
  onClear: () => void;
  /** Id for the error line, so the form can scroll to it. */
  errorId: string;
}

/** Optional short clip: choose a file or record one, then preview it. */
export default function VideoPicker({
  video,
  pending,
  error,
  onChoose,
  onClear,
  errorId,
}: VideoPickerProps) {
  const fileId = useId();
  const recordId = useId();

  const handle = (event: ChangeEvent<HTMLInputElement>) => {
    onChoose(event.target.files?.[0]);
    // Let the same clip be picked again after a removal.
    event.target.value = "";
  };

  return (
    <div className="my-2.75 rounded-xl border border-border bg-surface p-2.75">
      <div className="flex items-center justify-between gap-2.5">
        <Caption>
          Short video <span className="font-normal text-subtle">(optional)</span>
        </Caption>
        <span className="rounded-full bg-primary-soft px-1.75 py-0.75 text-[9px] text-ember">
          30 sec max
        </span>
      </div>
      <p className="mt-1.25 mb-2 text-[9px] leading-[1.7] text-subtle">
        One clip · 20 MB · MP4, MOV or WebM
      </p>

      <label
        htmlFor={fileId}
        className="flex min-h-10.75 items-center gap-2.25 rounded-control border border-dashed border-primary-dashed bg-primary-soft/50 px-2.5 py-2.25 text-[11px] text-primary has-[+input:focus-visible]:outline-3 has-[+input:focus-visible]:outline-offset-2 has-[+input:focus-visible]:outline-ring"
      >
        <Video className="size-4.75 shrink-0" strokeWidth={1.6} aria-hidden />
        <span>{video ? "Choose a different video" : "Choose a video"}</span>
        <Plus className="ml-auto size-4.5 shrink-0" strokeWidth={1.6} aria-hidden />
      </label>
      <input
        id={fileId}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
        className="sr-only"
        onChange={handle}
      />

      <div className="text-center">
        <label
          htmlFor={recordId}
          className="inline-flex min-h-8.25 items-center justify-center p-1.5 text-[11px] text-primary has-[+input:focus-visible]:outline-3 has-[+input:focus-visible]:outline-ring"
        >
          Record with camera
        </label>
        <input
          id={recordId}
          type="file"
          accept="video/*"
          capture="environment"
          className="sr-only"
          onChange={handle}
        />
      </div>

      <p role="status" aria-live="polite" className="text-[11px] text-ember empty:hidden">
        {pending ? "Checking video length…" : ""}
      </p>

      {video && <VideoPreview video={video} label="Attached video preview" />}

      <p id={errorId} role="alert" className="my-2.5 text-xs text-destructive empty:hidden">
        {error}
      </p>

      {(video || error || pending) && (
        <Button variant="text" onClick={onClear}>
          Remove video
        </Button>
      )}

      <p className="mt-1.25 text-[9px] leading-[1.7] text-subtle">
        Preview only · Nothing is uploaded.
      </p>
    </div>
  );
}
