import { STORAGE_KEYS } from "../lib/constants";
import type { Session } from "../lib/types";

/**
 * The persisted session: the bearer token plus a snapshot of who the observer
 * is and where they report from, so an installed app reopens on the dashboard.
 * The snapshot is refreshed from `/observer/me` whenever the API is reachable.
 * The password is never stored.
 */

let memory: Session | null = null;

function isExpired(session: Session): boolean {
  return session.expiresAt != null && Date.parse(session.expiresAt) <= Date.now();
}

export function readSession(): Session | null {
  if (memory) return isExpired(memory) ? null : memory;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.session);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    // Sessions written by the preview build have no token; drop them.
    if (!parsed?.token || !parsed.observer?.id || isExpired(parsed)) return null;
    memory = parsed;
    return parsed;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return readSession()?.token ?? null;
}

export function saveSession(session: Session) {
  memory = session;
  try {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
    localStorage.setItem(STORAGE_KEYS.returning, "true");
  } catch {
    /* storage blocked — the memory copy still authenticates this tab */
  }
}

export function clearSession() {
  memory = null;
  try {
    localStorage.removeItem(STORAGE_KEYS.session);
  } catch {
    /* nothing to clear */
  }
}

/** Whether anyone has had a session on this device before. */
export function isReturning(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.returning) === "true";
  } catch {
    return false;
  }
}
