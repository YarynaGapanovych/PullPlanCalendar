import type { Dayjs } from "dayjs";

export enum ProgressStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  BLOCKED = "BLOCKED",
}

export enum UserRole {
  ADMIN = "ADMIN",
  WORKER = "WORKER",
  MANAGER = "MANAGER",
}

export interface Task {
  id: string;
  name: string;
  startDate?: string | Dayjs | null;
  endDate?: string | Dayjs | null;
  employees: Array<{ id: string; name?: string; [key: string]: unknown }>;
  progressStatus?: ProgressStatus;
  [key: string]: unknown;
}

export interface Area {
  id: string;
  name: string;
  [key: string]: unknown;
}
