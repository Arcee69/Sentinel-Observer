import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "../lib/format";

interface StatTileProps {
  label: string;
  value: number;
  Icon: LucideIcon;
  /** Where tapping the tile goes — the report list, filtered to this count. */
  to: string;
  /** The lead tile is drawn on navy. */
  featured?: boolean;
}

export default function StatTile({ label, value, Icon, to, featured = false }: StatTileProps) {
  return (
    <Link
      to={to}
      aria-label={`View ${label.toLowerCase()}: ${value}`}
      className={cn(
        "grid min-h-20.25 min-w-0 grid-cols-[1fr_28px] gap-0.75 rounded-card border px-3 py-3.25 text-left",
        "focus-visible:outline-offset-2",
        featured
          ? "border-navy bg-navy text-navy-foreground"
          : "border-border bg-surface text-foreground",
      )}
    >
      <b className="text-[25px] leading-[1.1] font-semibold tracking-[-1px]">{value}</b>
      <span
        className={cn(
          "grid size-6.25 place-items-center rounded-lg",
          featured ? "bg-white/8 text-navy-muted" : "bg-muted text-ember-icon",
        )}
      >
        <Icon className="size-4" strokeWidth={1.6} aria-hidden />
      </span>
      <small className={cn("col-span-full mt-0.5 text-[10px]", featured ? "text-navy-muted" : "text-subtle")}>
        {label}
      </small>
    </Link>
  );
}
