"use client";

import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useRef, useState } from "react";
import type { CalendarEvent, CalendarViewMode } from "../types/calendar";
import type { Task } from "../types/task";
import {
  getEventsForDay,
  getLeadingEmptyCount,
  type WeekStartsOn,
} from "../utils/calendarHelpers";
import {
  formatEventTimeLabel,
  getEventChipStyle,
} from "../utils/eventDisplay";
import type { TaskModalProps } from "./tasks/TaskModal";
import { TaskModal } from "./tasks/TaskModal";
import { Button } from "./ui/Button";
import { Text } from "./ui/Text";
import { Tooltip } from "./ui/Tooltip";

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
  mapFromEvent?: (event: CalendarEvent) => Task;
  EventDetailModal?: React.ComponentType<TaskModalProps>;
  weekStartsOn?: WeekStartsOn;
  maxEventsPerDay?: number;
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
  EventDetailModal,
  weekStartsOn = 0,
  maxEventsPerDay = 3,
}: WeekProps) {
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [moreDayKey, setMoreDayKey] = useState<string | null>(null);
  const morePopoverRef = useRef<HTMLDivElement>(null);

  const usePerDayLayout = view === "month" || view === "year" || isMonthView;

  useEffect(() => {
    if (!moreDayKey) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        morePopoverRef.current &&
        !morePopoverRef.current.contains(e.target as Node)
      ) {
        setMoreDayKey(null);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [moreDayKey]);

  const openTask = () => setIsTaskOpen(true);
  const closeTask = () => {
    setIsTaskOpen(false);
    setSelectedEvent(null);
  };

  const handleEventClick = async (event: CalendarEvent) => {
    setMoreDayKey(null);
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

  const detailTask = selectedEvent
    ? mapFromEvent
      ? mapFromEvent(selectedEvent)
      : {
          id: selectedEvent.id,
          name: selectedEvent.title,
          startDate: selectedEvent.start,
          endDate: selectedEvent.end,
          employees: [],
        }
    : null;

  const leadingEmpty = days.length
    ? getLeadingEmptyCount(days[0], weekStartsOn)
    : 0;

  const renderDayHeader = (day: Dayjs, index: number) => {
    const isCurrentMonth = day.month() === currentMonth;
    if (!isCurrentMonth) {
      return <div key={`empty-${index}`} data-slot="week-day-spacer" />;
    }
    return (
      <div
        key={index}
        data-slot="week-day"
        data-date={day.format("YYYY-MM-DD")}
      >
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
  };

  const renderPerDayCell = (day: Dayjs, index: number) => {
    const isCurrentMonth = day.month() === currentMonth;
    if (!isCurrentMonth) {
      return <div key={`empty-cell-${index}`} data-slot="week-day-spacer" />;
    }

    const dayKey = day.format("YYYY-MM-DD");
    const dayEvents = getEventsForDay(day, events);
    const visible = dayEvents.slice(0, maxEventsPerDay);
    const overflow = dayEvents.length - visible.length;
    const showMore = moreDayKey === dayKey;

    return (
      <div
        key={dayKey}
        data-slot="week-day-cell"
        data-date={dayKey}
        style={{ position: "relative", minWidth: 0 }}
      >
        <div data-slot="week-day">
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
        <div data-slot="week-day-events">
          {visible.map((event) => {
            const timeLabel = formatEventTimeLabel(event);
            return (
              <div
                key={event.id}
                data-slot="event"
                data-event-id={event.id}
                data-color={event.color ?? undefined}
                style={getEventChipStyle(event)}
                onClick={(e) => {
                  e.stopPropagation();
                  void handleEventClick(event);
                }}
              >
                {timeLabel ? (
                  <span data-slot="event-time">{timeLabel} </span>
                ) : null}
                {event.title}
              </div>
            );
          })}
          {overflow > 0 && (
            <div data-slot="day-more-wrap" ref={showMore ? morePopoverRef : undefined}>
              <button
                type="button"
                data-slot="day-more"
                aria-expanded={showMore}
                aria-label={`${overflow} more events`}
                onClick={(e) => {
                  e.stopPropagation();
                  setMoreDayKey(showMore ? null : dayKey);
                }}
              >
                +{overflow} more
              </button>
              {showMore && (
                <div data-slot="day-more-popover" role="listbox">
                  {dayEvents.slice(maxEventsPerDay).map((event) => {
                    const timeLabel = formatEventTimeLabel(event);
                    return (
                      <button
                        key={event.id}
                        type="button"
                        data-slot="day-more-item"
                        role="option"
                        style={getEventChipStyle(event)}
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleEventClick(event);
                        }}
                      >
                        {timeLabel ? (
                          <span data-slot="event-time">{timeLabel} </span>
                        ) : null}
                        {event.title}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  /** Legacy spanning layout (non month/year). Kept for any other Week consumers. */
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

  if (usePerDayLayout) {
    return (
      <div data-slot="week" data-month-view={isMonthView ? "true" : undefined}>
        <div
          data-slot="week-days"
          style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}
        >
          {Array.from({ length: leadingEmpty }).map((_, index) => (
            <div key={`lead-${index}`} data-slot="week-day-spacer" />
          ))}
          {days.map((day, index) => renderPerDayCell(day, index))}
        </div>

        {selectedEvent &&
          detailTask &&
          (EventDetailModal ? (
            <EventDetailModal
              task={detailTask}
              isOpen={isTaskOpen}
              onClose={closeTask}
              updateTask={updateTask}
            />
          ) : mapFromEvent ? (
            <TaskModal
              task={detailTask}
              isOpen={isTaskOpen}
              onClose={closeTask}
              updateTask={updateTask}
            />
          ) : null)}
      </div>
    );
  }

  return (
    <div data-slot="week" data-month-view={isMonthView ? "true" : undefined}>
      <div
        data-slot="week-days"
        style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}
      >
        {Array.from({ length: leadingEmpty }).map((_, index) => (
          <div key={`lead-${index}`} data-slot="week-day-spacer" />
        ))}
        {days.map((day, index) => renderDayHeader(day, index))}
      </div>

      <div
        data-slot="week-events"
        style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}
      >
        {eventsForWeek.slice(0, maxEventsPerDay).map((event, eventIndex) => {
          const eventStart = dayjs(event.start);
          const eventEnd = dayjs(event.end);
          const weekStart = dayjs(days[0]);
          const weekEnd = dayjs(days[days.length - 1]);
          const actualStart = dayjs.max(eventStart, weekStart);
          const actualEnd = dayjs.min(eventEnd, weekEnd);
          const startColumn = days.findIndex((d) =>
            d.isSame(actualStart, "day"),
          );
          if (startColumn < 0) return null;
          const eventSpan = Math.max(
            1,
            actualEnd.diff(actualStart, "days") + 1,
          );
          const endColumn = startColumn + eventSpan - 1;
          const timeLabel = formatEventTimeLabel(event);
          return (
            <div
              key={eventIndex}
              data-slot="event"
              data-event-id={event.id}
              data-color={event.color ?? undefined}
              style={{
                gridColumn: `${startColumn + 1} / ${endColumn + 2}`,
                ...getEventChipStyle(event),
              }}
              onClick={(e) => {
                e.stopPropagation();
                void handleEventClick(event);
              }}
            >
              {timeLabel ? (
                <span data-slot="event-time">{timeLabel} </span>
              ) : null}
              {event.title}
            </div>
          );
        })}
      </div>

      {selectedEvent &&
        detailTask &&
        (EventDetailModal ? (
          <EventDetailModal
            task={detailTask}
            isOpen={isTaskOpen}
            onClose={closeTask}
            updateTask={updateTask}
          />
        ) : mapFromEvent ? (
          <TaskModal
            task={detailTask}
            isOpen={isTaskOpen}
            onClose={closeTask}
            updateTask={updateTask}
          />
        ) : null)}
    </div>
  );
}
