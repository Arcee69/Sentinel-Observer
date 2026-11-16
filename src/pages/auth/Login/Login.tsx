import { useState } from "react";
import { useFormik } from "formik";
import { useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import AuthTabs from "../../../components/AuthTabs";
import PhoneField from "../../../components/PhoneField";
import Button, { ButtonLink } from "../../../components/ui/Button";
import { PasswordField } from "../../../components/ui/Field";
import Note from "../../../components/ui/Note";
import { Eyebrow, Lead, Title } from "../../../components/ui/Typography";
import { useAuth } from "../../../context/auth";
import { errorMessage } from "../../../services/instance";
import { phoneSchema } from "../../../lib/validation";

const schema = Yup.object({
  phone: phoneSchema,
  password: Yup.string().required("Enter your password"),
});

export default function Login() {
  const { signIn } = useAuth();
  const [searchParams] = useSearchParams();
  // The API instance sends an observer here with `?expired=1` when their token is rejected.
  const [formError, setFormError] = useState<string | null>(
    searchParams.has("expired") ? "Your session has ended. Sign in again." : null,
  );

  const formik = useFormik({
    initialValues: { phone: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      setFormError(null);
      try {
        // Signing in flips the public-only gate, which opens the dashboard.
        await signIn(values);
      } catch (error) {
        setFormError(errorMessage(error, "We couldn't sign you in. Try again."));
      }
    },
  });

  const fieldError = (name: "phone" | "password") =>
    formik.touched[name] ? formik.errors[name] : undefined;

  return (
    <>
      <AuthTabs />

      <Eyebrow>Observer access</Eyebrow>
      <Title>Welcome back</Title>
      <Lead>Sign in to report an activity or follow up on your observations.</Lead>

      <form onSubmit={formik.handleSubmit} noValidate>
        <PhoneField
          value={formik.values.phone}
          onValueChange={(phone) => void formik.setFieldValue("phone", phone)}
          onBlur={formik.handleBlur}
          error={fieldError("phone")}
        />

        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={fieldError("password")}
        />

        <div className="flex justify-end">
          <ButtonLink variant="text" size="lg" to="/forgot-password">
            Forgot password?
          </ButtonLink>
        </div>

        {formError && (
          <p role="alert" className="my-2.5 text-xs text-destructive">
            {formError}
          </p>
        )}

        <Button type="submit" loading={formik.isSubmitting} className="mt-1.5">
          Sign in →
        </Button>
      </form>

      <Note>
        Use your observer account. Agent accounts sign in through the Agent Login page.
      </Note>

    </>
  );
}
