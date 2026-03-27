import * as react_jsx_runtime from 'react/jsx-runtime';
import dayjs, { Dayjs } from 'dayjs';

declare enum ProgressStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    BLOCKED = "BLOCKED"
}
declare enum UserRole {
    ADMIN = "ADMIN",
    WORKER = "WORKER",
    MANAGER = "MANAGER"
}
interface Task {
    id: string;
    name: string;
    startDate: string | Dayjs;
    endDate: string | Dayjs;
    employees: Array<{
        id: string;
        name?: string;
        [key: string]: unknown;
    }>;
    progressStatus?: ProgressStatus;
    [key: string]: unknown;
}
interface Area {
    id: string;
    name: string;
    [key: string]: unknown;
}

interface TaskModalProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    updateTask?: (options?: {
        variables?: {
            data: Record<string, unknown>;
        };
        onError?: (error: Error) => void;
    }) => Promise<unknown>;
    onTaskUpdated?: () => Promise<void>;
    className?: string;
}
declare function TaskModal({ task, isOpen, onClose, className, }: TaskModalProps): react_jsx_runtime.JSX.Element | null;

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    areaId?: string;
    onSubmit?: (data: {
        name: string;
        startDate: Dayjs;
        endDate: Dayjs;
    }) => Promise<void>;
    className?: string;
}
declare function CreateTaskModal({ isOpen, onClose, areaId, onSubmit, className, }: CreateTaskModalProps): react_jsx_runtime.JSX.Element | null;

type CalendarViewMode = "day" | "week" | "month" | "year";
interface WeekDay {
    dayIndex: number;
    date: string;
}
/** Generic calendar event used by the library. */
interface CalendarEvent {
    id: string;
    title: string;
    start: string | Dayjs;
    end: string | Dayjs;
    resourceId?: string;
    color?: string;
    meta?: Record<string, unknown>;
}
/** Payload for onEventMove. Return a rejected Promise to rollback. */
interface CalendarEventMovePayload {
    id: string;
    start: Dayjs;
    end: Dayjs;
    oldStart: Dayjs;
    oldEnd: Dayjs;
    view: CalendarViewMode;
}
/** Payload for onEventResize. Return a rejected Promise to rollback. */
interface CalendarEventResizePayload {
    id: string;
    start: Dayjs;
    end: Dayjs;
    oldStart: Dayjs;
    oldEnd: Dayjs;
    view: CalendarViewMode;
}
/** Payload for onEventCreate. Return a rejected Promise to rollback. */
interface CalendarEventCreatePayload {
    id: string;
    title: string;
    start: Dayjs;
    end: Dayjs;
    resourceId?: string;
    color?: string;
    meta?: Record<string, unknown>;
}

