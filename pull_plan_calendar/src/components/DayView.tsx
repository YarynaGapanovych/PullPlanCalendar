"use client";

import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCreateEventSubmit } from "../hooks/useCreateEventSubmit";
import type {
  CalendarEvent,
  CalendarEventCreatePayload,
  CalendarEventMovePayload,
  CalendarEventResizePayload,
  CalendarViewMode,
} from "../types/calendar";
import type { Task } from "../types/task";
import type { CreateTaskModalProps } from "./tasks/CreateTaskModal";
import { CreateTaskModal } from "./tasks/CreateTaskModal";
import type { TaskModalProps } from "./tasks/TaskModal";
import { TaskModal } from "./tasks/TaskModal";
import { EventActionButtonSlot } from "./EventActionButtonSlot";
import { Button } from "./ui/Button";
import { Title } from "./ui/Title";
import { Tooltip } from "./ui/Tooltip";

const MIN_EVENT_HEIGHT_PX = 24;

function isFullDayEvent(
  event: CalendarEvent,
  dayStart: dayjs.Dayjs,
  dayEnd: dayjs.Dayjs,
): boolean {
  const start = dayjs(event.start);
  const end = dayjs(event.end);
  return (
    (start.isBefore(dayStart) || start.isSame(dayStart)) &&
    (end.isAfter(dayEnd) || end.isSame(dayEnd))
  );
}

function getEventDayPosition(
  event: CalendarEvent,
  dayStart: dayjs.Dayjs,
  dayEnd: dayjs.Dayjs,
  hourRowHeight: number,
): { topPx: number; heightPx: number } | null {
  const start = dayjs(event.start);
  const end = dayjs(event.end);
  const visualStart = start.isBefore(dayStart) ? dayStart : start;
  const visualEnd = end.isAfter(dayEnd) ? dayEnd : end;
  if (!visualStart.isBefore(visualEnd) && !visualStart.isSame(visualEnd))
    return null;
  const topPx = visualStart.diff(dayStart, "minute") * (hourRowHeight / 60);
  const heightPx = Math.max(
    MIN_EVENT_HEIGHT_PX,
    visualEnd.diff(visualStart, "minute") * (hourRowHeight / 60),
  );
  return { topPx, heightPx };
}

export interface DayViewProps {
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
    variables?: { data: Record<string, unknown> };
    onError?: (error: Error) => void;
  }) => Promise<void>;
  /** Optional: map event → task to show TaskModal (e.g. mapEventToTask). */
  mapFromEvent?: (event: CalendarEvent) => Task;
  /** Custom "add event" button; receives onClick. If not set, default "+" button is used. */
  AddEventButton?: React.ComponentType<{ onClick: () => void }>;
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

