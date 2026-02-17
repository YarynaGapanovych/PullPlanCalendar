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
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import dayjs, { type Dayjs } from "dayjs";

/** Patch for a single event update (e.g. drag/resize). Use with onEventChange. */
export type CalendarEventPatch = Partial<Pick<CalendarEvent, "start" | "end" | "title" | "resourceId" | "color" | "meta">>;

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
  /** Initial visible date when using uncontrolled mode. */
  defaultDate?: Dayjs;
  /** Initial view mode when using uncontrolled mode. */
  defaultView?: CalendarViewMode;

  // --- Other ---
  showSwitcher?: boolean;
  views?: CalendarViewMode[];
  /** @deprecated Use defaultEvents or controlled events. Initial scheduled events (uncontrolled). */
  initialScheduledEvents?: CalendarEvent[];
  /** @deprecated Use defaultEvents or controlled events. Initial unscheduled events (uncontrolled). */
  initialUnscheduledEvents?: CalendarEvent[];
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
  /** Root element class name. */
  className?: string;
  /** Root element inline style. */
  style?: React.CSSProperties;
}

import { useState } from "react";
import DayView from "./DayView";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import YearView from "./YearView";

const ALL_VIEWS: CalendarViewMode[] = ["day", "week", "month", "year"];

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
  defaultDate,
  defaultView,
  showSwitcher = true,
  views = ALL_VIEWS,
  initialScheduledEvents = [],
  initialUnscheduledEvents = [],
  onEventMove,
  onEventResize,
  onEventCreate,
  onEventClick,
  onDateClick,
  readOnly = false,
  mapFromEvent,
  className,
  style,
}: CalendarProps) {
  const [zoomLevel, setZoomLevel] = useState<CalendarViewMode>(() =>
    views.length > 0 ? views[0] : "week",
  );
  const effectiveZoom = views.includes(zoomLevel)
    ? zoomLevel
    : (views[0] ?? "week");

  const [scheduledEvents, setScheduledEvents] = useState<CalendarEvent[]>(
    initialScheduledEvents,
  );
  const [unscheduledEvents, setUnscheduledEvents] = useState<CalendarEvent[]>(
    initialUnscheduledEvents,
  );
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf("week"));

  const getWeekDaysWithDates = () => {
    return Array.from({ length: 7 }).map((_, index) => {
      const date = startDate.clone().add(index, "days");
      return { dayIndex: index, date: date.format("YYYY-MM-DD") };
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const draggedEvent = scheduledEvents.find((ev) => ev.id === active.id);
    if (!draggedEvent) return;

    const dropDateIndex = over.data.current?.index;
    if (dropDateIndex === undefined) return;

    const oldStart = dayjs(draggedEvent.start);
    const oldEnd = dayjs(draggedEvent.end);
    const newStart = startDate.clone().add(dropDateIndex, "days");
    const newEnd = newStart.clone().add(1, "days");

    const prevScheduled = [...scheduledEvents];
    const prevUnscheduled = [...unscheduledEvents];

    setScheduledEvents((prev) => [
      ...prev.filter((ev) => ev.id !== draggedEvent.id),
      {
        ...draggedEvent,
        start: dayjs(newStart.format("YYYY-MM-DD")),
        end: dayjs(newEnd.format("YYYY-MM-DD")),
      },
    ]);
    setUnscheduledEvents((prev) => prev.filter((ev) => ev.id !== draggedEvent.id));

    try {
      if (onEventMove) {
        await onEventMove({
          id: draggedEvent.id,
          start: newStart,
          end: newEnd,
          oldStart,
          oldEnd,
          view: effectiveZoom,
        });
      }
    } catch {
      setScheduledEvents(prevScheduled);
      setUnscheduledEvents(prevUnscheduled);
    }
  };

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
        view="day"
        readOnly={readOnly}
        mapFromEvent={mapFromEvent}
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
        getWeekDaysWithDates={getWeekDaysWithDates}
        onEventMove={onEventMove}
        onEventResize={onEventResize}
        onEventCreate={onEventCreate}
        onEventClick={onEventClick}
        onDateClick={onDateClick}
        view="week"
        readOnly={readOnly}
        mapFromEvent={mapFromEvent}
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
        view="month"
        readOnly={readOnly}
        mapFromEvent={mapFromEvent}
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
        view="year"
        readOnly={readOnly}
        mapFromEvent={mapFromEvent}
      />
    ),
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div data-slot="calendar-root" className={className} style={style}>
        {showSwitcher && views.length > 0 && (
          <div data-slot="calendar-view-switcher">
            <SegmentedControl
              value={effectiveZoom}
              options={views.map((v) => ({ label: VIEW_LABELS[v], value: v }))}
              onChange={(value) => setZoomLevel(value)}
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
