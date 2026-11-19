import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext, type AuthValue } from "./auth";
import * as service from "../services/observerService";
import { clearSession, isReturning, readSession, saveSession } from "../services/session";
import type { AreaSelection, Credentials, Observer, Session, SignupDetails } from "../lib/types";

const profileKey = (token: string | undefined) => ["observer-profile", token];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(readSession);
  const [returning, setReturning] = useState(isReturning);
  const [pendingSignup, setPendingSignup] = useState<SignupDetails | null>(null);
  const queryClient = useQueryClient();

  const start = useCallback(
    (next: Session) => {
      // Register and login already return the profile; no need to ask again.
      queryClient.setQueryData(profileKey(next.token), next.observer);
      saveSession(next);
      setSession(next);
      setReturning(true);
      setPendingSignup(null);
    },
    [queryClient],
  );

  const replaceObserver = useCallback((observer: Observer) => {
    setSession((current) => {
      if (!current) return current;
      const next = { ...current, observer };
      saveSession(next);
      return next;
    });
  }, []);

  /**
   * The profile is re-read whenever the API is reachable, so an area changed
   * on another device shows up without signing out. The stored snapshot keeps
   * the app usable offline in the meantime.
   */
  useQuery({
    queryKey: profileKey(session?.token),
    queryFn: async () => {
      const observer = await service.fetchProfile();
      replaceObserver(observer);
      return observer;
    },
    enabled: session !== null,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: true,
  });

  const beginSignup = useCallback((details: SignupDetails) => {
    setPendingSignup(details);
  }, []);

  const completeSignup = useCallback(
    async (area: AreaSelection | null) => {
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

  const signOut = useCallback(() => {
    // Revoked in the background: a weak signal shouldn't hold the observer in
    // a session they've left.
    if (session) void service.logout(session.token);
    clearSession();
    setSession(null);
    setPendingSignup(null);
    // Another observer may use this device next.
    queryClient.clear();
  }, [session, queryClient]);

  const updateArea = useCallback(
    async (area: AreaSelection) => {
      replaceObserver(await service.updateArea(area));
    },
    [replaceObserver],
  );

  const value = useMemo<AuthValue>(
    () => ({
      observer: session?.observer ?? null,
      isAuthenticated: session !== null,
      returning,
      pendingSignup,
      beginSignup,
      completeSignup,
      signIn,
      signOut,
      updateArea,
    }),
    [session, returning, pendingSignup, beginSignup, completeSignup, signIn, signOut, updateArea],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
