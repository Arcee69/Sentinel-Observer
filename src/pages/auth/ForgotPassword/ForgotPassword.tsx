import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PhoneField from "../../../components/PhoneField";
import Button, { ButtonLink } from "../../../components/ui/Button";
import Note from "../../../components/ui/Note";
import { Eyebrow, Lead, Title } from "../../../components/ui/Typography";
import { errorMessage } from "../../../services/instance";
import * as service from "../../../services/observerService";
import { phoneSchema } from "../../../lib/validation";

const schema = Yup.object({ phone: phoneSchema });

export default function ForgotPassword() {
  const [requested, setRequested] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { phone: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      setFormError(null);
      try {
        await service.requestRecovery(values.phone);
        setRequested(true);
      } catch (error) {
        setFormError(errorMessage(error, "We couldn't start recovery. Try again."));
      }
    },
  });

  return (
    <>
      <Eyebrow>Account recovery</Eyebrow>
      <Title>Forgot your password?</Title>
      <Lead>
        Enter your observer mobile number. A connected service would send a secure recovery
        code.
      </Lead>

      <form onSubmit={formik.handleSubmit} noValidate>
        <PhoneField
          value={formik.values.phone}
          onValueChange={(phone) => {
            setRequested(false);
            void formik.setFieldValue("phone", phone);
          }}
          onBlur={formik.handleBlur}
          error={formik.touched.phone ? formik.errors.phone : undefined}
        />

        {formError && (
          <p role="alert" className="my-2.5 text-xs text-destructive">
            {formError}
          </p>
        )}

        <Button type="submit" loading={formik.isSubmitting} className="mt-1.5">
          PREVIEW RECOVERY
        </Button>
      </form>

      <div role="status">
        {requested && <Note icon={false}>Recovery preview only. No SMS has been sent.</Note>}
      </div>

      <div className="mt-2.5 text-center">
        <ButtonLink variant="text" to="/login">
          ← Back to sign in
        </ButtonLink>
      </div>
    </>
  );
}
