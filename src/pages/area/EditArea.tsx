import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AreaForm from "../../components/AreaForm";
import { ButtonLink } from "../../components/ui/Button";
import { Eyebrow, Lead, Title } from "../../components/ui/Typography";
import { useAuth, useObserver } from "../../context/auth";
import { errorMessage } from "../../services/instance";
import type { AreaSelection } from "../../lib/types";

/**
 * Setting or changing the usual area. Opened from the area screen, the
 * dashboard, or the report wizard when no area is set yet — which it then
 * returns to.
 */
export default function EditArea() {
  const observer = useObserver();
  const { updateArea } = useAuth();
  const navigate = useNavigate();
  const returnTo = (useLocation().state as { returnTo?: string } | null)?.returnTo ?? "/area";

  const submit = async (area: AreaSelection) => {
    try {
      await updateArea(area);
      toast.success(observer.areaSetupRequired ? "Area set" : "Area updated");
      navigate(returnTo, { replace: true });
    } catch (error) {
      toast.error(errorMessage(error, "We couldn't save your area. Try again."));
    }
  };

  return (
    <>
      <div className="mb-2 flex items-center justify-between gap-2.5">
        <Eyebrow>Your observer profile</Eyebrow>
        <ButtonLink variant="text" to={returnTo === "/area" ? "/area" : "/app"}>
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
