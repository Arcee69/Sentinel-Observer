import { DEMO_OBSERVER, DEMO_REPORTS } from "./mock/demoReports";
import type {
  Credentials,
  NewReport,
  ObserverArea,
  ObserverReport,
  Session,
  SignupDetails,
} from "../lib/types";

/**
 * The only file that knows where observer data comes from.
 *
 * This is the preview build: no account is created and no report leaves the
 * device. Every function is already async and returns the display types in
 * `lib/types.ts`, so wiring the Sentinel API in later means replacing these
 * bodies with calls through `./instance` — screens and hooks don't change.
 */

/** Sample records plus anything saved this session. Never persisted. */
let reports: ObserverReport[] = [...DEMO_REPORTS];

export async function signUp(details: SignupDetails, area: ObserverArea): Promise<Session> {
  return { observer: { ...details, ...area } };
}

/** The preview accepts any well-formed number; the password is never read or kept. */
export async function login(credentials: Credentials): Promise<Session> {
  return {
    observer: { name: "Observer", phone: credentials.phone, state: "", lga: "", area: "" },
  };
}

/** "Take a look around first" — a ready-made observer with an area set. */
export function demoSession(): Session {
  return { observer: { ...DEMO_OBSERVER } };
}

/** A connected service would text a recovery code; the preview sends nothing. */
export async function requestRecovery(phone: string): Promise<void> {
  void phone;
}

export async function fetchReports(): Promise<ObserverReport[]> {
  return [...reports];
}

export async function saveReport(input: NewReport): Promise<ObserverReport> {
  const report: ObserverReport = {
    id: `draft-${Date.now()}-${reports.length}`,
    title: input.category,
    area: input.location,
    status: "Demo draft",
    time: input.hasVideo ? "This preview session · Video attached" : "This preview session",
  };

  reports = [report, ...reports];
  return report;
}

/** Drops this session's drafts — the next person on the device starts clean. */
export function resetPreviewData(): void {
  reports = [...DEMO_REPORTS];
}
