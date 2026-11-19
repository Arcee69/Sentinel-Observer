import { MapPin } from "lucide-react";
import Panel from "../../components/Panel";
import { ButtonLink } from "../../components/ui/Button";
import { ErrorState, Skeleton } from "../../components/ui/States";
import { Eyebrow, Lead, Title } from "../../components/ui/Typography";
import { useObserver } from "../../context/auth";
import { useDashboard } from "../../hooks/useReports";
import { STATUS_STYLES } from "../../lib/constants";
import { cn } from "../../lib/format";
import type { ReportStatus } from "../../lib/types";

/** The observer's area and how their reports split by review status. */
export default function Area() {
  const observer = useObserver();
  const { data: dashboard, isPending, isError, refetch } = useDashboard();

  // Drafts only earn a row once the observer has saved one.
  const statuses: ReportStatus[] = ["Reviewed", "In review", "Needs information"];
  if (dashboard && dashboard.counts.Draft > 0) statuses.push("Draft");

  return (
    <>
      <div className="mb-2 flex items-center justify-between gap-2.5">
        <Eyebrow>Your observer profile</Eyebrow>
        <ButtonLink variant="text" to="/app">
          ← Dashboard
        </ButtonLink>
      </div>

      <Title>Area & report status</Title>
      <Lead>Where you report from, and how your reports are progressing.</Lead>

      <div className="flex flex-col gap-2.75">
        <div className="rounded-card border border-sage-border bg-sage p-3.5">
          <Eyebrow tone="sage">Your observation area</Eyebrow>
          <strong className="mt-2 mb-1 block text-base wrap-anywhere text-sage-foreground">
            {observer.areaSetupRequired
              ? "No area set yet"
              : `${observer.lga}${observer.state ? `, ${observer.state}` : ""}`}
          </strong>
          <small className="block text-[11px] text-sage-muted">
            {observer.areaSetupRequired
              ? "Set your area before you file your first report."
              : [observer.community, observer.ward].filter(Boolean).join(", ") ||
                "Add your ward or community to report faster."}
          </small>
          <ButtonLink variant="text" to="/area/edit" className="mt-1.75">
            <MapPin className="size-3.25" strokeWidth={1.6} aria-hidden />
            {observer.areaSetupRequired ? "Set your area" : "Change area"}
          </ButtonLink>
        </div>

        <Panel title="Report status">
          {isPending ? (
            <div className="space-y-3 pt-3.5 pb-1" aria-busy="true" aria-label="Loading your reports">
              <Skeleton className="h-6" />
              <Skeleton className="h-6" />
              <Skeleton className="h-6" />
            </div>
          ) : isError ? (
            <div className="pt-2.5">
              <ErrorState onRetry={() => void refetch()} />
            </div>
          ) : (
            <dl>
              {statuses.map((status) => {
                const count = dashboard.counts[status];
                const share = dashboard.total ? (100 * count) / dashboard.total : 0;

                return (
                  <div key={status} className="mt-4.25">
                    <div className="mb-1.75 flex items-center justify-between gap-2.5 text-[10px] text-sage-muted">
                      <dt>{status}</dt>
                      <dd>
                        {count} / {dashboard.total}
                      </dd>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
                      <i
                        className={cn("block h-full rounded-full", STATUS_STYLES[status].bar)}
                        style={{ width: `${share}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </dl>
          )}
        </Panel>
      </div>

      <p className="mt-3.75 text-[9px] leading-normal text-subtle">
        Reviewed reports have been checked, but this does not confirm their contents as fact.
      </p>
    </>
  );
}
