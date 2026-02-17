"use client";

import { Button } from "./ui/Button";
import { Title } from "./ui/Title";
import { Tooltip } from "./ui/Tooltip";
import type { CalendarEvent, CalendarViewMode } from "../types/calendar";
import type { CalendarEventMovePayload, CalendarEventResizePayload, CalendarEventCreatePayload } from "../types/calendar";
import type { Task } from "../types/task";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { CreateTaskModal } from "./tasks/CreateTaskModal";
import { TaskModal } from "./tasks/TaskModal";

export interface DayViewProps {
  startDate: dayjs.Dayjs;
  setStartDate: (date: dayjs.Dayjs) => void;
  scheduledEvents: CalendarEvent[];
  unscheduledEvents: CalendarEvent[];
  setScheduledEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  setUnscheduledEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  view: CalendarViewMode;
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
  view,
  onEventMove,
  onEventResize,
  onEventCreate,
  onEventClick,
  onDateClick,
  readOnly = false,
  updateTask = async () => {},
  mapFromEvent,
  className,
  style,
}: DayViewProps) {
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const openTask = () => setIsTaskOpen(true);
  const closeTask = () => {
    setIsTaskOpen(false);
    setSelectedEvent(null);
  };
  const openCreateTask = async () => {
    if (onDateClick) {
      try {
        await onDateClick(startDate, view);
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

  const eventsForDay = useMemo(() => {
    const dayStart = startDate.startOf("day");
    const dayEnd = startDate.endOf("day");
    return scheduledEvents.filter((event) => {
      const eventStart = dayjs(event.start).startOf("day");
      const eventEnd = dayjs(event.end).endOf("day");
      return (
        (eventStart.isSame(dayStart) || eventStart.isBefore(dayEnd)) &&
        (eventEnd.isSame(dayEnd) || eventEnd.isAfter(dayStart))
      );
    });
  }, [scheduledEvents, startDate]);

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
              view,
            });
          } catch {
            setScheduledEvents(prevScheduled);
            setUnscheduledEvents(prevUnscheduled);
          }
        })();
      }
    },
    [startDate, scheduledEvents, setScheduledEvents, setUnscheduledEvents, onEventMove, view],
  );

  const handleCreateSubmit = useCallback(
    async (data: { name: string; startDate: dayjs.Dayjs; endDate: dayjs.Dayjs }) => {
      const id = `event-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const newEvent: CalendarEvent = {
        id,
        title: data.name,
        start: data.startDate,
        end: data.endDate,
      };
      const prevScheduled = [...scheduledEvents];
      setScheduledEvents((prev) => [...prev, newEvent]);
      closeCreateTask();
      if (onEventCreate) {
        try {
          await onEventCreate({
            id: newEvent.id,
            title: newEvent.title,
            start: dayjs(newEvent.start),
            end: dayjs(newEvent.end),
          });
        } catch {
          setScheduledEvents(prevScheduled);
        }
      }
    },
    [scheduledEvents, setScheduledEvents, onEventCreate],
  );

  return (
    <div data-slot="day-view" className={className} style={style}>
      <div data-slot="day-view-nav">
        <Button type="button" onClick={handlePreviousDay} aria-label="Previous day">←</Button>
        <Title level={4}>{dayTitle}</Title>
        <Button type="button" onClick={handleNextDay} aria-label="Next day">→</Button>
      </div>

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
            {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
          </div>
        ))}
        <div
          data-slot="day-events"
          style={{ gridColumn: 2, gridRow: "1 / -1", minHeight: 24 * HOUR_ROW_HEIGHT }}
        >
          {eventsForDay.length === 0 ? (
            <p data-slot="day-no-events">No events scheduled</p>
          ) : (
            eventsForDay.map((event) => (
              <div
                key={event.id}
                data-slot="event"
                data-event-id={event.id}
                data-color={event.color ?? undefined}
              >
                <span>{event.title}</span>
                <Button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleOpenEvent(event);
                  }}
                  aria-label={`View ${event.title}`}
                >
                  View
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      <div data-slot="unscheduled-list">
        <h3 data-slot="unscheduled-title">Unscheduled events</h3>
        {!readOnly && (
          <Tooltip title="Add new event">
            <Button type="button" onClick={openCreateTask} aria-label="Add event">+</Button>
          </Tooltip>
        )}
        <CreateTaskModal
          isOpen={isCreateTaskOpen}
          onClose={closeCreateTask}
          onSubmit={handleCreateSubmit}
        />
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
          <p data-slot="unscheduled-hint">Drag an event onto the day above to schedule it, or double-click to view.</p>
        )}
      </div>

      {selectedEvent && mapFromEvent && (
        <TaskModal
          task={mapFromEvent(selectedEvent)}
          isOpen={isTaskOpen}
          onClose={closeTask}
          updateTask={updateTask}
        />
      )}
    </div>
  );
}