/** Patch for a single event update (e.g. drag/resize). Use with onEventChange. */
type CalendarEventPatch = Partial<Pick<CalendarEvent, "start" | "end" | "title" | "resourceId" | "color" | "meta">>;
interface CalendarProps {
    /** Controlled events (scheduled on the calendar). When set, calendar uses this instead of internal state. */
    events?: CalendarEvent[];
    /** Notify when the full events list changes. Use with controlled `events`. */
    onEventsChange?: (events: CalendarEvent[]) => void;
    /** Notify when a single event is updated (e.g. drag/resize). Alternative to onEventsChange for granular updates. */
    onEventChange?: (event: CalendarEvent, patch: CalendarEventPatch) => void;
    /** Controlled visible date (e.g. week start for week view). */
    date?: Dayjs;
    /** Notify when the visible date changes (navigation). */
    onDateChange?: (date: Dayjs) => void;
    /** Controlled view mode. */
    view?: CalendarViewMode;
    /** Notify when the view mode changes. */
    onViewChange?: (view: CalendarViewMode) => void;
    /** Initial events when using uncontrolled mode. */
    defaultEvents?: CalendarEvent[];
    /** Initial scheduled events (uncontrolled). */
    defaultScheduledEvents?: CalendarEvent[];
    /** Initial unscheduled events (uncontrolled). */
    defaultUnscheduledEvents?: CalendarEvent[];
    /** Initial visible date when using uncontrolled mode. */
    defaultDate?: Dayjs;
    /** Initial view mode when using uncontrolled mode. */
    defaultView?: CalendarViewMode;
    showSwitcher?: boolean;
    views?: CalendarViewMode[];
    /** Called when an event is moved (drag). Reject to rollback. */
    onEventMove?: (payload: CalendarEventMovePayload) => Promise<void>;
    /** Called when an event is resized. Reject to rollback. */
    onEventResize?: (payload: CalendarEventResizePayload) => Promise<void>;
    /** Called when a new event is created. Reject to rollback. */
    onEventCreate?: (payload: CalendarEventCreatePayload) => Promise<void>;
    /** Called when an event is clicked. */
    onEventClick?: (event: CalendarEvent) => Promise<void>;
    /** Called when a date is clicked (e.g. to create). Reject to prevent opening create UI. */
    onDateClick?: (date: Dayjs, view: CalendarViewMode) => Promise<void>;
    /** When true, disables drag/resize and create buttons. */
    readOnly?: boolean;
    /** Optional: map event → task to show TaskModal when using task-based flows (e.g. mapEventToTask). */
    mapFromEvent?: (event: CalendarEvent) => Task;
    /** Custom "add event" button for day view; receives onClick. If not set, default "+" is used. */
    AddEventButton?: React.ComponentType<{
        onClick: () => void;
    }>;
    /** Custom create-event modal for day view. If not set, default CreateTaskModal is used. */
    CreateEventModal?: React.ComponentType<CreateTaskModalProps>;
    /** Custom button to open event details (day view). Receives event and onOpen. */
    EventActionButton?: React.ComponentType<{
        event: CalendarEvent;
        onOpen: () => void;
    }>;
    /** Custom modal for viewing event details (day view). If not set, default TaskModal is used. */
    EventDetailModal?: React.ComponentType<TaskModalProps>;
    /** Content for day view "previous day" nav button. Default: ← */
    previousDayButtonContent?: React.ReactNode;
    /** Content for day view "next day" nav button. Default: → */
    nextDayButtonContent?: React.ReactNode;
    /** Content for week view "previous week" nav button. Default: ← */
    previousWeekButtonContent?: React.ReactNode;
    /** Content for week view "next week" nav button. Default: → */
    nextWeekButtonContent?: React.ReactNode;
    /** Content for month view "previous month" nav button. Default: ← */
    previousMonthButtonContent?: React.ReactNode;
    /** Content for month view "next month" nav button. Default: → */
    nextMonthButtonContent?: React.ReactNode;
    /** Content for year view "previous year" nav button. Default: ← */
    previousYearButtonContent?: React.ReactNode;
    /** Content for year view "next year" nav button. Default: → */
    nextYearButtonContent?: React.ReactNode;
    /** Root element class name. */
    className?: string;
    /** Root element inline style. */
    style?: React.CSSProperties;
    /** Class name for the view switcher (SegmentedControl container). */
    viewSwitcherClassName?: string;
    /** Class name for each view switcher option button. */
    viewSwitcherButtonClassName?: string;
}
declare function Calendar({ events, onEventsChange, onEventChange, date, onDateChange, view, onViewChange, defaultEvents, defaultScheduledEvents, defaultUnscheduledEvents, defaultDate, defaultView, showSwitcher, views, onEventMove, onEventResize, onEventCreate, onEventClick, onDateClick, readOnly, mapFromEvent, AddEventButton, CreateEventModal, EventActionButton, EventDetailModal, previousDayButtonContent, nextDayButtonContent, previousWeekButtonContent, nextWeekButtonContent, previousMonthButtonContent, nextMonthButtonContent, previousYearButtonContent, nextYearButtonContent, className, style, viewSwitcherClassName, viewSwitcherButtonClassName, }: CalendarProps): react_jsx_runtime.JSX.Element;

