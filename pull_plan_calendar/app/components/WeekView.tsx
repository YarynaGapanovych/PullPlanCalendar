"use client";

import { Button } from "@/app/components/ui/Button";
import { Title } from "@/app/components/ui/Title";
import { Tooltip } from "@/app/components/ui/Tooltip";
import { ChevronLeftIcon } from "@/app/components/ui/icons/ChevronLeft";
import { ChevronRightIcon } from "@/app/components/ui/icons/ChevronRight";
import { EyeIcon } from "@/app/components/ui/icons/Eye";
import { PlusOutlinedIcon } from "@/app/components/ui/icons/PlusOutlined";
import { MOCK_USER } from "@/app/mocks/user";
import { ProgressStatus, Task, UserRole } from "@/app/types/task";
import { getTaskColorHex } from "@/app/utils/taskColors";
import dayjs from "dayjs";
import { useCallback, useMemo, useRef, useState } from "react";
import { Responsive } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import CreateTaskModal from "./tasks/CreateTaskModal";
import { TaskModal } from "./tasks/TaskModal";

interface WeekViewProps {
  startDate: dayjs.Dayjs;
  setStartDate: (date: dayjs.Dayjs) => void;
  scheduledTasks: Task[];
  unscheduledTasks: Task[];
  setScheduledTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setUnscheduledTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  getWeekDaysWithDates: () => { dayIndex: number; date: string }[];
  areaId: string;
  onTaskUpdated: () => Promise<void>; // Add this line
}

