import { Link, useLocation } from "react-router-dom";
import { FileText, LayoutGrid, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/auth";
import { cn } from "../lib/format";

/**
 * Each tab owns a section, not a single route: the report wizard belongs to
 * My reports, the area screens to Dashboard.
 */
const ITEMS = [
  { to: "/app", label: "Dashboard", Icon: LayoutGrid, owns: ["/app", "/area"] },
  { to: "/reports", label: "My reports", Icon: FileText, owns: ["/reports"] },
];

const ITEM =
  "flex min-h-13 flex-col items-center justify-center gap-1.25 rounded-[10px] px-1.75 py-1.25 " +
  "text-[10px] leading-[1.3]";

const IDLE = "font-medium text-subtle active:bg-muted";
const ACTIVE = "bg-primary-soft font-bold text-primary";

export default function BottomNav() {
  const { pathname } = useLocation();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    toast("Signed out");
  };

  return (
    <nav
      aria-label="Observer navigation"
      className="safe-bottom shrink-0 border-t border-track bg-surface px-2.5 shadow-[0_-5px_18px_rgba(23,48,71,0.02)]"
    >
      <div className="grid grid-cols-3 gap-2 py-1.75">
        {ITEMS.map(({ to, label, Icon, owns }) => {
          const active = owns.some((path) => pathname === path || pathname.startsWith(`${path}/`));

          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              className={cn(ITEM, active ? ACTIVE : IDLE)}
            >
              <Icon className="size-5" strokeWidth={1.6} aria-hidden />
              <span>{label}</span>
            </Link>
          );
        })}

        <button type="button" onClick={handleSignOut} className={cn(ITEM, IDLE)}>
          <LogOut className="size-5" strokeWidth={1.6} aria-hidden />
          <span>Sign out</span>
        </button>
      </div>
    </nav>
  );
}
