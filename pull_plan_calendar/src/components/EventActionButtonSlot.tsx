"use client";

import type { CalendarEvent } from "../types/calendar";
import { Button } from "./ui/Button";

export interface EventActionButtonSlotProps {
  event: CalendarEvent;
  onOpen: () => void;
  /** Custom button to open event details. If not set, default "View" button is used. */
  EventActionButton?: React.ComponentType<{
    event: CalendarEvent;
    onOpen: () => void;
  }>;
}

export function EventActionButtonSlot({
  event,
  onOpen,
  EventActionButton,
}: EventActionButtonSlotProps) {
  if (EventActionButton) {
    return <EventActionButton event={event} onOpen={onOpen} />;
  }
  return (
    <Button
      type="button"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onOpen();
      }}
      aria-label={`View ${event.title}`}
    >
      View
    </Button>
  );
}
