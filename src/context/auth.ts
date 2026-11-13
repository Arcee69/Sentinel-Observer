import { createContext, useContext } from "react";
import type { Credentials, Observer, ObserverArea, SignupDetails } from "../lib/types";

export interface AuthValue {
  observer: Observer | null;
  isAuthenticated: boolean;
  /** Someone has used the app on this device — open on Sign in, not Create account. */
  returning: boolean;
  /** Step one of sign-up, kept while the observer sets their area. */
  pendingSignup: SignupDetails | null;
  beginSignup: (details: SignupDetails) => void;
  completeSignup: (area: ObserverArea) => Promise<void>;
  signIn: (credentials: Credentials) => Promise<void>;
  /** Opens the dashboard as a demo observer, without an account. */
  explore: () => void;
  signOut: () => void;
  updateArea: (area: ObserverArea) => void;
}

export const AuthContext = createContext<AuthValue | null>(null);

export function useAuth(): AuthValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}

/**
 * Convenience hook for screens behind <ProtectedRoute>, where the observer is
 * guaranteed present.
 */
export function useObserver(): Observer {
  const { observer } = useAuth();
  if (!observer) throw new Error("useObserver used outside an authenticated route");
  return observer;
}
