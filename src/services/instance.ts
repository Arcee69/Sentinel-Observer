import axios from "axios";
import { toApiError } from "./errors";
import { clearSession, getToken } from "./session";

export { errorMessage } from "./errors";

/** Axios instance for the Sentinel API, configured the same way as the agent app's. */
const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL?.trim() ?? "",
  // Field connections are slow; fail visibly rather than hang forever. Uploads
  // override this per request.
  timeout: 60_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/** Attaches the bearer token held in the persisted session. */
apiInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Let the browser set the multipart boundary for media uploads.
  if (config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  }

  return config;
});

/** A rejected token means the session is gone — bounce to login. */
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error);

    // Only a 401 for the session's own token ends the session. A sign-in or
    // sign-up attempt carries none, so wrong credentials stay an ordinary error.
    const token = getToken();
    const sentSessionToken =
      token !== null && error?.config?.headers?.Authorization === `Bearer ${token}`;

    if (apiError.isUnauthorized && sentSessionToken) {
      clearSession();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login?expired=1");
      }
    }

    return Promise.reject(apiError);
  },
);

export default apiInstance;
