import { useEffect, useRef, type ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";

/**
 * The scrolling region between the header and whatever is pinned below it.
 *
 * The routed screen is keyed by its path and wizard step, so each new screen
 * mounts fresh: it starts at the top, plays the arrival transition, and moves
 * focus to its heading. Other query changes — a list filter, a page number —
 * update the screen in place, so the observer keeps their position and focus.
 */
export default function Screen({ footer }: { footer?: ReactNode }) {
  const { pathname, search } = useLocation();
  const scroller = useRef<HTMLDivElement>(null);
  const key = `${pathname}#${new URLSearchParams(search).get("step") ?? ""}`;

  useEffect(() => {
    scroller.current?.scrollTo(0, 0);
  }, [key]);

  return (
    <div ref={scroller} className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto">
      <main key={key} className="arrive min-w-0 flex-1 px-5 pt-3.75 pb-4.5">
        <Outlet />
      </main>
      {footer}
    </div>
  );
}
