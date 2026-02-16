import dayjs from "dayjs";
import { ProgressStatus, Task } from "@/app/types/task";

export function getMockScheduledTasks(): Task[] {
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
}

export function getMockUnscheduledTasks(): Task[] {
  return [
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
}

/** Mock update task function (no network call). Matches TaskModal updateTask signature. */
export async function mockUpdateTask(
  options?: {
    variables?: { data: Record<string, unknown> };
    onError?: (error: Error) => void;
  },
): Promise<void> {
  void options; // signature for TaskModal, not used in mock
  await new Promise((resolve) => setTimeout(resolve, 200));
}
