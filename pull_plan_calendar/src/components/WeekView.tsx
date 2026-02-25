"use client";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
} from "@dnd-kit/core";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCreateEventSubmit } from "../hooks/useCreateEventSubmit";
import type {
  CalendarEvent,
  CalendarEventCreatePayload,
  CalendarEventMovePayload,
  CalendarEventResizePayload,
  CalendarViewMode,
} from "../types/calendar";
import type { Task } from "../types/task";
import {
  getEventPlacement,
  getOverlapRowAssignments,
  pixelDeltaToDayDelta,
} from "../utils/weekViewLayout";
import type { CreateTaskModalProps } from "./tasks/CreateTaskModal";
import { CreateTaskModal } from "./tasks/CreateTaskModal";
import type { TaskModalProps } from "./tasks/TaskModal";
import { TaskModal } from "./tasks/TaskModal";
import { WeekEventCard } from "./WeekEventCard";
import { Button } from "./ui/Button";
import { Title } from "./ui/Title";
import { Tooltip } from "./ui/Tooltip";

const ROW_HEIGHT = 50;

export interface WeekViewProps {
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

export default function WeekView({
  startDate,
  scheduledEvents,
  unscheduledEvents,
  setScheduledEvents,
  setUnscheduledEvents,
  setStartDate,
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
  previousWeekButtonContent = "←",
  nextWeekButtonContent = "→",
  className,
  style,
}: WeekViewProps) {
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [dragDelta, setDragDelta] = useState<{ id: string; x: number } | null>(
    null,
  );
  const [resizePreview, setResizePreview] = useState<{
    eventId: string;
    leftDeltaDays: number;
    rightDeltaDays: number;
  } | null>(null);
  const [resizing, setResizing] = useState<{
    eventId: string;
    handle: "left" | "right";
    startX: number;
    startOffsetDays: number;
    durationDays: number;
    columnWidth: number;
  } | null>(null);
  const resizePreviewRef = useRef({ leftDeltaDays: 0, rightDeltaDays: 0 });
  const lastClampedDeltaRef = useRef<{ id: string; x: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const openTask = () => setIsTaskOpen(true);
  const closeTask = () => {
    setIsTaskOpen(false);
    setSelectedEvent(null);
  };
  const openCreateTask = async () => {
    if (onDateClick) {
      try {
        await onDateClick(startDate, "week");
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

  const weekTitle = useMemo(() => {
    const endDate = startDate.add(6, "days");
    return `${startDate.format("MMM D")} - ${endDate.format("MMM D, YYYY")}`;
  }, [startDate]);

  const weekDaysWithDates = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, index) => {
        const date = startDate.clone().add(index, "days");
        return { dayIndex: index, date: date.format("YYYY-MM-DD") };
      }),
    [startDate],
  );

  const handlePreviousWeek = useCallback(() => {
    setStartDate(startDate.subtract(1, "week"));
  }, [startDate, setStartDate]);

  const handleNextWeek = useCallback(() => {
    setStartDate(startDate.add(1, "week"));
  }, [startDate, setStartDate]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      const id = String(event.active.id);
      const ev = scheduledEvents.find((e) => e.id === id);
      if (!ev || containerWidth <= 0) {
        setDragDelta({ id, x: event.delta.x });
        lastClampedDeltaRef.current = { id, x: event.delta.x };
        return;
      }
      const placement = getEventPlacement(ev, startDate, containerWidth);
      if (!placement) {
        setDragDelta({ id, x: event.delta.x });
        lastClampedDeltaRef.current = { id, x: event.delta.x };
        return;
      }
      const minDeltaX = -placement.leftPx;
      const maxDeltaX = containerWidth - (placement.leftPx + placement.widthPx);
      const clampedX = Math.max(minDeltaX, Math.min(maxDeltaX, event.delta.x));
      setDragDelta({ id, x: clampedX });
      lastClampedDeltaRef.current = { id, x: clampedX };
    },
    [scheduledEvents, startDate, containerWidth],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event;
      const effectiveDeltaX =
        lastClampedDeltaRef.current?.id === active.id
          ? lastClampedDeltaRef.current.x
          : delta.x;
      setDragDelta(null);
      lastClampedDeltaRef.current = null;
      const ev = scheduledEvents.find((e) => e.id === active.id);
      if (!ev || !containerRef.current) return;

      const columnWidth = containerWidth / 7;
      if (columnWidth <= 0) return;

      const placement = getEventPlacement(ev, startDate, containerWidth);
      if (!placement) return;

      const durationDays = placement.durationDays;
      const finalLeftPx = placement.leftPx + effectiveDeltaX;
      const finalRightPx =
        placement.leftPx + placement.widthPx + effectiveDeltaX;

      let newWeekStart = startDate;
      let tentativeStartOffset: number;

      if (finalLeftPx <= 0) {
        handlePreviousWeek();
        newWeekStart = startDate.subtract(1, "week");
        tentativeStartOffset = Math.round(
          (finalLeftPx + containerWidth) / columnWidth,
        );
        tentativeStartOffset = Math.max(
          0,
          Math.min(7 - durationDays, tentativeStartOffset),
        );
      } else if (finalRightPx >= containerWidth) {
        handleNextWeek();
        newWeekStart = startDate.add(1, "week");
        tentativeStartOffset = Math.round(
          (finalLeftPx - containerWidth) / columnWidth,
        );
        tentativeStartOffset = Math.max(
          0,
          Math.min(7 - durationDays, tentativeStartOffset),
        );
      } else {
        const dayDelta = pixelDeltaToDayDelta(effectiveDeltaX, columnWidth);
        tentativeStartOffset = placement.startOffsetDays + dayDelta;
        tentativeStartOffset = Math.max(
          0,
          Math.min(7 - durationDays, tentativeStartOffset),
        );
      }

      const newStart = newWeekStart.clone().add(tentativeStartOffset, "days");
      const newEnd = newStart.clone().add(durationDays - 1, "days");
      const oldStart = dayjs(ev.start);
      const oldEnd = dayjs(ev.end);
      if (oldStart.isSame(newStart, "day") && oldEnd.isSame(newEnd, "day"))
        return;

      const updatedEvent: CalendarEvent = {
        ...ev,
        start: newStart,
        end: newEnd,
      };
      const prevScheduled = [...scheduledEvents];
      const prevUnscheduled = [...unscheduledEvents];
      setScheduledEvents((prev) =>
        prev.map((e) => (e.id === ev.id ? updatedEvent : e)),
      );
      setUnscheduledEvents((prev) => prev.filter((e) => e.id !== ev.id));

      if (onEventMove) {
        (async () => {
          try {
            await onEventMove({
              id: ev.id,
              start: newStart,
              end: newEnd,
              oldStart,
              oldEnd,
              view: "week",
            });
          } catch {
            setScheduledEvents(prevScheduled);
            setUnscheduledEvents(prevUnscheduled);
          }
        })();
      }
    },
    [
      scheduledEvents,
      unscheduledEvents,
      containerWidth,
      startDate,
      setScheduledEvents,
      setUnscheduledEvents,
      onEventMove,
      handlePreviousWeek,
      handleNextWeek,
    ],
  );

