import dayjs, { type Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import minMax from "dayjs/plugin/minMax";
import updateLocale from "dayjs/plugin/updateLocale";
import type { CalendarEvent } from "../types/calendar";
import type { Task } from "../types/task";

dayjs.extend(isBetween);
dayjs.extend(minMax);
dayjs.extend(updateLocale);

export const DAYS_PER_WEEK = 7;
export const MAX_EVENTS_TO_DISPLAY = 3;
export const GRID_COLS_7_CLASS = "grid-cols-7";

/** @deprecated Use MAX_EVENTS_TO_DISPLAY */
export const MAX_TASKS_TO_DISPLAY = MAX_EVENTS_TO_DISPLAY;

/** Day of week: 0 = Sunday … 6 = Saturday */
export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/** Apply week start so dayjs `startOf("week")` / `endOf("week")` match. */
export function applyWeekStartsOn(weekStartsOn: WeekStartsOn): void {
  dayjs.updateLocale("en", { weekStart: weekStartsOn });
}

/** Weekday headers rotated so index 0 is `weekStartsOn`. */
export function getWeekdayLabels(weekStartsOn: WeekStartsOn = 0): string[] {
  return [
    ...WEEKDAY_LABELS.slice(weekStartsOn),
    ...WEEKDAY_LABELS.slice(0, weekStartsOn),
  ];
}

/** Empty cells before the first day of a partial week in a 7-column grid. */
export function getLeadingEmptyCount(
  firstDay: Dayjs,
  weekStartsOn: WeekStartsOn = 0,
): number {
  return (firstDay.day() - weekStartsOn + 7) % 7;
}

/**
 * Generates calendar weeks for a given year.
 * Weeks start on `weekStartsOn` and end on `(weekStartsOn + 6) % 7`.
 */
export const generateCalendarWeeks = (
  year: number,
  weekStartsOn: WeekStartsOn = 0,
): Dayjs[][] => {
  const weekEndsOn = ((weekStartsOn + 6) % 7) as WeekStartsOn;
  const startDate = dayjs(`${year}-01-01`);
  const weeks: Dayjs[][] = [];
  let currentWeek: Dayjs[] = [];
  let currentDate = startDate.clone();

  while (currentDate.year() === year) {
    currentWeek.push(currentDate.clone());

    if (currentDate.day() === weekEndsOn) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentDate = currentDate.add(1, "day");
  }

  if (currentWeek.length) {
    weeks.push(currentWeek);
  }

  return weeks;
};

/** Events that overlap a single calendar day. */
export const getEventsForDay = (
  day: Dayjs,
  events: CalendarEvent[],
): CalendarEvent[] => {
  const dayStart = day.startOf("day");
  const dayEnd = day.endOf("day");
  return events.filter((event) => {
    const start = dayjs(event.start);
    const end = dayjs(event.end);
    return (
      (start.isSame(dayStart) || start.isBefore(dayEnd)) &&
      (end.isSame(dayEnd) || end.isAfter(dayStart))
    );
  });
};

/**
 * Filters events that overlap with a given week
 */
export const getEventsForWeek = (
  week: Dayjs[],
  events: CalendarEvent[],
): CalendarEvent[] => {
  return events.filter((event) => {
    const start = dayjs(event.start);
    const end = dayjs(event.end);
    return week.some((day) => day.isBetween(start, end, undefined, "[]"));
  });
};

/**
 * Filters events for a specific year
 */
export const getEventsForYear = (
  week: Dayjs[],
  events: CalendarEvent[],
  year: number,
): CalendarEvent[] => {
  return events.filter((event) => {
    const start = dayjs(event.start);
    const end = dayjs(event.end);
    return (
      week.some((day) => day.isBetween(start, end, undefined, "[]")) &&
      (start.year() === year || end.year() === year)
    );
  });
};

/**
 * Filters tasks that overlap with a given week.
 * @deprecated Use getEventsForWeek with CalendarEvent[] (e.g. tasks.map(mapTaskToEvent))
 */
export const getTasksForWeek = (week: Dayjs[], tasks: Task[]): Task[] => {
  return tasks.filter((task) => {
    const start = dayjs(task.startDate);
    const end = dayjs(task.endDate);
    return week.some((day) => day.isBetween(start, end, undefined, "[]"));
  });
};

/**
 * Filters tasks for a specific year.
 * @deprecated Use getEventsForYear with CalendarEvent[] (e.g. tasks.map(mapEventToTask))
 */
export const getTasksForYear = (
  week: Dayjs[],
  tasks: Task[],
  year: number,
): Task[] => {
  return tasks.filter((task) => {
    const start = dayjs(task.startDate);
    const end = dayjs(task.endDate);
    return (
      week.some((day) => day.isBetween(start, end, undefined, "[]")) &&
      (start.year() === year || end.year() === year)
    );
  });
};
