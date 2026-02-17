"use client";

import "../utils/calendarHelpers";
import { Button } from "./ui/Button";
import { Text } from "./ui/Text";
import { Tooltip } from "./ui/Tooltip";
import type { CalendarEvent, CalendarViewMode } from "../types/calendar";
import type { Task } from "../types/task";
import dayjs, { type Dayjs } from "dayjs";
import { useState } from "react";
import { TaskModal } from "./tasks/TaskModal";

export interface WeekProps {
  days: Dayjs[];
  events: CalendarEvent[];
  onSelectDate: (date: Dayjs) => void;
  currentMonth: number;
  isMonthView?: boolean;
  view?: CalendarViewMode;
  readOnly?: boolean;
  onEventClick?: (event: CalendarEvent) => Promise<void>;
  onDateClick?: (date: Dayjs, view: CalendarViewMode) => Promise<void>;
  updateTask?: (options?: {
    variables?: { data: Record<string, unknown> };
    onError?: (error: Error) => void;
  }) => Promise<unknown>;
  /** Optional: map event → task to show TaskModal (e.g. mapEventToTask). */
  mapFromEvent?: (event: CalendarEvent) => Task;
}

export function Week({
  days,
  events,
  onSelectDate,
  currentMonth,
  isMonthView,
  view = "week",
  readOnly = false,
  onEventClick,
  onDateClick,
  updateTask = async () => {},
  mapFromEvent,
}: WeekProps) {
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const openTask = () => setIsTaskOpen(true);
  const closeTask = () => {
    setIsTaskOpen(false);
    setSelectedEvent(null);
  };

  const eventsForWeek = events.filter((event) =>
    days.some((day) =>
      dayjs(day).isBetween(
        dayjs(event.start),
        dayjs(event.end),
        undefined,
        "[]",
      ),
    ),
  );

  const handleEventClick = async (event: CalendarEvent) => {
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

  const handleDateClick = async (day: Dayjs) => {
    if (onDateClick) {
      try {
        await onDateClick(day, view);
      } catch {
        return;
      }
    }
    onSelectDate(day);
  };

  return (
    <div data-slot="week" data-month-view={isMonthView ? "true" : undefined}>
      <div data-slot="week-days" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {Array(days[0].day())
          .fill(null)
          .map((_, index) => (
            <div key={`empty-${index}`} data-slot="week-day-spacer" />
          ))}
        {days.map((day, index) => {
          const isCurrentMonth = day.month() === currentMonth;
          if (isCurrentMonth) {
            return (
              <div key={index} data-slot="week-day" data-date={day.format("YYYY-MM-DD")}>
                <Text>{day.format("D")}</Text>
                {!readOnly && (
                  <Tooltip title="Add event">
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleDateClick(day);
                      }}
                      aria-label="Add event"
                    >
                      +
                    </Button>
                  </Tooltip>
                )}
              </div>
            );
          }
          return <div key={`empty-${index}`} data-slot="week-day-spacer" />;
        })}
      </div>

      <div data-slot="week-events" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {eventsForWeek.slice(0, 3).map((event, eventIndex) => {
          const eventStart = dayjs(event.start);
          const eventEnd = dayjs(event.end);
          const weekStart = dayjs(days[0]);
          const weekEnd = dayjs(days[6]);
          const actualStart = dayjs.max(eventStart, weekStart);
          const actualEnd = dayjs.min(eventEnd, weekEnd);
          const startColumn = days.findIndex((d) => d.isSame(actualStart, "day"));
          const eventSpan = actualEnd.diff(actualStart, "days") + 1;
          const endColumn = startColumn + eventSpan - 1;
          return (
            <div
              key={eventIndex}
              data-slot="event"
              data-event-id={event.id}
              data-color={event.color ?? undefined}
              style={{ gridColumn: `${startColumn + 1} / ${endColumn + 2}` }}
              onClick={(e) => {
                e.stopPropagation();
                void handleEventClick(event);
              }}
            >
              {event.title}
            </div>
          );
        })}
        {eventsForWeek.length > 3 && (
          <div data-slot="week-more" style={{ gridColumn: isMonthView ? "7" : "6 / 8" }}>
            +{eventsForWeek.length - 3} events this week
          </div>
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
