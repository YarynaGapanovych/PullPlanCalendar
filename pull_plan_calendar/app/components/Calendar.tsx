"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { ProgressStatus, Task } from "@/app/types/task";
import { SegmentedControl } from "@/app/components/ui/SegmentedControl";
import { CalendarDaysIcon } from "@/app/components/ui/icons/CalendarDaysIcon";
import { CalendarOutlinedIcon } from "@/app/components/ui/icons/CalendarOutlined";
import { FieldTimeIcon } from "@/app/components/ui/icons/FieldTimeIcon";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import YearView from "./YearView";

interface CalendarProps {
  showSwitcher?: boolean;
  areaId: string;
}

// Mock data (replace with API when available)
const getMockScheduledTasks = (): Task[] => {
  const weekStart = dayjs().startOf("week");
  return [
    {
      id: "mock-1",
      name: "Scheduled task 1",
      startDate: weekStart.add(0, "day").format("YYYY-MM-DD"),
      endDate: weekStart.add(1, "day").format("YYYY-MM-DD"),
      employees: [{ id: "e1", name: "Alice" }],
      progressStatus: ProgressStatus.IN_PROGRESS,
    },
    {
      id: "mock-2",
      name: "Scheduled task 2",
      startDate: weekStart.add(2, "day").format("YYYY-MM-DD"),
      endDate: weekStart.add(3, "day").format("YYYY-MM-DD"),
      employees: [],
      progressStatus: ProgressStatus.NOT_STARTED,
    },
  ];
};

const getMockUnscheduledTasks = (): Task[] => [
  {
    id: "mock-3",
    name: "Unscheduled task A",
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
    employees: [],
    progressStatus: ProgressStatus.BLOCKED,
  },
  {
    id: "mock-4",
    name: "Unscheduled task B",
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
    employees: [],
    progressStatus: ProgressStatus.COMPLETED,
  },
];

const Calendar = ({ showSwitcher = true, areaId }: CalendarProps) => {
  const [zoomLevel, setZoomLevel] = useState<"year" | "month" | "week">("week");
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
        {showSwitcher && (
          <div className="flex justify-center md:justify-end">
            <SegmentedControl
              className="rounded-r-full rounded-l-full border border-gray-200 bg-gray-100 shadow-xs py-1 px-2"
              value={zoomLevel}
              options={[
                {
                  label: (
                    <span className="flex items-center gap-2">
                      <CalendarOutlinedIcon width={16} />
                      Weekly
                    </span>
                  ),
                  value: "week",
                },
                {
                  label: (
                    <span className="flex items-center gap-2">
                      <CalendarDaysIcon width={16} />
                      Monthly
                    </span>
                  ),
                  value: "month",
                },
                {
                  label: (
                    <span className="flex items-center gap-2">
                      <FieldTimeIcon width={16} />
                      Yearly
                    </span>
                  ),
                  value: "year",
                },
              ]}
              onChange={(value) => setZoomLevel(value)}
            />
          </div>
        )}

        {zoomLevelView[zoomLevel]}
      </div>
    </DndContext>
  );
};

export default Calendar;
