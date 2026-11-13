import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext, type AuthValue } from "./auth";
import * as service from "../services/observerService";
import { clearSession, isReturning, readSession, saveSession } from "../services/session";
import type { Credentials, ObserverArea, Session, SignupDetails } from "../lib/types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(readSession);
  const [returning, setReturning] = useState(isReturning);
  const [pendingSignup, setPendingSignup] = useState<SignupDetails | null>(null);
  const queryClient = useQueryClient();

  const start = useCallback((next: Session) => {
    saveSession(next);
    setSession(next);
    setReturning(true);
    setPendingSignup(null);
  }, []);

  const beginSignup = useCallback((details: SignupDetails) => {
    setPendingSignup(details);
  }, []);

  const completeSignup = useCallback(
    async (area: ObserverArea) => {
      if (!pendingSignup) throw new Error("Start with your details, then set your area.");
      start(await service.signUp(pendingSignup, area));
    },
    [pendingSignup, start],
  );

  const signIn = useCallback(
    async (credentials: Credentials) => {
      start(await service.login(credentials));
    },
    [start],
  );

  const explore = useCallback(() => {
    start(service.demoSession());
  }, [start]);

  const signOut = useCallback(() => {
    clearSession();
    setSession(null);
    setPendingSignup(null);
    // Another observer may use this device next.
    service.resetPreviewData();
    queryClient.clear();
  }, [queryClient]);

  const updateArea = useCallback((area: ObserverArea) => {
    setSession((current) => {
      if (!current) return current;
      const next = { ...current, observer: { ...current.observer, ...area } };
      saveSession(next);
      return next;
    });
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      observer: session?.observer ?? null,
      isAuthenticated: session !== null,
      returning,
      pendingSignup,
      beginSignup,
      completeSignup,
      signIn,
      explore,
      signOut,
      updateArea,
    }),
    [session, returning, pendingSignup, beginSignup, completeSignup, signIn, explore, signOut, updateArea],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
