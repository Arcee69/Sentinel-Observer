import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import Panel from "../../components/Panel";
import ReportItem from "../../components/ReportItem";
import { ButtonLink } from "../../components/ui/Button";
import Note from "../../components/ui/Note";
import { ErrorState, Skeleton } from "../../components/ui/States";
import { Lead, Title } from "../../components/ui/Typography";
import { useReports } from "../../hooks/useReports";
import { cn } from "../../lib/format";
import { parseFilter, REPORT_FILTERS, reportsPath } from "../../lib/reports";

export default function Reports() {
  const [searchParams] = useSearchParams();
  // The API filters and pages the list; both come from the URL.
  const filter = parseFilter(searchParams.get("status"));
  const page = Math.max(1, Math.trunc(Number(searchParams.get("page"))) || 1);

  const { data, isPending, isError, refetch } = useReports(filter, page);
  const visible = data?.reports ?? [];
  const pages = data?.pages ?? 1;

  // A stale link can point past the last page.
  if (data && page > data.pages) return <Navigate to={reportsPath(filter, data.pages)} replace />;

  return (
    <>
      {/* The nav tab already names the screen; the heading is for screen readers. */}
      <Title srOnly>My reports</Title>

      <ButtonLink to="/reports/new" size="lg" className="mb-3.75">
        <Plus className="size-4" strokeWidth={2.2} aria-hidden />
        Report an activity
      </ButtonLink>

      <div className="flex flex-col gap-2.75">
        <Panel title="Your observations" aside={data ? `${data.total} in this view` : undefined}>
          <div
            role="group"
            aria-label="Filter reports by status"
            className="mt-2.25 mb-0.75 flex flex-wrap gap-1.5"
          >
            {REPORT_FILTERS.map((option) => {
              const active = option === filter;

              return (
                <Link
                  key={option}
                  to={reportsPath(option)}
                  replace
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "grid min-h-7.75 place-items-center rounded-full border px-2.25 py-1.5 text-[9px]",
                    active
                      ? "border-navy bg-navy text-navy-foreground"
                      : "border-border bg-background text-subtle",
                  )}
                >
                  {option}
                </Link>
              );
            })}
          </div>

          {isPending ? (
            <div className="space-y-2 py-2.75" aria-busy="true" aria-label="Loading your reports">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          ) : isError ? (
            <div className="py-2.75">
              <ErrorState onRetry={() => void refetch()} />
            </div>
          ) : visible.length > 0 ? (
            <ul>
              {visible.map((report) => (
                <ReportItem key={report.id} report={report} />
              ))}
            </ul>
          ) : (
            <Lead>{filter === "All" ? "No reports yet." : "No reports with this status."}</Lead>
          )}

          {pages > 1 && (
            <nav
              aria-label="Report pages"
              className="mt-2 flex items-center justify-between gap-2.5 text-[10px] text-subtle"
            >
              <PageLink to={reportsPath(filter, page - 1)} disabled={page === 1}>
                ← Previous
              </PageLink>
              <span aria-current="page">
                {page} / {pages}
              </span>
              <PageLink to={reportsPath(filter, page + 1)} disabled={page === pages}>
                Next →
              </PageLink>
            </nav>
          )}

        </Panel>

        <ButtonLink variant="secondary" size="sm" to="/area">
          Your area & report breakdown →
        </ButtonLink>
      </div>

      <Note variant="quiet">Stay safe. Report only what you observe.</Note>
    </>
  );
}

/** A pager link that stays in place, greyed out, at either end of the list. */
function PageLink({ to, disabled, children }: { to: string; disabled: boolean; children: string }) {
  if (disabled) {
    return (
      <span aria-disabled="true" className="py-1.75 text-primary opacity-50">
        {children}
      </span>
    );
  }

  return (
    <ButtonLink variant="text" size="sm" to={to} replace>
      {children}
    </ButtonLink>
  );
}
