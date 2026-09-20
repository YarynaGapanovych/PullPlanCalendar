"use client";

import dayjs, { type Dayjs } from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCreateEventSubmit } from "../hooks/useCreateEventSubmit";
import { useDelayedPointerDrag } from "../hooks/useDelayedPointerDrag";
import type {
  CalendarEvent,
  CalendarEventCreatePayload,
  CalendarEventMovePayload,
  CalendarEventResizePayload,
  CalendarLabels,
  CalendarViewMode,
} from "../types/calendar";
import type { Task } from "../types/task";
import {
  formatEventTimeLabel,
  getEventChipStyle,
  isAllDayLikeEvent,
} from "../utils/eventDisplay";
import { isTouchLikePointer, pointInRect } from "../utils/pointerDrag";
import {
  clampStartToWindow,
  formatHourLabel,
  getVisibleHourRange,
  hhmmToMinutes,
  minutesFromGridPointer,
  snapMinutes,
} from "../utils/timeGrid";
import type { CreateTaskModalProps } from "./tasks/CreateTaskModal";
import { CreateTaskModal } from "./tasks/CreateTaskModal";
import type { TaskModalProps } from "./tasks/TaskModal";
import { TaskModal } from "./tasks/TaskModal";
import { EventActionButtonSlot } from "./EventActionButtonSlot";
import { PointerDragGhost } from "./PointerDragGhost";
import { Button } from "./ui/Button";
import { Title } from "./ui/Title";
import { Tooltip } from "./ui/Tooltip";

const MIN_EVENT_HEIGHT_PX = 24;
const HOUR_ROW_HEIGHT = 48;

function isFullDayEvent(
  event: CalendarEvent,
  dayStart: Dayjs,
  dayEnd: Dayjs,
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
  windowStart: Dayjs,
  windowEnd: Dayjs,
  hourRowHeight: number,
): { topPx: number; heightPx: number } | null {
  const start = dayjs(event.start);
  const end = dayjs(event.end);
  const visualStart = start.isBefore(windowStart) ? windowStart : start;
  const visualEnd = end.isAfter(windowEnd) ? windowEnd : end;
  if (!visualStart.isBefore(visualEnd) && !visualStart.isSame(visualEnd))
    return null;
  const topPx = visualStart.diff(windowStart, "minute") * (hourRowHeight / 60);
  const heightPx = Math.max(
    MIN_EVENT_HEIGHT_PX,
    visualEnd.diff(visualStart, "minute") * (hourRowHeight / 60),
  );
  return { topPx, heightPx };
}

export interface DayViewProps {
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
    variables?: { data: Record<string, unknown> };
    onError?: (error: Error) => void;
  }) => Promise<void>;
  mapFromEvent?: (event: CalendarEvent) => Task;
  AddEventButton?: React.ComponentType<{ onClick: () => void }>;
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

