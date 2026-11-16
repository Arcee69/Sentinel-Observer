/** Endpoint paths for the Sentinel API, relative to `VITE_API_BASE_URL` (…/api/v1). */

export const API = {
  auth: {
    register: "/observer/auth/register",
    login: "/observer/auth/login",
    logout: "/observer/auth/logout",
    forgotPassword: "/observer/auth/password/forgot",
    resetPassword: "/observer/auth/password/reset",
  },
  observer: {
    metadata: "/observer/metadata",
    areas: "/observer/areas",
    me: "/observer/me",
    dashboard: "/observer/dashboard",
  },
  report: {
    list: "/observer/reports",
    show: (reportId: string) => `/observer/reports/${reportId}`,
    media: (reportId: string) => `/observer/reports/${reportId}/media`,
    mediaDownload: (reportId: string, mediaId: string) =>
      `/observer/reports/${reportId}/media/${mediaId}/download`,
  },
} as const;
