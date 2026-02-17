"use client";

import { Button } from "./ui/Button";
import { Title } from "./ui/Title";
import { Tooltip } from "./ui/Tooltip";
import type { CalendarEvent, CalendarViewMode } from "../types/calendar";
import type { CalendarEventMovePayload, CalendarEventResizePayload, CalendarEventCreatePayload } from "../types/calendar";
import type { Task } from "../types/task";
import dayjs from "dayjs";
import { useCallback, useMemo, useRef, useState } from "react";
import { Responsive } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { CreateTaskModal } from "./tasks/CreateTaskModal";
import { TaskModal } from "./tasks/TaskModal";

export interface WeekViewProps {
  startDate: dayjs.Dayjs;
  setStartDate: (date: dayjs.Dayjs) => void;
  scheduledEvents: CalendarEvent[];
  unscheduledEvents: CalendarEvent[];
  setScheduledEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  setUnscheduledEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  getWeekDaysWithDates: () => { dayIndex: number; date: string }[];
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

export default function WeekView({
  startDate,
  scheduledEvents,
  unscheduledEvents,
  setScheduledEvents,
  setUnscheduledEvents,
  getWeekDaysWithDates,
  setStartDate,
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
}: WeekViewProps) {
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const getEventGridData = useCallback(
    (event: CalendarEvent) => {
      const eventStart = dayjs(event.start);
      const eventEnd = dayjs(event.end);
      const weekStart = startDate;
      const weekEnd = startDate.add(6, "days");
      const actualStart = eventStart.isBefore(weekStart) ? weekStart : eventStart;
      const actualEnd = eventEnd.isAfter(weekEnd) ? weekEnd : eventEnd;
      const startColumn = actualStart.diff(weekStart, "days");
      const eventSpan = actualEnd.diff(actualStart, "days") + 1;

      if (eventSpan <= 0) return null;

      return {
        i: `event-${event.id}`,
        x: startColumn,
        y: 1,
        w: Math.min(eventSpan, 7 - startColumn),
        h: 1,
      };
    },
    [startDate],
  );

  const eventLayouts = useMemo(() => {
    return scheduledEvents
      .map(getEventGridData)
      .filter(
        (gridData): gridData is Exclude<typeof gridData, null> =>
          gridData !== null,
      );
  }, [scheduledEvents, startDate, getEventGridData]);

  const layouts = useMemo(() => {
    return {
      lg: [
        ...getWeekDaysWithDates().map(({ dayIndex }) => ({
          i: `day-${dayIndex}`,
          x: dayIndex,
          y: 0,
          w: 1,
          h: 1,
          static: true,
        })),
        ...eventLayouts,
      ],
    };
  }, [eventLayouts, getWeekDaysWithDates]);

  const weekTitle = useMemo(() => {
    const endDate = startDate.add(6, "days");
    return `${startDate.format("MMM D")} - ${endDate.format("MMM D, YYYY")}`;
  }, [startDate]);

  const handlePreviousWeek = () => {
    const newDate = startDate.subtract(1, "week");
    setStartDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = startDate.add(1, "week");
    setStartDate(newDate);
  };

  const handleDrag = useCallback(
    (
      _layout: ReadonlyArray<unknown>,
      _oldItem: unknown,
      newItem: { x?: number } | null,
      _placeholder: unknown,
      _e: unknown,
      element: HTMLElement | undefined,
    ) => {
      if (!newItem || !element || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const taskRect = element.getBoundingClientRect();
      const leftEdge = containerRect.left;
      const rightEdge = containerRect.right;
      if (taskRect.left < leftEdge) {
        newItem.x = 6;
      }
      if (taskRect.right > rightEdge) {
        newItem.x = 0;
      }
    },
    [],
  );

  const handleDragStop = useCallback(
    (
      layout: ReadonlyArray<{ i: string; x: number; w: number }>,
      _oldItem: unknown,
      newItem: { i: string; x: number } | null,
      _placeholder: unknown,
      _e: unknown,
      element: HTMLElement | undefined,
    ) => {
      if (!newItem || !element) return;
      const event = scheduledEvents.find((ev) => `event-${ev.id}` === newItem.i);
      if (!event) return;

      let newStart = startDate.clone().add(newItem.x, "days");
      const originalDuration = dayjs(event.end).diff(dayjs(event.start), "days");
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const elRect = element.getBoundingClientRect();
        const leftEdge = containerRect.left;
        const rightEdge = containerRect.right;
        if (elRect.left < leftEdge) {
          newStart = newStart.subtract(originalDuration + 1, "days");
          handlePreviousWeek();
        }
        if (elRect.right > rightEdge) {
          newStart = newStart.add(originalDuration + 1, "days");
          handleNextWeek();
        }
      }
      const newEnd = newStart.add(originalDuration, "days");
      const oldStart = dayjs(event.start);
      const oldEnd = dayjs(event.end);
      if (oldStart.isSame(newStart, "day") && oldEnd.isSame(newEnd, "day")) return;

      const updatedEvent: CalendarEvent = { ...event, start: newStart, end: newEnd };
      const prevScheduled = [...scheduledEvents];
      const prevUnscheduled = [...unscheduledEvents];
      const newScheduled = prevScheduled.map((ev) => (ev.id === event.id ? updatedEvent : ev));
      setScheduledEvents(newScheduled);
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

  const handleResizeStop = useCallback(
    (layout: ReadonlyArray<{ i: string; x: number; w: number }>) => {
      const event = scheduledEvents.find((ev) => {
        const layoutItem = layout.find((item) => item.i === `event-${ev.id}`);
        return layoutItem != null;
      });
      if (!event) return;
      const layoutItem = layout.find((item) => item.i === `event-${event.id}`);
      if (!layoutItem) return;
      const oldStart = dayjs(event.start);
      const oldEnd = dayjs(event.end);
      const newStart = startDate.clone().add(layoutItem.x, "days");
      const newEnd = startDate.clone().add(layoutItem.x + layoutItem.w - 1, "days");
      const updatedEvent: CalendarEvent = { ...event, start: newStart, end: newEnd };
      const prevScheduled = [...scheduledEvents];
      setScheduledEvents((prev) =>
        prev.map((ev) => (ev.id === event.id ? updatedEvent : ev)),
      );
      if (onEventResize) {
        (async () => {
          try {
            await onEventResize({
              id: event.id,
              start: newStart,
              end: newEnd,
              oldStart,
              oldEnd,
              view,
            });
          } catch {
            setScheduledEvents(prevScheduled);
          }
        })();
      }
    },
    [startDate, scheduledEvents, setScheduledEvents, onEventResize, view],
  );

  const handleUnassignedEventDrop = useCallback(
    (event: CalendarEvent, dayIndex: number) => {
      const oldStart = dayjs(event.start);
      const oldEnd = dayjs(event.end);
      const newStart = startDate.clone().add(dayIndex, "days");
      const newEnd = newStart.clone().add(1, "days");
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
    <div data-slot="week-view" className={className} style={style}>
      <div data-slot="week-view-nav">
        <Button type="button" onClick={handlePreviousWeek} aria-label="Previous week">
          ←
        </Button>
        <Title level={4}>{weekTitle}</Title>
        <Button type="button" onClick={handleNextWeek} aria-label="Next week">
          →
        </Button>
      </div>

      <div data-slot="week-view-grid" ref={containerRef}>
        <Responsive
          layouts={{ lg: layouts.lg }}
          cols={{ lg: 7, md: 7, sm: 7, xs: 7, xxs: 7 }}
          rowHeight={50}
          width={1200}
          dragConfig={{ enabled: !readOnly }}
          resizeConfig={{ enabled: !readOnly }}
          onDragStop={handleDragStop}
          onDrag={handleDrag}
          onResizeStop={handleResizeStop}
        >
          {getWeekDaysWithDates().map(({ dayIndex, date }) => (
            <div
              key={`day-${dayIndex}`}
              data-slot="week-day-cell"
              data-day-index={dayIndex}
              data-date={date}
              data-grid={{
                i: `day-${dayIndex}`,
                x: dayIndex,
                y: 0,
                w: 1,
                h: 1.5,
                static: true,
              }}
            >
              <span>{dayjs(date).format("ddd")}</span>
              <span>{dayjs(date).format("D")}</span>
            </div>
          ))}
          {scheduledEvents.map((event) => {
            const gridData = getEventGridData(event);
            if (!gridData) return null;
            return (
              <div
                key={gridData.i}
                data-grid={gridData}
                data-slot="event"
                data-event-id={event.id}
                data-color={event.color ?? undefined}
              >
                {event.title}
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
            );
          })}
        </Responsive>
      </div>

      <div data-slot="unscheduled-list">
        <h3 data-slot="unscheduled-title">Unscheduled events</h3>
        {!readOnly && (
          <Tooltip title="Add new event">
            <Button type="button" onClick={openCreateTask} aria-label="Add event">
              +
            </Button>
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
              onDragEnd={(e) => {
                const calendar = containerRef.current;
                if (calendar) {
                  const calendarRect = calendar.getBoundingClientRect();
                  const dropX = e.clientX - calendarRect.left;
                  const columnWidth = calendarRect.width / 7;
                  const columnIndex = Math.floor(dropX / columnWidth);
                  const boundedIndex = Math.max(0, Math.min(6, columnIndex));
                  handleUnassignedEventDrop(event, boundedIndex);
                }
              }}
              onDoubleClick={() => handleOpenEvent(event)}
            >
              {event.title}
            </div>
          ))}
        </div>
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
