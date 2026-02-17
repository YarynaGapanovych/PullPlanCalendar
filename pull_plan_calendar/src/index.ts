export { default as Calendar } from "./components/Calendar";
export { default as DayView } from "./components/DayView";
export { default as WeekView } from "./components/WeekView";
export { default as MonthView } from "./components/MonthView";
export { default as YearView } from "./components/YearView";
export { Week } from "./components/Week";
export { TaskModal } from "./components/tasks/TaskModal";
export { CreateTaskModal } from "./components/tasks/CreateTaskModal";

export type { CalendarProps, CalendarEventPatch } from "./components/Calendar";
export type { DayViewProps } from "./components/DayView";
export type { WeekViewProps } from "./components/WeekView";
export type { MonthViewProps } from "./components/MonthView";
export type { YearViewProps } from "./components/YearView";
export type { WeekProps } from "./components/Week";
export type { TaskModalProps } from "./components/tasks/TaskModal";
export type { CreateTaskModalProps } from "./components/tasks/CreateTaskModal";

export type {
  CalendarViewMode,
  WeekDay,
  CalendarEvent,
  CalendarEventMovePayload,
  CalendarEventResizePayload,
  CalendarEventCreatePayload,
} from "./types/calendar";
export { ProgressStatus, UserRole } from "./types/task";
export type { Task, Area } from "./types/task";
export { mapTaskToEvent, mapEventToTask } from "./utils/eventMappers";
export { getTaskColorHex, DEFAULT_TASK_COLOR } from "./utils/taskColors";
export {
  generateCalendarWeeks,
  getEventsForWeek,
  getEventsForYear,
  getTasksForWeek,
  getTasksForYear,
} from "./utils/calendarHelpers";

/** Optional demo/helper: tabbed wrapper by "area". See src/demo/. */
export { CalendarContainer, type CalendarContainerProps } from "./demo";
