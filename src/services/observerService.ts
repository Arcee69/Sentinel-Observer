import { API } from "./api";
import apiInstance from "./instance";
import { toApiError } from "./errors";
import { getAllPages, getList, getMethod, patchMethod, postMethod } from "./requests";
import { DEVICE_NAME, REPORTS_PAGE_SIZE, STATUS_CODE, STATUS_LABEL } from "../lib/constants";
import { formatObservedAt, placeName } from "../lib/format";
import type {
  ApiArea,
  ApiAuthResult,
  ApiDashboard,
  ApiMetadata,
  ApiObserver,
  ApiReport,
  AreaSelection,
  Credentials,
  Dashboard,
  NewReport,
  Observer,
  ObserverReport,
  Place,
  ReportPage,
  ReportStatus,
  Session,
  SignupDetails,
  SubmissionProgress,
} from "../lib/types";

/**
 * The one place screens talk to the backend.
 *
 * Every response is `{ success, message, data, meta }`; the helpers in
 * `./requests` return the envelope and this file maps `data` into the shapes
 * in `lib/types`.
 */

/* -------------------------------------------------------------------------- */
/*                              Account + profile                             */
/* -------------------------------------------------------------------------- */

function mapObserver(observer: ApiObserver): Observer {
  return {
    id: observer.id,
    name: observer.name,
    phone: observer.phone,
    areaSetupRequired: observer.area_setup_required,
    stateId: observer.state_id,
    state: placeName(observer.state_name),
    lgaId: observer.lga_id,
    lga: placeName(observer.lga_name),
    wardId: observer.ward_id,
    ward: placeName(observer.ward_name),
    community: observer.community ?? "",
  };
}

function toSession(result: ApiAuthResult): Session {
  return {
    token: result.token,
    expiresAt: result.expires_at,
    observer: mapObserver(result.observer),
  };
}

function areaPayload(area: AreaSelection) {
  return {
    state_id: area.stateId,
    lga_id: area.lgaId,
    ward_id: area.wardId,
    community: area.community,
  };
}

/** Creates the account and signs it in — observers need no approval. */
export async function signUp(details: SignupDetails, area: AreaSelection): Promise<Session> {
  const { data } = await postMethod<ApiAuthResult>(API.auth.register, {
    name: details.name,
    phone: details.phone,
    password: details.password,
    // The form has one password field with a show/hide toggle instead of a second box.
    password_confirmation: details.password,
    device_name: DEVICE_NAME,
    ...areaPayload(area),
    // The area form can't be sent without ticking this.
    responsible_reporting_accepted: true,
  });
  return toSession(data);
}

export async function login(credentials: Credentials): Promise<Session> {
  const { data } = await postMethod<ApiAuthResult>(API.auth.login, {
    phone: credentials.phone,
    password: credentials.password,
    device_name: DEVICE_NAME,
  });
  return toSession(data);
}

/** Pass the token explicitly when the local session is cleared at the same time. */
export async function logout(token?: string): Promise<void> {
  // A failed logout shouldn't trap the observer in a session they've left.
  await postMethod(
    API.auth.logout,
    undefined,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  ).catch(() => undefined);
}

/** Texts a recovery code. Answers 503 while the SMS provider isn't configured. */
export async function requestRecovery(phone: string): Promise<void> {
  await postMethod(API.auth.forgotPassword, { phone });
}

export async function resetPassword(payload: {
  phone: string;
  code: string;
  password: string;
}): Promise<void> {
  await postMethod(API.auth.resetPassword, {
    phone: payload.phone,
    code: payload.code,
    password: payload.password,
    password_confirmation: payload.password,
  });
}

export async function fetchMetadata(): Promise<ApiMetadata> {
  const res = await getMethod<ApiMetadata>(API.observer.metadata);
  return res.data;
}

export async function fetchProfile(): Promise<Observer> {
  const res = await getMethod<ApiObserver>(API.observer.me);
  return mapObserver(res.data);
}

export async function updateArea(area: AreaSelection): Promise<Observer> {
  const res = await patchMethod<ApiObserver>(API.observer.me, areaPayload(area));
  return mapObserver(res.data);
}

/**
 * The places directly under `parentId`: states and the FCT when it is omitted,
 * a state's LGAs, an LGA's wards.
 */
