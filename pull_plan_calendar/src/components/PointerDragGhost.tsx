"use client";

import type { CalendarEvent } from "../types/calendar";
import { getEventChipStyle } from "../utils/eventDisplay";

export function PointerDragGhost({
  event,
  x,
  y,
}: {
  event: CalendarEvent;
  x: number;
  y: number;
}) {
  return (
    <div
      data-slot="pointer-drag-ghost"
      style={getEventChipStyle(event, {
        position: "fixed",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 50,
        padding: "0.25rem 0.75rem",
        borderRadius: 9999,
        opacity: 0.9,
        boxShadow: "0 8px 16px rgba(15, 23, 42, 0.18)",
      })}
    >
      {event.title}
    </div>
  );
}
