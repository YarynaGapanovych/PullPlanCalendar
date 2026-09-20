import dayjs, { type Dayjs } from "dayjs";

/** Parse "HH:mm" (or "H:mm") into hour and minute. Invalid → null. */
export function parseHHMM(
  value: string,
): { hour: number; minute: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (
    !Number.isFinite(hour) ||
    !Number.isFinite(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }
  return { hour, minute };
}

/** Minutes from midnight for an HH:mm string. */
export function hhmmToMinutes(value: string, fallback: number): number {
  const parsed = parseHHMM(value);
  if (!parsed) return fallback;
  return parsed.hour * 60 + parsed.minute;
}

/** Snap minutes to a grid (default 15). */
export function snapMinutes(minutes: number, step = 15): number {
  if (!Number.isFinite(minutes)) return 0;
  return Math.max(0, Math.round(minutes / step) * step);
}

/**
 * Minutes from the top of a scrollable time grid, snapped (default 15).
 * Uses the scroll container's viewport rect + scrollTop (do not also use a tall child's rect).
 */
export function minutesFromGridPointer(
  clientY: number,
  scrollEl: HTMLElement,
  hourRowHeight: number,
  step = 15,
): number {
  const rect = scrollEl.getBoundingClientRect();
  const y = clientY - rect.top + scrollEl.scrollTop;
  return snapMinutes((y / hourRowHeight) * 60, step);
}

/** Keep an event start inside [windowStart, windowEnd − duration]. */
export function clampStartToWindow(
  start: Dayjs,
  windowStart: Dayjs,
  windowEnd: Dayjs,
  durationMinutes: number,
): Dayjs {
  const duration = Math.max(durationMinutes, 1);
  const lastStart = windowEnd.subtract(duration, "minute");
  if (!lastStart.isAfter(windowStart)) {
    return windowStart.clone();
  }
  if (start.isBefore(windowStart)) {
    return windowStart.clone();
  }
  if (start.isAfter(lastStart)) {
    return lastStart.clone();
  }
  return start;
}

/**
 * Visible hour range for the day grid.
 * When showFullDay is false: workdayStart−1h … workdayEnd+1h (clamped 0–24).
 * Hours are integer start hours included; endHour is exclusive for row count.
 */
export function getVisibleHourRange(
  workdayStart: string,
  workdayEnd: string,
  showFullDay: boolean,
): { startHour: number; endHour: number } {
  if (showFullDay) {
    return { startHour: 0, endHour: 24 };
  }
  const startMin = hhmmToMinutes(workdayStart, 9 * 60);
  const endMin = hhmmToMinutes(workdayEnd, 17 * 60);
  const startHour = Math.max(0, Math.floor(startMin / 60) - 1);
  const endHour = Math.min(24, Math.ceil(endMin / 60) + 1);
  if (endHour <= startHour) {
    return { startHour: 0, endHour: 24 };
  }
  return { startHour, endHour };
}

export function formatHourLabel(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}

/** Format for datetime-local input. Empty when the value is missing. */
export function toDatetimeLocalValue(value: Dayjs | null | undefined): string {
  if (!value || !value.isValid()) return "";
  return value.format("YYYY-MM-DDTHH:mm");
}

export function fromDatetimeLocalValue(value: string): Dayjs | null {
  if (!value) return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
}