  const onResizeStart = useCallback(
    (eventId: string, handle: "left" | "right", startX: number) => {
      if (readOnly) return;
      const evt = scheduledEvents.find((e) => e.id === eventId);
      if (!evt) return;
      const placement = getEventPlacement(evt, startDate, containerWidth);
      if (!placement) return;
      setResizing({
        eventId,
        handle,
        startX,
        startOffsetDays: placement.startOffsetDays,
        durationDays: placement.durationDays,
        columnWidth: placement.columnWidth,
      });
      setResizePreview({
        eventId,
        leftDeltaDays: 0,
        rightDeltaDays: 0,
      });
    },
    [readOnly, scheduledEvents, startDate, containerWidth],
  );

  useEffect(() => {
    if (!resizing) return;
    const {
      eventId,
      handle,
      startX,
      startOffsetDays,
      durationDays,
      columnWidth,
    } = resizing;
    const onMove = (e: PointerEvent) => {
      const deltaX = e.clientX - startX;
      const dayDelta = pixelDeltaToDayDelta(deltaX, columnWidth);
      if (handle === "left") {
        const leftDeltaDays = Math.max(
          -startOffsetDays,
          Math.min(dayDelta, durationDays - 1),
        );
        resizePreviewRef.current = { leftDeltaDays, rightDeltaDays: 0 };
        setResizePreview({
          eventId,
          leftDeltaDays,
          rightDeltaDays: 0,
        });
      } else {
        const rightDeltaDays = Math.max(
          1 - durationDays,
          Math.min(dayDelta, 7 - (startOffsetDays + durationDays)),
        );
        resizePreviewRef.current = { leftDeltaDays: 0, rightDeltaDays };
        setResizePreview({
          eventId,
          leftDeltaDays: 0,
          rightDeltaDays,
        });
      }
    };
    const onUp = () => {
      const current = resizePreviewRef.current;
      setResizing(null);
      setResizePreview(null);
      const evt = scheduledEvents.find((e) => e.id === eventId);
      if (!evt) return;
      const newStartOffsetDays = startOffsetDays + current.leftDeltaDays;
      const newDurationDays =
        handle === "left"
          ? durationDays - current.leftDeltaDays
          : durationDays + current.rightDeltaDays;
      if (newDurationDays < 1) return;
      const newStart = startDate.clone().add(newStartOffsetDays, "days");
      const newEnd = newStart.clone().add(newDurationDays - 1, "days");
      const oldStart = dayjs(evt.start);
      const oldEnd = dayjs(evt.end);
      const updatedEvent: CalendarEvent = {
        ...evt,
        start: newStart,
        end: newEnd,
      };
      const prevScheduled = [...scheduledEvents];
      setScheduledEvents((prev) =>
        prev.map((e) => (e.id === eventId ? updatedEvent : e)),
      );
      if (onEventResize) {
        (async () => {
          try {
            await onEventResize({
              id: eventId,
              start: newStart,
              end: newEnd,
              oldStart,
              oldEnd,
              view: "week",
            });
          } catch {
            setScheduledEvents(prevScheduled);
          }
        })();
      }
    };
    window.addEventListener("pointermove", onMove, { capture: true });
    window.addEventListener("pointerup", onUp, { capture: true });
    return () => {
      window.removeEventListener("pointermove", onMove, { capture: true });
      window.removeEventListener("pointerup", onUp, { capture: true });
    };
  }, [resizing, scheduledEvents, startDate, setScheduledEvents, onEventResize]);

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
              view: "week",
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

