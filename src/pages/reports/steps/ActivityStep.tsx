import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import ActivityPicker from "../../../components/ActivityPicker";
import Button from "../../../components/ui/Button";
import { TextField } from "../../../components/ui/Field";
import { useObserver } from "../../../context/auth";
import { useDraft } from "../../../context/draft";
import { LIMITS } from "../../../lib/constants";
import { areaLabel, nowLocalInput } from "../../../lib/format";
import { reportStepPath } from "../../../lib/reports";

const schema = Yup.object({
  category: Yup.string().required("Choose the activity you observed"),
  location: Yup.string().trim().required("Say where this happened").max(LIMITS.location),
  when: Yup.string()
    .required("Say when this happened")
    .test("not-future", "This can't be in the future", (value) => !value || value <= nowLocalInput()),
});

/** Step 1: what was observed, where and when. */
export default function ActivityStep() {
  const observer = useObserver();
  const { draft, update } = useDraft();
  const navigate = useNavigate();

  // Fixed for this visit to the step, so the picker's upper bound doesn't creep.
  const [now] = useState(() => nowLocalInput());

  const formik = useFormik({
    initialValues: {
      category: draft.category ?? "",
      // A fresh report starts from the observer's usual area and the present moment.
      location: draft.location ?? areaLabel(observer),
      when: draft.when || now,
    },
    validationSchema: schema,
    onSubmit: () => navigate(reportStepPath(2)),
  });

  // Keep the draft current as they type, so leaving mid-step loses nothing.
  const { values } = formik;
  useEffect(() => {
    update(values);
  }, [values, update]);

  const fieldError = (name: "category" | "location" | "when") =>
    formik.touched[name] || formik.submitCount > 0 ? formik.errors[name] : undefined;

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <ActivityPicker
        name="category"
        value={values.category}
        onChange={(category) => void formik.setFieldValue("category", category)}
        error={fieldError("category")}
      />

      <TextField
        label="Where?"
        name="location"
        placeholder="Community or polling unit"
        maxLength={LIMITS.location}
        value={values.location}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={fieldError("location")}
      />

      <TextField
        label="When did it happen?"
        name="when"
        type="datetime-local"
        max={now}
        value={values.when}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={fieldError("when")}
      />

      <Button type="submit" className="mt-1.5">
        Continue →
      </Button>
    </form>
  );
}
