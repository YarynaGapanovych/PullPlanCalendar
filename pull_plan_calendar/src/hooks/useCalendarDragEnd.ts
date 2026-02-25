import { useCallback } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import dayjs, { type Dayjs } from "dayjs";
import type { CalendarEvent, CalendarViewMode } from "../types/calendar";
import type { CalendarEventMovePayload } from "../types/calendar";

export function useCalendarDragEnd(
  startDate: Dayjs,
  scheduledEvents: CalendarEvent[],
  unscheduledEvents: CalendarEvent[],
  setScheduledEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>,
  setUnscheduledEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>,
  onEventMove: ((payload: CalendarEventMovePayload) => Promise<void>) | undefined,
  view: CalendarViewMode,
) {
  return useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const draggedEvent = scheduledEvents.find((ev) => ev.id === active.id);
      if (!draggedEvent) return;

      const dropDateIndex = over.data.current?.index as number | undefined;
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
      setUnscheduledEvents((prev) =>
        prev.filter((ev) => ev.id !== draggedEvent.id),
      );

      try {
        if (onEventMove) {
          await onEventMove({
            id: draggedEvent.id,
            start: newStart,
            end: newEnd,
            oldStart,
            oldEnd,
            view,
          });
        }
      } catch {
        setScheduledEvents(prevScheduled);
        setUnscheduledEvents(prevUnscheduled);
      }
    },
    [
      startDate,
      scheduledEvents,
      unscheduledEvents,
      setScheduledEvents,
      setUnscheduledEvents,
      onEventMove,
      view,
    ],
  );
}
