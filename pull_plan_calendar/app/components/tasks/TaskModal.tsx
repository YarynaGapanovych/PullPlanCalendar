"use client";

import dayjs from "dayjs";
import { Task } from "@/app/types/task";

export interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  updateTask: (options?: {
    variables?: { data: Record<string, unknown> };
    onError?: (error: Error) => void;
  }) => Promise<unknown>;
  onTaskUpdated: () => Promise<void>;
}

export function TaskModal({
  task,
  isOpen,
  onClose,
}: TaskModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-50 bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Task Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-gray-900">{task.name}</p>
          <p className="text-sm text-gray-600">
            Start: {dayjs(task.startDate).format("MMM D, YYYY")}
          </p>
          <p className="text-sm text-gray-600">
            End: {dayjs(task.endDate).format("MMM D, YYYY")}
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
