import dayjs from "dayjs";
import { ProgressStatus, type Task } from "src";

export function getMockScheduledTasks(): Task[] {
  const weekStart = dayjs().startOf("week");
  const oneDay = weekStart.add(1, "day"); // e.g. Tuesday
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
    // Same day, different hours (for day view timeline) — local time YYYY-MM-DDTHH:mm
    {
      id: "mock-5",
      name: "Morning standup",
      startDate: oneDay.hour(9).minute(0).format("YYYY-MM-DDTHH:mm"),
      endDate: oneDay.hour(9).minute(30).format("YYYY-MM-DDTHH:mm"),
      employees: [],
      progressStatus: ProgressStatus.NOT_STARTED,
    },
    {
      id: "mock-6",
      name: "Design review",
      startDate: oneDay.hour(11).minute(0).format("YYYY-MM-DDTHH:mm"),
      endDate: oneDay.hour(12).minute(0).format("YYYY-MM-DDTHH:mm"),
      employees: [],
      progressStatus: ProgressStatus.IN_PROGRESS,
    },
    {
      id: "mock-7",
      name: "Lunch break",
      startDate: oneDay.hour(12).minute(30).format("YYYY-MM-DDTHH:mm"),
      endDate: oneDay.hour(13).minute(30).format("YYYY-MM-DDTHH:mm"),
      employees: [],
      progressStatus: ProgressStatus.NOT_STARTED,
    },
    {
      id: "mock-8",
      name: "Sprint planning",
      startDate: oneDay.hour(14).minute(0).format("YYYY-MM-DDTHH:mm"),
      endDate: oneDay.hour(16).minute(0).format("YYYY-MM-DDTHH:mm"),
      employees: [{ id: "e1", name: "Alice" }],
      progressStatus: ProgressStatus.NOT_STARTED,
    },
    {
      id: "mock-9",
      name: "Code review",
      startDate: oneDay.hour(16).minute(30).format("YYYY-MM-DDTHH:mm"),
      endDate: oneDay.hour(17).minute(0).format("YYYY-MM-DDTHH:mm"),
      employees: [],
      progressStatus: ProgressStatus.COMPLETED,
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
