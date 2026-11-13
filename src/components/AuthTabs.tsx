import { NavLink } from "react-router-dom";
import { cn } from "../lib/format";

const TABS = [
  { to: "/signup", label: "Create account" },
  { to: "/login", label: "Sign in" },
];

/** Switches between the two ways in. */
export default function AuthTabs() {
  return (
    <nav
      aria-label="Observer access"
      className="mb-4.25 grid grid-cols-2 gap-1 rounded-[11px] bg-segment p-1"
    >
      {TABS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          replace
          end
          className={({ isActive }) =>
            cn(
              "grid min-h-9 place-items-center rounded-lg p-2 text-xs font-semibold",
              isActive
                ? "bg-surface text-primary shadow-[0_2px_4px_rgba(16,43,67,0.06)]"
                : "text-muted-foreground",
            )
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
