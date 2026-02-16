"use client";

import { Button } from "@/app/components/ui/Button";
import { Title } from "@/app/components/ui/Title";
import { Tooltip } from "@/app/components/ui/Tooltip";
import { ChevronLeftIcon } from "@/app/components/ui/icons/ChevronLeft";
import { ChevronRightIcon } from "@/app/components/ui/icons/ChevronRight";
import { EyeIcon } from "@/app/components/ui/icons/Eye";
import { PlusOutlinedIcon } from "@/app/components/ui/icons/PlusOutlined";
import { mockUpdateTask } from "@/app/mocks/tasks";
import { MOCK_USER } from "@/app/mocks/user";
import { ProgressStatus, Task, UserRole } from "@/app/types/task";
import { getTaskColorHex } from "@/app/utils/taskColors";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import CreateTaskModal from "./tasks/CreateTaskModal";
import { TaskModal } from "./tasks/TaskModal";

interface DayViewProps {
  startDate: dayjs.Dayjs;
  setStartDate: (date: dayjs.Dayjs) => void;
  scheduledTasks: Task[];
  unscheduledTasks: Task[];
  setScheduledTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setUnscheduledTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  areaId: string;
  onTaskUpdated: () => Promise<void>;
}

export default function DayView({
  startDate,
  setStartDate,
  scheduledTasks,
  unscheduledTasks,
  setScheduledTasks,
  setUnscheduledTasks,
  areaId,
  onTaskUpdated,
}: DayViewProps) {
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const openTask = () => setIsTaskOpen(true);
  const closeTask = () => setIsTaskOpen(false);
  const openCreateTask = () => setIsCreateTaskOpen(true);
  const closeCreateTask = () => setIsCreateTaskOpen(false);

  const isWorker = useMemo(() => {
    return MOCK_USER.roles?.some((r) => r.role?.name === UserRole.WORKER);
  }, []);

  const dayTitle = useMemo(
    () => startDate.format("dddd, MMM D, YYYY"),
    [startDate],
  );

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const HOUR_ROW_HEIGHT = 48;

  const tasksForDay = useMemo(() => {
    const dayStart = startDate.startOf("day");
    const dayEnd = startDate.endOf("day");
    return scheduledTasks.filter((task) => {
      const taskStart = dayjs(task.startDate).startOf("day");
      const taskEnd = dayjs(task.endDate).endOf("day");
      return (
        (taskStart.isSame(dayStart) || taskStart.isBefore(dayEnd)) &&
        (taskEnd.isSame(dayEnd) || taskEnd.isAfter(dayStart))
      );
    });
  }, [scheduledTasks, startDate]);

  const handleOpenTask = (task: Task) => {
    setSelectedTask({
      ...task,
      startDate: dayjs(task.startDate),
      endDate: dayjs(task.endDate),
    });
    openTask();
  };

  const handlePreviousDay = () => {
    setStartDate(startDate.subtract(1, "day"));
  };

  const handleNextDay = () => {
    setStartDate(startDate.add(1, "day"));
  };

  const handleUnassignedTaskDrop = (task: Task) => {
    const newStartDate = startDate.format("YYYY-MM-DD");
    const newEndDate = startDate.add(1, "days").format("YYYY-MM-DD");
    const updatedTask = {
      ...task,
      startDate: newStartDate,
      endDate: newEndDate,
    };
    setScheduledTasks((prev) => [...prev, updatedTask]);
    setUnscheduledTasks((prev) => prev.filter((t) => t.id !== task.id));
    mockUpdateTask({}).then(() => onTaskUpdated());
  };

  return (
    <>
      <div className="flex justify-between mt-4">
        <Button type="text" onClick={handlePreviousDay}>
          <ChevronLeftIcon />
        </Button>
        <Title level={4}>{dayTitle}</Title>
        <Button type="text" onClick={handleNextDay}>
          <ChevronRightIcon />
        </Button>
      </div>

      <div className="mt-4 rounded-xl bg-white ring-1 ring-gray-100 shadow-sm overflow-hidden">
        <div
          className="grid border-b border-gray-100"
          style={{
            gridTemplateColumns: "4rem 1fr",
            gridTemplateRows: `repeat(24, ${HOUR_ROW_HEIGHT}px)`,
          }}
        >
          {hours.map((hour) => (
            <div
              key={hour}
              className="border-t border-gray-100 pr-2 pt-0.5 text-right text-xs text-gray-500 font-medium"
              style={{ minHeight: HOUR_ROW_HEIGHT }}
            >
              {hour === 0
                ? "12 AM"
                : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                    ? "12 PM"
                    : `${hour - 12} PM`}
            </div>
          ))}
          <div
            className="col-start-2 row-start-1 border-l border-gray-100 p-4 overflow-auto"
            style={{
              gridRow: "1 / -1",
              minHeight: 24 * HOUR_ROW_HEIGHT,
            }}
          >
            <div className="space-y-2">
              {tasksForDay.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No tasks scheduled
                </p>
              ) : (
                tasksForDay.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg px-3 py-2 text-white flex items-center justify-between"
                    style={{
                      background:
                        getTaskColorHex(
                          task.progressStatus as ProgressStatus,
                        ) || "#b1724b",
                    }}
                  >
                    <span className="font-medium">{task.name}</span>
                    <Button
                      type="link"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleOpenTask(task);
                      }}
                    >
                      <EyeIcon className="text-white scale-75" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="unassigned-tasks-container mt-4 p-4 rounded-md">
        <div className="flex gap-4 items-center mb-2 md:mb-4">
          <h3 className="text-base md:text-lg font-semibold m-0">
            Unscheduled Tasks
          </h3>
          {!isWorker && (
            <Tooltip title="Add new task">
              <Button
                type="primary"
                size="small"
                shape="circle"
                onClick={openCreateTask}
              >
                <PlusOutlinedIcon className="scale-150" />
              </Button>
            </Tooltip>
          )}
        </div>
        <CreateTaskModal
          isOpen={isCreateTaskOpen}
          onClose={closeCreateTask}
          areaId={areaId}
        />
        <div className="flex flex-wrap gap-2">
          {unscheduledTasks.map((task) => (
            <div
              key={task.id}
              style={{
                background:
                  getTaskColorHex(task.progressStatus as ProgressStatus) ||
                  "#b1724b",
              }}
              className={`${!isWorker && "hover:opacity-90 cursor-pointer"} px-3 py-2 text-sm rounded-full text-white`}
              draggable={!isWorker}
              onDragEnd={() => {
                if (!isWorker) handleUnassignedTaskDrop(task);
              }}
              onDoubleClick={() => handleOpenTask(task)}
            >
              {task.name}
            </div>
          ))}
        </div>
        {unscheduledTasks.length > 0 && !isWorker && (
          <p className="text-xs text-gray-500 mt-2">
            Drag a task onto the day above to schedule it, or double-click to
            view.
          </p>
        )}
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={isTaskOpen}
          onClose={closeTask}
          updateTask={mockUpdateTask}
          onTaskUpdated={onTaskUpdated}
        />
      )}
    </>
  );
}
