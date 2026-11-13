import { LIMITS } from "./constants";
import type { PhotoAttachment, VideoAttachment } from "./types";

/**
 * Checks on evidence before it is attached to a report. Each returns the
 * attachment or throws an Error whose message is ready to show the observer.
 * A returned attachment owns an object URL the caller must eventually revoke.
 */

const VIDEO_EXTENSION = /\.(mp4|mov|webm)$/i;

/** How long to wait for a clip's metadata before giving up on it. */
const METADATA_TIMEOUT_MS = 10_000;

export function attachPhoto(file: File): PhotoAttachment {
  if (file.size > LIMITS.photoBytes || !file.type.startsWith("image/")) {
    throw new Error("Choose an image up to 10 MB.");
  }

  return { file, url: URL.createObjectURL(file) };
}

/** Reads a clip's length from its metadata without playing it. */
function readDuration(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    const finish = (error?: string) => {
      clearTimeout(timer);
      video.onloadedmetadata = null;
      video.onerror = null;
      const { duration } = video;
      // Let go of the file so the element can be collected.
      video.removeAttribute("src");
      video.load();
      if (error) reject(new Error(error));
      else resolve(duration);
    };

    const timer = setTimeout(
      () => finish("We could not read this clip. Try a shorter MP4 video."),
      METADATA_TIMEOUT_MS,
    );
    video.onloadedmetadata = () => finish();
    video.onerror = () => finish("This video could not be opened. Try an MP4 video.");
    video.src = url;
  });
}

export async function attachVideo(file: File): Promise<VideoAttachment> {
  if (!VIDEO_EXTENSION.test(file.name) || !file.type.startsWith("video/")) {
    throw new Error("Choose an MP4, MOV or WebM video.");
  }
  if (file.size > LIMITS.videoBytes) {
    throw new Error("This clip is larger than 20 MB. Choose a smaller video.");
  }
  if (!file.size) {
    throw new Error("This video is empty. Please choose another clip.");
  }

  const url = URL.createObjectURL(file);

  try {
    const duration = await readDuration(url);

    if (!Number.isFinite(duration) || duration <= 0) {
      throw new Error("We could not read the video length. Try another clip.");
    }
    if (duration > LIMITS.videoSeconds) {
      throw new Error(
        `This clip is ${Math.ceil(duration)} seconds long. Trim it to ${LIMITS.videoSeconds} seconds or less.`,
      );
    }

    return { file, url, duration };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}
