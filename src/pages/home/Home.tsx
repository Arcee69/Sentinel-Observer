import { CircleAlert, CircleCheck, Clock, FileText, Plus, Sun } from "lucide-react";
import Panel from "../../components/Panel";
import ReportItem from "../../components/ReportItem";
import StatTile from "../../components/StatTile";
import { ButtonLink } from "../../components/ui/Button";
import Note from "../../components/ui/Note";
import { ErrorState, Skeleton } from "../../components/ui/States";
import { Eyebrow, Lead, Title } from "../../components/ui/Typography";
import { useObserver } from "../../context/auth";
import { useDashboard } from "../../hooks/useReports";
import { firstName } from "../../lib/format";
import { reportsPath } from "../../lib/reports";

export default function Home() {
  const observer = useObserver();
  const { data: dashboard, isPending, isError, refetch } = useDashboard();

  return (
    <>
      <header className="mb-3.25">
        <Eyebrow>Your observer dashboard</Eyebrow>
        <Title>
          Hello, {firstName(observer.name)}{" "}
          <Sun className="inline size-5.5 align-[-3px] text-in-review-bar" strokeWidth={1.8} aria-hidden />
        </Title>
        <Lead>Your observations, all in one place.</Lead>
        <ButtonLink to="/reports/new" size="lg">
          <Plus className="size-4" strokeWidth={2.2} aria-hidden />
          Report an activity
        </ButtonLink>
      </header>

      {isPending ? (
        <div className="my-3.5 grid grid-cols-2 gap-2" aria-busy="true" aria-label="Loading your reports">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-20.25" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (
        <>
          <div className="my-3.5 grid grid-cols-2 gap-2">
            <StatTile
              featured
              label="All reports"
              value={dashboard.total}
              Icon={FileText}
              to={reportsPath("All")}
            />
            <StatTile
              label="In review"
              value={dashboard.counts["In review"]}
              Icon={Clock}
              to={reportsPath("In review")}
            />
            <StatTile
              label="Reviewed"
              value={dashboard.counts.Reviewed}
              Icon={CircleCheck}
              to={reportsPath("Reviewed")}
            />
            <StatTile
              label="Needs information"
              value={dashboard.counts["Needs information"]}
              Icon={CircleAlert}
              to={reportsPath("Needs information")}
            />
          </div>

          <div className="flex flex-col gap-2.75">
            <Panel
              title="Recent observations"
              aside={
                <ButtonLink variant="text" size="sm" to="/reports">
                  View all →
                </ButtonLink>
              }
            >
              {dashboard.recent.length > 0 ? (
                <ul>
                  <ReportItem report={dashboard.recent[0]} />
                </ul>
              ) : (
                <Lead>No reports yet.</Lead>
              )}
            </Panel>

            <ButtonLink variant="secondary" size="sm" to="/area">
              Your area & report breakdown →
            </ButtonLink>
          </div>
        </>
      )}

      <Note variant="quiet">Stay safe. Report only what you observe.</Note>
    </>
  );
}
