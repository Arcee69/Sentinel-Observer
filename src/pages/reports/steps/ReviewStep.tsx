import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Button, { ButtonLink } from "../../../components/ui/Button";
import { Caption, Eyebrow, Lead, Title } from "../../../components/ui/Typography";
import VideoPreview from "../../../components/VideoPreview";
import { useDraft } from "../../../context/draft";
import { useSaveReport } from "../../../hooks/useReports";
import { LIMITS } from "../../../lib/constants";
import { formatObservedAt } from "../../../lib/format";
import { REPORT_STEPS, reportStepPath } from "../../../lib/reports";
import { errorMessage } from "../../../services/instance";

/** Step 4: everything the observer entered, to confirm before saving. */
export default function ReviewStep() {
  const { draft, photo, video } = useDraft();
  const save = useSaveReport();
  const navigate = useNavigate();

  // The wizard only renders this step once the earlier ones are answered.
  const category = draft.category ?? "";
  const location = draft.location ?? "";
  const details = draft.details ?? "";
  const long = details.length > LIMITS.detailsPreview;

  const submit = async () => {
    try {
      await save.mutateAsync({ category, location, hasVideo: video !== null });
      // The confirmation screen clears the draft once it has taken over.
      navigate("/reports/saved", { replace: true, state: { saved: true } });
    } catch (error) {
      toast.error(errorMessage(error, "We couldn't save your report. Try again."));
    }
  };

  return (
    <>
      <Eyebrow>
        Report · Step {REPORT_STEPS} of {REPORT_STEPS}
      </Eyebrow>
      <Title>Ready to review?</Title>
      <Lead>Confirm the details before saving your demo.</Lead>

      <div className="mt-3.25 rounded-card border border-border bg-surface p-3.5 wrap-anywhere">
        <Caption className="mb-1.25">Activity</Caption>
        <strong>{category}</strong>
        <hr className="my-4 border-border" />

        <Row label="Location">{location}</Row>
        <Row label="Time observed">{formatObservedAt(draft.when ?? "")}</Row>

        <Row label="Observation">
          <span className="whitespace-pre-wrap">
            {long ? `${details.slice(0, LIMITS.detailsPreview)}…` : details}
          </span>
        </Row>
        {long && (
          <details className="mb-2.5">
            <summary className="text-[11px] text-primary">Read full observation</summary>
            <p className="mt-1.25 text-xs leading-[1.65] whitespace-pre-wrap text-muted-foreground">
              {details}
            </p>
          </details>
        )}

        {photo && (
          <Row label="Selected photo">
            <span className="flex items-center gap-2.5">
              <img
                src={photo.url}
                alt=""
                className="size-11 shrink-0 rounded-lg border border-border object-cover"
              />
              <span className="min-w-0">{photo.file.name} · Preview only</span>
            </span>
          </Row>
        )}

        {video && (
          <>
            <Caption>Short video</Caption>
            <VideoPreview video={video} label="Review attached video" />
          </>
        )}
      </div>

      <Button onClick={() => void submit()} loading={save.isPending} className="mt-3">
        Save demo report
      </Button>
      <ButtonLink variant="secondary" to={reportStepPath(2)} className="mt-2.5">
        Edit observation
      </ButtonLink>

      <p className="mt-2.5 text-center text-[11px] text-subtle">
        Nothing will be sent to the Sentinel team in this preview.
      </p>
    </>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-3">
      <Caption className="mb-1.25">{label}</Caption>
      <p className="text-xs leading-[1.65] text-muted-foreground">{children}</p>
    </div>
  );
}
