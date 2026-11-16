import type { ReactNode } from "react";

interface PanelProps {
  title: string;
  /** Right of the title: an action, or a small qualifier such as "12 in this view". */
  aside?: ReactNode;
  children: ReactNode;
}

/** White card with a titled header — the dashboard's building block. */
export default function Panel({ title, aside, children }: PanelProps) {
  return (
    <section className="min-w-0 rounded-[14px] border border-border bg-surface px-3.5 py-3.25">
      <div className="mb-0.75 flex items-center justify-between gap-2.5">
        <h2 className="text-[13px] leading-normal font-semibold tracking-[-0.2px]">{title}</h2>
        {typeof aside === "string" ? (
          <small className="text-[9px] text-faint">{aside}</small>
        ) : (
          aside
        )}
      </div>
      {children}
    </section>
  );
}
