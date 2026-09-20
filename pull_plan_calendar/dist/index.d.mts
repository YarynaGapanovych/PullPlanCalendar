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
    startDate?: string | Dayjs | null;
    endDate?: string | Dayjs | null;
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
        startDate: Dayjs | null;
        endDate: Dayjs | null;
    }) => Promise<void>;
    /** Seed start when the modal opens. Null/omit leaves the field empty. */
    initialStartDate?: Dayjs | null;
    /** Seed end when the modal opens. Null/omit leaves the field empty. */
    initialEndDate?: Dayjs | null;
    className?: string;
}
declare function CreateTaskModal({ isOpen, onClose, areaId, onSubmit, initialStartDate, initialEndDate, className, }: CreateTaskModalProps): react_jsx_runtime.JSX.Element | null;

type CalendarViewMode = "day" | "week" | "month" | "year";
interface WeekDay {
    dayIndex: number;
    date: string;
}
/** Generic calendar event used by the library. */
interface CalendarEvent {
    id: string;
    title: string;
    start?: string | Dayjs | null;
    end?: string | Dayjs | null;
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
    start?: Dayjs | null;
    end?: Dayjs | null;
    resourceId?: string;
    color?: string;
    meta?: Record<string, unknown>;
}
/** Editable copy for unscheduled list and similar UI strings. */
interface CalendarLabels {
    /** Unscheduled list heading. Default: "Unscheduled events" */
    unscheduledTitle?: string;
    /** Hint under the unscheduled list. */
    unscheduledHint?: string;
}

/** Day of week: 0 = Sunday … 6 = Saturday */
type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;
/** Apply week start so dayjs `startOf("week")` / `endOf("week")` match. */
declare function applyWeekStartsOn(weekStartsOn: WeekStartsOn): void;
/** Weekday headers rotated so index 0 is `weekStartsOn`. */
declare function getWeekdayLabels(weekStartsOn?: WeekStartsOn): string[];
/** Empty cells before the first day of a partial week in a 7-column grid. */
declare function getLeadingEmptyCount(firstDay: Dayjs, weekStartsOn?: WeekStartsOn): number;
/**
 * Generates calendar weeks for a given year.
 * Weeks start on `weekStartsOn` and end on `(weekStartsOn + 6) % 7`.
 */
declare const generateCalendarWeeks: (year: number, weekStartsOn?: WeekStartsOn) => Dayjs[][];
/** Events that overlap a single calendar day. */
declare const getEventsForDay: (day: Dayjs, events: CalendarEvent[]) => CalendarEvent[];
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
 * @deprecated Use getEventsForYear with CalendarEvent[] (e.g. tasks.map(mapEventToTask))
 */
declare const getTasksForYear: (week: Dayjs[], tasks: Task[], year: number) => Task[];

/** Patch for a single event update (e.g. drag/resize). Use with onEventChange. */
type CalendarEventPatch = Partial<Pick<CalendarEvent, "start" | "end" | "title" | "resourceId" | "color" | "meta">>;

