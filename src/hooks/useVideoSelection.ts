import { useCallback, useEffect, useRef, useState } from "react";
import { useDraft } from "../context/draft";
import { attachVideo } from "../lib/media";

/**
 * Picks and vets the report's video clip.
 *
 * Reading a clip's length is asynchronous, and an observer can pick a second
 * file — or remove the first — before it finishes. Each selection is numbered
 * so a slow check that has been superseded is dropped instead of overwriting
 * the newer choice.
 */
export function useVideoSelection() {
  const { video, setVideo } = useDraft();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const selection = useRef(0);

  useEffect(
    () => () => {
      // Leaving the step abandons any check still running.
      selection.current++;
    },
    [],
  );

  const clear = useCallback(() => {
    selection.current++;
    setVideo(null);
    setPending(false);
    setError("");
  }, [setVideo]);

  const choose = useCallback(
    async (file: File | undefined) => {
      if (!file) return;

      const current = ++selection.current;
      setVideo(null);
      setError("");
      setPending(true);

      try {
        const attachment = await attachVideo(file);

        if (current !== selection.current) {
          URL.revokeObjectURL(attachment.url);
          return;
        }

        setVideo(attachment);
        setPending(false);
      } catch (reason) {
        if (current !== selection.current) return;
        setPending(false);
        setError(reason instanceof Error ? reason.message : "This video could not be attached.");
      }
    },
    [setVideo],
  );

  return { video, pending, error, choose, clear };
}
