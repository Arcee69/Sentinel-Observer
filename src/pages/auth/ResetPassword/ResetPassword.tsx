import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import EmailField from "../../../components/EmailField";
import Button, { ButtonLink } from "../../../components/ui/Button";
import { PasswordField, TextField } from "../../../components/ui/Field";
import { Eyebrow, Lead, Title } from "../../../components/ui/Typography";
import { errorMessage } from "../../../services/instance";
import * as service from "../../../services/observerService";
import { emailSchema, PASSWORD_HINT, passwordSchema } from "../../../lib/validation";

const schema = Yup.object({
  email: emailSchema,
  code: Yup.string()
    .trim()
    .required("Enter the code we emailed you")
    .matches(/^\d{6}$/, "The code is six digits"),
  password: passwordSchema,
});

/** Step two of recovery: the emailed code and a new password. */
export default function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      // Carried over from the recovery request, when they came from there.
      email: (state as { email?: string } | null)?.email ?? "",
      code: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setFormError(null);
      try {
        await service.resetPassword({
          email: values.email.trim(),
          code: values.code.trim(),
          password: values.password,
        });
        toast.success("Password changed. Sign in with your new password.");
        navigate("/login", { replace: true });
      } catch (error) {
        setFormError(errorMessage(error, "We couldn't change your password. Try again."));
      }
    },
  });

  const fieldError = (name: "email" | "code" | "password") =>
    formik.touched[name] ? formik.errors[name] : undefined;

  return (
    <>
      <Eyebrow>Account recovery</Eyebrow>
      <Title>Choose a new password</Title>
      <Lead>Enter the six-digit code we emailed you, then pick a new password.</Lead>

      <form onSubmit={formik.handleSubmit} noValidate>
        <EmailField
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={fieldError("email")}
        />

        <TextField
          label="Recovery code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="6-digit code"
          hint="Codes expire after 10 minutes."
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
