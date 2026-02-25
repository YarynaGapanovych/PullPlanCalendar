"use client";

import { useDraggable } from "@dnd-kit/core";
import { useMemo } from "react";
import type { CalendarEvent } from "../types/calendar";
import type { WeekEventPlacement } from "../utils/weekViewLayout";
import { EventActionButtonSlot } from "./EventActionButtonSlot";

const ROW_HEIGHT = 50;

export interface WeekEventCardProps {
  event: CalendarEvent;
  placement: WeekEventPlacement;
  rowIndex: number;
  readOnly: boolean;
  onOpen: () => void;
  dragDeltaX: number | null;
  onResizeStart: (
    eventId: string,
    handle: "left" | "right",
    startX: number,
  ) => void;
  EventActionButton?: React.ComponentType<{
    event: CalendarEvent;
    onOpen: () => void;
  }>;
}

export function WeekEventCard({
  event,
  placement,
  rowIndex,
  readOnly,
  onOpen,
  dragDeltaX,
  onResizeStart,
  EventActionButton,
}: WeekEventCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: event.id,
    disabled: readOnly,
  });

  const style: React.CSSProperties = useMemo(
    () => ({
      position: "absolute" as const,
      left: placement.leftPx,
      top: rowIndex * ROW_HEIGHT,
      width: placement.widthPx,
      height: ROW_HEIGHT,
      transform: dragDeltaX != null ? `translateX(${dragDeltaX}px)` : undefined,
      boxSizing: "border-box",
      backgroundColor: event.color ?? "var(--event-bg, #e0e7ff)",
      border: "1px solid var(--event-border, #c7d2fe)",
      borderRadius: 4,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 4px",
      cursor: readOnly ? "default" : "grab",
      zIndex: isDragging ? 1 : 0,
    }),
    [
      placement.leftPx,
      placement.widthPx,
      rowIndex,
      dragDeltaX,
      event.color,
      readOnly,
      isDragging,
    ],
  );

  return (
    <div
      ref={setNodeRef}
      data-slot="event"
      data-event-id={event.id}
      data-color={event.color ?? undefined}
      style={style}
      {...(readOnly ? {} : { ...attributes, ...listeners })}
    >
      {!readOnly && (
        <>
          <div
            role="button"
            tabIndex={0}
            aria-label="Resize start"
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeStart(event.id, "left", e.clientX);
            }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 8,
              cursor: "ew-resize",
            }}
          />
          <div
            role="button"
            tabIndex={0}
            aria-label="Resize end"
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeStart(event.id, "right", e.clientX);
            }}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 8,
              cursor: "ew-resize",
            }}
          />
        </>
      )}
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
        }}
      >
        {event.title}
      </span>
      <EventActionButtonSlot
        event={event}
        onOpen={onOpen}
        EventActionButton={EventActionButton}
      />
    </div>
  );
}
