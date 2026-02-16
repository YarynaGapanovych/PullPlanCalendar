"use client";

import { Button } from "@/app/components/ui/Button";
import { Text } from "@/app/components/ui/Text";
import { Tooltip } from "@/app/components/ui/Tooltip";
import { PlusCircleIcon } from "@/app/components/ui/icons/PlusCircle";
import { MOCK_USER } from "@/app/mocks/user";
import { mockUpdateTask } from "@/app/mocks/tasks";
import { ProgressStatus, Task, UserRole } from "@/app/types/task";
import { getTaskColorHex } from "@/app/utils/taskColors";
import dayjs, { Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import { TaskModal } from "./tasks/TaskModal";

interface WeekProps {
  days: Dayjs[];
  tasks: Task[];
  onSelectDate: (date: Dayjs) => void;
  currentMonth: number;
  isMonthView?: boolean;
}

export function Week({
  days,
  tasks,
  onSelectDate,
  currentMonth,
  isMonthView,
}: WeekProps) {
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const openTask = () => setIsTaskOpen(true);
  const closeTask = () => setIsTaskOpen(false);

  const isWorker = useMemo(() => {
    return MOCK_USER.roles?.some((r) => r.role?.name === UserRole.WORKER);
  }, []);

  const tasksForWeek = tasks.filter((task) =>
    days.some((day) =>
      dayjs(day).isBetween(
        dayjs(task.startDate),
        dayjs(task.endDate),
        undefined,
        "[]",
      ),
    ),
  );

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    openTask();
  };

  return (
    <div
      className={`"space-y-2 relative group transition-transform duration-200 ${isMonthView ? "min-h-32" : "min-h-20"}`}
    >
      <div className="grid grid-cols-7 gap-1">
        {Array(days[0].day())
          .fill(null)
          .map((_, index) => (
            <div key={`empty-${index}`} className="min-h-[20px]" />
          ))}
        {days.map((day, index) => {
          const isCurrentMonth = day.month() === currentMonth;

          if (isCurrentMonth) {
            return (
              <div
                key={index}
                className={`relative cursor-pointer w-full ${isMonthView ? "h-6 gap-2" : "h-6 gap-1"} mx-0 p-1 border-gray-200 flex justify-center items-center group`}
              >
                <Text className="font-medium mb-1 text-center">
                  {day.format("D")}
                </Text>
                <Tooltip title="Add Task">
                  <Button
                    className={`${!isMonthView && "!absolute !-top-2 !-right-4"} !hidden group-hover:!block`}
                    type="link"
                    size="small"
                    shape="circle"
                    onClick={(e) => {
                      if (!isWorker) {
                        e.stopPropagation();
                        onSelectDate(day);
                      }
                    }}
                  >
                    <PlusCircleIcon className="text-[#d18f60]" width={18} />
                  </Button>
                </Tooltip>
              </div>
            );
          }
          return <div key={`empty-${index}`} className="min-h-[20px]" />;
        })}
      </div>

      <div
        className={`grid grid-cols-7 ${isMonthView ? "h-10 gap-2" : "h-6 gap-1"}`}
      >
        {tasksForWeek.slice(0, 3).map((task, taskIndex) => {
          const taskStart = dayjs(task.startDate);
          const taskEnd = dayjs(task.endDate);
          const weekStart = dayjs(days[0]);
          const weekEnd = dayjs(days[6]);
          const actualStart = dayjs.max(taskStart, weekStart);
          const actualEnd = dayjs.min(taskEnd, weekEnd);
          const startColumn = days.findIndex((d) =>
            d.isSame(actualStart, "day"),
          );
          const taskSpan = actualEnd.diff(actualStart, "days") + 1;
          const endColumn = startColumn + taskSpan - 1;
          return (
            <div
              key={taskIndex}
              style={{
                backgroundColor:
                  getTaskColorHex(task.progressStatus as ProgressStatus) ||
                  "#b1724b",
                gridColumn: `${startColumn + 1} / ${endColumn + 2}`,
              }}
              className={`text-white px-3 rounded-lg truncate cursor-pointer flex items-center ${isMonthView ? "h-5" : "h-4 text-xs"}`}
              onClick={(e) => {
                e.stopPropagation();
                handleTaskClick(task);
              }}
            >
              {task.name}
            </div>
          );
        })}
        {tasksForWeek.length > 3 && (
          <div
            className={`text-[#b1724b] w-fit ${!isMonthView && "text-sm"}`}
            style={{ gridColumn: isMonthView ? "7" : "6 / 8" }}
          >
            +{tasksForWeek.length - 3} task this week
          </div>
        )}
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={isTaskOpen}
          onClose={closeTask}
          updateTask={mockUpdateTask}
          onTaskUpdated={async () => {}}
        />
      )}
    </div>
  );
}
