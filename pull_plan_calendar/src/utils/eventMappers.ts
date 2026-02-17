import type { CalendarEvent } from "../types/calendar";
import type { Task } from "../types/task";
import { getTaskColorHex } from "./taskColors";

/**
 * Map a Task to a CalendarEvent. Use this when you want to feed task data into
 * the calendar as generic events (e.g. scheduledEvents = tasks.map(mapTaskToEvent)).
 */
export function mapTaskToEvent(task: Task): CalendarEvent {
  const { id, name, startDate, endDate, progressStatus, employees, ...rest } =
    task;
  return {
    id,
    title: name,
    start: startDate,
    end: endDate,
    color: getTaskColorHex(progressStatus),
    meta: {
      progressStatus,
      employees,
      ...rest,
    },
  };
}

/**
 * Map a CalendarEvent back to a Task. Use this when the calendar was populated
 * from tasks (e.g. to open TaskModal: task={mapEventToTask(selectedEvent)}).
 */
export function mapEventToTask(event: CalendarEvent): Task {
  const meta = event.meta ?? {};
  const { progressStatus, employees, ...restMeta } = meta as {
    progressStatus?: Task["progressStatus"];
    employees?: Task["employees"];
    [key: string]: unknown;
  };
  return {
    id: event.id,
    name: event.title,
    startDate: event.start,
    endDate: event.end,
    progressStatus,
    employees: Array.isArray(employees) ? employees : [],
    ...restMeta,
  };
}
