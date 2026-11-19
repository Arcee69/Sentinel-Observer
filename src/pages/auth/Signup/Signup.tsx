import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthTabs from "../../../components/AuthTabs";
import EmailField from "../../../components/EmailField";
import PhoneField from "../../../components/PhoneField";
import Button from "../../../components/ui/Button";
import { PasswordField, TextField } from "../../../components/ui/Field";
import Note from "../../../components/ui/Note";
import { Eyebrow, Lead, Title } from "../../../components/ui/Typography";
import { useAuth } from "../../../context/auth";
import { LIMITS } from "../../../lib/constants";
import { emailSchema, PASSWORD_HINT, passwordSchema, phoneSchema } from "../../../lib/validation";

const schema = Yup.object({
  name: Yup.string().trim().required("Please enter your name.").max(LIMITS.name),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
});

/** Step one of two: who the observer is. The area step completes the account. */
export default function Signup() {
  const { pendingSignup, beginSignup } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    // Coming back from the area step restores the details, never the password.
    initialValues: {
      name: pendingSignup?.name ?? "",
      email: pendingSignup?.email ?? "",
      phone: pendingSignup?.phone ?? "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      // Held in memory only: the area step sends it with the rest of the account.
      beginSignup({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone,
        password: values.password,
      });
      navigate("/signup/area");
    },
  });

  const fieldError = (name: "name" | "email" | "phone" | "password") =>
    formik.touched[name] ? formik.errors[name] : undefined;

  return (
    <>
      <AuthTabs />

      <Eyebrow>Step 1 of 2 · A little about you</Eyebrow>
      <Title>Let’s get you started</Title>
      <Lead>Just a few details, then you’re ready to report from your area.</Lead>

      <form onSubmit={formik.handleSubmit} noValidate>
        <TextField
          label="Full name"
          name="name"
          autoComplete="name"
          placeholder="Your first and last name"
          maxLength={LIMITS.name}
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={fieldError("name")}
        />

        <EmailField
          hint="You'll sign in with this. Recovery codes are sent here too."
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={fieldError("email")}
        />

        <PhoneField
          value={formik.values.phone}
          onValueChange={(phone) => void formik.setFieldValue("phone", phone)}
          onBlur={formik.handleBlur}
          error={fieldError("phone")}
        />

        <PasswordField
          label="Password"
          name="password"
          autoComplete="new-password"
          placeholder="Choose a strong password"
          hint={PASSWORD_HINT}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={fieldError("password")}
        />

        <Button type="submit" className="mt-1.5">
          Continue →
        </Button>
      </form>

      <Note>Open to community observers. No supervisor invitation needed.</Note>

    </>
  );
}
