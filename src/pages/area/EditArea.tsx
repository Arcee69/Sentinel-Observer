import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AreaForm from "../../components/AreaForm";
import { ButtonLink } from "../../components/ui/Button";
import { Eyebrow, Lead, Title } from "../../components/ui/Typography";
import { useAuth, useObserver } from "../../context/auth";
import { errorMessage } from "../../services/instance";
import type { AreaSelection } from "../../lib/types";

/** Changing the usual area later, from the area screen. */
export default function EditArea() {
  const observer = useObserver();
  const { updateArea } = useAuth();
  const navigate = useNavigate();

  const submit = async (area: AreaSelection) => {
    try {
      await updateArea(area);
      toast.success("Area updated");
      navigate("/area", { replace: true });
    } catch (error) {
      toast.error(errorMessage(error, "We couldn't save your area. Try again."));
    }
  };

  return (
    <>
      <div className="mb-2 flex items-center justify-between gap-2.5">
        <Eyebrow>Your observer profile</Eyebrow>
        <ButtonLink variant="text" to="/area">
          ← Back
        </ButtonLink>
      </div>

      <Title>Where will you observe?</Title>
      <Lead>
        {observer.areaSetupRequired
          ? "Set your area before you file your first report."
          : "Set your usual area so you can spend less time filling in each report."}
      </Lead>

      <AreaForm initial={observer} submitLabel="Save my area →" onSubmit={submit} />
    </>
  );
}
