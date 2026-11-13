import logo from "../assets/svg/logo-primary.svg";
import { LANDING_URL } from "../lib/constants";

/** The Sentinel lockup and the way back to the landing site, on every screen. */
export default function BrandHeader() {
  return (
    <header className="safe-top flex min-h-18 shrink-0 items-center gap-2.5 border-b border-border bg-surface px-5 pb-2.5">
      <span className="flex flex-col items-start gap-0.5">
        <img src={logo} alt="SMHP Sentinel" width={144} height={50} className="block h-auto w-36" />
        <small className="font-mono text-[7px] leading-normal tracking-[1.4px] text-subtle">
          CONNECT · OBSERVER ACCESS
        </small>
      </span>

      <a href={LANDING_URL} className="ml-auto py-2 pl-2 text-[11px] text-muted-foreground">
        ← Home
      </a>
    </header>
  );
}
