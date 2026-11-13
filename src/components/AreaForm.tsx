import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "./ui/Button";
import { CheckboxField, SelectField, TextField } from "./ui/Field";
import { LIMITS, STATES } from "../lib/constants";
import type { ObserverArea } from "../lib/types";

const schema = Yup.object({
  state: Yup.string().required("Select your state or the FCT"),
  lga: Yup.string().trim().required("Enter your local government area").max(LIMITS.lga),
  area: Yup.string().trim().max(LIMITS.area),
  responsible: Yup.boolean().oneOf([true], "Please confirm before you continue."),
});

interface AreaFormProps {
  initial?: Partial<ObserverArea>;
  submitLabel: string;
  onSubmit: (area: ObserverArea) => void | Promise<void>;
}

/** Where the observer usually reports from — used at sign-up and when changing area. */
export default function AreaForm({ initial, submitLabel, onSubmit }: AreaFormProps) {
  const formik = useFormik({
    initialValues: {
      state: initial?.state ?? "",
      lga: initial?.lga ?? "",
      area: initial?.area ?? "",
      responsible: false,
    },
    validationSchema: schema,
    onSubmit: (values) =>
      onSubmit({ state: values.state, lga: values.lga.trim(), area: values.area.trim() }),
  });

  const fieldError = (name: "state" | "lga" | "area" | "responsible") =>
    formik.touched[name] ? formik.errors[name] : undefined;

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <SelectField
        label="State / FCT"
        name="state"
        options={STATES}
        placeholder="Select state / FCT"
        value={formik.values.state}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={fieldError("state")}
      />

      <TextField
        label="Local government area"
        name="lga"
        placeholder="Enter your LGA"
        maxLength={LIMITS.lga}
        value={formik.values.lga}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={fieldError("lga")}
      />

      <TextField
        label="Ward / community"
        qualifier="(optional)"
        name="area"
        placeholder="Your ward or community"
        maxLength={LIMITS.area}
        value={formik.values.area}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={fieldError("area")}
      />

      <CheckboxField
        name="responsible"
        label="I will report what I observe, avoid speculation, and prioritise my safety."
        checked={formik.values.responsible}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={fieldError("responsible")}
      />

      <Button type="submit" loading={formik.isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}
