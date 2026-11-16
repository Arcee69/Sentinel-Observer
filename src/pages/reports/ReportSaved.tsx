import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Check } from "lucide-react";
import { ButtonLink } from "../../components/ui/Button";
import { Eyebrow, Lead, Title } from "../../components/ui/Typography";
import { useDraft } from "../../context/draft";

/** Confirmation after the wizard submits. Only reachable from a submission. */
export default function ReportSaved() {
  const { state } = useLocation();
  const { reset } = useDraft();
  const saved = (state as { saved?: boolean } | null)?.saved === true;

  // The draft is cleared here rather than by the wizard: clearing it there
  // would flash an empty first step before this screen replaced it.
  useEffect(() => {
    if (saved) reset();
  }, [saved, reset]);

  if (!saved) return <Navigate to="/reports" replace />;

  return (
    <>
      <div className="mt-1.75 mb-5.25 grid size-14 place-items-center rounded-[17px] bg-success-soft text-success">
        <Check className="size-7" strokeWidth={2} aria-hidden />
      </div>

      <Eyebrow>Report sent</Eyebrow>
      <Title>Your report is in review.</Title>
      <Lead>
        The Sentinel team has it now. You can follow its status from your dashboard.
      </Lead>

      <ButtonLink to="/app" replace>
        Back to dashboard →
      </ButtonLink>
    </>
  );
}
