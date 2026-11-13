import { FileText } from "lucide-react";
import Badge from "./ui/Badge";
import { STATUS_STYLES } from "../lib/constants";
import type { ObserverReport } from "../lib/types";

/** One row in the dashboard panel and the My reports list. */
export default function ReportItem({ report }: { report: ObserverReport }) {
  return (
    <li className="grid grid-cols-[32px_minmax(0,1fr)] items-start gap-x-2 gap-y-1 border-b border-muted-border py-2.75 last:border-b-0">
      <span className="row-span-2 grid size-8 place-items-center rounded-[9px] bg-ember-soft text-ember-icon">
        <FileText className="size-4" strokeWidth={1.6} aria-hidden />
      </span>

      <div className="min-w-0 wrap-anywhere">
        <strong className="block text-[11px] leading-normal font-semibold">{report.title}</strong>
        <small className="mt-0.5 block text-[9px] leading-normal text-subtle">
          {report.area} · {report.time}
        </small>
      </div>

      <Badge tone={STATUS_STYLES[report.status].pill} className="col-start-2 justify-self-start">
        {report.status}
      </Badge>
    </li>
  );
}
