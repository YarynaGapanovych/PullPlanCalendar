import dayjs from "dayjs";
import type { CSSProperties } from "react";
import type { CalendarEvent } from "../types/calendar";

/** True when the event spans a full local calendar day (or more). */
export function isAllDayLikeEvent(event: CalendarEvent): boolean {
  const start = dayjs(event.start);
  const end = dayjs(event.end);
  if (!start.isValid() || !end.isValid()) return false;
  const spansAtLeastOneDay = end.diff(start, "day", true) >= 1;
  const startsAtMidnight = start.isSame(start.startOf("day"));
  const endsAtMidnight = end.isSame(end.startOf("day"));
  return spansAtLeastOneDay && startsAtMidnight && endsAtMidnight;
}

/** Short time range for chips, e.g. "9:00 AM – 10:30 AM". Empty for all-day-like. */
export function formatEventTimeLabel(event: CalendarEvent): string {
  if (isAllDayLikeEvent(event)) return "";
  const start = dayjs(event.start);
  const end = dayjs(event.end);
  if (!start.isValid() || !end.isValid()) return "";
  const fmt = "h:mm A";
  if (start.isSame(end, "day")) {
    return `${start.format(fmt)} – ${end.format(fmt)}`;
  }
  return `${start.format("MMM D h:mm A")} – ${end.format("MMM D h:mm A")}`;
}

/** Background/border for event chips so `event.color` paints. */
export function getEventChipStyle(
  event: CalendarEvent,
  extra?: CSSProperties,
): CSSProperties {
  return {
    backgroundColor: event.color ?? "var(--event-bg, #e0e7ff)",
    border: "1px solid var(--event-border, #c7d2fe)",
    ...extra,
  };
}
