"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import {
  getMockScheduledTasks,
  getMockUnscheduledTasks,
} from "@/app/mocks/tasks";
import { CalendarViewMode } from "@/app/types/calendar";
import { Task } from "@/app/types/task";
import { SegmentedControl } from "@/app/components/ui/SegmentedControl";
import { CalendarDaysIcon } from "@/app/components/ui/icons/CalendarDaysIcon";
import { CalendarOutlinedIcon } from "@/app/components/ui/icons/CalendarOutlined";
import { FieldTimeIcon } from "@/app/components/ui/icons/FieldTimeIcon";
import DayView from "./DayView";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import YearView from "./YearView";

const ALL_VIEWS: CalendarViewMode[] = ["day", "week", "month", "year"];

const VIEW_OPTIONS: Record<
  CalendarViewMode,
  { label: string; icon: React.ReactNode }
> = {
  day: {
    label: "Daily",
    icon: <FieldTimeIcon width={16} />,
  },
  week: {
    label: "Weekly",
    icon: <CalendarOutlinedIcon width={16} />,
  },
  month: {
    label: "Monthly",
    icon: <CalendarDaysIcon width={16} />,
  },
  year: {
    label: "Yearly",
    icon: <FieldTimeIcon width={16} />,
  },
};

interface CalendarProps {
  showSwitcher?: boolean;
  areaId: string;
  /** Which view modes to show. Default: all. */
  views?: CalendarViewMode[];
}

const Calendar = ({
  showSwitcher = true,
  areaId,
  views = ALL_VIEWS,
}: CalendarProps) => {
  const [zoomLevel, setZoomLevel] = useState<CalendarViewMode>(() =>
    views.length > 0 ? views[0] : "week",
  );
  const effectiveZoom = views.includes(zoomLevel)
    ? zoomLevel
    : (views[0] ?? "week");

  const [scheduledTasks, setScheduledTasks] = useState<Task[]>(
    () => getMockScheduledTasks(),
  );
  const [unscheduledTasks, setUnscheduledTasks] = useState<Task[]>(
    () => getMockUnscheduledTasks(),
  );
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf("week"));

  const getWeekDaysWithDates = () => {
    return Array.from({ length: 7 }).map((_, index) => {
      const date = startDate.clone().add(index, "days");
      return { dayIndex: index, date: date.format("YYYY-MM-DD") };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const draggedTask = scheduledTasks.find((task) => task.id === active.id);
    if (draggedTask) {
      const dropDateIndex = over.data.current?.index;
      if (dropDateIndex === undefined) return;

      const newStartDate = startDate.clone().add(dropDateIndex, "days");
      const newEndDate = newStartDate.clone().add(1, "days");

      // Update UI state (mock: no API call)
      setScheduledTasks((prevTasks) => [
        ...prevTasks.filter((task) => task.id !== draggedTask.id),
        {
          ...draggedTask,
          startDate: dayjs(newStartDate.format("YYYY-MM-DD")),
          endDate: dayjs(newEndDate.format("YYYY-MM-DD")),
        },
      ]);

      setUnscheduledTasks((prev) =>
        prev.filter((task) => task.id !== draggedTask.id),
      );
    }
  };

  const zoomLevelView = {
    day: (
      <DayView
        startDate={startDate.startOf("day")}
        setStartDate={setStartDate}
        scheduledTasks={scheduledTasks}
        unscheduledTasks={unscheduledTasks}
        setScheduledTasks={setScheduledTasks}
        setUnscheduledTasks={setUnscheduledTasks}
        areaId={areaId}
        onTaskUpdated={async () => {}}
      />
    ),
    week: (
      <WeekView
        startDate={startDate}
        setStartDate={setStartDate}
        scheduledTasks={scheduledTasks}
        unscheduledTasks={unscheduledTasks}
        setScheduledTasks={setScheduledTasks}
        setUnscheduledTasks={setUnscheduledTasks}
        getWeekDaysWithDates={getWeekDaysWithDates}
        areaId={areaId}
        onTaskUpdated={async () => {
          // Mock: no refetch; state is already local
        }}
      />
    ),
    month: (
      <MonthView
        setStartDate={setStartDate}
        tasks={scheduledTasks}
        setTasks={setScheduledTasks}
        setZoomLevel={setZoomLevel}
      />
    ),
    year: (
      <YearView
        setStartDate={setStartDate}
        tasks={scheduledTasks}
        setTasks={setScheduledTasks}
        setZoomLevel={setZoomLevel}
      />
    ),
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col">
        {showSwitcher && views.length > 0 && (
          <div className="flex justify-center md:justify-end">
            <SegmentedControl
              className="rounded-r-full rounded-l-full border border-gray-200 bg-gray-100 shadow-xs py-1 px-2"
              value={effectiveZoom}
              options={views.map((view) => ({
                label: (
                  <span className="flex items-center gap-2">
                    {VIEW_OPTIONS[view].icon}
                    {VIEW_OPTIONS[view].label}
                  </span>
                ),
                value: view,
              }))}
              onChange={(value) => setZoomLevel(value)}
            />
          </div>
        )}

        {zoomLevelView[effectiveZoom]}
      </div>
    </DndContext>
  );
};

export default Calendar;