interface CalendarProps {
    /** Controlled events (scheduled on the calendar). When set, calendar uses this instead of internal state. */
    events?: CalendarEvent[];
    /** Notify when the full events list changes. Use with controlled `events`. */
    onEventsChange?: (events: CalendarEvent[]) => void;
    /** Notify when a single event is updated (e.g. drag/resize). Alternative to onEventsChange for granular updates. */
    onEventChange?: (event: CalendarEvent, patch: CalendarEventPatch) => void;
    /** Controlled visible date (focused day; week/month derive from this). */
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
    /** Content for the day/week "Today" nav button. Default: Today */
    todayButtonContent?: React.ReactNode;
    /** Class name for the day/week "Today" nav button. */
    todayButtonClassName?: string;
    /** Inline style for the day/week "Today" nav button. */
    todayButtonStyle?: React.CSSProperties;
    /** Editable copy for unscheduled list title/hint. */
    labels?: CalendarLabels;
    /**
     * First day of the week: 0 = Sunday … 6 = Saturday.
     * Default 0. Pass 1 for Monday-start (common in Europe).
     */
    weekStartsOn?: WeekStartsOn;
    /** Max event chips shown per day in month/year before "+N more". Default 3. */
    maxEventsPerDay?: number;
    /** Default event length in minutes for day slot-create and unscheduled drops. Default 60. */
    defaultDurationMinutes?: number;
    /** Workday start as HH:mm. Default "09:00". */
    workdayStart?: string;
    /** Workday end as HH:mm. Default "17:00". */
    workdayEnd?: string;
    /**
     * When false (default), day grid crops to workday ±1h.
     * When true, shows 00–24 and dims hours outside the workday.
     */
    showFullDay?: boolean;
    /** Root element class name. */
    className?: string;
    /** Root element inline style. */
    style?: React.CSSProperties;
    /** Class name for the view switcher (SegmentedControl container). */
    viewSwitcherClassName?: string;
    /** Class name for each view switcher option button. */
    viewSwitcherButtonClassName?: string;
}
declare function Calendar({ events, onEventsChange, onEventChange, date, onDateChange, view, onViewChange, defaultEvents, defaultScheduledEvents, defaultUnscheduledEvents, defaultDate, defaultView, showSwitcher, views, onEventMove, onEventResize, onEventCreate, onEventClick, onDateClick, readOnly, mapFromEvent, AddEventButton, CreateEventModal, EventActionButton, EventDetailModal, previousDayButtonContent, nextDayButtonContent, previousWeekButtonContent, nextWeekButtonContent, previousMonthButtonContent, nextMonthButtonContent, previousYearButtonContent, nextYearButtonContent, todayButtonContent, todayButtonClassName, todayButtonStyle, labels, weekStartsOn, maxEventsPerDay, defaultDurationMinutes, workdayStart, workdayEnd, showFullDay, className, style, viewSwitcherClassName, viewSwitcherButtonClassName, }: CalendarProps): react_jsx_runtime.JSX.Element;

interface DayViewProps {
    startDate: Dayjs;
    setStartDate: (date: Dayjs) => void;
    scheduledEvents: CalendarEvent[];
    unscheduledEvents: CalendarEvent[];
    setScheduledEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
    setUnscheduledEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
    onEventMove?: (payload: CalendarEventMovePayload) => Promise<void>;
    onEventResize?: (payload: CalendarEventResizePayload) => Promise<void>;
    onEventCreate?: (payload: CalendarEventCreatePayload) => Promise<void>;
    onEventClick?: (event: CalendarEvent) => Promise<void>;
    onDateClick?: (date: Dayjs, view: CalendarViewMode) => Promise<void>;
    readOnly?: boolean;
    updateTask?: (options?: {
        variables?: {
            data: Record<string, unknown>;
        };
        onError?: (error: Error) => void;
    }) => Promise<void>;
    mapFromEvent?: (event: CalendarEvent) => Task;
    AddEventButton?: React.ComponentType<{
        onClick: () => void;
    }>;
    CreateEventModal?: React.ComponentType<CreateTaskModalProps>;
    EventActionButton?: React.ComponentType<{
        event: CalendarEvent;
        onOpen: () => void;
    }>;
    EventDetailModal?: React.ComponentType<TaskModalProps>;
    previousDayButtonContent?: React.ReactNode;
    nextDayButtonContent?: React.ReactNode;
    /** Content for the "Today" nav button. Default: Today */
    todayButtonContent?: React.ReactNode;
    /** Class name for the "Today" nav button. */
    todayButtonClassName?: string;
    /** Inline style for the "Today" nav button. */
    todayButtonStyle?: React.CSSProperties;
    labels?: CalendarLabels;
    /** Default length for slot-create and unscheduled drops. Default 60. */
    defaultDurationMinutes?: number;
    /** Workday start HH:mm. Default "09:00". */
    workdayStart?: string;
    /** Workday end HH:mm. Default "17:00". */
    workdayEnd?: string;
    /** When true, show full 00–24 and dim outside work hours. Default false (crop). */
    showFullDay?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
declare function DayView({ startDate, setStartDate, scheduledEvents, unscheduledEvents, setScheduledEvents, setUnscheduledEvents, onEventMove, onEventCreate, onEventClick, onDateClick, readOnly, updateTask, mapFromEvent, AddEventButton, CreateEventModal, EventActionButton, EventDetailModal, previousDayButtonContent, nextDayButtonContent, todayButtonContent, todayButtonClassName, todayButtonStyle, labels, defaultDurationMinutes, workdayStart, workdayEnd, showFullDay, className, style, }: DayViewProps): react_jsx_runtime.JSX.Element;

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
    /** Content for the "Today" nav button. Default: Today */
    todayButtonContent?: React.ReactNode;
    /** Class name for the "Today" nav button. */
    todayButtonClassName?: string;
    /** Inline style for the "Today" nav button. */
    todayButtonStyle?: React.CSSProperties;
    /** Editable copy for unscheduled list title/hint. */
    labels?: CalendarLabels;
    className?: string;
    style?: React.CSSProperties;
}
declare function WeekView({ startDate, scheduledEvents, unscheduledEvents, setScheduledEvents, setUnscheduledEvents, setStartDate, onEventMove, onEventResize, onEventCreate, onEventClick, readOnly, updateTask, mapFromEvent, AddEventButton, CreateEventModal, EventActionButton, EventDetailModal, previousWeekButtonContent, nextWeekButtonContent, todayButtonContent, todayButtonClassName, todayButtonStyle, labels, className, style, }: WeekViewProps): react_jsx_runtime.JSX.Element;

