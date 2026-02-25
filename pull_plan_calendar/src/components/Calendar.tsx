"use client";

import { SegmentedControl } from "./ui/SegmentedControl";
import type {
  CalendarViewMode,
  CalendarEvent,
  CalendarEventMovePayload,
  CalendarEventResizePayload,
  CalendarEventCreatePayload,
} from "../types/calendar";
import type { Task } from "../types/task";
import { DndContext } from "@dnd-kit/core";
import dayjs, { type Dayjs } from "dayjs";

/** Patch for a single event update (e.g. drag/resize). Use with onEventChange. */
export type CalendarEventPatch = Partial<
  Pick<
    CalendarEvent,
    "start" | "end" | "title" | "resourceId" | "color" | "meta"
  >
>;

export interface CalendarProps {
  // --- Controlled mode ---
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

  // --- Uncontrolled mode ---
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

  // --- Other ---
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
  AddEventButton?: React.ComponentType<{ onClick: () => void }>;
  /** Custom create-event modal for day view. If not set, default CreateTaskModal is used. */
  CreateEventModal?: React.ComponentType<
    import("./tasks/CreateTaskModal").CreateTaskModalProps
  >;
  /** Custom button to open event details (day view). Receives event and onOpen. */
  EventActionButton?: React.ComponentType<{
    event: CalendarEvent;
    onOpen: () => void;
  }>;
  /** Custom modal for viewing event details (day view). If not set, default TaskModal is used. */
  EventDetailModal?: React.ComponentType<
    import("./tasks/TaskModal").TaskModalProps
  >;
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

import { useState } from "react";
import { useCalendarDragEnd } from "../hooks/useCalendarDragEnd";
import { useCalendarViews, ALL_VIEWS } from "../hooks/useCalendarViews";
import DayView from "./DayView";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import YearView from "./YearView";

const VIEW_LABELS: Record<CalendarViewMode, string> = {
  day: "Daily",
  week: "Weekly",
  month: "Monthly",
  year: "Yearly",
};

export default function Calendar({
  events,
  onEventsChange,
  onEventChange,
  date,
  onDateChange,
  view,
  onViewChange,
  defaultEvents,
  defaultScheduledEvents,
  defaultUnscheduledEvents,
  defaultDate,
  defaultView,
  showSwitcher = true,
  views = ALL_VIEWS,
  onEventMove,
  onEventResize,
  onEventCreate,
  onEventClick,
  onDateClick,
  readOnly = false,
  mapFromEvent,
  AddEventButton,
  CreateEventModal,
  EventActionButton,
  EventDetailModal,
  previousDayButtonContent,
  nextDayButtonContent,
  previousWeekButtonContent,
  nextWeekButtonContent,
  previousMonthButtonContent,
  nextMonthButtonContent,
  previousYearButtonContent,
  nextYearButtonContent,
  className,
  style,
  viewSwitcherClassName,
  viewSwitcherButtonClassName,
}: CalendarProps) {
  const { orderedViews, setZoomLevel, effectiveZoom } = useCalendarViews(views);

  const [scheduledEvents, setScheduledEvents] = useState<CalendarEvent[]>(
    () => defaultScheduledEvents ?? defaultEvents ?? [],
  );
  const [unscheduledEvents, setUnscheduledEvents] = useState<CalendarEvent[]>(
    () => defaultUnscheduledEvents ?? [],
  );
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf("week"));

  const handleDragEnd = useCalendarDragEnd(
    startDate,
    scheduledEvents,
    unscheduledEvents,
    setScheduledEvents,
    setUnscheduledEvents,
    onEventMove,
    effectiveZoom,
  );

  const zoomLevelView = {
    day: (
      <DayView
        startDate={startDate.startOf("day")}
        setStartDate={setStartDate}
        scheduledEvents={scheduledEvents}
        unscheduledEvents={unscheduledEvents}
        setScheduledEvents={setScheduledEvents}
        setUnscheduledEvents={setUnscheduledEvents}
        onEventMove={onEventMove}
        onEventResize={onEventResize}
        onEventCreate={onEventCreate}
        onEventClick={onEventClick}
        onDateClick={onDateClick}
        readOnly={readOnly}
        mapFromEvent={mapFromEvent}
        AddEventButton={AddEventButton}
        CreateEventModal={CreateEventModal}
        EventActionButton={EventActionButton}
        EventDetailModal={EventDetailModal}
        previousDayButtonContent={previousDayButtonContent}
        nextDayButtonContent={nextDayButtonContent}
      />
    ),
    week: (
      <WeekView
        startDate={startDate}
        setStartDate={setStartDate}
        scheduledEvents={scheduledEvents}
        unscheduledEvents={unscheduledEvents}
        setScheduledEvents={setScheduledEvents}
        setUnscheduledEvents={setUnscheduledEvents}
        onEventMove={onEventMove}
        onEventResize={onEventResize}
        onEventCreate={onEventCreate}
        onEventClick={onEventClick}
        onDateClick={onDateClick}
        readOnly={readOnly}
        mapFromEvent={mapFromEvent}
        AddEventButton={AddEventButton}
        CreateEventModal={CreateEventModal}
        EventActionButton={EventActionButton}
        EventDetailModal={EventDetailModal}
        previousWeekButtonContent={previousWeekButtonContent}
        nextWeekButtonContent={nextWeekButtonContent}
      />
    ),
    month: (
      <MonthView
        setStartDate={setStartDate}
        events={scheduledEvents}
        setEvents={setScheduledEvents}
        setZoomLevel={setZoomLevel}
        onEventClick={onEventClick}
        onDateClick={onDateClick}
        readOnly={readOnly}
        mapFromEvent={mapFromEvent}
        AddEventButton={AddEventButton}
        CreateEventModal={CreateEventModal}
        previousMonthButtonContent={previousMonthButtonContent}
        nextMonthButtonContent={nextMonthButtonContent}
      />
    ),
    year: (
      <YearView
        setStartDate={setStartDate}
        events={scheduledEvents}
        setEvents={setScheduledEvents}
        setZoomLevel={setZoomLevel}
        onEventClick={onEventClick}
        onDateClick={onDateClick}
        readOnly={readOnly}
        mapFromEvent={mapFromEvent}
        AddEventButton={AddEventButton}
        CreateEventModal={CreateEventModal}
        previousYearButtonContent={previousYearButtonContent}
        nextYearButtonContent={nextYearButtonContent}
      />
    ),
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div data-slot="calendar-root" className={className} style={style}>
        {showSwitcher && orderedViews.length > 0 && (
          <div data-slot="calendar-view-switcher">
            <SegmentedControl
              value={effectiveZoom}
              options={orderedViews.map((v) => ({
                label: VIEW_LABELS[v],
                value: v,
              }))}
              onChange={(value) => setZoomLevel(value)}
              className={viewSwitcherClassName}
              buttonClassName={viewSwitcherButtonClassName}
            />
          </div>
        )}

        <div data-slot="calendar-content" data-view={effectiveZoom}>
          {zoomLevelView[effectiveZoom]}
        </div>
      </div>
    </DndContext>
  );
}