export default function DayView({
  startDate,
  setStartDate,
  scheduledEvents,
  unscheduledEvents,
  setScheduledEvents,
  setUnscheduledEvents,
  onEventMove,
  onEventResize,
  onEventCreate,
  onEventClick,
  onDateClick,
  readOnly = false,
  updateTask = async () => {},
  mapFromEvent,
  AddEventButton,
  CreateEventModal,
  EventActionButton,
  EventDetailModal,
  previousDayButtonContent = "←",
  nextDayButtonContent = "→",
  className,
  style,
}: DayViewProps) {
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  const openTask = () => setIsTaskOpen(true);
  const closeTask = () => {
    setIsTaskOpen(false);
    setSelectedEvent(null);
  };
  const openCreateTask = async () => {
    if (onDateClick) {
      try {
        await onDateClick(startDate, "day");
      } catch {
        return;
      }
    }
    setIsCreateTaskOpen(true);
  };
  const closeCreateTask = () => setIsCreateTaskOpen(false);

  const dayTitle = useMemo(
    () => startDate.format("dddd, MMM D, YYYY"),
    [startDate],
  );

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const HOUR_ROW_HEIGHT = 48;
  const dayStart = useMemo(() => startDate.startOf("day"), [startDate]);
  const dayEnd = useMemo(() => startDate.endOf("day"), [startDate]);

  const [now, setNow] = useState(() => dayjs());
  const isViewingToday = startDate.isSame(now, "day");
  useEffect(() => {
    if (!isViewingToday) return;
    const t = setInterval(() => setNow(dayjs()), 60_000);
    return () => clearInterval(t);
  }, [isViewingToday]);

  const eventsForDay = useMemo(() => {
    return scheduledEvents.filter((event) => {
      const eventStart = dayjs(event.start);
      const eventEnd = dayjs(event.end);
      return (
        (eventStart.isSame(dayStart) || eventStart.isBefore(dayEnd)) &&
        (eventEnd.isSame(dayEnd) || eventEnd.isAfter(dayStart))
      );
    });
  }, [scheduledEvents, dayStart, dayEnd]);

  const { fullDayEvents, timedEvents } = useMemo(() => {
    const full: CalendarEvent[] = [];
    const timed: CalendarEvent[] = [];
    for (const event of eventsForDay) {
      if (isFullDayEvent(event, dayStart, dayEnd)) full.push(event);
      else timed.push(event);
    }
    return { fullDayEvents: full, timedEvents: timed };
  }, [eventsForDay, dayStart, dayEnd]);

  const handleOpenEvent = async (event: CalendarEvent) => {
    if (onEventClick) {
      try {
        await onEventClick(event);
      } catch {
        return;
      }
    }
    setSelectedEvent(event);
    openTask();
  };

  const handlePreviousDay = () => {
    setStartDate(startDate.subtract(1, "day"));
  };

  const handleNextDay = () => {
    setStartDate(startDate.add(1, "day"));
  };

  const handleUnassignedEventDrop = useCallback(
    (event: CalendarEvent) => {
      const oldStart = dayjs(event.start);
      const oldEnd = dayjs(event.end);
      const newStart = startDate.startOf("day");
      const newEnd = startDate.add(1, "days").startOf("day");
      const updatedEvent: CalendarEvent = {
        ...event,
        start: newStart,
        end: newEnd,
      };
      const prevScheduled = [...scheduledEvents];
      const prevUnscheduled = [...unscheduledEvents];
      setScheduledEvents((prev) => [...prev, updatedEvent]);
      setUnscheduledEvents((prev) => prev.filter((ev) => ev.id !== event.id));
      if (onEventMove) {
        (async () => {
          try {
            await onEventMove({
              id: event.id,
              start: newStart,
              end: newEnd,
              oldStart,
              oldEnd,
              view: "day",
            });
          } catch {
            setScheduledEvents(prevScheduled);
            setUnscheduledEvents(prevUnscheduled);
          }
        })();
      }
    },
    [
      startDate,
      scheduledEvents,
      unscheduledEvents,
      setScheduledEvents,
      setUnscheduledEvents,
      onEventMove,
    ],
  );

  const handleCreateSubmit = useCreateEventSubmit(
    scheduledEvents,
    setScheduledEvents,
    onEventCreate,
    closeCreateTask,
  );

  return (
    <div data-slot="day-view" className={className} style={style}>
      <div data-slot="day-view-nav">
        <Button
          type="button"
          onClick={handlePreviousDay}
          aria-label="Previous day"
        >
          {previousDayButtonContent}
        </Button>
        <Title level={4}>{dayTitle}</Title>
        <Button type="button" onClick={handleNextDay} aria-label="Next day">
          {nextDayButtonContent}
        </Button>
      </div>

      {fullDayEvents.length > 0 && (
        <div data-slot="day-multiday">
          <h3 data-slot="day-multiday-title">All-day / multi-day</h3>
          <div data-slot="day-multiday-items">
            {fullDayEvents.map((event) => (
              <div
                key={event.id}
                data-slot="event"
                data-event-id={event.id}
                data-allday
                data-color={event.color ?? undefined}
              >
                <span>{event.title}</span>
                <EventActionButtonSlot
                  event={event}
                  onOpen={() => handleOpenEvent(event)}
                  EventActionButton={EventActionButton}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        data-slot="day-view-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "4rem 1fr",
          gridTemplateRows: `repeat(24, ${HOUR_ROW_HEIGHT}px)`,
        }}
      >
        {hours.map((hour) => (
          <div
            key={hour}
            data-slot="day-hour"
            data-hour={hour}
            style={{ gridRow: hour + 1, minHeight: HOUR_ROW_HEIGHT }}
          >
            {hour === 0
              ? "12 AM"
              : hour < 12
                ? `${hour} AM`
                : hour === 12
                  ? "12 PM"
                  : `${hour - 12} PM`}
          </div>
        ))}
        <div
          data-slot="day-events"
          style={{
            gridColumn: 2,
            gridRow: "1 / -1",
            minHeight: 24 * HOUR_ROW_HEIGHT,
            position: "relative",
            borderLeft: "1px solid #f3f4f6",
          }}
        >
          {isViewingToday && (
            <div
              data-slot="day-now-line"
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: now.diff(dayStart, "minute") * (HOUR_ROW_HEIGHT / 60),
                height: 0,
                borderTop: "2px solid var(--now-line-color, #dc2626)",
                pointerEvents: "none",
                zIndex: 2,
              }}
            />
          )}
          {timedEvents.length === 0 ? (
            <p
              data-slot="day-no-events"
              style={{
                position: "absolute",
                top: "1rem",
                left: "1rem",
                right: "1rem",
                textAlign: "center",
                margin: 0,
              }}
            >
              No events scheduled
            </p>
          ) : (
            timedEvents.map((event) => {
              const pos = getEventDayPosition(
                event,
                dayStart,
                dayEnd,
                HOUR_ROW_HEIGHT,
              );
              if (!pos) return null;
              return (
                <div
                  key={event.id}
                  data-slot="event"
                  data-event-id={event.id}
                  data-color={event.color ?? undefined}
                  style={{
                    position: "absolute",
                    left: 4,
                    right: 4,
                    top: pos.topPx,
                    height: pos.heightPx,
                    boxSizing: "border-box",
                    padding: "2px 6px",
                    overflow: "hidden",
                  }}
                >
                  <span>{event.title}</span>
                  <EventActionButtonSlot
                    event={event}
                    onOpen={() => handleOpenEvent(event)}
                    EventActionButton={EventActionButton}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      <div data-slot="unscheduled-list">
        <h3 data-slot="unscheduled-title">Unscheduled events</h3>
        {!readOnly &&
          (AddEventButton ? (
            <AddEventButton onClick={openCreateTask} />
          ) : (
            <Tooltip title="Add new event">
              <Button
                type="button"
                onClick={openCreateTask}
                aria-label="Add event"
              >
                +
              </Button>
            </Tooltip>
          ))}
        {CreateEventModal ? (
          <CreateEventModal
            isOpen={isCreateTaskOpen}
            onClose={closeCreateTask}
            onSubmit={handleCreateSubmit}
          />
        ) : (
          <CreateTaskModal
            isOpen={isCreateTaskOpen}
            onClose={closeCreateTask}
            onSubmit={handleCreateSubmit}
          />
        )}
        <div data-slot="unscheduled-items">
          {unscheduledEvents.map((event) => (
            <div
              key={event.id}
              data-slot="unscheduled-event"
              data-event-id={event.id}
              data-color={event.color ?? undefined}
              draggable={!readOnly}
              onDragEnd={() => {
                if (!readOnly) handleUnassignedEventDrop(event);
              }}
              onDoubleClick={() => handleOpenEvent(event)}
            >
              {event.title}
            </div>
          ))}
        </div>
        {unscheduledEvents.length > 0 && !readOnly && (
          <p data-slot="unscheduled-hint">
            Drag an event onto the day above to schedule it, or double-click to
            view.
          </p>
        )}
      </div>

      {selectedEvent &&
        (EventDetailModal ? (
          <EventDetailModal
            task={
              mapFromEvent
                ? mapFromEvent(selectedEvent)
                : {
                    id: selectedEvent.id,
                    name: selectedEvent.title,
                    startDate: selectedEvent.start,
                    endDate: selectedEvent.end,
                    employees: [],
                  }
            }
            isOpen={isTaskOpen}
            onClose={closeTask}
            updateTask={updateTask}
          />
        ) : mapFromEvent ? (
          <TaskModal
            task={mapFromEvent(selectedEvent)}
            isOpen={isTaskOpen}
            onClose={closeTask}
            updateTask={updateTask}
          />
        ) : null)}
    </div>
  );
}
