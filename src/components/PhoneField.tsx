import type { FocusEventHandler } from "react";
import { TextField } from "./ui/Field";
import { normalisePhone } from "../lib/validation";

interface PhoneFieldProps {
  name?: string;
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  error?: string;
}

/** Mobile number input shared by sign-up, sign-in and recovery. */
export default function PhoneField({
  name = "phone",
  value,
  onValueChange,
  onBlur,
  error,
}: PhoneFieldProps) {
  return (
    <TextField
      label="Mobile number"
      name={name}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder="0801 234 5678"
      hint="Nigerian number: 11 digits, or use +234."
      value={value}
      onChange={(event) => onValueChange(normalisePhone(event.target.value))}
      onBlur={onBlur}
      error={error}
    />
  );
}
