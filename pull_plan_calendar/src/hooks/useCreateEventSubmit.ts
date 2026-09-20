import dayjs, { type Dayjs } from "dayjs";
import { useCallback } from "react";
import type { CalendarEvent, CalendarEventCreatePayload } from "../types/calendar";

export interface CreateEventSubmitData {
  name: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

export function useCreateEventSubmit(
  scheduledEvents: CalendarEvent[],
  setScheduledEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>,
  onEventCreate: ((payload: CalendarEventCreatePayload) => Promise<void>) | undefined,
  onClose: () => void,
  unscheduledEvents?: CalendarEvent[],
  setUnscheduledEvents?: React.Dispatch<React.SetStateAction<CalendarEvent[]>>,
) {
  return useCallback(
    async (data: CreateEventSubmitData) => {
      const id = `event-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const hasDates = data.startDate != null && data.endDate != null;
      const newEvent: CalendarEvent = {
        id,
        title: data.name,
        start: hasDates ? data.startDate : null,
        end: hasDates ? data.endDate : null,
      };

      if (!hasDates) {
        if (!setUnscheduledEvents) return;
        const prevUnscheduled = [...(unscheduledEvents ?? [])];
        setUnscheduledEvents((prev) => [...prev, newEvent]);
        onClose();
        if (onEventCreate) {
          try {
            await onEventCreate({
              id: newEvent.id,
              title: newEvent.title,
              start: null,
              end: null,
            });
          } catch {
            setUnscheduledEvents(prevUnscheduled);
          }
        }
        return;
      }

      const prevScheduled = [...scheduledEvents];
      setScheduledEvents((prev) => [...prev, newEvent]);
      onClose();
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
    [
      scheduledEvents,
      setScheduledEvents,
      unscheduledEvents,
      setUnscheduledEvents,
      onEventCreate,
      onClose,
    ],
  );
}
