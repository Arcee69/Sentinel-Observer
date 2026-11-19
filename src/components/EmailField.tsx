import type { ChangeEventHandler, FocusEventHandler } from "react";
import { TextField } from "./ui/Field";

interface EmailFieldProps {
  name?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  hint?: string;
  error?: string;
}

/** Email input shared by sign-up, sign-in and recovery — the account's sign-in name. */
export default function EmailField({
  name = "email",
  value,
  onChange,
  onBlur,
  hint,
  error,
}: EmailFieldProps) {
  return (
    <TextField
      label="Email address"
      name={name}
      type="email"
      inputMode="email"
      autoComplete="email"
      autoCapitalize="none"
      spellCheck={false}
      placeholder="you@example.com"
      hint={hint}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
    />
  );
}
