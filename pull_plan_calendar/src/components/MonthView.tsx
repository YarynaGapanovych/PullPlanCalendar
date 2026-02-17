"use client";

import "../utils/calendarHelpers";
import { Button } from "./ui/Button";
import { Title } from "./ui/Title";
import dayjs, { type Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import type { CalendarEvent, CalendarViewMode } from "../types/calendar";
import type { Task } from "../types/task";
import { getEventsForWeek } from "../utils/calendarHelpers";
import { CreateTaskModal } from "./tasks/CreateTaskModal";
import { Week } from "./Week";

export interface MonthViewProps {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  setStartDate: (date: Dayjs) => void;
  setZoomLevel: (zoom: "year" | "week") => void;
  view: CalendarViewMode;
  onEventClick?: (event: CalendarEvent) => Promise<void>;
  onDateClick?: (date: Dayjs, view: CalendarViewMode) => Promise<void>;
  readOnly?: boolean;
  updateTask?: (options?: {
    variables?: { data: Record<string, unknown> };
    onError?: (error: Error) => void;
  }) => Promise<unknown>;
  /** Optional: map event → task to show TaskModal (e.g. mapEventToTask). */
  mapFromEvent?: (event: CalendarEvent) => Task;
  className?: string;
  style?: React.CSSProperties;
}

export default function MonthView({
  events,
  setEvents,
  setStartDate,
  setZoomLevel,
  view,
  onEventClick,
  onDateClick,
  readOnly = false,
  updateTask = async () => {},
  mapFromEvent,
  className,
  style,
}: MonthViewProps) {
  const [currentMonth, setCurrentMonth] = useState(dayjs().month());
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalWithDate = (date: Dayjs) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const generateCalendarData = () => {
    const year = dayjs().year();
    const startDate = dayjs(`${year}-01-01`);
    const weeks: Dayjs[][] = [];
    let currentWeek: Dayjs[] = [];
    let currentDate = startDate.clone();

    while (currentDate.year() === year) {
      currentWeek.push(currentDate.clone());
      if (currentDate.day() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentDate = currentDate.add(1, "day");
    }
    if (currentWeek.length) {
      weeks.push(currentWeek);
    }
    return weeks;
  };
  const calendarData = useMemo(() => generateCalendarData(), []);

  const getEventsForWeekInMonth = (week: Dayjs[]) =>
    getEventsForWeek(week, events);

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => (prev - 1 + 12) % 12);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev + 1) % 12);
  };

  return (
    <div data-slot="month-view" className={className} style={style}>
      <div data-slot="month-view-nav">
        <Button type="button" onClick={handlePreviousMonth} aria-label="Previous month">←</Button>
        <Title level={4}>{dayjs(`${dayjs().year()}-${currentMonth + 1}-01`).format("MMMM")}</Title>
        <Button type="button" onClick={handleNextMonth} aria-label="Next month">→</Button>
      </div>
      <div data-slot="month-view-body">
        <div data-slot="month-view-weekdays">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} data-slot="month-weekday">{day}</div>
          ))}
        </div>
        <div data-slot="month-view-weeks">
          {calendarData
            .filter((week) => week.some((day) => day.month() === currentMonth))
            .map((week, weekIndex) => (
              <div key={weekIndex} data-slot="month-week">
                <button
                  type="button"
                  data-slot="month-week-go-week"
                  onClick={() => {
                    setStartDate(week[0]);
                    setZoomLevel("week");
                    openModalWithDate(week[0]);
                  }}
                  aria-label="Go to week"
                >
                  →
                </button>
                <Week
                  days={week}
                  events={getEventsForWeekInMonth(week)}
                  onSelectDate={openModalWithDate}
                  currentMonth={currentMonth}
                  isMonthView
                  view={view}
                  readOnly={readOnly}
                  onEventClick={onEventClick}
                  onDateClick={onDateClick}
                  updateTask={updateTask}
                  mapFromEvent={mapFromEvent}
                />
              </div>
            ))}
        </div>
      </div>
      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
