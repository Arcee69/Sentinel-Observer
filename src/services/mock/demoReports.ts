import type { ObserverReport } from "../../lib/types";

/**
 * Illustrative records for the preview. Deliberately generic — no real polling
 * unit, place or event is named, so nothing here can be read as live activity.
 */
export const DEMO_REPORTS: ObserverReport[] = [
  { id: "sample-1", title: "Queue update", area: "Sample polling location A", status: "In review", time: "Sample · 10:45 am" },
  { id: "sample-2", title: "Materials arrival", area: "Sample polling location B", status: "Reviewed", time: "Sample · 9:30 am" },
  { id: "sample-3", title: "General observation", area: "Sample community location", status: "Needs information", time: "Sample · 9:05 am" },
  { id: "sample-4", title: "Voting update", area: "Sample polling location A", status: "Reviewed", time: "Sample · 8:50 am" },
  { id: "sample-5", title: "Queue update", area: "Sample polling location C", status: "In review", time: "Sample · 8:40 am" },
  { id: "sample-6", title: "Materials update", area: "Sample polling location B", status: "Reviewed", time: "Sample · 8:20 am" },
  { id: "sample-7", title: "General observation", area: "Sample community location", status: "In review", time: "Sample · 8:10 am" },
  { id: "sample-8", title: "Opening update", area: "Sample polling location C", status: "Reviewed", time: "Sample · 8:00 am" },
];

export const DEMO_OBSERVER = {
  name: "Demo Observer",
  phone: "08012345678",
  state: "Lagos",
  lga: "Ikeja",
  area: "My local area",
};
