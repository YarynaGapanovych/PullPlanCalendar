import dayjs, { type Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import minMax from "dayjs/plugin/minMax";
import type { CalendarEvent } from "../types/calendar";
import type { Task } from "../types/task";

dayjs.extend(isBetween);
dayjs.extend(minMax);

export const DAYS_PER_WEEK = 7;
export const MAX_EVENTS_TO_DISPLAY = 3;
export const GRID_COLS_7_CLASS = "grid-cols-7";

/** @deprecated Use MAX_EVENTS_TO_DISPLAY */
export const MAX_TASKS_TO_DISPLAY = MAX_EVENTS_TO_DISPLAY;

/**
 * Generates calendar weeks for a given year
 */
export const generateCalendarWeeks = (year: number): Dayjs[][] => {
  const startDate = dayjs(`${year}-01-01`);
  const weeks: Dayjs[][] = [];
  let currentWeek: Dayjs[] = [];
  let currentDate = startDate.clone();

  while (currentDate.year() === year) {
    currentWeek.push(currentDate.clone());

    if (currentDate.day() === 6) {
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
 * @deprecated Use getEventsForYear with CalendarEvent[] (e.g. tasks.map(mapTaskToEvent))
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
