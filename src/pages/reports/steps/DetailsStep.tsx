import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../../../components/ui/Button";
import { TextAreaField } from "../../../components/ui/Field";
import { useDraft } from "../../../context/draft";
import { LIMITS } from "../../../lib/constants";
import { reportStepPath } from "../../../lib/reports";

const schema = Yup.object({
  details: Yup.string().trim().required("Please describe your observation.").max(LIMITS.details),
});

/** Step 2: the observation itself, in the observer's own words. */
export default function DetailsStep() {
  const { draft, update } = useDraft();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { details: draft.details ?? "" },
    validationSchema: schema,
    onSubmit: () => navigate(reportStepPath(3)),
  });

  // Keep the draft current as they type, so leaving mid-step loses nothing.
  const { values } = formik;
  useEffect(() => {
    update(values);
  }, [values, update]);

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <TextAreaField
        label="What did you observe?"
        name="details"
        placeholder="Only what you personally saw. Keep it brief and factual."
        maxLength={LIMITS.details}
        counter
        value={values.details}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.details ? formik.errors.details : undefined}
      />

      <Button type="submit" className="mt-1.5">
        Continue →
      </Button>
    </form>
  );
}
