import { useId, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import PhotoPicker from "../../../components/PhotoPicker";
import VideoPicker from "../../../components/VideoPicker";
import Button from "../../../components/ui/Button";
import { useVideoSelection } from "../../../hooks/useVideoSelection";
import { REPORT_STEPS, reportStepPath } from "../../../lib/reports";

/** Step 3: an optional photo and an optional short clip. */
export default function EvidenceStep() {
  const navigate = useNavigate();
  const video = useVideoSelection();
  const videoErrorId = useId();

  const submit = (event: FormEvent) => {
    event.preventDefault();

    // A rejected clip has to be removed or replaced before moving on —
    // otherwise the review would silently drop it.
    if (video.pending || video.error) {
      document
        .getElementById(videoErrorId)
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    navigate(reportStepPath(REPORT_STEPS));
  };

  return (
    <form onSubmit={submit} noValidate>
      <PhotoPicker />

      <VideoPicker
        video={video.video}
        pending={video.pending}
        error={video.error}
        onChoose={(file) => void video.choose(file)}
        onClear={video.clear}
        errorId={videoErrorId}
      />

      <Button type="submit" disabled={video.pending} className="mt-1.5">
        Review report →
      </Button>
    </form>
  );
}
