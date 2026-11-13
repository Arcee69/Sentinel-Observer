import { cn } from "../../lib/format";
import Button from "./Button";

/** Grey placeholder blocks that mirror a card's silhouette. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-card bg-track/60", className)} />;
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this. Check your connection and try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div role="alert" className="rounded-card border border-destructive/25 bg-destructive/5 px-4 py-6 text-center">
      <p className="text-[13px] font-semibold text-destructive">{title}</p>
      <p className="mx-auto mt-1 max-w-[34ch] text-xs leading-relaxed text-muted-foreground">
        {message}
      </p>
      {onRetry && (
        <Button variant="text" size="lg" onClick={onRetry} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}