interface MonthViewProps {
    events: CalendarEvent[];
    setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
    setStartDate: (date: Dayjs) => void;
    setZoomLevel: (zoom: CalendarViewMode) => void;
    onEventClick?: (event: CalendarEvent) => Promise<void>;
    onDateClick?: (date: Dayjs, view: CalendarViewMode) => Promise<void>;
    onEventCreate?: (payload: CalendarEventCreatePayload) => Promise<void>;
    readOnly?: boolean;
    updateTask?: (options?: {
        variables?: {
            data: Record<string, unknown>;
        };
        onError?: (error: Error) => void;
    }) => Promise<unknown>;
    mapFromEvent?: (event: CalendarEvent) => Task;
    AddEventButton?: React.ComponentType<{
        onClick: () => void;
    }>;
    CreateEventModal?: React.ComponentType<CreateTaskModalProps>;
    EventDetailModal?: React.ComponentType<TaskModalProps>;
    previousMonthButtonContent?: React.ReactNode;
    nextMonthButtonContent?: React.ReactNode;
    weekStartsOn?: WeekStartsOn;
    maxEventsPerDay?: number;
    className?: string;
    style?: React.CSSProperties;
}
declare function MonthView({ events, setEvents, setStartDate, setZoomLevel, onEventClick, onDateClick, onEventCreate, readOnly, updateTask, mapFromEvent, AddEventButton, CreateEventModal, EventDetailModal, previousMonthButtonContent, nextMonthButtonContent, weekStartsOn, maxEventsPerDay, className, style, }: MonthViewProps): react_jsx_runtime.JSX.Element;

interface YearViewProps {
    events: CalendarEvent[];
    setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
    setStartDate: (date: Dayjs) => void;
    setZoomLevel: (zoom: CalendarViewMode) => void;
    onEventClick?: (event: CalendarEvent) => Promise<void>;
    onDateClick?: (date: Dayjs, view: CalendarViewMode) => Promise<void>;
    onEventCreate?: (payload: CalendarEventCreatePayload) => Promise<void>;
    readOnly?: boolean;
    updateTask?: (options?: {
        variables?: {
            data: Record<string, unknown>;
        };
        onError?: (error: Error) => void;
    }) => Promise<unknown>;
    mapFromEvent?: (event: CalendarEvent) => Task;
    AddEventButton?: React.ComponentType<{
        onClick: () => void;
    }>;
    CreateEventModal?: React.ComponentType<CreateTaskModalProps>;
    EventDetailModal?: React.ComponentType<TaskModalProps>;
    previousYearButtonContent?: React.ReactNode;
    nextYearButtonContent?: React.ReactNode;
    weekStartsOn?: WeekStartsOn;
    maxEventsPerDay?: number;
    className?: string;
    style?: React.CSSProperties;
}
declare function YearView({ events, setEvents, setStartDate, setZoomLevel, onEventClick, onDateClick, onEventCreate, readOnly, updateTask, mapFromEvent, AddEventButton, CreateEventModal, EventDetailModal, previousYearButtonContent, nextYearButtonContent, weekStartsOn, maxEventsPerDay, className, style, }: YearViewProps): react_jsx_runtime.JSX.Element;

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
    mapFromEvent?: (event: CalendarEvent) => Task;
    EventDetailModal?: React.ComponentType<TaskModalProps>;
    weekStartsOn?: WeekStartsOn;
    maxEventsPerDay?: number;
}
declare function Week({ days, events, onSelectDate, currentMonth, isMonthView, view, readOnly, onEventClick, onDateClick, updateTask, mapFromEvent, EventDetailModal, weekStartsOn, maxEventsPerDay, }: WeekProps): react_jsx_runtime.JSX.Element;

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

