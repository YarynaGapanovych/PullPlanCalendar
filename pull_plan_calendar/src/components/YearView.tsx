"use client";

import dayjs, { type Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import type { CalendarEvent, CalendarViewMode } from "../types/calendar";
import type { Task } from "../types/task";
import "../utils/calendarHelpers";
import { getEventsForYear } from "../utils/calendarHelpers";
import type { CreateTaskModalProps } from "./tasks/CreateTaskModal";
import { CreateTaskModal } from "./tasks/CreateTaskModal";
import { Button } from "./ui/Button";
import { Title } from "./ui/Title";
import { Week } from "./Week";

export interface YearViewProps {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  setStartDate: (date: Dayjs) => void;
  setZoomLevel: (zoom: "year" | "week") => void;
  onEventClick?: (event: CalendarEvent) => Promise<void>;
  onDateClick?: (date: Dayjs, view: CalendarViewMode) => Promise<void>;
  readOnly?: boolean;
  updateTask?: (options?: {
    variables?: { data: Record<string, unknown> };
    onError?: (error: Error) => void;
  }) => Promise<unknown>;
  /** Optional: map event → task to show TaskModal (e.g. mapEventToTask). */
  mapFromEvent?: (event: CalendarEvent) => Task;
  /** Custom "add event" button; receives onClick. If not set, no add button is shown in year view. */
  AddEventButton?: React.ComponentType<{ onClick: () => void }>;
  /** Custom create-event modal. If not set, default CreateTaskModal is used. */
  CreateEventModal?: React.ComponentType<CreateTaskModalProps>;
  /** Content for the "previous year" nav button. Default: ← */
  previousYearButtonContent?: React.ReactNode;
  /** Content for the "next year" nav button. Default: → */
  nextYearButtonContent?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function YearView({
  events,
  setEvents,
  setStartDate,
  setZoomLevel,
  onEventClick,
  onDateClick,
  readOnly = false,
  updateTask = async () => {},
  mapFromEvent,
  AddEventButton,
  CreateEventModal,
  previousYearButtonContent = "←",
  nextYearButtonContent = "→",
  className,
  style,
}: YearViewProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(dayjs().year());

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

  const getEventsForWeekInYear = (week: Dayjs[]) =>
    getEventsForYear(week, events, currentYear);

  const handlePreviousYear = () => {
    setCurrentYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    setCurrentYear((prev) => prev + 1);
  };

  return (
    <div data-slot="year-view" className={className} style={style}>
      <div data-slot="year-view-nav">
        <Button
          type="button"
          onClick={handlePreviousYear}
          aria-label="Previous year"
        >
          {previousYearButtonContent}
        </Button>
        <Title level={4}>{currentYear}</Title>
        <Button type="button" onClick={handleNextYear} aria-label="Next year">
          {nextYearButtonContent}
        </Button>
        {!readOnly && AddEventButton && (
          <AddEventButton onClick={() => openModalWithDate(dayjs())} />
        )}
      </div>
      <div data-slot="year-view-months">
        {[...Array(12)].map((_, monthIndex) => (
          <div key={monthIndex} data-slot="year-month">
            <Title level={4}>
              {dayjs(`${currentYear}-${monthIndex + 1}-01`).format("MMMM")}
            </Title>
            <div data-slot="year-month-weekdays">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} data-slot="year-weekday">
                  {day}
                </div>
              ))}
            </div>
            <div data-slot="year-month-weeks">
              {calendarData
                .filter((week) =>
                  week.some((day) => day.month() === monthIndex),
                )
                .map((week, weekIndex) => (
                  <div key={weekIndex} data-slot="year-week">
                    <button
                      type="button"
                      data-slot="year-week-go"
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
                      events={getEventsForWeekInYear(week)}
                      onSelectDate={openModalWithDate}
                      currentMonth={monthIndex}
                      view="year"
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
        ))}
      </div>
      {CreateEventModal ? (
        <CreateEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      ) : (
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
