import { useId, useState } from "react";
import { Image, Plus } from "lucide-react";
import Button from "./ui/Button";
import { useDraft } from "../context/draft";
import { attachPhoto, PHOTO_TYPES } from "../lib/media";

/** Optional single photo for the report — picked from the gallery or camera. */
export default function PhotoPicker() {
  const { photo, setPhoto } = useDraft();
  const [error, setError] = useState("");
  const inputId = useId();

  const choose = (file: File | undefined) => {
    if (!file) return;

    try {
      setPhoto(attachPhoto(file));
      setError("");
    } catch (reason) {
      setPhoto(null);
      setError(reason instanceof Error ? reason.message : "This photo could not be attached.");
    }
  };

  return (
    <div className="my-3">
      <label
        htmlFor={inputId}
        className="flex min-h-10.75 items-center gap-2.25 rounded-control border border-dashed border-primary-dashed bg-surface px-2.5 py-2.25 text-[11px] text-primary has-[+input:focus-visible]:outline-3 has-[+input:focus-visible]:outline-offset-2 has-[+input:focus-visible]:outline-ring"
      >
        <Image className="size-4.75 shrink-0" strokeWidth={1.6} aria-hidden />
        <span>
          {photo ? "Change photo" : "Add a photo"}{" "}
          <small className="text-[9px] font-normal">(optional · 10 MB)</small>
        </span>
        <Plus className="ml-auto size-4.5 shrink-0" strokeWidth={1.6} aria-hidden />
      </label>
      <input
        id={inputId}
        type="file"
        accept={PHOTO_TYPES.join(",")}
        className="sr-only"
        onChange={(event) => {
          choose(event.target.files?.[0]);
          // Let the same file be picked again after a removal.
          event.target.value = "";
        }}
      />

      {photo && (
        <>
          <p className="mt-1.5 text-[9px] wrap-anywhere text-subtle">{photo.file.name} · Attached</p>
          <Button variant="text" onClick={() => setPhoto(null)}>
            Remove photo
          </Button>
        </>
      )}

      {error && (
        <p role="alert" className="my-2.5 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