/** Parse "HH:mm" (or "H:mm") into hour and minute. Invalid → null. */
declare function parseHHMM(value: string): {
    hour: number;
    minute: number;
} | null;
/** Minutes from midnight for an HH:mm string. */
declare function hhmmToMinutes(value: string, fallback: number): number;
/** Snap minutes to a grid (default 15). */
declare function snapMinutes(minutes: number, step?: number): number;
/**
 * Visible hour range for the day grid.
 * When showFullDay is false: workdayStart−1h … workdayEnd+1h (clamped 0–24).
 * Hours are integer start hours included; endHour is exclusive for row count.
 */
declare function getVisibleHourRange(workdayStart: string, workdayEnd: string, showFullDay: boolean): {
    startHour: number;
    endHour: number;
};
declare function formatHourLabel(hour: number): string;

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
    /** Content for the day/week "Today" nav button. Default: Today */
    todayButtonContent?: React.ReactNode;
    /** Class name for the day/week "Today" nav button. */
    todayButtonClassName?: string;
    /** Inline style for the day/week "Today" nav button. */
    todayButtonStyle?: React.CSSProperties;
    /** Class name for the view switcher (SegmentedControl container). */
    viewSwitcherClassName?: string;
    /** Class name for each view switcher option button. */
    viewSwitcherButtonClassName?: string;
}
declare function CalendarContainer({ showSwitcher, showTabs, views, areas, defaultScheduledEvents, defaultUnscheduledEvents, onEventMove, onEventResize, onEventCreate, onEventClick, onDateClick, readOnly, mapFromEvent, AddEventButton, CreateEventModal, EventActionButton, EventDetailModal, previousDayButtonContent, nextDayButtonContent, previousWeekButtonContent, nextWeekButtonContent, previousMonthButtonContent, nextMonthButtonContent, previousYearButtonContent, nextYearButtonContent, todayButtonContent, todayButtonClassName, todayButtonStyle, viewSwitcherClassName, viewSwitcherButtonClassName, }: CalendarContainerProps): react_jsx_runtime.JSX.Element;

export { type Area, Calendar, CalendarContainer, type CalendarContainerProps, type CalendarEvent, type CalendarEventCreatePayload, type CalendarEventMovePayload, type CalendarEventPatch, type CalendarEventResizePayload, type CalendarLabels, type CalendarProps, type CalendarViewMode, CreateTaskModal, type CreateTaskModalProps, DEFAULT_TASK_COLOR, DayView, type DayViewProps, MonthView, type MonthViewProps, ProgressStatus, type Task, TaskModal, type TaskModalProps, UserRole, Week, type WeekDay, type WeekProps, type WeekStartsOn, WeekView, type WeekViewProps, YearView, type YearViewProps, applyWeekStartsOn, formatHourLabel, generateCalendarWeeks, getEventsForDay, getEventsForWeek, getEventsForYear, getLeadingEmptyCount, getTaskColorHex, getTasksForWeek, getTasksForYear, getVisibleHourRange, getWeekdayLabels, hhmmToMinutes, mapEventToTask, mapTaskToEvent, parseHHMM, snapMinutes };
