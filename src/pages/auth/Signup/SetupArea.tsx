import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AreaForm from "../../../components/AreaForm";
import StepProgress from "../../../components/StepProgress";
import { ButtonLink } from "../../../components/ui/Button";
import { Eyebrow, Lead, Title } from "../../../components/ui/Typography";
import { useAuth } from "../../../context/auth";
import { toApiError } from "../../../services/errors";
import { errorMessage } from "../../../services/instance";
import type { AreaSelection } from "../../../lib/types";

/** Step two of two: where the observer reports from. Finishing it opens the dashboard. */
export default function SetupArea() {
  const { pendingSignup, completeSignup } = useAuth();
  const navigate = useNavigate();

  // Opened directly, or after a refresh dropped step one.
  if (!pendingSignup) return <Navigate to="/signup" replace />;

  const submit = async (area: AreaSelection) => {
    try {
      // Signing in flips the public-only gate, which takes it from here.
      await completeSignup(area);
    } catch (error) {
      toast.error(errorMessage(error, "We couldn't set up your account. Try again."));

      // A number already in use, or a rejected name or password, is fixed on step one.
      const failure = toApiError(error);
      const { name, phone, password } = failure.fieldErrors;
      if (failure.isConflict || name || phone || password) navigate("/signup");
    }
  };

  return (
    <>
      <StepProgress step={2} total={2} />

      <Eyebrow>Step 2 of 2 · Your area</Eyebrow>
      <Title>Where will you observe?</Title>
      <Lead>Set your usual area so you can spend less time filling in each report.</Lead>

      <AreaForm submitLabel="Open my dashboard →" onSubmit={submit} />

      <div className="mt-2.5 text-center">
        <ButtonLink variant="text" to="/signup">
          ← Back to your details
        </ButtonLink>
      </div>
    </>
  );
}
