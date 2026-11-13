import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth";

/**
 * Gates the signed-in screens. A first-time visitor lands on Create account;
 * anyone who has used the app on this device — or followed a `#login` link —
 * lands on Sign in.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, returning } = useAuth();
  const { hash } = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={returning || hash === "#login" ? "/login" : "/signup"} replace />;
  }

  return <Outlet />;
}

/** Keeps signed-in observers out of the auth screens — and lets them in once they sign in. */
export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/app" replace /> : <Outlet />;
}
