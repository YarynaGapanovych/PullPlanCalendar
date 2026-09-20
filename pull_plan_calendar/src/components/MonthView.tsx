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
  getEventsForWeek,
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

export interface MonthViewProps {
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
  previousMonthButtonContent?: React.ReactNode;
  nextMonthButtonContent?: React.ReactNode;
  weekStartsOn?: WeekStartsOn;
  maxEventsPerDay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function MonthView({
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
  previousMonthButtonContent = "←",
  nextMonthButtonContent = "→",
  weekStartsOn = 0,
  maxEventsPerDay = 3,
  className,
  style,
}: MonthViewProps) {
  const [currentMonth, setCurrentMonth] = useState(dayjs().month());
  const [currentYear, setCurrentYear] = useState(dayjs().year());
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const getEventsForWeekInMonth = (week: Dayjs[]) =>
    getEventsForWeek(week, events);

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const createInitialStart =
    selectedDate?.startOf("day") ?? dayjs().startOf("day");
  const createInitialEnd = createInitialStart.add(1, "day");
  const monthTitle = dayjs(
    `${currentYear}-${currentMonth + 1}-01`,
  ).format("MMMM YYYY");

  return (
    <div data-slot="month-view" className={className} style={style}>
      <div data-slot="month-view-nav">
        <Button
          type="button"
          onClick={handlePreviousMonth}
          aria-label="Previous month"
        >
          {previousMonthButtonContent}
        </Button>
        <Title level={4}>{monthTitle}</Title>
        <Button type="button" onClick={handleNextMonth} aria-label="Next month">
          {nextMonthButtonContent}
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
      <div data-slot="month-view-body">
        <div data-slot="month-view-weekdays">
          {weekdayLabels.map((day) => (
            <div key={day} data-slot="month-weekday">
              {day}
            </div>
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
                  view="month"
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
