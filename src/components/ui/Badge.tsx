import type { ReactNode } from "react";
import { cn } from "../../lib/format";

interface BadgeProps {
  children: ReactNode;
  /** Pre-composed Tailwind classes from lib/constants style maps. */
  tone?: string;
  className?: string;
}

export default function Badge({ children, tone, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-1.75 py-0.5 text-[9px] leading-normal",
        tone ?? "bg-muted text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
