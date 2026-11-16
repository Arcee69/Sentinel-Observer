import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import PhoneField from "../../../components/PhoneField";
import Button, { ButtonLink } from "../../../components/ui/Button";
import Note from "../../../components/ui/Note";
import { Eyebrow, Lead, Title } from "../../../components/ui/Typography";
import { useMetadata } from "../../../hooks/useMetadata";
import { toApiError } from "../../../services/errors";
import { errorMessage } from "../../../services/instance";
import * as service from "../../../services/observerService";
import { phoneSchema } from "../../../lib/validation";

const schema = Yup.object({ phone: phoneSchema });

const UNAVAILABLE = "Recovery by text message isn't available right now. Please try again later.";

/** Step one of recovery: ask for a code by text. The reset screen takes it from there. */
export default function ForgotPassword() {
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  // The API says up front whether it can send texts at the moment.
  const unavailable = useMetadata().data?.sms_recovery_available === false;

  const formik = useFormik({
    initialValues: { phone: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      setFormError(null);
      try {
        await service.requestRecovery(values.phone);
        navigate("/reset-password", { state: { phone: values.phone } });
      } catch (error) {
        setFormError(
          toApiError(error).status === 503
            ? UNAVAILABLE
            : errorMessage(error, "We couldn't start recovery. Try again."),
        );
      }
    },
  });

  return (
    <>
      <Eyebrow>Account recovery</Eyebrow>
      <Title>Forgot your password?</Title>
      <Lead>
        Enter your observer mobile number and we'll text you a recovery code.
      </Lead>

      <form onSubmit={formik.handleSubmit} noValidate>
        <PhoneField
          value={formik.values.phone}
          onValueChange={(phone) => void formik.setFieldValue("phone", phone)}
          onBlur={formik.handleBlur}
          error={formik.touched.phone ? formik.errors.phone : undefined}
        />

        {formError && (
          <p role="alert" className="my-2.5 text-xs text-destructive">
            {formError}
          </p>
        )}

        <Button
          type="submit"
          loading={formik.isSubmitting}
          disabled={unavailable}
          className="mt-1.5"
        >
          Send recovery code
        </Button>
      </form>

      <div role="status">{unavailable && <Note icon={false}>{UNAVAILABLE}</Note>}</div>

      <div className="mt-2.5 text-center">
        <ButtonLink variant="text" to="/reset-password">
          I already have a code
        </ButtonLink>
      </div>

      <div className="text-center">
        <ButtonLink variant="text" to="/login">
          ← Back to sign in
        </ButtonLink>
      </div>
    </>
  );
}
