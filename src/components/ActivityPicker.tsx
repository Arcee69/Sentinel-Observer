import { useId } from "react";
import { ACTIVITIES } from "../lib/constants";

interface ActivityPickerProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/** Radio tiles for the kind of activity observed. The last one spans the row. */
export default function ActivityPicker({ name, value, onChange, error }: ActivityPickerProps) {
  const messageId = useId();

  return (
    <div className="my-3">
      <fieldset
        aria-describedby={error ? messageId : undefined}
        className="grid min-w-0 grid-cols-2 gap-1.75"
      >
        <legend className="mb-1.75 text-[11px] font-semibold text-label">Activity</legend>

        {ACTIVITIES.map(({ code: option, label, Icon }) => (
          <label
            key={option}
            className={
              "relative flex min-h-11.5 cursor-pointer items-center gap-2 rounded-[10px] border border-border bg-surface px-2 py-2.5 text-[10px] " +
              "last:col-span-full " +
              "has-checked:border-primary has-checked:bg-primary-soft has-checked:text-primary-strong has-checked:ring-1 has-checked:ring-primary " +
              "has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring"
            }
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            <Icon className="size-4.5 shrink-0" strokeWidth={1.6} aria-hidden />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>

      {error && (
        <p id={messageId} role="alert" className="mt-1.5 text-xs leading-snug text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
