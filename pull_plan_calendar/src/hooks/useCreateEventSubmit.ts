import dayjs, { type Dayjs } from "dayjs";
import { useCallback } from "react";
import type { CalendarEvent, CalendarEventCreatePayload } from "../types/calendar";

export interface CreateEventSubmitData {
  name: string;
  startDate: Dayjs;
  endDate: Dayjs;
}

export function useCreateEventSubmit(
  scheduledEvents: CalendarEvent[],
  setScheduledEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>,
  onEventCreate: ((payload: CalendarEventCreatePayload) => Promise<void>) | undefined,
  onClose: () => void,
) {
  return useCallback(
    async (data: CreateEventSubmitData) => {
      const id = `event-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const newEvent: CalendarEvent = {
        id,
        title: data.name,
        start: data.startDate,
        end: data.endDate,
      };
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
    [scheduledEvents, setScheduledEvents, onEventCreate, onClose],
  );
}
