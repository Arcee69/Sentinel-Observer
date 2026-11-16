import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import PhoneField from "../../../components/PhoneField";
import Button, { ButtonLink } from "../../../components/ui/Button";
import { PasswordField, TextField } from "../../../components/ui/Field";
import { Eyebrow, Lead, Title } from "../../../components/ui/Typography";
import { errorMessage } from "../../../services/instance";
import * as service from "../../../services/observerService";
import { PASSWORD_HINT, passwordSchema, phoneSchema } from "../../../lib/validation";

const schema = Yup.object({
  phone: phoneSchema,
  code: Yup.string().trim().required("Enter the code we texted you"),
  password: passwordSchema,
});

/** Step two of recovery: the texted code and a new password. */
export default function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      // Carried over from the recovery request, when they came from there.
      phone: (state as { phone?: string } | null)?.phone ?? "",
      code: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setFormError(null);
      try {
        await service.resetPassword({ ...values, code: values.code.trim() });
        toast.success("Password changed. Sign in with your new password.");
        navigate("/login", { replace: true });
      } catch (error) {
        setFormError(errorMessage(error, "We couldn't change your password. Try again."));
      }
    },
  });

  const fieldError = (name: "phone" | "code" | "password") =>
    formik.touched[name] ? formik.errors[name] : undefined;

  return (
    <>
      <Eyebrow>Account recovery</Eyebrow>
      <Title>Choose a new password</Title>
      <Lead>Enter the recovery code we texted you, then pick a new password.</Lead>

      <form onSubmit={formik.handleSubmit} noValidate>
        <PhoneField
          value={formik.values.phone}
          onValueChange={(phone) => void formik.setFieldValue("phone", phone)}
          onBlur={formik.handleBlur}
          error={fieldError("phone")}
        />

        <TextField
          label="Recovery code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="The code from your text message"
          value={formik.values.code}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={fieldError("code")}
        />

        <PasswordField
          label="New password"
          name="password"
          autoComplete="new-password"
          placeholder="Choose a strong password"
          hint={PASSWORD_HINT}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={fieldError("password")}
        />

        {formError && (
          <p role="alert" className="my-2.5 text-xs text-destructive">
            {formError}
          </p>
        )}

        <Button type="submit" loading={formik.isSubmitting} className="mt-1.5">
          Change password
        </Button>
      </form>

      <div className="mt-2.5 text-center">
        <ButtonLink variant="text" to="/forgot-password">
          Send me a new code
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