interface DayViewProps {
    startDate: dayjs.Dayjs;
    setStartDate: (date: dayjs.Dayjs) => void;
    scheduledEvents: CalendarEvent[];
    unscheduledEvents: CalendarEvent[];
    setScheduledEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
    setUnscheduledEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
    onEventMove?: (payload: CalendarEventMovePayload) => Promise<void>;
    onEventResize?: (payload: CalendarEventResizePayload) => Promise<void>;
    onEventCreate?: (payload: CalendarEventCreatePayload) => Promise<void>;
    onEventClick?: (event: CalendarEvent) => Promise<void>;
    onDateClick?: (date: dayjs.Dayjs, view: CalendarViewMode) => Promise<void>;
    readOnly?: boolean;
    updateTask?: (options?: {
        variables?: {
            data: Record<string, unknown>;
        };
        onError?: (error: Error) => void;
    }) => Promise<void>;
    /** Optional: map event → task to show TaskModal (e.g. mapEventToTask). */
    mapFromEvent?: (event: CalendarEvent) => Task;
    /** Custom "add event" button; receives onClick. If not set, default "+" button is used. */
    AddEventButton?: React.ComponentType<{
        onClick: () => void;
    }>;
    /** Custom create-event modal. If not set, default CreateTaskModal is used. Must accept isOpen, onClose, onSubmit. */
    CreateEventModal?: React.ComponentType<CreateTaskModalProps>;
    /** Custom button to open event details (replaces default "View"). Receives event and onOpen. */
    EventActionButton?: React.ComponentType<{
        event: CalendarEvent;
        onOpen: () => void;
    }>;
    /** Custom modal for viewing event details. If not set, default TaskModal is used (requires mapFromEvent). */
    EventDetailModal?: React.ComponentType<TaskModalProps>;
    /** Content for the "previous day" nav button. Default: ← */
    previousDayButtonContent?: React.ReactNode;
    /** Content for the "next day" nav button. Default: → */
    nextDayButtonContent?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
declare function DayView({ startDate, setStartDate, scheduledEvents, unscheduledEvents, setScheduledEvents, setUnscheduledEvents, onEventMove, onEventResize, onEventCreate, onEventClick, onDateClick, readOnly, updateTask, mapFromEvent, AddEventButton, CreateEventModal, EventActionButton, EventDetailModal, previousDayButtonContent, nextDayButtonContent, className, style, }: DayViewProps): react_jsx_runtime.JSX.Element;

interface WeekViewProps {
    startDate: dayjs.Dayjs;
    setStartDate: (date: dayjs.Dayjs) => void;
    scheduledEvents: CalendarEvent[];
    unscheduledEvents: CalendarEvent[];
    setScheduledEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
    setUnscheduledEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
    onEventMove?: (payload: CalendarEventMovePayload) => Promise<void>;
    onEventResize?: (payload: CalendarEventResizePayload) => Promise<void>;
    onEventCreate?: (payload: CalendarEventCreatePayload) => Promise<void>;
    onEventClick?: (event: CalendarEvent) => Promise<void>;
    onDateClick?: (date: dayjs.Dayjs, view: CalendarViewMode) => Promise<void>;
    readOnly?: boolean;
    updateTask?: (options?: {
        variables?: {
            data: Record<string, unknown>;
        };
        onError?: (error: Error) => void;
    }) => Promise<void>;
    /** Optional: map event → task to show TaskModal (e.g. mapEventToTask). */
    mapFromEvent?: (event: CalendarEvent) => Task;
    /** Custom "add event" button; receives onClick. If not set, default "+" button is used. */
    AddEventButton?: React.ComponentType<{
        onClick: () => void;
    }>;
    /** Custom create-event modal. If not set, default CreateTaskModal is used. */
    CreateEventModal?: React.ComponentType<CreateTaskModalProps>;
    /** Custom button to open event details (replaces default "View"). Receives event and onOpen. */
    EventActionButton?: React.ComponentType<{
        event: CalendarEvent;
        onOpen: () => void;
    }>;
    /** Custom modal for viewing event details. If not set, default TaskModal is used (requires mapFromEvent). */
    EventDetailModal?: React.ComponentType<TaskModalProps>;
    /** Content for the "previous week" nav button. Default: ← */
    previousWeekButtonContent?: React.ReactNode;
    /** Content for the "next week" nav button. Default: → */
    nextWeekButtonContent?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
declare function WeekView({ startDate, scheduledEvents, unscheduledEvents, setScheduledEvents, setUnscheduledEvents, setStartDate, onEventMove, onEventResize, onEventCreate, onEventClick, onDateClick, readOnly, updateTask, mapFromEvent, AddEventButton, CreateEventModal, EventActionButton, EventDetailModal, previousWeekButtonContent, nextWeekButtonContent, className, style, }: WeekViewProps): react_jsx_runtime.JSX.Element;

/**
 * Generates calendar weeks for a given year
 */
declare const generateCalendarWeeks: (year: number) => Dayjs[][];
/**
 * Filters events that overlap with a given week
 */
declare const getEventsForWeek: (week: Dayjs[], events: CalendarEvent[]) => CalendarEvent[];
/**
 * Filters events for a specific year
 */
declare const getEventsForYear: (week: Dayjs[], events: CalendarEvent[], year: number) => CalendarEvent[];
/**
 * Filters tasks that overlap with a given week.
 * @deprecated Use getEventsForWeek with CalendarEvent[] (e.g. tasks.map(mapTaskToEvent))
 */
declare const getTasksForWeek: (week: Dayjs[], tasks: Task[]) => Task[];
/**
 * Filters tasks for a specific year.
 * @deprecated Use getEventsForYear with CalendarEvent[] (e.g. tasks.map(mapTaskToEvent))
 */
declare const getTasksForYear: (week: Dayjs[], tasks: Task[], year: number) => Task[];

interface MonthViewProps {
    events: CalendarEvent[];
    setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
    setStartDate: (date: Dayjs) => void;
    setZoomLevel: (zoom: "year" | "week") => void;
    onEventClick?: (event: CalendarEvent) => Promise<void>;
    onDateClick?: (date: Dayjs, view: CalendarViewMode) => Promise<void>;
    readOnly?: boolean;
    updateTask?: (options?: {
        variables?: {
            data: Record<string, unknown>;
        };
        onError?: (error: Error) => void;
    }) => Promise<unknown>;
    /** Optional: map event → task to show TaskModal (e.g. mapEventToTask). */
    mapFromEvent?: (event: CalendarEvent) => Task;
    /** Custom "add event" button; receives onClick. If not set, no add button is shown in month view. */
    AddEventButton?: React.ComponentType<{
        onClick: () => void;
    }>;
    /** Custom create-event modal. If not set, default CreateTaskModal is used. */
    CreateEventModal?: React.ComponentType<CreateTaskModalProps>;
    /** Content for the "previous month" nav button. Default: ← */
    previousMonthButtonContent?: React.ReactNode;
    /** Content for the "next month" nav button. Default: → */
    nextMonthButtonContent?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
declare function MonthView({ events, setEvents, setStartDate, setZoomLevel, onEventClick, onDateClick, readOnly, updateTask, mapFromEvent, AddEventButton, CreateEventModal, previousMonthButtonContent, nextMonthButtonContent, className, style, }: MonthViewProps): react_jsx_runtime.JSX.Element;

interface YearViewProps {
    events: CalendarEvent[];
    setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
    setStartDate: (date: Dayjs) => void;
    setZoomLevel: (zoom: "year" | "week") => void;
    onEventClick?: (event: CalendarEvent) => Promise<void>;
    onDateClick?: (date: Dayjs, view: CalendarViewMode) => Promise<void>;
    readOnly?: boolean;
    updateTask?: (options?: {
        variables?: {
            data: Record<string, unknown>;
        };
        onError?: (error: Error) => void;
    }) => Promise<unknown>;
    /** Optional: map event → task to show TaskModal (e.g. mapEventToTask). */
    mapFromEvent?: (event: CalendarEvent) => Task;
    /** Custom "add event" button; receives onClick. If not set, no add button is shown in year view. */
    AddEventButton?: React.ComponentType<{
        onClick: () => void;
    }>;
    /** Custom create-event modal. If not set, default CreateTaskModal is used. */
    CreateEventModal?: React.ComponentType<CreateTaskModalProps>;
    /** Content for the "previous year" nav button. Default: ← */
    previousYearButtonContent?: React.ReactNode;
    /** Content for the "next year" nav button. Default: → */
    nextYearButtonContent?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
declare function YearView({ events, setEvents, setStartDate, setZoomLevel, onEventClick, onDateClick, readOnly, updateTask, mapFromEvent, AddEventButton, CreateEventModal, previousYearButtonContent, nextYearButtonContent, className, style, }: YearViewProps): react_jsx_runtime.JSX.Element;

interface WeekProps {
    days: Dayjs[];
    events: CalendarEvent[];
    onSelectDate: (date: Dayjs) => void;
    currentMonth: number;
    isMonthView?: boolean;
    view?: CalendarViewMode;
    readOnly?: boolean;
    onEventClick?: (event: CalendarEvent) => Promise<void>;
    onDateClick?: (date: Dayjs, view: CalendarViewMode) => Promise<void>;
    updateTask?: (options?: {
        variables?: {
            data: Record<string, unknown>;
        };
        onError?: (error: Error) => void;
    }) => Promise<unknown>;
    /** Optional: map event → task to show TaskModal (e.g. mapEventToTask). */
    mapFromEvent?: (event: CalendarEvent) => Task;
}
declare function Week({ days, events, onSelectDate, currentMonth, isMonthView, view, readOnly, onEventClick, onDateClick, updateTask, mapFromEvent, }: WeekProps): react_jsx_runtime.JSX.Element;

/**
 * Map a Task to a CalendarEvent. Use this when you want to feed task data into
 * the calendar as generic events (e.g. scheduledEvents = tasks.map(mapTaskToEvent)).
 */
declare function mapTaskToEvent(task: Task): CalendarEvent;
/**
 * Map a CalendarEvent back to a Task. Use this when the calendar was populated
 * from tasks (e.g. to open TaskModal: task={mapEventToTask(selectedEvent)}).
 */
declare function mapEventToTask(event: CalendarEvent): Task;

declare const getTaskColorHex: (status?: ProgressStatus) => string | undefined;
declare const DEFAULT_TASK_COLOR = "#b1724b";

/**
 * Optional demo/helper: tabbed wrapper that renders one Calendar per "area".
 * Calendar itself is area-agnostic; use this only for demos or app-specific tab UIs.
 */
interface CalendarContainerProps {
    showSwitcher?: boolean;
    showTabs?: boolean;
    views?: CalendarViewMode[];
    /** Areas to show as tabs. When empty and showTabs is true, a single calendar is shown without tabs. */
    areas?: Area[];
    /** Initial scheduled events (uncontrolled). */
    defaultScheduledEvents?: CalendarEvent[];
    /** Initial unscheduled events (uncontrolled). */
    defaultUnscheduledEvents?: CalendarEvent[];
    onEventMove?: (payload: CalendarEventMovePayload) => Promise<void>;
    onEventResize?: (payload: CalendarEventResizePayload) => Promise<void>;
    onEventCreate?: (payload: CalendarEventCreatePayload) => Promise<void>;
    onEventClick?: (event: CalendarEvent) => Promise<void>;
    onDateClick?: (date: Dayjs, view: CalendarViewMode) => Promise<void>;
    readOnly?: boolean;
    /** Optional: map event → task for TaskModal (e.g. mapEventToTask). */
    mapFromEvent?: (event: CalendarEvent) => Task;
    /** Custom "add event" button (day view); receives onClick. If not set, default "+" is used. */
    AddEventButton?: React.ComponentType<{
        onClick: () => void;
    }>;
    /** Custom create-event modal (day view). If not set, default CreateTaskModal is used. */
    CreateEventModal?: React.ComponentType<CreateTaskModalProps>;
    /** Custom button to open event details (day view). Receives event and onOpen. */
    EventActionButton?: React.ComponentType<{
        event: CalendarEvent;
        onOpen: () => void;
    }>;
    /** Custom modal for viewing event details (day view). If not set, default TaskModal is used. */
    EventDetailModal?: React.ComponentType<TaskModalProps>;
    /** Content for day view "previous day" nav button. Default: ← */
    previousDayButtonContent?: React.ReactNode;
    /** Content for day view "next day" nav button. Default: → */
    nextDayButtonContent?: React.ReactNode;
    /** Content for week view "previous week" nav button. Default: ← */
    previousWeekButtonContent?: React.ReactNode;
    /** Content for week view "next week" nav button. Default: → */
    nextWeekButtonContent?: React.ReactNode;
    /** Content for month view "previous month" nav button. Default: ← */
    previousMonthButtonContent?: React.ReactNode;
    /** Content for month view "next month" nav button. Default: → */
    nextMonthButtonContent?: React.ReactNode;
    /** Content for year view "previous year" nav button. Default: ← */
    previousYearButtonContent?: React.ReactNode;
    /** Content for year view "next year" nav button. Default: → */
    nextYearButtonContent?: React.ReactNode;
    /** Class name for the view switcher (SegmentedControl container). */
    viewSwitcherClassName?: string;
    /** Class name for each view switcher option button. */
    viewSwitcherButtonClassName?: string;
}
declare function CalendarContainer({ showSwitcher, showTabs, views, areas, defaultScheduledEvents, defaultUnscheduledEvents, onEventMove, onEventResize, onEventCreate, onEventClick, onDateClick, readOnly, mapFromEvent, AddEventButton, CreateEventModal, EventActionButton, EventDetailModal, previousDayButtonContent, nextDayButtonContent, previousWeekButtonContent, nextWeekButtonContent, previousMonthButtonContent, nextMonthButtonContent, previousYearButtonContent, nextYearButtonContent, viewSwitcherClassName, viewSwitcherButtonClassName, }: CalendarContainerProps): react_jsx_runtime.JSX.Element;

export { type Area, Calendar, CalendarContainer, type CalendarContainerProps, type CalendarEvent, type CalendarEventCreatePayload, type CalendarEventMovePayload, type CalendarEventPatch, type CalendarEventResizePayload, type CalendarProps, type CalendarViewMode, CreateTaskModal, type CreateTaskModalProps, DEFAULT_TASK_COLOR, DayView, type DayViewProps, MonthView, type MonthViewProps, ProgressStatus, type Task, TaskModal, type TaskModalProps, UserRole, Week, type WeekDay, type WeekProps, WeekView, type WeekViewProps, YearView, type YearViewProps, generateCalendarWeeks, getEventsForWeek, getEventsForYear, getTaskColorHex, getTasksForWeek, getTasksForYear, mapEventToTask, mapTaskToEvent };
