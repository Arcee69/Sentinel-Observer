import { STORAGE_KEYS } from "../lib/constants";
import type { Session } from "../lib/types";

/**
 * The persisted session: who the observer is and where they report from, so an
 * installed app reopens on the dashboard. No password or credential is stored.
 */

let memory: Session | null = null;

export function readSession(): Session | null {
  if (memory) return memory;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.session);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (!parsed?.observer?.phone) return null;
    memory = parsed;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(session: Session) {
  memory = session;
  try {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
    localStorage.setItem(STORAGE_KEYS.returning, "true");
  } catch {
    /* storage blocked — the memory copy still carries this tab */
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
