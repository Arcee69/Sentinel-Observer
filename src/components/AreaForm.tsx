import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "./ui/Button";
import { CheckboxField, SelectField, TextField, type SelectOption } from "./ui/Field";
import { useAreas } from "../hooks/useAreas";
import { LIMITS } from "../lib/constants";
import type { AreaSelection, ObserverArea, Place } from "../lib/types";

const schema = Yup.object({
  stateId: Yup.string().required("Select your state or the FCT"),
  lgaId: Yup.string().required("Select your local government area"),
  wardId: Yup.string(),
  community: Yup.string().trim().max(LIMITS.community),
  responsible: Yup.boolean().oneOf([true], "Please confirm before you continue."),
});

const LOAD_ERROR = "We couldn't load this list. Check your connection.";

const toOptions = (places: Place[] | undefined): SelectOption[] =>
  (places ?? []).map((place) => ({ value: place.id, label: place.name }));

interface AreaFormProps {
  initial?: Partial<ObserverArea>;
  submitLabel: string;
  onSubmit: (area: AreaSelection) => void | Promise<void>;
}

/** Where the observer usually reports from — used at sign-up and when changing area. */
export default function AreaForm({ initial, submitLabel, onSubmit }: AreaFormProps) {
  const formik = useFormik({
    initialValues: {
      stateId: initial?.stateId ?? "",
      lgaId: initial?.lgaId ?? "",
      wardId: initial?.wardId ?? "",
      community: initial?.community ?? "",
      responsible: false,
    },
    validationSchema: schema,
    onSubmit: (values) =>
      onSubmit({
        stateId: values.stateId,
        lgaId: values.lgaId,
        wardId: values.wardId || null,
        community: values.community.trim(),
      }),
  });

  const { values } = formik;

  // Each list is the children of the choice above it.
  const states = useAreas(null);
  const lgas = useAreas(values.stateId || undefined);
  const wards = useAreas(values.lgaId || undefined);

  const fieldError = (name: "stateId" | "lgaId" | "community" | "responsible") =>
    formik.touched[name] ? formik.errors[name] : undefined;

  const retry = states.isError ? states : lgas.isError ? lgas : wards.isError ? wards : null;

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <SelectField
        label="State / FCT"
        name="stateId"
        options={toOptions(states.data)}
        placeholder={states.isPending ? "Loading states…" : "Select state / FCT"}
        disabled={!states.data}
        value={values.stateId}
        onChange={(event) => {
          // A new state has its own LGAs and wards.
          void formik.setValues({ ...values, stateId: event.target.value, lgaId: "", wardId: "" });
        }}
        onBlur={formik.handleBlur}
        error={states.isError ? LOAD_ERROR : fieldError("stateId")}
      />

      <SelectField
        label="Local government area"
        name="lgaId"
        options={toOptions(lgas.data)}
        placeholder={
          !values.stateId ? "Select a state first" : lgas.isPending ? "Loading LGAs…" : "Select LGA"
        }
        disabled={!lgas.data}
        value={values.lgaId}
        onChange={(event) => {
          void formik.setValues({ ...values, lgaId: event.target.value, wardId: "" });
        }}
        onBlur={formik.handleBlur}
        error={lgas.isError ? LOAD_ERROR : fieldError("lgaId")}
      />

      <SelectField
        label="Ward"
        qualifier="(optional)"
        name="wardId"
        options={toOptions(wards.data)}
        placeholder={
          !values.lgaId ? "Select an LGA first" : wards.isPending ? "Loading wards…" : "Select ward"
        }
        disabled={!wards.data}
        value={values.wardId}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={wards.isError ? LOAD_ERROR : undefined}
      />

      {retry && (
        <Button variant="text" onClick={() => void retry.refetch()}>
          Try loading again
        </Button>
      )}

      <TextField
        label="Community"
        qualifier="(optional)"
        name="community"
        placeholder="Your community or neighbourhood"
        maxLength={LIMITS.community}
        value={values.community}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={fieldError("community")}
      />

      <CheckboxField
        name="responsible"
        label="I will report what I observe, avoid speculation, and prioritise my safety."
        checked={values.responsible}
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
