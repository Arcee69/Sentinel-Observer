import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "../../lib/format";

interface NoteProps {
  children: ReactNode;
  /** `quiet` drops the box — a closing reminder rather than a callout. */
  variant?: "boxed" | "quiet";
  /** Hide the shield for a plain status message. */
  icon?: boolean;
  className?: string;
}

/** Reassurance and safety guidance, marked with the Sentinel shield. */
export default function Note({ children, variant = "boxed", icon = true, className }: NoteProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.25",
        variant === "boxed"
          ? "mt-3.75 rounded-control border border-muted-border bg-muted p-2.5 text-[10px] leading-[1.6] text-muted-foreground"
          : "mt-3 text-[9px] leading-[1.8] text-sage-muted",
        className,
      )}
    >
      {icon && (
        <ShieldCheck className="mt-0.5 size-4.25 shrink-0 text-sage-muted" strokeWidth={1.7} aria-hidden />
      )}
      <span>{children}</span>
    </div>
  );
}
