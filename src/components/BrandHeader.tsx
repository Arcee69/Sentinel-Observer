import logo from "../assets/svg/logo-primary.svg";
import { useAuth } from "../context/auth";
import { LANDING_URL } from "../lib/constants";

/**
 * The Sentinel lockup on every screen. The way back to the landing site is
 * offered only before sign-in; a signed-in observer stays in the app.
 */
export default function BrandHeader() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="safe-top flex min-h-18 shrink-0 items-center gap-2.5 border-b border-border bg-surface px-5 pb-2.5">
      <span className="flex flex-col items-start gap-0.5">
        <img src={logo} alt="SMHP Sentinel" width={144} height={50} className="block h-auto w-36" />
        <small className="font-mono text-[7px] leading-normal tracking-[1.4px] text-subtle">
          CONNECT · OBSERVER ACCESS
        </small>
      </span>

      {!isAuthenticated && (
        <a href={LANDING_URL} className="ml-auto py-2 pl-2 text-[11px] text-muted-foreground">
          ← Home
        </a>
      )}
    </header>
  );
}
