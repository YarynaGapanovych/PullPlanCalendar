import { ProgressStatus } from "../types/task";

export const getTaskColorHex = (
  status?: ProgressStatus,
): string | undefined => {
  const colorMap: Record<ProgressStatus, string> = {
    [ProgressStatus.NOT_STARTED]: "#94a3b8", // gray
    [ProgressStatus.IN_PROGRESS]: "#3b82f6", // blue
    [ProgressStatus.COMPLETED]: "#10b981", // green
    [ProgressStatus.BLOCKED]: "#ef4444", // red
  };
  return status ? colorMap[status] : undefined;
};

export const DEFAULT_TASK_COLOR = "#b1724b";
export const EYE_ICON_COLOR = "#d18f60";
export const UNSCHEDULED_TASK_COLOR = "#237591";
