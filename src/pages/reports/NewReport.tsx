import { Navigate, useSearchParams } from "react-router-dom";
import StepProgress from "../../components/StepProgress";
import { ButtonLink } from "../../components/ui/Button";
import { Eyebrow, Lead, Title } from "../../components/ui/Typography";
import { useObserver } from "../../context/auth";
import { useDraft } from "../../context/draft";
import { furthestStep, REPORT_STEPS, reportStepPath } from "../../lib/reports";
import ActivityStep from "./steps/ActivityStep";
import DetailsStep from "./steps/DetailsStep";
import EvidenceStep from "./steps/EvidenceStep";
import ReviewStep from "./steps/ReviewStep";

const HEADINGS = [
  { title: "What’s happening?", lead: "Choose an activity and confirm where and when." },
  { title: "Add the details.", lead: "Briefly describe what you personally observed." },
  { title: "Add evidence.", lead: "A photo or short clip can help. Both are optional." },
];

/**
 * The report wizard. The step is in the URL (`?step=`) so the device's back
 * button walks back through it; the answers are in the draft context, so they
 * survive leaving the wizard and coming back.
 */
export default function NewReport() {
  const [searchParams] = useSearchParams();
  const { draft } = useDraft();
  const observer = useObserver();

  // The API takes reports only from observers who have set their area.
  if (observer.areaSetupRequired) {
    return <Navigate to="/area/edit" replace state={{ returnTo: "/reports/new" }} />;
  }

  // A deep link or a stale history entry can't skip past unanswered steps.
  const requested = Math.trunc(Number(searchParams.get("step"))) || 1;
  const step = Math.min(Math.max(requested, 1), furthestStep(draft));

  if (step === REPORT_STEPS) return <ReviewStep />;

  const { title, lead } = HEADINGS[step - 1];

  return (
    <>
      <div className="mb-2 flex items-center justify-between gap-2.5">
        <Eyebrow>
          Report · Step {step} of {REPORT_STEPS}
        </Eyebrow>
        {step === 1 ? (
          <ButtonLink variant="text" to="/app">
            ← Dashboard
          </ButtonLink>
        ) : (
          <ButtonLink variant="text" to={reportStepPath(step - 1)}>
            ← Back
          </ButtonLink>
        )}
      </div>

      <StepProgress step={step} total={REPORT_STEPS} className="mb-4" />

      <Title>{title}</Title>
      <Lead>{lead}</Lead>

      {step === 1 && <ActivityStep />}
      {step === 2 && <DetailsStep />}
      {step === 3 && <EvidenceStep />}
    </>
  );
}
