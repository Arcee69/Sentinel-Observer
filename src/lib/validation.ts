import * as Yup from "yup";

/** A Nigerian mobile number: 11 digits starting 07/08/09, or the +234 form. */
export const PHONE_PATTERN = /^(0[789][01]\d{8}|\+234[789][01]\d{8})$/;

/** Observers type numbers the way they say them — drop the spacing and brackets. */
export function normalisePhone(value: string): string {
  return value.replace(/[\s()-]/g, "");
}

export const phoneSchema = Yup.string()
  .required("Enter your mobile number")
  .matches(PHONE_PATTERN, "Enter a Nigerian number: 11 digits, or use +234.");
