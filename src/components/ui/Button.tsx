import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/format";

type Variant = "primary" | "secondary" | "text";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "w-full rounded-control bg-primary font-bold tracking-[0.15px] text-primary-foreground " +
    "shadow-[0_4px_10px_rgba(182,74,16,0.08)] transition-[background-color,transform] duration-150 " +
    "hover:bg-primary-hover active:translate-y-px",
  secondary:
    "w-full rounded-control border border-border bg-surface font-semibold text-foreground active:bg-muted",
  // An inline action: reads as a link, sized for a thumb.
  text: "min-h-8.5 py-1.75 text-primary",
};

/** Size is the only thing that varies within a variant — never override it with `className`. */
const SIZES: Record<Variant, Record<Size, string>> = {
  primary: {
    sm: "min-h-10 p-2.25 text-[11px]",
    md: "min-h-11.5 p-3 text-xs",
    lg: "min-h-11.5 p-3 text-[13px]",
  },
  secondary: {
    sm: "min-h-10 p-2.25 text-[11px]",
    md: "min-h-11.75 p-3 text-xs",
    lg: "min-h-11.75 p-3 text-[13px]",
  },
  text: {
    sm: "text-[10px]",
    md: "text-[11px]",
    lg: "text-xs",
  },
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
  /** Layout only — margins and alignment. */
  className?: string;
}

function buttonClass({ variant = "primary", size = "md", className }: StyleProps) {
  return cn(
    "inline-flex items-center justify-center gap-1.5 text-center",
    "disabled:cursor-wait disabled:opacity-50",
    VARIANTS[variant],
    SIZES[variant][size],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, StyleProps {
  loading?: boolean;
  icon?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

/** Primary and secondary buttons fill their row; text buttons hug their label. */
export default function Button({
  variant,
  size,
  loading = false,
  icon,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      className={buttonClass({ variant, size, className })}
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
}

/** The same looks on a router link, for actions that are really navigation. */
export function ButtonLink({
  variant,
  size,
  className,
  children,
  ...rest
}: LinkProps & StyleProps) {
  return (
    <Link {...rest} className={buttonClass({ variant, size, className })}>
      {children}
    </Link>
  );
}
