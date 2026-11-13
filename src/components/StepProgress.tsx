import { cn } from "../lib/format";

interface StepProgressProps {
  /** How many segments are filled. */
  step: number;
  total: number;
  className?: string;
}

/** Segmented bar for the sign-up and report flows. */
export default function StepProgress({ step, total, className }: StepProgressProps) {
  return (
    <div
      role="img"
      aria-label={`Step ${step} of ${total}`}
      className={cn("mb-4.25 flex gap-1.5", className)}
    >
      {Array.from({ length: total }, (_, index) => (
        <i
          key={index}
          className={cn("h-1 flex-1 rounded", index < step ? "bg-primary" : "bg-track")}
        />
      ))}
    </div>
  );
}