export async function fetchAreas(parentId?: string): Promise<Place[]> {
  // 100 is the most the API returns per page.
  const areas = await getAllPages<ApiArea>(API.observer.areas, {
    parent_id: parentId,
    per_page: 100,
  });
  return areas
    .map((area) => ({ id: area.id, name: placeName(area.name) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/* -------------------------------------------------------------------------- */
/*                                   Reports                                  */
/* -------------------------------------------------------------------------- */

function mapReport(report: ApiReport): ObserverReport {
  return {
    id: report.id,
    title: report.category_label,
    area: report.location,
    status: STATUS_LABEL[report.status] ?? "In review",
    time: formatObservedAt(report.observed_at),
    reviewNotes: report.review_notes,
  };
}

export async function fetchDashboard(): Promise<Dashboard> {
  const { data } = await getMethod<ApiDashboard>(API.observer.dashboard);
  return {
    total: data.counts.total,
    counts: {
      "In review": data.counts.in_review,
      Reviewed: data.counts.reviewed,
      "Needs information": data.counts.needs_information,
      Draft: data.counts.draft,
    },
    recent: data.recent_reports.map(mapReport),
  };
}

/** One page of the observer's own reports, newest first. */
export async function fetchReports(status: ReportStatus | null, page: number): Promise<ReportPage> {
  const res = await getList<ApiReport>(API.report.list, {
    status: status ? STATUS_CODE[status] : undefined,
    per_page: REPORTS_PAGE_SIZE,
    page,
  });
  return {
    reports: res.data.map(mapReport),
    page: Number(res.meta.current_page ?? page),
    pages: Math.max(1, Number(res.meta.last_page ?? 1)),
    total: Number(res.meta.total ?? res.data.length),
  };
}

/* -------------------------------------------------------------------------- */
/*                              Filing a report                               */
/* -------------------------------------------------------------------------- */

export interface SubmitHandlers {
  /** Called each time the server holds more of the report, so a retry can resume. */
  onCheckpoint: (progress: SubmissionProgress) => void;
  /** Reports progress while attachments upload, 0–100. */
  onUploadProgress?: (percent: number) => void;
}

type ReportFields = Pick<ApiReport, "category" | "location" | "details" | "observed_at">;

/**
 * Saves the private draft the attachments hang off. Safe to repeat: the same
 * submission ID and body return the draft already saved.
 */
async function createDraft(submissionId: string, fields: ReportFields): Promise<ApiReport> {
  try {
    const { data } = await postMethod<ApiReport>(API.report.list, {
      client_submission_id: submissionId,
      ...fields,
      status: "draft",
    });
    return data;
  } catch (error) {
    if (!toApiError(error).isConflict) throw error;

    // An earlier attempt reached the server but its answer never arrived, and
    // the observer has edited the report since. Pick that draft back up — the
    // final save carries the edits.
    const drafts = await getAllPages<ApiReport>(API.report.list, { status: "draft", per_page: 25 });
    const existing = drafts.find((draft) => draft.client_submission_id === submissionId);
    if (!existing) throw error;
    return existing;
  }
}

/** Moves the draft into the review queue with the observer's final wording. */
async function sendForReview(
  reportId: string,
  revision: number,
  fields: ReportFields,
): Promise<ApiReport> {
  const send = (expected: number) =>
    patchMethod<ApiReport>(API.report.show(reportId), {
      expected_revision: expected,
      ...fields,
      status: "in_review",
    });

  try {
    return (await send(revision)).data;
  } catch (error) {
    if (!toApiError(error).isConflict) throw error;

    // The revision moved on. If an earlier attempt landed without its answer
    // arriving, the report is already in the queue; otherwise save again on
    // top of the current revision.
    const { data: current } = await getMethod<ApiReport>(API.report.show(reportId));
    if (current.status !== "draft") return current;
    return (await send(current.revision)).data;
  }
}

/**
 * Files a report in the three steps the API expects: save a private draft,
 * upload any attachments to it, then send it for review. Nothing reaches the
 * review queue until the last step, and each finished step is reported through
 * `onCheckpoint` so a retry after a dropped connection carries on from there.
 */
export async function submitReport(
  input: NewReport,
  saved: SubmissionProgress | null,
  { onCheckpoint, onUploadProgress }: SubmitHandlers,
): Promise<ObserverReport> {
  const fields: ReportFields = {
    category: input.category,
    location: input.location,
    details: input.details,
    observed_at: input.observedAt,
  };

  let progress: SubmissionProgress = saved ?? { submissionId: crypto.randomUUID() };
  const checkpoint = (patch: Partial<SubmissionProgress>) => {
    progress = { ...progress, ...patch };
    onCheckpoint(progress);
  };
  // Kept before the first call, so a lost answer doesn't lead to a second report.
  checkpoint({});

  let { reportId, revision } = progress;
  if (!reportId || revision === undefined) {
    const draft = await createDraft(progress.submissionId, fields);
    reportId = draft.id;
    revision = draft.revision;
    checkpoint({ reportId, revision });
  }

  const pending = (
    [
      ["photo", input.photo],
      ["video", input.video],
    ] as const
  ).flatMap(([slot, file]) => (file && progress[slot] !== file ? [{ slot, file }] : []));

  const total = pending.reduce((sum, { file }) => sum + file.size, 0) || 1;
  let sent = 0;

  for (const { slot, file } of pending) {
    const form = new FormData();
    form.append("file", file, file.name);

    await apiInstance.post(API.report.media(reportId), form, {
      // Video on a weak signal takes a while; don't cut it off at the default.
      timeout: 10 * 60_000,
      onUploadProgress: (event) => {
        onUploadProgress?.(Math.min(100, Math.round(((sent + event.loaded) / total) * 100)));
      },
    });

    sent += file.size;
    checkpoint({ [slot]: file });
  }

  return mapReport(await sendForReview(reportId, revision, fields));
}
