"use client";

import dayjs from "dayjs";
import type { Task } from "../../types/task";

export interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  updateTask?: (options?: {
    variables?: { data: Record<string, unknown> };
    onError?: (error: Error) => void;
  }) => Promise<unknown>;
  onTaskUpdated?: () => Promise<void>;
  className?: string;
}

function formatTaskDate(value: Task["startDate"]): string | null {
  if (value == null || value === "") return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("MMM D, YYYY") : null;
}

export function TaskModal({
  task,
  isOpen,
  onClose,
  className,
}: TaskModalProps) {
  if (!isOpen) return null;

  const startLabel = formatTaskDate(task.startDate);
  const endLabel = formatTaskDate(task.endDate);

  return (
    <div data-slot="task-modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title" className={className}>
      <div data-slot="task-modal-backdrop" onClick={onClose} aria-hidden />
      <div data-slot="task-modal-content">
        <div data-slot="task-modal-header">
          <h2 id="task-modal-title" data-slot="task-modal-title">Event Details</h2>
          <button type="button" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div data-slot="task-modal-body">
          <p data-slot="task-name">{task.name}</p>
          {startLabel ? (
            <p data-slot="task-start">Start: {startLabel}</p>
          ) : null}
          {endLabel ? (
            <p data-slot="task-end">End: {endLabel}</p>
          ) : null}
        </div>
        <div data-slot="task-modal-actions">
          <button type="button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
