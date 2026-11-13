import { formatMegabytes, formatSeconds } from "../lib/format";
import type { VideoAttachment } from "../lib/types";

interface VideoPreviewProps {
  video: VideoAttachment;
  /** Accessible name for the player. */
  label: string;
}

/**
 * The attached clip's details, with the player tucked behind a disclosure so
 * it doesn't push the rest of the form off a small screen.
 */
export default function VideoPreview({ video, label }: VideoPreviewProps) {
  return (
    <>
      <p className="mt-2 text-[10px] leading-[1.7] wrap-anywhere text-subtle">
        {video.file.name} · {formatSeconds(video.duration)} · {formatMegabytes(video.file.size)}
      </p>
      <details className="open:mb-1.75">
        <summary className="min-h-8 py-1.75 text-[11px] text-primary">Play video preview</summary>
        <video
          src={video.url}
          controls
          playsInline
          preload="metadata"
          aria-label={label}
          className="mt-2 block max-h-36.25 w-full rounded-control bg-console object-contain"
        />
      </details>
    </>
  );
}
