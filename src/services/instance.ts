import axios, { isAxiosError } from "axios";

/**
 * Axios instance for the Sentinel API. Nothing calls it yet — the preview
 * build's data lives in `observerService.ts` — but it is configured the same
 * way as the agent app's, ready for the observer endpoints.
 */
const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL?.trim() ?? "",
  // Field connections are slow; fail visibly rather than hang forever.
  timeout: 60_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/** The message to show for a failed call: the API's own wording when it sent one. */
export function errorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallback;
  }
  return error instanceof Error && error.message ? error.message : fallback;
}

export default apiInstance;
