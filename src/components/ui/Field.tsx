import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/format";

/** 16px text keeps iOS from zooming the page when a field takes focus. */
const CONTROL =
  "w-full min-w-0 rounded-control border bg-surface px-3 text-base text-foreground outline-none " +
  "placeholder:text-[13px] placeholder:text-faint " +
  "focus:border-primary focus:ring-3 focus:ring-primary/6 disabled:opacity-60";

const LABEL = "block text-[11px] font-semibold leading-normal tracking-[0.1px] text-label";

interface WrapperProps {
  label: string;
  /** Shown beside the label in a lighter weight, e.g. "(optional)". */
  qualifier?: string;
  hint?: string;
  error?: string;
  children: (props: { id: string; invalid: boolean; describedBy?: string }) => ReactNode;
  /** Rendered under the control on the right, e.g. a character counter. */
  aside?: ReactNode;
}

/** Shared label / hint / error scaffolding so every control reads the same. */
export function Field({ label, qualifier, hint, error, aside, children }: WrapperProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const invalid = Boolean(error);

  return (
    <div className="my-3">
      <label htmlFor={id} className={cn(LABEL, "mb-1.25")}>
        {label}
        {qualifier && <span className="font-normal text-subtle"> {qualifier}</span>}
      </label>

      {children({ id, invalid, describedBy: error || hint ? messageId : undefined })}

      {(error || hint || aside) && (
        <div className="mt-1.5 flex items-start justify-between gap-3">
          <p
            id={messageId}
            role={error ? "alert" : undefined}
            className={cn(
              "leading-snug",
              error ? "text-xs text-destructive" : "text-[9px] text-subtle",
            )}
          >
            {error || hint}
          </p>
          {aside}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  qualifier?: string;
  hint?: string;
  error?: string;
}

export function TextField({ label, qualifier, hint, error, className, ...rest }: TextFieldProps) {
  return (
    <Field label={label} qualifier={qualifier} hint={hint} error={error}>
      {({ id, invalid, describedBy }) => (
        <input
          {...rest}
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(
            CONTROL,
            "min-h-11 py-2.5",
            invalid ? "border-destructive" : "border-input",
            className,
          )}
        />
      )}
    </Field>
  );
}

/* -------------------------------------------------------------------------- */

export function PasswordField({
  label,
  hint,
  error,
  className,
  ...rest
}: Omit<TextFieldProps, "type" | "qualifier">) {
  const [visible, setVisible] = useState(false);

  return (
    <Field label={label} hint={hint} error={error}>
      {({ id, invalid, describedBy }) => (
        <div
          className={cn(
            "flex min-h-11 items-center overflow-hidden rounded-control border bg-surface",
            "focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/6",
            invalid ? "border-destructive" : "border-input",
          )}
        >
          <input
            {...rest}
            id={id}
            type={visible ? "text" : "password"}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={cn(
              "min-h-11 w-full min-w-0 bg-transparent px-3 py-2.5 text-base text-foreground outline-none",
              "placeholder:text-[13px] placeholder:text-faint",
              className,
            )}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="grid min-h-11 min-w-11.5 place-items-center text-subtle -outline-offset-3"
          >
            {visible ? (
              <EyeOff className="size-4.75" strokeWidth={1.7} aria-hidden />
            ) : (
              <Eye className="size-4.75" strokeWidth={1.7} aria-hidden />
            )}
          </button>
        </div>
      )}
    </Field>
  );
}

/* -------------------------------------------------------------------------- */

interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  label: string;
  hint?: string;
  error?: string;
  /** Shows a live "n / max" count under the field; needs `maxLength`. */
  counter?: boolean;
}

export function TextAreaField({
  label,
  hint,
  error,
  counter,
  className,
  ...rest
}: TextAreaProps) {
  const length = typeof rest.value === "string" ? rest.value.length : 0;

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      aside={
        counter && rest.maxLength ? (
          <p className="ml-auto shrink-0 text-[9px] text-faint">
            {length.toLocaleString()} / {rest.maxLength.toLocaleString()}
          </p>
        ) : undefined
      }
    >
      {({ id, invalid, describedBy }) => (
        <textarea
          {...rest}
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(
            CONTROL,
            "block max-h-45 min-h-21.25 resize-y py-3",
            invalid ? "border-destructive" : "border-input",
            className,
          )}
        />
      )}
    </Field>
  );
}

/* -------------------------------------------------------------------------- */

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  label: string;
  hint?: string;
  error?: string;
  options: readonly string[];
  placeholder?: string;
}

export function SelectField({
  label,
  hint,
  error,
  options,
  placeholder,
  className,
  ...rest
}: SelectProps) {
  return (
    <Field label={label} hint={hint} error={error}>
      {({ id, invalid, describedBy }) => (
        <select
          {...rest}
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(
            CONTROL,
            "min-h-11 appearance-none bg-[length:1rem] py-2.5 pr-9",
            invalid ? "border-destructive" : "border-input",
            className,
          )}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2371808c' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
          }}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

/* -------------------------------------------------------------------------- */

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> {
  label: string;
  error?: string;
}

/** A statement the observer agrees to, in a quiet inset box. */
export function CheckboxField({ label, error, className, ...props }: CheckboxProps) {
  const id = useId();

  return (
    <div className="mt-3.75 mb-2.5">
      <div
        className={cn(
          "flex items-start gap-2.25 rounded-control bg-muted p-3 text-[10px] leading-normal text-muted-foreground",
          className,
        )}
      >
        <input
          {...props}
          id={id}
          type="checkbox"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${id}-message` : undefined}
          className="mt-0.5 size-4 shrink-0 accent-primary"
        />
        <label htmlFor={id}>{label}</label>
      </div>
      {error && (
        <p id={`${id}-message`} role="alert" className="mt-1.5 text-xs leading-snug text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
