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

export function TaskModal({
  task,
  isOpen,
  onClose,
  className,
}: TaskModalProps) {
  if (!isOpen) return null;

  return (
    <div data-slot="task-modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title" className={className}>
      <div data-slot="task-modal-backdrop" onClick={onClose} aria-hidden />
      <div data-slot="task-modal-content">
        <div data-slot="task-modal-header">
          <h2 id="task-modal-title" data-slot="task-modal-title">Task Details</h2>
          <button type="button" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div data-slot="task-modal-body">
          <p data-slot="task-name">{task.name}</p>
          <p data-slot="task-start">Start: {dayjs(task.startDate).format("MMM D, YYYY")}</p>
          <p data-slot="task-end">End: {dayjs(task.endDate).format("MMM D, YYYY")}</p>
        </div>
        <div data-slot="task-modal-actions">
          <button type="button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
