import type { Dayjs } from "dayjs";

export type CalendarViewMode = "day" | "week" | "month" | "year";

export interface WeekDay {
  dayIndex: number;
  date: string;
}

/** Generic calendar event used by the library. */
export interface CalendarEvent {
  id: string;
  title: string;
  start?: string | Dayjs | null;
  end?: string | Dayjs | null;
  resourceId?: string;
  color?: string;
  meta?: Record<string, unknown>;
}

/** Payload for onEventMove. Return a rejected Promise to rollback. */
export interface CalendarEventMovePayload {
  id: string;
  start: Dayjs;
  end: Dayjs;
  oldStart: Dayjs;
  oldEnd: Dayjs;
  view: CalendarViewMode;
}

/** Payload for onEventResize. Return a rejected Promise to rollback. */
export interface CalendarEventResizePayload {
  id: string;
  start: Dayjs;
  end: Dayjs;
  oldStart: Dayjs;
  oldEnd: Dayjs;
  view: CalendarViewMode;
}

/** Payload for onEventCreate. Return a rejected Promise to rollback. */
export interface CalendarEventCreatePayload {
  id: string;
  title: string;
  start?: Dayjs | null;
  end?: Dayjs | null;
  resourceId?: string;
  color?: string;
  meta?: Record<string, unknown>;
}

/** Editable copy for unscheduled list and similar UI strings. */
export interface CalendarLabels {
  /** Unscheduled list heading. Default: "Unscheduled events" */
  unscheduledTitle?: string;
  /** Hint under the unscheduled list. */
  unscheduledHint?: string;
}
