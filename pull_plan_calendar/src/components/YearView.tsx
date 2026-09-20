"use client";

import dayjs, { type Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import { useCreateEventSubmit } from "../hooks/useCreateEventSubmit";
import type {
  CalendarEvent,
  CalendarEventCreatePayload,
  CalendarViewMode,
} from "../types/calendar";
import type { Task } from "../types/task";
import {
  generateCalendarWeeks,
  getEventsForYear,
  getWeekdayLabels,
  type WeekStartsOn,
} from "../utils/calendarHelpers";
import type { CreateTaskModalProps } from "./tasks/CreateTaskModal";
import { CreateTaskModal } from "./tasks/CreateTaskModal";
import type { TaskModalProps } from "./tasks/TaskModal";
import { Button } from "./ui/Button";
import { Title } from "./ui/Title";
import { Tooltip } from "./ui/Tooltip";
import { Week } from "./Week";

export interface YearViewProps {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  setStartDate: (date: Dayjs) => void;
  setZoomLevel: (zoom: CalendarViewMode) => void;
  onEventClick?: (event: CalendarEvent) => Promise<void>;
  onDateClick?: (date: Dayjs, view: CalendarViewMode) => Promise<void>;
  onEventCreate?: (payload: CalendarEventCreatePayload) => Promise<void>;
  readOnly?: boolean;
  updateTask?: (options?: {
    variables?: { data: Record<string, unknown> };
    onError?: (error: Error) => void;
  }) => Promise<unknown>;
  mapFromEvent?: (event: CalendarEvent) => Task;
  AddEventButton?: React.ComponentType<{ onClick: () => void }>;
  CreateEventModal?: React.ComponentType<CreateTaskModalProps>;
  EventDetailModal?: React.ComponentType<TaskModalProps>;
  previousYearButtonContent?: React.ReactNode;
  nextYearButtonContent?: React.ReactNode;
  weekStartsOn?: WeekStartsOn;
  maxEventsPerDay?: number;
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
  onEventCreate,
  readOnly = false,
  updateTask = async () => {},
  mapFromEvent,
  AddEventButton,
  CreateEventModal,
  EventDetailModal,
  previousYearButtonContent = "←",
  nextYearButtonContent = "→",
  weekStartsOn = 0,
  maxEventsPerDay = 3,
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

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const handleCreateSubmit = useCreateEventSubmit(
    events,
    setEvents,
    onEventCreate,
    closeModal,
  );

  const calendarData = useMemo(
    () => generateCalendarWeeks(currentYear, weekStartsOn),
    [currentYear, weekStartsOn],
  );

  const weekdayLabels = useMemo(
    () => getWeekdayLabels(weekStartsOn),
    [weekStartsOn],
  );

  const getEventsForWeekInYear = (week: Dayjs[]) =>
    getEventsForYear(week, events, currentYear);

  const handlePreviousYear = () => {
    setCurrentYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    setCurrentYear((prev) => prev + 1);
  };

  const createInitialStart =
    selectedDate?.startOf("day") ?? dayjs().startOf("day");
  const createInitialEnd = createInitialStart.add(1, "day");

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
        {!readOnly &&
          (AddEventButton ? (
            <AddEventButton onClick={() => openModalWithDate(dayjs())} />
          ) : (
            <Tooltip title="Add new event">
              <Button
                type="button"
                onClick={() => openModalWithDate(dayjs())}
                aria-label="Add event"
              >
                +
              </Button>
            </Tooltip>
          ))}
      </div>
      <div data-slot="year-view-months">
        {[...Array(12)].map((_, monthIndex) => (
          <div key={monthIndex} data-slot="year-month">
            <Title level={4}>
              {dayjs(`${currentYear}-${monthIndex + 1}-01`).format("MMMM")}
            </Title>
            <div data-slot="year-month-weekdays">
              {weekdayLabels.map((day) => (
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
                      EventDetailModal={EventDetailModal}
                      weekStartsOn={weekStartsOn}
                      maxEventsPerDay={maxEventsPerDay}
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
          onClose={closeModal}
          onSubmit={handleCreateSubmit}
          initialStartDate={createInitialStart}
          initialEndDate={createInitialEnd}
        />
      ) : (
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleCreateSubmit}
          initialStartDate={createInitialStart}
          initialEndDate={createInitialEnd}
        />
      )}
    </div>
  );
}