const WeekView = ({
  startDate,
  scheduledTasks,
  unscheduledTasks,
  setScheduledTasks,
  setUnscheduledTasks,
  getWeekDaysWithDates,
  setStartDate,
  areaId,
  onTaskUpdated,
}: WeekViewProps) => {
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const openTask = () => setIsTaskOpen(true);
  const closeTask = () => setIsTaskOpen(false);
  const openCreateTask = () => setIsCreateTaskOpen(true);
  const closeCreateTask = () => setIsCreateTaskOpen(false);

  const mockUpdateTask = useCallback(
    (options?: {
      variables?: { data: Record<string, unknown> };
      onError?: (error: Error) => void;
    }) =>
      (async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (options?.onError && Math.random() < 0.05) {
          options.onError(new Error("Mock update failed"));
          return;
        }
        await onTaskUpdated();
      })(),
    [onTaskUpdated],
  );

  const handleOpenTask = (task: Task) => {
    setSelectedTask({
      ...task,
      startDate: dayjs(task.startDate),
      endDate: dayjs(task.endDate),
    });
    openTask();
  };

  const isWorker = useMemo(() => {
    return MOCK_USER.roles?.some((r) => r.role?.name === UserRole.WORKER);
  }, []);

  const getTaskGridData = useCallback(
    (task: Task) => {
      const taskStart = dayjs(task.startDate);
      const taskEnd = dayjs(task.endDate);
      const weekStart = startDate;
      const weekEnd = startDate.add(6, "days");
      const actualStart = taskStart.isBefore(weekStart) ? weekStart : taskStart;
      const actualEnd = taskEnd.isAfter(weekEnd) ? weekEnd : taskEnd;
      const startColumn = actualStart.diff(weekStart, "days");
      const taskSpan = actualEnd.diff(actualStart, "days") + 1;

      if (taskSpan <= 0) return null; // Ensure valid tasks only

      return {
        i: `task-${task.id}`,
        x: startColumn,
        y: 1,
        w: Math.min(taskSpan, 7 - startColumn),
        h: 1,
      };
    },
    [startDate],
  );

  const taskLayouts = useMemo(() => {
    return scheduledTasks
      .map(getTaskGridData)
      .filter(
        (taskGridData): taskGridData is Exclude<typeof taskGridData, null> =>
          taskGridData !== null,
      );
  }, [scheduledTasks, startDate, getTaskGridData]);

  const layouts = useMemo(() => {
    return {
      lg: [
        ...getWeekDaysWithDates().map(({ dayIndex }) => ({
          i: `day-${dayIndex}`,
          x: dayIndex,
          y: 0,
          w: 1,
          h: 1,
          static: true,
        })),
        ...taskLayouts,
      ],
    };
  }, [taskLayouts, getWeekDaysWithDates]);

  const weekTitle = useMemo(() => {
    const endDate = startDate.add(6, "days");
    return `${startDate.format("MMM D")} - ${endDate.format("MMM D, YYYY")}`;
  }, [startDate]);

  const executeUpdateTaskMutation = useCallback(
    async (
      taskId: string,
      newStartDate: dayjs.Dayjs,
      newEndDate: dayjs.Dayjs,
      onError?: () => void,
    ) => {
      try {
        await mockUpdateTask({
          variables: {
            data: {
              id: taskId,
              startDate: newStartDate.toDate(),
              endDate: newEndDate.toDate(),
            },
          },
          onError: (error) => {
            console.error("Failed to update task:", error);
            onError?.();
          },
        });
      } catch (error) {
        console.error("Error in executeUpdateTaskMutation:", error);
        onError?.();
        throw error;
      }
    },
    [mockUpdateTask],
  );

  const handleDrag = useCallback(
    (
      layout: any[],
      oldItem: any,
      newItem: any,
      placeholder: any,
      e: any,
      element: HTMLElement,
    ) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const taskRect = element.getBoundingClientRect();

      const leftEdge = containerRect.left;
      const rightEdge = containerRect.right;

      if (taskRect.left < leftEdge) {
        newItem.x = 6;
      }

      if (taskRect.right > rightEdge) {
        newItem.x = 0;
      }
    },
    [],
  );

  const handleDragStop = useCallback(
    (
      layout: { i: string; x: number; w: number }[],
      oldItem: any,
      newItem: any,
      placeholder: any,
      e: any,
      element: HTMLElement,
    ) => {
      // Store previous states for rollback
      const prevScheduledTasks = [...scheduledTasks];
      const prevUnscheduledTasks = [...unscheduledTasks];

      setUnscheduledTasks((prev) => {
        return prev.filter((task) => {
          const layoutItem = layout.find(
            (item) => item.i === `task-${task.id}`,
          );
          return task.id !== layoutItem?.i.split("-")[1];
        });
      });

      setScheduledTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (`task-${task.id}` !== newItem.i) return task;
          let newStartDate = startDate.clone().add(newItem.x, "days");
          const originalDuration = dayjs(task.endDate).diff(
            dayjs(task.startDate),
            "days",
          );
          if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const taskRect = element.getBoundingClientRect();

            const leftEdge = containerRect.left;
            const rightEdge = containerRect.right;

            if (taskRect.left < leftEdge) {
              newStartDate = newStartDate.subtract(
                originalDuration + 1,
                "days",
              );
              handlePreviousWeek();
            }

            // If task dragged past right edge
            if (taskRect.right > rightEdge) {
              newStartDate = newStartDate.add(originalDuration + 1, "days");
              handleNextWeek();
            }
          }

          const updatedTask = {
            ...task,
            startDate: newStartDate,
            endDate: newStartDate.add(originalDuration, "days"),
          };

          if (
            updatedTask.startDate.isSame(task.startDate, "day") &&
            updatedTask.endDate.isSame(task.endDate, "day")
          ) {
            return task;
          }

          executeUpdateTaskMutation(
            task.id,
            updatedTask.startDate,
            updatedTask.endDate,
            () => {
              // Restore previous states on error
              setScheduledTasks(prevScheduledTasks);
              setUnscheduledTasks(prevUnscheduledTasks);
            },
          );

          return updatedTask;
        }),
      );
    },
    [
      startDate,
      setScheduledTasks,
      setUnscheduledTasks,
      executeUpdateTaskMutation,
    ],
  );

  const handleResizeStop = (layout: { i: string; x: number; w: number }[]) => {
    // Store previous state for rollback
    const prevScheduledTasks = [...scheduledTasks];

    setScheduledTasks((prevTasks) =>
      prevTasks.map((task) => {
        const layoutItem = layout.find((item) => item.i === `task-${task.id}`);
        if (!layoutItem) return task;
        const newStartDate = startDate.clone().add(layoutItem.x, "days");
        const newEndDate = startDate
          .clone()
          .add(layoutItem.x + layoutItem.w - 1, "days");

        const updatedTask = {
          ...task,
          startDate: newStartDate,
          endDate: newEndDate,
        };

        executeUpdateTaskMutation(
          task.id,
          updatedTask.startDate,
          updatedTask.endDate,
          () => {
            // Restore previous state on error
            setScheduledTasks(prevScheduledTasks);
          },
        );

        return updatedTask;
      }),
    );
  };

  const handleUnassignedTaskDrop = (task: Task, dayIndex: number) => {
    // Store previous states for rollback
    const prevScheduledTasks = [...scheduledTasks];
    const prevUnscheduledTasks = [...unscheduledTasks];

    const newStartDate = startDate.clone().add(dayIndex, "days");
    const newEndDate = newStartDate.clone().add(1, "days");

    const updatedTask = {
      ...task,
      startDate: newStartDate.format("YYYY-MM-DD"),
      endDate: newStartDate.clone().add(1, "days").format("YYYY-MM-DD"),
    };

    setScheduledTasks((prevTasks) => [...prevTasks, updatedTask]);
    setUnscheduledTasks((prev) => prev.filter((item) => item.id !== task.id));

    executeUpdateTaskMutation(
      task.id,
      dayjs(updatedTask.startDate),
      dayjs(updatedTask.endDate),
      () => {
        // Restore previous states on error
        setScheduledTasks(prevScheduledTasks);
        setUnscheduledTasks(prevUnscheduledTasks);
      },
    );
  };

  const handlePreviousWeek = () => {
    const newDate = startDate.subtract(1, "week");
    setStartDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = startDate.add(1, "week");
    setStartDate(newDate);
  };

  return (
    <>
      <div className="flex justify-between mt-4">
        <Button type="text" onClick={handlePreviousWeek}>
          <ChevronLeftIcon />
        </Button>
        <Title level={4}>{weekTitle}</Title>
        <Button type="text" onClick={handleNextWeek}>
          <ChevronRightIcon />
        </Button>
      </div>

      <div className="calendar-container" ref={containerRef}>
        <Responsive
          className="layout"
          layouts={{ lg: layouts.lg }}
          cols={{ lg: 7, md: 7, sm: 7, xs: 7, xxs: 7 }}
          rowHeight={50}
          width={1200}
          isDraggable={!isWorker}
          isResizable={!isWorker}
          onDragStop={handleDragStop}
          onDrag={handleDrag}
          onResizeStop={handleResizeStop}
        >
          {getWeekDaysWithDates().map(({ dayIndex, date }) => {
            return (
              <div
                className={`flex flex-col items-center justify-center w-full px-3 py-2 rounded-2xl bg-white text-gray-700 ring-1 ring-gray-100 shadow-xs `}
                key={`day-${dayIndex}`}
                data-grid={{
                  i: `day-${dayIndex}`,
                  x: dayIndex,
                  y: 0,
                  w: 1,
                  h: 1.5,
                  static: true,
                }}
              >
                <span>{dayjs(date).format("ddd")}</span>
                <span className="text-lg font-semibold">
                  {dayjs(date).format("D")}
                </span>
              </div>
            );
          })}
          {scheduledTasks.map((task) => {
            const taskGridData = getTaskGridData(task);
            if (!taskGridData) return null;

            return (
              <div
                key={taskGridData.i}
                data-grid={taskGridData}
                className="rounded-lg px-2 text-white flex items-center relative justify-between"
                style={{
                  background:
                    getTaskColorHex(task.progressStatus as ProgressStatus) ||
                    "#b1724b",
                }}
              >
                {task.name}

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
            );
          })}
        </Responsive>
      </div>

      <div className="unassigned-tasks-container mt-4 p-4 rounded-md">
        <div className="flex gap-4 items-center mb-2 md:mb-4">
          <h3 className="text-base md:text-lg font-semibold !m-0">
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
        <div className="flex space-x-4">
          {unscheduledTasks.map((task) => (
            <div
              key={task.id}
              style={{
                background:
                  getTaskColorHex(task.progressStatus as ProgressStatus) ||
                  "#b1724b",
              }}
              className={`bg-[#237591] ${!isWorker && "hover:opacity-90 cursor-pointer"} px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm rounded-l-full rounded-r-full text-white`}
              draggable={!isWorker}
              onDragEnd={(e) => {
                // Get the drop position relative to the calendar container
                const calendar = document.querySelector(".calendar-container");
                if (calendar) {
                  const calendarRect = calendar.getBoundingClientRect();
                  const dropX = e.clientX - calendarRect.left;
                  // Calculate which column we're over (divide by column width)
                  const columnWidth = calendarRect.width / 7;
                  const columnIndex = Math.floor(dropX / columnWidth);
                  // Ensure the index is within bounds (0-6)
                  const boundedIndex = Math.max(0, Math.min(6, columnIndex));
                  handleUnassignedTaskDrop(task, boundedIndex);
                }
              }}
              onDoubleClick={() => handleOpenTask(task)}
            >
              {task.name}
            </div>
          ))}
        </div>
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
};

export default WeekView;
