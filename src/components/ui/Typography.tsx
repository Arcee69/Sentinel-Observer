import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "../../lib/format";

interface TextProps {
  children: ReactNode;
  /** Layout only — margins and alignment. */
  className?: string;
}

/** The small mono tag above a title: where you are in a flow. */
export function Eyebrow({
  children,
  tone = "ember",
  className,
}: TextProps & { tone?: "ember" | "sage" }) {
  return (
    <p
      className={cn(
        "font-mono text-[9px] leading-normal tracking-[1.4px] uppercase",
        tone === "sage" ? "text-sage-muted" : "text-ember",
        className,
      )}
    >
      {children}
    </p>
  );
}

/**
 * The screen's heading. It takes focus when the screen appears, so a screen
 * reader announces the new screen and keyboard focus restarts from its top
 * rather than staying on a control that no longer exists.
 */
export function Title({
  children,
  srOnly = false,
  className,
}: TextProps & { /** Keep the heading for assistive tech but don't draw it. */ srOnly?: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  return (
    <h1
      ref={ref}
      tabIndex={-1}
      className={cn(
        "outline-none",
        srOnly ? "sr-only" : "my-1.75 text-2xl leading-[1.22] font-bold tracking-[-0.9px]",
        className,
      )}
    >
      {children}
    </h1>
  );
}

/** The sentence under a title. */
export function Lead({ children, className }: TextProps) {
  return (
    <p className={cn("mt-1.5 mb-3.75 text-xs leading-[1.65] text-muted-foreground", className)}>
      {children}
    </p>
  );
}

/** A field-style caption for read-only values. */
export function Caption({ children, className }: TextProps) {
  return (
    <span className={cn("block text-[11px] font-semibold leading-normal tracking-[0.1px] text-label", className)}>
      {children}
    </span>
  );
}
