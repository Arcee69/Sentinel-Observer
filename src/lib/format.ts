/** Small display helpers shared across screens. */

import type { ObserverArea } from "./types";

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || "Observer";
}

/** "Community, Ward, LGA, State" from whichever parts are set — the default report location. */
export function areaLabel(area: Partial<ObserverArea>): string {
  return [area.community, area.ward, area.lga, area.state].filter(Boolean).join(", ");
}

/**
 * The API spells places in capitals ("AKWA IBOM", "AMUWO-ODOFIN"); this is the
 * same name in reading case.
 */
export function placeName(name: string | null | undefined): string {
  if (!name) return "";
  if (name === "FCT") return name;
  return name.toLowerCase().replace(/(^|[^a-z'’])([a-z])/g, (_, lead: string, letter: string) => {
    return lead + letter.toUpperCase();
  });
}

/** The current moment as a `datetime-local` value, in the observer's own timezone. */
export function nowLocalInput(date = new Date()): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

/** "13 Nov 2026 · 12:30 pm" from a `datetime-local` value or an ISO timestamp. */
export function formatObservedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.replace("T", " · ");

  const day = date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const time = date.toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit" });

  return `${day} · ${time}`;
}

export function formatMegabytes(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function formatSeconds(seconds: number): string {
  return `${seconds.toFixed(1)} sec`;
}

/** Joins truthy class names — keeps conditional Tailwind readable. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