  const gridStyle: React.CSSProperties = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      width: "100%",
    }),
    [],
  );

  const eventsWithPlacementAndRow = useMemo(() => {
    const withPlacement = scheduledEvents
      .map((event) => ({
        event,
        placement: getEventPlacement(
          event,
          startDate,
          containerWidth,
          resizePreview?.eventId === event.id
            ? {
                leftDeltaDays: resizePreview.leftDeltaDays,
                rightDeltaDays: resizePreview.rightDeltaDays,
              }
            : undefined,
        ),
      }))
      .filter(
        (w): w is typeof w & { placement: NonNullable<typeof w.placement> } =>
          w.placement != null,
      );
    const { rowIndices, numRows } = getOverlapRowAssignments(
      withPlacement.map((w) => ({
        startOffsetDays: w.placement.startOffsetDays,
        durationDays: w.placement.durationDays,
      })),
    );
    return { items: withPlacement, rowIndices, numRows };
  }, [scheduledEvents, startDate, containerWidth, resizePreview]);

  const eventsOverlayStyle: React.CSSProperties = useMemo(
    () => ({
      position: "relative" as const,
      height: Math.max(
        ROW_HEIGHT,
        eventsWithPlacementAndRow.numRows * ROW_HEIGHT,
      ),
      width: "100%",
    }),
    [eventsWithPlacementAndRow.numRows],
  );

  return (
    <div data-slot="week-view" className={className} style={style}>
      <div data-slot="week-view-nav">
        <Button
          type="button"
          onClick={handlePreviousWeek}
          aria-label="Previous week"
        >
          {previousWeekButtonContent}
        </Button>
        <Title level={4}>{weekTitle}</Title>
        <Button type="button" onClick={handleNextWeek} aria-label="Next week">
          {nextWeekButtonContent}
        </Button>
      </div>

      <div data-slot="week-view-grid" ref={containerRef} style={gridStyle}>
        {weekDaysWithDates.map(({ dayIndex, date }) => (
          <div
            key={`day-${dayIndex}`}
            data-slot="week-day-cell"
            data-day-index={dayIndex}
            data-date={date}
            style={{ padding: "4px", borderRight: "1px solid #e5e7eb" }}
          >
            <span>{dayjs(date).format("ddd")}</span>
            <span>{dayjs(date).format("D")}</span>
          </div>
        ))}
        <div style={{ gridColumn: "1 / -1", ...eventsOverlayStyle }}>
          <DndContext
            sensors={sensors}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            {eventsWithPlacementAndRow.items.map(({ event }, i) => (
              <WeekEventCard
                key={event.id}
                event={event}
                placement={eventsWithPlacementAndRow.items[i].placement}
                rowIndex={eventsWithPlacementAndRow.rowIndices[i]}
                readOnly={readOnly}
                onOpen={() => handleOpenEvent(event)}
                dragDeltaX={dragDelta?.id === event.id ? dragDelta.x : null}
                onResizeStart={onResizeStart}
                EventActionButton={EventActionButton}
              />
            ))}
          </DndContext>
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