export default function DayView({
  startDate,
  setStartDate,
  scheduledEvents,
  unscheduledEvents,
  setScheduledEvents,
  setUnscheduledEvents,
  onEventMove,
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
  todayButtonContent = "Today",
  todayButtonClassName,
  todayButtonStyle,
  labels,
  defaultDurationMinutes = 60,
  workdayStart = "09:00",
  workdayEnd = "17:00",
  showFullDay = false,
  className,
  style,
}: DayViewProps) {
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [createSeedStart, setCreateSeedStart] = useState<Dayjs | null>(null);
  const [createSeedEnd, setCreateSeedEnd] = useState<Dayjs | null>(null);
  const [dropPreview, setDropPreview] = useState<{
    topPx: number;
    heightPx: number;
  } | null>(null);
  const [moving, setMoving] = useState<{
    eventId: string;
    startClientY: number;
    originTopPx: number;
    durationMinutes: number;
  } | null>(null);
  const [movePreviewTopPx, setMovePreviewTopPx] = useState<number | null>(null);
  const [draggingUnscheduled, setDraggingUnscheduled] =
    useState<CalendarEvent | null>(null);
  const [dragPointer, setDragPointer] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const gridScrollRef = useRef<HTMLDivElement>(null);
  const movePreviewRef = useRef<{ topPx: number; active: boolean }>({
    topPx: 0,
    active: false,
  });
  const skipClickAfterMoveRef = useRef(false);
  const dropPreviewRef = useRef<{
    topPx: number;
    heightPx: number;
    start: Dayjs;
  } | null>(null);
  const movingRef = useRef<{
    eventId: string;
    startClientY: number;
    originTopPx: number;
    durationMinutes: number;
  } | null>(null);

  const openTask = () => setIsTaskOpen(true);
  const closeTask = () => {
    setIsTaskOpen(false);
    setSelectedEvent(null);
  };

  const closeCreateTask = () => {
    setIsCreateTaskOpen(false);
    setCreateSeedStart(null);
    setCreateSeedEnd(null);
  };

  const openUnscheduledCreate = () => {
    setCreateSeedStart(null);
    setCreateSeedEnd(null);
    setIsCreateTaskOpen(true);
  };

  const openCreateTask = async (at?: Dayjs) => {
    const start = at ?? startDate.hour(9).minute(0).second(0).millisecond(0);
    const end = start.add(defaultDurationMinutes, "minute");
    if (onDateClick) {
      try {
        await onDateClick(start, "day");
      } catch {
        return;
      }
    }
    setCreateSeedStart(start);
    setCreateSeedEnd(end);
    setIsCreateTaskOpen(true);
  };

  const dayTitle = useMemo(
    () => startDate.format("dddd, MMM D, YYYY"),
    [startDate],
  );

  const { startHour, endHour } = useMemo(
    () => getVisibleHourRange(workdayStart, workdayEnd, showFullDay),
    [workdayStart, workdayEnd, showFullDay],
  );
  const hours = useMemo(
    () => Array.from({ length: endHour - startHour }, (_, i) => startHour + i),
    [startHour, endHour],
  );
  const hourCount = hours.length;

  const dayStart = useMemo(() => startDate.startOf("day"), [startDate]);
  const dayEnd = useMemo(() => startDate.endOf("day"), [startDate]);
  const windowStart = useMemo(
    () => dayStart.add(startHour, "hour"),
    [dayStart, startHour],
  );
  const windowEnd = useMemo(
    () => dayStart.add(endHour, "hour"),
    [dayStart, endHour],
  );

  const workdayStartMin = hhmmToMinutes(workdayStart, 9 * 60);
  const workdayEndMin = hhmmToMinutes(workdayEnd, 17 * 60);

  const [now, setNow] = useState(() => dayjs());
  const isViewingToday = startDate.isSame(now, "day");
  useEffect(() => {
    if (!isViewingToday) return;
    const t = setInterval(() => setNow(dayjs()), 60_000);
    return () => clearInterval(t);
  }, [isViewingToday]);

  useEffect(() => {
    if (!isViewingToday || !gridScrollRef.current) return;
    const current = dayjs();
    if (current.isBefore(windowStart) || !current.isBefore(windowEnd)) return;
    const top =
      current.diff(windowStart, "minute") * (HOUR_ROW_HEIGHT / 60) -
      HOUR_ROW_HEIGHT * 2;
    gridScrollRef.current.scrollTop = Math.max(0, top);
  }, [isViewingToday, startDate, windowStart, windowEnd]);

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

  const handleToday = () => {
    setStartDate(dayjs());
  };

  const handleHourClick = (hour: number) => {
    if (readOnly) return;
    void openCreateTask(dayStart.hour(hour).minute(0).second(0).millisecond(0));
  };

  const eventDurationMinutes = useCallback(
    (event: CalendarEvent) => {
      const oldStart = dayjs(event.start);
      const oldEnd = dayjs(event.end);
      const existingDuration = oldEnd.diff(oldStart, "minute");
      if (!isAllDayLikeEvent(event) && existingDuration > 0) {
        return existingDuration;
      }
      return defaultDurationMinutes;
    },
    [defaultDurationMinutes],
  );

  const startFromPointer = useCallback(
    (clientY: number, durationMinutes: number) => {
      const scrollEl = gridScrollRef.current;
      if (!scrollEl) return null;
      const minutesFromWindow = minutesFromGridPointer(
        clientY,
        scrollEl,
        HOUR_ROW_HEIGHT,
      );
      const rawStart = windowStart.add(minutesFromWindow, "minute");
      return clampStartToWindow(
        rawStart,
        windowStart,
        windowEnd,
        durationMinutes,
      );
    },
    [windowStart, windowEnd],
  );

  const dropPreviewFromPointer = useCallback(
    (event: CalendarEvent, clientY: number) => {
      const durationMinutes = eventDurationMinutes(event);
      const newStart = startFromPointer(clientY, durationMinutes);
      if (!newStart) return null;
      const topPx =
        newStart.diff(windowStart, "minute") * (HOUR_ROW_HEIGHT / 60);
      const heightPx = Math.max(
        MIN_EVENT_HEIGHT_PX,
        durationMinutes * (HOUR_ROW_HEIGHT / 60),
      );
      return { topPx, heightPx, start: newStart };
    },
    [eventDurationMinutes, startFromPointer, windowStart],
  );

  const clearDropPreview = useCallback(() => {
    dropPreviewRef.current = null;
    setDropPreview(null);
  }, []);

  const handleEventsColumnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly) return;
    if (skipClickAfterMoveRef.current) {
      skipClickAfterMoveRef.current = false;
      return;
    }
    if ((e.target as HTMLElement).closest('[data-slot="event"]')) return;
    const at = startFromPointer(e.clientY, defaultDurationMinutes);
    if (!at) return;
    if (at.isBefore(windowStart) || !at.isBefore(windowEnd)) return;
    void openCreateTask(at);
  };

  const handleUnassignedEventDrop = useCallback(
    (event: CalendarEvent, newStart: Dayjs) => {
      const oldStart = dayjs(event.start);
      const oldEnd = dayjs(event.end);
      const durationMinutes = eventDurationMinutes(event);
      const newEnd = newStart.add(durationMinutes, "minute");

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
      eventDurationMinutes,
      scheduledEvents,
      unscheduledEvents,
      setScheduledEvents,
      setUnscheduledEvents,
      onEventMove,
    ],
  );

  const updateTimedMovePreview = useCallback(
    (clientY: number) => {
      const current = movingRef.current;
      if (!current) return;
      const rawTop = current.originTopPx + (clientY - current.startClientY);
      const minutesFromTop = snapMinutes((rawTop / HOUR_ROW_HEIGHT) * 60);
      const rawStart = windowStart.add(minutesFromTop, "minute");
      const newStart = clampStartToWindow(
        rawStart,
        windowStart,
        windowEnd,
        current.durationMinutes,
      );
      const topPx =
        newStart.diff(windowStart, "minute") * (HOUR_ROW_HEIGHT / 60);
      movePreviewRef.current = { topPx, active: true };
      setMovePreviewTopPx(topPx);
    },
    [windowStart, windowEnd],
  );

  const commitTimedMove = useCallback(() => {
    const current = movingRef.current;
    const preview = movePreviewRef.current;
    movingRef.current = null;
    setMoving(null);
    setMovePreviewTopPx(null);
    movePreviewRef.current = { topPx: 0, active: false };
    if (!current || !preview.active) return;
    skipClickAfterMoveRef.current = true;
    const evt = scheduledEvents.find((item) => item.id === current.eventId);
    if (!evt) return;
    const minutesFromWindow = Math.round(
      preview.topPx / (HOUR_ROW_HEIGHT / 60),
    );
    const newStart = windowStart
      .add(minutesFromWindow, "minute")
      .second(0)
      .millisecond(0);
    const newEnd = newStart.add(current.durationMinutes, "minute");
    const oldStart = dayjs(evt.start);
    const oldEnd = dayjs(evt.end);
    if (oldStart.isSame(newStart) && oldEnd.isSame(newEnd)) return;
    const updatedEvent: CalendarEvent = {
      ...evt,
      start: newStart,
      end: newEnd,
    };
    const prevScheduled = [...scheduledEvents];
    setScheduledEvents((prev) =>
      prev.map((item) => (item.id === current.eventId ? updatedEvent : item)),
    );
    if (onEventMove) {
      void (async () => {
        try {
          await onEventMove({
            id: current.eventId,
            start: newStart,
            end: newEnd,
            oldStart,
            oldEnd,
            view: "day",
          });
        } catch {
          setScheduledEvents(prevScheduled);
        }
      })();
    }
  }, [scheduledEvents, setScheduledEvents, onEventMove, windowStart]);

  const { onPointerDown: onTimedPointerDown } = useDelayedPointerDrag<{
    event: CalendarEvent;
    originTopPx: number;
  }>({
    disabled: readOnly,
    onDragStart: ({ event, originTopPx }, e) => {
      const session = {
        eventId: event.id,
        startClientY: e.clientY,
        originTopPx,
        durationMinutes: eventDurationMinutes(event),
      };
      movingRef.current = session;
      setMoving(session);
    },
    onDragMove: (_payload, e) => {
      updateTimedMovePreview(e.clientY);
    },
    onDragEnd: () => {
      commitTimedMove();
    },
    onDragCancel: () => {
      movingRef.current = null;
      setMoving(null);
      setMovePreviewTopPx(null);
      movePreviewRef.current = { topPx: 0, active: false };
    },
  });

  const { onPointerDown: onUnscheduledPointerDown } =
    useDelayedPointerDrag<CalendarEvent>({
      disabled: readOnly,
      onDragStart: (event, e) => {
        setDraggingUnscheduled(event);
        setDragPointer({ x: e.clientX, y: e.clientY });
        const grid = gridScrollRef.current;
        if (
          !grid ||
          !pointInRect(e.clientX, e.clientY, grid.getBoundingClientRect())
        ) {
          clearDropPreview();
          return;
        }
        const preview = dropPreviewFromPointer(event, e.clientY);
        dropPreviewRef.current = preview;
        setDropPreview(
          preview ? { topPx: preview.topPx, heightPx: preview.heightPx } : null,
        );
      },
      onDragMove: (event, e) => {
        setDragPointer({ x: e.clientX, y: e.clientY });
        const grid = gridScrollRef.current;
        if (
          !grid ||
          !pointInRect(e.clientX, e.clientY, grid.getBoundingClientRect())
        ) {
          clearDropPreview();
          return;
        }
        const preview = dropPreviewFromPointer(event, e.clientY);
        dropPreviewRef.current = preview;
        setDropPreview(
          preview ? { topPx: preview.topPx, heightPx: preview.heightPx } : null,
        );
      },
      onDragEnd: (event) => {
        const preview = dropPreviewRef.current;
        setDraggingUnscheduled(null);
        setDragPointer(null);
        clearDropPreview();
        skipClickAfterMoveRef.current = true;
        if (!preview) return;
        handleUnassignedEventDrop(event, preview.start);
      },
      onDragCancel: () => {
        clearDropPreview();
        setDraggingUnscheduled(null);
        setDragPointer(null);
      },
      onPress: (event, e) => {
        if (!isTouchLikePointer(e.pointerType)) return;
        void handleOpenEvent(event);
      },
    });

  const handleCreateSubmit = useCreateEventSubmit(
    scheduledEvents,
    setScheduledEvents,
    onEventCreate,
    closeCreateTask,
    unscheduledEvents,
    setUnscheduledEvents,
  );

  const showNowLine =
    isViewingToday &&
    !now.isBefore(windowStart) &&
    now.isBefore(windowEnd);

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
        <Button
          type="button"
          onClick={handleToday}
          data-slot="today-button"
          className={todayButtonClassName}
          style={todayButtonStyle}
          aria-label={
            typeof todayButtonContent === "string"
              ? todayButtonContent
              : "Today"
          }
        >
          {todayButtonContent}
        </Button>
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
                style={getEventChipStyle(event)}
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
        ref={gridScrollRef}
        data-slot="day-view-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "4rem 1fr",
          gridTemplateRows: `repeat(${hourCount}, ${HOUR_ROW_HEIGHT}px)`,
          maxHeight: Math.min(hourCount, 12) * HOUR_ROW_HEIGHT,
          overflowY: "auto",
        }}
      >
        {hours.map((hour, index) => {
          const minuteOfDay = hour * 60;
          const outsideWork =
            showFullDay &&
            (minuteOfDay < workdayStartMin || minuteOfDay >= workdayEndMin);
          return (
            <div
              key={hour}
              data-slot={
                outsideWork ? "day-hour-outside-workday" : "day-hour"
              }
              data-hour={hour}
              role={readOnly ? undefined : "button"}
              tabIndex={readOnly ? undefined : 0}
              aria-label={
                readOnly ? undefined : `Create event at ${formatHourLabel(hour)}`
              }
              onClick={() => handleHourClick(hour)}
              onKeyDown={(e) => {
                if (readOnly) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleHourClick(hour);
                }
              }}
              style={{
                gridRow: index + 1,
                minHeight: HOUR_ROW_HEIGHT,
                cursor: readOnly ? "default" : "pointer",
              }}
            >
              {formatHourLabel(hour)}
            </div>
          );
        })}
        <div
          data-slot="day-events"
          onClick={handleEventsColumnClick}
          style={{
            gridColumn: 2,
            gridRow: "1 / -1",
            minHeight: hourCount * HOUR_ROW_HEIGHT,
            position: "relative",
            borderLeft: "1px solid #f3f4f6",
            cursor: readOnly ? "default" : "pointer",
          }}
        >
          {dropPreview != null && (
            <>
              <div
                data-slot="day-drop-preview"
                aria-hidden
                style={{ top: dropPreview.topPx }}
              />
              {draggingUnscheduled && (
                <div
                  data-slot="day-drop-preview-event"
                  aria-hidden
                  style={getEventChipStyle(draggingUnscheduled, {
                    position: "absolute",
                    left: 4,
                    right: 4,
                    top: dropPreview.topPx,
                    height: dropPreview.heightPx,
                    boxSizing: "border-box",
                    padding: "2px 6px",
                    overflow: "hidden",
                    pointerEvents: "none",
                    opacity: 0.85,
                    zIndex: 3,
                  })}
                >
                  {draggingUnscheduled.title}
                </div>
              )}
            </>
          )}
          {showNowLine && (
            <div
              data-slot="day-now-line"
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: now.diff(windowStart, "minute") * (HOUR_ROW_HEIGHT / 60),
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
                pointerEvents: "none",
              }}
            >
              No events scheduled
            </p>
          ) : (
            timedEvents.map((event) => {
              const pos = getEventDayPosition(
                event,
                windowStart,
                windowEnd,
                HOUR_ROW_HEIGHT,
              );
              if (!pos) return null;
              const timeLabel = formatEventTimeLabel(event);
              const isMoving = moving?.eventId === event.id;
              const topPx =
                isMoving && movePreviewTopPx != null
                  ? movePreviewTopPx
                  : pos.topPx;
              return (
                <div
                  key={event.id}
                  data-slot="event"
                  data-event-id={event.id}
                  data-color={event.color ?? undefined}
                  data-moving={isMoving ? "" : undefined}
                  onPointerDown={(e) => {
                    if ((e.target as HTMLElement).closest("button")) return;
                    onTimedPointerDown(e, { event, originTopPx: pos.topPx });
                  }}
                  style={getEventChipStyle(event, {
                    position: "absolute",
                    left: 4,
                    right: 4,
                    top: topPx,
                    height: pos.heightPx,
                    boxSizing: "border-box",
                    padding: "2px 6px",
                    overflow: "hidden",
                    cursor: readOnly
                      ? "default"
                      : isMoving && movePreviewTopPx != null
                        ? "grabbing"
                        : "grab",
                    userSelect: "none",
                    zIndex: isMoving && movePreviewTopPx != null ? 4 : undefined,
                  })}
                >
                  <span>
                    {timeLabel ? (
                      <span data-slot="event-time">{timeLabel} </span>
                    ) : null}
                    {event.title}
                  </span>
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
        <h3 data-slot="unscheduled-title">
          {labels?.unscheduledTitle ?? "Unscheduled events"}
        </h3>
        {!readOnly &&
          (AddEventButton ? (
            <AddEventButton onClick={openUnscheduledCreate} />
          ) : (
            <Tooltip title="Add new event">
              <Button
                type="button"
                onClick={openUnscheduledCreate}
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
            initialStartDate={createSeedStart}
            initialEndDate={createSeedEnd}
          />
        ) : (
          <CreateTaskModal
            isOpen={isCreateTaskOpen}
            onClose={closeCreateTask}
            onSubmit={handleCreateSubmit}
            initialStartDate={createSeedStart}
            initialEndDate={createSeedEnd}
          />
        )}
        <div data-slot="unscheduled-items">
          {unscheduledEvents.map((event) => (
            <div
              key={event.id}
              data-slot="unscheduled-event"
              data-event-id={event.id}
              data-color={event.color ?? undefined}
              data-dragging={
                draggingUnscheduled?.id === event.id ? "" : undefined
              }
              style={getEventChipStyle(event)}
              onPointerDown={(e) => onUnscheduledPointerDown(e, event)}
              onDoubleClick={() => handleOpenEvent(event)}
            >
              {event.title}
            </div>
          ))}
        </div>
        {unscheduledEvents.length > 0 && !readOnly && (
          <p data-slot="unscheduled-hint">
            {labels?.unscheduledHint ??
              "Drag an event onto a time above to schedule it, or double-click to view."}
          </p>
        )}
      </div>
      {draggingUnscheduled && dragPointer && dropPreview == null && (
        <PointerDragGhost
          event={draggingUnscheduled}
          x={dragPointer.x}
          y={dragPointer.y}
        />
      )}

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
