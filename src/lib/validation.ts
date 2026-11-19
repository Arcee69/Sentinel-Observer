import * as Yup from "yup";
import { LIMITS } from "./constants";

/** A Nigerian mobile number: 11 digits starting 07/08/09, or the +234 form. */
export const PHONE_PATTERN = /^(0[789][01]\d{8}|\+234[789][01]\d{8})$/;

/** Observers type numbers the way they say them — drop the spacing and brackets. */
export function normalisePhone(value: string): string {
  return value.replace(/[\s()-]/g, "");
}

/** The API's rule for a new password, checked here so the observer hears it before sending. */
export const passwordSchema = Yup.string()
  .required("Choose a password")
  .min(LIMITS.passwordMin, `Use at least ${LIMITS.passwordMin} characters`)
  .matches(/[a-z]/, "Add a lowercase letter")
  .matches(/[A-Z]/, "Add an uppercase letter")
  .matches(/\d/, "Add a number")
  .matches(/[^A-Za-z0-9]/, "Add a symbol, such as ! or #")
  .test(
    "max-bytes",
    "This password is too long. Use a shorter one.",
    (value) => !value || new TextEncoder().encode(value).length <= LIMITS.passwordMaxBytes,
  );

export const PASSWORD_HINT = `At least ${LIMITS.passwordMin} characters, with upper and lower case, a number and a symbol.`;

/** The account's sign-in name. Surrounding spaces from autofill are dropped. */
export const emailSchema = Yup.string()
  .trim()
  .required("Enter your email address")
  .email("Enter a valid email address, like you@example.com")
  .max(LIMITS.email);

export const phoneSchema = Yup.string()
  .required("Enter your mobile number")
  .matches(PHONE_PATTERN, "Enter a Nigerian number: 11 digits, or use +234.");
